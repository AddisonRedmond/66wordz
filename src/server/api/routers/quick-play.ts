import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";
import { GameType } from "@prisma/client";
import {
  createNewSurivivalLobby,
  joinSurivivalLobby,
} from "~/utils/survival/surivival";
import {
  isPremiumUser,
  hasBeen24Hours,
  hasMoreFreeGames,
} from "~/utils/game-limit";
import {
  createNewEliminationLobby,
  joinEliminationLobby,
} from "~/utils/elimination";
import { initAdmin } from "~/utils/firebase-admin";

export const quickPlayRouter = createTRPCRouter({
  quickPlay: protectedProcedure
    .input(z.object({ gameMode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // check if player has reached the max number of games for the day
      const gameMode = input.gameMode as GameType;

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });
      // check if user is premium user, if they are, proceed
      if (isPremiumUser(user!) === false) {
        if (hasBeen24Hours(user!)) {
          // reset the timestamp to today at 12:00am and reset the free game count to 1
          await ctx.db.user.update({
            where: { id: ctx.session.userId },
            data: {
              freeGameTimeStamp: new Date().setHours(0, 0, 0, 0) / 1000,
              freeGameCount: 0,
            },
          });
        } else if (hasMoreFreeGames(user!) === false) {
          return "User has reached the maximum number of free games for the day";
        }
      }

      // check if player is already part of a game

      const clientGameType = input.gameMode as GameType;

      const rejoin: {
        userId: string;
        lobbyId: string;
      } | null = await ctx.db.players.findUnique({
        where: {
          userId: ctx.session.userId,
        },
      });

      if (rejoin) {
        return await ctx.db.lobby.findUnique({
          where: {
            id: rejoin.lobbyId,
          },
        });
      }

      const findLobby = async () => {
        const lobby: { id: string; started: boolean }[] = await ctx.db
          .$queryRaw`
          SELECT l.id, l.started, l."gameType"
          FROM "Lobby" l
          WHERE (
            SELECT COUNT(*) FROM "Players" p WHERE p."lobbyId" = l.id
          ) < 67
          AND l.started = false
          AND l."gameType" = ${gameMode}::"GameType"
          LIMIT 1;
         `;
        return lobby[0];
      };

      const db = initAdmin().database();

      const createNewLobby = async () => {
        // create the new lobby in the database
        const clientGameType = input.gameMode as GameType;
        const newLobby: { id: string } = await ctx.db.lobby.create({
          data: {
            gameType: clientGameType,
          },
        });
        //   create the new lobby in firebase realtime db

        switch (clientGameType) {
          case "SURVIVAL":
            // TODO: add logic to function to make sure a lobby is created successfully, before registering it
            const lobbyData = createNewSurivivalLobby();
            db.ref(`/${gameMode}`).child(newLobby.id).set(lobbyData);
            try {
              fetch(
                `${env.BOT_SERVER}/register_${gameMode.toLowerCase()}_lobby`,
                {
                  method: "POST",
                  body: JSON.stringify({ lobbyId: newLobby.id }),
                },
              );
            } catch (e) {}
            break;

          case "ELIMINATION":
            const eliminationLobbyData = createNewEliminationLobby();
            db.ref(`/${gameMode}`)
              .child(newLobby.id)
              .set({ lobbyData: eliminationLobbyData.lobbyData });
            try {
              fetch(
                `${env.BOT_SERVER}/register_${gameMode.toLowerCase()}_lobby`,
                {
                  method: "POST",
                  body: JSON.stringify({ lobbyId: newLobby.id }),
                },
              );
            } catch (e) {}
        }

        return newLobby;
      };

      const joinLobby = async (lobbyId: string) => {
        // lobby is actually coming from player, should be named player lobby
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.userId },
        });
        if (!user) {
          return;
        }
        const player: { userId: string; lobbyId: string } =
          await ctx.db.players.create({
            data: {
              userId: user?.id,
              lobbyId: lobbyId,
            },
          });

        switch (clientGameType) {
          case "SURVIVAL":
            const newSurvivalPlayer = joinSurivivalLobby(user.id, user?.name);
            db.ref(`/${gameMode}/${lobbyId}/players`).update(newSurvivalPlayer);
            break;
          case "ELIMINATION":
            const newPlayer = joinEliminationLobby(user.id, user?.name);
            db.ref(`/${gameMode}/${lobbyId}/players`).update(newPlayer);
            break;
        }

        const playerCount = await ctx.db.players.count({
          where: {
            lobbyId: player.lobbyId,
          },
        });

        if (playerCount >= 67) {
          // startGame(player.lobbyId, clientGameType);
          await ctx.db.lobby.update({
            where: {
              id: player.lobbyId,
            },
            data: {
              started: true,
            },
          });
        }
        return await ctx.db.lobby.findUnique({
          where: {
            id: player.lobbyId,
          },
        });
      };

      return findLobby()
        .then(async (lobby) => {
          if (lobby) {
            return joinLobby(lobby.id);
          } else {
            const newLobby = await createNewLobby();
            return await joinLobby(newLobby.id);
          }
        })
        .catch((error) => {
          console.error("Error finding lobby:", error);
        });

      // if there is one already add the user template to the firebase lobby

      // if there is NOT create a new row in the DB and add the user to template to the firebase lobby
    }),

  lobbyCleanUp: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.userId;
    const { lobbyId } = await ctx.db.players.delete({
      where: { userId: user },
    });
    const lobby = await ctx.db.lobby.findUnique({
      where: { id: lobbyId },
    });

    const playerCount = await ctx.db.players.count({
      where: {
        lobbyId: lobbyId,
      },
    });

    const db = initAdmin().database();

    if (playerCount <= 0) {
      await ctx.db.lobby.delete({ where: { id: lobbyId } });
      db.ref(`${lobby?.gameType}/${lobbyId}`).remove();
    } else if (lobby?.name && lobby.started === false) {
      db.ref(`${lobby.gameType}/${lobby.id}/players/${user}`).remove();

      const lobbyData = await db
        .ref(`${lobby.gameType}/${lobby.id}`)
        .once("value");

      if (lobbyData.val().lobbyData.owner === user) {
        const playerIds = Object.keys(lobbyData.val().players).filter(
          (id) => id !== user,
        );

        await db.ref(`${lobby.gameType}/${lobby.id}/lobbyData/`).update({
          owner: playerIds[0],
        });
      }
      return;
    }
  }),
});

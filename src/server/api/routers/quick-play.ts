import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GameType } from "@prisma/client";
import { createNewSurivivalLobby, joinSurivivalLobby } from "~/utils/surivival";

import {
  createNewEliminationLobby,
  joinEliminationLobby,
} from "~/utils/elimination";
import { initAdmin } from "~/utils/firebase-admin";
import { registerLobbyWithServer } from "~/utils/game";
import { createNewRaceLobby, joinRaceLobby } from "~/utils/race";
import { z } from "zod";

export const quickPlayRouter = createTRPCRouter({
  quickPlay: protectedProcedure
    .input(z.object({ gameMode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gameMode = input.gameMode as GameType;

      // check if user is already in a lobby
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

      // try to find a lobby of the specified gameType that has less than 67 real players and that hasn't started
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

      // create lobby in postgres and fb realtime db, and registers the lobby with function
      // that runs the lobby
      const createNewLobby = async () => {
        const clientGameType = input.gameMode as GameType;
        const newLobby: { id: string } = await ctx.db.lobby.create({
          data: {
            gameType: clientGameType,
          },
        });
        //   create the new lobby in firebase realtime db

        let lobbyData;
        switch (clientGameType) {
          case "SURVIVAL":
            lobbyData = createNewSurivivalLobby();
            break;
          case "ELIMINATION":
            lobbyData = createNewEliminationLobby();
            break;
          case "RACE":
            lobbyData = createNewRaceLobby();
            break;
        }
        return db
          .ref(`/${gameMode}`)
          .child(newLobby.id)
          .set({ lobbyData })
          .then(() => {
            registerLobbyWithServer(gameMode, newLobby.id);
            return newLobby.id;
          })
          .catch((error: Error) => {
            //TODO: do something with the error
            console.log(error);
          });
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

        let newPlayer;
        switch (gameMode) {
          case "SURVIVAL":
            newPlayer = joinSurivivalLobby(user.id, user?.name);
            break;
          case "ELIMINATION":
            newPlayer = joinEliminationLobby(user.id, user?.name);
            break;
          case "RACE":
            newPlayer = joinRaceLobby(user.id, user?.name);
            break;
        }
        if (!newPlayer) {
          return;
        }
        db.ref(`/${gameMode}/${lobbyId}/players`)
          .update({ ...newPlayer })
          .then(async () => {
            const playerCount = await ctx.db.players.count({
              where: {
                lobbyId: player.lobbyId,
              },
            });

            if (playerCount >= 67) {
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
          });
      };

      return findLobby()
        .then(async (lobby) => {
          if (lobby) {
            return joinLobby(lobby.id);
          } else {
            const newLobby = await createNewLobby();
            if (newLobby) {
              return await joinLobby(newLobby);
            }
          }
        })
        .catch((error) => {
          console.error("Error finding lobby:", error);
        });
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

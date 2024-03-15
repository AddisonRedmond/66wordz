import { deleteLobby, db, startGame } from "~/utils/firebase/firebase";
import { ref, get, remove, update } from "firebase/database";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";
import { GameType } from "@prisma/client";
import {
  createNewSurivivalLobby,
  joinSurivivalLobby,
} from "~/utils/survival/surivival";
export const publicGameRouter = createTRPCRouter({
  joinPublicGame: protectedProcedure
    .input(z.object({ gameMode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // check if player is already part of a game
      const clientGameType = input.gameMode as GameType;
      const rejoin: {
        userId: string;
        lobbyId: string;
      } | null = await ctx.db.players.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (rejoin) {
        return await ctx.db.lobby.findUnique({
          where: {
            id: rejoin.lobbyId,
          },
        });
      }

      // check data base for a lobby that has < 67 players and hasn't started yet

      const findLobby = async () => {
        const lobby: { id: string; started: boolean }[] = await ctx.db
          .$queryRaw`
        SELECT l.id, l.started, l.gameType
        FROM Lobby l
        WHERE (
            SELECT COUNT(*) FROM Players p WHERE p.lobbyId = l.id
        ) < 67
        AND l.started = false
        AND l.gameType = ${clientGameType}
        LIMIT 1;
         `;
        return lobby[0];
      };

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
            await createNewSurivivalLobby(newLobby.id);
            try {
              fetch(`${env.BOT_SERVER}/register_survival_lobby`, {
                method: "POST",
                body: JSON.stringify({ lobbyId: newLobby.id }),
              });
            } catch (e) {
              console.log(e);
            }
        }

        return newLobby;
      };

      const joinLobby = async (lobbyId: string) => {
        // lobby is actually coming from player, should be named player lobby
        const userId = ctx.session.user.id;
        const player: { userId: string; lobbyId: string } =
          await ctx.db.players.create({
            data: {
              userId: userId,
              lobbyId: lobbyId,
            },
          });

        switch (clientGameType) {
          case "SURVIVAL":
            joinSurivivalLobby(
              player.lobbyId,
              userId,
              ctx.session.user.name ?? "N/A",
            );
        }

        const playerCount = await ctx.db.players.count({
          where: {
            lobbyId: player.lobbyId,
          },
        });

        if (playerCount >= 67) {
          startGame(player.lobbyId, clientGameType);
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

  endGame: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user.id;
    const lobbyId = await ctx.db.players.delete({
      where: { userId: user },
    });
    const playerCount = await ctx.db.players.count({
      where: {
        lobbyId: lobbyId.lobbyId,
      },
    });

    return playerCount;
  }),
  manualStart: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.lobby.update({
        where: {
          id: input,
        },
        data: {
          started: true,
        },
      });
    }),

  lobbyCleanUp: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user.id;
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

    if (playerCount === 0) {
      await ctx.db.lobby.delete({ where: { id: lobbyId } });
      deleteLobby(lobby!.gameType, lobbyId);
    } else if (lobby?.name && lobby.started === false) {
      remove(ref(db, `SURVIVAL/${lobby.id}/players/${user}`));

      const lobbyData = await get(ref(db, `SURVIVAL/${lobby.id}`));

      if (lobbyData.val().lobbyData.owner === user) {
        const playerIds = Object.keys(lobbyData.val().players).filter(
          (id) => id !== user,
        );

        await update(ref(db, `SURVIVAL/${lobby.id}/lobbyData/`), {
          owner: playerIds[0],
        });
      }
      return;
    }
  }),
});

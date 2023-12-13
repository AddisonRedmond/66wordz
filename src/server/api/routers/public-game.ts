import {
  createNewEliminationLobby,
  createNewMarathonLobby,
  deleteLobby,
  joinEliminationLobby,
  joinFirebaseLobby,
  lobbyCleanUp,
  startGame,
} from "~/utils/firebase/firebase";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { handleGetNewWord } from "~/utils/game";
import { env } from "~/env.mjs";
export const publicGameRouter = createTRPCRouter({
  joinPublicGame: protectedProcedure
    .input(z.object({ gameMode: z.string(), isSolo: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // check if player is already part of a game
      const clientGameType = input.gameMode;
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
      AND l.gameType = ${input}
      LIMIT 1;
      `;
        return lobby[0];
      };

      const createNewLobby = async () => {
        // create the new lobby in the database
        const newLobby: { id: string } = await ctx.db.lobby.create({
          data: { gameType: clientGameType, started: input.isSolo },
        });
        //   create the new lobby in firebase realtime db
        if (clientGameType === "ELIMINATION") {
          await createNewEliminationLobby(clientGameType, newLobby.id, {
            gameStarted: false,
            initilizedTimeStamp: new Date(),
            round: 1,
            word: handleGetNewWord(),
            gameStartTimer: new Date().getTime() + 60000,
            roundTimer: new Date().getTime() + 240000,
            pointsGoal: 300,
          });
          try {
            fetch(`${env.BOT_SERVER}/register_elimination_lobby`, {
              method: "POST",
              body: JSON.stringify({ lobbyId: newLobby.id }),
            });
          } catch (e) {}

          // register lobby with server
        } else if (clientGameType === "MARATHON") {
          await createNewMarathonLobby(clientGameType, newLobby.id, {
            gameStarted: false,
            initilizedTimeStamp: new Date(),
            gameStartTimer:
              new Date().getTime() + (input.isSolo ? 5000 : 60000),
          });
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

        if (clientGameType === "MARATHON") {
          joinFirebaseLobby(
            player.lobbyId,
            userId,
            clientGameType,
            0,
            handleGetNewWord(),
          );
        } else if (clientGameType === "ELIMINATION") {
          joinEliminationLobby(
            `${clientGameType}/${player.lobbyId}/playerPoints/${userId}`,
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
    } else {
      await lobbyCleanUp(lobby!.gameType, lobbyId, user);
    }
  }),
});

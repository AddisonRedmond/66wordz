import {
  createNewFirebaseLobby,
  joinFirebaseLobby,
  startGame,
} from "~/utils/firebase/firebase";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const eliminationRouter = createTRPCRouter({
  joinEliminationGame: protectedProcedure.mutation(async ({ ctx }) => {
    // check if player is already part of a game

    const rejoin: {
      userId: string;
      lobbyId: string;
      gameTypeMismatch?: boolean;
    } | null = await ctx.db.players.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const lobby = await ctx.db.lobby.findUnique({
      where: {
        id: rejoin?.lobbyId,
      },
    });

    if (lobby?.gameType === "MARATHON") {
      return { ...rejoin, gameTypeMismatch: true };
    } else if (rejoin) {
      return rejoin;
    }

    // check data base for a lobby that has < 50 players and hasn't started yet

    const findLobby = async () => {
      const lobby: { id: string; started: boolean }[] = await ctx.db.$queryRaw`
      SELECT l.id, l.started, l.gameType
      FROM Lobby l
      WHERE (
        SELECT COUNT(*) FROM Players p WHERE p.lobbyId = l.id
      ) < 66
      AND l.started = false
      AND l.gameType = 'ELIMINATION'
      LIMIT 1;
  `;

      console.log(lobby[0]);

      return lobby[0];
    };

    const createNewLobby = async () => {
      // create the new lobby in the database
      const newLobby: { id: string } = await ctx.db.lobby.create({
        data: { gameType: "ELIMINATION" },
      });

      //   create the new lobby in firebase realtime db
      await createNewFirebaseLobby(newLobby.id);
      return newLobby;
    };

    const joinLobby = async (lobbyId: string) => {
      // lobby is actually coming from player, should be named player lobby
      const lobby: { userId: string; lobbyId: string } =
        await ctx.db.players.create({
          data: {
            userId: ctx.session.user.id,
            lobbyId: lobbyId,
          },
        });

      joinFirebaseLobby(lobby.lobbyId, ctx.session.user.id);

      const playerCount = await ctx.db.players.count({
        where: {
          lobbyId: lobby.lobbyId,
        },
      });

      if (playerCount >= 66) {
        startGame(lobby.lobbyId);
        await ctx.db.lobby.update({
          where: {
            id: lobby.lobbyId,
          },
          data: {
            started: true,
          },
        });
      }
      return lobby;
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
});

import { z } from "zod";
import {
  createNewFirebaseLobby,
  joinFirebaseLobby,
} from "~/utils/firebase/firebase";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const publicGameRouter = createTRPCRouter({
  joinPublicGame: protectedProcedure.mutation(async ({ ctx }) => {
    // check if player is already part of a game

    const rejoin = await ctx.db.players.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (rejoin) {
      return rejoin;
    }

    // check data base for a lobby that has < 50 players and hasn't started yet

    const findLobby = async () => {
      const lobby: { id: string; started: boolean }[] = await ctx.db.$queryRaw`
        SELECT l.*
        FROM Lobby l
        WHERE (
         SELECT COUNT(*) FROM Players p WHERE p.lobbyId = l.id 
        )   < 50
        AND l.started = false
        LIMIT 1;
        `;

      return lobby[0];
    };

    const createNewLobby = async () => {
      // create the new lobby in the database
      const newLobby = await ctx.db.lobby.create({ data: {} });

      //   create the new lobby in firebase realtime db
      createNewFirebaseLobby(newLobby.id);
      return newLobby;
    };

    const joinLobby = async (lobbyId: string) => {
      const lobby = await ctx.db.players.create({
        data: {
          userId: ctx.session.user.id,
          lobbyId: lobbyId,
        },
      });

      joinFirebaseLobby(lobby.lobbyId, ctx.session.user.id, "GUESS");

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
});

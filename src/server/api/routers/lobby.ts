import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { initAdmin } from "~/utils/firebase-admin";

export const lobbyRouter = createTRPCRouter({
  getLobby: protectedProcedure.query(async ({ ctx }) => {
    const existingGame = await ctx.db.players.findUnique({
      where: { userId: ctx.auth.userId as string },
    });
    const db = initAdmin().database();

    if (existingGame) {
      const lobby = await ctx.db.lobby.findUnique({
        where: { id: existingGame?.lobbyId },
      });

      const firebaseLobbyReady = (
        await db
          .ref(`${lobby?.gameType}/${lobby?.id}`)
          .child("lobbyData")
          .once("value")
      ).exists();
      if (firebaseLobbyReady) {
        return lobby;
      } else {
        await ctx.db.lobby.delete({ where: { id: lobby?.id } });
      }
    }

    // todo: handle logic for game existing in db, but not in firebase
    return null;
  }),
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { calculatePoints } from "~/utils/elimination";
import { handleCorrectGuess, startGame } from "~/utils/firebase/firebase";
import { handleGetNewWord } from "~/utils/game";

export const eliminationRouter = createTRPCRouter({
  handleCorrectGuess: protectedProcedure
    .input(
      z.object({
        gamePath: z.string(),
        guessCount: z.number(),
        points: z.number(),
        lobbyId: z.string(),
        roundNumber: z.number(),
        previousWord: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const POINTS_TARGET = 500;
      const userId = ctx.session.user.id;
      const calculatedPoints = calculatePoints(input.guessCount, input.points);
      // let playerInfo: Players | null = null;

      // const lobbyCount = await ctx.db.players.count({
      //   where: { lobbyId: input.lobbyId },
      // });

      await handleCorrectGuess(
        `ELIMINATION/${input.lobbyId}`,
        handleGetNewWord(),
        calculatedPoints,
        userId,
        input.previousWord,
      );
    }),

  startGame: protectedProcedure
    .input(
      z.object({
        lobbyId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      startGame(input.lobbyId, "ELIMINATION");
    }),
});

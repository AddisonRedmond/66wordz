import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const survivalRouter = createTRPCRouter({
  handleCorrectGuess: protectedProcedure
    .input(
      z.object({
        autoAttack: z.enum(["first", "last", "random", "off"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {}),
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const getUserRouter = createTRPCRouter({

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId as string;
    const userData = await ctx.db.user.findUnique({ where: { id: userId } });

    return userData;
  }),

  incrementFreeGameCount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.userId as string;
    await ctx.db.user.update({
      where: { id: userId },
      data: { freeGameCount: { increment: 1 } },
    });
    return true;
  }),
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const getUserRouter = createTRPCRouter({
  isPremiumUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    const userData = await ctx.db.user.findUnique({
      where: { id: userId },
    });

    if (!userData?.currentPeriodEnd) {
      return { isPremiumUser: false };
    }

    return {
      isPremiumUser: userData.currentPeriodEnd > Date.now() / 1000,
    };
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    const userData = await ctx.db.user.findUnique({ where: { id: userId } });

    return userData;
  }),

  incrementFreeGameCount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.userId;
    await ctx.db.user.update({
      where: { id: userId },
      data: { freeGameCount: { increment: 1 } },
    });
    return true;
  }),
});

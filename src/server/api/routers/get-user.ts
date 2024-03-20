import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const getUserRouter = createTRPCRouter({
  isPremiumUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userData: any = await ctx.db.user.findUnique({
      where: { id: userId },
    });

    if (userData.currentPeriodEnd === null)
      return { isPremiumUser: false };

    return {
      isPremiumUser:
      userData.currentPeriodEnd > Date.now() / 1000,
    };
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userData = await ctx.db.user.findUnique({ where: { id: userId } });

    return userData;
  }),
});

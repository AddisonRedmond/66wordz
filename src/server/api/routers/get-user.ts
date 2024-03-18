import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const getUserRouter = createTRPCRouter({
  isPremiumUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userData = await ctx.db.user.findUnique({ where: { id: userId } });

    function isOneMonthPassed(dateTime: Date): boolean {
      // Calculate current date
      if (dateTime === null) return false;
      const currentDate = new Date();

      // Get day of the month for the input DateTime
      const dayOfMonthInput = dateTime.getDate();

      // Get day of the month for the current date
      const dayOfMonthCurrent = currentDate.getDate();

      // If the day of the month for the current date is greater or equal to the day of the month for the input date,
      // then we check if the difference in months between the two dates is at least 1.
      // Otherwise, we check if the difference in months plus one is at least 1.
      const monthsDifference =
        currentDate.getMonth() -
        dateTime.getMonth() +
        (currentDate.getFullYear() - dateTime.getFullYear()) * 12;

      if (dayOfMonthCurrent >= dayOfMonthInput) {
        return monthsDifference >= 1;
      } else {
        return monthsDifference >= 0;
      }
    }

    return { isPremiumUser: true };
  }),
});

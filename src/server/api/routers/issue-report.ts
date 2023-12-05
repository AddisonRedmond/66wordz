import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const reportIssueRouter = createTRPCRouter({
  reportIssue: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        issueType: z.enum(["ELIMINATION", "MARATHON", "OTHER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { message, issueType } = input;
      const issue = await ctx.db.issues.create({
        data: {
          summary: message,
          issueType: issueType,
          createdById: userId,
        },
      });
      return issue;
    }),
});

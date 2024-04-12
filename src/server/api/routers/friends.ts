import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
export const friendsRouter = createTRPCRouter({
  addNewFriend: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      // check if input exists

      const currentUser = ctx.session.user;

      if (input.email === currentUser.email) {
        return {
          success: false,
          message: "You cannot add yourself as a friend",
        };
      }

      const friend = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!friend) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // check if friend is already a friend

      const isFriend = await ctx.db.friends.findUnique({
        where: { userId: currentUser.id, friendId: friend.id },
      });
      if (isFriend?.accepted === false) {
        return {
          success: false,
          message: "Request pending",
        };
      } else if (isFriend?.accepted) {
        return {
          success: false,
          message: "User is already a friend",
        };
      }

      // add friend
      await ctx.db.friends.create({
        data: {
          userId: currentUser.id,
          userFullName: `${currentUser.name}`,
          friendId: friend.id,
          friendFullName: friend.name,
        },
      });

      return {
        success: true,
        message: "Request sent",
      };
    }),

  allFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const requests = await ctx.db.friends.findMany({
      where: { friendId: user.id, accepted: false },
    });

    return requests;
  }),
});

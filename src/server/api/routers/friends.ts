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

      const isFriend = await ctx.db.requests.findUnique({
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
      await ctx.db.requests.create({
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

  allRequests: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const requests = await ctx.db.requests.findMany({
      where: { friendId: user.id, accepted: false },
    });
    return requests;
  }),

  allPending: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const allPendingRequests = await ctx.db.requests.findMany({
      where: { userId: user.id, accepted: false },
    });

    return allPendingRequests;
  }),

  allFriends: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const allFriends = await ctx.db.friends.findMany({
      where: {
        userId: user.id,
      },
    });

    return allFriends;
  }),

  handleFriendRequest: protectedProcedure
    .input(z.object({ requestId: z.string(), accept: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user;

      const request = await ctx.db.requests.findUnique({
        where: { id: input.requestId },
      });

      if (request?.friendId === userId.id) {
        if (input.accept) {
          await ctx.db.friends.createMany({
            data: [
              {
                userId: userId.id,
                friendFullName: request.userFullName,
                friendId: request.userId,
              },
              {
                userId: request.userId,
                friendFullName: userId.name!,
                friendId: userId.id,
              },
            ],
          });

          await ctx.db.requests.delete({ where: { id: request.id } });
        } else if (input.accept === false) {
          await ctx.db.requests.delete({ where: { id: request.id } });
        }
      }
    }),

  rejectFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user;

      const request = await ctx.db.requests.findUnique({
        where: { id: input },
      });

      if (request?.friendId === userId.id) {
        await ctx.db.requests.delete({ where: { id: request.id } });
      }
    }),
});

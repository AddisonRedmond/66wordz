import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
export const friendsRouter = createTRPCRouter({
  addNewFriend: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      // check if input exists

      const currentUser = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (!currentUser) {
        return { success: false, message: "Not authed" };
      }

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

      const isFriend = await ctx.db.requests.findFirst({
        where: {
          OR: [
            { userId: currentUser.id, friendId: friend.id },
            { userId: friend.id, friendId: currentUser.id },
          ],
        },
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
          userImage: currentUser?.image,

          friendId: friend.id,
          friendFullName: friend.name,
          friendImage: friend?.image,
        },
      });

      return {
        success: true,
        message: "Request sent",
      };
    }),

  allRequests: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.userId },
    });

    if (!user) {
      return;
    }
    const requests = await ctx.db.requests.findMany({
      where: { friendId: user.id, accepted: false },
    });
    return requests;
  }),

  allPending: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.userId },
    });

    if (!user) {
      return;
    }

    const allPendingRequests = await ctx.db.requests.findMany({
      where: { userId: user.id, accepted: false },
    });

    return allPendingRequests;
  }),

  allFriends: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.userId },
    });

    if (!user) {
      return;
    }
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
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (!user) {
        return;
      }

      const request = await ctx.db.requests.findUnique({
        where: { id: input.requestId },
      });

      if (request?.friendId === user.id) {
        if (input.accept) {
          const newFriend = await ctx.db.friend.create({ data: {} });
          await ctx.db.friends.createMany({
            data: [
              {
                sharedId: newFriend.id,
                userId: user.id,
                friendFullName: request.userFullName,
                friendId: request.userId,
                friendImage: request.userImage,
              },
              {
                sharedId: newFriend.id,
                userId: request.userId,
                friendFullName: user.name,
                friendId: user.id,
                friendImage: user.image,
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
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (!user) {
        return;
      }
      const request = await ctx.db.requests.findUnique({
        where: { id: input },
      });

      if (request?.friendId === user.id) {
        await ctx.db.requests.delete({ where: { id: request.id } });
      }
    }),

  removeFriend: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const friendRecord = await ctx.db.friends.findUnique({
        where: { id: input },
      });

      if (friendRecord?.userId === ctx.auth.userId) {
        await ctx.db.friend.delete({ where: { id: friendRecord.sharedId } });
      }
    }),
});

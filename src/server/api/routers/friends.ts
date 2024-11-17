import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
export const friendsRouter = createTRPCRouter({
  addNewFriend: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId as string;
      const currentUser = await ctx.db.user.findUnique({
        where: { id: userId },
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
        return { success: false, message: "User not found" };
      }

      // Check if a request already exists or if they are already friends
      const existingRequest = await ctx.db.requests.findFirst({
        where: {
          OR: [
            { userId: currentUser.id, friendId: friend.id },
            { userId: friend.id, friendId: currentUser.id },
          ],
        },
      });

      if (existingRequest) {
        if (existingRequest.accepted === false) {
          return { success: false, message: "Request pending" };
        }
        if (existingRequest.accepted === true) {
          return { success: false, message: "User is already a friend" };
        }
      }

      // Create new friend request
      await ctx.db.requests.create({
        data: {
          userId: currentUser.id,
          userFullName: currentUser.name,
          userImage: currentUser.image,
          friendId: friend.id,
          friendFullName: friend.name,
          friendImage: friend.image,
        },
      });

      return { success: true, message: "Request sent" };
    }),

  allRequests: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId as string;
    return await ctx.db.requests.findMany({
      where: { friendId: userId, accepted: false },
    });
  }),

  allPending: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId as string;
    return await ctx.db.requests.findMany({
      where: { userId: userId, accepted: false },
    });
  }),

  allFriends: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId as string;

    return await ctx.db.friends.findMany({
      where: {
        userId: userId,
      },
    });
  }),

  handleFriendRequest: protectedProcedure
    .input(z.object({ requestId: z.string(), accept: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId as string;
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) return; // Early return if the user doesn't exist

      // Fetch the request
      const request = await ctx.db.requests.findUnique({
        where: { id: input.requestId },
      });

      if (!request || request.friendId !== user.id) return; // Ensure request exists and matches the user

      // If the request is accepted, create a new friend and associated records
      if (input.accept) {
        const newFriend = await ctx.db.friend.create({ data: {} });
        Promise.all([
          ctx.db.friends.createMany({
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
          }),
          ctx.db.requests.delete({ where: { id: request.id } }),
        ]);
      } else {
        // If the request is not accepted, delete it
        await ctx.db.requests.delete({ where: { id: request.id } });
      }
    }),

  rejectFriendRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId as string;

      const request = await ctx.db.requests.findUnique({
        where: { id: input },
      });

      if (request?.friendId === userId) {
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
        // wont work without await for some reason, cannot void
        await ctx.db.friend.delete({ where: { id: friendRecord.sharedId } });
      }
    }),
});

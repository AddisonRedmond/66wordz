import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { store } from "~/utils/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { handleGetNewWord } from "~/utils/game";

export const challengeRouter = createTRPCRouter({
  requestChallenge: protectedProcedure
    .input(z.object({ challengeeId: z.string(), recordId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // check if challenge exists already

      const user = ctx.session.user;

      const isFriend = await ctx.db.friends.findUnique({
        where: { id: input.recordId },
      });

      if (!isFriend) {
        return { success: false, message: "Looks like an error occurred" };
      }
      // check to ensure they are friends

      const existingChallenge = await ctx.db.challenge.findFirst({
        where: {
          OR: [
            {
              AND: [
                { challenger: user.id },
                { challengee: input.challengeeId },
              ],
            },
            {
              AND: [
                { challenger: input.challengeeId },
                { challengee: user.id },
              ],
            },
          ],
        },
      });

      if (existingChallenge) {
        return { success: false, message: "Challenge already exists!" };
      }

      const challenge = await ctx.db.challenge.create({
        data: {
          challenger: user.id,
          challengerFullName: user.name!,
          challengee: input.challengeeId,
          challengeeFullName: isFriend.friendFullName,
        },
      });

      //   create challenge in firestore
      await addDoc(collection(store, "challenges"), {
        challenger: user,
        challengee: input.challengeeId,
        word: handleGetNewWord(),
        challengerGuesses: [],
        challengeeGuesses: [],
      });

      // otherwise create challenge
    }),

  getChallenges: protectedProcedure.query(async ({ ctx, input }) => {
    const user = ctx.session.user.id;

    return await ctx.db.challenge.findMany({
      where: {
        OR: [{ challenger: user }, { challengee: user }],
      },
    });
  }),
});

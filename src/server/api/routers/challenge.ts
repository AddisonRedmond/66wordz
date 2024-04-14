import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { store } from "~/utils/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { handleGetNewWord } from "~/utils/game";

export const challengeRouter = createTRPCRouter({
  requestChallenge: protectedProcedure
    .input(z.array(z.object({ friendRecordId: z.string(), name: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // check to make sure user is going over maximum number of challenges
      

      // check to make sure user if friends with everyone in input array

      // create a record of the challenge in the databases
    }),

  getChallenges: protectedProcedure.query(async ({ ctx, input }) => {
    const user = ctx.session.user.id;

    return await ctx.db.challenge.findMany({
      where: {
        challengee: user,
      },
    });
  }),

  declineChallege: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.challenge.delete({ where: { id: input.challengeId } });
    }),

  startChallenge: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // create a firebase document with an id of the challenge id

      //   look up the challenge
      const challenge = await ctx.db.challenge.findUnique({
        where: { id: input.challengeId },
      });

      if (!challenge) {
        return { success: false, message: "couldn't find challenge" };
      }

      await addDoc(collection(store, "challenges"), {
        challenger: challenge.challenger,
        challengee: challenge.challengee,
        word: handleGetNewWord(),
        challengerGuesses: [],
        challengeeGuesses: [],
      });

      return challenge;
    }),
});

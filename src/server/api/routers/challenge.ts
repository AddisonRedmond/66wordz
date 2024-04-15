import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { store } from "~/utils/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { handleGetNewWord } from "~/utils/game";
import { Prisma } from "@prisma/client";

export const challengeRouter = createTRPCRouter({
  requestChallenge: protectedProcedure
    .input(z.array(z.object({ friendRecordId: z.string(), name: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // check to make sure user is going over maximum number of challenges
      const ids = input.map((id) => {
        return id.friendRecordId;
      });

      // check to make sure user if friends with everyone in input array
      const challengees = await ctx.db.friends.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: { friendId: true },
      });

      const challengeeIds = challengees.map((challengee) => {
        return challengee.friendId;
      });

      console.log(challengeeIds);

      const matchingChallenges = await ctx.db.challenge.findMany({
        where: {
          // Filter based on challengees array
          challengees: {
            // Check if any of the challengeeIds are present in the array
            hasEvery: challengeeIds,
          },
        },
      });

      if (matchingChallenges.length) {
        console.log(matchingChallenges);
        return;
      }

      await ctx.db.challenge.create({
        data: {
          initiateById: user.id,
          challengees: [...challengeeIds, user.id],
        },
      });

      // create a record of the challenge in the databases
    }),

  getChallenges: protectedProcedure.query(async ({ ctx, input }) => {
    const user = ctx.session.user.id;
    // Construct the search object as a JSON object
    // Use the searchObject in the query
    const result = await ctx.db.challenge.findMany({
      where: {
        challengees: {
          has: user,
        },
      },
    });

    return result;

    // find any challenges that contain user id
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

      // await addDoc(collection(store, "challenges"), {
      //   challenger: challenge.challenger,
      //   challengee: challenge.challengee,
      //   word: handleGetNewWord(),
      //   challengerGuesses: [],
      //   challengeeGuesses: [],
      // });

      return challenge;
    }),
});

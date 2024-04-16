import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { store } from "~/utils/firebase/firebase";
import {
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { handleGetNewWord } from "~/utils/game";

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
        select: { friendId: true, friendFullName: true },
      });

      const challengeeIds = challengees.map((challengee) => {
        return challengee.friendId;
      });

      const challengeeNames = challengees.map((challengee) => {
        return challengee.friendFullName;
      });

      const matchingChallenges = await ctx.db.challenge.findMany({
        where: {
          // Filter based on challengees array
          challengeesIds: {
            // Check if any of the challengeeIds are present in the array
            hasEvery: challengeeIds,
          },
        },
      });

      for (const challenge of matchingChallenges) {
        // + 1 because we add current user in the array afterwards
        if (challenge.challengeesIds.length === challengeeIds.length + 1) {
          return {
            success: "false",
            message: "Challenge with these friends already exists",
          };
        }
      }

      await ctx.db.challenge.create({
        data: {
          initiateById: user.id,
          challengeesIds: [...challengeeIds, user.id],
          challengeesNames: [...challengeeNames, user.name!],
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
        challengeesIds: {
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
      const userId = ctx.session.user.id;
      //   look up the challenge
      const challenge = await ctx.db.challenge.findUnique({
        where: { id: input.challengeId },
      });

      if (!challenge) {
        return;
      }

      await ctx.db.challenge.update({
        where: { id: challenge.id },
        data: { started: { push: userId } },
      });

      // check if firebase document already exists
      const challengeRef = doc(store, "challenges", input.challengeId);
      const firebaseChallenge = await getDoc(challengeRef);

      if (!firebaseChallenge.exists()) {
        // create a new document and add the user and their game data
        await setDoc(doc(store, "challenges", challenge.id), {
          word: handleGetNewWord(),
          [userId]: {
            timeStamp: serverTimestamp(),
          },
        });
      }

      const firebaseDoc = firebaseChallenge.data();

      if (firebaseDoc?.[userId]) {
        return challenge;
      }

      await updateDoc(challengeRef, {
        [userId]: {
          timeStamp: serverTimestamp(),
        },
      });

      return challenge;
    }),

  giveUp: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // get the challenge id
      const challengeId = await ctx.db.challenge.findUnique({
        where: { id: input },
        select: {
          id: true,
          challengeesIds: true,
          challengeesNames: true,
          started: true,
        },
      });

      if (!challengeId) {
        return;
      }

      // if user didnt start, just remove them from the field
      if (!challengeId.started.includes(user.id)) {
        const removedUserId = challengeId?.challengeesIds.filter(
          (id) => id !== user.id,
        );
        const removedUserName = challengeId?.challengeesNames.filter(
          (id) => id !== user.name,
        );

        // check if there is only one person left in the challenge, if yes, then delete the challenge

        if (removedUserId.length === 1) {
          await ctx.db.challenge.delete({ where: { id: challengeId.id } });
        } else {
          await ctx.db.challenge.update({
            where: { id: challengeId?.id },
            data: {
              challengeesIds: removedUserId,
              challengeesNames: removedUserName,
            },
          });
        }
      } else if (challengeId.started.includes(user.id)) {
        const challengeRef = doc(store, "challenges", challengeId.id);
        const firebaseChallenge = await getDoc(challengeRef);

        if (firebaseChallenge.exists()) {
          await updateDoc(challengeRef, {
            [`${user.id}.completed`]: false, // Append guess to the array
            [`${user.id}.success`]: false,
          });
        }
      }
      // if user did start but gave up, add them to the gave up field

      // update the user in firebase to
      // completed false,
      // success false
    }),
});

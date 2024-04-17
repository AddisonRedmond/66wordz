import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { store } from "~/utils/firebase/firebase";
import {
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
  collection,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { handleGetNewWord } from "~/utils/game";

export const challengeRouter = createTRPCRouter({
  requestChallenge: protectedProcedure
    .input(z.array(z.object({ friendRecordId: z.string(), name: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // make sure they're acutally friends
      await addDoc(collection(store, "challenges"), {
        players: input,
        ids: input.map((id) => {
          return id.friendRecordId;
        }),
        creator: user.id,
      });
    }),

  getChallenges: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const docRef = doc(store, "userChallenges", userId);
    const docSnap = await getDoc(docRef);
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
      if (!challenge.started.includes(userId)) {
        await ctx.db.challenge.update({
          where: { id: challenge.id },
          data: { started: { push: userId } },
        });
      }

      // check if firebase document already exists
      const challengeRef = doc(store, "challenges");
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
          // TODO: dont delete it, change the status to done and details to all players either quit for declined
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

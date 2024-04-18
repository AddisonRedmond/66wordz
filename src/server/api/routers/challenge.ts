import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { store } from "~/utils/firebase/firebase";

import {
  getDoc,
  doc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { arraysContainSameElements, handleGetNewWord } from "~/utils/game";
import { ChallengeData } from "~/custom-hooks/useGetChallengeData";

export const challengeRouter = createTRPCRouter({
  requestChallenge: protectedProcedure
    .input(z.array(z.object({ friendRecordId: z.string(), name: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // make sure the user either has premium or has free games

      // check and see if any of the documents.ids already have all of the same ids

      const ids = input.map((id) => {
        return id.friendRecordId;
      });

      const challengees = await ctx.db.friends.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: { friendId: true, friendFullName: true },
      });

      // check to make sure all friend ids havean't exceeded number of games or

      const challengeeIds = challengees.map((challengee) => {
        return challengee.friendId;
      });

      challengeeIds.push(user.id);

      const challengeRef = collection(store, "challenges");
      const q = query(challengeRef, where("ids", "array-contains", user.id));

      for (const doc of (await getDocs(q)).docs) {
        const challenge = doc.data() as ChallengeData;
        if (arraysContainSameElements(challenge.ids, challengeeIds)) {
          return "Challenge already exists";
        }
      }

      (await getDocs(q)).docs.forEach((doc) => {
        console.log(doc.data());
      });

      const timeStamp = new Date(new Date().getTime() + 86400000);

      ids.push(user.id);
      // make sure they're acutally friends
      await addDoc(collection(store, "challenges"), {
        timeStamp: timeStamp.toString(),
        players: [
          ...challengees,
          { friendFullName: user.name, friendId: user.id },
        ],
        ids: challengeeIds,
        creator: user.id,
        word: handleGetNewWord(),
      });
    }),

  startChallenge: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // create a firebase document with an id of the challenge id
      const userId = ctx.session.user.id;
      //   look up the challenge

      const challengeRef = doc(store, "challenges", input.challengeId);
      const firebaseChallenge = await getDoc(challengeRef);

      const firebaseChallengeData = firebaseChallenge.data() as ChallengeData;
      // check to make sure document exists and that user is part of the document

      // if both exist add a start time time stamp to user

      // return the document id

      // make sure the 24 hour timer hasn't expired

      if (
        firebaseChallenge.exists() &&
        firebaseChallengeData.ids.includes(userId)
      ) {
        if (firebaseChallengeData[userId]?.timeStamp) {
          return challengeRef.id;
        }
        await updateDoc(challengeRef, {
          [userId]: {
            timeStamp: new Date().toString(),
          },
        });
        return challengeRef.id;
      }
    }),

  giveUp: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // get the challenge id
      const userId = ctx.session.user.id;
      //   look up the challenge

      const challengeRef = doc(store, "challenges", input);
      const firebaseChallenge = await getDoc(challengeRef);

      const firebaseChallengeData = firebaseChallenge.data() as ChallengeData;
      // check to make sure document exists and that user is part of the document

      // if both exist add a start time time stamp to user

      // return the document id

      if (
        firebaseChallenge.exists() &&
        firebaseChallengeData.ids.includes(userId)
      ) {
        // check if user is in the doc
        if (firebaseChallengeData?.[userId]) {
          await updateDoc(challengeRef, {
            [`${userId}.completed`]: false,
            [`${userId}.success`]: false,
          });
        } else {
          // const updatedPlayerIds =
          const updatedIds = firebaseChallengeData.ids.filter(
            (id) => id !== userId,
          );

          const updatedPlayers = firebaseChallengeData.players.filter(
            (player) => player.friendId !== userId,
          );

          if (updatedIds.length <= 1) {
            await deleteDoc(challengeRef);
          } else {
            await updateDoc(challengeRef, {
              ids: updatedIds,
              players: updatedPlayers,
            });
          }
        }
        // if they do, set completed and succsess to false

        // if they dont have a ts then delete them out of the doc
      }
    }),

  calculateWinner: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      // check if all the users who were invited to the game, have completed it
      // if they have,
      // find the person who completed it in the fewest guesses,
      // if theres a tie, pick the person who guessed in the least amount of time
    }),
});

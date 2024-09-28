import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { initAdmin } from "~/utils/firebase-admin";

import { arraysContainSameElements, handleGetNewWord } from "~/utils/game";
import { ChallengeData } from "~/custom-hooks/useGetChallengeData";

export const challengeRouter = createTRPCRouter({
  requestChallenge: protectedProcedure
    .input(z.array(z.object({ friendRecordId: z.string(), name: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (!user) return null;

      const db = initAdmin().firestore();

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

      const challengeRef = db
        .collection("challenges")
        .where("ids", "array-contains-any", challengeeIds)
        .where("gameOver", "==", false);

      const docs = (await challengeRef.get()).docs;

      if (docs.length >= 8 || challengeeIds.length >= 5) {
        return "Too many open games or too many people added to challenge";
      }

      // TODO: add check for games with duplicate ids already
      for (const doc of docs) {
        const challenge = doc.data() as ChallengeData;
        if (arraysContainSameElements(challenge.ids, challengeeIds)) {
          return "Challenge already exists";
        }
      }

      ids.push(user.id);

      await db.collection("challenges").add({
        timeStamp: new Date().getTime(),
        players: [
          ...challengees,
          { friendFullName: user.name, friendId: user.id },
        ],
        ids: challengeeIds,
        creator: user.id,
        word: handleGetNewWord(),
        gameOver: false,
      });
    }),

  startChallenge: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // create a firebase document with an id of the challenge id
      const userId = ctx.session.userId;
      //   look up the challenge
      const db = initAdmin().firestore();
      const challengeRef = db.doc(`challenges/${input.challengeId}`);
      const firebaseChallengeData = (
        await challengeRef.get()
      ).data() as ChallengeData;
      // check to make sure document exists and that user is part of the document

      // if both exist add a start time time stamp to user

      // return the document id

      // make sure the 24 hour timer hasn't expired

      if (firebaseChallengeData.ids.includes(userId)) {
        if (firebaseChallengeData.gameOver) {
          // add the user id to the viewed arr
          if (firebaseChallengeData.ids.length <= 1) {
            await challengeRef.delete();
          } else {
            await challengeRef.update({
              ids: firebaseChallengeData.ids.filter((id) => id != userId),
            });
          }
        }
        if (firebaseChallengeData[userId]?.timeStamp) {
          return challengeRef.id;
        }

        await challengeRef.update({
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
      const userId = ctx.session.userId;
      //   look up the challenge
      const db = initAdmin().firestore();

      const challengeRef = db.doc(`challenges/${input}`);

      const firebaseChallengeData = (
        await challengeRef.get()
      ).data() as ChallengeData;
      // check to make sure document exists and that user is part of the document

      // if both exist add a start time time stamp to user

      // return the document id

      // run check for winner logic
      if (firebaseChallengeData.ids.includes(userId)) {
        // check if user is in the doc
        if (firebaseChallengeData?.[userId]) {
          await challengeRef.update({
            [`${userId}.completed`]: false,
            [`${userId}.success`]: false,
          });

          firebaseChallengeData;
        } else {
          // const updatedPlayerIds =
          const updatedIds = firebaseChallengeData.ids.filter(
            (id) => id !== userId,
          );

          const updatedPlayers = firebaseChallengeData.players.filter(
            (player) => player.friendId !== userId,
          );

          if (updatedIds.length <= 1) {
            await challengeRef.delete();
          } else {
            await challengeRef.update({
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
    .mutation(async ({ input }) => {
      // get firebase doc

      const db = initAdmin().firestore();

      const challengeRef = db.doc(`challenges/${input}`);

      const firebaseChallenge = (
        await challengeRef.get()
      ).data() as ChallengeData;

      for (const id of firebaseChallenge.ids) {
        if (!firebaseChallenge?.[id]) {
          // not everyone is done, stop execution
          return;
        }
      }

      // check all of the guesses
      let shortestGuess = 10;
      let userId = "";
      firebaseChallenge.ids.forEach((id) => {
        if (firebaseChallenge[id]?.completed) {
          const userGuessLength = firebaseChallenge[id].guesses!.length;

          if (userGuessLength === shortestGuess) {
            // check the duration and add their id and shortest guess to the vars
            const userIdDuration = new Date(
              new Date(firebaseChallenge[userId]!.endTimeStamp).getTime() -
                new Date(firebaseChallenge[userId]!.timeStamp).getTime(),
            ).getTime();
            const currentIdDuration = new Date(
              new Date(firebaseChallenge[id].endTimeStamp).getTime() -
                new Date(firebaseChallenge[id].timeStamp).getTime(),
            ).getTime();

            if (userIdDuration > currentIdDuration) {
              shortestGuess = userGuessLength;
              userId = id;
            }
          } else if (userGuessLength < shortestGuess) {
            shortestGuess = userGuessLength;
            userId = id;
          }
        }
      });

      await challengeRef.update({
        [`winner`]: {
          id: userId,
          name: firebaseChallenge.players.filter(
            (player) => player.friendId === userId,
          )[0]?.friendFullName,
        },
        ["gameOver"]: true,
      });

      return userId;

      // if they have,
      // find the person who completed it in the fewest guesses,
      // if theres a tie, pick the person who guessed in the least amount of time
    }),
  gameFinished: protectedProcedure
    .input(
      z.object({
        challengeId: z.string(),
        userId: z.string(),
        completed: z.boolean(),
        success: z.boolean(),
        guesses: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = initAdmin().firestore();

      const challengeRef = db.doc(`challenges/${input.challengeId}`);
      const userId = ctx.session.userId;
      await challengeRef.update({
        [`${userId}.guesses`]: input.guesses,
        [`${userId}.completed`]: input.completed,
        [`${userId}.success`]: input.success,
        [`${userId}.endTimeStamp`]: new Date().toString(),
      });
      // update the users challenge document
    }),
});

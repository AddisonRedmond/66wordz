import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { calculatePoints } from "~/utils/elimination";
import {
  handleCorrectGuess,
  handleEliminationWinner,
  startGame,
} from "~/utils/firebase/firebase";
import { handleGetNewWord } from "~/utils/game";
import { env } from "~/env.mjs";
import { Players } from "@prisma/client";

export const eliminationRouter = createTRPCRouter({
  handleCorrectGuess: protectedProcedure
    .input(
      z.object({
        gamePath: z.string(),
        guessCount: z.number(),
        points: z.number(),
        lobbyId: z.string(),
        roundNumber: z.number(),
        previousWord: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const POINTS_TARGET = 500;
      const userId = ctx.session.user.id;
      const calculatedPoints = calculatePoints(input.guessCount, input.points);
      let playerInfo: Players | null = null;

      const lobbyCount = await ctx.db.players.count({
        where: { lobbyId: input.lobbyId },
      });

      await handleCorrectGuess(
        `ELIMINATION/${input.lobbyId}`,
        handleGetNewWord(),
        calculatedPoints,
        userId,
        input.previousWord,
      );

      // if (calculatedPoints >= POINTS_TARGET) {
      //   if (input.roundNumber >= 6 || lobbyCount <= 5) {
      //     handleEliminationWinner(
      //       `ELIMINATION/${input.lobbyId}/winner`,
      //       userId,
      //     );
      //     await ctx.db.lobby.delete({ where: { id: input.lobbyId } });
      //   } else {
      //     playerInfo = await ctx.db.players.update({
      //       where: { userId: userId },
      //       data: { qualified: true },
      //     });
      //   }
      // }

      // const qualified = await ctx.db.players.findMany({
      //   where: { lobbyId: input.lobbyId, qualified: { equals: true } },
      // });

      // // deletes the players who are qualified:false
      // const deleteAndUpdateDisqualified = async () => {
      //   await ctx.db.players.deleteMany({
      //     where: { lobbyId: input.lobbyId, qualified: false },
      //   });

      //   await ctx.db.players.updateMany({
      //     where: { lobbyId: input.lobbyId, qualified: true },
      //     data: { qualified: false },
      //   });
      // };

      // // resets all of the "qualified" people and returns them in an object which is {playerid: {points: 0}}
      // const buildNextRoundPlayerPoints = () => {
      //   const nextRoundTemp: { [keyof: string]: { points: 0 } } = {};
      //   qualified.forEach((player: Players) => {
      //     nextRoundTemp[player.userId] = { points: 0 };
      //   });
      //   return nextRoundTemp;
      // };

      // // returns an object that will replace the lobbyData object in firebase
      // // object is lobbyData type
      // const buildNextRoundLobbyData = () => {
      //   const lobbyData: {
      //     gameStarted: boolean;
      //     round: number;
      //     word: string;
      //     nextRoundStartTime: number;
      //   } = {
      //     gameStarted: false,
      //     round: input.roundNumber + 1,
      //     word: handleGetNewWord(),
      //     nextRoundStartTime: new Date().getTime() + 10000,
      //   };
      //   return lobbyData;
      // };

      // const handleNextRound = () => {
      //   const nextRoundPlayerPoints = buildNextRoundPlayerPoints();
      //   const nextRoundLobbyData = buildNextRoundLobbyData();

      //   // delete everyone who didnt qualify and reset those who have qualified to qualified false
      //   deleteAndUpdateDisqualified();

      //   // firebase function, changes the firebase lobby to the updated lobbyData and playerPoints
      //   createNewRound(
      //     nextRoundPlayerPoints,
      //     nextRoundLobbyData,
      //     `ELIMINATION/${input.lobbyId}`,
      //   );

      //   // upate the firebase lobby's round number
      // };
      // if (qualified.length >= calculateSpots(input.roundNumber, lobbyCount)) {
      //   handleNextRound();
      // }

      // return playerInfo;
      // check if users points are greater or equal to the target
      // if they are add the user to qualified
      // update the points in firebase

      // check the number of qualifed people, if we're at the limit run next round logic
      //
    }),

  startGame: protectedProcedure
    .input(
      z.object({
        lobbyId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      startGame(input.lobbyId, "ELIMINATION");
    }),

  addBots: protectedProcedure.mutation(async ({ ctx }) => {
    const playerLobby = await ctx.db.players.findUnique({
      where: { userId: ctx.session.user.id },
    });

    const lobbyId = playerLobby?.lobbyId;

    let lobby = await ctx.db.lobby.findUnique({ where: { id: lobbyId } });

    if (lobby?.bot) {
      return lobby;
    } else if (!lobby?.bot) {
      lobby = await ctx.db.lobby.update({
        where: { id: lobbyId },
        data: {
          bot: true,
        },
      });
      try {
        fetch(`${env.BOT_SERVER}/add_bots/${lobby.id}`, { method: "POST" });
      } catch (e) {
        console.log(e);
      }
      return lobby;
    }
  }),
});

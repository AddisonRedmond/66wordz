import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { ref, set, update } from "firebase/database";
import { db } from "~/utils/firebase/firebase";
import { getInitials } from "~/utils/survival/surivival";
import { handleGetNewWord } from "~/utils/game";
import { env } from "~/env.mjs";
import {
  hasBeen24Hours,
  hasMoreFreeGames,
  isPremiumUser,
} from "~/utils/game-limit";

const MAX_PLAYERS = 67;
const ATTACK_VALUE = 90;
const TYPE_VALUE = 70;

type PlayerDataObject = {
  health: number;
  shield: number;
  eliminated: boolean;
  initials: string;
  word: {
    word: string;
    type: string;
    value: number;
    attack: number;
  };
};

export const createLobbyRouter = createTRPCRouter({
  createLobby: protectedProcedure
    .input(
      z.object({
        lobbyName: z.string(),
        passKey: z.string().optional(),
        enableBots: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if player has reached the max number of games for the day
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      const isPremiumUser = () => {
        if (user?.currentPeriodEnd === null) return false;
        return user!.currentPeriodEnd > Date.now() / 1000;
      };

      if (!isPremiumUser()) {
        return "User is not a premium user";
      }

      const { lobbyName, passKey, enableBots } = input;
      const uid = new ShortUniqueId({ length: 6 });
      const lobbyId = uid.rnd();

      // check to see if user is already in a lobby
      const existingGame = await ctx.db.players.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (existingGame) {
        return ctx.db.lobby.findUnique({
          where: { id: existingGame.lobbyId },
        });
      }

      // create lobby in database,
      const newLobby = await ctx.db.lobby.create({
        data: {
          id: lobbyId,
          gameType: "SURVIVAL",
          name: lobbyName,
          passkey: passKey,
          bot: enableBots,
        },
      });

      // add user to lobby in database
      await ctx.db.players.create({
        data: {
          userId: ctx.session.user.id,
          lobbyId: newLobby.id,
        },
      });

      // create lobby in firebase
      const playerInitials = getInitials(ctx.session.user.name);
      const playerData: PlayerDataObject = {
        health: 100,
        shield: 50,
        eliminated: false,
        initials: playerInitials,
        word: {
          word: handleGetNewWord(5),
          type: "shield",
          value: TYPE_VALUE,
          attack: ATTACK_VALUE,
        },
      };

      await set(ref(db, `SURVIVAL/`), {
        [lobbyId]: {
          lobbyData: {
            name: lobbyName,
            passkey: passKey,
            gameStarted: false,
            initialStartTime: new Date().getTime(),
            owner: ctx.session.user.id,
          },
          players: {
            [ctx.session.user.id]: playerData,
          },
        },
      });

      try {
        fetch(`${env.BOT_SERVER}/register_custom_survival_lobby`, {
          method: "POST",
          body: JSON.stringify({
            lobbyId: newLobby.id,
            enableBots: enableBots,
          }),
        });
      } catch (e) {
        console.log(e);
      }

      return newLobby;

      // tell game server to start game with or without bots
    }),

  joinLobby: protectedProcedure
    .input(z.object({ lobbyId: z.string(), passKey: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      // check if user is premium user, if they are, proceed
      if (isPremiumUser(user!) === false) {
        if (hasBeen24Hours(user!)) {
          // reset the timestamp to today at 12:00am and reset the free game count to 1
          await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
              freeGameTimeStamp: new Date().setHours(0, 0, 0, 0) / 1000,
              freeGameCount: 1,
            },
          });
        } else if (hasMoreFreeGames(user!)) {
          await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: { freeGameCount: user!.freeGameCount + 1 },
          });
        } else {
          return "User has reached the maximum number of free games for the day";
        }
      }

      // if not premium user, check if time stamp is greater than 24 hours old,

      // if it is reset the timestamp to today at 12:00am and reset the free game count to 1

      // if not premium user, and time stamp is not greater than 24 hours
      //  check to see if user has exceeded or equal the max number of games for the day

      if (hasMoreFreeGames(user!)) {
      }

      // if they haven't proceed

      // check if user is already in a lobby
      const existingGame = await ctx.db.players.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (existingGame) {
        return "User is already in a lobby";
      }

      // check if lobby exists
      const lobby = await ctx.db.lobby.findUnique({
        where: { id: input.lobbyId },
      });

      if (!lobby) {
        return "No Lobby Found";
      }
      // check if passkey is correct

      if (lobby.passkey && lobby.passkey !== input.passKey) {
        return "Incorrect Passkey";
      }
      // check if lobby is full

      const playerCount = await ctx.db.players.count({
        where: { lobbyId: lobby.id },
      });

      if (playerCount >= MAX_PLAYERS) {
        return "Lobby is full";
      }

      // check if game has already started
      if (lobby.started) {
        return "Game has already started";
      }

      // add user to lobby in database
      await ctx.db.players.create({
        data: {
          userId: ctx.session.user.id,
          lobbyId: lobby.id,
        },
      });
      // add user to firebase lobby
      const playerInitials = getInitials(ctx.session.user.name);
      const playerData = {
        health: 100,
        shield: 50,
        eliminated: false,
        initials: playerInitials,
        word: {
          word: handleGetNewWord(5),
          type: "shield",
          value: TYPE_VALUE,
          attack: ATTACK_VALUE,
        },
      };

      await update(ref(db, `SURVIVAL/${lobby.id}/players/`), {
        [ctx.session.user.id]: playerData,
      });
    }),

  startGame: protectedProcedure.mutation(async ({ ctx }) => {
    // change lobby.started to true

    const lobby = await ctx.db.players.findUnique({
      where: { userId: ctx.session.user.id },
    });

    const playerCount = await ctx.db.players.count({
      where: { lobbyId: lobby?.lobbyId },
    });

    if (!lobby || playerCount < 2) return;

    await ctx.db.lobby.update({
      where: { id: lobby.lobbyId },
      data: { started: true },
    });

    // change firebase lobby gameStarted to true
    await update(ref(db, `SURVIVAL/${lobby?.lobbyId}/lobbyData/`), {
      gameStarted: true,
    });
  }),

  getLobby: protectedProcedure.query(async ({ ctx }) => {
    const existingGame = await ctx.db.players.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (existingGame) {
      const lobby = await ctx.db.lobby.findUnique({
        where: { id: existingGame?.lobbyId },
      });
      return lobby;
    }

    return null;
  }),
});

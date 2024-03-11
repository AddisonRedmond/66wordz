import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { ref, set, update } from "firebase/database";
import { db } from "~/utils/firebase/firebase";
import { getInitials } from "~/utils/survival/surivival";
import { handleGetNewWord } from "~/utils/game";

const MAX_PLAYERS = 67;
const ATTACK_VALUE = 90;
const TYPE_VALUE = 70;

type PlayerDataObject = {};

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

      return newLobby;

      // tell game server to start game with or without bots
    }),

  joinLobby: protectedProcedure
    .input(z.object({ lobbyId: z.string(), passKey: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
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

    if (!lobby || playerCount < 10) return;

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

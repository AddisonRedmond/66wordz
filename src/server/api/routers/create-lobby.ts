import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";

import {
  createCustomSurvivalLobby,
  getInitials,
  createCustomEliminationLobby,
} from "~/utils/game";
import { env } from "~/env.mjs";
import { joinSurivivalLobby } from "~/utils/survival/surivival";
import { joinEliminationLobby } from "~/utils/elimination";
import { initAdmin } from "~/utils/firebase-admin";

const MAX_PLAYERS = 67;

export const createLobbyRouter = createTRPCRouter({
  createLobby: protectedProcedure
    .input(
      z.object({
        lobbyName: z.string(),
        passKey: z.string().optional(),
        enableBots: z.boolean(),
        gameType: z.enum(["SURVIVAL", "ELIMINATION", "MARATHON"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if user is premium user
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });

      if (!user) return null;

      const { lobbyName, passKey, enableBots, gameType } = input;
      // create unique lobby id "short"
      const uid = new ShortUniqueId({ length: 6 });
      const lobbyId = uid.rnd();

      // check to see if user is already in a lobby
      const existingGame = await ctx.db.players.findFirst({
        where: { userId: ctx.session.userId },
      });

      if (existingGame) {
        return ctx.db.lobby.findUnique({
          where: { id: existingGame.lobbyId },
        });
      }
      //

      // create lobby in database,
      const newLobby = await ctx.db.lobby.create({
        data: {
          id: lobbyId,
          gameType: gameType,
          name: lobbyName,
          passkey: passKey,
          bot: enableBots,
        },
      });
      //
      // add user to lobby in database
      await ctx.db.players.create({
        data: {
          userId: ctx.session.userId,
          lobbyId: newLobby.id,
        },
      });
      //
      // remove register and add it to start api.
      // create lobby in firebase from here
      // start game will send to register url
      const db = initAdmin().database();
      const lobbyRef = db.ref(`/${gameType}`).child(lobbyId);

      switch (gameType) {
        case "ELIMINATION":
          const eliminationLobby = createCustomEliminationLobby(user.id);
          const newPlayer = joinEliminationLobby(user.id, user.name);
          lobbyRef.set({ lobbyData: eliminationLobby, players: newPlayer });
          break;
        case "SURVIVAL":
          const survivalLobby = createCustomSurvivalLobby(user.id);
          const newSurvivalPlayer = joinSurivivalLobby(user.id, user.name);
          lobbyRef.set({
            lobbyData: survivalLobby,
            players: newSurvivalPlayer,
          });
          break;
      }

      // tell game server to start game with or without bots
    }),

  joinLobby: protectedProcedure
    .input(z.object({ lobbyId: z.string(), passKey: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
      });
      // check if user is premium user, if they are, proceed

      // check if user is already in a lobby
      const existingGame = await ctx.db.players.findFirst({
        where: { userId: ctx.session.userId },
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
          userId: ctx.session.userId,
          lobbyId: lobby.id,
        },
      });
      // add user to firebase lobby
      const name = await ctx.db.user.findUnique({
        where: { id: ctx.session.userId },
        select: { name: true },
      });

      const db = initAdmin().database();
      const lobbyRef = db.ref(`/${lobby.gameType}`).child(lobby.id);

      const playerInitials = getInitials(name?.name);
      switch (lobby.gameType) {
        case "SURVIVAL":
          const survivalPlayer = joinSurivivalLobby(
            ctx.session.userId,
            playerInitials,
          );
          lobbyRef.child("/players").update(survivalPlayer);
          break;
        case "ELIMINATION":
          const player = joinEliminationLobby(ctx.session.userId, user?.name);
          lobbyRef.child("/players").update(player);
          break;
      }
    }),

  startGame: protectedProcedure.mutation(async ({ ctx }) => {
    // change lobby.started to true
    const players = await ctx.db.players.findUnique({
      where: { userId: ctx.session.userId },
    });

    const playerCount = await ctx.db.players.count({
      where: { lobbyId: players?.lobbyId },
    });

    if (!players || playerCount < 2) return;

    const lobbyStarted = await ctx.db.lobby.findUnique({
      where: { id: players.lobbyId },
      select: { started: true },
    });

    if (lobbyStarted?.started) {
      return;
    }

    const lobby = await ctx.db.lobby.update({
      where: { id: players.lobbyId },
      data: { started: true },
    });

    // change firebase lobby gameStarted to true
    fetch(
      `${env.BOT_SERVER}/register_custom_${lobby.gameType.toLowerCase()}_lobby`,
      {
        method: "POST",
        body: JSON.stringify({ lobbyId: lobby.id }),
      },
    );

    return { success: true };

    // register the lobby with firebase func
  }),

  getLobby: protectedProcedure.query(async ({ ctx }) => {
    const db = initAdmin().database();

    const existingGame = await ctx.db.players.findUnique({
      where: { userId: ctx.session.userId },
    });

    if (existingGame) {
      const lobby = await ctx.db.lobby.findUnique({
        where: { id: existingGame?.lobbyId },
      });

      const firebaseLobbyReady = (
        await db
          .ref(`${lobby?.gameType}/${lobby?.id}`)
          .child("lobbyData")
          .once("value")
      ).exists();
      if (firebaseLobbyReady) {
        return lobby;
      }
    }

    return null;
  }),
});

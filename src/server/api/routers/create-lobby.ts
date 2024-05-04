import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { ref, update } from "firebase/database";
import { db } from "~/utils/firebase/firebase";
import {
  createCustomLobby,
  createCustomSurvivalLobby,
  getInitials,
  createCustomEliminationLobby,
} from "~/utils/game";
import { env } from "~/env.mjs";
import {
  hasBeen24Hours,
  hasMoreFreeGames,
  isPremiumUser,
} from "~/utils/game-limit";
import { joinSurivivalLobby } from "~/utils/survival/surivival";
import { joinEliminationLobby } from "~/utils/elimination";

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

      const isPremiumUser = () => {
        if (user?.currentPeriodEnd === null) return false;
        return user.currentPeriodEnd > Date.now() / 1000;
      };

      if (!isPremiumUser()) {
        return "User is not a premium user";
      }
      //

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
      // create lobby in firebase
      const registerLobby = (url: string) => {
        try {
          fetch(url, {
            method: "POST",
            body: JSON.stringify({
              lobbyId: newLobby.id,
              enableBots: true,
            }),
          });
        } catch (e) {}
      };
      switch (gameType) {
        case "ELIMINATION":
          const eliminationLobby = createCustomEliminationLobby(user.id);
          const newLobbyCreated = await createCustomLobby(
            `ELIMINATION/${lobbyId}`,
            eliminationLobby,
          );

          if (newLobbyCreated) {
            registerLobby(
              `${env.BOT_SERVER}/register_custom_elimination_lobby`,
            );
            joinEliminationLobby(user.id, newLobby.id, user.name);
          }
          break;
        case "SURVIVAL":
          const survivalLobby = createCustomSurvivalLobby(user.id);
          const newSurvivalLobby = await createCustomLobby(
            `SURVIVAL/${lobbyId}`,
            survivalLobby,
          );

          if (newSurvivalLobby) {
            registerLobby(`${env.BOT_SERVER}/register_custom_survival_lobby`);
            joinSurivivalLobby(newLobby.id, user.id, user.name);
          }
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
      if (isPremiumUser(user!) === false) {
        if (hasBeen24Hours(user!)) {
          // reset the timestamp to today at 12:00am and reset the free game count to 1
          await ctx.db.user.update({
            where: { id: ctx.session.userId },
            data: {
              freeGameTimeStamp: new Date().setHours(0, 0, 0, 0) / 1000,
              freeGameCount: 0,
            },
          });
        } else if (hasMoreFreeGames(user!) === false) {
          return "User has reached the maximum number of free games for the day";
        }
      }

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
      const name = await ctx.db.user.findUnique({where:{id: ctx.session.userId}, select: {name: true}});
      const playerInitials = getInitials(name?.name);
      switch (lobby.gameType) {
        case "SURVIVAL":
          joinSurivivalLobby(lobby.id, ctx.session.userId, playerInitials);
          break;
        case "ELIMINATION":
          joinEliminationLobby(ctx.session.userId, lobby.id, playerInitials);
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

    const lobby = await ctx.db.lobby.update({
      where: { id: players.lobbyId },
      data: { started: true },
    });

    // change firebase lobby gameStarted to true
    await update(ref(db, `${lobby.gameType}/${lobby.id}/lobbyData/`), {
      gameStarted: true,
    });
  }),

  getLobby: protectedProcedure.query(async ({ ctx }) => {
    const existingGame = await ctx.db.players.findUnique({
      where: { userId: ctx.session.userId },
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

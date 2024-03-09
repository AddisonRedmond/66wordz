import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { ref, set } from "firebase/database";
import { db } from "~/utils/firebase/firebase";
import { PlayerData, getInitials } from "~/utils/survival/surivival";
import { handleGetNewWord } from "~/utils/game";
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
      const ATTACK_VALUE = 90;
      const TYPE_VALUE = 70;

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
          ownerId: ctx.session.user.id,
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
      const playerData: PlayerData = {
        [ctx.session.user.id]: {
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
        },
      };

      await set(ref(db, `SURVIVAL/`), {
        [lobbyId]: {
          lobbyData: {
            name: lobbyName,
            passkey: passKey,
            owner: ctx.session.user.id,
            gameStarted: false,
            initialStartTime: new Date().getTime(),
          },
          players: {
            playerData,
          },
        },
      });

      return newLobby;

      // tell game server to start game with or without bots
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

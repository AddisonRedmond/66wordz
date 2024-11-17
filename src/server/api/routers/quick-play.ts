import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GameType, Lobby } from "@prisma/client";
import { createNewSurivivalLobby, joinSurivivalLobby } from "~/utils/surivival";
import { clerkClient } from "@clerk/nextjs/server";
import {
  createNewEliminationLobby,
  joinEliminationLobby,
} from "~/utils/elimination";
import { initAdmin } from "~/utils/firebase-admin";
import { registerLobbyWithServer } from "~/utils/game";
import { createNewRaceLobby, joinRaceLobby } from "~/utils/race";
import { z } from "zod";

export const quickPlayRouter = createTRPCRouter({
  quickPlay: protectedProcedure
    .input(z.object({ gameMode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gameMode = input.gameMode as GameType;
      const db = initAdmin().database();
      const userId = ctx.auth.userId as string;

      const findLobby = async (): Promise<Lobby | null> => {
        const lobbies = await ctx.db.lobby.findMany({
          where: {
            started: false,
            gameType: gameMode,
            player: {
              some: {}, // Ensure there's at least one player
            },
          },
          include: {
            player: true, // Include players to filter by count
          },
        });

        const eligibleLobby = lobbies.find((lobby) => lobby.player.length < 67);

        return eligibleLobby || null;
      };

      // create lobby in postgres and fb realtime db, and registers the lobby with function
      // that runs the lobby
      const createNewLobby = async () => {
        const clientGameType = input.gameMode as GameType;
        const newLobby = await ctx.db.lobby.create({
          data: {
            gameType: clientGameType,
          },
        });
        //   create the new lobby in firebase realtime db

        let lobbyData;
        switch (clientGameType) {
          case "SURVIVAL":
            lobbyData = createNewSurivivalLobby();
            break;
          case "ELIMINATION":
            lobbyData = createNewEliminationLobby();
            break;
          case "RACE":
            lobbyData = createNewRaceLobby();
            break;
        }
        await db
          .ref(`/${gameMode}/${newLobby.id}`)
          .set({ lobbyData })
          .catch((error: Error) => {
            console.error("Error creating Firebase lobby:", error);
            throw error;
          });

        registerLobbyWithServer(gameMode, newLobby.id);
        return newLobby;
      };

      const joinLobby = async (lobbyId: string) => {
        // lobby is actually coming from player, should be named player lobby
        const user = await (
          await clerkClient()
        ).users.getUser(ctx.auth.userId as string);

        let newPlayer;
        switch (gameMode) {
          case "SURVIVAL":
            newPlayer = joinSurivivalLobby(userId, user?.fullName);
            break;
          case "ELIMINATION":
            newPlayer = joinEliminationLobby(userId, user?.fullName);
            break;
          case "RACE":
            newPlayer = joinRaceLobby(userId, user?.fullName);
            break;
        }
        if (!newPlayer) return;
        const player = await ctx.db.players.create({
          data: { userId: userId, lobbyId: lobbyId },
        });

        void db.ref(`/${gameMode}/${lobbyId}/players`).update({
          ...newPlayer,
        });

        const playerCount = await ctx.db.players.count({ where: { lobbyId } });
        if (playerCount >= 66) {
          void ctx.db.lobby.update({
            where: {
              id: player.lobbyId,
            },
            data: {
              started: true,
            },
          });
        }
      };

      try {
        const lobby = await findLobby();
        if (lobby) {
          void joinLobby(lobby.id);
          console.log(lobby);
          return lobby;
        } else {
          const newLobby = await createNewLobby();
          void joinLobby(newLobby.id);
          console.log(lobby);
          return newLobby; // Return the lobby ID for a new lobby
        }
      } catch (error) {
        console.error("Error managing lobby:", error);
        throw error; // Propagate the error to the caller
      }
    }),

  lobbyCleanUp: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.auth.userId;

    const deletedPlayer = await ctx.db.players.delete({
      where: { userId: user ?? undefined },
      select: { lobbyId: true },
    });

    const lobbyId = deletedPlayer.lobbyId;

    const [lobby, playerCount] = await Promise.all([
      ctx.db.lobby.findUnique({ where: { id: lobbyId } }),
      ctx.db.players.count({ where: { lobbyId } }),
    ]);

    const db = initAdmin().database();

    if (playerCount <= 0) {
      await Promise.all([
        ctx.db.lobby.delete({ where: { id: lobbyId } }),
        db.ref(`${lobby?.gameType}/${lobbyId}`).remove(),
      ]);
    }
  }),
});

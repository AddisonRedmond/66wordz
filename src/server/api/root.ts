import { createTRPCRouter } from "~/server/api/trpc";
import { quickPlayRouter } from "./routers/quick-play";
import { createLobbyRouter } from "./routers/create-lobby";
import { checkoutRouter } from "./routers/checkout-session";
import { getUserRouter } from "./routers/get-user";
import { friendsRouter } from "./routers/friends";
import { challengeRouter } from "./routers/challenge";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quickPlay: quickPlayRouter,
  createGame: createLobbyRouter,
  upgrade: checkoutRouter,
  getUser: getUserRouter,
  friends: friendsRouter,
  challenge: challengeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { createTRPCRouter } from "~/server/api/trpc";
import { quickPlayRouter } from "./routers/quick-play";
import { reportIssueRouter } from "./routers/issue-report";
import { createLobbyRouter } from "./routers/create-lobby";
import { checkoutRouter } from "./routers/checkout-session";
import { getUserRouter } from "./routers/get-user";
import { friendsRouter } from "./routers/friends";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quickPlay: quickPlayRouter,
  reportIssue: reportIssueRouter,
  createGame: createLobbyRouter,
  upgrade: checkoutRouter,
  getUser: getUserRouter,
  friends: friendsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

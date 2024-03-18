import { createTRPCRouter } from "~/server/api/trpc";
import { publicGameRouter } from "./routers/public-game";
import { eliminationRouter } from "./routers/elimination";
import { reportIssueRouter } from "./routers/issue-report";
import { createLobbyRouter } from "./routers/create-lobby";
import { checkoutRouter } from "./routers/checkout-session";
import { getUserRouter } from "./routers/get-user";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  public: publicGameRouter,
  elimination: eliminationRouter,
  reportIssue: reportIssueRouter,
  createGame: createLobbyRouter,
  upgrade: checkoutRouter,
  getUser: getUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

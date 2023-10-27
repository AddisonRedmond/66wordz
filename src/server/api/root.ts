import { createTRPCRouter } from "~/server/api/trpc";
import { publicGameRouter } from "./routers/public-game";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  public: publicGameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

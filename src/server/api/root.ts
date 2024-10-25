import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { todoRouter } from "~/server/api/routers/todo";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

//定義したルータをサーバのプライマリルーターに渡す
export const appRouter = createTRPCRouter({
  todo: todoRouter,
});

// APIの型定義をエクスポート
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

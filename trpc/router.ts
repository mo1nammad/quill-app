import { router, publicProcedure } from "./trpc";

export const appRouter = router({
   hello: publicProcedure.query(async () => [1, 2, 3]),
});
export type AppRouter = typeof appRouter;

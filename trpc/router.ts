import { router } from "./trpc";

// queries
import { authCallback, getUserFiles, deleteFile } from "./queries";

export const appRouter = router({
   authCallback,
   getUserFiles,
   deleteFile,
});

export type AppRouter = typeof appRouter;

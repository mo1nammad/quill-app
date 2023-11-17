import { router } from "./trpc";

// queries
import { authCallback, getUserFiles, deleteFile, getUTFiles } from "./queries";

export const appRouter = router({
   authCallback,
   getUserFiles,
   deleteFile,
   getUTFiles,
});

export type AppRouter = typeof appRouter;

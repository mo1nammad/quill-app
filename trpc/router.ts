import { router } from "./trpc";

// queries
import {
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
} from "./queries";

export const appRouter = router({
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
});

export type AppRouter = typeof appRouter;

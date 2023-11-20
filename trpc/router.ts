import { router } from "./trpc";

// queries
import {
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
   getFileUploadedStatus,
} from "./queries";

export const appRouter = router({
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
   getFileUploadedStatus,
});

export type AppRouter = typeof appRouter;

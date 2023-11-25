import { router } from "./trpc";

// queries
import {
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
   getFileUploadedStatus,
   getFileMessages,
} from "./queries";

export const appRouter = router({
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
   getFileUploadedStatus,
   getFileMessages,
});

export type AppRouter = typeof appRouter;

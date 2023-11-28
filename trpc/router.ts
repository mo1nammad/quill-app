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
   getUploadedFileAmount,
} from "./queries";

export const appRouter = router({
   authCallback,
   getUserFiles,
   deleteFile,
   getUploadedFiles,
   submitUploadedFiles,
   getFileUploadedStatus,
   getFileMessages,
   getUploadedFileAmount,
});

export type AppRouter = typeof appRouter;

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { db } from "@/lib/db";
import { INFINTE_QUERY_LIMIT } from "@/config/infinit-query";
import { File as DbFile, $Enums } from "@prisma/client";
type UploadStatus = $Enums.UploadStatus;

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";

export const authCallback = publicProcedure.query(async () => {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

   // check if user exist in database
   const dbUser = await db.user.findUnique({
      where: {
         id: user.id,
         email: user.email ?? undefined,
      },
   });
   if (dbUser) return { success: true };

   // sync user if does not exist in db
   await db.user.create({
      data: {
         id: user.id,
         email: user.email ?? undefined,
      },
   });

   return { success: true };
});

export const getUserFiles = privateProcedure.query<DbFile[]>(
   async ({ ctx }) => {
      const { userId } = ctx;
      const files = await db.file.findMany({
         where: {
            userId,
         },
         orderBy: {
            createdAt: "desc",
         },
      });
      return files;
   }
);

export const deleteFile = privateProcedure
   .input(
      z.object({
         fileId: z.string(),
      })
   )
   .mutation(async ({ ctx, input }) => {
      try {
         const { userId } = ctx;
         const file = await db.file.findUnique({
            where: {
               id: input.fileId,
               userId,
            },
         });
         if (!file) throw new TRPCError({ code: "NOT_FOUND" });

         const pineconeIndex = pinecone.Index("quill-app");

         // restore vector ids for deleting
         try {
            const fileVectors = await db.vector.findMany({
               where: {
                  fileId: file.id,
               },
            });
            const fileVectorsId = fileVectors.map((vector) => vector.id);
            await pineconeIndex.deleteMany(fileVectorsId);
         } catch (error) {
            console.log(error);
         }

         return await db.file.delete({
            where: {
               id: input.fileId,
               userId,
            },
         });
      } catch (error) {
         console.log(error);
         throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
   });

export const getUploadedFileAmount = privateProcedure.query(
   async ({ ctx: { userId } }) => {
      const fileAmount = await db.file.count({
         where: {
            userId,
         },
      });

      // TODO add Pro Plan limits
      return {
         amount: fileAmount,
      };
   }
);

export const getUploadedFiles = privateProcedure
   .input(
      z.object({
         url: z.string(),
      })
   )
   .mutation(async ({ ctx, input }) => {
      const { url, userId } = { ...ctx, ...input };

      const file = await db.file.findFirst({
         where: {
            url,
            userId,
         },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
   });

export const submitUploadedFiles = privateProcedure
   .input(
      z.object({
         name: z.string(),
         url: z.string(),
      })
   )
   .mutation(async ({ ctx, input }) => {
      const { userId, name, url } = { ...ctx, ...input };

      const file = await db.file.create({
         data: { name, url, userId, uploadStatus: "PROCESSING" },
      });
      try {
         const response = await fetch(url);
         const blob = await response.blob();

         const loader = new PDFLoader(blob);
         const pageLevelContent = await loader.load();
         pageLevelContent.forEach((doc) => (doc.metadata.fileId = file.id));

         const pagesAmt = pageLevelContent.length;

         // TODO add PRO limits after adding subscription plan
         // as user is not pro
         const isFreeExceeded = pagesAmt > 5;
         if (isFreeExceeded) {
            return await db.file.update({
               where: {
                  id: file.id,
               },
               data: {
                  uploadStatus: "FAILED",
               },
            });
         }
         // vectorize and index entries document

         const pineconeIndex = pinecone.Index("quill-app");
         const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
         });

         const vectorStore = new PineconeStore(embeddings, {
            pineconeIndex,
         });
         const vectorsId = await vectorStore.addDocuments(pageLevelContent);

         // save vector id to database for further deleting api
         vectorsId.forEach(async (value) => {
            await db.vector.create({
               data: {
                  id: value,
                  fileId: file.id,
               },
            });
         });

         await db.file.update({
            where: {
               id: file.id,
            },
            data: {
               uploadStatus: "SUCCEED",
            },
         });
      } catch (error) {
         console.log(error);

         await db.file.update({
            where: {
               id: file.id,
            },
            data: {
               uploadStatus: "FAILED",
            },
         });
      }
   });

export const getFileUploadedStatus = privateProcedure
   .input(
      z.object({
         fileId: z.string(),
      })
   )
   .query(async ({ ctx, input }): Promise<{ status: UploadStatus }> => {
      const file = await db.file.findUnique({
         where: {
            id: input.fileId,
            userId: ctx.userId,
         },
      });

      if (!file) return { status: "PENDING" };

      return { status: file.uploadStatus };
   });

export const getFileMessages = privateProcedure
   .input(
      z.object({
         limit: z.number().min(1).max(100).nullish(),
         cursor: z.string().nullish(),
         fileId: z.string(),
      })
   )
   .query(async ({ ctx, input }) => {
      const { fileId, userId, cursor } = { ...ctx, ...input };
      const limit = input.limit ?? INFINTE_QUERY_LIMIT;

      const file = await db.file.findFirst({
         where: {
            id: fileId,
            userId,
         },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const fileMessages = await db.message.findMany({
         where: {
            fileId,
            userId,
         },
         take: limit + 1,
         orderBy: {
            createdAt: "desc",
         },
         cursor: cursor ? { id: cursor } : undefined,
         select: {
            id: true,
            isUserMassage: true,
            createdAt: true,
            text: true,
         },
      });

      let nextCursor: typeof cursor | undefined;
      if (fileMessages.length > limit) {
         const nextItem = fileMessages.pop();
         nextCursor = nextItem?.id;
      }

      return {
         fileMessages,
         nextCursor,
      };
   });

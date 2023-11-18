import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { db } from "@/lib/db";
import { File as DbFile } from "@prisma/client";

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
      const { userId } = ctx;
      const file = await db.file.findUnique({
         where: {
            id: input.fileId,
            userId,
         },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return await db.file.delete({
         where: {
            id: input.fileId,
            userId,
         },
      });
   });

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
      return file;
   });

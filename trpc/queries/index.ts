import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { db } from "@/lib/db";

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

export const getUserFiles = privateProcedure.query(async ({ ctx }) => {
   const { userId } = ctx;
   return await db.file.findMany({
      where: {
         userId,
      },
   });
});

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

export const getUTFiles = privateProcedure
   .input(
      z.object({
         key: z.string(),
      })
   )
   .mutation(async ({ ctx, input }) => {
      const { key, userId } = { ...ctx, ...input };

      const file = await db.file.findFirst({
         where: {
            key,
            userId,
         },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
   });

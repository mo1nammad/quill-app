"use server";

import auth from "./auth";
import { db } from "@/lib/db";

type SendMessageProps = {
   fileId: string;
   message: string;
};

export async function sendMessage({ fileId, message }: SendMessageProps) {
   const { userId } = await auth();

   const file = await db.file.findUnique({
      where: {
         id: fileId,
         userId,
      },
   });

   if (!file)
      throw new Error("file not found", {
         cause: "file does not exist in database",
      });

   await db.message.create({
      data: {
         userId,
         isUserMassage: true,
         text: message,
      },
   });
}

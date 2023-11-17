import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
const f = createUploadthing();

const auth = async () => {};

export const ourFileRouter = {
   pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
      .middleware(async () => {
         const { getUser } = getKindeServerSession();
         const user = await getUser();
         if (!user || !user.id) throw new Error("Unauthorized");
         return user;
      })

      .onUploadComplete(async ({ file, metadata }) => {
         await db.file.create({
            data: {
               key: file.key,
               name: file.name,
               url: file.url,
               userId: metadata.id,
               uploadStatus: "PROCESSING",
            },
         });
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

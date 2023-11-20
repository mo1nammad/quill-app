import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";
import RenderPdf from "./_components/RenderPdf";
import ChatWrapper from "./_components/ChatWrapper";
import Link from "next/link";

type PageProps = {
   params: {
      fileId: string;
   };
};

export default async function page({ params: { fileId } }: PageProps) {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

   const file = await db.file.findUnique({
      where: {
         id: fileId,
         userId: user.id,
      },
   });
   if (!file) notFound();

   return (
      <main className="flex flex-col justify-between h-[calc(100vh-3.5rem)]">
         <div className="mx-auto w-full grow xl:flex xl:flex-row-reverse xl:px-2">
            {/* left side (PDF) */}
            <div className="flex-1 xl:flex ">
               <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                  <RenderPdf url={file.url} />
               </div>
            </div>
            {/* right side (Chat) */}
            <div className="flex-[0.75] border-t border-border xl:w-96 xl:border-l xl:border-t-0">
               <ChatWrapper fileId={fileId} />
            </div>
         </div>
      </main>
   );
}

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";
import RenderPdf from "./_components/RenderPdf";
import ChatWrapper from "./_components/ChatWrapper";

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
         <div className="mx-auto w-full max-w-7xl grow lg:flex lg:flex-row-reverse xl:px-2">
            {/* left side (PDF) */}
            <div className="flex-1 xl:flex ">
               <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                  <RenderPdf />
               </div>
            </div>
            {/* right side (Chat) */}
            <div className="shrink-0 flex-[0.75] border-t border-border lg:w-96 lg:border-l lg:border-t-0">
               <ChatWrapper />
            </div>
         </div>
      </main>
   );
}

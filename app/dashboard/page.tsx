import React from "react";
import { redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";

import Uploadbutton from "./_components/Uploadbutton";
import DashboardFiles from "./_components/DashboardFiles";

export default async function Page() {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

   const dbUser = await db.user.findUnique({
      where: {
         id: user.id,
      },
   });
   if (!dbUser) redirect("/auth-callback?origin=dashboard");

   return (
      <main className="mx-auto px-3 pb-3 max-w-7xl md:p-10">
         <div className="mt-8 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:gap-0 sm:items-center">
            <h1 className="mb-3 font-bold text-5xl text-accent-foreground">
               فایل های من
            </h1>

            <Uploadbutton />
         </div>

         <DashboardFiles />
      </main>
   );
}

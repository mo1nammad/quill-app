import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default async function layout({ children }: PropsWithChildren) {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (!user || !user.id) {
      redirect("api/auth/login");
   }
   return <>{children}</>;
}

"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function auth() {
   const { getUser } = getKindeServerSession();
   const user = await getUser();
   if (!user || !user.id) throw new Error("Unauthorized");

   return { userId: user.id };
}

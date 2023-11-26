"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type ConfigAuth = "email" | "given_name" | "family_name" | "picture";

export default async function auth(...config: ConfigAuth[]) {
   const { getUser } = getKindeServerSession();
   const user = await getUser();
   if (!user || !user.id) throw new Error("Unauthorized");

   const returnObj: Record<string, any> = { userId: user.id };

   config.forEach((value) => {
      returnObj[value] = user[value];
   });

   return returnObj;
}

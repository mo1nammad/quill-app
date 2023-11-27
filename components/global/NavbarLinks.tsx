import React from "react";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { buttonVariants } from "../ui/button";

import UserAccountNav from "./UserAccountNav";
import Link from "next/link";

export default async function NavbarLinks() {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   return (
      <>
         {user ? (
            <UserAccountNav
               email={user.email}
               imageUrl={user.picture}
               familyName={user.family_name}
               givenName={user.given_name}
            />
         ) : (
            <Link
               href={"/api/auth/login"}
               className={buttonVariants({
                  variant: "default",
                  size: "sm",
               })}
            >
               ورود
            </Link>
         )}
      </>
   );
}

{
   /* <>
         {user ? (
            <UserAccountNav
               email={user.email}
               imageUrl={user.picture}
               familyName={user.family_name}
               givenName={user.family_name}
            />
         ) : (
            <LoginLink
               className={buttonVariants({
                  variant: "default",
                  size: "sm",
               })}
            >
               ورود
            </LoginLink>
         )}
      </> */
}

"use client";

import React from "react";

import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "../ui/button";

export default function NavbarRoutes() {
   const { user } = useKindeBrowserClient();

   return (
      <>
         {user ? (
            <p className="text-muted-foreground">{user.email}</p>
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
      </>
   );
}

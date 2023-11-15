"use client";

import React from "react";

import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "../ui/button";

export default function NavbarRoutes() {
   const { user, isLoading } = useKindeBrowserClient();

   return (
      <>
         {user ? (
            <p className="text-muted-foreground">{user.email}</p>
         ) : (
            !isLoading && (
               <LoginLink
                  className={buttonVariants({
                     variant: "default",
                     size: "sm",
                  })}
               >
                  ورود
               </LoginLink>
            )
         )}
      </>
   );
}

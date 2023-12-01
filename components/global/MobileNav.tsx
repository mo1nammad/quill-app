"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

import { ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";

export default function MobileNav({ user }: { user: KindeUser | null }) {
   const [open, setOpen] = useState(false);
   const pathname = usePathname();

   const toggleOpen = () => setOpen((prev) => !prev);

   useEffect(() => {
      if (open) toggleOpen();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pathname]);

   const closeOnCurrent = (href: string) => {
      if (pathname.includes(href)) {
         toggleOpen();
      }
   };

   return (
      <Sheet open={open} onOpenChange={toggleOpen}>
         <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="sm">
               <Menu className="relative z-50 w-5 h-5 text-foreground" />
            </Button>
         </SheetTrigger>
         <SheetContent side="top">
            <div className="flex flex-col mt-5 font-sans">
               {user?.given_name || user?.family_name ? (
                  <h5>{`${user?.given_name} ${user?.family_name}`}</h5>
               ) : null}
               {user?.email ? (
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
               ) : null}
            </div>

            <ul className="pt-6 flex flex-col w-full h-fit gap-5">
               {!user ? (
                  <>
                     <li>
                        <Link
                           className="flex items-center w-full font-semibold"
                           href="/sign-in"
                        >
                           ورود
                        </Link>
                     </li>
                     <li>
                        <Link
                           onClick={() => closeOnCurrent("/pricing")}
                           className="flex items-center w-full font-semibold"
                           href="/pricing"
                        >
                           تعرفه ها
                        </Link>
                     </li>
                  </>
               ) : (
                  <>
                     <li>
                        <Link
                           onClick={() => closeOnCurrent("/dashboard")}
                           className="flex items-center w-full font-semibold"
                           href="/dashboard"
                        >
                           داشبورد
                        </Link>
                     </li>
                     <li>
                        <LogoutLink className="flex items-center w-full font-semibold">
                           خروج از حساب کاربری
                        </LogoutLink>
                     </li>
                  </>
               )}
            </ul>
         </SheetContent>
      </Sheet>
   );
}

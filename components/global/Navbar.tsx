import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";

import { buttonVariants } from "../ui/button";
import NavbarRoutes from "./NavbarRoutes";

export default async function Navbar() {
   return (
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-b-border bg-background/60 backdrop-blur-lg transition-all">
         <MaxWidthWrapper>
            <div className="flex h-14 items-center justify-between border-b">
               <Link href="/" className="flex z-40 font-semibold font-sans">
                  <span>Quill</span>
               </Link>
               {/* todo :add mobile navigation */}

               <div className="hidden items-center gap-x-4 sm:flex">
                  <Link
                     href={"/pricing"}
                     className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                     })}
                  >
                     تعرفه ها
                  </Link>
                  <NavbarRoutes />
               </div>
            </div>
         </MaxWidthWrapper>
      </nav>
   );
}
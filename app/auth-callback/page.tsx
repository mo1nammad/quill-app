"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { trpc } from "../_trpc/client";

import { Loader2 } from "lucide-react";

export default function Page() {
   const router = useRouter();
   const { user } = useKindeBrowserClient();

   const searchParams = useSearchParams();

   const origin = searchParams.get("origin");

   const { data, error } = trpc.authCallback.useQuery(undefined, {
      retry: false,
   });

   useEffect(() => {
      if (data?.success) router.push(origin ? `/${origin}` : "/dashboard");
      else if (error?.data?.code === "UNAUTHORIZED") {
         console.log("unauth");
         router.push("/sign-in?post_login_redirect_url=/dashboard");
      }
   }, [data?.success, error?.data, origin, router]);

   useEffect(() => {
      if (!user || !user.id) {
         router.push("/sign-in");
      }
   }, []);

   return (
      <div className="flex mt-24 w-full justify-center">
         <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            <h3 className="font-semibold text-xl">
               در حال همگام سازی داده ها ...
            </h3>
         </div>
      </div>
   );
}

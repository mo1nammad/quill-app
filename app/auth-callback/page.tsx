"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";

export default function Page() {
   const router = useRouter();
   const searchParams = useSearchParams();

   const origin = searchParams.get("origin");

   return <div>page</div>;
}

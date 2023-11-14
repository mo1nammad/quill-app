"use client";
import React, { PropsWithChildren, useState } from "react";

import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/app/_trpc/client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function Providers({ children }: PropsWithChildren) {
   const [queryClient] = useState(() => new QueryClient());
   const [trpcClient] = useState(() =>
      trpc.createClient({
         links: [
            httpBatchLink({
               url: `${process.env.NEXT_PUBLIC_ROUTE!}/api/trpc`,
            }),
         ],
      })
   );
   return (
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
         <QueryClientProvider client={queryClient}>
            {children}
         </QueryClientProvider>
      </trpc.Provider>
   );
}

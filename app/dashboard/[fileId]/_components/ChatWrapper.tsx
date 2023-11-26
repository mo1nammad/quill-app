"use client";

import React from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

import { ChevronLeft, Loader2, XCircle } from "lucide-react";

// components
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ChatContextProvider from "./ChatContext";

export default function ChatWrapper({ fileId }: { fileId: string }) {
   const { data: fileStatus, isLoading } = trpc.getFileUploadedStatus.useQuery(
      { fileId },
      {
         refetchInterval: (data) =>
            data?.status === "FAILED" || data?.status === "SUCCEED"
               ? false
               : 500,
      }
   );

   if (isLoading)
      return (
         <div className="relative min-h-full flex divide-y divide-border flex-col justify-between gap-2">
            <div className="flex-1 flex justify-center items-center flex-col py-12">
               <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <h3 className="font-semibold text-xl">در حال بارگیری</h3>
                  <p className="text-sm text-muted-foreground">
                     PDF شما تقریبا آماده است
                  </p>
               </div>
            </div>
         </div>
      );

   if (fileStatus?.status === "PROCESSING")
      return (
         <div className="relative min-h-full flex divide-y divide-border flex-col justify-between gap-2">
            <div className="flex-1 flex justify-center items-center flex-col py-12">
               <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <h3 className="font-semibold text-xl">
                     فایل در حال پردازش است
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     لطفا منتظر بمانید. این مرحله خیلی طول نخواهد کشید
                  </p>
               </div>
            </div>
         </div>
      );

   if (fileStatus?.status === "FAILED")
      return (
         <div className="relative min-h-full flex divide-y divide-border flex-col justify-between gap-2 px-3">
            <div className="flex-1 flex justify-center items-center flex-col py-12">
               <div className="flex flex-col items-center text-center gap-3">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <h3 className="font-semibold text-xl">
                     این تعداد صفحه در PDF پشتیبانی نمی شود
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     باید پلن خود را به{" "}
                     <Link
                        href="/pricing"
                        className="text-primary font-semibold underline underline-offset-4"
                     >
                        پلن حرفه ای
                     </Link>{" "}
                     تغییر دهید یا در صورت وجود اشکال فنی به ادمین سایت پیغام
                     دهید
                  </p>
               </div>
               <Link
                  href="/dashboard"
                  className={cn(
                     buttonVariants({ variant: "secondary" }),
                     "mt-6"
                  )}
               >
                  بازگشت به داشبورد
                  <ChevronLeft className="w-5 h-5 mr-1" />
               </Link>
            </div>
         </div>
      );

   return (
      <ChatContextProvider fileId={fileId}>
         <div className="relative h-full flex divide-y divide-border flex-col justify-between gap-2">
            <div className="flex-1 relative justify-between flex flex-col mb-28">
               <Messages fileId={fileId} />
            </div>

            <ChatInput />
         </div>
      </ChatContextProvider>
   );
}

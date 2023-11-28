"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UploadDropzone from "./UploadDropzone";
import { trpc } from "@/app/_trpc/client";
import {
   Tooltip,
   TooltipProvider,
   TooltipTrigger,
   TooltipContent,
} from "@/components/ui/tooltip";

export default function Uploadbutton({ userId }: { userId: string }) {
   const { data, isLoading } = trpc.getUploadedFileAmount.useQuery(undefined, {
      refetchInterval: 1000,
   });

   const isDisabled = (data && data.amount >= 5) || isLoading;
   return (
      <Dialog>
         <TooltipProvider>
            <Tooltip delayDuration={50}>
               <TooltipTrigger asChild>
                  <Button asChild size="lg" disabled={isDisabled}>
                     <DialogTrigger>
                        آپلود <span className="pr-1 font-sans">PDF</span>
                     </DialogTrigger>
                  </Button>
               </TooltipTrigger>

               {isDisabled && (
                  <TooltipContent side="bottom" align="end">
                     شما به محدودیت حداکثر فایل مجاز رسیده اید
                  </TooltipContent>
               )}
            </Tooltip>
         </TooltipProvider>

         <DialogContent>
            <UploadDropzone />
         </DialogContent>
      </Dialog>
   );
}

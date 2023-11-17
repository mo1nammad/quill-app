"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

import { useEdgeStore } from "@/lib/edgestore";
import { useUploadThing } from "@/lib/uploadthing";
import Dropzone from "react-dropzone";

import { Cloud, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export default function UploadDropzone() {
   const router = useRouter();
   const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState<number>(0);

   const { edgestore } = useEdgeStore();
   const { toast } = useToast();

   // api
   const { mutate: startPolling } = trpc.getUploadedFiles.useMutation({
      onSuccess({ id }) {
         toast({ variant: "default", title: "فایل مورد نظر آپلود شد" });
         router.push(`/dashboard/${id}`);
      },
      retry: true,
      retryDelay: 500,
   });

   const { mutate: submitFile } = trpc.submitUploadedFiles.useMutation({
      retry: true,
      retryDelay: 500,
   });

   const startSimulateProgress = () => {
      setUploadProgress(0);

      const interval = setInterval(() => {
         setUploadProgress((preValue) => {
            if (preValue >= 95) return preValue;

            return preValue + 5;
         });
      }, 500);

      return interval;
   };

   const handleUpload = async (acceptedFile: File[]) => {
      setUploadProgress(0);
      // check file type
      if (acceptedFile[0].type !== "application/pdf") {
         toast({
            variant: "destructive",
            title: "لطفا فایل PDF ارسال کنید",
            description: "فایل مورد نظر حداکثر باید 4MB باشد",
         });
         return;
      }

      setIsUploading(true);

      // handle file uploading

      const res = await edgestore.publicPdfUploader.upload({
         file: acceptedFile[0],
         onProgressChange(progress) {
            setUploadProgress(progress);
         },
      });

      console.log(res);

      if (!res) {
         toast({
            variant: "destructive",
            title: "مشکلی پیش آمد",
            description: "ممکن است اتصال به اینترنت دچار اختلال شده باشد",
         });
         return;
      }

      submitFile({
         name: acceptedFile[0].name,
         url: res.url,
      });

      startPolling({ url: res.url });
   };

   return (
      <Dropzone multiple={false} onDrop={handleUpload}>
         {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div
               {...getRootProps()}
               className="border h-64 m-4 border-dashed border-border rounded-lg"
            >
               <input {...getInputProps()} />
               <div className="flex items-center justify-center w-full h-full">
                  <label
                     htmlFor="dropzone-file"
                     className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-background hover:bg-accent"
                  >
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Cloud className="w-8 h-8 text-muted-foreground mb-2" />
                        <div className="mb-2 text-sm text-muted-foreground text-center space-y-2">
                           <h6 className="font-semibold text-accent-foreground">
                              برای آپلود کلیک کنید
                           </h6>{" "}
                           <p>یا فایل مورد نظر را به داخل این محدوده بکشید</p>
                        </div>
                        <p className="font-sans text-xs text-muted-foreground">
                           PDF (up to 4MB)
                        </p>
                     </div>

                     {!!acceptedFiles?.[0] && (
                        <div
                           dir="ltr"
                           className="max-w-xs bg-background flex items-center rounded-md overflow-hidden outline outline-[1px] outline-border divide-x divide-border"
                        >
                           <div className="px-3 py-2 h-full grid place-items-center">
                              <File className="h-4 w-4 text-primary" />
                           </div>
                           <div className="px-3 py-2 h-full text-sm truncate">
                              {acceptedFiles[0].name}
                           </div>
                        </div>
                     )}

                     {isUploading && (
                        <div className="w-full mt-4 max-w-xs mx-auto">
                           <Progress
                              value={uploadProgress}
                              className="h-1 w-full bg-zinc-200 dark:bg-zinc-600"
                           />
                        </div>
                     )}
                  </label>
               </div>
            </div>
         )}
      </Dropzone>
   );
}

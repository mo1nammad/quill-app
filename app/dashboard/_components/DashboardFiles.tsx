"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { formatDate } from "@/lib/utils";

import { Ghost, Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEdgeStore } from "@/lib/edgestore";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardFiles() {
   // hooks
   const [isDeleting, setIsDeleting] = useState(false);
   const [currentDeletingFile, setCurrentDeletingFile] = useState<
      string | null
   >(null);
   const utils = trpc.useUtils();
   const { edgestore } = useEdgeStore();
   const { toast } = useToast();

   // api
   const { data: files, isLoading } = trpc.getUserFiles.useQuery();
   const { mutate: deleteFile } = trpc.deleteFile.useMutation({
      async onSuccess({ url }) {
         toast({
            variant: "default",
            title: "فایل حذف شد",
         });
         await utils.getUserFiles.invalidate();
      },
      onMutate({ fileId }) {
         setCurrentDeletingFile(fileId);
      },
      onSettled() {
         setCurrentDeletingFile(null);
         setIsDeleting(false);
      },
      retry: true,
   });

   // funcs
   const isCurrentDeleting = (id: string) =>
      id === currentDeletingFile ? true : false;

   // handling

   // contents
   const fileContent = (
      <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-border md:grid-cols-2 lg:grid-cols-3">
         {files
            ?.sort(
               (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
            )
            .map((file) => (
               <li
                  className="col-span-1 divide-y rounded-lg bg-white border shadow hover:shadow-lg transition-shadow dark:bg-muted dark:hover:bg-muted-foreground/30"
                  key={file.id}
               >
                  <Link
                     href={`/dashboard/${file.id}`}
                     className="flex flex-col gap-2"
                  >
                     <div className="px-6 pt-6 flex w-full items-center justify-between gap-x-6">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                        <div className="flex-1 truncate">
                           <div className="flex items-center space-x-3">
                              <h3 className="truncate text-lg font-medium text-foreground">
                                 {file.name}
                              </h3>
                           </div>
                        </div>
                     </div>
                  </Link>

                  <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-muted-foreground">
                     <div className="col-span-1 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {formatDate(file.createdAt)}
                     </div>
                     <div className="flex items-center gap-x-2">
                        <MessageSquare className="h-4 w-4 " />
                        mocked
                     </div>
                     <Button
                        onClick={async () => {
                           try {
                              setIsDeleting(true);
                              await edgestore.publicPdfUploader.delete({
                                 url: file.url,
                              });
                              deleteFile({ fileId: file.id });
                           } catch (error) {
                              throw error;
                           }
                        }}
                        size="sm"
                        type="button"
                        variant="destructive"
                        className="w-full"
                        disabled={isDeleting}
                     >
                        {isDeleting ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                           <Trash2 className="w-4 h-4" />
                        )}
                     </Button>
                  </div>
               </li>
            ))}
      </ul>
   );

   const noContent = (
      <div className="mt-16 flex flex-col items-center gap-2">
         <Ghost className="h-8 w-8 text-accent-foreground " />
         <h3 className="font-semibold text-xl ">هیچ فایلی وجود ندارد</h3>
         <p className="text-muted-foreground text-sm">یک فایل PDF اپلود کنید</p>
      </div>
   );

   const loadingContent = (
      <div className="w-full mt-10 px-4 grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5">
         <Skeleton className="h-24 my-2" />
         <Skeleton className="h-24 my-2" />
         <Skeleton className="h-24 my-2" />
         <Skeleton className="h-24 my-2 hidden md:block" />
         <Skeleton className="h-24 my-2 hidden md:block" />
         <Skeleton className="h-24 my-2 hidden md:block" />
      </div>
   );

   return (
      <>
         {files && !!files.length
            ? fileContent // files tsx
            : isLoading
            ? loadingContent // loading tsx
            : noContent}
      </>
   );
}

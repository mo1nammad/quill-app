"use client";

import React, { useEffect, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { cn } from "@/lib/utils";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import ReactResizeDetector from "react-resize-detector";
import { useToast } from "@/components/ui/use-toast";

import {
   ChevronDown,
   ChevronUp,
   Loader2,
   RotateCcw,
   RotateCw,
   Search,
   Maximize,
   Expand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type PdfProps = {
   url: string;
};

export default function RenderPdf({ url }: PdfProps) {
   const { toast } = useToast();

   const [numPages, setNumPages] = useState<number>();
   const [currPage, setCurrPage] = useState<number>(1);
   const [scale, setScale] = useState<number>(1);
   const [rotation, setRotation] = useState<number>(0);
   const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

   const fullscreen = useFullScreenHandle();
   const handleFullscreenButton = () => {
      if (isFullscreen) {
         fullscreen.exit();
         setIsFullscreen(false);
      } else {
         fullscreen.enter();
         setIsFullscreen(true);
      }
   };

   const inputSchema = zod.object({
      page: zod.coerce
         .string()
         .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
   });
   type InputSchema = zod.infer<typeof inputSchema>;

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      clearErrors,
   } = useForm<InputSchema>({
      resolver: zodResolver(inputSchema),
      defaultValues: {
         page: "1",
      },
   });

   const submitInput = (data: InputSchema) => {
      setCurrPage(+data.page);
      setValue("page", data.page);
   };

   useEffect(() => {
      setValue("page", String(currPage));
      clearErrors();
   }, [currPage, setValue, clearErrors]);

   return (
      <FullScreen handle={fullscreen}>
         <div
            className={cn(
               "w-full mx-auto bg-background rounded-md shadow flex flex-col items-center",
               !isFullscreen && "max-w-4xl"
            )}
         >
            <div className="h-14 w-full border-b border-border dark:border dark:border-muted-foreground dark:rounded-t-lg flex flex-row-reverse items-center justify-between px-2">
               <div className="flex items-center gap-2">
                  <Button
                     disabled={numPages === undefined || currPage >= numPages}
                     onClick={() => {
                        setCurrPage((preV) =>
                           numPages && numPages <= preV ? numPages : preV + 1
                        );
                     }}
                     size="sm"
                     aria-label="next page"
                     variant={"ghost"}
                     className="hidden sm:block"
                  >
                     <ChevronUp className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2.5 font-sans">
                     <Input
                        {...register("page")}
                        className={cn(
                           "w-12 h-7 transition-all font-sans",
                           errors.page &&
                              "ring-red-600 text-red-400 focus-visible:ring-red-600"
                        )}
                        onKeyDown={(ev) => {
                           if (ev.key === "Enter") {
                              handleSubmit(submitInput)();
                           }
                        }}
                     />
                     <p className="text-base">
                        <span className="ml-2">/</span>
                        <span>{numPages ?? "x"}</span>
                     </p>
                  </div>

                  <Button
                     disabled={currPage <= 1 || numPages === undefined}
                     onClick={() =>
                        setCurrPage((preV) => (preV <= 1 ? 1 : preV - 1))
                     }
                     size="sm"
                     aria-label="next page"
                     className="hidden sm:block"
                     variant={"ghost"}
                  >
                     <ChevronDown className="h-4 w-4" />
                  </Button>
               </div>
               <div className="font-sans flex items-center gap-2">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild aria-label="zoom">
                        <Button variant="outline" size="sm" className="gap-x-2">
                           <Search className="w-4 h-4" />
                           <span className="hidden sm:inline">
                              {scale * 100}%
                           </span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setScale(1)}>
                           100%
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setScale(1.5)}>
                           150%
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setScale(2)}>
                           200%
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setScale(2.5)}>
                           250%
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                     onClick={() =>
                        setRotation((prev) => (prev === 270 ? 0 : prev + 90))
                     }
                     variant="ghost"
                     size="sm"
                     aria-label="rotate 90 degrees"
                  >
                     <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                     onClick={() =>
                        setRotation((prev) => (prev === -270 ? 0 : prev - 90))
                     }
                     variant="ghost"
                     size="sm"
                     aria-label="rotate -90 degrees"
                  >
                     <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                     onClick={handleFullscreenButton}
                     variant="ghost"
                     size="sm"
                     aria-label="rotate -90 degrees"
                  >
                     {isFullscreen ? (
                        <Maximize className="h-4 w-4" />
                     ) : (
                        <Expand className="h-4 w-4" />
                     )}
                  </Button>
               </div>
            </div>

            <div
               className={cn(
                  "flex-1 w-full max-h-screen",
                  !isFullscreen && "max-w-4xl"
               )}
            >
               <ReactResizeDetector handleWidth>
                  {({ width }) => (
                     <SimpleBar
                        className={cn(
                           "max-h-[calc(100vh-10rem)]",
                           isFullscreen && "max-h-screen"
                        )}
                     >
                        <Document
                           onLoadSuccess={({ numPages }) => {
                              setNumPages(numPages);
                           }}
                           loading={
                              <div className="flex justify-center">
                                 <Loader2 className="my-24 h-6 w-6 animate-spin animate" />
                              </div>
                           }
                           file={url}
                           className="max-h-full"
                           onError={() => {
                              toast({
                                 title: "فایل PDF بارگیری نشد",
                                 description: "دوباره امتحان کنید",
                                 variant: "destructive",
                              });
                           }}
                        >
                           <Page
                              pageNumber={currPage}
                              width={width ?? 1}
                              scale={scale}
                              rotate={rotation}
                           />
                        </Document>
                     </SimpleBar>
                  )}
               </ReactResizeDetector>
            </div>
         </div>
      </FullScreen>
   );
}

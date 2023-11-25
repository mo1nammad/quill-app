"use client";
import React, { useContext } from "react";

import { trpc } from "@/app/_trpc/client";
import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContext } from "./ChatContext";

type MessageProps = {
   fileId: string;
};

export default function Messages({ fileId }: MessageProps) {
   const { isLoading: isAiMessageLoading } = useContext(ChatContext);

   const {
      data,
      isLoading: isAllMessagesLoading,
      fetchNextPage,
      isFetching,
      isFetchingNextPage,
   } = trpc.getFileMessages.useInfiniteQuery(
      {
         fileId,
      },
      {
         getNextPageParam: ({ nextCursor }) => nextCursor,
         keepPreviousData: true,
      }
   );

   const messages = data?.pages.flatMap((page) => page.fileMessages);
   const loadingMessages = {
      createdAt: new Date().toISOString(),
      id: "loading-message",
      isUserMassage: false,
      text: (
         <span className="flex h-full items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
         </span>
      ),
   };

   const combinedMessages = [
      ...(isAiMessageLoading ? [loadingMessages] : []),
      ...(messages ?? []),
   ];

   return (
      <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-border flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
         {combinedMessages && combinedMessages.length ? (
            combinedMessages.map((message, i) => {
               const isNextMessageSamePerson =
                  combinedMessages[i - 1]?.isUserMassage ===
                  combinedMessages[i]?.isUserMassage;

               if (combinedMessages[combinedMessages.length - 1])
                  return (
                     <Message
                        key={message.id}
                        isNextMessageSamePerson={isNextMessageSamePerson}
                        message={message}
                     />
                  );

               return (
                  <Message
                     key={message.id}
                     isNextMessageSamePerson={isNextMessageSamePerson}
                     message={message}
                  />
               );
            })
         ) : isAllMessagesLoading ? (
            <div className="w-full flex flex-col gap-2 max-w-2xl mx-auto gap-y-6">
               <div className="flex items-end justify-start gap-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-16 w-1/4 rounded-bl-none" />
               </div>
               <div className="flex items-end justify-end gap-2">
                  <Skeleton className="h-16 w-1/4 rounded-bl-none" />
                  <Skeleton className="h-7 w-7" />
               </div>
               <div className="flex items-end justify-start gap-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-20 w-1/3 rounded-br-none" />
               </div>
               <div className="flex items-end justify-end gap-2">
                  <Skeleton className="h-24 w-1/2 rounded-bl-none" />
                  <Skeleton className="h-7 w-7" />
               </div>
               <div className="flex items-end justify-start gap-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-16 w-1/4 rounded-br-none" />
               </div>
               <div className="flex items-end justify-end gap-2">
                  <Skeleton className="h-16 w-1/4 rounded-bl-none" />
                  <Skeleton className="h-7 w-7" />
               </div>
               <div className="flex items-end justify-start gap-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-20 w-1/3 rounded-br-none" />
               </div>
               <div className="flex items-end justify-end gap-2">
                  <Skeleton className="h-24 w-1/2 rounded-bl-none" />
                  <Skeleton className="h-7 w-7" />
               </div>
            </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
               <MessageSquare className="h-8 w-8 text-primary " />
               <h3 className="font-semibold text-xl">منتظر دستور شما هستیم</h3>
               <p className="text-accent-foreground text-sm">
                  اولین سوال خود را از هوش مصنوعی بپرسید
               </p>
            </div>
         )}
      </div>
   );
}

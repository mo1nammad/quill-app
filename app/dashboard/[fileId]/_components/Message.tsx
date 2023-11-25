"use client";

import React from "react";

import { cn, formatDate } from "@/lib/utils";
import type { ExtendedMessage } from "@/types/message";
import { BrainCog, Loader2, User } from "lucide-react";
import ReactMarkDown from "react-markdown";

type EachMessageProps = {
   message: ExtendedMessage;
   isNextMessageSamePerson: boolean;
};

export default function Message({
   isNextMessageSamePerson,
   message,
}: EachMessageProps) {
   return (
      <div
         className={cn("flex flex-row-reverse justify-end items-end", {
            "justify-start": !message.isUserMassage,
         })}
      >
         <div
            className={cn(
               "relative flex h-6 w-6 aspect-square items-center justify-center",
               {
                  "order-2 bg-secondary border-primary border rounded-sm":
                     message.isUserMassage,
                  "order-1 bg-secondary rounded-sm": !message.isUserMassage,
                  invisible: isNextMessageSamePerson,
               }
            )}
         >
            {message.isUserMassage ? (
               <User className="fill-blue-500 text-blue-500 h-3/4 w-3/4" />
            ) : (
               <BrainCog className="fill-yellow-500 text-black h-3/4 w-3/4" />
            )}
         </div>
         <div
            className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
               "order-1 items-end": message.isUserMassage,
               "order-2 items-start": !message.isUserMassage,
            })}
         >
            <div
               className={cn("px-4 py-2 rounded-lg inline-block", {
                  "bg-primary": message.isUserMassage,
                  "bg-secondary": !message.isUserMassage,
                  "rounded-br-none":
                     !isNextMessageSamePerson && message.isUserMassage,
                  "rounded-bl-none":
                     isNextMessageSamePerson && !message.isUserMassage,
               })}
            >
               {typeof message.text !== "string" ? (
                  message.text
               ) : (
                  <ReactMarkDown
                     className={cn("prose text-secondary-foreground", {
                        "text-white": message.isUserMassage,
                     })}
                  >
                     {message.text}
                  </ReactMarkDown>
               )}
               {message.id !== "loading-message" && (
                  <div
                     className={cn(
                        "text-xs select-none mt-2 w-full text-left text-muted-foreground",
                        {
                           "text-zinc-300": message.isUserMassage,
                        }
                     )}
                  >
                     {message.id !== "isPending" ? (
                        formatDate(message.createdAt, {
                           month: "short",
                           day: "numeric",
                           hour: "numeric",
                           minute: "numeric",
                        })
                     ) : (
                        <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

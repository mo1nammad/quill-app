"use client";

import React, {
   ChangeEvent,
   PropsWithChildren,
   createContext,
   useRef,
   useState,
} from "react";

import { useMutation } from "@tanstack/react-query";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";

type ChatContextType = {
   addMessage: () => void;
   message: string;
   handleInputChange: (ev: ChangeEvent<HTMLTextAreaElement>) => void;
   isLoading: boolean;
};
export const ChatContext = createContext<ChatContextType>({
   addMessage() {},
   message: "",
   handleInputChange() {},
   isLoading: false,
});

type AppProps = PropsWithChildren<{
   fileId: string;
}>;

export default function ChatContextProvider({ fileId, children }: AppProps) {
   const [message, setMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const { toast } = useToast();

   const backupMessage = useRef("");

   const trpcUtils = trpc.useUtils();

   const { mutate: sendMessage } = useMutation({
      mutationFn: async ({
         fileId,
         message,
      }: {
         fileId: string;
         message: string;
      }) => {
         const response = await fetch("/api/chat/message", {
            method: "POST",
            body: JSON.stringify({ fileId, message }),
            headers: {
               "Content-Type": "application/json",
            },
         });
         if (!response.ok) {
            throw new Error("Failed to send message");
         }

         return response.body;
      },

      onMutate: async ({ message }) => {
         await trpcUtils.getFileMessages.cancel();
         backupMessage.current = message;
         setMessage("");

         const allPages = trpcUtils.getFileMessages.getInfiniteData();
         const previousMessages = allPages?.pages.flatMap(
            (page) => page.fileMessages
         );

         trpcUtils.getFileMessages.setInfiniteData({ fileId }, (old) => {
            if (!old)
               return {
                  pageParams: [],
                  pages: [],
               };

            let newPages = [...old.pages];
            let latestPage = newPages[0];

            latestPage.fileMessages = [
               {
                  createdAt: new Date().toISOString(),
                  id: "isPending",
                  isUserMassage: true,
                  text: message,
               },
               ...latestPage.fileMessages,
            ];

            newPages[0] = latestPage;

            return {
               ...old,
               pages: newPages,
            };
         });

         setIsLoading(true);
         return {
            previousMessages: previousMessages ?? [],
         };
      },
      onError: (error, variable, context) => {
         toast({
            title: "مشکلی به وجود آمد",
            description:
               "دسترسی به اینترنت خود را چک کنید یا به ادمین سایت پیام بدهید",
            variant: "destructive",
         });

         const { previousMessages } = context!;
         setMessage(backupMessage.current);

         trpcUtils.getFileMessages.setData(
            { fileId },
            { fileMessages: previousMessages }
         );
      },
      onSuccess: async (stream) => {
         setIsLoading(false);
         if (!stream)
            return toast({
               title: "مشکلی به وجود آمد",
               description:
                  "دسترسی به اینترنت خود را چک کنید یا به ادمین سایت پیام بدهید",
               variant: "destructive",
            });

         const decoder = new TextDecoder();
         const reader = stream.getReader();
         let aiChunk = "";
         while (true) {
            const { done, value } = await reader.read();
            if (done) {
               break;
            }
            const newChunk = decoder.decode(value, { stream: true });
            aiChunk += newChunk;

            // add it to trpc getFile state

            changeInfiniteState(aiChunk);
         }
         reader.releaseLock();
      },
      onSettled: async () => {
         setIsLoading(false);
         await trpcUtils.getFileMessages.invalidate({ fileId });
      },
   });

   const addMessage = () => sendMessage({ fileId, message });

   const handleInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) =>
      setMessage(ev.target.value);

   const changeInfiniteState = (aiChunk: string) =>
      trpcUtils.getFileMessages.setInfiniteData({ fileId }, (old) => {
         if (!old) {
            return {
               pageParams: [],
               pages: [],
            };
         }

         let updatedPages = [...old.pages];
         let latestPageMessages = old.pages[0].fileMessages;

         const isAiMessageInserted = old.pages.some((page) =>
            page.fileMessages.some((message) => message.id === "ai-response")
         );

         if (isAiMessageInserted) {
            console.log("editting latest page messages");

            latestPageMessages = latestPageMessages.map((message) => {
               if (message.id === "ai-response")
                  return {
                     ...message,
                     text: aiChunk,
                  };

               return message;
            });
         } else {
            console.log("create ai message");

            // create ai response
            latestPageMessages = [
               {
                  createdAt: new Date().toISOString(),
                  id: "ai-response",
                  isUserMassage: false,
                  text: aiChunk,
               },
               ...latestPageMessages,
            ];
         }
         updatedPages[0].fileMessages = latestPageMessages;
         console.log(updatedPages[0].fileMessages[0]);

         return {
            pageParams: old.pageParams,
            pages: updatedPages,
         };
      });
   return (
      <ChatContext.Provider
         value={{ message, addMessage, handleInputChange, isLoading }}
      >
         {children}
      </ChatContext.Provider>
   );
}

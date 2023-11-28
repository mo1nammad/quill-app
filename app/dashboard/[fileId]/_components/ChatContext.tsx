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

   const { mutate: sendMessage, status } = useMutation({
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

         return response.json() as Promise<{
            response: string | null;
         }>;
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
      onSuccess: (data) => {
         trpcUtils.getFileMessages.setInfiniteData({ fileId }, (old) => {
            if (!old) {
               return {
                  pageParams: [],
                  pages: [],
               };
            }
            let updatedPages = [...old.pages];
            let latestMessages = updatedPages[0].fileMessages;
            latestMessages = [
               {
                  createdAt: new Date().toISOString(),
                  id: "ai-resposne",
                  isUserMassage: false,
                  text: data.response ?? "failed to get response",
               },
               ...latestMessages,
            ];

            updatedPages[0].fileMessages = latestMessages;

            return {
               ...old,
               pages: updatedPages,
            };
         });
      },
      onSettled: async () => {
         setIsLoading(false);
         await trpcUtils.getFileMessages.invalidate({ fileId });
      },
   });

   const addMessage = () => sendMessage({ fileId, message });

   const handleInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) =>
      setMessage(ev.target.value);

   return (
      <ChatContext.Provider
         value={{ message, addMessage, handleInputChange, isLoading }}
      >
         {children}
      </ChatContext.Provider>
   );
}

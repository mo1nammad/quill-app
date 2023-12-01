"use client";

import React, {
   ChangeEvent,
   PropsWithChildren,
   createContext,
   useEffect,
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
   aiGeneratingResponse: string | undefined;
};
export const ChatContext = createContext<ChatContextType>({
   addMessage() {},
   message: "",
   handleInputChange() {},
   isLoading: false,
   aiGeneratingResponse: undefined,
});

type AppProps = PropsWithChildren<{
   fileId: string;
}>;

export default function ChatContextProvider({ fileId, children }: AppProps) {
   const [message, setMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const [aiGeneratingResponse, setAiGeneratingResponse] = useState<
      string | undefined
   >(undefined);

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

         while (true) {
            const { done, value } = await reader.read();
            if (done) {
               break;
            }
            const readChunk = decoder.decode(value);

            setTimeout(() => {
               setAiGeneratingResponse((prv) =>
                  !prv ? readChunk : prv + readChunk
               );
            }, 200);
         }
         reader.releaseLock();
      },
      onSettled: async () => {
         setIsLoading(false);
         await trpcUtils.getFileMessages.invalidate({ fileId });
         setAiGeneratingResponse(undefined);
      },
   });

   const addMessage = () => sendMessage({ fileId, message });

   const handleInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) =>
      setMessage(ev.target.value);

   return (
      <ChatContext.Provider
         value={{
            message,
            addMessage,
            handleInputChange,
            isLoading,
            aiGeneratingResponse,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
}

"use client";

import React, {
   ChangeEvent,
   PropsWithChildren,
   createContext,
   useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { sendMessage as sendMessageAction } from "@/actions/sendMessage";

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

   const { mutate: sendMessage } = useMutation({
      mutationFn: async ({
         fileId,
         message,
      }: {
         fileId: string;
         message: string;
      }) =>
         await fetch("/api/chat/message", {
            method: "POST",
            body: JSON.stringify({ fileId, message }),
            headers: {
               "Content-Type": "application/json",
            },
         }),
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

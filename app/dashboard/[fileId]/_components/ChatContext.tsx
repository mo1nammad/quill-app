"use client";

import React, {
   ChangeEvent,
   PropsWithChildren,
   createContext,
   useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
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

   const { mutate: sendMessage } = useMutation({});

   const addMessage = () => sendMessage();
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

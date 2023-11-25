import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useContext, useRef } from "react";
import { boolean } from "zod";

import { ChatContext } from "./ChatContext";

type ChatInputProps = {
   disable?: boolean;
};

export default function ChatInput({ disable = false }: ChatInputProps) {
   const textareaRef = useRef<HTMLTextAreaElement | null>(null);

   const { addMessage, handleInputChange, isLoading, message } =
      useContext(ChatContext);

   return (
      <div className="absolute bottom-0 left-0 w-full">
         <div className="mx-2 flex flex-row gap-3 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex h-full flex-1 items-stretch md:flex-col">
               <div className="relative flex flex-col w-full flex-grow p-4">
                  <div className="relative">
                     <Textarea
                        ref={textareaRef}
                        rows={1}
                        maxRows={4}
                        onKeyDown={(ev) => {
                           if (ev.key === "Enter" && !ev.shiftKey) {
                              ev.preventDefault();
                              addMessage();
                              textareaRef.current?.focus();
                           }
                        }}
                        onChange={handleInputChange}
                        value={message}
                        autoFocus
                        placeholder="سوال خود را بپرسید ..."
                        className="resize-none pl-16 text-base py-4 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                     />
                     <Button
                        className="absolute bottom-2.5 left-[8px]"
                        disabled={isLoading || disable}
                        aria-label="send message"
                        onClick={() => {
                           addMessage();
                           textareaRef.current?.focus();
                        }}
                     >
                        <Send className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

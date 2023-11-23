"use server";

import auth from "./auth";
import { db } from "@/lib/db";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";
import { openai } from "@/lib/openai";

import { OpenAIStream, StreamingTextResponse } from "ai";

type SendMessageProps = {
   fileId: string;
   message: string;
};

export async function sendMessage({ fileId, message }: SendMessageProps) {
   const { userId } = await auth();

   const file = await db.file.findUnique({
      where: {
         id: fileId,
         userId,
      },
   });

   if (!file)
      throw new Error("file not found", {
         cause: "file does not exist in database",
      });

   const createdMessage = await db.message.create({
      data: {
         userId,
         isUserMassage: true,
         text: message,
         fileId,
      },
   });

   // vectorize message

   const pineconeIndex = pinecone.Index("quill-app");
   const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
   });

   const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      filter: {
         fileId: createdMessage.fileId,
         userId: createdMessage.userId,
      },
      pineconeIndex,
   });

   const result = await vectorStore.similaritySearch(message, 4);

   const prevMessages = await db.message.findMany({
      where: {
         fileId,
         userId,
      },
      orderBy: {
         createdAt: "asc",
      },
      take: 6,
   });

   const formatedMessages = prevMessages.map((msg) => ({
      role: msg.isUserMassage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
   }));

   const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0301",
      temperature: 0,
      stream: true,
      messages: [
         {
            role: "system",
            content:
               "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. (probably user is going to ask questions in farsi, so answer in farsi if users native language is farsi)).",
         },
         {
            role: "user",
            content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer \n (probably user is going to ask questions in farsi, so answer in farsi if users native language is farsi).
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formatedMessages.map((message) => {
     if (message.role === "user") return `User: ${message.content}\n`;
     return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${result.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
         },
      ],
   });

   const stream = OpenAIStream(response, {
      onCompletion: async (completion) => {
         await db.message.create({
            data: {
               text: completion,
               isUserMassage: false,
               fileId,
               userId,
            },
         });
      },
   });

   // stream sent to server, TODO : display it to frontend
   return new StreamingTextResponse(stream);
}

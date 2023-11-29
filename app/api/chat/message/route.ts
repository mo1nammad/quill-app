import { NextResponse } from "next/server";
import auth from "@/actions/auth";
import { db } from "@/lib/db";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";
import { openai } from "@/lib/openai";

import { OpenAIStream, StreamingTextResponse } from "ai";

import * as zod from "zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
const postInputSchema = zod.object({
   fileId: zod.string(),
   message: zod.string().min(1),
});

export const runtime = "edge";

export async function POST(req: Request) {
   try {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user) return new NextResponse("Unauthorized", { status: 401 });
      const { id: userId } = user;

      //validation request body
      const { fileId, message } = postInputSchema.parse(await req.json());

      const file = await db.file.findUnique({
         where: {
            id: fileId,
            userId,
         },
         cacheStrategy: { swr: 60, ttl: 60 },
      });

      if (!file)
         return new NextResponse("file not found", {
            status: 404,
         });

      await db.message.create({
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
         pineconeIndex,
      });

      // getting result from  vector store
      const result = await vectorStore.similaritySearch(message, 4, {
         fileId,
      });

      const prevMessages = await db.message.findMany({
         where: {
            fileId,
            userId,
         },
         orderBy: {
            createdAt: "asc",
         },
         take: 6,
         cacheStrategy: { swr: 60, ttl: 60 },
      });

      const formatedMessages = prevMessages.map((msg) => ({
         role: msg.isUserMassage ? ("user" as const) : ("assistant" as const),
         content: msg.text,
      }));

      const response = await openai.chat.completions.create({
         model: "gpt-3.5-turbo-0301",

         messages: [
            {
               role: "system",
               content:
                  "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format and translate it to any language user speaks.",
            },
            {
               role: "user",
               content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format and translate it to any language user speaks. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
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

      // const stream = OpenAIStream(response, {
      //    onCompletion: async (completion) => {
      //       await db.message.create({
      //          data: {
      //             text: completion,
      //             isUserMassage: false,
      //             fileId,
      //             userId,
      //          },
      //       });
      //    },
      // });

      // return new StreamingTextResponse(stream);
      const aiResponse = await db.message.create({
         data: {
            isUserMassage: false,
            text:
               response.choices[0].message.content ??
               "مشکلی با هوش مصنوعی بوجود اومده لطفا با ادمین سایت تماس حاصل کنید",
            fileId,
            userId,
         },
      });
      return NextResponse.json({
         response: aiResponse.text,
      });
   } catch (error) {
      console.log("[CHAT_MESSAGE]:POST", error);
      return new NextResponse("internal server error", { status: 500 });
   }
}

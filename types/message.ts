import { AppRouter } from "@/trpc/router";
import { inferRouterOutputs } from "@trpc/server";
import { ReactNode } from "react";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getFileMessages"]["fileMessages"];

type OmtText = Omit<Messages[number], "text">;
type ExtendedText = {
   text: string | ReactNode;
};

export type ExtendedMessage = ExtendedText & OmtText;

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const formatDate = (
   date: string,
   option: Intl.DateTimeFormatOptions | undefined = {
      year: "numeric",
      month: "long",
      day: "numeric",
   }
) => new Date(date).toLocaleDateString("fa-IR", option);

import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
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

export const constructMetaData = ({
   title = "کویل -وبسایت گپ و گفت و گو با اسناد ",
   description = "کویل یک سرویس رایگان برای پرسش سوالات و دریافت اطلاعات سند PDF از هوش مصنوعی می باشد",
   image = "./thumbnail.png",
   icons = "./favicon.ico",
   noIndex = false,
}: {
   title?: string;
   description?: string;
   image?: string;
   icons?: string;
   noIndex?: boolean;
}): Metadata => ({
   title,
   description,
   openGraph: {
      images: [
         {
            url: image,
         },
      ],
      title,
      description,
   },
   twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
   },
   icons,
   metadataBase: new URL(process.env.NEXT_PUBLIC_ROUTE!),
   ...(noIndex && {
      robots: {
         index: false,
         follow: false,
      },
   }),
});

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { pricingItems } from "./constants";
import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import { ArrowLeft, Check, HelpCircle, Minus } from "lucide-react";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UpgradeButton from "./_components/UpgradeButton";

export default async function page() {
   const { getUser } = getKindeServerSession();
   const user = await getUser();

   if (!user) return redirect("/");
   const userId = user.id;

   return (
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-7xl">
         <div className="mx-auto mb-10 sm:max-w-xl">
            <h1 className="text-6xl font-bold sm:text-7xl">تعرفه</h1>
            <p className="mt-5 text-muted-foreground sm:text-lg">
               اگر فقظ به دنبال امتحان کردن کویل هستید یا به چیزی بیشتر از این
               نیاز دارید ما در خدمت شما هستیم
            </p>
         </div>
         <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <TooltipProvider>
               {pricingItems.map(
                  ({ features, plan, quota, tagline, code }, i) => {
                     const price =
                        code === 121
                           ? "رایگان"
                           : code === 200
                           ? "126 هزار تومان"
                           : null;

                     return (
                        <div
                           key={i}
                           className={cn(
                              "relative rounded-2xl bg-background shadow-lg shadow-accent",
                              {
                                 "border-primary border-2 shadow-primary":
                                    plan === "Pro",
                                 "border border-border": plan === "Free",
                              }
                           )}
                        >
                           {plan === "Pro" && (
                              <div className="absolute -top-7 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                                 همین الان ارتقا بده
                              </div>
                           )}
                           <div className="p-5 ">
                              <h3 className="my-3 text-center font-display pt-2 text-3xl font-bold">
                                 {plan === "Pro" ? "حرفه ای" : "سرگرمی"}
                              </h3>
                              <p className="text-muted-foreground">{tagline}</p>
                              <p className="mb-4 mt-5 font-display text-5xl font-semibold">
                                 {price}
                              </p>
                              <p
                                 className={cn(
                                    "text-muted-foreground",
                                    code === 121 && "invisible"
                                 )}
                              >
                                 به ازای هر ماه
                              </p>
                           </div>
                           <div className="flex h-20 items-center justify-center border-y border-border bg-muted">
                              <div className="flex items-center gap-x-1">
                                 <p className="">
                                    دسترسی به {quota.toLocaleString()} فایل در
                                    ماه
                                 </p>
                                 <Tooltip delayDuration={300}>
                                    <TooltipTrigger className="cursor-default ml-1.5">
                                       <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent className="w-80 p-2">
                                       تعداد فایل هایی که می توانید در ماه آپلود
                                       کنید
                                    </TooltipContent>
                                 </Tooltip>
                              </div>
                           </div>

                           <ul className="my-10 space-y-5 px-4">
                              {features.map((feat, i) => {
                                 const { footnote, text, negative } = feat as {
                                    text: string;
                                    footnote: string;
                                    negative?: true;
                                 };

                                 return (
                                    <li key={i} className="flex gap-5 ">
                                       <div className="shrink-0">
                                          {negative ? (
                                             <Minus className="h-6 w-6 text-muted-foreground" />
                                          ) : (
                                             <Check className="h-6 w-6 text-primary" />
                                          )}
                                       </div>
                                       {footnote ? (
                                          <div className="flex items-center gap-x-1">
                                             <p
                                                className={cn(
                                                   "text-muted-foreground",
                                                   {
                                                      "text-accent-foreground":
                                                         negative,
                                                   }
                                                )}
                                             >
                                                {text}
                                             </p>
                                             <Tooltip delayDuration={300}>
                                                <TooltipTrigger className="cursor-default ml-1.5">
                                                   <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent className="w-80 p-2">
                                                   {footnote}
                                                </TooltipContent>
                                             </Tooltip>
                                          </div>
                                       ) : (
                                          <p
                                             className={cn(
                                                "text-muted-foreground",
                                                {
                                                   "text-accent-foreground":
                                                      negative,
                                                }
                                             )}
                                          >
                                             {text}
                                          </p>
                                       )}
                                    </li>
                                 );
                              })}
                           </ul>
                           <div className="border-t border-border" />
                           <div className="p-5">
                              {plan === "Free" ? (
                                 <Link
                                    href={
                                       userId
                                          ? "/dashboard"
                                          : "/api/auth/login?post_login_redirect_url=/dashboard"
                                    }
                                    className={buttonVariants({
                                       className: "w-full",
                                       variant: "secondary",
                                    })}
                                 >
                                    {/* {userId ? "ارتقا بدهید" : "ثبت نام کنید"} */}
                                    شروع کنید
                                    <ArrowLeft className="w-5 h-5 mr-1.5" />
                                 </Link>
                              ) : userId ? (
                                 <UpgradeButton />
                              ) : (
                                 <Link
                                    href="/api/auth/login?post_login_redirect_url=/dashboard"
                                    className={buttonVariants({
                                       className: "w-full",
                                    })}
                                 >
                                    {userId ? "ارتقا بدهید" : "ثبت نام کنید"}
                                    <ArrowLeft className="w-5 h-5 mr-1.5" />
                                 </Link>
                              )}
                           </div>
                        </div>
                     );
                  }
               )}
            </TooltipProvider>
         </div>
      </MaxWidthWrapper>
   );
}

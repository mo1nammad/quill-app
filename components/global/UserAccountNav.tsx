"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
   DropdownMenuSeparator,
   DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

type Props = {
   email: string | null;
   givenName: string | null;
   familyName: string | null;
   imageUrl: string | null;
};

export default function UserAccountNav({
   email,
   familyName,
   givenName,
   imageUrl,
}: Props) {
   return (
      <DropdownMenu dir="rtl">
         <DropdownMenuTrigger asChild className="overflow-visible">
            <Button className="rounded-full w-8 h-8 aspect-square bg-accent">
               <Avatar className="relative w-8 h-8 items-center justify-center">
                  {imageUrl ? (
                     <AvatarImage
                        src={imageUrl}
                        className="relative aspect-square w-full h-full"
                     />
                  ) : (
                     <AvatarFallback>
                        <span className="sr-only">{givenName}</span>
                        <User className="h-4 w-4 text-foreground" />
                     </AvatarFallback>
                  )}
               </Avatar>
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
               <div className="flex flex-col space-y-0.5 leading-none">
                  {(!!givenName || !!familyName) && (
                     <p className="font-medium text-sm">
                        {givenName + " " + familyName}
                     </p>
                  )}
                  {!!email && (
                     <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {email}
                     </p>
                  )}
               </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
               <Link href="/dashboard" className="cursor-pointer">
                  داشبورد
               </Link>
            </DropdownMenuItem>
            {/*
                TODO: remove pricing from dashboard if user subscribed pro plan 
            */}
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
               <LogoutLink>خروج از حساب کاربری</LogoutLink>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

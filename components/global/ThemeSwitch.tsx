"use client";

import React, { useEffect, useState } from "react";

import { Switch } from "../ui/switch";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
export default function ThemeSwitch() {
   const { setTheme } = useTheme();
   const [isDark, setIsDark] = useState(false);

   useEffect(() => {
      if (isDark) {
         setTheme("dark");
      } else {
         setTheme("light");
      }
   }, [isDark, setTheme]);

   return (
      <Switch
         dir="ltr"
         className="data-[state=checked]:bg-accent"
         checked={isDark}
         onCheckedChange={(v) => setIsDark(v)}
         icon={isDark ? Moon : Sun}
         iconClassName="w-4 h-4"
      />
   );
}

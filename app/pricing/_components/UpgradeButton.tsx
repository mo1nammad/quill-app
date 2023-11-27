"use client";
import React from "react";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpgradeButton() {
   return (
      <Button className="w-full" disabled onClick={() => alert("hello")}>
         {/* همین حالا ارتقا بدهید
         <ArrowLeft className="w-5 h-5 mr-1.5" /> */}
         فعلا دسترسی وجود ندارد
      </Button>
   );
}

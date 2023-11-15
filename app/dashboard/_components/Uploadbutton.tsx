import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
export default function Uploadbutton() {
   return (
      <Dialog>
         <Button asChild size="lg">
            <DialogTrigger>
               آپلود <span className="pr-1 font-sans">PDF</span>
            </DialogTrigger>
         </Button>

         <DialogContent>example text</DialogContent>
      </Dialog>
   );
}

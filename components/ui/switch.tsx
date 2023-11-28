"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { LucideIcon, icons } from "lucide-react";

type SwitchProps = React.ComponentPropsWithoutRef<
   typeof SwitchPrimitives.Root
> & {
   icon?: LucideIcon;
   iconClassName?: string;
};

const Switch = React.forwardRef<
   React.ElementRef<typeof SwitchPrimitives.Root>,
   SwitchProps
>(({ className, icon: Icon, iconClassName, ...props }, ref) => (
   <SwitchPrimitives.Root
      className={cn(
         "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
         className
      )}
      {...props}
      ref={ref}
   >
      <SwitchPrimitives.Thumb
         className={cn(
            "pointer-events-none flex items-center justify-center h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
         )}
      >
         {Icon && <Icon className={iconClassName} />}
      </SwitchPrimitives.Thumb>
   </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
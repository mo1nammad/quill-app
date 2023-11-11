import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface MaxWidthWrapperProps extends HTMLAttributes<HTMLDivElement> {
   children: ReactNode;
}

const MaxWidthWrapper = ({
   children,
   className,
   ...props
}: MaxWidthWrapperProps) => {
   return (
      <div
         className={cn(
            "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
            className
         )}
         {...props}
      >
         {children}
      </div>
   );
};
export default MaxWidthWrapper;

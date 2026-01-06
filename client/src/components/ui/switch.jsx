import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

export const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-zinc-200 transition-colors data-[state=checked]:bg-zinc-900 dark:bg-zinc-800 dark:data-[state=checked]:bg-zinc-100",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5 dark:bg-zinc-950"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

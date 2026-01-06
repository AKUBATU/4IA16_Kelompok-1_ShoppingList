import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        className={cn(
          "z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-lg px-8 py-2 text-sm outline-none focus:bg-zinc-100 dark:focus:bg-zinc-800",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

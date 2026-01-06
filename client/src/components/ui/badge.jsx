import React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
    high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
    normal: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    />
  );
}

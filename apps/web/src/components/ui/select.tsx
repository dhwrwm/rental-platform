import * as React from "react";
import { cn } from "@lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border border-border bg-input px-4 py-3 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";

export { Select };

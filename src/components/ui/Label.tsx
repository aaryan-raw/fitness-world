import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type LabelProps = ComponentProps<"label"> & {
  /** Shows a required marker. The input itself should also set `required`. */
  required?: boolean;
};

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label className={cn("type-label mb-2 block", className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-accent">
          *
        </span>
      )}
    </label>
  );
}

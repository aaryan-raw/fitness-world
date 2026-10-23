import type { ComponentProps } from "react";
import { controlStyles } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

export type TextareaProps = Omit<ComponentProps<"textarea">, "aria-invalid"> & {
  /** Marks the field invalid: red border and aria-invalid. */
  invalid?: boolean;
};

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(controlStyles, "min-h-32 resize-y py-3", className)}
      {...props}
    />
  );
}

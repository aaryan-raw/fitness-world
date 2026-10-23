import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type InputProps = Omit<ComponentProps<"input">, "aria-invalid"> & {
  /** Marks the field invalid: red border and aria-invalid. */
  invalid?: boolean;
};

export const controlStyles =
  "block w-full rounded-control border border-line-strong bg-surface px-4 text-base text-ink placeholder:text-ink-muted/80 transition-colors hover:border-ink-muted focus-visible:border-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line-strong aria-[invalid=true]:border-danger";

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlStyles, "h-13", className)}
      {...props}
    />
  );
}

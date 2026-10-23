import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { controlStyles } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

export type SelectProps = Omit<ComponentProps<"select">, "aria-invalid"> & {
  /** Marks the field invalid: red border and aria-invalid. */
  invalid?: boolean;
};

/**
 * A native <select> (best behaviour on phones and with assistive technology)
 * with the shared control styling and a custom chevron. The placeholder
 * option, `value=""`, is shown in the muted colour.
 */
export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          controlStyles,
          "h-13 appearance-none pr-11 [&:has(option[value='']:checked)]:text-ink-muted",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-muted"
      />
    </div>
  );
}

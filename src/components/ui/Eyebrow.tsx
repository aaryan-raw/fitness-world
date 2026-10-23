import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = {
  /** Small uppercase style, used for section labels on the homepage. */
  caps?: boolean;
  className?: string;
  children: ReactNode;
};

/** Short label above a heading. Use only where it tells the reader something. */
export function Eyebrow({ caps = false, className, children }: EyebrowProps) {
  return (
    <p
      className={cn(
        "type-eyebrow flex items-center gap-3 before:h-0.5 before:w-8 before:bg-accent",
        caps && "text-[0.8125rem] uppercase tracking-[0.14em]",
        className,
      )}
    >
      {children}
    </p>
  );
}

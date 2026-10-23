import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = {
  /** `neutral` is the quiet default. Use `accent` or `solid` sparingly. */
  tone?: "neutral" | "accent" | "solid";
  className?: string;
  children: ReactNode;
};

const tones = {
  neutral: "border border-line-strong text-ink-muted",
  accent: "border border-accent/40 bg-accent/10 text-accent",
  solid: "bg-accent text-on-accent",
} as const;

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "type-caption inline-flex items-center gap-1.5 rounded-badge px-2.5 py-1 font-medium [&_svg]:shrink-0",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

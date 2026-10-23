import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  as?: "div" | "article" | "section" | "li";
  padding?: "sm" | "md" | "lg";
  /** Background. Use `canvas` when the card sits on a `surface` section. */
  tone?: "surface" | "canvas";
  /** Accent border for a single recommended or featured card. */
  highlighted?: boolean;
  className?: string;
  children: ReactNode;
};

const paddings = {
  sm: "p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10",
} as const;

/** A flat surface with a hairline border. Add content, not decoration. */
export function Card({
  as: Tag = "div",
  padding = "md",
  tone = "surface",
  highlighted = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-card border",
        tone === "surface" ? "bg-surface" : "bg-canvas",
        highlighted ? "border-accent" : "border-line",
        paddings[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

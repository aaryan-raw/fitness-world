import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type SectionProps = {
  as?: "section" | "div" | "article" | "aside";
  /** Vertical padding. */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Background treatment. */
  tone?: "default" | "surface";
  /** Adds a divider line along the top edge. */
  bordered?: boolean;
  /** Wrap children in the shared Container. Turn off for full-bleed content. */
  contained?: boolean;
  id?: string;
  /** Gives a <section> an accessible name. Point it at the section's heading id. */
  "aria-labelledby"?: string;
  className?: string;
  children: ReactNode;
};

const spacings = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
} as const;

export function Section({
  as: Tag = "section",
  spacing = "md",
  tone = "default",
  bordered = false,
  contained = true,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag
      className={cn(
        spacings[spacing],
        tone === "surface" && "bg-surface",
        bordered && "border-t border-line",
        className,
      )}
      {...rest}
    >
      {contained ? <Container>{children}</Container> : children}
    </Tag>
  );
}

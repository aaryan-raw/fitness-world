import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingVariant = "display" | "page" | "section" | "title";
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  /** Visual style. Independent of the heading level. */
  variant?: HeadingVariant;
  /** Semantic level. Defaults to a sensible one for the variant. */
  as?: HeadingTag;
  id?: string;
  className?: string;
  children: ReactNode;
};

const styles: Record<HeadingVariant, string> = {
  display: "type-display",
  page: "type-page",
  section: "type-section",
  title: "type-title",
};

const defaultTags: Record<HeadingVariant, HeadingTag> = {
  display: "h1",
  page: "h1",
  section: "h2",
  title: "h3",
};

export function Heading({
  variant = "section",
  as,
  id,
  className,
  children,
}: HeadingProps) {
  const Tag = as ?? defaultTags[variant];
  return (
    <Tag id={id} className={cn(styles[variant], className)}>
      {children}
    </Tag>
  );
}

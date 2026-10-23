import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  as?: "div" | "header" | "footer" | "nav";
  className?: string;
  children: ReactNode;
};

/** Centres content, caps its width and applies the shared horizontal gutters. */
export function Container({
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-page px-gutter", className)}>
      {children}
    </Tag>
  );
}

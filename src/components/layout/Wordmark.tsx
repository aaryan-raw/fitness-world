import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

/** Typographic logo: the business name stacked in the display face. */
export function Wordmark({ className }: { className?: string }) {
  const [first, ...rest] = siteConfig.name.split(" ");
  return (
    <span className={cn("type-wordmark flex flex-col", className)}>
      <span className="sr-only">{siteConfig.name}</span>
      <span aria-hidden="true">{first}</span>
      <span aria-hidden="true" className="text-accent">
        {rest.join(" ")}
      </span>
    </span>
  );
}

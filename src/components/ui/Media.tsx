import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { SiteImage } from "@/data/images";
import { cn } from "@/lib/cn";

type MediaProps = {
  image: SiteImage;
  /** Responsive `sizes` hint for next/image. Be accurate: it controls download size. */
  sizes: string;
  /** Load eagerly. Use for the largest above-the-fold image only. */
  preload?: boolean;
  /**
   * Fill the nearest positioned parent (absolute, inset-0). Without it the
   * frame is `relative` and takes its size from `className`, e.g. an aspect ratio.
   */
  cover?: boolean;
  /** Show a small "Illustrative image" label when the image is not of the gym. */
  showLabel?: boolean;
  className?: string;
  imageClassName?: string;
};

/** True if the file exists in /public, so a missing asset never produces a broken request. */
function publicFileExists(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}

/**
 * A positioned frame that fills its parent's box with an image.
 * A hatched fallback always sits underneath: it is what shows if the file is
 * missing, and what a failed or slow request falls back to. Alt text is hidden
 * visually if a request fails so no broken-image text appears over the page.
 */
export function Media({
  image,
  sizes,
  preload = false,
  cover = false,
  showLabel = false,
  className,
  imageClassName,
}: MediaProps) {
  const available = publicFileExists(image.src);

  return (
    <div
      className={cn(
        "overflow-hidden bg-surface",
        cover ? "absolute inset-0" : "relative",
        className,
      )}
    >
      <div aria-hidden="true" className="bg-hatch absolute inset-0" />
      {available && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          style={{ objectPosition: image.position }}
          className={cn("object-cover text-transparent", imageClassName)}
        />
      )}
      {available && showLabel && image.illustrative && (
        <span className="type-caption absolute bottom-3 left-3 bg-canvas/80 px-2 py-1 text-ink-muted">
          Illustrative image
        </span>
      )}
    </div>
  );
}

import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type RatingStarsProps = {
  value: number;
  max?: number;
  className?: string;
};

/** Five stars with partial fill, so 4.5 shows four and a half. */
export function RatingStars({ value, max = 5, className }: RatingStarsProps) {
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of ${max}`}
      className={cn("inline-flex gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span key={index} aria-hidden="true" className="relative inline-block size-5">
            <Star className="absolute inset-0 size-5 text-line-strong" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="size-5 max-w-none shrink-0 fill-accent text-accent" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

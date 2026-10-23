import { Container } from "@/components/ui/Container";
import { RatingStars } from "@/components/ui/RatingStars";
import { trustPoints } from "@/data/home";
import { siteConfig } from "@/data/site";

/** Rating from the supplied Google figures. Deliberately not a link: no verified listing URL exists. */
export function TrustStrip() {
  const { rating } = siteConfig;

  return (
    <section aria-labelledby="trust-title" className="border-b border-line bg-surface">
      <h2 id="trust-title" className="sr-only">
        Rated {rating.value} out of {rating.outOf} from {rating.reviewCount} {rating.source} reviews
      </h2>
      <Container className="grid lg:grid-cols-[auto_1fr_1fr_1fr]">
        <div className="flex items-center gap-5 py-8 lg:pr-12">
          <p className="font-display text-[4.5rem] leading-none font-extrabold" aria-hidden="true">
            {rating.value}
          </p>
          <div>
            <RatingStars value={rating.value} />
            <p className="type-caption mt-2 text-ink-muted">
              out of {rating.outOf}, from {rating.reviewCount} {rating.source} reviews
            </p>
          </div>
        </div>
        {trustPoints.map((point) => (
          <div
            key={point.title}
            className="border-t border-line py-6 lg:border-t-0 lg:border-l lg:px-8 lg:py-8"
          >
            <p className="type-label">{point.title}</p>
            <p className="type-body mt-1 text-ink-muted">{point.description}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

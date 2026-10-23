import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RatingStars } from "@/components/ui/RatingStars";
import { Section } from "@/components/ui/Section";
import { reviews, reviewsContent } from "@/data/home";
import { routes } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * Paraphrased customer feedback only: no names, avatars, dates or invented
 * quotes. There is no "view more reviews" link because no verified Google
 * reviews URL exists; the action goes to the contact page instead.
 */
export function ReviewsSection() {
  const { rating } = siteConfig;

  return (
    <Section aria-labelledby="reviews-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow caps>{reviewsContent.eyebrow}</Eyebrow>
          <Heading id="reviews-title" className="mt-5">
            {reviewsContent.heading}
          </Heading>
        </div>
        <div className="flex items-center gap-3">
          <RatingStars value={rating.value} />
          <p className="type-caption text-ink-muted">
            {rating.value}/{rating.outOf} from {rating.reviewCount} {rating.source} reviews
          </p>
        </div>
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {reviews.map((review, index) => {
          const featured = index === 0;
          return (
            <li
              key={review.id}
              className={cn(featured ? "md:col-span-2 lg:col-span-6 lg:row-span-2" : "lg:col-span-6")}
            >
              <Card as="article" padding={featured ? "lg" : "md"} className="flex h-full flex-col">
                <h3 className={featured ? "type-section" : "type-title"}>{review.title}</h3>
                <p
                  className={cn(
                    "mt-5 text-ink-muted",
                    featured ? "type-lead" : "type-body",
                  )}
                >
                  {review.summary}
                </p>
                <ul aria-label="Themes" className="mt-auto flex flex-wrap gap-2 pt-8">
                  {review.themes.map((theme) => (
                    <li key={theme}>
                      <Badge>{theme}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-caption text-ink-muted">{reviewsContent.disclosure}</p>
        <Button href={routes.contact} variant="secondary" size="sm">
          {reviewsContent.contactLabel}
        </Button>
      </div>
    </Section>
  );
}

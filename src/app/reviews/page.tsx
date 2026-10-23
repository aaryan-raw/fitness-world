import type { Metadata } from "next";
import { Info, Phone } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RatingStars } from "@/components/ui/RatingStars";
import { Section } from "@/components/ui/Section";
import { routes } from "@/data/navigation";
import { reviewsPage } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { telHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Reviews",
  description: `Paraphrased member feedback and the ${siteConfig.rating.value} out of ${siteConfig.rating.outOf} Google rating from ${siteConfig.rating.reviewCount} reviews for ${siteConfig.name} in Vazhayila.`,
};

/**
 * Paraphrased summaries only. No reviewer names, dates, photos, per-review
 * ratings or quotation marks, and no link to Google reviews because no
 * verified listing URL exists.
 */
export default function ReviewsPage() {
  const { hero, ratingNote, summaries, howToRead, cta } = reviewsPage;
  const { rating } = siteConfig;

  return (
    <>
      <PageHero
        {...hero}
        lead={`${siteConfig.name} is rated ${rating.value} out of ${rating.outOf} from ${rating.reviewCount} ${rating.source} reviews, according to the listing information supplied for this demo. The summaries below paraphrase member feedback.`}
        aside={
          <Card tone="surface" padding="lg">
            <p className="type-label">{rating.source} rating</p>
            <div className="mt-4 flex items-center gap-5">
              <p className="font-display text-[5rem] leading-none font-extrabold" aria-hidden="true">
                {rating.value}
              </p>
              <div>
                <RatingStars value={rating.value} />
                <p className="type-body mt-2">
                  out of {rating.outOf}, from {rating.reviewCount} {rating.source} reviews
                </p>
              </div>
            </div>
            <p className="type-caption mt-6 text-ink-muted">{ratingNote}</p>
          </Card>
        }
      />

      <Section aria-labelledby="summaries-title">
        <Eyebrow caps>{summaries.eyebrow}</Eyebrow>
        <Heading id="summaries-title" className="mt-5">
          {summaries.heading}
        </Heading>
        <ul className="mt-12">
          {summaries.items.map((item) => (
            <li
              key={item.id}
              className="grid gap-5 border-t border-line py-10 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-8"
            >
              <h3 className="type-section lg:col-span-5">{item.title}</h3>
              <div className="lg:col-span-7">
                <p className="type-lead">{item.summary}</p>
                <ul aria-label="Themes" className="mt-6 flex flex-wrap gap-2">
                  {item.themes.map((theme) => (
                    <li key={theme}>
                      <Badge>{theme}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="how-title" tone="surface" bordered>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Heading id="how-title" variant="section" as="h2" className="flex items-start gap-3">
              <Info aria-hidden="true" className="mt-2 size-6 shrink-0 text-accent" />
              {howToRead.heading}
            </Heading>
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {howToRead.items.map((text) => (
                <li key={text} className="type-body border-t border-line pt-4 first:border-t-0 first:pt-0">
                  {text}
                </li>
              ))}
            </ul>
            <p className="type-body mt-8 text-ink-muted">{howToRead.readMore}</p>
          </div>
        </div>
      </Section>

      <CtaBand
        heading={cta.heading}
        copy={cta.copy}
        primary={{ label: "Get in Touch", href: routes.contact }}
        secondary={{
          label: "Call Fitness World",
          href: telHref(),
          icon: <Phone aria-hidden="true" className="size-4" />,
        }}
      />
    </>
  );
}

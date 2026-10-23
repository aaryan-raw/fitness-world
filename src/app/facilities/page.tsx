import type { Metadata } from "next";
import { ArrowRight, Info, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/data/site";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";
import { facilitiesPage } from "@/data/pages";
import { telHref } from "@/lib/contact";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Facilities and training",
  description:
    "A proposed overview of training at Fitness World in Vazhayila. Equipment and services are being confirmed, so contact the gym to check what is available.",
};

export default function FacilitiesPage() {
  const { hero, legend, categories, confirm } = facilitiesPage;

  return (
    <>
      <PageHero
        {...hero}
        media={images.hero}
        actions={
          <Button href={routes.contact} className="w-full sm:w-auto">
            Ask the Gym About Equipment
          </Button>
        }
      />

      <Section aria-labelledby="legend-title" tone="surface" spacing="sm">
        <h2 id="legend-title" className="type-label flex items-center gap-2">
          <Info aria-hidden="true" className="size-4 text-accent" />
          {legend.heading}
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10">
          {legend.items.map((item) => (
            <li key={item.badge} className="flex flex-col items-start gap-3">
              <Badge tone="accent">{item.badge}</Badge>
              <p className="type-body text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="categories-title">
        <div className="max-w-3xl">
          <Eyebrow caps>{categories.eyebrow}</Eyebrow>
          <Heading id="categories-title" className="mt-5">
            {categories.heading}
          </Heading>
        </div>

        <ul className="mt-14 space-y-16 lg:space-y-24">
          {categories.items.map((category, index) => {
            const flipped = index % 2 === 1;
            return (
              <li key={category.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
                <Media
                  image={images[category.image]}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  showLabel
                  className={cn(
                    "aspect-[4/3] border border-line lg:col-span-6",
                    flipped ? "lg:col-start-7" : "lg:col-start-1",
                  )}
                />
                <div
                  className={cn(
                    "lg:col-span-5 lg:row-start-1",
                    flipped ? "lg:col-start-1" : "lg:col-start-8",
                  )}
                >
                  <Badge>{categories.badge}</Badge>
                  <Heading as="h3" className="mt-4">
                    {category.title}
                  </Heading>
                  <p className="type-lead mt-5">{category.description}</p>
                  <p className="type-label mt-8">{categories.questionsLabel}</p>
                  <ul className="mt-3">
                    {category.questions.map((question) => (
                      <li
                        key={question}
                        className="type-body border-t border-line py-3 text-ink-muted first:border-t-0"
                      >
                        {question}
                      </li>
                    ))}
                  </ul>
                  <Button href={routes.contact} variant="ghost" className="mt-3 -ml-4">
                    {categories.askLabel}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section aria-labelledby="confirm-title" tone="surface" bordered>
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow caps>{confirm.eyebrow}</Eyebrow>
            <Heading id="confirm-title" className="mt-5">
              {confirm.heading}
            </Heading>
            <p className="type-lead mt-6 max-w-xl">{confirm.copy}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:col-span-5">
            <Button href={telHref()} className="w-full sm:w-auto">
              <Phone aria-hidden="true" className="size-4" />
              Call {siteConfig.contact.phoneDisplay}
            </Button>
            <Button href={routes.contact} variant="secondary" className="w-full sm:w-auto">
              Get in Touch
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

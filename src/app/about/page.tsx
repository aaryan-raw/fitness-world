import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";
import { aboutPage } from "@/data/pages";
import { telHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Fitness World, a gym in Vazhayila, Enikkara, Thiruvananthapuram: how members describe the training, the trainers and the atmosphere.",
};

export default function AboutPage() {
  const { hero, approach, expect, cta } = aboutPage;

  return (
    <>
      <PageHero
        {...hero}
        media={images.intro}
        actions={
          <>
            <Button href={routes.enquire} className="w-full sm:w-auto">
              Enquire About Membership
            </Button>
            <Button href={routes.contact} variant="secondary" className="w-full sm:w-auto">
              Get in Touch
            </Button>
          </>
        }
      />

      <Section aria-labelledby="approach-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow caps>{approach.eyebrow}</Eyebrow>
              <Heading id="approach-title" className="mt-5">
                {approach.heading}
              </Heading>
              <p className="type-caption mt-6 max-w-xs text-ink-muted">{approach.note}</p>
            </div>
          </div>
          <ul className="lg:col-span-8">
            {approach.principles.map((principle) => (
              <li
                key={principle.word}
                className="grid gap-3 border-t border-line py-8 first:border-t-0 first:pt-0 xl:grid-cols-[19rem_1fr] xl:gap-8"
              >
                <h3 className="type-section text-accent">{principle.word}</h3>
                <p className="type-lead">{principle.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section aria-labelledby="expect-title" tone="surface" bordered>
        <div className="max-w-3xl">
          <Eyebrow caps>{expect.eyebrow}</Eyebrow>
          <Heading id="expect-title" className="mt-5">
            {expect.heading}
          </Heading>
          <p className="type-lead mt-6">{expect.intro}</p>
        </div>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {expect.steps.map((step) => (
            <li key={step.title} className="border-t-2 border-accent pt-6">
              <h3 className="type-title">{step.title}</h3>
              <p className="type-body mt-3 text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        heading={cta.heading}
        copy={cta.copy}
        primary={{ label: "Enquire About Membership", href: routes.enquire }}
        secondary={{
          label: "Call Fitness World",
          href: telHref(),
          icon: <Phone aria-hidden="true" className="size-4" />,
        }}
      />
    </>
  );
}

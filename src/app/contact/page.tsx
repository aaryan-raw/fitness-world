import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { LocationPlate } from "@/components/sections/LocationPlate";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { contactPage } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { mapsHref, telHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call ${siteConfig.name} on ${siteConfig.contact.phoneDisplay} or find the gym on Aramkallu Road, Vazhayila, Enikkara, ${siteConfig.address.city}.`,
};

/**
 * No email, WhatsApp or social links: none is confirmed. The Maps link is a
 * labelled plus-code search until `siteConfig.maps.verified` is true.
 */
export default function ContactPage() {
  const { hero, quick, happens, form } = contactPage;
  const { address, contact, maps } = siteConfig;

  return (
    <>
      <PageHero
        {...hero}
        aside={
          <Card tone="surface" padding="lg">
            <h2 className="type-label">{quick.heading}</h2>
            <p className="mt-3">
              <a
                href={telHref()}
                className="type-title inline-flex min-h-11 items-center whitespace-nowrap transition-colors hover:text-accent xl:type-section"
              >
                {contact.phoneDisplay}
              </a>
            </p>
            <address className="type-body mt-4 not-italic text-ink-muted">
              {address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">
                {address.city}, {address.state} {address.postalCode}
              </span>
            </address>
            <div className="mt-6 flex flex-col gap-3">
              <Button href={telHref()} fullWidth>
                <Phone aria-hidden="true" className="size-4" />
                Call the Gym
              </Button>
              <Button href={mapsHref()} newTab variant="secondary" fullWidth>
                <MapPin aria-hidden="true" className="size-4" />
                {maps.verified ? "Get Directions" : "Search on Google Maps"}
              </Button>
            </div>
            <p className="type-caption mt-5 text-ink-muted">
              {quick.hoursNote}
              {!maps.verified && ` ${quick.mapsNote}`}
            </p>
          </Card>
        }
      />

      <Section aria-labelledby="form-title" tone="surface" bordered>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow caps>{form.eyebrow}</Eyebrow>
            <Heading id="form-title" className="mt-5">
              {form.heading}
            </Heading>
            <h3 className="type-title mt-10">{happens.heading}</h3>
            <ol className="mt-4 space-y-3">
              {happens.steps.map((step, index) => (
                <li key={step} className="type-body flex gap-3 text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-badge border border-line-strong text-[0.8125rem] font-semibold text-ink"
                  >
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10 hidden lg:block">
              <LocationPlate />
            </div>
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
        {/* On small screens the location card follows the form instead of splitting it from its steps. */}
        <div className="mt-12 lg:hidden">
          <LocationPlate />
        </div>
      </Section>
    </>
  );
}

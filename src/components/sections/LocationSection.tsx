import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { LocationPlate } from "@/components/sections/LocationPlate";
import { Section } from "@/components/ui/Section";
import { locationContent } from "@/data/home";
import { siteConfig } from "@/data/site";
import { mapsHref, telHref } from "@/lib/contact";

/**
 * No "open now" status (the weekly schedule is unconfirmed) and no WhatsApp
 * button (the number is not confirmed on WhatsApp). The Maps link is only called
 * "directions" once `siteConfig.maps.verified` is true; until then it is a
 * clearly labelled general search for the listing's plus code.
 */
export function LocationSection() {
  const { address, contact, maps } = siteConfig;

  return (
    <Section aria-labelledby="location-title" tone="surface" bordered>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow caps>{locationContent.eyebrow}</Eyebrow>
          <Heading id="location-title" className="mt-5">
            {locationContent.heading}
          </Heading>
          <address className="type-lead mt-8 not-italic">
            {address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block">
              {address.city}, {address.state} {address.postalCode}
            </span>
          </address>
          <p className="mt-5">
            <a
              href={telHref()}
              className="type-title inline-flex min-h-11 items-center transition-colors hover:text-accent"
            >
              {contact.phoneDisplay}
            </a>
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button href={telHref()} className="w-full sm:w-auto">
              <Phone aria-hidden="true" className="size-4" />
              Call the Gym
            </Button>
            <Button href={mapsHref()} newTab variant="secondary" className="w-full sm:w-auto">
              <MapPin aria-hidden="true" className="size-4" />
              {maps.verified ? "Get Directions" : "Search on Google Maps"}
            </Button>
          </div>
          <p className="type-caption mt-6 max-w-md text-ink-muted">
            {locationContent.hoursNote}
            {!maps.verified && " The map link is a general search for the plus code, not an official business pin."}
          </p>
        </div>

        <LocationPlate />
      </div>
    </Section>
  );
}

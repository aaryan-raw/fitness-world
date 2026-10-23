import type { Metadata } from "next";
import { CircleHelp, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { membershipConfig } from "@/data/memberships";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";
import { membershipsPage } from "@/data/pages";
import { siteConfig } from "@/data/site";
import { telHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "Ask Fitness World about membership options, fees and terms. Plans and prices are confirmed directly with the gym.",
};

/**
 * Enquiry-led: plans, durations and prices are unconfirmed (see
 * src/data/memberships.ts), so none are shown. Real plan cards belong here once
 * the owner supplies them and `pricingStatus` is "confirmed".
 */
export default function MembershipsPage() {
  const { hero, status, questions, enquire } = membershipsPage;
  const pricingConfirmed = membershipConfig.pricingStatus === "confirmed";

  return (
    <>
      <PageHero
        {...hero}
        media={images.general}
        actions={
          <>
            <Button href={routes.enquire} className="w-full sm:w-auto">
              Make an Enquiry
            </Button>
            <Button href={telHref()} variant="secondary" className="w-full sm:w-auto">
              <Phone aria-hidden="true" className="size-4" />
              Call {siteConfig.contact.phoneDisplay}
            </Button>
          </>
        }
      />

      <Section aria-labelledby="questions-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow caps>{questions.eyebrow}</Eyebrow>
            <Heading id="questions-title" className="mt-5">
              {questions.heading}
            </Heading>
            {/* Shown while plans and prices are unconfirmed. */}
            {!pricingConfirmed && (
              <Card highlighted padding="md" className="mt-10">
                <p className="type-title">{status.title}</p>
                <p className="type-body mt-3 text-ink-muted">{status.text}</p>
              </Card>
            )}
          </div>
          <ul className="lg:col-span-7">
            {questions.items.map((question) => (
              <li
                key={question}
                className="flex gap-4 border-t border-line py-6 first:border-t-0 first:pt-0"
              >
                <CircleHelp aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" />
                <p className="type-lead">{question}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* The target of every /memberships#enquire link. */}
      <Section id="enquire" aria-labelledby="enquire-title" tone="surface" bordered>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow caps>{enquire.eyebrow}</Eyebrow>
            <Heading id="enquire-title" className="mt-5">
              {enquire.heading}
            </Heading>
            <p className="type-lead mt-6">{enquire.copy}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button href={telHref()} className="w-full sm:w-auto">
                <Phone aria-hidden="true" className="size-4" />
                Call {siteConfig.contact.phoneDisplay}
              </Button>
              <Button href={routes.contact} variant="ghost" className="w-full sm:w-auto">
                Find the Gym
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm defaultType="membership" />
          </div>
        </div>
      </Section>
    </>
  );
}

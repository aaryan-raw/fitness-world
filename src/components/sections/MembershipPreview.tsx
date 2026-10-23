import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { membershipContent } from "@/data/home";
import { routes } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { telHref } from "@/lib/contact";

/**
 * Enquiry-led on purpose: plans, durations and prices are unconfirmed, so no
 * pricing is shown. Real plan cards belong to a later stage, once the owner
 * supplies them (see src/data/memberships.ts).
 */
export function MembershipPreview() {
  return (
    <Section aria-labelledby="membership-title" tone="surface" bordered>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Eyebrow caps>{membershipContent.eyebrow}</Eyebrow>
          <Heading id="membership-title" variant="page" as="h2" className="mt-5">
            {membershipContent.heading}
          </Heading>
          <p className="type-lead mt-8 max-w-xl">{membershipContent.copy}</p>
        </div>
        <Card tone="canvas" highlighted padding="lg" className="lg:col-span-5">
          <p className="type-title">{membershipContent.panelTitle}</p>
          <p className="type-caption mt-3 text-ink-muted">{membershipContent.panelNote}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Button href={routes.enquire} fullWidth>
              Enquire About Membership
            </Button>
            <Button href={telHref()} variant="secondary" fullWidth>
              <Phone aria-hidden="true" className="size-4" />
              Call {siteConfig.contact.phoneDisplay}
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

type CtaAction = { label: string; href: string; icon?: ReactNode };

type CtaBandProps = {
  heading: string;
  copy: string;
  primary: CtaAction;
  secondary: CtaAction;
};

/** The lime closing band. One per page, so its heading id can be fixed. */
export function CtaBand({ heading, copy, primary, secondary }: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="bg-accent text-on-accent">
      <Container className="grid gap-10 py-section-sm lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-section">
        <Heading id="cta-title" variant="page" as="h2" className="lg:col-span-7">
          {heading}
        </Heading>
        <div className="lg:col-span-5">
          <p className="max-w-md text-lg">{copy}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button href={primary.href} variant="inverse" className="w-full sm:w-auto">
              {primary.icon}
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="inverse-outline" className="w-full sm:w-auto">
              {secondary.icon}
              {secondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

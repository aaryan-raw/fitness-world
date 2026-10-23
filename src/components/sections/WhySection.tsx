import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { whyContent, whyPoints } from "@/data/home";

export function WhySection() {
  return (
    <Section aria-labelledby="why-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow caps>{whyContent.eyebrow}</Eyebrow>
            <Heading id="why-title" className="mt-5">
              {whyContent.heading}
            </Heading>
            <p className="type-lead mt-6 max-w-md">{whyContent.intro}</p>
          </div>
        </div>
        <ul className="lg:col-span-7">
          {whyPoints.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="flex gap-5 border-t border-line py-8 first:border-t-0 first:pt-0 sm:gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-control border border-line-strong text-accent">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="type-title">{title}</h3>
                <p className="type-body mt-2 max-w-lg text-ink-muted">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

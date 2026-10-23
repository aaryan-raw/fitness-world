import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { trainingCategories, trainingContent } from "@/data/home";
import { images } from "@/data/images";

export function TrainingSection() {
  return (
    <Section aria-labelledby="training-title" tone="surface" bordered>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <Eyebrow caps>{trainingContent.eyebrow}</Eyebrow>
          <Heading id="training-title" className="mt-5">
            {trainingContent.heading}
          </Heading>
        </div>
        <p className="type-body text-ink-muted lg:col-span-4 lg:col-start-9">
          {trainingContent.note}
        </p>
      </div>

      <ul className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
        {trainingCategories.map((category) => (
          <li key={category.id} className={category.span}>
            <Link
              href={category.href}
              className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-card border border-line transition-colors duration-300 hover:border-line-strong lg:min-h-[30rem]"
            >
              <Media
                image={images[category.image]}
                sizes="(min-width: 1024px) 55vw, 100vw"
                cover
                imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/55 to-transparent"
              />
              <div className="relative p-6 sm:p-8">
                <h3 className="type-title">{category.title}</h3>
                <p className="type-body mt-2 max-w-sm text-ink-muted">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-accent">
                  {trainingContent.linkLabel}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="type-caption mt-6 text-ink-muted">
        Images are illustrations, not photographs of the gym.
      </p>
    </Section>
  );
}

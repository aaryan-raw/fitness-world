import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { introContent } from "@/data/home";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";

export function IntroSection() {
  return (
    <Section id="training-space" aria-labelledby="intro-title">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-5">
          {/* Offset frame behind the image. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 border border-line-strong lg:translate-x-5 lg:translate-y-5"
          />
          <Media
            image={images.intro}
            sizes="(min-width: 1024px) 40vw, 90vw"
            showLabel
            className="relative aspect-[4/5] border border-line"
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow caps>{introContent.eyebrow}</Eyebrow>
          <Heading id="intro-title" className="mt-5">
            {introContent.heading}
          </Heading>
          <p className="type-lead mt-8">{introContent.lead}</p>
          <p className="type-body mt-5 max-w-xl text-ink-muted">{introContent.body}</p>
          <Button href={routes.about} variant="ghost" className="mt-6 -ml-4">
            About Fitness World
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </Section>
  );
}

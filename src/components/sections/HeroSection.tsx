import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Media } from "@/components/ui/Media";
import { heroContent } from "@/data/home";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <Media
        image={images.hero}
        sizes="100vw"
        preload
        cover
        className="-z-20"
      />
      {/* Scrim for text contrast: from the bottom on phones, from the left on wide screens. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-canvas from-45% via-canvas/65 via-70% to-transparent lg:bg-linear-to-r lg:from-canvas lg:from-0% lg:via-canvas/75 lg:via-50% lg:to-transparent"
      />

      <Container className="flex min-h-[46rem] flex-col justify-end pb-28 pt-24 lg:min-h-[max(40rem,min(calc(100svh-5rem),56rem))] lg:justify-center lg:pb-32">
        <div className="max-w-3xl">
          <Eyebrow caps>{heroContent.eyebrow}</Eyebrow>
          <Heading id="hero-title" variant="display" className="mt-6">
            {heroContent.headline}
          </Heading>
          <p className="type-lead mt-6 max-w-xl">{heroContent.copy}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={routes.memberships} className="w-full sm:w-auto">
              Explore Memberships
            </Button>
            <Button href={routes.contact} variant="secondary" className="w-full sm:w-auto">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-0 border-t border-line/70 bg-canvas/60">
        <Container className="type-caption flex flex-col items-start gap-1 py-3 text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
          <p className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-accent" />
            Vazhayila, Enikkara, {siteConfig.address.plusCode}
          </p>
          {images.hero.illustrative && <p>Illustrative image, not the gym</p>}
        </Container>
      </div>
    </section>
  );
}

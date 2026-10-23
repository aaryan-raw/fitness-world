import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Media } from "@/components/ui/Media";
import type { SiteImage } from "@/data/images";

type PageHeroProps = {
  eyebrow: string;
  /** The page's single <h1>. */
  title: string;
  lead: string;
  /** Primary and secondary actions under the lead. */
  actions?: ReactNode;
  /** Illustration shown beside the text. */
  media?: SiteImage;
  /** Custom content beside the text, used instead of `media`. */
  aside?: ReactNode;
};

/** The shared header block for every supporting page, so they all open the same way. */
export function PageHero({ eyebrow, title, lead, actions, media, aside }: PageHeroProps) {
  const hasSide = Boolean(media || aside);

  return (
    <section aria-labelledby="page-title" className="border-b border-line">
      <Container className="grid gap-12 py-section-sm lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-section">
        <div className={hasSide ? "lg:col-span-7" : "lg:col-span-9"}>
          <Eyebrow caps>{eyebrow}</Eyebrow>
          <Heading id="page-title" variant="page" as="h1" className="mt-5">
            {title}
          </Heading>
          <p className="type-lead mt-6 max-w-xl">{lead}</p>
          {actions && <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">{actions}</div>}
        </div>
        {media && (
          <div className="lg:col-span-5">
            <Media
              image={media}
              sizes="(min-width: 1024px) 40vw, 90vw"
              preload
              showLabel
              className="aspect-[4/3] border border-line lg:aspect-[4/5]"
            />
          </div>
        )}
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </Container>
    </section>
  );
}

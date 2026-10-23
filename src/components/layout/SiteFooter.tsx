import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/layout/Wordmark";
import { mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { mapsHref, telHref, whatsappHref } from "@/lib/contact";

const linkStyles =
  "inline-flex min-h-11 items-center text-ink-muted transition-colors hover:text-ink";

export function SiteFooter() {
  const { address, contact, maps, social } = siteConfig;
  const year = new Date().getFullYear();
  const socialLinks = [
    { label: "Instagram", href: social.instagram },
    { label: "Facebook", href: social.facebook },
    { label: "YouTube", href: social.youtube },
  ].filter((link): link is { label: string; href: string } => link.href !== null);

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-section-sm lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-16">
        <div>
          <Link href="/" className="-m-1 inline-block rounded-control p-1">
            <Wordmark className="text-[1.75rem]" />
          </Link>
          <p className="type-body mt-5 max-w-sm text-ink-muted">
            {siteConfig.category} in Vazhayila, Enikkara, {address.city}.
          </p>
        </div>

        <div>
          <h2 className="type-label">Visit</h2>
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
          <ul className="mt-3">
            <li>
              <a href={telHref()} className={linkStyles}>
                <Phone aria-hidden="true" className="mr-2 size-4" />
                {contact.phoneDisplay}
              </a>
            </li>
            {contact.whatsappConfirmed && (
              <li>
                <a href={whatsappHref()} className={linkStyles}>
                  <MessageCircle aria-hidden="true" className="mr-2 size-4" />
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
          {maps.verified && (
            <Button href={mapsHref()} newTab variant="secondary" size="sm" className="mt-4">
              <MapPin aria-hidden="true" className="size-4" />
              Get Directions
            </Button>
          )}
        </div>

        <div>
          <h2 className="type-label">Explore</h2>
          <nav aria-label="Footer" className="mt-3">
            <ul>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkStyles}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {socialLinks.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkStyles}>
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="py-8">
          <p className="type-body max-w-3xl text-ink-muted">
            This is an independent concept website. It is not the official {siteConfig.name} website,
            and it is not affiliated with, approved by or endorsed by the business. Business details
            come from public listing information and may not be current, so please confirm them with
            the gym.
          </p>
          <p className="type-caption mt-4 text-ink-muted">&copy; {year} Independent concept demo</p>
        </Container>
      </div>
    </footer>
  );
}

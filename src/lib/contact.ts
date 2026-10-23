import { siteConfig } from "@/data/site";

/** `tel:` link for click-to-call. */
export function telHref(): string {
  return `tel:+${siteConfig.contact.phoneDigits}`;
}

/** WhatsApp click-to-chat link, optionally with a prefilled message. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Single-line postal address for display and metadata. */
export function formatAddress(): string {
  const { address } = siteConfig;
  return [
    ...address.lines,
    address.city,
    `${address.state} ${address.postalCode}`,
    address.country,
  ].join(", ");
}

/** Google Maps search link built from the listing's plus code (see `siteConfig.maps`). */
export function mapsHref(): string {
  const query = encodeURIComponent(siteConfig.maps.query);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

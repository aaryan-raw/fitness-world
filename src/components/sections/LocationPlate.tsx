import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/data/site";

/** Typographic location card. Shared by the homepage and the contact page. */
export function LocationPlate() {
  const { address } = siteConfig;

  return (
    <Card tone="canvas" padding="lg" className="flex flex-col justify-between gap-12">
      <p className="type-label flex items-center gap-2">
        <MapPin aria-hidden="true" className="size-4 text-accent" />
        Location
      </p>
      <div>
        <p className="type-page">Vazhayila</p>
        <p className="type-title mt-3 text-ink-muted">Enikkara, {address.city}</p>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-line pt-6 text-[0.9375rem]">
        <dt className="text-ink-muted">Road</dt>
        <dd>{address.lines[0]}</dd>
        <dt className="text-ink-muted">PIN code</dt>
        <dd>{address.postalCode}</dd>
        <dt className="text-ink-muted">Plus code</dt>
        <dd>{address.plusCode}</dd>
      </dl>
    </Card>
  );
}

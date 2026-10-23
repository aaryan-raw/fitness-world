import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextAreaField, TextField } from "@/components/ui/FormField";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/data/site";
import { telHref } from "@/lib/contact";

/**
 * TEMPORARY. Internal review page for the design system. It is not linked from
 * the navigation and must be removed (or protected) before the demo goes public.
 */
export const metadata: Metadata = {
  title: "Design preview",
  robots: { index: false, follow: false },
};

const swatches = [
  { token: "canvas", hex: "#0C0D0D", use: "Page background", className: "bg-canvas" },
  { token: "surface", hex: "#151717", use: "Cards, footer, inputs", className: "bg-surface" },
  { token: "accent", hex: "#C6FF4D", use: "Primary actions, focus", className: "bg-accent" },
  { token: "accent-hover", hex: "#D7FF7D", use: "Primary hover", className: "bg-accent-hover" },
  { token: "accent-active", hex: "#B2EF2F", use: "Primary pressed", className: "bg-accent-active" },
  { token: "ink", hex: "#F7F8F4", use: "Main text", className: "bg-ink" },
  { token: "ink-muted", hex: "#A7ADA5", use: "Secondary text", className: "bg-ink-muted" },
  { token: "line", hex: "#292D29", use: "Dividers, card edges", className: "bg-line" },
  { token: "line-strong", hex: "#646B64", use: "Form control edges", className: "bg-line-strong" },
  { token: "danger", hex: "#FF6B5B", use: "Errors", className: "bg-danger" },
] as const;

function PreviewSection({
  id,
  title,
  note,
  tone = "default",
  children,
}: {
  id: string;
  title: string;
  note?: string;
  tone?: "default" | "surface";
  children: ReactNode;
}) {
  return (
    <Section
      aria-labelledby={`${id}-title`}
      spacing="sm"
      tone={tone}
      bordered
    >
      <Heading id={`${id}-title`} variant="section">
        {title}
      </Heading>
      {note && <p className="type-body mt-3 max-w-2xl text-ink-muted">{note}</p>}
      <div className="mt-10">{children}</div>
    </Section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 md:grid-cols-[11rem_1fr] md:gap-8">
      <p className="type-caption text-ink-muted">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function DesignPreviewPage() {
  const { rating, contact } = siteConfig;

  return (
    <>
      <Section spacing="sm">
        <Eyebrow>Internal review page</Eyebrow>
        <Heading variant="page" className="mt-5">
          Design preview
        </Heading>
        <p className="type-lead mt-5 max-w-2xl">
          Everything here is rendered with the shared components. The header above
          and the footer below are the live site header and footer. Remove this
          route before the demo goes public.
        </p>
      </Section>

      <PreviewSection
        id="typography"
        title="Typography"
        note="Big Shoulders Display for headings and the wordmark, Hanken Grotesk for everything else. Heading sizes scale fluidly between a 360px phone and a wide desktop."
      >
        <Row label="Display (hero)">
          <Heading variant="display" as="h2">Display heading</Heading>
        </Row>
        <Row label="Page heading">
          <Heading variant="page" as="h2">Page heading</Heading>
        </Row>
        <Row label="Section heading">
          <Heading variant="section" as="h3">Section heading</Heading>
        </Row>
        <Row label="Card or small title">
          <Heading variant="title" as="h4">Card title</Heading>
        </Row>
        <Row label="Lead paragraph">
          <p className="type-lead max-w-2xl">
            A short introduction that sits under a page or section heading and sets up what follows.
          </p>
        </Row>
        <Row label="Body">
          <p className="type-body max-w-2xl">
            Body text is set at 16px with generous line height and a line length held under about 70
            characters, so longer passages stay comfortable to read on any screen.
          </p>
        </Row>
        <Row label="Eyebrow">
          <Eyebrow>Eyebrow label</Eyebrow>
        </Row>
        <Row label="Caption and metadata">
          <p className="type-caption text-ink-muted">Captions, helper text and small print.</p>
        </Row>
        <Row label="Buttons and navigation">
          <p className="text-[0.9375rem] font-medium">Semibold sans at 15 to 16px, sentence case.</p>
        </Row>
      </PreviewSection>

      <PreviewSection
        id="colour"
        title="Colour"
        tone="surface"
        note="Tokens defined once in globals.css. Utilities such as bg-accent and text-ink-muted come from them."
      >
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {swatches.map((swatch) => (
            <li key={swatch.token}>
              <div
                className={`${swatch.className} h-20 rounded-card border border-line-strong`}
                role="img"
                aria-label={`${swatch.token} swatch`}
              />
              <p className="mt-3 text-[0.9375rem] font-semibold">{swatch.token}</p>
              <p className="type-caption text-ink-muted">{swatch.hex}</p>
              <p className="type-caption text-ink-muted">{swatch.use}</p>
            </li>
          ))}
        </ul>
      </PreviewSection>

      <PreviewSection
        id="buttons"
        title="Buttons"
        note="Links render as real anchors, actions as real buttons. Hover, press, Tab to see focus, and note the 44px and 52px minimum heights."
      >
        <Row label="Primary">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/design-preview">Standard</Button>
            <Button href="/design-preview" size="sm">Small</Button>
            <Button href={telHref()}>
              <Phone aria-hidden="true" className="size-4" />
              Call {contact.phoneDisplay}
            </Button>
          </div>
        </Row>
        <Row label="Secondary">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/design-preview" variant="secondary">Standard</Button>
            <Button href="/design-preview" variant="secondary" size="sm">Small</Button>
          </div>
        </Row>
        <Row label="Ghost">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/design-preview" variant="ghost">Standard</Button>
            <Button href="/design-preview" variant="ghost" size="sm">Small</Button>
          </div>
        </Row>
        <Row label="On lime backgrounds">
          <div className="flex flex-wrap items-center gap-4 rounded-card bg-accent p-6 text-on-accent">
            <Button href="/design-preview" variant="inverse">Inverse</Button>
            <Button href="/design-preview" variant="inverse-outline">Inverse Outline</Button>
          </div>
        </Row>
        <Row label="Real button, disabled">
          <div className="flex flex-wrap items-center gap-4">
            <Button type="button">Button Element</Button>
            <Button type="button" variant="secondary" disabled>Disabled</Button>
          </div>
        </Row>
        <Row label="Full width">
          <div className="max-w-sm">
            <Button href="/design-preview" fullWidth>Full-Width Action</Button>
          </div>
        </Row>
      </PreviewSection>

      <PreviewSection
        id="cards-badges"
        title="Cards and badges"
        tone="surface"
        note="Cards are flat with a hairline edge. Only one card in a set should be highlighted. Badges are quiet by default."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card as="article" tone="canvas">
            <Heading variant="title" as="h3">Standard card</Heading>
            <p className="type-body mt-3 text-ink-muted">
              Used for grouped content. Add real content only.
            </p>
          </Card>
          <Card as="article" highlighted tone="canvas">
            <Badge tone="solid">Highlighted</Badge>
            <Heading variant="title" as="h3" className="mt-4">Featured card</Heading>
            <p className="type-body mt-3 text-ink-muted">
              The accent border marks a single recommended item.
            </p>
          </Card>
          <Card as="article" padding="sm" tone="canvas">
            <Heading variant="title" as="h3">Compact card</Heading>
            <p className="type-body mt-3 text-ink-muted">Tighter padding for dense lists.</p>
          </Card>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Badge>
            <Star aria-hidden="true" className="size-3.5 fill-accent text-accent" />
            {rating.value} from {rating.reviewCount} {rating.source} reviews
          </Badge>
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="solid">Solid</Badge>
        </div>
      </PreviewSection>

      <PreviewSection
        id="forms"
        title="Form fields"
        note="Labels, hints and errors are wired to their controls with ids and aria-describedby. These fields have no submit logic."
      >
        <form
          aria-label="Form field examples"
          className="grid max-w-4xl gap-x-8 gap-y-6 md:grid-cols-2"
        >
          <TextField label="Example field" name="demo-name" placeholder="Placeholder text" required />
          <TextField
            label="Example field with hint"
            name="demo-phone"
            hint="Helper text appears under the field."
                      />
          <TextField
            label="Example field with error"
            name="demo-time"
            defaultValue="Example value"
            error="Example error message."
          />
          <TextField label="Disabled field" name="demo-disabled" defaultValue="Not editable" disabled />
          <TextAreaField
            className="md:col-span-2"
            label="Example text area"
            name="demo-message"
            hint="Optional helper text."
          />
        </form>
      </PreviewSection>

      <PreviewSection
        id="states"
        title="Focus and hover"
        tone="surface"
        note="Every link, button and field shows the same lime focus ring for keyboard users (the :focus-visible rule in globals.css). Press Tab to try it on any control on this page."
      >
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex h-13 items-center rounded-control px-6 outline-2 outline-offset-3 outline-accent">
            <span className="type-caption text-ink-muted">Static sample of the focus ring</span>
          </div>
          <p className="type-body max-w-md text-ink-muted">
            Hover states: buttons change fill or border, navigation links draw an underline, form
            fields lighten their border. All transitions are disabled when the visitor prefers
            reduced motion.
          </p>
        </div>
      </PreviewSection>
    </>
  );
}

# Fitness World: website demo

A demo website for **Fitness World**, a gym at Aramkallu Road, Vazhayila, Enikkara, Thiruvananthapuram, Kerala 695564.

This is an unsolicited, independent concept demo built to show the gym owner what a modern website could look like. It is not a commissioned project, it is not live, it is not the official Fitness World website, and it is not affiliated with or endorsed by the business. Business details come only from the public Google Maps listing and the information supplied for the demo; anything not confirmed is left unconfirmed (see `src/data/`).

## Technology stack

- Next.js 16 (App Router), React Server Components by default
- TypeScript in strict mode
- Tailwind CSS v4 (CSS-first tokens in `src/app/globals.css`, no `tailwind.config` file)
- Lucide React for icons
- ESLint (`eslint-config-next`)
- npm

Fonts are bundled in `src/fonts` and loaded with `next/font/local`, so builds never need Google Fonts: **Big Shoulders Display** (headings, wordmark) and **Hanken Grotesk** (body). Both are SIL Open Font License; licences sit next to the files. The site makes no external network requests to render.

## Prerequisites

- Node.js 20.9 or newer
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Commands

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the development server                  |
| `npm run build`     | Create a production build                     |
| `npm run start`     | Serve the production build                    |
| `npm run lint`      | Run ESLint                                    |
| `npm run typecheck` | Generate route types, then run `tsc --noEmit` |

## Routes

| Route                  | Purpose                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| `/`                    | Homepage                                                                 |
| `/about`               | What members describe: consistency, guidance, form, progress, welcome    |
| `/facilities`          | Proposed training categories, clearly labelled illustrative and unverified |
| `/memberships`         | Enquiry-led: no plans or prices, questions to ask, enquiry form (`#enquire`) |
| `/contact`             | Phone, address, Maps search, demo enquiry form, what happens on submit   |
| `/reviews`             | 4.5/5 from 102 Google reviews (supplied figures) and paraphrased summaries |
| `/design-preview`      | TEMPORARY design-system review page. Unlinked. Remove before launch.     |

Every internal link in the header, footer and pages resolves. Named destinations live in `routes` in `src/data/navigation.ts`; `/memberships#enquire` targets the enquiry form section (`id="enquire"`).

## Enquiry form: what it really does

The form on `/contact` and `/memberships` (`src/components/forms/EnquiryForm.tsx`) is a **demonstration**. It is deliberately honest about that:

- It validates in the browser (name, at least one of phone or email, enquiry type; optional message) with field-level errors, an error summary, and focus moved to the first problem.
- When the details are valid it shows **"Nothing has been sent"**, says the gym has not received an enquiry, and points to the gym's phone number.
- It makes **no network request**, uses **no backend**, stores nothing (no localStorage, cookies or database), and never shows a success or "thank you" state.
- A "Demo form" notice sits at the top of the form, and a "Nothing is sent" line sits under the button.

To make it real, connect it to an owner-approved channel (for example an email or enquiry service the owner controls) and update the wording in the form and on `/contact` at the same time. Do not ship it as is for real visitors.

Validation rules are in `src/lib/validation.ts` and the enquiry types in `src/data/enquiry.ts`.

## Design system

All tokens live in `src/app/globals.css`.

- **Colour:** `canvas`, `surface`, `accent` (+ `accent-hover`, `accent-active`, `on-accent`), `ink`, `ink-muted`, `line`, `line-strong`, `danger`.
- **Type styles:** `type-display`, `type-page`, `type-section`, `type-title`, `type-lead`, `type-body`, `type-caption`, `type-eyebrow`, `type-label`.
- **Corners:** `rounded-card`, `rounded-control`, `rounded-badge`. **Layout:** `max-w-page`, `px-gutter`, `py-section-sm | py-section | py-section-lg`.
- **Focus:** one lime `:focus-visible` ring everywhere (dark on lime backgrounds). Reduced-motion preferences switch transitions off.

Shared components:

- `src/components/ui/`: Button, Container, Section, Card, Badge, Heading, Eyebrow, Label, Input, Textarea, Select, FormField (TextField, TextAreaField, SelectField), Media, RatingStars
- `src/components/layout/`: SiteHeader, SiteNav (the one client component in the shell), SiteFooter, Wordmark
- `src/components/sections/`: homepage sections plus `PageHero`, `CtaBand` and `LocationPlate`, which the supporting pages share
- `src/components/forms/`: EnquiryForm (client component)

## Content and data

Copy is centralised: `src/data/site.ts` (business details), `home.ts` (homepage), `pages.ts` (supporting pages), `navigation.ts`, `memberships.ts`, `enquiry.ts`, `images.ts`.

Rules the content follows: no prices, plans, opening hours, "open now" status, statistics, staff profiles, qualifications, history, named testimonials or verbatim review quotes. Unknown details are phrased as questions to ask the gym. Reviews are paraphrases of the supplied feedback.

## Imagery

No licensed photography was available, so all six images are **original illustrations** made for this demo, marked `illustrative: true` and labelled on the page. They are not photographs of Fitness World and do not show what equipment the gym has.

To use real photos, put optimised files in `public/images/` and update `src`, `alt`, `position` and `illustrative` in `src/data/images.ts`. Only use photos you have the rights to, and keep `illustrative: true` for anything that is not the actual gym. If an image file is missing, its frame falls back to a hatched texture and the page still renders (checked at build time).

## Open items to confirm with the owner

- Full weekly opening hours and closing times
- Membership plans, durations, prices and terms (the memberships page stays enquiry-led until then)
- Whether +91 98956 44060 is on WhatsApp (`contact.whatsappConfirmed`). Until confirmed, WhatsApp actions are not shown.
- Whether the Directions link opens the right pin (`maps.verified`). Until confirmed, the Maps link is labelled a general plus-code search.
- Which channel enquiries should go to, before the demo form is made real
- Official social accounts, an email address, facilities and equipment, trainers, photographs, and a verified Google reviews link
- Permission to use the business name and details for a public site

## Search engines and privacy

This is a private, unapproved concept, so one switch, `PRIVATE_DEMO` in `src/data/privacy.ts`, controls three layers:

1. every page has `<meta name="robots" content="noindex, nofollow">` (root layout; Next.js adds its own on the 404 page),
2. `robots.txt` is generated by `src/app/robots.ts` and disallows all crawling, and **no sitemap is published**,
3. every response, including images, icons and the 404 page, carries `X-Robots-Tag: noindex, nofollow, noarchive` (`headers()` in `next.config.ts`).

There is no structured data, canonical URL or Open Graph markup. Do not set `PRIVATE_DEMO` to false until the owner has approved a public site and a deployment decision has been made. Page titles say "concept demo" and the footer carries a readable disclosure, so the site is not mistaken for the business's own.

The enquiry form cannot submit natively: its button is disabled until the page has hydrated and a notice explains this with JavaScript off, so typed details can never reach the URL or a server.

## Favicon

`src/app/icon.svg`, `src/app/favicon.ico` and `src/app/apple-icon.png` are an original lime "F" on the dark tile. They are not the business's logo or brand assets. Replace them if the owner supplies official ones.

## Deployment readiness (assessment, nothing deployed)

Verified locally: clean install, lint, type-check and production build; no environment variables, secrets or database; no external requests to render; layout shift 0.000 and first-load size about 240 to 340 KB compressed in a local lab run; zero production-dependency advisories (the 5 dev-only advisories from the lint tooling remain).

Not verified: behaviour on Vercel or Netlify (including the `X-Robots-Tag` header and the Turbopack CSS rule in `next.config.ts`), real devices and screen readers.

Before any deployment:

- Put the preview behind host-level access control (for example password or deployment protection), since it shows a real business's name, address and phone number without permission.
- Decide what happens to `/design-preview`: delete it, or make it return a 404 in production.
- Make a first Git commit (the repository has no commits yet).
- Do not flip `PRIVATE_DEMO` or remove the disclaimers.

## QA scripts

`qa/` holds repeatable checks (not part of the build). See `qa/README.md`.

## Planned stages

1. Project setup and technical foundation (done)
2. Design system, UI components and shared layout (done)
3. Homepage (done)
4. Supporting pages, navigation and honest demo enquiry form (done)
5. Pre-presentation QA, privacy hardening and deployment-readiness assessment (done)
6. Owner confirmations, real content and a real enquiry channel; then SEO, `metadataBase`, final accessibility pass and deployment

Out of scope for now: owner dashboard, database-backed enquiries, online payments and membership management.

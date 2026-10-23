import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PRIVATE_DEMO } from "@/data/privacy";
import { siteConfig } from "@/data/site";
import "./globals.css";

// Bundled variable fonts (SIL Open Font License, see src/fonts). Exposed as the
// CSS variables that the `font-display` and `font-sans` tokens in globals.css use.
const displayFont = localFont({
  src: "../fonts/big-shoulders-display-latin-wght-normal.woff2",
  variable: "--font-display-face",
  weight: "100 900",
  display: "swap",
});

const bodyFont = localFont({
  src: "../fonts/hanken-grotesk-latin-wght-normal.woff2",
  variable: "--font-body-face",
  weight: "100 900",
  display: "swap",
});

// Titles say "concept demo" so a browser tab, bookmark or history entry never
// reads as the business's own website.
const conceptLabel = `${siteConfig.name} concept demo`;
const title = `${conceptLabel} | Gym in Vazhayila, Enikkara, ${siteConfig.address.city}`;
const description = `An independent concept website for ${siteConfig.name}, a gym in Vazhayila, Enikkara, ${siteConfig.address.city}. This is not the official website.`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${conceptLabel}`,
  },
  description,
  // Private demo: keep it out of search engines. One switch, see src/data/privacy.ts.
  robots: PRIVATE_DEMO ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-3 focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

/**
 * Single switch for the demo's privacy controls.
 *
 * While true this is a private, unapproved concept, and three things hold:
 *   1. every page carries <meta name="robots" content="noindex, nofollow">
 *      (src/app/layout.tsx),
 *   2. robots.txt disallows all crawling and no sitemap is published
 *      (src/app/robots.ts),
 *   3. every response, including images and the 404 page, carries an
 *      X-Robots-Tag: noindex header (next.config.ts).
 *
 * Do not set this to false until the owner has approved a public site and a
 * deployment decision has been made. See "Search engines and privacy" in the README.
 */
export const PRIVATE_DEMO = true;

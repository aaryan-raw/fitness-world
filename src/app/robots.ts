import type { MetadataRoute } from "next";
import { PRIVATE_DEMO } from "@/data/privacy";

/**
 * Private demo: disallow all crawling. Deliberately no `sitemap` entry, and
 * there is no sitemap route, so no page is listed anywhere for crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return PRIVATE_DEMO
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/" } };
}

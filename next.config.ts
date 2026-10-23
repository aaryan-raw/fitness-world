import type { NextConfig } from "next";
import { PRIVATE_DEMO } from "./src/data/privacy";

const nextConfig: NextConfig = {
  // `cacheComponents` and `partialPrefetching` are opt-in in this Next.js
  // version and are deliberately left off: this is a mostly static marketing
  // site that does not need them. Revisit if request-time data is added.
  turbopack: {
    // Routes Tailwind CSS v4 through its Turbopack loader (from create-next-app).
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Private demo: ask search engines not to index or archive anything, including
  // images and the 404 page. Controlled by PRIVATE_DEMO in src/data/privacy.ts.
  async headers() {
    if (!PRIVATE_DEMO) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;

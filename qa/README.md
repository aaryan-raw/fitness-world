# QA scripts

Not part of the website build. Repeatable checks used to verify each stage. The browser checks need Python with Playwright and Chromium, which are **not** project dependencies. Build and start the site first:

```bash
npm run build && npx next start -p 3111
```

| Script | What it checks |
| --- | --- |
| `validation_cases.mjs` | Unit cases for the enquiry form rules. `node qa/validation_cases.mjs` (Node 22.18+ runs the TypeScript file directly). |
| `stage3_homepage_checks.py` | Homepage links, content audit, focus rings, failed-image fallback, hero text contrast. |
| `stage4_checks.py` | Routes, metadata, overflow at five widths, link crawl, CTA click-through, navigation, form behaviour, content audit. |
| `stage5_checks.py` | Privacy and search controls on real responses (robots meta, `X-Robots-Tag`, `robots.txt`, no sitemap), favicon and titles, form cannot submit before hydration or with JS off, CTA and phone consistency, owner-demo journeys, 404 recovery, console errors, contrast of text over illustrations. |
| `axe_scan.py` | axe-core accessibility scan of every route at two widths and the form states. Needs `AXE_PATH` pointing at `axe.min.js` (`npm i axe-core` somewhere outside the project). |
| `performance_snapshot.py` | Local lab page weight, LCP and layout shift. A regression guide only, not a Lighthouse score. |

Set `BASE` to test a different address (default `http://localhost:3111`).

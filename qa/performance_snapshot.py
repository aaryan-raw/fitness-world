"""
Local lab snapshot of page weight, Largest Contentful Paint and layout shift, per route and width.
Unthrottled and on localhost, so it is a regression guide, not a Lighthouse score or real-user data.
Run against a production build: python3 qa/performance_snapshot.py
"""
import os
from collections import defaultdict
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3111")
INIT = """
window.__cls = 0; window.__lcp = 0;
new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value }).observe({type:'layout-shift', buffered:true});
new PerformanceObserver(l => { const es = l.getEntries(); window.__lcp = es[es.length-1].startTime }).observe({type:'largest-contentful-paint', buffered:true});
"""
with sync_playwright() as p:
    b = p.chromium.launch()
    print(f"{'route':<14}{'width':>6}  {'LCP ms':>7} {'CLS':>6}   transferred on first load (KB, compressed): total | doc | js | css | font | image")
    for route in ["/", "/about", "/facilities", "/memberships", "/contact", "/reviews"]:
        for w in (390, 1440):
            ctx = b.new_context(viewport={"width": w, "height": 900}, device_scale_factor=2 if w == 390 else 1)
            page = ctx.new_page(); page.add_init_script(INIT)
            cdp = ctx.new_cdp_session(page); cdp.send("Network.enable"); kinds, sizes = {}, {}
            cdp.on("Network.responseReceived", lambda e: kinds.__setitem__(e["requestId"], e["type"]))
            cdp.on("Network.loadingFinished", lambda e: sizes.__setitem__(e["requestId"], e["encodedDataLength"]))
            page.goto(BASE + route, wait_until="load"); page.wait_for_timeout(2500)
            lcp, cls = page.evaluate("[window.__lcp, window.__cls]")
            by = defaultdict(int)
            for rid, n in sizes.items(): by[kinds.get(rid, "Other")] += n
            kb = lambda k: f"{by[k] / 1024:5.0f}"
            print(f"{route:<14}{w:>6}  {lcp:>7.0f} {cls:>6.3f}   {sum(by.values()) / 1024:6.0f} | {kb('Document')} | {kb('Script')} | {kb('Stylesheet')} | {kb('Font')} | {kb('Image')}")
            ctx.close()
    b.close()

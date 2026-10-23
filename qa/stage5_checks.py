"""
Stage 5 regression checks: privacy and search controls, favicon and identity, form privacy before
hydration, CTA and phone consistency, owner-demo journeys, 404 recovery, console errors, and
worst-case contrast of text over illustrations.

Run against a production build:  npm run build && npx next start -p 3111 && python3 qa/stage5_checks.py
Needs Python Playwright + Chromium. The contrast section also needs axe-core (AXE_PATH) and is skipped without it.
"""
import io, os, re, sys, urllib.request, urllib.error
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
from PIL import Image

BASE = os.environ.get("BASE", "http://localhost:3111")
AXE_PATH = os.environ.get("AXE_PATH", "/tmp/axe/node_modules/axe-core/axe.min.js")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHONE_DIGITS, PHONE_TEXT, PHONE_TEL = "919895644060", "+91 98956 44060", "tel:+919895644060"
ROUTES = ["/", "/about", "/facilities", "/memberships", "/contact", "/reviews", "/design-preview"]
NAV = [("About", "/about"), ("Facilities", "/facilities"), ("Memberships", "/memberships"), ("Reviews", "/reviews"), ("Contact", "/contact")]
H1 = {"/": "built by consistency.", "/about": "consistency, with support behind it.", "/facilities": "find the training that fits.",
      "/memberships": "start with a conversation.", "/reviews": "what members say.", "/contact": "get in touch with the gym."}

results = []
def check(name, cond, detail=""):
    results.append((name, bool(cond)))
    print(("PASS " if cond else "FAIL ") + name + (f"  [{detail}]" if detail else ""))

def fetch(path, binary=False):
    try: r = urllib.request.urlopen(BASE + path)
    except urllib.error.HTTPError as e: r = e
    raw = r.read()
    return r.status, {k.lower(): v for k, v in r.headers.items()}, (raw if binary else raw.decode("utf-8", "ignore"))

def lum(c): c = c / 255; return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
def L(rgb): return 0.2126 * lum(rgb[0]) + 0.7152 * lum(rgb[1]) + 0.0722 * lum(rgb[2])
def ratio(a, b): la, lb = sorted([L(a), L(b)], reverse=True); return (la + 0.05) / (lb + 0.05)
def h1_of(page): return page.evaluate("(document.querySelector('h1')||{}).textContent||''").strip().lower()
def settle(page, ms=500):
    h = page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, h, 500): page.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})"); page.wait_for_timeout(70)
    page.wait_for_timeout(ms); page.evaluate("window.scrollTo({top:0,behavior:'instant'})"); page.wait_for_timeout(150)

# ================= 1. PRIVACY AND SEARCH CONTROLS (raw HTTP, no browser) =================
print("\n== 1. Privacy and search controls (real production responses) ==")
check("source: PRIVATE_DEMO switch is on", re.search(r"PRIVATE_DEMO\s*=\s*true", open(os.path.join(ROOT, "src/data/privacy.ts")).read()) is not None)
paths = ROUTES + ["/nonexistent", "/about/missing", "/api/anything", "/contact/", "/memberships?x=1", "/memberships#enquire"]
for path in paths:
    st, hd, body = fetch(path)
    xr = hd.get("x-robots-tag", "")
    metas = re.findall(r'<meta name="robots" content="([^"]*)"', body)
    check(f"{path}: HTTP {st}, noindex in HTML robots meta ({len(metas)} tag(s)) and X-Robots-Tag header", bool(metas) and all("noindex" in m for m in metas) and "noindex" in xr and "noarchive" in xr, f"meta={metas} header={xr!r}")
    if st == 200 and path in ROUTES:
        check(f"{path}: no canonical, Open Graph or Twitter tags, no JSON-LD", not re.search(r'rel="canonical"|property="og:|name="twitter:|ld\+json|schema\.org', body))
st, hd, body = fetch("/robots.txt")
lines = [l.strip() for l in body.splitlines() if l.strip()]
check("robots.txt: 200 text/plain and disallows everything", st == 200 and hd.get("content-type", "").startswith("text/plain") and lines == ["User-Agent: *", "Disallow: /"], str(lines))
check("robots.txt: lists no sitemap and allows nothing", "sitemap" not in body.lower() and "allow:" not in body.lower().replace("disallow:", ""))
for sm in ["/sitemap.xml", "/sitemap-0.xml", "/sitemap_index.xml", "/sitemap-index.xml", "/server-sitemap.xml"]:
    check(f"no sitemap exposed at {sm}", fetch(sm)[0] == 404)
_, _, home = fetch("/")
assets = ["/images/hero.webp", "/icon.svg", "/favicon.ico", "/apple-icon.png", "/robots.txt"] + re.findall(r'href="(/_next/static/[^"]+\.css)"', home)[:1] + re.findall(r'src="(/_next/static/[^"]+\.js)"', home)[:1]
for a in assets:
    st, hd, _ = fetch(a, binary=True)
    check(f"asset {a.split('?')[0][:48]}: {st} with X-Robots-Tag noindex", st == 200 and "noindex" in hd.get("x-robots-tag", ""))

# ================= 2. FAVICON AND SITE IDENTITY =================
print("\n== 2. Favicon, titles and disclosure ==")
check("head links an .ico icon, an SVG icon and an apple-touch-icon", all(re.search(p_, home) for p_ in [r'rel="icon" href="/favicon\.ico[^"]*"', r'rel="icon" href="/icon\.svg[^"]*"', r'rel="apple-touch-icon" href="/apple-icon\.png[^"]*"']))
st, hd, ico = fetch("/favicon.ico", binary=True)
im = Image.open(io.BytesIO(ico)); sizes = sorted(im.ico.sizes()) if hasattr(im, "ico") else []
check("favicon.ico: image/x-icon with 16, 32 and 48px images, and not the 15,086-byte default Next.js icon", st == 200 and "icon" in hd["content-type"] and {(16, 16), (32, 32), (48, 48)} <= set(sizes) and len(ico) != 15086, f"{len(ico)}B {sizes}")
st, hd, svg = fetch("/icon.svg")
check("icon.svg: image/svg+xml, self-contained (no external refs, scripts or embedded images)", st == 200 and hd["content-type"].startswith("image/svg+xml") and not re.search(r"<script|<image|href=|url\(|https?://(?!www\.w3\.org)", svg))
st, hd, ap = fetch("/apple-icon.png", binary=True); ai = Image.open(io.BytesIO(ap))
check("apple-icon.png: 180x180 PNG", st == 200 and ai.size == (180, 180) and ai.format == "PNG", f"{ai.size}")
px = Image.open(io.BytesIO(ap)).convert("RGB"); corner, centre = px.getpixel((2, 2)), px.getpixel((90, 90))
check("apple-icon.png: dark tile (palette canvas colour) with lime mark present", sum(corner) < 80 and any(px.getpixel((x, y))[1] > 200 and px.getpixel((x, y))[0] > 150 for x in range(40, 140, 4) for y in range(40, 140, 4)), f"corner={corner}")
for path in ROUTES + ["/nonexistent"]:
    _, _, body = fetch(path); title = re.search(r"<title>([^<]*)</title>", body).group(1)
    check(f"{path}: title says concept demo", "concept demo" in title and "Fitness World" in title, title)
check("home meta description says it is not the official website and is a sensible length", (lambda d: "not the official" in d.lower() and 60 <= len(d) <= 175)(re.search(r'<meta name="description" content="([^"]*)"', home).group(1)))

# ================= 3. FORM PRIVACY BEFORE HYDRATION =================
print("\n== 3. Enquiry form cannot submit natively (JS off / before hydration) ==")
for route in ("/contact", "/memberships"):
    _, _, html = fetch(route)
    check(f"{route}: served HTML has the submit button disabled", re.search(r'<button type="submit"[^>]*disabled=""', html) is not None)
    check(f"{route}: served HTML has the no-JavaScript notice (Nothing is sent, phone number)", "JavaScript is turned off" in html and "Nothing is sent" in html and "+91 98956 44060" in html)
    check(f"{route}: form has no action or method attribute", re.search(r'<form[^>]*\b(action|method)=', html) is None)
with sync_playwright() as p:
    b = p.chromium.launch()
    for route in ("/contact", "/memberships"):
        for label, kw, block in [("JS disabled", {"java_script_enabled": False}, False), ("scripts blocked (pre-hydration)", {}, True)]:
            ctx = b.new_context(viewport={"width": 1440, "height": 900}, **kw); page = ctx.new_page(); reqs = []
            page.on("request", lambda r: reqs.append((r.method, r.url)))
            if block: page.route("**/_next/static/**/*.js", lambda r: r.abort())
            page.goto(BASE + route, wait_until="load")
            btn = page.get_by_role("button", name="Check My Details"); name = page.get_by_label(re.compile(r"^Name")); phone = page.get_by_label("Phone number")
            disabled = btn.is_disabled(); name.fill("Private Person"); phone.fill("9876543210")
            name.press("Enter"); page.wait_for_timeout(500)
            try: btn.click(timeout=800)
            except Exception: pass
            page.wait_for_timeout(500); u = urlparse(page.url)
            leaked = [u_ for m, u_ in reqs if "Private" in u_ or "9876543210" in u_]
            check(f"{route} [{label}]: button disabled, URL unchanged, nothing sent", disabled and u.path == route and u.query == "" and not leaked, f"url={page.url.replace(BASE,'')} leaked={leaked}")
            ctx.close()
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page(); page.goto(BASE + "/contact", wait_until="load")
    page.wait_for_function("!document.querySelector('form button[type=submit]').disabled", timeout=5000)
    check("with JavaScript on, the submit button becomes enabled after hydration", not page.get_by_role("button", name="Check My Details").is_disabled())
    ctx.close()

    # ================= 4. CTA WORDING, PHONE, DISCLOSURE, CLAIMS =================
    print("\n== 4. Consistency: CTA wording, phone number, disclosure, claims ==")
    SMALL = {"a", "an", "the", "in", "on", "of", "to", "and", "with", "for", "at", "by", "or"}
    def title_case_ok(label):
        for i, w in enumerate(label.split()):
            if re.search(r"[\d+]", w): return True
            core = re.sub(r"[^A-Za-z]", "", w)
            if not core: continue
            if i > 0 and core.lower() in SMALL:
                if core != core.lower(): return False
            elif not core[0].isupper(): return False
        return True
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    for route in ROUTES + ["/nonexistent"]:
        page.goto(BASE + route, wait_until="load")
        labels = [re.sub(r"\s*\(opens in a new tab\)", "", t).strip() for t in page.evaluate("Array.from(document.querySelectorAll('a.rounded-control, button.rounded-control')).map(e=>e.textContent.replace(/\\s+/g,' ').trim()).filter(Boolean)")]
        bad = [l for l in labels if not title_case_ok(l)]
        check(f"{route}: all {len(labels)} button/link labels use Title Case", not bad, str(bad))
        # phone consistency
        found = page.evaluate("""() => { const out=[]; const re=/\\+?\\d[\\d\\s().-]{8,}\\d/g;
          const t=document.body.innerText; (t.match(re)||[]).forEach(m=>out.push(['text',m.trim()]));
          document.querySelectorAll('[aria-label],[title],[alt],[placeholder],[value]').forEach(e=>['aria-label','title','alt','placeholder','value'].forEach(a=>{const v=e.getAttribute(a); if(v&&(v.match(re)||[]).length) out.push([a,v])}));
          document.querySelectorAll('a[href^="tel:"]').forEach(a=>out.push(['tel',a.getAttribute('href')])); return out }""")
        wrong = [f for f in found if re.sub(r"\D", "", f[1]) != PHONE_DIGITS or (f[0] != "tel" and f[1] != PHONE_TEXT)]
        check(f"{route}: every phone number (text, attributes, tel links) is exactly the supplied one ({len(found)} found)", not wrong, str(wrong))
        # disclosure and claims
        ft = page.locator("footer").inner_text()
        check(f"{route}: footer carries the not-official / not-affiliated disclosure", all(s in ft for s in ["independent concept website", "not the official Fitness World website", "not affiliated with, approved by or endorsed by the business", "Independent concept demo"]))
        text = page.evaluate("document.body.innerText")
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n+", text) if re.search(r"official|endors|approv|affiliat|partner|authori[sz]ed|licen[cs]ed|certified|verified", s, re.I)]
        unneg = [s for s in sentences if not re.search(r"\bnot\b|\bno\b|\bnone\b|n't|\bunless\b|\buntil\b|\bwithout\b|\bonly if\b", s, re.I)]
        check(f"{route}: every sentence about official/approved/verified status is a negation or caveat", not unneg, str(unneg[:2]))
    page.goto(BASE + "/design-preview", wait_until="load")
    pv = page.locator("main").inner_text().lower()
    check("design-preview: no external links and no tel/mailto other than the supplied number", page.locator("main a[href^='http'], main a[href^='mailto']").count() == 0 and {a.get_attribute("href") for a in page.locator("main a[href^='tel:']").all()} <= {PHONE_TEL})
    check("design-preview: no sample copy that implies plans, facilities, replies or a live channel", not re.search(r"monthly|membership options|our facilities|reply to your|we use this|train hard|trainer|per month|price", pv), str(re.findall(r"monthly|membership options|our facilities|reply to your|we use this|train hard|trainer|per month|price", pv)))
    check("design-preview: still noindex, and not linked from header, footer or any other route", "noindex" in page.locator("meta[name=robots]").first.get_attribute("content") and all(page.goto(BASE + r_, wait_until="load") and page.locator("a[href='/design-preview']").count() == 0 for r_ in ROUTES[:6] + ["/nonexistent"]))
    page.goto(BASE + "/", wait_until="load")
    fs = page.evaluate("parseFloat(getComputedStyle(document.querySelector('footer p.type-body')).fontSize)")
    check("footer disclosure is body-size text (16px or more), not fine print", fs >= 16, f"{fs}px")
    ctx.close()

    # ================= 5. OWNER-DEMO JOURNEYS =================
    print("\n== 5. Owner-demo journeys (click through, then assert the destination) ==")
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    def journey(label, start, scope, name, path, frag="", nth=0, expect_text=None):
        page.goto(BASE + start, wait_until="load")
        page.locator(scope).get_by_role("link", name=name, exact=True).nth(nth).click()
        try: page.wait_for_url(re.compile(re.escape(path) + (("#" + frag) if frag else "") + "$"), timeout=8000)
        except Exception: pass
        u = urlparse(page.url); page.wait_for_timeout(300)
        ok = u.path == path and u.fragment == frag and (h1_of(page) == H1[path] if path in H1 else True) and (expect_text is None or expect_text.lower() in page.locator("main").inner_text().lower())
        check(label, ok, f"landed {page.url.replace(BASE,'')} h1={h1_of(page)!r}")
    journey("1. home hero 'Explore Memberships' -> membership page with the on-enquiry panel", "/", "main", "Explore Memberships", "/memberships", expect_text="Membership plans and prices available on enquiry")
    journey("2. home hero 'Get in Touch' -> contact page", "/", "main", "Get in Touch", "/contact", expect_text="Prepare an enquiry")
    journey("3. facilities 'Ask the Gym About Equipment' -> contact", "/facilities", "main", "Ask the Gym About Equipment", "/contact")
    journey("3b. facilities confirm 'Get in Touch' -> contact", "/facilities", "main", "Get in Touch", "/contact")
    journey("4. reviews CTA 'Get in Touch' -> contact", "/reviews", "main", "Get in Touch", "/contact")
    journey("5. memberships hero 'Make an Enquiry' -> #enquire on the same page", "/memberships", "main", "Make an Enquiry", "/memberships", "enquire")
    page.wait_for_timeout(1500)  # the site uses smooth scrolling; let it finish before measuring
    top = page.evaluate("document.getElementById('enquire').getBoundingClientRect().top"); demo_top = page.evaluate("Array.from(document.querySelectorAll('form span')).find(s=>s.textContent==='Demo form').getBoundingClientRect().top")
    check("5b. after 'Make an Enquiry' the enquiry section is below the sticky header and the Demo form notice is on screen", 60 <= top < 300 and 0 < demo_top < 900, f"section top={top:.0f}, demo notice top={demo_top:.0f}")
    for r_ in ROUTES[:6]:
        journey(f"5c. header 'Membership Enquiry' on {r_} -> /memberships#enquire", r_, "header", "Membership Enquiry", "/memberships", "enquire")
    # telephone links, Maps
    for r_ in ROUTES[:6]:
        page.goto(BASE + r_, wait_until="load")
        tels = page.evaluate("Array.from(document.querySelectorAll('main a[href^=\"tel:\"]')).map(a=>a.getAttribute('href'))")
        check(f"6. {r_}: has a working tel link in the page body, all the supplied number ({len(tels)})", tels and set(tels) == {PHONE_TEL})
    for r_ in ("/", "/contact"):
        page.goto(BASE + r_, wait_until="load")
        a = page.locator("main a", has_text="Search on Google Maps"); href = a.first.get_attribute("href")
        txt = page.locator("main").inner_text()
        check(f"7. {r_}: Maps link is a labelled plus-code search in a new tab with the caveat beside it", a.count() == 1 and href == "https://www.google.com/maps/search/?api=1&query=HX4H%2B62%20Thiruvananthapuram%2C%20Kerala" and a.first.get_attribute("target") == "_blank" and "noopener" in a.first.get_attribute("rel") and "not an official business pin" in txt, href)
    # header and footer navigation, desktop
    for scope, nm in (("header nav[aria-label=Main]", "header"), ("footer nav[aria-label=Footer]", "footer")):
        for label, path in NAV: journey(f"8. desktop {nm} nav '{label}' -> {path} (correct page)", "/", scope, label, path)
    ctx.close()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True); page = ctx.new_page()
    for label, path in NAV:
        page.goto(BASE + "/", wait_until="load"); btn = page.get_by_role("button", name="Menu"); btn.click()
        page.locator(f'[id="{btn.get_attribute("aria-controls")}"]').get_by_role("link", name=label, exact=True).click(); page.wait_for_url("**" + path); page.wait_for_timeout(300)
        check(f"8. mobile menu '{label}' -> {path} (correct page, menu closed)", urlparse(page.url).path == path and h1_of(page) == H1[path] and btn.get_attribute("aria-expanded") == "false")
    for label, path in NAV: journey(f"8. mobile footer nav '{label}' -> {path}", "/", "footer nav[aria-label=Footer]", label, path)
    ctx.close()

    # ================= 6. 404 RECOVERY =================
    print("\n== 6. 404 page and its recovery links ==")
    for bad in ("/nonexistent", "/about/missing", "/facilities/anything"):
        ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page(); resp = page.goto(BASE + bad, wait_until="load")
        check(f"{bad}: 404 page shows 'Page not found' with header, footer and Back to Home", resp.status == 404 and "page not found" in h1_of(page) and page.locator("header").count() == 1 and page.locator("footer").count() == 1 and page.get_by_role("link", name="Back to Home", exact=True).count() == 1)
        ctx.close()
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    journey("9. 404 'Back to Home' -> /", "/nonexistent", "main", "Back to Home", "/")
    for label, path in NAV: journey(f"9. 404 header nav '{label}' -> {path}", "/nonexistent", "header nav[aria-label=Main]", label, path)
    for label, path in NAV: journey(f"9. 404 footer nav '{label}' -> {path}", "/nonexistent", "footer nav[aria-label=Footer]", label, path)
    journey("9. 404 header 'Membership Enquiry' -> /memberships#enquire", "/nonexistent", "header", "Membership Enquiry", "/memberships", "enquire")
    check("9. trailing-slash and query variants resolve", fetch("/about/")[0] == 200 and fetch("/contact?name=x")[0] == 200)
    ctx.close()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True); page = ctx.new_page(); page.goto(BASE + "/nonexistent", wait_until="load")
    btn = page.get_by_role("button", name="Menu"); btn.click(); ok_open = btn.get_attribute("aria-expanded") == "true"; page.keyboard.press("Escape")
    check("9. 404 mobile menu opens, Escape closes and restores focus", ok_open and btn.get_attribute("aria-expanded") == "false" and page.evaluate("document.activeElement.getAttribute('aria-label')") == "Menu")
    btn.click(); page.locator(f'[id="{btn.get_attribute("aria-controls")}"]').get_by_role("link", name="Contact", exact=True).click(); page.wait_for_url("**/contact")
    check("9. 404 mobile menu recovers to /contact", h1_of(page) == H1["/contact"])
    ctx.close()

    # ================= 7. CONSOLE ERRORS =================
    print("\n== 7. Console errors and page errors ==")
    for w in (390, 1440):
        for route in ROUTES + ["/nonexistent"]:
            ctx = b.new_context(viewport={"width": w, "height": 900}); page = ctx.new_page(); msgs = []
            page.on("console", lambda m: msgs.append(m.text) if m.type in ("error", "warning") and not (route == "/nonexistent" and "404" in m.text) else None); page.on("pageerror", lambda e: msgs.append(str(e)))
            page.goto(BASE + route, wait_until="load"); settle(page, 300)
            check(f"{route} @ {w}px: no console errors, warnings or page errors", not msgs, str(msgs[:2])); ctx.close()

    # ================= 8. CONTRAST OF TEXT OVER ILLUSTRATIONS =================
    print("\n== 8. Worst-case contrast of text over illustrations (axe 'incomplete' nodes, measured from pixels) ==")
    if not os.path.exists(AXE_PATH): print("SKIP  axe-core not found at", AXE_PATH)
    else:
        AXE = open(AXE_PATH).read()
        for w in (390, 1440):
            for route in ["/", "/about", "/facilities", "/memberships"]:
                ctx = b.new_context(viewport={"width": w, "height": 900}); page = ctx.new_page(); page.goto(BASE + route, wait_until="load"); settle(page, 500)
                page.evaluate(AXE)
                targets = page.evaluate("axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}}).then(r=>r.incomplete.flatMap(v=>v.nodes.map(n=>n.target[0])))")
                info = page.evaluate("""(sels)=>sels.map(s=>{const el=document.querySelector(s); if(!el) return null; const cs=getComputedStyle(el); const rects=[]; const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); let n; while((n=tw.nextNode())){ if(!n.textContent.trim()) continue; const r=document.createRange(); r.selectNodeContents(n); for(const q of r.getClientRects()) if(q.width>1&&q.height>1) rects.push([q.left+scrollX,q.top+scrollY,q.width,q.height]);} return {c:cs.color,fs:parseFloat(cs.fontSize),fw:parseInt(cs.fontWeight),rects}})""", targets)
                page.add_style_tag(content="*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}")
                shot = Image.open(io.BytesIO(page.screenshot(full_page=True))).convert("RGB"); worst = (99, "")
                for t, i in zip(targets, info):
                    if not i: continue
                    m = re.findall(r"[\d.]+", i["c"]); col = tuple(int(float(x)) for x in m[:3]); large = i["fs"] >= 24 or (i["fs"] >= 18.66 and i["fw"] >= 700); need = 3.0 if large else 4.5
                    for (x, y, rw, rh) in i["rects"]:
                        reg = shot.crop((int(x), int(y), int(x + rw) + 1, int(y + rh) + 1)); px = list(reg.get_flattened_data()) if hasattr(reg, "get_flattened_data") else list(reg.getdata())
                        lo, hi = min(px, key=L), max(px, key=L); r_ = min(ratio(col, lo), ratio(col, hi))
                        if r_ - need < worst[0]: worst = (r_ - need, f"{t[:50]} {r_:.1f}:1 (need {need})")
                check(f"{route} @ {w}px: all {len(targets)} text-over-image nodes meet contrast in the worst-case pixel", not targets or worst[0] >= 0, worst[1])
                ctx.close()
    b.close()

fails = [n for n, ok in results if not ok]
print(f"\n{len(results) - len(fails)}/{len(results)} checks passed")
if fails: print("FAILED:"); [print("  -", f) for f in fails]
sys.exit(1 if fails else 0)

"""
Stage 4 browser checks for the Fitness World demo.

Run against a production build:   npm run build && npx next start -p 3111
Then:                             python3 qa/stage4_checks.py        (BASE=http://localhost:3111)

Needs Python Playwright with Chromium. It is not a project dependency.
"""
import os, re, sys, urllib.request, urllib.error
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3111")
WIDTHS = [360, 390, 768, 1024, 1440]
CONTENT = ["/about", "/facilities", "/memberships", "/contact", "/reviews"]
ROUTES = ["/"] + CONTENT + ["/design-preview"]
PHONE_TEL = "tel:+919895644060"

results = []
def check(name, cond, detail=""):
    results.append((name, bool(cond)))
    print(("PASS " if cond else "FAIL ") + name + (f"  [{detail}]" if detail else ""))

def status(path):
    try: return urllib.request.urlopen(BASE + path).status
    except urllib.error.HTTPError as e: return e.code

def lum(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
def L(rgb): return 0.2126 * lum(rgb[0]) + 0.7152 * lum(rgb[1]) + 0.0722 * lum(rgb[2])
def ratio(a, b):
    la, lb = sorted([L(a), L(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

def settle(page, ms=600):
    h = page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, h, 500):
        page.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})"); page.wait_for_timeout(80)
    page.wait_for_timeout(ms); page.evaluate("window.scrollTo({top:0,behavior:'instant'})"); page.wait_for_timeout(200)

OVERFLOW = """() => { const d=document.documentElement, vw=d.clientWidth, off=[];
 document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect(); if(r.width>0&&(r.right>vw+1||r.left<-1)){let p=el.parentElement,c=false;while(p&&p!==document.body){if(getComputedStyle(p).overflowX!=='visible'){c=true;break}p=p.parentElement} if(!c) off.push(el.tagName+'.'+String(el.className).slice(0,40))}});
 return {sw:d.scrollWidth,cw:vw,off:off.slice(0,3)} }"""

with sync_playwright() as p:
    b = p.chromium.launch()

    # ============ 1. ROUTES, METADATA, NOINDEX, STRUCTURE ============
    print("\n== 1. Routes, metadata, noindex, structure ==")
    for r in ROUTES:
        check(f"route {r} returns 200", status(r) == 200)
    check("route /nonexistent returns 404", status("/nonexistent") == 404)

    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    meta = {}
    for r in ROUTES + ["/nonexistent"]:
        page = ctx.new_page()
        failed, external = [], []
        page.on("response", lambda resp: failed.append((resp.status, resp.url)) if resp.status >= 400 and "_rsc" not in resp.url and not resp.url.endswith("/nonexistent") else None)
        page.on("request", lambda req: external.append(req.url) if not req.url.startswith(BASE) and not req.url.startswith("data:") else None)
        page.goto(BASE + r, wait_until="load"); settle(page)
        title = page.title()
        desc = page.locator("meta[name=description]").get_attribute("content") if page.locator("meta[name=description]").count() else ""
        robots_all = page.evaluate("Array.from(document.querySelectorAll('meta[name=robots]')).map(m=>m.content)")
        robots = ", ".join(robots_all)
        html = page.content()
        meta[r] = (title, desc, robots)
        check(f"{r}: every robots meta says noindex ({len(robots_all)} tag(s))", bool(robots_all) and all("noindex" in x for x in robots_all), robots)
        check(f"{r}: title mentions Fitness World", "Fitness World" in title, title)
        if r not in ("/nonexistent",):
            check(f"{r}: meta description present (40-220 chars)", 40 <= len(desc or "") <= 220, f"{len(desc or '')} chars")
        check(f"{r}: no JSON-LD / schema.org markup", "application/ld+json" not in html and "schema.org" not in html)
        check(f"{r}: lang=en-IN", page.evaluate("document.documentElement.lang") == "en-IN")
        hs = page.evaluate("Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(h=>h.getClientRects().length).map(h=>+h.tagName[1])")
        check(f"{r}: exactly one h1", hs.count(1) == 1, str(hs.count(1)))
        check(f"{r}: heading order has no skipped levels", hs and hs[0] == 1 and all(b2 - a <= 1 for a, b2 in zip(hs, hs[1:])), str(hs))
        imgs = page.evaluate("Array.from(document.images).map(i=>({alt:i.alt.trim(), ok:i.complete&&i.naturalWidth>0}))")
        check(f"{r}: all {len(imgs)} images loaded with alt text", all(i["ok"] and i["alt"] for i in imgs))
        check(f"{r}: no failed (>=400) requests", not failed, str(failed[:2]))
        check(f"{r}: no external network requests", not external, str(external[:2]))
        page.close()
    print("   titles:", {r: m[0] for r, m in meta.items()})
    ctx.close()

    # ============ 2. OVERFLOW: every route x 5 widths ============
    print("\n== 2. Horizontal overflow, every route at 5 widths ==")
    for r in ROUTES + ["/nonexistent"]:
        bad = []
        for w in WIDTHS:
            c = b.new_context(viewport={"width": w, "height": 900}); pg = c.new_page()
            pg.goto(BASE + r, wait_until="load"); settle(pg, 300)
            o = pg.evaluate(OVERFLOW)
            if o["sw"] > o["cw"] or o["off"]: bad.append((w, o["sw"], o["off"]))
            c.close()
        check(f"overflow {r} @ {WIDTHS}", not bad, str(bad))

    # ============ 3. INTERNAL LINK CRAWL ============
    print("\n== 3. Internal link crawl (every link on every route) ==")
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    all_links, externals, anchors = {}, set(), []
    for r in ROUTES:
        page.goto(BASE + r, wait_until="load")
        for a in page.evaluate("Array.from(document.querySelectorAll('a[href]')).map(a=>({h:a.getAttribute('href'),t:a.textContent.trim().replace(/\\s+/g,' ').slice(0,40),tg:a.target}))"):
            all_links.setdefault(a["h"], set()).add(r)
            if a["h"].startswith("http") and r != "/design-preview": externals.add((a["h"], a["tg"]))  # preview is dev-only
    hrefs = sorted(all_links)
    print("   unique hrefs:", hrefs)
    check("links: none are bare '#' or empty", all(h not in ("#", "") for h in hrefs))
    check("links: no javascript:/mailto:/wa.me/social hrefs", not [h for h in hrefs if re.search(r"^javascript|^mailto|wa\.me|whatsapp|instagram|facebook|youtube", h, re.I)])
    internal = [h for h in hrefs if h.startswith("/")]
    for h in internal:
        path, _, frag = h.partition("#")
        check(f"link {h}: resolves 200", status(path or "/") == 200)
        if frag:
            page.goto(BASE + path, wait_until="load")
            check(f"link {h}: #{frag} target exists on page", page.locator(f"[id='{frag}']").count() == 1)
    check("link: skip link target #main-content exists", page.locator("#main-content").count() == 1)
    check("links: tel link is the supplied number only", {h for h in hrefs if h.startswith("tel:")} == {PHONE_TEL})
    ext_urls = {e[0] for e in externals}
    print("   external links:", ext_urls)
    check("links: only external link is the labelled Google Maps plus-code search", len(ext_urls) == 1 and all("google.com/maps/search" in u and "HX4H%2B62" in u for u in ext_urls))
    check("links: external link opens in new tab", all(t == "_blank" for _, t in externals))
    check("links: /design-preview is not linked from any other route", all(rs == {"/design-preview"} for h, rs in all_links.items() if h == "/design-preview") or "/design-preview" not in all_links)
    ctx.close()

    # ============ 4. CTA CLICK-THROUGH ============
    print("\n== 4. CTA click-through (exact accessible link names) ==")
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    def click_expect(start, scope, name, path, frag="", label=None, nth=0, css=None):
        page.goto(BASE + start, wait_until="load")
        loc = page.locator(css) if css else page.locator(scope).get_by_role("link", name=name, exact=True)
        loc.nth(nth).click()
        try: page.wait_for_url(re.compile(re.escape(path) + (("#" + frag) if frag else "") + "$"), timeout=8000)
        except Exception: pass
        u = urlparse(page.url); ok = u.path == path and u.fragment == frag
        check(label or f"{start}: '{name}' -> {path}{'#'+frag if frag else ''}", ok, page.url.replace(BASE, ""))
    click_expect("/", "main", "Explore Memberships", "/memberships", label="home hero 'Explore Memberships' -> /memberships")
    click_expect("/", "main", "Get in Touch", "/contact", label="home hero 'Get in Touch' -> /contact")
    click_expect("/", "main", "Enquire About Membership", "/memberships", "enquire", label="home 'Enquire About Membership' -> /memberships#enquire")
    click_expect("/", "main", "About Fitness World", "/about", label="home 'About Fitness World' -> /about")
    click_expect("/", "main", "", "/facilities", css="main a[href='/facilities']", label="home training card -> /facilities")
    click_expect("/", "main", "Get in Touch with the Gym", "/contact", label="home reviews 'Get in Touch with the Gym' -> /contact")
    click_expect("/about", "header", "Membership Enquiry", "/memberships", "enquire", label="header CTA from /about -> /memberships#enquire")
    page.wait_for_timeout(600)
    top = page.evaluate("document.getElementById('enquire').getBoundingClientRect().top"); hb = page.evaluate("document.querySelector('header').getBoundingClientRect().bottom")
    check("/memberships#enquire via header CTA: form section lands just below the sticky header", hb - 2 <= top < 400, f"top={top:.0f} header_bottom={hb:.0f}")
    page.goto(BASE + "/memberships#enquire", wait_until="load"); page.wait_for_timeout(700)
    top = page.evaluate("document.getElementById('enquire').getBoundingClientRect().top")
    check("/memberships#enquire direct load lands on the form section", hb - 2 <= top < 400, f"top={top:.0f}")
    for nav in ["About", "Facilities", "Memberships", "Reviews", "Contact"]:
        click_expect("/", "header nav[aria-label=Main]", nav, "/" + nav.lower(), label=f"header nav '{nav}' -> /{nav.lower()}")
    for nav in ["About", "Facilities", "Memberships", "Reviews", "Contact"]:
        click_expect("/", "footer nav[aria-label=Footer]", nav, "/" + nav.lower(), label=f"footer nav '{nav}' -> /{nav.lower()}")
    click_expect("/about", "main", "Get in Touch", "/contact", label="/about hero 'Get in Touch' -> /contact")
    click_expect("/about", "main", "Enquire About Membership", "/memberships", "enquire", label="/about hero 'Enquire About Membership' -> /memberships#enquire", nth=0)
    click_expect("/about", "main", "Enquire About Membership", "/memberships", "enquire", label="/about CTA band 'Enquire About Membership' -> /memberships#enquire", nth=1)
    click_expect("/facilities", "main", "Ask the Gym About Equipment", "/contact", label="/facilities hero CTA -> /contact")
    for i in range(4): click_expect("/facilities", "main", "Ask the Gym", "/contact", label=f"/facilities row {i+1} 'Ask the Gym' -> /contact", nth=i)
    click_expect("/facilities", "main", "Get in Touch", "/contact", label="/facilities confirm 'Get in Touch' -> /contact")
    click_expect("/memberships", "main", "Make an Enquiry", "/memberships", "enquire", label="/memberships hero 'Make an Enquiry' -> /memberships#enquire")
    click_expect("/memberships", "main", "Find the Gym", "/contact", label="/memberships 'Find the Gym' -> /contact")
    click_expect("/reviews", "main", "Get in Touch", "/contact", label="/reviews CTA 'Get in Touch' -> /contact")
    click_expect("/nonexistent", "main", "Back to Home", "/", label="404 'Back to Home' -> /")
    ctx.close()

    # ============ 5. NAVIGATION: active state, menu, skip link ============
    print("\n== 5. Navigation behaviour on the new routes ==")
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    for r, label in [("/about", "About"), ("/facilities", "Facilities"), ("/memberships", "Memberships"), ("/reviews", "Reviews"), ("/contact", "Contact")]:
        page.goto(BASE + r, wait_until="load")
        cur = page.locator("nav[aria-label=Main]").first.locator("a[aria-current=page]")
        check(f"active nav on {r} is '{label}' only", cur.count() == 1 and cur.first.inner_text().strip().lower() == label.lower())
    page.goto(BASE + "/contact", wait_until="load"); page.keyboard.press("Tab")
    check("skip link is first tab stop on /contact", page.evaluate("document.activeElement.textContent.trim()") == "Skip to content")
    page.keyboard.press("Enter"); check("skip link moves focus to <main> on /contact", page.evaluate("document.activeElement.id") == "main-content")
    ctx.close()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True); page = ctx.new_page()
    for r in CONTENT:
        page.goto(BASE + r, wait_until="load")
        btn = page.get_by_role("button", name="Menu"); btn.click()
        ctrl = btn.get_attribute("aria-controls"); panel = page.locator(f'[id="{ctrl}"]')
        ok_open = btn.get_attribute("aria-expanded") == "true" and panel.is_visible()
        page.keyboard.press("Escape")
        ok_close = btn.get_attribute("aria-expanded") == "false" and not panel.is_visible() and page.evaluate("document.activeElement.getAttribute('aria-label')") == "Menu"
        check(f"mobile menu on {r}: opens; Escape closes and restores focus", ok_open and ok_close)
    page.goto(BASE + "/reviews", wait_until="load"); btn = page.get_by_role("button", name="Menu"); btn.click()
    page.locator(f'[id="{btn.get_attribute("aria-controls")}"]').get_by_role("link", name="Contact").click(); page.wait_for_url("**/contact")
    check("mobile menu closes after navigating", btn.get_attribute("aria-expanded") == "false")
    btn.click(); cur = page.locator(f'[id="{btn.get_attribute("aria-controls")}"] a[aria-current=page]')
    check("mobile menu marks current page on /contact", cur.count() == 1 and cur.first.inner_text().strip().lower() == "contact")
    ctx.close()

    # ============ 6. FORM BEHAVIOUR (both pages) ============
    print("\n== 6. Enquiry form behaviour ==")
    for route, preselected in [("/contact", False), ("/memberships", True)]:
        ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
        page.goto(BASE + route, wait_until="load"); settle(page, 300)
        reqs = []; page.on("request", lambda rq: reqs.append((rq.method, rq.url, rq.post_data or "")))
        form = page.get_by_role("form", name="Demo enquiry form")
        tag = f"[{route}]"
        check(f"{tag} form present, no action/method attribute (cannot submit natively)", form.count() == 1 and form.get_attribute("action") is None and form.get_attribute("method") is None)
        txt = form.inner_text()
        check(f"{tag} demo disclosure is first content inside the form", form.locator("> div").first.inner_text().lower().startswith("demo form") and "not" in txt.lower() and "send them to fitness world" in txt.lower())
        name = page.get_by_label(re.compile(r"^Name")); phone = page.get_by_label("Phone number"); email = page.get_by_label("Email address")
        etype = page.get_by_label(re.compile(r"enquiry about")); msg = page.get_by_label(re.compile(r"^Message"))
        check(f"{tag} all 5 controls reachable by their labels", all(x.count() == 1 for x in (name, phone, email, etype, msg)))
        check(f"{tag} required fields flagged (name, enquiry type)", name.get_attribute("required") is not None and etype.get_attribute("required") is not None)
        check(f"{tag} enquiry type preselected" if preselected else f"{tag} enquiry type starts unselected", (etype.input_value() == "membership") == preselected)
        check(f"{tag} autocomplete hints (name/tel/email)", name.get_attribute("autocomplete") == "name" and phone.get_attribute("autocomplete") == "tel" and email.get_attribute("autocomplete") == "email")
        check(f"{tag} select options are generic (no unverified services)", set(etype.locator("option").all_inner_texts()) == {"Choose one", "Membership options", "Equipment and facilities", "Visiting the gym", "Something else"})

        # --- empty submit
        submit = page.get_by_role("button", name="Check My Details"); submit.click()
        n_expected = 2 if preselected else 3
        summary = page.locator("[role=alert]", has_text="Please check")
        check(f"{tag} empty submit shows error summary for {n_expected} fields", summary.count() == 1 and f"Please check {n_expected} fields" in summary.inner_text(), summary.inner_text()[:60] if summary.count() else "no summary")
        check(f"{tag} focus moved to first invalid field (Name)", page.evaluate("document.activeElement.name") == "name")
        check(f"{tag} Name has aria-invalid and its error is linked via aria-describedby", name.get_attribute("aria-invalid") == "true" and page.evaluate("(()=>{const el=document.querySelector('input[name=name]');return el.getAttribute('aria-describedby').split(' ').map(i=>document.getElementById(i)?.textContent.trim()).join('|')})()") == "Enter your name.")
        grp = page.evaluate("(()=>{const ph=document.querySelector('input[name=phone]'),em=document.querySelector('input[name=email]');const id=ph.getAttribute('aria-describedby');return {same:id===em.getAttribute('aria-describedby'), text:document.getElementById(id)?.textContent.trim(), inv:[ph,em].every(e=>e.getAttribute('aria-invalid')==='true')}})()")
        check(f"{tag} phone+email share one group error and are both aria-invalid", grp["same"] and grp["inv"] and "phone number or an email" in (grp["text"] or ""), str(grp))
        if not preselected: check(f"{tag} enquiry type error shown and linked", etype.get_attribute("aria-invalid") == "true" and "Choose what your enquiry is about." in page.locator("body").inner_text())
        # summary links focus fields
        summary.locator("a", has_text="Phone or email").click(); check(f"{tag} summary link focuses the phone field", page.evaluate("document.activeElement.name") == "phone")
        # --- per-field format errors
        name.fill("Asha"); phone.fill("12345"); email.fill("not-an-email"); (etype.select_option("visit") if not preselected else None); submit.click()
        body = page.locator("body").inner_text()
        check(f"{tag} short phone -> specific phone error", "10 to 13 digits" in body and phone.get_attribute("aria-invalid") == "true")
        check(f"{tag} bad email -> specific email error", "name@example.com" in body and email.get_attribute("aria-invalid") == "true")
        phone.fill("98765 43210"); check(f"{tag} error clears for a field as soon as it is edited", phone.get_attribute("aria-invalid") is None and "10 to 13 digits" not in page.locator("body").inner_text())
        email.fill(""); submit.click()
        # name + phone (no email) is a valid enquiry, so the form hands over to the result panel
        check(f"{tag} phone alone satisfies the contact requirement (no group error; moves to result panel)", "One is enough" not in page.locator("body").inner_text() and page.get_by_role("heading", name="Nothing has been sent").is_visible())
        page.get_by_role("button", name="Edit Details").click(); page.wait_for_timeout(200)
        name = page.get_by_label(re.compile(r"^Name")); phone = page.get_by_label("Phone number"); email = page.get_by_label("Email address")
        etype = page.get_by_label(re.compile(r"enquiry about")); msg = page.get_by_label(re.compile(r"^Message")); submit = page.get_by_role("button", name="Check My Details")

        # --- valid submit: honest result
        reqs.clear()
        name.fill("Test Person"); phone.fill("+91 98765 43210"); msg.fill("A private test message 12345"); submit.click()
        result = page.get_by_role("heading", name="Nothing has been sent")
        check(f"{tag} valid input shows 'Nothing has been sent'", result.is_visible())
        panel_text = page.locator("main").inner_text().lower()
        check(f"{tag} focus moved to the result heading", page.evaluate("document.activeElement.textContent.trim()") == "Nothing has been sent")
        check(f"{tag} result states gym has not received an enquiry", "has not received an enquiry" in panel_text)
        forbidden = ["thank you", "successfully", "submitted", "we'll", "we will", "message sent", "enquiry sent", "has been received", "we have received", "received your"]
        check(f"{tag} no success/delivery wording anywhere on page", not [w for w in forbidden if w in panel_text], str([w for w in forbidden if w in panel_text]))
        check(f"{tag} result offers the gym's phone number as tel link", page.locator(f"main a[href='{PHONE_TEL}']").count() >= 1)
        relevant = [r_ for r_ in reqs if "_rsc" not in r_[1] and "/_next/" not in r_[1]]
        check(f"{tag} submit made zero non-GET requests", not [r_ for r_ in reqs if r_[0] != "GET"], str([(m, u[-40:]) for m, u, _ in reqs if m != "GET"]))
        check(f"{tag} typed values appear in no request URL or body", not [u for m, u, d in reqs if "Test%20Person" in u or "Test+Person" in u or "98765" in u or "Test Person" in d or "98765" in d or "private" in u or "private" in d])
        check(f"{tag} no external requests during submit", not [u for m, u, d in reqs if not u.startswith(BASE)], str(relevant[:3]))
        store = page.evaluate("({ls:localStorage.length, ss:sessionStorage.length, ck:document.cookie, idb: indexedDB.databases ? 'n/a' : 'n/a'})")
        check(f"{tag} nothing stored (localStorage, sessionStorage, cookies)", store["ls"] == 0 and store["ss"] == 0 and store["ck"] == "", str(store))
        page.get_by_role("button", name="Edit Details").click(); page.wait_for_timeout(200)
        check(f"{tag} 'Edit details' restores form with values kept and focus on Name", page.get_by_label(re.compile(r"^Name")).input_value() == "Test Person" and page.evaluate("document.activeElement.name") == "name")
        ctx.close()

    # ---- keyboard-only flow (contact)
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page(); page.goto(BASE + "/contact", wait_until="load")
    page.get_by_label(re.compile(r"^Name")).focus(); order = []
    for _ in range(6):
        page.keyboard.press("Tab"); order.append(page.evaluate("(()=>{const e=document.activeElement;return e.name||e.textContent.trim().slice(0,18)})()"))
    check("keyboard: Tab order is phone, email, type, message, submit", order[:5] == ["phone", "email", "type", "message", "Check My Details"], str(order))
    page.get_by_label(re.compile(r"enquiry about")).focus(); page.keyboard.type("Eq")
    check("keyboard: select can be operated by typing", page.get_by_label(re.compile(r"enquiry about")).input_value() == "facilities")
    page.get_by_label(re.compile(r"^Name")).focus(); page.keyboard.type("Keyboard User")
    page.keyboard.press("Tab"); page.keyboard.type("9876543210")
    for _ in range(4): page.keyboard.press("Tab")
    check("keyboard: reaches the submit button", page.evaluate("document.activeElement.textContent.trim()") == "Check My Details")
    page.keyboard.press("Enter"); page.wait_for_timeout(300)
    check("keyboard: Enter on the submit button runs the check", page.get_by_role("heading", name="Nothing has been sent").is_visible())
    ctx.close()
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page(); page.goto(BASE + "/contact", wait_until="load")
    page.keyboard.press("Tab"); page.keyboard.press("Tab"); page.get_by_label(re.compile(r"^Name")).focus(); page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab"); page.wait_for_timeout(400)
    ring = page.evaluate("(()=>{const s=getComputedStyle(document.activeElement);return [s.outlineStyle,s.outlineWidth,s.outlineColor,s.borderColor].join(' ')})()")
    check("focus: text input shows 2px lime outline", "solid" in ring and "2px" in ring and "rgb(198, 255, 77)" in ring, ring)
    page.get_by_role("button", name="Check My Details").focus(); page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab"); page.wait_for_timeout(400)
    ring = page.evaluate("(()=>{const s=getComputedStyle(document.activeElement);return [s.outlineStyle,s.outlineColor].join(' ')})()")
    check("focus: submit button shows lime outline", "solid" in ring and "rgb(198, 255, 77)" in ring, ring)
    ctx.close()
    # ---- mobile control sizes
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True); page = ctx.new_page(); page.goto(BASE + "/contact", wait_until="load")
    sizes = page.evaluate("Array.from(document.querySelectorAll('form input, form select, form textarea, form button[type=submit]')).map(e=>({n:e.name||e.textContent.trim(), h:Math.round(e.getBoundingClientRect().height), fs:parseFloat(getComputedStyle(e).fontSize)}))")
    check("mobile: every form control is at least 44px tall", all(s["h"] >= 44 for s in sizes), str([(s["n"], s["h"]) for s in sizes if s["h"] < 44]))
    check("mobile: text controls use >=16px font (no iOS zoom on focus)", all(s["fs"] >= 16 for s in sizes if s["n"] != "Check My Details"), str([(s["n"], s["fs"]) for s in sizes if s["fs"] < 16]))
    ctx.close()

    # ============ 7. CONTENT AUDIT ============
    print("\n== 7. Content audit (no invented details) ==")
    ctx = b.new_context(viewport={"width": 1440, "height": 900}); page = ctx.new_page()
    allowed_nums = {"4.5", "4.5/5", "5", "102", "+91", "98956", "44060", "695564", "62", "91", "1", "2", "3", "4", "2026"}
    for r in ["/"] + CONTENT:
        page.goto(BASE + r, wait_until="load")
        t = page.evaluate("document.body.innerText"); low = t.lower()
        check(f"audit {r}: no currency, prices, discounts, fees as amounts", not re.search(r"[₹$€£]|\brs\.?\s?\d|\binr\b|per month|/month|per year|discount|% off|joining fee of", low))
        check(f"audit {r}: no opening-hours claims (times, 'open now/daily', 24/7)", not re.search(r"open now|open today|open daily|24/7|24 hours|\b\d{1,2}(:\d\d)?\s?(am|pm)\b|monday to|mon-|closes at|opens at", low))
        check(f"audit {r}: no invented services or facilities", not re.search(r"sauna|steam|swimming|pool|shower|locker|changing room|parking|cafe|juice bar|zumba|yoga class|crossfit|spin|personal training|personal trainer|nutrition|diet plan|physio|massage|brand|technogym|life fitness|hammer strength", low))
        check(f"audit {r}: no history/ownership/credential/results claims", not re.search(r"founded|established|since 19|since 20|our founder|the owner|owned by|certified|qualified|award|years of experience|guarantee|transform|lose \d|gain \d|results in|best gym|number one|#1", low))
        check(f"audit {r}: no trial/offer/policy claims", not re.search(r"free trial|trial|free visit|free session|cancel|refund|no contract|session limit|unlimited|day pass", low))
        check(f"audit {r}: no email address or messaging/social channels", not re.search(r"@[a-z0-9-]+\.[a-z]{2,}|whatsapp|instagram|facebook|youtube|telegram", low) and page.locator("a[href^='mailto:'], a[href*='wa.me']").count() == 0)
        nums = set(re.findall(r"\d[\d.,+/]*\d|\d", t)); stray = sorted(n for n in nums if n not in allowed_nums)
        check(f"audit {r}: every number is a supplied fact (rating, review count, phone, PIN, plus code)", not stray, str(stray))
    page.goto(BASE + "/reviews", wait_until="load")
    main_text = page.locator("main").inner_text()
    check("audit /reviews: no quotation marks (no verbatim quotes)", not re.search(r"[\"“”‘’']{1}", main_text.replace("'", "").replace("’", "")) or not re.search(r"[\"“”]", main_text))
    check("audit /reviews: no names, dates or per-review stars", not re.search(r"\b(19|20)\d\d\b|January|February|March|April|June|July|August|September|October|November|December|\bago\b", main_text) and page.locator("main [role=img][aria-label*='Rated']").count() == 1, "exactly one rating widget (the overall one)")
    check("audit /reviews: attribution, paraphrase and not-live disclosures present", all(s in main_text.lower() for s in ["google", "paraphras", "not verbatim", "not live", "102"]))
    check("audit /reviews: no link to Google reviews or any external site", page.locator("main a[href^='http']").count() == 0)
    check("audit /reviews: sensitive feedback worded as paraphrase", "speaking as a woman" in main_text and "comfortable and respected" in main_text)
    page.goto(BASE + "/facilities", wait_until="load"); ft = page.locator("main").inner_text()
    counts = (ft.count("Illustrative image"), "Illustrative artwork" in ft, ft.count("Proposed category"), "none of the above has been verified" in ft.lower())
    check("audit /facilities: illustrative + proposed labelling and unverified note", counts[0] >= 5 and counts[1] and counts[2] >= 5 and counts[3], f"'Illustrative image' x{counts[0]}, legend={counts[1]}, 'Proposed category' x{counts[2]}, note={counts[3]}")
    page.goto(BASE + "/memberships", wait_until="load"); mt = page.locator("main").inner_text()
    check("audit /memberships: 'plans and prices available on enquiry' + terms confirmed with gym", "membership plans and prices available on enquiry" in mt.lower() and "confirmed directly with the gym" in mt.lower())
    check("audit /memberships: no plan/tier cards (no price elements)", not re.search(r"basic|premium|gold|silver|platinum|standard plan|monthly plan|annual|quarterly", mt.lower()))
    page.goto(BASE + "/contact", wait_until="load"); ct = page.locator("main").inner_text()
    check("audit /contact: Maps link labelled as a search, with not-an-official-pin caveat", "Search on Google Maps" in ct and "not an official business pin" in ct)
    check("audit /contact: explains what happens on submit", "what happens when you use the form" in ct.lower() and "nothing is sent" in ct.lower())
    check("audit /contact: hours unconfirmed note, no 'open now'", "opening hours are still being confirmed" in ct.lower())
    check("audit footer: new wording, no ownership claim", all(page.locator("footer").inner_text().find(s) >= 0 for s in ["Independent concept demo", "not the official Fitness World website", "not affiliated with, approved by or endorsed by the business"]) and "© 2026 Fitness World" not in page.locator("footer").inner_text())
    ctx.close()

    # ============ 8. CONTRAST of new colour combinations ============
    print("\n== 8. Contrast of new combinations (computed) ==")
    def blend(fg, bg, a): return tuple(round(a * f + (1 - a) * g_) for f, g_ in zip(fg, bg))
    surface = (21, 23, 23); canvas = (12, 13, 13); accent = (198, 255, 77); ink = (247, 248, 244); muted = (167, 173, 165); danger = (255, 107, 91)
    demo_bg = blend(accent, surface, 0.10)
    for label, fg, bg, need in [
        ("demo-form box: ink text on accent/10", ink, demo_bg, 4.5), ("demo-form box: accent link on accent/10", accent, demo_bg, 4.5),
        ("about: accent words on canvas", accent, canvas, 4.5), ("error text on canvas", danger, canvas, 4.5), ("error text on surface", danger, surface, 4.5),
        ("select placeholder (ink-muted) on surface", muted, surface, 4.5), ("form hint (ink-muted) on surface", muted, surface, 4.5),
        ("contact steps: ink-muted on surface", muted, surface, 4.5), ("reviews: accent theme-badge text on accent/10 over surface", accent, demo_bg, 4.5)]:
        r_ = ratio(fg, bg); check(f"contrast {label}: {r_:.1f}:1 (need {need})", r_ >= need)

    b.close()

fails = [n for n, ok in results if not ok]
print(f"\n{len(results) - len(fails)}/{len(results)} checks passed")
if fails:
    print("FAILED:"); [print("  -", f) for f in fails]
sys.exit(1 if fails else 0)

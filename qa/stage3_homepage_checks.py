"""Stage 3 homepage checks (links, content audit, focus rings, failed-image fallback, hero contrast). Needs Playwright + Chromium; run against a production build."""
import re, urllib.request, urllib.error
from playwright.sync_api import sync_playwright
import os
BASE=os.environ.get("BASE","http://localhost:3111")
res=[]
def check(n,c,d=""):
    res.append((n,bool(c))); print(("PASS " if c else "FAIL ")+n+(f"  [{d}]" if d else ""))
def status(path):
    try: return urllib.request.urlopen(BASE+path).status
    except urllib.error.HTTPError as e: return e.code

def lum(c):
    c=c/255; return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
def L(rgb): return 0.2126*lum(rgb[0])+0.7152*lum(rgb[1])+0.0722*lum(rgb[2])
def ratio(a,b):
    la,lb=sorted([L(a),L(b)],reverse=True); return (la+0.05)/(lb+0.05)

with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":1440,"height":900}); page=ctx.new_page()
    page.goto(BASE+"/", wait_until="load")

    # ---- metadata
    check("meta: title", page.title()=="Fitness World concept demo | Gym in Vazhayila, Enikkara, Thiruvananthapuram", page.title())
    desc=page.locator("meta[name=description]").get_attribute("content"); print("      description:",desc)
    check("meta: description mentions Vazhayila", "Vazhayila" in desc)
    check("meta: noindex on /", page.locator("meta[name=robots]").get_attribute("content")=="noindex, nofollow")
    check("meta: no JSON-LD structured data", page.locator("script[type='application/ld+json']").count()==0)

    # ---- headings
    hs=page.evaluate("Array.from(document.querySelectorAll('h1,h2,h3')).filter(h=>h.getClientRects().length).map(h=>h.tagName+':'+h.textContent.trim().slice(0,40))")
    print("      headings:", hs)
    check("headings: exactly one h1", sum(h.startswith("H1") for h in hs)==1)
    levels=[int(h[1]) for h in hs]; check("headings: no skipped levels", all(b-a<=1 for a,b in zip(levels,levels[1:])))

    # ---- link audit (main content only)
    links=page.evaluate("Array.from(document.querySelectorAll('main a[href]')).map(a=>({t:a.textContent.trim().replace(/\\s+/g,' ').slice(0,40),h:a.getAttribute('href'),nt:a.target,rel:a.rel}))")
    print("      main links:"); 
    for l in links: print("       ",l)
    check("links: none are '#' or empty", all(l["h"] not in ("#","") for l in links))
    check("links: no javascript: hrefs", all(not l["h"].startswith("javascript") for l in links))
    exp={"Explore Memberships":"/memberships","Get in Touch":"/contact","Enquire About Membership":"/memberships#enquire","About Fitness World":"/about"}
    for t,h in exp.items(): check(f"link: '{t}' -> {h}", any(t in l["t"] and l["h"]==h for l in links))
    check("link: 'Call the Gym' -> tel:+919895644060", any("Call the Gym" in l["t"] and l["h"]=="tel:+919895644060" for l in links))
    check("link: 'Call Fitness World' -> tel:+919895644060", any("Call Fitness World" in l["t"] and l["h"]=="tel:+919895644060" for l in links))
    check("link: 'Call +91 98956 44060' -> tel", any("Call +91 98956 44060" in l["t"] and l["h"]=="tel:+919895644060" for l in links))
    check("links: 4 facilities card links -> /facilities", sum(l["h"]=="/facilities" for l in links)==4)
    check("link: 'Get in touch with the gym' (reviews) -> /contact (not Google reviews)", any("Get in Touch with the Gym" in l["t"] and l["h"]=="/contact" for l in links))
    ext=[l for l in links if l["h"].startswith("http")]
    print("      external:",ext)
    check("links: only external is the labelled Maps search, new tab + noopener", len(ext)==1 and "Search on Google Maps" in ext[0]["t"] and ext[0]["nt"]=="_blank" and "noopener" in ext[0]["rel"])
    check("links: Maps URL is a plus-code search, not a place URL", "query=HX4H%2B62" in ext[0]["h"] and "/place/" not in ext[0]["h"], ext[0]["h"])
    check("no google reviews URL anywhere", "g.page" not in page.content() and "search.google" not in page.content() and "maps.app.goo.gl" not in page.content())
    check("no wa.me / WhatsApp anywhere on page", "wa.me" not in page.content() and "whatsapp" not in page.content().lower())

    # route status: implemented vs pending
    for r,exp_s in [("/",200),("/design-preview",200),("/memberships",200),("/contact",200),("/facilities",200),("/about",200)]:
        s=status(r); check(f"route {r}: {s} ({'implemented' if exp_s==200 else 'implemented'})", s==exp_s)

    # ---- no <button> in main, no onclick divs
    check("no fake buttons in main (only links)", page.locator("main button").count()==0)

    # ---- invented-details audit
    text=page.evaluate("document.querySelector('main').innerText")
    check("audit: no currency/price symbols", not re.search(r"[₹$€£]|\bRs\.?\b|\bINR\b|per month|/month|discount|offer", text, re.I))
    check("audit: no 'open now' / hours claims", not re.search(r"open now|open today|opens at|closes|closing|\b\d{1,2}(:\d\d)?\s?(am|pm)\b", text, re.I))
    nums=sorted(set(re.findall(r"\d[\d.,+/]*\d|\d", text)))
    print("      numeric tokens on page:", nums)
    allowed={"4.5","5","102","+91","98956","44060","695564","2","4","62","91"}
    stray=[n for n in nums if n not in allowed and not re.fullmatch(r"4\.5/5|\+91|98956|44060|695564",n)]
    check("audit: every number is a supplied fact", not stray, str(stray))
    check("audit: no invented superlatives/guarantees", not re.search(r"guarantee|best in|#1|award|certified|years of|\d+\+ members|transform|results in", text, re.I))
    check("audit: reviews have no quotation marks", not re.search(r"[\"“”]", page.locator("#reviews-title").locator("xpath=ancestor::section").inner_text()))
    check("audit: 'Paraphrased' disclosure present", "Paraphrased from customer reviews" in text)
    check("audit: facilities labelled as proposed overview", "proposed overview" in text.lower() and "Equipment and services are still being confirmed" in text)
    check("audit: illustrative-image disclosures present", "Illustrative image" in text and "Images are illustrations" in text)
    check("audit: price message present", "membership plans and prices available on enquiry" in text.lower())
    check("audit: hours-unconfirmed note present", "Opening hours are still being confirmed" in text)

    # ---- images
    imgs=page.evaluate("Array.from(document.images).map(i=>({alt:i.alt,ok:i.complete&&i.naturalWidth>0}))")
    check("images: all have alt text", all(i["alt"].strip() for i in imgs), f"{len(imgs)} images")

    # ---- focus rings incl. lime band
    page.goto(BASE+"/", wait_until="load")
    page.locator("#cta-title").scroll_into_view_if_needed()
    page.get_by_role("link", name="Explore Memberships").last.focus(); page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab"); page.wait_for_timeout(400)
    ring=page.evaluate("(()=>{const s=getComputedStyle(document.activeElement);return [s.outlineStyle,s.outlineWidth,s.outlineColor].join(' ')})()")
    check("focus: inverse button on lime shows dark ring (not lime-on-lime)", "solid" in ring and "rgb(12, 13, 13)" in ring, ring)
    page.get_by_role("link", name="Call the Gym").focus(); page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab"); page.wait_for_timeout(400)
    ring=page.evaluate("(()=>{const s=getComputedStyle(document.activeElement);return [s.outlineStyle,s.outlineWidth,s.outlineColor].join(' ')})()")
    check("focus: primary button on dark shows lime ring", "rgb(198, 255, 77)" in ring, ring)
    # card link focus
    page.locator("a[href='/facilities']").first.focus(); page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab"); page.wait_for_timeout(300)
    ring=page.evaluate("(()=>{const s=getComputedStyle(document.activeElement);return [document.activeElement.getAttribute('href'),s.outlineStyle,s.outlineColor].join(' ')})()")
    check("focus: training card link shows lime ring", "/facilities" in ring and "rgb(198, 255, 77)" in ring, ring)
    ctx.close()

    # ---- failed image requests: page must still render
    ctx=b.new_context(viewport={"width":390,"height":844}); page=ctx.new_page()
    page.route("**/_next/image**", lambda r: r.abort())
    page.goto(BASE+"/", wait_until="load"); page.wait_for_timeout(800)
    h=page.evaluate("document.documentElement.scrollHeight"); sw=page.evaluate("document.documentElement.scrollWidth")
    check("fallback: all image requests blocked, page still renders, no overflow", h>5000 and sw<=390, f"h={h} sw={sw}")
    check("fallback: hero headline + CTAs still visible", page.get_by_role("heading", name="Built by consistency.").is_visible() and page.get_by_role("link", name="Explore Memberships").first.is_visible())
    vis=page.evaluate("Array.from(document.images).filter(i=>!i.complete||i.naturalWidth===0).map(i=>getComputedStyle(i).color)")
    check("fallback: broken <img> alt text is transparent", vis and all(c in ("rgba(0, 0, 0, 0)","transparent") for c in vis), str(vis[:2]))
    page.screenshot(path="/tmp/shots/fallback_390.png")
    ctx.close()

    # ---- mobile menu still works
    ctx=b.new_context(viewport={"width":390,"height":844}); page=ctx.new_page(); page.goto(BASE+"/", wait_until="load")
    btn=page.get_by_role("button", name="Menu"); btn.click()
    check("menu: opens on homepage", btn.get_attribute("aria-expanded")=="true" and page.locator("#"+btn.get_attribute("aria-controls")).is_visible())
    page.keyboard.press("Escape"); check("menu: Escape closes and refocuses", btn.get_attribute("aria-expanded")=="false" and page.evaluate("document.activeElement.getAttribute('aria-label')")=="Menu")
    ctx.close()

    # ---- design preview still works
    ctx=b.new_context(viewport={"width":360,"height":800}); page=ctx.new_page(); page.goto(BASE+"/design-preview", wait_until="load")
    check("preview: loads with H1 'Design preview'", page.get_by_role("heading", name="Design preview").is_visible())
    check("preview: still noindex", page.locator("meta[name=robots]").get_attribute("content")=="noindex, nofollow")
    check("preview: new inverse buttons shown", page.get_by_role("link", name="Inverse", exact=True).count()==1)
    check("preview: no overflow at 360", page.evaluate("document.documentElement.scrollWidth")<=360)
    check("preview: not linked from header/footer", page.locator("header a[href='/design-preview'], footer a[href='/design-preview']").count()==0)
    ctx.close()

    # ---- worst-case text contrast over hero imagery, measured from pixels
    from PIL import Image
    import io
    for w in (1440,390):
        ctx=b.new_context(viewport={"width":w,"height":900}); page=ctx.new_page(); page.goto(BASE+"/", wait_until="load"); page.wait_for_timeout(600)
        sel={"eyebrow":"#hero-title >> xpath=preceding-sibling::p","h1":"#hero-title","lead":"#hero-title >> xpath=following-sibling::p","location":"section[aria-labelledby=hero-title] > div:last-of-type p"}
        boxes={k:page.locator(v).first.bounding_box() for k,v in sel.items()}
        page.add_style_tag(content="section[aria-labelledby=hero-title] *{color:transparent !important}")
        png=Image.open(io.BytesIO(page.screenshot())).convert("RGB")
        colors={"eyebrow":(198,255,77),"h1":(247,248,244),"lead":(167,173,165),"location":(167,173,165)}
        for k,bx in boxes.items():
            off=44 if k=="eyebrow" else 0   # skip the decorative 2px lime bar before the eyebrow text
            reg=png.crop((int(bx["x"])+off,int(bx["y"]),int(bx["x"]+bx["width"]),int(bx["y"]+bx["height"])))
            px=list(reg.get_flattened_data()) if hasattr(reg,'get_flattened_data') else list(reg.getdata()); brightest=max(px,key=lambda c:L(c))
            r=ratio(colors[k],brightest); need=3.0 if k=="h1" else 4.5
            check(f"contrast @{w}px hero {k}: worst-case {r:.1f}:1 (need {need})", r>=need)
        ctx.close()
    b.close()
f=[n for n,ok in res if not ok]; print(f"\n{len(res)-len(f)}/{len(res)} checks passed"); 
if f: print("FAILED:",f)

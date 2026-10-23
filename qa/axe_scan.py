import json, re
from playwright.sync_api import sync_playwright
import os
BASE=os.environ.get("BASE","http://localhost:3111")
AXE=open(os.environ.get("AXE_PATH","/tmp/axe/node_modules/axe-core/axe.min.js")).read()
ROUTES=["/","/about","/facilities","/memberships","/contact","/reviews","/design-preview","/nonexistent"]
def run_axe(page):
    page.evaluate(AXE)
    return page.evaluate("axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}).then(r=>({v:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,n:v.nodes.length,t:v.nodes.slice(0,3).map(n=>n.target.join(' ')+' :: '+(n.failureSummary||'').split('\\n').slice(1,2).join(' ').slice(0,140))})), inc:r.incomplete.map(v=>({id:v.id,n:v.nodes.length}))}))")
with sync_playwright() as p:
    b=p.chromium.launch(); total=0
    for w in (390,1440):
        for r in ROUTES:
            ctx=b.new_context(viewport={"width":w,"height":900}); page=ctx.new_page()
            msgs=[]; page.on("console", lambda m: msgs.append((m.type,m.text[:160])) if m.type in ("error","warning") else None); page.on("pageerror", lambda e: msgs.append(("pageerror",str(e)[:160])))
            page.goto(BASE+r, wait_until="load"); page.wait_for_timeout(700)
            res=run_axe(page); total+=len(res["v"])
            status="OK " if not res["v"] else "VIOLATIONS"
            print(f"{w:>5}px {r:<16} axe: {status} {len(res['v'])} | incomplete: {', '.join(f'{i['id']}x{i['n']}' for i in res['inc']) or 'none'} | console errors/warnings: {msgs or 'none'}")
            for v in res["v"]: print(f"        - [{v['impact']}] {v['id']}: {v['help']} (x{v['n']}) e.g. {v['t'][:2]}")
            ctx.close()
    # form states
    for state in ("errors","result"):
        ctx=b.new_context(viewport={"width":1440,"height":900}); page=ctx.new_page(); page.goto(BASE+"/contact", wait_until="load"); page.wait_for_timeout(500)
        if state=="errors": page.get_by_role("button", name="Check my details").click()
        else:
            page.get_by_label(re.compile(r"^Name")).fill("Test"); page.get_by_label("Phone number").fill("9876543210"); page.get_by_label(re.compile(r"enquiry about")).select_option("visit"); page.get_by_role("button", name="Check my details").click()
        page.wait_for_timeout(300); res=run_axe(page); total+=len(res["v"])
        print(f" form state '{state}': axe violations {len(res['v'])}", [ (v['id'],v['n']) for v in res['v']])
        for v in res["v"]: print(f"        - [{v['impact']}] {v['id']}: {v['help']} e.g. {v['t'][:2]}")
        ctx.close()
    b.close()
print("TOTAL axe violations:", total)

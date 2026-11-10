"""Flower + sprigs results mockups. Run: python mockups/build_flower.py"""
import os, sys, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B
from build import t, r, e, INK, MUTE, ACC, CHIP, CHIPINK, BRAND, CAT, FONT

OUT = B.OUT
W, H = 1600, 900
PX, PY = 900, 470          # pollen: where the search bar sits
FLOWER = base64.b64encode(open(os.path.join(OUT, "..", "public", "assets", "flower.webp"), "rb").read()).decode()
TEND = "#8d78d9"


def canvas(body, label, H=H):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{FONT}" role="img" aria-label="{label}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f1ebfb"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffb98a" stop-opacity=".6"/><stop offset="1" stop-color="#ffb98a" stop-opacity="0"/></radialGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#3b2a8a" flood-opacity=".22"/></filter>
<filter id="sh2" x="-20%" y="-40%" width="140%" height="190%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#6a4bd6" flood-opacity=".2"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<image href="data:image/webp;base64,{FLOWER}" x="{PX-400}" y="{PY-390}" width="800" height="760" style="mix-blend-mode:multiply"/>
{body}
</svg>'''


def sprig(cx, cy, name, count, dot, state="normal"):
    """A category pill on a tendril, pinned to the flower by a pollen dot."""
    w = 34 + len(name) * 9.6 + 34
    c = CAT[name]
    op = {"dim": .38}.get(state, 1)
    sx = cx + (w / 2 if dot[0] > cx else -w / 2)
    mx, my = (sx + dot[0]) / 2, (cy + dot[1]) / 2 + 26
    g = f'<g opacity="{op}">'
    g += f'<path d="M{sx} {cy} Q{mx} {my} {dot[0]} {dot[1]}" fill="none" stroke="{TEND}" stroke-width="{2.6 if state=="on" else 1.4}"/>'
    g += f'<circle cx="{dot[0]}" cy="{dot[1]}" r="6" fill="#fff" stroke="{c}" stroke-width="3"/>'
    if state == "on":
        g += f'<circle cx="{dot[0]}" cy="{dot[1]}" r="13" fill="{c}" opacity=".28"/>'
    ring = f' stroke="{c}" stroke-width="2.5"' if state == "on" else ""
    g += f'<rect x="{cx-w/2}" y="{cy-23}" width="{w}" height="46" rx="23" fill="#fff"{ring} filter="url(#sh2)"/>'
    g += f'<circle cx="{cx-w/2+22}" cy="{cy}" r="6" fill="{c}"/>'
    g += t(cx - w / 2 + 38, cy + 6, name, 17, 700)
    g += t(cx + w / 2 - 16, cy + 5, str(count), 15, 700, ACC if count else "#a59fba", "end")
    return g + "</g>"


def seed(cx, cy, title, cat, sel=False):
    w = 36 + len(title) * 7.1
    c = CAT[cat]
    g = f'<rect x="{cx-w/2}" y="{cy-16}" width="{w}" height="32" rx="16" fill="{"#fff"}" stroke="{c}" stroke-width="{3 if sel else 2}" filter="url(#sh2)"/>'
    g += f'<circle cx="{cx-w/2+16}" cy="{cy}" r="5" fill="{c}"/>' + t(cx - w / 2 + 28, cy + 5, title, 13, 700)
    return g


def link(a, b, cat):
    return f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{CAT[cat]}" stroke-width="1.2" opacity=".6"/>'


def bar(w=420, q="pack", extra=""):
    x, y = PX - w / 2, PY - 30
    g = f'<circle cx="{PX}" cy="{PY-10}" r="130" fill="url(#glow)"/>'
    g += r(x, y, w, 60, 30, "#fff", "#ffb26b", 3, 'filter="url(#sh2)"')
    g += f'<circle cx="{x+30}" cy="{y+28}" r="8" fill="none" stroke="{ACC}" stroke-width="2.4"/><line x1="{x+36}" y1="{y+34}" x2="{x+42}" y2="{y+40}" stroke="{ACC}" stroke-width="2.4" stroke-linecap="round"/>'
    g += t(x + 58, y + 37, q, 19, 600)
    g += f'<circle cx="{x+w-30}" cy="{y+30}" r="14" fill="{CHIP}"/>' + t(x + w - 30, y + 36, "×", 20, 700, CHIPINK, "middle")
    return g + extra


def head():
    return B.header(80, 1520)


def foot(x, y, s):
    return t(x, y, s, 12.5, 500, "#8a82a6", "middle")


# -------------------------------------------------- E: tethered card, sprigs stay as live filters
def e_():
    b = head()
    # sprigs keep floating; counts now reflect the query "pack", the chosen one is lit
    b += sprig(330, 250, "all", 6, (650, 330), "dim")
    b += sprig(300, 520, "design", 3, (640, 470), "on")
    b += sprig(1300, 210, "writing", 0, (1060, 300), "dim")
    b += sprig(1380, 470, "general", 2, (1230, 450), "dim")
    b += sprig(1330, 700, "how-to", 1, (1200, 600), "dim")
    b += bar()
    cx, cy, cw, ch = 640, 536, 520, 318
    b += f'<path d="M{PX-12} {cy} l12 -12 l12 12z" fill="#fff"/>'
    b += r(cx, cy, cw, ch, 22, "#fff", "#fff", 1, 'fill-opacity=".97" filter="url(#sh)"')
    rows = [("Abstract beverage can graphic", "Continuous pattern vector print for a craft soda can…", "graphic-design · image-gen · packaging"),
            ("Eco-friendly skincare packaging", "Product photography of a luxury organic cosmetic bottle…", "graphic-design · image-gen · packaging"),
            ("Subscription box unboxing shot", "Overhead flat-lay of an opened subscription box with tissue…", "graphic-design · product")]
    y = cy + 14
    for i, (ti, d, tg) in enumerate(rows):
        if i == 0:
            b += r(cx + 12, y, cw - 24, 88, 14, "#f4efff") + r(cx + 12, y + 18, 4, 52, 2, CAT["design"])
        b += f'<circle cx="{cx+36}" cy="{y+26}" r="5" fill="{CAT["design"]}"/>'
        b += t(cx + 50, y + 31, ti, 17, 700) + t(cx + 50, y + 54, d, 13.5, 400, MUTE) + t(cx + 50, y + 74, tg, 12, 500, "#8a82a6")
        if i == 0:
            b += r(cx + cw - 100, y + 12, 76, 28, 8, BRAND) + t(cx + cw - 62, y + 31, "Copy ⏎", 13, 700, "#fff", "middle")
        else:
            b += t(cx + cw - 26, y + 31, "Copy", 13, 700, ACC, "end")
        y += 96
    b += foot(PX, cy + ch + 28, "3 of 6 results in design  ·  click a sprig to filter  ·  ↑ ↓ move  ·  ⏎ copy  ·  Esc clear")
    return canvas(b, "Concept E: tethered card, sprigs as live filters")


# -------------------------------------------------- F: seeds bloom (results are seeds around the flower)
def f_():
    b = head()
    S = {"design": ((300, 520), (640, 470)), "general": ((1380, 470), (1230, 450)), "how-to": ((1330, 720), (1200, 600)),
         "writing": ((1300, 200), (1060, 300)), "all": ((330, 250), (650, 330))}
    seeds = [("Abstract beverage can graphic", "design", (255, 400), True), ("Eco-friendly skincare packaging", "design", (215, 630), False),
             ("Subscription box unboxing shot", "design", (390, 700), False),
             ("Packing list generator", "general", (1370, 360), False), ("Moving-day checklist", "general", (1405, 580), False),
             ("How to pack a carry-on", "how-to", (1230, 810), False)]
    for ti, cat, pos, sel in seeds:
        b += link(pos, S[cat][0], cat)
    counts = {"all": 6, "design": 3, "writing": 0, "general": 2, "how-to": 1}
    for n, (p, d) in S.items():
        b += sprig(p[0], p[1], n, counts[n], d, "dim" if n in ("all", "writing") else "normal")
    for ti, cat, pos, sel in seeds:
        b += seed(pos[0], pos[1], ti, cat, sel)
    b += bar(380)
    # peek card for the focused seed, hanging under the search bar
    px_, py_, pw, ph = PX - 170, PY + 50, 340, 190
    b += f'<path d="M{PX-12} {py_} l12 -12 l12 12z" fill="{CAT["design"]}"/>'
    b += r(px_, py_, pw, ph, 16, "#fff", extra='filter="url(#sh)"') + r(px_, py_, pw, 5, 2.5, CAT["design"])
    b += t(px_ + 20, py_ + 36, "Abstract beverage can graphic", 17, 800)
    for i, l in enumerate(["Continuous pattern vector print for a craft", "soda can, abstract liquid marbling in coral", "pink, sunny yellow, and electric teal…"]):
        b += t(px_ + 20, py_ + 62 + i * 21, l, 13.5, 400, MUTE)
    b += t(px_ + 20, py_ + 138, "graphic-design · image-gen · packaging", 12, 500, "#8a82a6")
    b += r(px_ + 20, py_ + 150, 110, 30, 15, BRAND) + t(px_ + 75, py_ + 170, "Copy  ⏎", 13, 700, "#fff", "middle")
    b += t(px_ + pw - 20, py_ + 170, "1 of 6  ·  → next", 12, 600, MUTE, "end")
    b += foot(PX, 870, "Results bloom as seeds on their sprigs  ·  ← → hop between seeds  ·  ⏎ copy  ·  Esc clear")
    return canvas(b, "Concept F: results as seeds blooming around the flower")


# -------------------------------------------------- G: vine accordion
def g_():
    b = head()
    b += sprig(330, 250, "all", 6, (650, 330), "normal")
    b += sprig(300, 520, "design", 3, (640, 470), "normal")
    b += sprig(1300, 210, "writing", 0, (1060, 300), "dim")
    b += sprig(1380, 470, "general", 2, (1230, 450), "normal")
    b += sprig(1330, 700, "how-to", 1, (1200, 600), "normal")
    b += bar()
    vx = PX - 190
    top = PY + 30
    b += f'<path d="M{PX-40} {top} Q{vx} {top+6} {vx} {top+46}" fill="none" stroke="{TEND}" stroke-width="2"/>'
    rows = [("Abstract beverage can graphic", "design", True), ("Eco-friendly skincare packaging", "design", False),
            ("Subscription box unboxing shot", "design", False), ("Packing list generator", "general", False),
            ("Moving-day checklist", "general", False), ("How to pack a carry-on", "how-to", False)]
    y = top + 56
    b += f'<line x1="{vx}" y1="{top+46}" x2="{vx}" y2="{y+(150+5*52)-20}" stroke="{TEND}" stroke-width="2"/>'
    for ti, cat, sel in rows:
        c = CAT[cat]
        h = 150 if sel else 44
        b += r(vx + 22, y, 410, h, 16 if sel else 22, "#fff", c if sel else None, 2, 'filter="url(#sh2)"')
        b += f'<circle cx="{vx}" cy="{y+22}" r="{9 if sel else 7}" fill="#fff" stroke="{c}" stroke-width="3.5"/>'
        if sel:
            b += f'<circle cx="{vx}" cy="{y+22}" r="15" fill="{c}" opacity=".25"/>'
        b += t(vx + 44, y + 28, ti, 15.5 if sel else 15, 700)
        b += t(vx + 418, y + 27, cat, 12, 600, c, "end")
        if sel:
            for i, l in enumerate(["Continuous pattern vector print for a craft soda can,", "abstract liquid marbling in coral pink, sunny yellow,", "and electric teal. Flat vector, bold clean shapes…"]):
                b += t(vx + 44, y + 54 + i * 19, l, 13, 400, MUTE)
            b += t(vx + 44, y + 120, "graphic-design · image-gen · packaging", 11.5, 500, "#8a82a6")
            b += r(vx + 322, y + 104, 96, 32, 16, BRAND) + t(vx + 370, y + 125, "Copy ⏎", 13, 700, "#fff", "middle")
        y += h + 8
    b += foot(PX + 20, y + 22, "A vine grows out of the search bar  ·  ↑ ↓ opens the next leaf  ·  ⏎ copy")
    return canvas(b, "Concept G: results as leaves on a vine", 1060)


for name, fn in [("e-tethered-card-sprigs", e_), ("f-seeds-bloom", f_), ("g-vine-accordion", g_)]:
    with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as fh:
        fh.write(fn())
    print("wrote", name)

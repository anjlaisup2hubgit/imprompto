"""Generates the results-page mockup SVGs. Run: python mockups/build.py"""
import os, html

OUT = os.path.dirname(os.path.abspath(__file__))
INK, MUTE, ACC, LINE, CHIP, CHIPINK, BRAND = "#241c3f", "#554d70", "#a8450f", "#c25be6", "#efe9fb", "#43357d", "#5b3fd0"
CAT = {"all": "#64748b", "design": "#5b3fd0", "writing": "#d946ef", "general": "#d97706", "how-to": "#0d9488"}
COUNT = {"all": 35, "design": 11, "writing": 9, "general": 8, "how-to": 7}
ITEMS = [
    ("Abstract beverage can graphic", ["Continuous pattern vector print for a craft soda can,", "abstract liquid marbling in coral pink, sunny yellow,…"], ["graphic-design", "image-gen", "packaging"]),
    ("Cyberpunk event poster", ["Retro-futuristic synthwave concert poster, a sleek", "sports car driving toward a neon grid horizon with a…"], ["graphic-design", "image-gen", "poster"]),
    ("Eco-friendly skincare packaging", ["Product photography shot of a luxury organic cosmetic", "bottle made of frosted amber glass with a raw oak ca…"], ["graphic-design", "image-gen", "packaging"]),
    ("Isometric 3D web illustration", ["Isometric 3D illustration of a modern smart city", "powered by green energy, featuring wind turbines…"], ["graphic-design", "image-gen", "web"]),
]
FONT = "system-ui,'Segoe UI',Helvetica,sans-serif"


def e(s):
    return html.escape(s, quote=False)


def t(x, y, s, size=14, w=400, fill=INK, anchor="start", extra=""):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}" {extra}>{e(s)}</text>'


def r(x, y, w, h, rx=0, fill="#fff", stroke=None, sw=1, extra=""):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{s} {extra}/>'


def svg(w, h, body, label):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="{FONT}" role="img" aria-label="{label}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4efff"/><stop offset="1" stop-color="#fff"/></linearGradient>
<radialGradient id="fl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#b79cf0" stop-opacity=".75"/><stop offset=".6" stop-color="#e3a8d8" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#3b2a8a" flood-opacity=".18"/></filter>
<filter id="sh2" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#3b2a8a" flood-opacity=".12"/></filter>
</defs>
<rect width="{w}" height="{h}" fill="url(#bg)"/>
{body}
</svg>'''


def header(x0, x1, y=70):
    return (t(x0, y, "Prompt Library", 30, 800) + t(x0, y + 24, "35 prompts · synced to your account", 14, 400, MUTE)
            + r(x1 - 270, y - 36, 100, 44, 22, "#fff", extra='filter="url(#sh2)"') + t(x1 - 220, y - 8, "Backup", 15, 700, INK, "middle")
            + r(x1 - 158, y - 36, 158, 44, 22, BRAND) + t(x1 - 79, y - 8, "+ New prompt", 15, 700, "#fff", "middle"))


def flower(cx, cy, s=1.0, op=1):
    return f'<g opacity="{op}"><ellipse cx="{cx}" cy="{cy}" rx="{330*s}" ry="{250*s}" fill="url(#fl)"/><ellipse cx="{cx+60*s}" cy="{cy-40*s}" rx="{200*s}" ry="{150*s}" fill="url(#fl)"/></g>'


def search(x, y, w, q="", h=56, ph="Type any words you remember…"):
    g = r(x, y, w, h, h / 2, "#fff", "#f0a35e", 2.5, 'filter="url(#sh2)"')
    g += f'<circle cx="{x+30}" cy="{y+h/2-2}" r="8" fill="none" stroke="{ACC}" stroke-width="2.4"/><line x1="{x+36}" y1="{y+h/2+4}" x2="{x+42}" y2="{y+h/2+10}" stroke="{ACC}" stroke-width="2.4" stroke-linecap="round"/>'
    g += t(x + 56, y + h / 2 + 6, q or ph, 18, 500 if q else 400, INK if q else "#8a82a6")
    return g


def chip(x, y, name, on=False, count=True, size=13):
    c = CAT[name]
    label = f"{name}" + (f"  {COUNT[name]}" if count else "")
    w = len(label) * 7.3 + 34
    g = r(x, y, w, 30, 15, c if on else CHIP, extra='')
    g += f'<circle cx="{x+14}" cy="{y+15}" r="4.5" fill="{"#fff" if on else c}"/>'
    g += t(x + 25, y + 20, name, size, 700, "#fff" if on else CHIPINK)
    if count:
        g += t(x + w - 10, y + 20, str(COUNT[name]), size - 1, 600, "#e9e1ff" if on else MUTE, "end")
    return g, w


def chip_row(x, y, active="design", gap=8, count=True):
    out, cx = "", x
    for n in CAT:
        g, w = chip(cx, y, n, n == active, count)
        out += g
        cx += w + gap
    return out, cx


def copy_key(x, y, hot=False):
    if hot:
        return r(x, y, 74, 28, 8, BRAND) + t(x + 37, y + 19, "Copy  ⏎", 13, 700, "#fff", "middle")
    return t(x + 74, y + 19, "Copy", 13, 700, ACC, "end")


def tagline(x, y, tags, size=12):
    return t(x, y, "  ·  ".join(tags), size, 500, "#8a82a6")


# ---------------------------------------------------------------- A: anchored dropdown
def a():
    W, H = 1200, 780
    b = flower(600, 330, 1.5, .55) + header(80, 1120)
    b += search(300, 150, 600, "design")
    cx, cy, cw, ch = 300, 226, 600, 520
    b += f'<path d="M{cx+290} {cy-8} l10 -10 l10 10z" fill="#fff"/>'
    b += r(cx, cy, cw, ch, 20, "#fff", "#ece6fb", 1.5, 'filter="url(#sh)"')
    ch_row, _ = chip_row(cx + 24, cy + 20, "design")
    b += ch_row
    b += t(cx + cw - 24, cy + ch - 18, "11 results", 12.5, 600, MUTE, "end")
    b += f'<line x1="{cx+24}" y1="{cy+68}" x2="{cx+cw-24}" y2="{cy+68}" stroke="#eee9fa"/>'
    y = cy + 80
    for i, (ti, d, tg) in enumerate(ITEMS):
        sel = i == 0
        if sel:
            b += r(cx + 12, y, cw - 24, 100, 14, "#f4efff") + r(cx + 12, y + 18, 4, 64, 2, BRAND)
        b += t(cx + 32, y + 28, ti, 17, 700)
        b += t(cx + 32, y + 50, d[0], 13.5, 400, MUTE) + t(cx + 32, y + 68, d[1], 13.5, 400, MUTE)
        b += tagline(cx + 32, y + 88, tg)
        b += copy_key(cx + cw - 100, y + 12, sel)
        y += 100
        if i < 3 and not sel and i != 0:
            pass
    b += f'<line x1="{cx+24}" y1="{cy+ch-44}" x2="{cx+cw-24}" y2="{cy+ch-44}" stroke="#eee9fa"/>'
    b += t(cx + 24, cy + ch - 18, "↑ ↓ move   ·   ⏎ copy   ·   Esc clear   ·   Tab cycle category", 12.5, 500, "#8a82a6")
    return svg(W, H, b, "Concept A: results drop directly under the search bar")


# ---------------------------------------------------------------- B: spotlight with preview
def b():
    W, H = 1200, 780
    bd = flower(600, 330, 1.5, .35) + header(80, 1120)
    bd += r(0, 0, W, H, 0, "#241c3f", extra='opacity=".28"')
    px, py, pw, ph = 130, 96, 940, 600
    bd += r(px, py, pw, ph, 24, "#fff", extra='filter="url(#sh)"')
    bd += search(px + 24, py + 22, pw - 48, "design", 52).replace("#f0a35e", "#e7dff9").replace('stroke-width="2.5"', 'stroke-width="1.5"')
    row, _ = chip_row(px + 28, py + 92, "design")
    bd += row
    bd += f'<line x1="{px}" y1="{py+138}" x2="{px+pw}" y2="{py+138}" stroke="#eee9fa"/>'
    lw = 360
    bd += f'<line x1="{px+lw}" y1="{py+138}" x2="{px+lw}" y2="{py+ph-48}" stroke="#eee9fa"/>'
    y = py + 150
    for i, (ti, d, tg) in enumerate(ITEMS + [("Brand mascot sticker sheet", ["Kawaii mascot sticker sheet"], [])]):
        sel = i == 0
        if sel:
            bd += r(px + 12, y, lw - 24, 70, 12, "#f4efff")
        bd += f'<circle cx="{px+34}" cy="{y+24}" r="5" fill="{CAT["design"]}"/>'
        bd += t(px + 50, y + 29, ti, 15.5, 700)
        bd += t(px + 50, y + 52, d[0][:46] + "…", 12.5, 400, MUTE)
        y += 74
    # preview pane
    qx = px + lw + 36
    bd += t(qx, py + 190, "Abstract beverage can graphic", 24, 800)
    g, _ = chip(qx, py + 208, "design", True, False)
    bd += g
    lines = ["Continuous pattern vector print for a craft soda can,", "abstract liquid marbling in coral pink, sunny yellow,", "and electric teal, flat vector style, bold clean", "shapes, no text, tileable seamless wrap design,", "high contrast on a matte aluminium can mockup."]
    for i, l in enumerate(lines):
        bd += t(qx, py + 284 + i * 26, l, 15.5, 400, "#3a3158")
    bd += t(qx, py + 450, "graphic-design   ·   image-gen   ·   packaging", 13, 500, "#8a82a6")
    bd += r(qx, py + 480, 150, 44, 22, BRAND) + t(qx + 75, py + 508, "Copy prompt  ⏎", 14, 700, "#fff", "middle")
    bd += r(qx + 162, py + 480, 84, 44, 22, "#fff", "#d9d0f3", 1.5) + t(qx + 204, py + 508, "Edit", 14, 700, CHIPINK, "middle")
    bd += f'<line x1="{px}" y1="{py+ph-48}" x2="{px+pw}" y2="{py+ph-48}" stroke="#eee9fa"/>'
    bd += t(px + 28, py + ph - 18, "↑ ↓ move   ·   ⏎ copy   ·   ⌘E edit   ·   Esc close", 12.5, 500, "#8a82a6")
    bd += t(px + pw - 28, py + ph - 18, "11 results", 12.5, 600, MUTE, "end")
    return svg(W, H, bd, "Concept B: spotlight palette with live preview")


# ---------------------------------------------------------------- C: facet sidebar + card grid
def c():
    W, H = 1200, 820
    bd = flower(1000, 650, 1.1, .5) + header(80, 1120)
    bd += search(80, 120, 1040, "design", 52)
    sx, sy = 80, 200
    bd += r(sx, sy, 200, 330, 18, "#fff", "#ece6fb", 1.5, 'filter="url(#sh2)"')
    bd += t(sx + 22, sy + 34, "CATEGORY", 11.5, 800, "#8a82a6", extra='letter-spacing="1.5"')
    y = sy + 52
    for n in CAT:
        on = n == "design"
        if on:
            bd += r(sx + 10, y, 180, 44, 12, "#f4efff") + r(sx + 10, y + 11, 4, 22, 2, BRAND)
        bd += f'<circle cx="{sx+36}" cy="{y+22}" r="6" fill="{CAT[n]}"/>'
        bd += t(sx + 52, y + 28, n, 15.5, 700 if on else 500, INK if on else MUTE)
        bd += t(sx + 178, y + 28, str(COUNT[n]), 13.5, 600, MUTE, "end")
        y += 50
    bd += t(sx + 22, sy + 326 + 0, "", 1)
    gx, gy, cw, chh = 310, 200, 400, 250
    for i, (ti, d, tg) in enumerate(ITEMS):
        x = gx + (i % 2) * (cw + 20)
        yy = gy + (i // 2) * (chh + 20)
        bd += r(x, yy, cw, chh, 18, "#fff", "#ece6fb", 1.5, 'filter="url(#sh2)"')
        bd += r(x, yy, cw, 6, 3, CAT["design"], extra='clip-path="inset(0 round 18px 18px 0 0)"')
        bd += t(x + 22, yy + 46, ti, 18, 800)
        bd += t(x + 22, yy + 78, d[0], 14, 400, MUTE) + t(x + 22, yy + 98, d[1], 14, 400, MUTE) + t(x + 22, yy + 118, "…", 14, 400, MUTE)
        bd += f'<line x1="{x+22}" y1="{yy+150}" x2="{x+cw-22}" y2="{yy+150}" stroke="#eee9fa"/>'
        bd += tagline(x + 22, yy + 186, tg, 12.5)
        bd += r(x + cw - 112, yy + 196, 90, 36, 18, BRAND if i == 0 else CHIP) + t(x + cw - 67, yy + 219, "Copy", 14, 700, "#fff" if i == 0 else CHIPINK, "middle")
    bd += t(310, 740, "Showing 4 of 11   ·   Load more", 13.5, 600, MUTE)
    return svg(W, H, bd, "Concept C: category sidebar and card grid")


# ---------------------------------------------------------------- D: dense keyboard list
def d():
    W, H = 1200, 700
    bd = header(80, 1120)
    bd += search(80, 110, 1040, "design", 48)
    row, _ = chip_row(80, 176, "design")
    bd += row
    bd += t(1120, 196, "11 results   ·   sorted by best match", 13, 600, MUTE, "end")
    x0, w0 = 80, 1040
    bd += r(x0, 224, w0, 410, 18, "#fff", "#ece6fb", 1.5, 'filter="url(#sh2)"')
    bd += t(x0 + 52, 254, "TITLE", 11, 800, "#8a82a6", extra='letter-spacing="1.5"') + t(x0 + 360, 254, "PROMPT", 11, 800, "#8a82a6", extra='letter-spacing="1.5"') + t(x0 + 840, 254, "TAGS", 11, 800, "#8a82a6", extra='letter-spacing="1.5"')
    y = 266
    rows = ITEMS + [("Brand mascot sticker sheet", ["Kawaii mascot sticker sheet, bold outlines, pastel…"], ["sticker", "image-gen"]),
                    ("Minimal app icon set", ["Set of 12 minimal rounded app icons, duotone…"], ["icon", "ui"])]
    for i, (ti, d_, tg) in enumerate(rows):
        sel = i == 0
        if sel:
            bd += r(x0 + 8, y, w0 - 16, 60, 12, "#f4efff") + r(x0 + 8, y + 14, 4, 32, 2, BRAND)
        else:
            bd += f'<line x1="{x0+24}" y1="{y}" x2="{x0+w0-24}" y2="{y}" stroke="#f1edfa"/>'
        bd += f'<circle cx="{x0+32}" cy="{y+30}" r="5" fill="{CAT["design"]}"/>'
        bd += t(x0 + 52, y + 36, ti, 15.5, 700)
        snippet = d_[0].rstrip("…")
        bd += t(x0 + 360, y + 36, (snippet[:62] + "…") if len(snippet) > 62 else snippet + "…", 14, 400, MUTE)
        bd += t(x0 + 840, y + 36, " · ".join(tg[:2]), 12.5, 500, "#8a82a6")
        if sel:
            bd += r(x0 + w0 - 96, y + 16, 76, 28, 8, BRAND) + t(x0 + w0 - 58, y + 35, "Copy ⏎", 13, 700, "#fff", "middle")
        y += 60
    bd += t(x0 + 24, 668, "↑ ↓ move   ·   ⏎ copy   ·   → preview   ·   Esc clear", 12.5, 500, "#8a82a6")
    return svg(W, H, bd, "Concept D: dense keyboard-first list")


for name, fn in [("a-anchored-dropdown", a), ("b-spotlight-preview", b), ("c-sidebar-cards", c), ("d-dense-list", d)]:
    with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
        f.write(fn())
    print("wrote", name)

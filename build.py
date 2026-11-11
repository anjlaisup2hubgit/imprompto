"""Rebuild public/index.html from the markdown files in prompts/.
Run:  python build.py
Each prompt is prompts/<category>/<name>.md with a small header:
---
title: My prompt
tags: tag1, tag2
---
The prompt text...
"""
import base64, json, pathlib, re

ROOT = pathlib.Path(__file__).parent
HEADER = re.compile(r"\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|\Z)", re.S)
items = []
for f in sorted((ROOT / "prompts").rglob("*.md")):
    raw = f.read_text(encoding="utf-8-sig", errors="replace")      # utf-8-sig: ignore the BOM some editors add
    meta, body = {}, raw
    m = HEADER.match(raw)
    if m:
        for line in m.group(1).splitlines():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
        body = raw[m.end():]
    items.append({
        "title": meta.get("title") or f.stem,
        "category": f.parent.name,
        "tags": [t.strip() for t in meta.get("tags", "").split(",") if t.strip()],
        "text": body.strip(),
        "file": f.relative_to(ROOT).as_posix(),
    })

# The page is made of small files. The order matters: later files use things defined by earlier ones.
STYLES = ["components/base.css", "pages/home.css", "components/header-buttons.css", "components/petals.css",
          "components/seeds.css", "components/search-bar.css", "components/results-box.css", "components/dialog.css", "components/more-chips.css",
          "pages/mobile.css", "pages/layout-seeds.css", "components/trash.css"]
PAGE = ["pages/home.html"]
DIALOGS = ["components/prompt-dialog.html", "components/trash-dialog.html", "components/rename-dialog.html", "components/toast.html"]
SCRIPTS = ["data/prompts.js", "data/local-storage.js", "data/sync.js", "data/categories.js", "data/trash.js", "components/dom-helpers.js",
           "components/state.js", "components/stage-fit.js", "components/petals.js", "components/sprigs.js",
           "components/sprig-motion.js", "components/search.js", "components/sprig-filters.js", "pages/results.js",
           "components/copy.js", "components/coach.js", "components/keyboard.js", "components/click-away.js", "components/modal.js",
           "components/toast.js", "components/auto-fill.js", "pages/prompt-form.js", "components/header-buttons.js", "components/rename.js", "components/trash.js", "pages/home.js"]

def join(files):
    return "".join((ROOT / f).read_text(encoding="utf-8") for f in files).rstrip("\n")

html = (ROOT / "template.html").read_text(encoding="utf-8")
for marker, files in (("__STYLES__", STYLES), ("__PAGE__", PAGE), ("__DIALOGS__", DIALOGS), ("__SCRIPTS__", SCRIPTS)):
    html = html.replace(marker, join(files))
html = html.replace("__DATA__", json.dumps(items, ensure_ascii=False).replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029"))
html = html.replace("__FLOWER__", "data:image/webp;base64," + base64.b64encode((ROOT / "public" / "assets" / "flower.webp").read_bytes()).decode())   # inlined so the picture can never be blocked separately from the page
(ROOT / "public" / "index.html").write_text(html, encoding="utf-8")
print(f"public/index.html built with {len(items)} prompts")

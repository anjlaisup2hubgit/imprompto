"""Rebuild index.html from the markdown files in prompts/.
Run:  python build.py
Each prompt is prompts/<category>/<name>.md with a small header:
---
title: My prompt
tags: tag1, tag2
---
The prompt text...
"""
import json, pathlib, base64

ROOT = pathlib.Path(__file__).parent
items = []
for f in sorted((ROOT / "prompts").rglob("*.md")):
    raw = f.read_text(encoding="utf-8")
    meta, body = {}, raw
    if raw.startswith("---"):
        _, head, body = raw.split("---", 2)
        for line in head.strip().splitlines():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    items.append({
        "title": meta.get("title", f.stem),
        "category": f.parent.name,
        "tags": [t.strip() for t in meta.get("tags", "").split(",") if t.strip()],
        "text": body.strip(),
        "file": f.relative_to(ROOT).as_posix(),
    })

html = (ROOT / "template.html").read_text(encoding="utf-8")
flower = "data:image/png;base64," + base64.b64encode((ROOT / "assets" / "flower.png").read_bytes()).decode()
html = html.replace("__FLOWER__", flower)
html = html.replace("__DATA__", json.dumps(items, ensure_ascii=False).replace("</", "<\\/"))
(ROOT / "index.html").write_text(html, encoding="utf-8")
print(f"index.html built with {len(items)} prompts")

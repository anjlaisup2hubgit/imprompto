"""Rebuild public/index.html from the markdown files in prompts/.
Run:  python build.py
Each prompt is prompts/<category>/<name>.md with a small header:
---
title: My prompt
tags: tag1, tag2
---
The prompt text...
"""
import json, pathlib, re

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

html = (ROOT / "template.html").read_text(encoding="utf-8")
html = html.replace("__DATA__", json.dumps(items, ensure_ascii=False).replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029"))
(ROOT / "public" / "index.html").write_text(html, encoding="utf-8")
print(f"public/index.html built with {len(items)} prompts")

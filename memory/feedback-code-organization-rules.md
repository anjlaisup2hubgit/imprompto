---
name: feedback-code-organization-rules
description: "Code organization rules so a beginner can read the app (folders, one job per file, 300-line cap, push to main)"
metadata:
  type: feedback
---

Keep the app organized so a beginner can read it:
- Screens go in `pages/`.
- Shared pieces go in `components/`.
- Saving and loading goes in `data/`.
- One job per file.
- No file over 300 lines (generated output like `public/index.html`, built by `build.py`, is exempt).
- Before writing anything new, search the project to check if it already exists, and reuse it.
- Do NOT push or merge to `main` unless the user asks (overrides the old "push after every change" rule).
- Replies: 1 sentence, no jargon, no redundancy, nothing obvious; suggest a better solution before implementing the user's idea (skill: minimum-output-response).

**Why:** User wants a codebase a beginner can follow, and short replies.

**How to apply:** These rules were removed from `CLAUDE.md`, so this memory is the only record. Follow them on every change.

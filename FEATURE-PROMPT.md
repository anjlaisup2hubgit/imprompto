# Feature Prompt (copy, fill in the FEATURE line, paste into Claude)

FEATURE: <describe the feature in 1-3 plain sentences>

You are building this feature in Imprompto alone, start to finish. Do not ask me questions unless you are truly blocked.

## How to work
1. Read CLAUDE.md and MEMORY.md and follow every rule (pages / components / data folders, one job per file, no file over 300 lines).
2. Search the project for anything that already does part of this and reuse it.
3. If my request is unclear, pick the simplest sensible meaning, write it down as "Assumption: ...", and keep going.
4. If you know a better way than my idea, use the better way and say why in one line.
5. Make the smallest change that works. Do not touch unrelated code. Do not add extras I did not ask for.
6. Start the app with the preview tool (.claude/launch.json), then test the feature yourself: click it, reload the page, check the console for errors, and check that older features (add, edit, drag, trash, search) still work.
7. If something fails, fix it and test again. Repeat until it passes. Do not hand me broken work.
8. Commit to a new branch with a clear message. Do not push and do not touch main.

## Only stop and ask me if
- The feature would delete or change data people already saved.
- It needs a paid service, a new account, or a secret key.
- You tried 3 different fixes and it still fails.

## When done, reply in 3 short lines (plain words)
- What now works.
- What you tested and the result.
- Any assumption you made.

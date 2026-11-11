const KEY = "promptlib.mine.v1", SEEN = "promptlib.seen.v1";
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const str = v => (typeof v === "string" || typeof v === "number") ? String(v) : "";
const slug = v => str(v).trim().toLowerCase().replace(/\s+/g, "-");
/* turns anything (saved data, imported file) into a safe prompt, or null if it is not one */
function clean(p) {
  if (!p || typeof p !== "object" || Array.isArray(p) || p.purged) return null;   // purged = left over from the old starter prompts
  const title = str(p.title).trim(), text = str(p.text).trim();
  if (!title || !text) return null;
  const tags = (Array.isArray(p.tags) ? p.tags : []).map(slug).filter(Boolean);
  return { id: str(p.id) || uid(), title, category: slug(p.category) || "category1", tags, text, ...(+p.deleted && { deleted: +p.deleted }) };
}
let MINE = [];
function loadMine() {
  try { const j = JSON.parse(localStorage.getItem(KEY) || "[]"); MINE = (Array.isArray(j) ? j : []).map(clean).filter(Boolean); } catch (e) { MINE = []; }
}
loadMine();
const save = () => { let ok = true; try { localStorage.setItem(KEY, JSON.stringify(MINE)); localStorage.setItem(DIRTY, "1"); } catch (e) { ok = false; } sync(); return ok; };
const all = () => MINE.filter(m => !m.deleted);

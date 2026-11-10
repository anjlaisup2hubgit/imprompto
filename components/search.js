/* ---- search (every word must match somewhere; tiny typos allowed) ---- */
function near(a, b) {                       // true if the words differ by one typo
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    if (i === a.length) return true;
    if (a.slice(i + 1) === b.slice(i + 1)) return true;                                    // one wrong letter
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);   // two letters swapped
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  let i = 0; while (i < s.length && s[i] === l[i]) i++;
  return s.slice(i) === l.slice(i + 1);                                                    // one missing letter
}
const fold = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const cache = new WeakMap();
function hay(item) {
  let h = cache.get(item);
  if (!h) {
    const title = fold(item.title), tags = fold(item.category + " " + item.tags.join(" ")), text = fold(item.text);
    h = { title, tags, text, words: [...new Set((title + " " + tags + " " + text).split(/[^a-z0-9']+/).filter(w => w.length >= 4))] };
    cache.set(item, h);
  }
  return h;
}
function score(item, terms) {
  const h = hay(item);
  let total = 0;
  for (const t of terms) {
    let s = 0;
    if (h.title.includes(t)) s = 5; else if (h.tags.includes(t)) s = 4; else if (h.text.includes(t)) s = 2;
    else if (t.length >= 4 && h.words.some(w => near(t, w))) s = 1;
    if (!s) return 0;
    total += s;
  }
  return total;
}
function hl(s, terms) {                       // highlight on the plain text, escape each piece afterwards
  const ts = terms.filter(t => t.length > 1).sort((a, b) => b.length - a.length);
  if (!ts.length) return esc(s);
  const re = new RegExp("(" + ts.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  return s.split(re).map((part, i) => i % 2 ? "<mark>" + esc(part) + "</mark>" : esc(part)).join("");
}

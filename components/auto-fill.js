/* ---- fills in a blank title or category from the prompt text ---- */
const STOP = new Set("about above after again also been before being between both could does doing each from have having here into just like make more most must only other over please should some such than that their them then there these they this those through under until very want what when where which while will with would your you the and for are but not can use using write give".split(" "));
const wordsOf = t => fold(t).split(/[^a-z0-9']+/).filter(w => w.length >= 4 && !STOP.has(w));
function autoTitle(text) {
  const first = text.replace(/\s+/g, " ").split(/(?<=[.!?:])\s/)[0].replace(/[.!?:]+$/, "");
  const t = first.length > 60 ? first.slice(0, 57).replace(/\s+\S*$/, "") + "…" : first;
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function autoCategory(text) {          // the existing category whose prompts share the most words with this one
  const mine = new Set(wordsOf(text)), score = {};
  all().forEach(d => { wordsOf(d.title + " " + d.tags.join(" ") + " " + d.text).forEach(w => { if (mine.has(w)) score[d.category] = (score[d.category] || 0) + 1; }); });
  const best = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
  return best || "category1";
}

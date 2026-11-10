/* ---- trash: a deleted prompt is only marked with the time, so it can come back for 30 days ---- */
const KEEP_MS = 30 * 864e5;
const trashItems = () => MINE.filter(m => m.deleted && !m.purged && Date.now() - m.deleted < KEEP_MS).sort((a, b) => b.deleted - a.deleted);
function trashPrompt(d) {
  const mine = d.mine && MINE.find(m => m.id === d.id);
  if (mine) mine.deleted = Date.now(); else MINE.push(clean({ ...d, from: d.file, deleted: Date.now() }));   // a starter prompt: save a hidden copy that hides the original
  save();
}
function restorePrompt(id) { const m = MINE.find(x => x.id === id); if (m) { delete m.deleted; save(); } }
function purgePrompt(id) {                                           // gone for good (a starter prompt keeps a hidden mark so it does not return)
  const m = MINE.find(x => x.id === id); if (!m) return;
  if (m.from) m.purged = true; else MINE = MINE.filter(x => x !== m);
  save();
}
const emptyTrash = () => trashItems().map(m => m.id).forEach(purgePrompt);

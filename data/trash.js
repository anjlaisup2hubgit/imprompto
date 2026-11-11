/* ---- trash: a deleted prompt is only marked with the time, so it can come back for 30 days ---- */
const KEEP_MS = 30 * 864e5;
const trashItems = () => MINE.filter(m => m.deleted && Date.now() - m.deleted < KEEP_MS).sort((a, b) => b.deleted - a.deleted);
function trashPrompt(d) {
  const m = MINE.find(x => x.id === d.id); if (m) m.deleted = Date.now();
  save();
}
function restorePrompt(id) { const m = MINE.find(x => x.id === id); if (m) { delete m.deleted; save(); } }
const purgePrompt = id => { MINE = MINE.filter(x => x.id !== id); save(); };   // gone for good
const emptyTrash = () => trashItems().map(m => m.id).forEach(purgePrompt);

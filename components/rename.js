/* ---- the "Rename category" button: works on the category you opened (sprig) or are browsing ---- */
let renaming = "";
function renameTarget() {
  const f = floaters.find(g => g.open && g.o !== "*");
  return f ? f.o : (cat && cat !== "*" ? cat : "");
}
function updateRename() { $("rename").classList.toggle("show", !!renameTarget()); }
$("rename").onclick = () => {
  renaming = renameTarget(); if (!renaming) return;
  $("r-name").value = renaming; showModal("renamemodal", "r-name"); $("r-name").select();
};
function saveRename() {
  const old = renaming, name = $("r-name").value;
  closeModals();
  const n = renameCategory(old, name);
  if (!n) return toast("Name not changed");
  floaters.forEach(g => g.open = false);
  if (cat === old) cat = slug(name);
  renderLabels(); render(); toast(`Renamed ${n} prompt${n === 1 ? "" : "s"}`);
}
$("r-save").onclick = saveRename;
$("r-cancel").onclick = closeModals;
$("r-name").onkeydown = e => { if (e.key === "Enter") saveRename(); };

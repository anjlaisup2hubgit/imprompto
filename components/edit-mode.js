/* ---- Edit dashboard: turns edit mode on and off, and opens the picture style panel ---- */
function setStylePanel(on) { $("stylepanel").classList.toggle("open", on); $("stylebtn").setAttribute("aria-expanded", on); }
function setEditing(on) {
  document.body.classList.toggle("editing", on);
  if (on) setMenu(false); else { setPlacing(false); setStylePanel(false); }
}
$("editdash").onclick = () => setEditing(true);
$("donebtn").onclick = () => setEditing(false);
$("stylebtn").onclick = () => setStylePanel(!$("stylepanel").classList.contains("open"));
$("movebtn").onclick = () => setPlacing(!document.body.classList.contains("placing"));
addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("editing")) setEditing(false); });

/* ---- pop-up windows ---- */
let lastFocus = null;
function showModal(id, focusId) { lastFocus = document.activeElement; $(id).classList.add("show"); $(focusId).focus(); dismissCoach(); }
function closeModals() {
  const was = openOverlay();
  document.querySelectorAll(".ov").forEach(o => o.classList.remove("show"));
  if (was && lastFocus && lastFocus.focus) lastFocus.focus();
}
$("f-cancel").onclick = closeModals;
document.querySelectorAll(".ov").forEach(o => o.addEventListener("mousedown", e => { if (e.target === o) closeModals(); }));

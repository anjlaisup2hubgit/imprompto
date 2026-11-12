/* ---- Settings: opens and closes the panel that holds the header buttons ---- */
function setMenu(on) { $("menu").classList.toggle("open", on); $("setbtn").setAttribute("aria-expanded", on); }
$("setbtn").onclick = () => setMenu(!$("menu").classList.contains("open"));
document.addEventListener("pointerdown", e => { if (!e.target.closest("#menu,#setbtn")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

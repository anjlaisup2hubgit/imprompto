/* ---- Edit mode: the list of picture styles; the choice is remembered and shown on the next frame ---- */
function drawStyleList() {
  const now = PIC_STYLES[picStyleIndex()].id;
  $("styles").innerHTML = PIC_STYLES.map(s => `<button class="sty${s.id === now ? " on" : ""}" data-id="${s.id}">${s.name}</button>`).join("");
}
$("styles").onclick = e => { const b = e.target.closest(".sty"); if (b) { savePicStyle(b.dataset.id); drawStyleList(); } };
drawStyleList();

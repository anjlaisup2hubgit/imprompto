/* ---- your picture: choose a photo, style it, drag each sprig's dot onto it (the buttons live in edit mode) ---- */
async function showPicture() { try { const b = await getPictureImage(); if (b) holoShow(URL.createObjectURL(b)); } catch (e) {} }
function readPicture(file) {                                          // shrink huge pictures so the graphics card can handle them
  const im = new Image(), url = URL.createObjectURL(file);
  im.onerror = () => toast("That file is not a picture");
  im.onload = () => {
    const k = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement("canvas");
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    c.toBlob(async blob => {                                          // a PNG stays a PNG so see-through parts stay see-through
      const kept = await putPictureImage(blob).then(() => true, () => false);
      picture = { dots: {} }; savePicture();
      showPicture(); renderLabels(); setPlacing(true);
      if (!kept) toast("Shown now, but this page cannot keep it for next time");
    }, file.type === "image/png" ? "image/png" : "image/jpeg", 0.88);
  };
  im.src = url;
}
function setPlacing(on) {
  document.body.classList.toggle("placing", on);
  $("movebtn").classList.toggle("on", on); $("movebtn").setAttribute("aria-pressed", on);
  $("pichint").hidden = !on;
}
$("choosepic").onclick = () => $("picfile").click();
$("picfile").onchange = e => { if (e.target.files[0]) readPicture(e.target.files[0]); e.target.value = ""; };
$("rmpic").onclick = () => { picture = null; savePicture(); delPictureImage().catch(() => {}); holoHide(); setPlacing(false); renderLabels(); };
$("labels").addEventListener("pointerdown", e => {                    // in placing mode, a dot can be dragged
  const f = document.body.classList.contains("placing") && floaters.find(g => g.dot === e.target);
  if (!f) return;
  e.preventDefault();
  const move = ev => { const q = stagePt(ev); f.p.dx = Math.round(q.x - flw.x); f.p.dy = Math.round(q.y - flw.y); };
  const up = () => {
    removeEventListener("pointermove", move); removeEventListener("pointerup", up);
    picture = picture || { dots: {} }; picture.dots[f.o] = [f.p.dx, f.p.dy]; savePicture();
  };
  addEventListener("pointermove", move); addEventListener("pointerup", up);
});
if (picture) showPicture();

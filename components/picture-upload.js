/* ---- your picture: choose a photo, style it, drag each sprig's dot onto it (the buttons live in edit mode) ---- */
async function showPicture() { try { const b = await getPictureImage(); if (b) holoShow(URL.createObjectURL(b)); } catch (e) {} }
const PIC_MAX = 4;                                                    // most pictures one frame can hold
const loadImage = file => new Promise((ok, no) => {
  const im = new Image(), url = URL.createObjectURL(file);
  im.onload = () => { URL.revokeObjectURL(url); ok(im); }; im.onerror = no; im.src = url;
});
async function readPicture(files) {                                   // one or more photos become one picture (several are tiled like a collage)
  let ims;
  try { ims = await Promise.all(files.slice(0, PIC_MAX).map(loadImage)); } catch (e) { return toast("That file is not a picture"); }
  if (files.length > PIC_MAX) toast("Only the first " + PIC_MAX + " pictures were used");
  const n = ims.length, cols = n === 1 ? 1 : 2, rows = Math.ceil(n / cols), c = document.createElement("canvas");
  if (n === 1) { const k = Math.min(1, 1600 / Math.max(ims[0].width, ims[0].height)); c.width = Math.round(ims[0].width * k); c.height = Math.round(ims[0].height * k); c.getContext("2d").drawImage(ims[0], 0, 0, c.width, c.height); }
  else {                                                              // each photo fills one 800px square, cropped to fit
    c.width = cols * 800; c.height = rows * 800; const g = c.getContext("2d");
    ims.forEach((im, i) => { const s = Math.min(im.width, im.height), x = (i % cols) * 800, y = Math.floor(i / cols) * 800;
      g.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, x, y, 800, 800); });
  }
  const png = files.length === 1 && files[0].type === "image/png";   // a lone PNG stays a PNG so see-through parts stay see-through
  c.toBlob(async blob => {
    const kept = await putPictureImage(blob).then(() => true, () => false);
    picture = { dots: {} }; savePicture();
    showPicture(); renderLabels(); setPlacing(true);
    if (!kept) toast("Shown now, but this page cannot keep it for next time");
  }, png ? "image/png" : "image/jpeg", 0.88);
}
function setPlacing(on) {
  if (on) setAligning(false);
  $("pichint").textContent = "Drag each dot or name to where you want it";
  document.body.classList.toggle("placing", on);
  $("movebtn").classList.toggle("on", on); $("movebtn").setAttribute("aria-pressed", on);
  $("pichint").hidden = !on;
}
$("choosepic").onclick = () => $("picfile").click();
$("picfile").onchange = e => { if (e.target.files.length) readPicture([...e.target.files]); e.target.value = ""; };
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

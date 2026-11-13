/* ---- move the whole picture: drag it anywhere, or press Centre; its dots and lines ride along ---- */
function setAligning(on) {
  if (on) setPlacing(false);
  document.body.classList.toggle("aligning", on);
  $("alignbtn").classList.toggle("on", on);
  if (on) $("pichint").textContent = "Drag the picture where you want it";
  $("pichint").hidden = !on;
}
$("alignbtn").onclick = () => setAligning(!document.body.classList.contains("aligning"));
$("centerpic").onclick = () => { picOff.x = 620 - 781; picOff.y = 450 - 427; savePicOff(); };   // the picture's middle onto the stage's middle
function snapPic(side) {   // slide the picture to the left or right edge of the stage, keeping its height
  const m = document.body.classList.contains("mobile"), left = m ? 0 : 332, w = m ? 420 : 898, stageW = m ? 420 : 1240;
  picOff.x = side === "left" ? -left : stageW - left - w; savePicOff();
}
$("leftpic").onclick = () => snapPic("left");
$("rightpic").onclick = () => snapPic("right");
document.addEventListener("pointerdown", e => {
  if (!document.body.classList.contains("aligning") || e.button !== 0 || e.target.closest("#edge")) return;
  e.preventDefault();
  const a = stagePt(e), x0 = picOff.x, y0 = picOff.y;
  const move = ev => {
    const q = stagePt(ev), nx = Math.round(x0 + q.x - a.x), ny = Math.round(y0 + q.y - a.y);
    flw.x += nx - picOff.x; flw.y += ny - picOff.y; picOff.x = nx; picOff.y = ny;      // follow the pointer right away, no easing lag
  };
  const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); savePicOff(); };
  addEventListener("pointermove", move); addEventListener("pointerup", up);
});

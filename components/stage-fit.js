/* ---- fit the stage into the window (phones and short windows get their own layout) ---- */
const vw = () => document.documentElement.clientWidth || innerWidth;   // real visible width (innerWidth can be stretched on phones)
const isMobile = () => vw() < 700 || vw() < innerHeight * 0.9 || innerHeight < 560;
function fit() {
  const mobile = isMobile();
  document.body.classList.toggle("mobile", mobile);
  document.body.dataset.mode = mobile ? "classic" : mode;
  document.querySelectorAll("#modes button").forEach(b => { const on = b.dataset.m === mode; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  const W = mobile ? 420 : 1200, H = mobile ? 960 : 900, st = $("stage");
  st.style.width = W + "px"; st.style.height = H + "px";
  $("lines").setAttribute("viewBox", `0 0 ${W} ${H}`);
  $("q").placeholder = mobile ? "Search your prompts…" : "Type any words you remember…";
  const l = $("link");
  if (l) { const a = mobile ? [210, 370, 210, 544] : [448, 120, 635, 430]; ["x1", "y1", "x2", "y2"].forEach((k, i) => l.setAttribute(k, a[i])); }
  const s = mobile ? Math.min(vw() / W, 1.5) : Math.min(vw() / W, innerHeight / H);
  const x = (vw() - W * s) / 2, y = mobile ? 0 : (innerHeight - H * s) / 2;
  st.style.transform = `translate(${x}px,${y}px) scale(${s})`;
}
let wasMobile = isMobile();
addEventListener("resize", () => { fit(); if (isMobile() !== wasMobile) { wasMobile = isMobile(); renderLabels(); render(); } });

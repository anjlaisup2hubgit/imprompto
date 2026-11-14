$("q").addEventListener("input", () => { render(); });
$("clr").onclick = () => { $("q").value = ""; cat = ""; render(); $("q").focus(); };
const openOverlay = () => document.querySelector(".ov.show");
addEventListener("keydown", e => {
  const ov = openOverlay();
  if (e.key === "Escape") { closeSeeds(); $("q").value = ""; cat = ""; closeModals(); render(); return; }
  if (e.key === "/" && !ov && !/^(INPUT|TEXTAREA)$/.test(e.target.tagName || "")) { e.preventDefault(); $("q").focus(); return; }
  if (e.key === "Tab" && ov) {                                              // keep keyboard focus inside the pop-up
    const f = [...ov.querySelectorAll("input:not([hidden]),textarea,button")].filter(x => !x.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    return;
  }
  if (ov || e.isComposing || !$("box").classList.contains("show")) return;
  if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
  else if (e.key === "Enter" && e.target.id === "q") { const rows = document.querySelectorAll("#list .r"); if (rows[cur]) rows[cur].click(); }
});

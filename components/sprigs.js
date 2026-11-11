/* ---- sprigs and seeds ----
   A sprig is a category: a pill on a tendril, pinned to the flower by a pollen dot.
   Sprigs drift, push each other apart, and spring back when dragged. Seeds are the prompts inside:
   point at a sprig to see them peek out, click it to pin them open. */
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function trunc(t, n) { return t.length > n ? t.slice(0, n - 1) + "…" : t; }
function mkSeed(f, d, count) {
  const el = document.createElement("button"); el.className = "seed" + (d ? "" : " all"); el.style.setProperty("--c", f.color);
  el.innerHTML = d ? `<b></b><span>${esc(trunc(d.title, 18))}</span>` : `<b></b><span>all ${count} →</span>`;
  el.setAttribute("aria-label", d ? `Open prompt ${d.title}` : `See all ${count} ${f.o} prompts`);
  const link = document.createElementNS(NS, "line"); link.setAttribute("class", "slink"); link.setAttribute("stroke", f.color);
  const sd = { f, d, el, link, x: f.x, y: f.y, vx: 0, vy: 0 };
  el.style.left = f.x + "px"; el.style.top = f.y + "px";
  const on = () => { enter(f); showPeek(sd); }, off = () => { leave(); hidePeek(); };
  el.addEventListener("pointerenter", on); el.addEventListener("focus", on); el.addEventListener("pointerleave", off); el.addEventListener("blur", off);
  el.addEventListener("click", () => {
    f.open = false; hidePeek(); syncFocus();
    if (!d) return toggleCat(f.o);
    $("q").value = d.title; cat = d.category; render();
  });
  $("labels").append(el);
  return sd;
}
const peekEl = document.createElement("div"); peekEl.id = "peek"; $("stage").append(peekEl);
function showPeek(sd) {
  if (!sd.d) return peekEl.classList.remove("show");
  peekEl.style.setProperty("--c", sd.f.color);
  peekEl.innerHTML = `<h4>${esc(sd.d.title)}</h4><p>${esc(sd.d.text.replace(/\s+/g, " "))}</p><div class="tg">${sd.d.tags.slice(0, 4).map(t => `<span>${esc(t)}</span>`).join("")}</div><em>Click to open</em>`;
  const right = sd.x < 850;
  peekEl.style.left = clamp(right ? sd.x + 26 : sd.x - 276, 10, 940) + "px";
  peekEl.style.top = clamp(sd.y - 30, 100, 640) + "px";
  peekEl.classList.add("show");
}
function hidePeek() { peekEl.classList.remove("show"); }
function enter(f) { clearTimeout(leaveTimer); if (focused !== f) { focused = f; syncFocus(); } }
function leave() { clearTimeout(leaveTimer); leaveTimer = setTimeout(() => { focused = null; syncFocus(); }, 380); }
function syncFocus() {                                               // dim the others, show seeds for the sprig you're on
  const anyOpen = floaters.some(x => x.open);
  for (const g of floaters) {
    g.peek = g === focused && !!g.seeds.length;
    const show = g.peek || g.open, dim = (focused || anyOpen) && g !== focused && !g.open;
    g.b.classList.toggle("dim", !!dim); g.dot.classList.toggle("dim", !!dim); g.tie && g.tie.classList.toggle("dim", !!dim);
    g.tie && g.tie.classList.toggle("hl", g === focused || g.open);
    updateRename();
    g.b.classList.toggle("open", g.open); if (g.o !== "*") g.b.setAttribute("aria-expanded", g.open);
    g.seeds.forEach(sd => { sd.el.classList.toggle("show", show); sd.el.classList.toggle("full", g.open); sd.link.classList.toggle("show", show); });
  }
}
function toggleOpen(f) { const was = f.open; floaters.forEach(g => g.open = false); f.open = !was; if (f.open) focused = f; syncFocus(); }
function closeSeeds() { if (floaters.some(g => g.open)) { floaters.forEach(g => g.open = false); syncFocus(); } }
document.addEventListener("pointerdown", e => { if (!e.target.closest(".lab,.seed,#rename")) closeSeeds(); });

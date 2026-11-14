/* ---- categories ---- */
const SPOTS = [                                   // petal positions: label (x,y) and the dot on the flower (dx,dy)
  { x: 430,  y: 190, dx: 639, dy: 210 },
  { x: 1070, y: 200, dx: 862, dy: 128 },
  { x: 330,  y: 600, dx: 555, dy: 490 },
  { x: 1070, y: 500, dx: 933, dy: 336 },
  { x: 230,  y: 400, dx: 590, dy: 340 },     // spots 5-8: room for 8 categories
  { x: 1090, y: 350, dx: 905, dy: 245 },
  { x: 230,  y: 780, dx: 620, dy: 610 },
  { x: 1060, y: 740, dx: 850, dy: 600 },
];
const ALLSPOT = { x: 640, y: 835, dx: 610, dy: 735 };
const ORDER = ["category1", "category2", "category3", "category4"];
const PAL = ["#8b5cf6", "#d946ef", "#d97706", "#0d9488", "#2563eb", "#dc2626", "#65a30d", "#0891b2"];
const ln = $("lines");
function catList() {
  const D = all(), found = [...new Set(D.map(d => d.category))];
  const ord = [...ORDER.filter(c => found.includes(c)), ...found.filter(c => !ORDER.includes(c)).sort()];
  return ord.map((c, i) => ({ c, n: D.filter(d => d.category === c).length, color: PAL[i % PAL.length] }));
}
function toggleCat(c) { cat = cat === c ? "" : c; render(); }          // a sprig narrows the current search (or browses when the box is empty)
function bloom(on, dot, color) {
  const b = $("bloom"); if (on) { b.style.cssText = `left:${dot.dx}px;top:${dot.dy}px;--c:${color}`; }
  b.classList.toggle("on", on);
}
const floaters = [];
const SEEDS_MAX = 7, NS = "http://www.w3.org/2000/svg";
let focused = null, leaveTimer = 0;
function renderLabels() {
  const cats = catList(), D = all();
  $("total").innerHTML = D.length + (D.length === 1 ? " prompt" : " prompts") + (cloudOK ? '<span class="sv"> · synced to your account</span>' : '<span class="sv"> · saved on this device</span>');
  $("sobtn").style.display = cloudOK ? "" : "none";             // nobody to sign out of when prompts only live on this device (signing out would wipe them)
  $("labels").innerHTML = ""; $("chips").innerHTML = ""; floaters.length = 0; focused = null;
  ln.querySelectorAll(".slink").forEach(n => n.remove()); RS.length = 0;
  let tieHtml = "", k = 0;
  const mk = (o, spot, label, count, color) => {
    const p = withDot(o, spot);
    tieHtml += `<g class="tie"><path d="M${p.dx} ${p.dy}L${p.x} ${p.y}" fill="none" stroke="${color}" stroke-width="1.6"/></g>`;
    const delay = `animation-delay:${0.1 + 0.08 * k++}s`;
    const dot = document.createElement("div"); dot.className = "dot"; dot.style.cssText = `left:${p.dx}px;top:${p.dy}px;--c:${color};${delay}`;
    const b = document.createElement("button"); b.className = "lab"; b.dataset.c = o; b.style.cssText = `left:${p.x}px;top:${p.y}px;--c:${color};${delay}`;
    b.setAttribute("aria-label", `${label}, ${count} ${count === 1 ? "prompt" : "prompts"}`);
    if (o !== "*") b.setAttribute("aria-expanded", "false");
    b.innerHTML = `<b></b>${esc(label)} <i>${count}</i>`;
    const f = { o, p, b, dot, color, ph: k * 1.9, amp: 1, hold: false, x: p.x, y: p.y, vx: 0, vy: 0, seeds: [], rs: [], label, total: count, open: false, peek: false, drag: null };
    $("labels").append(dot, b);
    const editing = () => document.body.classList.contains("editing");
    b.addEventListener("click", () => { if (f.moved || editing()) { f.moved = false; return; } o === "*" ? toggleCat(o) : toggleOpen(f); });
    const on = () => { if (editing()) return; dot.classList.add("hot"); bloom(true, p, color); f.hold = true; enter(f); };
    const off = () => { dot.classList.remove("hot"); bloom(false, p, color); f.hold = false; leave(); };
    b.addEventListener("mouseenter", on); b.addEventListener("focus", on); b.addEventListener("mouseleave", off); b.addEventListener("blur", off);
    b.addEventListener("pointerdown", e => startDrag(f, e));
    if (o !== "*") {                                                  // the seeds inside this sprig
      D.filter(d => d.category === o).slice(0, SEEDS_MAX).forEach(d => f.seeds.push(mkSeed(f, d)));
      f.seeds.push(mkSeed(f, null, count));
    }
    floaters.push(f);
  };
  cats.slice(0, SPOTS.length).forEach((o, i) => mk(o.c, SPOTS[i], o.c, o.n, o.color));
  mk("*", ALLSPOT, "all prompts", D.length, "#64748b");
  [{ c: "*", n: D.length, color: "#64748b", label: "all" }, ...cats].forEach((o, i) => {
    const ch = document.createElement("button"); ch.className = "chipbtn" + (i > SPOTS.length ? " extra" : ""); ch.dataset.c = o.c; ch.style.setProperty("--c", o.color);
    ch.innerHTML = `<b></b>${esc(o.label || o.c)}<i>${o.n}</i>`; ch.onclick = () => { toggleCat(o.c); if (cat) $("box").scrollIntoView({ behavior: "smooth", block: "nearest" }); }; $("chips").append(ch);
  });
  ln.querySelectorAll(".tie").forEach(n => n.remove());
  ln.insertAdjacentHTML("afterbegin", tieHtml);
  ln.querySelectorAll(".tie").forEach((g, i) => { floaters[i].tie = g; floaters[i].line = g.firstChild; });
  floaters.forEach(f => f.seeds.forEach(sd => ln.insertAdjacentElement("afterbegin", sd.link)));
  $("catlist").innerHTML = cats.map(o => `<option value="${esc(o.c)}">`).join("");
}
ln.innerHTML = `<line id="link" x1="448" y1="120" x2="635" y2="430" stroke="#c25be6" stroke-width="1.8" opacity="0" style="transition:opacity .22s"/>`;
renderLabels(); fit();

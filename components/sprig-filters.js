/* sprigs double as live filters: while searching they show how many matches they hold */
function markSprigs(counts, restrict) {
  for (const f of floaters) {
    const n = counts ? (f.o === "*" ? counts.total : (counts[f.o] || 0)) : f.total, sel = !!counts && f.o === cat;
    const i = f.b.querySelector("i"); if (i) i.textContent = n;
    f.b.setAttribute("aria-label", `${f.label}, ${n} ${counts ? "matches" : "prompts"}`);
    const off = !!counts && restrict && !sel, zero = !!counts && !sel && n === 0;
    for (const el of [f.b, f.dot, f.tie]) if (el) { el.classList.toggle("off", off); el.classList.toggle("zero", zero); }
    f.dot.classList.toggle("sel", sel); f.tie && f.tie.classList.toggle("sel", sel);
  }
}
function clearSeeds() { RS.splice(0).forEach(sd => { sd.el.remove(); sd.link.remove(); }); floaters.forEach(f => f.rs = []); }
function makeResultSeed(d, i, color) {                   // seeds layout: each result is a seed on its category's sprig
  const f = floaters.find(g => g.o === d.category) || floaters.find(g => g.o === "*"); if (!f) return;
  const el = document.createElement("button"); el.className = "seed rseed show full"; el.tabIndex = -1; el.style.setProperty("--c", color);
  el.style.animationDelay = i * 40 + "ms";
  el.innerHTML = `<b></b><span>${esc(trunc(d.title, 30))}</span>`; el.setAttribute("aria-label", `Show ${d.title}`);
  const link = document.createElementNS(NS, "line"); link.setAttribute("class", "slink rs show"); link.setAttribute("stroke", color);
  const sd = { f, d, el, link, i, x: f.x, y: f.y, vx: 0, vy: 0 };
  el.style.left = f.x + "px"; el.style.top = f.y + "px";
  el.addEventListener("click", () => { if (cur === i) { const r = document.querySelectorAll("#list .r")[i]; r && r.click(); } else setCur(i); });
  $("labels").append(el); ln.insertAdjacentElement("afterbegin", link);
  f.rs.push(sd); RS.push(sd);
}

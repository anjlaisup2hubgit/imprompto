function render() {
  const raw = $("q").value.trim();
  const terms = [...new Set(fold(raw).split(/\s+/).filter(Boolean))].slice(0, 8).map(w => w.slice(0, 60));
  const active = !!(terms.length || cat);
  document.body.classList.toggle("searching", active);
  $("clr").classList.toggle("show", !!$("q").value);
  document.querySelectorAll(".lab,.chipbtn").forEach(l => { const on = l.dataset.c === cat; l.classList.toggle("on", on); l.setAttribute("aria-pressed", on); });
  $("box").classList.toggle("show", active);
  $("q").setAttribute("aria-expanded", active);
  $("link").setAttribute("opacity", active && isMobile() ? 1 : 0);
  clearSeeds();
  if (!active) { markSprigs(null); $("q").removeAttribute("aria-activedescendant"); return; }

  const restrict = !!cat && cat !== "*", cl = catList(), color = Object.fromEntries(cl.map(o => [o.c, o.color]));
  const base = all().map(d => ({ d, s: terms.length ? score(d, terms) : 1 })).filter(r => r.s);
  const rows = base.filter(r => !restrict || r.d.category === cat);
  if (terms.length) rows.sort((a, b) => b.s - a.s);
  const counts = { total: base.length };
  base.forEach(r => { counts[r.d.category] = (counts[r.d.category] || 0) + 1; });
  markSprigs(counts, restrict);
  ctx = { n: rows.length, restrict };
  $("rename").classList.toggle("show", restrict);

  $("tab").textContent = "results · " + rows.length;
  $("live").textContent = rows.length + (rows.length === 1 ? " result" : " results");
  $("head").textContent = terms.length ? `Best matches for “${raw}”` + (restrict ? ` in ${cat}` : "") : (restrict ? `Category · ${cat}` : "All prompts");
  $("cats").innerHTML = "";
  [{ c: "*", color: "#64748b", label: "all" }, ...cl].forEach(o => {
    const on = o.c === "*" ? !restrict : cat === o.c;
    const b = document.createElement("button"); b.className = "cb" + (on ? " on" : ""); b.setAttribute("aria-pressed", on);
    b.style.setProperty("--c", o.color); b.innerHTML = `<b></b>${esc(o.label || o.c)}`;
    b.onclick = () => { cat = o.c; render(); };
    $("cats").append(b);
  });
  const list = $("list"); list.innerHTML = ""; list.scrollTop = 0; cur = 0;
  if (!rows.length) {
    list.innerHTML = '<div class="none">Nothing found. Try fewer or different words' + (cl.length ? ", or browse a group:" : ".") + '<div class="sug"></div></div>';
    cl.slice(0, 6).forEach(o => { const b = document.createElement("button"); b.className = "cb"; b.style.setProperty("--c", o.color); b.innerHTML = `<b></b>${esc(o.c)}`; b.onclick = () => { $("q").value = ""; cat = o.c; render(); }; list.querySelector(".sug").append(b); });
    $("foot").textContent = "Esc to clear"; $("q").removeAttribute("aria-activedescendant"); return;
  }
  rows.forEach(({ d }, i) => {
    const r = document.createElement("div");
    r.className = "r"; r.id = "r" + i; r.setAttribute("role", "option"); r.setAttribute("aria-selected", i === 0);
    r.style.setProperty("--c", color[d.category] || "#64748b");
    r.style.animationDelay = Math.min(i, 8) * 25 + "ms";
    r.title = d.text.slice(0, 400);
    r.innerHTML = `<div class="hd"><h3><i class="dt"></i>${hl(d.title, terms)}</h3><span class="cat">${esc(d.category)}</span><span class="cp">Copy</span></div>
      <p>${hl(d.text.replace(/\s+/g, " "), terms)}</p>
      <div class="ft"><div class="chips">${d.mine ? '<span class="you">yours</span>' : ""}${d.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="acts"><button class="act" data-a="edit" aria-label="Edit ${esc(d.title)}">Edit</button>${d.mine ? `<button class="act" data-a="del" aria-label="Delete ${esc(d.title)}">${d.from ? "Reset" : "Delete"}</button>` : ""}</div></div>`;
    r.onclick = ev => {
      const btn = ev.target.closest && ev.target.closest("[data-a]"), a = btn && btn.dataset.a;
      if (a === "edit") return openForm(d);
      if (a === "del") { if (confirm(d.from ? "Go back to the original prompt?" : "Delete this prompt?")) { MINE = MINE.filter(m => m.id !== d.id); save(); renderLabels(); render(); toast(d.from ? "Restored" : "Deleted"); } return; }
      copy(d.text, r);
    };
    list.appendChild(r);
  });
  if (document.body.dataset.mode === "seeds") rows.slice(0, 8).forEach(({ d }, i) => makeResultSeed(d, i, color[d.category] || "#64748b"));
  setCur(0);
}
function setCur(i) {                                    // choose the highlighted result (arrow keys, seed clicks)
  const rows = [...document.querySelectorAll("#list .r")]; if (!rows.length) return;
  cur = Math.max(0, Math.min(rows.length - 1, i));
  rows.forEach((r, k) => { r.classList.toggle("cur", k === cur); r.setAttribute("aria-selected", k === cur); });
  rows[cur].scrollIntoView && rows[cur].scrollIntoView({ block: "nearest" });
  $("q").setAttribute("aria-activedescendant", rows[cur].id);
  $("box").style.setProperty("--c", rows[cur].style.getPropertyValue("--c"));
  RS.forEach(sd => sd.el.classList.toggle("sel", sd.i === cur));
  const m = document.body.dataset.mode, n = ctx.n;
  $("foot").textContent = m === "seeds" ? `${cur + 1} of ${n} · ↑ ↓ hop between seeds · Enter copy` + (n > RS.length ? ` · only the top ${RS.length} show as seeds, type more words to narrow` : "")
    : "↑ ↓ to move · Enter to copy · Esc to clear";
}

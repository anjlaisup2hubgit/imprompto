/* ---- Edit categories page: rename a category, move prompts between categories ---- */
/* Built for 1000+ prompts: one pass over the data per draw, one shared set of listeners, one category on screen at a time, 30 rows until "Show more". */
document.body.classList.add("edit");
const LIMIT = 30, keyOf = d => d.id;
const selected = new Set(), expanded = new Set(), cols = $("cols");
let byKey = new Map(), current = "";
const plural = n => n + " prompt" + (n === 1 ? "" : "s");

const rowHtml = d => `<label class="prompt" data-k="${esc(keyOf(d))}"><input type="checkbox"${selected.has(keyOf(d)) ? " checked" : ""}><b>${esc(d.title)}</b></label>`;

function draw() {
  const groups = new Map(), q = $("filter").value.trim().toLowerCase();
  byKey = new Map();
  all().forEach(d => { byKey.set(keyOf(d), d); (groups.get(d.category) || groups.set(d.category, []).get(d.category)).push(d); });
  [...selected].forEach(k => { if (!byKey.has(k)) selected.delete(k); });
  const names = [...groups.keys()].sort();
  if (!groups.has(current)) current = names[0] || "";
  $("tabs").innerHTML = names.map(n => `<button class="tab" type="button" data-name="${esc(n)}" aria-pressed="${n === current}">${esc(n)} · ${groups.get(n).length}</button>`).join("");
  const list = groups.get(current) || [], shown = q ? list.filter(d => d.title.toLowerCase().includes(q)) : list;
  const rows = expanded.has(current) ? shown : shown.slice(0, LIMIT), more = shown.length - rows.length;
  cols.innerHTML = current ? `<section class="col" data-name="${esc(current)}"><input class="cname" type="text" maxlength="30" value="${esc(current)}" aria-label="Category name">`
    + `<div class="cnt">${plural(list.length)}${q ? ` · ${shown.length} match` : ""}</div>${rows.map(rowHtml).join("")}`
    + (more > 0 ? `<button class="more" type="button">Show ${more} more</button>` : "") + `</section>` : '<div class="empty"><b>Nothing to organise yet</b>Save a prompt first, then come back to sort it into categories.<a href="/">Back to prompts</a></div>';
  $("bar").style.display = $("tabs").style.display = current ? "" : "none";
  $("dl").innerHTML = names.map(n => `<option value="${esc(n)}">`).join("");
  $("sel").textContent = selected.size + " selected";
}

function moveKeys(keys, dest) {
  const n = movePrompts(keys.map(k => byKey.get(k)).filter(Boolean), dest);
  if (!n) return toast("Nothing to move");
  keys.forEach(k => selected.delete(k));
  draw(); toast(`Moved ${plural(n)} to ${slug(dest)}`);
}

function commitName(input) {
  const col = input.closest(".col"), old = col.dataset.name, n = renameCategory(old, input.value);
  if (!n) { input.value = old; return; }
  if (expanded.delete(old)) expanded.add(slug(input.value));
  current = slug(input.value);
  draw(); toast(`Renamed ${plural(n)}`);
}

cols.addEventListener("change", e => {
  const row = e.target.closest(".prompt"); if (!row) return;
  e.target.checked ? selected.add(row.dataset.k) : selected.delete(row.dataset.k);
  $("sel").textContent = selected.size + " selected";
});
$("tabs").addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) { current = t.dataset.name; draw(); } });
cols.addEventListener("click", e => { const b = e.target.closest(".more"); if (b) { expanded.add(b.parentNode.dataset.name); draw(); } });
cols.addEventListener("focusout", e => { if (e.target.classList.contains("cname")) commitName(e.target); });
cols.addEventListener("keydown", e => {
  if (!e.target.classList.contains("cname")) return;
  if (e.key === "Escape") e.target.value = e.target.closest(".col").dataset.name;
  if (e.key === "Enter" || e.key === "Escape") e.target.blur();
});
$("filter").oninput = draw;
$("go").onclick = () => {
  if (!selected.size) return toast("Tick some prompts first");
  if (!slug($("dest").value)) return toast("Type a category to move them to");
  moveKeys([...selected], $("dest").value); $("dest").value = "";
};

/* sync.js calls these names when your prompts change (skip the redraw while you are typing a name) */
window.renderLabels = () => { if (!document.activeElement.classList.contains("cname")) draw(); };
function render() {}
addEventListener("storage", e => { if (e.key === KEY || e.key === null) { loadMine(); draw(); } });   // another tab changed things
draw();
sync();

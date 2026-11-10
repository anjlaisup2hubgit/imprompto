/* ---- the Trash button and window ---- */
function refreshTrashBadge() { const n = trashItems().length; $("tcount").textContent = n || ""; $("tcount").style.display = n ? "" : "none"; }
function showTrash() {
  const items = trashItems(), box = $("tlist"), colors = Object.fromEntries(catList().map(o => [o.c, o.color]));
  $("t-empty").style.display = items.length ? "" : "none";
  box.innerHTML = items.length ? "" : '<div class="tnone">Trash is empty</div>';
  items.forEach(m => {
    const days = Math.floor((Date.now() - m.deleted) / 864e5), when = days < 1 ? "today" : days === 1 ? "yesterday" : days + " days ago";
    const r = document.createElement("div"); r.className = "trow";
    r.innerHTML = `<div class="tinfo"><b><i style="background:${colors[m.category] || "#64748b"}"></i>${esc(m.title)}</b><span>${esc(m.category)} · deleted ${when}</span></div>
      <button class="btn main sm" data-a="restore">Restore</button><button class="act danger" data-a="purge">Delete forever</button>`;
    r.onclick = e => {
      const a = e.target.dataset && e.target.dataset.a; if (!a) return;
      if (a === "restore") { restorePrompt(m.id); toast("Restored"); } else purgePrompt(m.id);
      renderLabels(); render(); showTrash();
    };
    box.append(r);
  });
}
$("trashbtn").onclick = () => { showTrash(); showModal("trashmodal", "t-close"); };
$("t-close").onclick = closeModals;
$("t-empty").onclick = () => { if (confirm("Delete everything in the trash for good?")) { emptyTrash(); renderLabels(); render(); showTrash(); } };

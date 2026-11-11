let editing = null, editingTags = [];
function openForm(d) {
  editing = d ? d.id : null; editingTags = d ? d.tags : [];
  $("ftitle").textContent = editing ? "Edit prompt" : "New prompt";
  $("f-title").value = d ? d.title : ""; $("f-cat").value = d ? d.category : (cat && cat !== "*" ? cat : "");
  $("f-text").value = d ? d.text : "";
  $("ferr").textContent = ""; showAutoHints(); showModal("modal", "f-title");
}
const closeForm = closeModals;
function showAutoHints() {             // the boxes preview what will be filled in when they are left blank
  const text = $("f-text").value.trim();
  $("f-title").placeholder = text ? "Will be: " + autoTitle(text) : "Leave blank to fill in automatically";
  $("f-cat").placeholder = text ? "Will be: " + autoCategory(text) : "Leave blank to fill in automatically";
}
$("f-text").addEventListener("input", showAutoHints);
$("f-save").onclick = () => {
  const text = $("f-text").value.trim();
  if (!text) { $("ferr").textContent = "Please add the prompt text."; return; }
  const title = $("f-title").value.trim() || autoTitle(text);
  const c = clean({ title, text, category: $("f-cat").value.trim() || autoCategory(text), tags: editingTags });
  const old = editing && MINE.find(x => x.id === editing);
  if (old) Object.assign(old, c, { id: old.id }); else MINE.push(c);
  const ok = save();
  closeModals(); renderLabels(); render();
  toast(ok ? (editing ? "Prompt updated" : "Prompt saved") : "Added, but your browser blocked saving.");
};

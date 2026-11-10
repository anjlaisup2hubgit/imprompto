let editing = null;
function openForm(d) {
  editing = d && d.mine ? d.id : null;
  $("ftitle").textContent = editing ? "Edit prompt" : "New prompt";
  $("f-title").value = d ? d.title : ""; $("f-cat").value = d ? d.category : (cat && cat !== "*" ? cat : "");
  $("f-tags").value = d ? d.tags.join(", ") : ""; $("f-text").value = d ? d.text : "";
  $("ferr").textContent = ""; showModal("modal", "f-title");
}
const closeForm = closeModals;
$("f-save").onclick = () => {
  const title = $("f-title").value.trim(), text = $("f-text").value.trim();
  if (!title || !text) { $("ferr").textContent = "Please add a title and the prompt text."; return; }
  const c = clean({ title, text, category: $("f-cat").value, tags: $("f-tags").value.split(",") });
  const old = editing && MINE.find(x => x.id === editing);
  if (old) Object.assign(old, c, { id: old.id }); else MINE.push(c);
  const ok = save();
  closeModals(); renderLabels(); render();
  toast(ok ? (editing ? "Prompt updated" : "Prompt saved") : "Added, but your browser blocked saving.");
};

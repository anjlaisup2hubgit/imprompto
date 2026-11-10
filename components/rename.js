/* ---- the "Rename category" button above the results ---- */
$("rename").onclick = () => {
  const old = cat, name = prompt(`New name for “${old}”:`, old);
  if (name === null) return;
  const n = renameCategory(old, name);
  if (!n) return toast("Name not changed");
  cat = slug(name); renderLabels(); render(); toast(`Renamed ${n} prompt${n === 1 ? "" : "s"}`);
};

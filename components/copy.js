const move = step => setCur(cur + step);                // arrow keys
async function copy(text, row) {
  const cp = row.querySelector(".cp");
  try { await navigator.clipboard.writeText(text); cp.textContent = "Copied"; toast("Copied to clipboard"); }
  catch { cp.textContent = "Press Ctrl+C"; getSelection().selectAllChildren(row); }
  row.classList.add("done");
  setTimeout(() => { cp.textContent = "Copy"; row.classList.remove("done"); }, 1400);
}

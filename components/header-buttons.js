addEventListener("storage", e => { if (e.key === KEY || e.key === null) { loadMine(); renderLabels(); render(); } });   // another tab changed things
$("new").onclick = () => openForm(null);
$("sobtn").onclick = () => {
  if (lsGet(DIRTY) === "1" && !confirm("Some changes have not reached your account yet and will be lost if you sign out now. Sign out anyway?")) return;
  [KEY, BASE, DIRTY, OWNER].forEach(k => lsSet(k, null)); location.href = "/cdn-cgi/access/logout"; };

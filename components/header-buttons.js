addEventListener("storage", e => { if (e.key === KEY || e.key === null) { loadMine(); renderLabels(); render(); } });   // another tab changed things
$("new").onclick = () => openForm(null);
$("sobtn").onclick = () => { [KEY, BASE, DIRTY, OWNER].forEach(k => lsSet(k, null)); location.href = "/cdn-cgi/access/logout"; };

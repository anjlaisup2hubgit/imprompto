addEventListener("storage", e => { if (e.key === KEY || e.key === null) { loadMine(); renderLabels(); render(); } });   // another tab changed things
$("new").onclick = () => openForm(null);
document.querySelectorAll("#modes button").forEach(b => b.onclick = () => { mode = b.dataset.m; lsSet(MODEKEY, mode); fit(); render(); });
$("fsbtn").onclick = () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) {} };
["pointerdown", "keydown"].forEach(t => addEventListener(t, function go() { removeEventListener(t, go, true); try { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); } catch (e) {} }, true));   // browsers only allow full screen after a click or key press
$("sobtn").onclick = () => { [KEY, BASE, DIRTY, OWNER].forEach(k => lsSet(k, null)); location.href = "/cdn-cgi/access/logout"; };

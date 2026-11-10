let syncing = false, again = false, cloudOK = false;
async function sync() {
  if (syncing) { again = true; return; }
  syncing = true;
  try {
    for (let i = 0; i < 3; i++) {
      const r = await fetch("/api/data", { cache: "no-store" });
      if (!r.ok) return;                                   // no cloud (offline or not signed in): keep working locally
      const { data, updated, email } = await r.json();
      if (email && lsGet(OWNER) && lsGet(OWNER) !== email) { [KEY, BASE, DIRTY].forEach(k => lsSet(k, null)); MINE = []; }   // a different person signed in on this browser
      if (email) lsSet(OWNER, email);
      if (!cloudOK) { cloudOK = true; if (window.renderLabels) renderLabels(); }
      const remote = Array.isArray(data) ? data.map(clean).filter(Boolean) : null;
      const dirty = lsGet(DIRTY) === "1" || (lsGet(BASE) == null && MINE.length);
      if (remote && !dirty) { MINE = remote; lsSet(BASE, String(updated)); try { localStorage.setItem(KEY, JSON.stringify(MINE)); } catch (e) {} if (window.renderLabels) { renderLabels(); render(); } return; }
      if (remote && lsGet(BASE) !== String(updated)) for (const c of remote) if (!MINE.some(m => m.id === c.id)) MINE.push(c);   // keep prompts added on other devices
      const put = await fetch("/api/data", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ base: updated, data: MINE }) });
      if (put.ok) { lsSet(BASE, String((await put.json()).updated)); lsSet(DIRTY, null); try { localStorage.setItem(KEY, JSON.stringify(MINE)); } catch (e) {} if (window.renderLabels) { renderLabels(); render(); } return; }
      if (put.status !== 409) return;                      // otherwise a newer version appeared: look again
    }
  } catch (e) { /* offline: try again later */ }
  finally { syncing = false; if (again) { again = false; sync(); } }
}
addEventListener("online", sync);
document.addEventListener("visibilitychange", () => { if (!document.hidden) sync(); });

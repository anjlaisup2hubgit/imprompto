/* ---- first-visit tip ---- */
function seenIt() { try { return !!localStorage.getItem(SEEN); } catch (e) { return true; } }
function dismissCoach() { $("coach").classList.remove("show"); try { localStorage.setItem(SEEN, "1"); } catch (e) {} }
if (!seenIt()) $("coach").classList.add("show");
$("coach-ok").onclick = dismissCoach;

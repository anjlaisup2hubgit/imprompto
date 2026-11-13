document.body.append($("toast"));   // lives on the page itself (not the scaled stage) so phones always see it
function toast(msg, undo) {          // undo (optional): shows an Undo button for a few seconds
  const el = $("toast"); el.textContent = msg; el.classList.toggle("has-undo", !!undo);
  if (undo) { const b = document.createElement("button"); b.textContent = "Undo"; b.onclick = () => { undo(); el.classList.remove("show"); }; el.append(b); }
  el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), undo ? 6000 : 1900);
}

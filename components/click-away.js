/* ---- clicking on empty space closes the results ---- */
document.addEventListener("pointerdown", e => {
  if (!document.body.classList.contains("searching")) return;
  if (e.target.closest("#box,#bar,.lab,.seed,.chipbtn,.ov,.hbtn,#peek,#coach,#toast")) return;
  $("q").value = ""; cat = ""; render();
});

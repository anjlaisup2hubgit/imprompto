/* ---- renaming a category: every prompt inside it moves to the new name ---- */
function renameCategory(oldName, newName) {
  const name = slug(newName);
  if (!name || name === oldName) return 0;
  let n = 0;
  all().forEach(d => {
    if (d.category !== oldName) return;
    n++;
    if (d.mine) d.category = name;                                              // your own prompt: just change it
    else MINE.push(clean({ ...d, category: name, from: d.file }));              // a starter prompt: save a changed copy that hides the original
  });
  if (n) save();
  return n;
}

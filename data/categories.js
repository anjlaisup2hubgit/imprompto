/* moves any number of prompts to one category and saves only once */
function movePrompts(list, newName) {
  const name = slug(newName), moving = name ? list.filter(d => d.category !== name) : [];
  moving.forEach(d => d.category = name);
  if (moving.length) save();
  return moving.length;
}
/* renaming a category: every prompt inside it moves to the new name */
const renameCategory = (oldName, newName) => movePrompts(all().filter(d => d.category === oldName), newName);

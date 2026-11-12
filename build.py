import base64, pathlib

ROOT = pathlib.Path(__file__).parent

# The page is made of small files. The order matters: later files use things defined by earlier ones.
STYLES = ["components/base.css", "pages/home.css", "components/header-buttons.css", "components/petals.css",
          "components/seeds.css", "components/search-bar.css", "components/results-box.css", "components/dialog.css", "components/more-chips.css",
          "pages/mobile.css", "pages/layout-seeds.css", "components/trash.css", "components/glass.css", "components/holo.css", "components/settings-menu.css", "components/edit-mode.css"]
PAGE = ["pages/home.html"]
DIALOGS = ["components/prompt-dialog.html", "components/trash-dialog.html", "components/toast.html"]
SCRIPTS = ["data/prompts.js", "data/local-storage.js", "components/holo-shader.js", "data/picture.js", "data/sync.js", "data/categories.js", "data/trash.js", "components/dom-helpers.js",
           "components/state.js", "components/stage-fit.js", "components/petals.js", "components/sprigs.js",
           "components/sprig-motion.js", "components/bar-color.js", "components/holo.js", "components/picture-upload.js", "components/style-picker.js", "components/search.js", "components/sprig-filters.js", "pages/results.js",
           "components/copy.js", "components/coach.js", "components/keyboard.js", "components/click-away.js", "components/modal.js",
           "components/toast.js", "components/auto-fill.js", "pages/prompt-form.js", "components/header-buttons.js", "components/settings-menu.js", "components/edit-mode.js", "components/trash.js", "pages/home.js"]

EDIT_STYLES = ["components/base.css", "pages/edit-categories.css"]
EDIT_SCRIPTS = ["data/prompts.js", "data/local-storage.js", "data/sync.js", "data/categories.js", "components/dom-helpers.js",
                "components/toast.js", "pages/edit-categories.js"]

def join(files):
    return "".join((ROOT / f).read_text(encoding="utf-8") for f in files).rstrip("\n")

html = (ROOT / "template.html").read_text(encoding="utf-8")
for marker, files in (("__STYLES__", STYLES), ("__PAGE__", PAGE), ("__DIALOGS__", DIALOGS), ("__EDGE__", ["pages/edit-mode.html"]), ("__SCRIPTS__", SCRIPTS)):
    html = html.replace(marker, join(files))
html = html.replace("__FLOWER__", "data:image/webp;base64," + base64.b64encode((ROOT / "public" / "assets" / "flower.webp").read_bytes()).decode())   # inlined so the picture can never be blocked separately from the page
(ROOT / "public" / "index.html").write_text(html, encoding="utf-8")

edit = (ROOT / "edit-template.html").read_text(encoding="utf-8")       # the "Edit categories" page
for marker, files in (("__STYLES__", EDIT_STYLES), ("__PAGE__", ["pages/edit-categories.html"]), ("__SCRIPTS__", EDIT_SCRIPTS)):
    edit = edit.replace(marker, join(files))
(ROOT / "public" / "edit-categories.html").write_text(edit, encoding="utf-8")
print("built public/index.html and public/edit-categories.html")

/* ---- search bar colour: matches the picture on its own, or uses the colour picked with the colour picker ----
   barAvg = the picture's average colour [r, g, b] (or null); barColor (data/picture.js) = the picked colour (or "" for automatic) */
let barAvg = null;
const DEFAULT_BAR = [255, 196, 150];
const toRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = c => "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
const mixTo = (c, to, k) => c.map((v, i) => Math.round(v + (to[i] - v) * k));
function barAuto(im) {                                                // find the picture's main colour; colourful pixels count more than grey ones
  barAvg = null;
  if (im) try {
    const c = document.createElement("canvas"); c.width = c.height = 24;
    const x = c.getContext("2d"); x.drawImage(im, 0, 0, 24, 24);
    const d = x.getImageData(0, 0, 24, 24).data; let r = 0, g = 0, b = 0, w = 0;
    for (let i = 0; i < d.length; i += 4) {
      const k = d[i + 3] / 255 * (.15 + (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])) / 255);
      r += d[i] * k; g += d[i + 1] * k; b += d[i + 2] * k; w += k;
    }
    if (w > 0) barAvg = [r / w, g / w, b / w].map(Math.round);
  } catch (e) {}
  applyBarColor();
}
function applyBarColor() {
  const c = barColor ? toRgb(barColor) : barAvg, s = document.documentElement.style, names = ["--bar", "--bar-hi", "--bar-ink"];
  if (c) {                                                            // pastel version so the dark text stays easy to read
    [mixTo(c, [255, 255, 255], .3), mixTo(c, [255, 255, 255], .6), mixTo(c, [0, 0, 0], .62)].forEach((v, i) => s.setProperty(names[i], v.join(",")));
  } else names.forEach(n => s.removeProperty(n));
  $("barcolor").value = toHex(c || DEFAULT_BAR);
}
$("barcolor").oninput = e => { saveBarColor(e.target.value); applyBarColor(); };
$("barauto").onclick = () => { saveBarColor(""); applyBarColor(); };
applyBarColor();

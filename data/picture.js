/* ---- your own picture: saved on this device only ----
   The picture itself goes in IndexedDB (the browser's big storage, no tiny limit); only the dot positions go in localStorage.
   picture = { dots: { categoryName: [x, y] } }  or null when there is no picture */
const PIC = "promptlib.picture.v1";
let picture = (() => { try { return JSON.parse(localStorage.getItem(PIC)) || null; } catch (e) { return null; } })();
function savePicture() {
  try { picture ? localStorage.setItem(PIC, JSON.stringify(picture)) : localStorage.removeItem(PIC); return true; } catch (e) { return false; }
}
function withDot(cat, spot) {                         // a copy of the default spot, with the hand-placed dot and box if there are any
  const d = picture && picture.dots[cat], l = picture && picture.labels && picture.labels[cat];
  return { ...spot, ...(d ? { dx: d[0], dy: d[1] } : {}), ...(l ? { x: l[0], y: l[1] } : {}) };
}
function saveLabelSpot(cat, x, y) {                   // remember where the user dropped a category box
  picture = picture || { dots: {} }; (picture.labels = picture.labels || {})[cat] = [x, y]; savePicture();
}
const OFF = "promptlib.picoff.v1";                     // how far the whole picture was moved, e.g. {x:-161,y:23}; on this device only
let picOff = (() => { try { return JSON.parse(localStorage.getItem(OFF)) || { x: 0, y: 0 }; } catch (e) { return { x: 0, y: 0 }; } })();
function savePicOff() { try { localStorage.setItem(OFF, JSON.stringify(picOff)); } catch (e) {} }
function picStore(mode, fn) {                         // run one small job on the picture box in IndexedDB
  return new Promise((ok, no) => {
    const open = indexedDB.open("imprompto", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("pic");
    open.onerror = () => no(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction("pic", mode), req = fn(tx.objectStore("pic"));
      tx.oncomplete = () => ok(req.result); tx.onerror = tx.onabort = () => no(tx.error);
    };
  });
}
let picNow = null;                                    // this session's copy, so the picture still shows when the browser refuses to store it
const putPictureImage = blob => { picNow = blob; return picStore("readwrite", s => s.put(blob, "img")); };
const getPictureImage = () => picNow ? Promise.resolve(picNow) : picStore("readonly", s => s.get("img"));
const delPictureImage = () => { picNow = null; return picStore("readwrite", s => s.delete("img")); };
const PIC_STYLE = "promptlib.picstyle.v1";               // which look the picture has, e.g. "pixel"; on this device only
let picStyle = (() => { try { return localStorage.getItem(PIC_STYLE) || "holo"; } catch (e) { return "holo"; } })();
function savePicStyle(id) { picStyle = id; try { localStorage.setItem(PIC_STYLE, id); } catch (e) {} }
const picStyleIndex = () => Math.max(0, PIC_STYLES.findIndex(s => s.id === picStyle));
const BAR = "promptlib.barcolor.v1";                      // search bar colour the user picked, e.g. "#ffb070"; "" = match the picture
let barColor = (() => { try { return localStorage.getItem(BAR) || ""; } catch (e) { return ""; } })();
function saveBarColor(hex) { barColor = hex; try { hex ? localStorage.setItem(BAR, hex) : localStorage.removeItem(BAR); } catch (e) {} }

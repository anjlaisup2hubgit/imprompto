/* ---- sync: your prompts are also kept in the cloud so every device shares them ---- */
const BASE = "promptlib.base.v1", DIRTY = "promptlib.dirty.v1", OWNER = "promptlib.owner.v1";
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };

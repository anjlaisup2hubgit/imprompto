const mouse = { x: 0, y: 0, in: false };
const stagePt = e => { const r = $("stage").getBoundingClientRect(), sc = r.width / 1200; return { x: (e.clientX - r.left) / sc, y: (e.clientY - r.top) / sc }; };
addEventListener("pointermove", e => { const m = stagePt(e); mouse.x = m.x; mouse.y = m.y; mouse.in = true; });
document.addEventListener("pointerleave", () => mouse.in = false);
function startDrag(f, e) {                                           // drag a sprig; it springs back when you let go
  if (e.button !== 0 || isMobile()) return;
  const m = stagePt(e); f.drag = { gx: f.x - m.x, gy: f.y - m.y, sx: m.x, sy: m.y, on: false };
  f.moved = false;
  const move = ev => {
    const q = stagePt(ev), d = f.drag; if (!d) return;
    if (!d.on && Math.hypot(q.x - d.sx, q.y - d.sy) > 6) { d.on = true; f.b.classList.add("drag"); }
    if (d.on) { f.moved = true; d.tx = q.x + d.gx; d.ty = q.y + d.gy; }
  };
  const up = () => {
    removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up);
    f.b.classList.remove("drag"); f.drag = null;
    if (f.moved) setTimeout(() => f.moved = false, 0);               // swallow the click that ends a drag
  };
  addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
}
const calm = matchMedia("(prefers-reduced-motion:reduce)");
let last = 0;
function step(ms) {
  requestAnimationFrame(step);
  const dt = Math.min(2, (ms - last) / 16.7 || 1); last = ms;
  if (isMobile() || !floaters.length) return;
  const t = ms / 1000, searching = document.body.classList.contains("searching");
  for (const f of floaters) {
    f.amp += (((f.hold || searching || calm.matches) ? 0 : 1) - f.amp) * 0.08;                     // ease to rest / back
    if (f.drag && f.drag.on) { f.vx = (f.drag.tx - f.x) * 0.5; f.vy = (f.drag.ty - f.y) * 0.5; f.x = f.drag.tx; f.y = f.drag.ty; }
    else {
      let tx = f.p.x + (Math.sin(t * 0.55 + f.ph) * 9 + Math.sin(t * 0.23 + f.ph * 2) * 5) * f.amp;
      let ty = f.p.y + (Math.cos(t * 0.42 + f.ph) * 8 + Math.cos(t * 0.31 + f.ph * 3) * 4) * f.amp;
      if (mouse.in && !calm.matches) {                                                              // lean toward the cursor
        const dx = mouse.x - f.p.x, dy = mouse.y - f.p.y, d = Math.hypot(dx, dy) || 1, pull = Math.max(0, 1 - d / 420) * 14 * f.amp;
        tx += dx / d * pull; ty += dy / d * pull;
      }
      let ax = (tx - f.x) * 0.06, ay = (ty - f.y) * 0.06;                                           // spring home
      for (const g of floaters) if (g !== f) {                                                      // sprigs never overlap
        const dx = (f.x - g.x) / 175, dy = (f.y - g.y) / 62, d = Math.hypot(dx, dy);
        if (d < 1) { const u = (1 - d) / (d || 1) * 1.4; ax += dx * u; ay += dy * u; }
      }
      const damp = Math.pow(0.86, dt); f.vx = (f.vx + ax * dt) * damp; f.vy = (f.vy + ay * dt) * damp;
      f.x = clamp(f.x + f.vx * dt, 90, 1110); f.y = clamp(f.y + f.vy * dt, 110, 870);
    }
    f.b.style.left = f.x + "px"; f.b.style.top = f.y + "px";
    // the tendril: a curve that trails behind the motion
    const mx = (f.p.dx + f.x) / 2, my = (f.p.dy + f.y) / 2, nx = -(f.y - f.p.dy), ny = f.x - f.p.dx, nl = Math.hypot(nx, ny) || 1;
    const bend = (calm.matches ? 0 : Math.sin(t * 0.8 + f.ph) * 14) + clamp((f.vx * ny - f.vy * nx) / nl * -3, -40, 40);
    f.line.setAttribute("d", `M${f.p.dx} ${f.p.dy}Q${mx + nx / nl * bend} ${my + ny / nl * bend} ${f.x} ${f.y}`);
    // seeds: fan out away from the flower, trailing the sprig on springs (result seeds use the same fan, but wider)
    const act = f.rs.length ? f.rs : f.seeds, show = f.rs.length > 0 || f.peek || f.open, n = act.length, big = f.open || f.rs.length > 0;
    const rs_ = f.rs.length > 0, rx = rs_ ? 200 : big ? 175 : 150, ry = rs_ ? 175 : big ? 140 : 115, spread = 3.2;
    if (show) {                                                      // aim the fan at the side with the most free room
      const base = Math.atan2((f.y - 450) * 0.25, f.x - 781); let best = base, pen = 1e9;
      for (let k = 0; k <= 24; k++) {
        const off = ((k + 1) >> 1) * 0.25 * (k % 2 ? 1 : -1), a0 = base + off; let bad = 0;
        for (let i = 0; i < n; i++) {
          const a = a0 + (n > 1 ? ((i + 0.5) / n - 0.5) * spread : 0), x = f.x + Math.cos(a) * rx, y = f.y + Math.sin(a) * ry;
          bad += Math.max(0, 100 - x) + Math.max(0, x - 1090) + Math.max(0, 125 - y) + Math.max(0, y - 850);
        }
        if (bad + Math.abs(off) * 6 < pen) { pen = bad + Math.abs(off) * 6; best = a0; }
      }
      f.cx = (f.cx === undefined ? Math.cos(best) : f.cx + (Math.cos(best) - f.cx) * 0.08);
      f.cy = (f.cy === undefined ? Math.sin(best) : f.cy + (Math.sin(best) - f.cy) * 0.08);
    }
    const out = Math.atan2(f.cy || 0, f.cx === undefined ? 1 : f.cx);
    f.seeds.concat(f.rs).forEach(sd => {
      const i = act.indexOf(sd), on = show && i >= 0;
      const ang = out + (n > 1 ? ((i + 0.5) / n - 0.5) * spread : 0) + (calm.matches ? 0 : Math.sin(t * 0.5 + i * 1.3) * 0.08);
      const kk = rs_ && n > 4 && i % 2 ? 1.45 : 1;                                                  // crowded sprig: alternate two rings
      let ax = ((on ? f.x + Math.cos(ang) * rx * kk : f.x) - sd.x) * 0.09, ay = ((on ? f.y + Math.sin(ang) * ry * kk : f.y) - sd.y) * 0.09;
      if (on) {
        for (const o of act) if (o !== sd) {                                                        // seeds keep apart
          const wide = rs_ ? 170 : big ? 105 : 34, dx = (sd.x - o.x) / wide, dy = (sd.y - o.y) / (rs_ ? 44 : 36), d = Math.hypot(dx, dy);
          if (d < 1) { const u = (1 - d) / (d || 1) * (rs_ ? 2.4 : 1.2); ax += dx * u; ay += dy * u; }
        }
        for (const g of floaters) if (g !== f) {                                                    // ...and away from other sprigs
          const dx = (sd.x - g.x) / 130, dy = (sd.y - g.y) / 50, d = Math.hypot(dx, dy);
          if (d < 1) { const u = (1 - d) / (d || 1) * 1.2; ax += dx * u; ay += dy * u; }
        }
      }
      const damp = Math.pow(0.8, dt); sd.vx = (sd.vx + ax * dt) * damp; sd.vy = (sd.vy + ay * dt) * damp;
      const hw = sd.i === undefined ? 0 : sd.el.offsetWidth / 2; sd.x = clamp(sd.x + sd.vx * dt, hw ? hw + 8 : 100, hw ? 1192 - hw : 1100); sd.y = clamp(sd.y + sd.vy * dt, 115, 870);
      sd.el.style.left = sd.x + "px"; sd.el.style.top = sd.y + "px";
      sd.link.setAttribute("x1", f.x); sd.link.setAttribute("y1", f.y); sd.link.setAttribute("x2", sd.x); sd.link.setAttribute("y2", sd.y);
    });
  }
}
requestAnimationFrame(step);

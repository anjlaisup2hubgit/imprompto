/* ---- styled picture: draws the user's picture in the chosen look (the looks live in holo-shader.js) ---- */
const HOLO_VERT = "attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
const holoEl = $("holo");
let hgl = null, hU = {}, hRun = false;
function holoSetup() {
  hgl = holoEl.getContext("webgl", { premultipliedAlpha: false });
  if (!hgl) return false;
  const sh = (type, src) => { const s = hgl.createShader(type); hgl.shaderSource(s, src); hgl.compileShader(s); return s; };
  const pr = hgl.createProgram(); hgl.attachShader(pr, sh(hgl.VERTEX_SHADER, HOLO_VERT)); hgl.attachShader(pr, sh(hgl.FRAGMENT_SHADER, HOLO_FRAG));
  hgl.linkProgram(pr); hgl.useProgram(pr);
  hgl.bindBuffer(hgl.ARRAY_BUFFER, hgl.createBuffer()); hgl.bufferData(hgl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), hgl.STATIC_DRAW);
  const loc = hgl.getAttribLocation(pr, "p"); hgl.enableVertexAttribArray(loc); hgl.vertexAttribPointer(loc, 2, hgl.FLOAT, false, 0, 0);
  ["t", "asp", "imgAsp", "lean", "mode"].forEach(n => hU[n] = hgl.getUniformLocation(pr, n));
  hgl.bindTexture(hgl.TEXTURE_2D, hgl.createTexture());
  [[hgl.TEXTURE_WRAP_S, hgl.CLAMP_TO_EDGE], [hgl.TEXTURE_WRAP_T, hgl.CLAMP_TO_EDGE], [hgl.TEXTURE_MIN_FILTER, hgl.LINEAR], [hgl.TEXTURE_MAG_FILTER, hgl.LINEAR]]
    .forEach(([k, v]) => hgl.texParameteri(hgl.TEXTURE_2D, k, v));
  return true;
}
function holoShow(src) {                                              // turn the picture holographic and put it where the flower was
  const im = new Image();
  im.onload = () => {
    if (!hgl && !holoSetup()) return;
    holoEl.width = 1122; holoEl.height = 1067; hgl.viewport(0, 0, 1122, 1067);
    hgl.texImage2D(hgl.TEXTURE_2D, 0, hgl.RGBA, hgl.RGBA, hgl.UNSIGNED_BYTE, im);
    hgl.uniform1f(hU.asp, 1122 / 1067); hgl.uniform1f(hU.imgAsp, im.width / im.height);
    document.body.classList.add("pic"); barAuto(im);
    if (!hRun) { hRun = true; requestAnimationFrame(holoFrame); }
  };
  im.src = src;
}
function holoHide() { document.body.classList.remove("pic"); barAuto(null); }
function holoFrame(ms) {
  if (!document.body.classList.contains("pic")) { hRun = false; return; }
  requestAnimationFrame(holoFrame);
  const k = calm.matches ? 0 : 1;
  hgl.uniform1f(hU.t, k ? ms / 1000 : 3); hgl.uniform1f(hU.mode, picStyleIndex());
  hgl.uniform2f(hU.lean, k && mouse.in ? clamp((mouse.x - 781) / 400, -1, 1) : 0, k && mouse.in ? clamp((mouse.y - 450) / 400, -1, 1) : 0);
  hgl.drawArrays(hgl.TRIANGLE_STRIP, 0, 4);
  holoEl.style.translate = flw.x + "px " + flw.y + "px";             // sways with the flower's motion
}

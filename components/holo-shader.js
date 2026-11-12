/* ---- the picture styles: one tiny program per look (a shader runs on the graphics card and recolours every pixel) ----
   PIC_STYLES lists them in order; the position in the list is the number the shader uses to pick a look. */
const PIC_STYLES = [
  { id: "holo", name: "Holographic" }, { id: "pixel", name: "Pixel art" }, { id: "halftone", name: "Halftone dots" },
  { id: "ascii", name: "ASCII text" }, { id: "glitch", name: "Glitch / VHS" }, { id: "watercolor", name: "Watercolor" },
  { id: "neon", name: "Neon outline" }, { id: "duotone", name: "Duotone" }, { id: "sketch", name: "Sketch" }
];
const HOLO_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 uv; uniform sampler2D tex; uniform float t, asp, imgAsp, mode; uniform vec2 lean;
vec2 cover(vec2 u){ float r = imgAsp / asp; return r > 1. ? vec2((u.x - .5) / r + .5, u.y) : vec2(u.x, (u.y - .5) * r + .5); }
vec4 px(vec2 u){ return texture2D(tex, cover(u)); }
float lum(vec3 c){ return dot(c, vec3(.3, .59, .11)); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
float edge(vec2 u, float w){                                          // how sharply the picture changes here (outlines)
  vec2 e = vec2(w / 1122., w / 1067.);
  float gx = lum(px(u + vec2(e.x, 0.)).rgb) - lum(px(u - vec2(e.x, 0.)).rgb);
  float gy = lum(px(u + vec2(0., e.y)).rgb) - lum(px(u - vec2(0., e.y)).rgb);
  return length(vec2(gx, gy)); }

vec4 sHolo(){                                                         // the flower's look: sliding slices, drifting colours, pearly tint
  float b = floor(uv.y * 44.);
  float wob = sin(b * 1.7 + t * .9) * .5 + sin(b * .63 - t * .6) * .5;
  float amt = .012 + .02 * abs(sin(b * .37 + t * .2));
  vec2 u = uv + vec2(wob * amt + lean.x * .015, 0.);
  float ca = .006 + .004 * sin(t + b);
  vec3 c = vec3(px(u + vec2(ca, 0.)).r, px(u).g, px(u - vec2(ca, 0.)).b);
  float l = lum(c);
  vec3 rain = .5 + .5 * cos(6.2832 * (vec3(0., .33, .67) + uv.y * 1.5 + l * 1.2 + t * .05 + lean.y * .1));
  c = mix(c, mix(vec3(.82, .74, 1.), rain, .65), .38);
  c = mix(c, vec3(1.), .1) + pow(.5 + .5 * sin(b * 2. + t * 1.3 + uv.x * 4.), 8.) * .16;
  return vec4(c, px(u).a); }

vec4 sPixel(){                                                        // big square pixels, few colours
  vec2 n = vec2(72., 72. / asp); vec4 s = px((floor(uv * n) + .5) / n);
  return vec4(floor(s.rgb * 5. + .5) / 5., s.a); }

vec4 sHalftone(){                                                     // newspaper dots: darker spots get bigger dots
  vec2 n = vec2(80., 80. / asp), g = uv * n; vec4 s = px((floor(g) + .5) / n);
  float r = sqrt(1. - lum(s.rgb)) * .72, ink = 1. - smoothstep(r - .12, r, length(fract(g) - .5));
  return vec4(mix(vec3(.99, .97, .93), s.rgb * .8, ink), s.a); }

vec4 sAscii(){                                                        // letters-like marks: . - + # from light to dark
  vec2 n = vec2(96., 48. / asp), g = uv * n, f = fract(g) - .5; vec4 s = px((floor(g) + .5) / n);
  float l = lum(s.rgb), bar = step(abs(f.y), .07) * step(abs(f.x), .32), bar2 = step(abs(f.x), .07) * step(abs(f.y), .32), m = 0.;
  if (l > .15) m = 1. - smoothstep(.1, .16, length(f));
  if (l > .3) m = bar;
  if (l > .5) m = max(bar, bar2);
  if (l > .7) m = max(step(abs(abs(f.y) - .16), .06) * step(abs(f.x), .34), step(abs(abs(f.x) - .16), .06) * step(abs(f.y), .34));
  return vec4(mix(vec3(.05, .04, .12), mix(vec3(.45, 1., .75), s.rgb, .5), m), s.a); }

vec4 sGlitch(){                                                       // old video tape: rows jump sideways, colours split, noise
  float row = floor(uv.y * 40.), tk = floor(t * 7.), r = hash(vec2(row, tk)), big = step(.93, hash(vec2(row * .1, tk)));
  float sh = (r - .5) * .06 * step(.8, r) + (hash(vec2(row, tk + 5.)) - .5) * .25 * big;
  vec2 u = uv + vec2(sh, 0.); float ca = .004 + .02 * big;
  vec3 c = vec3(px(u + vec2(ca, 0.)).r, px(u).g, px(u - vec2(ca, 0.)).b);
  c *= .9 + .1 * sin(uv.y * 900.); c += (hash(uv * 300. + t) - .5) * .12;
  return vec4(c, px(u).a); }

vec4 sWater(){                                                        // wobbly, soft, washed-out paint on paper
  vec2 u = uv + (vec2(noise(uv * 9.), noise(uv * 9. + 7.)) - .5) * .025; vec4 s = vec4(0.);
  for (int i = 0; i < 8; i++){ float k = float(i) * .785; s += px(u + vec2(cos(k), sin(k)) * .007); }
  s /= 8.; vec3 c = mix(s.rgb, floor(s.rgb * 7. + .5) / 7., .5);
  c = mix(c, vec3(1.), .22) * (.94 + .06 * noise(uv * 260.)) * (1. - edge(u, 3.) * .8);
  return vec4(c, s.a); }

vec4 sNeon(){                                                         // glowing coloured outlines on a dark background
  float e = edge(uv, 1.5) * 5. + edge(uv, 6.) * 3.; vec4 s = px(uv);
  vec3 neon = .5 + .5 * cos(6.2832 * (vec3(0., .33, .67) + uv.x * .6 + uv.y * .4 + t * .08));
  return vec4(vec3(.04, .03, .1) + neon * clamp(e, 0., 1.4) + s.rgb * .12, s.a); }

vec4 sDuo(){                                                          // only two colours, dark to light
  vec4 s = px(uv);
  return vec4(mix(vec3(.17, .1, .42), vec3(1., .74, .55), smoothstep(.08, .92, lum(s.rgb))), s.a); }

vec4 sSketch(){                                                       // pencil outlines and criss-cross shading on paper
  vec4 s = px(uv); float l = lum(s.rgb), line = smoothstep(.03, .14, edge(uv, 1.5));
  float h1 = step(.5, fract((uv.x + uv.y) * 130.)) * step(l, .5), h2 = step(.5, fract((uv.x - uv.y) * 130.)) * step(l, .3);
  float ink = max(line, max(h1, h2) * .55);
  vec3 paper = mix(vec3(.98, .96, .9), s.rgb, .18) * (.95 + .05 * noise(uv * 300.));
  return vec4(mix(paper, vec3(.15, .13, .22), ink), s.a); }

void main(){
  vec4 c;
  if (mode < .5) c = sHolo();
  else if (mode < 1.5) c = sPixel();
  else if (mode < 2.5) c = sHalftone();
  else if (mode < 3.5) c = sAscii();
  else if (mode < 4.5) c = sGlitch();
  else if (mode < 5.5) c = sWater();
  else if (mode < 6.5) c = sNeon();
  else if (mode < 7.5) c = sDuo();
  else c = sSketch();
  gl_FragColor = c;
}`;

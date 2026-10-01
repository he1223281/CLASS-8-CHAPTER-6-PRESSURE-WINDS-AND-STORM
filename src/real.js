/* ============ Realistic rendering layer ============
   Procedural noise textures (simplex fBm) baked once into offscreen canvases,
   then reused every frame. Overrides the simpler shapes in draw.js. */
const NZ = (() => {
  const perm = new Uint8Array(512), R = rng(20240607), p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const gx = [1, -1, 1, -1, 1, -1, 0, 0], gy = [1, 1, -1, -1, 0, 0, 1, -1];
  const F2 = .5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  function s2(xin, yin) {
    const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s);
    const t = (i + j) * G2, x0 = xin - (i - t), y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n = 0, tt;
    tt = .5 - x0 * x0 - y0 * y0; if (tt > 0) { const g = perm[ii + perm[jj]] & 7; tt *= tt; n += tt * tt * (gx[g] * x0 + gy[g] * y0); }
    tt = .5 - x1 * x1 - y1 * y1; if (tt > 0) { const g = perm[ii + i1 + perm[jj + j1]] & 7; tt *= tt; n += tt * tt * (gx[g] * x1 + gy[g] * y1); }
    tt = .5 - x2 * x2 - y2 * y2; if (tt > 0) { const g = perm[ii + 1 + perm[jj + 1]] & 7; tt *= tt; n += tt * tt * (gx[g] * x2 + gy[g] * y2); }
    return 70 * n;
  }
  function fbm(x, y, o = 5) { let a = .5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * s2(x * f, y * f); f *= 2.03; a *= .5; } return s; }
  return { s2, fbm };
})();
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

/* ---------- tileable grayscale textures for overlay shading ---------- */
const TEXDEF = {
  grain: (x, y) => NZ.fbm(x / 26, y / 26, 4) * 1.1 + (Math.random() - .5) * .25,
  speck: (x, y) => NZ.fbm(x / 9, y / 9, 3) * .6 + (Math.random() - .5) * .9,
  bark: (x, y) => NZ.fbm(x / 2.5, y / 34, 4) * 1.4,
  wood: (x, y) => NZ.fbm(x / 70, y / 2.2, 4) * 1.3 + NZ.s2(x / 200, y / 30) * .4,
  plaster: (x, y) => NZ.fbm(x / 7, y / 7, 4) * .7 + (Math.random() - .5) * .18,
  skin: (x, y) => NZ.fbm(x / 5, y / 5, 4) * .8 + NZ.fbm(x / 30, y / 12, 3) * .6,
};
const TEXC = {};
function texCanvas(kind) {
  if (TEXC[kind]) return TEXC[kind];
  const S = 256, cv = mkCanvas(S, S), c = cv.getContext('2d'), img = c.createImageData(S, S), f = TEXDEF[kind];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    // blend 4 shifted samples so the tile repeats without seams
    const a = (S - x) * (S - y), b = x * (S - y), d = (S - x) * y, e = x * y;
    const v = (f(x, y) * a + f(x - S, y) * b + f(x, y - S) * d + f(x - S, y - S) * e) / (S * S);
    const g = clamp(128 + v * 110, 0, 255), i = (y * S + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = g; img.data[i + 3] = 255;
  }
  c.putImageData(img, 0, 0); TEXC[kind] = cv; return cv;
}
const PATC = new WeakMap();
function pat(c, kind) {
  let m = PATC.get(c); if (!m) { m = {}; PATC.set(c, m); }
  return m[kind] || (m[kind] = c.createPattern(texCanvas(kind), 'repeat'));
}
// overlay a texture onto whatever is already painted inside (x,y,w,h) or the current clip
D.tex = function (c, x, y, w, h, kind = 'grain', alpha = .35, scale = 1, mode = 'overlay') {
  c.save(); c.globalAlpha *= alpha; c.globalCompositeOperation = mode;
  c.translate(x, y); c.scale(scale, scale); c.fillStyle = pat(c, kind); c.fillRect(0, 0, w / scale, h / scale); c.restore();
};

/* ---------- sky with horizon haze ---------- */
const _sky = D.sky;
D.sky = function (c, x, y, w, h, top, bot) {
  _sky(c, x, y, w, h, top, bot);
  const g = c.createLinearGradient(0, y + h * .55, 0, y + h);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(235,240,248,.22)');
  c.fillStyle = g; c.fillRect(x, y + h * .55, w, h * .45);
};

/* ---------- volumetric clouds ---------- */
const CLD = new Map(), CLS = new Map();
function cloudDensity(seed, type) {
  const key = seed + type; if (CLD.has(key)) return CLD.get(key);
  const R = rng(seed * 131 + 7), puffs = [];
  let W = 300, H = 170;
  if (type === 'cb') {
    W = 300; H = 360;
    for (let i = 0; i < 9; i++) { const v = i / 8; const r = W * (.16 + .05 * Math.sin(v * 3) + R() * .03); puffs.push([W * (.5 + (R() - .5) * .18), H * (.9 - v * .62), r, r * .95]); }
    for (let i = 0; i < 9; i++) { const u = i / 8; puffs.push([W * (.08 + u * .84), H * (.16 + (R() - .5) * .04), W * (.11 + R() * .04), H * .06]); }
    puffs.push([W * .5, H * .2, W * .2, H * .1]);
  } else if (type === 'st') {
    W = 360; H = 150;
    for (let i = 0; i < 12; i++) { const u = R(); puffs.push([W * (.06 + u * .88), H * (.42 + R() * .25), W * (.09 + R() * .1), H * (.2 + R() * .18)]); }
  } else {
    const n = 6 + Math.floor(R() * 3);
    for (let i = 0; i < n; i++) { const u = .16 + R() * .68, hump = Math.sin(u * Math.PI); const rx = W * (.11 + .1 * hump + R() * .05); puffs.push([W * u, H * .8 - rx * (.4 + hump * .55 + R() * .2), rx, rx * (.85 + R() * .25)]); }
    puffs.push([W * .5, H * .74, W * .36, H * .2]);
  }
  const d = new Float32Array(W * H), off = R() * 100;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let m = -1;
    for (const p of puffs) { const dx = (x - p[0]) / p[2], dy = (y - p[1]) / p[3]; const q = 1 - Math.sqrt(dx * dx + dy * dy); if (q > m) m = q; }
    m += .26 * NZ.fbm(x / 70 + off, y / 70 + off * .7, 3) + .07 * NZ.fbm(x / 18 + off, y / 18, 2);
    if (type !== 'cb') m *= clamp((.97 - y / H) / .16, 0, 1);
    const ex = Math.min(x, W - 1 - x) / (W * .08), ey = Math.min(y, H - 1 - y) / (H * .08);
    const ef = sstep(0, 1, Math.min(ex, ey)); m = m * ef - (1 - ef) * .2;
    d[y * W + x] = m;
  }
  const G = { W, H, d }; CLD.set(key, G); return G;
}
function cloudTex(seed, type, storm) {
  const key = seed + type + (storm ? 's' : 'l'); if (CLS.has(key)) return CLS.get(key);
  const { W, H, d } = cloudDensity(seed, type);
  const cv = mkCanvas(W, H), c = cv.getContext('2d'), img = c.createImageData(W, H), px = img.data;
  const L = storm ? [150, 158, 172] : [255, 252, 246], S = storm ? [34, 40, 50] : [112, 126, 148];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, m = d[i], a = sstep(.0, .3, m);
    if (a <= 0) continue;
    const ml = d[Math.max(0, y - 12) * W + Math.max(0, x - 8)];
    let lit = .6 + (m - ml) * 1.8;
    if (m < .14) lit += .18 * (1 - m / .14);           // bright silver edges
    lit *= 1 - .5 * Math.pow(y / H, 2) * (type === 'cb' ? 1.3 : 1);
    lit = clamp(lit, 0, 1);
    const k = i * 4;
    px[k] = S[0] + (L[0] - S[0]) * lit; px[k + 1] = S[1] + (L[1] - S[1]) * lit; px[k + 2] = S[2] + (L[2] - S[2]) * lit; px[k + 3] = a * 255;
  }
  c.putImageData(img, 0, 0);
  const out = mkCanvas(W, H), o2 = out.getContext('2d'); o2.filter = 'blur(1.2px)'; o2.drawImage(cv, 0, 0);
  CLS.set(key, out); return out;
}
D.cloud = function (c, x, y, w, h, o = {}) {
  const type = o.type || 'cu', seed = o.seed || 1, dark = clamp(o.dark || 0, 0, 1), a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a;
  if (dark < .98) c.drawImage(cloudTex(seed, type, false), x - w / 2, y - h / 2, w, h);
  if (dark > .02) { c.globalAlpha = a * dark; c.drawImage(cloudTex(seed, type, true), x - w / 2, y - h / 2, w, h); }
  c.restore();
};

/* ---------- ground with texture & grass ---------- */
const GRASS = new Map();
function grassStrip(col) {
  if (GRASS.has(col)) return GRASS.get(col);
  const W = 400, H = 30, cv = mkCanvas(W, H), c = cv.getContext('2d'), R = rng(77);
  for (let i = 0; i < 900; i++) {
    const x = R() * W, h = 6 + R() * 22, lean = (R() - .5) * 6;
    c.strokeStyle = mix(col, R() < .5 ? '#000000' : '#ffffff', R() * .3); c.lineWidth = 1 + R();
    c.beginPath(); c.moveTo(x, H); c.quadraticCurveTo(x + lean * .3, H - h * .6, x + lean, H - h); c.stroke();
  }
  GRASS.set(col, cv); return cv;
}
D.ground = function (c, x, y, w, h, o = {}) {
  const top = o.top || '#6d8f3c';
  const g = c.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top); g.addColorStop(.12, o.mid || mix(top, '#000000', .2)); g.addColorStop(1, o.bot || '#3a2d1c');
  c.fillStyle = g; c.fillRect(x, y, w, h);
  D.tex(c, x, y, w, h, 'grain', .55, 1.4);
  D.tex(c, x, y, w, h, 'speck', .25);
  if (o.grass !== false) { const s = grassStrip(top); for (let gx = x - (x % 400); gx < x + w; gx += 400) c.drawImage(s, gx, y - 24); }
};
D.sand = function (c, x, y, w, h, col = '#d9b77a') {
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, mix(col, '#ffffff', .12)); g.addColorStop(1, mix(col, '#000000', .3));
  c.fillStyle = g; c.fillRect(x, y, w, h); D.tex(c, x, y, w, h, 'speck', .5); D.tex(c, x, y, w, h, 'grain', .3, 2);
};
// layered hills / mountains with atmospheric haze
D.hills = function (c, W, baseY, o = {}) {
  const layers = o.layers || 3, far = o.far || '#8aa3b8', near = o.near || '#4f6b3a', seed = o.seed || 3;
  for (let L = 0; L < layers; L++) {
    const k = L / Math.max(1, layers - 1), col = mix(far, near, k), amp = (o.amp || 90) * (1 - k * .45), yb = baseY + L * (o.step || 22);
    c.fillStyle = col; c.beginPath(); c.moveTo(0, yb + 200);
    for (let x = 0; x <= W; x += 12) c.lineTo(x, yb - amp * (.55 + .45 * NZ.fbm(x / 420 + seed * 3 + L * 7, L * 1.3, 4)) );
    c.lineTo(W, yb + 400); c.lineTo(0, yb + 400); c.closePath(); c.fill();
    c.save(); c.clip(); D.tex(c, 0, yb - amp * 1.5, W, amp * 2 + 400, 'grain', .25 + k * .2, 2); c.restore();
  }
};

/* ---------- water ---------- */
let RIPPLE = null;
function rippleTex() {
  if (RIPPLE) return RIPPLE;
  const W = 512, H = 128, cv = mkCanvas(W, H), c = cv.getContext('2d'), img = c.createImageData(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const a = (W - x) / W, b = x / W;
    const n = NZ.fbm(x / 70, y / 5, 4) * a + NZ.fbm((x - W) / 70, y / 5, 4) * b;
    const i = (y * W + x) * 4;
    if (n > .12) { img.data[i] = 230; img.data[i + 1] = 242; img.data[i + 2] = 255; img.data[i + 3] = clamp((n - .12) * 500, 0, 150); }
    else if (n < -.2) { img.data[i] = 5; img.data[i + 1] = 25; img.data[i + 2] = 45; img.data[i + 3] = clamp((-.2 - n) * 300, 0, 90); }
  }
  c.putImageData(img, 0, 0); RIPPLE = cv; return cv;
}
D.sea = function (c, x, y, w, h, t, o = {}) {
  const night = o.night || 0;
  const g = c.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, mix(o.top || '#6aa6cf', '#1c3552', night)); g.addColorStop(.25, mix(o.top || '#2e78b0', '#132a45', night)); g.addColorStop(1, mix(o.bot || '#0a3560', '#05101f', night));
  c.fillStyle = g; c.fillRect(x, y, w, h);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const tex = rippleTex();
  // two bands: compressed far ripples near the horizon, larger ones close up
  const bands = [[0, .35, .35], [.3, 1, .8]];
  for (const [a, b, sc] of bands) {
    const by = y + h * a, bh = h * (b - a), tw = 512 * sc * 1.6, th = 128 * sc;
    c.globalAlpha = (1 - night * .6) * (a ? .9 : .7);
    const off = ((t || 0) * 30 * sc) % tw;
    for (let yy = by; yy < by + bh; yy += th) for (let xx = x - off; xx < x + w; xx += tw) c.drawImage(tex, xx, yy, tw, th);
  }
  c.restore();
  c.fillStyle = `rgba(255,255,255,${.25 - night * .15})`; c.fillRect(x, y, w, 2);
};

/* ---------- trees ---------- */
const TREEC = new Map();
function treeTex(seed, dark) {
  const key = seed + (dark ? 'd' : 'l'); if (TREEC.has(key)) return TREEC.get(key);
  const W = 300, H = 260, cv = mkCanvas(W, H), c = cv.getContext('2d'), R = rng(seed * 53 + 11);
  const blobs = []; for (let i = 0; i < 7; i++) blobs.push([150 + (R() - .5) * 120, 130 + (R() - .5) * 90 - (i === 0 ? 20 : 0), 55 + R() * 45, 45 + R() * 40]);
  const inside = (x, y) => { let m = 0; for (const b of blobs) { const dx = (x - b[0]) / b[2], dy = (y - b[1]) / b[3]; const q = 1 - (dx * dx + dy * dy); if (q > m) m = q; } return m; };
  const pal = dark ? ['#0d1c0e', '#1f3a1c', '#3d5e30'] : ['#183418', '#3e6b2a', '#93b85a'];
  const leaves = [];
  for (let i = 0; i < 2400; i++) {
    const x = R() * W, y = R() * H, q = inside(x, y); if (q <= 0) continue;
    const light = clamp(.45 + ((150 - x) * .35 + (90 - y) * .9) / 260 + (1 - q) * .35 + (R() - .5) * .4, 0, 1);
    leaves.push([x, y, light]);
  }
  leaves.sort((a, b) => a[2] - b[2]);
  for (const [x, y, l] of leaves) {
    const col = l < .5 ? mix(pal[0], pal[1], l * 2) : mix(pal[1], pal[2], (l - .5) * 2);
    c.fillStyle = col;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(x + (R() - .5) * 8, y + (R() - .5) * 6, 2.5 + R() * 3, 1.8 + R() * 2.2, R() * 3, 0, TAU); c.fill(); }
  }
  c.globalCompositeOperation = 'source-atop';
  const g = c.createLinearGradient(0, 60, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  TREEC.set(key, cv); return cv;
}
D.tree = function (c, x, y, h, bend = 0, seed = 1, o = {}) {
  const topX = x + bend * h * .22, topY = y - h * .56, tw = h * .06;
  c.save();
  // ground shadow
  c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(x + h * .08, y, h * .32, h * .04, 0, 0, TAU); c.fill();
  // trunk + branches
  c.beginPath(); c.moveTo(x - tw * 1.3, y); c.quadraticCurveTo(x - tw * .6 + bend * h * .05, y - h * .3, topX - tw * .35, topY);
  c.lineTo(topX + tw * .35, topY); c.quadraticCurveTo(x + tw * .7 + bend * h * .05, y - h * .3, x + tw * 1.3, y); c.closePath();
  const g = c.createLinearGradient(x - tw, 0, x + tw, 0); g.addColorStop(0, '#2c1d12'); g.addColorStop(.45, '#6b513a'); g.addColorStop(1, '#24170e');
  c.fillStyle = g; c.fill(); c.save(); c.clip(); D.tex(c, x - tw * 2, topY - 10, tw * 4, h, 'bark', .7); c.restore();
  c.strokeStyle = '#3a281a'; c.lineCap = 'round';
  [[-.9, .55], [.8, .5], [-.2, .85]].forEach(([dx, dy], i) => { c.lineWidth = tw * (.5 - i * .1); c.beginPath(); c.moveTo(topX, topY + h * .06); c.quadraticCurveTo(topX + dx * h * .1, topY - h * .02, topX + dx * h * .2 + bend * h * .05, topY - dy * h * .2); c.stroke(); });
  // canopy
  const cw = h * .98, ch = h * .85;
  c.translate(topX + bend * h * .08, topY - h * .12); c.rotate(bend * .16);
  c.drawImage(treeTex(seed, o.dark), -cw / 2, -ch * .6, cw, ch);
  c.restore();
};
D.palm = function (c, x, y, h, bend = 0, seed = 1) {
  c.save();
  const tx = x + bend * h * .35, ty = y - h, cx = x - h * .08 + bend * h * .05, cy = y - h * .55;
  // trunk: tapered, ringed
  const N = 18;
  for (let i = 0; i < N; i++) {
    const t0 = i / N, t1 = (i + 1) / N;
    const p = t => [(1 - t) * (1 - t) * x + 2 * (1 - t) * t * cx + t * t * tx, (1 - t) * (1 - t) * y + 2 * (1 - t) * t * cy + t * t * ty];
    const [ax, ay] = p(t0), [bx, by] = p(t1), w0 = h * (.05 - t0 * .022);
    const g = c.createLinearGradient(ax - w0, 0, ax + w0, 0); g.addColorStop(0, '#4a3420'); g.addColorStop(.5, '#9a7a52'); g.addColorStop(1, '#3d2a18');
    c.fillStyle = g; c.beginPath(); c.moveTo(ax - w0, ay); c.lineTo(bx - w0 * .95, by); c.lineTo(bx + w0 * .95, by); c.lineTo(ax + w0, ay); c.fill();
    c.strokeStyle = 'rgba(40,25,10,.55)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx - w0 * .95, by); c.lineTo(bx + w0 * .95, by + 2); c.stroke();
  }
  // fronds with leaflets
  const R = rng(seed * 17 + 3);
  for (let i = 0; i < 11; i++) {
    const a0 = -Math.PI / 2 + (i - 5) * .36 + (R() - .5) * .12, len = h * (.45 + R() * .12), blow = bend * .9;
    const ex = tx + Math.cos(a0) * len * .9 + blow * len * .6, ey = ty + Math.sin(a0) * len * .45 + len * .38 * (1 - Math.abs(Math.sin(a0)) * .5);
    const qx = tx + Math.cos(a0) * len * .55 + blow * len * .35, qy = ty + Math.sin(a0) * len * .55 - len * .12;
    const col = mix('#2e5a24', '#6f9a3c', R());
    c.strokeStyle = mix(col, '#000000', .3); c.lineWidth = h * .009;
    c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(qx, qy, ex, ey); c.stroke();
    for (let k = 1; k < 22; k++) {
      const t = k / 22, px = (1 - t) * (1 - t) * tx + 2 * (1 - t) * t * qx + t * t * ex, py = (1 - t) * (1 - t) * ty + 2 * (1 - t) * t * qy + t * t * ey;
      const dx = 2 * (1 - t) * (qx - tx) + 2 * t * (ex - qx), dy = 2 * (1 - t) * (qy - ty) + 2 * t * (ey - qy), L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L, ny = dx / L, ll = h * .11 * Math.sin(t * Math.PI) * (.7 + R() * .3);
      c.strokeStyle = mix(col, '#c8e08a', R() * .25); c.lineWidth = h * .006;
      [1, -1].forEach(s => { c.beginPath(); c.moveTo(px, py); c.lineTo(px + (nx * s + dx / L * .5) * ll + blow * ll * .4, py + (ny * s + dy / L * .5) * ll + ll * .45); c.stroke(); });
    }
  }
  c.fillStyle = '#4a3218'; [[-6, 6], [6, 8], [0, 12], [-2, 3]].forEach(([dx, dy]) => { c.beginPath(); c.arc(tx + dx, ty + dy, h * .028, 0, TAU); c.fill(); });
  c.restore();
};

/* ---------- house ---------- */
D.house = function (c, x, y, w, h, o = {}) {
  c.save();
  const top = y - h;
  // walls
  const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, o.wall || '#ecdcbc'); g.addColorStop(1, o.wall2 || '#c3ad86');
  c.fillStyle = g; c.fillRect(x, top, w, h);
  D.tex(c, x, top, w, h, 'plaster', .55);
  c.fillStyle = 'rgba(90,70,50,.55)'; c.fillRect(x, y - h * .1, w, h * .1); D.tex(c, x, y - h * .1, w, h * .1, 'speck', .4);
  // shadow under the eaves
  const sg = c.createLinearGradient(0, top, 0, top + h * .2); sg.addColorStop(0, 'rgba(0,0,0,.45)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = sg; c.fillRect(x, top, w, h * .2);
  // door
  const dw = w * .2, dh = h * .58, dx = x + w * .14, dy = y - dh;
  c.fillStyle = '#efe6d2'; c.fillRect(dx - 5, dy - 5, dw + 10, dh + 5);
  if (o.doorOpen) { c.fillStyle = '#120d09'; c.fillRect(dx, dy, dw, dh); }
  else {
    const dg = c.createLinearGradient(dx, 0, dx + dw, 0); dg.addColorStop(0, '#5a321a'); dg.addColorStop(1, '#7b4a28');
    c.fillStyle = dg; c.fillRect(dx, dy, dw, dh); D.tex(c, dx, dy, dw, dh, 'wood', .6);
    c.strokeStyle = 'rgba(30,15,5,.5)'; c.lineWidth = 2; c.strokeRect(dx + dw * .15, dy + dh * .08, dw * .7, dh * .38); c.strokeRect(dx + dw * .15, dy + dh * .52, dw * .7, dh * .38);
    c.fillStyle = '#d8b24a'; c.beginPath(); c.arc(dx + dw * .82, dy + dh * .55, 3, 0, TAU); c.fill();
  }
  // window
  const ww = w * .26, wh = h * .32, wx = x + w * .56, wy = top + h * .26;
  c.fillStyle = '#efe6d2'; c.fillRect(wx - 6, wy - 6, ww + 12, wh + 12);
  if (o.lit) { const lg = c.createRadialGradient(wx + ww / 2, wy + wh / 2, 2, wx + ww / 2, wy + wh / 2, ww); lg.addColorStop(0, '#ffe7a3'); lg.addColorStop(1, '#d9902e'); c.fillStyle = lg; }
  else if (o.windowOpen) c.fillStyle = '#0f1218';
  else { const gg = c.createLinearGradient(wx, wy, wx + ww, wy + wh); gg.addColorStop(0, '#cfe3f2'); gg.addColorStop(.5, '#7aa3c4'); gg.addColorStop(1, '#3d5f7e'); c.fillStyle = gg; }
  c.fillRect(wx, wy, ww, wh);
  if (!o.windowOpen && !o.lit) { c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.moveTo(wx, wy + wh * .7); c.lineTo(wx + ww * .55, wy); c.lineTo(wx + ww * .75, wy); c.lineTo(wx, wy + wh); c.fill(); }
  c.strokeStyle = '#e9e0cc'; c.lineWidth = 4; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh / 2); c.lineTo(wx + ww, wy + wh / 2); c.stroke();
  c.fillStyle = '#d8ccb2'; c.fillRect(wx - 10, wy + wh + 4, ww + 20, 7);
  if (o.windowOpen) { c.fillStyle = 'rgba(160,200,230,.8)'; c.beginPath(); c.moveTo(wx + ww, wy); c.lineTo(wx + ww * 1.35, wy - 6); c.lineTo(wx + ww * 1.35, wy + wh + 6); c.lineTo(wx + ww, wy + wh); c.fill(); }
  // roof (clay tiles)
  const lift = o.roofLift || 0, ang = o.roofAng || 0;
  c.translate(x + w / 2, top - lift); c.rotate(ang);
  const ov = w * .1, rh = h * .52;
  c.beginPath(); c.moveTo(-w / 2 - ov, 4); c.lineTo(0, -rh); c.lineTo(w / 2 + ov, 4); c.closePath();
  const rg = c.createLinearGradient(-w / 2, 0, w / 2, 0); rg.addColorStop(0, '#b4553a'); rg.addColorStop(.5, '#9a3e27'); rg.addColorStop(1, '#6e2716');
  c.fillStyle = rg; c.fill();
  c.save(); c.clip();
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const yy = -rh + (rh + 4) * (r + 1) / rows;
    c.strokeStyle = 'rgba(40,10,4,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-w, yy); c.lineTo(w, yy); c.stroke();
    for (let xx = -w + (r % 2) * 9; xx < w; xx += 18) { c.strokeStyle = 'rgba(255,200,170,.18)'; c.beginPath(); c.arc(xx, yy - 2, 8, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  }
  D.tex(c, -w, -rh, w * 2, rh + 10, 'grain', .45);
  c.restore();
  c.strokeStyle = '#5a1d10'; c.lineWidth = 5; c.beginPath(); c.moveTo(-w / 2 - ov, 4); c.lineTo(0, -rh); c.lineTo(w / 2 + ov, 4); c.stroke();
  c.restore();
};

/* ---------- people ---------- */
D.person = function (c, x, y, h, o = {}) {
  const pose = o.pose || 'stand', skin = o.skin || '#a86e4a', shirt = o.shirt || '#2e6fb3', pants = o.pants || '#2b303c', hair = o.hair || '#17110c';
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  const shade = (col, k) => mix(col, '#000000', k);
  const limb = (pts, w0, w1, col) => {
    // tapered limb drawn as a sequence of round segments
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], wa = lerp(w0, w1, (i - 1) / (pts.length - 1)), wb = lerp(w0, w1, i / (pts.length - 1));
      const g = c.createLinearGradient(ax - wa, ay, ax + wa, ay); g.addColorStop(0, shade(col, .35)); g.addColorStop(.45, col); g.addColorStop(1, shade(col, .45));
      c.strokeStyle = g; c.lineWidth = (wa + wb); c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
    }
  };
  const headAt = (hx, hy, r, back) => {
    const g = c.createRadialGradient(hx - r * .35, hy - r * .35, r * .1, hx, hy, r * 1.15);
    g.addColorStop(0, mix(skin, '#ffffff', .2)); g.addColorStop(1, shade(skin, .25));
    c.fillStyle = g; c.beginPath(); c.ellipse(hx, hy, r * .86, r, 0, 0, TAU); c.fill();
    c.fillStyle = shade(skin, .15); c.beginPath(); c.ellipse(hx - r * .84, hy + r * .05, r * .14, r * .22, 0, 0, TAU); c.ellipse(hx + r * .84, hy + r * .05, r * .14, r * .22, 0, 0, TAU); c.fill();
    const hg = c.createLinearGradient(0, hy - r, 0, hy); hg.addColorStop(0, mix(hair, '#ffffff', .12)); hg.addColorStop(1, hair);
    c.fillStyle = hg; c.beginPath();
    if (back) c.ellipse(hx, hy - r * .05, r * .9, r * .98, 0, 0, TAU);
    else { c.ellipse(hx, hy - r * .35, r * .9, r * .68, 0, Math.PI, TAU); c.quadraticCurveTo(hx + r * .95, hy - r * .1, hx + r * .8, hy + r * .1); c.lineTo(hx - r * .8, hy + r * .1); c.quadraticCurveTo(hx - r * .95, hy - r * .1, hx - r * .9, hy - r * .35); }
    c.fill();
  };
  if (pose === 'stand') {
    const head = h * .065, sh = y - h * .815, hip = y - h * .48, aU = o.armUp || 0;
    // legs + shoes
    limb([[x - h * .045, hip], [x - h * .05, y - h * .25], [x - h * .055, y - h * .03]], h * .042, h * .03, pants);
    limb([[x + h * .045, hip], [x + h * .05, y - h * .25], [x + h * .055, y - h * .03]], h * .042, h * .03, pants);
    c.fillStyle = '#16120f'; c.beginPath(); c.ellipse(x - h * .068, y - h * .012, h * .045, h * .018, 0, 0, TAU); c.ellipse(x + h * .068, y - h * .012, h * .045, h * .018, 0, 0, TAU); c.fill();
    // torso (shirt) with shoulders and waist
    const tg = c.createLinearGradient(x - h * .12, 0, x + h * .12, 0); tg.addColorStop(0, shade(shirt, .35)); tg.addColorStop(.4, mix(shirt, '#ffffff', .12)); tg.addColorStop(1, shade(shirt, .4));
    c.fillStyle = tg; c.beginPath();
    c.moveTo(x - h * .1, sh); c.quadraticCurveTo(x - h * .125, sh + h * .02, x - h * .115, sh + h * .08);
    c.lineTo(x - h * .085, hip + h * .02); c.lineTo(x + h * .085, hip + h * .02); c.lineTo(x + h * .115, sh + h * .08);
    c.quadraticCurveTo(x + h * .125, sh + h * .02, x + h * .1, sh); c.quadraticCurveTo(x, sh - h * .02, x - h * .1, sh); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.15)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - h * .03, sh + h * .15); c.lineTo(x - h * .02, hip); c.stroke();
    // arms
    limb([[x - h * .11, sh + h * .03], [x - h * .14 - aU * h * .05, sh + h * .17 - aU * h * .3], [x - h * .135, sh + h * .31 - aU * h * .55]], h * .03, h * .022, shirt);
    limb([[x + h * .11, sh + h * .03], [x + h * .14 + aU * h * .05, sh + h * .17 - aU * h * .3], [x + h * .135, sh + h * .31 - aU * h * .55]], h * .03, h * .022, shirt);
    c.fillStyle = skin; c.beginPath(); c.ellipse(x - h * .135, sh + h * .33 - aU * h * .55, h * .02, h * .027, 0, 0, TAU); c.ellipse(x + h * .135, sh + h * .33 - aU * h * .55, h * .02, h * .027, 0, 0, TAU); c.fill();
    limb([[x, sh + h * .005], [x, sh - h * .04]], h * .026, h * .024, skin);
    headAt(x, sh - h * .095, head, o.back);
  } else if (pose === 'crouch') {
    const k = h * .5, head = k * .14;
    c.fillStyle = '#16120f'; c.beginPath(); c.ellipse(x - k * .08, y - 4, k * .1, k * .04, 0, 0, TAU); c.ellipse(x + k * .1, y - 4, k * .1, k * .04, 0, 0, TAU); c.fill();
    limb([[x - k * .06, y - k * .05], [x - k * .2, y - k * .38], [x + k * .02, y - k * .42]], k * .07, k * .065, pants);
    limb([[x + k * .1, y - k * .05], [x + k * .24, y - k * .36], [x + k * .05, y - k * .44]], k * .07, k * .065, pants);
    const tg = c.createRadialGradient(x - k * .08, y - k * .7, k * .05, x, y - k * .6, k * .32); tg.addColorStop(0, mix(shirt, '#ffffff', .12)); tg.addColorStop(1, shade(shirt, .45));
    c.fillStyle = tg; c.beginPath(); c.ellipse(x, y - k * .6, k * .24, k * .28, -.15, 0, TAU); c.fill();
    headAt(x + k * .04, y - k * .9, head);
    limb([[x - k * .16, y - k * .72], [x - k * .1, y - k * .9]], k * .055, k * .045, shirt);
    limb([[x + k * .2, y - k * .7], [x + k * .15, y - k * .9]], k * .055, k * .045, shirt);
  } else if (pose === 'lie') {
    const L = h, head = L * .06;
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x, y, L * .5, L * .025, 0, 0, TAU); c.fill();
    limb([[x - L * .45, y - L * .035], [x - L * .18, y - L * .04], [x + L * .05, y - L * .045]], L * .028, L * .04, pants);
    const tg = c.createLinearGradient(0, y - L * .12, 0, y); tg.addColorStop(0, mix(shirt, '#ffffff', .12)); tg.addColorStop(1, shade(shirt, .4));
    c.fillStyle = tg; D.rr(c, x + L * .02, y - L * .11, L * .32, L * .1, L * .045); c.fill();
    limb([[x + L * .1, y - L * .02], [x + L * .3, y - L * .015]], L * .022, L * .018, shirt);
    headAt(x + L * .42, y - L * .065, head);
  } else if (pose === 'swim') {
    const r = h * .065;
    headAt(x, y - r * .4, r);
    limb([[x - r * 1.1, y + 2], [x - r * 2.2, y - r * .8], [x - r * 3.2, y - r * 1.3]], r * .3, r * .25, skin);
    limb([[x + r * 1.1, y + 2], [x + r * 2.4, y + r * .3]], r * .3, r * .25, skin);
    c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y + r * .3, r * 2.6, r * .5, 0, 0, TAU); c.stroke();
  }
  c.restore();
};

/* ---------- elephant (side view, facing right) ---------- */
D.elephant = function (c, ex, ey, S, t = 0, o = {}) {
  // ex,ey = left-bottom of the feet line; S = body length in px
  const P = (u, v) => [ex + u * S, ey - (1 - v) * S * .78];
  c.save();
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(ex + S * .5, ey, S * .5, S * .035, 0, 0, TAU); c.fill();
  const skin = (dark) => { const g = c.createLinearGradient(0, ey - S * .78, 0, ey); g.addColorStop(0, dark ? '#7e838a' : '#9a9fa6'); g.addColorStop(.6, dark ? '#666b72' : '#7b8088'); g.addColorStop(1, dark ? '#50545a' : '#5e636a'); return g; };
  // far legs
  c.fillStyle = skin(true);
  [.17, .57].forEach(u0 => { const [a, b] = P(u0, .6), [, d] = P(u0, 1); c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo(a - S * .012, (b + d) / 2, a, d - 3); c.quadraticCurveTo(a + S * .05, d + 3, a + S * .1, d - 3); c.quadraticCurveTo(a + S * .11, (b + d) / 2, a + S * .1, b); c.fill(); c.save(); c.clip(); D.tex(c, a - 5, b, S * .12, d - b, 'skin', .7, .8); c.restore(); });
  // body outline
  const pts = [[.07, .3], [.18, .12, .45, .04], [.62, .07, .74, .03], [.86, .02, .9, .14], [.95, .24, .94, .38], [.96, .6, .94, .86], [.95, .94, .9, .93], [.88, .88, .89, .8], [.88, .55, .82, .46], [.77, .5, .76, .62], [.77, .8, .77, .99], [.71, 1.0, .65, .99], [.65, .8, .64, .66], [.5, .7, .4, .66], [.38, .78, .38, .99], [.32, 1.0, .26, .99], [.24, .8, .22, .6], [.12, .58, .08, .48], [.04, .4, .07, .3]];
  c.beginPath(); c.moveTo(...P(...pts[0]));
  for (let i = 1; i < pts.length; i++) { const p = pts[i]; if (p.length === 4) c.quadraticCurveTo(...P(p[0], p[1]), ...P(p[2], p[3])); else c.lineTo(...P(p[0], p[1])); }
  c.closePath();
  c.fillStyle = skin(false); c.fill();
  c.save(); c.clip();
  D.tex(c, ex, ey - S, S * 1.05, S * 1.05, 'skin', .8, .8);
  const rg = c.createRadialGradient(...P(.45, .2), S * .05, ...P(.45, .4), S * .6); rg.addColorStop(0, 'rgba(255,255,255,.18)'); rg.addColorStop(1, 'rgba(0,0,0,.28)');
  c.fillStyle = rg; c.fillRect(ex - 10, ey - S, S * 1.1, S * 1.1);
  // wrinkles on legs and trunk
  c.strokeStyle = 'rgba(40,40,45,.35)'; c.lineWidth = 1.5;
  for (let i = 0; i < 9; i++) { const [a, b] = P(.89 + (i % 2) * .01, .45 + i * .05); c.beginPath(); c.moveTo(a - S * .02, b); c.quadraticCurveTo(a, b + 3, a + S * .03, b - 1); c.stroke(); }
  [[.25, .32], [.66, .72]].forEach(([u0]) => { for (let i = 0; i < 6; i++) { const [a, b] = P(u0, .72 + i * .045); c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo(a + S * .05, b + 3, a + S * .11, b); c.stroke(); } });
  c.restore();
  // toenails
  c.fillStyle = '#d9d2bf'; [[.27, .35], [.66, .74]].forEach(([u0, u1]) => { for (let k = 0; k < 3; k++) { const [a, b] = P(u0 + k * .032, .985); c.beginPath(); c.ellipse(a + 4, b - 2, S * .011, S * .008, 0, 0, TAU); c.fill(); } });
  // ear
  c.beginPath(); c.moveTo(...P(.7, .14)); c.quadraticCurveTo(...P(.56, .18), ...P(.57, .4)); c.quadraticCurveTo(...P(.6, .58), ...P(.7, .52)); c.quadraticCurveTo(...P(.78, .4), ...P(.76, .2)); c.closePath();
  const eg = c.createLinearGradient(...P(.56, .2), ...P(.78, .3)); eg.addColorStop(0, '#6f747c'); eg.addColorStop(1, '#8d929a'); c.fillStyle = eg; c.fill();
  c.save(); c.clip(); D.tex(c, ...P(.5, .1), S * .3, S * .4, 'skin', .7, .6); c.restore();
  c.strokeStyle = 'rgba(30,30,35,.4)'; c.lineWidth = 2; c.stroke();
  // tusk, eye, tail
  c.fillStyle = '#efe6d0'; c.beginPath(); c.moveTo(...P(.88, .44)); c.quadraticCurveTo(...P(.95, .56), ...P(1.02, .52)); c.quadraticCurveTo(...P(.95, .5), ...P(.89, .4)); c.fill();
  c.fillStyle = '#141414'; c.beginPath(); c.arc(...P(.84, .25), S * .009, 0, TAU); c.fill();
  c.strokeStyle = '#5e636a'; c.lineWidth = S * .008; c.beginPath(); c.moveTo(...P(.07, .32)); c.quadraticCurveTo(...P(.02, .45 + Math.sin(t * 2) * .03), ...P(.03, .62)); c.stroke();
  c.restore();
};

/* ---------- bus ---------- */
D.bus = function (c, x, y, w) {
  const h = w * .36, top = y - h;
  c.save();
  c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(x + w / 2, y, w * .52, h * .07, 0, 0, TAU); c.fill();
  const g = c.createLinearGradient(0, top, 0, y); g.addColorStop(0, '#f2c443'); g.addColorStop(.6, '#e0a91f'); g.addColorStop(1, '#a8770f');
  c.fillStyle = g; D.rr(c, x, top, w, h * .88, h * .12); c.fill();
  D.tex(c, x, top, w, h, 'grain', .25);
  c.fillStyle = '#1e2733'; D.rr(c, x + w * .04, top + h * .12, w * .9, h * .32, 6); c.fill();
  for (let i = 0; i < 6; i++) {
    const wx = x + w * (.06 + i * .148), gg = c.createLinearGradient(wx, top, wx + w * .12, top + h * .4);
    gg.addColorStop(0, '#d4e6f4'); gg.addColorStop(.5, '#7fa4c2'); gg.addColorStop(1, '#3c5a76');
    c.fillStyle = gg; c.fillRect(wx, top + h * .15, w * .125, h * .26);
  }
  c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(x + w * .02, top + h * .55, w * .96, h * .05);
  c.fillStyle = '#2a2a2a'; c.fillRect(x - 4, y - h * .2, w + 8, h * .08);
  c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(x + w - 8, y - h * .32, 6, 0, TAU); c.fill();
  [x + w * .2, x + w * .8].forEach(cx => {
    c.fillStyle = '#111'; c.beginPath(); c.arc(cx, y - h * .08, h * .17, 0, TAU); c.fill();
    const rg = c.createRadialGradient(cx - 2, y - h * .1, 1, cx, y - h * .08, h * .09); rg.addColorStop(0, '#e6e6e6'); rg.addColorStop(1, '#6d6d6d');
    c.fillStyle = rg; c.beginPath(); c.arc(cx, y - h * .08, h * .08, 0, TAU); c.fill();
  });
  c.fillStyle = '#a86e4a'; c.beginPath(); c.arc(x + w * .28, top + h * .3, h * .07, 0, TAU); c.fill();
  c.restore();
};

/* ---------- Earth from space ---------- */
let EARTH = null;
D.earth = function (c, x, y, r) {
  if (!EARTH) {
    const S = 420, cv = mkCanvas(S, S), cc = cv.getContext('2d'), img = cc.createImageData(S, S), R0 = S / 2;
    for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
      const nx = (px - R0) / R0, ny = (py - R0) / R0, d2 = nx * nx + ny * ny; if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2), lon = Math.atan2(nx, nz), lat = Math.asin(ny);
      const u = lon * 1.4, v = lat * 1.6;
      const land = NZ.fbm(u * .75 + 4, v * .75 + 2, 5) + .04, cloud = NZ.fbm(u * 1.6 + 11, v * 3.2 + 3, 5);
      let col;
      if (land > .08) { const k = clamp((land - .08) * 3, 0, 1); col = Math.abs(lat) > 1.1 ? [235, 240, 245] : (k > .55 ? [150, 128, 88] : [64 + k * 50, 110 - k * 10, 52]); }
      else { const k = clamp(-land * 2, 0, 1); col = [12 + 20 * (1 - k), 52 + 40 * (1 - k), 110 + 50 * (1 - k)]; }
      const cl = sstep(.05, .45, cloud) * .9;
      col = col.map(v => v + (245 - v) * cl);
      const light = clamp(.15 + (-nx * .55 - ny * .45 + nz * .7) * .95, .06, 1.1);
      const i = (py * S + px) * 4;
      img.data[i] = col[0] * light; img.data[i + 1] = col[1] * light; img.data[i + 2] = col[2] * light; img.data[i + 3] = 255;
    }
    cc.putImageData(img, 0, 0); EARTH = cv;
  }
  c.save();
  let g = c.createRadialGradient(x, y, r * .96, x, y, r * 1.14);
  g.addColorStop(0, 'rgba(120,185,255,.75)'); g.addColorStop(1, 'rgba(120,185,255,0)');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 1.14, 0, TAU); c.fill();
  c.drawImage(EARTH, x - r, y - r, r * 2, r * 2);
  g = c.createRadialGradient(x, y, r * .82, x, y, r); g.addColorStop(0, 'rgba(140,200,255,0)'); g.addColorStop(1, 'rgba(140,200,255,.35)');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  c.restore();
};

/* ---------- satellite-style cyclone ---------- */
D.cycloneTex = function (R, seed = 4) {
  const key = 'n' + seed; if (D._cyc.has(key)) return D._cyc.get(key);
  const S = 460, H = S / 2, cv = mkCanvas(S, S), c = cv.getContext('2d'), img = c.createImageData(S, S), off = seed * 13.7;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = (x - H) / H, dy = (y - H) / H, r = Math.sqrt(dx * dx + dy * dy); if (r > 1) continue;
    const th = Math.atan2(dy, dx), sw = th - 2.4 * Math.log(Math.max(r, .02) / .1);   // spiral coordinate
    const bands = .5 + .5 * Math.cos(sw * 3 + NZ.fbm(r * 4 + off, th, 3) * 1.6);
    const tex = NZ.fbm(Math.cos(sw) * r * 6 + off, Math.sin(sw) * r * 6 + 3, 5);
    let dens = bands * sstep(1, .45, r) * .95 + tex * .45 + sstep(.55, .12, r) * .7;
    const wall = sstep(.05, .1, r) * sstep(.2, .1, r);
    dens = Math.max(dens, wall * 1.1);
    dens *= sstep(.035, .075, r);                        // clear eye
    const a = sstep(.15, .7, dens);
    if (a <= 0) continue;
    const shade = clamp(.7 + tex * .5 + (dens - .7) * .3, .35, 1.05);
    const i = (y * S + x) * 4;
    img.data[i] = 232 * shade; img.data[i + 1] = 238 * shade; img.data[i + 2] = 246 * shade; img.data[i + 3] = a * 255;
  }
  c.putImageData(img, 0, 0); D._cyc.set(key, cv); return cv;
};
D.cyclone = function (c, x, y, R, rot, a = 1, seed = 4) {
  const tex = D.cycloneTex(R, seed);
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  c.drawImage(tex, -R, -R, R * 2, R * 2); c.restore();
};
D.oceanTop = function (c, x, y, w, h) {
  const g = c.createRadialGradient(x + w * .5, y + h * .5, 50, x + w * .5, y + h * .5, Math.max(w, h) * .75);
  g.addColorStop(0, '#0d4677'); g.addColorStop(1, '#041c36');
  c.fillStyle = g; c.fillRect(x, y, w, h);
  D.tex(c, x, y, w, h, 'grain', .35, 2.5);
};

/* ---------- rain with depth ---------- */
D.rainDrops = function (c, drops, a = 1, wind = 0) {
  c.save(); c.lineCap = 'round';
  drops.forEach((d, i) => { const k = (i % 3) / 2; c.globalAlpha = a * (.25 + k * .45); c.strokeStyle = 'rgb(205,220,240)'; c.lineWidth = .8 + k * 1.2; c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x + wind * (6 + k * 8), d.y + 14 + k * 16); c.stroke(); });
  c.restore();
};

/* ============ Drawing helpers (Canvas 2D) ============ */
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const seg01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
function rng(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hex(c) { if (c[0] !== '#') { const m = c.match(/[\d.]+/g); return [+m[0], +m[1], +m[2]]; } c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`; }
function rgba(c, a) { const A = hex(c); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; }
const FONT = (size, weight = 700, fam = 'body') =>
  `${weight} ${size}px ${fam === 'disp' ? '"Big Shoulders Display","Arial Narrow",Impact,sans-serif' : fam === 'mono' ? '"IBM Plex Mono",Consolas,monospace' : '"Atkinson Hyperlegible","Segoe UI",Verdana,sans-serif'}`;

const COL = { hi: '#5fb0ff', lo: '#ff6266', warm: '#ffa63d', cool: '#58dcff', bolt: '#ffe15a', safe: '#43e08a', text: '#f1f5fc', muted: '#b4c3da', water: '#3d8fe0' };

const D = {
  rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  },
  arrow(c, x1, y1, x2, y2, o = {}) {
    const col = o.color || '#fff', w = o.w || 8, hl = o.head || w * 2.8, hw = o.headW || w * 2.2;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 2) return;
    const ux = dx / L, uy = dy / L, h = Math.min(hl, L * .7);
    const bx = x2 - ux * h, by = y2 - uy * h;
    c.save(); c.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    if (o.glow) { c.shadowColor = col; c.shadowBlur = o.glow; }
    if (o.outline !== false) {
      c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = w + 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(bx, by); c.stroke();
      c.beginPath(); c.moveTo(x2 + ux * 2, y2 + uy * 2); c.lineTo(bx - uy * (hw + 2), by + ux * (hw + 2)); c.lineTo(bx + uy * (hw + 2), by - ux * (hw + 2)); c.closePath();
      c.fillStyle = 'rgba(0,0,0,.55)'; c.fill();
    }
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(bx, by); c.stroke();
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(bx - uy * hw, by + ux * hw); c.lineTo(bx + uy * hw, by - ux * hw); c.closePath();
    c.fillStyle = col; c.fill();
    c.restore();
  },
  // arrow following a quadratic curve
  curveArrow(c, x1, y1, cx, cy, x2, y2, o = {}) {
    const col = o.color || '#fff', w = o.w || 8;
    c.save(); c.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
    const tx = x2 - cx, ty = y2 - cy, L = Math.hypot(tx, ty) || 1, h = o.head || w * 2.8;
    const ex = x2 - tx / L * h * .8, ey = y2 - ty / L * h * .8;
    c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(cx, cy, ex, ey); c.stroke();
    c.restore();
    D.arrow(c, x2 - tx / L * (h + 2), y2 - ty / L * (h + 2), x2, y2, { color: col, w, alpha: o.alpha, outline: false, head: h });
  },
  label(c, txt, x, y, o = {}) {
    if (!UI.labels && !o.force) return;
    const size = o.size || 28, lines = String(txt).split('\n');
    c.save();
    c.font = FONT(size, o.weight || 700, o.fam || 'body');
    const lh = size * 1.18, pad = o.pad == null ? 10 : o.pad;
    const w = Math.max(...lines.map(l => c.measureText(l).width)) + pad * 2.2, h = lines.length * lh + pad * 1.2;
    let bx = o.align === 'left' ? x : o.align === 'right' ? x - w : x - w / 2;
    const by = y - h / 2;
    c.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    if (o.bg !== false) {
      D.rr(c, bx, by, w, h, o.r || 10);
      c.fillStyle = o.bg || 'rgba(6,10,19,.78)'; c.fill();
      if (o.border) { c.strokeStyle = o.border; c.lineWidth = 3; c.stroke(); }
    }
    c.fillStyle = o.color || '#fff'; c.textBaseline = 'middle'; c.textAlign = 'center';
    lines.forEach((l, i) => c.fillText(l, bx + w / 2, by + pad * .6 + lh * (i + .5)));
    c.restore();
  },
  text(c, txt, x, y, o = {}) {
    c.save(); c.font = FONT(o.size || 28, o.weight || 700, o.fam || 'body');
    c.fillStyle = o.color || '#fff'; c.textAlign = o.align || 'center'; c.textBaseline = o.base || 'middle';
    c.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    if (o.shadow !== false) { c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 8; }
    c.fillText(txt, x, y); c.restore();
  },
  HL(c, x, y, type, r = 38, alpha = 1) {
    c.save(); c.globalAlpha *= alpha;
    const col = type === 'H' ? COL.hi : COL.lo;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = rgba(col, .22); c.fill();
    c.lineWidth = 5; c.strokeStyle = col; c.stroke();
    c.font = FONT(r * 1.25, 900, 'disp'); c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(type, x, y + r * .06); c.restore();
  },
  sun(c, x, y, r, a = 1) {
    c.save(); c.globalAlpha *= a;
    let g = c.createRadialGradient(x, y, r * .2, x, y, r * 4);
    g.addColorStop(0, 'rgba(255,240,180,.55)'); g.addColorStop(.3, 'rgba(255,200,90,.18)'); g.addColorStop(1, 'rgba(255,180,60,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 4, 0, TAU); c.fill();
    g = c.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
    g.addColorStop(0, '#fffbe6'); g.addColorStop(.6, '#ffe58a'); g.addColorStop(1, '#ffc23d');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore();
  },
  moon(c, x, y, r, a = 1) {
    c.save(); c.globalAlpha *= a;
    let g = c.createRadialGradient(x, y, r, x, y, r * 3);
    g.addColorStop(0, 'rgba(200,220,255,.25)'); g.addColorStop(1, 'rgba(200,220,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 3, 0, TAU); c.fill();
    g = c.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#c9d4e6');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.fillStyle = 'rgba(150,165,190,.45)';
    [[-.3, -.1, .18], [.25, .25, .14], [.1, -.4, .1]].forEach(([dx, dy, rr]) => { c.beginPath(); c.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); c.fill(); });
    c.restore();
  },
  stars(c, w, h, a, seed = 3) {
    if (a <= 0) return; const R = rng(seed); c.save();
    for (let i = 0; i < 90; i++) { c.globalAlpha = a * (.3 + R() * .7); c.fillStyle = '#fff'; c.fillRect(R() * w, R() * h, R() < .1 ? 3 : 2, R() < .1 ? 3 : 2); }
    c.restore();
  },
  sky(c, x, y, w, h, top, bot) {
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, top); g.addColorStop(1, bot);
    c.fillStyle = g; c.fillRect(x, y, w, h);
  },
  _cloudCache: new Map(),
  cloudSprite(w, h, seed, dark) {
    const key = `${w | 0}_${h | 0}_${seed}_${Math.round(dark * 10)}`;
    if (D._cloudCache.has(key)) return D._cloudCache.get(key);
    const S = 1.5, cv = document.createElement('canvas');
    cv.width = Math.ceil(w * S); cv.height = Math.ceil(h * S);
    const c = cv.getContext('2d'); c.scale(S, S);
    const R = rng(seed * 7919 + 13);
    const top = mix('#ffffff', '#5a6474', dark).match(/\d+/g).join(','), mid = mix('#e3e9f1', '#3a4352', dark).match(/\d+/g).join(','), bot = mix('#a7b3c2', '#1b212b', dark).match(/\d+/g).join(',');
    const puffs = [];
    const n = 16;
    for (let i = 0; i < n; i++) {
      const u = R();
      const px = w * (.16 + u * .68);
      const hump = Math.sin(u * Math.PI);
      const r = h * (.2 + .22 * hump + R() * .1);
      const py = h * .78 - r * (.35 + R() * .5) * (.6 + hump * .5);
      puffs.push([px, py, r]);
    }
    puffs.push([w * .5, h * .62, h * .34]);
    puffs.sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < 26; i++) { const u = R(); const hump = Math.sin(u * Math.PI); const r = h * (.1 + .1 * hump + R() * .06); puffs.push([w * (.14 + u * .72), h * (.72 - hump * .38 * R()), r]); }
    puffs.sort((a, b) => a[1] - b[1]);
    const A = top, M = mid, B = bot;
    for (const [px, py, r] of puffs) {
      const g = c.createRadialGradient(px - r * .25, py - r * .4, r * .05, px, py, r);
      g.addColorStop(0, `rgba(${A},1)`); g.addColorStop(.45, `rgba(${M},.97)`); g.addColorStop(.8, `rgba(${B},.75)`); g.addColorStop(1, `rgba(${B},0)`);
      c.fillStyle = g; c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill();
    }
    // flatten base & darken underside
    c.globalCompositeOperation = 'source-atop';
    const g2 = c.createLinearGradient(0, h * .35, 0, h);
    g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, `rgba(20,26,36,${.25 + dark * .45})`);
    c.fillStyle = g2; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'destination-out';
    const g3 = c.createLinearGradient(0, h * .86, 0, h);
    g3.addColorStop(0, 'rgba(0,0,0,0)'); g3.addColorStop(1, 'rgba(0,0,0,1)');
    c.fillStyle = g3; c.fillRect(0, h * .86, w, h * .14);
    D._cloudCache.set(key, cv);
    return cv;
  },
  cloud(c, x, y, w, h, o = {}) {
    const spr = D.cloudSprite(Math.round(w / 20) * 20, Math.round(h / 20) * 20, o.seed || 1, clamp(o.dark || 0, 0, 1));
    c.save(); c.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    c.drawImage(spr, x - w / 2, y - h / 2, w, h); c.restore();
  },
  // a broadleaf tree. bend: -1..1 (wind)
  tree(c, x, y, h, bend = 0, seed = 1, o = {}) {
    const R = rng(seed * 31 + 5);
    const topX = x + bend * h * .22, topY = y - h * .62;
    c.save();
    // trunk
    const tw = h * .07;
    const g = c.createLinearGradient(x - tw, 0, x + tw, 0); g.addColorStop(0, '#3b2717'); g.addColorStop(.5, '#6a4a2d'); g.addColorStop(1, '#3b2717');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(x - tw, y); c.quadraticCurveTo(x - tw * .7 + bend * h * .05, y - h * .35, topX - tw * .35, topY);
    c.lineTo(topX + tw * .35, topY); c.quadraticCurveTo(x + tw * .7 + bend * h * .05, y - h * .35, x + tw, y); c.closePath(); c.fill();
    // foliage
    const blobs = [];
    for (let i = 0; i < 11; i++) {
      const a = R() * TAU, d = R() * h * .2;
      blobs.push([Math.cos(a) * d * 1.15, Math.sin(a) * d * .8 - h * .1, h * (.14 + R() * .1), R()]);
    }
    blobs.sort((p, q) => p[1] - q[1]);
    const lean = bend * h * .1;
    for (const [dx, dy, r, k] of blobs) {
      const bx = topX + dx + lean * (1 - (dy + h * .3) / (h * .5)), by = topY + dy - h * .04;
      const gg = c.createRadialGradient(bx - r * .35, by - r * .4, r * .1, bx, by, r);
      const base = o.dark ? ['#4f7a3b', '#24452a', '#0f2214'] : ['#7dbb4f', '#3e7f35', '#1d4a24'];
      gg.addColorStop(0, base[0]); gg.addColorStop(.55, base[1]); gg.addColorStop(1, base[2]);
      c.fillStyle = gg; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill();
    }
    c.restore();
  },
  palm(c, x, y, h, bend = 0, seed = 1) {
    c.save();
    const tx = x + bend * h * .35, ty = y - h;
    c.strokeStyle = '#7a5a36'; c.lineWidth = h * .055; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + bend * h * .05 - h * .08, y - h * .55, tx, ty); c.stroke();
    c.strokeStyle = 'rgba(60,40,20,.6)'; c.lineWidth = 2;
    for (let i = 1; i < 9; i++) { const t = i / 9; const px = lerp(x, tx, t) - h * .08 * Math.sin(t * Math.PI) * (1 - bend), py = lerp(y, ty, t); c.beginPath(); c.moveTo(px - h * .025, py); c.lineTo(px + h * .025, py + 3); c.stroke(); }
    const R = rng(seed);
    for (let i = 0; i < 9; i++) {
      const a0 = -Math.PI / 2 + (i - 4) * .42 + (R() - .5) * .15;
      const len = h * (.42 + R() * .12);
      const blow = bend * .9;
      const ex = tx + Math.cos(a0) * len * .9 + blow * len * .6, ey = ty + Math.sin(a0) * len * .5 + len * .35 * (1 - Math.abs(Math.sin(a0)) * .6);
      const cx = tx + Math.cos(a0) * len * .55 + blow * len * .35, cy = ty + Math.sin(a0) * len * .55 - len * .1;
      c.strokeStyle = i % 2 ? '#3f8a3a' : '#2f6e2f'; c.lineWidth = h * .035;
      c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(cx, cy, ex, ey); c.stroke();
      c.strokeStyle = 'rgba(120,190,90,.6)'; c.lineWidth = h * .012;
      c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(cx, cy - 3, ex, ey); c.stroke();
    }
    c.fillStyle = '#5b3d1f'; [[-6, 4], [6, 6], [0, 10]].forEach(([dx, dy]) => { c.beginPath(); c.arc(tx + dx, ty + dy, h * .03, 0, TAU); c.fill(); });
    c.restore();
  },
  sea(c, x, y, w, h, t, o = {}) {
    const night = o.night || 0;
    const g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, mix(o.top || '#3f8fcf', '#16304f', night)); g.addColorStop(1, mix(o.bot || '#0d3f73', '#061528', night));
    c.fillStyle = g; c.fillRect(x, y, w, h);
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.strokeStyle = `rgba(255,255,255,${.22 - night * .1})`; c.lineWidth = 2;
    for (let k = 0; k < 7; k++) {
      const yy = y + 8 + k * (h / 7), amp = 3 + k * .6;
      c.beginPath();
      for (let xx = x; xx <= x + w; xx += 16) c.lineTo(xx, yy + Math.sin(xx * .03 + t * 1.6 + k * 1.7) * amp);
      c.stroke();
    }
    c.restore();
  },
  ground(c, x, y, w, h, o = {}) {
    const g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, o.top || '#6d8f3c'); g.addColorStop(.12, o.mid || '#5a7a33'); g.addColorStop(1, o.bot || '#3a2d1c');
    c.fillStyle = g; c.fillRect(x, y, w, h);
  },
  house(c, x, y, w, h, o = {}) {
    // x,y = bottom-left
    c.save();
    const wallTop = y - h;
    const g = c.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, o.wall || '#e9d7b4'); g.addColorStop(1, o.wall2 || '#c9b28a');
    c.fillStyle = g; c.fillRect(x, wallTop, w, h);
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.strokeRect(x, wallTop, w, h);
    // door
    const dw = w * .2, dh = h * .55, dx = x + w * .15;
    c.fillStyle = o.doorOpen ? '#1b1410' : '#7a4a2a'; c.fillRect(dx, y - dh, dw, dh);
    if (o.doorOpen) { c.fillStyle = '#8f5a33'; c.beginPath(); c.moveTo(dx, y - dh); c.lineTo(dx - dw * .5, y - dh - 8); c.lineTo(dx - dw * .5, y + 4); c.lineTo(dx, y); c.fill(); }
    // window
    const ww = w * .26, wh = h * .32, wx = x + w * .55, wy = wallTop + h * .25;
    c.fillStyle = o.lit ? '#ffd877' : (o.windowOpen ? '#11161e' : '#7fb4d9'); c.fillRect(wx, wy, ww, wh);
    if (!o.windowOpen && !o.lit) { c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(wx + 4, wy + wh - 4); c.lineTo(wx + ww * .45, wy + 4); c.lineTo(wx + ww * .6, wy + 4); c.lineTo(wx + 12, wy + wh - 4); c.fill(); }
    c.strokeStyle = '#5b4632'; c.lineWidth = 5; c.strokeRect(wx, wy, ww, wh);
    c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.stroke();
    if (o.windowOpen) { c.fillStyle = '#9fc6e2'; c.beginPath(); c.moveTo(wx + ww, wy); c.lineTo(wx + ww + ww * .35, wy - 6); c.lineTo(wx + ww + ww * .35, wy + wh + 6); c.lineTo(wx + ww, wy + wh); c.fill(); }
    // roof
    const lift = o.roofLift || 0, ang = o.roofAng || 0;
    c.translate(x + w / 2, wallTop - lift); c.rotate(ang);
    const ov = w * .1, rh = h * .5;
    const rg = c.createLinearGradient(0, -rh, 0, 0); rg.addColorStop(0, '#b4472f'); rg.addColorStop(1, '#7c2a1b');
    c.fillStyle = rg; c.beginPath(); c.moveTo(-w / 2 - ov, 0); c.lineTo(0, -rh); c.lineTo(w / 2 + ov, 0); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(40,10,5,.5)'; c.lineWidth = 2;
    for (let i = 1; i < 6; i++) { const t = i / 6; c.beginPath(); c.moveTo(-w / 2 - ov + (w / 2 + ov) * t, -rh * t); c.lineTo(w / 2 + ov - (w / 2 + ov) * t, -rh * t); c.stroke(); }
    c.restore();
  },
  // simple realistic-proportioned person. x,y = feet centre on ground
  person(c, x, y, h, o = {}) {
    const pose = o.pose || 'stand', skin = o.skin || '#b07650', shirt = o.shirt || '#2e6fb3', pants = o.pants || '#2b2f3a', hair = o.hair || '#1a120c';
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const head = h * .065;
    const limb = (pts, wdt, col) => { c.strokeStyle = col; c.lineWidth = wdt; c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); };
    const drawHead = (hx, hy) => {
      const g = c.createRadialGradient(hx - head * .3, hy - head * .3, head * .2, hx, hy, head * 1.1);
      g.addColorStop(0, '#d39a72'); g.addColorStop(1, skin);
      c.fillStyle = g; c.beginPath(); c.arc(hx, hy, head, 0, TAU); c.fill();
      c.fillStyle = hair; c.beginPath(); c.arc(hx, hy - head * .15, head * 1.02, Math.PI * 1.05, Math.PI * 1.95); c.fill();
    };
    if (pose === 'stand') {
      const hip = y - h * .47, sh = y - h * .8;
      limb([[x - h * .045, hip], [x - h * .06, y - 4]], h * .075, pants);
      limb([[x + h * .045, hip], [x + h * .06, y - 4]], h * .075, pants);
      c.fillStyle = '#111'; c.fillRect(x - h * .1, y - 8, h * .08, 8); c.fillRect(x + h * .02, y - 8, h * .08, 8);
      const tg = c.createLinearGradient(x - h * .12, 0, x + h * .12, 0); tg.addColorStop(0, shirt); tg.addColorStop(.5, mix(shirt.length === 7 ? shirt : '#2e6fb3', '#ffffff', .15)); tg.addColorStop(1, shirt);
      c.fillStyle = tg; D.rr(c, x - h * .11, sh - h * .02, h * .22, hip - sh + h * .05, h * .05); c.fill();
      const armUp = o.armUp || 0;
      limb([[x - h * .1, sh + h * .02], [x - h * .14, sh + h * .17 - armUp * h * .3], [x - h * .13, sh + h * .3 - armUp * h * .55]], h * .06, shirt);
      limb([[x + h * .1, sh + h * .02], [x + h * .14, sh + h * .17 - armUp * h * .3], [x + h * .13, sh + h * .3 - armUp * h * .55]], h * .06, shirt);
      c.fillStyle = skin; c.beginPath(); c.arc(x - h * .13, sh + h * .3 - armUp * h * .55, h * .03, 0, TAU); c.arc(x + h * .13, sh + h * .3 - armUp * h * .55, h * .03, 0, TAU); c.fill();
      limb([[x, sh - h * .02], [x, sh - h * .06]], h * .05, skin);
      drawHead(x, sh - h * .1);
    } else if (pose === 'crouch') {
      // squatting on toes, head tucked, hands over ears
      const k = h * .5;
      c.fillStyle = '#111'; c.fillRect(x - k * .18, y - 7, k * .14, 7); c.fillRect(x + k * .04, y - 7, k * .14, 7);
      limb([[x - k * .1, y - 6], [x - k * .2, y - k * .35], [x - k * .02, y - k * .42]], k * .14, pants);
      limb([[x + k * .1, y - 6], [x + k * .2, y - k * .35], [x + k * .04, y - k * .42]], k * .14, pants);
      c.fillStyle = shirt; c.beginPath(); c.ellipse(x, y - k * .58, k * .24, k * .26, 0, 0, TAU); c.fill();
      drawHead(x + k * .02, y - k * .86);
      limb([[x - k * .18, y - k * .7], [x - k * .1, y - k * .9]], k * .1, shirt);
      limb([[x + k * .18, y - k * .7], [x + k * .12, y - k * .9]], k * .1, shirt);
    } else if (pose === 'lie') {
      const L = h;
      limb([[x - L * .45, y - L * .04], [x + L * .05, y - L * .05]], L * .08, pants);
      c.fillStyle = shirt; D.rr(c, x + L * .02, y - L * .12, L * .32, L * .11, L * .05); c.fill();
      limb([[x + L * .1, y - L * .03], [x + L * .3, y - L * .02]], L * .05, shirt);
      const hx = x + L * .42, hy = y - L * .07; const hd = L * .065;
      const g = c.createRadialGradient(hx - hd * .3, hy - hd * .3, hd * .2, hx, hy, hd * 1.1); g.addColorStop(0, '#d39a72'); g.addColorStop(1, skin);
      c.fillStyle = g; c.beginPath(); c.arc(hx, hy, hd, 0, TAU); c.fill();
      c.fillStyle = hair; c.beginPath(); c.arc(hx + hd * .2, hy, hd * 1.02, -Math.PI * .5, Math.PI * .5); c.fill();
    } else if (pose === 'swim') {
      drawHead(x, y - head * .4);
      limb([[x - head * 1.2, y + 2], [x - head * 3.2, y - head * 1.2]], head * .7, skin);
      limb([[x + head * 1.2, y + 2], [x + head * 3, y + head * .4]], head * .7, skin);
    }
    c.restore();
  },
  genBolt(x1, y1, x2, y2, seed, rough = .22, branches = 3) {
    const R = rng(seed);
    function mid(a, b, disp, depth, out) {
      if (depth === 0) { out.push(b); return; }
      const mx = (a[0] + b[0]) / 2 + (R() - .5) * disp, my = (a[1] + b[1]) / 2 + (R() - .5) * disp * .35;
      const m = [mx, my];
      mid(a, m, disp / 2, depth - 1, out); mid(m, b, disp / 2, depth - 1, out);
    }
    const L = Math.hypot(x2 - x1, y2 - y1);
    const main = [[x1, y1]]; mid([x1, y1], [x2, y2], L * rough, 6, main);
    const lines = [main];
    for (let b = 0; b < branches; b++) {
      const i = Math.floor(main.length * (.15 + R() * .5)), p = main[i];
      const dir = R() < .5 ? -1 : 1, bl = L * (.15 + R() * .25);
      const e = [p[0] + dir * bl * .6, p[1] + (y2 > y1 ? 1 : -1) * bl * .6 + (y2 === y1 ? 0 : 0)];
      if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) { e[0] = p[0] + (x2 > x1 ? 1 : -1) * bl * .6; e[1] = p[1] + dir * bl * .5; }
      const br = [p]; mid(p, e, bl * .4, 4, br); lines.push(br);
    }
    return lines;
  },
  bolt(c, lines, a = 1) {
    if (a <= 0) return;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    lines.forEach((pts, i) => {
      const w = i === 0 ? 1 : .5;
      c.globalAlpha = a * .5; c.strokeStyle = '#b9a6ff'; c.lineWidth = 16 * w; c.shadowColor = '#c9b8ff'; c.shadowBlur = 30;
      c.beginPath(); pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
      c.globalAlpha = a; c.strokeStyle = '#ffffff'; c.lineWidth = 5 * w; c.shadowBlur = 12; c.shadowColor = '#fff';
      c.beginPath(); pts.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    });
    c.restore();
  },
  charge(c, x, y, sign, r = 15, a = 1) {
    c.save(); c.globalAlpha *= a;
    c.beginPath(); c.arc(x, y, r, 0, TAU);
    c.fillStyle = sign > 0 ? '#c0392b' : '#1f5fae'; c.fill(); c.lineWidth = 2.5; c.strokeStyle = '#fff'; c.stroke();
    c.strokeStyle = '#fff'; c.lineWidth = r * .28; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x - r * .55, y); c.lineTo(x + r * .55, y);
    if (sign > 0) { c.moveTo(x, y - r * .55); c.lineTo(x, y + r * .55); }
    c.stroke(); c.restore();
  },
  meter(c, x, y, r, f, title, valTxt, col = COL.bolt) {
    f = clamp(f, 0, 1);
    c.save();
    const hb = valTxt ? 50 : 22;
    c.beginPath(); c.arc(x, y, r + 16, Math.PI, 0); c.lineTo(x + r + 16, y + hb); c.lineTo(x - r - 16, y + hb); c.closePath();
    c.fillStyle = 'rgba(8,13,24,.9)'; c.fill(); c.strokeStyle = '#2a3b5c'; c.lineWidth = 2; c.stroke();
    c.lineWidth = 16; c.lineCap = 'butt';
    c.strokeStyle = '#24324d'; c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.stroke();
    const g = c.createLinearGradient(x - r, 0, x + r, 0); g.addColorStop(0, '#43e08a'); g.addColorStop(.5, '#ffe15a'); g.addColorStop(1, '#ff6266');
    c.strokeStyle = g; c.beginPath(); c.arc(x, y, r, Math.PI, Math.PI + Math.PI * f); c.stroke();
    const a = Math.PI + Math.PI * f;
    c.strokeStyle = '#fff'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4)); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 8, 0, TAU); c.fill();
    c.restore();
    if (title) D.label(c, title, x, y - r - 40, { size: 22, color: '#dbe5f5', force: true });
    if (valTxt) D.text(c, valTxt, x, y + 32, { size: 26, color: col, fam: 'mono', weight: 600 });
  },
  thermo(c, x, y, h, f, col = COL.lo, lab) {
    f = clamp(f, 0, 1);
    c.save();
    c.fillStyle = 'rgba(240,245,255,.9)'; D.rr(c, x - 11, y - h, 22, h, 11); c.fill();
    c.beginPath(); c.arc(x, y + 8, 20, 0, TAU); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(x, y + 8, 14, 0, TAU); c.fill();
    D.rr(c, x - 6, y - h * f + 6, 12, h * f, 6); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2;
    for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(x + 4, y - h * i / 6); c.lineTo(x + 11, y - h * i / 6); c.stroke(); }
    c.restore();
    if (lab) D.label(c, lab, x, y + 50, { size: 24 });
  },
  // polyline path sampler for particles
  path(pts, closed) {
    const P = closed ? [...pts, pts[0]] : pts.slice();
    const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = L[L.length - 1];
    return {
      total, at(s) {
        s = ((s % 1) + 1) % 1 * total; let i = 1; while (i < L.length - 1 && L[i] < s) i++;
        const t = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
        const a = P[i - 1], b = P[i];
        return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), Math.atan2(b[1] - a[1], b[0] - a[0])];
      }
    };
  },
  roundLoop(x1, y1, x2, y2, r, n = 12) {
    // rectangle loop with rounded corners, clockwise on screen starting bottom-right going left
    const pts = [];
    const arc = (cx, cy, a0, a1) => { for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    arc(x2 - r, y2 - r, Math.PI / 2, Math.PI / 2); // start bottom-right
    arc(x1 + r, y2 - r, Math.PI / 2, Math.PI);
    arc(x1 + r, y1 + r, Math.PI, Math.PI * 1.5);
    arc(x2 - r, y1 + r, Math.PI * 1.5, Math.PI * 2);
    arc(x2 - r, y2 - r, 0, Math.PI / 2);
    return pts;
  },
  // pre-rendered top-view cyclone cloud texture
  _cyc: new Map(),
  cycloneTex(R, seed = 4) {
    const key = R + '_' + seed; if (D._cyc.has(key)) return D._cyc.get(key);
    const S = 1.3, size = Math.ceil(R * 2 * S), cv = document.createElement('canvas'); cv.width = cv.height = size;
    const c = cv.getContext('2d'); c.scale(S, S); c.translate(R, R);
    const Rn = rng(seed);
    // diffuse body
    let g = c.createRadialGradient(0, 0, R * .1, 0, 0, R);
    g.addColorStop(0, 'rgba(235,240,248,.85)'); g.addColorStop(.45, 'rgba(220,228,240,.55)'); g.addColorStop(1, 'rgba(220,228,240,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    // spiral arms (angle increases outward => clockwise outward on screen; system rotates anticlockwise)
    const arms = 4;
    for (let a = 0; a < arms; a++) {
      const th0 = a * TAU / arms + Rn() * .4;
      for (let i = 0; i < 260; i++) {
        const u = i / 260, r = R * (.14 + u * .86);
        const th = th0 + 2.6 * Math.log(r / (R * .14)) + (Rn() - .5) * .35;
        const pr = R * (.05 + .07 * (1 - u)) * (.6 + Rn() * .8);
        const px = Math.cos(th) * r + (Rn() - .5) * 18, py = Math.sin(th) * r + (Rn() - .5) * 18;
        const gg = c.createRadialGradient(px, py, 0, px, py, pr);
        const al = (1 - u) * .55 + .12;
        gg.addColorStop(0, `rgba(255,255,255,${al})`); gg.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = gg; c.beginPath(); c.arc(px, py, pr, 0, TAU); c.fill();
      }
    }
    // dense eyewall ring
    for (let i = 0; i < 180; i++) {
      const th = Rn() * TAU, r = R * (.085 + Rn() * .07), pr = R * (.04 + Rn() * .04);
      const px = Math.cos(th) * r, py = Math.sin(th) * r;
      const gg = c.createRadialGradient(px, py, 0, px, py, pr);
      gg.addColorStop(0, 'rgba(255,255,255,.75)'); gg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = gg; c.beginPath(); c.arc(px, py, pr, 0, TAU); c.fill();
    }
    // eye: clear the centre softly
    c.globalCompositeOperation = 'destination-out';
    g = c.createRadialGradient(0, 0, 0, 0, 0, R * .085);
    g.addColorStop(0, 'rgba(0,0,0,.95)'); g.addColorStop(.7, 'rgba(0,0,0,.7)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, R * .09, 0, TAU); c.fill();
    D._cyc.set(key, cv); return cv;
  },
  cyclone(c, x, y, R, rot, a = 1, seed = 4) {
    const tex = D.cycloneTex(Math.round(R / 10) * 10, seed);
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
    c.drawImage(tex, -R, -R, R * 2, R * 2);
    c.rotate(.9); c.globalAlpha *= .35; c.drawImage(tex, -R * .8, -R * .8, R * 1.6, R * 1.6);
    c.restore();
  },
  oceanTop(c, x, y, w, h) {
    const g = c.createRadialGradient(x + w * .5, y + h * .5, 50, x + w * .5, y + h * .5, Math.max(w, h) * .75);
    g.addColorStop(0, '#0f4f86'); g.addColorStop(1, '#062544');
    c.fillStyle = g; c.fillRect(x, y, w, h);
  },
  rainDrops(c, drops, a = 1, wind = 0) {
    c.save(); c.globalAlpha = a; c.strokeStyle = 'rgba(190,215,255,.7)'; c.lineWidth = 2; c.beginPath();
    for (const d of drops) { c.moveTo(d.x, d.y); c.lineTo(d.x + wind * 10, d.y + 22); }
    c.stroke(); c.restore();
  },
};

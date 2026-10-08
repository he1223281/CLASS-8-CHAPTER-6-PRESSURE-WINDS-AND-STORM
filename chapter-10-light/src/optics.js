/* ================= Optics library =================
   Two models are used, each where it is the honest choice:
   1. bench(): ideal thin mirror / thin lens (1/f = 1/u + 1/v, m = -v/u, real-is-positive),
      used for image formation diagrams. Every drawn ray really passes through (or appears
      to come from) the computed image point.
   2. trace(): exact 2-D ray tracer (law of reflection + Snell's law, n = 1.5 glass),
      used for parallel beams, so convergence, divergence and the focal "region" are real. */
const COL = {
  ray: '#ffcf6b', inc: '#ffb547', ref: '#56dcff', r1: '#ffcf6b', r2: '#56dcff', r3: '#ff7ad9',
  normal: 'rgba(232,238,252,.85)', axis: 'rgba(170,186,214,.5)', obj: '#ff8a5c',
  real: '#7ef0a8', virt: '#b9a6ff', ink: '#eef2f8', mute: '#9fabbf', warn: '#ff5d5d'
};
const FONT = 'Inter, "Segoe UI", system-ui, sans-serif';
const PX_CM = 12;                       // 12 stage pixels = 1 cm on every optical bench
const isLens = t => t === 'convexLens' || t === 'concaveLens';
const norm = v => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };

function path(x, pts) { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); }
function rrect(x, a, b, w, hh, r) { x.beginPath(); if (x.roundRect) x.roundRect(a, b, w, hh, r); else x.rect(a, b, w, hh); }

function arrowHead(x, px, py, dx, dy, col, s = 12) {
  const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
  x.save(); x.fillStyle = col; x.beginPath();
  x.moveTo(px + dx * s, py + dy * s);
  x.lineTo(px - dx * s * .6 - dy * s * .62, py - dy * s * .6 + dx * s * .62);
  x.lineTo(px - dx * s * .6 + dy * s * .62, py - dy * s * .6 - dx * s * .62);
  x.closePath(); x.fill(); x.restore();
}
/* A glowing light ray along a polyline. o: {w, a, dash, flow, arrows} */
function beam(x, pts, col, o = {}) {
  const w = o.w || 2.4, a = o.a == null ? 1 : o.a;
  x.save(); x.lineCap = 'round'; x.lineJoin = 'round'; x.globalCompositeOperation = 'lighter';
  path(x, pts); x.strokeStyle = col;
  if (o.dash) { x.setLineDash(o.dash); x.globalAlpha = a; x.lineWidth = w * .8; x.stroke(); }
  else {
    x.globalAlpha = .06 * a; x.lineWidth = w * 8; x.stroke();
    x.globalAlpha = .2 * a; x.lineWidth = w * 3; x.stroke();
    x.globalAlpha = a; x.lineWidth = w; x.stroke();
    if (o.flow != null) { x.setLineDash([2, 34]); x.lineDashOffset = -o.flow; x.globalAlpha = .9 * a; x.lineWidth = w * 2.1; x.strokeStyle = '#fff'; x.stroke(); }
  }
  x.restore();
  if (o.arrows !== false && !o.dash) for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], L = Math.hypot(dx, dy);
    if (L < 70) continue;
    const d = Math.min(L * .5, o.arrowAt || 170);
    arrowHead(x, pts[i - 1][0] + dx / L * d, pts[i - 1][1] + dy / L * d, dx, dy, col, o.as || 12);
  }
}
/* label with dark pill behind it for legibility over rays */
function tag(x, text, px, py, o = {}) {
  if (o.need !== true && o.labels === false) return;
  const s = o.size || 22;
  x.save(); x.font = `${o.weight || 600} ${s}px ${o.mono ? '"JetBrains Mono",monospace' : FONT}`;
  x.textAlign = o.align || 'center'; x.textBaseline = 'middle';
  if (o.bg !== false) {
    const w = x.measureText(text).width;
    const ax = o.align === 'left' ? px : o.align === 'right' ? px - w : px - w / 2;
    x.fillStyle = o.bg || 'rgba(5,8,14,.74)'; rrect(x, ax - 9, py - s * .72, w + 18, s * 1.44, 8); x.fill();
  }
  x.fillStyle = o.col || COL.ink; x.fillText(text, px, py); x.restore();
}
function dashLine(x, x1, y1, x2, y2, col, w = 2, dash = [10, 8]) {
  x.save(); x.strokeStyle = col; x.lineWidth = w; x.setLineDash(dash); x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); x.restore();
}
function dot(x, px, py, r, col) { x.save(); x.fillStyle = col; x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill(); x.restore(); }
function glow(x, px, py, r, col, a = 1) {
  x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = a;
  const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill(); x.restore();
}
/* angle arc between directions a0 -> a1 (radians, canvas angles) */
function angleArc(x, cx, cy, r, a0, a1, col, txt, o = {}) {
  let d = a1 - a0; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
  x.save();
  x.fillStyle = col; x.globalAlpha = .16; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, r, a0, a0 + d, d < 0); x.closePath(); x.fill();
  x.globalAlpha = 1; x.strokeStyle = col; x.lineWidth = 3.5; x.beginPath(); x.arc(cx, cy, r, a0, a0 + d, d < 0); x.stroke();
  x.restore();
  if (txt) { const am = a0 + d / 2, rr = r + (o.off || 34); tag(x, txt, cx + Math.cos(am) * rr, cy + Math.sin(am) * rr, { col, size: o.size || 26, weight: 800, bg: 'rgba(5,8,14,.6)' }); }
}

/* ---------- mirrors (generic orientation) ----------
   V = pole, ax = unit vector pointing out of the reflecting face (towards incoming light),
   R = radius of curvature, A = aperture. */
function mirrorGeom(type, V, ax, R, A, n = 64) {
  const perp = [-ax[1], ax[0]], pts = [], back = [];
  for (let i = 0; i <= n; i++) {
    const s = -A / 2 + A * i / n; let p, b;
    if (type === 'plane') { p = [V[0] + perp[0] * s, V[1] + perp[1] * s]; b = [-ax[0], -ax[1]]; }
    else if (type === 'concave') {
      const c = [V[0] + ax[0] * R, V[1] + ax[1] * R], k = Math.sqrt(R * R - s * s);
      p = [c[0] - ax[0] * k + perp[0] * s, c[1] - ax[1] * k + perp[1] * s]; b = [(p[0] - c[0]) / R, (p[1] - c[1]) / R];
    } else {
      const c = [V[0] - ax[0] * R, V[1] - ax[1] * R], k = Math.sqrt(R * R - s * s);
      p = [c[0] + ax[0] * k + perp[0] * s, c[1] + ax[1] * k + perp[1] * s]; b = [(c[0] - p[0]) / R, (c[1] - p[1]) / R];
    }
    pts.push(p); back.push(b);
  }
  return { pts, back };
}
function mirrorSurf(type, V, ax, R, A) {
  const perp = [-ax[1], ax[0]];
  if (type === 'plane') return { kind: 'mirror', geom: 'seg', a: [V[0] - perp[0] * A / 2, V[1] - perp[1] * A / 2], b: [V[0] + perp[0] * A / 2, V[1] + perp[1] * A / 2] };
  const sg = type === 'concave' ? 1 : -1, c = [V[0] + ax[0] * R * sg, V[1] + ax[1] * R * sg];
  return {
    kind: 'mirror', geom: 'arc', c, r: R,
    test: (qx, qy) => { const dx = qx - c[0], dy = qy - c[1]; return Math.abs(dx * perp[0] + dy * perp[1]) <= A / 2 && (dx * ax[0] + dy * ax[1]) * sg < 0; }
  };
}
/* draw a silvered mirror with hatching on its non-reflecting back */
function drawMirror(x, g, o = {}) {
  const { pts, back } = g;
  x.save(); x.lineCap = 'round';
  // hatch
  x.strokeStyle = o.hatch || 'rgba(150,166,194,.6)'; x.lineWidth = 2;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i], q = pts[i - 1], seg = Math.hypot(p[0] - q[0], p[1] - q[1]); acc += seg;
    if (acc < 13) continue; acc = 0;
    const t = norm([p[0] - q[0], p[1] - q[1]]), n = back[i];
    const dx = n[0] * .77 + t[0] * .64, dy = n[1] * .77 + t[1] * .64;
    x.beginPath(); x.moveTo(p[0] + n[0] * 4, p[1] + n[1] * 4); x.lineTo(p[0] + n[0] * 4 + dx * 15, p[1] + n[1] * 4 + dy * 15); x.stroke();
  }
  // body + silver face
  path(x, pts); x.strokeStyle = '#5d6b82'; x.lineWidth = 9; x.stroke();
  x.globalCompositeOperation = 'lighter';
  path(x, pts); x.strokeStyle = 'rgba(190,230,255,.18)'; x.lineWidth = 18; x.stroke();
  x.globalCompositeOperation = 'source-over';
  path(x, pts); x.strokeStyle = '#e9f2ff'; x.lineWidth = 3.5; x.stroke();
  x.restore();
}

/* ---------- lenses ---------- */
/* Schematic thin lens (used on ideal-lens benches) */
function drawLens(x, x0, cy, A, type, o = {}) {
  const hh = A / 2; x.save(); x.beginPath();
  if (type === 'convexLens') {
    const b = o.bulge || 22;
    x.moveTo(x0, cy - hh); x.quadraticCurveTo(x0 + 2 * b, cy, x0, cy + hh); x.quadraticCurveTo(x0 - 2 * b, cy, x0, cy - hh);
  } else {
    const e = o.edge || 24, c = 5;
    x.moveTo(x0 - e, cy - hh); x.lineTo(x0 + e, cy - hh); x.quadraticCurveTo(x0 + 2 * c - e, cy, x0 + e, cy + hh);
    x.lineTo(x0 - e, cy + hh); x.quadraticCurveTo(x0 - 2 * c + e, cy, x0 - e, cy - hh);
  }
  x.closePath();
  const g = x.createLinearGradient(x0 - 40, 0, x0 + 40, 0);
  g.addColorStop(0, 'rgba(120,200,255,.10)'); g.addColorStop(.5, 'rgba(175,228,255,.32)'); g.addColorStop(1, 'rgba(120,200,255,.10)');
  x.fillStyle = g; x.fill();
  x.strokeStyle = 'rgba(200,238,255,.9)'; x.lineWidth = 2.2; x.stroke();
  x.globalCompositeOperation = 'lighter'; x.strokeStyle = 'rgba(160,220,255,.18)'; x.lineWidth = 9; x.stroke();
  x.restore();
}
/* Real thick lens for the tracer: two spherical surfaces.
   c1, c2 = curvatures (1/R); positive => centre of that surface lies to the right. */
function sagOf(c, y) { return c * y * y / (1 + Math.sqrt(Math.max(0, 1 - c * c * y * y))); }
function lensModel(x0, cy, A, c1, c2, tc) {
  const v1 = x0 - tc / 2, v2 = x0 + tc / 2, n = 1.5;
  const surf = (xv, c) => {
    if (Math.abs(c) < 1e-7) return { kind: 'glass', n, geom: 'seg', a: [xv, cy - A / 2], b: [xv, cy + A / 2] };
    const R = 1 / c, cx = xv + R;
    return { kind: 'glass', n, geom: 'arc', c: [cx, cy], r: Math.abs(R), test: (qx, qy) => Math.abs(qy - cy) <= A / 2 + 1e-6 && (qx - cx) * Math.sign(R) < 0 };
  };
  const e1 = v1 + sagOf(c1, A / 2), e2 = v2 + sagOf(c2, A / 2);
  const surfs = [surf(v1, c1), surf(v2, c2),
  { kind: 'glass', n, geom: 'seg', a: [e1, cy - A / 2], b: [e2, cy - A / 2] },
  { kind: 'glass', n, geom: 'seg', a: [e1, cy + A / 2], b: [e2, cy + A / 2] }];
  const outline = [];
  for (let i = 0; i <= 40; i++) { const y = -A / 2 + A * i / 40; outline.push([v1 + sagOf(c1, y), cy + y]); }
  for (let i = 40; i >= 0; i--) { const y = -A / 2 + A * i / 40; outline.push([v2 + sagOf(c2, y), cy + y]); }
  return { surfs, outline };
}
/* lens of a given type and focal length (thin-lens estimate 1/f = (n-1)(c1-c2)) */
function makeLens(type, x0, cy, A, f) {
  if (type === 'plate') return lensModel(x0, cy, A, 0, 0, 14);
  const c = 1 / f;
  if (type === 'convexLens') { const tc = 6 + 2 * sagOf(c, A / 2); return lensModel(x0, cy, A, c, -c, tc); }
  return lensModel(x0, cy, A, -c, c, 10);
}
function drawGlass(x, outline, o = {}) {
  x.save(); path(x, outline); x.closePath();
  let mn = 1e9, mx = -1e9; outline.forEach(p => { mn = Math.min(mn, p[0]); mx = Math.max(mx, p[0]); });
  const g = x.createLinearGradient(mn - 10, 0, mx + 10, 0);
  g.addColorStop(0, o.c0 || 'rgba(110,190,255,.14)'); g.addColorStop(.5, o.c1 || 'rgba(175,228,255,.34)'); g.addColorStop(1, o.c0 || 'rgba(110,190,255,.14)');
  x.fillStyle = g; x.fill();
  x.strokeStyle = 'rgba(205,240,255,.92)'; x.lineWidth = 2.2; x.stroke();
  x.globalCompositeOperation = 'lighter'; x.strokeStyle = 'rgba(160,220,255,.16)'; x.lineWidth = 10; x.stroke();
  x.restore();
}

/* ---------- exact ray tracer ---------- */
function hitSurf(p, d, s) {
  if (s.geom === 'seg') {
    const ex = s.b[0] - s.a[0], ey = s.b[1] - s.a[1], den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-12) return null;
    const wx = s.a[0] - p[0], wy = s.a[1] - p[1];
    const t = (wx * ey - wy * ex) / den, u = (wx * d[1] - wy * d[0]) / den;
    if (t > 1e-6 && u >= 0 && u <= 1) { const L = Math.hypot(ex, ey); return { t, n: [-ey / L, ex / L] }; }
    return null;
  }
  const ox = p[0] - s.c[0], oy = p[1] - s.c[1], b = ox * d[0] + oy * d[1], cc = ox * ox + oy * oy - s.r * s.r, disc = b * b - cc;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  for (const t of [-b - sq, -b + sq]) if (t > 1e-6) {
    const qx = p[0] + t * d[0], qy = p[1] + t * d[1];
    if (s.test(qx, qy)) return { t, n: [(qx - s.c[0]) / s.r, (qy - s.c[1]) / s.r] };
  }
  return null;
}
function trace(p0, d0, surfs, o = {}) {
  let p = [p0[0], p0[1]], d = norm(d0), inside = false; const pts = [p]; let hit = null;
  for (let k = 0; k < (o.max || 16); k++) {
    let best = null, bs = null;
    for (const s of surfs) { const r = hitSurf(p, d, s); if (r && (!best || r.t < best.t)) { best = r; bs = s; } }
    if (!best) { const L = o.len || 3200; pts.push([p[0] + d[0] * L, p[1] + d[1] * L]); break; }
    const q = [p[0] + d[0] * best.t, p[1] + d[1] * best.t]; pts.push(q);
    if (bs.kind === 'absorb') { hit = { s: bs, q }; break; }
    let n = best.n; if (n[0] * d[0] + n[1] * d[1] > 0) n = [-n[0], -n[1]];
    const ci = -(n[0] * d[0] + n[1] * d[1]);
    if (bs.kind === 'mirror') d = [d[0] + 2 * ci * n[0], d[1] + 2 * ci * n[1]];
    else {
      const ng = bs.n || 1.5, eta = inside ? ng : 1 / ng, k2 = 1 - eta * eta * (1 - ci * ci);
      if (k2 < 0) d = [d[0] + 2 * ci * n[0], d[1] + 2 * ci * n[1]];
      else { const c2 = Math.sqrt(k2); d = [eta * d[0] + (eta * ci - c2) * n[0], eta * d[1] + (eta * ci - c2) * n[1]]; inside = !inside; }
    }
    d = norm(d); p = q;
  }
  return { pts, hit, dir: d };
}
/* where a traced polyline crosses the vertical line x = X (after the last bounce) */
function crossX(pts, X) {
  for (let i = pts.length - 1; i > 0; i--) {
    const a = pts[i - 1], b = pts[i];
    if ((a[0] - X) * (b[0] - X) <= 0 && a[0] !== b[0]) { const t = (X - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * t; }
  }
  return null;
}

/* ---------- objects ---------- */
/* drawn in local coordinates: base at (0,0), tip at (0,-hh). Images are drawn by scaling (|m|, m). */
function drawObj(x, kind, hh, o = {}) {
  x.save();
  if (o.alpha != null) x.globalAlpha = o.alpha;
  if (kind === 'candle') {
    const bw = Math.max(10, hh * .2), bh = hh * .7;
    const g = x.createLinearGradient(-bw / 2, 0, bw / 2, 0);
    g.addColorStop(0, o.virtual ? '#6d5fb8' : '#c9573a'); g.addColorStop(.45, o.virtual ? '#b7a8ff' : '#ff9a72'); g.addColorStop(1, o.virtual ? '#5a4e99' : '#a8452c');
    x.fillStyle = g; x.fillRect(-bw / 2, -bh, bw, bh);
    x.fillStyle = o.virtual ? '#cfc4ff' : '#ffc2a6'; x.beginPath(); x.ellipse(0, -bh, bw / 2, bw * .16, 0, 0, TAU); x.fill();
    x.strokeStyle = '#2b1a10'; x.lineWidth = Math.max(1.5, hh * .02); x.beginPath(); x.moveTo(0, -bh); x.lineTo(0, -bh - hh * .07); x.stroke();
    // flame, tip at -hh
    const fb = -bh - hh * .03, fw = hh * .085;
    x.beginPath(); x.moveTo(0, -hh); x.bezierCurveTo(fw * 1.2, -hh * .86, fw * 1.25, fb + hh * .02, 0, fb + hh * .02);
    x.bezierCurveTo(-fw * 1.25, fb + hh * .02, -fw * 1.2, -hh * .86, 0, -hh); x.closePath();
    const fg = x.createLinearGradient(0, -hh, 0, fb);
    fg.addColorStop(0, '#fff7cf'); fg.addColorStop(.55, '#ffcf55'); fg.addColorStop(1, '#ff7a1a');
    x.fillStyle = fg; x.fill();
    if (!o.virtual) { x.globalCompositeOperation = 'lighter'; const r = hh * .3, cy = -hh * .86; const gg = x.createRadialGradient(0, cy, 0, 0, cy, r); gg.addColorStop(0, 'rgba(255,200,90,.45)'); gg.addColorStop(1, 'rgba(255,200,90,0)'); x.fillStyle = gg; x.beginPath(); x.arc(0, cy, r, 0, TAU); x.fill(); }
  } else if (kind === 'tooth') {
    x.fillStyle = o.virtual ? '#cfc4ff' : '#f4efe4';
    x.beginPath(); x.moveTo(-hh * .25, -hh); x.quadraticCurveTo(0, -hh * 1.05, hh * .25, -hh);
    x.quadraticCurveTo(hh * .32, -hh * .6, hh * .16, -hh * .45); x.lineTo(hh * .1, 0); x.lineTo(hh * .02, -hh * .3); x.lineTo(-hh * .04, 0); x.lineTo(-hh * .14, -hh * .45);
    x.quadraticCurveTo(-hh * .32, -hh * .6, -hh * .25, -hh); x.fill();
  } else if (kind === 'tree') {
    x.fillStyle = '#7a5532'; x.fillRect(-hh * .05, -hh * .4, hh * .1, hh * .4);
    x.fillStyle = o.virtual ? '#b9a6ff' : '#3fbf6a'; x.beginPath(); x.moveTo(0, -hh); x.lineTo(hh * .26, -hh * .35); x.lineTo(-hh * .26, -hh * .35); x.closePath(); x.fill();
  } else {
    const col = o.col || (o.virtual ? COL.virt : COL.obj);
    x.strokeStyle = col; x.fillStyle = col; x.lineWidth = Math.max(3, hh * .05); x.lineCap = 'round';
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -hh + hh * .18); x.stroke();
    x.beginPath(); x.moveTo(0, -hh); x.lineTo(hh * .13, -hh + hh * .24); x.lineTo(-hh * .13, -hh + hh * .24); x.closePath(); x.fill();
  }
  x.restore();
}
function drawImage(x, kind, oh, xi, y0, m, virtual) {
  x.save(); x.translate(xi, y0); x.scale(Math.abs(m), m);
  drawObj(x, kind, oh, { virtual, alpha: virtual ? .62 : 1 });
  x.restore();
}

/* ---------- ideal bench ---------- */
function solve(type, f, u) {
  if (type === 'plane') return { v: -u, m: 1 };
  const F = (type === 'concave' || type === 'convexLens') ? f : -f;
  let d = 1 / F - 1 / u; if (Math.abs(d) < 2e-6) d = 2e-6 * (d < 0 ? -1 : 1);
  const v = 1 / d; return { v, m: -v / u };
}
function extendTo(p, d, w, hh) {
  let t = 1e6;
  if (d[0] > 0) t = Math.min(t, (w + 50 - p[0]) / d[0]); else if (d[0] < 0) t = Math.min(t, (-50 - p[0]) / d[0]);
  if (d[1] > 0) t = Math.min(t, (hh + 50 - p[1]) / d[1]); else if (d[1] < 0) t = Math.min(t, (-50 - p[1]) / d[1]);
  return [p[0] + d[0] * t, p[1] + d[1] * t];
}
/* B: {type, x0, y0, f, u, h, A, w, h2 (canvas h), rays:'principal'|n, showRays, labels, flow, obj, small} */
function bench(x, B) {
  const { type, x0, y0, f } = B, u = B.u, oh = B.h, A = B.A || 380, lens = isLens(type), R = 2 * f;
  const lab = B.labels !== false && App.labels, fs = B.small ? 18 : 22;
  const s = solve(type, f, u), xo = x0 - u, ty = y0 - oh;
  const xi = lens ? x0 + s.v : x0 - s.v, yi = y0 - s.m * oh;
  const inf = Math.abs(s.v) > 9000, real = s.v > 0 && type !== 'plane';
  // principal axis
  x.save(); x.strokeStyle = COL.axis; x.lineWidth = 1.5; x.setLineDash([14, 10]); x.beginPath(); x.moveTo(0, y0); x.lineTo(B.w, y0); x.stroke(); x.restore();
  if (lab && B.axisLabel !== false) tag(x, 'Principal axis', B.w - 110, y0 - 22, { size: fs - 2, col: COL.mute, bg: false });
  // focal marks
  const mk = (px, t, behind) => {
    if (px < -20 || px > B.w + 20 || B.marks === false) return;
    dot(x, px, y0, 6, behind ? 'rgba(255,255,255,.55)' : '#fff');
    if (lab) tag(x, t, px, y0 + 30, { size: fs, col: behind ? COL.mute : '#fff', weight: 700, bg: 'rgba(5,8,14,.6)' });
  };
  if (type === 'concave') { mk(x0 - f, 'F'); mk(x0 - R, 'C'); }
  if (type === 'convex') { mk(x0 + f, 'F', 1); mk(x0 + R, 'C', 1); }
  if (lens) { mk(x0 - f, 'F'); mk(x0 + f, "F'"); if (B.twoF !== false && type === 'convexLens') { mk(x0 - 2 * f, '2F'); mk(x0 + 2 * f, "2F'"); } }
  // element
  let surfX = () => x0;
  if (lens) drawLens(x, x0, y0, A, type, { bulge: B.small ? 14 : 22, edge: B.small ? 16 : 24 });
  else {
    const g = mirrorGeom(type, [x0, y0], [-1, 0], R, A); drawMirror(x, g);
    if (type !== 'plane') surfX = yy => { const s2 = yy - y0, k = Math.sqrt(R * R - s2 * s2); return type === 'concave' ? x0 - R + k : x0 + R - k; };
  }
  if (lab && B.marks !== false) tag(x, lens ? 'O' : 'P', x0 + (lens ? 0 : 18), y0 - 22, { size: fs - 2, col: COL.mute, bg: false });
  // rays
  if (B.showRays !== false) {
    const aims = [];
    if (!B.rays || B.rays === 'principal') {
      aims.push({ y: ty, col: COL.r1 });
      aims.push({ y: y0, col: COL.r2 });
      const fx = (type === 'convexLens' || type === 'concave') ? x0 - f : (type === 'concaveLens' || type === 'convex') ? x0 + f : null;
      if (fx != null && Math.abs(fx - xo) > 1) aims.push({ y: ty + (y0 - ty) * (x0 - xo) / (fx - xo), col: COL.r3 });
      if (type === 'plane') aims.push({ y: y0 + A * .3, col: COL.r3 });
    } else {
      const n = B.rays;
      for (let k = 0; k < n; k++) aims.push({ y: n === 1 ? ty : y0 - A * .46 + A * .92 * k / (n - 1), col: COL.ray });
    }
    const flow = B.flow;
    for (const a of aims) {
      if (Math.abs(a.y - y0) > A / 2) continue;
      const H = [surfX(a.y), a.y];
      let d = real || inf ? [xi - H[0], yi - H[1]] : [H[0] - xi, H[1] - yi];
      if (inf && !real) d = [H[0] - xi, H[1] - yi];
      d = norm(d);
      const end = extendTo(H, d, B.w, B.h2);
      const w = B.rays > 10 ? 1.6 : 2.4;
      beam(x, [[xo, ty], H, end], a.col, { flow, w, a: B.rays > 10 ? .8 : 1, as: B.small ? 9 : 12 });
      if (!real && !inf) beam(x, [H, [xi, yi]], a.col, { dash: [9, 9], a: .6 });
    }
  }
  // object
  x.save(); x.translate(xo, y0); drawObj(x, B.obj || 'candle', oh); x.restore();
  if (lab && B.objLabel !== false) tag(x, 'Object', xo, y0 + (B.small ? 50 : 62), { col: COL.obj, size: fs - 2, weight: 700 });
  // image
  const show = !inf && Math.abs(s.m) < 9 && xi > -300 && xi < B.w + 300;
  if (show) {
    drawImage(x, B.obj || 'candle', oh, xi, y0, s.m, !real);
    if (real && B.showRays !== false) glow(x, xi, yi, 26, 'rgba(255,240,200,.9)', .7);
    if (lab) {
      const ly = s.m > 0 ? y0 + 34 : y0 - 24;
      tag(x, real ? 'Real image' : 'Virtual image', xi, ly, { col: real ? COL.real : COL.virt, size: fs - 2, weight: 700 });
    }
  } else if (lab && inf) tag(x, 'Image very far away (at infinity)', B.w / 2, 40, { col: COL.real, size: fs });
  return { s, xi, yi, real, inf, xo, ty, show };
}
/* plain-language description of the image */
function describe(type, info, u, f) {
  const m = info.s.m, am = Math.abs(m), lens = isLens(type);
  const sw = info.inf ? 'Very large' : am > 1.05 ? 'Enlarged' : am < .95 ? 'Diminished' : 'Same size';
  const size = info.inf ? 'Very large' : am > 1.05 ? `Enlarged ×${am.toFixed(1)}` : am < .95 ? `Diminished ×${am.toFixed(2)}` : 'Same size ×1.0';
  const ori = info.inf ? '—' : m > 0 ? 'Erect' : 'Inverted';
  const kind = info.inf ? 'Very far away' : info.real ? 'Real' : 'Virtual';
  const v = info.s.v, vcm = Math.abs(v) / PX_CM;
  let where;
  if (info.inf) where = 'at infinity';
  else if (lens) where = `${vcm.toFixed(1)} cm ${v > 0 ? 'beyond lens' : 'object side'}`;
  else where = `${vcm.toFixed(1)} cm ${v > 0 ? 'in front' : 'behind'}`;
  let zone = '';
  if (type === 'concave' || type === 'convexLens') {
    const r = u / f, F = lens ? 'F' : 'F', C = lens ? '2F' : 'C';
    zone = Math.abs(r - 1) < .02 ? 'at ' + F : r < 1 ? `between ${lens ? 'O' : 'P'} and ${F}` : Math.abs(r - 2) < .02 ? 'at ' + C : r < 2 ? `between ${F} and ${C}` : `beyond ${C}`;
  }
  return {
    obj: `${(u / PX_CM).toFixed(1)} cm`, where, size, sw, ori, kind, zone,
    col: info.inf ? COL.mute : info.real ? COL.real : COL.virt, ocol: m > 0 ? COL.real : '#ffb0a0'
  };
}

/* ---------- scenery ---------- */
function drawSun(x, cx, cy, r, t) {
  glow(x, cx, cy, r * 4, 'rgba(255,200,90,.35)');
  glow(x, cx, cy, r * 2, 'rgba(255,230,160,.6)');
  x.save(); x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * TAU + t * .08, L = r * (1.6 + .25 * Math.sin(t * 2 + i * 1.7));
    x.strokeStyle = 'rgba(255,220,120,.35)'; x.lineWidth = 3; x.beginPath();
    x.moveTo(cx + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 1.15); x.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); x.stroke();
  }
  x.restore();
  const g = x.createRadialGradient(cx - r * .3, cy - r * .3, 0, cx, cy, r);
  g.addColorStop(0, '#fffbe8'); g.addColorStop(.7, '#ffe08a'); g.addColorStop(1, '#ffb43d');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
}
function bgGrid(x, w, hh, step = 60, a = .045) {
  x.save(); x.strokeStyle = `rgba(160,180,220,${a})`; x.lineWidth = 1;
  for (let i = step; i < w; i += step) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, hh); x.stroke(); }
  for (let j = step; j < hh; j += step) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); }
  x.restore();
}
/* simple torch (flashlight) pointing along angle a, nose at (px,py) */
function drawTorch(x, px, py, a, s = 1) {
  x.save(); x.translate(px, py); x.rotate(a); x.scale(s, s);
  const g = x.createLinearGradient(0, -20, 0, 20); g.addColorStop(0, '#5b6578'); g.addColorStop(.5, '#2a303c'); g.addColorStop(1, '#151a22');
  x.fillStyle = g; rrect(x, -150, -17, 112, 34, 8); x.fill();
  x.fillStyle = '#3b4352'; x.beginPath(); x.moveTo(-40, -17); x.lineTo(0, -26); x.lineTo(0, 26); x.lineTo(-40, 17); x.closePath(); x.fill();
  x.fillStyle = '#fff6d8'; rrect(x, -3, -24, 6, 48, 3); x.fill();
  x.fillStyle = '#c9cfda'; rrect(x, -110, -6, 22, 12, 4); x.fill();
  x.restore();
}

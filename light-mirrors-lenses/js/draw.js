'use strict';
/* Drawing helpers: glowing rays, labels, objects, mirrors, lenses, protractor, simple 3D projection. */
const COL = {
  ink: '#050a1c', cyan: '#3fe6ff', magenta: '#ff4fa8', amber: '#ffb84d', white: '#eef3ff', muted: '#9fb0d6',
  green: '#63f2a8', red: '#ff6b7a', violet: '#a98bff', axis: 'rgba(170,190,240,.55)', line: '#233466',
  r1: '#3fe6ff', r2: '#ffb84d', r3: '#63f2a8', r4: '#c59bff'
};
const FONT = {
  body: '"Atkinson Hyperlegible", "Segoe UI", Verdana, sans-serif',
  mono: '"JetBrains Mono", Consolas, monospace',
  disp: '"Unbounded", "Trebuchet MS", sans-serif'
};
const P = (x, y) => ({ x, y });

const D = {
  /* cached background: deep gradient, faint optical-bench grid */
  bg(o, { grid = true, top = '#0c1a44', bot = '#040817' } = {}) {
    const c = o.ctx;
    if (!o._bg) {
      const off = document.createElement('canvas'); off.width = o.cv.width; off.height = o.cv.height;
      const g = off.getContext('2d'); g.setTransform(o.k, 0, 0, o.k, 0, 0);
      const gr = g.createRadialGradient(o.w * .45, o.h * .42, 40, o.w * .5, o.h * .5, o.w * .8);
      gr.addColorStop(0, top); gr.addColorStop(1, bot);
      g.fillStyle = gr; g.fillRect(0, 0, o.w, o.h);
      if (grid) {
        g.strokeStyle = 'rgba(120,150,230,.07)'; g.lineWidth = 1;
        for (let x = 0; x <= o.w; x += 36) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, o.h); g.stroke(); }
        for (let y = 0; y <= o.h; y += 36) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(o.w, y + .5); g.stroke(); }
      }
      o._bg = off;
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(o._bg, 0, 0); c.restore();
  },
  path(c, pts) { c.beginPath(); c.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y); },
  /* glowing light ray polyline */
  ray(c, pts, col = COL.cyan, w = 3, { glow = true, dash = null, alpha = 1 } = {}) {
    if (!pts || pts.length < 2) return;
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = col;
    if (dash) c.setLineDash(dash);
    if (glow && !dash) {
      c.globalAlpha = alpha * .14; c.lineWidth = w * 5; D.path(c, pts); c.stroke();
      c.globalAlpha = alpha * .3; c.lineWidth = w * 2.2; D.path(c, pts); c.stroke();
    }
    c.globalAlpha = alpha; c.lineWidth = w; D.path(c, pts); c.stroke();
    c.restore();
  },
  line(c, a, b, col, w = 2, dash = null, alpha = 1) {
    c.save(); c.strokeStyle = col; c.lineWidth = w; c.globalAlpha = alpha; if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.restore();
  },
  /* arrowhead pointing from a to b, placed at fraction f of the segment */
  arrowOn(c, a, b, col, size = 13, f = .5) {
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy); if (L < size * 2.2) return;
    const ux = dx / L, uy = dy / L, mx = a.x + dx * f, my = a.y + dy * f;
    c.save(); c.fillStyle = col; c.beginPath();
    c.moveTo(mx + ux * size * .6, my + uy * size * .6);
    c.lineTo(mx - ux * size * .5 - uy * size * .55, my - uy * size * .5 + ux * size * .55);
    c.lineTo(mx - ux * size * .5 + uy * size * .55, my - uy * size * .5 - ux * size * .55);
    c.closePath(); c.fill(); c.restore();
  },
  arrows(c, pts, col, size) { for (let i = 0; i < pts.length - 1; i++) D.arrowOn(c, pts[i], pts[i + 1], col, size, i === 0 ? .55 : .45); },
  polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); return L; },
  /* polyline truncated to length len */
  upTo(pts, len) {
    const out = [pts[0]]; let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], L = Math.hypot(b.x - a.x, b.y - a.y);
      if (acc + L >= len) { const t = L ? (len - acc) / L : 0; out.push(P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)); return out; }
      out.push(b); acc += L;
    }
    return out;
  },
  pointAt(pts, s) { const u = D.upTo(pts, s); return u[u.length - 1]; },
  /* light pulses travelling along a polyline */
  pulses(c, pts, t, col, { speed = 260, gap = 120, r = 4.5, limit = Infinity } = {}) {
    if (LL.reduced) return;
    const L = Math.min(D.polyLen(pts), limit); if (L < 2) return;
    c.save(); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 12;
    for (let s = (t * speed) % gap; s < L; s += gap) { const q = D.pointAt(pts, s); c.beginPath(); c.arc(q.x, q.y, r, 0, Math.PI * 2); c.fill(); }
    c.restore();
  },
  text(c, str, x, y, { size = 22, col = COL.white, align = 'center', base = 'middle', weight = 700, font = 'body', bg = null, pad = 6, alpha = 1 } = {}) {
    c.save(); c.globalAlpha = alpha;
    c.font = `${weight} ${size}px ${FONT[font] || font}`; c.textAlign = align; c.textBaseline = base;
    if (bg) {
      const m = c.measureText(str), w = m.width + pad * 2, h = size + pad * 1.4;
      let bx = align === 'center' ? x - w / 2 : align === 'right' ? x - w + pad : x - pad;
      let by = base === 'middle' ? y - h / 2 : base === 'top' ? y - pad * .7 : y - h + pad * .7;
      c.fillStyle = bg; D.rrect(c, bx, by, w, h, 8); c.fill();
    }
    c.fillStyle = col; c.fillText(str, x, y); c.restore();
  },
  rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); },
  dot(c, x, y, r, col, glow = true) { c.save(); c.fillStyle = col; if (glow) { c.shadowColor = col; c.shadowBlur = 14; } c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.restore(); },
  /* labelled point on the principal axis (F, C, 2F, P...) */
  mark(c, x, y, label, col = COL.white, below = true) {
    D.line(c, P(x, y - 9), P(x, y + 9), col, 2.5);
    D.text(c, label, x, y + (below ? 26 : -26), { size: 21, col, font: 'mono', bg: 'rgba(4,8,23,.7)', pad: 4 });
  },
  axis(c, y, x0, x1, label = 'Principal axis') {
    D.line(c, P(x0, y), P(x1, y), COL.axis, 1.5, [10, 7]);
    if (label) D.text(c, label, x0 + 10, y - 16, { size: 16, col: COL.muted, align: 'left', weight: 400 });
  },
  /* vertical arrow standing on y0 (height hpx, positive = up) */
  arrowObj(c, x, y0, hpx, col, { dashed = false, w = 5, alpha = 1, label = null } = {}) {
    if (Math.abs(hpx) < 1) return;
    const tipY = y0 - hpx, dir = Math.sign(hpx), hs = Math.min(18, Math.abs(hpx) * .45);
    c.save(); c.globalAlpha = alpha; c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.lineCap = 'round';
    if (dashed) c.setLineDash([9, 7]);
    c.beginPath(); c.moveTo(x, y0); c.lineTo(x, tipY + dir * hs * .8); c.stroke();
    c.setLineDash([]);
    if (dashed) { c.globalAlpha = alpha * .35; }
    c.beginPath(); c.moveTo(x, tipY); c.lineTo(x - hs * .7, tipY + dir * hs); c.lineTo(x + hs * .7, tipY + dir * hs); c.closePath(); c.fill();
    if (dashed) { c.globalAlpha = alpha; c.lineWidth = 2.5; c.stroke(); }
    c.restore();
    if (label) D.text(c, label, x, tipY - dir * 22, { size: 20, col, bg: 'rgba(4,8,23,.7)' });
  },
  /* candle object/image. hpx<0 draws an inverted candle. ghost = virtual image look. */
  candle(c, x, y0, hpx, { ghost = false, real = false, t = 0, alpha = 1 } = {}) {
    if (Math.abs(hpx) < 2) return;
    const s = Math.abs(hpx), sg = Math.sign(hpx);
    c.save(); c.translate(x, y0); c.scale(1, sg); c.globalAlpha = alpha * (ghost ? .62 : 1);
    const bw = s * .26, bh = s * .66;
    // body
    const g = c.createLinearGradient(-bw / 2, 0, bw / 2, 0);
    if (real) { g.addColorStop(0, '#7fd8ff'); g.addColorStop(.5, '#d9f6ff'); g.addColorStop(1, '#6fb8e8'); }
    else { g.addColorStop(0, '#d9c7a6'); g.addColorStop(.45, '#fff6e3'); g.addColorStop(1, '#c9b38a'); }
    c.fillStyle = g; D.rrect(c, -bw / 2, -bh, bw, bh, Math.min(6, bw * .2)); c.fill();
    if (ghost) { c.setLineDash([7, 6]); c.strokeStyle = COL.magenta; c.lineWidth = 2.5 / Math.max(.5, 1); c.stroke(); c.setLineDash([]); }
    // drip
    c.fillStyle = real ? '#e9fbff' : '#fffaf0'; c.beginPath(); c.ellipse(-bw * .18, -bh + s * .04, bw * .12, s * .06, 0, 0, Math.PI * 2); c.fill();
    // wick
    c.strokeStyle = '#2b1d10'; c.lineWidth = Math.max(1.5, s * .02); c.beginPath(); c.moveTo(0, -bh); c.lineTo(0, -bh - s * .06); c.stroke();
    // flame (flickers)
    const fl = 1 + Math.sin(t * 13) * .05 + Math.sin(t * 7.3) * .04;
    const fy = -bh - s * .06, fh = s * .28 * fl, fw = s * .085;
    const fg = c.createRadialGradient(0, fy - fh * .35, 1, 0, fy - fh * .35, fh * .7);
    fg.addColorStop(0, '#fffbe0'); fg.addColorStop(.35, '#ffd25a'); fg.addColorStop(.75, 'rgba(255,120,30,.85)'); fg.addColorStop(1, 'rgba(255,80,20,0)');
    c.fillStyle = fg; c.beginPath(); c.moveTo(0, fy - fh);
    c.bezierCurveTo(fw * 1.2, fy - fh * .45, fw, fy, 0, fy + s * .01);
    c.bezierCurveTo(-fw, fy, -fw * 1.2, fy - fh * .45, 0, fy - fh); c.fill();
    if (!ghost) { c.globalAlpha = alpha * .25; const hg = c.createRadialGradient(0, fy - fh * .4, 1, 0, fy - fh * .4, s * .55); hg.addColorStop(0, 'rgba(255,200,90,.9)'); hg.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = hg; c.beginPath(); c.arc(0, fy - fh * .4, s * .55, 0, Math.PI * 2); c.fill(); }
    c.restore();
  },
  /* spherical / plane mirror. m = {type, P:{x,y}, R, a, rot} (rot in radians, 0 = reflecting side faces left) */
  mirror(c, m, { realistic = false, hatch = true } = {}) {
    const pts = OPT.mirrorPoints(m, 48);
    const ax = OPT.mirrorAxis(m), back = P(-ax.x, -ax.y);
    c.save(); c.lineCap = 'round';
    if (hatch) {
      c.strokeStyle = 'rgba(160,175,210,.55)'; c.lineWidth = 2;
      for (let i = 2; i < pts.length - 1; i += 3) {
        const q = pts[i]; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x + back.x * 14 + ax.y * 9, q.y + back.y * 14 - ax.x * 9); c.stroke();
      }
    }
    // silver body
    c.strokeStyle = realistic ? '#cfd8ea' : '#dfe8ff'; c.lineWidth = realistic ? 10 : 6; c.shadowColor = 'rgba(160,220,255,.6)'; c.shadowBlur = 14;
    D.path(c, pts); c.stroke(); c.shadowBlur = 0;
    // reflecting edge highlight
    c.strokeStyle = 'rgba(63,230,255,.9)'; c.lineWidth = 2;
    D.path(c, pts.map(q => P(q.x + ax.x * 3, q.y + ax.y * 3))); c.stroke();
    c.restore();
  },
  /* thin-lens symbol drawn as a real lens outline. type 'convex' | 'concave' */
  lens(c, x, y, a, type, { bulge = 26, alpha = 1 } = {}) {
    c.save(); c.globalAlpha = alpha; c.beginPath();
    if (type === 'convex') {
      c.moveTo(x, y - a); c.quadraticCurveTo(x + bulge * 2, y, x, y + a); c.quadraticCurveTo(x - bulge * 2, y, x, y - a);
    } else {
      const e = bulge * .9, k = 6;
      c.moveTo(x - e, y - a); c.lineTo(x + e, y - a); c.quadraticCurveTo(x + k - (e - k), y, x + e, y + a);
      c.lineTo(x - e, y + a); c.quadraticCurveTo(x - k + (e - k), y, x - e, y - a);
    }
    c.closePath();
    const g = c.createLinearGradient(x - 40, y - a, x + 40, y + a);
    g.addColorStop(0, 'rgba(120,230,255,.30)'); g.addColorStop(.5, 'rgba(160,240,255,.12)'); g.addColorStop(1, 'rgba(90,200,255,.28)');
    c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(150,235,255,.95)'; c.lineWidth = 2.5; c.stroke();
    c.restore();
  },
  /* protractor centred on O, angles measured from the normal (straight up) */
  protractor(c, O, r) {
    c.save();
    c.fillStyle = 'rgba(63,230,255,.05)'; c.strokeStyle = 'rgba(63,230,255,.45)'; c.lineWidth = 2;
    c.beginPath(); c.arc(O.x, O.y, r, Math.PI, 2 * Math.PI); c.closePath(); c.fill(); c.stroke();
    for (let d = -90; d <= 90; d += 5) {
      const a = d * DEG, big = d % 10 === 0, L = d % 30 === 0 ? 22 : big ? 15 : 8;
      const sx = O.x + Math.sin(a) * r, sy = O.y - Math.cos(a) * r;
      const ex = O.x + Math.sin(a) * (r - L), ey = O.y - Math.cos(a) * (r - L);
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
      if (d % 30 === 0 && Math.abs(d) < 90) D.text(c, Math.abs(d) + '°', O.x + Math.sin(a) * (r - 42) + (d === 0 ? 22 : 0), O.y - Math.cos(a) * (r - 42), { size: 17, col: 'rgba(160,230,255,.9)', font: 'mono', weight: 500 });
    }
    c.restore();
  },
  /* angle arc between two directions (angles in canvas radians) */
  angleArc(c, O, r, a0, a1, col, label, lr = r + 30) {
    c.save(); c.strokeStyle = col; c.lineWidth = 3; c.beginPath();
    let s = a0, e = a1; if (e < s) [s, e] = [e, s];
    c.arc(O.x, O.y, r, s, e); c.stroke();
    c.globalAlpha = .14; c.fillStyle = col; c.beginPath(); c.moveTo(O.x, O.y); c.arc(O.x, O.y, r, s, e); c.closePath(); c.fill();
    c.restore();
    if (label) { const m = (s + e) / 2; D.text(c, label, O.x + Math.cos(m) * lr, O.y + Math.sin(m) * lr, { size: 21, col, font: 'mono', bg: 'rgba(4,8,23,.75)', pad: 5 }); }
  },
  eye(c, x, y, s = 1, dir = 1) {
    c.save(); c.translate(x, y); c.scale(dir * s, s);
    c.fillStyle = '#f5f0ea'; c.beginPath(); c.moveTo(-26, 0); c.quadraticCurveTo(0, -20, 26, 0); c.quadraticCurveTo(0, 20, -26, 0); c.fill();
    c.fillStyle = '#3a6fd8'; c.beginPath(); c.arc(-6, 0, 10, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#081024'; c.beginPath(); c.arc(-8, 0, 5, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#2a1a10'; c.lineWidth = 3; c.beginPath(); c.moveTo(-26, 0); c.quadraticCurveTo(0, -20, 26, 0); c.stroke();
    c.restore();
  },
  /* off-screen indicator for images that fall outside the canvas */
  offscreen(c, o, x, y, text) {
    const cx = clamp(x, 30, o.w - 30), cy = clamp(y, 40, o.h - 40);
    const ang = Math.atan2(y - cy, x - cx);
    c.save(); c.translate(cx, cy); c.rotate(ang); c.fillStyle = COL.magenta;
    c.beginPath(); c.moveTo(18, 0); c.lineTo(-8, -12); c.lineTo(-8, 12); c.closePath(); c.fill(); c.restore();
    D.text(c, text, clamp(cx + (cx < o.w / 2 ? 30 : -30), 20, o.w - 20), clamp(cy + 34, 20, o.h - 20), { size: 18, col: COL.magenta, align: cx < o.w / 2 ? 'left' : 'right', bg: 'rgba(4,8,23,.85)' });
  },
  sunGlow(c, x, y, r) {
    const g = c.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, 'rgba(255,250,220,1)'); g.addColorStop(.18, 'rgba(255,220,120,.95)'); g.addColorStop(.45, 'rgba(255,170,60,.35)'); g.addColorStop(1, 'rgba(255,150,40,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
};

/* Minimal 3D camera: orbit (yaw, pitch) + perspective. World: x right, y up, z towards viewer. */
function Cam3D(cx, cy, scale) {
  const cam = { yaw: -.6, pitch: .35, dist: 12, scale, cx, cy, zoom: 1 };
  cam.tf = p => {
    const cy_ = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const x1 = p[0] * cy_ + p[2] * sy, z1 = -p[0] * sy + p[2] * cy_;
    const y2 = p[1] * cp - z1 * sp, z2 = p[1] * sp + z1 * cp;
    return [x1, y2, z2];
  };
  cam.proj = p => {
    const [x, y, z] = cam.tf(p);
    const k = cam.scale * cam.zoom * cam.dist / (cam.dist - z);
    return { x: cam.cx + x * k, y: cam.cy - y * k, z };
  };
  cam.dragOn = (o, onChange) => {
    let last = null;
    o.cv.addEventListener('pointerdown', e => { last = o.pt(e); o.cv.setPointerCapture(e.pointerId); o.cv.style.cursor = 'grabbing'; cam.dragging = true; });
    o.cv.addEventListener('pointermove', e => {
      if (!last) { o.cv.style.cursor = 'grab'; return; }
      const p = o.pt(e); cam.yaw += (p.x - last.x) * .008; cam.pitch = clamp(cam.pitch + (p.y - last.y) * .008, -1.45, 1.45); last = p; onChange && onChange();
    });
    const up = () => { last = null; cam.dragging = false; o.cv.style.cursor = 'grab'; };
    o.cv.addEventListener('pointerup', up); o.cv.addEventListener('pointercancel', up);
    o.cv.addEventListener('wheel', e => { e.preventDefault(); cam.zoom = clamp(cam.zoom * (e.deltaY > 0 ? .92 : 1.08), .5, 2.4); onChange && onChange(); }, { passive: false });
  };
  return cam;
}
const V3 = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  norm: a => { const L = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / L, a[1] / L, a[2] / L]; },
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  rotY: (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)]
};
/* Draw a list of 3D polygons with painter's sorting. poly = {pts:[[x,y,z]...], fill, stroke, lw, alpha} */
function drawPolys(c, cam, polys) {
  const items = polys.map(pl => {
    const sp = pl.pts.map(cam.proj);
    const z = sp.reduce((s, q) => s + q.z, 0) / sp.length + (pl.bias || 0);
    return { pl, sp, z };
  }).sort((a, b) => a.z - b.z);
  for (const { pl, sp } of items) {
    c.save(); c.globalAlpha = pl.alpha == null ? 1 : pl.alpha;
    c.beginPath(); c.moveTo(sp[0].x, sp[0].y); for (let i = 1; i < sp.length; i++) c.lineTo(sp[i].x, sp[i].y); c.closePath();
    if (pl.fill) { c.fillStyle = pl.fill; c.fill(); }
    if (pl.stroke) { c.strokeStyle = pl.stroke; c.lineWidth = pl.lw || 1; c.stroke(); }
    c.restore();
  }
}

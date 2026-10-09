'use strict';
/* Geometric optics used by every simulation.

   Two models are used, and each scene says which one it shows:
   1. EXACT ray tracing: law of reflection (r = d - 2(d·n)n) at a true circular mirror,
      and Snell's law (n1 sin i = n2 sin r) at true spherical glass surfaces.
   2. PARAXIAL (school ray-diagram) model, New Cartesian sign convention:
      distances are measured from the pole P / optical centre O, positive in the direction
      the incident light travels (left → right), negative against it; heights above the axis are positive.
        mirror: 1/v + 1/u = 1/f,  m = -v/u,  f = R/2 (concave f < 0, convex f > 0)
        lens:   1/v - 1/u = 1/f,  m =  v/u   (convex f > 0, concave f < 0)
      A real object on the left therefore has u < 0. */
const V = {
  add: (a, b) => P(a.x + b.x, a.y + b.y), sub: (a, b) => P(a.x - b.x, a.y - b.y), mul: (a, k) => P(a.x * k, a.y * k),
  dot: (a, b) => a.x * b.x + a.y * b.y, len: a => Math.hypot(a.x, a.y),
  norm: a => { const L = Math.hypot(a.x, a.y) || 1; return P(a.x / L, a.y / L); },
  rot: (a, t) => P(a.x * Math.cos(t) - a.y * Math.sin(t), a.x * Math.sin(t) + a.y * Math.cos(t)),
  dist: (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
};

const OPT = {
  /* ---------- exact geometry: mirrors ---------- */
  mirrorAxis: m => V.rot(P(-1, 0), m.rot || 0),     // from pole towards the reflecting (front) side
  mirrorUp: m => V.rot(P(0, -1), m.rot || 0),
  mirrorCenter(m) { const ax = OPT.mirrorAxis(m); return m.type === 'concave' ? V.add(m.P, V.mul(ax, m.R)) : V.sub(m.P, V.mul(ax, m.R)); },
  mirrorFocus(m) { const ax = OPT.mirrorAxis(m); return m.type === 'concave' ? V.add(m.P, V.mul(ax, m.R / 2)) : V.sub(m.P, V.mul(ax, m.R / 2)); },
  mirrorPoints(m, n = 40) {
    const ax = OPT.mirrorAxis(m), up = OPT.mirrorUp(m), out = [];
    for (let i = 0; i <= n; i++) {
      const h = -m.a + 2 * m.a * i / n;
      const sag = m.type === 'plane' ? 0 : m.R - Math.sqrt(Math.max(0, m.R * m.R - h * h));
      const s = m.type === 'concave' ? sag : -sag;
      out.push(V.add(V.add(m.P, V.mul(ax, s)), V.mul(up, h)));
    }
    return out;
  },
  /* first intersection of ray p + t·d (d unit) with the mirror surface; returns {pt, n, t} or null */
  hitMirror(m, p, d) {
    const ax = OPT.mirrorAxis(m), up = OPT.mirrorUp(m);
    if (m.type === 'plane') {
      const den = V.dot(d, ax); if (Math.abs(den) < 1e-9) return null;
      const t = V.dot(V.sub(m.P, p), ax) / den; if (t < 1e-6) return null;
      const pt = V.add(p, V.mul(d, t)); if (Math.abs(V.dot(V.sub(pt, m.P), up)) > m.a + 1e-6) return null;
      return { pt, n: ax, t };
    }
    const C = OPT.mirrorCenter(m), f = V.sub(p, C), b = V.dot(f, d), cc = V.dot(f, f) - m.R * m.R, disc = b * b - cc;
    if (disc < 0) return null;
    const sq = Math.sqrt(disc), pd = V.norm(V.sub(m.P, C)), cosMax = Math.sqrt(Math.max(0, 1 - (m.a / m.R) ** 2));
    for (const t of [-b - sq, -b + sq]) {
      if (t < 1e-6) continue;
      const pt = V.add(p, V.mul(d, t));
      if (V.dot(V.norm(V.sub(pt, C)), pd) >= cosMax - 1e-9) return { pt, n: V.norm(V.sub(pt, C)), t };
    }
    return null;
  },
  reflect: (d, n) => { const k = 2 * V.dot(d, n); return V.norm(P(d.x - k * n.x, d.y - k * n.y)); },
  /* Snell's law in vector form; returns null for total internal reflection */
  refract(d, n, n1, n2) {
    if (V.dot(d, n) > 0) n = V.mul(n, -1);
    const cosi = -V.dot(n, d), eta = n1 / n2, k = 1 - eta * eta * (1 - cosi * cosi);
    if (k < 0) return null;
    return V.norm(V.add(V.mul(d, eta), V.mul(n, eta * cosi - Math.sqrt(k))));
  },
  traceMirror(m, p, d, far = 2400) {
    const h = OPT.hitMirror(m, p, d);
    if (!h) return { pts: [p, V.add(p, V.mul(d, far))], hit: null };
    const r = OPT.reflect(d, h.n);
    return { pts: [p, h.pt, V.add(h.pt, V.mul(r, far))], hit: h.pt, out: r, n: h.n };
  },

  /* ---------- exact geometry: lenses (spherical glass surfaces) ---------- */
  lensSurfaces({ type, X, Y, R, tc }) {
    if (type === 'plate') return [{ kind: 'line', x: X - tc / 2 }, { kind: 'line', x: X + tc / 2 }];
    if (type === 'convex') return [{ kind: 'circle', c: P(X - tc / 2 + R, Y), R, side: -1 }, { kind: 'circle', c: P(X + tc / 2 - R, Y), R, side: 1 }];
    return [{ kind: 'circle', c: P(X - tc / 2 - R, Y), R, side: 1 }, { kind: 'circle', c: P(X + tc / 2 + R, Y), R, side: -1 }];
  },
  surfX(s, dy) { return s.kind === 'line' ? s.x : s.c.x + s.side * Math.sqrt(Math.max(0, s.R * s.R - dy * dy)); },
  hitSurface(s, p, d, a, Y) {
    if (s.kind === 'line') {
      if (Math.abs(d.x) < 1e-9) return null;
      const t = (s.x - p.x) / d.x; if (t < 1e-6) return null;
      const pt = V.add(p, V.mul(d, t)); if (Math.abs(pt.y - Y) > a) return null;
      return { pt, n: P(1, 0) };
    }
    const f = V.sub(p, s.c), b = V.dot(f, d), cc = V.dot(f, f) - s.R * s.R, disc = b * b - cc;
    if (disc < 0) return null;
    const sq = Math.sqrt(disc);
    for (const t of [-b - sq, -b + sq]) {
      if (t < 1e-6) continue;
      const pt = V.add(p, V.mul(d, t));
      if (Math.sign(pt.x - s.c.x) === s.side && Math.abs(pt.y - Y) <= a) return { pt, n: V.norm(V.sub(pt, s.c)) };
    }
    return null;
  },
  lensOutline(L, n = 30) {
    const [s1, s2] = OPT.lensSurfaces(L), pts = [];
    for (let i = 0; i <= n; i++) { const dy = -L.a + 2 * L.a * i / n; pts.push(P(OPT.surfX(s1, dy), L.Y + dy)); }
    for (let i = n; i >= 0; i--) { const dy = -L.a + 2 * L.a * i / n; pts.push(P(OPT.surfX(s2, dy), L.Y + dy)); }
    return pts;
  },
  traceLens(L, p, d, nGlass = 1.5, far = 2400) {
    const [s1, s2] = OPT.lensSurfaces(L);
    const h1 = OPT.hitSurface(s1, p, d, L.a, L.Y);
    if (!h1) return { pts: [p, V.add(p, V.mul(d, far))], miss: true };
    const d1 = OPT.refract(d, h1.n, 1, nGlass);
    const h2 = OPT.hitSurface(s2, V.add(h1.pt, V.mul(d1, .01)), d1, L.a + 40, L.Y);
    if (!h2) return { pts: [p, h1.pt], miss: true };
    const d2 = OPT.refract(d1, h2.n, nGlass, 1);
    if (!d2) return { pts: [p, h1.pt, h2.pt], tir: true };
    return { pts: [p, h1.pt, h2.pt, V.add(h2.pt, V.mul(d2, far))], exit: h2.pt, out: d2, n1: h1.n, n2: h2.n, in1: h1.pt };
  },
  /* paraxial focus found numerically by tracing a ray very close to the axis */
  lensFocusX(L, nGlass = 1.5) {
    const r = OPT.traceLens(L, P(L.X - 900, L.Y - .5), P(1, 0), nGlass);
    if (!r.out || Math.abs(r.out.y) < 1e-12) return null;
    const t = (L.Y - r.exit.y) / r.out.y; return r.exit.x + r.out.x * t;
  },

  /* ---------- paraxial image formulas (New Cartesian sign convention) ---------- */
  mirrorImage(u, f) {
    if (!isFinite(f)) return { v: -u, m: 1, inf: false };
    const d = 1 / f - 1 / u;
    if (Math.abs(d) < 1e-6) return { v: Infinity, m: Infinity, inf: true };
    const v = 1 / d; return { v, m: -v / u, inf: false };
  },
  lensImage(u, f) {
    const d = 1 / f + 1 / u;
    if (Math.abs(d) < 1e-6) return { v: Infinity, m: Infinity, inf: true };
    const v = 1 / d; return { v, m: v / u, inf: false };
  },
  /* Liang–Barsky clip of segment a→b to box {x0,y0,x1,y1} */
  clip(a, b, bx) {
    let t0 = 0, t1 = 1; const dx = b.x - a.x, dy = b.y - a.y;
    const pq = [[-dx, a.x - bx.x0], [dx, bx.x1 - a.x], [-dy, a.y - bx.y0], [dy, bx.y1 - a.y]];
    for (const [p, q] of pq) {
      if (Math.abs(p) < 1e-12) { if (q < 0) return null; continue; }
      const r = q / p;
      if (p < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; }
    }
    return [P(a.x + dx * t0, a.y + dy * t0), P(a.x + dx * t1, a.y + dy * t1)];
  },

  /* School ray-diagram construction. Every outgoing ray is aimed through the image point
     given by the formula (real image) or away from it (virtual image), so all rays agree with the model.
     cfg: {kind, type, X, Y, s, f (cm, signed), T (object tip px), img, mirror (geom for hit points), a, on, box} */
  labRays(cfg) {
    const { kind, type, X, Y, s, f, T, img, on, box } = cfg;
    const out = [];
    const I = img.inf ? null : P(X + img.v * s, Y - img.m * (Y - T.y));
    const Fp = isFinite(f) ? P(X + f * s, Y) : null;              // mirror: focus; lens: first focus is X - f·s
    const specs = [];
    if (kind === 'mirror') {
      if (type === 'plane') {
        specs.push({ id: 'r1', col: COL.r1, Q: 'par', label: 'Along the normal → reflects back on itself' });
        specs.push({ id: 'r2', col: COL.r2, Q: P(X, Y - (Y - T.y) + 150), label: 'Any ray → equal angles' });
        specs.push({ id: 'r4', col: COL.r4, Q: P(X, Y), label: 'Ray to the pole P' });
      } else {
        const cv = type === 'concave';
        specs.push({ id: 'r1', col: COL.r1, Q: 'par', label: cv ? 'Parallel → passes through F' : 'Parallel → seems to come from F' });
        specs.push({ id: 'r2', col: COL.r2, Q: Fp, label: cv ? 'Through F → comes back parallel' : 'Aimed at F → comes back parallel' });
        specs.push({ id: 'r3', col: COL.r3, Q: P(X + 2 * f * s, Y), label: cv ? 'Through C → retraces its path' : 'Aimed at C → retraces its path' });
        specs.push({ id: 'r4', col: COL.r4, Q: P(X, Y), label: 'Strikes pole P → equal angles with axis' });
      }
    } else {
      const cvx = type === 'convex';
      specs.push({ id: 'r1', col: COL.r1, Q: 'par', label: cvx ? 'Parallel → passes through F₂' : 'Parallel → seems to come from F₁' });
      specs.push({ id: 'r2', col: COL.r2, Q: P(X - f * s, Y), label: cvx ? 'Through F₁ → comes out parallel' : 'Aimed at F₂ → comes out parallel' });
      specs.push({ id: 'r3', col: COL.r3, Q: P(X, Y), label: 'Through optical centre O → goes straight' });
    }
    // direction of the "reference" ray (through C for a mirror, through O for a lens) for the image-at-infinity case
    const refQ = kind === 'mirror' ? (isFinite(f) ? P(X + 2 * f * s, Y) : null) : P(X, Y);
    let refDir = null;
    if (refQ && Math.abs(refQ.x - T.x) > .5) { refDir = V.norm(V.sub(refQ, T)); if (refDir.x < 0) refDir = V.mul(refDir, -1); }
    if (img.inf && kind === 'mirror' && refDir) refDir = V.mul(refDir, -1);
    if (img.inf && kind === 'mirror' && !refDir) { const C = P(X + 2 * f * s, Y); refDir = V.norm(V.sub(T, C)); }

    for (const sp of specs) {
      if (on && on[sp.id] === false) continue;
      let d;
      if (sp.Q === 'par') d = P(1, 0);
      else { if (Math.abs(sp.Q.x - T.x) < 1 && Math.abs(sp.Q.y - T.y) < 1) continue; d = V.norm(V.sub(sp.Q, T)); if (d.x < 0) d = V.mul(d, -1); }
      if (d.x < .06) continue;
      let H;
      if (kind === 'mirror') {
        const hit = OPT.hitMirror(cfg.mirror, T, d);
        if (!hit) { out.push({ ...sp, miss: true }); continue; }
        H = hit.pt;
      } else {
        H = V.add(T, V.mul(d, (X - T.x) / d.x));
        if (Math.abs(H.y - Y) > cfg.a) { out.push({ ...sp, miss: true }); continue; }
      }
      let dir, back = null;
      if (img.inf) dir = refDir;
      else {
        const real = kind === 'mirror' ? img.v < 0 : img.v > 0;
        if (V.dist(I, H) < .5) dir = kind === 'mirror' ? P(-1, 0) : P(1, 0);
        else if (real) dir = V.norm(V.sub(I, H));
        else { dir = V.norm(V.sub(H, I)); back = OPT.clip(H, I, box); }
      }
      const far = V.add(H, V.mul(dir, 5000));
      const outSeg = OPT.clip(H, far, box);
      out.push({ ...sp, inc: [T, H], out: outSeg ? [H, outSeg[1]] : [H, H], back, H });
    }
    return { rays: out, I };
  },

  /* words for the image, given u, v, m in cm */
  describe(kind, type, u, f, img) {
    const tol = .35;
    if (img.inf) return { where: 'At infinity (very, very far)', nature: '—', orient: '—', size: 'Highly enlarged (no clear image)', inf: true };
    const real = kind === 'mirror' ? img.v < 0 : img.v > 0;
    const am = Math.abs(img.m);
    const size = am > 1.03 ? 'Enlarged' : am < .97 ? 'Diminished' : 'Same size';
    let where = '';
    const U = Math.abs(u), Fa = Math.abs(f);
    if (kind === 'mirror') {
      if (type === 'plane') where = 'Behind the mirror, as far as the object is in front';
      else if (type === 'convex') where = 'Behind the mirror, between P and F';
      else {
        if (U > 2 * Fa + tol) where = 'Between F and C (in front of mirror)';
        else if (U >= 2 * Fa - tol) where = 'At C (in front of mirror)';
        else if (U > Fa + tol) where = 'Beyond C (in front of mirror)';
        else where = 'Behind the mirror';
      }
    } else {
      if (type === 'concave') where = 'Same side as object, between F₁ and O';
      else {
        if (U > 2 * Fa + tol) where = 'Between F₂ and 2F₂ (other side)';
        else if (U >= 2 * Fa - tol) where = 'At 2F₂ (other side)';
        else if (U > Fa + tol) where = 'Beyond 2F₂ (other side)';
        else where = 'Same side as the object';
      }
    }
    return { where, nature: real ? 'Real' : 'Virtual', real, orient: img.m > 0 ? 'Erect (upright)' : 'Inverted', size, inf: false };
  },
  objectZone(kind, type, u, f) {
    const U = Math.abs(u), Fa = Math.abs(f), tol = .35;
    if (kind === 'mirror' && type !== 'concave') return 'In front of the mirror';
    if (kind === 'lens' && type === 'concave') return 'In front of the lens';
    const Fn = kind === 'mirror' ? ['F', 'C'] : ['F₁', '2F₁'];
    if (U > 2 * Fa + tol) return 'Beyond ' + Fn[1];
    if (U >= 2 * Fa - tol) return 'At ' + Fn[1];
    if (U > Fa + tol) return 'Between ' + Fn[0] + ' and ' + Fn[1];
    if (U >= Fa - tol) return 'At ' + Fn[0];
    return 'Between ' + Fn[0] + ' and ' + (kind === 'mirror' ? 'P' : 'O');
  },

  /* paraxial ray transfer through thin lenses (math coords: y up). lenses: [{x, f, a}] */
  thinTrace(x0, y0, slope, lenses, xEnd) {
    const pts = [[x0, y0]]; let x = x0, y = y0, s = slope;
    for (const L of lenses) {
      if (L.x <= x) continue;
      y = y + s * (L.x - x); x = L.x; pts.push([x, y]);
      if (L.a && Math.abs(y) > L.a) return { pts, blocked: true, slope: s };
      s = s - y / L.f;
    }
    if (xEnd != null) { y = y + s * (xEnd - x); pts.push([xEnd, y]); }
    return { pts, slope: s };
  }
};

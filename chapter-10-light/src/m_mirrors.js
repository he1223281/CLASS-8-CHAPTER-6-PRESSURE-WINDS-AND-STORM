/* ================= Intro + Modules 1–5: mirrors ================= */

/* a simple standing person, base at (0,0), height hh */
function drawPerson(x, hh, shirt = '#f2c230', o = {}) {
  const u = hh / 100; x.save(); if (o.alpha != null) x.globalAlpha = o.alpha;
  x.fillStyle = '#3b4a6b'; rrect(x, -12 * u, -46 * u, 10 * u, 46 * u, 3 * u); x.fill(); rrect(x, 2 * u, -46 * u, 10 * u, 46 * u, 3 * u); x.fill();
  x.fillStyle = shirt; rrect(x, -16 * u, -78 * u, 32 * u, 36 * u, 8 * u); x.fill();
  x.fillStyle = '#c98d63'; rrect(x, -22 * u, -76 * u, 7 * u, 30 * u, 3 * u); x.fill(); rrect(x, 15 * u, -76 * u, 7 * u, 30 * u, 3 * u); x.fill();
  x.fillStyle = '#d9a077'; x.beginPath(); x.arc(0, -88 * u, 11 * u, 0, TAU); x.fill();
  x.fillStyle = '#20160f'; x.beginPath(); x.arc(0, -91 * u, 11.5 * u, Math.PI * 1.02, Math.PI * 1.98); x.fill();
  x.restore();
}
/* field of view seen by an eye in a mirror: returns reflected-ray polygon + edge rays */
function fovFan(eye, type, V, ax, R, A, L = 2400, n = 24) {
  const g = mirrorGeom(type, V, ax, R, A * .999, n), s = mirrorSurf(type, V, ax, R, A), rays = [];
  for (const p of g.pts) {
    const r = trace(eye, [p[0] - eye[0], p[1] - eye[1]], [s], { len: L, max: 2 });
    if (r.pts.length >= 3) rays.push(r.pts);
  }
  return rays;
}
function drawFan(x, rays, col, a = .16) {
  if (rays.length < 2) return;
  x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = col; x.globalAlpha = a;
  for (let i = 1; i < rays.length; i++) {
    const p = rays[i - 1], q = rays[i];
    x.beginPath(); x.moveTo(p[1][0], p[1][1]); x.lineTo(p[2][0], p[2][1]); x.lineTo(q[2][0], q[2][1]); x.lineTo(q[1][0], q[1][1]); x.closePath(); x.fill();
  }
  x.restore();
  for (const r of [rays[0], rays[rays.length - 1]]) beam(x, [r[0], r[1], r[2]], col, { w: 2, arrows: false, a: .9 });
}
function inFan(rays, P) {
  for (let i = 1; i < rays.length; i++) {
    const a = rays[i - 1], b = rays[i];
    if (pointInPoly(P, [a[1], a[2], b[2], b[1]])) return i / rays.length;
  }
  return -1;
}
function pointInPoly(p, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (((a[1] > p[1]) !== (b[1] > p[1])) && (p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0])) c = !c;
  }
  return c;
}

/* ---------- INTRO ---------- */
frame({
  mod: 'intro', full: true, mapTitle: 'Introduction — Meena at the science centre',
  build(b, f) {
    b.style.cssText = 'left:0;right:0;top:0;bottom:0';
    f.c = canvas(b, 1920, 996, 'position:absolute;left:0;top:0;border-radius:0');
    const t = h('div', { class: 'abs', style: 'left:90px;top:84px;width:760px' },
      h('div', { class: 'kick' }, h('b', null, 'GRADE 8 · CURIOSITY · CHAPTER 10')),
      h('h1', { style: 'font-size:104px;line-height:.95;margin:26px 0 0;font-weight:800;letter-spacing:-.04em' }, 'Light:', h('br'), h('span', { style: 'color:var(--ray)' }, 'Mirrors'), ' and', h('br'), 'Lenses'),
      h('p', { style: 'font-size:30px;color:var(--mute);margin:26px 0 0;max-width:640px' }, 'An interactive optics laboratory. Move objects, bend light and watch images form.'));
    const q = h('div', { class: 'abs', style: 'left:90px;bottom:60px;width:760px' },
      h('div', { class: 'kick', style: 'margin-bottom:16px' }, 'PROBE AND PONDER'),
      ...['Can mirrors give enlarged or diminished images?', 'Why do side-view mirrors say “Objects in mirror are closer than they appear”?', 'Why is there a curved line on some reading glasses?']
        .map((s, i) => h('div', { class: 'card', style: `margin-top:12px;font-size:25px;opacity:0;transition:opacity .8s ${0.6 + i * .5}s,transform .8s ${0.6 + i * .5}s;transform:translateY(16px)`, 'data-q': 1 }, s)));
    b.append(t, q);
    f.qs = q.querySelectorAll('[data-q]');
    b.append(h('div', { class: 'abs', style: 'right:70px;top:46px;text-align:right;color:var(--mute);font-size:22px' }, 'Press ', h('b', { style: 'color:#fff' }, 'F'), ' for fullscreen · ', h('b', { style: 'color:#fff' }, '→'), ' to begin'));
  },
  enter(f) { setTimeout(() => f.qs.forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }), 50); },
  leave(f) { f.qs.forEach(e => { e.style.opacity = 0; e.style.transform = 'translateY(16px)'; }); },
  tick(f, dt, t) {
    const x = begin(f.c);
    // gallery wall
    const g = x.createLinearGradient(0, 0, 0, 996); g.addColorStop(0, '#120d10'); g.addColorStop(.75, '#1d1416'); g.addColorStop(1, '#0a0809');
    x.fillStyle = g; x.fillRect(900, 0, 1020, 996);
    const fade = x.createLinearGradient(820, 0, 1100, 0); fade.addColorStop(0, '#04060b'); fade.addColorStop(1, 'rgba(4,6,11,0)');
    x.fillStyle = fade; x.fillRect(820, 0, 280, 996);
    // walking distance: person walks towards the mirrors and back (metres)
    const d = 2.6 - 2.3 * (.5 - .5 * Math.cos(t * .32));
    const mirrors = [
      { cx: 1095, cy: 330, r: 128, type: 'plane', name: 'PLANE' },
      { cx: 1440, cy: 350, r: 190, type: 'concave', name: 'CONCAVE' },
      { cx: 1772, cy: 330, r: 100, type: 'convex', name: 'CONVEX' }];
    for (const M of mirrors) {
      const fM = .5, m = M.type === 'plane' ? 1 : solve(M.type, fM, d).m;
      // spotlight
      glow(x, M.cx, M.cy - M.r * 1.4, M.r * 2.2, 'rgba(255,220,180,.10)');
      // rim
      x.save(); x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 40; x.shadowOffsetY = 20;
      x.fillStyle = '#2a2c33'; x.beginPath(); x.arc(M.cx, M.cy, M.r + 16, 0, TAU); x.fill(); x.restore();
      const rg = x.createLinearGradient(M.cx - M.r, M.cy - M.r, M.cx + M.r, M.cy + M.r);
      rg.addColorStop(0, '#d6dbe4'); rg.addColorStop(.5, '#6a707c'); rg.addColorStop(1, '#c2c8d2');
      x.strokeStyle = rg; x.lineWidth = 12; x.beginPath(); x.arc(M.cx, M.cy, M.r + 8, 0, TAU); x.stroke();
      // mirror face
      x.save(); x.beginPath(); x.arc(M.cx, M.cy, M.r, 0, TAU); x.clip();
      const fg = x.createRadialGradient(M.cx - M.r * .3, M.cy - M.r * .4, 0, M.cx, M.cy, M.r * 1.1);
      fg.addColorStop(0, '#5a4448'); fg.addColorStop(1, '#2a1d20'); x.fillStyle = fg; x.fillRect(M.cx - M.r, M.cy - M.r, 2 * M.r, 2 * M.r);
      // reflection of the person: apparent size proportional to |m|
      const am = Math.abs(m), base = M.r * .9, blur = am > 4 ? Math.min(14, (am - 4) * 3) : 0;
      if (am < 30) {
        x.filter = blur ? `blur(${blur}px)` : 'none';
        x.translate(M.cx, M.cy + (m > 0 ? base * .5 * Math.min(am, 3) : -base * .5 * Math.min(am, 3)));
        x.scale(Math.min(am, 6) * base / 100, (m > 0 ? 1 : -1) * Math.min(am, 6) * base / 100);
        drawPerson(x, 100, '#f2c230');
      }
      x.restore();
      // sheen
      x.save(); x.globalCompositeOperation = 'lighter';
      const sh = x.createLinearGradient(M.cx - M.r, M.cy - M.r, M.cx + M.r * .2, M.cy + M.r * .3);
      sh.addColorStop(0, 'rgba(255,255,255,.22)'); sh.addColorStop(.5, 'rgba(255,255,255,.03)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = sh; x.beginPath(); x.arc(M.cx, M.cy, M.r, 0, TAU); x.fill(); x.restore();
      tag(x, M.name, M.cx, M.cy + M.r + 52, { size: 20, mono: true, col: '#d6c9b0', bg: false, need: true });
      const txt = am > 6 ? 'very large, blurred' : (m > 0 ? 'erect' : 'inverted') + (am > 1.05 ? ', enlarged' : am < .95 ? ', diminished' : ', same size');
      tag(x, txt, M.cx, M.cy + M.r + 84, { size: 20, col: m > 0 ? COL.real : '#ffb0a0', bg: false, need: true });
    }
    // floor and distance gauge
    x.fillStyle = '#140f10'; x.fillRect(900, 760, 1020, 236);
    const gx0 = 1050, gx1 = 1850, gy = 860, sc = (gx1 - gx0) / 3;
    x.strokeStyle = 'rgba(255,255,255,.2)'; x.lineWidth = 2; x.beginPath(); x.moveTo(gx0, gy); x.lineTo(gx1, gy); x.stroke();
    for (let k = 0; k <= 3; k++) { x.beginPath(); x.moveTo(gx1 - k * sc, gy - 8); x.lineTo(gx1 - k * sc, gy + 8); x.stroke(); tag(x, k + ' m', gx1 - k * sc, gy + 30, { size: 18, col: COL.mute, bg: false, need: true }); }
    x.fillStyle = '#9aa3b5'; x.fillRect(gx1 + 6, gy - 60, 8, 60);
    tag(x, 'mirrors', gx1 + 10, gy - 76, { size: 16, col: COL.mute, bg: false, need: true });
    x.save(); x.translate(gx1 - d * sc, gy); drawPerson(x, 70, '#f2c230'); x.restore();
    tag(x, `Meena is ${d.toFixed(1)} m from the mirrors`, 1450, 940, { size: 24, col: '#fff', bg: false, need: true });
  }
});

/* ---------- shared reflection scene (Modules 1 and 6) ---------- */
function reflectionScene(c, st, t) {
  const x = begin(c); bgGrid(x, c.w, c.h);
  const O = st.O, L = st.L, tilt = st.tilt * DEG;
  const n = [Math.sin(tilt), -Math.cos(tilt)], mt = [Math.cos(tilt), Math.sin(tilt)];
  const th = st.th * DEG;
  const sDir = [n[0] * Math.cos(th) - n[1] * Math.sin(th), n[0] * Math.sin(th) + n[1] * Math.cos(th)];
  const rDir = [n[0] * Math.cos(-th) - n[1] * Math.sin(-th), n[0] * Math.sin(-th) + n[1] * Math.cos(-th)];
  const S = [O[0] + sDir[0] * L, O[1] + sDir[1] * L], E = [O[0] + rDir[0] * L, O[1] + rDir[1] * L];
  const lab = App.labels;
  // plane of incidence (sheet of paper)
  if (st.plane) {
    x.save(); x.fillStyle = 'rgba(143,176,255,.07)'; x.strokeStyle = 'rgba(143,176,255,.35)'; x.lineWidth = 2;
    rrect(x, O[0] - L - 40, O[1] - L - 40, 2 * L + 80, L + 40, 18); x.fill(); x.stroke(); x.restore();
    tag(x, 'One plane: incident ray, normal and reflected ray all lie on this sheet', O[0], O[1] - L - 66, { size: 21, col: '#b9c9ff', bg: false });
  }
  // protractor
  if (st.prot) {
    x.save(); x.translate(O[0], O[1]); x.rotate(tilt);
    x.fillStyle = 'rgba(255,255,255,.05)'; x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.5;
    x.beginPath(); x.arc(0, 0, 250, Math.PI, TAU); x.closePath(); x.fill(); x.stroke();
    for (let a = 0; a <= 180; a += 5) {
      const ang = Math.PI + a * DEG, r0 = a % 10 ? 236 : 224;
      x.beginPath(); x.moveTo(Math.cos(ang) * r0, Math.sin(ang) * r0); x.lineTo(Math.cos(ang) * 250, Math.sin(ang) * 250); x.stroke();
      if (a % 30 === 0 && a > 0 && a < 180) { x.fillStyle = 'rgba(255,255,255,.55)'; x.font = `16px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(Math.abs(90 - a) + '°', Math.cos(ang) * 205, Math.sin(ang) * 205); }
    }
    x.restore();
  }
  // mirror
  const g = mirrorGeom('plane', O, n, 0, st.mw || 900); drawMirror(x, g);
  if (lab) tag(x, 'Plane mirror', O[0] + mt[0] * 360 - n[0] * 40, O[1] + mt[1] * 360 - n[1] * 40, { col: COL.mute, size: 22 });
  // normal
  dashLine(x, O[0], O[1], O[0] + n[0] * (L + 40), O[1] + n[1] * (L + 40), COL.normal, 2.5, [12, 9]);
  dashLine(x, O[0] - n[0] * 70, O[1] - n[1] * 70, O[0], O[1], 'rgba(232,238,252,.3)', 2, [6, 8]);
  // right-angle box
  x.save(); x.strokeStyle = 'rgba(232,238,252,.6)'; x.lineWidth = 2; x.beginPath();
  const q = 22; x.moveTo(O[0] + mt[0] * q, O[1] + mt[1] * q); x.lineTo(O[0] + mt[0] * q + n[0] * q, O[1] + mt[1] * q + n[1] * q); x.lineTo(O[0] + n[0] * q, O[1] + n[1] * q); x.stroke(); x.restore();
  if (lab) tag(x, 'Normal (90° to mirror)', O[0] + n[0] * (L + 70), O[1] + n[1] * (L + 70), { col: '#fff', size: 22 });
  // rays
  const fl = t * 120 * App.speed;
  const along = Math.abs(st.th) < .5;
  const off = along ? [mt[0] * 7, mt[1] * 7] : [0, 0];
  beam(x, [[S[0] - off[0], S[1] - off[1]], [O[0] - off[0], O[1] - off[1]]], COL.inc, { flow: fl, w: 3.2 });
  beam(x, [[O[0] + off[0], O[1] + off[1]], [E[0] + off[0], E[1] + off[1]]], COL.ref, { flow: fl - L, w: 3.2 });
  drawTorch(x, S[0] - sDir[0] * 6, S[1] - sDir[1] * 6, Math.atan2(-sDir[1], -sDir[0]), 1);
  // angles
  const aN = Math.atan2(n[1], n[0]), aS = Math.atan2(sDir[1], sDir[0]), aE = Math.atan2(rDir[1], rDir[0]);
  const deg = Math.abs(st.th).toFixed(0);
  if (!along) {
    const off = clamp(64 / Math.sin(Math.abs(th) / 2) - 120, 34, 230);
    angleArc(x, O[0], O[1], 120, aN, aS, COL.inc, 'i = ' + deg + '°', { off });
    angleArc(x, O[0], O[1], 120, aN, aE, COL.ref, 'r = ' + deg + '°', { off });
  } else tag(x, 'Along the normal:  i = 0°,  r = 0°  — light goes straight back', O[0] + n[0] * 230 + 20, O[1] + n[1] * 230, { size: 24, col: '#fff', align: 'left', need: true });
  if (lab) {
    const pi = [O[0] + sDir[0] * L * .62, O[1] + sDir[1] * L * .62], pr2 = [O[0] + rDir[0] * L * .62, O[1] + rDir[1] * L * .62];
    const sgn = st.th >= 0 ? 1 : -1, px = [-sDir[1] * sgn, sDir[0] * sgn], qx = [rDir[1] * sgn, -rDir[0] * sgn];
    if (!along) {
      tag(x, 'Incident ray', pi[0] + px[0] * 92, pi[1] + px[1] * 92, { col: COL.inc, size: 24, weight: 700 });
      tag(x, 'Reflected ray', pr2[0] + qx[0] * 96, pr2[1] + qx[1] * 96, { col: COL.ref, size: 24, weight: 700 });
    }
    tag(x, 'O  (point of incidence)', O[0] - n[0] * 48, O[1] - n[1] * 48, { col: '#fff', size: 20 });
  }
  dot(x, O[0], O[1], 7, '#fff'); glow(x, O[0], O[1], 40, 'rgba(255,240,200,.8)', .7);
  return { S, E };
}
function reflectionDrag(c, st, onChange) {
  pointer(c, {
    hover: p => p.y < st.O[1] - 20,
    down: p => { if (p.y > st.O[1] - 10) return false; set(p); return true; },
    move: set
  });
  function set(p) {
    const tilt = st.tilt * DEG, n = [Math.sin(tilt), -Math.cos(tilt)];
    const v = [p.x - st.O[0], p.y - st.O[1]];
    let a = Math.atan2(n[0] * v[1] - n[1] * v[0], n[0] * v[0] + n[1] * v[1]) / DEG;
    a = clamp(a, -85, 85); if (Math.abs(a) < 2.5) a = 0;
    st.th = Math.round(a); st.anim = null; onChange && onChange();
  }
}

/* ---------- MODULE 1: plane mirror ---------- */
frame({
  mod: 1, kick: 'Plane mirror · Reflection', title: 'Reflection of light', mapTitle: 'Plane mirror: reflection of light',
  sub: 'Drag anywhere above the mirror to swing the torch. Watch the reflected ray respond.',
  build(b, f) {
    f.st = { O: [664, 650], L: 470, tilt: 0, th: 40, plane: false, prot: false };
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    reflectionDrag(f.c, f.st);
    const side = h('div', { class: 'side' }); b.append(side);
    f.ro = ui.readout([['i', 'Angle of incidence  i'], ['r', 'Angle of reflection  r']]);
    f.bars = h('div', { style: 'display:grid;gap:10px;margin-top:16px' });
    f.bi = h('div', { style: 'height:16px;border-radius:8px;background:var(--inc);transition:width .2s' });
    f.br = h('div', { style: 'height:16px;border-radius:8px;background:var(--ref);transition:width .2s' });
    f.bars.append(f.bi, f.br);
    f.eq = h('div', { class: 'big', style: 'margin-top:14px;text-align:center;font-size:44px;letter-spacing:.02em' }, 'i = r');
    side.append(ui.card('Live measurement', f.ro, f.bars, f.eq));
    side.append(ui.card('Try this',
      h('div', { class: 'col', style: 'gap:12px' },
        ui.btn('Send the ray along the normal', () => { f.st.anim = { from: f.st.th, to: 0, t: 0 }; }),
        ui.btn('Sweep through all angles', () => { f.st.sweep = !f.st.sweep; }),
        ui.toggle({ label: 'Show the plane (sheet of paper)', value: false, onChange: v => f.st.plane = v }))));
    side.append(ui.card('Words to know', h('p', { html: '<b style="color:var(--inc)">Incident ray</b> falls on the mirror; <b class="hc">reflected ray</b> comes back. The <b>normal</b> is at 90° to the mirror at <b>O</b>. Angles are measured from the normal.' })));
  },
  tick(f, dt, t) {
    const st = f.st;
    if (st.anim) { st.anim.t = Math.min(1, st.anim.t + dt * 1.3); st.th = Math.round(lerp(st.anim.from, st.anim.to, ease(st.anim.t))); if (st.anim.t >= 1) st.anim = null; }
    if (st.sweep) st.th = Math.round(Math.sin(t * .6) * 75);
    reflectionScene(f.c, st, t);
    const a = Math.abs(st.th);
    f.ro.set('i', a + '°', COL.inc); f.ro.set('r', a + '°', COL.ref);
    f.bi.style.width = (a / 90 * 100) + '%'; f.br.style.width = (a / 90 * 100) + '%';
  }
});

/* ---------- MODULE 2: spherical mirrors in 3-D ---------- */
function capMesh(type) {
  const Rs = 300, tm = 36 * DEG, NT = 12, NP = 40, quads = [];
  const sg = type === 'concave' ? -1 : 1;       // concave: cap around -z so its inside faces the viewer at +z
  const zc = sg * Rs * (1 + Math.cos(tm)) / 2;  // shift so the cap sits at the origin
  const P = (i, j) => { const th = tm * i / NT, ph = TAU * j / NP; return [Rs * Math.sin(th) * Math.cos(ph), Rs * Math.sin(th) * Math.sin(ph), sg * Rs * Math.cos(th)]; };
  for (let i = 0; i < NT; i++) for (let j = 0; j < NP; j++) {
    const ps = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)];
    const cpt = ps.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4], [0, 0, 0]);
    const L = Math.hypot(...cpt);
    quads.push({ ps: ps.map(p => [p[0], p[1], p[2] - zc]), n: cpt.map(v => v / L) });
  }
  const rim = []; for (let j = 0; j <= NP; j++) { const p = P(NT, j); rim.push([p[0], p[1], p[2] - zc]); }
  return { quads, rim, Rs, zc, type };
}
function rot3(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
  return [x1, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp];
}
function drawCap(c, mesh, cam, o) {
  const x = begin(c), cx = c.w / 2, cy = c.h / 2 + 10, D = 1600;
  const pr = p => { const s = D / (D - p[2]); return [cx + p[0] * s, cy + p[1] * s, p[2]]; };
  bgGrid(x, c.w, c.h, 40, .035);
  // floor glow
  glow(x, cx, cy + 40, 300, 'rgba(120,150,220,.12)');
  // imaginary sphere
  if (o.sphere) {
    const ctr = rot3([0, 0, -mesh.zc], cam.yaw, cam.pitch), pc = pr(ctr), s = D / (D - ctr[2]);
    x.save(); x.strokeStyle = 'rgba(143,176,255,.45)'; x.setLineDash([8, 8]); x.lineWidth = 2;
    x.beginPath(); x.arc(pc[0], pc[1], mesh.Rs * s, 0, TAU); x.stroke();
    x.setLineDash([]); x.strokeStyle = 'rgba(143,176,255,.14)';
    for (let k = 0; k < 3; k++) {
      x.beginPath();
      for (let j = 0; j <= 72; j++) {
        const a = TAU * j / 72; let p = k === 0 ? [Math.cos(a), Math.sin(a), 0] : k === 1 ? [Math.cos(a), 0, Math.sin(a)] : [0, Math.cos(a), Math.sin(a)];
        p = rot3([p[0] * mesh.Rs, p[1] * mesh.Rs, p[2] * mesh.Rs - mesh.zc], cam.yaw, cam.pitch); const q = pr(p);
        j ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]);
      }
      x.stroke();
    }
    x.restore();
    dot(x, pc[0], pc[1], 6, '#b9c9ff'); tag(x, 'C (centre of the hollow sphere)', pc[0], pc[1] + 26, { size: 18, col: '#b9c9ff' });
  }
  const L = norm([.3, -.7]); const L3 = [L[0] * .6, L[1] * .6, .55];
  const qs = mesh.quads.map(q => {
    const ps = q.ps.map(p => rot3(p, cam.yaw, cam.pitch)), n = rot3(q.n, cam.yaw, cam.pitch);
    return { ps, n, z: (ps[0][2] + ps[1][2] + ps[2][2] + ps[3][2]) / 4 };
  }).sort((a, b) => a.z - b.z);
  for (const q of qs) {
    const outer = q.n[2] > 0, vn = outer ? q.n : q.n.map(v => -v);
    const refl = (mesh.type === 'convex') === outer;
    let col;
    if (refl) {
      // fake environment reflection: bright ceiling, dark floor, warm horizon band
      const ry = 2 * vn[2] * vn[1], rx = 2 * vn[2] * vn[0];
      const sky = clamp(.55 - ry * 1.4, 0, 1), band = Math.exp(-Math.pow(ry * 4, 2));
      const spec = Math.pow(Math.max(0, vn[0] * L3[0] + vn[1] * L3[1] + vn[2] * L3[2]), 30);
      const r = 40 + 170 * sky + 60 * band + 255 * spec, gg = 50 + 180 * sky + 40 * band + 255 * spec, bb = 70 + 200 * sky + 20 * band + 255 * spec;
      col = `rgb(${clamp(r + rx * 20, 0, 255) | 0},${clamp(gg, 0, 255) | 0},${clamp(bb, 0, 255) | 0})`;
    } else {
      const lam = clamp(.35 + .65 * (vn[0] * L3[0] + vn[1] * L3[1] + vn[2] * L3[2]), .15, 1);
      col = `rgb(${(70 * lam) | 0},${(52 * lam) | 0},${(48 * lam) | 0})`;
    }
    const p = q.ps.map(pr);
    x.fillStyle = col; x.strokeStyle = col; x.lineWidth = 1;
    x.beginPath(); x.moveTo(p[0][0], p[0][1]); for (let k = 1; k < 4; k++) x.lineTo(p[k][0], p[k][1]); x.closePath(); x.fill(); x.stroke();
  }
  // rim
  const rp = mesh.rim.map(p => pr(rot3(p, cam.yaw, cam.pitch)));
  x.save(); x.strokeStyle = '#8b95a8'; x.lineWidth = 7; x.beginPath(); rp.forEach((p, k) => k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 1.5; x.stroke(); x.restore();
  // which side faces the viewer?
  const axis = rot3([0, 0, mesh.type === 'concave' ? 1 : 1], cam.yaw, cam.pitch);
  return axis[2];
}
frame({
  mod: 2, kick: 'Spherical mirrors', title: 'Mirrors that curve', mapTitle: 'Spherical mirrors: concave and convex (3-D)',
  sub: 'Drag to rotate. A spherical mirror is a piece of an imaginary hollow sphere.',
  build(b, f) {
    f.cam = { yaw: .5, pitch: -.32 }; f.auto = true; f.sphere = false;
    f.meshes = [capMesh('concave'), capMesh('convex')];
    f.cs = [0, 1].map(i => {
      const wrap = h('div', { class: 'abs glass', style: `left:${i * 700}px;top:0;width:680px;height:680px;overflow:hidden` });
      b.append(wrap);
      const c = canvas(wrap, 680, 600);
      const name = h('div', { style: 'text-align:center;font-size:30px;font-weight:800;margin-top:-6px' }, i ? 'CONVEX MIRROR' : 'CONCAVE MIRROR');
      const note = h('div', { style: 'text-align:center;font-size:21px;color:var(--mute);margin-top:4px' });
      wrap.append(name, note); c.note = note;
      let last = null;
      pointer(c, {
        hover: () => true,
        down: p => { last = p; f.auto = false; f.autoT.set(false); return true; },
        move: p => { f.cam.yaw += (p.x - last.x) * .008; f.cam.pitch = clamp(f.cam.pitch + (p.y - last.y) * .008, -1.4, 1.4); last = p; }
      });
      return c;
    });
    const side = h('div', { class: 'abs', style: 'left:1400px;top:0;width:392px;display:flex;flex-direction:column;gap:14px' }); b.append(side);
    const view = (yaw, pitch) => { f.auto = false; f.autoT.set(false); f.anim = { y0: f.cam.yaw, p0: f.cam.pitch, y1: yaw, p1: pitch, t: 0 }; };
    f.autoT = ui.toggle({ label: 'Slow turntable', value: true, onChange: v => f.auto = v });
    side.append(ui.card('Viewpoint', h('div', { class: 'col', style: 'gap:10px' },
      ui.btn('Face on', () => view(0, 0)),
      ui.btn('Side view — eye at table level', () => view(Math.PI / 2, 0)),
      ui.btn('From behind', () => view(Math.PI, -.2)),
      f.autoT,
      ui.toggle({ label: 'Show imaginary hollow sphere', value: false, onChange: v => f.sphere = v }))));
    b.append(h('div', { class: 'abs', style: 'left:0;top:700px;width:1380px;font-size:24px;color:#d5dceb', html: '<b class="hl">Concave</b>: reflecting surface curves <b>inwards</b> &nbsp;·&nbsp; <b class="hc">Convex</b>: curves <b>outwards</b> &nbsp;·&nbsp; In diagrams the non-reflecting back is drawn <b>shaded</b>.' }));
    // construction diagram
    const cc = canvas(null, 352, 210); side.append(ui.card('How they are made', cc.cv));
    f.cc = cc;
  },
  tick(f, dt, t) {
    if (f.anim) { const a = f.anim; a.t = Math.min(1, a.t + dt * 1.2); const e = ease(a.t); f.cam.yaw = lerp(a.y0, a.y1, e); f.cam.pitch = lerp(a.p0, a.p1, e); if (a.t >= 1) f.anim = null; }
    if (f.auto) f.cam.yaw += dt * .35;
    f.cs.forEach((c, i) => {
      const facing = drawCap(c, f.meshes[i], f.cam, { sphere: f.sphere });
      const conc = i === 0;
      const reflVisible = facing > .05, back = facing < -.05;
      c.note.textContent = reflVisible ? `You see the reflecting surface — it curves ${conc ? 'INWARD' : 'OUTWARD'}` : back ? 'You see the coated, non-reflecting back' : 'Edge-on: compare the curve of the two mirrors';
      c.note.style.color = reflVisible ? (conc ? 'var(--ray)' : 'var(--ref)') : 'var(--mute)';
    });
    // construction: glass piece + coating
    const x = begin(f.cc);
    const piece = (cx, coatOuter, label, col) => {
      x.save(); x.translate(cx, 92);
      x.beginPath(); x.arc(-150, 0, 170, -.42, .42); x.arc(-150 + 20, 0, 170, .42, -.42, true); x.closePath();
      x.fillStyle = 'rgba(160,215,255,.25)'; x.fill(); x.strokeStyle = 'rgba(210,240,255,.7)'; x.lineWidth = 1.5; x.stroke();
      x.strokeStyle = '#4ad19a'; x.lineWidth = 5; x.beginPath();
      if (coatOuter) x.arc(-150 + 20, 0, 170, -.4, .4); else x.arc(-150, 0, 170, -.4, .4); x.stroke();
      x.restore();
      beam(x, coatOuter ? [[cx - 70, 92], [cx - 6, 92]] : [[cx + 90, 92], [cx + 26, 92]], col, { w: 2, as: 10 });
      tag(x, label, cx + 8, 186, { size: 17, col, bg: false });
    };
    piece(90, true, 'Coat outside → concave', COL.ray);
    piece(262, false, 'Coat inside → convex', COL.ref);
    tag(x, 'green = silver/aluminium coating', 176, 16, { size: 15, col: '#4ad19a', bg: false });
  }
});

/* ---------- MODULE 2b: the spoon (Activity 10.1) ---------- */
function drawFace(x, s) {
  x.save(); x.scale(s / 100, s / 100);
  x.fillStyle = '#2b6cb0'; x.beginPath(); x.ellipse(0, 95, 70, 40, 0, Math.PI, TAU); x.fill();
  x.fillStyle = '#d9a077'; x.fillRect(-14, 30, 28, 30);
  x.beginPath(); x.ellipse(0, 0, 44, 54, 0, 0, TAU); x.fill();
  x.fillStyle = '#20160f'; x.beginPath(); x.ellipse(0, -22, 48, 40, 0, Math.PI * .98, TAU * 1.01); x.fill();
  x.fillRect(-48, -24, 12, 40); x.fillRect(36, -24, 12, 40);
  x.fillStyle = '#fff'; x.beginPath(); x.ellipse(-16, 2, 8, 5, 0, 0, TAU); x.ellipse(16, 2, 8, 5, 0, 0, TAU); x.fill();
  x.fillStyle = '#1b1b1b'; x.beginPath(); x.arc(-16, 2, 3.5, 0, TAU); x.arc(16, 2, 3.5, 0, TAU); x.fill();
  x.strokeStyle = '#8a3b2e'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.arc(0, 22, 14, .2, Math.PI - .2); x.stroke();
  x.restore();
}
frame({
  mod: 2, kick: 'Activity 10.1 · Let us explore', title: 'A shiny spoon is a curved mirror', mapTitle: 'Activity 10.1: image in a shiny spoon',
  sub: 'Flip the spoon and move it away from your face. What happens to your image?',
  build(b, f) {
    f.side = 'inner'; f.d = 20;
    f.c = canvas(b, 760, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    f.c2 = canvas(b, 1010, 470, 'position:absolute;left:782px;top:0'); f.c2.cv.classList.add('glass');
    const ctl = h('div', { class: 'abs', style: 'left:782px;top:494px;width:1010px;display:grid;grid-template-columns:1fr 1fr;gap:16px' }); b.append(ctl);
    f.ro = ui.readout([['img', 'Your image'], ['why', 'Acts like']]);
    ctl.append(ui.card('Spoon', h('div', { class: 'col' },
      ui.seg({ options: [{ v: 'inner', t: 'Inner side (curves in)' }, { v: 'outer', t: 'Outer side (bulges out)' }], value: 'inner', onChange: v => f.side = v }),
      ui.slider({ label: 'Distance from your face', min: 1, max: 40, step: .5, value: 20, fmt: v => v + ' cm', onInput: v => f.d = v }))),
      ui.card('What you see', f.ro));
  },
  tick(f, dt, t) {
    const conc = f.side === 'inner', fS = 3; // spoon: radius of curvature ~6 cm => f ~ 3 cm
    const s = solve(conc ? 'concave' : 'convex', fS, f.d), m = s.m, am = Math.abs(m);
    const x = begin(f.c, '#0b0f18');
    // spoon
    const cx = 380, cy = 330, rx = 190, ry = 270;
    x.save(); x.translate(cx, cy);
    const hg = x.createLinearGradient(-30, 0, 30, 0); hg.addColorStop(0, '#6f7787'); hg.addColorStop(.5, '#e6ebf3'); hg.addColorStop(1, '#6f7787');
    x.fillStyle = hg; rrect(x, -26, ry - 30, 52, 420, 26); x.fill();
    x.beginPath(); x.ellipse(0, 0, rx + 10, ry + 10, 0, 0, TAU);
    const rg = x.createLinearGradient(-rx, -ry, rx, ry); rg.addColorStop(0, '#f2f5fa'); rg.addColorStop(.5, '#7f8797'); rg.addColorStop(1, '#d9dee8');
    x.fillStyle = rg; x.fill();
    x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, TAU); x.clip();
    const bg = x.createRadialGradient(conc ? 40 : -40, conc ? 60 : -60, 10, 0, 0, ry * 1.1);
    bg.addColorStop(0, conc ? '#2c3442' : '#c8cfdb'); bg.addColorStop(1, conc ? '#aab3c2' : '#4a5262'); x.fillStyle = bg; x.fillRect(-rx, -ry, 2 * rx, 2 * ry);
    const blur = am > 3.5 ? Math.min(16, (am - 3.5) * 4) : 0;
    if (am < 40) { x.filter = blur ? `blur(${blur}px)` : 'none'; x.save(); x.scale(1, m > 0 ? 1 : -1); drawFace(x, Math.min(am, 6) * 140); x.restore(); x.filter = 'none'; }
    x.globalCompositeOperation = 'lighter';
    const sh = x.createRadialGradient(conc ? 60 : -70, conc ? 140 : -150, 0, conc ? 60 : -70, conc ? 140 : -150, 120);
    sh.addColorStop(0, 'rgba(255,255,255,.4)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = sh; x.fillRect(-rx, -ry, 2 * rx, 2 * ry);
    x.restore();
    tag(x, conc ? 'INNER SIDE · curved inwards' : 'OUTER SIDE · bulging outwards', cx, 38, { size: 22, col: conc ? COL.ray : COL.ref, need: true });
    // side ray diagram, same ratio u/f
    const x2 = begin(f.c2); bgGrid(x2, f.c2.w, f.c2.h);
    const fp = 80, u = f.d / fS * fp;
    const info = bench(x2, { type: conc ? 'concave' : 'convex', x0: 900, y0: 250, f: fp, u: Math.min(u, 860), h: 60, A: 280, w: f.c2.w, h2: f.c2.h, rays: 'principal', flow: t * 100 * App.speed, obj: 'arrow', small: true });
    tag(x2, 'Side view as a ray diagram (face = arrow)', 20, 28, { align: 'left', size: 20, col: COL.mute, bg: false, need: true });
    const d = describe(conc ? 'concave' : 'convex', info, u, fp);
    f.ro.set('img', am > 6 ? 'very large, blurred' : `${d.ori}, ${d.sw.toLowerCase()}`, d.ocol);
    f.ro.set('why', conc ? 'Concave mirror' : 'Convex mirror', conc ? COL.ray : COL.ref);
  }
});

/* ---------- generic lab frame (Modules 3, 4, 10, 11) ---------- */
function labFrame(def) {
  frame({
    mod: def.mod, kick: def.kick, title: def.title, sub: def.sub, mapTitle: def.mapTitle,
    build(b, f) {
      f.u = def.u0; f.rays = 'principal'; f.glide = null;
      f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
      const near = p => Math.abs(p.x - f.info.xo) < 50 && p.y > f.info.ty - 30 && p.y < def.y0 + 30;
      pointer(f.c, {
        hover: near,
        down: p => { if (!near(p) && !(Math.abs(p.y - def.y0) < 60 && p.x < def.x0 - 10)) return false; f.glide = null; f.u = clamp(def.x0 - p.x, def.umin, def.umax); return true; },
        move: p => { f.u = clamp(def.x0 - p.x, def.umin, def.umax); }
      });
      const side = h('div', { class: 'side' }); b.append(side);
      f.ro = ui.readout([['obj', 'Object distance'], ['zone', 'Object position'], ['img', 'Image at'], ['size', 'Image size'], ['ori', 'Orientation'], ['kind', 'Image type']]);
      side.append(ui.card('Live measurements', f.ro));
      side.append(ui.card('Rays', ui.seg({ options: [{ v: 'principal', t: 'Key 3' }, { v: 5, t: '5' }, { v: 10, t: '10' }, { v: 20, t: '20' }], value: 'principal', onChange: v => f.rays = v })));
      f.onc = h('div', { class: 'onc' },
        ui.btn(def.glideTxt || 'Glide object ⟶', () => { f.glide = { t: 0 }; }),
        ui.btn('Reset', () => { f.glide = null; f.u = def.u0; }));
      b.append(f.onc);
      side.append(ui.discover(def.disc));
      if (def.extra) def.extra(b, f, side);
    },
    tick(f, dt, t) {
      if (f.glide) { f.glide.t += dt * .07 * App.speed; const k = f.glide.t; f.u = lerp(def.umax, def.umin, ease(clamp(k, 0, 1))); if (k >= 1) f.glide = null; }
      const x = begin(f.c); bgGrid(x, f.c.w, f.c.h);
      const B = { type: def.type, x0: def.x0, y0: def.y0, f: def.f, u: f.u, h: def.oh || 90, A: def.A || 440, w: f.c.w, h2: f.c.h, rays: f.rays, flow: t * 110 * App.speed };
      f.info = bench(x, B);
      offscreenHint(x, f.info, f.c.w, def.y0);
      if (def.overlay) def.overlay(x, f, t);
      tag(x, '⟵ drag ⟶', f.info.xo, def.y0 + 96, { size: 18, col: 'rgba(255,255,255,.55)', bg: false });
      const d = describe(def.type, f.info, f.u, def.f);
      f.ro.set('obj', d.obj); f.ro.set('zone', d.zone || 'anywhere');
      f.ro.set('img', d.where, d.col); f.ro.set('size', d.size); f.ro.set('ori', d.ori, d.ocol); f.ro.set('kind', d.kind, d.col);
    }
  });
}
function offscreenHint(x, info, w, y0) {
  if (info.show || info.inf) return;
  if (info.xi < 0) tag(x, '◀ image far to the left (off screen)', 20, y0 - 40, { align: 'left', size: 20, col: COL.real, need: true });
  else if (info.xi > w) tag(x, 'image far behind ▶', w - 20, y0 - 40, { align: 'right', size: 20, col: COL.virt, need: true });
}

/* ---------- MODULE 3: concave mirror ---------- */
labFrame({
  mod: 3, kick: 'Concave mirror lab', title: 'Concave mirror: move the object', mapTitle: 'Concave mirror: image formation lab',
  sub: 'Drag the candle towards and away from the mirror. Follow the rays to the image.',
  type: 'concave', x0: 900, y0: 400, f: 180, u0: 560, umin: 30, umax: 880,
  glideTxt: 'Walk object in ⟶',
  disc: {
    qs: ['Start far away. Is the image erect or inverted?', 'Move closer. Does the image get larger or smaller?', 'Keep going until the image flips. Where is the object then?', 'Very close to the mirror: is the image erect or inverted? Bigger or smaller?'],
    reveal: 'Object <b>far</b>: image is <b>inverted</b> and real. As the object comes closer the inverted image grows. Inside <b>F</b> it becomes <b>erect and enlarged</b> (virtual, behind the mirror). So a concave mirror can give enlarged or diminished, erect or inverted images.'
  },
  overlay(x, f) {
    // "what you see" inset
    const cx = 120, cy = 120, r = 92, m = f.info.s.m, am = Math.abs(m);
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fillStyle = '#121826'; x.fill(); x.clip();
    if (!f.info.inf && am < 30) { x.filter = am > 5 ? `blur(${Math.min(10, (am - 5) * 2)}px)` : 'none'; x.translate(cx, cy + (m > 0 ? 40 : -40) * Math.min(am, 2.2)); x.scale(Math.min(am, 5) * .9, (m > 0 ? 1 : -1) * Math.min(am, 5) * .9); drawObj(x, 'candle', 90, {}); }
    x.restore(); x.strokeStyle = '#c9d3e2'; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.stroke();
    tag(x, 'What you see in the mirror', cx + r + 12, cy - r + 14, { align: 'left', size: 18, col: COL.mute, bg: false });
  }
});

/* ---------- MODULE 4: convex mirror ---------- */
labFrame({
  mod: 4, kick: 'Convex mirror lab', title: 'Convex mirror: move the object', mapTitle: 'Convex mirror: image formation lab',
  sub: 'Move the candle anywhere. Watch the image behind the mirror.',
  type: 'convex', x0: 840, y0: 400, f: 180, u0: 360, umin: 30, umax: 820,
  disc: {
    qs: ['Move the object anywhere. Does the image ever turn upside down?', 'Is the image ever bigger than the object?', 'Move the object away. What happens to the image size?', 'Where does the image appear: in front of or behind the mirror?'],
    reveal: 'A convex mirror always forms an <b>erect, diminished</b>, virtual image behind the mirror. It gets slightly smaller as the object moves away. The mirror also shows a much <b>wider area</b> — tap <b>Field of view</b>.'
  },
  extra(b, f, side) {
    f.fov = false;
    f.onc.append(ui.toggle({ label: 'Field of view vs plane mirror', value: false, onChange: v => f.fov = v }));
  },
  overlay(x, f) {
    if (!f.fov) return;
    const eye = [520, 140];
    const pl = fovFan(eye, 'plane', [840, 400], [-1, 0], 1, 300, 2400, 2);
    const cv = fovFan(eye, 'convex', [840, 400], [-1, 0], 360, 300, 2400, 30);
    drawFan(x, cv, COL.ref, .14); drawFan(x, pl, '#ffffff', .1);
    x.save(); x.fillStyle = '#fff'; x.beginPath(); x.ellipse(eye[0], eye[1], 22, 13, 0, 0, TAU); x.fill(); x.fillStyle = '#1d2a44'; x.beginPath(); x.arc(eye[0] + 3, eye[1], 8, 0, TAU); x.fill(); x.restore();
    tag(x, 'Eye', eye[0], eye[1] - 30, { size: 18 });
    tag(x, 'Convex mirror shows this wide region', 330, 700, { col: COL.ref, size: 21, need: true });
    tag(x, 'Plane mirror: only this narrow strip', 360, 300, { col: '#fff', size: 19, need: true });
  }
});

/* ---------- MODULE 4b: convex mirrors at work ---------- */
const SCENES = {
  side: {
    name: 'Vehicle side-view mirror', note: 'The convex side mirror shows the next lane — including the car in the blind spot. Cars look smaller, so they seem farther: “Objects in mirror are closer than they appear”.',
    draw(x, t, type) {
      x.fillStyle = '#1b1f27'; x.fillRect(260, 0, 820, 778);
      x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 4; x.setLineDash([40, 40]); x.lineDashOffset = -t * 260;
      [533, 806].forEach(X => { x.beginPath(); x.moveTo(X, 0); x.lineTo(X, 778); x.stroke(); }); x.setLineDash([]);
      x.fillStyle = '#e8e2d0'; x.fillRect(254, 0, 6, 778); x.fillRect(1080, 0, 6, 778);
      const car = (cx, cy, col) => { x.save(); x.fillStyle = 'rgba(0,0,0,.35)'; rrect(x, cx - 50, cy - 86, 104, 180, 22); x.fill(); x.fillStyle = col; rrect(x, cx - 46, cy - 90, 92, 176, 20); x.fill(); x.fillStyle = 'rgba(20,30,45,.85)'; rrect(x, cx - 36, cy - 50, 72, 40, 8); x.fill(); rrect(x, cx - 34, cy + 36, 68, 26, 8); x.fill(); x.restore(); };
      const me = [670, 260]; car(me[0], me[1], '#e9ecf2');
      const others = [[400, 470 + Math.sin(t * .5) * 30, '#ff7a5c'], [400, 720 + Math.sin(t * .4 + 1) * 40, '#ffcf6b'], [940, 640 + Math.sin(t * .45 + 2) * 40, '#56dcff']];
      others.forEach(o => car(o[0], o[1], o[2]));
      const V = [606, 214], ax = norm([.44, .9]), eye = [690, 250];
      x.fillStyle = '#2b2f38'; x.fillRect(600, 206, 26, 10);
      return { V, ax, eye, R: type === 'convex' ? 60 : 1, A: 30, targets: others.map(o => [o[0], o[1]]), cols: others.map(o => o[2]) };
    }
  },
  road: {
    name: 'Road safety mirror at a sharp bend', note: 'The hill hides each car from the other. A large convex mirror at the bend shows both roads, so drivers can see what is coming and avoid a collision.',
    draw(x, t, type) {
      x.fillStyle = '#16231a'; x.fillRect(0, 0, 1328, 778);
      x.strokeStyle = '#2b2f37'; x.lineWidth = 130; x.lineCap = 'butt';
      x.beginPath(); x.moveTo(0, 560); x.lineTo(620, 560); x.arcTo(860, 560, 860, 320, 240); x.lineTo(860, -10); x.stroke();
      x.strokeStyle = 'rgba(255,220,120,.7)'; x.lineWidth = 4; x.setLineDash([30, 26]);
      x.beginPath(); x.moveTo(0, 560); x.lineTo(620, 560); x.arcTo(860, 560, 860, 320, 240); x.lineTo(860, -10); x.stroke(); x.setLineDash([]);
      // hill blocking direct view
      const hg = x.createRadialGradient(560, 270, 30, 560, 270, 330); hg.addColorStop(0, '#5b4a35'); hg.addColorStop(1, '#2c2a1e');
      x.fillStyle = hg; x.beginPath(); x.moveTo(0, 470); x.lineTo(560, 470); x.quadraticCurveTo(780, 470, 770, 250); x.lineTo(770, 0); x.lineTo(0, 0); x.closePath(); x.fill();
      tag(x, 'HILL — blocks the view', 340, 230, { size: 24, col: '#d8c39a', bg: false, need: true });
      const a = (t * .09) % 1, b2 = (t * .07 + .5) % 1;
      const carA = [80 + a * 480, 590], carB = [830, 40 + b2 * 330];
      const car = (p, col, rot) => { x.save(); x.translate(p[0], p[1]); x.rotate(rot); x.fillStyle = col; rrect(x, -44, -22, 88, 44, 12); x.fill(); x.fillStyle = 'rgba(20,30,45,.85)'; rrect(x, 10, -16, 20, 32, 5); x.fill(); x.restore(); };
      car(carA, '#ffcf6b', 0); car(carB, '#ff7a5c', Math.PI / 2);
      const V = [1010, 640], ax = norm([-1, -1]);
      return { V, ax, eye: [carA[0] + 30, carA[1]], R: type === 'convex' ? 160 : 1, A: 90, targets: [carB], cols: ['#ff7a5c'], post: true };
    }
  },
  store: {
    name: 'Store surveillance mirror', note: 'From the counter, a convex mirror in the corner lets the shopkeeper watch almost the whole shop at once.',
    draw(x, t) {
      x.fillStyle = '#1d1a17'; x.fillRect(120, 40, 1088, 700);
      x.strokeStyle = '#4a4239'; x.lineWidth = 8; x.strokeRect(120, 40, 1088, 700);
      x.fillStyle = '#3d4a63'; [[300, 150], [300, 330], [300, 510], [640, 150], [640, 330], [640, 510]].forEach(p => { rrect(x, p[0], p[1], 240, 56, 6); x.fill(); });
      x.fillStyle = '#6b4d2f'; rrect(x, 940, 600, 220, 90, 8); x.fill(); tag(x, 'Counter', 1050, 645, { size: 20, bg: false, need: true });
      const ppl = [[240 + 60 * Math.sin(t * .4), 260], [560, 450 + 60 * Math.sin(t * .5 + 1)], [900, 250 + 80 * Math.sin(t * .3 + 2)], [460 + 120 * Math.sin(t * .25), 620]];
      ppl.forEach(p => { dot(x, p[0], p[1], 18, '#ffb38a'); dot(x, p[0], p[1], 9, '#3a2a1e'); });
      return { V: [1180, 80], ax: norm([-1, 1]), eye: [1060, 580], R: 70, A: 70, targets: ppl, cols: ppl.map(() => '#ffb38a'), alwaysConvex: true };
    }
  }
};
frame({
  mod: 4, kick: 'From the lab to the road', title: 'Convex mirrors at work', mapTitle: 'Convex mirrors in real life (side-view, road, store)',
  sub: 'A convex mirror shows a much wider area than a plane mirror of the same size.',
  build(b, f) {
    f.k = 'side'; f.type = 'convex'; f.intro = 0;
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const side = h('div', { class: 'side' }); b.append(side);
    f.seg = ui.seg({ options: [{ v: 'side', t: 'Side mirror' }, { v: 'road', t: 'Road bend' }, { v: 'store', t: 'Store' }], value: 'side', onChange: v => { f.k = v; f.intro = 0; f.note.innerHTML = SCENES[v].note; f.name.textContent = SCENES[v].name; } });
    f.mt = ui.seg({ options: [{ v: 'plane', t: 'Plane mirror' }, { v: 'convex', t: 'Convex mirror' }], value: 'convex', onChange: v => f.type = v });
    f.name = h('div', { class: 'big', style: 'margin-bottom:10px' }, SCENES.side.name);
    f.note = h('p', { html: SCENES.side.note });
    f.vis = h('div', { style: 'margin-top:12px;font:600 24px var(--f-mono)' });
    side.append(ui.card('Scene', f.seg), ui.card('Mirror used', f.mt), ui.card(null, f.name, f.note, f.vis));
  },
  enter(f) { f.intro = 0; },
  tick(f, dt, t) {
    f.intro = Math.min(1, f.intro + dt * .8);
    const x = begin(f.c, '#0b0f16'), S = SCENES[f.k];
    const type = S.alwaysConvex ? 'convex' : f.type;
    const r = S.draw(x, t, type);
    const R = type === 'convex' ? r.R : 1, rays = fovFan(r.eye, type === 'convex' ? 'convex' : 'plane', r.V, r.ax, R, r.A, 2600, 30);
    drawFan(x, rays, type === 'convex' ? COL.ref : '#ffffff', .15);
    drawMirror(x, mirrorGeom(type === 'convex' ? 'convex' : 'plane', r.V, r.ax, R, r.A));
    if (r.post) { x.fillStyle = '#888'; x.fillRect(r.V[0] + 20, r.V[1] + 20, 8, 60); }
    x.save(); x.fillStyle = '#fff'; x.beginPath(); x.arc(r.eye[0], r.eye[1], 9, 0, TAU); x.fill(); x.restore();
    tag(x, 'driver / viewer', r.eye[0], r.eye[1] + 30, { size: 17 });
    let seen = 0;
    r.targets.forEach((p, i) => { if (inFan(rays, p) >= 0) { seen++; x.save(); x.strokeStyle = '#7ef0a8'; x.lineWidth = 4; x.beginPath(); x.arc(p[0], p[1], 62, 0, TAU); x.stroke(); x.restore(); } });
    f.vis.innerHTML = `Seen in mirror: <span style="color:${seen ? 'var(--real)' : 'var(--warn)'}">${seen} of ${r.targets.length}</span>`;
    // cinematic intro: iris opening from the mirror
    if (f.intro < 1) {
      const e = ease(f.intro), rr = 40 + e * 1500;
      x.save(); x.fillStyle = '#04060b'; x.beginPath(); x.rect(0, 0, f.c.w, f.c.h); x.arc(r.V[0], r.V[1], rr, 0, TAU, true); x.fill('evenodd'); x.restore();
      x.save(); x.strokeStyle = `rgba(200,230,255,${1 - e})`; x.lineWidth = 6; x.beginPath(); x.arc(r.V[0], r.V[1], rr, 0, TAU); x.stroke(); x.restore();
    }
  }
});

/* ---------- MODULE 5: three-way comparison ---------- */
frame({
  mod: 5, kick: 'Mirror comparison lab', title: 'Same object, three mirrors', mapTitle: 'Plane vs concave vs convex: comparison lab',
  sub: 'One slider moves the object in front of all three mirrors at the same distance.',
  build(b, f) {
    f.u = 150;
    f.P = [{ type: 'plane', x0: 290, name: 'PLANE MIRROR', col: '#fff' }, { type: 'concave', x0: 470, name: 'CONCAVE MIRROR', col: COL.ray }, { type: 'convex', x0: 380, name: 'CONVEX MIRROR', col: COL.ref }];
    f.P.forEach((p, i) => {
      const wrap = h('div', { class: 'abs', style: `left:${i * 606}px;top:0;width:580px` }); b.append(wrap);
      p.c = canvas(wrap, 580, 440); p.c.cv.classList.add('glass');
      p.lab = h('div', { style: 'display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap' });
      wrap.append(p.lab);
      pointer(p.c, { hover: q => Math.abs(q.x - (p.x0 - f.u)) < 40, down: q => Math.abs(q.x - (p.x0 - f.u)) < 50 && (f.u = clamp(p.x0 - q.x, 30, 270), true), move: q => { f.u = clamp(p.x0 - q.x, 30, 270); f.sl.set(f.u); } });
    });
    f.sl = ui.slider({ label: 'Object distance (same for all three)', min: 30, max: 270, value: 150, fmt: v => (v / PX_CM).toFixed(1) + ' cm', onInput: v => f.u = v });
    const row = h('div', { class: 'abs', style: 'left:0;top:520px;width:1792px;display:grid;grid-template-columns:1fr 600px;gap:20px' });
    row.append(h('div', { class: 'col' }, ui.card('Move the object', f.sl), ui.card(null, h('p', { html: '<b>Lateral inversion</b> (left and right swapped) happens in all three mirrors. You can identify a mirror from the image it forms.' }))),
      ui.discover({ qs: ['Which mirror always gives a same-size image?', 'Which mirror can turn the image upside down?', 'Which mirror always makes the image smaller?'], reveal: '<b>Plane</b>: erect, same size, always. <b>Concave</b>: depends on distance — enlarged or diminished, erect or inverted. <b>Convex</b>: always erect and diminished.' }));
    b.append(row);
  },
  tick(f, dt, t) {
    f.P.forEach(p => {
      const x = begin(p.c); bgGrid(x, p.c.w, p.c.h, 40);
      const info = bench(x, { type: p.type, x0: p.x0, y0: 250, f: 110, u: f.u, h: 60, A: 300, w: p.c.w, h2: p.c.h, rays: 'principal', flow: t * 100 * App.speed, small: true, axisLabel: false, twoF: false });
      offscreenHint(x, info, p.c.w, 250);
      tag(x, p.name, p.c.w / 2, 30, { size: 22, col: p.col, weight: 800, need: true, bg: false });
      const d = describe(p.type, info, f.u, 110);
      const chip = (s, c) => `<span style="padding:6px 14px;border-radius:999px;border:1px solid ${c};color:${c};font-size:21px;font-weight:700">${s}</span>`;
      const html = info.inf ? chip('image very far away', COL.mute) : chip(d.ori, d.ocol) + chip(d.sw, '#fff') + chip(d.kind, d.col);
      if (p.lab._h !== html) { p.lab.innerHTML = html; p.lab._h = html; }
    });
  }
});

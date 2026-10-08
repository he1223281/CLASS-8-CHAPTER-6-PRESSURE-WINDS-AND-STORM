/* ================= Modules 6–8: laws of reflection, parallel rays, concentration ================= */

/* ---------- MODULE 6: laws of reflection ---------- */
frame({
  mod: 6, kick: 'Activity 10.4 · Let us experiment', title: 'Laws of reflection', mapTitle: 'Laws of reflection: measure i and r',
  sub: 'Change the angle of the torch, measure i and r, and record each reading in Table 10.1.',
  build(b, f) {
    f.st = { O: [664, 660], L: 440, tilt: 0, th: 30, plane: false, prot: true, mw: 860 };
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    reflectionDrag(f.c, f.st);
    const side = h('div', { class: 'side', style: 'gap:12px' }); b.append(side);
    f.ro = ui.readout([['i', 'Angle of incidence  i'], ['r', 'Angle of reflection  r']]);
    f.tb = h('tbody');
    const tbl = h('table', { class: 't101' }, h('thead', null, h('tr', null, h('th', null, 'S.NO.'), h('th', null, 'i'), h('th', null, 'r'))), f.tb);
    f.rows = 0;
    side.append(ui.card('Protractor reading', f.ro,
      h('div', { class: 'row', style: 'margin:10px 0 8px;gap:10px' },
        ui.btn('Record reading', () => {
          if (f.rows >= 4) { f.tb.firstChild.remove(); f.rows--; }
          f.rows++; const a = Math.abs(f.st.th);
          const n = f.tb.children.length + 1;
          f.tb.append(h('tr', { class: 'new' }, h('td', null, '#' + ((f.count = (f.count || 0) + 1))), h('td', { style: 'color:var(--inc)' }, a + '°'), h('td', { style: 'color:var(--ref)' }, a + '°')));
        }, 'pri'),
        ui.btn('Clear', () => { f.tb.innerHTML = ''; f.rows = 0; f.count = 0; })), tbl));
    f.tilt = ui.slider({ label: 'Tilt the mirror', min: -30, max: 30, value: 0, fmt: v => v + '°', onInput: v => f.st.tilt = v });
    side.append(ui.card(null, h('div', { class: 'col', style: 'gap:8px' }, f.tilt,
      h('div', { class: 'row', style: 'gap:8px' }, h('span', { style: 'font-size:20px;color:var(--mute)' }, 'Fig. 10.22'),
        ui.btn('(a)', () => { f.st.tilt = 0; f.tilt.set(0); f.st.th = 0; }),
        ui.btn('(b)', () => { f.st.tilt = 25; f.tilt.set(25); f.st.th = 0; }),
        ui.btn('(c)', () => { f.st.tilt = 25; f.tilt.set(25); f.st.th = 20; })))));
    b.append(h('div', { class: 'onc' }, ui.toggle({ label: 'Protractor', value: true, onChange: v => f.st.prot = v })));
    side.append(ui.discover({ prompt: 'RECORD FOUR READINGS.', qs: ['Compare the two columns. What do you notice?', 'Tilt the mirror. Is the rule still true?', 'Shine the ray along the normal. What are i and r?'], reveal: '<b>Law 1:</b> the angle of incidence equals the angle of reflection, <b>i = r</b>. It holds for any tilt. Along the normal, i = r = 0°.' }));
  },
  tick(f, dt, t) {
    reflectionScene(f.c, f.st, t);
    const a = Math.abs(f.st.th); f.ro.set('i', a + '°', COL.inc); f.ro.set('r', a + '°', COL.ref);
  }
});

/* ---------- MODULE 6b: the bent-paper experiment (Activity 10.5) ---------- */
frame({
  mod: 6, kick: 'Activity 10.5 · Let us experiment', title: 'All in one plane', mapTitle: 'Activity 10.5: bend the paper — one plane',
  sub: 'The reflected beam is seen on the paper only while the paper lies in the same plane as the incident beam and the normal.',
  build(b, f) {
    f.beta = 0; f.target = 0; f.truth = false;
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const side = h('div', { class: 'side' }); b.append(side);
    f.sl = ui.slider({ label: 'Bend the extended paper', min: 0, max: 80, value: 0, fmt: v => v + '°', onInput: v => { f.target = v; f.beta = v; } });
    f.state = h('div', { class: 'big', style: 'margin-top:8px' });
    side.append(ui.card('Step through it', h('div', { class: 'col', style: 'gap:12px' },
      h('div', { class: 'row', style: 'gap:8px' },
        ui.btn('1 · Flat', () => { f.target = 0; }), ui.btn('2 · Bend', () => { f.target = 55; }), ui.btn('3 · Flatten', () => { f.target = 0; })),
      f.sl, f.state)));
    side.append(ui.card('Look closer', ui.toggle({ label: 'Show where the reflected beam really goes', value: false, onChange: v => f.truth = v })));
    side.append(ui.card('Law 2', h('p', { html: 'The <b style="color:var(--inc)">incident ray</b>, the <b>normal</b> at the point of incidence and the <b class="hc">reflected ray</b> all lie in the <b>same plane</b>.' })));
  },
  tick(f, dt, t) {
    if (Math.abs(f.beta - f.target) > .2) { f.beta += (f.target - f.beta) * Math.min(1, dt * 3); f.sl.set(Math.round(f.beta)); }
    const B = f.beta * DEG, x = begin(f.c, '#090c13');
    const psi = -.38, phi = .92, D = 2200, cx = 760, cy = 470;
    const P = (X, Y, Z) => {
      const x1 = X * Math.cos(psi) - Y * Math.sin(psi), y1 = X * Math.sin(psi) + Y * Math.cos(psi);
      const up = y1 * Math.cos(phi) + Z * Math.sin(phi), dep = y1 * Math.sin(phi) - Z * Math.cos(phi), s = D / (D + dep);
      return [cx + x1 * s, cy - up * s];
    };
    const flap = (X, Y) => P(X * Math.cos(B), Y, -X * Math.sin(B));
    const poly = (pts, fill, stroke) => { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = 1.5; x.stroke(); } };
    // table
    poly([P(-760, -330, 0), P(0, -330, 0), P(0, 340, 0), P(-760, 340, 0)], '#5a3d26');
    poly([P(-760, -330, 0), P(0, -330, 0), P(0, -330, -70), P(-760, -330, -70)], '#3e2a1a');
    poly([P(0, -330, 0), P(0, 340, 0), P(0, 340, -70), P(0, -330, -70)], '#2f2014');
    // paper on table + flap
    poly([P(-620, -270, 1), P(0, -270, 1), P(0, 270, 1), P(-620, 270, 1)], '#e9e6de', 'rgba(0,0,0,.2)');
    const fl = [flap(0, -270), flap(320, -270), flap(320, 270), flap(0, 270)];
    poly(fl, B > .02 ? '#d6d2c8' : '#e9e6de', 'rgba(0,0,0,.25)');
    if (f.truth && B > .02) { poly([P(0, -270, 0), P(320, -270, 0), P(320, 270, 0), P(0, 270, 0)], 'rgba(143,176,255,.08)', 'rgba(143,176,255,.5)'); }
    // mirror (vertical, at the back)
    const mz = 150;
    poly([P(-560, 226, 0), P(-90, 226, 0), P(-90, 226, mz), P(-560, 226, mz)], null);
    const mg = x.createLinearGradient(P(-560, 226, 0)[0], 0, P(-90, 226, 0)[0], 0); mg.addColorStop(0, '#9fb3cc'); mg.addColorStop(.5, '#e8f1ff'); mg.addColorStop(1, '#8aa0bb');
    x.fillStyle = mg; x.fill(); x.strokeStyle = '#5c6b80'; x.lineWidth = 3; x.stroke();
    poly([P(-560, 226, mz), P(-90, 226, mz), P(-90, 240, mz), P(-560, 240, mz)], '#6b7c94');
    poly([P(-600, 240, 0), P(-530, 240, 0), P(-530, 290, 0), P(-600, 290, 0)], '#7a5130');
    // beams (on the paper surface)
    const O = [-300, 224], T = [-580, 9];
    const dir = norm([O[0] - T[0], O[1] - T[1]]), rdir = [dir[0], -dir[1]];
    const tEdge = (0 - O[0]) / rdir[0], E = [0, O[1] + rdir[1] * tEdge];
    const tEnd = (300 - E[0]) / rdir[0], F2 = [300, E[1] + rdir[1] * tEnd];
    const fl2 = t * 120 * App.speed;
    beam(x, [P(T[0], T[1], 1), P(O[0], O[1], 1)], '#fff3c8', { flow: fl2, w: 4 });
    // normal on paper
    const np = [P(O[0], O[1], 1), P(O[0], O[1] - 220, 1)];
    x.save(); x.strokeStyle = 'rgba(30,40,60,.8)'; x.lineWidth = 2.5; x.setLineDash([10, 8]); x.beginPath(); x.moveTo(np[0][0], np[0][1]); x.lineTo(np[1][0], np[1][1]); x.stroke(); x.restore();
    beam(x, [P(O[0], O[1], 1), P(E[0], E[1], 1)], '#fff3c8', { flow: fl2 - 300, w: 4 });
    const visible = B < 1.5 * DEG;
    if (visible) beam(x, [flap(E[0], E[1]), flap(F2[0], F2[1])], '#fff3c8', { w: 4, flow: fl2 - 600 });
    else if (f.truth) {
      beam(x, [P(E[0], E[1], 0), P(F2[0], F2[1], 0)], COL.ref, { dash: [6, 10], a: .9 });
      const m = P(160, (E[1] + F2[1]) / 2, 0);
      tag(x, 'beam continues in the original plane — no paper there to show it', m[0] + 30, m[1] - 40, { size: 19, col: COL.ref, align: 'left', need: true });
    }
    drawTorch(x, P(T[0], T[1], 1)[0], P(T[0], T[1], 1)[1], Math.atan2(P(O[0], O[1], 1)[1] - P(T[0], T[1], 1)[1], P(O[0], O[1], 1)[0] - P(T[0], T[1], 1)[0]), .9);
    const lab = (s, p, o = {}) => tag(x, s, p[0], p[1], Object.assign({ size: 20 }, o));
    lab('Plane mirror', P(-330, 240, mz + 40));
    lab('Incident beam', P(-470, 70, 0), { col: COL.inc });
    lab('Normal', P(O[0] + 20, O[1] - 240, 1), { col: '#fff' });
    lab('Reflected beam', P(-140, 120, 0), { col: COL.ref });
    lab('Edge of table', P(0, -330, -90), { col: COL.mute });
    lab(B > .02 ? 'Bent part — beam NOT seen' : 'Extended part — beam seen', flap(220, -330), { col: B > .02 ? '#ffb0a0' : COL.real });
    f.state.innerHTML = visible ? '<span class="hr">Reflected beam visible</span>' : '<span style="color:#ffb0a0">Reflected beam disappears</span>';
  }
});

/* ---------- MODULE 7: many parallel rays ---------- */
frame({
  mod: 7, kick: 'Activity 10.6 · Let us explore', title: 'Many parallel rays', mapTitle: 'Parallel rays: plane, concave, convex mirrors',
  sub: 'Each ray obeys i = r. The shape of the mirror decides what the beam does.',
  build(b, f) {
    f.n = 10; f.ang = 0;
    f.P = [{ type: 'plane', name: 'PLANE MIRROR', res: 'stay parallel', col: '#fff' }, { type: 'concave', name: 'CONCAVE MIRROR', res: 'converge', col: COL.ray }, { type: 'convex', name: 'CONVEX MIRROR', res: 'diverge', col: COL.ref }];
    f.P.forEach((p, i) => {
      const wrap = h('div', { class: 'abs', style: `left:${i * 606}px;top:0;width:580px` }); b.append(wrap);
      p.c = canvas(wrap, 580, 560); p.c.cv.classList.add('glass');
      wrap.append(h('div', { style: `text-align:center;margin-top:10px;font-size:30px;font-weight:800;color:${p.col}` }, 'Reflected rays ' + p.res));
    });
    const row = h('div', { class: 'abs', style: 'left:0;top:640px;width:1792px;display:grid;grid-template-columns:520px 520px 1fr;gap:20px' });
    row.append(ui.card('Number of rays', ui.seg({ options: [1, 5, 10, 20].map(v => ({ v, t: v + (v === 1 ? ' ray' : ' rays') })), value: 10, onChange: v => f.n = v })),
      ui.card(null, ui.slider({ label: 'Angle of the beam', min: -20, max: 20, value: 0, fmt: v => v + '°', onInput: v => f.ang = v })),
      ui.card(null, h('p', { html: '<b class="hl">Concave</b> mirror <b>converges</b> a beam. <b class="hc">Convex</b> mirror <b>diverges</b> it. The laws of reflection hold for every ray, on every mirror.' })));
    b.append(row);
  },
  tick(f, dt, t) {
    const x0 = 480, cy = 280, A = 380, R = 560, a = f.ang * DEG;
    f.P.forEach(p => {
      const x = begin(p.c); bgGrid(x, p.c.w, p.c.h, 40);
      const V = [x0, cy], s = mirrorSurf(p.type, V, [-1, 0], R, A);
      const n = f.n, fl = t * 110 * App.speed;
      for (let k = 0; k < n; k++) {
        const yh = n === 1 ? cy - 60 : cy - 150 + 300 * k / (n - 1);
        const p0 = [0, yh - Math.tan(a) * x0];
        const r = trace(p0, [Math.cos(a), Math.sin(a)], [s], { len: 900, max: 3 });
        beam(x, r.pts, COL.ray, { flow: fl, w: n > 10 ? 1.6 : 2.2, a: n > 10 ? .8 : 1, as: 10 });
        if (p.type === 'convex' && r.pts.length > 2) { const H = r.pts[1]; beam(x, [H, [H[0] - r.dir[0] * 330, H[1] - r.dir[1] * 330]], COL.ray, { dash: [6, 8], a: .4 }); }
      }
      drawMirror(x, mirrorGeom(p.type, V, [-1, 0], R, A));
      if (p.type === 'concave') { const F = [x0 - R / 2 + 4, cy - Math.tan(a) * R / 2]; glow(x, F[0], F[1], 40, 'rgba(255,240,200,.9)', .8); tag(x, 'rays meet near F', F[0], F[1] + 46, { size: 20, col: COL.ray }); }
      if (p.type === 'convex') tag(x, 'dashed: rays seem to spread from behind the mirror', 290, p.c.h - 26, { size: 18, col: COL.mute });
      tag(x, p.name, 20, 30, { size: 22, col: p.col, align: 'left', weight: 800, bg: false, need: true });
    });
  }
});

/* ---------- MODULE 8: concentration of light ---------- */
function sunScene(x, w, hh, t) {
  const sky = x.createLinearGradient(0, 0, 0, hh); sky.addColorStop(0, '#0e1d33'); sky.addColorStop(.75, '#1a2a3a'); sky.addColorStop(1, '#22311f');
  x.fillStyle = sky; x.fillRect(0, 0, w, hh);
  drawSun(x, 150, 90, 46, t);
}
/* auto-focus: scan distances and return the one giving the narrowest spot */
function bestFocus(spot, lo, hi) {
  let best = lo, bw = 1e9;
  for (let d = lo; d <= hi; d += 1) { const s = spot(d); if (s.n >= s.N * .6 && s.w < bw) { bw = s.w; best = d; } }
  return best;
}
const SUNM = { al: 26 * DEG, R: 660, A: 240, V: [840, 610], N: 30, span: 104 };
function sunMirrorSpot(dp) {
  const { al, R, A, V, N } = SUNM, ax = [-Math.sin(al), -Math.cos(al)], rC = [-Math.sin(2 * al), -Math.cos(2 * al)], pr = [-rC[1], rC[0]];
  const Pc = [V[0] + rC[0] * dp, V[1] + rC[1] * dp], half = 70;
  const card = { kind: 'absorb', geom: 'seg', a: [Pc[0] - pr[0] * half, Pc[1] - pr[1] * half], b: [Pc[0] + pr[0] * half, Pc[1] + pr[1] * half], id: 'card' };
  const ground = { kind: 'absorb', geom: 'seg', a: [-10, 720], b: [1400, 720], id: 'ground' };
  const ms = mirrorSurf('concave', V, ax, R, A), rays = [], hits = [];
  for (let k = 0; k < N; k++) {
    const r = trace([V[0] - SUNM.span + 2 * SUNM.span * k / (N - 1), -10], [0, 1], [ms, card, ground], { len: 1400, max: 4 });
    r.reflected = r.pts.length >= 3; rays.push(r);
    if (r.hit && r.hit.s.id === 'card' && r.reflected) hits.push((r.hit.q[0] - Pc[0]) * pr[0] + (r.hit.q[1] - Pc[1]) * pr[1]);
  }
  const w = hits.length ? Math.max(...hits) - Math.min(...hits) : 1e9;
  return { rays, hits, w, n: hits.length, N, Pc, pr, rC, ax, card };
}
frame({
  mod: 8, kick: 'Activity 10.7 · Let us explore', title: 'Concentrating sunlight', mapTitle: 'Concave mirror concentrates sunlight',
  sub: 'Parallel sunlight → concave mirror → a small, very bright spot on the paper.',
  build(b, f) {
    f.dp = 200; f.heat = 0; f.char = 0; f.smoke = [];
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const side = h('div', { class: 'side', style: 'gap:14px' }); b.append(side);
    side.append(ui.warn('<b>Safety first.</b> Never look at the Sun, or into a mirror or lens reflecting the Sun. Focus sunlight only on paper, never on anyone’s face or eyes. Do this only with a teacher.'));
    f.sl = ui.slider({ label: 'Distance of paper from mirror', min: 130, max: 460, value: 200, fmt: v => (v / PX_CM).toFixed(1) + ' cm', onInput: v => { f.dp = v; f.auto = null; } });
    f.ro = ui.readout([['spot', 'Spot width'], ['conc', 'Sunlight concentrated'], ['st', 'Paper']]);
    side.append(ui.card('Move the paper', f.sl, h('div', { class: 'row', style: 'margin:10px 0 14px;gap:10px' }, ui.btn('Find the brightest spot', () => f.auto = bestFocus(sunMirrorSpot, 130, 460), 'pri'), ui.btn('Reset', () => { f.char = 0; f.heat = 0; f.dp = 200; f.sl.set(200); f.auto = null; })), f.ro));
    const iw = h('div', { class: 'abs card', style: 'left:20px;top:250px;padding:10px 12px' }, h('h3', { style: 'margin-bottom:6px' }, 'Paper, seen from the front'));
    f.inset = canvas(iw, 300, 170); b.append(iw);
  },
  tick(f, dt, t) {
    const x = begin(f.c); sunScene(x, f.c.w, f.c.h, t);
    const { R, A, V, N } = SUNM;
    if (f.auto != null) { f.dp += (f.auto - f.dp) * Math.min(1, dt * 2.5); f.sl.set(Math.round(f.dp)); if (Math.abs(f.dp - f.auto) < .5) { f.dp = f.auto; f.auto = null; } }
    const sp0 = sunMirrorSpot(f.dp), { Pc, pr, rC, ax, card, hits } = sp0;
    const gg = x.createLinearGradient(0, 700, 0, 778); gg.addColorStop(0, '#2c4a26'); gg.addColorStop(1, '#16260f'); x.fillStyle = gg; x.fillRect(0, 712, f.c.w, 70);
    const fl = t * 120 * App.speed;
    for (const r of sp0.rays) beam(x, r.pts, '#ffe6a0', { flow: fl, w: 1.6, a: r.reflected ? .85 : .35, arrows: false });
    drawMirror(x, mirrorGeom('concave', V, ax, R, A));
    // stand
    x.fillStyle = '#3a3f4a'; x.beginPath(); x.moveTo(V[0] - 20, V[1] + 40); x.lineTo(V[0] + 30, V[1] + 40); x.lineTo(V[0] + 10, 716); x.lineTo(V[0] - 6, 716); x.fill();
    // paper card (edge-on) + holder
    let w = 0, mn = 0, mx = 0;
    if (hits.length) { mn = Math.min(...hits); mx = Math.max(...hits); w = mx - mn; }
    const conc = hits.length ? hits.length * (2 * SUNM.span / (N - 1)) / Math.max(w, 1.2) : 0;
    f.heat += (Math.min(conc, 120) - f.heat) * Math.min(1, dt * .6);
    if (f.heat > 12) f.char = Math.min(1, f.char + dt * (f.heat - 12) / 60);
    x.save(); x.lineCap = 'round'; x.strokeStyle = '#d8cbb0'; x.lineWidth = 8;
    x.beginPath(); x.moveTo(card.a[0], card.a[1]); x.lineTo(card.b[0], card.b[1]); x.stroke(); x.restore();
    if (hits.length) {
      const sp = mn + w / 2, S = [Pc[0] + pr[0] * sp, Pc[1] + pr[1] * sp];
      glow(x, S[0], S[1], 30 + 400 / Math.max(w, 3), 'rgba(255,245,210,1)', clamp(conc / 30, .3, 1));
    }
    // smoke
    if (f.char > .25 && Math.random() < dt * 14) f.smoke.push({ x: Pc[0], y: Pc[1], vx: (Math.random() - .5) * 20, vy: -40 - Math.random() * 30, a: .5, r: 8 });
    f.smoke = f.smoke.filter(s => (s.a -= dt * .25) > 0);
    f.smoke.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.r += dt * 18; x.fillStyle = `rgba(200,200,210,${s.a * .5})`; x.beginPath(); x.arc(s.x, s.y, s.r, 0, TAU); x.fill(); });
    // focus label
    const F = [V[0] + rC[0] * R / 2, V[1] + rC[1] * R / 2];
    dashLine(x, V[0], V[1], V[0] + rC[0] * 520, V[1] + rC[1] * 520, 'rgba(255,255,255,.15)', 1.5);
    dot(x, F[0], F[1], 4, '#fff'); tag(x, 'F', F[0] + 18, F[1] - 18, { size: 20, weight: 700 });
    tag(x, 'Parallel sunlight', 470, 120, { size: 22, col: '#ffe6a0' });
    tag(x, 'Concave mirror', V[0] + 160, V[1] + 10, { size: 22, col: COL.mute });
    tag(x, 'Paper', card.b[0] - 30, card.b[1] - 30, { size: 20 });
    // readouts
    f.ro.set('spot', hits.length ? (w / PX_CM * 10).toFixed(1) + ' mm' : '—');
    f.ro.set('conc', hits.length ? '×' + Math.round(conc * conc) : '—', conc > 10 ? COL.ray : null);
    f.ro.set('st', f.char > .25 ? 'smoking!' : f.heat > 7 ? 'getting hot' : 'cool', f.char > .25 ? COL.warn : f.heat > 7 ? COL.ray : COL.real);
    // inset: paper from the front
    const y = begin(f.inset, '#0b0f18');
    y.fillStyle = '#e6dcc4'; rrect(y, 30, 8, 240, 154, 6); y.fill();
    if (f.char > 0) { y.fillStyle = `rgba(60,30,10,${f.char})`; y.beginPath(); y.arc(150, 85, 6 + f.char * 26, 0, TAU); y.fill(); }
    if (hits.length) { const r = clamp(w / 2, 2, 70); glow(y, 150, 85, r * 2.2, 'rgba(255,240,190,1)', clamp(conc / 40, .25, 1)); dot(y, 150, 85, r * .7, `rgba(255,255,240,${clamp(conc / 30, .3, 1)})`); }
  }
});

/* ---------- MODULE 8b: solar concentrators ---------- */
const SOLAR = [
  {
    t: 'Solar concentrator', d: 'Long curved mirrors focus sunlight on a pipe. The liquid inside gets very hot.',
    draw(x, w, hh, t) {
      const V = [w / 2, hh - 40], R = 300, s = mirrorSurf('concave', V, [0, -1], R, 260), F = [V[0], V[1] - R / 2];
      for (let k = 0; k < 12; k++) { const X = V[0] - 120 + 240 * k / 11; beam(x, trace([X, 0], [0, 1], [s], { len: 140, max: 2 }).pts, '#ffe6a0', { w: 1.4, flow: t * 90, arrows: false, a: .8 }); }
      drawMirror(x, mirrorGeom('concave', V, [0, -1], R, 260));
      dot(x, F[0], F[1], 11, '#c0c6d2'); glow(x, F[0], F[1], 36, 'rgba(255,170,80,.9)', .6 + .2 * Math.sin(t * 3));
      tag(x, 'hot pipe', F[0] + 70, F[1], { size: 16 });
    }
  },
  {
    t: 'Solar furnace', d: 'Many mirrors aim sunlight at one small spot — hot enough to melt steel.',
    draw(x, w, hh, t) {
      const T = [w - 70, 70];
      x.fillStyle = '#5a6272'; x.fillRect(T[0] - 10, T[1], 20, hh - T[1] - 20);
      for (let k = 0; k < 6; k++) {
        const M = [40 + k * 48, hh - 40], inc = [0, 1], out = norm([T[0] - M[0], T[1] - M[1]]);
        const nrm = norm([out[0] - inc[0], out[1] - inc[1]]);
        beam(x, [[M[0], 0], M, T], '#ffe6a0', { w: 1.3, flow: t * 90 + k * 20, arrows: false, a: .7 });
        drawMirror(x, mirrorGeom('plane', M, nrm, 1, 30));
      }
      glow(x, T[0], T[1], 50, 'rgba(255,200,120,1)', .8 + .2 * Math.sin(t * 4));
      tag(x, 'very hot', T[0] - 10, T[1] - 30, { size: 16 });
    }
  },
  {
    t: 'Solar cooking', d: 'A curved mirror throws concentrated sunlight onto a cooking pot (Fig. 10.29).',
    draw(x, w, hh, t) {
      const V = [130, hh - 50], ax = norm([.9, -1]), R = 340, s = mirrorSurf('concave', V, ax, R, 200);
      const pot = { kind: 'absorb', geom: 'seg', a: [300, 110], b: [300, 170] };
      for (let k = 0; k < 10; k++) { const X = 50 + 170 * k / 9; beam(x, trace([X, 0], [0, 1], [s, pot], { len: 400, max: 3 }).pts, '#ffe6a0', { w: 1.3, flow: t * 90, arrows: false, a: .8 }); }
      drawMirror(x, mirrorGeom('concave', V, ax, R, 200));
      x.fillStyle = '#3b3f48'; rrect(x, 296, 100, 80, 80, 8); x.fill(); x.fillStyle = '#6b7180'; x.fillRect(290, 96, 92, 10);
      for (let k = 0; k < 3; k++) { const y0 = 92 - ((t * 30 + k * 20) % 60); x.strokeStyle = `rgba(220,220,230,${.5 - (92 - y0) / 140})`; x.lineWidth = 3; x.beginPath(); x.moveTo(320 + k * 16, y0); x.quadraticCurveTo(326 + k * 16, y0 - 10, 320 + k * 16, y0 - 20); x.stroke(); }
    }
  },
  {
    t: 'Heat → steam → electricity', d: 'Concentrated heat boils water. Steam spins a turbine, which generates electricity.',
    draw(x, w, hh, t) {
      glow(x, 60, hh / 2, 50, 'rgba(255,190,90,1)', .9); tag(x, 'heat', 60, hh / 2 + 56, { size: 16 });
      x.fillStyle = '#4a5468'; rrect(x, 100, hh / 2 - 40, 80, 80, 12); x.fill(); tag(x, 'water→steam', 140, hh / 2 + 58, { size: 15 });
      for (let k = 0; k < 6; k++) { const p = ((t * 60 + k * 30) % 160); x.fillStyle = 'rgba(220,230,255,.6)'; x.beginPath(); x.arc(180 + p, hh / 2 - 6 + Math.sin(k + t * 4) * 4, 6, 0, TAU); x.fill(); }
      x.save(); x.translate(370, hh / 2); x.rotate(t * 6); x.fillStyle = '#9aa6bb'; for (let k = 0; k < 6; k++) { x.rotate(TAU / 6); x.fillRect(0, -6, 38, 12); } x.restore(); tag(x, 'turbine', 370, hh / 2 + 58, { size: 15 });
      glow(x, w - 30, 60, 40, 'rgba(255,240,170,1)', .7 + .3 * Math.sin(t * 5)); dot(x, w - 30, 60, 12, '#fff6c8');
    }
  }
];
frame({
  mod: 8, kick: 'A step further', title: 'Putting concentrated sunlight to work', mapTitle: 'Solar concentrators, furnaces, cooking',
  sub: 'Devices that concentrate sunlight into a small area, using mirrors and lenses, are called <b>solar concentrators</b>.',
  build(b, f) {
    f.cs = SOLAR.map((S, i) => {
      const wrap = h('div', { class: 'abs card', style: `left:${(i % 2) * 906}px;top:${Math.floor(i / 2) * 392}px;width:886px;height:372px;display:grid;grid-template-columns:440px 1fr;gap:22px;align-items:center` });
      const c = canvas(wrap, 440, 330); c.cv.style.background = '#0b1220';
      wrap.append(h('div', null, h('div', { class: 'big', style: 'font-size:34px;margin-bottom:12px' }, S.t), h('p', { style: 'font-size:25px' }, S.d)));
      b.append(wrap); return c;
    });
  },
  tick(f, dt, t) { f.cs.forEach((c, i) => { const x = begin(c, '#0b1220'); SOLAR[i].draw(x, c.w, c.h, t * App.speed); }); }
});

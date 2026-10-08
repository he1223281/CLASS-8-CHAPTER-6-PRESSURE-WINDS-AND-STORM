/* ================= Modules 9–12, 15, 16: lenses ================= */

/* 2.5-D picture of a lens (like Fig. 10.15a / 10.16a) */
function drawLens3D(x, cx, cy, R, k) {
  // k > 0 convex (thick middle), k < 0 concave (thick edge), 0 flat plate
  const rim = 18 + Math.max(0, -k) * 34, bulge = Math.max(0, k) * 46, dip = Math.max(0, -k) * 30;
  x.save();
  // edge band
  const eg = x.createLinearGradient(0, cy - R * .35, 0, cy + R * .35 + rim);
  eg.addColorStop(0, 'rgba(110,190,170,.55)'); eg.addColorStop(1, 'rgba(40,110,100,.75)');
  x.fillStyle = eg; x.beginPath(); x.ellipse(cx, cy + rim, R, R * .32, 0, 0, Math.PI); x.lineTo(cx - R, cy); x.ellipse(cx, cy, R, R * .32, 0, Math.PI, 0, true); x.closePath(); x.fill();
  // top face
  const tg = x.createRadialGradient(cx - R * .3, cy - R * .12 - bulge * .5, 4, cx, cy, R);
  tg.addColorStop(0, 'rgba(235,250,255,.75)'); tg.addColorStop(.5, 'rgba(150,215,225,.35)'); tg.addColorStop(1, 'rgba(90,170,170,.5)');
  x.fillStyle = tg; x.beginPath(); x.ellipse(cx, cy, R, R * .32, 0, 0, TAU); x.fill();
  x.strokeStyle = 'rgba(220,250,255,.8)'; x.lineWidth = 2; x.stroke();
  // curvature cue
  x.globalCompositeOperation = 'lighter';
  if (bulge) { x.fillStyle = `rgba(255,255,255,${.12 + k * .12})`; x.beginPath(); x.ellipse(cx - R * .25, cy - R * .06, R * .45, R * .1, -.08, 0, TAU); x.fill(); }
  if (dip) { x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 3; x.beginPath(); x.ellipse(cx, cy, R * .82, R * .25, 0, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
  x.restore();
}

/* ---------- MODULE 9: what is a lens? ---------- */
frame({
  mod: 9, kick: 'From mirrors to lenses', title: 'What is a lens?', mapTitle: 'What is a lens? Flat glass vs curved glass',
  sub: 'A lens is a piece of transparent material — glass or plastic — with curved surfaces. Light passes <b>through</b> it.',
  build(b, f) {
    f.k = 0; f.n = 9; f.intro = 0;
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const side = h('div', { class: 'side' }); b.append(side);
    f.sl = ui.slider({ label: 'Shape of the glass', min: -100, max: 100, value: 0, fmt: v => v < -8 ? 'concave' : v > 8 ? 'convex' : 'flat', onInput: v => { f.k = v / 100; f.anim = null; } });
    side.append(ui.card('Bend the surfaces', f.sl, h('div', { class: 'row', style: 'gap:8px;margin-top:12px' },
      ui.btn('Concave', () => f.anim = -1), ui.btn('Flat', () => f.anim = 0), ui.btn('Convex', () => f.anim = 1))));
    f.c3 = canvas(null, 392, 230); side.append(ui.card('What it looks like', f.c3.cv));
    f.txt = h('p'); side.append(ui.card(null, f.txt));
  },
  enter(f) { f.intro = 0; },
  tick(f, dt, t) {
    if (f.anim != null) { f.k += (f.anim - f.k) * Math.min(1, dt * 3); f.sl.set(Math.round(f.k * 100)); if (Math.abs(f.k - f.anim) < .005) { f.k = f.anim; f.anim = null; } }
    f.intro = Math.min(1, f.intro + dt * .45);
    const x = begin(f.c); bgGrid(x, f.c.w, f.c.h);
    const x0 = 640, cy = 390, A = 320, cmax = 1 / 330, c = f.k * cmax;
    const tc = c > 0 ? 8 + 2 * sagOf(c, A / 2) : 14;
    const L = lensModel(x0, cy, A, c, -c, tc);
    const p = ease(clamp((f.intro - .25) / .6, 0, 1));   // mirror → glass transition
    const fl = t * 110 * App.speed, N = 13;
    if (p < 1) {
      const ms = mirrorSurf('plane', [x0, cy], [-1, 0], 1, A);
      for (let k = 0; k < N; k++) { const y = cy - 140 + 280 * k / (N - 1); beam(x, trace([0, y], [1, 0], [ms], { len: 700 }).pts, COL.ray, { flow: fl, w: 2, a: 1 - p, arrows: false }); }
      x.save(); x.globalAlpha = 1 - p; drawMirror(x, mirrorGeom('plane', [x0, cy], [-1, 0], 1, A)); x.restore();
      if (p < .5) tag(x, 'A mirror sends light back…', x0 - 330, 60, { size: 28, col: '#fff', need: true });
    }
    if (p > 0) {
      x.save(); x.globalAlpha = p; drawGlass(x, L.outline); x.restore();
      for (let k = 0; k < N; k++) { const y = cy - 140 + 280 * k / (N - 1); beam(x, trace([0, y], [1, 0], L.surfs, { len: 900 }).pts, COL.ray, { flow: fl, w: 2, a: p, arrows: false }); }
    }
    if (p >= 1) {
      const ttl = f.k < -.08 ? 'CONCAVE LENS — thicker at the edges' : f.k > .08 ? 'CONVEX LENS — thicker in the middle' : 'FLAT GLASS — light goes straight through';
      tag(x, ttl, f.c.w / 2, 56, { size: 30, weight: 800, col: f.k < -.08 ? COL.ref : f.k > .08 ? COL.ray : '#fff', need: true });
      tag(x, f.k < -.08 ? 'rays spread out' : f.k > .08 ? 'rays bend towards each other' : 'rays unchanged', 1110, cy + 260, { size: 24, col: COL.mute });
    } else if (p > .5) tag(x, '…glass lets it pass through', x0 - 330, 60, { size: 28, col: '#fff', need: true });
    const y = begin(f.c3); drawLens3D(y, 196, 96, 150, f.k);
    tag(y, f.k < -.08 ? 'Concave lens' : f.k > .08 ? 'Convex lens' : 'Glass plate', 196, 205, { size: 20, need: true, bg: false });
    f.txt.innerHTML = f.k > .08 ? 'A <b class="hl">convex lens</b> is thicker at the middle than at the edges.' : f.k < -.08 ? 'A <b class="hc">concave lens</b> is thicker at the edges than at the middle.' : 'Flat glass: things look the same size and shape through a window pane.';
  }
});

/* ---------- MODULE 10a / 11a: parallel beam through a lens ---------- */
function beamFrame(def) {
  frame({
    mod: def.mod, kick: def.kick, title: def.title, sub: def.sub, mapTitle: def.mapTitle,
    build(b, f) {
      f.n = 10; f.fl = 280; f.cross = false;
      f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
      const side = h('div', { class: 'side' }); b.append(side);
      side.append(ui.card('Rays', ui.seg({ options: [1, 5, 10, 20].map(v => ({ v, t: v + '' })), value: 10, onChange: v => f.n = v })));
      side.append(ui.card('Lens', ui.slider({ label: 'Focal length (curvature)', min: 230, max: 420, value: 280, fmt: v => (v / PX_CM).toFixed(0) + ' cm', onInput: v => f.fl = v }),
        h('p', { style: 'margin-top:10px;font-size:21px;color:var(--mute)' }, 'More curved surfaces → shorter focal length.')));
      side.append(ui.card(null, h('p', { html: def.note })));
      if (def.disc) side.append(ui.discover(def.disc));
    },
    tick(f, dt, t) {
      const x = begin(f.c); bgGrid(x, f.c.w, f.c.h);
      const x0 = def.x0, cy = 380, A = 280, L = makeLens(def.type, x0, cy, A, f.fl), fl = t * 110 * App.speed, lab = App.labels;
      dashLine(x, 0, cy, f.c.w, cy, COL.axis, 1.5, [14, 10]);
      drawGlass(x, L.outline);
      const cr = [];
      for (let k = 0; k < f.n; k++) {
        const y = f.n === 1 ? cy - 80 : cy - 115 + 230 * k / (f.n - 1);
        const r = trace([0, y], [1, 0], L.surfs, { len: 1400 });
        beam(x, r.pts, COL.ray, { flow: fl, w: f.n > 10 ? 1.6 : 2.2, as: 10 });
        const last = r.pts[r.pts.length - 2];
        if (Math.abs(y - cy) > 2 && Math.abs(r.dir[1]) > 1e-4) {
          const tA = (cy - last[1]) / r.dir[1];
          if (def.type === 'convexLens' ? tA > 0 : tA < 0) cr.push(last[0] + r.dir[0] * tA);
          if (def.type === 'concaveLens' && tA < 0) beam(x, [last, [last[0] + r.dir[0] * tA, cy]], COL.ray, { dash: [7, 8], a: .5 });
        }
      }
      // focal points (thin lens) and the focal region (where the real rays actually cross)
      const F1 = x0 - f.fl, F2 = x0 + f.fl;
      if (cr.length) {
        const mn = Math.min(...cr), mx = Math.max(...cr);
        x.save(); x.globalCompositeOperation = 'lighter';
        const g = x.createLinearGradient(mn - 20, 0, mx + 20, 0); g.addColorStop(0, 'rgba(255,220,140,0)'); g.addColorStop(.5, 'rgba(255,220,140,.35)'); g.addColorStop(1, 'rgba(255,220,140,0)');
        x.fillStyle = g; x.beginPath(); x.ellipse((mn + mx) / 2, cy, (mx - mn) / 2 + 26, 30, 0, 0, TAU); x.fill(); x.restore();
        if (lab && f.n > 1) tag(x, def.type === 'convexLens' ? 'Focal region — rays cross here' : 'Rays seem to come from here', (mn + mx) / 2, cy + 74, { size: 21, col: COL.ray });
      }
      [[F1, 'F'], [F2, "F'"]].forEach(([X, s]) => { dot(x, X, cy, 6, '#fff'); if (lab) tag(x, s, X, cy + 30, { size: 22, weight: 700 }); });
      dot(x, x0, cy, 6, COL.ref);
      if (lab) {
        tag(x, 'Optical centre O', x0, cy - A / 2 - 34, { size: 21, col: COL.ref });
        tag(x, 'Principal axis', f.c.w - 110, cy - 24, { size: 20, col: COL.mute, bg: false });
        tag(x, 'Parallel rays', 120, cy - 150, { size: 22, col: COL.ray });
        tag(x, `Focal length = ${(f.fl / PX_CM).toFixed(0)} cm`, def.type === 'convexLens' ? (x0 + F2) / 2 : (x0 + F1) / 2, cy + 190, { size: 20, col: COL.mute });
        const fx = def.type === 'convexLens' ? F2 : F1; dashLine(x, x0, cy + 160, fx, cy + 160, 'rgba(255,255,255,.35)', 1.5, [4, 5]);
      }
    }
  });
}
beamFrame({
  mod: 10, type: 'convexLens', x0: 520, kick: 'Converging lens', title: 'Convex lens: rays converge', mapTitle: 'Convex lens: parallel rays converge',
  sub: 'Every ray bends twice — entering and leaving the glass — following the real law of refraction.',
  note: 'A <b class="hl">convex lens</b> bends parallel rays <b>towards each other</b>. That is why it is called a <b>converging lens</b>. The point where they meet is the <b>focal point</b>; real rays meet in a small <b>focal region</b>.'
});

/* lens labs (object you can drag) */
labFrame({
  mod: 10, kick: 'Activity 10.9 · Let us experiment', title: 'Convex lens: move the object', mapTitle: 'Convex lens: image formation lab',
  sub: 'Drag the candle along the principal axis. The image moves and resizes continuously.',
  type: 'convexLens', x0: 700, y0: 400, f: 170, u0: 520, umin: 30, umax: 680, A: 420,
  glideTxt: 'Walk object in ⟶',
  disc: {
    qs: ['Object far from the lens. Is the image erect or inverted?', 'Move it closer. Does the image get bigger or smaller?', 'Where is the object when the image is very far away?', 'Object very close to the lens: what do you see now?'],
    reveal: 'Object close to the lens (inside F): <b>erect and enlarged</b> (virtual) — a magnifying glass. Farther away: <b>inverted</b> and real, first enlarged and then diminished as the object moves away. Like a concave mirror, a convex lens can form many kinds of images.'
  },
  overlay(x, f) { lensInset(x, f); }
});
function lensInset(x, f) {
  const cx = 120, cy = 120, r = 92, m = f.info.s.m, am = Math.abs(m);
  x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fillStyle = '#121826'; x.fill(); x.clip();
  if (!f.info.inf && am < 30) { x.filter = am > 5 ? `blur(${Math.min(10, (am - 5) * 2)}px)` : 'none'; x.translate(cx, cy + (m > 0 ? 40 : -40) * Math.min(am, 2.2)); x.scale(Math.min(am, 5) * .9, (m > 0 ? 1 : -1) * Math.min(am, 5) * .9); drawObj(x, 'candle', 90, {}); }
  x.restore();
  x.strokeStyle = 'rgba(200,238,255,.9)'; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.stroke();
  tag(x, 'Looking through the lens', cx + r + 12, cy - r + 14, { align: 'left', size: 18, col: COL.mute, bg: false });
}

beamFrame({
  mod: 11, type: 'concaveLens', x0: 620, kick: 'Diverging lens', title: 'Concave lens: rays diverge', mapTitle: 'Concave lens: parallel rays diverge',
  sub: 'Follow the dashed lines backwards: the spreading rays all seem to come from one point, F.',
  note: 'A <b class="hc">concave lens</b> spreads parallel rays apart: a <b>diverging lens</b>. Traced backwards (dashed), they appear to start from the focal point F on the same side as the light comes from.'
});
labFrame({
  mod: 11, kick: 'Concave lens lab', title: 'Concave lens: move the object', mapTitle: 'Concave lens: image formation lab',
  sub: 'The rays leaving the lens spread out. Your eye traces them back to where the image seems to be.',
  type: 'concaveLens', x0: 840, y0: 400, f: 190, u0: 440, umin: 30, umax: 820, A: 420,
  disc: {
    qs: ['Move the object anywhere. Is the image ever inverted?', 'Is the image ever larger than the object?', 'Where does the image appear — and why is it drawn dashed?'],
    reveal: 'A concave lens always forms an <b>erect, diminished</b> image on the same side as the object. No light actually reaches it — the dashed backward extensions of the diverging rays meet there. It is a <b>virtual</b> image.'
  },
  overlay(x, f) { lensInset(x, f); }
});

/* ---------- MODULE 12: convex vs concave lens, split screen ---------- */
frame({
  mod: 12, kick: 'Split-screen comparison', title: 'Convex vs concave lens', mapTitle: 'Convex vs concave lens: split screen',
  sub: 'Each side has its own object. Drag either one.',
  build(b, f) {
    f.L = [{ type: 'convexLens', x0: 520, u: 300, name: 'CONVEX — converging lens', col: COL.ray }, { type: 'concaveLens', x0: 560, u: 300, name: 'CONCAVE — diverging lens', col: COL.ref }];
    f.L.forEach((p, i) => {
      const wrap = h('div', { class: 'abs', style: `left:${i * 906}px;top:0;width:886px` }); b.append(wrap);
      p.c = canvas(wrap, 886, 540); p.c.cv.classList.add('glass');
      p.ro = ui.readout([['ori', 'Orientation'], ['size', 'Size'], ['kind', 'Type'], ['img', 'Image']]);
      wrap.append(h('div', { class: 'card', style: 'margin-top:16px' }, p.ro));
      const near = q => Math.abs(q.x - (p.x0 - p.u)) < 50;
      pointer(p.c, { hover: near, down: q => near(q) || Math.abs(q.y - 300) < 60 ? (p.u = clamp(p.x0 - q.x, 30, p.x0 - 20), true) : false, move: q => p.u = clamp(p.x0 - q.x, 30, p.x0 - 20) });
    });
  },
  tick(f, dt, t) {
    f.L.forEach(p => {
      const x = begin(p.c); bgGrid(x, p.c.w, p.c.h, 40);
      const info = bench(x, { type: p.type, x0: p.x0, y0: 300, f: 140, u: p.u, h: 70, A: 340, w: p.c.w, h2: p.c.h, rays: 'principal', flow: t * 100 * App.speed, small: true, axisLabel: false });
      offscreenHint(x, info, p.c.w, 300);
      tag(x, p.name, 24, 34, { size: 24, col: p.col, weight: 800, align: 'left', bg: false, need: true });
      const d = describe(p.type, info, p.u, 140);
      p.ro.set('ori', d.ori, d.ocol); p.ro.set('size', d.size); p.ro.set('kind', d.kind, d.col); p.ro.set('img', d.where);
    });
  }
});

/* ---------- MODULE 15: parallel light through three materials ---------- */
frame({
  mod: 15, kick: 'Activity 10.10 · Let us investigate', title: 'Plate, convex lens, concave lens', mapTitle: 'Parallel light through plate, convex and concave lens',
  sub: 'The same parallel beam meets three pieces of glass.',
  build(b, f) {
    f.n = 10; f.ang = 0;
    f.P = [{ type: 'plate', name: 'THIN GLASS PLATE', res: 'passes straight through', col: '#fff' }, { type: 'convexLens', name: 'CONVEX LENS', res: 'converges', col: COL.ray }, { type: 'concaveLens', name: 'CONCAVE LENS', res: 'diverges', col: COL.ref }];
    f.P.forEach((p, i) => {
      const wrap = h('div', { class: 'abs', style: `left:${i * 606}px;top:0;width:580px` }); b.append(wrap);
      p.c = canvas(wrap, 580, 540); p.c.cv.classList.add('glass');
      wrap.append(h('div', { style: `text-align:center;margin-top:10px;font-size:29px;font-weight:800;color:${p.col}` }, 'Beam ' + p.res));
    });
    const row = h('div', { class: 'abs', style: 'left:0;top:620px;width:1792px;display:grid;grid-template-columns:520px 520px 1fr;gap:20px' });
    row.append(ui.card('Number of rays', ui.seg({ options: [1, 5, 10, 20].map(v => ({ v, t: v + '' })), value: 10, onChange: v => f.n = v })),
      ui.card(null, ui.slider({ label: 'Angle of the beam', min: -15, max: 15, value: 0, fmt: v => v + '°', onInput: v => f.ang = v })),
      ui.card(null, h('p', { html: 'Convex lens = <b class="hl">converging lens</b>. Concave lens = <b class="hc">diverging lens</b>. A thin flat plate leaves the beam parallel.' })));
    b.append(row);
  },
  tick(f, dt, t) {
    const x0 = 250, cy = 270, A = 270, a = f.ang * DEG;
    f.P.forEach(p => {
      const x = begin(p.c); bgGrid(x, p.c.w, p.c.h, 40);
      const L = makeLens(p.type, x0, cy, A, 270), fl = t * 110 * App.speed;
      drawGlass(x, L.outline);
      for (let k = 0; k < f.n; k++) {
        const yh = f.n === 1 ? cy - 70 : cy - 110 + 220 * k / (f.n - 1);
        const r = trace([0, yh - Math.tan(a) * x0], [Math.cos(a), Math.sin(a)], L.surfs, { len: 900 });
        beam(x, r.pts, COL.ray, { flow: fl, w: f.n > 10 ? 1.6 : 2.2, as: 10 });
      }
      tag(x, p.name, 20, 30, { size: 22, col: p.col, align: 'left', weight: 800, bg: false, need: true });
    });
  }
});

/* ---------- MODULE 16: convex lens + sunlight ---------- */
const SUNL = { fL: 320, groundY: 700, N: 26, span: 92 };
function sunLensSpot(dp) {
  const { fL, groundY, N } = SUNL, lensX = groundY - dp;
  const L = makeLens('convexLens', lensX, 0, 220, fL), paper = { kind: 'absorb', geom: 'seg', a: [groundY, -400], b: [groundY, 400] };
  const rays = [], hits = [];
  for (let k = 0; k < N; k++) {
    const r = trace([-20, -SUNL.span + 2 * SUNL.span * k / (N - 1)], [1, 0], [...L.surfs, paper], { len: 900 });
    rays.push(r); if (r.hit && r.pts.length >= 4) hits.push(r.hit.q[1]);
  }
  const w = hits.length ? Math.max(...hits) - Math.min(...hits) : 1e9;
  return { rays, hits, w, n: hits.length, N, L, lensX };
}
frame({
  mod: 16, kick: 'Activity 10.11 · Let us investigate', title: 'A convex lens can burn paper', mapTitle: 'Convex lens concentrates sunlight',
  sub: 'Parallel sunlight → convex lens → a tiny bright spot. Concentrated light produces strong heating.',
  build(b, f) {
    f.dp = 200; f.heat = 0; f.char = 0; f.smoke = [];
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const side = h('div', { class: 'side', style: 'gap:14px' }); b.append(side);
    side.append(ui.warn('<b>Safety first.</b> Never look at the Sun directly or through a lens — it can permanently damage your eyes. Never point focused sunlight at people, animals or anything that can catch fire.'));
    f.sl = ui.slider({ label: 'Height of lens above paper', min: 120, max: 520, value: 200, fmt: v => (v / PX_CM).toFixed(1) + ' cm', onInput: v => { f.dp = v; f.auto = null; } });
    f.ro = ui.readout([['spot', 'Spot size'], ['conc', 'Sunlight concentrated'], ['st', 'Paper']]);
    side.append(ui.card('Raise or lower the lens', f.sl, h('div', { class: 'row', style: 'margin:10px 0 14px;gap:10px' }, ui.btn('Find the sharpest spot', () => f.auto = bestFocus(sunLensSpot, 120, 520), 'pri'), ui.btn('Reset', () => { f.char = 0; f.heat = 0; f.dp = 200; f.sl.set(200); f.auto = null; })), f.ro));
    const iw = h('div', { class: 'abs card', style: 'left:20px;top:250px;padding:10px 12px' }, h('h3', { style: 'margin-bottom:6px' }, 'Paper, seen from above'));
    f.inset = canvas(iw, 300, 170); b.append(iw);
  },
  tick(f, dt, t) {
    const x = begin(f.c); sunScene(x, f.c.w, f.c.h, t);
    if (f.auto != null) { f.dp += (f.auto - f.dp) * Math.min(1, dt * 2.5); f.sl.set(Math.round(f.dp)); if (Math.abs(f.dp - f.auto) < .5) { f.dp = f.auto; f.auto = null; } }
    const Tx = 700, groundY = SUNL.groundY, sp0 = sunLensSpot(f.dp), { L, lensX, hits } = sp0, N = SUNL.N;
    const S = (mx, my) => [Tx - my, mx];
    const g2 = x.createLinearGradient(0, groundY, 0, 778); g2.addColorStop(0, '#2c4a26'); g2.addColorStop(1, '#15240f'); x.fillStyle = g2; x.fillRect(0, groundY, f.c.w, 90);
    x.fillStyle = '#e2d6bb'; x.fillRect(Tx - 260, groundY - 4, 520, 10);
    x.save(); x.translate(Tx, 0); x.rotate(Math.PI / 2);
    const fl = t * 120 * App.speed;
    for (const r of sp0.rays) beam(x, r.pts, '#ffe6a0', { flow: fl, w: 1.6, a: .85, arrows: false });
    for (const my of [-240, -170, 170, 240]) beam(x, [[-20, my], [groundY, my]], '#ffe6a0', { w: 1.4, a: .3, arrows: false });
    drawGlass(x, L.outline);
    x.restore();
    // lens holder
    const lp = S(lensX, 0); x.strokeStyle = '#6b7180'; x.lineWidth = 6; x.beginPath(); x.moveTo(lp[0] + 150, lp[1]); x.lineTo(lp[0] + 260, lp[1] - 30); x.stroke();
    let w = 0, mn = 0, mx = 0; if (hits.length) { mn = Math.min(...hits); mx = Math.max(...hits); w = mx - mn; }
    const conc = hits.length ? hits.length * (2 * SUNL.span / (N - 1)) / Math.max(w, 1.2) : 0;
    f.heat += (Math.min(conc, 120) - f.heat) * Math.min(1, dt * .6);
    if (f.heat > 12) f.char = Math.min(1, f.char + dt * (f.heat - 12) / 60);
    const sc = Tx - (mn + mx) / 2;
    glow(x, sc, groundY, 24 + 300 / Math.max(w, 3), 'rgba(255,245,210,1)', clamp(conc / 30, .3, 1));
    if (f.char > .25 && Math.random() < dt * 14) f.smoke.push({ x: sc, y: groundY - 6, vx: (Math.random() - .5) * 20, vy: -40 - Math.random() * 30, a: .5, r: 8 });
    f.smoke = f.smoke.filter(s => (s.a -= dt * .25) > 0);
    f.smoke.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.r += dt * 18; x.fillStyle = `rgba(200,200,210,${s.a * .5})`; x.beginPath(); x.arc(s.x, s.y, s.r, 0, TAU); x.fill(); });
    tag(x, 'Convex lens', lp[0] - 260, lp[1], { size: 22, col: COL.ink });
    tag(x, 'Paper', Tx + 300, groundY - 24, { size: 20 });
    dashLine(x, Tx + 330, lp[1], Tx + 330, groundY, 'rgba(255,255,255,.4)', 2, [6, 6]);
    tag(x, (f.dp / PX_CM).toFixed(1) + ' cm', Tx + 330, (lp[1] + groundY) / 2, { size: 20, mono: true });
    f.ro.set('spot', hits.length ? (w / PX_CM * 10).toFixed(1) + ' mm' : '—');
    f.ro.set('conc', '×' + Math.round(conc * conc), conc > 10 ? COL.ray : null);
    f.ro.set('st', f.char > .25 ? 'smoking!' : f.heat > 7 ? 'getting hot' : 'cool', f.char > .25 ? COL.warn : f.heat > 7 ? COL.ray : COL.real);
    const y = begin(f.inset, '#0b0f18');
    y.fillStyle = '#c9a66b'; rrect(y, 30, 8, 240, 154, 6); y.fill();
    if (f.char > 0) { y.fillStyle = `rgba(40,20,5,${f.char})`; y.beginPath(); y.arc(150, 85, 5 + f.char * 26, 0, TAU); y.fill(); }
    const r = clamp(w / 2, 2, 80); glow(y, 150, 85, r * 2.2, 'rgba(255,240,190,1)', clamp(conc / 40, .25, 1)); dot(y, 150, 85, r * .7, `rgba(255,255,240,${clamp(conc / 30, .3, 1)})`);
  }
});

/* ================= Modules 19–21: optical lab, discovery mode, recap ================= */
const TYPES = [
  { v: 'plane', t: 'Plane mirror', x0: 640 }, { v: 'concave', t: 'Concave mirror', x0: 760 }, { v: 'convex', t: 'Convex mirror', x0: 720 },
  { v: 'convexLens', t: 'Convex lens', x0: 620 }, { v: 'concaveLens', t: 'Concave lens', x0: 720 }];

/* ---------- MODULE 19: the optical lab ---------- */
frame({
  mod: 19, kick: 'Virtual experiment lab', title: 'The Optical Lab', mapTitle: 'Optical Lab: free experimentation',
  sub: 'Every control changes the simulation instantly. Drag the object on the bench too.',
  build(b, f) {
    const D = { type: 'concave', ucm: 30, hcm: 7, fcm: 15, rays: 'principal', on: true, labels: true, speed: 1 };
    f.s = Object.assign({}, D);
    f.c = canvas(b, 1190, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const near = p => Math.abs(p.x - f.info.xo) < 50 && p.y > f.info.ty - 30 && p.y < 430;
    pointer(f.c, { hover: near, down: p => near(p), move: p => { f.s.ucm = clamp((f.x0 - p.x) / PX_CM, 2, 55); f.cU.set(f.s.ucm); } });
    const side = h('div', { class: 'abs', style: 'left:1212px;top:0;width:580px;display:flex;flex-direction:column;gap:12px' }); b.append(side);
    f.ro = ui.readout([['obj', 'Object position'], ['img', 'Image position'], ['size', 'Image size'], ['ori', 'Orientation'], ['kind', 'Image type']]);
    side.append(ui.card('Live information', f.ro));
    f.cT = ui.seg({ options: TYPES.map(o => ({ v: o.v, t: o.t })), value: D.type, onChange: v => { f.s.type = v; } });
    f.cT2 = { set() { } };
    b.append(h('div', { class: 'topc' }, f.cT));
    f.cU = ui.slider({ label: 'Object position', min: 2, max: 55, step: .5, value: D.ucm, fmt: v => v.toFixed(1) + ' cm', onInput: v => f.s.ucm = v });
    f.cH = ui.slider({ label: 'Object height', min: 2, max: 12, step: .5, value: D.hcm, fmt: v => v.toFixed(1) + ' cm', onInput: v => f.s.hcm = v });
    f.cF = ui.slider({ label: 'Focal length', min: 8, max: 25, step: .5, value: D.fcm, fmt: v => v.toFixed(1) + ' cm', onInput: v => f.s.fcm = v });
    f.cR = ui.seg({ options: [{ v: 'principal', t: 'Key 3' }, { v: 1, t: '1' }, { v: 5, t: '5' }, { v: 10, t: '10' }, { v: 20, t: '20' }], value: 'principal', onChange: v => f.s.rays = v });
    f.cS = ui.slider({ label: 'Animation speed', min: 0, max: 3, step: .1, value: 1, fmt: v => v.toFixed(1) + '×', onInput: v => App.speed = v });
    f.tRay = ui.toggle({ label: 'Ray tracing', value: true, onChange: v => f.s.on = v });
    f.tLab = ui.toggle({ label: 'Labels', value: true, onChange: v => App.labels = v });
    side.append(ui.card('Controls', h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:6px 22px' }, f.cU, f.cH, f.cF, f.cS),
      h('div', { class: 'ctl', style: 'margin-top:8px' }, h('div', { class: 'lab' }, h('span', null, 'Ray count')), f.cR),
      h('div', { class: 'row', style: 'margin-top:14px;justify-content:space-between' }, f.tRay, f.tLab,
        ui.btn('↺ Reset experiment', () => { f.s = Object.assign({}, D); f.cT.set(D.type); f.cT2.set(null); f.cU.set(D.ucm); f.cH.set(D.hcm); f.cF.set(D.fcm); f.cR.set('principal'); f.cS.set(1); App.speed = 1; f.tRay.set(true); f.tLab.set(true); App.labels = true; }))));
  },
  leave() { App.speed = 1; },
  tick(f, dt, t) {
    const s = f.s, T = TYPES.find(o => o.v === s.type); f.x0 = T.x0;
    const x = begin(f.c); bgGrid(x, f.c.w, f.c.h);
    const fp = s.fcm * PX_CM, u = s.ucm * PX_CM;
    const A = Math.min(460, s.type === 'concave' || s.type === 'convex' ? 4 * fp * .92 : 460);
    f.info = bench(x, { type: s.type, x0: T.x0, y0: 400, f: fp, u, h: s.hcm * PX_CM, A, w: f.c.w, h2: f.c.h, rays: s.rays, showRays: s.on, flow: App.t * 110 * App.speed });
    offscreenHint(x, f.info, f.c.w, 400);
    const d = describe(s.type, f.info, u, fp);
    f.ro.set('obj', d.obj + (d.zone ? ' · ' + d.zone : '')); f.ro.set('img', d.where, d.col); f.ro.set('size', d.size); f.ro.set('ori', d.ori, d.ocol); f.ro.set('kind', d.kind, d.col);
  }
});

/* ---------- MODULE 20: discovery mode — the mystery optic ---------- */
frame({
  mod: 20, kick: 'Discovery mode', title: 'What is hidden behind the screen?', mapTitle: 'Discovery mode: identify the hidden mirror or lens',
  sub: 'MOVE THE OBJECT AND OBSERVE the image. Then decide what is hidden.',
  build(b, f) {
    f.k = 1; f.u = 420; f.rev = false; f.obs = new Set(); f.guess = null;
    f.c = canvas(b, 1328, 778, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const near = p => Math.abs(p.x - f.info.xo) < 50 && p.y > f.info.ty - 30 && p.y < 430;
    pointer(f.c, { hover: near, down: p => near(p) || (Math.abs(p.y - 400) < 50 && p.x < 680) ? (f.u = clamp(700 - p.x, 30, 680), true) : false, move: p => f.u = clamp(700 - p.x, 30, 680) });
    const side = h('div', { class: 'side' }); b.append(side);
    f.obsEl = h('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;min-height:44px' });
    side.append(ui.card('Your observations', f.obsEl, h('p', { style: 'margin-top:10px;font-size:20px;color:var(--mute)' }, 'Collected automatically as you move the object.')));
    f.qs = h('div', { class: 'dq', style: 'font-size:24px' });
    side.append(h('div', { class: 'card disc' }, h('div', { class: 'dtag' }, 'THINK'), f.qs));
    f.btns = TYPES.map(o => ui.btn(o.t, () => { f.guess = o.v; f.btns.forEach(bb => bb.classList.toggle('on', bb === bt(o.v))); }));
    const bt = v => f.btns[TYPES.findIndex(o => o.v === v)];
    f.res = h('div', { class: 'big', style: 'margin-top:12px;min-height:40px' });
    side.append(ui.card('Your decision', h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px' }, ...f.btns),
      h('div', { class: 'row', style: 'margin-top:12px;gap:8px' }, ui.btn('Reveal', () => { f.rev = true; }, 'pri'), ui.btn('New mystery', () => newMystery(f))), f.res));
    newMystery(f);
  },
  tick(f, dt, t) {
    const type = TYPES[f.k].v, x0 = 700;
    const x = begin(f.c); bgGrid(x, f.c.w, f.c.h);
    f.info = bench(x, { type, x0, y0: 400, f: 170, u: f.u, h: 80, A: 420, w: f.c.w, h2: f.c.h, rays: 'principal', showRays: f.rev, flow: t * 100 * App.speed, labels: f.rev, marks: f.rev });
    offscreenHint(x, f.info, f.c.w, 400);
    if (!f.rev) {
      x.save(); const g = x.createLinearGradient(x0 - 100, 0, x0 + 100, 0); g.addColorStop(0, '#28344e'); g.addColorStop(.5, '#465678'); g.addColorStop(1, '#28344e');
      x.fillStyle = g; rrect(x, x0 - 100, 120, 200, 560, 20); x.fill(); x.strokeStyle = 'rgba(143,176,255,.5)'; x.lineWidth = 2; x.stroke(); x.restore();
      tag(x, '?', x0, 400, { size: 110, weight: 800, col: 'rgba(255,255,255,.85)', bg: false, need: true });
    }
    const d = describe(type, f.info, f.u, 170);
    const add = s => { if (!f.obs.has(s)) { f.obs.add(s); f.obsEl.append(h('span', { style: 'padding:6px 14px;border-radius:999px;border:1px solid var(--line2);font-size:20px;animation:fadeup .4s' }, s)); } };
    if (!f.info.inf) { add(d.ori); add(d.sw); if (f.info.show) add(isLens(type) ? (f.info.real ? 'image beyond the screen' : 'image on object’s side') : (f.info.real ? 'image in front' : 'image behind the screen')); }
    const qi = Math.floor(t / 5) % 4;
    f.qs.textContent = ['What changed as you moved the object?', 'Did the image become larger or smaller?', 'Did it ever become inverted?', 'Where does the image appear?'][qi];
    if (f.rev) f.res.innerHTML = `It was a <span class="hl">${TYPES[f.k].t}</span>` + (f.guess ? (f.guess === type ? ' — <span class="hr">you were right!</span>' : ' — <span style="color:#ffb0a0">look at the clues again</span>') : '');
  }
});
function newMystery(f) {
  let k; do { k = Math.floor(Math.random() * TYPES.length); } while (k === f.k);
  f.k = k; f.rev = false; f.guess = null; f.obs = new Set(); f.obsEl.innerHTML = ''; f.res.innerHTML = '';
  f.btns.forEach(b => b.classList.remove('on')); f.u = 420;
}

/* ---------- MODULE 21: chapter recap — the optical map ---------- */
const MAP = [
  ['LIGHT', 'travels in straight lines; drawn as rays', 'intro'],
  ['REFLECTION', 'light bounces off a mirror', 1],
  ['PLANE MIRROR', 'erect, same-size image', 1],
  ['SPHERICAL MIRRORS', 'part of a hollow sphere', 2],
  ['CONCAVE / CONVEX', 'curves inward / outward', 3],
  ['IMAGE FORMATION', 'concave: varies · convex: erect, diminished', 5],
  ['LAWS OF REFLECTION', 'i = r · all in one plane', 6],
  ['CONVERGE / DIVERGE', 'concave mirror converges · convex diverges', 7],
  ['LENSES', 'transparent, curved surfaces', 9],
  ['CONVEX / CONCAVE', 'thick middle / thick edges', 10],
  ['IMAGE FORMATION', 'convex: varies · concave: erect, diminished', 12],
  ['REAL-WORLD USES', 'torches, side mirrors, cameras, eyes…', 17]];
frame({
  mod: 21, kick: 'Chapter recap', title: 'The whole chapter, as one beam of light', mapTitle: 'Chapter recap: the optical map',
  sub: 'Follow the beam. Tap any stop to jump back to that experiment.',
  build(b, f) {
    f.c = canvas(b, 1792, 700, 'position:absolute;left:0;top:0');
    f.nodes = MAP.map((m, i) => {
      const row = Math.floor(i / 4), col = row % 2 ? 3 - (i % 4) : i % 4;
      return { x: 230 + col * 444, y: 110 + row * 240, t: m[0], s: m[1], go: m[2] };
    });
    pointer(f.c, {
      hover: p => f.nodes.some(n => Math.abs(p.x - n.x) < 190 && Math.abs(p.y - n.y) < 70),
      down: p => { const n = f.nodes.find(n => Math.abs(p.x - n.x) < 190 && Math.abs(p.y - n.y) < 70); if (n) go(App.frames.findIndex(fr => fr.mod === n.go)); return false; }
    });
    b.append(h('div', { class: 'abs card', style: 'left:0;right:0;top:712px;display:flex;gap:26px;align-items:center;padding:14px 24px' },
      h('div', { class: 'kick', style: 'flex:none' }, 'OUR SCIENTIFIC HERITAGE'),
      h('p', { style: 'font-size:22px', html: 'More than 800 years ago, in the time of <b>Bhāskara II</b>, astronomers watched the reflections of stars and planets in shallow bowls of water to measure their positions — using reflection long before its laws were written down.' })));
  },
  enter(f) { f.p = 0; },
  tick(f, dt, t) {
    f.p = Math.min(f.nodes.length + .5, (f.p || 0) + dt * 2.2);
    const x = begin(f.c), N = f.nodes;
    // path through the nodes
    const pts = []; N.forEach((n, i) => { pts.push([n.x, n.y]); });
    const seg = Math.floor(f.p), frac = f.p - seg;
    const lit = pts.slice(0, Math.min(N.length, seg + 1)); if (seg < N.length - 1) lit.push([lerp(pts[seg][0], pts[seg + 1][0], frac), lerp(pts[seg][1], pts[seg + 1][1], frac)]);
    x.save(); x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 3; path(x, pts); x.stroke(); x.restore();
    if (lit.length > 1) beam(x, lit, COL.ray, { flow: t * 140, w: 3.2, arrowAt: 120 });
    N.forEach((n, i) => {
      const on = i <= f.p, k = clamp(f.p - i, 0, 1);
      x.save(); x.fillStyle = on ? '#1a160c' : '#0e121c'; rrect(x, n.x - 180, n.y - 62, 360, 124, 20); x.fill();
      x.globalAlpha = .35 + .65 * k; x.strokeStyle = on ? `rgba(255,207,107,${.4 + .5 * k})` : 'rgba(160,180,220,.2)'; x.lineWidth = 2; x.stroke();
      x.restore();
      if (on) glow(x, n.x, n.y, 200, 'rgba(255,200,110,.12)', k);
      tag(x, n.t, n.x, n.y - 20, { size: 27, weight: 800, col: on ? '#fff' : COL.mute, bg: false, need: true });
      tag(x, n.s, n.x, n.y + 24, { size: 18, col: on ? '#e7d7b0' : COL.dim, bg: false, need: true });
      tag(x, String(i + 1).padStart(2, '0'), n.x - 158, n.y - 40, { size: 14, mono: true, col: COL.ray, bg: false, need: true });
    });
  }
});
COL.dim = '#6b778c';

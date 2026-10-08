'use strict';
/* ==========================================================================
   Engine: stage scaling, the persistent hero map, overlay routes/pins,
   slide navigation, teacher notes and controls.
   MAP, IMG and IMGMETA are injected by build.py.
   ========================================================================== */
const SW = 1920, SH = 1080, NS = 'http://www.w3.org/2000/svg';
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function svgEl(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function html(s) { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; }
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ---------- projection (same Mercator as tools/geo.py) ---------- */
const Y0 = Math.log(Math.tan(Math.PI / 4 + MAP.LAT1 * Math.PI / 360));
function P(lon, lat) { return [MAP.K * (lon - MAP.LON0) * Math.PI / 180, MAP.K * (Y0 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)))]; }

/* ---------- views: named regions [lonW, latS, lonE, latN] ---------- */
const V = {
  world: [30, -16, 132, 46], wide: [38, -11, 126, 40], sa: [58, 4, 101, 38], india: [66, 6, 98, 37],
  china: [68, 16, 124, 46], himalaya: [74, 25, 98, 36], pak: [58, 20, 82, 38], bgd: [84, 19.5, 94.5, 28.5],
  nepal: [77, 24.5, 92, 31], bhutan: [85, 24, 95, 29.5], mmr: [84, 9, 104, 29], afg: [56, 21, 90, 39],
  ocean: [36, -14, 128, 34], lka: [74, 4, 86, 13], palk: [77.9, 7.9, 81.6, 11.1], mdv: [66, -2, 82, 13],
  thai: [78, 3, 108, 26], mys: [88, -3, 121, 14], sgp: [97, -3, 110, 7], idn: [86, -12, 132, 13],
  tsunami: [66, -12, 112, 22], iran: [42, 16, 82, 41], oman: [48, 10, 80, 30], buddhism: [62, -10, 132, 44],
};
const AREAS = { full: [70, 70, 1850, 1000], r: [930, 80, 1860, 1000], rr: [1060, 90, 1880, 990], l: [60, 90, 990, 1000], c: [320, 120, 1600, 960], top: [120, 60, 1800, 720] };
let vb = { x: 0, y: 0, w: 1, h: 1 }, viewEndsAt = 0, tweenId = 0;
function fitBox(box, area) {
  const [x0, y1] = P(box[0], box[1]), [x1, y0] = P(box[2], box[3]);
  const A = AREAS[area || 'full'];
  const s = Math.min((A[2] - A[0]) / (x1 - x0), (A[3] - A[1]) / (y1 - y0));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return { w: SW / s, h: SH / s, x: cx - ((A[0] + A[2]) / 2) / s, y: cy - ((A[1] + A[3]) / 2) / s };
}
function toScreen(lon, lat) { const [x, y] = P(lon, lat); return [(x - vb.x) * SW / vb.w, (y - vb.y) * SH / vb.h]; }
function applyVB() { MAPSVG.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); FX.items.forEach(i => i.update()); }
function setView(box, area, dur = 1700) {
  if (typeof box === 'string') box = V[box];
  const to = fitBox(box, area), from = { ...vb }, id = ++tweenId;
  if (RM || dur === 0) { vb = to; applyVB(); viewEndsAt = performance.now(); return; }
  const t0 = performance.now(); viewEndsAt = t0 + dur;
  const fcx = from.x + from.w / 2, fcy = from.y + from.h / 2, tcx = to.x + to.w / 2, tcy = to.y + to.h / 2;
  const step = now => {
    if (id !== tweenId) return;
    const t = Math.min(1, (now - t0) / dur), e = ease(t);
    const w = Math.exp(Math.log(from.w) + (Math.log(to.w) - Math.log(from.w)) * e), h = w * SH / SW;
    const cx = fcx + (tcx - fcx) * e, cy = fcy + (tcy - fcy) * e;
    vb = { x: cx - w / 2, y: cy - h / 2, w, h }; applyVB();
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const waitView = () => Math.max(0, (viewEndsAt - performance.now()) / 1000);

/* ---------- map build ---------- */
let MAPSVG, FXSVG, FXG, PINS;
function buildMap() {
  const wrap = $('#mapwrap');
  MAPSVG = svgEl('svg', { id: 'map', preserveAspectRatio: 'none', 'aria-label': 'Map of India and her neighbours', role: 'img' }, wrap);
  const defs = svgEl('defs', {}, MAPSVG);
  defs.innerHTML = `<linearGradient id="gIndia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c15a"/><stop offset="1" stop-color="#e07b1f"/></linearGradient>
   <radialGradient id="gOcean" cx="50%" cy="55%" r="70%"><stop offset="0" stop-color="#0f2f5c"/><stop offset=".6" stop-color="#0a1f40"/><stop offset="1" stop-color="#050f24"/></radialGradient>`;
  svgEl('rect', { x: -4000, y: -4000, width: MAP.W + 8000, height: MAP.H + 8000, fill: 'url(#gOcean)' }, MAPSVG);
  const gr = svgEl('g', {}, MAPSVG); let d = '';
  for (let lon = 20; lon <= 150; lon += 10) { const [x0, y0] = P(lon, 60), [, y1] = P(lon, -30); d += `M${x0},${y0}V${y1}`; }
  for (let lat = -30; lat <= 60; lat += 10) { const [x0, y] = P(10, lat), [x1] = P(160, lat); d += `M${x0},${y}H${x1}`; }
  svgEl('path', { d, class: 'grat' }, gr);
  const cg = svgEl('g', { id: 'countries' }, MAPSVG);
  for (const code in MAP.c) {
    const p = svgEl('path', { d: MAP.c[code].d, class: 'c', id: 'c-' + code, 'data-c': code }, cg);
    const t = svgEl('title', {}, p); t.textContent = MAP.c[code].n;
  }
  const rg = svgEl('g', { id: 'rivers' }, MAPSVG);
  for (const r in MAP.rivers) MAP.rivers[r].forEach(d => svgEl('path', { d, class: 'riv r-' + r }, rg));
  FXSVG = $('#fx');
  FXSVG.innerHTML = `<defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="gDot"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#ffd98a"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>`;
  FXG = svgEl('g', {}, FXSVG);
  PINS = $('#pins');
}
const LAND_N = ['PAK', 'AFG', 'CHN', 'NPL', 'BTN', 'BGD', 'MMR'];
const SEA_N = ['LKA', 'MDV', 'IRN', 'OMN', 'THA', 'MYS', 'SGP', 'IDN'];
function countries(spec = {}, base = '') {
  $$('#countries .c').forEach(p => { p.setAttribute('class', 'c ' + base); });
  for (const k in spec) { const p = $('#c-' + k); if (p) p.setAttribute('class', 'c ' + spec[k]); }
}
function neighbourSpec(extra = {}, opts = {}) {
  const s = { IND: 'india keep' };
  LAND_N.forEach(c => s[c] = 'landN keep'); if (opts.sea !== false) SEA_N.forEach(c => s[c] = 'seaN keep');
  return Object.assign(s, extra);
}

/* ---------- overlay: routes, movers, pins, labels ---------- */
const FX = { items: [], movers: [], uid: 0 };
function smooth(pts, bulge) {
  if (pts.length === 2) {
    const [a, b] = pts;
    if (!bulge) return `M${a[0]},${a[1]}L${b[0]},${b[1]}`;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    return `M${a[0]},${a[1]}Q${mx - dy * bulge},${my + dx * bulge} ${b[0]},${b[1]}`;
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}
function route(pts, o = {}) {
  const g = svgEl('g', { class: 'rtg' }, FXG), id = 'mk' + (++FX.uid);
  const mask = svgEl('mask', { id, maskUnits: 'userSpaceOnUse', x: -500, y: -500, width: 3000, height: 2200 }, g);
  const rv = svgEl('path', { class: 'reveal', pathLength: 1 }, mask);
  const p = svgEl('path', { class: 'rt ' + (o.type || 'land') + (o.cls ? ' ' + o.cls : ''), mask: `url(#${id})` }, g);
  if (o.color) p.style.stroke = o.color;
  const it = { g, p, pts, o, len: 0, update() { const d = smooth(pts.map(q => toScreen(q[0], q[1])), o.bulge); p.setAttribute('d', d); rv.setAttribute('d', d); it.len = 0; } };
  it.update(); FX.items.push(it);
  rv.style.setProperty('--dur', (o.dur || 1.8) + 's');
  rv.style.setProperty('--del', (waitView() + (o.del || 0)) + 's');
  if (RM) rv.style.strokeDashoffset = 0; else setTimeout(() => rv.classList.add('go'), 20);
  if (o.mover) [].concat(o.mover).forEach((m, i) => mover(it, Object.assign({ delay: (o.del || 0) + (o.dur || 1.8) * .6 + i * (m.gap || 1.4) }, m)));
  return it;
}
const ICONS = {
  ship: '<path d="M-17,3 L17,3 L11,11 L-11,11Z" fill="#fff"/><path d="M-1,-16 L-1,2 L12,2Z" fill="#ffd98a"/><path d="M-3,-12 L-3,2 L-12,2Z" fill="#fff" opacity=".8"/>',
  truck: '<rect x="-16" y="-8" width="22" height="14" rx="2" fill="#b79cff"/><path d="M6,-4 H13 L17,1 V6 H6Z" fill="#fff"/><circle cx="-10" cy="8" r="3" fill="#fff"/><circle cx="11" cy="8" r="3" fill="#fff"/>',
  dot: '<circle r="14" fill="url(#gDot)"/><circle r="4.5" fill="#fff"/>',
  aid: '<circle r="15" fill="#ff5d6c"/><path d="M-3,-9H3V-3H9V3H3V9H-3V3H-9V-3H-3Z" fill="#fff"/>',
  caravan: '<circle r="13" fill="#2a1a05" stroke="#f5c451" stroke-width="2.5"/><path d="M-7,4 L-4,-4 L1,-1 L5,-6 L8,4Z" fill="#f5c451"/>',
};
function mover(it, m) {
  const g = svgEl('g', { class: 'mover', opacity: 0 }, it.g);
  if (m.text) {
    const w = m.text.length * 13 + 34;
    g.innerHTML = `<rect x="${-w / 2}" y="-21" width="${w}" height="42" rx="21" fill="rgba(5,13,31,.88)" stroke="${m.color || '#f5c451'}" stroke-width="2"/><text text-anchor="middle" y="8" style="stroke:none;fill:${m.color || '#ffd98a'};font-size:21px">${m.text}</text>`;
  } else g.innerHTML = ICONS[m.kind || 'dot'];
  FX.movers.push({ it, g, d: -(m.delay || 0) * (m.speed || 140), speed: m.speed || 140, loop: m.loop !== false, rot: m.kind === 'ship' || m.kind === 'truck', back: m.back });
}
let lastT = 0;
function tick(now) {
  const dt = Math.min(.05, (now - (lastT || now)) / 1000); lastT = now;
  for (const m of FX.movers) {
    if (!m.it.len) { try { m.it.len = m.it.p.getTotalLength(); } catch (e) { m.it.len = 0; } }
    const L = m.it.len; if (!L) continue;
    if (performance.now() < viewEndsAt) { m.g.setAttribute('opacity', 0); continue; }
    m.d += dt * m.speed * (RM ? 0 : 1);
    if (m.d < 0) { m.g.setAttribute('opacity', 0); continue; }
    let s = m.loop ? m.d % (L + 160) : Math.min(m.d, L);
    if (s > L) { m.g.setAttribute('opacity', 0); continue; }
    if (m.back) s = L - s;
    const a = m.it.p.getPointAtLength(s), b = m.it.p.getPointAtLength(Math.min(L, s + 2)), c = m.it.p.getPointAtLength(Math.max(0, s - 2));
    let ang = Math.atan2(b.y - c.y, b.x - c.x) * 180 / Math.PI; if (m.back) ang += 180;
    const flip = m.rot && (ang > 90 || ang < -90);
    const fade = Math.min(1, s / 40, (L - s) / 40);
    m.g.setAttribute('opacity', m.loop ? Math.max(0, fade) : 1);
    m.g.setAttribute('transform', `translate(${a.x},${a.y})` + (m.rot ? ` rotate(${flip ? ang + 180 : ang}) ${flip ? 'scale(-1,1)' : ''}` : ''));
  }
  requestAnimationFrame(tick);
}
function pin(lon, lat, label = '', cls = '', del = 0) {
  const d = html(`<div class="pin ${cls}"><i></i><span>${label}</span></div>`); PINS.appendChild(d);
  const left = cls.includes('left');
  const it = { el: d, update() { const [x, y] = toScreen(lon, lat); d.style.transform = `translate(${x}px,${y}px) translate(${left ? '-100%' : '0'},-50%)`; } };
  it.update(); FX.items.push(it);
  setTimeout(() => d.classList.add('on'), (waitView() + del) * 1000);
  return it;
}
const LBL = {
  IND: [78.6, 22.8], PAK: [69.2, 29.6], AFG: [65.6, 33.6], CHN: [97, 34.5], NPL: [83.9, 28.4], BTN: [90.5, 27.45], BGD: [90.2, 23.9],
  MMR: [96.1, 21.3], LKA: [80.7, 7.7], MDV: [73.3, 3.4], IRN: [53.5, 31.2], OMN: [56.6, 20.6], THA: [100.9, 15.6], MYS: [102, 4.3],
  SGP: [103.8, 1.35], IDN: [113.6, -1.2],
};
const NAMES = { IND: 'India', PAK: 'Pakistan', AFG: 'Afghanistan', CHN: 'China', NPL: 'Nepal', BTN: 'Bhutan', BGD: 'Bangladesh', MMR: 'Myanmar', LKA: 'Sri Lanka', MDV: 'Maldives', IRN: 'Iran', OMN: 'Oman', THA: 'Thailand', MYS: 'Malaysia', SGP: 'Singapore', IDN: 'Indonesia' };
function label(where, text, cls = '', del = 0) {
  const ll = typeof where === 'string' ? LBL[where] : where;
  if (text == null) text = NAMES[where];
  const d = html(`<div class="clabel ${cls}">${text}</div>`); PINS.appendChild(d);
  const it = { el: d, update() { const [x, y] = toScreen(ll[0], ll[1]); d.style.left = x + 'px'; d.style.top = y + 'px'; } };
  it.update(); FX.items.push(it);
  setTimeout(() => d.classList.add('on'), (waitView() + del) * 1000);
  return it;
}
function labels(codes, cls = '', del = 0, step = 0) {
  return codes.map((c, i) => label(c, null, (c === 'IND' ? 'india ' : '') + (['BTN', 'SGP', 'MDV', 'NPL', 'BGD', 'LKA'].includes(c) ? 'sm ' : '') + (SEA_N.includes(c) ? 'sea ' : '') + cls, del + i * step));
}
const WATERS = { 'Arabian Sea': [64.5, 15.5], 'Bay of Bengal': [88.5, 15], 'Indian Ocean': [80, -2], 'Andaman Sea': [96.3, 11] };
function waters(names = ['Arabian Sea', 'Bay of Bengal', 'Indian Ocean'], del = 0) { return names.map(n => label(WATERS[n], n, 'water', del)); }
/* The Maldives' 1,100+ islets are too small for the base map, so they are drawn as dots along the real atoll chain. */
const ATOLLS = [[72.95, 7.1], [73.05, 6.75], [72.98, 6.4], [73.25, 6.15], [73.0, 5.9], [73.38, 5.75], [73.1, 5.45], [73.48, 5.2], [73.4, 4.85], [73.55, 4.5], [73.5, 4.2], [73.35, 3.9], [73.6, 3.6], [72.9, 3.9], [72.82, 3.5], [73.45, 3.2], [73.6, 2.9], [73.0, 2.95], [73.5, 2.4], [73.3, 2.1], [73.55, 1.8], [72.95, 1.85], [73.38, 0.95], [73.15, 0.55], [73.45, -0.3], [73.15, -0.6]];
function atolls(del = 0, color = '#aee6ff') {
  const g = svgEl('g', { opacity: 0, style: 'transition:opacity .8s' }, FXG);
  const cs = ATOLLS.map(() => svgEl('circle', { r: 3.4, fill: color }, g));
  const it = { update() { const z = Math.max(2.5, Math.min(7, 1400 / vb.w * 3)); ATOLLS.forEach((a, i) => { const [x, y] = toScreen(a[0], a[1]); cs[i].setAttribute('cx', x); cs[i].setAttribute('cy', y); cs[i].setAttribute('r', z); }); } };
  it.update(); FX.items.push(it);
  setTimeout(() => g.setAttribute('opacity', 1), (waitView() + del) * 1000);
  return it;
}
function ring(lon, lat, o = {}) {
  const c = svgEl('circle', { class: 'ring', r: 0 }, FXG);
  const it = { r: 0, update() { const [x, y] = toScreen(lon, lat); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', it.r * SW / vb.w); } };
  it.c = c; it.update(); FX.items.push(it); return it;
}
function clearFX() {
  FX.items = []; FX.movers = [];
  const old = FXG; FXG = svgEl('g', {}, FXSVG); old.style.transition = 'opacity .4s'; old.style.opacity = 0; setTimeout(() => old.remove(), 450);
  $$('.pin,.clabel', PINS).forEach(e => { e.classList.remove('on'); setTimeout(() => e.remove(), 500); });
}

/* ---------- photos (HyperX frame) ---------- */
function credit(name) { const m = IMGMETA[name]; return m ? `Photo: ${m.creator} · ${m.license} · Wikimedia Commons` : ''; }
function photo(name, style, caption = '', cls = '') {
  return `<figure class="hx ${caption ? 'cap' : ''} ${cls}" style="${style}"><div class="ph" style="background-image:url(${IMG[name]})" role="img" aria-label="${(IMGMETA[name] || {}).alt || caption}"></div>${caption ? `<figcaption>${caption}<small>${credit(name)}</small></figcaption>` : ''}<span class="credit">${credit(name)}</span></figure>`;
}

/* ---------- slides ---------- */
const SLIDES = [];
function S(def) { SLIDES.push(def); }
let cur = -1, timers = [];
const ctx = {
  after(s, fn) { timers.push(setTimeout(fn, s * 1000)); },
  every(s, fn) { timers.push(setInterval(fn, s * 1000)); },
};
function bigQ(q, a, cls = '') { return `<div class="bq ${cls}" data-in style="--d:.6"><div class="q">${q}</div><button class="btn sm" onclick="this.parentNode.classList.add('open')">Reveal the answer</button><div class="a">${a}</div></div>`; }
function chain(items, cls = '') { return `<div class="chain ${cls}">${items.map((t, i) => (i ? `<span class="arr">${cls.includes('v') ? '↓' : '→'}</span>` : '') + `<span class="node">${t}</span>`).join('')}</div>`; }
function playChain(root, gap = .7, start = 0) {
  const ns = $$('.node,.arr', root);
  ns.forEach(n => n.classList.remove('on'));
  ns.forEach((n, i) => ctx.after(start + i * gap / 2, () => n.classList.add('on')));
}
function counter(elm, to, dur = 1.6, fmt = v => Math.round(v).toLocaleString('en-IN')) {
  if (RM) { elm.textContent = fmt(to); return; }
  const t0 = performance.now();
  const f = now => { const t = Math.min(1, (now - t0) / (dur * 1000)); elm.textContent = fmt(to * ease(t)); if (t < 1 && elm.isConnected) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}

function buildSlides() {
  const host = $('#slides');
  SLIDES.forEach((s, i) => {
    const d = html(`<section class="slide ${s.cls || ''}" data-i="${i}" aria-roledescription="slide" aria-label="${(s.title || '').replace(/"/g, '')}">${s.html || ''}</section>`);
    host.appendChild(d); s.el = d;
    if (s.init) s.init(d);
  });
  const g = $('#menu .grid');
  SLIDES.forEach((s, i) => { const b = html(`<button data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${s.title}</button>`); b.onclick = () => { toggleMenu(false); go(i); }; g.appendChild(b); });
}
function go(i, instant) {
  i = Math.max(0, Math.min(SLIDES.length - 1, i));
  if (i === cur) return;
  const prev = SLIDES[cur];
  timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = [];
  if (prev) { prev.el.classList.remove('on'); prev.leave && prev.leave(prev.el); }
  clearFX();
  cur = i; const s = SLIDES[i];
  MAPSVG.setAttribute('class', s.mapCls || '');
  const mw = $('#mapwrap'); mw.className = s.map || '';
  countries(s.countries || neighbourSpec(), s.base || '');
  if (s.view) setView(s.view[0], s.view[1], instant ? 0 : (s.view[2] || 1700));
  s.el.classList.add('on');
  // replay entrance animations
  $$('[data-in]', s.el).forEach(e => { e.style.animation = 'none'; });
  s.enter && s.enter(s.el, ctx);
  $('#progress').style.width = ((i + 1) / SLIDES.length * 100) + '%';
  $('#count').textContent = `${i + 1} / ${SLIDES.length}`;
  $('#sec').innerHTML = s.sec ? `<b>${s.num || ''}</b> ${s.sec}` : '';
  $$('#menu button').forEach(b => b.classList.toggle('cur', +b.dataset.i === i));
  renderNotes();
  try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { }
}
const next = () => go(cur + 1), prev = () => go(cur - 1);
function goId(id) { const i = SLIDES.findIndex(s => s.id === id); if (i >= 0) go(i); }

/* ---------- teacher notes ---------- */
function renderNotes() {
  const n = SLIDES[cur].notes, box = $('#notes .body');
  box.innerHTML = n ? `<h5>Teaching point</h5><p>${n.tp}</p><h5>Ask the class</h5><p>${n.q}</p><h5>Common misconception</h5><p>${n.mis}</p><h5>20-second explanation</h5><p>${n.s20}</p>`
    : '<p>No notes for this screen. Use it to let students talk.</p>';
  $('#notes .top span').textContent = `Screen ${cur + 1}`;
}
function toggleNotes(on) { const n = $('#notes'); on = on ?? !n.classList.contains('on'); n.classList.toggle('on', on); $('#bNotes').classList.toggle('on', on); }
function toggleMenu(on) { const m = $('#menu'); on = on ?? !m.classList.contains('on'); m.classList.toggle('on', on); }
function fullscreen() {
  const d = document;
  if (!d.fullscreenElement && !d.webkitFullscreenElement) (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen).call(d.documentElement);
  else (d.exitFullscreen || d.webkitExitFullscreen).call(d);
}

/* ---------- boot ---------- */
function fit() {
  const s = Math.min(innerWidth / SW, innerHeight / SH);
  const st = $('#stage'); st.style.transformOrigin = '50% 50%'; st.style.transform = `translate(-50%,-50%) scale(${s})`;
}
function boot() {
  buildMap(); buildSlides(); fit(); addEventListener('resize', fit);
  vb = fitBox(V.world, 'full'); applyVB();
  requestAnimationFrame(tick);
  $('#bPrev').onclick = prev; $('#bNext').onclick = next; $('#bMap').onclick = () => goId('explore');
  $('#bFull').onclick = fullscreen; $('#bNotes').onclick = () => toggleNotes(); $('#bMenu').onclick = () => toggleMenu();
  $('#notes .x').onclick = () => toggleNotes(false); $('#menu .x').onclick = () => toggleMenu(false);
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target.tagName || '').toLowerCase(), k = e.key;
    if (tag === 'input' && (k === 'ArrowLeft' || k === 'ArrowRight' || k === ' ')) return;
    if (k === ' ' && tag === 'button') return;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(SLIDES.length - 1); }
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 't' || k === 'T') toggleNotes();
    else if (k === 'm' || k === 'M') toggleMenu();
    else if (k === 'Escape') { toggleMenu(false); toggleNotes(false); }
  });
  let tx = 0, ty = 0;
  $('#stage').addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  $('#stage').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5 && !e.target.closest('input,.nodrag')) (dx < 0 ? next : prev)();
  }, { passive: true });
  let idle; const wake = () => { $('#ui').classList.remove('hidden'); document.body.style.cursor = ''; clearTimeout(idle); idle = setTimeout(() => { if (!$('#notes').classList.contains('on')) { $('#ui').classList.add('hidden'); document.body.style.cursor = 'none'; } }, 3500); };
  addEventListener('mousemove', wake); addEventListener('keydown', wake); addEventListener('touchstart', wake, { passive: true }); wake();
  const start = parseInt((location.hash || '').slice(1), 10);
  const st = $('#start');
  const begin = () => { st.classList.add('gone'); setTimeout(() => st.remove(), 900); };
  $('#bBegin').onclick = begin;
  if (start > 1) { begin(); go(start - 1, true); } else go(0, true);
}

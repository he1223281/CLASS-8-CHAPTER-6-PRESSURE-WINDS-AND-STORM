'use strict';
/* ================= helpers ================= */
const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eout = t => (t = clamp(t), 1 - Math.pow(1 - t, 3));
const ein = t => (t = clamp(t), t * t * t);
const f1 = x => Math.round(x * 10) / 10;
function rng(seed) { let s = (seed >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
function hexRGB(c) { c = c.replace('#', ''); return [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)); }
function mix(a, b, t) { const p = hexRGB(a), q = hexRGB(b); t = clamp(t); return `rgb(${Math.round(lerp(p[0], q[0], t))},${Math.round(lerp(p[1], q[1], t))},${Math.round(lerp(p[2], q[2], t))})`; }
function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function setA(e, attrs) { for (const k in attrs) e.setAttribute(k, attrs[k]); }

/* ================= registry ================= */
const ORGAN_NAMES = ['Mouth', 'Oesophagus', 'Stomach', 'Small intestine', 'Large intestine', 'Rectum', 'Anus'];
const ACTS = {
  1: ['ACT 1', 'The Mystery', 'What happens to the food we eat?'],
  2: ['ACT 2', 'The Journey', 'Let’s follow one bite.'],
  3: ['ACT 3', 'The Transformation', 'Food is broken down.'],
  4: ['ACT 4', 'The Absorption', 'Useful nutrients enter the blood.'],
  5: ['ACT 5', 'The Clean-up', 'Undigested waste is removed.'],
  6: ['ACT 6', 'The Big Picture', 'The complete journey.']
};
const SLIDES = [];
function slide(d) { d.steps = d.steps || []; SLIDES.push(d); }

const E = { cur: -1, paused: false, ctx: [], organ: null, last: 0, nw: null };

/* ================= slide lifecycle ================= */
function ensure(i) {
  if (E.ctx[i]) return E.ctx[i];
  const d = SLIDES[i];
  const root = document.createElement('section');
  root.className = 'slide';
  root.innerHTML = typeof d.html === 'function' ? d.html() : (d.html || '');
  $('#slides').appendChild(root);
  const c = { root, i, d, t: 0, stepT: 0, n: 0, q: s => root.querySelector(s), qa: s => $$(s, root) };
  E.ctx[i] = c;
  fixTex(root);
  try { d.init && d.init(c); } catch (err) { console.error('init', i, err); }
  return c;
}

function go(i, n = 0, dir = 1) {
  i = clamp(i, 0, SLIDES.length - 1);
  const prev = E.cur;
  if (i !== prev) {
    if (prev >= 0) { const pc = E.ctx[prev]; pc.root.classList.remove('cur'); SLIDES[prev].leave && SLIDES[prev].leave(pc); }
    const c = ensure(i);
    c.root.classList.add('cur');
    c.t = 0; E.cur = i;
    SLIDES[i].enter && SLIDES[i].enter(c);
    const a = SLIDES[i].act, pa = prev >= 0 ? SLIDES[prev].act : 0;
    if (dir > 0 && a && a !== pa) showAct(a); else hideAct();
    setTimeout(() => { if (i + 1 < SLIDES.length) ensure(i + 1); }, 900);
  }
  setStep(n, dir < 0);
}

function setStep(n, instant) {
  const c = E.ctx[E.cur], d = SLIDES[E.cur];
  c.n = n; c.stepT = instant ? 60 : 0; c.instant = !!instant;
  if (instant) c.root.classList.add('inst');
  c.qa('[data-s]').forEach(e => {
    const [a, b] = e.dataset.s.split('-');
    const lo = +a, hi = b === undefined ? 1e9 : +b;
    e.classList.toggle('on', n >= lo && n <= hi);
  });
  try { d.step && d.step(c, n, instant); } catch (err) { console.error('step', E.cur, err); }
  if (instant) requestAnimationFrame(() => requestAnimationFrame(() => c.root.classList.remove('inst')));
  const o = typeof d.organ === 'function' ? d.organ(c) : d.organ;
  if (o !== undefined && o !== null) setOrgan(o);
  updateUI();
}

function next() {
  if (closeOverlays()) return;
  const c = E.ctx[E.cur], d = SLIDES[E.cur];
  if (c.n < d.steps.length) setStep(c.n + 1, false);
  else if (E.cur < SLIDES.length - 1) go(E.cur + 1, 0, 1);
}
function prev() {
  if (closeOverlays()) return;
  const c = E.ctx[E.cur];
  if (c.n > 0) setStep(c.n - 1, true);
  else if (E.cur > 0) { const j = E.cur - 1; go(j, SLIDES[j].steps.length, -1); }
}
function replay() { const c = E.ctx[E.cur]; if (SLIDES[E.cur].replay) SLIDES[E.cur].replay(c); setStep(c.n, false); c.t = 0; }

/* ================= journey map ================= */
function buildJourney() {
  const j = $('#journey');
  j.innerHTML = ORGAN_NAMES.map((o, k) => (k ? `<span class="jl" data-j="${k}"></span>` : '') + `<span class="jn" data-j="${k}"><i></i>${o}</span>`).join('');
}
function setOrgan(o) {
  if (E.organ === o) return; E.organ = o;
  const j = $('#journey');
  j.classList.toggle('off', o === -1);
  j.classList.toggle('all', o === 'all');
  $$('.jn', j).forEach(e => { const k = +e.dataset.j; e.classList.toggle('cur', o === k); e.classList.toggle('done', typeof o === 'number' && k < o); });
  $$('.jl', j).forEach(e => { const k = +e.dataset.j; e.classList.toggle('done', typeof o === 'number' && k <= o); });
}

/* ================= act card ================= */
let actTimer = 0;
function showAct(a) {
  const A = ACTS[a], el_ = $('#act'); if (!A) return;
  $('.an', el_).textContent = A[0]; $('.at', el_).textContent = A[1]; $('.as', el_).textContent = A[2];
  el_.classList.add('on'); clearTimeout(actTimer);
  actTimer = setTimeout(() => el_.classList.remove('on'), 3200);
}
function hideAct() { clearTimeout(actTimer); $('#act').classList.remove('on'); }

/* ================= UI ================= */
function updateUI() {
  const c = E.ctx[E.cur], d = SLIDES[E.cur];
  const total = SLIDES.length;
  $('#count').textContent = `${E.cur + 1} / ${total}`;
  const sub = d.steps.length ? c.n / (d.steps.length + 1) : 0;
  $('#progress i').style.width = ((E.cur + sub) / (total - 1) * 100).toFixed(2) + '%';
  const lbl = c.n < d.steps.length ? d.steps[c.n] : (E.cur < total - 1 ? 'Next' : 'End');
  $('#nextLbl').textContent = lbl;
  $$('#overview .oc').forEach((e, k) => e.classList.toggle('cur', k === E.cur));
  renderNotes();
}

function buildOverview() {
  const g = $('#overview .grid');
  g.innerHTML = SLIDES.map((d, k) => `<div class="oc" data-k="${k}"><div class="on1">${k + 1} · ${ACTS[d.act] ? ACTS[d.act][1] : ''}</div><div class="ot">${d.title}</div></div>`).join('');
  g.addEventListener('click', e => { const oc = e.target.closest('.oc'); if (!oc) return; $('#overview').classList.remove('on'); go(+oc.dataset.k, 0, 1); });
}
function closeOverlays() {
  let any = false;
  ['#overview', '#help'].forEach(s => { if ($(s).classList.contains('on')) { $(s).classList.remove('on'); any = true; } });
  return any;
}

/* ================= speaker notes ================= */
function notesHTML() {
  const d = SLIDES[E.cur], c = E.ctx[E.cur], N = d.notes || {};
  const nxt = c.n < d.steps.length ? 'Next click: ' + d.steps[c.n] : (E.cur < SLIDES.length - 1 ? 'Next slide: ' + SLIDES[E.cur + 1].title : 'End of presentation');
  const sec = (h, t) => t ? `<h4>${h}</h4><p>${t}</p>` : '';
  return `<div class="nt"><div class="meta">SLIDE ${E.cur + 1} / ${SLIDES.length} · ${ACTS[d.act] ? ACTS[d.act][1].toUpperCase() : ''} · REVEAL ${c.n} / ${d.steps.length}</div>
  <div class="tt">${d.title}</div><div class="meta" style="color:#ffb86b">${nxt}</div>
  ${sec('WHAT TO SAY', N.say)}${sec('ASK THE CLASS', N.ask)}${sec('EXPLAIN', N.explain)}${sec('COMMON CONFUSION', N.confusion)}${sec('TRANSITION', N.transition)}</div>`;
}
const NOTES_CSS = `body{margin:0;background:#070b10;color:#eef2f6;font-family:'Segoe UI',system-ui,Arial,sans-serif;padding:28px 34px 110px}
.nt h4{font:700 15px/1 sans-serif;letter-spacing:.24em;color:#6fe3d6;margin:24px 0 8px}.nt p{font:400 21px/1.5 sans-serif;margin:0;color:#e6ecf2}
.nt .tt{font:600 32px/1.15 Georgia,serif;margin:6px 0}.nt .meta{font:600 14px/1.4 sans-serif;color:#93a1ae;letter-spacing:.08em}
.bar{position:fixed;left:0;right:0;bottom:0;display:flex;gap:12px;padding:16px 34px;background:#0c131b;border-top:1px solid #223}
.bar button{flex:1;height:58px;font:700 20px sans-serif;border-radius:12px;border:1px solid #2c4a52;background:#12303a;color:#fff;cursor:pointer}`;
function openNotes() {
  try {
    if (E.nw && !E.nw.closed) { E.nw.focus(); renderNotes(); return; }
    const w = window.open('', 'digestion_notes', 'width=780,height=960');
    if (!w) throw new Error('blocked');
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Speaker notes · Digestion</title><style>${NOTES_CSS}</style></head><body><div id="nb"></div><div class="bar"><button id="p">◀ Back</button><button id="n">Next ▶</button></div></body></html>`);
    w.document.close();
    w.document.getElementById('p').onclick = () => prev();
    w.document.getElementById('n').onclick = () => next();
    w.document.addEventListener('keydown', onKey);
    E.nw = w; renderNotes();
  } catch (err) { $('#drawer').classList.toggle('on'); renderNotes(); }
}
function renderNotes() {
  try { if (E.nw && !E.nw.closed) { const b = E.nw.document.getElementById('nb'); if (b) b.innerHTML = notesHTML(); } } catch (e) { }
  const dr = $('#drawer');
  if (dr.classList.contains('on')) dr.innerHTML = `<div class="warn">⚠ NOTES ARE VISIBLE ON THIS SCREEN · press N to hide</div>` + notesHTML();
}

/* ================= keyboard / fullscreen / scaling ================= */
function full() {
  const d = document;
  if (!d.fullscreenElement) (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen || (() => { })).call(d.documentElement);
  else (d.exitFullscreen || d.webkitExitFullscreen).call(d);
}
function onKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter' || k === 'ArrowDown') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace' || k === 'ArrowUp') { e.preventDefault(); prev(); }
  else if (k === 'f' || k === 'F') full();
  else if (k === 'o' || k === 'O' || k === 'g' || k === 'G') { $('#help').classList.remove('on'); $('#overview').classList.toggle('on'); }
  else if (k === 'n' || k === 'N') { if ($('#drawer').classList.contains('on')) $('#drawer').classList.remove('on'); else openNotes(); }
  else if (k === 'r' || k === 'R') replay();
  else if (k === 'p' || k === 'P') { E.paused = !E.paused; $('#paused').classList.toggle('on', E.paused); }
  else if (k === 'Home') go(0, 0, 1);
  else if (k === 'End') go(SLIDES.length - 1, 0, 1);
  else if (k === 'Escape') { closeOverlays(); $('#drawer').classList.remove('on'); }
  else if (k === '?' || k === 'h' || k === 'H') { $('#overview').classList.remove('on'); $('#help').classList.toggle('on'); }
}
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  $('#stage').style.transform = `translate(-50%,-50%) scale(${s})`;
}
let idleT = 0;
function poke() { $('#ui').classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => $('#ui').classList.add('idle'), 3000); }

function frame(ts) {
  const dt = Math.min(.05, Math.max(0, (ts - (E.last || ts)) / 1000)); E.last = ts;
  if (E.cur >= 0 && !E.paused) {
    const c = E.ctx[E.cur], d = SLIDES[E.cur];
    c.t += dt; c.stepT += dt;
    if (d.tick) { try { d.tick(c, dt); } catch (err) { if (!c.err) console.error('tick', E.cur, err); c.err = 1; } }
  }
  requestAnimationFrame(frame);
}

function boot() {
  const t0 = performance.now();
  if (typeof PREBAKED !== 'undefined' && PREBAKED && !/[?&]rebake/.test(location.search)) Object.assign(TEXI, PREBAKED);
  else { try { bakeAll(); } catch (err) { console.error('bake', err); } }
  console.log('baked in', Math.round(performance.now() - t0), 'ms');
  cinematicLayers();
  buildJourney(); buildOverview(); fit();
  addEventListener('resize', fit);
  addEventListener('keydown', onKey);
  addEventListener('mousemove', poke); poke();
  const bind = (id, fn) => { const b = $(id); b.addEventListener('click', () => { fn(); b.blur(); }); };
  bind('#bPrev', prev); bind('#bNext', next); bind('#bFull', full); bind('#bNotes', openNotes);
  bind('#bOver', () => $('#overview').classList.toggle('on'));
  addEventListener('beforeunload', () => { try { E.nw && E.nw.close(); } catch (e) { } });
  let start = 0;
  const m = /[#&]s=(\d+)/.exec(location.hash); if (m) start = clamp(+m[1] - 1, 0, SLIDES.length - 1);
  go(start, 0, 1);
  requestAnimationFrame(frame);
}

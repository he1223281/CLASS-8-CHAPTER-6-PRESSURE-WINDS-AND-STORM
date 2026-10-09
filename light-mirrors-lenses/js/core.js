'use strict';
/* Light Lab core: stage scaling, canvas helper, UI widgets, scene engine, navigation. */
const W = 1920, H = 1080;
const LL = {
  scenes: [], idx: -1, cur: null, paused: false, slow: false, mode: 'teacher', scale: 1,
  canvases: new Set(), reduced: false, building: 'x'
};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const DEG = Math.PI / 180;

function el(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)));
  return e;
}
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const uid = name => `ll-${LL.building}-${slug(name)}`;

/* ---------- stage scaling ---------- */
function fitStage() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const s = Math.min(vw / W, vh / H);
  LL.scale = s;
  const st = $('#stage');
  st.style.transform = `translate(${(vw - W * s) / 2}px, ${(vh - H * s) / 2}px) scale(${s})`;
  for (const c of LL.canvases) c.resize();
}

/* ---------- canvas helper (crisp at any stage scale) ---------- */
function makeCanvas(w, h) {
  const cv = el('canvas', { class: 'cv', width: w, height: h });
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  const o = { cv, ctx: cv.getContext('2d'), w, h, k: 1 };
  o.resize = () => {
    const k = clamp((LL.scale || 1) * (window.devicePixelRatio || 1), 0.75, 2.5);
    if (Math.abs(k - o.k) < 0.01 && cv.width === Math.round(w * k)) return;
    o.k = k; cv.width = Math.round(w * k); cv.height = Math.round(h * k); o._bg = null;
  };
  o.begin = () => { o.ctx.setTransform(o.k, 0, 0, o.k, 0, 0); o.ctx.globalAlpha = 1; o.ctx.globalCompositeOperation = 'source-over'; };
  o.pt = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height }; };
  o.resize(); LL.canvases.add(o);
  return o;
}

/* Pointer dragging on a canvas: hit(p) returns a handle (or null), move(handle, p) applies it. */
function dragOn(o, { hit, move, down, up, cursor = 'grab' }) {
  let active = null;
  o.cv.addEventListener('pointerdown', e => {
    const p = o.pt(e); active = hit ? hit(p) : null;
    if (down) down(p, active);
    if (active != null) { o.cv.setPointerCapture(e.pointerId); o.cv.style.cursor = 'grabbing'; move(active, p); e.preventDefault(); }
  });
  o.cv.addEventListener('pointermove', e => {
    const p = o.pt(e);
    if (active != null) { move(active, p); return; }
    o.cv.style.cursor = hit && hit(p) != null ? cursor : 'default';
  });
  const end = () => { if (active != null && up) up(active); active = null; o.cv.style.cursor = 'default'; };
  o.cv.addEventListener('pointerup', end);
  o.cv.addEventListener('pointercancel', end);
}

/* ---------- UI widgets ---------- */
const UI = {
  ctl(label, ...kids) { return el('div', { class: 'ctl' }, label ? el('span', { class: 'lbl' }, label) : null, ...kids); },
  seg(label, options, value, onChange) {
    const g = el('div', { class: 'seg', role: 'group', 'aria-label': label || 'options' });
    const btns = options.map(o => {
      const b = el('button', { type: 'button', id: uid((label || 'seg') + '-' + o.v), 'aria-pressed': String(o.v === value) }, o.t);
      b.addEventListener('click', () => { api.set(o.v); onChange(o.v); });
      g.append(b); return b;
    });
    const api = {
      el: UI.ctl(label, g), value,
      set(v) { api.value = v; btns.forEach((b, i) => b.setAttribute('aria-pressed', String(options[i].v === v))); }
    };
    return api;
  },
  slider(label, min, max, step, value, fmt, onInput) {
    const id = uid(label);
    const inp = el('input', { type: 'range', id, min, max, step, value });
    const val = el('span', { class: 'val' }, fmt(value));
    inp.addEventListener('input', () => { const v = +inp.value; val.textContent = fmt(v); onInput(v); });
    const wrap = el('div', { class: 'ctl slider' }, el('label', { class: 'lbl', for: id }, label), inp, val);
    return { el: wrap, set(v) { inp.value = v; val.textContent = fmt(+inp.value); }, get: () => +inp.value, input: inp };
  },
  toggle(label, value, onChange, color) {
    const b = el('button', { type: 'button', class: 'chip', id: uid('t-' + label), 'aria-pressed': String(!!value), style: color ? `--c:${color}` : null }, label);
    const api = { el: b, value: !!value, set(v) { api.value = !!v; b.setAttribute('aria-pressed', String(api.value)); } };
    b.addEventListener('click', () => { api.set(!api.value); onChange(api.value); });
    return api;
  },
  btn(label, onClick, cls = 'btn') { const b = el('button', { type: 'button', class: cls, id: uid('b-' + label) }, label); b.addEventListener('click', onClick); return b; },
  card(kind, title, no, ...body) {
    return el('section', { class: 'card ' + kind }, el('h3', null, no != null ? el('span', { class: 'no' }, String(no)) : null, title), ...body);
  },
  /* spec: { predict:{q, opts, ans, why}, experiment:[...], live: Element, observe:[...], explain: html, extra:[Elements] } */
  panel(spec) {
    const p = el('aside', { class: 'panel', 'aria-label': 'Predict, experiment, observe, explain' });
    let n = 1;
    if (spec.predict) p.append(UI.predictCard(spec.predict, n++));
    if (spec.live && spec.liveFirst) p.append(spec.live);
    if (spec.experiment) p.append(UI.card('experiment', 'Experiment', n++, el('ul', null, spec.experiment.map(s => el('li', { html: s })))));
    if (spec.live && !spec.liveFirst) p.append(spec.live);
    if (spec.observe) p.append(UI.lockCard('observe', 'Observe', n++, el('ul', null, spec.observe.map(s => el('li', { html: s })))));
    if (spec.explain) p.append(UI.lockCard('explain', 'Explain', n++, el('div', { html: spec.explain })));
    (spec.extra || []).forEach(x => p.append(x));
    p._narrate = () => [spec.observe ? spec.observe.join('. ') : '', spec.explain || ''].join(' ');
    return p;
  },
  predictCard(pr, no) {
    const fb = el('div', { class: 'fb', hidden: true });
    const opts = el('div', { class: 'opts' });
    const card = UI.card('predict', 'Predict', no, el('div', { class: 'q', html: pr.q }), opts, fb);
    pr.opts.forEach((t, i) => {
      const b = el('button', { type: 'button', class: 'opt', html: t });
      b.addEventListener('click', () => {
        $$('.opt', opts).forEach(x => x.classList.remove('right', 'wrong'));
        b.classList.add(i === pr.ans ? 'right' : 'wrong');
        if (i !== pr.ans) opts.children[pr.ans].classList.add('right');
        fb.hidden = false;
        fb.innerHTML = (i === pr.ans ? '<b>Good prediction.</b> ' : '<b>Interesting guess.</b> Test it in the experiment. ') + (pr.why || '');
      });
      opts.append(b);
    });
    return card;
  },
  lockCard(kind, title, no, body) {
    const b = el('div', { class: 'body' }, body);
    const c = UI.card(kind + ' lockable', title, no, b);
    const rv = el('button', { type: 'button', class: 'btn sm' }, 'Reveal');
    rv.addEventListener('click', () => c.classList.add('revealed'));
    c.append(el('div', { class: 'lockmsg' }, el('span', null, 'Try the experiment first.'), rv));
    return c;
  },
  readout(rows) {
    const dl = el('dl', { class: 'readout' });
    const cells = {};
    rows.forEach(([k, label]) => { const dd = el('dd', null, '—'); cells[k] = dd; dl.append(el('dt', null, label), dd); });
    return { el: dl, set(k, v, hl) { if (cells[k].innerHTML !== v) cells[k].innerHTML = v; cells[k].classList.toggle('hl', !!hl); } };
  }
};

/* Standard lab scene: heading, canvas, controls strip and the PEOE panel. */
function labLayout(root, { kicker, title, cvH = 700 }) {
  const bench = el('div', { class: 'bench' });
  const head = el('div', { class: 'scene-head' }, el('span', { class: 'kicker' }, kicker), el('h1', null, title));
  const cv = makeCanvas(1260, cvH);
  const wrap = el('div', { class: 'cvwrap' }, cv.cv);
  const controls = el('div', { class: 'controls' });
  bench.append(head, wrap, controls);
  root.append(bench);
  return { bench, head, cv, wrap, controls, setPanel(p) { root.append(p); root._panel = p; return p; } };
}

/* ---------- scene engine ---------- */
LL.add = s => LL.scenes.push(s);
/* place a scene just before another one (used by the concept slides) */
LL.insertBefore = (id, s) => { const i = LL.find(id); if (i < 0) LL.scenes.push(s); else LL.scenes.splice(i, 0, s); };
LL.find = id => LL.scenes.findIndex(s => s.id === id);

function buildScene(s) {
  const root = el('section', { class: 'scene ' + (s.full ? 'full' : 'lab'), id: 'sc-' + s.id, 'aria-label': s.title });
  $('#scenes').append(root);
  LL.building = s.id; s.root = root;
  try { s.inst = s.build(root) || {}; } catch (e) { console.error(e); showError('Scene "' + s.title + '" failed to load: ' + e.message); s.inst = {}; }
  s.t0 = performance.now();
}

LL.go = (i, opts) => {
  i = clamp(i, 0, LL.scenes.length - 1);
  const s = LL.scenes[i];
  if (LL.cur && LL.cur !== s) { LL.cur.root.classList.remove('active'); LL.cur.inst.onHide && LL.cur.inst.onHide(); }
  if (!s.inst) buildScene(s);
  LL.idx = i; LL.cur = s;
  s.root.classList.add('active');
  document.body.classList.toggle('opening', !!s.opening);
  s.inst.onShow && s.inst.onShow(opts || {});
  if (opts && s.inst.configure) s.inst.configure(opts);
  stopSpeech();
  updateBars();
  try { history.replaceState(null, '', '#' + s.id); } catch (e) { /* sandboxed */ }
};
LL.goId = (id, opts) => { const i = LL.find(id); if (i >= 0) LL.go(i, opts); };
/* Next first reveals the next build step of the current scene (concept slides), then moves on */
LL.next = () => { const i = LL.cur && LL.cur.inst; if (i && i.advance && i.advance()) return; LL.go(LL.idx + 1); };
LL.prev = () => LL.go(LL.idx - 1);

function updateBars() {
  const s = LL.cur; if (!s) return;
  $('#whereTitle').textContent = s.title;
  $('#count').textContent = String(LL.idx).padStart(2, '0') + ' / ' + String(LL.scenes.length - 1).padStart(2, '0');
  $('#prevBtn').disabled = LL.idx <= 1;
  $('#nextBtn').disabled = LL.idx >= LL.scenes.length - 1;
  $$('#sections button').forEach(b => b.classList.toggle('on', b.dataset.sec === s.section));
  $$('#dots button').forEach((b, i) => b.classList.toggle('on', i + 1 === LL.idx));
  $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === LL.idx));
  $('#pauseBtn').textContent = LL.paused ? 'Play' : 'Pause';
  $('#pauseBtn').setAttribute('aria-pressed', String(LL.paused));
}

function setPaused(p) { LL.paused = p; updateBars(); }
function setMode(m) {
  LL.mode = m;
  document.body.classList.toggle('explore', m === 'explore');
  $$('#modeSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  try { localStorage.setItem('ll-mode', m); } catch (e) { /* storage blocked */ }
}
function revealAll() { if (LL.cur && LL.cur.root) $$('.card.lockable', LL.cur.root).forEach(c => c.classList.add('revealed')); }

/* ---------- narration (Web Speech API, optional) ---------- */
const canSpeak = 'speechSynthesis' in window;
function stopSpeech() { if (canSpeak) { speechSynthesis.cancel(); } const b = $('#sayBtn'); if (b) { b.classList.remove('on'); b.textContent = 'Read aloud'; } }
function speakCurrent() {
  if (!canSpeak) return;
  if (speechSynthesis.speaking) { stopSpeech(); return; }
  const s = LL.cur; if (!s) return;
  const p = s.root._panel;
  let text = s.narrate || (p && p._narrate ? p._narrate() : '') || s.title;
  const tmp = el('div', { html: text }); text = tmp.textContent.replace(/\s+/g, ' ').trim();
  if (!text) return;
  revealAll();
  const u = new SpeechSynthesisUtterance(text);
  const v = speechSynthesis.getVoices().find(v => /en-IN/i.test(v.lang)) || speechSynthesis.getVoices().find(v => /^en/i.test(v.lang));
  if (v) u.voice = v;
  u.rate = 0.95;
  u.onend = () => stopSpeech();
  speechSynthesis.speak(u);
  const b = $('#sayBtn'); b.classList.add('on'); b.textContent = 'Stop reading';
}

function showError(msg) { const b = $('#errbar'); b.textContent = msg; b.hidden = false; setTimeout(() => { b.hidden = true; }, 8000); }

function toggleFullscreen() {
  const d = document;
  try {
    if (d.fullscreenElement) d.exitFullscreen && d.exitFullscreen();
    else { const r = d.documentElement.requestFullscreen && d.documentElement.requestFullscreen(); if (r && r.catch) r.catch(() => {}); }
  } catch (e) { /* not allowed here */ }
}

/* ---------- main loop ---------- */
let lastT = 0, loopErr = false;
function loop(now) {
  const dt = Math.min(0.05, (now - (lastT || now)) / 1000); lastT = now;
  const s = LL.cur;
  if (s && s.inst && s.inst.frame) {
    try { s.inst.frame(LL.paused ? 0 : dt * (LL.slow ? 0.3 : 1), now / 1000); }
    catch (e) { if (!loopErr) { loopErr = true; console.error(e); showError('Animation error: ' + e.message); } }
  }
  requestAnimationFrame(loop);
}

/* ---------- boot ---------- */
function boot() {
  LL.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  fitStage();
  window.addEventListener('resize', fitStage);
  if (window.matchMedia) { try { matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener('change', fitStage); } catch (e) { /* old browsers */ } }

  // section tabs + dots + menu
  const secs = [];
  LL.scenes.forEach((s, i) => { if (s.section && !secs.includes(s.section)) secs.push(s.section); });
  secs.forEach(sec => {
    const b = el('button', { type: 'button', 'data-sec': sec }, sec);
    b.addEventListener('click', () => LL.go(LL.scenes.findIndex(s => s.section === sec)));
    $('#sections').append(b);
  });
  let prevSec = null;
  LL.scenes.forEach((s, i) => {
    if (i === 0) return;
    const d = el('button', { type: 'button', title: s.title, 'aria-label': 'Go to ' + s.title, class: prevSec && prevSec !== s.section ? 'sec' : null });
    d.addEventListener('click', () => LL.go(i)); $('#dots').append(d); prevSec = s.section;
  });
  LL.scenes.forEach((s, i) => {
    const b = el('button', { type: 'button' }, el('small', null, (s.section || 'Start').toUpperCase() + ' · ' + String(i).padStart(2, '0')), el('b', null, s.title));
    b.addEventListener('click', () => { $('#menu').hidden = true; LL.go(i); });
    $('#menuGrid').append(b);
  });

  $('#prevBtn').onclick = LL.prev;
  $('#nextBtn').onclick = LL.next;
  $('#brand').onclick = () => LL.go(0);
  $('#pauseBtn').onclick = () => setPaused(!LL.paused);
  $('#replayBtn').onclick = () => { const i = LL.cur && LL.cur.inst; if (i) (i.replay || i.reset || (() => {}))(); };
  $('#resetBtn').onclick = () => { const i = LL.cur && LL.cur.inst; if (i && i.reset) i.reset(); };
  $('#slowBtn').onclick = () => { LL.slow = !LL.slow; $('#slowBtn').classList.toggle('on', LL.slow); };
  $('#fsBtn').onclick = toggleFullscreen;
  $('#menuBtn').onclick = () => { $('#menu').hidden = false; };
  $('#helpBtn').onclick = () => { $('#help').hidden = false; };
  $$('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o || e.target.hasAttribute('data-close')) o.hidden = true; }));
  $$('#modeSeg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  if (canSpeak) $('#sayBtn').onclick = speakCurrent; else $('#sayBtn').hidden = true;

  window.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' && e.target.type === 'text') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    const overlayOpen = !$('#menu').hidden || !$('#help').hidden;
    if (k === 'Escape') { $('#menu').hidden = true; $('#help').hidden = true; return; }
    if (overlayOpen) return;
    if (k === 'ArrowRight' || k === 'PageDown') { if (tag === 'INPUT') return; e.preventDefault(); LL.next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { if (tag === 'INPUT') return; e.preventDefault(); if (LL.idx > 1) LL.prev(); }
    else if (k === ' ') { if (tag === 'SELECT') return; e.preventDefault(); if (tag === 'BUTTON' || tag === 'INPUT') e.target.blur(); setPaused(!LL.paused); }
    else if (k === 'r' || k === 'R') { const i = LL.cur && LL.cur.inst; if (!i) return; if (e.shiftKey) { i.reset && i.reset(); } else (i.replay || i.reset || (() => {}))(); }
    else if (k === 's' || k === 'S') $('#slowBtn').click();
    else if (k === 't' || k === 'T') setMode(LL.mode === 'teacher' ? 'explore' : 'teacher');
    else if (k === 'e' || k === 'E') revealAll();
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if (k === 'm' || k === 'M') $('#menu').hidden = false;
    else if (k === '?') $('#help').hidden = false;
    else if (k === 'Home') LL.go(1);
    else if (k === 'End') LL.go(LL.scenes.length - 1);
    else if (LL.cur && LL.cur.inst && LL.cur.inst.key) LL.cur.inst.key(k);
  });

  let m = 'teacher';
  try { m = localStorage.getItem('ll-mode') || 'teacher'; } catch (e) { /* storage blocked */ }
  setMode(m === 'explore' ? 'explore' : 'teacher');
  let start = 0;
  try { const h = (location.hash || '').slice(1); if (h) { const i = LL.find(h); if (i >= 0) start = i; } } catch (e) { /* no hash */ }
  LL.go(start);
  requestAnimationFrame(loop);
}

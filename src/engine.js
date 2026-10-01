/* ============ Presentation engine ============ */
const UI = { labels: true, sound: true, slowAll: false };
const SECTIONS = [
  'Welcome', 'Pressure', 'Pressure exerted by liquids', 'Pressure exerted by air', 'Formation of wind',
  'High-speed winds & low pressure', 'Storms', 'Thunderstorms', 'Lightning', 'Lightning safety',
  'Lightning conductor', 'Cyclones', 'Cyclone safety', 'Chapter challenge'
];
const SL = [];            // slide definitions
let cur = -1, scale = 1, started = false;
const visitedSec = new Set();
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function S(def) { SL.push(def); }

/* ---- small HTML builders used by slide definitions ---- */
function ctl(name = 'main', o = {}) {
  return `<div class="ctrls" data-for="${name}">
    ${o.play === false ? '' : `<button class="btn go" data-sim="${name}" data-act="toggle"><span class="ic">▶</span> <span class="tx">${o.playTxt || 'Play'}</span></button>`}
    <button class="btn" data-sim="${name}" data-act="reset"><span class="ic">↺</span> Reset</button>
    ${o.slow === false ? '' : `<button class="btn" data-sim="${name}" data-act="slow">½× Slow motion</button>`}
    ${o.extra || ''}</div>`;
}
function slider(id, label, min, max, step, val, left = '', right = '') {
  return `<div class="slider"><label for="${id}">${label}</label>${left ? `<span class="end">${left}</span>` : ''}<input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}">${right ? `<span class="end">${right}</span>` : ''}</div>`;
}
let qid = 0;
function mcq(q, opts, ok, explain, o = {}) {
  qid++;
  return `<div class="q ${o.cls || ''}" data-type="mcq" id="${o.id || 'q' + qid}">
    <div class="qtag">${o.tag || 'Concept check'}</div><div class="qt">${q}</div>
    <div class="opts">${opts.map((t, i) => `<button class="opt" ${i === ok ? 'data-ok="1"' : ''} data-i="${i}">${t}</button>`).join('')}</div>
    <div class="fb ans">${explain}</div><div class="fb bad">${o.hint || 'Not quite. Look at the picture again and try once more.'}</div></div>`;
}
function predict(q, opts, o = {}) {
  qid++;
  return `<div class="q predict" data-type="predict" id="${o.id || 'q' + qid}">
    <div class="qtag">Predict first</div><div class="qt">${q}</div>
    <div class="opts">${opts.map((t, i) => `<button class="opt" data-i="${i}">${t}</button>`).join('')}</div>
    <div class="fb pred">Prediction locked in. Now run the experiment and check!</div></div>`;
}
function seq(q, items, explain, o = {}) {
  qid++;
  const R = rng(qid * 97 + items.length), order = items.map((_, i) => i);
  do { for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } } while (order.every((v, i) => v === i));
  return `<div class="q" data-type="seq" id="${o.id || 'q' + qid}"><div class="qtag">${o.tag || 'Sequence the steps'}</div><div class="qt">${q}</div>
    <div class="seq">${order.map(i => `<div class="it" data-k="${i}"><span class="n"></span><span>${items[i]}</span><span class="mv"><button data-mv="-1" aria-label="Move up">▲</button><button data-mv="1" aria-label="Move down">▼</button></span></div>`).join('')}</div>
    <div class="ctrls"><button class="btn go" data-act="checkseq">Check order</button></div>
    <div class="fb ans">${explain}</div><div class="fb bad">Some steps are out of place (red). Drag or use ▲ ▼ to fix them.</div></div>`;
}
const DISC = [];
function discuss(q, a, label = 'Think &amp; Discuss') {
  DISC.push({ q, a });
  return `<button class="btn discuss-btn" data-disc="${DISC.length - 1}">${label}</button>`;
}

/* ---- simulation class ---- */
class Sim {
  constructor(slideDef, canvas, o) {
    this.def = slideDef; this.cv = canvas; this.o = o; this.name = o.name || 'main';
    this.w = +canvas.dataset.w; this.h = +canvas.dataset.h;
    this.f = +(canvas.dataset.s || 1);
    canvas.style.width = this.w * this.f + 'px'; canvas.style.height = this.h * this.f + 'px';
    this.ctx = canvas.getContext('2d');
    this.slow = false; this.playing = false; this.dirty = true; this.K = 1;
    this.fit();
    this.reset(true);
    if (o.pointer) {
      const pos = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * this.w, (e.clientY - r.top) / r.height * this.h]; };
      let down = false;
      canvas.addEventListener('pointerdown', e => { down = true; canvas.setPointerCapture(e.pointerId); o.pointer.call(this, 'down', ...pos(e)); this.dirty = true; });
      canvas.addEventListener('pointermove', e => { o.pointer.call(this, down ? 'drag' : 'move', ...pos(e)); this.dirty = true; });
      canvas.addEventListener('pointerup', e => { down = false; o.pointer.call(this, 'up', ...pos(e)); this.dirty = true; });
    }
  }
  fit() {
    const K = Math.min(2.2, scale * (window.devicePixelRatio || 1)) * this.f;
    this.K = K; this.cv.width = Math.round(this.w * K); this.cv.height = Math.round(this.h * K); this.dirty = true;
  }
  reset(first) {
    this.t = 0; this.s = {}; this.o.reset && this.o.reset.call(this, this.s);
    if (!first && this.o.autoplay) this.playing = true;
    if (!first && !this.o.autoplay) this.playing = false;
    this.dirty = true; this.ui();
  }
  play() { this.playing = true; this.o.onplay && this.o.onplay.call(this, this.s); this.ui(); }
  pause() { this.playing = false; this.ui(); }
  toggle() { this.playing ? this.pause() : this.play(); }
  frame(dt) {
    if (this.playing) {
      const d = Math.min(dt, .05) * (this.slow || UI.slowAll ? .3 : 1);
      this.t += d; this.o.update && this.o.update.call(this, this.s, d); this.dirty = true;
    } else if (this.o.idle) { this.o.idle.call(this, this.s, Math.min(dt, .05)); this.dirty = true; }
    if (this.dirty) {
      const c = this.ctx; c.setTransform(this.K, 0, 0, this.K, 0, 0); c.clearRect(0, 0, this.w, this.h);
      this.o.draw.call(this, c, this.s); this.dirty = false;
    }
  }
  ui() {
    const root = this.def.el; if (!root) return;
    $$(`[data-sim="${this.name}"][data-act="toggle"]`, root).forEach(b => {
      b.querySelector('.ic').textContent = this.playing ? '❚❚' : '▶';
      b.querySelector('.tx').textContent = this.playing ? 'Pause' : (b.dataset.play || 'Play');
    });
    $$(`[data-sim="${this.name}"][data-act="slow"]`, root).forEach(b => b.classList.toggle('on', this.slow));
  }
}

/* ---- build & navigation ---- */
function build() {
  SL.sort((a, b) => a.sec - b.sec);
  const host = $('#slides');
  SL.forEach((d, i) => {
    const el = document.createElement('section');
    el.className = 'slide' + (d.full ? ' full' : '');
    el.dataset.i = i;
    el.innerHTML = (d.title ? `<header class="sh"><div class="ttl"><div class="kick">${d.kick || SECTIONS[d.sec]}</div><h2>${d.title}</h2></div>${d.sub ? `<div class="sub explain">${d.sub}</div>` : ''}</header>` : '') + d.html;
    host.appendChild(el); d.el = el; d.sims = [];
    $$('[data-act="toggle"]', el).forEach(b => { b.dataset.play = b.querySelector('.tx').textContent; });
  });
  // progress bar
  $('#progress').innerHTML = SECTIONS.map((s, i) => `<button title="${s}" aria-label="Go to ${s}" data-sec="${i}"></button>`).join('');
  $('#progress').addEventListener('click', e => { const b = e.target.closest('[data-sec]'); if (b) goSection(+b.dataset.sec); });
  // teacher jump list
  $('#jump').innerHTML = SL.map((d, i) => `<option value="${i}">${i + 1}. ${SECTIONS[d.sec]} - ${(d.title || d.name || '').replace(/<[^>]+>/g, '')}</option>`).join('');
}
function setupSlide(d) {
  if (d.ready) return; d.ready = true;
  const api = {
    sim: (sel, o) => { const s = new Sim(d, typeof sel === 'string' ? $(sel, d.el) : sel, o); d.sims.push(s); return s; },
    $: s => $(s, d.el), $$: s => $$(s, d.el),
    on: (s, ev, fn) => $$(s, d.el).forEach(n => n.addEventListener(ev, fn)),
  };
  d.api = api;
  d.setup && d.setup(api, d.el);
  d.sims.forEach(s => s.ui());
}
function go(i) {
  i = clamp(i, 0, SL.length - 1);
  if (i === cur) return;
  const prev = SL[cur];
  if (prev) { prev.el.classList.remove('on'); prev.sims.forEach(s => { s.wasPlaying = s.playing; s.pause(); }); prev.leave && prev.leave(); }
  cur = i; const d = SL[i];
  setupSlide(d);
  d.el.classList.add('on');
  d.sims.forEach(s => { s.fit(); if ((s.o.autoplay && started) || s.wasPlaying) s.play(); s.dirty = true; });
  d.enter && d.enter(d.api);
  visitedSec.add(d.sec);
  $$('#progress button').forEach((b, k) => { b.classList.toggle('cur', k === d.sec); b.classList.toggle('done', visitedSec.has(k) && k !== d.sec); });
  $('#secname').textContent = SECTIONS[d.sec];
  $('#count').textContent = `${i + 1} / ${SL.length}`;
  $('#jump').value = i;
  $('#hint').textContent = d.hint || '';
  try { history.replaceState(null, '', '#s' + (i + 1)); } catch (e) { }
  $('#prev').disabled = i === 0; $('#next').disabled = i === SL.length - 1;
}
function goSection(sec) { const i = SL.findIndex(d => d.sec === sec); if (i >= 0) go(i); }
function goId(id) { const i = SL.findIndex(d => d.id === id); if (i >= 0) go(i); }

function fitStage() {
  scale = Math.min(innerWidth / 1920, innerHeight / 1080);
  $('#stage').style.transform = `translate(-50%,-50%) scale(${scale})`;
  SL.forEach(d => d.sims && d.sims.forEach(s => s.fit()));
}

/* ---- main loop ---- */
let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000; last = now;
  const d = SL[cur];
  if (d && !overlayOpen) d.sims.forEach(s => s.frame(dt));
  else if (d) d.sims.forEach(s => { if (s.dirty) s.frame(0); });
  if (d && d.tick && !overlayOpen) d.tick(dt);
  startTick && startTick(dt);
  requestAnimationFrame(loop);
}
let startTick = null;

/* ---- audio (thunder) ---- */
let AC = null;
function audioInit() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume && AC.resume(); } catch (e) { AC = null; } }
function thunder(delay = 0, strength = 1) {
  if (!UI.sound || !AC) return;
  try {
    const len = 3.6, sr = AC.sampleRate, buf = AC.createBuffer(1, sr * len, sr), ch = buf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < ch.length; i++) { const w = Math.random() * 2 - 1; b = .97 * b + .03 * w; ch[i] = b * 6; }
    const src = AC.createBufferSource(); src.buffer = buf;
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
    const g = AC.createGain(); const t0 = AC.currentTime + delay;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.9 * strength, t0 + .06);
    g.gain.exponentialRampToValueAtTime(.35 * strength, t0 + .6); g.gain.linearRampToValueAtTime(.55 * strength, t0 + 1.1);
    g.gain.exponentialRampToValueAtTime(.001, t0 + len);
    src.connect(lp); lp.connect(g); g.connect(AC.destination); src.start(t0); src.stop(t0 + len);
  } catch (e) { }
}

/* ---- overlay: think & discuss ---- */
let overlayOpen = false, pausedByOverlay = [];
function openDiscuss(k) {
  const d = DISC[k]; if (!d) return;
  $('#ov-q').innerHTML = d.q; $('#ov-a').innerHTML = d.a; $('#ov-a').classList.remove('show');
  $('#ov-show').style.display = '';
  const sd = SL[cur]; pausedByOverlay = sd.sims.filter(s => s.playing); pausedByOverlay.forEach(s => s.pause());
  overlayOpen = true; $('#overlay').classList.add('show'); $('#ov-show').focus();
}
function closeDiscuss() { overlayOpen = false; $('#overlay').classList.remove('show'); pausedByOverlay.forEach(s => s.play()); pausedByOverlay = []; }

/* ---- event delegation ---- */
function onClick(e) {
  const t = e.target;
  const disc = t.closest('[data-disc]'); if (disc) { openDiscuss(+disc.dataset.disc); return; }
  const actBtn = t.closest('[data-act]');
  if (actBtn && actBtn.dataset.sim) {
    const d = SL[cur]; const s = d.sims.find(x => x.name === actBtn.dataset.sim); if (!s) return;
    const a = actBtn.dataset.act;
    if (a === 'toggle') s.toggle(); else if (a === 'reset') { s.reset(); d.onreset && d.onreset(s.name); } else if (a === 'slow') { s.slow = !s.slow; s.ui(); }
    return;
  }
  if (actBtn && actBtn.dataset.act === 'checkseq') { checkSeq(actBtn.closest('.q')); return; }
  const mv = t.closest('[data-mv]');
  if (mv) { const it = mv.closest('.it'), list = it.parentNode; if (+mv.dataset.mv < 0 && it.previousElementSibling) list.insertBefore(it, it.previousElementSibling); else if (+mv.dataset.mv > 0 && it.nextElementSibling) list.insertBefore(it.nextElementSibling, it); numberSeq(list); return; }
  const opt = t.closest('.opt');
  if (opt && opt.closest('.q')) {
    const q = opt.closest('.q');
    if (q.dataset.type === 'mcq') {
      if (q.classList.contains('done')) return;
      if (opt.dataset.ok) {
        opt.classList.add('right'); q.classList.add('done');
        $('.fb.bad', q).classList.remove('show'); $('.fb.ans', q).classList.add('show');
      } else { opt.classList.add('wrong'); $('.fb.bad', q).classList.add('show'); }
      q.dispatchEvent(new CustomEvent('answered', { detail: { ok: !!opt.dataset.ok, i: +opt.dataset.i }, bubbles: true }));
    } else if (q.dataset.type === 'predict') {
      $$('.opt', q).forEach(o => o.classList.remove('chosen')); opt.classList.add('chosen');
      $('.fb.pred', q).classList.add('show');
      q.dispatchEvent(new CustomEvent('predicted', { detail: { i: +opt.dataset.i }, bubbles: true }));
    }
  }
}
function numberSeq(list) { $$('.it', list).forEach((it, i) => { $('.n', it).textContent = (i + 1) + '.'; it.classList.remove('ok', 'no'); }); }
function checkSeq(q) {
  const its = $$('.it', q); let all = true;
  its.forEach((it, i) => { const ok = +it.dataset.k === i; it.classList.toggle('ok', ok); it.classList.toggle('no', !ok); all = all && ok; });
  $('.fb.ans', q).classList.toggle('show', all); $('.fb.bad', q).classList.toggle('show', !all);
}
function initSeqDrag() {
  let drag = null;
  document.addEventListener('pointerdown', e => {
    const it = e.target.closest('.seq .it'); if (!it || e.target.closest('button')) return;
    drag = it; it.classList.add('drag'); it.setPointerCapture(e.pointerId);
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return;
    const list = drag.parentNode;
    const over = $$('.it', list).find(n => { if (n === drag) return false; const r = n.getBoundingClientRect(); return e.clientY > r.top && e.clientY < r.bottom; });
    if (over) { const r = over.getBoundingClientRect(); list.insertBefore(drag, e.clientY < r.top + r.height / 2 ? over : over.nextSibling); numberSeq(list); }
  });
  document.addEventListener('pointerup', () => { if (drag) { drag.classList.remove('drag'); drag = null; } });
}

/* ---- teacher panel & keys ---- */
function fullscreen() {
  try { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { }); else document.exitFullscreen(); } catch (e) { }
}
function teacherInit() {
  const T = $('#teacher');
  $('#tbtn').addEventListener('click', () => T.classList.toggle('show'));
  $('#tclose').addEventListener('click', () => T.classList.remove('show'));
  const tog = (id, fn) => $(id).addEventListener('click', e => { const on = fn(); e.currentTarget.classList.toggle('on', on); });
  tog('#t-ans', () => document.body.classList.toggle('answers'));
  tog('#t-lab', () => { UI.labels = !UI.labels; SL.forEach(d => d.sims && d.sims.forEach(s => s.dirty = true)); return !UI.labels; });
  tog('#t-exp', () => document.body.classList.toggle('noexplain'));
  tog('#t-pres', () => document.body.classList.toggle('pres'));
  tog('#t-slow', () => (UI.slowAll = !UI.slowAll));
  tog('#t-snd', () => { UI.sound = !UI.sound; return !UI.sound; });
  $('#t-reset').addEventListener('click', () => { const d = SL[cur]; d.sims.forEach(s => s.reset()); d.onreset && d.onreset('*'); });
  $('#t-full').addEventListener('click', fullscreen);
  $('#jump').addEventListener('change', e => go(+e.target.value));
  $('#t-road').addEventListener('click', () => goId('roadmap'));
}
function onKey(e) {
  if (e.target.matches('input,select,textarea')) { if (e.key === 'Escape') e.target.blur(); return; }
  if (overlayOpen) { if (e.key === 'Escape' || e.key === 'Enter') closeDiscuss(); return; }
  const k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); go(cur + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(cur - 1); }
  else if (k === 'Home') go(0);
  else if (k === 'End') go(SL.length - 1);
  else if (k === ' ' && !e.target.closest('button')) { e.preventDefault(); const s = SL[cur].sims[0]; s && s.toggle(); }
  else if (k === 'f' || k === 'F') fullscreen();
  else if (k === 't' || k === 'T') $('#teacher').classList.toggle('show');
  else if (k === 'l' || k === 'L') $('#t-lab').click();
  else if (k === 'a' || k === 'A') $('#t-ans').click();
  else if (k === 'r' || k === 'R') $('#t-reset').click();
  else if (k === 'p' || k === 'P') $('#t-pres').click();
  else if (k === 'Escape') $('#teacher').classList.remove('show');
}

function boot() {
  build();
  fitStage();
  addEventListener('resize', fitStage);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  initSeqDrag();
  $$('.seq').forEach(numberSeq);
  teacherInit();
  $('#prev').addEventListener('click', () => go(cur - 1));
  $('#next').addEventListener('click', () => go(cur + 1));
  $('#ov-show').addEventListener('click', () => { $('#ov-a').classList.add('show'); $('#ov-show').style.display = 'none'; });
  $('#ov-close').addEventListener('click', closeDiscuss);
  let hideT; document.addEventListener('mousemove', () => { document.body.classList.add('showchrome'); clearTimeout(hideT); hideT = setTimeout(() => document.body.classList.remove('showchrome'), 1800); });
  const m = /^#s(\d+)$/.exec(location.hash || '');
  go(m ? +m[1] - 1 : 0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { D._cloudCache.clear(); SL.forEach(d => d.sims && d.sims.forEach(s => s.dirty = true)); });
  startScreen();
  requestAnimationFrame(loop);
}

function startScreen() {
  const st = $('#start'), cv = $('#startcv'), c = cv.getContext('2d');
  cv.width = 1920; cv.height = 1080;
  let t = 0, flash = 0, nextFlash = 2.5, bolt = null;
  startTick = dt => {
    if (!st.isConnected || st.style.display === 'none') { startTick = null; return; }
    t += dt; c.clearRect(0, 0, 1920, 1080);
    for (let i = 0; i < 7; i++) D.cloud(c, ((i * 330 + t * (14 + i * 3)) % 2400) - 240, 150 + (i % 3) * 90, 620, 260, { seed: i + 1, dark: .75, alpha: .55 });
    nextFlash -= dt;
    if (nextFlash < 0) { flash = 1; nextFlash = 3 + Math.random() * 3; const x = 300 + Math.random() * 1300; bolt = D.genBolt(x, 260, x + (Math.random() - .5) * 300, 1080, Math.random() * 1e6 | 0); }
    if (flash > 0) { c.fillStyle = `rgba(200,210,255,${flash * .18})`; c.fillRect(0, 0, 1920, 1080); D.bolt(c, bolt, flash); flash -= dt * 2.5; }
  };
  $('#begin').addEventListener('click', () => {
    audioInit(); st.style.display = 'none'; started = true;
    const d = SL[cur]; d.sims.forEach(s => { if (s.o.autoplay) s.play(); });
  });
}

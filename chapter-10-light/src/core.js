'use strict';
/* ================= Frame engine =================
   Every screen is a "frame": {mod, title, sub, build(root,f), enter(f), leave(f), tick(f,dt,t)}.
   Frames build lazily, transition with a cinematic cross-fade, and only the visible
   frame is animated. */
const W = 1920, H = 1080, TAU = Math.PI * 2, DEG = Math.PI / 180;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const $ = (s, r = document) => r.querySelector(s);

function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  if (props) for (const k in props) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
  return e;
}

const App = { scale: 1, ratio: 1, frames: [], cur: -1, canvases: new Set(), speed: 1, labels: true, t: 0, busy: [] };

/* ---------- canvases ---------- */
function canvas(parent, w, hh, style) {
  const cv = h('canvas', { class: 'cv', style: `width:${w}px;height:${hh}px;${style || ''}` });
  cv._w = w; cv._h = hh;
  parent && parent.append(cv);
  App.canvases.add(cv); sizeCanvas(cv);
  return { cv, ctx: cv.getContext('2d'), w, h: hh };
}
function sizeCanvas(cv) { cv.width = Math.round(cv._w * App.ratio); cv.height = Math.round(cv._h * App.ratio); }
function begin(c, bg) {
  const x = c.ctx; x.setTransform(c.cv.width / c.w, 0, 0, c.cv.height / c.h, 0, 0);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setLineDash([]); x.filter = 'none';
  if (bg) { x.fillStyle = bg; x.fillRect(0, 0, c.w, c.h); } else x.clearRect(0, 0, c.w, c.h);
  return x;
}
/* pointer helper: down(p) returns true to start a drag; move(p) while dragging; hover(p) returns true to show grab cursor */
function pointer(c, o) {
  const pos = e => { const r = c.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * c.w / r.width, y: (e.clientY - r.top) * c.h / r.height }; };
  let drag = false;
  c.cv.addEventListener('pointerdown', e => {
    const p = pos(e);
    if (o.down && o.down(p, e)) { drag = true; c.cv.setPointerCapture(e.pointerId); c.cv.style.cursor = 'grabbing'; e.preventDefault(); }
  });
  c.cv.addEventListener('pointermove', e => {
    const p = pos(e);
    if (drag) { o.move && o.move(p, e); return; }
    if (o.hover) c.cv.style.cursor = o.hover(p) ? 'grab' : 'default';
  });
  const end = e => { if (drag) { drag = false; c.cv.style.cursor = 'grab'; o.up && o.up(pos(e)); } };
  c.cv.addEventListener('pointerup', end); c.cv.addEventListener('pointercancel', end);
}

/* ---------- frames ---------- */
function frame(def) { App.frames.push(def); }

function buildFrame(f) {
  const root = h('section', { class: 'frame' });
  if (f.title) root.append(h('header', { class: 'fh' },
    h('div', { class: 'kick' }, f.mod != null ? h('b', null, f.mod === 'intro' ? 'CHAPTER 10' : 'MODULE ' + String(f.mod).padStart(2, '0')) : null, f.kick || ''),
    h('h1', { html: f.title }), f.sub ? h('p', { html: f.sub }) : null));
  const body = h('div', { class: 'body' }); root.append(body);
  $('#frames').append(root);
  f.root = root; f.body = body; f.t = 0;
  f.build && f.build(body, f);
  f.built = true;
}

function go(i) {
  i = clamp(i, 0, App.frames.length - 1);
  if (i === App.cur) return;
  const dir = i > App.cur ? 1 : -1;
  const old = App.frames[App.cur], nf = App.frames[i];
  if (!nf.built) buildFrame(nf);
  if (old) {
    old.root.classList.remove('on'); old.root.classList.toggle('prev', dir > 0);
    old.leave && old.leave(old);
    App.busy.push({ f: old, until: performance.now() + 900 });
  }
  nf.root.classList.toggle('prev', dir < 0);
  void nf.root.offsetWidth;
  nf.root.classList.add('on'); nf.root.classList.remove('prev');
  App.cur = i; nf.seen = true; nf.t = 0;
  nf.enter && nf.enter(nf);
  if (typeof Notes !== 'undefined') Notes.show(nf);
  updateBar();
  try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { }
}

function updateBar() {
  const f = App.frames[App.cur];
  $('#count').textContent = (App.cur + 1) + ' / ' + App.frames.length;
  document.querySelectorAll('#dots button').forEach(b => {
    const m = b.dataset.m;
    b.classList.toggle('cur', String(f.mod) === m);
    b.classList.toggle('seen', App.frames.some(x => x.seen && String(x.mod) === m));
  });
  document.querySelectorAll('#mapgrid .it').forEach((b, k) => b.classList.toggle('cur', k === App.cur));
  $('#prev').disabled = App.cur === 0; $('#next').disabled = App.cur === App.frames.length - 1;
}

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  App.scale = s;
  $('#stage').style.transform = `translate(-50%,-50%) scale(${s})`;
  const r = clamp(s * (devicePixelRatio || 1), 1, 2);
  if (Math.abs(r - App.ratio) > .01) { App.ratio = r; App.canvases.forEach(sizeCanvas); }
}

function loop(now) {
  const dt = Math.min(.05, (now - (App.last || now)) / 1000); App.last = now; App.t += dt;
  const f = App.frames[App.cur];
  App.busy = App.busy.filter(b => b.until > now && b.f !== f);
  for (const b of App.busy) b.f.tick && b.f.tick(b.f, dt, b.f.t);
  if (f) { f.t += dt; f.tick && f.tick(f, dt, f.t); }
  requestAnimationFrame(loop);
}

function boot() {
  // modules may be defined in any file order; present them in module order (stable sort)
  const key = f => f.mod === 'intro' ? 0 : +f.mod;
  App.frames.sort((a, b) => key(a) - key(b));
  // module chips in the bar and map
  const mods = []; App.frames.forEach(f => { if (f.mod != null && !mods.includes(String(f.mod))) mods.push(String(f.mod)); });
  const dots = $('#dots');
  mods.forEach(m => dots.append(h('button', {
    'data-m': m, title: m === 'intro' ? 'Introduction' : 'Module ' + m,
    onclick: () => go(App.frames.findIndex(f => String(f.mod) === m))
  }, m === 'intro' ? '◎' : String(m).padStart(2, '0'))));
  const grid = $('#mapgrid');
  App.frames.forEach((f, k) => grid.append(h('button', { class: 'it', onclick: () => { closeMap(); go(k); } },
    h('span', null, f.mod === 'intro' ? '—' : String(f.mod).padStart(2, '0')), (f.mapTitle || f.title || '').replace(/<[^>]+>/g, ''))));
  $('#prev').onclick = () => go(App.cur - 1);
  $('#next').onclick = () => go(App.cur + 1);
  $('#mapbtn').onclick = openMap; $('#mapclose').onclick = closeMap;
  addEventListener('resize', fit); fit();
  // focusing a control must never scroll the fixed stage
  for (const el of [$('#stage'), $('#frames'), $('#viewport')]) el.addEventListener('scroll', () => { el.scrollTop = 0; el.scrollLeft = 0; });
  addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(App.cur + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(App.cur - 1); e.preventDefault(); }
    else if (e.key === 'm' || e.key === 'M') $('#map').classList.contains('on') ? closeMap() : openMap();
    else if (e.key === 'Escape') closeMap();
    else if (e.key === 'f' || e.key === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
    else if (e.key === 'l' || e.key === 'L') App.labels = !App.labels;
    else if (e.key === 'p' || e.key === 'P') document.body.classList.toggle('pres');
  });
  if (typeof Notes !== 'undefined') Notes.init();
  const start = parseInt((location.hash || '').slice(1)) - 1;
  go(start >= 0 && start < App.frames.length ? start : 0);
  requestAnimationFrame(loop);
}
function openMap() { $('#map').classList.add('on'); }
function closeMap() { $('#map').classList.remove('on'); }

/* ================= UI controls ================= */
const ui = {
  slider(o) {
    const inp = h('input', { type: 'range', min: o.min, max: o.max, step: o.step || 1, value: o.value, 'aria-label': o.label });
    const val = h('b');
    const paint = () => {
      const v = +inp.value; val.textContent = o.fmt ? o.fmt(v) : v;
      inp.style.setProperty('--p', ((v - o.min) / (o.max - o.min) * 100) + '%');
    };
    inp.addEventListener('input', () => { paint(); o.onInput && o.onInput(+inp.value); });
    paint();
    const el = h('div', { class: 'ctl' }, h('div', { class: 'lab' }, h('span', null, o.label), val), inp);
    el.set = v => { inp.value = v; paint(); };
    el.get = () => +inp.value;
    return el;
  },
  seg(o) {
    const el = h('div', { class: 'seg', role: 'group', 'aria-label': o.label || '' });
    const bs = o.options.map(op => {
      const b = h('button', { onclick: () => { el.set(op.v); o.onChange && o.onChange(op.v); } }, op.t);
      b._v = op.v; el.append(b); return b;
    });
    el.set = v => bs.forEach(b => b.classList.toggle('on', b._v === v));
    el.set(o.value);
    if (o.label) return Object.assign(h('div', { class: 'ctl' }, h('div', { class: 'lab' }, h('span', null, o.label)), el), { set: el.set });
    return el;
  },
  toggle(o) {
    const el = h('div', { class: 'tog' + (o.value ? ' on' : ''), role: 'switch', tabindex: 0, 'aria-checked': !!o.value }, h('i'), h('span', null, o.label));
    const flip = () => { el.set(!el.classList.contains('on')); o.onChange && o.onChange(el.classList.contains('on')); };
    el.onclick = flip; el.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { flip(); e.preventDefault(); } };
    el.set = v => { el.classList.toggle('on', !!v); el.setAttribute('aria-checked', !!v); };
    return el;
  },
  btn(t, fn, cls) { return h('button', { class: 'btn ' + (cls || ''), onclick: fn }, t); },
  card(title, ...kids) { return h('div', { class: 'card' }, title ? h('h3', null, title) : null, ...kids); },
  readout(rows) {
    const el = h('div', { class: 'ro' }); const vs = {};
    rows.forEach(([k, lab]) => { el.append(h('div', { class: 'k' }, lab)); vs[k] = h('div', { class: 'v' }, '—'); el.append(vs[k]); });
    el.set = (k, v, col) => {
      const n = vs[k]; if (!n) return;
      if (n.textContent !== String(v)) { n.textContent = v; if (n._last && n._last !== col) { n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); } }
      n._last = col; n.style.color = col || '';
    };
    return el;
  },
  warn(html) { return h('div', { class: 'warn' }, h('div', { class: 'wi' }, '!'), h('div', { html })); },
  /* Discovery card: a prompt, a sequence of questions, then the science */
  discover(o) {
    let k = 0;
    const q = h('div', { class: 'dq' }, o.qs[0]);
    const ans = h('div', { class: 'dans', html: o.reveal });
    const nextB = ui.btn('Next question ▸', () => { k = (k + 1) % o.qs.length; q.style.opacity = 0; setTimeout(() => { q.textContent = o.qs[k]; q.style.opacity = 1; }, 200); });
    const revB = ui.btn('Reveal the science', () => { el.classList.toggle('rev'); revB.textContent = el.classList.contains('rev') ? 'Hide' : 'Reveal the science'; o.onReveal && o.onReveal(el.classList.contains('rev')); }, 'pri');
    const el = h('div', { class: 'card disc' }, h('div', { class: 'dtag' }, 'DISCOVERY'), h('div', { class: 'dp' }, o.prompt || 'MOVE THE OBJECT AND OBSERVE.'), q, h('div', { class: 'row' }, nextB, revB), ans);
    return el;
  }
};

'use strict';
/* Concept slides: definitions, laws and important points, revealed one at a time (Next ▶ reveals the next point,
   then moves on). Key words in definitions are written [[like this]]: shown in Teacher mode, hidden blanks in Explore mode. */

const blanks = s => s.replace(/\[\[(.+?)\]\]/g, '<span class="blank" tabindex="0" role="button" title="Click to reveal">$1</span>');

/* object moved away step by step; the right-hand window shows how the image looks (no rays, no foci) */
function viewDiagram(c, w, h, t, { kind, type, us, names }) {
  const idx = Math.floor(t / 2.6) % us.length, u = us[idx], S = 7.5, Y = h * .62, X = 400;
  const f = kind === 'mirror' ? (type === 'concave' ? -10 : 10) : (type === 'convex' ? 10 : -10);
  const img = kind === 'mirror' ? OPT.mirrorImage(-u, f) : OPT.lensImage(-u, f);
  const blurred = img.inf || Math.abs(img.m) > 4, m = img.inf ? 4 : img.m;
  D.line(c, P(20, Y), P(450, Y), 'rgba(60,70,110,.35)', 3);
  D.candle(c, X - u * S, Y, 70, { t });
  if (kind === 'mirror') D.mirror(c, { type, P: P(X, Y - 80), R: 200, a: 90, rot: 0 }, { realistic: true });
  else D.lens(c, X, Y - 80, 90, type, { bulge: 14 });
  D.text(c, 'Object ' + names[idx], 230, 28, { size: 21, col: COL.amber, bg: COL.pill });
  const vx = 480, vy = 50, vw = 260, vh = h - 110, cx = vx + vw / 2, cy = vy + vh / 2;
  c.save(); c.beginPath(); c.ellipse(cx, cy, vw / 2, vh / 2, 0, 0, Math.PI * 2);
  c.fillStyle = kind === 'mirror' ? '#d9e1f0' : '#e8f5ff'; c.fill(); c.save(); c.clip();
  if (blurred && 'filter' in c) c.filter = 'blur(8px)';
  const am = Math.min(Math.abs(m), 2.6), base = 80;
  D.candle(c, cx, cy + (m < 0 ? -1 : 1) * base * am / 2, (m < 0 ? -1 : 1) * base * am, { t });
  c.restore(); c.lineWidth = 6; c.strokeStyle = kind === 'mirror' ? '#8792aa' : '#1f8fff'; c.stroke(); c.restore();
  D.text(c, 'What you see', cx, vy - 18, { size: 18, col: COL.white });
  let txt;
  if (blurred) txt = 'Very blurred';
  else { const a = Math.abs(img.m); txt = (img.m > 0 ? 'Erect' : 'Inverted') + ', ' + (a > 1.03 ? 'enlarged' : a < .97 ? 'diminished' : 'same size'); }
  D.text(c, txt, cx, h - 26, { size: 22, col: blurred ? COL.amber : img.m > 0 ? COL.cyan : COL.magenta, bg: COL.pill });
}

const DIAGRAMS = {
  reflection(c, w, h, t) {
    const O = P(w / 2, h - 120), a = 40 * DEG, L = 300;
    c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(0, O.y, w, h - O.y); c.restore();
    D.mirror(c, { type: 'plane', P: O, R: 1, a: 320, rot: Math.PI / 2 });
    const S = P(O.x - Math.sin(a) * L, O.y - Math.cos(a) * L), E = P(O.x + Math.sin(a) * L, O.y - Math.cos(a) * L);
    D.line(c, O, P(O.x, O.y - 330), COL.amber, 2.5, [9, 7]); D.text(c, 'Normal', O.x, O.y - 346, { size: 20, col: COL.amber });
    D.ray(c, [S, O], COL.cyan, 3.2); D.arrowOn(c, S, O, COL.cyan, 15); D.ray(c, [O, E], COL.magenta, 3.2); D.arrowOn(c, O, E, COL.magenta, 15);
    D.pulses(c, [S, O, E], t, '#fff', { speed: 220, gap: 120 });
    D.angleArc(c, O, 90, -Math.PI / 2 - a, -Math.PI / 2, COL.cyan, 'i', 120); D.angleArc(c, O, 90, -Math.PI / 2, -Math.PI / 2 + a, COL.magenta, 'r', 120);
    D.text(c, 'Incident ray', S.x + 10, S.y - 22, { size: 20, col: COL.cyan }); D.text(c, 'Reflected ray', E.x - 10, E.y - 22, { size: 20, col: COL.magenta });
    D.text(c, 'Mirror', 90, O.y + 40, { size: 20, col: COL.muted }); D.text(c, 'Point of incidence O', O.x, O.y + 40, { size: 18, col: COL.white });
    D.text(c, 'Light falls on a surface and bounces back', w / 2, 30, { size: 21, col: COL.white, bg: 'rgba(255,255,255,.9)' });
  },
  spherical(c, w, h, t) {
    const rows = [{ y: 165, type: 'concave', cx: 250, P: 380, txt: ['Concave mirror', 'reflecting surface', 'curves inwards'], col: COL.amber },
                  { y: 455, type: 'convex', cx: 380, P: 250, txt: ['Convex mirror', 'reflecting surface', 'curves outwards'], col: COL.magenta }];
    for (const r of rows) {
      c.save(); c.setLineDash([6, 7]); c.strokeStyle = 'rgba(70,100,180,.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(r.cx, r.y, 130, 0, Math.PI * 2); c.stroke(); c.restore();
      D.dot(c, r.cx, r.y, 4, COL.muted, false); D.text(c, 'imaginary sphere', r.cx, r.y + 150, { size: 15, col: COL.muted, weight: 400 });
      D.mirror(c, { type: r.type, P: P(r.P, r.y), R: 130, a: 92, rot: 0 });
      for (const dy of [-50, 0, 50]) {
        const sag = 130 - Math.sqrt(130 * 130 - dy * dy), sx = r.type === 'concave' ? r.P - sag : r.P + sag;
        const a = P(r.type === 'concave' ? r.cx - 60 : 40, r.y + dy), b = P(sx - 10, r.y + dy);
        D.ray(c, [a, b], COL.cyan, 2); D.arrowOn(c, a, b, COL.cyan, 11, .6);
        D.pulses(c, [a, b], t + dy * .01, '#fff', { speed: 120, gap: 90, r: 3 });
      }
      r.txt.forEach((s, i) => D.text(c, s, 560, r.y - 30 + i * 30, { size: i ? 20 : 26, col: i ? COL.white : r.col, font: i ? 'body' : 'disp', weight: i ? 400 : 700 }));
    }
    D.text(c, 'Hatched side = coated, non-reflecting', w / 2, h - 18, { size: 18, col: COL.muted });
  },
  plane(c, w, h, t) {
    const MX = 380, floor = h - 150, oh = 140, xo = 210, xi = 2 * MX - xo, eye = P(80, 150);
    c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(MX, 0, w - MX, h); c.restore();
    D.line(c, P(0, floor), P(w, floor), 'rgba(60,70,110,.35)', 2);
    D.candle(c, xi, floor, oh, { ghost: true, t }); D.candle(c, xo, floor, oh, { t });
    D.mirror(c, { type: 'plane', P: P(MX, floor - 200), R: 1, a: 210, rot: 0 });
    const IT = P(xi, floor - oh), Hy = eye.y + (IT.y - eye.y) * (MX - eye.x) / (IT.x - eye.x), H = P(MX, Hy);
    D.ray(c, [P(xo, floor - oh), H, eye], COL.cyan, 2.6); D.arrowOn(c, P(xo, floor - oh), H, COL.cyan); D.arrowOn(c, H, eye, COL.cyan);
    D.line(c, H, IT, COL.magenta, 2, [8, 7]); D.eye(c, eye.x, eye.y, 1, -1);
    D.text(c, 'Object', xo, floor - oh - 70, { size: 19, col: COL.amber }); D.text(c, 'Image', xi, floor - oh - 70, { size: 19, col: COL.magenta });
    c.save(); c.translate(w / 2, h - 30); c.scale(-1, 1); D.text(c, 'AMBULANCE', 0, 0, { size: 30, col: '#ff6b7a', font: 'disp' }); c.restore();
  },
  sphImages(c, w, h, t) {
    viewDiagram(c, w, h, t, { kind: 'mirror', type: 'concave', us: [3, 6, 15, 25, 45], names: ['very close', 'close', 'a little farther', 'far', 'very far'] });
  },
  laws(c, w, h, t) {
    const O = P(w / 2, h - 110), deg = Math.round(40 + 22 * Math.sin(t * .7)), a = deg * DEG, L = 290;
    c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(0, O.y, w, h - O.y); c.restore();
    D.mirror(c, { type: 'plane', P: O, R: 1, a: 320, rot: Math.PI / 2 });
    D.protractor(c, O, 220);
    const S = P(O.x - Math.sin(a) * L, O.y - Math.cos(a) * L), E = P(O.x + Math.sin(a) * L, O.y - Math.cos(a) * L);
    D.line(c, O, P(O.x, O.y - 320), COL.amber, 2.5, [9, 7]); D.text(c, 'N', O.x, O.y - 336, { size: 22, col: COL.amber, font: 'mono' });
    D.ray(c, [S, O], COL.cyan, 3.2); D.arrowOn(c, S, O, COL.cyan, 15); D.ray(c, [O, E], COL.magenta, 3.2); D.arrowOn(c, O, E, COL.magenta, 15);
    D.angleArc(c, O, 100, -Math.PI / 2 - a, -Math.PI / 2, COL.cyan, null); D.angleArc(c, O, 100, -Math.PI / 2, -Math.PI / 2 + a, COL.magenta, null);
    D.text(c, 'A', S.x - 18, S.y - 18, { size: 22, col: COL.cyan, font: 'mono' }); D.text(c, 'B', E.x + 18, E.y - 18, { size: 22, col: COL.magenta, font: 'mono' }); D.text(c, 'O', O.x, O.y + 28, { size: 22, col: COL.white, font: 'mono' });
    D.text(c, `∠i = ∠AON = ${deg}°    ∠r = ∠NOB = ${deg}°`, w / 2, 30, { size: 22, col: COL.white, font: 'mono', bg: 'rgba(255,255,255,.9)' });
  },
  converge(c, w, h, t) {
    const halves = [{ type: 'concave', y: h * .27, txt: 'Concave mirror: the reflected rays converge', col: COL.amber }, { type: 'convex', y: h * .75, txt: 'Convex mirror: the reflected rays diverge', col: COL.magenta }];
    for (const hf of halves) {
      const m = { type: hf.type, P: P(640, hf.y), R: 440, a: 110, rot: 0 }, F = OPT.mirrorFocus(m);
      D.line(c, P(0, hf.y), P(w, hf.y), COL.axis, 1.2, [9, 7]);
      for (let k = -3; k <= 3; k++) {
        const r = OPT.traceMirror(m, P(20, hf.y + k * 30), P(1, 0), hf.type === 'concave' ? 520 : 300);
        D.ray(c, r.pts, COL.cyan, 2); D.pulses(c, r.pts, t + k * .05, '#fff', { speed: 200, gap: 150, r: 2.5 });
      }
      D.mirror(c, m);
      D.text(c, hf.txt, w / 2 - 40, hf.y - 135, { size: 20, col: hf.col, bg: 'rgba(255,255,255,.9)' });
    }
    D.line(c, P(0, h / 2 + 10), P(w, h / 2 + 10), COL.line, 2);
  },
  uses(c, w, h, t) {
    const idx = Math.floor(t / 4) % APPS.length, a = APPS[idx], k = Math.min(w / 406, (h - 60) / 336);
    c.save(); c.translate((w - 406 * k) / 2, 0); c.scale(k, k); c.beginPath(); c.rect(0, 0, 406, 336); c.clip(); a.tile(c, 406, 336, t); c.restore();
    D.text(c, a.name + '  ·  ' + a.type + ' mirror', w / 2, h - 28, { size: 24, col: a.type === 'convex' ? COL.magenta : COL.amber, font: 'disp' });
  },
  lens(c, w, h, t) {
    for (const [type, y, txt, col] of [['convex', h * .27, 'Convex lens: thicker in the middle → converges light', COL.amber], ['concave', h * .75, 'Concave lens: thicker at the edges → diverges light', COL.magenta]]) {
      const Lg = lensGeom(type, 380, y, 300, 105);
      D.line(c, P(0, y), P(w, y), COL.axis, 1.2, [9, 7]);
      for (let k = -3; k <= 3; k++) {
        const r = OPT.traceLens(Lg, P(10, y + k * 28), P(1, 0), 1.5, 400);
        D.ray(c, r.pts, COL.cyan, 2); D.pulses(c, r.pts, t + k * .05, '#fff', { speed: 200, gap: 150, r: 2.5 });
      }
      const ol = OPT.lensOutline(Lg); c.save(); D.path(c, ol); c.closePath(); c.fillStyle = 'rgba(120,225,255,.2)'; c.fill(); c.strokeStyle = '#1f8fff'; c.lineWidth = 2.5; c.stroke(); c.restore();
      D.text(c, txt, w / 2, y - 132, { size: 20, col, bg: 'rgba(255,255,255,.9)' });
    }
    D.line(c, P(0, h / 2 + 10), P(w, h / 2 + 10), COL.line, 2);
  },
  lensImages(c, w, h, t) {
    viewDiagram(c, w, h, t, { kind: 'lens', type: 'convex', us: [3, 6, 15, 25, 45], names: ['very close', 'close', 'a little farther', 'far', 'very far'] });
  }
};

function conceptScene(before, cfg) {
  LL.insertBefore(before, {
    id: cfg.id, title: cfg.title, section: cfg.section, full: true,
    build(root) {
      const wrap = el('div', { class: 'concept-wrap' }), left = el('div', { class: 'c-left' }), right = el('div', { class: 'c-right' });
      left.append(el('div', { class: 'c-head' }, el('span', { class: 'kicker' }, cfg.kicker), el('h1', null, cfg.title)));
      const steps = [];
      const narr = [];
      // definitions as cards
      (cfg.defs || []).forEach(d => {
        const card = el('div', { class: 'def bi' + (d.law ? ' law' : '') }, el('div', { class: 'lab' }, d.label || 'DEFINITION'), el('div', { class: 'term' }, d.term), el(d.list ? 'div' : 'p', { html: blanks(d.text) }));
        left.append(card); steps.push([card]); narr.push(d.term + '. ' + d.text.replace(/\[\[|\]\]/g, ''));
      });
      // compact definition list
      if (cfg.deflist) {
        const dl = el('div', { class: 'deflist' }, el('div', { class: 'lab' }, cfg.deflistLabel || 'DEFINITIONS'));
        left.append(dl);
        cfg.deflist.forEach(([term, text], i) => {
          const dt = el('div', { class: 'dt bi' }, term), dd = el('div', { class: 'dd bi', html: blanks(text) });
          dl.append(dt, dd); steps.push(i === 0 ? [dl, dt, dd] : [dt, dd]); narr.push(term + '. ' + text.replace(/\[\[|\]\]/g, ''));
        });
        dl.classList.add('bi');
      }
      (cfg.laws || []).forEach(d => {
        const card = el('div', { class: 'def law bi' }, el('div', { class: 'lab' }, d.label), el('div', { class: 'term' }, d.term), el('p', { html: blanks(d.text) }));
        left.append(card); steps.push([card]); narr.push(d.term + '. ' + d.text.replace(/\[\[|\]\]/g, ''));
      });
      if (cfg.points) {
        const ul = el('ul'), box = el('div', { class: 'kp bi' }, el('h3', null, cfg.pointsLabel || 'IMPORTANT POINTS'), ul);
        left.append(box);
        cfg.points.forEach((p, i) => { const li = el('li', { class: 'bi', html: p }); ul.append(li); steps.push(i === 0 ? [box, li] : [li]); narr.push(p); });
      }
      if (cfg.remember) { const r = el('div', { class: 'remember bi' }, el('h3', null, cfg.rememberLabel || 'REMEMBER'), el('div', { html: cfg.remember })); left.append(r); steps.push([r]); narr.push(cfg.remember); }

      // right: diagram, caption, optional table, build controls
      const cvH = cfg.table ? 392 : 660;
      const o = makeCanvas(760, cvH);
      right.append(el('div', { class: 'cvwrap' }, o.cv));
      if (cfg.caption) right.append(el('div', { class: 'c-cap' }, cfg.caption));
      let rowsEl = [];
      if (cfg.table) {
        const tb = el('tbody');
        rowsEl = cfg.table.rows.map(r => { const tr = el('tr', null, r.map(x => el('td', { html: x }))); tb.append(tr); return tr; });
        right.append(el('div', { class: 'ctable' }, el('h3', null, cfg.table.title), el('table', null, el('thead', null, el('tr', null, cfg.table.cols.map(x => el('th', null, x)))), tb), cfg.table.note ? el('p', { class: 'note', style: 'margin:6px 0 0', html: cfg.table.note }) : null));
      }
      const prog = el('span', { class: 'prog' });
      const bar = el('div', { class: 'build-bar' }, el('span', null, 'Next ▶ reveals the next point'), prog,
        UI.btn('Show all', () => { n = steps.length; apply(); }, 'btn sm'), UI.btn('Start again', () => { n = 1; apply(); }, 'btn sm'));
      right.append(bar);
      wrap.append(left, right); root.append(wrap);
      root._panel = { _narrate: () => cfg.title + '. ' + narr.join('. ') };
      left.addEventListener('click', e => { const b = e.target.closest('.blank'); if (b) b.classList.toggle('shown'); });
      left.addEventListener('keydown', e => { const b = e.target.closest && e.target.closest('.blank'); if (b && (e.key === 'Enter')) b.classList.toggle('shown'); });
      let n = 1, t = 0;
      function apply() {
        steps.forEach((els, i) => els.forEach(x => x.classList.toggle('in', i < n)));
        prog.textContent = `${Math.min(n, steps.length)} / ${steps.length}`;
        const last = left.querySelectorAll('.bi.in'); if (last.length && n > 1) last[last.length - 1].scrollIntoView({ block: 'nearest', behavior: LL.reduced ? 'auto' : 'smooth' });
      }
      apply();
      return {
        advance() { if (n < steps.length) { n++; apply(); return true; } return false; },
        reset() { n = 1; apply(); $$('.blank', left).forEach(b => b.classList.remove('shown')); t = 0; },
        replay() { t = 0; },
        frame(dt) {
          t += dt; o.begin(); D.bg(o);
          const res = DIAGRAMS[cfg.diagram](o.ctx, o.w, o.h, t);
          if (res && rowsEl.length) rowsEl.forEach((tr, i) => tr.classList.toggle('hl', i === res.row));
        }
      };
    }
  });
}

/* ---------------- the concept slides ---------------- */
conceptScene('sphere', {
  id: 'c-reflection', section: 'Mirrors', kicker: 'Concept · Basics', title: 'Light, reflection and images', diagram: 'reflection',
  defs: [
    { term: 'Reflection of light', text: 'When light falls on a surface and [[bounces back]], it is called reflection of light.' },
    { term: 'Mirror', text: 'A polished or smooth surface that forms images by [[reflection]] is called a mirror.' },
    { term: 'Ray of light', text: 'A [[straight line with an arrow]] that shows the path and direction in which light travels.' }
  ],
  points: ['Light travels in a <b>straight line</b>.', 'The picture of an object seen in a mirror is called its <b>image</b>.', 'A mirror need not be flat: the two sides of a shiny steel spoon also act as mirrors.', 'A <b>plane mirror</b> always forms an erect image of the <b>same size</b> as the object.'],
  remember: 'Mirrors <b>reflect</b> light. Lenses (later in the chapter) let light <b>pass through</b> them.',
  caption: 'Reflection of a ray of light from a plane mirror'
});

conceptScene('sphere', {
  id: 'c-spherical', section: 'Mirrors', kicker: '10.1 · Define', title: 'What are spherical mirrors?', diagram: 'spherical',
  defs: [
    { term: 'Spherical mirror', text: 'A mirror whose reflecting surface is [[spherical]], shaped like a part of a hollow sphere, is called a spherical mirror.' },
    { term: 'Concave mirror', text: 'A spherical mirror whose reflecting surface curves [[inwards]] is called a concave mirror.' },
    { term: 'Convex mirror', text: 'A spherical mirror whose reflecting surface curves [[outwards]] (bulges out) is called a convex mirror.' }
  ],
  points: ['The <b>inner</b> side of a shiny spoon acts like a concave mirror: far away, the image is <b>inverted</b>.', 'The <b>outer</b> side of a spoon acts like a convex mirror: the image is <b>erect and smaller</b>.', 'In diagrams, the <b>non-reflecting</b> side is shown <b>shaded</b>.', 'Spherical mirrors are made by grinding and polishing glass, then coating one side, e.g. with aluminium. Outer side coated → concave; inner side coated → convex.', 'Identify them by looking from the <b>side</b> (Activity 10.2) or by looking at your <b>image</b>.'],
  remember: 'Con<b>cave</b> mirror → curved in like a <b>cave</b>. Con<b>vex</b> mirror → bulges out.',
  caption: 'Schematic representation of concave and convex mirrors'
});


conceptScene('plane-lab', {
  id: 'c-plane', section: 'Mirrors', kicker: 'Define · Plane mirror (recap of Grade 7)', title: 'The image in a plane mirror', diagram: 'plane',
  defs: [
    { term: 'Image', text: 'The picture of an object that we [[see in a mirror]] is called its image.' },
    { term: 'Lateral inversion', text: 'The [[left–right]] reversal of an image formed by a mirror. "b" looks like "d".' }
  ],
  pointsLabel: 'THE IMAGE IN A PLANE MIRROR',
  points: ['It is <b>erect</b> (upright).', 'It is of the <b>same size</b> as the object.', 'It is <b>laterally inverted</b>: that is why AMBULANCE is written in mirror writing on the front of an ambulance.', 'Lateral inversion is also seen in concave and convex mirrors.'],
  remember: 'A plane mirror always forms an <b>erect</b> image of the <b>same size</b>. Spherical mirrors, coming next, can make images bigger, smaller or upside down.',
  caption: 'Image in a plane mirror: erect, same size, laterally inverted'
});

conceptScene('mirror-lab', {
  id: 'c-sph-images', section: 'Mirrors', kicker: '10.2 · Define', title: 'Images formed by spherical mirrors', diagram: 'sphImages',
  defs: [
    { term: 'Erect and inverted', text: 'An image that is the same way up as the object is [[erect]] (upright); one that is upside down is [[inverted]].' },
    { term: 'Enlarged and diminished', text: 'An image [[bigger]] than the object is enlarged; an image [[smaller]] than the object is diminished.' }
  ],
  points: ['<b>Concave mirror, object close:</b> image is erect and enlarged.', '<b>Concave mirror, object moved away:</b> image becomes inverted, first enlarged, then smaller and smaller.', '<b>Convex mirror:</b> image is <b>always erect and diminished</b>; it gets slightly smaller as the object moves away.', '<b>Plane mirror:</b> always erect and of the same size.', 'Lateral inversion is seen in <b>all three</b> mirrors.'],
  remember: 'We can identify a mirror from its images: same size → plane; always smaller → convex; large and upright up close, upside down far away → concave.',
  caption: 'A candle moved away from a concave mirror, and what you see in the mirror',
  table: { title: 'WHAT THE IMAGE LOOKS LIKE (ACTIVITY 10.3)', cols: ['Mirror', 'Object', 'Image'], rows: [
    ['Concave', 'Close to the mirror', 'Erect and enlarged'], ['Concave', 'Moved farther away', 'Inverted; first enlarged, then smaller'],
    ['Convex', 'Any distance', 'Always erect and diminished'], ['Plane', 'Any distance', 'Always erect and same size']] }
});

conceptScene('laws', {
  id: 'c-laws', section: 'Reflection', kicker: '10.3 · Define', title: 'The laws of reflection', diagram: 'laws',
  deflist: [
    ['Incident ray', 'The ray of light that [[falls on]] the mirror (AO).'],
    ['Reflected ray', 'The ray of light that [[comes back]] from the mirror (OB).'],
    ['Point of incidence', 'The point O where the incident ray [[strikes]] the mirror.'],
    ['Normal', 'A line drawn at [[90°]] to the mirror at the point of incidence (ON).'],
    ['Angle of incidence (i)', 'The angle between the incident ray and the [[normal]], ∠AON.'],
    ['Angle of reflection (r)', 'The angle between the reflected ray and the [[normal]], ∠NOB.']
  ],
  laws: [
    { label: 'FIRST LAW', term: 'Same plane', text: 'The incident ray, the normal at the point of incidence and the reflected ray all lie in the [[same plane]].' },
    { label: 'SECOND LAW', term: '∠i = ∠r', text: 'The angle of incidence is [[equal]] to the angle of reflection.' }
  ],
  points: ['Angles are measured from the <b>normal</b>, not from the mirror.', 'Light falling along the normal: i = r = <b>0°</b>, and it retraces its path.', 'The laws are true for <b>all</b> mirrors: plane, concave and convex.'],
  caption: 'As ∠i changes, ∠r changes by exactly the same amount'
});

conceptScene('parallel', {
  id: 'c-converge', section: 'Reflection', kicker: '10.3 · Define', title: 'Converging and diverging mirrors', diagram: 'converge',
  defs: [
    { term: 'Converging mirror', text: 'A mirror that brings parallel rays of light [[closer together]] (converges them) after reflection. A <b>concave</b> mirror is a converging mirror.' },
    { term: 'Diverging mirror', text: 'A mirror that [[spreads out]] (diverges) parallel rays after reflection. A <b>convex</b> mirror is a diverging mirror.' },
    { term: 'Solar concentrator', text: 'A device that concentrates [[sunlight]] into a small area using mirrors or lenses.' }
  ],
  points: ['A <b>plane</b> mirror keeps parallel rays parallel.', 'Each ray still obeys the laws of reflection; the <b>curved surface</b> makes the rays converge or diverge.', 'A concave mirror facing the Sun concentrates light into a bright spot that can <b>burn paper</b> (Activity 10.7).', 'Solar concentrators heat liquids to make steam for electricity, cook food on a large scale, and power solar furnaces that can even <b>melt steel</b>.'],
  remember: '<b>Safety first:</b> never look at the Sun or at sunlight reflected by a mirror. Do Activity 10.7 only with a teacher.',
  caption: 'Parallel rays falling on a concave and a convex mirror'
});

conceptScene('mirror-apps', {
  id: 'c-uses', section: 'Reflection', kicker: '10.2 · Key points', title: 'Uses of spherical mirrors', diagram: 'uses',
  defs: [
    { label: 'USES', term: 'Concave mirror', list: true, text: '<ul><li>Reflectors in <b>torches</b> and in <b>headlights</b> of cars and scooters</li><li><b>Dental mirror</b>: an enlarged view of the teeth</li><li><b>Solar furnaces</b> and solar cookers</li><li>Main mirror of <b>reflecting telescopes</b></li></ul>' },
    { label: 'USES', term: 'Convex mirror', list: true, text: '<ul><li><b>Side-view and rear-view mirrors</b> of vehicles</li><li><b>Road-safety mirrors</b> at sharp bends and intersections</li><li><b>Surveillance mirrors</b> in big stores</li></ul>' }
  ],
  points: ['Concave mirrors are chosen where we need an <b>enlarged</b> image or a <b>concentrated</b> beam.', 'Convex mirrors are chosen because they show a much <b>wider area</b> in an erect, diminished image.', 'Because images in a convex mirror are smaller, vehicles look <b>farther away</b> than they are: "Objects in mirror are closer than they appear".'],
  caption: 'Mirrors at work (changes every few seconds)'
});

conceptScene('lens-intro', {
  id: 'c-lens', section: 'Lenses', kicker: '10.4 · Define', title: 'What is a lens?', diagram: 'lens',
  defs: [
    { term: 'Lens', text: 'A piece of [[transparent]] material, usually glass or plastic, which has [[curved]] surfaces.' },
    { term: 'Convex lens', text: 'A lens that is [[thicker at the middle]] than at the edges. It is also called a <b>converging lens</b>.' },
    { term: 'Concave lens', text: 'A lens that is [[thicker at the edges]] than at the middle. It is also called a <b>diverging lens</b>.' }
  ],
  points: ['Unlike mirrors, lenses let light <b>pass through</b>: we see things <b>through</b> a lens, not <b>in</b> it.', 'A curved <b>water drop</b> acts like a simple lens and makes letters look larger (Activity 10.8).', 'A <b>magnifying glass</b> is a convex lens.', 'A flat glass plate does not change the size of objects seen through it.'],
  remember: 'Convex lens → thick middle → converges light. Concave lens → thin middle → diverges light.',
  caption: 'Parallel rays through a convex and a concave lens'
});


conceptScene('lens-lab', {
  id: 'c-lens-images', section: 'Lenses', kicker: '10.4 · Key points', title: 'Images formed by lenses', diagram: 'lensImages',
  defs: [
    { term: 'Converging lens', text: 'A convex lens [[converges]] the light falling on it, so it is called a converging lens.' },
    { term: 'Diverging lens', text: 'A concave lens [[diverges]] the light falling on it, so it is called a diverging lens.' }
  ],
  points: ['<b>Convex lens, object close:</b> it looks erect and enlarged (magnifying glass).', '<b>Convex lens, object farther:</b> it appears inverted, first enlarged, then diminished.', '<b>Concave lens:</b> the object always appears <b>erect and diminished</b>.', 'A convex lens converges sunlight and can burn paper (Activity 10.11).', 'Lenses are used in <b>eyeglasses, cameras, telescopes and microscopes</b>. Our <b>eye</b> has a convex lens that can change its shape.'],
  caption: 'A candle moved away behind a convex lens, and how it looks through the lens',
  table: { title: 'HOW THE OBJECT LOOKS (ACTIVITY 10.9)', cols: ['Lens', 'Object', 'Seen through the lens'], rows: [
    ['Convex', 'Close to the lens', 'Erect and enlarged'], ['Convex', 'Moved farther away', 'Inverted; first enlarged, then diminished'],
    ['Concave', 'Any distance', 'Always erect and diminished'], ['Flat glass', 'Any distance', 'Same size and shape']] }
});

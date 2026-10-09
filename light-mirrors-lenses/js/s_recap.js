'use strict';
/* Scene 13: recap and comparisons. Scene 14: "Keep the curiosity alive" — the NCERT end-of-chapter questions. */

function miniRays(c, w, h, kind) {
  // tiny icon: parallel rays meeting a mirror/lens (exact tracing), used in the recap table
  const Y = h / 2;
  c.fillStyle = '#f6f7fb'; c.fillRect(0, 0, w, h);
  if (!kind.endsWith('-l')) {
    const m = { type: kind, P: P(w - 26, Y), R: 120, a: 30, rot: 0 };
    for (const y of [-20, -10, 0, 10, 20]) { const r = OPT.traceMirror(m, P(6, Y + y), P(1, 0), 120); D.ray(c, r.pts, COL.cyan, 1.4, { glow: false }); }
    D.mirror(c, m, { hatch: false });
  } else {
    const Lg = lensGeom(kind.slice(0, -2), w / 2, Y, 70, 30);
    for (const y of [-20, -10, 0, 10, 20]) { const r = OPT.traceLens(Lg, P(4, Y + y), P(1, 0), 1.5, 120); D.ray(c, r.pts, COL.cyan, 1.4, { glow: false }); }
    const ol = OPT.lensOutline(Lg); c.save(); D.path(c, ol); c.closePath(); c.fillStyle = 'rgba(120,225,255,.25)'; c.fill(); c.strokeStyle = '#a0f0ff'; c.lineWidth = 1.5; c.stroke(); c.restore();
  }
}

LL.add({
  id: 'recap', title: 'Recap: mirrors and lenses compared', section: 'Recap',
  full: true,
  build(root) {
    const wrap = el('div', { class: 'recap-wrap' });
    wrap.append(el('div', { class: 'scene-head' }, el('span', { class: 'kicker' }, 'Scene 13 · Snapshots'), el('h1', null, 'Mirrors reflect, lenses refract')));
    const rows = [
      ['Plane mirror', 'plane', 'Flat reflecting surface', 'Stay parallel', 'Always erect, same size, virtual, laterally inverted', 'Looking glass, dressing mirror, periscope'],
      ['Concave mirror', 'concave', 'Curves inwards', 'Converge (converging mirror)', 'Enlarged, same size or diminished; erect or inverted, depending on distance', 'Torch & headlight reflectors, dentist’s mirror, solar concentrators, telescopes'],
      ['Convex mirror', 'convex', 'Bulges outwards', 'Diverge (diverging mirror)', 'Always erect and diminished', 'Side-view mirrors, road-safety mirrors, shop surveillance mirrors'],
      ['Convex lens', 'convex-l', 'Thicker in the middle', 'Converge (converging lens)', 'Enlarged, same size or diminished; erect or inverted, depending on distance', 'Magnifying glass, camera, microscope, telescope, eye lens'],
      ['Concave lens', 'concave-l', 'Thinner in the middle', 'Diverge (diverging lens)', 'Always erect and diminished', 'Spectacles for short sight']
    ];
    const tb = el('tbody');
    const cvs = [];
    rows.forEach(r => {
      const cv = makeCanvas(150, 70); cvs.push([cv, r[1]]);
      tb.append(el('tr', null, el('th', null, r[0]), el('td', null, cv.cv), el('td', null, r[2]), el('td', null, r[3]), el('td', null, r[4]), el('td', null, r[5])));
    });
    wrap.append(el('table', { class: 'big-table' }, el('thead', null, el('tr', null, ['', 'Parallel light', 'Shape', 'Parallel rays', 'Image', 'Used in'].map(h => el('th', null, h)))), tb));
    const cards = el('div', { class: 'recap-cards' },
      UI.card('experiment', 'Two laws of reflection', null, el('p', { html: '1. <b>∠i = ∠r</b>: the angle of incidence equals the angle of reflection.<br>2. The incident ray, the normal at the point of incidence and the reflected ray all lie in the <b>same plane</b>.<br>They hold for plane, concave and convex mirrors.' })),
      UI.card('observe', 'Real or virtual?', null, el('p', { html: '<b>Real</b> images form where light rays actually meet; they can be caught on a screen and are inverted. <b>Virtual</b> images form where rays only seem to come from; they cannot be caught on a screen.' })),
      UI.card('predict', 'Identify the mirror', null, el('p', { html: 'Look at your image: same size every time → <b>plane</b>. Always smaller → <b>convex</b>. Large up close, upside down far away → <b>concave</b>. Or look at it from the side (Activity 10.2).' })),
      UI.card('explain', 'Our scientific heritage', null, el('p', { html: 'More than 800 years ago, in the time of <b>Bhāskara II</b>, astronomers watched the reflections of stars and planets in shallow bowls of water through tubes set at the right angles, and measured their positions in the sky.' }))
    );
    wrap.append(cards);
    root.append(wrap);
    root._panel = { _narrate: () => 'Mirrors reflect light; lenses refract it. Concave mirrors and convex lenses converge parallel light; convex mirrors and concave lenses diverge it. The angle of incidence equals the angle of reflection, and the incident ray, the normal and the reflected ray lie in the same plane.' };
    return { frame() { for (const [cv, k] of cvs) { cv.begin(); miniRays(cv.ctx, cv.w, cv.h, k); } } };
  }
});

/* ---------- end-of-chapter questions ---------- */
function drawCap(c, x, y, s, flip = 1) {
  c.save(); c.translate(x, y); c.scale(s, s * flip);
  c.fillStyle = '#2f6fd6'; D.rrect(c, -14, -40, 28, 70, 8); c.fill();
  c.fillStyle = '#1b3f86'; c.fillRect(-14, 18, 28, 12);
  c.fillStyle = '#e8eef9'; c.fillRect(10, -34, 6, 44);
  c.fillStyle = '#ffffff'; c.globalAlpha = .4; c.fillRect(-9, -34, 5, 46);
  c.restore();
}
function drawGrid(c, x, y, r, k, bulge) {
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip();
  c.fillStyle = '#f4f6f0'; c.fillRect(x - r, y - r, 2 * r, 2 * r);
  c.strokeStyle = '#5aa06a'; c.lineWidth = 1.2;
  for (let i = -12; i <= 12; i++) for (const vert of [true, false]) {
    c.beginPath();
    for (let j = -30; j <= 30; j++) {
      let gx = i * 12 * k, gy = j * 6 * k; if (!vert) [gx, gy] = [gy, gx];
      const d = Math.hypot(gx, gy) / r, f = bulge ? 1 / (1 + bulge * d * d) : 1;
      const px = x + gx * f, py = y + gy * f; j === -30 ? c.moveTo(px, py) : c.lineTo(px, py);
    }
    c.stroke();
  }
  c.restore(); c.strokeStyle = '#9fb3d9'; c.lineWidth = 5; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
}

LL.add({
  id: 'quiz', title: 'Keep the curiosity alive: chapter questions', section: 'Recap',
  full: true,
  build(root) {
    const wrap = el('div', { class: 'recap-wrap' });
    const score = el('span', { class: 'score' });
    wrap.append(el('div', { class: 'scene-head', style: 'justify-content:space-between' }, el('div', { style: 'display:flex;gap:16px;align-items:baseline' }, el('span', { class: 'kicker' }, 'Scene 14 · NCERT exercises'), el('h1', null, 'Keep the curiosity alive')), score));
    const grid = el('div', { class: 'quiz-grid' }); wrap.append(grid); root.append(wrap);
    let right = 0, tried = 0, total = 0;
    const upd = () => { score.textContent = `Score: ${right} / ${total}  (attempted ${tried})`; };
    const resets = [], statics = [];
    function mcq(no, q, opts, ans, why, fig) {
      total++;
      const box = el('div', { class: 'opts' }), fb = el('div', { class: 'ans', hidden: true, html: why });
      let done = false;
      opts.forEach((t, i) => {
        const b = el('button', { type: 'button', class: 'opt', html: t });
        b.addEventListener('click', () => {
          $$('.opt', box).forEach(x => x.classList.remove('right', 'wrong'));
          b.classList.add(i === ans ? 'right' : 'wrong'); box.children[ans].classList.add('right'); fb.hidden = false;
          if (!done) { done = true; tried++; if (i === ans) right++; upd(); }
        });
        box.append(b);
      });
      resets.push(() => { done = false; fb.hidden = true; $$('.opt', box).forEach(x => x.classList.remove('right', 'wrong')); });
      grid.append(UI.card('predict', 'Question ' + no, null, el('div', { class: 'q', html: q }), fig || null, box, fb));
    }
    function short(no, q, ansHtml, fig) {
      const a = el('div', { class: 'ans', hidden: true, html: ansHtml });
      resets.push(() => { a.hidden = true; });
      grid.append(UI.card('experiment', 'Question ' + no, null, el('div', { class: 'q', html: q }), fig || null, UI.btn('Show answer', () => { a.hidden = false; }, 'btn sm'), a));
    }
    function match(no, q, draws, choices, answers) {
      total++;
      const row = el('div', { style: 'display:flex;gap:12px;margin:8px 0' });
      const sels = draws.map((d, i) => {
        const cv = makeCanvas(150, 150);
        statics.push(() => { cv.begin(); cv.ctx.fillStyle = '#f2f4f9'; cv.ctx.fillRect(0, 0, 150, 150); d(cv.ctx); });
        const s = el('select', { id: `ll-quiz-${no}-${i}`, },
          el('option', { value: '' }, 'Choose…'), choices.map(cn => el('option', { value: cn }, cn)));
        row.append(el('div', { style: 'display:flex;flex-direction:column;gap:6px;align-items:center' }, el('div', { class: 'cvwrap' }, cv.cv), el('b', { style: 'font-size:18px' }, '(' + ['i', 'ii', 'iii'][i] + ')'), s));
        return { s, cv };
      });
      const fb = el('div', { class: 'ans', hidden: true });
      let done = false;
      const chk = UI.btn('Check', () => {
        let ok = 0; sels.forEach(({ s }, i) => { const g = s.value === answers[i]; s.style.borderColor = g ? '#63f2a8' : '#ff6b7a'; ok += g; });
        fb.hidden = false; fb.innerHTML = ok === 3 ? 'All correct!' : `${ok} of 3 correct. Answer: ` + answers.map((a, i) => `(${['i', 'ii', 'iii'][i]}) ${a}`).join(', ');
        if (!done) { done = true; tried++; if (ok === 3) right++; upd(); }
      }, 'btn sm');
      resets.push(() => { done = false; fb.hidden = true; sels.forEach(({ s }) => { s.value = ''; s.style.borderColor = ''; }); });
      grid.append(UI.card('predict', 'Question ' + no, null, el('div', { class: 'q', html: q }), row, chk, fb));
      return sels;
    }
    mcq(1, 'A light ray strikes a mirror. The incident ray makes 40° with the <b>normal</b>. What angle does the reflected ray make with the <b>mirror</b>?', ['40°', '50°', '45°', '60°'], 1, 'Angle of reflection = 40° (from the normal). The normal is at 90° to the mirror, so the reflected ray makes 90° − 40° = <b>50°</b> with the mirror surface.');
    short(2, 'A ray falls on a mirror (i) along the normal; (ii) along the normal of a tilted mirror; (iii) at 20° from the normal of a tilted mirror. What is the angle of reflection in each case?', '(i) <b>0°</b>: the ray goes back along the normal. (ii) <b>0°</b>: tilting the mirror tilts its normal too; the ray still retraces its path. (iii) <b>20°</b>, on the other side of the normal. Try it on the Scene 4 bench.');
    const capAt = (s, flip) => c => drawCap(c, 75, 75, s, flip);
    match(3, 'The cap of a sketch pen is placed in front of three mirrors. Match each image with the mirror.', [capAt(.75, 1), capAt(1.5, 1), capAt(1, 1)], ['Plane mirror', 'Convex mirror', 'Concave mirror'], ['Convex mirror', 'Concave mirror', 'Plane mirror']);
    match(4, 'The cap is placed behind a convex lens, a concave lens and a flat glass piece, all at the same distance. Match each view.', [capAt(1, 1), capAt(.6, 1), capAt(1.6, 1)], ['Flat transparent glass', 'Convex lens', 'Concave lens'], ['Flat transparent glass', 'Concave lens', 'Convex lens']);
    mcq(5, 'Light falls on a mirror along the normal. Which statement is true?', ['Angle of incidence is 90°', 'Angle of incidence is 0°', 'Angle of reflection is 90°', 'No reflection takes place'], 1, 'Angles are measured from the normal, so a ray along the normal has <b>i = 0°</b> and r = 0°. It is reflected straight back.');
    match(6, 'A graph sheet seen in three mirrors. Identify each mirror.', [c => drawGrid(c, 75, 75, 66, 1, 0), c => drawGrid(c, 75, 75, 66, .55, 1.4), c => drawGrid(c, 75, 75, 66, 1.9, 0)], ['Plane', 'Concave', 'Convex'], ['Plane', 'Convex', 'Concave']);
    mcq(7, 'In a museum, a woman walks <b>towards</b> a large concave mirror. She will see that:', ['her erect image keeps decreasing in size', 'her inverted image keeps decreasing in size', 'her inverted image keeps increasing in size and eventually becomes erect and magnified', 'her erect image keeps increasing in size'], 2, 'Far away the image is inverted and small; as she approaches F it grows; inside F it becomes erect and enlarged. Check it in the mirror lab.');
    short(8, 'Hold a magnifying glass over text. At what distance do the letters look bigger? Move it away: what do you notice? Which lens is a magnifying glass?', 'Close to the text (nearer than its focus) the letters look <b>bigger and upright</b>. Moving it away, they grow, blur, and then appear <b>upside down</b> and smaller. A magnifying glass is a <b>convex lens</b>. Try it in Scene 8.');
    mcq(9, 'Match: (i) concave mirror, (ii) convex mirror, (iii) convex lens, (iv) concave lens with — (a) reflecting surface curves inwards, (b) image always erect and diminished, (c) object behind it may appear inverted at some distance, (d) object behind it always appears diminished.', ['i–a, ii–b, iii–c, iv–d', 'i–b, ii–a, iii–d, iv–c', 'i–c, ii–b, iii–a, iv–d', 'i–a, ii–d, iii–b, iv–c'], 0, '<b>i–a, ii–b, iii–c, iv–d.</b>');
    mcq(10, '<b>Assertion:</b> Convex mirrors are preferred for observing the traffic behind us. <b>Reason:</b> Convex mirrors provide a significantly larger view area than plane mirrors.', ['Both correct, and the Reason explains the Assertion', 'Both correct, but the Reason does not explain the Assertion', 'Assertion correct, Reason incorrect', 'Both incorrect'], 0, 'Both are correct, and the wider field of view is exactly why convex mirrors are used (see the field-of-view diagram in Scene 7).');
    const fig11 = makeCanvas(520, 130);
    statics.push(function () {
      const c = fig11.ctx; fig11.begin(); c.fillStyle = '#f6f7fb'; c.fillRect(0, 0, 520, 130);
      const rowF = (y, mi, lab) => { D.text(c, lab, 14, y, { size: 18, col: COL.muted, align: 'left' }); D.arrowObj(c, 70, y + 22, 34, COL.amber, { w: 4 }); D.line(c, P(260, y - 22), P(260, y + 26), '#dfe8ff', 4); D.arrowObj(c, mi, y + 22, (mi === 450 ? 34 : 14), COL.magenta, { dashed: true, w: 3 }); D.text(c, 'O', 70, y + 34, { size: 15, col: COL.amber }); D.text(c, 'M', 260, y + 36, { size: 15, col: COL.white }); D.text(c, 'I', mi, y + 34, { size: 15, col: COL.magenta }); };
      rowF(28, 450, '(a)'); rowF(92, 320, '(b)');
    });
    mcq(11, 'O = object, M = mirror, I = image. Which statement is true?', ['(a) plane, (b) concave', '(a) convex, (b) concave', '(a) concave, (b) convex', '(a) plane, (b) convex'], 3, 'In (a) the image is the same size and as far behind as the object is in front: <b>plane</b>. In (b) it is smaller and closer behind the mirror: <b>convex</b>.', el('div', { class: 'cvwrap', style: 'margin-bottom:8px' }, fig11.cv));
    short(12, 'Place a pencil behind a glass tumbler, then fill it halfway with water. How does the pencil look through the water? Why?', 'Through the water the pencil looks <b>broken or shifted</b>, and <b>wider</b>. The curved water-filled glass acts like a convex lens, and light <b>refracts</b> (bends) as it passes from water and glass into air (Scene 9).');
    short('★', '<b>Probe and ponder:</b> Why is there a curved line on some reading glasses?', 'Those are <b>bifocal</b> glasses: two lenses of different strength joined together. The upper part helps to see far away, the lower part to read up close. The curved line is where the two parts meet.');
    upd();
    return {
      reset() { right = 0; tried = 0; resets.forEach(f => f()); upd(); },
      frame() { statics.forEach(f => f()); }
    };
  }
});

'use strict';
/* Opening sequence and Scene 1: The mystery of mirrors */

function starField(n, w, h, seed = 7) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, () => ({ x: rnd() * w, y: rnd() * h, r: rnd() * 1.4 + .3, a: rnd() * .6 + .2, p: rnd() * 6 }));
}

LL.add({
  id: 'start', title: 'Light: Mirrors and Lenses', section: null, full: true, opening: true,
  build(root) {
    const o = makeCanvas(1920, 1080);
    o.cv.classList.add('opening-cv');
    const copy = el('div', { class: 'opening-copy' },
      el('div', { class: 'eyebrow fade', style: 'animation-delay:.1s' }, 'CLASS 8 SCIENCE · CHAPTER 10'),
      el('h1', { class: 'fade', style: 'animation-delay:.35s' }, 'Light:', el('span', null, 'Mirrors'), el('em', null, '& Lenses')),
      el('p', { class: 'fade', style: 'animation-delay:.7s' }, 'Light travels in straight lines. When it meets a mirror, it bounces back. When it passes through glass or water, it can bend.'),
      el('p', { class: 'fade', style: 'animation-delay:.9s' }, 'In this lab you will predict, experiment, observe and explain how mirrors and lenses form images.'),
      el('div', { class: 'topics fade', style: 'animation-delay:1.1s' }, ['Plane mirrors', 'Concave & convex mirrors', 'Laws of reflection', 'Lenses', 'Refraction'].map(t => el('span', null, t))),
      el('div', { class: 'cta fade', style: 'animation-delay:1.3s' },
        UI.btn('Begin the lab  ▶', () => LL.go(1), 'big-btn'),
        UI.btn('How to use', () => { $('#help').hidden = false; }, 'big-btn ghost'))
    );
    root.append(o.cv, copy);

    const stars = starField(220, 1920, 1080);
    const mir = { type: 'concave', P: P(1810, 340), R: 620, a: 175, rot: 0 };
    const lensG = { type: 'convex', X: 1430, Y: 790, R: 420, a: 135, tc: 0 };
    lensG.tc = 2 * (lensG.R - Math.sqrt(lensG.R ** 2 - lensG.a ** 2)) + 10;
    const beamM = [], beamL = [];
    for (let k = -5; k <= 5; k++) {
      const r = OPT.traceMirror(mir, P(1000, 340 + k * 26), P(1, 0), 520);
      beamM.push(r.pts);
      const t = OPT.traceLens(lensG, P(1000, 790 + k * 22), P(1, 0), 1.5, 560);
      beamL.push(t.pts);
    }
    const fM = OPT.mirrorFocus(mir), fLx = OPT.lensFocusX(lensG);
    let tt = 0;
    return {
      replay() { tt = 0; },
      reset() { tt = 0; },
      frame(dt, now) {
        tt += dt; const T = tt % 11;
        const c = o.ctx; o.begin(); D.bg(o, { grid: false, top: '#0b1840', bot: '#03060f' });
        for (const s of stars) { c.globalAlpha = s.a * (.6 + .4 * Math.sin(now * 1.3 + s.p)); c.fillStyle = '#cfe3ff'; c.fillRect(s.x, s.y, s.r, s.r); }
        c.globalAlpha = 1;
        const fade = T > 10 ? 1 - (T - 10) : 1;
        const p1 = clamp((T - .4) / 2.6, 0, 1), p2 = clamp((T - 3.4) / 2.6, 0, 1);
        // soft spotlight panels
        c.fillStyle = 'rgba(63,230,255,.035)'; D.rrect(c, 960, 140, 920, 380, 30); c.fill(); D.rrect(c, 960, 590, 920, 400, 30); c.fill();
        D.text(c, 'REFLECTION', 990, 166, { size: 20, col: COL.amber, align: 'left', font: 'mono', alpha: fade });
        D.text(c, 'a concave mirror brings parallel light together', 990, 192, { size: 19, col: COL.muted, align: 'left', weight: 400, alpha: fade });
        D.text(c, 'REFRACTION', 990, 625, { size: 20, col: COL.amber, align: 'left', font: 'mono', alpha: fade });
        D.text(c, 'a convex lens bends parallel light together', 990, 655, { size: 19, col: COL.muted, align: 'left', weight: 400, alpha: fade });
        D.axis(c, 340, 990, 1860, null); D.axis(c, 790, 990, 1860, null);
        for (const pts of beamM) { const L = D.polyLen(pts); D.ray(c, D.upTo(pts, L * p1), COL.cyan, 2.2, { alpha: fade * .9 }); }
        for (const pts of beamL) { const L = D.polyLen(pts); D.ray(c, D.upTo(pts, L * p2), COL.cyan, 2.2, { alpha: fade * .9 }); }
        D.mirror(c, mir);
        const LG = OPT.lensOutline(lensG); c.save(); D.path(c, LG); c.closePath(); c.fillStyle = 'rgba(120,230,255,.18)'; c.fill(); c.strokeStyle = 'rgba(160,240,255,.9)'; c.lineWidth = 2.5; c.stroke(); c.restore();
        if (p1 >= 1) { const g = .6 + .4 * Math.sin(now * 4); D.dot(c, fM.x, fM.y, 7 + g * 4, COL.amber); D.text(c, 'F', fM.x, fM.y + 34, { size: 22, col: COL.amber, font: 'mono', alpha: fade }); }
        if (p2 >= 1 && fLx) { const g = .6 + .4 * Math.sin(now * 4 + 1); D.dot(c, fLx, 790, 7 + g * 4, COL.amber); D.text(c, 'F', fLx, 824, { size: 22, col: COL.amber, font: 'mono', alpha: fade }); }
        if (p1 >= 1) for (const pts of beamM) D.pulses(c, pts, now, COL.white, { speed: 300, gap: 160, r: 3 });
        if (p2 >= 1) for (const pts of beamL) D.pulses(c, pts, now, COL.white, { speed: 300, gap: 160, r: 3 });
      }
    };
  }
});

/* ---------- face used in the mystery mirrors ---------- */
function drawStudent(c, size, t) {
  // drawn centred on (0,0); size ≈ total height. Asymmetric details (parting, badge) reveal lateral inversion.
  const s = size / 300;
  c.save(); c.scale(s, s);
  // shoulders / uniform
  c.fillStyle = '#e8eef9'; c.beginPath(); c.moveTo(-120, 150); c.quadraticCurveTo(-110, 70, -40, 62); c.lineTo(40, 62); c.quadraticCurveTo(110, 70, 120, 150); c.closePath(); c.fill();
  c.fillStyle = '#1f3c88'; c.beginPath(); c.moveTo(-8, 66); c.lineTo(8, 66); c.lineTo(14, 140); c.lineTo(0, 150); c.lineTo(-14, 140); c.closePath(); c.fill();
  c.fillStyle = '#ffb84d'; D.rrect(c, 46, 92, 36, 22, 4); c.fill();                       // name badge (on student's left)
  // neck & face
  c.fillStyle = '#c98c5e'; c.fillRect(-18, 36, 36, 30);
  c.fillStyle = '#d99a6c'; c.beginPath(); c.ellipse(0, -10, 62, 74, 0, 0, Math.PI * 2); c.fill();
  // hair with side parting
  c.fillStyle = '#20140c'; c.beginPath(); c.moveTo(-64, -12); c.quadraticCurveTo(-70, -92, 0, -90); c.quadraticCurveTo(70, -92, 64, -14);
  c.quadraticCurveTo(50, -60, 10, -56); c.lineTo(-22, -70); c.quadraticCurveTo(-48, -50, -64, -12); c.fill();
  // ears
  c.fillStyle = '#c98c5e'; c.beginPath(); c.ellipse(-62, -4, 9, 16, 0, 0, Math.PI * 2); c.ellipse(62, -4, 9, 16, 0, 0, Math.PI * 2); c.fill();
  // eyes (blink)
  const bl = (t % 4) < .12 ? .15 : 1;
  c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-24, -14, 12, 8 * bl, 0, 0, Math.PI * 2); c.ellipse(24, -14, 12, 8 * bl, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#2b1a10'; c.beginPath(); c.arc(-24, -14, 5 * bl, 0, Math.PI * 2); c.arc(24, -14, 5 * bl, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#20140c'; c.lineWidth = 4; c.beginPath(); c.moveTo(-36, -32); c.quadraticCurveTo(-24, -40, -12, -32); c.moveTo(12, -32); c.quadraticCurveTo(24, -40, 36, -32); c.stroke();
  c.strokeStyle = '#a8603c'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(-6, 12, 2, 14); c.stroke();
  c.strokeStyle = '#7a2a22'; c.lineWidth = 4; c.beginPath(); c.moveTo(-20, 30); c.quadraticCurveTo(0, 44, 22, 28); c.stroke();
  c.restore();
}

LL.add({
  id: 'mystery', title: 'The mystery of mirrors', section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 1 · Activity 10.1', title: 'Meena\u2019s mystery at the science centre' });
    const o = L.cv;
    const mirrors = [
      { type: 'plane', name: 'Plane mirror', x: 215, target: ['plane-lab', {}] },
      { type: 'concave', name: 'Concave mirror', sub: 'inner side of a spoon', x: 630, target: ['mirror-lab', { type: 'concave' }] },
      { type: 'convex', name: 'Convex mirror', sub: 'back of a spoon', x: 1045, target: ['mirror-lab', { type: 'convex' }] }
    ];
    const F = 20;
    let dcm = 10, t = 0;
    const sl = UI.slider('Distance of the face from each mirror', 4, 60, 1, dcm, v => v + ' cm', v => { dcm = v; });
    L.controls.append(sl.el, el('div', { class: 'break' }));
    mirrors.forEach(m => L.controls.append(UI.btn('Open the ' + m.name.toLowerCase() + ' lab ▶', () => LL.goId(...m.target), 'btn')));

    L.setPanel(UI.panel({
      predict: { q: 'At a science centre, Meena looks into a row of curved mirrors. In one, her face looks very large, while her brother, standing farther away, looks <b>upside down</b>. In another she sees a tiny version of herself. Which mirror can show a face upside down?',
        opts: ['A plane mirror', 'A mirror curved inwards, like the inside of a spoon (concave)', 'A mirror bulging outwards, like the back of a spoon (convex)', 'None of them'], ans: 1,
        why: 'Hold a shiny spoon at arm’s length and look into its inner side: your face is upside down. Bring it close and the face turns upright and large.' },
      experiment: ['Drag the slider to move the face closer to or farther from all three mirrors.', 'Watch the <b>size</b> and the <b>orientation</b> of each image.', 'Look at the yellow badge: which side of the image is it on?', 'Click a mirror to open its own lab.'],
      observe: ['<b>Plane:</b> always upright and the same size as the face.', '<b>Concave:</b> close up, the image is upright and <b>bigger</b>. Farther away it flips <b>upside down</b>, and its size keeps changing.', '<b>Convex:</b> always upright and <b>smaller</b>, at every distance.', 'In every mirror the badge appears on the other side: left and right are swapped.'],
      explain: '<p>The surface decides where the reflected light goes. A flat mirror sends light back without bringing it together or spreading it out. A mirror curved <b>inwards</b> (concave) brings light together, and one curved <b>outwards</b> (convex) spreads it apart.</p><p>The next scenes measure this with light rays and the laws of reflection.</p>'
    }));

    o.cv.addEventListener('click', e => {
      const p = o.pt(e);
      const m = mirrors.find(m => Math.abs(p.x - m.x) < 180 && p.y > 30 && p.y < 480);
      if (m) LL.goId(...m.target);
    });
    o.cv.addEventListener('pointermove', e => { const p = o.pt(e); o.cv.style.cursor = mirrors.some(m => Math.abs(p.x - m.x) < 180 && p.y > 30 && p.y < 480) ? 'pointer' : 'default'; });

    function mag(type, d) {
      if (type === 'plane') return { m: 1 };
      const r = OPT.mirrorImage(-d, type === 'concave' ? -F : F);
      return r.inf ? { m: Infinity, inf: true } : { m: r.m };
    }
    return {
      reset() { dcm = 10; sl.set(10); },
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o, { grid: false });
        for (const m of mirrors) {
          const cx = m.x, cy = 245, fw = 340, fh = 430;
          const r = mag(m.type, dcm);
          // frame
          const framePath = () => { if (m.type === 'plane') D.rrect(c, cx - fw / 2, cy - fh / 2, fw, fh, 18); else { c.beginPath(); c.ellipse(cx, cy, fw / 2, fh / 2, 0, 0, Math.PI * 2); } };
          c.save();
          framePath();
          const g = c.createLinearGradient(cx - fw / 2, cy - fh / 2, cx + fw / 2, cy + fh / 2);
          g.addColorStop(0, '#26355e'); g.addColorStop(.5, '#3b4f80'); g.addColorStop(1, '#1b2747');
          c.fillStyle = g; c.fill(); c.save(); c.clip();
          // reflection
          c.translate(cx, cy + 20);
          let am = r.inf ? 3.4 : Math.abs(r.m), blur = 0;
          if (am > 3) { blur = Math.min(14, (am - 3) * 4 + 4); am = 3.2; }
          if (r.inf) blur = 16;
          const base = 230;
          const sx = (r.m > 0 ? -1 : 1) * am, sy = (r.m > 0 ? 1 : -1) * am;   // virtual: left-right swapped; real inverted: turned 180°
          if (blur && 'filter' in c) c.filter = `blur(${blur}px)`;
          c.scale(sx, sy); drawStudent(c, base, now);
          c.restore();
          framePath();             // the face drawing replaced the current path, so rebuild the frame outline
          // gloss
          const gl = c.createLinearGradient(cx - fw / 2, cy - fh / 2, cx + fw / 3, cy + fh / 3);
          gl.addColorStop(0, 'rgba(255,255,255,.22)'); gl.addColorStop(.35, 'rgba(255,255,255,0)');
          c.fillStyle = gl; c.fill();
          c.lineWidth = 10; c.strokeStyle = m.type === 'plane' ? '#9fb3d9' : m.type === 'concave' ? COL.amber : COL.magenta; c.stroke();
          if (m.type === 'convex') { c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 3; c.beginPath(); c.ellipse(cx - 30, cy - 50, fw * .3, fh * .3, -.5, Math.PI * 1.05, Math.PI * 1.5); c.stroke(); }
          c.restore();
          // caption
          D.text(c, m.name, cx, 500, { size: 26, col: COL.white, font: 'disp', weight: 700 });
          if (m.sub) D.text(c, '(' + m.sub + ')', cx, 530, { size: 18, col: COL.muted, weight: 400 });
          let cap;
          if (r.inf) cap = 'Too large and blurred to see';
          else { const a = Math.abs(r.m); cap = (r.m > 0 ? 'Upright' : 'Upside down') + ' · ' + (a > 1.03 ? 'larger' : a < .97 ? 'smaller' : 'same size') + '  (×' + a.toFixed(a >= 10 ? 0 : 2) + ')'; }
          D.text(c, cap, cx, 566, { size: 21, col: r.inf ? COL.amber : r.m > 0 ? COL.cyan : COL.magenta, bg: 'rgba(4,8,23,.8)' });
          // the student seen from behind, nearer = bigger
          const hs = clamp(110 - dcm * 1.2, 36, 110), hy = 700 - hs * .55;
          c.save(); c.translate(cx, hy);
          c.fillStyle = '#152349'; c.beginPath(); c.ellipse(0, hs * .7, hs * .95, hs * .45, 0, Math.PI, 0); c.fill();
          c.fillStyle = '#20140c'; c.beginPath(); c.ellipse(0, 0, hs * .42, hs * .5, 0, 0, Math.PI * 2); c.fill();
          c.restore();
        }
        D.text(c, 'Distance: ' + dcm + ' cm', 1240, 640, { size: 20, col: COL.amber, align: 'right', font: 'mono', bg: 'rgba(4,8,23,.75)' });
        D.text(c, 'Model: f = 20 cm for the curved mirrors · click a mirror to investigate it', 20, 16, { size: 16, col: COL.muted, align: 'left', weight: 400 });
      }
    };
  }
});

'use strict';
/* Scene 4: Laws of reflection — optical bench (second law) and 3D paper activity (first law) */

LL.add({
  id: 'laws', title: 'Second law of reflection: optical bench', section: 'Reflection',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 4 · Activity 10.4 · Table 10.1', title: 'Angle of incidence vs angle of reflection' });
    const o = L.cv, O = P(630, 560), RS = 430, PR = 300;
    let iDeg = 35, proto = true, noisy = false, labels = true, t = 0;
    const rows = [];
    const sI = UI.slider('Angle of incidence', 0, 85, 1, iDeg, v => v + '°', v => { iDeg = v; });
    const pre = el('div', { class: 'ctl' }, el('span', { class: 'lbl' }, 'Set'));
    [0, 15, 30, 45, 60, 75].forEach(a => pre.append(UI.btn(a + '°', () => { iDeg = a; sI.set(a); record(); }, 'btn sm')));
    const tP = UI.toggle('Protractor', proto, v => { proto = v; }, COL.cyan);
    const tN = UI.toggle('Real protractor reading (±1°)', noisy, v => { noisy = v; }, COL.amber);
    const tL = UI.toggle('Labels', labels, v => { labels = v; });
    L.controls.append(sI.el, pre, el('div', { class: 'break' }), UI.btn('Record reading', () => record(), 'btn go'), UI.btn('Clear table', () => { rows.length = 0; renderTable(); }, 'btn'), tP.el, tN.el, tL.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag the torch around the protractor'));

    const tbody = el('tbody');
    const table = el('table', { class: 'mini-table' }, el('thead', null, el('tr', null, el('th', null, 'Trial'), el('th', null, '∠i chosen'), el('th', null, '∠r measured'), el('th', null, 'Difference'))), tbody);
    const liveRow = el('p', { class: 'q', style: 'margin:0 0 8px' });
    function record() {
      const r = noisy ? iDeg + Math.round((Math.random() * 2 - 1)) : iDeg;
      rows.push([iDeg, clamp(r, 0, 90)]); if (rows.length > 7) rows.shift(); renderTable();
    }
    function renderTable() {
      tbody.innerHTML = '';
      if (!rows.length) tbody.append(el('tr', null, el('td', { colspan: 4, class: 'note' }, 'Press "Record reading" or a preset angle.')));
      rows.forEach(([i, r], k) => tbody.append(el('tr', null, el('td', null, String(k + 1)), el('td', { class: 'num' }, i + '°'), el('td', { class: 'num' }, r + '°'), el('td', { class: 'num' }, (r - i === 0 ? '0' : (r - i > 0 ? '+' : '') + (r - i)) + '°'))));
    }
    renderTable();
    const terms = UI.card('explain', 'Terms', null, el('ul', null,
      el('li', { html: '<b>Incident ray (AO):</b> the ray of light that falls on the surface.' }),
      el('li', { html: '<b>Reflected ray (OB):</b> the ray that comes back from the surface.' }),
      el('li', { html: '<b>Point of incidence (O):</b> where the incident ray strikes the mirror.' }),
      el('li', { html: '<b>Normal (ON):</b> the line perpendicular (at 90°) to the surface at O.' }),
      el('li', { html: '<b>Angle of incidence ∠i = ∠AON</b> and <b>angle of reflection ∠r = ∠NOB</b>, both measured from the normal.' })));
    L.setPanel(UI.panel({
      predict: { q: 'The angle of incidence increases from 30° to 50°. What happens to the angle of reflection?', opts: ['It also increases, to exactly 50°', 'It decreases', 'It stays at 30°', 'It becomes 90° − 50° = 40°'], ans: 0, why: 'The reflected ray always makes the same angle with the normal as the incident ray.' },
      experiment: ['Drag the torch or move the slider.', 'Click the preset angles; each one is recorded in the table.', 'Try <b>0°</b>: shine the torch straight down the normal.', 'Turn on <b>Real protractor reading</b> to see small measuring errors.'],
      live: UI.card('live', 'Observation table', null, liveRow, table),
      observe: ['∠r always equals ∠i, for every angle.', 'At 0° the light comes straight back along the normal: it <b>retraces its path</b>.', 'With a real protractor, readings can differ by about 1°. That is a measuring error, not a failure of the law.'],
      explain: '<p><b>Second law of reflection:</b> the angle of incidence is equal to the angle of reflection, <b>∠i = ∠r</b>.</p><p>Angles are measured from the <b>normal</b>, not from the mirror surface. The laws of reflection hold for every reflecting surface, plane or curved.</p>',
      extra: [terms]
    }));

    dragOn(o, {
      hit: p => { const S = src(); return V.dist(p, S) < 60 ? 'src' : null; },
      move: (h, p) => { iDeg = clamp(Math.round(Math.atan2(O.x - p.x, O.y - p.y) / DEG), 0, 85); sI.set(iDeg); }
    });
    function src() { const a = iDeg * DEG; return P(O.x - Math.sin(a) * RS, O.y - Math.cos(a) * RS); }
    function torch(c, S, a) {
      c.save(); c.translate(S.x, S.y); c.rotate(Math.atan2(O.y - S.y, O.x - S.x));
      const g = c.createLinearGradient(0, -18, 0, 18); g.addColorStop(0, '#5a6b95'); g.addColorStop(.5, '#c9d4f0'); g.addColorStop(1, '#4a5a85');
      c.fillStyle = g; D.rrect(c, -78, -15, 70, 30, 6); c.fill();
      c.fillStyle = '#8fa0c8'; c.beginPath(); c.moveTo(-8, -15); c.lineTo(14, -24); c.lineTo(14, 24); c.lineTo(-8, 15); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,250,210,.95)'; c.fillRect(12, -22, 4, 44);
      c.restore(); void a;
    }
    return {
      reset() { iDeg = 35; sI.set(35); proto = true; tP.set(true); noisy = false; tN.set(false); labels = true; tL.set(true); rows.length = 0; renderTable(); },
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o);
        const a = iDeg * DEG, S = src(), E = P(O.x + Math.sin(a) * RS, O.y - Math.cos(a) * RS), N = P(O.x, O.y - 400);
        // mirror (reflecting side up)
        c.save(); c.fillStyle = 'rgba(2,4,12,.5)'; c.fillRect(0, O.y, o.w, o.h - O.y); c.restore();
        D.mirror(c, { type: 'plane', P: O, R: 1, a: 520, rot: Math.PI / 2 });
        if (labels) D.text(c, 'Plane mirror', 140, O.y + 40, { size: 20, col: COL.muted });
        if (proto) D.protractor(c, O, PR);
        D.line(c, O, N, COL.amber, 2.5, [10, 7]);
        if (labels) D.text(c, 'N  (normal)', N.x, N.y - 20, { size: 20, col: COL.amber });
        // rays
        D.ray(c, [S, O], COL.cyan, 3.4); D.arrowOn(c, S, O, COL.cyan, 16, .55);
        if (iDeg === 0) {
          D.ray(c, [P(O.x + 7, O.y), P(O.x + 7, O.y - RS)], COL.magenta, 3); D.arrowOn(c, P(O.x + 7, O.y), P(O.x + 7, O.y - RS), COL.magenta, 16, .7);
          D.pulses(c, [S, O], now, '#fff', { speed: 240, gap: 130 }); D.pulses(c, [P(O.x + 7, O.y), P(O.x + 7, O.y - RS)], now, COL.magenta, { speed: 240, gap: 130 });
          D.text(c, 'i = 0°: the ray retraces its path', O.x + 30, O.y - 250, { size: 21, col: COL.white, align: 'left', bg: 'rgba(4,8,23,.85)' });
        } else {
          D.ray(c, [O, E], COL.magenta, 3.4); D.arrowOn(c, O, E, COL.magenta, 16, .55);
          D.pulses(c, [S, O, E], now, '#fff', { speed: 240, gap: 130 });
          const up = -Math.PI / 2;
          D.angleArc(c, O, 120, up - a, up, COL.cyan, null);
          D.angleArc(c, O, 120, up, up + a, COL.magenta, null);
          const lr = 175, m = a / 2;
          D.text(c, 'i = ' + iDeg + '°', O.x - Math.sin(m) * lr - 46, O.y - Math.cos(m) * lr, { size: 21, col: COL.cyan, font: 'mono', bg: 'rgba(4,8,23,.8)', pad: 5 });
          D.text(c, 'r = ' + iDeg + '°', O.x + Math.sin(m) * lr + 46, O.y - Math.cos(m) * lr, { size: 21, col: COL.magenta, font: 'mono', bg: 'rgba(4,8,23,.8)', pad: 5 });
        }
        torch(c, S, a);
        D.dot(c, O.x, O.y, 6, COL.white);
        if (labels) {
          D.text(c, 'O', O.x, O.y + 26, { size: 22, col: COL.white, font: 'mono' });
          D.text(c, 'A', S.x + (O.x - S.x) * .2 - 26, S.y + (O.y - S.y) * .2, { size: 22, col: COL.cyan, font: 'mono' });
          if (iDeg) D.text(c, 'B', E.x + 26, E.y - 26, { size: 22, col: COL.magenta, font: 'mono' });
          const mi = P((S.x + O.x) / 2, (S.y + O.y) / 2), mr = P((E.x + O.x) / 2, (E.y + O.y) / 2);
          if (iDeg > 8) { D.text(c, 'Incident ray', mi.x - 80, mi.y, { size: 19, col: COL.cyan, bg: 'rgba(4,8,23,.75)' }); D.text(c, 'Reflected ray', mr.x + 84, mr.y, { size: 19, col: COL.magenta, bg: 'rgba(4,8,23,.75)' }); }
          D.text(c, 'Point of incidence', O.x + 110, O.y + 26, { size: 17, col: COL.muted, weight: 400 });
        }
        D.text(c, `∠i = ${iDeg}°   ∠r = ${iDeg}°`, 1240, 40, { size: 26, col: COL.white, align: 'right', font: 'mono', bg: 'rgba(4,8,23,.8)' });
        liveRow.innerHTML = `Now: ∠i = <span style="color:var(--cyan)">${iDeg}°</span>, ∠r = <span style="color:var(--magenta)">${iDeg}°</span>`;
      }
    };
  }
});

LL.add({
  id: 'first-law', title: 'First law of reflection: in 3D', section: 'Reflection',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 4 · Activity 10.5', title: 'Do the rays and the normal share one plane?' });
    const o = L.cv, cam = Cam3D(640, 400, 118);
    cam.yaw = -.55; cam.pitch = .6; cam.dist = 14;
    let iDeg = 40, bend = 0, showNormal = true, showPlane = false, ghost = true, t = 0, target = null;
    cam.dragOn(o, () => { target = null; });
    const EDGE = .35, Y0 = .02, RR = 3.1;
    const sI = UI.slider('Angle of incidence', 5, 80, 1, iDeg, v => v + '°', v => { iDeg = v; });
    const sB = UI.slider('Bend the paper', 0, 90, 1, bend, v => v + '°', v => { bend = v; });
    const views = el('div', { class: 'ctl' }, el('span', { class: 'lbl' }, 'View'));
    const setView = (y, p) => { target = { yaw: y, pitch: p }; };
    views.append(UI.btn('3D', () => setView(-.55, .6), 'btn sm'), UI.btn('From above', () => setView(0, 1.45), 'btn sm'), UI.btn('Edge-on to the paper', () => setView(-.3, 0), 'btn sm'));
    const tN = UI.toggle('Normal', showNormal, v => { showNormal = v; }, COL.amber);
    const tPl = UI.toggle('Plane of incidence', showPlane, v => { showPlane = v; }, COL.cyan);
    const tG = UI.toggle('Show the beam in the air', ghost, v => { ghost = v; }, COL.magenta);
    L.controls.append(sI.el, sB.el, el('div', { class: 'break' }), views, tN.el, tPl.el, tG.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag to look around · scroll to zoom'));
    const status = el('p', { class: 'q', style: 'margin:0' });
    L.setPanel(UI.panel({
      predict: { q: 'The reflected beam shines along a sheet of paper. If you <b>bend</b> the part of the paper it falls on, will you still see the beam on it?', opts: ['Yes, the beam bends with the paper', 'No, the beam disappears from the bent part', 'Only if the mirror is curved'], ans: 1, why: 'The beam keeps travelling in its own plane; the bent paper has left that plane.' },
      experiment: ['Slowly bend the paper with the slider. Watch the reflected beam on the bent part.', 'Flatten it again.', 'Press <b>Edge-on to the paper</b>: look along the surface of the paper.', 'Drag to look from any direction.'],
      live: UI.card('live', 'What the paper shows', null, status),
      observe: ['When the paper is bent, the reflected beam is no longer seen on it. Flatten it and the beam reappears.', 'Seen edge-on, the incident ray, the normal and the reflected ray collapse into a single line: they lie in <b>one flat plane</b>.'],
      explain: '<p><b>First law of reflection:</b> the incident ray, the reflected ray and the normal at the point of incidence all lie in the <b>same plane</b>.</p><p>Bending the sheet moves it out of that plane, so the beam can no longer graze its surface. This is the textbook activity with a comb, a torch and chart paper.</p>'
    }));

    const W3 = (x, y, z) => [x, y, z];
    return {
      reset() { iDeg = 40; sI.set(40); bend = 0; sB.set(0); showNormal = true; tN.set(true); showPlane = false; tPl.set(false); ghost = true; tG.set(true); setView(-.55, .6); cam.zoom = 1; },
      replay() { bend = 0; sB.set(0); },
      frame(dt, now) {
        t += dt;
        if (target) { cam.yaw += (target.yaw - cam.yaw) * Math.min(1, dt * 4); cam.pitch += (target.pitch - cam.pitch) * Math.min(1, dt * 4); }
        const c = o.ctx; o.begin(); D.bg(o, { grid: false });
        const a = iDeg * DEG, b = bend * DEG;
        const A = W3(-Math.sin(a) * RR, Y0, Math.cos(a) * RR), O = W3(0, Y0, 0), B = W3(Math.sin(a) * RR, Y0, Math.cos(a) * RR);
        const bentPt = (w, z) => W3(EDGE + w * Math.cos(b), -w * Math.sin(b) + .005, z);
        const polys = [];
        // table top (ends at x = EDGE) and its front face
        polys.push({ pts: [W3(-3.6, 0, -.6), W3(EDGE, 0, -.6), W3(EDGE, 0, 3.6), W3(-3.6, 0, 3.6)], fill: '#3a2a1f', stroke: '#5a4130', lw: 1, bias: -.4 });
        polys.push({ pts: [W3(EDGE, 0, -.6), W3(EDGE, -.25, -.6), W3(EDGE, -.25, 3.6), W3(EDGE, 0, 3.6)], fill: '#2a1d14', bias: -.4 });
        // paper: flat part and the part beyond the edge (hinged)
        polys.push({ pts: [W3(-3.2, .005, 0), W3(EDGE, .005, 0), W3(EDGE, .005, 3.3), W3(-3.2, .005, 3.3)], fill: 'rgba(240,244,252,.93)', stroke: '#c9d2e6', lw: 1, bias: -.2 });
        polys.push({ pts: [bentPt(0, 0), bentPt(2.6, 0), bentPt(2.6, 3.3), bentPt(0, 3.3)], fill: 'rgba(232,238,250,.9)', stroke: '#c9d2e6', lw: 1, bias: -.2 });
        // mirror standing upright on the paper (plane z = 0, facing +z)
        polys.push({ pts: [W3(-1.6, 0, 0), W3(EDGE - .05, 0, 0), W3(EDGE - .05, 1.5, 0), W3(-1.6, 1.5, 0)], fill: 'rgba(170,200,240,.85)', stroke: '#e8f1ff', lw: 2, bias: .1 });
        polys.push({ pts: [W3(-1.6, 0, -.06), W3(EDGE - .05, 0, -.06), W3(EDGE - .05, 1.5, -.06), W3(-1.6, 1.5, -.06)], fill: '#4a3a33', bias: 0 });
        if (showPlane) polys.push({ pts: [W3(-3.4, Y0 + .01, 0), W3(3.4, Y0 + .01, 0), W3(3.4, Y0 + .01, 3.5), W3(-3.4, Y0 + .01, 3.5)], fill: 'rgba(63,230,255,.16)', stroke: 'rgba(63,230,255,.6)', lw: 1.5, bias: .2 });
        drawPolys(c, cam, polys);
        const pr = cam.proj;
        // incident beam: always on the flat paper
        D.ray(c, [pr(A), pr(O)], COL.cyan, 3.2); D.arrowOn(c, pr(A), pr(O), COL.cyan, 14, .55);
        // reflected beam: on the flat paper up to the edge, then on the bent part only if flat
        const tEdge = clamp(EDGE / Math.max(1e-6, B[0]), 0, 1);
        const Bedge = W3(B[0] * tEdge, Y0, B[2] * tEdge);
        D.ray(c, [pr(O), pr(Bedge)], COL.magenta, 3.2);
        const flat = bend < 1.5;
        if (flat) { D.ray(c, [pr(Bedge), pr(B)], COL.magenta, 3.2); D.arrowOn(c, pr(O), pr(B), COL.magenta, 14, .6); }
        else if (ghost) D.line(c, pr(Bedge), pr(B), COL.magenta, 2, [6, 7], .55);
        if (showNormal) { D.line(c, pr(O), pr(W3(0, Y0, 3.2)), COL.amber, 2.5, [9, 7]); D.text(c, 'N', pr(W3(0, Y0, 3.45)).x, pr(W3(0, Y0, 3.45)).y, { size: 22, col: COL.amber, font: 'mono' }); }
        // torch
        const tp = pr(A); D.dot(c, tp.x, tp.y, 9, '#fff6c8');
        D.text(c, 'Torch + comb slit', tp.x, tp.y - 26, { size: 17, col: COL.white, bg: 'rgba(4,8,23,.7)' });
        D.text(c, 'O', pr(O).x - 4, pr(O).y - 22, { size: 20, col: COL.white, font: 'mono' });
        const eb = pr(W3(EDGE, 0, 3.4)); D.text(c, 'table edge', eb.x, eb.y + 22, { size: 16, col: COL.muted, weight: 400 });
        const mb = pr(W3(-.6, 1.65, 0)); D.text(c, 'Plane mirror', mb.x, mb.y, { size: 18, col: COL.white, bg: 'rgba(4,8,23,.7)' });
        const msg = flat ? 'Paper flat: the reflected beam is seen along the whole sheet.' : `Paper bent by ${bend}°: the reflected beam is NOT seen on the bent part.`;
        D.text(c, msg, 640, 40, { size: 22, col: flat ? COL.green : COL.amber, bg: 'rgba(4,8,23,.85)' });
        status.textContent = flat ? 'Flat paper → beam visible on the extended part.' : 'Bent paper → beam missing on the bent part. Flatten it to bring it back.';
      }
    };
  }
});

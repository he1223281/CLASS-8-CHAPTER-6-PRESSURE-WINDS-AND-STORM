'use strict';
/* Scene 5: parallel rays on plane / concave / convex mirrors (exact reflection). Scene 6: concentrating sunlight. */

function drawMirrorBeam(c, o, m, opt, now) {
  const { n, spacing, showF, showAxis, showNormals, showBack, prog, active, x0 = 24 } = opt;
  const ax = OPT.mirrorAxis(m), Fp = OPT.mirrorFocus(m), Cp = OPT.mirrorCenter(m), f = m.R / 2;
  if (showAxis && m.type !== 'plane') { D.line(c, V.add(m.P, V.mul(ax, 1300)), V.sub(m.P, V.mul(ax, 300)), COL.axis, 1.5, [10, 7]); }
  if (showAxis && m.type === 'plane') D.line(c, V.add(m.P, V.mul(ax, 1300)), m.P, COL.axis, 1.5, [10, 7]);
  const outLen = m.type === 'concave' ? f * 2.6 : 900;
  let hits = 0;
  for (let k = 0; k < n; k++) {
    const y = m.P.y + (k - (n - 1) / 2) * spacing;
    const start = P(x0, y);
    const r = OPT.traceMirror(m, start, P(1, 0), outLen);
    const dim = active != null && active !== k;
    const alpha = dim ? .18 : 1;
    const pr = prog(k);
    if (!r.hit) { D.ray(c, D.upTo([start, P(o.w + 20, y)], (o.w) * pr), COL.cyan, 1.6, { alpha: .25 * alpha, glow: false }); continue; }
    hits++;
    const full = r.pts, L = D.polyLen(full);
    D.ray(c, D.upTo(full, L * pr), COL.cyan, 2.5, { alpha });
    if (pr >= 1 && !dim) { D.arrowOn(c, full[0], full[1], COL.cyan, 12, .5); D.arrowOn(c, full[1], full[2], COL.cyan, 12, .3); }
    if (pr >= 1 && !LL.reduced && !dim) D.pulses(c, full, now + k * .07, '#fff', { speed: 260, gap: 170, r: 3, limit: 1600 });
    if (showNormals && pr >= .5) {
      const nn = m.type === 'plane' ? ax : V.norm(V.sub(Cp, r.hit));
      const sgn = m.type === 'convex' ? -1 : 1;
      D.line(c, r.hit, V.add(r.hit, V.mul(nn, 70 * sgn * (m.type === 'plane' ? 1 : 1))), COL.amber, 1.5, [4, 5], alpha * .9);
    }
    if (showBack && m.type === 'convex' && pr >= 1) D.line(c, r.hit, V.sub(r.hit, V.mul(r.out, V.dist(r.hit, Fp) * 1.25)), COL.magenta, 1.8, [7, 7], .8 * alpha);
  }
  D.mirror(c, m);
  if (showF && m.type !== 'plane') {
    const glow = .5 + .5 * Math.sin(now * 4);
    if (m.type === 'concave') { D.dot(c, Fp.x, Fp.y, 6 + glow * 3, COL.amber); D.text(c, 'F', Fp.x, Fp.y + 30, { size: 22, col: COL.amber, font: 'mono', bg: 'rgba(4,8,23,.7)' }); }
    else { c.save(); c.strokeStyle = COL.magenta; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.beginPath(); c.arc(Fp.x, Fp.y, 9, 0, Math.PI * 2); c.stroke(); c.restore(); D.text(c, 'F', Fp.x, Fp.y + 30, { size: 22, col: COL.magenta, font: 'mono', bg: 'rgba(4,8,23,.7)' }); }
  }
  return hits;
}

LL.add({
  id: 'parallel', title: 'Parallel rays and three mirrors', section: 'Reflection',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 5 · Activity 10.6', title: 'What happens to a beam of parallel rays?' });
    const o = L.cv;
    const st = { type: 'concave', n: 9, spacing: 44, rot: 0, showF: true, showAxis: true, showNormals: false, showBack: true, trace: false, tt: 0 };
    const sT = UI.seg('Mirror', [{ v: 'plane', t: 'Plane' }, { v: 'concave', t: 'Concave' }, { v: 'convex', t: 'Convex' }, { v: 'all', t: 'Compare all 3' }], st.type, v => { st.type = v; st.tt = 0; });
    const sN = UI.slider('Rays', 3, 15, 1, st.n, v => String(v), v => { st.n = v; });
    const sS = UI.slider('Spacing', 16, 60, 2, st.spacing, v => v + ' px', v => { st.spacing = v; });
    const sR = UI.slider('Rotate mirror', -25, 25, 1, st.rot, v => v + '°', v => { st.rot = v; });
    const tF = UI.toggle('Focus F', true, v => { st.showF = v; }, COL.amber);
    const tA = UI.toggle('Principal axis', true, v => { st.showAxis = v; });
    const tNm = UI.toggle('Normals', false, v => { st.showNormals = v; }, COL.amber);
    const tB = UI.toggle('Dashed back-lines', true, v => { st.showBack = v; }, COL.magenta);
    const bTrace = UI.btn('Trace rays one at a time', () => { st.trace = !st.trace; st.tt = 0; bTrace.textContent = st.trace ? 'Show all rays together' : 'Trace rays one at a time'; }, 'btn go');
    L.controls.append(sT.el, sN.el, sS.el, el('div', { class: 'break' }), sR.el, bTrace, tF.el, tA.el, tNm.el, tB.el);
    L.setPanel(UI.panel({
      predict: { q: 'Parallel rays fall on a <b>convex</b> mirror. After reflection, the rays will…', opts: ['stay parallel', 'meet at one point in front of the mirror', 'spread out, as if coming from a point behind the mirror'], ans: 2, why: 'A convex mirror bulges out, so each ray hits a surface tilted a little more away from the axis than the last one.' },
      experiment: ['Switch between the three mirrors, or compare all three.', 'Turn on <b>Normals</b>: every ray makes equal angles with its normal.', 'Press <b>Trace rays one at a time</b> and follow each ray.', 'Rotate the mirror and change the number of rays.'],
      observe: ['<b>Plane:</b> parallel rays stay parallel. Rotating the mirror turns the whole beam.', '<b>Concave:</b> the rays converge and really meet near F, a <b>real focus</b>.', '<b>Convex:</b> the rays diverge. Traced backwards (dashed), they seem to come from F behind the mirror, a <b>virtual focus</b>.', 'Rays far from the axis cross a little closer to the mirror, so the focus is really a tiny <b>focal region</b>.'],
      explain: '<p>Every single ray obeys <b>∠i = ∠r</b> at its own normal, and the normal of a spherical mirror always points through the centre C. On a concave mirror the normals lean <b>towards</b> the axis, so reflected rays bend together: it is a <b>converging mirror</b>. On a convex mirror they lean <b>away</b>, so it is a <b>diverging mirror</b>.</p><p>No light goes behind a convex mirror; the virtual focus is only where the reflected rays <b>appear</b> to start.</p><p class="note">Exact law-of-reflection tracing on a true sphere. The school model’s single point F (f = R/2) is exact only for rays close to the axis.</p>'
    }));
    return {
      reset() { Object.assign(st, { type: 'concave', n: 9, spacing: 44, rot: 0, showF: true, showAxis: true, showNormals: false, showBack: true, trace: false, tt: 0 }); sT.set('concave'); sN.set(9); sS.set(44); sR.set(0); tF.set(true); tA.set(true); tNm.set(false); tB.set(true); bTrace.textContent = 'Trace rays one at a time'; },
      replay() { st.tt = 0; },
      onShow() { st.tt = 0; },
      frame(dt, now) {
        st.tt += dt;
        const c = o.ctx; o.begin(); D.bg(o);
        const rot = st.rot * DEG;
        const per = 1.3;
        const mk = (n) => {
          if (st.trace) { const act = Math.floor(st.tt / per) % n; return { prog: k => k === act ? clamp((st.tt % per) / (per * .8), 0, 1) : (k < act ? 1 : 0), active: act }; }
          return { prog: () => clamp(st.tt / 2, 0, 1), active: null };
        };
        const base = { showF: st.showF, showAxis: st.showAxis, showNormals: st.showNormals, showBack: st.showBack };
        if (st.type !== 'all') {
          const m = { type: st.type, P: P(1000, 350), R: 600, a: 260, rot };
          drawMirrorBeam(c, o, m, { ...base, n: st.n, spacing: st.spacing, ...mk(st.n) }, now);
          const msg = { plane: 'Plane mirror: parallel rays stay parallel', concave: 'Concave mirror: rays converge at F (real focus)', convex: 'Convex mirror: rays diverge from F (virtual focus)' }[st.type];
          D.text(c, msg, 630, 36, { size: 24, col: st.type === 'convex' ? COL.magenta : st.type === 'concave' ? COL.amber : COL.cyan, bg: 'rgba(4,8,23,.85)' });
          if (st.type === 'convex' && st.showF) { const Fp = OPT.mirrorFocus(m); D.text(c, 'rays only seem to come from here', Fp.x + 10, Fp.y - 30, { size: 17, col: COL.magenta, align: 'left', bg: 'rgba(4,8,23,.75)' }); }
        } else {
          ['plane', 'concave', 'convex'].forEach((tp, i) => {
            const y = 118 + i * 232;
            c.save(); c.beginPath(); c.rect(0, y - 116, o.w, 232); c.clip();
            const m = { type: tp, P: P(1010, y), R: 380, a: 92, rot };
            drawMirrorBeam(c, o, m, { ...base, n: Math.min(st.n, 7), spacing: Math.min(st.spacing, 26) * .9, ...mk(Math.min(st.n, 7)) }, now);
            c.restore();
            D.text(c, tp[0].toUpperCase() + tp.slice(1), 16, y - 92, { size: 22, col: tp === 'convex' ? COL.magenta : tp === 'concave' ? COL.amber : COL.cyan, align: 'left', font: 'disp' });
            if (i < 2) D.line(c, P(0, y + 116), P(o.w, y + 116), COL.line, 2);
          });
        }
      }
    };
  }
});

LL.add({
  id: 'sunlight', title: 'Concentrating sunlight', section: 'Reflection',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 6 · Activities 10.7 & 10.11', title: 'Can a mirror or a lens gather the Sun’s heat?' });
    const o = L.cv, Y = 380;
    const m = { type: 'concave', P: P(1120, Y), R: 820, a: 250, rot: 0 };
    const lensG = lensGeom('convex', 520, Y, 600, 210);            // Activity 10.11: a convex lens instead of the mirror
    const FxM = OPT.mirrorFocus(m).x, FxL = OPT.lensFocusX(lensG);
    let dev = 'mirror', xs = 900, sun = true, showF = true, t = 0, heat = 0;
    const CH = 46;
    const Fx = () => dev === 'mirror' ? FxM : FxL;
    const fpx = () => dev === 'mirror' ? m.R / 2 : FxL - lensG.X;
    const range = () => dev === 'mirror' ? [330, 1080] : [640, 1240];
    const sX = UI.slider('Paper position', 330, 1080, 2, xs, v => (Math.abs(v - (dev === 'mirror' ? m.P.x : lensG.X)) / 10).toFixed(0) + ' cm from the ' + (dev === 'mirror' ? 'mirror' : 'lens'), v => { xs = v; });
    const sDev = UI.seg('Use', [{ v: 'mirror', t: 'Concave mirror (10.7)' }, { v: 'lens', t: 'Convex lens (10.11)' }], dev, v => {
      dev = v; const [a, b] = range(); sX.input.min = a; sX.input.max = b; xs = v === 'mirror' ? 900 : 760; sX.set(xs); heat = 0;
    });
    const tS = UI.toggle('Sunlight', sun, v => { sun = v; }, COL.amber);
    const tF = UI.toggle('Mark F', showF, v => { showF = v; }, COL.amber);
    L.controls.append(sDev.el, el('div', { class: 'break' }), sX.el, UI.btn('Put the paper at the focus', () => { xs = bestX(); sX.set(xs); }, 'btn go'), tS.el, tF.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag the paper along the axis'));
    const ro = UI.readout([['d', 'Spot size'], ['c', 'Concentration'], ['h', 'Heating']]);
    const safety = UI.card('safety', 'Safety first', null, el('p', { html: 'Never look at the Sun, or at sunlight reflected or focused by a mirror or lens: it can permanently damage your eyes. Never point focused sunlight at people, animals or anything that can catch fire. Try a real concave mirror only with your teacher.' }));
    const apps = UI.card('explain', 'Solar concentrators in use', null, el('ul', null,
      el('li', { html: '<b>Solar furnaces:</b> huge curved mirror arrays reach thousands of degrees; they can even melt steel.' }),
      el('li', { html: '<b>Solar power plants:</b> concentrated sunlight heats a liquid to make steam that turns turbines to generate electricity.' }),
      el('li', { html: '<b>Large-scale solar cooking:</b> big concave dish cookers in community kitchens.' }),
      el('li', { html: '<b>Industry:</b> heat for drying, water heating and processing.' })));
    L.setPanel(UI.panel({
      predict: { q: 'Where should you hold the paper to get the <b>smallest, brightest</b> spot of sunlight?', opts: ['Touching the mirror', 'At the focus F', 'As far from the mirror as possible'], ans: 1, why: 'At F the reflected rays from the whole mirror crowd into the smallest area.' },
      experiment: ['Drag the paper slowly towards the mirror.', 'Watch the spot in the "paper" view: how big, how bright?', 'Press <b>Put the paper at the focus</b>.', 'Switch to the <b>convex lens</b> (Activity 10.11). Can it burn the paper too?'],
      live: UI.card('live', 'Measurements (qualitative)', null, ro.el),
      observe: ['Far from F the spot is large and dim.', 'At F it is tiny and dazzlingly bright: the paper heats up fastest.', 'Beyond F the rays cross and spread again, so the spot grows.'],
      explain: '<p>The Sun is so far away that its rays arrive <b>parallel</b>. A concave mirror reflects them all towards F. The same light energy is squeezed into a much smaller area, so each bit of the paper receives far more energy and gets hot.</p><p>A <b>convex lens</b> does the same job by refraction: sunlight passes through it and converges at F on the other side.</p><p>Devices that concentrate sunlight with mirrors or lenses are called <b>solar concentrators</b>.</p>',
      extra: [safety, apps]
    }));
    dragOn(o, { hit: p => Math.abs(p.x - xs) < 30 && Math.abs(p.y - Y) < CH + 40 ? 'scr' : null, move: (h, p) => { const [a, b] = range(); xs = clamp(p.x, a, b); sX.set(xs); } });

    // dense sample (for measurement) and drawn rays
    const sampleH = Array.from({ length: 121 }, (_, i) => -240 + i * 4);
    const drawH = Array.from({ length: 13 }, (_, i) => -240 + i * 40);
    function traceOne(h) {
      const start = P(-20, Y + h);
      if (dev === 'lens') {
        const r = OPT.traceLens(lensG, start, P(1, 0), 1.5, 2000);
        if (!r.out) return { pts: r.pts, miss: true };
        const tS = (xs - 7 - r.exit.x) / r.out.x, at = V.add(r.exit, V.mul(r.out, tS));
        if (tS > 0 && Math.abs(at.y - Y) < CH) return { pts: [...r.pts.slice(0, 3), at], onPaper: at.y, h };
        return { pts: r.pts };
      }
      if (Math.abs(h) < CH) return { pts: [start, P(xs - 7, Y + h)], blocked: true };
      const r = OPT.traceMirror(m, start, P(1, 0), 2000);
      if (!r.hit) return { pts: [start, P(o.w + 20, Y + h)], miss: true };
      const tS = (xs + 7 - r.hit.x) / r.out.x;
      const at = V.add(r.hit, V.mul(r.out, tS));
      if (tS > 0 && Math.abs(at.y - Y) < CH) return { pts: [start, r.hit, at], onPaper: at.y, h };
      return { pts: [start, r.hit, V.add(r.hit, V.mul(r.out, 900))] };
    }
    // brightest spot: scan paper positions near F for the smallest spot (real mirrors and lenses focus edge rays a little closer)
    function bestX() {
      const keep = xs; let best = Fx(), bs = Infinity;
      for (let x = Fx() - 120; x <= Fx() + 40; x += 2) {
        xs = x; const ys = [];
        for (const h of sampleH) { const r = traceOne(h); if (r.onPaper != null) ys.push(r.onPaper); }
        if (ys.length < sampleH.length * .5) continue;
        const sp = Math.max(...ys) - Math.min(...ys); if (sp < bs) { bs = sp; best = x; }
      }
      xs = keep; const [a, b] = range(); return clamp(best, a, b);
    }
    return {
      reset() { dev = 'mirror'; sDev.set('mirror'); sX.input.min = 330; sX.input.max = 1080; xs = 900; sX.set(900); sun = true; tS.set(true); showF = true; tF.set(true); heat = 0; },
      replay() { heat = 0; t = 0; },
      frame(dt, now) {
        t += dt;
        const c = o.ctx; o.begin(); D.bg(o, { top: '#13204a', bot: '#050817' });
        D.sunGlow(c, -60, Y, 300 * (sun ? 1 : .2));
        D.axis(c, Y, 0, o.w, null);
        // measurement
        const ys = []; let maxH = 0;
        if (sun) for (const h of sampleH) { const r = traceOne(h); if (r.onPaper != null) { ys.push(r.onPaper); maxH = Math.max(maxH, Math.abs(h)); } }
        const sunSize = fpx() * .0093;                     // the Sun's own angular size (0.53°) sets a smallest possible spot
        const spread = ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
        const dSpot = Math.max(spread, sunSize);
        const conc = ys.length ? Math.pow(2 * maxH / dSpot, 2) * (ys.length / sampleH.length * 1.4) : 0;
        const level = clamp(Math.log10(Math.max(1, conc)) / Math.log10(3000), 0, 1);
        heat += (level - heat) * Math.min(1, dt * (level > heat ? .8 : 1.6));
        // rays
        if (sun) for (const h of drawH) {
          const r = traceOne(h);
          D.ray(c, r.pts, '#ffd27a', 2.2, { alpha: r.miss ? .3 : .9 });
          D.arrowOn(c, r.pts[0], r.pts[1], '#ffd27a', 11, .35);
          if (!LL.reduced) D.pulses(c, r.pts, now + h * .002, '#fff8de', { speed: 300, gap: 200, r: 2.6 });
        }
        if (dev === 'mirror') D.mirror(c, m, { realistic: true });
        else { const ol = OPT.lensOutline(lensG); c.save(); D.path(c, ol); c.closePath(); c.fillStyle = 'rgba(120,225,255,.2)'; c.fill(); c.strokeStyle = 'rgba(160,240,255,.95)'; c.lineWidth = 2.5; c.stroke(); c.restore(); }
        if (showF) D.mark(c, Fx(), Y, 'F', COL.amber);
        // the paper card (side view)
        c.save(); c.fillStyle = '#f2f4fa'; c.fillRect(xs - 7, Y - CH, 14, CH * 2); c.restore();
        if (sun && ys.length) { const yc = (Math.max(...ys) + Math.min(...ys)) / 2; D.dot(c, xs + (dev === 'mirror' ? 8 : -8), yc, 4 + 10 * heat, '#fff6c8'); }
        D.text(c, 'Paper', xs, Y - CH - 18, { size: 18, col: COL.white });
        // paper face inset
        const ix = 30, iy = 470, iw = 300, ih = 200;
        c.save(); c.fillStyle = 'rgba(4,8,23,.85)'; D.rrect(c, ix, iy, iw, ih, 14); c.fill(); c.strokeStyle = COL.line; c.lineWidth = 2; c.stroke(); c.restore();
        D.text(c, 'What the paper looks like', ix + iw / 2, iy + 20, { size: 16, col: COL.muted });
        const cx = ix + iw / 2, cy = iy + 112, card = 76;
        c.save(); c.fillStyle = '#c9ccd6'; c.fillRect(cx - card, cy - card, card * 2, card * 2);
        const k = card / CH, rSpot = Math.max(2, dSpot / 2 * k);
        if (sun && ys.length) {
          if (heat > .82) { c.fillStyle = `rgba(60,30,10,${(heat - .82) * 4})`; c.beginPath(); c.arc(cx, cy, rSpot * 1.6 + 4, 0, Math.PI * 2); c.fill(); }
          const g = c.createRadialGradient(cx, cy, 0, cx, cy, rSpot * 1.8 + 2);
          const a = clamp(.25 + heat * .9, 0, 1);
          g.addColorStop(0, `rgba(255,255,240,${a})`); g.addColorStop(.5, `rgba(255,214,110,${a * .9})`); g.addColorStop(1, 'rgba(255,190,80,0)');
          c.fillStyle = g; c.beginPath(); c.arc(cx, cy, rSpot * 1.8 + 2, 0, Math.PI * 2); c.fill();
        }
        c.restore();
        if (heat > .82 && sun) for (let i = 0; i < 4; i++) { const ph = (now * .6 + i * .25) % 1; c.save(); c.globalAlpha = (1 - ph) * .5; c.fillStyle = '#c9c9d4'; c.beginPath(); c.arc(cx + Math.sin(now * 2 + i) * 10, cy - 10 - ph * 70, 6 + ph * 10, 0, Math.PI * 2); c.fill(); c.restore(); }
        // heat meter
        const mx = ix + iw + 18, my = iy + 10, mh = 180;
        c.save(); c.fillStyle = 'rgba(4,8,23,.85)'; D.rrect(c, mx, my - 10, 36, mh + 20, 10); c.fill();
        const gh = c.createLinearGradient(0, my + mh, 0, my); gh.addColorStop(0, '#3fe6ff'); gh.addColorStop(.5, '#ffb84d'); gh.addColorStop(1, '#ff4f4f');
        c.fillStyle = gh; c.fillRect(mx + 10, my + mh * (1 - heat), 16, mh * heat); c.restore();
        D.text(c, heat > .82 ? 'may char!' : heat > .55 ? 'hot' : heat > .25 ? 'warm' : 'cool', mx + 46, my + mh * (1 - heat), { size: 17, col: heat > .82 ? COL.red : COL.amber, align: 'left' });
        // safety banner
        D.text(c, '⚠ Virtual experiment. Never look at the Sun or at focused sunlight.', 630, 30, { size: 19, col: COL.amber, bg: 'rgba(40,24,4,.9)' });
        ro.set('d', sun && ys.length ? (dSpot / 10).toFixed(dSpot < 30 ? 1 : 0) + ' cm across' : '—');
        ro.set('c', sun && ys.length ? '≈ ' + (conc >= 100 ? Math.round(conc / 10) * 10 : conc.toFixed(1)) + '× direct sunlight' : '—', true);
        ro.set('h', !sun ? 'No sunlight' : heat > .82 ? 'Very hot: paper may start to char' : heat > .55 ? 'Hot' : heat > .25 ? 'Warm' : 'Barely warm');
      }
    };
  }
});

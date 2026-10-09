'use strict';
/* Scene 2: spherical mirrors cut from a sphere (3D), terms + comparison, and the plane-mirror lab */

LL.add({
  id: 'sphere', title: 'Spherical mirrors: part of an imaginary sphere', section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 2 · Activity 10.2', title: 'Curved inwards or curved outwards?' });
    const o = L.cv, cam = Cam3D(390, 360, 120);
    cam.yaw = -.9; cam.pitch = .32;
    let type = 'concave', off = 0, offT = 0, auto = true, showSphere = true, showCR = true, t = 0;
    const R = 1.75, capA = 38 * DEG;
    cam.dragOn(o);
    const sType = UI.seg('Reflecting side', [{ v: 'concave', t: 'Inside shines (concave)' }, { v: 'convex', t: 'Outside shines (convex)' }], type, v => { type = v; });
    const bCut = UI.btn('Lift the piece out', () => { offT = offT ? 0 : 1.15; bCut.textContent = offT ? 'Put it back' : 'Lift the piece out'; }, 'btn go');
    const tAuto = UI.toggle('Auto-rotate', auto, v => { auto = v; });
    const tSph = UI.toggle('Show whole sphere', showSphere, v => { showSphere = v; });
    const tCR = UI.toggle('Show C and R', showCR, v => { showCR = v; }, COL.amber);
    const bSide = UI.btn('Side view', () => { auto = false; tAuto.set(false); cam.yaw = 0; cam.pitch = 0; }, 'btn sm');
    const sZoom = UI.slider('Zoom', 60, 200, 5, 100, v => v + '%', v => { cam.zoom = v / 100; });
    L.controls.append(sType.el, bCut, bSide, el('div', { class: 'break' }), tAuto.el, tSph.el, tCR.el, sZoom.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag to rotate · scroll to zoom'));

    L.setPanel(UI.panel({
      predict: { q: 'Imagine a spherical mirror as a piece of a hollow sphere. If its <b>inside</b> surface reflects light, what kind of mirror is it?', opts: ['Concave (curved inwards)', 'Convex (bulging outwards)', 'Plane'], ans: 0,
        why: 'The inside of a sphere is "bent in", like a cave: <b>con-cave</b>.' },
      experiment: ['Drag the 3D sphere to look at it from all sides.', 'Press <b>Lift the piece out</b> to separate the mirror from its imaginary sphere.', 'Press <b>Side view</b>: as in Activity 10.2, a side view shows whether the surface curves in or out.', 'Switch which side shines and watch where the shiny side faces.'],
      observe: ['The concave mirror’s shiny side faces the <b>centre C</b> of the sphere.', 'The convex mirror’s shiny side faces <b>away</b> from C.', 'Both mirrors are the same piece of sphere, so both have the same centre C and radius R.'],
      explain: '<p>A <b>spherical mirror</b> is a mirror whose reflecting surface is part of a hollow sphere. If the reflecting surface is the inner, <b>bent-in</b> side, it is a <b>concave mirror</b>. If it is the outer, <b>bulging-out</b> side, it is a <b>convex mirror</b>. The other side is coated and painted, so it does not reflect.</p>' +
        '<p><b>A step further:</b> real spherical mirrors are not made by slicing a glass sphere. A flat piece of glass is ground and polished into a curved shape and then coated (for example with a thin layer of aluminium). Coating the <b>outer</b> curved surface makes a concave mirror; coating the <b>inner</b> curved surface makes a convex mirror.</p>' +
        '<p><b>How to tell them apart:</b> slowly bring your face close to the mirror. A concave mirror gives a big, upright image close up and an upside-down image far away. A convex mirror always gives a smaller, upright image. A plane mirror always gives a same-size image.</p>'
    }));

    function frame3D(c, now) {
      const pole = [R + off, 0, 0];
      // sphere grid (outside the cap)
      if (showSphere) {
        c.save(); c.lineWidth = 1.4;
        const seg = (a, b) => { const A = cam.proj(a), B = cam.proj(b); c.globalAlpha = (A.z + B.z) / 2 > 0 ? .55 : .16; c.strokeStyle = '#7f9ce0'; c.beginPath(); c.moveTo(A.x, A.y); c.lineTo(B.x, B.y); c.stroke(); };
        for (let j = 0; j < 12; j++) {               // meridians from cap edge to the far pole
          const ph = j * Math.PI / 6;
          for (let i = 0; i < 20; i++) {
            const a0 = capA + (Math.PI - capA) * i / 20, a1 = capA + (Math.PI - capA) * (i + 1) / 20;
            seg([R * Math.cos(a0), R * Math.sin(a0) * Math.cos(ph), R * Math.sin(a0) * Math.sin(ph)], [R * Math.cos(a1), R * Math.sin(a1) * Math.cos(ph), R * Math.sin(a1) * Math.sin(ph)]);
          }
        }
        for (let k = 1; k <= 6; k++) {               // rings around the axis
          const a = capA + (Math.PI - capA) * k / 7;
          for (let j = 0; j < 36; j++) {
            const p0 = j * Math.PI / 18, p1 = (j + 1) * Math.PI / 18;
            seg([R * Math.cos(a), R * Math.sin(a) * Math.cos(p0), R * Math.sin(a) * Math.sin(p0)], [R * Math.cos(a), R * Math.sin(a) * Math.cos(p1), R * Math.sin(a) * Math.sin(p1)]);
          }
        }
        c.restore();
      }
      // principal axis
      const ax0 = cam.proj([-2.6, 0, 0]), ax1 = cam.proj([R + off + 1.5, 0, 0]);
      D.line(c, ax0, ax1, COL.axis, 1.5, [9, 7]);
      // the cap (mirror) as shaded quads
      const polys = [], NR = 8, NS = 28, Lt = V3.norm([-.4, .6, .75]);
      const pt = (a, ph) => [R * Math.cos(a) + off, R * Math.sin(a) * Math.cos(ph), R * Math.sin(a) * Math.sin(ph)];
      for (let i = 0; i < NR; i++) for (let j = 0; j < NS; j++) {
        const a0 = capA * i / NR, a1 = capA * (i + 1) / NR, p0 = j * 2 * Math.PI / NS, p1 = (j + 1) * 2 * Math.PI / NS;
        const am = (a0 + a1) / 2, pm = (p0 + p1) / 2;
        const n = cam.tf([Math.cos(am), Math.sin(am) * Math.cos(pm), Math.sin(am) * Math.sin(pm)]);
        const seeOuter = n[2] > 0;
        const shiny = type === 'concave' ? !seeOuter : seeOuter;
        const nf = seeOuter ? n : V3.mul(n, -1);
        const s = .3 + .7 * Math.max(0, V3.dot(V3.norm(nf), Lt));
        const spec = Math.pow(Math.max(0, V3.dot(V3.norm(nf), V3.norm([-.1, .3, 1]))), 18);
        const fill = shiny ? `rgb(${Math.round(120 + 120 * s + 60 * spec)},${Math.round(150 + 95 * s + 40 * spec)},${Math.round(185 + 70 * s)})` : `rgb(${Math.round(70 + 50 * s)},${Math.round(40 + 30 * s)},${Math.round(36 + 22 * s)})`;
        polys.push({ pts: [pt(a0, p0), pt(a1, p0), pt(a1, p1), pt(a0, p1)], fill, stroke: fill, lw: .6 });
      }
      drawPolys(c, cam, polys);
      // rim highlight
      c.save(); c.strokeStyle = type === 'concave' ? COL.amber : COL.magenta; c.lineWidth = 3; c.beginPath();
      for (let j = 0; j <= 48; j++) { const q = cam.proj(pt(capA, j * 2 * Math.PI / 48)); j ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }
      c.stroke(); c.restore();
      if (showCR) {
        const Cp = cam.proj([0, 0, 0]), Pp = cam.proj(pole);
        D.line(c, Cp, Pp, COL.amber, 3, [8, 6]);
        D.dot(c, Cp.x, Cp.y, 7, COL.amber); D.text(c, 'C', Cp.x - 18, Cp.y - 22, { size: 24, col: COL.amber, font: 'mono' });
        D.dot(c, Pp.x, Pp.y, 6, COL.cyan); D.text(c, 'P', Pp.x + 18, Pp.y - 22, { size: 24, col: COL.cyan, font: 'mono' });
        D.text(c, 'R', (Cp.x + Pp.x) / 2, (Cp.y + Pp.y) / 2 - 22, { size: 22, col: COL.amber, font: 'mono', bg: 'rgba(255,255,255,.9)' });
      }
      D.text(c, type === 'concave' ? 'Shiny side: inside (faces C)' : 'Shiny side: outside (faces away from C)', 390, 40, { size: 22, col: type === 'concave' ? COL.amber : COL.magenta, bg: 'rgba(255,255,255,.9)' });
      D.text(c, 'Silver = reflecting surface · brown = coated back', 390, 630, { size: 17, col: COL.muted, weight: 400 });
    }

    function frame2D(c) {
      const cx = 940, cy = 360, r = 150, aw = capA;
      c.save(); c.fillStyle = 'rgba(10,124,255,.04)'; c.fillRect(780, 0, 480, 700); c.restore();
      D.line(c, P(780, 0), P(780, 700), COL.line, 2);
      D.text(c, 'Side view (cross-section)', 1020, 40, { size: 21, col: COL.white });
      c.save(); c.setLineDash([6, 6]); c.strokeStyle = 'rgba(70,100,180,.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke(); c.restore();
      D.axis(c, cy, 800, 1240, null);
      // same arc of the circle in both cases; rot = π turns the reflecting side to face right (away from C)
      const m = { type, P: P(cx + r, cy), R: r, a: r * Math.sin(aw), rot: type === 'concave' ? 0 : Math.PI };
      D.mirror(c, m);
      D.dot(c, cx, cy, 6, COL.amber); D.text(c, 'C', cx, cy + 30, { size: 22, col: COL.amber, font: 'mono' });
      D.dot(c, cx + r, cy, 5, COL.cyan); D.text(c, 'P', cx + r + (type === 'concave' ? 26 : -24), cy + 30, { size: 22, col: COL.cyan, font: 'mono' });
      D.line(c, P(cx, cy), P(cx + r * Math.cos(-aw * .6), cy + r * Math.sin(-aw * .6)), COL.amber, 2.5);
      D.text(c, 'R', cx + r * .36, cy - 62, { size: 21, col: COL.amber, font: 'mono' });
      // incoming light on the reflecting side
      for (const dy of [-60, 0, 60]) {
        const sx = cx + r - (r - Math.sqrt(r * r - dy * dy));            // surface x at this height
        const a = P(type === 'concave' ? cx + 30 : cx + r + 120, cy + dy), b = P(type === 'concave' ? sx - 12 : sx + 12, cy + dy);
        D.ray(c, [a, b], COL.cyan, 2.2, { alpha: .9 }); D.arrowOn(c, a, b, COL.cyan, 12, .6);
      }
      D.text(c, 'light falls on this side', type === 'concave' ? cx + 20 : cx + r + 6, cy + 130, { size: 18, col: COL.cyan, align: 'left', weight: 400 });
      D.text(c, type === 'concave' ? 'CONCAVE: bent in' : 'CONVEX: bulging out', 1020, 600, { size: 24, col: type === 'concave' ? COL.amber : COL.magenta, font: 'disp' });
    }
    return {
      reset() { type = 'concave'; sType.set(type); offT = 0; off = 0; bCut.textContent = 'Lift the piece out'; auto = true; tAuto.set(true); showSphere = true; tSph.set(true); showCR = true; tCR.set(true); cam.zoom = 1; sZoom.set(100); cam.yaw = -.9; cam.pitch = .32; },
      replay() { off = 0; offT = 1.15; bCut.textContent = 'Put it back'; },
      frame(dt, now) {
        t += dt; if (auto && !cam.dragging) cam.yaw += dt * .35;
        off += (offT - off) * Math.min(1, dt * 3);
        const c = o.ctx; o.begin(); D.bg(o);
        frame3D(c, now); frame2D(c);
      }
    };
  }
});

/* ---------- terms related to spherical mirrors ---------- */
LL.add({
  id: 'terms', title: 'Terms for spherical mirrors', section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 2 · Extension (reference book p. 204)', title: 'Pole, centre, focus: naming the parts' });
    const o = L.cv;
    const Y = 320;
    const cm = { type: 'concave', P: P(560, Y), R: 340, a: 190, rot: 0 };
    const vm = { type: 'convex', P: P(760, Y), R: 340, a: 190, rot: 0 };
    const C1 = OPT.mirrorCenter(cm), F1 = OPT.mirrorFocus(cm), C2 = OPT.mirrorCenter(vm), F2 = OPT.mirrorFocus(vm);
    const TERMS = {
      pole: ['Pole (P)', 'The geometric centre of the reflecting surface. It is denoted by P.'],
      centre: ['Centre of curvature (C)', 'The centre of the sphere of which the mirror forms a part. It is denoted by C. It is in front of a concave mirror and behind a convex mirror.'],
      radius: ['Radius of curvature (R)', 'The radius of the sphere of which the mirror forms a part. PC is the radius of curvature R.'],
      axis: ['Principal axis', 'The straight line passing through the centre of curvature C and the pole P.'],
      focus: ['Principal focus (F)', 'Parallel rays falling on a concave mirror meet at F after reflection. For a convex mirror, the reflected rays appear to spread out from F behind the mirror.'],
      flen: ['Focal length (f)', 'The distance between the pole and the principal focus, PF. Focal length f = R / 2.'],
      aperture: ['Aperture', 'The portion of the mirror available for reflection (APB in the diagram).']
    };
    let sel = 'focus', rays = true, t = 0;
    const live = UI.card('live', 'Selected term', null, el('div', { class: 'q', id: 'll-terms-name' }), el('p', { id: 'll-terms-def' }));
    const setSel = k => { sel = k; $('#ll-terms-name', live).textContent = TERMS[k][0]; $('#ll-terms-def', live).textContent = TERMS[k][1]; segT.set(k); };
    const segT = UI.seg(null, Object.keys(TERMS).map(k => ({ v: k, t: TERMS[k][0].replace(/ \(.+\)/, '') })), sel, setSel);
    const tR = UI.toggle('Parallel light rays', rays, v => { rays = v; });
    L.controls.append(segT.el, el('div', { class: 'break' }), tR.el, el('span', { class: 'lbl', style: 'font-size:17px;color:var(--muted)' }, 'Tip: click any label on the diagram.'));

    const table = el('table', { class: 'mini-table' },
      el('thead', null, el('tr', null, el('th', null, ''), el('th', null, 'Plane'), el('th', null, 'Concave'), el('th', null, 'Convex'))),
      el('tbody', null,
        el('tr', null, el('th', null, 'Surface'), el('td', null, 'Flat'), el('td', null, 'Bent inwards'), el('td', null, 'Bulges outwards')),
        el('tr', null, el('th', null, 'Parallel rays'), el('td', null, 'Stay parallel'), el('td', null, 'Converge at F'), el('td', null, 'Diverge, seem to come from F')),
        el('tr', null, el('th', null, 'Image'), el('td', null, 'Virtual, erect, same size'), el('td', null, 'Real & inverted, or virtual, erect & enlarged'), el('td', null, 'Always virtual, erect, diminished')),
        el('tr', null, el('th', null, 'Also called'), el('td', null, '—'), el('td', null, 'Converging mirror'), el('td', null, 'Diverging mirror'))));
    L.setPanel(UI.panel({
      predict: { q: 'The radius of curvature of a concave mirror is 20 cm. What is its focal length?', opts: ['40 cm', '20 cm', '10 cm', '5 cm'], ans: 2, why: 'The focus is halfway between P and C, so f = R / 2 = 20 / 2 = 10 cm.' },
      live,
      observe: ['C and F are <b>in front</b> of a concave mirror and <b>behind</b> a convex mirror.', 'F lies exactly halfway between P and C.', 'The principal axis joins C and P.'],
      explain: '<p>Focal length, f = Radius of curvature / 2 = <b>R / 2</b>.</p>', extra: [UI.card('explain', 'Plane, concave and convex compared', null, table)]
    }));
    setSel(sel);

    // clickable label hotspots
    const hot = [
      ['pole', cm.P.x + 16, Y + 34], ['pole', vm.P.x - 16, Y + 34], ['centre', C1.x, Y + 34], ['centre', C2.x, Y + 34], ['focus', F1.x, Y + 34], ['focus', F2.x, Y + 34],
      ['radius', (C1.x + cm.P.x) / 2, Y + 128], ['radius', (C2.x + vm.P.x) / 2, Y + 128], ['axis', 1150, Y - 20], ['flen', (F1.x + cm.P.x) / 2, Y + 84], ['flen', (F2.x + vm.P.x) / 2, Y + 84],
      ['aperture', cm.P.x - 42, Y - 205], ['aperture', vm.P.x + 50, Y - 205]
    ];
    const hitT = p => { const h = hot.find(([, x, y]) => Math.abs(p.x - x) < 46 && Math.abs(p.y - y) < 24); return h ? h[0] : null; };
    o.cv.addEventListener('click', e => { const k = hitT(o.pt(e)); if (k) setSel(k); });
    o.cv.addEventListener('pointermove', e => { o.cv.style.cursor = hitT(o.pt(e)) ? 'pointer' : 'default'; });

    function bracket(c, x0, x1, y, label, col, on) {
      D.line(c, P(x0, y), P(x1, y), col, on ? 3.5 : 2); D.line(c, P(x0, y - 8), P(x0, y + 8), col, 2); D.line(c, P(x1, y - 8), P(x1, y + 8), col, 2);
      D.text(c, label, (x0 + x1) / 2, y + 22, { size: 20, col, font: 'mono', bg: on ? 'rgba(255,184,77,.25)' : 'rgba(255,255,255,.9)' });
    }
    return {
      reset() { setSel('focus'); rays = true; tR.set(true); },
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o);
        const glow = .5 + .5 * Math.sin(now * 5);
        // faint full circles
        c.save(); c.setLineDash([5, 7]); c.strokeStyle = 'rgba(70,100,180,.35)'; c.lineWidth = 1.2;
        c.beginPath(); c.arc(C1.x, C1.y, cm.R, -.62, .62); c.stroke(); c.beginPath(); c.arc(C2.x, C2.y, vm.R, Math.PI - .62, Math.PI + .62); c.stroke(); c.restore();
        D.line(c, P(20, Y), P(1240, Y), sel === 'axis' ? COL.amber : COL.axis, sel === 'axis' ? 3 : 1.5, [10, 7]);
        D.text(c, 'Principal axis', 1150, Y - 20, { size: 18, col: sel === 'axis' ? COL.amber : COL.muted, bg: 'rgba(255,255,255,.9)' });
        if (rays) {
          for (let k = -3; k <= 3; k++) {
            if (!k) continue;
            const r1 = OPT.traceMirror(cm, P(20, Y + k * 36), P(1, 0), 520);
            D.ray(c, r1.pts.slice(0, 2), COL.cyan, 2, { alpha: .75 }); D.ray(c, [r1.pts[1], V.add(r1.pts[1], V.mul(r1.out, 380))], COL.cyan, 2, { alpha: .75 });
            D.arrowOn(c, r1.pts[0], r1.pts[1], COL.cyan, 11, .5);
          }
          // convex: light from the left, reflecting surface faces left
          for (let k = -3; k <= 3; k++) {
            if (!k) continue;
            const y = Y + k * 36, r = OPT.traceMirror(vm, P(640, y), P(1, 0), 220);
            if (!r.hit) continue;
            D.ray(c, [P(600, y), r.hit], COL.magenta, 2, { alpha: .75 }); D.ray(c, [r.hit, V.add(r.hit, V.mul(r.out, 150))], COL.magenta, 2, { alpha: .75 });
            D.line(c, r.hit, F2, COL.magenta, 1.5, [5, 6], .6);
          }
        }
        D.mirror(c, cm); D.mirror(c, vm);
        const hl = k => sel === k ? COL.amber : COL.white;
        // points
        for (const [x, lab, k] of [[cm.P.x + 16, 'P', 'pole'], [vm.P.x - 16, 'P', 'pole'], [C1.x, 'C', 'centre'], [C2.x, 'C', 'centre'], [F1.x, 'F', 'focus'], [F2.x, 'F', 'focus']]) {
          const on = sel === k;
          if (on) D.dot(c, lab === 'P' ? (x < 660 ? cm.P.x : vm.P.x) : x, Y, 6 + glow * 4, COL.amber);
          else D.dot(c, lab === 'P' ? (x < 660 ? cm.P.x : vm.P.x) : x, Y, 4.5, COL.white, false);
          D.text(c, lab, x, Y + 34, { size: 24, col: hl(k), font: 'mono', bg: on ? 'rgba(255,184,77,.25)' : 'rgba(255,255,255,.9)' });
        }
        bracket(c, C1.x, cm.P.x, Y + 116, 'R = PC', sel === 'radius' ? COL.amber : COL.white, sel === 'radius');
        bracket(c, vm.P.x, C2.x, Y + 116, 'R = PC', sel === 'radius' ? COL.amber : COL.white, sel === 'radius');
        bracket(c, F1.x, cm.P.x, Y + 72, 'f = PF', sel === 'flen' ? COL.amber : COL.white, sel === 'flen');
        bracket(c, vm.P.x, F2.x, Y + 72, 'f = PF', sel === 'flen' ? COL.amber : COL.white, sel === 'flen');
        // aperture A–B
        for (const [m, x] of [[cm, cm.P.x - 42], [vm, vm.P.x + 50]]) {
          const pts = OPT.mirrorPoints(m, 2), A = pts[0], B = pts[2], on = sel === 'aperture';
          D.text(c, 'A', A.x + (m === cm ? -18 : 18), A.y - 12, { size: 20, col: hl('aperture'), font: 'mono' });
          D.text(c, 'B', B.x + (m === cm ? -18 : 18), B.y + 14, { size: 20, col: hl('aperture'), font: 'mono' });
          if (on) { c.save(); c.strokeStyle = COL.amber; c.lineWidth = 9; c.globalAlpha = .35 + .3 * glow; D.path(c, OPT.mirrorPoints(m, 30)); c.stroke(); c.restore(); }
          D.text(c, 'Aperture', x, Y - 205, { size: 18, col: hl('aperture'), bg: on ? 'rgba(255,184,77,.25)' : 'rgba(255,255,255,.9)' });
        }
        D.text(c, 'Concave mirror', cm.P.x - 170, 600, { size: 26, col: COL.amber, font: 'disp' });
        D.text(c, 'Convex mirror', vm.P.x + 170, 600, { size: 26, col: COL.magenta, font: 'disp' });
        D.text(c, 'Rays come from the left in both diagrams (exact law-of-reflection tracing).', 630, 668, { size: 17, col: COL.muted, weight: 400 });
      }
    };
  }
});

/* ---------- plane mirror lab ---------- */
LL.add({
  id: 'plane-lab', title: 'Plane mirror lab', section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 3 · Plane mirror (Grade 7 recap)', title: 'Images in a plane mirror' });
    const o = L.cv;
    let mode = 'distance', xo = 360, eye = P(180, 240), screen = false, normals = true, word = 'AMBULANCE', ph = 160, dist = 90, t = 0;
    const MX = 700, FLOOR = 570, OH = 150, SC = 10;   // 10 px per cm
    const sMode = UI.seg('Experiment', [{ v: 'distance', t: 'Where is the image?' }, { v: 'lateral', t: 'Left–right swap' }, { v: 'half', t: 'How tall a mirror?' }], mode, v => { mode = v; showCtl(); });
    const tScreen = UI.toggle('Put a screen at the image', screen, v => { screen = v; }, COL.magenta);
    const tNorm = UI.toggle('Normals and angles', normals, v => { normals = v; }, COL.amber);
    const sObj = UI.slider('Object distance', 6, 56, 1, (MX - xo) / SC, v => v + ' cm', v => { xo = MX - v * SC; });
    const inp = el('input', { type: 'text', class: 'txt', id: 'll-plane-word', value: word, maxlength: 14, 'aria-label': 'Word to reflect' });
    inp.addEventListener('input', () => { word = inp.value.toUpperCase().slice(0, 14) || ' '; });
    const wordCtl = UI.ctl('Type a word', inp);
    const sH = UI.slider('Your height', 120, 180, 1, ph, v => v + ' cm', v => { ph = v; });
    const sD = UI.slider('Distance from mirror', 40, 140, 1, dist, v => v + ' cm', v => { dist = v; });
    L.controls.append(sMode.el, el('div', { class: 'break' }), sObj.el, tScreen.el, tNorm.el, wordCtl, sH.el, sD.el);
    function showCtl() {
      [sObj.el, tScreen.el, tNorm.el].forEach(e => { e.hidden = mode !== 'distance'; });
      wordCtl.hidden = mode !== 'lateral'; sH.el.hidden = sD.el.hidden = mode !== 'half';
    }
    showCtl();
    o.cv.parentElement.append(el('div', { class: 'cv-hint', id: 'll-plane-hint' }, 'Drag the candle or the eye'));

    const ro = UI.readout([['u', 'Object to mirror'], ['v', 'Mirror to image'], ['h', 'Image height'], ['n', 'Nature']]);
    L.setPanel(UI.panel({
      predict: { q: 'You stand 2 m in front of a plane mirror. How far are you from your image?', opts: ['1 m', '2 m', '4 m', 'It depends on the mirror’s size'], ans: 2, why: 'Your image is 2 m <b>behind</b> the mirror, so it is 2 + 2 = 4 m away from you.' },
      experiment: ['<b>Where is the image?</b> Drag the candle and the eye. Compare the two distances.', 'Turn on the screen: can the image be caught on it?', '<b>Left–right swap:</b> type your name.', '<b>How tall a mirror?</b> Change your height and distance.'],
      live: UI.card('live', 'Live measurements', null, ro.el),
      observe: ['The image is as far <b>behind</b> the mirror as the object is in front.', 'The image is upright and the same size.', 'No image forms on a screen: the image is <b>virtual</b>.', 'Writing appears reversed: <b>lateral inversion</b>.', 'You need a mirror only <b>half your height</b>, at any distance.'],
      explain: '<p>Light from the candle reflects off the mirror (angle of incidence = angle of reflection) and enters the eye. The brain assumes light travels in straight lines, so it traces the rays <b>backwards</b> (dashed lines) to a point behind the mirror. No light actually goes there, so the image is <b>virtual</b>.</p>' +
        '<p><b>Characteristics:</b> (i) virtual and erect, (ii) laterally inverted, (iii) same shape and size as the object, (iv) as far behind the mirror as the object is in front of it.</p>' +
        '<p>That is why <b>AMBULANCE</b> is painted in mirror writing on the front of the vehicle: drivers ahead read it correctly in their rear-view mirrors.</p>'
    }));

    dragOn(o, {
      hit: p => mode !== 'distance' ? null : V.dist(p, eye) < 40 ? 'eye' : (Math.abs(p.x - xo) < 40 && p.y > FLOOR - OH - 60 && p.y < FLOOR + 10) ? 'obj' : null,
      move: (h, p) => {
        if (h === 'eye') eye = P(clamp(p.x, 40, MX - 40), clamp(p.y, 60, FLOOR - 20));
        else { xo = clamp(p.x, MX - 56 * SC, MX - 6 * SC); xo = MX - Math.round((MX - xo) / SC) * SC; sObj.set((MX - xo) / SC); }
      }
    });

    function drawDistance(c, now) {
      // behind-the-mirror zone
      c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(MX, 0, o.w - MX, o.h); c.restore();
      D.text(c, 'BEHIND THE MIRROR', MX + 20, 30, { size: 17, col: COL.muted, align: 'left', font: 'mono' });
      D.text(c, 'no light travels here', MX + 20, 54, { size: 17, col: COL.muted, align: 'left', weight: 400 });
      D.line(c, P(0, FLOOR), P(o.w, FLOOR), 'rgba(60,70,110,.35)', 2);
      const xi = 2 * MX - xo, T = P(xo, FLOOR - OH), B = P(xo, FLOOR - 4), IT = P(xi, FLOOR - OH), IB = P(xi, FLOOR - 4);
      if (screen) {
        c.save(); c.fillStyle = '#c9d0de'; c.fillRect(xi - 6, FLOOR - 230, 12, 230); c.restore();
        D.text(c, 'Screen: no image appears!', xi, FLOOR - 250, { size: 19, col: COL.magenta, bg: 'rgba(255,255,255,.9)' });
      }
      D.candle(c, xi, FLOOR, OH, { ghost: true, t: now });
      D.candle(c, xo, FLOOR, OH, { t: now });
      D.mirror(c, { type: 'plane', P: P(MX, 340), R: 1, a: 250, rot: 0 });
      // rays from tip and base to the eye
      let k = 0;
      for (const [S, I, col] of [[T, IT, COL.cyan], [B, IB, COL.amber]]) {
        const tH = (MX - eye.x) / (I.x - eye.x), H = P(MX, eye.y + (I.y - eye.y) * tH);
        if (H.y < 90 || H.y > 590) { k++; continue; }
        D.line(c, H, I, COL.magenta, 2, [8, 7], .85);
        D.ray(c, [S, H, eye], col, 2.6); D.arrowOn(c, S, H, col, 13); D.arrowOn(c, H, eye, col, 13);
        D.pulses(c, [S, H, eye], now + k * .3, '#fff', { speed: 220, gap: 140, r: 3.5 });
        if (normals) {
          D.line(c, P(MX - 110, H.y), P(MX, H.y), COL.amber, 1.5, [5, 5]);
          const ai = Math.atan2(S.y - H.y, S.x - H.x), ar = Math.atan2(eye.y - H.y, eye.x - H.x);
          D.angleArc(c, H, 42 + k * 16, Math.PI, ai < 0 ? ai + 2 * Math.PI : ai, col, null);
          D.angleArc(c, H, 42 + k * 16, Math.PI, ar < 0 ? ar + 2 * Math.PI : ar, col, null);
          const ang = Math.abs(Math.atan2(S.y - H.y, MX - S.x)) / DEG;
          D.text(c, `i = r = ${ang.toFixed(0)}°`, MX - 130, H.y + (k ? 22 : -22), { size: 17, col, font: 'mono', align: 'right', bg: 'rgba(255,255,255,.9)' });
        }
        k++;
      }
      D.eye(c, eye.x, eye.y, 1.2, -1);
      D.text(c, 'Eye', eye.x, eye.y - 34, { size: 18, col: COL.white });
      // distances
      const y = FLOOR + 45, u = (MX - xo) / SC;
      for (const [a, b] of [[xo, MX], [MX, xi]]) {
        D.line(c, P(a, y), P(b, y), COL.white, 2); D.line(c, P(a, y - 9), P(a, y + 9), COL.white, 2); D.line(c, P(b, y - 9), P(b, y + 9), COL.white, 2);
        D.text(c, u + ' cm', (a + b) / 2, y + 26, { size: 20, col: COL.white, font: 'mono' });
      }
      D.text(c, 'Object', xo, FLOOR - OH - 70, { size: 19, col: COL.amber });
      D.text(c, 'Image (virtual)', xi, FLOOR - OH - 70, { size: 19, col: COL.magenta });
      ro.set('u', u + ' cm'); ro.set('v', u + ' cm (behind)', true); ro.set('h', '15 cm = object height'); ro.set('n', '<span class="tag virt">Virtual</span><span class="tag green">Erect</span>');
    }

    function drawLateral(c) {
      D.text(c, 'In front of the mirror', 300, 46, { size: 22, col: COL.muted });
      D.text(c, 'What you see in the mirror', 940, 46, { size: 22, col: COL.muted });
      // card
      c.save(); c.fillStyle = '#f4f6fb'; D.rrect(c, 60, 80, 480, 150, 18); c.fill(); c.restore();
      const fs = Math.min(76, 900 / Math.max(4, word.length));
      D.text(c, word, 300, 158, { size: fs, col: '#c0182c', font: 'disp' });
      // mirror frame
      c.save(); const g = c.createLinearGradient(700, 70, 1180, 250); g.addColorStop(0, '#30406c'); g.addColorStop(1, '#1a2546');
      c.fillStyle = g; D.rrect(c, 700, 70, 480, 170, 18); c.fill(); c.lineWidth = 8; c.strokeStyle = '#9fb3d9'; c.stroke();
      c.translate(940, 158); c.scale(-1, 1); D.text(c, word, 0, 0, { size: fs, col: '#ff8a9a', font: 'disp' }); c.restore();
      D.line(c, P(620, 70), P(620, 250), COL.cyan, 3, [8, 6]);
      D.text(c, 'mirror line', 620, 264, { size: 16, col: COL.cyan, weight: 400 });
      // letter pairs
      const pairs = ['b', 'p', 'R', 'F', 'A', 'H', 'O', '3'];
      D.text(c, 'Letter and its mirror image', 630, 318, { size: 21, col: COL.white });
      pairs.forEach((ch, i) => {
        const x = 110 + i * 148;
        D.text(c, ch, x - 30, 382, { size: 52, col: COL.white, font: 'disp' });
        c.save(); c.translate(x + 30, 382); c.scale(-1, 1); D.text(c, ch, 0, 0, { size: 52, col: COL.magenta, font: 'disp' }); c.restore();
        D.line(c, P(x, 350), P(x, 414), 'rgba(10,124,255,.5)', 1.5, [4, 4]);
      });
      D.text(c, 'A, H and O look the same: they are symmetric left-to-right.', 630, 440, { size: 18, col: COL.muted, weight: 400 });
      // ambulance
      c.save(); c.fillStyle = '#f2f4f8'; D.rrect(c, 70, 490, 420, 170, 20); c.fill(); c.fillStyle = '#d7263d'; c.fillRect(70, 560, 420, 16);
      c.fillStyle = '#1b2a4a'; D.rrect(c, 110, 505, 340, 46, 8); c.fill();
      c.translate(280, 610); c.scale(-1, 1); D.text(c, 'AMBULANCE', 0, 0, { size: 38, col: '#d7263d', font: 'disp' }); c.restore();
      D.text(c, 'Painted on the front of the ambulance', 280, 680, { size: 17, col: COL.muted, weight: 400 });
      D.ray(c, [P(510, 575), P(760, 575)], COL.cyan, 3); D.arrowOn(c, P(510, 575), P(760, 575), COL.cyan, 16, .8);
      c.save(); c.fillStyle = '#25345c'; D.rrect(c, 780, 515, 400, 120, 50); c.fill(); c.lineWidth = 6; c.strokeStyle = '#9fb3d9'; c.stroke(); c.restore();
      D.text(c, 'AMBULANCE', 980, 575, { size: 40, col: '#ff6b7a', font: 'disp' });
      D.text(c, 'Seen in the rear-view mirror of the car ahead', 980, 668, { size: 17, col: COL.muted, weight: 400 });
      ro.set('u', '—'); ro.set('v', '—'); ro.set('h', '—'); ro.set('n', 'Left and right swapped', true);
    }

    function drawHalf(c) {
      const S = 3.4, floor = 655, MXh = 720, px = MXh - dist * S, eyeH = ph - 10;
      const top = floor - ph * S, eyeY = floor - eyeH * S, ix = MXh + dist * S;
      c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(MXh, 0, o.w - MXh, o.h); c.restore();
      D.line(c, P(0, floor), P(o.w, floor), 'rgba(60,70,110,.35)', 2);
      // wall
      D.line(c, P(MXh, 30), P(MXh, floor), 'rgba(160,180,230,.4)', 3);
      const mTop = floor - (ph + eyeH) / 2 * S, mBot = floor - eyeH / 2 * S;
      D.mirror(c, { type: 'plane', P: P(MXh, (mTop + mBot) / 2), R: 1, a: (mBot - mTop) / 2, rot: 0 });
      const person = (x, alpha, ghost) => {
        c.save(); c.globalAlpha = alpha; c.strokeStyle = ghost ? COL.magenta : '#e8eef9'; c.fillStyle = ghost ? 'rgba(255,79,168,.25)' : '#2a4a9a'; c.lineWidth = 4;
        if (ghost) c.setLineDash([7, 6]);
        const hr = 11 * S; c.beginPath(); c.arc(x, top + hr, hr, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); D.rrect(c, x - 22 * S * .5, top + 2 * hr, 22 * S, (ph * .42) * S, 10); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(x - 4 * S, top + 2 * hr + ph * .42 * S); c.lineTo(x - 5 * S, floor); c.moveTo(x + 4 * S, top + 2 * hr + ph * .42 * S); c.lineTo(x + 5 * S, floor); c.stroke();
        c.restore();
      };
      person(ix, .8, true); person(px, 1, false);
      D.eye(c, px + 6, eyeY, .7, -1);
      const E = P(px + 10, eyeY), Hd = P(px, top), Ft = P(px, floor);
      const mT = P(MXh, mTop), mB = P(MXh, mBot);
      D.ray(c, [Hd, mT, E], COL.cyan, 2.6); D.arrowOn(c, Hd, mT, COL.cyan); D.arrowOn(c, mT, E, COL.cyan);
      D.ray(c, [Ft, mB, E], COL.amber, 2.6); D.arrowOn(c, Ft, mB, COL.amber); D.arrowOn(c, mB, E, COL.amber);
      D.line(c, mT, P(ix, top), COL.magenta, 2, [7, 6], .8); D.line(c, mB, P(ix, floor), COL.magenta, 2, [7, 6], .8);
      // dimension
      const need = (mBot - mTop) / S;
      D.line(c, P(MXh + 26, mTop), P(MXh + 26, mBot), COL.green, 3); D.line(c, P(MXh + 16, mTop), P(MXh + 36, mTop), COL.green, 3); D.line(c, P(MXh + 16, mBot), P(MXh + 36, mBot), COL.green, 3);
      D.text(c, `Mirror needed: ${need.toFixed(0)} cm`, MXh + 46, (mTop + mBot) / 2 - 16, { size: 22, col: COL.green, align: 'left', bg: 'rgba(255,255,255,.9)' });
      D.text(c, `= ½ × ${ph} cm`, MXh + 46, (mTop + mBot) / 2 + 18, { size: 20, col: COL.green, align: 'left', font: 'mono', bg: 'rgba(255,255,255,.9)' });
      D.text(c, `Height ${ph} cm`, px - 70, top - 16, { size: 19, col: COL.white });
      D.text(c, 'Knowledge Pod: the mirror only needs to be half your height, whatever your distance.', 20, 26, { size: 18, col: COL.amber, align: 'left' });
      ro.set('u', dist + ' cm'); ro.set('v', dist + ' cm (behind)'); ro.set('h', ph + ' cm'); ro.set('n', 'Mirror needed: ' + need.toFixed(0) + ' cm', true);
    }
    return {
      reset() { mode = 'distance'; sMode.set(mode); xo = 360; sObj.set(34); eye = P(180, 240); screen = false; tScreen.set(false); normals = true; tNorm.set(true); word = 'AMBULANCE'; inp.value = word; ph = 160; sH.set(160); dist = 90; sD.set(90); showCtl(); },
      configure() {},
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o);
        $('#ll-plane-hint').hidden = mode !== 'distance';
        if (mode === 'distance') drawDistance(c, now); else if (mode === 'lateral') drawLateral(c); else drawHalf(c);
      }
    };
  }
});

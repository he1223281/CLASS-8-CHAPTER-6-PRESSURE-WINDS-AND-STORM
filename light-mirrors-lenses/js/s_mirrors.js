'use strict';
/* Scene 2: spherical mirrors cut from a sphere (3D), terms + comparison, and the plane-mirror lab */

LL.add({
  id: 'sphere', title: 'Spherical mirrors: part of an imaginary sphere', section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 2 · Activity 10.2', title: 'Curved inwards or curved outwards?' });
    const o = L.cv, cam = Cam3D(390, 360, 120);
    cam.yaw = -.9; cam.pitch = .32;
    let type = 'concave', off = 0, offT = 0, auto = true, showSphere = true, t = 0;
    const R = 1.75, capA = 38 * DEG;
    cam.dragOn(o);
    const sType = UI.seg('Reflecting side', [{ v: 'concave', t: 'Inside shines (concave)' }, { v: 'convex', t: 'Outside shines (convex)' }], type, v => { type = v; });
    const bCut = UI.btn('Lift the piece out', () => { offT = offT ? 0 : 1.15; bCut.textContent = offT ? 'Put it back' : 'Lift the piece out'; }, 'btn go');
    const tAuto = UI.toggle('Auto-rotate', auto, v => { auto = v; });
    const tSph = UI.toggle('Show whole sphere', showSphere, v => { showSphere = v; });
    const bSide = UI.btn('Side view', () => { auto = false; tAuto.set(false); cam.yaw = 0; cam.pitch = 0; }, 'btn sm');
    const sZoom = UI.slider('Zoom', 60, 200, 5, 100, v => v + '%', v => { cam.zoom = v / 100; });
    L.controls.append(sType.el, bCut, bSide, el('div', { class: 'break' }), tAuto.el, tSph.el, sZoom.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag to rotate · scroll to zoom'));

    L.setPanel(UI.panel({
      predict: { q: 'Imagine a spherical mirror as a piece of a hollow sphere. If its <b>inside</b> surface reflects light, what kind of mirror is it?', opts: ['Concave (curved inwards)', 'Convex (bulging outwards)', 'Plane'], ans: 0,
        why: 'The inside of a sphere is "bent in", like a cave: <b>con-cave</b>.' },
      experiment: ['Drag the 3D sphere to look at it from all sides.', 'Press <b>Lift the piece out</b> to separate the mirror from its imaginary sphere.', 'Press <b>Side view</b>: as in Activity 10.2, a side view shows whether the surface curves in or out.', 'Switch which side shines and watch where the shiny side faces.'],
      observe: ['The concave mirror’s shiny (reflecting) side is the <b>inside</b>, curved inwards.', 'The convex mirror’s shiny side is the <b>outside</b>, bulging outwards.', 'Seen from the side, the curve shows at once which mirror it is (Activity 10.2).'],
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

      D.text(c, type === 'concave' ? 'Shiny side: inside (curves inwards)' : 'Shiny side: outside (bulges outwards)', 390, 40, { size: 22, col: type === 'concave' ? COL.amber : COL.magenta, bg: 'rgba(255,255,255,.9)' });
      D.text(c, 'Silver = reflecting surface · brown = coated back', 390, 630, { size: 17, col: COL.muted, weight: 400 });
    }

    function frame2D(c) {
      const cx = 940, cy = 360, r = 150, aw = capA;
      c.save(); c.fillStyle = 'rgba(10,124,255,.04)'; c.fillRect(780, 0, 480, 700); c.restore();
      D.line(c, P(780, 0), P(780, 700), COL.line, 2);
      D.text(c, 'Side view (cross-section)', 1020, 40, { size: 21, col: COL.white });
      c.save(); c.setLineDash([6, 6]); c.strokeStyle = 'rgba(70,100,180,.35)'; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke(); c.restore();
            // same arc of the circle in both cases; rot = π turns the reflecting side to face right (away from C)
      const m = { type, P: P(cx + r, cy), R: r, a: r * Math.sin(aw), rot: type === 'concave' ? 0 : Math.PI };
      D.mirror(c, m);
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
      reset() { type = 'concave'; sType.set(type); offT = 0; off = 0; bCut.textContent = 'Lift the piece out'; auto = true; tAuto.set(true); showSphere = true; tSph.set(true); cam.zoom = 1; sZoom.set(100); cam.yaw = -.9; cam.pitch = .32; },
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

/* ---------- plane mirror lab ---------- */
LL.add({
  id: 'plane-lab', title: 'Plane mirror lab', section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Plane mirror (recap of Grade 7)', title: 'The image in a plane mirror' });
    const o = L.cv;
    let mode = 'distance', xo = 360, eye = P(180, 240), normals = true, word = 'AMBULANCE', t = 0;
    const MX = 700, FLOOR = 570, OH = 150, SC = 10;   // 10 px per cm
    const sMode = UI.seg('Experiment', [{ v: 'distance', t: 'Seeing the image' }, { v: 'lateral', t: 'Left–right swap' }], mode, v => { mode = v; showCtl(); });
    const tNorm = UI.toggle('Normals and angles', normals, v => { normals = v; }, COL.amber);
    const sObj = UI.slider('Object distance', 6, 56, 1, (MX - xo) / SC, v => v + ' cm', v => { xo = MX - v * SC; });
    const inp = el('input', { type: 'text', class: 'txt', id: 'll-plane-word', value: word, maxlength: 14, 'aria-label': 'Word to reflect' });
    inp.addEventListener('input', () => { word = inp.value.toUpperCase().slice(0, 14) || ' '; });
    const wordCtl = UI.ctl('Type a word', inp);
    L.controls.append(sMode.el, el('div', { class: 'break' }), sObj.el, tNorm.el, wordCtl);
    function showCtl() {
      [sObj.el, tNorm.el].forEach(e => { e.hidden = mode !== 'distance'; });
      wordCtl.hidden = mode !== 'lateral';
    }
    showCtl();
    o.cv.parentElement.append(el('div', { class: 'cv-hint', id: 'll-plane-hint' }, 'Drag the candle or the eye'));

    const ro = UI.readout([['o', 'Image is'], ['s', 'Image size'], ['l', 'Left and right']]);
    L.setPanel(UI.panel({
      predict: { q: 'You look at yourself in a plane mirror. Your image is…', opts: ['erect and the same size', 'upside down', 'smaller than you', 'bigger than you'], ans: 0, why: 'A plane mirror always forms an erect image of the same size as the object.' },
      experiment: ['<b>Seeing the image:</b> drag the candle and the eye. Follow the light from the candle to the mirror and into the eye.', 'Turn on <b>Normals and angles</b>: at the mirror, ∠i = ∠r for each ray.', '<b>Left–right swap:</b> type your name and look at its image.'],
      live: UI.card('live', 'Live measurements', null, ro.el),
      observe: ['The image is <b>erect</b> (upright) and of the <b>same size</b> as the candle.', 'Each ray reflects with ∠i = ∠r.', 'Writing appears reversed left to right: <b>lateral inversion</b>.'],
      explain: '<p>Light from the candle reflects off the mirror, obeying the laws of reflection, and enters the eye. The image seen in a plane mirror is always <b>erect</b> and of the <b>same size</b> as the object, and it is <b>laterally inverted</b>.</p>' +
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
      D.line(c, P(0, FLOOR), P(o.w, FLOOR), 'rgba(60,70,110,.35)', 2);
      const xi = 2 * MX - xo, T = P(xo, FLOOR - OH), B = P(xo, FLOOR - 4), IT = P(xi, FLOOR - OH), IB = P(xi, FLOOR - 4);

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
      D.text(c, 'Object', xo, FLOOR - OH - 70, { size: 19, col: COL.amber });
      D.text(c, 'Image', xi, FLOOR - OH - 70, { size: 19, col: COL.magenta });
      ro.set('o', 'Erect (upright)', true); ro.set('s', 'Same size as the object'); ro.set('l', 'Swapped (laterally inverted)');
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
      ro.set('o', 'Erect (upright)'); ro.set('s', 'Same size'); ro.set('l', 'Swapped (laterally inverted)', true);
    }

    return {
      reset() { mode = 'distance'; sMode.set(mode); xo = 360; sObj.set(34); eye = P(180, 240); normals = true; tNorm.set(true); word = 'AMBULANCE'; inp.value = word; showCtl(); },
      configure() {},
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o);
        $('#ll-plane-hint').hidden = mode !== 'distance';
        if (mode === 'distance') drawDistance(c, now); else drawLateral(c);
      }
    };
  }
});

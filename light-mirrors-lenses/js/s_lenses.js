'use strict';
/* Scene 8: introduction to lenses (droplet → magnifier, 3D lens shapes). Scene 10: refraction. Lens beam lab. */

const PAGE_TEXT = [
  'All of us are familiar with light. At night, when we switch',
  'on a bulb, everything in the room becomes visible. Nothing is',
  'seen when the bulb is off. During the day, we are able to see',
  'the world around us due to the light from the Sun.',
  'Light is a form of energy that allows us to see. It travels',
  'in a straight line and enables vision through emission or',
  'reflection from objects. Through it we see plants, chairs,',
  'trees and so many other things around us. In this chapter,',
  'we shall study the details about mirrors, lenses and their',
  'laws. When light falls on an object, it bounces back like a',
  'rubber ball after hitting a wall. This is reflection.'
];

LL.add({
  id: 'lens-intro', title: 'From a water drop to a magnifying glass', section: 'Lenses',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 8 · Activity 10.8', title: 'Why does a water drop make letters bigger?' });
    const o = L.cv;
    let stage = 'drop', pos = P(470, 300), hcm = 6, t = 0;
    const FM = 10;                                     // magnifier focal length (cm)
    const sStage = UI.seg('Over the text', [{ v: 'sheet', t: '1 · Flat clear sheet' }, { v: 'drop', t: '2 · Water drop' }, { v: 'mag', t: '3 · Magnifying glass' }], stage, v => { stage = v; showCtl(); });
    const sHt = UI.slider('Lens height above the page', 1, 18, .5, hcm, v => v.toFixed(1) + ' cm', v => { hcm = v; });
    L.controls.append(sStage.el, el('div', { class: 'break' }), sHt.el);
    const showCtl = () => { sHt.el.hidden = stage !== 'mag'; };
    showCtl();
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag the sheet, drop or lens over the text'));
    const ro = UI.readout([['m', 'Letters look'], ['img', 'Image']]);
    L.setPanel(UI.panel({
      predict: { q: 'A drop of water sits on a clear plastic sheet over printed words. The letters under the drop will look…', opts: ['bigger', 'smaller', 'exactly the same'], ans: 0, why: 'The curved top of the drop bends light like a tiny magnifying glass.' },
      experiment: ['Start with the <b>flat sheet</b> and drag it over the words.', 'Switch to the <b>water drop</b>, then the <b>magnifying glass</b>.', 'Raise the magnifying glass slowly with the slider.'],
      live: UI.card('live', 'What you see', null, ro.el),
      observe: ['Through a flat sheet the letters look the same size.', 'Under the curved water drop the letters look <b>larger</b>.', 'The magnifying glass enlarges more. Raised too high, the letters blur, then appear <b>upside down</b>.'],
      explain: '<p>Light bends when it passes from one transparent material into another at an angle (this is <b>refraction</b>, Scene 9). A <b>flat</b> sheet bends rays going in and out by equal and opposite amounts, so nothing changes size. A <b>curved</b> surface bends different rays by different amounts and makes them spread less, so the letters look bigger.</p><p>A piece of transparent glass or plastic with curved surfaces is a <b>lens</b>. A magnifying glass is a <b>convex lens</b>: thicker in the middle than at the edges.</p>'
    }));
    dragOn(o, { hit: p => V.dist(p, pos) < (stage === 'sheet' ? 150 : stage === 'drop' ? 90 : 140) ? 'l' : null, move: (h, p) => { pos = P(clamp(p.x, 120, 820), clamp(p.y, 110, 560)); } });

    function page(c) {
      c.fillStyle = '#f3efe6'; c.fillRect(30, 30, 870, 640);
      c.fillStyle = '#1b1b24'; c.font = `400 25px ${FONT.body}`; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      PAGE_TEXT.forEach((ln, i) => c.fillText(ln, 62, 92 + i * 52));
      c.fillStyle = '#c0182c'; c.font = `700 22px ${FONT.body}`; c.fillText('Light: Mirrors and Lenses', 62, 650);
    }
    function magInfo() {
      if (stage === 'sheet') return { m: 1, blur: 0, txt: 'The same size', img: 'No change' };
      if (stage === 'drop') { const m = 3 / (3 - 1); return { m, blur: 0, txt: 'About ' + m.toFixed(1) + '× bigger', img: 'Virtual, erect, enlarged' }; }
      const r = OPT.lensImage(-hcm, FM);
      if (r.inf || Math.abs(r.m) > 7) return { m: 7 * Math.sign(r.m || 1), blur: 12, txt: 'Very blurred', img: 'No clear image (near the focus)' };
      const blur = Math.abs(r.m) > 3.5 ? (Math.abs(r.m) - 3.5) * 2.5 : r.m < 0 ? 1.5 : 0;
      return { m: r.m, blur, txt: Math.abs(r.m).toFixed(1) + '× ' + (Math.abs(r.m) >= 1 ? 'bigger' : 'smaller') + (r.m < 0 ? ', upside down' : ''), img: r.m > 0 ? 'Virtual, erect, enlarged' : 'Real, inverted' };
    }
    function inset(c, mi) {
      const x0 = 920, y0 = 30, w = 320, h = 640;
      c.save(); c.fillStyle = 'rgba(4,8,23,.92)'; D.rrect(c, x0, y0, w, h, 16); c.fill(); c.strokeStyle = COL.line; c.lineWidth = 2; c.stroke(); c.restore();
      D.text(c, 'Side view: light from a letter', x0 + w / 2, y0 + 26, { size: 17, col: COL.muted });
      // vertical layout: page at bottom, eye at top
      const pageY = y0 + h - 60, S = stage === 'mag' ? 26 : 80, lensY = pageY - (stage === 'mag' ? hcm : 1) * S, cx = x0 + w / 2;
      c.save(); D.rrect(c, x0, y0, w, h, 16); c.clip();
      D.line(c, P(x0 + 20, pageY), P(x0 + w - 20, pageY), '#f3efe6', 5);
      D.text(c, 'page', x0 + 44, pageY + 22, { size: 15, col: COL.muted, weight: 400 });
      const objX = cx - 26;
      D.dot(c, objX, pageY - 2, 6, COL.amber);
      // element
      if (stage === 'sheet') { c.save(); c.fillStyle = 'rgba(140,220,255,.25)'; c.fillRect(x0 + 40, lensY - 6, w - 80, 12); c.restore(); }
      else if (stage === 'drop') { c.save(); c.fillStyle = 'rgba(140,220,255,.25)'; c.fillRect(x0 + 40, lensY - 3, w - 80, 6); c.fillStyle = 'rgba(120,220,255,.45)'; c.beginPath(); c.ellipse(cx, lensY - 3, 70, 26, 0, Math.PI, 0); c.fill(); c.restore(); }
      else { c.save(); c.translate(cx, lensY); c.rotate(Math.PI / 2); D.lens(c, 0, 0, 120, 'convex', { bulge: 14 }); c.restore(); }
      // rays from the letter through the element towards the eye (thin-lens, vertical)
      // thin-lens model, measured upwards from the lens: 1/v = 1/f - 1/u (u = distance of the page below the lens)
      const f = stage === 'sheet' ? Infinity : stage === 'drop' ? 3 : FM, u = (pageY - lensY) / S;
      let Ix = objX, Iy = pageY, vimg = -u;
      if (isFinite(f) && Math.abs(u - f) > .05) { vimg = 1 / (1 / f - 1 / u); const m = vimg / -u; Ix = cx + m * (objX - cx); Iy = lensY - vimg * S; }
      const nearF = isFinite(f) && Math.abs(u - f) <= .05;
      for (const dx of [-60, -20, 25, 65]) {
        const H = P(cx + dx, lensY);
        let dir;
        if (!isFinite(f)) dir = V.norm(V.sub(H, P(objX, pageY)));
        else if (nearF) dir = V.norm(V.sub(P(cx, lensY), P(objX, pageY)));
        else if (vimg > 0) dir = V.norm(V.sub(P(Ix, Iy), H));
        else dir = V.norm(V.sub(H, P(Ix, Iy)));
        if (dir.y > 0) dir = V.mul(dir, -1);
        const end = V.add(H, V.mul(dir, (H.y - (y0 + 60)) / Math.max(.2, -dir.y)));
        D.ray(c, [P(objX, pageY - 2), H, end], COL.cyan, 2);
        if (isFinite(f) && !nearF && vimg < 0) D.line(c, H, P(Ix, Iy), COL.magenta, 1.5, [6, 6], .8);
      }
      if (isFinite(f) && !nearF && Iy < y0 + h && Iy > y0) { D.dot(c, Ix, Iy, 6, COL.magenta); D.text(c, 'image', Ix - 44, Iy, { size: 15, col: COL.magenta }); }
      c.restore();
      D.eye(c, cx, y0 + 70, .9, 1);
      D.text(c, mi.txt, cx, y0 + h - 22, { size: 18, col: COL.cyan });
    }
    return {
      reset() { stage = 'drop'; sStage.set('drop'); pos = P(470, 300); hcm = 6; sHt.set(6); showCtl(); },
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o, { grid: false });
        page(c);
        const mi = magInfo();
        const r = stage === 'sheet' ? 140 : stage === 'drop' ? 78 : 125;
        c.save();
        if (stage === 'sheet') { c.beginPath(); c.rect(pos.x - r, pos.y - 100, 2 * r, 200); }
        else { c.beginPath(); c.arc(pos.x, pos.y, r, 0, Math.PI * 2); }
        c.clip();
        c.fillStyle = '#f3efe6'; c.fillRect(0, 0, o.w, o.h);
        c.translate(pos.x, pos.y);
        // uniform magnification from the thin-lens model; a negative value turns the view upside down
        c.scale(mi.m, mi.m); c.translate(-pos.x, -pos.y);
        if (mi.blur && 'filter' in c) c.filter = `blur(${mi.blur}px)`;
        page(c);
        c.restore();
        // element visuals
        c.save();
        if (stage === 'sheet') {
          c.fillStyle = 'rgba(160,220,255,.12)'; c.fillRect(pos.x - r, pos.y - 100, 2 * r, 200); c.strokeStyle = 'rgba(160,220,255,.8)'; c.lineWidth = 2; c.strokeRect(pos.x - r, pos.y - 100, 2 * r, 200);
          D.text(c, 'flat transparent sheet', pos.x, pos.y + 122, { size: 18, col: '#20406a' });
        } else if (stage === 'drop') {
          const g = c.createRadialGradient(pos.x - 25, pos.y - 30, 4, pos.x, pos.y, r);
          g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.25, 'rgba(255,255,255,.05)'); g.addColorStop(.85, 'rgba(120,190,230,.10)'); g.addColorStop(1, 'rgba(40,90,140,.55)');
          c.fillStyle = g; c.beginPath(); c.arc(pos.x, pos.y, r, 0, Math.PI * 2); c.fill();
          c.strokeStyle = 'rgba(60,110,160,.6)'; c.lineWidth = 3; c.stroke();
          D.text(c, 'water drop', pos.x, pos.y + r + 20, { size: 18, col: '#20406a' });
        } else {
          c.strokeStyle = '#2b2b33'; c.lineWidth = 16; c.beginPath(); c.arc(pos.x, pos.y, r + 6, 0, Math.PI * 2); c.stroke();
          c.strokeStyle = '#c9a24a'; c.lineWidth = 4; c.stroke();
          c.save(); c.translate(pos.x, pos.y); c.rotate(.75); c.fillStyle = '#3a2418'; D.rrect(c, r + 8, -16, 150, 32, 14); c.fill(); c.restore();
          const g = c.createLinearGradient(pos.x - r, pos.y - r, pos.x + r, pos.y + r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(.3, 'rgba(255,255,255,0)');
          c.fillStyle = g; c.beginPath(); c.arc(pos.x, pos.y, r, 0, Math.PI * 2); c.fill();
        }
        c.restore();
        inset(c, mi);
        ro.set('m', mi.txt, true); ro.set('img', mi.img);
      }
    };
  }
});

/* ---------- 3D convex and concave lenses ---------- */
LL.add({
  id: 'lens-3d', title: 'Convex and concave lenses in 3D', section: 'Lenses',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 8 · Figs 10.15 & 10.16', title: 'Thick in the middle, or thin in the middle?' });
    const o = L.cv, cam = Cam3D(630, 380, 120);
    cam.yaw = -.7; cam.pitch = .3;
    let auto = true, cut = false, rays = true, t = 0, target = null;
    cam.dragOn(o, () => { target = null; });
    const tAuto = UI.toggle('Auto-rotate', auto, v => { auto = v; });
    const tCut = UI.toggle('Cut in half (cross-section)', cut, v => { cut = v; }, COL.amber);
    const tRays = UI.toggle('Light rays', rays, v => { rays = v; }, COL.cyan);
    const sZ = UI.slider('Zoom', 60, 200, 5, 100, v => v + '%', v => { cam.zoom = v / 100; });
    const views = el('div', { class: 'ctl' }, el('span', { class: 'lbl' }, 'View'),
      UI.btn('Side (profile)', () => { target = { yaw: 0, pitch: 0 }; auto = false; tAuto.set(false); }, 'btn sm'),
      UI.btn('Face-on', () => { target = { yaw: Math.PI / 2 - .001, pitch: 0 }; auto = false; tAuto.set(false); }, 'btn sm'),
      UI.btn('3D', () => { target = { yaw: -.7, pitch: .3 }; }, 'btn sm'));
    L.controls.append(views, tCut.el, tRays.el, el('div', { class: 'break' }), tAuto.el, sZ.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag to rotate · scroll to zoom'));
    L.setPanel(UI.panel({
      predict: { q: 'Which lens is used in a magnifying glass?', opts: ['The one thicker at the centre (convex)', 'The one thinner at the centre (concave)'], ans: 0, why: 'A convex lens converges light and can make things look bigger.' },
      experiment: ['Drag to turn the lenses. Try <b>Side (profile)</b> and <b>Face-on</b>.', 'Turn on <b>Cut in half</b> to see the thickness.', 'Turn on <b>Light rays</b>.'],
      observe: ['Face-on, both lenses look like plain glass discs.', 'From the side, the <b>convex</b> lens bulges out and is <b>thicker at the centre</b>; the <b>concave</b> lens is <b>thinner at the centre</b> and thicker at the edges.', 'Parallel rays come together after a convex lens and spread apart after a concave lens.'],
      explain: '<p>A <b>convex lens</b> (converging lens) is thicker at the middle than at the edges. A <b>concave lens</b> (diverging lens) is thinner at the middle than at the edges.</p><p>A simple test: a convex lens makes nearby print look bigger; a concave lens always makes it look smaller.</p><p class="note">The rays here are the simple thin-lens picture; Scene 10 traces them exactly with Snell’s law.</p>'
    }));
    const A = 1.5, NR = 7, NS = 28;
    const prof = (type, r) => type === 'convex' ? .05 + .32 * (1 - (r / A) ** 2) : .06 + .3 * (r / A) ** 2;   // half-thickness along the axis
    function lensPolys(type, cx) {
      const polys = [], Lt = V3.norm([-.4, .6, .8]);
      const shade = (pts, n) => {
        const nv = cam.tf(n), face = nv[2] >= 0 ? nv : V3.mul(nv, -1);
        const s = .25 + .75 * Math.max(0, V3.dot(V3.norm(face), Lt)), sp = Math.pow(Math.max(0, V3.dot(V3.norm(face), V3.norm([0, .2, 1]))), 24);
        const col = type === 'convex' ? [120, 225, 255] : [255, 150, 210];
        return { pts, fill: `rgba(${Math.round(col[0] * s + 120 * sp)},${Math.round(col[1] * s + 80 * sp)},${Math.round(col[2] * s + 40 * sp)},${.34 + .4 * sp})`, stroke: `rgba(${col.join(',')},.18)`, lw: .8 };
      };
      const pt = (side, r, ph) => [cx + side * prof(type, r), r * Math.cos(ph), r * Math.sin(ph)];
      for (const side of [-1, 1]) for (let i = 0; i < NR; i++) for (let j = 0; j < NS; j++) {
        const r0 = A * i / NR, r1 = A * (i + 1) / NR, p0 = j * 2 * Math.PI / NS, p1 = (j + 1) * 2 * Math.PI / NS;
        const pts = [pt(side, r0, p0), pt(side, r1, p0), pt(side, r1, p1), pt(side, r0, p1)];
        if (cut && pts.every(q => q[2] > -1e-6)) continue;
        const rm = (r0 + r1) / 2, pm = (p0 + p1) / 2, dr = (prof(type, r1) - prof(type, r0)) / (r1 - r0);
        polys.push(shade(pts, V3.norm([side, -side * dr * Math.cos(pm), -side * dr * Math.sin(pm)])));
        void rm;
      }
      for (let j = 0; j < NS; j++) {
        const p0 = j * 2 * Math.PI / NS, p1 = (j + 1) * 2 * Math.PI / NS;
        const pts = [pt(-1, A, p0), pt(1, A, p0), pt(1, A, p1), pt(-1, A, p1)];
        if (cut && pts.every(q => q[2] > -1e-6)) continue;
        polys.push(shade(pts, [0, Math.cos((p0 + p1) / 2), Math.sin((p0 + p1) / 2)]));
      }
      if (cut) {   // the cut face in the plane z = 0
        const face = [];
        for (let i = 0; i <= 20; i++) { const r = -A + 2 * A * i / 20; face.push([cx - prof(type, Math.abs(r)), r, 0]); }
        for (let i = 20; i >= 0; i--) { const r = -A + 2 * A * i / 20; face.push([cx + prof(type, Math.abs(r)), r, 0]); }
        polys.push({ pts: face, fill: type === 'convex' ? 'rgba(120,225,255,.55)' : 'rgba(255,150,210,.55)', stroke: COL.amber, lw: 2.5, bias: .05 });
      }
      return polys;
    }
    return {
      reset() { auto = true; tAuto.set(true); cut = false; tCut.set(false); rays = true; tRays.set(true); cam.zoom = 1; sZ.set(100); target = { yaw: -.7, pitch: .3 }; },
      frame(dt, now) {
        t += dt;
        if (target) { cam.yaw += (target.yaw - cam.yaw) * Math.min(1, dt * 4); cam.pitch += (target.pitch - cam.pitch) * Math.min(1, dt * 4); }
        else if (auto && !cam.dragging) cam.yaw += dt * .3;
        const c = o.ctx; o.begin(); D.bg(o, { grid: false });
        const cxs = { convex: -2.6, concave: 2.6 };
        drawPolys(c, cam, [...lensPolys('convex', cxs.convex), ...lensPolys('concave', cxs.concave)]);
        if (rays) {
          for (const y of [-.9, -.45, .45, .9]) {
            // convex: bend at the lens plane towards F (thin lens, f = 1.9)
            const a0 = cam.proj([cxs.convex - 2.2, y, 0]), a1 = cam.proj([cxs.convex, y, 0]), a2 = cam.proj([cxs.convex + 1.9 + .6, -y * .6 / 1.9, 0]);
            D.ray(c, [a0, a1, a2], COL.cyan, 2.2, { alpha: .95 });
            const b0 = cam.proj([cxs.concave - 2.2 + 1.0, y, 0]), b1 = cam.proj([cxs.concave, y, 0]), b2 = cam.proj([cxs.concave + 1.6, y + y * 1.6 / 1.9, 0]);
            D.ray(c, [b0, b1, b2], COL.magenta, 2.2, { alpha: .95 });
            D.line(c, b1, cam.proj([cxs.concave - 1.9, 0, 0]), COL.magenta, 1.4, [5, 6], .6);
          }
          const Fc = cam.proj([cxs.convex + 1.9, 0, 0]); D.dot(c, Fc.x, Fc.y, 6, COL.amber); D.text(c, 'F', Fc.x, Fc.y + 24, { size: 20, col: COL.amber, font: 'mono' });
          const Fv = cam.proj([cxs.concave - 1.9, 0, 0]); D.text(c, 'F', Fv.x, Fv.y + 24, { size: 20, col: COL.magenta, font: 'mono' });
        }
        const l1 = cam.proj([cxs.convex, A + .7, 0]), l2 = cam.proj([cxs.concave, A + .7, 0]);
        D.text(c, 'Convex lens', l1.x, l1.y - 18, { size: 26, col: COL.cyan, font: 'disp' });
        D.text(c, 'thicker at the centre', l1.x, l1.y + 14, { size: 19, col: COL.white, weight: 400 });
        D.text(c, 'Concave lens', l2.x, l2.y - 18, { size: 26, col: COL.magenta, font: 'disp' });
        D.text(c, 'thinner at the centre', l2.x, l2.y + 14, { size: 19, col: COL.white, weight: 400 });
      }
    };
  }
});

/* ---------- refraction ---------- */
const MEDIA = { air: { n: 1.0, name: 'Air', col: 'rgba(30,50,110,.0)' }, water: { n: 1.33, name: 'Water', col: 'rgba(40,120,220,.22)' }, glass: { n: 1.5, name: 'Glass', col: 'rgba(120,220,255,.24)' } };
LL.add({
  id: 'refraction', title: 'Refraction: why light bends', section: 'Lenses',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 9 · Refraction (extension)', title: 'Light changes speed, and so it changes direction' });
    const o = L.cv, O = P(630, 360), LS = 420;
    let m1 = 'air', m2 = 'glass', iDeg = 40, waves = true, t = 0;
    const s1 = UI.seg('From', ['air', 'water', 'glass'].map(v => ({ v, t: MEDIA[v].name })), m1, v => { m1 = v; });
    const s2 = UI.seg('Into', ['air', 'water', 'glass'].map(v => ({ v, t: MEDIA[v].name })), m2, v => { m2 = v; });
    const sI = UI.slider('Angle of incidence', 0, 80, 1, iDeg, v => v + '°', v => { iDeg = v; });
    const tW = UI.toggle('Wavefronts (crests of the light wave)', waves, v => { waves = v; }, COL.amber);
    L.controls.append(s1.el, s2.el, el('div', { class: 'break' }), sI.el, tW.el);
    o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag the light source'));
    const ro = UI.readout([['sp', 'Speed of light'], ['i', 'Angle of incidence'], ['r', 'Angle of refraction'], ['b', 'Bends']]);
    L.setPanel(UI.panel({
      predict: { q: 'A ray of light goes from air into glass at an angle. What happens to it?', opts: ['It goes straight on', 'It bends towards the normal', 'It bends away from the normal'], ans: 1, why: 'Light slows down in glass, so it bends towards the normal.' },
      experiment: ['Drag the source or use the slider to change the angle.', 'Try <b>0°</b>: straight down the normal.', 'Swap the materials: <b>Glass → Air</b>.', 'Watch the wavefronts squeeze together in the slower material.'],
      live: UI.card('live', 'Measurements', null, ro.el),
      observe: ['Entering a slower (denser) material, light bends <b>towards</b> the normal.', 'Leaving it, light bends <b>away</b> from the normal.', 'Along the normal (0°) light does not bend, it only slows down.', 'A little light is always reflected too.'],
      explain: '<p><b>Refraction</b> is the change in direction of light when it passes at an angle from one transparent material into another. It happens because light travels at different speeds in different materials: fastest in air, slower in water, slower still in glass.</p><p>Look at the wavefronts: the side of the beam that enters glass first slows down first, so the whole beam swings round, like a toy car whose front wheel runs from a smooth floor onto a carpet.</p><p><b>Mirrors reflect</b> light back. <b>Lenses refract</b> light as it passes through their curved surfaces.</p><p class="note">This scene extends the chapter’s lens introduction. Angles follow Snell’s law, n₁ sin i = n₂ sin r, which you will meet in higher classes.</p>'
    }));
    dragOn(o, { hit: p => p.y < O.y && V.dist(p, src()) < 60 ? 's' : null, move: (h, p) => { iDeg = clamp(Math.round(Math.atan2(O.x - p.x, O.y - p.y) / DEG), 0, 80); sI.set(iDeg); } });
    function src() { const a = iDeg * DEG; return P(O.x - Math.sin(a) * LS, O.y - Math.cos(a) * LS); }
    return {
      reset() { m1 = 'air'; m2 = 'glass'; s1.set(m1); s2.set(m2); iDeg = 40; sI.set(40); waves = true; tW.set(true); },
      replay() { t = 0; },
      frame(dt, now) {
        t += dt; const c = o.ctx; o.begin(); D.bg(o);
        const n1 = MEDIA[m1].n, n2 = MEDIA[m2].n, a = iDeg * DEG;
        c.save(); c.fillStyle = MEDIA[m1].col; c.fillRect(0, 0, o.w, O.y); c.fillStyle = MEDIA[m2].col; c.fillRect(0, O.y, o.w, o.h - O.y); c.restore();
        D.line(c, P(0, O.y), P(o.w, O.y), 'rgba(200,230,255,.7)', 2);
        D.text(c, MEDIA[m1].name + '  (n = ' + n1.toFixed(2) + ')', 24, 30, { size: 22, col: COL.white, align: 'left' });
        D.text(c, MEDIA[m2].name + '  (n = ' + n2.toFixed(2) + ')', 24, O.y + 34, { size: 22, col: COL.white, align: 'left' });
        D.line(c, P(O.x, O.y - 330), P(O.x, O.y + 330), COL.amber, 2, [10, 7]);
        D.text(c, 'normal', O.x + 12, O.y - 316, { size: 17, col: COL.amber, align: 'left' });
        const S = src(), din = V.norm(V.sub(O, S));
        const s2r = n1 * Math.sin(a) / n2, tir = s2r > 1;
        const rr = tir ? null : Math.asin(s2r);
        const E = tir ? null : P(O.x + Math.sin(rr) * LS, O.y + Math.cos(rr) * LS);
        const Rf = P(O.x + Math.sin(a) * LS, O.y - Math.cos(a) * LS);
        D.ray(c, [O, Rf], COL.cyan, 2, { alpha: tir ? 1 : .22, glow: tir });
        // wavefronts: three parallel rays, pulses travel at speed 1/n
        if (waves) {
          const perp = P(-din.y, din.x), offs = [-46, -23, 0, 23, 46];
          const dout = tir ? null : V.norm(V.sub(E, O));
          const v1 = 150 / n1, v2 = 150 / n2, period = .55;
          const paths = offs.map(k => {
            const s = V.add(S, V.mul(perp, k));
            const tt = (O.y - s.y) / din.y, hit = V.add(s, V.mul(din, tt));
            return { s, hit, L1: tt };
          });
          for (let j = 0; j < 14; j++) {
            const tau = ((t / period) % 1 + j) * period;
            const pts = paths.map(p => {
              const d = tau * v1;
              if (d <= p.L1 || tir) return V.add(p.s, V.mul(din, Math.min(d, p.L1 + (tir ? 0 : 0))));
              const rem = (tau - p.L1 / v1) * v2; return V.add(p.hit, V.mul(dout, rem));
            });
            if (pts.some(q => q.y > O.y + 340 || q.x > o.w || q.x < 0)) continue;
            c.save(); c.strokeStyle = 'rgba(255,184,77,.75)'; c.lineWidth = 2.5; D.path(c, pts); c.stroke(); c.restore();
          }
        }
        D.ray(c, [S, O], COL.cyan, 3.2); D.arrowOn(c, S, O, COL.cyan, 15, .55);
        if (!tir) { D.ray(c, [O, E], COL.magenta, 3.2); D.arrowOn(c, O, E, COL.magenta, 15, .55); D.line(c, O, V.add(O, V.mul(din, 300)), 'rgba(255,255,255,.35)', 1.5, [4, 6]); D.text(c, 'if it did not bend', O.x + din.x * 300 + 8, O.y + din.y * 300, { size: 15, col: COL.muted, align: 'left', weight: 400 }); }
        D.dot(c, S.x, S.y, 12, '#fff6c8');
        if (iDeg > 0) D.angleArc(c, O, 90, -Math.PI / 2 - a, -Math.PI / 2, COL.cyan, 'i = ' + iDeg + '°', 128);
        if (!tir && rr > .002) D.angleArc(c, O, 90, Math.PI / 2 - rr, Math.PI / 2, COL.magenta, 'r = ' + (rr / DEG).toFixed(1) + '°', 128);
        if (tir) D.text(c, 'No light gets out: total internal reflection (higher classes)', O.x, O.y + 120, { size: 21, col: COL.amber, bg: 'rgba(4,8,23,.85)' });
        ro.set('sp', `${MEDIA[m1].name}: ${(300 / n1).toFixed(0)}k → ${MEDIA[m2].name}: ${(300 / n2).toFixed(0)}k km/s`);
        ro.set('i', iDeg + '°'); ro.set('r', tir ? '— (no refracted ray)' : (rr / DEG).toFixed(1) + '°', true);
        ro.set('b', tir ? 'All reflected back' : iDeg === 0 || n1 === n2 ? 'Not at all' : n2 > n1 ? 'Towards the normal' : 'Away from the normal');
      }
    };
  }
});

/* ---------- parallel beams through a plate and lenses (exact Snell) ---------- */
function lensGeom(type, X, Y, R, a) {
  const sag = R - Math.sqrt(R * R - a * a);
  return { type, X, Y, R, a, tc: type === 'convex' ? 2 * sag + 8 : type === 'concave' ? 10 : 52 };
}
function drawLensBeam(c, o, Lg, opt, now) {
  const { n, spacing, tilt, showF, showNormals, showBack, prog } = opt;
  const d = P(Math.cos(tilt), Math.sin(tilt));
  for (let k = 0; k < n; k++) {
    const off = (k - (n - 1) / 2) * spacing, x0 = 16;
    const start = P(x0, Lg.Y + off - (Lg.X - x0) * Math.tan(tilt));
    const r = OPT.traceLens(Lg, start, d, 1.5, 1600);
    const pts = r.pts, Lp = D.polyLen(pts), pr = prog();
    D.ray(c, D.upTo(pts, Lp * pr), COL.cyan, 2.4, { alpha: r.miss ? .3 : 1 });
    if (pr >= 1 && !r.miss) { D.arrowOn(c, pts[0], pts[1], COL.cyan, 12, .5); D.arrowOn(c, pts[2], pts[3], COL.cyan, 12, .2); D.pulses(c, pts, now + k * .05, '#fff', { speed: 260, gap: 170, r: 3, limit: 1500 }); }
    if (showNormals && !r.miss && r.n1) { D.line(c, V.sub(r.in1, V.mul(r.n1, 40)), V.add(r.in1, V.mul(r.n1, 40)), COL.amber, 1.4, [4, 5], .9); D.line(c, V.sub(r.exit, V.mul(r.n2, 40)), V.add(r.exit, V.mul(r.n2, 40)), COL.amber, 1.4, [4, 5], .9); }
    if (showBack && Lg.type === 'concave' && pr >= 1 && r.out) D.line(c, r.exit, V.sub(r.exit, V.mul(r.out, 520)), COL.magenta, 1.6, [7, 7], .75);
  }
  const outline = OPT.lensOutline(Lg);
  c.save(); D.path(c, outline); c.closePath(); c.fillStyle = 'rgba(120,225,255,.18)'; c.fill(); c.strokeStyle = 'rgba(160,240,255,.95)'; c.lineWidth = 2.5; c.stroke(); c.restore();
  if (showF && Lg.type !== 'plate') {
    const fx = OPT.lensFocusX(Lg);
    if (fx != null && fx > 0 && fx < o.w) {
      const real = Lg.type === 'convex';
      if (real) D.dot(c, fx, Lg.Y, 7, COL.amber); else { c.save(); c.strokeStyle = COL.magenta; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.beginPath(); c.arc(fx, Lg.Y, 9, 0, Math.PI * 2); c.stroke(); c.restore(); }
      D.text(c, real ? 'F' : 'F (virtual)', fx, Lg.Y + 30, { size: 20, col: real ? COL.amber : COL.magenta, font: 'mono', bg: 'rgba(4,8,23,.7)' });
    }
  }
}

LL.add({
  id: 'lens-beams', title: 'Parallel rays through glass shapes', section: 'Lenses',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 10 · Activity 10.10', title: 'Flat glass, convex lens, concave lens' });
    const o = L.cv;
    const st = { type: 'convex', n: 9, spacing: 34, tilt: 0, showF: true, showNormals: false, showBack: true, tt: 0 };
    const sT = UI.seg('Shape', [{ v: 'plate', t: 'Flat plate' }, { v: 'convex', t: 'Convex' }, { v: 'concave', t: 'Concave' }, { v: 'all', t: 'Compare all 3' }], st.type, v => { st.type = v; st.tt = 0; });
    const sN = UI.slider('Rays', 3, 15, 1, st.n, v => String(v), v => { st.n = v; });
    const sS = UI.slider('Spacing', 12, 44, 2, st.spacing, v => v + ' px', v => { st.spacing = v; });
    const sTl = UI.slider('Tilt the beam', -20, 20, 1, 0, v => v + '°', v => { st.tilt = v * DEG; });
    const tF = UI.toggle('Focus F', true, v => { st.showF = v; }, COL.amber);
    const tN = UI.toggle('Normals', false, v => { st.showNormals = v; }, COL.amber);
    const tB = UI.toggle('Dashed back-lines', true, v => { st.showBack = v; }, COL.magenta);
    L.controls.append(sT.el, sN.el, el('div', { class: 'break' }), sS.el, sTl.el, tF.el, tN.el, tB.el);
    L.setPanel(UI.panel({
      predict: { q: 'Why do parallel rays come together after a <b>convex</b> lens but spread apart after a <b>concave</b> lens?', opts: ['Because the glass is a different colour', 'Because the curved surfaces meet each ray at a different angle, so each ray bends by a different amount', 'Because light speeds up inside glass'], ans: 1, why: 'Turn on the normals: they tilt more and more towards the edges of the lens.' },
      experiment: ['Compare the flat plate, the convex lens and the concave lens.', 'Turn on <b>Normals</b> at both surfaces.', '<b>Tilt the beam</b> through the flat plate.'],
      observe: ['<b>Flat plate:</b> rays come out parallel to how they went in. When tilted, they are shifted sideways a little.', '<b>Convex lens:</b> rays converge and really meet near F: a <b>converging lens</b>.', '<b>Concave lens:</b> rays diverge, as if from F on the same side as the light (virtual focus): a <b>diverging lens</b>.', 'Edge rays of a strongly curved lens cross slightly nearer the lens.'],
      explain: '<p>At each surface, light obeys the rule of refraction: it bends towards the normal entering glass and away from it leaving. In a flat plate both surfaces are parallel, so the two bends cancel.</p><p>In a convex lens, the surfaces tilt so that rays near the edge are bent more towards the axis, so all rays head for one point. In a concave lens the tilt is the other way, so rays are bent away from the axis.</p><p class="note">Exact ray tracing with Snell’s law for glass (n = 1.5) and real spherical surfaces; F is found by tracing a ray very close to the axis.</p>'
    }));
    return {
      reset() { Object.assign(st, { type: 'convex', n: 9, spacing: 34, tilt: 0, showF: true, showNormals: false, showBack: true, tt: 0 }); sT.set('convex'); sN.set(9); sS.set(34); sTl.set(0); tF.set(true); tN.set(false); tB.set(true); },
      replay() { st.tt = 0; },
      onShow() { st.tt = 0; },
      frame(dt, now) {
        st.tt += dt; const c = o.ctx; o.begin(); D.bg(o);
        const prog = () => clamp(st.tt / 2, 0, 1);
        const base = { tilt: st.tilt, showF: st.showF, showNormals: st.showNormals, showBack: st.showBack, prog };
        if (st.type !== 'all') {
          D.axis(c, 350, 0, o.w, null);
          drawLensBeam(c, o, lensGeom(st.type, 560, 350, 420, 170), { ...base, n: st.n, spacing: st.spacing }, now);
          const msg = { plate: 'Flat plate: rays stay parallel', convex: 'Convex lens: rays converge (converging lens)', concave: 'Concave lens: rays diverge (diverging lens)' }[st.type];
          D.text(c, msg, 630, 34, { size: 24, col: st.type === 'concave' ? COL.magenta : st.type === 'convex' ? COL.amber : COL.cyan, bg: 'rgba(4,8,23,.85)' });
        } else {
          ['plate', 'convex', 'concave'].forEach((tp, i) => {
            const y = 118 + i * 232;
            c.save(); c.beginPath(); c.rect(0, y - 116, o.w, 232); c.clip();
            D.axis(c, y, 0, o.w, null);
            drawLensBeam(c, o, lensGeom(tp, 560, y, 240, 92), { ...base, n: Math.min(st.n, 7), spacing: Math.min(st.spacing, 26) }, now);
            c.restore();
            D.text(c, { plate: 'Flat plate', convex: 'Convex lens', concave: 'Concave lens' }[tp], 16, y - 92, { size: 22, col: tp === 'concave' ? COL.magenta : tp === 'convex' ? COL.amber : COL.cyan, align: 'left', font: 'disp' });
            if (i < 2) D.line(c, P(0, y + 116), P(o.w, y + 116), COL.line, 2);
          });
        }
      }
    };
  }
});

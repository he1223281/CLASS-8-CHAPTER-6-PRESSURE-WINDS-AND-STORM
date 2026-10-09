'use strict';
/* Scene 12: lenses around us — magnifier, eyeglasses, phone camera, microscope, telescope, human eye.
   All paths use the thin-lens model (paraxial ray transfer), in pixels; diagrams are not to scale. */

const LAPPS = {
  magnifier: { name: 'Magnifying glass', lens: 'Convex lens', img: 'Virtual, erect, enlarged',
    how: 'The object is placed closer to the lens than its focus F. The rays leaving the lens spread out as if they came from a larger, upright image behind the object. Activity 10.8 and Exercise 8.' },
  glasses: { name: 'Eyeglasses', lens: 'Concave or convex lens', img: 'Helps the eye form a sharp image on the retina',
    how: '<b>Short sight:</b> the eye focuses far-away objects in front of the retina; a <b>concave</b> lens spreads the rays a little so they focus on the retina. <b>Long sight:</b> near objects focus behind the retina; a <b>convex</b> lens converges the rays a little. The curved line on some reading glasses separates two lenses (bifocals): one part for far, one for near.' },
  camera: { name: 'Smartphone camera', lens: 'Convex lens (a stack of tiny lenses)', img: 'Real, inverted, diminished on the sensor',
    how: 'The lens forms a small, upside-down real image on the light sensor. To focus on near or far objects, the lens moves slightly (autofocus) so the image stays sharp on the sensor. The phone flips the picture upright for you.' },
  microscope: { name: 'Microscope', lens: 'Two convex lenses', img: 'Virtual, inverted, highly enlarged',
    how: 'The <b>objective</b> lens, very close to the tiny specimen, forms a real, enlarged, inverted image inside the tube. The <b>eyepiece</b> works like a magnifying glass on that image and enlarges it again.' },
  telescope: { name: 'Telescope (refracting)', lens: 'Two convex lenses', img: 'Far objects look bigger and brighter',
    how: 'Light from a distant star arrives as parallel rays. The big <b>objective</b> lens collects it and brings it to a focus; the <b>eyepiece</b> sends it to the eye at a larger angle, so the star or planet looks bigger. Large modern telescopes use a concave mirror instead (Scene 7).' },
  eye: { name: 'Human eye', lens: 'Convex lens (plus the curved cornea)', img: 'Real, inverted, diminished on the retina',
    how: 'The eye lens forms a tiny upside-down image on the retina; the brain makes us see it upright. Eye muscles change the lens shape: <b>thicker</b> for near objects, <b>thinner</b> for far ones. This is how we can read a book and then look far away.' }
};

LL.add({
  id: 'lens-apps', title: 'Lenses around us', section: 'Lenses',
  build(root) {
    const L = labLayout(root, { kicker: 'Scene 12 · Applications of lenses', title: 'Where are lenses used?' });
    const o = L.cv, Y = 340;
    const st = { tab: 'magnifier', mu: 5, cond: 'myopia', wear: false, camU: 600, starA: 2, eyeD: 60, camV: 160, eyeF: 180, t: 0 };
    const sTab = UI.seg(null, Object.keys(LAPPS).map(k => ({ v: k, t: LAPPS[k].name.replace(' (refracting)', '') })), st.tab, v => { st.tab = v; show(); });
    const cMu = UI.slider('Lens distance from object', 2, 7.5, .25, st.mu, v => v.toFixed(2) + ' cm', v => { st.mu = v; });
    const cCond = UI.seg('Eye', [{ v: 'myopia', t: 'Short sight' }, { v: 'hyper', t: 'Long sight' }], st.cond, v => { st.cond = v; });
    const cWear = UI.toggle('Wear the correct glasses', false, v => { st.wear = v; }, COL.green);
    const cCam = UI.slider('Object distance', 300, 2000, 10, st.camU, v => (v / 10).toFixed(0) + ' cm', v => { st.camU = v; });
    const cStar = UI.slider('Star direction', 0, 4, .1, st.starA, v => v.toFixed(1) + '°', v => { st.starA = v; });
    const cEye = UI.slider('Object distance', 25, 300, 5, st.eyeD, v => v + ' cm', v => { st.eyeD = v; });
    L.controls.append(sTab.el, el('div', { class: 'break' }), cMu.el, cCond.el, cWear.el, cCam.el, cStar.el, cEye.el);
    const nm = el('div', { class: 'q', style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0' });
    const how = el('p');
    const live = UI.card('live', 'This device', null, nm, el('p', { class: 'note', id: 'll-lapps-img' }), how);
    L.setPanel(UI.panel({
      predict: { q: 'Our eye has a lens inside it. What kind of lens is it?', opts: ['Convex lens', 'Concave lens', 'A flat glass plate'], ans: 0, why: 'The eye lens is convex, and it can change its shape to see near and far objects.' },
      live,
      experiment: ['Choose a device from the tabs.', 'Use the slider or toggle under each one.', 'Follow the light from the object to the image.'],
      explain: '<p>Every device here bends light with lenses to form an image where we need it: on a sensor (camera), on the retina (eye), or as an enlarged virtual image for our eye (magnifier, microscope, telescope).</p><p class="note">Diagrams use the thin-lens model and are not to scale.</p>'
    }));
    function show() {
      cMu.el.hidden = st.tab !== 'magnifier'; cCond.el.hidden = cWear.el.hidden = st.tab !== 'glasses'; cCam.el.hidden = st.tab !== 'camera'; cStar.el.hidden = st.tab !== 'telescope'; cEye.el.hidden = st.tab !== 'eye';
      const a = LAPPS[st.tab];
      nm.innerHTML = ''; nm.append(el('span', null, a.name), el('span', { class: 'badge lens' }, a.lens));
      $('#ll-lapps-img', live).innerHTML = '<b>Image:</b> ' + a.img; how.innerHTML = a.how;
    }
    show();
    const box = { x0: 0, y0: 0, x1: o.w, y1: o.h };
    const sy = y => Y - y;                                    // math y (up) → screen y
    const drawTrace = (tr, col, w = 2.4, alpha = 1) => D.ray(c0(), tr.pts.map(([x, y]) => P(x, sy(y))), col, w, { alpha });
    let C;
    const c0 = () => C;
    function lensRays(X, f, T, img, on = { r1: true, r2: true, r3: true }) {
      const R = OPT.labRays({ kind: 'lens', type: f > 0 ? 'convex' : 'concave', X, Y, s: 1, f, T, img, a: 260, on, box });
      for (const r of R.rays) if (r.inc) { D.ray(C, [r.inc[0], r.inc[1], r.out[1]], r.col, 2.4); D.arrowOn(C, r.inc[0], r.inc[1], r.col); if (r.back) D.line(C, r.back[0], r.back[1], r.col, 1.8, [7, 6], .85); }
      return R;
    }
    function eyeball(c, x, D_, lensF, label = true) {
      const r = D_ / 2 + 30, cx = x + D_ - r;          // retina (back of the eyeball) sits exactly D_ behind the lens
      c.save(); c.fillStyle = 'rgba(150,170,210,.12)'; c.strokeStyle = '#8a94ad'; c.lineWidth = 3;
      c.beginPath(); c.arc(cx, Y, r, 0, Math.PI * 2); c.fill(); c.stroke();
      c.strokeStyle = '#ff6b7a'; c.lineWidth = 6; c.beginPath(); c.arc(cx, Y, r - 3, -.75, .75); c.stroke();      // retina
      c.fillStyle = '#3a6fd8'; c.fillRect(x - 8, Y - 64, 6, 40); c.fillRect(x - 8, Y + 24, 6, 40);                // iris
      c.strokeStyle = 'rgba(160,240,255,.8)'; c.lineWidth = 2.5; c.beginPath(); c.arc(cx + 4, Y, r + 4, Math.PI - .5, Math.PI + .5); c.stroke(); // cornea
      c.fillStyle = '#c9b8a8'; c.fillRect(cx + r - 4, Y + 18, 70, 20);                                            // optic nerve
      c.restore();
      const thick = clamp(3000 / lensF, 10, 30);
      D.lens(c, x, Y, 52, 'convex', { bulge: thick });
      if (label) { D.text(c, 'retina', cx + r - 10, Y - r * .72, { size: 16, col: '#ff8a96' }); D.text(c, 'eye lens', x, Y - 78, { size: 16, col: COL.cyan }); D.text(c, 'optic nerve', cx + r + 40, Y + 58, { size: 15, col: COL.muted, weight: 400 }); }
      return x + D_;
    }
    const tabs = {
      magnifier(c, now) {
        const X = 760, f = 200, uPx = st.mu * 20, T = P(X - uPx, Y - 34);
        const img = OPT.lensImage(-uPx, f);
        D.axis(c, Y, 0, o.w, null); D.mark(c, X - f, Y, 'F₁'); D.mark(c, X + f, Y, 'F₂');
        lensRays(X, f, T, img);
        D.lens(c, X, Y, 230, 'convex'); D.arrowObj(c, T.x, Y, 34, COL.amber); D.text(c, 'tiny print', T.x, Y + 56, { size: 18, col: COL.amber, bg: 'rgba(255,255,255,.9)' });
        const I = P(X + img.v, Y - img.m * 34);
        if (I.x > 0) { D.arrowObj(c, I.x, Y, Y - I.y, COL.magenta, { dashed: true }); D.text(c, 'enlarged image ×' + img.m.toFixed(1), I.x, I.y - 26, { size: 19, col: COL.magenta, bg: 'rgba(255,255,255,.9)' }); }
        D.eye(c, 1130, Y - 20, 1.2, 1); D.text(c, 'eye', 1130, Y - 60, { size: 17, col: COL.white });
        void now;
      },
      glasses(c, now) {
        const ex = 820, Dr = 220, my = st.cond === 'myopia';
        const fe = my ? 190 : 240;                                   // eye too strong (short sight) / too weak (long sight)
        const gx = 700, objX = 170;
        const U = 1 / (1 / Dr - 1 / fe);                                // where the eye needs its object to be (cartesian, from eye lens)
        const v1 = ex + U - gx, u1 = my ? -Infinity : -(gx - objX);
        const fg = my ? v1 : 1 / (1 / v1 - 1 / u1);              // lens formula 1/f = 1/v - 1/u
        const retX = eyeball(c, ex, Dr, fe);
        D.axis(c, Y, 0, o.w, null);
        const lenses = (st.wear ? [{ x: gx, f: fg }] : []).concat([{ x: ex, f: fe }]);
        const heights = [-42, -20, 20, 42];
        let focusX = null;
        for (const hh of heights) {
          let x0, y0, s;
          if (my) { x0 = 20; y0 = hh; s = 0; } else { x0 = objX; y0 = 0; s = hh / ((st.wear ? gx : ex) - objX); }
          const tr = OPT.thinTrace(x0, y0, s, lenses, retX);
          drawTrace(tr, COL.cyan, 2.2);
          const last = tr.pts[tr.pts.length - 2], sl = tr.slope;
          focusX = last[0] - last[1] / sl;
          if (focusX > retX) D.line(c, P(retX, sy(tr.pts[tr.pts.length - 1][1])), P(focusX, Y), COL.cyan, 1.5, [5, 6], .6);
        }
        if (my) D.text(c, 'light from a far-away object (parallel rays)', 30, Y - 80, { size: 17, col: COL.cyan, align: 'left' });
        else { D.arrowObj(c, objX, Y, 40, COL.amber); D.text(c, 'book held close', objX, Y + 28, { size: 17, col: COL.amber }); }
        if (st.wear) { D.lens(c, gx, Y, 90, fg > 0 ? 'convex' : 'concave', { bulge: 14 }); D.text(c, (fg > 0 ? 'convex' : 'concave') + ' spectacle lens', gx, Y - 112, { size: 17, col: COL.green }); }
        const sharp = Math.abs(focusX - retX) < 8;
        D.dot(c, focusX, Y, 6, sharp ? COL.green : COL.amber);
        D.text(c, sharp ? 'Sharp image on the retina' : focusX < retX ? 'Focus falls in front of the retina: blurred' : 'Focus falls behind the retina: blurred', 630, 40, { size: 22, col: sharp ? COL.green : COL.amber, bg: 'rgba(255,255,255,.9)' });
        D.text(c, my ? 'Short sight (myopia): far things look blurred' : 'Long sight (hypermetropia): near things look blurred', 630, 74, { size: 19, col: COL.white, weight: 400, bg: 'rgba(255,255,255,.9)' });
        void now;
      },
      camera(c, now) {
        const X = 620, f = 150, uPx = st.camU, h = 140;
        const img = OPT.lensImage(-uPx, f);
        st.camV += (img.v - st.camV) * .12;
        c.save(); c.fillStyle = '#1a2033'; c.strokeStyle = '#59627f'; c.lineWidth = 3; D.rrect(c, X - 40, Y - 150, 420, 300, 26); c.fill(); c.stroke(); c.restore();
        D.text(c, 'phone camera module (side view)', X + 170, Y - 170, { size: 17, col: COL.muted });
        D.axis(c, Y, 0, o.w, null);
        const T = P(X - uPx, Y - h);
        lensRays(X, f, T, img, { r1: true, r2: true, r3: true });
        D.lens(c, X, Y, 110, 'convex', { bulge: 20 });
        const sx = X + st.camV;
        c.save(); c.fillStyle = '#3fe68f'; c.fillRect(sx, Y - 120, 10, 240); c.restore();
        D.text(c, 'sensor', sx + 5, Y + 140, { size: 17, col: COL.green });
        D.arrowObj(c, X + img.v, Y, img.m * h, COL.cyan, { w: 4 });
        if (T.x > 0) D.arrowObj(c, T.x, Y, h, COL.amber, { label: 'object' }); else D.text(c, '← object far away (off screen)', 20, Y - h - 20, { size: 18, col: COL.amber, align: 'left' });
        D.text(c, `image ×${Math.abs(img.m).toFixed(2)}, upside down`, X + img.v + 30, Y + 70, { size: 18, col: COL.cyan, align: 'left', bg: 'rgba(255,255,255,.9)' });
        D.text(c, 'Autofocus: the lens–sensor gap changes so the image stays sharp', 630, 34, { size: 19, col: COL.white, bg: 'rgba(255,255,255,.9)' });
        void now;
      },
      microscope(c, now) {
        const xo = 330, fo = 70, uo = 85, h = 16, xe0 = 0;
        const v1 = 1 / (1 / fo - 1 / uo), I1x = xo + v1, m1 = -v1 / uo, xe = I1x + 90, fe = 120;
        const u2 = -(xe - I1x), v2 = 1 / (1 / fe + 1 / u2), m2 = v2 / u2, Fx = xe + v2;
        c.save(); c.strokeStyle = 'rgba(70,80,120,.55)'; c.lineWidth = 3; c.strokeRect(xo - 10, Y - 120, xe - xo + 20, 240); c.restore();
        D.axis(c, Y, 0, o.w, null);
        const objX = xo - uo;
        const lenses = [{ x: xo, f: fo }, { x: xe, f: fe }];
        for (const hh of [h, 0, -18]) {
          const s = (hh - h) / uo;
          const tr = OPT.thinTrace(objX, h, s, lenses, 1200);
          drawTrace(tr, hh === h ? COL.r1 : hh === 0 ? COL.r3 : COL.r2, 2.2);
          const last = tr.pts[tr.pts.length - 2];
          D.line(c, P(last[0], sy(last[1])), P(Fx, sy(h * m1 * m2)), hh === h ? COL.r1 : hh === 0 ? COL.r3 : COL.r2, 1.5, [6, 6], .7);
        }
        D.lens(c, xo, Y, 90, 'convex', { bulge: 22 }); D.lens(c, xe, Y, 110, 'convex', { bulge: 14 });
        D.arrowObj(c, objX, Y, h, COL.amber, { label: 'specimen' });
        D.arrowObj(c, I1x, Y, h * m1, COL.cyan, { w: 4 }); D.text(c, 'first image (real)', I1x, sy(h * m1) + 22, { size: 16, col: COL.cyan, bg: 'rgba(255,255,255,.9)' });
        D.arrowObj(c, Fx, Y, h * m1 * m2, COL.magenta, { dashed: true }); D.text(c, `final image ×${Math.abs(m1 * m2).toFixed(0)}`, Fx, sy(h * m1 * m2) + 24, { size: 18, col: COL.magenta, bg: 'rgba(255,255,255,.9)' });
        D.text(c, 'objective', xo, Y - 140, { size: 17, col: COL.white }); D.text(c, 'eyepiece', xe, Y - 140, { size: 17, col: COL.white });
        D.eye(c, 1200, Y, 1.1, 1);
        void now; void xe0;
      },
      telescope(c, now) {
        const xo = 140, fo = 520, fe = 130, xe = xo + fo + fe, a = st.starA * DEG, s = -Math.tan(a);
        c.save(); c.strokeStyle = 'rgba(70,80,120,.55)'; c.lineWidth = 3; c.strokeRect(xo - 10, Y - 90, xe - xo + 30, 180); c.restore();
        D.axis(c, Y, 0, o.w, null);
        for (const hh of [-60, -30, 0, 30, 60]) {
          const tr = OPT.thinTrace(0, hh - s * xo, s, [{ x: xo, f: fo }, { x: xe, f: fe }], 1240);
          drawTrace(tr, COL.cyan, 2.1);
        }
        D.lens(c, xo, Y, 95, 'convex', { bulge: 10 }); D.lens(c, xe, Y, 60, 'convex', { bulge: 16 });
        D.mark(c, xo + fo, Y, 'F', COL.amber);
        D.text(c, 'objective lens (collects light)', xo + 40, Y - 120, { size: 17, col: COL.white, align: 'left' });
        D.text(c, 'eyepiece', xe, Y - 82, { size: 17, col: COL.white });
        D.eye(c, 1180, Y, 1.1, 1);
        D.text(c, `star at ${st.starA.toFixed(1)}° → seen at ${(Math.atan(Math.tan(a) * fo / fe) / DEG).toFixed(1)}° (${(fo / fe).toFixed(0)}× bigger angle)`, 630, 40, { size: 20, col: COL.amber, bg: 'rgba(255,255,255,.9)' });
        void now;
      },
      eye(c, now) {
        const ex = 820, Dr = 200, uPx = 120 + (st.eyeD - 25) * 2;
        const fNeed = 1 / (1 / Dr + 1 / uPx);
        st.eyeF += (fNeed - st.eyeF) * .1;
        const retX = eyeball(c, ex, Dr, st.eyeF * 1.5);
        D.axis(c, Y, 0, o.w, null);
        const T = P(ex - uPx, Y - 70);
        const img = OPT.lensImage(-uPx, st.eyeF);
        lensRays(ex, st.eyeF, T, img);
        D.arrowObj(c, T.x, Y, 70, COL.amber, { label: 'object' });
        if (!img.inf && img.v > 0) D.arrowObj(c, ex + img.v, Y, 70 * img.m, COL.cyan, { w: 4 });
        D.text(c, 'Upside-down image on the retina; the brain turns it upright', 630, 36, { size: 20, col: COL.white, bg: 'rgba(255,255,255,.9)' });
        D.text(c, st.eyeD < 80 ? 'Near object: eye lens becomes thicker' : 'Far object: eye lens becomes thinner', 630, 70, { size: 19, col: COL.cyan, bg: 'rgba(255,255,255,.9)' });
        void retX; void now;
      }
    };
    return {
      reset() { Object.assign(st, { tab: 'magnifier', mu: 5, cond: 'myopia', wear: false, camU: 600, starA: 2, eyeD: 60 }); sTab.set('magnifier'); cMu.set(5); cCond.set('myopia'); cWear.set(false); cCam.set(600); cStar.set(2); cEye.set(60); show(); },
      frame(dt, now) { st.t += dt; C = o.ctx; o.begin(); D.bg(o); tabs[st.tab](C, now); }
    };
  }
});

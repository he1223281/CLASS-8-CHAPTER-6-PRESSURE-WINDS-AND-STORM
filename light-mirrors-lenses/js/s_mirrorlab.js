'use strict';
/* Shared image-formation lab (used by the spherical-mirror lab and the lens lab).
   Paraxial model with the New Cartesian sign convention — see optics.js. */

function ImageLab(root, cfg) {
  const kind = cfg.kind;                         // 'mirror' | 'lens'
  const L = labLayout(root, { kicker: cfg.kicker, title: cfg.title, cvH: 630 });
  const o = L.cv, X = cfg.X, Y = 330, S = 18, F = 10;
  const uMax = cfg.uMax, box = { x0: -10, y0: -10, x1: o.w + 10, y1: o.h + 10 };
  const st = { type: cfg.defType, u: cfg.defU, h: 4, view: 'ray', on: { r1: true, r2: true, r3: true, r4: true }, labels: true, screen: false, sx: X + 470, rp: 0 };
  const geom = () => ({ type: st.type, P: P(X, Y), R: 2 * F * S, a: 210, rot: 0 });
  const fSigned = () => {
    if (kind === 'mirror') return st.type === 'plane' ? Infinity : st.type === 'concave' ? -F : F;
    return st.type === 'convex' ? F : -F;
  };
  const converging = () => (kind === 'mirror' && st.type === 'concave') || (kind === 'lens' && st.type === 'convex');

  // ---------- controls ----------
  const sType = UI.seg(kind === 'mirror' ? 'Mirror' : 'Lens', cfg.types.map(v => ({ v, t: v[0].toUpperCase() + v.slice(1) })), st.type, v => { st.type = v; afterType(); });
  const sView = UI.seg('View', [{ v: 'ray', t: 'Ray diagram' }, { v: 'real', t: 'Realistic' }], st.view, v => { st.view = v; });
  const sU = UI.slider('Object distance', 2, uMax, .5, st.u, v => v.toFixed(1) + ' cm', v => { st.u = snap(v); });
  const sH = UI.slider('Object height', 1, 6, .5, st.h, v => v.toFixed(1) + ' cm', v => { st.h = v; });
  const placeWrap = el('div', { class: 'ctl' }, el('span', { class: 'lbl' }, 'Place at'));
  const rayT = {};
  const rayWrap = el('div', { class: 'ctl' }, el('span', { class: 'lbl' }, 'Rays'));
  ['r1', 'r2', 'r3', 'r4'].forEach((k, i) => { rayT[k] = UI.toggle(String(i + 1), true, v => { st.on[k] = v; }, COL[k]); rayWrap.append(rayT[k].el); });
  const tLab = UI.toggle('Labels', true, v => { st.labels = v; });
  const tScr = kind === 'lens' ? UI.toggle('Screen', false, v => { st.screen = v; }, COL.white) : null;
  L.controls.append(...[sType.el, sView.el, sH.el, el('div', { class: 'break' }), sU.el, rayWrap, tLab.el, tScr && tScr.el, el('div', { class: 'break' }), placeWrap].filter(Boolean));
  o.cv.parentElement.append(el('div', { class: 'cv-hint' }, kind === 'lens' ? 'Drag the object · drag its tip to change height · drag the screen' : 'Drag the object · drag its tip to change its height'));

  function snap(v) {
    if (converging()) { if (Math.abs(v - F) < .3) return F; if (Math.abs(v - 2 * F) < .3) return 2 * F; }
    return v;
  }
  function afterType() {
    placeWrap.querySelectorAll('button').forEach(b => b.remove());
    const pl = cfg.places[st.type];
    pl.forEach(([t, u]) => placeWrap.append(UI.btn(t, () => { st.u = u; sU.set(u); st.rp = 0; }, 'btn sm')));
    rayT.r4.el.hidden = kind === 'lens';
    rayT.r3.el.hidden = kind === 'mirror' && st.type === 'plane';
    sType.set(st.type);
    st.rp = 0;
  }
  afterType();

  // ---------- panel ----------
  const ro = UI.readout([['zone', 'Object'], ['u', 'u (object)'], ['v', 'v (image)'], ['m', 'Magnification'], ['nat', 'Image'], ['where', 'Image position']]);
  const notes = el('p', { class: 'note' });
  const live = UI.card('live', 'Live measurements', null, ro.el, notes);
  const conv = UI.card('explain', 'Model used here', null, el('p', { class: 'note', html: cfg.modelNote }));
  L.setPanel(UI.panel({ ...cfg.panel, live, liveFirst: true, extra: [conv] }));

  // ---------- dragging ----------
  const objX = () => X - st.u * S;
  dragOn(o, {
    hit: p => {
      const x = objX(), top = Y - st.h * S;
      if (st.screen && kind === 'lens' && Math.abs(p.x - st.sx) < 24 && p.y > Y - 220 && p.y < Y + 220) return 'screen';
      if (Math.abs(p.x - x) < 34 && Math.abs(p.y - top) < 26) return 'tip';
      if (Math.abs(p.x - x) < 34 && p.y > top && p.y < Y + 16) return 'obj';
      return null;
    },
    move: (h, p) => {
      if (h === 'screen') { st.sx = clamp(p.x, X + 30, o.w - 20); return; }
      if (h === 'tip') { st.h = clamp(Math.round((Y - p.y) / S * 2) / 2, 1, 6); sH.set(st.h); }
      const u = clamp(Math.round((X - p.x) / S * 2) / 2, 2, uMax);
      st.u = snap(u); sU.set(st.u);
    }
  });

  function zoneLabels(c) {
    if (!converging()) return;
    const zs = kind === 'mirror'
      ? [[X - 2 * F * S - 230, X - 2 * F * S, 'Beyond C'], [X - 2 * F * S, X - F * S, 'Between C and F'], [X - F * S, X, 'Between F and P']]
      : [[X - 2 * F * S - 230, X - 2 * F * S, 'Beyond 2F₁'], [X - 2 * F * S, X - F * S, 'Between 2F₁ and F₁'], [X - F * S, X, 'Between F₁ and O']];
    const x = objX();
    for (const [a, b, t] of zs) {
      const on = x > a && x < b;
      c.save(); c.fillStyle = on ? 'rgba(255,184,77,.10)' : 'rgba(255,255,255,.025)'; c.fillRect(Math.max(0, a), Y + 52, b - Math.max(0, a), 34); c.restore();
      D.text(c, t, (Math.max(0, a) + b) / 2, Y + 69, { size: 16, col: on ? COL.amber : COL.muted, weight: on ? 700 : 400 });
    }
  }

  function legend(c, rays) {
    let y = 26;
    for (const r of rays) {
      if (!st.on[r.id]) continue;
      D.line(c, P(18, y), P(52, y), r.col, 3.5);
      D.text(c, r.label + (r.miss ? '  (misses the ' + (kind === 'mirror' ? 'mirror' : 'lens') + ')' : ''), 62, y, { size: 16, col: r.miss ? COL.muted : COL.white, align: 'left', weight: 400 });
      y += 26;
    }
  }

  return {
    st, sType, sU,
    configure(opts) { if (opts.type && cfg.types.includes(opts.type)) { st.type = opts.type; afterType(); } },
    onShow() { st.rp = 0; },
    replay() { st.rp = 0; },
    reset() {
      st.type = cfg.defType; st.u = cfg.defU; st.h = 4; st.view = 'ray'; st.labels = true; st.screen = false; st.sx = X + 470;
      ['r1', 'r2', 'r3', 'r4'].forEach(k => { st.on[k] = true; rayT[k].set(true); });
      sView.set('ray'); sU.set(st.u); sH.set(st.h); tLab.set(true); if (tScr) tScr.set(false); afterType();
    },
    frame(dt, now) {
      st.rp += dt / 2.4;
      const c = o.ctx; o.begin(); D.bg(o);
      const f = fSigned(), u = -st.u;
      const img = kind === 'mirror' ? OPT.mirrorImage(u, f) : OPT.lensImage(u, f);
      const T = P(objX(), Y - st.h * S);
      const R = OPT.labRays({ kind, type: st.type, X, Y, s: S, f, T, img, mirror: geom(), a: 230, on: st.on, box });
      const I = R.I, real = !img.inf && (kind === 'mirror' ? img.v < 0 : img.v > 0);

      // behind-the-mirror tint
      if (kind === 'mirror') { c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(X, 0, o.w - X, o.h); c.restore(); D.text(c, 'BEHIND THE MIRROR', o.w - 18, 24, { size: 15, col: COL.muted, align: 'right', font: 'mono' }); }
      D.axis(c, Y, 0, o.w, st.labels ? 'Principal axis' : null);
      if (st.labels) zoneLabels(c);
      // focal markers
      if (isFinite(f)) {
        const marks = kind === 'mirror' ? [[X + f * S, 'F'], [X + 2 * f * S, 'C']] : [[X - F * S, 'F₁'], [X + F * S, 'F₂'], [X - 2 * F * S, '2F₁'], [X + 2 * F * S, '2F₂']];
        for (const [x, t] of marks) D.mark(c, x, Y, t, t.startsWith('C') || t.startsWith('2') ? COL.amber : COL.white);
      }
      // element
      const realistic = st.view === 'real';
      if (kind === 'mirror') { D.mirror(c, geom(), { realistic }); D.mark(c, X, Y, 'P', COL.cyan, false); }
      else { D.lens(c, X, Y, 230, st.type, { bulge: 22 }); D.mark(c, X, Y, 'O', COL.cyan, false); }

      // rays
      const rayAlpha = realistic ? .28 : 1;
      const p = clamp(st.rp, 0, 1);
      for (const r of R.rays) {
        if (r.miss || !r.inc) continue;
        const full = [r.inc[0], r.inc[1], r.out[1]];
        const Ltot = D.polyLen(full);
        const shown = D.upTo(full, Ltot * p);
        D.ray(c, shown, r.col, 2.6, { alpha: rayAlpha });
        if (!realistic) { D.arrowOn(c, full[0], full[1], r.col, 13, .5); if (p >= 1) D.arrowOn(c, full[1], full[2], r.col, 13, .25); }
        if (p >= 1 && r.back) D.line(c, r.back[0], r.back[1], r.col, 2, [8, 7], .8 * rayAlpha + .1);
        if (p >= 1 && !realistic) D.pulses(c, full, now, '#fff', { speed: 230, gap: 150, r: 3.2, limit: 1800 });
      }

      // object
      if (realistic) D.candle(c, T.x, Y, st.h * S, { t: now });
      else D.arrowObj(c, T.x, Y, st.h * S, COL.amber, { w: 6 });
      D.dot(c, T.x, T.y, 7, COL.amber);
      if (st.labels) D.text(c, 'Object', T.x, Y + 26, { size: 18, col: COL.amber, bg: 'rgba(255,255,255,.9)' });

      // image
      let offTxt = null;
      if (!img.inf && p >= .98) {
        const hpx = Y - I.y;
        const inView = I.x > 0 && I.x < o.w && Math.abs(hpx) < Y - 10;
        if (inView) {
          if (realistic) D.candle(c, I.x, Y, hpx, { ghost: !real, real, t: now });
          else D.arrowObj(c, I.x, Y, hpx, real ? COL.cyan : COL.magenta, { dashed: !real, w: 5 });
          if (st.labels) D.text(c, real ? 'Real image' : 'Virtual image', I.x, Y + (hpx > 0 ? 26 : -26) + (hpx > 0 ? 0 : 0), { size: 18, col: real ? COL.cyan : COL.magenta, bg: 'rgba(255,255,255,.9)' });
        } else {
          offTxt = `Image off screen: v = ${img.v.toFixed(0)} cm, ${Math.abs(img.m).toFixed(1)}× ${real ? 'real' : 'virtual'}`;
          D.offscreen(c, o, I.x, I.y, offTxt);
        }
      }
      if (img.inf && p >= .98) {
        D.text(c, kind === 'mirror' ? 'Object at F: reflected rays come out parallel.' : 'Object at F₁: refracted rays come out parallel.', o.w / 2, 46, { size: 22, col: COL.amber, bg: 'rgba(255,255,255,.9)' });
        D.text(c, 'They never meet, so the image is "at infinity" (no clear image).', o.w / 2, 80, { size: 19, col: COL.amber, weight: 400, bg: 'rgba(255,255,255,.9)' });
      }

      // lens screen
      if (kind === 'lens' && st.screen) {
        const sx = st.sx;
        c.save(); c.fillStyle = '#c9d0de'; c.fillRect(sx - 7, Y - 200, 14, 400); c.restore();
        D.text(c, 'Screen', sx, Y - 216, { size: 17, col: COL.white });
        let msg;
        if (img.inf) msg = 'Only a blur on the screen';
        else if (!real) msg = 'No image on the screen (virtual image)';
        else {
          const blur = 80 * Math.abs(sx - I.x) / Math.max(20, Math.abs(I.x - X));
          const hpx = Y - I.y;
          c.save(); c.beginPath(); c.rect(sx - 60, Y - 200, 120, 400); c.clip();
          if ('filter' in c) c.filter = `blur(${Math.min(18, blur / 2).toFixed(1)}px)`;
          c.globalAlpha = clamp(1 - blur / 120, .25, 1);
          if (Math.abs(hpx) < 200) D.candle(c, sx, Y, hpx, { real: true, t: now });
          c.restore();
          msg = blur < 4 ? 'Sharp image on the screen!' : 'Blurred: move the screen';
        }
        D.text(c, msg, clamp(sx, 150, o.w - 150), Y + 230, { size: 18, col: msg.startsWith('Sharp') ? COL.green : COL.magenta, bg: 'rgba(255,255,255,.9)' });
      }

      legend(c, R.rays);
      D.text(c, cfg.footer, o.w - 18, o.h - 20, { size: 15, col: COL.muted, align: 'right', weight: 400 });

      // readout
      const ds = OPT.describe(kind, st.type, u, f, img);
      ro.set('zone', OPT.objectZone(kind, st.type, u, f));
      ro.set('u', u.toFixed(1) + ' cm');
      ro.set('v', img.inf ? '∞ (infinity)' : (img.v > 0 ? '+' : '') + img.v.toFixed(1) + ' cm', true);
      ro.set('m', img.inf ? '—' : (img.m > 0 ? '+' : '') + img.m.toFixed(2) + ' (' + ds.size.toLowerCase() + ')');
      ro.set('nat', img.inf ? '<span class="tag amber">No clear image</span>' : `<span class="tag ${ds.real ? 'real' : 'virt'}">${ds.nature}</span><span class="tag green">${ds.orient}</span>`);
      ro.set('where', ds.where);
      const n = cfg.noteFor ? cfg.noteFor(st, img) : '';
      if (notes.innerHTML !== n) notes.innerHTML = n;
    }
  };
}

LL.add({
  id: 'mirror-lab', title: 'Spherical mirror lab', section: 'Mirrors',
  build(root) {
    return ImageLab(root, {
      kind: 'mirror', kicker: 'Scene 3 · Activity 10.3 · Live mirror lab', title: 'Move the candle: what does the image do?',
      X: 980, uMax: 52, types: ['plane', 'concave', 'convex'], defType: 'concave', defU: 30,
      places: {
        plane: [['Far', 40], ['Middle', 20], ['Near', 6]],
        concave: [['Far away', 50], ['Beyond C', 30], ['At C', 20], ['Between C and F', 15], ['At F', 10], ['Between F and P', 6]],
        convex: [['Far away', 50], ['Middle', 20], ['Near', 6]]
      },
      footer: 'School ray-diagram (paraxial) model · f = 10 cm, R = 20 cm · 1 grid square ≈ 2 cm',
      modelNote: 'Images are calculated with the mirror formula <b>1/v + 1/u = 1/f</b> and <b>m = −v/u</b> (you will learn these in higher classes). Sign convention: distances are measured from the pole P; distances in the direction of the incoming light (to the right) are <b>+</b>, against it are <b>−</b>; heights above the axis are <b>+</b>. Rays are drawn the school way, all meeting at one image point. A real wide spherical mirror gives a slightly blurred image; see the parallel-rays scene.',
      noteFor(st, img) {
        if (st.type === 'convex') return 'A convex mirror shows a smaller image of a wide area: this <b>wider field of view</b> is why it is used as a rear-view mirror.';
        if (st.type === 'plane') return 'Plane mirror: v = −u, so the image is as far behind as the object is in front.';
        if (img.inf) return 'At F the reflected rays are parallel. A torch or headlight puts its bulb here to make a parallel beam.';
        if (img.v > 0) return 'Object between F and P: upright, enlarged virtual image. This is how a dentist’s mirror and a shaving mirror work.';
        return 'Real image in front of the mirror: it can be caught on a screen.';
      },
      panel: {
        predict: { q: 'A candle moves slowly towards a concave mirror from far away. What happens to its image?', opts: ['It stays the same size and upright', 'It starts small and inverted, grows, then becomes upright and enlarged when very close', 'It is always upright and smaller', 'It is always enlarged'], ans: 1,
          why: 'Watch the image grow as the candle approaches F, vanish at F, and reappear upright and enlarged behind the mirror.' },
        experiment: ['Drag the candle (or use <b>Place at</b>) from far away towards the mirror.', 'Switch between <b>plane</b>, <b>concave</b> and <b>convex</b>.', 'Turn rays 1–4 on and off. Any two rays are enough to find the image.', 'Switch to <b>Realistic</b> view.'],
        observe: ['<b>Concave:</b> beyond C → real, inverted, diminished; at C → same size; between C and F → enlarged, beyond C; at F → no image; between F and P → virtual, erect, enlarged.', '<b>Convex:</b> always virtual, erect and diminished. The image gets smaller as the object moves away.', '<b>Plane:</b> always virtual, erect, same size.'],
        explain: '<p>Each ray obeys the laws of reflection. A ray through C strikes the mirror along the normal and comes straight back. A ray parallel to the axis reflects through F (concave), or as if from F (convex).</p><p>Where the reflected rays <b>actually meet</b>, a <b>real</b> image forms that can be caught on a screen. Where they only <b>seem</b> to come from (dashed lines), the image is <b>virtual</b>.</p>'
      }
    });
  }
});

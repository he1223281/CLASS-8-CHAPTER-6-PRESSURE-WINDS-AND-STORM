'use strict';
/* "What do you see?" lab, shared by the mirror lab (Activity 10.3) and the lens lab (Activity 10.9).
   Class 8 level: students move the object and watch how the image looks (erect or inverted, enlarged or diminished).
   The image size is worked out internally (optics.js) but no formulas, foci or ray diagrams are shown. */

function ImageLab(root, cfg) {
  const kind = cfg.kind;                         // 'mirror' | 'lens'
  const L = labLayout(root, { kicker: cfg.kicker, title: cfg.title });
  const o = L.cv, X = cfg.X, Y = 420, S = 12, F = 10;
  const st = { type: cfg.defType, u: cfg.defU };
  const fSigned = () => {
    if (kind === 'mirror') return st.type === 'plane' ? Infinity : st.type === 'concave' ? -F : F;
    return st.type === 'convex' ? F : -F;
  };

  // ---------- controls ----------
  const sType = UI.seg(kind === 'mirror' ? 'Mirror' : 'Lens', cfg.types.map(v => ({ v, t: v[0].toUpperCase() + v.slice(1) })), st.type, v => { st.type = v; sType.set(v); });
  const sU = UI.slider('Distance of the object', 3, cfg.uMax, .5, st.u, v => v.toFixed(0) + ' cm', v => { st.u = v; });
  const place = el('div', { class: 'ctl' }, el('span', { class: 'lbl' }, 'Move the object'),
    ...[['Very close', 4], ['Close', 7], ['A little farther', 15], ['Far', 25], ['Very far', cfg.uMax]].map(([t, u]) => UI.btn(t, () => { st.u = u; sU.set(u); }, 'btn sm')));
  L.controls.append(sType.el, sU.el, el('div', { class: 'break' }), place);
  o.cv.parentElement.append(el('div', { class: 'cv-hint' }, 'Drag the candle closer or farther'));

  // ---------- panel ----------
  const ro = UI.readout([['d', 'Object distance'], ['o', 'Image is'], ['s', 'Image size']]);
  const notes = el('p', { class: 'note' });
  L.setPanel(UI.panel({ ...cfg.panel, live: UI.card('live', 'What you see', null, ro.el, notes), liveFirst: true }));

  const objX = () => X - st.u * S;
  dragOn(o, {
    hit: p => Math.abs(p.x - objX()) < 40 && p.y > Y - 120 && p.y < Y + 16 ? 'obj' : null,
    move: (h, p) => { st.u = clamp(Math.round((X - p.x) / S * 2) / 2, 3, cfg.uMax); sU.set(st.u); }
  });

  return {
    st,
    configure(opts) { if (opts.type && cfg.types.includes(opts.type)) { st.type = opts.type; sType.set(st.type); } },
    reset() { st.type = cfg.defType; st.u = cfg.defU; sType.set(st.type); sU.set(st.u); },
    frame(dt, now) {
      const c = o.ctx; o.begin(); D.bg(o);
      const f = fSigned();
      const img = kind === 'mirror' ? OPT.mirrorImage(-st.u, f) : OPT.lensImage(-st.u, f);
      const blurred = img.inf || Math.abs(img.m) > 4;
      const m = img.inf ? 4 : img.m;

      // the set-up: table, object, mirror or lens, and the eye
      D.line(c, P(20, Y), P(860, Y), 'rgba(60,70,110,.35)', 3);
      D.text(c, 'Side view of the set-up', 24, 28, { size: 18, col: COL.muted, align: 'left' });
      D.candle(c, objX(), Y, 90, { t: now });
      D.text(c, 'Object', objX(), Y + 28, { size: 18, col: COL.amber, bg: COL.pill });
      if (kind === 'mirror') {
        D.mirror(c, { type: st.type, P: P(X, Y - 110), R: 240, a: 120, rot: 0 }, { realistic: true });
        D.text(c, st.type + ' mirror', X, Y + 28, { size: 18, col: COL.white, bg: COL.pill });
        D.eye(c, objX() - 60, Y - 150, 1, -1);
        D.text(c, 'you look into the mirror', objX() - 60, Y - 186, { size: 16, col: COL.muted, weight: 400 });
      } else {
        D.lens(c, X, Y - 110, 120, st.type, { bulge: 18 });
        D.text(c, st.type + ' lens', X, Y + 28, { size: 18, col: COL.white, bg: COL.pill });
        D.eye(c, X + 170, Y - 110, 1.1, -1);
        D.text(c, 'you look through the lens', X + 170, Y - 150, { size: 16, col: COL.muted, weight: 400 });
      }
      // distance marker
      D.line(c, P(objX(), Y + 60), P(X, Y + 60), COL.white, 2); D.line(c, P(objX(), Y + 52), P(objX(), Y + 68), COL.white, 2); D.line(c, P(X, Y + 52), P(X, Y + 68), COL.white, 2);
      D.text(c, st.u.toFixed(0) + ' cm', (objX() + X) / 2, Y + 84, { size: 20, col: COL.white, font: 'mono' });

      // the view: what the student sees in the mirror / through the lens
      const vx = 900, vy = 40, vw = 340, vh = 540, cx = vx + vw / 2, cy = vy + vh / 2 + 40;
      c.save();
      if (kind === 'mirror' && st.type === 'plane') D.rrect(c, vx, vy, vw, vh, 22); else { c.beginPath(); c.ellipse(cx, vy + vh / 2, vw / 2, vh / 2, 0, 0, Math.PI * 2); }
      const g = c.createLinearGradient(vx, vy, vx + vw, vy + vh);
      g.addColorStop(0, kind === 'mirror' ? '#dfe6f3' : '#eef8ff'); g.addColorStop(1, kind === 'mirror' ? '#c3cde0' : '#dcefff');
      c.fillStyle = g; c.fill(); c.save(); c.clip();
      if (blurred && 'filter' in c) c.filter = 'blur(10px)';
      const am = Math.min(Math.abs(m), 3.2), base = 120;
      D.candle(c, cx, cy + (m < 0 ? -1 : 1) * base * am / 2 - 40, (m < 0 ? -1 : 1) * base * am, { t: now });
      c.restore();
      c.lineWidth = 8; c.strokeStyle = kind === 'mirror' ? '#8792aa' : '#1f8fff'; c.stroke();
      c.restore();
      D.text(c, kind === 'mirror' ? 'What you see in the mirror' : 'What you see through the lens', cx, vy + vh + 26, { size: 19, col: COL.white });

      // what you see, in words
      let orient, size;
      if (blurred) { orient = 'Very blurred'; size = 'Too large to see clearly'; }
      else {
        orient = img.m > 0 ? 'Erect (upright)' : 'Inverted (upside down)';
        const a = Math.abs(img.m);
        size = a > 1.03 ? 'Enlarged (bigger)' : a < .97 ? 'Diminished (smaller)' : 'Same size';
      }
      D.text(c, orient + ' · ' + size, 440, 70, { size: 24, col: blurred ? COL.amber : img.m > 0 ? COL.cyan : COL.magenta, bg: COL.pill });
      ro.set('d', st.u.toFixed(0) + ' cm');
      ro.set('o', orient, true);
      ro.set('s', size);
      const n = cfg.noteFor ? cfg.noteFor(st, img) : '';
      if (notes.innerHTML !== n) notes.innerHTML = n;
    }
  };
}

LL.add({
  id: 'mirror-lab', title: 'Spherical mirror lab', section: 'Mirrors',
  build(root) {
    return ImageLab(root, {
      kind: 'mirror', kicker: 'Activity 10.3', title: 'Move the candle: how does the image change?',
      X: 780, uMax: 50, types: ['plane', 'concave', 'convex'], defType: 'concave', defU: 4,
      noteFor(st, img) {
        if (st.type === 'plane') return 'A plane mirror always forms an erect image of the same size as the object.';
        if (st.type === 'convex') return 'A convex mirror always forms an erect, diminished image. It gets a little smaller as the object moves away.';
        if (img.m > 0) return 'Object close to a concave mirror: the image is erect and enlarged, like a dentist’s mirror.';
        return 'Object farther from a concave mirror: the image is inverted. It is first enlarged, then gets smaller as the object moves away.';
      },
      panel: {
        predict: { q: 'A candle is slowly moved away from a concave mirror. What happens to its image?', opts: ['It stays erect and the same size', 'It is erect and enlarged at first, then becomes inverted and keeps changing in size', 'It is always erect and smaller', 'It disappears'], ans: 1,
          why: 'Close to a concave mirror the image is erect and enlarged. Farther away it becomes inverted: first enlarged, then smaller.' },
        experiment: ['Start with the candle <b>very close</b> to the concave mirror.', 'Slowly move it <b>away</b> (drag it, or use the buttons).', 'Watch the image: is it erect or inverted? Bigger or smaller?', 'Repeat with the <b>convex</b> and the <b>plane</b> mirror.'],
        observe: ['<b>Concave mirror:</b> close up, the image is <b>erect and enlarged</b>. Moved away, it becomes <b>inverted</b>: first enlarged, then smaller and smaller.', '<b>Convex mirror:</b> the image is <b>always erect and diminished</b>; it gets slightly smaller as the object moves away.', '<b>Plane mirror:</b> always <b>erect</b> and of the <b>same size</b>.'],
        explain: '<p>Spherical mirrors behave differently from plane mirrors. In concave and convex mirrors the <b>size of the image changes</b> as the distance of the object changes, and in a concave mirror the image also turns <b>upside down</b> when the object is taken away.</p><p>So we can identify a mirror by looking at the images it forms.</p>'
      }
    });
  }
});

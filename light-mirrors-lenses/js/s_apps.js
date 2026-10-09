'use strict';
/* Scene 7: Mirrors in the real world — six animated vignettes, each with a ray diagram and the reason */

function carShape(c, x, y, w, col, dir = 1) {
  c.save(); c.translate(x, y); c.scale(dir, 1);
  c.fillStyle = col; D.rrect(c, -w / 2, -w * .22, w, w * .3, w * .06); c.fill();
  c.beginPath(); c.moveTo(-w * .28, -w * .2); c.lineTo(-w * .16, -w * .38); c.lineTo(w * .18, -w * .38); c.lineTo(w * .3, -w * .2); c.closePath(); c.fill();
  c.fillStyle = 'rgba(160,210,255,.7)'; c.beginPath(); c.moveTo(-w * .22, -w * .21); c.lineTo(-w * .13, -w * .34); c.lineTo(w * .15, -w * .34); c.lineTo(w * .24, -w * .21); c.closePath(); c.fill();
  c.fillStyle = '#111'; c.beginPath(); c.arc(-w * .3, w * .08, w * .1, 0, Math.PI * 2); c.arc(w * .3, w * .08, w * .1, 0, Math.PI * 2); c.fill();
  c.restore();
}

/* exact field-of-view picture: eye, mirror, reflected edge rays and the region the eye can see */
function fovDiagram(c, x0, w, h, type, label, now) {
  const m = { type, P: P(x0 + w - 60, h / 2 + 10), R: 170, a: 62, rot: 0 };
  const E = P(x0 + 40, h / 2 - 70);
  const pts = OPT.mirrorPoints(m, 2), A = pts[0], B = pts[2];
  const ref = q => { const d = V.norm(V.sub(q, E)), h2 = OPT.hitMirror(m, E, d); return h2 ? { hit: h2.pt, out: OPT.reflect(d, h2.n) } : null; };
  const rA = ref(V.add(A, V.mul(V.sub(B, A), .01))), rB = ref(V.add(B, V.mul(V.sub(A, B), .01)));
  if (rA && rB) {
    const fa = V.add(rA.hit, V.mul(rA.out, 600)), fb = V.add(rB.hit, V.mul(rB.out, 600));
    c.save(); c.beginPath(); c.rect(x0, 0, w, h); c.clip();
    c.fillStyle = type === 'convex' ? 'rgba(255,79,168,.16)' : 'rgba(10,124,255,.14)';
    c.beginPath(); c.moveTo(rA.hit.x, rA.hit.y); c.lineTo(fa.x, fa.y); c.lineTo(fb.x, fb.y); c.lineTo(rB.hit.x, rB.hit.y); c.closePath(); c.fill();
    D.ray(c, [E, rA.hit, fa], COL.amber, 2); D.ray(c, [E, rB.hit, fb], COL.amber, 2);
    c.restore();
  }
  D.mirror(c, m); D.eye(c, E.x, E.y, .8, -1);
  D.text(c, label, x0 + w / 2, h - 22, { size: 18, col: type === 'convex' ? COL.magenta : COL.cyan });
  D.text(c, 'seen area', x0 + 70, h / 2 + 60, { size: 15, col: COL.muted, weight: 400 });
  void now;
}

const APPS = [
  {
    id: 'dentist', name: 'Dentist’s mirror', type: 'concave',
    why: 'A small <b>concave</b> mirror held close to a tooth (between P and F) gives an <b>erect, enlarged, virtual</b> image, so the dentist sees the tooth bigger. Shaving and make-up mirrors use the same idea.',
    prop: 'Object between P and F → virtual, erect, enlarged image',
    tile(c, w, h, t) {
      c.fillStyle = '#3a0f18'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#7a2434'; c.beginPath(); c.ellipse(w / 2, h * .95, w * .55, h * .5, 0, Math.PI, 0); c.fill();
      for (let i = 0; i < 7; i++) { c.fillStyle = '#f4efe4'; D.rrect(c, 40 + i * 50, h * .62, 40, 46, 10); c.fill(); }
      const mx = w * .66 + Math.sin(t * .8) * 10, my = h * .36;
      c.strokeStyle = '#c9d2e6'; c.lineWidth = 6; c.beginPath(); c.moveTo(mx + 40, my + 30); c.lineTo(w + 10, my + 130); c.stroke();
      c.save(); c.beginPath(); c.arc(mx, my, 48, 0, Math.PI * 2); c.fillStyle = '#9fb4d6'; c.fill(); c.clip();
      c.translate(mx, my); c.scale(2.1, 2.1); c.fillStyle = '#f4efe4'; D.rrect(c, -14, -16, 28, 34, 8); c.fill(); c.fillStyle = '#5a3a2a'; c.beginPath(); c.arc(4, -2, 4, 0, Math.PI * 2); c.fill();
      c.restore(); c.strokeStyle = '#e9eef8'; c.lineWidth = 4; c.beginPath(); c.arc(mx, my, 48, 0, Math.PI * 2); c.stroke();
    },
    detail(c, w, h, t) {
      const X = 380, Y = 200, S = 10, f = -12, u = -6;
      const img = OPT.mirrorImage(u, f), T = P(X + u * S, Y - 40);
      const m = { type: 'concave', P: P(X, Y), R: 240, a: 130, rot: 0 };
      const R = OPT.labRays({ kind: 'mirror', type: 'concave', X, Y, s: S, f, T, img, mirror: m, on: { r1: true, r2: false, r3: true, r4: false }, box: { x0: 0, y0: 0, x1: w, y1: h } });
      D.axis(c, Y, 0, w, null); D.mark(c, X + f * S, Y, 'F', COL.white); D.mark(c, X + 2 * f * S, Y, 'C', COL.amber);
      for (const r of R.rays) if (r.inc) { D.ray(c, [r.inc[0], r.inc[1], r.out[1]], r.col, 2.4); D.arrowOn(c, r.inc[0], r.inc[1], r.col); if (r.back) D.line(c, r.back[0], r.back[1], r.col, 2, [7, 6]); }
      D.mirror(c, m); D.arrowObj(c, T.x, Y, 40, COL.amber, { label: 'tooth' });
      D.arrowObj(c, R.I.x, Y, Y - R.I.y, COL.magenta, { dashed: true, label: 'image ×' + img.m.toFixed(1) });
      void t;
    }
  },
  {
    id: 'headlight', name: 'Torch & headlight', type: 'concave',
    why: 'The bulb sits at the <b>focus</b> of a concave reflector. Light from F reflects off the mirror as a strong, nearly <b>parallel beam</b>, the reverse of parallel rays meeting at F. Searchlights work the same way.',
    prop: 'Light from F → reflected parallel',
    tile(c, w, h, t) {
      c.fillStyle = '#0a1224'; c.fillRect(0, 0, w, h);
      const g = c.createLinearGradient(w * .7, 0, 0, 0); g.addColorStop(0, 'rgba(255,240,180,.55)'); g.addColorStop(1, 'rgba(255,240,180,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(w * .72, h * .4); c.lineTo(0, h * .22); c.lineTo(0, h * .78); c.lineTo(w * .72, h * .6); c.closePath(); c.fill();
      carShape(c, w * .86, h * .62, 220, '#c0182c', -1);
      c.fillStyle = '#ffeeb0'; c.beginPath(); c.arc(w * .72, h * .5, 16, 0, Math.PI * 2); c.fill();
      for (let k = -2; k <= 2; k++) { const y = h * .5 + k * 18, ph = (t * 300 + k * 40) % (w * .7); D.dot(c, w * .7 - ph, y, 3, '#fff8d0'); }
    },
    detail(c, w, h, t) {
      const m = { type: 'concave', P: P(470, 165), R: 300, a: 130, rot: 0 }, Fp = OPT.mirrorFocus(m);
      D.axis(c, 165, 0, w, null);
      for (let a = -40; a <= 40; a += 10) {
        const d = V.norm(P(Math.cos(a * DEG), Math.sin(a * DEG)));
        const r = OPT.traceMirror(m, Fp, d, 430);
        if (!r.hit) continue;
        D.ray(c, r.pts, '#ff9500', 2.2); D.arrowOn(c, r.pts[1], r.pts[2], '#ff9500', 12, .5);
        D.pulses(c, r.pts, t, '#fff', { speed: 200, gap: 150, r: 2.6 });
      }
      D.mirror(c, m); D.dot(c, Fp.x, Fp.y, 9, '#fff3b0'); D.text(c, 'bulb at F', Fp.x, Fp.y + 32, { size: 17, col: COL.amber });
      D.text(c, 'parallel beam', 90, 40, { size: 18, col: '#ff9500' });
    }
  },
  {
    id: 'sideview', name: 'Vehicle side-view mirror', type: 'convex',
    why: 'A <b>convex</b> mirror gives an <b>erect, diminished</b> image of a much <b>wider area</b> behind the vehicle. Because vehicles look smaller, they seem farther away than they are, hence the warning <i>"Objects in mirror are closer than they appear"</i>.',
    prop: 'Always erect & diminished → wide field of view',
    tile(c, w, h, t) {
      c.fillStyle = '#1a2740'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#2b3550'; c.fillRect(0, h * .55, w, h * .45);
      carShape(c, w * .45, h * .78, 300, '#2f6fd6', 1);
      const mx = w * .78, my = h * .36;
      c.fillStyle = '#222'; c.fillRect(mx - 70, my + 32, 30, 14);
      c.save(); c.beginPath(); c.ellipse(mx, my, 66, 46, 0, 0, Math.PI * 2); c.fillStyle = '#7e94bd'; c.fill(); c.clip();
      c.fillStyle = '#556a90'; c.fillRect(mx - 70, my + 4, 140, 50);
      carShape(c, mx + Math.sin(t * .6) * 18, my + 18, 46, '#e8a020', 1);
      c.restore(); c.strokeStyle = '#111'; c.lineWidth = 6; c.beginPath(); c.ellipse(mx, my, 66, 46, 0, 0, Math.PI * 2); c.stroke();
      D.text(c, 'OBJECTS IN MIRROR ARE CLOSER THAN THEY APPEAR', mx, my + 56, { size: 7.5, col: '#fff' });
    },
    detail(c, w, h, t) { fovDiagram(c, 0, w / 2 - 6, h, 'plane', 'Plane mirror: narrow view', t); D.line(c, P(w / 2, 10), P(w / 2, h - 10), COL.line, 2); fovDiagram(c, w / 2 + 6, w / 2 - 6, h, 'convex', 'Convex mirror: wide view', t); }
  },
  {
    id: 'corner', name: 'Road mirror at a blind turn', type: 'convex',
    why: 'At sharp hill bends and blind corners, a large <b>convex</b> mirror lets drivers see traffic hidden behind walls. Its wide field of view shows both roads at once.',
    prop: 'Diverging mirror → wide field of view',
    tile(c, w, h, t) {
      c.fillStyle = '#2a3a2a'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#3c4256'; c.fillRect(0, h * .55, w, 70); c.fillRect(w * .55, 0, 70, h);
      c.fillStyle = '#7a5a48'; c.fillRect(0, 0, w * .55 - 6, h * .55 - 6);
      c.fillStyle = '#d0d6e2'; c.fillRect(w * .55 - 30, h * .55 - 40, 6, 40);
      c.fillStyle = '#ff9a3c'; c.beginPath(); c.arc(w * .55 - 27, h * .55 - 46, 16, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#c9d6ef'; c.beginPath(); c.arc(w * .55 - 27, h * .55 - 46, 11, 0, Math.PI * 2); c.fill();
      const yy = (t * 40) % (h * .55 + 60) - 60;
      carShape(c, w * .55 + 35, yy, 60, '#e04848', 1);
      carShape(c, 60 + ((t * 30) % 120), h * .55 + 40, 70, '#2f6fd6', 1);
    },
    detail(c, w, h, t) {
      // top view: hidden car B → convex mirror → driver A (exact: find the mirror point that links them)
      c.fillStyle = '#3c4256'; c.fillRect(0, 200, w, 80); c.fillRect(300, 0, 80, h);
      c.fillStyle = '#5a4436'; c.fillRect(0, 0, 294, 194); D.text(c, 'wall / building', 147, 97, { size: 18, col: '#d8c4b0' });
      c.fillStyle = '#2a3a2a'; c.fillRect(386, 286, w - 386, h - 286); c.fillRect(386, 0, w - 386, 194); c.fillRect(0, 286, 294, h - 286);
      const m = { type: 'convex', P: P(398, 292), R: 110, a: 40, rot: Math.PI / 4 };
      const A = P(80 + ((t * 25) % 120), 240), B = P(340, 40 + ((t * 18) % 80));
      let best = null;
      for (const q of OPT.mirrorPoints(m, 120)) {
        const d = V.norm(V.sub(q, B)), hh = OPT.hitMirror(m, V.sub(q, V.mul(d, 2)), d);
        if (!hh) continue; const r = OPT.reflect(d, hh.n), toA = V.norm(V.sub(A, hh.pt)), e = 1 - V.dot(r, toA);
        if (!best || e < best.e) best = { e, pt: hh.pt };
      }
      if (best) { D.ray(c, [B, best.pt, A], COL.amber, 2.4); D.arrowOn(c, B, best.pt, COL.amber); D.arrowOn(c, best.pt, A, COL.amber); }
      D.line(c, A, B, COL.red, 2, [6, 6], .7); D.text(c, 'direct view blocked', 200, 150, { size: 15, col: COL.red, bg: 'rgba(255,255,255,.9)' });
      D.mirror(c, m);
      carShape(c, A.x, A.y, 60, '#2f6fd6', 1); D.text(c, 'driver', A.x, A.y + 30, { size: 15, col: COL.white });
      carShape(c, B.x + 20, B.y, 60, '#e04848', 1); D.text(c, 'hidden car', B.x + 110, B.y, { size: 15, col: COL.white });
    }
  },
  {
    id: 'shop', name: 'Shop security mirror', type: 'convex',
    why: 'A big <b>convex</b> mirror high in a corner shows almost the whole shop in one small, upright image, so the shopkeeper can keep an eye on every aisle.',
    prop: 'Erect, diminished image of a wide area',
    tile(c, w, h, t) {
      c.fillStyle = '#20283e'; c.fillRect(0, 0, w, h);
      const mx = w / 2, my = h * .46, r = 120;
      c.save(); c.beginPath(); c.arc(mx, my, r, 0, Math.PI * 2); c.clip();
      const g = c.createRadialGradient(mx - 30, my - 30, 10, mx, my, r); g.addColorStop(0, '#9fb4d6'); g.addColorStop(1, '#3b4d74'); c.fillStyle = g; c.fillRect(mx - r, my - r, 2 * r, 2 * r);
      for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
        const px = i * 34, py = j * 26, k = 1 / (1 + (px * px + py * py) / 9000);
        c.fillStyle = (i + j) % 2 ? '#d9822b' : '#3aa676'; c.fillRect(mx + px * k - 10 * k, my + py * k - 6 * k, 22 * k, 12 * k);
      }
      const sx = Math.sin(t * .7) * 50; c.fillStyle = '#ffd34d'; c.beginPath(); c.arc(mx + sx, my + 30, 6, 0, Math.PI * 2); c.fill();
      c.restore(); c.strokeStyle = '#e8eef8'; c.lineWidth = 6; c.beginPath(); c.arc(mx, my, r, 0, Math.PI * 2); c.stroke();
    },
    detail(c, w, h, t) {
      const X = 400, Y = 210, S = 8, f = 10, u = -32;
      const img = OPT.mirrorImage(u, f), T = P(X + u * S, Y - 72);
      const m = { type: 'convex', P: P(X, Y), R: 160, a: 120, rot: 0 };
      const R = OPT.labRays({ kind: 'mirror', type: 'convex', X, Y, s: S, f, T, img, mirror: m, on: { r1: true, r2: false, r3: true, r4: false }, box: { x0: 0, y0: 0, x1: w, y1: h } });
      c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(X, 0, w - X, h); c.restore();
      D.axis(c, Y, 0, w, null); D.mark(c, X + f * S, Y, 'F'); D.mark(c, X + 2 * f * S, Y, 'C', COL.amber);
      for (const r of R.rays) if (r.inc) { D.ray(c, [r.inc[0], r.inc[1], r.out[1]], r.col, 2.4); D.arrowOn(c, r.inc[0], r.inc[1], r.col); if (r.back) D.line(c, r.back[0], r.back[1], r.col, 2, [7, 6]); }
      D.mirror(c, m); D.arrowObj(c, T.x, Y, 72, COL.amber, { label: 'shopper' });
      D.arrowObj(c, R.I.x, Y, Y - R.I.y, COL.magenta, { dashed: true, w: 4 });
      D.text(c, 'image ×' + img.m.toFixed(2), R.I.x + 10, R.I.y - 30, { size: 17, col: COL.magenta, align: 'left', bg: 'rgba(255,255,255,.9)' });
      void t;
    }
  },
  {
    id: 'telescope', name: 'Reflecting telescope', type: 'concave',
    why: 'A large <b>concave</b> mirror collects light from a faraway star (parallel rays) and brings it to a focus. A small <b>plane</b> mirror turns the light sideways to the eyepiece. Big mirrors gather more light, so faint stars become visible.',
    prop: 'Parallel rays → converge at F (plus a plane mirror)',
    tile(c, w, h, t) {
      c.fillStyle = '#050a1c'; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(220,235,255,' + (.3 + .5 * Math.abs(Math.sin(t + i))) + ')'; c.fillRect((i * 97) % w, (i * 53) % (h * .6), 2, 2); }
      c.save(); c.translate(w * .55, h * .62); c.rotate(-.45);
      c.fillStyle = '#d8dde8'; D.rrect(c, -130, -36, 260, 72, 10); c.fill(); c.fillStyle = '#1c2540'; c.fillRect(-140, -30, 14, 60);
      c.fillStyle = '#3b4560'; c.fillRect(70, -56, 18, 22); c.restore();
      c.strokeStyle = '#8a93a8'; c.lineWidth = 6; c.beginPath(); c.moveTo(w * .55, h * .66); c.lineTo(w * .48, h); c.moveTo(w * .55, h * .66); c.lineTo(w * .66, h); c.stroke();
    },
    detail(c, w, h, t) {
      const pm = { type: 'concave', P: P(530, 175), R: 600, a: 62, rot: 0 };
      const sm = { type: 'plane', P: P(320, 175), R: 1, a: 28, rot: 3 * Math.PI / 4 };
      c.save(); c.strokeStyle = 'rgba(70,80,120,.55)'; c.lineWidth = 3; c.strokeRect(40, 108, 500, 134); c.strokeRect(300, 66, 40, 42); c.restore();
      D.text(c, 'eyepiece', 320, 50, { size: 16, col: COL.white });
      for (const y of [-52, -40, 40, 52]) {
        const s = P(0, 175 + y), r1 = OPT.traceMirror(pm, s, P(1, 0), 600);
        if (!r1.hit) continue;
        const h2 = OPT.hitMirror(sm, r1.hit, r1.out);
        let pts = [s, r1.hit];
        if (h2) { const r2 = OPT.reflect(r1.out, h2.n); pts = pts.concat([h2.pt, V.add(h2.pt, V.mul(r2, 130))]); } else pts.push(V.add(r1.hit, V.mul(r1.out, 300)));
        D.ray(c, pts, COL.cyan, 2.2); D.arrowOn(c, pts[0], pts[1], COL.cyan, 11, .3);
        D.pulses(c, pts, t, '#fff', { speed: 240, gap: 160, r: 2.6 });
      }
      D.mirror(c, pm); D.mirror(c, sm, { hatch: false });
      D.text(c, 'starlight', 40, 90, { size: 16, col: COL.cyan, align: 'left' });
      D.text(c, 'concave primary', 520, 270, { size: 16, col: COL.amber });
      D.text(c, 'plane mirror', 320, 270, { size: 16, col: COL.cyan });
    }
  }
];

LL.add({
  id: 'mirror-apps', title: 'Mirrors in the real world', section: 'Reflection',
  build(root) {
    const bench = el('div', { class: 'bench' });
    bench.append(el('div', { class: 'scene-head' }, el('span', { class: 'kicker' }, 'Scene 7 · Figs 10.6 & 10.7'), el('h1', null, 'Which mirror, and why? Click a scene')));
    const grid = el('div', { class: 'app-grid' }); bench.append(grid);
    root.append(bench);
    const tiles = APPS.map(a => {
      const cv = makeCanvas(406, 336);
      const b = el('button', { type: 'button', class: 'app-tile', 'aria-label': a.name }, cv.cv, el('div', { class: 'cap' }, el('span', null, a.name), el('span', { class: 'badge ' + a.type }, a.type)));
      b.addEventListener('click', () => select(a.id));
      grid.append(b); return { a, cv, b };
    });
    bench.append(el('p', { class: 'note', style: 'margin:0;font-size:19px' }, 'Each diagram uses exact reflection or the school ray-diagram model, as in the labs.'));
    const dcv = makeCanvas(560, 320);
    const name = el('div', { class: 'q', style: 'display:flex;gap:12px;align-items:center;margin:0' });
    const why = el('p'), prop = el('p', { class: 'note' });
    const detail = UI.card('live', 'Ray diagram', null, name, el('div', { class: 'cvwrap', style: 'margin:10px 0' }, dcv.cv), why, prop);
    const ans = el('div', { class: 'ans', hidden: true, html: 'Side-view mirrors are <b>convex</b>. They form <b>diminished</b> images, so a vehicle looks smaller and therefore <b>farther away</b> than it really is. The warning reminds drivers to judge distances carefully.' });
    const q = UI.card('predict', 'In-text question', null, el('p', { html: 'On side-view mirrors of vehicles there is a warning: <b>"Objects in mirror are closer than they appear"</b>. Why is this warning written there?' }), UI.btn('Show answer', () => { ans.hidden = false; }, 'btn sm'), ans);
    const panel = el('aside', { class: 'panel' }, detail, q);
    panel._narrate = () => name.textContent + '. ' + why.textContent;
    root.append(panel); root._panel = panel;
    let cur = APPS[2];
    function select(id) {
      cur = APPS.find(a => a.id === id);
      tiles.forEach(tl => tl.b.classList.toggle('on', tl.a === cur));
      name.innerHTML = ''; name.append(el('span', null, cur.name), el('span', { class: 'badge ' + cur.type }, cur.type + ' mirror'));
      why.innerHTML = cur.why; prop.innerHTML = '<b>Property used:</b> ' + cur.prop;
    }
    select('sideview');
    let t = 0;
    return {
      reset() { select('sideview'); ans.hidden = true; },
      frame(dt) {
        t += dt;
        for (const tl of tiles) { tl.cv.begin(); tl.a.tile(tl.cv.ctx, tl.cv.w, tl.cv.h, t); }
        dcv.begin(); D.bg(dcv); cur.detail(dcv.ctx, dcv.w, dcv.h, t);
      }
    };
  }
});

'use strict';
/* Part 4 groundwork: (1) the four special rays of a spherical mirror, each built up slowly with its normal and angles;
   (2) step-by-step construction of the image for each object position. Next ▶ steps through both. */

/* arc from direction a0 to a1 the short way round */
function shortArc(c, O, r, a0, a1, col, label) {
  let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  c.save(); c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.arc(O.x, O.y, r, a0, a0 + d, d < 0); c.stroke();
  c.globalAlpha = .14; c.fillStyle = col; c.beginPath(); c.moveTo(O.x, O.y); c.arc(O.x, O.y, r, a0, a0 + d, d < 0); c.closePath(); c.fill(); c.restore();
  if (label) { const m = a0 + d / 2; D.text(c, label, O.x + Math.cos(m) * (r + 24), O.y + Math.sin(m) * (r + 24), { size: 22, col, font: 'mono', bg: COL.pill, pad: 4 }); }
}

const RULES = {
  1: { tab: 'Rule 1: Parallel ray', short: { concave: 'Parallel to the axis → reflects through F', convex: 'Parallel to the axis → reflects as if coming from F' },
       text: { concave: 'A ray <b>parallel to the principal axis</b>, after reflection, <b>passes through the principal focus F</b>.',
               convex: 'A ray <b>parallel to the principal axis</b>, after reflection, <b>appears to come from the principal focus F</b> behind the mirror.' },
       why: 'At the point where the ray strikes, the <b>normal</b> is the line joining that point to <b>C</b> (a radius of the sphere). The ray reflects so that <b>∠i = ∠r</b> about this normal. For rays close to the axis, this sends every parallel ray through the same point: that point is what we call the focus F.' },
  2: { tab: 'Rule 2: Ray through F', short: { concave: 'Through F → reflects parallel to the axis', convex: 'Aimed at F → reflects parallel to the axis' },
       text: { concave: 'A ray <b>passing through the focus F</b>, after reflection, <b>becomes parallel to the principal axis</b>.',
               convex: 'A ray <b>directed towards the focus F</b> (behind the mirror), after reflection, <b>becomes parallel to the principal axis</b>.' },
       why: 'This is Rule 1 <b>run backwards</b>. If light is sent back along its own path it retraces it, so a ray arriving along the "F line" leaves along the "parallel line".' },
  3: { tab: 'Rule 3: Ray through C', short: { concave: 'Through C → reflects back along the same path', convex: 'Aimed at C → reflects back along the same path' },
       text: { concave: 'A ray <b>passing through the centre of curvature C</b> is <b>reflected back along the same path</b>.',
               convex: 'A ray <b>directed towards the centre of curvature C</b> is <b>reflected back along the same path</b>.' },
       why: 'Any line from C to the mirror is a <b>radius</b>, and a radius is always <b>perpendicular (normal)</b> to the mirror. This ray travels along the normal itself, so <b>∠i = 0°</b> and therefore <b>∠r = 0°</b>: it goes straight back.' },
  4: { tab: 'Rule 4: Ray at the pole', short: { concave: 'Strikes P → reflects at an equal angle to the axis', convex: 'Strikes P → reflects at an equal angle to the axis' },
       text: { concave: 'A ray striking the <b>pole P</b> is reflected making an <b>equal angle with the principal axis</b>.',
               convex: 'A ray striking the <b>pole P</b> is reflected making an <b>equal angle with the principal axis</b>.' },
       why: 'At the pole, the line to C <b>is the principal axis</b>, so the principal axis is the normal at P. The law ∠i = ∠r is therefore measured from the principal axis.' }
};

const RULE_TITLES = { 1: 'Rule 1: a ray parallel to the principal axis', 2: 'Rule 2: a ray through the focus F', 3: 'Rule 3: a ray through the centre of curvature C', 4: 'Rule 4: a ray striking the pole P' };
[1, 2, 3, 4].forEach(RULE => LL.add({
  id: 'ray-rule-' + RULE, title: RULE_TITLES[RULE], section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Special ray ' + RULE + ' of 4', title: RULE_TITLES[RULE] });
    const o = L.cv, Y = 350;
    const rule = RULE; let type = 'concave', tt = 0;
    const sType = UI.seg('Mirror', [{ v: 'concave', t: 'Concave' }, { v: 'convex', t: 'Convex' }], type, v => { type = v; tt = 0; upd(); });
    L.controls.append(sType.el, UI.btn('Replay this ray ↺', () => { tt = 0; }, 'btn go'),
      el('span', { class: 'lbl', style: 'font-size:17px;color:var(--muted)' }, 'Next ▶ shows the same rule for a convex mirror, then moves on.'));
    const ruleTitle = el('div', { class: 'q', style: 'margin:0 0 6px' }), ruleText = el('p', { style: 'font-size:23px' });
    const why = el('p');
    const stage = el('p', { class: 'note' });
    const panel = el('aside', { class: 'panel' },
      UI.card('predict', 'The rule', null, ruleTitle, ruleText),
      UI.card('explain', 'Why?', null, why),
      UI.card('live', 'Watch the drawing', null, el('ol', null,
        el('li', null, 'The ray travels to the mirror.'), el('li', null, 'The normal appears (it always passes through C).'),
        el('li', null, 'Angle of incidence i is marked from the normal.'), el('li', null, 'The reflected ray leaves with ∠r = ∠i.')), stage),
      UI.card('observe', 'Remember', null, el('p', { html: 'To find an image we need only <b>two</b> of these rays from the top of the object. Where they meet, or seem to meet, is the top of the image.' })));
    panel._narrate = () => ruleTitle.textContent + '. ' + ruleText.textContent + ' Why? ' + why.textContent;
    L.setPanel(panel);
    function upd() {
      sType.set(type);
      ruleTitle.textContent = 'Rule ' + rule + ' (' + type + ' mirror)';
      ruleText.innerHTML = RULES[rule].text[type]; why.innerHTML = RULES[rule].why;
    }
    upd();
    function setup() {
      const m = type === 'concave' ? { type, P: P(1040, Y), R: 640, a: 240, rot: 0 } : { type, P: P(760, Y), R: 640, a: 240, rot: 0 };
      const C = OPT.mirrorCenter(m), F = OPT.mirrorFocus(m);
      let S, d;
      const toward = (s, q) => { S = s; d = V.norm(V.sub(q, s)); };
      if (type === 'concave') {
        if (rule === 1) { S = P(40, Y - 120); d = P(1, 0); }
        if (rule === 2) toward(P(250, Y - 170), F);
        if (rule === 3) toward(P(60, Y - 64), C);
        if (rule === 4) toward(P(240, Y - 200), m.P);
      } else {
        if (rule === 1) { S = P(40, Y - 120); d = P(1, 0); }
        if (rule === 2) toward(P(40, Y - 300), F);
        if (rule === 3) toward(P(40, Y - 220), C);
        if (rule === 4) toward(P(220, Y - 190), m.P);
      }
      const hit = OPT.hitMirror(m, S, d);
      return { m, C, F, S, d, hit };
    }
    return {
      advance() {
        if (type === 'concave') { type = 'convex'; tt = 0; upd(); return true; }
        return false;
      },
      reset() { type = 'concave'; tt = 0; upd(); },
      replay() { tt = 0; },
      onShow() { tt = 0; },
      frame(dt, now) {
        tt += dt;
        const c = o.ctx; o.begin(); D.bg(o);
        const { m, C, F, S, d, hit } = setup();
        if (type === 'convex') { c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(m.P.x, 0, o.w - m.P.x, o.h); c.restore(); D.text(c, 'BEHIND THE MIRROR', o.w - 18, 24, { size: 15, col: COL.muted, align: 'right', font: 'mono' }); }
        D.axis(c, Y, 0, o.w, 'Principal axis');
        D.mirror(c, m);
        D.mark(c, C.x, Y, 'C', COL.amber); D.mark(c, F.x, Y, 'F', COL.white); D.text(c, 'P', m.P.x + (type === 'concave' ? 22 : -22), Y + 26, { size: 21, col: COL.cyan, font: 'mono', bg: COL.pill, pad: 4 });
        D.text(c, 'Rule ' + rule + ': ' + RULES[rule].short[type], o.w / 2, 30, { size: 24, col: COL.white, bg: COL.pill });
        if (!hit) return;
        const H = hit.pt, out = OPT.reflect(d, hit.n);
        // stage 1: incident ray
        const inc = [S, H], pIn = clamp(tt / 1.5, 0, 1);
        D.ray(c, D.upTo(inc, V.dist(S, H) * pIn), COL.cyan, 3.4); if (pIn > .5) D.arrowOn(c, S, H, COL.cyan, 16, .5);
        if (rule === 2 && pIn > .3 && type === 'concave') D.dot(c, F.x, F.y, 7, COL.amber);
        if (rule === 3 && pIn > .3 && type === 'concave') D.dot(c, C.x, C.y, 7, COL.amber);
        if (type === 'convex' && (rule === 2 || rule === 3) && pIn >= 1) { D.line(c, H, rule === 2 ? F : C, COL.cyan, 2, [7, 7], .7); D.text(c, rule === 2 ? 'aimed at F' : 'aimed at C', (H.x + (rule === 2 ? F : C).x) / 2, H.y - 18, { size: 17, col: COL.cyan, bg: COL.pill }); }
        let stageTxt = 'Stage 1: the ray travels to the mirror.';
        // stage 2: the normal at the point of incidence (a radius, through C)
        const front = type === 'concave' ? V.norm(V.sub(C, H)) : V.norm(V.sub(H, C));
        if (tt > 1.7) {
          stageTxt = 'Stage 2: the normal at this point is the line through C.';
          if (type === 'concave') D.line(c, C, H, COL.amber, 2.5, [9, 7]);
          else { D.line(c, H, V.add(H, V.mul(front, 260)), COL.amber, 2.5, [9, 7]); D.line(c, H, C, COL.amber, 1.5, [4, 7], .5); }
          const lp = V.add(H, V.mul(front, 170));
          D.text(c, rule === 4 ? 'normal = principal axis' : 'normal (radius from C)', lp.x, lp.y - 22, { size: 18, col: COL.amber, bg: COL.pill });
          D.dot(c, H.x, H.y, 6, COL.white, false);
        }
        // stage 3: angle of incidence
        const aN = Math.atan2(front.y, front.x), aI = Math.atan2(-d.y, -d.x), aR = Math.atan2(out.y, out.x);
        const zero = Math.abs(V.dot(front, V.mul(d, -1)) - 1) < 1e-3;
        if (tt > 2.6) {
          stageTxt = 'Stage 3: the angle of incidence i is measured from the normal.';
          if (!zero) shortArc(c, H, 64, aN, aI, COL.cyan, 'i');
          else D.text(c, 'i = 0° (the ray is along the normal)', H.x - 200, H.y + 40, { size: 20, col: COL.cyan, bg: COL.pill });
        }
        // stage 4: reflected ray
        if (tt > 3.4) {
          stageTxt = 'Stage 4: the reflected ray leaves with ∠r = ∠i.';
          const len = type === 'concave' ? (rule === 1 ? 760 : 900) : 700;
          let o0 = H; if (zero) o0 = V.add(H, P(-out.y * 7, out.x * 7));
          const outPts = [o0, V.add(o0, V.mul(out, len))], pOut = clamp((tt - 3.4) / 1.6, 0, 1);
          D.ray(c, D.upTo(outPts, len * pOut), COL.magenta, 3.4); if (pOut > .4) D.arrowOn(c, outPts[0], outPts[1], COL.magenta, 16, .3);
          if (type === 'convex' && rule === 1 && pOut >= 1) { D.line(c, H, F, COL.magenta, 2, [7, 7], .8); D.text(c, 'seems to come from F', F.x + 10, F.y - 30, { size: 18, col: COL.magenta, align: 'left', bg: COL.pill }); }
          if (pOut >= 1) {
            if (!zero) shortArc(c, H, 64, aN, aR, COL.magenta, 'r');
            D.text(c, zero ? '∠i = ∠r = 0°: the ray goes straight back' : '∠i = ∠r', type === 'concave' ? 300 : 260, o.h - 40, { size: 24, col: COL.magenta, bg: COL.pill });
            D.pulses(c, [S, H, outPts[1]], now, COL.cyan, { speed: 260, gap: 150, r: 4 });
            if (type === 'concave' && rule === 1) { const g = .5 + .5 * Math.sin(now * 5); D.dot(c, F.x, F.y, 6 + g * 4, COL.amber); D.text(c, 'passes through F', F.x, F.y - 34, { size: 19, col: COL.amber, bg: COL.pill }); }
            if (rule === 2) D.text(c, 'parallel to the axis', outPts[1].x + 150, outPts[1].y - 22, { size: 19, col: COL.magenta, bg: COL.pill });
          }
        }
        if (stage.textContent !== stageTxt) stage.textContent = stageTxt;
      }
    };
  }
}));

/* ---------------- image construction, step by step ---------------- */
const IMG_CASES = [
  { key: 'beyondC', tab: 'Beyond C', type: 'concave', u: 30, ray2: 'r3', where: 'beyond the centre of curvature C',
    res: ['Between F and C', 'Smaller (diminished)', 'Real and inverted'],
    why: 'The two reflected rays <b>really cross</b> between F and C, below the axis. Because the object is far away, they cross close to F, so the image is <b>small</b>. Rays really meet, so the image is <b>real</b> (it can be caught on a screen) and it is <b>upside down</b>.' },
  { key: 'atC', tab: 'At C', type: 'concave', u: 20, ray2: 'r2', where: 'at the centre of curvature C',
    res: ['At C', 'Same size', 'Real and inverted'],
    why: 'Here Ray 2 is the ray through F (a ray through C would go straight up the object). The rays meet exactly <b>at C</b>, below the axis. Object and image are at the same distance from the mirror, so they are the <b>same size</b>: real and inverted.' },
  { key: 'CF', tab: 'Between C and F', type: 'concave', u: 15, ray2: 'r3', where: 'between C and F',
    res: ['Beyond C', 'Bigger (enlarged)', 'Real and inverted'],
    why: 'Now the reflected rays cross <b>beyond C</b>, farther from the mirror than the object. The farther the image, the bigger it is: <b>enlarged</b>, real and inverted. (This is the reverse of the "beyond C" case.)' },
  { key: 'atF', tab: 'At F', type: 'concave', u: 10, ray2: 'r3', where: 'at the focus F',
    res: ['At infinity (no image)', 'Highly enlarged', 'Real and inverted (at infinity)'],
    why: 'Ray 1 goes through F and Ray 2 comes back from C, and after reflection the two rays are <b>parallel</b>. Parallel rays never meet, so <b>no image forms</b> (we say it is "at infinity"). A torch uses this: its bulb is at F, giving a parallel beam.' },
  { key: 'FP', tab: 'Between F and P', type: 'concave', u: 6, ray2: 'r3', where: 'between F and the pole P',
    res: ['Behind the mirror', 'Bigger (enlarged)', 'Virtual and erect'],
    why: 'The reflected rays <b>spread out</b>; they never meet in front of the mirror. Our eye traces them <b>backwards</b> in straight lines (dashed), and they seem to meet <b>behind the mirror</b>. Light does not really go there, so the image is <b>virtual</b>, upright and enlarged, like a dentist’s or shaving mirror.' },
  { key: 'convex', tab: 'Convex mirror', type: 'convex', u: 25, ray2: 'r3', where: 'anywhere in front of a convex mirror',
    res: ['Behind the mirror, between P and F', 'Smaller (diminished)', 'Virtual and erect'],
    why: 'A convex mirror always <b>spreads</b> the reflected rays apart. Traced backwards, they meet <b>behind the mirror between P and F</b>. So for every object position the image is <b>virtual, upright and smaller</b>. That is why it shows a wide area in a vehicle’s side mirror.' }
];

const CASE_TITLES = ['Object beyond C', 'Object at C', 'Object between C and F', 'Object at F', 'Object between F and P', 'Convex mirror: object anywhere'];
IMG_CASES.forEach((KASE, CI) => LL.add({
  id: 'image-case-' + (CI + 1), title: 'Case ' + (CI + 1) + ': ' + CASE_TITLES[CI], section: 'Mirrors',
  build(root) {
    const L = labLayout(root, { kicker: 'Image formation · case ' + (CI + 1) + ' of 6', title: 'Case ' + (CI + 1) + ': ' + CASE_TITLES[CI] });
    const o = L.cv, X = 1000, Y = 340, S = 16, H0 = 3;
    const ci = CI; let step = 1, ts = 0;
    L.controls.append(
      UI.btn('◀ Previous step', () => { if (step > 1) { step--; ts = 9; upd(); } }, 'btn'),
      UI.btn('Next step ▶', () => { if (step < 5) { step++; ts = 0; upd(); } }, 'btn go'),
      UI.btn('Show all steps', () => { step = 5; ts = 9; upd(); }, 'btn'),
      UI.btn('Start again', () => { step = 1; ts = 0; upd(); }, 'btn'));
    const steps = el('ol', { class: 'step-list' });
    const res = el('dl', { class: 'readout' }), why = el('p');
    const resCard = UI.card('explain', 'Result and why', null, res, why);
    const panel = el('aside', { class: 'panel' }, UI.card('experiment', 'Steps', null, steps), resCard);
    panel._narrate = () => steps.textContent + ' ' + (step >= 5 ? why.textContent : '');
    L.setPanel(panel);
    function stepTexts(k) {
      const cv = k.type === 'concave';
      const r2 = k.ray2 === 'r2' ? '<b>Ray 2:</b> from A through <b>F</b>. After reflection it comes out <b>parallel</b> to the principal axis (Rule 2).'
        : cv ? '<b>Ray 2:</b> from A along the line through <b>C</b>. It strikes the mirror along the normal and <b>comes straight back</b> (Rule 3).'
          : '<b>Ray 2:</b> from A <b>aimed at C</b>. It strikes along the normal and <b>comes straight back</b> (Rule 3).';
      const meet = k.key === 'atF' ? 'The two reflected rays are <b>parallel</b>. They never meet, so <b>no image</b> forms.'
        : (k.key === 'FP' || !cv) ? 'The reflected rays <b>spread out</b>. Extend them <b>backwards</b> (dashed) behind the mirror: they seem to meet at <b>A′</b>. Draw A′B′ to the axis: that is the image.'
          : 'The reflected rays <b>actually meet</b> at <b>A′</b>, the image of the top A. Draw A′B′ down to the axis: that is the image.';
      return ['Draw the object <b>AB</b> standing on the principal axis, ' + k.where + '.',
        '<b>Ray 1:</b> from A, <b>parallel</b> to the principal axis. After reflection it ' + (cv ? 'passes <b>through F</b>' : 'seems to come <b>from F</b>') + ' (Rule 1).',
        r2, meet, 'Read the result: <b>where</b> is the image, how <b>big</b> is it, and is it <b>real or virtual</b>?'];
    }
    function upd() {
      const k = IMG_CASES[ci];
      steps.innerHTML = '';
      stepTexts(k).forEach((t, i) => steps.append(el('li', { class: i + 1 < step ? 'done' : i + 1 === step ? 'on' : '', html: '<span>Step ' + (i + 1) + '</span> ' + t })));
      res.innerHTML = '';
      [['Image position', k.res[0]], ['Size', k.res[1]], ['Nature', k.res[2]]].forEach(([a, b]) => res.append(el('dt', null, a), el('dd', null, b)));
      why.innerHTML = k.why;
      resCard.style.opacity = step >= 5 ? 1 : .35;
    }
    upd();
    return {
      advance() {
        if (step < 5) { step++; ts = 0; upd(); return true; }
        return false;
      },
      reset() { step = 1; ts = 0; upd(); },
      onShowStep() {},
      replay() { ts = 0; },
      onShow() { ts = 0; },
      frame(dt, now) {
        ts += dt;
        const c = o.ctx; o.begin(); D.bg(o);
        const k = IMG_CASES[ci], cv = k.type === 'concave', f = cv ? -10 : 10;
        const m = { type: k.type, P: P(X, Y), R: 2 * 10 * S, a: 220, rot: 0 };
        const C = OPT.mirrorCenter(m), F = OPT.mirrorFocus(m);
        c.save(); c.fillStyle = 'rgba(60,75,130,.07)'; c.fillRect(X, 0, o.w - X, o.h); c.restore();
        D.text(c, 'BEHIND THE MIRROR', o.w - 18, 24, { size: 15, col: COL.muted, align: 'right', font: 'mono' });
        D.axis(c, Y, 0, o.w, 'Principal axis');
        D.mirror(c, m); D.mark(c, C.x, Y, 'C', COL.amber); D.mark(c, F.x, Y, 'F', COL.white);
        D.text(c, 'P', X + (cv ? 20 : -20), Y + 26, { size: 21, col: COL.cyan, font: 'mono', bg: COL.pill, pad: 4 });
        const T = P(X - k.u * S, Y - H0 * S);
        const img = OPT.mirrorImage(-k.u, f);
        const on = { r1: true, r2: k.ray2 === 'r2', r3: k.ray2 === 'r3', r4: false };
        const R = OPT.labRays({ kind: 'mirror', type: k.type, X, Y, s: S, f, T, img, mirror: m, on, box: { x0: -10, y0: -10, x1: o.w + 10, y1: o.h + 10 } });
        // step 1: object
        D.arrowObj(c, T.x, Y, H0 * S, COL.amber, { w: 6 });
        D.text(c, 'A', T.x - 20, T.y - 6, { size: 22, col: COL.amber, font: 'mono' }); D.text(c, 'B', T.x - 20, Y + 22, { size: 22, col: COL.amber, font: 'mono' });
        const draw = (r, idx) => {
          if (!r || !r.inc) return;
          const full = [r.inc[0], r.inc[1], r.out[1]], Lt = D.polyLen(full);
          const p = step === idx + 1 ? clamp(ts / 2.2, 0, 1) : 1;
          D.ray(c, D.upTo(full, Lt * p), idx === 1 ? COL.r1 : COL.r3, 3);
          if (p > .4) D.arrowOn(c, full[0], full[1], idx === 1 ? COL.r1 : COL.r3, 15, .5);
          if (p >= 1) D.arrowOn(c, full[1], full[2], idx === 1 ? COL.r1 : COL.r3, 15, .25);
          const lab = V.add(r.inc[0], V.mul(V.sub(r.inc[1], r.inc[0]), .35));
          D.text(c, 'Ray ' + idx, lab.x, lab.y - 20, { size: 19, col: idx === 1 ? COL.r1 : COL.r3, bg: COL.pill });
        };
        const r1 = R.rays.find(r => r.id === 'r1'), r2 = R.rays.find(r => r.id === k.ray2);
        if (step >= 2) draw(r1, 1);
        if (step >= 3) draw(r2, 2);
        if (step === 2 || step === 3) {
          const t = step === 2 ? (cv ? 'Rule 1: parallel ray → reflects through F' : 'Rule 1: parallel ray → seems to come from F')
            : (k.ray2 === 'r2' ? 'Rule 2: ray through F → reflects parallel' : 'Rule 3: ray along C → comes straight back');
          D.text(c, t, o.w / 2, 30, { size: 23, col: COL.white, bg: COL.pill });
        }
        if (step >= 4) {
          if (img.inf) {
            D.text(c, 'The reflected rays are parallel: they never meet, so no image is formed', o.w / 2, 30, { size: 22, col: COL.amber, bg: COL.pill });
          } else {
            const I = R.I, real = img.v < 0, g = .5 + .5 * Math.sin(now * 5);
            for (const r of [r1, r2]) if (r && r.back) D.line(c, r.back[0], r.back[1], r === r1 ? COL.r1 : COL.r3, 2.2, [8, 7], .9);
            const pI = clamp(ts / 1.2, 0, 1) * (step === 4 ? 1 : 1);
            D.dot(c, I.x, I.y, 7 + g * 4, COL.magenta);
            if (pI > .5 || step > 4) {
              D.arrowObj(c, I.x, Y, Y - I.y, COL.magenta, { dashed: !real, w: 5 });
              D.text(c, 'A′', I.x + 22, I.y + (I.y > Y ? 14 : -6), { size: 22, col: COL.magenta, font: 'mono' }); D.text(c, 'B′', I.x + 22, Y - 16, { size: 22, col: COL.magenta, font: 'mono' });
            }
            D.text(c, real ? 'The rays really meet at A′' : 'The rays only seem to meet at A′ (behind the mirror)', o.w / 2, 30, { size: 22, col: COL.magenta, bg: COL.pill });
          }
        }
        if (step >= 5) {
          D.text(c, 'Image: ' + k.res.join(' · '), o.w / 2, o.h - 34, { size: 23, col: COL.green, bg: COL.pill });
        }
        if (step >= 2 && !LL.reduced) { for (const r of [r1, r2]) if (r && r.inc && step >= (r === r1 ? 3 : 4)) D.pulses(c, [r.inc[0], r.inc[1], r.out[1]], now, COL.cyan, { speed: 220, gap: 160, r: 3.5, limit: 1600 }); }
      }
    };
  }
}));

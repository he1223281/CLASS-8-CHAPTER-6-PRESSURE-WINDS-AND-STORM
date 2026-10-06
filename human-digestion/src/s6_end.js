/* ===================== ACT 6 · THE BIG PICTURE ===================== */
function keyInterp(keys, t, idx) {
  if (t <= keys[0][0]) return keys[0][idx];
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) return lerp(a[idx], b[idx], ease((t - a[0]) / (b[0] - a[0]))); }
  return keys[keys.length - 1][idx];
}
function keyLinear(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) return lerp(a[1], b[1], (t - a[0]) / (b[0] - a[0])); }
  return keys[keys.length - 1][1];
}
const RECAP_CAP = [
  [0, 'One bite of food'], [2.5, 'Mouth'], [4, 'Chewing'], [7, 'Saliva'], [10, 'Tongue'], [12.5, 'Oesophagus'], [14.5, 'Wave-like movement'],
  [18.5, 'Stomach'], [20.5, 'Churning'], [23, 'Digestive juice + acid + mucus'], [27, 'Small intestine'], [29, 'Bile'], [31, 'Pancreatic juice'],
  [33, 'Intestinal juices'], [35.5, 'Digested nutrients'], [38, 'Absorption'], [40.5, 'Blood'], [43, 'Body'], [46.5, 'Large intestine'],
  [49.5, 'Water absorption'], [54, 'Rectum'], [57.5, 'Anus'], [59.5, 'Egestion'], [63, 'One bite. One incredible journey.']];
const RECAP_S = [[0, .3], [11.5, .6], [12.5, 1], [18.5, 2], [20, 2.15], [25.5, 2.6], [27, 3], [35, 3.1], [46, 3.995], [47, 4], [54, 4.98], [57.5, 5.9], [60, 6.99], [70, 6.99]];
const RECAP_CAM = [[0, 260, 1], [11, 260, 1], [13.5, 480, 1], [18.5, 460, 1], [26, 480, 1], [28, 440, 1], [35, 480, 1], [39, 800, .5], [40.5, 1100, 0], [45, 1100, 0], [47.5, 560, 1], [54, 520, 1], [60, 520, 1], [63.5, 1100, 0], [70, 1100, 0]];
const RECAP_END = 66;

slide({
  act: 6, title: 'The complete journey (recap)',
  html: `
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt({ vessels: true })}</svg>
  <div class="abs" style="left:1060px;top:0;width:860px;height:1080px;background:linear-gradient(90deg,rgba(4,7,11,0),rgba(4,7,11,.9) 32%,rgba(4,7,11,.94));pointer-events:none"></div>
  <div class="abs" style="left:1300px;top:150px;width:580px">
    <div class="kicker">The complete journey</div>
    <div class="abs" style="left:0;top:60px;width:4px;height:640px;background:rgba(255,255,255,.1);border-radius:2px"><i class="rbar" style="display:block;width:4px;background:var(--teal);border-radius:2px;height:0"></i></div>
    <div class="abs cp0" style="left:36px;top:150px;width:560px;font:500 32px/1.25 var(--sans);color:rgba(230,240,250,.32)"></div>
    <div class="abs cp1" style="left:36px;top:250px;width:560px;font:700 64px/1.1 var(--serif);color:#fff"></div>
    <div class="abs cp2" style="left:36px;top:470px;width:560px;font:500 32px/1.25 var(--sans);color:rgba(230,240,250,.32)"></div>
  </div>
  <div class="abs" style="left:1336px;top:930px;font:500 22px/1 var(--sans);letter-spacing:.12em;color:rgba(230,240,250,.4)">R · REPLAY &nbsp;&nbsp; P · PAUSE</div>`,
  init(c) {
    c.svg = c.q('svg.body'); c.trk = new Track(c.svg, BODY.TRACK);
    const fx = c.q('.fx'), R = rng(91);
    c.glow = el('circle', { r: 22, fill: 'url(#gGold)', opacity: .7 }, fx);
    c.bol = el('circle', { r: 8, fill: 'url(#gBolus)', stroke: 'rgba(255,240,210,.9)', 'stroke-width': 1.5 }, fx);
    c.crumbs = Array.from({ length: 7 }, (_, i) => ({ a: i / 7 * 6.28, e: el('circle', { r: 3, fill: 'url(#gFood)', opacity: 0 }, fx) }));
    c.sal = Array.from({ length: 10 }, (_, i) => ({ a: i / 10 * 6.28, e: dotEl(fx, 4, 'url(#gBlue)', { opacity: 0 }) }));
    c.squeeze = [0, 1].map(() => el('path', { fill: 'none', stroke: '#ff6b6b', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, fx));
    const stomPoly = samplePath(BODY.STOM_ORG, 60);
    c.sj = Array.from({ length: 30 }, (_, i) => { let x, y; do { x = 300 + R() * 120; y = 410 + R() * 130; } while (!inPoly(x, y, stomPoly)); return { x, y, k: i % 3, ph: R() * 6, e: dotEl(fx, 4.5, ['url(#gGold)', 'url(#gGreen)', 'url(#gBlue)'][i % 3], { opacity: 0 }) }; });
    const mkFlow = (d, n, fill) => { const p = el('path', { d, fill: 'none', stroke: 'none' }, fx); const L = p.getTotalLength(); return { p, L, dots: Array.from({ length: n }, (_, i) => ({ o: i / n, e: dotEl(fx, 4, fill, { opacity: 0 }) })) }; };
    c.fB = mkFlow(BODY.BILE, 6, 'url(#gGreen)'); c.fP = mkFlow(BODY.PDUCT, 6, 'url(#gGold)');
    c.fI = Array.from({ length: 14 }, (_, i) => ({ o: R() * .25, e: dotEl(fx, 3.5, 'url(#gRed)', { opacity: 0 }) }));
    c.siP = c.trk.ps[3]; c.siL = c.trk.L[3];
    c.vp = BODY.VESS.map(d => { const p = el('path', { d, fill: 'none', stroke: 'none' }, fx); return [p, p.getTotalLength()]; });
    c.nut = Array.from({ length: 46 }, (_, i) => ({ v: i % c.vp.length, o: R(), d: R() * 3, e: dotEl(fx, 5, i % 2 ? 'url(#gGold)' : 'url(#gTeal)', { opacity: 0 }) }));
    c.wat = Array.from({ length: 16 }, (_, i) => ({ o: R(), a: R() * 6.28, e: dotEl(fx, 4.5, 'url(#gBlue)', { opacity: 0 }) }));
    c.capI = -1; c.orgEls = c.qa('.org');
  },
  enter(c) { c.T0 = 0; },
  replay(c) { c.t = 0; },
  step(c) { c.t = 0; },
  tick(c) {
    const T = Math.min(c.t, 70), t = c.t;
    const s = keyLinear(RECAP_S, T);
    const p = c.trk.pt(s);
    const h = keyInterp(RECAP_CAM, T, 1), fw = keyInterp(RECAP_CAM, T, 2);
    const fx_ = lerp(300, p[0], fw), fy_ = lerp(510, p[1], fw);
    cam(c.svg, fx_ + 360 * (h / 1080), fy_, h);
    // captions
    let ci = 0; RECAP_CAP.forEach((k, i) => { if (T >= k[0]) ci = i; });
    if (ci !== c.capI) {
      c.capI = ci;
      c.q('.cp0').textContent = ci > 0 ? RECAP_CAP[ci - 1][1] : '';
      c.q('.cp1').textContent = RECAP_CAP[ci][1];
      c.q('.cp2').textContent = ci < RECAP_CAP.length - 1 ? RECAP_CAP[ci + 1][1] : '';
      const cp1 = c.q('.cp1'); cp1.style.transition = 'none'; cp1.style.opacity = 0; cp1.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => { cp1.style.transition = 'opacity .6s, transform .6s'; cp1.style.opacity = 1; cp1.style.transform = 'none'; });
      const org = s < 1 ? 0 : s < 2 ? 1 : s < 3 ? 2 : s < 4 ? 3 : s < 5 ? 4 : s < 6 ? 5 : 6;
      setOrgan(T >= 63 ? 'all' : org);
      const key = ['mouthm', 'oes', 'stom', 'si', 'li', 'rec', 'anus'][org];
      c.orgEls.forEach(g => { g.style.transition = 'opacity .8s'; g.style.opacity = T >= 63 || T < 2 || g.classList.contains(key) || (org === 3 && (g.classList.contains('liver') || g.classList.contains('panc') || g.classList.contains('gall'))) ? 1 : .45; });
    }
    c.q('.rbar').style.height = (clamp(T / RECAP_END) * 640) + 'px';
    // food appearance
    const inStool = s >= 4;
    const bcol = s < 3.1 ? 'url(#gBolus)' : s < 4 ? 'url(#gChyme)' : 'url(#gStool)';
    const chew = T >= 4 && T < 7 ? 1 : 0;
    setA(c.bol, { cx: f1(p[0]), cy: f1(p[1]), r: f1((s < 1 ? 8 : s < 4 ? 6.5 : 7) * (1 + .15 * chew * Math.sin(t * 14))), fill: bcol, opacity: T > RECAP_S[RECAP_S.length - 3][0] + .5 ? 0 : 1 });
    const goldGlow = T >= 35.5 && T < 46.5;
    setA(c.glow, { cx: f1(p[0]), cy: f1(p[1]), r: goldGlow ? 30 : 20, opacity: T > 60.5 ? 0 : goldGlow ? .95 : .55 });
    c.crumbs.forEach((k, i) => setA(k.e, { cx: f1(p[0] + 12 * Math.cos(k.a + t * 3)), cy: f1(p[1] + 7 * Math.sin(k.a + t * 3)), opacity: chew ? .9 : 0 }));
    c.sal.forEach((k, i) => setA(k.e, { cx: f1(p[0] + 16 * Math.cos(k.a - t * 2)), cy: f1(p[1] + 11 * Math.sin(k.a - t * 2)), opacity: T >= 7 && T < 12 ? .9 : 0 }));
    // squeeze behind bolus in the food pipe
    const sq = T >= 12.5 && T < 18.5;
    c.squeeze.forEach((e, k) => { const q = c.trk.pt(Math.max(1, s - .09)); e.setAttribute('d', `M${f1(q[0] + (k ? 8 : -8))},${f1(q[1] - 10)} L${f1(q[0] + (k ? 5 : -5))},${f1(q[1] + 4)}`); e.setAttribute('opacity', sq ? .9 : 0); });
    // stomach churning + juices
    const stomOn = T >= 18.5 && T < 27;
    const sc = stomOn && T >= 20.5 ? 1 + .025 * Math.sin(t * 6) : 1;
    c.q('.org.stom').setAttribute('transform', `translate(370,470) scale(${f1(sc * 1000) / 1000}) translate(-370,-470)`);
    c.sj.forEach(j => setA(j.e, { cx: f1(j.x + 6 * Math.sin(t * 2 + j.ph)), cy: f1(j.y + 6 * Math.cos(t * 1.6 + j.ph)), opacity: T >= 23 && T < 27 ? f1((.5 + .4 * Math.sin(t * 3 + j.ph)) * 100) / 100 : 0 }));
    const flow = (f, on, sp) => f.dots.forEach(d => { if (!on) { d.e.setAttribute('opacity', 0); return; } const ph = (t * sp + d.o) % 1; const q = f.p.getPointAtLength(ph * f.L); setA(d.e, { cx: f1(q.x), cy: f1(q.y), opacity: .95 }); });
    flow(c.fB, T >= 29 && T < 35.5, .5); flow(c.fP, T >= 31 && T < 35.5, .45);
    c.fI.forEach((d, i) => { const on = T >= 33 && T < 35.5; const q = c.siP.getPointAtLength((d.o + .02) * c.siL); setA(d.e, { cx: f1(q.x), cy: f1(q.y), opacity: on ? f1((.5 + .5 * Math.sin(t * 5 + i)) * 100) / 100 : 0 }); });
    // absorption -> blood -> body
    const vOn = T >= 38 && T < 47;
    c.q('.vess').setAttribute('opacity', vOn ? f1(Math.min(1, (T - 38) / 1.5, (47 - T) / 1) * 100) / 100 : 0);
    c.nut.forEach(nu => {
      if (!vOn || T < 38 + nu.d * .6) { nu.e.setAttribute('opacity', 0); return; }
      const ph = ((T - 38 - nu.d * .6) * .28 + nu.o * .2) % 1; const [pp, L] = c.vp[nu.v];
      const q = nu.v === 0 ? pp.getPointAtLength(ph * L) : (ph < .35 ? c.vp[0][0].getPointAtLength(ph / .35 * c.vp[0][1]) : pp.getPointAtLength((ph - .35) / .65 * L));
      setA(nu.e, { cx: f1(q.x), cy: f1(q.y), opacity: .95 });
    });
    // water leaving the large intestine
    c.wat.forEach(w => { const on = T >= 49.5 && T < 54.5; const ph = (t * .7 + w.o) % 1; setA(w.e, { cx: f1(p[0] + 30 * ph * Math.cos(w.a)), cy: f1(p[1] + 30 * ph * Math.sin(w.a)), opacity: on ? f1((1 - ph) * 100) / 100 : 0 }); });
  },
  notes: {
    say: 'Let us watch the whole journey of one bite without stopping. Narrate along with the captions, or – better – pause (P) at each stage and ask a student to say what happens next.',
    ask: 'Before the animation reaches each stage, ask: “What happens next? Which juice joins here?”',
    explain: 'Mouth (chewing + saliva) → food pipe (wave-like movement) → stomach (churning, digestive juice, acid, mucus) → small intestine (bile, pancreatic juice, intestinal juice; absorption into blood) → large intestine (water absorbed) → rectum (storage) → anus (egestion).',
    confusion: 'Watch for students who still think nutrients are absorbed in the stomach or large intestine – stop and correct during the recap.',
    transition: '“One bite… one incredible journey.”'
  }
});

/* ---------- 26. Finale ---------- */
slide({
  act: 6, organ: 'all', title: 'One bite. One incredible journey.',
  html: `
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt({ track: true })}</svg>
  <div class="abs fin" style="left:1120px;top:330px;width:760px">
    <div class="h1 f1" style="font-size:96px;opacity:0;transition:opacity 1.2s">ONE BITE.</div>
    <div class="h1 f2" style="font-size:96px;opacity:0;transition:opacity 1.2s;margin-top:10px">ONE INCREDIBLE<br><span class="c-nut">JOURNEY.</span></div>
    <div class="q f3" style="font-size:52px;opacity:0;transition:opacity 1.4s;margin-top:50px;color:var(--soft)">That is digestion.</div>
  </div>
  <div class="abs" style="left:1120px;bottom:40px;font:500 18px/1.4 var(--sans);color:rgba(230,240,250,.38)">Organ shapes traced from the public-domain digestive system diagram by Mariana Ruiz Villarreal (Wikimedia Commons).</div>`,
  init(c) { c.svg = c.q('svg.body'); cam(c.svg, 300 + 330 * (1120 / 1080), 495, 1120); c.trk = new Track(c.svg, BODY.TRACK); const fx = c.q('.fx'); c.g = el('circle', { r: 18, fill: 'url(#gGold)' }, fx); c.d = el('circle', { r: 6, fill: '#fff6d8' }, fx); c.orgEls = c.qa('.org'); },
  replay(c) { c.t = 0; },
  step(c) { c.t = 0; },
  tick(c) {
    const T = c.t, s = 7 * ease(seg(T, .8, 10.5));
    setTrackReveal(c, s);
    const p = c.trk.pt(Math.min(s, 6.99)), on = T > .8 && s < 6.98;
    [c.g, c.d].forEach(e => setA(e, { cx: f1(p[0]), cy: f1(p[1]), opacity: on ? 1 : 0 }));
    const keys = ['oes', 'stom', 'si', 'li', 'rec', 'anus'];
    c.orgEls.forEach(g => { const k = keys.findIndex(x => g.classList.contains(x)); const lit = T > 11.5 || k < 0 ? 1 : (s >= k + 1 ? 1 : .35); g.style.opacity = lit; });
    c.q('.f1').style.opacity = T > 11 ? 1 : 0; c.q('.f2').style.opacity = T > 12.4 ? 1 : 0; c.q('.f3').style.opacity = T > 14.2 ? 1 : 0;
    c.q('.trk').setAttribute('opacity', T > 11.5 ? f1((.7 + .3 * Math.sin(T * 1.5)) * 100) / 100 : 1);
  },
  notes: {
    say: 'One bite… one incredible journey. That is digestion.',
    ask: 'Close the screen and ask: “Take me on the journey of one bite of food through your body.” Let two or three students narrate it from start to finish.',
    explain: 'Listen for: chewing & saliva (mouth) → wave-like movement (food pipe) → churning, juice, acid, mucus (stomach) → bile, pancreatic & intestinal juices, absorption into blood (small intestine) → water absorbed (large intestine) → storage (rectum) → egestion (anus).',
    confusion: 'Correct any mix-ups between absorption (useful nutrients into blood) and egestion (undigested waste out of the body).',
    transition: 'End of lesson. Press R to replay the journey.'
  }
});

/* ===================== ACT 3 (cont.) · SMALL INTESTINE ===================== */

/* ---------- 15. Into the small intestine ---------- */
slide({
  act: 3, title: 'Into the small intestine',
  organ: c => c.n >= 1 ? 3 : 2,
  steps: ['Follow the food', 'Pull the camera out', 'How long is it?'],
  html: `
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt()}</svg>
  <div class="abs" style="left:120px;top:150px;width:700px">
    <div class="kicker">Part 5 · Leaving the stomach</div>
    <div class="h3 r" data-s="0-1" style="margin-top:14px">Follow the semi-liquid food…</div>
    <div class="r" data-s="2" style="margin-top:14px"><div class="h2">SMALL INTESTINE</div>
      <div class="sub" style="margin-top:18px">A long, coiled tube packed into your belly.</div></div>
    <div class="r" data-s="3" style="margin-top:60px"><div class="q" style="font-size:58px">How long do you think it is?</div></div>
  </div>`,
  init(c) { c.svg = c.q('svg.body'); c.trk = new Track(c.svg, BODY.TRACK); const fx = c.q('.fx'); c.gl = el('circle', { r: 16, fill: 'url(#gGold)', opacity: .6 }, fx); c.b = el('circle', { r: 7, fill: 'url(#gChyme)', stroke: 'rgba(255,240,200,.9)', 'stroke-width': 1.5 }, fx); },
  step(c, n) { dimOrgans(c, n >= 2 ? ['si'] : null); },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const s = n === 0 ? 2.5 + .03 * Math.sin(t) : n === 1 ? lerp(2.5, 3.42, ease(seg(st, .3, 7.5))) : 3.42;
    const p = c.trk.pt(s);
    [c.gl, c.b].forEach(e => setA(e, { cx: f1(p[0]), cy: f1(p[1]) }));
    c.b.setAttribute('r', f1(7 + Math.sin(t * 4)));
    const out = n >= 2 ? ease(seg(n === 2 ? st : 60, 0, 3)) : 0;
    const h0 = n === 0 ? 300 : 210;
    const cx = lerp(n === 0 ? 360 : p[0] - 30, 30, out), cy = lerp(n === 0 ? 470 : p[1], 500, out), h = Math.exp(lerp(Math.log(h0), Math.log(1100), out));
    cam(c.svg, cx, cy, h);
    c.gl.setAttribute('opacity', n >= 2 ? 0 : .6); c.b.setAttribute('opacity', n >= 2 ? 1 - out : 1);
    if (n >= 2) c.qa('.org.si path').forEach((pp, i) => { if (i % 3 === 1) pp.setAttribute('stroke', mix('#e79a8f', '#ffd36e', .5 + .5 * Math.sin(t * 2.5))); });
    else c.qa('.org.si path').forEach((pp, i) => { if (i % 3 === 1) pp.setAttribute('stroke', '#e79a8f'); });
  },
  notes: {
    say: 'Our food is now a semi-liquid mass. A little at a time, it leaves the stomach and enters the next part of the canal. Let us follow it… (click) …and now pull the camera back. This coiled tube filling your belly is the small intestine.',
    ask: 'Look at how it is folded. Guess – how long would it be if we stretched it out straight?',
    explain: 'Let students guess (10 cm? 1 m? 20 m?). Write two or three guesses on the board before revealing.',
    confusion: 'The small intestine is not a small organ – it is coiled up so a very long tube fits inside the body.',
    transition: '“Let us stretch it out and measure it.”'
  }
});

/* ---------- 16. Almost 6 metres ---------- */
slide({
  act: 3, organ: 3, title: 'Almost 6 metres long',
  steps: ['Stretch it out', 'Compare with your classroom', 'So why “small”?', 'Compare the large intestine'],
  html: () => {
    const PX = 140, FL = 1000;
    let ruler = `<path d="M170,${FL} L170,${FL - 6 * PX - 10}" stroke="rgba(255,255,255,.4)" stroke-width="3"/>`;
    for (let m = 0; m <= 6; m++) ruler += `<path d="M150,${FL - m * PX} L190,${FL - m * PX}" stroke="rgba(255,255,255,.55)" stroke-width="3"/><text x="135" y="${FL - m * PX + 11}" font-size="30" font-weight="600" fill="rgba(255,255,255,.75)" text-anchor="end">${m} m</text>`;
    return `
  <svg class="full" viewBox="0 0 1920 1080">
    <path d="M100,${FL} L1180,${FL}" stroke="rgba(255,255,255,.25)" stroke-width="3"/>
    ${ruler}
    <g transform="translate(300,${FL - 438 * .238}) scale(.238)"><circle cx="0" cy="-332" r="54" fill="url(#gSkin)" stroke="rgba(184,212,255,.7)" stroke-width="10"/><path d="${figurePath()}" fill="url(#gSkin)" stroke="rgba(184,212,255,.7)" stroke-width="10"/></g>
    <g class="room"><rect x="420" y="${FL - 3 * PX}" width="290" height="${3 * PX}" fill="rgba(255,214,170,.06)" stroke="rgba(255,214,170,.6)" stroke-width="4"/>
      <rect x="450" y="${FL - 205}" width="86" height="205" fill="rgba(255,214,170,.1)" stroke="rgba(255,214,170,.5)" stroke-width="3"/>
      <rect x="580" y="${FL - 330}" width="100" height="90" fill="rgba(143,211,255,.12)" stroke="rgba(255,214,170,.5)" stroke-width="3"/></g>
    <g class="room2" opacity="0"><rect x="420" y="${FL - 6 * PX}" width="290" height="${3 * PX}" fill="rgba(255,214,170,.03)" stroke="rgba(255,214,170,.55)" stroke-width="4" stroke-dasharray="14 10"/></g>
    <g class="si"><path class="siP" fill="none" stroke="#7a2f38" stroke-width="30" stroke-linecap="round"/><path class="siP2" fill="none" stroke="#e79a8f" stroke-width="25" stroke-linecap="round"/><path class="siP3" fill="none" stroke="#ffd6cc" stroke-width="6" stroke-linecap="round" stroke-opacity=".5"/></g>
    <g class="li" opacity="0"><rect x="1060" y="${FL - 1.5 * PX}" width="66" height="${1.5 * PX}" rx="30" fill="#c98a68" stroke="#5a3021" stroke-width="4"/>
      ${[1, 2, 3, 4].map(k => `<path d="M1062,${FL - k * 42} L1124,${FL - k * 42}" stroke="#5a3021" stroke-width="3" opacity=".5"/>`).join('')}</g>
    <g class="xs" opacity="0">
      <circle cx="1400" cy="600" r="34" fill="#e79a8f" stroke="#7a2f38" stroke-width="10"/><circle cx="1400" cy="600" r="16" fill="#3b0d16"/>
      <circle cx="1680" cy="600" r="84" fill="#c98a68" stroke="#5a3021" stroke-width="16"/><circle cx="1680" cy="600" r="50" fill="#2a120a"/>
    </g>
  </svg>
  <div class="lbl center" style="left:200px;top:1012px;width:200px;font-size:26px">You</div>
  <div class="lbl center" style="left:400px;top:1012px;width:330px;font-size:26px">Classroom ≈ 3 m</div>
  <div class="lbl center" style="left:780px;top:1012px;width:240px;font-size:26px;color:#ffc9bd">Small intestine</div>
  <div class="lbl center r" data-s="4" style="left:993px;top:1012px;width:200px;font-size:26px;color:#e7b08f">Large int.</div>
  <div class="lbl cnt" style="left:845px;top:110px;font-size:44px;color:#ffd36e">0.0 m</div>
  <div class="lbl r" data-s="4" style="left:1050px;top:715px;font-size:34px;color:#e7b08f">1.5 m</div>
  <div class="abs" style="left:1260px;top:150px;width:620px"><div class="kicker">Part 5 · The small intestine</div></div>
  <div class="abs r" data-s="1-2" style="left:1260px;top:220px;width:620px"><div class="h2">Almost <span class="c-nut">6 metres</span> long!</div>
      <div class="sub" style="margin-top:16px">The <b style="color:#fff">longest</b> part of the alimentary canal.</div></div>
  <div class="abs r" data-s="2-2" style="left:1260px;top:520px;width:620px"><div class="key2">≈ twice the height of your classroom</div></div>
  <div class="abs r" data-s="3" style="left:1260px;top:220px;width:620px"><div class="h3">So why is it called <span style="color:#ffc9bd">small</span>?</div>
      <div class="sub" style="margin-top:16px">Because it is <b style="color:#fff">narrower</b> — not because it is short.</div></div>
  <div class="abs r" data-s="4" style="left:1260px;top:880px;width:620px"><div class="sub">Large intestine: about <b style="color:#fff">1.5 m</b> — shorter, but <b style="color:#fff">wider</b>.</div></div>
  <div class="lbl center r" data-s="3" style="left:1300px;top:740px;width:200px;font-size:28px;color:#ffc9bd">small<small>narrower</small></div>
  <div class="lbl center r" data-s="3" style="left:1580px;top:740px;width:200px;font-size:28px;color:#e7b08f">large<small>wider</small></div>`;
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const g = n >= 1 ? ease(seg(n === 1 ? st : 60, .2, 4.2)) : 0;
    const top = 1000 - 840 * g, pts = [];
    for (let y = 1000; y >= top - .1; y -= 10) pts.push([900 + 7 * Math.sin(y * .05 + t * 1.5), y]);
    if (pts.length < 2) pts.push([900, 999]);
    const d = smoothPath(pts);
    ['.siP', '.siP2'].forEach(s => c.q(s).setAttribute('d', d));
    c.q('.siP3').setAttribute('d', d); c.q('.siP3').setAttribute('transform', 'translate(-5,0)');
    const cnt = c.q('.cnt'); cnt.textContent = (6 * g).toFixed(1) + ' m'; cnt.style.top = (top - 70) + 'px'; cnt.style.opacity = n >= 1 ? 1 : 0;
    c.q('.room2').setAttribute('opacity', n >= 2 ? f1(seg(n === 2 ? st : 60, 0, 1) * 100) / 100 : 0);
    c.q('.xs').setAttribute('opacity', n >= 3 ? 1 : 0);
    c.q('.li').setAttribute('opacity', n >= 4 ? 1 : 0);
  },
  notes: {
    say: 'Watch as we stretch it out… 1 metre, 2, 3… almost 6 metres! That is almost twice the height of your classroom. It is the longest part of the whole alimentary canal.',
    ask: 'If it is so long, why do you think it is called the SMALL intestine?',
    explain: 'It is called small because it is narrower than the large intestine – not because it is short. The large intestine is only about 1.5 metres long, but it is wider.',
    confusion: '“Small” and “large” describe how wide the tubes are, not how long they are.',
    transition: '“This long tube does not work alone. Three teammates send juices into it. Let us meet the team.”'
  }
});

/* ---------- 17. The digestion team ---------- */
slide({
  act: 3, organ: 3, title: 'The digestion team',
  steps: ['The liver', 'The pancreas', 'The small intestine wall', 'The whole team'],
  html: `
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt()}</svg>
  <div class="lbl tl1" style="color:#e79a80">Liver</div>
  <div class="lbl tl2" style="color:#f5d06b">Pancreas</div>
  <div class="lbl tl3" style="color:#ffc9bd">Small intestine</div>
  <div class="lbl tl4" style="color:rgba(255,255,255,.55)">Stomach</div>
  <div class="abs" style="left:1140px;top:130px;width:720px">
    <div class="kicker">Part 6 · The digestion team</div>
    <div class="h2" style="margin:12px 0 40px">Three juices join in</div>
    <div class="card r" data-s="1" style="position:relative;margin-bottom:24px;border-color:rgba(127,195,90,.5)"><div class="ct" style="color:#8fd46a">THE LIVER → BILE</div></div>
    <div class="card r" data-s="2" style="position:relative;margin-bottom:24px;border-color:rgba(245,208,107,.5)"><div class="ct c-panc">THE PANCREAS → PANCREATIC JUICE</div></div>
    <div class="card r" data-s="3" style="position:relative;margin-bottom:24px;border-color:rgba(255,201,189,.5)"><div class="ct" style="color:#ffc9bd">SMALL INTESTINE WALL → INTESTINAL JUICE</div></div>
    <div class="sub r" data-s="4">All of them pour into the <b style="color:#fff">small intestine</b>.</div>
  </div>`,
  init(c) {
    c.svg = c.q('svg.body'); cam(c.svg, 420, 500, 380);
    const P = (x, y) => projVB(c.svg, x, y);
    const put = (s, x, y, dx, dy) => { const p = P(x, y); const e = c.q(s); e.style.left = (p[0] + dx) + 'px'; e.style.top = (p[1] + dy) + 'px'; };
    put('.tl1', 215, 440, -60, -40); put('.tl2', 400, 505, 20, 10); put('.tl3', 228, 560, -330, 20); put('.tl4', 412, 455, 40, -20);
    const fx = c.q('.fx');
    const mk = (d, n, fill, r) => { const p = el('path', { d, fill: 'none', stroke: 'none' }, fx); const L = p.getTotalLength(); return { p, L, dots: Array.from({ length: n }, (_, i) => ({ o: i / n, e: dotEl(fx, r, fill, { opacity: 0 }) })) }; };
    c.bile = mk('M230,482 C240,484 250,486 258,486 ' + BODY.BILE.replace(/^M[\d.,]+/, ''), 9, 'url(#gGreen)', 4.5);
    c.panc = mk(BODY.PDUCT, 9, 'url(#gGold)', 4.5);
    c.si = mk(BODY.SI_TRK, 22, 'url(#gRed)', 3.6);
  },
  step(c, n) {
    const keep = [null, ['liver', 'gall'], ['panc'], ['si'], ['liver', 'gall', 'panc', 'si']][n];
    dimOrgans(c, keep);
    ['.tl1', '.tl2', '.tl3'].forEach((s, i) => { c.q(s).style.opacity = n === 0 || n === i + 1 || n === 4 ? 1 : .3; });
  },
  tick(c) {
    const n = c.n, t = c.t;
    const run = (f, on, sp) => f.dots.forEach(d => { if (!on) { d.e.setAttribute('opacity', 0); return; } const ph = (t * sp + d.o) % 1; const q = f.p.getPointAtLength(ph * f.L); setA(d.e, { cx: f1(q.x), cy: f1(q.y), opacity: f1(Math.sin(Math.PI * ph) * 100) / 100 }); });
    run(c.bile, n === 1 || n === 4, .35);
    run(c.panc, n === 2 || n === 4, .3);
    c.si.dots.forEach((d, i) => { const on = n === 3 || n === 4; if (!on) { d.e.setAttribute('opacity', 0); return; } const q = c.si.p.getPointAtLength((d.o * .3 + .02) * c.si.L); setA(d.e, { cx: f1(q.x + 6 * Math.sin(i)), cy: f1(q.y + 6 * Math.cos(i)), opacity: f1((.5 + .5 * Math.sin(t * 4 + i * 1.7)) * 100) / 100 }); });
  },
  notes: {
    say: 'The small intestine receives digestive juices from three sources. First, the liver – the biggest organ here – makes bile, which flows into the small intestine. Second, the pancreas makes pancreatic juice. And third, the inner wall of the small intestine itself makes its own digestive juice.',
    ask: 'Does food pass through the liver or the pancreas? (No – only their juices reach the food.)',
    explain: 'The liver and pancreas are associated with the alimentary canal, but they are not part of the food’s path. They send their juices through small tubes into the small intestine.',
    confusion: 'Students often think food travels through the liver. It does not; only bile travels from the liver to the small intestine.',
    transition: '“Let us see what each juice does – starting with bile.”'
  }
});

/* ---------- 18. Bile ---------- */
slide({
  act: 3, organ: 3, title: 'Bile: neutralise and break up fat',
  steps: ['Bile meets the acid', 'Now look at a fat drop', 'Bile breaks up the fat', 'Why does that help?'],
  html: `
  <div class="abs" style="left:120px;top:110px;width:1700px"><div class="kicker" style="color:#8fd46a">From the liver</div>
    <div class="h2" style="margin-top:10px">BILE <span class="sub" style="font-size:36px;vertical-align:middle;margin-left:16px">is mildly <b style="color:#fff">basic</b></span></div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <rect x="110" y="290" width="760" height="600" rx="36" fill="rgba(231,154,143,.06)" stroke="rgba(231,154,143,.3)" stroke-width="3"/>
    <rect x="990" y="290" width="820" height="600" rx="36" fill="rgba(231,154,143,.06)" stroke="rgba(231,154,143,.3)" stroke-width="3"/>
    <g class="neu"></g>
    <g class="gauge" opacity="0"><rect x="200" y="808" width="580" height="16" rx="8" fill="rgba(255,255,255,.1)"/><rect x="200" y="808" width="580" height="16" rx="8" fill="url(#gGauge)"/><circle class="gm" cx="220" cy="816" r="17" fill="#fff" stroke="#000" stroke-width="2"/></g>
    <defs><linearGradient id="gGauge"><stop offset="0" stop-color="#d4f25a"/><stop offset="1" stop-color="#9fb4c8"/></linearGradient></defs>
    <g class="fat"></g>
  </svg>
  <div class="lbl" style="left:150px;top:320px;font-size:34px">1 · Neutralises acid</div>
  <div class="lbl" style="left:1030px;top:320px;font-size:34px">2 · Breaks fat into tiny droplets</div>
  <div class="lbl r" data-s="1" style="left:200px;top:760px;font-size:24px;color:#d4f25a">acidic</div>
  <div class="lbl r" data-s="1" style="left:700px;top:760px;font-size:24px;color:#bcd0e0">neutral</div>
  <div class="lbl r" data-s="1-1" style="left:540px;top:390px;font-size:26px;color:#d4f25a">acid from stomach</div>
  <div class="lbl r" data-s="1-1" style="left:150px;top:390px;font-size:26px;color:#5fd38a">bile</div>
  <div class="lbl r" data-s="2-2" style="left:1230px;top:810px;font-size:30px;color:#ffd95e">One large fat drop</div>
  <div class="lbl r" data-s="3-3" style="left:1220px;top:810px;font-size:30px;color:#ffd95e">Many tiny droplets</div>
  <div class="lbl r" data-s="4" style="left:1060px;top:810px;font-size:30px;color:#ffb347">Juices reach all of them → easier to digest</div>
  <div class="banner r" data-s="4" style="top:930px">Bile does <span style="color:#ff8a7a">not</span> digest fat. It breaks fat into <span class="c-nut">tiny droplets</span>, making digestion easier.</div>`,
  init(c) {
    const R = rng(19), ng = c.q('.neu');
    c.acid = []; c.bl = [];
    for (let i = 0; i < 28; i++) c.acid.push({ x: 520 + R() * 320, y: 430 + R() * 300, ph: R() * 6, e: dotEl(ng, 9, 'url(#gGreen)', { opacity: 0 }), done: 0, d: .4 + R() * 3.4 });
    c.acid.forEach((a, i) => c.bl.push({ e: el('circle', { r: 12, fill: '#3fbf72', stroke: '#b9f5cf', 'stroke-width': 2, opacity: 0 }, ng), a, sx: 140 + R() * 60, sy: 420 + R() * 320 }));
    c.neu = c.acid.map(() => dotEl(ng, 10, '#9fb4c8', { opacity: 0 }));
    const fg = c.q('.fat');
    c.big = el('circle', { cx: 1400, cy: 570, r: 0, fill: 'url(#gFat)' }, fg);
    c.drops = [];
    for (let i = 0; i < 38; i++) { const a = i * 2.39996, d = 24 * Math.sqrt(i + .5) * 1.6; c.drops.push({ tx: 1400 + d * Math.cos(a), ty: 570 + d * Math.sin(a) * .82, r: 20 + R() * 9, e: el('circle', { r: 0, fill: 'url(#gFat)' }, fg), b: [0, 1, 2].map(() => dotEl(fg, 4, '#3fbf72', { opacity: 0 })), j: [0, 1].map(() => dotEl(fg, 5.5, 'url(#gGold)', { opacity: 0 })), ph: R() * 6 }); }
    c.bAround = Array.from({ length: 30 }, (_, i) => ({ a: i / 30 * 6.283, e: el('circle', { r: 9, fill: '#3fbf72', stroke: '#b9f5cf', 'stroke-width': 2, opacity: 0 }, fg) }));
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const S = k => n > k ? 60 : n === k ? st : -1;
    // panel 1 – neutralisation
    const p1 = S(1); let doneN = 0;
    c.acid.forEach((a, i) => {
      const b = c.bl[i], nu = c.neu[i];
      if (p1 < 0) { [a.e, b.e, nu].forEach(e => e.setAttribute('opacity', 0)); a.e.setAttribute('opacity', n >= 0 ? .9 : 0); setA(a.e, { cx: f1(a.x + 12 * Math.sin(t + a.ph)), cy: f1(a.y + 12 * Math.cos(t * 1.3 + a.ph)) }); return; }
      const k = ease(seg(p1, a.d, a.d + 1.3)), m = seg(p1, a.d + 1.2, a.d + 1.6);
      const ax = a.x + 12 * Math.sin(t + a.ph), ay = a.y + 12 * Math.cos(t * 1.3 + a.ph);
      setA(b.e, { cx: f1(lerp(b.sx, ax - 10, k)), cy: f1(lerp(b.sy, ay, k)), opacity: m >= 1 ? 0 : 1 });
      setA(a.e, { cx: f1(ax), cy: f1(ay), opacity: m >= 1 ? 0 : .95 });
      setA(nu, { cx: f1(ax - 5), cy: f1(ay), opacity: m >= 1 ? .85 : 0 });
      if (m >= 1) doneN++;
    });
    c.q('.gauge').setAttribute('opacity', n >= 1 ? 1 : 0);
    c.q('.gm').setAttribute('cx', f1(220 + 540 * (doneN / c.acid.length)));
    // panel 2 – fat
    const p2 = S(2), p3 = S(3), p4 = S(4);
    const grow = p2 >= 0 ? eout(p2 / 1) : 0, split = p3 >= 0 ? ease(seg(p3, 1.2, 3.4)) : 0;
    c.big.setAttribute('r', f1(165 * grow * (1 - split)));
    c.bAround.forEach((b, i) => {
      if (p3 < 0) { b.e.setAttribute('opacity', 0); return; }
      const come = eout(seg(p3, 0, 1.2)), rr = lerp(330, 175, come) * (1 - split) + split * 300;
      setA(b.e, { cx: f1(1400 + rr * Math.cos(b.a + t * .3)), cy: f1(570 + rr * .75 * Math.sin(b.a + t * .3)), opacity: f1(lerp(1, 0, split) * 100) / 100 });
    });
    c.drops.forEach((d, i) => {
      const x = lerp(1400, d.tx, split) + 4 * Math.sin(t * 1.5 + d.ph), y = lerp(570, d.ty, split) + 4 * Math.cos(t * 1.2 + d.ph);
      setA(d.e, { cx: f1(x), cy: f1(y), r: f1(d.r * split) });
      d.b.forEach((b, k) => { const a = k * 2.1 + t * .8 + d.ph; setA(b, { cx: f1(x + (d.r + 3) * Math.cos(a)), cy: f1(y + (d.r + 3) * Math.sin(a)), opacity: split > .9 ? .9 : 0 }); });
      d.j.forEach((j, k) => { const a = k * 3.1 - t * 1.1 + d.ph, come = p4 >= 0 ? eout(seg(p4, i * .03, i * .03 + 1)) : 0; setA(j, { cx: f1(x + (d.r + 6 + 40 * (1 - come)) * Math.cos(a)), cy: f1(y + (d.r + 6 + 40 * (1 - come)) * Math.sin(a)), opacity: f1(come * 100) / 100 }); });
    });
  },
  notes: {
    say: 'The liver makes bile. Bile is mildly basic – remember neutralisation from the chapter on acids and bases? The food coming from the stomach is acidic. Watch the bile meet the acid and neutralise it. Now look at a big drop of fat, like the ghee on your chapati. Bile surrounds it and breaks it into many tiny droplets.',
    ask: 'When you wash an oily plate with soap, what happens to the oil? How is bile similar?',
    explain: 'Bile neutralises the acid in food coming from the stomach, and breaks fats into tiny droplets. Many tiny droplets have far more surface than one big drop, so the digestive juices can work on the fat much more easily. That makes fat digestion easier.',
    confusion: 'IMPORTANT: Bile does NOT digest fat itself. It only breaks big fat drops into tiny droplets. The actual digestion of fat is done by digestive juices from the pancreas and the intestine.',
    transition: '“So who actually digests the fat? Meet the pancreas.”'
  }
});

/* ---------- 19. Pancreatic juice + intestinal juice ---------- */
slide({
  act: 3, organ: 3, title: 'Pancreatic and intestinal juices',
  steps: ['Pancreatic juice arrives', 'It breaks down food', 'Juice from the intestine wall', 'Digestion complete!'],
  html: `
  <div class="abs" style="left:520px;top:110px;width:520px"><div class="kicker c-panc" style="color:var(--panc);">The final juices</div>
    <div class="h3" style="margin-top:12px">Finishing the job</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <g transform="translate(130,140) scale(1.5)"><path d="M10,60 C10,30 50,20 100,30 C160,40 220,20 270,10 C300,5 310,35 285,48 C230,80 160,96 100,96 C50,98 10,90 10,60 Z" fill="url(#gPanc)" stroke="#a8703f" stroke-width="2"/></g>
    <path class="pd" d="M330,250 C380,270 440,300 470,350" fill="none" stroke="#e6b45c" stroke-width="10" stroke-linecap="round"/>
    <rect x="380" y="350" width="1440" height="560" rx="60" fill="rgba(231,154,143,.07)" stroke="#e79a8f" stroke-width="5"/>
    <path class="wall" fill="#e79a8f" opacity=".75"/>
    <g class="mol"></g><g class="juice"></g>
  </svg>
  <div class="lbl" style="left:110px;top:316px;color:#f5d06b">Pancreas</div>
  <div class="lbl" style="left:60px;top:440px;font-size:30px">Carbohydrates</div>
  <div class="lbl" style="left:60px;top:610px;font-size:30px">Proteins</div>
  <div class="lbl" style="left:60px;top:780px;font-size:30px">Fats</div>
  <div class="lbl" style="left:520px;top:930px;font-size:26px;color:#ffc9bd">wall of the small intestine</div>
  <div class="abs r" data-s="1" style="left:1080px;top:110px;width:780px"><div class="sub" style="font-size:30px"><b class="c-panc">Pancreatic juice</b> is also basic — it helps neutralise acid…</div></div>
  <div class="abs r" data-s="2" style="left:1080px;top:220px;width:780px"><div class="sub" style="font-size:30px">…and breaks down <b style="color:#fff">carbohydrates, proteins and fats</b>.</div></div>
  <div class="banner r" data-s="3-3" style="top:960px;font-size:32px"><span style="color:#ffc9bd">Intestinal juice</span> breaks them down further into <span class="c-nut">simpler forms</span></div>
  <div class="banner r" data-s="4" style="top:960px;font-size:32px">Food is now in its <span class="c-nut">simplest forms</span> — ready to be absorbed</div>`,
  init(c) {
    const g = c.q('.mol'); c.ch = [];
    [600, 900, 1200, 1500].forEach((x, i) => c.ch.push(new Chain(g, { x, y: 460, n: 4, r: 15, gap: 34, ang: (i % 2 ? .3 : -.3), shape: 'hex', colors: ['#f3e6c4'], simple: '#ffd36e', levels: [2, 1, 2], seed: 50 + i, spread: 30, spreadT: 1.8, wave: 6 })));
    [620, 960, 1300, 1620].forEach((x, i) => c.ch.push(new Chain(g, { x, y: 630, n: 6, r: 13, gap: 30, ang: (i % 2 ? -.25 : .25), shape: 'circle', colors: ['#ff8fa3', '#c99bff', '#7fd1ff', '#ffb36b', '#9be38f'], simple: '#ffd36e', levels: [2, 1, 2, 2, 1], seed: 60 + i, spread: 32, spreadT: 1.8, wave: 8 })));
    const R = rng(33); c.fat = [];
    for (let i = 0; i < 14; i++) { const x = 560 + i * 88 + R() * 30, y = 800 + (R() - .5) * 40; c.fat.push({ x, y, ph: R() * 6, e: [0, 1, 2, 3].map(() => el('circle', { r: 0, fill: 'url(#gFat)' }, g)), gl: [0, 1, 2, 3].map(() => el('circle', { r: 14, fill: 'url(#gGold)', opacity: 0 }, g)) }); }
    const wp = []; for (let x = 420; x <= 1780; x += 20) wp.push([x, 905 - 10 * Math.abs(Math.sin(x * .05))]);
    c.q('.wall').setAttribute('d', smoothPath(wp) + 'L1780,910 L420,910 Z');
    c.pj = []; const jg = c.q('.juice');
    for (let i = 0; i < 40; i++) c.pj.push({ e: dotEl(jg, 6, 'url(#gGold)', { opacity: 0 }), o: R(), tx: 480 + R() * 1300, ty: 400 + R() * 480 });
    c.ij = []; for (let i = 0; i < 40; i++) c.ij.push({ e: dotEl(jg, 5, 'url(#gRed)', { opacity: 0 }), o: R(), x: 440 + R() * 1340 });
    c.ac = []; for (let i = 0; i < 18; i++) c.ac.push({ e: dotEl(jg, 7, 'url(#gGreen)', { opacity: .8 }), x: 480 + R() * 1300, y: 400 + R() * 460, ph: R() * 6 });
  },
  tick(c, dt) {
    const n = c.n, st = c.stepT, t = c.t;
    const S = k => n > k ? 60 : n === k ? st : -1;
    const T = {}; if (n >= 2) T[1] = S(2); if (n >= 3) T[2] = S(3);
    c.ch.forEach(ch => ch.update(dt, T, t));
    c.fat.forEach(f => {
      const L1 = n >= 2 ? eout(seg(S(2), .5, 2)) : 0, L2 = n >= 3 ? eout(seg(S(3), .5, 2)) : 0;
      f.e.forEach((e, k) => {
        const half = k < 2 ? 0 : 1, sub = k % 2;
        const ox = (sub ? 1 : -1) * 14 * L1 + (half ? 1 : -1) * 10 * L2, oy = (half ? 1 : -1) * 14 * L2;
        const r = L2 > 0 ? lerp(11, 6, L2) : L1 > 0 ? lerp(18, 11, L1) : 18;
        const vis = k === 0 || (k === 1 && L1 > 0) || (k >= 2 && L2 > 0);
        const x = f.x + ox + 3 * Math.sin(t + f.ph), y = f.y + oy + 3 * Math.cos(t + f.ph);
        setA(e, { cx: f1(x), cy: f1(y), r: vis ? f1(r) : 0 });
        setA(f.gl[k], { cx: f1(x), cy: f1(y), opacity: vis && n >= 4 ? .8 : 0 });
      });
    });
    const pd = c.q('.pd'); c.pdL = c.pdL || pd.getTotalLength();
    c.pj.forEach(p => {
      if (n < 1) { p.e.setAttribute('opacity', 0); return; }
      const ph = (S(1) * .25 + p.o) % 1;
      let x, y; if (ph < .3) { const q = pd.getPointAtLength(ph / .3 * c.pdL); x = q.x; y = q.y; } else { const k = eout((ph - .3) / .7); x = lerp(470, p.tx, k); y = lerp(350, p.ty, k); }
      setA(p.e, { cx: f1(x), cy: f1(y), opacity: f1(Math.min(1, (1 - ph) * 3) * 100) / 100 });
    });
    c.ij.forEach(p => {
      if (n < 3) { p.e.setAttribute('opacity', 0); return; }
      const ph = (S(3) * .3 + p.o) % 1;
      setA(p.e, { cx: f1(p.x + 10 * Math.sin(ph * 6)), cy: f1(900 - 420 * eout(ph)), opacity: f1(Math.sin(Math.PI * ph) * 100) / 100 });
    });
    const neut = n >= 1 ? seg(S(1), .5, 2.5) : 0;
    c.ac.forEach(a => setA(a.e, { cx: f1(a.x + 14 * Math.sin(t + a.ph)), cy: f1(a.y + 14 * Math.cos(t * 1.2 + a.ph)), opacity: f1((1 - neut) * .8 * 100) / 100 }));
  },
  notes: {
    say: 'The pancreas sends pancreatic juice into the small intestine. Like bile, it is basic, so it also helps neutralise the acid. But it does much more: it breaks down carbohydrates, proteins and fats. Watch the long chains break into smaller pieces. Then the wall of the small intestine adds its own juice, which breaks fats, proteins and partially digested carbohydrates into their simplest forms.',
    ask: 'Which juice actually breaks down fats – bile or pancreatic juice? (Pancreatic juice and intestinal juice; bile only breaks fat into droplets.)',
    explain: 'By the end of the small intestine’s work, carbohydrates, proteins and fats have all been broken into simpler forms that the body can absorb.',
    confusion: 'Digestion of carbohydrates started in the mouth (saliva) and of proteins in the stomach – here in the small intestine, digestion of all three is completed.',
    transition: '“The food has been digested. But it is still inside the tube. How does your body actually USE it?”'
  }
});

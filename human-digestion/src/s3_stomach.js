/* ===================== ACT 3 · THE TRANSFORMATION (stomach) ===================== */
const ST = { k: 4.3, ox: 600, oy: 590, cx: 356, cy: 473 };
const stMap = (x, y) => [ST.ox + (x - ST.cx) * ST.k, ST.oy + (y - ST.cy) * ST.k];

/* ---------- 12. Stomach ---------- */
slide({
  act: 3, organ: 2, title: 'The stomach: churning and juices',
  steps: ['Food arrives', 'The walls churn', 'Digestive juice', 'Acid', 'Mucus', 'The food becomes…'],
  html: `
  <svg class="full" viewBox="0 0 1920 1080">
    <defs><clipPath id="cStom"><path class="clipP"/></clipPath>
      <radialGradient id="gLumen" cx="55%" cy="40%" r="70%"><stop offset="0" stop-color="#8e3442"/><stop offset="1" stop-color="#4c121c"/></radialGradient></defs>
    <path class="oesIn" fill="none" stroke="#d8737d" stroke-width="58" stroke-linecap="round"/>
    <path class="duoOut" fill="none" stroke="#e79a8f" stroke-width="54" stroke-linecap="round"/>
    <path class="edge" fill="none" stroke="#5e1b28" stroke-width="44" stroke-linejoin="round"/>
    <path class="musc" fill="none" stroke="#d26a74" stroke-width="38" stroke-linejoin="round"/>
    <path class="musc2" fill="none" stroke="rgba(255,190,190,.35)" stroke-width="4" stroke-dasharray="2 10" stroke-linejoin="round"/>
    <path class="inner" fill="url(#gLumen)"/>
    <g clip-path="url(#cStom)">
      ${txImg('rugae')}<g class="rugae" opacity=".35"></g>
      <path class="mucus" fill="none" stroke="#86b9ff" stroke-opacity=".55" stroke-width="0" stroke-linejoin="round"/>
      <path class="chyme" fill="url(#gChyme)" opacity="0"/>
      <g class="parts"></g><g class="bact"></g><g class="sec"></g>
    </g>
  </svg>
  <div class="lbl" style="left:330px;top:96px;color:#ffb3b8">From the food pipe ↓</div>
  <div class="lbl" style="left:40px;top:930px;color:#ffc9bd">To the small<br>intestine ←</div>
  <div class="abs" style="left:1120px;top:120px;width:740px">
    <div class="kicker">Part 4 · The stomach</div>
    <div class="h2" style="margin:12px 0 30px">A churning bag</div>
    <div class="r" data-s="2" style="margin-bottom:22px"><div class="key2" style="font-size:36px">Walls contract and relax</div><div class="small">to <b style="color:#fff">churn</b> (mix and mash) the food</div></div>
    <div class="r" data-s="3" style="margin-bottom:20px"><div class="key2" style="font-size:34px"><span class="dot" style="color:#ffb347;background:#ffb347"></span>Digestive juice</div><div class="small" style="padding-left:40px">breaks down <b style="color:#fff">proteins</b></div></div>
    <div class="r" data-s="4" style="margin-bottom:20px"><div class="key2" style="font-size:34px"><span class="dot" style="color:#d4f25a;background:#d4f25a"></span>Acid</div><div class="small" style="padding-left:40px">helps digestion · <b style="color:#fff">kills many harmful bacteria</b></div></div>
    <div class="r" data-s="5" style="margin-bottom:20px"><div class="key2" style="font-size:34px"><span class="dot" style="color:#86b9ff;background:#86b9ff"></span>Mucus</div><div class="small" style="padding-left:40px"><b style="color:#fff">protects</b> the stomach lining from acid</div></div>
    <div class="r" data-s="6" style="margin-top:28px;padding:22px 28px;border-radius:18px;background:rgba(242,220,174,.08);border:1.5px solid rgba(242,220,174,.4)">
      <div class="key2" style="font-size:36px;color:#f2dcae">a semi-liquid mass</div><div class="small">partially digested, ready for the next stage</div></div>
  </div>`,
  init(c) {
    const base = samplePath(BODY.STOM_J, 150).map(p => stMap(...p));
    c.base = base;
    // orientation for normals
    let A = 0; for (let i = 0; i < base.length; i++) { const a = base[i], b = base[(i + 1) % base.length]; A += a[0] * b[1] - b[0] * a[1]; }
    c.sgn = A > 0 ? 1 : -1;
    c.nrm = base.map((p, i) => { const a = base[(i - 1 + base.length) % base.length], b = base[(i + 1) % base.length]; const tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1; return [c.sgn * ty / L, -c.sgn * tx / L]; });
    const ca = stMap(335, 420), py = stMap(272, 538);
    c.q('.oesIn').setAttribute('d', `M${ca[0] - 70},60 C${ca[0] - 60},180 ${ca[0] - 20},280 ${ca[0] + 4},${ca[1] + 20}`);
    c.q('.duoOut').setAttribute('d', `M${py[0] + 20},${py[1] - 4} C${py[0] - 40},${py[1] + 10} ${py[0] - 90},${py[1] + 40} ${py[0] - 140},${py[1] + 120}`);
    const rg = c.q('.rugae'); const R = rng(14);
    for (let i = 0; i < 9; i++) { const y = 260 + i * 80; const pts = []; for (let x = 180; x <= 1000; x += 40) pts.push([x, y + 26 * Math.sin(x * .02 + i) + R() * 8]); el('path', { d: smoothPath(pts), fill: 'none', stroke: 'rgba(255,160,170,.22)', 'stroke-width': 7, 'stroke-linecap': 'round' }, rg); }
    // inside test polygon (inset)
    c.inside = (x, y) => inPoly(x, y, base) && inPoly(x + 34, y, base) && inPoly(x - 34, y, base) && inPoly(x, y + 34, base) && inPoly(x, y - 34, base);
    const cols = ['#e2b36b', '#d9a35a', '#f1dfb8', '#8fbf5a', '#e07a4a', '#f4f1e6'];
    c.parts = []; const pg = c.q('.parts');
    for (let i = 0; i < 46; i++) {
      let x, y; do { x = 300 + R() * 640; y = 300 + R() * 640; } while (!c.inside(x, y));
      const pts = []; for (let v = 0; v < 7; v++) { const a = v / 7 * 6.283, rr = .7 + R() * .4; pts.push([rr * Math.cos(a), rr * Math.sin(a)]); }
      c.parts.push({ x, y, hx: x, hy: y, vx: 0, vy: 0, r: 10 + R() * 14, rot: R() * 360, d: R() * 1.2, e: el('path', { d: closedPath(pts), fill: cols[i % cols.length], stroke: 'rgba(60,20,10,.35)', 'stroke-width': .1 }, pg) });
    }
    c.bact = []; const bg = c.q('.bact');
    for (let i = 0; i < 12; i++) { let x, y; do { x = 300 + R() * 640; y = 300 + R() * 640; } while (!c.inside(x, y)); const g = el('g', {}, bg); el('rect', { x: -15, y: -6, width: 30, height: 12, rx: 6, fill: '#b48cff', stroke: '#6a4bb8', 'stroke-width': 2 }, g); el('circle', { r: 20, fill: 'none', stroke: '#d4f25a', 'stroke-width': 3, opacity: 0, class: 'pop' }, g); c.bact.push({ x, y, g, d: .6 + R() * 2.8, ph: R() * 6 }); }
    c.sec = []; const sg = c.q('.sec');
    for (let i = 0; i < 70; i++) { const k = i % 2; c.sec.push({ k, e: dotEl(sg, k ? 6 : 8, k ? 'url(#gGreen)' : 'url(#gGold)', { opacity: 0 }), i: Math.floor(R() * base.length), off: R() * 3, life: 2.4 + R() * 1.5, ang: R() * 6.28 }); }
  },
  tick(c, dt) {
    const n = c.n, st = c.stepT, t = c.t;
    const S = k => n > k ? 60 : n === k ? st : -1;
    const churn = n >= 2 ? Math.min(1, (S(2) >= 0 ? S(2) : 0) / 1.2) : 0;
    const N = c.base.length;
    const pts = c.base.map((p, i) => { const s = i / N; const d = churn * 11 * Math.sin(2 * Math.PI * (3 * s - .55 * t)); return [p[0] + c.nrm[i][0] * d, p[1] + c.nrm[i][1] * d]; });
    const d = closedPath(pts);
    ['.edge', '.musc', '.musc2', '.inner', '.clipP', '.mucus', '.chyme'].forEach(s => c.q(s).setAttribute('d', d));
    const mu = S(5) >= 0 ? ease(S(5) / 2) : 0;
    c.q('.mucus').setAttribute('stroke-width', f1(48 * mu));
    // contents
    const fall = S(1) >= 0 ? S(1) : -1;
    const liq = S(6) >= 0 ? ease(S(6) / 3) : 0;
    c.q('.chyme').setAttribute('opacity', f1(liq * .92 * 100) / 100);
    const cxS = 600, cyS = 600;
    c.parts.forEach(p => {
      if (fall < 0) { p.e.setAttribute('opacity', 0); return; }
      const ft = fall - p.d;
      if (ft < 0) { p.e.setAttribute('opacity', 0); return; }
      if (ft < 1.4 && n === 1) { const k = eout(ft / 1.4); const ca = stMap(335, 420); p.x = lerp(ca[0], p.hx, k); p.y = lerp(ca[1] - 60, p.hy, k); }
      else if (churn > 0) {
        const dx = p.x - cxS, dy = p.y - cyS;
        p.vx += (-dy * .9 - dx * .15) * dt * churn * .9 + (Math.sin(t * 2 + p.hy) * 30) * dt;
        p.vy += (dx * .9 - dy * .15) * dt * churn * .9 + (Math.cos(t * 1.7 + p.hx) * 30) * dt;
        p.vx *= .96; p.vy *= .96;
        const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
        if (c.inside(nx, ny)) { p.x = nx; p.y = ny; } else { p.vx *= -.5; p.vy *= -.5; p.x += (cxS - p.x) * .02; p.y += (cyS - p.y) * .02; }
      }
      p.rot += churn * dt * 30;
      const sc = p.r * (1 - .72 * liq);
      p.e.setAttribute('transform', `translate(${f1(p.x)},${f1(p.y)}) rotate(${f1(p.rot)}) scale(${f1(sc * 10) / 10})`);
      p.e.setAttribute('opacity', f1((1 - .55 * liq) * 100) / 100);
    });
    // bacteria killed by acid
    const ac = S(4);
    c.bact.forEach(b => {
      if (fall < 0) { b.g.setAttribute('opacity', 0); return; }
      const kill = ac >= 0 ? seg(ac - b.d, 0, .5) : 0;
      b.g.setAttribute('opacity', f1((1 - kill) * 100) / 100);
      const pop = b.g.querySelector('.pop'); pop.setAttribute('opacity', kill > 0 && kill < 1 ? f1((1 - kill) * 100) / 100 : 0); pop.setAttribute('r', f1(14 + 30 * kill));
      b.g.setAttribute('transform', `translate(${f1(b.x + 20 * Math.sin(t * .8 + b.ph))},${f1(b.y + 14 * Math.cos(t + b.ph))}) rotate(${f1(t * 20 + b.ph * 50)})`);
    });
    // secretions from the lining
    const jOn = S(3), aOn = S(4);
    c.sec.forEach(s => {
      const on = s.k === 0 ? jOn : aOn;
      if (on < 0) { s.e.setAttribute('opacity', 0); return; }
      const ph = ((on + s.off) % s.life) / s.life;
      const b = pts[s.i], nn = c.nrm[s.i];
      const dd = -lerp(0, 110, eout(ph));
      const x = b[0] + nn[0] * (dd - 6) + 18 * Math.sin(ph * 6 + s.ang), y = b[1] + nn[1] * (dd - 6) + 18 * Math.cos(ph * 5 + s.ang);
      setA(s.e, { cx: f1(x), cy: f1(y), opacity: f1(Math.sin(Math.PI * ph) * (1 - .6 * liq) * 100) / 100 });
      if (ph > .97) s.i = Math.floor(Math.random() * N);
    });
  },
  notes: {
    say: 'The wave in the food pipe delivers our food into the stomach – a stretchy, muscular bag. Watch its walls: they contract and relax, again and again, churning the food – mixing and mashing it. Then the inner lining of the stomach pours out a secretion. It has three parts: a digestive juice, an acid and mucus.',
    ask: 'Your stomach can make an acid strong enough to help digest meat. So why doesn’t your stomach digest itself?',
    explain: 'The digestive juice breaks down proteins into simpler components. The acid also helps break down proteins and kills many harmful bacteria that come with our food. The mucus forms a protective coat on the stomach lining so the acid does not damage it. After churning and mixing, the food becomes a partially digested, semi-liquid mass, ready for the next stage.',
    confusion: 'The stomach does not digest all the food – digestion here is only partial. Also, the stomach is not where most nutrients are absorbed; that happens later, in the small intestine.',
    transition: '“Let us zoom right up to the stomach wall to see how mucus protects it.”'
  }
});

/* ---------- 13. Acid vs mucus ---------- */
slide({
  act: 3, organ: 2, title: 'Acid and the mucus shield',
  steps: ['Show the acid', 'Show the mucus shield', 'What if there were no mucus?', 'Put the shield back'],
  html: `
  <div class="abs" style="left:120px;top:110px;width:1680px"><div class="kicker">Close-up of the stomach wall</div>
    <div class="q" style="margin-top:12px;font-size:54px">If acid helps digest food… why doesn’t it damage the stomach itself?</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <g class="cells"></g><path class="dmg" fill="rgba(255,40,40,0)"/>
    <path class="mucusL" fill="rgba(134,185,255,.45)" stroke="rgba(190,220,255,.8)" stroke-width="3"/>
    <g class="acid"></g><g class="bact2"></g>
  </svg>
  <div class="lbl" style="left:120px;top:960px;color:#ffb3b8">Stomach lining</div>
  <div class="card r" data-s="1" style="left:120px;top:470px;width:620px;border-color:rgba(212,242,90,.45)"><div class="ct c-acid">ACID</div><div class="cd">a powerful digestive environment — also kills many harmful bacteria</div></div>
  <div class="card r" data-s="2" style="left:1180px;top:470px;width:620px;border-color:rgba(134,185,255,.5)"><div class="ct c-muc">MUCUS</div><div class="cd">a protective shield over the stomach lining</div></div>
  <div class="banner r" data-s="3-3" style="top:350px;border-color:rgba(255,90,90,.6)">Without mucus, acid would <span style="color:#ff8a8a">damage</span> the lining</div>
  <div class="banner r" data-s="4" style="top:350px;border-color:rgba(134,185,255,.6)">Mucus keeps the stomach safe from its own acid</div>`,
  init(c) {
    const cg = c.q('.cells'); const R = rng(3);
    c.cellEls = [];
    for (let x = -20; x < 1960; x += 64) {
      const h = 170 + R() * 16;
      const g = el('g', {}, cg);
      el('rect', { x: x + 3, y: 800, width: 58, height: h, rx: 18, fill: '#e07b86', stroke: '#9c3a4a', 'stroke-width': 3 }, g);
      el('ellipse', { cx: x + 32, cy: 880 + R() * 30, rx: 13, ry: 17, fill: '#9c3a5c', opacity: .8 }, g);
      c.cellEls.push({ x, g, r: g.firstChild });
    }
    c.mu = []; for (let x = 0; x <= 1920; x += 40) c.mu.push(x);
    c.ac = []; const ag = c.q('.acid');
    for (let i = 0; i < 70; i++) c.ac.push({ x: R() * 1920, y: 540 + R() * 220, vx: (R() - .5) * 160, vy: 60 + R() * 120, e: dotEl(ag, 9, 'url(#gGreen)', { opacity: 0 }) });
    c.bb = []; const bg = c.q('.bact2');
    for (let i = 0; i < 8; i++) { const g = el('g', {}, bg); el('rect', { x: -22, y: -9, width: 44, height: 18, rx: 9, fill: '#b48cff', stroke: '#6a4bb8', 'stroke-width': 2 }, g); c.bb.push({ g, x: 820 + R() * 300, y: 560 + R() * 150, d: .5 + R() * 2.5, ph: R() * 6 }); }
  },
  tick(c, dt) {
    const n = c.n, st = c.stepT, t = c.t;
    const S = k => n > k ? 60 : n === k ? st : -1;
    // mucus thickness profile (gap in the middle at step 3)
    const muOn = n >= 2 ? ease(seg(S(2), 0, 1.5)) : 0;
    const gap = n === 3 ? ease(seg(st, 0, 1.2)) : n >= 4 ? 1 - ease(seg(S(4), 0, 1.5)) : 0;
    const th = x => { const g = Math.exp(-(((x - 960) / 260) ** 2)) * gap; return 70 * muOn * (1 - g); };
    const top = c.mu.map(x => [x, 798 - th(x) + 5 * Math.sin(x * .02 + t * 1.5) * muOn]);
    c.q('.mucusL').setAttribute('d', smoothPath(top) + `L1920,800 L0,800 Z`);
    c.q('.mucusL').setAttribute('opacity', muOn > .02 ? 1 : 0);
    // damage where unprotected
    c.dmgK = c.dmgK || 0;
    const exposed = n === 3 ? 1 : 0;
    c.dmgK = clamp(c.dmgK + (exposed ? dt * .5 : -dt * .8));
    c.cellEls.forEach(ce => { const e = Math.exp(-(((ce.x + 32 - 960) / 230) ** 2)); ce.r.setAttribute('fill', mix('#e07b86', '#7a1020', c.dmgK * e)); });
    // acid
    c.ac.forEach(a => {
      if (n < 1) { a.e.setAttribute('opacity', 0); return; }
      a.x += a.vx * dt; a.y += a.vy * dt;
      if (a.x < 0) a.x += 1920; if (a.x > 1920) a.x -= 1920;
      const floor = 798 - th(a.x) - 8;
      if (a.y > floor) { a.y = floor; a.vy = -Math.abs(a.vy) * (.9 + Math.random() * .2); }
      if (a.y < 530) { a.vy = Math.abs(a.vy); }
      setA(a.e, { cx: f1(a.x), cy: f1(a.y), opacity: .95 });
    });
    c.bb.forEach(b => {
      const kill = n >= 1 ? seg(S(1) - b.d, 0, .6) : 0;
      b.g.setAttribute('opacity', f1((1 - kill) * 100) / 100);
      b.g.setAttribute('transform', `translate(${f1(b.x + 30 * Math.sin(t * .7 + b.ph))},${f1(b.y)}) rotate(${f1(t * 25 + b.ph * 40)}) scale(${f1((1 - .5 * kill) * 100) / 100})`);
    });
  },
  notes: {
    say: 'Here is a close-up of the stomach wall. These green sparks represent the acid – it makes the stomach a powerful place for digestion, and it kills many harmful bacteria that enter with food. Now look at this blue layer – mucus. Watch the acid bounce off it. What if the mucus were missing? (Click.) The lining gets damaged. (Click.) With mucus back, the stomach is safe.',
    ask: 'Why is it useful that the stomach has acid? And why does it also need mucus?',
    explain: 'The acid helps break down proteins and kills many harmful bacteria. The mucus protects the stomach lining from the acid, preventing damage.',
    confusion: 'Mucus does not destroy the acid – it simply forms a shield between the acid and the lining.',
    transition: '“How do we even know what happens inside a living stomach? The answer is an amazing story from history.”'
  }
});

/* ---------- 14. Beaumont ---------- */
slide({
  act: 3, organ: 2, title: 'Science discovery: Beaumont',
  steps: ['The accident', 'The doctor', 'A window into the stomach', 'The experiments'],
  html: `
  <div class="abs" style="left:120px;top:110px"><div class="kicker" style="color:var(--warm)">Science discovery moment</div>
    <div class="h3" style="margin-top:12px">How did scientists learn what happens inside the stomach?</div></div>
  <div class="abs" style="left:120px;top:300px;font:600 230px/1 var(--serif);color:rgba(255,184,107,.9);letter-spacing:-.02em">1822</div>
  <svg class="abs" style="left:150px;top:570px;width:640px;height:460px" viewBox="0 0 640 460">
    <path d="M60,460 C60,330 120,250 220,226 L420,226 C520,250 580,330 580,460 Z" fill="rgba(255,214,170,.07)" stroke="rgba(255,214,170,.45)" stroke-width="3"/>
    <circle cx="320" cy="140" r="78" fill="rgba(255,214,170,.07)" stroke="rgba(255,214,170,.45)" stroke-width="3"/>
    <g class="win" opacity="0"><circle cx="380" cy="350" r="46" fill="url(#gStom)" opacity=".9"/><circle cx="380" cy="350" r="70" fill="url(#gGold)" opacity=".35"/><circle cx="380" cy="350" r="46" fill="none" stroke="#ffd36e" stroke-width="3"/></g>
  </svg>
  <div class="abs" style="left:900px;top:300px;width:920px">
    <div class="r" data-s="1" style="margin-bottom:34px"><div class="key2" style="font-size:38px">Alexis St. Martin</div><div class="sub" style="font-size:32px">is accidentally shot in the stomach.</div></div>
    <div class="r" data-s="2" style="margin-bottom:34px"><div class="key2" style="font-size:38px">Dr. William Beaumont</div><div class="sub" style="font-size:32px">treats him — but the wound never fully heals.</div></div>
    <div class="r" data-s="3" style="margin-bottom:34px"><div class="key2 c-warm" style="font-size:38px">A small permanent opening</div><div class="sub" style="font-size:32px">lets Dr. Beaumont <b style="color:#fff">observe digestion as it happens</b>.</div></div>
    <div class="r" data-s="4"><div class="sub" style="font-size:32px">His experiments showed <b style="color:#fff">how different foods are broken down</b> — and even <b style="color:#fff">how emotions affect digestion</b>.</div></div>
  </div>`,
  tick(c) { const on = c.n >= 3 ? 1 : 0; c.q('.win').setAttribute('opacity', on ? f1((.75 + .25 * Math.sin(c.t * 2)) * 100) / 100 : 0); },
  notes: {
    say: 'In 1822, a young man named Alexis St. Martin was accidentally shot in the stomach. A doctor, William Beaumont, treated him. He survived, but the wound never fully healed – it left a small permanent opening into his stomach. Through this opening Dr. Beaumont could actually watch digestion happening!',
    ask: 'If you could look inside a stomach while it is digesting, what experiment would YOU do?',
    explain: 'Dr. Beaumont did experiments on how different foods were broken down in the stomach and even studied how emotions affect digestion. Discoveries in science sometimes begin by chance, but they need careful observation.',
    confusion: 'Keep the focus on the observation, not the injury. The opening was small and Alexis St. Martin lived a long life.',
    transition: '“Now our food has become a semi-liquid mass. Where does it go next? Follow it out of the stomach.”'
  }
});

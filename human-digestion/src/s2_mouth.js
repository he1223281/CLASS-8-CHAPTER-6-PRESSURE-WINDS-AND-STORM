/* ===================== ACT 2 · THE JOURNEY (mouth → food pipe) ===================== */

/* ---- shared mouth simulation: food fragments, jaw, saliva ---- */
function svgLabel(x, y, tx, ty, text, fs, col = '#fff', anchor = 'start', cls = '') {
  return `<g class="${cls}"><path d="M${x},${y} L${tx},${ty}" stroke="rgba(255,255,255,.55)" stroke-width="${fs * .09}" fill="none"/><circle cx="${x}" cy="${y}" r="${fs * .18}" fill="${col}"/>
  <text x="${tx + (anchor === 'start' ? fs * .4 : -fs * .4)}" y="${ty + fs * .35}" font-size="${fs}" font-weight="600" fill="${col}" text-anchor="${anchor}" style="paint-order:stroke;stroke:rgba(0,0,0,.75);stroke-width:${fs * .22}px">${text}</text></g>`;
}
function mouthSim(svg, seed = 21) {
  const m = { svg, jaw: $('.jaw', svg), tongue: $('.tongue', svg), food: $('.food', svg), sal: $('.sal', svg), fx: $('.fx', svg), epi: $('.epi', svg) };
  const R = rng(seed);
  m.pos = [[[712, 646]]];
  for (let L = 1; L <= 4; L++) {
    m.pos[L] = [];
    for (let k = 0; k < (1 << L); k++) {
      const p = m.pos[L - 1][k >> 1], s = 10 + L * 9;
      m.pos[L].push([clamp(p[0] + (R() - .5) * s * 2.2, 640, 805), clamp(p[1] + (R() - .5) * s * .5, 638, 662)]);
    }
  }
  m.pieces = [];
  for (let k = 0; k < 16; k++) {
    const pts = []; for (let v = 0; v < 8; v++) { const a = v / 8 * 6.283, rr = .72 + R() * .35; pts.push([rr * Math.cos(a), rr * Math.sin(a) * .8]); }
    const e = el('path', { d: closedPath(pts), fill: 'url(#gFood)', stroke: 'rgba(110,60,20,.55)', 'stroke-width': .08 }, m.food);
    m.pieces.push({ e, rot: R() * 360 });
  }
  m.bolus = el('ellipse', { rx: 1, ry: 1, fill: 'url(#gBolus)', stroke: 'rgba(160,220,255,.65)', 'stroke-width': 2.5, opacity: 0 }, m.food);
  /* level: 0..4 (float); jaw: px open; wet 0..1; gather 0..1 (to bolus at gx,gy) */
  m.set = (level, jaw, wet = 0, gather = 0, gx = 700, gy = 652, enter = 1) => {
    const L = Math.floor(clamp(level, 0, 4)), f = eout((level - L) * 2.2), cnt = 1 << L;
    m.pieces.forEach((p, k) => {
      if (k >= cnt || gather >= 1) { p.e.setAttribute('opacity', 0); return; }
      const own = m.pos[L][k], par = L ? m.pos[L - 1][k >> 1] : own;
      let x = lerp(par[0], own[0], L ? f : 1), y = lerp(par[1], own[1], L ? f : 1);
      if (L === 0) { x = lerp(980, own[0], enter); y = lerp(632, own[1], enter); }
      y += jaw * (x < 800 ? .55 : .3);
      x = lerp(x, gx, ein(gather)); y = lerp(y, gy, ein(gather));
      const r = 30 / Math.pow(1.42, L + (L < 4 ? f * 0 : 0)) * (1 - .6 * gather);
      p.e.setAttribute('transform', `translate(${f1(x)},${f1(y)}) rotate(${f1(p.rot)}) scale(${f1(r * 10) / 10})`);
      p.e.setAttribute('opacity', 1);
      p.e.setAttribute('stroke', wet > .1 ? 'rgba(170,225,255,.85)' : 'rgba(110,60,20,.55)');
    });
    m.jaw.setAttribute('transform', `translate(0,${f1(jaw)})`);
  };
  m.salP = [];
  m.ducts = [HEAD.PAROTID_DUCT, HEAD.SUBM_DUCT].map(d => { const p = el('path', { d, fill: 'none', stroke: 'none' }, m.fx); return [p, p.getTotalLength()]; });
  for (let i = 0; i < 46; i++) m.salP.push({ e: dotEl(m.sal, 4.2, 'url(#gBlue)', { opacity: 0 }), d: i % 2, off: R(), tx: 650 + R() * 150, ty: 638 + R() * 26, sp: .35 + R() * .3 });
  /* amt 0..1 how much saliva shown; t time */
  m.saliva = (amt, t) => {
    m.salP.forEach((s, i) => {
      if (amt <= 0) { s.e.setAttribute('opacity', 0); return; }
      const ph = (t * s.sp + s.off) % 1; const [p, L] = m.ducts[s.d];
      let x, y;
      if (ph < .45) { const q = p.getPointAtLength(L * ph / .45); x = q.x; y = q.y; }
      else { const e = p.getPointAtLength(L), k = ease((ph - .45) / .55); x = lerp(e.x, s.tx, k); y = lerp(e.y, s.ty, k); }
      s.e.setAttribute('cx', f1(x)); s.e.setAttribute('cy', f1(y));
      s.e.setAttribute('opacity', f1(amt * (ph > .9 ? (1 - ph) * 10 : 1) * 100) / 100);
    });
  };
  return m;
}
const MOUTH_VB = '445 430 545 580';

/* ---------- 6. Mouth: chewing ---------- */
slide({
  act: 2, organ: 0, title: 'The mouth: chewing',
  steps: ['Food enters the mouth', 'Show what happens when we chew', 'What did chewing do?'],
  html: `
  <svg class="abs head" style="left:30px;top:80px;width:940px;height:1000px" viewBox="${MOUTH_VB}">${headArt()}
    ${svgLabel(760, 604, 800, 520, 'Teeth', 18, '#fff')}
    ${svgLabel(640, 700, 600, 860, 'Tongue', 18, '#ffb3b8', 'end')}
  </svg>
  <div class="abs" style="left:1060px;top:150px;width:780px">
    <div class="kicker">Part 1 · The mouth</div>
    <div class="h2" style="margin:16px 0 40px">The journey begins</div>
    <div class="r" data-s="2"><div class="key c-warm">Teeth crush and chew</div></div>
    <div class="flow r" data-s="2" style="margin-top:46px;font-size:34px">
      <span>Large piece</span><span class="ar">→</span><span>chewing</span><span class="ar">→</span><span class="c-nut">small pieces</span></div>
    <div class="r" data-s="3" style="margin-top:70px"><div class="sub">Breaking food into <b style="color:#fff">fine pieces</b> is called</div>
      <div class="key" style="margin-top:12px">mechanical digestion</div></div>
  </div>`,
  init(c) { c.m = mouthSim(c.q('svg.head')); },
  tick(c) {
    const n = c.n, st = c.stepT;
    let level = 0, jaw = 0, enter = 0;
    if (n === 0) { enter = 0; jaw = 0; c.m.pieces.forEach(p => p.e.setAttribute('opacity', 0)); c.m.jaw.setAttribute('transform', ''); return; }
    if (n === 1) { enter = ease(seg(st, .4, 2)); jaw = 26 * (1 - seg(st, 1.9, 2.5)) * seg(st, 0, .4); }
    if (n >= 2) {
      enter = 1; const P = .9; const tt = n === 2 ? st : 60;
      const cyc = tt / P;
      level = Math.min(4, Math.floor(cyc) + (cyc % 1) * 0) + Math.min(.45, (cyc % 1)) ;
      level = Math.min(4.45, Math.floor(cyc) + Math.min(.45, cyc % 1)); if (cyc >= 4) level = 4.45;
      jaw = n === 2 ? 20 * (.5 - .5 * Math.cos(2 * Math.PI * cyc)) : 0;
      if (n >= 3) jaw = 0;
    }
    c.m.set(level, jaw, 0, 0, 700, 652, enter);
  },
  notes: {
    say: 'Our bite of chapati enters the mouth. Watch what the teeth do – they crush and chew the food again and again. One big piece becomes two, then four, then many tiny pieces.',
    ask: 'What would happen if you swallowed a big piece of chapati without chewing it?',
    explain: 'The teeth break food into smaller pieces by crushing and chewing. This first breakdown of food into fine pieces is called mechanical digestion. Nothing new is made yet – the food is only broken into smaller bits.',
    confusion: 'Mechanical digestion does not change starch into sugar – it only makes the pieces smaller. The chemical change comes from saliva (next).',
    transition: '“But why does breaking food into small pieces help at all? Let us try a simple idea.”'
  }
});

/* ---------- 7. Why small pieces? (surface) ---------- */
slide({
  act: 2, organ: 0, title: 'Why small pieces help',
  steps: ['Drop both into water', 'Why is one faster?', 'So, chewing helps because…'],
  html: `
  <div class="abs" style="left:140px;top:110px;width:1640px"><div class="kicker">A simple idea</div>
    <div class="q" style="margin-top:14px;font-size:56px">One big lump of sugar, or the same sugar as tiny pieces —<br>which dissolves faster?</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <g class="beakers"></g>
    <g class="sq" opacity="0"></g>
  </svg>
  <div class="lbl center" style="left:250px;top:930px;width:420px">One big lump</div>
  <div class="lbl center" style="left:770px;top:930px;width:420px">Many tiny pieces</div>
  <div class="abs r" data-s="1-1" style="left:1320px;top:420px;width:520px"><div class="key2 c-water">Tiny pieces dissolve much faster!</div></div>
  <div class="abs r" data-s="2" style="left:1320px;top:340px;width:540px">
    <div class="key2">Same food,<br><span class="c-nut">more surface</span></div>
    <div class="sub" style="margin-top:20px">Water (and digestive juices) can only work on the <b style="color:#fff">outside</b> of each piece.</div></div>
  <div class="abs r" data-s="3" style="left:1320px;top:700px;width:560px">
    <div class="flowv" style="font-size:34px"><span>Large piece</span><span class="ar">↓ chewing</span><span>Smaller pieces</span><span class="ar">↓</span><span class="c-nut">More surface for digestion</span></div></div>`,
  init(c) {
    const g = c.q('.beakers');
    const beaker = (x) => `<g transform="translate(${x},0)"><path d="M0,420 L0,860 Q0,900 40,900 L380,900 Q420,900 420,860 L420,420" fill="none" stroke="rgba(207,232,255,.55)" stroke-width="5"/>
      <rect class="water" x="4" y="520" width="412" height="376" rx="36" fill="rgba(90,170,255,.16)"/><path d="M4,520 L416,520" stroke="rgba(160,210,255,.6)" stroke-width="3"/></g>`;
    g.innerHTML = beaker(250) + beaker(770);
    c.lump = el('rect', { width: 120, height: 120, rx: 10, fill: '#f6f3ea', stroke: '#cfc8b8', 'stroke-width': 3 }, g);
    c.gr = []; const R = rng(9);
    for (let i = 0; i < 64; i++) { const x = 800 + (i % 16) * 22 + R() * 6, y = 860 - Math.floor(i / 16) * 22 - R() * 4; c.gr.push({ x, y, e: el('rect', { x: f1(x), y: f1(y), width: 16, height: 16, rx: 2, fill: '#f6f3ea', stroke: '#cfc8b8', 'stroke-width': 1.5 }, g) }); }
    c.sw = []; for (let i = 0; i < 40; i++) c.sw.push({ e: dotEl(g, 3, 'rgba(255,255,255,.7)', { opacity: 0 }), x: 790 + R() * 380, y: 540 + R() * 340, b: i < 20 ? 270 : 790, ph: R() * 6 });
    c.sw.forEach((s, i) => { if (i < 20) s.x = 270 + R() * 380; });
    // surface comparison
    const sq = c.q('.sq');
    sq.innerHTML = `<g transform="translate(1000,450)"></g>`;
  },
  step(c, n) { c.q('.beakers').style.opacity = 1; },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const p = n >= 1 ? (n === 1 ? st : 60) : 0;
    const lumpK = 1 - .35 * seg(p, 0, 14), grK = 1 - seg(p, .3, 5);
    const s = 120 * lumpK; setA(c.lump, { x: f1(460 - s / 2), y: f1(895 - s), width: f1(s), height: f1(s) });
    c.gr.forEach(g => { const z = 16 * grK; setA(g.e, { width: f1(Math.max(0, z)), height: f1(Math.max(0, z)), opacity: grK > .02 ? 1 : 0, x: f1(g.x + (16 - z) / 2), y: f1(g.y + (16 - z)) }); });
    c.sw.forEach((w, i) => { const on = n >= 1 && (i < 20 ? p < 20 : p > .3 && p < 7); w.e.setAttribute('opacity', on ? f1((.25 + .3 * Math.sin(t * 3 + w.ph)) * 100) / 100 : 0); w.e.setAttribute('cy', f1(w.y - ((t * 30 + w.ph * 40) % 120))); w.e.setAttribute('cx', f1(w.x)); });
  },
  notes: {
    say: 'Here are two glasses of water with the same amount of sugar. In one glass it is a single big lump; in the other it is broken into tiny pieces. Watch. The tiny pieces disappear much faster!',
    ask: 'Why did the tiny pieces dissolve faster, even though it was the same amount of sugar?',
    explain: 'Water can only touch the outside (surface) of each piece. Breaking a lump into many small pieces gives much more surface. In the same way, chewing gives digestive juices much more surface of food to act on.',
    confusion: 'Chewing does not make MORE food – it is the same amount of food, just with more surface exposed.',
    transition: '“Now, while you chew, something wet joins the food. Let us look at it closely.”'
  }
});

/* ---------- 8. Saliva & starch ---------- */
slide({
  act: 2, organ: 0, title: 'Saliva: why chapati tastes sweet',
  steps: ['Saliva arrives', 'Zoom into the chewed food', 'Watch saliva act on starch', 'So that is why!'],
  html: `
  <div class="abs" style="left:120px;top:96px;width:1700px"><div class="kicker">The first big wow</div>
    <div class="q" style="font-size:54px;margin-top:12px">Why does chapati start to taste <span class="c-nut">sweet</span> if you keep chewing it?</div></div>
  <svg class="abs head" style="left:0;top:250px;width:780px;height:830px" viewBox="${MOUTH_VB}">${headArt()}
    <g class="r" data-s="1">${svgLabel(600, 560, 560, 500, 'Saliva', 20, '#8fd3ff', 'end')}</g>
  </svg>
  <svg class="full lensSvg" viewBox="0 0 1920 1080">
    <defs><clipPath id="cLens"><circle cx="1400" cy="680" r="300"/></clipPath>
      <radialGradient id="gLens" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#3a2a18"/><stop offset="1" stop-color="#160f08"/></radialGradient></defs>
    <g class="lens" opacity="0">
      <path class="cone" d="M512,705 L1210,440 M512,712 L1210,920" stroke="rgba(143,211,255,.35)" stroke-width="2" stroke-dasharray="6 8"/>
      <circle cx="1400" cy="680" r="300" fill="url(#gLens)"/>
      <g clip-path="url(#cLens)"><g class="starch"></g><g class="saliva"></g></g>
      <circle cx="1400" cy="680" r="300" fill="none" stroke="rgba(207,232,255,.7)" stroke-width="6"/>
      <circle cx="1400" cy="680" r="312" fill="none" stroke="rgba(207,232,255,.15)" stroke-width="14"/>
    </g>
  </svg>
  <div class="lbl r" data-s="2-2" style="left:1230px;top:990px">Starch<small style="display:inline;margin-left:10px">(a carbohydrate)</small></div>
  <div class="lbl r" data-s="3" style="left:1150px;top:990px"><span style="color:#f3e6c4">Starch</span> <span class="c-sal">— saliva →</span> <span class="c-nut">simpler sugars</span></div>
  <div class="banner r" data-s="4" style="top:236px;font-size:38px">Saliva helps break down <span style="color:#f3e6c4">starch</span> into <span class="c-nut">simpler sugars</span>.</div>
  <div class="fact r d1" data-s="4" style="left:40px;top:790px;width:640px"><div class="fk">DID YOU KNOW?</div><div class="ft">Your mouth waters when you just <i>think</i> of your favourite food — that is more saliva being released.</div></div>`,
  init(c) {
    c.m = mouthSim(c.q('svg.head'), 21);
    const g = c.q('.starch'); c.ch = [];
    [[1320, 520, .3], [1490, 600, -.4], [1320, 710, .1], [1490, 790, .5], [1390, 880, -.1], [1270, 620, -.7]].forEach(([x, y, a], i) =>
      c.ch.push(new Chain(g, { x, y, n: 7, r: 17, gap: 38, ang: a, shape: 'hex', colors: ['#f3e6c4'], simple: '#ffd36e', seed: 30 + i, spread: 34, spreadT: 3, wave: 8, lw: 5 })));
    c.sp = []; const R = rng(77), sg = c.q('.saliva');
    for (let i = 0; i < 26; i++) c.sp.push({ e: dotEl(sg, 9, 'url(#gBlue)'), a: R() * 6.28, r: R(), ph: R() * 6, d: R() * 1.5 });
  },
  tick(c, dt) {
    const n = c.n, st = c.stepT, t = c.t;
    const P = .9, cyc = (c.t) / P;
    c.m.set(4.45, n <= 1 ? 14 * (.5 - .5 * Math.cos(2 * Math.PI * cyc)) : 0, n >= 1 ? 1 : 0);
    c.m.saliva(n >= 1 ? 1 : 0, t);
    const lensOn = n >= 2 ? eout(n === 2 ? st / 1.2 : 1) : 0;
    const L = c.q('.lens'); L.setAttribute('opacity', f1(lensOn * 100) / 100);
    L.setAttribute('transform', `translate(1400,680) scale(${f1((.6 + .4 * lensOn) * 1000) / 1000}) translate(-1400,-680)`);
    const T = n >= 3 ? { 1: n === 3 ? st - .8 : 60 } : {};
    c.ch.forEach(ch => ch.update(dt, T, t));
    c.sp.forEach(s => {
      if (n < 3) { s.e.setAttribute('opacity', 0); return; }
      const k = eout(seg(n === 3 ? st : 60, s.d * .5, s.d * .5 + 2.5));
      const rr = lerp(420, 60 + s.r * 250, k), a = s.a + t * .15;
      s.e.setAttribute('cx', f1(1400 + rr * Math.cos(a) + 10 * Math.sin(t + s.ph)));
      s.e.setAttribute('cy', f1(680 + rr * Math.sin(a) + 10 * Math.cos(t * 1.2 + s.ph)));
      s.e.setAttribute('opacity', .9);
    });
  },
  notes: {
    say: 'Try this at home: chew a small piece of chapati or a bite of boiled rice for 30 to 60 seconds without swallowing. At first it tastes normal… then it starts tasting sweet! Why? Look – while you chew, a watery juice flows into your mouth. This is saliva. Now let us zoom into the chewed food.',
    ask: 'Has your mouth ever watered just by thinking about your favourite food? What is that liquid?',
    explain: 'Chapati and rice contain starch, a type of carbohydrate. Starch is like a long chain. Saliva contains a digestive juice that breaks this chain into simpler sugars. Sugar tastes sweet – so the longer you chew, the sweeter it tastes. Food is partially digested in the mouth itself.',
    confusion: 'Students may think sugar was already in the chapati. It was not sweet at first – the sugar is made from starch by saliva while you chew.',
    transition: '“Can we PROVE that saliva breaks down starch? Let us do the experiment from your textbook.”'
  }
});

/* ---------- 9. Iodine activity ---------- */
slide({
  act: 2, organ: 0, title: 'Activity 9.1: the iodine test',
  steps: ['Add the rice', 'Add water', 'Add iodine', 'Why the difference?'],
  html: `
  <div class="abs" style="left:120px;top:96px;width:1700px"><div class="kicker">Activity 9.1 · Let us investigate</div>
    <div class="h3" style="margin-top:12px">Does saliva really change starch?</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <defs><filter id="fBlur10" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter></defs>
    <g class="tubes"></g>
  </svg>
  <div class="lbl center" style="left:310px;top:930px;width:300px;font-size:52px">A<small style="font-size:28px">Boiled rice</small></div>
  <div class="lbl center" style="left:700px;top:930px;width:360px;font-size:52px">B<small style="font-size:28px">Chewed boiled rice<br>(30–60 seconds)</small></div>
  <div class="abs" style="left:1180px;top:300px;width:660px">
    <div class="r" data-s="2"><div class="small caps" style="letter-spacing:.2em">Before iodine</div><div class="sub" style="margin-top:6px">Both look <b style="color:#fff">whitish</b></div></div>
    <div class="r" data-s="3" style="margin-top:44px"><div class="small caps" style="letter-spacing:.2em">After iodine</div>
      <div class="sub" style="margin-top:6px"><b style="color:#fff">A</b> turns <b style="color:#8f9cff">blue-black</b></div>
      <div class="sub"><b style="color:#fff">B</b> shows <b style="color:#e8d49a">no change or very light</b> colour</div></div>
    <div class="r" data-s="4" style="margin-top:48px;padding:28px 32px;border-radius:20px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.14)">
      <div class="key2" style="font-size:34px">Iodine + starch → <span style="color:#8f9cff">blue-black</span></div>
      <div class="sub" style="margin-top:14px;font-size:31px"><b style="color:#fff">A:</b> starch is present.</div>
      <div class="sub" style="font-size:31px"><b style="color:#fff">B:</b> saliva has broken the starch into <b class="c-nut">simpler sugars</b>.</div></div>
  </div>`,
  init(c) {
    const g = c.q('.tubes'); c.tb = [];
    [[460, 0], [880, 1]].forEach(([x, k]) => {
      const inner = `M${x - 62},230 L${x - 62},800 A62,62 0 0 0 ${x + 62},800 L${x + 62},230`;
      const id = 'cT' + k;
      g.insertAdjacentHTML('beforeend', `<clipPath id="${id}"><path d="${inner} Z"/></clipPath>
        <g clip-path="url(#${id})"><rect class="liq" x="${x - 70}" y="870" width="140" height="0" fill="#e9e4d6"/><rect class="front" x="${x - 70}" y="600" width="140" height="0" fill="#141a3f" filter="url(#fBlur10)" opacity="0"/><g class="rice"></g></g>
        <path d="${inner}" fill="url(#gGlass)" stroke="rgba(207,232,255,.75)" stroke-width="5"/>
        <path d="M${x - 78},230 L${x + 78},230" stroke="rgba(207,232,255,.75)" stroke-width="8" stroke-linecap="round"/>
        <path d="M${x - 40},260 L${x - 40},790" stroke="rgba(255,255,255,.18)" stroke-width="8" stroke-linecap="round"/>
        <g class="drop" opacity="0"><path d="M${x - 14},40 L${x + 14},40 L${x + 10},160 L${x + 3},190 L${x - 3},190 L${x - 10},160 Z" fill="rgba(207,232,255,.25)" stroke="rgba(207,232,255,.7)" stroke-width="3"/>
          <rect x="${x - 9}" y="110" width="18" height="60" fill="#9a5a1a" opacity=".85"/><rect x="${x - 20}" y="-10" width="40" height="56" rx="14" fill="#2b2b33" stroke="#555" stroke-width="2"/></g>
        <g class="dr"></g>`);
      const G = g.lastElementChild ? g : g;
      const all = c.qa('.liq'); const tb = { x, k, liq: all[k], front: c.qa('.front')[k], rice: c.qa('.rice')[k], drop: c.qa('.drop')[k], dr: c.qa('.dr')[k] };
      const R = rng(5 + k * 9);
      tb.grains = [];
      for (let i = 0; i < (k ? 34 : 16); i++) {
        const gx = x - 48 + R() * 96, gy = 835 - R() * (k ? 30 : 46);
        tb.grains.push({ gy, e: k ? el('circle', { cx: f1(gx), cy: f1(gy), r: f1(3 + R() * 5), fill: '#f4f0e4', opacity: .95 }, tb.rice)
          : el('ellipse', { cx: f1(gx), cy: f1(gy), rx: 7, ry: 15, transform: `rotate(${f1(R() * 180)} ${f1(gx)} ${f1(gy)})`, fill: '#fbf8ee', stroke: '#d8d1bf', 'stroke-width': 1.5 }, tb.rice) });
      }
      tb.drops = [0, 1, 2].map(() => el('ellipse', { cx: x, cy: 200, rx: 7, ry: 9, fill: '#a5611c', opacity: 0 }, tb.dr));
      c.tb.push(tb);
    });
  },
  tick(c) {
    const n = c.n, st = c.stepT;
    const P = k => n > k ? 60 : n === k ? st : -1;
    c.tb.forEach(tb => {
      const pr = P(1), pw = P(2), pi = P(3);
      const rk = pr < 0 ? 0 : eout(pr / 1.4);
      tb.rice.setAttribute('opacity', rk > 0 ? 1 : 0);
      tb.rice.setAttribute('transform', `translate(0,${f1(-500 * (1 - rk))})`);
      const wl = pw < 0 ? 0 : ease(pw / 2.2);
      const top = 862 - 262 * wl;
      setA(tb.liq, { y: f1(top), height: f1(870 - top) });
      tb.drop.setAttribute('opacity', pi >= 0 && pi < 3.8 ? 1 : 0);
      tb.drops.forEach((d, i) => {
        const tt = pi - .4 - i * .55;
        if (pi < 0 || tt < 0 || tt > .7) { d.setAttribute('opacity', 0); return; }
        d.setAttribute('opacity', 1); d.setAttribute('cy', f1(200 + 400 * (tt / .7) * (tt / .7)));
      });
      const ck = pi < 0 ? 0 : ease(seg(pi, 1.2, 4.2));
      const target = tb.k === 0 ? '#151a40' : '#dccb93';
      tb.liq.setAttribute('fill', mix('#e9e4d6', target, ck));
      const fk = pi < 0 ? 0 : seg(pi, .9, 3.4);
      setA(tb.front, { y: f1(top - 20), height: f1(fk * (880 - top)), fill: target, opacity: fk > 0 && ck < 1 ? .85 : 0 });
      tb.grains.forEach(g => g.e.setAttribute('fill', tb.k === 0 ? mix('#fbf8ee', '#262c5c', ck) : mix('#f4f0e4', '#e2d29e', ck)));
    });
  },
  notes: {
    say: 'Take two test tubes, A and B. In A, put a teaspoon of boiled rice. In B, put boiled rice that has been chewed for 30–60 seconds. Add 3–4 mL of water to both. Now add 3–4 drops of iodine solution to each and mix.',
    ask: 'Before I add iodine – predict! Which tube will turn blue-black? Why?',
    explain: 'Remember from Grade 6: iodine turns blue-black with starch. Tube A turns blue-black, so it has starch. Tube B shows no change or only a very light colour – so most of the starch is gone. Saliva has broken it down into simple sugars.',
    confusion: 'Some think the chewed rice “lost” its food. It did not – the starch was changed into sugar, which iodine does not colour. If B still shows some colour, chew for longer and try again.',
    transition: '“So saliva starts digestion in the mouth. Now, how does this soft, chewed food leave the mouth?”'
  }
});

/* ---------- 10. Tongue & swallowing ---------- */
slide({
  act: 2, title: 'The tongue and swallowing',
  organ: c => c.n >= 4 ? 1 : 0,
  steps: ['Saliva moistens the food', 'Tongue mixes and gathers it', 'Tongue pushes it back', 'Down into the food pipe'],
  html: `
  <svg class="abs head" style="left:20px;top:70px;width:980px;height:1010px" viewBox="430 430 590 625">${headArt()}
    <g class="r" data-s="4">${svgLabel(524, 940, 600, 960, 'Food pipe (Oesophagus)', 19, '#ffb3b8', 'start')}
    ${svgLabel(600, 880, 700, 880, 'Windpipe', 15, 'rgba(190,215,240,.9)', 'start')}</g>
  </svg>
  <div class="abs" style="left:1080px;top:150px;width:760px">
    <div class="kicker">Part 2 · Tongue &amp; swallowing</div>
    <div class="h2" style="margin:16px 0 44px">Ready to swallow</div>
    <div class="r" data-s="1" style="margin-bottom:30px"><div class="key2 c-sal">Saliva moistens the food</div><div class="small">soft and easy to swallow</div></div>
    <div class="r" data-s="2" style="margin-bottom:30px"><div class="key2" style="color:#ffb3b8">Tongue mixes food with saliva</div><div class="small">and gathers it into a soft ball</div></div>
    <div class="r" data-s="3" style="margin-bottom:30px"><div class="key2" style="color:#ffb3b8">Tongue pushes it back</div><div class="small">towards the food pipe</div></div>
    <div class="r" data-s="4"><div class="key2 c-warm">Into the food pipe</div><div class="small">A small flap closes the windpipe, so food goes the right way.</div></div>
  </div>`,
  init(c) {
    c.m = mouthSim(c.q('svg.head'), 21);
    c.bp = el('path', { d: HEAD.BOLUS_PATH, fill: 'none', stroke: 'none' }, c.m.fx); c.bL = c.bp.getTotalLength();
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const S = k => n > k ? 60 : n === k ? st : -1;
    const wet = n >= 1 ? 1 : 0;
    c.m.saliva(n >= 1 && n <= 2 ? 1 : n === 3 ? Math.max(0, 1 - st) : 0, t);
    const g = S(2) >= 0 ? ease(seg(S(2), .3, 2.6)) : 0;
    const wig = n === 2 && st < 3 ? 8 * Math.sin(st * 9) : 0;
    c.m.tongue.setAttribute('transform', `translate(0,${f1(wig * .6)})`);
    // bolus
    const push = S(3) >= 0 ? S(3) : -1;
    const down = S(4) >= 0 ? S(4) : -1;
    let u = 0;
    if (push >= 0) u = .32 * ease(seg(push, .5, 2.2));
    if (down >= 0) u = .32 + .68 * ease(seg(down, 0, 3.4));
    const p = c.bp.getPointAtLength(u * c.bL);
    const tp = push >= 0 ? (push < 2.6 ? Math.sin(seg(push, 0, 2.6) * Math.PI) : 0) : 0;
    c.m.tongue.setAttribute('transform', `translate(${f1(-14 * tp)},${f1(-22 * tp + wig * .6)})`);
    const showB = g >= 1;
    c.m.set(4.45, 0, wet, g >= 1 ? 1 : g, 712, 646);
    const sq = u > .4 ? .82 : 1;
    setA(c.m.bolus, { cx: f1(showB ? p.x : 712), cy: f1(showB ? p.y : 646), rx: f1(30 * sq * Math.min(1, g * 1.2)), ry: f1(22 / sq * Math.min(1, g * 1.2)), opacity: g > .6 ? Math.min(1, (g - .6) * 3) : 0 });
    // epiglottis closes while bolus passes the throat
    const close = down >= 0 ? Math.sin(Math.PI * seg(down, .1, 2.2)) : 0;
    c.m.epi.setAttribute('transform', `rotate(${f1(95 * clamp(close * 1.6))} 579 800)`);
  },
  notes: {
    say: 'Saliva does one more job – it makes the chewed food wet, soft and slippery, so it is easy to swallow. Watch the tongue: it mixes the food with saliva and gathers it into a soft ball. Then it presses up and pushes the ball back into the throat, into the food pipe.',
    ask: 'Try it now: swallow once and feel what your tongue does. Which way does it push?',
    explain: 'The tongue mixes chewed food with saliva and pushes this softened food into a long, flexible tube called the food pipe or oesophagus. A small flap closes over the windpipe while we swallow, so food goes into the food pipe and not into the windpipe.',
    confusion: 'The windpipe (for air) and the food pipe (for food) are two different tubes. When we talk while eating, food can “go down the wrong way” and make us cough.',
    transition: '“Now the food is in the food pipe. Does it just fall down? Let us find out.”'
  }
});

/* ---------- 11. Oesophagus: the wave ---------- */
slide({
  act: 2, organ: 1, title: 'The food pipe: a squeezing wave',
  steps: ['Food enters the tube', 'Squeeze behind the food', 'Relax in front of it', 'Watch the wave', 'What do scientists call it?'],
  html: `
  <div class="abs" style="left:1040px;top:130px;width:800px">
    <div class="kicker">Part 3 · The food pipe</div>
    <div class="h2" style="margin:14px 0 6px">FOOD PIPE</div>
    <div class="sub c-mut" style="font-style:italic;font-family:var(--serif);font-size:42px">“Oesophagus”</div>
    <div class="sub r" data-s="0-0" style="margin-top:44px">A long, flexible tube from the mouth to the stomach.</div>
    <div class="r" data-s="1-3" style="margin-top:44px"><div class="key2"><span class="dot" style="color:#ff6b6b;background:#ff6b6b"></span>Behind the food: walls <span style="color:#ff8a8a">squeeze</span></div></div>
    <div class="r" data-s="2-3" style="margin-top:22px"><div class="key2"><span class="dot" style="color:#7fe0c8;background:#7fe0c8"></span>In front: walls <span style="color:#8af0d8">relax</span></div></div>
    <div class="r" data-s="3-3" style="margin-top:40px"><div class="sub">Again and again, like a wave — the food is pushed down.</div></div>
    <div class="r" data-s="4" style="margin-top:40px"><div class="sub">The walls gently <b style="color:#fff">contract and relax</b> in a <b style="color:#fff">wave-like motion</b> to push food to the stomach.</div>
      <div class="term" style="margin-top:30px">Scientific term: <b>Peristalsis</b></div>
      <div class="small" style="margin-top:20px">This movement happens all along the alimentary canal.</div></div>
  </div>
  <svg class="full" viewBox="0 0 1920 1080">
    <g class="stomTop"><path d="M520,1000 C560,980 640,960 720,990 C800,1020 840,1080 840,1100 L380,1100 C400,1050 470,1015 520,1000 Z" fill="url(#gStom)" opacity=".85"/></g>
    <g class="oesG"><path class="wallL"/><path class="wallR"/><path class="lumen"/><g class="rings"></g><g class="bol"></g></g>
  </svg>
  <div class="lbl" style="left:420px;top:1010px;color:#ffb3b8">Stomach ↓</div>
  <div class="lbl sqz" style="opacity:0;color:#ff9a9a">Squeezes</div>
  <div class="lbl rlx" style="opacity:0;color:#8af0d8">Relaxes</div>
  <div class="fact r d1" data-s="4" style="left:1040px;top:860px;width:800px"><div class="fk">DID YOU KNOW?</div><div class="ft">Because the food pipe <i>pushes</i> food, astronauts can swallow even in space!</div></div>`,
  init(c) {
    c.cx = 620; c.y0 = 110; c.y1 = 1010;
    c.wl = c.q('.wallL'); c.wr = c.q('.wallR'); c.lu = c.q('.lumen');
    setA(c.wl, { fill: '#c95f6a', stroke: '#7a2a36', 'stroke-width': 2 }); setA(c.wr, { fill: '#c95f6a', stroke: '#7a2a36', 'stroke-width': 2 }); setA(c.lu, { fill: '#3b0d16' });
    c.rings = []; const rg = c.q('.rings');
    for (let y = c.y0 + 10; y < c.y1; y += 22) c.rings.push({ y, l: el('line', { stroke: 'rgba(90,20,30,.45)', 'stroke-width': 3 }, rg), r: el('line', { stroke: 'rgba(90,20,30,.45)', 'stroke-width': 3 }, rg) });
    const bg = c.q('.bol');
    c.bglow = el('ellipse', { rx: 70, ry: 80, fill: 'url(#gGold)', opacity: .25 }, bg);
    c.bol = el('ellipse', { rx: 44, ry: 54, fill: 'url(#gBolus)', stroke: 'rgba(160,220,255,.7)', 'stroke-width': 3 }, bg);
    c.sq = c.q('.sqz'); c.rl = c.q('.rlx');
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const Rb = 50, base = 16;
    let yb = -200, cs = 0, rs = 0;
    if (n >= 1 && n <= 2) {
      yb = lerp(-80, 330, eout(seg(n === 1 ? st : 60, 0, 1.6)));
      cs = n === 1 ? ease(seg(st, 1.6, 2.6)) : 1;
      rs = n === 2 ? ease(seg(st, 0, 1)) : 0;
    }
    if (n >= 3) {
      const per = 8.5, ph = ((n === 3 ? st : st + 3) % per) / per;
      yb = lerp(330, 1180, ph); if (n === 3 && st < per) yb = lerp(330, 1180, ph);
      cs = 1; rs = 1;
    }
    const W = y => {
      const d = y - yb;
      let r = base;
      if (Math.abs(d) < Rb + 6) r = Math.max(r, (Rb + 6) * Math.sqrt(Math.max(0, 1 - (d / (Rb + 6)) ** 2)));
      let th = 30;
      // contraction zone behind (above)
      const bz = -(d + Rb);
      if (bz > 0 && bz < 150) { const k = Math.sin(Math.PI * bz / 150) * cs; r = lerp(r, 5, k); th += 16 * k; }
      // relaxed zone ahead (below)
      const fz = d - Rb;
      if (fz > 0 && fz < 170) { const k = Math.sin(Math.PI * fz / 170) * rs; r = lerp(r, 34, k); th -= 6 * k; }
      return [r, th, bz > 0 && bz < 150 ? Math.sin(Math.PI * bz / 150) * cs : 0, fz > 0 && fz < 170 ? Math.sin(Math.PI * fz / 170) * rs : 0];
    };
    const L = [], Ri = [], Lo = [], Ro = [];
    for (let y = c.y0; y <= c.y1; y += 8) { const [r, th] = W(y); Ri.push([c.cx + r, y]); L.push([c.cx - r, y]); Lo.push([c.cx - r - th, y]); Ro.push([c.cx + r + th, y]); }
    c.wl.setAttribute('d', polyD([...Lo, ...L.slice().reverse()]));
    c.wr.setAttribute('d', polyD([...Ro, ...Ri.slice().reverse()]));
    c.lu.setAttribute('d', polyD([...L, ...Ri.slice().reverse()]));
    // colour the squeezing / relaxing zones
    c.rings.forEach(rg => {
      const [r, th, ks, kr] = W(rg.y);
      const col = ks > .15 ? `rgba(255,90,90,${f1(.4 + .6 * ks)})` : kr > .15 ? `rgba(120,240,210,${f1(.3 + .6 * kr)})` : 'rgba(90,20,30,.45)';
      setA(rg.l, { x1: f1(c.cx - r - th), x2: f1(c.cx - r), y1: rg.y, y2: rg.y, stroke: col, 'stroke-width': ks > .15 ? 5 : 3 });
      setA(rg.r, { x1: f1(c.cx + r), x2: f1(c.cx + r + th), y1: rg.y, y2: rg.y, stroke: col, 'stroke-width': ks > .15 ? 5 : 3 });
    });
    const vis = n >= 1 && yb < c.y1 + 60;
    setA(c.bol, { cx: c.cx, cy: f1(yb), opacity: vis ? 1 : 0 });
    setA(c.bglow, { cx: c.cx, cy: f1(yb), opacity: vis ? .25 : 0 });
    const lblOn = n >= 1 && n <= 3 && yb < 900;
    c.sq.style.opacity = lblOn && cs > .3 ? 1 : 0; c.sq.style.left = (c.cx - 330) + 'px'; c.sq.style.top = (yb - Rb - 100) + 'px';
    c.rl.style.opacity = lblOn && rs > .3 ? 1 : 0; c.rl.style.left = (c.cx - 300) + 'px'; c.rl.style.top = (yb + Rb + 70) + 'px';
  },
  notes: {
    say: 'Here is the food pipe. Look carefully – the food does not simply fall down. The muscles in the wall BEHIND the food squeeze tight, and the wall IN FRONT of the food relaxes and opens up. Squeeze behind, relax in front… again and again, like a wave, pushing the food down to the stomach.',
    ask: 'Have you ever squeezed toothpaste from the bottom of the tube? How is that similar to what the food pipe does?',
    explain: 'The walls of the food pipe gently contract and relax in a wave-like motion to push the food down into the stomach. Scientists call this movement peristalsis. It happens throughout the alimentary canal and keeps pushing food forward.',
    confusion: 'Food does NOT go down only because of gravity. Even if you drink water while lying down, it still reaches your stomach.',
    transition: '“And where does this wave deliver our food? Into a stretchy, muscular bag – the stomach.”'
  }
});

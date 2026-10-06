/* ===================== ACT 1 · THE MYSTERY ===================== */

/* ---------- 1. Opening ---------- */
slide({
  act: 1, organ: -1, title: 'One bite…',
  steps: ['Where does it go?', 'Does it fall into the stomach?', 'Is it used as it is?', 'So what really happens?'],
  html: `
  <svg class="abs" style="left:120px;top:190px;width:720px;height:720px" viewBox="-360 -360 720 720">
    <defs><mask id="mBite"><rect x="-400" y="-400" width="800" height="800" fill="#fff"/>
      <circle cx="168" cy="-170" r="70" fill="#000"/><circle cx="215" cy="-95" r="58" fill="#000"/><circle cx="105" cy="-222" r="56" fill="#000"/></mask>
      <radialGradient id="gChap" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#f4d9a2"/><stop offset=".7" stop-color="#e0b26a"/><stop offset="1" stop-color="#b98443"/></radialGradient></defs>
    <circle r="330" fill="url(#gGold)" opacity=".12" class="halo"/>
    <g class="chap"><g mask="url(#mBite)">
      <circle r="250" fill="url(#gChap)"/>
      <g class="spots" filter="url(#fSoft)"></g>
      <circle r="248" fill="none" stroke="rgba(120,70,20,.45)" stroke-width="6"/>
      <circle r="225" fill="none" stroke="rgba(255,240,210,.18)" stroke-width="10"/>
    </g></g>
    <g class="piece"><path d="M120,-196 C150,-238 196,-226 214,-176 C238,-150 258,-110 236,-70 C200,-80 160,-120 120,-196 Z" fill="url(#gChap)" stroke="rgba(120,70,20,.4)" stroke-width="3"/></g>
    <g class="crumbs"></g>
  </svg>
  <div class="abs" style="left:900px;top:330px;width:900px">
    <div class="q r abs" data-s="0-0" style="top:0">Imagine you take <span class="c-warm">ONE bite</span> of your favourite food…</div>
    <div class="q r abs" data-s="1-1" style="top:40px;font-size:84px">Where does that bite go?</div>
    <div class="q r abs" data-s="2-2" style="top:0">Does it simply fall into your stomach?</div>
    <div class="no r d1 abs" data-s="2-2" style="top:200px">No.</div>
    <div class="q r abs" data-s="3-3" style="top:0">Does your body use the food exactly as you swallowed it?</div>
    <div class="no r d1 abs" data-s="3-3" style="top:200px">No.</div>
    <div class="r abs" data-s="4" style="top:10px"><div class="h1">So what <span class="c-warm">really</span> happens?</div></div>
  </div>`,
  init(c) {
    const R = rng(4), sp = c.q('.spots');
    for (let i = 0; i < 46; i++) { const a = R() * 6.28, d = Math.sqrt(R()) * 220; el('ellipse', { cx: f1(d * Math.cos(a)), cy: f1(d * Math.sin(a)), rx: f1(6 + R() * 16), ry: f1(4 + R() * 10), fill: R() < .5 ? '#8a5522' : '#a8692c', opacity: f1(.25 + R() * .45) }, sp); }
    c.crumbs = []; const cg = c.q('.crumbs');
    for (let i = 0; i < 26; i++) c.crumbs.push({ e: dotEl(cg, 2 + R() * 4, '#e7c27f', { opacity: .5 }), x: (R() - .5) * 640, y: (R() - .5) * 640, v: 6 + R() * 14, ph: R() * 6 });
  },
  tick(c) {
    const t = c.t, n = c.n, st = c.stepT;
    c.q('.chap').setAttribute('transform', `translate(0,${f1(8 * Math.sin(t * .6))}) rotate(${f1(t * 2)})`);
    // the bite piece drifts away once we ask "where does it go?"
    const p = n >= 1 ? eout(n === 1 ? st / 3.2 : 1) : 0;
    const px = lerp(0, 260, p), py = lerp(0, 160, p), sc = lerp(1, .35, p);
    c.q('.piece').setAttribute('transform', `translate(${f1(px)},${f1(py + 8 * Math.sin(t * .6))}) scale(${f1(sc * 100) / 100})`);
    c.q('.piece').setAttribute('opacity', n >= 4 ? .95 : 1);
    c.q('.halo').setAttribute('opacity', f1((.1 + .05 * Math.sin(t * 1.4)) * 100) / 100);
    c.crumbs.forEach(k => { k.y -= k.v * .016; if (k.y < -340) k.y = 340; k.e.setAttribute('cx', f1(k.x + 10 * Math.sin(t * .5 + k.ph))); k.e.setAttribute('cy', f1(k.y)); });
  },
  notes: {
    say: 'Close your eyes for a second. Imagine your favourite food in front of you – hot chapati, rice, dosa, anything. Now imagine taking just ONE bite. (Pause.) Where does that bite go?',
    ask: 'Hands up – where do you think the bite goes first? And where does it finally end up?',
    explain: 'Let students give answers freely (stomach, intestine, “it turns into energy”). Do not correct yet. The two “No.” answers create the mystery: food does not simply drop into the stomach, and the body cannot use food in the form we swallow it.',
    confusion: 'Many students imagine the stomach as a bag directly below the mouth into which food falls. Today’s journey will show that food is pushed through a long tube and changed at every stage.',
    transition: '“To understand this, let us first remember why living beings need food at all.”'
  }
});

/* ---------- 2. Life processes ---------- */
function figurePath() {
  const half = [[18, -276], [34, -262], [80, -250], [112, -232], [128, -196], [136, -120], [146, -40], [152, 28], [156, 60], [144, 80], [128, 64], [122, 20], [112, -60], [100, -136], [92, -166], [88, -100], [82, -30], [92, 40], [90, 120], [80, 240], [72, 360], [74, 400], [98, 424], [94, 438], [42, 438], [36, 400], [34, 300], [28, 180], [14, 84]];
  const pts = [[0, -278], ...half, [0, 74], ...half.slice().reverse().map(p => [-p[0], p[1]])];
  return closedPath(pts);
}
const FIG_D = figurePath() + ' M-54,-332 a54,54 0 1,0 108,0 a54,54 0 1,0 -108,0 Z';
slide({
  act: 1, organ: -1, title: 'Life processes',
  steps: ['Show the life processes', 'Which one begins with food?'],
  html: `
  <div class="abs" style="left:140px;top:120px"><div class="kicker">Before we begin</div><div class="h2" style="margin-top:14px">Every living being must…</div></div>
  <svg class="abs" style="left:660px;top:250px;width:600px;height:760px" viewBox="-300 -400 600 860">
    <circle cx="0" cy="-60" r="300" fill="url(#gTeal)" opacity=".08"/>
    <circle cx="0" cy="-332" r="54" fill="url(#gSkin)" stroke="rgba(184,212,255,.55)" stroke-width="3"/>
    <path d="${figurePath()}" fill="url(#gSkin)" stroke="rgba(184,212,255,.55)" stroke-width="3"/>
    <g class="belly" opacity="0"><ellipse cx="0" cy="-20" rx="70" ry="95" fill="url(#gGold)"/></g>
  </svg>
  <div class="card r lp1" data-s="1" style="left:120px;top:330px;width:560px;transition-delay:.1s"><div class="ct c-warm">NUTRITION</div><div class="cd">getting and using food</div></div>
  <div class="card r lp2" data-s="1" style="left:1240px;top:330px;width:560px;transition-delay:.5s"><div class="ct c-teal">RESPIRATION</div><div class="cd">releasing energy from food</div></div>
  <div class="card r lp3" data-s="1" style="left:120px;top:540px;width:560px;transition-delay:.9s"><div class="ct c-blood">CIRCULATION</div><div class="cd">carrying materials around the body</div></div>
  <div class="card r lp4" data-s="1" style="left:1240px;top:540px;width:560px;transition-delay:1.3s"><div class="ct c-sal">EXCRETION</div><div class="cd">removing wastes from the body</div></div>
  <div class="card r lp5" data-s="1" style="left:120px;top:750px;width:560px;transition-delay:1.7s"><div class="ct" style="color:#d9a6ff">REPRODUCTION</div><div class="cd">producing young ones</div></div>
  <div class="abs r" data-s="1" style="left:1240px;top:770px;width:600px;transition-delay:2.2s"><div class="sub">These <b style="color:#fff">life processes</b> help living beings <b style="color:#fff">survive</b>.</div></div>
  <div class="banner r" data-s="2" style="top:960px">Today: <span class="c-warm">NUTRITION</span> — what happens to the food we eat</div>`,
  step(c, n) {
    ['.lp2', '.lp3', '.lp4', '.lp5'].forEach(s => { c.q(s).style.opacity = n >= 2 ? .3 : ''; });
    const l1 = c.q('.lp1'); l1.style.borderColor = n >= 2 ? 'rgba(255,184,107,.8)' : ''; l1.style.boxShadow = n >= 2 ? '0 0 50px rgba(255,184,107,.35)' : '';
  },
  tick(c) { c.q('.belly').setAttribute('opacity', c.n >= 2 ? f1((.55 + .25 * Math.sin(c.t * 2)) * 100) / 100 : 0); },
  notes: {
    say: 'You learnt in Grade 6 that all living beings carry out some basic processes to stay alive. Let us name them together: nutrition, respiration, circulation, excretion and reproduction. Together we call them life processes.',
    ask: 'Which of these life processes do you think starts the moment you take a bite of food?',
    explain: 'Nutrition is how living beings get food and use it. Our body needs energy and materials from food to carry out all the other life processes too.',
    confusion: 'Students sometimes think respiration means only breathing. Respiration is about releasing energy from food – breathing helps it happen. (Keep this brief; it is a later topic.)',
    transition: '“Today we are going inside one of the most amazing machines in your body – the one that handles your food.”'
  }
});

/* ---------- 3. Enter the machine ---------- */
slide({
  act: 1, organ: -1, title: 'Enter the body',
  steps: ['Enter the body'],
  html: `
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt()}</svg>
  <div class="abs intro" style="left:140px;top:360px;width:780px;transition:opacity 1s">
    <div class="q" style="font-size:60px">Today, we are going to enter one of the most amazing machines inside <span class="c-warm">your</span> body…</div>
  </div>
  <div class="abs ttl center" style="left:0;right:0;top:380px;opacity:0">
    <div class="kicker">Chapter 9 · Life Processes in Animals</div>
    <div class="h1" style="font-size:124px;margin-top:26px;letter-spacing:.02em">DIGESTION</div>
    <div class="h3 c-mut" style="font-weight:400;margin-top:10px">in Human Beings</div>
  </div>
  <div class="abs flash" style="inset:0;background:radial-gradient(circle at 50% 50%,rgba(70,22,30,.9),rgba(14,3,6,.98) 65%);opacity:0;pointer-events:none"></div>`,
  init(c) { c.svg = c.q('svg.body'); cam(c.svg, -15, 500, 1040); },
  tick(c) {
    const p = c.n >= 1 ? c.stepT : 0;
    const z = ease(seg(p, 0, 3.2));
    const cx = lerp(-15, 300, z), cy = lerp(500, 150, z), h = Math.exp(lerp(Math.log(1040), Math.log(70), z));
    cam(c.svg, cx, cy, h);
    c.q('.intro').style.opacity = c.n >= 1 ? 0 : 1;
    c.q('.flash').style.opacity = f1(seg(p, 2.4, 3.3) * 100) / 100;
    c.q('.ttl').style.opacity = f1(seg(p, 3.2, 4.4) * 100) / 100;
    c.q('.ttl').style.zIndex = 2;
    c.q('.mouthm').setAttribute('stroke-width', f1(3 + 1.5 * Math.sin(c.t * 3)));
  },
  notes: {
    say: 'Look at this body. Inside it is a system that works every single time you eat – without you even thinking about it. We are going to shrink down and travel inside, starting at the mouth.',
    ask: 'Where does the journey of food begin?',
    explain: 'The journey starts in the mouth. This chapter is about digestion in human beings.',
    confusion: '',
    transition: '“But first – why can’t the body simply use food as it is?”'
  }
});

/* ---------- 4. Why break food down? ---------- */
slide({
  act: 1, organ: -1, title: 'Why break food down?',
  steps: ['What is in our food?', 'Can the body use it like this?', 'Break it down', 'Name it'],
  html: `
  <div class="abs" style="left:140px;top:120px"><div class="kicker">The big question</div><div class="h2" style="margin-top:14px">Why can’t the body use food as it is?</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <defs><linearGradient id="gBloodSide" x1="0" x2="1"><stop offset="0" stop-color="#ff5a64" stop-opacity=".0"/><stop offset=".25" stop-color="#ff5a64" stop-opacity=".13"/><stop offset="1" stop-color="#ff5a64" stop-opacity=".06"/></linearGradient></defs>
    <rect x="1240" y="290" width="680" height="640" fill="url(#gBloodSide)"/>
    <g class="wall"></g>
    <g class="mol"></g>
    <g class="fat"></g>
  </svg>
  <div class="lbl r" data-s="1" style="left:180px;top:330px">Carbohydrate<small>(like starch)</small></div>
  <div class="lbl r" data-s="1" style="left:180px;top:560px">Protein</div>
  <div class="lbl r" data-s="1" style="left:180px;top:760px">Fat</div>
  <div class="lbl r" data-s="1" style="left:1290px;top:310px;color:#ffb3b8">Inside the body<small>(blood)</small></div>
  <div class="banner r" data-s="2-2" style="top:950px">Too big and complex to pass into the body</div>
  <div class="banner r" data-s="3-3" style="top:950px">Broken into <span class="c-nut">simpler forms</span> — now they can pass in and be used</div>
  <div class="abs r" data-s="4" style="left:1300px;top:420px;width:560px;padding:34px 38px;border-radius:24px;background:rgba(6,10,16,.85);border:1.5px solid rgba(111,227,214,.4)">
    <div class="kicker">This is called</div><div class="h2" style="margin:12px 0 14px">Digestion</div>
    <div class="sub">Breaking down complex food into <b class="c-nut">simpler forms</b> in the body.</div></div>`,
  init(c) {
    const W = c.q('.wall');
    c.pores = [];
    for (let y = 300; y < 930; y += 60) { el('line', { x1: 1240, y1: y + 14, x2: 1240, y2: y + 60, stroke: 'rgba(255,190,170,.55)', 'stroke-width': 10, 'stroke-linecap': 'round' }, W); c.pores.push(y + 7); }
    const g = c.q('.mol');
    c.carb = new Chain(g, { x: 640, y: 420, n: 12, r: 20, gap: 46, shape: 'hex', colors: ['#f3e6c4'], simple: '#ffd36e', seed: 3, spread: 70, spreadT: 1.6, wave: 22 });
    c.prot = new Chain(g, { x: 640, y: 620, n: 11, r: 19, gap: 44, shape: 'circle', colors: ['#ff8fa3', '#c99bff', '#7fd1ff', '#ffb36b'], simple: null, seed: 8, spread: 70, spreadT: 1.6, wave: 26 });
    c.prot.o.simple = null;
    const fg = c.q('.fat');
    c.big = el('circle', { cx: 640, cy: 820, r: 78, fill: 'url(#gFat)' }, fg);
    const R = rng(11);
    c.fd = []; for (let i = 0; i < 14; i++) { const a = R() * 6.28, d = R() * 70; c.fd.push({ hx: 640 + d * Math.cos(a), hy: 820 + d * Math.sin(a), x: 640, y: 820, e: el('circle', { r: 10, fill: 'url(#gFat)', opacity: 0 }, fg) }); }
    c.all = () => [...c.carb.u, ...c.prot.u];
    c.mig = []; // migration assignments
  },
  step(c, n) {
    c.q('.mol').style.opacity = n >= 1 ? 1 : 0; c.q('.fat').style.opacity = n >= 1 ? 1 : 0;
    c.q('.mol').style.transition = c.q('.fat').style.transition = 'opacity .8s';
    if (n < 3) { // reset to whole molecules
      [c.carb, c.prot].forEach(ch => { ch.l.forEach(l => l.broken = false); ch.regroup(); ch.u.forEach(u => { u.x = u.tx; u.y = u.ty; }); });
      c.fd.forEach(d => { d.x = 640; d.y = 820; }); c.mig = [];
    }
  },
  tick(c, dt) {
    const n = c.n, st = c.stepT;
    const bump = n === 2 ? Math.max(0, Math.sin(Math.min(st, 6) * 1.6)) * 330 * (st < 6 ? 1 : 0) : 0;
    const bx = n === 2 ? Math.min(330, 330 * Math.abs(Math.sin(st * 1.3))) : 0;
    const off = n === 2 ? bx : 0;
    c.q('.mol').setAttribute('transform', `translate(${f1(off)},0)`);
    c.q('.fat').setAttribute('transform', `translate(${f1(off)},0)`);
    const T = n >= 3 ? { 1: st } : {};
    c.carb.update(dt, T, c.t); c.prot.update(dt, T, c.t);
    // fat splits
    const fs = n >= 3 ? eout(seg(st, .3, 1.8)) : 0;
    c.big.setAttribute('r', f1(78 * (1 - fs)));
    c.fd.forEach(d => { if (n < 3) { d.e.setAttribute('opacity', 0); return; } d.e.setAttribute('opacity', 1); });
    // migration through pores after breaking
    if (n >= 3 && st > 2.6) {
      if (!c.mig.length) {
        const R = rng(5); const units = [...c.carb.u, ...c.prot.u];
        units.forEach((u, i) => c.mig.push({ o: u, pore: c.pores[i % c.pores.length], d: R() * 2.2, fx: 1330 + R() * 520, fy: 320 + R() * 580, ph: 0 }));
        c.fd.forEach((u, i) => c.mig.push({ o: u, pore: c.pores[(i * 3 + 1) % c.pores.length], d: R() * 2.2, fx: 1330 + R() * 520, fy: 320 + R() * 580, fat: 1 }));
      }
      c.mig.forEach(m => {
        const tt = st - 2.6 - m.d; if (tt < 0) return;
        const u = m.o;
        if (tt < 1.4) { u.tx = 1240; u.ty = m.pore; } else { u.tx = m.fx; u.ty = m.fy; }
        if (m.fat) { const k = 1 - Math.exp(-dt * 1.6); u.x += (u.tx - u.x) * k; u.y += (u.ty - u.y) * k; }
      });
    }
    c.fd.forEach(d => {
      if (n >= 3 && !(c.mig.length && st > 2.6)) { d.x = lerp(640, d.hx, fs); d.y = lerp(820, d.hy, fs); }
      d.e.setAttribute('cx', f1(d.x)); d.e.setAttribute('cy', f1(d.y));
    });
    if (n >= 3) c.prot.u.forEach(u => { if (u.free) u.e.setAttribute('stroke', 'rgba(255,255,255,.7)'); });
  },
  notes: {
    say: 'Our food contains complex components – carbohydrates like starch, proteins and fats. These are big, complicated substances. Imagine trying to push a whole chapati through the wall of a blood vessel! It cannot pass. The body must first break them down into simpler, smaller forms.',
    ask: 'Why do you think the body needs to break food into tiny pieces before using it?',
    explain: 'Breaking down complex food components into simpler forms in the body is called DIGESTION. Only these simpler forms can pass into the blood and be used by the body.',
    confusion: 'Students think “digestion” only means food getting crushed. Crushing helps, but true digestion means changing complex substances into simpler ones.',
    transition: '“So where does this breaking down happen? In a very long tube. Let us look at it.”'
  }
});

/* ---------- 5. Alimentary canal ---------- */
const CANAL_LABELS = [
  ['Mouth', 300, 150, 1], ['Oesophagus (food pipe)', 304, 282, 1], ['Stomach', 425, 470, 1], ['Small intestine', 250, 750, -1],
  ['Large intestine', 424, 720, 1], ['Rectum', 312, 892, -1], ['Anus', 302, 948, 1]];
slide({
  act: 1, title: 'The alimentary canal',
  steps: ['Trace the path of food', 'Meet the two helpers'],
  organ: c => c.n >= 1 ? 'all' : -1,
  html: () => `
  <div class="abs" style="left:120px;top:150px;width:660px">
    <div class="kicker">The route</div>
    <div class="h2" style="margin:16px 0 22px">One long tube</div>
    <div class="sub r" data-s="1">Food travels from the <b style="color:#fff">mouth</b> to the <b style="color:#fff">anus</b> through the</div>
    <div class="key r c-nut" data-s="1" style="margin-top:14px">alimentary canal</div>
    <div class="sub r" data-s="2" style="margin-top:46px">Two helpers are <b style="color:#fff">not</b> part of the tube, but send juices into it:</div>
    <div class="key2 r" data-s="2" style="margin-top:14px"><span class="c-blood" style="color:#d9826b">Liver</span> &nbsp;·&nbsp; <span class="c-panc">Pancreas</span></div>
  </div>
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt({ track: true })}
    <g class="lbls">${CANAL_LABELS.map(([t, x, y, s], i) => {
      const lx = s > 0 ? 610 : -10;
      return `<g class="cl" data-i="${i}" opacity="0"><path d="M${x},${y} L${s > 0 ? x + 20 : x - 20},${y} L${lx},${y}" stroke="rgba(255,255,255,.45)" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y}" r="4" fill="#fff"/>
      <text x="${s > 0 ? lx + 10 : lx - 10}" y="${y + 11}" font-size="32" font-weight="600" fill="#fff" text-anchor="${s > 0 ? 'start' : 'end'}">${t}</text></g>`;
    }).join('')}
    <g class="hl" opacity="0">
      <path d="M215,420 L-10,420" stroke="#d9826b" stroke-width="1.6"/><circle cx="215" cy="420" r="4" fill="#d9826b"/><text x="-20" y="431" font-size="32" font-weight="700" fill="#e79a80" text-anchor="end">Liver</text>
      <path d="M380,568 L610,568" stroke="#f5d06b" stroke-width="1.6"/><circle cx="380" cy="568" r="4" fill="#f5d06b"/><text x="620" y="579" font-size="32" font-weight="700" fill="#f5d06b">Pancreas</text>
    </g></g>
  </svg>`,
  init(c) { c.svg = c.q('svg.body'); cam(c.svg, 117, 487, 1120); c.trk = new Track(c.svg, BODY.TRACK); c.bol = el('circle', { r: 9, fill: 'url(#gGold)' }, c.q('.fx')); c.bol2 = el('circle', { r: 4, fill: '#fff4cf' }, c.q('.fx')); },
  step(c, n) {
    dimOrgans(c, n >= 2 ? ['liver', 'panc', 'gall'] : null);
    c.q('.duct').style.opacity = n >= 2 ? 1 : .5;
  },
  tick(c) {
    const n = c.n, st = c.stepT;
    const s = n >= 1 ? 7 * ease(seg(st, .2, 7.5)) : 0;
    setTrackReveal(c, s);
    c.qa('.cl').forEach((g, i) => g.setAttribute('opacity', n >= 1 && s > i + .25 ? 1 : 0));
    c.q('.hl').setAttribute('opacity', n >= 2 ? 1 : 0);
    const vis = n >= 1 && s < 6.98;
    const p = c.trk.pt(Math.min(s, 6.99));
    [c.bol, c.bol2].forEach(b => { setA(b, { cx: f1(p[0]), cy: f1(p[1]), opacity: vis ? 1 : 0 }); });
  },
  notes: {
    say: 'From the mouth to the anus, our food travels through one long, continuous tube called the alimentary canal. Watch the path: mouth, food pipe or oesophagus, stomach, small intestine, large intestine, rectum and finally the anus.',
    ask: 'Point to where you think your stomach is on your own body. (Most will point to the belly button – it is actually higher and to the left.)',
    explain: 'Digestive juices are poured into this canal at different places. The liver and the pancreas are associated with the canal – food does not pass through them, but they send their juices into the small intestine.',
    confusion: 'Food does NOT pass through the liver or pancreas. Also, the stomach is not in the middle of the belly – it sits in the upper left of the abdomen.',
    transition: '“Now, let us follow our bite from the very first step – the mouth.”'
  }
});

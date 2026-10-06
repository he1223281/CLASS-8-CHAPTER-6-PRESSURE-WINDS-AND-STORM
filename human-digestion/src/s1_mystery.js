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
const LUNG_L = 'M-10,-240 C-48,-250 -90,-214 -94,-160 C-97,-118 -86,-98 -56,-102 C-28,-106 -14,-130 -10,-172 Z';
slide({
  act: 1, organ: -1, title: 'Life processes',
  steps: ['Show the life processes', 'Which one begins with food?'],
  html: () => `
  <div class="abs" style="left:120px;top:110px"><div class="kicker">Before we begin</div><div class="h2" style="margin-top:14px">Every living being must…</div></div>
  <svg class="abs fig" style="left:650px;top:140px;width:620px;height:930px" viewBox="-300 -420 600 880">
    <defs><radialGradient id="gLung" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffb0b4"/><stop offset=".6" stop-color="#e06878"/><stop offset="1" stop-color="#8a2a40"/></radialGradient>
      <radialGradient id="gKid" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#d77a6a"/><stop offset="1" stop-color="#6e2420"/></radialGradient></defs>
    <circle class="aura" cx="0" cy="-80" r="320" fill="url(#gTeal)" opacity=".07"/>
    ${txImg('fig')}
    <g class="sys sKid"><path d="M0,40 m-14,0 a14,12 0 1,0 28,0 a14,12 0 1,0 -28,0" fill="#e8c46a"/>
      <path d="M-44,-70 C-40,-30 -20,10 -6,34 M44,-70 C40,-30 20,10 6,34" stroke="#e8c46a" stroke-width="3" fill="none"/>
      <ellipse cx="-48" cy="-88" rx="17" ry="27" transform="rotate(12 -48 -88)" fill="url(#gKid)"/><ellipse cx="48" cy="-88" rx="17" ry="27" transform="rotate(-12 48 -88)" fill="url(#gKid)"/></g>
    <g class="sys sLung"><path d="${LUNG_L}" fill="url(#gLung)"/><path d="${LUNG_L}" transform="scale(-1,1)" fill="url(#gLung)"/>
      <path d="M0,-300 L0,-250 M0,-250 C-6,-238 -14,-226 -24,-214 M0,-250 C6,-238 14,-226 24,-214" stroke="#f3c9c9" stroke-width="7" fill="none" stroke-linecap="round"/></g>
    <g class="sys sCirc">${BRANCH.map(b => `<path d="${TRUNK + b}" fill="none" stroke="#ff4f5e" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join('')}
      <path class="heart" d="M12,-130 C-14,-150 -20,-176 -4,-186 C6,-192 14,-184 16,-178 C20,-188 34,-190 40,-178 C48,-160 32,-142 12,-130 Z" fill="#d23446"/><g class="cdots"></g></g>
    <g class="sys sDig"><g transform="translate(0,-280) scale(.6,.53) translate(-300,-182)">${['oes', 'liver', 'stom', 'duo', 'panc', 'gall', 'liB', 'rec', 'si', 'liA'].map(k => txImg(k)).join('')}</g></g>
  </svg>
  <div class="card r lp1" data-s="1" style="left:120px;top:330px;width:560px;transition-delay:.1s"><div class="ct c-warm">NUTRITION</div><div class="cd">getting and using food</div></div>
  <div class="card r lp2" data-s="1" style="left:1240px;top:330px;width:560px;transition-delay:1.8s"><div class="ct" style="color:#ff9aa8">RESPIRATION</div><div class="cd">releasing energy from food</div></div>
  <div class="card r lp3" data-s="1" style="left:120px;top:540px;width:560px;transition-delay:3.5s"><div class="ct c-blood">CIRCULATION</div><div class="cd">carrying materials around the body</div></div>
  <div class="card r lp4" data-s="1" style="left:1240px;top:540px;width:560px;transition-delay:5.2s"><div class="ct" style="color:#e8c46a">EXCRETION</div><div class="cd">removing wastes from the body</div></div>
  <div class="card r lp5" data-s="1" style="left:120px;top:750px;width:560px;transition-delay:6.9s"><div class="ct" style="color:#d9a6ff">REPRODUCTION</div><div class="cd">producing young ones</div></div>
  <div class="abs r" data-s="1" style="left:1240px;top:770px;width:600px;transition-delay:8.4s"><div class="sub">These <b style="color:#fff">life processes</b> help living beings <b style="color:#fff">survive</b>.</div></div>
  <div class="banner r" data-s="2" style="top:960px">Today: <span class="c-warm">NUTRITION</span> — what happens to the food we eat</div>`,
  init(c) {
    c.sys = ['.sDig', '.sLung', '.sCirc', '.sKid'].map(k => c.q(k));
    c.paths = BRANCH.map(b => { const p = el('path', { d: TRUNK + b, fill: 'none', stroke: 'none' }, c.q('.cdots')); return [p, p.getTotalLength()]; });
    c.dots = Array.from({ length: 30 }, (_, i) => ({ b: i % 5, o: i / 30, e: dotEl(c.q('.cdots'), 6, 'url(#gRed)') }));
  },
  step(c, n) {
    ['.lp2', '.lp3', '.lp4', '.lp5'].forEach(s => { c.q(s).style.opacity = n >= 2 ? .3 : ''; });
    const l1 = c.q('.lp1'); l1.style.borderColor = n >= 2 ? 'rgba(255,184,107,.8)' : ''; l1.style.boxShadow = n >= 2 ? '0 0 50px rgba(255,184,107,.35)' : '';
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const act = n === 1 ? (st < 8.5 ? Math.floor((st - .1) / 1.7) : 9) : n >= 2 ? 0 : -1;
    c.sys.forEach((g, i) => {
      const on = act === i || (act === 9) ? 1 : 0;
      const op = n === 0 ? .22 : act === 9 ? .75 : on ? 1 : .12;
      g.style.transition = 'opacity .7s, filter .7s'; g.style.opacity = op;
      g.style.filter = on && act !== 9 ? 'drop-shadow(0 0 12px rgba(255,220,180,.55))' : 'none';
    });
    c.q('.aura').setAttribute('opacity', act === 4 ? .22 : .07);
    const br = 1 + .045 * Math.sin(t * 1.6);
    c.q('.sLung').setAttribute('transform', `translate(0,-170) scale(${f1(br * 1000) / 1000}) translate(0,170)`);
    const hb = 1 + .08 * Math.max(0, Math.sin(t * 7)) * (Math.sin(t * 3.5) > 0 ? 1 : 0);
    c.q('.heart').setAttribute('transform', `translate(14,-160) scale(${f1(hb * 1000) / 1000}) translate(-14,160)`);
    c.dots.forEach(d => { const [p, L] = c.paths[d.b], ph = (t * .18 + d.o) % 1, q = p.getPointAtLength(ph * L); setA(d.e, { cx: f1(q.x), cy: f1(q.y) }); });
  },
  notes: {
    say: 'You learnt in Grade 6 that all living beings carry out some basic processes to stay alive. Watch the body as I name each one: nutrition (the digestive system), respiration (the lungs), circulation (the heart and blood vessels), excretion (the kidneys) and reproduction. Together we call them life processes.',
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
const W4 = { wall: 1120, ww: 96, vx: 1300, vw: 190, lanes: [420, 610, 800] };
slide({
  act: 1, organ: -1, title: 'Why break food down?',
  steps: ['What is in our food?', 'Can it get into the body?', 'Break it down', 'Name it'],
  html: () => {
    let cells = '';
    for (let y = 250, k = 0; y < 1000; y += 70, k++) cells += `<g transform="translate(${W4.wall},${y})"><rect x="2" y="2" width="${W4.ww - 4}" height="64" rx="18" fill="url(#gCell)" stroke="#a8485a" stroke-width="2.5"/><ellipse cx="${W4.ww / 2 + (k % 2 ? 8 : -6)}" cy="34" rx="13" ry="10" fill="#8a3456" opacity=".75"/></g>`;
    return `
  <div class="abs" style="left:120px;top:96px;width:1150px"><div class="kicker">The big question</div><div class="h2" style="margin-top:12px;font-size:56px">Why can’t the body use food as it is?</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <defs><linearGradient id="gCell" x1="0" x2="1"><stop offset="0" stop-color="#e6838f"/><stop offset=".5" stop-color="#f7b3b3"/><stop offset="1" stop-color="#d9707f"/></linearGradient>
      <linearGradient id="gVes" x1="0" x2="1"><stop offset="0" stop-color="#5a0d18"/><stop offset=".5" stop-color="#9c1f30"/><stop offset="1" stop-color="#5a0d18"/></linearGradient></defs>
    <rect x="${W4.vx}" y="230" width="${W4.vw}" height="850" fill="url(#gVes)"/>
    <path d="M${W4.vx},230 L${W4.vx},1080 M${W4.vx + W4.vw},230 L${W4.vx + W4.vw},1080" stroke="#ff8a96" stroke-width="10" opacity=".55"/>
    <g class="rbc"></g>
    <g class="cells">${cells}</g>
    <g class="mol"></g><g class="fat"></g><g class="bumps"></g>
  </svg>
  <div class="lbl" style="left:${W4.wall - 60}px;top:206px;font-size:26px;color:#ffc9bd">intestine wall</div>
  <div class="lbl" style="left:${W4.vx + 40}px;top:206px;font-size:26px;color:#ff8a96">blood</div>
  <div class="lbl r" data-s="1" style="left:120px;top:395px;font-size:32px">Carbohydrate<small>(like starch)</small></div>
  <div class="lbl r" data-s="1" style="left:120px;top:590px;font-size:32px">Protein</div>
  <div class="lbl r" data-s="1" style="left:120px;top:780px;font-size:32px">Fat</div>
  <div class="abs" style="left:1530px;top:330px;width:350px">
    <div class="r" data-s="2-2"><div class="key2" style="font-size:36px">Too big!</div><div class="sub" style="font-size:30px">Big, complex food cannot pass into the blood.</div></div>
    <div class="r" data-s="3-3"><div class="key2 c-nut" style="font-size:36px">Broken down</div><div class="sub" style="font-size:30px">Small, simple pieces pass through the wall into the blood.</div></div>
    <div class="r" data-s="4" style="padding:26px 26px;border-radius:22px;background:rgba(6,10,16,.85);border:1.5px solid rgba(111,227,214,.45)">
      <div class="kicker">This is called</div><div class="h3" style="margin:10px 0">Digestion</div>
      <div class="sub" style="font-size:29px">Breaking down complex food into <b class="c-nut">simpler forms</b> in the body.</div></div>
  </div>`;
  },
  init(c) {
    const g = c.q('.mol');
    c.carb = new Chain(g, { x: 640, y: W4.lanes[0], n: 11, r: 20, gap: 44, shape: 'hex', colors: ['#f3e6c4'], simple: '#ffd36e', seed: 3, spread: 70, spreadT: 1.4, wave: 18, jit: 2 });
    c.prot = new Chain(g, { x: 640, y: W4.lanes[1], n: 11, r: 18, gap: 42, shape: 'circle', colors: ['#ff8fa3', '#c99bff', '#7fd1ff', '#ffb36b', '#9be38f'], seed: 8, spread: 70, spreadT: 1.4, wave: 24, jit: 2 });
    c.cg = [c.carb.g, c.prot.g];
    const fg = c.q('.fat'), R = rng(11);
    c.big = el('circle', { cx: 640, cy: W4.lanes[2], r: 80, fill: 'url(#gFat)' }, fg);
    c.fd = Array.from({ length: 14 }, () => { const a = R() * 6.28, d = 20 + R() * 70; return { hx: 640 + d * Math.cos(a), hy: W4.lanes[2] + d * Math.sin(a) * .7, x: 640, y: W4.lanes[2], e: el('circle', { r: 11, fill: 'url(#gFat)', opacity: 0 }, fg), glow: el('circle', { r: 0, opacity: 0 }, fg) }; });
    c.rbc = Array.from({ length: 24 }, (_, i) => { const gg = el('g', {}, c.q('.rbc')); el('ellipse', { rx: 26, ry: 16, fill: '#d42a3c' }, gg); el('ellipse', { rx: 13, ry: 7, fill: '#9c1426' }, gg); return { g: gg, x: W4.vx + 30 + R() * (W4.vw - 60), o: R(), rot: R() * 40 - 20 }; });
    c.bumps = [0, 1, 2].map(i => el('circle', { cx: W4.wall, cy: W4.lanes[i], r: 10, fill: 'none', stroke: '#ffd36e', 'stroke-width': 4, opacity: 0 }, c.q('.bumps')));
    const all = [...c.carb.u, ...c.prot.u, ...c.fd];
    c.mig = all.map((u, i) => ({ u, d: (i * .37) % 4.2, vx: W4.vx + 30 + R() * (W4.vw - 60), lane: i < c.carb.u.length ? 0 : i < c.carb.u.length + c.prot.u.length ? 1 : 2, jy: (R() - .5) * 60 }));
  },
  step(c, n) {
    const show = n >= 1;
    [c.q('.mol'), c.q('.fat')].forEach(e => { e.style.transition = 'opacity .8s'; e.style.opacity = show ? 1 : 0; });
    if (n < 3) {
      [c.carb, c.prot].forEach(ch => { ch.l.forEach(l => l.broken = false); ch.regroup(); ch.u.forEach(u => { u.x = u.tx; u.y = u.ty; u.e.setAttribute('opacity', 1); u.glow.setAttribute('opacity', 0); }); });
      c.fd.forEach(d => { d.x = 640; d.y = W4.lanes[2]; d.e.setAttribute('opacity', 0); });
      c.big.setAttribute('r', 80);
    }
  },
  tick(c, dt) {
    const n = c.n, st = c.stepT, t = c.t;
    // blood flows down continuously
    c.rbc.forEach(r => { const y = 200 + ((t * .09 + r.o) % 1) * 920; r.g.setAttribute('transform', `translate(${f1(r.x)},${f1(y)}) rotate(${f1(r.rot + 20 * Math.sin(t + r.o * 9))})`); });
    // bump against the wall
    const amps = [W4.wall - (640 + 5 * 44 + 22), W4.wall - (640 + 5 * 42 + 20), W4.wall - (640 + 82)];
    const bump = n === 2 ? Math.abs(Math.sin(st * 1.5)) : 0;
    c.cg.forEach((g, i) => g.setAttribute('transform', `translate(${f1(amps[i] * bump)},0)`));
    c.q('.fat').setAttribute('transform', `translate(${f1(n === 2 ? amps[2] * bump : 0)},0)`);
    c.bumps.forEach(b => { const k = n === 2 && bump > .97 ? 1 : 0; b.setAttribute('opacity', k ? .9 : 0); b.setAttribute('r', k ? 18 + 10 * Math.random() : 10); });
    if (n < 3) { c.carb.update(dt, {}, t); c.prot.update(dt, {}, t); c.fd.forEach(d => d.e.setAttribute('opacity', 0)); return; }
    // break apart
    const T = { 1: st };
    const fs = eout(seg(st, .2, 1.6));
    c.big.setAttribute('r', f1(80 * (1 - fs)));
    if (st < 2.2) {
      c.carb.update(dt, T, t); c.prot.update(dt, T, t);
      c.fd.forEach(d => { d.x = lerp(640, d.hx, fs); d.y = lerp(W4.lanes[2], d.hy, fs); setA(d.e, { cx: f1(d.x), cy: f1(d.y), opacity: fs > 0 ? 1 : 0 }); });
      return;
    }
    if (!c.homes) c.homes = c.mig.map(m => [m.u.x, m.u.y]);
    [c.carb, c.prot].forEach(ch => { ch.l.forEach(l => l.broken = true); });
    // loop: home -> wall -> through -> blood -> respawn
    c.mig.forEach((m, i) => {
      const per = 6.5, tt = ((st - 2.2 - m.d) % per + per) % per, [hx, hy] = c.homes[i], ly = W4.lanes[m.lane] + m.jy;
      let x = hx, y = hy, o = 1;
      if (st - 2.2 < m.d) { x = hx; y = hy; }
      else if (tt < 1.5) { const k = ease(tt / 1.5); x = lerp(hx, W4.wall - 6, k); y = lerp(hy, ly, k); }
      else if (tt < 2.3) { const k = (tt - 1.5) / .8; x = lerp(W4.wall - 6, m.vx, ease(k)); y = ly; }
      else if (tt < 5.2) { const k = (tt - 2.3) / 2.9; x = m.vx + 8 * Math.sin(tt * 3); y = ly + k * (1060 - ly); o = 1 - Math.max(0, k - .8) * 5; }
      else { const k = (tt - 5.2) / 1.3; x = hx; y = hy; o = ease(k); }
      m.u.x = x; m.u.y = y;
      if (m.lane === 2) setA(m.u.e, { cx: f1(x), cy: f1(y), opacity: f1(clamp(o) * 100) / 100 });
      else { m.u.e.setAttribute('opacity', f1(clamp(o) * 100) / 100); m.u.glow.setAttribute('opacity', f1(clamp(o) * .8 * 100) / 100); }
    });
    c.carb.draw(t); c.prot.draw(t);
  },
  notes: {
    say: 'Our food contains complex components – carbohydrates like starch, proteins and fats. These are big, complicated substances. Watch them try to get through the wall of the intestine into the blood – they simply cannot pass! (Click) But when they are broken into small, simple pieces, those pieces can pass through the wall and the blood carries them away.',
    ask: 'Why do you think the body needs to break food into tiny pieces before using it?',
    explain: 'Breaking down complex food components into simpler forms in the body is called DIGESTION. Only these simpler forms can pass into the blood and be used by the body.',
    confusion: 'Students think “digestion” only means food getting crushed. Crushing helps, but true digestion means changing complex substances into simpler ones.',
    transition: '“So where does this breaking down happen? In a very long tube. Let us look at it.”'
  }
});

/* ---------- 5. Alimentary canal ---------- */
const CANAL_LABELS = [
  ['Mouth', 300, 150, 1], ['Oesophagus (food pipe)', 300, 290, 1], ['Stomach', 405, 455, 1], ['Small intestine', 250, 690, -1],
  ['Large intestine', 432, 640, 1], ['Rectum', 297, 805, -1], ['Anus', 297, 846, 1]];
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
      <path d="M215,450 L-10,450" stroke="#d9826b" stroke-width="1.6"/><circle cx="215" cy="450" r="4" fill="#d9826b"/><text x="-20" y="461" font-size="32" font-weight="700" fill="#e79a80" text-anchor="end">Liver</text>
      <path d="M380,512 L610,512" stroke="#f5d06b" stroke-width="1.6"/><circle cx="380" cy="512" r="4" fill="#f5d06b"/><text x="620" y="523" font-size="32" font-weight="700" fill="#f5d06b">Pancreas</text>
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

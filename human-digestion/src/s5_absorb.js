/* ===================== ACT 4 · THE ABSORPTION ===================== */

/* ---------- 20. The question ---------- */
slide({
  act: 4, organ: 3, title: 'How does the body USE it?',
  steps: ['Ask the big question'],
  html: `
  <svg class="full" viewBox="0 0 1920 1080"><g class="tun"></g><g class="nut"></g>
    <circle cx="960" cy="560" r="900" fill="url(#gVig)"/></svg>
  <div class="abs center" style="left:0;right:0;top:330px">
    <div class="h2 r" data-s="0">The food has been digested.</div>
    <div class="q r" data-s="1" style="margin-top:50px;font-size:72px">But how does your body actually <span class="c-nut" style="font-style:normal;font-weight:700">USE</span> it?</div>
  </div>`,
  init(c) {
    const g = c.q('.tun'); c.rings = [];
    for (let i = 0; i < 16; i++) {
      const p = el('path', { fill: 'none', stroke: '#e79a8f', 'stroke-width': 3 }, g);
      c.rings.push({ p, o: i / 16 });
    }
    const R = rng(8), ng = c.q('.nut'); c.nu = [];
    const fills = ['url(#gGold)', 'url(#gRed)', 'url(#gGold)', 'url(#gTeal)'];
    for (let i = 0; i < 60; i++) c.nu.push({ a: R() * 6.28, o: R(), rr: .2 + R() * .7, e: dotEl(ng, 8, fills[i % 4], { opacity: 0 }) });
  },
  tick(c) {
    const t = c.t, cx = 960, cy = 560;
    c.rings.forEach(r => {
      const z = (r.o + t * .06) % 1, R0 = 30 * Math.pow(45, z);
      const pts = []; for (let k = 0; k <= 72; k++) { const a = k / 72 * 6.283, b = 1 + .05 * Math.sin(a * 18 + z * 20); pts.push([cx + R0 * b * Math.cos(a), cy + R0 * b * .78 * Math.sin(a)]); }
      setA(r.p, { d: smoothPath(pts), 'stroke-opacity': f1(Math.min(1, z * 1.6) * (1 - Math.pow(z, 6)) * .7 * 100) / 100, 'stroke-width': f1(1 + z * 14) });
    });
    c.nu.forEach(n => { const z = (n.o + t * .07) % 1, R0 = 30 * Math.pow(40, z) * n.rr; setA(n.e, { cx: f1(cx + R0 * Math.cos(n.a)), cy: f1(cy + R0 * .78 * Math.sin(n.a)), r: f1(3 + z * 16), opacity: f1(Math.min(1, z * 3) * (1 - z) * 100) / 100 }); });
  },
  notes: {
    say: 'We are now travelling inside the small intestine. All around us is digested food – simple sugars and other simple forms of nutrients. (Click.) But here is the big question: the food is still inside this tube. How does it actually get to your brain, your muscles, your bones?',
    ask: 'Your legs need energy from your lunch. How do you think the food gets from your intestine to your legs?',
    explain: 'Collect ideas. Many students will say “blood” – good! Now we will see exactly how it enters the blood.',
    confusion: 'Some think food simply disappears or stays in the stomach. Nothing disappears – useful nutrients are moved into the blood.',
    transition: '“Let us zoom into the wall of the small intestine.”'
  }
});

/* ---------- 21. Finger-like projections & absorption ---------- */
const VX = [230, 480, 730, 980, 1230], VB = 975, VT = 430, VW = 92;
const villusPath = x => `M${x - VW},${VB} L${x - VW},${VT + 90} C${x - VW},${VT - 10} ${x + VW},${VT - 10} ${x + VW},${VT + 90} L${x + VW},${VB}`;
const capPath = x => `M${x - 46},${VB + 20} L${x - 46},${VT + 110} C${x - 46},${VT + 40} ${x + 46},${VT + 40} ${x + 46},${VT + 110} L${x + 46},${VB + 20}`;
slide({
  act: 4, organ: 3, title: 'Finger-like projections: absorption',
  steps: ['Look closer', 'Why so many?', 'Nutrients pass into the blood', 'What do scientists call them?'],
  html: `
  <svg class="full" viewBox="0 0 1920 1080">
    <defs><linearGradient id="gVil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9606c"/><stop offset=".45" stop-color="#f0a29b"/><stop offset="1" stop-color="#c9606c"/></linearGradient></defs>
    <g class="lvA"></g>
    <g class="lvB" opacity="0">
      <path d="M60,${VB + 20} L1400,${VB + 20}" stroke="#7a1020" stroke-width="40" stroke-linecap="round"/>
      <path class="vessel" d="M60,${VB + 20} L1400,${VB + 20}" stroke="#ff4f5e" stroke-width="30" stroke-linecap="round"/>
      ${VX.map(x => `<path d="${villusPath(x)} Z" fill="url(#gVil)"/><path d="${capPath(x)}" fill="none" stroke="#ff4f5e" stroke-width="12" stroke-linecap="round" opacity=".9"/>
        ${[0, 1, 2, 3, 4, 5].map(k => `<path d="M${x - 46},${VT + 160 + k * 70} C${x - 15},${VT + 140 + k * 70} ${x + 15},${VT + 195 + k * 70} ${x + 46},${VT + 175 + k * 70}" fill="none" stroke="#ff7a84" stroke-width="5" opacity=".7"/>`).join('')}
        <path d="${villusPath(x)}" fill="none" stroke="#ffd3cc" stroke-width="16" stroke-opacity=".7"/><path d="${villusPath(x)}" fill="none" stroke="#a0404e" stroke-width="16" stroke-dasharray="2 20" stroke-opacity=".55"/>`).join('')}
      <g class="nuts"></g>
      <g class="scale"><path d="M1290,${VT - 20} L1290,${VT + 240}" stroke="#fff" stroke-width="4"/><path d="M1275,${VT - 20} L1305,${VT - 20} M1275,${VT + 240} L1305,${VT + 240}" stroke="#fff" stroke-width="4"/>
        <text x="1316" y="${VT + 120}" font-size="30" font-weight="600" fill="#fff">0.5 mm</text></g>
    </g>
  </svg>
  <div class="lbl lA" style="left:120px;top:760px;font-size:30px;color:#ffc9bd">inner lining of the small intestine</div>
  <div class="lbl r" data-s="3" style="left:1180px;top:1010px;font-size:28px;color:#ff8a92">blood → to the whole body</div>
  <div class="abs" style="left:1440px;top:120px;width:440px">
    <div class="kicker">The inner lining</div>
    <div class="h3" style="margin:12px 0 20px;font-size:50px">Thousands of <span class="c-warm">finger-like projections</span></div>
    <div class="r" data-s="1"><div class="sub" style="font-size:31px">The lining is <b style="color:#fff">thin</b>, with blood vessels just inside.</div></div>
    <div class="r" data-s="2" style="margin-top:22px"><div class="sub" style="font-size:31px">They give a <b style="color:#fff">huge surface</b> for absorption.</div>
      <svg viewBox="0 0 440 210" style="width:440px;height:210px;margin-top:10px;overflow:visible">
        <path class="fl" d="M10,40 L430,40" stroke="#ffd36e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <text x="10" y="20" font-size="22" fill="#93a1ae">flat</text>
        <path class="fo" d="M10,190 ${[0, 1, 2, 3, 4, 5].map(k => `L${10 + k * 70},90 C${10 + k * 70},60 ${45 + k * 70},60 ${45 + k * 70},90 L${45 + k * 70},190 L${80 + k * 70},190`).join(' ')}" stroke="#ffd36e" stroke-width="6" fill="none" stroke-linejoin="round"/>
        <text x="10" y="80" font-size="22" fill="#93a1ae">with projections</text></svg></div>
    <div class="r" data-s="3" style="margin-top:14px"><div class="sub" style="font-size:31px">Digested nutrients pass into the <b class="c-blood">blood</b>.</div></div>
    <div class="r" data-s="4" style="margin-top:24px"><div class="term">Scientific term: <b>Villi</b></div>
      <div class="small" style="margin-top:12px">This is called <b style="color:#fff">absorption</b>.</div></div>
  </div>`,
  init(c) {
    const A = c.q('.lvA'), R = rng(12);
    let d = '';
    for (let i = 0; i < 64; i++) {
      const x = 60 + i * 21.5, base = 900 + 18 * Math.sin(i * .35), h = 110 + R() * 50;
      d += `<path d="M${f1(x - 9)},${f1(base)} L${f1(x - 9)},${f1(base - h + 9)} Q${f1(x)},${f1(base - h - 6)} ${f1(x + 9)},${f1(base - h + 9)} L${f1(x + 9)},${f1(base)} Z" fill="url(#gVil)" stroke="#a0404e" stroke-width="1.5"/>`;
    }
    A.innerHTML = `<path d="M40,${930} C500,890 1000,950 1460,910 L1460,1080 L40,1080 Z" fill="#c9606c"/>` + d;
    c.fl = c.q('.fl'); c.fo = c.q('.fo'); c.flL = c.fl.getTotalLength(); c.foL = c.fo.getTotalLength();
    // nutrient particles
    const g = c.q('.nuts'); c.np = [];
    const fills = ['url(#gGold)', 'url(#gRed)', 'url(#gTeal)'];
    for (let i = 0; i < 54; i++) {
      const k = i % 5, x = VX[k], side = R() < .5 ? -1 : 1, ty = VT + 120 + R() * 420;
      const cap = el('path', { d: capPath(x), fill: 'none', stroke: 'none' }, g);
      c.np.push({ e: dotEl(g, 9, fills[i % 3], { opacity: 0 }), sx: 100 + R() * 1300, sy: 130 + R() * 230, tx: x + side * (VW + 10), ty, cx: x + side * 46, side, cap, capL: cap.getTotalLength(), off: R() * 7, per: 7 });
    }
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const z = n >= 1 ? ease(seg(n === 1 ? st : 60, 0, 1.8)) : 0;
    c.q('.lvA').setAttribute('transform', `translate(760,880) scale(${f1((1 + 3 * z) * 100) / 100}) translate(-760,-880)`);
    c.q('.lvA').setAttribute('opacity', f1((1 - z) * 100) / 100);
    c.q('.lA').style.opacity = 1 - z;
    c.q('.lvB').setAttribute('opacity', f1(z * 100) / 100);
    c.q('.lvB').setAttribute('transform', `translate(760,880) scale(${f1((.55 + .45 * z) * 1000) / 1000}) translate(-760,-880)`);
    // surface comparison drawing
    const dr = n >= 2 ? (n === 2 ? st : 60) : 0, sp = 240;
    c.fl.setAttribute('stroke-dasharray', `${f1(Math.min(c.flL, dr * sp))} 9999`);
    c.fo.setAttribute('stroke-dasharray', `${f1(Math.min(c.foL, dr * sp))} 9999`);
    // absorption
    c.np.forEach(p => {
      if (n < 3) { p.e.setAttribute('opacity', 0); return; }
      const tt = ((n === 3 ? st : st + 8) + p.off) % p.per;
      let x, y, o = 1;
      if (tt < 2.6) { const k = ease(tt / 2.6); x = lerp(p.sx, p.tx, k) + 20 * Math.sin(tt * 2 + p.off); y = lerp(p.sy, p.ty, k); o = Math.min(1, tt * 2); }
      else if (tt < 3.2) { const k = ease((tt - 2.6) / .6); x = lerp(p.tx, p.cx, k); y = p.ty; }
      else if (tt < 5.2) { const k = ein((tt - 3.2) / 2); x = p.cx; y = lerp(p.ty, VB + 20, k); }
      else { const k = (tt - 5.2) / 1.8; x = lerp(p.cx, 1440, k); y = VB + 20; o = 1 - Math.max(0, k - .7) * 3; }
      setA(p.e, { cx: f1(x), cy: f1(y), opacity: f1(clamp(o) * 100) / 100 });
    });
    c.q('.vessel').setAttribute('stroke', mix('#ff4f5e', '#ff7a84', .5 + .5 * Math.sin(t * 3)));
  },
  notes: {
    say: 'Here is the inner lining of the small intestine. It is not smooth! It is covered with thousands of tiny finger-like projections. (Click) Let us zoom into a few of them. The lining is very thin, and just inside each projection are tiny blood vessels. (Click) Why so many projections? Look – the flat line and the folded line cover the same width, but the folded one is much longer. More surface means more nutrients can be absorbed. (Click) Now watch the digested nutrients: they pass through the thin lining into the blood vessels, and the blood carries them away.',
    ask: 'Why do you think a towel has so many tiny loops instead of being smooth like plastic? (More surface to soak up water.) How is the intestine similar?',
    explain: 'The digested nutrients pass from the small intestine into the blood present in blood vessels in its walls. This is called absorption of nutrients. The finger-like projections (villi) increase the surface area for efficient absorption.',
    confusion: 'Absorption mainly happens in the SMALL intestine, not the stomach and not the large intestine. Also, the projections are tiny – each is about half a millimetre to a millimetre long.',
    transition: '“Once the nutrients are in the blood… where do they go?”'
  }
});

/* ---------- 22. Blood carries nutrients ---------- */
const TRUNK = 'M0,-20 C0,-80 -6,-140 -8,-180';
const BRANCH = [' C-4,-240 0,-270 0,-320', ' C-60,-222 -102,-232 -126,-196 C-136,-120 -146,-40 -150,40', ' C60,-222 102,-232 126,-196 C136,-120 146,-40 150,40',
  ' C-22,-100 -40,40 -60,120 C-72,240 -76,360 -76,410', ' C8,-100 40,40 60,120 C72,240 76,360 76,410'];
slide({
  act: 4, organ: 3, title: 'Blood carries nutrients everywhere',
  steps: ['Follow the nutrients', 'What do they do?', 'The big idea'],
  html: `
  <svg class="abs" style="left:520px;top:110px;width:820px;height:950px" viewBox="-330 -420 660 880">
    <circle cx="0" cy="-332" r="54" fill="url(#gSkin)" stroke="rgba(184,212,255,.5)" stroke-width="3"/>
    <path d="${figurePath()}" fill="url(#gSkin)" stroke="rgba(184,212,255,.5)" stroke-width="3"/>
    <ellipse cx="0" cy="-10" rx="60" ry="55" fill="url(#gGold)" opacity=".5" class="belly"/>
    <g class="vtree">${BRANCH.map(b => `<path d="${TRUNK + b}" fill="none" stroke="#ff4f5e" stroke-width="7" stroke-linecap="round" opacity=".55"/>`).join('')}</g>
    <g class="flow"></g>
  </svg>
  <div class="abs" style="left:120px;top:150px;width:520px">
    <div class="kicker">Absorbed nutrients</div>
    <div class="h3" style="margin-top:12px">The <span class="c-blood">blood</span> carries them to every part of the body</div>
  </div>
  <div class="abs" style="left:1360px;top:300px;width:500px">
    <div class="card r" data-s="2" style="position:relative;margin-bottom:22px"><div class="ct c-nut">ENERGY</div><div class="cd">to move, think and play</div></div>
    <div class="card r" data-s="2" style="position:relative;margin-bottom:22px;transition-delay:.4s"><div class="ct c-teal">GROWTH &amp; REPAIR</div><div class="cd">to build and fix the body</div></div>
    <div class="card r" data-s="2" style="position:relative;transition-delay:.8s"><div class="ct" style="color:#ffb3b8">WORKING PROPERLY</div><div class="cd">to keep the body healthy</div></div>
  </div>
  <div class="banner r" data-s="3" style="top:900px;font-size:34px;white-space:normal;width:1500px">Food does not simply disappear.<br><span class="c-nut">Its useful nutrients enter the blood and travel all around the body.</span></div>`,
  init(c) {
    const g = c.q('.flow'), R = rng(41); c.paths = BRANCH.map(b => { const p = el('path', { d: TRUNK + b, fill: 'none', stroke: 'none' }, g); return [p, p.getTotalLength()]; });
    c.fp = []; const fills = ['url(#gGold)', 'url(#gTeal)', 'url(#gGold)'];
    for (let i = 0; i < 70; i++) c.fp.push({ b: i % 5, o: R(), e: dotEl(g, 9, fills[i % 3], { opacity: 0 }) });
    c.ends = BRANCH.map((b, i) => el('circle', { r: 24, fill: 'url(#gGold)', opacity: 0 }, g));
  },
  tick(c) {
    const n = c.n, t = c.t;
    c.fp.forEach(p => {
      if (n < 1) { p.e.setAttribute('opacity', 0); return; }
      const ph = (c.stepT * (n === 1 ? .22 : .22) + t * 0 + p.o) % 1;
      const [path, L] = c.paths[p.b]; const q = path.getPointAtLength(ph * L);
      setA(p.e, { cx: f1(q.x), cy: f1(q.y), opacity: f1(Math.min(1, ph * 8, (1 - ph) * 6) * 100) / 100 });
    });
    c.ends.forEach((e, i) => { const [path, L] = c.paths[i]; const q = path.getPointAtLength(L); setA(e, { cx: f1(q.x), cy: f1(q.y), opacity: n >= 1 ? f1((.35 + .3 * Math.sin(t * 3 + i)) * 100) / 100 : 0 }); });
    c.q('.belly').setAttribute('opacity', f1((.4 + .2 * Math.sin(t * 2)) * 100) / 100);
  },
  notes: {
    say: 'Once nutrients enter the blood, the blood carries them to every part of the body – to the brain, the arms, the legs, every single cell. (Click) There, the nutrients provide energy, support growth and repair, and help the body function properly.',
    ask: 'The chapati you ate at lunch – where in your body could it be right now?',
    explain: 'This is the key idea of digestion: food is broken down so that its useful nutrients can enter the blood and be transported all around the body.',
    confusion: 'The food we eat does not just vanish, and it does not all become waste. The useful part is absorbed and used; only the undigested part is removed.',
    transition: '“But some of what we ate could not be digested or absorbed. What happens to that? Let us follow the leftovers.”'
  }
});

/* ===================== ACT 5 · THE CLEAN-UP ===================== */
const LIY = 610, LIH = 145;
const liHalf = x => LIH + 24 * Math.pow(Math.abs(Math.sin(Math.PI * (x - 160) / 210)), .6);
slide({
  act: 5, organ: 4, title: 'The large intestine',
  steps: ['Into the large intestine', 'Water is absorbed', 'Waste becomes semi-solid', 'Did you know?'],
  html: `
  <div class="abs" style="left:120px;top:110px;width:1700px"><div class="kicker">Part 8 · The large intestine</div>
    <div class="q" style="margin-top:12px;font-size:54px">Not everything we ate could be digested or absorbed…</div></div>
  <svg class="full" viewBox="0 0 1920 1080">
    <defs><linearGradient id="gLIc" x1="0" x2="1"><stop offset="0" stop-color="#7d6a4c"/><stop offset=".5" stop-color="#6e4f2e"/><stop offset="1" stop-color="#4f3218"/></linearGradient></defs>
    <path class="capT" fill="none" stroke="#ff4f5e" stroke-width="6" opacity=".6"/><path class="capB" fill="none" stroke="#ff4f5e" stroke-width="6" opacity=".6"/>
    <path class="liW" fill="#c98a68" stroke="#5a3021" stroke-width="4"/>
    <path class="liL" fill="url(#gLIc)"/>
    <g class="folds"></g>
    <g class="cont"></g>
  </svg>
  <div class="lbl" style="left:120px;top:870px;font-size:28px;color:#ffc9bd">from the small intestine →</div>
  <div class="lbl r" data-s="1" style="left:1240px;top:250px;font-size:30px;color:#e7b08f">about 1.5 m long · wider tube</div>
  <div class="abs r" data-s="2" style="left:120px;top:900px;width:900px"><div class="key2" style="font-size:38px"><span class="c-water">Water</span> and some <span style="color:#fff">salts</span> are absorbed</div></div>
  <div class="abs r" data-s="3" style="left:1180px;top:900px;width:700px"><div class="key2" style="font-size:38px">Waste becomes <span style="color:#d9a26b">semi-solid</span>: <span style="color:#d9a26b">stool</span></div></div>
  <div class="abs r" data-s="3" style="left:120px;top:980px;width:1700px"><div class="small">Nutrients were absorbed in the <b style="color:#fff">small</b> intestine · Here, mainly <b class="c-water">water</b> and some <b style="color:#fff">salts</b> are absorbed</div></div>
  <div class="fact r" data-s="4" style="left:1180px;top:110px;width:680px"><div class="fk">DID YOU KNOW?</div><div class="ft">Tiny friendly bacteria living here break down undigested food — especially <b>fibre</b> — and keep our gut healthy.</div></div>`,
  init(c) {
    const top = [], bot = [], wt = [], wb = [];
    for (let x = 140; x <= 1780; x += 10) { const h = liHalf(x); top.push([x, LIY - h]); bot.push([x, LIY + h]); wt.push([x, LIY - h - 30]); wb.push([x, LIY + h + 30]); }
    c.q('.liW').setAttribute('d', polyD([...wt, ...wb.slice().reverse()]));
    c.q('.liL').setAttribute('d', polyD([...top, ...bot.slice().reverse()]));
    c.q('.capT').setAttribute('d', smoothPath(wt.filter((p, i) => i % 3 === 0).map(p => [p[0], p[1] - 26 + 8 * Math.sin(p[0] * .03)])));
    c.q('.capB').setAttribute('d', smoothPath(wb.filter((p, i) => i % 3 === 0).map(p => [p[0], p[1] + 26 + 8 * Math.sin(p[0] * .03)])));
    let f = ''; for (let x = 160; x < 1780; x += 210) f += `<path d="M${x},${LIY - LIH - 30} L${x},${LIY - LIH + 6} M${x},${LIY + LIH + 30} L${x},${LIY + LIH - 6}" stroke="#5a3021" stroke-width="6" opacity=".6"/>`;
    c.q('.folds').innerHTML = f;
    const g = c.q('.cont'), R = rng(23);
    c.water = []; for (let i = 0; i < 80; i++) c.water.push({ o: R(), y: (R() - .5) * 2 * (LIH - 20), ex: .35 + R() * .5, up: R() < .5, e: dotEl(g, 8, 'url(#gBlue)', { opacity: 0 }) });
    c.salt = []; for (let i = 0; i < 18; i++) c.salt.push({ o: R(), y: (R() - .5) * 2 * (LIH - 30), ex: .3 + R() * .5, up: R() < .5, e: el('rect', { width: 9, height: 9, fill: '#f4f4f4', opacity: 0 }, g) });
    c.fib = []; for (let i = 0; i < 16; i++) c.fib.push({ o: R(), y: (R() - .5) * 2 * (LIH - 40), e: el('path', { d: 'M-24,0 C-12,-10 -4,10 8,0 C16,-8 22,6 28,0', fill: 'none', stroke: '#7fb84f', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, g) });
    c.lump = []; for (let i = 0; i < 12; i++) c.lump.push({ o: i / 12, y: (R() - .5) * 2 * (LIH - 60), r: 34 + R() * 26, e: el('ellipse', { rx: 40, ry: 30, fill: 'url(#gStool)', opacity: 0 }, g) });
    c.bac = []; for (let i = 0; i < 16; i++) { const b = el('g', { opacity: 0 }, g); el('rect', { x: -14, y: -6, width: 28, height: 12, rx: 6, fill: '#5fd3b0', stroke: '#2b8a70', 'stroke-width': 2 }, b); c.bac.push({ b, x: 300 + R() * 1300, y: LIY + (R() - .5) * 2 * (LIH - 30), ph: R() * 6 }); }
  },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    const X0 = 150, X1 = 1790, W = X1 - X0;
    const wAbs = n >= 2, solid = n >= 3 ? ease(seg(n === 3 ? st : 60, 0, 2.5)) : 0;
    c.q('.liL').setAttribute('opacity', 1);
    c.water.forEach(w => {
      const ph = (t * .05 + w.o) % 1; let x = X0 + ph * W, y = LIY + w.y, o = .9;
      if (wAbs && ph > w.ex) { const k = clamp((ph - w.ex) / .07); const edge = (w.up ? -1 : 1) * (liHalf(x) + 50); y = lerp(LIY + w.y, LIY + edge, ease(k)); o = k >= 1 ? 0 : .9; }
      setA(w.e, { cx: f1(x), cy: f1(y), opacity: o });
    });
    c.salt.forEach(w => {
      const ph = (t * .05 + w.o) % 1; let x = X0 + ph * W, y = LIY + w.y, o = .85;
      if (wAbs && ph > w.ex) { const k = clamp((ph - w.ex) / .07); y = lerp(LIY + w.y, LIY + (w.up ? -1 : 1) * (liHalf(x) + 50), ease(k)); o = k >= 1 ? 0 : .85; }
      setA(w.e, { x: f1(x), y: f1(y), opacity: o, transform: `rotate(45 ${f1(x + 4)} ${f1(y + 4)})` });
    });
    c.fib.forEach(f => { const ph = (t * .04 + f.o) % 1; f.e.setAttribute('transform', `translate(${f1(X0 + ph * W)},${f1(LIY + f.y)}) rotate(${f1(20 * Math.sin(t + f.o * 9))})`); f.e.setAttribute('opacity', f1((1 - solid * Math.max(0, ph - .55) * 2.2) * .9 * 100) / 100); });
    c.lump.forEach(l => {
      const ph = (t * .035 + l.o) % 1, x = X0 + ph * W, k = solid * seg(ph, .45, .75);
      setA(l.e, { cx: f1(x), cy: f1(LIY + l.y * .7), rx: f1(l.r * k * 1.3), ry: f1(l.r * k), opacity: k > 0 ? .95 : 0 });
    });
    c.bac.forEach(b => { b.b.setAttribute('opacity', n >= 4 ? 1 : 0); b.b.setAttribute('transform', `translate(${f1(b.x + 30 * Math.sin(t * .6 + b.ph))},${f1(b.y + 10 * Math.cos(t * .8 + b.ph))}) rotate(${f1(40 * Math.sin(t + b.ph))})`); });
    // contents darken left -> right as it dries
    c.q('.liL').style.filter = '';
  },
  notes: {
    say: 'After most of the nutrients have been digested and absorbed in the small intestine, what is left? Undigested food – like fibre from vegetables – and a lot of water. These leftovers move into the large intestine. (Click) Watch the water: the large intestine absorbs water and some salts from the undigested food. (Click) As water is removed, the waste becomes semi-solid. This semi-solid waste is called stool.',
    ask: 'Why do you think eating fruits, vegetables and whole grains (fibre) helps the large intestine work properly?',
    explain: 'The large intestine is about 1.5 metres long – shorter but wider than the small intestine. It absorbs water and some salts, making the waste semi-solid. Fibre-rich food makes the stool easier to pass. Friendly bacteria living here break down undigested food, especially fibre, and keep the digestive system healthy.',
    confusion: 'The large intestine is NOT the main place where nutrients are absorbed – that is the small intestine. The large intestine mainly absorbs water and some salts.',
    transition: '“Where does the stool go now? To the last two stops of the journey.”'
  }
});

/* ---------- 24. Rectum, anus, egestion ---------- */
slide({
  act: 5, title: 'Rectum, anus and egestion',
  organ: c => c.n === 0 ? 4 : c.n === 1 ? 5 : 6,
  steps: ['The rectum', 'The anus', 'Name the process'],
  html: `
  <svg class="full body" viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet">${bodyArt()}</svg>
  <div class="lbl rl1" style="color:#e7b08f">Rectum</div>
  <div class="lbl rl2" style="color:#e7b08f">Anus</div>
  <div class="abs" style="left:1180px;top:140px;width:680px">
    <div class="kicker">Part 9 · The last stops</div>
    <div class="h2" style="margin:12px 0 44px">The exit</div>
    <div class="r" data-s="1" style="margin-bottom:30px"><div class="key2" style="color:#e7b08f">RECTUM</div><div class="sub" style="font-size:32px">stores the stool for a while</div><div class="small">(the lower part of the large intestine)</div></div>
    <div class="r" data-s="2" style="margin-bottom:40px"><div class="key2" style="color:#e7b08f">ANUS</div><div class="sub" style="font-size:32px">the exit — the stool leaves the body</div></div>
    <div class="r" data-s="3" style="padding:28px 32px;border-radius:20px;background:rgba(111,227,214,.07);border:1.5px solid rgba(111,227,214,.45)">
      <div class="kicker">This is called</div><div class="h3" style="margin:10px 0">Egestion</div>
      <div class="sub" style="font-size:31px">Removing undigested waste from the body.</div></div>
  </div>`,
  init(c) {
    c.svg = c.q('svg.body'); cam(c.svg, 395, 810, 380);
    const put = (s, x, y, dx, dy) => { const p = projVB(c.svg, x, y); const e = c.q(s); e.style.left = (p[0] + dx) + 'px'; e.style.top = (p[1] + dy) + 'px'; };
    put('.rl1', 312, 895, -210, -30); put('.rl2', 300, 945, -150, 10);
    c.trk = new Track(c.svg, BODY.TRACK);
    const fx = c.q('.fx'); c.st = [0, 1, 2, 3, 4].map(i => el('ellipse', { rx: 7, ry: 6, fill: 'url(#gStool)', opacity: 0 }, fx));
  },
  step(c, n) { dimOrgans(c, n === 0 ? ['li', 'rec', 'anus'] : n === 1 ? ['rec'] : ['rec', 'anus']); },
  tick(c) {
    const n = c.n, st = c.stepT, t = c.t;
    c.st.forEach((e, i) => {
      let s;
      if (n === 0) s = 4.6 + ((t * .08 + i * .08) % .4);
      else if (n === 1) s = lerp(4.65 + i * .05, 5.45 + i * .07, ease(seg(st, i * .3, 2.5 + i * .3)));
      else if (n === 2) s = st < 1.5 ? 5.45 + i * .07 : lerp(5.45 + i * .07, 6.98, ease(seg(st, 1.5 + i * .35, 4 + i * .35)));
      else s = 6.99;
      const p = c.trk.pt(Math.min(s, 6.99));
      const out = n >= 2 && s >= 6.95;
      setA(e, { cx: f1(p[0] + (i % 2 ? 2 : -2)), cy: f1(p[1] + (out && n === 2 ? (st - 4 - i * .35) * 20 : 0)), opacity: n >= 3 || (out && st > 5 + i * .35) ? 0 : 1 });
    });
  },
  notes: {
    say: 'The stool moves into the last part of the large intestine, called the rectum. The rectum stores it for some time, until the body is ready to get rid of it. (Click) Finally, it leaves the body through the anus. (Click) Removing undigested waste from the body in this way is called egestion.',
    ask: 'What is the difference between the food that was absorbed and the waste that is egested?',
    explain: 'Egestion is the removal of undigested waste (stool) from the body through the anus. This keeps us healthy by removing what the body does not need.',
    confusion: 'Egestion (removing undigested food) is different from excretion (removing waste made inside the body’s cells, like urine). Mention this only briefly.',
    transition: '“Now let us put the whole journey together – one bite, from start to finish.”'
  }
});

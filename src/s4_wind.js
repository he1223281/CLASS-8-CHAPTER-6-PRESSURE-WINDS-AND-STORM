/* ============ SECTION 4: FORMATION OF WIND ============ */
// shared coast scene: land on the left, sea on the right
function coastScene(c, W, H, t, night, o = {}) {
  const shore = o.shore || W * .5, gy = o.gy || H - 90;
  D.sky(c, 0, 0, W, H, mix('#4f9ee6', '#0b1430', night), mix('#cfe6f7', '#1c2b4a', night));
  D.stars(c, W, gy * .6, night, 21);
  const sunX = lerp(W * .25, W * .05, night), sunY = 90 + night * 300;
  if (night < .95) D.sun(c, sunX, sunY, 46, 1 - night);
  if (night > .05) D.moon(c, W * .82, 90 + (1 - night) * 200, 34, night);
  // land
  const lg = c.createLinearGradient(0, gy - 20, 0, H);
  lg.addColorStop(0, mix('#8a9b4c', '#2a331c', night)); lg.addColorStop(.15, mix('#c9a76a', '#3d3322', night)); lg.addColorStop(1, mix('#7a5b34', '#1f1810', night));
  c.save(); c.fillStyle = lg; c.beginPath(); c.moveTo(0, gy - 10); c.lineTo(shore - 60, gy - 10); c.quadraticCurveTo(shore, gy - 6, shore + 40, gy + 20); c.lineTo(shore + 40, H); c.lineTo(0, H); c.closePath(); c.fill();
  c.clip(); D.tex(c, 0, gy - 12, shore + 40, H - gy + 12, 'speck', .55); D.tex(c, 0, gy - 12, shore + 40, H - gy + 12, 'grain', .4); c.restore();
  D.sea(c, shore + 10, gy - 2, W - shore - 10, H - gy + 2, t, { night });
  c.fillStyle = mix('#e8d39e', '#4a4030', night); c.beginPath(); c.moveTo(shore - 70, gy - 10); c.quadraticCurveTo(shore, gy - 6, shore + 40, gy + 20); c.lineTo(shore + 10, gy + 8); c.closePath(); c.fill();
  return { shore, gy };
}
function windParticles(n, seed) { const R = rng(seed); return Array.from({ length: n }, () => ({ p: R(), j: (R() - .5) * 40, k: .8 + R() * .4 })); }

S({
  id: 'windform', sec: 4, title: 'How does wind form?', sub: 'Follow the Sun\'s heat, step by step.',
  html: `<div class="col" style="flex:1">
    <canvas id="wfcv" data-w="1808" data-h="590"></canvas>
    <div style="display:flex;gap:16px;align-items:center;justify-content:space-between">
      <div class="tabs" id="wfsteps">${['1 · Sun heats land faster', '2 · Warm air rises', '3 · Low pressure forms', '4 · Cooler air moves in', '5 · Wind!'].map((s, i) => `<button class="btn sm" data-wf="${i}">${s}</button>`).join('')}</div>
      ${ctl('main')}</div></div>`,
  setup(api) {
    const W = 1808, H = 590, gy = 500;
    const loop = D.path(D.roundLoop(330, 150, 1450, gy - 50, 80), true);
    const ps = windParticles(140, 3);
    const stepAt = t => Math.min(4, Math.floor(t / 4.5));
    const legOf = (x, y) => (y > gy - 90 ? 'surface' : y < 190 ? 'aloft' : x < 900 ? 'rise' : 'sink');
    const allowed = [[], ['rise'], ['rise'], ['rise', 'surface'], ['rise', 'surface', 'aloft', 'sink']];
    const sim = api.sim('#wfcv', {
      autoplay: true,
      update() { const k = stepAt(this.t); api.$$('[data-wf]').forEach((b, i) => b.classList.toggle('on', i === k)); },
      draw(c) {
        const t = this.t, st = stepAt(t);
        coastScene(c, W, H, t, 0, { shore: 880, gy });
        // thermometers
        const landT = clamp(.25 + t / 4.5 * .5, .25, .85), seaT = clamp(.25 + t / 4.5 * .12, .25, .42);
        D.thermo(c, 160, gy - 40, 150, landT, COL.lo); D.label(c, 'Land: heats FAST', 160, gy + 40, { size: 26, color: COL.warm, force: true });
        D.thermo(c, 1640, gy - 40, 150, seaT, '#e8833a'); D.label(c, 'Sea: heats slowly', 1640, gy + 40, { size: 26, color: COL.cool, force: true });
        // sun rays to land
        if (st >= 0) for (let i = 0; i < 6; i++) { const a = .5 + i * .12; c.strokeStyle = `rgba(255,220,120,${.25 + .15 * Math.sin(t * 3 + i)})`; c.lineWidth = 4; c.beginPath(); c.moveTo(452 + Math.cos(a) * 70, 90 + Math.sin(a) * 70); c.lineTo(452 + Math.cos(a) * 400, 90 + Math.sin(a) * 400); c.stroke(); }
        // heat shimmer over land
        c.strokeStyle = 'rgba(255,170,80,.45)'; c.lineWidth = 3;
        for (let k = 0; k < 7; k++) { c.beginPath(); for (let y = gy - 20; y > gy - 120; y -= 6) c.lineTo(250 + k * 80 + Math.sin(y * .1 + t * 4 + k) * 6, y); c.stroke(); }
        // particles
        ps.forEach(p => {
          const s = (p.p + t * .045 * p.k) % 1;
          const [x, y] = loop.at(s); const leg = legOf(x, y);
          if (!allowed[st].includes(leg)) return;
          const warm = leg === 'rise' || (leg === 'aloft' && x < 700);
          c.fillStyle = warm ? COL.warm : leg === 'aloft' ? '#c9d6ea' : COL.cool;
          c.beginPath(); c.arc(x + (leg === 'rise' || leg === 'sink' ? p.j : 0), y + (leg === 'surface' || leg === 'aloft' ? p.j * .6 : 0), 7, 0, TAU); c.fill();
        });
        if (st >= 1) { D.arrow(c, 330, gy - 120, 330, 210, { color: COL.warm, w: 12 }); D.label(c, 'warm, light air RISES', 330, 120, { size: 28, color: COL.warm }); }
        if (st >= 2) { D.HL(c, 520, gy - 150, 'L', 52); D.label(c, 'LOW pressure over land', 520, gy - 230, { size: 28, color: COL.lo }); D.HL(c, 1260, gy - 150, 'H', 52); D.label(c, 'HIGHER pressure over sea', 1260, gy - 230, { size: 28, color: COL.hi }); }
        if (st >= 3) { D.arrow(c, 1300, gy - 60, 560, gy - 60, { color: COL.cool, w: 18, glow: 12 }); D.label(c, 'cooler air moves in: WIND', 930, gy - 110, { size: 32, color: COL.cool, force: true }); }
        if (st >= 4) {
          D.arrow(c, 560, 150, 1300, 150, { color: '#c9d6ea', w: 8, alpha: .8 }); D.arrow(c, 1450, 220, 1450, gy - 120, { color: COL.cool, w: 8, alpha: .8 });
          c.save(); c.fillStyle = 'rgba(6,10,19,.82)'; D.rr(c, 504, 18, 800, 76, 16); c.fill(); c.strokeStyle = COL.bolt; c.lineWidth = 3; c.stroke(); c.restore();
          D.text(c, 'AIR MOVES FROM HIGH PRESSURE → LOW PRESSURE', 904, 57, { size: 34, color: COL.bolt, weight: 800 });
        }
      }
    });
    api.on('[data-wf]', 'click', e => { sim.t = +e.currentTarget.dataset.wf * 4.5 + .01; sim.dirty = true; sim.o.update.call(sim); });
  }
});

S({
  id: 'straw', sec: 4, title: 'Two balloons and a straw', sub: 'Activity 6.5: an inflated balloon joined to an uninflated one.',
  html: `<div class="row">
    <div class="vis"><canvas id="stcv" data-w="1080" data-h="560"></canvas>
      ${ctl('main', { playTxt: 'Release the clip' })}</div>
    <div class="side">
      ${predict('What will happen to the two balloons?', ['Balloon A gets bigger', 'A shrinks and B grows', 'Nothing happens'])}
      <div class="card reveal" id="stwhy" style="border-color:var(--safe)"><h3>A shrinks, B grows</h3><ul class="pts">
        <li>Pressure in A is <span class="hiP">higher</span> than in B.</li>
        <li>Air moves from <span class="hiP">high</span> → <span class="loP">low</span> pressure.</li>
        <li>When the pressures become <span class="key">equal</span>, the flow <span class="key">stops</span>.</li>
        <li>Bigger pressure difference → faster air.</li></ul></div>
    </div></div>`,
  setup(api) {
    const sim = api.sim('#stcv', {
      reset(s) { s.a = 1; s.b = .04; s.flow = []; },
      update(s, dt) {
        const q = (s.a - s.b) * .55; s.a -= q * dt; s.b += q * dt;
        if (Math.random() < q * 6) s.flow.push({ x: 0 });
        s.flow.forEach(f => f.x += dt * (.4 + q * 3)); s.flow = s.flow.filter(f => f.x < 1);
        if (s.a - s.b < .02) { this.pause(); api.$('#stwhy').classList.add('show'); }
      },
      draw(c, s) {
        D.sky(c, 0, 0, 1080, 560, '#1b2436', '#0f1726');
        const ax = 280, bx = 800, y = 240;
        const ra = 40 + 140 * Math.sqrt(s.a), rb = 40 + 140 * Math.sqrt(s.b);
        // straw
        c.fillStyle = '#e8e8f0'; c.fillRect(ax + ra * .6, y - 12, bx - ax - ra * .6 - rb * .6, 24);
        c.fillStyle = '#ff6a8a'; for (let x = ax + ra * .6; x < bx - rb * .6; x += 30) c.fillRect(x, y - 12, 10, 24);
        if (!this.playing && this.t === 0) { c.fillStyle = '#3a3f4a'; D.rr(c, 520, y - 34, 40, 68, 8); c.fill(); D.label(c, 'clip', 540, y + 60, { size: 22 }); }
        s.flow.forEach(f => { c.fillStyle = '#fff'; c.beginPath(); c.arc(lerp(ax + ra * .6, bx - rb * .6, f.x), y + Math.sin(f.x * 30) * 4, 5, 0, TAU); c.fill(); });
        const bal = (x, r, col, name) => {
          const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
          g.addColorStop(0, mix(col, '#ffffff', .4)); g.addColorStop(.7, col); g.addColorStop(1, mix(col, '#000000', .4));
          c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(x - r * .4, y - r * .45, r * .16, r * .09, -.6, 0, TAU); c.fill();
          D.label(c, name, x, y - r - 40, { size: 30, force: true });
        };
        bal(ax, ra, '#e0453a', 'A'); bal(bx, rb, '#3a86e0', 'B');
        const pa = s.a, pb = s.b;
        D.meter(c, ax - 0, 482, 48, pa, '', pa > pb + .05 ? 'HIGH' : 'equal', COL.hi);
        D.meter(c, bx, 482, 48, pb, '', pa > pb + .05 ? 'LOW' : 'equal', COL.lo);
        if (this.t > 0 && s.a - s.b > .02) D.arrow(c, 470, 50, 610, 50, { color: COL.bolt, w: 4 + (s.a - s.b) * 12 });
        if (this.t > 0 && s.a - s.b > .02) D.label(c, 'air flows A → B', 540, 100, { size: 26, color: COL.bolt });
        if (s.a - s.b <= .02) D.label(c, 'Pressures equal: flow stops', 540, 60, { size: 28, color: COL.safe, force: true });
      }
    });
  }
});

S({
  id: 'breeze', sec: 4, title: 'Sea breeze and land breeze', sub: 'Toggle DAY and NIGHT. Watch the wind turn around.',
  html: `<div class="row">
    <div class="vis"><canvas id="brcv" data-w="1220" data-h="640"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn on" data-dn="0">☀ DAY</button><button class="btn" data-dn="1">☾ NIGHT</button></div>${ctl('main').replace('<div class="ctrls" data-for="main">', '').replace(/<\/div>$/, '')}</div></div>
    <div class="side"><div class="chain" id="brchain"></div></div></div>`,
  setup(api) {
    const W = 1220, H = 640, gy = 540, shore = 600;
    const loop = D.path(D.roundLoop(230, 170, 1000, gy - 50, 70), true);
    const ps = windParticles(110, 8);
    const st = { n: 0, tn: 0, dir: 1, phase: 0 };
    const chains = {
      0: ['Sun shines on land and sea', 'Land heats up faster', 'Warm air over land rises', 'LOW pressure over land', 'Higher pressure over sea', 'Air moves sea → land', 'SEA BREEZE'],
      1: ['At night, land cools faster', 'Water stays warmer', 'Warm air over sea rises', 'LOW pressure over sea', 'Higher pressure over land', 'Air moves land → sea', 'LAND BREEZE']
    };
    const paint = (k, lit) => { api.$('#brchain').innerHTML = chains[k].map((s, i) => `<div class="st ${i < lit ? 'lit' : ''} ${i === lit ? 'now' : ''}">${i === 6 ? '<b style="font-size:34px">' + s + '</b>' : s}</div>`).join(''); };
    let lastLit = -1, lastMode = -1;
    const sim = api.sim('#brcv', {
      autoplay: true,
      update(s, dt) {
        st.n += (st.tn - st.n) * Math.min(1, dt * 1.5);
        const target = st.tn ? -1 : 1; st.dir += (target - st.dir) * Math.min(1, dt * 1.2);
        st.phase += dt * .05 * st.dir;
        const mode = st.n > .5 ? 1 : 0, lit = Math.min(6, Math.floor((this.t % 14) / 1.6));
        if (lit !== lastLit || mode !== lastMode) { lastLit = lit; lastMode = mode; paint(mode, lit); }
      },
      draw(c) {
        const t = this.t, n = st.n, night = n > .5;
        coastScene(c, W, H, t, n, { shore, gy });
        const wind = st.dir; // +1 sea→land (day), -1 land→sea (night)
        D.palm(c, 540, gy - 8, 190, -wind * .5 + Math.sin(t * 2) * .05, 2);
        D.palm(c, 470, gy - 12, 150, -wind * .45 + Math.sin(t * 2 + 1) * .05, 5);
        // flag
        const fx = 400; c.fillStyle = '#ddd'; c.fillRect(fx - 3, gy - 190, 6, 182);
        c.fillStyle = '#ff6266'; c.beginPath(); c.moveTo(fx, gy - 188);
        for (let i = 0; i <= 10; i++) c.lineTo(fx - wind * i * 9, gy - 188 + Math.sin(t * 8 + i) * 4 * (i / 10)); for (let i = 10; i >= 0; i--) c.lineTo(fx - wind * i * 9, gy - 150 + Math.sin(t * 8 + i) * 4 * (i / 10)); c.fill();
        // thermometers
        const landWarm = night ? .3 : .8, seaWarm = night ? .6 : .4;
        D.thermo(c, 100, gy - 30, 120, landWarm, COL.lo); D.thermo(c, 1130, gy - 30, 120, seaWarm, COL.lo);
        D.label(c, night ? 'land: cooler' : 'land: warmer', 100, gy + 50, { size: 24, color: night ? COL.cool : COL.warm });
        D.label(c, night ? 'sea: warmer' : 'sea: cooler', 1130, gy + 50, { size: 24, color: night ? COL.warm : COL.cool });
        // particles along loop (direction from st.dir)
        ps.forEach(p => {
          const s = p.p + st.phase * p.k; const [x, y] = loop.at(s);
          const riseSide = night ? x > 900 : x < 330;
          const warm = riseSide && y < gy - 60;
          c.fillStyle = warm ? COL.warm : (y > gy - 100 ? COL.cool : '#c9d6ea');
          c.globalAlpha = .9 * Math.min(1, Math.abs(st.dir) * 1.5);
          c.beginPath(); c.arc(x, y + p.j * .4, 7, 0, TAU); c.fill(); c.globalAlpha = 1;
        });
        // H / L
        D.HL(c, night ? 880 : 260, gy - 250, 'L', 46);
        D.HL(c, night ? 260 : 880, gy - 250, 'H', 46);
        // big wind arrow at surface
        if (Math.abs(st.dir) > .3) {
          const a = st.dir > 0 ? [870, 300 + 60] : [300 + 60, 870];
          D.arrow(c, a[0], gy - 75, a[1], gy - 75, { color: COL.cool, w: 16, glow: 10 });
        }
        c.save(); c.fillStyle = 'rgba(6,10,19,.85)'; D.rr(c, 360, 20, 500, 80, 16); c.fill(); c.strokeStyle = night ? '#9fb3ff' : COL.bolt; c.lineWidth = 3; c.stroke(); c.restore();
        D.text(c, night ? 'LAND BREEZE  (land → sea)' : 'SEA BREEZE  (sea → land)', 610, 61, { size: 36, color: night ? '#c9d4ff' : COL.bolt, weight: 800 });
      }
    });
    api.on('[data-dn]', 'click', e => { st.tn = +e.currentTarget.dataset.dn; api.$$('[data-dn]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sim.t = 0; lastLit = -1; if (!sim.playing) sim.play(); });
    paint(0, 0);
  }
});

S({
  id: 'pdiff', sec: 4, title: 'Why is wind stronger on some days?', sub: 'Drag the slider to change the pressure difference.',
  html: `<div class="row">
    <div class="vis"><canvas id="pdcv" data-w="1100" data-h="600"></canvas>
      ${slider('pdv', 'Pressure difference', 0, 1, .01, .25, 'SMALL', 'LARGE')}</div>
    <div class="side">
      <div class="card"><ul class="pts">
        <li>Small pressure difference → <span class="key">gentle breeze</span>.</li>
        <li>Large pressure difference → <span class="loP">fast, strong wind</span>.</li>
        <li>Air always moves from <span class="hiP">high</span> to <span class="loP">low</span> pressure.</li></ul></div>
      ${discuss('Why does air move from high pressure to low pressure?', 'Where the pressure is higher, the air pushes harder. That stronger push moves air towards the region where the push is weaker (low pressure). It keeps flowing until the pressures become equal, just like the two balloons joined by a straw.')}
    </div></div>`,
  setup(api) {
    const V = api.$('#pdv');
    const R = rng(12), ps = Array.from({ length: 90 }, () => ({ x: R() * 1100, y: 140 + R() * 330, k: .7 + R() * .6 }));
    const sim = api.sim('#pdcv', {
      autoplay: true,
      update(s, dt) { const v = +V.value; ps.forEach(p => { p.x += (40 + v * 900) * p.k * dt; if (p.x > 1100) { p.x = 0; p.y = 140 + Math.random() * 330; } }); },
      draw(c) {
        const t = this.t, v = +V.value;
        D.sky(c, 0, 0, 1100, 600, '#5a9ad8', '#cfe3f3'); D.ground(c, 0, 500, 1100, 100);
        D.tree(c, 560, 505, 260, v * .9 + Math.sin(t * (2 + v * 6)) * .05 * (.3 + v), 4);
        c.fillStyle = '#eee'; c.fillRect(820, 300, 6, 205);
        c.fillStyle = '#ffa63d'; c.beginPath(); c.moveTo(826, 304);
        const droop = (1 - v) * 60;
        for (let i = 0; i <= 10; i++) c.lineTo(826 + i * 10 * (.3 + v * .7), 304 + i * droop / 10 + Math.sin(t * (4 + v * 10) + i) * 4 * v);
        for (let i = 10; i >= 0; i--) c.lineTo(826 + i * 10 * (.3 + v * .7), 340 + i * droop / 10 + Math.sin(t * (4 + v * 10) + i) * 4 * v);
        c.fill();
        ps.forEach(p => { c.strokeStyle = `rgba(255,255,255,${.4 + v * .4})`; c.lineWidth = 3; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - 10 - v * 70, p.y); c.stroke(); });
        D.HL(c, 90, 90, 'H', 50); D.HL(c, 1010, 90, 'L', 30 + (1 - v) * 10);
        D.meter(c, 90, 270, 60, .5 + v * .5, '', '', COL.hi); D.meter(c, 1010, 270, 60, .5 - v * .5, '', '', COL.lo);
        D.arrow(c, 200, 90, 900, 90, { color: COL.cool, w: 6 + v * 20, glow: v * 20 });
        D.label(c, v < .15 ? 'Almost calm' : v < .45 ? 'Gentle breeze' : v < .75 ? 'Strong wind' : 'Very strong, fast wind!', 550, 40, { size: 32, color: v > .6 ? COL.lo : COL.bolt, force: true });
      }
    });
  }
});

S({
  id: 'check4', sec: 4, title: 'Concept check: Wind', kick: 'Check your understanding',
  html: `<div class="qgrid">
    ${mcq('In which direction does air move?', ['From low pressure to high pressure', 'From high pressure to low pressure', 'Only upward'], 1, 'Correct! Air moves from a region of high air pressure to a region of low air pressure.')}
    ${mcq('Why does a land breeze blow at night?', ['Land is warmer than the sea at night', 'The sea is warmer, so low pressure forms over the sea', 'The Moon pulls the air'], 1, 'Yes. At night land cools faster. Warm air over the sea rises, low pressure forms there, and air moves from land to sea.')}
    <div class="q wide" data-type="mcq"><div class="qtag">Picture puzzle</div><div class="qt">Trees along a sea coast on a summer afternoon. Which side is the land: A or B?</div>
      <canvas id="treecv" data-w="1700" data-h="240" style="border-radius:12px"></canvas>
      <div class="opts"><button class="opt" data-i="0">A (left side)</button><button class="opt" data-ok="1" data-i="1">B (right side)</button></div>
      <div class="fb ans">B is the land! On a summer afternoon a sea breeze blows from the sea towards the land, so the trees bend towards the land (B). The sea must be on side A.</div>
      <div class="fb bad">Think: in the afternoon, the wind blows from the sea towards the land. Which way are the trees bending?</div></div>
  </div>`,
  setup(api) {
    api.sim('#treecv', {
      autoplay: true,
      draw(c) {
        const t = this.t;
        D.sky(c, 0, 0, 1700, 240, '#7ab8e8', '#d8ecf8');
        c.fillStyle = '#9aa7b3'; c.fillRect(0, 205, 1700, 35);
        [400, 650, 900, 1150, 1400].forEach((x, i) => D.palm(c, x, 210, 170, .55 + Math.sin(t * 2 + i) * .05, i + 3));
        D.text(c, 'A', 60, 120, { size: 64, color: '#132', weight: 900, fam: 'disp', shadow: false });
        D.text(c, 'B', 1640, 120, { size: 64, color: '#132', weight: 900, fam: 'disp', shadow: false });
      }
    });
  }
});

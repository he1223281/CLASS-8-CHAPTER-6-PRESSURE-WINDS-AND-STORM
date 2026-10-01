/* ============ SECTIONS 6-8: STORMS, THUNDERSTORMS, LIGHTNING ============ */
S({
  id: 'storm', sec: 6, title: 'How does a storm form?', sub: 'Watch the whole chain, one step at a time.',
  html: `<div class="row">
    <div class="vis"><canvas id="smcv" data-w="1180" data-h="650"></canvas>${ctl('main')}</div>
    <div class="side"><div class="chain" id="smchain">${['Land gets heated', 'Warm, moist air rises (it is lighter)', 'A low-pressure area forms', 'Cooler air from around flows in', 'It also heats up and rises: circulation', 'Rising air expands and cools', 'Moisture condenses: droplets form clouds', 'Droplets merge into heavier drops', 'They fall as rain, hail or snow', 'Strong winds + rain = STORM'].map(s => `<div class="st" style="font-size:25px;padding:6px 12px">${s}</div>`).join('')}</div></div></div>`,
  setup(api) {
    const steps = api.$$('#smchain .st'), DT = 3.4;
    const R = rng(17), ps = Array.from({ length: 70 }, () => ({ p: R(), x: (R() - .5) * 120, k: .6 + R() * .8 }));
    const drops = Array.from({ length: 160 }, () => ({ x: 330 + R() * 520, y: R() * 300, v: 300 + R() * 200 }));
    const sim = api.sim('#smcv', {
      autoplay: true,
      update(s, dt) {
        const k = Math.min(9, Math.floor(this.t / DT));
        steps.forEach((e, i) => { e.classList.toggle('lit', i < k); e.classList.toggle('now', i === k); });
        drops.forEach(d => { d.y += d.v * dt; if (d.y > 330) d.y = 0; });
      },
      draw(c) {
        const t = this.t, k = Math.min(9, Math.floor(t / DT)), W = 1180, gy = 560;
        const dark = seg01(t, 6 * DT, 9 * DT);
        D.sky(c, 0, 0, W, gy, mix('#5aa0e0', '#2c3644', dark), mix('#cfe3f3', '#5b6573', dark));
        const lg = c.createLinearGradient(0, gy, 0, 650); lg.addColorStop(0, '#b9894e'); lg.addColorStop(1, '#6b4a26'); c.fillStyle = lg; c.fillRect(0, gy, W, 90);
        if (k <= 5) D.sun(c, 1060, 90, 48, 1 - dark);
        // heat glow
        const hg = c.createRadialGradient(590, gy, 10, 590, gy, 300); hg.addColorStop(0, `rgba(255,140,40,${.45 - dark * .3})`); hg.addColorStop(1, 'rgba(255,140,40,0)'); c.fillStyle = hg; c.fillRect(250, gy - 300, 680, 300);
        D.thermo(c, 70, gy - 20, 120, .85, COL.lo); D.label(c, 'hot land', 70, gy + 50, { size: 22, force: true });
        D.tree(c, 1000, gy + 4, 170, k >= 9 ? .8 + Math.sin(t * 6) * .1 : 0, 3);
        D.tree(c, 1110, gy + 4, 130, k >= 9 ? .85 + Math.sin(t * 6 + 1) * .1 : 0, 6);
        // rising air column
        if (k >= 1) ps.forEach(p => {
          const s = (p.p + t * .08 * p.k) % 1; const y = gy - 20 - s * (gy - 150), x = 590 + p.x * (1 + s * .6);
          const cool = s > .55 && k >= 5;
          c.fillStyle = cool ? COL.cool : COL.warm; c.globalAlpha = .85; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); c.globalAlpha = 1;
        });
        if (k >= 1) D.arrow(c, 590, gy - 40, 590, 280, { color: COL.warm, w: 10, alpha: .8 });
        if (k >= 2) { D.HL(c, 590, gy - 70, 'L', 40); }
        if (k >= 3) { D.arrow(c, 120, gy - 40, 450, gy - 40, { color: COL.cool, w: 12 }); D.arrow(c, 1060, gy - 40, 730, gy - 40, { color: COL.cool, w: 12 }); D.label(c, 'cooler air flows in', 280, gy - 90, { size: 24, color: COL.cool }); }
        if (k >= 4) { D.curveArrow(c, 470, 260, 330, 320, 300, gy - 80, { color: '#c9d6ea', w: 6, alpha: .7 }); D.curveArrow(c, 710, 260, 850, 320, 880, gy - 80, { color: '#c9d6ea', w: 6, alpha: .7 }); }
        if (k >= 5) { D.thermo(c, 900, 260, 90, .2, COL.cool); D.label(c, 'cold up high', 900, 310 + 0, { size: 22 }); D.label(c, 'expands & cools', 400, 300, { size: 24, color: COL.cool }); }
        if (k >= 6) {
          const g = seg01(t, 6 * DT, 7.5 * DT);
          D.cloud(c, 590, 180, 380 + g * 360, 160 + g * 120, { seed: 4, dark: .2 + dark * .6 });
          D.cloud(c, 470, 210, 260 * g + 10, 120 * g + 10, { seed: 9, dark: .3 + dark * .6, alpha: g });
          D.cloud(c, 730, 205, 280 * g + 10, 120 * g + 10, { seed: 12, dark: .3 + dark * .6, alpha: g });
          if (k === 6) D.label(c, 'water vapour condenses → tiny droplets → CLOUD', 590, 40, { size: 26, color: '#fff' });
        }
        if (k === 7) { for (let i = 0; i < 14; i++) { const x = 420 + (i * 53) % 340, y = 200 + (i * 37) % 80; c.fillStyle = '#9fd0ff'; c.beginPath(); c.arc(x, y, 4 + (t * 2 + i) % 6, 0, TAU); c.fill(); } D.label(c, 'droplets merge → heavier drops', 590, 40, { size: 26 }); }
        if (k >= 8) {
          D.rainDrops(c, drops.map(d => ({ x: d.x, y: 260 + d.y })), .9, k >= 9 ? 1.5 : 0);
          if (k === 8) D.label(c, 'falls as rain, hail or snow', 590, 40, { size: 26 });
        }
        if (k >= 9) {
          c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; for (let i = 0; i < 18; i++) { const y = 330 + (i * 41) % 200, x = ((i * 157 + t * 900) % 1300) - 100; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 80, y + 4); c.stroke(); }
          c.save(); c.fillStyle = 'rgba(6,10,19,.85)'; D.rr(c, 270, 14, 640, 70, 14); c.fill(); c.strokeStyle = COL.bolt; c.lineWidth = 3; c.stroke(); c.restore();
          D.text(c, 'STRONG WINDS + RAIN = STORM', 590, 50, { size: 32, color: COL.bolt, weight: 800 });
        }
      }
    });
  }
});

S({
  id: 'tscloud', sec: 7, title: 'Inside a thunderstorm cloud', sub: 'Strong winds blow up and down inside the cloud.',
  html: `<div class="row">
    <div class="vis"><canvas id="tccv" data-w="1180" data-h="650"></canvas>${ctl('main')}</div>
    <div class="side"><div class="chain" id="tcchain">${['Warm air rises to great heights', 'Low temperature there turns water droplets into ice particles', 'Strong winds blow upwards and downwards', 'Ice particles and water droplets rub against each other', 'Static electric charges develop', 'Lighter ice particles (+) move to the top; heavier water droplets (−) stay at the bottom', 'The ground and tall objects below become positively charged (+)'].map(s => `<div class="st" style="font-size:25px;padding:6px 12px">${s}</div>`).join('')}</div></div></div>`,
  setup(api) {
    const steps = api.$$('#tcchain .st'), DT = 3;
    const R = rng(23);
    const P = Array.from({ length: 90 }, (_, i) => ({ ice: i % 2 === 0, x: 380 + R() * 420, y0: 150 + R() * 300, ph: R() * TAU, sp: .5 + R() }));
    const sim = api.sim('#tccv', {
      autoplay: true,
      update() { const k = Math.min(6, Math.floor(this.t / DT)); steps.forEach((e, i) => { e.classList.toggle('lit', i < k); e.classList.toggle('now', i === k); }); },
      draw(c) {
        const t = this.t, k = Math.min(6, Math.floor(t / DT)), W = 1180, gy = 600;
        D.sky(c, 0, 0, W, gy, '#1d2533', '#3d4654');
        c.fillStyle = '#2f3a24'; c.fillRect(0, gy, W, 50);
        // tall cumulonimbus with anvil
        const grow = seg01(t, 0, DT * 1.2);
        c.save(); c.globalAlpha = .95;
        c.fillStyle = 'rgba(160,170,185,.9)'; c.beginPath(); c.ellipse(590, 95, 260 + grow * 120, 50, 0, 0, TAU); c.fill();
        D.cloud(c, 590, 110, 600 + grow * 160, 150, { seed: 31, dark: .35 });
        D.cloud(c, 590, 250, 520, 240, { seed: 32, dark: .45 });
        D.cloud(c, 590, 390, 620, 260, { seed: 33, dark: .6 });
        D.cloud(c, 590, 470, 700, 170, { seed: 34, dark: .75 });
        c.restore();
        D.label(c, 'very cold top: ICE', 990, 100, { size: 24, color: COL.cool });
        // up/down drafts
        if (k >= 2) {
          for (let i = 0; i < 3; i++) { const yy = 480 - ((t * 140 + i * 120) % 360); D.arrow(c, 590, yy + 60, 590, yy, { color: COL.warm, w: 9, alpha: .9 }); }
          for (let i = 0; i < 2; i++) { const yy = 160 + ((t * 120 + i * 160) % 320); D.arrow(c, 430, yy - 50, 430, yy, { color: COL.cool, w: 8, alpha: .9 }); D.arrow(c, 760, yy - 50, 760, yy, { color: COL.cool, w: 8, alpha: .9 }); }
          D.label(c, 'up', 640, 320, { size: 22, color: COL.warm }); D.label(c, 'down', 375, 320, { size: 22, color: COL.cool });
        }
        // particles
        const q = seg01(t, 4 * DT, 6 * DT), sep = seg01(t, 5 * DT, 6.5 * DT);
        P.forEach((p, i) => {
          if (!p.ice && k < 0) return;
          if (p.ice && k < 1) return;
          const wob = Math.sin(t * 2 * p.sp + p.ph) * (k >= 2 ? 50 : 10);
          const target = p.ice ? 140 + (i % 7) * 18 : 400 + (i % 7) * 16;
          const y = lerp(p.y0 + wob, target + wob * .3, sep), x = p.x + Math.cos(t * p.sp + p.ph) * 12;
          if (p.ice) { c.fillStyle = '#eaf6ff'; c.save(); c.translate(x, y); c.rotate(t + i); c.fillRect(-5, -5, 10, 10); c.restore(); }
          else { c.fillStyle = '#6ab4ff'; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); }
          if (q > (i % 10) / 10) D.charge(c, x + 12, y - 10, p.ice ? 1 : -1, 9);
        });
        if (k >= 3 && k < 5) for (let i = 0; i < 4; i++) { const x = 400 + ((t * 337 + i * 191) % 400), y = 200 + ((t * 211 + i * 97) % 250); c.strokeStyle = COL.bolt; c.lineWidth = 3; c.beginPath(); for (let a = 0; a < 6; a++) { c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 12, y + Math.sin(a) * 12); } c.stroke(); }
        if (k >= 5) { D.label(c, 'UPPER PART: + charges', 980, 200, { size: 26, color: '#ff8f8f', force: true }); D.label(c, 'LOWER PART: − charges', 980, 440, { size: 26, color: '#8fc0ff', force: true }); }
        if (k >= 6) {
          for (let i = 0; i < 16; i++) { const x = 110 + i * 64; if (x > 380 && x < 800) continue; D.charge(c, x, gy + 20, 1, 12, seg01(t, 6 * DT, 6.6 * DT)); }
          D.tree(c, 160, gy + 2, 140, 0, 2, { dark: true }); D.charge(c, 160, gy - 120, 1, 12);
          c.fillStyle = '#4a4f58'; c.fillRect(1090, gy - 100, 54, 100); D.charge(c, 1117, gy - 114, 1, 12);
          D.label(c, 'ground & tall objects: + charges', 590, gy + 20, { size: 24, color: '#ff8f8f' });
        }
      }
    });
  }
});

S({
  id: 'lightning', sec: 8, title: 'Lightning: a giant spark', sub: 'Choose where the lightning happens, then build up the charges.',
  html: `<div class="row">
    <div class="vis"><canvas id="lgcv" data-w="1180" data-h="620"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn" data-lm="in">Within a cloud</button><button class="btn" data-lm="between">Between clouds</button><button class="btn on" data-lm="ground">Cloud to ground</button></div>${ctl('main', { playTxt: 'Build up charge' }).replace('<div class="ctrls" data-for="main">', '').replace(/<\/div>$/, '')}</div></div>
    <div class="side"><div class="chain" id="lgchain">${['Charges separate in the cloud', 'Charges build up… more and more', 'Normally air is an INSULATOR: it keeps opposite charges apart', 'When the build-up is very large, air\'s insulating property BREAKS DOWN', 'Sudden flow of charges: a bright flash = LIGHTNING', 'Lightning heats the air rapidly → air expands → loud sound = THUNDER'].map(s => `<div class="st" style="font-size:26px">${s}</div>`).join('')}</div></div></div>`,
  setup(api) {
    let mode = 'ground';
    const steps = api.$$('#lgchain .st');
    const paint = k => steps.forEach((e, i) => { e.classList.toggle('lit', i < k); e.classList.toggle('now', i === k); });
    const sim = api.sim('#lgcv', {
      reset(s) { s.q = 0; s.flash = 0; s.bolt = null; s.ring = -1; s.k = 0; paint(0); },
      update(s, dt) {
        if (s.flash <= 0 && s.ring < 0) {
          s.q = Math.min(1, s.q + dt * .22);
          const k = s.q < .3 ? 0 : s.q < .6 ? 1 : s.q < .85 ? 2 : 3; if (k !== s.k) { s.k = k; paint(k); }
          if (s.q >= 1) {
            s.flash = 1; s.k = 4; paint(4);
            s.bolt = mode === 'ground' ? D.genBolt(560, 250, 600, 560, (Math.random() * 1e6) | 0) : mode === 'in' ? D.genBolt(520, 110, 660, 250, (Math.random() * 1e6) | 0, .3, 2) : D.genBolt(420, 220, 860, 200, (Math.random() * 1e6) | 0, .25, 2);
            thunder(.25, 1);
          }
        } else if (s.flash > 0) {
          s.flash -= dt * 1.3; s.q = Math.max(0, s.q - dt * 3);
          if (s.flash <= 0) { s.ring = 0; s.k = 5; paint(5); }
        } else if (s.ring >= 0) { s.ring += dt * 300; if (s.ring > 900) { s.ring = -1; s.k = 0; paint(0); } }
      },
      draw(c, s) {
        const W = 1180, gy = 560, q = s.q;
        D.sky(c, 0, 0, W, gy, '#151b26', '#353d4a');
        c.fillStyle = '#2b3420'; c.fillRect(0, gy, W, 60);
        D.tree(c, 600, gy + 2, 150, 0, 3, { dark: true }); c.fillStyle = '#3c424c'; c.fillRect(820, gy - 150, 80, 150);
        const n = Math.round(q * 12);
        if (mode === 'between') {
          D.cloud(c, 330, 200, 460, 220, { seed: 41, dark: .7 }); D.cloud(c, 900, 190, 460, 220, { seed: 42, dark: .7 });
          for (let i = 0; i < n; i++) { D.charge(c, 380 + (i % 4) * 30, 160 + Math.floor(i / 4) * 34, -1, 12); D.charge(c, 800 + (i % 4) * 30, 160 + Math.floor(i / 4) * 34, 1, 12); }
        } else {
          D.cloud(c, 590, 200, 720, 330, { seed: 43, dark: .7 });
          for (let i = 0; i < n; i++) { D.charge(c, 430 + (i % 6) * 60, 100 + Math.floor(i / 6) * 32, 1, 12); D.charge(c, 430 + (i % 6) * 60, 260 + Math.floor(i / 6) * 32, -1, 12); }
          if (mode === 'ground') for (let i = 0; i < Math.round(q * 10); i++) D.charge(c, 160 + i * 90, gy + 26, 1, 12);
        }
        // insulator meter
        D.meter(c, 1070, 140, 70, q, 'Charge build-up', q > .85 ? 'DANGER' : '', q > .85 ? COL.lo : COL.bolt);
        if (s.flash > 0) {
          c.fillStyle = `rgba(230,230,255,${s.flash * .45})`; c.fillRect(0, 0, W, 620);
          D.bolt(c, s.bolt, Math.min(1, s.flash * 2));
          D.label(c, 'LIGHTNING!', 590, 40, { size: 44, color: COL.bolt, force: true, fam: 'disp', weight: 900 });
        }
        if (s.ring >= 0) {
          const [bx, by] = mode === 'ground' ? [590, 420] : mode === 'in' ? [590, 180] : [640, 210];
          for (let i = 0; i < 4; i++) { const r = s.ring - i * 60; if (r > 0) { c.strokeStyle = `rgba(255,225,90,${Math.max(0, .8 - r / 900)})`; c.lineWidth = 5; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.stroke(); } }
          D.label(c, 'heated air expands → sound wave → THUNDER', 590, 40, { size: 30, color: COL.bolt, force: true });
        }
      }
    });
    api.on('[data-lm]', 'click', e => { mode = e.currentTarget.dataset.lm; api.$$('[data-lm]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sim.reset(); });
  }
});

S({
  id: 'thunder', sec: 8, title: 'Lightning first, thunder later', sub: 'Lightning and thunder happen at the same moment. Why do we hear thunder later?',
  html: `<div class="row">
    <div class="vis"><canvas id="thcv" data-w="1180" data-h="560"></canvas>
      <div class="ctrls"><button class="btn go" id="thgo">⚡ Strike!</button></div>
      ${slider('thd', 'Distance of storm', 1, 5, 1, 2, '1 km', '5 km')}</div>
    <div class="side">
      <div class="card"><ul class="pts">
        <li><span class="key">Light</span> travels extremely fast: the flash reaches you almost instantly.</li>
        <li><span class="key">Sound</span> is much slower: about 3 seconds for every 1 km.</li>
        <li>So we <b>see</b> lightning first and <b>hear</b> thunder later.</li></ul></div>
      <div class="card" style="text-align:center"><div class="muted" style="font-size:24px">Time after the flash</div><div class="mono" id="thtimer" style="font-size:72px;color:var(--bolt)">0.0 s</div></div>
    </div></div>`,
  setup(api) {
    const Dd = api.$('#thd'); const timer = api.$('#thtimer');
    const st = { t: -1, bolt: null, heard: false };
    const sim = api.sim('#thcv', {
      autoplay: true,
      update(s, dt) {
        if (st.t >= 0) {
          st.t += dt; const delay = +Dd.value * 3;
          timer.textContent = Math.min(st.t, delay).toFixed(1) + ' s';
          if (st.t >= delay && !st.heard) { st.heard = true; thunder(0, .9); }
          if (st.t > delay + 2) st.t = -1;
        }
      },
      draw(c) {
        const W = 1180, gy = 470, d = +Dd.value, sx = 150, ox = 160 + d * 190;
        D.sky(c, 0, 0, W, gy, '#18202d', '#3c4554'); c.fillStyle = '#2b3420'; c.fillRect(0, gy, W, 90);
        D.cloud(c, sx + 60, 120, 380, 180, { seed: 51, dark: .75 });
        D.person(c, ox, gy, 150, { shirt: '#c1497a' });
        D.label(c, 'You', ox, gy + 40, { size: 26, force: true });
        c.strokeStyle = 'rgba(255,255,255,.4)'; c.setLineDash([10, 10]); c.lineWidth = 3; c.beginPath(); c.moveTo(sx, gy + 60); c.lineTo(ox, gy + 60); c.stroke(); c.setLineDash([]);
        D.label(c, d + ' km', (sx + ox) / 2, gy + 60, { size: 24, color: COL.bolt });
        if (st.t >= 0) {
          const delay = d * 3;
          if (st.t < .5) { c.fillStyle = `rgba(230,230,255,${(.5 - st.t) * .8})`; c.fillRect(0, 0, W, 560); D.bolt(c, st.bolt, 1 - st.t * 2); }
          // light (instant) vs sound (slow) racing
          D.arrow(c, sx, 300, ox - 20, 300, { color: COL.bolt, w: 8, alpha: st.t < 1.5 ? 1 : .3 });
          D.label(c, 'LIGHT: arrives at once', (sx + ox) / 2, 270, { size: 24, color: COL.bolt });
          const frac = clamp(st.t / delay, 0, 1), soundX = lerp(sx, ox, frac);
          for (let i = 0; i < 3; i++) { const r = 20 + i * 18; c.strokeStyle = `rgba(88,220,255,${.9 - i * .25})`; c.lineWidth = 5; c.beginPath(); c.arc(soundX - i * 14, 380, r, -.6, .6); c.stroke(); }
          D.label(c, frac < 1 ? 'SOUND: still travelling…' : 'THUNDER heard!', Math.min(Math.max(soundX, 180), 1000), 430 - 0, { size: 24, color: COL.cool, force: true });
        } else D.label(c, 'Press Strike!', 600, 300, { size: 30 });
      }
    });
    api.$('#thgo').addEventListener('click', () => { st.t = 0; st.heard = false; st.bolt = D.genBolt(210, 190, 190, 470, (Math.random() * 1e6) | 0, .2, 2); timer.textContent = '0.0 s'; });
  }
});

S({
  id: 'venn', sec: 7, title: 'Storm or thunderstorm?', sub: 'Every thunderstorm is a storm. Is every storm a thunderstorm?',
  html: `<div class="row">
    <div class="vis" style="width:900px"><svg viewBox="0 0 900 680" style="width:900px;height:680px">
      <defs><radialGradient id="vg1"><stop offset="0" stop-color="#2a4a78"/><stop offset="1" stop-color="#16243c"/></radialGradient><radialGradient id="vg2"><stop offset="0" stop-color="#5a4a14"/><stop offset="1" stop-color="#2a220a"/></radialGradient></defs>
      <circle cx="450" cy="340" r="320" fill="url(#vg1)" stroke="#5fb0ff" stroke-width="5"/>
      <text x="450" y="90" fill="#5fb0ff" font-size="48" font-weight="800" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif">STORM</text>
      <text x="450" y="140" fill="#f1f5fc" font-size="30" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">strong winds + rain / hail / snow</text>
      <circle cx="450" cy="400" r="190" fill="url(#vg2)" stroke="#ffe15a" stroke-width="5"/>
      <text x="450" y="340" fill="#ffe15a" font-size="38" font-weight="800" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif">THUNDERSTORM</text>
      <text x="450" y="395" fill="#f1f5fc" font-size="30" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">storm</text>
      <text x="450" y="440" fill="#f1f5fc" font-size="30" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">+ lightning</text>
      <text x="450" y="485" fill="#f1f5fc" font-size="30" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">+ thunder</text>
      <path d="M430 520 L470 520 L440 575 L475 575 L420 650 L440 590 L410 590 Z" fill="#ffe15a"/></svg></div>
    <div class="side">
      ${mcq('Is every storm necessarily a thunderstorm?', ['Yes', 'No'], 1, 'No. A storm only needs strong winds with rain. It becomes a thunderstorm only when lightning and thunder also occur.')}
      ${mcq('Is every thunderstorm a storm?', ['Yes', 'No'], 0, 'Yes. A thunderstorm is a storm accompanied by lightning and thunder.')}
      <div class="card explain" style="font-size:25px"><b>A step further:</b> local thunderstorms in India have names: <span class="key">Kalboishakhi</span> (West Bengal, Bihar, Jharkhand), <span class="key">Bordoisila</span> (Assam), <span class="key">mango showers</span> (Kerala, Karnataka, Tamil Nadu). They help kharif crops, mangoes and coffee plants.</div>
    </div></div>`
});

S({
  id: 'check8', sec: 8, title: 'Concept check: Lightning', kick: 'Check your understanding',
  html: `<div class="qgrid" style="grid-template-columns:1.25fr 1fr">
    ${seq('Put the steps of lightning formation in order.', ['Warm, moist air rises to great heights', 'Water droplets freeze into ice particles high up', 'Up and down winds rub ice particles and droplets', 'Charges separate: + at the top, − at the bottom', 'Charge build-up becomes very large', 'Air\'s insulating property breaks down: LIGHTNING'], 'Perfect order! This is exactly how lightning forms.')}
    <div class="col" style="gap:14px">
      ${mcq('What causes thunder?', ['Clouds bumping into each other', 'Lightning heats the air rapidly, the air expands and makes a loud sound', 'Rain hitting the ground'], 1, 'Correct. Rapidly heated air expands and produces the loud sound we call thunder.')}
      ${mcq('Where can lightning occur?', ['Only between a cloud and the ground', 'Within a cloud, between clouds, or between a cloud and the ground', 'Only inside a cloud'], 1, 'Yes: all three are possible.')}
      <div class="ctrls">${discuss('Would lightning occur if air and clouds were good conductors of electricity?', 'No big lightning flash would form. Lightning happens because air is normally an insulator that keeps opposite charges apart until a huge amount builds up. If air and clouds conducted electricity well, the charges would keep flowing away gradually and could not build up to such a large amount.')}</div>
    </div></div>`
});

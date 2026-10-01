/* ============ SECTIONS 9-10: LIGHTNING SAFETY & LIGHTNING CONDUCTOR ============ */
const SAFE_CASES = [
  ['Standing under a tall tree', 0, 'Stay away from tall objects. Lightning tends to strike tall things like trees.', 'tree'],
  ['Sitting inside a car or bus', 1, 'If you are inside a bus or a car, you are comparatively safer.', 'bus'],
  ['Swimming in a pond', 0, 'If you are in water, get out of it.', 'water'],
  ['Holding an umbrella with a metallic rod', 0, 'Avoid using an umbrella with a metallic rod.', 'umbrella'],
  ['Crouching down in a low-lying open area', 1, 'Find a low-lying open area, crouch down and minimise contact with the ground.', 'crouch'],
  ['Lying flat on the ground', 0, 'Do not lie down flat. Minimise your contact with the ground.', 'lie'],
];
function safetyScene(c, kind, t) {
  const W = 400, H = 200, gy = 170;
  D.sky(c, 0, 0, 700, gy, '#1e2633', '#4a5462'); D.hills(c, 700, gy - 6, { layers: 2, amp: 30, far: '#3c4654', near: '#2c3626' }); D.ground(c, 0, gy, 700, H - gy, { top: '#3d4a2a', bot: '#1d2414' });
  D.cloud(c, 200, 30, 380, 90, { seed: 61, dark: .75 }); D.cloud(c, 560, 34, 300, 80, { seed: 62, dark: .75 });
  c.translate(150, 0);
  if (kind === 'tree') { D.tree(c, 200, gy + 2, 160, 0, 4, { dark: true }); D.person(c, 230, gy, 70, { shirt: '#c1497a' }); }
  if (kind === 'bus') D.bus(c, 70, gy + 4, 270);
  if (kind === 'water') { D.sea(c, -150, gy - 30, 700, 60, t, { top: '#2f6f9f', bot: '#123a5c' }); D.person(c, 200, gy - 24, 70, { pose: 'swim' }); }
  if (kind === 'umbrella') {
    D.person(c, 200, gy, 90, { shirt: '#2e6fb3' });
    c.strokeStyle = '#c0c6cf'; c.lineWidth = 4; c.beginPath(); c.moveTo(212, gy - 50); c.lineTo(212, gy - 120); c.stroke();
    c.fillStyle = '#7a2a8a'; c.beginPath(); c.arc(212, gy - 112, 52, Math.PI, 0); c.fill();
    c.fillStyle = '#c0c6cf'; c.fillRect(210, gy - 176, 4, 14);
  }
  if (kind === 'crouch') { D.person(c, 200, gy, 120, { pose: 'crouch', shirt: '#2e6fb3' }); }
  if (kind === 'lie') { D.person(c, 200, gy + 2, 160, { pose: 'lie', shirt: '#2e6fb3' }); }
}
S({
  id: 'safegame', sec: 9, title: 'SAFE or UNSAFE during lightning?', sub: 'Decide for each picture. Then read why.',
  html: `<div class="col" style="flex:1"><div class="sgame">${SAFE_CASES.map((s, i) => `<div class="sc" data-sc="${i}">
      <canvas data-w="700" data-h="200" data-s=".8"></canvas><div class="nm">${s[0]}</div>
      <div class="ab"><button class="btn s" data-ans="1">SAFE</button><button class="btn u" data-ans="0">UNSAFE</button></div>
      <div class="why"><div class="verdict" style="color:${s[1] ? 'var(--safe)' : 'var(--lo)'}">${s[1] ? 'SAFE' : 'UNSAFE'}</div>${s[2]}</div></div>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="big" id="sgscore">Score: 0 / 6</div><button class="btn" id="sgreset">↺ Play again</button></div></div>`,
  setup(api) {
    let score = 0, done = 0;
    api.$$('.sc').forEach((card, i) => {
      api.sim(card.querySelector('canvas'), { name: 'sc' + i, draw(c) { safetyScene(c, SAFE_CASES[i][3], this.t); } });
      card.querySelectorAll('[data-ans]').forEach(b => b.addEventListener('click', () => {
        const ok = +b.dataset.ans === SAFE_CASES[i][1];
        card.classList.add('done', ok ? 'ok' : 'no'); if (ok) score++; done++;
        api.$('#sgscore').textContent = `Score: ${score} / 6` + (done === 6 ? (score === 6 ? '  Excellent! Lightning-safe expert.' : '  Read the reasons and try again.') : '');
      }));
    });
    api.$('#sgreset').addEventListener('click', () => { score = 0; done = 0; api.$$('.sc').forEach(c => c.classList.remove('done', 'ok', 'no')); api.$('#sgscore').textContent = 'Score: 0 / 6'; });
  }
});

S({
  id: 'saferules', sec: 9, title: 'Lightning can be dangerous!', sub: 'It can start fires, damage buildings, and cause severe burns or death.',
  html: `<div class="row">
    <div class="vis"><canvas id="srcv" data-w="760" data-h="660"></canvas></div>
    <div class="side" style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-content:start">
      <div class="card" style="border:3px solid var(--safe)"><h3 style="color:var(--safe)">DO</h3><ul class="pts" style="font-size:30px">
        <li>Stay away from tall objects</li><li>Find a low-lying open area</li><li>Crouch down</li><li>Minimise contact with the ground</li><li>Get out of water</li><li>Stay inside a bus or car (safer)</li></ul></div>
      <div class="card" style="border:3px solid var(--lo)"><h3 style="color:var(--lo)">DON'T</h3><ul class="pts" style="font-size:30px">
        <li>Stand under a tree</li><li>Lie down flat on the ground</li><li>Use an umbrella with a metallic rod</li><li>Stay in a pond, river or pool</li></ul></div>
      <div style="grid-column:1/-1" class="ctrls">${discuss('Why should we avoid standing under trees during lightning?', 'A tree is a tall object. During a thunderstorm the ground and tall objects such as trees become charged, and lightning between a cloud and the ground often strikes tall objects. Standing under one puts you right next to the likely path of the lightning.')}</div>
    </div></div>`,
  setup(api) {
    api.sim('#srcv', {
      autoplay: true,
      draw(c) {
        const t = this.t, gy = 560, fl = (t % 4) < .15 ? 1 : 0;
        D.sky(c, 0, 0, 760, gy, '#1a212d', '#454e5c'); D.hills(c, 760, gy - 10, { layers: 2, amp: 60, far: '#3c4654', near: '#2c3626' }); D.ground(c, 0, gy, 760, 100, { top: '#3d4a2a', bot: '#1d2414' });
        D.cloud(c, 380, 90, 760, 200, { seed: 71, dark: .8 });
        if (fl) { c.fillStyle = 'rgba(230,230,255,.25)'; c.fillRect(0, 0, 760, 660); }
        D.tree(c, 650, gy + 4, 360, 0, 6, { dark: true });
        D.person(c, 300, gy, 300, { pose: 'crouch', shirt: '#2e6fb3' });
        D.label(c, 'SAFE POSITION', 300, 250, { size: 36, color: COL.safe, force: true, fam: 'disp', weight: 900 });
        D.label(c, 'crouch low · feet together\n· head down', 300, 320, { size: 26 });
        D.label(c, 'tall tree: keep away', 640, 160, { size: 24, color: COL.lo });
        D.label(c, 'low-lying open area', 300, gy + 50, { size: 24 });
      }
    });
  }
});

S({
  id: 'conductor', sec: 10, title: 'The lightning conductor', sub: 'Compare a building with and without one.',
  html: `<div class="row">
    <div class="vis"><canvas id="lccv" data-w="1080" data-h="640"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn on" data-lc="1">With conductor</button><button class="btn" data-lc="0">Without conductor</button></div><button class="btn go" id="lcstrike">⚡ Lightning strikes</button></div></div>
    <div class="side">
      <div class="card"><h3>Parts</h3><ul class="pts">
        <li>A <span class="key">metallic rod</span> fixed along the walls during construction</li>
        <li>Top end is <span class="key">pointed</span> and higher than the highest point of the building</li>
        <li>Bottom end is <span class="key">buried deep</span> in the ground</li></ul></div>
      <div class="card" style="border-color:var(--safe)"><h3>Purpose</h3>It provides an <span class="key">easy path</span> for electric charges to transfer into the ground, protecting the building.</div>
    </div></div>`,
  setup(api) {
    let withC = 1;
    const st = { t: -1, bolt: null, ch: [] };
    const sim = api.sim('#lccv', {
      autoplay: true,
      update(s, dt) { if (st.t >= 0) { st.t += dt; if (st.t > 4) st.t = -1; } },
      draw(c) {
        const gy = 520, bx = 420, bw = 240, bh = 330, t = this.t;
        D.sky(c, 0, 0, 1080, gy, '#151b26', '#3a4250');
        D.cloud(c, 540, 70, 900, 170, { seed: 81, dark: .8 });
        // ground cross-section
        const gg = c.createLinearGradient(0, gy, 0, 640); gg.addColorStop(0, '#4a3a26'); gg.addColorStop(1, '#2a2016'); c.fillStyle = gg; c.fillRect(0, gy, 1080, 120);
        // building
        const g = c.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, '#8a919c'); g.addColorStop(1, '#5d646e');
        c.fillStyle = g; c.fillRect(bx, gy - bh, bw, bh); D.tex(c, bx, gy - bh, bw, bh, 'plaster', .6);
        c.fillStyle = '#c9dbe9'; for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) c.fillRect(bx + 26 + k * 72, gy - bh + 26 + r * 50, 44, 30);
        const hit = st.t >= 0 && st.t < 1.2;
        if (withC) {
          const rx = bx + bw - 14;
          c.strokeStyle = '#d08a3a'; c.lineWidth = 8;
          c.beginPath(); c.moveTo(rx, gy - bh - 70); c.lineTo(rx, gy - bh); c.lineTo(rx + 24, gy - bh); c.lineTo(rx + 24, gy + 90); c.stroke();
          c.fillStyle = '#d08a3a'; c.beginPath(); c.moveTo(rx - 8, gy - bh - 66); c.lineTo(rx, gy - bh - 96); c.lineTo(rx + 8, gy - bh - 66); c.fill();
          c.fillStyle = '#b07030'; c.fillRect(rx + 2, gy + 86, 46, 14);
          D.label(c, 'pointed tip (highest point)', rx - 150, gy - bh - 100, { size: 22 });
          D.label(c, 'metal conductor', rx + 140, gy - 180, { size: 22 });
          D.label(c, 'buried deep in ground', rx + 120, gy + 95, { size: 22 });
          if (hit) {
            D.bolt(c, st.bolt, 1 - st.t / 1.2);
            for (let i = 0; i < 10; i++) { const p = ((st.t * 1.3 + i / 10) % 1); const y = lerp(gy - bh - 90, gy + 90, p); D.charge(c, rx + (y > gy - bh ? 24 : 0), y, -1, 10); }
          }
          if (st.t >= 1.2) D.label(c, 'Charges flowed safely into the ground. Building safe!', 540, 600, { size: 26, color: COL.safe, force: true });
        } else {
          if (hit) {
            D.bolt(c, st.bolt, 1 - st.t / 1.2);
            c.fillStyle = `rgba(255,120,40,${.6 * (1 - st.t / 1.2)})`; c.beginPath(); c.arc(bx + bw / 2, gy - bh, 80, 0, TAU); c.fill();
          }
          if (st.t >= .4) {
            c.strokeStyle = '#1a1a1a'; c.lineWidth = 5; c.beginPath(); c.moveTo(bx + bw / 2, gy - bh); c.lineTo(bx + bw / 2 - 20, gy - bh + 60); c.lineTo(bx + bw / 2 + 10, gy - bh + 110); c.lineTo(bx + bw / 2 - 10, gy - bh + 170); c.stroke();
            const fl = 18 + Math.sin(t * 20) * 6; c.fillStyle = 'rgba(255,140,40,.8)'; c.beginPath(); c.moveTo(bx + bw / 2 - 20, gy - bh); c.quadraticCurveTo(bx + bw / 2, gy - bh - fl * 2, bx + bw / 2 + 20, gy - bh); c.fill();
            D.label(c, 'No easy path: the building is damaged', 540, 600, { size: 26, color: COL.lo, force: true });
          }
        }
      }
    });
    api.on('[data-lc]', 'click', e => { withC = +e.currentTarget.dataset.lc; api.$$('[data-lc]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); st.t = -1; });
    api.$('#lcstrike').addEventListener('click', () => { st.t = 0; const x = withC ? 420 + 240 - 14 : 540; st.bolt = D.genBolt(x - 40, 120, x, withC ? 520 - 330 - 96 : 520 - 330, (Math.random() * 1e6) | 0, .2, 2); thunder(.2, .8); });
  }
});

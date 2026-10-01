/* ============ SECTION 1: PRESSURE ============ */
function drawStudentBack(c, x, y, h, strapW, o = {}) {
  const sh = y - h * .815;
  c.save();
  c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(x, y, h * .16, h * .025, 0, 0, TAU); c.fill();
  D.person(c, x + (o.step || 0) * .1, y, h, { shirt: o.shirt, back: true, hair: '#1a120c', skin: '#a86e4a' });
  if (o.braid) { c.strokeStyle = '#1a120c'; c.lineWidth = h * .022; c.beginPath(); c.moveTo(x, sh - h * .05); c.quadraticCurveTo(x + 6, sh + h * .04, x + 2, sh + h * .1); c.stroke(); }
  // shoulder pressure glow
  if (o.glow) [-1, 1].forEach(sd => {
    const gx = x + sd * h * .07, gy = sh + 2, r = h * (.03 + .04 * (1 - o.glow));
    const g = c.createRadialGradient(gx, gy, 0, gx, gy, r * 2.2); g.addColorStop(0, `rgba(255,50,50,${.85 * o.glow})`); g.addColorStop(1, 'rgba(255,50,50,0)');
    c.fillStyle = g; c.beginPath(); c.arc(gx, gy, r * 2.2, 0, TAU); c.fill();
  });
  // straps (padded) over the shoulders
  const bw = h * .22, bh = h * .33, bx = x - bw / 2, by = sh + h * .035;
  [-1, 1].forEach(sd => {
    const sx = x + sd * h * .068;
    const g = c.createLinearGradient(sx - strapW / 2, 0, sx + strapW / 2, 0); g.addColorStop(0, '#111318'); g.addColorStop(.5, '#3a3f4a'); g.addColorStop(1, '#111318');
    c.fillStyle = g; c.beginPath(); c.moveTo(sx - strapW / 2, sh - 5); c.quadraticCurveTo(sx, sh - 9, sx + strapW / 2, sh - 5);
    c.lineTo(x + sd * bw * .3 + strapW / 2, by + 8); c.lineTo(x + sd * bw * .3 - strapW / 2, by + 8); c.closePath(); c.fill();
    if (strapW > 16) { c.strokeStyle = 'rgba(255,255,255,.15)'; c.setLineDash([4, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx - strapW / 2 + 4, sh); c.lineTo(x + sd * bw * .3 - strapW / 2 + 4, by + 6); c.stroke(); c.setLineDash([]); }
  });
  // backpack body
  const g = c.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, mix(o.bag, '#000000', .45)); g.addColorStop(.45, mix(o.bag, '#ffffff', .1)); g.addColorStop(1, mix(o.bag, '#000000', .5));
  c.fillStyle = g; D.rr(c, bx, by, bw, bh, h * .045); c.fill();
  c.save(); D.rr(c, bx, by, bw, bh, h * .045); c.clip(); D.tex(c, bx, by, bw, bh, 'speck', .45); D.tex(c, bx, by, bw, bh, 'grain', .35, .5);
  const sg = c.createLinearGradient(0, by, 0, by + bh); sg.addColorStop(0, 'rgba(255,255,255,.12)'); sg.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = sg; c.fillRect(bx, by, bw, bh); c.restore();
  c.fillStyle = mix(o.bag, '#000000', .3); D.rr(c, bx + bw * .14, by + bh * .48, bw * .72, bh * .42, h * .025); c.fill();
  c.strokeStyle = '#c9c9c9'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + bw * .18, by + bh * .52); c.lineTo(bx + bw * .82, by + bh * .52); c.stroke();
  c.fillStyle = '#d9d9d9'; c.fillRect(bx + bw * .7, by + bh * .5, 4, 10);
  c.restore();
}

S({
  id: 'bags', sec: 1, title: 'Same weight. Different straps.', sub: 'Megha and Pawan carry identical items in their bags.',
  html: `<div class="row">
    <div class="vis"><canvas id="bagcv" data-w="1080" data-h="700" data-s=".95"></canvas>
      <div class="ctrls"><button class="btn" id="showF">Show where the weight presses</button></div></div>
    <div class="side">
      <div class="card"><ul class="pts">
        <li>Pawan keeps adjusting his bag. <span class="key">It hurts his shoulders.</span></li>
        <li>Megha feels fine.</li><li>Both bags are <span class="key">equally heavy</span>.</li></ul></div>
      ${predict('Whose shoulders will hurt more? Why?', ['Pawan (narrow straps)', 'Megha (broad straps)', 'Both the same'])}
      <div class="card reveal" id="bagwhy" style="border-color:var(--safe)">
        <h3>Pawan's shoulders hurt more</h3>
        <ul class="pts"><li>Same weight (same <span class="f key">force</span>)</li>
        <li>Narrow straps → weight acts on a <span class="key">smaller area</span></li>
        <li>So the push on each bit of shoulder is larger</li></ul>
      </div>
    </div></div>`,
  setup(api) {
    let showF = false;
    const sim = api.sim('#bagcv', {
      autoplay: true,
      draw(c) {
        const t = this.t;
        D.sky(c, 0, 0, 1080, 700, '#6aa8dc', '#d8ecf8');
        D.cloud(c, 260, 110, 360, 170, { seed: 5 }); D.cloud(c, 860, 80, 300, 140, { seed: 8 });
        D.hills(c, 1080, 560, { layers: 3, amp: 90, far: '#9fb4c6', near: '#5f7d45' });
        D.ground(c, 0, 560, 1080, 140, { top: '#7c9a48' });
        c.save(); c.beginPath(); c.moveTo(330, 700); c.lineTo(495, 560); c.lineTo(585, 560); c.lineTo(750, 700); c.closePath(); c.clip(); D.sand(c, 300, 560, 480, 140, '#b89a6a'); c.restore();
        D.tree(c, 90, 590, 300, Math.sin(t) * .05, 3); D.tree(c, 990, 590, 260, Math.sin(t + 1) * .05, 5);
        const adj = Math.max(0, Math.sin(t * 1.3)) > .9 ? Math.sin(t * 25) * 4 : 0;
        drawStudentBack(c, 330 + adj, 640 + Math.sin(t * 6) * 3, 470, 10, { shirt: '#2e6fb3', bag: '#b8402f', step: Math.sin(t * 6) * 8, glow: showF ? 1 : 0 });
        drawStudentBack(c, 760, 640 + Math.sin(t * 6 + 1) * 3, 450, 40, { shirt: '#c1497a', bag: '#2f7a5a', step: Math.sin(t * 6 + 1) * 8, glow: showF ? .25 : 0, braid: true });
        D.label(c, 'Pawan', 330, 120, { size: 34, color: COL.bolt, force: true });
        D.label(c, 'narrow straps', 330, 168, { size: 26 });
        D.label(c, 'Megha', 760, 120, { size: 34, color: COL.bolt, force: true });
        D.label(c, 'broad straps', 760, 168, { size: 26 });
        D.label(c, 'Same weight in both bags', 540, 40, { size: 28, color: COL.warm });
        if (showF) {
          [-1, 1].forEach(sd => {
            for (let i = 0; i < 2; i++) D.arrow(c, 330 + sd * 30 + (i - .5) * 6, 200, 330 + sd * 30 + (i - .5) * 6, 252, { color: COL.lo, w: 5 });
            for (let i = 0; i < 4; i++) D.arrow(c, 760 + sd * 29 + (i - 1.5) * 12, 228, 760 + sd * 29 + (i - 1.5) * 12, 256, { color: COL.safe, w: 4, head: 10 });
          });
          D.label(c, 'Force crowded on a\nsmall area → hurts!', 330, 470, { size: 26, color: '#ffb3b3' });
          D.label(c, 'Force spread over a\nlarger area → comfortable', 760, 470, { size: 26, color: '#b8f5cf' });
        }
      }
    });
    api.$('#showF').addEventListener('click', e => { showF = !showF; e.currentTarget.classList.toggle('on', showF); sim.dirty = true; });
    api.$('.q.predict').addEventListener('predicted', () => { api.$('#bagwhy').classList.add('show'); showF = true; api.$('#showF').classList.add('on'); });
  }
});

S({
  id: 'straplab', sec: 1, title: 'Strap lab: Pressure = Force ÷ Area', sub: 'Drag the slider. The bag\'s weight on the shoulder stays the same.',
  html: `<div class="row">
    <div class="vis"><canvas id="strapcv" data-w="1080" data-h="640"></canvas>
      ${slider('strapw', 'Strap width', 1, 8, .1, 1.5, 'NARROW', 'BROAD')}</div>
    <div class="side">
      <div class="formula"><span class="p">Pressure</span> = <span class="f">Force</span> ÷ <span class="a">Area</span></div>
      <div class="card" style="font-size:30px;display:flex;flex-direction:column;gap:8px">
        <div><span class="key" style="color:var(--warm)">Force</span> on one shoulder = <b class="mono">30 N</b> (stays the same)</div>
        <div><span class="key" style="color:var(--cool)">Contact area</span> = 10 cm × <b class="mono" id="sw1">1.5</b> cm = <b class="mono" id="sa1">15</b> cm²</div>
        <div class="mono" style="font-size:24px;color:var(--muted)">= <span id="sa2">0.0015</span> m²</div>
        <div><span class="key">Pressure</span> = 30 N ÷ <span class="mono" id="sa3">0.0015</span> m² = <b class="mono" id="sp1" style="color:var(--bolt)">20 000</b> Pa</div>
      </div>
      <div class="card" id="strapmsg" style="font-size:30px"></div>
      <div class="card explain" style="font-size:27px"><b>SI unit of pressure:</b> newton per square metre (N/m²), also called a <span class="key">pascal (Pa)</span>.</div>
    </div></div>`,
  setup(api) {
    const inp = api.$('#strapw');
    let shown = 1.5, target = 1.5;
    const fmt = n => Math.round(n).toLocaleString('en-IN');
    const upd = () => {
      target = +inp.value; const w = target, A = w * 10, Am = A / 10000, P = 30 / Am;
      api.$('#sw1').textContent = w.toFixed(1); api.$('#sa1').textContent = A.toFixed(0);
      api.$('#sa2').textContent = Am.toFixed(4); api.$('#sa3').textContent = Am.toFixed(4); api.$('#sp1').textContent = fmt(P);
      const m = api.$('#strapmsg');
      m.innerHTML = w < 3 ? '<span style="color:var(--lo);font-weight:700">Small area → HIGH pressure → it hurts!</span><br>Same force + smaller area = greater pressure'
        : w < 5 ? '<span style="color:var(--warm);font-weight:700">Medium area → medium pressure.</span>' : '<span style="color:var(--safe);font-weight:700">Large area → LOW pressure → comfortable.</span><br>Same force + larger area = lower pressure';
      sim.dirty = true;
    };
    const sim = api.sim('#strapcv', {
      idle(s, dt) { shown += (target - shown) * Math.min(1, dt * 8); },
      draw(c) {
        const w = shown, P = 30 / (w * 10 / 10000), pf = clamp((30000 / w) / 30000, 0, 1);
        D.sky(c, 0, 0, 1080, 640, '#1a2133', '#0e1422');
        // shoulder cross-section (skin surface curve)
        const cx = 470, top = 330, sW = w * 52; // strap px width
        const dent = pf * 34;
        c.save();
        const skin = c.createLinearGradient(0, top, 0, 640); skin.addColorStop(0, '#d79a72'); skin.addColorStop(.1, '#c4835c'); skin.addColorStop(.4, '#a3523f'); skin.addColorStop(1, '#6e2d27');
        c.fillStyle = skin; c.beginPath(); c.moveTo(40, 640);
        for (let x = 40; x <= 900; x += 6) {
          let y = top + Math.pow((x - cx) / 430, 2) * 120;
          const d = Math.abs(x - cx);
          if (d < sW / 2 + 30) y += dent * Math.cos(Math.min(1, d / (sW / 2 + 30)) * Math.PI / 2) ** 2;
          c.lineTo(x, y);
        }
        c.lineTo(900, 640); c.closePath(); c.fill();
        // redness
        const g = c.createRadialGradient(cx, top + dent, 4, cx, top + dent, sW / 2 + 70);
        g.addColorStop(0, `rgba(255,40,40,${.75 * pf})`); g.addColorStop(1, 'rgba(255,40,40,0)');
        c.fillStyle = g; c.beginPath(); c.arc(cx, top + dent, sW / 2 + 70, 0, TAU); c.fill();
        // bone hint
        c.fillStyle = 'rgba(240,230,210,.35)'; c.beginPath(); c.ellipse(cx + 40, top + 200, 150, 50, .05, 0, TAU); c.fill();
        D.label(c, 'shoulder (cross-section)', 760, 590, { size: 24 });
        // strap
        c.fillStyle = '#20232c'; D.rr(c, cx - sW / 2, top + dent - 26, sW, 26, 6); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.25)'; c.setLineDash([8, 6]); c.lineWidth = 2; c.beginPath(); c.moveTo(cx - sW / 2 + 6, top + dent - 13); c.lineTo(cx + sW / 2 - 6, top + dent - 13); c.stroke(); c.setLineDash([]);
        // strap continues up to bag
        c.fillStyle = '#20232c'; c.beginPath(); c.moveTo(cx - sW / 2, top + dent - 24); c.lineTo(cx - sW / 2 - 60, 60); c.lineTo(cx + sW / 2 - 60, 60); c.lineTo(cx + sW / 2, top + dent - 24); c.fill();
        c.restore();
        // total force arrow
        D.arrow(c, 300, 70, 300, 210, { color: COL.warm, w: 14 });
        D.label(c, 'Force = 30 N\n(same every time)', 300, 250, { size: 26, color: COL.warm });
        // distributed pressure arrows
        const n = 9;
        for (let i = 0; i < n; i++) {
          const x = cx - sW / 2 + sW * (i + .5) / n, L = 30 + pf * 90;
          D.arrow(c, x, top + dent - 30 - L, x, top + dent - 30, { color: mix('#43e08a', '#ff6266', pf), w: 4 + pf * 4, head: 12 + pf * 6, headW: 8 + pf * 4 });
        }
        D.label(c, `Area = ${(w * 10).toFixed(0)} cm²`, cx, top + dent + 46, { size: 26, color: COL.cool });
        D.meter(c, 950, 210, 95, pf, 'Pressure', fmt(P) + ' Pa', mix('#43e08a', '#ff6266', pf));
        D.label(c, pf > .5 ? 'OUCH!' : pf > .27 ? 'Uncomfortable' : 'Comfortable', 950, 360, { size: 32, color: pf > .5 ? COL.lo : pf > .27 ? COL.warm : COL.safe, force: true });
      }
    });
    inp.addEventListener('input', upd); upd();
  }
});

S({
  id: 'sand', sec: 1, title: 'Standing vs lying on loose sand', sub: 'Same boy, same weight. Only the contact area changes.',
  html: `<div class="row">
    <div class="vis"><canvas id="sandcv" data-w="1080" data-h="640"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn on" data-pose="stand">Standing</button><button class="btn" data-pose="lie">Lying down</button></div>${ctl('main', { playTxt: 'Let him sink', slow: false })}</div></div>
    <div class="side">
      ${predict('In which case will the boy sink more into the sand?', ['Standing', 'Lying down', 'Same in both'])}
      <div class="card reveal" id="sandwhy" style="border-color:var(--safe)"><h3>Standing: he sinks more</h3>
        <ul class="pts"><li>Weight (force) is the same: <b class="mono">400 N</b></li>
        <li>Standing: tiny area (feet) → <span class="loP">high pressure</span></li>
        <li>Lying: large area (whole body) → <span class="hiP">low pressure</span></li></ul></div>
      <div class="card"><div class="fapr" id="sandnum" style="font-size:28px"></div></div>
    </div></div>`,
  setup(api) {
    let pose = 'stand';
    const A = { stand: .05, lie: .5 };
    const num = () => { const a = A[pose]; api.$('#sandnum').innerHTML = `<span class="k" style="color:var(--warm)">Force</span><span class="mono">400 N</span><span class="k" style="color:var(--cool)">Area</span><span class="mono">${a} m²</span><span class="k" style="color:var(--bolt)">Pressure</span><span class="mono">400 ÷ ${a} = ${Math.round(400 / a).toLocaleString('en-IN')} Pa</span>`; };
    const sim = api.sim('#sandcv', {
      reset(s) { s.sink = 0; },
      update(s, dt) { const tgt = pose === 'stand' ? 60 : 8; s.sink = Math.min(tgt, s.sink + dt * 40); if (s.sink >= tgt) { this.pause(); api.$('#sandwhy').classList.add('show'); } },
      draw(c, s) {
        D.sky(c, 0, 0, 1080, 640, '#8cc4ec', '#f3e3c0');
        const gy = 430;
        D.sand(c, 0, gy, 1080, 210, '#e2c48a');
        const k = s.sink;
        if (pose === 'stand') {
          c.save(); c.beginPath(); c.rect(0, 0, 1080, gy + 2); c.clip(); D.person(c, 540, gy + k, 360, { shirt: '#2e6fb3' }); c.restore();
          c.save(); c.beginPath(); c.rect(0, gy, 1080, 210); c.clip(); c.globalAlpha = .35; D.person(c, 540, gy + k, 360, { shirt: '#2e6fb3' }); c.restore();
          D.arrow(c, 540, 40, 540, 120, { color: COL.warm, w: 12 }); D.label(c, 'Weight 400 N', 670, 70, { size: 26, color: COL.warm });
          for (let i = 0; i < 2; i++) D.arrow(c, 520 + i * 40, gy + 40, 520 + i * 40, gy + 120, { color: COL.lo, w: 8 });
          D.label(c, 'all 400 N on two small feet', 540, gy + 160, { size: 26, color: '#ffb3b3' });
        } else {
          c.save(); c.beginPath(); c.rect(0, 0, 1080, gy + 2); c.clip(); D.person(c, 540, gy + k, 360, { pose: 'lie', shirt: '#2e6fb3' }); c.restore();
          D.arrow(c, 540, 160, 540, 270, { color: COL.warm, w: 12 }); D.label(c, 'Weight 400 N', 670, 200, { size: 26, color: COL.warm });
          for (let i = 0; i < 9; i++) D.arrow(c, 380 + i * 38, gy + 30, 380 + i * 38, gy + 60, { color: COL.safe, w: 4, head: 10 });
          D.label(c, '400 N spread over the whole body', 540, gy + 120, { size: 26, color: '#b8f5cf' });
        }
        D.label(c, `Sinks: ${(k / 6).toFixed(1)} cm`, 900, 60, { size: 30, color: COL.bolt, force: true });
      }
    });
    api.on('[data-pose]', 'click', e => { pose = e.currentTarget.dataset.pose; api.$$('[data-pose]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sim.reset(); num(); });
    num();
  }
});


// realistic mini-scenes for the everyday-pressure cards (drawn in a 240×150 box)
function appArt(c, i, t = 0) {
  const W = 240, H = 150;
  D.sky(c, 0, 0, W, H, '#2a3448', '#4b5a72');
  const metal = (x0, x1) => { const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#6f7680'); g.addColorStop(.35, '#eef1f5'); g.addColorStop(.6, '#9aa2ad'); g.addColorStop(1, '#545b65'); return g; };
  if (i === 0) { // backpack with broad padded straps
    c.fillStyle = '#3a3f48'; c.fillRect(0, 128, W, 22); D.tex(c, 0, 128, W, 22, 'speck', .4);
    drawStudentBack(c, 120, 300, 300, 30, { shirt: '#c1497a', bag: '#2f7a5a', braid: true });
  } else if (i === 1) { // steel bucket with a broad grip
    c.fillStyle = '#3a3f48'; c.fillRect(0, 128, W, 22); D.tex(c, 0, 128, W, 22, 'speck', .4);
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(120, 134, 60, 8, 0, 0, TAU); c.fill();
    c.fillStyle = metal(70, 170); c.beginPath(); c.moveTo(68, 62); c.lineTo(172, 62); c.lineTo(160, 132); c.lineTo(80, 132); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; [80, 104].forEach(y => { c.beginPath(); c.moveTo(66 + (y - 62) * .12, y); c.lineTo(174 - (y - 62) * .12, y); c.stroke(); });
    c.fillStyle = '#c4ccd6'; c.beginPath(); c.ellipse(120, 62, 52, 9, 0, 0, TAU); c.fill();
    const wg = c.createLinearGradient(0, 56, 0, 68); wg.addColorStop(0, '#9fd0f2'); wg.addColorStop(1, '#2f74ad'); c.fillStyle = wg; c.beginPath(); c.ellipse(120, 64, 47, 7, 0, 0, TAU); c.fill();
    c.strokeStyle = '#b8c0ca'; c.lineWidth = 3; c.beginPath(); c.moveTo(70, 64); c.quadraticCurveTo(120, -10, 170, 64); c.stroke();
    const gg = c.createLinearGradient(0, 20, 0, 34); gg.addColorStop(0, '#e08a2e'); gg.addColorStop(1, '#8a4a12'); c.fillStyle = gg; D.rr(c, 98, 21, 44, 13, 6); c.fill();
  } else if (i === 2) { // clay pot on a cloth ring on the head
    c.fillStyle = '#3a3f48'; c.fillRect(0, 140, W, 10);
    D.person(c, 120, 330, 330, { shirt: '#a33d5a', skin: '#9a603e', hair: '#120c08' });
    const ry = 72;
    const rg = c.createLinearGradient(0, ry - 6, 0, ry + 6); rg.addColorStop(0, '#f0d27a'); rg.addColorStop(1, '#a8772a'); c.fillStyle = rg; c.beginPath(); c.ellipse(120, ry, 30, 7, 0, 0, TAU); c.fill();
    const pg = c.createRadialGradient(108, 30, 4, 120, 42, 46); pg.addColorStop(0, '#d98a52'); pg.addColorStop(.7, '#9a4e22'); pg.addColorStop(1, '#5e2c10');
    c.fillStyle = pg; c.beginPath(); c.moveTo(104, 12); c.quadraticCurveTo(70, 26, 82, 52); c.quadraticCurveTo(96, 70, 120, 70); c.quadraticCurveTo(144, 70, 158, 52); c.quadraticCurveTo(170, 26, 136, 12); c.closePath(); c.fill();
    c.save(); c.clip(); D.tex(c, 70, 8, 100, 66, 'grain', .5, .6); c.restore();
    c.fillStyle = '#7a3a16'; c.beginPath(); c.ellipse(120, 12, 17, 4, 0, 0, TAU); c.fill();
  } else if (i === 3) { // nail being driven into wood
    c.fillStyle = '#8a5a33'; c.fillRect(20, 108, 200, 42); D.tex(c, 20, 108, 200, 42, 'wood', .9);
    c.fillStyle = metal(114, 126); c.fillRect(114, 40, 12, 72); c.beginPath(); c.moveTo(114, 112); c.lineTo(126, 112); c.lineTo(120, 124); c.fill();
    c.fillStyle = metal(100, 140); D.rr(c, 100, 34, 40, 8, 2); c.fill();
    c.fillStyle = metal(84, 156); D.rr(c, 86, 6, 64, 24, 4); c.fill();
    const hg = c.createLinearGradient(150, 0, 230, 0); hg.addColorStop(0, '#6b4424'); hg.addColorStop(1, '#a8743f'); c.fillStyle = hg; D.rr(c, 148, 12, 84, 12, 5); c.fill();
  } else if (i === 4) { // knife and apple
    c.fillStyle = '#6a4626'; c.fillRect(0, 128, W, 22); D.tex(c, 0, 128, W, 22, 'wood', .8);
    const ag = c.createRadialGradient(100, 82, 4, 112, 96, 40); ag.addColorStop(0, '#ff8a70'); ag.addColorStop(.35, '#d7322a'); ag.addColorStop(.85, '#8a1712'); ag.addColorStop(1, '#5a0d0a');
    c.fillStyle = ag; c.beginPath(); c.moveTo(112, 66); c.bezierCurveTo(70, 50, 62, 120, 100, 130); c.bezierCurveTo(108, 133, 116, 133, 124, 130); c.bezierCurveTo(162, 120, 154, 50, 112, 66); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(96, 84, 6, 11, -.5, 0, TAU); c.fill();
    c.strokeStyle = '#4a3018'; c.lineWidth = 3; c.beginPath(); c.moveTo(112, 66); c.quadraticCurveTo(114, 54, 120, 50); c.stroke();
    c.fillStyle = '#4c8a2e'; c.beginPath(); c.ellipse(130, 54, 12, 5, -.4, 0, TAU); c.fill();
    c.fillStyle = metal(40, 190); c.beginPath(); c.moveTo(30, 30); c.lineTo(172, 30); c.lineTo(172, 44); c.lineTo(40, 48); c.closePath(); c.fill();
    c.fillStyle = '#2b1d12'; D.rr(c, 168, 26, 58, 20, 6); c.fill(); D.tex(c, 168, 26, 58, 20, 'wood', .6);
  } else if (i === 5) { // elephant
    D.sand(c, 0, 128, W, 22, '#b8935a');
    D.elephant(c, 46, 132, 150, t);
  } else { // person standing and lying on sand
    D.sand(c, 0, 118, W, 32, '#e0c08a');
    D.person(c, 60, 124, 110, { shirt: '#2e6fb3' });
    D.person(c, 170, 126, 110, { pose: 'lie', shirt: '#2e6fb3' });
  }
}
const APPS = [
  ['School bag straps', 'low', 'Weight of the bag', 'Broad straps → large area', 'LOW', 'Comfortable shoulders',
    `<rect x="60" y="20" width="80" height="100" rx="14" fill="#2f7a5a"/><rect x="72" y="70" width="56" height="40" rx="8" fill="#256148"/><path d="M78 20 L70 0 M122 20 L130 0" stroke="#1d1f26" stroke-width="16"/>`],
  ['Bucket handle', 'low', 'Weight of water', 'Broad handle → larger area on fingers', 'LOW', 'Easier to lift',
    `<path d="M50 50 L150 50 L135 140 L65 140 Z" fill="#3a86c8"/><ellipse cx="100" cy="50" rx="50" ry="10" fill="#7fc0ee"/><path d="M52 50 Q100 -20 148 50" stroke="#ddd" stroke-width="5" fill="none"/><rect x="80" y="8" width="40" height="16" rx="6" fill="#ffa63d"/>`],
  ['Cloth pad under a load', 'low', 'Weight of pot / basket', 'Round cloth pad → larger area on head', 'LOW', 'Load is easier to carry',
    `<circle cx="100" cy="120" r="34" fill="#a86d48"/><ellipse cx="100" cy="86" rx="40" ry="10" fill="#ffa63d"/><path d="M60 80 Q55 20 100 15 Q145 20 140 80 Z" fill="#b5652e"/><ellipse cx="100" cy="18" rx="22" ry="6" fill="#7a3f1a"/>`],
  ['Nail', 'high', 'Hammer blow', 'Pointed end → tiny area', 'HIGH', 'Nail goes in easily',
    `<rect x="20" y="110" width="160" height="40" fill="#8a5a33"/><rect x="94" y="30" width="12" height="80" fill="#9aa4b0"/><path d="M94 110 L100 128 L106 110 Z" fill="#9aa4b0"/><rect x="78" y="22" width="44" height="10" rx="3" fill="#c3cad4"/>`],
  ['Knife', 'high', 'Push of your hand', 'Sharp edge → very small area', 'HIGH', 'Cuts the apple easily',
    `<circle cx="100" cy="105" r="42" fill="#c0392b"/><path d="M98 64 Q104 50 112 52" stroke="#3a7a2a" stroke-width="5" fill="none"/><path d="M30 60 L170 60 L170 76 L40 80 Z" fill="#d3d9e0"/><rect x="150" y="56" width="40" height="22" rx="5" fill="#3b2a1a"/>`],
  ['Elephant feet', 'low', '20 000 N weight', 'Four broad feet → large area', 'LOW', 'Does not sink into soft ground',
    `<ellipse cx="100" cy="70" rx="70" ry="42" fill="#7d8590"/><rect x="45" y="90" width="22" height="50" rx="8" fill="#6b727c"/><rect x="132" y="90" width="22" height="50" rx="8" fill="#6b727c"/><circle cx="160" cy="58" r="26" fill="#7d8590"/><path d="M178 70 Q190 110 175 130" stroke="#7d8590" stroke-width="12" fill="none"/>`],
  ['Person on sand', 'low', 'Body weight', 'Lying: large area vs standing: small area', 'LOW when lying', 'Sinks less when lying',
    `<rect x="0" y="110" width="200" height="40" fill="#e0bf85"/><circle cx="60" cy="40" r="12" fill="#a86d48"/><rect x="50" y="54" width="20" height="40" rx="6" fill="#2e6fb3"/><rect x="52" y="92" width="7" height="24" fill="#2b2f3a"/><rect x="61" y="92" width="7" height="24" fill="#2b2f3a"/><rect x="100" y="98" width="80" height="12" rx="6" fill="#2e6fb3"/><circle cx="188" cy="102" r="10" fill="#a86d48"/>`],
];
S({
  id: 'apps', sec: 1, title: 'Pressure in everyday life', sub: 'Click an object. Do we want LOW pressure or HIGH pressure?',
  html: `<div class="row">
    <div class="col" style="width:1080px;flex:none"><div class="apps">${APPS.map((a, i) => `<button class="app" data-app="${i}"><canvas data-w="240" data-h="150" data-s="1.02"></canvas>${a[0]}</button>`).join('')}
      <div class="app" style="cursor:default;justify-content:center;font-size:24px;background:transparent;border-style:dashed">Small area → <span class="loP">HIGH</span> pressure<br>Large area → <span class="hiP">LOW</span> pressure</div></div></div>
    <div class="side"><div class="card" id="appd" style="display:flex;flex-direction:column;gap:16px"></div></div></div>`,
  setup(api) {
    let cur = 0;
    api.$$('.app[data-app] canvas').forEach((cv, i) => api.sim(cv, { name: 'app' + i, draw(c) { appArt(c, i); } }));
    const show = i => {
      cur = i;
      const a = APPS[i];
      api.$$('.app[data-app]').forEach(b => b.classList.toggle('on', +b.dataset.app === i));
      api.$('#appd').innerHTML = `<h3 style="font-size:46px">${a[0]}</h3>
        <div style="font-size:30px;font-weight:700;color:${a[1] === 'high' ? 'var(--lo)' : 'var(--hi)'}">Goal: ${a[1] === 'high' ? 'INCREASE pressure (make the area small)' : 'REDUCE pressure (make the area large)'}</div>
        <div class="fapr"><span class="k" style="color:var(--warm)">Force</span><span>${a[2]}</span><span class="k" style="color:var(--cool)">Area</span><span>${a[3]}</span><span class="k" style="color:var(--bolt)">Pressure</span><span style="font-weight:700">${a[4]}</span><span class="k" style="color:var(--safe)">Result</span><span>${a[5]}</span></div>
        `;
    };
    api.on('.app[data-app]', 'click', e => show(+e.currentTarget.dataset.app));
    show(0);
  }
});

S({
  id: 'nailknife', sec: 1, title: 'Nail and knife: we WANT high pressure', sub: 'Same force each time. Change only the area.',
  hint: 'Safety first: do the nail and knife activities only under the supervision of an adult.',
  html: `<div class="row">
    <div class="vis"><canvas id="nkcv" data-w="1080" data-h="600" data-s=".88"></canvas>
      <div class="ctrls"><span class="big" style="width:96px">Nail</span><div class="seg"><button class="btn on" data-nend="point">Pointed end</button><button class="btn" data-nend="head">Head end</button></div>
        <button class="btn go" id="strike">Hammer it!</button><button class="btn" id="nkreset">↺ Reset</button></div>
      <div class="ctrls"><span class="big" style="width:96px">Knife</span><div class="seg"><button class="btn on" data-kedge="sharp">Sharp edge</button><button class="btn" data-kedge="blunt">Blunt edge</button></div>
        <button class="btn go" id="cut">Press knife</button></div>
      ${slider('narea', 'Nail contact area', 1, 50, 1, 1, 'tiny', 'large')}</div>
    <div class="side">
      <div class="card"><h3>What we observe</h3><ul class="pts">
        <li>The <span class="key">pointed end</span> of a nail goes in easily.</li>
        <li>The <span class="key">sharp edge</span> of a knife cuts the apple easily.</li>
        <li>Smaller area → <span class="loP">higher pressure</span> → easier task.</li></ul></div>
      ${mcq('Why are knives sharpened?', ['To make them heavier', 'To reduce the area of the edge and increase pressure', 'To increase the area of the edge'], 1, 'Correct! A sharp edge has a very small area, so the same push produces a much greater pressure.')}
    </div></div>`,
  setup(api) {
    const inp = api.$('#narea');
    const st = { depth: 0, hits: 0, hammer: 0, cut: 0, cutting: 0, edge: 'sharp' };
    const pr = () => 1 / +inp.value; // relative pressure
    const sim = api.sim('#nkcv', {
      autoplay: true,
      update(s, dt) {
        if (st.hammer > 0) { st.hammer -= dt * 3; if (st.hammer <= .5 && !st.hit) { st.hit = 1; st.depth = Math.min(150, st.depth + 60 * Math.pow(pr(), .55)); } }
        if (st.cutting) { const tgt = st.edge === 'sharp' ? 1 : .06; st.cut = Math.min(tgt, st.cut + dt * .8); if (st.cut >= tgt) st.cutting = 0; }
      },
      draw(c) {
        D.sky(c, 0, 0, 1080, 600, '#1d2638', '#121a2a');
        c.fillStyle = '#2a3b5c'; c.fillRect(538, 20, 4, 560);
        // ---- nail ----
        const area = +inp.value, wy = 380;
        const wg = c.createLinearGradient(0, wy, 0, 560); wg.addColorStop(0, '#a87445'); wg.addColorStop(1, '#6e4626');
        c.fillStyle = wg; c.fillRect(40, wy, 460, 180);
        D.tex(c, 40, wy, 460, 180, 'wood', .9);
        const nx = 270, d = st.depth, tipW = 2 + (area - 1) / 49 * 34, head = st.headEnd;
        const ntop = wy - 200 + d;
        c.save(); c.beginPath(); c.rect(0, 0, 540, 600); c.clip();
        const ng = c.createLinearGradient(nx - 9, 0, nx + 9, 0); ng.addColorStop(0, '#7d8794'); ng.addColorStop(.5, '#e2e7ee'); ng.addColorStop(1, '#7d8794');
        c.fillStyle = ng;
        if (!head) {
          c.fillRect(nx - 8, ntop, 16, 200 - 24);
          c.beginPath(); c.moveTo(nx - 8, ntop + 176); c.lineTo(nx + 8, ntop + 176); c.lineTo(nx + tipW / 2, ntop + 200); c.lineTo(nx - tipW / 2, ntop + 200); c.fill();
          c.fillRect(nx - 26, ntop - 10, 52, 12);
        } else {
          c.fillRect(nx - 8, ntop - 10, 16, 190); c.fillRect(nx - 26, ntop + 188, 52, 12);
          c.beginPath(); c.moveTo(nx - 8, ntop - 10); c.lineTo(nx, ntop - 30); c.lineTo(nx + 8, ntop - 10); c.fill();
        }
        // hammer
        const hy = ntop - (head ? 34 : 14) - 60 - Math.max(0, st.hammer - .5) * 2 * 120;
        c.fillStyle = '#6b4a2b'; c.fillRect(nx + 30, hy + 20, 190, 18);
        c.fillStyle = '#4b535e'; D.rr(c, nx - 40, hy, 80, 60, 8); c.fill();
        c.restore();
        // contact arrows
        const n = Math.max(1, Math.round(tipW / 7));
        for (let i = 0; i < n; i++) { const x = nx - tipW / 2 + tipW * (i + .5) / n; D.arrow(c, x, wy + d + 4, x, wy + d + 14 + 70 * Math.pow(pr(), .6), { color: COL.lo, w: 3 + 4 * Math.pow(pr(), .5), head: 12, outline: false }); }
        D.label(c, head ? 'Head end: large area' : (area < 5 ? 'Pointed end: tiny area' : 'Blunt tip: bigger area'), 270, 40, { size: 28, color: COL.bolt, force: true });
        D.label(c, `Nail went in: ${(d / 15).toFixed(1)} cm`, 270, 90, { size: 26 });
        // ---- knife ----
        const ax = 810, ay = 400, R = 120, cutY = st.cut;
        c.fillStyle = '#6a4626'; c.fillRect(600, 520, 440, 30); D.tex(c, 600, 520, 440, 30, 'wood', .8);
        const split = st.edge === 'sharp' ? seg01(cutY, .9, 1) * 26 : 0;
        [-1, 1].forEach(sd => {
          c.save(); c.beginPath(); c.rect(sd < 0 ? ax - R - 40 : ax, 0, R + 40, 600); c.clip();
          c.translate(sd * split, 0);
          const ag = c.createRadialGradient(ax - 40, ay - 40, 10, ax, ay, R);
          ag.addColorStop(0, '#ff7a6b'); ag.addColorStop(.6, '#c0392b'); ag.addColorStop(1, '#7a1d14');
          c.fillStyle = ag; c.beginPath(); c.ellipse(ax, ay, R, R * .95 - (st.edge === 'blunt' ? cutY * 120 : 0), 0, 0, TAU); c.fill();
          if (split > 0) { c.fillStyle = '#f5e6c4'; c.fillRect(ax - 3 * sd - (sd > 0 ? 0 : 0), ay - R * .9, 3 * sd, R * 1.8); }
          c.restore();
        });
        c.strokeStyle = '#3a7a2a'; c.lineWidth = 6; c.beginPath(); c.moveTo(ax, ay - R + 4); c.quadraticCurveTo(ax + 10, ay - R - 30, ax + 30, ay - R - 34); c.stroke();
        const ky = ay - R - 60 + cutY * (R * 2 + 10);
        const ew = st.edge === 'sharp' ? 1 : 14;
        c.fillStyle = '#d6dce4'; c.beginPath(); c.moveTo(ax - 150, ky - 60); c.lineTo(ax + 120, ky - 60); c.lineTo(ax + 120, ky - ew / 2 + 2); c.lineTo(ax - 150, ky - ew / 2 + 2 - 10); c.closePath(); c.fill();
        c.fillStyle = '#9aa4b0'; c.fillRect(ax - 150, ky - ew / 2 - 8, 270, ew);
        c.fillStyle = '#3b2a1a'; D.rr(c, ax + 110, ky - 66, 120, 40, 8); c.fill();
        D.label(c, st.edge === 'sharp' ? 'Sharp edge: tiny area' : 'Blunt edge: larger area', 810, 40, { size: 28, color: COL.bolt, force: true });
        D.label(c, st.edge === 'sharp' ? (cutY >= 1 ? 'Cut through!' : '') : (cutY > .05 ? 'Only squashes the apple' : ''), 810, 90, { size: 26 });
      }
    });
    const setEnd = e => { const v = e.currentTarget.dataset.nend; st.headEnd = v === 'head'; inp.value = v === 'head' ? 50 : 1; api.$$('[data-nend]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); st.depth = 0; sim.dirty = true; };
    api.on('[data-nend]', 'click', setEnd);
    api.on('[data-kedge]', 'click', e => { st.edge = e.currentTarget.dataset.kedge; st.cut = 0; st.cutting = 0; api.$$('[data-kedge]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); });
    inp.addEventListener('input', () => { st.headEnd = false; api.$$('[data-nend]').forEach((b, i) => b.classList.toggle('on', i === 0 && +inp.value < 5)); st.depth = 0; });
    api.$('#strike').addEventListener('click', () => { if (st.hammer <= 0) { st.hammer = 1; st.hit = 0; } });
    api.$('#cut').addEventListener('click', () => { st.cut = 0; st.cutting = 1; });
    api.$('#nkreset').addEventListener('click', () => { st.depth = 0; st.cut = 0; st.cutting = 0; });
  }
});

S({
  id: 'elephant', sec: 1, title: 'How heavy is an elephant\'s push?', sub: 'Textbook problem: weight 20 000 N, area of one foot 0.25 m².',
  html: `<div class="row">
    <div class="vis"><canvas id="elcv" data-w="1080" data-h="640"></canvas>
      <div class="ctrls"><button class="btn go" id="elnext">Next step ▶</button><button class="btn" id="elreset">↺ Start again</button><button class="btn" id="elone">Compare: all weight on ONE foot's area</button></div></div>
    <div class="side"><div class="chain" id="elsteps">
      <div class="st">1. Force = weight = <b class="mono">20 000 N</b></div>
      <div class="st">2. Area of one foot = <b class="mono">0.25 m²</b></div>
      <div class="st">3. Total area = 4 × 0.25 = <b class="mono">1 m²</b></div>
      <div class="st">4. Pressure = 20 000 N ÷ 1 m² = <b class="mono">20 000 Pa</b></div></div>
      <div class="card reveal" id="elcmp" style="border-color:var(--lo)"><h3>Only one foot's area (0.25 m²)?</h3>
        Pressure = 20 000 ÷ 0.25 = <b class="mono" style="color:var(--lo)">80 000 Pa</b><br>That is <b>4 times</b> more! Four broad feet keep the pressure low.</div>
      <div class="card explain" style="font-size:27px">The weight is shared by all four feet, so the force is spread over a larger total area.</div>
    </div></div>`,
  setup(api) {
    let step = 1, one = false;
    const steps = api.$$('#elsteps .st');
    const paint = () => steps.forEach((s, i) => { s.classList.toggle('lit', i < step - 1); s.classList.toggle('now', i === step - 1); });
    const sim = api.sim('#elcv', {
      autoplay: true,
      draw(c) {
        const t = this.t;
        D.sky(c, 0, 0, 1080, 640, '#e7c58b', '#f6e4bf');
        c.fillStyle = '#b48a52'; c.fillRect(0, 520, 1080, 120);
        D.hills(c, 1080, 470, { layers: 2, amp: 60, far: '#c9b48c', near: '#a88f62' });
        D.sand(c, 0, 520, 1080, 120, '#b8935a');
        const EX = 170, EY = 528, ES = 640, ex = EX + ES * .5, ey = 300;
        D.elephant(c, EX, EY, ES, t);
        const legs = [[EX + ES * .30, 1], [EX + ES * .36, 0], [EX + ES * .705, 1], [EX + ES * .77, 0]];
        if (step >= 1) { D.arrow(c, ex, 40, ex, 200, { color: COL.warm, w: 22 }); D.label(c, 'Weight = 20 000 N', ex + 220, 80, { size: 30, color: COL.warm, force: true }); }
        if (step >= 2) {
          const feet = one ? [legs[0]] : legs;
          feet.forEach(([lx], i) => {
            c.fillStyle = 'rgba(88,220,255,.35)'; c.strokeStyle = COL.cool; c.lineWidth = 4;
            c.beginPath(); c.ellipse(lx, 526, 40, 12, 0, 0, TAU); c.fill(); c.stroke();
          });
          D.label(c, '0.25 m² each', legs[0][0] + 10, 590, { size: 26, color: COL.cool });
        }
        if (step >= 3 && !one) { legs.forEach(([lx]) => D.arrow(c, lx, 410, lx, 505, { color: COL.safe, w: 9 })); D.label(c, '4 feet share the weight', 760, 590, { size: 26, color: COL.safe }); }
        if (one) { D.arrow(c, legs[0][0], 360, legs[0][0], 505, { color: COL.lo, w: 22 }); }
        if (step >= 4 || one) D.meter(c, 940, 130, 80, one ? .95 : .35, 'Pressure', one ? '80 000 Pa' : '20 000 Pa', one ? COL.lo : COL.safe);
      }
    });
    api.$('#elnext').addEventListener('click', () => { step = Math.min(4, step + 1); paint(); sim.dirty = true; });
    api.$('#elreset').addEventListener('click', () => { step = 1; one = false; api.$('#elcmp').classList.remove('show'); api.$('#elone').classList.remove('on'); paint(); });
    paint();
    api.$('#elone').addEventListener('click', e => { one = !one; step = 4; paint(); e.currentTarget.classList.toggle('on', one); api.$('#elcmp').classList.toggle('show', one); });
  }
});

S({
  id: 'calc', sec: 1, title: 'Pressure calculator', sub: 'Move the sliders, or try a textbook example.',
  html: `<div class="row">
    <div class="vis"><canvas id="pccv" data-w="1000" data-h="520"></canvas>
      ${slider('pcf', 'Force', 50, 20000, 50, 100, '', 'N')}
      ${slider('pca', 'Area', .25, 10, .25, 2, '', 'm²')}</div>
    <div class="side">
      <div class="formula" id="pcform" style="font-size:42px"></div>
      <div class="ctrls"><button class="btn" data-pre="100,2">Textbook: 100 N on 2 m²</button><button class="btn" data-pre="20000,1">Elephant</button></div>
      <div class="card"><h3>Boat challenge</h3>
        <div style="font-size:27px">Each person weighs <b class="mono">700 N</b>.<br>Boat A: 5 persons, base <b class="mono">7 m²</b>. Boat B: 3 persons, base <b class="mono">3.5 m²</b>.<br>Which base feels more pressure?</div>
        <div class="ctrls" style="margin-top:10px"><button class="btn" data-pre="3500,7">Try boat A</button><button class="btn" data-pre="2100,3.5">Try boat B</button><button class="btn go" id="boatans">Show answer</button></div>
        <div class="reveal" id="boatr" style="font-size:27px;margin-top:10px">A: 3500 ÷ 7 = <b class="mono">500 Pa</b> · B: 2100 ÷ 3.5 = <b class="mono">600 Pa</b><br><span class="key">Boat B</span> has more pressure, by <b class="mono">100 Pa</b>.</div></div>
    </div></div>`,
  setup(api) {
    const F = api.$('#pcf'), A = api.$('#pca');
    let shownP = 50;
    const fmt = n => (Math.round(n * 10) / 10).toLocaleString('en-IN');
    const upd = () => { api.$('#pcform').innerHTML = `<span class="p">P</span> = <span class="f">${(+F.value).toLocaleString('en-IN')} N</span> ÷ <span class="a">${+A.value} m²</span><br>= <span class="p" id="pcout">${fmt(shownP)}</span> <span class="p">Pa</span>`; };
    const sim = api.sim('#pccv', {
      idle(s, dt) {
        const P = +F.value / +A.value; const old = shownP; shownP += (P - shownP) * Math.min(1, dt * 6); if (Math.abs(P - shownP) < .05) shownP = P;
        if (old !== shownP) { const o = api.$('#pcout'); if (o) o.textContent = fmt(shownP); }
      },
      draw(c) {
        const f = +F.value, a = +A.value, P = f / a;
        D.sky(c, 0, 0, 1000, 520, '#182235', '#0f1726');
        c.fillStyle = '#4a5466'; c.fillRect(0, 400, 1000, 120); D.tex(c, 0, 400, 1000, 120, 'speck', .45);
        const bw = 80 + a * 52, bh = 60 + Math.sqrt(f) * 1.2, bx = 330 - bw / 2;
        const g = c.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, '#7a5530'); g.addColorStop(.5, '#a8794a'); g.addColorStop(1, '#6b4726');
        c.fillStyle = g; c.fillRect(bx, 400 - bh, bw, bh); D.tex(c, bx, 400 - bh, bw, bh, 'wood', .8);
        c.strokeStyle = 'rgba(40,20,5,.6)'; c.lineWidth = 3; c.strokeRect(bx, 400 - bh, bw, bh);
        D.arrow(c, 330, 400 - bh - 130, 330, 400 - bh - 10, { color: COL.warm, w: 6 + Math.sqrt(f) * .1 });
        D.label(c, `Force ${f.toLocaleString('en-IN')} N`, 330, 400 - bh - 160, { size: 26, color: COL.warm });
        const pf = clamp(Math.log10(P + 1) / Math.log10(80001), 0, 1);
        const n = Math.max(3, Math.round(bw / 40));
        for (let i = 0; i < n; i++) { const x = bx + bw * (i + .5) / n; D.arrow(c, x, 410, x, 420 + pf * 70, { color: mix('#43e08a', '#ff6266', pf), w: 5, head: 12, outline: false }); }
        c.fillStyle = 'rgba(88,220,255,.6)'; c.fillRect(bx, 398, bw, 5);
        D.label(c, `Area ${a} m²`, 330, 495, { size: 26, color: COL.cool });
        D.meter(c, 800, 260, 110, pf, 'Pressure', fmt(shownP) + ' Pa', mix('#43e08a', '#ff6266', pf));
      }
    });
    [F, A].forEach(i => i.addEventListener('input', () => { upd(); sim.dirty = true; }));
    api.on('[data-pre]', 'click', e => { const [f, a] = e.currentTarget.dataset.pre.split(','); F.value = f; A.value = a; upd(); });
    api.$('#boatans').addEventListener('click', () => api.$('#boatr').classList.add('show'));
    upd();
  }
});

S({
  id: 'check1', sec: 1, title: 'Concept check: Pressure', kick: 'Check your understanding',
  html: `<div class="qgrid">
    ${mcq('Why are broad bag straps more comfortable?', ['They make the bag lighter', 'They spread the weight over a larger area, so pressure is less', 'They increase the force on the shoulders'], 1, 'Yes! The weight is the same, but the area is larger, so the pressure on the shoulders is less.')}
    ${mcq('The same 50 N force acts on two areas. Which gives greater pressure?', ['On 0.01 m² (small)', 'On 0.5 m² (large)', 'Both the same'], 0, 'Right! 50 ÷ 0.01 = 5000 Pa, but 50 ÷ 0.5 = 100 Pa. A smaller area gives greater pressure.')}
    ${mcq('What is the SI unit of pressure?', ['newton (N)', 'pascal (Pa) = N/m²', 'metre² (m²)'], 1, 'Correct. 1 pascal = 1 newton per square metre.')}
    ${mcq('A force of 100 N acts on a cardboard of area 2 m². What is the pressure?', ['200 Pa', '50 Pa', '102 Pa'], 1, 'Correct: Pressure = 100 N ÷ 2 m² = 50 N/m² = 50 Pa.')}
  </div>`
});

/* ============ SECTION 0: Hook, Probe & Ponder, Roadmap ============ */
S({
  id: 'hook', sec: 0, full: true, name: 'Cinematic opening', hint: 'Press Play. Let the scene run, then discuss the questions.',
  html: `<div style="position:relative;width:1920px;height:936px">
    <canvas id="hookcv" data-w="1920" data-h="936" style="border-radius:0;border:0"></canvas>
    <div id="hookcap" style="position:absolute;left:56px;bottom:120px;max-width:1100px;font-family:var(--f-display);font-weight:800;font-size:64px;line-height:1.05;text-shadow:0 4px 18px rgba(0,0,0,.85);transition:opacity .6s"></div>
    <div style="position:absolute;left:56px;bottom:34px">${ctl('main', { playTxt: 'Play the scene' })}</div>
    <div id="hookq" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(4,8,16,.72)">
      <div style="display:flex;flex-direction:column;gap:22px;width:1500px">
        <div class="kick" style="font-size:36px">Think before we begin</div>
        ${['Why does air move?', 'Why does wind sometimes become extremely strong?', 'How can invisible air pressure move objects?', 'How can a storm become a cyclone?']
      .map((q, i) => `<div class="card hq" style="font-size:52px;font-weight:700;padding:20px 30px;opacity:0;animation:pop .6s ${0.4 + i * .9}s ease forwards">${q}</div>`).join('')}
        <div style="display:flex;gap:16px;margin-top:10px"><button class="btn go" id="hookgo" style="height:70px;font-size:32px">Let's find out ▶</button><button class="btn" id="hookagain" style="height:70px;font-size:30px">↺ Watch again</button></div>
      </div>
    </div></div>`,
  setup(api) {
    const caps = [[0, 'A calm, sunny afternoon…'], [5, 'The wind begins to pick up. Trees start to sway.'], [11, 'Clouds gather and darken. The air pressure is falling.'], [17, 'Rain begins to pour down.'], [22, 'Lightning flashes… and then thunder rumbles.'], [31.5, 'Over warm oceans, storms like this can grow into a giant, spinning cyclone.']];
    const cap = api.$('#hookcap'), qbox = api.$('#hookq');
    const trees = [[140, 800, 300, 1], [380, 820, 240, 2], [620, 790, 210, 3], [1500, 815, 280, 4], [1760, 800, 330, 5]];
    const sim = api.sim('#hookcv', {
      autoplay: true,
      reset(s) {
        s.cap = -1; s.flash = 0; s.bolt = null; s.fired = {}; s.leaves = []; s.drops = [];
        const R = rng(9); for (let i = 0; i < 260; i++) s.drops.push({ x: R() * 1920, y: R() * 936, v: 900 + R() * 400 });
        for (let i = 0; i < 40; i++) s.leaves.push({ x: R() * 1920, y: 600 + R() * 300, a: R() * 6, v: .5 + R() });
        cap.textContent = 'Press Play to begin.'; qbox.style.display = 'none';
      },
      update(s, dt) {
        const t = this.t;
        let k = -1; caps.forEach(([tt], i) => { if (t >= tt) k = i; });
        if (k !== s.cap) { s.cap = k; cap.style.opacity = 0; setTimeout(() => { cap.textContent = caps[k][1]; cap.style.opacity = 1; }, 250); }
        [23, 26.4, 29.2].forEach((ft, i) => {
          if (t >= ft && !s.fired[i]) { s.fired[i] = 1; s.flash = 1; const x = 400 + i * 420; s.bolt = D.genBolt(x, 120, x + 120 - i * 80, 780, 50 + i * 7); thunder(.7, .8); }
        });
        s.flash = Math.max(0, s.flash - dt * 2.2);
        const wind = Math.min(1, seg01(t, 5, 12) * .6 + seg01(t, 12, 20) * .4);
        const rain = seg01(t, 17, 20);
        s.drops.forEach(d => { d.y += d.v * dt; d.x += wind * 260 * dt; if (d.y > 936) { d.y = -20; d.x = Math.random() * 2100 - 200; } if (d.x > 1960) d.x -= 2000; });
        s.leaves.forEach(l => { l.x += (60 + wind * 520) * dt * l.v; l.y += Math.sin(t * 3 + l.a) * 60 * dt - wind * 30 * dt * l.v; l.a += dt * 6; if (l.x > 1960) { l.x = -40; l.y = 600 + Math.random() * 300; } });
        if (t > 38 && qbox.style.display !== 'flex') { qbox.style.display = 'flex'; this.pause(); }
        s.rain = rain;
      },
      draw(c, s) {
        const t = this.t;
        const wind = Math.min(1, seg01(t, 5, 12) * .6 + seg01(t, 12, 20) * .4), dark = seg01(t, 11, 18), rain = seg01(t, 17, 20), cyc = seg01(t, 31, 34.5);
        if (cyc < 1) {
          D.sky(c, 0, 0, 1920, 936, mix('#4f9ee6', '#262f3c', dark), mix('#cfe6f7', '#4b5664', dark));
          D.sun(c, 1500, 150, 70, 1 - dark);
          // distant hills
          D.hills(c, 1920, 690, { layers: 3, amp: 140, far: mix('#9db3c7', '#3a4452', dark), near: mix('#5f7a48', '#2c3a24', dark), step: 26 });
          for (let i = 0; i < 5; i++) D.cloud(c, ((i * 430 + t * (12 + wind * 70)) % 2400) - 240, 120 + (i % 2) * 70, 420, 170, { seed: i + 1, dark: dark * .8 });
          for (let i = 0; i < 6; i++) D.cloud(c, ((i * 380 + 150 + t * (20 + wind * 90)) % 2400) - 240, 110 + (i % 3) * 60, 760, 300, { seed: i + 11, type: 'st', dark: .55 + dark * .45, alpha: dark });
          D.ground(c, 0, 760, 1920, 176, { top: mix('#6f9440', '#33461f', dark), mid: mix('#56782f', '#26361a', dark) });
          D.house(c, 1000, 820, 260, 170, { lit: dark > .6 });
          trees.forEach(([x, y, h, sd], i) => D.tree(c, x, y, h, wind * (.75 + .25 * Math.sin(t * (2 + wind * 4) + i)), sd, { dark: dark > .5 }));
          c.fillStyle = mix('#c98a3a', '#6b4a22', dark);
          if (wind > .25) s.leaves.forEach(l => { c.save(); c.translate(l.x, l.y); c.rotate(l.a); c.globalAlpha = seg01(wind, .25, .5); c.beginPath(); c.ellipse(0, 0, 9, 4, 0, 0, TAU); c.fill(); c.restore(); });
          if (wind > .1) { c.save(); c.strokeStyle = `rgba(255,255,255,${wind * .35})`; c.lineWidth = 2; for (let i = 0; i < 26; i++) { const y = 120 + (i * 97) % 640, x = ((i * 311 + t * (500 + wind * 900)) % 2300) - 200; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 90 + wind * 120, y + 4); c.stroke(); } c.restore(); }
          if (rain > 0) D.rainDrops(c, s.drops, rain * .9, wind);
          if (s.flash > 0) { c.fillStyle = `rgba(220,225,255,${s.flash * .35})`; c.fillRect(0, 0, 1920, 936); D.bolt(c, s.bolt, Math.min(1, s.flash * 1.6)); }
          D.meter(c, 1740, 380, 90, .75 - dark * .55, 'Air pressure', (1012 - Math.round(dark * 16)) + ' mb', dark > .5 ? COL.lo : COL.bolt);
        }
        if (cyc > 0) {
          c.save(); c.globalAlpha = cyc;
          D.oceanTop(c, 0, 0, 1920, 936);
          D.cyclone(c, 960, 468, 520 + (1 - cyc) * 200, -t * .35, 1);
          c.restore();
          D.label(c, 'Satellite-style view (from above)', 960, 60, { size: 30, alpha: cyc });
          D.label(c, 'Eye', 960, 468, { size: 30, alpha: cyc, bg: 'rgba(6,10,19,.55)' });
        }
        if (this.t === 0) { c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 0, 1920, 936); }
      }
    });
    api.$('#hookgo').addEventListener('click', () => go(cur + 1));
    api.$('#hookagain').addEventListener('click', () => { sim.reset(); sim.play(); });
  }
});

S({
  id: 'probe', sec: 0, title: 'Probe and ponder', kick: 'Before we start',
  sub: 'Wind exerts a force on leaves, trees, doors and clothes. This force creates <span class="key">wind pressure</span>.',
  html: `<div class="row" style="flex-direction:column;gap:22px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;flex:1">
      ${[
      ['Why are winds stronger on some days than on others?', 'Formation of wind', 4, COL.cool],
      ['Why are water tanks usually placed at a height?', 'Liquid pressure', 2, COL.water],
      ['Can air pressure really crush us?', 'Air pressure', 3, COL.hi],
      ['What causes storms and cyclones? If the Earth stopped rotating, would cyclones still form?', 'Storms & cyclones', 6, COL.lo]]
      .map(([q, s, sec, col]) => `<div class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;border-left:10px solid ${col}">
        <div style="font-size:42px;font-weight:700;line-height:1.15">${q}</div>
        <div><button class="btn" data-gosec="${sec}">We find out in: ${s} ▶</button></div></div>`).join('')}
    </div>
    <div class="card explain" style="font-size:30px">Keep these questions in mind. By the end of the chapter, you will be able to answer every one of them.</div>
  </div>`,
  setup(api) { api.on('[data-gosec]', 'click', e => goSection(+e.currentTarget.dataset.gosec)); }
});

S({
  id: 'roadmap', sec: 0, title: 'Our journey through the chapter', kick: 'Chapter roadmap', sub: 'Click any station to jump there.',
  html: `<div class="roadmap" id="rm"><svg viewBox="0 0 1808 760" preserveAspectRatio="none"><path id="rmpath" d="" fill="none" stroke="#2f4670" stroke-width="10" stroke-dasharray="4 22" stroke-linecap="round"/></svg></div>`,
  setup(api) {
    const pos = [[150, 110], [520, 110], [890, 110], [1260, 110], [1640, 110], [1640, 390], [1260, 390], [890, 390], [520, 390], [150, 390], [150, 670], [700, 670], [1250, 670]];
    const names = SECTIONS.slice(1);
    const host = api.$('#rm');
    let d = `M${pos[0][0]} ${pos[0][1]}`;
    for (let i = 1; i < pos.length; i++) {
      const [x0, y0] = pos[i - 1], [x, y] = pos[i];
      if (y0 === y) d += ` L${x} ${y}`; else { const side = x > 900 ? 120 : -120; d += ` C${x0 + side} ${y0} ${x + side} ${y} ${x} ${y}`; }
    }
    api.$('#rmpath').setAttribute('d', d);
    pos.forEach(([x, y], i) => {
      const b = document.createElement('button'); b.className = 'station'; b.style.left = (x / 1808 * 100) + '%'; b.style.top = (y / 760 * 100) + '%';
      b.innerHTML = `<span class="dot">${i + 1}</span><span class="nm">${names[i]}</span>`; b.dataset.sec = i + 1;
      b.addEventListener('click', () => goSection(i + 1)); host.appendChild(b);
    });
  },
  enter(api) {
    let nextSet = false;
    api.$$('.station').forEach(b => {
      const sec = +b.dataset.sec, done = visitedSec.has(sec);
      b.classList.toggle('done', done); b.classList.remove('next');
      if (!done && !nextSet) { b.classList.add('next'); nextSet = true; }
    });
  }
});

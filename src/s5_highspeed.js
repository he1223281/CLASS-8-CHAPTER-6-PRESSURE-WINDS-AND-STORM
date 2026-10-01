/* ============ SECTION 5: HIGH-SPEED WINDS & LOW PRESSURE ============ */
S({
  id: 'twoballoons', sec: 5, title: 'Blowing between two balloons', sub: 'Activity 6.6: two balloons hang 6–10 cm apart.',
  html: `<div class="row">
    <div class="vis"><canvas id="tbcv" data-w="1000" data-h="620"></canvas>
      ${slider('tbv', 'Wind speed', 0, 1, .01, 0, 'LOW', 'HIGH')}</div>
    <div class="side">
      ${predict('If we blow air into the gap between them, will the balloons…', ['move APART', 'come CLOSER', 'not move'])}
      <div class="card reveal" id="tbwhy" style="border-color:var(--safe)"><h3>They come closer!</h3><ul class="pts">
        <li>Fast-moving air between them → <span class="loP">lower pressure</span> in the gap.</li>
        <li><span class="hiP">Higher pressure</span> of the surrounding air pushes them <b>inward</b>.</li>
        <li>Blow harder → they move together faster.</li>
        <li>High-speed winds are accompanied by <span class="key">reduced air pressure</span>.</li></ul></div>
    </div></div>`,
  setup(api) {
    const V = api.$('#tbv');
    const R = rng(2), ps = Array.from({ length: 60 }, () => ({ y: R(), x: (R() - .5) * 50 }));
    const st = { ang: 0 };
    const sim = api.sim('#tbcv', {
      autoplay: true,
      update(s, dt) {
        const v = +V.value; st.ang += ((v * .2) - st.ang) * Math.min(1, dt * 3);
        ps.forEach(p => { p.y -= dt * (.2 + v * 2.2); if (p.y < 0) p.y = 1; });
      },
      draw(c) {
        const v = +V.value;
        D.sky(c, 0, 0, 1000, 620, '#1b2436', '#0f1726');
        c.fillStyle = '#8a6a44'; c.fillRect(200, 60, 600, 16);
        const pivL = [430, 76], pivR = [570, 76], L = 280, r = 95;
        const bal = ([px, py], a, col) => {
          const bx = px + Math.sin(a) * L, by = py + Math.cos(a) * L;
          c.strokeStyle = '#ddd'; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(bx, by - r); c.stroke();
          const g = c.createRadialGradient(bx - r * .35, by - r * .4, r * .1, bx, by, r);
          g.addColorStop(0, mix(col, '#ffffff', .4)); g.addColorStop(.7, col); g.addColorStop(1, mix(col, '#000000', .4));
          c.fillStyle = g; c.beginPath(); c.ellipse(bx, by, r * .9, r, 0, 0, TAU); c.fill();
          return [bx, by];
        };
        const [lx, ly] = bal(pivL, -.13 + st.ang, '#e0453a');
        const [rx, ry] = bal(pivR, .13 - st.ang, '#3a86e0');
        // straw blowing upward between
        c.fillStyle = '#e8e8f0'; c.fillRect(493, 520, 14, 90);
        if (v > .02) {
          ps.forEach(p => { const y = 520 - p.y * 440; c.strokeStyle = `rgba(150,230,255,${.3 + v * .6})`; c.lineWidth = 3; c.beginPath(); c.moveTo(500 + p.x * (1 - st.ang), y); c.lineTo(500 + p.x * (1 - st.ang), y + 16 + v * 30); c.stroke(); });
          D.label(c, 'fast air: LOW pressure', 500, 560, { size: 24, color: COL.lo });
          [[lx - 210, ly, lx - 100, ly], [rx + 210, ry, rx + 100, ry]].forEach(([a, b, c2, d]) => D.arrow(c, a, b, c2, d, { color: COL.hi, w: 6 + v * 10 }));
          D.label(c, 'higher pressure\npushes in', 110, ly - 120, { size: 24, color: COL.hi }); D.label(c, 'higher pressure\npushes in', 890, ry - 120, { size: 24, color: COL.hi });
        } else D.label(c, 'Move the slider\nto blow air', 830, 540, { size: 26 });
        D.label(c, `gap: ${Math.max(0, (rx - lx - 2 * r * .9) / 12).toFixed(1)} cm`, 500, 30, { size: 26, color: COL.bolt, force: true });
      }
    });
    V.addEventListener('input', () => { if (+V.value > .3) api.$('#tbwhy').classList.add('show'); });
  }
});

S({
  id: 'roof', sec: 5, title: 'Can strong winds blow off a roof?', sub: 'What would you do during a storm with high-speed winds?',
  html: `<div class="row">
    <div class="vis"><canvas id="rfcv" data-w="1080" data-h="600"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn on" data-win="0">Doors &amp; windows CLOSED</button><button class="btn" data-win="1">Doors &amp; windows OPEN</button></div></div>
      ${slider('rfv', 'Wind speed', 0, 1, .01, .2, 'calm', 'storm')}</div>
    <div class="side">
      ${mcq('A storm with very fast winds is coming. The roof is weak. What would you do?', ['Shut all doors and windows tightly', 'Keep doors and windows open', 'Climb onto the roof to hold it'], 1, 'As the textbook explains, keeping doors and windows open lets the wind move through the house too. This reduces the pressure difference between inside and above the roof, which helps prevent the roof from being blown off.', { tag: 'What would you do?' })}
      <div class="card"><ul class="pts">
        <li>Fast wind over the roof → <span class="loP">low pressure above</span>.</li>
        <li>Pressure inside is <span class="hiP">higher</span> → pushes the roof <b>up</b>.</li>
        <li>Large difference + weak roof → roof may blow away.</li></ul></div>
      <div class="ctrls">${discuss('Why are holes made in banners and hoardings?', 'Holes let the wind pass through the banner. This reduces the difference in air pressure between its two sides, so the wind exerts less force on it and is less likely to tear it down.')}</div>
    </div></div>`,
  setup(api) {
    const V = api.$('#rfv'); let open = 0;
    const R = rng(6), ps = Array.from({ length: 110 }, () => ({ x: R() * 1080, y: R(), k: .7 + R() * .6 }));
    const st = { lift: 0, gone: 0 };
    const sim = api.sim('#rfcv', {
      autoplay: true,
      update(s, dt) {
        const v = +V.value;
        ps.forEach(p => { p.x += (60 + v * 1300) * p.k * dt; if (p.x > 1100) { p.x = -20; p.y = Math.random(); } });
        const diff = v * v * (open ? .25 : 1);
        if (diff > .55 && !st.gone) st.lift = Math.min(1, st.lift + dt * (diff - .5) * 3); else if (!st.gone) st.lift = Math.max(0, st.lift - dt);
        if (st.lift >= 1) st.gone = 1;
        if (st.gone) st.gone = Math.min(4, st.gone + dt);
      },
      draw(c) {
        const t = this.t, v = +V.value, diff = v * v * (open ? .25 : 1);
        D.sky(c, 0, 0, 1080, 600, mix('#7ab8e8', '#3a4656', v), mix('#d8ecf8', '#7d8794', v)); D.ground(c, 0, 520, 1080, 80);
        D.tree(c, 120, 525, 240, v * .9 + Math.sin(t * 6) * .05 * v, 2);
        const hx = 360, hw = 380, hh = 220;
        const g = st.gone ? st.gone - 1 : 0;
        D.house(c, hx, 520, hw, hh, { roofLift: st.lift * 30 + Math.max(0, g) * 120, roofAng: g > 0 ? g * .5 : st.lift * .05 * Math.sin(t * 30), doorOpen: open, windowOpen: open });
        // wind streamlines
        ps.forEach(p => {
          const y = 60 + p.y * 400; let yy = y;
          const overRoof = p.x > hx - 40 && p.x < hx + hw + 40 && y > 140 && y < 300;
          if (overRoof) yy = y - 40 * Math.sin((p.x - hx + 40) / (hw + 80) * Math.PI);
          if (y > 300 && p.x > hx && p.x < hx + hw) return;
          c.strokeStyle = `rgba(255,255,255,${.25 + v * .5})`; c.lineWidth = overRoof ? 3.5 : 2.5; c.beginPath(); c.moveTo(p.x, yy); c.lineTo(p.x - 12 - v * 60 * (overRoof ? 1.4 : 1), yy); c.stroke();
        });
        if (open && v > .05) for (let i = 0; i < 6; i++) { const x = hx + ((t * 400 * v + i * 70) % hw); c.fillStyle = 'rgba(200,230,255,.7)'; c.beginPath(); c.arc(x, 520 - 120 + Math.sin(i) * 20, 5, 0, TAU); c.fill(); }
        if (v > .1 && !st.gone) {
          D.label(c, 'FAST wind → LOW pressure above roof', hx + hw / 2, 80, { size: 26, color: COL.lo });
          const k = clamp(diff, 0, 1);
          for (let i = 0; i < 4; i++) D.arrow(c, hx + 60 + i * 85, 470, hx + 60 + i * 85, 470 - 40 - k * 120, { color: COL.hi, w: 5 + k * 8, alpha: .9 });
          D.label(c, open ? 'inside pressure also reduced' : 'higher pressure inside', hx + hw / 2, 495, { size: 22, color: COL.hi });
          D.meter(c, 940, 180, 70, k, 'Pressure difference', '', k > .55 ? COL.lo : COL.safe);
        }
        if (st.gone) D.label(c, 'The roof was blown off! Try again with the doors and windows OPEN.', 540, 560, { size: 24, color: COL.lo, force: true });
        else if (open && v > .7) D.label(c, 'Roof stays on: pressure difference is much smaller', 540, 560, { size: 24, color: COL.safe, force: true });
      }
    });
    const rs = () => { st.lift = 0; st.gone = 0; };
    api.on('[data-win]', 'click', e => { open = +e.currentTarget.dataset.win; api.$$('[data-win]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); rs(); });
    V.addEventListener('input', () => { if (st.gone && +V.value < .3) rs(); });
    sim.o.reset = () => { rs(); V.value = .2; };
  }
});

S({
  id: 'check5', sec: 5, title: 'Concept check: High-speed winds', kick: 'Check your understanding',
  html: `<div class="qgrid">
    ${mcq('Why do the two balloons move together when air is blown between them?', ['The moving air pulls them', 'Fast air between them has lower pressure; higher outside pressure pushes them in', 'They become heavier'], 1, 'Correct! High-speed air is accompanied by reduced pressure, so the higher pressure outside pushes the balloons inward.')}
    ${mcq('Why can strong winds damage roofs?', ['Fast wind above makes low pressure; higher pressure below pushes the roof up', 'Wind makes the roof heavier', 'Rain softens the roof'], 0, 'Yes. If the pressure difference is large and the roof is weak, it may be blown away.')}
    ${mcq('High-speed winds are accompanied by…', ['increased air pressure', 'reduced air pressure', 'no change in pressure'], 1, 'Right: reduced air pressure.')}
    ${mcq('Blowing HARDER between the balloons makes them…', ['move apart', 'come together faster', 'stop moving'], 1, 'Correct. Faster air → even lower pressure in the gap → a larger push from outside.')}
  </div>`
});

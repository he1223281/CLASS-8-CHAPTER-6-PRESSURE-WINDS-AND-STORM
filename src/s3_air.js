/* ============ SECTION 3: PRESSURE EXERTED BY AIR ============ */
S({
  id: 'atmos', sec: 3, title: 'You can see water. Can you see air pressure?', sub: 'Air is invisible, but it pushes on everything.',
  html: `<div class="row">
    <div class="vis"><canvas id="atcv" data-w="1080" data-h="660"></canvas>
      <div class="ctrls"><button class="btn go" id="atzoom">Zoom in to a person ▶</button><button class="btn" id="atout">↺ Back to Earth</button></div></div>
    <div class="side">
      <div class="card"><h3>The atmosphere</h3><ul class="pts">
        <li>The envelope of air around the Earth is the <span class="key">atmosphere</span>.</li>
        <li>It extends up to <span class="key">many kilometres</span> above the surface.</li>
        <li>It contains nitrogen, oxygen, argon, carbon dioxide and other gases.</li></ul></div>
      <div class="card reveal" id="atr" style="border-color:var(--hi)"><h3>Air pushes from every side</h3><ul class="pts">
        <li>Tiny particles of air keep hitting every surface.</li>
        <li>The pressure exerted by the air around us is called <span class="key">atmospheric pressure</span>.</li></ul></div>
    </div></div>`,
  setup(api) {
    const st = { z: 0, tz: 0 };
    const R = rng(11), parts = [];
    for (let i = 0; i < 160; i++) parts.push({ x: R() * 1080, y: R() * 660, vx: (R() - .5) * 260, vy: (R() - .5) * 260 });
    const sim = api.sim('#atcv', {
      autoplay: true,
      update(s, dt) {
        st.z += (st.tz - st.z) * Math.min(1, dt * 1.6);
        parts.forEach(p => {
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < 0 || p.x > 1080) p.vx *= -1; if (p.y < 0 || p.y > 600) p.vy *= -1;
          // bounce off person (approx box)
          if (p.x > 500 && p.x < 580 && p.y > 300 && p.y < 600) { p.vx *= -1; p.x += p.vx * dt * 2; p.hit = .4; }
          p.hit = Math.max(0, (p.hit || 0) - dt);
        });
      },
      draw(c) {
        const t = this.t, z = ease(st.z);
        // space + earth
        if (z < 1) {
          c.save(); c.globalAlpha = 1 - z;
          c.fillStyle = '#02040a'; c.fillRect(0, 0, 1080, 660); D.stars(c, 1080, 660, 1, 8);
          const ex = 540, ey = 360, er = 230 * (1 + z * 3);
          D.earth(c, ex, ey, er);
          D.label(c, 'Atmosphere: a thin blanket of air', ex, ey - er * 1.18 - 34, { size: 28, color: COL.cool });
          c.restore();
        }
        if (z > 0) {
          c.save(); c.globalAlpha = z;
          D.sky(c, 0, 0, 1080, 660, '#6fb0e6', '#d6ebf8'); D.hills(c, 1080, 560, { layers: 2, amp: 70 }); D.ground(c, 0, 600, 1080, 60);
          D.person(c, 540, 600, 300, { shirt: '#c1497a' });
          parts.forEach(p => { c.fillStyle = p.hit > 0 ? '#ffe15a' : 'rgba(30,70,140,.75)'; c.beginPath(); c.arc(p.x, p.y, p.hit > 0 ? 6 : 4, 0, TAU); c.fill(); });
          const pts = [[430, 340, 0], [430, 470, 0], [650, 340, Math.PI], [650, 470, Math.PI], [540, 230, Math.PI / 2]];
          pts.forEach(([x, y, a]) => D.arrow(c, x - Math.cos(a) * 70, y - Math.sin(a) * 70, x, y, { color: COL.hi, w: 8 }));
          D.label(c, 'air pushes from ALL sides', 540, 60, { size: 30, color: COL.hi, force: true });
          D.label(c, 'dots = air particles (much enlarged)', 820, 640 - 18, { size: 20, color: '#fff' });
          c.restore();
        }
      }
    });
    api.$('#atzoom').addEventListener('click', () => { st.tz = 1; sim.play(); setTimeout(() => api.$('#atr').classList.add('show'), 1200); });
    api.$('#atout').addEventListener('click', () => { st.tz = 0; });
  }
});

S({
  id: 'plate', sec: 3, title: 'The paper plate experiment', sub: 'Activity 6.3: a stick through an inverted paper plate, covered with chart paper.',
  html: `<div class="row">
    <div class="vis"><canvas id="plcv" data-w="1080" data-h="600"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn on" data-sheet="fold">Folded sheet (small area)</button><button class="btn" data-sheet="open">Unfolded sheet (large area)</button></div>
        ${ctl('main', { playTxt: 'Lift the stick', slow: false }).replace('<div class="ctrls" data-for="main">', '').replace(/<\/div>$/, '')}</div></div>
    <div class="side">
      ${predict('Which is harder to lift?', ['Plate with the folded sheet', 'Plate with the unfolded sheet', 'Both the same'])}
      <div class="card reveal" id="plwhy" style="border-color:var(--safe)"><h3>Unfolded sheet: harder!</h3><ul class="pts">
        <li>The <b>weight</b> of the sheet did not change.</li>
        <li>Air pushes down on the sheet. Larger area → <span class="key">larger total force</span>.</li>
        <li>So, <span class="key">air exerts pressure</span> on objects.</li></ul></div>
    </div></div>`,
  setup(api) {
    let sheet = 'fold';
    const sim = api.sim('#plcv', {
      reset(s) { s.lift = 0; s.effort = 0; },
      update(s, dt) {
        const need = sheet === 'fold' ? .3 : .85;
        s.effort = Math.min(need, s.effort + dt * .6);
        if (s.effort >= need) s.lift = Math.min(1, s.lift + dt * (sheet === 'fold' ? 1.2 : .35));
        if (s.lift >= 1) { this.pause(); api.$('#plwhy').classList.add('show'); }
      },
      draw(c, s) {
        D.sky(c, 0, 0, 1080, 600, '#1b2436', '#121a2a');
        const tableY = 470;
        c.fillStyle = '#7a5532'; c.fillRect(40, tableY, 1000, 26); c.fillStyle = '#5c3e22'; c.fillRect(80, tableY + 26, 30, 110); c.fillRect(970, tableY + 26, 30, 110); D.tex(c, 40, tableY, 1000, 136, 'wood', .8);
        const cx = 470, ly = -s.lift * 60;
        const half = sheet === 'fold' ? 140 : 360;
        // sheet (lying on plate) + plate
        c.fillStyle = '#d9cfa8'; c.beginPath(); c.moveTo(cx - half, tableY + ly); c.lineTo(cx - 70, tableY - 40 + ly); c.lineTo(cx + 70, tableY - 40 + ly); c.lineTo(cx + half, tableY + ly); c.lineTo(cx + half, tableY + 3 + ly); c.lineTo(cx - half, tableY + 3 + ly); c.closePath(); c.fill();
        c.strokeStyle = '#a89a6c'; c.lineWidth = 2; c.stroke();
        if (sheet === 'fold') { c.strokeStyle = 'rgba(120,100,60,.6)'; c.beginPath(); c.moveTo(cx - half + 20, tableY - 6 + ly); c.lineTo(cx - 50, tableY - 34 + ly); c.stroke(); }
        c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(cx, tableY - 40 + ly, 70, 8, 0, 0, TAU); c.fill();
        // stick + hand
        c.fillStyle = '#9a6b3b'; c.fillRect(cx - 7, tableY - 300 + ly, 14, 262);
        c.fillStyle = '#b07650'; D.rr(c, cx - 34, tableY - 330 + ly, 68, 58, 20); c.fill();
        // air pressure arrows over sheet
        const n = Math.round(half / 36);
        for (let i = -n; i <= n; i++) { const x = cx + i * 36; if (Math.abs(i * 36) < 20) continue; D.arrow(c, x, tableY - 130 + ly, x, tableY - 60 + ly + Math.abs(i * 36) / half * 40, { color: COL.hi, w: 5, head: 14 }); }
        D.label(c, sheet === 'fold' ? 'small area: fewer pushes' : 'large area: MANY pushes', cx, tableY - 170 + ly, { size: 26, color: COL.hi });
                // effort meter
        D.meter(c, 920, 200, 90, s.effort / .9, 'Effort needed', s.effort > .7 ? 'HARD' : s.effort > .25 ? 'easy' : '', s.effort > .7 ? COL.lo : COL.safe);
      }
    });
    api.on('[data-sheet]', 'click', e => { sheet = e.currentTarget.dataset.sheet; api.$$('[data-sheet]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); sim.reset(); });
  }
});

S({
  id: 'balloon', sec: 3, title: 'Air pushes in ALL directions', sub: 'Blow air into a balloon and watch it grow.',
  html: `<div class="row">
    <div class="vis"><canvas id="blcv" data-w="1000" data-h="640"></canvas>
      <div class="ctrls"><button class="btn go" id="blpump">Blow air in</button><button class="btn" id="blopen">Open the mouth</button><button class="btn" id="blreset">↺ Reset</button></div></div>
    <div class="side">
      <div class="card"><ul class="pts">
        <li>Air filled inside pushes on the <span class="key">walls</span> of the balloon.</li>
        <li>It expands <span class="key">evenly, in every direction</span>.</li>
        <li>So, air exerts pressure in <span class="key">all directions</span>.</li></ul></div>
      ${mcq('If you open the mouth of an inflated balloon, which way does the air go?', ['From outside into the balloon', 'From inside (higher pressure) to outside (lower pressure)', 'It does not move'], 1, 'Yes! The air inside is at higher pressure, so it rushes out to the lower pressure outside. Remember this: it explains wind!')}
    </div></div>`,
  setup(api) {
    const st = { air: .5, open: false, pump: 0, ps: [] };
    const R = rng(5); for (let i = 0; i < 70; i++) st.ps.push({ a: R() * TAU, r: R(), v: .5 + R() });
    const sim = api.sim('#blcv', {
      autoplay: true,
      update(s, dt) {
        if (st.pump > 0) { st.pump -= dt; st.air = Math.min(1, st.air + dt * .35); }
        if (st.open) { st.air = Math.max(.12, st.air - dt * .25); if (st.air <= .12) st.open = false; }
        st.ps.forEach(p => { p.a += dt * p.v * 2; p.r = (p.r + dt * p.v * .9) % 1; });
      },
      draw(c) {
        const t = this.t;
        D.sky(c, 0, 0, 1000, 640, '#1b2436', '#0f1726');
        const cx = 480, cy = 300, r = 80 + st.air * 170;
        const n = Math.round(20 + st.air * 50);
        const g = c.createRadialGradient(cx - r * .35, cy - r * .4, r * .1, cx, cy, r);
        g.addColorStop(0, 'rgba(255,140,170,.75)'); g.addColorStop(.7, 'rgba(220,50,90,.6)'); g.addColorStop(1, 'rgba(150,20,60,.75)');
        c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill();
        c.fillStyle = '#9c1d47'; c.beginPath(); c.moveTo(cx - 12, cy + r - 4); c.lineTo(cx + 12, cy + r - 4); c.lineTo(cx + 8, cy + r + 30); c.lineTo(cx - 8, cy + r + 30); c.fill();
        c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(cx - r * .4, cy - r * .45, r * .18, r * .1, -.6, 0, TAU); c.fill();
        st.ps.slice(0, n).forEach((p, i) => { const rr = (.15 + .8 * ((p.r * 7 + i * .13) % 1)) * r * .9; c.fillStyle = '#fff'; c.beginPath(); c.arc(cx + Math.cos(p.a + i) * rr, cy + Math.sin(p.a * 1.3 + i) * rr, 5, 0, TAU); c.fill(); });
        for (let k = 0; k < 12; k++) { const a = k * TAU / 12; D.arrow(c, cx + Math.cos(a) * (r + 4), cy + Math.sin(a) * (r + 4), cx + Math.cos(a) * (r + 56), cy + Math.sin(a) * (r + 56), { color: COL.bolt, w: 5 + st.air * 4 }); }
        if (st.open) {
          for (let k = 0; k < 6; k++) { const yy = cy + r + 40 + ((t * 300 + k * 30) % 160); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(cx + Math.sin(k * 3 + t * 9) * 14, yy, 5, 0, TAU); c.fill(); }
          D.arrow(c, cx, cy + r + 40, cx, cy + r + 200, { color: COL.cool, w: 10 });
          D.label(c, 'air escapes: high → low pressure', cx + 230, cy + r + 120, { size: 26, color: COL.cool });
        }
        D.label(c, 'pushes outward in every direction', cx, 34, { size: 28, color: COL.bolt });
        if (st.pump > 0) D.label(c, 'blowing in more air…', 860, 560, { size: 24 });
      }
    });
    api.$('#blpump').addEventListener('click', () => { st.open = false; st.pump = 1; });
    api.$('#blopen').addEventListener('click', () => { st.open = true; st.pump = 0; });
    api.$('#blreset').addEventListener('click', () => { st.air = .5; st.open = false; st.pump = 0; });
  }
});

S({
  id: 'magnitude', sec: 3, title: 'How big is atmospheric pressure?', sub: 'Think of a square just 15 cm × 15 cm, about the size of your open hand.',
  html: `<div class="row">
    <div class="vis"><canvas id="mgcv" data-w="1080" data-h="660"></canvas>
      <div class="ctrls"><button class="btn go" id="mgnext">Next step ▶</button><button class="btn" id="mgreset">↺ Start again</button></div></div>
    <div class="side"><div class="chain" id="mgsteps">
      <div class="st">1. Take a square: 15 cm × 15 cm</div>
      <div class="st">2. A tall column of air (many km high) stands on it</div>
      <div class="st">3. The air pushes down with about <b class="mono">2250 N</b></div>
      <div class="st">4. That equals the weight of a <b class="mono">225 kg</b> mass!</div></div>
      <div class="card explain" style="font-size:26px"><b>A step further:</b> weather reports use the <span class="key">millibar (mb)</span> or <span class="key">hectopascal (hPa)</span>.<br>1 mb = 1 hPa = 100 Pa.</div>
    </div></div>`,
  setup(api) {
    let step = 1; const steps = api.$$('#mgsteps .st');
    const paint = () => steps.forEach((s, i) => { s.classList.toggle('lit', i < step - 1); s.classList.toggle('now', i === step - 1); });
    const sim = api.sim('#mgcv', {
      autoplay: true,
      draw(c) {
        const t = this.t;
        D.sky(c, 0, 0, 1080, 660, '#0d1b33', '#4a86c0');
        D.stars(c, 1080, 160, .6, 4);
        c.fillStyle = '#3a4a62'; c.fillRect(0, 560, 1080, 100);
        // square on the table
        const sx = 300, sy = 560, sw = 150;
        c.fillStyle = step >= 1 ? 'rgba(255,225,90,.85)' : 'rgba(255,255,255,.2)';
        c.fillRect(sx - sw / 2 + 20, sy - 6, sw, 12); c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(sx - sw / 2 + 20, sy - 6, sw, 12);
        if (step >= 1) D.label(c, 'square: 15 cm × 15 cm', sx + 20, sy + 50, { size: 26, color: COL.bolt });
        if (step >= 2) {
          const g = c.createLinearGradient(0, 0, 0, sy); g.addColorStop(0, 'rgba(120,190,255,0)'); g.addColorStop(1, 'rgba(120,190,255,.55)');
          c.fillStyle = g; c.fillRect(sx - sw / 2 + 20, 0, sw, sy + 20);
          for (let i = 0; i < 40; i++) { const yy = (i * 53 + t * 40) % sy; c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(sx - sw / 2 + 30 + ((i * 37) % (sw - 20)), yy, 3, 0, TAU); c.fill(); }
          D.label(c, 'column of air\n(many kilometres tall)', sx + 230, 160, { size: 26, color: COL.cool });
        }
        if (step >= 3) { D.arrow(c, sx + 20, 330, sx + 20, 540, { color: COL.hi, w: 20 }); D.label(c, '≈ 2250 N', sx + 150, 450, { size: 36, color: COL.hi, force: true }); }
        if (step >= 4) {
          // nine 25 kg sacks on a platform scale = 225 kg
          const bx = 700, by = 540;
          c.fillStyle = '#596273'; c.fillRect(bx - 20, by, 320, 20);
          for (let i = 0; i < 9; i++) {
            const col = i % 3, row = Math.floor(i / 3), x = bx + col * 95, y = by - (row + 1) * 78;
            const sg = c.createLinearGradient(x, y, x + 90, y + 74); sg.addColorStop(0, '#e9dcb9'); sg.addColorStop(1, '#b9a679');
            c.fillStyle = sg; D.rr(c, x, y + 4, 88, 72, 18); c.fill();
            D.text(c, '25 kg', x + 44, y + 42, { size: 20, color: '#5a4a2a', shadow: false });
          }
          D.label(c, '9 sacks × 25 kg = 225 kg', bx + 140, 270, { size: 28, color: COL.bolt, force: true });
          D.label(c, 'Same push!', 550, 440, { size: 30, color: COL.bolt });
        }
      }
    });
    api.$('#mgnext').addEventListener('click', () => { step = Math.min(4, step + 1); paint(); });
    api.$('#mgreset').addEventListener('click', () => { step = 1; paint(); });
    paint();
  }
});

S({
  id: 'notcrushed', sec: 3, title: 'So why are we not crushed?', sub: 'Pressure outside our body is balanced by pressure inside.',
  html: `<div class="row">
    <div class="vis"><canvas id="nccv" data-w="1000" data-h="640"></canvas>
      <div class="ctrls"><button class="btn on" id="ncin">Show inside pressure</button></div></div>
    <div class="side">
      <div class="card"><ul class="pts">
        <li><span class="hiP">Outside:</span> atmospheric pressure pushes <b>in</b>.</li>
        <li><span class="warmT">Inside:</span> the pressure inside our body pushes <b>out</b>.</li>
        <li>They are <span class="key">equal</span>, so they balance.</li>
        <li>Inside pressure comes from the movement of <span class="key">fluids and gases</span> in our tissues and organs.</li></ul></div>
      ${mcq('Can air pressure really crush us?', ['Yes, it is crushing us slowly', 'No, because the pressure inside our body balances it', 'No, because air has no pressure'], 1, 'Right. The pressure inside our body is equal to the atmospheric pressure, so the two balance each other.')}
    </div></div>`,
  setup(api) {
    let inside = true;
    const sim = api.sim('#nccv', {
      autoplay: true,
      draw(c) {
        const t = this.t, pulse = 1 + Math.sin(t * 3) * .04;
        D.sky(c, 0, 0, 1000, 640, '#14203a', '#0c1424');
        const cx = 500, cy = 330;
        c.save(); c.globalAlpha = .9; D.person(c, cx, 600, 520, { shirt: '#2e6fb3' }); c.restore();
        const pts = [[cx, 120], [cx - 70, 260], [cx + 70, 260], [cx - 75, 380], [cx + 75, 380], [cx - 40, 520], [cx + 40, 520]];
        pts.forEach(([x, y], i) => {
          const dir = x < cx ? -1 : x > cx ? 1 : 0, dy = dir === 0 ? -1 : 0;
          const ox = dir * 150, oy = dy * 110;
          D.arrow(c, x + ox, y + oy, x + ox * .35, y + oy * .35, { color: COL.hi, w: 9 * pulse });
          if (inside) D.arrow(c, x - ox * .05, y - oy * .05, x + ox * .3, y + oy * .3, { color: COL.warm, w: 9 * pulse, alpha: .95 });
        });
        D.label(c, 'OUTSIDE pressure →', 170, 200, { size: 28, color: COL.hi, force: true });
        if (inside) D.label(c, '← INSIDE pressure', 830, 200, { size: 28, color: COL.warm, force: true });
        D.label(c, inside ? 'Balanced!' : 'Inside pressure hidden for this view', cx, 40, { size: 30, color: inside ? COL.safe : COL.muted, force: true });
      }
    });
    api.$('#ncin').addEventListener('click', e => { inside = !inside; e.currentTarget.classList.toggle('on', inside); });
  }
});

S({
  id: 'sucker', sec: 3, title: 'The rubber sucker', sub: 'Activity 6.4: press a sucker on a smooth flat surface.',
  html: `<div class="row">
    <div class="vis"><canvas id="sucv" data-w="1080" data-h="620" data-s=".92"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn on" data-surf="smooth">Smooth surface</button><button class="btn" data-surf="rough">Rough surface</button></div>
        <button class="btn go" id="supress">Press the sucker</button><button class="btn" id="supull">Pull gently</button><button class="btn" id="suhard">Pull very hard</button><button class="btn" id="sureset">↺ Reset</button></div></div>
    <div class="side">
      <div class="chain" id="susteps">
        <div class="st">1. Press: most air inside is <b>pushed out</b></div>
        <div class="st">2. Air pressure <b>inside</b> the cup is now <span class="loP">low</span></div>
        <div class="st">3. Air <b>outside</b> pushes harder (<span class="hiP">high</span>)</div>
        <div class="st">4. The sucker <b>sticks</b>. To pull it off, you must overcome this pressure difference.</div></div>
      ${mcq('Sucker M is pressed on a smooth surface and N on a rough surface. What happens?', ['Both stick', 'M sticks, N does not', 'N sticks, M does not'], 1, 'Correct! On a rough surface, air leaks back in through the gaps, so the pressure inside does not stay low.')}
    </div></div>`,
  setup(api) {
    let surf = 'smooth';
    const st = { state: 'free', press: 0, inside: 1, off: 0, step: 0 };
    const paint = () => api.$$('#susteps .st').forEach((s, i) => { s.classList.toggle('lit', i < st.step - 1); s.classList.toggle('now', i === st.step - 1); });
    const sim = api.sim('#sucv', {
      autoplay: true,
      update(s, dt) {
        if (st.state === 'pressing') { st.press = Math.min(1, st.press + dt * 1.5); st.inside = Math.max(.2, 1 - st.press * .8); st.step = st.press < .5 ? 1 : 2; if (st.press >= 1) { st.state = surf === 'smooth' ? 'stuck' : 'leaking'; st.step = surf === 'smooth' ? 4 : 2; } paint(); }
        if (st.state === 'stuck') { st.press = Math.max(.75, st.press - dt * .4); }
        if (st.state === 'leaking') { st.inside = Math.min(1, st.inside + dt * .5); st.press = Math.max(0, st.press - dt * .6); if (st.inside >= 1) { st.state = 'fell'; } }
        if (st.state === 'fell' || st.state === 'popped') { st.off = Math.min(1, st.off + dt * 2); st.inside = 1; }
        if (st.state === 'tug') { st.tug -= dt; if (st.tug <= 0) st.state = 'stuck'; }
      },
      draw(c) {
        D.sky(c, 0, 0, 1080, 620, '#1b2436', '#0f1726');
        const wx = 700;
        // wall
        if (surf === 'smooth') { const g = c.createLinearGradient(wx, 0, wx + 120, 0); g.addColorStop(0, 'rgba(200,230,255,.55)'); g.addColorStop(1, 'rgba(120,170,220,.3)'); c.fillStyle = g; c.fillRect(wx, 30, 120, 560); D.label(c, 'smooth glass', wx + 60, 590 - 14, { size: 22 }); }
        else { c.fillStyle = '#8f8a80'; c.fillRect(wx, 30, 120, 560); c.fillStyle = '#9a5a3a'; for (let y = 30; y < 590; y += 40) for (let x = wx + ((y / 40) % 2) * 30 - 30; x < wx + 120; x += 60) c.fillRect(Math.max(wx, x), y, 54, 34); D.tex(c, wx, 30, 120, 560, 'speck', .7); c.fillStyle = '#9a5a3a'; for (let y = 60; y < 580; y += 22) { c.beginPath(); c.arc(wx - 2, y, 6, 0, TAU); c.fill(); } D.label(c, 'rough surface (gaps)', wx + 60, 576, { size: 22 }); }
        const cy = 310, off = st.off * 240, flat = st.press;
        const cupDepth = 90 * (1 - flat * .75), cupH = 220 + flat * 30;
        const rimX = wx - 4 - off;
        // cup (profile)
        c.save();
        const g = c.createLinearGradient(rimX - cupDepth, 0, rimX, 0); g.addColorStop(0, '#d23a3a'); g.addColorStop(1, '#ff7a6b');
        c.fillStyle = g;
        c.beginPath(); c.moveTo(rimX, cy - cupH / 2); c.quadraticCurveTo(rimX - cupDepth * 1.3, cy, rimX, cy + cupH / 2); c.lineTo(rimX - 14, cy + cupH / 2); c.quadraticCurveTo(rimX - cupDepth * 1.3 - 16, cy, rimX - 14, cy - cupH / 2); c.closePath(); c.fill();
        c.fillStyle = '#b02a2a'; D.rr(c, rimX - cupDepth * .65 - 110, cy - 22, 120, 44, 14); c.fill();
        c.restore();
        // air inside cup
        const nIn = Math.round(st.inside * 14);
        const R = rng(3);
        for (let i = 0; i < nIn; i++) { const yy = cy + (R() - .5) * cupH * .7, xx = rimX - 6 - R() * cupDepth * .55 * Math.cos((yy - cy) / cupH * 2); c.fillStyle = '#fff'; c.beginPath(); c.arc(xx, yy, 4, 0, TAU); c.fill(); }
        // outside air arrows
        if (st.state !== 'free' && st.state !== 'fell' && st.state !== 'popped') {
          const dp = 1 - st.inside;
          [-1, 0, 1].forEach(k => D.arrow(c, rimX - cupDepth - 200, cy + k * 70, rimX - cupDepth - 40, cy + k * 50, { color: COL.hi, w: 6 + dp * 8 }));
          D.label(c, 'HIGH outside pressure', rimX - cupDepth - 200, cy - 150, { size: 26, color: COL.hi });
          D.label(c, 'LOW inside', rimX - cupDepth * .4, cy + cupH / 2 + 40, { size: 24, color: COL.lo });
        }
        if (st.state === 'leaking') { for (let k = 0; k < 4; k++) D.arrow(c, rimX - 40, cy - cupH / 2 - 30 + k * 6, rimX - 6, cy - cupH / 2 + 18, { color: COL.cool, w: 3, head: 10, outline: false }); D.label(c, 'air leaks in through gaps', rimX - 160, 80, { size: 24, color: COL.cool }); }
        if (st.state === 'tug') { D.arrow(c, rimX - cupDepth - 100, cy, rimX - cupDepth - 260, cy, { color: COL.warm, w: 12 }); D.label(c, 'gentle pull: not enough!', 260, 520, { size: 26, color: COL.warm }); }
        if (st.state === 'popped') D.label(c, 'Pulled hard enough to beat the pressure difference: POP!', 360, 540, { size: 26, color: COL.warm });
        if (st.state === 'fell') D.label(c, 'It did not stick on the rough surface', 360, 540, { size: 26, color: COL.lo });
        D.meter(c, 170, 150, 80, 1 - st.inside, 'Pressure difference', '', COL.bolt);
      }
    });
    api.on('[data-surf]', 'click', e => { surf = e.currentTarget.dataset.surf; api.$$('[data-surf]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); Object.assign(st, { state: 'free', press: 0, inside: 1, off: 0, step: 0 }); paint(); });
    api.$('#supress').addEventListener('click', () => { Object.assign(st, { state: 'pressing', press: 0, inside: 1, off: 0 }); });
    api.$('#supull').addEventListener('click', () => { if (st.state === 'stuck') { st.state = 'tug'; st.tug = 1.2; } });
    api.$('#suhard').addEventListener('click', () => { if (st.state === 'stuck' || st.state === 'tug') st.state = 'popped'; });
    api.$('#sureset').addEventListener('click', () => { Object.assign(st, { state: 'free', press: 0, inside: 1, off: 0, step: 0 }); paint(); });
  }
});

S({
  id: 'check3', sec: 3, title: 'Concept check: Air pressure', kick: 'Check your understanding',
  html: `<div class="qgrid">
    ${mcq('Why does an inflated balloon expand evenly in all directions?', ['Air pushes only upward', 'Air exerts pressure in all directions', 'Rubber is heavier at the bottom'], 1, 'Correct. The air inside pushes equally on every part of the wall.')}
    ${mcq('In the paper plate activity, why was the unfolded sheet harder to lift?', ['It was heavier', 'Air pushed on a larger area, so the total force was larger', 'The stick became weaker'], 1, 'Yes. The weight was the same, but air pushed down on a larger area, giving a larger total force.')}
    ${mcq('Why does a sucker stick to a smooth wall?', ['Glue on the rubber', 'Pressure inside the cup becomes lower than the air pressure outside', 'The wall pulls it'], 1, 'Right. Pressing pushes most air out. Higher outside pressure holds the sucker on.')}
    ${mcq('The pressure exerted by the air around us is called…', ['Liquid pressure', 'Atmospheric pressure', 'Wind speed'], 1, 'Correct: atmospheric pressure.')}
  </div>`
});

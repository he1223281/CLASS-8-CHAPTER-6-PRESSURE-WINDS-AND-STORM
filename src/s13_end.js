/* ============ SECTION 13: CONCEPT MAP, CHALLENGE, RECAP ============ */
S({
  id: 'conceptmap', sec: 13, title: 'The big picture', kick: 'Concept map', sub: 'Click any box to revisit that part.',
  html: `<div class="roadmap"><svg id="cmsvg" viewBox="0 0 1808 790" style="width:100%;height:100%"></svg></div>
    <div class="ctrls"><button class="btn go" id="cmplay">▶ Build the map again</button></div>`,
  setup(api) {
    const main = [['SUN', 4], ['HEATING', 4], ['TEMPERATURE DIFFERENCE', 4], ['WARM AIR RISES', 4], ['PRESSURE DIFFERENCE', 4], ['WIND (high → low)', 4], ['STRONG WIND + MOISTURE', 6], ['STORM / THUNDERSTORM', 7], ['UNDER CERTAIN CONDITIONS', 11], ['CYCLONE', 11]];
    const side = [['Pressure = F ÷ A', 1], ['Liquids', 2], ['Air', 3], ['Winds', 4], ['Storms', 6], ['Cyclones', 11]];
    const bw = 320, bh = 96;
    const pos = main.map((_, i) => i < 5 ? [30 + i * 362 + bw / 2, 90] : [30 + (9 - i) * 362 + bw / 2, 330]);
    let h = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#ffe15a"/></marker>
      <marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#58dcff"/></marker></defs>`;
    pos.forEach(([x, y], i) => {
      if (i === 0) return; const [px, py] = pos[i - 1];
      const d = py === y ? `M${px + (x > px ? bw / 2 : -bw / 2)} ${y} L${x + (x > px ? -bw / 2 - 8 : bw / 2 + 8)} ${y}` : `M${px} ${py + bh / 2} C${px + 200} ${py + 120} ${x + 200} ${y - 120} ${x} ${y - bh / 2 - 8}`;
      h += `<path class="cml" d="${d}" stroke="#ffe15a" stroke-width="6" fill="none" marker-end="url(#ah)" style="opacity:0;stroke-dasharray:600;stroke-dashoffset:600;animation:cmdraw .6s ${i * .55 - .2}s forwards"/>`;
    });
    main.forEach(([n, sec], i) => {
      const [x, y] = pos[i], hot = i === 0 || i === 9;
      h += `<g class="cmn" data-sec="${sec}" style="cursor:pointer;opacity:0;animation:pop .5s ${i * .55}s forwards"><rect x="${x - bw / 2}" y="${y - bh / 2}" width="${bw}" height="${bh}" rx="18" fill="${hot ? '#3a2f08' : '#152138'}" stroke="${hot ? '#ffe15a' : '#5fb0ff'}" stroke-width="4"/>
        <text x="${x}" y="${y + 11}" fill="#f1f5fc" font-size="${n.length > 16 ? 28 : 32}" font-weight="800" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif" letter-spacing="1" ${n.length > 16 ? `textLength="${bw - 34}" lengthAdjust="spacingAndGlyphs"` : ''}>${n}</text></g>`;
    });
    h += `<text x="60" y="560" fill="#58dcff" font-size="34" font-weight="800" font-family="Big Shoulders Display, Impact, sans-serif" letter-spacing="2">ONE IDEA LINKS THE WHOLE CHAPTER: PRESSURE</text>`;
    side.forEach(([n, sec], i) => {
      const x = 60 + i * 290 + 120, y = 660;
      if (i) h += `<path d="M${x - 290 + 125} ${y} L${x - 135} ${y}" stroke="#58dcff" stroke-width="5" marker-end="url(#ah2)" style="opacity:0;animation:pop .4s ${5.6 + i * .35}s forwards"/>`;
      h += `<g class="cmn" data-sec="${sec}" style="cursor:pointer;opacity:0;animation:pop .4s ${5.5 + i * .35}s forwards"><rect x="${x - 120}" y="${y - 44}" width="240" height="88" rx="44" fill="#0e2a3a" stroke="#58dcff" stroke-width="4"/>
        <text x="${x}" y="${y + 10}" fill="#f1f5fc" font-size="30" font-weight="700" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">${n}</text></g>`;
    });
    const svg = api.$('#cmsvg');
    const render = () => { svg.innerHTML = h; svg.querySelectorAll('.cmn').forEach(g => g.addEventListener('click', () => goSection(+g.dataset.sec))); };
    render();
    if (!document.getElementById('cmstyle')) { const s = document.createElement('style'); s.id = 'cmstyle'; s.textContent = '@keyframes cmdraw{from{opacity:1}to{stroke-dashoffset:0;opacity:1}}'; document.head.appendChild(s); }
    api.$('#cmplay').addEventListener('click', render);
    this._render = render;
  },
  enter() { this._render && this._render(); }
});

S({
  id: 'scientist', sec: 13, title: 'Become a weather scientist', kick: 'Chapter challenge', sub: 'A hot afternoon on the coast. Make the right calls!',
  html: `<div class="row">
    <div class="vis"><canvas id="wscv" data-w="1100" data-h="650"></canvas></div>
    <div class="side"><div class="q" id="wsq" style="flex:1"></div>
      <div style="display:flex;gap:12px;align-items:center"><div class="big mono" id="wsprog"></div><button class="btn" id="wsreset" style="margin-left:auto">↺ Start over</button></div></div></div>`,
  setup(api) {
    const Q = [
      { q: 'Step 1: The Sun is shining strongly. <b>Click on the picture</b> where warm air will rise.', click: true },
      { q: 'Step 2: Where does low pressure form?', o: ['Over the land', 'Over the sea'], a: 0, e: 'Warm air over the land rises, so a low-pressure area forms there.' },
      { q: 'Step 3: Which way will the wind blow near the ground?', o: ['From sea to land', 'From land to sea'], a: 0, e: 'Air moves from higher pressure (sea) to lower pressure (land): a sea breeze.' },
      { q: 'Step 4: The rising moist air expands and cools high up. What forms?', o: ['Clouds (water vapour condenses)', 'Nothing at all', 'Hot sand'], a: 0, e: 'The moisture condenses into tiny droplets that form clouds.' },
      { q: 'Step 5: Droplets merge into heavier drops and strong winds blow. Can this produce a storm?', o: ['Yes: strong winds + rain = storm', 'No, storms need snow'], a: 0, e: 'Strong winds accompanied by rain make a storm.' },
      { q: 'Step 6: Strong up and down winds rub ice particles and water droplets. What develops?', o: ['Electric charges, leading to lightning', 'A rainbow', 'Nothing'], a: 0, e: 'Charges separate in the cloud. When the build-up is very large, lightning flashes.' },
      { q: 'Step 7: The storm now has lightning and thunder. What do we call it?', o: ['A thunderstorm', 'A land breeze', 'A cyclone'], a: 0, e: 'A storm accompanied by lightning and thunder is a thunderstorm.' },
      { q: 'Step 8: Over the WARM OCEAN, what could turn such a storm into a cyclone?', o: ['Warm moist air keeps rising, condensation releases heat, pressure falls further, more air rushes in, and Earth\'s rotation makes it spin', 'The ocean suddenly freezes', 'The wind stops completely'], a: 0, e: 'Under certain conditions, this cycle repeats and the system becomes a cyclone.' },
    ];
    let step = 0;
    const render = () => {
      api.$('#wsprog').textContent = step < 8 ? `Step ${step + 1} of 8` : 'Complete!';
      if (step >= 8) { api.$('#wsq').innerHTML = `<div class="qtag" style="color:var(--safe)">Challenge complete</div><div style="font-family:var(--f-display);font-size:64px;font-weight:900;color:var(--bolt);line-height:1">CERTIFIED WEATHER SCIENTIST!</div><div class="qt">You followed the Sun's heat all the way from a gentle sea breeze to a storm, a thunderstorm and a cyclone.</div>`; return; }
      const s = Q[step];
      api.$('#wsq').innerHTML = `<div class="qtag">Your decision</div><div class="qt" style="font-size:34px">${s.q}</div>` + (s.click ? '<div class="fb bad" id="wsbad">Look again: which part heats up faster in the Sun?</div>' :
        `<div class="opts" style="flex-direction:column">${s.o.map((o, i) => `<button class="opt" data-ws="${i}">${o}</button>`).join('')}</div><div class="fb ans" id="wsok">${s.e}</div><div class="fb bad" id="wsbad">Not quite. Think about what we learnt and try again.</div>`);
      api.$$('[data-ws]').forEach(b => b.addEventListener('click', () => {
        if (+b.dataset.ws === s.a) { b.classList.add('right'); api.$('#wsok').classList.add('show'); api.$('#wsbad').classList.remove('show'); setTimeout(() => { step++; render(); }, 1800); }
        else { b.classList.add('wrong'); api.$('#wsbad').classList.add('show'); }
      }));
    };
    const R = rng(55), drops = Array.from({ length: 140 }, () => ({ x: 120 + R() * 500, y: R() * 300, v: 400 + R() * 200 }));
    let flash = 0, bolt = null;
    const sim = api.sim('#wscv', {
      autoplay: true,
      pointer(type, x) {
        if (type !== 'down' || step !== 0) return;
        if (x < 560) { step = 1; render(); } else api.$('#wsbad').classList.add('show');
      },
      update(s, dt) {
        drops.forEach(d => { d.y += d.v * dt; if (d.y > 300) d.y = 0; });
        if (step >= 6) { flash -= dt; if (flash < -2.5) { flash = .4; bolt = D.genBolt(300 + Math.random() * 200, 200, 330 + Math.random() * 200, 560, (Math.random() * 1e6) | 0); if (step < 8) thunder(.4, .5); } }
      },
      draw(c) {
        const t = this.t, W = 1100, gy = 560, shore = 560;
        const dark = step >= 5 ? .6 : step >= 4 ? .3 : 0;
        coastScene(c, W, 650, t, dark * .5, { shore, gy });
        D.palm(c, 520, gy - 8, 150, step >= 3 ? -.4 - (step >= 5 ? .3 : 0) + Math.sin(t * 3) * .05 : 0, 3);
        if (step >= 1) for (let i = 0; i < 3; i++) { const yy = gy - 60 - ((t * 120 + i * 90) % 260); D.arrow(c, 300, yy + 50, 300, yy, { color: COL.warm, w: 8 }); }
        if (step === 0) D.label(c, 'Click on the picture!', 550, 330, { size: 30, color: COL.bolt, force: true });
        if (step >= 2) { D.HL(c, 300, gy - 60, 'L', 36); D.HL(c, 820, gy - 60, 'H', 36); }
        if (step >= 3) for (let i = 0; i < 2; i++) { const off = (t * 200 + i * 200) % 400; D.arrow(c, 800 - off * .3, gy - 20, 640 - off * .3, gy - 20, { color: COL.cool, w: 10, alpha: .9 }); }
        if (step >= 4) { D.cloud(c, 330, 160, 460, 200, { seed: 111, dark }); D.cloud(c, 440, 120, 300, 140, { seed: 112, dark }); }
        if (step >= 5) D.rainDrops(c, drops.map(d => ({ x: d.x, y: 220 + d.y })), .85, .6);
        if (step >= 6 && flash > 0) { c.fillStyle = `rgba(230,230,255,${flash * .5})`; c.fillRect(0, 0, W, 650); D.bolt(c, bolt, flash * 2.5); }
        if (step >= 6) { D.charge(c, 280, 110, 1, 12); D.charge(c, 380, 100, 1, 12); D.charge(c, 300, 220, -1, 12); D.charge(c, 400, 230, -1, 12); }
        if (step >= 7) D.label(c, 'THUNDERSTORM', 330, 40, { size: 30, color: COL.bolt, force: true });
        if (step >= 8) { c.save(); c.beginPath(); c.arc(920, 190, 130, 0, TAU); c.clip(); D.oceanTop(c, 790, 60, 260, 260); D.cyclone(c, 920, 190, 130, -t * .6, 1); c.restore(); c.strokeStyle = COL.bolt; c.lineWidth = 4; c.beginPath(); c.arc(920, 190, 130, 0, TAU); c.stroke(); D.label(c, 'cyclone over warm ocean', 920, 350, { size: 24, color: COL.bolt, force: true }); }
      }
    });
    api.$('#wsreset').addEventListener('click', () => { step = 0; render(); });
    render();
  }
});

S({
  id: 'recap', sec: 13, title: '60-second recap', kick: 'Chapter recap',
  html: `<div class="col" style="flex:1"><canvas id="rccv" data-w="1808" data-h="560"></canvas>
    <div style="display:flex;gap:16px;align-items:center">${ctl('main', { playTxt: 'Play recap' })}<div style="flex:1;height:16px;background:#22314d;border-radius:8px;overflow:hidden"><div id="rcbar" style="height:100%;width:0;background:var(--bolt)"></div></div><div class="mono" id="rctime" style="font-size:26px;width:90px">0 s</div></div>
    <div id="rcchips" style="display:flex;gap:8px;flex-wrap:wrap"></div></div>`,
  setup(api) {
    const items = [
      ['PRESSURE', 'Pressure = Force ÷ Area. Small area → high pressure.'],
      ['LIQUID PRESSURE', 'Increases with the height of the liquid column. Acts in all directions.'],
      ['ATMOSPHERIC PRESSURE', 'Air pushes on everything, in all directions.'],
      ['PRESSURE DIFFERENCE', 'Warm air rises → low pressure. Cooler air is at higher pressure.'],
      ['WIND', 'Air moves from HIGH pressure to LOW pressure.'],
      ['HIGH-SPEED WIND', 'Fast winds come with reduced pressure. Roofs can be lifted.'],
      ['STORM', 'Strong winds + rain, hail or snow.'],
      ['THUNDERSTORM', 'A storm with lightning and thunder.'],
      ['LIGHTNING', 'Charges build up, air\'s insulation breaks down, a giant spark. Thunder follows.'],
      ['CYCLONE', 'Warm ocean, rising moist air, heat released, spinning low pressure. Weakens over land.'],
      ['SAFETY', 'Crouch low, avoid tall trees and water. Follow IMD warnings. Go to a cyclone shelter.'],
    ];
    const per = 60 / items.length;
    api.$('#rcchips').innerHTML = items.map((it, i) => `<span class="btn sm" data-rc="${i}" style="cursor:pointer">${it[0]}</span>`).join('');
    const chips = api.$$('[data-rc]');
    chips.forEach(ch => ch.addEventListener('click', () => { sim.t = +ch.dataset.rc * per + .01; sim.dirty = true; }));
    const R = rng(9), parts = Array.from({ length: 60 }, () => ({ p: R(), j: (R() - .5) * 30 }));
    const sim = api.sim('#rccv', {
      update() { if (this.t >= 60) { this.t = 60; this.pause(); } },
      draw(c) {
        const t = this.t, k = Math.min(items.length - 1, Math.floor(t / per)), lt = (t - k * per) / per;
        api.$('#rcbar').style.width = (t / 60 * 100) + '%'; api.$('#rctime').textContent = Math.floor(t) + ' s';
        chips.forEach((ch, i) => { ch.classList.toggle('on', i === k); ch.style.opacity = i <= k ? 1 : .5; });
        D.sky(c, 0, 0, 1808, 560, '#0f1a2e', '#070c17');
        const vx = 430, vy = 290;
        c.save(); c.globalAlpha = seg01(lt, 0, .1);
        if (k === 0) { c.fillStyle = '#a8794a'; c.fillRect(vx - 120, vy, 240, 120); D.arrow(c, vx, vy - 200, vx, vy - 10, { color: COL.warm, w: 16 }); for (let i = 0; i < 6; i++) D.arrow(c, vx - 100 + i * 40, vy + 130, vx - 100 + i * 40, vy + 190, { color: COL.bolt, w: 5, head: 12 }); }
        if (k === 1) { waterCol(c, vx, vy - 180 + Math.sin(t * 2) * 30, vy + 150, 80); glassPipe(c, vx, vy - 220, vy + 150, 80); balloonBulge(c, vx, vy + 164, 80, 40 + 20 * Math.sin(t * 2)); }
        if (k === 2) { c.fillStyle = 'rgba(220,60,90,.7)'; c.beginPath(); c.arc(vx, vy, 120, 0, TAU); c.fill(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12; D.arrow(c, vx + Math.cos(a) * 70, vy + Math.sin(a) * 70, vx + Math.cos(a) * 170, vy + Math.sin(a) * 170, { color: COL.bolt, w: 6 }); } }
        if (k === 3 || k === 4) { D.HL(c, vx - 200, vy, 'H', 60); D.HL(c, vx + 200, vy, 'L', 60); parts.forEach(p => { const x = lerp(vx - 140, vx + 140, (p.p + t * .3) % 1); c.fillStyle = COL.cool; c.beginPath(); c.arc(x, vy + p.j * 3, 6, 0, TAU); c.fill(); }); if (k === 4) D.arrow(c, vx - 120, vy + 130, vx + 120, vy + 130, { color: COL.cool, w: 16 }); }
        if (k === 5) { D.house(c, vx - 130, vy + 160, 260, 160, { roofLift: 20 + Math.sin(t * 10) * 6 }); for (let i = 0; i < 8; i++) { const x = ((t * 600 + i * 90) % 600) + vx - 300; c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, vy - 120 + i * 6); c.lineTo(x + 60, vy - 120 + i * 6); c.stroke(); } }
        if (k === 6 || k === 7) { D.cloud(c, vx, vy - 120, 500, 200, { seed: 7, dark: .7 }); D.rainDrops(c, parts.map(p => ({ x: vx - 200 + p.p * 400, y: vy - 40 + ((p.p * 900 + t * 300) % 260) })), .9, 1); if (k === 7 && (t % 1.4) < .2) D.bolt(c, D.genBolt(vx, vy - 60, vx + 30, vy + 220, 5), 1); }
        if (k === 8) { D.cloud(c, vx, vy - 140, 520, 200, { seed: 8, dark: .75 }); for (let i = 0; i < 6; i++) { D.charge(c, vx - 150 + i * 60, vy - 190, 1, 14); D.charge(c, vx - 150 + i * 60, vy - 90, -1, 14); } if ((t % 1.2) < .25) D.bolt(c, D.genBolt(vx - 20, vy - 60, vx + 40, vy + 230, 11), 1); }
        if (k === 9) { c.save(); c.beginPath(); c.arc(vx, vy, 240, 0, TAU); c.clip(); D.oceanTop(c, vx - 240, vy - 240, 480, 480); D.cyclone(c, vx, vy, 240, -t * .6, 1); c.restore(); }
        if (k === 10) { D.person(c, vx - 120, vy + 220, 300, { pose: 'crouch', shirt: '#2e6fb3' }); c.fillStyle = '#3a2f08'; D.rr(c, vx + 30, vy - 120, 240, 160, 18); c.fill(); c.strokeStyle = COL.bolt; c.lineWidth = 4; c.stroke(); D.text(c, 'IMD', vx + 150, vy - 60, { size: 50, color: COL.bolt, fam: 'disp', weight: 900 }); D.text(c, 'ALERT', vx + 150, vy - 5, { size: 34, color: '#fff', weight: 800 }); }
        c.restore();
        c.save(); c.globalAlpha = seg01(lt, .05, .2);
        D.text(c, items[k][0], 1260, 210, { size: 96, fam: 'disp', weight: 900, color: COL.bolt });
        const words = items[k][1].split(' '); let line = '', lines = [];
        words.forEach(w => { if ((line + ' ' + w).length > 34) { lines.push(line.trim()); line = w; } else line += ' ' + w; }); lines.push(line.trim());
        lines.forEach((l, i) => D.text(c, l, 1260, 300 + i * 52, { size: 40, weight: 700 }));
        c.restore();
        if (t >= 60) { c.fillStyle = 'rgba(6,10,19,.85)'; c.fillRect(0, 0, 1808, 560); D.text(c, 'Now you know why wind blows, how pressure works,', 904, 230, { size: 46, weight: 700 }); D.text(c, 'how storms form, how lightning happens, and how cyclones develop!', 904, 300, { size: 46, weight: 700 }); D.text(c, 'Stay curious. Stay safe.', 904, 390, { size: 60, fam: 'disp', weight: 900, color: COL.bolt }); }
      }
    });
  }
});

/* ============ SECTIONS 11-12: CYCLONES & CYCLONE SAFETY ============ */
S({
  id: 'cycform', sec: 11, title: 'How a cyclone forms: a feedback loop', sub: 'Cyclones are large storms that form over warm ocean waters.',
  html: `<div class="row">
    <div class="vis"><canvas id="cfcv" data-w="1100" data-h="640"></canvas>
      <div class="ctrls">${ctl('main').replace('<div class="ctrls" data-for="main">', '').replace(/<\/div>$/, '')}<button class="btn on" id="cfrot">Earth's rotation: ON</button></div></div>
    <div class="side"><svg id="cfloop" viewBox="0 0 700 690" style="width:100%;height:690px"></svg></div></div>`,
  setup(api) {
    const nodes = ['Sun heats the ocean water', 'Warm, moist air rises', 'Low pressure forms', 'Surrounding air rushes in, also rises', 'Water vapour condenses', 'Heat is released', 'Air warms, rises further', 'Pressure falls even further'];
    const svg = api.$('#cfloop'); const cx = 350, cy = 345, R = 232, RY = 290;
    let h = `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${RY}" fill="none" stroke="#2a3b5c" stroke-width="6" stroke-dasharray="6 14"/>`;
    nodes.forEach((n, i) => {
      const a = -Math.PI / 2 + i * TAU / nodes.length, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * RY;
      const words = n.split(' '), lines = []; let line = '';
      words.forEach(w => { if ((line + ' ' + w).trim().length > 15) { lines.push(line.trim()); line = w; } else line += ' ' + w; }); lines.push(line.trim());
      h += `<g class="cfn" data-i="${i}"><rect x="${x - 112}" y="${y - lines.length * 14 - 10}" width="224" height="${lines.length * 28 + 20}" rx="14" fill="#152138" stroke="#2a3b5c" stroke-width="3"/>
        ${lines.map((l, k) => `<text x="${x}" y="${y - lines.length * 14 + k * 28 + 21}" fill="#f1f5fc" font-size="23" font-weight="700" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">${l}</text>`).join('')}</g>`;
    });
    h += `<text x="${cx}" y="${cy - 20}" fill="#ffe15a" font-size="34" font-weight="800" text-anchor="middle" font-family="Big Shoulders Display, Impact, sans-serif">REPEATS</text>
      <text x="${cx}" y="${cy + 18}" fill="#f1f5fc" font-size="23" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">+ Earth's rotation</text>
      <text x="${cx}" y="${cy + 46}" fill="#f1f5fc" font-size="23" text-anchor="middle" font-family="Atkinson Hyperlegible, Verdana, sans-serif">makes the air spin</text>
      <text x="${cx}" y="${cy + 90}" id="cfcount" fill="#58dcff" font-size="26" font-weight="700" text-anchor="middle" font-family="IBM Plex Mono, monospace">cycle 1</text>`;
    svg.innerHTML = h;
    const gEls = [...svg.querySelectorAll('.cfn rect')];
    let rot = true;
    const R2 = rng(33), ps = Array.from({ length: 110 }, () => ({ a: R2() * TAU, r: .2 + R2() * .8, k: .6 + R2() * .8 }));
    const sim = api.sim('#cfcv', {
      autoplay: true,
      reset(s) { s.spin = 0; s.int = 0; },
      update(s, dt) {
        s.int = Math.min(1, s.int + dt * .03);
        s.spin += dt * (rot ? .25 + s.int * 1.4 : 0);
        const idx = Math.floor(this.t / 1.6) % nodes.length, cyc = Math.floor(this.t / (1.6 * nodes.length)) + 1;
        gEls.forEach((r, i) => { r.setAttribute('fill', i === idx ? '#ffe15a' : '#152138'); r.parentNode.querySelectorAll('text').forEach(tx => tx.setAttribute('fill', i === idx ? '#151000' : '#f1f5fc')); });
        api.$('#cfcount').textContent = 'cycle ' + cyc;
        ps.forEach(p => { p.r -= dt * .06 * p.k * (.4 + s.int); if (p.r < .12) p.r = 1; if (rot) p.a -= dt * (.3 + s.int * 1.2) / Math.max(.25, p.r); });
      },
      draw(c, s) {
        const t = this.t, W = 1100, sea = 470, I = s.int;
        D.sky(c, 0, 0, W, sea, mix('#5a9ad8', '#2a3240', I), mix('#cfe3f3', '#5a6472', I));
        D.sun(c, 120, 80, 44, 1 - I * .8);
        D.sea(c, 0, sea, W, 170, t, { top: '#2f8fd0', bot: '#0b3a66' });
        c.fillStyle = 'rgba(255,150,60,.25)'; c.fillRect(0, sea, W, 30);
        D.label(c, 'WARM ocean water', 160, sea + 60, { size: 24, color: COL.warm });
        // rising moist air & tower cloud
        for (let i = 0; i < 26; i++) { const p = ((t * .25 + i / 26) % 1); const x = 550 + Math.sin(i * 7) * 120 * (1 - p * .5), y = sea - p * 330; c.fillStyle = p > .55 ? 'rgba(255,255,255,.8)' : COL.warm; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill(); }
        D.cloud(c, 550, 150, 380 + I * 300, 160 + I * 90, { seed: 91, dark: .3 + I * .5 });
        // released heat
        for (let i = 0; i < 5; i++) { const a = t * 2 + i * 1.3; c.fillStyle = `rgba(255,120,60,${.4 + .3 * Math.sin(a)})`; c.beginPath(); c.arc(470 + i * 40, 180 + Math.sin(a) * 10, 10, 0, TAU); c.fill(); }
        D.label(c, 'condensation releases heat', 550, 290, { size: 24, color: COL.warm });
        // inflow at surface
        D.arrow(c, 80, sea - 40, 380, sea - 40, { color: COL.cool, w: 10 + I * 8 }); D.arrow(c, 1020, sea - 40, 720, sea - 40, { color: COL.cool, w: 10 + I * 8 });
        D.HL(c, 550, sea - 50, 'L', 38);
        D.label(c, `centre: ${Math.round(1008 - I * 14)} mb`, 550, sea - 115, { size: 26, color: COL.lo, force: true });
        // top-view inset: spinning
        const ix = 940, iy = 135, ir = 110;
        c.save(); c.fillStyle = 'rgba(6,10,19,.85)'; c.beginPath(); c.arc(ix, iy, ir + 10, 0, TAU); c.fill(); c.clip();
        D.oceanTop(c, ix - ir, iy - ir, ir * 2, ir * 2);
        ps.forEach(p => { const r = p.r * ir, x = ix + Math.cos(p.a) * r, y = iy + Math.sin(p.a) * r; c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill(); });
        if (rot) D.cyclone(c, ix, iy, ir * (.5 + I * .5), -s.spin, .25 + I * .7, 6);
        c.restore();
        c.strokeStyle = '#2a3b5c'; c.lineWidth = 3; c.beginPath(); c.arc(ix, iy, ir + 10, 0, TAU); c.stroke();
        D.label(c, rot ? 'from above: air SPINS' : 'no rotation: no spin', ix, iy + ir + 34, { size: 22, color: rot ? COL.bolt : COL.muted, force: true });
      }
    });
    api.$('#cfrot').addEventListener('click', e => { rot = !rot; e.currentTarget.classList.toggle('on', rot); e.currentTarget.textContent = "Earth's rotation: " + (rot ? 'ON' : 'OFF (imagine!)'); });
  }
});

S({
  id: 'cyctop', sec: 11, title: 'A cyclone seen from above', sub: 'Drag the weather probe across the cyclone.',
  html: `<div class="row">
    <div class="vis"><canvas id="ctcv" data-w="1000" data-h="680"></canvas></div>
    <div class="side">
      <div class="card" id="ctread" style="font-size:30px;display:flex;flex-direction:column;gap:8px"></div>
      <div class="card"><ul class="pts">
        <li><span class="key">Eye:</span> the centre. Lowest pressure, calm wind.</li>
        <li><span class="key">Eyewall:</span> tall clouds circling the eye. Strongest winds, heaviest rain.</li>
        <li><span class="key">Rain bands:</span> spiral clouds with strong winds and rain.</li>
        <li>Pressure is <span class="hiP">higher</span> outside and <span class="loP">lowest</span> at the centre.</li></ul></div>
      <div class="ctrls"><button class="btn on" id="ctiso">Show pressure rings</button>${discuss('Where in a cyclone is the wind calm, and where is it strongest?', 'At the eye, at the very centre, the pressure is lowest and the wind is calm. The region all around the eye has very strong winds and heavy rainfall.')}</div>
    </div></div>`,
  setup(api) {
    const cx = 500, cy = 340, CR = 300;
    const st = { px: 700, py: 250, iso: true };
    const read = () => {
      const r = Math.hypot(st.px - cx, st.py - cy) / CR;
      const p = Math.round(994 + Math.min(14, 14 * Math.pow(Math.min(r, 1.2) / 1.2, .8)));
      let zone, wind, rain;
      if (r < .09) { zone = 'EYE'; wind = 'Calm'; rain = 'Little or none'; }
      else if (r < .2) { zone = 'EYEWALL'; wind = 'Strongest'; rain = 'Very heavy'; }
      else if (r < .85) { zone = 'RAIN BANDS'; wind = 'Strong'; rain = 'Heavy'; }
      else { zone = 'OUTER REGION'; wind = 'Moderate'; rain = 'Light'; }
      api.$('#ctread').innerHTML = `<div style="font-family:var(--f-display);font-size:44px;font-weight:900;color:var(--bolt)">${zone}</div>
        <div>Pressure: <b class="mono" style="color:${p < 1000 ? 'var(--lo)' : 'var(--hi)'}">≈ ${p} mb</b></div><div>Wind: <b>${wind}</b></div><div>Rain: <b>${rain}</b></div>`;
    };
    const sim = api.sim('#ctcv', {
      autoplay: true,
      pointer(type, x, y) { if (type === 'down' || type === 'drag') { st.px = clamp(x, 20, 980); st.py = clamp(y, 20, 660); read(); } },
      draw(c) {
        const t = this.t;
        D.oceanTop(c, 0, 0, 1000, 680);
        c.fillStyle = '#4b6b3a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(260, 0); c.quadraticCurveTo(170, 120, 60, 200); c.lineTo(0, 260); c.fill();
        D.cyclone(c, cx, cy, CR + 40, -t * .3, 1);
        // rotating wind arrows (anticlockwise, northern hemisphere)
        for (let i = 0; i < 8; i++) { const a = -t * .5 + i * TAU / 8, r = CR * .55; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; D.arrow(c, x, y, x + Math.sin(a) * 50, y - Math.cos(a) * 50, { color: COL.cool, w: 6, alpha: .85 }); }
        if (st.iso) [[.12, 996], [.3, 998], [.6, 1002], [.95, 1008]].forEach(([k, mb], j) => { c.strokeStyle = 'rgba(255,225,90,.55)'; c.lineWidth = 2; c.setLineDash([8, 8]); c.beginPath(); c.arc(cx, cy, CR * k, 0, TAU); c.stroke(); c.setLineDash([]); const la = [-1.2, -.4, 2.6, 1.1][j]; D.label(c, mb + ' mb', cx + CR * k * Math.cos(la), cy + CR * k * Math.sin(la), { size: 20, color: COL.bolt }); });
        D.HL(c, 70, 610, 'H', 32); D.HL(c, 930, 70, 'H', 32);
        D.label(c, 'Eye', cx, cy, { size: 24, bg: 'rgba(6,10,19,.6)' });
        D.label(c, 'Eyewall', cx + 90, cy - 70, { size: 22 });
        D.label(c, 'Rain bands', cx - 190, cy + 170, { size: 22 });
        // probe
        c.save(); c.translate(st.px, st.py);
        c.fillStyle = COL.bolt; c.strokeStyle = '#000'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 20, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = '#000'; c.beginPath(); c.arc(0, 0, 6, 0, TAU); c.fill(); c.restore();
        D.label(c, 'probe (drag me)', st.px, st.py - 42, { size: 20, force: true });
        D.label(c, 'Arrows: winds spin anticlockwise (as seen from above, over India)', 500, 660, { size: 20 });
      }
    });
    api.$('#ctiso').addEventListener('click', e => { st.iso = !st.iso; e.currentTarget.classList.toggle('on', st.iso); });
    read();
  }
});

S({
  id: 'cycland', sec: 11, title: 'Cyclone over ocean vs over land', sub: 'Move the cyclone towards the coast.',
  html: `<div class="row">
    <div class="vis"><canvas id="clcv" data-w="1100" data-h="600"></canvas>${slider('clx', 'Move cyclone', 0, 1, .005, 0, 'ocean', 'land')}</div>
    <div class="side">
      <div class="card" id="clmsg" style="font-size:30px"></div>
      ${mcq('What happens when a cyclone reaches land?', ['It becomes stronger', 'Its supply of moist air is cut off, so it gradually loses strength', 'It stops at once'], 1, 'Correct. Once over land, the source of moist air is cut off, and it gradually weakens. It can still cause huge damage on the way.')}
      <div class="ctrls">${discuss('Why can a cyclone weaken after reaching land?', 'A cyclone is powered by warm, moist air rising from the warm ocean. Over land, this supply of moist air is cut off, so less water vapour condenses, less heat is released, and the cyclone gradually loses its strength.')}</div>
    </div></div>`,
  setup(api) {
    const X = api.$('#clx');
    const strength = x => x < .55 ? 1 : Math.max(.15, 1 - (x - .55) * 1.9);
    const msg = () => { const x = +X.value, s = strength(x); api.$('#clmsg').innerHTML = x < .55 ? '<span class="safeT">Over the ocean:</span> warm, moist air keeps rising. The cyclone stays strong.' : `<span class="loP">Over land:</span> the moist-air supply is cut off. Strength: <b class="mono">${Math.round(s * 100)}%</b>`; };
    const sim = api.sim('#clcv', {
      autoplay: true,
      draw(c) {
        const t = this.t, x = +X.value, s = strength(x), coast = 760;
        D.oceanTop(c, 0, 0, coast, 600);
        c.fillStyle = '#4f7a3a'; c.beginPath(); c.moveTo(coast, 0); for (let y = 0; y <= 600; y += 10) c.lineTo(coast + Math.sin(y * .02) * 30, y); c.lineTo(1100, 600); c.lineTo(1100, 0); c.fill();
        c.strokeStyle = '#e8d39e'; c.lineWidth = 12; c.beginPath(); for (let y = 0; y <= 600; y += 10) c.lineTo(coast + Math.sin(y * .02) * 30, y); c.stroke();
        D.label(c, 'OCEAN', 140, 40, { size: 30, color: COL.cool, force: true }); D.label(c, 'LAND', 980, 40, { size: 30, color: '#b8f5cf', force: true });
        const cxp = 300 + x * 680, cyp = 320 - x * 60;
        // moisture supply
        if (cxp < coast - 40) for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, p = ((t * .6 + i * .37) % 1); const r = 200 * (1 - p); c.fillStyle = `rgba(150,220,255,${p})`; c.beginPath(); c.arc(cxp + Math.cos(a) * r, cyp + Math.sin(a) * r, 5, 0, TAU); c.fill(); }
        D.cyclone(c, cxp, cyp, 120 + s * 140, -t * (.2 + s * .5), .4 + s * .6);
        D.meter(c, 1000, 520, 70, s, 'Strength', Math.round(s * 100) + '%', s > .6 ? COL.lo : COL.safe);
        D.label(c, cxp < coast - 40 ? 'moist air supply: ON' : 'moist air supply: CUT OFF', cxp, cyp + 170 + s * 40, { size: 24, color: cxp < coast - 40 ? COL.cool : COL.lo, force: true });
      }
    });
    X.addEventListener('input', msg); msg();
  }
});

const HAZ = [
  ['wind', 'Strong winds', 'Trees bend and break; roofs and poles are damaged. Amphan (2020) had peak winds of 270 km/h.'],
  ['rain', 'Heavy rainfall', 'Very heavy rain can make rivers overflow.'],
  ['surge', 'Storm surge', 'Strong winds push ocean water towards the shore: a wall of water that can be 3–12 m high.'],
  ['flood', 'Flooding', 'The surge and heavy rain can flood coastal areas, and even areas far from the sea.'],
  ['slide', 'Landslides', 'Heavy rainfall can trigger landslides on hill slopes.'],
  ['trees', 'Fallen trees & blocked roads', 'Fallen trees and debris block roads, so help finds it hard to reach.'],
  ['power', 'Power outages', 'Power cuts can last for days, disrupting emergency services and daily life.'],
  ['salt', 'Saltwater contamination', 'Seawater rushing inland can contaminate drinking-water sources.'],
  ['farm', 'Damage to farmland', 'Salt in seawater makes soil less fertile, affecting crops.'],
];
S({
  id: 'hazards', sec: 11, title: 'Why cyclones are so dangerous', sub: 'Click each hazard to see it on the coast.',
  html: `<div class="row">
    <div class="vis"><canvas id="hzcv" data-w="1180" data-h="600" data-s=".86"></canvas>
      <div class="ctrls" id="hzbtns">${HAZ.map(h => `<button class="btn sm" data-hz="${h[0]}">${h[1]}</button>`).join('')}</div></div>
    <div class="side"><div class="card" id="hzinfo" style="font-size:31px;flex:1"></div>
      <div class="card explain" style="font-size:25px">A cyclone can leave behind damage that takes months or even years to repair.</div></div></div>`,
  setup(api) {
    const on = new Set(['wind']);
    const info = () => { const last = [...on].pop(); const h = HAZ.find(x => x[0] === last); api.$('#hzinfo').innerHTML = h ? `<h3 style="font-size:44px;color:var(--bolt)">${h[1]}</h3>${h[2]}` : 'Click a hazard.'; api.$$('[data-hz]').forEach(b => b.classList.toggle('on', on.has(b.dataset.hz))); };
    const R = rng(77), drops = Array.from({ length: 220 }, () => ({ x: R() * 1180, y: R() * 600, v: 600 + R() * 300 }));
    const sim = api.sim('#hzcv', {
      autoplay: true,
      update(s, dt) { drops.forEach(d => { d.y += d.v * dt; d.x += 200 * dt; if (d.y > 600) { d.y = -10; d.x = Math.random() * 1300 - 150; } }); },
      draw(c) {
        const t = this.t, W = 1180, H = 600;
        const surge = on.has('surge') ? .5 + .5 * Math.sin(t * .8) : 0, flood = on.has('flood') ? 1 : 0;
        D.sky(c, 0, 0, W, 420, '#2a323e', '#5a6472');
        D.cloud(c, 300, 60, 700, 170, { seed: 101, dark: .8 }); D.cloud(c, 900, 70, 700, 170, { seed: 102, dark: .8 });
        // hill on the left
        c.fillStyle = '#4a5a34'; c.beginPath(); c.moveTo(0, 470); c.quadraticCurveTo(120, 220, 300, 470); c.fill();
        if (on.has('slide')) { const p = (t * .3) % 1; c.fillStyle = '#7a5a34'; c.beginPath(); c.moveTo(150, 300 + p * 60); c.quadraticCurveTo(220, 380 + p * 60, 290, 470); c.lineTo(230, 470); c.quadraticCurveTo(170, 400, 130, 330 + p * 40); c.fill(); for (let i = 0; i < 6; i++) { c.fillStyle = '#5a4128'; c.beginPath(); c.arc(170 + i * 20 + p * 30, 360 + i * 18 + p * 30, 8, 0, TAU); c.fill(); } }
        // land
        c.fillStyle = on.has('farm') && flood ? '#6b6a45' : '#5f8a3a'; c.fillRect(0, 470, 860, 130);
        // farm rows
        c.strokeStyle = on.has('farm') ? '#8a7a50' : '#7cb34a'; c.lineWidth = 6; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(320 + i * 30, 500); c.lineTo(290 + i * 30, 590); c.stroke(); }
        if (on.has('farm')) { c.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 30; i++) c.fillRect(300 + (i * 37) % 180, 505 + (i * 23) % 80, 4, 4); D.label(c, 'salt on soil', 380, 585, { size: 20 }); }
        // houses
        const lit = !on.has('power');
        D.house(c, 520, 480, 120, 90, { lit, roofLift: on.has('wind') ? 6 + Math.sin(t * 20) * 3 : 0 }); D.house(c, 680, 480, 110, 80, { lit });
        // power pole
        c.save(); c.translate(820, 480); c.rotate(on.has('wind') ? .18 : 0); c.fillStyle = '#5a3a20'; c.fillRect(-5, -150, 10, 150); c.fillRect(-30, -140, 60, 8); c.restore();
        c.strokeStyle = '#222'; c.lineWidth = 2; c.beginPath(); c.moveTo(790, 340); c.quadraticCurveTo(700, 380, 640, 400); c.stroke();
        if (!lit) D.label(c, 'power cut', 700, 340, { size: 20, color: COL.lo });
        // well
        c.fillStyle = '#8a8f99'; c.fillRect(450, 455, 40, 25); c.fillStyle = on.has('salt') ? '#9a9a7a' : '#3d8fe0'; c.fillRect(455, 458, 30, 8);
        if (on.has('salt')) D.label(c, 'well: salty water', 470, 430, { size: 20, color: COL.lo });
        // trees
        const bend = on.has('wind') ? .8 + Math.sin(t * 5) * .1 : .1;
        if (on.has('trees')) { c.save(); c.translate(400, 480); c.rotate(1.35); D.tree(c, 0, 0, 140, 0, 5); c.restore(); c.fillStyle = '#555'; c.fillRect(340, 470, 160, 14); D.label(c, 'road blocked', 420, 455, { size: 20, color: COL.lo }); }
        else D.tree(c, 400, 482, 140, bend, 5);
        D.tree(c, 760, 482, 120, bend, 7);
        // sea + surge
        const seaTop = 470 - surge * 90 - flood * 20;
        D.sea(c, 860 - surge * 250 - flood * 150, seaTop, W, H - seaTop, t, { top: '#3f6f8f', bot: '#123a5c' });
        if (surge > 0) { D.arrow(c, 1150, seaTop - 40, 960 - surge * 200, seaTop - 40, { color: COL.cool, w: 14 }); D.label(c, 'wall of water: 3–12 m', 1000, seaTop - 90, { size: 24, color: COL.cool, force: true }); }
        if (flood) { c.fillStyle = 'rgba(70,110,140,.75)'; c.fillRect(0, 540, 860, 60); D.label(c, 'flood water', 150, 570, { size: 22 }); }
        if (on.has('rain') || on.has('wind')) D.rainDrops(c, drops, on.has('rain') ? .9 : .35, on.has('wind') ? 1 : .3);
        if (on.has('wind')) { c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; for (let i = 0; i < 16; i++) { const y = 150 + (i * 47) % 280, x = ((i * 211 + t * 1100) % 1400) - 100; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 90, y + 4); c.stroke(); } }
      }
    });
    api.on('[data-hz]', 'click', e => { const k = e.currentTarget.dataset.hz; if (on.has(k)) on.delete(k); else on.add(k); info(); sim.dirty = true; });
    info();
  }
});

const KIT = [['Drinking water', 1], ['Dry food', 1], ['Torch & batteries', 1], ['First-aid kit', 1], ['Important documents', 1], ['Medicines', 1], ['Charged phone / radio', 1], ['Glass showpieces', 0], ['Television set', 0], ['Video game console', 0], ['Heavy furniture', 0], ['Spare clothes', 1]];
S({
  id: 'cycsafe', sec: 12, title: 'Be cyclone ready', sub: 'Before and during a cyclone.',
  html: `<div class="row">
    <div class="col" style="width:1000px;flex:none">
      <div class="tabs"><button class="btn on" data-cs="before">BEFORE</button><button class="btn" data-cs="during">DURING</button></div>
      <div class="card" id="csbody" style="font-size:31px;min-height:300px"></div>
      <div class="card"><h3>Pack the emergency kit</h3><div style="font-size:25px;margin-bottom:10px">Click the items that belong in the kit. <span id="kitscore" class="key"></span></div>
        <div class="kit">${KIT.map((k, i) => `<button class="opt" data-kit="${i}">${k[0]}</button>`).join('')}</div></div>
    </div>
    <div class="side">
      <div class="card" style="border:3px solid var(--hi)"><h3 style="color:var(--hi)">India Meteorological Department (IMD)</h3>
        <ul class="pts" style="font-size:27px"><li>Constantly monitors cyclones and thunderstorms in India</li><li>Issues weather reports, periodic alerts and warnings</li><li>Weather satellites help track cyclones and predict their path</li></ul></div>
      <div class="card explain" style="font-size:26px">Several national and international organisations work together to monitor cyclone-related disasters. Early warnings help reduce the loss of life and property.</div>
    </div></div>`,
  setup(api) {
    const body = {
      before: `<ul class="pts" style="font-size:32px"><li>Stay updated on <span class="key">weather reports</span>, alerts and warnings from the <span class="key">IMD</span></li><li>Follow <span class="key">official warnings</span> and instructions</li><li>Keep an <span class="key">emergency kit</span> ready with essential items</li><li>Know where the nearest <span class="key">cyclone shelter</span> is</li></ul>`,
      during: `<ul class="pts" style="font-size:32px"><li>Quickly move to a nearby <span class="key">designated cyclone shelter</span> when advised</li><li>Keep following <span class="key">official instructions</span></li><li>Stay away from the sea shore and other dangerous, exposed places</li><li>Stay indoors in the shelter until officials say it is safe</li></ul>`
    };
    const show = k => { api.$('#csbody').innerHTML = body[k]; api.$$('[data-cs]').forEach(b => b.classList.toggle('on', b.dataset.cs === k)); };
    api.on('[data-cs]', 'click', e => show(e.currentTarget.dataset.cs)); show('before');
    let good = 0; const need = KIT.filter(k => k[1]).length;
    api.on('[data-kit]', 'click', e => {
      const b = e.currentTarget, k = KIT[+b.dataset.kit]; if (b.classList.contains('packed') || b.classList.contains('nope')) return;
      if (k[1]) { b.classList.add('packed'); good++; } else b.classList.add('nope');
      api.$('#kitscore').textContent = good === need ? 'Kit complete! Well done.' : `${good} / ${need} packed`;
    });
  }
});

S({
  id: 'check11', sec: 12, title: 'Concept check: Cyclones', kick: 'Check your understanding',
  html: `<div class="qgrid" style="grid-template-columns:1.25fr 1fr">
    ${seq('Order the steps of cyclone formation.', ['Ocean water gets heated', 'Warm, moist air rises', 'Water vapour condenses and releases heat', 'Air warms further and rises even more; pressure falls more', 'Surrounding air rushes in and rises too', 'Earth\'s rotation makes the moving air spin'], 'Excellent! The cycle repeats, creating a very low-pressure area with high-speed winds revolving around it: a cyclone.')}
    <div class="col" style="gap:20px">
      ${mcq('True or false: The weather is stormy at the eye of a cyclone.', ['True', 'False'], 1, 'False. At the eye the wind is calm. The region around the eye has strong winds and heavy rain.')}
      ${mcq('Where is the pressure lowest in a cyclone?', ['At the outer edge', 'At the centre (the eye)', 'It is the same everywhere'], 1, 'Correct. The eye has the lowest pressure.')}
    </div></div>`
});

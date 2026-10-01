/* ============ SECTION 2: PRESSURE EXERTED BY LIQUIDS ============ */
function glassPipe(c, x, top, bot, w) {
  c.save();
  c.fillStyle = 'rgba(200,225,255,.08)'; c.fillRect(x - w / 2, top, w, bot - top);
  c.strokeStyle = 'rgba(210,230,255,.75)'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(x - w / 2, top); c.lineTo(x - w / 2, bot); c.moveTo(x + w / 2, top); c.lineTo(x + w / 2, bot); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - w / 2 + 7, top + 10); c.lineTo(x - w / 2 + 7, bot - 10); c.stroke();
  c.restore();
}
function waterCol(c, x, level, bot, w) {
  if (level >= bot) return;
  const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, 'rgba(40,120,210,.85)'); g.addColorStop(.5, 'rgba(90,170,240,.85)'); g.addColorStop(1, 'rgba(40,120,210,.85)');
  c.fillStyle = g; c.fillRect(x - w / 2 + 2, level, w - 4, bot - level);
  c.fillStyle = 'rgba(180,225,255,.9)'; c.beginPath(); c.ellipse(x, level, w / 2 - 2, 5, 0, 0, TAU); c.fill();
}
function balloonBulge(c, x, y, w, b) {
  // rubber balloon tied at pipe bottom; b = bulge size px
  c.save();
  const g = c.createRadialGradient(x - b * .3, y + b * .4, 2, x, y + b * .5, w / 2 + b);
  g.addColorStop(0, '#ff9a8a'); g.addColorStop(.6, '#e0453a'); g.addColorStop(1, '#9c241c');
  c.fillStyle = g; c.beginPath();
  c.moveTo(x - w / 2 - 3, y - 14);
  c.bezierCurveTo(x - w / 2 - 3 - b * .55, y + b * .5, x - b * .8, y + b * 1.15 + 14, x, y + b * 1.15 + 14);
  c.bezierCurveTo(x + b * .8, y + b * 1.15 + 14, x + w / 2 + 3 + b * .55, y + b * .5, x + w / 2 + 3, y - 14);
  c.closePath(); c.fill();
  c.fillStyle = '#7a1a14'; c.fillRect(x - w / 2 - 6, y - 20, w + 12, 9);
  c.restore();
}

S({
  id: 'pipes', sec: 2, title: 'Do liquids exert pressure?', sub: 'Activity 6.1: a narrow pipe and a broad pipe, each with a balloon tied at the bottom.',
  html: `<div class="row">
    <div class="vis"><canvas id="pipecv" data-w="1000" data-h="640" data-s=".84"></canvas>
      <div class="ctrls">${ctl('main', { playTxt: 'Pour water (same height)' }).replace('<div class="ctrls" data-for="main">', '').replace(/<\/div>$/, '')}</div>
      ${slider('hn', 'Narrow pipe water', 0, 24, .5, 12, '', 'cm')}
      ${slider('hb', 'Broad pipe water', 0, 24, .5, 12, '', 'cm')}</div>
    <div class="side">
      ${predict('Both pipes are filled to the SAME height. Which balloon bulges more?', ['Narrow pipe', 'Broad pipe (more water)', 'Both bulge equally'])}
      <div class="card reveal" id="pipewhy" style="border-color:var(--safe)"><h3>They bulge equally!</h3><ul class="pts">
        <li>The broad pipe holds <b>more water</b> (more weight)…</li>
        <li>…but the bulge is the <span class="key">same</span>.</li>
        <li>So it is not the weight. It is the <span class="key">pressure of the water column</span>.</li>
        <li>Same height → same pressure at the bottom.</li></ul></div>
      <div class="card explain" style="font-size:27px">Now use the sliders: <span class="key">taller water column → greater pressure → bigger bulge</span>.</div>
    </div></div>`,
  setup(api) {
    const hn = api.$('#hn'), hb = api.$('#hb');
    const st = { n: 0, b: 0 };
    const pipeTop = 90, pipeBot = 490, cmPx = (pipeBot - pipeTop) / 25;
    const sim = api.sim('#pipecv', {
      reset(s) { st.n = 0; st.b = 0; s.filled = false; hn.value = 12; hb.value = 12; },
      update(s, dt) {
        st.n = Math.min(12, st.n + dt * 4); st.b = Math.min(12, st.b + dt * 4);
        if (st.n >= 12 && !s.filled) { s.filled = true; this.pause(); api.$('#pipewhy').classList.add('show'); }
      },
      idle() {
        if (this.s.filled) { st.n += (+hn.value - st.n) * .15; st.b += (+hb.value - st.b) * .15; }
      },
      draw(c) {
        D.sky(c, 0, 0, 1000, 640, '#182235', '#0d1422');
        // stand
        c.fillStyle = '#6b7380'; c.fillRect(110, 40, 16, 580); c.fillRect(60, 600, 840, 18); c.fillRect(110, 60, 760, 12);
        const pipes = [[330, 34, st.n, 'Narrow pipe'], [690, 100, st.b, 'Broad pipe']];
        pipes.forEach(([x, w, h, name]) => {
          c.fillStyle = '#4e5663'; c.fillRect(x - w / 2 - 14, 150, w + 28, 14);
          const level = pipeBot - h * cmPx;
          waterCol(c, x, level, pipeBot + 6, w);
          glassPipe(c, x, pipeTop, pipeBot, w);
          const bul = h * 4.2;
          balloonBulge(c, x, pipeBot + 14, w, bul);
          if (h > .5) {
            D.arrow(c, x, pipeBot - 40, x, pipeBot + 10 + bul * .6, { color: COL.bolt, w: 4 + h * .5, outline: false });
            c.strokeStyle = COL.cool; c.lineWidth = 3; c.setLineDash([6, 6]);
            c.beginPath(); c.moveTo(x + w / 2 + 34, level); c.lineTo(x + w / 2 + 34, pipeBot); c.stroke(); c.setLineDash([]);
            D.label(c, `h = ${h.toFixed(1)} cm`, x + w / 2 + 110, (level + pipeBot) / 2, { size: 26, color: COL.cool });
          }
          D.label(c, name, x, 40, { size: 28, force: true });
          D.label(c, 'Pressure at bottom', x, 610 - 4, { size: 22, color: COL.muted });
          const pf = h / 24; c.fillStyle = '#24324d'; c.fillRect(x - 80, 570, 160, 14); c.fillStyle = COL.bolt; c.fillRect(x - 80, 570, 160 * pf, 14);
        });
        if (this.s.filled && Math.abs(+hn.value - +hb.value) < .01) D.label(c, 'Same height → same bulge', 510, 330, { size: 30, color: COL.safe });
      }
    });
    [hn, hb].forEach(i => i.addEventListener('input', () => { if (!sim.s.filled) { sim.s.filled = true; api.$('#pipewhy').classList.add('show'); } sim.dirty = true; }));
  }
});

S({
  id: 'tank', sec: 2, title: 'Why are water tanks placed at a height?', sub: 'Raise or lower the tank. Watch the taps on each floor.',
  html: `<div class="row">
    <div class="vis"><canvas id="tankcv" data-w="1000" data-h="660" data-s=".9"></canvas>
      <div class="ctrls"><div class="seg"><button class="btn" data-th="0">LOW tank</button><button class="btn on" data-th="1">HIGH tank</button></div></div>
      ${slider('tankh', 'Tank height', 0, 1, .01, 1, 'low', 'high')}</div>
    <div class="side">
      ${mcq('You live on the 2nd floor; your friend lives on the 1st floor. The tank is on the roof. Who gets a stronger stream of water?', ['You (2nd floor)', 'Your friend (1st floor)', 'Both the same'], 1, 'Your friend! The 1st floor tap is further below the water level in the tank, so the water column above it is taller and the pressure there is greater.')}
      <div class="card"><h3>Why at a height?</h3><button class="btn go" id="tankwhy">Reveal the reason</button>
        <div class="reveal" id="tankr" style="font-size:28px;margin-top:10px">A tank placed high makes a <span class="key">tall water column</span> above the taps. Taller column → <span class="key">greater pressure</span> at the taps → a <span class="key">good stream</span> of water.</div></div>
      <div class="ctrls">${discuss('Why are overhead tanks placed at a height?', 'The pressure exerted by a liquid depends on the height of its column. A tank at a height gives a taller water column above every tap, so the pressure at the taps increases and water flows out with a good stream.')}</div>
    </div></div>`,
  setup(api) {
    const H = api.$('#tankh');
    let hs = 1;
    const sim = api.sim('#tankcv', {
      autoplay: true,
      update(s, dt) { hs += (+H.value - hs) * Math.min(1, dt * 5); },
      draw(c) {
        const t = this.t;
        D.sky(c, 0, 0, 1000, 660, '#7ab8e8', '#d8ecf8');
        D.ground(c, 0, 600, 1000, 60);
        const bx = 140, bw = 470, floorH = 112, base = 600, roof = base - floorH * 3;
        // building
        const bgw = c.createLinearGradient(bx, 0, bx + bw, 0); bgw.addColorStop(0, '#efe2c6'); bgw.addColorStop(1, '#cdb994');
        c.fillStyle = bgw; c.fillRect(bx, roof, bw, floorH * 3);
        c.strokeStyle = '#8a7656'; c.lineWidth = 6;
        for (let i = 0; i <= 3; i++) { c.beginPath(); c.moveTo(bx, base - floorH * i); c.lineTo(bx + bw, base - floorH * i); c.stroke(); }
        ['Ground floor', 'First floor', 'Second floor'].forEach((n, i) => {
          D.text(c, n, bx + 250, base - floorH * i - floorH / 2, { size: 28, color: '#3a2d1c', shadow: false });
          c.fillStyle = '#9ec9e8'; c.fillRect(bx + 30, base - floorH * i - 92, 80, 56); c.strokeStyle = '#6b5a40'; c.lineWidth = 4; c.strokeRect(bx + 30, base - floorH * i - 92, 80, 56);
        });
        // tank on stand
        const standH = 16 + hs * 130, tw = 150, th = 84, tx = bx + bw - 210, ty = roof - standH - th;
        c.fillStyle = '#555c66'; c.fillRect(tx + 15, roof - standH, 12, standH); c.fillRect(tx + tw - 27, roof - standH, 12, standH);
        c.fillStyle = '#1e2a3a'; D.rr(c, tx, ty, tw, th, 10); c.fill();
        const wl = ty + 22;
        c.fillStyle = '#3d8fe0'; c.fillRect(tx + 6, wl, tw - 12, th - 28);
        c.fillStyle = '#e8edf2'; c.globalAlpha = .1; c.fillRect(tx, ty, tw, th); c.globalAlpha = 1;
        D.label(c, 'Water tank', tx - 80, ty + th / 2, { size: 24 });
        // pipe
        const px = tx + tw / 2 + 30 + 120;
        c.strokeStyle = '#8b939e'; c.lineWidth = 14;
        c.beginPath(); c.moveTo(tx + tw - 6, ty + th - 14); c.lineTo(px, ty + th - 14); c.lineTo(px, base - 60); c.stroke();
        // water level reference line
        c.strokeStyle = 'rgba(61,143,224,.8)'; c.setLineDash([10, 8]); c.lineWidth = 3; c.beginPath(); c.moveTo(tx, wl); c.lineTo(980, wl); c.stroke(); c.setLineDash([]);
        D.label(c, 'water level', 900, wl + 22, { size: 22, color: COL.cool });
        // taps per floor
        for (let i = 0; i < 3; i++) {
          const ty2 = base - floorH * i - 64;
          c.strokeStyle = '#8b939e'; c.lineWidth = 10; c.beginPath(); c.moveTo(px, ty2); c.lineTo(px + 40, ty2); c.lineTo(px + 40, ty2 + 14); c.stroke();
          const h = ty2 - wl; // column height (px)
          const v = Math.sqrt(Math.max(0, h)) * 3.2;
          // stream
          c.strokeStyle = 'rgba(90,170,240,.9)'; c.lineWidth = 8; c.lineCap = 'round';
          c.beginPath(); let x0 = px + 40, y0 = ty2 + 18;
          for (let k = 0; k <= 30; k++) { const tt = k / 30 * 1.2; const xx = x0 + v * tt * 4, yy = y0 + 120 * tt * tt; if (yy > base - floorH * i - 4) break; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
          c.stroke();
          for (let k = 0; k < 5; k++) { const tt = ((t * 1.5 + k / 5) % 1) * 1.2; const xx = x0 + v * tt * 4, yy = y0 + 120 * tt * tt; if (yy < base - floorH * i - 4) { c.fillStyle = '#d4ecff'; c.beginPath(); c.arc(xx, yy, 4, 0, TAU); c.fill(); } }
          // column height bracket
          c.strokeStyle = COL.bolt; c.lineWidth = 3; c.beginPath(); c.moveTo(px + 150 + i * 46, wl); c.lineTo(px + 150 + i * 46, ty2); c.stroke();
          c.beginPath(); c.moveTo(px + 140 + i * 46, ty2); c.lineTo(px + 160 + i * 46, ty2); c.stroke();
          D.label(c, ['strongest', 'medium', 'weakest'][i], px + 70 + v * 2, ty2 - 30, { size: 22, color: [COL.safe, COL.bolt, COL.lo][i] });
        }
        D.label(c, 'yellow line = height of\nwater column above tap', 850, wl + 86, { size: 22, color: COL.bolt });
      }
    });
    api.on('[data-th]', 'click', e => { H.value = e.currentTarget.dataset.th === '1' ? 1 : 0; api.$$('[data-th]').forEach(b => b.classList.toggle('on', b === e.currentTarget)); });
    H.addEventListener('input', () => api.$$('[data-th]').forEach(b => b.classList.toggle('on', (+b.dataset.th === 1) === (+H.value > .5))));
    api.$('#tankwhy').addEventListener('click', () => api.$('#tankr').classList.add('show'));
  }
});

S({
  id: 'bottle', sec: 2, title: 'Do liquids push on the walls too?', sub: 'Activity 6.2: four holes at the SAME height near the bottom of a bottle.',
  html: `<div class="row">
    <div class="vis"><canvas id="botcv" data-w="1000" data-h="640"></canvas>
      <div class="ctrls">${ctl('main', { playTxt: 'Remove the tape' }).replace('<div class="ctrls" data-for="main">', '').replace(/<\/div>$/, '')}</div></div>
    <div class="side">
      ${predict('What happens when the tape is removed from all four holes together?', ['Nothing, water only presses down', 'Water spurts out sideways from every hole', 'Water comes out of only one hole'])}
      <div class="card reveal" id="botwhy" style="border-color:var(--safe)"><h3>Water spurts out of all holes</h3><ul class="pts">
        <li>Liquids push on the <span class="key">sides</span> of a container, not only the bottom.</li>
        <li>Liquids exert pressure in <span class="key">all directions</span>.</li>
        <li>Same height → same pressure → equal jets.</li></ul></div>
      <div class="card explain" style="font-size:27px">Water spurting from a leaking pipe joint is the same idea: water presses on the walls of the pipe.</div>
    </div></div>`,
  setup(api) {
    const sim = api.sim('#botcv', {
      reset(s) { s.level = 1; s.open = false; s.drops = []; },
      onplay(s) { s.open = true; },
      update(s, dt) {
        s.level = Math.max(.08, s.level - dt * .025);
        if (this.t > 2.5) api.$('#botwhy').classList.add('show');
        const v = Math.sqrt(s.level) * 1;
        for (let k = 0; k < 4; k++) s.drops.push({ hole: k, t: 0, v, j: Math.random() });
        s.drops.forEach(d => d.t += dt); s.drops = s.drops.filter(d => d.t < 1.2);
      },
      draw(c, s) {
        D.sky(c, 0, 0, 1000, 640, '#1b2436', '#0e1523');
        c.fillStyle = '#334055'; c.fillRect(0, 560, 1000, 80);
        const bx = 330, bw = 180, top = 140, bot = 540, holeY = 500;
        const wl = bot - (bot - top - 60) * s.level;
        // water
        const g = c.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0); g.addColorStop(0, 'rgba(40,120,210,.8)'); g.addColorStop(.5, 'rgba(100,180,245,.8)'); g.addColorStop(1, 'rgba(40,120,210,.8)');
        c.fillStyle = g; c.fillRect(bx - bw / 2 + 4, wl, bw - 8, bot - wl - 4);
        c.fillStyle = 'rgba(190,230,255,.8)'; c.beginPath(); c.ellipse(bx, wl, bw / 2 - 4, 10, 0, 0, TAU); c.fill();
        // bottle outline
        c.strokeStyle = 'rgba(220,235,255,.85)'; c.lineWidth = 5;
        c.beginPath(); c.moveTo(bx - 30, 60); c.lineTo(bx - 30, 90); c.quadraticCurveTo(bx - bw / 2, 110, bx - bw / 2, top + 20); c.lineTo(bx - bw / 2, bot - 14); c.quadraticCurveTo(bx - bw / 2, bot, bx - bw / 2 + 14, bot);
        c.lineTo(bx + bw / 2 - 14, bot); c.quadraticCurveTo(bx + bw / 2, bot, bx + bw / 2, bot - 14); c.lineTo(bx + bw / 2, top + 20); c.quadraticCurveTo(bx + bw / 2, 110, bx + 30, 90); c.lineTo(bx + 30, 60); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 4; c.beginPath(); c.moveTo(bx - bw / 2 + 16, top + 40); c.lineTo(bx - bw / 2 + 16, bot - 30); c.stroke();
        // holes (left, right, front-left, front-right as ellipse positions)
        const holes = [[bx - bw / 2, -1, 1], [bx + bw / 2, 1, 1], [bx - 45, -1, .45], [bx + 45, 1, .45]];
        holes.length = 2;
        holes.forEach(([hx]) => { c.fillStyle = '#0b0f18'; c.beginPath(); c.arc(hx, holeY, 6, 0, TAU); c.fill(); });
        if (!s.open) { c.fillStyle = 'rgba(230,220,170,.95)'; holes.forEach(([hx]) => c.fillRect(hx - 16, holeY - 12, 32, 24)); D.label(c, 'tape', bx - bw / 2 - 60, holeY, { size: 22 }); }
        else {
          const v = Math.sqrt(s.level);
          holes.forEach(([hx, dir, k], i) => {
            c.strokeStyle = 'rgba(110,185,245,.85)'; c.lineWidth = 7 * k + 2; c.lineCap = 'round'; c.beginPath();
            for (let j = 0; j <= 24; j++) { const tt = j / 24; const xx = hx + dir * v * 260 * k * tt, yy = holeY + 120 * tt * tt * (1.2 - v * .3); if (yy > 556) break; j ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
            c.stroke();
          });
          s.drops.forEach(d => { if (d.hole > 1) return; const [hx, dir, k] = holes[d.hole]; const xx = hx + dir * d.v * 260 * k * d.t, yy = holeY + 120 * d.t * d.t * (1.2 - d.v * .3); if (yy < 556) { c.fillStyle = 'rgba(220,240,255,.8)'; c.fillRect(xx - 2, yy - 2, 4, 4); } });
        }
        // top-view inset
        const ix = 800, iy = 180, ir = 70;
        c.fillStyle = 'rgba(8,13,24,.85)'; D.rr(c, ix - 170, iy - 150, 340, 330, 16); c.fill(); c.strokeStyle = '#2a3b5c'; c.lineWidth = 2; c.stroke();
        D.text(c, 'View from above', ix, iy - 120, { size: 24, color: COL.muted });
        c.fillStyle = 'rgba(61,143,224,.7)'; c.beginPath(); c.arc(ix, iy + 10, ir, 0, TAU); c.fill(); c.strokeStyle = '#cfe3ff'; c.lineWidth = 3; c.stroke();
        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; D.arrow(c, ix + Math.cos(a) * ir * .4, iy + 10 + Math.sin(a) * ir * .4, ix + Math.cos(a) * (ir + (s.open ? 70 : 20)), iy + 10 + Math.sin(a) * (ir + (s.open ? 70 : 20)), { color: COL.bolt, w: 6 }); }
        // pressure in all directions at a point
        D.label(c, 'Pressure acts in\nALL directions', 800, 470, { size: 26, color: COL.bolt });
        const px = 330, py = 400;
        if (s.level > .3) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; D.arrow(c, px, py, px + Math.cos(a) * 42, py + Math.sin(a) * 42, { color: '#fff', w: 3, head: 10, outline: false }); }
        D.label(c, s.open ? 'Equal jets from holes at the same height' : 'Holes sealed with tape', 330, 600, { size: 24 });
      }
    });
  }
});

S({
  id: 'dam', sec: 2, title: 'Why is a dam broader at the bottom?', sub: 'Raise the water. Watch how the push on the dam wall changes with depth.',
  html: `<div class="row">
    <div class="vis"><canvas id="damcv" data-w="1080" data-h="620"></canvas>
      ${slider('daml', 'Water level', .2, 1, .01, .85, 'low', 'high')}</div>
    <div class="side">
      <div class="card"><ul class="pts">
        <li>Water pushes <span class="key">sideways</span> on the dam wall and <span class="key">down</span> on the floor.</li>
        <li>The deeper you go, the <span class="loP">greater the pressure</span>.</li>
        <li>So the pressure is <span class="key">largest near the bottom</span>.</li>
        <li>A <span class="key">broad base</span> supports the dam and withstands this large pressure.</li></ul></div>
      ${mcq('Where is the water pressure on a dam wall the greatest?', ['Near the top', 'In the middle', 'Near the bottom'], 2, 'Correct. The water column above is tallest at the bottom, so the pressure there is greatest.')}
      <div class="ctrls">${discuss('Why are dam walls broader near the bottom?', 'Water pressure increases with depth. Near the bottom, the water pushes sideways on the wall with a very large pressure. A broader base supports the structure and withstands this large horizontal pressure.')}</div>
    </div></div>`,
  setup(api) {
    const L = api.$('#daml');
    const sim = api.sim('#damcv', {
      autoplay: true,
      draw(c) {
        const t = this.t, lev = +L.value;
        D.sky(c, 0, 0, 1080, 620, '#7ab8e8', '#d8ecf8');
        // valley floor
        c.fillStyle = '#6b5a40'; c.fillRect(0, 560, 1080, 60);
        // reservoir
        const damX = 560, top = 120, bot = 560, wl = bot - (bot - top - 20) * lev;
        D.sea(c, 0, wl, damX - 10, bot - wl, t, { top: '#3d8fd0', bot: '#0d3a66' });
        // dam: trapezoid (narrow top, broad bottom)
        const g = c.createLinearGradient(damX, 0, damX + 260, 0); g.addColorStop(0, '#b9b4a8'); g.addColorStop(1, '#8a857a');
        c.fillStyle = g; c.beginPath(); c.moveTo(damX - 20, top); c.lineTo(damX + 40, top); c.lineTo(damX + 300, bot); c.lineTo(damX - 20, bot); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; for (let y = top + 40; y < bot; y += 40) { c.beginPath(); c.moveTo(damX - 20, y); c.lineTo(damX + 40 + (y - top) / (bot - top) * 260, y); c.stroke(); }
        // downstream river
        c.fillStyle = '#5c8fbf'; c.fillRect(damX + 300, bot - 16, 220, 16);
        // pressure arrows on face (grow with depth)
        for (let y = wl + 22; y < bot - 6; y += 34) {
          const depth = (y - wl) / (bot - top);
          const len = 18 + depth * 230;
          D.arrow(c, damX - 30 - len, y, damX - 26, y, { color: mix('#ffe15a', '#ff6266', clamp(depth * 1.4, 0, 1)), w: 5 + depth * 9, head: 16 + depth * 10 });
        }
        // floor arrows
        for (let x = 60; x < damX - 40; x += 90) D.arrow(c, x, bot - 60, x, bot - 8, { color: 'rgba(255,255,255,.6)', w: 4, head: 12, outline: false });
        D.label(c, 'small push near the top', 240, wl + 30, { size: 24, color: COL.bolt });
        D.label(c, 'LARGE push near the bottom', 260, bot - 100, { size: 26, color: COL.lo, force: true });
        D.label(c, 'Broad base', damX + 160, bot - 40, { size: 26, color: '#fff' });
        D.label(c, 'Narrow top', damX + 10, top - 30, { size: 24 });
      }
    });
  }
});

S({
  id: 'check2', sec: 2, title: 'Concept check: Liquid pressure', kick: 'Check your understanding',
  html: `<div class="qgrid">
    ${mcq('What happens to the pressure at the bottom when the height of the water column increases?', ['It decreases', 'It increases', 'It stays the same'], 1, 'Yes. Taller water column → greater pressure at the bottom → the balloon bulges more.')}
    ${mcq('True or false: Liquids exert pressure only at the bottom of a container.', ['True', 'False'], 1, 'False! Water spurts out of holes in the sides of a bottle. Liquids exert pressure in all directions.')}
    ${mcq('A tank is on a roof at height H. To get water with more pressure on the ground floor, we should…', ['increase the height H', 'decrease the height H', 'use a bigger tank at the same height'], 0, 'Correct. A higher tank makes a taller water column above the tap, so the pressure increases.')}
    <div class="q" data-type="mcq"><div class="qtag">Concept check</div><div class="qt">Vessels P, Q and R are joined at the bottom. Water is poured into R. When pouring stops, the water level will be…</div>
      <svg viewBox="0 0 600 150" style="height:130px"><path d="M40 20 L40 120 L560 120 L560 20" fill="none" stroke="#cfe3ff" stroke-width="0"/>
        <rect x="60" y="62" width="80" height="58" fill="#3d8fe0"/><path d="M60 20 L60 120 L140 120 L140 20" fill="none" stroke="#cfe3ff" stroke-width="4"/>
        <path d="M250 62 L230 120 L370 120 L350 62 Z" fill="#3d8fe0"/><path d="M262 20 L230 120 M338 20 L370 120" stroke="#cfe3ff" stroke-width="4"/>
        <rect x="470" y="62" width="40" height="58" fill="#3d8fe0"/><path d="M470 20 L470 120 M510 20 L510 120" stroke="#cfe3ff" stroke-width="4"/>
        <rect x="140" y="104" width="90" height="16" fill="#3d8fe0"/><rect x="370" y="104" width="100" height="16" fill="#3d8fe0"/><path d="M60 120 L510 120" stroke="#cfe3ff" stroke-width="4"/>
        <text x="100" y="146" fill="#fff" font-size="22" text-anchor="middle">P</text><text x="300" y="146" fill="#fff" font-size="22" text-anchor="middle">Q</text><text x="490" y="146" fill="#fff" font-size="22" text-anchor="middle">R</text></svg>
      <div class="opts"><button class="opt" data-i="0">Highest in P</button><button class="opt" data-i="1">Highest in R</button><button class="opt" data-ok="1" data-i="2">Equal in all three</button></div>
      <div class="fb ans">Correct! The water settles at the same level in all three, whatever their shape. Only height decides liquid pressure, so the levels balance.</div><div class="fb bad">Not quite. Does the shape of the vessel matter, or only the height of water?</div></div>
  </div>`
});

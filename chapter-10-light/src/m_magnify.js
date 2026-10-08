/* ================= Modules 13–14: water drop and magnifying glass ================= */

/* ---------- MODULE 13: water drop as a lens (Activity 10.8) ---------- */
frame({
  mod: 13, kick: 'Activity 10.8 · Let us explore', title: 'A drop of water is a lens', mapTitle: 'Water drop as a simple lens',
  sub: 'Place a drop of water on an oiled glass strip over printed text. Look down through the drop.',
  build(b, f) {
    f.on = false; f.R = 0; f.fall = -1;
    const S = 2, Wd = 860, Hd = 778;
    f.c = canvas(b, Wd, Hd, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    // printed page at 2x resolution
    const src = document.createElement('canvas'); src.width = Wd * S; src.height = Hd * S;
    const s = src.getContext('2d'); s.scale(S, S);
    s.fillStyle = '#efeadf'; s.fillRect(0, 0, Wd, Hd);
    for (let i = 0; i < 2000; i++) { s.fillStyle = `rgba(120,100,70,${Math.random() * .05})`; s.fillRect(Math.random() * Wd, Math.random() * Hd, 2, 2); }
    s.fillStyle = '#2b2f38'; s.textAlign = 'center'; s.textBaseline = 'middle';
    for (let i = 0; i < 9; i++) { s.font = `600 30px ${FONT}`; s.fillText('SCIENCE', Wd / 2, 90 + i * 74); }
    s.font = `16px ${FONT}`; s.textAlign = 'left'; s.fillStyle = '#5a5f6b';
    const words = 'Light travels in straight lines. Rays show the path along which light travels. A lens is a piece of transparent material with curved surfaces. Like mirrors, lenses can also be convex or concave. '.repeat(6).split(' ');
    for (const X of [24, Wd - 236]) { let line = '', yy = 40; for (const w of words) { const tt = line + w + ' '; if (s.measureText(tt).width > 205) { s.fillText(line, X, yy); line = w + ' '; yy += 28; if (yy > Hd - 20) break; } else line = tt; } }
    f.src = src; f.S = S; f.srcData = s.getImageData(0, 0, src.width, src.height);
    f.patch = document.createElement('canvas'); f.cx = Wd / 2; f.cy = 90 + 4 * 74;
    // cross-section + controls
    f.c2 = canvas(b, 910, 420, 'position:absolute;left:882px;top:0'); f.c2.cv.classList.add('glass');
    const ctl = h('div', { class: 'abs', style: 'left:882px;top:440px;width:910px;display:grid;grid-template-columns:1fr 1fr;gap:16px' }); b.append(ctl);
    f.seg = ui.seg({ options: [{ v: false, t: 'NO WATER DROP' }, { v: true, t: 'WATER DROP' }], value: false, onChange: v => { f.on = v; if (v) f.fall = 0; } });
    ctl.append(ui.card('Toggle', f.seg, h('p', { style: 'margin-top:14px;font-size:22px', html: 'The drop’s surface <b>curves outward</b>, like a convex lens.' })),
      ui.discover({ prompt: 'LOOK AT THE LETTERS UNDER THE DROP.', qs: ['Are the letters under the drop larger or smaller?', 'What is the shape of the drop’s surface?', 'What everyday tool does the same thing?'], reveal: 'The curved water surface acts like a simple <b>convex lens</b>, so the letters look <b>enlarged</b>. A magnifying glass works the same way.' }));
  },
  tick(f, dt, t) {
    const target = f.on ? 110 : 0;
    if (f.on && f.fall >= 0 && f.fall < 1) f.fall = Math.min(1, f.fall + dt * 1.4);
    const grow = f.on ? (f.fall >= 1 ? 1 : 0) : 1;
    if (grow) f.R += (target - f.R) * Math.min(1, dt * (f.on ? 3 : 5));
    const wob = f.on && f.R > 5 && f.R < 108 ? Math.sin(t * 9) * (1 - f.R / 110) * 6 : 0;
    const Rd = Math.max(0, f.R + wob);
    const x = begin(f.c);
    x.drawImage(f.src, 0, 0, f.c.w, f.c.h);
    // glass strip
    x.fillStyle = 'rgba(190,225,255,.13)'; x.fillRect(f.cx - 180, 0, 360, f.c.h);
    x.strokeStyle = 'rgba(220,240,255,.6)'; x.lineWidth = 2; x.strokeRect(f.cx - 180, -4, 360, f.c.h + 8);
    tag(x, 'glass strip (oiled)', f.cx + 120, 22, { size: 16, col: '#3b4a60', bg: 'rgba(255,255,255,.6)', need: true });
    if (Rd > 2) {
      const S = f.S, R2 = Math.round(Rd * S), M0 = 1 + .85 * (Rd / 110);
      const pw = 2 * R2 + 2; f.patch.width = pw; f.patch.height = pw;
      const pc = f.patch.getContext('2d'), out = pc.createImageData(pw, pw), sd = f.srcData, sw = f.src.width;
      const ccx = Math.round(f.cx * S), ccy = Math.round(f.cy * S);
      for (let j = 0; j < pw; j++) for (let i = 0; i < pw; i++) {
        const dx = i - R2, dy = j - R2, r = Math.hypot(dx, dy); if (r > R2) continue;
        const q = r / R2, rp = r / M0 + (1 - 1 / M0) * R2 * q * q * q, k = r > 0 ? rp / r : 0;
        const sx = clamp(Math.round(ccx + dx * k), 0, sw - 1), sy = clamp(Math.round(ccy + dy * k), 0, f.src.height - 1);
        const si = (sy * sw + sx) * 4, oi = (j * pw + i) * 4, shade = 1 - .25 * Math.pow(q, 6);
        out.data[oi] = sd.data[si] * shade; out.data[oi + 1] = sd.data[si + 1] * shade; out.data[oi + 2] = sd.data[si + 2] * shade * 1.02; out.data[oi + 3] = 255;
      }
      pc.putImageData(out, 0, 0);
      x.drawImage(f.patch, f.cx - pw / S / 2, f.cy - pw / S / 2, pw / S, pw / S);
      x.save(); x.globalCompositeOperation = 'lighter';
      const g = x.createRadialGradient(f.cx - Rd * .35, f.cy - Rd * .4, 2, f.cx - Rd * .35, f.cy - Rd * .4, Rd * .5);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.beginPath(); x.arc(f.cx, f.cy, Rd, 0, TAU); x.fill();
      x.restore();
      x.strokeStyle = 'rgba(120,150,180,.55)'; x.lineWidth = 2; x.beginPath(); x.arc(f.cx, f.cy, Rd, 0, TAU); x.stroke();
    }
    if (f.on && f.fall >= 0 && f.fall < 1) { const yy = lerp(-60, f.cy, ease(f.fall)); glow(x, f.cx, yy, 30, 'rgba(180,220,255,.9)', 1); dot(x, f.cx, yy, 12, 'rgba(200,235,255,.9)'); }
    // cross-section
    const y = begin(f.c2); bgGrid(y, f.c2.w, f.c2.h, 40);
    const base = 300, gl = 250, cx = 455, k = Rd / 110;
    y.fillStyle = '#efeadf'; y.fillRect(80, base, 750, 10); tag(y, 'paper with text', 160, base + 34, { size: 17, col: COL.mute, bg: false });
    y.fillStyle = '#2b2f38'; y.fillRect(cx - 40, base - 6, 80, 6);
    y.fillStyle = 'rgba(190,225,255,.25)'; y.fillRect(140, gl, 630, 20); y.strokeStyle = 'rgba(220,240,255,.7)'; y.strokeRect(140, gl, 630, 20);
    tag(y, 'glass strip', 720, gl + 10, { size: 16, col: COL.mute, bg: false });
    if (k > .02) {
      y.beginPath(); y.moveTo(cx - 130, gl); y.quadraticCurveTo(cx, gl - 150 * k, cx + 130, gl); y.closePath();
      y.fillStyle = 'rgba(140,200,255,.35)'; y.fill(); y.strokeStyle = 'rgba(210,240,255,.9)'; y.lineWidth = 2; y.stroke();
      tag(y, 'water drop — curved outward', cx + 160, gl - 90 * k, { size: 18, col: COL.ref, align: 'left' });
    }
    const M = 1 + .85 * k, top = 40, fl = t * 90 * App.speed;
    [-1, 1].forEach(sg => {
      const ex = cx + sg * 40, ax = cx + sg * 40 * M;
      if (k > .02) {
        const H = [ex, gl - 75 * k];
        const dv = [H[0] - ax, H[1] - (base - 6)], tt = (top - H[1]) / dv[1];
        beam(y, [[ex, base - 6], H, [H[0] + dv[0] * tt, top]], COL.ray, { flow: fl, w: 2 });
        beam(y, [H, [ax, base - 6]], COL.virt, { dash: [7, 7], a: .7 });
      } else beam(y, [[ex, base - 6], [ex, top]], COL.ray, { flow: fl, w: 2 });
    });
    if (k > .02) { y.fillStyle = 'rgba(185,166,255,.35)'; y.fillRect(cx - 40 * M, base - 12, 80 * M, 6); tag(y, 'letter looks this wide', cx, base - 40, { size: 17, col: COL.virt }); }
    tag(y, 'eye ↑', cx, 22, { size: 18, need: true, bg: false });
    tag(y, 'Side view', 20, 24, { size: 18, col: COL.mute, align: 'left', bg: false, need: true });
  }
});

/* ---------- MODULE 14: magnifying glass ---------- */
frame({
  mod: 14, kick: 'Magnifying glass', title: 'A magnifying glass is a convex lens', mapTitle: 'Magnifying glass (convex lens)',
  sub: 'Drag the magnifying glass over the tiny print. Change how high you hold it above the page.',
  build(b, f) {
    f.p = [520, 380]; f.d = 6;
    const Wd = 1180, Hd = 778, S = 2;
    f.c = canvas(b, Wd, Hd, 'position:absolute;left:0;top:0'); f.c.cv.classList.add('glass');
    const src = document.createElement('canvas'); src.width = Wd * S; src.height = Hd * S;
    const s = src.getContext('2d'); s.scale(S, S);
    s.fillStyle = '#f3efe6'; s.fillRect(0, 0, Wd, Hd);
    s.fillStyle = '#1f2430'; s.font = `700 26px ${FONT}`; s.fillText('Light: Mirrors and Lenses', 70, 70);
    s.font = `11px ${FONT}`; s.fillStyle = '#333a46';
    const txt = 'A lens is a piece of transparent material, usually made of glass or plastic, which has curved surfaces. A lens which is thicker at the middle as compared to the edges is called a convex lens. A magnifying glass is also a lens that helps in reading small print by making the letters appear bigger. Hold a magnifying glass over text and identify the distance where you can see the text bigger than it is written. Now move it away from the text. What do you notice? ';
    let line = '', yy = 110;
    const words = (txt + txt + txt + txt + txt).split(' ');
    for (const w of words) { const tt = line + w + ' '; if (s.measureText(tt).width > 700) { s.fillText(line, 70, yy); line = w + ' '; yy += 17; if (yy > 720) break; } else line = tt; }
    // a tiny ant drawing
    s.save(); s.translate(960, 300); s.strokeStyle = '#222'; s.fillStyle = '#222'; s.lineWidth = 1;
    s.beginPath(); s.ellipse(0, 0, 9, 6, 0, 0, TAU); s.ellipse(13, 0, 6, 5, 0, 0, TAU); s.ellipse(23, 0, 5, 4.5, 0, 0, TAU); s.fill();
    for (let k = -1; k <= 1; k++) { s.beginPath(); s.moveTo(12 + k * 3, 0); s.lineTo(8 + k * 8, -11); s.moveTo(12 + k * 3, 0); s.lineTo(8 + k * 8, 11); s.stroke(); }
    s.beginPath(); s.moveTo(26, -3); s.lineTo(32, -10); s.moveTo(26, 3); s.lineTo(32, 10); s.stroke(); s.restore();
    s.font = `10px ${FONT}`; s.fillText('an ant (actual size)', 930, 330);
    s.font = `9px ${FONT}`; s.fillText('Reprint 2026-27 · small print is hard to read without a lens', 840, 740);
    f.src = src;
    const near = q => Math.hypot(q.x - f.p[0], q.y - f.p[1]) < 150 || (q.x > f.p[0] + 90 && q.x < f.p[0] + 260 && Math.abs(q.y - (f.p[1] + 130)) < 80);
    let off = [0, 0];
    pointer(f.c, { hover: near, down: q => { if (!near(q)) return false; off = [f.p[0] - q.x, f.p[1] - q.y]; return true; }, move: q => { f.p = [clamp(q.x + off[0], 0, Wd), clamp(q.y + off[1], 0, Hd)]; } });
    const side = h('div', { class: 'abs', style: 'left:1204px;top:0;width:588px;display:flex;flex-direction:column;gap:14px' }); b.append(side);
    f.sl = ui.slider({ label: 'Height of lens above the page', min: 1, max: 19, step: .2, value: 6, fmt: v => v.toFixed(1) + ' cm', onInput: v => f.d = v });
    f.ro = ui.readout([['m', 'Text looks'], ['o', 'Orientation']]);
    side.append(ui.card('Hold it higher or lower', f.sl, h('div', { style: 'margin-top:10px' }, f.ro), h('p', { style: 'margin-top:10px;font-size:20px;color:var(--mute)' }, 'Focal length of this lens: 10 cm')));
    f.c2 = canvas(null, 544, 250); side.append(ui.card('Ray diagram', f.c2.cv));
    side.append(ui.card(null, h('p', { html: 'A magnifying glass is a <b class="hl">convex lens</b>. Held closer to the text than its focal length, it gives an <b>erect, enlarged</b> image. Hold it too high and the text blurs, then turns upside down.' })));
  },
  tick(f, dt, t) {
    const fL = 10, d = f.d, Rl = 130;
    let M = d < fL ? fL / (fL - d) : -fL / (d - fL);
    const blur = clamp(9 - Math.abs(d - fL) * 4.5, 0, 9);
    M = clamp(M, -8, 8);
    const x = begin(f.c);
    x.drawImage(f.src, 0, 0, f.c.w, f.c.h);
    const [px, py] = f.p;
    // shadow of the lens on the page
    x.save(); x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(px + d * 3, py + d * 4, Rl, Rl, 0, 0, TAU); x.fill(); x.restore();
    // handle
    x.save(); x.translate(px, py); x.rotate(.6);
    const hg = x.createLinearGradient(0, -14, 0, 14); hg.addColorStop(0, '#5a3a22'); hg.addColorStop(.5, '#9b6a42'); hg.addColorStop(1, '#4a2f1b');
    x.fillStyle = hg; rrect(x, Rl + 10, -14, 190, 28, 12); x.fill(); x.fillStyle = '#c0c6d2'; rrect(x, Rl - 2, -16, 26, 32, 5); x.fill(); x.restore();
    // magnified view
    x.save(); x.beginPath(); x.arc(px, py, Rl, 0, TAU); x.clip();
    x.fillStyle = '#f3efe6'; x.fillRect(px - Rl, py - Rl, 2 * Rl, 2 * Rl);
    if (blur > .3) x.filter = `blur(${blur}px)`;
    x.translate(px, py); x.scale(M, M); x.translate(-px, -py);
    x.drawImage(f.src, 0, 0, f.c.w, f.c.h);
    x.restore();
    x.save(); x.globalCompositeOperation = 'lighter';
    const g = x.createRadialGradient(px - 50, py - 60, 4, px - 50, py - 60, 90); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.arc(px, py, Rl, 0, TAU); x.fill(); x.restore();
    x.strokeStyle = '#2b2f38'; x.lineWidth = 12; x.beginPath(); x.arc(px, py, Rl + 6, 0, TAU); x.stroke();
    x.strokeStyle = '#8b93a3'; x.lineWidth = 3; x.beginPath(); x.arc(px, py, Rl + 1, 0, TAU); x.stroke();
    f.ro.set('m', blur > 6 ? 'blurred' : Math.abs(M) > 1.02 ? `×${Math.abs(M).toFixed(1)} bigger` : `×${Math.abs(M).toFixed(2)}`, M > 0 ? COL.real : '#ffb0a0');
    f.ro.set('o', M > 0 ? 'Erect' : 'Inverted', M > 0 ? COL.real : '#ffb0a0');
    const y = begin(f.c2); bgGrid(y, f.c2.w, f.c2.h, 30);
    const inf2 = bench(y, { type: 'convexLens', x0: 330, y0: 140, f: 80, u: d / fL * 80, h: 30, A: 200, w: f.c2.w, h2: f.c2.h, rays: 'principal', flow: t * 90 * App.speed, small: true, obj: 'arrow', axisLabel: false, twoF: false, objLabel: false, labels: false });
    dot(y, 250, 140, 4, '#fff'); dot(y, 410, 140, 4, '#fff'); tag(y, 'F', 250, 160, { size: 15, bg: false }); tag(y, "F'", 410, 160, { size: 15, bg: false });
    if (inf2.show) tag(y, inf2.real ? 'real image' : 'virtual image', inf2.xi, 140 - inf2.s.m * 30 - 14 * Math.sign(inf2.s.m || 1), { size: 15, col: inf2.real ? COL.real : COL.virt });
    tag(y, 'text', 330 - d / fL * 80, 176, { size: 15, col: COL.obj, bg: false });
  }
});

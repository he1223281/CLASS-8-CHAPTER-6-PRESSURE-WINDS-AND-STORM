/* ================= Modules 17–18: where lenses and mirrors are used ================= */

/* paraxial ray through a row of thin lenses [{x, f, cy}] */
function parax(p0, aim, elems, xEnd) {
  let px = p0[0], py = p0[1], s = (aim[1] - p0[1]) / (aim[0] - p0[0]);
  const pts = [[px, py]];
  for (const e of elems) { if (e.x <= px) continue; py += s * (e.x - px); px = e.x; pts.push([px, py]); s -= (py - e.cy) / e.f; }
  pts.push([xEnd, py + s * (xEnd - px)]);
  return { pts, s };
}
function eyeball(x, lensX, retX, cy, thick) {
  const cx = (lensX + retX) / 2 + 10, r = (retX - lensX) / 2 + 16;
  const g = x.createRadialGradient(cx - 40, cy - 40, 10, cx, cy, r);
  g.addColorStop(0, '#2a3346'); g.addColorStop(1, '#151b28');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
  x.strokeStyle = '#d8dde8'; x.lineWidth = 4; x.stroke();
  x.strokeStyle = '#ff7a7a'; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, r - 4, -.75, .75); x.stroke();
  x.strokeStyle = 'rgba(200,238,255,.6)'; x.lineWidth = 3; x.beginPath(); x.arc(lensX + 8, cy, 90, Math.PI * .78, Math.PI * 1.22); x.stroke();
  x.fillStyle = '#4b6fa8'; x.fillRect(lensX - 6, cy - 80, 8, 46); x.fillRect(lensX - 6, cy + 34, 8, 46);
  x.save(); x.beginPath(); x.ellipse(lensX + 4, cy, thick, 46, 0, 0, TAU); x.fillStyle = 'rgba(175,228,255,.45)'; x.fill(); x.strokeStyle = 'rgba(210,240,255,.95)'; x.lineWidth = 2; x.stroke(); x.restore();
  tag(x, 'retina', retX + 50, cy + 110, { size: 17, col: '#ff9a9a' });
  tag(x, 'eye lens', lensX, cy + 112, { size: 17, col: COL.ref });
}
function drawRaysTo(x, obj, aims, elems, xStop, col, fl) {
  const ends = [];
  for (const a of aims) {
    const r = parax(obj, a, elems, xStop);
    beam(x, r.pts, col, { flow: fl, w: 2, as: 10 });
    ends.push(r.pts[r.pts.length - 1][1]);
  }
  return ends;
}

const LENS_APPS = [
  {
    name: 'Eyeglasses', modes: ['Without glasses', 'With reading glasses'],
    text: 'Reading glasses are <b class="hl">convex lenses</b>. They bend light a little before it enters the eye, so a near page is focused sharply on the retina. The curved line on some glasses (bifocals) separates a part for reading from a part for seeing far.',
    icon(x, w, hh) { x.strokeStyle = '#ff7aa8'; x.lineWidth = 6; x.beginPath(); x.ellipse(w / 2 - 50, hh / 2, 40, 30, 0, 0, TAU); x.ellipse(w / 2 + 50, hh / 2, 40, 30, 0, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(w / 2 - 10, hh / 2 - 6); x.quadraticCurveTo(w / 2, hh / 2 - 16, w / 2 + 10, hh / 2 - 6); x.stroke(); x.fillStyle = 'rgba(175,228,255,.25)'; x.beginPath(); x.ellipse(w / 2 - 50, hh / 2, 38, 28, 0, 0, TAU); x.ellipse(w / 2 + 50, hh / 2, 38, 28, 0, 0, TAU); x.fill(); },
    scene(x, w, hh, t, st) {
      const cy = 280, lensX = 770, retX = 1050, on = st.mode === 1, fl = t * 100;
      const obj = [470, cy - 70];
      eyeball(x, lensX, retX, cy, 16);
      x.save(); x.translate(470, cy); drawObj(x, 'arrow', 70, {}); x.restore(); tag(x, 'page (near)', 470, cy + 30, { size: 18, col: COL.obj });
      const elems = on ? [{ x: 680, f: 489, cy }, { x: lensX, f: 180, cy }] : [{ x: lensX, f: 180, cy }];
      if (on) { drawLens(x, 680, cy, 220, 'convexLens', { bulge: 12 }); tag(x, 'convex lens of the glasses', 680, cy - 140, { size: 18, col: COL.ray }); }
      const aimX = on ? 680 : lensX, aims = [-36, -18, 0, 18, 36].map(d => [aimX, cy + d]);
      const ends = drawRaysTo(x, obj, aims, elems, retX, COL.ray, fl);
      const mn = Math.min(...ends), mx = Math.max(...ends);
      if (mx - mn < 6) { glow(x, retX, (mn + mx) / 2, 26, 'rgba(255,255,220,1)', .9); tag(x, 'sharp image on the retina', retX - 40, cy - 150, { size: 21, col: COL.real, need: true }); }
      else { x.fillStyle = 'rgba(255,207,107,.35)'; x.fillRect(retX - 5, mn, 10, mx - mn); tag(x, 'blurred — light would focus behind the retina', retX - 120, cy - 150, { size: 21, col: '#ffb0a0', need: true }); }
    }
  },
  {
    name: 'Smartphone camera', text: 'Tiny <b class="hl">convex lens</b> elements focus light from the scene onto a sensor. The image on the sensor is small and upside down; the phone turns it upright.',
    icon(x, w, hh) { x.fillStyle = '#3aa0ff'; rrect(x, w / 2 - 70, 14, 140, hh - 28, 18); x.fill(); x.fillStyle = '#1b2433'; [[-30, 0], [-30, 40], [16, 20]].forEach(([dx, dy]) => { x.beginPath(); x.arc(w / 2 + dx, 40 + dy, 15, 0, TAU); x.fill(); }); x.fillStyle = '#9ad4ff'; [[-30, 0], [-30, 40], [16, 20]].forEach(([dx, dy]) => { x.beginPath(); x.arc(w / 2 + dx, 40 + dy, 6, 0, TAU); x.fill(); }); },
    scene(x, w, hh, t) {
      const cy = 300, L = 850, f = 88, sensor = L + 1 / (1 / f - 1 / 700), fl = t * 100;
      x.fillStyle = '#2b6fb3'; rrect(x, 812, 120, 210, 360, 26); x.fill(); x.fillStyle = '#0f1520'; rrect(x, 822, 130, 190, 340, 20); x.fill();
      [-1, 0, 1].forEach(k => drawLens(x, L + k * 14, cy, 70 - Math.abs(k) * 10, k === 0 ? 'concaveLens' : 'convexLens', { bulge: 6, edge: 6 }));
      x.fillStyle = '#4ad19a'; x.fillRect(sensor, cy - 60, 6, 120); tag(x, 'sensor', sensor + 4, cy + 84, { size: 17, col: '#4ad19a' });
      x.save(); x.translate(150, cy); drawObj(x, 'tree', 160, {}); x.restore();
      const top = [150, cy - 160], bot = [150, cy - 2];
      [top, bot].forEach((p, i) => [-22, 0, 22].forEach(d => beam(x, parax(p, [L, cy + d], [{ x: L, f, cy }], sensor).pts, i ? COL.ref : COL.ray, { flow: fl, w: 1.8, as: 9 })));
      const m = -(sensor - L) / 700; x.save(); x.translate(sensor - 4, cy); x.scale(Math.abs(m), m); drawObj(x, 'tree', 160, {}); x.restore();
      tag(x, 'tiny inverted image', sensor - 60, cy + 120, { size: 18, col: COL.real });
      tag(x, 'lens elements', L, cy - 70, { size: 17, col: COL.ref });
    }
  },
  {
    name: 'Camera', text: 'A camera’s <b class="hl">convex lens</b> forms a real, inverted image on the sensor. To focus on near or far things, the lens moves closer to or farther from the sensor.',
    icon(x, w, hh) { x.fillStyle = '#4a5162'; rrect(x, w / 2 - 80, 30, 160, 90, 14); x.fill(); x.fillRect(w / 2 - 30, 20, 50, 16); x.fillStyle = '#121722'; x.beginPath(); x.arc(w / 2, 75, 34, 0, TAU); x.fill(); x.fillStyle = '#7cc4ff'; x.beginPath(); x.arc(w / 2, 75, 16, 0, TAU); x.fill(); },
    scene(x, w, hh, t) {
      const cy = 300, S = 1040, f = 150, u = 560 + 260 * Math.sin(t * .45), v = 1 / (1 / f - 1 / u), L = S - v, fl = t * 100;
      x.fillStyle = '#2b303b'; rrect(x, 660, 150, 420, 300, 22); x.fill(); x.fillStyle = '#0d1119'; rrect(x, 674, 164, 392, 272, 16); x.fill();
      x.fillStyle = '#3a404d'; rrect(x, L - 22, 170, 44, 260, 8); x.fill();
      drawLens(x, L, cy, 200, 'convexLens', { bulge: 16 });
      x.fillStyle = '#4ad19a'; x.fillRect(S, cy - 90, 6, 180); tag(x, 'sensor', S + 4, cy + 112, { size: 17, col: '#4ad19a' });
      const ox = L - u; x.save(); x.translate(ox, cy); drawObj(x, 'candle', 110, {}); x.restore();
      [-70, 0, 70].forEach(d => beam(x, parax([ox, cy - 110], [L, cy + d], [{ x: L, f, cy }], S).pts, COL.ray, { flow: fl, w: 2 }));
      const m = -v / u; x.save(); x.translate(S - 2, cy); x.scale(Math.abs(m), m); drawObj(x, 'candle', 110, {}); x.restore();
      tag(x, 'lens slides to focus', L, 140, { size: 19, col: COL.ref, need: true });
      tag(x, `object ${(u / PX_CM).toFixed(0)} cm away`, ox, cy + 40, { size: 17, col: COL.obj });
    }
  },
  {
    name: 'Telescope', text: 'A refracting telescope uses two <b class="hl">convex lenses</b>: a big objective lens collects light from a distant object and forms an image; the eyepiece magnifies it so the object looks much bigger.',
    icon(x, w, hh) { x.save(); x.translate(w / 2, hh / 2 + 10); x.rotate(-.35); x.fillStyle = '#c9cfda'; rrect(x, -90, -16, 180, 32, 8); x.fill(); x.fillStyle = '#7cc4ff'; x.fillRect(84, -16, 8, 32); x.restore(); x.strokeStyle = '#8b93a3'; x.lineWidth = 4; x.beginPath(); x.moveTo(w / 2, hh / 2 + 10); x.lineTo(w / 2 - 30, hh - 10); x.moveTo(w / 2, hh / 2 + 10); x.lineTo(w / 2 + 30, hh - 10); x.stroke(); },
    scene(x, w, hh, t) {
      const cy = 300, O = 220, fo = 520, E = O + fo + 120, fe = 120, fl = t * 100, ang = -3.2 * DEG;
      x.fillStyle = '#1a2130'; x.fillRect(O, cy - 120, E - O, 240); x.strokeStyle = '#3a4458'; x.lineWidth = 2; x.strokeRect(O, cy - 120, E - O, 240);
      drawLens(x, O, cy, 230, 'convexLens', { bulge: 18 }); drawLens(x, E, cy, 110, 'convexLens', { bulge: 12 });
      for (let k = -2; k <= 2; k++) {
        const y0 = cy + k * 40, p0 = [O - 200, y0 - Math.tan(ang) * 200];
        beam(x, parax(p0, [O, y0], [{ x: O, f: fo, cy }, { x: E, f: fe, cy }], E + 260).pts, COL.ray, { flow: fl, w: 2, as: 10 });
      }
      x.fillStyle = '#fff'; x.beginPath(); x.ellipse(E + 290, cy + 50, 26, 15, 0, 0, TAU); x.fill(); x.fillStyle = '#2b3c66'; x.beginPath(); x.arc(E + 282, cy + 50, 9, 0, TAU); x.fill();
      tag(x, 'objective lens', O, cy - 150, { size: 18, col: COL.ref }); tag(x, 'eyepiece', E, cy - 150, { size: 18, col: COL.ref });
      tag(x, 'light from a distant star', 120, 120, { size: 18, col: COL.ray });
      tag(x, 'rays leave at a bigger angle → looks bigger', E + 120, cy + 140, { size: 18, col: COL.real });
    }
  },
  {
    name: 'Microscope', text: 'A microscope uses two <b class="hl">convex lenses</b>. The objective makes an enlarged image of a tiny object; the eyepiece enlarges it again, like a magnifying glass.',
    icon(x, w, hh) { x.fillStyle = '#c9cfda'; x.save(); x.translate(w / 2 + 10, hh / 2); x.rotate(.35); rrect(x, -12, -55, 24, 80, 6); x.fill(); x.restore(); x.fillStyle = '#5a6272'; rrect(x, w / 2 - 50, hh - 26, 100, 14, 5); x.fill(); x.fillRect(w / 2 - 34, hh / 2 + 10, 12, 50); x.fillStyle = '#7cc4ff'; x.fillRect(w / 2 - 20, hh / 2 + 16, 40, 5); },
    scene(x, w, hh, t) {
      const cy = 280, Ob = 330, fo = 70, u = 90, ox = Ob - u, v1 = 1 / (1 / fo - 1 / u), I1 = Ob + v1, m1 = -v1 / u, oh = 18;
      const Ep = I1 + 105, fe = 150, ue = Ep - I1, v2 = 1 / (1 / fe - 1 / ue), I2 = Ep + v2, m2 = -v2 / ue, fl = t * 100;
      drawLens(x, Ob, cy, 120, 'convexLens', { bulge: 14 }); drawLens(x, Ep, cy, 200, 'convexLens', { bulge: 16 });
      x.save(); x.translate(ox, cy); drawObj(x, 'arrow', oh, {}); x.restore(); tag(x, 'tiny object', ox, cy + 26, { size: 17, col: COL.obj });
      const tip = [ox, cy - oh], i1 = [I1, cy - m1 * oh];
      [-30, 0, 30].forEach(d => {
        const r = parax(tip, [Ob, cy + d], [{ x: Ob, f: fo, cy }, { x: Ep, f: fe, cy }], Ep + 240);
        beam(x, r.pts, COL.ray, { flow: fl, w: 2, as: 9 });
        const H = r.pts[2]; beam(x, [H, [I2, cy - m1 * m2 * oh]], COL.ray, { dash: [7, 8], a: .45 });
      });
      drawImage(x, 'arrow', oh, I1, cy, m1, false); tag(x, 'first image (real, enlarged)', I1, cy + 40, { size: 17, col: COL.real });
      drawImage(x, 'arrow', oh, I2, cy, m1 * m2, true); tag(x, 'what you see — much bigger', I2, cy - m1 * m2 * oh + 30, { size: 18, col: COL.virt });
      tag(x, 'objective', Ob, cy - 90, { size: 17, col: COL.ref }); tag(x, 'eyepiece', Ep, cy - 130, { size: 17, col: COL.ref });
    }
  },
  {
    name: 'Human eye', modes: ['Looking far', 'Reading close'],
    text: 'Our eye has a <b class="hl">convex lens</b> inside. It can change its shape — thinner for far objects, thicker for near ones — so the image always lands sharply on the retina (upside down! the brain sorts it out).',
    icon(x, w, hh) { x.fillStyle = '#e9edf4'; x.beginPath(); x.ellipse(w / 2, hh / 2, 70, 40, 0, 0, TAU); x.fill(); x.fillStyle = '#3a7bd5'; x.beginPath(); x.arc(w / 2, hh / 2, 26, 0, TAU); x.fill(); x.fillStyle = '#0b0f18'; x.beginPath(); x.arc(w / 2, hh / 2, 11, 0, TAU); x.fill(); },
    scene(x, w, hh, t, st) {
      st.k = st.k == null ? 0 : st.k; st.k += ((st.mode === 1 ? 1 : 0) - st.k) * .06;
      const cy = 280, lensX = 770, retX = 1050, v = retX - lensX, u = lerp(5000, 300, st.k), f = 1 / (1 / u + 1 / v), fl = t * 100;
      eyeball(x, lensX, retX, cy, lerp(9, 22, st.k));
      const oh = lerp(900, 70, st.k), ox = lensX - u;
      if (st.k > .5) { x.save(); x.translate(ox, cy); drawObj(x, 'candle', 70, {}); x.restore(); }
      else tag(x, 'distant tree → rays nearly parallel', 260, 80, { size: 18, col: COL.ray });
      const tip = [ox, cy - oh];
      [-30, -10, 10, 30].forEach(d => beam(x, parax(tip, [lensX, cy + d], [{ x: lensX, f, cy }], retX).pts, COL.ray, { flow: fl, w: 2, as: 10 }));
      const m = -v / u, ih = oh * m;
      x.save(); x.strokeStyle = COL.real; x.lineWidth = 4; x.beginPath(); x.moveTo(retX - 6, cy); x.lineTo(retX - 6, cy - ih); x.stroke(); x.restore();
      glow(x, retX - 6, cy - ih, 22, 'rgba(220,255,230,1)', .8);
      tag(x, st.k > .5 ? 'lens thicker' : 'lens thinner', lensX, cy - 120, { size: 20, col: COL.ref, need: true });
      tag(x, 'inverted image on retina', retX - 40, cy + 150, { size: 18, col: COL.real });
    }
  }
];

const MIRROR_APPS = [
  {
    name: 'Torch reflector', modes: ['Bulb at the focus', 'Bulb too close'],
    text: 'Behind the bulb is a <b class="hl">concave mirror</b>. With the bulb at its focus, the reflected rays come out <b>parallel</b> — a strong straight beam.',
    icon(x, w, hh) { drawTorch(x, w / 2 + 70, hh / 2, 0, .9); glow(x, w / 2 + 80, hh / 2, 40, 'rgba(255,240,180,1)', .7); },
    scene(x, w, hh, t, st) { reflectorScene(x, w, hh, t, st, false); }
  },
  {
    name: 'Vehicle headlight', modes: ['Bulb at the focus', 'Bulb too close'],
    text: 'Headlights of cars and scooters use <b class="hl">concave reflectors</b> to send the light far down the road in a strong beam.',
    icon(x, w, hh) { x.fillStyle = '#c64a3a'; rrect(x, 30, 50, w - 60, 60, 20); x.fill(); x.fillStyle = '#1b2433'; x.fillRect(70, 34, w - 140, 24); [70, w - 70].forEach(X => { x.fillStyle = '#fff6c8'; x.beginPath(); x.arc(X, 80, 14, 0, TAU); x.fill(); glow(x, X, 80, 30, 'rgba(255,240,180,1)', .7); }); },
    scene(x, w, hh, t, st) { reflectorScene(x, w, hh, t, st, true); }
  },
  {
    name: 'Dentist’s mirror', text: 'A small <b class="hl">concave mirror</b> held close to a tooth (inside its focus) gives an <b>erect, enlarged</b> image — so the dentist sees the tooth in detail.',
    icon(x, w, hh) { x.strokeStyle = '#c9cfda'; x.lineWidth = 6; x.beginPath(); x.moveTo(40, hh - 20); x.lineTo(w / 2 + 20, hh / 2); x.stroke(); x.fillStyle = '#dfe8f5'; x.beginPath(); x.arc(w / 2 + 40, hh / 2 - 10, 24, 0, TAU); x.fill(); x.fillStyle = '#9fb3cc'; x.beginPath(); x.arc(w / 2 + 40, hh / 2 - 10, 17, 0, TAU); x.fill(); },
    scene(x, w, hh, t) {
      const info = bench(x, { type: 'concave', x0: 640, y0: 330, f: 200, u: 110 + 20 * Math.sin(t * .6), h: 80, A: 340, w, h2: hh, rays: 'principal', flow: t * 100, obj: 'tooth', axisLabel: false });
      x.strokeStyle = '#c9cfda'; x.lineWidth = 10; x.beginPath(); x.moveTo(670, 480); x.lineTo(880, 580); x.stroke();
      tag(x, `image ×${info.s.m.toFixed(1)} · erect · enlarged`, info.xi, 120, { size: 21, col: COL.virt, need: true });
    }
  },
  { name: 'Side-view mirror', text: SCENES.side.note.replace('The convex', 'The <b class="hc">convex</b>'), icon: sideIcon, scene(x, w, hh, t) { sceneScaled(x, w, hh, t, 'side'); } },
  { name: 'Road safety mirror', text: SCENES.road.note.replace('convex', '<b class="hc">convex</b>'), icon: roadIcon, scene(x, w, hh, t) { sceneScaled(x, w, hh, t, 'road'); } },
  { name: 'Store surveillance mirror', text: SCENES.store.note.replace('convex', '<b class="hc">convex</b>'), icon: storeIcon, scene(x, w, hh, t) { sceneScaled(x, w, hh, t, 'store'); } },
  {
    name: 'Telescope', text: 'Most modern telescopes are <b>reflecting telescopes</b>. A large <b class="hl">concave mirror</b> collects faint starlight and converges it; a small flat mirror sends it to the eyepiece.',
    icon(x, w, hh) { x.fillStyle = '#e8ecf3'; rrect(x, w / 2 - 80, hh / 2 - 26, 160, 52, 10); x.fill(); x.fillStyle = '#1b2433'; x.fillRect(w / 2 - 82, hh / 2 - 20, 6, 40); x.fillStyle = '#8b93a3'; x.fillRect(w / 2 - 40, hh / 2 - 40, 14, 16); },
    scene(x, w, hh, t) {
      const cy = 330, V = [1080, cy], R = 1300, A = 280, fl = t * 100;
      x.fillStyle = '#1a2130'; x.fillRect(250, cy - 160, 860, 320); x.strokeStyle = '#3a4458'; x.lineWidth = 2; x.strokeRect(250, cy - 160, 860, 320);
      const sx = V[0] - 560, sec = mirrorSurf('plane', [sx, cy], norm([1, -1]), 1, 60), pri = mirrorSurf('concave', V, [-1, 0], R, A);
      const eyep = { kind: 'absorb', geom: 'seg', a: [sx - 40, cy - 190], b: [sx + 40, cy - 190] };
      x.fillStyle = '#1a2130'; x.fillRect(sx - 30, cy - 200, 60, 50);
      for (let k = 0; k < 12; k++) { const y = cy - 132 + 264 * k / 11; if (Math.abs(y - cy) < 30) continue; beam(x, trace([0, y], [1, 0], [pri, sec, eyep], { len: 400, max: 4 }).pts, COL.ray, { flow: fl, w: 1.8, arrows: false }); }
      drawMirror(x, mirrorGeom('concave', V, [-1, 0], R, A)); drawMirror(x, mirrorGeom('plane', [sx, cy], norm([1, -1]), 1, 60));
      drawLens(x, sx, cy - 190, 70, 'convexLens', { bulge: 8 });
      tag(x, 'large concave mirror', V[0] - 20, cy + 190, { size: 18, col: COL.ray }); tag(x, 'small flat mirror', sx, cy + 70, { size: 17 }); tag(x, 'eyepiece', sx + 90, cy - 190, { size: 17, col: COL.ref });
      tag(x, 'starlight', 110, cy - 180, { size: 18, col: COL.ray });
    }
  }
];
function reflectorScene(x, w, hh, t, st, car) {
  const cy = 300, V = [360, cy], R = 380, f = R / 2, bx = V[0] + (st.mode === 1 ? f * .55 : f), fl = t * 100;
  if (car) {
    x.fillStyle = '#20252f'; x.fillRect(0, cy + 190, w, 80); x.strokeStyle = 'rgba(255,220,120,.4)'; x.setLineDash([40, 30]); x.lineWidth = 4; x.beginPath(); x.moveTo(0, cy + 230); x.lineTo(w, cy + 230); x.stroke(); x.setLineDash([]);
    x.fillStyle = '#8a2f25'; rrect(x, 40, cy - 170, 330, 360, 40); x.fill();
  } else { x.fillStyle = '#2a303c'; x.beginPath(); x.moveTo(V[0] - 40, cy - 170); x.lineTo(V[0] + 210, cy - 210); x.lineTo(V[0] + 210, cy + 210); x.lineTo(V[0] - 40, cy + 170); x.closePath(); x.fill(); x.fillStyle = '#20252f'; x.fillRect(V[0] - 300, cy - 60, 260, 120); }
  const ms = mirrorSurf('concave', V, [1, 0], R, 320);
  for (let k = 0; k < 20; k++) {
    const a = Math.PI - 1.15 + 2.3 * k / 19, r = trace([bx, cy], [Math.cos(a), Math.sin(a)], [ms], { len: 1400, max: 3 });
    if (r.pts.length > 2) beam(x, r.pts, '#fff1c4', { flow: fl, w: 1.8, a: .9, arrows: false });
  }
  drawMirror(x, mirrorGeom('concave', V, [1, 0], R, 320));
  x.fillStyle = 'rgba(200,235,255,.15)'; x.fillRect(V[0] + 200, cy - 210, 10, 420);
  glow(x, bx, cy, 40, 'rgba(255,245,200,1)', 1); dot(x, bx, cy, 9, '#fffbe8');
  dot(x, V[0] + f, cy + 26, 5, '#fff'); tag(x, 'F', V[0] + f, cy + 50, { size: 18 });
  tag(x, st.mode === 1 ? 'bulb not at F → beam spreads out' : 'bulb at F → reflected rays parallel', 860, 80, { size: 22, col: st.mode === 1 ? '#ffb0a0' : COL.real, need: true });
}
function sceneScaled(x, w, hh, t, k) {
  const s = hh / 778; x.save(); x.translate((w - 1328 * s) / 2, 0); x.scale(s, s);
  const r = SCENES[k].draw(x, t, 'convex');
  const rays = fovFan(r.eye, 'convex', r.V, r.ax, r.R, r.A, 2600, 30);
  drawFan(x, rays, COL.ref, .15); drawMirror(x, mirrorGeom('convex', r.V, r.ax, r.R, r.A));
  dot(x, r.eye[0], r.eye[1], 9, '#fff');
  r.targets.forEach(p => { if (inFan(rays, p) >= 0) { x.strokeStyle = '#7ef0a8'; x.lineWidth = 4; x.beginPath(); x.arc(p[0], p[1], 62, 0, TAU); x.stroke(); } });
  x.restore();
}
function sideIcon(x, w, hh) { x.fillStyle = '#2b2f38'; x.beginPath(); x.ellipse(w / 2, hh / 2, 72, 46, -.15, 0, TAU); x.fill(); const g = x.createLinearGradient(w / 2 - 60, 0, w / 2 + 60, 0); g.addColorStop(0, '#7fb6ff'); g.addColorStop(1, '#c9e2ff'); x.fillStyle = g; x.beginPath(); x.ellipse(w / 2, hh / 2, 62, 37, -.15, 0, TAU); x.fill(); x.fillStyle = '#e04a3a'; x.fillRect(w / 2 - 12, hh / 2 - 6, 24, 14); }
function roadIcon(x, w, hh) { x.strokeStyle = '#ff9a2f'; x.lineWidth = 8; x.beginPath(); x.arc(w / 2, hh / 2 - 10, 38, 0, TAU); x.stroke(); x.fillStyle = '#c9e2ff'; x.beginPath(); x.arc(w / 2, hh / 2 - 10, 33, 0, TAU); x.fill(); x.fillStyle = '#8b93a3'; x.fillRect(w / 2 - 4, hh / 2 + 28, 8, 40); }
function storeIcon(x, w, hh) { const g = x.createRadialGradient(w / 2 - 15, hh / 2 - 15, 4, w / 2, hh / 2, 55); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#5e6b80'); x.fillStyle = g; x.beginPath(); x.arc(w / 2, hh / 2, 52, 0, TAU); x.fill(); x.strokeStyle = '#2b2f38'; x.lineWidth = 6; x.stroke(); }

function appFrame(def) {
  frame({
    mod: def.mod, kick: def.kick, title: def.title, sub: def.sub, mapTitle: def.mapTitle,
    build(b, f) {
      f.sel = 0; f.st = { mode: 0 }; f.z = 0;
      const cols = def.items.length > 6 ? 2 : 2, tw = 280;
      const grid = h('div', { class: 'tiles abs', style: `left:0;top:0;width:${tw * cols + 14}px;grid-template-columns:repeat(${cols},${tw}px)` }); b.append(grid);
      f.tiles = def.items.map((it, i) => {
        const ic = canvas(null, 250, def.items.length > 6 ? 106 : 150); const x = begin(ic); it.icon(x, ic.w, ic.h);
        const tl = h('button', { class: 'tile', onclick: () => select(i) }, ic.cv, it.name); grid.append(tl); return tl;
      });
      const wrap = h('div', { class: 'abs', style: `left:${tw * cols + 40}px;top:0;right:0;bottom:0` }); b.append(wrap);
      const W2 = 1792 - (tw * cols + 40);
      f.dw = h('div', { class: 'glass', style: 'overflow:hidden' }); wrap.append(f.dw);
      f.c = canvas(f.dw, W2, 560);
      f.name = h('div', { class: 'big', style: 'font-size:34px' });
      f.text = h('p', { style: 'font-size:24px;margin-top:8px' });
      f.modes = h('div', { style: 'margin-top:12px' });
      wrap.append(h('div', { class: 'card', style: 'margin-top:16px;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:start' }, h('div', null, f.name, f.text), f.modes));
      function select(i) {
        f.sel = i; f.st = { mode: 0 }; f.z = 0;
        f.tiles.forEach((tl, k) => tl.classList.toggle('on', k === i));
        const it = def.items[i]; f.name.textContent = it.name; f.text.innerHTML = it.text;
        f.modes.innerHTML = ''; if (it.modes) f.modes.append(ui.seg({ options: it.modes.map((m, k) => ({ v: k, t: m })), value: 0, onChange: v => f.st.mode = v }));
        f.dw.classList.remove('zoomin'); void f.dw.offsetWidth; f.dw.classList.add('zoomin');
      }
      select(0);
    },
    tick(f, dt, t) {
      f.z = Math.min(1, f.z + dt * 1.1);
      const x = begin(f.c, '#0a0e17'); bgGrid(x, f.c.w, f.c.h, 50);
      const e = ease(f.z), s = lerp(1.35, 1, e);
      x.save(); x.translate(f.c.w / 2, f.c.h / 2); x.scale(s, s); x.translate(-f.c.w / 2, -f.c.h / 2);
      def.items[f.sel].scene(x, f.c.w, f.c.h, t * App.speed, f.st);
      x.restore();
    }
  });
}
appFrame({ mod: 17, kick: 'Where do we use lenses?', title: 'Lenses all around us', mapTitle: 'Lenses in real life', sub: 'Tap an object to look inside at its lens.', items: LENS_APPS });
appFrame({ mod: 18, kick: 'Where do we use mirrors?', title: 'Mirrors in real life', mapTitle: 'Mirrors in real life', sub: 'Tap an object to zoom into its optics and see why that mirror is used.', items: MIRROR_APPS });

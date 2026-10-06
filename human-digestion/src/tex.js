/* ============ Realistic tissue rendering ============
   Organs are baked once (at start-up) into lit, textured bitmaps:
   periodic value-noise mottling, a height map from the blurred shape (+ noise bumps),
   per-pixel normals -> diffuse light, wet specular gloss, edge occlusion and surface vessels.
   The bitmaps are then placed in the SVG scenes as <image data-tx="name">. */
const TEXN = (() => {
  const P = 256, R = rng(777), g = new Float32Array(P * P);
  for (let i = 0; i < P * P; i++) g[i] = R();
  const sm = t => t * t * (3 - 2 * t);
  const vn = (x, y, per) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    const a = (i, j) => g[(((j % per) + per) % per) * P + (((i % per) + per) % per)];
    const u = sm(fx), v = sm(fy);
    return lerp(lerp(a(xi, yi), a(xi + 1, yi), u), lerp(a(xi, yi + 1), a(xi + 1, yi + 1), u), v);
  };
  const tile = (N, p, oct) => {
    const out = new Float32Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let s = 0, amp = .5, f = 1, nrm = 0;
      for (let o = 0; o < oct; o++) { s += amp * vn(x / N * p * f, y / N * p * f, p * f); nrm += amp; amp *= .5; f *= 2; }
      out[y * N + x] = s / nrm;
    }
    return out;
  };
  return { t1: tile(512, 6, 5), t2: tile(512, 40, 2) };
})();
const TEXI = {};

function bboxOf(d, sw = 0) {
  const s = el('svg', { width: 0, height: 0, style: 'position:absolute' }, document.body);
  const p = el('path', { d }, s); const b = p.getBBox(); s.remove();
  return [b.x - sw / 2, b.y - sw / 2, b.width + sw, b.height + sw];
}
/* o: {d, sw (stroke width → tube), s (px per unit), c1 light rgb, c2 dark rgb, bump, ns, gloss, spec, kf, veins(ctx), creases(ctx), glass:{a0,a1}} */
function bake(o) {
  const s = o.s || 4, pad = o.pad === undefined ? 4 : o.pad;
  const [bx, by, bw, bh] = o.bbox || bboxOf(o.d, o.sw || 0);
  const W = Math.ceil((bw + 2 * pad) * s), H = Math.ceil((bh + 2 * pad) * s);
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const tr = [s, 0, 0, s, (pad - bx) * s, (pad - by) * s];
  const P2 = new Path2D(o.d);
  const paint = (ctx, style) => { ctx.setTransform(...tr); if (o.sw) { ctx.lineWidth = o.sw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = style; ctx.stroke(P2); } else { ctx.fillStyle = style; ctx.fill(P2); } ctx.setTransform(1, 0, 0, 1, 0, 0); };
  const m = mk(), mc = m.getContext('2d', { willReadFrequently: true }); paint(mc, '#fff');
  const h = mk(), hc = h.getContext('2d', { willReadFrequently: true });
  const br = o.blur || (o.sw ? o.sw * s * .34 : Math.min(bw, bh) * s * .17);
  hc.filter = `blur(${f1(br)}px)`; hc.drawImage(m, 0, 0); hc.filter = 'none';
  hc.globalCompositeOperation = 'destination-in'; hc.drawImage(m, 0, 0); hc.globalCompositeOperation = 'source-over';
  if (o.creases) { hc.save(); hc.setTransform(...tr); hc.globalCompositeOperation = 'destination-out'; o.creases(hc); hc.restore(); }
  const v = mk(), vc = v.getContext('2d', { willReadFrequently: true });
  if (o.veins) { vc.setTransform(...tr); o.veins(vc); }
  const MD = mc.getImageData(0, 0, W, H).data, HD = hc.getImageData(0, 0, W, H).data, VD = vc.getImageData(0, 0, W, H).data;
  const N = W * H, hs = new Float32Array(N), mo = new Float32Array(N);
  const T1 = TEXN.t1, T2 = TEXN.t2, ns = o.ns || 1, bump = o.bump === undefined ? 1 : o.bump;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, ux = x / s + bx - pad, uy = y / s + by - pad;
    const a = T1[((uy * 2.2 * ns) & 511) * 512 + ((ux * 2.2 * ns) & 511)], b = T2[((uy * 5 * ns) & 511) * 512 + ((ux * 5 * ns) & 511)];
    mo[i] = a * .75 + b * .25;
    hs[i] = HD[i * 4 + 3] / 255 + bump * ((b - .5) * .012 + (a - .5) * .07);
  }
  const L = [-.46, -.62, .64], Ln = Math.hypot(...L); L[0] /= Ln; L[1] /= Ln; L[2] /= Ln;
  const Hv = [L[0], L[1], L[2] + 1], Hn = Math.hypot(...Hv); Hv[0] /= Hn; Hv[1] /= Hn; Hv[2] /= Hn;
  const k = 2 * br * (o.kf || .9), c1 = o.c1, c2 = o.c2, vcl = o.vc || [90, 20, 40], gl = o.gloss || 34, sp = o.spec === undefined ? .55 : o.spec;
  const out = mc.createImageData(W, H), OD = out.data;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x, A = MD[i * 4 + 3]; if (!A) continue;
    const dx = (hs[i + 1] - hs[i - 1]) * .5, dy = (hs[i + W] - hs[i - W]) * .5;
    let nx = -dx * k, ny = -dy * k, nz = 1; const nn = Math.hypot(nx, ny, nz); nx /= nn; ny /= nn; nz /= nn;
    const dif = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
    const spc = Math.pow(Math.max(0, nx * Hv[0] + ny * Hv[1] + nz * Hv[2]), gl) * sp;
    const hv = Math.min(1, hs[i] * 1.5), ao = .42 + .58 * hv;
    const t = clamp(mo[i] * 1.5 - .3 + hv * .3);
    let r = lerp(c2[0], c1[0], t), gg = lerp(c2[1], c1[1], t), bb = lerp(c2[2], c1[2], t);
    const va = VD[i * 4 + 3] / 255 * .7; r = lerp(r, vcl[0], va); gg = lerp(gg, vcl[1], va); bb = lerp(bb, vcl[2], va);
    const sh = (.26 + .9 * dif) * ao;
    const rim = Math.pow(1 - nz, 3) * (o.rim || 0);
    OD[i * 4] = Math.min(255, r * sh + 255 * spc + rim * 180);
    OD[i * 4 + 1] = Math.min(255, gg * sh + 255 * spc + rim * 200);
    OD[i * 4 + 2] = Math.min(255, bb * sh + 255 * spc + rim * 255);
    const fd = o.fade ? 1 - clamp((y / s + by - pad - o.fade[0]) / (o.fade[1] - o.fade[0])) : 1;
    OD[i * 4 + 3] = (o.glass ? A * clamp(o.glass[0] + o.glass[1] * Math.pow(1 - hv, 2) + spc * .5) : A) * fd;
  }
  mc.putImageData(out, 0, 0);
  return { url: m.toDataURL('image/png'), x: bx - pad, y: by - pad, w: bw + 2 * pad, h: bh + 2 * pad };
}
function veins(n, seed, wid, col = 'rgba(80,10,30,1)') {
  return ctx => {
    const R = rng(seed); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const br = (x, y, a, w, len, d) => {
      ctx.lineWidth = w; ctx.globalAlpha = .35 + .35 * (1 - d / 4); ctx.beginPath(); ctx.moveTo(x, y);
      for (let j = 0; j < len; j++) {
        a += (R() - .5) * .7; x += Math.cos(a) * 1.6; y += Math.sin(a) * 1.6; ctx.lineTo(x, y);
        if (d < 3 && R() < .07) { ctx.stroke(); br(x, y, a + (R() < .5 ? -1 : 1) * (.5 + R() * .7), w * .62, (len * .6) | 0, d + 1); ctx.lineWidth = w; ctx.globalAlpha = .35 + .35 * (1 - d / 4); ctx.beginPath(); ctx.moveTo(x, y); }
      }
      ctx.stroke();
    };
    const b = ctx.__bb || [0, 0, 1, 1];
    for (let k = 0; k < n; k++) br(b[0] + R() * b[2], b[1] + R() * b[3], R() * 6.28, wid, (25 + R() * 35) | 0, 0);
  };
}
function bakeWithVeins(o, n, seed, wid, col) { const bb = o.bbox || bboxOf(o.d, o.sw || 0); o.bbox = bb; const f = veins(n, seed, wid, col); o.veins = ctx => { ctx.__bb = bb; f(ctx); }; return bake(o); }
/* grooves across a tube every `step` units (haustra / rings) */
function ringCreases(d, step, len, w = 1.6) {
  return ctx => {
    const pts = samplePath(d, 400), L = pts.length; let acc = 0;
    ctx.lineWidth = w; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineCap = 'round';
    for (let i = 1; i < L - 1; i++) {
      acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (acc < step) continue; acc = 0;
      const tx = pts[i + 1][0] - pts[i - 1][0], ty = pts[i + 1][1] - pts[i - 1][1], tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
      ctx.beginPath(); ctx.moveTo(pts[i][0] - nx * len, pts[i][1] - ny * len); ctx.quadraticCurveTo(pts[i][0] + tx / tl * 3, pts[i][1] + ty / tl * 3, pts[i][0] + nx * len, pts[i][1] + ny * len); ctx.stroke();
    }
  };
}
function txImg(name, cls = '') { return `<image class="tx ${cls}" data-tx="${name}" preserveAspectRatio="none"/>`; }
function fixTex(root) {
  $$('image[data-tx]', root).forEach(im => {
    const T = TEXI[im.dataset.tx]; if (!T) return;
    setA(im, { href: T.url, x: f1(T.x), y: f1(T.y), width: f1(T.w), height: f1(T.h) });
  });
}

/* ---------- bake everything used by the scenes ---------- */
function bakeAll() {
  const B = BODY;
  const add = (k, o, vn) => { TEXI[k] = vn ? bakeWithVeins(o, ...vn) : bake(o); };
  add('liver', { d: B.LIVER, s: 5, c1: [196, 92, 72], c2: [104, 34, 28], gloss: 30, spec: .5, bump: 1.2 }, [26, 3, .9, 'rgba(70,10,20,1)']);
  add('gall', { d: B.GALL, s: 6, c1: [150, 208, 104], c2: [56, 112, 40], gloss: 40, spec: .7 });
  add('stom', { d: B.STOM_ORG, s: 5, c1: [238, 136, 138], c2: [150, 46, 62], gloss: 30, spec: .6, bump: 1 }, [30, 7, .9, 'rgba(120,20,50,1)']);
  add('panc', { d: B.PANC, s: 6, c1: [250, 214, 158], c2: [200, 136, 80], gloss: 24, spec: .35, bump: 2, ns: 3 });
  add('oes', { d: B.OES, sw: 11, s: 5, c1: [236, 132, 138], c2: [150, 56, 70], gloss: 34, spec: .55 }, [6, 9, .6, 'rgba(110,20,40,1)']);
  add('duo', { d: B.DUO, sw: 15, s: 5, c1: [246, 172, 156], c2: [172, 82, 82], gloss: 30, spec: .55 });
  B.SI_CHUNKS.forEach((d, i) => add('si' + i, { d, sw: 17, s: 4.5, c1: [246, 176, 160], c2: [168, 80, 82], gloss: 30, spec: .6, kf: 1 }, [3, 40 + i, .55, 'rgba(150,30,50,1)']));
  add('li', { d: B.LI_ORG, sw: 28, s: 4, c1: [222, 160, 120], c2: [128, 70, 50], gloss: 26, spec: .45, creases: ringCreases(B.LI_ORG, 12, 15, 1.8), blur: 28 * 4 * .3 }, [10, 21, .8, 'rgba(120,30,40,1)']);
  add('app', { d: B.APP, sw: 6, s: 5, c1: [222, 160, 120], c2: [128, 70, 50] });
  add('rec', { d: B.REC, sw: 24, s: 5, c1: [214, 140, 116], c2: [124, 62, 52], gloss: 28, spec: .5, creases: ringCreases(B.REC, 16, 11, 1.4) });
  add('torso', { fade: [860, 975], d: B.TORSO, s: 2, c1: [190, 220, 255], c2: [120, 160, 220], gloss: 18, spec: .25, glass: [.035, .42], rim: .7, bump: 0, blur: 60 });
  add('arms', { fade: [430, 560], d: B.ARMS, s: 2, c1: [190, 220, 255], c2: [120, 160, 220], gloss: 18, spec: .25, glass: [.035, .42], rim: .7, bump: 0, blur: 30 });
  add('head', { d: B.HEAD, s: 2.5, c1: [190, 220, 255], c2: [120, 160, 220], gloss: 18, spec: .3, glass: [.035, .42], rim: .7, bump: 0, blur: 40 });
  add('fig', { d: FIG_D, s: 1.4, c1: [190, 220, 255], c2: [120, 160, 220], gloss: 18, spec: .3, glass: [.04, .45], rim: .7, bump: 0, blur: 44 });
  // head (sagittal)
  add('tongue', { d: HEAD.TONGUE, s: 3, c1: [240, 140, 150], c2: [160, 56, 78], gloss: 22, spec: .55, bump: 2.5, ns: 3 });
  add('soft', { d: HEAD.SOFT, s: 3, c1: [236, 140, 150], c2: [170, 70, 86], spec: .5 });
  // stomach lining for the big stomach scene (screen units)
  add('rugae', { d: 'M150,150 L1020,150 L1020,1030 L150,1030 Z', s: 1, pad: 0, c1: [176, 66, 82], c2: [92, 22, 38], gloss: 40, spec: .7, bump: 1.6, blur: 2, kf: 14,
    creases: ctx => { const R = rng(5); ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineCap = 'round'; for (let i = 0; i < 22; i++) { const y = 170 + i * 40; ctx.lineWidth = 10 + R() * 8; ctx.beginPath(); for (let x = 150; x <= 1020; x += 20) { const yy = y + 26 * Math.sin(x * .012 + i * 1.3) + 10 * Math.sin(x * .05 + i); x === 150 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); } } });
  // villus (local coords, centred at x=0)
  add('villus', { d: villusPath(0) + ' Z', s: 1.5, c1: [246, 168, 160], c2: [176, 78, 92], gloss: 30, spec: .55, bump: 2.2, ns: 2.5, glass: [.82, .18] });
  // large intestine wall (screen units)
  add('liwall', { d: LI_WALL_D, s: 1, pad: 2, c1: [222, 158, 118], c2: [128, 70, 48], gloss: 26, spec: .5, bump: 1.4, blur: 24,
    creases: ctx => { ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.lineWidth = 9; for (let x = 160; x < 1780; x += 210) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x + 6, 920); ctx.stroke(); } } }, [24, 77, 2.2, 'rgba(120,30,40,1)']);
}

/* ---------- cinematic layers: drifting bokeh + film grain ---------- */
function cinematicLayers() {
  const st = $('#stage');
  const cv = document.createElement('canvas'); cv.id = 'bokeh'; cv.width = 960; cv.height = 540;
  cv.style.cssText = 'position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;z-index:0;opacity:.9';
  st.insertBefore(cv, $('#slides'));
  const ctx = cv.getContext('2d'), R = rng(3);
  const bk = Array.from({ length: 26 }, () => ({ x: R() * 960, y: R() * 540, r: 8 + R() * 40, vx: (R() - .5) * 4, vy: -2 - R() * 5, h: R() < .5 ? '111,227,214' : '255,184,107', a: .02 + R() * .05 }));
  let last = 0;
  const draw = ts => {
    const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    ctx.clearRect(0, 0, 960, 540);
    bk.forEach(b => {
      b.x += b.vx * dt; b.y += b.vy * dt; if (b.y < -60) { b.y = 600; b.x = R() * 960; }
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); g.addColorStop(0, `rgba(${b.h},${b.a})`); g.addColorStop(.7, `rgba(${b.h},${b.a * .6})`); g.addColorStop(1, `rgba(${b.h},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283); ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
  // grain
  const gc = document.createElement('canvas'); gc.width = gc.height = 200; const gx = gc.getContext('2d'), id = gx.createImageData(200, 200);
  for (let i = 0; i < 40000; i++) { const v = (R() * 255) | 0; id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
  gx.putImageData(id, 0, 0);
  const gr = document.createElement('div'); gr.id = 'grain';
  gr.style.cssText = `position:absolute;inset:-100px;pointer-events:none;z-index:6;opacity:.045;mix-blend-mode:overlay;background:url(${gc.toDataURL()});animation:grain .5s steps(4) infinite`;
  st.appendChild(gr);
}

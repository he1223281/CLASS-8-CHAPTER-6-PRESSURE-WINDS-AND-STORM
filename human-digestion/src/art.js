/* ================= path helpers ================= */
function catmull(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d;
}
function smoothPath(pts) { return `M${f1(pts[0][0])},${f1(pts[0][1])}` + catmull(pts); }
function closedPath(pts) {
  const n = pts.length; let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d + 'Z';
}
function polyD(pts) { return 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L') + 'Z'; }
function samplePath(d, n) {
  const p = el('path', { d }); const s = el('svg', { width: 0, height: 0, style: 'position:absolute' }, document.body); s.appendChild(p);
  const L = p.getTotalLength(), out = [];
  for (let i = 0; i < n; i++) { const q = p.getPointAtLength(L * i / n); out.push([q.x, q.y]); }
  s.remove(); return out;
}
function inPoly(x, y, P) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i], b = P[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
/* tube = dark rim + body + specular line */
function tube(d, w, c, cls = '') {
  return `<path class="${cls}" d="${d}" fill="none" stroke="${c[0]}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${c[1]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${c[2]}" stroke-width="${f1(w * .26)}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".5" transform="translate(${f1(-w * .17)},${f1(-w * .17)})"/>`;
}
function cam(svg, cx, cy, h, ar = 16 / 9) { const w = h * ar; svg.setAttribute('viewBox', `${f1(cx - w / 2)} ${f1(cy - h / 2)} ${f1(w)} ${f1(h)}`); }
/* map svg coords -> stage px for an svg that fills the stage (1920x1080, xMidYMid meet, 16:9 viewBox) */
function projVB(svg, x, y) { const v = svg.viewBox.baseVal; return [(x - v.x) * 1920 / v.width, (y - v.y) * 1080 / v.height]; }

class Track {
  constructor(svg, ds) { this.ps = ds.map(d => el('path', { d, fill: 'none', stroke: 'none' }, svg)); this.L = this.ps.map(p => p.getTotalLength()); }
  pt(s) { s = clamp(s, 0, this.ps.length - 1e-4); const i = Math.floor(s), v = s - i; const p = this.ps[i].getPointAtLength(v * this.L[i]); return [p.x, p.y]; }
}

/* ================= BODY (front view, viewBox units 600 x 1000) =================
   Body's right side appears on the viewer's LEFT (liver, ascending colon);
   stomach and descending colon on the viewer's RIGHT. */
const BODY = (() => {
  const B = {};
  B.TORSO = 'M268,170 C268,198 262,214 238,224 C192,238 150,250 136,292 C124,334 126,420 138,500 C148,568 150,620 148,690 C146,770 150,880 160,975 L440,975 C450,880 454,770 452,690 C450,620 452,568 462,500 C474,420 476,334 464,292 C450,250 408,238 362,224 C338,214 332,198 332,170 Z';
  B.MOUTH = 'M300,140 L300,158';
  B.OES = 'M300,158 C300,230 302,320 312,385 C316,405 326,415 335,422';
  B.STOM_ORG = 'M335,420 C338,396 362,380 392,386 C428,394 444,430 438,470 C432,520 398,556 350,563 C318,567 292,560 276,546 L268,530 C288,532 312,528 330,516 C346,504 350,482 348,460 C346,442 340,430 335,420 Z';
  B.STOM_TRK = 'M335,422 C362,416 402,428 408,466 C414,510 386,540 342,546 C312,549 290,542 272,538';
  B.DUO = 'M272,538 C248,545 240,575 252,598 C262,615 300,618 320,606';
  B.LIVER = 'M160,395 C175,360 260,352 330,368 C352,373 365,380 368,388 C350,402 330,410 315,425 C292,448 262,472 228,478 C198,483 170,470 163,447 C158,430 157,412 160,395 Z';
  B.GALL = 'M248,458 C240,474 248,494 263,492 C276,489 276,470 266,456 Z';
  B.PANC = 'M262,580 C262,565 285,560 310,566 C350,572 385,560 415,548 C428,544 434,556 422,564 C392,580 350,592 310,592 C285,594 262,592 262,580 Z';
  B.BILE = 'M262,488 C266,515 262,548 250,572';
  B.PDUCT = 'M412,556 C362,574 300,582 252,575';
  B.LI_ORG = 'M212,838 C199,826 197,790 198,720 C199,670 200,640 214,628 C240,612 270,650 305,648 C340,646 380,612 405,620 C422,626 420,660 419,700 C418,760 420,800 410,830 C398,862 350,846 326,862';
  B.LI_TRK = 'M222,800 C205,798 197,770 198,720 C199,670 200,640 214,628 C240,612 270,650 305,648 C340,646 380,612 405,620 C422,626 420,660 419,700 C418,760 420,800 410,830 C398,862 350,846 326,862';
  B.REC = 'M326,862 C310,872 302,900 301,930';
  B.ANUS = 'M301,930 L300,952';
  // small intestine coils (generated, continuous)
  const P = [[320, 606], [352, 626], [380, 650], [390, 672]];
  const rows = [686, 714, 742, 770, 798], xL = 248, xR = 384, r = 14;
  rows.forEach((y, i) => {
    const dir = i % 2 === 0 ? -1 : 1, xs = dir < 0 ? xR : xL, xe = dir < 0 ? xL : xR;
    for (let k = 0; k <= 24; k++) { const x = xs + (xe - xs) * k / 24; P.push([x, y + 7 * Math.sin(k * 1.15 + i * 1.7) * Math.sin(Math.PI * k / 24)]); }
    if (i < rows.length - 1) for (let a = 1; a < 6; a++) { const th = a * Math.PI / 6; P.push([xe + dir * r * Math.sin(th), y + 14 - 14 * Math.cos(th)]); }
  });
  P.push([234, 801], [222, 800]);
  B.COIL = P;
  B.SI_COIL = smoothPath(P);
  B.SI_TRK = B.DUO + catmull(P);
  B.TRACK = [B.MOUTH, B.OES, B.STOM_TRK, B.SI_TRK, B.LI_TRK, B.REC, B.ANUS];
  B.VESS = [
    'M300,735 C302,620 312,480 314,335',
    'M314,335 C306,270 300,220 300,170 C300,140 300,110 300,60',
    'M314,335 C262,300 202,282 146,300',
    'M314,335 C362,302 420,286 456,302',
    'M300,735 C262,790 222,860 200,975',
    'M300,735 C338,790 378,860 400,975',
    'M314,335 C276,430 206,520 176,640',
    'M314,335 C352,430 418,520 428,640',
    'M300,170 C280,140 262,110 262,70', 'M300,170 C320,140 338,110 338,70'
  ];
  return B;
})();
const SI_COL = ['#7a2f38', '#e79a8f', '#ffd6cc'];
const LI_COL = ['#5a3021', '#c98a68', '#f2c7a6'];
const REC_COL = ['#5a2a24', '#c07763', '#f0b8a0'];
const OES_COL = ['#6e2633', '#d8737d', '#ffc1c1'];

function bodyArt(o = {}) {
  const B = BODY;
  return `
  <g class="sil">
    <path d="${B.TORSO}" fill="url(#gSkin)" stroke="url(#gSkinS)" stroke-width="2.2"/>
    <ellipse cx="300" cy="98" rx="58" ry="74" fill="url(#gSkin)" stroke="rgba(184,212,255,.42)" stroke-width="2.2"/>
    <path class="mouthm" d="M285,147 Q300,155 315,147" fill="none" stroke="rgba(255,180,180,.7)" stroke-width="3" stroke-linecap="round"/>
  </g>
  ${o.vessels ? `<g class="vess" opacity="0">${B.VESS.map(d => `<path d="${d}" fill="none" stroke="#ff4f5e" stroke-width="3.2" stroke-linecap="round" stroke-opacity=".75"/>`).join('')}</g>` : ''}
  <g class="org oes">${tube(B.OES, 11, OES_COL)}</g>
  <g class="org panc"><path d="${B.PANC}" fill="url(#gPanc)" stroke="#a8703f" stroke-width="1.5"/><path d="M290,575 C330,580 370,570 405,557" fill="none" stroke="rgba(150,90,40,.35)" stroke-width="2" stroke-dasharray="3 5"/></g>
  <g class="org stom"><path d="${B.STOM_ORG}" fill="url(#gStom)" stroke="#6b1f2c" stroke-width="2"/>
     <path d="M396,398 C420,410 430,440 426,470" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="5" stroke-linecap="round"/></g>
  <g class="org liver"><path d="${B.LIVER}" fill="url(#gLiver)" stroke="#3d130e" stroke-width="2"/>
     <path d="M188,402 C230,378 290,372 338,382" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="6" stroke-linecap="round"/></g>
  <g class="org gall"><path d="${B.GALL}" fill="url(#gGall)" stroke="#2f5a22" stroke-width="1.5"/></g>
  <g class="duct"><path class="bileduct" d="${B.BILE}" fill="none" stroke="#7cc35a" stroke-width="3.5" stroke-linecap="round"/>
     <path class="pancduct" d="${B.PDUCT}" fill="none" stroke="#e6b45c" stroke-width="3" stroke-linecap="round"/></g>
  <g class="org si">${tube(B.DUO, 15, SI_COL)}${tube(B.SI_COIL, 15, SI_COL)}</g>
  <g class="org li">${tube(B.LI_ORG, 28, LI_COL)}<path d="${B.LI_ORG}" fill="none" stroke="#5c3424" stroke-width="28" stroke-dasharray="1.6 11" opacity=".32"/></g>
  <g class="org rec">${tube(B.REC, 24, REC_COL)}</g>
  <g class="org anus"><ellipse cx="300.5" cy="944" rx="12" ry="6.5" fill="#4a2020" stroke="#c9787a" stroke-width="3"/></g>
  ${o.track ? `<g class="trk" filter="url(#fGlow2)">${B.TRACK.map(d => `<path d="${d}" fill="none" stroke="#ffd36e" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="0 99999"/>`).join('')}</g>` : ''}
  <g class="fx"></g>`;
}
/* reveal portion of the glowing track up to s (0..7) */
function setTrackReveal(c, s) {
  c.trkP = c.trkP || c.qa('.trk path').map(p => [p, p.getTotalLength()]);
  c.trkP.forEach(([p, L], i) => { const v = clamp(s - i) * L; p.setAttribute('stroke-dasharray', `${f1(v)} 99999`); });
}
function dimOrgans(c, keep) { c.qa('.org').forEach(g => { const k = keep === null || keep.some(n => g.classList.contains(n)); g.style.opacity = k ? 1 : .22; g.style.transition = 'opacity .8s'; }); }

/* ================= HEAD (sagittal section, facing right; viewBox 0 0 1000 1000) ================= */
const HEAD = {
  OUT: 'M300,1000 C305,900 300,820 280,760 C210,700 160,620 156,500 C150,340 240,190 420,150 C580,115 720,180 778,300 C800,345 806,380 812,410 C820,445 838,480 862,515 C880,540 884,556 866,566 C852,574 840,574 836,580 C838,592 846,600 852,612 C860,626 858,638 846,644 L842,647 C858,656 862,672 852,686 C846,694 836,700 838,712 C846,740 838,775 800,790 C760,804 700,806 660,800 C630,820 622,880 624,1000 Z',
  CAV: 'M844,646 C800,612 720,594 640,596 C600,598 572,612 558,640 C548,672 546,720 548,780 L592,780 C602,742 622,712 662,700 C730,690 800,680 844,650 Z',
  PHAR: 'M500,560 L500,1000 L548,1000 L548,830 C552,806 560,792 568,776 L568,650 C562,618 552,588 540,560 Z',
  HARD: 'M840,616 C790,594 700,582 630,586 L626,600 C700,598 790,606 836,630 Z',
  SOFT: 'M630,586 C600,588 578,600 566,624 C560,640 564,656 574,654 C582,634 600,612 626,600 Z',
  TONGUE: 'M842,652 C800,668 730,676 660,684 C610,690 578,712 568,752 C562,780 570,800 588,806 C640,808 700,792 754,770 C800,752 830,730 846,700 C850,680 848,664 842,652 Z',
  EPI: 'M576,800 C566,782 560,764 558,742 C566,750 574,772 586,797 Z',
  JAWBONE: 'M846,704 C840,744 820,772 780,784 C730,798 680,798 656,790',
  PAROTID_DUCT: 'M626,566 C664,578 700,598 728,610',
  SUBM_DUCT: 'M706,758 C742,730 786,706 812,690',
  BOLUS_PATH: 'M712,640 C690,646 660,652 630,660 C600,668 584,690 574,720 C566,748 548,770 528,800 C522,840 524,900 524,1060'
};
function tooth(x, y, w, h, up) {
  const r = Math.min(8, w / 3);
  return up ? `<path d="M${x},${y} L${x + w},${y} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} Z" fill="url(#gTooth)" stroke="#9c927f" stroke-width="1.5"/>`
    : `<path d="M${x},${y + h} L${x + w},${y + h} L${x + w},${y + r} Q${x + w},${y} ${x + w - r},${y} L${x + r},${y} Q${x},${y} ${x},${y + r} Z" fill="url(#gTooth)" stroke="#9c927f" stroke-width="1.5"/>`;
}
function headArt() {
  const H = HEAD;
  const upper = [[818, 606, 14, 44], [796, 602, 18, 44], [768, 598, 24, 42], [740, 596, 24, 42], [704, 594, 32, 44], [668, 594, 32, 44], [634, 596, 30, 42]];
  const lower = [[818, 652, 13, 40], [796, 650, 18, 40], [768, 648, 24, 40], [740, 648, 24, 40], [704, 648, 32, 40], [668, 648, 32, 40], [634, 650, 30, 38]];
  return `
  <path d="${H.OUT}" fill="url(#gSkinW)" stroke="rgba(255,220,200,.42)" stroke-width="3"/>
  <path d="M560,470 C620,452 720,460 800,500" fill="none" stroke="rgba(255,220,200,.12)" stroke-width="3"/>
  <path d="${H.CAV}" fill="#2b0c13"/>
  <path d="${H.PHAR}" fill="#2b0c13"/>
  <rect x="488" y="560" width="14" height="440" fill="#c9606c" opacity=".85"/>
  <path d="M548,830 L560,830 L560,1000 L548,1000 Z" fill="#c9606c" opacity=".85"/>
  <g class="trachea" opacity=".75"><path d="M576,800 L576,1000 M624,790 L624,1000" stroke="rgba(170,200,230,.6)" stroke-width="4"/>
    ${[0, 1, 2, 3, 4, 5].map(k => `<path d="M576,${830 + k * 30} L624,${826 + k * 30}" stroke="rgba(170,200,230,.38)" stroke-width="6" stroke-linecap="round"/>`).join('')}</g>
  <path class="hard" d="${H.HARD}" fill="#ead9c7"/>
  <path class="soft" d="${H.SOFT}" fill="#d97a84"/>
  <g class="glands" opacity=".75">
    <path d="M590,520 C620,515 646,540 640,575 C634,605 600,612 584,592 C566,570 568,526 590,520 Z" fill="#f3c9a8" stroke="#c99a76" stroke-width="2" opacity=".9"/>
    <path d="M676,740 C700,730 728,746 724,772 C720,794 690,800 676,786 C662,772 660,748 676,740 Z" fill="#f3c9a8" stroke="#c99a76" stroke-width="2" opacity=".9"/>
    <path d="${H.PAROTID_DUCT}" fill="none" stroke="#c99a76" stroke-width="4" stroke-linecap="round"/>
    <path d="${H.SUBM_DUCT}" fill="none" stroke="#c99a76" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="upper">${upper.map(t => tooth(...t, true)).join('')}</g>
  <g class="jaw">
    <path class="tongue" d="${H.TONGUE}" fill="url(#gTongue)" stroke="#8a2c3e" stroke-width="2"/>
    <path d="M820,664 C760,676 700,682 650,690" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="4" stroke-linecap="round"/>
    <g class="lower">${lower.map(t => tooth(...t, false)).join('')}</g>
    <path d="${H.JAWBONE}" fill="none" stroke="rgba(232,214,196,.35)" stroke-width="10" stroke-linecap="round"/>
  </g>
  <path class="epi" d="${H.EPI}" fill="#e7a3a8" stroke="#a65a64" stroke-width="1.5"/>
  <g class="food"></g>
  <g class="sal"></g>
  <g class="fx"></g>`;
}

/* ================= molecule chains (starch / protein / generic) ================= */
const SHAPES = {
  hex: r => { let p = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; p += f1(r * Math.cos(a)) + ',' + f1(r * Math.sin(a)) + ' '; } return p; }
};
class Chain {
  /* o: {x,y,n,gap,ang,r,shape:'hex'|'circle',colors:[...],simple:'#hex',levels:[...per link], seed, spread} */
  constructor(g, o) {
    this.o = o; const R = rng(o.seed || 1); this.R = R;
    this.g = el('g', {}, g);
    const n = o.n, gap = o.gap || o.r * 2.3, ang = o.ang || 0;
    this.u = []; this.l = [];
    for (let i = 0; i < n; i++) {
      const s = (i - (n - 1) / 2) * gap, w = (o.wave || 10) * Math.sin(i * .9 + (o.seed || 0));
      const hx = o.x + s * Math.cos(ang) - w * Math.sin(ang), hy = o.y + s * Math.sin(ang) + w * Math.cos(ang);
      this.u.push({ hx, hy, x: hx, y: hy, tx: hx, ty: hy, c: o.colors[i % o.colors.length], free: false, ph: R() * 6.28 });
    }
    for (let i = 0; i < n - 1; i++) {
      this.l.push({ lvl: o.levels ? o.levels[i] : 1, at: R() * (o.spreadT || 2.5), broken: false,
        e: el('line', { stroke: o.link || 'rgba(255,240,210,.55)', 'stroke-width': o.lw || 4, 'stroke-linecap': 'round' }, this.g) });
    }
    this.u.forEach(u => {
      u.glow = el('circle', { r: o.r * 2.2, fill: o.glowFill || 'url(#gGold)', opacity: 0 }, this.g);
      u.e = o.shape === 'hex' ? el('polygon', { points: SHAPES.hex(o.r), fill: u.c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 }, this.g)
        : el('circle', { r: o.r, fill: u.c, stroke: 'rgba(0,0,0,.3)', 'stroke-width': 1.5 }, this.g);
    });
    this.dirty = true; this.draw(0);
  }
  /* T[level] = seconds since that level was switched on (or -1 if off) */
  update(dt, T, t) {
    let ch = false;
    this.l.forEach(l => { const on = T[l.lvl] !== undefined && T[l.lvl] >= 0 && T[l.lvl] > l.at; if (on !== l.broken) { l.broken = on; ch = true; } });
    if (ch) this.regroup();
    const k = 1 - Math.exp(-dt * 1.6);
    this.u.forEach(u => { u.x += (u.tx - u.x) * k; u.y += (u.ty - u.y) * k; });
    this.draw(t);
  }
  regroup() {
    const n = this.u.length; let s = 0; const sp = this.o.spread || 40;
    for (let i = 0; i <= n - 1; i++) {
      if (i === n - 1 || this.l[i].broken) {
        const R = rng(s * 977 + i * 131 + (this.o.seed || 0) * 7);
        const single = s === i, ox = (R() - .5) * sp * 2, oy = (R() - .5) * sp * 2;
        for (let k = s; k <= i; k++) { const u = this.u[k]; u.tx = u.hx + ((s === 0 && i === n - 1) ? 0 : ox); u.ty = u.hy + ((s === 0 && i === n - 1) ? 0 : oy); u.free = single; }
        s = i + 1;
      }
    }
    this.u.forEach(u => { const col = u.free && this.o.simple ? this.o.simple : u.c; u.e.setAttribute('fill', col); u.glow.setAttribute('opacity', u.free && this.o.simple ? .9 : 0); });
  }
  draw(t) {
    const j = this.o.jit === undefined ? 3 : this.o.jit;
    this.u.forEach(u => { const x = u.x + j * Math.sin(t * 1.3 + u.ph), y = u.y + j * Math.cos(t * 1.1 + u.ph * 1.3); u.px = x; u.py = y; const tr = `translate(${f1(x)},${f1(y)})`; u.e.setAttribute('transform', tr); u.glow.setAttribute('transform', tr); });
    this.l.forEach((l, i) => { const a = this.u[i], b = this.u[i + 1]; if (l.broken) { l.e.setAttribute('opacity', 0); return; } l.e.setAttribute('opacity', 1); setA(l.e, { x1: f1(a.px), y1: f1(a.py), x2: f1(b.px), y2: f1(b.py) }); });
  }
}

/* simple particle sprite */
function dotEl(parent, r, fill, extra) { return el('circle', Object.assign({ r, fill }, extra || {}), parent); }

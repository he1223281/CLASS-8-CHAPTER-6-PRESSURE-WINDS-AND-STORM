/* ===================== OPENING + FRAMING THE NEIGHBOURHOOD ===================== */
const CAP = {
  IND: [77.21, 28.61], PAK: [73.05, 33.68], AFG: [69.17, 34.53], CHN: [116.4, 39.9], NPL: [85.32, 27.71], BTN: [89.64, 27.47],
  BGD: [90.41, 23.81], MMR: [96.13, 19.76], LKA: [79.86, 6.93], MDV: [73.51, 4.17], IRN: [51.39, 35.69], OMN: [58.41, 23.59],
  THA: [100.5, 13.75], MYS: [101.69, 3.14], SGP: [103.82, 1.35], IDN: [106.85, -6.21],
};
const CAPN = { IND: 'New Delhi', PAK: 'Islamabad', AFG: 'Kabul', CHN: 'Beijing', NPL: 'Kathmandu', BTN: 'Thimphu', BGD: 'Dhaka', MMR: 'Naypyidaw', LKA: 'Colombo', MDV: 'Malé', IRN: 'Tehran', OMN: 'Muscat', THA: 'Bangkok', MYS: 'Kuala Lumpur', SGP: 'Singapore', IDN: 'Jakarta' };
/* Sea paths from India's coast that stay on water (approximate, for illustration) */
const SEA = {
  LKA: [[79.2, 10.6], [79.9, 9.9], [80.4, 9.5]],
  MDV: [[74.6, 12.5], [73.7, 9], [73.4, 5]],
  IRN: [[72.6, 21], [66, 23], [61, 24.6], [60.6, 25.3]],
  OMN: [[72.6, 20.6], [65, 22], [59.2, 23.4]],
  THA: [[87.9, 21.4], [91, 16], [95, 11], [98.2, 8.2]],
  MYS: [[80.5, 13], [88, 9], [95, 6.2], [100.2, 4.6]],
  SGP: [[80.6, 12.8], [88, 7.5], [96, 5.8], [100.5, 3.3], [103.6, 1.4]],
  IDN: [[80.6, 12.6], [88, 7], [94, 4], [97.5, 2.5], [100, 1.5]],
};
function seaLink(c, o = {}) { return route(SEA[c], Object.assign({ type: 'sea' }, o)); }
function landLink(c, o = {}) { return route([CAP.IND, CAP[c]], Object.assign({ type: 'land', bulge: .12 }, o)); }

S({
  id: 'title', title: 'India and Her Neighbours', view: ['wide', 'r'],
  countries: neighbourSpec({}, {}), base: 'dimmed',
  html: `<div class="pattern" style="opacity:.04"></div>
  <div class="panel" style="top:150px;width:900px">
    <div class="kicker" data-in>Grade 7 · Exploring Society: India and Beyond · Chapter 2</div>
    <h1 data-in style="--d:.2;margin:34px 0 30px;font-size:124px">India<br>and Her<br><span style="color:var(--gold)">Neighbours</span></h1>
    <p class="lead" data-in style="--d:.5">A journey across mountains, rivers, seas and centuries: to discover what really makes countries neighbours.</p>
    <blockquote data-in style="--d:.9;margin-top:46px;border-left:4px solid var(--gold);padding:6px 0 6px 28px;max-width:780px">
      <p style="font:italic 500 34px var(--serif);line-height:1.35;color:#fff">“Our destinies are inextricably tied together. What affects one nation affects the rest of us.”</p>
      <p class="small" style="margin-top:12px">Nelson Mandela (1995), quoted at the opening of the chapter</p>
    </blockquote>
  </div>`,
  enter() {
    labels(['IND'], '', .2);
    [...LAND_N, ...SEA_N].forEach((c, i) => {
      if (SEA[c]) seaLink(c, { del: .3 + i * .12, dur: 1.4 });
      else landLink(c, { del: .3 + i * .12, dur: 1.4, cls: 'thin' });
    });
  },
  notes: {
    tp: 'Set the hook: this chapter is a journey. India sits at the centre of a web of land and sea connections.',
    q: 'Who is your neighbour at home? Is it only the person whose wall touches yours?',
    mis: 'Students may think "neighbour" only means "shares a border". The whole chapter widens this idea.',
    s20: 'India has neighbours on land and across the sea. Over the next screens we will travel to each one and see that geography, history, trade, faith and people tie them together.',
  },
});

S({
  id: 'bigq', title: 'The Big Questions', sec: 'Framing the neighbourhood', num: '01', view: ['sa', 'r'],
  countries: neighbourSpec({}, { sea: false }), base: 'dimmed',
  html: `<div class="panel" style="width:820px">
    <div class="kicker" data-in><b>01</b> India: a country with many neighbours</div>
    <h2 data-in style="--d:.15">Three big questions for our journey</h2>
    <div class="cards" style="margin-top:26px">
      <div class="card" data-in="l" style="--d:.4"><span class="lab">Question 1</span><h4>What defines a ‘neighbour’?</h4><p>Is it just shared land borders?</p></div>
      <div class="card" data-in="l" style="--d:.6"><span class="lab">Question 2</span><h4>How do geography and history shape relationships?</h4><p>Mountains, rivers, seas and a shared past all play a part.</p></div>
      <div class="card" data-in="l" style="--d:.8"><span class="lab">Question 3</span><h4>How are India and her neighbours interconnected today?</h4><p>Trade, travel, culture, energy, disaster relief…</p></div>
    </div>
  </div>`,
  enter() { labels(['IND', ...LAND_N], '', .3, .18); },
  notes: {
    tp: 'These are the chapter’s own Big Questions. Return to them at the end.',
    q: 'Before we start: write down one country you think is India’s neighbour. Why did you choose it?',
    mis: 'That Sri Lanka "is part of India" or that Bhutan and Nepal are Indian states. They are independent countries.',
    s20: 'We will answer three questions: what makes a neighbour, how geography and history shape relationships, and how we are connected today.',
  },
});

S({
  id: 'what', title: 'What exactly is a neighbour?', sec: 'Framing the neighbourhood', num: '02', map: 'hide',
  html: `<div class="center" style="justify-content:flex-start;padding-top:96px">
    <div class="kicker" data-in><b>02</b> What exactly is a neighbour?</div>
    <h2 data-in style="--d:.15;font-size:70px">Two kinds of neighbours on one street</h2>
    <svg viewBox="0 0 1600 520" width="1500" height="490" data-in="z" style="--d:.35;margin-top:6px" aria-label="Two houses sharing a wall, and two houses across a lake connected by a boat">
      <defs><linearGradient id="lake" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a7fc4"/><stop offset="1" stop-color="#0f3c70"/></linearGradient></defs>
      <rect x="0" y="420" width="1600" height="100" fill="#14301f"/>
      <g transform="translate(110,180)">
        <path d="M0,240V100L110,20L220,100V240Z" fill="#f2b544"/><path d="M220,240V100L330,20L440,100V240Z" fill="#6fe0c0"/>
        <rect x="80" y="160" width="60" height="80" fill="#3b2408"/><rect x="300" y="160" width="60" height="80" fill="#0e3d35"/>
        <rect x="30" y="120" width="40" height="34" fill="#fff8" /><rect x="370" y="120" width="40" height="34" fill="#fff8"/>
        <rect x="214" y="70" width="12" height="170" fill="#fff"/>
        <text x="220" y="-20" text-anchor="middle" fill="#fff" font-size="34" font-weight="700" font-family="sans-serif">They share a wall</text>
        <text x="220" y="300" text-anchor="middle" fill="#c8fff0" font-size="30" font-family="sans-serif">like a LAND border</text>
      </g>
      <g transform="translate(820,180)">
        <path d="M0,240V100L90,30L180,100V240Z" fill="#f2b544"/><rect x="65" y="160" width="50" height="80" fill="#3b2408"/>
        <path d="M200,240 Q 380,190 560,240 L560,250 L200,250Z" fill="url(#lake)"/>
        <rect x="200" y="238" width="360" height="14" fill="url(#lake)"/>
        <g style="animation:boat 6s ease-in-out infinite alternate"><path d="M250,232h60l-10,14h-40z" fill="#fff"/><path d="M280,232v-40l22,40z" fill="#ffd98a"/></g>
        <path d="M580,240V100L670,30L760,100V240Z" fill="#5cc8ff"/><rect x="645" y="160" width="50" height="80" fill="#0b2c4d"/>
        <text x="380" y="-20" text-anchor="middle" fill="#fff" font-size="34" font-weight="700" font-family="sans-serif">Water in between</text>
        <text x="380" y="300" text-anchor="middle" fill="#bfe8ff" font-size="30" font-family="sans-serif">connected by boat, like a MARITIME link</text>
      </g>
    </svg>
    <div style="width:1300px;text-align:left">${bigQ('Can a country be your neighbour without sharing a land border?', '<b>Yes.</b> A <em class="t">maritime neighbour</em> is a country connected to another by a shared sea or ocean, even without a direct land border. The ocean acts as a vital link for trade, cultural exchange and historical ties. Sri Lanka and the Maldives are India’s immediate neighbours across the waters.')}</div>
  </div>
  <style>@keyframes boat{to{transform:translateX(200px)}}</style>`,
  notes: {
    tp: 'Build the definition from daily life before using the map.',
    q: 'Your cousin lives across a river from your house. Are they your neighbour? What connects you?',
    mis: '"No shared border = not a neighbour." The sea can join countries as much as land does.',
    s20: 'The traditional view of a neighbour is a country that shares a land boundary. But India is surrounded by sea on three sides, so countries across the water are our neighbours too. These are maritime neighbours.',
  },
});

S({
  id: 'landsea', title: 'Land vs maritime neighbours', sec: 'Framing the neighbourhood', num: '03', view: ['ocean', 'r'],
  countries: { IND: 'india keep' }, base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:90px">
    <div class="kicker" data-in><b>03</b> Land vs maritime</div>
    <h2 data-in style="--d:.1;font-size:64px">Three rings of neighbours</h2>
    <div class="cards" style="gap:16px">
      <button class="card lsbtn" data-k="0" data-in style="--d:.3"><span class="lab" style="color:var(--land)">━━ Land border</span><h4>India ⟷ Nepal</h4><p>Countries that share a land boundary.</p></button>
      <button class="card lsbtn" data-k="1" data-in style="--d:.45"><span class="lab" style="color:var(--sea)">· · · Across the water</span><h4>India 🌊 Sri Lanka</h4><p>Immediate maritime neighbours: Sri Lanka and the Maldives.</p></button>
      <button class="card lsbtn" data-k="2" data-in style="--d:.6"><span class="lab" style="color:var(--gold)">→ Wider maritime neighbourhood</span><h4>India → Indian Ocean → the world</h4><p>Seen from a satellite: Iran, Oman, Thailand, Malaysia, Singapore, Indonesia.</p></button>
    </div>
    <p class="small" data-in style="--d:.8;margin-top:18px">Tap a card to replay it on the map.</p>
  </div>`,
  init(el) { $$('.lsbtn', el).forEach(b => b.onclick = () => this.step(+b.dataset.k)); },
  step(k) {
    clearFX();
    $$('.lsbtn', this.el).forEach(b => b.style.borderColor = +b.dataset.k === k ? 'var(--gold)' : '');
    if (k === 0) {
      countries({ IND: 'india keep', NPL: 'landN focus keep' }, 'dimmed'); setView('nepal', 'r', 1200);
      landLink('NPL', { dur: 1.2 }); label('NPL'); label('IND', 'India', 'india');
      route([[80.1, 28.9], [83.3, 27.4], [84.6, 27.0], [88.1, 26.4]], { type: 'border', del: .4, dur: 1.6 });
    } else if (k === 1) {
      countries({ IND: 'india keep', LKA: 'seaN focus keep', MDV: 'seaN keep' }, 'dimmed'); setView([70, 2, 88, 16], 'r', 1200);
      seaLink('LKA', { dur: 1.2 }); seaLink('MDV', { dur: 1.4, del: .3 }); atolls(.4); label('LKA'); label('MDV', 'Maldives', 'sm sea');
    } else {
      countries(neighbourSpec({}, {}), 'dimmed'); setView('ocean', 'r', 1300);
      SEA_N.forEach((c, i) => seaLink(c, { del: i * .15 })); atolls(.4);
      labels(SEA_N, '', .5, .12);
      route([[73, 15], [62, 8], [52, 2], [42, -3]], { type: 'sea', del: 1.4, mover: { kind: 'ship', speed: 120 } });
      label([46, 1], 'to Africa', 'sm sea', 1.6); label([52, 21.5], 'West Asia', 'sm sea', 1.6); label([106, 6.5], 'Southeast Asia', 'sm sea', 1.6);
    }
  },
  enter(el, c) { this.step(0); c.after(4.2, () => this.step(1)); c.after(8.4, () => this.step(2)); },
  notes: {
    tp: 'Three rings: land neighbours, immediate maritime neighbours, and the wider maritime neighbourhood.',
    q: 'Which ring does Indonesia belong to? Which ring does Bhutan belong to?',
    mis: 'That maritime neighbours are less important. The Indian Ocean has carried trade and ideas for centuries.',
    s20: 'Nepal shares a land border with us. Sri Lanka and the Maldives are just across the water. And if you look from a satellite, countries from Iran and Oman to Indonesia are part of our maritime neighbourhood.',
  },
});

S({
  id: 'landN', title: 'India’s land neighbours', sec: 'Framing the neighbourhood', num: '03', view: ['sa', 'r'],
  countries: neighbourSpec({}, { sea: false }), base: 'dimmed',
  html: `<div class="panel" style="width:800px">
    <div class="kicker" data-in>Land neighbours</div>
    <h2 data-in style="--d:.1">Seven neighbours by land</h2>
    <div class="stat" data-in style="--d:.3"><span class="n"><span class="cnt">0</span> km</span><span class="u">India’s total land boundary stretches over 15,100 km</span></div>
    <div class="cards" style="grid-template-columns:1fr 1fr 1fr;margin-top:30px;gap:14px">
      <div class="card" data-in style="--d:.5;padding:20px"><span class="lab">Northwest</span><p style="color:#fff">Pakistan<br>Afghanistan</p></div>
      <div class="card" data-in style="--d:.65;padding:20px"><span class="lab">North</span><p style="color:#fff">China’s region of Tibet<br>Nepal · Bhutan</p></div>
      <div class="card" data-in style="--d:.8;padding:20px"><span class="lab">East</span><p style="color:#fff">Bangladesh<br>Myanmar</p></div>
    </div>
    <p class="small" data-in style="--d:1;margin-top:28px">The boundary passes through very different landscapes:</p>
    <div class="chips" data-in style="--d:1.1;margin-top:12px"><span class="chip">🏜 Deserts</span><span class="chip">🌾 Plains</span><span class="chip">🌳 Forests</span><span class="chip">🏔 Mountains</span><span class="chip">🌿 Marshes</span><span class="chip">🏞 River valleys</span></div>
  </div>`,
  enter(el, c) {
    c.after(.6, () => counter($('.cnt', el), 15100, 2.2));
    const order = ['PAK', 'AFG', 'CHN', 'NPL', 'BTN', 'BGD', 'MMR'];
    labels(['IND'], '', .1);
    order.forEach((k, i) => { label(k, null, (['NPL', 'BTN', 'BGD'].includes(k) ? 'sm' : ''), .5 + i * .35); landLink(k, { del: .5 + i * .35, dur: 1 }); });
  },
  notes: {
    tp: 'Read the map clockwise from the northwest: Pakistan, Afghanistan, China (Tibet), Nepal, Bhutan, Bangladesh, Myanmar.',
    q: 'Find the neighbour that touches the most Indian states in the east. (Bangladesh)',
    mis: 'That India still shares a direct border crossing with Afghanistan. Since 1947, access has been complicated by Pakistan.',
    s20: 'Our land border is over 15,100 km long and crosses deserts, plains, forests, mountains, marshes and river valleys. Seven countries sit along it.',
  },
});

S({
  id: 'ocean', title: 'India’s position in the Indian Ocean', sec: 'Framing the neighbourhood', num: '04', view: ['ocean', 'r'],
  countries: { IND: 'india keep' }, base: '',
  html: `<div class="panel glass" style="width:800px;top:80px">
    <div class="kicker" data-in><b>04</b> India in the Indian Ocean</div>
    <h2 data-in style="--d:.1;font-size:62px">A peninsula reaching deep into a busy ocean</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px 30px;margin-top:10px">
      <div class="stat" data-in style="--d:.3"><span class="n" style="font-size:66px">≈<span class="c1">0</span> km</span><span class="u">India’s long coastline</span></div>
      <div class="stat" data-in style="--d:.4"><span class="n" style="font-size:66px">3rd</span><span class="u">largest ocean in the world</span></div>
      <div class="stat" data-in style="--d:.5"><span class="n" style="font-size:66px">½</span><span class="u">of the world’s container ships use it</span></div>
      <div class="stat" data-in style="--d:.6"><span class="n" style="font-size:66px">⅔</span><span class="u">of the world’s oil is carried across it (and ⅓ of bulk cargo)</span></div>
    </div>
    <p class="lead" data-in style="--d:.8;font-size:27px;margin-top:22px">It connects countries home to about <b>2.7 billion people</b>. India is a vital link between <b>Southeast Asia, West Asia and Africa</b>: her ports are gateways, and her central position helps her send <b>timely humanitarian aid</b>.</p>
    <div class="bq" data-in style="--d:1;margin-top:18px;padding:18px 24px"><div class="q" style="font-size:27px">Let’s explore: name the three large water bodies around India.</div><button class="btn sm" id="wb">Show them on the map</button><div class="a" style="font-size:24px">The <b>Arabian Sea</b> (west), the <b>Bay of Bengal</b> (east) and the <b>Indian Ocean</b> (south).</div></div>
  </div>`,
  init(el) { $('#wb', el).onclick = () => { $('.bq', el).classList.add('open'); waters(); }; },
  enter(el, c) {
    c.after(.7, () => counter($('.c1', el), 11100, 2));
    label('IND', 'India', 'india', .2);
    const lanes = [
      [[44, 12.2], [52, 13.5], [62, 11], [72, 7.5], [80.5, 5.6], [88, 5.6], [95.5, 5.8], [100, 3.8], [104, 1.2]],
      [[56.5, 26.2], [60, 23.5], [66, 18], [72, 8.5], [78, 5.4], [86, 5.4], [95, 6]],
      [[40, -6], [50, -2], [62, 3], [74, 6.4], [80, 5.4]],
      [[104, 1.2], [96, 6.2], [90, 10], [87, 18], [88, 21.2]],
    ];
    lanes.forEach((l, i) => route(l, { type: 'sea', del: .3 + i * .3, dur: 2.2, mover: [{ kind: 'ship', speed: 70 + i * 12, gap: 3 }, { kind: 'ship', speed: 70 + i * 12, gap: 3 }] }));
    [[72.88, 19.07, 'Mumbai'], [80.27, 13.08, 'Chennai'], [88.36, 22.57, 'Kolkata'], [76.27, 9.93, 'Kochi'], [83.3, 17.7, 'Visakhapatnam']].forEach((p, i) => pin(p[0], p[1], p[2], 'city' + (p[2] === 'Kochi' || p[2] === 'Mumbai' ? ' left' : ''), .8 + i * .15));
  },
  notes: {
    tp: 'India’s peninsular shape and long coastline give her a central, strategic place on the Indian Ocean’s sea routes.',
    q: 'Why would a country in the middle of a busy ocean be able to help neighbours quickly in a disaster?',
    mis: 'That the ocean separates India from the world. In fact it has always connected India to it.',
    s20: 'Half the world’s container ships and two-thirds of its oil cross the Indian Ocean. India’s 11,100 km coastline and ports make her a link between Southeast Asia, West Asia and Africa. Working together in a region like this is called regionalism.',
  },
});

S({
  id: 'regionalism', title: 'Regionalism: working together', sec: 'Framing the neighbourhood', num: '04', view: ['sa', 'r'],
  countries: neighbourSpec(), base: 'dimmed',
  html: `<div class="panel" style="width:820px;top:170px">
    <div class="kicker" data-in>Key idea</div>
    <h2 data-in style="--d:.1">Regionalism</h2>
    <p class="lead" data-in style="--d:.3">When neighbouring countries get involved in each other’s trade, cooperation and relief work, it is called <em class="t">regionalism</em>.</p>
    ${chain(['Peace', 'Stability', 'Shared progress'])}
    <blockquote data-in style="--d:.9;margin-top:46px;font:italic 500 36px var(--serif);line-height:1.35;color:#fff;border-left:4px solid var(--gold);padding-left:26px">Being good neighbours is not just about borders, but also about working together for the benefit of everyone in the region.</blockquote>
  </div>`,
  enter(el, c) {
    playChain(el, .8, .6);
    [...LAND_N, ...SEA_N].forEach((k, i) => route([CAP.IND, CAP[k]], { type: 'culture', bulge: .15, del: .3 + i * .08, dur: 1.2, cls: 'thin' }));
  },
  notes: {
    tp: 'Define regionalism using the textbook’s words: working together creates peace, stability and shared progress.',
    q: 'Can you think of one way your school works with a neighbouring school? How is that like regionalism?',
    mis: 'That cooperation only happens between friends. Even countries with disagreements cooperate on shared problems.',
    s20: 'Regionalism means neighbours working together: trading, helping in disasters, solving shared problems. It brings peace, stability and progress for everyone.',
  },
});

/* ---------------- ANCIENT ROUTES ---------------- */
const ROUTES = {
  uttara: { name: 'Uttarāpatha', type: 'land', pts: [[85.14, 25.6], [83.0, 25.32], [80.6, 26.2], [77.7, 28.4], [74.6, 31.3], [72.83, 33.75], [69.17, 34.53], [66.9, 36.75]], m: { kind: 'caravan', speed: 90 } },
  dakshina: { name: 'Dakṣhiṇāpatha', type: 'land', color: '#7bd88f', pts: [[83.0, 25.32], [81.4, 25.35], [77.8, 23.52], [75.78, 23.18], [75.38, 19.48], [77.5, 15.6], [79.7, 12.83]], m: { kind: 'caravan', speed: 80 } },
  silk: { name: 'Silk Route', type: 'culture', pts: [[44.4, 33.3], [51.4, 35.7], [58.8, 36.2], [61.8, 37.6], [66.9, 36.75], [71.5, 37.8], [75.99, 39.47], [82, 40.5], [88, 41.5], [94.66, 40.14], [103.8, 36.06], [108.94, 34.34]], m: { text: 'silk · ideas', speed: 110 } },
  silkS: { name: '', type: 'culture', pts: [[72.83, 33.75], [74.3, 36.2], [75.99, 39.47]] },
  spiceW: { name: 'Spice routes (west)', type: 'sea', pts: [[76.2, 10.2], [72.6, 15], [66, 19], [59.6, 22.9], [57.5, 25.5], [55, 26.6], [51, 28]], m: { kind: 'ship', speed: 90 } },
  spiceA: { name: '', type: 'sea', pts: [[72.62, 21.0], [64, 16], [54, 13.2], [45.5, 12.2], [43.5, 12.6]], m: { kind: 'ship', speed: 90 } },
  spiceAf: { name: '', type: 'sea', pts: [[74, 9], [62, 4], [50, -1], [41.5, -3.5]], m: { kind: 'ship', speed: 90 } },
  seaE: { name: 'Maritime routes (east)', type: 'sea', pts: [[87.9, 21.4], [90, 16], [93.5, 11], [97.5, 7.2], [100.1, 4.5], [102.6, 2.2], [104.4, 1.2], [106.6, -3.5], [110.4, -6.4]], m: { kind: 'ship', speed: 100 } },
  seaC: { name: '', type: 'sea', pts: [[104.4, 1.4], [106.5, 6], [109.5, 11.5], [111.5, 16.5], [114.5, 21.2], [118.6, 24.6]], m: { kind: 'ship', speed: 100 } },
  seaL: { name: '', type: 'sea', pts: [[80.3, 13.1], [81.6, 9.3], [82.4, 6.6], [87, 5.7], [95, 5.8]] },
};
S({
  id: 'routes', title: 'The network of ancient routes', sec: 'Ancient routes', num: '05', view: [[34, -8, 122, 44], 'r'],
  countries: { IND: 'india keep' }, base: '',
  html: `<div class="panel glass" style="width:760px;top:70px;padding:36px 40px">
    <div class="kicker" data-in><b>05</b> The network of ancient routes</div>
    <h2 data-in style="--d:.1;font-size:58px">Routes connected people before modern borders</h2>
    <p class="lead" data-in style="--d:.25;font-size:26px">For centuries, land and sea routes linked India with Central Asia, Southeast Asia, the Arabian Peninsula and Africa. Tap a route:</p>
    <div class="cards" style="gap:12px;margin-top:16px" id="rtbtns">
      <button class="card" data-r="uttara" data-in style="--d:.35;padding:16px 22px"><h4 style="font-size:27px"><span style="color:var(--land)">━</span> Uttarāpatha</h4><p style="font-size:21px">The northern road: Ganga plains → Central Asia via Afghanistan</p></button>
      <button class="card" data-r="dakshina" data-in style="--d:.45;padding:16px 22px"><h4 style="font-size:27px"><span style="color:#7bd88f">━</span> Dakṣhiṇāpatha</h4><p style="font-size:21px">The southern road into the Deccan</p></button>
      <button class="card" data-r="silk" data-in style="--d:.55;padding:16px 22px"><h4 style="font-size:27px"><span style="color:var(--culture)">━ ━</span> Silk Route</h4><p style="font-size:21px">Across Central Asia to China and Iran</p></button>
      <button class="card" data-r="sea" data-in style="--d:.65;padding:16px 22px"><h4 style="font-size:27px"><span style="color:var(--sea)">· · ·</span> Spice &amp; maritime routes</h4><p style="font-size:21px">Arabian Sea to the Gulf &amp; Africa; Bay of Bengal to Southeast Asia</p></button>
    </div>
    <p class="small" data-in style="--d:.8;margin-top:14px">Routes are approximate and changed over time (as in Fig. 2.2).</p>
  </div>`,
  init(el) {
    $$('#rtbtns .card', el).forEach(b => b.onclick = () => {
      clearFX(); const k = b.dataset.r;
      const set = k === 'sea' ? ['spiceW', 'spiceA', 'spiceAf', 'seaE', 'seaC', 'seaL'] : k === 'silk' ? ['silk', 'silkS'] : [k];
      set.forEach(r => this.draw(r, 0)); this.cities(0);
      $$('#rtbtns .card', el).forEach(x => x.style.borderColor = x === b ? 'var(--gold)' : '');
    });
  },
  draw(r, del) { const R = ROUTES[r]; return route(R.pts, { type: R.type, color: R.color, del, dur: 2.2, mover: R.m ? [R.m, Object.assign({}, R.m, { gap: 4 })] : null }); },
  cities(del) {
    [[85.14, 25.6, 'Pāṭaliputra', ''], [83.0, 25.32, 'Varanasi', 'left'], [72.83, 33.75, 'Takṣhaśhilā', 'left'], [75.78, 23.18, 'Ujjain', 'left'], [87.9, 22.3, 'Tāmralipti', ''], [76.2, 10.2, 'Muziris', 'left'], [108.94, 34.34, 'Xi’an', 'left']]
      .forEach((c, i) => pin(c[0], c[1], c[2], 'city ' + c[3], del + i * .1));
  },
  enter(el, c) {
    Object.keys(ROUTES).forEach((r, i) => this.draw(r, .2 + i * .25));
    this.cities(1.5);
    label([102, 39], 'Central Asia → China', 'sm', 2.5); label([47, 22], 'Arabian Peninsula', 'sm', 2.5); label([112, 3], 'Southeast Asia', 'sm sea', 2.5);
  },
  notes: {
    tp: 'Before modern borders existed, people, goods and ideas moved along these routes. Buddhism, languages, art and trade travelled this way.',
    q: 'Why did ancient trade routes matter? What travelled along them besides goods?',
    mis: 'That ancient people stayed in one place. Merchants, monks and scholars travelled thousands of kilometres.',
    s20: 'The Uttarāpatha linked the Ganga plains to Central Asia. The Dakṣhiṇāpatha went south. The Silk Route crossed Central Asia, and spice and sea routes linked our coasts to Arabia, Africa and Southeast Asia. Along them travelled goods, faiths and ideas.',
  },
});

S({
  id: 'routesq', title: 'Why did ancient routes matter?', sec: 'Ancient routes', num: '05', view: [[60, 0, 112, 38], 'r'],
  countries: neighbourSpec(), base: 'dimmed',
  html: `<div class="panel" style="width:780px;top:160px">
    <div class="kicker" data-in>Think</div>
    <h2 data-in style="--d:.1">What travelled along the routes?</h2>
    <div class="chips" data-in style="--d:.3"><span class="chip g">Goods</span><span class="chip g">Ideas</span><span class="chip g">Religion</span><span class="chip g">Art</span><span class="chip g">Languages</span><span class="chip g">Food</span></div>
    ${bigQ('Why did ancient trade routes matter?', 'They carried more than goods. Monks, merchants and scholars spread <b>Buddhism, Hindu traditions, languages, art and ideas</b>. India spread her traditions <b>peacefully, through trade, pilgrimage and culture</b>. Many links between neighbours today began on these routes.')}
  </div>`,
  enter() {
    route(ROUTES.uttara.pts, { type: 'land', dur: 2, mover: [{ text: 'Buddhism', speed: 80 }, { text: 'art', speed: 80, gap: 3 }] });
    route(ROUTES.seaE.pts, { type: 'sea', dur: 2, mover: [{ text: 'spices', speed: 90, color: '#5cc8ff' }, { text: 'epics', speed: 90, gap: 3, color: '#5cc8ff' }] });
    route(ROUTES.spiceW.pts, { type: 'sea', dur: 2, mover: [{ text: 'textiles', speed: 80, color: '#5cc8ff' }] });
  },
  notes: {
    tp: 'Ideas moved with goods. This is the key to understanding the cultural links in every country story that follows.',
    q: 'If a merchant brought spices to Java 2,000 years ago, what else might he have brought with him?',
    mis: 'That culture spread mainly by conquest. The chapter stresses India spread her traditions peacefully, through trade, pilgrimage and culture.',
    s20: 'Routes carried goods, but also stories, festivals, scripts and faiths. That is why we find Indian epics and Buddhist monuments far beyond India.',
  },
});

/* ---------------- EXPLORER: central navigation map ---------------- */
const FACTS = {
  PAK: { go: 'pak', k: 'land', f: ['Border runs along Gujarat, Rajasthan, Punjab, Jammu and Kashmir, and Ladakh', 'Part of India before the 1947 Partition', 'Kartarpur Corridor (2019): visa-free pilgrimage to a holy Sikh shrine'] },
  AFG: { go: 'afg', k: 'land', f: ['Landlocked; once shared a direct land border with India', 'The ancient Uttarāpatha linked the Ganga plains to Central Asia through it', 'India built the Afghan Parliament building and the Zaranj–Delaram highway'] },
  CHN: { go: 'china', k: 'land', f: ['Separated from India by the Himalayas', 'Buddhism reached China around the 1st century CE', 'Monks Faxian and Xuanzang came to India’s centres of learning'] },
  NPL: { go: 'nepal', k: 'land', f: ['Open border: no passport or visa needed', '1950 Treaty of Peace and Friendship', 'Shared festivals: Daśhain, Tihar, Holi; Paśhupatinātha temple'] },
  BTN: { go: 'bhutan', k: 'land', f: ['‘Land of the Thunder Dragon’ (Drukyul)', 'Rivers from Bhutan → hydroelectric power shared with India', 'Guru Padmasambhava brought Vajrayāna Buddhism (8th century CE)'] },
  BGD: { go: 'bgd', k: 'land', f: ['Shares Bangla language with West Bengal', 'Land border even longer than India’s border with China', 'Shared rivers (Ganga, Brahmaputra) and the Sundarbans'] },
  MMR: { go: 'mmr', k: 'land', f: ['India’s gateway to Southeast Asia', 'Borders Arunachal Pradesh, Nagaland, Manipur and Mizoram', 'India–Myanmar–Thailand Trilateral Highway'] },
  LKA: { go: 'lka', k: 'sea', f: ['Only about 32 km away across the Palk Strait', 'Buddhism brought by Mahendra and Sanghamitrā (3rd century BCE)', 'Close Tamil cultural ties'] },
  MDV: { go: 'mdv', k: 'sea', f: ['Over 1,100 islets, about 130 km from Minicoy', 'India helped in the 2004 tsunami, 2014 water crisis and COVID-19', 'Rising seas could reach 1 m by 2100'] },
  IRN: { go: 'iran', k: 'sea', f: ['Ties since the Bronze Age, via land routes and the Silk Route', 'Persian belongs to the same language family as Sanskrit', 'Chabahar Port: access to Afghanistan and Central Asia'] },
  OMN: { go: 'oman', k: 'sea', f: ['Copper trade with Harappan cities over 5,000 years ago', 'Over 10% of Oman’s population is of Indian origin', 'India’s closest defence partner in the Gulf'] },
  THA: { go: 'thai', k: 'sea', f: ['Dvārakā → Dvāravatī; Ayodhyā → Ayutthayā', 'Theravāda Buddhism widely practised', 'Linked by the Trilateral Highway'] },
  MYS: { go: 'mys', k: 'sea', f: ['Linked by sea routes for over 2,000 years', 'Adopted a script based on India’s Brāhmī (around 4th century CE)', '9% of the population is of Indian origin'] },
  SGP: { go: 'sgp', k: 'sea', f: ['Name from ‘Singapuram’, the lion city', 'Tamil is one of four official languages', 'One of the largest foreign investors in India'] },
  IDN: { go: 'idn', k: 'sea', f: ['An archipelago: several large islands and over 17,000 smaller ones', 'Borobudur, the world’s largest Buddhist monument', 'Together built tsunami early warning after 2004'] },
};
S({
  id: 'explore', title: 'Explorer map: click a neighbour', sec: 'Explorer map', num: '◎', view: ['wide', 'r'], mapCls: 'clickable', cls: 'see-through',
  countries: neighbourSpec(), base: 'dimmed',
  html: `<div class="panel glass" style="width:740px;top:80px" id="exCard">
    <div class="kicker">Explorer map</div>
    <h2 style="font-size:60px">Click any neighbour</h2>
    <p class="lead" style="font-size:28px">This map is your home screen. Tap a country to zoom in, see three key facts, then open its full story. Press the <b>Map</b> button any time to come back here.</p>
    <div class="legend" style="position:static;margin-top:26px;display:flex;gap:28px;background:none;border:0;padding:0">
      <div><svg viewBox="0 0 60 14"><rect width="60" height="14" rx="4" fill="#1f6e66" stroke="#9ff5dc"/></svg>Land neighbour</div>
      <div><svg viewBox="0 0 60 14"><rect width="60" height="14" rx="4" fill="#1f5d97" stroke="#a8ddff"/></svg>Maritime neighbour</div>
    </div>
    <div class="chips" style="margin-top:24px" id="exChips"></div>
  </div>`,
  init(el) {
    const chips = $('#exChips', el);
    Object.keys(FACTS).forEach(k => { const b = html(`<button class="chip ${FACTS[k].k === 'sea' ? 's' : 'l'}">${NAMES[k]}</button>`); b.onclick = () => this.pick(k); chips.appendChild(b); });
    $('#countries').addEventListener('click', e => { if (SLIDES[cur] !== this) return; const c = e.target.dataset && e.target.dataset.c; if (FACTS[c]) this.pick(c); });
  },
  pick(k) {
    const F = FACTS[k]; clearFX();
    $$('#countries .c').forEach(p => { const c = p.dataset.c; p.classList.toggle('pick', !!FACTS[c]); });
    countries(Object.assign(neighbourSpec(), { [k]: (F.k === 'sea' ? 'seaN ' : 'landN ') + 'focus keep' }), 'dimmed');
    $$('#countries .c').forEach(p => { if (FACTS[p.dataset.c]) p.classList.add('pick'); });
    const box = { PAK: 'pak', AFG: 'afg', CHN: 'china', NPL: 'nepal', BTN: 'bhutan', BGD: 'bgd', MMR: 'mmr', LKA: 'lka', MDV: 'mdv', IRN: 'iran', OMN: 'oman', THA: 'thai', MYS: 'mys', SGP: 'sgp', IDN: 'idn' }[k];
    setView(box, 'r', 1300);
    label(k, null, F.k === 'sea' ? 'sea' : ''); label('IND', 'India', 'india');
    if (k === 'MDV') atolls();
    if (SEA[k]) seaLink(k, { mover: { kind: 'ship', speed: 70 } }); else landLink(k, { mover: { kind: 'dot', speed: 120 } });
    $('#exCard').innerHTML = `<div class="kicker">${F.k === 'sea' ? 'Maritime neighbour' : 'Land neighbour'}</div><h2 style="font-size:66px">${NAMES[k]}</h2>
      <ul class="pts">${F.f.map((t, i) => `<li style="animation:fadeUp .6s ${.2 + i * .2}s both">${t}</li>`).join('')}</ul>
      <div style="display:flex;gap:14px;margin-top:30px"><button class="btn" id="exGo">Open the full story →</button><button class="btn ghost" id="exBack">All neighbours</button></div>`;
    $('#exGo').onclick = () => goId(F.go);
    $('#exBack').onclick = () => { const s = SLIDES[cur]; s.el.remove(); s.el = html(`<section class="slide on see-through" data-i="${cur}">${s.html}</section>`); $('#slides').appendChild(s.el); s.init(s.el); s.enter(); countries(s.countries, s.base); setView('wide', 'r', 1300); $$('#countries .c').forEach(p => { if (FACTS[p.dataset.c]) p.classList.add('pick'); }); };
  },
  enter() {
    $$('#countries .c').forEach(p => { if (FACTS[p.dataset.c]) p.classList.add('pick'); });
    labels([...LAND_N, ...SEA_N], 'sm', .2, .05); label('IND', 'India', 'india'); atolls(.4);
  },
  notes: {
    tp: 'This is the central navigation. Let students choose the order of the journey, or follow the screens in sequence.',
    q: 'Which neighbour do you know the least about? Let’s visit it first.',
    mis: 'That small countries on the map are unimportant. The Maldives is tiny but sits on key sea routes.',
    s20: 'Green countries share a land border with India; blue ones are maritime neighbours. Click any of them to see how it is connected to India.',
  },
});

/* ===================== LAND-BASED NEIGHBOURS ===================== */
const focusSpec = (code, kind = 'landN', extra = {}) => Object.assign({ IND: 'india keep', [code]: kind + ' focus keep' }, extra);
function statePins(list, del = 0) { list.forEach((s, i) => pin(s[0], s[1], s[2], 'tag ' + (s[3] || ''), del + i * .25)); }

/* ---------- CHINA ---------- */
S({
  id: 'china', title: 'India & China: the Himalayas', sec: 'Land neighbours · China', num: '06', view: ['china', 'r'],
  countries: focusSpec('CHN'), base: 'dimmed',
  html: `<div class="bg himal" style="background-image:url(${IMG.himalaya});transition:opacity 1.6s ease, transform 9s linear"></div>
  <div class="center himalT" style="transition:opacity 1s"><div class="kicker" data-in><b>06</b> India &amp; China</div><h1 data-in style="--d:.3;font-size:140px;text-shadow:0 8px 40px #000">The Himalayas</h1><p class="lead" data-in style="--d:.7;text-shadow:0 2px 12px #000;color:#fff">A wall of mountains between two of Asia’s largest nations</p></div>
  <span class="credit himalC">${credit('himalaya')}</span>
  <div class="panel glass chinaP" style="width:760px;opacity:0;transition:opacity 1s">
    <div class="kicker">India and her largest neighbour</div>
    <h2 style="font-size:60px">Separated by the Himalayas</h2>
    <ul class="pts">
      <li>Since 1950, a long and strategic relationship shaped by <b>history, geography, culture, trade and politics</b>.</li>
      <li>The border runs (east to west) across <b>Arunachal Pradesh, Sikkim, Uttarakhand, Himachal Pradesh</b> and the UT of <b>Ladakh</b>.</li>
      <li>China is about <b>three times larger</b> than India in area.</li>
    </ul>
    <div class="chips"><span class="chip">Geography</span><span class="chip">Culture</span><span class="chip">Trade</span><span class="chip">Politics</span></div>
  </div>`,
  enter(el, c) {
    const bg = $('.himal', el), t = $('.himalT', el), p = $('.chinaP', el), cr = $('.himalC', el);
    bg.style.opacity = 1; t.style.opacity = 1; p.style.opacity = 0; cr.style.opacity = 1;
    c.after(3.6, () => {
      bg.style.opacity = 0; t.style.opacity = 0; cr.style.opacity = 0; p.style.opacity = 1;
      label('CHN', 'China'); label('IND', 'India', 'india');
      statePins([[94.6, 28.2, 'Arunachal Pradesh'], [88.5, 27.6, 'Sikkim', 'left'], [79.3, 30.4, 'Uttarakhand', 'left'], [77.2, 31.9, 'Himachal Pradesh', 'left'], [77.6, 34.4, 'Ladakh', 'left']], .3);
      label([90, 31.3], 'TIBET', 'sm', .4); label([85, 29.6], '▲ ▲ H I M A L A Y A S ▲ ▲', 'sm', .2);
    });
  },
  leave(el) { $('.himal', el).style.opacity = 1; },
  notes: {
    tp: 'Geography first: the Himalayas separate India and China, and the border touches five Indian states/UTs.',
    q: 'How might high mountains affect trade and travel between two countries?',
    mis: 'That mountains stopped all contact. Monks and traders crossed them for centuries.',
    s20: 'India and China are separated by the Himalayas. Their border runs across Arunachal Pradesh, Sikkim, Uttarakhand, Himachal Pradesh and Ladakh. China is about three times larger than India.',
  },
});

S({
  id: 'china2', title: 'India & China: Buddhism and pilgrims', sec: 'Land neighbours · China', num: '06', view: [[72, 14, 122, 42], 'r'],
  countries: focusSpec('CHN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:70px">
    <div class="kicker">A bridge of ideas</div>
    <h2 style="font-size:58px">Buddhism: a powerful link</h2>
    <p class="lead" style="font-size:27px">Originating in India, Buddhism reached China around the <b>1st century CE</b> via trade and pilgrimage routes.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px">
      <div class="card" data-in style="--d:.5;padding:20px 24px"><span class="lab">To India →</span><h4 style="font-size:28px">Faxian · Xuanzang</h4><p style="font-size:22px">Chinese monks who travelled to Indian centres of learning</p></div>
      <div class="card" data-in style="--d:.7;padding:20px 24px"><span class="lab">← To China</span><h4 style="font-size:28px">Bodhidharma · Dharmakṣhema · Kumārajīva</h4><p style="font-size:22px">Indian monks who carried Buddhist teachings to China</p></div>
    </div>
    <div class="card" data-in style="--d:.9;margin-top:16px;padding:20px 24px;border-color:rgba(92,200,255,.5)"><span class="lab" style="color:var(--sea)">13th century · Quanzhou</span><p style="font-size:23px">Hindu merchants built temples in this Chinese port city. Pillars at the <b>Kaiyuan temple</b> show Viṣhṇu, Śhiva and stories from the Rāmāyaṇa and the Purāṇas (e.g. ‘Gajendra mokṣham’).</p></div>
  </div>`,
  enter() {
    const path = [[85.0, 25.1], [80.6, 26.2], [77.7, 28.4], [74.6, 31.3], [72.83, 33.75], [74.3, 36.2], [75.99, 39.47], [82, 40.5], [88, 41.5], [94.66, 40.14], [103.8, 36.06], [108.94, 34.34], [112.45, 34.62]];
    route(path, { type: 'culture', dur: 2.6, mover: [{ text: 'Buddhism → China', speed: 120 }, { text: 'Kumārajīva', speed: 120, gap: 3.5 }, { text: 'Faxian → India', speed: 120, back: true, gap: 2, color: '#bfe8ff' }, { text: 'Xuanzang → India', speed: 120, back: true, gap: 6, color: '#bfe8ff' }] });
    route([[87.9, 21.4], [91, 15], [96, 7], [100.1, 4.5], [104.4, 1.4], [107, 7], [110, 12], [113, 18], [116, 22.4], [118.6, 24.85]], { type: 'sea', del: 1.2, dur: 2.4, mover: { kind: 'ship', speed: 100 } });
    pin(85.44, 25.13, 'Nālandā', 'city left', .6); pin(112.45, 34.62, 'Luoyang', 'city left', 1.6); pin(118.59, 24.9, 'Quanzhou', 'city left', 2.2);
    label('CHN', 'China', '', .3);
  },
  notes: {
    tp: 'Culture crossed the mountains. Buddhism linked India and China through monks travelling in both directions.',
    q: 'Why would a monk walk for years across mountains and deserts to reach Nālandā?',
    mis: 'That ideas only travelled one way. Chinese monks came to learn in India, and Indian monks taught in China.',
    s20: 'Buddhism reached China around the 1st century CE. Faxian and Xuanzang came to study in India, while Bodhidharma, Dharmakṣhema and Kumārajīva carried teachings to China. Hindu merchants even built temples in Quanzhou.',
  },
});

S({
  id: 'china3', title: 'India & China: trade and politics today', sec: 'Land neighbours · China', num: '06', view: [[74, 4, 124, 40], 'r'],
  countries: focusSpec('CHN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:800px;top:70px">
    <div class="kicker">Modern relationship</div>
    <h2 style="font-size:56px">Trade continues, but it is unbalanced</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <div class="card" style="padding:20px 24px"><span class="lab">India exports</span><p style="font-size:23px;color:#fff">Iron ore · chemicals · cotton yarn</p></div>
      <div class="card" style="padding:20px 24px"><span class="lab">India imports</span><p style="font-size:23px;color:#fff">Electronics (mobile phones, computer hardware) · industrial equipment</p></div>
    </div>
    <div style="margin-top:26px">
      <div class="small" style="margin-bottom:8px">Value of trade, 2024–2025 (shape of the balance)</div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:10px"><span style="width:200px;font-size:21px">India → China</span><div class="tbar" style="height:30px;width:0;background:var(--saffron);border-radius:6px;transition:width 1.2s var(--ease) .4s" data-w="70"></div><b style="font-size:24px">1×</b></div>
      <div style="display:flex;align-items:center;gap:14px"><span style="width:200px;font-size:21px">China → India</span><div class="tbar" style="height:30px;width:0;background:#e06a6a;border-radius:6px;transition:width 2s var(--ease) .8s" data-w="560"></div><b style="font-size:24px">≈8×</b></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px">
      <div class="card" style="padding:18px 22px;border-color:rgba(255,93,108,.5)"><span class="lab" style="color:#ff8f9a">Tensions</span><p style="font-size:22px">Phases of heightened tension, mostly about the shared border, and a few serious conflicts.</p></div>
      <div class="card" style="padding:18px 22px;border-color:rgba(111,224,192,.5)"><span class="lab" style="color:var(--land)">Efforts</span><p style="font-size:22px">Resolving disputes through trade, dialogue and border-resolution mechanisms.</p></div>
    </div>
  </div>`,
  enter(el, c) {
    c.after(.1, () => $$('.tbar', el).forEach(b => b.style.width = b.dataset.w + 'px'));
    const sea = [[118.6, 24.6], [114.5, 21], [111, 15.5], [108, 9], [104.6, 1.6], [100.1, 4.5], [96, 7], [91, 14], [88, 20.6]];
    route(sea, { type: 'trade', dur: 2, mover: Array.from({ length: 8 }, (_, i) => ({ kind: 'ship', speed: 120, gap: .55 })) });
    route(sea.slice().reverse().map(([a, b]) => [a + .8, b - 1.2]), { type: 'trade', dur: 2, del: .3, color: '#f08a24', mover: { kind: 'ship', speed: 120 } });
    label('CHN', 'China'); label('IND', 'India', 'india');
  },
  notes: {
    tp: 'Today’s relationship mixes trade, economic ties and tension. The textbook keeps it balanced: tensions exist, and so do efforts to resolve them.',
    q: 'What does it mean when one country sells much more to another than it buys?',
    mis: 'That countries with tensions stop trading. India and China still trade a great deal.',
    s20: 'India sells iron ore, chemicals and cotton yarn to China and buys electronics and machinery. China’s exports to India are worth about eight times India’s exports to China. There have been border tensions, but both sides use trade, dialogue and border mechanisms to resolve disputes.',
  },
});

/* ---------- PAKISTAN ---------- */
S({
  id: 'pak', title: 'India & Pakistan: a shared past, a divided history', sec: 'Land neighbours · Pakistan', num: '07', view: ['pak', 'r'],
  countries: { IND: 'pre47 keep', PAK: 'pre47 keep', BGD: 'pre47 keep' }, base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:70px">
    <div class="kicker"><b>07</b> India &amp; Pakistan</div>
    <h2 style="font-size:58px">One land, then a border</h2>
    <div style="display:flex;gap:12px;margin:6px 0 18px"><button class="btn ghost sm on" id="b47a">Before 1947</button><button class="btn ghost sm" id="b47b">After the Partition</button></div>
    <p class="lead" style="font-size:27px">Before the <b>1947 Partition</b>, a legacy of the colonial era, Pakistan was a part of India. Pakistan was founded on a religious basis, unlike India.</p>
    <p class="lead" style="font-size:27px;margin-top:14px">The border runs along <b>Gujarat, Rajasthan, Punjab</b>, and the UTs of <b>Jammu and Kashmir</b> and <b>Ladakh</b>. It is a symbol of <em class="t">shared heritage</em> and of a <em class="t">tragically divided history</em>.</p>
    <div style="margin-top:22px"><div class="small" style="margin-bottom:10px">Conflicts named in the textbook</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap" class="tl">${['1948', '1965', '1971', '1999 · Kargil'].map(y => `<span class="chip" style="border-color:rgba(255,93,108,.5)">${y}</span>`).join('')}</div>
      <p class="small" style="margin-top:12px">Frequent terrorist attacks against India, supported by the Pakistan army, have prevented normal relations. There have also been attempts at peace: periods of trade and pilgrimage routes.</p></div>
  </div>`,
  init(el) { $('#b47a', el).onclick = () => this.state(0); $('#b47b', el).onclick = () => this.state(1); },
  state(k) {
    $('#b47a', this.el).classList.toggle('on', !k); $('#b47b', this.el).classList.toggle('on', !!k);
    clearFX();
    if (!k) { countries({ IND: 'pre47 keep', PAK: 'pre47 keep', BGD: 'pre47 keep' }, 'dimmed'); label([75, 24], 'INDIA before 1947', 'india'); }
    else {
      countries(focusSpec('PAK'), 'dimmed'); label('PAK', 'Pakistan'); label('IND', 'India', 'india');
      route([[68.2, 23.7], [69.6, 24.3], [70.3, 25.7], [70.1, 27.5], [71.9, 27.95], [73.4, 29.95], [74.5, 30.9], [74.6, 31.9], [75.3, 32.5]], { type: 'border', dur: 2 });
      statePins([[71.0, 23.2, 'Gujarat'], [72.0, 26.6, 'Rajasthan'], [75.4, 30.8, 'Punjab'], [75.2, 33.6, 'Jammu and Kashmir'], [77.6, 34.6, 'Ladakh']], .6);
    }
  },
  enter(el, c) { this.state(0); c.after(3.4, () => this.state(1)); },
  notes: {
    tp: 'Treat with maturity: shared heritage, the Partition, a complex relationship. Stick to what the textbook states.',
    q: 'Why does the textbook call the border both “a symbol of shared heritage” and “a tragically divided history”?',
    mis: 'That the people on both sides have nothing in common. Languages, food, music and festivals are shared.',
    s20: 'Before 1947, Pakistan was part of India. Since the Partition there have been wars in 1948, 1965 and 1971 and the Kargil War in 1999, and terrorism has prevented normal relations. Yet there have also been attempts at peace.',
  },
});

S({
  id: 'pak2', title: 'What still crosses the border', sec: 'Land neighbours · Pakistan', num: '07', view: [[60, 22, 80, 36], 'r'],
  countries: focusSpec('PAK'), base: 'dimmed',
  html: `<div class="panel" style="width:780px;top:120px">
    <div class="kicker">Shared culture</div>
    <h2 style="font-size:62px">Culture still bridges the border</h2>
    <p class="lead" style="font-size:28px">Languages, cuisines, music and festivals continue to bridge the border, and pilgrims visit shrines of a shared past.</p>
    ${chain(['Food', 'Music', 'Language', 'Festivals', 'Pilgrimage'])}
    <div class="cards" style="grid-template-columns:1fr 1fr;margin-top:28px;gap:16px">
      <div class="card" style="padding:20px 24px"><span class="lab">Katas Raj temples</span><p style="font-size:22px">In Pakistan’s Punjab; linked to the Mahābhārata, with a sacred pond</p></div>
      <div class="card" style="padding:20px 24px"><span class="lab">Hinglaj Mata Mandir</span><p style="font-size:22px">An ancient Hindu shrine in Balochistan</p></div>
    </div>
    <p class="small" style="margin-top:16px">Several ancient Hindu, Buddhist and Sikh shrines lie across the border.</p>
  </div>`,
  enter(el, c) {
    playChain(el, .9, .3);
    label('PAK', 'Pakistan', '', 0); label([76.5, 27], 'India', 'india');
    route([[75.3, 32.5], [74.6, 31.9], [74.5, 30.9], [73.4, 29.95], [71.9, 27.95], [70.1, 27.5], [70.3, 25.7], [69.6, 24.3], [68.2, 23.7]], { type: 'border', dur: 1.4 });
    ['food', 'music', 'language', 'festivals', 'pilgrims'].forEach((t, i) => route([[77.2 - i * .4, 28.6 + i * .9 - 1.6], [72.5 - i * .5, 31.5 - i * .9]], { type: 'culture', bulge: .2, del: .5 + i * .45, dur: 1, cls: 'thin', mover: { text: t, speed: 60 } }));
    pin(72.95, 32.72, 'Katas Raj', 'left', 2.2); pin(65.52, 25.51, 'Hinglaj Mata Mandir', '', 2.4); pin(75.03, 32.08, 'Kartarpur', '', 2.6);
  },
  notes: {
    tp: 'Show that culture and faith cross political lines. Shared places of pilgrimage keep the past alive.',
    q: 'Name one food, festival or song that people in both India and Pakistan enjoy.',
    mis: 'That borders stop culture. Language, music and cuisine remain shared.',
    s20: 'Even with a difficult relationship, culture crosses the border: languages, food, music and festivals. Shrines like Katas Raj and Hinglaj Mata Mandir are landmarks of a shared past.',
  },
});

S({
  id: 'kartarpur', title: 'The Kartarpur Corridor', sec: 'Land neighbours · Pakistan', num: '07', map: 'hide',
  html: `${photo('kartarpur', 'left:1000px;top:70px;width:840px;height:420px', 'Gurdwara Darbar Sahib, Kartarpur (Pakistan)')}
  <div class="panel" style="width:820px;top:90px">
    <div class="kicker" data-in>People-to-people connection</div>
    <h2 data-in style="--d:.1;font-size:64px">The Kartarpur Corridor</h2><style>.kp li{font-size:27px}</style>
    <ul class="pts kp" style="margin-top:6px;gap:12px">
      <li data-in style="--d:.3">A <b>visa-free</b> crossing: Indian pilgrims need only a <b>permit</b> to visit Gurdwara Darbar Sahib in Kartarpur, Pakistan.</li>
      <li data-in style="--d:.45">It is the final resting place of <b>Guru Nānak Dev</b>, the founder of Sikhism, who spent the last 18 years of his life there.</li>
      <li data-in style="--d:.6">Proposed in the 1990s; opened in <b>2019</b> for Guru Nānak’s <b>550th birth anniversary</b>.</li>
    </ul>
  </div>
  <svg viewBox="0 0 1760 330" style="position:absolute;left:80px;bottom:100px;width:1760px;height:300px" aria-label="Before 2019 pilgrims looked through binoculars; after 2019 they walk across through the corridor">
    <rect x="0" y="230" width="1760" height="100" rx="20" fill="#13301f"/>
    <line x1="880" y1="40" x2="880" y2="330" stroke="#ff6b6b" stroke-width="5" stroke-dasharray="14 10"/>
    <text x="880" y="28" fill="#ffb3b3" font-size="26" text-anchor="middle" font-family="sans-serif" font-weight="700">BORDER</text>
    <text x="300" y="300" fill="#fff" font-size="28" text-anchor="middle" font-family="sans-serif">Dera Baba Nanak, Punjab (India)</text>
    <text x="1460" y="300" fill="#fff" font-size="28" text-anchor="middle" font-family="sans-serif">Kartarpur (Pakistan)</text>
    <g transform="translate(1400,110)"><rect x="0" y="40" width="120" height="80" fill="#f4f1ea"/><path d="M20,40 Q60,-20 100,40Z" fill="#f4f1ea"/><circle cx="60" cy="0" r="7" fill="#f2b544"/></g>
    <g class="bino"><circle cx="440" cy="150" r="46" fill="none" stroke="#f2b544" stroke-width="7"/><circle cx="530" cy="150" r="46" fill="none" stroke="#f2b544" stroke-width="7"/><rect x="474" y="140" width="22" height="18" fill="#f2b544"/>
      <text x="485" y="70" fill="#ffd98a" font-size="25" text-anchor="middle" font-family="sans-serif">Before 2019: seen only through binoculars</text></g>
    <path class="corr" d="M560,232 C 800,180 1100,180 1390,232" fill="none" stroke="#6fe0c0" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 1" pathLength="1" stroke-dashoffset="1"/>
    <g class="walkers"></g>
    <g class="tick" opacity="0"><text x="880" y="130" fill="#9ff0c6" font-size="30" text-anchor="middle" font-family="sans-serif" font-weight="700">2019: Visa ✗ · Permit ✓</text></g>
  </svg>
  <button class="btn" id="kOpen" style="position:absolute;left:90px;top:585px">▶ Open the corridor (2019)</button>
  ${bigQ('Can the Kartarpur Corridor be a model for the possible progress of peace and dialogue?', 'There is no single right answer; this is the textbook’s own discussion question. It shows that even when relations are difficult, a carefully managed opening can let ordinary people connect through faith and shared heritage.', '').replace('class="bq ', 'style="position:absolute;left:1000px;top:510px;width:840px;margin:0;padding:18px 24px;--d:.8" class="bq ')}`,
  init(el) { $('#kOpen', el).onclick = () => this.open(); },
  open() {
    const el = this.el, c = $('.corr', el);
    c.style.transition = 'stroke-dashoffset 2s ease'; c.style.strokeDashoffset = 0;
    $('.bino', el).style.transition = 'opacity .8s'; $('.bino', el).style.opacity = .25; $('.tick', el).setAttribute('opacity', 1);
    const w = $('.walkers', el); w.innerHTML = '';
    for (let i = 0; i < 9; i++) { const g = svgEl('g', {}, w); g.innerHTML = '<circle r="9" cy="-26" fill="#ffd98a"/><rect x="-8" y="-17" width="16" height="26" rx="6" fill="#f08a24"/>'; g.style.offsetPath = `path('M560,232 C 800,180 1100,180 1390,232')`; g.style.animation = `walk 7s linear ${i * .8 + 1.2}s infinite`; g.style.offsetDistance = '0%'; g.style.opacity = 0; }
  },
  enter() { const el = this.el; const c = $('.corr', el); c.style.transition = 'none'; c.style.strokeDashoffset = 1; $('.bino', el).style.opacity = 1; $('.tick', el).setAttribute('opacity', 0); $('.walkers', el).innerHTML = ''; },
  notes: {
    tp: 'The corridor is a concrete example of people-to-people connection between countries with a difficult relationship.',
    q: 'For decades, devotees could only view the gurdwara through binoculars. How do you think they felt when the corridor opened?',
    mis: 'That a visa-free corridor means the border is open. Pilgrims still need a permit; it is a special, managed crossing.',
    s20: 'The Kartarpur Corridor opened in 2019 for Guru Nānak’s 550th birth anniversary. Indian pilgrims can visit Gurdwara Darbar Sahib, where Guru Nānak spent his last 18 years, with only a permit and no visa.',
  },
});

/* ---------- BANGLADESH ---------- */
const GANGA = [[78.9, 30.95], [78.3, 30.0], [78.2, 29.0], [79.6, 27.3], [81.0, 26.0], [81.9, 25.4], [83.0, 25.3], [84.5, 25.6], [85.4, 25.5], [87.2, 25.25], [87.9, 24.9], [88.3, 24.4], [89.0, 24.0], [89.8, 23.5], [90.4, 23.0], [90.7, 22.3]];
const BRAHMA = [[82.2, 30.2], [85, 29.4], [88, 29.25], [91, 29.3], [93.4, 29.4], [94.8, 29.6], [95.3, 28.4], [94.6, 27.5], [93, 26.7], [91.6, 26.2], [90.4, 26.1], [89.8, 25.7], [89.7, 24.9], [89.75, 24.1], [90.2, 23.6], [90.6, 22.9]];
S({
  id: 'bgd', title: 'India & Bangladesh: rivers without borders', sec: 'Land neighbours · Bangladesh', num: '08', view: [[77, 20.5, 97, 31.5], 'r'],
  countries: focusSpec('BGD', 'landN', { NPL: 'ghost', BTN: 'ghost', CHN: 'ghost' }), base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:70px">
    <div class="kicker"><b>08</b> India &amp; Bangladesh · a newborn neighbour</div>
    <h2 style="font-size:58px">Rivers do not understand political borders</h2>
    <ul class="pts" style="gap:14px">
      <li><b>History:</b> Bangladesh (earlier ‘East Pakistan’) was born in <b>1971</b>, after a war between India and Pakistan.</li>
      <li><b>Language:</b> <em class="t">Bangla</em> is common to Bangladesh and India’s West Bengal.</li>
      <li>The land border is <b>even longer than India’s border with China</b>: West Bengal, Assam, Meghalaya, Tripura, Mizoram.</li>
      <li>Shared rivers from the <b>Ganga</b> and the <b>Brahmaputra</b> support farming, fisheries, transport and the livelihoods of millions.</li>
    </ul>
    <div class="chips"><span class="chip s">🌾 Agriculture</span><span class="chip s">🐟 Fisheries</span><span class="chip s">⛴ Transportation</span><span class="chip s">🏡 Livelihoods</span></div>
  </div>
  ${photo('brahmaputra', 'right:60px;bottom:110px;width:420px;height:280px', 'Evening on the Brahmaputra')}`,
  enter(el, c) {
    label('BGD', 'Bangladesh'); label([80.5, 23.2], 'India', 'india');
    route(GANGA, { type: 'river', dur: 4, del: .2, mover: [{ text: 'Ganga', speed: 90, color: '#9fdcff', loop: false }] });
    route(BRAHMA, { type: 'river', dur: 4, del: .6, mover: [{ text: 'Brahmaputra', speed: 90, color: '#9fdcff', loop: false }] });
    pin(88.95, 24.05, 'crosses the border', 'pulse tag', 3.6); pin(89.86, 25.6, 'crosses the border', 'pulse tag left', 4.1);
    statePins([[87.9, 22.5, 'West Bengal', 'left'], [92.8, 26.2, 'Assam'], [91.3, 25.6, 'Meghalaya'], [91.8, 23.6, 'Tripura'], [92.8, 23.2, 'Mizoram']], 4.6);
  },
  notes: {
    tp: 'Rivers rise in one country and flow through another. Shared rivers make cooperation essential.',
    q: 'Why might rivers create cooperation between countries? What would happen downstream if a river were blocked upstream?',
    mis: 'That a river belongs to the country where it starts. Millions downstream depend on the same water.',
    s20: 'India and Bangladesh share history, the Bangla language and a very long border. The Ganga and Brahmaputra flow across that border, supporting farming, fishing and transport on both sides. Rivers do not stop at borders, so neighbours must cooperate.',
  },
});

S({
  id: 'sundarbans', title: 'The Sundarbans: a shared forest', sec: 'Land neighbours · Bangladesh', num: '08', map: 'hide',
  html: `<svg class="sund" viewBox="0 0 1920 1080" style="position:absolute;inset:0" aria-label="Mangrove forest with a tiger, acting as a barrier against a cyclone's waves">
    <defs><linearGradient id="skyS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2f55"/><stop offset="1" stop-color="#5b6f8a"/></linearGradient>
    <linearGradient id="watS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c6a86"/><stop offset="1" stop-color="#0b2a3c"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="url(#skyS)"/>
    <g class="cyc" style="transform-origin:1650px 230px"><circle cx="1650" cy="230" r="150" fill="none" stroke="#c9d6ea" stroke-width="22" stroke-dasharray="120 60" opacity=".55"/><circle cx="1650" cy="230" r="80" fill="none" stroke="#e6eef9" stroke-width="16" stroke-dasharray="70 40" opacity=".6"/><circle cx="1650" cy="230" r="18" fill="#e6eef9" opacity=".7"/></g>
    <rect y="760" width="1920" height="320" fill="url(#watS)"/>
    <g class="waves">${Array.from({ length: 7 }, (_, i) => `<path d="M${1920 - i * 40},${770 + i * 40} q-40,-40 -80,0 t-80,0 t-80,0" fill="none" stroke="#d4ecff" stroke-width="6" opacity=".7"/>`).join('')}</g>
    <g class="mang">${Array.from({ length: 22 }, (_, i) => { const x = 40 + i * 58 + (i % 3) * 9, h = 150 + (i * 37) % 90; return `<g transform="translate(${x},${800 - h})"><path d="M0,${h} L0,30 M0,${h - 40} L-26,${h + 10} M0,${h - 50} L24,${h + 10} M0,${h - 25} L-12,${h + 14} M0,${h - 25} L12,${h + 14}" stroke="#3d2a17" stroke-width="6" fill="none"/><ellipse cx="0" cy="30" rx="${46 + (i % 4) * 6}" ry="${40 + (i % 3) * 6}" fill="${i % 2 ? '#1f5b34' : '#277043'}"/></g>`; }).join('')}</g>
    <g transform="translate(1180,735) scale(1.3)"><path d="M0,0 q30,-36 90,-30 q40,4 70,-10 q14,-6 22,6 q-6,14 -24,16 q-10,30 -40,40 l-6,30 h-12 l2,-28 q-40,6 -64,-4 l-10,32 h-12 l4,-38 q-24,-6 -20,-14z" fill="#e0892f"/><path d="M30,-24 l6,30 M60,-30 l2,32 M92,-24 l-2,30" stroke="#2a1606" stroke-width="5"/></g>
  </svg>
  <div class="panel glass" style="width:780px;top:70px">
    <div class="kicker" data-in>A shared maritime environment</div>
    <h2 data-in style="--d:.1;font-size:60px">The Sundarbans</h2>
    <ul class="pts" style="gap:12px">
      <li data-in style="--d:.3">The <b>largest mangrove forest</b> in the world, a <b>UNESCO World Heritage Site</b></li>
      <li data-in style="--d:.45">About <b>two-thirds</b> lies in Bangladesh and the rest in India; its protection is <b>coordinated by both</b></li>
      <li data-in style="--d:.6">Home to the <b>Bengal tiger</b>; vital for biodiversity and a <b>barrier to cyclones</b></li>
      <li data-in style="--d:.75">With global warming, experts predict <b>rising sea levels</b> and <b>more intense cyclones</b> for Bangladesh</li>
    </ul>
    <div data-in style="--d:.9;margin-top:22px"><div class="small">Share of the forest</div><div style="display:flex;height:34px;border-radius:8px;overflow:hidden;margin-top:8px;font:700 19px var(--sans)"><div style="flex:2;background:#2f8f5a;display:grid;place-items:center">Bangladesh ⅔</div><div style="flex:1;background:#e09a3a;display:grid;place-items:center;color:#2a1606">India ⅓</div></div></div>
  </div>
  <div style="position:absolute;right:90px;bottom:120px;display:flex;gap:12px"><button class="btn" id="sStorm">Send a cyclone</button></div>`,
  init(el) { $('#sStorm', el).onclick = () => this.storm(); },
  storm() {
    const w = $('.waves', this.el), c = $('.cyc', this.el);
    c.animate([{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(-700px) rotate(-540deg)' }], { duration: 4200, easing: 'ease-in', fill: 'forwards' });
    w.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-520px)', opacity: 1, offset: .7 }, { transform: 'translateX(-600px)', opacity: .1 }], { duration: 4200, easing: 'ease-in-out', fill: 'forwards' });
    ctx.after(4.4, () => { $('.sbar', this.el) || this.el.appendChild(html('<div class="sbar pin on tag" style="position:absolute;transform:none;left:980px;top:600px"><span style="font-size:28px">The mangroves slow the waves: a living barrier</span></div>')); });
  },
  enter() { const s = $('.sbar', this.el); if (s) s.remove(); $('.waves', this.el).getAnimations().forEach(a => a.cancel()); $('.cyc', this.el).getAnimations().forEach(a => a.cancel()); },
  notes: {
    tp: 'A shared ecosystem needs shared protection. The Sundarbans protects both countries from cyclones.',
    q: 'If one country cut down its part of the mangroves, who would be affected?',
    mis: 'That climate change affects only the country that causes it. Rising seas affect everyone on the coast.',
    s20: 'The Sundarbans is the world’s largest mangrove forest: two-thirds in Bangladesh, one-third in India. It shelters the Bengal tiger and acts as a barrier to cyclones. Both countries coordinate its protection.',
  },
});

/* ---------- NEPAL ---------- */
S({
  id: 'nepal', title: 'India & Nepal: the open border', sec: 'Land neighbours · Nepal', num: '09', map: 'hide',
  html: `<div class="bg" style="background:linear-gradient(180deg,#0e2244,#1b3b63 55%,#24456a)"></div>
  <svg viewBox="0 0 1920 1080" style="position:absolute;inset:0" aria-label="Open border between India and Nepal with people crossing">
    <path d="M0,520 L180,330 L300,430 L470,230 L620,400 L760,260 L900,410 L1080,200 L1240,380 L1400,250 L1560,420 L1720,300 L1920,450 V700 H0Z" fill="#2b4a74"/>
    <path d="M470,230 L520,290 L500,300 L455,262Z M1080,200 L1140,270 L1110,276 L1060,230Z M1400,250 L1440,300 L1415,306 L1385,272Z" fill="#e8f1ff"/>
    <path d="M0,640 L260,520 L520,600 L800,500 L1100,590 L1400,500 L1700,580 L1920,520 V1080 H0Z" fill="#1e3d2c"/>
    <rect x="0" y="780" width="1920" height="300" fill="#2a4a2c"/>
    <path d="M0,860 H1920" stroke="#8b7b55" stroke-width="40"/>
    <g class="gate"><rect x="945" y="700" width="30" height="190" fill="#c9b27a"/><rect class="barrier" x="975" y="760" width="230" height="16" rx="6" fill="#ff6b6b" style="transform-origin:975px 768px;transition:transform 1s ease"/></g>
    <text x="520" y="1000" fill="#fff" font-size="40" font-family="sans-serif" font-weight="700" text-anchor="middle">INDIA</text>
    <text x="1400" y="1000" fill="#fff" font-size="40" font-family="sans-serif" font-weight="700" text-anchor="middle">NEPAL</text>
    <g class="crowd"></g>
  </svg>
  <div class="panel glass" style="width:820px;top:60px;padding:32px 40px">
    <div class="kicker" data-in><b>09</b> India &amp; Nepal · in the lap of the Himalayas</div>
    <h2 data-in style="--d:.1;font-size:64px">What is an ‘open border’?</h2>
    <p class="lead" data-in style="--d:.25;font-size:28px">People from two countries can cross <b>without a visa or passport</b>. Nepal’s long, open border touches Uttarakhand, Uttar Pradesh, Bihar, West Bengal and Sikkim.</p>
  </div>
  <div class="panel glass" style="left:auto;right:80px;top:70px;width:520px;padding:30px 36px">
    <div class="obl" style="display:grid;gap:12px;font:600 28px var(--sans)">
      <div data-v="0">🛂 Passport <b style="float:right">—</b></div><div data-v="0">📄 Visa <b style="float:right">—</b></div>
      <div data-v="1">🚶 People moving <b style="float:right">—</b></div><div data-v="1">📦 Trade <b style="float:right">—</b></div>
      <div data-v="1">👨‍👩‍👧 Family connections <b style="float:right">—</b></div><div data-v="1">🛕 Pilgrimage <b style="float:right">—</b></div>
    </div>
    <button class="btn" id="nOpen" style="margin-top:22px">Open the border</button>
  </div>
  <div class="note2" style="position:absolute;left:90px;top:490px;width:820px;opacity:0;transition:opacity .8s">
    <div class="card" style="background:rgba(5,13,31,.8)"><span class="lab">Trust, with responsibility</span><p>India and Nepal <b>work together</b> to keep the open border safe and make sure it is not misused. It is a symbol of <b>trust and friendship</b>.</p></div>
  </div>`,
  init(el) { $('#nOpen', el).onclick = () => this.open(); },
  open() {
    const el = this.el;
    $('.barrier', el).style.transform = 'rotate(-80deg)';
    $$('.obl div', el).forEach((d, i) => setTimeout(() => { const ok = d.dataset.v === '1'; d.querySelector('b').textContent = ok ? '✔' : '✘'; d.querySelector('b').style.color = ok ? '#7ef0b6' : '#ff8a96'; }, 300 + i * 250));
    const cr = $('.crowd', el); cr.innerHTML = '';
    const kinds = [['#ffd98a', '#f08a24'], ['#ffe2c0', '#5cc8ff'], ['#ffd2a8', '#b79cff'], ['#ffd98a', '#6fe0c0']];
    for (let i = 0; i < 14; i++) {
      const g = svgEl('g', {}, cr), k = kinds[i % 4], dir = i % 2 ? -1 : 1;
      g.innerHTML = `<circle r="12" cy="-44" fill="${k[0]}"/><rect x="-11" y="-32" width="22" height="38" rx="9" fill="${k[1]}"/>${i % 3 === 0 ? '<rect x="12" y="-26" width="18" height="16" fill="#c9a26a"/>' : ''}`;
      g.style.offsetPath = dir > 0 ? `path('M200,860 L1720,860')` : `path('M1720,850 L200,850')`; g.style.offsetRotate = '0deg';
      g.style.animation = `walk ${9 + (i % 4)}s linear ${i * .7}s infinite`; g.style.opacity = 0;
    }
    $('.note2', el).style.opacity = 1;
  },
  enter() { const el = this.el; $('.barrier', el).style.transform = ''; $('.crowd', el).innerHTML = ''; $('.note2', el).style.opacity = 0; $$('.obl b', el).forEach(b => { b.textContent = '—'; b.style.color = ''; }); },
  notes: {
    tp: 'An open border means no passports or visas, so people move for work, study, trade, family and pilgrimage. It also needs cooperation for security.',
    q: 'How does the open border affect the lives of people living near it?',
    mis: 'That “open” means “no rules”. India and Nepal work together to keep it safe.',
    s20: 'Indians and Nepalis can cross their border without a passport or visa. Families stay connected, students study, workers find jobs and pilgrims visit temples. Both countries cooperate so the open border is not misused.',
  },
});

S({
  id: 'nepal2', title: 'India & Nepal: faith, festivals and trade', sec: 'Land neighbours · Nepal', num: '09', view: ['nepal', 'rr'],
  countries: focusSpec('NPL'), base: 'dimmed',
  html: `${photo('pashupatinath', 'left:80px;top:80px;width:880px;height:480px', 'Paśhupatinātha temple, Kathmandu: Śhiva worshipped as protector of animals')}
  <div class="cards" style="position:absolute;left:80px;top:590px;width:880px;grid-template-columns:1fr 1fr;gap:18px">
    <div class="card" data-in style="--d:.3;padding:20px 24px"><span class="lab">Festivals in both countries</span><p style="font-size:23px;color:#fff">Daśhain (Daśhaharā) · Tihar (Dīpāvalī) · Holi</p></div>
    <div class="card" data-in style="--d:.45;padding:20px 24px"><span class="lab">1950 Treaty of Peace and Friendship</span><p style="font-size:22px">Open borders, free movement of people and goods, cooperation in defence and foreign policy</p></div>
    <div class="card" data-in style="--d:.6;padding:20px 24px"><span class="lab">India → Nepal</span><p style="font-size:22px">India is Nepal’s largest trading partner: petroleum, medicines, food items, manufactured goods</p></div>
    <div class="card" data-in style="--d:.75;padding:20px 24px"><span class="lab">Nepal → India</span><p style="font-size:22px">Agricultural produce, handicrafts and garments</p></div>
  </div>
  <div style="position:absolute;right:70px;bottom:110px;width:780px">${bigQ('What connects India and Nepal besides geography?', 'Faith (pilgrims to Paśhupatinātha and sacred sites in India), shared festivals, family ties across the border, trade, and the 1950 treaty. The relationship is shaped by <b>history, faith, geography and a commitment to regional harmony</b>.')}</div>`,
  enter() {
    label('NPL', 'Nepal', '', .2); label([80.5, 25.6], 'India', 'india', .2);
    route([[81.0, 26.4], [85.32, 27.71]], { type: 'trade', bulge: .2, dur: 1.4, mover: [{ kind: 'truck', speed: 80 }, { kind: 'truck', speed: 80, gap: 2.4 }] });
    route([[85.32, 27.71], [83.0, 25.3]], { type: 'culture', bulge: .25, dur: 1.4, del: .4, mover: { text: 'pilgrims', speed: 70 } });
    pin(85.32, 27.71, 'Kathmandu', 'city', .8);
  },
  notes: {
    tp: 'The India–Nepal bond rests on faith, festivals, family, the 1950 treaty and trade.',
    q: 'Which festivals do people celebrate in both India and Nepal?',
    mis: 'That trade goes only one way. Nepal also exports produce, handicrafts and garments to India.',
    s20: 'Thousands of Indians visit Paśhupatinātha in Kathmandu every year. Daśhain, Tihar and Holi are celebrated in both countries. The 1950 treaty allows free movement, and India is Nepal’s largest trading partner.',
  },
});

/* ---------- BHUTAN ---------- */
S({
  id: 'bhutan', title: 'India & Bhutan: rivers into power', sec: 'Land neighbours · Bhutan', num: '10', map: 'hide',
  html: `${photo('taktsang', 'left:0;top:0;width:1920px;height:1080px;border-radius:0', '')}
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,13,31,.95) 0%,rgba(5,13,31,.85) 45%,rgba(5,13,31,.2) 80%)"></div>
  <div class="panel" style="width:860px;top:80px">
    <div class="kicker" data-in><b>10</b> India &amp; Bhutan</div>
    <h2 data-in style="--d:.1;font-size:66px">‘Land of the Thunder Dragon’</h2>
    <p class="lead" data-in style="--d:.25;font-size:28px">Bhutanese people call their country <b>Drukyul</b>. It is a small, <b>landlocked Himalayan kingdom</b> between India and China, bordering Sikkim, West Bengal, Assam and Arunachal Pradesh.</p>
    <p class="small" data-in style="--d:.35;margin-top:10px">Pictured: ‘Tiger’s Nest’ monastery above the Paro valley, Bhutan.</p>
  </div>
  <svg class="hydro" viewBox="0 0 900 560" style="position:absolute;left:80px;bottom:120px;width:900px;height:560px" aria-label="Mountains, rivers, hydropower, cooperation, development">
    <path d="M0,230 L120,90 L190,170 L290,40 L380,190 L420,230Z" fill="#dfe9f7" opacity=".9"/>
    <path class="river" d="M290,60 C 300,170 220,200 260,260 C 300,320 380,330 470,360" fill="none" stroke="#5cc8ff" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 1" pathLength="1" stroke-dashoffset="1"/>
    <g transform="translate(470,330)"><rect width="90" height="70" rx="6" fill="#c9d3e6"/><rect x="18" y="16" width="54" height="10" fill="#0a1a36"/><text x="45" y="96" fill="#fff" font-size="22" text-anchor="middle" font-family="sans-serif">Dam</text></g>
    <g class="turb" transform="translate(515,365)" opacity=".3"><circle r="22" fill="#f2b544"/><path d="M0,-18 L5,0 L0,18 L-5,0Z" fill="#1b1203"/></g>
    <path class="wire" d="M560,350 L640,300 L720,320 L800,260 L870,280" fill="none" stroke="#f2b544" stroke-width="5" stroke-dasharray="1 1" pathLength="1" stroke-dashoffset="1"/>
    <g class="city" opacity=".2" transform="translate(800,270)"><rect x="0" y="0" width="22" height="50" fill="#ffd98a"/><rect x="28" y="-20" width="26" height="70" fill="#ffd98a"/><rect x="60" y="10" width="20" height="40" fill="#ffd98a"/><text x="40" y="84" fill="#fff" font-size="22" text-anchor="middle" font-family="sans-serif">India</text></g>
    <foreignObject x="0" y="440" width="900" height="120"><div xmlns="http://www.w3.org/1999/xhtml" class="mini">${chain(['Mountains', 'Rivers', 'Hydropower', 'Cooperation', 'Development'])}</div></foreignObject>
  </svg>
  <div class="panel glass" style="left:auto;right:70px;top:430px;width:640px;padding:28px 32px">
    <span class="lab" style="font:600 18px var(--mono);letter-spacing:.2em;color:var(--gold)">HYDROPOWER</span>
    <p style="font-size:25px;line-height:1.4;color:var(--ink2);margin-top:8px">Several important rivers <b style="color:#fff">rise in Bhutan and flow into India</b>. They feed farms and drive <b style="color:#fff">hydroelectric power</b>, one of the most significant areas of cooperation. Power plants such as the <b style="color:#fff">Tala Hydroelectric Project</b> (built with India’s support, dedicated in 2008) help Bhutan’s economy and supply renewable energy to India.</p>
  </div>`,
  enter(el, c) {
    const r = $('.river', el), w = $('.wire', el);
    [r, w].forEach(p => { p.style.transition = 'none'; p.style.strokeDashoffset = 1; });
    $('.turb', el).setAttribute('opacity', .3); $('.city', el).setAttribute('opacity', .2); $('.turb', el).style.animation = '';
    playChain(el, 1.1, .4);
    c.after(1, () => { r.style.transition = 'stroke-dashoffset 1.8s ease'; r.style.strokeDashoffset = 0; });
    c.after(2.6, () => { const t = $('.turb', el); t.setAttribute('opacity', 1); t.animate([{ transform: 'translate(515px,365px) rotate(0)' }, { transform: 'translate(515px,365px) rotate(360deg)' }], { duration: 2400, iterations: Infinity }); });
    c.after(3.2, () => { w.style.transition = 'stroke-dashoffset 1.4s ease'; w.style.strokeDashoffset = 0; });
    c.after(4.4, () => $('.city', el).setAttribute('opacity', 1));
  },
  notes: {
    tp: 'Follow the chain: mountains → rivers → hydropower → cooperation → development.',
    q: 'Why is hydropower good for both Bhutan and India?',
    mis: 'That a small country has little to offer a big one. Bhutan supplies India with clean energy.',
    s20: 'Rivers from Bhutan’s mountains flow into India. Dams such as Tala, built with India’s support, turn that water into electricity: income for Bhutan and renewable energy for India.',
  },
});

S({
  id: 'bhutan2', title: 'India & Bhutan: a shared spiritual heritage', sec: 'Land neighbours · Bhutan', num: '10', view: [[80, 22, 96, 30], 'r'],
  countries: focusSpec('BTN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:800px;top:70px">
    <div class="kicker">Buddhism and happiness</div>
    <h2 style="font-size:56px">The thunderous voice of the Buddha’s teachings</h2>
    <ul class="pts" style="gap:14px">
      <li><b>Guru Padmasambhava</b> (Guru Rinpoche), an Indian Buddhist master, introduced the <b>Vajrayāna</b> school to Bhutan in the <b>8th century CE</b>.</li>
      <li>The <b>dragon</b> on Bhutan’s emblem and flag is said to symbolise ‘the thunderous voice of the Buddha’s teachings’.</li>
      <li>Bhutanese pilgrims visit Bodh Gaya, Rajgir, Nālandā, Udayagiri and Sikkim.</li>
    </ul>
    <div class="card" style="margin-top:22px;border-color:rgba(242,181,68,.5)"><span class="lab">Gross National Happiness</span><p style="font-size:23px">Bhutan measures progress with a <b>Gross National Happiness Index</b>, a more holistic idea than Gross Domestic Product. It includes <b>sustainability, good governance and the promotion of culture</b>.</p></div>
  </div>`,
  enter() {
    label('BTN', 'Bhutan', '', .1); label([83, 24], 'India', 'india', .1);
    const T = [89.64, 27.47];
    [[84.99, 24.7, 'Bodh Gaya', 'left'], [85.42, 25.03, 'Rajgir', 'left'], [85.44, 25.14, 'Nālandā', 'left'], [86.06, 20.47, 'Udayagiri', 'left'], [88.5, 27.4, 'Sikkim', '']]
      .forEach((p, i) => { route([T, [p[0], p[1]]], { type: 'culture', bulge: .18, del: .3 + i * .3, dur: 1.3, cls: 'thin', mover: i === 0 ? { kind: 'dot', speed: 90 } : null }); pin(p[0], p[1], p[2], 'city ' + p[3], .8 + i * .3); });
    pin(T[0], T[1], 'Thimphu', 'city', .3);
  },
  notes: {
    tp: 'Buddhism is the deep cultural link. An Indian teacher shaped Bhutan’s religious identity, and Bhutanese pilgrims visit sites in India.',
    q: 'Bhutan measures “happiness” and not only money. What would you include in a happiness index for your school?',
    mis: 'That Buddhism is only an Indian past. It is a living link in Bhutan and in India’s Himalayan states today.',
    s20: 'Guru Padmasambhava brought Vajrayāna Buddhism to Bhutan in the 8th century. The dragon on Bhutan’s flag stands for the thunderous voice of the Buddha’s teachings. Bhutan also measures progress through Gross National Happiness.',
  },
});

/* ---------- MYANMAR ---------- */
S({
  id: 'mmr', title: 'India & Myanmar: gateway to Southeast Asia', sec: 'Land neighbours · Myanmar', num: '11', view: ['mmr', 'r'],
  countries: focusSpec('MMR'), base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:70px">
    <div class="kicker"><b>11</b> India &amp; Myanmar (earlier ‘Burma’)</div>
    <h2 style="font-size:60px">Connected by land <span style="color:var(--sea)">and</span> sea</h2>
    <ul class="pts" style="gap:14px">
      <li>A <b>land border</b> with Arunachal Pradesh, Nagaland, Manipur and Mizoram, and a <b>maritime boundary</b> in the Bay of Bengal.</li>
      <li>As the birthplace of Buddhism, India is special for many people of Myanmar, who come as <b>pilgrims</b>.</li>
      <li>The <b>Land Border Crossing Agreement (2018)</b> eased movement for border communities and boosted trade; recently, conflicts have led to some restrictions.</li>
    </ul>
  </div>
  ${photo('ananda', 'right:70px;bottom:110px;width:560px;height:330px', 'Ananda temple, Bagan: India helped restore it after earthquake damage')}`,
  enter() {
    label('MMR', 'Myanmar'); label([80, 22], 'India', 'india');
    statePins([[94.4, 28.4, 'Arunachal Pradesh', 'left'], [94.5, 26.1, 'Nagaland', 'left'], [93.9, 24.7, 'Manipur', 'left'], [92.8, 23.2, 'Mizoram', 'left']], .3);
    route([[93.2, 23.4], [93.4, 22.6], [93.35, 21.8]], { type: 'land', dur: .8, del: 1.5 });
    route([[87.5, 20.5], [91, 19], [93.6, 17.8]], { type: 'sea', dur: 1.4, del: 1.8, mover: { kind: 'ship', speed: 70 } });
    pin(96.15, 16.8, 'Yangon (Shwedagon Pagoda)', 'city', 2); pin(94.86, 21.17, 'Bagan', 'city', 2.2);
  },
  notes: {
    tp: 'Myanmar is India’s land bridge to Southeast Asia and is also linked by sea.',
    q: 'Which four Indian states share a border with Myanmar?',
    mis: 'That Myanmar is only a land neighbour. It also shares a maritime boundary in the Bay of Bengal.',
    s20: 'Myanmar borders Arunachal Pradesh, Nagaland, Manipur and Mizoram, and also shares a sea boundary. Buddhism links the people. India helped restore the Ananda temple at Bagan and gifted a 16-foot replica of the Sarnath Buddha to the Shwedagon Pagoda.',
  },
});

const TRI = [[93.94, 24.82], [94.3, 24.24], [94.3, 23.2], [95.1, 22.4], [96.08, 21.97], [95.86, 20.88], [96.2, 19.3], [96.48, 17.33], [97.6, 16.9], [98.57, 16.71]];
S({
  id: 'trilateral', title: 'The India–Myanmar–Thailand Trilateral Highway', sec: 'Land neighbours · Myanmar', num: '11', view: [[84, 7, 108, 29], 'r'],
  countries: focusSpec('MMR', 'landN', { THA: 'seaN focus keep' }), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:70px">
    <div class="kicker">Modern connectivity</div>
    <h2 style="font-size:58px">India → Myanmar → Thailand</h2>
    <p class="lead" style="font-size:28px">The <b>Trilateral Highway</b> stretches from India’s <b>Manipur</b>, through <b>Myanmar</b>, into <b>Thailand</b>. It improves overland connectivity, increases regional trade and supports cooperation, reviving age-old links.</p>
    <div class="chips"><span class="chip" style="color:var(--infra);border-color:var(--infra)">🛣 Overland connectivity</span><span class="chip">Regional trade</span><span class="chip">Cooperation</span></div>
    <div class="bq" style="margin-top:24px"><div class="q">Can you find the route from India to Thailand?</div>
      <div style="display:flex;gap:12px;margin-top:16px"><button class="btn ghost sm" id="tLand">By land</button><button class="btn ghost sm" id="tSea">By sea</button></div>
      <p class="small tAns" style="margin-top:12px;min-height:60px"></p></div>
  </div>`,
  init(el) {
    $('#tLand', el).onclick = () => { route(TRI, { type: 'infra', dur: 2.4, mover: [{ kind: 'truck', speed: 90 }, { kind: 'truck', speed: 90, gap: 2 }] }); $('.tAns', el).innerHTML = 'Through Manipur and across Myanmar: the <b>Trilateral Highway</b>.'; };
    $('#tSea', el).onclick = () => { route([[87.9, 21.4], [91, 16], [95, 11], [98.2, 8.2]], { type: 'sea', dur: 2, mover: { kind: 'ship', speed: 90 } }); $('.tAns', el).innerHTML = 'Across the <b>Bay of Bengal</b> and Andaman Sea: India and Thailand share a <b>maritime boundary</b>.'; };
  },
  enter() {
    label('MMR', 'Myanmar'); label([101.5, 15.6], 'Thailand', 'sea'); label([82, 22], 'India', 'india');
    pin(93.94, 24.82, 'Manipur', 'tag left', .2); pin(98.57, 16.71, 'into Thailand', 'tag', .4);
    route(TRI, { type: 'infra', dur: 3, mover: [{ kind: 'truck', speed: 80 }, { kind: 'truck', speed: 80, gap: 2.2 }, { kind: 'truck', speed: 80, gap: 2.2 }] });
  },
  notes: {
    tp: 'The highway is a modern version of ancient connections: a road linking India’s northeast to Southeast Asia.',
    q: 'How would a road through Myanmar help a trader in Manipur?',
    mis: 'That India and Thailand share a land border. They do not; the land route passes through Myanmar.',
    s20: 'The Trilateral Highway runs from Manipur through Myanmar into Thailand, making overland trade and travel easier. It is why Myanmar is called India’s gateway to Southeast Asia.',
  },
});

/* ---------- AFGHANISTAN ---------- */
const UTT = [[85.14, 25.6], [83.0, 25.32], [80.6, 26.2], [77.7, 28.4], [74.6, 31.3], [72.83, 33.75], [71.5, 34.0], [69.17, 34.53], [68.4, 33.55], [65.7, 31.62]];
S({
  id: 'afg', title: 'India & Afghanistan: the Uttarāpatha', sec: 'Land neighbours · Afghanistan', num: '12', view: [[58, 22, 90, 38], 'r'],
  countries: focusSpec('AFG', 'landN', { PAK: 'ghost' }), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:70px">
    <div class="kicker"><b>12</b> India &amp; Afghanistan · a land-locked neighbour</div>
    <h2 style="font-size:56px">A cultural superhighway</h2>
    <p class="lead" style="font-size:27px">The ancient <b>Uttarāpatha</b> linked the Ganga plains to Central Asia via Afghanistan. It stretched from <b>Gandhāra</b> (modern Kandahar) through <b>Takṣhaśhilā, Varanasi</b> and <b>Pāṭaliputra</b>.</p>
    <div class="chips"><span class="chip g">Goods</span><span class="chip g">Ideas</span><span class="chip g">Religion</span><span class="chip g">Art</span><span class="chip g">Philosophy</span></div>
    <ul class="pts" style="gap:12px;margin-top:20px">
      <li>Before Islam spread in the 7th century CE, Afghanistan was a thriving centre of <b>Buddhist and Hindu culture</b>; kingdoms like <b>Kapiśha</b> and <b>Zābul</b> mirrored Indian governance.</li>
      <li>The giant <b>Buddhas of Bamiyan</b> showed Mahāyāna Buddhism’s reach from India; sadly, they were destroyed in 2001.</li>
    </ul>
  </div>`,
  enter() {
    label('AFG', 'Afghanistan'); label([80, 24], 'India', 'india');
    route(UTT, { type: 'land', dur: 3, mover: [{ text: 'goods', speed: 85, back: true }, { text: 'ideas', speed: 85, gap: 2.4 }, { text: 'Buddhism', speed: 85, gap: 2.4 }, { text: 'art', speed: 85, back: true, gap: 2.4 }, { text: 'culture', speed: 85, gap: 2.4 }] });
    [[85.14, 25.6, 'Pāṭaliputra', ''], [83.0, 25.32, 'Varanasi', ''], [72.83, 33.75, 'Takṣhaśhilā', ''], [65.7, 31.62, 'Gandhāra (Kandahar)', 'left'], [67.83, 34.82, 'Bamiyan', 'left']]
      .forEach((p, i) => pin(p[0], p[1], p[2], 'city ' + p[3], .4 + i * .4));
  },
  notes: {
    tp: 'Tell this as a historical journey: the Uttarāpatha carried goods, faith, art and ideas between the Ganga plains and Afghanistan.',
    q: 'What might a traveller have carried from Pāṭaliputra to Gandhāra besides goods?',
    mis: 'That Afghanistan was always culturally distant from India. It was a thriving centre of Buddhist and Hindu culture.',
    s20: 'The Uttarāpatha ran from Pāṭaliputra and Varanasi through Takṣhaśhilā to Gandhāra. Along it flowed goods, Buddhism, Hinduism, art and philosophy. The giant Buddhas of Bamiyan stood as a symbol of this link until 2001.',
  },
});

S({
  id: 'afg2', title: 'India & Afghanistan today', sec: 'Land neighbours · Afghanistan', num: '12', view: [[52, 24, 80, 38], 'r'],
  countries: focusSpec('AFG', 'landN', { PAK: 'ghost' }), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:70px">
    <div class="kicker">Modern cooperation</div>
    <h2 style="font-size:58px">Building on a long friendship</h2>
    <ul class="pts" style="gap:14px">
      <li>Afghanistan once shared a direct land border with India; the creation of Pakistan in 1947 <b>complicated access</b>.</li>
      <li>India has supported <b>education, healthcare</b> and <b>infrastructure</b>, including the <b>Afghan Parliament building</b>.</li>
      <li>India built the <b>Zaranj–Delaram highway</b>, which connects to the <b>Asian Highway Network 1 (AH 1)</b>. Parts of India’s NH 44 are also part of AH 1.</li>
    </ul>
    <svg viewBox="0 0 700 220" style="width:700px;height:220px;margin-top:20px" aria-label="Bamiyan Buddha niche, before and after 2001">
      <rect x="0" y="0" width="700" height="220" rx="16" fill="#2a1d12"/><path d="M0,220 V60 Q120,20 240,50 T480,40 T700,60 V220Z" fill="#8a6440"/>
      <path class="niche" d="M300,210 V90 Q350,30 400,90 V210Z" fill="#3b2817"/>
      <g class="buddha" style="transition:opacity 1.6s"><circle cx="350" cy="92" r="16" fill="#c79a66"/><path d="M322,210 L330,112 Q350,100 370,112 L378,210Z" fill="#c79a66"/></g>
      <text x="350" y="30" fill="#ffd98a" font-size="22" text-anchor="middle" font-family="sans-serif" class="bt">Bamiyan Buddha (before 2001)</text>
    </svg>
  </div>`,
  enter(el, c) {
    const b = $('.buddha', el), t = $('.bt', el); b.style.opacity = 1; t.textContent = 'Bamiyan Buddha (before 2001)';
    c.after(4.5, () => { b.style.opacity = 0; t.textContent = 'The empty niche (destroyed in 2001)'; });
    label('AFG', 'Afghanistan'); label([76, 27], 'India', 'india');
    route([[61.86, 30.96], [62.6, 31.55], [63.42, 32.17]], { type: 'infra', dur: 1.6, del: .2, mover: { kind: 'truck', speed: 50 } });
    pin(61.86, 30.96, 'Zaranj', 'city left', .4); pin(63.42, 32.17, 'Delaram', 'city', .6); pin(69.17, 34.53, 'Kabul: Parliament building', 'city', .9);
    route([[63.42, 32.17], [65.7, 31.62], [68.4, 33.55], [69.17, 34.53]], { type: 'infra', cls: 'thin', dur: 1.8, del: 1.4 });
    label([66.5, 33.4], 'AH 1', 'sm', 2);
  },
  notes: {
    tp: 'Modern ties continue the old friendship: India has helped build schools, hospitals, the Parliament and highways.',
    q: 'Why would a highway in western Afghanistan matter for trade with India?',
    mis: 'That India and Afghanistan have no modern links because they no longer share a direct border.',
    s20: 'Since 1947, reaching Afghanistan from India has been harder. Even so, India has helped with education, healthcare and infrastructure, including the Afghan Parliament building and the Zaranj–Delaram highway, which joins the Asian Highway Network.',
  },
});

/* ===================== SYNTHESIS, CHALLENGE, ENDING ===================== */
const BG = [84.99, 24.7]; // Bodh Gaya
const BUD = [
  { t: '3rd c. BCE', h: 'Theravāda takes shape · Sri Lanka', d: 'Mahendra and Sanghamitrā carry Buddhism to Sri Lanka.', r: [[BG, [80.4, 8.3]]], via: [[[84.99, 24.7], [80.5, 20], [79.9, 14], [79.6, 10.2], [80.4, 8.3]]], k: 'LKA' },
  { t: '1st c. BCE', h: 'Mahāyāna comes into being', d: 'A new school: the Buddha has a divine nature and can guide people in many forms.', via: [] },
  { t: '1st c. CE', h: 'Buddhism reaches China', d: 'Via trade and pilgrimage routes; later on to Japan and Korea (Zen emerges on the way).', via: [[[84.99, 24.7], [77.7, 28.4], [72.83, 33.75], [75.99, 39.47], [88, 41.5], [94.66, 40.14], [103.8, 36.06], [112.45, 34.62]]], k: 'CHN' },
  { t: '6th c. CE', h: 'Vajrayāna arises', d: 'The ‘Diamond Vehicle’: mantras, mandalas and visualisations.', via: [] },
  { t: '7th c. CE', h: 'Tibetan Buddhism', d: 'Derives from Vajrayāna.', via: [[[84.99, 24.7], [88.6, 27.3], [91.1, 29.65]]] },
  { t: '8th c. CE', h: 'Bhutan · Borobudur', d: 'Guru Padmasambhava brings Vajrayāna to Bhutan; Borobudur is built in Java (8th–9th c.).', via: [[[84.99, 24.7], [89.64, 27.47]], [[84.99, 24.7], [87.9, 21.4], [91, 15], [96, 7], [100.1, 4.5], [104.4, 1.2], [107, -4], [110.2, -7.6]]], k: 'BTN' },
  { t: 'Today', h: 'Theravāda in Myanmar & Thailand', d: 'Theravāda is followed mainly in Sri Lanka and Southeast Asia, especially Thailand and Myanmar.', via: [[[84.99, 24.7], [89, 22], [93, 21.5], [96.15, 16.8]], [[84.99, 24.7], [88, 21], [93, 15], [97.5, 12.5], [100.5, 13.75]]] },
];
S({
  id: 'buddhism', title: 'Buddhism: a cultural bridge', sec: 'What connects us', num: '22', view: [[66, -10, 122, 44], 'rr'],
  countries: neighbourSpec({ LKA: 'seaN keep', MMR: 'landN keep', CHN: 'landN keep', BTN: 'landN keep', THA: 'seaN keep', IDN: 'seaN keep' }), base: 'dimmed',
  html: `<div class="panel" style="width:960px;top:56px">
    <div class="kicker" data-in><b>22</b> Buddhism as a cultural bridge</div>
    <h2 data-in style="--d:.1;font-size:58px">One idea, many lands</h2>
    <div class="card" data-in style="--d:.2;padding:18px 24px"><div style="display:flex;align-items:center;gap:18px"><b class="bT" style="font:800 36px var(--serif);color:var(--gold);min-width:170px"></b><div><h4 class="bH" style="font-size:28px;margin:0"></h4><p class="bD" style="font-size:22px"></p></div></div>
      <input type="range" min="0" max="${BUD.length - 1}" value="0" step="1" class="bR nodrag" style="width:100%;margin-top:14px;accent-color:#f2b544;height:30px" aria-label="Timeline">
      <div style="display:flex;justify-content:space-between;font:600 16px var(--mono);color:var(--ink3)">${BUD.map(b => `<span>${b.t}</span>`).join('')}</div></div>
    <div class="cards" style="grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:18px">
      <div class="card" data-in style="--d:.4;padding:20px 22px"><span class="lab">Around 3rd c. BCE</span><h4>Theravāda</h4><p style="font-size:20px">‘School of the Elders’, closest to the Buddha’s original teachings · <b>Sri Lanka, Thailand, Myanmar</b></p></div>
      <div class="card" data-in style="--d:.55;padding:20px 22px"><span class="lab">Around 1st c. BCE</span><h4>Mahāyāna</h4><p style="font-size:20px">‘Great Vehicle’ · <b>China, Japan, Korea</b> (Zen emerged on the way)</p></div>
      <div class="card" data-in style="--d:.7;padding:20px 22px"><span class="lab">Around 6th c. CE</span><h4>Vajrayāna</h4><p style="font-size:20px">‘Diamond Vehicle’ · <b>Tibet</b> (~7th c.), <b>Bhutan</b> (8th c.)</p></div>
    </div>
    <p class="small" data-in style="--d:.85;margin-top:12px">All three schools are still followed in parts of India, especially the Himalayan states.</p>
  </div>
  ${photo('shwedagon', 'right:60px;top:60px;width:300px;height:420px', '')}`,
  init(el) {
    const r = $('.bR', el);
    r.oninput = () => this.show(+r.value);
  },
  show(n) {
    const el = this.el, b = BUD[n];
    $('.bT', el).textContent = b.t; $('.bH', el).textContent = b.h; $('.bD', el).textContent = b.d; $('.bR', el).value = n;
    clearFX(); pin(BG[0], BG[1], 'Bodh Gaya', 'city left', 0); label('IND', 'India', 'india');
    BUD.slice(0, n + 1).forEach((s, i) => s.via.forEach(v => route(v, { type: 'culture', dur: i === n ? 1.8 : .01, cls: i === n ? '' : 'thin', mover: i === n ? { kind: 'dot', speed: 130 } : null })));
    [['LKA', 0], ['CHN', 2], ['BTN', 5], ['IDN', 5], ['MMR', 6], ['THA', 6]].forEach(([k, s]) => { if (n >= s) label(k, null, (SEA_N.includes(k) ? 'sea ' : '') + (k === 'BTN' || k === 'LKA' ? 'sm' : ''), .3); });
  },
  enter(el, c) { this.show(0); if (!RM) BUD.forEach((_, i) => i && c.after(i * 2.6, () => this.show(i))); },
  notes: {
    tp: 'Buddhism began in India and spread, peacefully, along land and sea routes. Three schools emerged and travelled to different neighbours.',
    q: 'How has Buddhism created links with India’s neighbours? Give two examples.',
    mis: 'That Buddhism disappeared from India. All three schools are still followed in parts of India.',
    s20: 'Buddhism reached Sri Lanka in the 3rd century BCE, China around the 1st century CE, and Bhutan in the 8th century. Theravāda is followed in Sri Lanka, Thailand and Myanmar; Mahāyāna in China, Japan and Korea; Vajrayāna in Tibet and Bhutan.',
  },
});

/* ---------- THE BIG CONNECTIVITY MAP ---------- */
const NET = {
  land: { c: 'var(--land)', n: 'Land', f: () => LAND_N.forEach((k, i) => landLink(k, { del: i * .08, dur: 1, cls: 'thin' })) },
  sea: { c: 'var(--sea)', n: 'Sea', f: () => { SEA_N.forEach((k, i) => seaLink(k, { del: i * .08, dur: 1.2 })); atolls(); } },
  trade: { c: 'var(--trade)', n: 'Trade', f: () => { route([[118.6, 24.6], [111, 15.5], [104.6, 1.6], [96, 7], [88, 20.6]], { type: 'trade', mover: { kind: 'ship', speed: 120 } }); route([[81, 26.4], CAP.NPL], { type: 'trade', bulge: .2, mover: { kind: 'truck', speed: 70 } }); route([[68.5, 23.5], [60.5, 23.4], CAP.OMN], { type: 'trade', mover: { kind: 'ship', speed: 80 } }); route([[80.6, 12.8], [95, 6.2], CAP.MYS], { type: 'trade', mover: { kind: 'ship', speed: 90 } }); } },
  religion: { c: 'var(--culture)', n: 'Religion', f: () => BUD.forEach(s => s.via.forEach(v => route(v, { type: 'culture', cls: 'thin', dur: 1.6 }))) },
  culture: { c: '#ffd98a', n: 'Culture', f: () => ['THA', 'IDN', 'MDV', 'MYS', 'SGP', 'PAK'].forEach((k, i) => route([CAP.IND, CAP[k]], { type: 'culture', bulge: -.18, del: i * .1, cls: 'thin', mover: { text: { THA: 'Ayutthayā', IDN: 'Rāmāyaṇa', MDV: 'Boduberu', MYS: 'Brāhmī', SGP: 'Little India', PAK: 'music' }[k], speed: 100 } })) },
  language: { c: '#e7b6ff', n: 'Language', f: () => [['BGD', 'Bangla'], ['LKA', 'Tamil'], ['SGP', 'Tamil'], ['MDV', 'Dhivehi'], ['IRN', 'Persian']].forEach(([k, t], i) => { route([CAP.IND, CAP[k]], { type: 'culture', color: '#e7b6ff', bulge: .22, del: i * .12, cls: 'thin' }); pin(CAP[k][0], CAP[k][1], t, 'tag', .8 + i * .1); }) },
  rivers: { c: '#59c3ff', n: 'Rivers', f: () => { route(GANGA, { type: 'river', dur: 2 }); route(BRAHMA, { type: 'river', dur: 2 }); route([[90.5, 27.8], [90.3, 26.6]], { type: 'river', dur: 1 }); } },
  pilgrimage: { c: '#ffb36b', n: 'Pilgrimage', f: () => [[[76.3, 31.9], [75.03, 32.08]], [CAP.BTN, BG], [CAP.MMR, BG], [[83.0, 25.3], CAP.NPL], [CAP.LKA, BG]].forEach((p, i) => route(p, { type: 'culture', color: '#ffb36b', bulge: .2, del: i * .12, cls: 'thin', mover: { kind: 'dot', speed: 90 } })) },
  disaster: { c: 'var(--aid)', n: 'Disaster response', f: () => [[95.3, 5.5], [81.7, 7.5], [100.5, 13.75], CAP.MDV, [92.7, 11.6]].forEach((p, i) => route([[78.47, 17.38], p], { type: 'aid', bulge: .12, del: i * .1, cls: 'thin', mover: { kind: 'aid', speed: 140 } })) },
  infra: { c: 'var(--infra)', n: 'Modern infrastructure', f: () => { route(TRI, { type: 'infra', mover: { kind: 'truck', speed: 90 } }); route([[60.64, 25.3], [61.86, 30.96], [63.42, 32.17]], { type: 'infra' }); route([[72.9, 19], [63, 24], [60.64, 25.3]], { type: 'sea', mover: { kind: 'ship', speed: 90 } }); route([[90.2, 27.0], [89.3, 25.5]], { type: 'infra', cls: 'thin' }); } },
};
S({
  id: 'network', title: 'The big connectivity map', sec: 'What connects us', num: '23', view: ['wide', 'r'],
  countries: neighbourSpec(), base: 'dimmed',
  html: `<div class="panel glass" style="width:700px;top:60px;padding:34px 38px">
    <div class="kicker"><b>23</b> What connects all these neighbours?</div>
    <h2 style="font-size:54px">Switch on the connections</h2>
    <div class="nets" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px"></div>
    <button class="btn" id="netAll" style="margin-top:22px">✦ Activate all</button>
    <p class="lead netMsg" style="font-size:30px;margin-top:22px;opacity:0;transition:opacity 1s;color:#fff;font-family:var(--serif)">India’s neighbourhood is a <em class="t">network</em>, not just a border.</p>
  </div>`,
  init(el) {
    const box = $('.nets', el);
    Object.entries(NET).forEach(([k, v]) => {
      const b = html(`<button class="btn ghost sm" data-k="${k}" style="justify-content:flex-start"><span style="width:16px;height:16px;border-radius:50%;background:${v.c};box-shadow:0 0 10px ${v.c}"></span>${v.n}</button>`);
      b.onclick = () => { if (b.classList.contains('on')) return; b.classList.add('on'); v.f(); this.check(); };
      box.appendChild(b);
    });
    $('#netAll', el).onclick = () => { $$('.nets .btn', el).forEach((b, i) => setTimeout(() => b.click(), i * 260)); };
  },
  check() { if ($$('.nets .btn.on', this.el).length >= 6) $('.netMsg', this.el).style.opacity = 1; },
  enter(el) { $$('.nets .btn', el).forEach(b => b.classList.remove('on')); $('.netMsg', el).style.opacity = 0; label('IND', 'India', 'india'); },
  notes: {
    tp: 'This is the “wow” moment: switch on every kind of connection and the map comes alive.',
    q: 'Which kind of connection links India to the most neighbours?',
    mis: 'That neighbours are connected in only one way. Most are linked in several ways at once.',
    s20: 'Land, sea, trade, religion, culture, language, rivers, pilgrimage, disaster response and modern infrastructure: switch them all on and you can see that India’s neighbourhood is a network, not just a border.',
  },
});

/* ---------- SAARC ---------- */
const SAARC = ['AFG', 'BGD', 'BTN', 'IND', 'MDV', 'NPL', 'PAK', 'LKA'];
S({
  id: 'saarc', title: 'SAARC: regional cooperation', sec: 'What connects us', num: '24', view: [[56, -2, 98, 38], 'r'],
  countries: Object.fromEntries(SAARC.map(k => [k, k === 'IND' ? 'india keep' : 'landN keep'])), base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:70px">
    <div class="kicker"><b>24</b> Working together</div>
    <h2 style="font-size:58px">SAARC</h2>
    <p class="lead" style="font-size:27px">The <b>South Asian Association for Regional Cooperation</b> was formed in <b>1985</b> to promote mutual interests and sociocultural and economic progress.</p>
    <div class="chips"><span class="chip">Afghanistan</span><span class="chip">Bangladesh</span><span class="chip">Bhutan</span><span class="chip" style="border-color:var(--gold);color:var(--gold2)">India</span><span class="chip">the Maldives</span><span class="chip">Nepal</span><span class="chip">Pakistan</span><span class="chip">Sri Lanka</span></div>
    <div class="small" style="margin-top:20px">It aims to share resources for development in:</div>
    <div class="chips" style="margin-top:8px"><span class="chip g">🔬 Science</span><span class="chip g">📚 Education</span><span class="chip g">🏥 Health</span><span class="chip g">🌱 Development</span></div>
    <div class="card" style="margin-top:20px;border-color:rgba(255,93,108,.5);padding:18px 22px"><p style="font-size:23px">However, <b>political tensions</b> among some members have often <b>disrupted its functioning</b>. Several other regional groups centred on the Indian Ocean exist for other purposes.</p></div>
  </div>`,
  enter() {
    const pts = SAARC.map(k => k === 'MDV' ? CAP.MDV : CAP[k]);
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i) route([a, b], { type: 'culture', cls: 'thin', bulge: .06, del: .3 + (i + j) * .07, dur: 1 }); }));
    SAARC.forEach((k, i) => pin(CAP[k][0], CAP[k][1], NAMES[k], 'pulse ' + (['PAK', 'AFG', 'MDV', 'IND'].includes(k) ? 'left' : ''), .2 + i * .12));
    atolls(.5);
  },
  notes: {
    tp: 'SAARC is a regional group with eight members. Its purpose is cooperation, but tensions have limited it.',
    q: 'Which of India’s neighbours from this chapter are NOT members of SAARC?',
    mis: 'That all of India’s neighbours are in SAARC. China, Myanmar and the maritime neighbours to the east and west are not members.',
    s20: 'In 1985, eight South Asian countries formed SAARC to cooperate on science, education, health and development. Political tensions among some members have often disrupted it.',
  },
});

/* ---------- THE BIG IDEA ---------- */
S({
  id: 'bigidea', title: 'Being neighbours is not just about geography', sec: 'The big idea', num: '25', map: 'dim', view: ['sa', 'full'],
  html: `<div class="center" style="padding:0 140px">
    <div class="kicker" data-in><b>25</b> The big idea</div>
    <h1 data-in style="--d:.2;font-size:92px;margin:24px 0 40px;max-width:1500px">“Being neighbours is not just about <span style="color:var(--gold)">geography</span>.”</h1>
    <div class="cards" style="grid-template-columns:repeat(4,1fr);gap:18px;text-align:left;width:1640px">
      <div class="card" data-in style="--d:.5"><span class="lab">Shared past</span><p>Centuries of cultural, spiritual and commercial exchange; Indian thought, arts and architecture left an imprint across Southeast Asia.</p></div>
      <div class="card" data-in style="--d:.65"><span class="lab">Ancient routes</span><p>Uttarāpatha, Dakṣhiṇāpatha, the Silk Route and spice routes linked India to Central Asia, Southeast Asia and Arabia.</p></div>
      <div class="card" data-in style="--d:.8"><span class="lab">Peaceful spread</span><p>India spread her traditions peacefully, through trade, pilgrimage and culture.</p></div>
      <div class="card" data-in style="--d:.95"><span class="lab">Today</span><p>Connectivity projects revive old links; Indian films, music and television sustain bonds, alongside trade and strategy.</p></div>
    </div>
    <div style="width:1640px;text-align:left">${bigQ('In what ways has India helped smaller countries in her neighbourhood?', 'Hydropower in <b>Bhutan</b> (Tala) · the Parliament building and Zaranj–Delaram highway in <b>Afghanistan</b> · help in the tsunami, water crisis and COVID-19 in the <b>Maldives</b> · restoring the Ananda temple in <b>Myanmar</b> · essential goods for <b>Nepal</b> · tsunami early warning for the whole region.')}</div>
  </div>`,
  notes: {
    tp: 'The chapter’s central message. Students should explain it with an example.',
    q: '“Being neighbours is not just about geography.” Explain this with one example from the chapter.',
    mis: 'That being a neighbour is a fixed fact of the map. Relationships are built through trade, culture, help and dialogue.',
    s20: 'Neighbours share land or sea, but also history, faith, languages, food, rivers, trade and challenges. India and her neighbours are bound by all of these, which is why being neighbours is about much more than geography.',
  },
});

S({
  id: 'finale', title: 'One map. Many connections.', sec: 'The big idea', num: '25', view: ['wide', 'c'],
  countries: neighbourSpec(), base: 'dimmed',
  html: `<div class="fin1" style="position:absolute;left:0;right:0;top:70px;text-align:center"><h1 style="font-size:96px;text-shadow:0 6px 30px #000">One map. <span style="color:var(--gold)">Many connections.</span></h1></div>
  <div class="finW" style="position:absolute;left:120px;right:120px;bottom:120px;display:flex;flex-wrap:wrap;justify-content:center;gap:14px"></div>
  <div class="fin2" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(3,9,21,.95);opacity:0;transition:opacity 1.4s;pointer-events:none">
    <p style="font:italic 600 66px var(--serif);max-width:1500px;text-align:center;line-height:1.25">“Our destinies are inextricably tied together. What affects one nation affects the rest of us.”</p>
    <p class="small" style="font-size:28px;margin-top:26px">Nelson Mandela (1995)</p>
  </div>`,
  enter(el, c) {
    const W = ['Land', 'Sea', 'People', 'Language', 'Religion', 'Trade', 'Rivers', 'Culture', 'History', 'Disaster response', 'Cooperation'];
    const F = { Land: 'land', Sea: 'sea', Language: 'language', Religion: 'religion', Trade: 'trade', Rivers: 'rivers', Culture: 'culture', 'Disaster response': 'disaster', Cooperation: 'infra', People: 'pilgrimage' };
    const box = $('.finW', el); box.innerHTML = ''; $('.fin2', el).style.opacity = 0;
    label('IND', 'India', 'india');
    W.forEach((w, i) => c.after(.8 + i * .75, () => { box.appendChild(html(`<span class="chip g" style="font-size:28px;animation:fadeUp .6s both">${w}</span>`)); if (F[w]) NET[F[w]].f(); }));
    c.after(.8 + W.length * .75 + 2.4, () => $('.fin2', el).style.opacity = 1);
  },
  notes: {
    tp: 'The closing image: India at the centre of many kinds of connection, ending with the Mandela quote the chapter opened with.',
    q: 'Why did the textbook begin this chapter with Nelson Mandela’s words?',
    mis: 'That only big countries matter in a neighbourhood. What affects one nation affects all.',
    s20: 'One map, many connections: land, sea, people, language, religion, trade, rivers, culture, history, disaster response and cooperation. As Mandela said, our destinies are tied together.',
  },
});

/* ---------- NEIGHBOURHOOD CHALLENGE ---------- */
const QS = [
  { type: 'map', q: 'Map check: click on <b>Bhutan</b>.', a: 'BTN', v: [[76, 18, 100, 34], 'r'], ok: 'Correct: the ‘Land of the Thunder Dragon’, between India and China.' },
  { type: 'map', q: 'Click on India’s <b>nearest maritime neighbour</b>.', a: 'LKA', v: [[66, 2, 96, 24], 'r'], ok: 'Yes: Sri Lanka, only about 32 km across the Palk Strait.' },
  { type: 'sort', q: 'Land or maritime? Tap each country to sort it.', items: [['NPL', 'L'], ['MDV', 'M'], ['MMR', 'L'], ['IDN', 'M'], ['AFG', 'L'], ['OMN', 'M']] },
  { type: 'match', q: 'Mission: build the network. Match each neighbour to its connection.', pairs: [['NPL', 'Open border'], ['BGD', 'Shared rivers'], ['LKA', 'Palk Strait'], ['BTN', 'Hydropower'], ['MDV', 'Climate vulnerability'], ['IDN', 'Tsunami cooperation'], ['THA', 'Maritime &amp; cultural links']] },
  { type: 'mcq', q: 'Which modern route takes goods from India to Thailand over land?', o: ['The Zaranj–Delaram highway', 'The India–Myanmar–Thailand Trilateral Highway', 'The Kartarpur Corridor', 'The Palk Strait'], a: 1, route: true, ok: 'From Manipur, through Myanmar, into Thailand.' },
  { type: 'mcq', q: 'Which ancient route linked the Ganga plains to Central Asia via Afghanistan?', o: ['Dakṣhiṇāpatha', 'The spice route', 'Uttarāpatha', 'The Trilateral Highway'], a: 2, ok: 'The Uttarāpatha ran from Pāṭaliputra and Varanasi through Takṣhaśhilā to Gandhāra.' },
  { type: 'mcq', q: 'Look at the island cross-section idea: why is the Maldives especially at risk from climate change?', o: ['It is far from India', 'Its islets are small and low, so a sea-level rise of up to 1 m could submerge many', 'It has no rivers', 'It has too many tourists'], a: 1, ok: 'Low, small islands: even a small rise matters.' },
  { type: 'mcq', q: 'Who brought Buddhism to Sri Lanka in the 3rd century BCE?', o: ['Faxian and Xuanzang', 'Guru Padmasambhava', 'Mahendra and Sanghamitrā', 'Kumārajīva'], a: 2, ok: 'The son and daughter of Emperor Aśhoka.' },
  { type: 'mcq', q: 'The India–Nepal ‘open border’ means…', o: ['There are no rules at all', 'People can cross without a passport or visa, while both countries cooperate on security', 'Only traders may cross', 'Nepal is part of India'], a: 1, ok: 'Free movement, built on trust, with cooperation to prevent misuse.' },
  { type: 'mcq', q: 'Which example best shows that “being neighbours is not just about geography”?', o: ['India and Pakistan share a border', 'Bhutan is landlocked', 'India, Indonesia, Sri Lanka and Thailand built a tsunami early-warning network together after 2004', 'China is larger than India'], a: 2, ok: 'A shared challenge became cooperation: neighbours by choice and action, not just by location.' },
];
S({
  id: 'challenge', title: 'Neighbourhood Challenge', sec: 'Mission', num: '★', view: ['wide', 'r'], mapCls: '',
  countries: neighbourSpec(), base: 'dimmed',
  html: `<div class="panel glass chBox" style="width:860px;top:60px;padding:38px 44px"></div>
  <div class="chProg" style="position:absolute;left:90px;top:800px;display:flex;gap:10px"></div>`,
  enter(el) { this.i = 0; this.score = 0; this.render(); },
  progress() { $('.chProg', this.el).innerHTML = QS.map((_, i) => `<span style="width:54px;height:10px;border-radius:5px;background:${i < this.i ? 'var(--gold)' : 'rgba(255,255,255,.15)'}"></span>`).join(''); },
  done(ok, msg) {
    const fb = $('.fb', this.el); fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = msg;
    if (ok) { this.score++; }
    const q = QS[this.i];
    const tgt = q.a && typeof q.a === 'string' ? q.a : null;
    if (tgt && (SEA[tgt] || CAP[tgt])) (SEA[tgt] ? seaLink(tgt, { dur: 1 }) : landLink(tgt, { dur: 1 }));
    $('.nx', this.el).style.display = 'inline-flex';
  },
  render() {
    const el = this.el, box = $('.chBox', el); this.progress();
    MAPSVG.classList.remove('clickable');
    if (this.i >= QS.length) return this.finish();
    const q = QS[this.i], n = this.i + 1;
    box.innerHTML = `<div class="kicker">Mission · Build India’s neighbourhood network · ${n}/${QS.length}</div><h2 style="font-size:44px;line-height:1.2">${q.q}</h2><div class="qa"></div><div class="fb"></div><button class="btn nx" style="display:none;margin-top:14px">${n === QS.length ? 'Complete the mission →' : 'Next →'}</button>`;
    $('.nx', box).onclick = () => { this.i++; this.render(); };
    const qa = $('.qa', box);
    if (q.type === 'map') {
      setView(q.v[0], q.v[1], 1200); MAPSVG.classList.add('clickable');
      countries(Object.fromEntries([...LAND_N, ...SEA_N, 'IND'].map(k => [k, (k === 'IND' ? 'india' : SEA_N.includes(k) ? 'seaN' : 'landN') + ' pick keep'])), 'dimmed');
      qa.innerHTML = '<p class="lead" style="font-size:26px">Tap the country on the map.</p>';
      let tries = 0;
      this.mapHandler = e => {
        const c = e.target.dataset && e.target.dataset.c; if (!c || SLIDES[cur] !== this || $('.nx', box).style.display !== 'none') return;
        if (c === q.a) { $('#c-' + c).setAttribute('class', 'c focus keep'); label(c, null, 'sm'); MAPSVG.classList.remove('clickable'); this.done(tries === 0, q.ok); }
        else { tries++; const fb = $('.fb', box); fb.className = 'fb no'; fb.textContent = `That is ${MAP.c[c] ? MAP.c[c].n : 'another country'}. Try again!`; }
      };
      if (!this.bound) { $('#countries').addEventListener('click', e => this.mapHandler && this.mapHandler(e)); this.bound = true; }
    } else if (q.type === 'sort') {
      setView('wide', 'r', 1200);
      qa.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:10px">${q.items.map(([k]) => `<button class="opt srt" data-k="${k}" data-s="">${NAMES[k]}<br><small style="font-size:20px;color:var(--ink3)">tap to sort</small></button>`).join('')}</div><button class="btn sm chk" style="margin-top:16px">Check</button>`;
      $$('.srt', qa).forEach(b => b.onclick = () => { const s = b.dataset.s === 'L' ? 'M' : 'L'; b.dataset.s = s; b.querySelector('small').textContent = s === 'L' ? '⛰ Land' : '🌊 Maritime'; b.classList.add('sel'); });
      $('.chk', qa).onclick = () => {
        let all = true;
        $$('.srt', qa).forEach(b => { const ok = q.items.find(x => x[0] === b.dataset.k)[1] === b.dataset.s; b.classList.toggle('ok', ok); b.classList.toggle('no', !ok); all = all && ok; });
        if (all) { this.done(true, 'All sorted! Nepal, Myanmar, Afghanistan by land; the Maldives, Indonesia, Oman across the sea.'); $('.chk', qa).remove(); }
        else { const fb = $('.fb', box); fb.className = 'fb no'; fb.textContent = 'Some are in the wrong group. Tap them to change and check again.'; this.missed = true; }
      };
    } else if (q.type === 'match') {
      setView('wide', 'r', 1200); countries(neighbourSpec(), 'dimmed');
      const right = q.pairs.map(p => p[1]).sort((a, b) => a.length - b.length);
      qa.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1.4fr;gap:12px 20px;margin-top:6px"><div class="opts L" style="gap:10px">${q.pairs.map(p => `<button class="opt" style="padding:12px 20px;font-size:24px" data-k="${p[0]}">${NAMES[p[0]]}</button>`).join('')}</div><div class="opts R" style="gap:10px">${right.map(r => `<button class="opt" style="padding:12px 20px;font-size:23px" data-v="${r}">${r}</button>`).join('')}</div></div>`;
      let sel = null, got = 0, miss = 0;
      $$('.L .opt', qa).forEach(b => b.onclick = () => { if (b.classList.contains('ok')) return; $$('.L .opt', qa).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b; });
      $$('.R .opt', qa).forEach(b => b.onclick = () => {
        if (!sel || b.classList.contains('ok')) return;
        const k = sel.dataset.k, want = q.pairs.find(p => p[0] === k)[1];
        if (want === b.dataset.v) {
          sel.classList.remove('sel'); sel.classList.add('ok'); b.classList.add('ok'); got++;
          (SEA[k] ? seaLink(k, { dur: 1, mover: { kind: 'ship', speed: 80 } }) : landLink(k, { dur: 1, type: 'culture', mover: { kind: 'dot', speed: 100 } })); label(k, null, 'sm');
          sel = null; if (got === q.pairs.length) this.done(miss === 0, 'Network complete! Every link lights up on the map.');
        } else { miss++; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 600); }
      });
    } else {
      if (q.route) setView([84, 7, 108, 29], 'r', 1200); else setView('wide', 'r', 1200);
      qa.innerHTML = `<div class="opts" style="margin-top:8px">${q.o.map((o, i) => `<button class="opt" data-i="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join('')}</div>`;
      let tries = 0;
      $$('.opt', qa).forEach(b => b.onclick = () => {
        if ($('.nx', box).style.display !== 'none') return;
        if (+b.dataset.i === q.a) { b.classList.add('ok'); if (q.route) route(TRI, { type: 'infra', mover: { kind: 'truck', speed: 90 } }); this.done(tries === 0, q.ok); }
        else { tries++; b.classList.add('no'); const fb = $('.fb', box); fb.className = 'fb no'; fb.textContent = 'Not quite. Think again!'; }
      });
    }
  },
  finish() {
    const box = $('.chBox', this.el); setView('wide', 'r', 1600); countries(neighbourSpec(), '');
    Object.values(NET).forEach((v, i) => ctx.after(i * .3, v.f));
    box.innerHTML = `<div style="text-align:center;padding-top:30px">
      <svg viewBox="0 0 200 200" width="220" height="220" style="animation:fadeUp 1s both" aria-hidden="true"><defs><linearGradient id="bdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd98a"/><stop offset="1" stop-color="#e07b1f"/></linearGradient></defs><path d="M100,8 L180,50 V130 L100,192 L20,130 V50Z" fill="url(#bdg)"/><path d="M100,28 L160,60 V124 L100,170 L40,124 V60Z" fill="#0a1a36"/><circle cx="100" cy="98" r="10" fill="#ffd98a"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="100" y1="98" x2="${100 + 44 * Math.cos(a * Math.PI / 180)}" y2="${98 + 44 * Math.sin(a * Math.PI / 180)}" stroke="#ffd98a" stroke-width="3"/><circle cx="${100 + 44 * Math.cos(a * Math.PI / 180)}" cy="${98 + 44 * Math.sin(a * Math.PI / 180)}" r="6" fill="#5cc8ff"/>`).join('')}</svg>
      <div class="kicker" style="justify-content:center;margin-top:20px">Mission complete</div>
      <h2 style="font-size:66px;margin:14px 0">NEIGHBOURHOOD EXPLORER<br><span style="color:var(--gold)">UNLOCKED</span></h2>
      <p class="lead" style="margin:0 auto;font-size:30px">First-try score: <b>${this.score} / ${QS.length}</b></p>
      <button class="btn ghost" style="margin-top:30px" onclick="SLIDES[cur].enter(SLIDES[cur].el)">Try the mission again</button></div>`;
  },
  notes: {
    tp: 'Ten-step mission mixing map identification, sorting, matching, routes, visual reasoning and one conceptual question. Each correct answer adds a link to the map.',
    q: 'Before answering, ask the class to vote. Then reveal.',
    mis: 'Watch for confusion between Bhutan and Nepal on the map, and between land and maritime neighbours (Myanmar is both).',
    s20: 'Let’s test our journey: find countries on the map, sort land and maritime neighbours, match each neighbour to its connection and answer a few questions. Every correct answer builds India’s neighbourhood network.',
  },
});

/* ---------- THINK LIKE A GEOGRAPHER ---------- */
S({
  id: 'geographer', title: 'Think like a geographer', sec: 'Activity', num: '✎', view: ['sa', 'r'],
  countries: neighbourSpec({}, { sea: true }), base: 'dimmed',
  html: `<canvas class="draw nodrag" width="1920" height="1080" style="position:absolute;inset:0;cursor:crosshair;touch-action:none"></canvas>
  <div class="panel glass" style="width:700px;top:60px;padding:34px 38px">
    <div class="kicker">Think like a geographer</div>
    <h2 style="font-size:58px">Draw the borders of friendship</h2>
    <p class="lead" style="font-size:26px">If borders were drawn not only by geography but by <b>culture, rivers, trade, languages</b> and <b>shared history</b>, what would the map look like? Pick a pen and draw on the map.</p>
    <div class="pens" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">
      ${[['Culture', '#f5c451'], ['Rivers', '#59c3ff'], ['Trade', '#ff9f5a'], ['Languages', '#e7b6ff'], ['Shared history', '#6fe0c0'], ['Eraser', 'erase']].map((p, i) => `<button class="btn ghost sm ${i ? '' : 'on'}" data-c="${p[1]}" style="justify-content:flex-start"><span style="width:18px;height:18px;border-radius:50%;background:${p[1] === 'erase' ? 'repeating-linear-gradient(45deg,#fff 0 3px,transparent 3px 6px)' : p[1]}"></span>${p[0]}</button>`).join('')}
    </div>
    <button class="btn sm" id="dClear" style="margin-top:14px">Clear the map</button>
    <div class="card" style="margin-top:20px;padding:18px 22px"><span class="lab">Do this in your notebook too</span><p style="font-size:21px">On a blank map: label India’s neighbours · draw arrows for cultural flows (food, festivals, languages) · redraw “borders of friendship” · collect the flags of these countries and note what you observe.</p></div>
  </div>`,
  init(el) {
    const cv = $('.draw', el), g = cv.getContext('2d'); let col = '#f5c451', down = false, last = null;
    const pos = e => { const r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return [(t.clientX - r.left) * 1920 / r.width, (t.clientY - r.top) * 1080 / r.height]; };
    const start = e => { down = true; last = pos(e); e.preventDefault(); };
    const move = e => {
      if (!down) return; const p = pos(e); e.preventDefault();
      g.globalCompositeOperation = col === 'erase' ? 'destination-out' : 'source-over';
      g.strokeStyle = col === 'erase' ? '#000' : col; g.lineWidth = col === 'erase' ? 40 : 9; g.lineCap = 'round'; g.lineJoin = 'round';
      g.shadowColor = col === 'erase' ? 'transparent' : col; g.shadowBlur = 12;
      g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke(); last = p;
    };
    const end = () => { down = false; };
    cv.addEventListener('mousedown', start); cv.addEventListener('mousemove', move); addEventListener('mouseup', end);
    cv.addEventListener('touchstart', start, { passive: false }); cv.addEventListener('touchmove', move, { passive: false }); cv.addEventListener('touchend', end);
    $$('.pens .btn', el).forEach(b => b.onclick = () => { col = b.dataset.c; $$('.pens .btn', el).forEach(x => x.classList.toggle('on', x === b)); });
    $('#dClear', el).onclick = () => g.clearRect(0, 0, 1920, 1080);
  },
  enter() { labels(['IND', ...LAND_N, 'LKA', 'MDV'], '', .2, .05); atolls(.3); },
  notes: {
    tp: 'The chapter’s own creative activity: imagine borders drawn by connections instead of politics.',
    q: 'If borders were drawn only by culture and connections, how would the map look different?',
    mis: 'That there is one right answer. Different students will draw different maps; ask them to justify each line.',
    s20: 'Geographers draw maps of many kinds, not only political ones. Draw a map of friendship: where would the lines of culture, rivers, trade and language go?',
  },
});

/* ---------- CREDITS ---------- */
S({
  id: 'credits', title: 'Sources, image credits & licences', sec: 'Credits', num: 'ⓘ', map: 'dim', view: ['wide', 'full'],
  html: `<div style="position:absolute;inset:60px 90px 110px;overflow:auto" class="nodrag">
    <div class="kicker">Sources, image credits &amp; licences</div>
    <h2 style="font-size:52px">Credits</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px">
      <div>
        <h3 style="font-size:30px">Content</h3>
        <p class="small" style="color:var(--ink2)">Primary source: <i>Exploring Society: India and Beyond</i>, Grade 7 Part 2, Chapter 2 ‘India and Her Neighbours’ (NCERT). All facts, dates and figures in this presentation come from that chapter. Map waypoints, route lines and the tsunami-wave animation are simplified illustrations.</p>
        <h3 style="font-size:30px;margin-top:24px">Map</h3>
        <p class="small" style="color:var(--ink2)">Country outlines and rivers: <b>Natural Earth</b> (naturalearthdata.com), public domain; admin-0 countries, India point-of-view edition (v5.1.2), reprojected and simplified for this lesson. India’s boundaries follow the official Indian depiction. Illustrations (houses, Sundarbans, open border, hydropower, Kartarpur, Bamiyan, samudra manthana, Singapore city, sea-level and ingot diagrams) were drawn for this lesson.</p>
        <h3 style="font-size:30px;margin-top:24px">Fonts</h3>
        <p class="small" style="color:var(--ink2)">Noto Serif Display, Noto Sans and Noto Sans Mono (SIL Open Font License), loaded from Google Fonts when online.</p>
      </div>
      <div>
        <h3 style="font-size:30px">Photographs</h3>
        <div class="crList" style="display:grid;gap:10px"></div>
        <p class="small" style="margin-top:12px">All photos resized and re-encoded as WebP; no other changes. Full manifest: assets/licenses.json.</p>
      </div>
    </div>
  </div>`,
  init(el) {
    $('.crList', el).innerHTML = Object.entries(IMGMETA).map(([k, m]) => `<p style="font-size:18px;line-height:1.35;color:var(--ink2)"><b style="color:#fff">${m.title}</b> by ${m.creator} · <a href="${m.license_url}" target="_blank" rel="noopener" style="color:var(--gold2)">${m.license}</a> · <a href="${m.source_url}" target="_blank" rel="noopener" style="color:#9fd3ff">source</a></p>`).join('');
  },
  notes: {
    tp: 'Model good practice: every image used is openly licensed and credited.',
    q: 'Why is it important to credit the photographers whose pictures we use?',
    mis: 'That any image found online is free to use. Licences decide what we may reuse.',
    s20: 'All the photos here are openly licensed from Wikimedia Commons and credited. The map uses public-domain Natural Earth data.',
  },
});

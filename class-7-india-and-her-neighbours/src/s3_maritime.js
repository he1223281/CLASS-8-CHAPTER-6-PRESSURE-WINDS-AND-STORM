/* ===================== MARITIME NEIGHBOURS ===================== */
S({
  id: 'maritime', title: 'India’s maritime world', sec: 'Maritime neighbours', num: '13', view: ['india', 'r', 1200], mapCls: '',
  countries: neighbourSpec({}, { sea: false }), base: '',
  html: `<div class="panel" style="width:820px;top:160px">
    <div class="kicker" data-in><b>13</b> India’s maritime neighbours</div>
    <h2 data-in style="--d:.2;font-size:80px">India’s neighbourhood does not end at the coastline.</h2>
    <p class="lead mtx" data-in style="--d:.6">From a few centuries BCE, Indian traders sailed to Southeast Asia in search of gold and other valuable resources. Java, Sumatra and Malaya came to be called <em class="t">Suvarṇabhūmi</em> (‘golden land’) or <em class="t">Suvarṇadvīpa</em> (‘golden island’).</p>
  </div>`,
  enter(el, c) {
    c.after(1.6, () => {
      MAPSVG.classList.add('landfade');
      countries(Object.assign({ IND: 'india keep' }, Object.fromEntries(SEA_N.map(k => [k, 'seaN keep']))), '');
      setView('ocean', 'r', 2200);
    });
    c.after(3.9, () => {
      SEA_N.forEach((k, i) => { seaLink(k, { del: i * .2, mover: { kind: 'ship', speed: 70 } }); label(k, null, (['SGP', 'MDV', 'LKA'].includes(k) ? 'sm ' : '') + 'sea', .4 + i * .2); });
      atolls(.6); label([104, -9.5], 'SUVARṆADVĪPA', 'water', 2.4);
    });
  },
  leave() { MAPSVG.classList.remove('landfade'); },
  notes: {
    tp: 'Major transition: the land fades, the ocean becomes the stage. Eight maritime neighbours appear.',
    q: 'Why do you think ancient traders called these lands the “golden land” and “golden island”?',
    mis: 'That sea travel began only with modern ships. Indian sailors reached Southeast Asia centuries BCE.',
    s20: 'Our neighbourhood continues across the water. Indian traders sailed to Java, Sumatra and Malaya so often that these places were called Suvarṇabhūmi and Suvarṇadvīpa, the golden land and golden island.',
  },
});

/* ---------- SRI LANKA ---------- */
S({
  id: 'lka', title: 'India & Sri Lanka: the Palk Strait', sec: 'Maritime · Sri Lanka', num: '14', view: ['lka', 'r'],
  countries: focusSpec('LKA', 'seaN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:70px">
    <div class="kicker"><b>14</b> India’s nearest maritime neighbour</div>
    <h2 style="font-size:64px">India <span style="color:var(--sea)">🌊</span> Sri Lanka</h2>
    <p class="lead" style="font-size:28px">An island nation to the southeast of India, divided from it by a narrow stretch of sea: the <b>Palk Strait</b>.</p>
    <div class="stat" style="margin-top:22px"><span class="n">≈<span class="km">0</span> km</span><span class="u">at the nearest point between the two countries</span></div>
    <div style="display:flex;gap:12px;margin-top:24px"><button class="btn ghost sm" id="pZoom">Zoom into the strait</button><button class="btn ghost sm" id="pOut">Zoom out</button></div>
  </div>`,
  init(el) {
    $('#pZoom', el).onclick = () => this.zoom(true); $('#pOut', el).onclick = () => this.zoom(false);
  },
  zoom(z) {
    clearFX(); setView(z ? 'palk' : 'lka', 'r', 1600);
    label('LKA', 'Sri Lanka', 'sea'); label(z ? [79.3, 10.35] : [78.2, 11.4], 'India', 'india');
    if (z) { label([79.55, 9.7], 'PALK STRAIT', 'water'); route([[79.32, 9.2], [79.6, 9.17]], { type: 'measure', dur: 1, del: .2 }); pin(79.45, 9.05, '≈ 32 km', 'tag nolabel', .9); pin(79.46, 9.12, '≈ 32 km', 'tag', 1); }
    else { seaLink('LKA', { mover: { kind: 'ship', speed: 60 } }); label([79.6, 9.7], 'Palk Strait', 'sm sea', .6); }
  },
  enter(el, c) { c.after(.4, () => counter($('.km', el), 32, 1.4)); this.zoom(false); c.after(3.2, () => this.zoom(true)); },
  notes: {
    tp: 'Proximity: only about 32 km of sea separates India and Sri Lanka at the nearest point.',
    q: 'How long would it take you to travel 32 km by bus? What does that tell you about how close Sri Lanka is?',
    mis: 'That a sea gap means the countries are far apart. Sri Lanka is closer to India than many Indian cities are to each other.',
    s20: 'Sri Lanka is India’s nearest maritime neighbour. The Palk Strait between them is only about 32 km wide at the narrowest point, so the two have a long history of contact, trade and cooperation.',
  },
});

S({
  id: 'lka2', title: 'India & Sri Lanka: shared heritage', sec: 'Maritime · Sri Lanka', num: '14', view: [[70, 3, 90, 28], 'rr'],
  countries: focusSpec('LKA', 'seaN'), base: 'dimmed',
  html: `<div class="panel" style="width:960px;top:80px">
    <div class="kicker" data-in>Culture, history and cooperation</div>
    <h2 data-in style="--d:.1;font-size:60px">A multidimensional partnership</h2>
    <div class="cards" style="grid-template-columns:1fr 1fr;gap:16px">
      <div class="card" data-in style="--d:.3"><span class="lab">3rd century BCE</span><h4>Buddhism arrives</h4><p>Brought by <b>Mahendra</b> and <b>Sanghamitrā</b>, the son and daughter of Emperor <b>Aśhoka</b>.</p></div>
      <div class="card" data-in style="--d:.45"><span class="lab">The Epics</span><h4>Hindu traditions</h4><p>Hinduism also travelled there, notably through its two Epics. Both countries still celebrate this heritage.</p></div>
      <div class="card" data-in style="--d:.6"><span class="lab">mid-1980s to around 2010</span><h4>A difficult time</h4><p>Civil war between the <b>Sinhalese</b> majority and the <b>Tamil</b> minority (close cultural ties to India). Many Tamil families moved to Tamil Nadu.</p></div>
      <div class="card" data-in style="--d:.75"><span class="lab">Today</span><h4>Growing ties</h4><p>Cultural closeness, economic cooperation, strategic collaboration and people-to-people exchanges.</p></div>
    </div>
    <p class="small" data-in style="--d:.9;margin-top:16px">Sri Lanka’s colourful wooden masks may be connected to similar mask-making traditions in south India.</p>
  </div>`,
  enter() {
    label('LKA', 'Sri Lanka', 'sea'); label([79, 22], 'India', 'india');
    route([[78.0, 27.2], [80.5, 22], [79.8, 15], [79.6, 10.2], [80.4, 8.3]], { type: 'culture', dur: 2.2, mover: [{ text: 'Mahendra', speed: 80 }, { text: 'Sanghamitrā', speed: 80, gap: 2.2 }] });
    pin(80.4, 8.31, 'Anurādhapura', 'city', 1.6); pin(77.98, 27.18, 'Aśhoka’s empire', 'city left', .4);
  },
  notes: {
    tp: 'Ashoka’s own children carried Buddhism to Sri Lanka. Hindu and Tamil links are deep too, and the relationship has had hard times.',
    q: 'Why would an emperor send his own son and daughter on a mission across the sea?',
    mis: 'That neighbours’ relations are always smooth. The civil war was a difficult time that affected both countries.',
    s20: 'In the 3rd century BCE, Ashoka’s son Mahendra and daughter Sanghamitrā brought Buddhism to Sri Lanka. Hinduism travelled through the Epics. During the civil war, many Tamil families moved to Tamil Nadu. Today the two share a many-sided partnership.',
  },
});

/* ---------- MALDIVES ---------- */
S({
  id: 'mdv', title: 'India & the Maldives: a nation of islets', sec: 'Maritime · Maldives', num: '15', view: [[66, -2, 80, 13], 'r'],
  countries: focusSpec('MDV', 'seaN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:60px">
    <div class="kicker"><b>15</b> India &amp; the Maldives · a nation of islets</div>
    <h2 style="font-size:58px"><span class="isl">0</span>+ islets</h2>
    <p class="lead" style="font-size:27px">The Maldives is only about <b>130 km from Minicoy</b> (Lakshadweep, India): important for trade and security in the Indian Ocean.</p>
    <div class="small" style="margin-top:16px">Tap a Dhivehi word to see its Indian roots:</div>
    <div class="cards dw" style="grid-template-columns:repeat(5,1fr);gap:10px;margin-top:10px">
      ${[['Raajje', 'king', 'rājā (Sanskrit)'], ['mas', 'fish', 'matsya (Sanskrit)'], ['dhoni', 'boat', 'Tamil / Malayalam roots'], ['kukulhu', 'chicken', 'Tamil / Malayalam roots'], ['filmu', 'film', 'Hindi, thanks to Bollywood']].map(w => `<button class="card" style="padding:14px 12px;text-align:center" data-f="${w[2]}"><h4 style="font-size:26px">${w[0]}</h4><p style="font-size:19px">${w[1]}</p></button>`).join('')}
    </div>
    <p class="lead dwa" style="font-size:24px;min-height:40px;margin-top:10px;color:var(--gold2)"></p>
    <div class="chips" style="margin-top:8px"><span class="chip">🍛 Coconut curries &amp; roshi</span><span class="chip">🥁 Boduberu dance (Tamil folk rhythms)</span><span class="chip">⛵ Boat-building</span><span class="chip">☸ Early Buddhism</span></div>
  </div>`,
  init(el) { $$('.dw .card', el).forEach(b => b.onclick = () => { $('.dwa', el).textContent = b.querySelector('h4').textContent + ' ← ' + b.dataset.f; $$('.dw .card', el).forEach(x => x.style.borderColor = x === b ? 'var(--gold)' : ''); }); },
  enter(el, c) {
    c.after(.4, () => counter($('.isl', el), 1100, 1.6));
    atolls(.2); label([75.4, 4.6], 'Maldives', 'sea', .3); label([76.5, 11.6], 'India', 'india');
    pin(73.05, 8.28, 'Minicoy (India)', 'city left', .8);
    route([[73.05, 8.0], [73.35, 6.6]], { type: 'measure', dur: 1, del: 1.2 }); pin(73.45, 7.3, '≈ 130 km', 'tag', 1.8);
    pin(73.51, 4.17, 'Malé', 'city', 1);
  },
  notes: {
    tp: 'Geography (islets near Minicoy) plus culture: language, food, dance and boats all show South Indian links.',
    q: 'Dhivehi “mas” means fish. Which Sanskrit word does it come from? (matsya)',
    mis: 'That the Maldives is one island. It is a chain of over 1,100 small islands.',
    s20: 'The Maldives has over 1,100 islets and lies about 130 km from India’s Minicoy. Its language, Dhivehi, borrows from Sanskrit, Tamil, Malayalam and Hindi, and its food and Boduberu dance echo South India.',
  },
});

S({
  id: 'mdv2', title: 'The Maldives: first responder and climate risk', sec: 'Maritime · Maldives', num: '15', map: 'hide',
  html: `${photo('male', 'left:80px;top:70px;width:880px;height:450px', 'Malé, capital of the Maldives: nearly the whole island is built up, right to the sea')}
  <div class="cards" style="position:absolute;left:80px;top:550px;width:880px;grid-template-columns:repeat(3,1fr);gap:14px">
    <div class="card" data-in style="--d:.3;padding:18px 20px;border-color:rgba(255,93,108,.5)"><span class="lab" style="color:#ff8f9a">2004</span><p style="font-size:22px;color:#fff">Tsunami relief</p></div>
    <div class="card" data-in style="--d:.45;padding:18px 20px;border-color:rgba(255,93,108,.5)"><span class="lab" style="color:#ff8f9a">2014</span><p style="font-size:22px;color:#fff">Water crisis in Malé</p></div>
    <div class="card" data-in style="--d:.6;padding:18px 20px;border-color:rgba(255,93,108,.5)"><span class="lab" style="color:#ff8f9a">Pandemic</span><p style="font-size:22px;color:#fff">COVID-19 support</p></div>
  </div>
  <p class="small" data-in style="--d:.8;position:absolute;left:80px;top:690px;width:880px">India was one of the first countries to recognise the Maldives after independence in 1965. Quick help in these crises reinforced India’s role as the region’s <b style="color:#fff">trusted first responder</b>. The Maldives is also a member of the <b style="color:#fff">International Solar Alliance</b>, an Indian initiative.</p>
  <div class="panel glass" style="left:auto;right:70px;top:70px;width:820px;padding:30px 36px">
    <div class="kicker">Why is an island nation vulnerable?</div>
    <svg viewBox="0 0 740 380" style="width:740px;height:380px;margin-top:14px" aria-label="Cross-section of a low island as the sea level rises">
      <defs><linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa6e0"/><stop offset="1" stop-color="#0b3a66"/></linearGradient></defs>
      <rect width="740" height="380" rx="16" fill="#0d2442"/>
      <path d="M150,262 Q220,236 300,232 L460,232 Q540,236 600,262 Z" fill="#e9d7a6"/>
      <g fill="#2b8a4e"><circle cx="300" cy="212" r="20"/><circle cx="440" cy="212" r="20"/></g>
      <g fill="#f4f1ea"><rect x="340" y="196" width="40" height="36"/><rect x="390" y="204" width="30" height="28"/></g>
      <path d="M318,232 v-16 M430,232 v-16" stroke="#6b4a2a" stroke-width="4"/>
      <rect class="sl" x="0" y="250" width="740" height="130" fill="url(#seaG)" opacity=".85"/>
      <line x1="40" y1="250" x2="700" y2="250" stroke="#bfe8ff" stroke-width="2" stroke-dasharray="6 6" class="sll"/>
      <text x="40" y="40" fill="#fff" font-size="24" font-family="sans-serif" class="slt">Sea level today</text>
    </svg>
    <label style="display:flex;align-items:center;gap:18px;margin-top:16px;font-size:24px">Rise: <input type="range" min="0" max="100" value="0" class="rng nodrag" style="flex:1;accent-color:#f2b544;height:30px" aria-label="Sea level rise"><b class="rv" style="width:110px">0 m</b></label>
    <p class="lead" style="font-size:24px;margin-top:10px">Sea level could rise by up to <b>1 metre by the end of this century</b>, partly submerging many islands. In 2009, the Maldives’ cabinet even held a meeting <b>underwater</b>, at 4 m depth, to warn the world.</p>
    ${bigQ('Why is the Maldives especially vulnerable to rising sea levels?', 'Its islands are small and very low. Even a small rise means the sea covers land where people live. This is why climate change is a shared challenge.').replace('style="--d:.6"', 'style="--d:.6;margin-top:14px;padding:18px 22px"')}
  </div>`,
  init(el) {
    const r = $('.rng', el);
    r.oninput = () => {
      const v = r.value / 100, y = 250 - v * 26;
      $('.sl', el).setAttribute('y', y); $('.sl', el).setAttribute('height', 380 - y); $('.sll', el).setAttribute('y1', y); $('.sll', el).setAttribute('y2', y);
      $('.rv', el).textContent = v.toFixed(2).replace(/0$/, '') + ' m'; $('.slt', el).textContent = v ? 'Sea level + ' + v.toFixed(2) + ' m (illustrative)' : 'Sea level today';
    };
  },
  enter(el, c) {
    const r = $('.rng', el); r.value = 0; r.oninput();
    if (!RM) { let v = 0; c.after(1.6, () => { const id = setInterval(() => { v += 2; r.value = v; r.oninput(); if (v >= 100) clearInterval(id); }, 45); timers.push(id); }); }
  },
  notes: {
    tp: 'An island nation’s low height makes it extremely vulnerable to sea-level rise. India helps as a first responder in crises.',
    q: 'If your home were 1 metre above the sea, what would you worry about?',
    mis: 'That a 1 m rise is “small”. On low islands, it can submerge land where people live.',
    s20: 'India helped the Maldives in the 2004 tsunami, the 2014 water crisis in Malé and the COVID-19 pandemic. The islands are so low that sea level rise of up to 1 metre this century could partly submerge many of them.',
  },
});

/* ---------- THAILAND ---------- */
S({
  id: 'thai', title: 'India & Thailand: names that travelled', sec: 'Maritime · Thailand', num: '16', view: ['thai', 'r'],
  countries: focusSpec('THA', 'seaN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:800px;top:60px">
    <div class="kicker"><b>16</b> India &amp; Thailand</div>
    <h2 style="font-size:54px">From Dvārakā to Dvāravatī, Ayodhyā to Ayutthayā</h2>
    <p class="lead" style="font-size:25px">Sharing a <b>maritime boundary</b>, the two have been linked since the <b>3rd century BCE</b>, when Indian traders and scholars sailed there with spices and textiles, and with religious and cultural ideas.</p>
    <div class="cards" style="grid-template-columns:1fr 1fr;gap:14px;margin-top:20px">
      <button class="card nm" data-in style="--d:.3;padding:20px 22px"><span class="lab">India</span><h4 class="w" style="font-size:38px">Dvārakā</h4><p class="d" style="font-size:20px">Kṛiṣhṇa’s city in the Mahābhārata · tap to travel</p></button>
      <button class="card nm" data-in style="--d:.45;padding:20px 22px"><span class="lab">India</span><h4 class="w" style="font-size:38px">Ayodhyā</h4><p class="d" style="font-size:20px">Birthplace of Rāma in the Rāmāyaṇa · tap to travel</p></button>
    </div>
    <ul class="pts" style="gap:10px;margin-top:20px">
      <li style="font-size:25px"><b>Theravāda Buddhism</b> is widely practised; Hindu deities and epic stories feature in royal ceremonies, dance and literature.</li>
      <li style="font-size:25px">Kings of the Chakri dynasty are all named after Rāma: the current king is <b>Rama X</b>.</li>
    </ul>
  </div>`,
  init(el) {
    const T = [['Dvāravatī', 'Thai culture, 6th–11th c. CE: ‘that which has gates’'], ['Ayutthayā', 'Thai kingdom founded in 1351']];
    $$('.nm', el).forEach((b, i) => b.onclick = () => {
      const w = b.querySelector('.w'), d = b.querySelector('.d'), l = b.querySelector('.lab');
      w.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 900 });
      setTimeout(() => { w.textContent = T[i][0]; d.textContent = T[i][1]; l.textContent = 'Thailand'; b.style.borderColor = 'var(--gold)'; w.style.color = 'var(--gold2)'; }, 450);
      route(i ? [[82.2, 26.8], [86, 22.5], [91, 16], [96, 11.5], [99.5, 13.2], [100.57, 14.35]] : [[69.0, 22.24], [72, 15], [76.5, 7.2], [80.8, 5.6], [88, 8], [95, 10], [99, 12.6], [100.06, 13.82]], { type: 'culture', dur: 2.2, mover: { text: T[i][0], speed: 120 } });
    });
  },
  enter() {
    label('THA', 'Thailand', 'sea'); label([79, 21], 'India', 'india');
    route([[87.9, 21.4], [91, 16], [95, 11], [98.2, 8.2]], { type: 'sea', dur: 1.8, mover: [{ text: 'spices', speed: 90, color: '#5cc8ff' }, { text: 'textiles', speed: 90, gap: 2.4, color: '#5cc8ff' }, { text: 'ideas', speed: 90, gap: 2.4, color: '#5cc8ff' }] });
    pin(69.0, 22.24, 'Dvārakā', 'city left', .6); pin(82.2, 26.8, 'Ayodhyā', 'city', .8); pin(100.57, 14.35, 'Ayutthayā', 'city', 1); pin(100.06, 13.82, 'Nakhon Pathom (Dvāravatī)', 'city left', 1.2);
  },
  notes: {
    tp: 'Place names prove cultural influence: Dvārakā → Dvāravatī and Ayodhyā → Ayutthayā.',
    q: 'Bangkok’s airport is called Suvarnabhumi Airport. Does that remind you of something from this chapter?',
    mis: 'That Indian influence came by conquest. It came through traders, monks and scholars sailing across the sea.',
    s20: 'Since the 3rd century BCE, Indian traders and scholars sailed to Thailand. Thai kingdoms took Indian names: Dvāravatī from Dvārakā and Ayutthayā from Ayodhyā. Thai kings of the Chakri dynasty are named after Rāma.',
  },
});

S({
  id: 'thai2', title: 'Thailand: the churning of the ocean', sec: 'Maritime · Thailand', num: '16', map: 'hide',
  html: `<div class="bg" style="background:radial-gradient(ellipse at 60% 40%,#173a6b,#050d1f 70%)"></div>
  <svg viewBox="0 0 1100 700" style="position:absolute;right:40px;top:120px;width:1100px;height:700px" aria-label="Illustration of the samudra manthana: devas and asuras pulling the serpent Vasuki around a mountain">
    <path d="M0,560 Q275,520 550,560 T1100,560 V700 H0Z" fill="#14558f"/><path d="M0,590 Q275,560 550,590 T1100,590" stroke="#7fd0ff" stroke-width="4" fill="none" opacity=".6"/>
    <path d="M500,560 L540,250 L560,250 L600,560Z" fill="#8b6a45"/>
    <path class="vas" d="M90,420 C 300,380 450,330 550,330 C 650,330 800,380 1010,420" fill="none" stroke="#3fae6a" stroke-width="22" stroke-linecap="round"/>
    <path d="M550,330 C 600,345 600,375 550,385 C 500,395 500,420 550,430" fill="none" stroke="#3fae6a" stroke-width="22"/>
    <circle cx="1018" cy="420" r="18" fill="#3fae6a"/>
    <g fill="#d26a5a">${[150, 240, 330, 420].map((x, i) => `<g transform="translate(${x},${410 - i * 18})"><circle r="22" cy="-62" /><rect x="-20" y="-40" width="40" height="70" rx="12"/></g>`).join('')}</g>
    <g fill="#e9c26a">${[680, 770, 860, 950].map((x, i) => `<g transform="translate(${x},${356 + i * 18})"><circle r="22" cy="-62"/><rect x="-20" y="-40" width="40" height="70" rx="12"/></g>`).join('')}</g>
    <g transform="translate(550,170)"><circle r="40" fill="#5c8fe8"/><circle r="70" fill="none" stroke="#ffd98a" stroke-width="4" opacity=".6"/></g>
    <text x="280" y="250" fill="#ffb3a8" font-size="30" text-anchor="middle" font-family="sans-serif" font-weight="700">asuras</text>
    <text x="820" y="250" fill="#ffe3a8" font-size="30" text-anchor="middle" font-family="sans-serif" font-weight="700">devas</text>
    <text x="550" y="85" fill="#cfe0ff" font-size="28" text-anchor="middle" font-family="sans-serif">Viṣhṇu presides</text>
    <text x="760" y="470" fill="#9ff0c6" font-size="26" font-family="sans-serif">serpent Vāsuki</text>
  </svg>
  <div class="panel" style="width:740px;top:150px">
    <div class="kicker" data-in>Let’s explore</div>
    <h2 data-in style="--d:.1;font-size:62px">Samudra manthana at Bangkok airport</h2>
    <p class="lead" data-in style="--d:.3;font-size:27px">A massive sculpture at Bangkok’s airport shows the Hindu story of the <b>churning of the ocean</b>: devas and asuras churn the cosmic ocean for <em class="t">amrita</em>, the nectar of immortality, with the serpent <b>Vāsuki</b> as the rope.</p>
    ${bigQ('The airport’s official name is ‘Suvarnabhumi Airport’. Does it remind you of something?', 'Yes! <b>Suvarṇabhūmi</b>, the ‘golden land’: the name ancient Indian traders gave to the lands of Southeast Asia.')}
    <p class="small" data-in style="--d:.9;margin-top:16px">Illustration drawn for this lesson (not a photograph of the sculpture).</p>
  </div>
  <style>.vas{stroke-dasharray:30 14;animation:flow 1.4s linear infinite alternate}</style>`,
  notes: {
    tp: 'A living example: Indian epic stories are part of public life in Thailand today.',
    q: 'Where else in this chapter did we meet the word Suvarṇabhūmi?',
    mis: 'That these stories are only “Indian”. They have become part of Thai culture too.',
    s20: 'At Bangkok’s Suvarnabhumi Airport, a giant sculpture shows the churning of the ocean from Hindu tradition. Even the airport’s name recalls the ancient “golden land”.',
  },
});

/* ---------- MALAYSIA ---------- */
S({
  id: 'mys', title: 'India & Malaysia: across the Bay of Bengal', sec: 'Maritime · Malaysia', num: '17', view: [[78, -4, 120, 18], 'rr'],
  countries: focusSpec('MYS', 'seaN'), base: 'dimmed',
  html: `${photo('petronas', 'left:80px;top:70px;width:470px;height:620px', 'Petronas Towers, Kuala Lumpur')}
  <div class="panel glass" style="left:590px;top:70px;width:560px;padding:32px 34px">
    <div class="kicker"><b>17</b> The Malay Peninsula</div>
    <h2 style="font-size:50px">Two millennia of sea links</h2>
    <ul class="pts" style="gap:12px">
      <li style="font-size:24px">Linked to India by <b>sea routes across the Bay of Bengal</b> for over 2,000 years</li>
      <li style="font-size:24px">Early Hindu and Buddhist influence; names like ‘<b>Srivijaya</b> Kingdom’</li>
      <li style="font-size:24px">Around the <b>4th century CE</b>, a script based on India’s <b>Brāhmī</b> was adopted</li>
      <li style="font-size:24px">By the 15th century, Islam became the main religion</li>
    </ul>
  </div>
  <div class="cards" style="position:absolute;left:80px;top:720px;width:1070px;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="card" data-in style="--d:.3;padding:18px 22px"><span class="lab">People</span><p style="font-size:21px">In the 19th–20th centuries many south Indian workers went to the rubber plantations; <b>9%</b> of Malaysians are of Indian origin</p></div>
    <div class="card" data-in style="--d:.45;padding:18px 22px"><span class="lab">Trade</span><p style="font-size:21px">India is one of Malaysia’s largest trading partners: palm oil, energy, infrastructure, IT</p></div>
    <div class="card" data-in style="--d:.6;padding:18px 22px"><span class="lab">Strategic partners</span><p style="font-size:21px">Working on regional security and maritime stability</p></div>
  </div>`,
  enter() {
    label([102.3, 4.6], 'Malaysia', 'sea'); label([79.5, 15.5], 'India', 'india');
    route([[80.6, 12.8], [88, 9], [95, 6.2], [100.2, 4.6], [101.69, 3.14]], { type: 'sea', dur: 2, mover: [{ text: 'Brāhmī script', speed: 90 }, { kind: 'ship', speed: 90, gap: 2.5 }] });
    pin(101.69, 3.14, 'Kuala Lumpur', 'city', 1);
  },
  notes: {
    tp: 'Ancient sea links (script, faith) and modern links (people, trade, strategy) together.',
    q: 'Why would a script travel across the sea? Who would carry it?',
    mis: 'That cultural influence disappears when religion changes. Indian influence remains visible in Malaysian art and literature.',
    s20: 'For 2,000 years, ships crossed the Bay of Bengal to the Malay Peninsula. Around the 4th century CE a script based on Brāhmī was adopted. Today 9% of Malaysians are of Indian origin, and the two countries are trading and strategic partners.',
  },
});

/* ---------- SINGAPORE ---------- */
S({
  id: 'sgp', title: 'India & Singapore: the Lion City', sec: 'Maritime · Singapore', num: '18', map: 'hide',
  html: `<div class="bg" style="background:linear-gradient(180deg,#071a3a 0%,#0c2c5a 60%,#0a3a5a 100%)"></div>
  <svg viewBox="0 0 1920 1080" style="position:absolute;inset:0" aria-hidden="true">
    <g fill="#10335f" opacity=".9">${Array.from({ length: 34 }, (_, i) => { const x = i * 58, h = 160 + ((i * 97) % 300); return `<rect x="${x}" y="${860 - h}" width="50" height="${h}" rx="4"/>`; }).join('')}</g>
    <g fill="#5cc8ff" opacity=".35">${Array.from({ length: 120 }, (_, i) => `<rect x="${(i * 173) % 1900 + 8}" y="${560 + (i * 61) % 280}" width="8" height="5"/>`).join('')}</g>
    <rect y="860" width="1920" height="220" fill="#06223f"/><path d="M0,900 H1920" stroke="#5cc8ff" stroke-width="2" opacity=".4"/>
    <g stroke="#5cc8ff" stroke-width="1" opacity=".15">${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 100},0 V1080"/>`).join('')}${Array.from({ length: 11 }, (_, i) => `<path d="M0,${i * 100} H1920"/>`).join('')}</g>
  </svg>
  <div class="panel" style="width:860px;top:70px">
    <div class="kicker" data-in><b>18</b> India &amp; Singapore</div>
    <h2 data-in style="--d:.1;font-size:66px">Singapuram, the ‘lion city’</h2>
    <p class="lead" data-in style="--d:.25;font-size:26px">An ancient kingdom off the southern tip of today’s Malaysia, visited by Buddhist monks and traders a few centuries BCE. It became a British colony, then part of Malaysia, and a separate nation in <b>1965</b>. Tap the city:</p>
  </div>
  <div class="hots"></div>
  <div class="panel glass sgCard" style="left:auto;right:70px;top:70px;width:640px;padding:30px 34px;min-height:250px">
    <span class="lab" style="font:600 18px var(--mono);letter-spacing:.2em;color:var(--gold)">CITY INTERFACE</span>
    <h4 class="sgT" style="font:700 40px var(--serif);margin:8px 0">Choose a hotspot</h4>
    <p class="sgD" style="font-size:25px;line-height:1.4;color:var(--ink2)">Each glowing point shows one connection between India and Singapore.</p>
  </div>
  ${photo('littleindia', 'left:80px;top:420px;width:560px;height:400px', 'Little India, Singapore')}`,
  init(el) {
    const H = [
      [760, 470, 'தமிழ் Tamil', 'An official language', 'Signs appear in four official languages: English, Mandarin, Tamil and Malay. What does that tell you about south India and Singapore?'],
      [980, 560, '🏘', 'Little India', 'About 9% of Singapore’s residents are of Indian origin; many live in the area called ‘Little India’.'],
      [1180, 430, '🌳', 'Urban planning', 'A benchmark for planning: litter-free streets (heavy fines for littering or jaywalking), parks, walkways and terrace gardens.'],
      [1380, 600, '📈', 'Investment', 'One of the largest foreign investors in India, especially in infrastructure and technology; many Indian companies have offices in Singapore.'],
      [1560, 470, '🎓', 'Students & tourists', 'A preferred destination for Indian students for higher studies, and for large numbers of Indian tourists.'],
      [1720, 640, '☸', 'Culture & faith', 'India’s presence is visible in art, cuisine and religion. Buddhism is currently the most widely practised religion.'],
    ];
    const box = $('.hots', el);
    H.forEach(h => {
      const b = html(`<button class="hot" style="position:absolute;left:${h[0]}px;top:${h[1]}px;transform:translate(-50%,-50%);width:74px;height:74px;border-radius:50%;background:rgba(92,200,255,.18);border:2px solid #5cc8ff;box-shadow:0 0 0 0 rgba(92,200,255,.6);animation:hotP 2.2s infinite;font-size:26px" aria-label="${h[3]}">${h[2].length > 3 ? 'த' : h[2]}</button>`);
      b.onclick = () => { $('.sgT', el).textContent = h[3]; $('.sgD', el).textContent = h[4]; $$('.hot', el).forEach(x => x.style.background = x === b ? 'rgba(242,181,68,.5)' : ''); };
      box.appendChild(b);
    });
  },
  notes: {
    tp: 'A modern, planned city with deep Indian connections: language, community, investment, education.',
    q: 'Tamil is one of Singapore’s official languages. What does this suggest about the relationship between south India and Singapore?',
    mis: 'That “Singapore” is an English name. It comes from Singapuram, “lion city”.',
    s20: 'Singapore’s name comes from Singapuram, the lion city. Tamil is an official language, about 9% of residents are of Indian origin, and Singapore is one of India’s largest foreign investors.',
  },
});

/* ---------- INDONESIA ---------- */
S({
  id: 'idn', title: 'India & Indonesia: an island world', sec: 'Maritime · Indonesia', num: '19', view: ['idn', 'r'],
  countries: focusSpec('IDN', 'seaN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:60px">
    <div class="kicker"><b>19</b> The Indonesian archipelago</div>
    <h2 style="font-size:56px">An <em class="t">archipelago</em>: an island world</h2>
    <p class="lead" style="font-size:26px">Not one landmass but several large islands and <b>over <span class="isl2">0</span> smaller ones</b>, separated from India by the Bay of Bengal and the Andaman Sea.</p>
    <ul class="pts" style="gap:12px">
      <li style="font-size:24px">Trade with <b>Java</b> and <b>Sumatra</b> over 2,000 years ago</li>
      <li style="font-size:24px">India’s <b>Nālandā</b> collaborated with Indonesia’s <b>Muara Jambi</b> temple complex</li>
      <li style="font-size:24px">Later, <b>Islam</b> travelled to Indonesia from the shores of India</li>
      <li style="font-size:24px"><b>Garuḍa</b>, Viṣhṇu’s vāhana, is the national symbol on the rupiah; the <b>Rāmāyaṇa</b> is performed on stage</li>
    </ul>
  </div>
  ${photo('borobudur', 'right:60px;bottom:110px;width:760px;height:300px', 'Borobudur Stūpa: 8th–9th c. CE, over 500 Buddha statues, a mandala in stone')}`,
  enter(el, c) {
    c.after(.4, () => counter($('.isl2', el), 17000, 1.8));
    label([113.5, -1], 'Indonesia', 'sea'); label([80, 20], 'India', 'india');
    label([101.5, -0.6], 'Sumatra', 'sm', .6); label([110.3, -7.4], 'Java', 'sm', .8);
    route([[85.44, 25.14], [87.9, 21.4], [91, 15], [95.5, 7], [99, 2.5], [103.6, -1.48]], { type: 'culture', dur: 2.4, mover: { text: 'Nālandā ↔ Muara Jambi', speed: 110 } });
    pin(103.6, -1.48, 'Muara Jambi', 'city', 1.6); pin(110.2, -7.6, 'Borobudur', 'city', 1.8); pin(85.44, 25.14, 'Nālandā', 'city left', .6);
  },
  notes: {
    tp: 'Introduce the word archipelago. Then show the cultural links: Nālandā–Muara Jambi, the Rāmāyaṇa, Garuḍa, Borobudur.',
    q: 'Why is the national symbol of Indonesia, Garuḍa, interesting for an Indian student?',
    mis: 'That Indonesia is one big island. It is an archipelago of over 17,000 islands.',
    s20: 'Indonesia is an archipelago: several big islands and over 17,000 small ones. Trade with Java and Sumatra began over 2,000 years ago. Borobudur is the world’s largest Buddhist monument, and Garuḍa appears on Indonesian money.',
  },
});

const QUAKE = [95.85, 3.3];
S({
  id: 'tsunami', title: '26 December 2004: the tsunami', sec: 'Maritime · Indonesia', num: '19', view: ['tsunami', 'r'],
  countries: neighbourSpec({ IDN: 'seaN focus keep' }), base: 'dimmed',
  html: `<div class="panel glass" style="width:760px;top:60px">
    <div class="kicker">Disaster → shared challenge → cooperation</div>
    <h2 style="font-size:54px">How a tsunami crosses an ocean</h2>
    <p class="lead" style="font-size:25px">On <b>26 December 2004</b>, a powerful earthquake under the Indian Ocean near Indonesia set off a massive tsunami. Indonesia is one of the most <b>earthquake-prone</b> countries in the world.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:18px 0">
      <div class="stat"><span class="n" style="font-size:58px">~15,000</span><span class="u" style="font-size:21px">lives lost in India: Tamil Nadu, Kerala, Andaman &amp; Nicobar</span></div>
      <div class="stat"><span class="n" style="font-size:58px">200,000+</span><span class="u" style="font-size:21px">people killed across the region</span></div>
    </div>
    <button class="btn" id="tsPlay">▶ Play the wave</button>
    <div class="tsAfter" style="opacity:0;transition:opacity .8s;margin-top:18px">${chain(['Disaster', 'Shared challenge', 'Cooperation'])}
      <p class="lead" style="font-size:23px;margin-top:14px">India joined Indonesia, Sri Lanka, Thailand and others to build a network of <b>sensors, satellites and communication links</b>. The <b>Indian Tsunami Early Warning Centre in Hyderabad</b> alerts India and her neighbours.</p></div>
  </div>`,
  init(el) { $('#tsPlay', el).onclick = () => this.play(); },
  play() {
    clearFX(); const el = this.el;
    pin(QUAKE[0], QUAKE[1], 'Earthquake', 'pulse tag', 0);
    const rings = [0, 1, 2, 3].map(() => ring(QUAKE[0], QUAKE[1]));
    const t0 = performance.now(), D = RM ? 10 : 7000;
    const hits = [[80.27, 13.08, 'Tamil Nadu', 2400], [92.7, 11.6, 'Andaman & Nicobar', 900], [81.7, 7.5, 'Sri Lanka', 1900], [98.3, 7.9, 'Thailand', 1100], [76.3, 9.5, 'Kerala', 3800], [73.5, 4.2, 'Maldives', 4200]];
    hits.forEach(h => ctx.after(h[3] / 1000 * D / 7000, () => pin(h[0], h[1], h[2], 'tag ' + (h[2] === 'Kerala' || h[2] === 'Maldives' ? 'left' : ''), 0)));
    const step = now => {
      if (SLIDES[cur] !== this) return;
      const t = Math.min(1, (now - t0) / D);
      rings.forEach((r, i) => { const tt = Math.max(0, t - i * .06); r.r = tt * 2600; r.c.setAttribute('opacity', Math.max(0, .9 - tt * .9)); r.c.setAttribute('stroke-width', 5 - i); r.update(); });
      if (t < 1) requestAnimationFrame(step);
      else {
        $('.tsAfter', el).style.opacity = 1; playChain($('.tsAfter', el), .9, 0);
        const H = [78.47, 17.38]; pin(H[0], H[1], 'Hyderabad: Early Warning Centre', 'city', 0);
        [[95.3, 5.5], [81.7, 7.5], [100.5, 13.75], [73.5, 4.2], [92.7, 11.6]].forEach((p, i) => route([H, p], { type: 'aid', bulge: .12, del: .3 + i * .2, dur: 1.2, cls: 'thin', mover: { kind: 'dot', speed: 160 } }));
      }
    };
    requestAnimationFrame(step);
  },
  enter(el) { $('.tsAfter', el).style.opacity = 0; label('IND', 'India', 'india'); label([113.5, -1], 'Indonesia', 'sea'); },
  notes: {
    tp: 'A disaster in one place affected the whole region. That shared challenge became a reason to cooperate on early warning.',
    q: 'How do shared challenges become opportunities for cooperation?',
    mis: 'That a tsunami is one big wave near the coast. It travels across the whole ocean and reaches distant countries hours later.',
    s20: 'In 2004, an undersea earthquake near Indonesia sent a tsunami across the Indian Ocean. About 15,000 people died in India and over 200,000 across the region. Now India works with its neighbours on an early warning network run from Hyderabad.',
  },
});

/* ---------- IRAN ---------- */
S({
  id: 'iran', title: 'India & Iran: an ancient neighbour', sec: 'Maritime · Iran', num: '20', view: ['iran', 'r'],
  countries: focusSpec('IRN', 'seaN', { AFG: 'landN keep', PAK: 'ghost' }), base: 'dimmed',
  html: `<div class="panel glass" style="width:780px;top:60px">
    <div class="kicker"><b>20</b> An ancient neighbour</div>
    <h2 style="font-size:56px">From the Bronze Age to Chabahar</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card" style="padding:20px 22px"><span class="lab">Ancient</span><p style="font-size:22px">Trade and cultural exchange across the Iranian plateau since the <b>Bronze Age</b>; routes became part of the <b>Silk Route</b>. Iran’s ports were within easy reach of India’s west coast.</p></div>
      <div class="card" style="padding:20px 22px"><span class="lab">Language &amp; texts</span><p style="font-size:22px">The <b>Avesta</b> parallels the <b>Ṛigveda</b>; the Mahābhārata calls Persians <b>Pārasīka</b>; Persian (same family as Sanskrit) was a court language of the Mughals. The <b>Parsis</b> are a living link.</p></div>
    </div>
    <div class="chips" style="margin-top:16px"><span class="chip g">Trade routes</span><span class="chip g">Silk Route</span><span class="chip g">Language</span><span class="chip g">Art</span><span class="chip g">Food</span><span class="chip g">Culture</span></div>
    <div class="card" style="margin-top:18px;border-color:rgba(183,156,255,.6)"><span class="lab" style="color:var(--infra)">Modern: Chabahar Port</span><p style="font-size:23px">India is helping develop Iran’s <b>Chabahar Port</b>, giving better access to <b>Afghanistan and Central Asia</b>, with cooperation in trade, energy and transport.</p></div>
  </div>`,
  enter() {
    label('IRN', 'Iran', 'sea'); label('AFG', 'Afghanistan', 'sm'); label([77, 24], 'India', 'india'); label([64, 39.6], 'Central Asia', 'sm', 2.6);
    route([[72.9, 19.0], [68, 21.5], [63, 24], [60.64, 25.3]], { type: 'sea', dur: 1.6, mover: { kind: 'ship', speed: 90 } });
    route([[60.64, 25.3], [61.2, 28], [61.86, 30.96], [63.42, 32.17], [65.7, 31.62], [66.5, 35], [66.9, 37.5], [65, 39.2]], { type: 'infra', dur: 2.4, del: 1.4, mover: { kind: 'truck', speed: 90 } });
    route([[72.83, 33.75], [69.17, 34.53], [66.9, 36.75], [61.8, 37.6], [58.8, 36.2], [51.4, 35.7]], { type: 'culture', dur: 2.4, del: .6, cls: 'thin', mover: { text: 'Silk Route', speed: 80 } });
    pin(60.64, 25.3, 'Chabahar Port', 'tag', 1.2); pin(72.9, 19.0, 'Mumbai', 'city left', .4);
  },
  notes: {
    tp: 'Iran shows both ancient links (Silk Route, language, Parsis) and a modern project (Chabahar) that reaches Afghanistan and Central Asia.',
    q: 'Why would India want a port in Iran to reach Afghanistan?',
    mis: 'That Persian and Sanskrit are unrelated. They belong to the same language family.',
    s20: 'India and Iran have been linked since the Bronze Age by land, the Silk Route and the sea. Their languages are related. Today India is helping develop Chabahar Port, a gateway to Afghanistan and Central Asia.',
  },
});

/* ---------- OMAN ---------- */
S({
  id: 'oman', title: 'India & Oman: the land of copper', sec: 'Maritime · Oman', num: '21', view: ['oman', 'r'],
  countries: focusSpec('OMN', 'seaN'), base: 'dimmed',
  html: `<div class="panel glass" style="width:790px;top:60px">
    <div class="kicker"><b>21</b> The ‘Land of Copper’</div>
    <h2 style="font-size:56px">5,000 years across the Arabian Sea</h2>
    <div class="mini" style="margin-top:6px">${chain(['Indus-Sarasvatī', 'Copper trade', 'Arabian Sea', 'Modern partnership'])}</div>
    <div style="display:grid;grid-template-columns:200px 1fr;gap:22px;align-items:center;margin-top:20px">
      <svg viewBox="0 0 200 130" aria-label="A plano-convex copper ingot"><ellipse cx="100" cy="80" rx="90" ry="34" fill="#7a3f1d"/><path d="M10,80 Q100,0 190,80 Q100,112 10,80Z" fill="#b8642c"/><path d="M40,64 Q100,30 160,64" stroke="#e3a06b" stroke-width="5" fill="none" opacity=".7"/></svg>
      <p style="font-size:22px;line-height:1.4;color:var(--ink2)">Oman is rich in copper. It is thought <b>Harappan traders</b> brought back copper <b>ingots</b> (blocks of metal shaped for transport) to the coppersmiths of the Indus-Sarasvatī cities, 3rd millennium BCE.</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:16px">
      <div class="card" style="padding:16px 18px"><span class="lab">People</span><p style="font-size:20px">Over <b>10%</b> of Oman’s population is of Indian origin</p></div>
      <div class="card" style="padding:16px 18px"><span class="lab">Faith</span><p style="font-size:20px"><b>Motishwar Mandir</b>, a Śhiva temple in Muscat (early 20th c.)</p></div>
      <div class="card" style="padding:16px 18px"><span class="lab">Defence</span><p style="font-size:20px">India’s closest Gulf defence partner; joint exercises with <b>all three armed forces</b>; maritime security</p></div>
    </div>
  </div>`,
  enter(el) {
    playChain(el, .9, .4);
    label('OMN', 'Oman', 'sea'); label([77.5, 20], 'India', 'india');
    route([[68.5, 23.5], [64, 23.6], [60.5, 23.4], [58.6, 23.65]], { type: 'trade', dur: 1.8, del: .4, mover: [{ text: 'copper', speed: 70, back: true, color: '#e3a06b' }, { kind: 'ship', speed: 70, gap: 2.6 }] });
    pin(71.0, 23.6, 'Indus-Sarasvatī cities', 'city', 1.2); pin(58.59, 23.61, 'Muscat', 'city left', 1);
    label([63, 18.5], 'ARABIAN SEA', 'water', .6);
  },
  notes: {
    tp: 'A 5,000-year-old connection that is still active: copper trade then, defence and maritime security now.',
    q: 'Why would ancient Harappan coppersmiths need metal from across the sea?',
    mis: 'That India–Gulf ties are only about oil and jobs today. They go back to the Indus-Sarasvatī civilisation.',
    s20: 'Over 5,000 years ago Harappan traders likely brought copper ingots from Oman. Today over 10% of Oman’s people are of Indian origin, Muscat has a Śhiva temple, and Oman is India’s closest defence partner in the Gulf.',
  },
});

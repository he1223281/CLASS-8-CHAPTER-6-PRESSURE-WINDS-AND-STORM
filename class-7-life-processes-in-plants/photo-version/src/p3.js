/* ===================== STOMATA ===================== */
const STOMA=`<svg viewBox="0 0 1000 520"><rect width="1000" height="520" fill="#fff"/>
 ${[0,1].map(i=>{const cx=250+i*500,open=i===0,g=open?34:8;return`
 <path d="M${cx-230} 70L${cx-120} 40L${cx} 70L${cx+120} 40L${cx+230} 70V450L${cx+120} 480L${cx} 450L${cx-120} 480L${cx-230} 450Z" fill="#eef2fb" stroke="#8a86c0" stroke-width="3"/>
 <path d="M${cx-230} 200L${cx-120} 170M${cx+120} 170L${cx+230} 200M${cx-230} 330L${cx-130} 360M${cx+130} 360L${cx+230} 330M${cx-120} 40V170M${cx+120} 40V170M${cx-130} 360L${cx-120} 480M${cx+130} 360L${cx+120} 480" stroke="#8a86c0" stroke-width="3" fill="none"/>
 <path d="M${cx-g} 150C${cx-g-90} 160 ${cx-g-90} 380 ${cx-g} 390C${cx-g-30} 330 ${cx-g-30} 210 ${cx-g} 150Z" fill="#a8dca0" stroke="#3f7a45" stroke-width="3"/>
 <path d="M${cx+g} 150C${cx+g+90} 160 ${cx+g+90} 380 ${cx+g} 390C${cx+g+30} 330 ${cx+g+30} 210 ${cx+g} 150Z" fill="#a8dca0" stroke="#3f7a45" stroke-width="3"/>
 <path d="M${cx-g} 150C${cx-g+ (open?-28:-2)} 210 ${cx-g+(open?-28:-2)} 330 ${cx-g} 390L${cx+g} 390C${cx+g+(open?28:2)} 330 ${cx+g+(open?28:2)} 210 ${cx+g} 150Z" fill="#2b2350"/>
 ${[[-50,200],[-58,260],[-50,320],[50,200],[58,260],[50,320]].map(([dx,y])=>`<circle cx="${cx+dx+(dx<0?-g+34:g-34)}" cy="${y}" r="9" fill="#2f9a45"/>`).join('')}
 <text x="${cx}" y="512" text-anchor="middle" class="dgt">${open?'Stoma open':'Stoma closed'}</text>`;}).join('')}
 ${LB(250,270,250,20,'Stomatal pore',1,'middle')}${LB(176,330,40,420,'Guard cell',2,'start')}${LB(192,260,40,120,'Chloroplast',3,'start')}${LB(420,420,500,500,'Epidermal cell',4,'middle')}</svg>`;
S({id:'stomata',sec:'10.2 Stomata',title:'Stomata — structure',head:'10.2.4 Stomata: tiny pores for gas exchange',zoom:true,
 notes:'Each stoma has two bean-shaped guard cells. They contain chloroplasts (epidermal cells do not).',
 html:`<div class="grid2" style="grid-template-columns:1.3fr 1fr">${FIG(STOMA,'Structure of a stoma (as seen in a leaf peel)')}
  <div class="stack">${DEF('Stomata','Tiny pores present mostly on the <b>lower surface</b> of leaves, through which gases are exchanged. (singular: stoma)')}
   ${PTS(['Each stoma is surrounded by two <b>guard cells</b>.','Guard cells <b>open and close</b> the pore.','Photosynthesis: <b>CO₂ in, O₂ out</b>. Respiration: <b>O₂ in, CO₂ out</b>.'],5)}
   ${NOTE(['Stomata help in the exchange of gases.','Two guard cells control each stoma.'],8)}</div></div>`});

S({id:'a106',sec:'10.2 Stomata',title:'Activity 10.6 — Leaf peel',head:'Activity 10.6: Observing stomata in a leaf peel',
 notes:'Rhoeo (Tradescantia spathacea) peels easily — the purple lower surface makes cells easy to see.',
 html:`<div class="grid2" style="grid-template-columns:.9fr 1.1fr">${PH('rhoeo','Rhoeo — its lower surface peels easily',{})}
  <div class="stack" style="gap:12px"><div class="steps">${['Take a leaf of rhoeo, money plant, onion, hibiscus, coleus or grass.','Peel a thin layer from the <b>lower surface</b>; keep it in water in a watch glass.','Put a drop of water on a slide and transfer the peel with <b>forceps</b>.','Add a drop of <b>ink</b> (stain), cover with a <b>coverslip</b>.','Observe under a <b>microscope</b>: you will see tiny pores — <b>stomata</b>.'].map((t,i)=>`<div class="step rv on" data-s="${i+1}"><div class="n">${i+1}</div><div>${t}</div></div>`).join('')}</div>
   <div class="rv" data-s="6">${VSLOT('stomata under microscope leaf peel')}</div></div></div>`});

/* ===================== 10.3 TRANSPORT ===================== */
const TRANS=`<svg viewBox="0 0 1100 640"><rect width="1100" height="640" fill="#fff"/><rect y="460" width="560" height="180" fill="#efe3d0"/>
 <path d="M280 460V80" stroke="#3d8a3a" stroke-width="22"/><path d="M272 460V90" stroke="#3b8eea" stroke-width="5"/><path d="M289 90V460" stroke="#e08e1b" stroke-width="5"/>
 <path d="M280 460C270 520 240 560 200 610M280 470C300 520 330 560 380 600" stroke="#b08a5a" stroke-width="7" fill="none"/>
 ${[[280,330,-1],[280,250,1],[280,170,-1],[280,110,1]].map(([x,y,s])=>`<path d="M${x} ${y}C${x+s*60} ${y-50} ${x+s*160} ${y-30} ${x+s*190} ${y+10}C${x+s*140} ${y+36} ${x+s*60} ${y+26} ${x} ${y}Z" fill="#6cc35f" stroke="#3f7a2a" stroke-width="3"/>`).join('')}
 ${ARW('M250 560V200','#3b8eea',6)}${ARW('M312 140V420','#e08e1b',6)}
 <text x="40" y="380" class="dgt" style="fill:#1e5fb3">Xylem ↑</text><text x="40" y="408" class="dts">water + minerals</text><text x="40" y="432" class="dts">roots → leaves</text>
 <text x="340" y="380" class="dgt" style="fill:#b06a00">Phloem</text><text x="340" y="408" class="dts">food</text><text x="340" y="432" class="dts">leaves → all parts</text>
 <circle cx="850" cy="300" r="210" fill="#e6f3d6" stroke="#4c9a4a" stroke-width="10"/>
 ${Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,x=850+Math.cos(a)*140,y=300+Math.sin(a)*140,r=a*180/Math.PI;return`<g transform="translate(${x} ${y}) rotate(${r+90})"><ellipse cy="-26" rx="30" ry="20" fill="#ffd9a0" stroke="#c08030" stroke-width="2"/><ellipse cy="12" rx="28" ry="24" fill="#a9ccff" stroke="#3a6fc0" stroke-width="2"/>${[[-10,8],[8,10],[0,22]].map(([p,q])=>`<circle cx="${p}" cy="${q}" r="6" fill="#3a6fc0"/>`).join('')}</g>`}).join('')}
 ${LB(990,300,1060,560,'Xylem',1,'end')}${LB(1013,300,1060,40,'Phloem',2,'end')}${LB(850,300,850,600,'Pith',3,'middle')}
 <text x="850" y="40" text-anchor="middle" class="dgt">T.S. of a stem</text></svg>`;
S({id:'trans',sec:'10.3 Transport in plants',title:'Xylem and phloem',head:'10.3 Transport in plants',zoom:true,
 notes:'Xylem carries water up; phloem carries food to all parts — up and down.',
 html:`<div class="grid2" style="grid-template-columns:1.3fr 1fr">${FIG(TRANS,'Transport in a plant (left) and the arrangement of xylem and phloem in a stem (right)')}
  <div class="stack">${DEF('Xylem','Tube-like tissue that carries <b>water and dissolved minerals</b> from the roots to the stem, branches and leaves.',4)}
   ${DEF('Phloem','Tube-like tissue that carries <b>food</b> made in the leaves to all parts of the plant.',5)}
   ${NOTE(['Xylem: water + minerals, upward from roots.','Phloem: food, from leaves to all parts (stored in roots, stems, seeds).'],6)}</div></div>`});

const INK=`<svg viewBox="0 0 1200 560"><rect width="1200" height="560" fill="#fff"/>
 ${[0,1].map(i=>{const x=180+i*360,red=i===1;const st=red?'#c8364a':'#3d8a3a';return`
 <path d="M${x} 520V120" stroke="${st}" stroke-width="10"/>${[0,1,2].map(j=>`<path d="M${x} ${420-j*90}q${j%2?60:-60} -14 ${j%2?90:-90} -4q${j%2?-40:40} 20 ${j%2?-90:90} 4z" fill="#58a845" stroke="${red?'#c8364a':'#3f7a2a'}" stroke-width="3"/>`).join('')}
 ${[0,72,144,216,288].map(a=>`<ellipse cx="${x}" cy="88" rx="16" ry="30" fill="${red?'#f7bcc7':'#fff'}" stroke="${red?'#c8364a':'#bbb'}" stroke-width="2" transform="rotate(${a} ${x} 118)"/>`).join('')}<circle cx="${x}" cy="118" r="9" fill="#FFD166"/>
 <path d="M${x-80} 360L${x-66} 540H${x+66}L${x+80} 360" fill="rgba(220,238,255,.5)" stroke="#7a9cc0" stroke-width="4"/><path d="M${x-72} 460L${x-68} 536H${x+68}L${x+72} 460Z" fill="${red?'#e0475b':'#9fd0ff'}" opacity=".8"/>
 <text x="${x}" y="556" text-anchor="middle" class="dgt">${red?'B — red ink':'A — water'}</text>`;}).join('')}
 <circle cx="870" cy="200" r="100" fill="#e6f3d6" stroke="#4c9a4a" stroke-width="6"/>${Array.from({length:8},(_,i)=>{const a=i/8*6.283;return`<circle cx="${870+Math.cos(a)*62}" cy="${200+Math.sin(a)*62}" r="15" fill="#d7334b"/>`}).join('')}
 <path d="M548 260L780 230" stroke="#142B45" stroke-width="2" stroke-dasharray="6 6"/><text x="870" y="330" text-anchor="middle" class="dts">cut stem of B</text>
 ${LB(590,300,700,420,'Red colour in stem, leaves, flowers',1)}${LB(932,200,900,40,'Xylem stained red',2,'middle')}</svg>`;
S({id:'a107',sec:'10.3 Transport in plants',title:'Activity 10.7 — Red ink',head:'Activity 10.7: How does water move up?',
 notes:'Use twigs with white flowers (white sadabahar or balsam). Cut the stems obliquely under water.',
 html:`<div style="display:grid;grid-template-columns:.75fr 1.4fr;gap:26px;height:790px">
  <div style="display:grid">${PH('balsam','Balsam — twigs used in this activity',{})}</div>
  <div class="stack">${FIG(INK,'Twigs in water (A) and in red-ink water (B), after one day',{style:'height:500px'})}
   ${PTS(['Twig B shows <b>red colour</b> in its stem, leaves and flowers.','The cut stem shows <b>red-stained tubes</b> — the <b>xylem</b>.'],3)}
   <div class="concl rv" data-s="5" style="font-size:25px;padding:14px 22px">Water and dissolved minerals move up through the <b>xylem</b>.</div></div></div>`});

S({id:'store',sec:'10.3 Transport in plants',title:'Food storage',head:'Food made in leaves is stored',
 notes:'Test a potato slice with iodine — it turns blue-black.',
 html:`<div class="grid2">${PH('potato','Potato tubers store starch',{})}
  <div class="stack">${PTS(['Food (glucose) is made in the <b>leaves</b>.','The <b>phloem</b> carries it to other parts.','Extra food is stored as <b>starch</b> in roots (carrot, radish), stems (potato), and seeds (wheat, rice, pulses).','A potato slice turns <b>blue-black</b> with iodine.'],1)}
   <table class="tb rv" data-s="5"><tr><th></th><th>Xylem</th><th>Phloem</th></tr><tr><td><b>Carries</b></td><td>Water, minerals</td><td>Food</td></tr><tr><td><b>Direction</b></td><td>Roots → upwards</td><td>Leaves → all parts</td></tr><tr><td><b>Shown by</b></td><td>Red ink activity</td><td>Starch in potato</td></tr></table></div></div>`});

/* ===================== 10.4 RESPIRATION ===================== */
const RESP=`<svg viewBox="0 0 1200 560"><rect width="1200" height="560" fill="#fff"/>
 <path d="M200 160V110H260V160L380 500H80Z" fill="rgba(220,238,255,.5)" stroke="#7a9cc0" stroke-width="5" stroke-linejoin="round"/>
 <path d="M95 460Q130 448 165 460T235 460T305 460T368 460L380 500H80Z" fill="#fafafa" stroke="#d6dde5" stroke-width="2"/>
 ${Array.from({length:14},(_,i)=>`<ellipse cx="${115+i*18}" cy="${452-(i%2)*6}" rx="10" ry="7" fill="#6aa83f" stroke="#3c7a26" stroke-width="2"/><path d="M${118+i*18} ${458}q4 10 0 18" stroke="#f7efd9" stroke-width="3" fill="none"/>`).join('')}
 <rect x="188" y="92" width="84" height="30" rx="6" fill="#8a3e20"/>
 <path d="M246 100V40H560V220" stroke="#7a9cc0" stroke-width="10" fill="none" stroke-linejoin="round"/><path d="M214 100V60" stroke="#7a9cc0" stroke-width="10"/>
 <path d="M530 200V470a30 30 0 0060 0V200" fill="rgba(220,238,255,.5)" stroke="#7a9cc0" stroke-width="4"/><path d="M533 330V470a27 27 0 0054 0V330Z" fill="#f4f2ea"/>
 <rect x="522" y="190" width="76" height="24" rx="5" fill="#8a3e20"/>
 <path d="M760 200V470a30 30 0 0060 0V200" fill="rgba(220,238,255,.5)" stroke="#7a9cc0" stroke-width="4"/><path d="M763 330V470a27 27 0 0054 0V330Z" fill="#cfe8f7"/>
 ${[0,1,2].map(k=>`<circle cx="${560}" cy="${440-k*30}" r="5" fill="#fff" stroke="#999"/>`).join('')}
 ${LB(150,452,40,380,'Germinating moong seeds',1,'start')}${LB(300,470,40,530,'Wet cotton',2,'start')}${LB(330,360,420,300,'Conical flask',3)}${LB(400,40,400,10,'Delivery tube',4,'middle')}
 ${LB(587,420,640,520,'Turns milky',5)}${LB(812,400,880,330,'Not connected: stays clear',6)}</svg>`;
S({id:'a108',sec:'10.4 Respiration',title:'Activity 10.8 — Do plants respire?',head:'10.4 Do plants respire? Activity 10.8',zoom:true,
 notes:'Teacher demonstration. Keep the set-up in the dark for 24 hours so that no photosynthesis takes place.',
 html:`<div style="display:grid;grid-template-columns:.7fr 1.35fr 1fr;gap:24px;height:790px">
  <div style="display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:18px">${PH('moong','Moong plant',{})}${PH('moongpod','Moong pods — seeds used for germination',{sci:false})}</div>
  <div style="display:grid">${FIG(RESP,'Germinating seeds give out carbon dioxide')}</div>
  <div class="stack" style="gap:12px">${PTS(['Soak moong seeds overnight; put them on wet cotton in a conical flask.','Connect the flask to a test tube of <b>lime water</b>; keep another tube of lime water for comparison.','Leave it in the <b>dark for 24 hours</b>.'],7)}
   <div class="concl rv" data-s="10" style="font-size:25px;padding:14px 20px">Lime water turns <b>milky</b> ⇒ germinating seeds release <b>carbon dioxide</b> ⇒ <b>plants respire</b>.</div></div></div>`});

S({id:'respeq',sec:'10.4 Respiration',title:'Respiration',head:'Respiration',
 notes:'Stress: respiration happens in all parts of the plant, day and night.',
 html:`<div class="stack">${DEF('Respiration','The process in which <b>glucose</b> is broken down in the presence of <b>oxygen</b> to release <b>energy</b>; carbon dioxide and water are also produced.')}
  <div class="card" style="text-align:center;padding:26px"><div style="font-size:21px;color:var(--ink2)">Word equation</div><div style="font-size:38px;font-weight:800;margin-top:8px">Glucose + Oxygen ⟶ Carbon dioxide + Water + <span class="fd">Energy</span></div></div>
  <div class="grid2 even" style="height:auto;gap:24px">${PTS(['The energy is used for <b>growth and development</b>.','<b>All parts</b> of a plant respire — green or non-green: roots, stems, leaves, flowers, seeds.','Respiration goes on <b>day and night</b>.'],1)}
   ${NOTE(['Respiration releases energy from food.','Germinating seeds give out CO₂ (lime water turns milky).'],4)}</div></div>`});

S({id:'compare',sec:'10.4 Respiration',title:'Photosynthesis vs respiration',head:'Photosynthesis vs respiration',
 notes:'Textbook Question 1 — students fill it in their notebooks.',
 html:`<table class="tb"><tr><th>Feature</th><th>Photosynthesis</th><th>Respiration</th></tr>
  <tr class="rv" data-s="1"><td><b>Raw materials</b></td><td>Carbon dioxide + water</td><td>Glucose + oxygen</td></tr>
  <tr class="rv" data-s="2"><td><b>Products</b></td><td>Glucose + oxygen</td><td>Carbon dioxide + water + energy</td></tr>
  <tr class="rv" data-s="3"><td><b>Needs</b></td><td>Sunlight and chlorophyll</td><td>Oxygen</td></tr>
  <tr class="rv" data-s="4"><td><b>Where</b></td><td>Green parts (mainly leaves)</td><td>All living parts</td></tr>
  <tr class="rv" data-s="5"><td><b>When</b></td><td>Only in light</td><td>All the time</td></tr>
  <tr class="rv" data-s="6"><td><b>Importance</b></td><td>Makes food; releases oxygen</td><td>Releases energy from food</td></tr>
  <tr class="rv" data-s="7"><td><b>Word equation</b></td><td style="font-size:20px">CO₂ + water → (sunlight, chlorophyll) glucose + O₂</td><td style="font-size:20px">Glucose + O₂ → CO₂ + water + energy</td></tr></table>`});

S({id:'sohonie',sec:'10.4 Respiration',title:'Know a scientist: Kamala Sohonie',head:'Know a scientist: Kamala Sohonie',
 html:`<div class="grid2 even" style="height:auto;align-items:start"><div class="card" style="padding:34px">
   <div class="pill" style="margin-bottom:14px;background:#F3ECFF;color:#7A4CD9">1911–1998 · Biochemist</div>
   ${PTS(['Received a <b>Ph.D. from Cambridge University</b> for work on <b>respiration in plants</b>.','Worked at Lady Hardinge Medical College (New Delhi) and the Nutrition Research Laboratory (Coonoor).','Became Director of the Royal Institute of Science, Bombay.','Improved the nutritive value of plant foods; worked on coconut palm sap as a drink — <b>Neera</b>.'],1)}</div>
  ${NOTE(['Kamala Sohonie: respiration in plants; nutritive value of plant foods; Neera.'],5)}</div>`});

const BOTTLE=`<svg viewBox="0 0 700 600"><rect width="700" height="600" fill="#fff"/>
 <path d="M300 40H400V100Q560 140 560 300V540Q560 570 530 570H170Q140 570 140 540V300Q140 140 300 100Z" fill="rgba(220,238,255,.4)" stroke="#7a9cc0" stroke-width="5"/>
 <rect x="290" y="20" width="120" height="34" rx="8" fill="#a56b3c"/><path d="M146 470H554V540Q554 564 530 564H170Q146 564 146 540Z" fill="#6c4a2a"/>
 ${[0,1,2,3,4,5,6].map(i=>{const a=-150+i*20;const r=a*Math.PI/180;return`<path d="M350 470Q${350+Math.cos(r)*90} ${470+Math.sin(r)*200} ${350+Math.cos(r)*170} ${470+Math.sin(r)*150}" stroke="#3d9a48" stroke-width="12" fill="none" stroke-linecap="round"/>`}).join('')}
 ${ARW('M240 380C190 300 230 220 300 200','#6b7c8f',5)}${ARW('M410 200C480 220 510 300 460 380','#2fb7d0',5)}
 <text x="90" y="250" class="dts" style="fill:#4a5562">CO₂ from respiration</text><text x="90" y="274" class="dts">→ used in photosynthesis</text>
 <text x="430" y="170" class="dts" style="fill:#138a9e">O₂ from photosynthesis</text><text x="430" y="194" class="dts">→ used in respiration</text>
 ${LB(350,36,520,30,'Sealed mouth',1)}${LB(460,520,600,520,'Soil',2)}</svg>`;
S({id:'bottle',sec:'Balance in nature',title:'Bottle garden',head:'Exploratory project: a bottle garden',
 notes:'If the sealed plant keeps growing, gases are being recycled inside the bottle.',
 html:`<div style="display:grid;grid-template-columns:.75fr 1fr 1fr;gap:24px;height:790px">
  <div style="display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:18px">${PH('spider','Spider plant',{})}${PH('jade','Jade plant',{})}</div>
  <div style="display:grid">${FIG(BOTTLE,'Gas exchange inside a sealed bottle garden')}</div>
  <div class="stack">${PTS(['Grow a spider plant or jade plant in a large transparent bottle.','After it grows well, <b>seal</b> the mouth and observe.','If it keeps growing, it is exchanging gases with itself.'],3)}
   ${NOTE(['CO₂ from respiration is used in photosynthesis; O₂ from photosynthesis is used in respiration.','Photosynthesis and respiration keep balance in nature.'],6)}</div></div>`});

S({id:'nutshell',sec:'Summary',title:'In a nutshell',head:'In a nutshell',
 html:`<ul class="pts" style="gap:16px">${['All living organisms need food for energy, growth and development.','Plants use <b>carbon dioxide</b> and <b>water</b>, in the presence of <b>sunlight</b> and <b>chlorophyll</b>, to make <b>glucose</b> and <b>oxygen</b> — photosynthesis.','Leaves are the <b>food factories</b> of plants; food is stored as <b>starch</b>.','<b>Stomata</b> help in the exchange of oxygen and carbon dioxide.','<b>Xylem</b> carries water and minerals from roots; <b>phloem</b> carries food from leaves to all parts.','<b>Respiration</b>: glucose is broken down using oxygen to release energy; carbon dioxide and water are produced.'].map((t,i)=>`<li class="rv" data-s="${i+1}">${t}</li>`).join('')}</ul>`});

const EXQ=[['Imagine all photosynthetic organisms disappeared. What would happen to living organisms?','No new food would be made, so food chains would collapse and animals would starve. Oxygen used in respiration would not be replaced, and carbon dioxide would build up.'],
 ['A potato slice shows starch with iodine. Where does the starch come from? How does it reach the potato?','Food is made in the <b>leaves</b> by photosynthesis, carried by the <b>phloem</b> and stored as <b>starch</b> in the potato (a stem tuber).'],
 ['Does the broad and flat structure of leaves help photosynthesis? Justify.','Yes. A broad, flat leaf has a <b>large surface</b> to receive sunlight and many stomata to take in carbon dioxide.'],
 ['X is broken down using Y to release carbon dioxide, Z and energy. What are X, Y and Z?','X = <b>glucose</b>, Y = <b>oxygen</b>, Z = <b>water</b>.'],
 ['Vani’s plants: (a) sunlight + CO₂, (b) sunlight, no CO₂, (c) dark + CO₂, (d) dark, no CO₂. Where is starch formed and oxygen released?','Only in <b>(a)</b> — it has both sunlight and carbon dioxide.'],
 ['Design an experiment: is water transport quicker in warm or cold conditions?','Keep two similar twigs in equal red-ink water — one in <b>warm</b>, one in <b>cold</b> water; keep all else the same. After a fixed time, compare how far the red colour has risen.'],
 ['Photosynthesis and respiration maintain balance in nature. Discuss.','Photosynthesis uses CO₂ and releases O₂; respiration uses O₂ and releases CO₂. Together they keep these gases in balance.']];
S({id:'ncert',sec:'Summary',title:'NCERT exercises',head:'Let us enhance our learning',
 notes:'Discuss each question; click “Show answer” to reveal.',
 html:`<div class="card" style="padding:20px 30px;max-height:780px;overflow:auto">${EXQ.map(([q,a],i)=>`<div style="padding:12px 0;border-bottom:1px solid #E6EEF7"><p style="font-size:26px"><b>${i+1}.</b> ${q}</p><button class="btn sm exb" style="margin-top:8px">Show answer</button><p class="exa" style="display:none;font-size:24px;color:var(--green2);margin-top:8px">${a}</p></div>`).join('')}</div>`,
 init(el){$$('.exb',el).forEach(b=>b.onclick=()=>{const a=b.nextElementSibling;const on=a.style.display==='none';a.style.display=on?'block':'none';b.textContent=on?'Hide answer':'Show answer';});}});

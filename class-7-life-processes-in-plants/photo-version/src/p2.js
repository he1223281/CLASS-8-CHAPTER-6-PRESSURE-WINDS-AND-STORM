/* ===================== 10.1 HOW DO PLANTS GROW ===================== */
S({id:'grow',sec:'10.1 How do plants grow?',title:'Signs of growth',head:'10.1 How do plants grow?',zoom:true,
 notes:'Play the time-lapse: a potted Oxalis by a window folds its leaves as evening light fades — plants respond to light.',
 html:`<div class="grid2" style="grid-template-columns:1fr 1fr">
  <div style="display:grid;grid-template-rows:minmax(0,1.2fr) minmax(0,1fr);gap:20px">${PH('tomato','A young tomato plant',{})}${VEMB('oxalis','Time-lapse: Oxalis leaves fold as daylight fades','Video: Grateful Hume, CC BY-NC-SA 2.0 · Internet Archive / Flickr')}</div>
  <div class="stack">${DEF('Growth','A permanent increase in the size of a living organism.')}
   <h3>Signs of growth in a plant</h3>${PTS(['New <b>leaves</b> and <b>branches</b> appear.','The plant’s <b>height</b> increases.','The <b>stem</b> becomes thicker.'],1)}
   <div class="q rv" data-s="4" style="font-size:28px"><div class="qm">?</div>What do plants need to grow? Sunlight? Water? Food from soil?</div></div></div>`});

const POTS=`<svg viewBox="0 0 1700 430"><rect width="1700" height="430" fill="#fff"/>
 ${[['A','Sunlight + water',1,1],['B','Sunlight, no water',1,0],['C','Dark + water',0,1]].map(([k,t,sun,wat],i)=>{const x=110+i*560;return`
 <rect x="${x-90}" y="10" width="520" height="410" rx="20" fill="${sun?'#F3FAFF':'#26324a'}"/>
 ${sun?`<circle cx="${x+360}" cy="80" r="34" fill="#FFD166"/>${[0,1,2,3,4,5,6,7].map(a=>`<line x1="${x+360}" y1="80" x2="${x+360+Math.cos(a*.785)*56}" y2="${80+Math.sin(a*.785)*56}" stroke="#F2B200" stroke-width="5"/>`).join('')}`:`<text x="${x+330}" y="90" class="dgt" fill="#fff" style="fill:#fff">Dark</text>`}
 <path d="M${x+40} 300L${x+60} 400H${x+200}L${x+220} 300Z" fill="#c4683f"/><rect x="${x+30}" y="290" width="200" height="22" rx="6" fill="#a8532f"/>
 <rect x="${x+40}" y="296" width="180" height="10" fill="${wat?'#5a3c22':'#b89068'}"/>
 <path d="M${x+130} 300V170" stroke="#3d8a3a" stroke-width="6"/>${[0,1,2,3].map(j=>`<path d="M${x+130} ${280-j*30}q${j%2?50:-50} -14 ${j%2?70:-70} -4q${j%2?-30:30} 18 ${j%2?-70:70} 4z" fill="#58a845"/>`).join('')}
 ${wat?`<g transform="translate(${x-40} 190)"><path d="M0 30h52l14-12 7 5-12 16v24H0z" fill="#3988E8"/><path d="M80 34c-4 6-6 9-6 12a6 6 0 0012 0c0-3-2-6-6-12z" fill="#3b8eea"/></g>`:''}
 <text x="${x+130}" y="${sun?60:60}" text-anchor="middle" class="dgt" style="fill:${sun?'#142B45':'#fff'}">Pot ${k}</text>
 <text x="${x+130}" y="${sun?95:95}" text-anchor="middle" class="dts" style="fill:${sun?'#4A5F78':'#C9D7E5'}">${t}</text>`;}).join('')}</svg>`;
S({id:'a101',sec:'10.1 How do plants grow?',title:'Activity 10.1 — Three pots',head:'Activity 10.1: Do plants need sunlight and water?',
 notes:'The real activity needs two weeks — set it up in advance and record daily.',
 html:`${FIG(POTS,'Experimental set-up: three similar saplings under different conditions',{style:'height:420px'})}
  <div class="grid2 even" style="height:auto;margin-top:18px;gap:24px">
   <div class="card rv" data-s="1" style="padding:16px 24px"><p><b>Method:</b> same pots, same garden soil, similar chilli/tomato saplings. Observe for <b>two weeks</b>: height, number of leaves, leaf colour.</p></div>
   <table class="tb rv" data-s="2"><tr><th>Pot</th><th>After two weeks</th></tr><tr><td><b>A</b></td><td>Grows best; green leaves</td></tr><tr><td><b>B</b></td><td>Wilts; may die</td></tr><tr><td><b>C</b></td><td>Grows less; pale/yellow leaves</td></tr></table></div>
  <div class="concl rv" data-s="3" style="margin-top:16px;font-size:28px">Conclusion: plants need <b>both sunlight and water</b> for growth.</div>`});

S({id:'vrik',sec:'10.1 How do plants grow?',title:'Fascinating fact: Vrikshayurveda',head:'Fascinating fact: Vrikshayurveda',
 html:`<div class="grid2" style="grid-template-columns:1fr 1.1fr">${PH('chilli','Healthy plants need care, not just planting',{})}
  <div class="stack"><div class="fact"><div class="tag">Vrikshayurveda</div><p style="font-size:38px;line-height:1.5;font-weight:700">फलकुसुमसंपदुचिता रोपणतो भवति केवलान्न यतः ।</p><p style="font-size:29px;font-style:italic">“Trees do not produce fruits and flowers merely because they are planted.”</p></div>
   ${PTS(['An ancient Indian text on <b>plant growth, soil and farming</b>.','Based on careful observation over many years.','Describes <b>organic manure</b> made from water, barley and seeds such as green, black and horse gram.'],1)}</div></div>`});

/* ===================== LEAF STRUCTURE ===================== */
const LEAFEXT=`<svg viewBox="0 0 900 640"><rect width="900" height="640" fill="#fff"/>
 <path d="M380 560V610" stroke="#4f8a32" stroke-width="12" stroke-linecap="round"/>
 <path d="M380 560C200 500 140 300 380 40C620 300 560 500 380 560Z" fill="#7cc35f" stroke="#3f7a2a" stroke-width="4"/>
 <path d="M380 560V50" stroke="#e9f6dc" stroke-width="7"/>
 ${[0,1,2,3,4,5].map(i=>{const y=480-i*70;return`<path d="M380 ${y}Q${300-i*5} ${y-40} ${250+i*12} ${y-90+i*6}M380 ${y}Q${460+i*5} ${y-40} ${510-i*12} ${y-90+i*6}" stroke="#d8f0c4" stroke-width="4" fill="none"/>`}).join('')}
 ${LB(380,46,520,40,'Apex (tip)',1)}${LB(470,280,620,260,'Lamina (leaf blade)',2)}${LB(380,330,140,330,'Midrib',3,'end')}${LB(300,404,140,430,'Vein',4,'end')}${LB(552,420,620,470,'Margin',5)}${LB(380,600,520,600,'Petiole (leaf stalk)',6)}${LB(380,560,140,560,'Leaf base',7,'end')}</svg>`;
S({id:'leafext',sec:'10.2 Leaves: food factories',title:'Structure of a leaf',head:'10.2.1 Leaves: the food factories',zoom:true,
 notes:'Bring real leaves (mango, peepal) and let students find each part.',
 html:`<div style="display:grid;grid-template-columns:.95fr 1fr 1fr;gap:26px;height:790px">
  <div style="display:grid">${PH('mango','Mango leaves: broad, flat and green',{})}</div>
  <div style="display:grid">${FIG(LEAFEXT,'External structure of a leaf')}</div>
  <div class="stack">${PTS(['Leaves are generally <b>broad and flat</b> — a large surface to receive sunlight.','They are green because of the pigment <b class="g">chlorophyll</b>, which captures sunlight.','<b>Veins</b> carry water to the leaf and food away from it.','Food is made in the leaf and stored as <b>starch</b>.'],8)}
   ${NOTE(['Leaves are the <b>food factories</b> of plants.','Parts: lamina, midrib, veins, margin, apex, petiole.'],12)}</div></div>`});

const LEAFTS=`<svg viewBox="0 0 1420 600"><rect width="1420" height="600" fill="#fff"/>
 <rect x="40" y="40" width="880" height="12" rx="6" fill="#e6f2d8" stroke="#9ab87a" stroke-width="2"/>
 ${Array.from({length:19},(_,i)=>`<rect x="${40+i*46.3}" y="54" width="44" height="40" rx="8" fill="#f4faee" stroke="#8fb07a" stroke-width="2.5"/>`).join('')}
 ${Array.from({length:21},(_,i)=>{const x=46+i*41.6;return`<rect x="${x}" y="100" width="36" height="140" rx="16" fill="#bfe6a8" stroke="#6aa24f" stroke-width="2.5"/>${[0,1,2,3,4,5].map(k=>`<ellipse cx="${x+(k%2?25:11)}" cy="${115+k*21}" rx="6" ry="4.5" fill="#2f9a45"/>`).join('')}`}).join('')}
 ${[[80,290],[150,330],[205,282],[420,300],[480,350],[560,292],[700,290],[760,345],[830,298],[890,348],[120,380],[530,386],[820,390]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="34" ry="26" fill="#d6efc6" stroke="#7aae5e" stroke-width="2.5"/><circle cx="${x-10}" cy="${y-4}" r="5" fill="#2f9a45"/><circle cx="${x+10}" cy="${y+6}" r="5" fill="#2f9a45"/>`).join('')}
 <circle cx="310" cy="330" r="62" fill="#f2f0d4" stroke="#b8b07a" stroke-width="3"/>
 ${[[290,305],[312,300],[334,310],[300,326],[324,328]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="#7fb6ff" stroke="#2f6fcf" stroke-width="2"/>`).join('')}
 ${[[296,352],[318,356],[338,346]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="#ffc36b" stroke="#d08a1a" stroke-width="2"/>`).join('')}
 ${Array.from({length:19},(_,i)=>{const x=40+i*46.3;return(i===13)?'':`<rect x="${x}" y="420" width="44" height="36" rx="8" fill="#f4faee" stroke="#8fb07a" stroke-width="2.5"/>`}).join('')}
 <path d="M640 418c-14 0-24 18-24 20s10 20 24 20c6 0 10-8 10-20s-4-20-10-20z" fill="#9ed39a" stroke="#3f7a45" stroke-width="2.5"/><path d="M688 418c14 0 24 18 24 20s-10 20-24 20c-6 0-10-8-10-20s4-20 10-20z" fill="#9ed39a" stroke="#3f7a45" stroke-width="2.5"/>
 <rect x="40" y="458" width="880" height="10" rx="5" fill="#e6f2d8" stroke="#9ab87a" stroke-width="2"/>
 ${ARW('M664 560V472','#6b7c8f',4)}<text x="676" y="560" class="dts">air (CO₂ in, O₂ out)</text>
 ${LB(880,46,960,30,'Cuticle (waxy layer)',1)}${LB(870,74,960,80,'Upper epidermis',2)}${LB(856,170,960,150,'Palisade cells (long)',3)}
 ${LB(880,113,960,206,'Chloroplasts (with chlorophyll)',4)}${LB(890,348,960,300,'Spongy cells (round)',5)}${LB(650,330,960,360,'Air space',6)}
 ${LB(320,312,160,540,'Xylem — water',7,'end')}${LB(318,356,160,585,'Phloem — food',8,'end')}${LB(870,438,960,430,'Lower epidermis',9)}${LB(664,438,960,480,'Stoma (pore)',10)}${LB(700,430,960,530,'Guard cell',11)}</svg>`;
S({id:'leafts',sec:'10.2 Leaves: food factories',title:'Inside a leaf (T.S.)',head:'Internal structure of a leaf',zoom:true,
 notes:'This is a transverse section (T.S.) — a thin slice cut across the leaf, seen under a microscope. Grade 7 needs the idea of layers, chlorophyll, veins and stomata; the cell names are for reference.',
 html:`${FIG(LEAFTS,'Transverse section (T.S.) of a leaf, as seen under a microscope',{style:'height:600px'})}
  <div class="grid2 even" style="height:auto;margin-top:16px;gap:24px">
   <div class="card rv" data-s="12" style="padding:14px 22px"><p>Most <b>chlorophyll</b> is in the long <b>palisade cells</b> just below the upper surface — where sunlight falls.</p></div>
   ${NOTE(['Food is made in leaf cells that contain chlorophyll.','Veins have xylem (water) and phloem (food); stomata let gases in and out.'],13)}</div>`});

/* ===================== 10.2 STARCH TEST ===================== */
const STARCH=`<svg viewBox="0 0 1060 620"><rect width="1060" height="620" fill="#fff"/>
 <line x1="120" y1="420" x2="420" y2="420" stroke="#6b7480" stroke-width="8"/>
 <path d="M150 424L110 600M390 424L430 600M270 424V600" stroke="#6b7480" stroke-width="7"/>
 <path d="M220 590Q215 540 250 530H290Q325 540 320 590Z" fill="#dfe9f2" stroke="#7a8a9a" stroke-width="3"/><rect x="262" y="508" width="16" height="24" fill="#c9c1a8"/>
 <path d="M270 500C255 480 258 460 270 440C282 460 285 480 270 500Z" fill="#ffb238"/>
 <path d="M150 180V408Q150 418 160 418H380Q390 418 390 408V180" fill="rgba(200,228,255,.5)" stroke="#7a9cc0" stroke-width="5"/>
 <rect x="153" y="250" width="234" height="164" fill="#a9d4ff" opacity=".6"/>
 ${[0,1,2,3,4,5].map(i=>`<circle cx="${180+i*36}" cy="${300+(i%3)*30}" r="${5+i%3*2}" fill="#fff" stroke="#7a9cc0"/>`).join('')}
 <path d="M248 120V380a22 22 0 0044 0V120" fill="rgba(230,245,255,.6)" stroke="#7a9cc0" stroke-width="4"/>
 <path d="M251 250V380a19 19 0 0038 0V250Z" fill="#cdebc4"/>
 <path d="M270 270C258 300 258 340 270 370C282 340 282 300 270 270Z" fill="#e6dcb4" stroke="#b8a87a" stroke-width="2"/>
 <ellipse cx="760" cy="520" rx="170" ry="40" fill="#f6f6f2" stroke="#b9c2cc" stroke-width="3"/>
 <path d="M640 520C700 470 820 470 880 520C820 560 700 560 640 520Z" fill="#232a52"/><path d="M645 520H875" stroke="#5a6080" stroke-width="3"/>
 <rect x="752" y="300" width="16" height="140" rx="6" fill="rgba(230,245,255,.7)" stroke="#7a9cc0" stroke-width="3"/><ellipse cx="760" cy="290" rx="20" ry="28" fill="#e0475b"/><rect x="755" y="400" width="10" height="38" fill="#b9782f"/>
 <circle cx="760" cy="460" r="6" fill="#b9782f"/>
 ${LB(170,330,20,150,'Water bath',1,'start')}
 ${LB(290,160,470,140,'Test tube with alcohol',2)}${LB(270,330,470,250,'Leaf (losing green colour)',3)}${LB(400,420,470,420,'Wire gauze on tripod',4)}${LB(300,560,470,560,'Spirit lamp',5)}
 ${LB(768,300,1050,230,'Iodine dropper',6,'end')}${LB(700,520,640,600,'Leaf turns blue-black',7,'middle')}</svg>`;
S({id:'a102',sec:'10.2 Starch test',title:'Activity 10.2 — Starch test',head:'Activity 10.2: Testing a leaf for starch',zoom:true,
 notes:'Teacher demonstration only. Emphasise the water bath: alcohol is never heated directly.',
 html:`<div class="grid2" style="grid-template-columns:1.15fr 1fr">${FIG(STARCH,'Testing a leaf for starch: decolourising (left) and iodine test (right)')}
  <div class="stack" style="gap:12px"><div class="steps">${['Boil a leaf in water for <b>5 minutes</b> to soften it.','Put it in <b>alcohol</b> in a test tube; keep the tube in a beaker of boiling water (water bath) until the leaf is <b>colourless</b>.','Wash the leaf and place it on a plate.','Add a few drops of <b>dilute iodine</b> solution.','<b>Blue-black</b> colour ⇒ <b>starch is present</b>.'].map((t,i)=>`<div class="step rv on" data-s="${i+8}"><div class="n">${i+1}</div><div>${t}</div></div>`).join('')}</div>
   <div class="rv" data-s="13">${CAUTION('Alcohol is highly flammable — never heat it directly on a flame.')}</div>
   ${NOTE(['Iodine test: blue-black colour shows starch.','Alcohol removes chlorophyll so the colour change is easy to see.'],14)}</div></div>`});

const VARI=`<svg viewBox="0 0 1000 470"><rect width="1000" height="470" fill="#fff"/>
 ${[['Before test',0,'#3d9a48','#f3f0d2'],['Sunlight · after iodine',1,'#1d2147','#c9954e'],['Dark 36 h · after iodine',2,'#c9954e','#c9954e']].map(([t,i,inner,outer])=>{const x=40+i*320;return`
 <path d="M${x+20} 240C${x+60} 100 ${x+220} 60 ${x+280} 240C${x+220} 420 ${x+60} 380 ${x+20} 240Z" fill="${outer}" stroke="#7a6a3a" stroke-width="3"/>
 <path d="M${x+60} 240C${x+90} 150 ${x+200} 130 ${x+245} 240C${x+200} 340 ${x+90} 330 ${x+60} 240Z" fill="${inner}"/>
 <path d="M${x+22} 240H${x+278}" stroke="rgba(255,255,255,.55)" stroke-width="3"/>
 <text x="${x+150}" y="440" text-anchor="middle" class="dt">${t}</text>`;}).join('')}
 ${LB(190,250,190,40,'Green part (has chlorophyll)',1,'middle')}${LB(70,300,70,370,'Non-green part',2,'middle')}</svg>`;
S({id:'a103',sec:'10.2 Why is chlorophyll needed?',title:'Activity 10.3 — Variegated leaves',head:'Activity 10.3: Are chlorophyll and sunlight needed?',zoom:true,
 notes:'Variegated plants: croton, coleus, money plant (variegated). Ask students to predict before showing the results row.',
 html:`<div style="display:grid;grid-template-columns:.8fr 1.45fr;gap:26px;height:790px">
  <div style="display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:18px">${PH('croton','Croton — a variegated leaf',{})}${PH('coleusv','Coleus — green and non-green patches',{})}</div>
  <div class="stack">${FIG(VARI,'Starch test on variegated leaves',{style:'height:430px'})}
   <table class="tb rv" data-s="3"><tr><th>Plant kept in</th><th>Green parts</th><th>Non-green parts</th></tr><tr><td><b>Sunlight</b></td><td class="yes">Blue-black (starch)</td><td>No change</td></tr><tr><td><b>Dark, 36 hours</b></td><td>No change</td><td>No change</td></tr></table>
   <div class="concl rv" data-s="4" style="font-size:26px;padding:16px 24px">Starch is made only in <b>green parts</b> and only in <b>sunlight</b> ⇒ <b>chlorophyll and sunlight are both needed</b>.</div></div></div>`});

S({id:'pigm',sec:'10.2 Why is chlorophyll needed?',title:'Red, violet and brown leaves',head:'Fascinating fact: coloured leaves',
 notes:'Even red leaves make starch — test a red coleus leaf with iodine.',
 html:`<div style="display:grid;grid-template-columns:1fr 1fr 1.05fr;gap:26px;height:790px">${PH('coleusred','Red coleus leaves',{})}${PH('amaranth','Amaranth leaves with red pigment',{})}
  <div class="stack">${PTS(['Some leaves are <b>red, violet or brown</b>.','They still contain <b>chlorophyll</b>, but it is <b>hidden</b> by larger amounts of other coloured pigments.','Some of these pigments also help in photosynthesis.','An <b>iodine test</b> shows starch in these leaves too.'],1)}
   ${NOTE(['Coloured leaves also have chlorophyll and make food.'],5)}</div></div>`});

const CO2SET=`<svg viewBox="0 0 1240 560"><rect width="1240" height="560" fill="#fff"/>
 <path d="M120 420L140 540H300L320 420Z" fill="#c4683f"/><rect x="110" y="408" width="220" height="24" rx="6" fill="#a8532f"/>
 <path d="M220 410V150" stroke="#3d8a3a" stroke-width="8"/>${[0,1,2].map(j=>`<path d="M220 ${380-j*80}q${j%2?60:-60} -16 ${j%2?90:-90} -4q${j%2?-40:40} 22 ${j%2?-90:90} 4z" fill="#58a845"/>`).join('')}
 <path d="M220 200Q380 120 560 170" stroke="#3d8a3a" stroke-width="6" fill="none"/>
 <path d="M560 260V520Q560 540 580 540H820Q840 540 840 520V260Q840 220 760 210V180H640V210Q560 220 560 260Z" fill="rgba(220,238,255,.5)" stroke="#7a9cc0" stroke-width="5"/>
 <rect x="630" y="160" width="140" height="30" rx="6" fill="#b07a47"/><line x1="700" y1="160" x2="700" y2="190" stroke="#6e4722" stroke-width="3"/>
 <path d="M565 470H835V520Q835 535 820 535H580Q565 535 565 520Z" fill="#efdcf3"/>
 <path d="M560 170C600 150 660 150 700 175C740 200 720 330 700 360C680 330 650 230 700 175" fill="#58a845" stroke="#3f7a2a" stroke-width="2"/>
 ${LB(150,250,40,220,'Destarched potted plant',1,'start')}${LB(600,160,450,70,'Half of leaf outside',2)}${LB(705,300,880,300,'Half of leaf inside',3)}
 ${LB(770,175,880,175,'Split cork',4)}${LB(820,500,880,420,'Caustic soda',5)}${LB(560,380,450,460,'Wide-mouthed bottle',6,'end')}</svg>`;
S({id:'a104',sec:'10.2 Role of carbon dioxide',title:'Activity 10.4 — Is CO₂ needed?',head:'Activity 10.4: Is carbon dioxide needed?',zoom:true,
 notes:'Teacher demonstration — caustic soda (sodium hydroxide) causes skin burns.',
 html:`<div class="grid2" style="grid-template-columns:1.15fr 1fr">${FIG(CO2SET,'Experiment to show that carbon dioxide is needed for photosynthesis')}
  <div class="stack" style="gap:12px">${PTS(['Keep the plant in the <b>dark for 2–3 days</b> to <b>destarch</b> it (so any starch later is newly made).','Put half of one leaf into a bottle containing <b>caustic soda</b>, which absorbs carbon dioxide.','Keep in <b>sunlight</b> for a few hours, then do the iodine test.'],7)}
   <table class="tb rv" data-s="10"><tr><th>Leaf part</th><th>CO₂</th><th>Starch</th></tr><tr><td>Outside bottle</td><td class="yes">Yes</td><td class="yes">Blue-black</td></tr><tr><td>Inside bottle</td><td class="no">No</td><td class="no">No change</td></tr></table>
   <div class="rv" data-s="11">${CAUTION('Caustic soda can cause skin burns; only the teacher should handle it.')}</div>
   <div class="concl rv" data-s="12" style="font-size:26px;padding:14px 22px"><b>Carbon dioxide</b> is needed for plants to make starch.</div></div></div>`});

/* ===================== PHOTOSYNTHESIS ===================== */
const PSN=`<svg viewBox="0 0 1200 640"><rect width="1200" height="640" fill="#fff"/><rect y="470" width="1200" height="170" fill="#efe3d0"/><path d="M0 470H1100" stroke="#a9845a" stroke-width="4"/>
 <circle cx="110" cy="100" r="50" fill="#FFD166"/>${[0,1,2,3,4,5,6,7].map(a=>`<line x1="${110+Math.cos(a*.785)*62}" y1="${100+Math.sin(a*.785)*62}" x2="${110+Math.cos(a*.785)*84}" y2="${100+Math.sin(a*.785)*84}" stroke="#F2B200" stroke-width="6"/>`).join('')}
 <path d="M550 470V120" stroke="#3d8a3a" stroke-width="14"/>
 <path d="M550 470C540 520 520 560 480 600M550 480C570 530 600 560 640 610M550 490V620" stroke="#b08a5a" stroke-width="6" fill="none"/>
 ${[[550,300,-1],[550,220,1],[550,150,-1],[550,380,1]].map(([x,y,s])=>`<path d="M${x} ${y}C${x+s*80} ${y-60} ${x+s*200} ${y-40} ${x+s*240} ${y+10}C${x+s*180} ${y+40} ${x+s*80} ${y+30} ${x} ${y}Z" fill="#6cc35f" stroke="#3f7a2a" stroke-width="3"/>`).join('')}
 ${ARW('M180 160L370 250','#F2B200',7)}${ARW('M980 160L820 210','#8a96a3',7)}${ARW('M800 380L980 420','#2fb7d0',7)}
 ${ARW('M600 600C600 540 570 510 562 470','#3b8eea',6)}${ARW('M566 440V330','#3b8eea',6)}${ARW('M520 250V420','#e08e1b',6)}
 <text x="200" y="130" class="dgt" fill="#c48a00" style="fill:#b07a00">Sunlight</text>
 <text x="870" y="140" class="dgt" style="fill:#4a5562">Carbon dioxide</text><text x="870" y="166" class="dts">from air, through stomata</text>
 <text x="840" y="460" class="dgt" style="fill:#138a9e">Oxygen</text><text x="840" y="486" class="dts">released into the air</text>
 <text x="660" y="560" class="dgt" style="fill:#1e5fb3">Water + minerals</text><text x="660" y="586" class="dts">absorbed by roots, carried up by xylem</text>
 <text x="300" y="440" class="dgt" style="fill:#b06a00">Glucose → starch</text><text x="300" y="466" class="dts">carried by phloem, stored</text>
 ${LB(700,190,700,40,'Chlorophyll in leaf traps sunlight',0,'middle')}</svg>`;
S({id:'psdef',sec:'10.2 Photosynthesis',title:'Photosynthesis',head:'Photosynthesis',zoom:true,
 notes:'photo = light, synthesis = making. Point to each arrow and ask: what goes in, what comes out?',
 html:`<div class="grid2" style="grid-template-columns:1.25fr 1fr">${FIG(PSN,'Photosynthesis: raw materials, energy and products')}
  <div class="stack">${DEF('Photosynthesis','The process by which green plants make their own food (glucose) from <b>carbon dioxide</b> and <b>water</b> in the presence of <b>sunlight</b> and <b>chlorophyll</b>. Oxygen is released.')}
   <div class="card" style="text-align:center;padding:20px"><div style="font-size:21px;color:var(--ink2)">Word equation</div><div style="font-size:25px;font-weight:800;margin-top:8px;white-space:nowrap">Carbon dioxide + Water <span style="display:inline-flex;flex-direction:column;align-items:center;font-size:17px;color:#9A6A00;vertical-align:middle;margin:0 8px">sunlight<span style="font-size:28px;color:var(--ink);line-height:.9">⟶</span>chlorophyll</span> Glucose + Oxygen</div></div>
   ${NOTE(['photo = light, synthesis = making.','Main site: leaves. Other green parts also photosynthesise.','Glucose is used for energy; extra is stored as starch.'],1)}</div></div>`});

const STEPS6=[['Water','Roots absorb water and minerals from the soil; xylem carries them up to the leaves.','#3b8eea'],['Carbon dioxide','Carbon dioxide from the air enters the leaf through the stomata.','#8a96a3'],['Sunlight','Chlorophyll in the leaf cells traps the energy of sunlight.','#F2B200'],['Glucose','Using this energy, carbon dioxide and water are combined to make glucose.','#e08e1b'],['Oxygen','Oxygen is produced and released through the stomata.','#2fb7d0'],['Use and storage','Glucose gives energy; extra glucose is changed to starch and stored; phloem carries food to all parts.','#239B56']];
S({id:'pssteps',sec:'10.2 Photosynthesis',title:'Photosynthesis step by step',head:'Photosynthesis: step by step',
 notes:'Ask six students to explain one step each, in order.',
 html:`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px">${STEPS6.map(([t,d,c],i)=>`<div class="card rv" data-s="${i+1}" style="border-top:10px solid ${c};padding:22px 26px;min-height:300px"><div style="font-size:22px;font-weight:800;color:${c}">STEP ${i+1}</div><h3 style="font-size:36px;margin:6px 0 10px">${t}</h3><p>${d}</p></div>`).join('')}</div>
  <div class="rv" data-s="7" style="margin-top:22px">${VSLOT('photosynthesis animation for class 7 (NCERT / DIKSHA)')}</div>`});

const HYD=`<svg viewBox="-300 0 1300 560"><rect x="-300" width="1300" height="560" fill="#fff"/>
 ${[0,1].map(i=>{const x=60+i*480,dark=i===1;return`<rect x="${x-30}" y="10" width="440" height="540" rx="20" fill="${dark?'#26324a':'#F3FAFF'}"/>
 ${dark?'':`<circle cx="${x+350}" cy="70" r="30" fill="#FFD166"/>`}
 <path d="M${x+40} 180V510Q${x+40} 525 ${x+55} 525H${x+325}Q${x+340} 525 ${x+340} 510V180" fill="rgba(200,228,255,.45)" stroke="#7a9cc0" stroke-width="5"/>
 <rect x="${x+44}" y="215" width="292" height="306" fill="#a9d4ff" opacity=".5"/>
 ${[0,1,2].map(j=>`<path d="M${x+160+j*30} 520Q${x+150+j*30} 470 ${x+170+j*28} 420" stroke="#3d9a48" stroke-width="5" fill="none"/>${[0,1,2,3].map(k=>`<path d="M${x+158+j*30-k} ${505-k*24}l-12 -6M${x+158+j*30-k} ${505-k*24}l12 -6" stroke="#3d9a48" stroke-width="4"/>`).join('')}`).join('')}
 <path d="M${x+90} 520L${x+175} 360V300H${x+205}V360L${x+290} 520" fill="rgba(230,245,255,.5)" stroke="#7a9cc0" stroke-width="4"/>
 <path d="M${x+170} 320V110a20 20 0 0140 0V320" fill="rgba(200,228,255,.5)" stroke="#7a9cc0" stroke-width="4"/>
 ${dark?'':`<rect x="${x+173}" y="92" width="34" height="${60}" fill="#fff" opacity=".9"/>${[0,1,2,3,4,5].map(k=>`<circle cx="${x+186+(k%2)*8}" cy="${330-k*36}" r="${4+(k%2)}" fill="#fff" stroke="#7a9cc0"/>`).join('')}`}
 <text x="${x+190}" y="60" text-anchor="middle" class="dgt" style="fill:${dark?'#fff':'#142B45'}">${dark?'B — in the dark':'A — in sunlight'}</text>`;}).join('')}
 ${LB(240,120,0,110,'Gas collects',1,'end')}${LB(232,260,0,230,'Inverted test tube',2,'end')}${LB(140,470,0,370,'Inverted funnel',3,'end')}${LB(200,490,0,480,'Water plant',4,'end')}</svg>`;
S({id:'a105',sec:'10.2 Oxygen is released',title:'Activity 10.5 — Oxygen is released',head:'Activity 10.5: Is oxygen released in photosynthesis?',zoom:true,
 notes:'Teacher demonstration. The lit matchstick test must be done by the teacher only.',
 html:`<div style="display:grid;grid-template-columns:.55fr 1.5fr .95fr;gap:24px;height:790px">
  <div style="display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:18px">${PH('hydrilla','Hydrilla — a water plant',{})}${PH('hydrilla2','Hydrilla growing under water',{sci:false})}</div>
  <div style="display:grid">${FIG(HYD,'Set-up to collect the gas released by a water plant')}</div>
  <div class="stack" style="gap:12px">${PTS(['In <b>A (sunlight)</b>, gas bubbles rise and collect in the test tube; in <b>B (dark)</b> there are none.','A <b>lit matchstick</b> put into the gas burns with an <b>intense flame</b> — oxygen supports burning.'],5)}
   <div class="concl rv" data-s="7" style="font-size:25px;padding:14px 20px"><b>Oxygen</b> is released during photosynthesis, which happens only in <b>sunlight</b>.</div>
   <div class="rv" data-s="8">${VSLOT('Hydrilla oxygen bubbles experiment')}</div></div></div>`});

S({id:'dastur',sec:'10.2 Oxygen is released',title:'Know a scientist: R. H. Dastur',head:'Know a scientist: Rustom Hormusji Dastur',
 html:`<div class="grid2 even" style="height:auto;align-items:start"><div class="card" style="padding:34px">
   <div class="pill g" style="margin-bottom:14px">1896–1961 · Plant scientist</div>
   ${PTS(['Studied <b>photosynthesis</b> in India.','Head of the Botany Department, Royal Institute of Science, Bombay (now Institute of Science, Mumbai), 1921–1935.','Studied the effect of the <b>amount of water</b> and <b>temperature</b> on photosynthesis.','Examined the importance of the <b>colour of light</b> in photosynthesis.'],1)}</div>
  ${NOTE(['R. H. Dastur: water, temperature and colour of light affect photosynthesis.'],5)}</div>`});

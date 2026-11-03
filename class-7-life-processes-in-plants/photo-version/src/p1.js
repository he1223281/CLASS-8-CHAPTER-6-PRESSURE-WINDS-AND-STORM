/* ===================== TITLE ===================== */
S({id:'title',sec:'Welcome',title:'Life Processes in Plants',bare:true,cls:'full',
 notes:'Welcome the class. Ask: <i>Is a plant alive? Which life activities can you see in a plant?</i>',
 html:`<div style="position:absolute;inset:0"><img src="${IMG.mango.src}" alt="" style="width:100%;height:100%;object-fit:cover;filter:saturate(1.1)"><div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(234,245,255,.97) 0%,rgba(234,245,255,.9) 42%,rgba(234,245,255,.15) 75%)"></div></div>
 <div style="position:absolute;left:110px;top:170px;width:1000px">
  <div class="kicker">Class 7 · Science (Curiosity) · Chapter 10</div>
  <h1 style="margin:24px 0 20px;font-size:100px;letter-spacing:-.02em">Life Processes<br><span class="g">in Plants</span></h1>
  <p class="big muted" style="font-size:38px;margin-bottom:40px">Nutrition · Photosynthesis · Transport · Respiration</p>
  <div class="row" style="gap:16px"><div class="pill g">Real photographs</div><div class="pill">Labelled diagrams</div><div class="pill y">Textbook activities 10.1–10.8</div></div>
 </div><div style="position:absolute;right:30px;bottom:110px;font-size:14px;color:#fff;text-shadow:0 1px 4px #000">Photo: ${credit(IMG.mango)} · ${IMG.mango.lic} · iNaturalist</div>`});

S({id:'lifep',sec:'Welcome',title:'Life processes',head:'What are life processes?',
 notes:'Recall Grade 6: characteristics of living beings.',
 html:`<div class="grid2 even" style="height:auto">
  <div class="stack">${DEF('Life processes','The basic activities that all living beings carry out to stay alive.')}
   ${PTS(['<b>Nutrition</b> — obtaining and using food','<b>Respiration</b> — releasing energy from food','<b>Transport</b> — moving water, minerals and food','<b>Excretion</b> — removing wastes','<b>Growth</b> and <b>reproduction</b>'],1)}</div>
  <div class="stack"><div class="card green rv" data-s="6"><h3 style="margin-bottom:8px">In this chapter</h3><p>How plants <b>make</b> food (photosynthesis), <b>move</b> water and food (xylem and phloem), and <b>use</b> food to get energy (respiration).</p></div>
   ${NOTE(['Life processes keep an organism alive.','Plants: nutrition, transport and respiration are studied in this chapter.'],7)}</div></div>`});

/* ===================== MODES OF NUTRITION ===================== */
S({id:'nutr',sec:'Modes of nutrition',title:'What is nutrition?',head:'Nutrition',zoom:true,
 notes:'Ask: why do we eat? (energy, growth, repair). Then define nutrition.',
 html:`<div class="grid2" style="height:auto;grid-template-columns:1fr 1.1fr">
  <div class="stack">${DEF('Nutrition','The process by which an organism obtains food and uses it for energy, growth and repair of the body.')}
   ${PTS(['Food gives <b>energy</b> for all activities.','Food helps the body <b>grow</b> and <b>repair</b> itself.','Food contains carbohydrates, proteins, fats, vitamins and minerals.'],1)}
   ${NOTE(['Nutrition = obtaining food + using it.','The way an organism gets its food is its <b>mode of nutrition</b>.'],4)}</div>
  <div class="tree rv" data-s="5">
   <div class="nd" style="--c:#142B45">Modes of nutrition</div><div class="vline"></div>
   <div class="row2" style="gap:80px">
    <div class="tree"><div class="nd" style="--c:#239B56">Autotrophic<small>makes its own food</small></div><div class="vline"></div><div class="nd" style="--c:#239B56;font-size:22px">Green plants<small>(photosynthesis)</small></div></div>
    <div class="tree"><div class="nd" style="--c:#E08E1B">Heterotrophic<small>depends on others</small></div><div class="vline"></div>
     <div class="row2" style="gap:12px">${[['Parasitic','Cuscuta'],['Saprotrophic','mushroom'],['Holozoic*','animals']].map(([a,b])=>`<div class="nd" style="--c:#E08E1B;font-size:20px;padding:10px 14px">${a}<small>${b}</small></div>`).join('')}</div></div></div>
   <p class="muted" style="font-size:19px;margin-top:14px">Special cases: <b>insectivorous</b> plants (e.g. pitcher plant) and <b>symbiosis</b> (e.g. lichen). *Holozoic: eating food as animals do.</p></div></div>`});

S({id:'auto',sec:'Modes of nutrition',title:'Autotrophic nutrition',head:'Autotrophic nutrition',
 notes:'auto = self, trophos = nourishment.',
 html:`<div class="grid2">${PH('mango','Mango leaves — green plants make their own food',{})}
  <div class="stack">${DEF('Autotrophic nutrition','The mode of nutrition in which an organism makes its own food from simple substances. Such organisms are called <b>autotrophs</b>.')}
   ${PTS(['<b>auto</b> = self; <b>trophos</b> = nourishment.','Green plants are autotrophs — they have the green pigment <b class="g">chlorophyll</b>.','Raw materials: <b>carbon dioxide</b> (from air) + <b>water</b> (from soil).','Energy source: <b>sunlight</b>. The process is called <b>photosynthesis</b>.'],1)}
   ${NOTE(['Autotrophs make their own food. Example: all green plants.'],5)}</div></div>`});

S({id:'hetero',sec:'Modes of nutrition',title:'Heterotrophic nutrition',head:'Heterotrophic nutrition',
 notes:'hetero = other. Everything a heterotroph eats can be traced back to a plant.',
 html:`<div class="grid2">${PH('agaricus','Mushrooms cannot make food — they are heterotrophs',{})}
  <div class="stack">${DEF('Heterotrophic nutrition','The mode of nutrition in which an organism cannot make its own food and depends on other organisms for food. Such organisms are <b>heterotrophs</b>.')}
   ${PTS(['<b>hetero</b> = other.','Examples: all animals (including humans), fungi, most bacteria.','Heterotrophs depend <b>directly</b> (herbivores) or <b>indirectly</b> (carnivores) on plants.','Food chain: <b>grass → goat → tiger</b>.'],1)}
   ${NOTE(['Heterotrophs take ready-made food from other organisms.'],5)}</div></div>`});

const CUSC=`<svg viewBox="0 0 900 640"><rect width="900" height="640" fill="#fff"/>
 <path d="M300 640V20" stroke="#5b8a3a" stroke-width="44" stroke-linecap="round"/><path d="M300 640V20" stroke="#7fb05a" stroke-width="18" opacity=".6"/>
 <path d="M300 180Q190 150 120 190" stroke="#5b8a3a" stroke-width="14" fill="none"/><path d="M120 190q-60 10-80 60q60 10 80-60z" fill="#6aa84f"/>
 ${Array.from({length:7},(_,i)=>{const y=80+i*78;return`<path d="M248 ${y}C230 ${y+40} 370 ${y+10} 352 ${y+48}" stroke="#e3b20f" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M352 ${y+48}C334 ${y+82} 250 ${y+48} 248 ${y+78}" stroke="#e3b20f" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>`}).join('')}
 ${Array.from({length:6},(_,i)=>{const y=108+i*78;return`<path d="M324 ${y}l-14 4" stroke="#b07d06" stroke-width="6" stroke-linecap="round"/><path d="M276 ${y+40}l14 -2" stroke="#b07d06" stroke-width="6" stroke-linecap="round"/>`}).join('')}
 <path d="M352 126C420 110 470 60 520 70" stroke="#e3b20f" stroke-width="9" fill="none"/>
 ${LB(352,126,560,90,'Cuscuta stem',1)}${LB(300,560,520,560,'Host plant stem',2)}${LB(318,264,560,280,'Haustoria',3)}
 <text x="568" y="306" class="dts">(special roots that go</text><text x="568" y="330" class="dts">into the host and absorb food)</text>
 ${LB(80,225,90,360,'Host leaf',4,'middle')}</svg>`;
S({id:'parasite',sec:'Modes of nutrition',title:'Parasitic nutrition — Cuscuta',head:'Parasitic nutrition',zoom:true,
 notes:'Show a real Cuscuta (amarbel) on a hedge if available. It is yellow because it has no chlorophyll.',
 html:`<div style="display:grid;grid-template-columns:.8fr 1.25fr .95fr;gap:26px;height:790px">
  <div class="stack" style="grid-column:1"><div style="flex:1;display:grid;min-height:0">${PH('cuscuta','Cuscuta (amarbel) covering its host plant',{})}</div></div>
  <div style="display:grid">${FIG(CUSC,'Cuscuta twining around a host stem')}</div>
  <div class="stack">${DEF('Parasite','An organism that lives on or inside another living organism (the <b>host</b>) and takes food from it.')}
   ${PTS(['Cuscuta is <b>yellow and leafless</b> — it has <b>no chlorophyll</b>, so it cannot make food.','It twines around a host and sends <b>haustoria</b> into it to absorb food and water.','The host is <b>harmed</b>.'],1)}
   ${NOTE(['Parasite takes food; host gives food and is harmed.','Example: Cuscuta (amarbel).'],4)}</div></div>`});

S({id:'sapro',sec:'Modes of nutrition',title:'Saprotrophic nutrition',head:'Saprotrophic nutrition',
 notes:'Bread mould: leave a moist piece of bread in a closed box for 2–3 days and show the class.',
 html:`<div style="display:grid;grid-template-columns:1fr 1fr 1.05fr;gap:26px;height:790px">
  <div style="display:grid">${PH('mush','Oyster mushrooms growing on dead wood',{})}</div>
  <div style="display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:20px">${PH('mould','Bread mould (Rhizopus) on a rotting tomato',{sci:false})}${PH('mouldmic','Mould under a microscope: threads and spore case',{sci:false})}</div>
  <div class="stack">${DEF('Saprotrophic nutrition','Obtaining food from <b>dead and decaying</b> matter. Such organisms are called <b>saprotrophs</b>.')}
   ${PTS(['<b>sapro</b> = rotten.','They release <b>digestive juices</b> on the dead matter, which turn it into a solution; they then <b>absorb</b> the nutrients.','Examples: mushrooms, bread mould, many bacteria.'],1)}
   ${NOTE(['Saprotrophs feed on dead and decaying matter.','They clean the surroundings and return nutrients to the soil.'],4)}</div></div>`});

const PITCH=`<svg viewBox="0 0 960 680"><rect width="960" height="680" fill="#fff"/>
 <path d="M60 640C120 560 200 520 300 500" stroke="#4f8a32" stroke-width="10" fill="none"/>
 <path d="M300 500C230 470 150 470 60 520C140 540 220 535 300 500Z" fill="#6aa84f" stroke="#3f7a2a" stroke-width="3"/><path d="M300 500L70 520" stroke="#cfe8b0" stroke-width="3"/>
 <path d="M300 500C360 495 400 520 410 470C418 430 380 400 395 360" stroke="#4f8a32" stroke-width="6" fill="none"/>
 <path d="M395 360C340 360 330 300 340 240C350 170 360 120 380 100H500C520 120 530 170 540 240C550 300 540 360 485 362Z" fill="#a9c95a" stroke="#4f7a2a" stroke-width="4"/>
 ${Array.from({length:40},(_,i)=>`<circle cx="${352+((i*37)%180)}" cy="${130+((i*53)%220)}" r="${4+i%4}" fill="#a3233a" opacity=".7"/>`).join('')}
 <path d="M362 300Q440 320 518 300V340Q440 368 362 340Z" fill="#d6dd8c" opacity=".95"/>
 <ellipse cx="440" cy="100" rx="64" ry="16" fill="#8a1c2c" stroke="#5a0d18" stroke-width="4"/>
 <path d="M384 92C410 30 480 20 520 60C500 50 450 50 384 92Z" fill="#9ab64e" stroke="#4f7a2a" stroke-width="4"/>
 <g transform="translate(450 318)"><ellipse rx="12" ry="6" fill="#222"/><circle cx="-14" r="5" fill="#222"/><path d="M-6 0l-8 10M2 0l0 11M8 0l8 10M-6 0l-8-10M2 0v-11M8 0l8-10" stroke="#222" stroke-width="2"/></g>
 ${LB(470,40,600,40,'Lid',1)}${LB(500,100,620,130,'Rim (slippery)',2)}${LB(530,220,620,220,'Pitcher',3)}
 <text x="628" y="246" class="dts">(modified leaf)</text>
 ${LB(480,330,620,340,'Digestive juice',4)}${LB(450,318,620,410,'Trapped insect',5)}${LB(409,450,620,480,'Tendril',6)}${LB(180,500,180,600,'Leaf blade',7,'middle')}</svg>`;
S({id:'insect',sec:'Modes of nutrition',title:'Insectivorous plants — pitcher plant',head:'Insectivorous plants: the pitcher plant',zoom:true,
 notes:'India has its own pitcher plant, <i>Nepenthes khasiana</i>, found in Meghalaya — the photo on the left.',
 html:`<div style="display:grid;grid-template-columns:.7fr 1.3fr .95fr;gap:24px;height:790px">
  <div style="display:grid">${PH('nep','Pitcher plant of Meghalaya, India',{})}</div>
  <div style="display:grid">${FIG(PITCH,'Parts of a pitcher plant')}</div>
  <div class="stack">${DEF('Insectivorous plants','Green plants that make their own food but also <b>trap and digest insects</b> to get extra nutrients.')}
   ${PTS(['They grow in soil <b>poor in nitrogen</b>; insects supply the missing nitrogen.','Insects are attracted to the <b>rim</b>, slip into the pitcher and are digested by <b>digestive juices</b>.','The pitcher is a <b>modified leaf</b>; the lid stops rain from filling it.'],1)}
   ${NOTE(['Insectivorous plants are autotrophic (green) and also get nutrients from insects.'],4)}</div></div>`});

S({id:'insect2',sec:'Modes of nutrition',title:'More insectivorous plants',head:'Other insectivorous plants',
 notes:'All three are green (make their own food) and live in nitrogen-poor soil.',
 html:`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;height:640px">
  ${PH('nep2','Pitcher plant — pitchers on the ground',{})}${PH('flytrap','Venus flytrap — leaf snaps shut on insects',{})}${PH('sundew','Sundew — sticky hairs trap insects',{})}</div>
  <div class="rv" data-s="1" style="margin-top:22px">${NOTE(['Examples of insectivorous plants: pitcher plant, Venus flytrap, sundew, bladderwort.'])}</div>`});

const LICH=`<svg viewBox="0 0 760 560"><rect width="760" height="560" fill="#fff"/>
 <rect x="40" y="60" width="680" height="300" rx="30" fill="#f2f5ea" stroke="#9aa77a" stroke-width="3"/>
 ${Array.from({length:22},(_,i)=>`<path d="M${50+i*31} 70C${90+i*31} 160 ${20+i*31} 250 ${70+i*31} 350" stroke="#b9b39a" stroke-width="5" fill="none"/>`).join('')}
 ${Array.from({length:12},(_,i)=>`<path d="M40 ${80+i*24}C220 ${60+i*24} 520 ${110+i*24} 720 ${80+i*24}" stroke="#c9c2a6" stroke-width="4" fill="none"/>`).join('')}
 ${Array.from({length:34},(_,i)=>`<circle cx="${80+((i*71)%600)}" cy="${110+((i*47)%170)}" r="13" fill="#3aa356" stroke="#1f7a3a" stroke-width="3"/>`).join('')}
 <rect x="40" y="380" width="680" height="60" rx="8" fill="#8a6a4a"/>
 ${LB(150,140,60,490,'Alga cells (make food)',1,'start')}${LB(600,250,620,30,'Fungus threads',2,'middle')}${LB(380,410,380,520,'Tree bark / rock',3,'middle')}</svg>`;
const NOD=`<svg viewBox="0 0 900 520"><rect width="900" height="520" fill="#fff"/><rect y="70" width="900" height="450" fill="#efe3d0"/>
 <path d="M380 0V70" stroke="#5b8a3a" stroke-width="16"/><path d="M380 70C385 200 370 330 380 480" stroke="#c9a06a" stroke-width="12" fill="none"/>
 <path d="M382 150Q300 200 220 300M378 230Q470 270 560 360M380 320Q320 380 270 450M380 380Q440 420 500 470" stroke="#c9a06a" stroke-width="7" fill="none"/>
 ${[[300,205],[255,262],[455,262],[515,318],[330,385],[440,425],[382,190],[372,280]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="16" fill="#e7b9a0" stroke="#a5654a" stroke-width="3"/>`).join('')}
 <circle cx="620" cy="140" r="80" fill="#fff" stroke="#142B45" stroke-width="3"/><path d="M528 300L560 190" stroke="#142B45" stroke-width="2" stroke-dasharray="6 6"/>
 ${Array.from({length:18},(_,i)=>`<rect x="${570+((i*29)%95)}" y="${95+((i*37)%90)}" width="18" height="8" rx="4" fill="#7a4cd9" transform="rotate(${i*30} ${579+((i*29)%95)} ${99+((i*37)%90)})"/>`).join('')}
 ${LB(515,318,640,420,'Root nodule',1)}${LB(620,140,620,250,'Rhizobium bacteria',2,'middle')}${LB(380,30,420,30,'Pulse plant',3)}</svg>`;
S({id:'symb',sec:'Modes of nutrition',title:'Symbiotic relationship',head:'Symbiosis: living together, both benefit',zoom:true,
 notes:'Lichens grow as grey-green patches on old walls and tree bark near school — a good field observation.',
 html:`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;height:470px">
  ${PH('lichen','Lichen growing on a branch',{})}${FIG(LICH,'A lichen: alga + fungus')}${FIG(NOD,'Root nodules of a pulse plant')}</div>
  <div class="grid2 even" style="height:auto;margin-top:18px;gap:24px">${DEF('Symbiosis','Two different organisms live together and <b>both benefit</b> from each other.',1)}
   ${NOTE(['Lichen = alga (makes food) + fungus (shelter, water, minerals).','Rhizobium in root nodules of pulses gives the plant nitrogen and gets food.'],2)}</div>`});

S({id:'nodphoto',sec:'Modes of nutrition',title:'Real root nodules',head:'Root nodules (real photograph)',
 notes:'Uproot a gram or pea plant gently and wash the roots to show the nodules.',
 html:`<div class="grid2">${PH('nodules','Root nodules on a legume — homes of Rhizobium bacteria',{sci:false})}
  <div class="stack">${PTS(['The round swellings on the roots are <b>root nodules</b>.','Inside them live <b>Rhizobium</b> bacteria.','Rhizobium takes nitrogen from the air and turns it into a form the plant can use.','In return, the plant gives the bacteria <b>food and shelter</b>.','This is why farmers grow pulses to make soil <b>fertile</b>.'],1)}</div></div>`});

S({id:'modetab',sec:'Modes of nutrition',title:'Summary: modes of nutrition',head:'Summary: modes of nutrition',
 notes:'Students copy this table into their notebooks.',
 html:`<table class="tb"><tr><th>Mode</th><th>How the organism gets food</th><th>Example</th></tr>
  <tr><td><b>Autotrophic</b></td><td>Makes its own food by photosynthesis</td><td>Green plants</td></tr>
  <tr><td><b>Heterotrophic</b></td><td>Depends on other organisms for food</td><td>Animals, humans, fungi</td></tr>
  <tr><td><b>Parasitic</b></td><td>Takes food from a living host and harms it</td><td>Cuscuta (amarbel)</td></tr>
  <tr><td><b>Saprotrophic</b></td><td>Feeds on dead and decaying matter</td><td>Mushroom, bread mould</td></tr>
  <tr><td><b>Insectivorous</b></td><td>Makes food, and traps insects for extra nitrogen</td><td>Pitcher plant, Venus flytrap</td></tr>
  <tr><td><b>Symbiotic</b></td><td>Two organisms live together; both benefit</td><td>Lichen; Rhizobium in pulses</td></tr></table>`});

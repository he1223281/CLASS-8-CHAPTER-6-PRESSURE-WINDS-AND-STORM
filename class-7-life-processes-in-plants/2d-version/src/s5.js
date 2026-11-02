/* ===================== 10.4 DO PLANTS RESPIRE? ===================== */
S({id:'respq',sec:'10.4 Do plants respire?',title:'Do plants need energy?',head:'Plants make their own food. But do they also need energy?',zoom:true,
 notes:'Recall Grade 6: all living beings respire. Ask: <i>Do plants breathe like us? Do they have lungs?</i> Let them wonder — the next activity gives evidence.',
 html:`<div class="grid2 wideR" style="height:720px"><div class="viz" style="background:linear-gradient(170deg,#FFF9E8,#fff)"><svg viewBox="0 0 800 720">
  <rect y="560" width="800" height="160" fill="url(#gSoil)"/><path d="M0 562Q400 548 800 562V574H0Z" fill="#5DBB7C"/>
  ${ART.plant(400,562,{g:.8,H:420})}
  ${[[300,250],[520,200],[420,120],[260,400],[560,380],[400,640]].map(([x,y],i)=>`<g class="pulse" style="animation-delay:-${i*.4}s" transform="translate(${x} ${y})">${ART.mol('energy',22)}</g>`).join('')}</svg></div>
  <div class="col">
   <div class="card rv" data-s="1"><p>Growing new leaves, making flowers and seeds, absorbing water — every life activity needs <b>energy</b>.</p></div>
   <div class="card blue rv" data-s="2"><p>In Grade 6 we learnt that <b>all living beings respire</b>. Do plants also respire like we do?</p></div>
   <div class="concl rv" data-s="3">Let us find out with germinating seeds!</div></div></div>`
});

/* ===================== ACTIVITY 10.8 — LIMEWATER ===================== */
S({id:'a108',sec:'10.4 Do plants respire?',title:'Activity 10.8 — Germinating seeds',head:'Activity 10.8: Do germinating seeds give out carbon dioxide?',
 notes:'Teacher demonstration. Soak moong seeds overnight. Press Next: set-up → 24 hours in the dark (animation) → compare the two test tubes → explain. The unconnected tube is for comparison.',
 html:`<div class="grid2"><div class="viz"><svg viewBox="0 0 1040 790" id="lmsvg">
  <rect width="1040" height="790" fill="#F7FBFF"/><rect id="lmdark" width="1040" height="790" fill="#142B45" opacity="0" style="transition:opacity 1s"/>
  <rect x="80" y="700" width="900" height="40" rx="8" fill="#B3532B"/><rect x="100" y="740" width="860" height="20" fill="#8A3E20"/>
  <path d="M290 340V270H350V340L470 690H170Z" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="5" stroke-linejoin="round"/>
  <path d="M190 645Q220 630 250 645T310 645T370 645T450 645L462 688H178Z" fill="#FFFFFF" stroke="#E2E8EF" stroke-width="2"/>
  <g id="lmseeds"></g>
  <rect x="278" y="244" width="84" height="34" rx="8" fill="#8A3E20"/>
  <path d="M302 250V150H220" stroke="#B7C6D6" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M338 270V600" stroke="#B7C6D6" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path id="lmpipe" d="M338 250V150Q338 100 400 100H600Q672 100 672 160V455" stroke="#E8842C" stroke-width="12" fill="none" stroke-linecap="round"/>
  <rect x="600" y="460" width="300" height="20" rx="6" fill="#C9774A"/><rect x="610" y="480" width="16" height="220" fill="#B3663B"/><rect x="874" y="480" width="16" height="220" fill="#B3663B"/><rect x="600" y="620" width="300" height="16" rx="6" fill="#C9774A"/>
  ${[650,790].map((x,i)=>`<path d="M${x} 430V650a22 22 0 0044 0V430" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="4"/><path class="lw" id="lw${i}" d="M${x+3} 540V650a19 19 0 0038 0V540Z" fill="#BFE3F7" opacity=".9"/>`).join('')}
  <g id="lwm" opacity="0"><circle cx="655" cy="560" r="2.5" fill="#D9D5C5"/><circle cx="668" cy="589" r="2.5" fill="#D9D5C5"/><circle cx="681" cy="618" r="2.5" fill="#D9D5C5"/><circle cx="660" cy="647" r="2.5" fill="#D9D5C5"/><circle cx="673" cy="576" r="2.5" fill="#D9D5C5"/><circle cx="686" cy="605" r="2.5" fill="#D9D5C5"/><circle cx="665" cy="634" r="2.5" fill="#D9D5C5"/><circle cx="678" cy="563" r="2.5" fill="#D9D5C5"/><circle cx="657" cy="592" r="2.5" fill="#D9D5C5"/><circle cx="670" cy="621" r="2.5" fill="#D9D5C5"/><circle cx="683" cy="650" r="2.5" fill="#D9D5C5"/><circle cx="662" cy="579" r="2.5" fill="#D9D5C5"/><circle cx="675" cy="608" r="2.5" fill="#D9D5C5"/><circle cx="688" cy="637" r="2.5" fill="#D9D5C5"/></g><rect x="644" y="420" width="56" height="26" rx="6" fill="#8A3E20"/><path d="M672 440V640" stroke="#B7C6D6" stroke-width="7"/>
  <path id="lmflow" d="M330 600V260 M338 250V150Q338 100 400 100H600Q672 100 672 160V640" fill="none"/>
  <g id="lmf"></g>
  <g font-family="Inter,sans-serif" font-weight="700" font-size="23" id="lmlbl">
   <text x="130" y="140" class="lbl">Tube A</text><text x="360" y="420" class="lbl">Tube B</text><text x="120" y="610" class="lbl">Germinating seeds</text>
   <text x="700" y="380" class="lbl">Lime water</text><path d="M760 390L690 520M780 390L810 520" stroke="#142B45" stroke-width="2.5"/>
   <text x="672" y="786" text-anchor="middle" class="lbl" font-size="20">connected</text><text x="812" y="786" text-anchor="middle" class="lbl" font-size="20">not connected</text></g>
  <g transform="translate(830 40)"><rect width="180" height="60" rx="30" fill="#142B45"/><text id="lmclock" x="90" y="40" text-anchor="middle" class="lbl-w" font-size="28">0 h</text></g>
 </svg></div>
 <div class="col" style="gap:14px">${stepList(['Soak <b>moong</b> seeds overnight; place them on <b>wet cotton</b> in a conical flask.','Close the flask with a <b>two-holed cork</b> with tubes A and B; connect it by a rubber pipe to a test tube of <b>lime water</b>.','Keep a second test tube of lime water for comparison. Leave everything <b>undisturbed for 24 hours in the dark</b>.'])}
  <div class="card rv" data-s="3" style="padding:20px 26px"><p>Only the lime water <b>connected to the flask</b> turns <b>milky</b>.</p></div>
  <div class="concl rv" data-s="4" style="font-size:28px">Lime water turns milky due to <b>more carbon dioxide</b> in the flask. This extra CO₂ is produced by the seeds as they <b>respire</b>.</div></div></div>`,
 steps:4,
 init(el,o){
  const R=rng(17);o.seeds=[];let s='';for(let i=0;i<26;i++){const x=200+R()*250,y=628+R()*18;s+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${R()*60-30})"><path class="rt" d="M8 2q6 8 2 16" stroke="#FFF7E0" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/><ellipse rx="10" ry="7" fill="${R()>.5?'#5DAA3C':'#76BE4A'}" stroke="#3C7A26" stroke-width="1.5"/></g>`;}
  $('#lmseeds',el).innerHTML=s;
  o.flow=new Flow($('#lmpipe',el),{kind:'co2',r:13,n:8,speed:.12,into:$('#lmf',el)});o.flow.set(false);
  o.state=t=>{$('#lw0',el).setAttribute('fill',mix('#BFE3F7','#FBFAF4',t));$('#lw0',el).setAttribute('opacity',.9+t*.1);$('#lwm',el).setAttribute('opacity',t);$$('.rt',el).forEach(r=>r.setAttribute('opacity',t));$('#lmclock',el).textContent=Math.round(t*24)+' h';};
 },
 onStep(el,s,o){o._bag.clear();markSteps(el,Math.min(s,3));$('#lmdark',el).setAttribute('opacity',0);o.flow.set(false);
  if(s<3)o.state(0);
  if(s===3){$('#lmdark',el).setAttribute('opacity',.55);o.flow.set(true);o._bag.tw(6000,e=>o.state(e),()=>{$('#lmdark',el).setAttribute('opacity',0);o.flow.set(false);});}
  if(s>=4)o.state(1);},
 tick(dt,t,el,o){o.flow.tick(dt);}
});

/* ===================== RESPIRATION EQUATION ===================== */
S({id:'resp',sec:'10.4 Do plants respire?',title:'The respiration equation',head:'Respiration: releasing energy from food',
 notes:'Point out the difference: photosynthesis <b>makes</b> food (only in green parts, in light); respiration <b>breaks down</b> food to release energy (in <b>all</b> parts, all the time).',
 html:`<div class="card" style="padding:44px;text-align:center"><div style="display:flex;align-items:center;justify-content:center;gap:18px;font-size:38px;font-weight:800;white-space:nowrap">
  <span class="row rv" data-s="1" style="gap:10px">${ic('glucose',64)}Glucose</span><span class="rv" data-s="1">+</span><span class="row rv" data-s="1" style="gap:10px">${ic('o2',64)}Oxygen</span>
  <svg class="rv" data-s="2" width="200" height="34" viewBox="0 0 200 34"><path d="M6 17H182" stroke="#142B45" stroke-width="6" stroke-linecap="round"/><path d="M170 5L192 17L170 29" fill="none" stroke="#142B45" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <span class="row rv" data-s="2" style="gap:10px">${ic('co2',64)}Carbon dioxide</span><span class="rv" data-s="2">+</span><span class="row rv" data-s="2" style="gap:10px">${ic('drop',58)}Water</span><span class="rv" data-s="2">+</span><span class="row rv pulse" data-s="2" style="gap:10px">${ic('energy',64)}Energy</span></div></div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:30px">
  <div class="card rv" data-s="3"><p><b>Glucose is broken down</b> in the presence of <b>oxygen</b>.</p></div>
  <div class="card rv" data-s="3"><p><b>Carbon dioxide</b> and <b>water</b> are released.</p></div>
  <div class="card sun rv" data-s="3"><p>The <b>energy</b> is used by plants for their <b>growth and development</b>.</p></div></div>
 <div class="grid2 even rv" data-s="4" style="height:auto;margin-top:26px;gap:26px"><div class="concl" style="font-size:29px"><b>All parts</b> of a plant — green or non-green (roots, stem, leaves, flowers, seeds) — carry out respiration.</div>
  <div class="caution" style="font-size:27px">${ic('warn',44)}<div><b>Don’t mix them up!</b> Photosynthesis and respiration are two <b>different</b> processes.</div></div></div>`
});

/* ===================== PHOTOSYNTHESIS vs RESPIRATION ===================== */
const CMP={p:{inp:['co2','water'],out:['food','o2'],col:'#239B56',name:'Photosynthesis'},r:{inp:['food','o2'],out:['co2','water','energy'],col:'#3988E8',name:'Respiration'}};
S({id:'cmp',sec:'Compare the processes',title:'Photosynthesis vs Respiration',head:'Photosynthesis vs Respiration',zoom:true,
 notes:'Click each process to animate its inputs and outputs. Ask students to complete the textbook table (Q1) aloud before revealing rows.',
 html:`<div class="grid2" style="grid-template-columns:1fr 1.35fr;height:780px"><div class="viz"><svg viewBox="0 0 700 780" id="cmsvg">
  <g id="cmsun">${ART.sun(350,80,40)}</g>
  <rect x="215" y="270" width="270" height="240" rx="90" fill="#DFF5E5" stroke="#239B56" stroke-width="5" id="cmbox"/>
  <text x="350" y="380" text-anchor="middle" class="lbl" font-size="30" id="cmname">Photosynthesis</text><text x="350" y="420" text-anchor="middle" font-size="22" fill="#4A5F78" font-family="Inter,sans-serif" font-weight="600" id="cmwhere">in green parts</text>
  <path id="ci0" d="M20 250Q140 300 230 360" fill="none"/><path id="ci1" d="M20 560Q140 480 230 430" fill="none"/>
  <path id="co0" d="M470 340Q580 270 690 230" fill="none"/><path id="co1" d="M470 400H690" fill="none"/><path id="co2p" d="M470 450Q580 520 690 580" fill="none"/>
  <path id="cph" d="M350 140V270" fill="none"/>
  <g id="cmf"></g><text x="40" y="660" class="lbl" font-size="28">IN</text><text x="600" y="660" class="lbl" font-size="28">OUT</text></svg>
  <div class="ctrls overlay" style="left:50%;transform:translateX(-50%);bottom:24px"><div class="seg"><button id="cmp-p" class="on">Photosynthesis</button><button id="cmp-r">Respiration</button></div></div></div>
 <table class="tb" id="cmtb" style="align-self:start"><tr><th style="width:24%">Feature</th><th id="th-p">Photosynthesis</th><th id="th-r">Respiration</th></tr>
  <tr class="rv" data-s="1"><td><b>Raw materials</b></td><td>Carbon dioxide + Water</td><td>Glucose + Oxygen</td></tr>
  <tr class="rv" data-s="2"><td><b>Products</b></td><td>Glucose + Oxygen</td><td>Carbon dioxide + Water + Energy</td></tr>
  <tr class="rv" data-s="3"><td><b>Requirement</b></td><td>Sunlight and chlorophyll</td><td>Oxygen</td></tr>
  <tr class="rv" data-s="4"><td><b>Where / when</b></td><td>Green parts, in sunlight</td><td>All parts, all the time</td></tr>
  <tr class="rv" data-s="5"><td><b>Main purpose</b></td><td>Food preparation</td><td>Energy release</td></tr>
  <tr class="rv" data-s="6"><td><b>Word equation</b></td><td style="font-size:22px">Carbon dioxide + Water → Glucose + Oxygen <i>(sunlight, chlorophyll)</i></td><td style="font-size:22px">Glucose + Oxygen → Carbon dioxide + Water + Energy</td></tr></table></div>`,
 init(el,o){const F=$('#cmf',el);o.fl={};
  const mk=(id,kind,seed)=>new Flow($('#'+id,el),{kind,r:22,n:3,speed:.22,seed,into:F});
  o.fl.p=[mk('ci0','co2',1),mk('ci1','water',2),mk('co0','food',3),mk('co2p','o2',4),new Flow($('#cph',el),{kind:'photon',r:8,n:4,speed:.6,into:F})];
  o.fl.r=[mk('ci0','food',5),mk('ci1','o2',6),mk('co0','co2',7),mk('co1','water',8),mk('co2p','energy',9)];
  o.mode=m=>{o.m=m;const c=CMP[m];o.fl.p.forEach(f=>f.set(m==='p'));o.fl.r.forEach(f=>f.set(m==='r'));
   $('#cmp-p',el).classList.toggle('on',m==='p');$('#cmp-r',el).classList.toggle('on',m==='r');$('#cmname',el).textContent=c.name;$('#cmwhere',el).textContent=m==='p'?'in green parts, in light':'in all living parts';
   $('#cmbox',el).setAttribute('stroke',c.col);$('#cmbox',el).setAttribute('fill',m==='p'?'#DFF5E5':'#E3EFFD');$('#cmsun',el).style.opacity=m==='p'?1:.15;
   $$('#cmtb tr',el).forEach(tr=>{const td=tr.children;if(td.length<3)return;td[1].style.background=m==='p'?'#E8F8EE':'';td[2].style.background=m==='r'?'#E6F0FD':'';});
   $('#th-p',el).style.background=m==='p'?'#239B56':'';$('#th-r',el).style.background=m==='r'?'#3988E8':'';};
  $('#cmp-p',el).onclick=()=>o.mode('p');$('#cmp-r',el).onclick=()=>o.mode('r');},
 enter(el,o){o.mode('p');},
 tick(dt,t,el,o){[...o.fl.p,...o.fl.r].forEach(f=>f.tick(dt));}
});

/* ===================== SCIENTISTS ===================== */
function portrait(f){return`<svg width="230" height="270" viewBox="0 0 230 270"><defs><linearGradient id="pbg${f}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f?'#F3ECFF':'#E3EFFD'}"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs><rect width="230" height="270" rx="30" fill="url(#pbg${f})"/>
 ${f?`<path d="M40 270C46 205 76 180 115 180S184 205 190 270Z" fill="#7A4CD9"/><path d="M60 270C80 220 100 200 140 190L180 270Z" fill="#B48CF2"/><circle cx="115" cy="122" r="46" fill="#C99470"/><path d="M68 118C66 76 92 64 115 64S166 76 162 118C154 92 136 84 115 84S78 92 68 118Z" fill="#2B1B12"/><circle cx="160" cy="112" r="15" fill="#2B1B12"/><circle cx="115" cy="104" r="3.5" fill="#B3263E"/>`
 :`<path d="M36 270C42 205 74 180 115 180S188 205 194 270Z" fill="#2E3D52"/><path d="M98 182L115 230L132 182Z" fill="#fff"/><path d="M111 190h8l-2 30h-4z" fill="#8A2A12"/><circle cx="115" cy="122" r="46" fill="#C99470"/><path d="M70 112C70 76 92 64 115 64S160 76 160 112C152 92 138 86 115 86S78 92 70 112Z" fill="#3A3A3A"/><g fill="none" stroke="#142B45" stroke-width="3"><circle cx="97" cy="124" r="12"/><circle cx="133" cy="124" r="12"/><path d="M109 124h12"/></g><path d="M98 150q17 8 34 0" stroke="#5A3A2A" stroke-width="5" fill="none" stroke-linecap="round"/>`}
 <text x="115" y="258" text-anchor="middle" font-size="13" fill="#8AA2BD" font-family="Inter,sans-serif" font-weight="700">Illustration</text></svg>`;}
S({id:'sci',sec:'Know a scientist',title:'Scientists behind the discoveries',head:'Know a scientist',zoom:true,
 notes:'All details are from the textbook. Ask: <i>Which of them studied photosynthesis? Which one worked on respiration?</i>',
 html:`<div class="grid2 even" style="height:auto;gap:40px">
  <div class="card" style="display:flex;gap:30px;padding:34px">${portrait(0)}<div class="col" style="gap:12px"><div class="pill g">Photosynthesis</div><h3 style="font-size:40px">Rustom Hormusji Dastur</h3><p class="muted" style="font-size:26px">1896–1961 · Plant scientist</p>
   <ul class="list" style="gap:10px">${['Head of the Botany Department, Royal Institute of Science, Bombay (now Institute of Science, Mumbai), 1921–1935.','Studied the effects of the <b>amount of water</b> and <b>temperature</b> on photosynthesis.','Examined the importance of water, temperature and the <b>colour of light</b> in photosynthesis.'].map(t=>`<li style="font-size:25px">${t}</li>`).join('')}</ul></div></div>
  <div class="card rv" data-s="1" style="display:flex;gap:30px;padding:34px">${portrait(1)}<div class="col" style="gap:12px"><div class="pill" style="background:#F3ECFF;color:#7A4CD9">Respiration</div><h3 style="font-size:40px">Kamala Sohonie</h3><p class="muted" style="font-size:26px">1911–1998 · A woman scientist of India</p>
   <ul class="list" style="gap:10px">${['Received a <b>Ph.D. from Cambridge University</b> for her work on <b>respiration in plants</b>.','Worked at Lady Hardinge Medical College (New Delhi), the Nutrition Research Laboratory (Coonoor), and the Royal Institute of Science, Bombay, where she became <b>Director</b>.','Her work helped improve the <b>nutritive value of plant foods</b>; she worked on coconut palm sap as a nutritive drink, <b>Neera</b>.'].map(t=>`<li style="font-size:25px">${t}</li>`).join('')}</ul></div></div></div>`
});

/* ===================== BOTTLE GARDEN ===================== */
S({id:'bottle',sec:'Exploratory project',title:'Bottle garden',head:'A bottle garden: a world in a jar',zoom:true,
 notes:'Exploratory project from the textbook. If the sealed plant keeps growing well, it is maintaining its own gas exchange. Try it with a spider plant or jade plant.',
 html:`<div class="grid2"><div class="viz" style="background:radial-gradient(800px 600px at 20% 10%,#FFF6D8,#FFFFFF 60%)"><svg viewBox="0 0 1040 790">
  ${ART.sun(110,100,44)}${[0,1,2].map(i=>`<line x1="170" y1="${150+i*26}" x2="${420}" y2="${300+i*60}" stroke="url(#gRay)" stroke-width="10" class="dash"/>`).join('')}
  <path d="M470 90H570V150Q760 190 760 380V700Q760 750 710 750H330Q280 750 280 700V380Q280 190 470 150Z" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="6"/>
  <rect x="456" y="62" width="128" height="44" rx="10" fill="#A56B3C"/>
  <path d="M286 640H754V700Q754 744 710 744H330Q286 744 286 700Z" fill="url(#gSoil)"/><path d="M286 640H754V660H286Z" fill="#6C4A2A"/>
  ${[0,1,2,3,4,5,6,7,8].map(i=>{const a=-160+i*17.5,L=180+(i%3)*50;const r=a*Math.PI/180;const ex=520+Math.cos(r)*L,ey=640+Math.sin(r)*L*0.9;return`<path d="M520 640Q${520+Math.cos(r)*L*.5} ${640+Math.sin(r)*L*1.05} ${ex.toFixed(0)} ${(ey+ (i%2?40:10)).toFixed(0)}" stroke="${i%2?'#3DB26A':'#6FCB8E'}" stroke-width="16" fill="none" stroke-linecap="round"/>`;}).join('')}
  <path id="bgl" d="M400 600C330 520 330 360 470 290" fill="none"/><path id="bgr" d="M570 290C710 360 710 520 640 600" fill="none"/>
  <path d="M400 600C330 520 330 360 470 290" stroke="#97A1AC" stroke-width="5" fill="none" stroke-dasharray="4 10" marker-end="url(#mArrow)"/><path d="M570 290C710 360 710 520 640 600" stroke="#4FD1E3" stroke-width="5" fill="none" stroke-dasharray="4 10" marker-end="url(#mArrow)"/>
  <g id="bgf"></g>
  <g font-family="Inter,sans-serif" font-weight="800" font-size="22"><rect x="30" y="400" width="250" height="84" rx="20" fill="#fff" stroke="#C9D2DA" stroke-width="2"/><text x="155" y="434" text-anchor="middle" fill="#4A5F78">CO₂ from respiration</text><text x="155" y="466" text-anchor="middle" fill="#142B45">→ photosynthesis</text>
   <rect x="770" y="400" width="250" height="84" rx="20" fill="#fff" stroke="#A9E7EF" stroke-width="2"/><text x="895" y="434" text-anchor="middle" fill="#1AA6BA">O₂ from photosynthesis</text><text x="895" y="466" text-anchor="middle" fill="#142B45">→ respiration</text></g>
  <text x="520" y="40" text-anchor="middle" class="lbl" font-size="26">Sealed bottle</text></svg></div>
 <div class="col" style="gap:16px">${stepList(['Plant a growing plant like a <b>spider plant</b> or <b>jade plant</b> in a large transparent bottle.','Let it grow properly for some time, then <b>seal</b> the mouth of the bottle.','<b>Observe</b> the growth of the plant.'])}
  <div class="card green rv" data-s="1" style="padding:20px 26px"><p>If the plant grows well, it is maintaining the <b>exchange of gases</b> inside the bottle.</p></div>
  <div class="concl rv" data-s="2" style="font-size:27px">Carbon dioxide from <b>respiration</b> is used for <b>photosynthesis</b>, and oxygen from <b>photosynthesis</b> is used in <b>respiration</b>.</div></div></div>`,
 init(el,o){const F=$('#bgf',el);o.f=[new Flow($('#bgl',el),{kind:'co2',r:18,n:4,speed:.13,into:F}),new Flow($('#bgr',el),{kind:'o2',r:18,n:4,speed:.13,seed:4,into:F})];},
 tick(dt,t,el,o){o.f.forEach(f=>f.tick(dt));}
});

/* ===================== MIND MAP ===================== */
const MM=[
 ['Plant growth',200,150,'Plants need <b>sunlight and water</b> to grow (Activity 10.1). New leaves and branches emerge, height increases, stem thickens.'],
 ['Photosynthesis',620,150,'Plants prepare food using <b>carbon dioxide + water</b> in the presence of <b>sunlight and chlorophyll</b>. <br><b>Carbon dioxide + Water → Glucose + Oxygen</b> (sunlight, chlorophyll)'],
 ['Stomata &|gas exchange',1040,150,'Tiny pores on leaves. Help in the <b>exchange of oxygen and carbon dioxide</b> during photosynthesis and respiration.'],
 ['Xylem',1460,150,'Tube-like structures that carry <b>water and minerals</b> from the roots to the leaves and other parts (red ink experiment).'],
 ['Phloem',1460,440,'Tube-like structures that carry <b>food</b> from the leaves to all parts. Food may be stored in roots and seeds.'],
 ['Respiration',1040,440,'Glucose is broken down using oxygen to release energy. <br><b>Glucose + Oxygen → Carbon dioxide + Water + Energy</b>. Happens in all parts.'],
 ['Energy for|growth',620,440,'The energy released in respiration is used for <b>growth and development</b> — and the cycle of life continues.']];
S({id:'mind',sec:'Chapter summary',title:'Mind map',head:'The chapter at a glance',zoom:true,
 notes:'Press Next to build the map node by node, or click any node to show its key idea. Ask a student to explain each link in their own words.',
 html:`<div class="viz" style="height:600px"><svg viewBox="0 0 1740 600" id="mmsvg"><g id="mmlinks"></g><g id="mmnodes"></g></svg></div>
  <div class="card" id="mminfo" style="margin-top:22px;min-height:150px;display:flex;gap:26px;align-items:center"><p class="muted">Click a node to see its key idea.</p></div>`,
 steps:7,
 init(el,o){
  const links=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]];let l='';
  links.forEach(([a,b],i)=>{const A=MM[a],B=MM[b];l+=`<path class="mml" data-i="${i+1}" d="M${A[1]} ${A[2]}L${B[1]} ${B[2]}" stroke="#9AB0C7" stroke-width="6" fill="none" stroke-dasharray="600" stroke-dashoffset="600" style="transition:stroke-dashoffset 1s" marker-end="url(#mArrow)"/>`;});
  l+=`<path class="mml" data-i="7" d="M560 470Q200 560 180 220" stroke="#239B56" stroke-width="5" fill="none" stroke-dasharray="900" stroke-dashoffset="900" style="transition:stroke-dashoffset 1.2s" marker-end="url(#mArrow)"/>`;
  $('#mmlinks',el).innerHTML=l;
  const cols=['#239B56','#2FA862','#4FB9C9','#3988E8','#E08E1B','#5A7BE0','#F2A33A'];
  $('#mmnodes',el).innerHTML=MM.map(([t,x,y],i)=>`<g class="mmn clk" data-n="${i}" transform="translate(${x} ${y})" style="opacity:0;transition:opacity .5s"><rect x="-175" y="-58" width="350" height="116" rx="58" fill="#fff" stroke="${cols[i]}" stroke-width="6" filter="url(#fShadow)"/><circle cx="-120" r="34" fill="${cols[i]}"/><text x="-120" y="11" text-anchor="middle" class="lbl-w" font-size="30">${i+1}</text>${t.includes('|')?`<text x="30" y="-6" text-anchor="middle" class="lbl" font-size="27">${t.split('|')[0]}</text><text x="30" y="26" text-anchor="middle" class="lbl" font-size="27">${t.split('|')[1]}</text>`:`<text x="30" y="10" text-anchor="middle" class="lbl" font-size="30">${t}</text>`}</g>`).join('');
  o.show=i=>{$$('.mmn rect',el).forEach((r,k)=>r.setAttribute('fill',k===i?'#F4FFF7':'#fff'));$('#mminfo',el).innerHTML=`<div class="pill g" style="font-size:28px;flex:none">${i+1}. ${MM[i][0].replace('|',' ')}</div><p>${MM[i][3]}</p>`;};
  $$('.mmn',el).forEach(g=>g.onclick=()=>o.show(+g.dataset.n));
 },
 onStep(el,s,o){$$('.mmn',el).forEach((g,i)=>g.style.opacity=i<Math.max(1,s)?1:0);$$('.mml',el).forEach(p=>p.setAttribute('stroke-dashoffset',+p.dataset.i<s?0:p.getAttribute('stroke-dasharray')));
  if(s>=1)o.show(Math.min(s,7)-1);else $('#mminfo',el).innerHTML='<p class="muted">Press Next to build the map, or click a node.</p>';
  if(s===7)$$('.mml',el).forEach(p=>p.setAttribute('stroke-dashoffset',0));}
});

S({id:'nut',sec:'Chapter summary',title:'In a nutshell',head:'In a nutshell',
 notes:'Read these together. These six points are the core of the chapter.',
 html:`<ul class="list" style="gap:20px">
  ${['All living organisms require food that provides energy for their growth and development.','Plants use <b>carbon dioxide</b> and <b>water</b> in the presence of <b>sunlight</b> and <b>chlorophyll</b> to produce <b>glucose</b> and <b>oxygen</b>. This process of synthesis of food is <b>photosynthesis</b>.','Leaves are the <b>‘food factories’</b> of a plant.','Tiny pores on the surface of leaves, called <b>stomata</b>, help in the exchange of oxygen and carbon dioxide during photosynthesis and respiration.','The <b class="bl">xylem</b> transports water and minerals from roots, while the <b class="fd">phloem</b> carries food from leaves to all parts of the plant.','Plants break down glucose and release energy by <b>respiration</b>. They use oxygen and release carbon dioxide in this process.'].map((t,i)=>`<li class="rv" data-s="${i+1}" style="font-size:31px">${t}</li>`).join('')}</ul>`
});

/* ===================== QUIZ ===================== */
const QZ=[
 {t:'MCQ',q:'The green pigment in leaves that helps capture sunlight is:',o:['Starch','Chlorophyll','Iodine','Xylem'],a:1,w:'Chlorophyll is the green pigment that captures sunlight efficiently. Starch is stored food; iodine is used to test for starch.',v:'leaf'},
 {t:'Predict the result',q:'A few drops of diluted iodine are put on a decolourised leaf that contains starch. The leaf turns:',o:['Red','Blue-black','Milky white','Bright green'],a:1,w:'A blue-black colour with iodine shows that starch is present.',v:'glucose'},
 {t:'Reasoning',q:'Why is the leaf boiled in alcohol (in a water bath) before the iodine test?',o:['To add starch to it','To remove the green colour so the colour change is easy to see','To make it grow','To kill germs on it'],a:1,w:'Decolourisation removes the green chlorophyll so we can easily observe the blue-black colour of starch.',v:'eye'},
 {t:'Predict the result',q:'A variegated leaf from a plant kept in the dark for 36 hours is tested with iodine. What will you see?',o:['Only green patches turn blue-black','Only white patches turn blue-black','No blue-black colour anywhere','The whole leaf turns blue-black'],a:2,w:'Without sunlight, no starch is made — not even in the green patches (Activity 10.3).',v:'sun'},
 {t:'True or False',q:'In Activity 10.4, the half of the leaf inside the bottle with caustic soda turns blue-black.',o:['True','False'],a:1,w:'False. Caustic soda absorbs carbon dioxide, so no starch is made inside. Only the outside half turns blue-black.',v:'co2'},
 {t:'Identify the structure',q:'Name the tiny pore shown by the arrow in this leaf peel.',fig:'sto',o:['Xylem','Phloem','Stoma','Root hair'],a:2,w:'Stomata are tiny pores on the surface of leaves (mostly the lower surface) that help in the exchange of gases.',v:'eye'},
 {t:'MCQ',q:'In Activity 10.5, a lit matchstick burns with an intense flame in the gas collected from the water plant kept in sunlight. The gas is rich in:',o:['Carbon dioxide','Nitrogen','Oxygen','Water vapour'],a:2,w:'Oxygen helps things burn brightly. Oxygen is released during photosynthesis.',v:'o2'},
 {t:'Match the following',q:'Match each part with its job.',m:[['Xylem','Carries water and minerals'],['Phloem','Carries food'],['Stomata','Exchange of gases'],['Chlorophyll','Captures sunlight']],w:'Xylem — water and minerals up from roots; phloem — food from leaves; stomata — gas exchange; chlorophyll — captures sunlight.',v:'leaf'},
 {t:'Identify the structure',q:'A twig kept in red ink water is cut. Which structure is stained red?',fig:'xyl',o:['Phloem','Xylem','Stomata','Chlorophyll'],a:1,w:'The xylem carries water (and the red ink) up the stem — so it is stained red.',v:'drop'},
 {t:'Reasoning',q:'A potato slice turns blue-black with iodine. Where did its starch come from?',o:['It was absorbed from the soil','It was made in the leaves and carried by the phloem','It was made by the xylem','It was made in the roots from minerals'],a:1,w:'Food is made in the leaves by photosynthesis and transported by the phloem to be stored.',v:'glucose'},
 {t:'Predict the result',q:'Why does lime water turn milky in the tube connected to the flask of germinating seeds?',o:['Seeds release oxygen','Seeds release carbon dioxide as they respire','Cotton releases water','Lime water turns milky in the dark'],a:1,w:'Germinating seeds respire and release extra carbon dioxide, which turns lime water milky.',v:'co2'},
 {t:'Reasoning',q:'X is broken down using Y to release carbon dioxide, Z and energy. X, Y and Z are:',o:['X = oxygen, Y = glucose, Z = water','X = glucose, Y = oxygen, Z = water','X = water, Y = carbon dioxide, Z = glucose','X = starch, Y = water, Z = oxygen'],a:1,w:'Glucose + Oxygen → Carbon dioxide + Water + Energy. So X = glucose, Y = oxygen, Z = water.',v:'energy'},
 {t:'True or False',q:'Only the green parts of a plant carry out respiration.',o:['True','False'],a:1,w:'False. All parts of a plant, green or non-green, carry out respiration.',v:'energy'},
 {t:'Predict the result',q:'Vani keeps four plants: (a) sunlight with CO₂, (b) sunlight without CO₂, (c) dark with CO₂, (d) dark without CO₂. In which will starch be formed?',o:['(a) only','(a) and (b)','(a) and (c)','All four'],a:0,w:'Photosynthesis needs both sunlight and carbon dioxide (plus water and chlorophyll). Only plant (a) has both.',v:'sun'},
 {t:'Know a scientist',q:'Which Indian scientist worked on the sap of the coconut palm as a nutritive drink called Neera?',o:['Rustom Hormusji Dastur','Kamala Sohonie','C. V. Raman','Jagadish Chandra Bose'],a:1,w:'Kamala Sohonie (1911–1998) — Ph.D. from Cambridge on respiration in plants; worked on Neera and the nutritive value of plant foods.',v:'bulb'}];
const QFIG={sto:`<svg width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="146" fill="#E6E9FA" stroke="#2A3B56" stroke-width="8"/>${[[60,80],[140,60],[220,90],[70,170],[150,150],[230,180],[100,240],[190,240]].map(([x,y])=>`<rect x="${x-38}" y="${y-24}" width="76" height="48" rx="8" fill="#DCE1F6" stroke="#6E62B8" stroke-width="3"/>`).join('')}<g transform="translate(150 150)"><ellipse cx="-13" rx="13" ry="24" fill="#9ED39A" stroke="#3F7A45" stroke-width="3"/><ellipse cx="13" rx="13" ry="24" fill="#9ED39A" stroke="#3F7A45" stroke-width="3"/><ellipse rx="4" ry="15" fill="#2B2350"/></g><path d="M260 40L180 120" stroke="#E0475B" stroke-width="7" marker-end="url(#mArrow)"/></svg>`,
 xyl:`<svg width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="#7CC98F"/><circle cx="150" cy="150" r="128" fill="#E8F6E1"/>${Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return`<g transform="translate(${150+Math.cos(a)*85} ${150+Math.sin(a)*85}) rotate(${a*180/Math.PI+90})"><ellipse cy="-12" rx="18" ry="12" fill="#F4E2B8"/><ellipse cy="8" rx="16" ry="15" fill="#D7334B"/></g>`}).join('')}<path d="M290 260L250 170" stroke="#142B45" stroke-width="6" marker-end="url(#mArrow)"/></svg>`};
S({id:'quiz',sec:'Knowledge check',title:'Interactive quiz',head:'Knowledge check',zoom:true,
 notes:'Let students answer (show of hands or teams) before clicking. The explanation appears after each attempt. <b>Next</b> moves to the next question once answered; use <b>Skip</b> to move on without answering.',
 html:`<div class="row" style="position:absolute;right:90px;top:64px;gap:16px"><div class="pill" id="qzn">Question 1 of ${QZ.length}</div><div class="pill g" id="qzs" style="font-size:28px">Score 0</div></div>
  <div id="qzbox"></div>`,
 init(el,o){o.reset=()=>{o.i=0;o.score=0;o.done=false;o.ans=QZ.map(()=>null);o.render();};
  o.render=()=>{const box=$('#qzbox',el);$('#qzs',el).textContent='Score '+o.score;
   if(o.i>=QZ.length){o.done=true;$('#qzn',el).textContent='Finished!';const pc=o.score/QZ.length;
    box.innerHTML=`<div class="card" style="text-align:center;padding:60px"><div class="bob" style="display:inline-block">${ic(pc>=.7?'ok':'bulb',140)}</div><h2 class="t" style="font-size:72px;margin-top:20px">${o.score} / ${QZ.length}</h2><p class="big">${pc>=.8?'Outstanding — you are a plant scientist!':pc>=.5?'Well done! Revise the topics you missed.':'Good try! Let’s revisit the chapter together.'}</p><div class="ctrls" style="justify-content:center;margin-top:30px"><button class="btn" id="qzagain">↺ Try again</button><button class="btn pri" id="qzfin">Final challenge ▶</button></div></div>`;
    $('#qzagain',el).onclick=o.reset;$('#qzfin',el).onclick=()=>go(APP.i+1,'fwd');return;}
   const q=QZ[o.i];$('#qzn',el).textContent=`Question ${o.i+1} of ${QZ.length}`;
   let body='';
   if(q.m){const right=q.m.map((p,i)=>i).sort((a,b)=>((a*7+3)%5)-((b*7+3)%5));
    body=`<div class="mt" style="margin-top:10px">${q.m.map((p,i)=>`<button data-l="${i}">${p[0]}</button><button data-r="${right[i]}">${q.m[right[i]][1]}</button>`).join('')}</div>`;}
   else body=`<div style="display:flex;gap:34px;align-items:center">${q.fig?`<div style="flex:none">${QFIG[q.fig]}</div>`:''}<div class="qz-opts" style="flex:1;${q.o.length===2?'grid-template-columns:1fr 1fr':''}">${q.o.map((t,i)=>`<button class="qz-opt" data-i="${i}"><span class="k">${'ABCD'[i]}</span>${t}</button>`).join('')}</div></div>`;
   box.innerHTML=`<div class="card" style="padding:34px 40px"><div class="pill y" style="margin-bottom:14px">${q.t}</div><p style="font-size:38px;font-weight:750;line-height:1.3;margin-bottom:26px">${q.q}</p>${body}</div>
    <div id="qzfb" style="margin-top:22px;min-height:120px"></div><div class="ctrls" style="position:absolute;right:90px;bottom:30px"><button class="btn sm" id="qzskip">Skip</button><button class="btn pri" id="qznext" style="display:none">Next question ▶</button></div>`;
   $('#qzskip',el).onclick=()=>{o.i++;o.render();};$('#qznext',el).onclick=()=>{o.i++;o.render();};
   const fb=(ok)=>{o.ans[o.i]=ok;if(ok)o.score++;$('#qzs',el).textContent='Score '+o.score;$('#qzfb',el).innerHTML=`<div class="fb ${ok?'ok':'bad'}">${ic(ok?'ok':'bad',64)}<div style="flex:1"><b>${ok?'Correct!':'Not quite.'}</b> ${q.w}</div>${ic(q.v,90)}</div>`;$('#qzskip',el).style.display='none';$('#qznext',el).style.display='';};
   if(q.m){let pick=null,mist=0,got=0;$$('.mt button',el).forEach(b=>b.onclick=()=>{
     if(b.dataset.l!==undefined){$$('[data-l]',el).forEach(x=>x.classList.remove('pick'));b.classList.add('pick');pick=b;return;}
     if(!pick)return;if(pick.dataset.l===b.dataset.r){pick.classList.remove('pick');pick.classList.add('ok');b.classList.add('ok');pick=null;if(++got===q.m.length)fb(mist===0);}
     else{mist++;b.classList.remove('bad');void b.offsetWidth;b.classList.add('bad');}});}
   else $$('.qz-opt',el).forEach(b=>b.onclick=()=>{if(o.ans[o.i]!==null)return;const k=+b.dataset.i,ok=k===q.a;$('.qz-opts',el).parentElement.classList.add('qz-locked');
     $$('.qz-opt',el).forEach((x,j)=>{if(j===q.a)x.classList.add('right');else if(j===k)x.classList.add('wrong');else x.classList.add('dim');});fb(ok);});
  };
  o.reset();},
 onNext(el,o){if(o.done)return false;if(o.ans[o.i]!==null){o.i++;o.render();}return true;}
});

/* ===================== FINAL CHALLENGE ===================== */
S({id:'final',sec:'Final challenge',title:'What if…?',head:'Final challenge',zoom:true,
 notes:'Give students a full minute to think (use the timer). Take answers from several students, then reveal the guided explanation step by step. This links to textbook questions 2 and 10.',
 html:`<div class="q" style="font-size:42px;padding:34px 40px"><div class="qm" style="width:76px;height:76px;font-size:46px">?</div>If all photosynthetic organisms suddenly disappeared from Earth, what would happen to life?</div>
  <div class="row" style="margin:26px 0;gap:20px"><button class="btn blue" id="fnt">⏱ Start 60-second think time</button><div id="fntime" style="font-size:44px;font-weight:800;font-variant-numeric:tabular-nums;color:var(--blue)"></div></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px">
   <div class="card rv" data-s="1"><div style="font-size:56px">🍽️</div><h3>No new food</h3><p>Plants make food for all. Animals eat plants, or animals that eat plants — food chains would collapse.</p></div>
   <div class="card rv" data-s="2"><div style="font-size:56px">🫁</div><h3>Oxygen runs out</h3><p>Photosynthesis releases oxygen. Without it, the oxygen used in respiration would not be replaced.</p></div>
   <div class="card rv" data-s="3"><div style="font-size:56px">🌫️</div><h3>Carbon dioxide builds up</h3><p>Carbon dioxide from respiration would no longer be used — the balance in nature would be lost.</p></div></div>
  <div class="concl rv" data-s="4" style="margin-top:26px;font-size:30px">Photosynthesis and respiration together keep the <b>balance in nature</b>. Life on Earth depends on photosynthesis.</div>`,
 init(el,o){$('#fnt',el).onclick=()=>{o._bag.clear();let n=60;$('#fntime',el).textContent=n+' s';const id=setInterval(()=>{n--;$('#fntime',el).textContent=n>0?n+' s':'Time’s up!';if(n<=0)clearInterval(id);},1000);o._bag.add(()=>clearInterval(id));};},
 enter(el){$('#fntime',el).textContent='';}
});
S({id:'end',sec:'Final challenge',title:'Every leaf is a tiny food factory',bare:true,cls:'full',
 notes:'Close the lesson. Optional homework: start a bottle garden or the warm vs cold water-transport experiment (textbook Q9).',
 html:`<svg viewBox="0 0 1920 984" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%"><rect width="1920" height="984" fill="url(#gSky)"/>${ART.sun(1700,140,70)}
  <path d="M0 800Q480 740 960 790T1920 770V984H0Z" fill="#94D6A8"/><path d="M0 880Q600 850 1200 880T1920 870V984H0Z" fill="#5DBB7C"/>
  <g class="sway">${ART.plant(1500,880,{g:1,H:560})}</g></svg>
  <div style="position:absolute;left:120px;top:200px;width:1150px" class="col">
   <div class="kicker">Remember</div>
   <p style="font-size:66px;line-height:1.18;font-weight:800;letter-spacing:-.02em">Every leaf is a tiny <span class="g">food factory</span>.<br>Every root is a <span class="bl">gateway</span>.<br>Every plant is a <span style="color:#C67A12">living system</span>.</p>
   <div class="ctrls" style="margin-top:30px"><button class="btn pri" onclick="go(0,'back')">⌂ Back to start</button><button class="btn" onclick="toc(true)">☰ Chapter map</button></div></div>`
});

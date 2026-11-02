/* ===================== ACTIVITY 10.2 — STARCH TEST ===================== */
const GREEN='#2FA862',PALE='#EFE6C4',BB='#232A52',IOD='#C98A3C';
function stepList(items){return`<div class="steps">${items.map((t,i)=>`<div class="step"><div class="n">${i+1}</div><div>${t}</div></div>`).join('')}</div>`;}
function markSteps(el,s){$$('.step',el).forEach((d,i)=>{d.classList.toggle('on',i===s-1);d.classList.toggle('done',i<s-1);});}

S({id:'starch',sec:'10.2 Starch test',title:'Activity 10.2 — Starch test',head:'Activity 10.2: Testing a leaf for starch',zoom:true,
 notes:'Demonstration by the teacher only. Press <b>Next</b> to move through each step; the animation plays for that step. Emphasise: the test tube of alcohol is heated <b>in a water bath</b>, never directly on the flame.',
 html:`<div class="grid2"><div class="viz" style="background:linear-gradient(170deg,#F4F9FF,#FFFFFF)"><svg viewBox="0 0 1040 790" id="stsvg">
  <rect x="0" y="760" width="1040" height="30" fill="#E3ECF5"/>
  <g id="st-heat">
   <path d="M175 604H505" stroke="#5A6B7E" stroke-width="10" stroke-linecap="round"/><path d="M185 612V600M495 612V600" stroke="#5A6B7E" stroke-width="6"/>
   <path d="M200 606L160 760M480 606L520 760M340 606V760" stroke="#5A6B7E" stroke-width="9" stroke-linecap="round"/>
   <path d="M190 600q15-10 30 0t30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0 30 0" stroke="#8A9AAD" stroke-width="3" fill="none"/>
   <g transform="translate(340 690)"><path d="M-55 70Q-62 10 -20 0H20Q62 10 55 70Z" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="4"/><path d="M-50 70Q-55 30 -30 26H30Q55 30 50 70Z" fill="#CFE6FA"/><rect x="-8" y="-22" width="16" height="24" rx="4" fill="#C9C1A8"/>
    <g class="flick"><path d="M0 -84C-16 -60 -18 -40 0 -24C18 -40 16 -60 0 -84Z" fill="#FFB238"/><path d="M0 -66C-8 -52 -8 -40 0 -30C8 -40 8 -52 0 -66Z" fill="#FFF0B0"/></g></g>
   ${ART.beaker(200,300,280,296,.78)}
   <g id="st-bub">${Array.from({length:14},(_,i)=>`<circle cx="${225+(i*37)%230}" cy="580" r="${4+i%4*2}" fill="#fff" opacity=".8" style="animation:stbub ${1.6+(i%5)*.3}s ${-(i*.37)}s linear infinite"/>`).join('')}</g>
   <text x="200" y="285" class="lbl" font-size="24">Boiling water</text>
   <text x="560" y="610" class="lbl" font-size="22" fill="#4A5F78">Wire gauze</text><text x="420" y="740" class="lbl" font-size="22">Spirit lamp</text>
  </g>
  <g id="st-l1" opacity="0"><g transform="translate(245 500) rotate(-22)"><path id="stleaf1" d="${ART.leafPath(170,52)}" fill="${GREEN}"/></g>
   <g transform="translate(560 330)"><rect width="190" height="70" rx="35" fill="#142B45"/><text id="sttimer" x="95" y="46" text-anchor="middle" class="lbl-w" font-size="32">0 min</text></g></g>
  <g id="st-l2" opacity="0">
   <path d="M306 210V540a30 30 0 0060 0V210" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="5"/>
   <path id="stalc" d="M311 330V540a25 25 0 0050 0V330Z" fill="#EAF6FF" opacity=".95"/>
   <g transform="translate(336 350) rotate(90)"><path id="stleaf2" d="${ART.leafPath(190,22)}" fill="${GREEN}"/></g>
   <path d="M380 340H560" stroke="#142B45" stroke-width="3"/><text x="570" y="348" class="lbl" font-size="24">Alcohol in a test tube</text>
   <path d="M372 470H560" stroke="#142B45" stroke-width="3"/><text x="570" y="478" class="lbl" font-size="24">Leaf losing its colour</text>
   <text x="570" y="520" font-size="21" fill="#4A5F78" font-family="Inter,sans-serif" font-weight="600">(test tube kept in a hot water bath)</text></g>
  <g id="st-plate" opacity="0" transform="translate(520 440) scale(1.45) translate(-760 -600)">
   <ellipse cx="760" cy="640" rx="230" ry="66" fill="#DCE6F0"/><ellipse cx="760" cy="630" rx="230" ry="62" fill="#fff" stroke="#C9D7E5" stroke-width="4"/><ellipse cx="760" cy="630" rx="180" ry="44" fill="#F5F9FD"/>
   <g transform="translate(615 640) rotate(-8)"><path id="stleaf3" d="${ART.leafPath(300,80)}" fill="${PALE}" stroke="#D8CDA8" stroke-width="3"/><g id="stspots"></g></g>
   <text x="760" y="740" text-anchor="middle" class="lbl" font-size="24" id="stplbl">Decolourised leaf on a plate</text></g>
  <g id="st-drop" opacity="0" transform="translate(520 440) scale(1.45) translate(-760 -600)">
   <g transform="translate(930 470)"><rect x="-40" y="-90" width="80" height="120" rx="14" fill="#8A4B12"/><rect x="-22" y="-112" width="44" height="26" rx="6" fill="#3D2A1A"/><rect x="-32" y="-50" width="64" height="44" rx="6" fill="#fff"/><text y="-30" text-anchor="middle" font-size="13" font-weight="800" fill="#142B45" font-family="Inter,sans-serif">Iodine</text><text y="-14" text-anchor="middle" font-size="13" font-weight="800" fill="#142B45" font-family="Inter,sans-serif">solution</text></g>
   <g id="stdropper" transform="translate(760 300)"><rect x="-8" y="0" width="16" height="170" rx="6" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="3"/><rect x="-5" y="110" width="10" height="56" fill="${IOD}"/><ellipse cx="0" cy="-12" rx="22" ry="30" fill="#E0475B"/></g>
   <g id="stdrops"></g></g>
  <g id="st-res" opacity="0"><rect x="300" y="40" width="440" height="110" rx="26" fill="${BB}"/><text x="520" y="88" text-anchor="middle" class="lbl-w" font-size="30">Blue-black colour</text><text x="520" y="126" text-anchor="middle" font-size="24" fill="#FFE7A3" font-weight="700" font-family="Inter,sans-serif">→ starch is present</text></g>
 </svg><style>@keyframes stbub{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-210px);opacity:0}}</style></div>
 <div class="col" style="gap:16px">${stepList(['Keep a leaf in <b>boiling water</b> for five minutes to soften it.','Dip it in <b>alcohol</b> in a test tube; place the tube in a beaker of boiling water until the leaf becomes <b>colourless</b>.','Take out the leaf and place it on a <b>plate</b>.','Put a few drops of <b>diluted iodine solution</b> with a dropper.','Wait a few minutes. <b>Blue-black</b> colour shows the presence of <b>starch</b>.'])}
  ${CAUTION('Alcohol should <b>never</b> be placed near a heat source directly. It is highly flammable and can easily lead to fire and burns.')}</div></div>`,
 steps:5,
 onStep(el,s,o){
  o._bag.clear();markSteps(el,s);
  const show=(id,v)=>$(id,el).setAttribute('opacity',v?1:0);
  show('#st-heat',s<=2);show('#st-l1',s===1);show('#st-l2',s===2);show('#st-plate',s>=3);show('#st-drop',s===4);show('#st-res',s===5);
  $('#st-bub',el).style.display=s<=2?'':'none';
  $('.caution',el).style.boxShadow=s===2?'0 0 0 5px #FF9C80':'';
  const L1=$('#stleaf1',el),L2=$('#stleaf2',el),L3=$('#stleaf3',el),A=$('#stalc',el),sp=$('#stspots',el);
  L1.setAttribute('fill',GREEN);L2.setAttribute('fill',GREEN);A.setAttribute('fill','#EAF6FF');L3.setAttribute('fill',PALE);sp.innerHTML='';$('#stdrops',el).innerHTML='';
  $('#stplbl',el).textContent=s===5?'Leaf after iodine test':s===4?'Adding diluted iodine solution':'Decolourised leaf on a plate';
  if(s===1)o._bag.tw(2600,e=>$('#sttimer',el).textContent=Math.round(e*5)+' min');
  if(s===2){o._bag.add(tweenAttr(L2,'fill',GREEN,PALE,3800));o._bag.add(tweenAttr(A,'fill','#EAF6FF','#A7DDA9',3800));}
  const spots=()=>{sp.innerHTML=[[70,0,26],[150,-8,30],[220,6,22],[120,18,18]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.6}" fill="${IOD}" opacity=".85"/>`).join('');};
  if(s===4){const d=$('#stdropper',el);o._bag.tw(900,e=>d.setAttribute('transform',`translate(${lerp(930,760,e)} ${lerp(260,400,e)})`),()=>{
    let n=0;const drop=()=>{if(n++>=4){spots();return;}const c=svgEl('circle',{cx:760,cy:600,r:9,fill:IOD},$('#stdrops',el));o._bag.tw(500,e=>c.setAttribute('cy',lerp(600,632,e)),()=>{c.remove();spots();o._bag.later(200,drop);});};drop();});}
  if(s===5){spots();$$('ellipse',sp).forEach(e=>e.setAttribute('fill',BB));o._bag.add(tweenAttr(L3,'fill',PALE,BB,2600));}
 }
});

/* ===================== WHY DECOLOURISE + BEFORE/AFTER ===================== */
function leafCard(fill,label,sub,vein){return`<div class="card" style="text-align:center;padding:24px"><svg width="380" height="210" viewBox="0 0 380 210"><g transform="translate(30 105)"><path d="${ART.leafPath(320,90)}" fill="${fill}"/><path d="M4 0H300" stroke="${vein||'rgba(255,255,255,.55)'}" stroke-width="6" stroke-linecap="round"/></g></svg><h3>${label}</h3><p class="muted" style="font-size:24px">${sub}</p></div>`;}
S({id:'decol',sec:'10.2 Starch test',title:'Why decolourise the leaf?',head:'Why do we decolourise the leaf first?',
 notes:'Ask the question first and let students think. Then reveal the side-by-side: iodine on a green leaf is hard to see.',
 html:`<div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:20px;align-items:center">
   ${leafCard(GREEN,'Fresh leaf','Green due to chlorophyll')}<div style="font-size:60px;color:#9AB0C7">→</div>
   ${leafCard(PALE,'Decolourised','After alcohol in water bath','#D8CDA8')}<div style="font-size:60px;color:#9AB0C7">→</div>
   ${leafCard(BB,'After iodine','Blue-black = starch present')}</div>
  <div class="q" style="margin-top:34px"><div class="qm">?</div>Did you wonder why we decolourise the leaf at the beginning of this activity?</div>
  <div class="grid2 even rv" data-s="1" style="height:auto;margin-top:26px;gap:30px">
   <div class="fact" style="background:linear-gradient(135deg,#E3EFFD,#fff);border-color:#BFD6EE"><div class="tag" style="color:#3988E8">Dive deeper</div><p>Decolourisation removes the green colour, so we can <b>easily observe the colour change</b> — and thus the presence of starch.</p></div>
   <div class="card green"><p><b>So far:</b> Activity 10.1 — water and sunlight are essential for growth. Activity 10.2 — <b>green leaves store starch</b> as food.</p></div></div>`
});

/* ===================== ACTIVITY 10.3 — VARIEGATED LEAF ===================== */
function varLeaf(id){return`<g id="${id}"><clipPath id="${id}c"><path d="${ART.leafPath(520,150)}"/></clipPath>
  <path class="vm" d="${ART.leafPath(520,150)}" fill="#F3F0D2"/>
  <g clip-path="url(#${id}c)"><path class="vp" d="M40 0C70 -60 120 -95 190 -88C240 -110 300 -70 340 -84C400 -60 430 -30 470 -10C440 20 410 50 360 60C310 96 250 70 210 92C150 100 100 70 40 0Z" fill="${GREEN}"/></g>
  <path d="M6 0H500" stroke="rgba(255,255,255,.5)" stroke-width="6" stroke-linecap="round"/>
  <path class="vt" d="${ART.leafPath(520,150)}M40 0C70 -60 120 -95 190 -88C240 -110 300 -70 340 -84C400 -60 430 -30 470 -10C440 20 410 50 360 60C310 96 250 70 210 92C150 100 100 70 40 0Z" fill="none" stroke="#3988E8" stroke-width="4" stroke-dasharray="10 8" opacity="0"/></g>`;}
S({id:'a103',sec:'10.2 Why is chlorophyll important?',title:'Activity 10.3 — Variegated leaf',head:'Activity 10.3: How does sunlight help make starch?',zoom:true,
 notes:'Bhaskar uses a leaf with green and non-green patches (e.g. croton, coleus). Ask students to <b>predict</b> which parts will turn blue-black before you run the test. Press Next: trace → iodine test → observations.',
 html:`<div class="viz" style="height:470px"><svg viewBox="0 0 1740 470">
   <rect width="860" height="470" rx="28" fill="url(#gSky)"/>${ART.sun(780,80,36)}<rect x="880" width="860" height="470" rx="28" fill="#1C2B45"/>
   <circle cx="1650" cy="80" r="30" fill="#E6ECF5"/><circle cx="1664" cy="70" r="28" fill="#1C2B45"/>
   <text x="36" y="62" class="lbl" font-size="34">Plant kept in sunlight</text><text x="916" y="62" class="lbl-w" font-size="34">Plant kept in the dark — 36 hours</text>
   <g transform="translate(170 260)">${varLeaf('vl1')}</g><g transform="translate(1050 260)">${varLeaf('vl2')}</g>
   <g font-family="Inter,sans-serif" font-weight="700" font-size="26"><rect x="270" y="384" width="320" height="52" rx="26" fill="#fff"/><text id="vcap1" x="430" y="419" text-anchor="middle" fill="#142B45">Before the test</text>
   <rect x="1150" y="384" width="320" height="52" rx="26" fill="#fff"/><text id="vcap2" x="1310" y="419" text-anchor="middle" fill="#142B45">Before the test</text></g>
  </svg></div>
  <div style="display:grid;grid-template-columns:1fr 1.25fr;gap:30px;margin-top:22px">
   <div class="col" style="gap:14px"><div class="q" style="font-size:29px"><div class="qm">?</div>Predict: which parts of each leaf will turn blue-black?</div>
    <div class="ctrls"><button class="btn" id="vtr">✎ Trace patches</button><button class="btn pri" id="vgo">Do the iodine test</button><button class="btn sm" id="vrs">↺</button></div></div>
   <table class="tb rv" data-s="3"><tr><th>Light condition</th><th>Before test</th><th>After iodine test</th></tr>
    <tr><td>Plant in <b>sunlight</b></td><td>Green and non-green patches</td><td><b>Green patches turned blue-black</b></td></tr>
    <tr><td>Plant in the <b>dark</b></td><td>Green and non-green patches</td><td><b>No change in colour</b></td></tr></table></div>`,
 steps:3,
 init(el,o){
  const parts=id=>({m:$('#'+id+' .vm',el),p:$('#'+id+' .vp',el),t:$('#'+id+' .vt',el)});
  o.set=(stage)=>{o._bag.clear();const a=parts('vl1'),b=parts('vl2');
   [a,b].forEach(x=>{x.m.setAttribute('fill','#F3F0D2');x.p.setAttribute('fill',GREEN);x.t.setAttribute('opacity',stage>=1?1:0);});
   $('#vcap1',el).textContent=$('#vcap2',el).textContent=stage>=1?'Patches traced':'Before the test';
   if(stage>=2){const run=()=>{$('#vcap1',el).textContent=$('#vcap2',el).textContent='Decolourising…';
     o._bag.add(tweenAttr([a.p,b.p],'fill',GREEN,PALE,1400,()=>{$('#vcap1',el).textContent=$('#vcap2',el).textContent='Adding iodine…';
      o._bag.add(tweenAttr([a.m,b.m],'fill','#F3F0D2',IOD,1800));o._bag.add(tweenAttr(a.p,'fill',PALE,BB,1800));o._bag.add(tweenAttr(b.p,'fill',PALE,'#D6AA6B',1800,()=>{
       $('#vcap1',el).textContent='Green parts: blue-black';$('#vcap2',el).textContent='No blue-black anywhere';}));}));};run();}
  };
  $('#vtr',el).onclick=()=>{APP.step=Math.max(APP.step,1);applyStep();};
  $('#vgo',el).onclick=()=>{APP.step=Math.max(APP.step,2);applyStep();};
  $('#vrs',el).onclick=()=>{APP.step=0;applyStep();};
 },
 onStep(el,s,o){if(s!==o.last){if(!(o.last>=2&&s>=2))o.set(s);o.last=s;}},
 enter(el,o){o.last=-1;}
});

/* ===================== 10.3 INFERENCE + COLOURED LEAVES ===================== */
S({id:'chl',sec:'10.2 Why is chlorophyll important?',title:'Chlorophyll is essential',head:'What do we infer?',
 notes:'Discuss the tricky question: the non-green patches may still have a little chlorophyll — just not enough to make detectable starch. Then the coloured-leaves fact: click a leaf.',
 html:`<div class="grid2 even" style="height:auto">
  <div class="col">
   <div class="card rv" data-s="1"><p>Starch is produced <b>only where the green patches are</b> — and only when the plant gets <b>sunlight</b>.</p></div>
   <div class="q rv" data-s="2" style="font-size:28px"><div class="qm">?</div>Non-green patches did not turn blue-black. Does it mean there is no chlorophyll there?</div>
   <div class="card blue rv" data-s="3"><p>Not necessarily! They <b>may not have sufficient chlorophyll</b> to prepare enough starch to be detected by the iodine test.</p></div>
   <div class="concl rv" data-s="4"><b>Chlorophyll is essential</b> for preparing starch in the presence of sunlight. Hence leaves are called the <b>‘food factories’</b> of plants.</div>
  </div>
  <div class="fact rv" data-s="5"><div class="tag">Fascinating fact</div><h3 style="margin-bottom:10px">Red, violet and brown leaves</h3>
   <svg viewBox="0 0 760 260" style="width:100%;height:250px">${[['#B3263E',0],['#6E3B8E',250],['#8A5A2B',500]].map(([c,x],i)=>`<g class="clk" data-cl="${i}" transform="translate(${x+20} 130) rotate(-20)"><path d="${ART.leafPath(220,70)}" fill="${c}"/><path class="hid" d="${ART.leafPath(220,70)}" fill="${GREEN}" opacity="0" style="transition:opacity .6s"/><path d="M4 0H206" stroke="rgba(255,255,255,.5)" stroke-width="5"/></g>`).join('')}</svg>
   <p style="font-size:27px">They contain <b>more of these coloured pigments</b> than green chlorophyll, which <b>hides the green colour</b>. Some of these pigments also help in photosynthesis. An iodine test shows starch in these leaves too! <span class="muted">(Tap a leaf.)</span></p></div></div>`,
 init(el){$$('[data-cl]',el).forEach(g=>g.onclick=()=>{const h=$('.hid',g);h.setAttribute('opacity',h.getAttribute('opacity')==='0'?.55:0);});}
});

/* ===================== 10.2.2 ROLE OF AIR — QUESTION ===================== */
S({id:'airq',sec:'10.2 Role of carbon dioxide',title:'What about air?',head:'Is sunlight and chlorophyll enough?',zoom:true,
 notes:'Pose the question. Accept guesses (oxygen? carbon dioxide? nitrogen?). Do not confirm yet — the experiment will tell us.',
 html:`<div class="grid2 wideR" style="height:740px"><div class="viz" style="background:linear-gradient(170deg,#F2F7FC,#fff)"><svg viewBox="0 0 800 740" id="airsvg">
  <g transform="translate(400 620)">${ART.pot(0,0,240,120)}</g>${ART.plant(400,624,{g:.55,H:360})}
  <path id="airp1" d="M60 220C200 120 300 360 460 260S700 200 760 320" fill="none"/><path id="airp2" d="M40 500C160 420 260 520 380 420S620 380 770 470" fill="none"/>
  <text x="400" y="80" text-anchor="middle" class="lbl" font-size="38">Air around the plant…</text></svg></div>
  <div class="col">
   <div class="kid">${avatar('#D69B70','#2A1A10','#8E5BD8',1)}<div class="bubble">“My sister told me that <b>air</b> plays a role in the process of food preparation in plants.”</div></div>
   <div class="q rv" data-s="1"><div class="qm">?</div>Which gas from the air is essential for preparing food in plants?</div>
   <div class="row rv" data-s="2" style="gap:20px">${ic('o2',90)}${ic('co2',90)}<div style="font-size:26px;font-weight:700;color:var(--ink2)">…and other gases. <br>Let’s experiment!</div></div>
  </div></div>`,
 init(el,o){o.f=[new Flow($('#airp1',el),{kind:'co2',r:30,n:5,speed:.06}),new Flow($('#airp2',el),{kind:'o2',r:30,n:5,speed:.05,seed:3})];},
 tick(dt,t,el,o){o.f.forEach(f=>f.tick(dt));}
});

/* ===================== ACTIVITY 10.4 — CO2 BOTTLE ===================== */
S({id:'a104',sec:'10.2 Role of carbon dioxide',title:'Activity 10.4 — Caustic soda bottle',head:'Activity 10.4: Is carbon dioxide needed?',
 notes:'Demonstration by the teacher only. Caustic soda (sodium hydroxide) absorbs carbon dioxide, so the air inside the bottle has no CO₂. Everything else (water, sunlight, chlorophyll) is the same for both halves of the leaf.',
 html:`<div class="grid2"><div class="viz" style="background:linear-gradient(170deg,#F2F7FC,#fff)"><svg viewBox="0 0 1040 790" id="c4svg">
  <g id="c4sun" opacity="0" style="transition:opacity .8s">${ART.sun(110,100,46)}${[0,1,2].map(i=>`<line x1="${170+i*20}" y1="${150+i*30}" x2="${520+i*40}" y2="${130+i*60}" stroke="url(#gRay)" stroke-width="10" class="dash" stroke-linecap="round"/>`).join('')}</g>
  <g transform="translate(300 640)">${ART.pot(0,0,250,130)}</g>
  ${ART.plant(300,644,{g:.42,H:380,nobranch:1})}
  <path d="M305 420Q440 150 665 118" stroke="#2E9C57" stroke-width="9" fill="none" stroke-linecap="round"/>
  <g id="c4bottle" opacity="0" style="transition:opacity .6s">
   <path d="M650 250V300Q560 320 560 380V700Q560 730 590 730H830Q860 730 860 700V380Q860 320 770 300V250" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="5"/>
   <path d="M566 640H854V700Q854 724 830 724H590Q566 724 566 700Z" fill="#F4E9F7" opacity=".9"/>
   <text x="710" y="772" text-anchor="middle" class="lbl" font-size="23">Caustic soda (sodium hydroxide) solution</text>
   <rect x="636" y="222" width="148" height="36" rx="8" fill="#B07A47"/><path d="M710 222V258" stroke="#6E4722" stroke-width="3"/>
   <g id="c4in"></g><text x="900" y="430" class="lbl" font-size="22" id="c4nolbl" opacity="0">No CO₂</text><text x="900" y="458" class="lbl" font-size="22" id="c4nolbl2" opacity="0">inside</text></g>
  <g transform="translate(665 118) rotate(70)">
   <clipPath id="c4co"><rect x="-10" y="-120" width="140" height="240"/></clipPath><clipPath id="c4ci"><rect x="130" y="-120" width="300" height="240"/></clipPath>
   <path id="c4lo" clip-path="url(#c4co)" d="${ART.leafPath(360,90)}" fill="${GREEN}"/><path id="c4li" clip-path="url(#c4ci)" d="${ART.leafPath(360,90)}" fill="${GREEN}"/>
   <path d="M4 0H340" stroke="rgba(255,255,255,.5)" stroke-width="6"/></g><g id="c4cork" opacity="0"><rect x="636" y="222" width="148" height="36" rx="8" fill="#B07A47" opacity=".92"/><path d="M710 222V258" stroke="#6E4722" stroke-width="3"/></g>
  <path id="c4path" d="M500 60C600 0 780 40 760 120S600 230 560 140S700 20 840 80" fill="none"/>
  <g id="c4lbls" opacity="0" font-family="Inter,sans-serif" font-weight="800" font-size="24"><rect x="760" y="60" width="270" height="48" rx="24" fill="${BB}"/><text x="895" y="93" text-anchor="middle" fill="#fff">Outside: blue-black</text>
   <rect x="640" y="520" width="200" height="80" rx="20" fill="#fff" stroke="#D6AA6B" stroke-width="3"/><text x="740" y="553" text-anchor="middle" fill="#142B45">Inside:</text><text x="740" y="584" text-anchor="middle" fill="#142B45">no blue-black</text></g>
  <g id="c4dark" opacity="0" style="transition:opacity .8s" pointer-events="none"><rect width="1040" height="790" fill="#142B45" opacity=".82"/><circle cx="900" cy="110" r="44" fill="#E6ECF5"/><circle cx="920" cy="96" r="42" fill="#2A3B56"/><text x="520" y="120" text-anchor="middle" class="lbl-w" font-size="40">In the dark for 2–3 days</text><text x="520" y="166" text-anchor="middle" fill="#C9D7E5" font-size="28" font-family="Inter,sans-serif" font-weight="600">The plant uses up its stored starch (destarching)</text></g>
 </svg></div>
 <div class="col" style="gap:14px">${stepList(['Keep a potted plant in the <b>dark for 2–3 days</b> to destarch it.','Pour <b>caustic soda</b> into a wide-mouthed bottle — it <b>absorbs carbon dioxide</b>.','Insert <b>half of a leaf</b> into the bottle through a split cork; the other half stays outside.','Place the set-up in <b>sunlight</b> for a few hours.','Remove the leaf and do the <b>iodine test</b>.'])}
  ${CAUTION('Caustic soda is a strong chemical that can cause skin burns; <b>only teachers</b> should handle it.')}</div></div>`,
 steps:5,
 init(el,o){
  o.out=new Flow($('#c4path',el),{kind:'co2',r:17,n:6,speed:.05,seed:9});o.out.set(false);
  const box=$('#c4in',el);o.inm=[];for(let i=0;i<6;i++){const g=svgEl('g',{},box);g.innerHTML=ART.mol('co2',16);o.inm.push({g,x:600+(i%3)*90,y:360+Math.floor(i/3)*110,v:0});}
 },
 onStep(el,s,o){
  o._bag.clear();markSteps(el,s);const sh=(id,v)=>$(id,el).setAttribute('opacity',v?1:0);
  sh('#c4dark',s===1);sh('#c4bottle',s>=2);sh('#c4cork',s>=2);sh('#c4sun',s>=4);sh('#c4lbls',s>=5&&o.done);
  o.out.set(s>=2);o.absorb=s>=2;o.inm.forEach((m,i)=>{m.y=360+Math.floor(i/3)*110;m.gone=s>=3;m.g.style.opacity=m.gone?0:1;});
  sh('#c4nolbl',s>=3);sh('#c4nolbl2',s>=3);
  const lo=$('#c4lo',el),li=$('#c4li',el);lo.setAttribute('fill',GREEN);li.setAttribute('fill',GREEN);
  $('#c4lo',el).classList.toggle('glowleaf',s===4);
  if(s===5){o.done=false;o._bag.add(tweenAttr([lo,li],'fill',GREEN,PALE,1300,()=>{o._bag.add(tweenAttr(lo,'fill',PALE,BB,1800));o._bag.add(tweenAttr(li,'fill',PALE,'#D6AA6B',1800,()=>{o.done=true;sh('#c4lbls',1);}));}));}
 },
 tick(dt,t,el,o){o.out.tick(dt);if(o.absorb)o.inm.forEach((m,i)=>{if(m.gone)return;m.y+=dt*(60+i*12);m.g.setAttribute('transform',`translate(${m.x+Math.sin(t*2+i)*14} ${m.y})`);if(m.y>625){m.gone=true;m.g.style.transition='opacity .4s';m.g.style.opacity=0;}});
  else o.inm.forEach((m,i)=>m.g.setAttribute('transform',`translate(${m.x+Math.sin(t*2+i)*14} ${m.y})`));}
});

/* ===================== TABLE 10.3 + DEFINITION ===================== */
const Y='<span class="yes">Yes</span>',N='<span class="no">No</span>';
S({id:'t103',sec:'10.2 Role of carbon dioxide',title:'Table 10.3 & conclusion',head:'What does this experiment show?',
 notes:'Tap each shaded cell to fill in Table 10.3 with the class. Only ONE condition differs between the two halves — carbon dioxide.',
 html:`<table class="tb" id="t103"><tr><th>Part of the leaf</th><th>Water</th><th>Sunlight</th><th>Chlorophyll</th><th>Carbon dioxide</th><th>Starch present?</th></tr>
  <tr><td><b>Inside</b> the bottle</td><td class="cell-hide">${Y}</td><td class="cell-hide">${Y}</td><td class="cell-hide">${Y}</td><td class="cell-hide">${N}</td><td class="cell-hide">${N}</td></tr>
  <tr><td><b>Outside</b> the bottle</td><td class="cell-hide">${Y}</td><td class="cell-hide">${Y}</td><td class="cell-hide">${Y}</td><td class="cell-hide">${Y}</td><td class="cell-hide">${Y}</td></tr></table>
  <div class="ctrls" style="margin-top:14px"><button class="btn sm" id="t3all">Fill all cells</button></div>
  <div class="concl rv" data-s="1" style="margin-top:22px">Carbon dioxide present in the air is <b>essential</b> for plants to prepare starch.</div>
  <div class="card rv" data-s="2" style="margin-top:22px"><p>Sunlight, water, chlorophyll and carbon dioxide are essential for making food. The process by which plants prepare food in the presence of sunlight and chlorophyll is called <b class="g" style="font-size:36px">photosynthesis</b>.</p></div>
  <div class="row rv" data-s="3" style="margin-top:22px;gap:26px"><div class="card green" style="flex:1"><p>A <b>leaf</b> is the primary site for photosynthesis.</p></div><div class="card green" style="flex:1"><p><b>Other green parts</b> having chlorophyll also perform photosynthesis.</p></div></div>`,
 init(el){const fill=c=>c.classList.remove('cell-hide');$$('.cell-hide',el).forEach(c=>c.onclick=()=>fill(c));$('#t3all',el).onclick=()=>$$('.cell-hide',el).forEach(fill);}
});

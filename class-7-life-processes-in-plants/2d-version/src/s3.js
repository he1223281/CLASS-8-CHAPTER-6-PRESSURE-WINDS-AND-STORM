/* ===================== FOUR INGREDIENTS ===================== */
S({id:'ingr',sec:'10.2 Photosynthesis',title:'Four essentials',head:'Photosynthesis needs four things',zoom:true,
 notes:'Recap the evidence: Activity 10.1 (sunlight, water), 10.3 (chlorophyll + sunlight), 10.4 (carbon dioxide). Each card appears on Next.',
 html:`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:30px;margin-top:20px">
  ${[['sun','Sunlight','Provides the energy','#FFF4D6','Activity 10.1 & 10.3'],['drop','Water','Taken up by the roots from the soil','#E3EFFD','Activity 10.1'],['co2','Carbon dioxide','Taken in from the air','#EEF1F4','Activity 10.4'],['leaf','Chlorophyll','Green pigment that captures sunlight','#DFF5E5','Activity 10.3']].map(([k,t,d,bg,ev],i)=>`
  <div class="card rv" data-s="${i+1}" style="background:${bg};text-align:center;padding:40px 26px;height:480px;display:flex;flex-direction:column;align-items:center;gap:20px"><div class="bob" style="animation-delay:-${i*.7}s">${ic(k,150)}</div><h3 style="font-size:42px">${t}</h3><p>${d}</p><div class="pill" style="margin-top:auto;background:#fff">Evidence: ${ev}</div></div>`).join('')}</div>
  <div class="concl rv" data-s="5" style="margin-top:34px;text-align:center">Together, they let the leaf make <b>glucose</b> — and release <b>oxygen</b>.</div>`
});

/* ===================== THE MAIN EVENT — CINEMATIC JOURNEY ===================== */
const PJ=[
 {t:'Journey into a living plant',d:'Let us use a magical camera to travel inside a plant and watch it make its own food.',vb:[0,0,1740,760]},
 {t:'Step 1 · Water absorption',d:'<b class="bl">Water</b> (with minerals) is taken up by the <b>roots</b> from the soil and travels up the <b>stem</b> to the leaves.',vb:[0,0,1740,760]},
 {t:'Step 2 · Carbon dioxide enters',d:'<b>Carbon dioxide</b> from the air enters the leaf through tiny pores called <b>stomata</b>.',vb:[900,118,640,279]},
 {t:'Step 3 · Sunlight is captured',d:'<b style="color:#C48A00">Sunlight</b> falls on the leaf. The green pigment <b class="g">chlorophyll</b> captures it.',vb:[900,118,640,279]},
 {t:'Step 4 · Food is made',d:'Using the energy of sunlight, the leaf makes <b class="fd">glucose</b> (a simple carbohydrate) from carbon dioxide and water.',vb:[930,140,560,244]},
 {t:'Step 5 · Oxygen is released',d:'<b style="color:#1AA6BA">Oxygen</b> is released and leaves through the stomata into the air.',vb:[900,118,640,279]},
 {t:'Step 6 · Food is used and stored',d:'Glucose is an <b>instant source of energy</b>. Later it is converted into <b>starch</b> for storage, and food is carried to other parts of the plant.',vb:[640,60,1000,437]}];
S({id:'journey',sec:'10.2 Photosynthesis',title:'★ Photosynthesis — the main event',head:'Photosynthesis: inside the food factory',
 notes:'The centrepiece. Press <b>Next</b> for each of the 6 steps — the camera zooms in automatically. Pause on each step and ask students to say what they see. Point out: the plant does <b>not</b> take food from the soil; it takes water and minerals.',
 html:`<div class="viz" style="height:770px"><svg id="pjsvg" viewBox="0 0 1740 760" preserveAspectRatio="xMidYMid slice">
  <rect x="-200" y="-200" width="2200" height="720" fill="url(#gSky)"/>
  <g id="pjsun">${ART.sun(150,110,56)}</g>
  <rect x="-200" y="520" width="2200" height="440" fill="url(#gSoil)"/><path d="M-200 522Q400 505 870 522T2000 518V536H-200Z" fill="#5DBB7C"/>
  <g id="pjsoil"></g>
  <g id="pjroots" stroke="#C9A06A" stroke-linecap="round" fill="none"><path d="M760 520V730" stroke-width="16"/><path d="M760 580Q700 610 620 700M760 600Q830 640 900 710M760 650Q720 690 690 745M760 640Q800 670 840 750M700 640L660 650M830 660L870 650" stroke-width="7"/></g>
  <path d="M760 522Q752 340 768 150" stroke="url(#gStem)" stroke-width="26" fill="none" stroke-linecap="round"/>
  <path d="M762 330Q880 270 1002 252" stroke="#2E9C57" stroke-width="12" fill="none" stroke-linecap="round"/>
  ${ART.leaf(760,250,210,64,-150)}${ART.leaf(762,420,180,56,-165)}${ART.leaf(768,160,150,48,-70)}${ART.leaf(764,200,170,52,-118)}${ART.leaf(760,470,150,46,-20)}
  <g id="pjleaf" transform="translate(1000 252)"><path d="${ART.leafPath(420,120)}" fill="url(#gLeafD)"/>
   <clipPath id="pjclip"><path d="${ART.leafPath(420,120)}"/></clipPath>
   <g id="pjcells" clip-path="url(#pjclip)" opacity="0" style="transition:opacity 1s"></g>
   <path d="M4 0H400" stroke="#BFF0D0" stroke-width="4" stroke-linecap="round"/><g id="pjstoma"></g><g id="pjfood"></g></g>
  <g id="pjflows"></g>
  <path id="pw1" d="M600 700Q690 690 760 690V300Q880 270 1002 252H1250" fill="none"/>
  <path id="pw2" d="M920 715Q850 650 760 640V320Q880 268 1002 252H1330" fill="none"/>
  <g id="pjlbl" font-family="Inter,sans-serif" font-weight="800">
   <g class="L0"><text x="600" y="770" font-size="30" fill="#fff">Roots</text><text x="800" y="420" font-size="30" fill="#142B45">Stem</text><text x="1180" y="190" font-size="30" fill="#142B45">Leaf</text></g>
   <g class="L2" opacity="0"><text id="pjstl" font-size="13" fill="#142B45">stomata (tiny pores)</text></g></g>
 </svg>
 <div class="card soft overlay" style="left:26px;bottom:26px;width:760px;padding:24px 30px"><div class="pill g" id="pjstep" style="margin-bottom:10px">Overview</div><h3 id="pjt" style="font-size:38px;margin-bottom:8px"></h3><p id="pjd" style="font-size:28px"></p></div>
 <div class="ctrls overlay" style="right:26px;bottom:26px"><button class="btn" id="pjb">◀</button><button class="btn pri" id="pjn">Next step ▶</button></div>
 <div class="overlay" style="right:26px;top:22px;display:flex;gap:8px" id="pjdots">${PJ.map((_,i)=>`<i style="width:14px;height:14px;border-radius:50%;background:#C9D9EA;display:block"></i>`).join('')}</div></div>`,
 steps:6,
 init(el,o){
  const svg=$('#pjsvg',el),L=420,W=120;
  // soil water drops & minerals
  const R=rng(21);let s='';for(let i=0;i<36;i++){const x=420+R()*700,y=560+R()*190;s+=`<g transform="translate(${x} ${y})">${ART.mol(i%4?'water':'mineral',i%4?8:6)}</g>`;}$('#pjsoil',el).innerHTML=s;
  // leaf cells
  let c='';const cells=[];for(let y=-70;y<70;y+=17)for(let x=-10;x<440;x+=23){const ox=(Math.round(y/17)%2)*11;c+=`<rect x="${x+ox}" y="${y}" width="21" height="15" rx="6" fill="url(#gCell)" stroke="#8ED3A6" stroke-width="1"/>`;for(let k=0;k<3;k++)c+=`<ellipse class="chl" cx="${x+ox+4+R()*13}" cy="${y+4+R()*7}" rx="2.6" ry="1.7" fill="#22A35A"/>`;if(Math.abs(y)<40&&x>40&&x<380)cells.push([x+ox+10,y+7]);}
  $('#pjcells',el).innerHTML=c;
  // stomata along lower edge (cubic bezier)
  const bz=t=>{const P=[[0,0],[L*.25,W],[L*.7,W*.95],[L,0]],u=1-t;return[0,1].map(k=>u*u*u*P[0][k]+3*u*u*t*P[1][k]+3*u*t*t*P[2][k]+t*t*t*P[3][k]);};
  o.st=[.3,.45,.6,.75].map(t=>{const p=bz(t);return[p[0],p[1]-3];});
  $('#pjstoma',el).innerHTML=o.st.map(([x,y])=>`<g transform="translate(${x} ${y})"><ellipse cx="-4" rx="4" ry="6" fill="#178048"/><ellipse cx="4" rx="4" ry="6" fill="#178048"/><ellipse rx="1.6" ry="4.5" fill="#0E3B23"/></g>`).join('');
  const sl=$('#pjstl',el);sl.setAttribute('x',1000+o.st[0][0]-20);sl.setAttribute('y',252+o.st[0][1]+32);
  // flows (world coords)
  const F=$('#pjflows',el),mk=(d)=>svgEl('path',{d,fill:'none'},F);
  o.fw=[new Flow($('#pw1',el),{kind:'water',r:9,n:14,speed:.09,into:F}),new Flow($('#pw2',el),{kind:'water',r:9,n:14,speed:.08,seed:4,into:F})];
  o.fc=o.st.map(([x,y],i)=>new Flow(mk(`M${1000+x-60+i*20} 470Q${1000+x-10} 360 ${1000+x} ${252+y}L${1000+x+6} ${252+y-30}`),{kind:'co2',r:7,n:3,speed:.25,seed:i+2,into:F}));
  o.fp=[0,1,2,3,4].map(i=>new Flow(mk(`M${880+i*40} 100L${1080+i*70} ${226+(i%2)*14}`),{kind:'photon',r:4,n:4,speed:.6,seed:i+9,into:F}));
  o.fo=o.st.map(([x,y],i)=>new Flow(mk(`M${1000+x+4} ${252+y-26}L${1000+x+4} ${252+y}Q${1000+x+40} 360 ${1000+x+70-i*10} 480`),{kind:'o2',r:7,n:3,speed:.22,seed:i+30,into:F}));
  o.ff=[new Flow(mk('M1100 252H1002Q880 270 762 330V510'),{kind:'food',r:9,n:7,speed:.1,into:F})];
  o.all=[...o.fw,...o.fc,...o.fp,...o.fo,...o.ff];o.all.forEach(f=>{f.set(false);f.alpha=0;});
  o.cellpts=cells;o.vb=[0,0,1740,760];
  o.setVB=v=>{o.vb=v;svg.setAttribute('viewBox',v.map(n=>n.toFixed(1)).join(' '));};
  $('#pjn',el).onclick=()=>next();$('#pjb',el).onclick=()=>prev();
 },
 enter(el,o){o.setVB([0,0,1740,760]);},
 onStep(el,s,o){
  o._bag.clear();const p=PJ[s];$('#pjt',el).textContent=p.t;$('#pjd',el).innerHTML=p.d;$('#pjstep',el).textContent=s?`Step ${s} of 6`:'Overview';
  $$('#pjdots i',el).forEach((d,i)=>d.style.background=i<=s?'#239B56':'#C9D9EA');
  const from=o.vb.slice(),to=p.vb;o._bag.tw(1600,e=>o.setVB(from.map((v,i)=>lerp(v,to[i],e))));
  o.fw.forEach(f=>f.set(s>=1&&s!==6||s===6));o.fc.forEach(f=>f.set(s>=2&&s<=5));o.fp.forEach(f=>f.set(s>=3&&s<=5));o.fo.forEach(f=>f.set(s>=5));o.ff.forEach(f=>f.set(s>=6));
  $('#pjcells',el).setAttribute('opacity',s>=2?1:0);$('.L2',el).setAttribute('opacity',s===2||s===5?1:0);$('.L0',el).setAttribute('opacity',s<=1?1:0);
  $('#pjleaf',el).classList.toggle('glowleaf',s===3||s===4);
  $$('.chl',el).forEach(c=>c.setAttribute('fill',s>=3?'#3FD47A':'#22A35A'));
  const fd=$('#pjfood',el);fd.innerHTML='';
  if(s>=4){const pts=o.cellpts.filter((_,i)=>i%9===0).slice(0,12);
   pts.forEach((q,i)=>{const g=svgEl('g',{transform:`translate(${q[0]} ${q[1]}) scale(0)`},fd);g.innerHTML=ART.mol('food',7);
    if(s===4)o._bag.later(300+i*220,()=>o._bag.tw(500,e=>g.setAttribute('transform',`translate(${q[0]} ${q[1]}) scale(${e})`)));else g.setAttribute('transform',`translate(${q[0]} ${q[1]}) scale(1)`);});
   if(s===4){const t=svgEl('g',{},fd);t.innerHTML=`<rect x="150" y="-104" width="230" height="30" rx="15" fill="#fff" opacity=".95"/><text x="265" y="-83" text-anchor="middle" font-size="15" font-weight="800" fill="#142B45" font-family="Inter,sans-serif">CO₂ + water → glucose</text>`;}
  }
  if(s===6){const ch=svgEl('g',{},fd);let h='';for(let i=0;i<7;i++)h+=`<g transform="translate(${150+i*15} ${-50+(i%2)*8})">${ART.mol('food',8)}</g>`;
   ch.innerHTML=h+`<rect x="128" y="-96" width="150" height="30" rx="15" fill="#fff"/><text x="203" y="-75" text-anchor="middle" font-size="17" font-weight="800" fill="#142B45" font-family="Inter,sans-serif">starch (stored)</text>`+[0,1,2].map(i=>`<g class="pulse" style="animation-delay:-${i*.6}s" transform="translate(${300+i*28} ${30-i*6})">${ART.mol('energy',10)}</g>`).join('')+`<rect x="282" y="44" width="80" height="26" rx="13" fill="#fff"/><text x="322" y="62" text-anchor="middle" font-size="15" font-weight="800" fill="#142B45" font-family="Inter,sans-serif">energy</text>`;}
 },
 tick(dt,t,el,o){o.all.forEach(f=>f.tick(dt));}
});

/* ===================== WORD EQUATION (interactive) ===================== */
const EQ={co2:['Carbon dioxide','co2','Taken in from the <b>air</b> through the <b>stomata</b> of leaves.'],water:['Water','drop','Absorbed from the <b>soil</b> by the <b>roots</b> and carried up to the leaves (along with minerals).'],
 sun:['Sunlight','sun','Provides the <b>energy</b> needed for making food. Photosynthesis takes place only in light.'],chl:['Chlorophyll','leaf','The <b>green pigment</b> in leaves that <b>captures sunlight</b>.'],
 glu:['Glucose','glucose','The <b>food</b> made — a simple carbohydrate. An instant source of energy; later converted to <b>starch</b> for storage.'],o2:['Oxygen','o2','Released into the <b>air</b> through the stomata. We and other living beings use it to respire.']};
S({id:'eqn',sec:'10.2 Photosynthesis',title:'The word equation',head:'Photosynthesis in a nutshell',
 notes:'Click each part of the equation to show its role. Stress: sunlight and chlorophyll are written <b>above and below the arrow</b> — they are needed, but are not raw materials.',
 html:`<div class="card" style="padding:50px 40px;text-align:center">
  <div style="display:flex;align-items:center;justify-content:center;gap:22px;flex-wrap:nowrap">
   <button class="btn eqb" data-k="co2" style="font-size:36px;padding:20px 28px">${ic('co2',56)} Carbon dioxide</button><span style="font-size:52px;font-weight:800">+</span>
   <button class="btn eqb" data-k="water" style="font-size:36px;padding:20px 28px">${ic('drop',56)} Water</button>
   <div style="display:flex;flex-direction:column;align-items:center;gap:8px;min-width:300px"><button class="btn eqb sm" data-k="sun" style="background:#FFF4D6">${ic('sun',36)} Sunlight</button>
    <svg width="300" height="34" viewBox="0 0 300 34"><path d="M6 17H282" stroke="#142B45" stroke-width="6" stroke-linecap="round"/><path d="M270 5L292 17L270 29" fill="none" stroke="#142B45" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <button class="btn eqb sm" data-k="chl" style="background:#DFF5E5">${ic('leaf',36)} Chlorophyll</button></div>
   <button class="btn eqb" data-k="glu" style="font-size:36px;padding:20px 28px">${ic('glucose',56)} Glucose</button><span style="font-size:52px;font-weight:800">+</span>
   <button class="btn eqb" data-k="o2" style="font-size:36px;padding:20px 28px">${ic('o2',56)} Oxygen</button></div>
  <div id="eqinfo" class="row" style="justify-content:center;margin-top:40px;min-height:130px;gap:26px"><p class="muted">👆 Tap any part of the equation to learn its role.</p></div></div>
 <div class="grid2 even" style="height:auto;margin-top:30px;gap:30px">
  <div class="caution rv" data-s="1" style="background:#FFF6DD;border-color:#FFE3A0;color:#6B4A00;font-size:28px">${ic('warn',44)}<div><b>Myth buster:</b> plants do <b>not</b> take ready-made food from the soil. They take <b>water and minerals</b> from the soil and <b>make their own food</b> in the leaves.</div></div>
  <div class="card green rv" data-s="2"><p>Food is made as <b>glucose</b>. Glucose is an instant source of energy and is later converted into <b>starch</b> for storage.</p></div></div>`,
 init(el){$$('.eqb',el).forEach(b=>b.onclick=()=>{const [t,k,d]=EQ[b.dataset.k];$$('.eqb',el).forEach(x=>x.style.outline=x===b?'4px solid #3988E8':'');$('#eqinfo',el).innerHTML=`<div class="bob">${ic(k,110)}</div><div style="text-align:left;max-width:1100px"><h3 style="font-size:40px">${t}</h3><p>${d}</p></div>`;});},
 enter(el){$('#eqinfo',el).innerHTML='<p class="muted">👆 Tap any part of the equation to learn its role.</p>';$$('.eqb',el).forEach(x=>x.style.outline='');}
});

/* ===================== ACTIVITY 10.5 — OXYGEN ===================== */
function o2setup(x,dark){
 return`<rect x="${x}" y="0" width="510" height="790" rx="26" fill="${dark?'#1C2B45':'url(#gSky)'}"/>
 <text x="${x+30}" y="60" font-size="38" font-weight="800" class="${dark?'lbl-w':'lbl'}">${dark?'B — in the dark':'A — in sunlight'}</text>
 ${dark?`<circle cx="${x+440}" cy="60" r="26" fill="#E6ECF5"/><circle cx="${x+452}" cy="52" r="24" fill="#1C2B45"/>`:ART.sun(x+440,64,30)}
 ${ART.beaker(x+80,290,350,450,.86)}
 <g stroke="#2E9C57" stroke-width="5" fill="none" stroke-linecap="round">${[0,1,2].map(j=>`<path d="M${x+215+j*40} 735Q${x+205+j*40} 680 ${x+225+j*38} 610"/>`).join('')}</g>
 ${[0,1,2].map(j=>[0,1,2,3,4].map(k=>`<g transform="translate(${x+214+j*39-k*1.5} ${720-k*24})">${[-50,-20,20,50].map(a=>`<ellipse rx="11" ry="3.5" cx="9" fill="#3DB26A" transform="rotate(${a+(k%2)*15}) "/>`).join('')}</g>`).join('')).join('')}
 <path d="M${x+130} 735L${x+238} 520V440H${x+272}V520L${x+380} 735" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="5" stroke-linejoin="round"/>
 <path d="M${x+228} 470V230a27 27 0 0154 0V470" fill="rgba(160,205,250,.35)" stroke="#8FB3D4" stroke-width="5"/>
 <rect id="gas${dark?'B':'A'}" x="${x+231}" y="205" width="48" height="0" fill="#FFFFFF" opacity=".9"/>
 <g id="bub${dark?'B':'A'}"></g>
 <text x="${x+300}" y="250" font-size="22" font-weight="700" class="${dark?'lbl-w':'lbl'}">Inverted test tube</text>
 <text x="${x+300}" y="560" font-size="22" font-weight="700" class="lbl">Funnel</text><text x="${x+86}" y="775" font-size="22" font-weight="700" class="${dark?'lbl-w':'lbl'}">Water plant in water</text>`;}
S({id:'a105',sec:'10.2 Oxygen is released',title:'Activity 10.5 — Bubbles of oxygen',head:'Activity 10.5: Do plants release something?',zoom:true,
 notes:'Compare set-ups A and B. Ask: <i>Where do you see bubbles? Which gas could it be?</i> Then reveal Barkha didi’s matchstick test (teacher demonstration only).',
 html:`<div class="grid2" style="grid-template-columns:1.32fr 1fr"><div class="viz"><svg viewBox="0 0 1040 790">${o2setup(0,0)}${o2setup(530,1)}</svg></div>
 <div class="col" style="gap:12px">
  <div class="q" style="font-size:27px;padding:16px 24px"><div class="qm">?</div><div>What difference do you observe between set-ups A and B?</div></div>
  <div class="card rv" data-s="1" style="padding:16px 24px"><p style="font-size:27px">In <b>A (sunlight)</b>, bubbles of gas rise from the plant and collect at the top of the test tube. In <b>B (dark)</b> there are no bubbles.</p></div>
  <div class="card rv" data-s="2" style="padding:18px 24px;display:flex;gap:20px;align-items:center"><svg width="170" height="210" viewBox="0 0 170 210" id="mtsvg">
    <path d="M60 60V170a25 25 0 0050 0V60" fill="rgba(220,240,255,.6)" stroke="#8FB3D4" stroke-width="5"/>
    <g id="mtstick" transform="translate(85 0)"><rect x="-3" y="20" width="6" height="110" fill="#E8C48A"/><circle cy="20" r="6" fill="#B3263E"/><g id="mtflame" class="flick" style="transform-origin:0 18px"><path d="M0 -26C-12 -8 -12 6 0 16C12 6 12 -8 0 -26Z" fill="#FFB238"/><path d="M0 -12C-5 -2 -5 6 0 12C5 6 5 -2 0 -12Z" fill="#FFF3B0"/></g></g></svg>
   <div><p style="font-size:25px">Barkha didi closed the tube with her thumb, took it out, and quickly inserted a <b>lit matchstick</b>. It burned with an <b>intense flame</b>!</p><button class="btn sm pri" id="mtgo" style="margin-top:12px">🔥 Insert lit matchstick</button></div></div>
  <div class="rv" data-s="2">${CAUTION('Only the teacher should handle a lit matchstick.')}</div>
  <div class="concl rv" data-s="3" style="font-size:26px;padding:20px 28px">The gas is rich in <b>oxygen</b>. Oxygen is released during photosynthesis, which occurs in the presence of <b>sunlight</b>.</div>
 </div></div>`,
 init(el,o){
  o.bs=[];o.gas=0;const box=$('#bubA',el);
  o.spawn=()=>{const c=svgEl('circle',{r:3+Math.random()*4,fill:'rgba(255,255,255,.75)',stroke:'#fff','stroke-width':1.5},box);o.bs.push({c,x:205+Math.random()*110,y:640+Math.random()*60,v:70+Math.random()*50});};
  o.reset=()=>{o.bs.forEach(b=>b.c.remove());o.bs=[];o.gas=0;$('#gasA',el).setAttribute('height',0);o.acc=0;const f=$('#mtflame',el);f.setAttribute('transform','');f.style.filter='';$('#mtstick',el).setAttribute('transform','translate(85 0)');};
  $('#mtgo',el).onclick=()=>{const st=$('#mtstick',el),f=$('#mtflame',el);o._bag.tw(800,e=>st.setAttribute('transform',`translate(85 ${e*70})`),()=>o._bag.tw(700,e=>{f.setAttribute('transform',`scale(${1+e*1.4})`);f.style.filter=`drop-shadow(0 0 ${e*14}px #FFD166)`;}));};
 },
 enter(el,o){o.reset();},
 tick(dt,t,el,o){o.acc=(o.acc||0)+dt;if(o.acc>.12&&o.bs.length<40){o.acc=0;o.spawn();}
  const top=205+o.gas;
  o.bs=o.bs.filter(b=>{b.y-=b.v*dt;const tx=255;if(b.y<540)b.x=lerp(b.x,tx,clamp(dt*4,0,1));b.c.setAttribute('cx',b.x+Math.sin(b.y/9)*1.5);b.c.setAttribute('cy',b.y);
   if(b.y<top+4){b.c.remove();o.gas=Math.min(120,o.gas+.35);return false;}return true;});
  $('#gasA',el).setAttribute('height',o.gas);}
});

/* ===================== ACTIVITY 10.6 — STOMATA (leaf peel) ===================== */
S({id:'a106',sec:'10.2 Stomata: tiny gateways',title:'Activity 10.6 — Leaf peel',head:'Activity 10.6: Where do gases enter and leave?',zoom:true,
 notes:'Teacher demonstration. Rhoeo leaves give the best peel. Use <b>Low power / High power</b> to zoom the microscope view. Students should spot the tiny pores — stomata.',
 html:`<div class="grid2" style="grid-template-columns:1fr 1.05fr">
  <div class="col" style="gap:10px">${stepList(['Collect a leaf (rhoeo, money plant, onion, hibiscus, coleus or grass) and put it in a beaker of water.','Carefully <b>peel a thin layer</b> from the <b>lower surface</b> of the leaf; keep it in a watch glass with water.','Put a drop of water on a slide and transfer the peel with <b>forceps</b>.','Add a drop of <b>ink</b> with a dropper, cover with a <b>coverslip</b>.','Observe it under a <b>microscope</b>.'])}
   <div class="concl rv" data-s="6" style="font-size:28px">These tiny pores are called <b>stomata</b>. Stomata on the surface of leaves help in the <b>exchange of gases</b>.</div></div>
  <div class="viz" style="background:#0F1C2E;display:grid;place-items:center"><svg viewBox="0 0 800 790" style="width:100%;height:100%">
   <defs><clipPath id="mcl"><circle cx="400" cy="370" r="330"/></clipPath></defs>
   <circle cx="400" cy="370" r="345" fill="#2A3B56"/>
   <g clip-path="url(#mcl)"><rect x="0" y="0" width="800" height="790" fill="#E6E9FA"/><g id="peel" style="transition:transform 1.4s cubic-bezier(.4,0,.2,1);transform-origin:400px 370px"></g><circle cx="400" cy="370" r="330" fill="url(#gVig)"/></g>
   <g id="mlbl" opacity="0" style="transition:opacity .6s"><path d="M470 300L600 170" stroke="#142B45" stroke-width="4"/><rect x="520" y="110" width="250" height="60" rx="30" fill="#142B45"/><text x="645" y="149" text-anchor="middle" class="lbl-w" font-size="25">Stoma (tiny pore)</text></g>
   <g transform="translate(110 690)"><rect width="160" height="8" fill="#fff"/><text x="80" y="38" text-anchor="middle" class="lbl-w" font-size="22">0.1 mm</text></g>
   <text x="400" y="770" text-anchor="middle" class="lbl-w" font-size="24" id="mmag">Low power</text></svg>
   <div class="ctrls overlay" style="right:22px;top:22px"><div class="seg"><button id="mlo" class="on">Low power</button><button id="mhi">High power</button></div></div></div></div>`,
 steps:6,
 init(el,o){
  const R=rng(33),cw=74,chh=48,cols=24,rows=30,V=[];for(let j=0;j<=rows;j++){V[j]=[];for(let i=0;i<=cols;i++)V[j][i]=[(i-cols/2)*cw+400+(j%2)*cw/2+(R()-.5)*26,(j-rows/2)*chh+370+(R()-.5)*18];}
  let s='';const sto=[];
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=V[j][i],b=V[j][i+1],c=V[j+1][i+1],d=V[j+1][i];s+=`<path d="M${a}L${b}L${c}L${d}Z" fill="#DCE1F6" stroke="#6E62B8" stroke-width="3" stroke-linejoin="round"/>`;
   if(R()<.075)sto.push([(a[0]+c[0])/2,(a[1]+c[1])/2,R()*60-30]);}
  sto.push([432,328,-20]);
  sto.forEach(([x,y,r])=>{s+=`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="-11" rx="11" ry="20" fill="#9ED39A" stroke="#3F7A45" stroke-width="2.5"/><ellipse cx="11" rx="11" ry="20" fill="#9ED39A" stroke="#3F7A45" stroke-width="2.5"/><ellipse rx="3.6" ry="13" fill="#2B2350"/>${[[-12,-8],[-13,6],[12,-6],[11,8]].map(([p,q])=>`<circle cx="${p}" cy="${q}" r="3" fill="#3F9A4A"/>`).join('')}</g>`;});
  $('#peel',el).innerHTML=s;
  o.mag=hi=>{$('#peel',el).style.transform=hi?'scale(1.9)':'scale(.55)';$('#mlo',el).classList.toggle('on',!hi);$('#mhi',el).classList.toggle('on',hi);$('#mmag',el).textContent=hi?'High power':'Low power';$('#mlbl',el).setAttribute('opacity',hi?1:0);};
  $('#mlo',el).onclick=()=>o.mag(false);$('#mhi',el).onclick=()=>o.mag(true);
 },
 onStep(el,s,o){markSteps(el,Math.min(s,5));if(s>=6)$$('.step',el).forEach(d=>{d.classList.remove('on');d.classList.add('done');});o.mag(s>=5);}
});

/* ===================== STOMATA — GAS EXCHANGE ===================== */
S({id:'gasx',sec:'10.2 Stomata: tiny gateways',title:'Gas exchange through stomata',head:'Stomata: the tiny gateways',
 notes:'Toggle between the two processes. In sunlight, carbon dioxide goes in and oxygen comes out (photosynthesis). For respiration, oxygen goes in and carbon dioxide comes out — this happens all the time, day and night.',
 html:`<div class="grid2"><div class="viz" style="background:linear-gradient(180deg,#F4FBFF,#fff)"><svg viewBox="0 0 1040 790" id="gxsvg">
  <g id="gxsun">${ART.sun(90,80,40)}</g>
  
  <rect x="40" y="130" width="960" height="420" rx="40" fill="#E9F8EE"/>
  <g id="gxcells"></g>
  <text x="60" y="610" class="lbl" font-size="24">Lower surface of the leaf</text><text x="60" y="122" class="lbl" font-size="24">Upper surface</text>
  <g id="gxf"></g>
  <path id="gin" d="M440 780Q470 640 505 520Q515 470 470 400" fill="none"/><path id="gout" d="M570 400Q530 470 535 520Q560 640 610 780" fill="none"/>
  <g font-family="Inter,sans-serif" font-weight="800" font-size="26"><rect x="150" y="690" width="210" height="50" rx="25" fill="#fff" stroke="#C9D7E5" stroke-width="2"/><text x="255" y="724" text-anchor="middle" fill="#142B45" id="gxin">CO₂ goes in</text>
  <rect x="680" y="690" width="230" height="50" rx="25" fill="#fff" stroke="#C9D7E5" stroke-width="2"/><text x="795" y="724" text-anchor="middle" fill="#142B45" id="gxout">O₂ comes out</text></g>
  <path d="M520 600L600 650" stroke="#142B45" stroke-width="3"/><text x="606" y="664" class="lbl" font-size="22">Stoma (pore)</text>
 </svg><div class="ctrls overlay" style="right:24px;top:96px"><div class="seg"><button id="gxp" class="on">Photosynthesis</button><button id="gxr">Respiration</button></div></div></div>
 <div class="col">
  <div class="card"><p class="muted" style="font-size:23px;margin-bottom:6px">Picture: section through a leaf (magnified)</p><p>Stomata are tiny pores, mostly on the <b>lower surface</b> of leaves. They help in the <b>exchange of gases</b>.</p></div>
  <div class="card sun rv" data-s="1"><h3>During photosynthesis</h3><p><b>Carbon dioxide enters</b> the leaf; <b>oxygen is released</b>.</p></div>
  <div class="card blue rv" data-s="2"><h3>During respiration</h3><p><b>Oxygen enters</b>; <b>carbon dioxide is released</b>.</p></div>
  <div class="concl rv" data-s="3" style="font-size:28px">The same tiny pores serve <b>both</b> processes.</div></div></div>`,
 init(el,o){
  const R=rng(8);let s='';for(let x=60;x<990;x+=52)s+=`<rect x="${x}" y="140" width="48" height="34" rx="10" fill="#F4FFF6" stroke="#9AD8AE" stroke-width="2"/>`;
  for(let x=64;x<980;x+=40)s+=`<rect x="${x}" y="182" width="34" height="140" rx="16" fill="url(#gCell)" stroke="#8ED3A6" stroke-width="2"/>`+[0,1,2,3,4].map(k=>`<ellipse cx="${x+10+(k%2)*14}" cy="${200+k*25}" rx="6" ry="4" fill="#2FB463"/>`).join('');
  for(let i=0;i<34;i++){const x=80+R()*880,y=350+R()*130;if(Math.abs(x-520)<70&&y>420)continue;s+=`<circle cx="${x}" cy="${y}" r="${22+R()*12}" fill="url(#gCell)" stroke="#8ED3A6" stroke-width="2"/><circle cx="${x+6}" cy="${y-4}" r="4" fill="#2FB463"/><circle cx="${x-8}" cy="${y+6}" r="4" fill="#2FB463"/>`;}
  for(let x=60;x<990;x+=52){if(x>440&&x<580)continue;s+=`<rect x="${x}" y="505" width="48" height="34" rx="10" fill="#F4FFF6" stroke="#9AD8AE" stroke-width="2"/>`;}
  s+=`<ellipse cx="488" cy="522" rx="26" ry="20" fill="#7FCB8A" stroke="#3F7A45" stroke-width="3"/><ellipse cx="552" cy="522" rx="26" ry="20" fill="#7FCB8A" stroke="#3F7A45" stroke-width="3"/>`;
  $('#gxcells',el).innerHTML=s;
  const F=$('#gxf',el);o.f={ci:new Flow($('#gin',el),{kind:'co2',r:16,n:4,speed:.16,into:F}),oo:new Flow($('#gout',el),{kind:'o2',r:16,n:4,speed:.16,seed:5,into:F}),oi:new Flow($('#gin',el),{kind:'o2',r:16,n:4,speed:.16,seed:6,into:F}),co:new Flow($('#gout',el),{kind:'co2',r:16,n:4,speed:.16,seed:7,into:F})};
  o.mode=m=>{o.m=m;const p=m==='p';o.f.ci.set(p);o.f.oo.set(p);o.f.oi.set(!p);o.f.co.set(!p);$('#gxp',el).classList.toggle('on',p);$('#gxr',el).classList.toggle('on',!p);
   $('#gxin',el).textContent=p?'CO₂ goes in':'O₂ goes in';$('#gxout',el).textContent=p?'O₂ comes out':'CO₂ comes out';$('#gxsun',el).style.opacity=p?1:.25;};
  $('#gxp',el).onclick=()=>o.mode('p');$('#gxr',el).onclick=()=>o.mode('r');
 },
 onStep(el,s,o){if(s===1)o.mode('p');if(s===2)o.mode('r');if(s===0)o.mode('p');},
 tick(dt,t,el,o){Object.values(o.f).forEach(f=>f.tick(dt));}
});

/* ===================== SCENE 1 — OPENING ===================== */
function avatar(skin,hair,shirt,girl){return`<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="54" fill="#E8F3FF"/><path d="M18 108c4-24 18-34 37-34s33 10 37 34z" fill="${shirt}"/><circle cx="55" cy="48" r="24" fill="${skin}"/>${girl?`<path d="M30 50c-2-22 12-32 25-32s28 10 25 32c-4-12-12-18-25-18s-21 6-25 18z" fill="${hair}"/><path d="M30 48c-4 14-2 26 4 32M80 48c4 14 2 26-4 32" stroke="${hair}" stroke-width="7" fill="none" stroke-linecap="round"/>`:`<path d="M31 46c0-16 10-25 24-25s24 9 24 25c-6-8-14-11-24-11s-18 3-24 11z" fill="${hair}"/>`}<circle cx="46" cy="50" r="3" fill="#142B45"/><circle cx="64" cy="50" r="3" fill="#142B45"/><path d="M47 60q8 6 16 0" stroke="#142B45" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;}

S({id:'open',sec:'Welcome',title:'Life Processes in Plants',bare:true,cls:'full',
 notes:'Welcome the class. Ask: <i>“Is a tree alive? How do you know?”</i> Take 2–3 answers, then click <b>Start Exploring</b>.',
 html:`<svg id="opsvg" viewBox="0 0 1920 984" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;transform-origin:72% 36%">
  <rect width="1920" height="984" fill="url(#gSky)"/>
  ${ART.sun(1730,120,58)}
  <g id="opshafts" style="mix-blend-mode:screen"></g>
  <path d="M0 700Q300 600 640 660T1280 640T1920 610V984H0Z" fill="#C9EBD3"/>
  <path d="M0 780Q360 700 760 760T1500 730T1920 720V984H0Z" fill="#94D6A8"/>
  <g id="optree"></g>
  <path d="M0 870Q480 830 960 860T1920 850V984H0Z" fill="#5DBB7C"/>
  <g id="opgrass"></g><g id="opmotes"></g>
 </svg>
 <div style="position:absolute;left:110px;top:150px;width:1000px">
  <div class="kicker">Class 7 · Science · Curiosity · Chapter 10</div>
  <h1 style="margin:26px 0 22px;font-size:94px;letter-spacing:-.02em">LIFE PROCESSES<br><span class="g">IN PLANTS</span></h1>
  <p class="big muted" style="margin-bottom:50px;font-size:42px">Discover the Secret Life of a Plant</p>
  <button id="startbtn">Start Exploring <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
 </div>`,
 init(el,o){
  const R=rng(11);
  let sh='';[[1560,1660,1200,1060,0],[1700,1770,1500,1380,.8],[1460,1510,900,800,1.6],[1800,1880,1760,1640,2.2]].forEach(([a,b,c,d,del])=>sh+=`<polygon points="${a},0 ${b},0 ${c},984 ${d},984" fill="url(#gShaft)" class="pulse" style="animation-delay:-${del}s;opacity:.7"/>`);
  $('#opshafts',el).innerHTML=sh;
  let t=`<path d="M1300 905C1330 820 1345 700 1350 560C1352 500 1340 450 1310 395L1355 390C1375 450 1386 480 1392 520C1405 470 1432 428 1478 398L1496 410C1446 462 1422 520 1416 600C1412 720 1426 830 1466 905Z" fill="url(#gTrunk)"/>
   <path d="M1352 560C1300 520 1250 500 1180 492L1184 478C1250 482 1310 496 1360 530Z" fill="#7A4F2F"/><g class="sway">`;
  const cols=['#17703D','#1E8A4C','#239B56','#2FB463','#46C277','#68D394'];
  const blobs=[];for(let i=0;i<110;i++){const a=R()*Math.PI*2,d=Math.sqrt(R());blobs.push({x:1370+Math.cos(a)*d*400,y:330+Math.sin(a)*d*250,r:55+R()*65});}
  blobs.sort((p,q)=>q.y-p.y);
  blobs.forEach(b=>{const k=clamp(Math.floor((1-(b.y-80)/500)*5+R()*1.5),0,5);t+=`<circle cx="${b.x.toFixed(0)}" cy="${b.y.toFixed(0)}" r="${b.r.toFixed(0)}" fill="${cols[k]}"/>`;});
  for(let i=0;i<70;i++){const a=R()*Math.PI*2,d=.5+R()*.5;t+=ART.leaf(1370+Math.cos(a)*d*430,330+Math.sin(a)*d*280,34+R()*18,13,R()*360,R()>.5?'#2FB463':'#7BDA9C','#BFF0D0');}
  for(let i=0;i<26;i++){t+=`<circle cx="${1250+R()*260}" cy="${140+R()*170}" r="${18+R()*30}" fill="#B6F0C8" opacity="${.25+R()*.3}"/>`;}
  t+='</g>';$('#optree',el).innerHTML=t;
  let gr='';for(let i=0;i<90;i++){const x=R()*1920,y=870+R()*110,hh=20+R()*36;gr+=`<path d="M${x} ${y}q${-6+R()*4} ${-hh*.6} ${-4+R()*14} ${-hh}M${x+4} ${y}q4 ${-hh*.5} ${10} ${-hh*.8}" stroke="${R()>.5?'#3FA765':'#2E8F52'}" stroke-width="4" fill="none" stroke-linecap="round"/>`;}
  for(let i=0;i<14;i++){const x=80+R()*1100,y=900+R()*60;gr+=`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse rx="7" ry="12" cy="-10" fill="${i%3?'#FFFFFF':'#FFD166'}" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#F2A33A"/></g>`;}
  $('#opgrass',el).innerHTML=gr;
  let m='';for(let i=0;i<46;i++){m+=`<circle cx="${700+R()*1200}" cy="${200+R()*700}" r="${2+R()*4}" fill="#FFF6C8" class="mote" style="animation-duration:${7+R()*9}s;animation-delay:-${R()*12}s"/>`;}
  $('#opmotes',el).innerHTML=m;
  $('#startbtn',el).onclick=()=>{$('#opsvg',el).classList.add('zoomout');o._bag.later(1150,()=>go(1,'fwd'));};
 },
 leave(el){$('#opsvg',el).classList.remove('zoomout');}
});

/* ===================== SCENE 2 — GROWTH TIME-LAPSE ===================== */
S({id:'grow',sec:'10.1 How do plants grow?',title:'Time-lapse: a growing plant',head:'How do plants grow?',
 notes:'Press <b>Next</b> (or Play) to run the time-lapse. Pause it midway and ask students to describe the changes. Link to Grade 6: all living beings grow and need food.',
 html:`<div class="grid2"><div class="viz"><svg viewBox="0 0 1000 790">
   <rect width="1000" height="790" fill="url(#gSky)"/>${ART.sun(110,100,42)}
   <rect y="640" width="1000" height="150" fill="url(#gSoil)"/><path d="M0 642Q250 628 500 640T1000 638V654H0Z" fill="#5DBB7C"/>
   <g id="gruler" font-family="Inter,Segoe UI,sans-serif" font-size="20" font-weight="700" fill="#4A5F78"></g>
   <line id="ghl" x1="470" x2="880" y1="600" y2="600" stroke="#3988E8" stroke-width="3" stroke-dasharray="10 8"/>
   <g id="gplant"></g>
   <rect x="30" y="30" width="230" height="74" rx="37" fill="#fff" filter="url(#fShadow)"/><text id="gday" x="145" y="80" text-anchor="middle" class="lbl" font-size="36">Day 1</text>
  </svg>
  <div class="ctrls overlay" style="left:30px;bottom:26px"><button class="btn pri" id="gplay">▶ Play time-lapse</button><button class="btn" id="greset">↺ Reset</button></div>
 </div>
 <div class="col">
  <div class="q"><div class="qm">?</div>What changes do you notice in a plant as it grows?</div>
  <ul class="list" id="gobs" style="margin:10px 0 6px">
   <li class="rv">New <b>leaves</b> emerge</li><li class="rv">New <b>branches</b> develop</li><li class="rv">Its <b>height increases</b></li><li class="rv">Its <b>stem thickens</b></li></ul>
  <div class="card sun rv" data-s="1"><p><b>Think:</b> Animals eat food to grow. Have you ever seen a plant <i>eating</i> food like animals do?</p></div>
  <div class="card green rv" data-s="2"><p>Food gives <b>carbohydrates, fats, proteins, vitamins</b> and <b>minerals</b>. Along with <b>water</b>, these are essential for growth. So how do plants get them?</p></div>
 </div></div>`,
 init(el,o){
  let r='<line x1="900" y1="640" x2="900" y2="110" stroke="#9AB0C7" stroke-width="4"/>';
  for(let k=0;k<=10;k++){const y=640-k*50;r+=`<line x1="${k%2?888:880}" x2="900" y1="${y}" y2="${y}" stroke="#9AB0C7" stroke-width="3"/>`;if(k%2==0)r+=`<text x="912" y="${y+7}">${k*5}</text>`;}
  $('#gruler',el).innerHTML=r+'<text x="912" y="94">cm</text>';
  o.render=()=>{const g=o.g;$('#gplant',el).innerHTML=ART.plant(470,642,{g,H:470});
   const top=642-(50+470*g);$('#ghl',el).setAttribute('y1',top);$('#ghl',el).setAttribute('y2',top);
   $('#gday',el).textContent='Day '+(1+Math.round(g*59));
   $$('#gobs li',el).forEach((li,i)=>li.classList.toggle('on',g>=[.22,.5,.7,.9][i]));};
  o.play=()=>{if(o.g>=1)o.g=.05;o.playing=true;$('#gplay',el).textContent='❚❚ Pause';};
  o.pause=()=>{o.playing=false;$('#gplay',el).textContent='▶ Play time-lapse';};
  $('#gplay',el).onclick=()=>o.playing?o.pause():o.play();
  $('#greset',el).onclick=()=>{o.pause();o.g=.05;o.render();};
  o.g=.05;o.render();
 },
 enter(el,o){o.pause();if(o.g>=1){}else{o.g=.05;}o.render();},
 tick(dt,t,el,o){if(o.playing){o.g=Math.min(1,o.g+dt/9);o.render();if(o.g>=1)o.pause();}},
 onNext(el,o){if(o.g<1){if(o.playing){o.g=1;o.render();o.pause();}else o.play();return true;}return false;}
});

/* ===================== SCENE 2b — STUDENTS' IDEAS ===================== */
S({id:'ideas',sec:'10.1 How do plants grow?',title:'What do plants need to grow?',head:'What do plants need to grow?',
 notes:'Read each idea aloud. Ask the class to vote: which idea do they agree with? Note: the “food from soil” idea will be tested later in the chapter — do not correct it yet.',
 html:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:34px 50px;margin-top:10px">
  <div class="kid rv" data-s="1">${avatar('#C98B62','#2B1B12','#3988E8')}<div class="bubble">“When we water plants regularly, they grow better. So, I think <b class="bl">water</b> also contributes to its growth.”</div></div>
  <div class="kid rv" data-s="2">${avatar('#E0A982','#3A2414','#E0475B',1)}<div class="bubble">“Maybe plants take up <b class="fd">food from the soil</b> through their roots.”</div></div>
  <div class="kid rv" data-s="3">${avatar('#B97A52','#1A120C','#239B56')}<div class="bubble">“I think <b style="color:#C48A00">sunlight</b> plays some role in the growth of plants.”</div></div>
  <div class="kid rv" data-s="4">${avatar('#D69B70','#2A1A10','#8E5BD8',1)}<div class="bubble">“I think, maybe, <span style="display:inline-block;width:150px;border-bottom:4px dashed #9AB0C7"></span> plays some role!”</div></div>
 </div>
 <div class="concl rv" data-s="5" style="margin-top:46px;display:flex;align-items:center;gap:26px">${ic('eye',70)}<div>Scientists don’t just guess — they <b>test</b> ideas. Let us perform an experiment to test some of these explanations.</div></div>`
});

/* ===================== SCENE 2c — ACTIVITY 10.1 THREE POTS ===================== */
S({id:'pots',sec:'10.1 How do plants grow?',title:'Activity 10.1 — Three pots',head:'Activity 10.1: Three pots',
 notes:'Click each pot to discuss its conditions. Let every student choose a prediction before pressing <b>Fast-forward 2 weeks</b>. The real experiment needs two weeks — plan ahead and keep a daily record.',
 html:`<div class="row" style="position:absolute;right:90px;top:64px;gap:18px"><div class="pill y" id="pday">Day 1</div><button class="btn pri" id="pff">⏩ Fast-forward 2 weeks</button><button class="btn sm" id="pres">↺</button></div>
 <div class="viz" style="height:470px"><svg id="potsvg" viewBox="0 0 1740 470"></svg></div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:30px;margin-top:22px" id="pcols"></div>`,
 init(el,o){
  const P=[{k:'A',sun:1,wat:1,bg:'url(#gSky)',end:{g:.66}},{k:'B',sun:1,wat:0,bg:'url(#gSky)',end:{g:.28,droop:1,col:'#A8834A'}},{k:'C',sun:0,wat:1,bg:'#1C2B45',end:{g:.40,col:'#CDD46A',thin:1}}];
  o.P=P;let s='';
  P.forEach((p,i)=>{const x=i*590;
   s+=`<g class="clk" id="pp${p.k}" style="transform-origin:${x+280}px 235px;transition:transform .4s"><rect x="${x}" y="0" width="560" height="470" rx="28" fill="${p.bg}"/>`;
   if(p.sun)s+=ART.sun(x+470,86,34);else s+=`<circle cx="${x+470}" cy="82" r="30" fill="#E6ECF5"/><circle cx="${x+484}" cy="72" r="28" fill="#1C2B45"/>`+[[80,60],[150,120],[360,50],[300,140]].map(([a,b])=>`<circle cx="${x+a}" cy="${b}" r="3" fill="#fff" opacity=".6"/>`).join('');
   s+=`<text x="${x+34}" y="64" font-size="40" font-weight="800" class="${p.sun?'lbl':'lbl-w'}">Pot ${p.k}</text>`;
   if(p.wat)s+=`<g transform="translate(${x+90} 120)"><path d="M0 30h60l16-14 8 6-14 18v26H0z" fill="#3988E8"/><path d="M0 30Q-20 30-20 50" stroke="#3988E8" stroke-width="8" fill="none"/>${[0,1,2].map(j=>`<path d="M92 ${30+j*6}c-4 6-6 9-6 12a6 6 0 0012 0c0-3-2-6-6-12z" fill="#3B8EEA" class="mote" style="animation:dropf 1.4s ${j*.45}s infinite ease-in"/>`).join('')}</g>`;
   s+=`<g id="pl${p.k}"></g>`+ART.pot(x+280,330,210,130)+`<ellipse cx="${x+280}" cy="336" rx="96" ry="12" fill="${p.wat?'#5E3F22':'#B89068'}"/>`;
   if(!p.wat)s+=`<path d="M${x+215} 336l18 4 10-6 16 7M${x+300} 333l14 6 18-5" stroke="#8A6A45" stroke-width="3" fill="none"/>`;
   s+=`<text id="pt${p.k}" x="${x+280}" y="448" text-anchor="middle" font-size="25" font-weight="700" class="${p.sun?'lbl':'lbl-w'}"></text></g>`;});
  $('#potsvg',el).innerHTML=`<style>@keyframes dropf{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(8px,120px);opacity:0}}</style>`+s;
  $('#pcols',el).innerHTML=P.map(p=>`<div class="card" id="pc${p.k}" style="padding:20px 26px;transition:box-shadow .3s">
   <div class="row" style="gap:18px;font-size:25px;font-weight:700;margin-bottom:12px"><span>${ic('sun',34)} ${p.sun?'<span class="yes">Direct sunlight</span>':'<span class="no">In the dark</span>'}</span><span>${ic('drop',30)} ${p.wat?'<span class="yes">Water daily</span>':'<span class="no">No water</span>'}</span></div>
   <div class="row" style="gap:10px"><span style="font-size:22px;font-weight:700;color:var(--ink2)">Predict:</span>${['Grows well','Grows less','May die'].map(t=>`<button class="btn sm" style="font-size:20px;padding:10px 16px;white-space:nowrap" data-p="${p.k}">${t}</button>`).join('')}</div>
   <div class="pres" style="font-size:25px;font-weight:650;margin-top:12px;min-height:34px;color:var(--ink2)"></div></div>`).join('');
  o.state={};const R={A:'Grew well — taller, more new leaves, green',B:'Wilted — it may die without water',C:'Less growth than A — leaves turn pale/yellow'};o.R=R;
  o.draw=t=>{P.forEach(p=>{const e=p.end,st={g:lerp(.28,e.g,t),droop:(e.droop||0)*t,thin:(e.thin||0)*t,H:300,nobranch:1};if(e.col)st.col=mix('#3DB26A',e.col,t);$('#pl'+p.k,el).innerHTML=ART.plant(p.k==='A'?280:p.k==='B'?870:1460,334,st);});$('#pday',el).textContent='Day '+(1+Math.round(t*13));};
  o.reset=()=>{o.t=0;o.done=false;o.draw(0);P.forEach(p=>{$('#pt'+p.k,el).textContent='';$('#pc'+p.k+' .pres',el).textContent='';});$$('[data-p]',el).forEach(b=>b.classList.remove('sel'));o.state={};};
  $$('[data-p]',el).forEach(b=>b.onclick=()=>{const k=b.dataset.p;$$(`[data-p="${k}"]`,el).forEach(x=>x.classList.toggle('sel',x===b));o.state[k]=b.textContent;$('#pt'+k,el).textContent='Prediction: '+b.textContent;});
  P.forEach(p=>$('#pp'+p.k,el).onclick=()=>{P.forEach(q=>{$('#pp'+q.k,el).style.transform=q===p?'scale(1.03)':'';$('#pc'+q.k,el).style.boxShadow=q===p?'0 0 0 4px #3988E8, var(--shadow)':'';});});
  o.ff=()=>{if(o.done)return;o._bag.tw(4200,e=>{o.t=e;o.draw(e);},()=>{o.done=true;P.forEach(p=>{$('#pc'+p.k+' .pres',el).innerHTML='<b style="color:var(--ink)">After 2 weeks:</b> '+R[p.k];$('#pt'+p.k,el).textContent=R[p.k].split(' — ')[0];});});};
  $('#pff',el).onclick=o.ff;$('#pres',el).onclick=()=>{o._bag.clear();o.reset();};
  o.reset();
 },
 enter(el,o){if(!o.done)o.reset();},
 onNext(el,o){if(!o.done){o.ff();return true;}return false;}
});

/* ===================== SCENE 2d — TABLE 10.1 + CONCLUSION ===================== */
S({id:'t101',sec:'10.1 How do plants grow?',title:'Observations & conclusion',head:'What did we observe after two weeks?',
 notes:'These are typical observations. Your class results may differ slightly — that is fine. Ask: <i>Which pot has the maximum growth? The least?</i> before revealing.',
 html:`<table class="tb"><tr><th>Pot kept under different conditions</th><th>Sunlight</th><th>Water</th><th>Height</th><th>Number of leaves</th><th>Colour of leaves</th></tr>
  <tr><td><b>Pot A:</b> direct sunlight, with water</td><td class="yes">Yes</td><td class="yes">Yes</td><td>Increased the most</td><td>More new leaves</td><td>Green</td></tr>
  <tr><td><b>Pot B:</b> direct sunlight, without water</td><td class="yes">Yes</td><td class="no">No</td><td>No growth, drooping</td><td>Leaves dry and fall</td><td>Yellow / brown</td></tr>
  <tr><td><b>Pot C:</b> in the dark, with water</td><td class="no">No</td><td class="yes">Yes</td><td>Less than Pot A</td><td>Fewer new leaves</td><td>Pale / yellow</td></tr></table>
 <p class="muted" style="font-size:22px;margin:10px 4px 0">Table 10.1: Effect of sunlight and water on plant growth (typical observations)</p>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:26px">
  <div class="card rv" data-s="1"><h3>Maximum growth?</h3><p><b class="g">Pot A</b> — it got both sunlight and water.</p></div>
  <div class="card rv" data-s="2"><h3>Least growth?</h3><p><b class="rd">Pot B</b> — it may die without water, even with sunlight.</p></div></div>
 <div class="concl rv" data-s="3" style="margin-top:26px">Conclusion: plants require <b>both sunlight and water</b> for their growth.</div>`
});

/* ===================== FASCINATING FACT — VRIKSHAYURVEDA ===================== */
S({id:'vrik',sec:'10.1 How do plants grow?',title:'Fascinating fact: Vrikshayurveda',head:'Fascinating fact',
 notes:'Connect with Indian knowledge traditions: careful observation over time, written down to guide farmers.',
 html:`<div class="grid2 wideR" style="height:740px"><div class="viz" style="background:linear-gradient(160deg,#FFF6DD,#FFFFFF)"><svg viewBox="0 0 800 740">
   <rect x="120" y="110" width="560" height="520" rx="24" fill="#F7E7C4" filter="url(#fShadow)"/><rect x="90" y="90" width="620" height="60" rx="30" fill="#D9B77A"/><rect x="90" y="590" width="620" height="60" rx="30" fill="#D9B77A"/>
   ${[0,1,2,3,4,5].map(i=>`<rect x="170" y="${200+i*58}" width="${440-((i*53)%120)}" height="14" rx="7" fill="#D7BF8E"/>`).join('')}
   <g transform="translate(580 560)">${ART.plant(0,0,{g:.55,H:240,nobranch:1})}</g></svg></div>
  <div class="col">
   <div class="fact"><div class="tag">Vrikshayurveda</div><p style="font-size:42px;line-height:1.5;font-weight:700">फलकुसुमसंपदुचिता रोपणतो भवति केवलान्न यतः ।</p><p style="font-size:32px;font-style:italic;margin-top:8px">“Trees do not produce fruits and flowers merely because they are planted.”</p></div>
   <p class="rv" data-s="1">This line is from an ancient Indian text named <b><i>Vrikshayurveda</i></b>. It records useful observations about <b>plant growth, soil</b> and <b>agricultural practices</b> to improve crop health and production.</p>
   <p class="rv" data-s="2">Its ideas came from practical experience and patterns seen over time — for example, preparing <b>organic manure</b> by mixing water, barley and seeds like green, black and horse grams.</p>
  </div></div>`
});

/* ===================== 10.2 HOW DO PLANTS GET FOOD? ===================== */
S({id:'food',sec:'10.2 Leaves: the food factories',title:'How do plants get food?',head:'How do plants get food for their growth?',zoom:true,
 notes:'Ask: <i>Where does a goat’s food come from? A tiger’s?</i> Lead them to: all food can be traced back to plants. Then: but plants do not eat!',
 html:`<div class="row" style="gap:30px;margin-top:20px;justify-content:center">
  <div class="card rv" data-s="1" style="width:420px;text-align:center"><svg width="220" height="230" viewBox="0 0 220 230">${ART.pot(110,160,120,70)}${ART.plant(110,164,{g:.45,H:200,nobranch:1})}</svg><h3>Plants</h3></div>
  <div class="rv" data-s="2" style="font-size:70px;color:#9AB0C7">→</div>
  <div class="card rv" data-s="2" style="width:420px;text-align:center"><div style="font-size:150px;line-height:230px">🐐</div><h3>Eat plants directly</h3></div>
  <div class="rv" data-s="3" style="font-size:70px;color:#9AB0C7">→</div>
  <div class="card rv" data-s="3" style="width:420px;text-align:center"><div style="font-size:150px;line-height:230px">🐅</div><h3>Eat animals that eat plants</h3></div></div>
 <div class="q rv" data-s="4" style="margin-top:44px"><div class="qm">?</div><div>Animals get food from plants. But <span class="hl">unlike animals, plants do not <i>eat</i> food.</span> So how do plants obtain the food they need to grow?</div></div>`
});

/* ===================== LEAF — FOOD FACTORY ===================== */
S({id:'leaf',sec:'10.2 Leaves: the food factories',title:'Leaves: the food factories',head:'Leaves: the ‘food factories’ of plants',
 notes:'Click <b>Shine sunlight</b> to make the leaf glow. Use the magnifier to show that the green colour comes from a pigment inside the leaf cells. Ask: why might leaves be broad and flat?',
 html:`<div class="grid2"><div class="viz" style="background:linear-gradient(160deg,#F2FAFF,#FFFFFF)"><svg viewBox="0 0 1040 790">
   ${ART.sun(110,100,48)}
   <g id="lrays" opacity="0" style="transition:opacity .8s">${[0,1,2,3,4].map(i=>`<line x1="${150+i*30}" y1="${140+i*10}" x2="${420+i*110}" y2="${300+i*40}" stroke="url(#gRay)" stroke-width="10" class="dash" stroke-linecap="round"/>`).join('')}</g>
   <g id="bigleaf" transform="translate(250 420) rotate(-12)">
    <path d="M-40 10Q-110 30-170 90" stroke="#2E9C57" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="${ART.leafPath(640,200)}" fill="url(#gLeafD)"/>
    <path d="M0 0L610 0" stroke="#BFF0D0" stroke-width="9" stroke-linecap="round"/>
    ${[1,2,3,4,5,6].map(i=>{const x=i*86;return`<path d="M${x} 0Q${x+40} -60 ${x+90} ${-140+i*12}M${x} 0Q${x+40} 60 ${x+90} ${140-i*12}" stroke="#A8EBC0" stroke-width="5" fill="none"/>`}).join('')}
   </g>
   <circle cx="560" cy="400" r="34" fill="none" stroke="#142B45" stroke-width="5"/>
   <line x1="586" y1="424" x2="690" y2="500" stroke="#142B45" stroke-width="4" stroke-dasharray="8 8"/>
   <g transform="translate(800 585)"><circle r="160" fill="#F4FFF6" stroke="#142B45" stroke-width="10" filter="url(#fShadow)"/>
    <clipPath id="lmag"><circle r="152"/></clipPath><g clip-path="url(#lmag)" id="lcells"></g>
    <text y="190" text-anchor="middle" class="lbl" font-size="24">Magnified: leaf cells</text></g>
   <g id="lchl" opacity="0" style="transition:opacity .6s"><path d="M690 610L620 640" stroke="#239B56" stroke-width="4"/><rect x="290" y="616" width="340" height="52" rx="26" fill="#239B56"/><text x="460" y="651" text-anchor="middle" class="lbl-w" font-size="24">green pigment: chlorophyll</text></g>
  </svg><div class="ctrls overlay" style="right:30px;top:26px"><button class="btn" id="lsun" style="background:#FFF4D6">☀ Shine sunlight</button></div></div>
  <div class="col">
   <div class="card rv" data-s="1"><p>Plants store food in the form of <b>starch</b>, a type of <b>carbohydrate</b>. This starch is produced in the <b class="g">leaves</b>.</p></div>
   <div class="card rv" data-s="2"><p>Leaves are generally <b>broad and flat</b> — a large surface to receive sunlight.</p></div>
   <div class="card green rv" data-s="3"><p>Leaves are mostly green because of a green pigment called <b class="g">chlorophyll</b>.</p></div>
   <div class="card sun rv" data-s="4"><p>Chlorophyll helps in <b>capturing sunlight efficiently</b>.</p></div>
   <div class="concl rv" data-s="5" style="font-size:29px">Leaves are where the plant makes its food — the plant’s <b>food factories</b>!</div>
  </div></div>`,
 init(el,o){
  const R=rng(5);let c='';for(let yy=-170;yy<170;yy+=58)for(let xx=-190;xx<190;xx+=74){const ox=(Math.floor(yy/58)%2)*37;c+=`<rect x="${xx+ox}" y="${yy}" width="68" height="52" rx="20" fill="url(#gCell)" stroke="#9AD8AE" stroke-width="3"/>`;for(let k=0;k<6;k++)c+=`<ellipse cx="${xx+ox+12+R()*44}" cy="${yy+10+R()*32}" rx="7" ry="4.5" fill="#2FB463" transform="rotate(${R()*180} ${xx+ox+34} ${yy+26})"/>`;}
  $('#lcells',el).innerHTML=c;
  o.sun=v=>{o.on=v;$('#lrays',el).setAttribute('opacity',v?1:0);$('#bigleaf',el).classList.toggle('glowleaf',v);$('#lsun',el).textContent=v?'☾ Remove sunlight':'☀ Shine sunlight';};
  $('#lsun',el).onclick=()=>o.sun(!o.on);
 },
 enter(el,o){o.sun(false);},
 onStep(el,s,o){$('#lchl',el).setAttribute('opacity',s>=3?1:0);if(s>=4)o.sun(true);}
});

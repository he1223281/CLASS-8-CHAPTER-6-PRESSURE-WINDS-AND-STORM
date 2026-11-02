/* ===================== 10.3 TRANSPORT OF WATER & MINERALS ===================== */
const ROUTE=['Roots','Stem','Branches','Leaves'];
S({id:'xyl',sec:'10.3 Transport: xylem',title:'Water travels up',head:'How do water and minerals reach the leaves?',zoom:true,
 notes:'Take students underground. Press Next to follow the water: roots → stem → branches → leaves. Blue drops = water; purple diamonds = dissolved minerals.',
 html:`<div class="grid2"><div class="viz"><svg viewBox="0 0 1040 790">
  <rect width="1040" height="380" fill="url(#gSky)"/><rect y="380" width="1040" height="410" fill="url(#gSoil)"/><path d="M0 382Q260 370 520 382T1040 378V392H0Z" fill="#5DBB7C"/>
  <g id="xsoil"></g>
  <g stroke="#D8B27D" stroke-linecap="round" fill="none"><path d="M520 380V700" stroke-width="22"/><path d="M520 450Q440 480 360 560M520 480Q610 520 690 600M520 560Q470 620 420 700M520 600Q580 670 640 740" stroke-width="11"/>
   <g stroke-width="2.5" stroke="#EBD3AE">${[[380,545],[400,525],[430,505],[660,575],[630,553],[600,530],[435,680],[455,655],[620,715],[600,690]].map(([x,y])=>`<path d="M${x} ${y}l-14 10M${x} ${y}l10 14"/>`).join('')}</g></g>
  <path d="M520 382V110" stroke="url(#gStem)" stroke-width="40" stroke-linecap="round"/><path d="M520 380V112" stroke="#BFE0FF" stroke-width="12" stroke-linecap="round" opacity=".9"/>
  <path d="M520 220Q420 170 330 140M520 190Q620 140 720 110" stroke="#2E9C57" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M520 220Q420 170 330 140M520 190Q620 140 720 110" stroke="#BFE0FF" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${ART.leaf(330,140,150,50,-160)}${ART.leaf(720,110,150,50,-20)}${ART.leaf(520,112,130,44,-90)}${ART.leaf(520,300,120,40,-30)}${ART.leaf(520,280,120,40,-150)}
  <g id="xflows"></g>
  <g font-family="Inter,sans-serif" font-weight="800" font-size="26" id="xlbls">
   <g class="xl" opacity="0"><rect x="730" y="470" width="130" height="46" rx="23" fill="#fff"/><text x="795" y="502" text-anchor="middle" fill="#142B45">Roots</text></g>
   <g class="xl" opacity="0"><rect x="560" y="290" width="120" height="46" rx="23" fill="#fff"/><text x="620" y="322" text-anchor="middle" fill="#142B45">Stem</text></g>
   <g class="xl" opacity="0"><rect x="770" y="160" width="170" height="46" rx="23" fill="#fff"/><text x="855" y="192" text-anchor="middle" fill="#142B45">Branches</text></g>
   <g class="xl" opacity="0"><rect x="820" y="40" width="150" height="46" rx="23" fill="#fff"/><text x="895" y="72" text-anchor="middle" fill="#142B45">Leaves</text></g>
   <g id="xxl" opacity="0" style="transition:opacity .6s"><path d="M528 330L340 330" stroke="#142B45" stroke-width="3"/><rect x="60" y="306" width="290" height="50" rx="25" fill="#3988E8"/><text x="205" y="340" text-anchor="middle" fill="#fff">XYLEM (tubes)</text></g></g>
 </svg></div>
 <div class="col">
  <div class="card"><p>Water, along with <b>minerals</b> in the soil, is taken up by the <b>roots</b>. Minerals are important nutrients for plant growth.</p></div>
  <div class="row" id="xroute" style="gap:10px;flex-wrap:wrap">${ROUTE.map((r,i)=>`<div class="pill" style="font-size:28px;padding:12px 22px;background:#EEF3F8;color:#8AA2BD;transition:all .4s">${r}</div>${i<3?'<span style="font-size:32px;color:#9AB0C7">→</span>':''}`).join('')}</div>
  <div class="row" style="gap:24px;font-size:25px;font-weight:700"><span class="row" style="gap:8px">${'<svg width="30" height="36" viewBox="-12 -16 24 30">'+ART.mol('water',10)+'</svg>'} water</span><span class="row" style="gap:8px">${'<svg width="30" height="30" viewBox="-12 -12 24 24">'+ART.mol('mineral',9)+'</svg>'} minerals</span></div>
  <div class="concl rv" data-s="5" style="font-size:29px">Water and dissolved minerals move up through thin tube-like structures called <b>xylem</b>, present in the stem, branches and leaves.</div>
 </div></div>`,
 steps:5,
 init(el,o){
  const R=rng(41);let s='';for(let i=0;i<30;i++){const x=60+R()*920,y=420+R()*350;s+=`<g transform="translate(${x} ${y})">${ART.mol(i%3?'water':'mineral',i%3?9:7)}</g>`;}$('#xsoil',el).innerHTML=s;
  const F=$('#xflows',el),P=d=>svgEl('path',{d,fill:'none'},F);
  const seg=[
   [['M250 600Q320 570 372 548','M300 720Q380 690 428 686','M830 640Q750 610 684 596','M760 760Q690 740 632 734','M180 470Q300 480 370 536']],
   [['M360 560Q440 480 520 450V380','M690 600Q610 520 520 480V380','M420 700Q470 620 520 560V380','M640 740Q580 670 520 600V380']],
   [['M520 380V220']],
   [['M520 220Q420 170 330 140','M520 190Q620 140 720 110','M520 220V112']],
   [['M330 140L200 100','M720 110L850 70','M520 112V-10']]];
  o.seg=seg.map((g,k)=>g[0].map((d,i)=>[new Flow(P(d),{kind:'water',r:8,n:k===2?6:3,speed:k===2?.35:.45,seed:k*10+i,into:F}),new Flow(P(d),{kind:'mineral',r:6,n:k===2?3:1,speed:k===2?.3:.4,seed:k*10+i+5,into:F})]).flat());
  o.seg.flat().forEach(f=>f.set(false));
 },
 onStep(el,s,o){o.seg.forEach((g,k)=>g.forEach(f=>f.set(s>=1&&k<=s)));
  $$('.xl',el).forEach((g,i)=>g.setAttribute('opacity',s>=i+1?1:0));$('#xxl',el).setAttribute('opacity',s>=5?1:0);
  $$('#xroute .pill',el).forEach((p,i)=>{const on=s>=i+1;p.style.background=on?'#3988E8':'#EEF3F8';p.style.color=on?'#fff':'#8AA2BD';});},
 tick(dt,t,el,o){o.seg.flat().forEach(f=>f.tick(dt));}
});

/* ===================== ACTIVITY 10.7 — RED INK ===================== */
function twig(x,id,red){
 const lv=[[300,-150],[360,-30],[430,-160],[500,-20]];
 return`<g id="${id}">
  ${red?`<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="720" x2="0" y2="150"><stop class="s1" offset="0" stop-color="#C8364A"/><stop class="s2" offset="0" stop-color="#2E9C57"/></linearGradient>`:''}
  <path d="M${x} 720V170" stroke="${red?`url(#${id}g)`:'#2E9C57'}" stroke-width="12" stroke-linecap="round"/>
  <path d="M${x} 190Q${x-40} 150 ${x-70} 130M${x} 200Q${x+40} 160 ${x+66} 140" stroke="${red?`url(#${id}g)`:'#2E9C57'}" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${lv.map(([y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})"><path d="${ART.leafPath(120,40)}" fill="url(#gLeaf)"/><path class="vein" d="M4 0H112M30 0l20-18M30 0l20 18M60 0l20-16M60 0l20 16" stroke="#BFF0D0" stroke-width="3" fill="none"/></g>`).join('')}
  ${[[x-74,126],[x+70,136]].map(([fx,fy])=>`<g transform="translate(${fx} ${fy})">${[0,72,144,216,288].map(a=>`<g transform="rotate(${a})"><ellipse class="pet" cy="-24" rx="15" ry="24" fill="#FFFFFF" stroke="#E3E8EE" stroke-width="2"/><path class="pv" d="M0 -6V-40" stroke="#E0475B" stroke-width="2.5" opacity="0"/></g>`).join('')}<circle r="9" fill="#FFD166"/></g>`).join('')}
 </g>`;}
function tumbler(x,red,lbl){return`<path d="M${x-80} 470L${x-66} 740H${x+66}L${x+80} 470" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="5" stroke-linejoin="round"/>
 <path d="M${x-75} 650L${x-68} 735H${x+68}L${x+75} 650Z" fill="${red?'#E0475B':'#9FD0FF'}" opacity="${red?.75:.6}"/><text x="${x}" y="780" text-anchor="middle" class="lbl" font-size="30">${lbl}</text>`;}
S({id:'a107',sec:'10.3 Transport: xylem',title:'Activity 10.7 — Red ink',head:'Activity 10.7: The red ink experiment',zoom:true,
 notes:'Use twigs with white flowers (white sadabahar, balsam). Cut the stem obliquely <b>under water</b>. Press Next: one day later → observe → cut the stem and look with a magnifying glass.',
 html:`<div class="grid2"><div class="viz" style="background:linear-gradient(180deg,#F7FBFF,#fff)"><svg viewBox="0 0 1040 790">
  ${twig(270,'twA',0)}${twig(720,'twB',1)}${tumbler(270,0,'A — water')}${tumbler(720,1,'B — water + red ink')}
  <g transform="translate(860 40)"><rect width="150" height="56" rx="28" fill="#142B45"/><text id="rday" x="75" y="38" text-anchor="middle" class="lbl-w" font-size="26">Day 1</text></g>
  <g id="xsec" opacity="0" style="transition:opacity .8s" pointer-events="none"><rect width="1040" height="790" fill="rgba(255,255,255,.88)"/>
   <circle cx="520" cy="380" r="280" fill="#7CC98F"/><circle cx="520" cy="380" r="262" fill="#E8F6E1"/>
   ${Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,cx=520+Math.cos(a)*175,cy=380+Math.sin(a)*175;return`<g transform="translate(${cx} ${cy}) rotate(${a*180/Math.PI+90})"><ellipse cy="-22" rx="34" ry="22" fill="#F4E2B8" stroke="#D4B87A" stroke-width="2"/><ellipse cy="14" rx="30" ry="28" fill="#D7334B"/>${[[-10,8],[8,10],[0,22],[-6,-2],[10,-2]].map(([p,q])=>`<circle cx="${p}" cy="${q+6}" r="5" fill="#8E1426"/>`).join('')}</g>`}).join('')}
   <path d="M610 170L760 90" stroke="#142B45" stroke-width="3"/><rect x="740" y="60" width="200" height="50" rx="25" fill="#F2A33A"/><text x="840" y="94" text-anchor="middle" class="lbl-w" font-size="24">Phloem</text>
   <path d="M690 390L800 470" stroke="#142B45" stroke-width="3"/><rect x="770" y="460" width="250" height="50" rx="25" fill="#D7334B"/><text x="895" y="494" text-anchor="middle" class="lbl-w" font-size="24">Xylem (red)</text>
   <text x="520" y="720" text-anchor="middle" class="lbl" font-size="28">Cut end of the stem of twig B (magnified)</text></g>
 </svg><div class="ctrls overlay" style="left:24px;top:24px"><button class="btn sm" id="rcut">✂ Cut the stem</button></div></div>
 <div class="col" style="gap:14px">${stepList(['Fill one-third of tumblers A and B with water. Add a few drops of <b>red ink</b> to B.','Cut the stems <b>obliquely under water</b> and place one twig in each tumbler.','Observe the twigs the <b>next day</b>.'])}
  <div class="card rv" data-s="2" style="padding:20px 26px"><p>Twig B shows <b class="rd">red colour</b> in its <b>stem, leaves and flowers</b>. Twig A shows no change.</p></div>
  <div class="card rv" data-s="3" style="padding:20px 26px"><p>Cutting the upper stem shows red-coloured <b>tube-like structures</b> — the <b class="rd">xylem</b>.</p></div>
  <div class="concl rv" data-s="4" style="font-size:28px">Just like red ink, <b>minerals dissolved in water</b> move up the stem through the <b>xylem</b>.</div></div></div>`,
 steps:4,
 init(el,o){
  o.paint=t=>{const B=$('#twB',el);$$('stop',B).forEach(st=>st.setAttribute('offset',t));$$('.vein',B).forEach(v=>v.setAttribute('stroke',mix('#BFF0D0','#E0475B',clamp((t-.4)/.4,0,1))));
   const f=clamp((t-.75)/.25,0,1);$$('.pet',B).forEach(p=>p.setAttribute('fill',mix('#FFFFFF','#F7BCC7',f)));$$('.pv',B).forEach(p=>p.setAttribute('opacity',f));$('#rday',el).textContent=t>=1?'Next day':'Day 1';};
  $('#rcut',el).onclick=()=>{const x=$('#xsec',el);const on=x.getAttribute('opacity')!=='1';x.setAttribute('opacity',on?1:0);$('#rcut',el).textContent=on?'✕ Close section':'✂ Cut the stem';if(on&&APP.step<3){APP.step=3;applyStep();}};
 },
 onStep(el,s,o){o._bag.clear();markSteps(el,s>=1?3:0);
  if(s===1){o.paint(0);o._bag.tw(4200,e=>o.paint(e));}else o.paint(s>=1?1:0);
  $('#xsec',el).setAttribute('opacity',s===3?1:0);$('#rcut',el).textContent=s===3?'✕ Close section':'✂ Cut the stem';}
});

/* ===================== 10.3.2 PHLOEM ===================== */
S({id:'phl',sec:'10.3 Transport: phloem',title:'Food travels through phloem',head:'How does food reach other parts of the plant?',zoom:true,
 notes:'Use the toggle to show xylem only, phloem only, or both. Ask: <i>Where does the starch in a potato come from?</i> (Made in leaves, carried by phloem, stored underground.)',
 html:`<div class="grid2"><div class="viz"><svg viewBox="0 0 1040 790">
  <rect width="1040" height="520" fill="url(#gSky)"/><rect y="520" width="1040" height="270" fill="url(#gSoil)"/><path d="M0 522Q520 508 1040 522V534H0Z" fill="#5DBB7C"/>
  <path d="M520 520C470 560 470 660 520 760C570 660 570 560 520 520Z" fill="#E9A15C" stroke="#C47A35" stroke-width="4"/><path d="M500 580l-30-6M540 620l30-6M505 680l-26 4" stroke="#C47A35" stroke-width="3"/>
  <path d="M520 522V90" stroke="url(#gStem)" stroke-width="56" stroke-linecap="round"/>
  <path d="M508 700V96" stroke="#9FD0FF" stroke-width="10" stroke-linecap="round" id="phx" opacity=".95"/><path d="M533 700V96" stroke="#F8D49A" stroke-width="10" stroke-linecap="round" id="php" opacity=".95"/>
  <path d="M510 300Q400 260 290 250M530 260Q640 210 760 200" stroke="#2E9C57" stroke-width="16" fill="none" stroke-linecap="round"/>
  ${ART.leaf(290,250,190,64,-170)}${ART.leaf(760,200,190,64,-12)}${ART.leaf(520,96,150,50,-90)}${ART.leaf(520,420,140,46,-150)}${ART.leaf(520,380,140,46,-30)}
  <path d="M530 160Q610 120 650 80" stroke="#2E9C57" stroke-width="8" fill="none"/><g transform="translate(660 70) rotate(-40)"><rect x="-14" y="-60" width="28" height="90" rx="14" fill="#8CC63F"/>${[0,1,2].map(i=>`<circle cy="${-40+i*24}" r="8" fill="#C9E88E"/>`).join('')}</g>
  <g id="phf"></g>
  <g font-family="Inter,sans-serif" font-weight="800" font-size="24">
   <rect x="40" y="40" width="250" height="48" rx="24" fill="#fff"/><text x="165" y="72" text-anchor="middle" fill="#142B45">Leaves make food</text>
   <rect x="700" y="20" width="250" height="48" rx="24" fill="#fff"/><text x="825" y="52" text-anchor="middle" fill="#142B45">Seeds store food</text>
   <rect x="600" y="690" width="260" height="48" rx="24" fill="#fff"/><text x="730" y="722" text-anchor="middle" fill="#142B45">Roots store food</text>
   <g id="phlx"><rect x="200" y="460" width="190" height="48" rx="24" fill="#3988E8"/><text x="295" y="492" text-anchor="middle" fill="#fff">Xylem ↑</text></g>
   <g id="phlp"><rect x="650" y="460" width="190" height="48" rx="24" fill="#E08E1B"/><text x="745" y="492" text-anchor="middle" fill="#fff">Phloem</text></g></g>
 </svg><div class="ctrls overlay" style="left:24px;bottom:24px"><div class="seg"><button data-m="x">Xylem</button><button data-m="p" class="on">Phloem</button><button data-m="b">Both</button></div></div></div>
 <div class="col">
  <div class="card"><p>Leaves are the primary site of photosynthesis. The food prepared in the leaves is transported to <b>all parts</b> of the plant.</p></div>
  <div class="card sun rv" data-s="1"><p>Food travels through another set of thin tube-like structures called the <b class="fd" style="font-size:34px">phloem</b>.</p></div>
  <div class="card green rv" data-s="2"><p>The transported food may also be <b>stored</b> in other parts, such as <b>seeds</b> and <b>roots</b>.</p></div>
  <div class="row rv" data-s="2" style="gap:24px;font-size:25px;font-weight:700"><span class="row" style="gap:8px"><svg width="30" height="30" viewBox="-12 -12 24 24">${ART.mol('food',10)}</svg> food (from leaves)</span><span class="row" style="gap:8px"><svg width="30" height="36" viewBox="-12 -16 24 30">${ART.mol('water',10)}</svg> water</span></div></div></div>`,
 init(el,o){const F=$('#phf',el),P=d=>svgEl('path',{d,fill:'none'},F);
  o.x=[new Flow(P('M508 700V110'),{kind:'water',r:9,n:10,speed:.12,into:F}),new Flow(P('M508 290Q400 262 300 252'),{kind:'water',r:8,n:3,speed:.3,into:F,seed:3}),new Flow(P('M508 250Q640 212 750 202'),{kind:'water',r:8,n:3,speed:.3,into:F,seed:4})];
  o.p=[new Flow(P('M300 248Q420 262 533 300V700'),{kind:'food',r:10,n:9,speed:.1,into:F,seed:5}),new Flow(P('M750 198Q640 210 533 262V170Q600 125 650 85'),{kind:'food',r:10,n:6,speed:.12,into:F,seed:6}),new Flow(P('M760 202Q640 212 533 262V700'),{kind:'food',r:10,n:8,speed:.09,into:F,seed:8})];
  o.mode=m=>{o.m=m;o.x.forEach(f=>f.set(m!=='p'));o.p.forEach(f=>f.set(m!=='x'));$$('[data-m]',el).forEach(b=>b.classList.toggle('on',b.dataset.m===m));
   $('#phx',el).setAttribute('opacity',m!=='p'?.95:.25);$('#php',el).setAttribute('opacity',m!=='x'?.95:.25);$('#phlx',el).setAttribute('opacity',m!=='p'?1:.2);$('#phlp',el).setAttribute('opacity',m!=='x'?1:.2);};
  $$('[data-m]',el).forEach(b=>b.onclick=()=>o.mode(b.dataset.m));},
 enter(el,o){o.mode('p');},
 tick(dt,t,el,o){[...o.x,...o.p].forEach(f=>f.tick(dt));}
});

/* ===================== XYLEM vs PHLOEM ===================== */
function tube(col,up,kind){return`<svg width="150" height="330" viewBox="0 0 150 330"><rect x="45" y="10" width="60" height="310" rx="30" fill="${col}" opacity=".18"/><rect x="58" y="10" width="34" height="310" rx="17" fill="${col}" opacity=".35"/>
 ${[0,1,2,3,4].map(i=>`<g style="animation:${up?'tup':'tdn'} 2.6s ${-i*.52}s linear infinite">${'<g transform="translate(75 0)">'+ART.mol(kind,12)+'</g>'}</g>`).join('')}
 <path d="M130 ${up?'250L130 70':'70L130 250'}" stroke="${col}" stroke-width="6" marker-end="url(#mArrow)"/></svg>`;}
S({id:'xvp',sec:'10.3 Transport: phloem',title:'Xylem vs Phloem',head:'Two transport systems: xylem and phloem',
 notes:'Make the distinction crisp: <b>X</b>ylem — water (think “X goes up from the roots”); <b>Ph</b>loem — food. Ask students to explain the potato question using this slide.',
 html:`<style>@keyframes tup{from{transform:translateY(320px)}to{transform:translateY(0)}}@keyframes tdn{from{transform:translateY(0)}to{transform:translateY(320px)}}</style>
 <div class="grid2 even" style="height:auto;gap:40px">
  <div class="card" style="display:flex;gap:26px;align-items:center;border-top:12px solid #3988E8">${tube('#3988E8',1,'water')}<div class="col" style="gap:14px"><h3 style="font-size:52px;color:#3988E8">Xylem</h3><ul class="list"><li>Carries <b>water and minerals</b></li><li>From the <b>roots</b> to the stem, branches, <b>leaves</b> and other parts</li><li>Shown by the <b>red ink</b> experiment</li></ul></div></div>
  <div class="card rv" data-s="1" style="display:flex;gap:26px;align-items:center;border-top:12px solid #E08E1B">${tube('#E08E1B',0,'food')}<div class="col" style="gap:14px"><h3 style="font-size:52px;color:#C67A12">Phloem</h3><ul class="list"><li>Carries <b>prepared food</b></li><li>From the <b>leaves</b> to all other parts of the plant</li><li>Food may be <b>stored</b> in roots and seeds</li></ul></div></div></div>
 <div class="q rv" data-s="2" style="margin-top:34px"><div class="qm">?</div>A potato slice turns blue-black with iodine. Where did its starch come from?</div>
 <div class="concl rv" data-s="3" style="margin-top:20px;font-size:29px">It was made in the <b>leaves</b> by photosynthesis, carried down by the <b>phloem</b>, and <b>stored</b> in the potato.</div>`
});

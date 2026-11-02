import * as THREE from 'three';
import {V,lerp,clamp,curve,rng} from './lib.js';
import {Flow,Drift,molMesh} from './fx.js';
import {X,mixc} from './worlds/lab.js';
import {B,gReset,G,PALE,BB,IOD} from './beats1.js';
const cap=(S,o)=>S.caption(o),lab=(S,t,p,o)=>S.label(t,p,o);
const CAUT=t=>`<div class="status bad"><b>Caution —</b> ${t}</div>`;
const L=(st,x,y,z)=>V(X[st]+x,y,z);
const sh=(st,p,t,fov=30,dur=2.6)=>({p:[X[st]+p[0],p[1],p[2]],t:[X[st]+t[0],t[1],t[2]],fov,dur});
/* ================= OXYGEN ================= */
B.push({id:'oxy',sec:'Oxygen',title:'Activity 10.5 — Bubbles',world:'lab',steps:4,from:sh('oxy',[-.5,.5,1.1],[0,.15,0],34),shot:sh('oxy',[-.05,.28,.62],[-.02,.14,0],32,3),
 notes:'Compare A (sunlight) with B (dark). Ask: <i>Where are the bubbles? What gas could it be?</i> The matchstick test is a teacher demonstration.',
 enter(S){const w=S.worlds.lab,p=w.parts.oxy;w.focus(X.oxy);w.setLight(1);p.cover.position.y=.17;p.stick.visible=false;p.sets.forEach(s=>{s.gas.scale.y=.0001;s.tl.scale.y=1;s.tl.position.y=0;});p.sets[0].bub.set(true);},
 step(S,s){const p=S.worlds.lab.parts.oxy;
  if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'Activity 10.5 · Barkha didi’s set-up',big:'A water plant, two places',mid:'A water plant under an inverted funnel and test tube. <b>A</b> in sunlight; <b>B</b> in the dark (under the cover).'});lab(S,'Inverted test tube',L('oxy',-.14,.21,0),{kind:'abio',lift:40});lab(S,'Funnel',L('oxy',-.18,.06,.02),{kind:'ink',lift:40,side:'down',delay:400});lab(S,'Water plant',L('oxy',-.14,.04,.02),{kind:'bio',lift:70,side:'down',delay:800});}
  if(s===1){S.rig.fly(sh('oxy',[-.1,.22,.4],[-.14,.17,0],28,2.4));cap(S,{pos:'left',cls:'compact',kicker:'Observe',big:'Bubbles — only in sunlight',mid:'In <b>A</b>, bubbles of gas rise from the plant and collect at the top of the test tube. In <b>B</b> (dark), there are none.'});lab(S,'Gas collects',L('oxy',-.14,.215,0),{kind:'amber',lift:30});
   S.tween(1.5,e=>p.cover.position.y=lerp(.17,.55,e),()=>lab(S,'B: no bubbles',L('oxy',.14,.2,0),{kind:'red',lift:30}));}
  if(s===2){cap(S,{pos:'left',cls:'compact',kicker:'Test the gas',big:'A lit matchstick…',mid:'Barkha didi closed the tube with her thumb, took it out and quickly inserted a <b>lit matchstick</b>. It burned with an <b class="a">intense flame</b>!'});
   const st=p.stick;st.visible=true;st.position.set(-.14,.32,0);S.tween(1.6,e=>st.position.y=lerp(.32,.255,e),()=>S.tween(1.4,e=>p.stickFlame.scale.setScalar(lerp(.6,1.7,e))));
   S.panel(`<h3>Safety</h3>${CAUT('Only the teacher should handle a lit matchstick. Keep hair, paper and alcohol away from flames.')}`,{side:'right',cls:'auto'});}
  if(s===3){S.closePanel();cap(S,{pos:'left',cls:'compact',kicker:'Conclusion',big:'Oxygen is released',mid:'The gas is rich in <b style="color:var(--o2)">oxygen</b>. Oxygen is released during photosynthesis, which takes place in the presence of <b class="a">sunlight</b>.'});}}});
B.push({id:'dastur',sec:'Oxygen',title:'Know a scientist: R. H. Dastur',steps:1,shot:{p:[1.1,.8,1.9],t:[0,.4,0],fov:30,dur:3},notes:'Facts as given in the textbook.',enter(S){gReset(S,{elev:22,az:240});},
 step(S){S.panel(`<h3>Know a scientist</h3><h2>Rustom Hormusji Dastur <span class="tagline">1896–1961</span></h2><p>A plant scientist who studied <b>photosynthesis</b> in India.</p><p>Head of the Botany Department at the Royal Institute of Science, Bombay (now the Institute of Science, Mumbai), 1921–1935.</p><p>He studied the effects of the <b>amount of water</b> and <b>temperature</b> on photosynthesis, and examined the importance of water, temperature and the <b>colour of light</b>.</p>`,{side:'right',cls:'auto'});
  cap(S,{pos:'left',cls:'compact',kicker:'Know a scientist',big:'Studying photosynthesis in India',mid:'Many scientists across the world helped us understand photosynthesis.'});}});
/* ================= STOMATA ================= */
function peelArt(){const c=document.createElement('canvas');c.width=c.height=600;const g=c.getContext('2d'),R=rng(7);g.fillStyle='#e7e6f8';g.fillRect(0,0,600,600);
 const V2=[];for(let j=0;j<=12;j++){V2[j]=[];for(let i=0;i<=10;i++)V2[j][i]=[i*68-30+(j%2)*34+(R()-.5)*22,j*56-30+(R()-.5)*16];}
 g.strokeStyle='#6e62b8';g.lineWidth=4;g.lineJoin='round';for(let j=0;j<12;j++)for(let i=0;i<10;i++){const a=V2[j][i],b=V2[j][i+1],cc=V2[j+1][i+1],d=V2[j+1][i];g.fillStyle='#dcdff5';g.beginPath();g.moveTo(...a);g.lineTo(...b);g.lineTo(...cc);g.lineTo(...d);g.closePath();g.fill();g.stroke();}
 [[150,170],[420,130],[300,330],[110,430],[470,420],[300,520]].forEach(([x,y],k)=>{g.save();g.translate(x,y);g.rotate((R()-.5)*.8);for(const s of [-1,1]){g.fillStyle='#9ed39a';g.strokeStyle='#3f7a45';g.lineWidth=3;g.beginPath();g.ellipse(s*15,0,15,28,0,0,7);g.fill();g.stroke();g.fillStyle='#3f9a4a';for(let n=0;n<3;n++){g.beginPath();g.arc(s*16,(n-1)*12,4,0,7);g.fill();}}g.fillStyle='#2b2350';g.beginPath();g.ellipse(0,0,4.5,18,0,0,7);g.fill();g.restore();});
 const v=g.createRadialGradient(300,300,200,300,300,300);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=v;g.fillRect(0,0,600,600);return c.toDataURL();}
let PEEL=null;
B.push({id:'peel',sec:'Stomata',title:'Activity 10.6 — Leaf peel',world:'lab',steps:2,from:sh('peel',[-.3,.4,.9],[0,.12,0],34),shot:sh('peel',[.14,.24,.44],[0,.12,0],30,3),
 notes:'Teacher demonstration. Rhoeo leaves peel easily. Look for tiny pores between pairs of bean-shaped cells.',enter(S){S.worlds.lab.focus(X.peel);S.worlds.lab.setLight(1);},
 step(S,s){if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'Activity 10.6 · Let us examine',big:'Peel the lower surface',mid:'Peel a thin layer from the <b>lower surface</b> of a leaf (rhoeo, money plant, onion, hibiscus, coleus or grass). Put it in water on a slide, add a drop of <b>ink</b>, cover with a coverslip and observe.'});
   lab(S,'Slide with peel',L('peel',0,.106,0),{kind:'uv',lift:40});lab(S,'Watch glass',L('peel',.16,.01,.05),{kind:'abio',lift:40,delay:400});lab(S,'Forceps',L('peel',.1,.004,.12),{kind:'ink',lift:30,delay:800,side:'down'});}
  if(s===1){PEEL=PEEL||peelArt();S.clearLabels();S.scope(true,`<img src="${PEEL}" alt="Leaf peel under the microscope">`);cap(S,{pos:'left',cls:'compact',kicker:'Under the microscope',big:'Tiny pores!',mid:'These tiny pores are called <b class="g">stomata</b>. Stomata on the surface of leaves help in the <b>exchange of gases</b>.'});}}});
B.push({id:'stomata',sec:'Stomata',title:'Stomata: tiny gateways',world:'leaf',steps:2,shot:{p:[4.6,-2.2,8.2],t:[2.4,-.8,.9],fov:38,dur:3.4},
 notes:'The same pores serve both processes. Photosynthesis happens only in light; respiration happens all the time.',
 enter(S){const w=S.worlds.leaf;Object.values(w.mol).forEach(f=>f.set(false));w.glow=false;w.shafts.forEach(s=>s.visible=false);w.starch.visible=false;
  const st=w.stoma;this.co2in=S.addFx(new Flow(w.scene,{curves:[0,1,2].map(i=>curve([[1+i,-3.2,1.6],[2.35,-1.2,.9],[2.35,-.6,.9],[2+i*.4,.6,.8]])),kind:'co2',n:12,size:.17,speed:.16}));
  this.o2out=S.addFx(new Flow(w.scene,{curves:[0,1,2].map(i=>curve([[2.2+i*.4,.6,.8],[2.45,-.6,.9],[2.5,-1.2,.9],[3.4+i,-3.2,1.6]])),kind:'o2',n:12,size:.17,speed:.16,seed:4}));
  this.o2in=S.addFx(new Flow(w.scene,{curves:[0,1,2].map(i=>curve([[1+i,-3.2,1.6],[2.35,-1.2,.9],[2.35,-.6,.9],[2+i*.4,.6,.8]])),kind:'o2',n:12,size:.17,speed:.16,seed:5,on:false}));
  this.co2out=S.addFx(new Flow(w.scene,{curves:[0,1,2].map(i=>curve([[2.2+i*.4,.6,.8],[2.45,-.6,.9],[2.5,-1.2,.9],[3.4+i,-3.2,1.6]])),kind:'co2',n:12,size:.17,speed:.16,seed:6,on:false}));},
 step(S,s){const w=S.worlds.leaf;
  if(s===0){w.glow=true;w.shafts.forEach(x=>x.visible=true);cap(S,{pos:'low',cls:'compact',kicker:'During photosynthesis · in light',big:'CO₂ in · O₂ out',mid:'Carbon dioxide <b>enters</b> the leaf; oxygen is <b>released</b> — both through the stomata.',html:'<div class="legend"><span><i style="background:#9aa3ad"></i>carbon dioxide</span><span><i style="background:#4fd1e3"></i>oxygen</span></div>'});lab(S,'Stoma',w.spots.stoma,{kind:'bio',lift:40});}
  if(s===1){w.glow=false;w.shafts.forEach(x=>x.visible=false);this.co2in.set(false);this.o2out.set(false);this.o2in.set(true);this.co2out.set(true);
   cap(S,{pos:'low',cls:'compact',kicker:'During respiration · all the time',big:'O₂ in · CO₂ out',mid:'For respiration, oxygen <b>enters</b> and carbon dioxide is <b>released</b>. The same tiny pores serve both processes.'});}}});
/* ================= TRANSPORT ================= */
B.push({id:'roots',sec:'Transport',title:'Water and minerals',steps:2,shot:{p:[-.25,-.06,1.05],t:[0,-.18,0],fov:36,dur:3.4},
 notes:'Minerals are important nutrients for growth. How do water and minerals reach all parts? Let’s find out.',
 enter(S){gReset(S,{cut:true});const h=S.worlds.garden.hero,P=[];h.roots.slice(1).forEach(rc=>P.push(curve([...rc.getPoints(10).reverse(),...h.stem.getPoints(12)])));
  S.addFx(new Flow(h.inner,{curves:P,kind:'water',n:46,size:.011,speed:.07,seed:7}));S.addFx(new Flow(h.inner,{curves:P,kind:'mineral',n:16,size:.008,speed:.07,seed:8}));},
 step(S,s){if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'10.3 · Transport in plants',big:'From the soil…',mid:'All living beings need water. Water, with <b style="color:var(--uv)">minerals</b> dissolved in it, is taken up by the <b class="s">roots</b>.',html:'<div class="legend"><span><i style="background:#3b8eea"></i>water</span><span><i style="background:#b16ae0"></i>minerals</span></div>'});}
  if(s===1)cap(S,{pos:'left',cls:'compact',kicker:'Question',big:'…to every leaf. How?',mid:'How do water and minerals taken up by the roots move to all parts of the plant? Let’s test with red ink.'});}});
B.push({id:'ink',sec:'Transport',title:'Activity 10.7 — Red ink',world:'lab',steps:3,from:sh('ink',[-.4,.5,1],[0,.15,0],34),shot:sh('ink',[0,.3,.7],[0,.17,0],32,3),
 notes:'Use twigs with white flowers (white sadabahar, balsam). Cut the stems obliquely <b>under water</b>. Observe the next day.',
 enter(S){const w=S.worlds.lab,p=w.parts.ink;w.focus(X.ink);w.setLight(1);p.tw.forEach(t=>{t.setTint('#fff',0);t.flowers.forEach(f=>f.children.forEach(c=>c.material.color&&c.geometry.type!=='SphereGeometry'&&c.material.color.set('#ffffff')));});},
 step(S,s){const p=S.worlds.lab.parts.ink;
  if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'Activity 10.7 · Let us experiment',big:'Two twigs, two tumblers',mid:'Tumbler <b>A</b>: water. Tumbler <b>B</b>: water with a few drops of <b class="r">red ink</b>. Stems cut obliquely under water.'});lab(S,'A · water',L('ink',-.12,.06,0),{kind:'abio',lift:40,side:'down'});lab(S,'B · red ink',L('ink',.12,.06,0),{kind:'red',lift:40,side:'down',delay:400});}
  if(s===1){cap(S,{pos:'left',cls:'compact',html:'<div class="daycount">The next day</div>',big:'Red appears in twig B',mid:'Red colour shows in the <b>stem, leaves and flowers</b> of twig B. Twig A is unchanged.'});
   const t=p.tw[1],pet=t.flowers.flatMap(f=>f.children.filter(c=>c.geometry.type!=='SphereGeometry'));S.tween(6,e=>{t.stemMat.setTint('#c8364a',e*.85);t.leafMat.setTint('#c8364a',e*.28);pet.forEach(c=>c.material.color.set(mixc('#ffffff','#f39aae',Math.max(0,e*1.4-.4))));});
   S.later(3000,()=>{lab(S,'Red stem',()=>t.stemWorld(.5),{kind:'red',lift:50});lab(S,'Pink flowers',()=>t.flowers[0].getWorldPosition(V()),{kind:'red',lift:30,delay:300});});}
  if(s===2)cap(S,{pos:'left',cls:'compact',kicker:'Next',big:'Cut the stem open',mid:'Cut the stem above the water and look at the cut end with a magnifying glass…'});}});
B.push({id:'section',sec:'Transport',title:'Inside the stem: xylem',world:'stem',steps:2,from:{p:[0,24,3],t:[0,7,0],fov:44},shot:{p:[0,15.5,5.5],t:[0,7,0],fov:42,dur:4},
 notes:'The red-stained tubes are the xylem. Phloem tubes are next to them.',enter(S){const w=S.worlds.stem;w.paintSection(true);Object.values(w.flows).forEach(f=>f.set(false));},
 step(S,s){const w=S.worlds.stem;
  if(s===0){cap(S,{pos:'low',cls:'compact',kicker:'The cut end of twig B (magnified)',big:'Red tubes',mid:'The red ink moved up through thin, tube-like structures called the <b class="b">xylem</b>.'});lab(S,'Xylem (stained red)',V(3.68,7.02,0),{kind:'red',lift:40});lab(S,'Phloem',V(-1.33,7.02,-4.0),{kind:'amber',lift:40,delay:400});}
  if(s===1){w.flows.water.set(true);w.flows.mins.set(true);S.rig.fly({p:[3.2,-2,7],t:[-.5,1.5,0],fov:44,dur:4});cap(S,{pos:'low',cls:'compact',kicker:'Inside the xylem',big:'Water and minerals rise',mid:'Just like the red ink, <b style="color:var(--uv)">minerals dissolved in water</b> move up the stem through the <b class="b">xylem</b> — present in the stem, branches and leaves.'});
   lab(S,'Xylem',w.spots.xylem,{kind:'abio',lift:40});}}});
B.push({id:'phloem',sec:'Transport',title:'Food travels: phloem',world:'stem',steps:1,shot:{p:[-3.4,.5,7.2],t:[-.6,0,1.4],fov:40,dur:3.4},notes:'Ask: where does the starch in a potato come from? (Made in leaves → carried by phloem → stored.)',
 enter(S){const w=S.worlds.stem;w.paintSection(false);w.flows.water.set(true);w.flows.mins.set(false);w.flows.food.set(true);},
 step(S){cap(S,{pos:'low',cls:'compact',kicker:'10.3.2 · Transport of food',big:'Phloem carries food',mid:'Food prepared in the leaves is carried to all parts of the plant through another set of tubes — the <b class="a">phloem</b>. Food may be <b>stored</b> in roots and seeds.'});
  lab(S,'Phloem',S.worlds.stem.spots.phloem,{kind:'amber',lift:40});lab(S,'Xylem',S.worlds.stem.spots.xylem,{kind:'abio',lift:40,delay:400});}});
B.push({id:'xvp',sec:'Transport',title:'Xylem vs phloem',steps:2,shot:{p:[.75,.32,1.15],t:[0,.3,0],fov:32,dur:3},notes:'Make the distinction crisp: Xylem — water and minerals, up from the roots. Phloem — food, from the leaves to every part.',
 enter(S){gReset(S,{cut:true});const h=S.worlds.garden.hero,up=[],down=[];h.roots.slice(1).forEach(rc=>up.push(curve([...rc.getPoints(8).reverse(),...h.stem.getPoints(12)])));
  h.roots.slice(1,6).forEach(rc=>down.push(curve([...h.stem.getPoints(12).reverse(),...rc.getPoints(8)])));
  S.addFx(new Flow(h.inner,{curves:up,kind:'water',n:36,size:.01,speed:.07,seed:2}));this.food=S.addFx(new Flow(h.inner,{curves:down,kind:'sugar',n:22,size:.011,speed:.06,seed:3,on:false}));},
 step(S,s){if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'Xylem',big:'Water ↑',mid:'<b class="b">Xylem</b> carries <b>water and minerals</b> from the roots to the leaves and other parts.'});}
  if(s===1){this.food.set(true);cap(S,{pos:'left',cls:'compact',kicker:'Phloem',big:'Food → everywhere',mid:'<b class="a">Phloem</b> carries <b>prepared food</b> from the leaves to all other parts. Food may be stored in roots and seeds.'});
   S.panel(`<h3>Two transport systems</h3><table class="t"><tr><th></th><th>Xylem</th><th>Phloem</th></tr><tr><td><b>Carries</b></td><td>Water and minerals</td><td>Prepared food</td></tr><tr><td><b>From → to</b></td><td>Roots → stem, branches, leaves</td><td>Leaves → all parts</td></tr><tr><td><b>Evidence</b></td><td>Red ink experiment</td><td>Starch stored in roots, seeds (e.g. potato)</td></tr></table>`,{side:'right',cls:'auto'});}}});

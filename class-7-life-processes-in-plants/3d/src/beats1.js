import * as THREE from 'three';
import {V,lerp,clamp,smooth,curve,rng} from './lib.js';
import {Flow,Drift} from './fx.js';
import {X,mixc} from './worlds/lab.js';
export const G='#3d9a48',PALE='#e6dcb4',BB='#121533',IOD='#b9782f';
export const SECTIONS=['Welcome','Nutrition','How plants grow','Food factories','Starch test','Chlorophyll','Carbon dioxide','Photosynthesis','Oxygen','Stomata','Transport','Respiration','Balance','Review'];
const cap=(S,o)=>S.caption(o),lab=(S,t,p,o)=>S.label(t,p,o);
export function gReset(S,o={}){const g=S.worlds.garden;g.setCut(!!o.cut);g.setSun(o.elev??32,o.az??215);const h=g.hero;h.setGrowth(o.growth??1);h.setDroop(0);h.setTint('#ffffff',0);g.soilMols.forEach(m=>m.set(!!o.cut));
 g.pots.forEach(p=>{p.pl.setGrowth(.35);p.pl.setDroop(0);p.pl.setTint('#fff',0);});g.darkBox.position.set(2.75,.25,.55);g.nut.visible=!!o.nut;}
const leafP=(i,dx=0,dy=0,dz=0)=>S=>{const p=S.worlds.garden.hero.leafWorld(i);return V(p.x+dx,p.y+dy,p.z+dz);};
export function outside(S,i,d=.3,up=.1,fov=30){const h=S.worlds.garden.hero,p=h.leafWorld(i),a=h.stemWorld(.5);const dir=V(p.x-a.x,0,p.z-a.z).normalize();if(dir.z<0)dir.z=Math.abs(dir.z)*.6+.4;dir.normalize();return{p:[p.x+dir.x*d,p.y+up,p.z+dir.z*d],t:[p.x,p.y,p.z],fov,dur:3.4};}
const heroShot={p:[.6,.66,1.3],t:[0,.33,0],fov:32,dur:3.2};
export const B=[];
export function predict(S,title,rows,note,cap){const st={};S.hideCaption();const p=S.panel(`${cap?`<h3>${cap.kicker}</h3><h2>${cap.big}</h2><p>${cap.mid}</p><div style="height:8px"></div>`:''}<h3>Predict first</h3><p style="color:var(--ink);font-size:19px"><b>${title}</b></p>${rows.map((r,i)=>`<p style="margin-bottom:6px">${r[0]}<br><span class="predict">${r[1].map(t=>`<button class="chipbtn" data-r="${i}">${t}</button>`).join('')}</span></p>`).join('')}<div class="status mid">${note||'Everyone chooses, then press → to find out.'}</div>`,{side:'left',cls:'auto'});
 p.querySelectorAll('.chipbtn').forEach(b=>b.onclick=()=>{p.querySelectorAll(`[data-r="${b.dataset.r}"]`).forEach(x=>x.classList.toggle('on',x===b));st[b.dataset.r]=b.textContent;});return st;}
export function verdict(st,rows,answers){const k=Object.keys(st);if(!k.length)return'';let ok=0;const t=rows.map((r,i)=>{const g=st[i];if(g===answers[i])ok++;return`<b>${r[0]}</b>: ${g||'—'} ${g?(g===answers[i]?'✓':'✗'):''}`;}).join('<br>');return`<div class="status ${ok===rows.length?'good':'mid'}">Your predictions — ${ok} of ${rows.length} right<br>${t}</div>`;}

/* ================= WELCOME ================= */
B.push({id:'open',sec:'Welcome',title:'Life Processes in Plants',steps:2,from:{p:[-5,2.6,8],t:[0,.6,0],fov:40},shot:{p:[-1.05,.78,1.5],t:[.05,.4,0],fov:34,dur:9,orbit:.04},
 notes:'Let the opening play. Ask: <i>“Is this plant alive? How can you tell?”</i> Take 2–3 answers.',
 enter(S){gReset(S,{elev:24,az:230});},
 step(S,s){if(s===0)cap(S,{pos:'left',kicker:'Grade 7 · Science · Curiosity · Chapter 10',big:'Life Processes<br>in Plants',mid:'Discover the secret life of a plant.',small:'Press → or Space to begin'});
  if(s===1)cap(S,{pos:'left',cls:'compact',kicker:'A question to begin',big:'It never eats.<br>Yet it grows.',mid:'We eat food to grow. Have you ever seen a plant <i>eat</i>? So where does a plant get the food it needs?'});}});

/* ================= MODES OF NUTRITION ================= */
const NUTSHOT={p:[-.15,.42,1.15],t:[0,.17,0],fov:38,dur:3.2};
B.push({id:'nutr',sec:'Nutrition',title:'What is nutrition?',steps:2,shot:{p:[.5,.5,1.4],t:[0,.3,0],fov:34,dur:3.4},
 notes:'Start from experience: Why do we eat? Take answers — energy, growth, health. Then give the word <b>nutrition</b>.',
 enter(S){gReset(S,{nut:true});},
 step(S,s){if(s===0)cap(S,{pos:'left',cls:'compact',kicker:'Before we begin',big:'Every living thing needs food',mid:'Food gives <b class="a">energy</b> to work and move, helps the body <b class="g">grow</b>, and <b>repairs</b> it. A plant, a cow, a mushroom and you — all need food.'});
  if(s===1)cap(S,{pos:'left',cls:'compact def',kicker:'Key word',big:'Nutrition',mid:'Nutrition is the way an organism <b>obtains its food</b> and <b>uses it</b> for energy, growth and repair.'});}});
B.push({id:'modes',sec:'Nutrition',title:'Two modes: autotrophic and heterotrophic',steps:3,shot:NUTSHOT,
 notes:'Write the word roots on the board: auto = self, hetero = other, trophos = food/nourishment.',
 enter(S){gReset(S,{nut:true});},
 step(S,s){const g=S.worlds.garden;
  if(s===0)cap(S,{pos:'top',kicker:'Modes of nutrition',big:'Two main ways to get food',mid:'Some living things <b class="g">make their own food</b>. Others <b class="a">depend on other living things</b> for food.'});
  if(s===1){cap(S,{pos:'left',cls:'compact',kicker:'auto = self · trophos = nourishment',big:'Autotrophic nutrition',mid:'Organisms that <b class="g">make their own food</b> are <b>autotrophs</b>. Green plants make food using <b>carbon dioxide, water, sunlight</b> and <b class="g">chlorophyll</b>. This is called <b>photosynthesis</b> — we will see it step by step.'});
   lab(S,'Autotroph',()=>g.hero.stemWorld(.75),{kind:'bio',sub:'green plant · makes its own food',lift:40});}
  if(s===2){cap(S,{pos:'left',cls:'compact',kicker:'hetero = other',big:'Heterotrophic nutrition',mid:'Organisms that <b class="a">cannot make their own food</b> and take it from plants or animals are <b>heterotrophs</b>. All animals (including us), fungi like mushrooms, and most bacteria are heterotrophs.'});
   lab(S,'Autotroph',()=>g.hero.stemWorld(.75),{kind:'bio',lift:40});lab(S,'Heterotroph',g.mushroomAt,{kind:'amber',sub:'mushroom (fungus)',lift:40,delay:400});
   S.fact('Even a lion depends on plants: it eats deer, and deer eat grass. All food can be traced back to <b>autotrophs</b>.');}}});
B.push({id:'others',sec:'Nutrition',title:'Other modes: parasitic and saprotrophic',steps:2,shot:{p:[.85,.35,.55],t:[.55,.18,-.2],fov:36,dur:3},
 notes:'Show real examples if possible: Cuscuta (amarbel) on a hedge, bread mould, a mushroom. Pitcher plant and lichens can be shown as pictures.',
 enter(S){gReset(S,{nut:true});},
 step(S,s){const g=S.worlds.garden;
  if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'1 · Parasitic nutrition',big:'Living on another plant',mid:'<b style="color:#f2c230">Cuscuta</b> (amarbel) is a yellow, wire-like plant with <b>no chlorophyll</b>. It climbs on a <b>host</b> plant and takes food from it. The one that gives food is the <b>host</b>; the one that takes it is the <b>parasite</b>.'});
   lab(S,'Cuscuta (parasite)',g.cuscutaAt,{kind:'amber',lift:40});lab(S,'Host plant',g.hostAt,{kind:'bio',lift:30,delay:400});}
  if(s===1){S.rig.fly({p:[-.3,.3,.75],t:[-.48,.08,.2],fov:34,dur:2.6});cap(S,{pos:'left',cls:'compact',kicker:'2 · Saprotrophic nutrition',big:'Feeding on dead matter',mid:'<b class="a">Fungi</b> such as mushrooms and bread mould get food from <b>dead and decaying</b> things — like this old log. They release juices that dissolve it, then absorb the food. These organisms are <b>saprotrophs</b>.'});
   lab(S,'Mushrooms (saprotrophs)',g.mushroomAt,{kind:'amber',lift:40});lab(S,'Dead, decaying log',V(-.5,.07,.18),{kind:'soil',lift:40,side:'down',delay:400});
   S.fact('Saprotrophs clean up dead leaves and animals and return their nutrients to the soil.');}
}});

/* pitcher plant: dedicated showcase */
const PPC=(S,d=.26,up=.12,fov=34,dur=3)=>{const pp=S.worlds.lab.pp,t=pp.world(0,V(0,.045,0)),c=pp.group.position,dir=V(t.x-c.x,0,t.z-c.z).normalize();const side=V(-dir.z,0,dir.x);return{p:[t.x+dir.x*d*.55+side.x*d*.85,t.y+up,t.z+dir.z*d*.55+side.z*d*.85],t:[t.x,t.y,t.z],fov,dur};};
B.push({id:'pitcher',sec:'Nutrition',title:'3 · Insectivorous plant: the pitcher plant',world:'lab',steps:5,shot:S=>PPC(S,.75,.28,36,3.4),
 notes:'Ask first: <i>Is the pitcher plant an autotroph or a heterotroph?</i> (It makes its own food, but also gets extra nutrients from insects.) India’s own pitcher plant, <i>Nepenthes khasiana</i>, grows in Meghalaya.',
 enter(S){const L=S.worlds.lab;L.focus(11.4,.15);L.setLight(1.1);const pp=L.pp;pp.setXray(0);pp.ant.visible=false;pp.pitchers.forEach(p=>p.lid.rotation.x=-.5);},
 exit(S){const pp=S.worlds.lab.pp;pp.setXray(0);pp.ant.visible=false;},
 step(S,s){const g=S.worlds.lab,pp=g.pp,P=pp.pitchers[0];
  if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'3 · Insectivorous plants',big:'Meet the pitcher plant',mid:'Its <b class="g">green leaves</b> have chlorophyll, so it <b>makes its own food</b> by photosynthesis. But the tip of each leaf grows into a <b>tendril</b> that ends in a jug-like <b class="r">pitcher</b>.'});
   lab(S,'Green leaf',()=>g.pp.group.localToWorld(V(.07,.02,.02)),{kind:'bio',lift:50});lab(S,'Tendril',()=>pp.world(0,V(0,.09,-.06)),{kind:'bio',lift:40,delay:300});lab(S,'Pitcher',()=>pp.world(0,V(0,.04,0)),{kind:'red',sub:'a changed leaf',lift:60,delay:600});lab(S,'Lid',()=>pp.world(0,V(0,.1,-.012)),{kind:'amber',lift:40,delay:900});}
  if(s===1){S.rig.fly(PPC(S,.6,.22,32,2.6));cap(S,{pos:'left',cls:'compact',kicker:'Why trap insects?',big:'Poor soil',mid:'It grows in soil that has <b>too little nitrogen</b> and some other minerals. Insects are rich in these nutrients — so the plant gets them by <b>catching insects</b>.'});
   S.fact('India’s own pitcher plant, <b>Nepenthes khasiana</b>, grows only in the hills of <b>Meghalaya</b>.');}
  if(s===2){S.rig.fly(PPC(S,.42,.2,30,2.4));const a=pp.ant;a.visible=true;const m=P.mouth;
   cap(S,{pos:'left',cls:'compact',kicker:'The trap · step 1',big:'Lured to the rim',mid:'The colourful, sweet-smelling <b class="r">rim</b> attracts an insect. The rim is very <b>slippery</b>…'});
   lab(S,'Slippery rim',()=>pp.world(0,V(.02,.082,0)),{kind:'red',lift:40});
   S.tween(4,(e,k)=>{const ang=k*Math.PI*1.2;a.position.copy(pp.world(0,V(Math.cos(ang)*.021,.0835,Math.sin(ang)*.021)));a.rotation.y=-ang-Math.PI/2;});}
  if(s===3){const a=pp.ant;a.visible=true;pp.setXray(.85);S.rig.fly(PPC(S,.45,.1,30,2.2));
   cap(S,{pos:'left',cls:'compact',kicker:'The trap · step 2',big:'It slips inside',mid:'The insect slides down the smooth inside wall into a pool of <b>digestive juice</b> at the bottom. It cannot climb out.'});
   const st=pp.world(0,V(.021,.083,0)),en=pp.world(0,V(.004,.016,0));S.tween(2.4,e=>{a.position.lerpVectors(st,en,e*e);a.rotation.z=e*2.4;});
   S.later(1600,()=>lab(S,'Digestive juice',()=>pp.world(0,V(0,.014,0)),{kind:'amber',lift:50}));}
  if(s===4){const a=pp.ant;a.visible=true;a.position.copy(pp.world(0,V(.004,.016,0)));pp.setXray(.85);
   cap(S,{pos:'left',cls:'compact',kicker:'The trap · step 3',big:'Digested for nutrients',mid:'The juices break the insect down, and the pitcher <b>absorbs its nutrients</b>. So the pitcher plant <b class="g">makes its own food</b> <i>and</i> gets <b>extra nutrients</b> from insects.'});
   S.tween(5,e=>a.scale.setScalar(1.7*Math.max(.05,1-e*.9)));
   S.panel(`<h3>Insectivorous plants</h3><h2>Two ways at once</h2><table class="t"><tr><td><b>Food (glucose)</b></td><td>Made by its green leaves — photosynthesis</td></tr><tr><td><b>Extra nutrients</b> (nitrogen)</td><td>From insects trapped and digested in the pitcher</td></tr><tr><td><b>Other examples</b></td><td>Venus flytrap, sundew, bladderwort</td></tr></table>`,{side:'right',cls:'auto'});}}});
B.push({id:'symb',sec:'Nutrition',title:'4 · Symbiotic relationship',steps:1,shot:{p:[-.15,.42,1.15],t:[0,.17,0],fov:38,dur:3.2},notes:'Lichens grow as patches on rocks and tree bark — look for them on old walls near school.',
 enter(S){gReset(S,{nut:true});},
 step(S,s){s=3;
  if(s===3){cap(S,{pos:'left',cls:'compact',kicker:'4 · Symbiotic relationship',big:'Living together, helping each other',mid:'In a <b>lichen</b>, an <b class="g">alga</b> (has chlorophyll) makes food, and a <b class="a">fungus</b> gives it shelter, water and minerals. <b>Rhizobium</b> bacteria live in the roots of pulse plants (gram, peas, moong) — they give the plant nitrogen and get food in return.'});
   S.panel(`<h3>Summary</h3><h2>Modes of nutrition</h2><table class="t"><tr><th>Mode</th><th>How food is obtained</th><th>Example</th></tr><tr><td><b>Autotrophic</b></td><td>Makes its own food (photosynthesis)</td><td>Green plants</td></tr><tr><td><b>Heterotrophic</b></td><td>Depends on others for food</td><td>Animals, humans, fungi</td></tr><tr><td><b>Parasitic</b></td><td>Takes food from a living host</td><td>Cuscuta</td></tr><tr><td><b>Saprotrophic</b></td><td>Feeds on dead, decaying matter</td><td>Mushroom, bread mould</td></tr><tr><td><b>Insectivorous</b></td><td>Makes food + traps insects for extra nutrients</td><td>Pitcher plant</td></tr><tr><td><b>Symbiotic</b></td><td>Two organisms live together and help each other</td><td>Lichen, Rhizobium</td></tr></table>`,{side:'right',cls:'auto'});}}});
const MC=[['Mango tree','Autotrophic'],['Cow','Heterotrophic'],['Mushroom','Saprotrophic'],['Cuscuta (amarbel)','Parasitic'],['Pitcher plant','Insectivorous'],['Lichen','Symbiotic'],['Human','Heterotrophic'],['Bread mould','Saprotrophic']];
const MO=['Autotrophic','Heterotrophic','Parasitic','Saprotrophic','Insectivorous','Symbiotic'];
B.push({id:'modecheck',sec:'Nutrition',title:'Check: which mode?',steps:1,shot:{p:[-.6,.6,1.6],t:[0,.3,0],fov:36,dur:3},notes:'Call students one by one to choose the mode for each card.',
 enter(S){gReset(S,{nut:true});},
 step(S){let sc=0;const p=S.panel(`<h3>Quick check <span class="score" id="mcs">0 / ${MC.length}</span></h3><h2>Which mode of nutrition?</h2><div class="items">${MC.map(([n],i)=>`<div class="item" data-i="${i}"><b>${n}</b><div class="bb">${MO.map(m=>`<button data-m="${m}">${m}</button>`).join('')}</div><div class="fb"></div></div>`).join('')}</div>`,{side:'center',cls:'practice'});
  p.querySelectorAll('.item').forEach(it=>{const ans=MC[+it.dataset.i][1];it.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(it.classList.contains('ok')||it.classList.contains('no'))return;const ok=b.dataset.m===ans;it.classList.add(ok?'ok':'no');if(ok)sc++;it.querySelector('.fb').innerHTML=ok?'Correct!':`It is <b>${ans}</b>`;p.querySelector('#mcs').textContent=`${sc} / ${MC.length}`;});});}});
/* ================= HOW PLANTS GROW ================= */
B.push({id:'grow',sec:'How plants grow',title:'Time-lapse: 60 days',steps:3,shot:{p:[.85,.62,1.45],t:[0,.32,0],fov:32,dur:3},
 notes:'Watch the time-lapse. Ask students to call out every change they see. Link to Grade 6: all living beings grow and need food.',
 enter(S){gReset(S,{growth:.12});},
 step(S,s){const g=S.worlds.garden,h=g.hero;
  if(s===0){const c=cap(S,{pos:'left',cls:'compact',kicker:'Time-lapse',html:'<div class="daycount">Day <b id="dc">1</b></div>',big:'Watch it grow',mid:'Every day the sun rises and sets. Day by day, the plant changes.'});
   S.tween(13,(e,k)=>{h.setGrowth(lerp(.12,1,k));const day=Math.round(1+k*59);const d=document.getElementById('dc');if(d)d.textContent=day;const ph=k*9;g.setSun(Math.max(-6,Math.sin((ph%1)*Math.PI)*48-6),120+(ph%1)*190);},()=>g.setSun(32,215));}
  if(s===1){h.setGrowth(1);g.setSun(32,215);cap(S,{pos:'left',cls:'compact',kicker:'What changed?',big:'Four changes',mid:'<b class="g">New leaves</b> emerge · <b class="g">branches</b> develop · its <b class="a">height</b> increases · its <b class="s">stem</b> thickens.'});
   lab(S,'New leaves',leafP(20),{kind:'bio',lift:40});lab(S,'Branch',()=>h.stemWorld(.45),{kind:'bio',lift:60,delay:600});lab(S,'Height',()=>h.stemWorld(1),{kind:'amber',lift:30,delay:900});lab(S,'Stem thickens',()=>h.stemWorld(.06),{kind:'soil',lift:70,delay:1200});}
  if(s===2){cap(S,{pos:'left',cls:'compact',kicker:'Think',big:'What do plants need to grow?',mid:'Food gives carbohydrates, fats, proteins, vitamins and minerals. Along with <b class="b">water</b>, these are essential for growth.'});}}});
B.push({id:'ideas',sec:'How plants grow',title:'Four explanations',steps:2,shot:{p:[-.75,.55,1.2],t:[0,.32,0],fov:32,dur:3},
 notes:'Read each idea aloud and let students vote. Do <b>not</b> correct the “food from soil” idea yet — the chapter tests it.',
 enter(S){gReset(S);},
 step(S,s){if(s===0)cap(S,{pos:'center',kicker:'What do you think?',big:'Four explanations',html:`<div class="steps5"><div><b>Water</b><span>“When we water plants regularly, they grow better.”</span></div><div style="--c:var(--soil)"><b>Soil</b><span>“Maybe plants take up food from the soil through their roots.”</span></div><div style="--c:var(--amber)"><b>Sunlight</b><span>“I think sunlight plays some role.”</span></div><div style="--c:var(--uv)"><b>Something else?</b><span>“I think, maybe, ____ plays some role!”</span></div></div>`});
  if(s===1)cap(S,{pos:'center',cls:'stmt',kicker:'Scientists test ideas',big:'Let’s experiment.',mid:'Guessing is the start. An experiment tells us which explanation is right.'});}});
B.push({id:'pots',sec:'How plants grow',title:'Activity 10.1 — Three pots',steps:3,shot:{p:[2.4,.62,1.6],t:[2.4,.16,.55],fov:36,dur:3.2},
 notes:'Have every student predict before you press Next. The real experiment needs two weeks — plan ahead and keep a daily record (height, number and colour of leaves).',
 enter(S){gReset(S);this.pred={};},
 step(S,s){const g=S.worlds.garden,[A,Bp,C]=g.pots;
  if(s===0){cap(S,{pos:'low',cls:'compact',kicker:'Activity 10.1 · Let us test some explanations',big:'Three pots, three conditions',mid:'Similar chilli or tomato saplings. Same soil. Only sunlight and water change.'});
   lab(S,'Pot A',V(2.05,.32,.55),{kind:'bio',sub:'sunlight + water',lift:40});lab(S,'Pot B',V(2.4,.32,.55),{kind:'amber',sub:'sunlight · no water',lift:40,delay:500});lab(S,'Pot C',V(2.75,.5,.55),{kind:'abio',sub:'dark (box) + water',lift:30,delay:800});
   const p=S.panel(`<h3>Predict first</h3><h2>After two weeks…</h2>${['A','B','C'].map(k=>`<p><b>Pot ${k}</b><br>${['Grows well','Grows less','May die'].map(t=>`<button class="chipbtn" data-k="${k}">${t}</button>`).join('')}</p>`).join('')}<div class="status mid">Choose a prediction for each pot, then press → to fast-forward two weeks.</div>`,{side:'right',cls:'auto'});
   p.querySelectorAll('.chipbtn').forEach(b=>b.onclick=()=>{p.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach(x=>x.classList.toggle('on',x===b));this.pred[b.dataset.k]=b.textContent;});}
  if(s===1){S.closePanel();const c=cap(S,{pos:'low',cls:'compact',html:'<div class="daycount">Day <b id="dc2">1</b></div>',big:'Two weeks later…'});
   S.tween(7,(e,k)=>{const d=document.getElementById('dc2');if(d)d.textContent=Math.round(1+k*13);A.pl.setGrowth(lerp(.35,.8,k));Bp.pl.setDroop(k);Bp.pl.setTint('#a07a3a',k*.85);C.pl.setGrowth(lerp(.35,.5,k));C.pl.setTint('#dcd76a',k*.7);
    g.setSun(Math.max(-5,Math.sin(((k*7)%1)*Math.PI)*45-5),130+((k*7)%1)*170);},()=>{g.setSun(32,215);S.tween(1.6,e=>{g.darkBox.position.set(lerp(2.75,3.3,e),.25-.04*e,lerp(.55,.15,e));});
     lab(S,'Grew well',V(2.05,.42,.55),{kind:'bio',sub:'taller · more leaves · green',lift:30});lab(S,'Wilted',V(2.4,.28,.55),{kind:'red',sub:'may die without water',lift:40,delay:400});lab(S,'Less growth',V(2.75,.32,.55),{kind:'amber',sub:'pale / yellowish leaves',lift:40,delay:800});});}
  if(s===2){const pr=this.pred;cap(S,{pos:'low',cls:'compact',kicker:'Conclusion',big:'Sunlight <i>and</i> water',mid:'Plants require <b class="a">both sunlight</b> and <b class="b">water</b> for their growth.'});
   S.panel(`<h3>Table 10.1 · typical observations</h3><h2>Effect of sunlight and water</h2><table class="t"><tr><th>Pot</th><th>Sunlight</th><th>Water</th><th>After 2 weeks</th></tr>
    <tr><td><b>A</b></td><td>Yes</td><td>Yes</td><td>Grew the most, more new leaves, green</td></tr><tr><td><b>B</b></td><td>Yes</td><td>No</td><td>Drooped, leaves dried — may die</td></tr><tr><td><b>C</b></td><td>No</td><td>Yes</td><td>Less growth than A, pale/yellow leaves</td></tr></table>
    ${Object.keys(pr).length?`<div class="status good">Your predictions: ${['A','B','C'].map(k=>`<b>${k}</b> ${pr[k]||'—'}`).join(' · ')}</div>`:''}<p style="margin-top:12px">Your class results may differ slightly — record what <b>you</b> observe.</p>`,{side:'right',cls:'auto'});}}});
B.push({id:'vrik',sec:'How plants grow',title:'Fascinating fact: Vrikshayurveda',steps:1,shot:{p:[-.45,.55,.7],t:[0,.45,0],fov:30,dur:3.4},
 notes:'Connect with Indian knowledge traditions — careful observation, written down to guide farmers.',enter(S){gReset(S,{elev:14,az:250});},
 step(S){cap(S,{pos:'left',cls:'compact def',kicker:'Fascinating fact · Vrikshayurveda',big:'<span class="serif">फलकुसुमसंपदुचिता रोपणतो भवति केवलान्न यतः ।</span>',mid:'“Trees do not produce fruits and flowers merely because they are planted.” This ancient Indian text records observations about plant growth, soil and farming — like making organic manure from water, barley and green, black and horse grams.'});}});
/* ================= FOOD FACTORIES ================= */
B.push({id:'noteat',sec:'Food factories',title:'How do plants get food?',steps:2,shot:heroShot,notes:'Ask: <i>Where does a goat’s food come from? A tiger’s?</i> All food traces back to plants. But plants do not eat!',
 enter(S){gReset(S);},
 step(S,s){if(s===0)cap(S,{pos:'left',cls:'compact',kicker:'10.2 · How do plants get food?',big:'All food leads back to plants',mid:'Animals eat plants <b class="g">directly</b>, or eat animals that ate plants. <span class="tagline">plant → goat → tiger</span>'});
  if(s===1)cap(S,{pos:'left',cls:'compact',kicker:'But…',big:'Plants do not <span class="serif">eat</span> food.',mid:'So how do plants obtain the food they need to grow? The answer is hidden in the <b class="g">leaves</b>.'});}});
B.push({id:'leaf',sec:'Food factories',title:'Leaves: the food factories',steps:3,shot:S=>outside(S,15,.32,.1,30),
 notes:'Ask: why might leaves be broad and flat? (A large surface to receive sunlight.)',enter(S){gReset(S,{elev:40});},
 step(S,s){if(s===0){cap(S,{pos:'left',cls:'compact',kicker:'10.2.1 · Leaves',big:'Broad and flat',mid:'Leaves are generally <b>broad and flat</b> — a large surface to receive sunlight.'});lab(S,'Broad, flat leaf',leafP(15),{kind:'bio',lift:50});}
  if(s===1){cap(S,{pos:'left',cls:'compact',kicker:'Why green?',big:'Chlorophyll',mid:'Leaves are mostly green because of a green pigment called <b class="g">chlorophyll</b>. It helps capture <b class="a">sunlight</b> efficiently.'});lab(S,'Chlorophyll',leafP(15,0,.01,0),{kind:'bio',sub:'green pigment',lift:40,delay:200});}
  if(s===2){cap(S,{pos:'left',cls:'compact',kicker:'Stored food',big:'Starch',mid:'Plants store food as <b class="a">starch</b>, a type of carbohydrate — made in the leaves. That is why leaves are called the plant’s <b class="g">food factories</b>.'});S.fact('Turn a leaf over: the lower side is often paler. Most of the tiny pores (<b>stomata</b>) are on the <b>lower surface</b>.');}}});
B.push({id:'inside',sec:'Food factories',title:'Journey inside a leaf',world:'leaf',steps:3,from:{p:[0,10,30],t:[0,1.2,2.4],fov:44},shot:{p:[-.4,1.2,14],t:[-.4,1.2,2.4],fov:42,dur:5},
 notes:'We have shrunk down to see the inside of a leaf (magnified thousands of times). Point out the green beads — this is where chlorophyll is found.',
 enter(S){const w=S.worlds.leaf;w.glow=false;Object.values(w.mol).forEach(f=>f.set(false));w.shafts.forEach(s=>s.visible=false);w.starch.visible=false;w.glucose.forEach(m=>m.scale.setScalar(1e-4));},
 step(S,s){const sp=S.worlds.leaf.spots;
  if(s===0){cap(S,{pos:'low',cls:'compact',kicker:'Magnified thousands of times',big:'Inside a leaf',mid:'A leaf is made of tiny living <b class="g">cells</b>, packed in layers.'});lab(S,'Upper surface',sp.epi,{kind:'ink',lift:50});lab(S,'Long cells',sp.pal,{kind:'bio',sub:'packed below the top surface',lift:60,delay:500});lab(S,'Rounder cells',sp.spongy,{kind:'bio',sub:'with air spaces',lift:50,delay:900});}
  if(s===1){cap(S,{pos:'low',cls:'compact',kicker:'The green beads',big:'Chlorophyll is in here',mid:'The tiny green bodies inside the cells contain <b class="g">chlorophyll</b> — the pigment that captures sunlight.'});lab(S,'Green bodies with chlorophyll',sp.chl,{kind:'bio',lift:60});}
  if(s===2){cap(S,{pos:'top',kicker:'Pipes and pores',big:'Veins and tiny pores',mid:'A <b class="b">vein</b> brings water in. Tiny pores on the lower surface — <b class="g">stomata</b> — let air in and out.'});lab(S,'Vein',sp.vein,{kind:'abio',lift:50});lab(S,'Stoma (tiny pore)',sp.stoma,{kind:'bio',lift:50,side:'down',delay:500});}}});

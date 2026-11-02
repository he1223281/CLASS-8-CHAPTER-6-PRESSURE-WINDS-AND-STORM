'use strict';
/* ============ helpers ============ */
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function rng(seed){let s=seed>>>0||1;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}
function tween(ms,fn,done){let s=null,stop=false;function f(ts){if(stop)return;if(s===null)s=ts;const t=clamp((ts-s)/ms,0,1);fn(ease(t),t);if(t<1)requestAnimationFrame(f);else if(done)done();}requestAnimationFrame(f);return()=>{stop=true};}
function svgEl(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function hex2rgb(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function mix(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return'#'+A.map((v,i)=>Math.round(lerp(v,B[i],t)).toString(16).padStart(2,'0')).join('');}
function tweenAttr(els,attr,from,to,ms,done){els=[].concat(els).filter(Boolean);return tween(ms,e=>els.forEach(x=>x.setAttribute(attr,mix(from,to,e))),done);}
/* a cancellable bag of timers/tweens per slide */
function Bag(){const list=[];return{add(c){list.push(c);return c},later(ms,f){const id=setTimeout(f,ms);list.push(()=>clearTimeout(id));},tw(ms,fn,d){return this.add(tween(ms,fn,d))},clear(){list.splice(0).forEach(c=>c())}};}

/* ============ icons ============ */
const ICON={
 warn:'<svg viewBox="0 0 48 48"><path d="M24 4L45 42H3z" fill="#FF7A59"/><path d="M24 17v13" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="36" r="3" fill="#fff"/></svg>',
 sun:'<svg viewBox="0 0 64 64"><g stroke="#F5B300" stroke-width="4" stroke-linecap="round">'+[0,45,90,135,180,225,270,315].map(a=>`<line x1="32" y1="6" x2="32" y2="14" transform="rotate(${a} 32 32)"/>`).join('')+'</g><circle cx="32" cy="32" r="14" fill="url(#gSun)" stroke="#F5B300" stroke-width="2"/></svg>',
 drop:'<svg viewBox="0 0 64 64"><path d="M32 6C22 22 14 31 14 41a18 18 0 0036 0C50 31 42 22 32 6z" fill="#3B8EEA"/><path d="M24 42a8 8 0 006 8" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/></svg>',
 co2:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#97A1AC"/><text x="32" y="39" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" font-family="Inter,Segoe UI,sans-serif">CO₂</text></svg>',
 o2:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#4FD1E3"/><text x="32" y="39" text-anchor="middle" font-size="20" font-weight="800" fill="#fff" font-family="Inter,Segoe UI,sans-serif">O₂</text></svg>',
 leaf:'<svg viewBox="0 0 64 64"><path d="M8 50C10 22 30 8 58 8c0 28-16 46-44 44z" fill="url(#gLeaf)"/><path d="M10 52C24 38 36 26 50 16" stroke="#E8FFF0" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
 glucose:'<svg viewBox="0 0 64 64"><path d="M32 6l22 13v26L32 58 10 45V19z" fill="#F2A33A"/><text x="32" y="40" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" font-family="Inter,Segoe UI,sans-serif">C₆</text></svg>',
 energy:'<svg viewBox="0 0 64 64"><path d="M36 4L12 36h16l-4 24 26-34H34z" fill="#FFC21A" stroke="#E09A00" stroke-width="2" stroke-linejoin="round"/></svg>',
 bulb:'<svg viewBox="0 0 64 64"><circle cx="32" cy="26" r="17" fill="#FFD166"/><rect x="24" y="42" width="16" height="12" rx="3" fill="#97A1AC"/></svg>',
 eye:'<svg viewBox="0 0 64 64"><path d="M4 32s10-18 28-18 28 18 28 18-10 18-28 18S4 32 4 32z" fill="#E3EFFD" stroke="#3988E8" stroke-width="3"/><circle cx="32" cy="32" r="9" fill="#3988E8"/></svg>',
 ok:'<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="28" fill="#239B56"/><path d="M19 33l9 9 17-19" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 bad:'<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="28" fill="#E0475B"/><path d="M22 22l20 20M42 22L22 42" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>'
};
const ic=(k,s=48)=>ICON[k].replace('<svg ',`<svg width="${s}" height="${s}" `);
const CAUTION=t=>`<div class="caution">${ic('warn',44)}<div><b>Caution — </b>${t}</div></div>`;

/* ============ art ============ */
const ART={
 leafPath(L,W){return`M0 0C${L*.25} ${-W} ${L*.7} ${-W*.95} ${L} 0C${L*.7} ${W*.95} ${L*.25} ${W} 0 0Z`;},
 leaf(x,y,L,W,rot,fill='url(#gLeaf)',vein='#BFF0D0',extra=''){
  let v=`<path d="M2 0L${L*.94} 0" stroke="${vein}" stroke-width="${Math.max(1.2,W*.08)}" fill="none" stroke-linecap="round"/>`;
  for(let i=1;i<4;i++){const px=L*i/4.3;v+=`<path d="M${px} 0Q${px+L*.08} ${-W*.35} ${px+L*.16} ${-W*.6}M${px} 0Q${px+L*.08} ${W*.35} ${px+L*.16} ${W*.6}" stroke="${vein}" stroke-width="${Math.max(.8,W*.04)}" fill="none" opacity=".8"/>`;}
  return`<g transform="translate(${x} ${y}) rotate(${rot})" ${extra}><path d="${ART.leafPath(L,W)}" fill="${fill}"/>${v}</g>`;
 },
 sun(cx,cy,r,rays=true){
  let s=`<circle cx="${cx}" cy="${cy}" r="${r*2.6}" fill="url(#gSunGlow)"/>`;
  if(rays){s+=`<g class="spin" style="transform-origin:${cx}px ${cy}px">`;for(let a=0;a<360;a+=30)s+=`<path d="M${cx} ${cy-r*1.35}L${cx-r*.14} ${cy-r*1.9}L${cx+r*.14} ${cy-r*1.9}Z" fill="#FFC93D" transform="rotate(${a} ${cx} ${cy})"/>`;s+='</g>';}
  return s+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gSun)"/>`;
 },
 pot(x,y,w,h){ // x=center, y=top rim
  return`<g><path d="M${x-w*.42} ${y+h*.16}L${x-w*.32} ${y+h}H${x+w*.32}L${x+w*.42} ${y+h*.16}Z" fill="url(#gPot)"/><rect x="${x-w/2}" y="${y}" width="${w}" height="${h*.2}" rx="${h*.05}" fill="#C9653F"/><rect x="${x-w/2}" y="${y}" width="${w}" height="${h*.06}" rx="${h*.03}" fill="#E48A61"/></g>`;
 },
 /* potted / ground plant. g=growth 0..1, droop 0..1, col leaf colour, thin */
 plant(x,y,o={}){
  const g=o.g??.5,droop=o.droop||0,col=o.col||null,H=o.H||520,thin=o.thin||0;
  const h=50+H*g, sw=(3+14*g)*(1-thin*.45), stemC=col?mix('#2E9C57',col,.6):null;
  const top=[x+Math.sin(g*3)*6+droop*40,y-h*(1-droop*.35)];
  let s=`<path d="M${x} ${y}Q${x+droop*10} ${y-h*.55} ${top[0]} ${top[1]}" stroke="${stemC||'url(#gStem)'}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  const n=Math.floor(2+g*10), lf=col||'url(#gLeaf)';
  for(let i=0;i<n;i++){
   const t=(i+1)/(n+1), py=y-h*t*(1-droop*.35), px=x+(top[0]-x)*t*t, side=i%2?1:-1;
   const age=clamp((n-i)/4,.35,1), L=(40+70*g)*age*(1-thin*.2), W=L*.36;
   const rot=side<0?(-160+droop*95):(-20-droop*95);
   s+=ART.leaf(px,py,L,W,rot+(side<0?-droop*20:droop*20),lf,col?mix(col,'#ffffff',.4):'#BFF0D0');
  }
  if(g>.45&&!o.nobranch){const bg=clamp((g-.45)/.55,0,1);[[.45,-1],[.62,1]].forEach(([t,sd],k)=>{
    const bx=x+(top[0]-x)*t*t, by=y-h*t*(1-droop*.35), ex=bx+sd*150*bg, ey=by-110*bg+droop*60;
    s+=`<path d="M${bx} ${by}Q${bx+sd*60*bg} ${by-20*bg} ${ex} ${ey}" stroke="${stemC||'#2E9C57'}" stroke-width="${sw*.55}" fill="none" stroke-linecap="round"/>`;
    for(let j=1;j<=3;j++){const tt=j/3.2;s+=ART.leaf(bx+(ex-bx)*tt,by+(ey-by)*tt,55*bg+10,20*bg+5,(sd>0?-50:-130)+(j%2?-30:30)*sd+droop*(sd>0?60:-60),lf,col?mix(col,'#ffffff',.4):'#BFF0D0');}
  });}
  s+=`<circle cx="${top[0]}" cy="${top[1]}" r="${4+5*g}" fill="${col||'#7BDA9C'}"/>`;
  return s;
 },
 beaker(x,y,w,h,level,liq='url(#gWater)'){ // x,y top-left
  const ly=y+h*(1-level);
  return`<g><path d="M${x+6} ${ly}H${x+w-6}V${y+h-14}Q${x+w-6} ${y+h-4} ${x+w-16} ${y+h-4}H${x+16}Q${x+6} ${y+h-4} ${x+6} ${y+h-14}Z" fill="${liq}"/>
  <path d="M${x-6} ${y}H${x+6}V${y+h-14}Q${x+6} ${y+h} ${x+20} ${y+h}H${x+w-20}Q${x+w-6} ${y+h} ${x+w-6} ${y+h-14}V${y}H${x+w+6}" fill="url(#gGlass)" stroke="#8FB3D4" stroke-width="4" stroke-linejoin="round"/>
  <path d="M${x+18} ${y+24}V${y+h-30}" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/></g>`;
 },
 hexPath(r){let d='';for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;d+=(i?'L':'M')+(r*Math.cos(a)).toFixed(1)+' '+(r*Math.sin(a)).toFixed(1);}return d+'Z';},
 mol(kind,r){ // molecule glyph centred at 0,0
  const f="Inter,Segoe UI,sans-serif";
  if(kind==='water')return`<path d="M0 ${-r*1.3}C${-r*.6} ${-r*.3} ${-r} ${r*.1} ${-r} ${r*.45}A${r} ${r} 0 0 0 ${r} ${r*.45}C${r} ${r*.1} ${r*.6} ${-r*.3} 0 ${-r*1.3}Z" fill="#3B8EEA"/><circle cx="${-r*.35}" cy="${r*.35}" r="${r*.22}" fill="#fff" opacity=".7"/>`;
  if(kind==='mineral')return`<rect x="${-r*.7}" y="${-r*.7}" width="${r*1.4}" height="${r*1.4}" rx="${r*.3}" fill="#B16AE0" transform="rotate(45)"/>`;
  if(kind==='co2')return`<circle r="${r}" fill="#97A1AC"/><text y="${r*.36}" text-anchor="middle" font-size="${r*.95}" font-weight="800" fill="#fff" font-family="${f}">CO₂</text>`;
  if(kind==='o2')return`<circle r="${r}" fill="#4FD1E3"/><text y="${r*.38}" text-anchor="middle" font-size="${r*1.05}" font-weight="800" fill="#fff" font-family="${f}">O₂</text>`;
  if(kind==='food')return`<path d="${ART.hexPath(r)}" fill="#F2A33A" stroke="#D9861A" stroke-width="${r*.12}"/>`;
  if(kind==='energy')return`<path d="M${r*.2} ${-r*1.1}L${-r*.8} ${r*.2}H${-r*.05}L${-r*.3} ${r*1.1}L${r*.8} ${-r*.25}H${r*.05}Z" fill="#FFC21A"/>`;
  if(kind==='bubble')return`<circle r="${r}" fill="rgba(255,255,255,.55)" stroke="#fff" stroke-width="${Math.max(1,r*.2)}"/>`;
  if(kind==='photon')return`<circle r="${r}" fill="#FFE27A" filter="url(#fGlow)"/>`;
  return`<circle r="${r}" fill="#999"/>`;
 }
};

/* Particles that travel along an SVG path */
class Flow{
 constructor(path,o={}){
  this.path=path;this.o=Object.assign({n:10,r:8,kind:'water',speed:.18,jitter:0,fade:.12,dir:1},o);
  this.g=svgEl('g',{'pointer-events':'none'});(o.into||path.parentNode).appendChild(this.g);
  const R=rng(o.seed||7);this.ps=[];
  for(let i=0;i<this.o.n;i++){const e=svgEl('g',{},this.g);e.innerHTML=ART.mol(this.o.kind,this.o.r);this.ps.push({e,u:i/this.o.n,j:(R()-.5)*this.o.jitter,s:.85+R()*.3});}
  this.on=o.on!==false;this.alpha=this.on?1:0;this.len=0;
 }
 set(v){this.on=v;}
 tick(dt){
  if(!this.len)this.len=this.path.getTotalLength();
  this.alpha=clamp(this.alpha+(this.on?dt*2.5:-dt*2.5),0,1);this.g.style.opacity=this.alpha;
  if(this.alpha<=0)return;
  const L=this.len,f=this.o.fade;
  for(const p of this.ps){p.u=(p.u+dt*this.o.speed*p.s)%1;const u=this.o.dir>0?p.u:1-p.u;const pt=this.path.getPointAtLength(u*L);
   const a=Math.min(1,p.u/f,(1-p.u)/f);p.e.setAttribute('transform',`translate(${pt.x+p.j} ${pt.y+p.j*.5})`);p.e.setAttribute('opacity',a.toFixed(2));}
 }
}

/* ============ slide registry & navigation ============ */
const SLIDES=[];const S=o=>SLIDES.push(o);
const APP={i:0,step:0,max:0,els:[]};
function maxStep(el,o){let m=o.steps||0;$$('[data-s]',el).forEach(e=>m=Math.max(m,+e.dataset.s));return m;}
function applyStep(){
 const el=APP.els[APP.i],o=SLIDES[APP.i];
 $$('[data-s]',el).forEach(e=>e.classList.toggle('on',+e.dataset.s<=APP.step));
 if(o.onStep)o.onStep(el,APP.step,o);
 const d=$('#stepdots');d.innerHTML='';for(let k=1;k<=APP.max;k++){const i=document.createElement('i');if(k<=APP.step)i.className='on';d.appendChild(i);}
}
function build(){
 const box=$('#slides');box.innerHTML='';APP.els=[];
 SLIDES.forEach((o,i)=>{const el=document.createElement('section');el.className='slide'+(o.cls?' '+o.cls:'');el.id='s-'+o.id;
  el.innerHTML=(o.bare?'':`<div class="kicker">${o.sec}</div><h2 class="t">${o.head||o.title}</h2>`)+o.html;
  box.appendChild(el);APP.els.push(el);o._bag=Bag();if(o.init)o.init(el,o);});
 const tl=$('#toclist');tl.innerHTML='';let last='';
 SLIDES.forEach((o,i)=>{if(o.sec!==last){last=o.sec;const h=document.createElement('div');h.className='tsec';h.textContent=o.sec;tl.appendChild(h);}
  const b=document.createElement('button');b.className='titem';b.innerHTML=`<span>${i+1}</span>${o.title}`;b.onclick=()=>{go(i);toc(false)};tl.appendChild(b);});
}
function go(i,dir,showAll){
 i=clamp(i,0,SLIDES.length-1);const prev=APP.els[APP.i],po=SLIDES[APP.i];
 if(prev&&prev.classList.contains('active')&&po){po._bag.clear();if(po.leave)po.leave(prev,po);prev.classList.remove('active','in-fwd','in-back','in-zoom');}
 APP.i=i;const el=APP.els[i],o=SLIDES[i];
 el.classList.add('active',o.zoom&&dir!=='back'?'in-zoom':dir==='back'?'in-back':'in-fwd');
 APP.max=maxStep(el,o);APP.step=showAll?APP.max:0;
 if(o.enter)o.enter(el,o);applyStep();
 $('#count').textContent=`${i+1} / ${SLIDES.length}`;$('#secname').textContent=o.sec+'  ·  '+o.title;
 $('#prog').style.width=((i+1)/SLIDES.length*100)+'%';
 $('#notetext').innerHTML=o.notes||'Let students observe and discuss before you click Next.';
 $$('.titem').forEach((b,k)=>b.classList.toggle('cur',k===i));
 try{history.replaceState(null,'','#'+(i+1))}catch(e){}
}
function next(){const o=SLIDES[APP.i];if(o.onNext&&o.onNext(APP.els[APP.i],o))return;if(APP.step<APP.max){APP.step++;applyStep();}else if(APP.i<SLIDES.length-1)go(APP.i+1,'fwd');}
function prev(){if(APP.step>0){APP.step--;applyStep();}else if(APP.i>0)go(APP.i-1,'back',true);}
function toc(v){$('#toc').classList.toggle('open',v);$('#scrim').classList.toggle('on',v);}
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);$('#stage').style.transform=`translate(${(innerWidth-1920*s)/2}px,${(innerHeight-1080*s)/2}px) scale(${s})`;}
function fullscreen(){const d=document;if(!d.fullscreenElement&&!d.webkitFullscreenElement){const r=d.documentElement;(r.requestFullscreen||r.webkitRequestFullscreen).call(r).catch?.(()=>{});}else{(d.exitFullscreen||d.webkitExitFullscreen).call(d);}}
function restart(){SLIDES[APP.i]._bag.clear();if(SLIDES[APP.i].leave)SLIDES[APP.i].leave(APP.els[APP.i],SLIDES[APP.i]);APP.els[APP.i].classList.remove('active');APP.i=0;build();go(0);}
function boot(){
 build();fit();addEventListener('resize',fit);
 $('#b-next').onclick=next;$('#b-prev').onclick=prev;$('#b-home').onclick=()=>go(0,'back');
 $('#b-toc').onclick=()=>toc(!$('#toc').classList.contains('open'));$('#tocx').onclick=()=>toc(false);$('#scrim').onclick=()=>toc(false);
 $('#b-notes').onclick=()=>$('#notes').classList.toggle('open');$('#b-full').onclick=fullscreen;
 $('#b-restart').onclick=()=>{if(confirm('Restart the presentation from the beginning? (Quiz score will be reset.)'))restart();};
 const fsc=()=>{$('#fulltxt').textContent=(document.fullscreenElement||document.webkitFullscreenElement)?'Exit full':'Fullscreen';};
 document.addEventListener('fullscreenchange',fsc);document.addEventListener('webkitfullscreenchange',fsc);
 addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.altKey||e.ctrlKey||e.metaKey)return;
  const k=e.key;
  if(k==='ArrowRight'||k==='PageDown'||k===' '||k==='Enter'&&e.target===document.body){e.preventDefault();next();}
  else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();prev();}
  else if(k==='Home'){go(0,'back');}else if(k==='End'){go(SLIDES.length-1);}
  else if(k==='f'||k==='F'){fullscreen();}else if(k==='n'||k==='N'){$('#notes').classList.toggle('open');}
  else if(k==='c'||k==='C'){toc(!$('#toc').classList.contains('open'));}
  else if(k==='Escape'){toc(false);$('#notes').classList.remove('open');}
 });
 /* buttons inside slides should not steal Space/Enter focus */
 document.addEventListener('mouseup',()=>{const a=document.activeElement;if(a&&a.tagName==='BUTTON')a.blur();});
 let last=performance.now();(function loop(ts){const dt=Math.min(.05,(ts-last)/1000);last=ts;const o=SLIDES[APP.i];if(o&&o.tick)o.tick(dt,ts/1000,APP.els[APP.i],o);requestAnimationFrame(loop);})(last);
 const h=parseInt(location.hash.slice(1));go(h>0?h-1:0);
}

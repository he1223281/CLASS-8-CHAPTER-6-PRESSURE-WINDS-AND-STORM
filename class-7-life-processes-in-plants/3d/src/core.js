import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {V,lerp,clamp,ease} from './lib.js';
const $=s=>document.querySelector(s);
const GRADE={uniforms:{tDiffuse:{value:null},uT:{value:0},uVig:{value:.34},uGrain:{value:.035},uSat:{value:1.06},uCon:{value:1.04}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uVig,uGrain,uSat,uCon;varying vec2 vUv;
 float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 col=c.rgb;float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,uSat);col=(col-.5)*uCon+.5;
 vec2 d=vUv-.5;col*=1.-uVig*smoothstep(.25,.85,length(d*vec2(1.15,1.)));col+=(h(vUv*vec2(1920.,1080.)+fract(uT)*91.)-.5)*uGrain;gl_FragColor=vec4(col,1.);}`};

export const Q={high:{dpr:1.5,samples:4,grass:110000,leaves:1,shadow:2048,bloom:true},low:{dpr:1,samples:0,grass:30000,leaves:.45,shadow:1024,bloom:true}};

/* ---------------- camera rig ---------------- */
class Rig{constructor(cam){this.cam=cam;this.p=V(0,1,3);this.t=V();this.fov=38;this.tw=null;this.orbit=0;this.drift=1;this._t=V();}
 cut(s){this.tw=null;this.p.set(...s.p);this.t.set(...s.t);this.fov=s.fov||this.fov;this.orbit=s.orbit||0;}
 fly(s){const p0=this.p.clone(),t0=this.t.clone(),f0=this.fov,p1=V(...s.p),t1=V(...s.t),f1=s.fov||f0,arc=s.arc||0;this.orbit=s.orbit||0;
  this.tw={k:0,dur:s.dur??2.8,fn:e=>{this.p.lerpVectors(p0,p1,e);if(arc)this.p.y+=Math.sin(e*Math.PI)*arc;this.t.lerpVectors(t0,t1,e);this.fov=lerp(f0,f1,e);}};}
 zoom(f,dur=1.6){const f0=this.fov;this.tw={k:0,dur,fn:e=>this.fov=lerp(f0,f,e)};}
 update(dt,time){if(this.tw){this.tw.k=Math.min(1,this.tw.k+dt/this.tw.dur);this.tw.fn(ease(this.tw.k));if(this.tw.k>=1)this.tw=null;}
  if(this.orbit&&!this.tw){const dx=this.p.x-this.t.x,dz=this.p.z-this.t.z,a=this.orbit*dt,c=Math.cos(a),s=Math.sin(a);this.p.x=this.t.x+dx*c-dz*s;this.p.z=this.t.z+dx*s+dz*c;}
  const d=this.p.distanceTo(this.t),a=d*.0045*this.drift;
  this.cam.position.set(this.p.x+Math.sin(time*.31)*a,this.p.y+Math.sin(time*.23)*a*.6,this.p.z+Math.cos(time*.27)*a);
  this._t.set(this.t.x+Math.sin(time*.19)*a*.3,this.t.y+Math.sin(time*.29)*a*.3,this.t.z);this.cam.lookAt(this._t);
  if(Math.abs(this.cam.fov-this.fov)>1e-3){this.cam.fov=this.fov;this.cam.updateProjectionMatrix();}}}

/* ---------------- engine ---------------- */
export function createEngine({worlds,beats,sections}){
 const canvas=$('#gl');let qual=localStorage.getItem('lpq')||'high';try{}catch(e){}
 const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance',stencil:false});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;
 const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.002,600);
 const rig=new Rig(camera);
 const rt=new THREE.WebGLRenderTarget(innerWidth,innerHeight,{type:THREE.HalfFloatType,samples:Q[qual].samples});
 const composer=new EffectComposer(renderer,rt);const rp=new RenderPass(new THREE.Scene(),camera);composer.addPass(rp);
 const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.35,.6,.85);composer.addPass(bloom);
 composer.addPass(new OutputPass());const grade=new ShaderPass(GRADE);composer.addPass(grade);
 function resize(){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,Q[qual].dpr);renderer.setPixelRatio(dpr);composer.setPixelRatio(dpr);renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 addEventListener('resize',resize);resize();

 /* ---------------- UI ---------------- */
 const caps=$('#caps'),labelsEl=$('#labels'),panels=$('#panels');let labels=[],bag=[],fx=[];
 const S={THREE,V,rig,camera,renderer,worlds,engine:null,
  caption(o){$$caps();const d=document.createElement('div');d.className=`cap pos-${o.pos||'low'} ${o.cls||''}`;
   d.innerHTML=(o.kicker?`<div class="kick">${o.kicker}</div>`:'')+(o.big?`<div class="big">${o.big}</div>`:'')+(o.mid?`<div class="mid">${o.mid}</div>`:'')+(o.html||'')+(o.small?`<div class="small">${o.small}</div>`:'');
   caps.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('on')));return d;},
  fact(html,pos='fact'){const old=caps.querySelector('.factcard');if(old){old.classList.remove('on');old.classList.add('off');setTimeout(()=>old.remove(),800);}
   const d=document.createElement('div');d.className=`cap factcard pos-${pos}`;d.innerHTML=`<div class="fk"><i></i>Did you know?</div><div class="ft">${html}</div>`;caps.appendChild(d);setTimeout(()=>d.classList.add('on'),900);return d;},
  label(text,pos,o={}){const el=document.createElement('div');el.className=`lbl k-${o.kind||'ink'} ${o.side==='down'?'down':''}`;el.style.setProperty('--lift',(o.lift??46)+'px');
   el.innerHTML=`<div class="stem" style="height:${o.lift??46}px"></div><div class="dot"></div><div class="tx"><b>${text}</b>${o.sub?`<em>${o.sub}</em>`:''}</div>`;labelsEl.appendChild(el);
   const L={el,pos,on:false};labels.push(L);setTimeout(()=>{L.on=true;},o.delay??300);return L;},
  clearLabels(){labels.forEach(L=>{L.el.classList.remove('on');setTimeout(()=>L.el.remove(),500);});labels=[];},
  panel(html,o={}){panels.querySelectorAll('.panel').forEach(p=>{p.classList.remove('on');setTimeout(()=>p.remove(),700);});
   const d=document.createElement('div');d.className=`panel side-${o.side||'right'} ${o.cls||''}`;d.innerHTML=html;panels.appendChild(d);setTimeout(()=>d.classList.add('on'),o.delay??200);return d;},
  closePanel(){panels.querySelectorAll('.panel').forEach(p=>{p.classList.remove('on');setTimeout(()=>p.remove(),700);});},
  addFx(f){fx.push(f);return f;},
  tween(dur,fn,done){const T={k:0,dur,fn,done};bag.push(T);return T;},
  later(ms,fn){const id=setTimeout(fn,ms);bag.push({cancel:()=>clearTimeout(id)});},
  scope(on,html=''){const sc=$('#scope');if(html)$('#scopeIn').innerHTML=html;sc.classList.toggle('on',on);}
 };
 function $$caps(){caps.querySelectorAll('.cap:not(.factcard)').forEach(c=>{c.classList.remove('on');c.classList.add('off');setTimeout(()=>c.remove(),900);});}
 function clearAll(){$$caps();const f=caps.querySelector('.factcard');if(f){f.classList.remove('on');setTimeout(()=>f.remove(),700);}S.clearLabels();S.closePanel();S.scope(false);
  bag.forEach(b=>b.cancel&&b.cancel());bag=[];fx.forEach(f=>f.dispose&&f.dispose());fx=[];}

 /* ---------------- beats ---------------- */
 let cur=-1,step=0,world=null;const fade=$('#fade');
 function setWorld(name){if(world&&world.name===name)return;if(world&&world.exit)world.exit(S);world=worlds[name];S.w=world;rp.scene=world.scene;
  renderer.toneMappingExposure=world.exposure??1;bloom.strength=world.bloom?.[0]??.35;bloom.radius=world.bloom?.[1]??.6;bloom.threshold=world.bloom?.[2]??.85;
  if(world.enter)world.enter(S);}
 function enterBeat(i,replay=0){const b=beats[i];clearAll();if(cur>=0&&beats[cur].exit)beats[cur].exit(S);
  const sameWorld=world&&world.name===(b.world||'garden');cur=i;step=0;
  const go2=()=>{setWorld(b.world||'garden');if(b.enter)b.enter(S);const R=x=>typeof x==='function'?x(S):x,shot=R(b.shot),from=R(b.from);if(!sameWorld||b.cut)rig.cut(from||shot);if(shot&&(sameWorld&&!b.cut||from))rig.fly(shot);
   if(b.step)b.step(S,0);for(let k=1;k<=replay;k++){step=k;if(!b.keepLabels)S.clearLabels();b.step(S,k);}updNav();};
  if(!sameWorld&&world){fade.classList.add('on');setTimeout(()=>{go2();setTimeout(()=>fade.classList.remove('on'),120);},650);}else go2();
  try{history.replaceState(null,'','#'+b.id)}catch(e){}}
 function next(){const b=beats[cur];if(b.onNext&&b.onNext(S,step))return;if(step<(b.steps||1)-1){step++;if(!b.keepLabels)S.clearLabels();b.step&&b.step(S,step);updNav();}else if(cur<beats.length-1)enterBeat(cur+1);}
 function prev(){if(step>0)enterBeat(cur,step-1);else if(cur>0)enterBeat(cur-1,(beats[cur-1].steps||1)-1);}
 /* ---------------- nav ---------------- */
 const secEl=$('#sections');secEl.innerHTML=sections.map((s,i)=>`<button class="sec" data-i="${i}"><span class="bar"><i></i></span><span class="nm">${s}</span></button>`).join('');
 secEl.querySelectorAll('.sec').forEach(b=>b.onclick=()=>enterBeat(beats.findIndex(x=>x.sec===sections[+b.dataset.i])));
 const idx=$('#idxList');idx.innerHTML=sections.map(s=>`<div class="ix-sec"><h4>${s}</h4>${beats.map((b,i)=>b.sec===s?`<button data-i="${i}">${b.title}</button>`:'').join('')}</div>`).join('');
 idx.querySelectorAll('button').forEach(b=>b.onclick=()=>{enterBeat(+b.dataset.i);$('#idx').classList.remove('open');});
 function updNav(){const b=beats[cur];$('#beatTitle').textContent=b.title;$('#count').textContent=`${cur+1} / ${beats.length}`;
  const si=sections.indexOf(b.sec);secEl.querySelectorAll('.sec').forEach((e,i)=>{e.classList.toggle('cur',i===si);const ids=beats.map((x,k)=>x.sec===sections[i]?k:-1).filter(k=>k>=0);
   const done=ids.filter(k=>k<cur).length+(i===si?(step+1)/(b.steps||1):0);e.querySelector('i').style.width=(done/ids.length*100)+'%';});
  $('#prev').disabled=cur===0&&step===0;document.body.classList.toggle('more',step<(b.steps||1)-1);
  idx.querySelectorAll('button').forEach(x=>x.classList.toggle('cur',+x.dataset.i===cur));$('#noteTx').innerHTML=b.notes||'Pause here. Ask the class what they notice before moving on.';}
 $('#next').onclick=next;$('#prev').onclick=prev;$('#bIdx').onclick=()=>$('#idx').classList.toggle('open');$('#bNotes').onclick=()=>$('#notes').classList.toggle('on');
 const fs=()=>{const d=document;if(!d.fullscreenElement)d.documentElement.requestFullscreen?.().catch(()=>{});else d.exitFullscreen?.();};$('#bFull').onclick=fs;
 const setQ=q=>{qual=q;try{localStorage.setItem('lpq',q)}catch(e){};resize();Object.values(worlds).forEach(w=>w.quality&&w.quality(Q[q]));$('#bQ').textContent=q==='high'?'Quality: High':'Quality: Fast';};
 $('#bQ').onclick=()=>setQ(qual==='high'?'low':'high');
 $('#bHome').onclick=()=>enterBeat(0);
 addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;const k=e.key;
  if(k==='ArrowRight'||k==='PageDown'||k===' '){e.preventDefault();next();}else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();prev();}
  else if(k==='f'||k==='F')fs();else if(k==='i'||k==='I'||k==='c'||k==='C')$('#idx').classList.toggle('open');else if(k==='n'||k==='N')$('#notes').classList.toggle('on');
  else if(k==='Home')enterBeat(0);else if(k==='q'||k==='Q')setQ(qual==='high'?'low':'high');else if(k==='Escape'){$('#idx').classList.remove('open');$('#notes').classList.remove('on');}});
 document.addEventListener('mouseup',()=>{const a=document.activeElement;if(a&&a.tagName==='BUTTON')a.blur();});
 let idleT=0;addEventListener('mousemove',()=>{idleT=0;document.body.classList.remove('idle');});
 /* ---------------- loop ---------------- */
 const clock=new THREE.Clock();let fpsAcc=0,fpsN=0,fpsChecked=false,el=0;const pv=V();
 function frame(){requestAnimationFrame(frame);try{frameBody();}catch(e){console.error(e);}}
 function frameBody(){const dt=Math.min(clock.getDelta(),window.__DTMAX||.05);el+=dt;idleT+=dt;if(idleT>4&&!$('#idx').classList.contains('open'))document.body.classList.add('idle');
  rig.update(dt,el);bag=bag.filter(T=>{if(!T.fn)return true;T.k=Math.min(1,T.k+dt/T.dur);T.fn(ease(T.k),T.k);if(T.k>=1){T.done&&T.done();return false;}return true;});
  fx.forEach(f=>f.update&&f.update(dt,el));if(world){world.update&&world.update(dt,el,S);const b=beats[cur];b&&b.update&&b.update(S,dt,el);}
  grade.uniforms.uT.value=el;composer.render(dt);
  const w=innerWidth,h=innerHeight;for(const L of labels){const p=typeof L.pos==='function'?L.pos(S):L.pos;pv.copy(p).project(camera);
   const vis=L.on&&pv.z<1&&Math.abs(pv.x)<1.1&&Math.abs(pv.y)<1.1;L.el.classList.toggle('on',vis);L.el.style.transform=`translate(${(pv.x*.5+.5)*w}px,${(-pv.y*.5+.5)*h}px)`;}
  if(!fpsChecked&&el>4){fpsAcc+=dt;fpsN++;if(fpsAcc>4){fpsChecked=true;const fps=fpsN/fpsAcc;if(fps<26&&qual==='high'&&!localStorage.getItem('lpq'))setQ('low');}}}
 S.engine={next,prev,go:enterBeat,get index(){return cur},get step(){return step}};
 return{S,start(){Object.values(worlds).forEach(w=>w.quality&&w.quality(Q[qual]));$('#bQ').textContent=qual==='high'?'Quality: High':'Quality: Fast';
  const id=location.hash.slice(1),k=beats.findIndex(b=>b.id===id);enterBeat(k>0?k:0);requestAnimationFrame(frame);},renderer,composer,camera};
}

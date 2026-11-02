import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {V,rng,lerp,clamp,curve,taperTube,lathe,woodTex,canvasTex,glassMat,liquidMat,leafGeometry,paintLeaf,potTex,tintable} from '../lib.js';
import {makePlant,makePot} from '../plant.js';
import {Bubbles,Drift,Flow,molMesh} from '../fx.js';
export const X={starch:0,vari:1.4,co2:2.8,oxy:4.25,peel:5.7,ink:7.1,resp:8.55,jar:10};
/* leaf with a repaintable texture; state={base,patch,halfA,halfB,spots} */
export function paintedLeaf(len,width,opt={}){const tex=canvasTex(512,256,()=>{});const m=new THREE.MeshStandardMaterial({map:tex,roughness:.75,side:THREE.DoubleSide});
 const mesh=new THREE.Mesh(leafGeometry({len,width,cup:opt.cup??.05,curl:opt.curl??.02,segU:20,segV:10}),m);mesh.castShadow=true;mesh.receiveShadow=true;
 const st=Object.assign({base:'#3d9a48',patch:null,margin:null,halfA:null,halfB:null,split:.5,spots:0,spotC:'#b9782f',vein:'rgba(220,255,200,.55)'},opt.state||{});
 mesh.paint=(s={})=>{Object.assign(st,s);tex.redraw((g,w,h)=>{g.clearRect(0,0,w,h);
   if(st.halfA){g.fillStyle=st.halfA;g.fillRect(0,0,w*st.split,h);g.fillStyle=st.halfB;g.fillRect(w*st.split,0,w,h);}else{g.fillStyle=st.margin||st.base;g.fillRect(0,0,w,h);}
   if(st.patch){g.fillStyle=st.patch;g.beginPath();const N=40;for(let i=0;i<=N;i++){const u=i/N,x=.1+.78*u,y=.5-(.26*Math.sin(Math.PI*u)**.7)*(1+.18*Math.sin(u*Math.PI*3+.6));i?g.lineTo(w*x,h*y):g.moveTo(w*x,h*.5);}for(let i=N;i>=0;i--){const u=i/N,x=.1+.78*u,y=.5+(.26*Math.sin(Math.PI*u)**.7)*(1+.18*Math.sin(u*Math.PI*2.5+2.1));g.lineTo(w*x,h*y);}g.closePath();g.fill();}
   const R=rng(5);g.globalAlpha=.18;for(let i=0;i<500;i++){g.fillStyle=R()>.5?'#000':'#fff';g.fillRect(R()*w,R()*h,2,2);}g.globalAlpha=1;
   g.strokeStyle=st.vein;g.lineWidth=h*.025;g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();g.lineWidth=h*.01;
   for(let i=1;i<9;i++){const x=w*i/9.5;for(const s of [-1,1]){g.beginPath();g.moveTo(x,h/2);g.quadraticCurveTo(x+w*.06,h/2+s*h*.22,x+w*.14,h/2+s*h*.46);g.stroke();}}
   if(st.spots>0){const R2=rng(9);g.globalAlpha=st.spots;for(let i=0;i<5;i++){g.fillStyle=st.spotC;g.beginPath();g.ellipse(w*(.2+R2()*.6),h*(.3+R2()*.4),40+R2()*30,25+R2()*16,0,0,7);g.fill();}g.globalAlpha=1;}});};
 mesh.paint();mesh.state=st;return mesh;}
const mixc=(a,b,t)=>'#'+new THREE.Color(a).lerp(new THREE.Color(b),t).getHexString();
export {mixc};
function flame(){const g=new THREE.Group();const fm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:{value:0},uS:{value:1}},
 vertexShader:'uniform float uT;varying vec3 vP;void main(){vP=position;vec3 p=position;float k=clamp(p.y/.03,0.,1.);p.x+=sin(uT*14.+p.y*200.)*.0018*k;p.z+=cos(uT*11.+p.y*180.)*.0015*k;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
 fragmentShader:'uniform float uS;varying vec3 vP;void main(){float k=clamp(vP.y/.035,0.,1.);vec3 c=mix(vec3(.35,.55,1.),mix(vec3(1.,.55,.12),vec3(1.,.9,.5),k),smoothstep(.0,.25,k));gl_FragColor=vec4(c*1.6,(1.-k)*.9*uS);}'});
 const geo=new THREE.SphereGeometry(.01,16,12);geo.translate(0,.01,0);geo.scale(1,2.2,1);const m=new THREE.Mesh(geo,fm);g.add(m);const m2=m.clone();m2.scale.setScalar(.6);g.add(m2);
 const pl=new THREE.PointLight('#ff9b4a',.35,1.2,2);pl.position.y=.02;g.add(pl);g.userData.update=t=>{fm.uniforms.uT.value=t;pl.intensity=.3+Math.sin(t*17)*.05+Math.sin(t*7)*.04;};g.userData.mat=fm;return g;}
export function makeLab(){
 const scene=new THREE.Scene(),W={name:'lab',scene,exposure:.8,bloom:[.3,.5,.9],dof:true},parts={};W.parts=parts;
 scene.background=new THREE.Color('#0e1216');
 W.init=renderer=>{const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(renderer),.04).texture;scene.traverse(o=>{if(o.material){[].concat(o.material).forEach(m=>{if('envMapIntensity' in m)m.envMapIntensity=m.userData.glass?1:m.transparent?.5:.28;});}});};
 scene.fog=new THREE.Fog('#0e1216',3,9);
 // bench + room
 const wt=woodTex();wt.repeat.set(8,1);const bench=new THREE.Mesh(new THREE.BoxGeometry(13,.06,1.1),new THREE.MeshStandardMaterial({map:wt,roughness:.55}));bench.position.set(5,-.03,0);bench.receiveShadow=true;scene.add(bench);
 const wallT=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#d9dcd6';g.fillRect(0,0,w,h);g.strokeStyle='#b9bdb6';g.lineWidth=4;for(let i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}},{repeat:[14,3]});
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(16,4),new THREE.MeshStandardMaterial({map:wallT,roughness:.8,color:'#9aa3a6'}));wall.position.set(5,1.4,-.7);wall.receiveShadow=true;scene.add(wall);
 const hemi=new THREE.HemisphereLight('#cfe2ff','#3a2c22',.45);scene.add(hemi);
 const key=new THREE.SpotLight('#fff1dc',2.3,6,.6,.75,1.6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0003;key.shadow.normalBias=.01;scene.add(key,key.target);
 const rim=new THREE.DirectionalLight('#9cc4ff',.9);rim.position.set(-2,2,-3);scene.add(rim);
 W.focus=(x,y=0)=>{key.position.set(x+.5,1.6,1.1);key.target.position.set(x,y,0);};W.setLight=k=>{key.intensity=2.3*k;hemi.intensity=.08+.37*Math.min(k,1);};W.focus(0);
 const GL=glassMat(),cast=o=>{o.traverse(c=>{if(c.isMesh){c.castShadow=true;c.receiveShadow=true;}});return o;};
 const glass=(prof,seg=48)=>new THREE.Mesh(lathe(prof,seg),GL);
 const liquid=(prof,col,o)=>{const m=new THREE.Mesh(lathe(prof,40),liquidMat(col,o));return m;};
 const tubeProf=(r,h)=>{const p=[];for(let i=0;i<=8;i++){const a=Math.PI/2*(i/8);p.push([r*Math.sin(a),r-r*Math.cos(a)]);}p.push([r,h],[r*1.12,h+.003]);return p;};
 const tubeLiq=(r,h)=>{const p=[[0,.0005]];for(let i=1;i<=8;i++){const a=Math.PI/2*(i/8);p.push([r*Math.sin(a),r-r*Math.cos(a)+.0005]);}p.push([r,h],[0,h]);return p;};
 const beakerProf=(r,h)=>[[0,.001],[r,.001],[r,h],[r*1.06,h+.004]];
 const label=(txt,w=.06)=>{const t=canvasTex(256,96,(g)=>{g.fillStyle='#f4efe2';g.fillRect(0,0,256,96);g.fillStyle='#142B45';g.font='700 40px system-ui,sans-serif';g.textAlign='center';g.fillText(txt,128,62);});return new THREE.Mesh(new THREE.PlaneGeometry(w,w*.375),new THREE.MeshStandardMaterial({map:t,roughness:.7}));};
 W.label=label;
 const kraft=canvasTex(256,256,(g,w,h)=>{const R=rng(12);g.fillStyle='#b48a5a';g.fillRect(0,0,w,h);for(let i=0;i<1800;i++){g.fillStyle=R()>.5?'rgba(120,85,45,.18)':'rgba(225,190,140,.16)';g.fillRect(R()*w,R()*h,2,1+R()*3);}g.fillStyle='rgba(205,190,150,.85)';g.fillRect(w*.42,0,w*.16,h);g.strokeStyle='rgba(90,60,30,.35)';g.lineWidth=3;g.strokeRect(4,4,w-8,h-8);});
 W.cardboard=(x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),new THREE.MeshStandardMaterial({map:kraft,roughness:.95}));m.castShadow=m.receiveShadow=true;return m;};
 // back shelf with bottles + a bright window: depth and life in the background
 const shelf=new THREE.Mesh(new THREE.BoxGeometry(12,.025,.18),new THREE.MeshStandardMaterial({map:wt,roughness:.6}));shelf.position.set(5,.62,-.6);shelf.castShadow=shelf.receiveShadow=true;scene.add(shelf);
 const RB=rng(21),bcols=['#7a3a10','#2f5f8a','#3f7a45','#c9d6de','#8a2a3a'];for(let i=0;i<34;i++){const x=-.6+i*.36+RB()*.1,r=.025+RB()*.03,hh=.08+RB()*.14;const b=new THREE.Mesh(lathe([[0,0],[r,0],[r,hh*.7],[r*.45,hh*.85],[r*.4,hh],[0,hh]],24),new THREE.MeshPhysicalMaterial({color:bcols[i%5],roughness:.15,clearcoat:1,transparent:true,opacity:.85}));b.position.set(x,.633,-.6+(RB()-.5)*.06);scene.add(b);}
 const win=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),new THREE.MeshBasicMaterial({color:'#dff0ff'}));win.position.set(11.2,1.25,-.69);scene.add(win);
 const winL=new THREE.PointLight('#cfe6ff',2.5,6,1.5);winL.position.set(11,1.2,-.3);scene.add(winL);
 const fr=new THREE.MeshStandardMaterial({color:'#e8e6e0',roughness:.6});[[0,.56,1.7,.06],[0,-.56,1.7,.06],[0,0,1.7,.04],[-.8,0,.06,1.16],[.8,0,.06,1.16],[0,0,.04,1.16]].forEach(([x,y,w2,h2])=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w2,h2,.04),fr);b.position.set(11.2+x,1.25+y,-.67);scene.add(b);});
 /* ========== STARCH TEST ========== */
 {const g=new THREE.Group();g.position.x=X.starch;scene.add(g);const metal=new THREE.MeshStandardMaterial({color:'#6b7480',metalness:.8,roughness:.35});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.075,.004,8,40),metal);ring.rotation.x=Math.PI/2;ring.position.y=.17;g.add(ring);
  for(let i=0;i<3;i++){const a=i/3*6.283,leg=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.18,8),metal);leg.position.set(Math.cos(a)*.08,.085,Math.sin(a)*.08);leg.rotation.set(Math.sin(a)*.12,0,-Math.cos(a)*.12);g.add(leg);}
  const gt=canvasTex(128,128,(c)=>{c.fillStyle='#777';c.fillRect(0,0,128,128);c.strokeStyle='#bbb';for(let i=0;i<128;i+=6){c.beginPath();c.moveTo(i,0);c.lineTo(i,128);c.stroke();c.beginPath();c.moveTo(0,i);c.lineTo(128,i);c.stroke();}c.fillStyle='#ddd';c.beginPath();c.arc(64,64,30,0,7);c.fill();});
  const gauze=new THREE.Mesh(new THREE.BoxGeometry(.17,.002,.17),new THREE.MeshStandardMaterial({map:gt,metalness:.6,roughness:.5}));gauze.position.y=.175;g.add(gauze);
  const lamp=new THREE.Group();lamp.add(glass([[0,.001],[.035,.001],[.04,.02],[.035,.045],[.012,.055],[.012,.062]]));lamp.add(liquid([[0,.002],[.032,.002],[.036,.02],[.03,.035],[0,.035]],'#e9f3ff'));
  const wick=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.018,8),new THREE.MeshStandardMaterial({color:'#efe7d0',roughness:1}));wick.position.y=.068;lamp.add(wick);const fl=flame();fl.position.y=.075;lamp.add(fl);g.add(lamp);
  const beaker=glass(beakerProf(.046,.1));beaker.position.y=.177;g.add(beaker);const water=liquid([[0,.002],[.044,.002],[.044,.075],[0,.075]],'#cfe8ff',{transmission:.9,attenuationDistance:.5});water.position.y=.177;g.add(water);
  const tt=new THREE.Group();tt.add(glass(tubeProf(.009,.13),24));const alc=liquid(tubeLiq(.0082,.07),'#eef7ff',{attenuationDistance:.3});tt.add(alc);tt.position.set(.012,.182,0);tt.rotation.z=-.18;g.add(tt);
  const leafT=paintedLeaf(.06,.012,{curl:.0});leafT.rotation.z=Math.PI/2;leafT.position.set(0,.01,0);tt.add(leafT);
  const leafB=paintedLeaf(.07,.028,{curl:.15});leafB.position.set(-.035,.2,0);leafB.rotation.set(.3,.2,.25);g.add(leafB);
  const dish=new THREE.Mesh(lathe([[0,.001],[.08,.001],[.085,.004],[.088,.012],[.084,.012],[.08,.005],[0,.005]],48),new THREE.MeshStandardMaterial({color:'#d9dcd8',roughness:.35}));dish.position.set(.3,0,.04);g.add(dish);
  const leafP=paintedLeaf(.12,.05,{cup:.02,curl:.01});leafP.position.set(.24,.008,.04);leafP.rotation.y=.15;g.add(leafP);
  const bottle=new THREE.Group();bottle.add(new THREE.Mesh(lathe([[0,.001],[.022,.001],[.022,.06],[.012,.07],[.009,.08],[.009,.088],[0,.088]]),new THREE.MeshPhysicalMaterial({color:'#7a3a10',transmission:.5,roughness:.15,thickness:.01})));
  const lb=label('IODINE',.04);lb.position.set(0,.032,.0225);bottle.add(lb);bottle.position.set(.45,0,-.05);g.add(bottle);
  const dropper=new THREE.Group();dropper.add(glass([[0,.001],[.002,0],[.004,.01],[.004,.07],[0,.07]],16));const bulb=new THREE.Mesh(new THREE.SphereGeometry(.008,16,12),new THREE.MeshStandardMaterial({color:'#c8303f',roughness:.4}));bulb.scale.y=1.6;bulb.position.y=.08;dropper.add(bulb);
  const dl=liquid([[0,.002],[.0028,.004],[.0028,.03],[0,.03]],'#a8641e');dropper.add(dl);dropper.position.set(.45,.1,-.05);g.add(dropper);
  const drop=new THREE.Mesh(new THREE.SphereGeometry(.0035,12,8),new THREE.MeshPhysicalMaterial({color:'#9a5a1a',transmission:.5,roughness:.05}));drop.visible=false;g.add(drop);
  const bubbles=new Bubbles(g,{n:60,size:.0025,rate:30,emit:R=>V((R()-.5)*.07,.18,(R()-.5)*.07),top:()=>.25,on:false});
  parts.starch={g,lamp,flame:fl,beaker,water,tt,alc,leafT,leafB,leafP,dish,dropper,drop,bottle,bubbles};cast(g);}
 /* ========== VARIEGATED (Activity 10.3) ========== */
 {const g=new THREE.Group();g.position.x=X.vari;scene.add(g);const vs={base:'#3d9a48',patch:'#3d9a48',margin:'#efe8c4'};
  const d1=new THREE.Mesh(lathe([[0,.001],[.08,.001],[.085,.004],[.088,.012],[0,.006]],48),new THREE.MeshStandardMaterial({color:'#cfd3cf',roughness:.4}));const d2=d1.clone();d1.position.set(-.12,0,.08);d2.position.set(.12,0,.08);g.add(d1,d2);
  const l1=paintedLeaf(.15,.11,{state:vs}),l2=paintedLeaf(.15,.11,{state:vs});l1.position.set(-.195,.009,.08);l2.position.set(.045,.009,.08);g.add(l1,l2);
  const pt=potTex();const p1=makePot(.05,.08,{tex:pt}),p2=makePot(.05,.08,{tex:pt});p1.position.set(-.14,0,-.2);p2.position.set(.14,0,-.2);g.add(p1,p2);
  const mk=s=>{const p=makePlant({seed:s,H:.2,n:10,leaf:.05,stemR:.004,branches:0,roots:false});return p;};const a=mk(31),b=mk(32);a.group.position.set(-.14,.072,-.2);b.group.position.set(.14,.072,-.2);g.add(a.group,b.group);
  const cover=W.cardboard(.2,.32,.2);cover.position.set(.14,.16,-.2);g.add(cover);
  const sunL=new THREE.SpotLight('#fff2c4',1.8,1.4,.45,.6,1.2);sunL.position.set(-.3,.8,.1);sunL.target=a.group;g.add(sunL);
  const t1=label('SUNLIGHT',.07),t2=label('DARK 36 h',.07);t1.position.set(-.14,.002,.13);t1.rotation.x=-Math.PI/2;t2.position.set(.14,.002,.13);t2.rotation.x=-Math.PI/2;g.add(t1,t2);
  parts.vari={g,l1,l2,cover,a,b};cast(g);}
 /* ========== CO2 BOTTLE (Activity 10.4) ========== */
 {const g=new THREE.Group();g.position.x=X.co2;scene.add(g);const pot=makePot(.07,.1,{tex:potTex()});pot.position.set(-.16,0,0);g.add(pot);
  const pl=makePlant({seed:41,H:.3,n:12,leaf:.06,stemR:.005,branches:0,roots:false});pl.group.position.set(-.16,.09,0);g.add(pl.group);
  const bottle=glass([[0,.001],[.075,.001],[.08,.01],[.08,.16],[.06,.2],[.035,.215],[.035,.24],[.038,.245]],48);bottle.position.set(.12,0,0);g.add(bottle);
  const naoh=liquid([[0,.003],[.076,.003],[.077,.045],[0,.045]],'#f3e9f6',{attenuationDistance:.4});naoh.position.copy(bottle.position);g.add(naoh);
  const cork=new THREE.Mesh(new THREE.CylinderGeometry(.036,.032,.03,24),new THREE.MeshStandardMaterial({color:'#b07a47',roughness:.9}));cork.position.set(.12,.255,0);g.add(cork);
  const stalk=new THREE.Mesh(taperTube(curve([[-.16,.3,0],[-.08,.36,0],[.04,.37,0],[.11,.33,0]]),{r0:.003,r1:.0025,seg:20}),pl.stemMat);g.add(stalk);
  const leaf=paintedLeaf(.17,.06,{curl:.02,state:{halfA:'#3d9a48',halfB:'#3d9a48',split:.32}});leaf.position.set(.115,.335,.01);leaf.rotation.order='ZXY';leaf.rotation.set(Math.PI/2,0,-Math.PI/2+.08);g.add(leaf);
  const air=new THREE.Group();g.add(air);
  const inside=new Drift(air,{kind:'co2',n:8,size:.007,box:[V(.07,.08,-.05),V(.17,.19,.05)],speed:.02,sink:.02,sinkY:.05,seed:8}),outside=new Drift(air,{kind:'co2',n:12,size:.007,box:[V(-.02,.28,-.08),V(.26,.42,.08)],speed:.02,seed:9});
  const lb=label('NaOH',.05);lb.position.set(.12,.1,.081);g.add(lb);
  parts.co2={g,pl,bottle,leaf,inside,outside,cork};cast(g);}
 /* ========== OXYGEN (Activity 10.5) ========== */
 {const g=new THREE.Group();g.position.x=X.oxy;scene.add(g);const sets=[];
  [-.14,.14].forEach((dx,i)=>{const s=new THREE.Group();s.position.x=dx;g.add(s);
   s.add(glass(beakerProf(.07,.18)));s.add(liquid([[0,.002],[.068,.002],[.068,.15],[0,.15]],'#a9d4ff',{opacity:.28}));
   const plant=new THREE.Group(),pm=new THREE.MeshStandardMaterial({color:'#3a9a48',roughness:.5,side:THREE.DoubleSide});
   for(let k=0;k<4;k++){const sx=(k-1.5)*.012,c=curve([[sx,.003,0],[sx+.004,.03,.003],[sx-.003,.06,0]]);plant.add(new THREE.Mesh(taperTube(c,{r0:.0012,r1:.0009,seg:10,radial:5}),pm));
    const lg=new THREE.InstancedMesh(new THREE.PlaneGeometry(.003,.009).translate(0,.0045,0),pm,48);const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
    for(let j=0;j<48;j++){const t=Math.floor(j/6)/8,p=c.getPointAt(Math.min(1,t+.05));e.set(.9,j*1.05,0);q.setFromEuler(e);m4.compose(p,q,V(1,1,1));lg.setMatrixAt(j,m4);}plant.add(lg);}
   s.add(plant);
   const fun=glass([[.055,.004],[.05,.006],[.012,.07],[.008,.075],[.008,.11]],40);s.add(fun);
   const tube=new THREE.Group();tube.add(glass(tubeProf(.011,.11),24));const tl=liquid(tubeLiq(.0102,.108),'#d5ecff',{transmission:.92,attenuationDistance:.6});tube.add(tl);
   const gas=new THREE.Mesh(new THREE.CylinderGeometry(.0101,.0101,1,20),new THREE.MeshPhysicalMaterial({color:'#ffffff',transmission:.2,roughness:.1,transparent:true,opacity:.55}));gas.scale.y=.0001;tube.add(gas);
   tube.rotation.x=Math.PI;tube.position.y=.225;s.add(tube);
   const bub=new Bubbles(s,{n:70,size:.0016,rate:i===0?16:0,emit:R=>V((R()-.5)*.04,.03+R()*.03,(R()-.5)*.02),top:()=>.225-.11+.11-gas.scale.y-.002,on:i===0,
    funnel:(p,dt)=>{if(p.y>.05){const lim=p.y<.075?lerp(.05,.007,(p.y-.005)/.07):.007;if(Math.abs(p.x)>lim)p.x*=.9;if(Math.abs(p.z)>lim)p.z*=.9;}}});
   sets.push({s,tube,gas,bub,tl});});
  const cover=W.cardboard(.2,.34,.2);cover.position.set(.14,.17,0);g.add(cover);
  const sunL=new THREE.SpotLight('#fff2c4',1.8,1.6,.35,.6,1.2);sunL.position.set(-.35,.9,.2);sunL.target=sets[0].s;g.add(sunL);
  const tA=label('A · SUNLIGHT',.08),tB=label('B · DARK',.08);tA.position.set(-.14,.002,.12);tA.rotation.x=-Math.PI/2;tB.position.set(.14,.002,.13);tB.rotation.x=-Math.PI/2;g.add(tA,tB);
  const stick=new THREE.Group();stick.add(new THREE.Mesh(new THREE.CylinderGeometry(.0015,.0015,.07,8),new THREE.MeshStandardMaterial({color:'#e8c48a'})));const head=new THREE.Mesh(new THREE.SphereGeometry(.0025,10,8),new THREE.MeshStandardMaterial({color:'#7a1a1a'}));head.position.y=-.035;stick.add(head);
  const sf=flame();sf.rotation.x=Math.PI;sf.position.y=-.03;sf.scale.setScalar(.6);stick.add(sf);stick.rotation.x=Math.PI;stick.visible=false;g.add(stick);
  parts.oxy={g,sets,cover,stick,stickFlame:sf};cast(g);}
 /* ========== LEAF PEEL / MICROSCOPE (Activity 10.6) ========== */
 {const g=new THREE.Group();g.position.x=X.peel;scene.add(g);const wm=new THREE.MeshStandardMaterial({color:'#eceff1',roughness:.35,metalness:.2}),km=new THREE.MeshStandardMaterial({color:'#20252b',roughness:.4,metalness:.5});
  const base=new THREE.Mesh(new THREE.BoxGeometry(.12,.02,.15),wm);base.position.set(0,.01,-.03);g.add(base);
  const arm=new THREE.Mesh(taperTube(curve([[0,.02,-.09],[0,.12,-.1],[0,.2,-.06],[0,.23,-.02]]),{r0:.016,r1:.012,seg:20}),wm);g.add(arm);
  const stage=new THREE.Mesh(new THREE.BoxGeometry(.09,.006,.08),km);stage.position.set(0,.1,0);g.add(stage);
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,.12,24),wm);tube.position.set(0,.2,.01);tube.rotation.x=-.25;g.add(tube);
  const eye=new THREE.Mesh(new THREE.CylinderGeometry(.009,.011,.03,20),km);eye.position.set(0,.265,-.005);eye.rotation.x=-.25;g.add(eye);
  const obj=new THREE.Mesh(new THREE.CylinderGeometry(.006,.008,.03,16),km);obj.position.set(0,.125,.02);g.add(obj);
  const slide=new THREE.Mesh(new THREE.BoxGeometry(.075,.002,.026),glassMat());slide.position.set(0,.104,0);g.add(slide);
  const peel=new THREE.Mesh(new THREE.PlaneGeometry(.014,.01),new THREE.MeshStandardMaterial({color:'#b9a6e8',transparent:true,opacity:.8}));peel.rotation.x=-Math.PI/2;peel.position.set(0,.1055,0);g.add(peel);
  const wg=new THREE.Mesh(lathe([[0,.001],[.04,.008],[.042,.012]],40),glassMat());wg.position.set(.16,0,.05);g.add(wg);
  const wq=liquid([[0,.0025],[.032,.007],[0,.007]],'#e3f0ff');wq.position.copy(wg.position);g.add(wq);
  const fl=paintedLeaf(.1,.05,{state:{base:'#5c8c3a'}});fl.position.set(-.22,.003,.06);fl.rotation.y=.4;g.add(fl);
  const forc=new THREE.Mesh(new THREE.BoxGeometry(.09,.003,.006),new THREE.MeshStandardMaterial({color:'#b8c0c8',metalness:.9,roughness:.2}));forc.position.set(.1,.003,.12);forc.rotation.y=.5;g.add(forc);
  parts.peel={g};cast(g);}
 /* ========== RED INK (Activity 10.7) ========== */
 {const g=new THREE.Group();g.position.x=X.ink;scene.add(g);const tw=[];
  [-.12,.12].forEach((dx,i)=>{const tum=glass([[0,.001],[.042,.001],[.05,.13],[.052,.132]],40);tum.position.x=dx;g.add(tum);
   const w=liquid([[0,.003],[.042,.003],[.045,.045],[0,.045]],i?'#e0475b':'#cfe8ff',{attenuationDistance:i?.05:.6});w.position.x=dx;g.add(w);
   const p=makePlant({seed:51+i,H:.3,n:8,leaf:.06,stemR:.0045,branches:1,flowers:2,roots:false});p.group.position.set(dx,.01,0);p.group.rotation.z=(i?-1:1)*.06;g.add(p.group);tw.push(p);
   const lb=label(i?'B · RED INK':'A · WATER',.07);lb.position.set(dx,.002,.08);lb.rotation.x=-Math.PI/2;g.add(lb);});
  parts.ink={g,tw};cast(g);}
 /* ========== RESPIRATION (Activity 10.8) ========== */
 {const g=new THREE.Group();g.position.x=X.resp;scene.add(g);
  const flask=glass([[0,.001],[.07,.001],[.074,.008],[.022,.13],[.02,.16],[.023,.165]],48);flask.position.x=-.12;g.add(flask);
  const cot=new THREE.Mesh(new THREE.CylinderGeometry(.066,.07,.018,40),new THREE.MeshStandardMaterial({color:'#f5f3ee',roughness:1}));cot.position.set(-.12,.011,0);g.add(cot);
  const seeds=new THREE.InstancedMesh(new THREE.SphereGeometry(.004,10,8).scale(1.3,.8,.9),new THREE.MeshStandardMaterial({color:'#5f9e3a',roughness:.5}),40);
  const roots=new THREE.InstancedMesh(new THREE.ConeGeometry(.0012,.012,6).translate(0,-.006,0),new THREE.MeshStandardMaterial({color:'#f7efd9',roughness:.8}),40);
  const R=rng(6),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),sp=[];
  for(let i=0;i<40;i++){const a=R()*6.28,r=Math.sqrt(R())*.055,p=V(-.12+Math.cos(a)*r,.022+R()*.004,Math.sin(a)*r);e.set(R(),R()*6,R());q.setFromEuler(e);m4.compose(p,q,V(1,1,1));seeds.setMatrixAt(i,m4);sp.push([p,q.clone()]);}
  g.add(seeds,roots);
  const cork=new THREE.Mesh(new THREE.CylinderGeometry(.024,.02,.022,24),new THREE.MeshStandardMaterial({color:'#8a3e20',roughness:.9}));cork.position.set(-.12,.17,0);g.add(cork);
  const gt=(pts,r=.003)=>new THREE.Mesh(new THREE.TubeGeometry(curve(pts),40,r,10),GL);
  g.add(gt([[-.128,.17,0],[-.128,.23,0],[-.17,.235,0]]));g.add(gt([[-.112,.03,0],[-.112,.21,0]]));
  const pipeC=curve([[-.112,.21,0],[-.112,.27,0],[-.06,.3,0],[.04,.29,0],[.07,.22,0],[.07,.17,0]]);g.add(new THREE.Mesh(new THREE.TubeGeometry(pipeC,60,.0045,10),new THREE.MeshStandardMaterial({color:'#e8842c',roughness:.45})));
  const stand=new THREE.Group(),wd=new THREE.MeshStandardMaterial({map:woodTex(),color:'#d9a77a',roughness:.6});
  const top=new THREE.Mesh(new THREE.BoxGeometry(.22,.012,.05),wd);top.position.y=.12;stand.add(top);const mid=top.clone();mid.position.y=.04;stand.add(mid);
  [-.1,.1].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.012,.13,.05),wd);l.position.set(x,.065,0);stand.add(l);});stand.position.set(.13,0,0);g.add(stand);
  const lws=[];[.07,.19].forEach((x,i)=>{const t=new THREE.Group();t.add(glass(tubeProf(.011,.13),24));const lw=liquid(tubeLiq(.0102,.08),'#e9f6ff',{transmission:.9,attenuationDistance:.6});lw.material=lw.material.clone();t.add(lw);t.position.set(x,.03,0);g.add(t);lws.push(lw);
   if(!i){const ck=new THREE.Mesh(new THREE.CylinderGeometry(.012,.0105,.016,20),cork.material);ck.position.set(x,.165,0);g.add(ck);g.add(gt([[x,.17,0],[x,.05,0]],.0022));}});
  const lb1=label('CONNECTED',.06),lb2=label('NOT CONNECTED',.06);lb1.position.set(.07,.002,.06);lb2.position.set(.19,.002,.06);[lb1,lb2].forEach(l=>{l.rotation.x=-Math.PI/2;g.add(l);});
  const co2=new Flow(g,{curve:curve([[-.12,.03,0],[-.112,.08,0],[-.112,.21,0],[-.112,.27,0],[-.06,.3,0],[.04,.29,0],[.07,.22,0],[.07,.17,0],[.07,.06,0]]),kind:'co2',n:14,size:.0055,speed:.12,on:false});
  const bub=new Bubbles(g,{n:30,size:.0015,rate:10,emit:R=>V(.07+(R()-.5)*.004,.05,(R()-.5)*.004),top:()=>.105,on:false});
  parts.resp={g,seeds,roots,sp,lws,co2,bub,sprout:k=>{for(let i=0;i<40;i++){const [p,qq]=sp[i];m4.compose(p,qq,V(1,k,1));roots.setMatrixAt(i,m4);}roots.instanceMatrix.needsUpdate=true;}};parts.resp.sprout(.001);cast(g);}
 /* ========== BOTTLE GARDEN ========== */
 {const g=new THREE.Group();g.position.x=X.jar;scene.add(g);
  const jar=glass([[0,.001],[.13,.001],[.14,.02],[.14,.3],[.1,.36],[.055,.39],[.055,.42],[.06,.425]],64);g.add(jar);
  [[.03,'#8d8a83'],[.012,'#2b2b2b'],[.05,'#4a3220']].reduce((y,[h,c])=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.136,.136,h,48),new THREE.MeshStandardMaterial({color:c,roughness:1}));m.position.y=y+h/2;g.add(m);return y+h;},.002);
  const lid=new THREE.Mesh(new THREE.CylinderGeometry(.058,.054,.03,32),new THREE.MeshStandardMaterial({color:'#a56b3c',roughness:.9}));lid.position.y=.44;g.add(lid);
  const sm=tintable(new THREE.MeshStandardMaterial({color:'#ffffff',map:canvasTex(256,64,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#2f8a3c');gr.addColorStop(.35,'#e8f3cf');gr.addColorStop(.65,'#e8f3cf');gr.addColorStop(1,'#2f8a3c');c.fillStyle=gr;c.fillRect(0,0,w,h);}),side:THREE.DoubleSide,roughness:.5}));
  const RL=rng(3);for(let i=0;i<22;i++){const L=new THREE.Mesh(leafGeometry({len:.2+RL()*.08,width:.05,cup:.25,curl:.55+RL()*.3,segU:20,segV:4}),sm);L.position.y=.094;L.rotation.set(0,i*.9+RL(),.9+RL()*.5);L.castShadow=true;g.add(L);}
  const loopA=curve([[-.06,.12,.05],[-.11,.2,.04],[-.05,.3,.03],[.02,.26,.04]]),loopB=curve([[.03,.27,-.03],[.1,.22,-.04],[.08,.13,-.04],[.02,.12,-.03]]);
  const fa=new Flow(g,{curve:loopA,kind:'co2',n:7,size:.009,speed:.15,on:false}),fb=new Flow(g,{curve:loopB,kind:'o2',n:7,size:.009,speed:.15,on:false,seed:5});
  parts.jar={g,fa,fb};cast(g);}
 W.flows=[parts.starch.bubbles,parts.co2.inside,parts.co2.outside,...parts.oxy.sets.map(s=>s.bub),parts.resp.co2,parts.resp.bub,parts.jar.fa,parts.jar.fb];
 W.update=(dt,t)=>{parts.starch.flame.userData.update(t);parts.oxy.stickFlame.userData.update(t);W.flows.forEach(f=>f.update(dt,t));
  parts.oxy.sets.forEach(s=>{if(s.bub.popped){s.gas.scale.y=Math.min(.06,s.gas.scale.y+s.bub.popped*.00035);s.gas.position.y=s.gas.scale.y/2+.001;s.tl.scale.y=1-s.gas.scale.y/.108;s.tl.position.y=s.gas.scale.y;s.bub.popped=0;}});
  parts.ink.tw.forEach((p,i)=>p.sway(t+i,.3));parts.co2.pl.sway(t,.3);};
 W.quality=q=>{if(key.shadow.mapSize.x!==q.shadow){key.shadow.mapSize.set(q.shadow,q.shadow);key.shadow.map?.dispose();key.shadow.map=null;}};
 W.reset=()=>{const s=parts.starch;s.bubbles.set(false);s.leafB.paint({base:'#3d9a48',spots:0});s.leafT.paint({base:'#3d9a48'});s.leafP.paint({base:'#efe6c4',spots:0});s.alc.material.color.set('#eef7ff');s.alc.material.attenuationColor.set('#eef7ff');
  s.dropper.position.set(.45,.1,-.05);s.drop.visible=false;s.leafB.visible=true;s.tt.visible=true;};
 return W;}

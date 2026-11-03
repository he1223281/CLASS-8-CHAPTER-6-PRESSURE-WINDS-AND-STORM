import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {V,rng,lerp,curve} from '../lib.js';
import {Flow,Drift,shaft,molMesh} from '../fx.js';
/* A clean, textbook-style slice of a leaf. Cut face at z=FZ, slab depth ~2. Solid cells, one row each, clear gaps. */
export function makeLeafWorld(){
 const scene=new THREE.Scene(),W={name:'leaf',scene,exposure:1,bloom:[.25,.5,.92]};
 scene.background=new THREE.Color('#0d2a22');scene.fog=new THREE.Fog('#0d2a22',18,40);
 scene.add(new THREE.HemisphereLight('#eafff0','#12352a',1.3));
 const key=new THREE.DirectionalLight('#fff4dc',2.2);key.position.set(-4,9,10);scene.add(key);
 const rim=new THREE.DirectionalLight('#9fe8ff',.8);rim.position.set(6,-3,-4);scene.add(rim);
 const R=rng(12),FZ=2.4,BZ=.4,DZ=FZ-BZ,MZ=(FZ+BZ)/2,XS=-8,XE=8,PZ=FZ+.12;
 const mat=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.55},o));
 const M={epi:mat('#e3f2d2'),pal:mat('#8fd47a'),spo:mat('#b8e4a2'),chl:mat('#1f9a45',{emissive:'#0f5a26',emissiveIntensity:.15}),guard:mat('#6cc46a'),sheath:mat('#e8efc4'),xy:mat('#4f97ee',{emissive:'#163f7a',emissiveIntensity:.25}),ph:mat('#f0aa45',{emissive:'#6a3a00',emissiveIntensity:.2}),wax:new THREE.MeshPhysicalMaterial({color:'#f4fff0',roughness:.1,clearcoat:1,transparent:true,opacity:.45})};
 W.chlMat=M.chl;
 const add=(geo,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);scene.add(o);return o;};
 // waxy top layer
 add(new THREE.BoxGeometry(XE-XS,.1,DZ),M.wax,0,3.38,MZ);
 // upper & lower skin (epidermis): flat cells, 2 rows deep
 const epiG=new RoundedBoxGeometry(.9,.5,.95,3,.12),vx=-3,vy=.45,SX=2.4;
 for(let i=0;i<17;i++)for(let j=0;j<2;j++){const x=XS+.5+i*.94,z=FZ-.5-j*1.0;add(epiG,M.epi,x,3.02,z);
  if(Math.abs(x-SX)<.6&&j===0)continue;add(epiG,M.epi,x,-.62,z);}
 // long column cells: ONE row along x (2 deep), each with chloroplasts on the visible face
 const palG=new THREE.CapsuleGeometry(.34,1.25,6,16),chG=new THREE.SphereGeometry(.11,14,10),pal=[];
 for(let i=0;i<19;i++)for(let j=0;j<2;j++){const x=XS+.45+i*.84,z=FZ-.45-j*.95;add(palG,M.pal,x,1.86,z);if(j===0)pal.push(V(x,1.86,z));}
 pal.forEach(p=>{for(let k=0;k<7;k++){const c=add(chG,M.chl,p.x+(k%2?.13:-.13),p.y-.6+k*.2,p.z+.32);c.scale.set(1,.6,.5);}});
 // rounder cells with clear air spaces (2 rows)
 const spG=new THREE.SphereGeometry(.5,24,16),spongy=[];
 const spots=[[-7.2,.6],[-6.1,.15],[-5.1,.7],[-1.1,.2],[-.1,.75],[.9,.15],[3.7,.25],[4.7,.75],[5.7,.2],[6.7,.7],[7.5,.2],[1.6,.78],[-4.3,.15]];
 spots.forEach(([x,y],i)=>{for(let j=0;j<2;j++){const z=FZ-.5-j*1.0;const o=add(spG,M.spo,x,y,z,1.05,.8,.9);if(j===0){spongy.push(o.position.clone());for(let k=0;k<3;k++){const c=add(chG,M.chl,x-.22+k*.22,y+(k%2?.12:-.08),z+.42);c.scale.set(.8,.5,.4);}}}});
 // vein: sheath ring + xylem (blue, top) + phloem (orange, bottom), running into the page
 add(new THREE.CylinderGeometry(.95,.95,DZ,40).rotateX(Math.PI/2),M.sheath,vx,vy,MZ);
 const xyl=[[-.32,.28],[.08,.38],[.42,.18]],phl=[[-.3,-.38],[.12,-.45],[.45,-.25]];
 xyl.forEach(([dx,dy])=>add(new THREE.CylinderGeometry(.18,.18,DZ+.02,24).rotateX(Math.PI/2),M.xy,vx+dx,vy+dy,MZ));
 phl.forEach(([dx,dy])=>add(new THREE.CylinderGeometry(.14,.14,DZ+.02,20).rotateX(Math.PI/2),M.ph,vx+dx,vy+dy,MZ));
 // stoma: two guard cells around a gap, with the air space above it
 const gcs=[-1,1].map(s=>add(new THREE.SphereGeometry(.3,24,16),M.guard,SX+s*.3,-.62,FZ-.5,1,.85,1.4));
 gcs.forEach((g,i)=>{for(let k=0;k<3;k++){const c=add(chG,M.chl,g.position.x+(i?.06:-.06),-.62+(k-1)*.15,FZ-.05);c.scale.set(.7,.5,.4);}});
 W.guard=gcs;W.stoma=V(SX,-.62,PZ);
 // light shafts (few, soft)
 const sh=[];for(let i=0;i<3;i++){const x=-5+i*4;sh.push(shaft(scene,V(x-2,10,3.4),V(x+.5,3.4,2.6),{r0:.3,r1:1.2,opacity:.1}));}W.shafts=sh;sh.forEach(s=>s.visible=false);
 // ---------- molecules: few, large, moving across the cut face (z=PZ) ----------
 const z=PZ;
 const air=new Drift(scene,{kind:'co2',n:10,size:.2,box:[V(-1,-3.3,z-.2),V(7,-1.4,z+.4)],speed:.18,seed:3,on:false});
 const cIn=new Flow(scene,{curves:[0,1].map(i=>curve([[1.2+i*1.6,-3.2,z],[SX+(i?.15:-.15),-1.4,z],[SX,-.62,z],[SX+(i?.6:-.6),.35,z],[SX+(i?1.1:-1.6),1.5,z]])),kind:'co2',n:6,size:.2,speed:.13,on:false,fade:.06});
 const oOut=new Flow(scene,{curves:[0,1].map(i=>curve([[SX+(i?1.4:-1.1),1.5,z],[SX+(i?.5:-.4),.35,z],[SX,-.62,z],[SX+(i?.4:-.3),-1.6,z],[SX+(i?2.6:1.2),-3.3,z]])),kind:'o2',n:6,size:.2,speed:.13,on:false,seed:7});
 const wIn=new Flow(scene,{curves:[-1,1,2,3].map(i=>curve([[vx+.08,vy+.38,z],[vx+i*.6,vy+.95,z],[vx+i*1.3,1.4,z]])),kind:'water',n:8,size:.18,speed:.16,on:false,seed:9});
 const wX=new Flow(scene,{curves:xyl.map(([dx,dy])=>curve([[vx+dx,vy+dy,BZ-2],[vx+dx,vy+dy,z]])),kind:'water',n:9,size:.16,speed:.14,on:false,seed:2});
 const ph=new Flow(scene,{curves:[0,1].map(i=>curve([[vx+2+i*2,1.5,z],[vx+.9+i*.4,.9,z],[vx+phl[i][0],vy+phl[i][1],z]])),kind:'sugar',n:6,size:.18,speed:.12,on:false,seed:4});
 const ph2=new Flow(scene,{curves:phl.map(([dx,dy])=>curve([[vx+dx,vy+dy,z],[vx+dx,vy+dy,BZ-2]])),kind:'sugar',n:9,size:.15,speed:.12,on:false,seed:6});
 const photons=new Flow(scene,{curves:[0,1,2,3].map(i=>curve([[-6+i*3.2,9.5,z+1],[-5.4+i*3.2,2.6,z]])),kind:'photon',n:12,size:.12,speed:.55,on:false,seed:1});
 W.mol={air,cIn,oOut,wIn,wX,ph,ph2,photons};
 // glucose: appears on the face of the long cells
 const gl=[];pal.filter((_,i)=>i%2===0).slice(1,9).forEach((p,i)=>{const m=molMesh('glucose',.0001);m.position.set(p.x,p.y+(i%2?.3:-.25),z+.05);m.rotation.x=0;scene.add(m);gl.push(m);});W.glucose=gl;
 const starch=new THREE.Group();scene.add(starch);for(let i=0;i<8;i++){const m=molMesh('glucose',.17);m.position.set(-.4+i*.22,1.86+Math.sin(i*1.3)*.12,z+.08);starch.add(m);}starch.visible=false;W.starch=starch;
 W.spots={cuticle:V(-5,3.43,FZ),epi:V(-6.6,3.02,PZ),pal:V(-1.2,2.3,PZ),spongy:V(4.7,.75,PZ),vein:V(vx,vy+.95,PZ),xylem:V(vx+.08,vy+.38,PZ),phloem:V(vx+.12,vy-.45,PZ),stoma:V(SX,-.62,PZ),lower:V(-5.6,-.62,PZ),chl:V(-2.06,2.1,PZ+.2)};
 W.update=(dt,t)=>{Object.values(W.mol).forEach(f=>f.update(dt,t));sh.forEach(s=>s.userData.update(t));
  if(W.glow!==undefined)M.chl.emissiveIntensity=lerp(M.chl.emissiveIntensity,W.glow?.55+Math.sin(t*3)*.15:.15,Math.min(1,dt*3));
  const open=W.open??1;gcs.forEach((g,i)=>{g.position.x=SX+(i?1:-1)*(.24+open*.08);});};
 W.quality=q=>{};
 return W;}

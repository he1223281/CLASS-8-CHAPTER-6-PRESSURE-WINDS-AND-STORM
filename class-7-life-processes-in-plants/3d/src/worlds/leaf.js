import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {V,rng,lerp,curve} from '../lib.js';
import {Flow,Drift,motes,shaft,molMesh} from '../fx.js';
/* Micro-world: a section through a leaf. 1 unit ~ 10 µm. Cut face at z=+2.4 */
export function makeLeafWorld(){
 const scene=new THREE.Scene(),W={name:'leaf',scene,exposure:1,bloom:[.45,.55,.8]};
 scene.background=new THREE.Color('#061410');scene.fog=new THREE.FogExp2('#061410',.045);
 scene.add(new THREE.HemisphereLight('#d6ffe0','#0b2a1a',1.1));
 const key=new THREE.DirectionalLight('#fff1c8',2.4);key.position.set(-3,10,6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-10,right:10,top:8,bottom:-6,near:1,far:30});scene.add(key);
 const fill=new THREE.PointLight('#7fe3a8',30,20,2);fill.position.set(4,1,6);scene.add(fill);
 const R=rng(12),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),c=new THREE.Color();
 const wall=(col,op)=>new THREE.MeshPhysicalMaterial({color:col,roughness:.25,transparent:true,opacity:op,depthWrite:false,clearcoat:.6,side:THREE.DoubleSide});
 const XS=-8,XE=8,ZS=-7,ZE=2.4;
 // cuticle & upper epidermis
 const cut=new THREE.Mesh(new THREE.BoxGeometry(XE-XS,.12,ZE-ZS),new THREE.MeshPhysicalMaterial({color:'#e6ffd9',transparent:true,opacity:.35,roughness:.05,clearcoat:1,depthWrite:false}));cut.position.set(0,3.36,(ZS+ZE)/2);scene.add(cut);
 const epiG=new RoundedBoxGeometry(.92,.5,.92,3,.14),epiM=wall('#d8f3cf',.55);
 const nEx=Math.floor((XE-XS)/.95),nEz=Math.floor((ZE-ZS)/.95),epi=new THREE.InstancedMesh(epiG,epiM,nEx*nEz*2);let k=0;
 for(const y of [3.02,-.62])for(let i=0;i<nEx;i++)for(let j=0;j<nEz;j++){const x=XS+.5+i*.95,z=ZS+.5+j*.95;if(y<0&&Math.abs(x-2.4)<.75&&Math.abs(z-.9)<.75){continue;}m4.compose(V(x,y,z),q.identity(),V(1,1,1));epi.setMatrixAt(k++,m4);}epi.count=k;scene.add(epi);
 // palisade
 const palG=new THREE.CapsuleGeometry(.36,1.45,6,16),palM=wall('#a8e59a',.4);const pal=[];
 for(let i=0;i<19;i++)for(let j=0;j<11;j++){const x=XS+.55+i*.83+(j%2)*.2,z=ZS+.45+j*.83;if(z>ZE-.3)continue;pal.push(V(x,1.85+(R()-.5)*.08,z));}
 const palI=new THREE.InstancedMesh(palG,palM,pal.length);pal.forEach((p,i)=>{m4.compose(p,q.identity(),V(1,1,1));palI.setMatrixAt(i,m4);});scene.add(palI);
 // spongy
 const spG=new THREE.IcosahedronGeometry(.48,2),sp=spG.attributes.position;for(let i=0;i<sp.count;i++){const v=V(sp.getX(i),sp.getY(i),sp.getZ(i));v.multiplyScalar(1+.12*Math.sin(v.x*7)*Math.cos(v.z*6)+.08*Math.sin(v.y*9));sp.setXYZ(i,v.x,v.y,v.z);}spG.computeVertexNormals();
 const spongy=[];for(let i=0;i<150;i++){const p=V(lerp(XS+.4,XE-.4,R()),lerp(-.05,.95,R()),lerp(ZS+.4,ZE-.4,R()));if(Math.abs(p.x+3)<1&&Math.abs(p.y-.45)<1)continue;if(Math.abs(p.x-2.4)<.9&&p.y<.5&&Math.abs(p.z-.9)<1.1)continue;if(spongy.some(s=>s.distanceTo(p)<.85))continue;spongy.push(p);}
 const spI=new THREE.InstancedMesh(spG,wall('#b8e8a8',.42),spongy.length);spongy.forEach((p,i)=>{e.set(R()*3,R()*3,R()*3);q.setFromEuler(e);m4.compose(p,q,V(1,.8+R()*.3,1));spI.setMatrixAt(i,m4);});scene.add(spI);
 // chloroplasts
 const chG=new THREE.SphereGeometry(.12,12,8),chM=new THREE.MeshStandardMaterial({color:'#2fb85a',roughness:.35,emissive:'#1f8a3c',emissiveIntensity:.25});
 const chl=[];pal.forEach(p=>{for(let n=0;n<16;n++){const a=n*2.4+R(),y=(R()-.5)*1.6;chl.push([V(p.x+Math.cos(a)*.31,p.y+y,p.z+Math.sin(a)*.31),a]);}});spongy.forEach(p=>{for(let n=0;n<5;n++){const d=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(.4);chl.push([p.clone().add(d),R()*6]);}});
 const chI=new THREE.InstancedMesh(chG,chM,chl.length);chl.forEach(([p,a],i)=>{e.set(R(),a,R());q.setFromEuler(e);m4.compose(p,q,V(1,.55,.8));chI.setMatrixAt(i,m4);});scene.add(chI);W.chlMat=chM;
 // vein: bundle sheath + xylem + phloem running along z at x=-3
 const vx=-3,vy=.45;const sheath=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,ZE-ZS,40,1,true).rotateX(Math.PI/2),wall('#d6f0c0',.25));sheath.position.set(vx,vy,(ZS+ZE)/2);scene.add(sheath);
 const xm=new THREE.MeshPhysicalMaterial({color:'#7fb6ff',roughness:.1,transparent:true,opacity:.45,depthWrite:false,emissive:'#1e4f9a',emissiveIntensity:.3}),pm=new THREE.MeshPhysicalMaterial({color:'#ffc36b',roughness:.2,transparent:true,opacity:.45,depthWrite:false,emissive:'#7a4a00',emissiveIntensity:.3});
 const xyl=[[-.3,.25],[.05,.35],[.3,.15],[-.05,0]],phl=[[-.25,-.4],[.15,-.45],[.4,-.25]];
 xyl.forEach(([dx,dy])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,ZE-ZS,20,1,true).rotateX(Math.PI/2),xm);t.position.set(vx+dx,vy+dy,(ZS+ZE)/2);scene.add(t);});
 phl.forEach(([dx,dy])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,ZE-ZS,16,1,true).rotateX(Math.PI/2),pm);t.position.set(vx+dx,vy+dy,(ZS+ZE)/2);scene.add(t);});
 // stoma: two guard cells
 const gm=new THREE.MeshPhysicalMaterial({color:'#7fd38a',roughness:.3,clearcoat:.5,transparent:true,opacity:.85});const gcs=[];
 [-1,1].forEach(s=>{const gc=new THREE.Mesh(new THREE.TorusGeometry(.42,.22,16,32,Math.PI),gm);gc.rotation.set(Math.PI/2,0,s>0?0:Math.PI);gc.position.set(2.4+s*.05,-.62,.9);gc.scale.set(1,1.4,1);scene.add(gc);gcs.push(gc);
  for(let n=0;n<5;n++){const cm=new THREE.Mesh(chG,chM);cm.position.set(2.4+s*.48,-.62,.9+(n-2)*.22);cm.scale.set(.8,.5,.8);scene.add(cm);}});
 W.guard=gcs;W.stoma=V(2.4,-.62,.9);
 // light shafts + motes
 const sh=[];for(let i=0;i<5;i++){const x=-6+i*3;sh.push(shaft(scene,V(x-2,9,1.5),V(x+.6,1.2,.5),{r0:.3,r1:1.1,opacity:.12}));}W.shafts=sh;sh.forEach(s=>s.visible=false);
 const mo=motes(scene,{n:600,box:[V(-8,-3,-6),V(8,6,3)],size:.06,color:'#c8ffd8',opacity:.35});
 // molecules
 const air=new Drift(scene,{kind:'co2',n:26,size:.16,box:[V(-2,-3.2,-1),V(7,-1.1,2.6)],speed:.15,seed:3,on:false});
 const cIn=new Flow(scene,{curves:[0,1,2,3].map(i=>curve([[1+i*.9,-3,1.6-i*.3],[2.3+i*.05,-1.4,.95],[2.4,-.62,.9],[2.3+i*.2,.2,.8],[1.2+i*.6,1.3,.4+i*.2]])),kind:'co2',n:16,size:.16,speed:.12,on:false,fade:.06});
 const oOut=new Flow(scene,{curves:[0,1,2].map(i=>curve([[1.4+i*.8,1.4,.6],[2.5,.2,.9],[2.4,-.62,.9],[2.8+i*.4,-1.6,1.2],[3.5+i*1.2,-3.2,1.8]])),kind:'o2',n:14,size:.16,speed:.12,on:false,seed:7});
 const wIn=new Flow(scene,{curves:[-1,0,1,2,3].map(i=>curve([[vx+.05,vy+.35,ZS+1],[vx+.05,vy+.35,i*.4],[vx+.6,vy+.9,i*.4],[vx+1.6+i*.9,1.6,i*.3+.2]])),kind:'water',n:18,size:.15,speed:.1,on:false,seed:9});
 const wX=new Flow(scene,{curves:xyl.map(([dx,dy])=>curve([[vx+dx,vy+dy,ZS],[vx+dx,vy+dy,ZE]])),kind:'water',n:24,size:.12,speed:.08,on:false,seed:2});
 const ph=new Flow(scene,{curves:[0,1,2].map(i=>curve([[1+i*1.4,1.6,.4],[vx+1.4,1,.5],[vx+phl[i][0],vy+phl[i][1],.6],[vx+phl[i][0],vy+phl[i][1],ZS]])),kind:'sugar',n:14,size:.15,speed:.07,on:false,seed:4});
 const ph2=new Flow(scene,{curves:phl.map(([dx,dy])=>curve([[vx+dx,vy+dy,ZE],[vx+dx,vy+dy,ZS]])),kind:'sugar',n:14,size:.11,speed:.06,on:false,seed:6});
 const photons=new Flow(scene,{curves:[0,1,2,3,4,5].map(i=>curve([[-6+i*2.4,9,2],[-5+i*2.4+.8,1.8,1.4]])),kind:'photon',n:24,size:.09,speed:.55,on:false,seed:1});
 W.mol={air,cIn,oOut,wIn,wX,ph,ph2,photons};
 // glucose made inside palisade cells
 const glu=new THREE.Group();scene.add(glu);const gl=[];for(let i=0;i<22;i++){const p=pal[(i*7+3)%pal.length];if(p.z<-3){continue;}const m=molMesh('glucose',.0001);m.position.set(p.x+(R()-.5)*.2,p.y+(R()-.5)*.9,p.z+.15);glu.add(m);gl.push(m);}W.glucose=gl;
 const starch=new THREE.Group();scene.add(starch);for(let i=0;i<10;i++){const m=molMesh('glucose',.16);m.position.set(-.6+i*.24,1.85+Math.sin(i)*.12,1.6);m.rotation.z=i*.3;starch.add(m);}starch.visible=false;W.starch=starch;
 W.spots={cuticle:V(-5,3.42,2.2),epi:V(-6.5,3.02,2.2),pal:V(-1.1,1.85,2.1),spongy:V(5,.5,2.2),vein:V(vx,vy,ZE),xylem:V(vx+.05,vy+.35,ZE),phloem:V(vx+.15,vy-.45,ZE),stoma:V(2.4,-.62,1.5),lower:V(-5.5,-.62,2.2),chl:V(-2.2,2.3,2.25)};
 W.update=(dt,t)=>{mo.userData.update(t);Object.values(W.mol).forEach(f=>f.update(dt,t));sh.forEach(s=>s.userData.update(t));
  if(W.glow!==undefined){chM.emissiveIntensity=lerp(chM.emissiveIntensity,W.glow?.45+Math.sin(t*3)*.15:.2,Math.min(1,dt*3));}
  const open=W.open??1;gcs.forEach((g,i)=>{g.position.x=2.4+(i?1:-1)*(.05+open*.14);});};
 W.quality=q=>{};
 return W;}

import * as THREE from 'three';
import {V,rng,lerp,curve,taperTube,leafGeometry,canvasTex} from './lib.js';
/* Nepenthes-style pitcher plant. Returns {group, pitchers:[{g,body,lid,mouth,juice,bodyMat}], ant, setXray(k)} */
export function makePitcherPlant(){
 const g=new THREE.Group(),R=rng(91);
 const leafM=new THREE.MeshStandardMaterial({color:'#4a8a2c',roughness:.6,side:THREE.DoubleSide,emissive:'#1d3a10',emissiveIntensity:.35});
 const tendM=new THREE.MeshStandardMaterial({color:'#7a9a3a',roughness:.6});
 const bodyT=canvasTex(512,512,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#5d8a2c');gr.addColorStop(.55,'#8fb24a');gr.addColorStop(1,'#a8c060');c.fillStyle=gr;c.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){c.fillStyle=`rgba(${140+R()*60|0},${30+R()*30|0},${40+R()*20|0},${.35+R()*.5})`;const x=R()*w,y=R()*h*.95;c.beginPath();c.ellipse(x,y,2+R()*7,1.5+R()*5,R()*3,0,7);c.fill();}
  c.strokeStyle='rgba(60,90,30,.5)';c.lineWidth=3;for(let x=0;x<w;x+=w/10){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}});
 const periT=canvasTex(512,64,(c,w,h)=>{c.fillStyle='#7d1424';c.fillRect(0,0,w,h);for(let x=0;x<w;x+=6){c.fillStyle=x%12?'#a52a35':'#5a0d18';c.fillRect(x,0,3,h);}},{});periT.wrapS=THREE.RepeatWrapping;periT.repeat.set(3,1);
 const lidT=canvasTex(256,256,(c,w,h)=>{c.fillStyle='#8fae48';c.fillRect(0,0,w,h);for(let i=0;i<300;i++){c.fillStyle='rgba(150,35,45,.7)';c.beginPath();c.arc(R()*w,R()*h,2+R()*5,0,7);c.fill();}});
 // rosette of strap leaves
 const LG=leafGeometry({len:1,width:.22,cup:.25,curl:.15,segU:18,segV:6});
 const pitchers=[];
 const N=7;
 for(let i=0;i<N;i++){const a=i/N*Math.PI*2+R()*.3,L=.13+R()*.05;const lf=new THREE.Mesh(LG,leafM);lf.scale.set(L,L,L*1.3);lf.position.y=.008;lf.rotation.set(0,a,.25+R()*.2);lf.castShadow=true;g.add(lf);
  if(i%2===0&&pitchers.length<3){ // tendril from leaf tip, curling down to a pitcher
   const tip=V(Math.cos(a)*L*.95,.008+L*.18,-Math.sin(a)*L*.95),dir=V(Math.cos(a),0,-Math.sin(a));
   const end=tip.clone().addScaledVector(dir,.05).setY(.0);
   const tc=curve([tip,tip.clone().addScaledVector(dir,.03).setY(tip.y+.01),tip.clone().addScaledVector(dir,.055).setY(.03),end.clone().setY(.012)]);
   g.add(new THREE.Mesh(taperTube(tc,{r0:.0018,r1:.0014,seg:24,radial:6}),tendM));
   const P=new THREE.Group();P.position.copy(end);P.rotation.y=a;const s=.85+R()*.3;P.scale.setScalar(s);g.add(P);
   const prof=[[0,0],[.012,.001],[.022,.012],[.026,.03],[.022,.05],[.016,.062],[.017,.072],[.02,.08]];
   const bodyMat=new THREE.MeshPhysicalMaterial({map:bodyT,roughness:.45,clearcoat:.6,side:THREE.DoubleSide,transparent:true,opacity:1});
   const body=new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x,y])=>new THREE.Vector2(x,y)),40),bodyMat);body.castShadow=true;P.add(body);
   const peri=new THREE.Mesh(new THREE.TorusGeometry(.02,.0032,10,40),new THREE.MeshPhysicalMaterial({map:periT,roughness:.25,clearcoat:1}));peri.rotation.x=Math.PI/2;peri.position.y=.08;P.add(peri);
   const juice=new THREE.Mesh(new THREE.CylinderGeometry(.021,.014,.018,28),new THREE.MeshPhysicalMaterial({color:'#c8d27a',roughness:.1,transparent:true,opacity:.75}));juice.position.y=.012;P.add(juice);
   const lid=new THREE.Mesh(new THREE.SphereGeometry(.024,24,10,0,Math.PI*2,0,Math.PI/2.6).scale(1,.25,1.15),new THREE.MeshStandardMaterial({map:lidT,roughness:.5,side:THREE.DoubleSide}));
   lid.position.set(0,.095,-.012);lid.rotation.x=-.5;lid.castShadow=true;P.add(lid);
   const spur=new THREE.Mesh(new THREE.ConeGeometry(.002,.012,6),tendM);spur.position.set(0,.093,-.03);spur.rotation.x=-1;P.add(spur);
   pitchers.push({g:P,body,lid,juice,bodyMat,mouth:V(0,.082,0)});}}
 // ant
 const ant=new THREE.Group(),am=new THREE.MeshStandardMaterial({color:'#1a1210',roughness:.4});
 [[-.0035,.0016],[0,.0012],[.0038,.0019]].forEach(([x,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),am);s.position.x=x;s.scale.set(1.2,.9,.9);ant.add(s);});
 for(let k=0;k<6;k++){const l=new THREE.Mesh(new THREE.CylinderGeometry(.00025,.00025,.004,4),am);l.position.set((k%3-1)*.0015,-.0008,(k<3?1:-1)*.0016);l.rotation.x=(k<3?1:-1)*1.0;ant.add(l);}
 ant.scale.setScalar(1.7);ant.visible=false;g.add(ant);
 const api={group:g,pitchers,ant,
  setXray(k){pitchers.forEach(p=>{p.bodyMat.opacity=1-.7*k;p.bodyMat.depthWrite=k<.5;p.bodyMat.clearcoat=.6*(1-k);p.bodyMat.roughness=.45+.4*k;});},
  world(i,local){const p=pitchers[i].g;p.updateWorldMatrix(true,false);return (local||V(0,.05,0)).clone().applyMatrix4(p.matrixWorld);}};
 return api;}

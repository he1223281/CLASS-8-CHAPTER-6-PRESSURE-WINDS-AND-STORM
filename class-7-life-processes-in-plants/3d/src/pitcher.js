import * as THREE from 'three';
import {V,rng,lerp,curve,taperTube,leafGeometry,canvasTex,leafTex} from './lib.js';
/* Nepenthes pitcher plant (potted). Local units: pitcher ~0.1 tall. Front of each pitcher = +z in its own frame. */
const PROF=[[0,0],[.010,.002],[.019,.008],[.0245,.02],[.0245,.033],[.0205,.046],[.0158,.057],[.0148,.067],[.0158,.078],[.0176,.088]];
const TOP=.088,RT=.0176,TILT=.5;
const tiltY=(y,z)=>y+Math.max(0,-z)*TILT*Math.max(0,Math.min(1,(y-.05)/.038));
function pitcherGeo(scale=1,side){const g=new THREE.LatheGeometry(PROF.map(([x,y])=>new THREE.Vector2(x*scale,y)),56,12);const p=g.attributes.position;
 for(let i=0;i<p.count;i++)p.setY(i,tiltY(p.getY(i),p.getZ(i)/scale*1));g.computeVertexNormals();return g;}
export function makePitcherPlant(){
 const g=new THREE.Group(),R=rng(91);
 const leafM=new THREE.MeshPhysicalMaterial({map:leafTex({base:'#2e7a2c',light:'#4f9a38',vein:'#b8d98a',seed:5}),roughness:.35,clearcoat:.5,side:THREE.DoubleSide});
 const tendM=new THREE.MeshStandardMaterial({color:'#6f8f34',roughness:.55});
 const bodyT=canvasTex(512,512,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#6a9a2e');gr.addColorStop(.5,'#9cbc4c');gr.addColorStop(1,'#b8c860');c.fillStyle=gr;c.fillRect(0,0,w,h);
  for(let i=0;i<650;i++){const y=R()*h,k=y/h;c.fillStyle=`rgba(${120+R()*50|0},${18+R()*25|0},${30+R()*20|0},${.35+.5*(1-k)*R()+.15})`;c.beginPath();c.ellipse(R()*w,y,3+R()*10,2+R()*6,R()*3,0,7);c.fill();}
  c.strokeStyle='rgba(70,100,30,.45)';c.lineWidth=2;for(let x=0;x<w;x+=w/14){c.beginPath();c.moveTo(x,0);c.lineTo(x+6,h);c.stroke();}});
 const periT=canvasTex(1024,32,(c,w,h)=>{for(let x=0;x<w;x+=8){const gr=c.createLinearGradient(x,0,x+8,0);gr.addColorStop(0,'#5a0a16');gr.addColorStop(.5,'#c0303e');gr.addColorStop(1,'#5a0a16');c.fillStyle=gr;c.fillRect(x,0,8,h);}});
 const lidT=canvasTex(256,256,(c,w,h)=>{c.fillStyle='#93b04a';c.fillRect(0,0,w,h);for(let i=0;i<220;i++){c.fillStyle=`rgba(150,30,40,${.4+R()*.5})`;c.beginPath();c.arc(R()*w,R()*h,2+R()*6,0,7);c.fill();}});
 const bodyGeo=pitcherGeo(1),innerGeo=pitcherGeo(.9);
 // rim curve (slanted mouth)
 const rimPt=(a,r=RT)=>V(r*Math.sin(a),tiltY(TOP,r*Math.cos(a))+.001,r*Math.cos(a));
 const rimCurve=new THREE.CatmullRomCurve3(Array.from({length:48},(_,i)=>rimPt(i/48*Math.PI*2)),true);
 const periGeo=new THREE.TubeGeometry(rimCurve,160,.0034,12,true);
 // leaves: rosette of long glossy leaves
 const LG=leafGeometry({len:1,width:.26,cup:.28,curl:.22,segU:24,segV:8});
 const pitchers=[];const N=8;
 for(let i=0;i<N;i++){const a=i/N*Math.PI*2+R()*.25,L=.17+R()*.05;const lf=new THREE.Mesh(LG,leafM);lf.scale.set(L,L,L);lf.position.y=.012;lf.rotation.set(0,a,.32+R()*.15);lf.castShadow=true;g.add(lf);lf.updateMatrix();
  if(i%3===0&&pitchers.length<3){const tip=V(1,-.22,0).applyMatrix4(lf.matrix);
   const out=V(Math.cos(a),0,-Math.sin(a)),rad=Math.hypot(tip.x,tip.z)+.025;
   const P=new THREE.Group();const base=V(out.x*rad,-.05-pitchers.length*.012,out.z*rad);P.position.copy(base);P.rotation.y=Math.atan2(out.x,out.z);const s=.95+R()*.15;P.scale.setScalar(s);g.add(P);
   const bodyMat=new THREE.MeshPhysicalMaterial({map:bodyT,roughness:.4,clearcoat:.5,transparent:true,opacity:1});
   const body=new THREE.Mesh(bodyGeo,bodyMat);body.castShadow=true;P.add(body);
   const innerMat=new THREE.MeshStandardMaterial({color:'#dfe6a8',roughness:.25,side:THREE.BackSide,transparent:true,opacity:1});const inner=new THREE.Mesh(innerGeo,innerMat);P.add(inner);
   const peri=new THREE.Mesh(periGeo,new THREE.MeshPhysicalMaterial({map:periT,roughness:.2,clearcoat:1}));peri.castShadow=true;P.add(peri);
   // wings: two fringed ridges down the front
   [-1,1].forEach(sd=>{const pts=[];for(let k=0;k<=10;k++){const y=.012+k*.007;let r=.0245;for(let j=0;j<PROF.length-1;j++)if(y>=PROF[j][1]&&y<=PROF[j+1][1]){const t=(y-PROF[j][1])/(PROF[j+1][1]-PROF[j][1]);r=lerp(PROF[j][0],PROF[j+1][0],t);}pts.push(V(sd*.0055,y,r+.0016));}
    P.add(new THREE.Mesh(taperTube(curve(pts),{r0:.0011,r1:.0009,seg:30,radial:5}),tendM));
    for(let k=1;k<10;k++){const q=pts[k],f=new THREE.Mesh(new THREE.ConeGeometry(.0006,.004,4),tendM);f.position.copy(q).add(V(sd*.0016,0,.0008));f.rotation.z=-sd*1.3;P.add(f);}});
   // lid hinged at back, raised over the mouth
   const back=rimPt(Math.PI);const lid=new THREE.Group();lid.position.copy(back).add(V(0,.002,0));P.add(lid);
   const lidM=new THREE.Mesh(new THREE.SphereGeometry(.021,28,12,0,Math.PI*2,0,Math.PI/2.4).scale(1.05,.22,1.25),new THREE.MeshPhysicalMaterial({map:lidT,roughness:.4,clearcoat:.4,side:THREE.DoubleSide}));
   lidM.position.set(0,.012,.016);lid.add(lidM);lid.rotation.x=-.95;lidM.castShadow=true;
   const neck=new THREE.Mesh(new THREE.CylinderGeometry(.0028,.0034,.012,10),tendM);neck.position.set(0,.005,0);lid.add(neck);
   const spur=new THREE.Mesh(new THREE.ConeGeometry(.0018,.009,6),tendM);spur.position.set(0,.004,-.004);spur.rotation.x=-2.2;lid.add(spur);
   const juice=new THREE.Mesh(new THREE.CylinderGeometry(.0215,.013,.02,32),new THREE.MeshPhysicalMaterial({color:'#c4cf6e',roughness:.08,clearcoat:1,transparent:true,opacity:.8}));juice.position.y=.013;P.add(juice);
   // tendril: from leaf tip, down with a coil, up into the back of the pitcher base
   P.updateMatrix();const att=V(0,.003,-.022).applyMatrix4(P.matrix),mid=tip.clone().lerp(att,.5);mid.y=Math.min(tip.y,att.y)-.03;
   const coil=[];for(let k=0;k<=10;k++){const t=k/10,an=t*Math.PI*2;coil.push(mid.clone().add(V(Math.cos(an)*.007*out.z,Math.sin(an)*.007,-Math.cos(an)*.007*out.x)));}
   const tc=curve([tip,tip.clone().add(V(out.x*.012,-.012,out.z*.012)),...coil.filter((_,k)=>k%2===0),att.clone().add(V(0,-.012,0)),att]);
   g.add(new THREE.Mesh(taperTube(tc,{r0:.0019,r1:.0015,seg:90,radial:6}),tendM));
   pitchers.push({g:P,body,inner,lid,juice,bodyMat,innerMat,tendrilMid:mid.clone(),mouth:V(0,TOP,0)});}}
 // ant
 const ant=new THREE.Group(),am=new THREE.MeshStandardMaterial({color:'#1a1210',roughness:.35});
 [[-.0035,.0016],[0,.0012],[.0038,.0019]].forEach(([x,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),am);s.position.x=x;s.scale.set(1.2,.9,.9);ant.add(s);});
 for(let k=0;k<6;k++){const l=new THREE.Mesh(new THREE.CylinderGeometry(.00025,.00025,.004,4),am);l.position.set((k%3-1)*.0015,-.0008,(k<3?1:-1)*.0016);l.rotation.x=(k<3?1:-1)*1.0;ant.add(l);}
 ant.visible=false;g.add(ant);
 const api={group:g,pitchers,ant,
  setXray(k){pitchers.forEach(p=>{p.bodyMat.opacity=1-.72*k;p.bodyMat.depthWrite=k<.5;p.bodyMat.clearcoat=.5*(1-k);p.innerMat.opacity=1-.8*k;p.innerMat.depthWrite=k<.5;});},
  world(i,local){const p=pitchers[i].g;p.updateWorldMatrix(true,false);return (local||V(0,.05,0)).clone().applyMatrix4(p.matrixWorld);},
  rim(i,a){return api.world(i,rimPt(a,RT+.0005).add(V(0,.0035,0)));},
  tendril(i){g.updateWorldMatrix(true,false);return pitchers[i].tendrilMid.clone().applyMatrix4(g.matrixWorld);},
  lidAt(i){return api.world(i,V(0,TOP+.03,-.004));}};
 return api;}

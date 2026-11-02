import * as THREE from 'three';
import {V,rng,curve,canvasTex} from '../lib.js';
import {Flow,motes} from '../fx.js';
/* inside a stem: xylem vessels (water up) and phloem tubes (food both ways); cut section on top */
export function makeStemWorld(){
 const scene=new THREE.Scene(),W={name:'stem',scene,exposure:1.05,bloom:[.5,.6,.72]};
 scene.background=new THREE.Color('#07120d');scene.fog=new THREE.FogExp2('#07120d',.05);
 scene.add(new THREE.HemisphereLight('#e2fff0','#0c1f15',1));const key=new THREE.DirectionalLight('#fff3d6',2);key.position.set(4,12,6);scene.add(key);
 const pl=new THREE.PointLight('#9ee6ff',25,18,2);pl.position.set(-3,4,4);scene.add(pl);
 const H=14,xs=[],ps=[];const R=rng(4);
 const ringTex=canvasTex(64,512,(g,w,h)=>{g.fillStyle='rgba(180,215,255,.18)';g.fillRect(0,0,w,h);g.strokeStyle='rgba(225,240,255,.9)';g.lineWidth=5;for(let y=0;y<h;y+=22){g.beginPath();g.moveTo(0,y);g.lineTo(w,y+11);g.stroke();}},{repeat:[1,6]});ringTex.wrapT=THREE.RepeatWrapping;
 const xm=new THREE.MeshPhysicalMaterial({map:ringTex,color:'#bcd9ff',roughness:.15,transparent:true,opacity:.75,depthWrite:false,side:THREE.DoubleSide,emissive:'#1b3f7a',emissiveIntensity:.35});W.xylemMat=xm;
 const pm=new THREE.MeshPhysicalMaterial({color:'#ffd08a',roughness:.25,transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide,emissive:'#6a3c00',emissiveIntensity:.3});
 for(let i=0;i<5;i++){const x=-2.2+i*1.1+(R()-.5)*.2,z=-.4+(R()-.5)*.6;const t=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,H,32,1,true),xm);t.position.set(x,0,z);scene.add(t);xs.push(V(x,0,z));}
 for(let i=0;i<4;i++){const x=-1.6+i*1.1,z=1.5;const t=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,H,24,1,true),pm);t.position.set(x,0,z);scene.add(t);ps.push(V(x,0,z));
  for(let y=-H/2+1;y<H/2;y+=2.2){const plate=new THREE.Mesh(new THREE.CircleGeometry(.29,20),new THREE.MeshStandardMaterial({color:'#e8b060',transparent:true,opacity:.6,side:THREE.DoubleSide}));plate.rotation.x=Math.PI/2;plate.position.set(x,y,z);scene.add(plate);}}
 // surrounding cells (cortex)
 const cg=new THREE.SphereGeometry(.5,16,12),cm=new THREE.MeshPhysicalMaterial({color:'#9fdc8f',roughness:.3,transparent:true,opacity:.22,depthWrite:false});const cells=new THREE.InstancedMesh(cg,cm,260),m4=new THREE.Matrix4(),q=new THREE.Quaternion();
 for(let i=0;i<260;i++){const a=R()*6.283,r=3.2+R()*2.2;m4.compose(V(Math.cos(a)*r,(R()-.5)*H,Math.sin(a)*r-1),q,V(1,1.6,1));cells.setMatrixAt(i,m4);}scene.add(cells);
 // cross-section disc on top
 const secT=canvasTex(1024,1024,()=>{});W.paintSection=(red)=>secT.redraw((g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='#4c9a4a';g.beginPath();g.arc(512,512,505,0,7);g.fill();g.fillStyle='#e6f3d6';g.beginPath();g.arc(512,512,470,0,7);g.fill();
   const R2=rng(2);for(let i=0;i<300;i++){g.strokeStyle='rgba(120,170,100,.35)';g.beginPath();g.arc(R2()*1024,R2()*1024,10+R2()*14,0,7);g.stroke();}
   for(let i=0;i<10;i++){const a=i/10*6.283,cx=512+Math.cos(a)*320,cy=512+Math.sin(a)*320;g.save();g.translate(cx,cy);g.rotate(a);g.fillStyle='#f2dcae';g.beginPath();g.ellipse(52,0,34,44,0,0,7);g.fill();g.fillStyle=red?'#d7334b':'#8fb3d9';g.beginPath();g.ellipse(-6,0,44,46,0,0,7);g.fill();
    g.fillStyle=red?'#8e1426':'#4f7fae';for(let k=0;k<6;k++){g.beginPath();g.arc(-6+(k%3-1)*22,(Math.floor(k/3)-.5)*30,10,0,7);g.fill();}g.restore();}});
 W.paintSection(false);
 const disc=new THREE.Mesh(new THREE.CircleGeometry(6,64),new THREE.MeshStandardMaterial({map:secT,roughness:.6}));disc.rotation.x=-Math.PI/2;disc.position.set(0,H/2+.02,0);scene.add(disc);
 const skin=new THREE.Mesh(new THREE.CylinderGeometry(6,6,H,64,1,true),new THREE.MeshStandardMaterial({color:'#3f8a45',roughness:.6,side:THREE.BackSide,transparent:true,opacity:.35}));scene.add(skin);
 const mo=motes(scene,{n:400,box:[V(-6,-7,-6),V(6,7,6)],size:.08,color:'#d8ffe8',opacity:.3});
 const water=new Flow(scene,{curves:xs.map(p=>curve([[p.x,-H/2,p.z],[p.x,H/2,p.z]])),kind:'water',n:60,size:.2,speed:.07,spread:.12,seed:3,on:false});
 const mins=new Flow(scene,{curves:xs.map(p=>curve([[p.x,-H/2,p.z],[p.x,H/2,p.z]])),kind:'mineral',n:24,size:.16,speed:.07,spread:.15,seed:5,on:false});
 const food=new Flow(scene,{curves:ps.map((p,i)=>curve(i%2?[[p.x,H/2,p.z],[p.x,-H/2,p.z]]:[[p.x,H/2,p.z],[p.x,-H/2,p.z]])),kind:'sugar',n:36,size:.2,speed:.05,spread:.08,seed:8,on:false});
 W.flows={water,mins,food};W.spots={xylem:V(xs[2].x+.42,1,xs[2].z),phloem:V(ps[1].x+.3,0,ps[1].z),top:V(0,H/2,0)};
 W.update=(dt,t)=>{mo.userData.update(t);Object.values(W.flows).forEach(f=>f.update(dt,t));ringTex.offset.y=-t*.05;};
 return W;}

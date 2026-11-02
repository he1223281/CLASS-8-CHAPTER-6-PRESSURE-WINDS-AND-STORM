import * as THREE from 'three';
import {V,rng,lerp,smooth,clamp,curve,taperTube,leafGeometry,leafTex,tintable} from './lib.js';
const LG=[leafGeometry({len:1,width:.46,cup:.14,curl:.22}),leafGeometry({len:1,width:.38,cup:.2,curl:.12}),leafGeometry({len:1,width:.5,cup:.1,curl:.3})];
const PETAL=leafGeometry({len:1,width:.8,cup:.25,curl:.1,segU:8,segV:4});
let TEX=null;
/* opts: H height, n leaves, leaf size, branches, flowers, roots, seed */
export function makePlant(opts={}){
 const o=Object.assign({seed:1,H:.7,n:18,leaf:.12,stemR:.011,branches:2,flowers:0,flowerColor:'#ffffff',roots:true,rootDepth:.38,rootSpread:.3,shadow:true,leafTex:null},opts);
 const R=rng(o.seed);TEX=TEX||leafTex({});
 const g=new THREE.Group(),inner=new THREE.Group();g.add(inner);
 const leafMat=tintable(new THREE.MeshStandardMaterial({map:o.leafTex||TEX,roughness:.5,side:THREE.DoubleSide,color:'#ffffff',emissive:'#1d4a14',emissiveIntensity:.45}));
 const stemMat=tintable(new THREE.MeshStandardMaterial({color:'#4f8f3a',roughness:.6}));
 const rootMat=new THREE.MeshStandardMaterial({color:'#d8c29b',roughness:.85});
 const mesh=(geo,m)=>{const x=new THREE.Mesh(geo,m);x.castShadow=o.shadow;x.receiveShadow=true;return x;};
 // main stem
 const pts=[];for(let i=0;i<=5;i++){const t=i/5;pts.push(V((R()-.5)*.04*t+Math.sin(t*2.4)*.015,t*o.H,(R()-.5)*.04*t));}
 const stem=curve(pts);inner.add(mesh(taperTube(stem,{r0:o.stemR,r1:o.stemR*.3,seg:40,radial:10}),stemMat));
 const leaves=[],P=V(),T=V();
 const addLeaf=(parent,pos,yaw,pitch,size,birth)=>{const lg=new THREE.Group();lg.position.copy(pos);lg.rotation.set(0,yaw,0);
  const pet=new THREE.Group();pet.rotation.z=pitch;lg.add(pet);
  const pl=size*.35,pc=curve([[0,0,0],[pl*.5,pl*.15,0],[pl,pl*.1,0]]);pet.add(mesh(taperTube(pc,{r0:o.stemR*.35,r1:o.stemR*.25,seg:6,radial:5}),stemMat));
  const lf=mesh(LG[Math.floor(R()*3)],leafMat);lf.position.set(pl,pl*.1,0);lf.scale.set(size,size,size*(.9+R()*.2));lf.rotation.x=(R()-.5)*.5;pet.add(lf);
  parent.add(lg);const L={g:lg,pet,leaf:lf,pitch,birth,size};leaves.push(L);return L;};
 for(let i=0;i<o.n;i++){const t=.1+.88*i/(o.n-1);stem.getPointAt(t,P);const yaw=i*2.4+R()*.3,size=o.leaf*(1.15-.55*t)*(.85+R()*.3);addLeaf(inner,P.clone(),yaw,.55-.25*t+R()*.2,size,t);}
 const branches=[];
 for(let b=0;b<o.branches;b++){const t=.38+b*.18;stem.getPointAt(t,P);const yaw=b*2.6+1,dx=Math.cos(yaw),dz=-Math.sin(yaw),L=o.H*.42;
  const bc=curve([P.clone(),V(P.x+dx*L*.4,P.y+L*.25,P.z+dz*L*.4),V(P.x+dx*L*.75,P.y+L*.55,P.z+dz*L*.75),V(P.x+dx*L*.9,P.y+L*.85,P.z+dz*L*.9)]);
  inner.add(mesh(taperTube(bc,{r0:o.stemR*.6,r1:o.stemR*.2,seg:24,radial:8}),stemMat));branches.push(bc);
  for(let k=0;k<5;k++){const tt=.25+k*.17;bc.getPointAt(tt,P);addLeaf(inner,P.clone(),yaw+(k%2?1.2:-1.2),.4,o.leaf*(.8-.3*tt),t+.1+tt*.3);}}
 const flowers=[];const fMat=new THREE.MeshStandardMaterial({color:o.flowerColor,roughness:.45,side:THREE.DoubleSide});
 const tips=[stem,...branches];
 for(let f=0;f<o.flowers;f++){const c=tips[f%tips.length];c.getPointAt(1,P);const fg=new THREE.Group();fg.position.copy(P);
  for(let k=0;k<5;k++){const p=mesh(PETAL,fMat);p.scale.setScalar(o.leaf*.35);p.rotation.set(0,k*1.2566,.35);fg.add(p);}
  const cen=mesh(new THREE.SphereGeometry(o.leaf*.07,12,8),new THREE.MeshStandardMaterial({color:'#ffc93d',roughness:.6}));fg.add(cen);fg.rotation.z=-.25;inner.add(fg);flowers.push(fg);}
 // roots
 const roots=[];
 if(o.roots){const rg=new THREE.Group();inner.add(rg);
  const tap=curve([[0,0,0],[.005,-o.rootDepth*.35,0],[-.01,-o.rootDepth*.7,.01],[0,-o.rootDepth,0]]);rg.add(mesh(taperTube(tap,{r0:o.stemR*.9,r1:o.stemR*.15,seg:24,radial:8}),rootMat));roots.push(tap);
  const hair=[];
  for(let i=0;i<11;i++){const d=.04+i/11*o.rootDepth*.8,a=i*2.2+R(),L=o.rootSpread*(1-i/14)*(.6+R()*.5);const p0=V(0,-d,0);
   const pts=[p0];for(let k=1;k<=4;k++){const t=k/4;pts.push(V(Math.cos(a)*L*t+(R()-.5)*.03,-d-t*L*.55-(R()*.03),Math.sin(a)*L*t*.6+(R()-.5)*.03));}
   const rc=curve(pts);roots.push(rc);rg.add(mesh(taperTube(rc,{r0:o.stemR*.4,r1:o.stemR*.06,seg:16,radial:6}),rootMat));
   for(let k=0;k<26;k++){const t=.45+R()*.55,q=rc.getPointAt(t),dir=V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(.012+R()*.012);hair.push(q.x,q.y,q.z,q.x+dir.x,q.y+dir.y,q.z+dir.z);}}
  const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(hair,3));rg.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({color:'#efe2c4',transparent:true,opacity:.7})));
  g.userData.rootGroup=rg;}
 const api={group:g,inner,stem,branches,roots,leaves,flowers,leafMat,stemMat,rootMat,growth:1,droop:0,
  setGrowth(x){this.growth=x;inner.scale.setScalar(lerp(.28,1,x));for(const L of leaves){const s=smooth(L.birth*.85,L.birth*.85+.16,x);L.g.scale.setScalar(Math.max(1e-4,s));}
   for(const f of flowers){f.scale.setScalar(Math.max(1e-4,smooth(.85,1,x)));}if(g.userData.rootGroup)g.userData.rootGroup.scale.setScalar(lerp(.4,1,x));},
  setDroop(d){this.droop=d;for(const L of leaves)L.pet.rotation.z=L.pitch*(1-d)-d*1.25;inner.rotation.z=d*.18;},
  setTint(c,k){leafMat.setTint(c,k);stemMat.setTint(c,k*.7);leafMat.emissive.set('#1d4a14').lerp(new THREE.Color(c).multiplyScalar(.35),k);},
  showRoots(v){if(g.userData.rootGroup)g.userData.rootGroup.visible=v;},
  leafWorld(i){const L=leaves[clamp(i,0,leaves.length-1)];L.leaf.updateWorldMatrix(true,false);return V(.5,0,0).applyMatrix4(L.leaf.matrixWorld);},
  stemWorld(t){g.updateWorldMatrix(true,true);return stem.getPointAt(t).applyMatrix4(inner.matrixWorld);},
  sway(time,amp=1){inner.rotation.x=Math.sin(time*.9)*.012*amp;for(let i=0;i<leaves.length;i++){const L=leaves[i];L.leaf.rotation.z=Math.sin(time*1.7+i)*.05*amp;}}};
 api.setGrowth(1);return api;}

/* simple terracotta pot with soil */
export function makePot(r=.11,h=.16,{tex,dry=false}={}){const g=new THREE.Group();
 const prof=[[r*.62,0],[r*.66,.004],[r*.92,h*.82],[r*1.02,h*.84],[r*1.04,h],[r*.92,h],[r*.9,h*.86],[r*.6,.012]];
 const m=new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x,y])=>new THREE.Vector2(x,y)),48),new THREE.MeshStandardMaterial({map:tex,color:tex?'#ffffff':'#c4683f',roughness:.85,side:THREE.DoubleSide}));m.castShadow=m.receiveShadow=true;g.add(m);
 const soil=new THREE.Mesh(new THREE.CircleGeometry(r*.9,40),new THREE.MeshStandardMaterial({color:dry?'#a88a66':'#4a3220',roughness:1}));soil.rotation.x=-Math.PI/2;soil.position.y=h*.9;soil.receiveShadow=true;g.add(soil);g.userData.soil=soil;g.userData.top=h*.9;return g;}

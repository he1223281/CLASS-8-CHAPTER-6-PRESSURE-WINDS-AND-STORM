import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {V,rng,clamp,spriteTex,lerp} from './lib.js';
function colored(geo,c){const n=geo.attributes.position.count,col=new Float32Array(n*3),C=new THREE.Color(c);for(let i=0;i<n;i++){col[i*3]=C.r;col[i*3+1]=C.g;col[i*3+2]=C.b;}geo.setAttribute('color',new THREE.BufferAttribute(col,3));return geo;}
const S=(r,x=0,y=0,z=0,c='#fff')=>colored(new THREE.SphereGeometry(r,16,12).translate(x,y,z),c);
export const COL={co2:'#9aa3ad',o2:'#4fd1e3',water:'#3b8eea',glucose:'#f2a33a',mineral:'#b16ae0',photon:'#ffe27a',sugar:'#f2a33a'};
const GEO={};
function geo(k){if(GEO[k])return GEO[k];let g;
 if(k==='co2')g=mergeGeometries([S(.5,0,0,0,'#4a5058'),S(.4,-.78,0,0,'#b9c0c8'),S(.4,.78,0,0,'#b9c0c8')]);
 else if(k==='o2')g=mergeGeometries([S(.45,-.32,0,0,'#4fd1e3'),S(.45,.32,0,0,'#7fe3f0')]);
 else if(k==='water')g=mergeGeometries([S(.5,0,0,0,'#3b8eea'),S(.3,-.5,-.32,0,'#e8f2ff'),S(.3,.5,-.32,0,'#e8f2ff')]);
 else if(k==='glucose'||k==='sugar')g=colored(new THREE.CylinderGeometry(.6,.6,.28,6).rotateX(Math.PI/2),'#f2a33a');
 else if(k==='mineral')g=colored(new THREE.OctahedronGeometry(.45),'#b16ae0');
 else g=S(.5,0,0,0,'#ffe27a');
 return GEO[k]=g;}
const MAT={};
function mat(k){if(MAT[k])return MAT[k];
 const m=k==='photon'?new THREE.MeshBasicMaterial({color:'#ffe9a0',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})
  :new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:0,emissive:k==='glucose'||k==='sugar'?'#7a3d00':'#1a2a33',emissiveIntensity:k==='glucose'?.8:.6});
 return MAT[k]=m;}
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_e=new THREE.Euler(),_p=V(),_s=V();
/* particles that travel along one or many curves */
export class Flow{
 constructor(parent,o){this.o=Object.assign({kind:'water',n:24,size:.01,speed:.15,spread:0,seed:1,fade:.08,on:true,spin:1,loop:true},o);
  this.curves=o.curves||[o.curve];const R=rng(this.o.seed);
  this.mesh=new THREE.InstancedMesh(geo(this.o.kind),mat(this.o.kind),this.o.n);this.mesh.frustumCulled=false;this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);parent.add(this.mesh);this.parent=parent;
  this.ps=[];for(let i=0;i<this.o.n;i++)this.ps.push({c:i%this.curves.length,u:R(),off:V(R()-.5,R()-.5,R()-.5).multiplyScalar(this.o.spread*2),s:.75+R()*.5,r:R()*6});
  this.a=this.o.on?1:0;this.on=this.o.on;}
 set(v){this.on=v;return this;}
 update(dt,t){this.a=clamp(this.a+(this.on?dt*2:-dt*2),0,1);this.mesh.visible=this.a>0;if(!this.mesh.visible)return;const f=this.o.fade;
  for(let i=0;i<this.ps.length;i++){const p=this.ps[i];p.u+=dt*this.o.speed*p.s;if(p.u>1)p.u=this.o.loop?p.u%1:1;
   this.curves[p.c].getPointAt(p.u,_p).add(p.off);const e=Math.min(1,p.u/f,(1-p.u)/f)*this.a;_s.setScalar(this.o.size*Math.max(e,0));
   _e.set(p.r+t*this.o.spin*p.s,p.r*2+t*.7*this.o.spin,0);_q.setFromEuler(_e);_m.compose(_p,_q,_s);this.mesh.setMatrixAt(i,_m);}
  this.mesh.instanceMatrix.needsUpdate=true;}
 dispose(){this.parent.remove(this.mesh);this.mesh.dispose();}}
/* floating molecules inside a box, random drift */
export class Drift{
 constructor(parent,o){this.o=Object.assign({kind:'co2',n:20,size:.01,box:[V(-1,-1,-1),V(1,1,1)],speed:.05,seed:2,on:true},o);const R=rng(this.o.seed),[a,b]=this.o.box;
  this.mesh=new THREE.InstancedMesh(geo(this.o.kind),mat(this.o.kind),this.o.n);this.mesh.frustumCulled=false;parent.add(this.mesh);this.parent=parent;
  this.ps=[];for(let i=0;i<this.o.n;i++)this.ps.push({p:V(lerp(a.x,b.x,R()),lerp(a.y,b.y,R()),lerp(a.z,b.z,R())),v:V(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(this.o.speed),r:R()*6,alive:1});
  this.on=this.o.on;this.a=this.on?1:0;}
 set(v){this.on=v;return this;}
 update(dt,t){this.a=clamp(this.a+(this.on?dt*2:-dt*2),0,1);this.mesh.visible=this.a>0;if(!this.mesh.visible)return;const [a,b]=this.o.box;
  for(let i=0;i<this.ps.length;i++){const p=this.ps[i];p.p.addScaledVector(p.v,dt);for(const k of ['x','y','z']){if(p.p[k]<a[k]||p.p[k]>b[k])p.v[k]*=-1;}
   if(this.o.sink&&p.alive>0){p.p.y-=dt*this.o.sink;if(p.p.y<this.o.sinkY)p.alive=Math.max(0,p.alive-dt*3);}
   _s.setScalar(this.o.size*this.a*p.alive);_e.set(p.r+t*.5,p.r+t*.3,0);_q.setFromEuler(_e);_m.compose(p.p,_q,_s);this.mesh.setMatrixAt(i,_m);}
  this.mesh.instanceMatrix.needsUpdate=true;}
 reset(){this.ps.forEach(p=>p.alive=1);}
 dispose(){this.parent.remove(this.mesh);this.mesh.dispose();}}
/* rising bubbles */
export class Bubbles{
 constructor(parent,o){this.o=Object.assign({n:40,size:.004,rate:8,emit:()=>V(),top:()=>1,funnel:null,on:true,seed:3},o);this.R=rng(this.o.seed);
  this.mesh=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.05,clearcoat:1,transparent:true,opacity:.55,depthWrite:false}),this.o.n);
  this.mesh.frustumCulled=false;parent.add(this.mesh);this.parent=parent;this.ps=[];this.acc=0;this.on=this.o.on;this.popped=0;}
 set(v){this.on=v;return this;}
 update(dt,t){if(this.on){this.acc+=dt*this.o.rate;while(this.acc>1&&this.ps.length<this.o.n){this.acc--;this.ps.push({p:this.o.emit(this.R),v:.03+this.R()*.03,s:this.o.size*(.6+this.R()*.8),w:this.R()*6});}}
  const top=this.o.top();this.ps=this.ps.filter(b=>{b.p.y+=b.v*dt;if(this.o.funnel)this.o.funnel(b.p,dt);b.p.x+=Math.sin(t*6+b.w)*.0006;if(b.p.y>top){this.popped++;return false;}return true;});
  for(let i=0;i<this.o.n;i++){const b=this.ps[i];if(b){_s.setScalar(b.s);_m.compose(b.p,_q.identity(),_s);}else _m.makeScale(0,0,0);this.mesh.setMatrixAt(i,_m);}
  this.mesh.instanceMatrix.needsUpdate=true;}
 dispose(){this.parent.remove(this.mesh);this.mesh.dispose();}}
/* soft additive motes */
let SPR=null;
export function motes(parent,{n=400,box=[V(-2,0,-2),V(2,2,2)],size=.02,color='#fff3c4',opacity=.7,seed=4}={}){SPR=SPR||spriteTex();const R=rng(seed),pos=new Float32Array(n*3),[a,b]=box;
 for(let i=0;i<n;i++){pos[i*3]=lerp(a.x,b.x,R());pos[i*3+1]=lerp(a.y,b.y,R());pos[i*3+2]=lerp(a.z,b.z,R());}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const p=new THREE.Points(g,new THREE.PointsMaterial({map:SPR,size,color,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true}));p.frustumCulled=false;parent.add(p);
 const base=pos.slice();p.userData.update=(t)=>{for(let i=0;i<n;i++){pos[i*3]=base[i*3]+Math.sin(t*.13+i)*.08;pos[i*3+1]=base[i*3+1]+Math.sin(t*.09+i*1.7)*.06;}g.attributes.position.needsUpdate=true;};return p;}
/* volumetric-looking light shaft */
export function shaft(parent,from,to,{r0=.05,r1=.3,color='#fff2c0',opacity=.22}={}){const len=from.distanceTo(to);
 const geo=new THREE.CylinderGeometry(r0,r1,len,24,1,true).translate(0,-len/2,0);
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uC:{value:new THREE.Color(color)},uO:{value:opacity},uT:{value:0}},
  vertexShader:'varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vec4 w=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-w.xyz);gl_Position=projectionMatrix*w;}',
  fragmentShader:'uniform vec3 uC;uniform float uO;uniform float uT;varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){float f=pow(abs(dot(vN,vV)),1.6);float l=smoothstep(0.,.25,vUv.y)*smoothstep(1.,.6,vUv.y);float s=.75+.25*sin(vUv.x*40.+uT*.6);gl_FragColor=vec4(uC,uO*f*l*s);}'});
 const mesh=new THREE.Mesh(geo,m);mesh.position.copy(from);mesh.quaternion.setFromUnitVectors(V(0,-1,0),to.clone().sub(from).normalize());parent.add(mesh);mesh.userData.update=t=>m.uniforms.uT.value=t;return mesh;}
export function molMesh(kind,size){const m=new THREE.Mesh(geo(kind),mat(kind));m.scale.setScalar(size);return m;}

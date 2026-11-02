import * as THREE from 'three';
export const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
export const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}

/* ---------- canvas textures ---------- */
export function canvasTex(w,h,draw,o={}){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
 const t=new THREE.CanvasTexture(c);if(o.srgb!==false)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
 if(o.repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(o.repeat[0],o.repeat[1]);}
 t.redraw=fn=>{fn(g,w,h);t.needsUpdate=true;};t.ctx=g;return t;}
function noise(g,w,h,n,cols,rmin,rmax,R,alpha=1){for(let i=0;i<n;i++){g.globalAlpha=alpha*(.3+R()*.7);g.fillStyle=cols[Math.floor(R()*cols.length)];const r=rmin+R()*(rmax-rmin);g.beginPath();g.ellipse(R()*w,R()*h,r,r*(.5+R()*.8),R()*3,0,7);g.fill();}g.globalAlpha=1;}
/* leaf: paint(state) draws a leaf colour map. u along length -> x */
export function paintLeaf(g,w,h,o={}){
 const R=rng(o.seed||3),base=o.base||'#3d9a48',light=o.light||'#6cc35f',vein=o.vein||'#b7e39a';
 const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,base);gr.addColorStop(.5,light);gr.addColorStop(1,base);g.fillStyle=gr;g.fillRect(0,0,w,h);
 noise(g,w,h,900,[base,light,'#2f7d3a'],1,4,R,.25);
 g.strokeStyle=vein;g.lineCap='round';
 g.lineWidth=h*.03;g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();
 for(let i=1;i<9;i++){const x=w*i/9.5;g.lineWidth=h*.012;g.globalAlpha=.85;for(const s of [-1,1]){g.beginPath();g.moveTo(x,h/2);g.quadraticCurveTo(x+w*.06,h/2+s*h*.22,x+w*.14,h/2+s*h*.46);g.stroke();}}
 g.globalAlpha=.25;g.lineWidth=1;for(let i=0;i<260;i++){const x=R()*w,y=R()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+(R()-.5)*18,y+(R()-.5)*18);g.stroke();}g.globalAlpha=1;
}
export function leafTex(o){return canvasTex(512,256,(g,w,h)=>paintLeaf(g,w,h,o));}
export function soilTex(){return canvasTex(1024,512,(g,w,h)=>{const R=rng(9);const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#5b3d22');gr.addColorStop(.08,'#6e4a2a');gr.addColorStop(.5,'#7a5534');gr.addColorStop(1,'#4c321c');g.fillStyle=gr;g.fillRect(0,0,w,h);
 noise(g,w,h,5000,['#3f2814','#8b6440','#9a7550','#5a3c20'],1,4,R,.5);noise(g,w,h,220,['#a8a39a','#8c877e','#bcb3a5','#6d6a64'],4,14,R,.9);
 g.fillStyle='#3f6e2c';g.fillRect(0,0,w,10);noise(g,w,24,400,['#4c8a35','#2f5f22'],2,6,R,.9);},{repeat:[1,1]});}
export function groundTex(){return canvasTex(512,512,(g,w,h)=>{const R=rng(5);g.fillStyle='#4f7f33';g.fillRect(0,0,w,h);noise(g,w,h,5000,['#41702a','#5d8e3c','#6b9842','#3a6324','#7a8a45'],2,8,R,.5);noise(g,w,h,300,['#7d6a46','#6b5a3a'],3,10,R,.35);},{repeat:[60,60]});}
export function woodTex(){return canvasTex(1024,256,(g,w,h)=>{const R=rng(4);g.fillStyle='#a8774a';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=2){g.globalAlpha=.12+R()*.12;g.fillStyle=R()>.5?'#7d5532':'#c08e5c';g.fillRect(0,y,w,1+R()*2);}
 g.globalAlpha=.25;for(let i=0;i<40;i++){g.strokeStyle='#6b4528';g.lineWidth=1+R()*2;g.beginPath();const y=R()*h;g.moveTo(0,y);for(let x=0;x<w;x+=40)g.lineTo(x,y+Math.sin(x*.01+i)*6);g.stroke();}g.globalAlpha=1;
 for(let x=0;x<w;x+=w/4){g.fillStyle='rgba(60,35,15,.5)';g.fillRect(x,0,2,h);}},{repeat:[3,1]});}
export function potTex(){return canvasTex(512,256,(g,w,h)=>{const R=rng(2);g.fillStyle='#c4683f';g.fillRect(0,0,w,h);noise(g,w,h,2500,['#b35a34','#d27a4f','#a9502c','#cf8460'],1,3,R,.5);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,0,w,h*.18);});}
export function spriteTex(){return canvasTex(64,64,(g,w,h)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);});}
export function leafCardTex(){return canvasTex(128,128,(g,w,h)=>{g.clearRect(0,0,w,h);const R=rng(8);for(let i=0;i<7;i++){const x=20+R()*88,y=20+R()*88,a=R()*6;g.save();g.translate(x,y);g.rotate(a);const c=['#2f7d3a','#3d9a48','#4fae52','#2a6a30','#5cb85a'][i%5];g.fillStyle=c;g.beginPath();g.moveTo(-26,0);g.quadraticCurveTo(0,-14,26,0);g.quadraticCurveTo(0,14,-26,0);g.fill();g.strokeStyle='rgba(200,240,170,.4)';g.lineWidth=1.2;g.beginPath();g.moveTo(-24,0);g.lineTo(24,0);g.stroke();g.restore();}});}

/* ---------- geometry ---------- */
export function leafGeometry({len=1,width=.42,segU=16,segV=8,cup=.16,curl=.2}={}){
 const pos=[],uv=[],idx=[];
 for(let i=0;i<=segU;i++){const u=i/segU,w=width*Math.pow(Math.sin(Math.PI*Math.pow(u,.72)),.85);
  for(let j=0;j<=segV;j++){const v=j/segV*2-1;pos.push(u*len,v*v*cup*w-curl*u*u*len,v*w*.5);uv.push(u,(v+1)/2);}}
 for(let i=0;i<segU;i++)for(let j=0;j<segV;j++){const a=i*(segV+1)+j,b=a+segV+1;idx.push(a,b,a+1,b,b+1,a+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
export function taperTube(curve,{seg=48,radial=10,r0=.02,r1=.005,rf=null}={}){
 const fr=curve.computeFrenetFrames(seg,false),pos=[],nor=[],uv=[],idx=[],P=V(),n=V();
 for(let i=0;i<=seg;i++){const t=i/seg;curve.getPointAt(t,P);const r=rf?rf(t):lerp(r0,r1,t),N=fr.normals[i],B=fr.binormals[i];
  for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2,c=Math.cos(a),s=Math.sin(a);n.set(c*N.x+s*B.x,c*N.y+s*B.y,c*N.z+s*B.z);pos.push(P.x+r*n.x,P.y+r*n.y,P.z+r*n.z);nor.push(n.x,n.y,n.z);uv.push(j/radial,t);}}
 for(let i=0;i<seg;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;idx.push(a,b,a+1,b,b+1,a+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g;}
export const curve=pts=>new THREE.CatmullRomCurve3(pts.map(p=>Array.isArray(p)?V(...p):p));
export function lathe(profile,seg=48){return new THREE.LatheGeometry(profile.map(([x,y])=>new THREE.Vector2(x,y)),seg);}

/* ---------- materials ---------- */
/* adds uTint/uMix (diffuse blend) + optional uEmit to any standard material */
export function tintable(m){m.userData.tint={value:new THREE.Color('#ffffff')};m.userData.mix={value:0};
 m.onBeforeCompile=sh=>{sh.uniforms.uTint=m.userData.tint;sh.uniforms.uMix=m.userData.mix;
  sh.fragmentShader='uniform vec3 uTint;uniform float uMix;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n diffuseColor.rgb=mix(diffuseColor.rgb,uTint*(0.55+0.45*dot(diffuseColor.rgb,vec3(.6))),uMix);');};
 m.customProgramCacheKey=()=>'tint';m.setTint=(c,k)=>{m.userData.tint.value.set(c);m.userData.mix.value=k;};return m;}
export function glassMat(o={}){const m=new THREE.MeshPhysicalMaterial(Object.assign({color:'#f4f9ff',roughness:.03,metalness:0,envMapIntensity:1,clearcoat:1,clearcoatRoughness:.03,side:THREE.DoubleSide,transparent:true,opacity:.075,depthWrite:false,specularIntensity:1},o));m.userData.glass=true;return m;}
export function liquidMat(color,o={}){const k={};for(const x in o)if(!/^(transmission|attenuation|thickness|ior)/.test(x))k[x]=o[x];const c=new THREE.Color(color),l=c.getHSL({}).l;return new THREE.MeshPhysicalMaterial(Object.assign({color,roughness:.1,clearcoat:.6,transparent:true,opacity:l>.85?.3:.72,depthWrite:false,attenuationColor:new THREE.Color(color)},k));}

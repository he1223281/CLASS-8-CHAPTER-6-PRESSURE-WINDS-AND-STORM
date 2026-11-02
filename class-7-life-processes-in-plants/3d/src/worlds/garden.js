import * as THREE from 'three';
import {V,rng,lerp,smooth,clamp,curve,taperTube,groundTex,soilTex,leafCardTex,potTex,canvasTex} from '../lib.js';
import {makePlant,makePot} from '../plant.js';
import {motes,Flow,Drift} from '../fx.js';
export function hill(x,z){const r=Math.hypot(x,z),f=smooth(14,80,r);return f*(Math.sin(x*.03)*3.2+Math.cos(z*.04)*2.4+Math.sin((x+z)*.07)*1.2+2);}
function windify(m,amp,uT){m.onBeforeCompile=sh=>{sh.uniforms.uT=uT;sh.vertexShader='uniform float uT;varying float vH;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 vec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float h=clamp(position.y,0.,1.);vH=h;float w=sin(uT*1.7+ip.x*1.9+ip.z*1.3)*.6+sin(uT*2.9+ip.x*4.1-ip.z*2.)*.3;
 transformed.x+=w*${amp}*h*h;transformed.z+=w*${amp*.5}*h*h;`);
 sh.fragmentShader='varying float vH;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n diffuseColor.rgb*=mix(.42,1.12,vH);');};}
export function makeGarden(){
 const scene=new THREE.Scene(),W={name:'garden',scene,exposure:.72,bloom:[.28,.5,.9]};
 const uT={value:0},cut=new THREE.Plane(V(0,0,-1),1e4);W.cutPlane=cut;
 // sky + sun
 const su={uSun:{value:V(0,1,0)},uZen:{value:new THREE.Color()},uHor:{value:new THREE.Color()},uSunC:{value:new THREE.Color()},uK:{value:1}};
 const sky=new THREE.Mesh(new THREE.SphereGeometry(280,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:su,
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform vec3 uSun,uZen,uHor,uSunC;uniform float uK;varying vec3 vD;void main(){vec3 d=normalize(vD);float h=d.y;
   vec3 c=mix(uHor,uZen,pow(clamp(h,0.,1.),.5));c=mix(c,uHor*.85,smoothstep(0.,-.15,h));float sd=max(dot(d,normalize(uSun)),0.);
   c+=uSunC*(pow(sd,900.)*40.+pow(sd,60.)*.6+pow(sd,6.)*.18)*uK;gl_FragColor=vec4(c*(1.+.6*uK),1.);}`}));sky.renderOrder=-1;scene.add(sky);
 // clouds
 const ct=canvasTex(256,128,(g,w,h)=>{g.clearRect(0,0,w,h);const R=rng(77);for(let i=0;i<26;i++){const x=40+R()*176,y=60+R()*30-Math.abs(x-128)*.12,r=18+R()*26;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}});
 const clouds=[];for(let i=0;i<16;i++){const m=new THREE.SpriteMaterial({map:ct,transparent:true,opacity:.85,depthWrite:false,fog:false,color:'#ffffff'});const sp=new THREE.Sprite(m);const a=i/16*6.283+.3,r=170+(i%3)*25;sp.position.set(Math.cos(a)*r,32+(i*7)%26,Math.sin(a)*r);sp.scale.set(70+(i%4)*14,30+(i%3)*6,1);scene.add(sp);clouds.push(sp);}
 const sun=new THREE.DirectionalLight('#fff1d6',3.6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-1.6;sc.right=3.6;sc.top=2;sc.bottom=-1.6;sc.near=.5;sc.far=30;sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;
 scene.add(sun,sun.target);const hemi=new THREE.HemisphereLight('#bfdcff','#4a6a2c',.9);scene.add(hemi);
 scene.fog=new THREE.Fog('#d6e6ef',45,260);
 const C=x=>new THREE.Color(x),DAYZ=C('#2a78d8'),DAYH=C('#a8d2f2'),SETZ=C('#41609c'),SETH=C('#f7b77e'),NZ=C('#0a1230'),NH=C('#1c2846'),SC=C('#fff3d6'),SSC=C('#ffb070');
 W.setSun=(elev,az=200)=>{const phi=THREE.MathUtils.degToRad(90-elev),th=THREE.MathUtils.degToRad(az),p=new THREE.Vector3().setFromSphericalCoords(1,phi,th);su.uSun.value.copy(p);
  const day=smooth(-6,14,elev),gold=1-smooth(2,22,elev);su.uZen.value.copy(NZ).lerp(SETZ,day).lerp(DAYZ,day*(1-gold));su.uHor.value.copy(NH).lerp(SETH,day).lerp(DAYH,day*(1-gold));su.uSunC.value.copy(SC).lerp(SSC,gold);su.uK.value=day;
  clouds.forEach(c=>{c.material.color.copy(C('#2a3550')).lerp(C('#ffd2b0'),day).lerp(C('#ffffff'),day*(1-gold));c.material.opacity=.35+.5*day;});
  sun.color.copy(C('#fff1d6')).lerp(C('#ffb46e'),gold);
  sun.position.copy(p).multiplyScalar(12).add(V(.8,0,0));sun.target.position.set(.8,0,0);const d=smooth(-4,12,elev);sun.intensity=3.6*d;hemi.intensity=.25+.95*d;W.night=1-d;
  scene.fog.color.copy(su.uHor.value).multiplyScalar(.95);};
 W.setSun(32,215);
 // ground
 const gg=new THREE.PlaneGeometry(400,400,160,160).rotateX(-Math.PI/2),gp=gg.attributes.position;for(let i=0;i<gp.count;i++)gp.setY(i,hill(gp.getX(i),gp.getZ(i)));gg.computeVertexNormals();
 const ground=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({map:groundTex(),color:'#d9e6c4',roughness:1,clippingPlanes:[cut]}));ground.receiveShadow=true;scene.add(ground);
 // grass
 const bg=new THREE.PlaneGeometry(1,1,1,5).translate(0,.5,0),bp=bg.attributes.position;for(let i=0;i<bp.count;i++){const y=bp.getY(i);bp.setX(i,bp.getX(i)*Math.pow(1-y,.9));bp.setZ(i,y*y*.3);}bg.computeVertexNormals();
 const gm=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.75,side:THREE.DoubleSide,clippingPlanes:[cut]});windify(gm,.09,uT);
 const NG=110000,grass=new THREE.InstancedMesh(bg,gm,NG);grass.receiveShadow=true;const R=rng(3),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),c=new THREE.Color();
 const clear=[[0,0,.09],[2.05,.55,.16],[2.4,.55,.16],[2.75,.55,.16]];
 for(let i=0;i<NG;i++){let x,z,ok=false;while(!ok){const r=Math.sqrt(R())*(i<NG*.55?3.2:11),a=R()*6.283;x=Math.cos(a)*r;z=Math.sin(a)*r;ok=!clear.some(([cx,cz,cr])=>Math.hypot(x-cx,z-cz)<cr)&&!(x>1.68&&x<3.12&&z>.24&&z<.86);}
  const rr=Math.hypot(x,z),h=rr<4.2?.02+R()*R()*.055:.05+R()*R()*.15;e.set(0,R()*6.28,(R()-.5)*.35);q.setFromEuler(e);m4.compose(V(x,hill(x,z),z),q,V(.006+R()*.006,h,1));grass.setMatrixAt(i,m4);
  c.setHSL(.24+R()*.07,.5+R()*.2,.28+R()*.16);grass.setColorAt(i,c);}
 scene.add(grass);
 // trees (instanced leaf cards)
 const lct=leafCardTex(),lm=new THREE.MeshStandardMaterial({map:lct,alphaTest:.5,side:THREE.DoubleSide,roughness:.7,color:'#d8f0c8'});windify(lm,.05,uT);
 const trees=[[-6,-9,1.25],[7,-12,1.5],[-13,-4,1.1],[12,-3,1.2],[-3,-20,1.7],[18,-18,1.6],[-20,-16,1.4],[-24,6,1.5],[25,4,1.6],[-9,16,1.3],[14,20,1.5]],leafMeshes=[];
 const barkM=new THREE.MeshStandardMaterial({color:'#6b4a33',roughness:.9});
 trees.forEach(([x,z,s],ti)=>{const y=hill(x,z),Rt=rng(ti+10),H=3.4*s;const tc=curve([[x,y,z],[x+.15,y+H*.4,z],[x-.1,y+H*.75,z+.1],[x,y+H,z]]);const tr=new THREE.Mesh(taperTube(tc,{r0:.22*s,r1:.08*s,seg:20}),barkM);tr.castShadow=true;scene.add(tr);
  const n=2600,im=new THREE.InstancedMesh(new THREE.PlaneGeometry(.5*s,.5*s).translate(0,.25*s,0),lm,n);im.castShadow=true;
  const clumps=[];for(let k=0;k<6;k++)clumps.push([x+(Rt()-.5)*2.4*s,y+H*.78+Rt()*1.6*s,z+(Rt()-.5)*2.4*s,(1+Rt()*.8)*s]);
  for(let i=0;i<n;i++){const [cx,cy,cz,cr]=clumps[i%6],d=V(Rt()-.5,Rt()-.5,Rt()-.5).normalize().multiplyScalar(cr*(.55+.45*Math.sqrt(Rt())));e.set(Rt()*6,Rt()*6,Rt()*6);q.setFromEuler(e);m4.compose(V(cx+d.x,cy+d.y*.8,cz+d.z),q,V(1,1,1));im.setMatrixAt(i,m4);c.setHSL(.25+Rt()*.06,.45,.3+Rt()*.2);im.setColorAt(i,c);}
  scene.add(im);leafMeshes.push(im);});
 // distant forest: trunks + rounded crowns, softened by fog
 const fm=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1}),cg=new THREE.IcosahedronGeometry(1,3),tg=new THREE.CylinderGeometry(.12,.2,1,8).translate(0,.5,0);
 const NF=160,crowns=new THREE.InstancedMesh(cg,fm,NF*3),trunks=new THREE.InstancedMesh(tg,new THREE.MeshStandardMaterial({color:'#4a3626',roughness:1}),NF);
 for(let i=0;i<NF;i++){const a=R()*6.283,r=32+R()*95,x=Math.cos(a)*r,z=Math.sin(a)*r;const s=2+R()*3.5,y=hill(x,z);
  if(z>15&&Math.abs(x)<35){m4.makeScale(0,0,0);trunks.setMatrixAt(i,m4);for(let k=0;k<3;k++)crowns.setMatrixAt(i*3+k,m4);continue;}
  m4.compose(V(x,y,z),q.identity(),V(s*.8,s*1.6,s*.8));trunks.setMatrixAt(i,m4);
  for(let k=0;k<3;k++){m4.compose(V(x+(R()-.5)*s*.9,y+s*1.7+R()*s*.8,z+(R()-.5)*s*.9),q.identity(),V(s*(.7+R()*.4),s*(.6+R()*.35),s*(.7+R()*.4)));crowns.setMatrixAt(i*3+k,m4);c.setHSL(.27+R()*.05,.35+R()*.15,.2+R()*.1);crowns.setColorAt(i*3+k,c);}}
 scene.add(trunks,crowns);
 // hero plant
 const hero=makePlant({seed:7,H:.62,n:22,leaf:.13,branches:2,flowers:3,rootDepth:.42,rootSpread:.34});hero.showRoots(false);scene.add(hero.group);W.hero=hero;
 // soil cutaway
 const st=soilTex();st.wrapS=THREE.RepeatWrapping;st.repeat.set(6,1);
 const soilFace=new THREE.Mesh(new THREE.PlaneGeometry(14,2.2),new THREE.MeshStandardMaterial({map:st,roughness:1,transparent:true,opacity:.8,depthWrite:false,emissive:'#6b4a2e',emissiveMap:st,emissiveIntensity:.55}));soilFace.position.set(0,-1.1,.02);soilFace.visible=false;scene.add(soilFace);
 const soilBack=new THREE.Mesh(new THREE.PlaneGeometry(14,2.2),new THREE.MeshStandardMaterial({color:'#5a3d24',roughness:1,emissive:'#2a1a0e',emissiveIntensity:.6}));soilBack.position.set(0,-1.1,-.9);soilBack.visible=false;scene.add(soilBack);
 W.setCut=v=>{cut.constant=v?.02:1e4;cut.normal.set(0,0,v?-1:-1);soilFace.visible=soilBack.visible=v;hero.showRoots(v);W.cutOn=v;};
 // nutrition props: mushrooms (saprotroph) and Cuscuta on a host plant (parasite)
 const nut=new THREE.Group();nut.visible=false;scene.add(nut);W.nut=nut;
 const capM=new THREE.MeshStandardMaterial({color:'#c9874f',roughness:.6}),stM=new THREE.MeshStandardMaterial({color:'#efe6d2',roughness:.8}),gillM=new THREE.MeshStandardMaterial({color:'#8a6a4a',roughness:.9,side:THREE.DoubleSide});
 const log=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.42,20).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:'#5a4130',roughness:1}));log.position.set(-.5,.04,.18);log.rotation.y=.35;log.castShadow=log.receiveShadow=true;nut.add(log);
 [[-.6,.08,.2,.035],[-.52,.08,.24,.028],[-.42,.075,.14,.04],[-.36,.0,.26,.03],[-.64,0,.3,.025]].forEach(([x,y,z,r],i)=>{const m=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(r*.28,r*.36,r*1.4,12).translate(0,r*.7,0),stM);
  const cp=new THREE.Mesh(new THREE.SphereGeometry(r,24,12,0,Math.PI*2,0,Math.PI/2).scale(1,.62,1),capM);cp.position.y=r*1.35;const gl=new THREE.Mesh(new THREE.CircleGeometry(r*.98,24).rotateX(Math.PI/2),gillM);gl.position.y=r*1.36;
  m.add(st,cp,gl);m.position.set(x,y,z);m.rotation.z=(i%2?.12:-.1);m.children.forEach(c=>c.castShadow=true);nut.add(m);});
 W.mushroomAt=V(-.47,.12,.2);
 const host=makePlant({seed:61,H:.34,n:12,leaf:.07,stemR:.006,branches:1,roots:false});host.group.position.set(.55,0,-.2);nut.add(host.group);
 const cm2=new THREE.MeshStandardMaterial({color:'#f2c230',roughness:.45,emissive:'#5a3a00',emissiveIntensity:.25});
 for(let k=0;k<3;k++){const pts=[];for(let i=0;i<=60;i++){const t=i/60,a=t*Math.PI*8+k*2.1,r=.012+.004*Math.sin(t*9);pts.push(V(.55+Math.cos(a)*r+(k-1)*.004,.02+t*.3,-.2+Math.sin(a)*r));}
  for(let i=0;i<6;i++)pts.push(V(.55+.05*Math.cos(k+i)+(i*.02),.32-i*.03,-.2+.05*Math.sin(k+i)));
  nut.add(new THREE.Mesh(taperTube(curve(pts),{r0:.0022,r1:.0016,seg:200,radial:6}),cm2));}
 W.cuscutaAt=V(.55,.2,-.2);W.hostAt=V(.6,.3,-.2);
 // pots patio
 const slab=new THREE.Mesh(new THREE.BoxGeometry(1.25,.04,.5),new THREE.MeshStandardMaterial({color:'#b9b2a4',roughness:.9}));slab.position.set(2.4,.02,.55);slab.receiveShadow=slab.castShadow=true;scene.add(slab);
 const ptex=potTex();W.pots=[];
 ['A','B','C'].forEach((k,i)=>{const pot=makePot(.075,.11,{tex:ptex,dry:k==='B'});pot.position.set(2.05+i*.35,.04,.55);scene.add(pot);
  const pl=makePlant({seed:20+i,H:.26,n:9,leaf:.055,stemR:.005,branches:0,roots:false});pl.group.position.set(2.05+i*.35,.04+pot.userData.top,.55);pl.setGrowth(.35);scene.add(pl.group);W.pots.push({k,pot,pl});});
 const box=new THREE.Mesh(new THREE.BoxGeometry(.3,.42,.3),new THREE.MeshStandardMaterial({color:'#8a6a45',roughness:.95}));box.position.set(2.75,.25,.55);box.castShadow=true;scene.add(box);W.darkBox=box;
 // watering can
 const can=new THREE.Group(),cm=new THREE.MeshStandardMaterial({color:'#2f7fd6',roughness:.35,metalness:.3});
 can.add(new THREE.Mesh(new THREE.CylinderGeometry(.05,.055,.1,28),cm));const sp=new THREE.Mesh(taperTube(curve([[.04,-.02,0],[.1,.03,0],[.15,.08,0]]),{r0:.008,r1:.006,seg:10,radial:8}),cm);can.add(sp);
 const hd=new THREE.Mesh(new THREE.TorusGeometry(.04,.006,8,24,Math.PI),cm);hd.position.set(-.02,.05,0);hd.rotation.z=.3;can.add(hd);can.children.forEach(x=>x.castShadow=true);can.position.set(1.78,.1,.62);can.rotation.y=.4;scene.add(can);
 // atmosphere
 const dust=motes(scene,{n:500,box:[V(-1.5,.05,-1.5),V(1.5,1.4,1.5)],size:.012,opacity:.55});
 // soil water & minerals (visible in cutaway)
 const sw=new Drift(scene,{kind:'water',n:40,size:.012,box:[V(-.5,-.45,.04),V(.5,-.04,.12)],speed:.01,seed:4,on:false}),sm=new Drift(scene,{kind:'mineral',n:18,size:.009,box:[V(-.5,-.45,.04),V(.5,-.04,.12)],speed:.01,seed:5,on:false});
 W.soilMols=[sw,sm];
 W.quality=q=>{grass.count=Math.min(NG,q.grass);leafMeshes.forEach(m=>m.count=Math.floor(2600*q.leaves));if(sun.shadow.mapSize.x!==q.shadow){sun.shadow.mapSize.set(q.shadow,q.shadow);sun.shadow.map?.dispose();sun.shadow.map=null;}};
 W.update=(dt,t)=>{uT.value=t;clouds.forEach((c,i)=>{c.position.x+=dt*.6;if(c.position.x>230)c.position.x=-230;});hero.sway(t);dust.userData.update(t);sw.update(dt,t);sm.update(dt,t);W.pots.forEach((p,i)=>p.pl.sway(t+i,.6));};
 W.enter=S=>{};
 return W;}

import * as THREE from 'three';
import {createEngine} from './core.js';
import {makeGarden} from './worlds/garden.js';
import {makeLab} from './worlds/lab.js';
import {makeLeafWorld} from './worlds/leaf.js';
import {makeStemWorld} from './worlds/stem.js';
import {B,SECTIONS} from './beats1.js';
import './beats2.js';import './beats3.js';import './beats4.js';
const $=s=>document.querySelector(s);
const bar=v=>{$('#lbarI').style.width=(v*100)+'%';};
const tick=()=>new Promise(r=>setTimeout(r,30));
(async()=>{
 const c=document.createElement('canvas');if(!(c.getContext('webgl2')||c.getContext('webgl'))){$('#nogl').hidden=false;$('#loader').classList.add('done');return;}
 const worlds={};$('#lstat').textContent='Growing the garden…';await tick();worlds.garden=makeGarden();bar(.35);
 $('#lstat').textContent='Setting up the laboratory…';await tick();worlds.lab=makeLab();bar(.55);
 $('#lstat').textContent='Shrinking down into a leaf…';await tick();worlds.leaf=makeLeafWorld();worlds.stem=makeStemWorld();bar(.7);
 const E=createEngine({worlds,beats:B,sections:SECTIONS});worlds.lab.init(E.renderer);
 $('#lstat').textContent='Compiling shaders…';await tick();
 for(const w of Object.values(worlds)){try{E.renderer.compile(w.scene,E.camera);}catch(e){}await tick();}bar(1);
 E.start();setTimeout(()=>$('#loader').classList.add('done'),600);
 window.__LP__=E;
})();

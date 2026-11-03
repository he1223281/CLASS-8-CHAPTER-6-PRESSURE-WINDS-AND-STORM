/* ---------- live 3D animations from the 3D lesson ---------- */
const MAP3D={auto:'modes',hetero:'modes',parasite:'others',sapro:'others',insect:'pitcher',symb:'symb',grow:'grow',a101:'pots',leafext:'leaf',leafts:'inside',a102:'starch',a103:'vari',pigm:'pigments',a104:'co2',psdef:'psintro',pssteps:'psleaf',a105:'oxy',stomata:'stomata',a106:'peel',trans:'section',a107:'ink',store:'phloem',a108:'resp',respeq:'respeq',compare:'compare',bottle:'jar'};
let V3=null;
function open3d(beat){
 if(!V3){V3=document.createElement('div');V3.id='v3d';V3.innerHTML=`<div id="v3load">Loading 3D animation…</div><button id="v3x">✕ Close 3D <small>(Esc)</small></button>`;document.body.appendChild(V3);
  const fr=document.createElement('iframe');fr.title='3D animation';fr.allow='fullscreen';
  const html=HTML3D.replace('<head>','<head><script>window.__START__='+JSON.stringify(beat)+';window.__Q3D="'+(window.__Q3DP||'high')+'"<\/script>');
  fr.src=URL.createObjectURL(new Blob([html],{type:'text/html'}));fr.onload=()=>setTimeout(()=>{$('#v3load').style.display='none';fr.focus();},400);
  V3.appendChild(fr);V3.fr=fr;$('#v3x').onclick=close3d;
  addEventListener('message',e=>{if(e.data&&e.data.close3d)close3d();});}
 else{V3.fr.contentWindow.postMessage({go:beat},'*');}
 V3.style.display='block';setTimeout(()=>{V3.fr.focus();try{V3.fr.contentWindow.focus();}catch(e){}},50);}
function close3d(){if(!V3)return;V3.style.display='none';try{V3.fr.contentWindow.postMessage({pause:true},'*');}catch(e){}window.focus();}
function add3d(el,o){const b=MAP3D[o.id];if(!b||o.bare)return;const bt=document.createElement('button');bt.className='b3d';bt.innerHTML='<span>▶</span> Watch in 3D';bt.onclick=e=>{e.stopPropagation();open3d(b);};el.appendChild(bt);}
addEventListener('keydown',e=>{if(V3&&V3.style.display==='block'&&e.key==='Escape')close3d();},true);

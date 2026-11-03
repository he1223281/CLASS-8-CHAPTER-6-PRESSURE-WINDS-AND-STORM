/* ---------- photo, figure, definition, note helpers ---------- */
let FIGN=0;
function credit(m){return m.credit.replace(/,? ?uploaded by.*$/,'').replace(/some rights reserved/,'').replace(/\(CC[^)]*\)/,'').replace(/no known copyright restrictions \(public domain\)/,'').replace(/[,\s]+$/,'').replace(/\s+/g,' ').trim();}
const PH=(k,cap,o={})=>{const m=IMG[k];return`<figure class="ph ${o.cls||''}" style="${o.h?`height:${o.h}px;`:''}${o.style||''}"><img src="${m.src}" alt="${cap}" style="object-position:${o.pos||'center'}"><figcaption><b>${cap}</b>${o.sci!==false?` <i>(${m.name})</i>`:''}<span>Photo: ${credit(m)} · ${m.lic} · iNaturalist</span></figcaption></figure>`;};
const FIG=(svg,cap,o={})=>`<figure class="dg ${o.cls||''}" style="${o.style||''}">${svg}<figcaption><b>Fig. ${++FIGN}:</b> ${cap}</figcaption></figure>`;
const DEF=(t,x,s)=>`<div class="defbox${s?' rv':''}"${s?` data-s="${s}"`:''}><div class="dt-h">Definition</div><p><b>${t}:</b> ${x}</p></div>`;
const NOTE=(a,s)=>`<div class="notebox${s?' rv':''}"${s?` data-s="${s}"`:''}><div class="nb-h">✎ Note it down</div><ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
const PTS=(a,s0)=>`<ul class="pts">${a.map((x,i)=>`<li${s0!=null?` class="rv" data-s="${s0+i}"`:''}>${x}</li>`).join('')}</ul>`;
/* SVG label with leader line; s>0 = revealed on that step */
const LB=(px,py,tx,ty,t,s=0,an='start')=>`<g${s?` class="rv" data-s="${s}"`:''}><line x1="${px}" y1="${py}" x2="${tx}" y2="${ty}" class="dl"/><circle cx="${px}" cy="${py}" r="4.5" class="dd"/><text x="${tx+(an==='end'?-8:an==='middle'?0:8)}" y="${ty+(an==='middle'?(ty<py?-10:26):7)}" text-anchor="${an}" class="dt">${t}</text></g>`;
const ARW=(d,c,w=5)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#mArrow)"/>`;
/* teacher's own video slot */
const VSLOT=(hint)=>`<div class="vslot"><div class="vs-in"><div class="vs-ico">▶</div><div><b>Play your own video</b><p>Click to choose a video saved on this laptop.<br>Suggested search: <i>${hint}</i></p></div></div><input type="file" accept="video/*" hidden><video controls playsinline hidden></video></div>`;
function wireVslots(el){$$('.vslot',el).forEach(v=>{const inp=$('input',v),vid=$('video',v);v.onclick=e=>{if(e.target===vid)return;inp.click();};inp.onchange=()=>{const f=inp.files[0];if(!f)return;vid.src=URL.createObjectURL(f);vid.hidden=false;$('.vs-in',v).style.display='none';vid.play().catch(()=>{});};});}
const VEMB=(k,cap,cr)=>`<figure class="vemb"><video src="${VIDS[k]}" controls loop muted playsinline></video><figcaption><b>${cap}</b><span>${cr}</span></figcaption></figure>`;

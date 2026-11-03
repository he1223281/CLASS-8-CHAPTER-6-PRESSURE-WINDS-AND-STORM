/* ===================== CREDITS ===================== */
S({id:'credits',sec:'Credits',title:'Photo and video credits',head:'Photo and video credits',
 notes:'All photographs are from iNaturalist under the licences shown (public domain or Creative Commons). Used for non-commercial classroom teaching with attribution.',
 html:`<div class="card" style="padding:24px 32px"><div class="cr-list">${Object.entries(IMG).map(([k,m])=>`<div><b>${m.name}</b> — ${credit(m)} · ${m.lic}</div>`).join('')}
  <div><b>Video: Oxalis time-lapse</b> — Grateful Hume (Flickr) · CC BY-NC-SA 2.0 · via Internet Archive</div></div>
  <p class="muted" style="font-size:18px;margin-top:14px">Photos: iNaturalist.org. Licences: PD/CC0 = public domain; CC BY = attribution; NC = non-commercial; SA = share-alike. Diagrams drawn for this lesson.</p></div>`});

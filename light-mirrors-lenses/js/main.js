'use strict';
/* Teaching order: seven parts, each finished before the next begins.
   Scenes register themselves in load order; here they are rearranged into the parts,
   and a short title slide opens each part. */
const PARTS = [
  { tab: 'Part 1', name: 'Plane mirrors: reflection and its laws', short: 'Laws of reflection',
    about: 'What reflection is, the words we use (incident ray, normal, angles) and the two laws of reflection.',
    ids: ['c-reflection', 'c-laws', 'laws', 'first-law'] },
  { tab: 'Part 2', name: 'Image formation in plane mirrors', short: 'Plane mirror images',
    about: 'Where the image in a plane mirror forms, why it is virtual, and its characteristics.',
    ids: ['c-plane', 'plane-lab'] },
  { tab: 'Part 3', name: 'Spherical mirrors', short: 'Spherical mirrors',
    about: 'Concave and convex mirrors, their parts (pole, centre of curvature, principal axis, focus) and what they do to parallel light.',
    ids: ['mystery', 'c-spherical', 'sphere', 'c-parts', 'terms', 'c-converge', 'parallel', 'sunlight'] },
  { tab: 'Part 4', name: 'Image formation by spherical mirrors', short: 'Mirror images',
    about: 'First the four special rays (parallel ray, ray through F, ray through C, ray at the pole) and why each behaves that way; then the image drawn step by step for every object position.',
    ids: ['ray-rule-1', 'ray-rule-2', 'ray-rule-3', 'ray-rule-4', 'image-case-1', 'image-case-2', 'image-case-3', 'image-case-4', 'image-case-5', 'image-case-6', 'c-sph-images', 'mirror-lab'] },
  { tab: 'Part 5', name: 'Lenses', short: 'Lenses',
    about: 'Convex and concave lenses, their shapes, refraction (why lenses bend light) and how lenses converge or diverge light.',
    ids: ['c-lens', 'lens-intro', 'lens-3d', 'c-refraction', 'refraction', 'lens-beams'] },
  { tab: 'Part 6', name: 'Image formation by lenses', short: 'Lens images',
    about: 'Ray diagrams through convex and concave lenses for different object positions, and the image formed.',
    ids: ['c-lens-images', 'lens-lab'] },
  { tab: 'Part 7', name: 'Applications and comparison', short: 'Uses & recap',
    about: 'Mirrors and lenses in daily life, a final comparison of mirrors and lenses, and the chapter questions.',
    ids: ['c-uses', 'mirror-apps', 'lens-apps', 'recap', 'quiz'] }
];

function partSlide(p, n) {
  return {
    id: 'part-' + n, title: `Part ${n}: ${p.name}`, section: p.tab, part: n, full: true, divider: true,
    narrate: `Part ${n}. ${p.name}. ${p.about}`,
    build(root) {
      const list = el('ol', { class: 'part-list' });
      p.scenes.forEach(s => {
        const b = el('button', { type: 'button' }, s.title);
        b.addEventListener('click', () => LL.goId(s.id));
        list.append(el('li', null, b));
      });
      const road = el('div', { class: 'part-road' }, PARTS.map((q, i) =>
        el('button', { type: 'button', class: 'part-step' + (i + 1 === n ? ' on' : i + 1 < n ? ' done' : ''), onclick: () => LL.goId('part-' + (i + 1)) },
          el('b', null, String(i + 1)), el('span', null, q.short))));
      root.append(el('div', { class: 'part-wrap' },
        road,
        el('div', { class: 'part-main' },
          el('div', { class: 'part-no' }, 'Part ' + n),
          el('h1', null, p.name),
          el('p', { class: 'part-about' }, p.about),
          el('div', { class: 'part-in' }, el('h3', null, 'IN THIS PART'), list))));
      return {};
    }
  };
}

(function arrange() {
  const byId = Object.fromEntries(LL.scenes.map(s => [s.id, s]));
  const used = new Set(['start']);
  const ordered = [byId.start];
  PARTS.forEach((p, i) => {
    p.scenes = p.ids.map(id => byId[id]).filter(Boolean);
    p.scenes.forEach(s => { s.section = p.tab; s.part = i + 1; used.add(s.id); });
    ordered.push(partSlide(p, i + 1), ...p.scenes);
  });
  LL.scenes.forEach(s => { if (!used.has(s.id)) ordered.push(s); });   // anything not listed stays at the end
  LL.scenes = ordered;
})();

boot();

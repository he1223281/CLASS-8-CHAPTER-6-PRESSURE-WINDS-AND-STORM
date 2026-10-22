'use strict';
/* Teaching order: seven parts, each finished before the next begins.
   Scenes register themselves in load order; here they are rearranged into the parts,
   and a short title slide opens each part. */
const PARTS = [
  { tab: 'Part 1', name: 'Reflection and the laws of reflection', short: 'Laws of reflection',
    about: 'What reflection is, the words we use (incident ray, reflected ray, normal, angles) and the two laws of reflection.',
    ids: ['c-reflection', 'c-laws', 'laws', 'first-law'] },
  { tab: 'Part 2', name: 'The image in a plane mirror', short: 'Plane mirror',
    about: 'The image in a plane mirror is erect, of the same size as the object, and laterally inverted.',
    ids: ['c-plane', 'plane-lab'] },
  { tab: 'Part 3', name: 'Spherical mirrors', short: 'Spherical mirrors',
    about: 'Concave and convex mirrors, how to tell them apart, and how they converge or diverge a beam of light.',
    ids: ['mystery', 'c-spherical', 'sphere', 'c-converge', 'parallel', 'sunlight'] },
  { tab: 'Part 4', name: 'Images formed by spherical mirrors', short: 'Mirror images',
    about: 'How the image in concave and convex mirrors changes as the object is moved away (Activity 10.3).',
    ids: ['c-sph-images', 'mirror-lab'] },
  { tab: 'Part 5', name: 'Lenses', short: 'Lenses',
    about: 'What a lens is, convex and concave lenses, and how they converge or diverge a beam of light.',
    ids: ['c-lens', 'lens-intro', 'lens-3d', 'lens-beams'] },
  { tab: 'Part 6', name: 'How objects look through lenses', short: 'Lens images',
    about: 'How an object looks through convex and concave lenses at different distances (Activity 10.9).',
    ids: ['c-lens-images', 'lens-lab'] },
  { tab: 'Part 7', name: 'Uses of mirrors and lenses, and revision', short: 'Uses & recap',
    about: 'Mirrors and lenses in daily life, a comparison of mirrors and lenses, and the chapter questions.',
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
  LL.scenes = ordered;
})();

boot();

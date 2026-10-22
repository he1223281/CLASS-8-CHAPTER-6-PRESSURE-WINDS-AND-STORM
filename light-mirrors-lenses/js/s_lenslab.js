'use strict';
/* Activity 10.9: an object seen through a convex and a concave lens (shares ImageLab with the mirror lab) */
LL.add({
  id: 'lens-lab', title: 'Lens lab', section: 'Lenses',
  build(root) {
    return ImageLab(root, {
      kind: 'lens', kicker: 'Activity 10.9', title: 'Look through the lens: how does the object appear?',
      X: 560, uMax: 34, types: ['convex', 'concave'], defType: 'convex', defU: 4,
      noteFor(st, img) {
        if (st.type === 'concave') return 'Through a concave lens the object always appears erect and diminished.';
        if (img.m > 0) return 'Object close to a convex lens: it appears erect and enlarged. This is how a magnifying glass works.';
        return 'Object farther from a convex lens: it appears inverted. It is first enlarged, then gets smaller.';
      },
      panel: {
        predict: { q: 'An object is placed behind a convex lens and slowly moved away. How does it look through the lens?', opts: ['Always erect and the same size', 'Erect and enlarged at first, then inverted', 'Always erect and smaller', 'It cannot be seen'], ans: 1, why: 'Close to a convex lens the object looks erect and enlarged; farther away it looks inverted.' },
        experiment: ['Place the candle <b>close</b> behind the convex lens.', 'Look through the lens and slowly move the candle <b>farther</b> away.', 'Note: erect or inverted? Bigger or smaller?', 'Repeat with the <b>concave</b> lens.'],
        observe: ['<b>Convex lens:</b> at a small distance the object appears <b>erect and enlarged</b>. As the distance increases it appears <b>inverted</b>: first enlarged, then diminished.', '<b>Concave lens:</b> the object always appears <b>erect and diminished</b>; its size changes as its distance increases.'],
        explain: '<p>Unlike mirrors, lenses let light <b>pass through</b> them, so we see things <b>through</b> a lens, not in it.</p><p>A convex lens can make things look bigger, which is why a <b>magnifying glass</b> is a convex lens.</p>'
      }
    });
  }
});

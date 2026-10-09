'use strict';
/* Scene 11: the live lens lab (shares ImageLab with the mirror lab) */
LL.add({
  id: 'lens-lab', title: 'Lens lab', section: 'Lenses',
  build(root) {
    return ImageLab(root, {
      kind: 'lens', kicker: 'Scene 11 · Activity 10.9 · Live lens lab', title: 'Move the candle: what does a lens do?',
      X: 640, uMax: 34, types: ['convex', 'concave'], defType: 'convex', defU: 25,
      places: {
        convex: [['Far away', 34], ['Beyond 2F₁', 26], ['At 2F₁', 20], ['Between 2F₁ and F₁', 15], ['At F₁', 10], ['Between F₁ and O', 6]],
        concave: [['Far away', 32], ['Middle', 15], ['Near', 5]]
      },
      footer: 'Thin-lens (school ray-diagram) model · f = 10 cm · rays drawn bending once at the lens centre line',
      modelNote: 'Images are calculated with the lens formula <b>1/v − 1/u = 1/f</b> and <b>m = v/u</b> (higher classes). Sign convention: distances are measured from the optical centre O, <b>+</b> in the direction the light travels (to the right) and <b>−</b> against it; heights above the axis are <b>+</b>. A real lens bends light at both of its surfaces; the thin-lens picture shows one bend at the centre line.',
      noteFor(st, img) {
        if (st.type === 'concave') return 'A concave lens always gives an upright, smaller, virtual image. Spectacles for short sight use concave lenses.';
        if (img.inf) return 'At F₁ the rays leave parallel and never meet: no image. Turn on the screen and try to catch one!';
        if (img.v < 0) return 'Object between F₁ and O: upright, enlarged, virtual image. This is a <b>magnifying glass</b>.';
        return 'Real, inverted image on the other side of the lens. Turn on the <b>Screen</b> and move it until the image is sharp, as in a camera or a projector.';
      },
      panel: {
        predict: { q: 'Can a convex lens make an upright, enlarged image, and also an upside-down one?', opts: ['Only upright images', 'Only upside-down images', 'Both, depending on how far the object is', 'Neither: it only makes things smaller'], ans: 2, why: 'Close to the lens (inside F₁) the image is upright and enlarged; farther away it becomes inverted.' },
        experiment: ['Drag the candle from far away towards the convex lens.', 'Turn on the <b>Screen</b> and drag it to catch the real image.', 'Switch to the <b>concave</b> lens and repeat.', 'Toggle the three rays.'],
        observe: ['<b>Convex:</b> far away → small, inverted, real image near F₂; at 2F₁ → same size at 2F₂; between 2F₁ and F₁ → enlarged and inverted; at F₁ → no image; inside F₁ → upright, enlarged, virtual.', 'Only real images can be caught on the screen.', '<b>Concave:</b> always upright, diminished and virtual, on the same side as the object.'],
        explain: '<p>A ray through the optical centre goes straight on. A ray parallel to the axis bends through F₂ (convex) or bends away as if it came from F₁ (concave).</p><p>A convex lens <b>converges</b> light, so rays from the candle can really meet and make a <b>real</b> image. A concave lens <b>diverges</b> light, so the rays only seem to come from a smaller, upright <b>virtual</b> image.</p>'
      }
    });
  }
});

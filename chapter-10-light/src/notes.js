/* ================= Textbook notes =================
   The chapter's own explanations, definitions and activity steps for every screen,
   shown in the "Textbook notes" panel (button in the bar, or key N).
   Keys match the start of each frame's mapTitle. */
const NOTES = {
  'Introduction': `
    <h4>Meena at the science centre</h4>
    <p>During the summer holidays, Meena visited a science centre. In one corner she saw a row of unusual, <b>curved mirrors</b>.</p>
    <ul><li>In one mirror her face looked <b>unusually large</b>.</li>
    <li>Her brother, standing a little farther away, looked <b>upside down</b>.</li>
    <li>In another mirror she saw a <b>tiny version</b> of herself.</li></ul>
    <p>In a plane mirror the image is erect and of the same size as the object. The guide explained: <i>“These are not plane mirrors. These are <b>spherical mirrors</b>. When the mirror is curved inward or outward, your image looks different in them!”</i></p>
    <h4>Probe and ponder</h4>
    <ul><li>Can we make mirrors which can give enlarged or diminished images?</li>
    <li>Why do side-view mirrors of vehicles say “Objects in mirror are closer than they appear”?</li>
    <li>Why is there a curved line on some reading glasses?</li></ul>`,

  'Plane mirror': `
    <h4>Representing light</h4>
    <p>Light travels along a <b>straight line</b>. We represent light by straight lines with arrows, called <b>rays</b>. Rays show the path along which light travels.</p>
    <h4>Words to know</h4>
    <dl><dt>Incident ray</dt><dd>The ray of light that falls on the mirror.</dd>
    <dt>Reflected ray</dt><dd>The ray of light that comes back from the mirror.</dd>
    <dt>Point of incidence (O)</dt><dd>The point where the incident ray strikes the mirror.</dd>
    <dt>Normal</dt><dd>A line drawn at 90° to the reflecting surface at the point of incidence.</dd>
    <dt>Angle of incidence (i)</dt><dd>The angle between the normal and the incident ray.</dd>
    <dt>Angle of reflection (r)</dt><dd>The angle between the normal and the reflected ray.</dd></dl>
    <h4>Special case</h4>
    <p>When the beam falls on the mirror <b>along the normal</b>, it goes straight back. The angle of incidence and the angle of reflection are both <b>zero</b>.</p>`,

  'Spherical mirrors': `
    <h4>10.1 What are spherical mirrors?</h4>
    <p>Curved mirrors can be specially made. <b>Spherical mirrors</b> are a common type of curved mirror, shaped like a part of a hollow glass sphere. Mirrors whose reflecting surfaces are spherical are called spherical mirrors.</p>
    <dl><dt>Concave mirror</dt><dd>A spherical mirror whose reflecting surface <b>curves inwards</b>.</dd>
    <dt>Convex mirror</dt><dd>A spherical mirror whose reflecting surface <b>curves outwards</b>.</dd></dl>
    <p>In the representation of both mirrors, the <b>non-reflecting surface is shown shaded</b>. The outline of the surface of the mirror is circular.</p>
    <h4>A step further — how they are made</h4>
    <p>A spherical mirror can be thought of as part of an imaginary hollow sphere. It is not made by slicing a sphere: a flat glass piece is <b>ground and polished</b> into a curved surface. A reflective coating (like a thin layer of aluminium) on the <b>outer</b> curved surface makes a <b>concave</b> mirror; on the <b>inner</b> curved surface it makes a <b>convex</b> mirror.</p>
    <h4>Activity 10.2: Let us distinguish</h4>
    <ul><li>Place a concave and a convex mirror on a table with reflecting surfaces facing up.</li>
    <li>View them from the side, eye at their level, to identify whether the reflecting surface curves inwards or outwards. (Use “Side view”.)</li></ul>`,

  'Activity 10.1': `
    <h4>Activity 10.1: Let us explore</h4>
    <ol><li>Take a shiny metallic spoon and hold its curved surface close to your face. Can you see your image?</li>
    <li><b>Notice</b> the image. Is it different from the image in a plane mirror?</li>
    <li>Slowly move the spoon away from your face. Does the image change?</li>
    <li>Flip the spoon and repeat.</li></ol>
    <h4>Observation</h4>
    <p>The shiny spoon acts like a mirror. On the <b>inner side</b>, which curves inwards, the image is <b>inverted</b>. On the <b>outer side</b>, which bulges outwards, the image is <b>erect but smaller</b> in size.</p>`,

  'Concave mirror: image': `
    <h4>10.2 Characteristics of images — Activity 10.3</h4>
    <ol><li>Stand a concave mirror upright. Keep a small toy 3–4 cm in front of it. What kind of image do you see? Same size? Erect? Lateral inversion?</li>
    <li>Slowly move the object away from the mirror. Does the image become smaller or larger? Does it stay erect?</li></ol>
    <h4>Observation</h4>
    <p>When the object is <b>close</b> to a concave mirror, the image is <b>erect and enlarged</b>. When the object is moved farther away, the image becomes <b>inverted</b>. It is at first enlarged and then keeps getting <b>smaller</b>.</p>
    <p>So the image formed by a concave mirror can be enlarged, diminished or the same size as the object, and it may be erect or inverted, depending on the distance of the object from the mirror.</p>
    <h4>Where are concave mirrors used?</h4>
    <ul><li>Reflectors of <b>torches</b> and <b>headlights</b> of cars and scooters.</li>
    <li><b>Dentist’s mirror</b> — gives an enlarged view of teeth when held close.</li>
    <li>Most modern <b>telescopes</b> are reflecting telescopes; the main mirror is a large concave mirror.</li></ul>`,

  'Convex mirror: image': `
    <h4>Activity 10.3 — the convex mirror</h4>
    <p>Repeat the activity with a convex mirror: object close (3–4 cm), then move it slowly away.</p>
    <h4>Observation</h4>
    <p>In a convex mirror the image is <b>always erect</b> and <b>smaller</b> than the object, that is, <b>diminished</b>. The size of the image <b>decreases slightly</b> as the object is moved away from the mirror.</p>
    <p>Because the mirror is curved outward, it shows a <b>much wider area</b> than a plane mirror of the same size.</p>`,

  'Convex mirrors in real life': `
    <h4>Where are convex mirrors used?</h4>
    <dl><dt>Side-view mirrors of vehicles</dt><dd>They always form an <b>erect</b> image of the traffic behind, <b>smaller</b> than the actual vehicles. Being curved outward, they show a much <b>wider area</b> of the road behind.</dd>
    <dt>Road safety mirrors</dt><dd>Installed at road intersections and sharp bends, so drivers from both sides can see the other side and <b>prevent collisions</b>.</dd>
    <dt>Store surveillance mirrors</dt><dd>Installed in big stores to <b>monitor a large area</b> and deter thefts.</dd></dl>
    <h4>Why “Objects in mirror are closer than they appear”?</h4>
    <p>The convex mirror makes vehicles look <b>smaller</b>, so they seem farther away than they really are.</p>`,

  'Plane vs concave vs convex': `
    <h4>What the comparison shows</h4>
    <ul><li>A <b>plane mirror</b> always forms an <b>erect</b> image of the <b>same size</b> as the object.</li>
    <li>In <b>concave and convex</b> mirrors the size of the image <b>changes</b> as the distance of the object changes.</li>
    <li>In a <b>concave</b> mirror the image also gets <b>inverted</b> when the object is taken away from the mirror.</li>
    <li>A <b>convex</b> mirror always gives an <b>erect, diminished</b> image.</li>
    <li><b>Lateral inversion</b> of the image is seen in all three types of mirrors.</li></ul>
    <p>We can identify whether a mirror is plane, concave or convex just by looking at the images of an object formed in it.</p>`,

  'Laws of reflection': `
    <h4>10.3 What are the laws of reflection? — Activity 10.4</h4>
    <ol><li>Make a thin slit in a comb (cover all openings except the middle one) and stand a plane mirror upright on white paper.</li>
    <li>Using the slit and a torch, send a thin beam along the paper onto the mirror. Move the torch so the beam falls at another angle — does the reflected beam also shift?</li>
    <li>Draw the mirror, the incident ray and the reflected ray. Remove the mirror and draw the <b>normal</b> at the point of incidence O.</li>
    <li><b>Measure</b> i and r and note them in <b>Table 10.1</b>. Repeat for several angles.</li>
    <li>Let the beam fall <b>along the normal</b>. Both angles are zero.</li></ol>
    <h4>Law 1</h4>
    <p class="law">The angle of incidence (i) is equal to the angle of reflection (r).</p>`,

  'Activity 10.5': `
    <h4>Activity 10.5: Let us experiment</h4>
    <ol><li>Use the same set-up, but place a stiff chart paper on the table so part of it extends beyond the edge.</li>
    <li>Shine the beam on the mirror and observe the reflected beam on the extended part.</li>
    <li>Bend the extended part down along the edge. Do you still see the reflected beam?</li>
    <li>Flatten the paper again.</li></ol>
    <h4>Observation</h4>
    <p>The reflected beam <b>disappears</b> when the sheet is bent and <b>reappears</b> when it is flattened. So the reflected beam lies in the same plane as the incident beam. Bending the sheet creates a new plane, breaking this alignment.</p>
    <h4>Law 2</h4>
    <p class="law">The incident ray, the normal to the mirror at the point of incidence, and the reflected ray all lie in the same plane.</p>
    <p>The laws of reflection are valid for <b>all kinds of mirrors</b> — plane and spherical.</p>`,

  'Parallel rays': `
    <h4>Activity 10.6: Let us explore</h4>
    <ol><li>Leave many openings of the comb uncovered to get <b>multiple parallel beams</b> of light.</li>
    <li>Let them fall on a plane mirror, a concave mirror and a convex mirror, one by one.</li></ol>
    <h4>Observation</h4>
    <ul><li><b>Plane mirror</b>: the reflected beams are also <b>parallel</b>.</li>
    <li><b>Concave mirror</b>: the reflected beams get closer — they <b>converge</b>.</li>
    <li><b>Convex mirror</b>: the reflected beams spread — they <b>diverge</b>.</li></ul>
    <p>Each ray follows the laws of reflection; it is the <b>curved surface</b> that makes a parallel beam converge (concave) or diverge (convex).</p>`,

  'Concave mirror concentrates': `
    <h4>Activity 10.7: Let us explore</h4>
    <p class="warnp"><b>Safety first:</b> Do this only under the supervision of a teacher or an adult. Do not look towards the Sun or into the mirror reflecting the Sun. Focus the reflected light only on paper, never towards anyone’s face or eyes.</p>
    <ol><li>Hold a concave mirror with its reflecting surface facing the Sun.</li>
    <li>Direct the reflected light onto a sheet of thin paper.</li>
    <li>Adjust the distance of the paper until you get a <b>sharp bright spot</b>.</li>
    <li>Hold steady for a few minutes. Does the paper start to burn, producing smoke?</li></ol>
    <h4>Why?</h4>
    <p>The light from the Sun, after reflection from the mirror, gets <b>concentrated</b> on this point. This produces enough <b>heat</b> to ignite the paper.</p>`,

  'Solar concentrators': `
    <h4>A step further</h4>
    <p>Devices which concentrate sunlight into a small area, using mirrors and lenses, are called <b>solar concentrators</b>.</p>
    <ul><li>The concentrated sunlight heats a liquid to produce <b>steam</b>, which can be used to <b>generate electricity</b>.</li>
    <li>It provides heat for large-scale <b>cooking</b> and for <b>solar furnaces</b>.</li>
    <li>Solar furnaces are even used for <b>melting steel</b>!</li></ul>
    <h4>Discover, design and debate</h4>
    <p>In <b>solar cookers</b>, mirrors converge sunlight to generate heat. In India such designs are used in villages, saving electricity and reducing fossil-fuel use.</p>`,

  'What is a lens': `
    <h4>10.4 What is a lens?</h4>
    <p>Through a flat glass window pane all objects look the same size and shape. But would they look the same if the transparent material were <b>curved</b>?</p>
    <dl><dt>Lens</dt><dd>A piece of <b>transparent material</b>, usually glass or plastic, which has <b>curved surfaces</b>. Like mirrors, lenses can be convex or concave.</dd>
    <dt>Convex lens</dt><dd>Thicker at the <b>middle</b> than at the edges.</dd>
    <dt>Concave lens</dt><dd>Thicker at the <b>edges</b> than at the middle.</dd></dl>
    <p>Unlike mirrors, lenses allow light to <b>pass through</b> them, and we see things <b>through</b> a lens rather than in it.</p>`,

  'Convex lens: parallel': `
    <h4>Convex lens — a converging lens</h4>
    <p>When multiple parallel beams of light fall on a convex lens, the lens <b>converges</b> the light. So a convex lens is also called a <b>converging lens</b>.</p>
    <dl><dt>Principal axis</dt><dd>The line through the centre of the lens, perpendicular to it.</dd>
    <dt>Optical centre (O)</dt><dd>The centre of the lens; a ray through it goes straight on.</dd>
    <dt>Focal point (F)</dt><dd>The point where rays parallel to the axis meet after passing through the lens. Real lenses bring rays together in a small <b>focal region</b>.</dd></dl>`,

  'Convex lens: image': `
    <h4>Activity 10.9: Let us experiment</h4>
    <ol><li>Fix a convex lens upright in a holder. Place a small object behind it.</li>
    <li>Look at the object through the lens from the other side and note your observations.</li>
    <li>Slowly move the object farther from the lens. How does the image change?</li>
    <li>Repeat using a concave lens and compare.</li></ol>
    <h4>Observation</h4>
    <p>An object at a <b>small distance</b> behind a convex lens appears <b>erect and enlarged</b>. As the distance increases, the object appears <b>inverted</b>. It is initially enlarged and then <b>diminishes</b> in size.</p>
    <p>The image formed by a convex lens can be enlarged, diminished or of the same size, and erect or inverted, depending on the distance of the object from the lens.</p>`,

  'Concave lens: parallel': `
    <h4>Concave lens — a diverging lens</h4>
    <p>When parallel beams of light fall on a concave lens, the lens <b>diverges</b> (spreads) the light. So a concave lens is called a <b>diverging lens</b>.</p>
    <p>If the spreading rays are traced backwards (dashed lines), they seem to come from a point on the same side as the incoming light — the focal point.</p>`,

  'Concave lens: image': `
    <h4>Activity 10.9 — the concave lens</h4>
    <p>An object placed behind a concave lens and seen through it <b>always appears erect and diminished</b> in size. Its size changes as its distance from the lens increases.</p>
    <p>The rays coming out of the lens spread apart. Your eye traces them back to the point they seem to come from — that is where the image appears.</p>`,

  'Convex vs concave lens': `
    <h4>Summary — lenses</h4>
    <table class="nt"><tr><th></th><th>Convex lens</th><th>Concave lens</th></tr>
    <tr><td>Shape</td><td>Thick middle</td><td>Thick edges</td></tr>
    <tr><td>Parallel beam</td><td>Converges</td><td>Diverges</td></tr>
    <tr><td>Also called</td><td>Converging lens</td><td>Diverging lens</td></tr>
    <tr><td>Image</td><td>Enlarged, diminished or same size; erect or inverted — depends on distance</td><td>Always erect and diminished</td></tr></table>`,

  'Parallel light through': `
    <h4>Activity 10.10: Let us investigate</h4>
    <ol><li>Fix a thin glass plate (or lens) upright between two books and spread white paper on them.</li>
    <li>Let multiple parallel beams from the comb fall on the glass plate, the convex lens and the concave lens, one by one.</li>
    <li>Does the beam pass through as it is in all three cases? Record your observations.</li></ol>
    <h4>Observation</h4>
    <ul><li>The beam passes through the <b>thin glass plate</b> as it is.</li>
    <li>The <b>convex lens converges</b> the light — a converging lens.</li>
    <li>The <b>concave lens diverges</b> the light — a diverging lens.</li></ul>`,

  'Convex lens concentrates': `
    <h4>Activity 10.11: Let us investigate</h4>
    <p class="warnp"><b>Safety first:</b> Do not look at the Sun directly or through the lens, as it may damage your eyes.</p>
    <p>Repeat Activity 10.7 by putting a <b>convex lens</b> in the path of the sunrays instead of a concave mirror. Could you burn the paper?</p>
    <h4>Why?</h4>
    <p>The convex lens <b>converges</b> sunlight into a tiny bright spot. Concentrating the light on a small area produces enough <b>heat</b> to make the paper smoke and burn.</p>`,

  'Water drop': `
    <h4>Activity 10.8: Let us explore</h4>
    <ol><li>Spread a few drops of oil (or wax) on a flat strip of glass or clear plastic to leave a thin coating.</li>
    <li>Place a small drop of water on the oiled spot — the oil helps it form a nice round drop.</li>
    <li><b>Examine</b> the drop. Is its surface flat, curved inward or curved outward?</li>
    <li>Place printed text under the strip so a word is directly below the drop. Look down through the drop.</li></ol>
    <h4>Observation</h4>
    <p>The surface of the water drop is <b>curved outward</b>. The letters under it look different — they may appear <b>larger</b> than the letters nearby. The curved drop of water acts like a <b>simple lens</b>.</p>`,

  'Magnifying glass': `
    <h4>The magnifying glass</h4>
    <p>A magnifying glass is a <b>lens</b> that helps in reading small print by making the letters appear <b>bigger</b>. It is a <b>convex lens</b>.</p>
    <h4>Try it (Keep the curiosity alive, Q8)</h4>
    <p>Hold a magnifying glass over text and find the distance where the text looks bigger than it is written. Now move it away from the text. What do you notice?</p>
    <p>Close to the text the letters are <b>erect and enlarged</b>. Held too far, the text <b>blurs</b> and then appears <b>upside down</b>.</p>`,

  'Lenses in real life': `
    <h4>Where are lenses used?</h4>
    <p>Lenses are important and are used everywhere around us.</p>
    <ul><li><b>Eyeglasses</b> that people wear to see clearly are lenses.</li>
    <li><b>Cameras</b>, including <b>smartphone cameras</b>, use lenses.</li>
    <li><b>Telescopes</b> and <b>microscopes</b> use lenses to work.</li>
    <li>Even our <b>eye</b> has a <b>convex lens</b> inside. It is an amazing lens that can <b>change its shape</b>, which lets us read a book or see something far away.</li></ul>`,

  'Mirrors in real life': `
    <h4>Concave mirrors are used in</h4>
    <ul><li>Reflectors of <b>torches</b> and <b>headlights</b> of vehicles.</li>
    <li><b>Dentist’s mirror</b> — an enlarged view of teeth when held close.</li>
    <li><b>Reflecting telescopes</b> — the main mirror is a large concave mirror.</li>
    <li><b>Solar cookers</b> and solar concentrators.</li></ul>
    <h4>Convex mirrors are used in</h4>
    <ul><li><b>Side-view mirrors</b> of vehicles — erect, smaller image of a wide area behind.</li>
    <li><b>Road safety mirrors</b> at sharp bends and intersections.</li>
    <li><b>Surveillance mirrors</b> in big stores.</li></ul>
    <h4>Discover, design and debate</h4>
    <p>Visit an ENT specialist or dentist and ask to see the mirrors used to examine ear, nose, throat and teeth. Which kind of mirror are they?</p>`,

  'Optical Lab': `
    <h4>Discover, design and debate</h4>
    <p>“Use online tools or animation to do virtual experiments with spherical mirrors and lenses. Move objects in the simulation and observe how the image changes.”</p>
    <h4>Things to try</h4>
    <ul><li>Concave mirror: find the object position where the image is the <b>same size</b> but inverted.</li>
    <li>Convex lens: where must the object be to get an <b>erect, enlarged</b> image?</li>
    <li>Convex mirror and concave lens: can you ever get an inverted image?</li>
    <li>Plane mirror: does the image size change with distance?</li></ul>`,

  'Discovery mode': `
    <h4>Use the clues</h4>
    <ul><li>Image <b>always erect and same size</b> → plane mirror.</li>
    <li>Image changes from erect &amp; enlarged to inverted → <b>concave mirror</b> or <b>convex lens</b>. (Mirror: image forms on the same side as the object; lens: on the other side.)</li>
    <li>Image <b>always erect and diminished</b> → <b>convex mirror</b> or <b>concave lens</b>.</li></ul>
    <h4>From “Keep the curiosity alive”</h4>
    <p>Q3 and Q4 ask you to identify mirrors and lenses from the images of a sketch-pen cap. Q6: on the images of a graph sheet, identify plane, concave and convex mirrors.</p>`,

  'Chapter recap': `
    <h4>Our scientific heritage</h4>
    <p>More than 800 years ago, in the time of the great Indian mathematician <b>Bhāskara II</b>, astronomers used shallow bowls of water to observe the stars and planets. By looking at their reflected images through tubes placed at appropriate angles, they could measure their positions in the sky. Their instruments and methods suggest they understood the laws of reflection in practice.</p>`,

  'Snapshots': `
    <h4>About this screen</h4>
    <p>These are the chapter’s <b>Snapshots</b> — the key points to remember. Tap a point to highlight it while you discuss it with the class.</p>`
};
function notesFor(f) {
  const t = f.mapTitle || '';
  const k = Object.keys(NOTES).find(k => t.startsWith(k));
  return k ? NOTES[k] : '';
}

/* ---------- Snapshots: the chapter summary in the textbook's words ---------- */
const SNAPSHOTS = [
  ['Image formed by a <b>concave mirror</b> can be enlarged, diminished or of the same size as the object, and it may be erect or inverted, depending upon the distance of the object from the mirror.', COL.ray],
  ['Image formed by a <b>convex mirror</b> is always erect and diminished in size.', COL.ref],
  ['Two <b>laws of reflection</b>: (i) the angle of incidence is equal to the angle of reflection; (ii) the incident ray, the normal to the mirror at the point of incidence, and the reflected ray all lie in the same plane.', '#fff'],
  ['The laws of reflection are valid for <b>all kinds of mirrors</b> — plane, concave and convex.', '#fff'],
  ['A <b>concave mirror converges</b> the light beams while a <b>convex mirror diverges</b> them.', COL.ray],
  ['Image formed by a <b>convex lens</b> can be enlarged, diminished or of the same size as the object, and it may be erect or inverted, depending upon the distance of the object from the lens.', COL.ray],
  ['Image formed by a <b>concave lens</b> is always erect and diminished in size.', COL.ref],
  ['A <b>convex lens converges</b> the light beams while a <b>concave lens diverges</b> them.', COL.ray]
];
frame({
  mod: 21, kick: 'Snapshots', title: 'What we learnt', mapTitle: 'Snapshots — chapter summary',
  sub: 'The key points of the chapter. Tap a point to highlight it.',
  build(b) {
    const g = h('div', { class: 'snaps' }); b.append(g);
    SNAPSHOTS.forEach(([t, c], i) => {
      const el = h('button', { class: 'snap', style: `--c:${c};animation-delay:${.15 + i * .12}s`, onclick: () => el.classList.toggle('on') },
        h('span', { class: 'sn' }, String(i + 1).padStart(2, '0')), h('span', { html: t }));
      g.append(el);
    });
  },
  enter(f) { f.root.querySelectorAll('.snap').forEach(e => { e.style.animation = 'none'; void e.offsetWidth; e.style.animation = ''; }); }
});

/* ---------- notes drawer ---------- */
const Notes = {
  open: false,
  init() {
    this.el = $('#notes'); this.body = $('#notesbody');
    $('#notesbtn').onclick = () => this.toggle();
    $('#notesclose').onclick = () => this.toggle(false);
    addEventListener('keydown', e => { if ((e.key === 'n' || e.key === 'N') && (e.target.tagName || '').toLowerCase() !== 'input') this.toggle(); });
  },
  toggle(v) { this.open = v == null ? !this.open : v; this.el.classList.toggle('on', this.open); $('#notesbtn').classList.toggle('on', this.open); },
  show(f) {
    const html = notesFor(f);
    $('#notesbtn').disabled = !html;
    $('#notestitle').innerHTML = (f.title || 'Light: Mirrors and Lenses');
    this.body.innerHTML = html || '<p>No notes for this screen.</p>';
    this.body.scrollTop = 0;
  }
};

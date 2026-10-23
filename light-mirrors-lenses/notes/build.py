import re, sys
sys.path.insert(0, '.')
from geo import DEFS
import figs as F

FONT = '/tmp/claude-0/fonts'
ff = ''
for w in (400, 500, 600, 700, 800):
    ff += f'@font-face{{font-family:"Poppins";font-weight:{w};src:url("file://{FONT}/fontsource-poppins-5.0.8/package/files/poppins-latin-{w}-normal.woff2")}}\n'
for w in (400, 500, 600, 700, 800):
    for st in ('normal', 'italic'):
        ff += f'@font-face{{font-family:"Noto Sans";font-weight:{w};font-style:{st};src:url("file://{FONT}/fontsource-noto-sans-5.0.8/package/files/noto-sans-latin-{w}-{st}.woff2")}}\n'

CSS = open('style.css').read()

ICON = {
 'def': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/></svg>',
 'rem': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>',
 'mis': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
 'know': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
 'lab': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/></svg>',
 'safe': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/></svg>',
}
ICON['safe_'] = ICON['safe']

FIGN = [0]; FIGW = []
def fig(svg, cap, w='100%'):
    FIGN[0] += 1
    FIGW.append((FIGN[0], svg, w))
    return f'<figure class="keep" style="width:{w}">{svg}<figcaption><b>Fig. {FIGN[0]}</b> {cap}</figcaption></figure>'
def box(kind, title, body): return f'<div class="box {kind} keep"><div class="bh"><span class="ic">{ICON[kind]}</span>{title}</div><div class="bb">{body}</div></div>'
DEF = lambda t, b: box('def', 'Definition — ' + t, b); MIS = lambda b: box('mis', 'Common mistake', b)
KNOW = lambda b, t='Did you know?': box('know', t, b); REM = lambda b: box('rem', 'Remember', b)
SAFE = lambda b: box('safe', 'Safety first', b)
UL = lambda xs: '<ul>' + ''.join(f'<li>{x}</li>' for x in xs) + '</ul>'
OL = lambda xs: '<ol>' + ''.join(f'<li>{x}</li>' for x in xs) + '</ol>'
def LAB(title, need, steps, obs, concl, figure='', extra=''):
    return f'''<div class="lab"><div class="keep"><div class="lh"><span class="ic">{ICON['lab']}</span><span class="tag">LAB ACTIVITY</span>{title}</div>
    <div class="lb"><p class="need"><b>You need:</b> {need}</p>{OL(steps)}{extra}</div></div><div class="lb lb2">{figure}
    <div class="oc keep"><div><b>Observation</b><p>{obs}</p></div><div><b>Conclusion</b><p>{concl}</p></div></div></div></div>'''
def SEC(n, title, theme, blocks, sub=''):
    sh = f'<div class="sh"><span class="num">{n}</span><div><h2>{title}</h2>{f"<div class=sub>{sub}</div>" if sub else ""}</div></div>'
    return f'<section class="sec {theme}"><div class="keep">{sh}{blocks[0]}</div>{"".join(blocks[1:])}</section>'
BLOCK = lambda h: f'<div class="keep">{h}</div>'
def TABLE(head, rows, cls=''):
    h = ''.join(f'<th>{x}</th>' for x in head)
    r = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in row) + '</tr>' for row in rows)
    return f'<table class="keep {cls}"><tr>{h}</tr>{r}</table>'

sun_m, sp1 = F.f_sun_mirror(); sun_l, sp2 = F.f_sun_lens()
print('focus spread', round(sp1, 2), round(sp2, 2))

# ---------------------------------------------------------------- HERO + INTRO
hero = '''<div class="hero"><div><span class="chip">CLASS 8 · SCIENCE (CURIOSITY)</span><div class="ch">CHAPTER <b>10</b></div>
<h1>Light: Mirrors<br>and Lenses</h1><span class="topic">Spherical mirrors · Laws of reflection · Lenses</span></div>
<div class="wmark"><b>ABHIMANYU</b><span>ACADEMY</span></div></div>'''

intro = '''<div class="intro"><div class="ihook"><div class="itag">THINK ABOUT IT</div>
<p class="q">Can we make mirrors that show us an enlarged or a diminished image?</p>
<p class="q">Why is “Objects in mirror are closer than they appear” written on the side-view mirrors of vehicles?</p>
<p class="q">Why do the letters under a drop of water look bigger?</p>
<p class="ans">The answer to all three is <b class="c1">curved surfaces</b>. A mirror or a piece of glass that is curved changes how big an image looks, and whether it is <b class="c2">erect</b> or <b class="c2">upside down</b>.</p></div>
<div class="ilearn"><div class="itag">IN THIS CHAPTER YOU WILL LEARN</div><ul class="chk">
<li>What spherical mirrors are: concave and convex</li>
<li>What the images in plane, concave and convex mirrors look like</li>
<li>The two laws of reflection</li>
<li>How mirrors and lenses converge or diverge light</li>
<li>Convex and concave lenses and where they are used</li></ul></div></div>'''

# ---------------------------------------------------------------- 1 SPHERICAL MIRRORS
s1 = SEC(1, 'What Are Spherical Mirrors?', 't-purple', [
  BLOCK('<p>At a science centre, Meena looked into a row of curved mirrors. In one her face looked very large, and her brother, standing a little farther away, looked <b>upside down</b>. In another she saw a tiny version of herself. A plane (flat) mirror always gives an <b>erect</b> image of the <b>same size</b>, so these mirrors had to be different: they were <b>spherical mirrors</b>.</p>'),
  LAB('Activity 10.1 — Your image in a spoon', 'a shiny metallic (steel) spoon.',
        ['Hold the inner curved surface of the spoon close to your face and look at your image.',
         'Slowly move the spoon away from your face and watch the image.',
         'Flip the spoon and repeat with the outer curved surface.'],
        'Inner side (curved inwards): the image of the face is <b>inverted</b>. Outer side (bulging outwards): the image is <b>erect but smaller</b>.',
        'A shiny curved surface acts as a mirror, but its image is different from the image in a plane mirror (see Fig. 1).'),
  fig(F.f_spoon(), 'The shiny spoon acts as a curved mirror.'),
  DEF('Spherical mirror', 'Mirrors whose reflecting surfaces are <b>spherical</b> (shaped like a part of a hollow sphere) are called <b>spherical mirrors</b>. They are a common type of curved mirror.'),
  '<div class="two keep"><div class="card pc"><h4>Concave mirror</h4>' + UL(['Its reflecting surface <b>curves inwards</b> (like the inside of a bowl or a cave).', 'In its drawing, the back (non-reflecting side) is shown shaded.']) +
  '</div><div class="card bc"><h4>Convex mirror</h4>' + UL(['Its reflecting surface <b>curves outwards</b> (bulges out like the back of a spoon).', 'In its drawing too, the non-reflecting side is shown shaded.']) + '</div></div>',
  fig(F.f_rep(), 'How concave and convex mirrors are drawn. Light falls on the reflecting side; the shaded side is the back.'),
  KNOW('A spherical mirror can be <i>thought of</i> as a part of a hollow sphere, but it is <b>not</b> made by cutting a glass sphere. A flat piece of glass is ground and polished into a curved shape, and then a thin shiny coating (such as aluminium) is put on one side. Coating on the <b>outer</b> curved surface gives a <b>concave mirror</b>; coating on the <b>inner</b> curved surface gives a <b>convex mirror</b>.' + fig(F.f_coat(), 'The side that gets the coating decides the type of mirror.'), 'A step further — how are they made?'),
  LAB('Activity 10.2 — Telling the two mirrors apart', 'a concave mirror and a convex mirror.',
      ['Place both mirrors on a table with their reflecting surfaces facing upwards.',
       'Look at them from the side, keeping your eye at the level of the table.'],
      'One reflecting surface dips in like a bowl; the other bulges up like a dome.',
      'The mirror curving <b>inwards</b> is concave; the one curving <b>outwards</b> is convex.',
      fig(F.f_side(), 'Side view of the two mirrors on a table.')),
], 'Curved mirrors: concave and convex')

# ---------------------------------------------------------------- 2 IMAGES
s2 = SEC(2, 'Images Formed by Spherical Mirrors', 't-purple', [
  '<p>Let us compare the images formed by plane, concave and convex mirrors, and see how they change with distance.</p>',
  LAB('Activity 10.3 — What do the images look like?', 'a concave mirror, a convex mirror, two wooden blocks to keep them upright, and a small toy or object.',
      ['Keep the two mirrors upright, side by side. Place the object about 3–4 cm in front of them.',
       'Look at the image in each mirror. Is it erect? Is it the same size as the object? Is it laterally inverted?',
       'Slowly move the object away from the mirrors and watch how the images change.',
       'Repeat with each mirror separately and note down your observations.'],
      'Concave: close → erect, enlarged; moved away → inverted, first enlarged and then smaller. Convex: always erect and diminished, becoming slightly smaller as the object moves away.',
      'The size of the image in spherical mirrors changes with the distance of the object. A concave mirror can also make the image inverted.',
      fig(F.grid_fig('mirror'), 'What you see in each mirror as the object (a candle) is moved away. The plane mirror is shown for comparison.', '88%')),
  TABLE(['Mirror', 'Object close to the mirror', 'Object moved away', 'Lateral inversion'], [
      ['<b>Plane</b>', 'Erect, same size', 'Erect, same size', 'Yes'],
      ['<b>Concave</b>', 'Erect, <b>enlarged</b>', '<b>Inverted</b>; enlarged at first, then smaller and smaller', 'Yes'],
      ['<b>Convex</b>', 'Erect, <b>diminished</b>', 'Erect, diminished, slightly smaller', 'Yes']]),
  REM('<b>Enlarged</b> = bigger than the object; <b>diminished</b> = smaller than the object; <b>erect</b> = upright; <b>inverted</b> = upside down. A concave mirror can give an image that is enlarged, diminished or of the same size, erect or inverted, depending on how far the object is. A convex mirror <b>always</b> gives an erect, diminished image. So we can identify a mirror just by looking at the images it forms!'),
  MIS('“A concave mirror always gives an upside-down image.” <b>Wrong.</b> When the object is <b>close</b> to a concave mirror, the image is <b>erect and enlarged</b>. It becomes inverted only when the object is moved farther away.'),
  BLOCK('<h3>Uses of concave mirrors</h3>' + UL([
      '<b>Torches and vehicle headlights:</b> the reflectors of torches and of car and scooter headlights are concave. They send the light forward as a strong beam.',
      '<b>Dentists:</b> a dental mirror is a small concave mirror. Held close to the teeth, it gives an <b>enlarged</b> view of them.',
      '<b>Telescopes:</b> most modern telescopes are reflecting telescopes whose main mirror is a large concave mirror.'])
      + fig(F.f_conuse(), 'Concave mirrors in use.')),
  BLOCK('<h3>Uses of convex mirrors</h3>' + UL([
      '<b>Side-view mirrors of vehicles:</b> they always give an erect, smaller image of the traffic behind, and because they bulge outwards they show a much <b>wider area</b> of the road.',
      '<b>Road safety mirrors:</b> fitted at sharp bends and road crossings so that drivers on both sides can see each other and avoid collisions.',
      '<b>Surveillance mirrors:</b> fitted in big stores so that a large area can be watched to stop thefts.'])
      + fig(F.f_cvxuse(), 'Convex mirrors give a wide view.')),
  KNOW('The images in a convex side-view mirror are <b>smaller</b> than the real vehicles. A smaller car looks as if it is farther away, so the warning “Objects in mirror are closer than they appear” reminds drivers to be careful.'),
], 'Erect or inverted? Enlarged or diminished?')

# ---------------------------------------------------------------- 3 LAWS
s3 = SEC(3, 'What Are the Laws of Reflection?', 't-cool', [
  '<p>Light travels in a straight line. We show the path of light by a straight line with an arrow, called a <b>ray</b>. A narrow beam of light can be drawn as a ray.</p>' +
  TABLE(['Term', 'Meaning'], [
      ['<b>Incident ray</b>', 'The ray of light that falls on the mirror.'],
      ['<b>Reflected ray</b>', 'The ray of light that comes back from the mirror.'],
      ['<b>Point of incidence (O)</b>', 'The point where the incident ray strikes the mirror.'],
      ['<b>Normal</b>', 'A line drawn at 90° to the mirror at the point of incidence.'],
      ['<b>Angle of incidence (i)</b>', 'The angle between the <b>normal</b> and the incident ray.'],
      ['<b>Angle of reflection (r)</b>', 'The angle between the <b>normal</b> and the reflected ray.']]),
  LAB('Activity 10.4 — Measuring the angles', 'a plane mirror with a stand, a torch, a comb, a paper clip, a sheet of white paper and a strip of black paper.',
      ['Cover all the openings of the comb with black paper except one in the middle, to make a thin slit.',
       'Spread the white paper on a table and stand the mirror upright on it.',
       'Shine the torch through the slit so that a thin beam moves along the paper and falls on the mirror.',
       'Draw the mirror, the incident beam and the reflected beam on the paper. Remove the mirror and draw the normal at the point of incidence O.',
       'Measure angles i and r with a protractor. Repeat for different angles of incidence.'],
      'When the incident beam is moved, the reflected beam also shifts. Each time, the angle of reflection comes out nearly equal to the angle of incidence (for example, 30° and 30°, 45° and 45°).',
      'The angle of incidence is equal to the angle of reflection.',
      fig(F.f_act104(), 'Left: the set-up seen from above. Right: drawing the rays, the normal and the angles.')),
  DEF('First law of reflection', 'The <b>angle of incidence</b> is equal to the <b>angle of reflection</b>: <span class="formula">∠i = ∠r</span>'),
  BLOCK('<p>If the incident ray falls on the mirror <b>along the normal</b>, the angle of incidence is 0°, so the angle of reflection is also 0°. The ray goes back along the same path.</p>' + fig(F.f_normal(), 'A ray along the normal is reflected back along the same path.', '48%')),
  LAB('Activity 10.5 — Do the rays lie in one plane?', 'the same set-up as Activity 10.4, and a stiff sheet of chart paper.',
      ['Place the chart paper flat on the table so that a part of it extends beyond the edge of the table.',
       'Shine the beam on the mirror placed on the sheet and look for the reflected beam on the extended part.',
       'Bend the extended part down along the edge of the table. Then flatten it again.'],
      'The reflected beam disappears from the extended part when it is bent and reappears when it is flattened.',
      'The reflected beam lies in the same plane as the incident beam. Bending the sheet makes a new plane, so the beam is not seen on it.',
      fig(F.f_act105(), 'The reflected beam is seen only when the sheet is flat.')),
  DEF('Second law of reflection', 'The <b>incident ray</b>, the <b>normal</b> to the mirror at the point of incidence and the <b>reflected ray</b> all lie in the <b>same plane</b>.'),
  REM('The laws of reflection are true for <b>all</b> mirrors: plane, concave and convex.'),
  MIS('Angles i and r are measured from the <b>normal</b>, not from the mirror. If a ray makes 40° with the normal, then r = 40°, but the reflected ray makes 90° − 40° = <b>50° with the mirror</b>.'),
], 'Incident ray, normal and reflected ray')

# ---------------------------------------------------------------- 4 CONVERGE / DIVERGE
s4 = SEC(4, 'Mirrors Converge and Diverge Light', 't-ray', [
  '<p>The laws of reflection are valid for all kinds of mirrors, plane and spherical. But something interesting happens when many parallel rays fall on spherical mirrors.</p>',
  LAB('Activity 10.6 — Many parallel beams on three mirrors', 'a plane mirror, a concave mirror, a convex mirror, stands, a torch, a comb and a paper clip.',
      ['Use the set-up of Activity 10.4, but keep many openings of the comb uncovered to get several parallel beams.',
       'Let the parallel beams fall on the plane mirror, the concave mirror and the convex mirror, one by one.',
       'Watch the reflected beams each time.'],
      'Plane mirror: reflected beams stay parallel. Concave mirror: reflected beams come closer together. Convex mirror: reflected beams spread out.',
      'Each ray obeys the laws of reflection, but the curved surface makes parallel rays converge (concave) or diverge (convex).',
      fig(F.f_beams(), 'Parallel rays falling on the three mirrors.')),
  '<div class="two keep"><div class="card pc"><h4>Concave mirror = converges</h4><p>The reflected rays come <b>closer</b> together (<b>converge</b>), so light gets concentrated.</p></div>'
  '<div class="card bc"><h4>Convex mirror = diverges</h4><p>The reflected rays <b>spread out</b> (<b>diverge</b>), so a wide area is covered.</p></div></div>',
  LAB('Activity 10.7 — Burning paper with sunlight', 'a concave mirror and a sheet of thin paper or newspaper.',
      ['Hold the concave mirror with its reflecting surface facing the Sun.',
       'Direct the reflected sunlight on to the sheet of paper.',
       'Move the paper until you get a sharp bright spot. Hold the mirror and the paper steady for a few minutes.'],
      'The paper starts to burn and gives off smoke.',
      'The concave mirror concentrates sunlight at the bright spot. This produces enough heat to set the paper on fire.',
      fig(sun_m, 'Sunlight concentrated on paper by a concave mirror.'),
      extra=SAFE('Do this only under the supervision of a teacher or an adult. Never look at the Sun or into the mirror reflecting the Sun. Focus the light only on the paper, never on anyone’s face or eyes.')),
  KNOW('Devices that concentrate sunlight on a small area using mirrors and lenses are called <b>solar concentrators</b>. The heat can boil a liquid to make steam for producing electricity, cook food on a large scale, or run <b>solar furnaces</b> that can even melt steel. Solar cookers also use mirrors to converge sunlight; in Indian villages they save electricity and fuel.'),
], 'What happens to parallel rays?')

# ---------------------------------------------------------------- 5 LENSES
s5 = SEC(5, 'What Is a Lens?', 't-green', [
  '<p>Through a flat glass window, everything looks the same size and shape. But what happens when the transparent material has a <b>curved</b> surface?</p>',
  LAB('Activity 10.8 — A water-drop lens', 'a flat strip of glass or clear plastic (such as a flat scale), a few drops of oil, a dropper, water, and a page with printed text.',
      ['Rub a few drops of oil (or wax) on the strip to leave a very thin coating.',
       'Place a small drop of water on the oiled spot. The oil helps it form a nice round drop.',
       'Look at the shape of the surface of the drop.',
       'Keep the printed page under the strip so that the text is just below the drop, and look down through the drop.'],
      'The surface of the drop curves outwards. The letters under the drop look larger than the letters nearby.',
      'The curved drop of water acts like a simple lens. A magnifying glass is also a lens that makes small print look bigger.',
      fig(F.f_drop(), 'A drop of water acting as a lens.')),
  DEF('Lens', 'A <b>lens</b> is a piece of transparent material, usually glass or plastic, which has <b>curved surfaces</b>. Like mirrors, lenses can be convex or concave.'),
  '<div class="two keep"><div class="card gc"><h4>Convex lens</h4><p>A lens that is <b>thicker in the middle</b> than at the edges.</p></div>'
  '<div class="card bc"><h4>Concave lens</h4><p>A lens that is <b>thicker at the edges</b> than in the middle.</p></div></div>',
  fig(F.f_lens_rep(), 'Convex and concave lenses and how they are drawn.'),
  REM('Mirrors reflect light, but lenses let light <b>pass through</b> them. We see things <b>through</b> a lens, not <b>in</b> a lens.'),
  LAB('Activity 10.9 — How do objects look through lenses?', 'a convex lens, a concave lens, a lens holder and a small object.',
      ['Fix the convex lens upright in its holder and place the object behind it, at the level of the lens.',
       'Look at the object through the lens from the other side and note what you see.',
       'Slowly move the object farther from the lens and keep watching.',
       'Repeat with the concave lens and compare.'],
      'Convex lens: object close → erect and enlarged; farther away → inverted, enlarged at first and then diminished. Concave lens: always erect and diminished; its size changes as it is moved away.',
      'A convex lens can make an object look enlarged or diminished, erect or inverted, depending on its distance. A concave lens always makes it look erect and smaller.',
      fig(F.grid_fig('lens'), 'How a candle placed behind each lens looks as it is moved away. A flat glass piece is shown for comparison.', '88%')),
  TABLE(['Lens', 'Object close to the lens', 'Object moved away'], [
      ['<b>Convex lens</b>', 'Erect, <b>enlarged</b>', '<b>Inverted</b>; enlarged at first, then diminished'],
      ['<b>Concave lens</b>', 'Erect, <b>diminished</b>', 'Erect, diminished; size keeps changing'],
      ['<b>Flat glass piece</b>', 'Same as the object', 'Same as the object']]),
], 'Convex and concave lenses')

# ---------------------------------------------------------------- 6 LENSES CONVERGE + USES
s6 = SEC(6, 'Lenses Converge and Diverge Light', 't-hot', [
  '<p>Mirrors can converge or diverge a beam of light. Do lenses do the same? Let us find out.</p>',
  LAB('Activity 10.10 — Parallel beams through lenses', 'a thin glass plate, a convex lens, a concave lens, a torch, a comb, a paper clip, two identical books and white paper.',
      ['Fix the glass plate (or a lens) upright between two books placed side by side. Spread white paper over the books.',
       'Let several parallel beams from the comb fall on the glass plate, then on the convex lens, then on the concave lens.',
       'Does the beam pass through as it is in all three cases?'],
      'The beam passes through the thin glass plate as it is. The convex lens brings the beams together; the concave lens spreads them out.',
      'A convex lens converges light and a concave lens diverges light.',
      fig(F.f_lens_beams(), 'Parallel beams passing through a glass plate and two lenses.')),
  DEF('Converging and diverging lenses', 'A <b>convex lens</b> is also called a <b>converging lens</b>, because it converges the light falling on it. A <b>concave lens</b> is also called a <b>diverging lens</b>, because it diverges light.'),
  LAB('Activity 10.11 — Can a lens burn paper?', 'a convex lens and a sheet of paper.',
      ['Repeat Activity 10.7, but hold a convex lens in the path of the sunlight instead of the concave mirror.',
       'Move the paper until the spot of light is sharp and bright, and hold it steady.'],
      'A sharp bright spot forms and the paper can start to burn.',
      'A convex lens converges sunlight on to a small spot, just like a concave mirror.',
      fig(sun_l, 'Sunlight converged by a convex lens.', '52%'),
      extra=SAFE('Do not look at the Sun directly or through the lens; it can damage your eyes.')),
  BLOCK('<h3>Where are lenses used?</h3>' + UL([
      '<b>Eyeglasses</b> that help people see clearly are lenses.',
      '<b>Cameras</b> (including smartphone cameras), <b>telescopes</b> and <b>microscopes</b> all use lenses to work.',
      'A <b>magnifying glass</b> is a convex lens that makes small print look bigger.',
      'Our <b>eye</b> has a convex lens inside it. It can change its shape, which lets us read a book and also see things far away.'])
      + fig(F.f_lens_uses(), 'Lenses all around us.')),
], 'Converging and diverging lenses, and their uses')

# ---------------------------------------------------------------- 7 AT A GLANCE
s7 = SEC(7, 'Chapter at a Glance', 't-navy', [
  TABLE(['', 'Image / how objects look', 'Parallel beam of light', 'Uses'], [
      ['<b>Plane mirror</b>', 'Always erect, same size', 'Stays parallel', 'Looking glass'],
      ['<b>Concave mirror</b>', 'Erect &amp; enlarged when close; inverted when farther away', '<b>Converges</b>', 'Torch, headlights, dentist, telescope, solar cooker'],
      ['<b>Convex mirror</b>', 'Always erect &amp; diminished', '<b>Diverges</b>', 'Side-view mirror, road bends, big stores'],
      ['<b>Convex lens</b>', 'Erect &amp; enlarged when close; inverted when farther away', '<b>Converges</b>', 'Magnifying glass, camera, microscope, telescope, eye'],
      ['<b>Concave lens</b>', 'Always erect &amp; diminished', '<b>Diverges</b>', 'Eyeglasses']], 'glance'),
  box('rem', 'Points to remember', UL([
      'Mirrors whose reflecting surfaces are spherical are called spherical mirrors: <b>concave</b> (curves inwards) and <b>convex</b> (curves outwards).',
      'The image in a concave mirror can be enlarged, diminished or of the same size, and erect or inverted, depending on the distance of the object.',
      'The image in a convex mirror is always erect and diminished.',
      '<b>Law 1:</b> the angle of incidence is equal to the angle of reflection.',
      '<b>Law 2:</b> the incident ray, the normal at the point of incidence and the reflected ray all lie in the same plane.',
      'The laws of reflection are valid for plane, concave and convex mirrors.',
      'A concave mirror and a convex lens converge light; a convex mirror and a concave lens diverge light.',
      'Through a convex lens an object can look enlarged or diminished, erect or inverted; through a concave lens it always looks erect and diminished.'])),
  KNOW('More than 800 years ago, in the time of the great Indian mathematician <b>Bhāskara II</b>, astronomers used shallow bowls of water to observe stars and planets. By looking at their reflected images through tubes placed at the right angles, they could measure the positions of stars and planets. The laws of reflection are not written in their books, but their instruments show they understood them in practice!'
       + fig(F.f_heritage(), 'Seeing a star’s reflection in a bowl of water.', '50%'), 'Our scientific heritage'),
], 'Summary of the whole chapter')

body = hero + intro + s1 + s2 + s3 + s4 + s5 + s6 + s7
html = f'<!doctype html><html><head><meta charset="utf-8"><style>{ff}{CSS}</style></head><body>{DEFS}{body}</body></html>'
open('notes.html', 'w').write(html)

# label-size check: printed pt = px * (display px / viewBox W) * 0.75
bad = []
for n, svg, w in FIGW:
    W = float(re.search(r'viewBox="0 0 ([\d.]+)', svg).group(1))
    disp = 703 * float(w.rstrip('%'))/100
    for m in re.finditer(r'<text[^>]*font-size="([\d.]+)"([^>]*)>(.*?)</text>', svg):
        sz = float(m.group(1)); scale = 1.0
        pt = sz*disp/W*.75*scale
        if pt < 8: bad.append((n, m.group(3)[:30], round(pt, 2)))
print('figures', FIGN[0], 'small labels', bad[:20])

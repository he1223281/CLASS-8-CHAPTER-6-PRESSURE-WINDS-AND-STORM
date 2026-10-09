# Light Lab: Mirrors and Lenses

An interactive classroom lab for **Grade 8 Science (NCERT Curiosity), Chapter 10: Light: Mirrors and Lenses**. It is built for a 65-inch classroom TV or a projector, and also works on a laptop.

## How to open it

- **Easiest:** double-click `light-lab-standalone.html`. It is one self-contained file and works offline in Chrome, Edge or Firefox.
- **Editable version:** open `index.html`. It loads `styles.css` and the files in `js/`.
- Press **F** for fullscreen.

No installation, no internet and no libraries are needed. When the computer is online, the page loads three Google Fonts; offline it falls back to system fonts.

## Controls

| Key | Action |
|---|---|
| → / PgDn, ← / PgUp | Next / previous scene (works with presentation clickers) |
| Space | Pause / play the animation |
| R / Shift+R | Replay the animation / reset every control |
| S | Slow motion |
| T | Switch **Teacher** mode (explanations visible) / **Explore** mode (Observe and Explain stay hidden until revealed) |
| E | Reveal the observation and explanation |
| F, M, ? | Fullscreen, all scenes, help |

**Read aloud** reads the explanation using the browser's built-in voice, where one is available.

## Scenes (18, plus the opening)

Each lab follows **Predict → Experiment → Observe → Explain**.

| # | Scene | NCERT link | What students can do |
|---|---|---|---|
| 1 | Meena's mystery at the science centre | Activity 10.1 | Move a face towards plane, concave and convex mirrors; size and orientation change |
| 2 | Curved inwards or outwards? | Activity 10.2, "A step further" | Rotate a 3D imaginary sphere, lift the mirror piece out, see the coated and reflecting sides |
| 2 | Pole, centre, focus | Reference book p. 204 (extension) | Clickable P, C, F, R, f, principal axis, aperture; f = R/2; comparison table |
| 3 | Plane mirror lab | Grade 7 recap | Image distance (drag candle and eye), screen test, lateral inversion with any word, half-height mirror |
| 3 | Spherical mirror lab | Activity 10.3 | Drag the candle, change its height, plane/concave/convex, toggle 4 rays, realistic view, "Place at" positions, live u, v, m |
| 4 | Second law: optical bench | Activity 10.4, Table 10.1 | Drag the torch, protractor measured from the normal, presets 0–75°, observation table, optional ±1° reading error |
| 4 | First law in 3D | Activity 10.5 | Bend the chart paper, view edge-on to see all three lines in one plane |
| 5 | Parallel rays | Activity 10.6 | Exact reflection; number, spacing, mirror rotation, normals, trace one ray at a time, compare all three |
| 6 | Concentrating sunlight | Activities 10.7 and 10.11 | Move the paper through the focus of a concave mirror or a convex lens; spot size, concentration, heating; safety notice |
| 7 | Mirrors in the real world | Figs 10.6, 10.7 | Dentist, headlight, side-view mirror (field of view), blind corner, shop mirror, reflecting telescope; in-text question |
| 8 | Water drop to magnifying glass | Activity 10.8 | Drag a flat sheet, a water drop or a magnifier over text; side-view ray diagram |
| 8 | Lenses in 3D | Figs 10.15, 10.16 | Rotate convex and concave lenses, cut them in half, show rays |
| 9 | Refraction | Extension | Air, water and glass; angle of refraction; wavefronts showing the change of speed |
| 10 | Flat plate, convex, concave | Activity 10.10 | Exact Snell's-law tracing, beam tilt, normals, compare all three |
| 11 | Lens lab | Activity 10.9 | Like the mirror lab, plus a screen that shows a sharp or blurred real image |
| 12 | Lenses around us | Section 10.4 | Magnifier, eyeglasses (short and long sight, with and without glasses), phone camera autofocus, microscope, telescope, human eye |
| 13 | Recap | Snapshots | Comparison table with live ray icons, laws, real vs virtual, Bhāskara II |
| 14 | Keep the curiosity alive | End-of-chapter questions 1–12 | MCQs, picture-matching, answers to reveal, score |

## The physics model

All of it is in `js/optics.js`.

- **Exact ray tracing** (parallel-ray, sunlight, applications and lens-beam scenes). This uses the law of reflection at true spherical mirrors and Snell's law at true spherical glass surfaces (n = 1.5). Edge rays therefore focus slightly closer, a real effect (spherical aberration), and the scenes point it out.
- **School ray-diagram (paraxial) model** (mirror and lens labs, lens applications). This uses the New Cartesian sign convention. Distances are measured from P or O: positive in the direction of the incoming light, negative against it. Mirror: 1/v + 1/u = 1/f, m = −v/u. Lens: 1/v − 1/u = 1/f, m = v/u. Every drawn ray passes through the calculated image point, or seems to come from it for a virtual image. The object at F is handled as "image at infinity" (parallel rays) with no NaN values. Images off the screen get an arrow and their v value.
- These formulas are beyond Grade 8 and appear only in the "Model used here" notes; the scenes teach the ideas.

## Editing

Edit `index.html`, `styles.css` or `js/*.js`, then rebuild the single-file versions:

```
python3 build.py
```

This writes `light-lab-standalone.html` and `dist/artifact.html` (the same page without the html/head/body wrapper, for publishing).

## Notes and limits

- The 3D views use a small built-in renderer on the 2D canvas instead of Three.js, so the lab needs no internet. HyperFrames and Blender were not used: they are not available here and were not needed.
- Applications diagrams are not to scale.
- The eye and spectacles diagrams treat the eye as one thin lens; in a real eye the cornea does much of the bending.

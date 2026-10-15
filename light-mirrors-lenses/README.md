# Light Lab: Mirrors and Lenses

An interactive classroom lab for **Grade 8 Science (NCERT Curiosity), Chapter 10: Light: Mirrors and Lenses**. It is built for a 65-inch classroom TV or a projector, and also works on a laptop. It uses a light, colourful theme.

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

## Teaching order (7 parts, 46 slides after the opening)

Each part opens with a **Part title slide** (what the part covers, with clickable links to its slides). One concept is finished before the next begins.

| Part | Topic | Slides |
|---|---|---|
| 1 | Plane mirrors: reflection and its laws | Light, reflection and images (concept) · The laws of reflection (concept) · Second law: optical bench (Activity 10.4) · First law in 3D (Activity 10.5) |
| 2 | Image formation in plane mirrors | Real and virtual images (concept) · Plane mirror lab |
| 3 | Spherical mirrors | Meena's mystery (Activity 10.1) · What are spherical mirrors? (concept) · Imaginary sphere in 3D (Activity 10.2) · Parts of a spherical mirror (concept) · Terms lab · Converging and diverging mirrors (concept) · Parallel rays (Activity 10.6) · Concentrating sunlight (Activities 10.7, 10.11) |
| 4 | Image formation by spherical mirrors | Four special-ray slides (Rule 1 parallel ray → F; Rule 2 ray through F → parallel; Rule 3 ray through C → back on itself; Rule 4 ray at P → equal angles), each drawn in stages (ray, normal through C, ∠i, reflected ray) for a concave then a convex mirror, with a "Why?" box · Six case slides (object beyond C, at C, between C and F, at F, between F and P, convex mirror), each built in 5 steps: object → Ray 1 → Ray 2 → where they meet → result and why · Images formed by spherical mirrors (concept, position table) · Spherical mirror lab (Activity 10.3) |
| 5 | Lenses | What is a lens? (concept) · Water drop to magnifying glass (Activity 10.8) · Lenses in 3D · Refraction (concept) · Refraction lab · Flat plate, convex, concave (Activity 10.10) |
| 6 | Image formation by lenses | Images formed by lenses (concept, position table) · Lens lab (Activity 10.9) |
| 7 | Applications and comparison | Uses of spherical mirrors (concept) · Mirrors in the real world · Lenses around us · Recap comparison · Chapter questions 1–12 |

**Concept slides** have definition boxes (key words as blanks: filled in Teacher mode, hidden in Explore mode until clicked), laws, important points, a Remember box and an animated diagram. **Next ▶** reveals one point at a time, then moves on.

**Labs** follow **Predict → Experiment → Observe → Explain**.

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

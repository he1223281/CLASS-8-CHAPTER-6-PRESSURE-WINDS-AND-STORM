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

## Teaching order (7 parts, 32 slides after the opening)

The content follows the **NCERT Class 8 Curiosity chapter only**. Pole, focus, centre of curvature, ray diagrams for image formation, refraction, formulas and real/virtual images (Class 10 topics) are not included.

Each part opens with a **Part title slide** listing its slides.

| Part | Topic | Slides |
|---|---|---|
| 1 | Reflection and the laws of reflection | Light, reflection and images (concept) · The laws of reflection (concept) · Second law: optical bench (Activity 10.4, Table 10.1) · First law: bending the paper in 3D (Activity 10.5) |
| 2 | The image in a plane mirror | The image in a plane mirror (concept) · Plane mirror lab (erect, same size, lateral inversion) |
| 3 | Spherical mirrors | Meena's mystery (Activity 10.1) · What are spherical mirrors? (concept) · Curved inwards or outwards, in 3D (Activity 10.2) · Converging and diverging mirrors (concept) · Parallel rays (Activity 10.6) · Concentrating sunlight (Activities 10.7, 10.11) |
| 4 | Images formed by spherical mirrors | Images formed by spherical mirrors (concept) · Mirror lab: move the candle and see the image (Activity 10.3) |
| 5 | Lenses | What is a lens? (concept) · Water drop to magnifying glass (Activity 10.8) · Convex and concave lenses in 3D · Glass plate, convex and concave lens (Activity 10.10) |
| 6 | How objects look through lenses | Images formed by lenses (concept) · Lens lab: look through the lens (Activity 10.9) |
| 7 | Uses of mirrors and lenses, and revision | Uses of spherical mirrors (concept) · Mirrors in the real world · Lenses around us · Mirrors and lenses compared · Keep the curiosity alive (chapter questions 1–12) |

**Concept slides** have definition boxes (key words as blanks: filled in Teacher mode, hidden in Explore mode until clicked), the laws, important points, a Remember box and an animated diagram. **Next ▶** reveals one point at a time, then moves on.

**Labs** follow **Predict → Experiment → Observe → Explain**. The mirror and lens labs show the image as students would see it (erect or inverted, enlarged or diminished); image sizes are worked out internally so they are always correct, but no formulas are shown.

## Editing

Edit `index.html`, `styles.css` or `js/*.js`, then rebuild the single-file versions:

```
python3 build.py
```

This writes `light-lab-standalone.html` and `dist/artifact.html` (the same page without the html/head/body wrapper, for publishing).

## Notes and limits

- The 3D views use a small built-in renderer on the 2D canvas instead of Three.js, so the lab needs no internet. HyperFrames and Blender were not used: they are not available here and were not needed.
- Applications diagrams are not to scale.

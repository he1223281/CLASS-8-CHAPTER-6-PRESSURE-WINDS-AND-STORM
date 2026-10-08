# Light: Mirrors and Lenses — interactive optics lab

An interactive classroom experience for **Grade 8 Science (Curiosity), Chapter 10**, built for a 65-inch classroom TV or projector.

## How to use

1. Open `index.html` in Chrome or Edge. Nothing needs to be installed and it works offline (fonts fall back to system fonts).
2. Press **F** for fullscreen. Move with **→ / ←** or **Page Down / Page Up** (presentation clickers work), or the on-screen buttons.
3. **M** opens the chapter map (jump to any screen), **L** turns diagram labels on/off, **P** hides the bottom bar.

The stage is a fixed 1920×1080 frame that scales to any screen. On a 4K TV the diagrams render at double resolution.

## The physics

- **Image formation** (mirror and lens labs, comparison screens, Optical Lab) uses the ideal mirror / thin-lens relation `1/f = 1/u + 1/v`, `m = −v/u`. Every drawn ray really passes through, or appears to come from, the computed image point.
- **Parallel beams** (Modules 7, 9, 10, 11, 15, 16, solar demos, torch, telescope) use an exact 2-D ray tracer: the law of reflection on spherical mirrors and Snell's law through real thick glass lenses (n = 1.5). Convergence, divergence and the "focal region" are therefore real, not drawn by hand.
- "Find the brightest/sharpest spot" scans the paper distance and picks the narrowest traced spot. "Sunlight concentrated" is the area ratio (aperture ÷ spot)².

## What's inside (28 screens, 21 modules)

| Module | Screen | Interactions |
|---|---|---|
| — | Meena at the science centre | Animated: one person, three mirrors (plane, concave, convex) as she walks; Probe and ponder |
| 1 | Reflection of light | Drag to swing the torch; live i and r; along-the-normal case; plane of the sheet |
| 2 | Spherical mirrors (3-D) | Rotate concave & convex mirrors, side view (Activity 10.2), imaginary hollow sphere, how coating makes each |
| 2 | Activity 10.1 spoon | Inner/outer side, distance slider, linked ray diagram |
| 3 | Concave mirror lab | Drag object; image moves/flips/resizes; 3 or 5/10/20 rays; "what you see" view; discovery prompts |
| 4 | Convex mirror lab | Same, plus field of view vs plane mirror |
| 4 | Convex mirrors at work | Side-view mirror (blind spot), road bend, store; plane vs convex with traced field of view |
| 5 | Three-mirror comparison | One slider, three mirrors side by side; lateral inversion |
| 6 | Laws of reflection (Act. 10.4) | Protractor, record readings into Table 10.1, tilted-mirror cases of Fig. 10.22 |
| 6 | Bent paper (Act. 10.5) | 3-D table: flat → bend → flatten; show where the beam really goes |
| 7 | Parallel rays (Act. 10.6) | Plane / concave / convex; 1, 5, 10, 20 rays; beam angle |
| 8 | Concentrating sunlight (Act. 10.7) | Move paper, auto-focus, heating and smoke; safety warning |
| 8 | Solar concentrators | Trough, solar furnace, solar cooking, heat → steam → electricity |
| 9 | What is a lens? | Mirror → glass transition; morph concave ↔ flat ↔ convex with real refraction |
| 10 | Convex lens | Parallel beam (focal point, focal region, optical centre); object lab (Act. 10.9) |
| 11 | Concave lens | Diverging beam with backward extensions; object lab |
| 12 | Convex vs concave | Split screen, independent draggable objects |
| 13 | Water drop (Act. 10.8) | Drop forms on the strip; real magnified text; side-view ray diagram |
| 14 | Magnifying glass | Drag over tiny print; height slider (enlarged → blurred → inverted) |
| 15 | Plate, convex, concave (Act. 10.10) | Same beam through three pieces of glass |
| 16 | Convex lens burns paper (Act. 10.11) | Lens height, auto-focus, heating; safety warning |
| 17 | Lenses around us | Eyeglasses (with/without), phone camera, camera focusing, telescope, microscope, human eye |
| 18 | Mirrors around us | Torch, headlight (bulb at/not at F), dentist, side-view, road, store, reflecting telescope |
| 19 | Optical Lab | Type, object position & height, focal length, ray count, ray tracing, labels, speed, reset; live info panel |
| 20 | Discovery mode | A hidden mirror or lens: move the object, collect observations, decide, reveal |
| 21 | Recap | The chapter as one beam of light (tap a stop to jump back); Bhāskara II heritage note |

Discovery cards ("MOVE THE OBJECT AND OBSERVE.") in the labs ask a sequence of questions and only reveal the science when the teacher taps **Reveal**.

## Editing

Source is in `src/` (`core.js` frame engine and controls, `optics.js` ray tracer and drawing, one file per module group). After editing, rebuild:

```
python3 build.py
```

This writes `index.html` (standalone) and `dist/artifact.html`.

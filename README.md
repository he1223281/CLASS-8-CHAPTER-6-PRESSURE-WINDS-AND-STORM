# Pressure, Winds, Storms and Cyclones: interactive lesson

An interactive classroom presentation for **Grade 8 Science (Curiosity), Chapter 6**, built for a large classroom TV or projector.

## How to use

1. Open `index.html` in Chrome or Edge. Nothing needs to be installed.
2. Click **Begin the lesson**, then press **F** for fullscreen.
3. Move through the slides with **→ / ←**, **Page Down / Page Up** (works with presentation clickers), or the on-screen buttons.

The stage is a fixed 1920×1080 frame that scales to fit any screen (65-inch TV, 1920×1080 desktop, 1366×768 laptop, projector), so the layout never breaks.

## What's inside (49 slides, 13 sections)

| # | Section | Interactions |
|---|---------|-------------|
| 0 | Opening | Cinematic calm day → storm → lightning & thunder → cyclone; Probe & Ponder; clickable roadmap |
| 1 | Pressure | Megha & Pawan bag straps (prediction), strap-width slider lab, standing vs lying on sand, 7 everyday objects, nail & knife lab, elephant problem, pressure calculator with boat challenge |
| 2 | Liquid pressure | Narrow vs broad pipe balloons (Activity 6.1), overhead tank with floor-by-floor taps, bottle side holes (Activity 6.2), dam pressure vs depth |
| 3 | Air pressure | Atmosphere zoom, paper plate (Activity 6.3), balloon, 15 cm × 15 cm magnitude, why we are not crushed, rubber sucker on smooth/rough surface (Activity 6.4) |
| 4 | Wind | Step-by-step wind formation, two balloons and a straw (Activity 6.5), sea breeze/land breeze day–night toggle, pressure-difference slider, coastal-tree puzzle |
| 5 | High-speed winds | Blowing between balloons (Activity 6.6), roof "What would you do?" simulation |
| 6–8 | Storms, thunderstorms, lightning | Convection storm sequence, thunderstorm cloud charge separation, lightning (within / between clouds / to ground), lightning-first-thunder-later race, storm vs thunderstorm Venn, sequencing quiz |
| 9–10 | Lightning safety & conductor | SAFE / UNSAFE game, safe-position poster, building with/without a lightning conductor |
| 11–12 | Cyclones & safety | Feedback-loop formation (Earth's rotation on/off), top view with draggable weather probe, ocean-vs-land slider, 9 coastal hazards, before/during safety with emergency-kit task and IMD |
| 13 | Challenge | Animated concept map, "Become a weather scientist" 8-step challenge, 60-second recap |

Every simulation has **Play / Pause / Reset / Slow motion**. Experiments open with a **Predict first** question, and each section ends with concept checks (MCQ, true/false, drag-to-order sequences, picture puzzles). **Think & Discuss** cards pause the lesson for class discussion.

## Teacher Controls

Open them with the **Teacher Controls** button or the **T** key:

- Reveal all answers (**A**)
- Restart the simulation (**R**)
- Hide diagram labels (**L**)
- Hide explanations
- Fullscreen (**F**)
- Presentation mode (**P**): hides the bars until the mouse moves
- Slow motion for every simulation
- Mute the thunder sound
- Skip to any slide

**Space** plays or pauses the main simulation on the current slide.

## Editing

The source lives in `src/` (one file per section, plus `engine.js`, `draw.js`, and `real.js` for the realistic procedural textures: clouds, terrain, water, foliage, skin and materials). After editing, rebuild the single-file page:

```
python3 build.py
```

This writes `index.html` (standalone) and `dist/artifact.html`.

Fonts load from Google Fonts when online. Offline, the page falls back to system fonts and still works fully.

## Also in this repository

- **[Light Lab: Mirrors and Lenses](light-mirrors-lenses/)**: an interactive lab for Grade 8 Chapter 10. Open `light-mirrors-lenses/light-lab-standalone.html`.

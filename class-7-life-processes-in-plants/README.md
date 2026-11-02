# Life Processes in Plants: interactive lesson (Class 7)

An interactive classroom presentation for **Grade 7 Science (Curiosity, 2026–27), Chapter 10: Life Processes in Plants**, built for a 65-inch classroom TV.

**File to open:** `Life_Processes_in_Plants_Class_7.html`. It is a single standalone file: all CSS, JavaScript and SVG illustrations are inside it.

## How to open it

1. Copy `Life_Processes_in_Plants_Class_7.html` to the classroom laptop.
2. Right-click it → **Open with → Google Chrome** (Edge also works).
3. Click **Fullscreen** in the bottom bar, or press **F**. Press **Esc** to leave fullscreen.

The stage is a fixed 1920×1080 frame that scales to fit any screen, so the layout never breaks on a TV, a projector or a laptop.

## Controls

| Action | Keys / buttons |
|---|---|
| Next step or slide | → · Space · Page Down · **Next** |
| Previous | ← · Page Up · **Back** |
| Fullscreen on/off | F · **Fullscreen** (Esc exits) |
| Chapter map (jump to any topic) | C · **Contents** |
| Teacher note for the slide | N · **Notes** |
| First / last slide | Home / End · **Home** |
| Start again (resets quiz) | **Restart** |

On each slide, **Next** first reveals the slide's ideas one at a time (the dots in the bar show how many remain), then moves on. On experiment slides, each Next plays the next step of the experiment.

## What's inside (36 slides)

Opening → plant growth time-lapse → students' ideas → **Activity 10.1** three pots (predict, then fast-forward 2 weeks) → Table 10.1 → Vrikshayurveda → leaves as food factories → **Activity 10.2** starch test (5 animated steps, alcohol safety) → why decolourise → **Activity 10.3** variegated leaf → chlorophyll & coloured leaves → role of air → **Activity 10.4** caustic soda bottle → Table 10.3 → four essentials → **photosynthesis journey** (6-step camera zoom from roots into the leaf) → interactive word equation → **Activity 10.5** oxygen bubbles & matchstick → **Activity 10.6** leaf peel under a microscope → stomata gas exchange → xylem (soil → roots → stem → branches → leaves) → **Activity 10.7** red ink → phloem → xylem vs phloem → do plants respire? → **Activity 10.8** germinating seeds & lime water → respiration equation → photosynthesis vs respiration → scientists (Dastur, Sohonie) → bottle garden → mind map → In a nutshell → 15-question quiz → final challenge → closing.

## Dependencies

None are required. The Inter font loads from Google Fonts when online; offline, the page uses the system font and still works fully.

## Editing

The source is in `src/` (`engine.js` holds navigation and the drawing helpers, `s1.js` to `s5.js` hold the scenes). After editing, rebuild the single file:

```
python3 build.py
```

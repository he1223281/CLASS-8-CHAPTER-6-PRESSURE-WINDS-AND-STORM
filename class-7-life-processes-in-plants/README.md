# Life Processes in Plants: cinematic 3D lesson (Class 7)

A real-time 3D classroom film for **Grade 7 Science (Curiosity, 2026–27), Chapter 10: Life Processes in Plants**, built for a 65-inch classroom TV.

**File to open:** `Life_Processes_in_Plants_Class_7.html` (one standalone file, about 820 KB: Three.js, all scenes, styles and text are inside it).

## How to open it

1. Copy `Life_Processes_in_Plants_Class_7.html` to the classroom laptop.
2. Right-click it → **Open with → Google Chrome** (or Edge). It needs WebGL, which every recent laptop has.
3. Wait for the short loading bar, then press **F** (or the **Fullscreen** button). **Esc** leaves fullscreen.

## Controls

| Action | Keys / buttons |
|---|---|
| Next step / next scene | → · Space · Page Down · **›** |
| Back | ← · Page Up · **‹** |
| Jump to any scene | C or I · **Jump to** (or click a section in the bottom bar) |
| Teacher note | N · **Teacher notes** |
| Graphics quality | Q · **Quality** (High / Fast) |
| Fullscreen | F · **Fullscreen** |
| Start again | Home · **Home** |

The bar at the top and bottom fades away after a few seconds without mouse movement, leaving a clean picture; move the mouse to bring it back. A pulsing **›** means the current scene still has more steps.

**If the animation stutters** on an older laptop, press **Q** to switch to *Fast* quality (less grass, softer shadows). The lesson also switches automatically if the first few seconds run slowly.

## Worlds and scenes (45)

- **Modes of nutrition (new, first section):** nutrition, autotrophic and heterotrophic, then parasitic (Cuscuta), saprotrophic (mushrooms), insectivorous (pitcher plant) and symbiotic (lichen, Rhizobium), with a quick check.
- **Garden:** a living sapling in a sunlit meadow (sky, wind-blown grass, trees), a 60-day time-lapse with the sun rising and setting, the Activity 10.1 three-pots patio, and a soil cutaway that shows roots drinking water and minerals.
- **Inside a leaf:** a magnified section with cells, chlorophyll bodies, a vein and stomata. Carbon dioxide, water, sunlight, glucose and oxygen move as 3D molecules; glucose turns to starch and food leaves through the vein.
- **Lab bench:** every textbook activity as a 3D demonstration. These are the starch test (10.2), variegated leaves (10.3), the caustic soda bottle (10.4), oxygen bubbles and the matchstick test (10.5), the leaf peel under a microscope (10.6), red ink (10.7), germinating seeds and lime water (10.8), and the bottle garden.
- **Inside a stem:** red-stained xylem in the cross-section, water and minerals rising in the xylem, and food moving in the phloem.

The lesson also covers the word equations, stomata in photosynthesis and respiration, xylem vs phloem, photosynthesis vs respiration, both scientists (R. H. Dastur, Kamala Sohonie), the final challenge, In a nutshell, and a 15-question quiz with a score.

## Editing

The source is in `3d/src/`:

- `core.js`: renderer, camera rig, captions, labels and navigation.
- `worlds/`: the four 3D worlds.
- `beats1.js` … `beats4.js`: the lesson content, one block per scene.

To rebuild:

```
cd 3d && npm install && npm run build
```

The earlier 2D (SVG) version of this lesson is kept in `2d-version/` as a lightweight fallback for computers without WebGL.

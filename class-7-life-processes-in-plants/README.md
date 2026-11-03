# Life Processes in Plants (Class 7)

A classroom presentation for **Grade 7 Science (Curiosity, 2026–27), Chapter 10: Life Processes in Plants**, built for a 65-inch classroom TV.

**File to open:** `Life_Processes_in_Plants_Class_7.html`. It is one standalone file (about 7.4 MB) with all photos, the video and the 3D animations embedded, so it works offline.

**3D animations:** 26 slides have a **▶ Watch in 3D** button (top right). It opens the matching live 3D animation full screen. Press → / ← to step through it, then **Esc** or **✕ Close 3D** to return to the same slide. The 3D view needs WebGL (any recent Chrome or Edge); press **Q** inside it for faster graphics on an older laptop.

## What it contains (41 slides)

The slides use real photographs and scientifically labelled diagrams, written as notes students can copy.

- **Modes of nutrition:**
  - nutrition, autotrophic and heterotrophic
  - parasitic (Cuscuta), saprotrophic (mushroom, bread mould)
  - insectivorous (pitcher plant, Venus flytrap, sundew)
  - symbiotic (lichen, Rhizobium root nodules)
  - a summary table
- **Growth:** definition, a time-lapse video, and Activity 10.1 (three pots).
- **Leaves:**
  - external structure (lamina, midrib, veins, petiole …)
  - internal structure (T.S. of a leaf: cuticle, epidermis, palisade and spongy cells, chloroplasts, xylem, phloem, stoma, guard cells)
- **Activities 10.2–10.8**, each with a labelled set-up diagram, method, observation table and conclusion. Safety cautions appear where the textbook gives them.
- **Photosynthesis:** definition, word equation, a labelled diagram, and the six steps in order.
- **Stomata:** structure (open and closed), and the leaf-peel activity.
- **Transport:** xylem and phloem, a T.S. of a stem, the red-ink activity, food storage.
- **Respiration:** definition and word equation, and a photosynthesis vs respiration table.
- **Scientists:** R. H. Dastur and Kamala Sohonie.
- **Wrap-up:** bottle garden, In a nutshell, NCERT exercises with answers you can reveal, a 15-question quiz, the final challenge, and photo credits.

Every slide has a **Definition** box and/or a **“Note it down”** box with points students can copy.

**Play your own video:** some slides have a dashed box. Click it and choose a video saved on the laptop (for example, a DIKSHA or NCERT clip you have downloaded). It plays inside the slide.

## How to open

1. Right-click the file → **Open with → Google Chrome**.
2. Press **F** for fullscreen (**Esc** to leave).

**Controls:**

| Action | Keys |
|---|---|
| Next step or slide | → or Space |
| Back | ← |
| Contents | **C** |
| Teacher notes | **N** |

## Credits

Photos are from **iNaturalist** under public-domain or Creative Commons licences; each photo shows its author and licence, and a full list is on the last slide. The time-lapse video is by Grateful Hume (Flickr, CC BY-NC-SA 2.0), via Internet Archive. The diagrams were drawn for this lesson. Use it for non-commercial classroom teaching only.

## Other versions

- `3d/Life_Processes_in_Plants_3D.html`: the full 3D lesson on its own (also embedded in the main file). Rebuild it with `cd 3d && npm install && npm run build` before rebuilding the main file.
- `2d-version/`: the first animated SVG version.

## Editing

Edit the files in `photo-version/src/`, then rebuild:

```
python3 photo-version/build.py photo-version/media 2d-version/src Life_Processes_in_Plants_Class_7.html 3d/Life_Processes_in_Plants_3D.html
```

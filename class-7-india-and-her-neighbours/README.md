# India and Her Neighbours: interactive lesson

An interactive classroom presentation for **Grade 7 Social Science, *Exploring Society: India and Beyond* Part 2, Chapter 2**, built for a 65-inch classroom TV or a projector. The textbook chapter is the only content source.

## How to open and present

1. Open `index.html` in Chrome or Edge. It is one self-contained file: the map data and all photos are embedded, so it works offline.
2. Click **Begin the journey**, then press **F** for fullscreen.
3. Use **→ / Space / Page Down** to go forward and **← / Page Up** to go back. Presentation clickers work too. On a tablet, swipe.

The stage is a fixed 1920×1080 (16:9) frame that scales to fit any screen. The control bar hides itself after a few seconds without mouse movement.

| Key | Action |
|-----|--------|
| → / Space | Next screen |
| ← | Previous screen |
| Home / End | First / last screen |
| F | Fullscreen (Esc exits) |
| T | Teacher notes |
| M | Jump to any screen |

The **Map** button opens the Explorer map (the home screen). Click any neighbour to zoom in, see three key facts, and open its full story.

## The journey (47 screens)

1. **Framing the neighbourhood:** the Big Questions; land vs maritime neighbours (houses analogy, three "rings" on the map); 15,100 km land border; the Indian Ocean (11,100 km coastline); regionalism.
2. **Ancient routes:** Uttarāpatha, Dakṣhiṇāpatha, the Silk Route and the spice/maritime routes, each animated with caravans, ships and travelling ideas.
3. **Explorer map:** the central, clickable navigation map.
4. **Land neighbours:** China (the Himalayas, Buddhism and pilgrim monks, trade balance), Pakistan (before and after 1947, shared culture, Kartarpur Corridor simulation), Bangladesh (rivers crossing the border, Sundarbans cyclone barrier), Nepal (open-border simulation, faith and trade), Bhutan (mountains → rivers → hydropower, Padmasambhava, Gross National Happiness), Myanmar (Trilateral Highway route finder), Afghanistan (Uttarāpatha journey, Zaranj–Delaram).
5. **Maritime neighbours:** the land dissolves into the ocean, then Sri Lanka (Palk Strait zoom, 32 km), the Maldives (Dhivehi words, sea-level slider), Thailand (Dvārakā → Dvāravatī, Ayodhyā → Ayutthayā, samudra manthana), Malaysia, Singapore (clickable city interface), Indonesia (archipelago, 2004 tsunami wave animation, early warning), Iran (Chabahar route), Oman (copper trade).
6. **Synthesis:** a Buddhism timeline scrubber with the three schools, the big connectivity map (10 switchable connection types), SAARC, the big idea, and the "One map. Many connections." finale with the Mandela quote.
7. **Neighbourhood Challenge:** a 10-step mission covering map identification, land/maritime sorting, matching, routes, visual reasoning and a conceptual question. It ends with *Neighbourhood Explorer Unlocked*.
8. **Think like a geographer:** students draw "borders of friendship" on the map with culture, rivers, trade, language and history pens.
9. **Credits:** sources, image credits and licences.

Every major screen has **Teacher notes** (press **T**) with a teaching point, a question to ask, a common misconception and a 20-second explanation.

## Accuracy, media and licences

- All facts, dates and figures come from the textbook chapter. Route lines, map waypoints and the tsunami wave are simplified illustrations.
- **Map:** [Natural Earth](https://www.naturalearthdata.com/) admin-0 countries, India point-of-view edition (public domain), so India's boundaries follow the official Indian depiction. The data is reprojected and simplified by `tools/geo.py` into `assets/map.json`.
- **Photos:** 11 openly licensed Wikimedia Commons images (CC BY / CC BY-SA / CC0). Each is credited on its slide and on the final Credits screen. The full manifest (title, creator, source URL, licence, licence URL, date accessed, attribution required) is in `assets/licenses.json`.
- All other visuals (houses, Sundarbans, open border, hydropower, Kartarpur, Bamiyan, samudra manthana, Singapore city, sea-level and ingot diagrams) are original SVG/CSS drawings. No textbook figures are reproduced.
- Fonts (Noto, SIL OFL) load from Google Fonts when online. Offline, system fonts are used.
- Animations respect the operating system's *reduce motion* setting.

## Editing

The source is in `src/`: `core.js` (engine, map, routes, navigation), one file per part (`s1_framing.js`, `s2_land.js`, `s3_maritime.js`, `s4_synthesis.js`), `style.css` and `shell.html`. After editing, rebuild:

```
python3 build.py
```

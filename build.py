#!/usr/bin/env python3
"""Builds the single-file presentation from src/.
   index.html          - full standalone page (open directly in a browser)
   dist/artifact.html  - same content without the document wrapper (for publishing)"""
import os
ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda f: open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
JS = ['draw.js', 'real.js', 'engine.js', 's0_intro.js', 's1_pressure.js', 's2_liquid.js', 's3_air.js', 's4_wind.js',
      's5_highspeed.js', 's6_storms.js', 's9_safety.js', 's11_cyclone.js', 's13_end.js']
title = 'Pressure, Winds, Storms & Cyclones'
fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Big+Shoulders+Display:wght@700;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap">'
head = f'<title>{title}</title>\n{fonts}\n<style>\n{S("style.css")}\n</style>\n'
body = S('shell.html') + '\n<script>\n' + '\n'.join(S(f) for f in JS) + '\nboot();\n</script>\n'
full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head + '</head>\n<body>\n' + body + '</body>\n</html>\n')
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(full)
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
open(os.path.join(ROOT, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(head + body)
print('built', len(full) // 1024, 'KB')

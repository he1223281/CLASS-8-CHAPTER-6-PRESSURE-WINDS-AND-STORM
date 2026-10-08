#!/usr/bin/env python3
"""Builds the single-file presentation from src/ + assets/.
   index.html  - standalone page with map data and photos embedded (works offline)"""
import os, json, base64
ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda f: open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
JS = ['core.js', 's1_framing.js', 's2_land.js', 's3_maritime.js', 's4_synthesis.js']
mapdata = open(os.path.join(ROOT, 'assets', 'map.json'), encoding='utf-8').read()
lic = json.load(open(os.path.join(ROOT, 'assets', 'licenses.json'), encoding='utf-8'))
img, meta = {}, {}
for m in lic:
    name = os.path.splitext(os.path.basename(m['file']))[0]
    data = open(os.path.join(ROOT, m['file']), 'rb').read()
    img[name] = 'data:image/webp;base64,' + base64.b64encode(data).decode()
    meta[name] = {'title': m['asset_title'], 'creator': m['creator'], 'license': m['license'], 'license_url': m['license_url'],
                  'source_url': m['source_url'], 'alt': m.get('alt', m['asset_title'])}
title = 'India and Her Neighbours'
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Mono:wght@500;600&family=Noto+Serif+Display:ital,wght@0,600;0,700;0,800;1,500;1,600&display=swap">')
data = (f'const MAP={mapdata};\nconst IMG={json.dumps(img)};\nconst IMGMETA={json.dumps(meta, ensure_ascii=False)};\n')
full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'<title>{title}</title>\n<meta name="description" content="Interactive Grade 7 lesson: India and Her Neighbours">\n'
        f'{fonts}\n<style>\n{S("style.css")}\n</style>\n</head>\n<body>\n{S("shell.html")}\n'
        f'<script>\n{data}{chr(10).join(S(f) for f in JS)}\nboot();\n</script>\n</body>\n</html>\n')
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(full)
print('built index.html', len(full) // 1024, 'KB')

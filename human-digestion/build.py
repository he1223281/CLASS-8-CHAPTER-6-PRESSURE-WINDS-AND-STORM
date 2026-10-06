#!/usr/bin/env python3
"""Builds the single-file presentation from src/ -> digestion.html (fully self-contained)."""
import os
ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda f: open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
JS = ['core.js', 'art.js', 'tex.js', 's1_mystery.js', 's2_mouth.js', 's3_stomach.js', 's4_intestine.js', 's5_absorb.js', 's6_end.js']
JS = [f for f in JS if os.path.exists(os.path.join(ROOT, 'src', f))]
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap">')
html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<title>Digestion in Human Beings</title>\n' + fonts + '\n<style>\n' + S('style.css') + '\n</style>\n</head>\n<body>\n'
        + S('shell.html') + '\n<script>\n' + '\n'.join(S(f) for f in JS) + '\nsetTimeout(() => { boot(); const l = document.getElementById("loading"); if (l) l.remove(); }, 30);\n</script>\n</body>\n</html>\n')
out = os.path.join(ROOT, 'digestion.html')
open(out, 'w', encoding='utf-8').write(html)
print('built', out, len(html) // 1024, 'KB')

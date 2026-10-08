#!/usr/bin/env python3
"""Builds the single-file lesson from src/.
   index.html          - full standalone page (open directly in a browser)
   dist/artifact.html  - same content without the document wrapper (for publishing)"""
import os
ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda f: open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
JS = ['core.js', 'optics.js', 'm_mirrors.js', 'm_laws.js', 'm_lenses.js', 'm_magnify.js', 'm_apps.js', 'm_lab.js', 'notes.js']
title = 'Mirrors and Lenses Lab'
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap">')
head = f'<title>{title}</title>\n{fonts}\n<style>\n{S("style.css")}\n</style>\n'
body = S('shell.html') + '\n<script>\n' + '\n'.join(S(f) for f in JS) + '\nboot();\n</script>\n'
full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head + '</head>\n<body>\n' + body + '</body>\n</html>\n')
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(full)
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
open(os.path.join(ROOT, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(head + body)
print('built', len(full) // 1024, 'KB')

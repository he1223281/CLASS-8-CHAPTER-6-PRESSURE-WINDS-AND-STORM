#!/usr/bin/env python3
"""Builds the single standalone presentation file from src/."""
import os
ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda f: open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
JS = ['engine.js', 's1.js', 's2.js', 's3.js', 's4.js', 's5.js']
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap">')
html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<title>Life Processes in Plants</title>\n' + fonts + '\n<style>\n' + S('style.css') + '\n</style>\n</head>\n<body>\n'
        + S('shell.html') + '\n<script>\n' + '\n'.join(S(f) for f in JS) + '\nboot();\n</script>\n</body>\n</html>\n')
out = os.path.join(ROOT, 'Life_Processes_in_Plants_Class_7.html')
open(out, 'w', encoding='utf-8').write(html)
print('built', out, len(html) // 1024, 'KB')

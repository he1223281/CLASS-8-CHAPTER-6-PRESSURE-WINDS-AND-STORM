#!/usr/bin/env python3
"""Builds the photo-based presentation into one standalone HTML file.
   Usage: python3 build.py <media-dir> <2d-src-dir> <output.html>
   media-dir: images.json (embedded photos + credits) and oxalis.mp4"""
import os, sys, json, base64
ROOT = os.path.dirname(os.path.abspath(__file__))
MEDIA, SRC2D, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
S = lambda f: open(os.path.join(ROOT, 'src', f), encoding='utf-8').read()
imgs = json.load(open(os.path.join(MEDIA, 'images.json')))
vid = 'data:video/mp4;base64,' + base64.b64encode(open(os.path.join(MEDIA, 'oxalis.mp4'), 'rb').read()).decode()
engine = S('engine.js')
engine = engine.replace("if(o.init)o.init(el,o);", "if(o.init)o.init(el,o);if(typeof wireVslots==='function')wireVslots(el);")
engine = engine.replace("if(prev&&prev.classList.contains('active')&&po){", "if(prev&&prev.classList.contains('active')&&po){$$('video',prev).forEach(v=>v.pause());")
# quiz, final challenge and closing slide are reused from the 2D lesson
s5 = open(os.path.join(SRC2D, 's5.js'), encoding='utf-8').read()
quiz = s5[s5.index('const QZ=['):]
data = 'const IMG=' + json.dumps(imgs) + ';\nconst VIDS={oxalis:"' + vid + '"};\n'
js = '\n'.join([data, engine, S('helpers.js'), S('p1.js'), S('p2.js'), S('p3.js'), quiz, S('p5.js'), 'boot();'])
css = S('style.css') + '\n' + S('extra.css')
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap">')
html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<title>Life Processes in Plants</title>\n' + fonts + '\n<style>\n' + css + '\n</style>\n</head>\n<body>\n'
        + S('shell.html') + '\n<script>\n' + js.replace('</script', '<\\/script') + '\n</script>\n</body>\n</html>\n')
open(OUT, 'w', encoding='utf-8').write(html)
print('built', OUT, len(html) // 1024, 'KB')

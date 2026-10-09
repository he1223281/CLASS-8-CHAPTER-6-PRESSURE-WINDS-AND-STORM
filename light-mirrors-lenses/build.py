#!/usr/bin/env python3
"""Builds single-file versions of the lab from index.html + styles.css + js/*.js.
   light-lab-standalone.html  - one self-contained page (open directly in a browser, works offline)
   dist/artifact.html         - same content without the <html>/<head>/<body> wrapper (for publishing)"""
import os, re
ROOT = os.path.dirname(os.path.abspath(__file__))
read = lambda f: open(os.path.join(ROOT, f), encoding='utf-8').read()
html = read('index.html')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + read('styles.css') + '\n</style>')
html = re.sub(r'<script src="(js/[^"]+)"></script>\n?', lambda m: '<script>\n' + read(m.group(1)) + '\n</script>\n', html)
assert 'src="js/' not in html
open(os.path.join(ROOT, 'light-lab-standalone.html'), 'w', encoding='utf-8').write(html)
head = html.split('<head>', 1)[1].split('</head>', 1)[0]
head = re.sub(r'<meta[^>]*>\n?', '', head)
body = html.split('<body>', 1)[1].rsplit('</body>', 1)[0]
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
open(os.path.join(ROOT, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(head.strip() + '\n' + body)
print('built light-lab-standalone.html', len(html) // 1024, 'KB')

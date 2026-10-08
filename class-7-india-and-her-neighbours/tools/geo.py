"""Projects Natural Earth (India POV) countries + rivers to SVG path data (Mercator)."""
import json, math, sys
import numpy as np
SRC, RIV, OUT = sys.argv[1:4]
LON0, LON1, LAT0, LAT1 = 22, 150, -24, 56
K = 1100 / math.radians(1)  / 57.29577951308232 * 57.29577951308232  # px per radian
K = 1100.0
def my(lat): return math.log(math.tan(math.pi/4 + math.radians(lat)/2))
Y0 = my(LAT1)
def P(lon, lat):
    lat = max(min(lat, 85), -85)
    return (K * math.radians(lon - LON0), K * (Y0 - my(lat)))
W, H = P(LON1, LAT0)
print('size', W, H)
TOL = 0.45
def dp(pts, tol):
    if len(pts) < 4: return pts
    a = np.array(pts); keep = np.zeros(len(a), bool); keep[0] = keep[-1] = True
    st = [(0, len(a) - 1)]
    while st:
        i, j = st.pop()
        if j <= i + 1: continue
        p, q = a[i], a[j]; seg = a[i+1:j]; d = q - p; n = math.hypot(*d)
        if n == 0: dist = np.hypot(*(seg - p).T)
        else: dist = np.abs(d[0]*(seg[:,1]-p[1]) - d[1]*(seg[:,0]-p[0])) / n
        k = int(np.argmax(dist))
        if dist[k] > tol: keep[i+1+k] = True; st += [(i, i+1+k), (i+1+k, j)]
    return [tuple(x) for x in a[keep]]
def clip(poly, xmin, ymin, xmax, ymax):
    def c(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            cur, prev = pts[i], pts[i-1]
            if inside(cur):
                if not inside(prev): out.append(inter(prev, cur))
                out.append(cur)
            elif inside(prev): out.append(inter(prev, cur))
        return out
    def ix(x): return lambda p, q: (x, p[1] + (q[1]-p[1]) * (x-p[0]) / (q[0]-p[0]))
    def iy(y): return lambda p, q: (p[0] + (q[0]-p[0]) * (y-p[1]) / (q[1]-p[1]), y)
    for ins, it in [(lambda p: p[0] >= xmin, ix(xmin)), (lambda p: p[0] <= xmax, ix(xmax)),
                    (lambda p: p[1] >= ymin, iy(ymin)), (lambda p: p[1] <= ymax, iy(ymax))]:
        if not poly: break
        poly = c(poly, ins, it)
    return poly
M = 20
def ring_path(ring):
    pts = [P(*c[:2]) for c in ring]
    pts = clip(pts, -M, -M, W + M, H + M)
    if len(pts) < 3: return '', 0
    pts = dp(pts + [pts[0]], TOL)[:-1]
    if len(pts) < 3: return '', 0
    area = 0.5 * abs(sum(pts[i][0]*pts[i-1][1] - pts[i-1][0]*pts[i][1] for i in range(len(pts))))
    if area < 0.6: return '', 0
    s = 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z'
    return s, area
def centroid(ring):
    pts = [P(*c[:2]) for c in ring]; A = cx = cy = 0
    for i in range(len(pts)):
        x0, y0 = pts[i-1]; x1, y1 = pts[i]; f = x0*y1 - x1*y0; A += f; cx += (x0+x1)*f; cy += (y0+y1)*f
    return (cx/(3*A), cy/(3*A)) if A else pts[0]
d = json.load(open(SRC)); out = {'W': round(W, 1), 'H': round(H, 1), 'K': K, 'LON0': LON0, 'LAT1': LAT1, 'c': {}, 'rivers': {}}
for f in d['features']:
    p = f['properties']; g = f['geometry']; code = p['ADM0_A3']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    parts = []; best = (0, None)
    for poly in polys:
        for ri, ring in enumerate(poly):
            s, a = ring_path(ring)
            if s: parts.append(s)
            if ri == 0 and a > best[0]: best = (a, ring)
    if not parts: continue
    e = out['c'].setdefault(code, {'n': p['NAME'], 'd': ''})
    e['d'] += ''.join(parts)
    if best[1] is not None:
        cx, cy = centroid(best[1]); e['cx'], e['cy'] = round(cx, 1), round(cy, 1)
r = json.load(open(RIV))
want = {'Ganges': 'ganga', 'Brahmaputra': 'brahmaputra', 'Yarlung': 'brahmaputra', 'Dihang': 'brahmaputra', 'Indus': 'indus', 'Yamuna': 'yamuna', 'Sutlej': 'sutlej', 'Ayeyarwady': 'irrawaddy'}
for f in r['features']:
    n = f['properties'].get('name')
    if n not in want: continue
    g = f['geometry']; ls = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
    for l in ls:
        pts = dp([P(*c[:2]) for c in l], 0.3)
        if pts[0][0] < 0 or pts[0][0] > W: continue
        out['rivers'].setdefault(want[n], []).append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts))
json.dump(out, open(OUT, 'w'), separators=(',', ':'))
print(len(out['c']), 'countries', sum(len(v['d']) for v in out['c'].values()) // 1024, 'KB')

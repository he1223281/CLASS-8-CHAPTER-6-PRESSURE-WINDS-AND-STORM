"""Geometry + SVG primitives for the Light chapter notes."""
import math

def f(v): return f'{v:.1f}'.rstrip('0').rstrip('.')

def unit(v):
    l = math.hypot(*v); return (v[0]/l, v[1]/l)

def dot(a, b): return a[0]*b[0] + a[1]*b[1]

def refl(d, n):
    k = 2*dot(d, n); return unit((d[0]-k*n[0], d[1]-k*n[1]))

def refr(d, n, n1, n2):
    c = -dot(d, n)
    if c < 0: n = (-n[0], -n[1]); c = -c
    r = n1/n2; k = 1 - r*r*(1-c*c)
    if k < 0: return None
    return unit((r*d[0] + (r*c - math.sqrt(k))*n[0], r*d[1] + (r*c - math.sqrt(k))*n[1]))

def hit(p, d, c, R, side):
    """Intersection of ray p+t d with circle (c,R) on the half where (P-c).side > 0."""
    ox, oy = p[0]-c[0], p[1]-c[1]
    b = ox*d[0] + oy*d[1]; cc = ox*ox + oy*oy - R*R; disc = b*b - cc
    if disc < 0: return None
    s = math.sqrt(disc)
    for t in sorted([-b-s, -b+s]):
        if t > 1e-6:
            P = (p[0]+t*d[0], p[1]+t*d[1])
            if dot((P[0]-c[0], P[1]-c[1]), side) > 0: return P
    return None

def normal(P, c, R): return ((P[0]-c[0])/R, (P[1]-c[1])/R)

def arc_pts(c, R, a0, a1, n=48):
    return [(c[0]+R*math.cos(a0+(a1-a0)*i/n), c[1]+R*math.sin(a0+(a1-a0)*i/n)) for i in range(n+1)]

def poly(pts, close=False):
    s = 'M' + ' L'.join(f'{f(x)},{f(y)}' for x, y in pts)
    return s + (' Z' if close else '')

# ---------------- SVG pieces ----------------
INK = '#1b2a4a'

def T(x, y, s, size=13, anchor='middle', w=600, fill=INK, extra=''):
    return f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" text-anchor="{anchor}" font-weight="{w}" fill="{fill}" {extra}>{s}</text>'

def TL(x, y, lines, size=13, anchor='middle', w=600, fill=INK, lh=None):
    lh = lh or size*1.22
    return ''.join(T(x, y+i*lh, s, size, anchor, w, fill) for i, s in enumerate(lines))

def line(a, b, col=INK, w=1.5, dash=None, extra=''):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}" stroke="{col}" stroke-width="{w}"{d} stroke-linecap="round" {extra}/>'

def lead(a, b, col='#56668a'):
    return line(a, b, col, 1.1) + f'<circle cx="{f(b[0])}" cy="{f(b[1])}" r="2.4" fill="{col}"/>'

def head(p, d, col, size=9):
    d = unit(d); n = (-d[1], d[0])
    a = (p[0]+d[0]*size*.55, p[1]+d[1]*size*.55)
    b = (p[0]-d[0]*size*.45 + n[0]*size*.42, p[1]-d[1]*size*.45 + n[1]*size*.42)
    c = (p[0]-d[0]*size*.45 - n[0]*size*.42, p[1]-d[1]*size*.45 - n[1]*size*.42)
    return f'<path d="{poly([a,b,c], True)}" fill="{col}"/>'

RAY = '#f08c00'; RAY2 = '#e8590c'

def ray(pts, col=RAY, w=2.4, arrows=True, dash=None, frac=0.5):
    out = f'<path d="{poly(pts)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>'
    if arrows:
        for a, b in zip(pts, pts[1:]):
            L = math.hypot(b[0]-a[0], b[1]-a[1])
            if L > 26:
                m = (a[0]+(b[0]-a[0])*frac, a[1]+(b[1]-a[1])*frac)
                out += head(m, (b[0]-a[0], b[1]-a[1]), col, 8 + w*1.3)
    return out

def hatch_along(pts, side=1, step=9, L=9, col='#7a869e'):
    """Short slanted hatch lines on one side of a polyline (the non-reflecting back)."""
    out = []; acc = 0
    for a, b in zip(pts, pts[1:]):
        seg = math.hypot(b[0]-a[0], b[1]-a[1])
        if seg == 0: continue
        d = ((b[0]-a[0])/seg, (b[1]-a[1])/seg); n = (-d[1]*side, d[0]*side)
        t = (step - acc) % step
        while t < seg:
            p = (a[0]+d[0]*t, a[1]+d[1]*t)
            q = (p[0] + n[0]*L + d[0]*L*.6, p[1] + n[1]*L + d[1]*L*.6)
            out.append(line(p, q, col, 1.1))
            t += step
        acc = (acc + seg) % step
    return ''.join(out)

def mirror_curve(pts, side=1, w=4.5):
    """Mirror: silver reflecting line + hatched back on `side`."""
    return hatch_along(pts, side) + f'<path d="{poly(pts)}" fill="none" stroke="#5c6b84" stroke-width="{w+2}" stroke-linecap="round"/>' \
        + f'<path d="{poly(pts)}" fill="none" stroke="url(#gm)" stroke-width="{w}" stroke-linecap="round"/>'

def candle(x, yb, s=1.0, inv=False, blur=False):
    sy = -s if inv else s
    g = f'<g transform="translate({f(x)},{f(yb)}) scale({f(s)},{f(sy)})">'
    g += '<rect x="-7" y="-38" width="14" height="38" rx="2.5" fill="url(#gc)" stroke="#a61e4d" stroke-width="1.2" vector-effect="non-scaling-stroke"/>'
    g += '<rect x="-7" y="-38" width="14" height="5" rx="2" fill="#fff" opacity=".45"/>'
    g += '<line x1="0" y1="-38" x2="0" y2="-43" stroke="#343a40" stroke-width="1.6" vector-effect="non-scaling-stroke"/>'
    g += '<path d="M0,-62 C7,-52 7,-46 0,-42 C-7,-46 -7,-52 0,-62 Z" fill="url(#gf)"/>'
    g += '<path d="M0,-54 C3,-49 3,-46 0,-44 C-3,-46 -3,-49 0,-54 Z" fill="#fff3bf"/>'
    g += '<rect x="-12" y="-1" width="24" height="3" rx="1.5" fill="#868e96"/>'
    return g + '</g>'

CANDLE_H = 63  # local units, base to flame tip

def sun(cx, cy, r=26):
    out = ''
    for k in range(12):
        a = k*math.pi/6
        out += line((cx+math.cos(a)*(r+5), cy+math.sin(a)*(r+5)), (cx+math.cos(a)*(r+14), cy+math.sin(a)*(r+14)), '#f59f00', 3)
    return out + f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{r}" fill="url(#gs)" stroke="#f08c00" stroke-width="1.5"/>'

def eye(x, y, s=1.0, look='right'):
    flip = -1 if look == 'left' else 1
    rot = {'right': 0, 'left': 0, 'down': 90, 'up': -90}[look]
    return (f'<g transform="translate({f(x)},{f(y)}) rotate({rot}) scale({f(s*flip)},{f(s)})">'
            '<path d="M-16,0 Q0,-13 16,0 Q0,13 -16,0 Z" fill="#fff" stroke="#1b2a4a" stroke-width="1.6"/>'
            '<circle cx="5" cy="0" r="6" fill="#1864ab"/><circle cx="6" cy="0" r="2.8" fill="#10254d"/>'
            '<circle cx="7.5" cy="-2" r="1.2" fill="#fff"/></g>')

DEFS = '''<svg width="0" height="0" style="position:absolute"><defs>
<linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8f9fa"/><stop offset=".45" stop-color="#ced4da"/><stop offset=".55" stop-color="#f1f3f5"/><stop offset="1" stop-color="#adb5bd"/></linearGradient>
<radialGradient id="gmc" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#f8fbff"/><stop offset=".7" stop-color="#d0ebff"/><stop offset="1" stop-color="#a5d8ff"/></radialGradient>
<radialGradient id="gmv" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e7f5ff"/><stop offset="1" stop-color="#91a7c0"/></radialGradient>
<radialGradient id="gmk" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#91a7c0"/><stop offset=".6" stop-color="#d0ebff"/><stop offset="1" stop-color="#f8fbff"/></radialGradient>
<linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e7f5ff" stop-opacity=".95"/><stop offset=".5" stop-color="#a5d8ff" stop-opacity=".75"/><stop offset="1" stop-color="#74c0fc" stop-opacity=".8"/></linearGradient>
<radialGradient id="gs" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#fff9db"/><stop offset=".55" stop-color="#ffd43b"/><stop offset="1" stop-color="#fab005"/></radialGradient>
<linearGradient id="gf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e8590c"/><stop offset=".5" stop-color="#fd7e14"/><stop offset="1" stop-color="#ffd43b"/></linearGradient>
<linearGradient id="gc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f06595"/><stop offset=".5" stop-color="#ffa8c5"/><stop offset="1" stop-color="#e64980"/></linearGradient>
<linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3b37a"/><stop offset="1" stop-color="#b07a3f"/></linearGradient>
<linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7f5ff"/><stop offset="1" stop-color="#fff9ec"/></linearGradient>
<linearGradient id="gnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10254d"/><stop offset="1" stop-color="#3b5bdb"/></linearGradient>
<linearGradient id="gwat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#74c0fc"/><stop offset="1" stop-color="#1c7ed6"/></linearGradient>
<linearGradient id="gmet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dee2e6"/><stop offset=".5" stop-color="#868e96"/><stop offset="1" stop-color="#495057"/></linearGradient>
<radialGradient id="gspot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#ffe066"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>
</defs></svg>'''

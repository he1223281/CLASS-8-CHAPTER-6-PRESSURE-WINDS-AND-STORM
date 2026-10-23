import math
from geo import *

def SVG(W, H, body, bg='#f8fbff'):
    return f'<svg class="dg" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg"><rect width="{W}" height="{H}" rx="14" fill="{bg}"/>{body}</svg>'

def panel(x, y, w, h, title=None, col='#1864ab', tint='#ffffff', ty=None):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{tint}" stroke="#d6e2f0" stroke-width="1.2"/>'
    if title: out += T(x + w/2, ty or y + 22, title, 13.5, w=700, fill=col)
    return out

def pill(x, y, s, col, size=13, pad=12):
    w = len(s)*size*.56 + pad*2
    return f'<rect x="{f(x-w/2)}" y="{f(y-size*1.05)}" width="{f(w)}" height="{f(size*1.55)}" rx="{f(size*.78)}" fill="{col}"/>' + T(x, y, s, size, w=700, fill='#fff')

# ---------- shapes ----------
def face(x, y, s=1.0, inv=False):
    r = 180 if inv else 0
    return (f'<g transform="translate({f(x)},{f(y)}) rotate({r}) scale({f(s)})">'
            '<path d="M-22,-4 Q-24,-30 0,-31 Q24,-30 22,-4 Q14,-18 0,-19 Q-14,-18 -22,-4 Z" fill="#5c3d2e"/>'
            '<circle cx="0" cy="0" r="22" fill="#ffd8a8" stroke="#d9480f" stroke-width="1.2"/>'
            '<path d="M-22,-4 Q-20,-27 0,-27 Q20,-27 22,-4 Q12,-16 0,-16 Q-12,-16 -22,-4 Z" fill="#5c3d2e"/>'
            '<circle cx="-8" cy="1" r="2.6" fill="#1b2a4a"/><circle cx="8" cy="1" r="2.6" fill="#1b2a4a"/>'
            '<path d="M-9,10 Q0,17 9,10" fill="none" stroke="#c92a2a" stroke-width="2" stroke-linecap="round"/></g>')

def convex_poly(x0, cy, R, t):
    h = math.sqrt(R*R - (R-t)**2); a = math.asin(h/R)
    L = arc_pts((x0-t+R, cy), R, math.pi+a, math.pi-a)
    Rr = arc_pts((x0+t-R, cy), R, a, -a)
    return L + Rr, h

def concave_poly(x0, cy, R, tc, H):
    b = math.asin(H/R)
    L = arc_pts((x0-tc-R, cy), R, -b, b)
    Rr = arc_pts((x0+tc+R, cy), R, math.pi-b, math.pi+b)
    return L + Rr

def lens_shape(pts, w=1.6):
    return f'<path d="{poly(pts, True)}" fill="url(#gg)" stroke="#1971c2" stroke-width="{w}"/>'

def trace_lens(p, d, surfaces, n=1.5, out_len=200):
    """surfaces: list of (center, R, side, aperture_h, cy). Returns polyline points."""
    pts = [p]; cur = p; dd = d; media = [(1.0, n), (n, 1.0)]
    for (c, R, side), (n1, n2) in zip(surfaces, media):
        P = hit(cur, dd, c, R, side)
        if P is None: return None
        dd = refr(dd, normal(P, c, R), n1, n2)
        if dd is None: return None
        pts.append(P); cur = P
    pts.append((cur[0]+dd[0]*out_len, cur[1]+dd[1]*out_len))
    return pts

def clip_len(pts, xmin=-1e9, xmax=1e9, ymin=-1e9, ymax=1e9):
    """Shorten the last segment so it stays inside the box."""
    a, b = pts[-2], pts[-1]; t = 1.0
    for lo, hi, i in ((xmin, xmax, 0), (ymin, ymax, 1)):
        dv = b[i]-a[i]
        if dv > 0 and b[i] > hi: t = min(t, (hi-a[i])/dv)
        if dv < 0 and b[i] < lo: t = min(t, (lo-a[i])/dv)
    pts[-1] = (a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t)
    return pts

def smoke(x, y):
    out = ''
    for k, dx in enumerate((-6, 2, 9)):
        out += f'<path d="M{f(x+dx)},{f(y-6)} q-7,-10 0,-18 q7,-9 0,-18 q-6,-8 1,-15" fill="none" stroke="#868e96" stroke-width="2" stroke-linecap="round" opacity="{.75-k*.15}"/>'
    return out

def spot(x, y, r=13):
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="url(#gspot)"/><circle cx="{f(x)}" cy="{f(y)}" r="3.2" fill="#fff"/>'

# ======================= FIGURES =======================

def f_spoon():
    W, H = 700, 146
    b = panel(10, 6, 335, 134, '(a) Inner surface — curves inwards', '#6741d9', ty=26)
    b += panel(355, 6, 335, 134, '(b) Outer surface — bulges outwards', '#6741d9', ty=26)
    for x0, inner in ((10, True), (355, False)):
        cx, cy = x0+110, 80
        b += f'<path d="M{cx+54},{cy-7} C{cx+110},{cy-6} {cx+160},{cy+1} {cx+200},{cy+3} L{cx+200},{cy+12} C{cx+160},{cy+12} {cx+110},{cy+8} {cx+54},{cy+7} Z" fill="url(#gmet)" stroke="#495057" stroke-width="1.2"/>'
        b += f'<ellipse cx="{cx}" cy="{cy}" rx="58" ry="40" fill="url(#{"gmk" if inner else "gmv"})" stroke="#495057" stroke-width="2"/>'
        if inner:
            b += face(cx, cy+2, .7, inv=True) + T(cx+130, cy+34, 'Image: inverted', 13, fill='#c92a2a')
        else:
            b += face(cx, cy+2, .48) + T(cx+130, cy+34, 'Image: erect, smaller', 13, fill='#2b8a3e')
        b += T(cx+175, cy-14, 'Spoon', 12.5, fill='#495057')
    return SVG(W, H, b)

def f_rep():
    W, H = 700, 240
    b = panel(10, 10, 335, 220, '(a) Concave mirror', '#6741d9')
    b += panel(355, 10, 335, 220, '(b) Convex mirror', '#6741d9')
    R, a = 150, math.radians(25)
    # concave: centre to the left; reflecting side faces left
    cx, cy = 210, 112
    pts = arc_pts((cx-R, cy), R, -a, a)
    b += mirror_curve(pts, side=-1)
    for k in (-1, 0, 1):
        y = cy + k*42; xs = (cx-R) + math.sqrt(R*R-(k*42)**2)
        b += ray([(40, y), (xs-3, y)], RAY, 2.2)
    b += T(80, 66, 'Light falls here', 12.5, fill='#e8590c')
    b += lead((264, 82), (cx+9, cy-50)) + TL(266, 76, ['Shaded back', '(does not reflect)'], 12, 'start')
    b += TL(176, 214, ['Reflecting surface curves inwards'], 13, fill='#6741d9')
    # convex: centre to the right
    cx = 590
    pts = arc_pts((cx+R, cy), R, math.pi+a, math.pi-a)
    b += mirror_curve(pts, side=-1)
    for k in (-1, 0, 1):
        y = cy + k*42; xs = (cx+R) - math.sqrt(R*R-(k*42)**2)
        b += ray([(385, y), (xs-3, y)], RAY, 2.2)
    b += T(425, 66, 'Light falls here', 12.5, fill='#e8590c')
    b += lead((618, 160), (cx+14, cy+44)) + TL(620, 174, ['Shaded back'], 12, 'start')
    b += TL(522, 214, ['Reflecting surface bulges outwards'], 13, fill='#6741d9')
    return SVG(W, H, b)

def f_coat():
    W, H = 700, 250
    b = panel(10, 10, 222, 230, 'A hollow sphere', '#6741d9')
    b += panel(239, 10, 222, 230, 'Coating outside', '#6741d9')
    b += panel(468, 10, 222, 230, 'Coating inside', '#6741d9')
    c = (122, 128)
    b += f'<circle cx="{c[0]}" cy="{c[1]}" r="72" fill="#f3f0ff" stroke="#9775fa" stroke-width="1.6" stroke-dasharray="6 5"/>'
    pts = arc_pts(c, 72, math.radians(150), math.radians(210))
    b += f'<path d="{poly(pts)}" fill="none" stroke="#1971c2" stroke-width="8" stroke-linecap="round"/>'
    b += TL(122, 222, ['A piece of an imaginary', 'hollow sphere'], 12.5)
    for x0, outer in ((239, True), (468, False)):
        c = (x0+190, 118); a = math.radians(27)
        oa = arc_pts(c, 122, math.pi-a, math.pi+a); ia = arc_pts(c, 112, math.pi+a, math.pi-a)
        b += f'<path d="{poly(oa+ia, True)}" fill="#d0ebff" stroke="#74c0fc" stroke-width="1"/>'
        coat = arc_pts(c, 124 if outer else 110, math.pi-a, math.pi+a)
        b += f'<path d="{poly(coat)}" fill="none" stroke="#343a40" stroke-width="4.5" stroke-linecap="round"/>'
        if outer:
            b += eye(x0+150, 118, 1.0, 'left')
            b += lead((x0+40, 62), (x0+70, 78)) + TL(x0+14, 48, ['Coating'], 12, 'start')
            b += TL(x0+111, 206, ['Shiny surface curves', 'inwards → Concave mirror'], 12.5, fill='#6741d9')
        else:
            b += eye(x0+22, 118, 1.0, 'right')
            b += lead((x0+132, 62), (x0+97, 82)) + TL(x0+118, 48, ['Coating'], 12, 'start')
            b += TL(x0+111, 206, ['Shiny surface bulges', 'outwards → Convex mirror'], 12.5, fill='#6741d9')
    return SVG(W, H, b)

def f_side():
    W, H = 700, 200
    b = f'<rect x="20" y="140" width="660" height="40" rx="6" fill="url(#gw)"/>'
    R, a = 95, math.radians(38)
    c1 = (250, 140-R); p1 = arc_pts(c1, R, math.pi/2+a, math.pi/2-a)
    b += mirror_curve(p1, side=-1)
    top = 140 - R*(1-math.cos(a)); c2 = (500, top+R)
    p2 = arc_pts(c2, R, 3*math.pi/2-a, 3*math.pi/2+a)
    b += mirror_curve(p2, side=1)
    b += eye(52, 112, 1.0, 'right') + line((72, 112), (668, 112), '#1864ab', 1.3, '5 5')
    b += TL(250, 40, ['Concave mirror'], 14, w=700, fill='#6741d9') + TL(250, 60, ['curves inwards, like a bowl'], 12.5)
    b += TL(500, 40, ['Convex mirror'], 14, w=700, fill='#6741d9') + TL(500, 60, ['bulges outwards, like a dome'], 12.5)
    b += TL(52, 90, ['Eye at table level'], 12, fill='#1864ab')
    b += T(350, 168, 'Table — both reflecting surfaces face upwards', 12.5, fill='#fff')
    return SVG(W, H, b)

def grid_fig(kind):
    """What you see in mirrors / through lenses at three distances."""
    W, H = 700, 470
    cols = ['Plane mirror', 'Concave mirror', 'Convex mirror'] if kind == 'mirror' else ['Flat glass piece', 'Convex lens', 'Concave lens']
    ccol = ['#495057', '#6741d9', '#1864ab'] if kind == 'mirror' else ['#495057', '#2b8a3e', '#1864ab']
    rows = [('Object close', '(a few cm away)'), ('Moved a little', 'farther away'), ('Moved far', 'away')]
    # (scale, inverted, caption)
    s0 = .72
    data = [[(s0, 0, 'Erect, same size')]*3,
            [(1.3, 0, 'Erect, enlarged'), (1.15, 1, 'Inverted, enlarged'), (.46, 1, 'Inverted, diminished')],
            [(.52, 0, 'Erect, diminished'), (.44, 0, 'Erect, smaller still'), (.37, 0, 'Erect, smaller still')]]
    if kind == 'lens':
        data[2] = [(.5, 0, 'Erect, diminished'), (.42, 0, 'Erect, smaller still'), (.36, 0, 'Erect, smaller still')]
    b = ''
    xs = [258, 442, 626]; top = 58; rh = 134
    for j, (name, c) in enumerate(zip(cols, ccol)): b += pill(xs[j], 34, name, c, 13.5)
    for r, (l1, l2) in enumerate(rows):
        y0 = top + r*rh
        b += f'<rect x="10" y="{y0}" width="680" height="{rh-6}" rx="12" fill="{"#ffffff" if r % 2 == 0 else "#f3f6fb"}" stroke="#d6e2f0"/>'
        b += TL(84, y0+50, [l1, l2], 13.5, w=700, fill='#10254d')
        b += candle(84, y0+112, .5) + T(104, y0+108, 'object', 12.5, 'start', 500, '#56668a')
        for j in range(3):
            s, inv, cap = data[j][r]
            cx, cy = xs[j], y0 + 54
            if kind == 'mirror':
                b += f'<circle cx="{cx}" cy="{cy}" r="48" fill="#5c6b84"/><circle cx="{cx}" cy="{cy}" r="44" fill="url(#{["gmc","gmk","gmv"][j]})"/>'
            else:
                b += f'<circle cx="{cx}" cy="{cy}" r="47" fill="#fff" stroke="#74c0fc" stroke-width="5"/><circle cx="{cx}" cy="{cy}" r="44" fill="#e7f5ff" opacity=".9"/>'
            h = CANDLE_H*s
            b += f'<clipPath id="cl{kind}{r}{j}"><circle cx="{cx}" cy="{cy}" r="44"/></clipPath><g clip-path="url(#cl{kind}{r}{j})">'
            b += candle(cx, cy - h/2, s, inv=True) if inv else candle(cx, cy + h/2, s)
            if kind == 'lens': b += f'<ellipse cx="{cx-16}" cy="{cy-22}" rx="14" ry="7" fill="#fff" opacity=".55" transform="rotate(-35 {cx-16} {cy-22})"/>'
            b += '</g>'
            b += T(cx, y0+120, cap, 12.5, w=700, fill=['#2b8a3e', '#c92a2a'][inv])
    return SVG(W, H, b)

def tooth(x, y, s=1.0):
    return (f'<g transform="translate({f(x)},{f(y)}) scale({f(s)})"><path d="M-18,-20 Q-20,-34 -8,-32 Q0,-28 8,-32 Q20,-34 18,-20 '
            'Q17,-4 12,8 Q9,22 5,24 Q2,22 1,6 L-1,6 Q-2,22 -5,24 Q-9,22 -12,8 Q-17,-4 -18,-20 Z" fill="#fff" stroke="#868e96" stroke-width="1.6"/></g>')

def f_conuse():
    W, H = 700, 250
    b = panel(10, 10, 390, 230, '(a) Torch reflector', '#6741d9') + panel(410, 10, 280, 230, '(b) Dentist’s mirror', '#6741d9')
    vx, cy, R = 92, 128, 128
    C = (vx+R, cy); bulb = (vx+R/2, cy)
    hmax = 56; xe = C[0] - math.sqrt(R*R-hmax*hmax)
    b += f'<rect x="22" y="{cy-17}" width="{vx-14}" height="34" rx="6" fill="#4263eb"/>'
    b += f'<path d="M{vx-12},{cy-24} L{xe},{cy-hmax-6} L{bulb[0]+22},{cy-hmax-6} L{bulb[0]+22},{cy+hmax+6} L{xe},{cy+hmax+6} L{vx-12},{cy+24} Z" fill="#364fc7"/>'
    b += f'<rect x="{bulb[0]+20}" y="{cy-hmax-6}" width="5" height="{2*hmax+12}" fill="#a5d8ff" opacity=".8"/>'
    pts = arc_pts(C, R, math.pi-math.asin(hmax/R), math.pi+math.asin(hmax/R))
    b += f'<path d="{poly(pts)}" fill="none" stroke="url(#gm)" stroke-width="5"/>'
    for h in (-50, -33, -16, 16, 33, 50):
        P = (C[0]-math.sqrt(R*R-h*h), cy+h)
        d = unit((P[0]-bulb[0], P[1]-bulb[1]))
        r = refl(d, normal(P, C, R))
        b += ray([bulb, P, (P[0]+r[0]*300, P[1]+r[1]*300)], RAY, 1.8, frac=.4)
    b += f'<circle cx="{f(bulb[0])}" cy="{cy}" r="13" fill="#ffe066" opacity=".5"/><circle cx="{f(bulb[0])}" cy="{cy}" r="7" fill="#fff3bf" stroke="#f59f00" stroke-width="1.5"/>'
    b += lead((60, 214), (vx+4, cy+40)) + T(28, 230, 'Concave reflector', 12.5, 'start')
    b += lead((178, 52), (bulb[0], cy-8)) + T(184, 50, 'Bulb', 12.5, 'start')
    b += TL(320, 46, ['Strong beam', 'goes forward'], 12.5, fill='#e8590c')
    # dentist
    b += tooth(470, 150, 1.0)
    b += T(470, 196, 'Tooth', 12.5)
    b += line((612, 160), (676, 226), '#868e96', 6)
    b += f'<circle cx="590" cy="128" r="52" fill="#5c6b84"/><circle cx="590" cy="128" r="47" fill="url(#gmc)"/>'
    b += tooth(590, 132, 1.75)
    b += TL(560, 210, ['Enlarged, erect image', 'of the tooth'], 12.5, fill='#2b8a3e')
    b += T(590, 64, 'Concave mirror held close', 12.5, fill='#6741d9')
    return SVG(W, H, b)

def car(x, y, ang=0, col='#e03131', s=1.0):
    return (f'<g transform="translate({f(x)},{f(y)}) rotate({ang}) scale({s})"><rect x="-13" y="-22" width="26" height="44" rx="7" fill="{col}" stroke="#1b2a4a" stroke-width="1"/>'
            '<rect x="-10" y="-14" width="20" height="10" rx="3" fill="#d0ebff"/><rect x="-10" y="8" width="20" height="7" rx="2" fill="#d0ebff"/></g>')

def f_cvxuse():
    W, H = 700, 290
    b = panel(10, 10, 335, 270, '(a) Side-view mirror', '#1864ab') + panel(355, 10, 335, 270, '(b) Mirror at a sharp bend', '#1864ab')
    b += '<rect x="30" y="34" width="190" height="240" fill="#868e96"/>'
    for y in range(44, 274, 30): b += f'<rect x="123" y="{y}" width="4" height="16" fill="#fff"/>'
    M = (152, 73)
    b += f'<path d="M{M[0]},{M[1]} L36,272 L218,272 Z" fill="#74c0fc" opacity=".45"/>'
    b += f'<path d="M{M[0]},{M[1]} L118,272 L160,272 Z" fill="#ffd43b" opacity=".75" stroke="#f08c00" stroke-dasharray="4 3"/>'
    b += car(172, 74, 0, '#e03131') + f'<rect x="148" y="70" width="8" height="5" rx="1" fill="#1b2a4a"/>'
    b += car(85, 222, 0, '#2f9e44', .9) + car(190, 246, 0, '#f08c00', .9) + car(139, 190, 0, '#7048e8', .9)
    b += T(240, 138, 'Convex mirror:', 12.5, 'start', 700, '#1864ab') + T(240, 154, 'wide view', 12.5, 'start', 600, '#1864ab')
    b += T(240, 196, 'Plane mirror:', 12.5, 'start', 700, '#e8590c') + T(240, 212, 'narrow view', 12.5, 'start', 600, '#e8590c')
    b += lead((232, 133), (205, 150)) + lead((232, 192), (148, 212))
    b += T(240, 64, 'Our car', 12.5, 'start') + lead((238, 60), (190, 66))
    # bend
    b += '<rect x="365" y="176" width="225" height="64" fill="#868e96"/><rect x="526" y="34" width="64" height="206" fill="#868e96"/>'
    b += '<rect x="365" y="34" width="150" height="132" rx="6" fill="#ced4da" stroke="#adb5bd"/>'
    b += TL(440, 92, ['Building blocks', 'the direct view'], 12.5, fill='#495057')
    Mb = (600, 240)
    A = (412, 208); Bc = (558, 78)
    b += line(A, Mb, '#1864ab', 1.6, '6 4') + line(Mb, Bc, '#1864ab', 1.6, '6 4')
    b += car(A[0], A[1], 90, '#e03131', .85) + car(Bc[0], Bc[1], 180, '#2f9e44', .85)
    b += line((Mb[0]+8, Mb[1]+8), (Mb[0]+24, Mb[1]+30), '#495057', 4)
    b += f'<circle cx="{Mb[0]}" cy="{Mb[1]}" r="13" fill="url(#gmv)" stroke="#e8590c" stroke-width="4"/>'
    b += T(380, 262, 'Car A', 12.5, 'start', 700, '#e03131') + T(600, 70, 'Car B', 12.5, 'start', 700, '#2f9e44')
    b += TL(648, 196, ['Convex', 'mirror'], 12.5, 'middle', 700, '#1864ab')
    return SVG(W, H, b)

def torch_icon(p, ang):
    return (f'<g transform="translate({f(p[0])},{f(p[1])}) rotate({f(ang)})"><rect x="-40" y="-8" width="40" height="16" rx="4" fill="#4263eb"/>'
            '<path d="M0,-8 L12,-13 L12,13 L0,8 Z" fill="#364fc7"/><rect x="12" y="-13" width="3" height="26" fill="#ffe066"/></g>')

def comb_icon(p, ang):
    g = f'<g transform="translate({f(p[0])},{f(p[1])}) rotate({f(ang)})"><rect x="-7" y="-26" width="5" height="52" rx="1.5" fill="#495057"/>'
    for y in range(-24, 26, 4): g += f'<line x1="-2" y1="{y}" x2="5" y2="{y}" stroke="#495057" stroke-width="1.6"/>'
    g += '<rect x="-1" y="-26" width="7" height="24" fill="#111"/><rect x="-1" y="2" width="7" height="24" fill="#111"/></g>'
    return g

def f_act104():
    W, H = 700, 310
    b = panel(10, 10, 380, 290) + panel(400, 10, 290, 290)
    b += '<rect x="34" y="40" width="336" height="250" fill="#fff" stroke="#ced4da" stroke-width="1.5"/>'
    O = (212, 74); i = math.radians(40)
    b += '<rect x="112" y="60" width="16" height="10" fill="#868e96"/><rect x="296" y="60" width="16" height="10" fill="#868e96"/>'
    b += mirror_curve([(104, 72), (320, 72)], side=-1, w=5)
    u = (-math.sin(i), math.cos(i)); v = (math.sin(i), math.cos(i))
    A = (O[0]+u[0]*150, O[1]+u[1]*150); B = (O[0]+v[0]*200, O[1]+v[1]*200)
    ang = math.degrees(math.atan2(O[1]-A[1], O[0]-A[0]))
    b += ray([A, O, B], RAY, 2.6)
    b += comb_icon((O[0]+u[0]*162, O[1]+u[1]*162), ang)
    b += torch_icon((O[0]+u[0]*205, O[1]+u[1]*205), ang)
    b += T(212, 34, 'Plane mirror on its stand', 12.5, fill='#1864ab')
    b += lead((86, 278), (O[0]+u[0]*218, O[1]+u[1]*218+10)) + T(92, 282, 'Torch', 12.5, 'start')
    b += TL(130, 214, ['Comb with', 'one slit open'], 12, 'start')
    b += TL(150, 124, ['Incident', 'beam'], 12, 'end', fill='#e8590c')
    b += TL(282, 136, ['Reflected', 'beam'], 12, 'start', fill='#e8590c')
    b += T(290, 284, 'White paper', 12, 'middle', 500, '#56668a')
    # ray diagram
    O = (545, 236); L = 150
    b += mirror_curve([(420, 236), (670, 236)], side=1, w=4)
    b += line(O, (545, 66), '#1864ab', 1.6, '6 4')
    A = (O[0]-math.sin(i)*L, O[1]-math.cos(i)*L); B = (O[0]+math.sin(i)*L, O[1]-math.cos(i)*L)
    b += ray([A, O], RAY, 2.6) + ray([O, B], RAY2, 2.6)
    ai = arc_pts(O, 46, -math.pi/2-i, -math.pi/2); ar = arc_pts(O, 46, -math.pi/2, -math.pi/2+i)
    b += f'<path d="{poly(ai)}" fill="none" stroke="#e8590c" stroke-width="2"/><path d="{poly(ar)}" fill="none" stroke="#2b8a3e" stroke-width="2"/>'
    b += T(530, 178, 'i', 15, w=800, fill='#e8590c') + T(560, 178, 'r', 15, w=800, fill='#2b8a3e')
    b += T(545, 58, 'Normal', 12.5, fill='#1864ab')
    b += TL(A[0]-4, A[1]-12, ['Incident ray'], 12.5, 'middle', fill='#e8590c')
    b += TL(B[0]+4, B[1]-12, ['Reflected ray'], 12.5, 'middle', fill='#c2410c')
    b += T(545, 256, 'O', 13.5, w=800) + T(660, 228, 'Mirror', 12, 'end', 600, '#56668a')
    b += TL(545, 278, ['O = point of incidence'], 12, fill='#56668a')
    return SVG(W, H, b)

def f_normal():
    W, H = 340, 210
    b = panel(6, 6, 328, 198)
    O = (90, 168)
    b += mirror_curve([(24, 168), (170, 168)], side=1, w=4)
    b += line(O, (90, 26), '#1864ab', 1.3, '6 4')
    b += ray([(83, 36), (83, 166)], RAY, 2.6) + ray([(97, 166), (97, 36)], RAY2, 2.6)
    b += TL(150, 64, ['Ray falls along', 'the normal'], 12.5, 'start', fill='#e8590c')
    b += TL(150, 112, ['and comes back', 'along the same path'], 12.5, 'start', fill='#c2410c')
    b += T(150, 150, 'i = 0°, r = 0°', 14, 'start', 800, '#1864ab')
    b += T(90, 190, 'O', 13, w=800) + T(110, 190, 'Mirror', 12, 'start', 600, '#56668a')
    return SVG(W, H, b)

def f_act105():
    W, H = 700, 280
    b = panel(10, 10, 335, 260, '(a) Sheet flat', '#1864ab') + panel(355, 10, 335, 260, '(b) Extended part bent down', '#1864ab')
    k = .9
    for x0, bent in ((10, False), (355, True)):
        ox, oy = x0 + 14, 168
        def P(x, y, z=0.0):
            if bent and x > 200: x, z = 200, z - (x - 200)
            return (ox + k*(x + .5*y), oy - k*(z + .42*y))
        b += f'<path d="{poly([P(0,-10,0),P(200,-10,0),P(200,150,0),P(0,150,0)], True)}" fill="url(#gw)"/>'
        b += f'<path d="{poly([P(0,-10,0),P(200,-10,0),P(200,-10,-24),P(0,-10,-24)], True)}" fill="#a87443"/>'
        b += f'<path d="{poly([P(200,-10,0),P(200,150,0),P(200,150,-24),P(200,-10,-24)], True)}" fill="#8c5e33"/>'
        # sheet
        b += f'<path d="{poly([P(10,0),P(200,0),P(200,140),P(10,140)], True)}" fill="#fff" stroke="#ced4da"/>'
        if bent:
            b += f'<path d="{poly([(ox+k*200, oy), P(200,0,-82), P(200,140,-82), (ox+k*(200+70), oy-k*(.42*140))], True)}" fill="#f1f3f5" stroke="#ced4da"/>'
        else:
            b += f'<path d="{poly([P(200,0),P(280,0),P(280,140),P(200,140)], True)}" fill="#fff" stroke="#ced4da"/>'
        # mirror (vertical plane x = 60)
        b += f'<path d="{poly([P(60,20,0),P(60,110,0),P(60,110,46),P(60,20,46)], True)}" fill="url(#gmc)" stroke="#5c6b84" stroke-width="1.6"/>'
        S, O = (150, 35), (60, 60)
        end = (200, 60 + 25*140/90) if bent else (280, 60 + 25*220/90)
        b += ray([P(*S), P(*O)], RAY, 3) + ray([P(*O), P(*end)], RAY2, 3, frac=.55)
        ts = P(160, 32, 3)
        b += torch_icon((ts[0]+12, ts[1]+3), math.degrees(math.atan2(P(*O)[1]-P(*S)[1], P(*O)[0]-P(*S)[0])))
        mtop = P(60, 65, 46)
        b += lead((x0+38, 50), mtop) + T(x0+18, 46, 'Mirror', 12.5, 'start')
        if bent:
            b += TL(x0+272, 214, ['No beam on', 'the bent part'], 12.5, 'middle', 700, '#c92a2a')
            b += lead((x0+160, 248), P(200, 70, -40)) + T(x0+60, 256, 'Bent part of the sheet', 12, 'start', 600, '#56668a')
        else:
            pe = P(250, 110)
            b += lead((x0+258, 50), pe) + TL(x0+232, 46, ['Beam seen on the', 'extended part'], 12.5, 'middle', 700, '#2b8a3e')
            b += T(x0+150, 256, 'Edge of the table', 12, 'middle', 600, '#56668a') + lead((x0+150, 244), P(200, -10, -10))
    return SVG(W, H, b)

def f_beams():
    W, H = 700, 290
    b = ''
    caps = [['(a) Plane mirror', 'Reflected rays stay parallel'], ['(b) Concave mirror', 'Reflected rays converge'], ['(c) Convex mirror', 'Reflected rays diverge']]
    th = math.radians(25); d = (math.cos(th), math.sin(th))
    for j in range(3):
        x0 = 10 + j*230; b += panel(x0, 10, 220, 270)
        mx, cy, R = x0+180, 118, 200
        if j == 0:
            b += mirror_curve([(mx, cy-74), (mx, cy+74)], side=1)
        elif j == 1:
            a = math.asin(74/R); b += mirror_curve(arc_pts((mx-R, cy), R, -a, a), side=-1)
        else:
            a = math.asin(74/R); b += mirror_curve(arc_pts((mx+R, cy), R, math.pi+a, math.pi-a), side=-1)
        for kk in range(-2, 3):
            Q = (mx, cy + kk*22); s = 150
            p = (Q[0]-d[0]*s, Q[1]-d[1]*s)
            if j == 0: P, n = Q, (1, 0)
            elif j == 1:
                C = (mx-R, cy); P = hit(p, d, C, R, (1, 0)); n = normal(P, C, R)
            else:
                C = (mx+R, cy); P = hit(p, d, C, R, (-1, 0)); n = normal(P, C, R)
            r = refl(d, n)
            pts = clip_len([p, P, (P[0]+r[0]*170, P[1]+r[1]*170)], x0+8, x0+218, 14, 230)
            b += ray(pts[:2], RAY, 2) + ray(pts[1:], RAY2, 2)
        b += TL(x0+110, 250, caps[j][:1], 13, w=700, fill='#b07d00') + TL(x0+110, 268, caps[j][1:], 12.5)
    return SVG(W, H, b)

def best_focus(rays):
    """rays: list of (P, dir). Point of least spread along the middle ray."""
    best = None
    P0, d0 = rays[len(rays)//2]
    for t in [i*0.5 for i in range(1, 800)]:
        q = (P0[0]+d0[0]*t, P0[1]+d0[1]*t); n = (-d0[1], d0[0])
        ys = []
        for P, d in rays:
            den = dot(d, n)
            # intersect ray with the line through q perpendicular to d0
            den2 = dot(d, d0)
            s = dot((q[0]-P[0], q[1]-P[1]), d0)/den2
            pt = (P[0]+d[0]*s, P[1]+d[1]*s); ys.append(dot((pt[0]-q[0], pt[1]-q[1]), n))
        spread = max(ys)-min(ys)
        if best is None or spread < best[0]: best = (spread, q, t)
    return best

def f_sun_mirror():
    W, H = 700, 290
    b = f'<rect x="0" y="0" width="{W}" height="{H}" rx="14" fill="url(#gsky)"/>'
    vx, cy, R = 600, 166, 240; C = (vx-R, cy)
    th = math.radians(20); d = (math.cos(th), math.sin(th))
    a = math.asin(66/R); b += mirror_curve(arc_pts(C, R, -a, a), side=-1, w=5)
    rays = []
    for kk in range(-2, 3):
        Q = (vx, cy + kk*24); s = (vx-250)/math.cos(th)
        p = (Q[0]-d[0]*s, Q[1]-d[1]*s); P = hit(p, d, C, R, (1, 0))
        r = refl(d, normal(P, C, R)); rays.append((P, r)); b += ray([p, P], RAY, 2.2)
    sp, F, _ = best_focus(rays)
    for P, r in rays:
        t = dot((F[0]-P[0], F[1]-P[1]), r); b += ray([P, (P[0]+r[0]*(t-2), P[1]+r[1]*(t-2))], RAY2, 2.2, frac=.45)
    rd = unit((F[0]-rays[2][0][0], F[1]-rays[2][0][1])); n = (-rd[1], rd[0])
    pa = (F[0]+n[0]*44, F[1]+n[1]*44); pb = (F[0]-n[0]*44, F[1]-n[1]*44)
    b += line((pa[0]-rd[0]*3, pa[1]-rd[1]*3), (pb[0]-rd[0]*3, pb[1]-rd[1]*3), '#adb5bd', 7) + line(pa, pb, '#fff', 5)
    b += spot(F[0]-rd[0]*3, F[1]-rd[1]*3) + smoke(F[0]-rd[0]*8, F[1]-rd[1]*8-6)
    b += sun(120, 62, 30) + TL(120, 120, ['Sun'], 13, w=700, fill='#e8590c')
    b += TL(120, 140, ['Sunlight', '(parallel rays)'], 12.5, 'middle', fill='#e8590c')
    b += TL(vx+30, 252, ['Concave', 'mirror'], 13, 'middle', 700, '#6741d9')
    b += T(pb[0]-10, pb[1]+16, 'Paper', 12.5, 'end')
    b += TL(F[0]-70, F[1]-30, ['Sharp bright spot:', 'paper starts to burn'], 12.5, 'end', 700, '#c92a2a')
    return SVG(W, H, b, bg='#fff'), sp

def f_drop():
    W, H = 700, 236
    b = panel(10, 10, 335, 216, '(a) Side view', '#2b8a3e') + panel(355, 10, 335, 216, '(b) Looking down through the drop', '#2b8a3e')
    b += '<rect x="36" y="186" width="284" height="10" fill="#fff" stroke="#ced4da"/>'
    for x in range(44, 312, 12): b += f'<rect x="{x}" y="183" width="7" height="3" fill="#1b2a4a"/>'
    b += '<rect x="30" y="160" width="296" height="9" fill="#d0ebff" stroke="#74c0fc"/>'
    b += '<path d="M138,160 C140,138 196,138 198,160 Z" fill="url(#gwat)" stroke="#1971c2" stroke-width="1.2"/><ellipse cx="156" cy="148" rx="7" ry="3" fill="#fff" opacity=".7"/>'
    b += eye(168, 60, 1.1, 'down') + line((168, 80), (168, 136), '#1864ab', 1.3, '5 4')
    b += lead((240, 120), (194, 150)) + TL(246, 110, ['Water drop:', 'curves outwards'], 12.5, 'start', fill='#1864ab')
    b += TL(40, 154, ['Oiled strip'], 12, 'start', 600, '#56668a') + TL(178, 214, ['Paper with printed text'], 12, 'middle', 600, '#56668a')
    b += T(196, 64, 'Eye', 12.5, 'start')
    txt = 'Light makes things visible'
    b += f'<rect x="372" y="94" width="302" height="56" rx="6" fill="#fff" stroke="#ced4da"/>'
    b += T(523, 128, txt, 17, 'middle', 600, '#1b2a4a', 'font-family="Noto Sans"')
    cx, cy = 530, 122
    b += f'<clipPath id="cpd"><circle cx="{cx}" cy="{cy}" r="34"/></clipPath>'
    b += f'<circle cx="{cx}" cy="{cy}" r="35" fill="#fff"/><g clip-path="url(#cpd)"><g transform="translate({cx},{cy}) scale(1.8) translate({-cx},{-cy})">' + T(523, 128, txt, 17, 'middle', 600, '#1b2a4a') + '</g></g>'
    b += f'<circle cx="{cx}" cy="{cy}" r="35" fill="#74c0fc" opacity=".22" stroke="#1971c2" stroke-width="2"/><ellipse cx="{cx-14}" cy="{cy-16}" rx="10" ry="4" fill="#fff" opacity=".7"/>'
    b += TL(523, 184, ['Letters under the drop look bigger'], 13, fill='#2b8a3e')
    return SVG(W, H, b)

def f_lens_rep():
    W, H = 700, 230
    b = panel(10, 10, 335, 210, '(a) Convex lens', '#2b8a3e') + panel(355, 10, 335, 210, '(b) Concave lens', '#2b8a3e')
    b += '<ellipse cx="80" cy="118" rx="30" ry="72" fill="url(#gg)" stroke="#1971c2" stroke-width="2"/><ellipse cx="72" cy="88" rx="8" ry="22" fill="#fff" opacity=".7"/>'
    b += TL(80, 210, ['Lens'], 12, 'middle', 600, '#56668a')
    pts, h = convex_poly(196, 118, 120, 18); b += lens_shape(pts, 2)
    b += TL(196, 210, ['Its representation'], 12, 'middle', 600, '#56668a')
    b += lead((262, 112), (214, 118)) + TL(266, 104, ['Thicker in', 'the middle'], 12.5, 'start', 700, '#2b8a3e')
    b += lead((262, 60), (200, 60)) + TL(266, 52, ['Thinner at', 'the edges'], 12.5, 'start')
    b += '<ellipse cx="425" cy="118" rx="30" ry="72" fill="#a5d8ff" stroke="#1971c2" stroke-width="2"/><ellipse cx="428" cy="118" rx="18" ry="58" fill="#f1f8ff"/>'
    b += TL(425, 210, ['Lens'], 12, 'middle', 600, '#56668a')
    pts = concave_poly(541, 118, 110, 5, 62); b += lens_shape(pts, 2)
    b += TL(541, 210, ['Its representation'], 12, 'middle', 600, '#56668a')
    b += lead((607, 112), (546, 118)) + TL(611, 104, ['Thin in', 'the middle'], 12.5, 'start')
    b += lead((607, 60), (562, 60)) + TL(611, 52, ['Thicker at', 'the edges'], 12.5, 'start', 700, '#2b8a3e')
    return SVG(W, H, b)

def f_lens_beams():
    W, H = 700, 280
    caps = [['(a) Thin glass plate', 'Beam passes as it is'], ['(b) Convex lens', 'Light converges'], ['(c) Concave lens', 'Light diverges']]
    b = ''
    for j in range(3):
        x0 = 10 + j*230; b += panel(x0, 10, 220, 260)
        lx, cy = x0+86, 120
        if j == 0:
            b += f'<rect x="{lx-5}" y="{cy-70}" width="10" height="140" fill="url(#gg)" stroke="#1971c2" stroke-width="1.4"/>'
        elif j == 1:
            R, t = 100, 13; pts, hh = convex_poly(lx, cy, R, t); b += lens_shape(pts)
            surf = [((lx-t+R, cy), R, (-1, 0)), ((lx+t-R, cy), R, (1, 0))]
        else:
            R, tc, Hh = 100, 4, 54; b += lens_shape(concave_poly(lx, cy, R, tc, Hh))
            surf = [((lx-tc-R, cy), R, (1, 0)), ((lx+tc+R, cy), R, (-1, 0))]
        for h in (-40, -20, 0, 20, 40):
            p = (x0+12, cy+h)
            if j == 0: pts = [p, (lx-5, cy+h), (lx+5, cy+h), (x0+214, cy+h)]
            else: pts = clip_len(trace_lens(p, (1, 0), surf, out_len=260), x0+8, x0+214, 16, 226)
            b += ray(pts[:2], RAY, 2) + ray(pts[-2:], RAY2, 2, frac=.6)
        b += TL(x0+110, 240, caps[j][:1], 13, w=700, fill='#2b8a3e') + TL(x0+110, 258, caps[j][1:], 12.5)
    return SVG(W, H, b)

def f_sun_lens():
    W, H = 360, 330
    b = f'<rect x="0" y="0" width="{W}" height="{H}" rx="14" fill="url(#gsky)"/>'
    R, t, lx, cx = 110, 14, 120, 170   # trace in a rotated frame: frame-x = page-y
    surf = [((lx-t+R, cx), R, (-1, 0)), ((lx+t-R, cx), R, (1, 0))]
    rays = []; drawn = []
    for h in (-42, -21, 0, 21, 42):
        pts = trace_lens((62, cx+h), (1, 0), surf, out_len=300); drawn.append(pts)
        rays.append((pts[-2], unit((pts[-1][0]-pts[-2][0], pts[-1][1]-pts[-2][1]))))
    sp, F, _ = best_focus(rays)
    sw = lambda p: (p[1], p[0])
    for pts in drawn:
        P, r = pts[-2], unit((pts[-1][0]-pts[-2][0], pts[-1][1]-pts[-2][1]))
        t2 = (F[0]-P[0])/r[0]
        pp = [sw(q) for q in pts[:-1]] + [sw((P[0]+r[0]*t2, P[1]+r[1]*t2))]
        b += ray(pp[:2], RAY, 2.2) + ray(pp[-2:], RAY2, 2.2, frac=.5)
    lp, _ = convex_poly(lx, cx, R, t); b += lens_shape([sw(q) for q in lp], 2)
    fy = F[0]
    b += f'<path d="M60,{f(fy)} L290,{f(fy)} L320,{f(fy+30)} L90,{f(fy+30)} Z" fill="#fff" stroke="#ced4da" stroke-width="1.5"/>'
    b += spot(cx, fy+3, 12) + smoke(cx+2, fy-2)
    b += sun(cx, 34, 22)
    b += T(214, 30, 'Sunlight', 13, 'start', 700, '#e8590c')
    b += lead((262, 104), (226, lx)) + T(266, 100, 'Convex lens', 12.5, 'start', 700, '#2b8a3e')
    b += T(300, fy+52, 'Paper', 12.5, 'end')
    b += TL(22, fy-36, ['Bright spot:', 'paper can burn'], 12.5, 'start', 700, '#c92a2a')
    return SVG(W, H, b, bg='#fff'), sp

def f_lens_uses():
    W, H = 700, 290
    b = ''
    names = ['Eyeglasses', 'Smartphone camera', 'Magnifying glass', 'Microscope', 'Telescope', 'Our eye']
    for k, nm in enumerate(names):
        x0 = 10 + (k % 3)*230; y0 = 10 + (k//3)*140
        b += panel(x0, y0, 220, 130) + T(x0+110, y0+120, nm, 13, w=700, fill='#d9480f')
    # eyeglasses
    x, y = 120, 62
    b += f'<path d="M{x-90},{y-10} L{x-62},{y-6}" stroke="#343a40" stroke-width="3"/><path d="M{x+90},{y-10} L{x+62},{y-6}" stroke="#343a40" stroke-width="3"/>'
    b += f'<path d="M{x-12},{y-4} Q{x},{y-14} {x+12},{y-4}" fill="none" stroke="#343a40" stroke-width="3"/>'
    for sx in (-38, 38): b += f'<circle cx="{x+sx}" cy="{y+4}" r="26" fill="url(#gg)" stroke="#343a40" stroke-width="3.5"/><ellipse cx="{x+sx-9}" cy="{y-6}" rx="8" ry="4" fill="#fff" opacity=".7"/>'
    # phone camera
    x, y = 350, 66
    b += f'<rect x="{x-34}" y="{y-50}" width="68" height="98" rx="12" fill="#364fc7"/><rect x="{x-32}" y="{y-42}" width="40" height="56" rx="10" fill="#1b2a4a"/>'
    for cyy in (y-28, y):
        b += f'<circle cx="{x-12}" cy="{cyy}" r="10" fill="#10254d" stroke="#adb5bd" stroke-width="2"/><circle cx="{x-12}" cy="{cyy}" r="5" fill="#4dabf7"/><circle cx="{x-14}" cy="{cyy-2}" r="1.6" fill="#fff"/>'
    # magnifier
    x, y = 580, 64
    b += f'<rect x="{x-62}" y="{y-6}" width="114" height="24" fill="#fff" stroke="#dee2e6"/>' + T(x-5, y+11, 'read small print', 12, 'middle', 600, '#495057')
    b += f'<clipPath id="cpm"><circle cx="{x-5}" cy="{y+6}" r="25"/></clipPath><circle cx="{x-5}" cy="{y+6}" r="25" fill="#fff"/>'
    b += f'<g clip-path="url(#cpm)"><g transform="translate({x-5},{y+6}) scale(1.8) translate({-(x-5)},{-(y+6)})">' + T(x-5, y+11, 'read small print', 12, 'middle', 600, '#495057') + '</g></g>'
    b += f'<circle cx="{x-5}" cy="{y+6}" r="27" fill="#a5d8ff" fill-opacity=".2" stroke="#495057" stroke-width="5"/>'
    b += line((x+15, y+26), (x+40, y+46), '#b07d00', 9)
    # microscope
    x, y = 120, 200
    b += f'<rect x="{x-38}" y="{y+40}" width="76" height="10" rx="4" fill="#495057"/>'
    b += f'<path d="M{x+16},{y+40} Q{x+30},{y} {x+8},{y-30}" fill="none" stroke="#495057" stroke-width="9"/>'
    b += f'<rect x="{x-24}" y="{y+12}" width="44" height="5" fill="#868e96"/>'
    b += f'<g transform="rotate(-18 {x-6} {y-10})"><rect x="{x-14}" y="{y-46}" width="16" height="48" rx="3" fill="#4263eb"/><rect x="{x-17}" y="{y-56}" width="22" height="10" rx="2" fill="#1b2a4a"/><rect x="{x-11}" y="{y+2}" width="10" height="8" fill="#1b2a4a"/></g>'
    # telescope
    x, y = 350, 196
    b += f'<g transform="rotate(-24 {x} {y})"><rect x="{x-70}" y="{y-14}" width="120" height="26" rx="5" fill="#364fc7"/><rect x="{x+48}" y="{y-18}" width="16" height="34" rx="4" fill="#1b2a4a"/><ellipse cx="{x+64}" cy="{y-1}" rx="5" ry="15" fill="url(#gg)" stroke="#1971c2"/><rect x="{x-86}" y="{y-8}" width="18" height="14" rx="3" fill="#1b2a4a"/></g>'
    for dx in (-26, 0, 26): b += line((x, y+6), (x+dx, y+56), '#495057', 3)
    # eye
    x, y = 580, 188
    b += f'<circle cx="{x}" cy="{y}" r="36" fill="#fff" stroke="#1b2a4a" stroke-width="2"/>'
    b += f'<path d="M{x-28},{y-23} Q{x-48},{y} {x-28},{y+23}" fill="#e7f5ff" stroke="#1b2a4a" stroke-width="1.6"/>'
    b += f'<ellipse cx="{x-21}" cy="{y}" rx="6" ry="15" fill="url(#gg)" stroke="#1971c2" stroke-width="1.6"/>'
    b += f'<path d="M{x+34},{y-12} Q{x+42},{y} {x+34},{y+12}" fill="none" stroke="#e8590c" stroke-width="4"/>'
    b += lead((x+30, y+40), (x-18, y+10)) + T(x+52, y+52, 'Convex lens', 12.5, 'middle', 700, '#2b8a3e')
    return SVG(W, H, b)

def star(x, y, r, col='#ffd43b'):
    pts = []
    for k in range(10):
        a = -math.pi/2 + k*math.pi/5; rr = r if k % 2 == 0 else r*.45
        pts.append((x+rr*math.cos(a), y+rr*math.sin(a)))
    return f'<path d="{poly(pts, True)}" fill="{col}"/>'

def f_heritage():
    W, H = 340, 220
    b = f'<rect width="{W}" height="{H}" rx="14" fill="url(#gnight)"/>'
    for (x, y) in ((260, 30), (300, 70), (150, 40), (210, 20), (30, 150), (110, 20)): b += f'<circle cx="{x}" cy="{y}" r="1.6" fill="#fff"/>'
    P = (150, 160); a = math.radians(52)
    S = (P[0]-math.sin(a)*150, P[1]-math.cos(a)*150)
    b += ray([S, P], '#ffd43b', 1.8)
    t0 = (P[0]+math.sin(a)*26, P[1]-math.cos(a)*26); t1 = (P[0]+math.sin(a)*112, P[1]-math.cos(a)*112)
    b += ray([P, t0], '#ffd43b', 1.8, arrows=False) + line(t0, t1, '#b07d00', 14) + line(t0, t1, '#e0a800', 10)
    b += eye(t1[0]+12, t1[1]-8, .9, 'left')
    b += '<path d="M60,160 Q150,232 240,160 Z" fill="#a87443"/><ellipse cx="150" cy="160" rx="90" ry="9" fill="url(#gwat)"/>'
    b += star(S[0], S[1], 9) + star(P[0], P[1]+1, 5, '#fff3bf')
    b += T(S[0]+16, S[1]+4, 'Star', 12.5, 'start', 700, '#fff')
    b += T(150, 210, 'Shallow bowl of water', 12, 'middle', 600, '#fff')
    b += T(t1[0]-58, t1[1]+8, 'Tube', 12.5, 'end', 700, '#ffe066')
    return SVG(W, H, b, bg='#10254d')

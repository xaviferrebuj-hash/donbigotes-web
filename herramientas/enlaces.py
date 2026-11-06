# Enlaces internos rotos en un _site: href/src/srcset que empiezan por / o por https://donbigotes.app.
import re, sys, os, glob, html
from urllib.parse import urlsplit, unquote
SITE = sys.argv[1].rstrip('/')
def existe(ruta):
    p = SITE + unquote(ruta)
    if ruta.endswith('/'): return os.path.isfile(p + 'index.html')
    return os.path.isfile(p) or os.path.isfile(p + '/index.html') or os.path.isfile(p + '.html')
rotos = {}; anclas = []; total = 0
for f in glob.glob(SITE + '/**/*.html', recursive=True):
    t = open(f, encoding='utf-8', errors='replace').read()
    ids = set(re.findall(r'\bid="([^"]+)"', t))
    urls = re.findall(r'\b(?:href|src|data-src)="([^"]+)"', t)
    for ss in re.findall(r'\bsrcset="([^"]+)"', t):
        urls += [x.strip().split(' ')[0] for x in ss.split(',')]
    for u in urls:
        u = html.unescape(u)
        if u.startswith('https://donbigotes.app'): u = u[len('https://donbigotes.app'):] or '/'
        if u.startswith('#'):
            if len(u) > 1 and u[1:] not in ids: anclas.append((f[len(SITE):], u))
            continue
        if not u.startswith('/') or u.startswith('//'): continue
        total += 1
        s = urlsplit(u)
        if not existe(s.path): rotos.setdefault(u, set()).add(f[len(SITE):])
print('enlaces internos comprobados:', total)
for u, fs in sorted(rotos.items()): print('ROTO', u, '<-', ', '.join(sorted(fs))[:200])
for f, a in anclas: print('ANCLA', f, a)
print('rotos:', len(rotos), '· anclas sin destino:', len(anclas))

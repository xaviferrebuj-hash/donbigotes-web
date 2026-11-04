#!/usr/bin/env python3
"""Pase único (feature/web-unificar, 4-nov-2026): cabecera y pie comunes por include de Jekyll.

Cambia en cada página publicada (no en redirecciones ni en los aterrizajes /app/, /carta/, /es-419/carta/):
- añade front matter vacío (---/---) para que Jekyll procese los {% include %};
- sustituye la marca de arriba (<nav class="nav">…</nav> en la familia de la home, <header><div class="wrap top">…</header>
  en la familia «noche») por {% include cabecera.html %};
- sustituye el <footer> por {% include pie.html %}, conservando la nota legal propia de la comparativa;
- en /privacidad/ además carga /assets/base.css, pone la cabecera en su banda y añade el pie.
Idempotente: una página que ya lleva front matter se salta. Uso, desde la raíz:  python3 tools/unificar_cabecera_pie.py
"""
import glob, os, re, sys

FUERA = {'app/index.html', 'carta/index.html', 'es-419/carta/index.html'}
hechas, saltadas = [], []
for f in sorted(glob.glob('**/index.html', recursive=True)):
    if f.startswith(('_', 'tools/')) or f in FUERA:
        continue
    h = open(f, encoding='utf-8').read()
    if 'http-equiv="refresh"' in h or 'location.replace(' in h and len(h) < 3000:
        continue
    if h.startswith('---\n'):
        saltadas.append(f); continue
    lang = 'es-419' if f.startswith('es-419/') else 'es'
    cab = '{% include cabecera.html lang="' + lang + '" %}'
    n_cab = 0
    h, k = re.subn(r'<nav class="nav">.*?</nav>', cab, h, count=1, flags=re.S); n_cab += k
    if not k:
        h, k = re.subn(r'<header>\s*<div class="wrap top">.*?</div>\s*</header>', '<div class="wrap">' + cab + '</div>', h,
                       count=1, flags=re.S); n_cab += k
    if not k and f == 'privacidad/index.html':
        h, k = re.subn(r'<span class="badge">Don Bigotes</span>', cab, h, count=1); n_cab += k
        h = h.replace('</head>', '<link rel="stylesheet" href="/assets/base.css">\n</head>', 1)
    m = re.search(r'<footer[^>]*>.*?</footer>', h, re.S)
    if m:
        notas = [p for p in re.findall(r'<p class="discl">.*?</p>', m.group(0), re.S) if 'Comparativa' in p]
        pie = '{% include pie.html lang="' + lang + '" %}'
        if notas:
            pie = '{% capture nota %}' + ''.join(notas) + '{% endcapture %}{% include pie.html lang="' + lang + '" nota=nota %}'
        h = h[:m.start()] + pie + h[m.end():]
    elif f == 'privacidad/index.html':
        h = h.replace('</body>', '{% include pie.html lang="es" %}\n</body>', 1)
    else:
        sys.exit(f'{f}: sin <footer>')
    if n_cab != 1:
        sys.exit(f'{f}: cabecera no encontrada')
    open(f, 'w', encoding='utf-8').write('---\n---\n' + h)
    hechas.append(f)
print(len(hechas), 'páginas;', len(saltadas), 'ya hechas')

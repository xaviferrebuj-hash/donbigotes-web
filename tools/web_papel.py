#!/usr/bin/env python3
"""Pase feature/web-papel (4-nov-2026), punto 1: familia «noche» → maqueta de la home.
Cabecera + aviso de región + <section class="hero"> (y, en el cuento, su reproductor #escuchar)
pasan a <div class="night sky"> con la luna; el resto queda en <main class="wrap"> sobre papel
(<body class="papel">, estilos en assets/base.css). Idempotente: si la página ya lleva la banda, la salta."""
import re, sys, pathlib
PAGINAS = """carta-para-imprimir comparativa-apps-ratoncito-perez cuento-ratoncito-perez diario-dientes-de-leche
fotomontaje-ratoncito-perez historia-raton-perez cancion-cepillado-dientes cuentos-clasicos-para-dormir
es-419/carta-para-imprimir es-419/comparativa-apps-ratoncito-perez es-419/cuento-raton-perez
es-419/diario-dientes-de-leche es-419/fotomontaje-raton-perez es-419/cancion-cepillado-dientes
es-419/cuentos-clasicos-para-dormir""".split()
raiz = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
for p in PAGINAS:
    f = raiz / p / 'index.html'
    h = f.read_text(encoding='utf-8')
    if 'class="night sky"' in h:
        print('ya', p); continue
    m = re.search(r'<div class="wrap">(\{% include cabecera\.html[^%]*%\})</div>\s*<main class="wrap">\s*(.*?<section class="hero".*?</section>\n)', h, re.S)
    assert m, p
    cab, dentro = m.group(1), m.group(2)
    fin = m.end()
    # El reproductor del cuento vive en la banda noche (encargo, punto 4).
    r = re.match(r'(\s*<!-- REPRODUCTOR[^>]*-->\s*<section id="escuchar".*?</section>\n)', h[fin:], re.S)
    if r and 'cuento-audio' in r.group(1):
        dentro += r.group(1).lstrip('\n'); fin += r.end()
    nuevo = ('<div class="night sky">\n<span class="moon"></span>\n<div class="wrap">' + cab + '\n\n  ' + dentro.rstrip() +
             '\n</div>\n</div><!-- /night -->\n\n<main class="wrap">\n')
    h = h[:m.start()] + nuevo + h[fin:]
    h = h.replace('<body>', '<body class="papel">', 1)
    f.write_text(h, encoding='utf-8')
    print('ok', p)

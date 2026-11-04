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

# Punto 2: reglas del fondo noche que quedan muertas con <body class="papel">.
def limpia(h):
    # Estrellas fijas del body (la banda lleva las suyas, .sky::before de base.css).
    h = re.sub(r'\n[ \t]*/\* fondo estrellado sutil \*/', '', h)
    h = re.sub(r'\n[ \t]*body::before\{[^{}]*\}', '', h)
    # Fondo y color del body: los pone body.papel.
    h = re.sub(r'(\n[ \t]*body\{[^{}]*?)\n?[ \t]*background:var\(--noche\);', r'\1', h)
    h = re.sub(r'(\n[ \t]*body\{[^{}]*?)\n?[ \t]*color:var\(--texto\);', r'\1', h)
    # Chips: todos viven en el cuerpo; su :hover y la zona activa del cepillado los pone base.css.
    h = re.sub(r'\n[ \t]*\.chip:hover\{[^{}]*\}', '', h)
    h = re.sub(r'\n[ \t]*/\* zonas de la canción del cepillado \*/\n[ \t]*\.zonas \.chip\.activa\{[^{}]*\}', '', h)
    h = h.replace('/* Enlace a «¿existe?» bajo las preguntas frecuentes: sobre fondo oscuro, en dorado. */',
                  '/* Enlace a «¿existe?» bajo las preguntas frecuentes (color: base.css, body.papel). */')
    # Alias de la familia noche que ya no usa nadie en la página (la cabecera y el bloque de la app usan los comunes).
    m = re.search(r'(:root\{)(--noche:[^}]*)\}', h)
    if m:
        resto = h[:m.start()] + h[m.end():]
        vivos = [d for d in m.group(2).split(';') if d and re.search(r'var\(' + re.escape(d.split(':')[0]) + r'[,)]', resto)]
        h = h[:m.start()] + (m.group(1) + ';'.join(vivos) + '}' if vivos else '') + h[m.end():]
    return h
if __name__ == '__main__':
    raiz = pathlib.Path(next((a for a in sys.argv[1:] if not a.startswith("--")), "."))
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
    if '--limpia' in sys.argv:
      for p in PAGINAS:
        f = raiz / p / 'index.html'
        f.write_text(limpia(f.read_text(encoding='utf-8')), encoding='utf-8')

#!/usr/bin/env python3
"""Punto 2 de feature/web-papel: borra del <style> de cada página las declaraciones de color que han quedado
muertas con <body class="papel"> (las tapa base.css o no pintan nada sobre papel).
Una declaración es «muerta» si, quitándola en el navegador (CSSOM), no cambia ningún estilo calculado
(color, fondo, bordes, sombra, contorno; elementos, ::before, ::after, ::placeholder) ni a 390 ni a 1280 px.
Solo se prueban reglas sin estados (:hover, :focus…) y cuyo selector casa con algún elemento: las de estados
de JS (.activa, .sonando) o sin elementos se quedan.
Uso: python3 tools/css_muerto_papel.py <url-base-del-sitio-construido> [--aplica]"""
import json, re, subprocess, sys, os, pathlib
from web_papel import PAGINAS

PROPS = re.compile(r'^(color|background(-color|-image)?|border(-(top|right|bottom|left))?(-color)?|box-shadow|outline(-color)?|fill|stroke)$')

def reglas(css):
    """Lista plana de reglas de estilo en el orden del CSSOM: (inicio_cuerpo, fin_cuerpo, selector)."""
    out = []; i = 0; n = len(css)
    def bloque(i, plano):
        while i < n:
            if css.startswith('/*', i):
                i = css.index('*/', i) + 2; continue
            if css[i] == '}': return i + 1
            if css[i].isspace(): i += 1; continue
            j = i
            while css[j] not in '{};': 
                if css.startswith('/*', j): j = css.index('*/', j) + 2
                else: j += 1
            if css[j] == ';': i = j + 1; continue   # @import / @charset
            sel = css[i:j].strip()
            if sel.startswith('@media') or sel.startswith('@supports'):
                i = bloque(j + 1, plano); continue
            if sel.startswith('@'):   # @keyframes, @font-face: se saltan enteros
                d = 0; k = j
                while True:
                    if css[k] == '{': d += 1
                    elif css[k] == '}':
                        d -= 1
                        if d == 0: break
                    k += 1
                i = k + 1; continue
            k = css.index('}', j)
            plano.append((j + 1, k, ' '.join(sel.split())))
            i = k + 1
        return i
    bloque(0, out)
    return out

def decls(cuerpo):
    """[(prop, ini, fin)] de cada declaración del cuerpo (fin incluye el ; y el espacio siguiente)."""
    res = []; i = 0
    sin = re.sub(r'/\*.*?\*/', lambda m: ' ' * len(m.group()), cuerpo, flags=re.S)
    for m in re.finditer(r'([-\w]+)\s*:((?:[^;()]|\([^()]*(?:\([^()]*\)[^()]*)*\))*)(;|$)', sin):
        res.append((m.group(1).lower(), m.start(), m.end()))
    return res

def main():
    base = sys.argv[1]; aplica = '--aplica' in sys.argv
    raiz = pathlib.Path(__file__).resolve().parent.parent
    todo = {}
    for p in PAGINAS:
        h = (raiz / p / 'index.html').read_text(encoding='utf-8')
        estilos = [m for m in re.finditer(r'<style>(.*?)</style>', h, re.S)]
        cand = []
        for si, m in enumerate(estilos):
            css = m.group(1)
            for ri, (a, b, sel) in enumerate(reglas(css)):
                if re.search(r':(?!:)(?!not\()', sel.replace('::', '')): continue   # estados
                for prop, x, y in decls(css[a:b]):
                    if PROPS.match(prop): cand.append([si, ri, prop, sel])
        todo[p] = cand
    entrada = pathlib.Path('/tmp/claude-0/wp/css-cand.json'); entrada.write_text(json.dumps({'base': base, 'paginas': todo}))
    r = subprocess.run(['node', str(raiz / 'tools/css_muerto_papel.js'), str(entrada)], capture_output=True, text=True, env={**os.environ})
    if r.returncode: print(r.stderr); sys.exit(1)
    muertas = json.loads(r.stdout)
    total = 0
    for p in PAGINAS:
        md = muertas.get(p, [])
        total += len(md)
        print(f'{p}: {len(md)} declaraciones muertas')
        for si, ri, prop, sel in md: print('   ', sel, '→', prop)
        if not aplica or not md: continue
        f = raiz / p / 'index.html'; h = f.read_text(encoding='utf-8')
        estilos = [m for m in re.finditer(r'<style>(.*?)</style>', h, re.S)]
        cortes = []   # (ini, fin) absolutos
        for si, m in enumerate(estilos):
            css = m.group(1); off = m.start(1)
            rs = reglas(css)
            for ri, (a, b, sel) in enumerate(rs):
                quitar = {prop for (s2, r2, prop, _) in md if s2 == si and r2 == ri}
                if not quitar: continue
                ds = decls(css[a:b])
                if all(d[0] in quitar for d in ds):   # la regla entera
                    ini = css.rfind('}', 0, a - 1); ini = max(ini, css.rfind('{', 0, a - 1), css.rfind('*/', 0, a - 1) + 1 if css.rfind('*/', 0, a - 1) >= 0 else -1) + 1
                    # desde el fin de lo anterior hasta el } de la regla, conservando el salto de línea
                    while ini < a and css[ini] in ' \t\n': ini += 1
                    fin = b + 1
                    while fin < len(css) and css[fin] in ' \t': fin += 1
                    if fin < len(css) and css[fin] == '\n': fin += 1
                    # el sangrado de la línea
                    li = ini
                    while li > 0 and css[li - 1] in ' \t': li -= 1
                    cortes.append((off + li, off + fin))
                else:
                    for prop, x, y in ds:
                        if prop in quitar:
                            fin = a + y
                            while fin < b and css[fin] in ' \t\n': fin += 1
                            ini = a + x
                            cortes.append((off + ini, off + fin))
        for ini, fin in sorted(cortes, reverse=True):
            h = h[:ini] + h[fin:]
        f.write_text(h, encoding='utf-8')
    print('total', total)

if __name__ == '__main__':
    main()

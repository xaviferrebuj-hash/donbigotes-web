#!/usr/bin/env python3
"""Fase 2 de la unificación de la web (feature/web-unificar, 4-nov-2026).

Pase de una sola vez, un paso por punto del encargo:
    python3 tools/unificar_fase2.py estilo      # 1. tokens, fuentes, botones y escala de titulares
    python3 tools/unificar_fase2.py css-muerto  # 2. reglas de la cabecera y el pie viejos
    python3 tools/unificar_fase2.py cta         # 3. bloque de la app -> _includes/cta-app.html
Cada paso edita solo lo que toca (reemplazos quirúrgicos, nunca reescribe el resto del fichero)
y aborta si algo no tiene la forma esperada. Comprobar después con `jekyll build`.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Las 45 páginas de verdad (MAPA-WEB.md, 4-nov-2026): las 42 con cabecera común + los 3 aterrizajes.
PAGINAS = """/ /app-raton-perez/ /app/ /blog/ /blog/la-noche-del-diente/ /carta-para-imprimir/
/carta-ratoncito-perez-segun-edad/ /carta/ /certificado-raton-perez/ /comparativa-apps-ratoncito-perez/
/cuento-ratoncito-perez/ /cumpleanos-raton-perez/ /diario-dientes-de-leche/ /diploma-raton-perez/ /editable/
/el-ratoncito-perez-existe/ /es-419/ /es-419/app-raton-perez/ /es-419/carta-para-imprimir/
/es-419/carta-raton-perez-segun-edad/ /es-419/carta/ /es-419/certificado-raton-perez/
/es-419/comparativa-apps-ratoncito-perez/ /es-419/cuento-raton-perez/ /es-419/diario-dientes-de-leche/
/es-419/diploma-raton-perez/ /es-419/editable/ /es-419/el-ratoncito-perez-existe/ /es-419/firma-sello-raton-perez/
/es-419/foto-raton-perez/ /es-419/fotomontaje-raton-perez/ /es-419/primer-diente/ /es-419/ultimo-diente/
/es-419/voz-raton-perez/ /firma-sello-raton-perez/ /foto-raton-perez/ /fotomontaje-ratoncito-perez/
/historia-raton-perez/ /prensa/ /primer-diente/ /privacidad/ /ultimo-diente/ /viaje-del-diente/
/video-raton-perez/ /voz-raton-perez/""".split()


def fichero(p):
    return RAIZ / (p.lstrip('/') + 'index.html')


def reglas(css, base=0, ctx=''):
    """[(selector, cuerpo, contexto @media, ini, fin)] con posiciones absolutas dentro de css."""
    out, i, n = [], 0, len(css)
    esp = re.compile(r'\s*(/\*.*?\*/)?', re.S)
    while i < n:
        m = esp.match(css, i)
        if m.end() > i:
            i = m.end()
            continue
        j = css.find('{', i)
        if j < 0:
            break
        sel = css[i:j].strip()
        d, k = 0, j
        while k < n:
            if css[k] == '{':
                d += 1
            elif css[k] == '}':
                d -= 1
                if d == 0:
                    break
            k += 1
        cuerpo = css[j + 1:k]
        if sel.startswith('@media') or sel.startswith('@supports'):
            out += reglas(cuerpo, base + j + 1, sel)
        else:
            out.append((sel, cuerpo, ctx, base + i, base + k + 1))
        i = k + 1
    return out


def bloque_style(t):
    m = re.search(r'<style>(.*?)</style>', t, re.S)
    if not m:
        sys.exit('sin <style>')
    return m.start(1), m.end(1)


def edita_reglas(t, fn):
    """Aplica fn(sel, cuerpo, ctx) -> None (deja) | str (cuerpo nuevo) | '' (borra la regla) al <style>."""
    a, b = bloque_style(t)
    css = t[a:b]
    cambios = []
    for sel, cuerpo, ctx, i, j in reglas(css):
        r = fn(sel, cuerpo, ctx)
        if r is None:
            continue
        if r == '':
            # borrar la regla y el salto de línea/espacios que la preceden en su línea
            ii = i
            while ii > 0 and css[ii - 1] in ' \t':
                ii -= 1
            jj = j
            if jj < len(css) and css[jj] == '\n' and (ii == 0 or css[ii - 1] == '\n'):
                jj += 1
            cambios.append((ii, jj, ''))
        elif isinstance(r, tuple):
            cambios.append((i, j, r[0] + '{' + r[1] + '}'))
        else:
            cambios.append((i, j, sel + '{' + r + '}'))
    for i, j, nuevo in sorted(cambios, reverse=True):
        css = css[:i] + nuevo + css[j:]
    return t[:a] + css + t[b:]


def norm(s):
    return re.sub(r'\s+', ' ', s.strip()).rstrip(';').strip()


# ---------------------------------------------------------------- 1. estilo común
ALIAS_NOCHE = {
    '--noche': 'var(--night-1)', '--noche-2': 'var(--night-1)',
    '--oro': 'var(--gold)', '--oro-claro': 'var(--gold-soft)',
    '--crema': 'var(--paper)', '--crema-linea': 'var(--paper-edge)',
    '--texto': 'var(--mist)', '--texto-tenue': 'var(--mist-soft)',
    '--borde': 'rgba(242,193,78,.22)',
}
ROOT_HOME = ('--night-1:#0B1437;--night-2:#16205A;--night-3:#243B8F;--gold:#F2C14E;--gold-soft:#FFE3A3;'
             '--gold-deep:#D89A2C;--paper:#FBF3E2;--paper-2:#F3E7CE;--paper-edge:#E7D7B4;--ink:#3A2E22;'
             '--ink-soft:#6B5A45;--mist:#C7CEF0;--max:1200px;')
H1 = {'.hero h1', '.post-head h1', 'h1', 'header h1'}
H2 = {'.s-head h2', '.dl-wrap h2', '.cta-final h2', '.sec-title'}
H3 = {'.cta-app h2', '.email-box h2', '.entrada h2', '.hito h2', '.post h2', '.prensa h2', 'h2', '.parte h2'}

# Botones: la copia de la home sale entera (vive en base.css); de las variantes queda solo lo que no es botón.
BOTONES_FUERA = {
    ('.btn-gold', "font-family:inherit;font-weight:800;font-size:1rem;cursor:pointer;padding:14px 26px;border-radius:12px;border:none;background:linear-gradient(180deg,var(--gold),#E7B23B);color:var(--night-1);transition:transform .15s,box-shadow .15s;white-space:nowrap"): '',
    ('.btn-gold:hover', 'transform:translateY(-2px);box-shadow:0 12px 28px rgba(242,193,78,.42)'): '',
    ('.btn-ghost', 'font-family:inherit;font-weight:700;font-size:1rem;cursor:pointer;padding:14px 24px;border-radius:12px;border:1.5px solid var(--paper-edge);background:#fff;color:var(--ink)'): '',
    ('.btn-ghost:hover', 'border-color:var(--gold-deep)'): '',
    # carta para imprimir (fondo noche): el dorado común; el fantasma conserva su versión sobre noche
    ('.btn-gold', "font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;cursor:pointer;padding:14px 26px;border-radius:12px;border:none;background:linear-gradient(180deg,var(--oro-claro),var(--oro));color:#3a2a06;transition:transform .15s ease,box-shadow .15s ease"): '',
    ('.btn-gold:hover', 'transform:translateY(-2px);box-shadow:0 12px 28px -10px rgba(227,181,74,.7)'): '',
    ('.btn-ghost', "font-family:'Nunito',sans-serif;font-weight:700;font-size:1rem;cursor:pointer;padding:14px 24px;border-radius:12px;border:1.5px solid var(--borde);background:transparent;color:var(--texto)"):
        'border-color:var(--borde);background:transparent;color:var(--texto)',
    ('.btn-ghost:hover', 'border-color:var(--oro)'): '',
    # diario, historia (enlace con icono): solo la colocación
    ('.btn-gold', "display:inline-flex;align-items:center;justify-content:center;gap:10px; background:linear-gradient(180deg,var(--oro-claro),var(--oro)); color:#3a2a06;font-weight:800;font-size:1.05rem; padding:15px 28px;border-radius:999px;text-decoration:none;border:none;cursor:pointer; box-shadow:0 10px 26px -10px rgba(227,181,74,.7); transition:transform .15s ease, box-shadow .15s ease; font-family:'Nunito',sans-serif;"):
        'display:inline-flex;align-items:center;justify-content:center;gap:10px;text-decoration:none',
    ('.btn-gold:hover', 'transform:translateY(-2px);box-shadow:0 16px 34px -12px rgba(227,181,74,.8)'): '',
    ('.btn-gold:focus-visible', 'outline:3px solid var(--oro-claro);outline-offset:3px'): '',
    # aterrizajes /app/ y /carta/: el botón lo enseña el JS
    ('.btn-gold', 'display:none;font-weight:800;font-size:1.05rem;padding:14px 26px;border-radius:12px;background:linear-gradient(180deg,var(--oro-claro),var(--oro));color:#3a2a06;text-decoration:none;margin-bottom:12px'):
        'display:none;text-decoration:none;margin-bottom:12px',
}
BOTONES_FUERA = {(s, norm(c)): v for (s, c), v in BOTONES_FUERA.items()}


def paso_estilo():
    for p in PAGINAS:
        f = fichero(p)
        t = f.read_text(encoding='utf-8')
        a, b = bloque_style(t)
        css = t[a:b]
        m = re.search(r'[ \t]*:root\s*\{([^}]*)\}\n?', css)
        if not m:
            sys.exit(f'{p}: sin :root')
        dentro = re.sub(r'/\*.*?\*/', '', m.group(1), flags=re.S)
        dentro_n = re.sub(r'\s+', '', dentro)
        if dentro_n.startswith(ROOT_HOME):
            extra = dentro_n[len(ROOT_HOME):]
            if extra not in ('', '--medida:680px;--enlace:#8C5D0E;'):
                sys.exit(f'{p}: :root con extras inesperados {extra}')
            nuevo = ''  # todo vive ya en base.css
        elif '--noche' in dentro_n:
            nombres = re.findall(r'(--[\w-]+):', dentro_n)
            nuevo = '  :root{' + ';'.join(f'{k}:{ALIAS_NOCHE[k]}' for k in nombres) + '}\n'
        elif '--navy' in dentro_n:
            nuevo = '  :root{--navy:var(--night-1);--muted:var(--ink-soft);--line:var(--paper-edge);--bg:var(--paper)}\n'
        else:
            sys.exit(f'{p}: :root desconocido')
        css = css[:m.start()] + nuevo + css[m.end():]
        t = t[:a] + css + t[b:]

        def fn(sel, cuerpo, ctx):
            if ctx == '' and (sel, norm(cuerpo)) in BOTONES_FUERA:
                return BOTONES_FUERA[(sel, norm(cuerpo))]
            if ctx == '' and 'font-size' in cuerpo:
                tok = 't-h1' if sel in H1 else 't-h2' if sel in H2 else 't-h3' if sel in H3 else None
                if tok:
                    return re.sub(r'font-size:[^;}]+', f'font-size:var(--{tok})', cuerpo, count=1)
            if p == '/privacidad/':
                if sel == 'body':
                    return cuerpo.replace('font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;',
                                          "font-family:'Nunito Sans',system-ui,sans-serif;")
                if sel == 'a':
                    return cuerpo.replace('color:#1a5fb4;', 'color:var(--enlace);')
                if sel in ('header p', '.parte p'):
                    return cuerpo.replace('color:#c9cedd', 'color:var(--mist)')
            return None
        t = edita_reglas(t, fn)
        if p == '/privacidad/':
            t = t.replace('  header{\n', "  h1,h2{font-family:'Fraunces',Georgia,serif}\n  header{\n", 1)
        # Inline: el H2 del bloque de la app en las páginas noche y la copia en línea de la escala de la home
        t = t.replace('<h2 style="color:var(--noche);font-size:1.55rem;', '<h2 style="color:var(--noche);font-size:var(--t-h3);')
        t = t.replace('style="font-size:clamp(1.9rem,3.8vw,2.8rem)', 'style="font-size:var(--t-h2)')
        # Texto: de Nunito a Nunito Sans (en el <style> y en los style="" sueltos)
        t = re.sub(r"'Nunito'(?! Sans)", "'Nunito Sans'", t)
        # El dorado viejo de la familia noche en transparencias: al dorado común
        t = t.replace('rgba(227,181,74,', 'rgba(242,193,78,')
        f.write_text(t, encoding='utf-8')
    print('estilo: hecho en', len(PAGINAS), 'páginas')


# ---------------------------------------------------------------- 2. CSS muerto
CLASES_MUERTAS = r'nav|logo|name|brand|seal-mini|nav-eyebrow|top|disclaimer|discl|foot-[\w-]+'


def paso_css_muerto():
    total = 0
    for p in PAGINAS:
        f = fichero(p)
        t = f.read_text(encoding='utf-8')
        a, b = bloque_style(t)
        html = t[:a] + t[b:]
        # Las clases viejas solo cuentan como vivas si aún salen en el HTML de la página
        # (la nota de la comparativa usa .discl dentro del pie común).
        vivas = {c for c in re.findall(r'class="([^"]*)"', html) for c in c.split()}
        hay_header = '<header' in html  # privacidad conserva su banda <header>

        def muerto(s):
            for c in re.findall(r'\.(' + CLASES_MUERTAS + r')\b', s):
                if c not in vivas:
                    return True
            if re.search(r'(^|[\s,>+~])footer\b', s) and not re.search(r'\.discl\b', s):
                return True  # el <footer> del pie común lo estila .db-pie
            if re.search(r'(^|[\s,>+~])header\b', s) and not hay_header:
                return True
            return False

        def fn(sel, cuerpo, ctx):
            partes = [s.strip() for s in sel.split(',')]
            quedan = [s for s in partes if not muerto(s)]
            if len(quedan) == len(partes):
                return None
            return '' if not quedan else (','.join(quedan), cuerpo)

        # edita_reglas admite cambiar el selector devolviendo (selector, cuerpo)
        antes = len(t)
        t = edita_reglas(t, fn)
        # @media que se hayan quedado vacíos
        t = re.sub(r'\n?[ \t]*@media[^{]*\{\s*\}', '', t)
        # <svg> oculto con el sello si ya nadie lo usa en la página
        m = re.search(r'[ \t]*<svg width="0" height="0" style="position:absolute" aria-hidden="true">.*?</svg>\n?', t, re.S)
        if m:
            ids = re.findall(r'id="([\w-]+)"', m.group(0))
            resto = t[:m.start()] + t[m.end():]
            if not any(re.search(r'<use[^>]*href="#' + i + '"', resto) for i in ids):
                t = resto
        total += antes - len(t)
        f.write_text(t, encoding='utf-8')
    print('css-muerto: fuera', total, 'bytes')


if __name__ == '__main__':
    pasos = {'estilo': paso_estilo, 'css-muerto': paso_css_muerto}
    if len(sys.argv) != 2 or sys.argv[1] not in pasos:
        sys.exit(__doc__)
    pasos[sys.argv[1]]()

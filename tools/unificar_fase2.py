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


# ---------------------------------------------------------------- 3. bloque de la app
PLAY = (r'https://play\.google\.com/store/apps/details\?id=es\.donbigotes\.app&referrer=utm_source%3Dweb'
        r'%26utm_medium%3D(?P<medio>[\w-]+)%26utm_campaign%3D(?P<campana>[\w-]+)(?P<hl>&hl=es_419)?')
IOS = r'https://apps\.apple\.com/(?P<es>es/)?app/id6798414411\?pt=129172273&ct=(?P<ct>[\w-]+)&mt=8'
TITULO_DEF = 'Crea la experiencia completa en la app Don Bigotes'
LEAD_DEF = {
    'es': 'Voz, foto y Diploma de Valent&iacute;a personalizados. El Pack M&aacute;gico completo, 4,99 &euro; en un &uacute;nico pago.',
    'es-419': 'Voz, foto y Diploma de Valent&iacute;a personalizados. El Pack M&aacute;gico completo se paga una sola vez, al precio local de la tienda.',
}


def paso_cta():
    n = 0
    for p in PAGINAS:
        f = fichero(p)
        t = f.read_text(encoding='utf-8')
        if 'id="cta-app"' not in t:
            continue
        lang = 'es-419' if p.startswith('/es-419/') else 'es'
        i = t.index('id="cta-app"')
        s = t.rfind('<section', 0, i)
        e = t.index('</section>', i) + len('</section>')
        bloque = t[s:e]
        hrefs = re.findall(r'href="([^"]*)"', bloque)
        mp, mp2, mi = re.fullmatch(PLAY, hrefs[0]), re.fullmatch(PLAY, hrefs[1]), re.fullmatch(IOS, hrefs[2])
        if not (mp and mp2 and mi and hrefs[0] == hrefs[1] and len(hrefs) == 3):
            sys.exit(f'{p}: enlaces del bloque con forma inesperada')
        if bool(mp['hl']) != (lang == 'es-419') or bool(mi['es']) != (lang == 'es'):
            sys.exit(f'{p}: idioma de los enlaces incoherente')
        titulo = re.search(r'<h2[^>]*>(.*?)</h2>', bloque).group(1)
        lead = re.search(r'<p[^>]*>(.*?)</p>', bloque).group(1)
        args = [f'lang="{lang}"', f'medio="{mp["medio"]}"', f'campana="{mp["campana"]}"', f'ct="{mi["ct"]}"']
        if bloque.startswith('<section class="wrap"'):
            args.append('estilo="noche"')
            ancho = re.search(r'max-width:(\d+)ch', bloque).group(1)
            if ancho != '16':
                args.append(f'ancho="{ancho}"')
        m = re.search(r'<div class="badges" id="([\w-]+)">', bloque)
        if m:
            args.append(f'id="{m.group(1)}"')
        if titulo != TITULO_DEF:
            args.append(f'titulo="{titulo}"')
        if lead != LEAD_DEF[lang]:
            args.append(f'lead="{lead}"')
        if '"' in titulo + lead:
            sys.exit(f'{p}: comillas en el texto')
        t = t[:s] + '{% include cta-app.html ' + ' '.join(args) + ' %}' + t[e:]
        f.write_text(t, encoding='utf-8')
        n += 1
    print('cta: include en', n, 'páginas')


# ---------------------------------------------------------------- 4. imágenes
WEBP = {'/diploma-valentia.jpg': '/diploma-valentia.webp', '/diploma-valentia-latam.jpg': '/diploma-valentia-latam.webp'}


def medidas(src):
    """(ancho, alto) intrínsecos de una imagen del repo, o None."""
    f = RAIZ / src.split('?')[0].lstrip('/')
    if not f.exists():
        return None
    if f.suffix == '.svg':
        s = f.read_text(encoding='utf-8')[:2000]
        w, h = re.search(r'<svg[^>]*\swidth="([\d.]+)', s), re.search(r'<svg[^>]*\sheight="([\d.]+)', s)
        if w and h:
            return round(float(w.group(1))), round(float(h.group(1)))
        vb = re.search(r'viewBox="[\d.\s-]+?\s([\d.]+)\s([\d.]+)"', s)
        return (round(float(vb.group(1))), round(float(vb.group(2)))) if vb else None
    from PIL import Image
    with Image.open(f) as im:
        return im.size


def con_attr(tag, extra):
    return re.sub(r'\s*/?>$', lambda m: extra + m.group(0).lstrip(), tag) if extra else tag


def paso_imagenes(site, cajas):
    """site: build de Jekyll del estado actual; cajas: JSON de la medición (390 y 1280 px) de ese build.
    Añade width/height intrínsecos a las <img> que no los tienen y loading="lazy" a las que no salen
    en la primera pantalla ni en móvil (844 px) ni en escritorio (800 px)."""
    import json
    cajas = json.load(open(cajas))
    por_include = {}  # tag -> [(extra, página)] de las que salen (también) de un include
    textos_include = '\n'.join(i.read_text(encoding='utf-8') for i in (RAIZ / '_includes').glob('*.html'))
    informe = {'wh': 0, 'lazy': 0, 'include': 0, 'picture': 0}
    for p in PAGINAS:
        f = fichero(p)
        t = f.read_text(encoding='utf-8')
        h = (Path(site) / (p.lstrip('/') + 'index.html')).read_text(encoding='utf-8')
        h_sin = re.sub(r'<(script|noscript|template)\b.*?</\1>', '', h, flags=re.S)
        tags = re.findall(r'<img\b[^>]*>', h_sin)
        m390 = [x for x in cajas[p]['390'] if not x['banda']]
        m1280 = cajas[p]['1280']
        if not (len(tags) == len(m390) == len(m1280)):
            sys.exit(f'{p}: {len(tags)} <img> en el HTML y {len(m1280)} en el navegador')
        visto = {}
        cambios = {}  # (tag, ocurrencia en el fuente) -> tag nuevo
        for k, tag in enumerate(tags):
            j = visto.get(tag, 0)
            visto[tag] = j + 1
            src = re.search(r'\ssrc="([^"]*)"', tag)
            extra = ''
            if src and not (re.search(r'\swidth=', tag) and re.search(r'\sheight=', tag)) and not src.group(1).startswith(('http', 'data:')):
                wh = medidas(src.group(1))
                if wh and not re.search(r'\swidth=', tag) and not re.search(r'\sheight=', tag):
                    extra += f' width="{wh[0]}" height="{wh[1]}"'
            a, b = m390[k], m1280[k]
            fuera = a['top'] >= 844 and b['top'] >= 800 and (a['vis'] or b['vis'])
            if src and 'loading=' not in tag and fuera:
                extra += ' loading="lazy"'
            n_fuente = t.count(tag)
            if n_fuente == 0 or tag in textos_include:
                # sale (también) de un include: se decide una vez para todas sus apariciones
                por_include.setdefault(tag, []).append((extra, p))
                continue
            if n_fuente != tags.count(tag):
                sys.exit(f'{p}: la etiqueta sale {n_fuente} veces en el fuente y {tags.count(tag)} en el build: {tag[:90]}')
            if extra:
                cambios[(tag, j)] = con_attr(tag, extra)
        # aplicar de atrás adelante por posición en el fuente
        pos = []
        for (tag, j), nuevo in cambios.items():
            i = -1
            for _ in range(j + 1):
                i = t.index(tag, i + 1)
            pos.append((i, tag, nuevo))
        for i, tag, nuevo in sorted(pos, reverse=True):
            t = t[:i] + nuevo + t[i + len(tag):]
            informe['wh'] += 'width=' in nuevo[len(tag) - 1:]
            informe['lazy'] += 'loading="lazy"' in nuevo[len(tag) - 1:]
        # WebP de los diplomas con <picture> (el JPEG queda de respaldo)
        def envuelve(m):
            informe['picture'] += 1
            src = re.search(r'\ssrc="([^"]*)"', m.group(0)).group(1)
            return f'<picture><source srcset="{WEBP[src]}" type="image/webp">{m.group(0)}</picture>'
        t = re.sub(r'(?<!type="image/webp">)<img\b[^>]*\ssrc="(?:/diploma-valentia\.jpg|/diploma-valentia-latam\.jpg)"[^>]*>', envuelve, t)
        f.write_text(t, encoding='utf-8')
    # Imágenes que salen de los includes: se tocan en el include, una vez
    for tag, usos in por_include.items():
        extras = {e for e, _ in usos}
        wh = re.search(r' width="\d+" height="\d+"', ' '.join(extras))
        lazy = all('loading="lazy"' in e for e, _ in usos)
        extra = (wh.group(0) if wh else '') + (' loading="lazy"' if lazy else '')
        if not extra:
            continue
        hecho = False
        nuevo = con_attr(tag, extra)
        for p in {q for _, q in usos}:  # copias literales en las páginas
            f = fichero(p)
            s = f.read_text(encoding='utf-8')
            if tag in s:
                f.write_text(s.replace(tag, nuevo), encoding='utf-8')
        for inc in (RAIZ / '_includes').glob('*.html'):
            s = inc.read_text(encoding='utf-8')
            # en el include la etiqueta lleva Liquid o es literal
            if tag in s:
                inc.write_text(s.replace(tag, con_attr(tag, extra)), encoding='utf-8')
                hecho = True
        informe['include'] += hecho
        if not hecho:
            print('AVISO: etiqueta de include sin localizar:', tag[:100], extra, '(', len(usos), 'usos )')
    print('imagenes:', informe)


if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == 'imagenes':
        paso_imagenes(sys.argv[2], sys.argv[3])
        sys.exit()
    pasos = {'estilo': paso_estilo, 'css-muerto': paso_css_muerto, 'cta': paso_cta}
    if len(sys.argv) != 2 or sys.argv[1] not in pasos:
        sys.exit(__doc__)
    pasos[sys.argv[1]]()

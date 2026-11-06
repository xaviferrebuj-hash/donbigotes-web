"""Corta las capturas en trozos de 3 pantallas (JPEG q85) y monta el PDF A4 para Fable.

Uso: python monta_pdf.py <carpeta_png> <carpeta_salida> <dsf_movil>
"""
import json, math, os, sys, glob
import numpy as np
from PIL import Image
from reportlab import rl_config
rl_config.useA85 = 0  # JPEG tal cual, sin inflarlo un 25 % en ASCII85
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

Image.MAX_IMAGE_PIXELS = None
SRC, OUT, DSF = sys.argv[1], sys.argv[2], float(sys.argv[3])
CAP = os.path.join(OUT, 'capturas')
os.makedirs(CAP, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
PAGINAS = {p['n']: p for p in json.load(open(os.path.join(HERE, 'paginas.json')))}
RES = json.load(open(os.path.join(SRC, 'resultados.json')))
extra = os.path.join(SRC, 'resultados-24.json')
if os.path.exists(extra):
    RES = [r for r in RES if r['n'] != 24] + json.load(open(extra))
RES.sort(key=lambda r: (r['n'], r['modo'] != 'movil'))

pdfmetrics.registerFont(TTFont('DV', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

PANT = {'movil': (390, 844), 'escritorio': (1280, 800)}


def fila_limpia(gris, objetivo, ventana):
    """Fila con menos detalle (espacio en blanco) cerca de `objetivo`, para no partir una línea."""
    a, b = max(1, objetivo - ventana), min(gris.shape[0] - 1, objetivo + ventana)
    zona = gris[a:b]
    coste = zona.std(axis=1) + np.abs(np.diff(gris[a - 1:b], axis=0)).mean(axis=1)
    # A igualdad, la más cercana al objetivo.
    coste = coste + np.abs(np.arange(a, b) - objetivo) * 1e-3
    return a + int(np.argmin(coste))


def gris_de(im):
    return np.asarray(im.convert('L'), dtype=np.float32)


def cortes(gris, alto, trozo, ventana):
    """Cortes cada `trozo` px, desplazados a una fila limpia; el último resto corto se suma al anterior."""
    c = [0]
    while alto - c[-1] > trozo * 1.17:
        c.append(fila_limpia(gris, c[-1] + trozo, ventana))
    c.append(alto)
    return c


fmt = lambda x: f'{x:,}'.replace(',', '.')


def sc_texto(p):
    if 'clics' in p:
        return (f'Search Console, últimos 28 días (10-oct a 6-nov-2026): {fmt(p["clics"])} clics · '
                f'{fmt(p["impr"])} impresiones · posición media {p["pos"]}')
    return f'Search Console, últimos 28 días (10-oct a 6-nov-2026): {p["sin_datos"]}'


# 1) Trozos JPEG
hojas = []  # (resultado, jpeg, parte, partes, cortes_columnas_css)
for r in RES:
    p = PAGINAS[r['n']]
    vw, vh = PANT[r['modo']]
    escala = DSF if r['modo'] == 'movil' else 1.0
    im = Image.open(r['png']).convert('RGB')
    W, H = im.size
    g = gris_de(im)
    pant = vh * escala
    total_pant = H / pant
    r['pantallas'] = round(total_pant, 1)
    if total_pant > 6 or r['modo'] == 'escritorio':
        cs = cortes(g, H, int(3 * pant), int(160 * escala))
    else:
        cs = [0, H]
    base = f'{r["n"]:02d}-{p["slug"]}-{r["modo"]}'
    n = len(cs) - 1
    r['jpegs'] = []
    for i in range(n):
        trozo = im.crop((0, cs[i], W, cs[i + 1]))
        nombre = base + (f'-{i + 1}de{n}' if n > 1 else '') + '.jpg'
        ruta = os.path.join(CAP, nombre)
        trozo.save(ruta, 'JPEG', quality=85, optimize=True)
        # Columnas dentro de la hoja (solo móvil): como mucho 1,5 pantallas por columna.
        th = cs[i + 1] - cs[i]
        if r['modo'] == 'movil':
            ncol = min(3, max(1, math.ceil(th / (1.5 * pant) - 0.17)))
        else:
            ncol = 1
        gt = g[cs[i]:cs[i + 1]]
        cc = [0]
        for k in range(1, ncol):
            cc.append(fila_limpia(gt, int(th * k / ncol), int(120 * escala)))
        cc.append(th)
        r['jpegs'].append(nombre)
        hojas.append((r, ruta, i + 1, n, cc, W, th))

# 2) PDF
PW, PH = A4
M = 22
CAB, PIE = 40, 30
GAP = 14
ruta_pdf = os.path.join(OUT, 'web-donbigotes-2026-11-06.pdf')
c = canvas.Canvas(ruta_pdf, pagesize=A4, pageCompression=1)
c.setTitle('Don Bigotes · web publicada · capturas 6-nov-2026')
c.setAuthor('Don Bigotes (sesión en la nube)')
total_pags = 1 + len(hojas)

# Página de inicio de cada captura en el PDF
inicio = {}
for idx, h in enumerate(hojas):
    inicio.setdefault((h[0]['n'], h[0]['modo']), idx + 2)


def comprobacion(n):
    rs = [x for x in RES if x['n'] == n]
    http = '/'.join(str(x.get('status')) for x in rs)
    consola = sum(len(x.get('consola', [])) for x in rs)
    m = [x for x in rs if x['modo'] == 'movil'][0]
    sx = 'sí' if m.get('scroll_horizontal') else 'no'
    return http, str(consola), sx


def parrafo(texto, x, y, ancho, fuente='DV', cuerpo=8.6, interlinea=11.2, sangria=0):
    """Escribe `texto` partido a `ancho` pt; devuelve la nueva y."""
    c.setFont(fuente, cuerpo)
    palabras, linea, primera = texto.split(), '', True
    for w in palabras:
        prueba = (linea + ' ' + w).strip()
        if pdfmetrics.stringWidth(prueba, fuente, cuerpo) > ancho - (0 if primera else sangria) and linea:
            c.drawString(x + (0 if primera else sangria), y, linea)
            y -= interlinea
            linea, primera = w, False
        else:
            linea = prueba
    if linea:
        c.drawString(x + (0 if primera else sangria), y, linea)
        y -= interlinea
    return y


def indice():
    ancho = PW - 2 * M
    y = PH - M - 12
    c.setFont('DVB', 13.5)
    c.drawString(M, y, 'Don Bigotes · la web publicada (donbigotes.app) · 6-nov-2026')
    y -= 17
    y = parrafo('Para la revisión de Fable. Capturas de la web en producción, no de un build local: Chromium sin cookies '
                'y con Plausible bloqueado dentro del navegador (ninguna petición llegó a plausible.io). '
                f'Móvil a 390×844 (deviceScaleFactor {DSF:g}, navegador Android) y, en las páginas 1, 4 y 14, también '
                'escritorio a 1280×800. Cada página del PDF es un trozo de unas 3 pantallas; en móvil va en dos columnas: '
                'primero la izquierda, luego la derecha. Los cortes caen en una franja vacía, para no partir ninguna línea. '
                'En el pie de cada página, los datos de Search Console de esa URL (28 días, 10-oct a 6-nov).', M, y, ancho)
    y -= 8
    cols = [M, M + 22, M + 250, M + 290, M + 338, M + 372, M + 420, M + 474, M + 516]
    cab = ['N', 'URL', 'Clics', 'Impr.', 'Pos.', 'Pág.', 'HTTP', 'Consola', 'Scroll X']
    c.setFillColorRGB(0.11, 0.15, 0.30)
    c.rect(M - 4, y - 5, PW - 2 * M + 8, 16, stroke=0, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont('DVB', 8.3)
    for x, t in zip(cols, cab):
        c.drawString(x, y, t)
    c.setFillColorRGB(0, 0, 0)
    y -= 17
    for n in sorted(PAGINAS):
        p = PAGINAS[n]
        if n % 2 == 0:
            c.setFillColorRGB(0.95, 0.95, 0.97)
            c.rect(M - 4, y - 5, PW - 2 * M + 8, 16, stroke=0, fill=1)
            c.setFillColorRGB(0, 0, 0)
        c.setFont('DV', 8.3)
        http, consola, sx = comprobacion(n)
        pags = str(inicio[(n, 'movil')]) + (f' · {inicio[(n, "escritorio")]}' if (n, 'escritorio') in inicio else '')
        if 'clics' in p:
            datos = [fmt(p['clics']), fmt(p['impr']), p['pos']]
        else:
            datos = ['nueva' if p['sin_datos'].startswith('nueva') else '—', '—', '—']
        fila = [str(n), p['ruta']] + datos + [pags, http, consola, sx]
        for x, t in zip(cols, fila):
            c.drawString(x, y, t)
        y -= 16
    y -= 8
    c.setFont('DVB', 8.6)
    c.drawString(M, y, 'Notas')
    y -= 12
    malas = [x for x in RES if x.get('consola') or x.get('scroll_horizontal') or x.get('status') != 200]
    notas = [
        '· «Pág.»: página del PDF donde empieza la captura en móvil (y, tras el punto, la de escritorio). «HTTP»: código de la '
        'página (móvil/escritorio). «Consola»: errores de consola de JavaScript. «Scroll X»: si a 390 px se puede desplazar en horizontal.',
        ('· Las 25 responden 200, sin errores de consola y sin scroll horizontal a 390 px.' if not malas else
         '· Con incidencias: ' + ', '.join(f'{x["n"]} ({x["modo"]})' for x in malas) + '. Detalle en el informe.'),
        '· 24 /carta/ no es el generador de la carta: es la pasarela del QR impreso en la carta (noindex). En el móvil salta a la '
        'tienda a los 800 ms; aquí se bloqueó ese salto y se ve lo que el padre ve un instante antes. El generador está '
        'dentro de la home y de las páginas 2, 7, 10, 14, 15, 16 y 22, y sale en su estado inicial, con la carta de muestra.',
        '· Los botones de tienda que dependen del dispositivo salen en su versión de Android. En Android, todas las páginas '
        'menos 1 y 2 llevan abajo una banda fija «Instalar»; en la captura de página entera sale una sola vez, al pie de la '
        'primera pantalla.',
        '· Sin datos de Search Console: 19 y 20 (páginas nuevas) y 24 y 25 (el encargo no los traía).',
    ]
    for linea in notas:
        y = parrafo(linea, M, y, ancho, cuerpo=8.2, interlinea=10.6, sangria=7)
        y -= 2
    pie(1)
    c.showPage()


def pie(num, texto=None):
    c.setFont('DV', 7.5)
    c.setFillColorRGB(0.35, 0.35, 0.4)
    if texto:
        c.drawString(M, M - 6, texto)
    c.drawRightString(PW - M, M - 6, f'{num}/{total_pags}')
    c.setFillColorRGB(0, 0, 0)


indice()
for idx, (r, ruta, parte, partes, cc, W, th) in enumerate(hojas):
    num = idx + 2
    p = PAGINAS[r['n']]
    modo = 'móvil' if r['modo'] == 'movil' else 'escritorio'
    url = 'https://donbigotes.app' + p['ruta']
    c.setFont('DVB', 11)
    c.drawString(M, PH - M - 8, f'{r["n"]} · {url} · {modo}')
    c.setFont('DV', 8.5)
    if partes > 1:
        c.drawRightString(PW - M, PH - M - 8, f'parte {parte} de {partes}')
    c.setFillColorRGB(0.35, 0.35, 0.4)
    c.setFont('DV', 7.8)
    titulo = r.get('titulo', '')
    if len(titulo) > 120:
        titulo = titulo[:117] + '…'
    c.drawString(M, PH - M - 21, f'«{titulo}»')
    c.setFillColorRGB(0, 0, 0)
    pie(num, sc_texto(p))

    # Zona de la imagen
    top = PH - M - CAB
    bottom = M + PIE - 14
    alto_disp = top - bottom
    ancho_disp = PW - 2 * M
    ncol = len(cc) - 1
    col_px = max(cc[k + 1] - cc[k] for k in range(ncol))
    s = min((ancho_disp - GAP * (ncol - 1)) / ncol / W, alto_disp / col_px)
    if r['modo'] == 'movil':
        s = min(s, 0.6 / (DSF))  # mismo tamaño de letra en todas (≈0,6 pt por px CSS)
    ancho_col = W * s
    x0 = M + (ancho_disp - (ancho_col * ncol + GAP * (ncol - 1))) / 2
    for k in range(ncol):
        y_px0, y_px1 = cc[k], cc[k + 1]
        x = x0 + k * (ancho_col + GAP)
        h_col = (y_px1 - y_px0) * s
        c.saveState()
        path = c.beginPath()
        path.rect(x, top - h_col, ancho_col, h_col)
        c.clipPath(path, stroke=0, fill=0)
        # La imagen entera, desplazada para que en la ventana quede solo el tramo y_px0..y_px1.
        c.drawImage(ruta, x, top - h_col - (th - y_px1) * s, width=ancho_col, height=th * s)
        c.restoreState()
        c.setStrokeColorRGB(0.75, 0.75, 0.8)
        c.setLineWidth(0.5)
        c.rect(x, top - h_col, ancho_col, h_col, stroke=1, fill=0)
        if ncol > 1:
            c.setFont('DVB', 7)
            c.setFillColorRGB(0.45, 0.45, 0.5)
            c.drawString(x, top + 3, f'columna {k + 1}' + (' ▸' if k < ncol - 1 else ''))
            c.setFillColorRGB(0, 0, 0)
    c.showPage()

c.save()
json.dump(RES, open(os.path.join(OUT, 'resultados.json'), 'w'), ensure_ascii=False, indent=1)
tam = os.path.getsize(ruta_pdf)
jp = sum(os.path.getsize(f) for f in glob.glob(os.path.join(CAP, '*.jpg')))
print(f'PDF {tam / 1e6:.1f} MB · {total_pags} páginas · JPEG {jp / 1e6:.1f} MB en {len(glob.glob(os.path.join(CAP, "*.jpg")))} ficheros')

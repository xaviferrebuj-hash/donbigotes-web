"""PDF comparativo ANTES | DESPUÉS (390 px, móvil Android) de las páginas tocadas en web/fable-6nov.

Una página del PDF por URL, con las dos capturas de página entera lado a lado y a la misma escala
(0,6 pt por píxel CSS: un texto de 16 px sale a 9,6 pt), más una portada con el índice y una hoja con
el primer pantallazo (la banda «Instalar»). Uso:
  python monta_comparativo.py <antes> <despues> <rutas.txt> <paginas.json> <salida.pdf> <carpeta_jpg> <calidad>
"""
import json, os, sys
from PIL import Image
from reportlab import rl_config
rl_config.useA85 = 0
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader

Image.MAX_IMAGE_PIXELS = None
ANTES, DESPUES, RUTAS, PAGJSON, SALIDA, JPG, Q = sys.argv[1:8]
Q = int(Q)
ANCHO = 488
os.makedirs(os.path.join(JPG, 'antes'), exist_ok=True); os.makedirs(os.path.join(JPG, 'despues'), exist_ok=True)
pdfmetrics.registerFont(TTFont('DV', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
NUM = {p['ruta']: p['n'] for p in json.load(open(PAGJSON))}
rutas = [l.strip() for l in open(RUTAS) if l.strip()]
def slug(r): return 'home' if r == '/' else r.strip('/').replace('/', '--')
CAMBIOS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cambios.json')))
ESC = 0.6           # pt por px CSS
COL = 390 * ESC     # 234 pt
M, GAP, CAB = 22, 18, 62
W = M * 2 + COL * 2 + GAP

def jpg(png, destino):
    im = Image.open(png).convert('RGB')
    if im.width > ANCHO:  # 390 px CSS a 1,25 (488 px): ~150 ppp en el PDF, para que pese menos
        im = im.resize((ANCHO, round(im.height * ANCHO / im.width)), Image.LANCZOS)
    im.save(destino, 'JPEG', quality=Q, optimize=True, progressive=True, subsampling=2)
    return im.size

c = canvas.Canvas(SALIDA, pageCompression=1)
c.setTitle('Web Don Bigotes · revisión de Fable · antes | después · 6-nov-2026')
# Portada con el índice
alto = 842; c.setPageSize((W, alto))
c.setFont('DVB', 14); c.drawString(M, alto - 40, 'Revisión de Fable · antes | después')
c.setFont('DV', 8.5)
y = alto - 58
for linea in ['Rama web/fable-6nov (sin merge). Capturas a 390 px, Android (Pixel 7), página entera, sobre la web',
              'compilada en local con el gem github-pages. Izquierda: main (973047b). Derecha: la rama. Misma escala.',
              'La banda «Instalar» no sale en las capturas de página entera: ver la hoja «Primer pantallazo».', '']:
    c.drawString(M, y, linea); y -= 12
c.setFont('DVB', 9); c.drawString(M, y, 'Páginas (n.º del PDF de Fable del 6-nov):'); y -= 14
c.setFont('DV', 8)
for i, r in enumerate(rutas):
    n = NUM.get(r); txt = f'{i + 2:>2}. ' + (f'[{n}] ' if n else ('[nueva] ' if 'cuando-se-caen' in r else '[—] ')) + r
    c.drawString(M, y, txt); y -= 11
    if y < 40: c.showPage(); c.setPageSize((W, alto)); y = alto - 40; c.setFont('DV', 8)
c.drawString(M, y - 8, f'{len(rutas) + 2}. Primer pantallazo en Android (6, 7, 10, 14): la banda «Instalar»')
c.showPage()

def cabecera(h, r):
    n = NUM.get(r)
    c.setFont('DVB', 10.5)
    c.drawString(M, h - 20, ((f'{n} · ' if n else ('Nueva · ' if 'cuando-se-caen' in r else '')) + 'https://donbigotes.app' + r))
    c.setFont('DV', 7.5)
    txt = CAMBIOS.get(r, ''); x = M; yy = h - 33
    # texto de cambios en 2 líneas como mucho
    palabras = txt.split(); linea = ''
    for p in palabras:
        if pdfmetrics.stringWidth(linea + ' ' + p, 'DV', 7.5) > W - 2 * M:
            c.drawString(x, yy, linea.strip()); yy -= 9; linea = ''
        linea += ' ' + p
    if linea: c.drawString(x, yy, linea.strip())
    c.setFont('DVB', 9)
    c.drawString(M, h - CAB + 6, 'ANTES (main)'); c.drawString(M + COL + GAP, h - CAB + 6, 'DESPUÉS (web/fable-6nov)')

for r in rutas:
    s = slug(r)
    a_png, d_png = os.path.join(ANTES, s + '.png'), os.path.join(DESPUES, s + '.png')
    a_jpg, d_jpg = os.path.join(JPG, 'antes', s + '.jpg'), os.path.join(JPG, 'despues', s + '.jpg')
    da = jpg(a_png, a_jpg) if os.path.exists(a_png) else None
    dd = jpg(d_png, d_jpg)
    dsf = dd[0] / 390
    ha = da[1] / dsf * ESC if da else 0; hd = dd[1] / dsf * ESC
    h = CAB + max(ha, hd) + M
    c.setPageSize((W, h)); cabecera(h, r)
    if da: c.drawImage(a_jpg, M, h - CAB - ha, width=COL, height=ha)
    else:
        c.setFont('DV', 9); c.drawString(M, h - CAB - 20, 'Página nueva: no existía en main.')
    c.drawImage(d_jpg, M + COL + GAP, h - CAB - hd, width=COL, height=hd)
    c.setStrokeColorRGB(.8, .8, .8); c.line(M + COL + GAP / 2, M, M + COL + GAP / 2, h - CAB + 2)
    c.showPage()

# Primer pantallazo (844 px de alto): antes con la banda, después sin ella.
P1 = ['/carta-para-imprimir/', '/editable/', '/ultimo-diente/', '/el-ratoncito-perez-existe/']
hp = 844 * ESC * 0.62
filas = len(P1); h = CAB + filas * (hp + 26) + M
c.setPageSize((W, h)); c.setFont('DVB', 10.5); c.drawString(M, h - 20, 'Primer pantallazo en Android (390 × 844): la banda «Instalar»')
c.setFont('DV', 7.5); c.drawString(M, h - 33, 'Antes, la banda fija tapaba el botón del hero. Después, aparece al bajar media pantalla (y se va con el generador abierto).')
y = h - CAB
for r in P1:
    s = slug(r); c.setFont('DVB', 8.5); n = NUM.get(r)
    c.drawString(M, y - 2, f'{n} · {r}'); c.setFont('DV', 7.5)
    c.drawString(M + COL * 0.62 + GAP + COL * 0.62 + 12, y - hp / 2 - 10, '← izquierda: antes (main)')
    c.drawString(M + COL * 0.62 + GAP + COL * 0.62 + 12, y - hp / 2 + 2, 'derecha: después')
    y -= 10
    for k, carpeta in enumerate((ANTES, DESPUES)):
        png = os.path.join(carpeta, s + '-pantalla1.png')
        destino = os.path.join(JPG, ('antes' if k == 0 else 'despues'), s + '-pantalla1.jpg'); jpg(png, destino)
        c.drawImage(destino, M + k * (COL * 0.62 + GAP) + (COL - COL * 0.62) * 0, y - hp, width=COL * 0.62, height=hp)
    y -= hp + 16
c.showPage()
c.save()
print('PDF', SALIDA, os.path.getsize(SALIDA))

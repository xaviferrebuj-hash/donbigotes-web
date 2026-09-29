#!/usr/bin/env python3
"""Comprobación del cambio hreflang por país + metadatos «Ratón de los Dientes» (29-sep-2026).

Uso: python3 tools/comprobar-hreflang.py [REF]   (REF = versión git de referencia, por defecto HEAD)
Sale con 1 si algo falla.

  (a) tools/hreflang.py --check: 23 alternates exactos, sin duplicados, recíprocos,
      href absoluto con barra final, destino existente, canonical propio.
  (b) Los 4 title y 2 description LATAM exactamente como se pidieron (og:* igual si copiaban).
  (c) El resto del <head> (lang incluido) idéntico a REF, ignorando el bloque hreflang
      y las líneas de (b).
"""
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import hreflang  # noqa: E402

RAIZ = hreflang.RAIZ
REF = sys.argv[1] if len(sys.argv) > 1 else "HEAD"

TITLES = {
    "es-419/ultimo-diente/": "Carta de despedida del Ratón Pérez o Ratón de los Dientes",
    "es-419/firma-sello-raton-perez/": "Firma del Ratón Pérez o Ratón de los Dientes: PNG y PDF gratis",
    "es-419/certificado-raton-perez/": "Certificado del Ratón Pérez o Ratón de los Dientes · PDF gratis",
    "es-419/el-ratoncito-perez-existe/": "¿Existe el Ratón Pérez (Ratón de los Dientes)? Qué contestar",
}
DESCS = {
    "es-419/firma-sello-raton-perez/": "Descarga gratis la firma del Ratón Pérez (el Ratón de los Dientes) y su sello en PNG y PDF, listos para imprimir o pegar en la carta de tu hijo.",
    "es-419/el-ratoncito-perez-existe/": "Qué contestar si tu hijo pregunta si el Ratón Pérez (el Ratón de los Dientes) existe, según su edad, y cómo mantener la ilusión sin mentirle.",
}
# og:* que hoy copian al title / description y deben seguir copiándolos
OG_TITLE = {"es-419/firma-sello-raton-perez/", "es-419/certificado-raton-perez/",
            "es-419/el-ratoncito-perez-existe/"}
OG_DESC = {"es-419/firma-sello-raton-perez/", "es-419/el-ratoncito-perez-existe/"}

fallos = []


def head(html):
    return html.split("</head>")[0]


def meta(html, attr, nombre):
    m = re.search(rf'<meta {attr}="{re.escape(nombre)}" content="([^"]*)">', html)
    return m.group(1) if m else None


def lineas_estables(h, ruta):
    """Líneas del head sin el bloque hreflang ni las líneas que se cambian a propósito."""
    fuera = [hreflang.RE_ALT]
    if ruta in TITLES:
        fuera += [re.compile(r"<title>"), re.compile(r'property="og:title"')]
    if ruta in DESCS:
        fuera += [re.compile(r'name="description"'), re.compile(r'property="og:description"')]
    return [l for l in h.splitlines() if not any(r.search(l) for r in fuera)]


# (a)
if not hreflang.comprobar():
    fallos.append("hreflang --check")

rutas = [r for par in hreflang.PAREJAS for r in par]
for ruta in rutas:
    rel = f"{ruta}index.html"
    h = head((RAIZ / rel).read_text(encoding="utf-8"))
    base = head(subprocess.run(["git", "show", f"{REF}:{rel}"], cwd=RAIZ,
                               capture_output=True, text=True, check=True).stdout)
    # (b)
    if ruta in TITLES:
        t = re.search(r"<title>(.*?)</title>", h).group(1)
        if t != TITLES[ruta]:
            fallos.append(f"{ruta}: title «{t}»")
        if ruta in OG_TITLE and meta(h, "property", "og:title") != TITLES[ruta]:
            fallos.append(f"{ruta}: og:title no copia al title")
    if ruta in DESCS:
        if meta(h, "name", "description") != DESCS[ruta]:
            fallos.append(f"{ruta}: description distinta")
        if ruta in OG_DESC and meta(h, "property", "og:description") != DESCS[ruta]:
            fallos.append(f"{ruta}: og:description no copia a la description")
    # (c)
    if lineas_estables(h, ruta) != lineas_estables(base, ruta):
        fallos.append(f"{ruta or '/'}: resto del head distinto de {REF}")

for x in fallos:
    print("FALLO", x)
print(f"comprobar-hreflang: {len(rutas)} páginas, {len(TITLES)} title, {len(DESCS)} description, "
      f"head frente a {REF}: {'OK' if not fallos else str(len(fallos)) + ' fallos'}")
sys.exit(1 if fallos else 0)

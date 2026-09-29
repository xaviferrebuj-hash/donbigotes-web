#!/usr/bin/env python3
"""Bloque hreflang de las parejas España / LATAM (29-sep-2026).

Google no admite «es-419» en hreflang (solo idioma ISO 639-1 + país ISO 3166-1),
así que además de es / es-419 / x-default cada pareja declara los 20 países
hispanohablantes de América apuntando a la versión LATAM.

Uso:
  python3 tools/hreflang.py            reescribe el bloque en las 24 páginas
  python3 tools/hreflang.py --check    solo comprueba (sale con 1 si algo falla)

Pareja nueva: añadirla a PAREJAS (ruta España, ruta LATAM) y ejecutar.
El bloque es la serie contigua de <link rel="alternate" hreflang=...> del head;
se sustituye entera y queda idéntica en las dos páginas de la pareja.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DOMINIO = "https://donbigotes.app"

# (ruta España, ruta LATAM), relativas a la raíz, con barra final ("" = home)
PAREJAS = [
    ("", "es-419/"),
    ("carta-para-imprimir/", "es-419/carta-para-imprimir/"),
    ("diario-dientes-de-leche/", "es-419/diario-dientes-de-leche/"),
    ("app-raton-perez/", "es-419/app-raton-perez/"),
    ("el-ratoncito-perez-existe/", "es-419/el-ratoncito-perez-existe/"),
    ("certificado-raton-perez/", "es-419/certificado-raton-perez/"),
    ("diploma-raton-perez/", "es-419/diploma-raton-perez/"),
    ("comparativa-apps-ratoncito-perez/", "es-419/comparativa-apps-ratoncito-perez/"),
    ("primer-diente/", "es-419/primer-diente/"),
    ("ultimo-diente/", "es-419/ultimo-diente/"),
    ("cuento-ratoncito-perez/", "es-419/cuento-raton-perez/"),
    ("firma-sello-raton-perez/", "es-419/firma-sello-raton-perez/"),
]

PAISES = ["MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
          "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "US"]

RE_BLOQUE = re.compile(
    r'(?:<link rel="alternate" hreflang="[^"]+" href="[^"]+">\n)+')
RE_ALT = re.compile(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">')


def esperado(es, latam):
    """Lista ordenada de (código, href) que debe llevar cada página de la pareja."""
    u_es, u_latam = f"{DOMINIO}/{es}", f"{DOMINIO}/{latam}"
    alts = [("es", u_es), ("es-419", u_latam), ("x-default", u_es)]
    alts += [(f"es-{p}", u_latam) for p in PAISES]
    return alts


def bloque(alts):
    return "".join(f'<link rel="alternate" hreflang="{c}" href="{h}">\n'
                   for c, h in alts)


def archivo(ruta):
    return RAIZ / ruta / "index.html"


def escribir():
    tocadas = 0
    for es, latam in PAREJAS:
        nuevo = bloque(esperado(es, latam))
        for ruta in (es, latam):
            f = archivo(ruta)
            html = f.read_text(encoding="utf-8")
            bloques = RE_BLOQUE.findall(html)
            if len(bloques) != 1:
                sys.exit(f"{f}: {len(bloques)} bloques hreflang (se esperaba 1)")
            if bloques[0] != nuevo:
                f.write_text(html.replace(bloques[0], nuevo, 1), encoding="utf-8")
                tocadas += 1
    print(f"hreflang: {tocadas} páginas reescritas")


def comprobar():
    fallos = []
    for es, latam in PAREJAS:
        alts = esperado(es, latam)
        for ruta in (es, latam):
            f = archivo(ruta)
            html = f.read_text(encoding="utf-8")
            enc = RE_ALT.findall(html.split("</head>")[0])
            codigos = [c for c, _ in enc]
            if len(codigos) != len(set(codigos)):
                fallos.append(f"{ruta or '/'}: hreflang duplicados")
            if enc != alts:
                fallos.append(f"{ruta or '/'}: bloque distinto del esperado "
                              f"({len(enc)} alternates)")
            for c, h in enc:
                if not (h.startswith(DOMINIO + "/") and h.endswith("/")):
                    fallos.append(f"{ruta or '/'}: href no absoluto o sin barra: {h}")
                destino = archivo(h[len(DOMINIO) + 1:])
                if not destino.is_file():
                    fallos.append(f"{ruta or '/'}: {c} apunta a archivo inexistente {h}")
            # canonical = su propia URL, que figura en el bloque (reciprocidad)
            m = re.search(r'<link rel="canonical" href="([^"]+)">', html)
            if not m or m.group(1) != f"{DOMINIO}/{ruta}":
                fallos.append(f"{ruta or '/'}: canonical inesperado")
    for x in fallos:
        print("FALLO", x)
    print(f"hreflang --check: {len(PAREJAS) * 2} páginas, "
          f"{len(esperado('', 'es-419/'))} alternates cada una, "
          f"{'OK' if not fallos else str(len(fallos)) + ' fallos'}")
    return not fallos


if __name__ == "__main__":
    if "--check" in sys.argv:
        sys.exit(0 if comprobar() else 1)
    escribir()

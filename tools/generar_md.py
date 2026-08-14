#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera las versiones markdown (/<ruta>/index.md) de cada página del sitio.

Uso, desde la raíz del repo:  python3 tools/generar_md.py
Regenerar A MANO cada vez que cambie el contenido de una página (ver README).
"""
import os
import re
from html.parser import HTMLParser

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMINIO = "https://donbigotes.app"

# ruta relativa de la carpeta ('' = home) → las 12 páginas publicadas
PAGINAS = [
    "", "app-raton-perez", "carta-para-imprimir", "video-raton-perez",
    "foto-raton-perez", "voz-raton-perez", "viaje-del-diente",
    "certificado-raton-perez", "diploma-raton-perez", "editable",
    "el-ratoncito-perez-existe", "primer-diente", "ultimo-diente",
    "prensa", "fotomontaje-ratoncito-perez",
    "comparativa-apps-ratoncito-perez", "historia-raton-perez",
]

# Subárboles que no aportan contenido textual (interfaz, decoración, formularios)
CLASES_EXCLUIDAS = (
    "gen-overlay", "badges", "honey", "form-ok", "form-legal", "capture", "letter-stage",
    "moon", "spark", "glow", "foot-links", "foot-brand", "nav",
)
TAGS_EXCLUIDOS = {"script", "style", "svg", "form", "noscript", "input",
                  "button", "select", "textarea", "iframe"}
# Bloques cuyo texto se captura (tag, atributo class opcional)
TAGS_BLOQUE = {"h1": "# ", "h2": "## ", "h3": "### ", "p": "", "li": "- ",
               "summary": "**", "figcaption": "", "caption": ""}
# Etiquetas sin cierre: no deben tocar el contador de profundidad excluida
TAGS_VOID = {"img", "br", "meta", "link", "input", "hr", "source", "wbr",
             "area", "col", "embed", "track"}


class Extractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.bloques = []      # lista de líneas markdown
        self.pila_excluir = 0  # profundidad dentro de un subárbol excluido
        self.tag_abierto = None
        self.buffer = []
        self.href = None       # enlace inline abierto dentro de un bloque
        self.en_details = False
        self.en_descargas = False  # dentro de un contenedor .descargas
        self.descarga_href = None
        self.filas = None      # tabla en curso: lista de filas, cada una lista de celdas
        self.fila = None

    @staticmethod
    def _clase(attrs):
        return dict(attrs).get("class", "")

    def _excluido(self, tag, attrs):
        d = dict(attrs)
        if tag in TAGS_EXCLUIDOS:
            return True
        if d.get("aria-hidden") == "true":
            return True
        if "display:none" in d.get("style", "").replace(" ", ""):
            return True
        clases = d.get("class", "").split()
        return any(c in CLASES_EXCLUIDAS for c in clases)

    def handle_starttag(self, tag, attrs):
        if tag in TAGS_VOID:
            if not self.pila_excluir and tag == "br" and self.tag_abierto is not None:
                self.buffer.append(" ")
            return
        if self.pila_excluir:
            self.pila_excluir += 1
            return
        if self._excluido(tag, attrs):
            self.pila_excluir = 1
            return
        if tag == "details":
            self.en_details = True
            return
        if tag == "div" and "descargas" in self._clase(attrs).split():
            self.en_descargas = True
            return
        # botones de descarga: cada enlace del bloque .descargas es un item
        if tag == "a" and self.tag_abierto is None and self.en_descargas:
            self.tag_abierto = "a.descarga"
            self.descarga_href = dict(attrs).get("href")
            self.buffer = []
            return
        if tag == "a" and self.tag_abierto is not None:
            self.href = dict(attrs).get("href")
            self.buffer.append("[")
            return
        if tag == "small" and self.tag_abierto is not None:
            self.buffer.append(" — ")
            return
        if tag == "table":
            self.filas = []
            return
        if tag == "tr" and self.filas is not None:
            self.fila = []
            return
        if tag in ("th", "td") and self.fila is not None:
            self.tag_abierto = tag
            self.buffer = []
            return
        if self.tag_abierto is None:
            if tag in TAGS_BLOQUE:
                self.tag_abierto = tag
                self.buffer = []
            elif tag == "div" and "ans" in self._clase(attrs).split():
                self.tag_abierto = "div.ans"
                self.buffer = []

    def handle_endtag(self, tag):
        if tag in TAGS_VOID:
            return
        if self.pila_excluir:
            self.pila_excluir -= 1
            return
        if tag == "details":
            self.en_details = False
            return
        if tag == "div" and self.en_descargas:
            self.en_descargas = False
            return
        if tag == "a" and self.tag_abierto == "a.descarga":
            texto = re.sub(r"\s+", " ", "".join(self.buffer)).strip()
            url = self.descarga_href or ""
            if url.startswith("/"):
                url = DOMINIO + url
            if texto:
                self.bloques.append(f"- [{texto}]({url})")
            self.tag_abierto = None
            self.descarga_href = None
            self.buffer = []
            return
        if tag == "a" and self.href is not None:
            url = self.href
            if url.startswith("/"):
                url = DOMINIO + url
            self.buffer.append(f"]({url})")
            self.href = None
            return
        if tag in ("th", "td") and self.fila is not None and self.tag_abierto == tag:
            texto = re.sub(r"\s+", " ", "".join(self.buffer)).strip()
            self.fila.append(texto.replace("|", "\\|"))
            self.tag_abierto = None
            self.buffer = []
            return
        if tag == "tr" and self.fila is not None:
            if self.fila:
                self.filas.append(self.fila)
            self.fila = None
            return
        if tag == "table" and self.filas is not None:
            if self.filas:
                ancho = max(len(f) for f in self.filas)
                lineas = ["| " + " | ".join(f + [""] * (ancho - len(f))) + " |"
                          for f in self.filas]
                lineas.insert(1, "| " + " | ".join(["---"] * ancho) + " |")
                self.bloques.append("\n".join(lineas))
            self.filas = None
            return
        if self.tag_abierto and tag == self.tag_abierto.split(".")[0]:
            texto = re.sub(r"\s+", " ", "".join(self.buffer)).strip()
            if texto:
                if self.tag_abierto == "summary":
                    self.bloques.append(f"**{texto}**")
                else:
                    prefijo = TAGS_BLOQUE.get(self.tag_abierto, "")
                    self.bloques.append(prefijo + texto)
            self.tag_abierto = None
            self.buffer = []

    def handle_data(self, data):
        if not self.pila_excluir and self.tag_abierto is not None:
            self.buffer.append(data)


def extraer(ruta_html):
    html = open(ruta_html, encoding="utf-8").read()
    # El head no aporta bloques (title/meta se ignoran: el H1 ya abre el md)
    cuerpo = html[html.index("<body"):] if "<body" in html else html
    ex = Extractor()
    ex.feed(cuerpo)
    return ex.bloques


def generar(pagina):
    carpeta = os.path.join(BASE, pagina) if pagina else BASE
    bloques = extraer(os.path.join(carpeta, "index.html"))
    url = f"{DOMINIO}/{pagina}/" if pagina else f"{DOMINIO}/"
    lineas = []
    for b in bloques:
        # las preguntas en negrita van pegadas a su respuesta
        if lineas and lineas[-1].startswith("**") and not b.startswith(("#", "**", "- ")):
            lineas.append(b)
        else:
            lineas.append(b)
    md = "\n\n".join(lineas)
    md += f"\n\n---\n\n[Versión completa de esta página]({url})\n"
    destino = os.path.join(carpeta, "index.md")
    open(destino, "w", encoding="utf-8").write(md)
    return destino, len(md)


if __name__ == "__main__":
    for p in PAGINAS:
        destino, tam = generar(p)
        print(f"{destino.replace(BASE, '') or '/'}  ({tam} caracteres)")

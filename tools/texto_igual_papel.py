#!/usr/bin/env python3
"""Punto 5 de feature/web-papel: el texto visible (y los JSON-LD) de las 15 páginas construidas es idéntico al de main.
Uso: python3 tools/texto_igual_papel.py <_site de main> <_site de la rama>"""
import sys, re, json
from html.parser import HTMLParser
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from web_papel import PAGINAS
class T(HTMLParser):
    def __init__(s):
        super().__init__(); s.txt = []; s.salta = 0; s.ld = []; s.en_ld = False; s.attrs = []
    def handle_starttag(s, t, a):
        a = dict(a)
        if t in ('script', 'style', 'template'):
            s.salta += 1; s.en_ld = a.get('type') == 'application/ld+json'
        for k in ('alt', 'title', 'aria-label', 'placeholder', 'value', 'content'):
            if k in a and a[k]: s.attrs.append(f'{t}[{k}]={a[k]}')
    def handle_endtag(s, t):
        if t in ('script', 'style', 'template'): s.salta -= 1; s.en_ld = False
    def handle_data(s, d):
        if s.en_ld: s.ld.append(json.loads(d)); return
        if not s.salta: s.txt.append(d)
def lee(f):
    h = open(f, encoding='utf-8').read(); t = T(); t.feed(h)
    return ' '.join(' '.join(t.txt).split()), t.ld, t.attrs, h
mal = 0
for p in PAGINAS:
    a, b = lee(f'{sys.argv[1]}/{p}/index.html'), lee(f'{sys.argv[2]}/{p}/index.html')
    liquid = re.findall(r'\{\{|\{%', b[3])
    ok = a[0] == b[0] and a[1] == b[1] and a[2] == b[2] and not liquid
    faq = [x for x in b[1] if '"FAQPage"' in json.dumps(x)]
    print(('OK   ' if ok else 'MAL  ') + p, f'texto {len(b[0])} car., JSON-LD {len(b[1])} (FAQPage: {len(faq)}), atributos {len(b[2])}, Liquid suelto {len(liquid)}')
    if not ok:
        mal += 1
        if a[0] != b[0]:
            i = next(i for i in range(min(len(a[0]), len(b[0]))) if a[0][i] != b[0][i]) if a[0][:min(len(a[0]),len(b[0]))] != b[0][:min(len(a[0]),len(b[0]))] else min(len(a[0]), len(b[0]))
            print('   main:', a[0][i-60:i+80]); print('   rama:', b[0][i-60:i+80])
        if a[2] != b[2]: print('   atributos:', set(a[2]) ^ set(b[2]))
sys.exit(1 if mal else 0)

import re, json, glob, sys, html
SITE = sys.argv[1].rstrip('/')
def limpio(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).replace(' .', '.').replace(' ,', ',').strip()
mal = 0; pags = 0
for f in sorted(glob.glob(SITE + '/**/index.html', recursive=True)):
    t = open(f).read()
    faqs = [json.loads(b) for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S) if '"FAQPage"' in b]
    if not faqs: continue
    pags += 1
    js = {limpio(q['name']): limpio(q['acceptedAnswer']['text']) for q in faqs[0]['mainEntity']}
    vis = {}
    for q, a in re.findall(r'<details[^>]*>\s*<summary>(.*?)</summary>\s*(.*?)</details>', t, re.S):
        if 'db-menu' in q: continue
        vis[limpio(q)] = limpio(a)
    for q, a in js.items():
        if q not in vis: print('SOLO JSON', f[len(SITE):], q); mal += 1
        elif vis[q].replace(' ', '') != a.replace(' ', '') and not vis[q].replace(' ', '').startswith(a.replace(' ', '')):
            print('DISTINTA', f[len(SITE):], q, '\n   vis:', vis[q][:160], '\n   json:', a[:160]); mal += 1
print('páginas con FAQPage:', pags, '· discrepancias:', mal)

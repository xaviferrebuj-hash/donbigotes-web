# donbigotes.app

Web estática de Don Bigotes (GitHub Pages). HTML plano, sin framework:
cada página vive en su carpeta como `index.html` autocontenido.

## Convenciones

- Nuevas páginas satélite: clonar el patrón de `/voz-raton-perez/`
  (hero nocturno, CTA vía `data-enlace` + `js/enlaces-app.js`, bloque CTA
  desde `_partials/cta-app.html`, FAQ visible + FAQPage JSON-LD).
- El sitemap (`sitemap.xml`) es manual: añadir cada página nueva.
- `llms.txt` guía a los asistentes de IA: mantenerlo al día.

## ⚠️ Versiones markdown (regenerar a mano)

Cada página publica una copia en markdown (`/<ruta>/index.md`) para
crawlers de IA, listada en `llms.txt`. **No se regeneran solas**: tras
cambiar el contenido de cualquier página, ejecutar desde la raíz

```
python3 tools/generar_md.py
```

y commitear los `.md` que cambien. Si se añade una página nueva,
añadir su ruta a la lista `PAGINAS` de `tools/generar_md.py`.

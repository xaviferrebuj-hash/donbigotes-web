# CLAUDE.md — donbigotes-web

## Reglas de trabajo
1. Este clon git es la ÚNICA fuente de verdad de la web. No existe copia en Desktop, ni build.py, ni plantilla.html.
2. Ediciones siempre con str_replace quirúrgico, nunca reescrituras de archivo completo.
3. Commits automáticos con push: commit al completar cada tarea y al cierre de sesión, con mensajes descriptivos en español, seguido SIEMPRE de git push a origin/main en el mismo paso. Un commit sin push no cuenta como tarea cerrada. Antes de terminar cualquier sesión, verificar con git status que main...origin/main está sincronizado.
4. Publicación vía GitHub Pages: el push despliega en 1-2 min. Verificar en producción tras cambios visuales.
5. Tras cambiar cualquier página HTML, regenerar las versiones markdown con tools/generar_md.py (añadir páginas nuevas a la lista PAGINAS).
6. El directorio _partials/ contiene parciales reutilizables (Jekyll no publica directorios con _). CTA de app: _partials/cta-app.html. Enlaces de app centralizados en enlaces-app.js.
7. Formularios web: Web3Forms (endpoint https://api.web3forms.com/submit, access_key pública b43b8fa1-6e3d-428c-9298-24b1dbef4e4a) → entrega a hola@donbigotes.app → reenvío Zoho al Gmail personal de Xavi (no escribir la dirección en ningún archivo del repo). NUNCA exponer emails en el HTML. NUNCA nodoambar. FormSubmit está retirado: no reintroducirlo.
8. No tocar nunca los registros DNS de Zoho Mail (MX, SPF TXT, verificación TXT, CNAME).
9. IndexNow (rastreo acelerado de Bing): clave `7873c101e46b4340be4a8e94c90016ac`, servida en `/7873c101e46b4340be4a8e94c90016ac.txt` en la raíz del repo. No renombrar ni borrar ese archivo: si deja de responder 200, los pings dejan de validarse. Reutilizar esta clave en cada ping, no generar una nueva. Último ping: 2026-07-16, las 13 URLs de sitemap.xml, HTTP 200.

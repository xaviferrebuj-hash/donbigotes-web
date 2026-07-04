# CLAUDE.md — donbigotes-web

## Reglas de trabajo
1. Este clon git es la ÚNICA fuente de verdad de la web. No existe copia en Desktop, ni build.py, ni plantilla.html.
2. Ediciones siempre con str_replace quirúrgico, nunca reescrituras de archivo completo.
3. Commits automáticos con push: commit al completar cada tarea y al cierre de sesión, con mensajes descriptivos en español, seguido SIEMPRE de git push a origin/main en el mismo paso. Un commit sin push no cuenta como tarea cerrada. Antes de terminar cualquier sesión, verificar con git status que main...origin/main está sincronizado.
4. Publicación vía GitHub Pages: el push despliega en 1-2 min. Verificar en producción tras cambios visuales.
5. Tras cambiar cualquier página HTML, regenerar las versiones markdown con tools/generar_md.py (añadir páginas nuevas a la lista PAGINAS).
6. El directorio _partials/ contiene parciales reutilizables (Jekyll no publica directorios con _). CTA de app: _partials/cta-app.html. Enlaces de app centralizados en enlaces-app.js.
7. FormSubmit apunta SIEMPRE a hola@donbigotes.app.
8. No tocar nunca los registros DNS de Zoho Mail (MX, SPF TXT, verificación TXT, CNAME).

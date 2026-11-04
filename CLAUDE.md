# CLAUDE.md — donbigotes-web

**Ítems con disparador (fechas, hitos): `PENDIENTES.md`.**

## Reglas de trabajo
1. Este clon git es la ÚNICA fuente de verdad de la web. No existe copia en Desktop, ni build.py, ni plantilla.html.
2. Ediciones siempre con str_replace quirúrgico, nunca reescrituras de archivo completo.
3. Commits automáticos con push: commit al completar cada tarea y al cierre de sesión, con mensajes descriptivos en español, seguido SIEMPRE de git push a origin/main en el mismo paso. Un commit sin push no cuenta como tarea cerrada. Antes de terminar cualquier sesión, verificar con git status que main...origin/main está sincronizado.
4. Publicación vía GitHub Pages: el push despliega en 1-2 min. Verificar en producción tras cambios visuales.
5. Tras cambiar cualquier página HTML, regenerar las versiones markdown con tools/generar_md.py (añadir páginas nuevas a la lista PAGINAS).
6. El directorio _partials/ contiene parciales reutilizables (Jekyll no publica directorios con _). CTA de app: _partials/cta-app.html. Enlaces de app centralizados en enlaces-app.js.
   ⚠️ **MATIZ (10-ago-2026): _partials/cta-app.html es REFERENCIA CANÓNICA, NO se propaga.** No hay sistema de includes: cada página lleva su **copia inline** del bloque CTA. **Editar el parcial no cambia nada en producción.** Tocar el bloque = editarlo en **todas las copias inline** (lista: `grep -rl --include=index.html 'id="cta-app"' .`) + el propio parcial, y después regenerar los .md con tools/generar_md.py. Inventario y método en BARRIDO-1SEP.md.
7. Formularios web: Web3Forms (endpoint https://api.web3forms.com/submit, access_key pública b43b8fa1-6e3d-428c-9298-24b1dbef4e4a) → entrega a hola@donbigotes.app → reenvío Zoho al Gmail personal de Xavi (no escribir la dirección en ningún archivo del repo). NUNCA exponer el Gmail personal de Xavi ni ninguna dirección privada en el repo. hola@donbigotes.app es el contacto público y puede ir en el HTML como `mailto:`. NUNCA nodoambar. FormSubmit está retirado: no reintroducirlo.
8. No tocar nunca los registros DNS de Zoho Mail (MX, SPF TXT, verificación TXT, CNAME).
9. IndexNow (rastreo acelerado de Bing): clave `7873c101e46b4340be4a8e94c90016ac`, servida en `/7873c101e46b4340be4a8e94c90016ac.txt` en la raíz del repo. No renombrar ni borrar ese archivo: si deja de responder 200, los pings dejan de validarse. Reutilizar esta clave en cada ping, no generar una nueva. El workflow `.github/workflows/indexnow.yml` pinga en cada push **solo** las URLs cuyo `index.html` cambió y los ficheros de `descargas/**`. Los cambios en `llms.txt`, `prensa/kit/**`, `og.png`, `_docs/**` y los `.md` de la raíz no se pingan solos: si hay que notificarlos, ping manual. Historial y verificación de cada ping (HTTP 200): `gh run list --workflow indexnow.yml`.
10. Antes de tocar el repo, comprobar que no hay otro chat de Code abierto sobre él. Si el push falla por commits ajenos, rebase y reportar el hash ajeno.
11. Cada cambio en una pregunta o respuesta de FAQ visible se copia literal a su `FAQPage` (JSON-LD) en el mismo commit: el `FAQPage` es espejo verbatim del texto visible.
12. Plausible no admite propiedades personalizadas sin el plan Business: un evento sin props por variante (p. ej. «Correo dejado — home»).

## Fechas de página
Tres señales de frescura por página, siempre iguales entre sí: `<p class="fecha-actualizacion">`, `dateModified` del JSON-LD y `<lastmod>` del sitemap. Se calculan con la fecha del último commit git de cada `index.html`. El pase de fechas va **solo tras cambios de contenido visible** (regla del 9-sep-2026): un cambio solo de analítica o de metadatos no lleva pase. Procedimiento exacto tras cualquier edición de contenido visible:
1. Commitear el contenido.
2. `bash tools/actualiza-fechas.sh <ruta> [<ruta>...]` — **rutas explícitas, una por página tocada** (p. ej. `bash tools/actualiza-fechas.sh el-ratoncito-perez-existe es-419/el-ratoncito-perez-existe`; la home es `.`). Sin argumentos imprime el uso y sale sin tocar nada; si una ruta no está en el sitemap, aborta antes de escribir.
3. Regenerar los .md: `python3 tools/generar_md.py`.
4. Commit con `[fechas]` en el mensaje. El script ignora los commits con ese marcador al calcular fechas: sin él, la siguiente ejecución tomaría el commit de fechas como edición y desplazaría todas las páginas.
El directorio de scripts es `tools/` (no `tool/`).

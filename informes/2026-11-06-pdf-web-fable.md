# PDF de la web publicada para la revisión de Fable · 6-nov-2026

- **Dónde:** rama huérfana `capturas/web-2026-11-06` de donbigotes-web, sin el código de la web. Nada a main ni a otras ramas. ElevenLabs y fal: 0 créditos. Ni correos ni redes.
- **Capturadas:** las 25 URL del encargo, sobre la web publicada (https://donbigotes.app), con Chromium (Playwright) sin cookies y un contexto limpio por captura. Plausible bloqueado dentro del navegador: su script se respondía en local con un fichero vacío y ninguna petición salió hacia plausible.io. Se hicieron 28 capturas: las 25 en móvil (390×844, página entera, navegador Android) y la 1, la 4 y la 14 también en escritorio (1280×800). La espera fue networkidle, más un recorrido de toda la página para cargar las imágenes diferidas, más las fuentes, más 1 s.
- **Escala:** a deviceScaleFactor 2 el PDF pesaba unos 30 MB, así que se rehízo a **1,5**, como pide el encargo. El escritorio va a 1.
- **PDF:** `web-donbigotes-2026-11-06.pdf`, A4 vertical, **95 páginas** (el índice más 94 trozos), **21,2 MB** (21.210.527 bytes). Lleva en la cabecera «N · URL · móvil/escritorio» y en el pie los datos de Search Console. Todas las páginas superan las 6 pantallas salvo la 24 y la 25, así que van en trozos de unas 3 pantallas. Los cortes caen en franjas vacías, para no partir ninguna línea.
  - En móvil, cada trozo va en dos columnas para que se lea: un texto de 16 px sale a unos 9,6 pt. En una sola tira, saldría a unos 5 pt.
  - En escritorio, va un trozo de 3 pantallas por página (unos 0,31 pt por px).
- **Otros entregables:** `capturas/` con 94 JPEG de calidad 85, uno por cada página del PDF (21 MB). En `herramientas/` están los scripts (`captura.js`, `monta_pdf.py`) y `comprobaciones.json` con el detalle de cada captura.
- **Comprobaciones (las 25):** código **200** en todas, sin redirecciones. **0 errores de consola.** **Sin scroll horizontal a 390 px** (scrollWidth = 390). Tres cosas que no son errores:
  - El adorno `span.moon` sobresale 30 px por la derecha, pero está recortado y no produce scroll.
  - En la 18, la 19 y la 20, el navegador cancela la precarga del audio (ERR_ABORTED). Los tres ficheros existen y responden 206.
  - La 24 corta su salto a la tienda (ver abajo).
- **Ojo:**
  - **24 /carta/ no es el generador.** Es la pasarela del QR de la carta (noindex): en el móvil salta a Google Play a los 800 ms. Se capturó con ese salto bloqueado. El generador está dentro de la home y de las páginas 2, 7, 10, 14, 15, 16 y 22, y sale en su estado inicial.
  - En Android, todas las páginas menos la 1 y la 2 llevan la banda fija «Instalar». En una captura de página entera sale una sola vez, al pie de la primera pantalla.
- **Commits:** `c0a73d8` (PDF, JPEG y scripts) y el de este informe.
- **Falta / bloqueos:** nada del encargo; ningún bloqueo.

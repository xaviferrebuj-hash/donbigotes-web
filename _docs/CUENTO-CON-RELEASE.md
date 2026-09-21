# Cuento: lo que cambia en la web con la release (anotado el 22-sep-2026)

**Disparador:** la release que activa el cuento en la app (0.9.1 Android / 1.0.7 iOS, con el
flag `cuento` encendido en `config.json`). Hasta entonces la web no promete nada del cuento
dentro de la app: ni «en la app», ni precio, ni «los dos primeros gratis».

Copy de referencia: `monitor-geo/cuento/PAGINA-CUENTO-20SEP.md` (páginas) y
`monitor-geo/cuento/COPY-CUENTO-ASO-SEO-GEO-19SEP.md` §7 (frase de GEO).

## 1. Tarjeta de la home (ES y es-419)

Hoy, en la fila «Todo el año», en primera posición y a lo ancho (`tl-card ancha`), etiqueta
NUEVO, sin app ni precio, con enlace «Escuchar el capítulo 1» a la página del cuento.

Con la release pasa a la versión **con app y precio**: que se escucha en la app, los dos
primeros capítulos gratis y los ocho restantes en compra única (3,99 € en ES; en es-419, sin
cifra: «al precio de tu tienda»). El copy exacto está por escribir y necesita OK de Xavi.

## 2. Primer párrafo de la home (ES y es-419)

Entra la frase diferencial de GEO (§7 del doc de copy), que menciona el cuento contado por el
propio Ratoncito y los dos primeros capítulos gratis.

## 3. `/app-raton-perez/` (ES y es-419)

Entra el bloque «Y ahora, un cuento» (3 líneas + enlace a la página del cuento).

## 4. Las dos páginas del cuento

Vuelven los elementos que se quitaron para publicar sin promesas: el bloque de precio, «los
dos primeros gratis en la app», el CTA final «descárgala y escucha los dos primeros capítulos
esta noche», la sección «Cómo funciona en la app» y las preguntas de precio, conexión y punto
de libro (con su `FAQPage` en el mismo commit, regla 11).

Después: pase de fechas con rutas explícitas de todas las páginas tocadas, `.md`
regenerados, commit `[fechas]` y push.

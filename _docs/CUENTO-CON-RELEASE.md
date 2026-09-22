# Cuento: lo que cambia en la web con la release (anotado el 22-sep-2026)

**Disparador:** la release que activa el cuento en la app (0.9.1 Android / 1.0.7 iOS, con el
flag `cuento` encendido en `config.json`). Hasta entonces la web no promete nada del cuento
dentro de la app: ni «en la app», ni precio, ni «los dos primeros gratis».

Copy de referencia: `monitor-geo/cuento/PAGINA-CUENTO-20SEP.md` (páginas) y
`monitor-geo/cuento/COPY-CUENTO-ASO-SEO-GEO-19SEP.md` §7 (frase de GEO).

## 1. Tarjeta de la home (ES y es-419)

Hoy, en la fila «Todo el año», en primera posición y a lo ancho (`tl-card ancha`), etiqueta
NUEVO, sin app ni precio, con enlace «Escuchar el capítulo 1» a la página del cuento.

Con la release pasa a la versión **con app y precio**. Se sustituye solo el `<p>` de la
tarjeta; título, etiqueta y ancho no cambian. Texto aprobado por Xavi (22-sep):

ES (`index.html`):
```html
<p>Diez capítulos de cinco minutos, contados por Don Bigotes con su voz y
sus ilustraciones. Los dos primeros son gratis en la app; la historia
entera, 3,99 € de una vez.
<a href="/cuento-ratoncito-perez/">Escuchar el capítulo 1</a>.</p>
```

es-419 (`es-419/index.html`), **sin cifra a propósito**: el precio cambia por país y poner
euros en una página de LATAM es un error:
```html
<p>Diez capítulos de cinco minutos, contados por Don Bigotes con su voz y
sus ilustraciones. Los dos primeros son gratis en la app; la historia
completa, con un solo pago.
<a href="/es-419/cuento-raton-perez/">Escuchar el capítulo 1</a>.</p>
```

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

## 5. Etiqueta «Nuevo» de la tarjeta: fuera a los 60 días de la release

Si no se le pone fecha de caducidad, se queda ahí para siempre diciendo que algo de hace medio
año es nuevo. El día de la release, apuntar en `PENDIENTES.md` la fecha exacta (release + 60
días) como disparador propio.

Después: pase de fechas con rutas explícitas de todas las páginas tocadas, `.md`
regenerados, commit `[fechas]` y push.

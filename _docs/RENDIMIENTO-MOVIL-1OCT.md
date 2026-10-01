# Rendimiento móvil — referencia antes de sacar las imágenes base64 (1-oct-2026)

Medición en frío (contexto aislado, sin caché) con Chrome DevTools MCP: viewport 412×915 a 2,625x,
móvil y táctil, CPU 4x más lenta, red «Slow 4G». «Botón responde» = momento en que existe
`window.openGen` (antes, tocar «✨ Crear la carta gratis» no hace nada). Tiempos en ms desde el
inicio de la navegación.

## Antes (commit d1d29ea)

| Página | Entorno | HTML (KB transferidos) | HTML descargado | FCP = LCP | CLS | TBT | Botón visible | Botón responde | Total KB | Peticiones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | producción | 394 | 4.274 | 1.564 | 0,033 | 0 | 1.606 | 4.981 | — | — |
| `/` | local gzip | 394 | 4.238 | 1.668 | 0,033 | 0 | 1.665 | 4.927 | 651 | 14 |
| `/editable/` | producción | 413 | 4.497 | 1.624 | 0,085 | 0 | 1.615 | 5.144 | 661 | 12 |
| `/editable/` | local gzip | 413 | 4.290 | 1.392 | 0,085 | 0 | 1.380 | 4.951 | 661 | 12 |

Lighthouse móvil (home, producción): Accesibilidad 75 · Buenas prácticas 100 · SEO 100.
CrUX: sin datos de campo para la home.

Peso de imágenes base64 por página (HTML sin comprimir): home 502 KB, `/editable/`,
`/el-ratoncito-perez-existe/` y `/ultimo-diente/` 531 KB, versiones es-419 299-328 KB, resto de
páginas 42-64 KB (favicon y logo repetidos).

«Local gzip»: servidor estático con gzip y `Cache-Control: max-age=600`, como GitHub Pages.

## Después (rama imagenes-a-archivos, local gzip, mismas condiciones)

Cambio: las 113 imágenes base64 de 25 páginas pasan a apuntar a su archivo idéntico en
`/assets/img/` (9 ya existían; el logo/favicon es nuevo: `logo-don-bigotes.jpg`), y
`carta-gen.js` lleva `fetchpriority="high"` en las 9 páginas con generador. Sin el segundo
cambio el botón solo bajaba a 4.185 ms: el script competía con las imágenes recién separadas.

| Página | HTML (KB) | HTML descargado | FCP = LCP | CLS | TBT | Botón visible | Botón responde | Total KB | Peticiones |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 13 | 647 | 1.424 | 0,068 | 65 | 1.414 | 2.150 | 546 | 19 |
| `/editable/` | 11 | 638 | 1.396 | 0,089 | 60 | 1.412 | 2.130 | 628 | 20 |

CLS de la home: 0,033 → 0,068 (sigue por debajo de 0,1). El JS ahora rellena la fecha de la
carta antes de que llegue la fuente Caveat, y el cambio de fuente mueve más texto.

Capturas a página completa (móvil 412 px) antes/después de `/`, `/editable/`,
`/el-ratoncito-perez-existe/` y `/ultimo-diente/`: misma altura; con las animaciones
congeladas, `/editable/` es idéntica píxel a píxel.

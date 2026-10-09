# Certificado con el nombre (10-oct-2026)

Rama `feature/certificado-con-nombre`. **No se fusiona en `main` hasta que Xavi escriba «publicar certificado»**, y no antes del 22-oct: las páginas están en el experimento de los imprimibles, que se lee el 21-oct.

## Qué hace

Generador del certificado (el Diploma de Valentía del PDF gratuito) con el nombre y la fecha ya escritos, **solo** en `/certificado-raton-perez/` y `/es-419/certificado-raton-perez/`.

Alcance (decisión de Xavi, 10-oct): `/diploma-raton-perez/` y `/es-419/diploma-raton-perez/` quedan **idénticas a `main`**, porque venden el Diploma de Valentía con nombre del Pack Mágico. El generador estuvo en ellas en el primer commit de la rama y se quitó en «Generador solo en certificado».

Bloque nocturno `#dg` en el hero, **encima** de los botones del PDF en blanco (que siguen donde estaban). Antetítulo «Gratis · sin registro», título, texto, campos «Nombre» (máx. 18, mayúscula inicial en cada palabra) y «Fecha» (la de hoy, editable), botón «✨ Crear el certificado» y letra pequeña de privacidad con enlace al PDF en blanco.

Al crear: vista previa del diploma, «Imprimir o guardar en PDF» (`window.print()`), «Cambiar el nombre o la fecha» y pantalla posterior (muestra de voz, tienda según el móvil, pie del Pack Mágico).

## Archivos

| Archivo | Qué es |
|---|---|
| `js/diploma-gen.js` | Lógica. `js/carta-gen.js` no se toca: la muestra de voz y la tienda según el móvil son **copia**; si cambian allí, cambiarlas aquí. |
| `assets/diploma-gen.css` | Estilos del bloque, de la hoja y de la impresión. |
| `assets/img/diploma/diploma-ratoncito-perez.webp` | Fondo ES: `descargas/diploma-ratoncito-perez.pdf` a 300 ppp (2480 × 3508), webp q85, 380 KB. |
| `assets/img/diploma/diploma-raton-de-los-dientes.webp` | Fondo es-419: `descargas/diploma-raton-de-los-dientes.pdf`, igual, 373 KB. |

El fondo solo se descarga al pulsar «Crear el certificado»: no pesa en la carga de la página. El render se hizo con CoreGraphics (script Swift en el scratchpad) y `cwebp -q 85 -m 6 -sharp_yuv`. Ojo: dentro del PDF la ilustración es raster de 1200 × 1792; los 300 ppp afinan el texto y los filetes, no la ilustración.

## Medidas

Coordenadas del PDF en unidades de 794 × 1123 (sacadas del flujo de contenido):

- Línea «Otorgado a:»: y = 549, x 323-617. Nombre en Caveat 700, #1F2A5C, centrado en la línea, 5 cqw de base (≈ 40 unidades), encoge por debajo de 35,2 cqw de ancho (medido con canvas tras cargar la fuente). Con 18 caracteres («Maximiliano Andrés») cabe a 5 cqw sin encoger; el ajuste actúa con letras anchas (mayúsculas, W, M).
- Línea «Fecha:»: y = 742, desde x = 323. Fecha en Caveat 500, mismo color, alineada al principio de la línea (x = 327), 3,8 cqw, encoge por encima de 32 cqw.

Los tamaños van en `cqw` (la hoja es `container-type: inline-size`), así que vista previa e impresión salen iguales.

## Impresión

Al crear, el JS clona la hoja en `#dgImp` (hija directa de `<body>`) y pone la clase `dg-listo` en `<html>`. En `@media print`: `@page { size: A4; margin: 0 }`, todo lo demás del `body` con `display: none` y `#dgImp` a 210 × 296,8 mm. «Cambiar el nombre» quita `dg-listo`. Sin probar en impresora real ni en iPhone real; los PDF de prueba se generan en la nube a partir de esta rama.

## Privacidad

Los campos no tienen `name` (el formulario no puede poner el nombre en la URL), el nombre no va en eventos ni en consola, y la muestra de voz pide `/assets/audio/voz/g/NN.*` por número de grupo (FNV-1a módulo 16), como la carta.

## Eventos de Plausible (sin propiedades)

- «Certificado generado»
- «Preview voz postcertificado»
- «Clic Play Store postcertificado»
- «Clic App Store postcertificado»

`enlaces-app.js` sigue mandando además sus «Clic Play Store» / «Clic App Store» genéricos en esos enlaces, como en la carta.

## Tienda

- App Store: `ct=web-imprimibles` (ES `apps.apple.com/es/app/…`, es-419 `apps.apple.com/app/…`).
- Play: `utm_source=web`, `utm_medium=postcertificado`, `utm_campaign=postcertificado` (es-419: `postcertificado-latam`).

## Pruebas (T2)

Android (412 px), iPhone (390 px) y escritorio (1366 px), emulados con Chrome DevTools, con «Martina», «Valentina», «María José» y «Maximiliano Andrés». Sin errores de consola. Parte de las pruebas («María José» en iPhone y las de escritorio) se hizo en las páginas de diploma, antes del cambio de alcance: el bloque y el script eran los mismos. Tras la primera prueba el nombre bajó de 5,8 a 5 cqw porque los acentos casi tocaban el filete dorado. Capturas: `~/proyectos/Claude outputs/certificado-con-nombre/capturas/`.

T3 (PDF de prueba con Chromium headless) no se hizo en local: 7 swapfiles. Lo hace Claude en la nube desde la rama.

## Pendiente de decisión antes de publicar

1. **Textos que ahora se contradicen**: las FAQ (y su `FAQPage`, regla 11) y el `answer-ready` de las 2 páginas de certificado dicen que el nombre se escribe a mano y que el nombre impreso solo está en la app.
2. **Canibalización con el Pack**: el certificado gratis con nombre es el mismo diploma que el «Diploma de Valentía» que venden las páginas de diploma (por eso allí no va el generador), y el certificado enlaza a esas páginas.
3. **Papel Carta** (LATAM): la hoja es A4; en Carta el navegador la escala.
4. Los `.md` de las 2 páginas incluyen los textos de la pantalla posterior («Tu certificado está listo…»), que en la página solo se ven tras crear el certificado.
5. Al fusionar: pase de fechas de las 2 páginas de certificado (cambio de contenido visible) y regenerar `.md`.

# Cartero Real — es-419 y revisión del IAP en ASC

## 1. Bloque Code: `/es-419/cartero-real/` + hreflang

Ejecutar SOLO después de que `/cartero-real/` (es-ES) esté en producción y con TMview OK.

```
REPO: donbigotes-web

CONTEXTO: /cartero-real/ (es-ES) ya está publicada. Crear la variante es-419 con el patrón
de las páginas es-419 existentes (ruta, head, hreflang, sitemap). Copy en la sección
«Copy /cartero-real/ — es-419» de ~/Desktop/cartero-real-web/copy-cartero-real.md.

TAREA 1 — página
Clonar /cartero-real/index.html → la ruta es-419 que sigan las demás (git ls-files | grep es-419
para confirmar el patrón antes de crear nada). Aplicar íntegro el copy es-419: title, meta, hero,
7 secciones, FAQ. html lang="es-419". Sección plantilla: solo el enlace LATAM
(/descargas/plantilla-carta-reyes-magos-latam.pdf). Sección precio: sin cifra ni «€».
Formulario Web3Forms: hidden origen=cartero-real-latam. JSON-LD: Product SIN price/priceCurrency
(solo availability PreOrder + availabilityStarts 2026-12-01), FAQPage con las 7 respuestas
es-419, BreadcrumbList con la URL es-419.

TAREA 2 — hreflang en ambas
En /cartero-real/ y en la es-419, mismo bloque que usan las demás parejas:
  <link rel="alternate" hreflang="es-ES" href="https://donbigotes.app/cartero-real/">
  <link rel="alternate" hreflang="es-419" href="[URL es-419]">
  <link rel="alternate" hreflang="x-default" href="https://donbigotes.app/cartero-real/">
Canonical de cada una a sí misma.

TAREA 3 — enlaces internos es-419
Footer y enlaces de las páginas es-419 existentes: «Cartero Real» → la es-419 nueva (mismo patrón
con que las es-419 enlazan entre sí). Si /es-419/carta-reyes-magos/ existe, añadirle el bloque
«¿Quieren que los Reyes contesten? Este año, el Ratón Pérez lleva el correo de Oriente» → es-419 nueva.

TAREA 4 — sitemap + IndexNow
sitemap.xml: añadir la URL es-419 (lastmod hoy) y las xhtml:link de hreflang si el sitemap ya las
lleva para las otras parejas. IndexNow: ping con la es-419 y /cartero-real/.

TAREA 5 — comprobaciones
grep -c "€" [es-419] → 0 · grep -c "Ratoncito" [es-419] → 0 · grep -c "vosotros\|móvil" [es-419] → 0 ·
JSON-LD parsea · hreflang recíproco (cada página lista a la otra y a x-default).

TAREA 6 — commit + push
git add -A
git commit -m "Web: /cartero-real/ es-419 + hreflang recíproco, sitemap, IndexNow"
git push

REPORTA: hash · URL es-419 en producción (200) · resultado de los greps. STOP.
```

## 2. IAP `cartero_real_2026` (Apple ID 6809566383) — captura y notas de revisión

### Lo incómodo primero [Probable]
Apple exige que el revisor pueda **llegar a la compra dentro del build**. Con el flag remoto
`cartero_real.enabled=false` y `desde=2026-12-01`, el revisor de la 0.9 (semana del 17-nov) no ve
el Cartero Real → rechazo típico «IAP no localizable» o «Guideline 2.1 — el producto no está
disponible». La entrada de debug (Ajustes → «Cartero Real de prueba») no existe en release.

Salida propuesta (decisión tuya; Code la implementa en 0.9, no ahora):
- **Lanzamiento manual en ASC** («Manually release this version») para la 0.9.
- Durante la revisión: `don-bigotes-config` con `"enabled": true, "desde": "2026-11-15"` (o la fecha
  de envío). El flag solo lo lee la 0.9, que no está publicada, así que ningún usuario real lo ve.
- Aprobada la 0.9: volver a `"desde": "2026-12-01"` en config, esperar a que Pages sirva el JSON
  nuevo, y ENTONCES pulsar «Release». El 1-dic, la 0.9 ya instalada enciende sola el Cartero.
- Play no revisa IAP así; no hace falta nada equivalente.

Riesgo residual: Apple cachea a veces la config leída en su primera apertura; si el revisor abre la
app antes de que el JSON esté en `true`, no lo verá. Mitigación: cambiar config **antes** de enviar
el build a revisión, no después.

### Captura de revisión (campo «Review Information → Screenshot» del IAP)
- Qué mostrar: la pantalla de compra del Cartero Real de la app (la que enseña las 4 piezas y el
  precio 5,99 €), con el botón de compra visible. No sirve una pantalla de la web ni un mockup.
- Cómo obtenerla: simulador iPhone (el 17 que hay abierto vale), build debug de `main`,
  Ajustes → «Cartero Real de prueba» → hasta la pantalla de compra. `xcrun simctl io booted
  screenshot ~/Desktop/cartero-real-web/asc-iap-review.png`.
- Requisitos Apple: PNG o JPG, mínimo 640×920 px, sin texto añadido. El simulador 6,7" da
  1290×2796: válido.
- La captura no se publica: solo la ve el revisor.

### Texto para «Review Notes» del IAP (en inglés, ASC)
```
"Cartero Real" is a seasonal, non-consumable purchase (one payment per family) that unlocks the
Three Kings letter experience: the child dictates a letter, the app shows its journey to the Orient
with dated milestones and local notifications, and on 5 January at 20:00 local time the child
receives a reply from King Melchior (personalised letter PDF, his name spoken in audio, a
printable Royal Certificate and an illustration). Everything is generated on-device; no account,
no server, no data leaves the phone.

How to reach it: open the app → home screen → "Cartero Real" card (visible from the date set in
our remote config, which is enabled for this review) → "Escribir la carta" → the purchase sheet
appears after the letter is dictated. Sandbox purchase, then "Restaurar compras" in Ajustes
restores it.
```
Ajustar la ruta («home → card → purchase sheet») a lo que Code confirme de las 5 pantallas de
Fase B antes de pegarlo: no lo he visto en el POCO.

### Metadatos es-ES del IAP ya cargados (7-sep), para no volver a tocarlos
Nombre «Cartero Real» · descripción «Carta a los Reyes con respuesta el 5 de enero» · base ES
5,99 € · 175 países. Falta solo: captura + notas + enviar con la 0.9.

# REDACCIONES — barrido del 1-SEP y acotación a Android

**Insumo del barrido.** Contiene la redacción de reemplazo de **las 61 ocurrencias**
del periodo gratuito, en variante **ES** y **LATAM**, con fichero y línea.

- Generado: **25-ago-2026** (auditoría + adenda «gratis-solo-Android»).
- Medición: `grep` sobre el repo el 25-ago. **Las líneas son orientativas**: localizar
  por patrón de texto, nunca por número de línea.
- Sustituye en detalle a `INVENTARIO-GRATIS-1SEP.md`, que sigue siendo válido como
  checklist de ejecución. **Ese inventario decía 57; el recuento real es 61** (ver
  «Correcciones al inventario» abajo).

## Estado

| | Sitios | Cuándo |
|---|---|---|
| **Aplicado el 25-ago** | 15 sitios / 35 ediciones | ✅ hecho (corte quirúrgico) |
| **Pendiente del 1-sep** | 61 ocurrencias | ⏳ al activar el cobro |

Lo aplicado el 25-ago **no está en las 61**: son puntos de inserción que hoy no dicen
«gratis» (hints del formulario iOS, `form-ok`, `aria-label` del badge, bloque
`#descarga` y `llms.txt`). Las 61 siguen intactas y se barren el 1-sep.

## Decisiones que rigen este fichero

1. **Precio de iOS: SIN cifra.** Siempre «un único pago desde el primer día».
   No se ha verificado el tier en App Store Connect.
2. **4,99 € solo donde ya está, y referido a Android.** No se introduce en sitios nuevos.
3. **El desfase de un día del diploma NO se reabre** (decisión cerrada el 24-ago). Donde
   hoy pone «1 de septiembre» se mantiene literal: solo se le añade la plataforma.
4. **`/certificado-raton-perez/` y su variante LATAM no se tocan** (encargo del 25-ago).
   Sus dos ocurrencias quedan listadas aquí para el 1-sep, pero marcadas 🚫.
5. **FAQPage: manda el copy visible.** Toda edición de una FAQ visible obliga a
   re-sincronizar su JSON-LD en la misma página, en el mismo commit.
6. **`_partials/cta-app.html` no se propaga.** Es referencia canónica: editarlo no cambia
   producción. Tocar el bloque CTA = editar las 19 copias inline + el parcial.
7. Tras tocar cualquier HTML: `python3 tools/generar_md.py`.

## Nota sobre las variantes LATAM

**No hay páginas LATAM en este repo**: los 19 `index.html` son `lang="es"`, versión única.
Las variantes LATAM de aquí **no tienen dónde aplicarse en la web** — sirven para la ficha
de Play es-419, outreach y Pinterest. La divergencia real no es el vocabulario: es que
«4,99 €» no significa nada en México o Argentina, y aparece 34 veces en la web que leen
las familias de los ocho países que cita `/prensa/`. **Pendiente de decisión de Xavi.**

---

# G1 · Lead del bloque CTA — 20 sitios

> **Actual:** `Voz, foto y Diploma de Valentía personalizados. Gratis durante el lanzamiento.`

**ES:** Voz, foto y Diploma de Valentía personalizados. Gratis en Android durante el
lanzamiento; en iPhone, un único pago desde el primer día.

**LATAM:** Voz, foto y Diploma de Valentía personalizados. Gratis en Android durante el
lanzamiento; en iPhone, un solo pago desde el primer día.

**Después del 1-sep (redacción aprobada el 10-ago, ya sin periodo gratuito):**
El Pack Mágico completo, 4,99 € en un único pago.

### Sitios (20)

| Fichero | Línea | Nota |
|---|---|---|
| `_partials/cta-app.html` | 34 | **primero** — referencia canónica, no propaga |
| `index.html` | 300 | |
| `primer-diente/index.html` | 269 | |
| `ultimo-diente/index.html` | 269 | |
| `editable/index.html` | 276 | |
| `el-ratoncito-perez-existe/index.html` | 270 | |
| `foto-raton-perez/index.html` | 353 | |
| `voz-raton-perez/index.html` | 363 | |
| `video-raton-perez/index.html` | 361 | |
| `viaje-del-diente/index.html` | 360 | |
| `certificado-raton-perez/index.html` | 347 | 🚫 no tocar (regla 4) |
| `diploma-raton-perez/index.html` | 338 | |
| `historia-raton-perez/index.html` | 303 | |
| `prensa/index.html` | 271 | |
| `app-raton-perez/index.html` | 363 | |
| `firma-sello-raton-perez/index.html` | 392 | |
| `cumpleanos-raton-perez/index.html` | 317 | |
| `carta-para-imprimir/index.html` | 306 | variante con estilo inline, sin clase `lead` |
| `fotomontaje-ratoncito-perez/index.html` | 273 | variante inline · dice «Voz, foto del «¡Pillado!» y Diploma…» |
| `comparativa-apps-ratoncito-perez/index.html` | 373 | variante inline **fechada** (ver G1-bis) |

### G1-bis · Variante fechada de la comparativa

> **Actual (`comparativa:373`):** `Carta con su nombre, nota de voz, fotomontaje «¡Pillado!», Diploma de Valentía y vídeo desde la Oficina. Gratis hasta el 1 de septiembre de 2026.`

**ES:** Carta con su nombre, nota de voz, fotomontaje «¡Pillado!», Diploma de Valentía y
vídeo desde la Oficina. Gratis en Android hasta el 1 de septiembre de 2026; en iPhone, un
único pago desde el primer día.

**LATAM:** …Gratis en Android hasta el 1 de septiembre de 2026; en iPhone, un solo pago
desde el primer día.

---

# G2 · hero-note — 8 sitios

> **Actual:** `Gratis durante el lanzamiento · [claim propio de la página] · Hecho/a en España`

**ES:** Gratis en Android durante el lanzamiento · [claim] · Hecho/a en España

**LATAM:** idéntica (vocabulario ya neutro).

⚠️ **El 1-sep el hero-note no puede quedarse con dos claims:** al caer la gratuidad hay
que rellenar el hueco. Redacción sugerida: `4,99 € pago único · [claim] · Hecho/a en España`.

### Sitios (8)

| Fichero | Línea | Claim que acompaña |
|---|---|---|
| `foto-raton-perez/index.html` | 231 | Tus fotos no salen de tu móvil · Hecha en España |
| `video-raton-perez/index.html` | 234 | Sin esperas · Hecho en España |
| `voz-raton-perez/index.html` | 236 | Al instante · Hecho en España |
| `certificado-raton-perez/index.html` | 246 | 🚫 no tocar (regla 4) |
| `viaje-del-diente/index.html` | 259 | Al instante · Hecho en España |
| `app-raton-perez/index.html` | 231 | Tus fotos no salen de tu móvil · Hecha en España |
| `firma-sello-raton-perez/index.html` | 260 | Al instante · Hecho en España |
| `diploma-raton-perez/index.html` | 245 | **variante fechada** (ver G2-bis) |

### G2-bis · hero-note del diploma

> **Actual (`diploma:245`):** `Incluido en el Pack Mágico · Gratis hasta el 1 de septiembre`

**ES / LATAM:** Incluido en el Pack Mágico · Gratis en Android hasta el 1 de septiembre

*(Se mantiene «1 de septiembre» literal: regla 3.)*

---

# G3 · Metas description / og:description — 5

⚠️ **Mantener `description` ≤ 155 caracteres.** Afecta a los snippets de Google.

### `voz-raton-perez` — líneas 7 (description) y 13 (og:description)

> **Actual:** `El Ratoncito Pérez le habla a tu hijo por su nombre. Crea su mensaje de voz personalizado desde el móvil, al instante. Gratis durante el lanzamiento.`

**ES (152 car.):** El Ratoncito Pérez le habla a tu hijo por su nombre. Crea su mensaje de
voz personalizado desde el móvil, al instante. Gratis en Android hasta el 31-ago.

**LATAM:** …desde el celular, al instante. Gratis en Android hasta el 31-ago.

**Después del 1-sep:** …al instante. Pack Mágico, 4,99 € en un único pago.

### `video-raton-perez` — líneas 7 y 13

> **Actual (:7):** `Crea un vídeo del Ratoncito Pérez en la habitación de tu hijo desde el móvil, en minutos y sin esperas. Personalizado, gratis durante el lanzamiento.`
> **Actual (:13):** `…en minutos y sin esperas. Gratis durante el lanzamiento.`

**ES (150 car.):** Crea un vídeo del Ratoncito Pérez en la habitación de tu hijo desde el
móvil, en minutos y sin esperas. Personalizado. Gratis en Android hasta el 31-ago.

**LATAM:** …desde el celular, en minutos y sin esperas. Personalizado. Gratis en Android
hasta el 31-ago. *(«video» sin tilde.)*

### `foto-raton-perez` — línea 13 (solo og:description)

> **Actual:** `Crea la foto imposible del Ratoncito Pérez junto a tu hijo dormido. El montaje se hace en tu móvil. Gratis durante el lanzamiento.`

**ES:** Crea la foto imposible del Ratoncito Pérez junto a tu hijo dormido. El montaje se
hace en tu móvil. Gratis en Android hasta el 31-ago.

**LATAM:** …El montaje se hace en tu celular. Gratis en Android hasta el 31-ago.

---

# G4 · Bloques de precio en sección — 4

> **Actual:** `Gratis durante el lanzamiento. Después, el Pack Mágico completo por 4,99 € de pago único, sin suscripciones.`

**ES:** Gratis en Android durante el lanzamiento. Después, el Pack Mágico completo por
4,99 € de pago único, sin suscripciones. En iPhone, un único pago desde el primer día.

**LATAM:** Gratis en Android durante el lanzamiento. Después, el Pack Mágico completo en
un solo pago, sin suscripciones. En iPhone, un solo pago desde el primer día.

**Después del 1-sep:** El Pack Mágico completo por 4,99 € de pago único, sin suscripciones.

### Sitios (4)

- `foto-raton-perez/index.html:292`
- `video-raton-perez/index.html:300`
- `voz-raton-perez/index.html:302`
- `app-raton-perez/index.html:308`

---

# G5 · FAQ visible + espejo JSON-LD — 8 pares (16 ocurrencias)

🔴 **Los dos lados del par se editan en el mismo commit.** El copy visible manda.

| # | Página | FAQ visible | JSON-LD |
|---|---|---|---|
| 1 | `foto-raton-perez` | :322 | :208 |
| 2 | `video-raton-perez` | :330 | :211 |
| 3 | `voz-raton-perez` | :332 | :212 |
| 4 | `app-raton-perez` | :343 | :208 |
| 5 | `fotomontaje-ratoncito-perez` | :362 | :50 |
| 6 | `diploma-raton-perez` | :310 | :221 |
| 7 | `comparativa-apps-ratoncito-perez` | :412 | :40 |
| 8 | `cumpleanos-raton-perez` | :300 | :214 |

⚠️ **El par 8 faltaba en `INVENTARIO-GRATIS-1SEP.md`** (que listaba 7). Es la página más
orientada a GEO del sitio.

### 5.1 · «¿Es gratis?» — pares 1, 2, 3 (foto · video · voz)

> **Actual:** `Sí, gratis durante el lanzamiento. Después, el Pack Mágico completo cuesta 4,99 € en un único pago, sin suscripciones.`

**ES:** En Android, sí: el Pack Mágico es gratis durante el lanzamiento, hasta el 31 de
agosto de 2026, y después cuesta 4,99 € en un único pago, sin suscripciones. En iPhone el
Pack Mágico se paga desde el primer día: no hay periodo gratuito. La carta en PDF es
gratis siempre, en los dos sistemas.

**LATAM:** En Android, sí: el Pack Mágico es gratis durante el lanzamiento, hasta el 31 de
agosto de 2026, y después se paga una sola vez, sin suscripciones. En iPhone se paga desde
el primer día: no hay periodo gratuito. La carta en PDF es gratis siempre, en los dos
sistemas.

**Después del 1-sep (redacción aprobada el 10-ago):** La carta personalizada es gratis
siempre. El Pack Mágico completo cuesta 4,99 € en un único pago, sin suscripciones.

### 5.2 · «¿La app es gratis?» — par 4 (`app-raton-perez`)

> **Actual:** `Sí. Puedes usarla gratis durante el lanzamiento. Después, el Pack Mágico completo cuesta 4,99 € en un único pago, sin suscripciones.`

**ES:** La app se descarga gratis en los dos sistemas y la carta personalizada es gratis
siempre. El Pack Mágico completo es gratis en Android hasta el 31 de agosto de 2026 y
después cuesta 4,99 € en un único pago; en iPhone se paga desde el primer día, en un único
pago. Sin suscripciones.

**LATAM:** La app se descarga gratis en los dos sistemas y la carta personalizada es gratis
siempre. El Pack Mágico completo es gratis en Android hasta el 31 de agosto de 2026 y
después se paga una sola vez; en iPhone se paga desde el primer día. Sin suscripciones.

### 5.3 · «¿Es gratis el fotomontaje…?» — par 5 (`fotomontaje`)

> **Actual:** `La app se descarga gratis y el fotomontaje «¡Pillado!» forma parte del Pack Mágico, gratis durante el lanzamiento. No hay que registrarse ni dejar datos para usarlo.`

**ES:** La app se descarga gratis y el fotomontaje «¡Pillado!» forma parte del Pack Mágico:
gratis en Android hasta el 31 de agosto de 2026 y, después, 4,99 € en un único pago. En
iPhone el Pack Mágico se paga desde el primer día. No hay que registrarse ni dejar datos
para usarlo.

**LATAM:** …gratis en Android hasta el 31 de agosto de 2026 y, después, un solo pago. En
iPhone se paga desde el primer día. No hay que registrarse ni dejar datos para usarlo.

### 5.4 · «¿Cuánto cuesta el diploma?» — par 6 (`diploma`)

> **Actual:** `Está incluido en el Pack Mágico de la app Don Bigotes, gratis hasta el 1 de septiembre de 2026.`

**ES:** Está incluido en el Pack Mágico de la app Don Bigotes: en Android, gratis hasta el
1 de septiembre de 2026; en iPhone, de pago desde el primer día. El diploma en PDF para
imprimir es gratis siempre.

**LATAM:** idéntica. *(Se mantiene «1 de septiembre» literal: regla 3.)*

### 5.5 · «¿Hay apps gratis del Ratoncito Pérez?» — par 7 (`comparativa`)

> **Fragmento actual:** `…su Pack Mágico cuesta 4,99 € de pago único y está gratis hasta el 1 de septiembre de 2026.`

**ES:** …su Pack Mágico cuesta 4,99 € de pago único y está gratis **en Android** hasta el 1
de septiembre de 2026; **en iPhone se paga desde el primer día**.

**LATAM:** …su Pack Mágico se paga una sola vez y está gratis en Android hasta el 1 de
septiembre de 2026; en iPhone se paga desde el primer día.

*(El resto de la respuesta —datos de terceros— no se toca.)*

### 5.6 · «¿La felicitación de cumpleaños es de pago?» — par 8 (`cumpleanos`)

> **Actual:** `La felicitación forma parte de la experiencia de la app. Durante el periodo de lanzamiento, el Pack Mágico completo de Don Bigotes es gratuito.`

**ES:** La felicitación forma parte del Pack Mágico. En Android es gratuita durante el
periodo de lanzamiento, hasta el 31 de agosto de 2026; después, el Pack Mágico cuesta
4,99 € en un único pago. En iPhone el Pack Mágico se paga desde el primer día.

**LATAM:** La felicitación forma parte del Pack Mágico. En Android es gratuita durante el
periodo de lanzamiento, hasta el 31 de agosto de 2026; después, el Pack Mágico se paga una
sola vez. En iPhone se paga desde el primer día.

---

# G6 · Micro-claims y prosa — 8

### 6.1 · `historia-raton-perez:271` (micro)

> **Actual:** `Sin registro · Se procesa en tu móvil · Gratis durante el lanzamiento`

**ES:** Sin registro · Se procesa en tu móvil · Gratis en Android durante el lanzamiento
**LATAM:** Sin registro · Se procesa en tu celular · Gratis en Android durante el lanzamiento

### 6.2 · `historia-raton-perez:355` (prosa)

> **Fragmento actual:** `…espera en la app Don Bigotes, gratis durante el lanzamiento.`

**ES:** …espera en la app Don Bigotes, gratis en Android durante el lanzamiento.
**LATAM:** idéntica.

### 6.3 · `fotomontaje-ratoncito-perez:249` (micro)

> **Actual:** `Sin registro · Se procesa en tu móvil · Gratis durante el lanzamiento`

Misma redacción que 6.1.

### 6.4 · `comparativa:254` (micro fechada)

> **Actual:** `Sin registro · Carta gratis en PDF · Pack Mágico gratis hasta el 1 de septiembre de 2026`

**ES / LATAM:** Sin registro · Carta gratis en PDF · Pack Mágico gratis **en Android** hasta
el 1 de septiembre de 2026

### 6.5 · `comparativa:290` (celda de precio de la tabla)

> **Actual:** `Pack Mágico gratis hasta el 1-sep-2026; después 4,99 € (pago único)`

**ES:** Pack Mágico 4,99 € (pago único) — gratis **en Android** hasta el 1-sep-2026; en iOS,
de pago desde el primer día

**LATAM:** Pack Mágico de pago único — gratis en Android hasta el 1-sep-2026; en iOS, de
pago desde el primer día

### 6.5-bis · `comparativa:291` (celda de plataforma — sin «gratis», no cuenta en las 61)

> **Actual:** `Android · <small>iOS: disponible en septiembre</small>`

**ES / LATAM:** Android · *iOS: en septiembre, sin periodo gratuito*

### 6.6 · `/prensa/` — líneas 242, 248 y 251

🔒 **Decisión del 10-ago: la nota de prensa NO se reescribe.** Es un documento histórico
fechado (julio 2026). Se le añade **una sola línea de contexto** en cabecera:

> *Nota de prensa del lanzamiento (julio 2026). El Pack Mágico pasó a ser de pago el
> 1-sep-2026. El periodo gratuito fue solo de Android; en iPhone el Pack Mágico se paga
> desde el primer día.*

Ocurrencias que la línea cubre, sin tocar el cuerpo:

- `prensa/index.html:242` — «La carta es gratuita y el Pack Mágico completo sigue gratis durante el lanzamiento.»
- `prensa/index.html:248` — «el Pack Mágico —gratuito durante el lanzamiento— convierte a Don Bigotes…»
- `prensa/index.html:251` — «el Pack Mágico completo es gratis durante el periodo de lanzamiento.»

---

# G7 · Aplicado el 25-ago (corte quirúrgico) — 15 sitios, 35 ediciones

No forman parte de las 61: hoy no dicen «gratis». Son los puntos donde un usuario de iPhone
**actúa** (deja su email) y donde el error se propaga a los buscadores IA.

### 7.1 · Hint del formulario iOS — 9 sitios ✅

> **Antes:** `¿Tienes iPhone? <b>Te avisamos cuando el Ratoncito llegue a la App Store.</b>`

**ES (aplicado):** ¿Tienes iPhone? **Te avisamos cuando el Ratoncito llegue a la App
Store.** En iPhone el Pack Mágico se paga desde el primer día, en un único pago: el
lanzamiento gratis es solo de Android.

**LATAM:** …En iPhone el Pack Mágico se paga desde el primer día, en un solo pago: el
lanzamiento gratis es solo de Android.

`index.html:449` · `el-ratoncito-perez-existe:363,397` · `ultimo-diente:362,395` ·
`editable:369,403` · `primer-diente:362,395`

### 7.2 · `form-ok` (confirmación tras enviar) — 9 sitios ✅

> **Antes:** `¡Hecho! Te escribiremos cuando Don Bigotes llegue a la App Store. ✨`

**ES (aplicado):** ¡Hecho! Te escribiremos cuando Don Bigotes llegue a la App Store. En
iPhone el Pack Mágico se paga desde el primer día. ✨

**LATAM:** idéntica.

Mismas 5 páginas, junto a cada hint.

### 7.3 · `aria-label` del badge «Muy pronto en App Store» — 10 sitios ✅

> **Antes:** `Muy pronto en App Store: déjanos tu contacto y te avisamos`

**ES (aplicado):** Muy pronto en App Store: déjanos tu contacto y te avisamos. En iPhone el
Pack Mágico se paga desde el primer día

⚠️ **Alcance: solo las 5 páginas con formulario** (2 badges cada una). Los **19 badges
restantes** del resto del sitio conservan el `aria-label` antiguo; apuntan a `/#cap2`, es
decir al formulario de la home, que sí lleva el aviso. Se unifican el 1-sep.

### 7.4 · Bloque `#descarga` — 5 sitios ✅

> **Antes:** `Para Android hoy; muy pronto también en iPhone.`

**ES (aplicado):** Para Android hoy, con el Pack Mágico gratis hasta el 31 de agosto de
2026. Muy pronto también en iPhone, donde el Pack Mágico será de pago desde el primer día.

**LATAM:** …Muy pronto también en iPhone, donde el Pack Mágico se paga desde el primer día.

`index.html:420` · `el-ratoncito-perez-existe:357` · `ultimo-diente:356` ·
`editable:363` · `primer-diente:356`

⚠️ **Esta redacción caduca el 31-ago** y entra en el barrido del 1-sep:
**ES:** *Para Android hoy; muy pronto también en iPhone. El Pack Mágico, 4,99 € en un
único pago.*

### 7.5 · `llms.txt` ✅

Línea 11:

> **Antes:** `- Descargar la app Don Bigotes (Android) con el Pack Mágico completo`
> **Después:** `- Descargar la app Don Bigotes (Android hoy; iPhone en septiembre) con el Pack Mágico completo`

Bloque nuevo `## Precios y plataformas`, insertado antes de `## Notas`. **Caduca el 31-ago:**
el 1-sep hay que quitar la línea de Android gratis y dejar el precio en firme.

**Variante LATAM del bloque** (para Play es-419 / outreach, no aplicable a este repo):
sustituir la línea del precio por *«El Pack Mágico se cobra en un único pago; el precio lo
fija tu tienda según el país»* y «vídeo» → «video».

---

# Correcciones al inventario del 23-ago

1. **Son 61 ocurrencias, no 57.** El patrón original no capturaba «periodo de lanzamiento»:
   faltaban `cumpleanos:214`, `cumpleanos:300` y `prensa:251`.
2. **Los pares FAQ/JSON-LD son 8, no 7.** Faltaba `cumpleanos-raton-perez` (300 / 214).
3. **`comparativa:290`** (celda de precio de la tabla) no estaba listada en el bloque F.

# Lo que ya está bien y no hay que tocar

- Los **22 bloques JSON-LD `SoftwareApplication`** declaran `"operatingSystem":"Android"`.
  La acotación de plataforma ya existe en el structured data. **El 1-sep, si iOS ya está
  publicado, hay que añadir un segundo `SoftwareApplication` con `operatingSystem: iOS`.**
- Las **7 cápsulas GEO** (`voz:244`, `video:242`, `fotomontaje:265`, `historia:289`,
  `viaje:262`, `comparativa:260`, `cumpleanos`) no mencionan la gratuidad y ya dicen
  «Google Play». **Sin acción.**
- `js/enlaces-app.js` mantiene `appstore: null`, así que el badge con `data-enlace="appstore"`
  se oculta solo. Los badges «Muy pronto en App Store» son otra cosa: `<a class="badge">`
  hacia `#cap2`/`#cap3`, sin `data-enlace`. **No se ocultan solos.**

# Fuera del repo — revisa Xavi el 1-sep

- **YouTube**: el Short `df9ZN1s9TVg` dice «Gratis durante el lanzamiento» (verificado
  23-ago). Revisar todo el canal.
- **Ficha de Play (es-ES + es-419)**: si menciona el modo gratuito. Si hay una edición «en
  revisión» el 1-sep, no encolar otra sin veredicto.
- **Pinterest**: descripciones de los pines.
- **Comunicae**: nota ya distribuida, no editable — sin acción.

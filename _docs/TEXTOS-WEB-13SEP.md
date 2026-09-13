# Textos web pendientes — 13-sep-2026

Cuatro encargos del BACKLOG §3, listos para Code por `str_replace` sobre este clon. Orden: editar →
commit → `tools/actualiza-fechas.sh <rutas>` → commit `[fechas]` → push → IndexNow.

- A. `/certificado-raton-perez/`: quitar la contradicción H1 «Diploma» vs title «Certificado».
- B. Answer-ready en `/video-raton-perez/`, `/voz-raton-perez/`, `/foto-raton-perez/` (Idea 5).
- C. Borrador es-419 de `/comparativa-apps-ratoncito-perez/`.
- D. Borrador es-419 de `/primer-diente/`.
- (El borrador es-419 del diploma ya existe: `BORRADOR-ES419-DIPLOMA.md`. Se crea junto con C y D.)

---

## A. `/certificado-raton-perez/` — una página, un nombre

Diagnóstico (GSC 9-sep): `diploma ratoncito pérez` aterriza aquí y no en `/diploma-raton-perez/` porque
esta página dice «Diploma» en eyebrow, H1, sub, CTA, alt y 3 FAQ. Regla: **aquí «certificado»; «diploma»
solo en el enlace cruzado**. Los dos PDF se llaman `diploma-*.pdf`: no se renombran (enlaces vivos).

| Dónde | Ahora | Nuevo |
|---|---|---|
| `<span class="eyebrow">` hero | `Diploma de Valentía` | `Certificado gratis` |
| `<h1>` | `Certificado del Ratoncito Pérez: el Diploma de Valentía` | `Certificado del Ratón Pérez por su primer diente` |
| `<p class="sub">` | `…se merece algo más que una moneda: un Diploma de Valentía oficial de la Oficina del Ratoncito, con su nombre, la fecha y su título de Guardián o Guardiana de Sonrisas. Con Don Bigotes lo tienes listo en un minuto, para imprimir o enseñar en el móvil.` | `…se merece algo más que una moneda: un certificado oficial de la Oficina del Ratoncito, con su nombre, la fecha y su título de Guardián o Guardiana de Sonrisas. Gratis en PDF para rellenar a mano; y, con la app Don Bigotes, con su nombre ya impreso en un minuto.` |
| CTA `hero-cta` | `✨ Crear su diploma en la app` | `✨ Crear su certificado en la app` |
| `alt` de `.diploma-img` | `Diploma de Valentía de la Oficina del Ratoncito Pérez, personalizado con el nombre del niño` | `Certificado del Ratón Pérez de la Oficina del Ratoncito, con el nombre del niño y el sello` |
| eyebrow sección 2 | `Qué incluye el diploma` | `Qué incluye el certificado` |
| «Cuándo entregarlo» p | `…y el diploma alarga la magia un día entero.` | `…y el certificado alarga la magia un día entero.` |
| «Imprimir o en el móvil» p | `El diploma está pensado para las dos cosas…` | `El certificado está pensado para las dos cosas…` |
| FAQ `¿Puedo añadir la foto de mi hijo al diploma?` | | `¿Puedo añadir la foto de mi hijo al certificado?` (respuesta igual) |
| FAQ `¿El diploma se puede imprimir?` | | `¿El certificado se puede imprimir?` (respuesta igual) |
| FAQ `¿Cómo consigo un certificado del Ratoncito Pérez personalizado?` | `…en un minuto tienes el <a href="/diploma-raton-perez/">Diploma de Valentía</a>…` | dejar el enlace: es el **único** sitio donde se dice «Diploma de Valentía», y es a propósito |
| `.lead` del bloque app | `Voz, foto y Diploma de Valentía personalizados…` | bloque replicado en todas las páginas (BARRIDO-1SEP): **no tocar aquí** |
| JSON-LD FAQPage | | replicar los dos cambios de pregunta |
| Nuevo, tras «Imprimir o en el móvil» | — | `<p>¿Buscas el <a href="/diploma-raton-perez/">Diploma de Valentía</a> con su nombre y su diente ya impresos? Es otra página: este es el certificado gratis para rellenar a mano.</p>` |

Title y meta no cambian (aplicados el 11-sep; se miden el 30-sep). `grep -ci diploma` esperado tras el
cambio: 6 (2 hrefs de PDF, clase CSS `.diploma-img` ×2, el enlace de la FAQ, el párrafo nuevo, el `.lead`).

## B. Answer-ready (respuesta directa en el primer párrafo)

Patrón: el **primer `<p>` del hero** (el que va antes del CTA) pasa a ser la respuesta a la pregunta que
trae a la gente («cómo conseguir X del Ratoncito Pérez con el nombre del niño»), 45-60 palabras, con
claim → cómo → dónde. El párrafo answer-ready que hoy va **después** del CTA en vídeo y voz **se elimina**
(repetía lo mismo). En foto no existía: se crea. El resto de la página, igual.

### `/video-raton-perez/` — primer `<p>` del hero
Ahora: `Sorpréndele con un vídeo en el que el Ratoncito Pérez, en su Oficina, prepara la visita de esta noche y dice el nombre de tu peque si está entre los más de 200 grabados; si no, dice «Ya sé quién eres» y la historia sigue igual. Se crea en la app, en tu móvil, en un minuto, y lo tienes listo para enseñárselo por la mañana.`

Nuevo: `Para conseguir un vídeo del Ratoncito Pérez con el nombre de tu hijo no hay que encargarlo ni esperar: la app Don Bigotes (Google Play y App Store) lo crea en tu móvil en un minuto. El Ratoncito, desde su Oficina, prepara la visita de esta noche y dice su nombre si está entre los más de 200 grabados; si no, dice «Ya sé quién eres». El nombre no sale del móvil.`

Eliminar el `<p>` que empieza por `Para conseguir un vídeo del Ratoncito Pérez con el nombre de tu hijo se usa una app…` (el de después del CTA).

### `/voz-raton-perez/` — primer `<p>` del hero
Ahora: `Con Don Bigotes creas en segundos una nota de voz del Ratoncito Pérez que pronuncia el nombre de tu hijo: voz grabada con más de 200 nombres, se reproduce sin conexión y el nombre nunca sale de tu móvil. Si el suyo no está, el Ratoncito le llama «cariño»; lo escuchas antes de pagar. La única de las seis apps verificadas en julio de 2026 que reúne voz, carta, fotomontaje, vídeo y diploma.`

Nuevo: `Para conseguir una nota de voz del Ratoncito Pérez que diga el nombre de tu hijo se usa la app Don Bigotes (Google Play y App Store): la crea en segundos con voz grabada de más de 200 nombres, se reproduce sin conexión y el nombre nunca sale del móvil. Si el suyo no está, el Ratoncito le llama «cariño», y lo escuchas antes de pagar. Es la única app verificada que reúne voz, carta, fotomontaje, vídeo y diploma.`

Eliminar el `<p>` que empieza por `Para conseguir una nota de voz del Ratoncito Pérez con el nombre de tu hijo se usa una app…` (el de después del CTA).

### `/foto-raton-perez/` — primer `<p>` del hero
Ahora: `Crea la foto imposible: el Ratoncito Pérez «pillado» en plena visita, junto a tu peque dormido. La montas tú en el móvil en un momento, y la foto de tu hijo nunca sale de tu dispositivo.`

Nuevo: `Para hacer una foto del Ratoncito Pérez en tu casa, junto a tu hijo dormido, se usa la app Don Bigotes (Google Play y App Store): eliges una foto de la habitación, colocas al Ratoncito «pillado» en plena visita y la guardas, en un momento. El montaje se hace dentro de tu móvil; la foto de tu hijo no se sube a ningún servidor.`

Comprobación: en las tres páginas el primer `<p>` visible tras el H1 empieza por «Para …». Sin cambios en
title, meta, H1 ni JSON-LD.

---

## C. Borrador es-419 — `/es-419/comparativa-apps-ratoncito-perez/`

**BORRADOR. Decide Xavi.** Origen: `/comparativa-apps-ratoncito-perez/` (verificada 10-sep-2026).
Reglas LATAM de `BORRADOR-ES419-DIPLOMA.md` (Ratón Pérez + «el Ratón de los Dientes» en la primera
mención, ustedes, celular, sin «€» ni cifras nuestras). ⚠️ Honestidad obligatoria: la comparativa se hizo
**desde Google Play España**; la disponibilidad y los precios de terceros en cada país de LATAM **no se
han verificado**. Se dice en la página. Los precios de terceros se dan como tipo de cobro, sin cifra.
Comprobaciones antes de publicar: `grep -c "€"` → 0 · `grep -ci "vosotros\|móvil\|rellenar"` → 0.

### Head
```
<html lang="es-419">
<title>Apps del Ratón Pérez: comparativa 2026 | Don Bigotes</title>
<meta name="description" content="Comparativa de apps del Ratón Pérez (el Ratón de los Dientes): carta con nombre, nota de voz, video, fotomontaje, diploma y tipo de cobro. Datos de las fichas públicas de cada app.">
<link rel="canonical" href="https://donbigotes.app/es-419/comparativa-apps-ratoncito-perez/">
hreflang: es-419 ↔ es (misma pareja que el resto de es-419)
```

### Hero
Eyebrow: `Comparativa verificada`
H1: `Apps del Ratón Pérez: comparativa (2026)`
Sub: `Qué hace de verdad cada aplicación del Ratón Pérez (el Ratón de los Dientes): carta con el nombre, nota de voz, video, fotomontaje, diploma, tipo de cobro y plataforma. Fila a fila, con lo que dice su ficha pública.`
CTA: `✨ Probar Don Bigotes`
Línea bajo CTA: `Sin registro · Carta gratis en PDF · Pack Mágico de pago único`

Cápsula answer-ready:
`¿Qué apps del Ratón Pérez existen? En septiembre de 2026 hay tres apps activas en Google Play (más una del hada de los dientes) y una en el App Store, más un servicio web de España que vende los archivos por correo. Cada una hace algo distinto: una simula una llamada, otra es un diario de dientes y Don Bigotes genera la carta, la nota de voz con el nombre del niño, el video, la foto del Ratón en su casa y el diploma, todo dentro del celular. Comparativa hecha desde Google Play España el 10 de septiembre de 2026; la disponibilidad en cada país puede variar.`

### Tabla (mismas filas y columnas; solo cambia la columna «Precio» → «Cobro» y «Última act.» igual)
| App | Carta con nombre | Nota de voz | Video personalizado | Fotomontaje | Diploma | Cobro | Plataforma | Última act. |
|---|---|---|---|---|---|---|---|---|
| **Don Bigotes: Ratón Pérez** (Xavi Ferré) | Sí, en PDF (gratis) | Sí, dice su nombre | Sí, desde su Oficina | Sí, «¡Pillado!» | Sí, de Valentía | Gratis · Pack Mágico de pago único | Android (18 países) e iOS | sep-2026 |
| Llamada del Ratoncito Pérez (elbuscator) | No | Llamada simulada (mensaje genérico) | No; video genérico en Premium | No | Sí, certificados (Premium) | Gratis con anuncios · Premium de pago único | Android | dic-2025 |
| El Ratón Pérez (Vanrock) | No | No | No | No | No | Gratis con anuncios | Android | jul-2026 |
| Ilusiono (ratonperez.com · ilusiono.com, España) | Sí, de pago | Sí, audiocuento (aparte) | Sí, con dedicatoria | Sí, foto selfie (aparte) | Sí, imprimible (aparte) | Por producto, en euros | Servicio web (no es app) | — |
| MyToothFairy (CatchACharacter, LLC) | No | No | No | Sí, calcomanías sobre sus fotos | No | Gratis con anuncios · compras dentro de la app | Android | jul-2024 |

Párrafo bajo la tabla: `Diario de dientes: Don Bigotes sí (gratis, hasta seis niños) · El Ratón Pérez (Vanrock) sí (comparte con familiares; se suben fotos y videos) · resto no. Anuncios: Don Bigotes no · Llamada sí · Vanrock sí · MyToothFairy sí. Sus fotos: Don Bigotes, se quedan en el celular · Vanrock, se suben · Ilusiono, se envían por correo.`

Aviso: `Datos tomados el 10 de septiembre de 2026 de las fichas públicas de cada aplicación en Google Play España. Las funciones, la disponibilidad por país y los precios de terceros pueden cambiar sin aviso: revisen siempre la ficha en su tienda antes de descargar.`

Notas (las 5 `<li>` de la ES, adaptadas):
- `Ilusiono no es una app: es un servicio web español en el que se compran videos, audios e imprimibles y se reciben por correo. Vende la carta personalizada, el video, el audiocuento, la foto selfie y el diploma por separado, con precios en euros y «rebajas» con contador. Anuncia una app propia desde noviembre de 2024, pero los botones llevan a una lista de espera: no hay app suya en Google Play.`
- `Llamada del Ratoncito Pérez ofrece una llamada simulada. Su Premium de pago único quita los anuncios y añade temas, certificados para imprimir y un video que su propia ficha describe como «un mensaje del Ratoncito Pérez en video», sin el nombre del niño. Ficha de Google Play: 3,8 estrellas con 85 valoraciones y más de 50 mil descargas; última actualización, 29 de diciembre de 2025.`
- `El Ratón Pérez (Vanrock) es un diario de dientes de leche: anotan qué diente se cayó y cuándo, y pueden compartirlo con abuelos y familiares; para eso las fotos y los videos se suben a su servicio. No genera carta, voz, video ni diploma. Gratis con anuncios; 4,5 estrellas (36 valoraciones), más de 10 mil descargas, última actualización el 8 de julio de 2026.`
- `MyToothFairy sigue publicada en Google Play. Pone calcomanías del hada de los dientes sobre sus propias fotos, con personajes blancos, negros e hispanos; sus compras dentro de la app son paquetes de Papá Noel y del Conejo de Pascua.`
- `Qué no verificamos: la disponibilidad de cada app en cada país de Latinoamérica ni sus precios locales. Don Bigotes está publicada en Android en 18 países de habla hispana y en el App Store.`

### Qué elegir según lo que buscan (H2)
- `Quieren la carta esta noche, gratis: Don Bigotes (Android e iPhone). La carta con su nombre sale en PDF en menos de un minuto.`
- `Quieren que el Ratón Pérez diga el nombre de su hijo: solo Don Bigotes lo hace dentro de la app.`
- `Quieren una llamada: «Llamada del Ratoncito Pérez». El mensaje es el mismo para todos los niños y la versión gratuita tiene anuncios.`
- `Solo quieren anotar qué diente se cayó y cuándo: el diario de Don Bigotes es gratis y no sube nada; «El Ratón Pérez» de Vanrock hace lo mismo y además comparte con los abuelos, a cambio de subir las fotos.`
- `Prefieren no instalar nada: Ilusiono vende los archivos por correo desde España, en euros.`

### FAQ (replicar en FAQPage)
- `¿Cuál es la mejor app del Ratón Pérez?` → `Depende de lo que busquen. Si quieren la carta, la voz con el nombre, el video, la foto y el diploma en una sola app y sin anuncios, Don Bigotes es la única que lo reúne. Si solo quieren una llamada simulada, «Llamada del Ratoncito Pérez». Si solo quieren un diario, Don Bigotes o Vanrock.`
- `¿Hay apps del Ratón Pérez gratis?` → `Sí. Don Bigotes es gratis (carta, diario y cumpleaños) y el Pack Mágico es un pago único. Llamada del Ratoncito Pérez, Vanrock y MyToothFairy son gratis con anuncios.`
- `¿Funcionan en mi país?` → `Don Bigotes está en Google Play en 18 países de habla hispana y en el App Store. Las demás dependen de su tienda: revisen la ficha.`
- `¿Es Don Bigotes la app oficial del Ratón Pérez?` → `No. Es una app independiente inspirada en la tradición del Ratón Pérez, con personajes y contenidos propios.`

Enlaces internos: `/es-419/app-raton-perez/`, `/es-419/carta-para-imprimir/`, `/es-419/diario-dientes-de-leche/`.
Pie legal: el de las es-419 existentes (cita la marca literal «Ratoncito Pérez»).

---

## D. Borrador es-419 — `/es-419/primer-diente/`

**BORRADOR. Decide Xavi.** Origen: `/primer-diente/` (última act. 2-sep-2026). Misma estructura (hero
con carta de muestra, bloque app, «Qué incluye», «Cómo funciona», FAQ, formulario de carta). La página
ES pesa 589 KB por imágenes embebidas: **reutilizar los mismos assets**, no duplicarlos.

### Head
```
<html lang="es-419">
<title>Carta del Ratón Pérez para el primer diente, gratis | Don Bigotes</title>
<meta name="description" content="La carta del Ratón Pérez (el Ratón de los Dientes) para el primer diente de su hijo. Con su nombre, gratis y lista para imprimir o guardar en PDF.">
<link rel="canonical" href="https://donbigotes.app/es-419/primer-diente/">
```

### Hero
Eyebrow: `El primer diente`
H1: `La carta del primer diente, gratis`
Sub: `Cuando a su hijo se le cae el primer diente, el Ratón Pérez (el Ratón de los Dientes) quiere celebrarlo. Creen gratis una carta con su nombre y el sello de la Oficina, lista para imprimir o guardar en PDF.`
CTA: `✨ Crear la carta gratis` · Línea: `Sin registro · Lista en 1 minuto · Gratis`

Carta de muestra (bloque «Querida Adriana»):
`Querida Adriana, felicidades por tu primer diente. Me lo llevé con muchísimo cuidado y te dejé un poquito de magia. Es el primero de muchos: sigue cuidando esa sonrisa tan bonita.`
Firma: `Hecho con cariño`
H3: `Ustedes ponen el diente. Él pone la magia.`
P: `Mientras su hijo duerme, el Ratón Pérez escribe su carta con su nombre. Por la mañana, la sorpresa ya está bajo la almohada.`

### Bloque app (replicado; usar la versión es-419 que ya exista en `/es-419/app-raton-perez/`)

### Qué incluye
H2: `Una carta gratis. Y, si quieren, mucha más magia.`
P: `La carta personalizada es siempre gratuita. El Pack Mágico suma una nota de voz, un fotomontaje y un Diploma de Valentía para una noche inolvidable.`
- Gratis · `La carta personalizada` · `Con su nombre y el sello de la Oficina. Lista para imprimir o guardar en PDF.`
- Pack Mágico · `El fotomontaje «¡Pillado!»` · `El Ratón Pérez «aparece» en una foto de su casa. La prueba de que estuvo ahí.`
- Pack Mágico · `La nota de voz` · `Un mensaje del propio Ratón Pérez, con su nombre, para escuchar en la cama.`
- Pack Mágico · `El Diploma de Valentía` · `Un diploma con su nombre y su foto que premia lo valiente que fue. Para imprimir y enmarcar.`

### Cómo funciona
H2: `Tres pasos. Dos minutos.`
- `Escriban su nombre` · `El nombre de su hijo y un par de detalles del diente que se le cayó.`
- `La magia sucede` · `Don Bigotes crea la carta del Ratón Pérez al instante.`
- `Bajo la almohada` · `Imprímanla o guárdenla en PDF y déjenla lista para la noche del diente.`

### Descárgala
H2: `Ya disponible en Google Play y App Store`
P: `El Pack Mágico completo, en un único pago, en Android y en iPhone.`
(Formulario «Avísame»: mismo Web3Forms con `origen: es419-primer-diente`; texto: `¿Tienen iPhone? Don Bigotes ya está en el App Store. Déjennos su correo y les avisamos de las novedades.`)

### FAQ (replicar en FAQPage)
- `¿Qué es la carta del primer diente?` → `Es la carta que el Ratón Pérez deja con el primer diente de leche de su hijo. Don Bigotes la personaliza con su nombre para celebrar ese momento.`
- `¿A qué edad se cae el primer diente de leche?` → `Suele caerse alrededor de los 5 o 6 años, aunque varía en cada niño. Es el primer hito de su sonrisa y un buen momento para una carta especial.`
- `¿La carta del primer diente es gratis?` → `Sí. La carta con su nombre y el sello de la Oficina es gratuita. La nota de voz, el fotomontaje y el Diploma de Valentía forman parte del Pack Mágico, que es opcional.`
- `¿Cómo hago la carta del primer diente?` → `Escriben el nombre de su hijo, indican que es el primer diente y la app la genera al instante, lista para imprimir o guardar en PDF.`
- `¿En España se llama distinto?` → `Sí: allí el personaje se conoce como Ratoncito Pérez. La carta es la misma, con el nombre que usen en su casa.`

Cierre H2: `Que la próxima caída de diente sea inolvidable`
Formulario de la carta (modal): `¿Cómo se llama?` · `¿Es niño o niña?` · `¿Qué diente se le cayó?` con opciones `Paleta de arriba` · `Paleta de abajo` · `Una muela` · `Un colmillo` · `No estoy seguro` (⚠️ «palita» es de España; en LATAM «paleta» o «diente de adelante»: decide Xavi). Botón `Crear la carta ✨` · `Imprimir o guardar en PDF` · `Crear otra`.
Upsell: `¿Y si el Ratón Pérez dijera su nombre?` · `«Soy yo, el Ratón Pérez…»` · `La voz de verdad de la app` · las 4 piezas igual que la ES con «Ratón Pérez».

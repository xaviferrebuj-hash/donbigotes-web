# Página web «Diario de dientes de leche» — copy y spec (17-sep-2026, v2 con refuerzo «gratis y para siempre»)

Para Code (`REPO: donbigotes-web`). Fuente: proyecto de Claude, `claude/PAGINA-DIARIO-DIENTES-17SEP.md`.

> ⚠️ `/diario-dientes-de-leche/` **YA EXISTE** desde el 2-sep (ES) y `/es-419/…` desde el 6-sep. No se crea: **se reescribe con este copy
> conservando las URLs** (y sus enlaces entrantes). GSC tiene 0 impresiones para `diario|registro|calendario|caen|cuando` con la página
> publicada hace 2 semanas: la versión actual no responde a esa intención (o no está indexada). Code comprueba en T0 el estado y qué
> title/H1 tiene hoy.
>
> 🔴 **Refuerzo de Xavi (17-sep tarde):** el mensaje central en toda la web, ASO, SEO y GEO es **«diario de dientes GRATIS Y PARA SIEMPRE»**.
> Ya está aplicado en este fichero (title, H1, meta, primer párrafo, FAQ 1, cierre). La 0.9 está **publicada en Play desde el 16-sep 23:55**:
> el prerrequisito de publicación está cumplido.

## 0. Keyword research (17-sep, GSC + búsqueda web)

- **GSC (3 meses):** cero impresiones para `diario|registro|calendario|caen|caida|cuando`; todo lo que entra es «carta», «firma»,
  «certificado», «existe». Semana 8-14 sep: 130 clics, 3.060 impr., CTR 4,3 %, pos. 6,0. [Seguro]
- **Competencia por término (SERP ES, 17-sep):**
  - «cuándo se caen los dientes de leche» / «a qué edad se caen…»: dominado por clínicas dentales. Alto volumen, alta competencia. [Seguro]
  - «diario de dientes»: casi sin competencia (un cuaderno imprimible en creacerti.com). Volumen bajo, intención exacta. [Probable]
  - «registro de dientes de leche», «calendario de caída de dientes»: sin páginas dedicadas. [Probable]
- **Decisión:** una sola página que **responde primero a «diario de dientes de leche» (gratis)** y **absorbe la cola larga** con una sección
  «¿Cuándo se cae cada diente?» (tabla por edades) y otra «Qué apunta el diario».

## 1. Slugs, titles, metas

| | es-ES | es-419 |
|---|---|---|
| URL | `/diario-dientes-de-leche/` | `/es-419/diario-dientes-de-leche/` |
| Title (≤ 60) | `Diario de dientes de leche: gratis y para siempre` | `Diario de dientes de leche: gratis y para siempre` |
| Meta description (≤ 160) | `Diario de dientes de leche gratis y para siempre en la app Don Bigotes: edad, cómo se cayó, regalo y foto de cada diente. Ficha para los abuelos por WhatsApp.` | igual |
| H1 | `Diario de dientes de leche, gratis y para siempre` | igual |
| hreflang | pareja es-ES ↔ es-419 como las demás | |
| Enlaces internos entrantes | home (bloque app, texto «Diario de dientes gratis»), `/app/`, `/primer-diente/`, `/comparativa-apps-ratoncito-perez/`, pie de las 10 páginas es-419 | |
| Enlaces salientes | Play y App Store (mismos botones que `/app/`), `/primer-diente/`, `/certificado-raton-perez/` | |
| Schema | `FAQPage` con las 4 preguntas de la sección FAQ. `SoftwareApplication` de `/app/` no se duplica | |
| Fechas | `tools/actualiza-fechas.sh` solo sobre las rutas tocadas, tras el commit de contenido | |
| Imágenes | captura 06-diario (raw de Play 0.9-nuevas, recortada, 800 px webp q80); `alt` «diario de dientes de leche gratis en la app Don Bigotes». Segunda imagen (ficha para abuelos): si no hay captura, dejar TODO y pedirla | |

## 2. Copy es-ES

**H1:** Diario de dientes de leche, gratis y para siempre

**Párrafo de respuesta (answer-ready):**
Un diario de dientes de leche es un registro de cada diente que se le cae a tu hijo: qué diente fue, qué día, a qué edad, cómo se cayó y
qué le dejó el Ratoncito Pérez. Don Bigotes lo lleva gratis y para siempre dentro de la app, sin suscripción ni cuenta, con una foto de cada
diente que se queda en tu móvil y una ficha para enviar a los abuelos por WhatsApp sin subir nada a ningún sitio.

[Botones: Google Play · App Store]

**H2: Qué apunta el diario de Don Bigotes**
- **Qué diente y cuándo.** Tocas el diente en el mapa de la boca y queda registrado con la fecha. Cuenta los 20 dientes de leche.
- **La edad exacta.** La app calcula los años y meses que tenía tu peque ese día.
- **Cómo se cayó.** Comiendo una manzana, en el cole, con un tirón de papá… la anécdota que dentro de diez años nadie recordaría.
- **El regalo del Ratoncito.** Lo que dejó bajo la almohada, para que no se repita con el siguiente diente.
- **Una foto.** Del hueco, del diente o de la sonrisa. Se guarda solo en tu móvil.
- **Sin carta no pasa nada.** Puedes apuntar un diente aunque ese día no hicieras la carta del Ratoncito.

**H2: La ficha para los abuelos**
Cada diente genera una ficha con el nombre del peque, el diente, la fecha, la edad y la foto. Se comparte por la hoja de compartir del móvil
(WhatsApp, Telegram, correo…). Don Bigotes no sube la ficha a ningún servidor: sale de tu móvil al de los abuelos y de ahí no pasa.
Es el único diario de dientes de leche que se comparte con los abuelos por WhatsApp sin subir nada a ningún servidor.

**H2: Un diario por cada hijo**
Hasta seis peques en el mismo móvil, cada uno con su diario, su cumpleaños y sus cartas. Los hermanos no se mezclan.

**H2: Copia del diario**
En Ajustes → Copia del diario guardas un archivo con todos los dientes, fotos y cartas, y lo restauras si cambias de móvil o reinstalas la app.
Es la forma segura de no perder los recuerdos: como todo se guarda en tu móvil, sin cuenta ni nube, la copia la tienes tú.

**H2: ¿Cuándo se cae cada diente de leche?**
Cada niño lleva su ritmo, pero el orden suele ser este. Sirve de guía para saber qué diente toca, no de norma.

| Dientes | Edad habitual de caída |
|---|---|
| Incisivos centrales inferiores | 6-7 años |
| Incisivos centrales superiores | 6-7 años |
| Incisivos laterales | 7-8 años |
| Primeros molares | 9-11 años |
| Caninos (colmillos) | 9-12 años |
| Segundos molares | 10-12 años |

Los primeros en caer suelen ser los de abajo delante, hacia los 6 años; los últimos, los molares de atrás, hacia los 12. Si un diente se
cae mucho antes de los 5 o no se ha movido a los 8, pregunta al dentista.

**H2: Preguntas frecuentes**
- **¿El diario es gratis?** Sí, gratis y para siempre: sin suscripción, sin anuncios y sin cuenta. La carta, el diario, la copia del diario y
  la felicitación de cumpleaños son gratis siempre. El Pack Mágico (voz, vídeo, fotomontaje, diploma) es un pago único y opcional.
- **¿Puedo apuntar dientes que se cayeron hace meses?** Sí. Eliges el diente y la fecha; la app calcula la edad que tenía.
- **¿Dónde se guardan las fotos?** Solo en tu móvil. No hay cuenta, no hay nube. Por eso existe la copia del diario.
- **¿Funciona en iPhone y en Android?** Sí, en los dos. La copia del diario se puede pasar de uno a otro.

**Cierre:** Descarga Don Bigotes y empieza el diario con el próximo diente (o con los que ya se han caído). Gratis y para siempre.
[Botones: Google Play · App Store]

## 3. Copy es-419

Mismo esqueleto, con estos cambios de léxico: **móvil → celular**; **peque → hijo/niño**; **Ratoncito Pérez → Ratón Pérez** (primera mención
«Ratón Pérez, el ratón de los dientes»); **cole → escuela**; **vídeo → video**; **hueco → huequito**; **«a ningún sitio» → «a ningún lado»**;
**«no pasa nada» → «no hay problema»**. Tabla de edades idéntica. Botones: los mismos enlaces de tienda.

**Párrafo de respuesta es-419:**
Un diario de dientes de leche es un registro de cada diente que se le cae a tu hijo: qué diente fue, qué día, a qué edad, cómo se cayó y
qué le dejó el Ratón Pérez. Don Bigotes lo lleva gratis y para siempre dentro de la app, sin suscripción ni cuenta, con una foto de cada
diente que se queda en tu celular y una ficha para enviar a los abuelos por WhatsApp sin subir nada a ningún lado.

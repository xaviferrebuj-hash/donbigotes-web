# Por qué /certificado-raton-perez/ gana q20 y las otras no

*Informe de análisis, 25-ago-2026. No implementa cambios.*

## El dato de partida

En el barrido GEO del 25 de agosto, la **única cita de donbigotes.app en todo el set** fue:

- **q20** — «diploma o certificado del Ratoncito Pérez para imprimir gratis» → **OpenAI cita
  `https://donbigotes.app/certificado-raton-perez/`**. Perplexity y Gemini, no.
- **q13** — «carta del ratoncito pérez para imprimir» → sin cita nuestra en ningún motor.
- **q15** — «certificado del ratoncito pérez por el primer diente caído» → sin cita nuestra en ningún motor.

Competidores citados en q20 por OpenAI: aventurasdelratonperez.com, orientacionandujar.es (PDF directo),
slidescarnival.com y tareakids.com (`certificado-raton-perez-imprimir-gratis`). Todos son, igual que
nuestra página ganadora, **descarga directa de un imprimible gratuito**.

**Asunción declarada:** tomo como página objetivo de q13 `/carta-para-imprimir/` y de q15
`/primer-diente/`. Si la objetivo de q15 fuese la propia `/certificado-raton-perez/`, la lectura cambia y
está tratada al final.

## Comparativa de los cuatro factores

| | `/certificado-raton-perez/` (gana q20) | `/carta-para-imprimir/` (q13) | `/primer-diente/` (q15) | `/diploma-raton-perez/` (contexto) |
|---|---|---|---|---|
| **(a) PDF descargable directo** | **Sí.** Dos botones en el hero, sobre el pliegue: `diploma-ratoncito-perez.pdf` + `diploma-raton-de-los-dientes.pdf`, con `download`, sin registro | **Sí.** Dos botones en el hero: `carta-ratoncito-perez.pdf` + `carta-raton-perez.pdf` | **No. Ningún PDF enlazado en toda la página.** Solo generador in-page (`openGen()`) y CTA a la app | Sí, los mismos dos PDFs del certificado |
| **(b) Variante LATAM / «Ratón de los Dientes»** | **Sí y explícita**: en la cápsula («versión para Latinoamérica: Ratón Pérez / Ratón de los Dientes»), en la meta description y como **segundo botón de descarga**. 4 menciones de Latinoamérica + 2 de «Ratón de los Dientes» | Sí, más floja: 2 menciones de Latinoamérica, 1 de «Ratón de los Dientes», botón LATAM presente | **No. Cero menciones** de Latinoamérica, Ratón Pérez o Ratón de los Dientes | Sí (2 + 2) |
| **(c) «gratis» en H1 y title** | **Title sí** («…para imprimir (PDF gratis)»). **H1 no** («Certificado del Ratoncito Pérez: el Diploma de Valentía»). Sí en la **primera frase en negrita** de la cápsula y en el **texto del botón** | **Title sí** («…(PDF gratis)»). **H1 no**. Sí en lead y botón | **H1 sí** («La carta del primer diente, *gratis*»). **Title no** («Carta del Ratoncito Pérez para el primer diente») | **Ni title ni H1.** Su title y su meta description venden el **Pack Mágico de la app**, no una descarga gratis |
| **(d) Schema** | WebPage + FAQPage (5 pares Q/A) + Organization + WebSite + SoftwareApplication con Offer `price:"0"` | Mismo esqueleto, FAQPage con 6 Q/A | Mismo esqueleto, FAQPage con 4 Q/A | Mismo esqueleto, FAQPage con 7 Q/A |

**El schema no explica nada.** Las cuatro páginas llevan exactamente el mismo bloque
(WebPage + FAQPage + Organization + WebSite + SoftwareApplication/Offer 0 €). Ninguna declara el PDF como
entidad (`DigitalDocument`, `encodingFormat`, `isAccessibleForFree`) ni usa `ItemList`. La diferencia entre
la que gana y las que no **no está en los datos estructurados**.

## Qué distingue realmente a la ganadora

Tres cosas, por orden de peso probable:

1. **La cápsula `answer-ready` en el hero.** `/certificado-raton-perez/` abre con una frase en negrita que
   responde la consulta entera y de forma literal: *«Descarga gratis el certificado del Ratoncito Pérez por
   el primer diente caído, en PDF listo para imprimir en A4»* — contiene «certificado», «gratis», «imprimir»
   y «PDF» en una sola oración extraíble. `/carta-para-imprimir/` tiene una cápsula equivalente
   (clase `capsula`), pero **`/primer-diente/` no tiene ninguna**: arranca con un párrafo narrativo
   («Cuando a tu peque se le cae el primer diente…»). Es la diferencia más visible entre las tres.
   [Probable]
2. **El PDF de descarga directa.** Los cinco resultados que OpenAI cita en q20 son imprimibles descargables.
   `/primer-diente/` no ofrece ninguno: pide usar un generador, que un motor no puede citar como recurso.
   [Probable]
3. **Cobertura de la variante LATAM.** La ganadora es la que más y mejor la declara —incluido un segundo
   botón de descarga—, lo que amplía el vocabulario que puede casar con la consulta. `/primer-diente/` no la
   menciona en absoluto. [Suponiendo: no hay evidencia de que la consulta en español de España active esa
   señal, pero sí amplía superficie]

Y una cuarta, negativa, que afecta a `/diploma-raton-perez/`: su title y su meta description **venden el
Pack Mágico de la app**, no la descarga gratuita, pese a servir los mismos dos PDFs que la página que gana.
Es la página peor alineada del grupo con una consulta que lleva la palabra «gratis» dentro.

## Si la página objetivo de q15 fuese `/certificado-raton-perez/`

Entonces la misma página gana q20 y pierde q15, y la explicación no puede ser estructural. La diferencia
entre las dos consultas es que q20 dice «para imprimir gratis» y q15 dice «por el primer diente caído».
La cápsula ya contiene literalmente «por el primer diente caído», así que el fallo estaría en el **title**,
que no menciona el primer diente en ninguna de sus dos páginas candidatas
(`/certificado-raton-perez/`: «…para imprimir (PDF gratis)»; `/primer-diente/`: «…para el primer diente»
pero sin «certificado»). **Ninguna página del sitio combina hoy «certificado» + «primer diente» en el
title.** Ese hueco es la hipótesis más limpia para q15. [Probable]

## Lo que este informe NO afirma

- No hay evidencia de causalidad: una sola cita, un solo motor, un solo día. Todo lo anterior es lectura de
  patrón, no medición. [Seguro]
- No se ha medido si el cambio de `/primer-diente/` a formato descargable canibalizaría a
  `/certificado-raton-perez/`, que es la única página con cita GEO confirmada. `ACTIVACION-1SEP.md` ya
  ordena no tocarla.

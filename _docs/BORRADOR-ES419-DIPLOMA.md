# Borrador es-419 — `/es-419/diploma-raton-perez/`

**BORRADOR. No publicado, no creado en el repo. Decide Xavi.**
Origen: `/diploma-raton-perez/` (es-ES, última actualización 2-sep-2026).
Patrón calcado de `/es-419/certificado-raton-perez/`, que es la pareja más parecida.

## REGLA LATAM aplicada

Verificada contra `es-419/certificado-raton-perez/index.html` y
`_docs/copy-cartero-real.md` (línea 168), no inventada:

| Regla | ES | es-419 |
|---|---|---|
| Personaje | Ratoncito Pérez | **Ratón Pérez**, con «(el Ratón de los Dientes)» en la primera mención |
| Tratamiento | tú / vosotros | **ustedes** |
| Dispositivo | móvil | **celular** |
| Verbo del formulario | rellenar | **llenar** |
| Precio | «4,99 € pago único» | **sin cifra y sin «€»** (lo pone la tienda de cada país) |
| Orden de los PDF | ES primero, LATAM como alternativa | **LATAM primero**, España como alternativa |
| `html lang` | `es` | `es-419` |

«Ratoncito Pérez» solo sobrevive en dos sitios: la frase que explica el nombre español
(«En España el personaje se conoce como Ratoncito Pérez») y el aviso legal del pie, que
cita la marca literal. Es exactamente lo que hace la página del certificado.

**Comprobaciones antes de publicar** (las mismas de `cartero-real-es419-y-asc.md`):
`grep -c "€"` → 0 · `grep -ci "vosotros\|móvil\|rellenar"` → 0 ·
`grep -ci "ratoncito"` → 2 (la frase de España + el legal).

---

## Head

```
<html lang="es-419">
<title>Diploma del Ratón Pérez para imprimir · PDF gratis</title>   (50 car.)
<meta name="description" content="Descarga gratis el diploma del Ratón Pérez (el Ratón de los Dientes) en PDF para imprimir en A4. Sin registro: el nombre y la fecha se llenan a mano.">   (149 car.)
<link rel="canonical" href="https://donbigotes.app/es-419/diploma-raton-perez/">
```

## Copy

### H1
> El Diploma de Valentía del Ratón Pérez, con su nombre

### Cápsula answer-ready (el `<p class="answer-ready">` del hero)
> **Descarga gratis el diploma del Ratón Pérez (también llamado Ratón de los Dientes) en PDF,
> listo para imprimir en A4.** Descarga directa, sin registro y sin dejar el correo. Sirve para
> el primer diente y para todos los siguientes: el nombre del niño y la fecha se llenan a mano.
> Incluye el sello de la Oficina del Ratón. En España el personaje se conoce como Ratoncito
> Pérez: también hay una versión con ese nombre para descargar.

### Botones de descarga (LATAM primero, invertido respecto a la ES)
> - `[Descargar diploma gratis (PDF, A4)]` → `/descargas/diploma-raton-de-los-dientes.pdf`
> - `[Versión España: Ratoncito Pérez (PDF)]` → `/descargas/diploma-ratoncito-perez.pdf`

### Subtítulo del hero
> Un diploma oficial de la Oficina del Ratón, personalizado con el nombre de su peque y el
> diente que se le cayó. Firmado y sellado, listo para enmarcar o guardar de recuerdo.

### Línea del pack (sin precio)
> Incluido en el Pack Mágico de la app Don Bigotes

### Qué incluye
> **Su nombre y su diente** — El diploma se personaliza con el nombre de su peque y el diente
> exacto que perdió.
>
> **Sello y firma de la Oficina** — Con el sello dorado de la Oficina del Ratón Pérez y la firma
> de Don Bigotes, que también pueden [descargar sueltos](/firma-sello-raton-perez/).
>
> **Para enmarcar o guardar** — Lo guardan en el celular, lo imprimen o lo enmarcan como recuerdo
> de su valentía.

### El Pack Mágico completo
> El diploma es una de las cuatro sorpresas del Pack Mágico de la app Don Bigotes.

### FAQ (7 preguntas, espejo verbatim del texto visible → replicar en el `FAQPage`)

> **¿El diploma del Ratón Pérez es gratis de verdad?**
> Sí. Se descarga en PDF con un clic, sin registro, sin correo y sin marca de agua. Está pensado
> para imprimir en A4 (o carta) y llenar a mano el nombre del niño y la fecha.
>
> **¿Puedo poner el nombre del niño impreso en el diploma?**
> En el PDF gratuito el nombre se escribe a mano. Si quieren el diploma con el nombre del niño ya
> impreso, junto a la carta, la nota de voz y el resto de la experiencia, se genera en la
> [app Don Bigotes](/es-419/app-raton-perez/).
>
> **¿El diploma lleva el nombre de mi hijo o hija?**
> Sí. Se genera personalizado con su nombre y el diente que perdió, firmado por la Oficina del
> Ratón Pérez.
>
> **¿Es lo mismo un diploma que un certificado del Ratón Pérez?**
> Son la misma idea: un documento de recuerdo por haber perdido un diente. En Don Bigotes lo
> llamamos Diploma de Valentía y forma parte del Pack Mágico de la app. Si buscan una versión
> para imprimir directamente, miren el
> [certificado del Ratón Pérez](/es-419/certificado-raton-perez/).
>
> **¿Cómo es la firma y el sello del Ratón Pérez?**
> El diploma lleva el sello de la Oficina y la firma de Don Bigotes. Pueden descargar
> [la firma y el sello por separado](/firma-sello-raton-perez/) en PNG y PDF.
>
> **¿Cuánto cuesta el diploma?**
> El diploma en PDF para imprimir es gratis siempre. La versión personalizada está incluida en el
> Pack Mágico de la app Don Bigotes, en un único pago; el precio lo muestra la tienda de su país.
>
> **¿Pueden imprimirlo o enmarcarlo?**
> Sí. Se guarda como imagen en su celular y pueden imprimirlo en casa o enmarcarlo como recuerdo.

### CTA final (sin precio)
> Creen la experiencia completa en la app Don Bigotes. Voz, foto y Diploma de Valentía
> personalizados: el Pack Mágico completo, en un único pago.

---

## hreflang recíproco previsto

En **`/es-419/diploma-raton-perez/`** (nueva):
```html
<link rel="canonical" href="https://donbigotes.app/es-419/diploma-raton-perez/">
<link rel="alternate" hreflang="es"       href="https://donbigotes.app/diploma-raton-perez/">
<link rel="alternate" hreflang="es-419"   href="https://donbigotes.app/es-419/diploma-raton-perez/">
<link rel="alternate" hreflang="x-default" href="https://donbigotes.app/diploma-raton-perez/">
```

En **`/diploma-raton-perez/`** (existente, hoy no tiene ningún `hreflang`; hay que añadir el
bloque entero justo debajo de su `<link rel="canonical">`):
```html
<link rel="alternate" hreflang="es"       href="https://donbigotes.app/diploma-raton-perez/">
<link rel="alternate" hreflang="es-419"   href="https://donbigotes.app/es-419/diploma-raton-perez/">
<link rel="alternate" hreflang="x-default" href="https://donbigotes.app/diploma-raton-perez/">
```

Es el patrón literal de la pareja `certificado-raton-perez` (comprobado en ambas): `hreflang="es"`,
**no** `es-ES`; canonical de cada página a sí misma; `x-default` siempre a la versión ES.

## Lo que hay que tocar además de la página

1. **`sitemap.xml`** — añadir `https://donbigotes.app/es-419/diploma-raton-perez/` con `lastmod`
   del día. `actualiza-fechas.sh` aborta si la ruta no está en el sitemap, así que esto va antes.
2. **Footers `/es-419/`** — hoy ninguno enlaza al diploma. Decidir si entra en los 8 (ver
   `ES419-FOOTER-PENDIENTE.md`).
3. **Enlace ya existente que hay que corregir:** `es-419/certificado-raton-perez/index.html:320`
   apunta a `/diploma-raton-perez/` (la ES). Al publicar la LATAM, pasa a `/es-419/diploma-raton-perez/`.
   Es el único enlace es-419→diploma que existe hoy.
4. **IndexNow** — el workflow pinga solo al cambiar `index.html`; entrarán la nueva y la ES.
5. **`tools/generar_md.py`** — añadir la ruta a la lista `PAGINAS`.

## Aviso

Las dos páginas del diploma quedarán con **el mismo PDF de fondo y contenido casi idéntico** al
del certificado (ES y LATAM). Ya hoy en GSC `diploma ratoncito pérez` (11 impresiones, posición
22,6) aterriza en `/certificado-raton-perez/`, no en `/diploma-raton-perez/`: Google no distingue
las dos páginas. **Publicar una cuarta variante del mismo contenido puede empeorar eso, no
mejorarlo.** Antes de crear la es-419 del diploma conviene resolver la confusión
certificado/diploma en ES — está anotada también en `PROPUESTA-TITLES-9SEP.md`, punto 2.

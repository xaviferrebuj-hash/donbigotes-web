# Copy es-419 — `/es-419/ultimo-diente/`

*Publicada el 20-sep-2026. Origen: `/ultimo-diente/` (es-ES). Patrón calcado de
`/es-419/primer-diente/`, la pareja más parecida.*

Motivo: México busca «carta de despedida del ratón de los dientes» y caía en la página ES
(`monitor-geo/REPASO-ASO-SEO-GEO-20SEP.md` §Bloque 1).

## Regla LATAM aplicada

| Regla | ES | es-419 |
|---|---|---|
| Personaje | Ratoncito Pérez | **Ratón Pérez**; «Ratón de los Dientes» en title, description y primer párrafo |
| Tratamiento | tú / vosotros | **ustedes** |
| Dispositivo | móvil | **celular** |
| Precio | «4,99 € pago único» | **sin cifra y sin «€»** |
| Tienda Apple | `apps.apple.com/es/app/…` | `apps.apple.com/app/…` |
| Google Play | sin `hl` | `&hl=es_419`, campaña `ultimo-diente-latam` |
| `html lang` / `og:locale` | `es` / `es_ES` | `es-419` / `es_LA` |

«Ratoncito Pérez» solo sobrevive en la FAQ que explica el nombre español (visible + JSON-LD).
El aviso legal del pie cita «Ratón Pérez», igual que el resto de páginas `/es-419/`.

Comprobaciones hechas: `grep -c "€"` → 0 · `grep -ci "vosotros\|móvil\|rellenar"` → 0 ·
`grep -c "Ratoncito"` → 2 (las dos copias de la FAQ de España).

## Head

```
<html lang="es-419">
<title>Carta de despedida del Ratón de los Dientes (último diente) | Don Bigotes</title>
<meta name="description" content="La carta de despedida del Ratón Pérez (el Ratón de los Dientes) para el último diente de su hijo. Con su nombre, gratis y lista para imprimir o guardar en PDF.">
<link rel="canonical" href="https://donbigotes.app/es-419/ultimo-diente/">
<link rel="alternate" hreflang="es" href="https://donbigotes.app/ultimo-diente/">
<link rel="alternate" hreflang="es-419" href="https://donbigotes.app/es-419/ultimo-diente/">
<link rel="alternate" hreflang="x-default" href="https://donbigotes.app/ultimo-diente/">
<meta property="og:title" content="La carta de despedida del Ratón Pérez">
<meta property="og:description" content="Para el último diente de leche: una carta de despedida con el nombre de su hijo. Gratis.">
<meta property="og:locale" content="es_LA">
```

Los tres `hreflang` se añadieron también en `/ultimo-diente/` (ES), que antes no tenía ninguno.

## Hero

- **Eyebrow:** El último diente
- **H1:** La carta de / despedida del / *Ratón Pérez*
- **Sub:** Cuando se cae el último diente de leche, el Ratón de los Dientes se despide.
  Creen gratis una carta con el nombre de su hijo para cerrar esta etapa con magia.
- **Carta de muestra:** «Este es tu último diente de leche, y por eso esta carta es muy
  especial. Me hiciste muy feliz todos estos años. Ya eres grande y tu sonrisa es preciosa.
  Te voy a extrañar… ¡pero siempre te voy a recordar!»

## Bloques adaptados

| Bloque | ES | es-419 |
|---|---|---|
| Story | Tú pones el diente. Él pone la magia. | **Ustedes ponen** el diente. Él pone la magia. |
| Story | Mientras tu peque duerme… | Mientras **su hijo** duerme… |
| Qué incluye | …si quieres, mucha más magia | …si **quieren**, mucha más magia |
| Fotomontaje | en una foto en casa · estuvo allí | en una foto **de su casa** · estuvo **ahí** |
| Diploma | lo valiente que ha sido | lo valiente que **fue** |
| Pasos | Escribe su nombre · Imprímela o guárdala | **Escriban** su nombre · **Imprímanla o guárdenla** |
| Formularios (×2) | ¿Tienes iPhone?… Déjanos tu contacto | **¿Tienen iPhone?… Déjennos su correo** |
| Formularios | Tu email o móvil | **Su correo o celular** |
| Pack (postcarta) | Vídeo del viaje | **Video** del viaje |
| Pack | cazado en una foto de vuestra casa | **atrapado** en una foto **de su casa** |
| Generador | ¿Qué diente se le ha caído? · Palita | ¿Qué diente se le **cayó**? · **Paleta** |
| Generador (carta) | ¡Has sido muy valiente!… Te he dejado | **¡Fuiste** muy valiente!… **Te dejé** |
| `origen` del formulario | `form.id \|\| "landing"` | `"es419-ultimo-diente"` |

## FAQ (5 preguntas, espejo verbatim del `FAQPage`)

1. ¿Qué es la carta de despedida del Ratón Pérez?
2. ¿A qué edad se cae el último diente de leche? *(la ES pregunta «¿Cuándo…?»)*
3. ¿La carta de despedida es gratis?
4. ¿Cómo hago la carta de despedida del Ratón Pérez?
5. **¿En España se llama distinto?** — añadida, igual que en `/es-419/primer-diente/`.

## Footer

Se sustituyen los cinco enlaces ES (app, vídeo, foto, voz, diario) por los seis del árbol
LATAM: carta-para-imprimir, primer-diente, ultimo-diente, el-ratoncito-perez-existe,
comparativa-apps, diario-dientes-de-leche. Siguen apuntando a ES `/blog/`, el `mailto:`,
el WhatsApp y la privacidad, igual que el resto de páginas `/es-419/`.

## Pendiente que deja abierto

`_docs/ES419-FOOTER-PENDIENTE.md` cuenta 4 footers `/es-419/` que enlazan a `/ultimo-diente/`
(ES): `/es-419/`, app-raton-perez, cartero-real *(ya es stub)*, certificado-raton-perez. Ahora
que existe la LATAM, deberían apuntar a `/es-419/ultimo-diente/`. No se ha tocado: son cambios
de contenido visible en 3 páginas más y arrastrarían pase de fechas.

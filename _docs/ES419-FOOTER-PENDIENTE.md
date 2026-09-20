# Enlaces de footer en /es-419/* que apuntan a páginas solo-ES

> **Cartero Real cancelado 19-sep-2026.**

*Inventario del 9-sep-2026. Solo diagnóstico: no se ha tocado ningún enlace.*

> **Actualizado el 20-sep-2026: `/ultimo-diente/` ya tiene versión LATAM.**
> Se creó `/es-419/ultimo-diente/` y los **6 footers** que enlazaban a la ES
> (`/es-419/`, app-raton-perez, certificado-raton-perez, diario-dientes-de-leche,
> diploma-raton-perez, primer-diente) apuntan ya a la LATAM. El de
> `/es-419/cartero-real/` no se tocó: esa página es un stub de redirección desde el
> 19-sep. Quedan **9 destinos** y **36 enlaces** de los 10 y 42 del inventario.
> El mismo día, «Escríbenos por WhatsApp» pasó a «Escríbannos» en las 8 páginas
> `/es-419/` que lo llevan.

Las 8 páginas de `/es-419/` existen y se enlazan entre sí correctamente. El problema es
el resto del footer: **42 enlaces** salen del árbol LATAM y caen en páginas en español de
España, sin versión `/es-419/`. Ninguno está roto (todos devuelven 200), pero rompen la
coherencia de idioma y de `hreflang`: un lector de LATAM que pincha en el footer sale del
sitio adaptado sin aviso.

## Destinos ES sin versión LATAM

| Destino | Nº de footers que lo enlazan | Desde |
|---|---|---|
| `/blog/` | 8 (todas) | todas las páginas `/es-419/` |
| `/editable/` | 4 | `/es-419/`, app, cartero-real, certificado |
| `/historia-raton-perez/` | 4 | app, carta-para-imprimir, cartero-real, el-ratoncito-perez-existe |
| `/primer-diente/` | 4 | `/es-419/`, app, cartero-real, certificado |
| `/foto-raton-perez/` | 3 | `/es-419/`, carta-para-imprimir, el-ratoncito-perez-existe |
| `/viaje-del-diente/` | 3 | carta-para-imprimir, carta-reyes-magos, diario-dientes-de-leche |
| `/video-raton-perez/` | 3 | `/es-419/`, carta-para-imprimir, el-ratoncito-perez-existe |
| `/voz-raton-perez/` | 3 | `/es-419/`, carta-para-imprimir, el-ratoncito-perez-existe |
| `/cumpleanos-raton-perez/` | 2 | app, cartero-real |

**10 destinos distintos, 42 enlaces en total.** *(Desde el 20-sep: 9 y 36.)*

## Detalle por página

| Página `/es-419/` | Enlaces solo-ES en su footer | Cuáles |
|---|---|---|
| `/es-419/` | 6 | blog, editable, foto, primer-diente, video, voz |
| `/es-419/app-raton-perez/` | 5 | blog, cumpleanos, editable, historia, primer-diente |
| `/es-419/carta-para-imprimir/` | 6 | blog, foto, historia, viaje-del-diente, video, voz |
| `/es-419/cartero-real/` | 5 | blog, cumpleanos, editable, historia, primer-diente |
| `/es-419/el-ratoncito-perez-existe/` | 5 | blog, foto, historia, video, voz |
| `/es-419/certificado-raton-perez/` | 3 | blog, editable, primer-diente |
| `/es-419/carta-reyes-magos/` | 2 | blog, viaje-del-diente |
| `/es-419/diario-dientes-de-leche/` | 2 | blog, viaje-del-diente |

## Notas de criterio (para cuando se decida)

- **`/editable/` y `/blog/` no son el mismo caso que el resto.** `/editable/` es una
  herramienta, no una página de contenido: puede que no necesite versión LATAM, solo revisar
  su copy. `/blog/` es un índice: adaptarlo obliga a adaptar también las entradas.
- **Enlaces salientes que NO son un problema:** `mailto:hola@donbigotes.app`,
  `https://wa.me/34696646314`, la privacidad en `don-bigotes-config` y `#seal`. Se dejan igual.
- **Páginas ES que ningún footer `/es-419/` enlaza:** `/prensa/`, `/diploma-raton-perez/`,
  `/firma-sello-raton-perez/`, `/comparativa-apps-ratoncito-perez/`,
  `/fotomontaje-ratoncito-perez/`. No generan deuda de footer hoy.
- **Orden sugerido si se adaptan** (por nº de footers que lo esperan, coste bajo primero):
  `/primer-diente/` (4, texto corto; `/ultimo-diente/` ya está hecho), `/historia-raton-perez/` (4),
  `/viaje-del-diente/` (3), después el bloque foto/video/voz (3 cada uno, muy parecidos entre sí).
- Cada adaptación exige `hreflang` recíproco entre la ES y la LATAM, entrada en `sitemap.xml`
  y actualizar los 8 footers `/es-419/` que apunten a ella.

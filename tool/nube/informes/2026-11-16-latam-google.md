# 2026-11-16 · LATAM en Google (rama `web/latam-google`, sin merge)

1. **Tarea 1, hreflang: estaba todo bien y no he tocado nada.** Las 20 parejas España / es-419 del sitemap tienen hreflang recíproco (23 etiquetas por página), `x-default` → España, canonical propio en cada variante, `lang` correcto (`es` / `es-419`) y las etiquetas dentro del `<head>` (comprobado con un parser HTML5 en el repo, en el build y en producción, que sirve lo mismo). El sitemap no lleva alternates, así que no hay nada que cuadrar.
2. **Códigos: se respeta el patrón que ya hay**: `es` (España) + `es-419` + 20 países explícitos (`es-MX` … `es-US`) apuntando a es-419 + `x-default` → España. Con `es-MX` explícito, México casa con es-419 sin ambigüedad.
3. **Así que la causa de que en México salga `/carta-para-imprimir/` es otra.** El hreflang es una pista para Google, no una orden. Dos hipótesis que no he podido comprobar desde aquí (necesitan Search Console): (a) Google trata las dos cartas como duplicadas y elige la de España como canonical (en Inspección de URL de `/es-419/carta-para-imprimir/`, mirar «URL canónica seleccionada por Google»); (b) las búsquedas mexicanas de esa página usan «ratoncito», que dice la de España y no la es-419 (mirar las consultas de `/carta-para-imprimir/` filtrando por país = México). No he inventado ningún arreglo.
4. **Tarea 2, certificado es-419** (solo `es-419/certificado-raton-perez/index.html`; España intacta):
   - title: «Certificado del Ratón Pérez para llenar e imprimir · PDF gratis» → «Certificado gratis del Ratón Pérez (Ratón de los Dientes)» (57 caracteres).
   - description: «Certificado del Ratón Pérez (Ratón de los Dientes) por el primer diente y los siguientes: PDF gratis para imprimir y llenar con su nombre. Sin registro.» → «Certificado mágico del Ratón Pérez (Ratón de los Dientes) para imprimir gratis: escribe su nombre y sale ya puesto, con la fecha. PDF A4, sin registro.» (151 caracteres).
   - `og:title` (antes copiaba el título de España) y `og:description`, iguales a los nuevos. No hay `twitter:title` ni `twitter:description` (solo `twitter:card`). El JSON-LD no repetía el título, así que no lo he tocado.
5. **Comprobaciones:** `jekyll build` con el gem github-pages 233 (Jekyll 3.10) sale bien, sin el tema envolviendo la página. JSON-LD válido (WebSite, Organization, SoftwareApplication, WebPage, ImageObject y FAQPage). `tools/generar_md.py` regenerado: cero cambios, porque el generador ignora title y meta. Al no cambiar contenido visible, no hay pase de fechas.
6. **Commit:** `97c1ace` (metadatos del certificado es-419), más el de este informe. Créditos y gasto: 0.
7. **Fuera del encargo (no lo he tocado):** la meta description del certificado de **España** dice «Certificado oficial de la Oficina del Ratón Pérez», y las dos variantes del certificado lo dicen también en el texto visible («un certificado oficial de la Oficina del Ratón»). La regla de marca prohíbe «oficial». En total, 18 páginas tienen esa palabra; habría que revisarlas en otro encargo.
8. **Decide Xavi:** el merge de `web/latam-google` a main (publicar). Si se publica, medir el CTR del certificado es-419 en México a partir de 4 semanas.

| Par (España / es-419) | Qué hay hoy | Qué falta o está mal |
|---|---|---|
| `/` · `/es-419/` | hreflang recíproco (es, es-419, x-default y 20 países), canonical propio, lang es / es-419 | Nada |
| `/carta-para-imprimir/` · `/es-419/carta-para-imprimir/` | Igual | Nada |
| `/primer-diente/` · `/es-419/primer-diente/` | Igual | Nada |
| `/ultimo-diente/` · `/es-419/ultimo-diente/` | Igual | Nada |
| `/editable/` · `/es-419/editable/` | Igual | Nada |
| `/el-ratoncito-perez-existe/` · `/es-419/el-ratoncito-perez-existe/` | Igual | Nada |
| `/app-raton-perez/` · `/es-419/app-raton-perez/` | Igual | Nada |
| `/foto-raton-perez/` · `/es-419/foto-raton-perez/` | Igual | Nada |
| `/voz-raton-perez/` · `/es-419/voz-raton-perez/` | Igual | Nada |
| `/certificado-raton-perez/` · `/es-419/certificado-raton-perez/` | Igual | Nada (el título es-419 se cambia en la tarea 2) |
| `/diploma-raton-perez/` · `/es-419/diploma-raton-perez/` | Igual | Nada |
| `/firma-sello-raton-perez/` · `/es-419/firma-sello-raton-perez/` | Igual | Nada |
| `/diario-dientes-de-leche/` · `/es-419/diario-dientes-de-leche/` | Igual | Nada |
| `/cuando-se-caen-los-dientes-de-leche/` · `/es-419/…` | Igual | Nada |
| `/comparativa-apps-ratoncito-perez/` · `/es-419/…` | Igual | Nada |
| `/cancion-cepillado-dientes/` · `/es-419/…` | Igual | Nada |
| `/cuentos-clasicos-para-dormir/` · `/es-419/…` | Igual | Nada |
| `/fotomontaje-ratoncito-perez/` · `/es-419/fotomontaje-raton-perez/` | Igual (cada variante con su propia URL) | Nada |
| `/cuento-ratoncito-perez/` · `/es-419/cuento-raton-perez/` | Igual (cada variante con su propia URL) | Nada |
| `/carta-ratoncito-perez-segun-edad/` · `/es-419/carta-raton-perez-segun-edad/` | Igual (cada variante con su propia URL) | Nada |
| Solo España: `/video-raton-perez/`, `/viaje-del-diente/`, `/historia-raton-perez/`, `/cumpleanos-raton-perez/`, `/prensa/`, `/blog/`, `/blog/la-noche-del-diente/` | Sin hreflang, canonical propio | Nada: no tienen variante es-419 |

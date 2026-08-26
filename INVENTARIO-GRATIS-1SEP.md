# INVENTARIO — copy «gratis» a retirar el 1-SEP (fin del modo gratuito del Pack Mágico)

Generado: 23-ago-2026 (Cowork, solo lectura). **57 ocurrencias en 20 ficheros.**
Los números de línea son orientativos (válidos a fecha del inventario): Code debe localizar por patrón, no por línea.

⚠️ El «57 ocurrencias» de este inventario está superado. Recuento definitivo y cruce
completo: `REDACCIONES-1SEP.md` (**66 ocurrencias, 68 ediciones, 84 con G7**).
**No usar este fichero como conteo.**

## Hallazgo estructural

`_partials/cta-app.html` SÍ existe: es la **fuente única documental** del bloque CTA
(se copia a mano en cada página; no hay sistema de includes). Los comentarios
`BLOQUE CTA REUTILIZABLE -> fuente unica: /_partials/cta-app.html` lo confirman.
**Orden obligado: editar primero el partial, después propagar a las páginas.**

## Regla que rige

FAQPage: el copy visible manda; el JSON-LD se sincroniza a él, nunca al revés.
Cada edición de FAQ visible obliga a re-sincronizar su JSON-LD en la misma página.

---

## A. Bloque CTA «lead» (19 páginas + partial) — texto idéntico o variante

Texto: «Voz, foto y Diploma de Valentía personalizados. Gratis durante el lanzamiento.»

- `_partials/cta-app.html:34` ← **PRIMERO**
- `index.html:300` · `primer-diente:269` · `ultimo-diente:269` · `editable:276` ·
  `el-ratoncito-perez-existe:270` · `foto-raton-perez:353` · `voz-raton-perez:363` ·
  `video-raton-perez:361` · `viaje-del-diente:360` · `certificado-raton-perez:347` ·
  `diploma-raton-perez:338` · `historia-raton-perez:303` · `prensa:271` ·
  `app-raton-perez:363` · `firma-sello-raton-perez:392` · `cumpleanos-raton-perez:317`
- Variantes con estilo inline (mismo texto, sin clase `lead`):
  `carta-para-imprimir:306` · `fotomontaje-ratoncito-perez:273`
- Variante con fecha: `comparativa-apps-ratoncito-perez:372` («Gratis hasta el 1 de septiembre de 2026»)

🔒 **DECIDIDO 24-ago-2026 — NO SE TOCA, NO SE VUELVE A PROPONER.** La redacción «gratis
hasta el 1 de septiembre» es ambigua: el último día gratis es el 31-ago y el 1-sep ya se
cobra. **Xavi lo sabe y lo asume**: el desfase es de un día y no justifica más ediciones.
**Queda fuera de alcance en todas las páginas.** No abrir de nuevo el tema en sesiones
futuras salvo que Xavi lo pida expresamente.

## B. hero-note (8 páginas)

Patrón: «Gratis durante el lanzamiento · [claim] · Hecho/a en España»

- `foto-raton-perez:231` · `video-raton-perez:234` · `voz-raton-perez:236` ·
  `certificado-raton-perez:246` · `viaje-del-diente:259` · `app-raton-perez:231` ·
  `firma-sello-raton-perez:260`
- Variante: `diploma-raton-perez:245` («Incluido en el Pack Mágico · Gratis hasta el 1 de septiembre»)

⚠️ El hero-note NO puede quedarse con un solo claim: rellenar el hueco
(p. ej. «4,99 € pago único · Al instante · Hecho en España»).

## C. Metas description / og:description (3 páginas, 5 metas) — afecta a snippets SEO

- `video-raton-perez:7` (description) y `:13` (og:description)
- `voz-raton-perez:7` y `:13`
- `foto-raton-perez:13` (solo og:description)

⚠️ Al cambiar metas: mantener longitud ≤155 caracteres en description.

## D. FAQ visible + JSON-LD (7 pares — editar visible y RE-SINCRONIZAR JSON)

| Página | FAQ visible | JSON-LD |
|---|---|---|
| foto-raton-perez | :322 | :208 |
| video-raton-perez | :330 | :211 |
| voz-raton-perez | :332 | :212 |
| app-raton-perez | :343 | :208 |
| fotomontaje-ratoncito-perez | :362 | :50 |
| diploma-raton-perez | :310 | :221 |
| comparativa-apps-ratoncito-perez | :411 | :40 |

Texto tipo: «Sí, gratis durante el lanzamiento. Después, el Pack Mágico completo
cuesta 4,99 € en un único pago, sin suscripciones.» → pasa a afirmativo:
«El Pack Mágico completo cuesta 4,99 € en un único pago, sin suscripciones.
La carta en PDF sigue siendo gratis.» (copy final a decidir el 1-sep).

## E. Bloques de precio en secciones (4)

«Gratis durante el lanzamiento. Después, el Pack Mágico completo por 4,99 €…»

- `foto-raton-perez:292` · `video-raton-perez:300` · `voz-raton-perez:302` · `app-raton-perez:308`

## F. Prosa y micro-claims (6)

- `prensa:242` y `:248` (⚠️ nota de prensa publicada el 20-ago: valorar si se toca o se deja como documento histórico con fecha)
- `historia-raton-perez:271` (micro) y `:355` (prosa)
- `fotomontaje-ratoncito-perez:249` (micro)
- `comparativa-apps-ratoncito-perez:254` (micro con fecha)

---

## G. FUERA del repo (verificado 23-ago; revisa XAVI el 1-sep)

- **Descripciones de YouTube**: el Short df9ZN1s9TVg dice «Gratis durante el lanzamiento»
  (verificado 23-ago). Revisar TODOS los vídeos/Shorts del canal.
- **Ficha de Play Console** (es-ES + es-419): revisar si menciona el modo gratuito.
  ⚠️ Si la edición sigue «en revisión» el 1-sep, no encolar otra edición sin veredicto.
- **Pines de Pinterest**: revisar descripciones.
- **Nota de prensa en Comunicae**: ya distribuida, no editable — sin acción.

## Checklist de ejecución para Code (día 1-sep, tras activar el cobro)

1. Editar `_partials/cta-app.html` con el copy definitivo.
2. Propagar A → B → E → F → C (metas) → D (FAQ visible + re-sync JSON-LD).
3. `grep -ri "durante el lanzamiento\|hasta el 1 de septiembre" --include="*.html" .` debe devolver 0 (salvo lo que se decida conservar en /prensa/).
4. Actualizar lastmod del sitemap con `git log -1 --format=%cs` por página (regla 22-ago).
5. Commit + push → IndexNow se dispara solo.
6. Borrar este fichero o marcarlo EJECUTADO.

# PENDIENTES — donbigotes-web

Ítems con disparador. El estado del día a día y las reglas de edición viven en
`CLAUDE.md`; aquí solo va lo que espera a una fecha o a un hecho concreto.

*(Creado el 29-ago-2026, con el primer ítem que necesitaba disparador propio.)*

---

## [W1] Fin del modo gratuito del Pack Mágico — barrido del copy «gratis»

**TRIGGER: 1 de septiembre de 2026.** Ese día el Pack Mágico pasa a cobrarse en Android
(el 31-ago es el último día gratis). En iPhone ya se cobra desde el primer día.

🔴 **La redacción de reemplazo YA ESTÁ ESCRITA. No volver a redactarla ni a recontar.**

| Documento | Para qué |
|---|---|
| `REDACCIONES-1SEP.md` | **El que manda.** Redacción ES y LATAM de cada ocurrencia, fichero a fichero. Recuento cerrado: **66 ocurrencias · 68 ediciones · 84 con la deuda de G7.** |
| `INVENTARIO-GRATIS-1SEP.md` | Checklist de ejecución por grupos (A: lead del CTA, B: hero-note, C: metas…). Su cifra de 57 está superada: **no usarla como conteo.** |
| `BARRIDO-1SEP.md` | Método de propagación del bloque CTA a las 17 copias. |

### Qué hay que ejecutar ese día

1. **Localizar por patrón, nunca por número de línea** (las líneas de los documentos son
   orientativas). Los dos greps de entrada:
   - `grep -rin "gratis durante el lanzamiento" --include=*.html --include=*.md --include=llms.txt .`
   - `grep -rin "31 de agosto de 2026" --include=*.html --include=*.md --include=llms.txt .`

   Cubren: lead del bloque CTA, hero-note, FAQ visible, cápsulas GEO,
   `meta description` / `og:description` y `llms.txt`.
2. 🔴 **FAQ: cada cambio en el texto visible se replica VERBATIM en el `FAQPage` de la
   misma página, en el mismo commit** (regla anti-desajuste del 26-ago; hoy las 18 páginas
   están sincronizadas al 100 %). El copy visible manda; el JSON-LD es su espejo.
3. **Orden del bloque CTA:** primero `_partials/cta-app.html`, después propagar a las
   copias inline de cada página. El partial es referencia canónica, **no** se propaga solo
   (regla 6 de `CLAUDE.md`).
4. **Regenerar los `.md`** con `python3 tools/generar_md.py` (regla 5).
5. Verificar el run de IndexNow y el deploy de Pages en verde.

### Criterio de redacción (rectificación de Xavi, 26-ago) — no reinterpretarlo

- **Carta, firma y sello:** «gratis», **sin fecha ni condición**. Siguen siendo gratis
  para siempre; el barrido **no es un borrado ciego de la palabra**.
- **Voz, vídeo, fotomontaje y diploma:** «con el Pack Mágico, pago único», **sin cifra en
  euros** (deuda LATAM) y **sin nombrar plataforma**.
- Ninguna enumeración puede mezclar la carta con el Pack bajo un mismo «gratis».
- 🔒 **Cerrado, no reabrir:** el desfase de un día de «gratis hasta el 1 de septiembre»
  (decidido el 24-ago) y la ausencia de cifra para iOS.

📌 **Nota del 29-ago-2026:** desde que se escribieron esos documentos, la app salió en el
**App Store**. No obliga a rehacer nada — el criterio del 26-ago ya dice «sin plataforma»
justamente porque tras el 1-sep el pago único vale en los dos sistemas — pero al ejecutar
el barrido conviene comprobar que ninguna redacción de reemplazo acota el pago a Android.

### Recordatorio para Xavi — fuera de este repo, Code no lo toca

- [ ] Actualizar la **descripción de la ficha de Google Play**.
- [ ] Actualizar los **2 pines de Pinterest**.
- [ ] *(Cross-repo, ya cubierto por [T4] en el `PENDIENTES.md` de la app)* la fecha
      `finLanzamientoGratis` vive en `don-bigotes-config`, no aquí.

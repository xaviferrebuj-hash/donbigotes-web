# Web — generador de carta por edad (20-sep-2026, para Code en `donbigotes-web`)

## Qué hay hoy (leído del clon, 20-sep)

- El generador («Crear la carta ✨») es un overlay `#gen` con formulario (nombre, sexo, diente en chips) y un resultado `.letter-paper.gen-paper`: papel rayado en CSS, saludo + cuerpo en Caveat, sello y firma absolutos abajo. Impresión por `window.print()` con `@media print`.
- **Está duplicado inline en 8 páginas** (HTML + CSS + JS `makeLetter()` en cada una): `/`, `/editable/`, `/primer-diente/`, `/ultimo-diente/`, `/el-ratoncito-perez-existe/`, `/es-419/`, `/es-419/primer-diente/`, `/es-419/el-ratoncito-perez-existe/`. No hay partial ni JS compartido para él (`_partials/` solo tiene `cta-app.html`; `js/` tiene `enlaces-app.js` y `muestra-voz.js`).
- El texto de la web es uno genérico, distinto del de la app («¡Has sido muy valiente! Anoche pasé por tu almohada…»). Goal Plausible: `Carta generada`.

## Qué se hace

1. **Sacar el generador a un JS común** `js/carta-gen.js` (plantillas de texto, `makeLetter`, chips, Plausible) y dejar en cada página solo el HTML del overlay. Primero en `/editable/`; cuando funcione, las otras 7 con el mismo bloque. Nada de reescribir las páginas: `str_replace` del `<script>` inline por `<script src="/js/carta-gen.js">`.
2. **Fila de chips nueva**, entre el sexo y el diente:
   ```html
   <span class="gen-label">¿Cuántos años tiene?</span>
   <div class="chips" id="gedad">
     <button type="button" class="chip" data-v="t34">3-4</button>
     <button type="button" class="chip sel" data-v="t56">5-6</button>
     <button type="button" class="chip" data-v="t79">7 o más</button>
   </div>
   ```
   `bindChips('gedad','edad')`; por defecto `t56`. es-419: mismo texto («¿Cuántos años tiene?» vale).
3. **Textos por tramo** (`GEN.edad`): `t34` y `t56` = los de `docs/CARTAS-EDAD.md` §4 de la app (con `{nombre}` y `{diente}` = chip del diente; «tu diente» si «No estoy seguro»); `t79` = el texto actual de la web sin cambios. Saludo: en `t34`/`t56` siempre «¡Hola, {nombre}!» (los textos ya evitan el género); en `t79` como hoy (Querido/Querida/¡Hola!). es-419: «Ratón» donde hoy ya se sustituye.
4. **Diseño por tramo en `.letter-paper`**: clase `edad-t34` / `edad-t56` / `edad-t79`. Para `t34` y `t56`: sin rayas, papel crema `#FBF7EC`, marco dorado 1 px `#B9882F` con esquinas redondeadas, y las piezas como fondos CSS posicionados (guirnalda arriba, Ratoncito esquina superior derecha, franja abajo, carril derecho repetido con `background-repeat: repeat-y`). Piezas: las webp que la app deja en `assets/carta/34/` y `assets/carta/56/` (Code las copia a `/assets/img/carta/34/` y `/56/` una vez existan; si aún no, hacer T1-T3 y dejar el CSS preparado). Cuerpo: `t34` 1,9 rem, `t56` 1,65 rem, `t79` 1,52 rem (actual). Referencia visual: `ratoncito code/Claude outputs/cartas-edad/rediseno/{3-4,5-6}-definitiva/carta-*-movil.png`.
5. **Impresión**: en `@media print`, las piezas se mantienen (son `background-image`; poner `-webkit-print-color-adjust: exact; print-color-adjust: exact` en `.letter-paper`). Comprobar que un A4 no corta la franja.
6. **Plausible**: `plausible('Carta generada', {props:{tramo: GEN.edad}})`.
7. **Copy alrededor**: en `/editable/` y `/carta-para-imprimir/` una línea nueva: «La carta cambia según la edad de tu peque: con 3-4 años es corta y llena de dibujos; a partir de 7, la carta clásica de la Oficina.» Sin tocar titles ni descriptions (regla del 14-oct).

## Bloque para Code

```
REPO: donbigotes-web
CARTA POR EDAD EN EL GENERADOR WEB — spec _docs/WEB-CARTA-POR-EDAD-20SEP.md (copiar desde monitor-geo). Requiere que ratoncito_app tenga ya assets/carta/34 y /56 (rama feature/cartas-edad-v2, T1); si no están, hacer T1-T3 y dejar T4 preparado.
T1. Extraer el generador a js/carta-gen.js y dejar /editable/ funcionando igual que hoy (sin cambios visibles). Commit.
T2. Chips «¿Cuántos años tiene?» (t34 · t56 por defecto · t79) + textos por tramo (docs/CARTAS-EDAD.md §4 de la app para t34/t56; t79 = actual) + prop tramo en Plausible. Commit.
T3. Aplicar el JS común a las otras 7 páginas (str_replace del script inline). Commit.
T4. Diseño por tramo en .letter-paper con las piezas webp en /assets/img/carta/{34,56}/, impresión comprobada en A4 (Chrome headless o captura). Línea de copy en /editable/ y /carta-para-imprimir/. Commit.
Después: tools/actualiza-fechas.sh solo sobre las páginas con cambio visible → commit [fechas] → push. Capturas de los 3 tramos (pantalla e impresión) → Claude outputs/web-carta-edad/ para OK de Xavi.
```

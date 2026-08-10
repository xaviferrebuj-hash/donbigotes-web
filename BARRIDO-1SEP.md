# BARRIDO DE COPY — dos triggers (creado 10-ago-2026)

Inventario **medido contra el repo real el 10-ago-2026**, no estimado. Los conteos de abajo
sustituyen a la estimación inicial hecha leyendo el HTML de producción: la estimación se quedaba
corta en los dos triggers.

---

## ⚠️ TRES COSAS QUE CAMBIAN CÓMO SE EJECUTA ESTE BARRIDO

**1. Cada claim está DOS veces: en `.html` y en `.md`.** Por eso 88 ocurrencias donde la
estimación decía ~30. **Los `.md` son GENERADOS**, no fuente (regla 5 del `CLAUDE.md` del repo):

> Se edita **solo el HTML** y después se ejecuta `python3 tools/generar_md.py`. **Nunca editar un
> `.md` a mano**: el siguiente regenerado lo pisa.

**2. `_partials/cta-app.html` NO se propaga solo.** Jekyll no publica directorios con `_` y las
páginas **no usan un include**: cada una lleva su **copia inline** del bloque, con un comentario
que dice *"fuente unica: /_partials/cta-app.html"*. Editar el parcial **no cambia nada en
producción**. Hay que replicar el cambio en las 17 páginas y actualizar el parcial para que la
"fuente única" no quede mintiendo. **Es la trampa principal de los dos triggers.**

**3. `/diploma-raton-perez/` NO es un modelo limpio.** Usa **las dos formas a la vez**: el hero
dice *"Gratis hasta el 1 de septiembre"* y la línea 325 dice *"Gratis durante el lanzamiento"*.
Hay que arreglar esa incoherencia igual que el resto.

---

# TRIGGER A: 1-sep-2026 (fin del modo gratuito, tras el flip de `finLanzamientoGratis`)

Preparación 25–28 ago · disparo el 1-sep.

## 1. Web (este repo) — inventario medido el 10-ago

### `"durante el lanzamiento"` — **88 ocurrencias en 35 archivos**

**50 en HTML (lo que se edita) · 38 en MD (se regeneran solos).** Las **17 páginas del sitio, sin
excepción**, lo contienen. La estimación previa decía "~13 de 15 páginas".

| Página | HTML | MD |
|---|---|---|
| `voz-raton-perez/` | **7** | 4 |
| `video-raton-perez/` | **7** | 4 |
| `foto-raton-perez/` | **6** | 4 |
| `comparativa-apps-ratoncito-perez/` | **5** | 4 |
| `app-raton-perez/` | **5** | 4 |
| `fotomontaje-ratoncito-perez/` | **4** | 3 |
| `viaje-del-diente/` | 2 | 2 |
| `prensa/` | 2 | 2 |
| `historia-raton-perez/` | 2 | 2 |
| `certificado-raton-perez/` | 2 | 2 |
| `ultimo-diente/` | 1 | 1 |
| `primer-diente/` | 1 | 1 |
| `/` (raíz) | 1 | 1 |
| `el-ratoncito-perez-existe/` | 1 | 1 |
| `editable/` | 1 | 1 |
| `diploma-raton-perez/` | 1 | 1 |
| `carta-para-imprimir/` | 1 | 1 |
| `_partials/cta-app.html` | 1 | — |
| **TOTAL** | **50** | **38** |

⚠️ **Ojo con dónde vive cada ocurrencia.** No todas son texto visible: hay claims dentro de
**JSON-LD `FAQPage`** (`voz`, `foto`, `video`, `comparativa`, `fotomontaje`) y dentro de
**`meta description`**. Un barrido que solo mire los `<p>` deja el dato viejo en el structured
data — que es justo lo que leen Google y las IAs.

### `"1 de septiembre"` / `"gratis hasta"` — **5 ocurrencias, 2 archivos**

Las cinco en `diploma-raton-perez/` (3 en HTML: hero + FAQ + JSON-LD; 2 en MD). El 1-sep pasan a
precio: *"Incluido en el Pack Mágico · 4,99 €"*.

### `"31 de agosto"` — **0 en la web**

La web nunca dice la fecha literal: usa *"durante el lanzamiento"* y, en diploma, *"1 de
septiembre"*. **La fecha literal solo vive fuera de este repo** (Uptodown y textos de outreach).

### Redacción de reemplazo (⚠️ APROBAR CON XAVI ANTES DEL DISPARO)

> **"El Pack Mágico completo, por 4,99 € en un único pago"**

🔴 **La carta sigue siendo GRATIS SIEMPRE — no tocar sus claims.** Antes de sustituir en bloque,
separar los claims de *Pack* de los de *carta*: en `carta-para-imprimir/`, `certificado/`,
`diploma/` y la home conviven los dos.

### `/prensa/`

Decidir con Xavi: **actualizar la NP** o **marcarla como histórica con fecha**. Recomendación:
marcarla como histórica — una nota de prensa reescrita a posteriori pierde el valor de documento
fechado, y `/prensa/` ya cumple la función de NP publicada.

### Procedimiento de ejecución (en este orden)

1. Editar los **50 puntos en HTML** con `str_replace` quirúrgico (regla 2 del repo).
2. Replicar el bloque CTA en las 17 páginas **y** en `_partials/cta-app.html`.
3. `python3 tools/generar_md.py` para regenerar los 38 puntos en MD.
4. `git status` para confirmar que los `.md` cambiaron solos y no a mano.
5. Commit + **push** (regla 3: un commit sin push no cuenta).
6. Verificar en producción a los 1-2 min (GitHub Pages).
7. Ping IndexNow con la clave existente `7873c101e46b4340be4a8e94c90016ac` — **no generar una
   nueva** (regla 9).

## 2. Ficha de Play (Console, NO este repo)

- Descripción larga ES contiene *"Gratis durante el lanzamiento."* (párrafo del Pack Mágico;
  verificado en la ficha pública el 10-ago).
- **Revisar TODOS los idiomas activos**, no solo ES.
- ⚠️ **Regla del selector de idiomas: verificar el pill del DOM antes de pegar, y contra recarga
  del servidor.**

## 3. Uptodown

Descripción menciona **"31 de agosto"** literal → **pendiente nº3 de Uptodown ya fichado**
(`donbigotes-leads/TRACKING.md:746` y `CONTACTOS.md:247`). Editar ~1-sep.

## 4. YouTube (canal @DonBigotesapp)

Dump de descripciones y grep:

```bash
yt-dlp --skip-download --print "%(id)s :: %(description)s" "https://www.youtube.com/@DonBigotesapp/shorts"
yt-dlp --skip-download --print "%(id)s :: %(description)s" "https://www.youtube.com/@DonBigotesapp/videos"
```

Solo cambiar claims del **Pack** gratis. **"La carta gratis" es permanente.**

## 5. Instagram (manual de Xavi, ~2 min)

Bio + destacados + captions fijadas.

## 6. Plantillas de outreach (`donbigotes-leads`) — ✅ **NADA QUE HACER**

Medido el 10-ago: **12 ocurrencias de "31 de agosto"**, y **ninguna es una plantilla viva**:

| Dónde | Qué es | Acción |
|---|---|---|
| `OUTREACH-MEDIOS.md` (10 hits: líneas 61, 139, 188, 303, 332, 358, 385, 412, 440, 469) | **Textos YA ENVIADOS** (Elisa Yuste, directorios, y los 7 pitches LATAM) | 🚫 **No tocar — histórico** |
| `TRACKING.md:746` · `CONTACTOS.md:247` | Las dos fichas del **pendiente de Uptodown** | Ya fichado, ver punto 3 |
| `PLANTILLAS.md` | **0 claims temporales.** Las plantillas A y B no mencionan fecha ni precio | ✅ Inmunes por diseño |

➡️ **Conclusión: el repo de leads no necesita barrido.** Que las plantillas reutilizables no lleven
fecha es la razón, y conviene mantenerlo así al redactar plantillas nuevas.

## 7. In-app

Cubierto por el **QA de modo pago del ~15-ago** (remote config). **Sin acción aquí.**

---

# TRIGGER B: aprobación de Apple (fecha desconocida, puede caer antes del 1-sep)

## Inventario medido el 10-ago

### `"Muy pronto en App Store"` — **27 ocurrencias en 18 archivos**

La estimación decía "6+ páginas". Son **17 páginas + el parcial**, es decir **todo el sitio**.
Nueve páginas lo llevan **dos veces** (bloque CTA superior e inferior): `/`, `voz`,
`ultimo-diente`, `foto`, `video`, `el-ratoncito-perez-existe`, `app-raton-perez`, `editable`,
`primer-diente`.

Todas son el mismo botón: `<a class="badge" href="#cap2">` o `href="#cap3"` (según la página
tenga el formulario de captación 2 o 3), **sin logo de Apple**, por guidelines.

### Además: **78 menciones de "App Store"** en HTML+JS

Incluye `js/enlaces-app.js`, que **centraliza los enlaces de app** (regla 6 del repo). **Ese
archivo es la palanca**: mirarlo antes de tocar página por página, porque parte del trabajo puede
resolverse ahí.

## Acciones

- Sustituir el botón por **enlace real a la App Store** — App ID **6798414411**.
- Los `href="#cap2"` / `href="#cap3"` apuntan a formularios de captación *"te aviso cuando salga"*:
  al publicarse iOS **dejan de tener sentido**. Decidir con Xavi si esos formularios se retiran,
  se reconvierten o se quedan.
- Ficha de Play y `/prensa/`: valorar añadir *"También en App Store"*.
- Emails/plantillas con *"iOS en camino"* → actualizar. En `donbigotes-leads` hay **7 menciones**
  de App Store/iOS (`TRACKING.md` 5, `OUTREACH-MEDIOS.md` 1, `CONTACTOS.md` 1); revisar cuáles son
  histórico y cuáles reutilizables antes de tocar.
- Mismo procedimiento que el Trigger A: HTML → parcial en las 17 páginas → `generar_md.py` →
  commit+push → verificar en producción → IndexNow.

---

## Comandos de re-verificación (relanzar antes de cada disparo)

```bash
cd ~/proyectos/donbigotes-web
grep -rn "urante el lanzamiento" --exclude-dir=.git .
grep -rn "1 de septiembre" --exclude-dir=.git .
grep -rni "gratis hasta" --exclude-dir=.git .
grep -rn "31 de agosto" --exclude-dir=.git .
grep -rn "Muy pronto en App Store" --exclude-dir=.git .
grep -rn "31 de agosto" --exclude-dir=.git ~/proyectos/donbigotes-leads/
```

**Los conteos de este archivo son del 10-ago-2026.** Si entre hoy y el disparo se publican páginas
nuevas, el inventario queda corto: re-medir, no fiarse de esta tabla.

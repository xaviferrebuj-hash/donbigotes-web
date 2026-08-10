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

---

# DECISIONES CERRADAS (10-ago-2026)

Aprobadas por Xavi. Lo de aquí abajo **ya no se discute en el disparo**: se ejecuta.

## Redacciones de reemplazo aprobadas (Trigger A, disparo 1-sep)

| Dónde | Texto aprobado |
|---|---|
| **Hero / CTA corto** | *"El Pack Mágico completo, 4,99 € en un único pago"* |
| **FAQ "¿Es gratis?"** — texto visible **Y** su espejo en JSON-LD `FAQPage` | *"La carta personalizada es gratis siempre. El Pack Mágico completo cuesta 4,99 € en un único pago, sin suscripciones."* |
| **Etiquetas de producto** (diploma, voz, video, fotomontaje) | *"Incluido en el Pack Mágico · 4,99 € pago único"* |

- 🔴 **El barrido incluye OBLIGATORIAMENTE JSON-LD y `meta description`**, no solo texto visible.
- **`/diploma-raton-perez/` entra en el barrido normal.** Hoy mezcla las dos formas; el 1-sep se
  unifica.

## `/prensa/` (Trigger A)

**NO se reescribe.** Se añade una línea de contexto:

> *"Nota de prensa del lanzamiento (julio 2026). El Pack Mágico pasó a ser de pago el
> 1-sep-2026."*

El cuerpo queda como **documento histórico fechado**.

## Método Trigger B — los 27 *"Muy pronto en App Store"*

- **SIN sistema de includes.** `sed` coordinado sobre el bloque CTA exacto en los **18 archivos
  HTML** + regenerar los `.md` con `tools/generar_md.py`.
- En el **mismo pase**, sustituir el comentario engañoso de cada copia:

  | Antes | Después |
  |---|---|
  | `fuente unica: /_partials/cta-app.html` | `bloque replicado en cada página — editar en TODAS a la vez, ver BARRIDO-1SEP.md` |

- **`_partials/cta-app.html`: se MARCA como no-fuente, NO se elimina.** *(Decisión de Code,
  declarada — el encargo la dejaba a mi criterio.)* Motivo: borrarlo deja 17 copias inline sin
  ninguna referencia canónica y la siguiente sesión no tendría contra qué comparar si una página
  se desincroniza. Se le añade una cabecera que diga que **no se publica y no se propaga**, y que
  es solo la plantilla de referencia del bloque. La regla 6 del `CLAUDE.md` del repo, que lo llama
  "parcial reutilizable", conviene matizarla en el mismo pase: reutilizable **a mano**, no por
  include.

## Trigger C: telemetría de la v0.7.0

### 🔴 REGLA DE TIMING — los claims actuales SON VERDAD hoy

**No se toca producción antes de que la telemetría exista.** Hasta que el código con
`telemetria.dart` esté publicado, *"no incluye analítica"* y *"una sola conexión"* son afirmaciones
**ciertas**. Adelantar el cambio no es prudencia: es publicar una afirmación falsa en la dirección
contraria, y encima regalar el argumento de privacidad semanas antes de tener que hacerlo.

### Disparo POR PLATAFORMA, no de una vez

| Superficie | Se dispara con | Por qué |
|---|---|---|
| **Web** (`fotomontaje`) + **ficha de Play** | **la release v0.7.0 de Android** | Es el primer binario con telemetría que llega a usuarios |
| **Ficha de App Store** (`ficha-app-store.md:112`) | **el primer envío iOS que incluya telemetría** | La 1.0 en revisión **no la lleva**: su claim sigue siendo cierto hasta que se envíe una build con ella |

⚠️ **No sincronizar los dos disparos.** Si iOS va por detrás, cambiar su ficha antes la vuelve
falsa. Cada plataforma cambia cuando su propio binario cambia.

### Inventario real (medido el 10-ago)

El grep original (`"una sola conexión"` / `"una única conexión"` **en este repo**) **daba 0
resultados**: el claim no estaba donde se suponía. **Corregido.**

| Superficie | Qué dice hoy | Acción |
|---|---|---|
| **`donbigotes-web`** | **0** de *"una sola/única conexión"* | — |
| 🔴 **`fotomontaje-ratoncito-perez/index.html:338`** | *"La app no incluye analítica, publicidad ni seguimiento de terceros."* | Sustituir + regenerar `.md` · **con la v0.7.0 Android** |
| 🔴 **`ratoncito_app/docs/app-store/ficha-app-store.md:112`** | *"…sin subidas a servidores, sin recogida de datos, sin SDKs de terceros. **Una sola conexión a internet en toda la app**, y es para generar la carta."* | Actualizar + **resubir a App Store Connect** · **con el primer envío iOS con telemetría** |
| 🔴 **Ficha de Play (Console)** | fuera de repo, **sin verificar** | **Comprobación pre-release v0.7.0** (ver abajo) |
| `donbigotes-leads` | 8 hits | 🚫 **No tocar — emails enviados, histórico** |

### Redacciones (Code, 10-ago — pendientes del OK de Xavi)

⚠️ **Las tres redacciones aprobadas no llegaron en el encargo** (venían como marcador
`[las tres del chat]`). Las de abajo son las mías; **no he podido compararlas con las suyas**.
Confirmar antes de usarlas.

**1. Ficha de App Store** — `ficha-app-store.md:112`. Ojo: **en ese párrafo mueren DOS cosas**, no
una. Además de *"una sola conexión"*, *"sin recogida de datos"* se vuelve discutible.

> Las fotos de tu familia no salen de tu iPhone. Todo el procesamiento de imágenes ocurre en tu
> dispositivo: sin subidas a servidores, **sin datos personales**, sin SDKs de terceros. La app se
> conecta a internet **para generar la carta y para enviar estadísticas de uso anónimas**.

**2. Web** — `fotomontaje-ratoncito-perez/index.html:338`:

> La app no incluye publicidad ni seguimiento de terceros. La analítica es propia, anónima y sin
> SDKs.

*(El `<h3>Sin tracking</h3>` que encabeza el bloque **se mantiene**: Plausible no rastrea entre
sitios ni usa identificadores. Lo que cambia es el cuerpo, no el titular.)*

**3. Norma para textos nuevos:**

> **Los claims de privacidad se escriben SEPARADOS, nunca encadenados.** Nada de *"cero SDKs, ni
> analítica, ni publicidad, ni crash reporting"* en una sola frase: cuando uno de los cuatro deja
> de ser cierto, arrastra a los otros tres y hay que reescribir la frase entera en todas las
> superficies.

### Distinción canónica

| Claim | v0.7.0 | Por qué |
|---|---|---|
| **"cero SDKs de terceros"** | ✅ **SOBREVIVE** | El `POST` directo a `plausible.io/api/event` no es un SDK |
| **"cero analítica"** | 🔴 **MUERE** | Habrá analítica: propia, anónima y sin SDK, pero analítica |
| "las fotos no salen del móvil" | ✅ SOBREVIVE | — |
| "sin datos personales" | ✅ SOBREVIVE | Props limitadas a `version` y `modo` |

Detalle completo en `ratoncito_app/SPEC-TELEMETRIA-V070.md`.

### Comprobación pre-release v0.7.0 (obligatoria)

**Revisar la ficha de Play en Console** —está fuera de todo repo, así que ningún grep la alcanza—
por si repite el claim de la conexión única o el de la analítica. **En todos los idiomas activos**,
con la regla del selector: verificar el pill del DOM antes de pegar y contra recarga del servidor.

**Greps corregidos del Trigger C:**

```bash
grep -rni "no incluye analítica\|sin analítica\|ni analítica\|cero analítica" --exclude-dir=.git ~/proyectos/donbigotes-web
grep -rni "sola conexi\|única conexi\|unica conexi\|recogida de datos" --exclude-dir=.git ~/proyectos/donbigotes-web "$HOME/proyectos/ratoncito/ratoncito code/ratoncito_app"
```

## Regla general

- **Editar SOLO `.html`** y regenerar los `.md` con `tools/generar_md.py` (regla 5). **Nunca
  editar un `.md` a mano.**
- **Repo `donbigotes-leads`: INMUNE por diseño** — plantillas sin fechas ni precios. **Mantener la
  costumbre** al redactar plantillas nuevas. *(Matiz: los textos ya enviados sí llevan fechas y
  claims caducos, pero son histórico y no se tocan.)*

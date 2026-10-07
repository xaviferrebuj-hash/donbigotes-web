# Crecimiento web — 7-oct-2026

Por qué: en 28 días, de 169 cartas generadas en la web ≤ 4 % siguió hacia la app y las
páginas de imprimibles (~290 visitantes) dieron 0 clics a tienda. Maqueta aprobada por Xavi
el 7-oct (textos definitivos).

## Qué cambió

| Cambio | Dónde | Commit |
|---|---|---|
| Redirecciones cortas `/d/`, `/c/`, `/es-419/d/`, `/es-419/c/` (las que comparte la app 0.10) | `d/`, `c/`, `es-419/d/`, `es-419/c/` (meta refresh 0, canonical a la home, noindex, fuera del sitemap) | e00b1cd |
| `ct` de App Store por grupo de página (adiós a `web-contenido`) | 30 páginas + `_partials/cta-app.html` | a125489 |
| Banda inferior para Android con enlace a Play | `js/enlaces-app.js` (todas las páginas que lo cargan, salvo las dos home) | 4872fc5 |
| Pantalla post-carta nueva: muestra de voz (solo ES), tienda según dispositivo | 12 páginas con generador, `js/carta-gen.js`, `assets/carta-gen.css` | 77385f2 |
| Bloque «La carta con su nombre, en un minuto y gratis» en imprimibles + respuesta directa en «existe» | 8 páginas de imprimibles y sus es-419 | 12cd0fc + 7960a20 [fechas] |
| Voz con el nombre en 4 s por grupos (ES y es-419) | `js/carta-gen.js`, `assets/audio/voz/g/`, `base-b-inicio.mp3`, 6 páginas es-419 | 68ff16f (8-oct) |
| `ct=web-existe` en «¿existe?» (ES y es-419) | 2 páginas | 6d862f4 (8-oct) |

### Pantalla post-carta
- Debajo de «Imprimir o guardar en PDF» / «Crear otra»: «✨ Tu carta está lista», tarjeta de
  voz, párrafo de la app, botón de tienda, letra pequeña, módulo del cuento y «Seguir solo con
  la carta» (la oculta y vuelve a la carta).
- Voz (desde el 8-oct, ES y es-419): «Hola,» + **el nombre** + «¡Shhh! Acércate, que te cuento
  un secreto.» (≈ 4 s; esa frase no dice «Ratoncito», así que vale para es-419). Web Audio, con
  la lógica de `muestra-voz.js` pero sin bajar el sprite entero (987 KB):
  - 16 sprites por grupo: `assets/audio/voz/g/00.mp3 … 15.mp3` + `.json` de offsets (29–116 KB
    cada uno; 120 ms de silencio entre nombres). Grupo = FNV-1a de 32 bits de la clave
    normalizada, módulo 16, calculado en el navegador: la URL lleva el número de grupo, nunca
    el nombre. Lista de claves en `CLAVES_VOZ` de `js/carta-gen.js`.
  - `base-b-inicio.mp3`: base-b cortado a los 2,95 s (silencio entre 2,755 y 3,187 s).
  - Se rehacen con `python3 tools/sprites_voz.py` si cambian `nombres.mp3` / `nombres.json`
    (que, como `muestra-voz.js`, se quedan en el repo sin usarse).
  - Descarga al pulsar: con nombre, base-a + carino + base-b-inicio (26,7 KB) + el grupo
    → **71–143 KB**; sin nombre en el banco, **26,7 KB**. Nada antes de pulsar.
  - Nombre completo → si no está, primera palabra («José Luis» → «José») → si no, genérica
    con «cariño» (mismas palabras que los 4 s de `preview-pack.mp3`). Sin Web Audio, esos 4 s
    de `preview-pack.mp3` con `<audio>`.
  - Suena con el `<audio>` de la tarjeta, no con Web Audio (8-oct, tras fallar en iPhone): los
    trozos se decodifican con un OfflineAudioContext, se juntan en un WAV en memoria y se le
    ponen al `<audio>`, que se desbloquea dentro del toque con 50 ms de silencio. Así suena
    también con el interruptor de silencio del iPhone.
- Tienda: Android → «Abrir en Google Play»; iPhone/iPad → «Consíguelo en el App Store»;
  resto → las dos insignias.
- `js/muestra-voz.js` ya no se carga (el fichero se queda).
- Textos: con nombre, «Pulsa y escucha al Ratoncito decir «{Nombre}».» (es-419: «Toca y escucha al
  Ratón Pérez decir «{Nombre}».»); genérica, «Pulsa y escucha una muestra del Ratoncito.» (es-419:
  «Toca y escucha una muestra del Ratón Pérez.»).

### Bloque de imprimibles
- Con descarga (certificado, firma y sello, carta para imprimir, diploma): debajo de los
  botones de descarga; el botón lleva a la home de su idioma (tiene el generador).
- Sin descarga (editable, primer diente, último diente, existe): tras el primer bloque de
  contenido; el botón abre el generador.

## Tabla de medición

### Eventos de Plausible (todos existían)
| Evento | Cuándo sale |
|---|---|
| `Preview voz postcarta` | Cada pulsación de «▶ Escuchar (4 s)» que pone a sonar la muestra (ES y es-419) |
| `Muestra de voz` | Solo cuando suena con el nombre (desde el 8-oct; el 7-oct salía también con la genérica) |
| `Clic Play Store postcarta` | Botón «Abrir en Google Play» o insignia de Play de la post-carta |
| `Clic App Store postcarta` | Botón «Consíguelo en el App Store» o insignia de App Store de la post-carta |
| `Clic Play Store` | Cualquier enlace a Play (incluida la banda Android y la post-carta) |
| `Clic App Store` | Cualquier enlace a App Store (incluida la post-carta) |
| `Crear carta - clic` | Abrir el generador; en las 4 páginas de imprimibles sin generador, al pulsar el bloque (y otra vez si abre el generador en la home) |
| `Carta generada` | Carta creada (prop `tramo`) |
| `Cuento web: desde carta` | Botón del cuento dentro de la post-carta |

### Atribución en tiendas
| Origen | Play (`referrer`) | App Store (`ct`) |
|---|---|---|
| Post-carta ES | `utm_source=web&utm_medium=postcarta&utm_campaign=postcarta` | `web-postcarta` |
| Post-carta es-419 | `…&utm_campaign=postcarta-419` | `web-postcarta-419` |
| Banda Android ES | `utm_source=web&utm_medium=banda&utm_campaign=banda-android` | — |
| Banda Android es-419 | `…&utm_campaign=banda-android-419` | — |
| Home (/, /es-419/) | `utm_medium=web-home` (sin cambio) | `web-home` |
| Pack (voz, vídeo, foto, fotomontaje, app) y cuento | `utm_medium=web-producto` (sin cambio) | `web-producto` (no se crea `web-pack`) |
| Imprimibles (7 + es-419) | `utm_medium=web-contenido` (sin cambio) | `web-imprimibles` |
| «¿Existe?» (ES y es-419) | `utm_medium=web-contenido` (sin cambio) | `web-existe` (desde el 8-oct) |
| Resto es-419 | `utm_medium=web-contenido` | `web-419` |
| Resto ES | `utm_medium=web-contenido` | `web-otras` |
| Enlaces compartidos desde la app | `/d/` → `utm_source=app&utm_medium=share&utm_campaign=diario` (`/c/` → `carta`; es-419 con `-419`) | — |

- Con UTM propias en la visita (outreach, o `/d/` y `/c/`), `enlaces-app.js` las pone como
  referrer de Play en toda la sesión, también en la post-carta (no en la banda).
- `tools/comprobar-atribucion.js` conoce los `ct` y `utm_medium` nuevos.

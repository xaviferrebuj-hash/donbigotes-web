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

### Pantalla post-carta
- Debajo de «Imprimir o guardar en PDF» / «Crear otra»: «✨ Tu carta está lista», tarjeta de
  voz, párrafo de la app, botón de tienda, letra pequeña, módulo del cuento y «Seguir solo con
  la carta» (la oculta y vuelve a la carta).
- Voz: **genérica**, los 4 primeros segundos de `assets/audio/preview-pack.mp3` (pausa natural
  a los 4,0 s). No se descarga nada hasta pulsar. La voz con el nombre no se usa: los paquetes
  de `don-bigotes-config` pesan 639 KB–3,6 MB por grupo (zip) y no tienen variante es-419.
- **es-419 no lleva tarjeta de voz**: no consta que la muestra no diga «Ratoncito».
- Tienda: Android → «Abrir en Google Play»; iPhone/iPad → «Consíguelo en el App Store»;
  resto → las dos insignias.
- `js/muestra-voz.js` ya no se carga (el fichero se queda).

### Bloque de imprimibles
- Con descarga (certificado, firma y sello, carta para imprimir, diploma): debajo de los
  botones de descarga; el botón lleva a la home de su idioma (tiene el generador).
- Sin descarga (editable, primer diente, último diente, existe): tras el primer bloque de
  contenido; el botón abre el generador.

## Tabla de medición

### Eventos de Plausible (todos existían)
| Evento | Cuándo sale |
|---|---|
| `Preview voz postcarta` | Pulsar «▶ Escuchar (4 s)» en la post-carta (solo ES) |
| `Muestra de voz` | Igual que el anterior, desde el 7-oct (antes: voz con el nombre de muestra-voz.js) |
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
| Pack (voz, vídeo, foto, fotomontaje, app) y cuento | `utm_medium=web-producto` (sin cambio) | `web-producto` (no pasó a `web-pack`: la regla era no tocar lo que no fuera `web-contenido`) |
| Imprimibles (8 + es-419, «existe» incluida) | `utm_medium=web-contenido` (sin cambio) | `web-imprimibles` |
| Resto es-419 | `utm_medium=web-contenido` | `web-419` |
| Resto ES | `utm_medium=web-contenido` | `web-otras` |
| Enlaces compartidos desde la app | `/d/` → `utm_source=app&utm_medium=share&utm_campaign=diario` (`/c/` → `carta`; es-419 con `-419`) | — |

- Con UTM propias en la visita (outreach, o `/d/` y `/c/`), `enlaces-app.js` las pone como
  referrer de Play en toda la sesión, también en la post-carta (no en la banda).
- `tools/comprobar-atribucion.js` conoce los `ct` y `utm_medium` nuevos.

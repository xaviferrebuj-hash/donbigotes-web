# Propuesta de titles y descriptions — 8-oct-2026

**PROPUESTA, sin aplicar.** Datos de Search Console, propiedad `https://donbigotes.app/`.
Ventana principal: **10-sep → 7-oct-2026** (28 días). Antes/después de los titles del 11-sep:
**12-sep → 8-oct** frente a **16-ago → 11-sep** (27 días cada uno).

## 1. Efecto de los titles aplicados el 11-sep

| Página | Impr. antes → después | Clics | CTR | Posición |
|---|---:|---:|---:|---:|
| `/firma-sello-raton-perez/` | 1.081 → 1.412 | 30 → 44 | 2,78 % → 3,12 % | 3,9 → 3,3 |
| `/el-ratoncito-perez-existe/` | 623 → 4.252 | 2 → 30 | 0,32 % → 0,71 % | 9,6 → 7,6 |
| `/certificado-raton-perez/` | 711 → 1.384 | 13 → 53 | 1,83 % → 3,83 % | 6,1 → 4,9 |
| `/foto-raton-perez/` | 293 → 780 | 4 → 26 | 1,37 % → 3,33 % | 7,9 → 7,3 |
| **Las 4** | **2.708 → 7.828** | **49 → 153** | **1,81 % → 1,95 %** | |
| Sitio entero (28 d) | 4.942 → 16.811 | 271 → 657 | 5,48 % → 3,91 % | 6,1 → 5,8 |

- **Las 4 subieron de CTR mientras el CTR del sitio bajó un 29 %** → el cambio de title ayudó
  [Probable]. No se puede aislar del todo: las 4 también subieron de posición y el sitio
  triplicó impresiones en el mismo periodo.
- El agregado de las 4 apenas sube (1,81 % → 1,95 %) porque «existe», la de CTR más bajo, pasó de
  623 a 4.252 impresiones y pesa casi el 55 % del total.
- Clics: **49 → 153** en las 4 (×3,1).

## 2. Las 5 páginas con más impresiones y CTR bajo (28 días)

`gsc_ctr_gaps` (CTR por debajo del 60 % del esperado para su posición) marca 4; la quinta es la
siguiente por impresiones con CTR por debajo de lo esperado.

| # | Página | Impr. | Clics | CTR | Pos. | CTR esperado | Clics posibles / 28 d |
|---|---|---:|---:|---:|---:|---:|---:|
| 1 | `/el-ratoncito-perez-existe/` | 4.304 | 31 | 0,72 % | 7,7 | 3,1 % | +102 |
| 2 | `/es-419/el-ratoncito-perez-existe/` | 2.233 | 9 | 0,40 % | 6,7 | 3,8 % | +75 |
| 3 | `/firma-sello-raton-perez/` | 1.541 | 48 | 3,11 % | 3,3 | 10 % | +106 |
| 4 | `/certificado-raton-perez/` | 1.384 | 53 | 3,83 % | 4,9 | ≈ 6 % | ≈ +30 |
| 5 | `/es-419/certificado-raton-perez/` | 937 | 27 | 2,88 % | 5,0 | 6 % | +29 |

Los «clics posibles» son el techo si el CTR llegara al esperado para su posición; un title no lo
consigue entero.

## 3. Propuestas

Límites: title ≤ 60 caracteres y description ≤ 155 (Google corta a partir de ahí en móvil). Al
aplicar, copiar también en `og:title`/`og:description` y `twitter:*` si la página los lleva. Es un
cambio de metadatos: sin pase de fechas (regla del 9-sep). Regenerar los `.md`.

### 1 · `/el-ratoncito-perez-existe/`
- **Dato**: «el ratón pérez existe» 1.257 impr., 4 clics, pos. 8,2; «el ratoncito pérez existe» 379
  impr., 0 clics; «existe el ratón pérez» 377 impr., 2 clics; «…o son los padres» 275 impr., 3 clics.
  La mitad de las impresiones vienen de Latinoamérica (México 557, Argentina 518, Colombia 371).
- Actual: `¿El Ratón Pérez existe o son los padres? La respuesta` (53) · `¿Existe de verdad o son
  los padres? Existe como personaje. Qué decirle a tu hijo sin mentirle: hasta los 5 años, de 6 a 8 y
  desde los 9.` (136)
- **Title**: `¿El Ratón Pérez existe? Sí, y así se lo explicas por edades` (59)
- **Description**: `Sí: existe como personaje desde 1894, y lo que pasa en tu casa lo hace real. Qué
  contestar a cada edad sin mentirle, y una carta gratis con su nombre.` (150)
- Por qué: la consulta es una pregunta de sí o no; el title actual la repite sin responderla. «Sí»
  al principio es la respuesta que el padre quiere oír y coincide con la respuesta directa añadida
  el 7-oct al principio de la página. ⚠️ En posición 7-8 el techo real es bajo: lo que mueve esta
  página es subir posiciones (contenido), no el title.

### 2 · `/es-419/el-ratoncito-perez-existe/`
- **Dato**: «el ratón pérez existe» 541 impr., 1 clic, pos. 6,8 (México 504); «existe el ratón
  pérez» 144 impr., 2 clics.
- Actual: `¿Existe el Ratón Pérez (Ratón de los Dientes)? Qué contestar` (60) · description de 141.
- **Title**: `¿El Ratón Pérez existe? Qué contestar según su edad` (51)
- **Description**: `Sí: el Ratón Pérez (el Ratón de los Dientes) existe como personaje desde 1894. Qué
  contestar a cada edad sin mentirle, y una carta gratis con su nombre.` (152)
- Por qué: el title actual abre con «¿Existe el…», pero se busca «el ratón pérez existe»; el
  paréntesis gasta 22 caracteres del title. «Ratón de los Dientes» pasa a la description, donde no
  quita sitio.

### 3 · `/firma-sello-raton-perez/`
- **Dato**: «firma del raton perez» 233 impr., pos. **1,7**, CTR 2,1 %; «firma raton perez» 271 impr.,
  pos. 3, CTR 2,6 %; «firma raton perez png» 11 impr., CTR 27 %. En posición 1-3 lo normal es un
  10-30 %.
- Actual: `Firma del Ratón Pérez y su sello: PNG y PDF gratis` (50) · description de 143.
- **Title**: `Firma del Ratón Pérez en PNG transparente y sello, gratis` (57)
- **Description**: `Firma y sello del Ratón Pérez en PNG con fondo transparente, para pegar en tu
  carta, y en PDF A4 para imprimir. Descarga directa, gratis y sin registro.` (152)
- Por qué: quien busca «firma del ratón pérez» quiere la imagen para pegarla; «PNG transparente» es
  justo lo que convierte (CTR del 27 % cuando la consulta dice «png»). ⚠️ [Suponiendo] Con CTR tan
  bajo en posición 1-2, lo más probable es que Google enseñe un bloque de imágenes encima y la gente
  se lleve la firma desde Google Imágenes sin entrar. El title no arregla eso; lo comprobaría
  buscándolo en un móvil antes de esperar mucho de este cambio.

### 4 · `/certificado-raton-perez/`
- **Dato**: «certificado del raton perez» 88 impr., 0 clics, pos. 5,4; «certificado raton perez» 66
  impr., 0 clics; «certificado del ratón pérez para imprimir» 45 impr., 0 clics, pos. 4. México:
  210 impr., CTR 0,5 %.
- Actual: `Certificado del Ratón Pérez para imprimir gratis (PDF)` (54) · description de 133.
- **Title**: `Certificado del Ratón Pérez por su primer diente: PDF gratis` (60)
- **Description**: `Certificado oficial de la Oficina del Ratón Pérez: PDF A4 gratis con firma y sello,
  para imprimir y escribir su nombre. Descarga directa, sin registro.` (151)
- Por qué: «primer diente» es el momento de la búsqueda (consultas «certificado primer diente…»,
  «diploma… primer diente») y diferencia el resultado de las plantillas genéricas; «oficial» y
  «firma y sello» son lo que no tiene una plantilla cualquiera.

### 5 · `/es-419/certificado-raton-perez/`
- **Dato**: «certificado raton perez» 117 impr., 1 clic, pos. 4,2; México 225 impr., CTR 1,8 %.
- Actual: `Certificado del Ratón Pérez o Ratón de los Dientes · PDF gratis` (**63, se corta**) ·
  description de **182, se corta**.
- **Title**: `Certificado del Ratón Pérez para imprimir gratis (PDF)` (54)
- **Description**: `Certificado del Ratón Pérez (Ratón de los Dientes) por el primer diente: PDF gratis
  con firma y sello, para imprimir y llenar con su nombre. Sin registro.` (154)
- Por qué: hoy title y description se cortan en el móvil, y justo se pierde «PDF gratis». El title
  que se propone es el que ya funciona en la versión de España (CTR 1,83 % → 3,83 % tras el 11-sep).

## Si se aplica

1. Editar `<title>`, `meta description` y sus `og:`/`twitter:` en las 5 páginas.
2. `python3 tools/generar_md.py` y `python3 tools/hreflang.py --check`.
3. Commit + push; IndexNow pinga las 5 URLs solas (su `index.html` cambia).
4. Medir a los 28 días con la misma comparación de la sección 1.

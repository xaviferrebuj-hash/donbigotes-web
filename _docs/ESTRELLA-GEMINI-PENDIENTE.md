# Estrella gris en la esquina: posible marca de agua de Gemini

**Decidido quitarla (27-sep-2026).** Estado:

- **Icono del ratón: hecho** (commit 445e899), desde el maestro limpio de
  `kit-outreach/tarjeta-vendedores/assets/icono-marca-limpio-2048.png`.
- **Retrato de fieltro de la plantilla de Reyes: hecho.** Maestro limpio en
  `_docs/maestros/retrato-carta-limpio-1024.png` (original de la app intacto); JPEG sustituido
  dentro de los dos PDF. En el PDF el retrato va recortado en círculo y la estrella no se veía.
- **Ratón escribiendo: hecho.** Maestro limpio en
  `_docs/maestros/carta-ratoncito-escribiendo-limpia-1024.png` (de `carta.png` de la app, intacto),
  con la estrella tapada por la madera de la misma fila. Sustituido en
  `assets/img/ratoncito-escribiendo-carta.jpg` y en la foto en línea de 7 páginas.
- **Firma: hecha.** Maestro limpio en `_docs/maestros/carta-firma-limpia-340x190.png`. Sustituida
  en `assets/img/carta-firma.png`, en la firma en línea de 7 páginas y dentro de
  `descargas/carta-ratoncito-perez.pdf`.
- **Sello de la web: sin estrella.** Su fondo es transparente del todo; solo la lleva el original
  de la app.
- **Diploma (`diploma-valentia.jpg`): se queda con la estrella.** Cae sobre el filo de la cinta,
  entre la cinta y el papel, y cualquier parche se nota al 100 %.
- **Fuera de la web, con la estrella:** el repo de la app (icono, retrato, ratón escribiendo, firma
  y sello originales), `kit-outreach` y `pinterest-pines`. No se tocan desde este repo.

El icono del ratón lleva en la esquina inferior derecha una estrella de cuatro puntas gris
claro, distinta de las estrellas doradas del dibujo. Por forma y posición parece la marca de
agua visible de Gemini. Viene del máster de 2048 px del icono (repo de la app), así que
aparece en todo lo que deriva de él.

## Icono del ratón (ficheros publicados en esta web)

| Fichero | Visibilidad |
|---|---|
| `prensa/kit/icono-don-bigotes-1024.png` | Visible |
| `prensa/kit/icono-don-bigotes-512.png` | Visible |
| `og.png` | Visible. Es el `og:image` de 34 páginas y la `image`/`logo` del JSON-LD |
| `prensa/kit/imagen-don-bigotes-1024x500.png` | Visible (mismo fichero que `og.png`) |
| `prensa/kit/press-kit-don-bigotes.zip` | Contiene los dos iconos y la imagen 1024x500 |
| Favicon en línea (JPEG 256 px en `data:`) de 23 páginas HTML | Visible a 256 px |
| `favicon.ico` (48 px) | 1-2 px: no se distingue |

## Icono del ratón fuera de esta web

- Icono de la ficha de Google Play (512 px).
- Icono de Uptodown (200 px): probable, es el mismo arte.

## Otras imágenes de la web con el mismo tipo de destello (esquina inferior derecha)

| Fichero | Visibilidad |
|---|---|
| `assets/img/ratoncito-escribiendo-carta.jpg` | Clara |
| `diploma-valentia.jpg` | Visible, sobre la cinta |
| `assets/img/carta-sello-oficina.png` | Muy tenue |
| `assets/img/carta-firma.png` | Muy tenue |

**Sin revisar:** los PDF de `descargas/` salvo la plantilla de Reyes y la carta ES, y las capturas
del kit (`prensa/kit/android/`, `prensa/kit/iphone/`).

#!/usr/bin/env bash
# Sincroniza las tres señales de frescura de las páginas que se le indiquen con
# la fecha de su último commit de contenido en git:
#   - <p class="fecha-actualizacion">Última actualización: D de MES de AAAA</p>
#   - JSON-LD "dateModified":"AAAA-MM-DD"
#   - sitemap.xml <lastmod> de la URL correspondiente
#
# Uso, desde la raíz del repo y DESPUÉS de commitear los cambios de contenido:
#   bash tools/actualiza-fechas.sh <ruta> [<ruta>...]
# Ejemplo:
#   bash tools/actualiza-fechas.sh el-ratoncito-perez-existe es-419/el-ratoncito-perez-existe
# La home se indica como "." (o "/").
# Luego regenerar los .md (tools/generar_md.py) y commitear con "[fechas]" en el mensaje.
#
# Las rutas son SIEMPRE explícitas: el script no decide por su cuenta qué páginas
# tocar. Antes barría el sitemap entero y ponía en cada página la fecha del último
# commit que hubiera tocado su index.html, así que un commit cosmético que rozara
# 25 ficheros (un retoque de footer) desplazaba las 25 fechas y había que revertir
# a mano. Con rutas explícitas eso no puede volver a pasar.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="https://donbigotes.app/"
MESES=(enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre)

uso() {
  cat >&2 <<'USO'
Uso: bash tools/actualiza-fechas.sh <ruta> [<ruta>...]

  <ruta>  ruta de la página sin host ni barras sobrantes, tal como aparece en
          el sitemap. La home es ".".

Ejemplos:
  bash tools/actualiza-fechas.sh el-ratoncito-perez-existe
  bash tools/actualiza-fechas.sh . prensa es-419/app-raton-perez

Después: python3 tools/generar_md.py y commit con "[fechas]" en el mensaje.
USO
  exit 1
}

[ $# -gt 0 ] || uso

# --- Fase 1: validar TODO antes de escribir nada -----------------------------
declare -a URLS FICHEROS ISOS
errores=0

for arg in "$@"; do
  ruta="${arg#/}"; ruta="${ruta%/}"
  [ "$ruta" = "." ] && ruta=""
  url="${HOST}${ruta:+$ruta/}"
  f="${ruta:+$ruta/}index.html"

  if ! grep -qF "<loc>${url}</loc>" sitemap.xml; then
    echo "ERROR: '$arg' no está en sitemap.xml (esperaba <loc>${url}</loc>)" >&2
    errores=1; continue
  fi
  if [ ! -f "$f" ]; then
    echo "ERROR: '$arg' no tiene fichero $f" >&2
    errores=1; continue
  fi
  # Los commits que solo sincronizan fechas NO cuentan como edición: se excluyen
  # por el marcador [fechas] del mensaje. Los dos primeros, anteriores al
  # marcador, van por su asunto literal.
  iso=$(git log -1 --format=%cs --invert-grep \
        --grep='\[fechas\]' \
        --grep='^Frescura coherente: fecha visible' \
        --grep='^Prensa: fecha de actualizacion tras el commit e52fe28' \
        -- "$f")
  if [ -z "$iso" ]; then
    echo "ERROR: '$arg' no tiene commits de contenido en $f" >&2
    errores=1; continue
  fi

  URLS+=("$url"); FICHEROS+=("$f"); ISOS+=("$iso")
done

if [ "$errores" -ne 0 ]; then
  echo "Abortado: no se ha modificado ningún fichero." >&2
  exit 1
fi

# --- Fase 2: escribir --------------------------------------------------------
for i in "${!URLS[@]}"; do
  url="${URLS[$i]}"; f="${FICHEROS[$i]}"; iso="${ISOS[$i]}"
  y=${iso%%-*}; m=${iso#*-}; m=${m%%-*}; d=${iso##*-}
  d=$((10#$d)); mes=${MESES[$((10#$m - 1))]}
  legible="Última actualización: $d de $mes de $y"

  sed -i '' -E "s#(<p class=\"fecha-actualizacion\">)[^<]*(</p>)#\1${legible}\2#" "$f"
  sed -i '' -E "s#(\"dateModified\": ?\")[0-9]{4}-[0-9]{2}-[0-9]{2}(\")#\1${iso}\2#" "$f"
  python3 - "$url" "$iso" <<'PY'
import re,sys
url,iso=sys.argv[1],sys.argv[2]
s=open('sitemap.xml',encoding='utf-8').read()
s2,n=re.subn(r'(<loc>'+re.escape(url)+r'</loc>\s*<lastmod>)[^<]*(</lastmod>)',r'\g<1>'+iso+r'\g<2>',s)
if n!=1: print(f"AVISO: {url} lastmod no encontrado ({n})")
open('sitemap.xml','w',encoding='utf-8').write(s2)
PY
  printf '%-48s %s\n' "$url" "$iso"
done

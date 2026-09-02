#!/usr/bin/env bash
# Sincroniza las tres señales de frescura de cada página HTML del sitemap con la
# fecha de su último commit en git:
#   - <p class="fecha-actualizacion">Última actualización: D de MES de AAAA</p>
#   - JSON-LD "dateModified":"AAAA-MM-DD" (cada index.html lleva uno solo)
#   - sitemap.xml <lastmod> de la URL correspondiente
# Uso, desde la raíz del repo y DESPUÉS de commitear los cambios de contenido:
#   bash tools/actualiza-fechas.sh
# Luego regenerar los .md (tools/generar_md.py) y commitear con "[fechas]" en el mensaje.
# Solo toca páginas (URLs acabadas en /); los ficheros de descargas/ no se tocan.
set -euo pipefail
cd "$(dirname "$0")/.."

MESES=(enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre)

grep -o '<loc>[^<]*</loc>' sitemap.xml | sed -E 's#</?loc>##g' | grep '/$' | while read -r url; do
  ruta="${url#https://donbigotes.app/}"
  f="${ruta}index.html"
  [ -f "$f" ] || { echo "AVISO: no existe $f"; continue; }
  # Los commits que solo sincronizan fechas NO cuentan como edición: se
  # excluyen por el marcador [fechas] del mensaje (ponerlo siempre al commitear
  # la salida de este script). Los dos primeros, anteriores al marcador, van
  # por su asunto literal.
  iso=$(git log -1 --format=%cs --invert-grep \
        --grep='\[fechas\]' \
        --grep='^Frescura coherente: fecha visible' \
        --grep='^Prensa: fecha de actualizacion tras el commit e52fe28' \
        -- "$f")
  [ -n "$iso" ] || { echo "AVISO: $f sin commits"; continue; }
  y=${iso%%-*}; m=${iso#*-}; m=${m%%-*}; d=${iso##*-}
  d=$((10#$d)); mes=${MESES[$((10#$m - 1))]}
  legible="Última actualización: $d de $mes de $y"

  sed -i '' -E "s#(<p class=\"fecha-actualizacion\">)[^<]*(</p>)#\1${legible}\2#" "$f"
  sed -i '' -E "s#(\"dateModified\": ?\")[0-9]{4}-[0-9]{2}-[0-9]{2}(\")#\1${iso}\2#" "$f"
  # lastmod: la línea que sigue al <loc> de esta URL
  python3 - "$url" "$iso" <<'PY'
import re,sys
url,iso=sys.argv[1],sys.argv[2]
s=open('sitemap.xml',encoding='utf-8').read()
s2,n=re.subn(r'(<loc>'+re.escape(url)+r'</loc>\s*<lastmod>)[^<]*(</lastmod>)',r'\g<1>'+iso+r'\g<2>',s)
if n!=1: print(f"AVISO: {url} lastmod no encontrado ({n})")
open('sitemap.xml','w',encoding='utf-8').write(s2)
PY
  printf '%-40s %s\n' "$url" "$iso"
done

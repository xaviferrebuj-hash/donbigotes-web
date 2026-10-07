#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera los sprites de nombres por grupo de la muestra de voz post-carta.

Uso, desde la raíz del repo:  python3 tools/sprites_voz.py
Necesita ffmpeg con libmp3lame. Rehacer si cambian nombres.mp3 / nombres.json.

Parte de assets/audio/voz/nombres.mp3 + nombres.json (235 nombres, 987 KB) y escribe:
  - assets/audio/voz/g/00.mp3 … 15.mp3 + 00.json … 15.json: los nombres repartidos en 16
    grupos con FNV-1a de 32 bits de la clave normalizada, módulo 16 (la misma función que
    calcula js/carta-gen.js en el navegador: la URL solo lleva el número de grupo).
  - assets/audio/voz/base-b-inicio.mp3: base-b hasta «…que te cuento un secreto.»
  - imprime la lista de claves para CLAVES_VOZ de js/carta-gen.js.
Se recodifica (no se cortan frames): mismo formato que el original, MP3 48 kbps CBR,
48 kHz, mono, con cabecera LAME (sin hueco al decodificar). Entre nombres van 120 ms de
silencio y cada recorte lleva 5 ms de fundido para que no haya picos en los cortes.
"""
import json
import os
import subprocess
import sys
from array import array

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOZ = os.path.join(BASE, "assets", "audio", "voz")
SR = 48000
GRUPOS = 16
PAUSA = int(0.12 * SR)
FUNDIDO = int(0.005 * SR)
# Fin de «…que te cuento un secreto.» en base-b: silencio entre 2,755 s y 3,187 s
# (silencedetect -35 dB); se corta dentro, con 20 ms de fundido.
CORTE_B = 2.95


def fnv1a(clave):
    h = 0x811C9DC5
    for c in clave:
        h ^= ord(c)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return h


def grupo(clave):
    return "%02d" % (fnv1a(clave) % GRUPOS)


def decodifica(ruta):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", ruta, "-f", "s16le", "-ac", "1",
                          "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    a = array("h")
    a.frombytes(raw)
    return a


def codifica(pcm, ruta):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1",
                    "-i", "-", "-c:a", "libmp3lame", "-b:a", "48k", "-ar", str(SR), "-ac", "1",
                    ruta], input=pcm.tobytes(), check=True)


def funde(trozo, n_in, n_out):
    for i in range(min(n_in, len(trozo))):
        trozo[i] = int(trozo[i] * i / n_in)
    for i in range(min(n_out, len(trozo))):
        j = len(trozo) - 1 - i
        trozo[j] = int(trozo[j] * i / n_out)
    return trozo


def main():
    clips = json.load(open(os.path.join(VOZ, "nombres.json"), encoding="utf-8"))["clips"]
    todo = decodifica(os.path.join(VOZ, "nombres.mp3"))
    os.makedirs(os.path.join(VOZ, "g"), exist_ok=True)
    por_grupo = {}
    for clave in sorted(clips):
        por_grupo.setdefault(grupo(clave), []).append(clave)
    informe = []
    for g in ["%02d" % i for i in range(GRUPOS)]:
        pcm = array("h", [0] * PAUSA)
        offs = {}
        for clave in por_grupo.get(g, []):
            c = clips[clave]
            a, b = int(round(c["start"] * SR)), int(round((c["start"] + c["dur"]) * SR))
            offs[clave] = {"start": round(len(pcm) / SR, 4), "dur": round((b - a) / SR, 4)}
            pcm.extend(funde(todo[a:b], FUNDIDO, FUNDIDO))
            pcm.extend([0] * PAUSA)
        mp3 = os.path.join(VOZ, "g", g + ".mp3")
        codifica(pcm, mp3)
        json.dump({"version": 1, "grupo": g, "sampleRate": SR, "clips": offs},
                  open(os.path.join(VOZ, "g", g + ".json"), "w", encoding="utf-8"),
                  ensure_ascii=False, separators=(",", ":"))
        # Comprobación: duración al decodificar y picos en los bordes de cada recorte.
        dec = decodifica(mp3)
        borde = 0
        for o in offs.values():
            a = int(o["start"] * SR)
            b = a + int(o["dur"] * SR)
            for x in (dec[a:a + 48], dec[b - 48:b]):
                borde = max(borde, max((abs(v) for v in x), default=0))
        informe.append((g, len(offs), os.path.getsize(mp3), round(len(pcm) / SR, 3),
                        round(len(dec) / SR, 3), borde))
    b = decodifica(os.path.join(VOZ, "base-b.mp3"))
    ini = funde(b[:int(CORTE_B * SR)], 0, int(0.02 * SR))
    codifica(ini, os.path.join(VOZ, "base-b-inicio.mp3"))
    dec = decodifica(os.path.join(VOZ, "base-b-inicio.mp3"))
    print("grupo nombres bytes dur_pcm dur_decod pico_borde(1 ms)")
    for fila in informe:
        print(*fila)
    print("base-b-inicio:", os.path.getsize(os.path.join(VOZ, "base-b-inicio.mp3")), "bytes,",
          round(len(dec) / SR, 3), "s")
    print("CLAVES_VOZ =", json.dumps(sorted(clips), separators=(",", ":")))


if __name__ == "__main__":
    sys.exit(main())

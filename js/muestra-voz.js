/* ============================================================
   Don Bigotes — Muestra de voz post-carta con el nombre del niño
   ------------------------------------------------------------
   Monta en el navegador, con Web Audio, la nota de voz de muestra:
     base-a → nombre → base-b → nombre → base-c
   El nombre sale de un sprite local (assets/audio/voz/nombres.mp3 +
   nombres.json con start/dur por clave). Si el nombre no está en el
   banco suena «cariño» (carino.mp3). El nombre NUNCA sale del
   navegador: ni en URLs, ni en analítica.

   Requisitos que cumple:
   - Nada se descarga hasta que el usuario pulsa play; los seis
     archivos se piden y decodifican una sola vez (caché en memoria).
   - El AudioContext se crea/reanuda DENTRO del handler del clic
     (iOS Safari).
   - Programación sample-accurate: cada pieza empieza donde termina
     la anterior (duración real del buffer decodificado).
   - Sin Web Audio (o si algo falla): fallback al <audio> con
     preview-pack.mp3 y su texto de siempre.
   ============================================================ */
(function () {
  "use strict";

  var RUTA = "/assets/audio/voz/";
  var ARCHIVOS = ["base-a", "base-b", "base-c", "carino", "nombres"];
  var LATAM = (document.documentElement.getAttribute("lang") || "") === "es-419";
  var RATON = LATAM ? "Ratón Pérez" : "Ratoncito";

  var TXT = {
    antes: "Pulsa y escucha cómo dice su nombre.",
    cargando: "Cargando…",
    enBanco: "Así se lo dirá esta noche.",
    fuera: "Su nombre aún no está entre los más de 200 grabados; el " + RATON +
           " le llama «cariño». Vamos añadiendo nombres cada mes.",
    fallback: "Así suena cuando el nombre no está en el banco. En la app, con más de 200 nombres grabados, el " +
              RATON + " dirá el de tu peque."
  };

  var btn = document.getElementById("pcPlay");
  var label = document.getElementById("pcVozL");
  var audioFallback = document.getElementById("pcAudio");
  var inputNombre = document.getElementById("gnombre");
  if (!btn || !label) return;

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  var buffers = null;      // { "base-a": AudioBuffer, ... }
  var sprite = null;       // nombres.json
  var cargando = null;     // Promise de la carga (una sola vez)
  var fuentes = [];        // BufferSources en reproducción
  var sonando = false;
  var usarFallback = !AC;

  label.textContent = TXT.antes;

  function icono(playing) {
    btn.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
  }

  function plausible(nombreEvento, props) {
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    try { window.plausible(nombreEvento, props ? { props: props } : undefined); } catch (e) { /* nada */ }
  }

  /* --- Clave del nombre: trim, minúsculas, sin acentos, espacios → guion --- */
  function normalizar(nombre) {
    var s = (nombre || "").trim().toLowerCase();
    try { s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) { /* sin normalize */ }
    s = s.replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
    return s;
  }

  // Devuelve { clave, enBanco }: clave completa → primer token → "carino".
  function resolverClave(nombre) {
    var clips = (sprite && sprite.clips) || {};
    var completa = normalizar(nombre);
    if (completa && clips[completa]) return { clave: completa, enBanco: true };
    var primero = completa.split("-")[0];
    if (primero && clips[primero]) return { clave: primero, enBanco: true };
    return { clave: "carino", enBanco: false };
  }

  /* --- Carga y decodificación (una vez) --- */
  function decodificar(datos) {
    return new Promise(function (ok, ko) {
      var r;
      try {
        r = ctx.decodeAudioData(datos, ok, ko); // forma con callbacks: Safari antiguo
      } catch (e) { ko(e); return; }
      if (r && typeof r.then === "function") r.then(ok, ko);
    });
  }

  function descargar(nombreArchivo, ext) {
    return fetch(RUTA + nombreArchivo + "." + ext, { cache: "force-cache" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " " + nombreArchivo);
      return ext === "json" ? res.json() : res.arrayBuffer();
    });
  }

  function cargarTodo() {
    if (cargando) return cargando;
    var tareas = ARCHIVOS.map(function (n) {
      return descargar(n, "mp3").then(decodificar);
    });
    tareas.push(descargar("nombres", "json"));
    cargando = Promise.all(tareas).then(function (r) {
      buffers = {};
      ARCHIVOS.forEach(function (n, i) { buffers[n] = r[i]; });
      sprite = r[ARCHIVOS.length];
    });
    cargando.catch(function () { cargando = null; });
    return cargando;
  }

  /* --- Reproducción --- */
  function pieza(buffer, cuando, offset, dur) {
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    if (offset !== undefined) src.start(cuando, offset, dur);
    else src.start(cuando);
    fuentes.push(src);
    return src;
  }

  function parar() {
    fuentes.forEach(function (s) { try { s.onended = null; s.stop(); } catch (e) { /* ya parada */ } });
    fuentes = [];
    sonando = false;
    icono(false);
  }

  function reproducir(nombre) {
    var res = resolverClave(nombre);
    var clip;
    if (res.enBanco) {
      var c = sprite.clips[res.clave];
      clip = { buffer: buffers.nombres, offset: c.start, dur: c.dur };
    } else {
      clip = { buffer: buffers.carino, offset: 0, dur: buffers.carino.duration };
    }
    var t = ctx.currentTime + 0.05;
    var secuencia = [
      { buffer: buffers["base-a"] }, clip,
      { buffer: buffers["base-b"] }, clip,
      { buffer: buffers["base-c"] }
    ];
    var ultima = null;
    secuencia.forEach(function (p) {
      var dur = p.dur !== undefined ? p.dur : p.buffer.duration;
      ultima = pieza(p.buffer, t, p.offset, p.dur);
      t += dur;
    });
    ultima.onended = function () { sonando = false; fuentes = []; icono(false); };
    sonando = true;
    icono(true);
    label.textContent = res.enBanco ? TXT.enBanco : TXT.fuera;
    plausible("Muestra de voz", { enBanco: res.enBanco ? "si" : "no" });
  }

  /* --- Fallback: <audio> con preview-pack.mp3 --- */
  function fallback() {
    usarFallback = true;
    if (!audioFallback) return;
    label.textContent = TXT.fallback;
    if (audioFallback.paused) {
      audioFallback.play();
      plausible("Preview voz postcarta");
    } else {
      audioFallback.pause();
    }
  }

  btn.addEventListener("click", function () {
    if (usarFallback) { fallback(); return; }
    if (sonando) { parar(); return; }
    try {
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) { fallback(); return; }

    var nombre = inputNombre ? inputNombre.value : "";
    btn.disabled = true;
    label.textContent = TXT.cargando;
    cargarTodo().then(function () {
      btn.disabled = false;
      reproducir(nombre);
    }).catch(function () {
      btn.disabled = false;
      fallback();
    });
  });

  // Para poder parar desde la página (p. ej. al crear otra carta).
  window.muestraVoz = { parar: parar };
})();

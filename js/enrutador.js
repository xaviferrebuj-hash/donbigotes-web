/* ============================================================
   Don Bigotes — Enrutador a las tiendas  (/carta/ y /app/)
   ------------------------------------------------------------
   Detecta el sistema y manda a la tienda con la atribución del canal:
     · iPhone/iPad -> App Store con pt/ct/mt (ct = canal, informe de
       campañas de App Store Connect).
     · Android     -> Google Play con referrer (utm_source = canal,
       utm_medium = medio; utm_campaign repite el medio porque Play
       Console desglosa por fuente y campaña, no por medio).
     · Ordenador   -> no redirige: se ven las dos insignias.

   Canal: /carta/ lo fija con data-canal="carta" en la etiqueta <script>;
   /app/ lo lee de ?utm_source=. Lista cerrada: cualquier otro valor -> «otros».
   Medio: ?utm_medium=, solo [a-z0-9-] y máximo 20 caracteres (en /carta/,
   solo qr o whatsapp). Si no cumple -> «otros». Nada más de la URL viaja
   a las tiendas: ni nombres ni datos personales.

   La visita de Plausible (script.manual.js) se registra ANTES de salir:
   redirige en el callback de Plausible o a los 800 ms, lo que llegue antes.
   Sin cookies ni almacenamiento.
   ============================================================ */
(function () {
  "use strict";

  var APP_STORE = "https://apps.apple.com/app/apple-store/id6798414411";
  var PROVEEDOR = "129172273"; // pt: proveedor de App Store Connect
  var PLAY = "https://play.google.com/store/apps/details?id=es.donbigotes.app";

  var CANALES = ["carta", "ampa", "dentista", "vendedor", "creadora", "web"];
  var MEDIOS_CARTA = ["qr", "whatsapp"];
  var ESPERA_MS = 800;

  var script = document.currentScript;
  var canalFijo = script ? script.getAttribute("data-canal") : null;

  function parametro(nombre) {
    try {
      return (new URLSearchParams(window.location.search).get(nombre) || "")
        .trim().toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function canal() {
    var c = canalFijo || parametro("utm_source");
    return CANALES.indexOf(c) !== -1 ? c : "otros";
  }

  function medio(c) {
    var m = parametro("utm_medium");
    if (c === "carta" && canalFijo) return MEDIOS_CARTA.indexOf(m) !== -1 ? m : "otros";
    return /^[a-z0-9-]{1,20}$/.test(m) ? m : "otros";
  }

  // iPhone/iPad (incluye iPadOS, que se anuncia como Mac con pantalla táctil).
  function esIOS() {
    var ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) ||
           (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }

  function esAndroid() {
    return /Android/i.test(navigator.userAgent || "");
  }

  var c = canal();
  var m = medio(c);
  var urlIOS = APP_STORE + "?pt=" + PROVEEDOR + "&ct=" + c + "&mt=8";
  var urlAndroid = PLAY + "&referrer=" + encodeURIComponent(
    "utm_source=" + c + "&utm_medium=" + m + "&utm_campaign=" + m);

  var enlaces = document.querySelectorAll("[data-tienda]");
  for (var i = 0; i < enlaces.length; i++) {
    enlaces[i].setAttribute("href",
      enlaces[i].getAttribute("data-tienda") === "appstore" ? urlIOS : urlAndroid);
  }

  // Ordenador: sin destino, se queda con las dos insignias.
  var destino = esIOS() ? urlIOS : (esAndroid() ? urlAndroid : null);
  if (destino) {
    document.documentElement.className += esIOS() ? " es-ios" : " es-android";
  }

  var hecho = false;
  function ir() {
    if (hecho || !destino) return;
    hecho = true;
    window.location.replace(destino);
  }

  window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
  window.plausible("pageview", { callback: ir });
  if (destino) window.setTimeout(ir, ESPERA_MS);
})();

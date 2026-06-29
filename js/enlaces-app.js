/* ============================================================
   Don Bigotes — Enlaces de la app  (FUENTE ÚNICA DE VERDAD)
   ------------------------------------------------------------
   Cambia los enlaces SOLO aquí y se actualizan en TODAS las
   páginas que carguen este archivo.

   Cómo funciona en cada página:
   - El HTML del bloque CTA está SIEMPRE presente (lo ven los
     buscadores). Este script solo rellena el `href` al cargar.
   - Marca cada enlace con  data-enlace="webapp|playstore|appstore".

   Estado actual (jun 2026): la app está en PRUEBA CERRADA, aún
   NO en producción pública. Por eso:
     · webapp    -> destino real de uso inmediato (web app).
     · playstore -> apunta a la web app hasta que haya ficha
                    pública en Google Play (entonces pega la URL).
     · appstore  -> null  => el badge se OCULTA (sin versión iOS).
   ============================================================ */
(function () {
  "use strict";

  var ENLACES = {
    // TODO Xavi: confirmar la URL real de la web app (uso inmediato, sin instalar).
    webapp: "https://donbigotes.app/",

    // Cuando la app esté en PRODUCCIÓN pública, pega aquí la URL de la ficha de Google Play.
    // Mientras sea null, el badge de Play lleva a la web app (mismo destino que "Abrir la app").
    playstore: null,

    // Cuando exista versión iOS, pega aquí la URL de App Store.
    // Mientras sea null, el badge de App Store se oculta.
    appstore: null
  };

  function destino(tipo) {
    if (tipo === "playstore") return ENLACES.playstore || ENLACES.webapp;
    if (tipo === "appstore")  return ENLACES.appstore; // null => ocultar
    return ENLACES.webapp;
  }

  function aplicar() {
    var nodos = document.querySelectorAll("[data-enlace]");
    for (var i = 0; i < nodos.length; i++) {
      var el = nodos[i];
      var url = destino(el.getAttribute("data-enlace"));
      if (!url) { el.hidden = true; el.style.display = "none"; continue; }
      el.setAttribute("href", url);
      if (/^https?:/i.test(url)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicar);
  } else {
    aplicar();
  }
})();

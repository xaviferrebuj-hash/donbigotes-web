/* ============================================================
   Don Bigotes — Enlaces de la app  (FUENTE ÚNICA DE VERDAD)
   ------------------------------------------------------------
   Cambia los enlaces SOLO aquí y se actualizan en TODAS las
   páginas que carguen este archivo.

   Cómo funciona en cada página:
   - El HTML del bloque CTA está SIEMPRE presente (lo ven los
     buscadores). Este script solo rellena el `href` al cargar.
   - Marca cada enlace con  data-enlace="webapp|playstore|appstore".

   Estado actual (jul 2026): la app está EN PRODUCCIÓN pública
   en Google Play (verificado 26-jul: ficha accesible sin login).
     · webapp    -> destino real de uso inmediato (web app).
     · playstore -> ficha pública de Google Play.
     · appstore  -> null  => el badge se OCULTA (sin versión iOS).

   ATRIBUCIÓN POR CANAL (jul 2026):
   - Si la visita llega con parámetros utm_* (p. ej. desde un email
     de outreach), este script los guarda en sessionStorage y los
     reinyecta en TODOS los enlaces a Google Play como `&referrer=`
     URL-encoded. Así Play Console puede desglosar las instalaciones
     por canal en Adquisición de usuarios -> Origen de tráfico.
   - Cubre los DOS tipos de enlace a Play que hay en las páginas:
     el botón con data-enlace="playstore" y los badges PNG con href
     hardcodeado (se localizan por el propio href, no por atributo).
   - Además emite el evento `Clic Play Store` en Plausible para poder
     medir la conversión web -> app. El canal no va como propiedad:
     se obtiene filtrando el dashboard por UTM Source.
   - Convención de etiquetado documentada en el repo privado
     donbigotes-leads/TRACKING.md.
   ============================================================ */
(function () {
  "use strict";

  var ENLACES = {
    // TODO Xavi: confirmar la URL real de la web app (uso inmediato, sin instalar).
    webapp: "https://donbigotes.app/",

    // Ficha pública de Google Play (rollout Android).
    playstore: "https://play.google.com/store/apps/details?id=es.donbigotes.app",

    // Cuando exista versión iOS, pega aquí la URL de App Store.
    // Mientras sea null, el badge de App Store se oculta.
    appstore: null
  };

  /* --- Atribución: UTM de la visita -> referrer de Play --- */

  var CLAVES_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var GUARDADO = "db_utm";

  // Devuelve "utm_source=x&utm_medium=y&..." o "" si no hay nada.
  // Si la visita trae utm_*, los guarda para el resto de la sesión
  // (el usuario puede navegar a otra página antes de pulsar el botón).
  function utmDeLaVisita() {
    var params, i, clave, valor, partes = [];
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return "";
    }
    for (i = 0; i < CLAVES_UTM.length; i++) {
      clave = CLAVES_UTM[i];
      valor = params.get(clave);
      if (valor) partes.push(clave + "=" + valor);
    }
    var actual = partes.join("&");
    try {
      if (actual) {
        window.sessionStorage.setItem(GUARDADO, actual);
      } else {
        actual = window.sessionStorage.getItem(GUARDADO) || "";
      }
    } catch (e) { /* sessionStorage bloqueado: seguimos sin persistencia */ }
    return actual;
  }

  function esEnlacePlay(url) {
    return /play\.google\.com\/store\/apps\/details/i.test(url || "");
  }

  // Añade &referrer=<utm URL-encoded> sin duplicarlo ni pisar el id.
  function conReferrer(url, utm) {
    if (!utm || !esEnlacePlay(url) || /[?&]referrer=/i.test(url)) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") +
           "referrer=" + encodeURIComponent(utm);
  }

  function destino(tipo) {
    if (tipo === "playstore") return ENLACES.playstore || ENLACES.webapp;
    if (tipo === "appstore")  return ENLACES.appstore; // null => ocultar
    return ENLACES.webapp;
  }

  function avisarPlausible() {
    // Stub por si el script de Plausible aún no ha cargado: encola el evento.
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    window.plausible("Clic Play Store");
  }

  function aplicar() {
    var utm = utmDeLaVisita();
    var i, el, url;

    // 1) Enlaces gestionados por atributo (botón dorado, badges con data-enlace).
    var nodos = document.querySelectorAll("[data-enlace]");
    for (i = 0; i < nodos.length; i++) {
      el = nodos[i];
      url = destino(el.getAttribute("data-enlace"));
      if (!url) { el.hidden = true; el.style.display = "none"; continue; }
      el.setAttribute("href", conReferrer(url, utm));
      if (/^https?:/i.test(url)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    }

    // 2) Resto de enlaces a Play con href hardcodeado (badges PNG del partial):
    //    se localizan por el href, así no hay que tocar las 14 páginas.
    var play = document.querySelectorAll('a[href*="play.google.com"]');
    for (i = 0; i < play.length; i++) {
      el = play[i];
      url = el.getAttribute("href");
      if (!esEnlacePlay(url)) continue;
      el.setAttribute("href", conReferrer(url, utm));
      el.addEventListener("click", avisarPlausible);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicar);
  } else {
    aplicar();
  }
})();

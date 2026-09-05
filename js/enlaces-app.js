/* ============================================================
   Don Bigotes — Enlaces de la app  (FUENTE ÚNICA DE VERDAD)
   ------------------------------------------------------------
   Cambia los enlaces SOLO aquí y se actualizan en TODAS las
   páginas que carguen este archivo.

   Cómo funciona en cada página:
   - El HTML del bloque CTA está SIEMPRE presente (lo ven los
     buscadores). Este script solo rellena el `href` al cargar.
   - Marca cada enlace con  data-enlace="webapp|playstore|appstore".

   Estado actual (ago 2026): la app está EN PRODUCCIÓN pública
   en Google Play (verificado 26-jul) y en App Store (aprobada 29-ago).
     · webapp    -> destino real de uso inmediato (web app).
     · playstore -> ficha pública de Google Play.
     · appstore  -> ficha pública de App Store.
   En iPhone/iPad el botón dorado "Abrir la app ahora" (data-enlace=
   "playstore") lleva a App Store en vez de a Play: en iOS el enlace de
   Play es un callejón sin salida.

   ATRIBUCIÓN POR CANAL (jul 2026):
   - Cada página trae ya en el HTML un `&referrer=` propio
     (utm_source=donbigotes.app, utm_medium=web, utm_campaign=<slug>
     de la página), para que Play Console separe las instalaciones
     que vienen de la web incluso sin JavaScript.
   - Si la visita llega con parámetros utm_* (p. ej. desde un email
     de outreach), este script los guarda en sessionStorage y los
     reinyecta en TODOS los enlaces a Google Play como `&referrer=`
     URL-encoded, SUSTITUYENDO al de la página: manda el canal real. Así Play Console puede desglosar las instalaciones
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

    // Ficha pública de App Store (Apple aprobó la app el 29-ago-2026).
    // Si algún día vuelve a ser null, los badges de App Store se ocultan solos.
    appstore: "https://apps.apple.com/es/app/id6798414411"
  };

  /* --- Atribución: UTM de la visita -> referrer de Play --- */

  var CLAVES_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var GUARDADO = "db_utm";

  // Fallback cuando la visita llega SIN ningún utm_* (Google orgánico, directo):
  // así el clic entra en Play con atribución al propio badge de la web.
  // Sin utm_campaign a propósito (queda vacío).
  var UTM_FALLBACK = "utm_source=donbigotes-web&utm_medium=badge";

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
  // El HTML ya trae un referrer por página (utm_campaign=<slug>). Solo lo
  // sustituye cuando `pisar` es true, es decir, cuando la visita llegó con
  // utm_* propios (outreach): ese canal manda sobre el de la página.
  function conReferrer(url, utm, pisar) {
    if (!utm || !esEnlacePlay(url)) return url;
    if (/[?&]referrer=/i.test(url)) {
      if (!pisar) return url;
      return url.replace(/([?&])referrer=[^&]*/i,
                         "$1referrer=" + encodeURIComponent(utm));
    }
    return url + (url.indexOf("?") === -1 ? "?" : "&") +
           "referrer=" + encodeURIComponent(utm);
  }

  // iPhone/iPad (incluye iPadOS, que se anuncia como Mac con pantalla táctil).
  function esIOS() {
    var ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) ||
           (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }

  function destino(tipo) {
    if (tipo === "playstore") {
      if (ENLACES.appstore && esIOS()) return ENLACES.appstore;
      return ENLACES.playstore || ENLACES.webapp;
    }
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
    var utmVisita = utmDeLaVisita();
    var utm = utmVisita || UTM_FALLBACK;
    var pisar = !!utmVisita; // solo un UTM real de la visita pisa el de la página
    var i, el, url, actual, ref;

    // 1) Enlaces gestionados por atributo (botón dorado, badges con data-enlace).
    var nodos = document.querySelectorAll("[data-enlace]");
    for (i = 0; i < nodos.length; i++) {
      el = nodos[i];
      url = destino(el.getAttribute("data-enlace"));
      if (!url) { el.hidden = true; el.style.display = "none"; continue; }
      // La URL base manda desde ENLACES, pero el referrer de la página (que
      // lleva el utm_campaign del slug) viaja en el href del HTML: se traspasa.
      actual = el.getAttribute("href");
      if (esEnlacePlay(url) && esEnlacePlay(actual) && !/[?&]referrer=/i.test(url)) {
        ref = /[?&]referrer=([^&]*)/i.exec(actual);
        if (ref) url += (url.indexOf("?") === -1 ? "?" : "&") + "referrer=" + ref[1];
      }
      el.setAttribute("href", conReferrer(url, utm, pisar));
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
      el.setAttribute("href", conReferrer(url, utm, pisar));
      el.addEventListener("click", avisarPlausible);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicar);
  } else {
    aplicar();
  }
})();

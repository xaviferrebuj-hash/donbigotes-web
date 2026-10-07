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

   ATRIBUCIÓN POR CANAL (jul 2026; grupos desde el 26-sep-2026):
   - Cada página trae ya en el HTML un `&referrer=` propio
     (utm_source=web, utm_medium=<grupo>, utm_campaign=<slug> de la
     página; grupo = web-producto | web-home | web-contenido), para que
     Play Console separe las instalaciones que vienen de la web incluso
     sin JavaScript. Los enlaces a App Store llevan pt/ct/mt con
     ct=<grupo> (se traspasan también a los enlaces que rellena este script).
     Desde el 7-oct-2026 el ct de las páginas web-contenido va por grupo:
     web-imprimibles, web-419 o web-otras (utm_medium no cambia).
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

  /* --- Páginas es-419 (Latinoamérica): tiendas regionales --- */
  var ES_419 = (document.documentElement.getAttribute("lang") || "") === "es-419";
  if (ES_419) {
    ENLACES.appstore = "https://apps.apple.com/app/id6798414411";
  }

  // Añade hl=es_419 a un enlace de Play (solo en páginas es-419), sin duplicarlo.
  function conIdioma(url) {
    if (!ES_419 || !esEnlacePlay(url) || /[?&]hl=/i.test(url)) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "hl=es_419";
  }

  /* --- Atribución: UTM de la visita -> referrer de Play --- */

  var CLAVES_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var GUARDADO = "db_utm";

  // Fallback cuando la visita llega SIN ningún utm_* (Google orgánico, directo)
  // y el enlace a Play no trae referrer en el HTML. Canal «web» de la lista
  // cerrada (carta, ampa, dentista, vendedor, creadora, web); grupo «otros».
  var UTM_FALLBACK = "utm_source=web&utm_medium=otros";

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

  // Atribución App Store (informe de campañas de App Store Connect): pt/ct/mt
  // viajan en el href del HTML de cada página (ct = grupo: web-producto,
  // web-home, web-imprimibles, web-419 o web-otras). La URL base manda desde ENLACES; la consulta
  // se traspasa del primer enlace a App Store de la página que la lleve.
  function conCampanaApple(url) {
    if (!/apps\.apple\.com\//i.test(url || "") || url.indexOf("?") !== -1) return url;
    var donante = document.querySelector('a[href*="apps.apple.com"][href*="ct="]');
    var consulta = donante && /\?([^#]*)/.exec(donante.getAttribute("href"));
    return consulta ? url + "?" + consulta[1] : url;
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

  function destino(tipo) {
    // "tienda": iOS -> App Store, Android -> Play, escritorio -> ancla
    // #descargar de la propia página (donde están los badges).
    if (tipo === "tienda") {
      if (esIOS()) return ENLACES.appstore || ENLACES.playstore;
      if (esAndroid()) return ENLACES.playstore;
      return "#descargar";
    }
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

  function avisarPlausibleAppStore() {
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    window.plausible("Clic App Store");
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
      // El botón "tienda" no trae href: hereda el referrer (utm_campaign de
      // la página) del primer enlace a Play que sí lo lleve.
      if (esEnlacePlay(url) && !esEnlacePlay(actual)) {
        var donante = document.querySelector('a[href*="play.google.com"][href*="referrer="]');
        if (donante) actual = donante.getAttribute("href");
      }
      if (esEnlacePlay(url) && esEnlacePlay(actual) && !/[?&]referrer=/i.test(url)) {
        ref = /[?&]referrer=([^&]*)/i.exec(actual);
        if (ref) url += (url.indexOf("?") === -1 ? "?" : "&") + "referrer=" + ref[1];
      }
      el.setAttribute("href", conIdioma(conReferrer(conCampanaApple(url), utm, pisar)));
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
      el.setAttribute("href", conIdioma(conReferrer(url, utm, pisar)));
      el.addEventListener("click", avisarPlausible);
    }

    // 3) Salida a App Store: evento simétrico al de Play.
    var apple = document.querySelectorAll('a[href*="apps.apple.com"]');
    for (i = 0; i < apple.length; i++) {
      apple[i].addEventListener("click", avisarPlausibleAppStore);
    }

    bandaAndroid();
  }

  /* --- Banda inferior para Android (7-oct-2026) ---
     Solo en Android y fuera de las dos home. Se crea después de aplicar(), así
     que su enlace a Play sale tal cual (utm_medium=banda), sin hl ni UTM de la
     visita. Se esconde mientras el generador (#gen) está abierto y, si se
     cierra con ✕, no vuelve a salir en 7 días (localStorage). */
  var BANDA_CLAVE = "db_banda_android";
  var BANDA_DIAS = 7;
  var BANDA_PLAY = "https://play.google.com/store/apps/details?id=es.donbigotes.app&referrer=utm_source%3Dweb%26utm_medium%3Dbanda%26utm_campaign%3D" +
    (ES_419 ? "banda-android-419" : "banda-android");

  function bandaCerradaHace() {
    try {
      var t = parseInt(window.localStorage.getItem(BANDA_CLAVE), 10);
      return t ? Date.now() - t : Infinity;
    } catch (e) { return Infinity; }
  }

  function bandaAndroid() {
    if (!esAndroid()) return;
    var ruta = window.location.pathname.replace(/index\.html$/, "");
    if (ruta === "/" || ruta === "/es-419/") return;
    if (bandaCerradaHace() < BANDA_DIAS * 864e5) return;

    var css = document.createElement("style");
    css.textContent =
      ".banda-and{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;align-items:center;gap:8px;" +
      "box-sizing:content-box;padding:8px 10px 8px 4px;padding-bottom:calc(8px + env(safe-area-inset-bottom));" +
      "background:#0B1437;border-top:1px solid rgba(242,193,78,.35);box-shadow:0 -6px 18px rgba(0,0,0,.28);" +
      "font-family:'Nunito',system-ui,-apple-system,sans-serif;color:#fff}" +
      ".banda-and[hidden]{display:none}" +
      ".banda-and-x{flex:none;width:24px;height:36px;margin-right:-2px;border:0;background:none;color:#C7CEF0;font-size:14px;line-height:1;cursor:pointer;padding:0}" +
      ".banda-and img{flex:none;width:36px;height:36px;border-radius:9px}" +
      ".banda-and-t{flex:1;min-width:0;line-height:1.2}" +
      ".banda-and-t b{display:block;font-size:13px;font-weight:800;white-space:nowrap}" +
      ".banda-and-t span{display:block;font-size:11.5px;color:#C7CEF0}" +
      ".banda-and-b{flex:none;padding:8px 12px;border-radius:999px;background:linear-gradient(180deg,#F2C14E,#E7B23B);" +
      "color:#0B1437;font-weight:800;font-size:13px;text-decoration:none}" +
      "@media(max-width:359px){.banda-and{gap:6px}.banda-and img{width:32px;height:32px}" +
      ".banda-and-t b{font-size:11.5px}.banda-and-t span{font-size:10.5px}.banda-and-b{padding:7px 10px;font-size:12px}}";
    document.head.appendChild(css);

    var banda = document.createElement("div");
    banda.className = "banda-and";
    banda.setAttribute("role", "region");
    banda.setAttribute("aria-label", "App Don Bigotes");
    banda.innerHTML =
      '<button type="button" class="banda-and-x" aria-label="Cerrar">&#10005;</button>' +
      '<img src="/assets/img/logo-don-bigotes.jpg" width="40" height="40" alt="">' +
      '<div class="banda-and-t"><b>Don Bigotes · ' + (ES_419 ? "Ratón Pérez" : "Ratoncito Pérez") + "</b>" +
      "<span>Carta con su nombre y diario de dientes, gratis</span></div>" +
      '<a class="banda-and-b" target="_blank" rel="noopener">Instalar</a>';
    var boton = banda.querySelector(".banda-and-b");
    boton.setAttribute("href", BANDA_PLAY);
    boton.addEventListener("click", avisarPlausible);
    document.body.appendChild(banda);

    // Hueco al final de la página para que la banda no tape el último contenido.
    var cuerpo = document.body;
    var base = parseFloat(window.getComputedStyle(cuerpo).paddingBottom) || 0;
    function hueco(visible) {
      cuerpo.style.paddingBottom = visible ? (base + banda.offsetHeight) + "px" : "";
    }
    hueco(true);

    // Con el generador abierto, fuera.
    var gen = document.getElementById("gen");
    if (gen && window.MutationObserver) {
      var sincroniza = function () {
        var abierto = gen.classList.contains("open");
        banda.hidden = abierto;
        hueco(!abierto);
      };
      new MutationObserver(sincroniza).observe(gen, { attributes: true, attributeFilter: ["class"] });
      sincroniza();
    }

    banda.querySelector(".banda-and-x").addEventListener("click", function () {
      try { window.localStorage.setItem(BANDA_CLAVE, String(Date.now())); } catch (e) { /* sin persistencia */ }
      banda.parentNode.removeChild(banda);
      hueco(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicar);
  } else {
    aplicar();
  }
})();

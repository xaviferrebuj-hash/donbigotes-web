/* Generador del certificado con el nombre (10-oct-2026).
   Bloque #dg de /certificado-raton-perez/, /diploma-raton-perez/ y sus hermanas /es-419/,
   encima del PDF en blanco. Pone el nombre y la fecha sobre el diploma de siempre
   (render a 300 ppp de descargas/diploma-*.pdf, en /assets/img/diploma/) y lo imprime
   a A4 con window.print(): @media print de /assets/diploma-gen.css saca solo #dgImp.

   El nombre no sale del navegador: los campos no llevan name (el formulario no lo pone
   en la URL), no va en eventos ni en consola, y la muestra de voz pide el grupo por
   número. Eventos de Plausible, sin propiedades: «Certificado generado», «Preview voz
   postcertificado», «Clic Play Store postcertificado» y «Clic App Store postcertificado».

   La muestra de voz y la tienda según el móvil son copia de js/carta-gen.js (que no se
   toca): si cambian allí, cambiarlas aquí también. */
(function () {
  var doc = document;
  function $(id) { return doc.getElementById(id); }
  var caja = $('dg');
  if (!caja) return;

  var raiz = doc.documentElement;
  var nom = $('dgNombre'), fec = $('dgFecha'), hoja = $('dgHoja'), fondo = hoja.querySelector('img');

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function hoy() {
    var d = new Date();
    return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  if (!fec.value) fec.value = hoy();

  /* Primera letra de cada palabra en mayúscula; el resto, como lo escriban. */
  function mayusculas(s) {
    return s.replace(/\s+/g, ' ').trim().replace(/(^|[\s-])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
  }

  /* ------------------------------------------------- nombre y fecha en la hoja */

  /* Tamaño base y ancho máximo, en cqw (centésimas del ancho de la hoja). El nombre va
     centrado en la línea de «Otorgado a:» (37,03 cqw) y encoge si no cabe; la fecha
     empieza en la línea de «Fecha:» y puede pasarse un poco de los puntos. */
  var NOMBRE = { peso: 700, base: 5, max: 35.2, prop: '--dg-fn' };
  var FECHA = { peso: 500, base: 3.8, max: 32, prop: '--dg-ff' };
  var lienzo = doc.createElement('canvas').getContext('2d');
  function tamano(txt, t) {
    lienzo.font = t.peso + ' 100px Caveat';
    var ancho = lienzo.measureText(txt).width / 100 * t.base;
    return (ancho > t.max ? t.base * t.max / ancho : t.base).toFixed(3) + 'cqw';
  }
  function fuentes(n, f) {
    if (!doc.fonts || !doc.fonts.load) return Promise.resolve();
    return Promise.all([doc.fonts.load('700 100px Caveat', n), doc.fonts.load('500 100px Caveat', f)])
      .catch(function () { /* sin la fuente se mide con la de reserva */ });
  }

  function pinta(n, f) {
    $('dgNom').textContent = n;
    $('dgFec').textContent = f;
    hoja.style.setProperty(NOMBRE.prop, tamano(n, NOMBRE));
    hoja.style.setProperty(FECHA.prop, tamano(f, FECHA));
    /* La copia para imprimir, hija directa de <body>, sin ids. */
    var imp = $('dgImp');
    if (!imp) {
      imp = doc.createElement('div');
      imp.id = 'dgImp';
      imp.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(imp);
    }
    var copia = hoja.cloneNode(true);
    copia.removeAttribute('id');
    copia.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
    imp.innerHTML = '';
    imp.appendChild(copia);
    raiz.classList.add('dg-listo');
  }

  function crear(e) {
    if (e) e.preventDefault();
    var n = mayusculas(nom.value || '');
    if (!n) {
      $('dgErr').hidden = false;
      nom.classList.add('falta');
      nom.focus();
      return;
    }
    $('dgErr').hidden = true;
    nom.value = n;
    var f = (fec.value || '').replace(/\s+/g, ' ').trim() || hoy();
    fec.value = f;
    if (!fondo.getAttribute('src')) fondo.src = fondo.dataset.src;
    fuentes(n, f).then(function () {
      pinta(n, f);
      $('dgForm').hidden = true;
      $('dgRes').hidden = false;
      if (caja.getBoundingClientRect().top < 0) caja.scrollIntoView({ block: 'start' });
      plausible('Certificado generado');
      pcPreparaVoz(n);
    });
  }

  function otro() {
    pcParar();
    raiz.classList.remove('dg-listo');
    $('dgRes').hidden = true;
    $('dgForm').hidden = false;
    nom.focus();
  }

  /* Se imprime cuando el fondo ya ha cargado (en la copia, que es la que sale). */
  function imprimir() {
    var im = $('dgImp') && $('dgImp').querySelector('img');
    if (!im || im.complete) { window.print(); return; }
    im.addEventListener('load', function () { window.print(); }, { once: true });
  }

  $('dgF').addEventListener('submit', crear);
  nom.addEventListener('input', function () { nom.classList.remove('falta'); });
  $('dgImprimir').addEventListener('click', imprimir);
  $('dgOtro').addEventListener('click', otro);

  /* ------------------------------------------- muestra de voz (de carta-gen.js) */

  /* «Hola,» + el nombre + «¡Shhh! Acércate, que te cuento un secreto.» Se baja solo el
     sprite del grupo del nombre (FNV-1a de la clave, módulo 16): la URL lleva el número
     de grupo, nunca el nombre. Nombre fuera del banco: «cariño». Si algo falla, los 4
     primeros segundos de preview-pack.mp3. */
  var CLAVES_VOZ = ["aaron","abril","ada","adam","adara","aday","adrian","adriana","africa","aina","ainara","ainhoa","aitana","aitor","alan","alba","alberto","aleix","alejandra","alejandro","alex","alexia","alicia","alma","alonso","alvaro","amaia","amir","amira","ana","anas","ander","andrea","andres","angel","angela","anna","antonio","ariadna","arlet","arnau","aroa","asier","aurora","axel","aya","azahara","berta","biel","blanca","bruna","bruno","camila","candela","carla","carlos","carlota","carmen","carolina","cayetana","celia","chloe","clara","claudia","cloe","cristian","cristina","daniel","daniela","dario","david","diana","diego","dylan","elena","elia","elias","elisa","elsa","emma","enrique","enzo","eric","erik","erika","eva","fabio","fatima","fernando","francisco","gabriel","gabriela","gael","gala","gonzalo","greta","guillermo","hector","helena","hugo","ian","ignacio","iker","imran","india","ines","irene","iria","iris","isaac","isabel","isabella","ismael","ivan","izan","jaime","jan","jana","javier","jesus","jimena","joan","joel","jon","jorge","jose","juan","julen","julia","julieta","june","kai","laia","lara","laura","lautaro","leire","leo","leyre","lia","liam","lina","lola","luca","lucas","lucia","lucina","luis","luka","luna","macarena","maia","malak","manuel","manuela","mar","mara","marc","marco","marcos","maria","marina","mario","marta","marti","martin","martina","mateo","matias","mauro","max","mia","miguel","miguel-angel","milo","mireia","mohamed","nahia","naia","naiara","natalia","neizan","nerea","nico","nicolas","nil","noa","noah","noelia","nora","nour","nuria","oliver","olivia","omar","ona","oriol","oscar","pablo","paola","pau","paula","pedro","pol","rafael","raul","rayan","rocio","rodrigo","roger","ruben","salma","samuel","santiago","sara","saul","sergio","sira","sofia","teo","thiago","triana","unai","valentina","valeria","vega","vera","victor","victoria","violeta","xavi","yago","yasmin","youssef","zoe"];
  var RUTA_VOZ = '/assets/audio/voz/';
  var PC_SEG = 4;
  var MARGEN = 0.05;
  var pcM = $('dgMuestra'), pcE = $('dgEscuchar');
  var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  var SR = 48000;
  var pcBasesP = null, pcGrupos = {}, pcVoz = null;

  function normalizar(nombre) {
    var s = (nombre || '').trim().toLowerCase();
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) { /* sin normalize */ }
    return s.replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function grupoVoz(clave) {
    var h = 0x811c9dc5;
    for (var i = 0; i < clave.length; i++) { h ^= clave.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    var g = h % 16;
    return (g < 10 ? '0' : '') + g;
  }
  /* Nombre completo → primera palabra → nada (genérica). */
  function resolverVoz(nombre) {
    var completa = normalizar(nombre);
    if (completa && CLAVES_VOZ.indexOf(completa) >= 0) return { clave: completa };
    var primera = completa.split('-')[0];
    if (primera && CLAVES_VOZ.indexOf(primera) >= 0) return { clave: primera };
    return null;
  }
  function pcPreparaVoz(n) {
    pcParar();
    pcVoz = resolverVoz(n);
  }
  function pcParar() {
    if (pcM && !pcM.paused) pcM.pause();
    if (pcE) pcE.classList.remove('sonando');
  }

  function bajar(archivo, json) {
    return fetch(RUTA_VOZ + archivo).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return json ? r.json() : r.arrayBuffer();
    });
  }
  var DEC = null;
  function decodificar(datos) {
    if (!DEC) DEC = new OAC(1, 1, SR);
    return new Promise(function (ok, ko) {
      var r;
      try { r = DEC.decodeAudioData(datos, ok, ko); } catch (e) { ko(e); return; }
      if (r && typeof r.then === 'function') r.then(ok, ko);
    });
  }
  function pcBases() {
    if (!pcBasesP) {
      pcBasesP = Promise.all(['base-a.mp3', 'carino.mp3', 'base-b-inicio.mp3'].map(function (f) {
        return bajar(f).then(decodificar);
      })).then(function (b) { return { a: b[0], carino: b[1], b: b[2] }; });
      pcBasesP.catch(function () { pcBasesP = null; });
    }
    return pcBasesP;
  }
  function pcGrupo(g) {
    if (!pcGrupos[g]) {
      pcGrupos[g] = Promise.all([bajar('g/' + g + '.json', true), bajar('g/' + g + '.mp3').then(decodificar)])
        .then(function (r) { return { clips: r[0].clips, buffer: r[1] }; });
      pcGrupos[g].catch(function () { delete pcGrupos[g]; });
    }
    return pcGrupos[g];
  }

  /* WAV mono de 16 bits en memoria; suena con <audio> (en iPhone, Web Audio se calla
     con el interruptor de silencio). */
  function wav(trozos) {
    var n = 0;
    trozos.forEach(function (t) { t.n = Math.round(t.dur * SR); t.i = Math.round(t.desde * SR); n += t.n; });
    var b = new ArrayBuffer(44 + n * 2), v = new DataView(b), o = 44;
    function txt(p, s) { for (var k = 0; k < s.length; k++) v.setUint8(p + k, s.charCodeAt(k)); }
    txt(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); txt(8, 'WAVE'); txt(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 2, true); v.setUint16(32, 2, true);
    v.setUint16(34, 16, true); txt(36, 'data'); v.setUint32(40, n * 2, true);
    trozos.forEach(function (t) {
      var d = t.buffer ? t.buffer.getChannelData(0) : null;
      for (var k = 0; k < t.n; k++, o += 2) {
        var x = d ? (d[t.i + k] || 0) : 0;
        v.setInt16(o, x < 0 ? Math.max(-1, x) * 0x8000 : Math.min(1, x) * 0x7fff, true);
      }
    });
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }
  var SILENCIO = null, pcUltima = null;
  function pcSuena(url, cortar) {
    if (pcUltima && pcUltima !== url) { try { URL.revokeObjectURL(pcUltima); } catch (e) { /* nada */ } }
    pcUltima = url.indexOf('blob:') === 0 ? url : null;
    pcM.dataset.cortar = cortar ? '1' : '';
    pcM.src = url;
    var p = pcM.play();
    if (p && p.catch) p.catch(function () { pcE.classList.remove('sonando'); });
  }
  function pcGenerica4s() { pcSuena(pcM.dataset.src, true); }

  if (pcE && pcM) {
    pcE.addEventListener('click', function () {
      if (pcE.classList.contains('sonando')) { pcParar(); return; }
      plausible('Preview voz postcertificado');
      if (!OAC) { pcGenerica4s(); return; }
      if (!SILENCIO) SILENCIO = wav([{ buffer: null, desde: 0, dur: 0.05 }]);
      pcM.dataset.cortar = '';
      pcM.src = SILENCIO;
      var desbloqueo = pcM.play();
      desbloqueo = desbloqueo && desbloqueo.then ? desbloqueo.catch(function () {}) : Promise.resolve();
      var voz = pcVoz;
      var grupo = voz ? pcGrupo(grupoVoz(voz.clave)).catch(function () { return null; }) : Promise.resolve(null);
      pcE.disabled = true;
      Promise.all([pcBases(), grupo, desbloqueo]).then(function (r) {
        pcE.disabled = false;
        var b = r[0], g = r[1], c = g && voz && g.clips[voz.clave];
        var medio = c
          ? { buffer: g.buffer, desde: Math.max(0, c.start - MARGEN), dur: 0 }
          : { buffer: b.carino, desde: 0, dur: b.carino.duration };
        if (c) medio.dur = c.start + c.dur + MARGEN - medio.desde;
        pcSuena(wav([{ buffer: b.a, desde: 0, dur: b.a.duration }, medio, { buffer: b.b, desde: 0, dur: b.b.duration }]), false);
      }, function () {
        pcE.disabled = false;
        pcGenerica4s();
      });
    });
    pcM.addEventListener('timeupdate', function () { if (pcM.dataset.cortar && pcM.currentTime >= PC_SEG) pcParar(); });
    pcM.addEventListener('playing', function () { if (pcM.src !== SILENCIO) pcE.classList.add('sonando'); });
    pcM.addEventListener('pause', function () { pcE.classList.remove('sonando'); });
    pcM.addEventListener('ended', function () { pcE.classList.remove('sonando'); });
  }

  /* ------------------------------------------ tienda según el móvil (de carta-gen.js) */

  /* Android → Play; iPhone/iPad (también iPadOS, que se anuncia como Mac táctil) →
     App Store; el resto, las dos insignias. */
  var UA = navigator.userAgent || '';
  var SO = /Android/i.test(UA) ? 'android'
    : (/iPad|iPhone|iPod/.test(UA) || (/Macintosh/.test(UA) && navigator.maxTouchPoints > 1)) ? 'ios' : 'otros';
  doc.querySelectorAll('#dgPc [data-so]').forEach(function (el) { el.hidden = el.dataset.so !== SO; });
  doc.querySelectorAll('#dgPc .dg-a-play').forEach(function (a) {
    a.addEventListener('click', function () { plausible('Clic Play Store postcertificado'); });
  });
  doc.querySelectorAll('#dgPc .dg-a-ios').forEach(function (a) {
    a.addEventListener('click', function () { plausible('Clic App Store postcertificado'); });
  });
})();

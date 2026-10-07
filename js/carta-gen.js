/* Generador de la carta del Ratoncito Pérez.
   Común a todas las páginas que llevan el overlay #gen; sustituye al bloque que
   estaba duplicado inline en cada una. Dos modos, según los chips que tenga la página:

   - simple    (/editable/, primer-diente, ultimo-diente, el-ratoncito-perez-existe
                y sus hermanas /es-419/): nombre + sexo + diente.
   - completo  (las dos home): añade #gtramo y #grasgo y la fecha «Desde mi ratonera».
   La carta sale según la edad: 3-4, 5-6 o la de 7 o más «Tejados», como en la app.

   El idioma sale de <html lang>: «es-419» usa la variante LATAM de los textos.
   Se carga con `defer`, así que corre con el DOM ya montado. Es el primero de los
   scripts con `defer`: enlaces-app.js va detrás para no retrasar el botón. */
(function () {
  var doc = document;
  function $(id) { return doc.getElementById(id); }

  var ES419 = (doc.documentElement.lang || '').toLowerCase().indexOf('419') >= 0;
  var COMPLETO = !!$('gtramo');
  var RATON = ES419 ? 'Ratón Pérez' : 'Ratoncito Pérez';

  var GEN = { sexo: null, diente: null, tramo: null, rasgo: null, edad: null };
  window.GEN = GEN;

  /* El tramo de salida es el chip que la página trae marcado: 5-6 en general,
     7 o más en las páginas de último diente. */
  var chipEdad = doc.querySelector('#gedad .chip.sel');
  GEN.edad = chipEdad ? chipEdad.dataset.v : 't56';

  /* ---------------------------------------------------------------- textos */

  /* Las páginas no coinciden en el data-v de las paletas («palita» en unas,
     «paleta» en otras): aquí valen las dos y la carta dice «paleta», como la app. */
  var ARRIBA = 'paleta de arriba';
  var ABAJO = 'paleta de abajo';
  var DIENTES = {
    'palita de arriba': { txt: 'tu ' + ARRIBA, llano: 'tu ' + ARRIBA, nombre: ARRIBA, pron: 'La' },
    'paleta de arriba': { txt: 'tu paleta de arriba', llano: 'tu paleta de arriba', nombre: 'paleta de arriba', pron: 'La' },
    'palita de abajo': { txt: 'tu ' + ABAJO, llano: 'tu ' + ABAJO, nombre: ABAJO, pron: 'La' },
    'paleta de abajo': { txt: 'tu paleta de abajo', llano: 'tu paleta de abajo', nombre: 'paleta de abajo', pron: 'La' },
    'muela': { txt: 'tu muelita', llano: 'tu muela', nombre: 'muela', pron: 'La' },
    'colmillo': { txt: 'tu colmillito', llano: 'tu colmillo', nombre: 'colmillo', pron: 'Lo' },
    'diente': { txt: 'tu dientecito', llano: 'tu diente', nombre: 'diente', pron: 'Lo' }
  };
  function elDiente(v) { return DIENTES[v || 'diente'] || DIENTES.diente; }

  /* En las home, el chip «Es el primero» añade esta frase a la carta de 7 o más. */
  var PRIMERO_79 = ES419
    ? 'Y déjame decirte algo importante: este es tu PRIMER diente, y los primeros son los más especiales de toda mi colección. Este lo guardaré en un lugar de honor.'
    : 'Y déjame que te diga una cosa importante: este es tu PRIMER diente, y los primeros son los más especiales de toda mi colección. Este lo guardaré en un lugar de honor.';

  /* Cartas de 3-4 y 5-6: las mismas que escribe la app (docs/CARTAS-EDAD.md §4).
     Son más cortas, sin frases de rasgos, y el saludo es siempre «¡Hola, X!».
     En es-419, pretérito indefinido y vocabulario LATAM (texto aprobado el 27-sep,
     Claude outputs/latam-cartas/PROPUESTA.md). */
  function cuerpo34(n) {
    var p = [
      ES419
        ? 'Esta noche vine de puntitas hasta tu almohada… ¡y encontré tu diente!'
        : 'Esta noche he venido de puntillas hasta tu almohada… ¡y he encontrado tu diente!',
      '¡Qué bonito es! Me lo llevo a mi Oficina con mucho cuidado.',
      'Eres muy valiente, ' + n + '.',
      ES419 ? 'Cepíllate los dientes todos los días, ¿sí?' : 'Cepíllate los dientes cada día, ¿vale?',
      '¿Cuántos dientes ves escondidos en mi carta?'
    ];
    /* Si es el primero, la carta lo celebra desde la primera línea. */
    if (GEN.tramo === 'primero') {
      p[0] = '¡Tu primer diente! Lo voy a guardar en la caja de los dientes más especiales de la Oficina.';
    }
    return p;
  }
  function cuerpo56(n) {
    var d = elDiente(GEN.diente);
    var p = [
      ES419
        ? 'Esta noche vine de puntitas hasta tu almohada y encontré tu ' + d.nombre + '. ¡Qué tesoro!'
        : 'Esta noche he venido de puntillas hasta tu almohada y he encontrado tu ' + d.nombre + '. ¡Qué tesoro!',
      'Ya viaja en mi saquito. Sigue mis huellas por el borde de la carta: te llevan hasta la puerta de mi Oficina.',
      'Donde estaba ese diente ya asoma uno nuevo, más grande y más fuerte. Cuídalo mucho: cepíllate por la mañana y por la noche, ¿trato hecho?',
      ES419
        ? 'Y una misión para ti: perdí la llave de la Oficina. ¿Me ayudas a buscarla? Está escondida en esta carta.'
        : 'Y una misión para ti: he perdido la llave de la Oficina. ¿Me ayudas a buscarla? Está escondida en esta carta.',
      'Eres muy valiente, ' + n + '.'
    ];
    if (GEN.tramo === 'primero') {
      p[0] = 'Es tu primer diente, y por eso esta carta también es la primera. Lo guardo en la caja de los dientes más especiales de la Oficina.';
    }
    return p;
  }
  /* Carta de 7 o más, «Tejados»: el texto de la app (ratoncito_app/docs/CARTA-7-9-TEJADOS.md
     §2), con el diente que marque el padre. En es-419, el texto aprobado por Xavi el 6-oct. */
  function cuerpo79(n) {
    var d = elDiente(GEN.diente);
    var p = ES419 ? [
      'Esta noche vine de puntitas hasta tu almohada y encontré tu ' + d.nombre + '. ¡Qué tesoro! Ya viaja en mi saquito hacia la Oficina, de tejado en tejado.',
      'Ya sabes que detrás de cada diente que se cae sale uno nuevo y más fuerte. Cuídalo mucho: lávate los dientes todas las mañanas y todas las noches, que la próxima vez que pase por aquí quiero encontrarme una sonrisa reluciente.',
      'Como ya lees de corrido, te dejé un mensaje en clave al pie de la carta. Cada número es una letra; la clave está justo abajo.',
      'Gracias por dejarme tu diente, ' + n + '. Esta vieja Oficina te tiene entre sus personas favoritas.'
    ] : [
      'Esta noche he venido de puntillas hasta tu almohada y he encontrado tu ' + d.nombre + '. ¡Qué tesoro! Ya viaja en mi saquito hacia la Oficina, de tejado en tejado.',
      'Ya sabes que detrás de cada diente que se cae asoma uno nuevo y más fuerte. Cuídalo mucho: cepíllate cada mañana y cada noche, que la próxima vez que pase por aquí quiero encontrarme una sonrisa reluciente.',
      'Como ya lees de corrido, te he dejado un mensaje en clave al pie de la carta. Cada número es una letra; la clave está justo debajo.',
      'Gracias por dejarme tu diente, ' + n + '. Esta vieja Oficina te tiene entre sus personas favoritas.'
    ];
    if (GEN.tramo === 'primero') p[0] += ' ' + PRIMERO_79;
    return p;
  }

  /* Mensaje en clave de la carta de 7 o más, como en la app (catalogo_mensajes_clave.dart):
     alfabeto de 27 letras con Ñ (A=1 … N=14, Ñ=15, O=16 … Z=27). La app elige el mensaje
     por los dientes que lleva el peque; la web no lo sabe y saca siempre el primero. */
  var ALFABETO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  var MENSAJE_CLAVE = 'ERES MUY VALIENTE';
  function htmlClave() {
    var msg = MENSAJE_CLAVE.split(' ').map(function (pal) {
      return '<span class="tj-pal">' + pal.split('').map(function (l) {
        return '<span class="tj-n">' + (ALFABETO.indexOf(l) + 1) + '</span>';
      }).join('') + '</span>';
    }).join('');
    var tabla = ALFABETO.split('').map(function (l, i) {
      return '<span class="tj-k"><b>' + l + '</b>' + (i + 1) + '</span>';
    }).join('');
    return '<p class="tj-clave-t">Mensaje en clave</p><div class="tj-msg">' + msg + '</div>' +
      '<div class="tj-tabla">' + tabla + '</div>';
  }

  /* Cuando el diente es el último, la carta se despide en vez de contar el viaje.
     Lo dice data-contexto="ultimo" en #gen (las páginas de último diente) o el chip
     «Es el último» de las home. Sustituye al cuerpo del tramo; saludo y firma, igual. */
  function despedida(edad) {
    /* Sin fórmula de despedida al final del cuerpo: la pone el cierre, que en
       estas cartas es «Con bigotes y cariño,» justo encima de la firma. */
    if (edad === 't79') {
      return [ES419
        ? 'Hoy me llevo tu último diente de leche, y eso significa algo importante: ya tienes todos tus dientes de grande. Los cuidaste bien, uno a uno, y por eso este va a la caja de los dientes más especiales de la Oficina. Fue un honor visitarte todas estas noches. Cepíllalos bien: ahora son para siempre.'
        : 'Hoy me llevo tu último diente de leche, y eso significa algo importante: ya tienes todos los dientes de mayor. Los cuidaste bien, uno a uno, y por eso este va a la caja de los dientes más especiales de la Oficina. Ha sido un honor visitarte todas estas noches. Cepíllalos bien: ahora son para siempre.'];
    }
    return [ES419
      ? 'Este era tu último diente de leche. ¡Qué bien lo cuidaste! Ahora ya tienes tus dientes de grande, y esos son para toda la vida. Yo me llevo este con mucho cariño a la Oficina, en la caja de los dientes más especiales. Gracias por dejarme visitarte todas estas noches.'
      : 'Este era tu último diente de leche. ¡Qué bien lo has cuidado! Ahora ya tienes los dientes de mayor, y esos son para toda la vida. Yo me llevo este con mucho cariño a la Oficina, en la caja de los dientes más especiales. Gracias por dejarme visitarte todas estas noches.'];
  }

  /* La página entera va de último diente, o lo ha dicho el chip de las home. */
  function esDespedida() {
    var ctx = ($('gen').dataset.contexto || '') === 'ultimo';
    return ctx || GEN.tramo === 'ultimo';
  }

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fechaRatonera() {
    var hoy = new Date();
    return 'Desde mi ratonera, a ' + hoy.getDate() + ' de ' + MESES[hoy.getMonth()] + ' de ' + hoy.getFullYear();
  }

  /* -------------------------------------------------------------- overlay */

  function openGen() {
    plausible('Crear carta - clic');
    $('gen').classList.add('open');
    doc.body.style.overflow = 'hidden';
  }
  function closeGen() {
    $('gen').classList.remove('open');
    doc.body.style.overflow = '';
  }
  function resetGen() {
    $('genResult').classList.remove('show');
    $('genForm').style.display = 'block';
    $('gen').scrollTop = 0;
    pcParar();
  }

  /* ------------------------------------------- post-carta (7-oct-2026) */

  /* Pantalla de después de la carta: muestra de voz (solo ES), qué hay en la app y la
     tienda según el dispositivo. La voz con el nombre no se usa: los paquetes de nombres
     pesan más de 500 KB por grupo y no hay variante es-419. En España suena la muestra
     genérica: los 4 primeros segundos de preview-pack.mp3 (a los 4,0 s hay una pausa).
     En es-419 no hay tarjeta de voz: no consta que la muestra no diga «Ratoncito».
     Nada se descarga hasta pulsar: el <audio> no lleva src hasta entonces. */
  var PC_SEG = 4;
  var pcM = $('pcMuestra'), pcE = $('pcEscuchar');
  function pcParar() {
    if (pcM && !pcM.paused) pcM.pause();
    if (pcM && pcM.getAttribute('src')) pcM.currentTime = 0;
  }
  if (pcM && pcE) {
    pcE.addEventListener('click', function () {
      if (!pcM.paused) { pcParar(); return; }
      if (!pcM.getAttribute('src')) pcM.src = pcM.dataset.src;
      else pcM.currentTime = 0;
      var p = pcM.play();
      if (p && p.catch) p.catch(function () {});
      plausible('Preview voz postcarta');
      plausible('Muestra de voz');
    });
    pcM.addEventListener('timeupdate', function () { if (pcM.currentTime >= PC_SEG) pcParar(); });
    pcM.addEventListener('play', function () { pcE.classList.add('sonando'); });
    pcM.addEventListener('pause', function () { pcE.classList.remove('sonando'); });
    pcM.addEventListener('ended', function () { pcE.classList.remove('sonando'); });
  }

  /* Tienda según el dispositivo: Android → botón de Play; iPhone/iPad (también iPadOS,
     que se anuncia como Mac táctil) → botón de App Store; el resto, las dos insignias. */
  var UA = navigator.userAgent || '';
  var SO = /Android/i.test(UA) ? 'android'
    : (/iPad|iPhone|iPod/.test(UA) || (/Macintosh/.test(UA) && navigator.maxTouchPoints > 1)) ? 'ios' : 'otros';
  doc.querySelectorAll('#pcPantalla [data-so]').forEach(function (el) { el.hidden = el.dataset.so !== SO; });
  doc.querySelectorAll('#pcPantalla .pc-a-play').forEach(function (a) {
    a.addEventListener('click', function () { plausible('Clic Play Store postcarta'); });
  });
  doc.querySelectorAll('#pcPantalla .pc-a-ios').forEach(function (a) {
    a.addEventListener('click', function () { plausible('Clic App Store postcarta'); });
  });

  /* Al salir la carta, la pantalla se enseña y recibe el foco sin mover el scroll:
     arriba sigue la carta. «Seguir solo con la carta» la cierra y vuelve a la carta. */
  function pcAbrir() {
    var pan = $('pcPantalla');
    if (!pan) return;
    pan.hidden = false;
    try { pan.focus({ preventScroll: true }); } catch (e) { /* navegadores sin preventScroll */ }
  }
  function pcCerrar() {
    pcParar();
    var pan = $('pcPantalla');
    if (pan) pan.hidden = true;
    pcVolver();
  }

  function pcVolver() {
    var c = $('print-letter'), o = $('gen'), y = o.scrollTop;
    c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    /* Respaldo: si el navegador ignora el scroll suave, saltamos sin animación. */
    setTimeout(function () { if (o.scrollTop === y) c.scrollIntoView({ block: 'start' }); }, 120);
  }
  /* ------------------------------------------------- post-carta (cuento) */

  /* Módulo del cuento, dentro de la pantalla post-carta, justo antes de «Seguir solo
     con la carta» (desde el 7-oct-2026; antes iba entre la confirmación y el Pack).
     Vive dentro de #genResult, así que solo se ve con la carta ya generada. Estilos en
     /assets/carta-gen.css. El título, el del H1 de la página del cuento. */
  var CUENTO_URL = ES419 ? '/es-419/cuento-raton-perez/' : '/cuento-ratoncito-perez/';
  var pcSeguir = doc.querySelector('#pcPantalla .pc-back');
  if (pcSeguir) {
    var cu = doc.createElement('div');
    cu.className = 'pc-cuento';
    cu.innerHTML = '<span class="pc-cuento-i" aria-hidden="true">&#127769;</span>' +
      '<div><p class="pc-cuento-t">¿Y esta noche?</p>' +
      '<p class="pc-cuento-s">Escucha gratis el primer capítulo de «La historia de Don Bigotes».</p>' +
      '<a class="pc-cuento-b" href="' + CUENTO_URL + '">Escuchar el capítulo 1</a></div>';
    pcSeguir.parentNode.insertBefore(cu, pcSeguir);
    /* El evento sale antes de irse: se navega en el callback de Plausible o a
       los 800 ms, lo que llegue antes. Con Ctrl/Cmd o botón central, sin esperar. */
    cu.querySelector('a').addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) { plausible('Cuento web: desde carta'); return; }
      e.preventDefault();
      var ido = false;
      function ir() { if (!ido) { ido = true; location.href = CUENTO_URL; } }
      plausible('Cuento web: desde carta', { callback: ir });
      setTimeout(ir, 800);
    });
  }

  /* ---------------------------------------------------------------- chips */

  function bindChips(g, k, alCambiar) {
    doc.querySelectorAll('#' + g + ' .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        doc.querySelectorAll('#' + g + ' .chip').forEach(function (x) { x.classList.remove('sel'); });
        c.classList.add('sel');
        GEN[k] = c.dataset.v;
        if (alCambiar) alCambiar();
      });
    });
  }
  bindChips('gsexo', 'sexo');
  bindChips('gdiente', 'diente');
  bindChips('gedad', 'edad', sincronizaRasgo);

  /* El rasgo solo aparece en 7 o más: las cartas de 3-4 y 5-6 no lo usan. */
  function sincronizaRasgo() {
    var chips = $('grasgo');
    if (!chips) return;
    var oculto = (GEN.edad || 't56') !== 't79';
    chips.style.display = oculto ? 'none' : '';
    var lbl = chips.previousElementSibling;
    if (lbl && lbl.classList.contains('gen-label')) lbl.style.display = oculto ? 'none' : '';
  }

  if (COMPLETO) {
    bindChips('gtramo', 'tramo');
    /* El rasgo es opcional: volver a tocarlo lo deselecciona. */
    doc.querySelectorAll('#grasgo .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        var sel = c.classList.contains('sel');
        doc.querySelectorAll('#grasgo .chip').forEach(function (x) { x.classList.remove('sel'); });
        if (sel) { GEN.rasgo = null; } else { c.classList.add('sel'); GEN.rasgo = c.dataset.v; }
      });
    });
  }

  /* ----------------------------------------------------------- la carta */

  /* «Con bigotes y cariño,» va encima de la firma, que fluye con el texto en vez de
     ir pegada al fondo (estilos en /assets/carta-gen.css). */
  function ponCierre(papel) {
    /* Las home ya traen el suyo en el HTML (.l-close), en este mismo sitio: si
       está, se usa ese y no se crea otro. */
    if (papel.querySelector('.l-close')) return;
    var c = papel.querySelector('.l-cierre');
    if (!c) {
      c = doc.createElement('div');
      c.className = 'l-cierre';
      c.textContent = 'Con bigotes y cariño,';
      papel.insertBefore(c, papel.querySelector('.l-stamp'));
    }
  }

  /* Las piezas de la carta de 7 o más: franja de tejados, mensaje en clave y, al pie, la
     rosa de los vientos y la Oficina. Se crean la primera vez y se quedan; el CSS las
     esconde en 3-4 y 5-6 (clase .tj). Cabecera y fecha, solo donde la página no las trae
     (las home sí). Ancho y alto en las <img> para que la carta mida lo mismo antes de que
     carguen: ajustaHoja() la mide al crearla. */
  var PIEZAS = '/assets/img/carta/79/';
  function pieza(clase, archivo, ancho, alto) {
    var im = doc.createElement('img');
    im.className = clase;
    im.src = PIEZAS + archivo;
    im.width = ancho;
    im.height = alto;
    im.alt = '';
    return im;
  }
  function ponTejados(papel) {
    if (papel.querySelector('.tj-franja')) return;
    var saludo = $('gGreet');
    papel.insertBefore(pieza('tj tj-franja', 'franja.webp', 1800, 456), papel.firstChild);
    if (!papel.querySelector('.l-head')) {
      var cab = doc.createElement('div');
      cab.className = 'tj l-head';
      cab.innerHTML = '<img class="l-avatar" src="/avatar-carta.jpg" width="104" height="104" alt="Retrato del ' + RATON + '">' +
        '<div><div class="l-office-t">Oficina del ' + RATON + '</div>' +
        '<div class="l-office-s">Departamento de Dientes de Leche · desde 1894</div></div>';
      papel.insertBefore(cab, saludo);
    }
    if (!papel.querySelector('.l-date')) {
      var fecha = doc.createElement('div');
      fecha.className = 'tj l-date';
      papel.insertBefore(fecha, saludo);
    }
    var clave = doc.createElement('div');
    clave.className = 'tj tj-clave';
    clave.innerHTML = htmlClave();
    papel.insertBefore(clave, $('gBody').nextSibling);
    var pie = doc.createElement('div');
    pie.className = 'tj tj-pie';
    pie.appendChild(pieza('tj-rosa', 'rosa.webp', 160, 173));
    pie.appendChild(pieza('tj-oficina', 'oficina.webp', 640, 323));
    papel.appendChild(pie);
  }

  function pintaCuerpo(parrafos) {
    var body = $('gBody');
    if (parrafos.length === 1) { body.textContent = parrafos[0]; return; }
    body.innerHTML = '';
    parrafos.forEach(function (t) {
      if (!t) return;
      var p = doc.createElement('p');
      p.textContent = t;
      body.appendChild(p);
    });
  }

  function makeLetter() {
    var nombre = ($('gnombre').value || '').trim();
    if (!nombre) {
      /* El campo se marca y recibe el foco (en móviles pequeños queda fuera de la
         pantalla); la sacudida se relanza en cada intento. */
      var campo = $('gnombre');
      $('genErr').classList.add('show');
      campo.classList.remove('falta');
      void campo.offsetWidth;
      campo.classList.add('falta');
      campo.focus();
      return;
    }
    $('genErr').classList.remove('show');
    var n = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    var edad = GEN.edad || 't56';

    if (COMPLETO) $('gDate').textContent = fechaRatonera();
    /* El saludo no lleva género: los textos ya lo evitan. En 7 o más, el nombre va en rojo. */
    var greet = $('gGreet');
    greet.textContent = '¡Hola, ' + n + '!';
    if (edad === 't79') {
      greet.textContent = '¡Hola, ';
      var rojo = doc.createElement('span');
      rojo.className = 'tj-nombre';
      rojo.textContent = n + '!';
      greet.appendChild(rojo);
    }
    var adios = esDespedida();
    pintaCuerpo(adios ? despedida(edad)
      : (edad === 't34' ? cuerpo34(n) : (edad === 't79' ? cuerpo79(n) : cuerpo56(n))));
    /* El papel cambia con la edad: los estilos están en /assets/carta-gen.css. */
    var papel = $('genResult').querySelector('.letter-paper');
    papel.classList.remove('edad-t34', 'edad-t56', 'edad-t79');
    papel.classList.add('edad-' + edad);
    /* La carta de despedida de 7 o más no lleva el mensaje en clave: su texto no lo anuncia. */
    papel.classList.toggle('ctx-adios', adios);
    if (edad === 't79') {
      ponTejados(papel);
      papel.querySelector('.l-date').textContent = fechaRatonera();
    }
    ponCierre(papel);
    $('gStamp').src = doc.querySelector('.l-stamp').src;
    $('gSign').src = doc.querySelector('.l-sign').src;
    $('genForm').style.display = 'none';
    $('genResult').classList.add('show');
    /* La carta empieza arriba: si no, sale cortada a la altura donde estaba el botón. */
    $('gen').scrollTop = 0;
    ajustaHoja();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(ajustaHoja);
    plausible('Carta generada', { props: { tramo: edad } });
    pcAbrir();
  }

  /* ------------------------------------------------ una sola hoja al imprimir */

  /* Con nombres largos la carta podía salir en dos hojas. Se mide tal como saldrá
     impresa —en un clon fuera de pantalla, con las reglas de .medida-impresion— y, si
     no cabe en una hoja de papel Carta (el más bajo de los habituales: 279,4 mm menos
     márgenes de 12,7 mm, y unos píxeles de holgura), se reduce lo justo con el zoom que
     @media print lee de --ajuste. Se calcula al crearla, así que también vale si se
     imprime desde el menú del navegador, y se repite cuando cargan las fuentes y las
     imágenes de la carta y justo antes de imprimir. */
  var ALTO_HOJA = 950;
  function ajustaHoja() {
    var carta = $('print-letter');
    if (!carta || !$('genResult').classList.contains('show')) return;
    var caja = doc.createElement('div');
    caja.className = 'medida-impresion';
    var copia = carta.cloneNode(true);
    copia.removeAttribute('id');
    copia.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
    caja.appendChild(copia);
    doc.body.appendChild(caja);
    var alto = copia.getBoundingClientRect().height;
    doc.body.removeChild(caja);
    if (!alto) return;
    carta.style.setProperty('--ajuste', alto > ALTO_HOJA ? String(Math.floor(ALTO_HOJA / alto * 1000) / 1000) : '1');
  }

  /* ------------------------------------------------------------- arranque */

  $('gen').addEventListener('click', function (e) { if (e.target === this) closeGen(); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGen(); });
  $('gnombre').addEventListener('input', function () { this.classList.remove('falta'); });
  ['gStamp', 'gSign'].forEach(function (id) { var im = $(id); if (im) im.addEventListener('load', ajustaHoja); });
  window.addEventListener('beforeprint', ajustaHoja);
  if (COMPLETO) { var heroDate = $('heroDate'); if (heroDate) heroDate.textContent = fechaRatonera(); }
  sincronizaRasgo();

  /* Los llaman los onclick del HTML. */
  window.openGen = openGen;
  window.closeGen = closeGen;
  window.resetGen = resetGen;
  window.makeLetter = makeLetter;
  window.pcVolver = pcVolver;
  window.pcCerrar = pcCerrar;
  window.bindChips = bindChips;
})();

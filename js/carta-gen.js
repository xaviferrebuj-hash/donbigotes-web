/* Generador de la carta del Ratoncito Pérez.
   Común a todas las páginas que llevan el overlay #gen; sustituye al bloque que
   estaba duplicado inline en cada una. Dos modos, según los chips que tenga la página:

   - simple    (/editable/, primer-diente, ultimo-diente, el-ratoncito-perez-existe
                y sus hermanas /es-419/): nombre + sexo + diente, carta de un párrafo.
   - completo  (las dos home): añade #gtramo y #grasgo, la fecha «Desde mi ratonera»,
                los diminutivos por diente y la carta de varios párrafos.

   El idioma sale de <html lang>: «es-419» usa la variante LATAM de los textos.
   Se carga con `defer`, así que corre con el DOM ya montado y después de
   muestra-voz.js en las páginas que lo llevan. */
(function () {
  var doc = document;
  function $(id) { return doc.getElementById(id); }

  var ES419 = (doc.documentElement.lang || '').toLowerCase().indexOf('419') >= 0;
  var COMPLETO = !!$('gtramo');
  var RATON = ES419 ? 'Ratón Pérez' : 'Ratoncito Pérez';

  var GEN = { sexo: null, diente: null, tramo: null, rasgo: null };
  window.GEN = GEN;

  /* ---------------------------------------------------------------- textos */

  /* Las páginas no coinciden en el data-v de las paletas («palita» en unas,
     «paleta» en otras): aquí valen las dos y el texto lo pone el idioma. */
  var DIENTES = {
    'palita de arriba': { txt: ES419 ? 'tu paleta de arriba' : 'tu palita de arriba', llano: ES419 ? 'tu paleta de arriba' : 'tu palita de arriba', pron: 'La' },
    'paleta de arriba': { txt: 'tu paleta de arriba', llano: 'tu paleta de arriba', pron: 'La' },
    'palita de abajo': { txt: ES419 ? 'tu paleta de abajo' : 'tu palita de abajo', llano: ES419 ? 'tu paleta de abajo' : 'tu palita de abajo', pron: 'La' },
    'paleta de abajo': { txt: 'tu paleta de abajo', llano: 'tu paleta de abajo', pron: 'La' },
    'muela': { txt: 'tu muelita', llano: 'tu muela', pron: 'La' },
    'colmillo': { txt: 'tu colmillito', llano: 'tu colmillo', pron: 'Lo' },
    'diente': { txt: 'tu dientecito', llano: 'tu diente', pron: 'Lo' }
  };
  function elDiente(v) { return DIENTES[v || 'diente'] || DIENTES.diente; }

  var RASGOS = {
    'valiente': ES419
      ? 'Mis ayudantes ya me habían contado lo valiente que eres, y esta noche lo vi con mis propios ojos: ni una pizca de miedo.'
      : 'Mis ayudantes ya me habían contado lo valiente que eres, y esta noche lo he visto con mis propios ojos: ni una pizca de miedo.',
    'cuida-dientes': 'Se nota de lejos que cuidas mucho tus dientes: el que me llevo esta noche brilla como las perlas más finas de mi colección.',
    'sonrisa': 'Y qué sonrisa tan preciosa tienes; en mi Oficina llevan días sin hablar de otra cosa.',
    'ayuda-casa': 'También sé que ayudas muchísimo en casa, y eso, en mi gran libro de dientes, vale tanto como el diente más blanco.',
    'dormilon': ES419
      ? 'Como me dijeron que te encanta dormir, trabajé de puntitas y en silencio para no despertarte.'
      : 'Como me han dicho que te encanta dormir, he trabajado de puntillas y en silencio para no despertarte.',
    'risueno': 'Dicen que tu risa se oye hasta en mi ratonera, y te aseguro que es la música que más nos gusta a los ratones.',
    'curioso': 'Sé que te gusta preguntarlo todo, como a los ratones sabios, así que te lo confirmo por escrito: tu diente queda en muy buenas patas.',
    'abrazos': 'Y me consta que repartes abrazos como nadie; yo guardaré tu diente con ese mismo cariño.'
  };

  var TRAMOS = {
    primero: 'Y déjame que te diga una cosa importante: este es tu PRIMER diente, y los primeros son los más especiales de toda mi colección. Este lo guardaré en un lugar de honor.',
    ultimo: ES419
      ? 'Y qué momento tan solemne: es tu ÚLTIMO diente de leche. Toda mi Oficina se puso elegante para despedirlo como se merece, y tu nombre quedará escrito con letras doradas en mi gran libro de dientes.'
      : 'Y qué momento tan solemne: es tu ÚLTIMO diente de leche. Toda mi Oficina se ha puesto elegante para despedirlo como se merece, y tu nombre quedará escrito con letras doradas en mi gran libro de dientes.',
    ninguno: ''
  };

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
    if (pcAudio) { pcAudio.pause(); pcAudio.currentTime = 0; }
    if (window.muestraVoz) muestraVoz.parar();
  }

  /* --------------------------------------------------- post-carta (Pack) */

  var pcAudio = $('pcAudio'), pcBtn = $('pcPlay');
  function pcIcono() { pcBtn.innerHTML = pcAudio.paused ? '&#9654;' : '&#10074;&#10074;'; }
  if (pcAudio && pcBtn) {
    /* Donde está muestra-voz.js, el botón lo maneja él. */
    if (!window.muestraVoz) {
      pcBtn.addEventListener('click', function () {
        if (pcAudio.paused) { pcAudio.play(); plausible('Preview voz postcarta'); } else { pcAudio.pause(); }
      });
    }
    pcAudio.addEventListener('play', pcIcono);
    pcAudio.addEventListener('pause', pcIcono);
    pcAudio.addEventListener('ended', function () { pcAudio.currentTime = 0; pcIcono(); });
  }
  var pcBadge = $('pcBadge'); if (pcBadge) pcBadge.addEventListener('click', function () { plausible('Clic Play Store postcarta'); });
  var pcBadgeIos = $('pcBadgeIos'); if (pcBadgeIos) pcBadgeIos.addEventListener('click', function () { plausible('Clic App Store postcarta'); });

  function pcVolver() {
    var c = $('print-letter'), o = $('gen'), y = o.scrollTop;
    c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    /* Respaldo: si el navegador ignora el scroll suave, saltamos sin animación. */
    setTimeout(function () { if (o.scrollTop === y) c.scrollIntoView({ block: 'start' }); }, 120);
  }
  function pcNombre(n) {
    var t = $('pcOkT');
    if (t) t.textContent = n ? ('La carta de ' + n + ' ya está lista') : 'La carta ya está lista';
    var vl = $('pcVozL');
    /* Con muestra-voz.js la frase la pone él. */
    if (vl && !window.muestraVoz) {
      vl.textContent = n ? ('«' + n + '… soy yo, el ' + RATON + '…»') : ('«Soy yo, el ' + RATON + '…»');
    }
  }

  /* ---------------------------------------------------------------- chips */

  function bindChips(g, k) {
    doc.querySelectorAll('#' + g + ' .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        doc.querySelectorAll('#' + g + ' .chip').forEach(function (x) { x.classList.remove('sel'); });
        c.classList.add('sel');
        GEN[k] = c.dataset.v;
      });
    });
  }
  bindChips('gsexo', 'sexo');
  bindChips('gdiente', 'diente');
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

  function saludo(n) {
    var sexo = GEN.sexo || 'neutro';
    return sexo === 'nino' ? 'Querido ' + n + ',' : (sexo === 'nina' ? 'Querida ' + n + ',' : '¡Hola, ' + n + '!');
  }

  /* Carta larga de las home: varios párrafos, con diminutivos y rasgo opcional. */
  function cuerpoCompleto() {
    var d = elDiente(GEN.diente);
    var tramo = TRAMOS[GEN.tramo || 'ninguno'] || '';
    var p1 = ES419
      ? 'Esta noche vine de puntitas hasta tu almohada y encontré ' + d.txt + '. ¡Qué tesoro! ' + d.pron + ' envolví con mucho cuidado y ya viaja en mi saquito hacia mi Oficina, donde brillará junto a los dientes más bonitos del mundo.'
      : 'Esta noche he venido de puntillas hasta tu almohada y he encontrado ' + d.txt + '. ¡Qué tesoro! ' + d.pron + ' he envuelto con mucho cuidado y ya viaja en mi saquito hacia mi Oficina, donde brillará junto a los dientes más bonitos del mundo.';
    if (tramo) p1 += ' ' + tramo;
    return [
      p1,
      GEN.rasgo && RASGOS[GEN.rasgo] ? RASGOS[GEN.rasgo] : '',
      'Ya sabes que detrás de cada diente que se cae asoma uno nuevo y más fuerte. Cuídalo mucho: cepíllate cada mañana y cada noche, que la próxima vez que pase por aquí quiero encontrarme una sonrisa reluciente.',
      'Gracias por dejarme ' + d.txt + '. Esta vieja Oficina te tiene entre sus personas favoritas.'
    ];
  }

  /* Carta corta del resto de páginas: un solo párrafo. */
  function cuerpoSimple() {
    var sexo = GEN.sexo || 'neutro';
    var peq = sexo === 'nino' ? ', pequeño' : (sexo === 'nina' ? ', pequeña' : '');
    var tooth = elDiente(GEN.diente).llano;
    return [ES419
      ? '¡Fuiste muy valiente! Anoche pasé por tu almohada y recogí ' + tooth + ' con muchísimo cuidado. Ahora está a salvo en mi casita, junto a otros dientes muy especiales. Te dejé un poquito de magia a cambio. Sigue cuidando esa sonrisa tan bonita' + peq + '… ¡Nos vemos en la próxima!'
      : '¡Has sido muy valiente! Anoche pasé por tu almohada y recogí ' + tooth + ' con muchísimo cuidado. Ahora está a salvo en mi casita, junto a otros dientes muy especiales. Te he dejado un poquito de magia a cambio. Sigue cuidando esa sonrisa tan bonita' + peq + '… ¡Nos vemos en la próxima!'];
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
    if (!nombre) { $('genErr').classList.add('show'); return; }
    $('genErr').classList.remove('show');
    var n = nombre.charAt(0).toUpperCase() + nombre.slice(1);

    if (COMPLETO) $('gDate').textContent = fechaRatonera();
    $('gGreet').textContent = saludo(n);
    pintaCuerpo(COMPLETO ? cuerpoCompleto() : cuerpoSimple());
    $('gStamp').src = doc.querySelector('.l-stamp').src;
    $('gSign').src = doc.querySelector('.l-sign').src;
    $('genForm').style.display = 'none';
    $('genResult').classList.add('show');
    plausible('Carta generada');
    pcNombre(n);
  }

  /* ------------------------------------------------------------- arranque */

  $('gen').addEventListener('click', function (e) { if (e.target === this) closeGen(); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGen(); });
  if (COMPLETO) { var heroDate = $('heroDate'); if (heroDate) heroDate.textContent = fechaRatonera(); }

  /* Los llaman los onclick del HTML. */
  window.openGen = openGen;
  window.closeGen = closeGen;
  window.resetGen = resetGen;
  window.makeLetter = makeLetter;
  window.pcVolver = pcVolver;
  window.bindChips = bindChips;
})();

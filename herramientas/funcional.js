// Prueba funcional en la web compilada (local). NADA sale a internet: todo lo externo se responde aquí.
const { chromium } = require('playwright');
const BASE = process.argv[2];
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
(async () => {
  const b = await chromium.launch(); const res = {};
  async function ctx() {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: UA });
    c.envios = [];
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => {
      const q = r.request();
      if (/web3forms/.test(q.url())) c.envios.push({ url: q.url(), metodo: q.method(), cuerpo: q.postDataBuffer() ? q.postDataBuffer().toString('latin1') : '' });
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    return c;
  }
  // 1) Formulario del cierre: un solo formulario, campo de una línea, misma clave y acción.
  for (const ruta of ['/editable/', '/el-ratoncito-perez-existe/', '/es-419/primer-diente/', '/carta-ratoncito-perez-segun-edad/', '/']) {
    const c = await ctx(); const p = await c.newPage(); const err = [];
    p.on('pageerror', e => err.push(e.message));
    await p.goto(BASE + ruta, { waitUntil: 'load' });
    const n = await p.$$eval('form.capture', f => f.length);
    const alto = await p.$eval('form.capture input[name="contacto"]', i => i.getBoundingClientRect().height);
    const hint = await p.$eval('form.capture .hint', e => e.textContent.trim());
    await p.fill('form.capture input[name="contacto"]', 'prueba@example.com');
    await p.$eval('form.capture', f => f.requestSubmit());
    await p.waitForTimeout(500);
    const e = c.envios[0] || {};
    const campos = {}; (e.cuerpo || '').split(/------/).forEach(parte => { const m = /name="([^"]+)"\r\n\r\n([^\r]*)/.exec(parte); if (m) campos[m[1]] = m[2]; });
    res['form ' + ruta] = { formularios: n, alto_campo_px: Math.round(alto), hint, envio: e.url, metodo: e.metodo, access_key: campos.access_key, subject: campos.subject, origen: campos.origen, errores: err };
    await c.close();
  }
  // 2) Banda «Instalar» (Android): oculta al cargar, visible tras bajar, fuera con el generador abierto.
  for (const ruta of ['/editable/', '/carta-para-imprimir/', '/ultimo-diente/', '/el-ratoncito-perez-existe/', '/']) {
    const c = await ctx(); const p = await c.newPage();
    await p.goto(BASE + ruta, { waitUntil: 'load' }); await p.waitForTimeout(300);
    const vis = () => p.evaluate(() => { const x = document.querySelector('.banda-and'); return x ? !x.hidden : null; });
    const r = { al_cargar: await vis() };
    await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(300); r.tras_bajar = await vis();
    if (await p.$('#gen')) { await p.evaluate(() => window.openGen && window.openGen()); await p.waitForTimeout(300); r.con_generador = await vis(); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    res['banda ' + ruta] = r; await c.close();
  }
  // 3) Generadores: carta (¿existe?) y certificado (ES y es-419).
  { const c = await ctx(); const p = await c.newPage(); const err = []; p.on('pageerror', e => err.push(e.message));
    await p.goto(BASE + '/el-ratoncito-perez-existe/', { waitUntil: 'load' });
    await p.click('.hero-cta'); await p.fill('#gnombre', 'Lucía');
    await p.click('#gedad .chip >> nth=0').catch(() => {}); await p.click('#gdiente .chip >> nth=0').catch(() => {});
    await p.click('.gen-go'); await p.waitForTimeout(800);
    res['carta ¿existe?'] = { resultado_visible: await p.$eval('#genResult', e => e.classList.contains('show')), saludo: await p.$eval('#gGreet', e => e.textContent), errores: err };
    await c.close(); }
  for (const ruta of ['/certificado-raton-perez/', '/es-419/certificado-raton-perez/']) {
    const c = await ctx(); const p = await c.newPage(); const err = []; p.on('pageerror', e => err.push(e.message));
    await p.goto(BASE + ruta, { waitUntil: 'load' });
    await p.fill('#dgNombre', 'Mateo'); await p.click('#dgF .dg-go'); await p.waitForTimeout(800);
    const img = await p.$eval('.diploma-img', i => ({ src: i.currentSrc, ancho_natural: i.naturalWidth }));
    res['certificado ' + ruta] = { resultado_visible: await p.$eval('#dgRes', e => !e.hidden), nombre: await p.$eval('#dgNom', e => e.textContent), portada: img, errores: err };
    await c.close(); }
  console.log(JSON.stringify(res, null, 1));
  await b.close();
})();

// Captura la web PUBLICADA de donbigotes.app (encargo 6-nov-2026, PDF para Fable).
// Uso: node captura.js <dsf_movil> <carpeta_salida>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DSF = parseFloat(process.argv[2] || '2');
const OUT = process.argv[3] || 'out';
fs.mkdirSync(OUT, { recursive: true });

const PAGINAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'paginas.json'), 'utf8'));
const UA_MOVIL = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const UA_ESCRITORIO = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const ESCRITORIO = new Set([1, 4, 14]);

async function prepara(page) {
  await page.evaluate(() => document.fonts.ready);
  // Recorre la página para que carguen las imágenes diferidas (loading="lazy").
  await page.evaluate(async () => {
    const paso = Math.round(innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => {
    const imgs = [...document.images].filter(i => !i.complete);
    await Promise.race([
      Promise.all(imgs.map(i => new Promise(r => { i.onload = i.onerror = r; }))),
      new Promise(r => setTimeout(r, 8000)),
    ]);
    await document.fonts.ready;
  });
  await page.waitForTimeout(1000);
}

async function captura(browser, pag, modo) {
  const movil = modo === 'movil';
  const ctx = await browser.newContext({
    viewport: movil ? { width: 390, height: 844 } : { width: 1280, height: 800 },
    deviceScaleFactor: movil ? DSF : 1,
    isMobile: movil, hasTouch: movil,
    userAgent: movil ? UA_MOVIL : UA_ESCRITORIO,
    locale: 'es-ES',
  });
  const r = { n: pag.n, ruta: pag.ruta, modo, consola: [], fallidas: [], http_sub: [], plausible_bloqueadas: 0 };
  // Plausible: se responde dentro del navegador con un script vacío; la petición no sale.
  await ctx.route(/plausible\.io/, route => {
    r.plausible_bloqueadas++;
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  // /carta/ (pasarela del QR) salta a la tienda en móvil: se bloquea el salto (ERR_ABORTED no pinta página de error).
  r.salto_tienda_bloqueado = [];
  await ctx.route(/play\.google\.com|apps\.apple\.com/, route => {
    const q = route.request();
    if (q.isNavigationRequest()) { r.salto_tienda_bloqueado.push(q.url()); return route.abort('aborted'); }
    return route.continue();
  });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') r.consola.push(m.text()); });
  page.on('pageerror', e => r.consola.push('pageerror: ' + e.message));
  page.on('requestfailed', q => r.fallidas.push(q.url() + ' — ' + (q.failure() || {}).errorText));
  page.on('response', s => { if (s.status() >= 400 && s.request().resourceType() !== 'document') r.http_sub.push(s.status() + ' ' + s.url()); });

  const url = 'https://donbigotes.app' + pag.ruta;
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  r.status = resp ? resp.status() : null;
  r.url_final = page.url();
  let redir = resp ? resp.request().redirectedFrom() : null;
  r.redirecciones = [];
  while (redir) { r.redirecciones.push(redir.url()); redir = redir.redirectedFrom(); }
  r.titulo = await page.title();
  await prepara(page);

  const vw = movil ? 390 : 1280;
  r.medidas = await page.evaluate((vw) => {
    const de = document.documentElement;
    window.scrollTo(300, 0);
    const scrollX = window.scrollX;
    window.scrollTo(0, 0);
    const anchos = [];
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0 && b.right > vw + 0.5) {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        anchos.push((el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '')).slice(0, 80) + ' → right ' + Math.round(b.right));
      }
    }
    return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, innerWidth: innerWidth, scrollX, alto: Math.max(de.scrollHeight, document.body.scrollHeight), desbordan: anchos.slice(0, 8), n_desbordan: anchos.length };
  }, vw);
  r.scroll_horizontal = r.medidas.scrollX > 0 || r.medidas.scrollWidth > r.medidas.clientWidth;

  const base = String(pag.n).padStart(2, '0') + '-' + pag.slug + '-' + modo;
  r.png = path.join(OUT, base + '.png');
  await page.screenshot({ path: r.png, fullPage: true, type: 'png' });
  await ctx.close();
  return r;
}

(async () => {
  const browser = await chromium.launch();
  const res = [];
  const SOLO = process.argv[4] ? new Set(process.argv[4].split(',').map(Number)) : null;
  for (const pag of PAGINAS) {
    if (SOLO && !SOLO.has(pag.n)) continue;
    for (const modo of ESCRITORIO.has(pag.n) ? ['movil', 'escritorio'] : ['movil']) {
      try {
        const r = await captura(browser, pag, modo);
        res.push(r);
        console.log(pag.n, modo, r.status, r.medidas.alto + 'px', r.scroll_horizontal ? 'SCROLL-X' : '', r.consola.length ? 'CONSOLA:' + r.consola.length : '', 'plausible bloq:' + r.plausible_bloqueadas);
      } catch (e) {
        res.push({ n: pag.n, ruta: pag.ruta, modo, error: String(e) });
        console.log(pag.n, modo, 'ERROR', e.message);
      }
    }
  }
  fs.writeFileSync(path.join(OUT, SOLO ? 'resultados-' + [...SOLO].join('_') + '.json' : 'resultados.json'), JSON.stringify(res, null, 2));
  await browser.close();
})();

// Capturas a 390 px de la web compilada servida en local (encargo Fable 6-nov).
// Uso: node captura_local.js <base_url> <lista_rutas.txt> <carpeta_salida> [dsf]
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [BASE, LISTA, OUT, DSFs] = process.argv.slice(2);
const DSF = parseFloat(DSFs || '1.5');
fs.mkdirSync(OUT, { recursive: true });
const RUTAS = fs.readFileSync(LISTA, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
function slug(r) { return r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '--'); }
(async () => {
  const browser = await chromium.launch();
  const res = [];
  for (const ruta of RUTAS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, isMobile: true, hasTouch: true, userAgent: UA, locale: 'es-ES' });
    await ctx.route(/plausible\.io/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => {
      const q = r.request();
      if (q.isNavigationRequest()) return r.abort('aborted');
      return r.fulfill({ status: 204, body: '' });
    });
    const page = await ctx.newPage();
    const r = { ruta, consola: [], http_err: [] };
    page.on('console', m => { if (m.type() === 'error') r.consola.push(m.text()); });
    page.on('pageerror', e => r.consola.push('pageerror: ' + e.message));
    page.on('response', s => { if (s.status() >= 400 && s.url().startsWith(BASE)) r.http_err.push(s.status() + ' ' + s.url()); });
    try {
      const resp = await page.goto(BASE + ruta, { waitUntil: 'load', timeout: 60000 });
      r.status = resp ? resp.status() : null;
      await page.evaluate(() => document.fonts.ready);
      // Primer pantallazo (sin scroll): dónde queda el botón principal y la banda.
      await page.waitForTimeout(500);
      r.primer = await page.evaluate(() => {
        const b = document.querySelector('.banda-and');
        const vis = b && !b.hidden && getComputedStyle(b).display !== 'none' && getComputedStyle(b).visibility !== 'hidden' && getComputedStyle(b).opacity !== '0';
        return { banda_visible_al_cargar: !!vis };
      });
      await page.screenshot({ path: path.join(OUT, slug(ruta) + '-pantalla1.png'), type: 'png' });
      await page.evaluate(async () => {
        const paso = Math.round(innerHeight * 0.8);
        for (let y = 0; y < document.documentElement.scrollHeight; y += paso) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
        window.scrollTo(0, 0);
      });
      // Solo para la captura: las imágenes diferidas se cargan ya (si no, salen en blanco en la página entera).
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
        await new Promise(r => setTimeout(r, 300));
        const imgs = [...document.images].filter(i => !i.complete);
        await Promise.race([Promise.all(imgs.map(i => new Promise(r => { i.onload = i.onerror = r; }))), new Promise(r => setTimeout(r, 10000))]);
        await Promise.all([...document.images].map(i => i.decode ? i.decode().catch(() => {}) : null));
      });
      await page.waitForTimeout(400);
      r.medidas = await page.evaluate(() => {
        const de = document.documentElement; window.scrollTo(300, 0); const sx = window.scrollX; window.scrollTo(0, 0);
        return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, scrollX: sx, alto: de.scrollHeight };
      });
      r.scroll_horizontal = r.medidas.scrollX > 0 || r.medidas.scrollWidth > r.medidas.clientWidth;
      await page.screenshot({ path: path.join(OUT, slug(ruta) + '.png'), fullPage: true, type: 'png' });
    } catch (e) { r.error = String(e); }
    res.push(r);
    console.log(ruta, r.status, r.medidas ? r.medidas.alto + 'px' : '', r.scroll_horizontal ? 'SCROLL-X' : '', r.consola.length ? 'CONSOLA:' + r.consola.join(' | ') : '', r.http_err.length ? 'HTTP:' + r.http_err.join(' ') : '', r.error || '');
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'resultados.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();

// Punto 5 de feature/web-papel: desde «carta para imprimir» (ES y 419), el botón de la carta-minuto lleva al
// generador (home #crear), que se abre, crea la carta con el nombre y la enseña. Y el formulario de aviso del 419.
// Uso: NODE_PATH=$(npm root -g) node tools/generador_papel.js http://127.0.0.1:8769
const { chromium } = require('playwright');
const base = process.argv[2];
(async () => {
  const b = await chromium.launch(); let mal = 0;
  for (const ruta of ['carta-para-imprimir', 'es-419/carta-para-imprimir']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    await p.addInitScript(() => { window.plausible = (n, o) => { if (o && o.callback) o.callback(); }; });
    await p.goto(`${base}/${ruta}/`, { waitUntil: 'load' });
    await p.click('.carta-minuto-b');
    await p.waitForURL(/\/(es-419\/)?(#crear)?$/, { timeout: 5000 }).catch(() => {});
    await p.waitForSelector('#gen', { state: 'visible', timeout: 5000 }).catch(() => {});
    const abierto = await p.isVisible('#gnombre');
    await p.fill('#gnombre', 'Lucía');
    for (const s of ['#gsexo .chip[data-v="nina"]', '#gdiente .chip >> nth=0', '#gtramo .chip >> nth=0'])
      await p.click(s, { timeout: 1500 }).catch(() => {});   // los que estén a la vista
    await p.click('.gen-go');
    await p.waitForTimeout(1500);
    const res = await p.evaluate(() => { const r = document.getElementById('genResult'); return { visible: !!(r && r.offsetParent), lucia: !!(r && r.innerText.includes('Lucía')), url: location.pathname } });
    const ok = abierto && res.visible && res.lucia;
    if (!ok) mal++;
    console.log((ok ? 'OK  ' : 'MAL ') + ruta, '→', res.url, JSON.stringify({ abierto, ...res }));
    await p.screenshot({ path: `/tmp/claude-0/wp/gen-${ruta.replace('/', '_')}.jpg`, type: 'jpeg', quality: 70 });
    await p.close();
  }
  // Formulario de aviso (solo 419): enviar muestra el aviso de gracias; la petición a Web3Forms se corta aquí.
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  await p.addInitScript(() => { window.plausible = () => {}; });
  await p.goto(`${base}/es-419/carta-para-imprimir/`);
  const estilo = await p.$eval('#form-email input[type=email]', e => { const s = getComputedStyle(e); return s.backgroundColor + ' / ' + s.color; });
  await p.fill('#form-email input[type=email]', 'prueba@example.com');
  await p.click('#form-email button');
  const okForm = await p.isVisible('#email-ok');
  if (!okForm) mal++;
  console.log((okForm ? 'OK  ' : 'MAL ') + 'formulario 419 (input ' + estilo + ')');
  await b.close(); process.exit(mal ? 1 : 0);
})();

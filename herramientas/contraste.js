const { chromium } = require('playwright');
function lum([r, g, b]) { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); }
(async () => {
  const b = await chromium.launch(); const base = process.argv[2];
  for (const r of ['/editable/', '/certificado-raton-perez/', '/el-ratoncito-perez-existe/', '/voz-raton-perez/', '/diario-dientes-de-leche/', '/']) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 } });
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, x => x.fulfill({ status: 204, body: '' }));
    const p = await c.newPage(); await p.goto(base + r, { waitUntil: 'load' });
    const datos = await p.evaluate(() => {
      const rgb = s => s.match(/[\d.]+/g).slice(0, 3).map(Number);
      function fondo(el) { while (el) { const cs = getComputedStyle(el); const bg = cs.backgroundColor; if (!/rgba\(0, 0, 0, 0\)|transparent/.test(bg) && cs.backgroundImage === 'none') return rgb(bg); if (cs.backgroundImage !== 'none' && el !== document.body) return null; el = el.parentElement; } return [251, 243, 226]; }
      return [...document.querySelectorAll('.cta-app .eyebrow, .paper-band .s-head .eyebrow, .cream-band .s-head .eyebrow, .fecha-actualizacion')].map(e => ({ cls: e.className, txt: e.textContent.trim().slice(0, 28), color: rgb(getComputedStyle(e).color), bg: fondo(e) }));
    });
    for (const d of datos) console.log(r, '|', d.txt, '|', d.bg ? ratio(d.color, d.bg).toFixed(2) + ':1' : 'fondo con degradado (píldora noche)');
    await c.close();
  }
  await b.close();
})();

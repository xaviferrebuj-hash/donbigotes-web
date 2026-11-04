// Punto 4 de feature/web-papel: la banda noche (cabecera, aviso de región, hero y, en el cuento, #escuchar)
// debe calcular los mismos estilos que en main. Sirve main en :8768 y la rama en :8769 (python3 -m http.server).
const { chromium } = require('playwright');
const P = require('fs').readFileSync(process.argv[2] || 'tools/paginas_papel.txt','utf8').trim().split(/\s+/);
const snap = () => {
  const PR = ['color','background-color','background-image','font-size','font-weight','font-family','border-top-color','border-left-color','box-shadow','width','opacity','text-align','line-height'];
  const raices = [...document.querySelectorAll('.db-cab, .enlace-region, section.hero, section#escuchar')];
  return raices.map(r => [r, ...r.querySelectorAll('*')]).flat().map(e => e.tagName + '.' + (typeof e.className === 'string' ? e.className : '') + ' ' + PR.map(k => getComputedStyle(e).getPropertyValue(k)).join('|'));
};
(async () => {
  const b = await chromium.launch(); let dif = 0;
  for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    const p = await b.newPage({ viewport: vp });
    await p.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    for (const u of P) {
      const r = {};
      for (const [v, port] of [['main', 8768], ['new', 8769]]) {
        await p.goto(`http://127.0.0.1:${port}/${u}/`); await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
        r[v] = await p.evaluate(snap);
      }
      const n = Math.max(r.main.length, r.new.length); const ds = [];
      for (let i = 0; i < n; i++) if (r.main[i] !== r.new[i]) ds.push([r.main[i], r.new[i]]);
      // en el cuento, #escuchar solo está en la banda en la versión nueva; en main ya existía (fuera de la banda)
      console.log(vp.width, u, r.main.length, r.new.length, 'diferencias:', ds.length);
      ds.slice(0, 4).forEach(d => console.log('   main:', d[0], '\n   new :', d[1]));
      dif += ds.length;
    }
    await p.close();
  }
  await b.close(); console.log('total', dif);
})();

// Punto 4 de feature/web-papel: los reproductores suenan (audio real) y, en la canción, se iluminan las zonas.
const { chromium } = require('playwright');
const casos = [['cancion-cepillado-dientes','cepillado-audio'],['es-419/cancion-cepillado-dientes','cepillado-audio'],['cuentos-clasicos-para-dormir','clasico-audio'],['es-419/cuentos-clasicos-para-dormir','clasico-audio'],['cuento-ratoncito-perez','cuento-audio']];
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  for (const [u, id] of casos) {
    await p.goto(`${process.argv[2] || 'http://127.0.0.1:8769'}/${u}/`, { waitUntil: 'load' });
    const r = await p.evaluate(async (id) => {
      const a = document.getElementById(id); a.muted = true;
      const btn = document.getElementById(id.replace('-audio', '-play'));
      const meta = await new Promise(res => { if (a.readyState >= 1) res(true); a.addEventListener('loadedmetadata', () => res(true)); a.addEventListener('error', () => res('error ' + (a.error && a.error.code))); a.load(); setTimeout(() => res('timeout'), 15000); });
      let jugado = null, marco = null;
      if (btn) btn.click(); else await a.play().catch(e => jugado = 'play: ' + e.message);
      await new Promise(r => setTimeout(r, 2500));
      jugado = jugado || a.currentTime;
      const m = a.closest('.reproductor').querySelector('.rep-marco'); if (m) marco = m.className;
      const zonas = [];
      for (const t of [5, 50, 80, 110, 135]) {
        a.currentTime = t; await new Promise(r => setTimeout(r, 600));
        const act = [...document.querySelectorAll('#cepillado-zonas .chip.activa')];
        zonas.push(t + 's→' + (act.map(c => c.textContent.trim() + ' ' + getComputedStyle(c).backgroundColor + ' ' + getComputedStyle(c).color).join(',') || '-'));
      }
      a.pause();
      return { meta, duracion: a.duration, tiempo: jugado, marco, zonas: document.getElementById('cepillado-zonas') ? zonas : null };
    }, id);
    console.log(u, JSON.stringify(r));
  }
  await b.close();
})();

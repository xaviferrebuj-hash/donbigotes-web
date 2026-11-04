// Ayudante de css_muerto_papel.py: recibe candidatas [hoja, regla, propiedad, selector] por página y
// devuelve las que no cambian ningún estilo calculado a 390 y a 1280 px.
const { chromium } = require(process.env.NODE_PATH ? require('path').join(process.env.NODE_PATH, 'playwright') : 'playwright');
const { base, paginas } = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const [ruta, cand] of Object.entries(paginas)) {
    let vivas = new Set();
    for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
      const p = await b.newPage({ viewport: vp });
      await p.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
      await p.goto(`${base}/${ruta}/`, { waitUntil: 'load' });
      await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
      await p.evaluate(() => { document.querySelector('head > style:last-of-type').id = 'sin-transiciones'; });
      await p.waitForTimeout(300);
      const v = await p.evaluate((cand) => {
        const PR = ['color', 'background-color', 'background-image', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-top-width', 'border-left-width', 'border-top-style', 'box-shadow', 'outline-color', 'fill', 'stroke'];
        const hojas = [...document.styleSheets].filter(s => s.ownerNode && s.ownerNode.tagName === 'STYLE' && s.ownerNode.id !== 'sin-transiciones');
        const plano = h => { const o = []; const rec = rs => { for (const r of rs) { if (r.type === 1) o.push(r); else if (r.type === 4 || r.type === 12) rec(r.cssRules); } }; rec(h.cssRules); return o; };
        const R = hojas.map(plano);
        const foto = els => els.map(e => { const s = [null, '::before', '::after', ...(e.matches('input,textarea') ? ['::placeholder'] : [])].map(ps => { const c = getComputedStyle(e, ps); return PR.map(k => c.getPropertyValue(k)).join('|'); }); return s.join('#'); });
        const vivas = [], errores = [];
        cand.forEach((c, i) => {
          const [si, ri, prop, sel] = c; const regla = R[si] && R[si][ri];
          if (!regla) { errores.push('sin regla ' + sel); vivas.push(i); return; }
          // la regla puede estar en un @media que no aplica en esta anchura: entonces aquí no cuenta
          let m = regla.parentRule; let aplica = true;
          while (m) { if (m.media && !matchMedia(m.media.mediaText).matches) aplica = false; m = m.parentRule; }
          const base = regla.selectorText.replace(/::?(before|after|placeholder|-webkit-details-marker|-webkit-[\w-]+)/g, '');
          let els = []; try { els = [...document.querySelectorAll(base)]; } catch (e) { vivas.push(i); return; }
          if (!els.length) { vivas.push(i); return; }   // sin elementos: se queda (estados de JS, etc.)
          if (!aplica) return;
          const alc = [...new Set(els.flatMap(e => [e, ...e.querySelectorAll('*')]))];
          const antes = foto(alc); const guardado = regla.style.cssText;
          regla.style.removeProperty(prop);
          const despues = foto(alc); regla.style.cssText = guardado;
          if (antes.some((x, k) => x !== despues[k])) vivas.push(i);
        });
        return { vivas, errores, sels: cand.map(c => (R[c[0]] && R[c[0]][c[1]]) ? R[c[0]][c[1]].selectorText : null) };
      }, cand);
      // comprobación de correspondencia CSSOM ↔ fuente
      v.sels.forEach((s, i) => { if (s && s.replace(/\s+/g, '') !== cand[i][3].replace(/\s+/g, '').replace(/"/g, "'") && !s.includes('::')) { if (s.replace(/[\s'"]/g, '') !== cand[i][3].replace(/[\s'"]/g, '')) process.stderr.write(`AVISO ${ruta}: ${s} ≠ ${cand[i][3]}\n`); } });
      if (v.errores.length) process.stderr.write(ruta + ' ' + v.errores.join(', ') + '\n');
      // regla que no casa con nada en una anchura pero sí en la otra: la 1.ª la marca viva; vale
      v.vivas.forEach(i => vivas.add(i));
      await p.close();
    }
    res[ruta] = cand.filter((c, i) => !vivas.has(i));
  }
  await b.close(); process.stdout.write(JSON.stringify(res));
})();

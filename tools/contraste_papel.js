// Contraste del cuerpo (main) de las páginas papel: cada elemento con texto propio, su color
// (con la opacidad acumulada) contra el fondo efectivo (fondos de los ancestros compuestos).
// Uso: NODE_PATH=$(npm root -g) node tools/contraste_papel.js http://127.0.0.1:4000 ruta1 ruta2 …
// Sale != 0 si algún par baja de 4,5:1. Fondos con degradado o imagen: se avisa y se mide contra
// el color más claro y el más oscuro del degradado.
const { chromium } = require('playwright');
const [base, ...rutas] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); let fallos = 0; const pares = {};
  for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    const p = await b.newPage({ viewport: vp });
    await p.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    for (const ruta of rutas) {
      await p.goto(`${base}/${ruta}/`, { waitUntil: 'load' });
      await p.addStyleTag({ content: '.anim{animation:none!important;opacity:1!important}' });
      // Abre las FAQ para medir también las respuestas.
      await p.evaluate(() => document.querySelectorAll('main details').forEach(d => d.open = true));
      const r = await p.evaluate(() => {
        const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; };
        const mix = (top, bot) => [0, 1, 2].map(i => top[i] * top[3] + bot[i] * (1 - top[3])).concat(1);
        const lum = c => { const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
        const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
        const hex = c => '#' + c.slice(0, 3).map(x => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
        const out = [];
        for (const el of document.querySelectorAll('main *')) {
          const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
          if (!txt || ['SCRIPT', 'STYLE', 'svg', 'text', 'textPath', 'OPTION'].includes(el.tagName)) continue;
          const rc = el.getBoundingClientRect(); if (!rc.width || !rc.height) continue;
          const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none') continue;
          let op = 1, capas = [], grad = null;
          for (let e = el; e; e = e.parentElement) {
            const t = getComputedStyle(e); op *= +t.opacity;
            if (!grad && t.backgroundImage !== 'none' && !capas.some(c => c[3] === 1)) grad = t.backgroundImage;
            const bc = parse(t.backgroundColor); if (bc && bc[3] > 0) capas.push(bc);
            if (bc && bc[3] === 1) break;
          }
          let bg = [255, 255, 255, 1]; for (const c of capas.reverse()) bg = mix(c, bg);
          const fondos = [bg];
          if (grad) for (const m of grad.matchAll(/rgba?\([^)]+\)/g)) fondos.push(mix(parse(m[0]), bg));
          let fg = parse(s.color); fg = mix([fg[0], fg[1], fg[2], fg[3] * op], bg);
          const peor = Math.min(...fondos.map(f => ratio(fg, f)));
          const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).join('.') : '';
          out.push({ sel: el.tagName.toLowerCase() + cls, fg: hex(fg), bg: hex(bg), grad: !!grad, r: +peor.toFixed(2), txt: txt.slice(0, 40) });
        }
        return out;
      });
      for (const x of r) {
        const k = `${x.fg} sobre ${x.bg}${x.grad ? ' (degradado)' : ''}`;
        const v = pares[k] ||= { r: x.r, n: 0, ej: new Set() }; v.n++; v.r = Math.min(v.r, x.r); if (v.ej.size < 4) v.ej.add(x.sel);
        if (x.r < 4.5) { fallos++; console.log(`FALLA ${x.r} ${ruta} ${vp.width} ${x.sel} ${x.fg}/${x.bg} «${x.txt}»`); }
      }
    }
    await p.close();
  }
  console.log('\nPares (color de texto sobre fondo → contraste mínimo, nº de elementos, ejemplos):');
  for (const [k, v] of Object.entries(pares).sort((a, b) => a[1].r - b[1].r)) console.log(`${v.r.toFixed(2)}:1  ${k}  ×${v.n}  ${[...v.ej].join(' ')}`);
  await b.close(); process.exit(fallos ? 1 : 0);
})();

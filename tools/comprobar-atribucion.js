#!/usr/bin/env node
/* Comprueba la atribución de los enlaces a las tiendas (bloque 1 de crecimiento, 26-sep-2026).
   Uso: node tools/comprobar-atribucion.js   (sale con 1 si algo falla)

   (a) Todo <a href> a apps.apple.com lleva pt=129172273, ct y mt=8.
   (b) Ningún ct ni referrer de Play (es.donbigotes.app) lleva nada fuera de la lista cerrada.
   (c) /carta/ y /app/ redirigen bien con user agent de iPhone, iPad, Android y ordenador:
       se ejecuta js/enrutador.js tal cual, con el data-canal que declara cada página. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const CANALES = ["carta", "ampa", "dentista", "vendedor", "creadora", "web"];
const GRUPOS_WEB = ["web-producto", "web-home", "web-contenido"];
// ct por grupo de página desde el 7-oct-2026 (sustituyen a web-contenido en App Store).
const CT_GRUPOS = ["web-imprimibles", "web-existe", "web-419", "web-otras", "web-postcarta", "web-postcarta-419"];
// utm_medium propios con utm_source=web: pantalla post-carta y banda Android (esta, en JS).
const MEDIOS_WEB = ["postcarta", "banda"];
const CT_VALIDOS = CANALES.concat(GRUPOS_WEB, CT_GRUPOS, ["otros"]);
const MEDIO = /^[a-z0-9-]{1,20}$/;
const CAMPANA = /^[a-z0-9-]{1,40}$/;

let fallos = 0;
function falla(msg) { fallos++; console.log("  ✗ " + msg); }

function paginas(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "Claude outputs" || e.name === "tools") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(paginas(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

function desescapar(s) { return s.replace(/&amp;/g, "&"); }

// ---------- (a) y (b): enlaces estáticos ----------
console.log("(a)(b) Enlaces a las tiendas en el HTML");
let nApple = 0, nPlay = 0;
for (const f of paginas(RAIZ)) {
  const rel = path.relative(RAIZ, f);
  const html = fs.readFileSync(f, "utf8");
  const hrefs = [...html.matchAll(/<a\b[^>]*?\bhref="([^"]*)"/g)].map(m => desescapar(m[1]));
  for (const h of hrefs) {
    if (/apps\.apple\.com\//.test(h)) {
      nApple++;
      const u = new URL(h);
      const q = u.searchParams;
      if (q.get("pt") !== "129172273" || !q.get("ct") || q.get("mt") !== "8")
        falla(`${rel}: App Store sin pt/ct/mt → ${h}`);
      else if (!CT_VALIDOS.includes(q.get("ct")))
        falla(`${rel}: ct fuera de la lista → ${q.get("ct")}`);
      const sobra = [...q.keys()].filter(k => !["pt", "ct", "mt"].includes(k));
      if (sobra.length) falla(`${rel}: App Store con parámetros de más → ${sobra}`);
    }
    if (/play\.google\.com\/store\/apps\/details\?id=es\.donbigotes\.app/.test(h)) {
      nPlay++;
      const ref = new URL(h).searchParams.get("referrer");
      if (!ref) { falla(`${rel}: Play sin referrer → ${h}`); continue; }
      const r = new URLSearchParams(ref);
      const src = r.get("utm_source"), med = r.get("utm_medium"), camp = r.get("utm_campaign");
      if (!CANALES.concat("otros").includes(src)) falla(`${rel}: utm_source fuera de la lista → ${src}`);
      if (src === "web" && !GRUPOS_WEB.includes(med) && !MEDIOS_WEB.includes(med) && med !== "otros")
        falla(`${rel}: grupo web desconocido → ${med}`);
      if (!MEDIO.test(med || "")) falla(`${rel}: utm_medium no válido → ${med}`);
      if (camp !== null && !CAMPANA.test(camp)) falla(`${rel}: utm_campaign no válido → ${camp}`);
      const sobra = [...r.keys()].filter(k => !["utm_source", "utm_medium", "utm_campaign"].includes(k));
      if (sobra.length) falla(`${rel}: referrer con claves de más → ${sobra}`);
    }
  }
}
const fallback = /UTM_FALLBACK = "([^"]*)"/.exec(fs.readFileSync(path.join(RAIZ, "js/enlaces-app.js"), "utf8"));
if (!fallback || new URLSearchParams(fallback[1]).get("utm_source") !== "web")
  falla("js/enlaces-app.js: UTM_FALLBACK no usa el canal web");
console.log(`  ${nApple} enlaces a App Store y ${nPlay} a Play revisados`);

// ---------- (c): enrutadores ----------
console.log("(c) /carta/ y /app/ con cada user agent");
const UA = {
  iphone: ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 WhatsApp/2.24", 5],
  ipad: ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15", 5],
  android: ["Mozilla/5.0 (Linux; Android 14; SM-A546B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0 Mobile Safari/537.36 WhatsApp", 5],
  escritorio: ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36", 0],
};
const CODIGO = fs.readFileSync(path.join(RAIZ, "js/enrutador.js"), "utf8");
const IOS = (ct) => `https://apps.apple.com/app/apple-store/id6798414411?pt=129172273&ct=${ct}&mt=8`;
const AND = (s, m) => "https://play.google.com/store/apps/details?id=es.donbigotes.app&referrer=" +
  encodeURIComponent(`utm_source=${s}&utm_medium=${m}&utm_campaign=${m}`);

function ejecutar(pagina, busqueda, ua, via) {
  const html = fs.readFileSync(path.join(RAIZ, pagina, "index.html"), "utf8");
  if (!/<meta name="robots" content="noindex">/.test(html)) falla(`${pagina}: sin noindex`);
  if (!/plausible\.io\/js\/script\.manual\.js/.test(html)) falla(`${pagina}: sin Plausible manual`);
  const tag = /<script src="\/js\/enrutador\.js"([^>]*)><\/script>/.exec(html);
  if (!tag) { falla(`${pagina}: no carga js/enrutador.js`); return {}; }
  const canalAttr = (/data-canal="([^"]*)"/.exec(tag[1]) || [])[1] || null;
  const tiendas = [...html.matchAll(/data-tienda="(appstore|playstore)"/g)].map(m => ({ tipo: m[1], href: null }));
  const reemplazos = [], timers = [];
  const win = {
    location: { search: busqueda, replace: (u) => reemplazos.push(u) },
    setTimeout: (fn, ms) => timers.push([fn, ms]),
  };
  const ctx = {
    window: win, URLSearchParams,
    navigator: { userAgent: ua[0], maxTouchPoints: ua[1] },
    document: {
      currentScript: { getAttribute: (n) => (n === "data-canal" ? canalAttr : null) },
      documentElement: { className: "" },
      querySelectorAll: () => tiendas.map(t => ({
        getAttribute: (n) => (n === "data-tienda" ? t.tipo : t.href),
        setAttribute: (n, v) => { t.href = v; },
      })),
    },
  };
  vm.runInNewContext(CODIGO, ctx);
  const cola = (win.plausible && win.plausible.q) || [];
  const pv = cola.find(a => a[0] === "pageview");
  if (!pv) falla(`${pagina}${busqueda}: no registra la visita en Plausible`);
  // Llega primero el callback de Plausible o el temporizador, y después el otro.
  if (via === "callback") { pv && pv[1].callback(); timers.forEach(([fn]) => fn()); }
  else { timers.forEach(([fn]) => fn()); pv && pv[1].callback(); }
  return { reemplazos, timers, tiendas, clase: ctx.document.documentElement.className };
}

const casos = [
  // pagina, búsqueda, ct esperado, [source, medium] esperados en Play
  ["carta", "?utm_source=carta&utm_medium=qr", "carta", ["carta", "qr"]],
  ["carta", "?utm_source=carta&utm_medium=whatsapp", "carta", ["carta", "whatsapp"]],
  ["carta", "?utm_source=carta&utm_medium=email", "carta", ["carta", "otros"]],
  ["carta", "", "carta", ["carta", "otros"]],
  ["carta", "?utm_source=dentista&utm_medium=QR", "carta", ["carta", "qr"]],
  ["app", "?utm_source=dentista&utm_medium=qr", "dentista", ["dentista", "qr"]],
  ["app", "?utm_source=ampa&utm_medium=colegio-san-jose", "ampa", ["ampa", "colegio-san-jose"]],
  ["app", "?utm_source=vendedor&utm_medium=puertamagica", "vendedor", ["vendedor", "puertamagica"]],
  ["app", "?utm_source=creadora&utm_medium=ig", "creadora", ["creadora", "ig"]],
  ["app", "?utm_source=web&utm_medium=blog", "web", ["web", "blog"]],
  ["app", "?utm_source=Carta&utm_medium=WhatsApp", "carta", ["carta", "whatsapp"]],
  ["app", "?utm_source=pinterest&utm_medium=pin", "otros", ["otros", "pin"]],
  ["app", "?utm_source=dentista&utm_medium=clinica%20de%20ana%20lopez", "dentista", ["dentista", "otros"]],
  ["app", "?utm_source=dentista&utm_medium=un-medio-demasiado-largo-de-verdad", "dentista", ["dentista", "otros"]],
  ["app", "?utm_source=a%26b&utm_medium=x%26utm_source%3Dhack", "otros", ["otros", "otros"]],
  ["app", "", "otros", ["otros", "otros"]],
];
let nCasos = 0;
for (const [pagina, q, ct, [s, m]] of casos) {
  for (const via of ["callback", "temporizador"]) {
    for (const [nombre, ua] of Object.entries(UA)) {
      nCasos++;
      const r = ejecutar(pagina, q, ua, via);
      const id = `/${pagina}/${q} [${nombre}, ${via}]`;
      const esperado = nombre === "escritorio" ? null : (nombre === "android" ? AND(s, m) : IOS(ct));
      if (esperado === null) {
        if (r.reemplazos.length) falla(`${id}: redirige en ordenador → ${r.reemplazos}`);
      } else {
        if (r.reemplazos.length !== 1 || r.reemplazos[0] !== esperado)
          falla(`${id}: esperaba 1 redirección a ${esperado}, hubo ${JSON.stringify(r.reemplazos)}`);
        if (!r.timers.length || r.timers[0][1] > 1000) falla(`${id}: sin temporizador de ≤1 s`);
      }
      for (const t of r.tiendas) {
        const bien = t.tipo === "appstore" ? IOS(ct) : AND(s, m);
        if (t.href !== bien) falla(`${id}: botón ${t.tipo} → ${t.href}`);
      }
    }
  }
}
if (/document\.cookie|localStorage|sessionStorage/.test(CODIGO)) falla("js/enrutador.js usa cookies o almacenamiento");
console.log(`  ${nCasos} ejecuciones del enrutador`);

console.log(fallos ? `\n${fallos} fallo(s)` : "\nTodo correcto");
process.exit(fallos ? 1 : 0);

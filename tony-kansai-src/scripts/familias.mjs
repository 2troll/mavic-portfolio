#!/usr/bin/env node
// Genera public/familias/**: la sección en español de Antonio, coordinador y
// guía en Japón (socio de Tony), para familias y grupos de 6 a 10 personas de
// España, México y Centroamérica, y receptivo para agencias.
//
//   node scripts/familias.mjs
//   FAMILIAS_DATOS=/ruta/datos.mjs FAMILIAS_FOTOS=/ruta/fotos.json node scripts/familias.mjs   (pruebas)
//
// Mismo patrón que turkce.mjs, francais.mjs y kndr.mjs: HTML estático completo,
// porque GPTBot, ClaudeBot y PerplexityBot no ejecutan JavaScript y el texto
// entero tiene que estar en la primera respuesta del servidor. rutas-estaticas.mjs
// no las pisa (llevan data-estatica en <html>).
//
// Animación = mejora progresiva. El CSS base no oculta nada; el JS
// (public/familias/familias.js, generado aquí) carga GSAP + ScrollTrigger + Lenis
// solo si el usuario no pide «reducir movimiento», y es él quien pone los
// estados iniciales. Si el CDN falla, un temporizador devuelve el titular.
//
// Reglas de contenido: el texto vive en familias-datos.mjs (otro dueño). Aquí no
// se inventa nada sobre Antonio: ni precios, ni años, ni títulos, ni reseñas.
// Nada de alcohol ni juego. Nunca hebreo.
//
// Fotos: scripts/familias-fotos.json (formato de francais-photos.json:
// autor, lisans, kaynak, w, h, anchos) y archivos en
// public/familias/foto/<clave>-<ancho>.webp. Si falta una foto o su archivo, la
// página no se rompe: sale un degradado.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const SECCION = '/familias/'

// Número provisional (el de Tony): se cambiará al número de Antonio cuando lo dé.
const WA_NUMERO = '34634193106'
const WA_VISIBLE = '+34 634 193 106'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const WA_GENERAL = wa('Hola Antonio, somos una familia/grupo de __ personas y queremos viajar a Japón. Fechas: ')

const GSAP_V = '3.15.0'
const LENIS_V = '1.3.27'

// ---------------------------------------------------------------- datos
const rutaDatos = process.env.FAMILIAS_DATOS ? pathToFileURL(resolve(process.env.FAMILIAS_DATOS)).href : './familias-datos.mjs'
const D = await import(rutaDatos)
const { PORTADA, CONDICIONES, PAGINAS } = D
const HOY = D.HOY ?? new Date().toISOString().slice(0, 10)
const COORDINADOR = D.COORDINADOR ?? {}
const FAQ_GLOBAL = D.FAQ_GLOBAL ?? []
const FUENTES = D.FUENTES ?? []
const NOMBRE = COORDINADOR.nombre ?? 'Antonio'
for (const [k, v] of Object.entries({ PORTADA, CONDICIONES, PAGINAS })) if (!v) throw new Error(`familias: familias-datos.mjs no exporta ${k}`)
const SLUG_COND = CONDICIONES.slug || 'condiciones'

const rutaFotos = process.env.FAMILIAS_FOTOS ? resolve(process.env.FAMILIAS_FOTOS) : join(root, 'scripts/familias-fotos.json')
let FOTOS = {}
if (existsSync(rutaFotos)) FOTOS = JSON.parse(readFileSync(rutaFotos, 'utf8'))
else console.warn('⚠ familias: falta scripts/familias-fotos.json; todas las fotos salen como degradado')

// ---------------------------------------------------------------- utilidades
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Texto de datos con unas pocas etiquetas permitidas (enlaces, negrita, cursiva).
const rico = (s) => esc(s)
  .replace(/&lt;a href=&quot;((?:\/|https:\/\/)[^"&<>]*)&quot;&gt;/g, (_, h) => `<a href="${h}">`)
  .replace(/&lt;\/a&gt;/g, '</a>')
  .replace(/&lt;(\/?)(strong|em|b|i)&gt;/g, '<$1$2>')
const sinEtiquetas = (s) => String(s ?? '').replace(/<[^>]+>/g, '')
const ruta = (slug) => (slug ? `${SECCION}${slug}/` : SECCION)
const url = (slug) => `${BASE}${ruta(slug)}`

// Fotos: solo entran en srcset los anchos cuyo archivo existe.
// (`dir` y `clave` son opcionales y solo sirven para pruebas con fotos de otra sección.)
const avisadas = new Set()
function foto(k) {
  const f = k && FOTOS[k]
  if (!f) { if (k && !avisadas.has(k)) { avisadas.add(k); console.warn(`⚠ familias: sin foto «${k}», sale degradado`) } return null }
  const dir = f.dir ?? '/familias/foto'
  const clave = f.clave ?? k
  const anchos = (f.anchos ?? []).filter((w) => existsSync(join(root, 'public', dir, `${clave}-${w}.webp`))).sort((a, b) => b - a)
  if (!anchos.length) { if (!avisadas.has(k)) { avisadas.add(k); console.warn(`⚠ familias: la foto «${k}» no tiene archivos en public${dir}/, sale degradado`) } return null }
  const src = (w) => `${dir}/${clave}-${w}.webp`
  const grande = anchos.find((w) => w <= 1920) ?? anchos.at(-1)
  return {
    ...f, anchos, src, grande, pequeno: anchos.at(-1),
    srcset: anchos.map((w) => `${src(w)} ${Math.min(w, f.w)}w`).join(', '),
    alto: (w) => Math.round((f.h / f.w) * w),
  }
}
const credito = (f) => `Foto: <a href="${esc(f.kaynak)}" rel="nofollow">${esc(f.autor)}</a> · ${esc(f.lisans)}`
function img(k, alt, { sizes = '100vw', hero = false, clase = '' } = {}) {
  const f = foto(k)
  if (!f) return `<div class="sinfoto ${clase}" role="img" aria-label="${esc(alt)}"></div>`
  return `<img class="${clase}" src="${f.src(hero ? f.grande : f.pequeno)}" srcset="${f.srcset}" sizes="${sizes}" alt="${esc(alt)}" width="${f.w}" height="${f.h}"${hero ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'}>`
}
const imagenOg = (k) => { const f = foto(k); return f ? `${BASE}${f.src(f.grande)}` : `${BASE}/logo-square.svg` }

// Iconos de línea, trazo 1.5, 24×24.
const ICONOS = {
  guia: '<path d="M6 21V4"/><path d="M6 4h11l-2.5 4L17 12H6"/>',
  ruta: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" stroke-dasharray="2.5 2.5"/>',
  furgo: '<path d="M2.5 16V8.5A1.5 1.5 0 0 1 4 7h10.5l4.5 4.5h1A1.5 1.5 0 0 1 21.5 13v3h-2"/><path d="M14.5 7v4.5H19"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/><path d="M9 16.5h6"/>',
  hotel: '<path d="M3 19V6"/><path d="M3 15h18v4"/><path d="M21 15v-2.5A2.5 2.5 0 0 0 18.5 10H11v5"/><circle cx="7" cy="11.5" r="1.8"/>',
  corazon: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  montana: '<path d="M2.5 19.5 9 8.5l4 6.5 2.5-3.5 6 8z"/><path d="M7.4 11.2 9 12.4l1.4-1.2"/>',
  estrella: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  tarjeta: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.5h18"/><path d="M6.5 14.5h4"/>',
}
const icono = (n) => `<svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[n] ?? ICONOS.estrella}</svg>`
const ICO_WA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c0 2.8 2.7 5.5 5.5 5.5l1-1.4-2-1-1 .8c-.9-.4-1.6-1.1-2-2l.8-1-1-2z"/></svg>'
const ICO_SI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
const ICO_NO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>'
const FLECHA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

// Titular partido en palabras para el revelado; el texto sigue leyéndose entero.
const partir = (s) => esc(s).split(/\s+/).filter(Boolean).map((p) => `<span class="w"><span>${p}</span></span>`).join(' ')

// Enlaces internos: slug de PAGINAS, el de condiciones o '' (portada).
const porSlug = new Map(PAGINAS.map((p) => [p.slug, p]))
function destino(slug, desde) {
  if (slug === '' || slug === 'familias') return { href: SECCION, h1: PORTADA.h1, desc: PORTADA.entradilla, foto: 'hero' }
  if (slug === SLUG_COND) return { href: ruta(SLUG_COND), h1: CONDICIONES.h1, desc: CONDICIONES.entradilla, foto: 'familia' }
  const p = porSlug.get(slug)
  if (!p) { console.warn(`⚠ familias: ${desde} enlaza a «${slug}», que no existe; se omite`); return null }
  return { href: ruta(p.slug), h1: p.h1, desc: p.descripcion || p.entradilla, foto: p.foto }
}

// ---------------------------------------------------------------- CSS
const CSS = `
:root{--bg:#f3f2ee;--bg2:#e9e8e2;--kart:#fbfbf8;--tinta:#15211c;--suave:#56625c;--linea:#d9dad2;--acento:#1d5c45;--acento-2:#e8efe9;--ambar:#c9861d;--sobre:#fff;--sombra:20 40 30}
@media (prefers-color-scheme:dark){:root{--bg:#0f1512;--bg2:#141c18;--kart:#18211d;--tinta:#ebefe9;--suave:#a3aea7;--linea:#28332e;--acento:#6cc79d;--acento-2:#1b2b24;--ambar:#e6a948;--sobre:#0f1512;--sombra:0 0 0}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}
body{margin:0;background:var(--bg);color:var(--tinta);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow-x:hidden}
img{max-width:100%}a{color:var(--acento);text-underline-offset:3px}
.kap{width:100%;max-width:1200px;margin:0 auto;padding:0 16px}@media (min-width:768px){.kap{padding:0 32px}}
h1,h2,h3,.serif{font-family:Fraunces,Georgia,serif;font-optical-sizing:auto;font-weight:500;letter-spacing:-.015em;line-height:1.12}
h2{font-size:clamp(30px,4.4vw,52px);margin:0 0 18px}h3{font-size:21px;margin:0 0 6px}
.lead{font-size:clamp(18px,1.8vw,20px);color:var(--suave);max-width:60ch;margin:0 0 28px}
.seccion{padding:clamp(72px,10vw,128px) 0}.seccion.alt{background:var(--bg2)}
.btn{display:inline-flex;align-items:center;gap:10px;background:var(--acento);color:var(--sobre);text-decoration:none;font-weight:600;padding:15px 24px;border-radius:999px;white-space:nowrap;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s}
.btn:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px rgb(var(--sombra)/.55)}.btn:active{transform:translateY(0) scale(.98)}
.btn.claro{background:#f4f3ee;color:#15211c}.btn.fantasma{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}.btn.fantasma:hover{box-shadow:inset 0 0 0 1px #fff}
.enl{display:inline-flex;align-items:center;gap:8px;font-weight:600;text-decoration:none}.enl svg{transition:transform .25s}.enl:hover svg{transform:translateX(4px)}
/* cabecera */
.cab{position:absolute;inset:0 0 auto;z-index:5;color:#fff}.cab .kap{display:flex;justify-content:space-between;align-items:center;gap:16px;height:72px}
.cab a{color:#fff;text-decoration:none}.marca{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px;line-height:1.2}
.marca .mono{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-family:Fraunces,Georgia,serif;font-size:18px;background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}
.marca small{display:block;font-weight:400;opacity:.8;font-size:12.5px}
.cab nav{display:flex;gap:22px;font-size:14.5px}.cab nav a{opacity:.85}.cab nav a:hover{opacity:1}
@media (max-width:820px){.cab nav a:not(.siempre){display:none}}
/* hero */
.hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden;background:#0f1a15;color:#fff;isolation:isolate}
.hero .fondo{position:absolute;inset:0;z-index:-2}.hero .fondo img,.hero .fondo .sinfoto{width:100%;height:100%;object-fit:cover;display:block}
.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(8,14,11,.55) 0,rgba(8,14,11,.05) 28%,rgba(8,14,11,.25) 55%,rgba(8,14,11,.86) 100%)}
.hero .kap{padding-top:120px;padding-bottom:clamp(40px,7vh,80px)}
.hero h1{font-size:clamp(40px,6.6vw,88px);font-weight:400;line-height:1.04;margin:0 0 22px;max-width:14ch;text-wrap:balance}
.hero h1 .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}.hero h1 .w>span{display:inline-block}
.hero .lead{color:rgba(255,255,255,.88);max-width:44ch;margin-bottom:30px}
.ceja{display:inline-flex;align-items:center;gap:12px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin:0 0 22px;color:rgba(255,255,255,.9)}.ceja::before{content:"";width:28px;height:1px;background:currentColor}
.gancho{font-family:Fraunces,Georgia,serif;font-style:italic;font-size:clamp(20px,2.4vw,28px);color:#f2c46d;margin:0 0 30px;line-height:1.3}
.g-rot>span+span::before{content:" · "}
.acciones{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.hero .credito{position:absolute;right:12px;top:78px;font-size:11px;color:rgba(255,255,255,.62)}.hero .credito a{color:inherit}
.hero.sub{min-height:min(74svh,760px)}.hero.sub h1{font-size:clamp(34px,5.2vw,68px);max-width:18ch}
.miga{font-size:14px;margin:0 0 18px;color:rgba(255,255,255,.8)}.miga a{color:inherit}.miga ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}.miga li+li::before{content:"/";margin-right:6px;opacity:.6}
.sinfoto{background:radial-gradient(120% 90% at 20% 10%,#2f6b54 0,transparent 55%),radial-gradient(90% 80% at 85% 30%,#b0702a 0,transparent 50%),linear-gradient(160deg,#173328,#0d1a14)}
/* datos rápidos bajo el hero */
.datos{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--linea)}
.datos div{padding:26px 16px;border-right:1px solid var(--linea)}.datos div:last-child{border-right:0}
.datos strong{display:block;font-family:Fraunces,Georgia,serif;font-weight:500;font-size:clamp(22px,2.6vw,32px);line-height:1.1}.datos span{color:var(--suave);font-size:14.5px}
@media (max-width:640px){.datos{grid-template-columns:1fr}.datos div{border-right:0;border-bottom:1px solid var(--linea);padding:18px 0}.datos div:last-child{border-bottom:0}}
/* servicios: rejilla con ritmo */
.servicios{display:grid;gap:14px;grid-template-columns:repeat(12,1fr);list-style:none;padding:0;margin:40px 0 0}
.servicios li{grid-column:span 3;background:var(--kart);border:1px solid var(--linea);border-radius:20px;padding:26px 24px 28px;transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s}
.servicios li:hover{transform:translateY(-4px);box-shadow:0 22px 40px -28px rgb(var(--sombra)/.6)}
.servicios li:nth-child(1){grid-column:span 6;background:var(--acento);color:var(--sobre);border-color:transparent}.servicios li:nth-child(1) p{color:inherit;opacity:.85}.servicios li:nth-child(1) .ico-c{background:rgba(255,255,255,.14);color:inherit}
.servicios li:nth-child(6){grid-column:span 6;background:var(--acento-2)}
.servicios .ico-c{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--acento-2);color:var(--acento);margin-bottom:22px}
.servicios p{margin:0;color:var(--suave);font-size:15.5px}
@media (max-width:1000px){.servicios li,.servicios li:nth-child(1),.servicios li:nth-child(6){grid-column:span 6}}
@media (max-width:640px){.servicios{gap:10px}.servicios li{grid-column:span 6;padding:18px 16px 20px;border-radius:16px}.servicios li:nth-child(1),.servicios li:nth-child(6){grid-column:1/-1}.servicios .ico-c{width:40px;height:40px;margin-bottom:14px}.servicios h3{font-size:18px}.servicios p{font-size:14.5px}}
.servicios li:nth-child(6) .ico-c{background:var(--kart)}
/* billetes troquelados */
.billetes{list-style:none;padding:0;margin:44px 0 0;display:grid;gap:22px}
.billete{--corte:62%;position:relative;display:grid;grid-template-columns:var(--corte) 1fr;background:var(--kart);border:1px solid var(--linea);border-radius:18px;box-shadow:0 18px 40px -30px rgb(var(--sombra)/.55);transition:transform .45s cubic-bezier(.16,1,.3,1)}
.billete:hover{transform:translateY(-3px) rotate(-.4deg)}
.billete>div{padding:28px clamp(20px,3vw,36px)}
.billete .talon{background:var(--acento-2);border-left:2px dashed var(--linea);border-radius:0 18px 18px 0;position:relative}
.billete::before,.billete::after{content:"";position:absolute;left:var(--corte);width:26px;height:26px;margin-left:-13px;border-radius:50%;background:var(--bg);border:1px solid var(--linea)}
.billete::before{top:-14px;clip-path:inset(50% 0 0 0)}.billete::after{bottom:-14px;clip-path:inset(0 0 50% 0)}
.seccion.alt .billete::before,.seccion.alt .billete::after{background:var(--bg2)}
.b-num{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:var(--suave);letter-spacing:.06em}
.billete h3{font-size:clamp(22px,2.4vw,28px);margin:6px 0 12px}
.etq{display:block;font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--suave);margin-bottom:6px}
.billete p{margin:0 0 14px}.talon .etq{color:var(--acento)}
.sello{position:absolute;right:18px;top:-16px;width:76px;height:76px;border-radius:50%;display:grid;place-items:center;text-align:center;font:700 10.5px/1.15 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--ambar);border:2px solid currentColor;box-shadow:inset 0 0 0 4px var(--acento-2),inset 0 0 0 5px currentColor;background:var(--acento-2);transform:rotate(-12deg)}
@media (max-width:720px){.billete{grid-template-columns:1fr}.billete .talon{border-left:0;border-top:2px dashed var(--linea);border-radius:0 0 18px 18px}.billete::before,.billete::after{display:none}.sello{top:auto;bottom:16px;width:64px;height:64px;font-size:9.5px}}
/* sí / no gestiona */
.siono{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:40px}
.siono>div{border-radius:20px;padding:30px clamp(20px,3vw,36px);border:1px solid var(--linea);background:var(--kart)}
.siono .si{background:var(--acento);color:var(--sobre);border-color:transparent}.siono .si .ok{background:rgba(255,255,255,.16);color:inherit}.siono .si p{opacity:.85}
.siono h3{font-size:26px;margin-bottom:18px}.siono ul{list-style:none;padding:0;margin:0;display:grid;gap:16px}
.siono li{display:grid;grid-template-columns:30px 1fr;gap:12px;align-items:start}.siono li strong{display:block}
.siono p{margin:2px 0 0;font-size:15.5px;color:inherit;opacity:.8}.siono .consejo{display:block;margin-top:6px;font-size:14.5px;color:var(--acento);opacity:1}
.ok{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--acento-2);color:var(--acento)}
@media (max-width:760px){.siono{grid-template-columns:1fr}}
/* pasos */
.pasos-c{display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,6vw,96px)}.pasos-c .fijo{position:sticky;top:40px;align-self:start}
.pasos{list-style:none;margin:0;padding:0 0 0 60px;position:relative;counter-reset:p}
.p-linea{position:absolute;left:21px;top:10px;bottom:10px;width:2px;background:var(--linea);border-radius:2px}.p-linea span{position:absolute;inset:0;background:var(--acento);transform-origin:top;border-radius:2px}
.pasos li{position:relative;padding:4px 0 44px;counter-increment:p}.pasos li:last-child{padding-bottom:0}
.pasos li::before{content:counter(p);position:absolute;left:-60px;top:0;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--kart);border:1px solid var(--linea);font-family:Fraunces,Georgia,serif;font-size:19px;color:var(--acento);transition:background .4s,color .4s}
.pasos li.activo::before{background:var(--acento);color:var(--sobre);border-color:var(--acento)}
.pasos h3{font-size:24px;margin-top:6px}.pasos p{margin:0;color:var(--suave)}
@media (max-width:860px){.pasos-c{grid-template-columns:1fr}.pasos-c .fijo{position:static}}
/* corea */
.corea{position:relative;overflow:hidden;background:#101a16;color:#eef2ee;padding:clamp(64px,9vw,110px) 0}
.corea .kanji{position:absolute;right:-2vw;top:50%;transform:translateY(-50%);font:500 clamp(120px,22vw,300px)/1 "Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.14);white-space:nowrap;pointer-events:none;user-select:none}
.corea h2{margin-bottom:10px}.corea p{max-width:48ch;color:rgba(238,242,238,.8);margin:0}
.pildora{display:inline-block;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:999px;background:rgba(242,196,109,.14);color:#f2c46d;margin-bottom:18px}
/* tarjetas de páginas */
.guias{list-style:none;padding:0;margin:40px 0 0;display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr))}
.guias li{position:relative;border-radius:18px;overflow:hidden;background:var(--kart);border:1px solid var(--linea)}
.guias a{display:block;color:var(--tinta);text-decoration:none;height:100%}
.guias figure{margin:0;aspect-ratio:4/3;overflow:hidden;background:#1d2b25}.guias figure img,.guias figure .sinfoto{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.16,1,.3,1)}
.guias li:hover figure img{transform:scale(1.05)}
.guias .ki{padding:16px 18px 20px}.guias h3{font-size:19px}.guias p{margin:0;color:var(--suave);font-size:15px}
.guias small{position:absolute;left:0;right:0;top:0;padding:5px 9px 16px;font-size:10px;color:rgba(255,255,255,.85);background:linear-gradient(rgba(0,0,0,.5),transparent);pointer-events:none}.guias small a{color:inherit;pointer-events:auto}
/* antonio */
.persona{display:grid;grid-template-columns:auto 1fr;gap:clamp(24px,4vw,56px);align-items:start;max-width:900px}
.persona .mono{width:clamp(88px,12vw,140px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:var(--acento);color:var(--sobre);font:400 clamp(44px,6vw,72px)/1 Fraunces,Georgia,serif}
.persona p{margin:0 0 14px;max-width:62ch}
@media (max-width:640px){.persona{grid-template-columns:1fr}}
/* faq */
.faq{max-width:820px;margin-top:32px}
details{border-top:1px solid var(--linea);padding:4px 0}details:last-child{border-bottom:1px solid var(--linea)}
summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:16px;padding:18px 0;font-weight:600;font-size:18px}summary::-webkit-details-marker{display:none}
summary::after{content:"+";font:300 26px/1 system-ui;color:var(--acento);transition:transform .3s}details[open] summary::after{transform:rotate(45deg)}
details p{margin:0 0 20px;color:var(--suave);max-width:68ch}
/* cierre */
.cierre{text-align:left}.cierre h2{max-width:18ch}
/* artículo */
.articulo{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(32px,5vw,72px);padding-top:clamp(48px,7vw,88px);padding-bottom:clamp(56px,8vw,100px)}
.articulo .cuerpo{max-width:720px;min-width:0}
.articulo .entr{font-size:clamp(19px,2vw,22px);line-height:1.55;margin:0 0 36px;font-family:Fraunces,Georgia,serif;font-weight:400}
.articulo h2{font-size:clamp(26px,3vw,36px);margin:52px 0 14px;scroll-margin-top:24px}
.articulo ul.lista{padding:0;list-style:none;display:grid;gap:10px;margin:18px 0}
.articulo ul.lista li{position:relative;padding-left:26px}.articulo ul.lista li::before{content:"";position:absolute;left:4px;top:.62em;width:9px;height:9px;border-radius:50%;border:2px solid var(--acento)}
.lateral{position:sticky;top:24px;align-self:start;display:grid;gap:16px}
.caja{background:var(--kart);border:1px solid var(--linea);border-radius:20px;padding:22px}
.caja h3{font-size:20px}.caja p{margin:0 0 14px;color:var(--suave);font-size:15.5px}.caja .btn{width:100%;justify-content:center}
.indice ol{margin:0;padding-left:18px;font-size:15px;display:grid;gap:6px}.indice a{color:var(--tinta);text-decoration:none}.indice a:hover{color:var(--acento)}
@media (max-width:960px){.articulo{grid-template-columns:1fr}.lateral{position:static}.indice{display:none}}
.aviso{border-left:3px solid var(--ambar);background:var(--kart);padding:16px 20px;border-radius:0 14px 14px 0;margin:18px 0}
.aviso ul{margin:0;padding-left:18px}
.fuentes{list-style:none;padding:0;margin:20px 0 0;display:grid;gap:10px}
.fuentes li{display:grid;grid-template-columns:1fr auto;gap:4px 16px;padding:14px 0;border-bottom:1px solid var(--linea)}
.fuentes .dom{font-size:14px;color:var(--suave)}.fuentes time{font-size:13px;color:var(--suave);white-space:nowrap}
.vigencia{font-size:14.5px;color:var(--suave)}
/* pie */
footer{border-top:1px solid var(--linea);padding:44px 0 110px;color:var(--suave);font-size:14.5px}footer a{color:var(--suave)}footer p{margin:0 0 10px;max-width:80ch}
.pie-enl{display:flex;flex-wrap:wrap;gap:8px 18px;margin:16px 0}.pie-enl a{text-decoration:none}.pie-enl a:hover{color:var(--acento)}
/* WhatsApp fijo */
.wa-fijo{position:fixed;right:16px;bottom:16px;z-index:9;display:inline-flex;align-items:center;gap:10px;background:var(--acento);color:var(--sobre);text-decoration:none;font-weight:600;font-size:15px;padding:13px 20px 13px 16px;border-radius:999px;box-shadow:0 14px 34px -12px rgb(var(--sombra)/.7),inset 0 1px 0 rgba(255,255,255,.18);transition:transform .3s cubic-bezier(.16,1,.3,1)}
.wa-fijo:hover{transform:translateY(-2px)}
:focus-visible{outline:2px solid var(--ambar);outline-offset:3px}
/* estados que pone el JS (solo con animación permitida) */
.js-anim:not(.anim-listo) .hero h1 .w>span{transform:translateY(105%)}.js-anim:not(.anim-listo) .hero .entra{opacity:0}
.js-anim .g-rot{display:inline-grid;vertical-align:bottom}.js-anim .g-rot>span{grid-area:1/1}.js-anim .g-rot>span+span::before{content:none}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`

// ---------------------------------------------------------------- JS (se escribe en public/familias/familias.js)
const JS = `// Generado por scripts/familias.mjs. Mejora progresiva: sin esto la página se ve entera.
(function () {
  var html = document.documentElement
  if (!html.classList.contains('js-anim')) return
  var CDN = 'https://cdn.jsdelivr.net/npm/'
  function cargar(src) { return new Promise(function (ok, mal) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = mal; document.head.appendChild(s) }) }
  Promise.all([cargar(CDN + 'gsap@${GSAP_V}/dist/gsap.min.js'), cargar(CDN + 'lenis@${LENIS_V}/dist/lenis.min.js')])
    .then(function () { return cargar(CDN + 'gsap@${GSAP_V}/dist/ScrollTrigger.min.js') })
    .then(iniciar)
    .catch(function () { html.classList.remove('js-anim') })

  function iniciar() {
    window.__famAnim = true
    html.classList.add('js-anim')
    var gsap = window.gsap, ST = window.ScrollTrigger
    gsap.registerPlugin(ST)
    var lenis = new window.Lenis({ anchors: { offset: -16 }, stopInertiaOnNavigate: true })
    lenis.on('scroll', ST.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    var q = function (s) { return gsap.utils.toArray(s) }

    // Hero: la foto se acerca, el titular sube palabra a palabra y el resto entra después.
    var foto = document.querySelector('.hero .fondo > *')
    if (foto) {
      gsap.fromTo(foto, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'expo.out' })
      gsap.to(foto, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    }
    var palabras = q('.hero h1 .w > span'), entra = q('.hero .entra')
    gsap.set(palabras, { y: 0, yPercent: 105 })
    gsap.set(entra, { y: 26, autoAlpha: 0 })
    html.classList.add('anim-listo')
    gsap.to(palabras, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.055, delay: 0.1 })
    gsap.to(entra, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.55 })

    // Gancho rotatorio: una frase cada 2,8 s.
    var g = q('.g-rot > span')
    if (g.length > 1) {
      gsap.set(g.slice(1), { yPercent: 100, autoAlpha: 0 })
      var tl = gsap.timeline({ repeat: -1, delay: 2.4 })
      g.forEach(function (el, i) {
        var sig = g[(i + 1) % g.length]
        tl.to(el, { yPercent: -100, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, '+=2.1')
          .fromTo(sig, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', immediateRender: false }, '-=0.25')
      })
    }

    // Aparición escalonada de tarjetas y bloques.
    function aparecer(sel, extra) {
      var els = q(sel); if (!els.length) return
      gsap.set(els, Object.assign({ y: 40, autoAlpha: 0 }, extra && extra.desde))
      ST.batch(els, { start: 'top 88%', once: true, onEnter: function (b) {
        gsap.to(b, Object.assign({ y: 0, x: 0, rotation: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true }, extra && extra.hasta))
      } })
    }
    aparecer('.servicios > li')
    aparecer('.guias > li', { desde: { y: 30 } })
    aparecer('.siono > div', { desde: { y: 50 } })
    aparecer('.datos > div', { desde: { y: 20 } })
    // Billetes: se reparten sobre la bandeja con un giro leve, y luego cae el sello.
    q('.billete').forEach(function (b, i) {
      gsap.set(b, { y: 70, rotation: i % 2 ? 2.5 : -2.5, autoAlpha: 0 })
      var s = b.querySelector('.sello'); if (s) gsap.set(s, { scale: 1.8, autoAlpha: 0 })
      ST.create({ trigger: b, start: 'top 86%', once: true, onEnter: function () {
        gsap.to(b, { y: 0, rotation: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' })
        if (s) gsap.to(s, { scale: 1, autoAlpha: 1, rotation: -12, duration: 0.55, ease: 'back.out(2.2)', delay: 0.55 })
      } })
    })

    // Pasos: la línea se dibuja con el scroll y cada número se enciende al pasar.
    var linea = document.querySelector('.p-linea span')
    if (linea) {
      gsap.fromTo(linea, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.pasos', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
      q('.pasos > li').forEach(function (li) {
        ST.create({ trigger: li, start: 'top 68%', onToggle: function (st) { li.classList.toggle('activo', st.isActive || st.progress === 1) }, end: 'max' })
      })
    }
    // Corea: el rótulo de fondo se desliza despacio.
    var k = document.querySelector('.corea .kanji')
    if (k) gsap.fromTo(k, { xPercent: 8 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '.corea', start: 'top bottom', end: 'bottom top', scrub: true } })

    window.addEventListener('load', function () { ST.refresh() })
  }
})()
`
// Script en línea en <head>: decide si hay animación antes de pintar, y si el CDN
// no llega en 4 s devuelve el titular a su sitio.
const HEAD_JS = `<script>(function(){var h=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.classList.add('js-anim');setTimeout(function(){if(!window.__famAnim)h.classList.remove('js-anim')},4000)})()</script>`

// ---------------------------------------------------------------- piezas comunes
const NEGOCIO = { '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/` }
const PERSONA_LD = {
  '@type': 'Person', '@id': `${BASE}${SECCION}#antonio`, name: NOMBRE,
  jobTitle: COORDINADOR.rol ?? 'Coordinador y guía en Japón', knowsLanguage: { '@type': 'Language', name: 'Español', alternateName: 'es' },
  worksFor: NEGOCIO, url: url(''),
}
const SERVICIO_LD = {
  '@type': 'Service', '@id': `${BASE}${SECCION}#servicio`,
  name: 'Viajes a medida a Japón para familias y grupos',
  serviceType: 'Coordinación de viajes y guía en español para familias, grupos y agencias',
  provider: NEGOCIO, broker: { '@id': PERSONA_LD['@id'] }, availableLanguage: ['es'],
  areaServed: { '@type': 'Country', name: 'Japón' },
  audience: [
    { '@type': 'PeopleAudience', audienceType: 'Familias y grupos de 6 a 10 personas de España, México y Centroamérica' },
    { '@type': 'BusinessAudience', audienceType: 'Agencias de viaje' },
  ],
  url: url(''),
}
const faqLd = (faq) => (faq?.length ? [{ '@type': 'FAQPage', inLanguage: 'es', mainEntity: faq.map(({ p, r }) => ({ '@type': 'Question', name: sinEtiquetas(p), acceptedAnswer: { '@type': 'Answer', text: sinEtiquetas(r) } })) }] : [])
const migaLd = (pasos) => ({ '@type': 'BreadcrumbList', itemListElement: pasos.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) })
const MIGA_BASE = [['Tony Kansai Guide', `${BASE}/es/`], ['Familias y grupos', url('')]]
const migaHtml = (pasos) => `<nav class="miga entra" aria-label="Ruta"><ol>${pasos.map(([n, h], i) => (i === pasos.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${h.replace(BASE, '')}">${esc(n)}</a></li>`)).join('')}</ol></nav>`
const faqHtml = (faq) => `<div class="faq">${faq.map(({ p, r }) => `<details><summary>${rico(p)}</summary><p>${rico(r)}</p></details>`).join('\n')}</div>`
const tarjeta = (d) => {
  const f = foto(d.foto)
  return `<li><a href="${d.href}"><figure>${img(d.foto, d.h1, { sizes: '(max-width:640px) 100vw, (max-width:1100px) 50vw, 380px' })}</figure><div class="ki"><h3>${esc(d.h1)}</h3><p>${rico(d.desc)}</p></div></a>${f ? `<small>${credito(f)}</small>` : ''}</li>`
}

function pagina({ slug, titulo, desc, image, jsonld, corps }) {
  const u = url(slug)
  return `<!doctype html>
<html lang="es" data-estatica="familias">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${u}">
<link rel="alternate" hreflang="es" href="${u}">
<meta name="theme-color" content="#15211c">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="es_ES">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${image}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
${HEAD_JS}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400&display=swap">
<style>${CSS}</style>
</head>
<body>
<header class="cab"><div class="kap">
<a class="marca" href="${SECCION}"><span class="mono" aria-hidden="true">${esc(NOMBRE[0])}</span><span>${esc(NOMBRE)}<small>Japón para familias y grupos</small></span></a>
<nav aria-label="Secciones"><a href="${SECCION}#servicios">Servicios</a><a href="${SECCION}#como">Cómo funciona</a><a class="siempre" href="${ruta(SLUG_COND)}">Qué incluye</a><a href="/es/">Tony Kansai Guide</a></nav>
</div></header>
<main>
${corps}
</main>
<footer><div class="kap">
<p>${esc(NOMBRE)} es coordinador y guía en Japón y socio de <a href="/es/">Tony Kansai Guide</a>. Organiza viajes a medida por todo Japón para familias y grupos de España, México y Centroamérica, y trabaja como receptivo para agencias. Corea del Sur, próximamente.</p>
<p>WhatsApp: <a href="${WA_GENERAL}">${WA_VISIBLE}</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
<div class="pie-enl"><a href="${SECCION}">Familias y grupos</a><a href="${ruta(SLUG_COND)}">Qué incluye y qué no</a>${PAGINAS.map((p) => `<a href="${ruta(p.slug)}">${esc(p.h1)}</a>`).join('')}</div>
<p><a href="/es/">Volver a la web de Tony Kansai Guide</a> · Otros idiomas: <a href="/en/" hreflang="en">English</a> · <a href="/ar/" hreflang="ar">العربية</a> · <a href="/fr/" hreflang="fr">Français</a> · <a href="/tr/" hreflang="tr">Türkçe</a> · <a href="/ru/" hreflang="ru">Русский</a></p>
<p>Última actualización: <time datetime="${HOY}">${HOY}</time></p>
</div></footer>
<a class="wa-fijo" href="${WA_GENERAL}">${ICO_WA}<span>Escribir a ${esc(NOMBRE)}</span></a>
<script src="${SECCION}familias.js" defer></script>
</body>
</html>
`
}

function hero({ k, alt, corps, sub = false }) {
  const f = foto(k)
  return `<section class="hero${sub ? ' sub' : ''}">
<div class="fondo">${img(k, alt, { hero: true })}</div>
<div class="kap">${corps}</div>
${f ? `<small class="credito">${credito(f)}</small>` : ''}
</section>`
}

// Bloque «Sí gestiona / No gestiona», compartido por la portada y condiciones.
function sionoHtml({ completo }) {
  const si = CONDICIONES.incluye ?? []
  const no = CONDICIONES.noIncluye ?? []
  return `<div class="siono">
<div class="si"><h3>Sí gestiona</h3><ul>${si.map((x) => `<li><span class="ok">${ICO_SI}</span><div><strong>${rico(x.titulo)}</strong>${x.texto ? `<p>${rico(x.texto)}</p>` : ''}</div></li>`).join('')}</ul></div>
<div class="no"><h3>No gestiona</h3><ul>${no.map((x) => `<li><span class="ok">${ICO_NO}</span><div><strong>${rico(x.titulo)}</strong>${x.texto ? `<p>${rico(x.texto)}</p>` : ''}${completo && x.consejo ? `<span class="consejo">${rico(x.consejo)}</span>` : ''}</div></li>`).join('')}</ul></div>
</div>`
}

// ---------------------------------------------------------------- portada
const generadas = []
{
  const P = PORTADA
  const ganchos = P.gancho ?? []
  const servicios = P.servicios ?? []
  const problemas = P.problemas ?? []
  const pasos = P.pasos ?? []
  const corps = `
${hero({ k: 'hero', alt: 'Japón en familia', corps: `<p class="ceja entra">Japón a medida · 6 a 10 personas</p>
<h1>${partir(P.h1)}</h1>
<p class="lead entra">${rico(P.entradilla)}</p>
${ganchos.length ? `<p class="gancho entra"><span class="g-rot">${ganchos.map((g) => `<span>${esc(g)}</span>`).join(' ')}</span></p>` : ''}
<div class="acciones entra"><a class="btn claro" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a><a class="btn fantasma" href="#como">Cómo funciona</a></div>` })}
<div class="kap"><div class="datos">
<div><strong>Todo Japón</strong><span>Corea del Sur, próximamente</span></div>
<div><strong>6 a 10 personas</strong><span>Familias y grupos, también agencias</span></div>
<div><strong>En español</strong><span>Para España, México y Centroamérica</span></div>
</div></div>

<section class="seccion" id="servicios" aria-labelledby="t-servicios"><div class="kap">
<h2 id="t-servicios">Qué hace ${esc(NOMBRE)} por su viaje</h2>
<p class="lead">Coordinación y guía en Japón para que el grupo solo tenga que disfrutar.</p>
<ul class="servicios">${servicios.map((s) => `<li><span class="ico-c">${icono(s.icono)}</span><h3>${rico(s.titulo)}</h3><p>${rico(s.texto)}</p></li>`).join('')}</ul>
</div></section>

${problemas.length ? `<section class="seccion alt" id="problemas" aria-labelledby="t-problemas"><div class="kap">
<h2 id="t-problemas">Problemas que resolvemos</h2>
<p class="lead">Lo que suele complicar un viaje en grupo por Japón, y cómo se evita.</p>
<ul class="billetes">${problemas.map((x, i) => {
    const d = x.enlace ? destino(x.enlace, 'PORTADA.problemas') : null
    return `<li class="billete"><div><span class="b-num">Nº ${String(i + 1).padStart(2, '0')}</span><h3>${rico(x.titulo)}</h3><span class="etq">El problema</span><p>${rico(x.problema)}</p></div><div class="talon"><span class="etq">La solución</span><p>${rico(x.solucion)}</p>${d ? `<a class="enl" href="${d.href}">Leer la guía ${FLECHA}</a>` : ''}<span class="sello" aria-hidden="true">Resuelto</span></div></li>`
  }).join('\n')}</ul>
</div></section>` : ''}

<section class="seccion" id="gestiona" aria-labelledby="t-gestiona"><div class="kap">
<h2 id="t-gestiona">Lo que sí y lo que no</h2>
<p class="lead">Claro desde el principio, para que no haya sorpresas.</p>
${sionoHtml({ completo: false })}
<p style="margin-top:24px"><a class="enl" href="${ruta(SLUG_COND)}">Ver todas las condiciones ${FLECHA}</a></p>
</div></section>

${pasos.length ? `<section class="seccion alt" id="como" aria-labelledby="t-como"><div class="kap pasos-c">
<div class="fijo"><h2 id="t-como">Cómo funciona</h2><p class="lead">De la primera conversación al último día en Japón.</p><a class="btn" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a></div>
<ol class="pasos"><span class="p-linea" aria-hidden="true"><span></span></span>${pasos.map((p) => `<li><h3>${rico(p.titulo)}</h3><p>${rico(p.texto)}</p></li>`).join('')}</ol>
</div></section>` : ''}

<section class="corea" aria-labelledby="t-corea"><span class="kanji" aria-hidden="true" lang="ko">대한민국</span><div class="kap">
<span class="pildora">Próximamente</span>
<h2 id="t-corea">Corea del Sur</h2>
<p>${rico(P.coreaProximamente ?? '')}</p>
</div></section>

<section class="seccion" id="guias" aria-labelledby="t-guias"><div class="kap">
<h2 id="t-guias">Guías para preparar el viaje</h2>
<p class="lead">Destinos, logística y consejos pensados para familias y grupos.</p>
<ul class="guias">${PAGINAS.map((p) => tarjeta({ href: ruta(p.slug), h1: p.h1, desc: p.descripcion || p.entradilla, foto: p.foto })).join('\n')}</ul>
</div></section>

<section class="seccion alt" id="antonio" aria-labelledby="t-antonio"><div class="kap"><div class="persona">
<span class="mono" aria-hidden="true">${esc(NOMBRE[0])}</span>
<div><h2 id="t-antonio">Quién es ${esc(NOMBRE)}</h2>
${[].concat(COORDINADOR.bio ?? COORDINADOR.texto ?? [`${NOMBRE} es ${(COORDINADOR.rol ?? 'coordinador y guía en Japón').toLowerCase()} y socio de Tony Kansai Guide. Organiza viajes a medida por todo Japón para familias y grupos de España, México y Centroamérica, y trabaja como receptivo para agencias de viaje.`]).map((t) => `<p>${rico(t)}</p>`).join('\n')}
<p><a class="enl" href="/es/">Conocer Tony Kansai Guide ${FLECHA}</a></p></div>
</div></div></section>

${FAQ_GLOBAL.length ? `<section class="seccion" id="preguntas" aria-labelledby="t-faq"><div class="kap">
<h2 id="t-faq">Preguntas frecuentes</h2>
${faqHtml(FAQ_GLOBAL)}
</div></section>` : ''}

<section class="seccion alt cierre"><div class="kap">
<h2>¿Cuántos son y cuándo quieren venir?</h2>
<p class="lead">Cuéntaselo a ${esc(NOMBRE)} por WhatsApp y te prepara una propuesta a medida.</p>
<a class="btn" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a>
</div></section>`
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    SERVICIO_LD, PERSONA_LD, ...faqLd(FAQ_GLOBAL),
    migaLd(MIGA_BASE),
    { '@type': 'WebPage', '@id': `${url('')}#pagina`, url: url(''), inLanguage: 'es', name: P.titulo, description: P.descripcion, dateModified: HOY, about: { '@id': SERVICIO_LD['@id'] }, isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#web`, url: `${BASE}/` }, primaryImageOfPage: imagenOg('hero') },
  ] }
  escribir('', pagina({ slug: '', titulo: P.titulo, desc: P.descripcion, image: imagenOg('hero'), jsonld, corps }))
}

// ---------------------------------------------------------------- condiciones
{
  const C = CONDICIONES
  const miga = [...MIGA_BASE, [C.h1, url(SLUG_COND)]]
  const corps = `
${hero({ k: 'familia', alt: C.h1, sub: true, corps: `${migaHtml(miga)}
<h1>${partir(C.h1)}</h1>
<p class="lead entra">${rico(C.entradilla)}</p>` })}
<section class="seccion" style="padding-top:clamp(48px,7vw,88px)"><div class="kap">
${sionoHtml({ completo: true })}
${C.avisos?.length ? `<h2 style="margin-top:64px">A tener en cuenta</h2><div class="aviso"><ul>${C.avisos.map((a) => `<li>${rico(a)}</li>`).join('')}</ul></div>` : ''}
${C.vigencia ? `<p class="vigencia">${rico(C.vigencia)}</p>` : ''}
${FUENTES.length ? `<h2 style="margin-top:64px" id="fuentes">Fuentes oficiales</h2>
<p class="lead">Los datos prácticos de estas páginas se comprueban en estas webs oficiales.</p>
<ul class="fuentes">${FUENTES.map((f) => { let dom = ''; try { dom = new URL(f.url).hostname.replace(/^www\./, '') } catch { console.warn(`⚠ familias: URL de fuente rara: ${f.url}`) } return `<li><a href="${esc(f.url)}" rel="nofollow noopener">${rico(f.dato)}</a><time datetime="${esc(f.comprobado)}">Comprobado ${esc(f.comprobado)}</time><span class="dom">${esc(dom)}</span></li>` }).join('')}</ul>` : ''}
<p style="margin-top:40px"><a class="btn" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a></p>
<p><a class="enl" href="${SECCION}">Volver a Familias y grupos ${FLECHA}</a></p>
</div></section>`
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    migaLd(miga),
    { '@type': 'WebPage', url: url(SLUG_COND), inLanguage: 'es', name: C.titulo, description: C.descripcion, dateModified: HOY, about: { '@id': SERVICIO_LD['@id'] }, ...(FUENTES.length ? { citation: FUENTES.map((f) => ({ '@type': 'CreativeWork', name: sinEtiquetas(f.dato), url: f.url })) } : {}) },
    { ...SERVICIO_LD, '@id': SERVICIO_LD['@id'] },
  ] }
  escribir(SLUG_COND, pagina({ slug: SLUG_COND, titulo: C.titulo, desc: C.descripcion, image: imagenOg('familia'), jsonld, corps }))
}

// ---------------------------------------------------------------- páginas
for (const p of PAGINAS) {
  if (!p.slug) throw new Error('familias: una página de PAGINAS no tiene slug')
  const miga = [...MIGA_BASE, [p.h1, url(p.slug)]]
  const secciones = (p.secciones ?? []).map((s, i) => ({ ...s, id: `s${i + 1}` }))
  const enlace = wa(`Hola Antonio, he leído «${sinEtiquetas(p.h1)}». Somos una familia/grupo de __ personas y queremos viajar a Japón. Fechas: `)
  const rel = (p.relacionadas ?? []).map((s) => destino(s, p.slug)).filter(Boolean)
  const corps = `
${hero({ k: p.foto, alt: p.h1, sub: true, corps: `${migaHtml(miga)}
<h1>${partir(p.h1)}</h1>` })}
<div class="kap articulo">
<article class="cuerpo">
<p class="entr">${rico(p.entradilla)}</p>
${secciones.map((s) => `<h2 id="${s.id}">${rico(s.h2)}</h2>
${(s.parrafos ?? []).map((t) => `<p>${rico(t)}</p>`).join('\n')}
${s.lista?.length ? `<ul class="lista">${s.lista.map((x) => `<li>${rico(x)}</li>`).join('')}</ul>` : ''}`).join('\n')}
${p.faq?.length ? `<h2 id="preguntas">Preguntas frecuentes</h2>${faqHtml(p.faq)}` : ''}
</article>
<aside class="lateral">
<div class="caja"><h3>${esc(NOMBRE)} se lo organiza</h3><p>Viaje a medida para familias y grupos de 6 a 10 personas, con presupuesto por WhatsApp.</p><a class="btn" href="${enlace}">${ICO_WA}Pedir presupuesto</a><p style="margin:14px 0 0"><a href="${ruta(SLUG_COND)}">Qué incluye y qué no</a></p></div>
${secciones.length > 1 ? `<nav class="caja indice" aria-label="En esta página"><h3>En esta página</h3><ol>${secciones.map((s) => `<li><a href="#${s.id}">${esc(sinEtiquetas(s.h2))}</a></li>`).join('')}</ol></nav>` : ''}
</aside>
</div>
${rel.length ? `<section class="seccion alt" aria-labelledby="t-rel"><div class="kap">
<h2 id="t-rel">Sigue leyendo</h2>
<ul class="guias">${rel.map(tarjeta).join('\n')}</ul>
<p style="margin-top:32px"><a class="enl" href="${SECCION}">Volver a Familias y grupos ${FLECHA}</a></p>
</div></section>` : ''}`
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    migaLd(miga), ...faqLd(p.faq),
    { '@type': 'WebPage', url: url(p.slug), inLanguage: 'es', name: p.titulo, description: p.descripcion, dateModified: HOY, about: { '@id': SERVICIO_LD['@id'] }, primaryImageOfPage: imagenOg(p.foto), author: { '@id': PERSONA_LD['@id'] }, publisher: NEGOCIO },
    PERSONA_LD,
  ] }
  escribir(p.slug, pagina({ slug: p.slug, titulo: p.titulo, desc: p.descripcion, image: imagenOg(p.foto), jsonld, corps }))
}

// ---------------------------------------------------------------- salida y comprobación
function escribir(slug, html) {
  const dir = join(root, 'public/familias', slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  generadas.push([slug, html])
}
writeFileSync(join(root, 'public/familias/familias.js'), JS)

// Cada página: un title, un h1, canonical, JSON-LD que parsea y nada de rayas largas.
const fallos = []
for (const [slug, html] of generadas) {
  const quien = ruta(slug)
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fallos.push(`${quien}: no tiene exactamente un h1`)
  if (!/<title>[^<]+<\/title>/.test(html)) fallos.push(`${quien}: sin title`)
  if (!html.includes(`<link rel="canonical" href="${url(slug)}">`)) fallos.push(`${quien}: canonical mal`)
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]) } catch (e) { fallos.push(`${quien}: JSON-LD no parsea (${e.message})`) } }
  if (/[\u0590-\u05FF]/.test(html)) fallos.push(`${quien}: contiene hebreo`)
}
if (fallos.length) { console.error(fallos.join('\n')); process.exit(1) }
console.log(`familias: ${generadas.length} páginas en public/familias/ (1 portada + 1 condiciones + ${PAGINAS.length} guías)`)

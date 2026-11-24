// Expedientes «Terror real» y «Lugares misteriosos» de las páginas de leyendas, y fotos de Tony.
// Lo usa scripts/leyendas.mjs: genera las 6 subpáginas (es/en/ar) y las piezas que van en la página
// principal (resúmenes, galería, fotos de Tony en cada entrada y JSON-LD).
// Las fotos de Tony salen de scripts/leyendas-fotos.json (copia del manifiesto de ~/projects/leyendas-fotos/
// con w/h añadidos) y de public/leyendas/fotos/<archivo>-800.webp y -1600.webp.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { cabeceraEsHTML, cabeceraEsCSS } from './cabecera-es.mjs'
import { pieEsHTML, pieEsCSS } from './pie-es.mjs'
import { cabeceraEnHTML, cabeceraEnCSS } from './cabecera-en.mjs'
import { pieEnHTML, pieEnCSS } from './pie-en.mjs'
import { join } from 'node:path'
import { TERROR } from './leyendas-terror.mjs'
import TERROR_AR from './leyendas-terror-ar.mjs'
import { MISTERIO } from './leyendas-misterio.mjs'
import MISTERIO_AR from './leyendas-misterio-ar.mjs'
import { TEXTOS, RUTAS } from './leyendas-sub-textos.mjs'

const BASE = 'https://tonykansaiguide.com'
const TONY = `${BASE}/#tony`
const NEGOCIO = `${BASE}/#negocio`
export const PRINCIPAL = { es: '/es/leyendas/', en: '/en/legends/', ar: '/ar/asatir/' }
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Une el árabe (archivo aparte) a cada entrada y falla si falta alguna traducción. */
function conArabe(lista, ar, nombre) {
  const sobran = Object.keys(ar).filter((id) => !lista.some((x) => x.id === id))
  if (sobran.length) throw new Error(`${nombre}: ids en árabe sin entrada: ${sobran.join(', ')}`)
  return lista.map((x) => {
    if (!ar[x.id]) throw new Error(`${nombre}: falta el árabe de «${x.id}»`)
    for (const l of ['es', 'en']) for (const k of ['t', 'l', 'e', 'a', 'b', 'c']) if (!x[l]?.[k]) throw new Error(`${nombre}: «${x.id}» sin ${l}.${k}`)
    return { ...x, ar: ar[x.id] }
  })
}
export const EXPEDIENTES = {
  terror: conArabe(TERROR, TERROR_AR, 'terror'),
  misterio: conArabe(MISTERIO, MISTERIO_AR, 'misterio'),
}
export const urlSub = (tipo, lang) => `${BASE}/${RUTAS[tipo][lang]}/`

// ── Fotos de Tony ───────────────────────────────────────────────────────────
export function cargarFotosTony(raiz) {
  const archivo = join(raiz, 'scripts/leyendas-fotos.json')
  if (!existsSync(archivo)) { console.warn('leyendas: sin scripts/leyendas-fotos.json, las fotos de Tony quedan vacías'); return [] }
  const lista = JSON.parse(readFileSync(archivo, 'utf8'))
  for (const f of lista) {
    for (const k of ['archivo', 'lugar_clave', 'alt_es', 'alt_en', 'alt_ar', 'pie_es', 'pie_en', 'pie_ar', 'w', 'h']) if (f[k] === undefined) throw new Error(`leyendas-fotos.json: ${f.archivo} sin ${k}`)
    const base = f.archivo.replace(/\.jpe?g$/i, '')
    for (const lado of [800, 1600]) if (!existsSync(join(raiz, `public/leyendas/fotos/${base}-${lado}.webp`))) throw new Error(`Falta public/leyendas/fotos/${base}-${lado}.webp`)
  }
  return lista
}

/** Busca la foto pedida ({clave, archivo}); si no se da archivo, la primera de esa clave. */
export function buscarFoto(fotos, pedida) {
  const f = pedida.archivo ? fotos.find((x) => x.archivo === pedida.archivo) : fotos.find((x) => x.lugar_clave === pedida.clave)
  if (pedida.archivo && fotos.length && !f) throw new Error(`Foto de Tony desconocida: ${pedida.archivo}`)
  if (f && f.lugar_clave !== pedida.clave) throw new Error(`${pedida.archivo} es de «${f.lugar_clave}», no de «${pedida.clave}»`)
  return f
}

const rutaFoto = (f, lado) => `/leyendas/fotos/${f.archivo.replace(/\.jpe?g$/i, '')}-${lado}.webp`
function anchoReal(f, lado) {
  const escala = Math.min(1, lado / Math.max(f.w, f.h))
  return Math.round(f.w * escala)
}
export function imgTony(f, lang, sizes = '(min-width:820px) 33vw, 100vw') {
  const srcset = [800, 1600].map((l) => `${rutaFoto(f, l)} ${anchoReal(f, l)}w`).join(', ')
  return `<img src="${rutaFoto(f, 800)}" srcset="${srcset}" sizes="${sizes}" width="${f.w}" height="${f.h}" alt="${esc(f['alt_' + lang])}" loading="lazy" decoding="async">`
}
/** Figura pequeña con pie y crédito, para una entrada (leyenda, relato, caso o lugar). */
export function figuraTony(f, lang, clase = 'tony-mini') {
  if (!f) return ''
  return `<figure class="${clase}">${imgTony(f, lang)}<figcaption>${esc(f['pie_' + lang])} · ${esc(TEXTOS[lang].creditoTony)}</figcaption></figure>`
}
export const imagenLD = (f, lang) => ({
  '@type': 'ImageObject', contentUrl: BASE + rutaFoto(f, 1600), width: anchoReal(f, 1600), height: Math.round(f.h * anchoReal(f, 1600) / f.w),
  caption: f['pie_' + lang], description: f['alt_' + lang], creator: { '@id': TONY }, creditText: 'Tony Hanma', copyrightNotice: '© Tony Hanma',
})

// Dónde lleva cada foto de la galería (ancla de la página principal o de una subpágina).
const DESTINO_GALERIA = {
  ikoma: ['misterio', 'hozanji'], minoo: ['misterio', 'minoo'], kunozan: ['misterio', 'kunozan'], nihondaira: ['misterio', 'kunozan'],
  miyajima: ['misterio', 'misen'], himeji: [null, 'leyenda-2'], dotonbori: [null, 'leyenda-9'], nara: [null, 'leyenda-7'], 'castillo-osaka': [null, 'relato-10'],
}

/** Galería «Tony en los lugares de leyenda» de la página principal: primero las fotos en las que sale él. */
export function galeriaTony(fotos, lang) {
  if (!fotos.length) return ''
  const t = TEXTOS[lang]
  const conTony = fotos.filter((f) => f.aparece_tony), resto = fotos.filter((f) => !f.aparece_tony)
  const item = (f) => {
    const d = DESTINO_GALERIA[f.lugar_clave]
    const enlace = d ? ` <a href="${d[0] ? `/${RUTAS[d[0]][lang]}/` : ''}#${d[1]}">${esc(t.verHistoria)}</a>` : ''
    return `      <li><figure>${imgTony(f, lang, f.aparece_tony ? '(min-width:820px) 25vw, 50vw' : '(min-width:820px) 17vw, 33vw')}<figcaption>${esc(f['pie_' + lang])}${enlace}</figcaption></figure></li>`
  }
  return `<section class="galeria" id="fotos-tony">
  <div class="kap">
    <p class="etq">${esc(t.galeria.etq)}</p>
    <h2>${esc(t.galeria.h2)}</h2>
    <p class="aviso">${esc(t.galeria.texto)}</p>
    <ul class="gal-tony con-tony">
${conTony.map(item).join('\n')}
    </ul>
    <ul class="gal-tony resto">
${resto.map(item).join('\n')}
    </ul>
  </div>
</section>`
}

// ── Fuentes ─────────────────────────────────────────────────────────────────
function fuente(f) {
  const [url, nombre] = Array.isArray(f) ? f : [f]
  if (nombre) return { url, nombre }
  const w = url.match(/^https:\/\/(\w+)\.wikipedia\.org\/wiki\/(.+)$/)
  if (w) return { url, nombre: `Wikipedia (${w[1]}): ${decodeURIComponent(w[2]).replace(/_/g, ' ')}` }
  return { url, nombre: new URL(url).hostname.replace(/^www\./, '') }
}
const enlaceFuente = ({ url, nombre }) => `<a href="${esc(encodeURI(url))}" rel="noopener">${esc(nombre)}</a>`

// ── Resúmenes en la página principal ────────────────────────────────────────
export function resumenesPrincipal(lang) {
  return ['terror', 'misterio'].map((tipo) => {
    const t = TEXTOS[lang][tipo]
    const href = `/${RUTAS[tipo][lang]}/`
    const items = EXPEDIENTES[tipo].map((x) => `      <li class="ent"><a href="${href}#${x.id}"><span class="kanji" aria-hidden="true">${x.k}</span><span class="r-t">${esc(x[lang].t)}</span><span class="r-l">${esc(x[lang].l)} · ${esc(x[lang].e)}</span></a></li>`).join('\n')
    return `<section class="exp-nuevo${tipo === 'terror' ? ' exp-terror' : ''}" id="${tipo === 'terror' ? 'terror-real' : 'lugares-misteriosos'}">
  <div class="kap">
    <p class="etq">${esc(t.etq)}</p>
    <h2>${esc(t.h1)}</h2>
    <p class="aviso">${esc(t.resumen)}</p>
    <ol class="resumen-casos">
${items}
    </ol>
    <div class="acciones"><a class="btn uno" href="${href}">${esc(t.abrir)} (${EXPEDIENTES[tipo].length})</a></div>
  </div>
</section>`
  }).join('\n\n')
}

/** Nodos JSON-LD que la página principal añade para enlazar sus dos expedientes. */
export const partesLD = (lang) => ['terror', 'misterio'].map((tipo) => ({ '@type': 'Article', '@id': urlSub(tipo, lang) + '#articulo', url: urlSub(tipo, lang), headline: TEXTOS[lang][tipo].h1 }))

// ── Estilos comunes (se añaden a la página principal y a las subpáginas) ─────
export const CSS_EXPEDIENTES = `
/* Expedientes «Terror real» y «Lugares misteriosos», fotos de Tony (leyendas-expedientes.mjs) */
.aviso{color:var(--papel-2);max-width:62ch;margin-top:18px}
.migas{font-size:14px;color:var(--gris);margin-bottom:26px}
.migas a{color:var(--papel-2)}
.indice{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 24px;margin:36px 0 0;padding:0;list-style:none;counter-reset:ind;font-size:15px}
.indice li{counter-increment:ind;border-top:1px solid var(--linea);padding-top:8px}
.indice li::before{content:counter(ind,decimal-leading-zero) " ";color:var(--bermellon);font-variant-numeric:tabular-nums}
.indice a{text-decoration:none;color:var(--papel-2)}
.indice a:hover{color:var(--papel)}
.lista-casos{display:grid;gap:22px;margin-top:48px}
.caso{border:1px solid var(--linea);border-radius:var(--r);padding:clamp(22px,3.4vw,36px);background:linear-gradient(160deg,#16141a,#0d0c0b);scroll-margin-top:90px}
.caso-cab{display:flex;gap:20px;align-items:flex-start}
.caso .kanji{font-family:var(--jp);font-size:48px;color:var(--bermellon);line-height:1;opacity:.9}
.caso .estado{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gris)}
.caso h3{font-size:clamp(24px,3vw,34px);margin:6px 0 4px}
.caso .donde{font-size:14px;color:var(--bermellon);font-weight:600}
.bloques{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:26px;margin-top:24px;border-top:1px solid var(--linea);padding-top:22px}
.bloque h4{font-family:var(--sans);font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--bermellon);margin-bottom:8px}
.bloque p{color:var(--papel-2);font-size:16px}
.bloque.visita p{color:var(--papel)}
.bloque .fuente{font-size:13px;color:var(--gris);margin-top:10px}
.bloque .fuente a{color:var(--gris)}
.fotos-caso{display:flex;gap:14px;margin-top:22px;flex-wrap:wrap}
.fotos-caso .tony-mini{flex:1 1 200px;max-width:320px;margin:0}
.tony-mini{margin-top:20px;max-width:320px;border-radius:var(--r);overflow:hidden}
.tony-mini img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r);transform:none!important}
.tony-mini figcaption{font-size:12px;color:var(--gris);padding-top:6px}
.rel .tony-mini figcaption{color:#7a7164}
.lista-fuentes{margin-top:32px;padding:0;list-style:none;columns:2;column-gap:40px;font-size:15px}
.lista-fuentes li{break-inside:avoid;padding:6px 0;border-top:1px solid var(--linea);color:var(--papel-2)}
.lista-fuentes a{color:var(--papel-2)}
.fuentes-bloque{background:#0a0a0c;border-top:1px solid var(--linea)}
.exp-nuevo{border-top:1px solid var(--linea)}
.exp-terror{background:#0a0a0c}
.resumen-casos{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:40px 0 0;padding:0;list-style:none}
.resumen-casos a{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;text-decoration:none;border:1px solid var(--linea);border-radius:var(--r);padding:16px 18px;height:100%;background:var(--tinta-2)}
.resumen-casos a:hover{border-color:var(--bermellon)}
.resumen-casos .kanji{grid-row:span 2;font-family:var(--jp);font-size:30px;color:var(--bermellon);line-height:1.1}
.resumen-casos .r-t{font-family:var(--serif);font-size:18px;line-height:1.25}
.resumen-casos .r-l{font-size:13px;color:var(--gris)}
.exp-nuevo .acciones{margin-top:36px}
.galeria{border-top:1px solid var(--linea)}
.gal-tony{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:40px 0 0;padding:0;list-style:none}
.gal-tony.resto{grid-template-columns:repeat(6,1fr);gap:10px;margin-top:28px}
.gal-tony figure{margin:0}
.gal-tony img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--r)}
.gal-tony.resto img{aspect-ratio:4/3;border-radius:10px}
.gal-tony.resto figcaption{font-size:12px}
.gal-tony figcaption{font-size:13px;color:var(--gris);padding-top:6px}
.gal-tony figcaption a{color:var(--papel-2);white-space:nowrap}
@media (max-width:820px){
  .bloques,.resumen-casos{grid-template-columns:1fr}
  .indice{grid-template-columns:1fr 1fr}
  .lista-fuentes{columns:1}
  .gal-tony{grid-template-columns:1fr 1fr}
  .gal-tony.resto{grid-template-columns:repeat(3,1fr)}
}
[dir=rtl] .bloque h4,[dir=rtl] .caso .estado{letter-spacing:0}
[dir=rtl] .caso h3,[dir=rtl] .resumen-casos .r-t{line-height:1.45}
/* Móvil 24-11 (solo ES): una palabra larga del título ensanchaba la ficha 36 px fuera de la pantalla */
html[lang=es] .lista-casos{grid-template-columns:minmax(0,1fr)}
html[lang=es] .caso-cab>div{min-width:0}
html[lang=es] .caso h3,html[lang=es] .caso .donde,html[lang=es] .caso .fuente{overflow-wrap:anywhere}
html[lang=es] .barra{gap:10px}
html[lang=es] .barra a{min-width:0}
html[lang=es] details.ent>summary{min-height:44px}
@media (max-width:400px){html[lang=es] .barra{padding:8px 8px 8px 16px}html[lang=es] .barra a{font-size:14px;line-height:1.25}html[lang=es] .caso{padding:20px 16px}html[lang=es] .caso-cab{gap:14px}html[lang=es] .caso .kanji{font-size:40px}}
`

// ── Subpáginas ──────────────────────────────────────────────────────────────
function entrada(x, lang, t, bloques, fotos) {
  const d = x[lang]
  const fs = (x.fotos || []).map((p) => buscarFoto(fotos, p)).filter(Boolean)
  const fuentes = x.fuentes.map(fuente).map(enlaceFuente).join(' · ')
  return `    <article class="caso ent" id="${x.id}">
      <header class="caso-cab">
        <span class="kanji" aria-hidden="true">${x.k}</span>
        <div><p class="estado">${esc(d.e)}</p><h3>${esc(d.t)}</h3><p class="donde">${esc(d.l)}</p></div>
      </header>${fs.length ? `\n      <div class="fotos-caso">${fs.map((f) => figuraTony(f, lang)).join('')}</div>` : ''}
      <div class="bloques">
        <div class="bloque"><h4>${esc(bloques[0])}</h4><p>${esc(d.a)}</p><p class="fuente">${esc(t.fuente)}: ${fuentes}</p></div>
        <div class="bloque"><h4>${esc(bloques[1])}</h4><p>${esc(d.b)}</p></div>
        <div class="bloque visita"><h4>${esc(bloques[2])}</h4><p>${esc(d.c)}</p></div>
      </div>
    </article>`
}

/**
 * Genera una subpágina. `p` trae lo que la página principal de ese idioma ya tiene:
 * css y enlace de Google Fonts (para que se vea igual), la función foto() de Commons y el idioma.
 */
export function generarSub({ tipo, lang, raiz, css, fuentesWeb, foto, fotosCommons, fotos }) {
  const t = TEXTOS[lang], s = t[tipo]
  const lista = EXPEDIENTES[tipo]
  const url = urlSub(tipo, lang)
  const otro = tipo === 'terror' ? 'misterio' : 'terror'
  const principal = BASE + PRINCIPAL[lang]
  const [clavePortada, altPortada] = s.portada
  const fc = fotosCommons[clavePortada]
  const fuentesUnicas = [...new Map(lista.flatMap((x) => x.fuentes.map(fuente)).map((f) => [f.url, f])).values()]
  const fotosUsadas = lista.flatMap((x) => (x.fotos || []).map((p) => buscarFoto(fotos, p))).filter(Boolean)
  const alternas = ['es', 'en', 'ar'].map((l) => `<link rel="alternate" hreflang="${l}" href="${urlSub(tipo, l)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${urlSub(tipo, 'en')}">`
  const portadaGrande = fc.anchos.includes(1920) ? 1920 : fc.anchos[0]
  const preload = `<link rel="preload" as="image" href="/tr/foto/${clavePortada}-${portadaGrande}.webp" imagesrcset="${fc.anchos.map((w) => `/tr/foto/${clavePortada}-${w}.webp ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`

  const itemLD = (x, i) => {
    const d = x[lang]
    const f = (x.fotos || []).map((p) => buscarFoto(fotos, p)).find(Boolean)
    const base = { '@type': 'ListItem', position: i + 1, url: `${url}#${x.id}`, name: d.t }
    if (tipo === 'terror') return { ...base, description: d.a }
    return { '@type': 'ListItem', position: i + 1, item: { '@type': ['Place', 'TouristAttraction'], '@id': `${url}#${x.id}`, url: `${url}#${x.id}`, name: d.t, description: d.a, address: d.l, ...(f ? { image: BASE + rutaFoto(f, 1600) } : {}) } }
  }
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': url + '#articulo', mainEntityOfPage: url, url, headline: s.h1, name: s.titulo, description: s.desc, inLanguage: lang,
        datePublished: '2026-11-21', dateModified: new Date().toISOString().slice(0, 19) + 'Z',
        author: { '@id': TONY }, publisher: { '@id': NEGOCIO }, isPartOf: { '@id': principal + '#pagina' },
        image: [`${BASE}/tr/foto/${clavePortada}-${portadaGrande}.webp`, ...fotosUsadas.map((f) => imagenLD(f, lang))],
        citation: fuentesUnicas.map((f) => f.url), about: lista.map((x) => x[lang].t) },
      { '@type': 'Person', '@id': TONY, name: 'Tony Hanma', alternateName: 'ハンマ・トニー', url: principal },
      { '@type': 'ItemList', '@id': url + '#lista', name: s.h2, numberOfItems: lista.length, itemListElement: lista.map(itemLD) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.migas[0], item: BASE + t.inicio },
        { '@type': 'ListItem', position: 2, name: t.migas[1], item: principal },
        { '@type': 'ListItem', position: 3, name: s.nombre, item: url }] },
    ],
  }

  const html = `<!doctype html>
<html lang="${lang}" dir="${t.dir}" data-estatica="leyendas">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.titulo)}</title>
<meta name="description" content="${esc(s.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Tony Hanma">
<link rel="canonical" href="${url}">
${alternas}
<meta property="og:type" content="article">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="${t.ogLocale}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(s.h1)}">
<meta property="og:description" content="${esc(s.ogDesc)}">
<meta property="og:image" content="${BASE}/tr/foto/${clavePortada}-${portadaGrande}.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fuentesWeb}
${preload}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>${css}${CSS_EXPEDIENTES}${lang === 'es' ? cabeceraEsCSS + pieEsCSS : lang === 'en' ? cabeceraEnCSS + pieEnCSS : ''}</style>
</head>
<body>
<a class="salto" href="#contenido">${esc(t.salto)}</a>
${lang === 'es' ? cabeceraEsHTML({ actual: `/${RUTAS[tipo].es}/`, ramasPagina: [{ titulo: 'Leyendas', enlaces: [['Leyendas de Tony Hanma', PRINCIPAL.es], [t.terror.nombre, `/${RUTAS.terror.es}/`], [t.misterio.nombre, `/${RUTAS.misterio.es}/`]] }], idiomas: t.idiomas.map(([l, n]) => ({ lang: l, ruta: `/${RUTAS[tipo][l]}/`, texto: n })) })
  : lang === 'en' ? cabeceraEnHTML({ actual: `/${RUTAS[tipo].en}/`, ramasPagina: [{ titulo: 'Legends', enlaces: [[t.volver, PRINCIPAL.en], [t.terror.nombre, `/${RUTAS.terror.en}/`], [t.misterio.nombre, `/${RUTAS.misterio.en}/`], ['WhatsApp', t.wa]] }], idiomas: t.idiomas.map(([l, n]) => ({ lang: l, ruta: `/${RUTAS[tipo][l]}/`, texto: n })) }) : `<header class="barra">
  <a href="${PRINCIPAL[lang]}">${esc(t.volver)}</a>
  <a class="wa" href="${t.wa}">WhatsApp</a>
</header>`}

<main id="contenido">
<div class="portada" id="portada">
  ${foto(clavePortada, altPortada, { portada: true })}
  <div id="fantasma" aria-hidden="true"></div>
  <div class="kap">
    <p class="sello">${esc(s.sello)}</p>
    <h1>${esc(s.h1)}</h1>
    <p class="baj">${esc(s.bajada)}</p>
    <div class="acciones">
      <a class="btn uno" href="#casos">${esc(s.leer)} (${lista.length})</a>
      <a class="btn dos" href="/${RUTAS[otro][lang]}/">${esc(t[otro].nombre)}</a>
    </div>
  </div>
</div>

<section id="casos">
  <div class="kap">
    <nav class="migas" aria-label="breadcrumb"><a href="${t.inicio}">${esc(t.migas[0])}</a> › <a href="${PRINCIPAL[lang]}">${esc(t.migas[1])}</a> › <span>${esc(s.nombre)}</span></nav>
    <p class="etq">${esc(s.etq)}</p>
    <h2>${esc(s.h2)}</h2>
    <p class="aviso">${esc(s.aviso)}</p>
    <nav aria-label="${esc(t.indice)}"><ol class="indice">
${lista.map((x) => `      <li><a href="#${x.id}">${esc(x[lang].t)}</a></li>`).join('\n')}
    </ol></nav>
    <div class="lista-casos">
${lista.map((x) => entrada(x, lang, t, s.bloques, fotos)).join('\n')}
    </div>
  </div>
</section>

<section class="fuentes-bloque" id="fuentes">
  <div class="kap">
    <p class="etq">${esc(s.etq)}</p>
    <h2>${esc(t.fuentes)}</h2>
    <p class="aviso">${esc(t.fuentesIntro)}</p>
    <ul class="lista-fuentes">
${fuentesUnicas.map((f) => `      <li>${enlaceFuente(f)}</li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="cierre" id="tour">
  <div class="kap ent">
    <p class="etq">${esc(t.cierreEtq)}</p>
    <h2>${esc(t.cierreH2)}</h2>
    <p>${esc(t.cierreP)}</p>
    <div class="acciones">
      <a class="btn uno" href="${t.wa}">${esc(t.cierreBtn)}</a>
      <a class="btn dos" href="/${RUTAS[otro][lang]}/">${esc(t.otro)}: ${esc(t[otro].nombre)}</a>
      <a class="btn dos" href="${PRINCIPAL[lang]}">${esc(t.volver)}</a>
    </div>
  </div>
</section>
</main>

${lang === 'es' ? pieEsHTML({ idiomas: t.idiomas.map(([l, n]) => ({ lang: l, ruta: `/${RUTAS[tipo][l]}/`, texto: n })), creditos: `<li>${esc(altPortada)}: <a href="${fc.kaynak}" rel="noopener">${esc(fc.autor)}</a>, ${fc.lisans}</li>`, extra: esc(t.pie) })
  : lang === 'en' ? pieEnHTML({ idiomas: t.idiomas.map(([l, n]) => ({ lang: l, ruta: `/${RUTAS[tipo][l]}/`, texto: n })), creditos: `<li>${esc(altPortada)}: <a href="${fc.kaynak}" rel="noopener">${esc(fc.autor)}</a>, ${fc.lisans}</li>`, extra: esc(t.pie) }) : `<footer>
  <div class="kap">
    <span>${t.idiomas.map(([l, n]) => `<a href="/${RUTAS[tipo][l]}/" hreflang="${l}">${n}</a>`).join(' · ')}</span>
    <span>© 2026 Tony Hanma · Tony Kansai Guide · Osaka</span>
    <span>${esc(t.pie)} ${esc(t.credito)} ${esc(altPortada)}: <a href="${fc.kaynak}" rel="noopener">${esc(fc.autor)}</a>, ${fc.lisans}.</span>
  </div>
</footer>`}

<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.min.js" defer></script>
<script src="/es/leyendas/movimiento.js" defer></script>
<link rel="stylesheet" href="/es/leyendas/fantasma.css">
<script src="/es/leyendas/fantasma.js" defer></script>
</body>
</html>
`
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`Quedan huecos sin rellenar en ${RUTAS[tipo][lang]}`)
  const dest = join(raiz, 'public', RUTAS[tipo][lang])
  mkdirSync(dest, { recursive: true })
  writeFileSync(join(dest, 'index.html'), html)
  console.log(`leyendas ${lang}: ${lista.length} ${tipo}, ${fuentesUnicas.length} fuentes, ${fotosUsadas.length} fotos de Tony → public/${RUTAS[tipo][lang]}/index.html`)
}

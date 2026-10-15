// Sección «nivel pro» de la página de montaña: diez rutas exigentes de Kansai
// con su ficha técnica (km, desnivel, horas), el enlace a la ruta en AllTrails
// y el botón para pedirla con guía. Debajo, las apps y las preguntas frecuentes
// (también en JSON-LD, que es lo que leen Google y las IAs).
import { useRef, useState } from 'react'
import { CUMBRES, TEXTOS_CUMBRES, alltrails, YAMAP, letraMes } from './datosCumbres'
import type { Lengua, Nivel } from './datosCumbres'
import { Contador, SelloCumbre, useBilletes, useSellos } from './Cocina'
import SplitFlapText from './reactbits/SplitFlapText'
import './cumbres.css'

const BASE = 'https://tonykansaiguide.com'
const MAX_DESNIVEL = Math.max(...CUMBRES.map((c) => c.desnivel))
/** Socios de seguro y equipo; IATI ya con enlace de afiliado, el resto directo hasta que lleguen los suyos. */
const EQUIPO = [
  { id: 'iati', nombre: 'IATI', tipo: 'seguro', url: 'https://www.iatiseguros.com/?r=28859190572940' },
  { id: 'wn', nombre: 'World Nomads', tipo: 'seguro', url: 'https://www.worldnomads.com/' },
  { id: 'hm', nombre: 'Heymondo', tipo: 'seguro', url: 'https://heymondo.com/' },
  { id: 'yr', nombre: 'Yamarent', tipo: 'alquiler', url: 'https://yamarent.com/' },
] as const
/** Nombre corto en mayúsculas, sin macrones, para el panel de salidas: «kyoto-isshu» → KYOTO. */
const salida = (c: { id: string }) => c.id.split('-')[0].toUpperCase()
const ANCHO_SALIDA = Math.max(...CUMBRES.map((c) => salida(c).length))
const NIVELES: ('todas' | Nivel)[] = ['todas', 'exigente', 'experto', 'ultra']

const numero = (n: number, lang: Lengua) => n.toLocaleString(lang === 'ar' ? 'ar-EG' : lang, { maximumFractionDigits: 1 })

/** Para Google y las IAs: las diez rutas como TouristTrip y las preguntas como FAQPage. */
export function datosCumbres(lang: Lengua, url: string) {
  const t = TEXTOS_CUMBRES[lang]
  return [
    {
      '@context': 'https://schema.org', '@type': 'ItemList', name: t.titulo, description: t.sub,
      itemListElement: CUMBRES.map((c, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'TouristTrip', name: `${c.nombre} (${c.kanji})`, description: `${c.t[lang].sub}. ${c.t[lang].nota}`,
          inLanguage: lang, touristType: ['Experienced hikers', 'Trail runners'], url: `${url}#${c.id}`,
          subjectOf: { '@type': 'WebPage', name: 'AllTrails', url: alltrails(c.slug) },
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'distance', value: c.km, unitCode: 'KMT' },
            { '@type': 'PropertyValue', name: 'elevation gain', value: c.desnivel, unitCode: 'MTR' },
            ...(c.cima ? [{ '@type': 'PropertyValue', name: 'summit elevation', value: c.cima, unitCode: 'MTR' }] : []),
          ],
          provider: { '@id': `${BASE}/#negocio` },
        },
      })),
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang,
      mainEntity: t.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}

/** Franja de golpe antes de las rutas pro: tres cifras enormes sobre foto. */
export function Banda({ lang }: { lang: Lengua }) {
  const b = TEXTOS_CUMBRES[lang].banda
  const n = (v: number) => numero(v, lang)
  const valores = [1915, 81.8, 2000]
  return (
    <section className="ex-banda" aria-label={b.titulo}>
      <div className="ex-banda-dentro">
        <h2>{b.titulo}</h2>
        <dl>
          {b.cifras.map((t, i) => <div key={t}><dt><Contador valor={valores[i]} formato={n} /></dt><dd>{t}</dd></div>)}
        </dl>
      </div>
    </section>
  )
}

export function Cumbres({ lang, waNumero }: { lang: Lengua; waNumero: string }) {
  const t = TEXTOS_CUMBRES[lang]
  const [filtro, setFiltro] = useState<'todas' | Nivel>('todas')
  const lista = CUMBRES.filter((c) => filtro === 'todas' || c.nivel === filtro)
  const raiz = useRef<HTMLElement>(null)
  useBilletes(raiz)
  useSellos(raiz, filtro)
  const wa = (ruta: string) => `https://wa.me/${waNumero}?text=${encodeURIComponent(t.saludo(ruta))}`

  return (
    <>
      <section id="cumbres" ref={raiz} className="cu" aria-labelledby="cu-titulo">
        <div className="cu-cab">
          <p className="cu-kicker"><span aria-hidden="true" />{t.kicker}</p>
          <h2 id="cu-titulo">{t.titulo}</h2>
          <p className="cu-sub">{t.sub}</p>
          {/* Panel de salidas (出発): pasa por las rutas del filtro elegido. Adorno; la lista ya lo dice. */}
          <div className="ck-salidas" aria-hidden="true" dir="ltr">
            <span lang="ja">出発</span>
            <SplitFlapText key={filtro} words={lista.map(salida)} padTo={ANCHO_SALIDA} charset="alpha" fontSize="clamp(18px, 2.6vw, 28px)"
              tileColor="#151515" textColor="#ffcc00" tileRadius={2} gap={3} cycleDelay={2200} />
          </div>
          <div className="cu-filtros" role="group" aria-label={t.filtros.todas}>
            {NIVELES.map((n) => (
              <button key={n} type="button" aria-pressed={filtro === n} className={`cu-filtro cu-n-${n}`} onClick={() => setFiltro(n)}>
                {t.filtros[n]}
              </button>
            ))}
          </div>
          {filtro !== 'todas' && <p className="cu-nivel-desc">{t.nivelDesc[filtro]}</p>}
        </div>

        <ol className="cu-lista">
          {lista.map((c) => {
            const x = c.t[lang]
            return (
              <li key={c.id} id={c.id} className={`cu-ficha ck-billete cu-n-${c.nivel}`}>
                <div className="cu-ficha-cab">
                  <span className={`cu-nivel cu-n-${c.nivel}${c.nivel === 'ultra' ? ' ck-foil' : ''}`}>{t.filtros[c.nivel]}</span>
                  <span className="cu-pref">{c.prefectura[lang]}</span>
                </div>
                <h3><span lang="ja">{c.kanji}</span><bdi>{c.nombre}</bdi></h3>
                <p className="cu-ficha-sub">{x.sub}</p>
                <dl className="cu-cifras">
                  <div><dd><bdi>{numero(c.km, lang)}</bdi></dd><dt>{t.et.km}</dt></div>
                  <div><dd><bdi>{numero(c.desnivel, lang)}</bdi></dd><dt>{t.et.desnivel}</dt></div>
                  <div><dd><bdi>{c.horas}</bdi></dd><dt>{t.et.horas}</dt></div>
                </dl>
                {/* Barra de desnivel, relativa a la ruta con más metros: compara de un vistazo. */}
                <div className="cu-barra" aria-hidden="true"><i style={{ width: `${Math.round((c.desnivel / MAX_DESNIVEL) * 100)}%` }} /></div>
                {c.sellos.length > 0 && (
                  <ul className="cu-sellos">{c.sellos.map((s) => <li key={s}>{t.sellos[s]}</li>)}</ul>
                )}
                <p className="cu-nota">{x.nota}</p>
                <dl className="cu-datos">
                  {c.cima && <div><dt>{t.et.cima}</dt><dd><bdi>{numero(c.cima, lang)} m</bdi></dd></div>}
                  <div><dt>{t.et.acceso}</dt><dd>{x.acceso}</dd></div>
                  <div><dt>{t.et.meses}</dt><dd className="cu-meses" aria-label={c.meses.map((m) => letraMes(lang, m)).join(', ')}>
                    {Array.from({ length: 12 }, (_, i) => <span key={i} className={c.meses.includes(i + 1) ? 'si' : undefined} aria-hidden="true">{letraMes(lang, i + 1)}</span>)}
                  </dd></div>
                </dl>
                {/* Talón del billete de ruta y el sello de cumbre que «cae» al verlo. */}
                <div className="ck-corte" aria-hidden="true"><i /></div>
                <SelloCumbre arriba="山" abajo={c.cima ? `▲ ${c.cima} m` : `D+ ${c.desnivel} m`} />
                <div className="cu-botones">
                  <a className="cu-boton" href={wa(c.nombre)} target="_blank" rel="noopener noreferrer"
                    onClick={() => window.gtag?.('event', 'generate_lead', { pagina: `cumbres-${lang}`, ruta: c.id, canal: 'whatsapp_cumbres' })}>{t.et.pedir}</a>
                  <a className="cu-at" href={alltrails(c.slug)} target="_blank" rel="noopener noreferrer"
                    onClick={() => window.gtag?.('event', 'click', { pagina: `cumbres-${lang}`, ruta: c.id, canal: 'alltrails' })}>{t.et.alltrails} <span aria-hidden="true">↗</span></a>
                </div>
              </li>
            )
          })}
        </ol>
        <p className="cu-precio">{t.et.precio} · {t.fuente}</p>

        <div className="cu-apps">
          <div>
            <h3>{t.apps.titulo}</h3>
            <p>{t.apps.sub}</p>
          </div>
          <div className="cu-apps-botones">
            <a className="cu-app cu-app-at" href="https://www.alltrails.com/japan" target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'click', { pagina: `cumbres-${lang}`, canal: 'alltrails' })}><b>AllTrails</b><small>{t.apps.alltrails}</small></a>
            <a className="cu-app cu-app-ym" href={YAMAP} target="_blank" rel="noopener noreferrer"><b>YAMAP</b><small>{t.apps.yamap}</small></a>
          </div>
        </div>

        {/* Seguro y alquiler de equipo: enlaces de socios, marcados como patrocinados. */}
        <div className="cu-apps cu-equipo">
          <div>
            <h3>{t.equipo.titulo}</h3>
            <p>{t.equipo.sub}</p>
            <p className="cu-equipo-aviso">{t.equipo.aviso}</p>
          </div>
          <div className="cu-apps-botones">
            {EQUIPO.map((e) => (
              <a key={e.id} className={`cu-app cu-app-${e.id}`} href={e.url} target="_blank" rel="noopener noreferrer sponsored"
                onClick={() => window.gtag?.('event', 'click', { pagina: `cumbres-${lang}`, canal: `socio_${e.id}` })}>
                <b>{e.nombre}</b><small>{e.tipo === 'seguro' ? t.equipo.seguro : t.equipo.alquiler}</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="preguntas" className="cu cu-faq" aria-labelledby="cu-faq-titulo">
        <h2 id="cu-faq-titulo">{t.faq.titulo}</h2>
        {t.faq.items.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </>
  )
}

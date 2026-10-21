// Ficha propia de cada app de la página de ventajas (/es/ventajas/airalo/…):
// qué es, para qué sirve en Kansai, cómo empezar paso a paso, consejos y precio.
// Los textos largos están en datosVentajasDetalle.ts; aquí solo el armazón.

import { Link } from 'react-router-dom'
import { CodigoCifrado } from './Cocina'
import { APPS, CATEGORIAS, type App, cuponDe, esAfiliado } from './datosVentajas'
import { DETALLE, T_RU } from './datosVentajasDetalle'
import { LOGOS, ICONOS_APP } from './logosMarcas'
import { IconoWa } from './IconoWa'
import { GuiaTienda } from './GuiaTienda'
import './guia-tienda.css'

type Id = 'es' | 'en' | 'ar' | 'ru'

/** Texto corto de la tarjeta en cualquier idioma (el ruso vive en T_RU). */
export const textoApp = (a: App, id: Id) => (id === 'ru' ? a.t.ru ?? T_RU[a.clave] ?? a.t.en : a.t[id])

export const MAS: Record<Id, string> = { es: 'Cómo funciona', en: 'How it works', ar: 'كيف يعمل', ru: 'Как это работает' }

const L: Record<Id, {
  todas: string; para: string; pasos: string; consejos: string; precio: string; abrir: string; cupon: string; copiar: string; copiado: string
  porque: string; porqueTexto: string; otras: string; nota: string
}> = {
  es: {
    todas: 'Todas las apps', para: 'Para qué te sirve en Kansai', pasos: 'Cómo empezar, paso a paso', consejos: 'Mis consejos', precio: 'Precio',
    abrir: 'Abrir', cupon: 'Tu código de descuento', copiar: 'Copiar', copiado: '¡Copiado!',
    porque: '¿Por qué abrirla desde mi botón?',
    porqueTexto: 'Si entras desde aquí, la app sabe que vienes de mi parte y me da una pequeña comisión. A ti no te cuesta nada más: el precio es el mismo y me ayudas a mantener esta guía gratis.',
    otras: 'Otras apps útiles', nota: 'Enlace de colaboración',
  },
  en: {
    todas: 'All apps', para: 'What it is good for in Kansai', pasos: 'How to get started, step by step', consejos: 'My tips', precio: 'Price',
    abrir: 'Open', cupon: 'Your discount code', copiar: 'Copy', copiado: 'Copied!',
    porque: 'Why open it from my button?',
    porqueTexto: 'If you come in from here, the app knows I sent you and pays me a small commission. It costs you nothing extra: same price, and you help me keep this guide free.',
    otras: 'More useful apps', nota: 'Partner link',
  },
  ar: {
    todas: 'كل التطبيقات', para: 'فيمَ يفيدك في كانساي', pasos: 'كيف تبدأ، خطوة بخطوة', consejos: 'نصائحي', precio: 'السعر',
    abrir: 'افتح', cupon: 'رمز الخصم', copiar: 'نسخ', copiado: 'تم النسخ!',
    porque: 'لماذا تفتحه من زرّي؟',
    porqueTexto: 'إذا دخلت من هنا يعرف التطبيق أنني من أرسلك ويمنحني عمولة صغيرة. لا يكلّفك ذلك شيئًا إضافيًا: السعر نفسه، وتساعدني على إبقاء هذا الدليل مجانيًا.',
    otras: 'تطبيقات مفيدة أخرى', nota: 'رابط شراكة',
  },
  ru: {
    todas: 'Все приложения', para: 'Чем полезно в Кансае', pasos: 'Как начать: шаг за шагом', consejos: 'Советы', precio: 'Цена',
    abrir: 'Открыть', cupon: 'Код на скидку', copiar: 'Скопировать', copiado: 'Скопировано!',
    porque: 'Почему лучше открыть по нашей кнопке?',
    porqueTexto: 'Если вы переходите отсюда, сервис знает, что вы от нас, и платит небольшую комиссию. Для вас цена та же, а вы помогаете сохранить этот гид бесплатным.',
    otras: 'Другие полезные приложения', nota: 'Партнёрская ссылка',
  },
}

const DIBUJO: Record<string, string> = {
  airalo: 'device-mobile', klook: 'ticket', gyg: 'compass', kkday: 'camera', trip: 'plane', agoda: 'bed', booking: 'building-skyscraper',
  welcome: 'plane-arrival', icoca: 'train', go: 'car', uber: 'steering-wheel', luup: 'scooter-electric', hello: 'bike', wise: 'credit-card',
  maps: 'map-2', traductor: 'language', radical: 'luggage',
  tiqets: 'ticket', kiwitaxi: 'car', intui: 'plane-arrival', yesim: 'device-mobile', ekta: 'shield-check', iati: 'shield-check', airhelp: 'plane', mobal: 'device-mobile', flytographer: 'camera',
}
const Dibujo = ({ n, className }: { n: string; className?: string }) => (
  <svg className={className} aria-hidden="true"><use href={`/v7/ventajas-dibujos.svg#${n}`} /></svg>
)
function Logo({ a, className }: { a: App; className?: string }) {
  return (
    <span className={`${className ?? ''}${ICONOS_APP.has(a.clave) ? ' vt-ico-real' : ''}`} style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }} aria-hidden="true">
      {ICONOS_APP.has(a.clave) ? <img src={`/v7/apps/${a.clave}.webp`} alt="" width="128" height="128" decoding="async" /> : a.marca.logo ? <svg viewBox="0 0 24 24"><path d={LOGOS[a.marca.logo]} fill="currentColor" /></svg>
        : <b dir="ltr">{(a.marca.palabra ?? a.nombre).length <= 4 ? a.marca.palabra : (a.marca.palabra ?? a.nombre).charAt(0)}</b>}
    </span>
  )
}

function Copiar({ texto, l }: { texto: string; l: (typeof L)[Id] }) {
  return (
    <button type="button" className="vt-copiar" onClick={(e) => {
      const b = e.currentTarget
      navigator.clipboard?.writeText(texto).then(() => { b.textContent = l.copiado; setTimeout(() => { b.textContent = l.copiar }, 1800) }).catch(() => window.prompt(l.copiar, texto))
    }}>{l.copiar}</button>
  )
}

export function FichaApp({ a, id, lista, wa, final }: {
  a: App; id: Id; lista: string; wa: string
  final: { finalTitulo: string; finalTexto: string; finalBoton: string }
}) {
  const l = L[id]
  const d = DETALLE[a.clave]?.[id]
  const t = textoApp(a, id)
  const cupon = cuponDe(a)
  const href = a.codigo?.startsWith('http') ? a.codigo : a.enlace
  const colabora = esAfiliado(a)
  const flecha = id === 'ar' ? '←' : '→'
  const otras = [...APPS.filter((x) => x.cat === a.cat && x.clave !== a.clave), ...APPS.filter((x) => x.cat !== a.cat)].slice(0, 8)
  const marca = { ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta, ['--marca-boton' as string]: a.marca.boton ?? a.marca.tinta, ['--marca-boton-tinta' as string]: a.marca.botonTinta ?? a.marca.fondo }
  const Boton = () => (
    <a className="vt-boton" href={href} target="_blank" rel="noopener noreferrer sponsored">{l.abrir} {a.nombre} <span aria-hidden="true">{flecha}</span></a>
  )

  return (
    <main className="vt-ficha">
      <section className="vt-ficha-portada" style={marca}>
        <div className="vt-ficha-dentro">
          <div className="vt-ficha-texto">
            <Link to={lista} className="vt-ficha-volver"><span aria-hidden="true">{id === 'ar' ? '→' : '←'}</span> {l.todas}</Link>
            <div className="vt-ficha-marca">
              <Logo a={a} className="vt-ico vt-ico-grande" />
              <span className="vt-cat">{CATEGORIAS[a.cat][id]}</span>
            </div>
            <h1 dir="ltr">{a.nombre}</h1>
            <p className="vt-que">{d?.intro ?? t.que}</p>
            <p className="vt-ventaja">{t.ventaja}</p>
            {cupon && (
              <div className="vt-cupon">
                <span>{l.cupon}</span>
                <bdi dir="ltr"><CodigoCifrado>{cupon}</CodigoCifrado></bdi>
                <Copiar texto={cupon} l={l} />
              </div>
            )}
            <div className="vt-acciones"><Boton />{colabora && <small className="vt-nota-colab">{l.nota}</small>}</div>
          </div>
          <div className="vt-ficha-dibujo" aria-hidden="true">
            <Dibujo n={DIBUJO[a.clave] ?? 'sparkles'} />
          </div>
        </div>
      </section>

      {d && (
        <>
          <section className="vt-ficha-bloque">
            <h2>{l.para}</h2>
            <ul className="vt-ficha-para">
              {d.para.map((x) => <li key={x}><Dibujo n="check" className="vt-ficha-check" /><span>{x}</span></li>)}
            </ul>
          </section>

          <section className="vt-ficha-bloque">
            <h2>{l.pasos}</h2>
            <ol className="vt-ficha-pasos" style={marca}>
              {d.pasos.map((x, n) => <li key={x}><span className="vt-ficha-num">{n + 1}</span><p>{x}</p></li>)}
            </ol>
            <div className="vt-ficha-cta" style={marca}><Boton /></div>
          </section>

          <section className="vt-ficha-bloque vt-ficha-dos">
            <div>
              <h2>{l.consejos}</h2>
              <ul className="vt-ficha-consejos">{d.consejos.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="vt-ficha-precio">
              <h2>{l.precio}</h2>
              <p>{d.precio}</p>
            </div>
          </section>
        </>
      )}

      <GuiaTienda clave={a.clave} nombre={a.nombre} id={id} wa={wa} />

      {colabora && (
        <section className="vt-ficha-bloque">
          <div className="vt-ficha-porque" style={marca}>
            <h2>{l.porque}</h2>
            <p>{l.porqueTexto}</p>
            <Boton />
          </div>
        </section>
      )}

      <section className="vt-ficha-bloque">
        <h2>{l.otras}</h2>
        <div className="vt-ficha-otras">
          {otras.map((x) => (
            <Link key={x.clave} to={`${lista}${x.clave}/`}><Logo a={x} className="vt-ico" /><span dir="ltr">{x.nombre.replace('Google ', '')}</span></Link>
          ))}
        </div>
      </section>

      <section className="vt-final">
        <h2>{final.finalTitulo}</h2>
        <p>{final.finalTexto}</p>
        <a className="vt-wa vt-wa-grande" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {final.finalBoton}</a>
      </section>
    </main>
  )
}

// Ventajas y herramientas DENTRO de las guías (16-11-2026).
// Antes las ventajas vivían solo en /es/ventajas/ y las herramientas (calculadora,
// trenes, tarjetas en japonés…) sueltas por el pie: quien leía la guía de Kioto no
// veía que hay ceremonia del té con descuento en Kioto, ni una tarjeta halal para
// el restaurante. Ahora cada guía de ciudad enseña las de su ciudad, y la página
// de Tony las de todo Kansai. Todo sale de datosVentajas.ts: nada se escribe a mano.
//
// Las herramientas son HTML estático (scripts/herramientas*.mjs, calculadora.mjs):
// van con <a>, no con <Link>, para que el navegador cargue la página de verdad.

import { Link } from 'react-router-dom'
import { APPS, CATEGORIAS, CIUDADES, RUTA_VENTAJAS, ciudadesDe, cuponDe, enKansai, type App, type Ciudad } from './datosVentajas'
import { ICONOS_APP } from './logosMarcas'
import { FOTO_EXP, FOTO_SOCIO } from './datosVentajasGuia'
import { FotoSocio, FotoZona } from './FotoZona'
import './kit-guia.css'

type Lengua = 'es' | 'en' | 'ar'
export const esLenguaKit = (l: string): l is Lengua => l === 'es' || l === 'en' || l === 'ar'

/** Ciudad de la guía (v8) → ciudad de las ventajas. Kobe y Himeji no tienen socios propios. */
const CIUDAD_VENTAJA: Record<string, Ciudad | undefined> = { osaka: 'osaka', kyoto: 'kioto', nara: 'nara', hiroshima: 'hiroshima', beyond: 'kumano' }

const T: Record<Lengua, {
  eti: string; titulo: (c: string) => string; tituloKansai: string; entra: string; nota: string
  conTony: string; musulman: string; codigo: string; mas: (n: number, c: string) => string
  kit: string; kitEntra: string; todas: (n: number) => string
  etiHerr: string; herr: (c?: string) => string; herrEntra: string; todasHerr: string
}> = {
  es: {
    eti: 'Ventajas', titulo: (c) => `Ventajas en ${c}`, tituloKansai: 'Ventajas de mis socios en Kansai',
    entra: 'Experiencias de socios con los que trabajo: descuento con código o trato especial si reservas conmigo. Cada ficha explica qué es, cuánto ahorras y cómo se reserva.',
    nota: 'Las experiencias se pagan aparte, al precio del socio. El precio del guía es solo el guiado.',
    conTony: 'Ventaja con Tony', musulman: 'Apto para musulmanes', codigo: 'Código',
    mas: (n, c) => `Y ${n} más en ${c}:`,
    kit: 'El kit que uso cada día en Kansai', kitEntra: 'Internet, tarjeta de transporte, taxi, pagos y seguro: lo que llevo yo y lo que recomiendo a mis clientes.',
    todas: (n) => `Ver las ${n} ventajas`,
    etiHerr: 'Herramientas', herr: (c) => (c ? `Herramientas gratis para tu día en ${c}` : 'Herramientas gratis para tu viaje por Kansai'),
    herrEntra: 'Para usarlas en la calle, desde el móvil y sin registrarte.', todasHerr: 'Todas las herramientas',
  },
  en: {
    eti: 'Perks', titulo: (c) => `Perks in ${c}`, tituloKansai: 'Perks from my partners in Kansai',
    entra: 'Experiences run by partners I work with: a discount code, or something extra when you book through me. Each page says what it is, how much you save and how to book.',
    nota: 'Experiences are paid separately, at the partner’s price. The guide fee covers the guiding only.',
    conTony: 'Perk with Tony', musulman: 'Muslim-friendly', codigo: 'Code',
    mas: (n, c) => `And ${n} more in ${c}:`,
    kit: 'The kit I use every day in Kansai', kitEntra: 'Mobile data, transport card, taxis, payments and insurance: what I carry myself and recommend to my guests.',
    todas: (n) => `See all ${n} perks`,
    etiHerr: 'Tools', herr: (c) => (c ? `Free tools for your day in ${c}` : 'Free tools for your Kansai trip'),
    herrEntra: 'Made to use on the street, on your phone, with no sign-up.', todasHerr: 'All tools',
  },
  ar: {
    eti: 'مزايا', titulo: (c) => `مزايا في ${c}`, tituloKansai: 'مزايا شركائي في كانساي',
    entra: 'تجارب يقدّمها شركاء أعمل معهم: خصم برمز، أو ميزة إضافية عند الحجز معي. كل صفحة تشرح ما هي التجربة وكم توفّر وكيف تحجز.',
    nota: 'تُدفع التجارب على حدة وبسعر الشريك. سعر المرشد يشمل الإرشاد فقط.',
    conTony: 'ميزة مع طوني', musulman: 'مناسب للمسلمين', codigo: 'الرمز',
    mas: (n, c) => `و${n} أخرى في ${c}:`,
    kit: 'ما أستخدمه كل يوم في كانساي', kitEntra: 'الإنترنت وبطاقة المواصلات والتاكسي والدفع والتأمين: ما أحمله بنفسي وأنصح به ضيوفي.',
    todas: (n) => `كل المزايا (${n})`,
    etiHerr: 'أدوات', herr: (c) => (c ? `أدوات مجانية ليومك في ${c}` : 'أدوات مجانية لرحلتك في كانساي'),
    herrEntra: 'مصمّمة للاستخدام في الشارع من الهاتف، دون تسجيل.', todasHerr: 'كل الأدوات',
  },
}

type HerrId = 'comida' | 'taxi' | 'transporte' | 'planificador' | 'calculadora'
/** Rutas de las herramientas: las mismas que escriben scripts/herramientas*.mjs y calculadora.mjs. */
export const HERRAMIENTAS: Record<Lengua, Record<HerrId | 'hub', string>> = {
  es: { hub: '/es/herramientas/', comida: '/es/herramientas/tarjeta-comida-japones/', taxi: '/es/herramientas/tarjeta-taxi-japones/', transporte: '/es/herramientas/transporte-kansai/', planificador: '/es/herramientas/planificador-kansai/', calculadora: '/es/calculadora-guia/' },
  en: { hub: '/en/tools/', comida: '/en/tools/japanese-food-card/', taxi: '/en/tools/japanese-taxi-card/', transporte: '/en/tools/kansai-train-times-fares/', planificador: '/en/tools/kansai-itinerary-planner/', calculadora: '/en/private-guide-calculator/' },
  ar: { hub: '/ar/tools/', comida: '/ar/tools/halal-food-card/', taxi: '/ar/tools/taxi-card-japanese/', transporte: '/ar/tools/kansai-trains/', planificador: '/ar/tools/kansai-itinerary-planner/', calculadora: '/ar/private-guide-calculator/' },
}

const KANJI: Record<HerrId, string> = { comida: '食', taxi: '車', transporte: '駅', planificador: '旅', calculadora: '算' }
/** Desde dónde se llega a cada ciudad (en Kioto no tiene sentido «desde Kioto»). */
const DESDE: Record<Lengua, Record<'kyoto' | 'osaka' | 'otra', string>> = {
  es: { kyoto: 'Osaka o el aeropuerto de Kansai', osaka: 'Kioto o el aeropuerto de Kansai', otra: 'Osaka o Kioto' },
  en: { kyoto: 'Osaka or Kansai Airport', osaka: 'Kyoto or Kansai Airport', otra: 'Osaka or Kyoto' },
  ar: { kyoto: 'أوساكا أو مطار كانساي', osaka: 'كيوتو أو مطار كانساي', otra: 'أوساكا أو كيوتو' },
}
const HERR: Record<Lengua, Record<HerrId, { t: string; s: (c?: string, desde?: string) => string }>> = {
  es: {
    transporte: { t: 'Trenes de Kansai: tiempos y precios', s: (c, d) => (c ? `Cómo llegar a ${c} desde ${d}, con el tiempo y el precio de cada línea.` : 'Osaka, Kioto, Nara, Kobe, Himeji e Hiroshima: cada línea con su tiempo y su precio.') },
    planificador: { t: 'Planificador de días', s: () => 'Dime cuántos días tienes y dónde duermes: te sale el plan, día a día.' },
    comida: { t: 'Tarjeta de comida en japonés', s: () => 'Halal, sin cerdo, sin alcohol, vegetariano o alergias: para enseñársela al camarero.' },
    taxi: { t: 'Tarjeta para el taxi', s: () => 'Tu destino en japonés, a pantalla completa y con voz.' },
    calculadora: { t: '¿Te compensa un guía?', s: () => 'Cuatro preguntas y el precio por persona, con la respuesta honesta.' },
  },
  en: {
    transporte: { t: 'Kansai trains: times and fares', s: (c, d) => (c ? `How to get to ${c} from ${d}, with the time and fare for each line.` : 'Osaka, Kyoto, Nara, Kobe, Himeji and Hiroshima: every line with its time and fare.') },
    planificador: { t: 'Day-by-day planner', s: () => 'Tell it how many days you have and where you sleep: you get the plan, day by day.' },
    comida: { t: 'Japanese food card', s: () => 'Halal, no pork, no alcohol, vegetarian or allergies: show it to the waiter.' },
    taxi: { t: 'Taxi card in Japanese', s: () => 'Your destination in Japanese, full screen and read aloud.' },
    calculadora: { t: 'Is a private guide worth it?', s: () => 'Four questions, the price per person and an honest answer.' },
  },
  ar: {
    transporte: { t: 'قطارات كانساي: المدة والأسعار', s: (c, d) => (c ? `كيف تصل إلى ${c} من ${d}، مع مدة وسعر كل خط.` : 'أوساكا وكيوتو ونارا وكوبي وهيميجي وهيروشيما: كل خط بمدته وسعره.') },
    planificador: { t: 'مخطّط الأيام', s: () => 'أخبره بعدد أيامك ومكان إقامتك، فتحصل على برنامج يومًا بيوم.' },
    comida: { t: 'بطاقة الطعام الحلال باليابانية', s: () => 'حلال، بلا لحم خنزير، بلا كحول، نباتي أو حساسية: اعرضها على النادل.' },
    taxi: { t: 'بطاقة التاكسي باليابانية', s: () => 'وجهتك باليابانية، على كامل الشاشة وبصوت مسموع.' },
    calculadora: { t: 'هل يستحق المرشد الخاص؟', s: () => 'أربعة أسئلة، والسعر للشخص، وجواب صادق.' },
  },
}
/** En árabe la tarjeta halal va primero: es lo que más se busca. */
const ORDEN_HERR: Record<Lengua, HerrId[]> = {
  es: ['transporte', 'planificador', 'comida', 'taxi', 'calculadora'],
  en: ['transporte', 'planificador', 'comida', 'taxi', 'calculadora'],
  ar: ['comida', 'transporte', 'planificador', 'taxi', 'calculadora'],
}

/** El kit de todos los días: eSIM, tarjeta IC, taxi, pagos y seguro (el de España para ES). */
const KIT: Record<Lengua, string[]> = {
  es: ['japanwirelessesim', 'nomad', 'icoca', 'go', 'wise', 'iati'],
  en: ['japanwirelessesim', 'nomad', 'icoca', 'go', 'wise'],
  ar: ['japanwirelessesim', 'nomad', 'icoca', 'go', 'wise'],
}

const porClave = new Map(APPS.map((a) => [a.clave, a]))
const NUM_VENTAJAS = APPS.length

/** Orden: en árabe, lo apto para musulmanes primero; luego lo que tiene descuento y lo que es solo con Tony. */
function ordenar(lista: App[], lang: Lengua) {
  const peso = (a: App) => (lang === 'ar' && a.musulman ? 0 : 4) + (a.descuento ? 0 : 2) + (a.conTony ? 0 : 1)
  return [...lista].sort((a, b) => peso(a) - peso(b))
}

function Logo({ a }: { a: App }) {
  return ICONOS_APP.has(a.clave)
    ? <img className="kg-logo" src={`/v7/apps/${a.clave}.webp`} alt="" width={44} height={44} loading="lazy" decoding="async" />
    : <span className="kg-logo kg-logo-palabra" style={{ background: a.marca.fondo, color: a.marca.tinta }} lang="ja" aria-hidden="true">{a.marca.palabra?.slice(0, 2) ?? a.nombre.slice(0, 1)}</span>
}

function Sellos({ a, lang }: { a: App; lang: Lengua }) {
  const t = T[lang]
  // Solo los códigos que dan descuento: el 1085 de Yumeyakata es un número de guía, no un cupón.
  const cupon = a.descuento ? cuponDe(a) : undefined
  return (
    <span className="kg-sellos">
      {a.descuento && <b className="kg-sello kg-sello-desc"><bdi dir="ltr">−{a.descuento.replace(/^[−-]/, '')}</bdi></b>}
      {cupon && <b className="kg-sello kg-sello-cod">{t.codigo} <bdi dir="ltr">{cupon}</bdi></b>}
      {a.conTony && <b className="kg-sello">{t.conTony}</b>}
      {a.musulman && <b className="kg-sello kg-sello-mus">{t.musulman}</b>}
    </span>
  )
}

function TarjetaExp({ a, lang }: { a: App; lang: Lengua }) {
  const socio = FOTO_SOCIO[a.clave]
  const zona = FOTO_EXP[a.clave]
  const sizes = '(max-width: 700px) 82vw, 360px'
  return (
    <li className="kg-exp">
      <div className="kg-exp-foto" style={socio || zona ? undefined : { background: a.marca.fondo }}>
        {socio ? <FotoSocio {...socio} alt="" sizes={sizes} className="kg-exp-img" />
          : zona ? <FotoZona zona={zona} lang={lang} sizes={sizes} className="kg-exp-img" />
          : <span className="kg-exp-palabra" style={{ color: a.marca.tinta }} lang="ja" aria-hidden="true">{a.marca.palabra ?? a.nombre}</span>}
        <Logo a={a} />
      </div>
      <div className="kg-exp-cuerpo">
        {/* El enlace cubre la tarjeta (::after); el crédito de la foto queda por encima. */}
        <h3><Link to={`${RUTA_VENTAJAS[lang]}${a.clave}/`} className="kg-exp-enlace">{a.nombre}</Link></h3>
        <p>{a.t[lang].que}</p>
        <Sellos a={a} lang={lang} />
      </div>
    </li>
  )
}

/**
 * Ventajas de una ciudad (o de todo Kansai si no hay ciudad) + el kit diario.
 * `ciudad` es el id de la guía (v8: kyoto, osaka…); sin socios allí, solo el kit.
 */
export function VentajasEnGuia({ lang, ciudad }: { lang: string; ciudad?: string }) {
  if (!esLenguaKit(lang)) return null
  const t = T[lang]
  const vc = ciudad ? CIUDAD_VENTAJA[ciudad] : undefined
  const exps = ordenar(APPS.filter((a) => a.cat === 'experiencias' && (vc ? ciudadesDe(a).includes(vc) : enKansai(a) && !!a.ciudad)), lang)
  const vista = exps.slice(0, 6)
  const resto = exps.slice(6)
  const kit = KIT[lang].map((k) => porClave.get(k)).filter((a): a is App => !!a)
  const flecha = lang === 'ar' ? '←' : '→'
  const nombreCiudad = vc ? CIUDADES[vc][lang] : 'Kansai'
  const titulo = vc ? t.titulo(nombreCiudad) : t.tituloKansai
  return (
    <section className="v7-seccion kg" aria-labelledby="kg-vent-t">
      <div className="kg-cab">
        <p className="kg-eti"><span lang="ja" aria-hidden="true">優待</span> {t.eti}</p>
        <h2 id="kg-vent-t">{exps.length ? titulo : t.kit}</h2>
        {exps.length > 0 && <p className="kg-entra">{t.entra}</p>}
      </div>

      {vista.length > 0 && (
        <>
          <ul className="kg-exps">{vista.map((a) => <TarjetaExp key={a.clave} a={a} lang={lang} />)}</ul>
          {resto.length > 0 && (
            <p className="kg-resto">
              <span>{t.mas(resto.length, nombreCiudad)}</span>{' '}
              {resto.map((a, i) => <span key={a.clave}>{i > 0 && ' · '}<Link to={`${RUTA_VENTAJAS[lang]}${a.clave}/`}>{a.nombre}</Link></span>)}
            </p>
          )}
          <p className="kg-nota">{t.nota}</p>
        </>
      )}

      <div className="kg-kit">
        {exps.length > 0 && <h3>{t.kit}</h3>}
        <p className="kg-kit-entra">{t.kitEntra}</p>
        <ul>
          {kit.map((a) => (
            <li key={a.clave}>
              <Link to={`${RUTA_VENTAJAS[lang]}${a.clave}/`} className="kg-kit-fila">
                <Logo a={a} />
                <span className="kg-kit-texto"><strong>{a.nombre}</strong><small>{CATEGORIAS[a.cat][lang]}</small></span>
                <Sellos a={a} lang={lang} />
              </Link>
            </li>
          ))}
        </ul>
        <Link to={RUTA_VENTAJAS[lang]} className="v7-boton v7-boton-sec kg-todas">{t.todas(NUM_VENTAJAS)} <span aria-hidden="true">{flecha}</span></Link>
      </div>
    </section>
  )
}

/** Las herramientas gratis (HTML estático), en tarjetas grandes con su kanji. */
/** `sinCabecera`: en la página de ventajas la parte ya trae su título y su botón final (20-11-2026). */
export function HerramientasEnGuia({ lang, nombreCiudad, ciudad, sinCabecera }: { lang: string; nombreCiudad?: string; ciudad?: string; sinCabecera?: boolean }) {
  if (!esLenguaKit(lang)) return null
  const t = T[lang]
  const r = HERRAMIENTAS[lang]
  const flecha = lang === 'ar' ? '←' : '→'
  return (
    <section className={`v7-seccion kg-herr${sinCabecera ? ' es-sin-cabecera' : ''}`} aria-labelledby={sinCabecera ? undefined : 'kg-herr-t'}>
      {!sinCabecera && <div className="kg-cab">
        <p className="kg-eti"><span lang="ja" aria-hidden="true">道具</span> {t.etiHerr}</p>
        <h2 id="kg-herr-t">{t.herr(nombreCiudad)}</h2>
        <p className="kg-entra">{t.herrEntra}</p>
      </div>}
      <ul className="kg-herr-rejilla">
        {ORDEN_HERR[lang].map((h, i) => (
          <li key={h} className={i === 0 ? 'kg-herr-grande' : undefined}>
            <a href={r[h]} className="kg-herr-tarjeta">
              <span className="kg-herr-kanji" lang="ja" aria-hidden="true">{KANJI[h]}</span>
              <strong>{HERR[lang][h].t}</strong>
              <small>{HERR[lang][h].s(nombreCiudad, DESDE[lang][ciudad === 'kyoto' || ciudad === 'osaka' ? ciudad : 'otra'])}</small>
              <span className="kg-herr-flecha" aria-hidden="true">{flecha}</span>
            </a>
          </li>
        ))}
      </ul>
      {!sinCabecera && <a href={r.hub} className="kg-herr-todas">{t.todasHerr} <span aria-hidden="true">{flecha}</span></a>}
    </section>
  )
}

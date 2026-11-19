// Bloques de la página de ventajas rehechos el 17-11-2026 con componentes GRATIS de
// React Bits (src/v7/reactbits/, MIT + Commons Clause): RotatingText y CountUp en la
// portada, SpotlightCard en las tarjetas, StarBorder en el botón principal,
// DecryptedText en los códigos y ScrollReveal en «Te lo digo claro».
// 20-11-2026: cada socio enseña su acuerdo tal como le afecta al viajero (Acuerdo.tsx):
// código para ti, te lo reservo yo, reservas tú y me mencionas, o solo recomendación.
// Las experiencias van por zonas (Kioto, Osaka, resto de Kansai y resto de Japón) y la
// tabla de acuerdos (parte 5 de la página) junta a todos los socios con su fecha.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy, ArrowUpRight, Moon, Search, Ticket, X } from 'lucide-react'
import { APPS, CATEGORIAS, CIUDADES, REGIONES, ciudadesDe, cuponDe, enKansai, enlaceDe, type App } from './datosVentajas'
import { ORDEN_ACUERDO, acuerdoDe, reglasDe, type Acuerdo } from './datosCanje'
import { ACU_T, CANJE_T, ICONO_ACUERDO, ICONO_CANJE, AcuerdoCorto, AcuerdoSocio, PaseTony, paseAbierto, fechaCorta, actualizadoDe, menosDe } from './Acuerdo'
import { ICONOS_APP } from './logosMarcas'
import { ICONO_EXP } from './iconosExperiencia'
import { FOTO_EXP, FOTO_SOCIO, GUIA } from './datosVentajasGuia'
import { FotoSocio, FotoZona, nombreZona } from './FotoZona'
import { textoApp, MAS } from './FichaVentaja'
import { MetaFila, Vistazo } from './Vistazo'
import './vistazo.css'
import SpotlightCard from './reactbits/SpotlightCard'
import StarBorder from './reactbits/StarBorder'
import RotatingText from './reactbits/RotatingText'
import CountUp from './reactbits/CountUp'
import DecryptedText from './reactbits/DecryptedText'
import ScrollReveal from './reactbits/ScrollReveal'
import './reactbits/SpotlightCard.css'
import './reactbits/StarBorder.css'
import './reactbits/RotatingText.css'
import './reactbits/ScrollReveal.css'
import './ventajas-rb.css'

// El pase vive en Acuerdo.tsx (también lo abre la ficha de cada socio); la página lo importa de aquí.
export { PaseTony }

type Id = 'es' | 'en' | 'ar' | 'ru'

export const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')
// Kansai primero; dentro, las que tienen acuerdo para el viajero y las aptas para musulmanes.
const peso = (a: App) => (enKansai(a) ? 10 : 0) + (acuerdoDe(a) !== 'lista' ? 2 : 0) + Number(!!a.musulman)
const ORDENADAS = [...EXPERIENCIAS].sort((a, b) => peso(b) - peso(a))

/** Zonas de la parte 1: Kioto y Osaka (donde más socios hay), el resto de Kansai y el resto de Japón. */
type Grupo = 'kioto' | 'osaka' | 'kansai' | 'japon'
const GRUPOS: Grupo[] = ['kioto', 'osaka', 'kansai', 'japon']
const grupoDe = (a: App): Grupo => (a.ciudad === 'kioto' ? 'kioto' : a.ciudad === 'osaka' ? 'osaka' : enKansai(a) ? 'kansai' : 'japon')
const POR_GRUPO = 4 // una fila en el ordenador; las demás, tras «Ver las N»
const sinParentesis = (s: string) => s.replace(/\s*\(.*\)$/, '')

// ── Textos ────────────────────────────────────────────────────────────────

const UI: Record<Id, {
  ojo: string; h1: string; con: string; rota: string[]; sub: string; exp: string; cod: string; foto: string
  stats: [string, string, string, string]
  comoOjo: string; comoT: string; comoSub: string; socios: string; abrirPase: string
  expT: string; expSub: string; todas: string; musulman: string; verTodas: string; verMenos: string; ninguna: string
  condiciones: string; comoSe: string; copiar: string; copiado: string; reservar: string; web: string; solo: string; cerrar: string; msg: string
  codT: string; codSub: string; hasta: string; ir: string; ver: string
  claro: string
}> = {
  es: {
    ojo: 'Ventajas para mis viajeros', h1: 'Lo mejor de Japón, de mi parte', con: 'Con ventaja en', rota: ['kimono', 'ceremonia del té', 'samuráis', 'cocina japonesa', 'internet', 'talleres'],
    sub: 'Socios que conozco en persona. Cada uno me dijo por escrito qué ventaja te da y cómo pedirla: aquí lo tienes, sin letra pequeña.',
    exp: 'Ver experiencias', cod: 'Mis códigos', foto: 'Torii rojos de Fushimi Inari, en Kioto',
    stats: ['experiencias', 'con ventaja', 'códigos', 'aptas para musulmanes'],
    comoOjo: 'Cómo funciona', comoT: 'Cuatro formas de trabajar con mis socios', comoSub: 'Cada socio acordó conmigo una sola cosa: un código para ti, que lo reserve yo, que me menciones al reservar o solo recomendarlo. Toca una para ver esos socios.', socios: 'socios', abrirPase: 'Abrir mi pase',
    expT: 'Experiencias que no encuentras en una app', expSub: 'Talleres, kimonos, samuráis y cocina. Toca una tarjeta para ver las condiciones completas y cómo conseguir la ventaja.',
    todas: 'Todas', musulman: 'Apto para musulmanes', verTodas: 'Ver las {n}', verMenos: 'Ver menos', ninguna: 'No hay experiencias con este filtro.',
    condiciones: 'Condiciones del socio', comoSe: 'Cómo conseguir la ventaja', copiar: 'Copiar', copiado: 'Copiado', reservar: 'Resérvalo conmigo', web: 'Su web', solo: 'Ve por tu cuenta: cómo llegar', cerrar: 'Cerrar', msg: 'Hola Tony, me interesa {n}. ¿Me ayudas a reservarlo?',
    codT: 'Tus códigos de descuento', codSub: 'Toca para copiar y pégalo al pagar, en el campo de código promocional o cupón.', hasta: 'hasta el', ir: 'Ir a la web', ver: 'Cómo usarlo',
    claro: 'Te lo digo claro: cuando reservas con mis enlaces o códigos, la empresa me paga una pequeña comisión. Tu precio es el mismo, y con código, menor. Solo pongo aquí lo que uso con mis clientes.',
  },
  en: {
    ojo: 'Perks for my travellers', h1: 'The best of Japan, through me', con: 'Perks on', rota: ['kimono', 'tea ceremony', 'samurai', 'Japanese cooking', 'mobile data', 'workshops'],
    sub: 'Partners I know in person. Each one told me in writing what perk you get and how to ask for it: here it is, no small print.',
    exp: 'See experiences', cod: 'My codes', foto: 'Red torii gates at Fushimi Inari, Kyoto',
    stats: ['experiences', 'with a perk', 'codes', 'Muslim-friendly'],
    comoOjo: 'How it works', comoT: 'Four ways my partners work', comoSub: 'Each partner agreed one thing with me: a code for you, booking through me, mentioning me when you book, or just a recommendation. Tap one to see those partners.', socios: 'partners', abrirPase: 'Open my pass',
    expT: 'Experiences you won’t find in an app', expSub: 'Workshops, kimono, samurai and cooking. Tap a card for the full conditions and how to get the perk.',
    todas: 'All', musulman: 'Muslim-friendly', verTodas: 'See all {n}', verMenos: 'Show fewer', ninguna: 'No experiences match this filter.',
    condiciones: 'Partner conditions', comoSe: 'How to get the perk', copiar: 'Copy', copiado: 'Copied', reservar: 'Book it with me', web: 'Their website', solo: 'Go on your own: getting there', cerrar: 'Close', msg: 'Hi Tony, I’m interested in {n}. Can you help me book it?',
    codT: 'Your discount codes', codSub: 'Tap to copy and paste it at checkout, in the promo code or coupon field.', hasta: 'until', ir: 'Go to website', ver: 'How to use it',
    claro: 'To be clear: when you book with my links or codes, the company pays me a small commission. Your price is the same, and with a code, lower. I only list what I use with my own guests.',
  },
  ar: {
    ojo: 'مزايا لضيوفي', h1: 'أفضل ما في اليابان، من طرفي', con: 'مزايا على', rota: ['الكيمونو', 'حفل الشاي', 'الساموراي', 'الطبخ الياباني', 'الإنترنت', 'الورش'],
    sub: 'شركاء أعرفهم شخصيًا. كلٌّ منهم أخبرني كتابةً بالميزة التي تحصل عليها وكيف تطلبها: هذه هي، بلا شروط مخفية.',
    exp: 'شاهد التجارب', cod: 'رموزي', foto: 'بوابات توري الحمراء في فوشيمي إيناري، كيوتو',
    stats: ['تجربة', 'بميزة', 'رموز', 'مناسبة للمسلمين'],
    comoOjo: 'كيف يعمل', comoT: 'أربع طرق للعمل مع شركائي', comoSub: 'اتفق كل شريك معي على شيء واحد: رمز لك، أو أن أحجز أنا، أو أن تذكرني عند الحجز، أو مجرد توصية. اضغط على طريقة لترى هؤلاء الشركاء.', socios: 'شركاء', abrirPase: 'افتح بطاقتي',
    expT: 'تجارب لن تجدها في أي تطبيق', expSub: 'ورش وكيمونو وساموراي وطبخ. اضغط على بطاقة لترى الشروط كاملة وكيف تحصل على الميزة.',
    todas: 'الكل', musulman: 'مناسب للمسلمين', verTodas: 'شاهد الكل ({n})', verMenos: 'عرض أقل', ninguna: 'لا توجد تجارب بهذا الاختيار.',
    condiciones: 'شروط الشريك', comoSe: 'كيف تحصل على الميزة', copiar: 'نسخ', copiado: 'تم النسخ', reservar: 'احجزه معي', web: 'موقعهم', solo: 'اذهب وحدك: كيف تصل', cerrar: 'إغلاق', msg: 'مرحبًا طوني، أنا مهتم بـ {n}. هل تساعدني في الحجز؟',
    codT: 'رموز الخصم الخاصة بك', codSub: 'اضغط للنسخ والصقه عند الدفع في خانة الرمز الترويجي أو القسيمة.', hasta: 'حتى', ir: 'افتح الموقع', ver: 'طريقة الاستخدام',
    claro: 'بكل وضوح: عندما تحجز عبر روابطي أو رموزي، تدفع لي الشركة عمولة صغيرة. سعرك نفسه، ومع الرمز أقل. لا أضع هنا إلا ما أستخدمه مع ضيوفي.',
  },
  ru: {
    ojo: 'Полезное для наших гостей', h1: 'Лучшее в Японии — от нас', con: 'Скидки на', rota: ['кимоно', 'чайную церемонию', 'самураев', 'японскую кухню', 'интернет', 'мастер-классы'],
    sub: 'Партнёры, которых мы знаем лично. Каждый письменно подтвердил, какой бонус вы получаете и как его попросить: всё здесь, без мелкого шрифта.',
    exp: 'Смотреть впечатления', cod: 'Коды', foto: 'Красные ворота тории в Фусими Инари, Киото',
    stats: ['впечатлений', 'с бонусом', 'кодов', 'подходят мусульманам'],
    comoOjo: 'Как это работает', comoT: 'Четыре формата работы с партнёрами', comoSub: 'С каждым партнёром договорились об одном: код для вас, бронь через нас, ссылка на нас при брони или просто рекомендация. Нажмите, чтобы увидеть этих партнёров.', socios: 'партнёров', abrirPase: 'Открыть пропуск',
    expT: 'Впечатления, которых нет в приложениях', expSub: 'Мастер-классы, кимоно, самураи и кухня. Нажмите на карточку, чтобы увидеть все условия и как получить бонус.',
    todas: 'Все', musulman: 'Подходит мусульманам', verTodas: 'Показать все ({n})', verMenos: 'Свернуть', ninguna: 'Нет впечатлений с этим фильтром.',
    condiciones: 'Условия партнёра', comoSe: 'Как получить бонус', copiar: 'Скопировать', copiado: 'Скопировано', reservar: 'Забронировать с нами', web: 'Их сайт', solo: 'Самостоятельно: как добраться', cerrar: 'Закрыть', msg: 'Здравствуйте! Меня интересует {n}. Поможете забронировать?',
    codT: 'Ваши коды на скидку', codSub: 'Нажмите, чтобы скопировать, и вставьте при оплате в поле промокода или купона.', hasta: 'до', ir: 'Открыть сайт', ver: 'Как использовать',
    claro: 'Честно: когда вы бронируете по нашим ссылкам или кодам, компания платит нам небольшую комиссию. Ваша цена та же, а с кодом ниже. Здесь только то, чем мы пользуемся с гостями.',
  },
}
// Lo que lee el personal en Japón: va siempre en japonés, sea cual sea el idioma de la página.

const GRUPO_T: Record<Id, Record<Grupo, string>> = {
  es: { kioto: 'Kioto', osaka: 'Osaka', kansai: 'Nara, Kumano y más', japon: 'Resto de Japón' },
  en: { kioto: 'Kyoto', osaka: 'Osaka', kansai: 'Nara, Kumano and more', japon: 'Rest of Japan' },
  ar: { kioto: 'كيوتو', osaka: 'أوساكا', kansai: 'نارا وكومانو وغيرهما', japon: 'بقية اليابان' },
  ru: { kioto: 'Киото', osaka: 'Осака', kansai: 'Нара, Кумано и не только', japon: 'Другие регионы Японии' },
}

type ZonaT = 'kansai' | 'japon' | 'online'
const TABLA_T: Record<Id, {
  buscar: string; todos: string; zonas: Record<ZonaT | 'todas', string>; cols: [string, string, string, string, string]
  mostrando: (n: number, t: number) => string; vacio: string; online: string; verTodos: (n: number) => string; verMenos: string
}> = {
  es: { buscar: 'Buscar socio o ciudad', todos: 'Todos', zonas: { todas: 'Todas las zonas', kansai: 'Kansai', japon: 'Resto de Japón', online: 'Online' }, cols: ['Socio', 'Zona', 'Acuerdo', 'Condiciones para ti', 'Actualizado'], mostrando: (n, t) => `${n} de ${t} socios`, vacio: 'Ningún socio con este filtro.', online: 'Online · todo Japón', verTodos: (n) => `Ver los ${n} socios`, verMenos: 'Ver menos' },
  en: { buscar: 'Search partner or city', todos: 'All', zonas: { todas: 'All areas', kansai: 'Kansai', japon: 'Rest of Japan', online: 'Online' }, cols: ['Partner', 'Area', 'Agreement', 'Your conditions', 'Updated'], mostrando: (n, t) => `${n} of ${t} partners`, vacio: 'No partner matches this filter.', online: 'Online · all Japan', verTodos: (n) => `See all ${n} partners`, verMenos: 'Show fewer' },
  ar: { buscar: 'ابحث عن شريك أو مدينة', todos: 'الكل', zonas: { todas: 'كل المناطق', kansai: 'كانساي', japon: 'بقية اليابان', online: 'عبر الإنترنت' }, cols: ['الشريك', 'المنطقة', 'الاتفاق', 'شروطك', 'آخر تحديث'], mostrando: (n, t) => `${n} من ${t} شريكًا`, vacio: 'لا يوجد شريك بهذا الاختيار.', online: 'عبر الإنترنت · كل اليابان', verTodos: (n) => `شاهد كل الشركاء (${n})`, verMenos: 'عرض أقل' },
  ru: { buscar: 'Найти партнёра или город', todos: 'Все', zonas: { todas: 'Все регионы', kansai: 'Кансай', japon: 'Другие регионы', online: 'Онлайн' }, cols: ['Партнёр', 'Регион', 'Договорённость', 'Условия для вас', 'Обновлено'], mostrando: (n, t) => `${n} из ${t} партнёров`, vacio: 'Нет партнёров с этим фильтром.', online: 'Онлайн · вся Япония', verTodos: (n) => `Показать всех (${n})`, verMenos: 'Свернуть' },
}

// ── Piezas pequeñas ──────────────────────────────────────────────────────

const estiloMarca = (a: App) => ({ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta })

function IconoSocio({ a, size = 22 }: { a: App; size?: number }) {
  const Ico = ICONO_EXP[a.clave]
  return (
    <span className={`rb-ico${ICONOS_APP.has(a.clave) ? ' es-real' : ''}`} style={estiloMarca(a)} aria-hidden="true">
      {ICONOS_APP.has(a.clave) ? <img src={`/v7/apps/${a.clave}.webp`} alt="" width="64" height="64" loading="lazy" decoding="async" />
        : Ico ? <Ico size={size} strokeWidth={1.6} /> : <b>{(a.marca.palabra ?? a.nombre).charAt(0)}</b>}
    </span>
  )
}


/** Foto de la tarjeta: la del socio, la de su zona o, si no hay, su color con el icono. Sin enlaces dentro (va en un botón). */
function FotoTarjeta({ a, id }: { a: App; id: Id }) {
  const socio = FOTO_SOCIO[a.clave]
  const zona = FOTO_EXP[a.clave]
  const src = socio ? `/v7/socios/${socio.foto}-600.webp` : zona ? `/v8/zonas/${zona}-600.webp` : ''
  return (
    <span className="rb-exp-foto" style={estiloMarca(a)} aria-hidden="true">
      {/* La tarjeta es aria-hidden (va dentro del botón); el alt es para los buscadores. */}
      {src && <img src={src} alt={socio ? socio.alt[id] : nombreZona(zona, id)} width="600" height="400" loading="lazy" decoding="async" />}
      {a.marca.palabra && <span className="rb-exp-kanji">{a.marca.palabra}</span>}
      <IconoSocio a={a} />
    </span>
  )
}

// ── Portada ──────────────────────────────────────────────────────────────

export function PortadaRB({ id }: { id: Id }) {
  const t = UI[id]
  const conVentaja = EXPERIENCIAS.filter((a) => acuerdoDe(a) !== 'lista').length
  const codigos = APPS.filter((a) => cuponDe(a) && a.descuento).length
  const musulman = EXPERIENCIAS.filter((a) => a.musulman).length
  const cifras: [number, string][] = [[EXPERIENCIAS.length, t.stats[0]], [conVentaja, t.stats[1]], [codigos, t.stats[2]], [musulman, t.stats[3]]]
  return (
    <section className="vn-portada rb-portada">
      <figure className="vn-portada-foto rb-portada-foto">
        <img src="/v8/zonas/kioto-fushimi-900.webp" srcSet="/v8/zonas/kioto-fushimi-900.webp 900w, /v8/zonas/kioto-fushimi-4k.webp 2400w"
          sizes="100vw" alt={t.foto} width="900" height="1125" fetchPriority="high" decoding="async" />
      </figure>
      <div className="vn-ancho rb-portada-txt">
        <p className="rb-ojo"><span className="rb-ojo-punto" />{t.ojo}</p>
        <h1>{t.h1}</h1>
        <p className="rb-rota" aria-hidden="true">
          <span>{t.con}</span>
          <RotatingText texts={t.rota} mainClassName="rb-rota-caja" effect="blur" transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }} highlight highlightColor="#e5533d" staggerDuration={0.008} rotationInterval={2600} splitBy={id === 'ar' ? 'words' : 'characters'} />
        </p>
        <p className="vn-lead rb-portada-sub">{t.sub}</p>
        <div className="vn-ctas rb-ctas">
          <StarBorder as="a" href="#experiencias" className="rb-cta" color="#ffb4a6" backgroundColor="#e5533d" textColor="#fff" radius={999} duration={5}>{t.exp}</StarBorder>
          <a className="vn-boton vn-boton-linea" href="#codigos">{t.cod}</a>
        </div>
        <dl className="rb-cifras">
          {cifras.map(([n, txt]) => (
            <div key={txt}>
              <dt>{txt}</dt>
              <dd><CountUp to={n} duration={1.6} className="rb-cifra" /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ── Las cuatro formas de acuerdo ─────────────────────────────────────────

export function ComoFunciona({ id, onElegir, onPase }: { id: Id; onElegir: (c: Acuerdo) => void; onPase: () => void }) {
  const t = UI[id]
  return (
    <div className="rb-como" id="como">
      <p className="rb-ojo"><span className="rb-ojo-punto" />{t.comoOjo}</p>
      <h3 className="vn-h3 vn-sube">{t.comoT}</h3>
      <p className="vn-lead vn-sube">{t.comoSub}</p>
      <ol className="rb-como-grid es-cuatro">
        {ORDEN_ACUERDO.map((c, n) => {
          const socios = EXPERIENCIAS.filter((a) => acuerdoDe(a) === c)
          const Ico = ICONO_ACUERDO[c]
          return (
            <li key={c} className="vn-sube">
              <SpotlightCard className={`rb-como-tarjeta es-${c}`} spotlightColor="#e5533d" proximity={0} intensity={0.55}>
                <span className="rb-como-n" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                <Ico className="rb-como-ico" size={30} strokeWidth={1.5} aria-hidden="true" />
                <h4>{ACU_T[id][c].t}</h4>
                <p>{ACU_T[id][c].d}</p>
                {c === 'mencion' && (
                  <ul className="rb-como-formas">
                    {(['comentario', 'nombre', 'logo'] as const).map((k) => { const I = ICONO_CANJE[k]; return <li key={k}><I size={14} aria-hidden="true" /> {CANJE_T[id][k].corto}</li> })}
                  </ul>
                )}
                <div className="rb-como-socios" aria-hidden="true">{socios.slice(0, 5).map((a) => <IconoSocio key={a.clave} a={a} size={16} />)}</div>
                <div className="rb-como-acciones">
                  <button type="button" className="rb-como-ver" onClick={() => onElegir(c)}>{socios.length} {t.socios} <ArrowUpRight size={16} aria-hidden="true" /></button>
                  {c === 'mencion' && <button type="button" className="rb-como-pase" onClick={onPase}><Ticket size={16} aria-hidden="true" /> {t.abrirPase}</button>}
                </div>
              </SpotlightCard>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ── Ficha emergente de una experiencia ───────────────────────────────────

function FichaEmergente({ a, id, ruta, onCerrar, onPase }: { a: App; id: Id; ruta: string; onCerrar: () => void; onPase: () => void }) {
  const t = UI[id]
  const tx = textoApp(a, id)
  const cerrarRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cerrarRef.current?.focus()
    // Con el pase abierto encima, Escape cierra solo el pase.
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape' && !paseAbierto()) onCerrar() }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onCerrar])
  return (
    <motion.div className="rb-modal-fondo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar}>
      <motion.div className="rb-modal" role="dialog" aria-modal="true" aria-labelledby={`rb-m-${a.clave}`} data-lenis-prevent style={estiloMarca(a)}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}>
        <button ref={cerrarRef} type="button" className="rb-modal-cerrar" onClick={onCerrar} aria-label={t.cerrar}><X size={20} /></button>
        <div className="rb-modal-cara">
          {FOTO_SOCIO[a.clave] ? <FotoSocio {...FOTO_SOCIO[a.clave]} alt={FOTO_SOCIO[a.clave].alt[id]} className="rb-modal-foto" sizes="(max-width: 760px) 100vw, 720px" />
            : FOTO_EXP[a.clave] && <FotoZona zona={FOTO_EXP[a.clave]} lang={id} className="rb-modal-foto" sizes="(max-width: 760px) 100vw, 720px" />}
          {a.marca.palabra && <span className="rb-exp-kanji" aria-hidden="true">{a.marca.palabra}</span>}
          <IconoSocio a={a} size={34} />
        </div>
        <div className="rb-modal-cuerpo">
          <p className="rb-modal-lugar">{a.ciudad ? ciudadesDe(a).map((c) => CIUDADES[c][id]).join(' · ') : 'Kansai'}{a.musulman && <span className="rb-sello-musulman"><Moon size={13} aria-hidden="true" /> {t.musulman}</span>}</p>
          <h3 id={`rb-m-${a.clave}`}><bdi dir="ltr">{a.nombre}</bdi></h3>
          <p className="rb-modal-que">{tx.que}</p>
          {a.vistazo && <div className="rb-modal-vistazo"><Vistazo a={a} id={id} /></div>}
          <AcuerdoSocio a={a} id={id} onPase={onPase} nivel="h4" />
          <p className="rb-modal-ventaja">{tx.ventaja}</p>
          <Link className="vn-enlace rb-modal-ficha" to={`${ruta}${a.clave}/`}>{GUIA[a.clave] ? t.solo : MAS[id]} <span aria-hidden="true">{id === 'ar' ? '←' : '→'}</span></Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Experiencias por zonas, con el acuerdo en cada tarjeta ───────────────

type Filtro = '' | 'musulman' | Acuerdo

export function ExperienciasRB({ id, ruta, filtroInicial, onPase }: { id: Id; ruta: string; filtroInicial: { acuerdo: Acuerdo | ''; n: number }; onPase: (a?: App) => void }) {
  const t = UI[id]
  const [filtro, setFiltro] = useState<Filtro>('')
  const [abiertos, setAbiertos] = useState<Grupo[]>([])
  const [abierta, setAbierta] = useState<App | null>(null)
  const volverA = useRef<HTMLElement | null>(null)

  // «Cuatro formas de acuerdo» elige una: se filtra aquí.
  useEffect(() => { if (filtroInicial.acuerdo) setFiltro(filtroInicial.acuerdo) }, [filtroInicial])

  const abrir = useCallback((a: App) => {
    volverA.current = document.activeElement as HTMLElement | null
    setAbierta(a)
    ;(window as unknown as { __vnLenis?: { stop: () => void } }).__vnLenis?.stop()
    document.documentElement.classList.add('rb-sin-scroll')
    if (location.hash.slice(1) !== a.clave) history.replaceState(null, '', `#${a.clave}`)
  }, [])
  const cerrar = useCallback(() => {
    setAbierta(null)
    ;(window as unknown as { __vnLenis?: { start: () => void } }).__vnLenis?.start()
    document.documentElement.classList.remove('rb-sin-scroll')
    if (location.hash) history.replaceState(null, '', location.pathname + location.search)
    volverA.current?.focus?.()
  }, [])
  // Llegar con #clave (desde el kit, otra página o WhatsApp) abre esa experiencia.
  useEffect(() => {
    const desdeHash = () => { const a = EXPERIENCIAS.find((x) => x.clave === location.hash.slice(1)); if (a) abrir(a) }
    desdeHash()
    window.addEventListener('hashchange', desdeHash)
    return () => { window.removeEventListener('hashchange', desdeHash); document.documentElement.classList.remove('rb-sin-scroll') }
  }, [abrir])

  const pasa = (a: App) => !filtro || (filtro === 'musulman' ? !!a.musulman : acuerdoDe(a) === filtro)
  const chip = (k: Filtro, txt: string, n: number) => (
    <button key={k || 'todas'} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(filtro === k && k ? '' : k)}>{txt} <small>{n}</small></button>
  )
  const hay = EXPERIENCIAS.some(pasa)
  return (
    <div className="vn-exp rb-exp">
      <div className="vn-chips rb-chips" role="group" aria-label={t.comoOjo}>
        {chip('', t.todas, EXPERIENCIAS.length)}
        {ORDEN_ACUERDO.map((c) => chip(c, ACU_T[id][c].corto, EXPERIENCIAS.filter((a) => acuerdoDe(a) === c).length))}
        {chip('musulman', t.musulman, EXPERIENCIAS.filter((a) => a.musulman).length)}
      </div>
      {!hay && <p className="rb-vacio">{t.ninguna}</p>}
      {GRUPOS.map((g) => {
        const lista = ORDENADAS.filter((a) => grupoDe(a) === g && pasa(a))
        if (!lista.length) return null
        const plegado = !filtro && !abiertos.includes(g) && lista.length > POR_GRUPO
        const zonas = g === 'japon' ? [...new Set(lista.map((a) => a.ciudad!))].map((c) => sinParentesis(CIUDADES[c][id])).join(' · ') : REGIONES.kansai[id]
        return (
          <div key={g} className="rb-grupo">
            <div className="rb-grupo-cab">
              <h3 className="rb-grupo-t">{GRUPO_T[id][g]} <span className="rb-grupo-n">{lista.length}</span></h3>
              <p className="rb-grupo-zonas">{zonas}</p>
            </div>
            <ul className="rb-exp-grid">
              {lista.map((a, n) => (
                <li key={a.clave} id={a.clave} className={plegado && n >= POR_GRUPO ? 'es-plegada' : undefined}>
                  <SpotlightCard className="rb-exp-tarjeta" spotlightColor={a.marca.fondo === '#ffffff' || a.marca.fondo.toLowerCase() === '#fff' ? '#e5533d' : a.marca.fondo} proximity={0} intensity={0.7} style={estiloMarca(a)}>
                    <button type="button" className="rb-exp-boton" onClick={() => abrir(a)} aria-haspopup="dialog">
                      <FotoTarjeta a={a} id={id} />
                      <span className="rb-exp-cuerpo">
                        <span className="rb-exp-lugar">{a.ciudad ? CIUDADES[a.ciudad][id] : 'Kansai'}{a.musulman && <span className="rb-sello-musulman" title={t.musulman}><Moon size={12} aria-hidden="true" /> {t.musulman}</span>}</span>
                        <b className="rb-exp-nombre"><bdi dir="ltr">{a.nombre}</bdi></b>
                        <span className="rb-exp-que">{textoApp(a, id).que}</span>
                        {a.vistazo && <span className="rb-exp-meta"><MetaFila a={a} id={id} /></span>}
                      </span>
                    </button>
                    <AcuerdoCorto a={a} id={id} onPase={() => onPase(a)} />
                  </SpotlightCard>
                </li>
              ))}
            </ul>
            {!filtro && lista.length > POR_GRUPO && (
              <p className="rb-mas">
                <button type="button" className="vn-boton vn-boton-linea" aria-expanded={!plegado}
                  onClick={() => setAbiertos((x) => (x.includes(g) ? x.filter((y) => y !== g) : [...x, g]))}>
                  {plegado ? t.verTodas.replace('{n}', String(lista.length)) : t.verMenos}
                </button>
              </p>
            )}
          </div>
        )
      })}
      <AnimatePresence>
        {abierta && <FichaEmergente key={abierta.clave} a={abierta} id={id} ruta={ruta} onCerrar={cerrar} onPase={() => onPase(abierta)} />}
      </AnimatePresence>
    </div>
  )
}

// ── Códigos ──────────────────────────────────────────────────────────────

export const CON_CODIGO = APPS.filter((a) => cuponDe(a) && a.descuento)

export function CodigosRB({ id, ruta, children }: { id: Id; ruta: string; children?: React.ReactNode }) {
  const t = UI[id]
  if (!CON_CODIGO.length) return null
  return (
    <div className="vn-cod rb-cod">
      <ul className="rb-billetes">
        {CON_CODIGO.map((a) => {
          const cupon = cuponDe(a)!
          const reglas = reglasDe(a.clave, id).slice(0, 1)
          return (
            <li key={a.clave} className="rb-billete vn-sube" style={estiloMarca(a)}>
              <div className="rb-billete-cab">
                <IconoSocio a={a} />
                <span><b dir="ltr">{a.nombre}</b><small>{CATEGORIAS[a.cat][id]}</small></span>
              </div>
              <p className="rb-billete-dto" dir="ltr">{menosDe(a)}</p>
              <div className="rb-billete-corte" aria-hidden="true" />
              <button type="button" className="rb-billete-cod" onClick={(e) => {
                const b = e.currentTarget
                navigator.clipboard?.writeText(cupon).then(() => { b.dataset.hecho = '1'; setTimeout(() => { delete b.dataset.hecho }, 1800) }).catch(() => window.prompt(t.copiar, cupon))
              }} aria-label={`${t.copiar}: ${cupon}`}>
                <DecryptedText text={cupon} animateOn="view" sequential revealDirection="start" speed={45} className="rb-billete-txt" encryptedClassName="rb-billete-cifrado" />
                <span className="rb-billete-copiar"><Copy size={15} aria-hidden="true" /><span className="rb-no-hecho">{t.copiar}</span><span className="rb-si-hecho">{t.copiado}</span></span>
              </button>
              <p className="rb-billete-pie">
                {a.caduca ? <small>{t.hasta} <bdi dir="ltr">{new Date(`${a.caduca}T12:00:00`).toLocaleDateString(id === 'ar' ? 'ar-EG' : id, { day: 'numeric', month: 'short', year: 'numeric' })}</bdi></small>
                  : reglas[0] ? <small>{reglas[0]}</small> : <small />}
                <a href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{t.ir}</a>
                <Link to={a.cat === 'experiencias' ? `#${a.clave}` : `${ruta}${a.clave}/`}>{t.ver}</Link>
              </p>
            </li>
          )
        })}
      </ul>
      {children}
    </div>
  )
}

// ── Tabla de acuerdos con todos los socios (parte 5) ─────────────────────

const zonaDe = (a: App): ZonaT => (a.cat !== 'experiencias' ? 'online' : enKansai(a) ? 'kansai' : 'japon')
const ordenFila = (a: App) => (a.cat !== 'experiencias' ? GRUPOS.length : GRUPOS.indexOf(grupoDe(a)))
/** Todas las experiencias y las apps con código: Kioto, Osaka, resto de Kansai, resto de Japón y online. */
export const FILAS_ACUERDOS = [...EXPERIENCIAS, ...APPS.filter((a) => a.cat !== 'experiencias' && cuponDe(a) && a.descuento)]
  .sort((x, y) => ordenFila(x) - ordenFila(y) || x.nombre.localeCompare(y.nombre, 'en'))
const FILAS_VISIBLES = 12
const sinAcentos = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function TablaAcuerdos({ id, ruta }: { id: Id; ruta: string }) {
  const t = TABLA_T[id]
  const [tipo, setTipo] = useState<Acuerdo | ''>('')
  const [zona, setZona] = useState<ZonaT | ''>('')
  const [q, setQ] = useState('')
  const [todos, setTodos] = useState(false)
  const zonaTxt = (a: App) => (a.cat !== 'experiencias' ? t.online : a.ciudad ? ciudadesDe(a).map((c) => CIUDADES[c][id]).join(' · ') : REGIONES.kansai[id])
  const filas = FILAS_ACUERDOS.filter((a) => (!tipo || acuerdoDe(a) === tipo) && (!zona || zonaDe(a) === zona) && (!q.trim() || sinAcentos(`${a.nombre} ${zonaTxt(a)}`).includes(sinAcentos(q.trim()))))
  // Sin filtro ni búsqueda, las primeras filas (Kioto y Osaka) y el botón para ver el resto.
  const plegada = !todos && !tipo && !zona && !q.trim() && filas.length > FILAS_VISIBLES
  const chip = (activo: boolean, alPulsar: () => void, txt: string, n: number, k: string) => (
    <button key={k} type="button" aria-pressed={activo} onClick={alPulsar}>{txt} <small>{n}</small></button>
  )
  return (
    <div className="ac-tabla-caja">
      <div className="ac-filtros">
        <label className="ac-buscar">
          <Search size={17} aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.buscar} aria-label={t.buscar} />
        </label>
      </div>
      <div className="vn-chips rb-chips" role="group" aria-label={t.cols[2]}>
        {chip(tipo === '', () => setTipo(''), t.todos, FILAS_ACUERDOS.length, 'todos')}
        {ORDEN_ACUERDO.map((c) => chip(tipo === c, () => setTipo(tipo === c ? '' : c), ACU_T[id][c].corto, FILAS_ACUERDOS.filter((a) => acuerdoDe(a) === c).length, c))}
      </div>
      <div className="vn-chips rb-chips" role="group" aria-label={t.cols[1]}>
        {chip(zona === '', () => setZona(''), t.zonas.todas, FILAS_ACUERDOS.length, 'todas')}
        {(['kansai', 'japon', 'online'] as ZonaT[]).map((z) => chip(zona === z, () => setZona(zona === z ? '' : z), t.zonas[z], FILAS_ACUERDOS.filter((a) => zonaDe(a) === z).length, z))}
      </div>
      {filas.length === 0 ? <p className="ac-tabla-vacio">{t.vacio}</p> : (
        <table className="ac-tabla">
          <caption>{t.mostrando(filas.length, FILAS_ACUERDOS.length)}</caption>
          <thead><tr>{t.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {(plegada ? filas.slice(0, FILAS_VISIBLES) : filas).map((a) => {
              const c = acuerdoDe(a)
              const Ico = ICONO_ACUERDO[c]
              const reglas = reglasDe(a.clave, id).slice(0, 2)
              const iso = actualizadoDe(a.clave)
              const menos = menosDe(a)
              return (
                <tr key={a.clave}>
                  <th scope="row" className="ac-tabla-socio"><Link to={`${ruta}${a.clave}/`}><IconoSocio a={a} size={16} /><bdi dir="ltr">{a.nombre}</bdi></Link></th>
                  <td className="ac-tabla-zona" data-th={t.cols[1]}>{zonaTxt(a)}</td>
                  <td data-th={t.cols[2]}>
                    <span className={`ac-chip es-${c}`}><Ico size={14} aria-hidden="true" /> {ACU_T[id][c].corto}</span>
                    {menos && <b className="ac-chip-dto" dir="ltr">{menos}{c === 'codigo' && <code> {cuponDe(a)}</code>}</b>}
                  </td>
                  <td className="ac-tabla-cond" data-th={t.cols[3]}>{reglas.length ? <ul>{reglas.map((r) => <li key={r}>{r}</li>)}</ul> : textoApp(a, id).ventaja}</td>
                  <td className="ac-tabla-fecha" data-th={t.cols[4]}>{iso ? <time dateTime={iso}>{fechaCorta(iso, id)}</time> : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {!tipo && !zona && !q.trim() && filas.length > FILAS_VISIBLES && (
        <p className="rb-mas">
          <button type="button" className="vn-boton vn-boton-linea" aria-expanded={!plegada} onClick={() => setTodos(!todos)}>{plegada ? t.verTodos(filas.length) : t.verMenos}</button>
        </p>
      )}
    </div>
  )
}

// ── Te lo digo claro ─────────────────────────────────────────────────────

export function ClaroRB({ id }: { id: Id }) {
  return (
    <section className="rb-claro" aria-label={UI[id].claro.split(':')[0]}>
      <div className="vn-ancho">
        <ScrollReveal baseOpacity={0.12} enableBlur baseRotation={2} blurStrength={6} containerClassName="rb-claro-caja" textClassName="rb-claro-txt">
          {UI[id].claro}
        </ScrollReveal>
      </div>
    </section>
  )
}

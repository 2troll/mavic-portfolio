// Escaparate de experiencias de la página de ventajas: los socios locales (talleres,
// kimono, samuráis, cocina) van aparte de las apps, en tarjetas grandes con su ciudad,
// sello de «apto para musulmanes» y de «ventaja con Tony», y un botón para reservar
// conmigo por WhatsApp. Es lo que no encuentran en Klook: por eso va lo primero.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { APPS, CIUDADES, cuponDe, enlaceDe, type Ciudad } from './datosVentajas'
import { ICONOS_APP } from './logosMarcas'
import { textoApp, MAS } from './FichaVentaja'
import { GUIAS } from './contenido'

type Id = 'es' | 'en' | 'ar' | 'ru'
type Filtro = '' | 'musulman' | 'conTony' | Ciudad

const T: Record<Id, { ante: string; titulo: string; sub: string; todas: string; musulman: string; conTony: string; abrir: string; reservar: string; msg: string; copiar: string; copiado: string }> = {
  es: { ante: 'Con mis socios', titulo: 'Experiencias que no encuentras en una app', sub: 'Talleres, kimonos, samuráis y cocina que conozco en persona. Con varios tienes una ventaja por venir de mi parte, y si estamos de tour lo encajo en la ruta.', todas: 'Todas', musulman: 'Apto para musulmanes', conTony: 'Ventaja con Tony', abrir: 'Ver su web', reservar: 'Resérvalo conmigo', msg: 'Hola Tony, me interesa {n}. ¿Me ayudas a reservarlo?', copiar: 'Copiar', copiado: 'Copiado' },
  en: { ante: 'With my partners', titulo: 'Experiences you won’t find in an app', sub: 'Workshops, kimono, samurai and cooking I know in person. With several of them you get a perk for coming through me, and if we tour together I fit it into the route.', todas: 'All', musulman: 'Muslim-friendly', conTony: 'Perk with Tony', abrir: 'Their website', reservar: 'Book it with me', msg: 'Hi Tony, I’m interested in {n}. Can you help me book it?', copiar: 'Copy', copiado: 'Copied' },
  ar: { ante: 'مع شركائي', titulo: 'تجارب لن تجدها في أي تطبيق', sub: 'ورش وكيمونو وساموراي وطبخ أعرفها شخصيًا. مع عدد منها تحصل على ميزة لأنك قادم من طرفي، وإن كنا في جولة معًا أضعها في المسار.', todas: 'الكل', musulman: 'مناسب للمسلمين', conTony: 'ميزة مع طوني', abrir: 'موقعهم', reservar: 'احجزه معي', msg: 'مرحبًا طوني، أنا مهتم بـ {n}. هل تساعدني في الحجز؟', copiar: 'نسخ', copiado: 'تم النسخ' },
  ru: { ante: 'С нашими партнёрами', titulo: 'Впечатления, которых нет в приложениях', sub: 'Мастерские, кимоно, самураи и кулинария, которые мы знаем лично. У некоторых есть бонус, если вы пришли от нас, а на экскурсии мы впишем это в маршрут.', todas: 'Все', musulman: 'Подходит мусульманам', conTony: 'Бонус от нас', abrir: 'Их сайт', reservar: 'Забронировать с нами', msg: 'Здравствуйте! Меня интересует {n}. Поможете забронировать?', copiar: 'Копировать', copiado: 'Скопировано' },
}

const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')
// Las de ventaja propia y las aptas para musulmanes, primero: es lo que más vende.
const ORDENADAS = [...EXPERIENCIAS].sort((a, b) => Number(!!b.conTony) + Number(!!b.musulman) - (Number(!!a.conTony) + Number(!!a.musulman)))

function Copiar({ texto, t }: { texto: string; t: (typeof T)[Id] }) {
  const [hecho, setHecho] = useState(false)
  return (
    <button type="button" className="vt-exp-copiar" onClick={() => {
      navigator.clipboard?.writeText(texto).then(() => { setHecho(true); setTimeout(() => setHecho(false), 1600) }).catch(() => {})
    }}>{hecho ? t.copiado : t.copiar}</button>
  )
}

export default function Escaparate({ id, ruta }: { id: Id; ruta: string }) {
  const t = T[id]
  const [filtro, setFiltro] = useState<Filtro>('')
  const numero = (id === 'ru' ? GUIAS.larion : GUIAS.tony).wa
  const ciudades = (Object.keys(CIUDADES) as Ciudad[]).filter((c) => EXPERIENCIAS.some((a) => a.ciudad === c))
  const pasa = (a: (typeof APPS)[number]) => !filtro || (filtro === 'musulman' ? a.musulman : filtro === 'conTony' ? a.conTony : a.ciudad === filtro)
  const chips: { k: Filtro; txt: string; n: number }[] = [
    { k: '', txt: t.todas, n: EXPERIENCIAS.length },
    { k: 'musulman', txt: t.musulman, n: EXPERIENCIAS.filter((a) => a.musulman).length },
    { k: 'conTony', txt: t.conTony, n: EXPERIENCIAS.filter((a) => a.conTony).length },
    ...ciudades.map((c) => ({ k: c as Filtro, txt: CIUDADES[c][id], n: EXPERIENCIAS.filter((a) => a.ciudad === c).length })),
  ]
  const flecha = id === 'ar' ? '←' : '→'

  return (
    <section className="vt-exp" id="experiencias" aria-labelledby="vt-exp-t">
      <div className="vt-exp-dentro">
        <p className="vt-exp-ante">{t.ante} · {EXPERIENCIAS.length}</p>
        <h2 id="vt-exp-t">{t.titulo}</h2>
        <p className="vt-exp-sub">{t.sub}</p>

        <nav className="vt-exp-chips" aria-label={t.titulo}>
          {chips.map((c) => (
            <button key={c.k || 'todas'} type="button" aria-pressed={filtro === c.k} onClick={() => setFiltro(c.k)}
              className={c.k === 'musulman' ? 'es-musulman' : c.k === 'conTony' ? 'es-tony' : undefined}>
              {c.txt} <small>{c.n}</small>
            </button>
          ))}
        </nav>

        <div className="vt-exp-rejilla">
          <AnimatePresence initial={false} mode="popLayout">
            {ORDENADAS.filter(pasa).map((a) => {
              const tx = textoApp(a, id)
              const cupon = cuponDe(a)
              const wa = `https://wa.me/${numero}?text=${encodeURIComponent(t.msg.replace('{n}', a.nombre))}`
              return (
                <motion.article key={a.clave} id={a.clave} className="vt-exp-tarjeta" layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }}>
                  <div className="vt-exp-cara">
                    {ICONOS_APP.has(a.clave)
                      ? <img className="vt-exp-logo" src={`/v7/apps/${a.clave}.webp`} alt="" width="96" height="96" loading="lazy" decoding="async" />
                      : <span className={`vt-exp-kanji${(a.marca.palabra ?? '').length > 3 ? ' es-largo' : ''}`} aria-hidden="true">{a.marca.palabra ?? a.nombre.slice(0, 2)}</span>}
                    {a.ciudad && <span className="vt-exp-ciudad">{CIUDADES[a.ciudad][id]}</span>}
                  </div>
                  <div className="vt-exp-cuerpo">
                    {(a.musulman || a.conTony) && (
                      <p className="vt-exp-sellos">
                        {a.musulman && <span className="es-musulman">{t.musulman}</span>}
                        {a.conTony && <span className="es-tony">{t.conTony}</span>}
                      </p>
                    )}
                    <h3><bdi dir="ltr">{a.nombre}</bdi></h3>
                    <p className="vt-exp-que">{tx.que}</p>
                    <p className="vt-exp-ventaja">{tx.ventaja}</p>
                    {cupon && <p className="vt-exp-cupon"><bdi dir="ltr"><code>{cupon}</code></bdi><Copiar texto={cupon} t={t} /></p>}
                    <div className="vt-exp-acciones">
                      <a className="vt-exp-reservar" href={wa} target="_blank" rel="noopener noreferrer">{t.reservar}</a>
                      <a className="vt-exp-web" href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{t.abrir} <span aria-hidden="true">{flecha}</span></a>
                      <Link className="vt-exp-mas" to={`${ruta}${a.clave}/`}>{MAS[id]}</Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

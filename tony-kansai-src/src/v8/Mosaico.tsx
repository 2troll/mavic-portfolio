// Tarjetas de tours de la página de cada guía: una por ciudad, con lo que hace
// falta para decidir (duración, precio y lo más destacado) y dos salidas:
// reservar por WhatsApp con la ciudad ya escrita, o ver la página de la ciudad.
// Duración y precio salen de los tramos de cada ruta (datosRutas): no se desfasan.
import { Link } from 'react-router-dom'
import { foto } from '../v7/foto'
import { GUIAS } from '../v7/contenido'
import { META, PRECIO } from '../v7/datosRutas'
import type { Tramo } from '../v7/datosRutas'
import { IconoWa } from '../v7/IconoWa'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY } from './ciudades'
import type { CiudadId, Lengua } from './ciudades'
import './v8.css'

const TITULO: Record<Lengua, string> = { es: 'Elige tu tour', en: 'Choose your tour', ar: 'اختر جولتك', ru: 'Выберите тур' }
const SUB: Record<Lengua, string> = {
  es: 'Un día privado en cada ciudad, solo con tu grupo. El precio es por grupo, hasta 6 personas.',
  en: 'A private day in each city, just your party. Prices are per group, up to 6 people.',
  ar: 'يوم خاص في كل مدينة لمجموعتك وحدها. السعر للمجموعة، حتى 6 أشخاص.',
  ru: 'Частный день в каждом городе, только ваша компания. Цена за группу до 6 человек.',
}
const ET: Record<Lengua, { reservar: string; ver: string; desde: string; destaca: string; msg: (g: string, c: string) => string }> = {
  es: { reservar: 'Reservar', ver: 'Ver la ciudad', desde: 'desde', destaca: 'Lo más destacado', msg: (g, c) => `Hola, ${g}. Me interesa un tour privado en ${c}. ¿Qué fechas tienes libres?` },
  en: { reservar: 'Book', ver: 'See the city', desde: 'from', destaca: 'Highlights', msg: (g, c) => `Hi ${g}, I'm interested in a private tour in ${c}. Which dates are you free?` },
  ar: { reservar: 'احجز', ver: 'اكتشف المدينة', desde: 'ابتداءً من', destaca: 'أبرز المحطات', msg: (g, c) => `مرحباً ${g}، أودّ جولة خاصة في ${c}. ما المواعيد المتاحة لديك؟` },
  ru: { reservar: 'Забронировать', ver: 'Подробнее о городе', desde: 'от', destaca: 'Главное', msg: (g, c) => `Здравствуйте, ${g}! Интересует частный тур: ${c}. Какие даты свободны?` },
}
const HORAS: Record<Tramo, Record<Lengua, string>> = {
  medio: { es: '4 h', en: '4 h', ar: '4 ساعات', ru: '4 ч' },
  completo: { es: '8 h', en: '8 h', ar: '8 ساعات', ru: '8 ч' },
  lejos: { es: 'día completo', en: 'full day', ar: 'يوم كامل', ru: 'полный день' },
}
const O: Record<Lengua, string> = { es: ' u ', en: ' or ', ar: ' أو ', ru: ' или ' }
const NOMBRE: Record<'tony' | 'larion', Record<Lengua, string>> = {
  tony: { es: 'Tony', en: 'Tony', ar: 'طوني', ru: 'Тони' },
  larion: { es: 'Larion', en: 'Larion', ar: 'لاريون', ru: 'Ларион' },
}

/** Foto de portada de cada tarjeta: la más reconocible de la ciudad, no la
 *  primera zona (en Kobe era la mezquita cruzada de cables; en Hiroshima, la
 *  Cúpula, que no es la cara de una tarjeta de «reservar»). */
export const PORTADA: Record<CiudadId, string> = {
  osaka: 'osaka-dotonbori', kyoto: 'kioto-fushimi', nara: 'nara-parque', kobe: 'kobe-harbor',
  himeji: 'himeji-castillo', hiroshima: 'hiroshima-miyajima', beyond: 'lejos-kumano',
}

/** Tramos de la ciudad: los de su ruta; «Más lejos» no tiene maqueta y es excursión lejana. */
export function tramos(id: CiudadId): Tramo[] {
  const ruta = CIUDADES[id].diorama
  return [...new Set(ruta ? META[ruta].tramos : (['lejos'] as Tramo[]))]
}

function yen(n: number, lang: Lengua) {
  const f = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'es-ES').format(n)
  return lang === 'ru' ? `${f} ¥` : lang === 'ar' ? `${f} ين` : `¥${f}`
}

export function Mosaico({ lang, guia, prefijo }: { lang: Lengua; guia: 'tony' | 'larion'; prefijo: string }) {
  const lista = guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY
  const et = ET[lang]
  return (
    <section id="ciudades" className="v7-seccion v9-tours">
      <h2>{TITULO[lang]}</h2>
      <p className="v7-entradilla">{SUB[lang]}</p>
      {/* Índice de revista: una fila por ciudad, con su foto, lo que dura, desde
          cuánto y las dos salidas. Se lee de un vistazo, de arriba abajo. */}
      <ul className="v9-indice">
        {lista.map((id) => {
          const c = CIUDADES[id]
          const t = tramos(id)
          const desde = Math.min(...t.map((x) => PRECIO[x]))
          const wa = `https://wa.me/${GUIAS[guia].wa}?text=${encodeURIComponent(et.msg(NOMBRE[guia][lang], c.nombre[lang]))}`
          return (
            <li key={id} className="v9-fila">
              <Link to={`${prefijo}/${id}/`} className="v9-fila-foto" tabIndex={-1} aria-hidden="true">
                <img loading="lazy" {...foto(`/v8/zonas/${PORTADA[id]}.jpg`, '(max-width: 700px) 100vw, 240px')} alt="" decoding="async" />
              </Link>
              <div className="v9-fila-nombre">
                <span className="v9-fila-kanji" lang="ja" aria-hidden="true">{c.kanji}</span>
                <h3><Link to={`${prefijo}/${id}/`}>{c.nombre[lang]}</Link></h3>
                <p><span className="v7-sr">{et.destaca}: </span>{c.zonas.slice(0, 3).map((z) => z.nombre[lang]).join(lang === 'ar' ? '، ' : ', ')}</p>
              </div>
              <p className="v9-fila-dato">{t.map((x) => HORAS[x][lang]).join(O[lang])}</p>
              <p className="v9-fila-dato">{et.desde} <strong>{yen(desde, lang)}</strong></p>
              <div className="v9-fila-acciones">
                <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer"
                  aria-label={`${et.reservar}: ${c.nombre[lang]} (WhatsApp)`}
                  onClick={() => window.gtag?.('event', 'generate_lead', { pagina: `tours-${id}`, canal: 'whatsapp_tarjeta' })}>
                  <IconoWa /> {et.reservar}
                </a>
                <Link className="v9-enlace" to={`${prefijo}/${id}/`}>{et.ver}</Link>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

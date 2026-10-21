// «Ve tú solo»: la parte de la ficha de ventajas que lleva al cliente hasta la
// tienda sin Tony. Billete de ruta (estación → tienda), tarjeta troquelada para
// enseñar al llegar y bandeja de frases que se oyen en japonés.
// Estilo sacado de dqnamo/kitchen (billete, sello, bandeja), rehecho a mano.

import { useCallback, useEffect, useRef, useState } from 'react'
import { troquel, useBilletes } from './Cocina'
import { AL_TAXI, FRASES_COMUNES, GUIA, type Frase, type IdG, type Lugar } from './datosVentajasGuia'

const BORDE = troquel(14, 9, 2.2)

const L: Record<IdG, {
  titulo: string; sub: string; llegar: string; estacion: string; salida: string; aPie: (n: number) => string
  horario: string; cierra: string; reserva: string; reservas: Record<NonNullable<Lugar['reserva']>, string>
  mapa: string; taxi: string; ensena: string; ensenaSub: string; grande: string; cerrar: string
  frases: string; frasesSub: string; oir: string; contacto: string; web: string; sinDir: string; conTony: string; escribeme: string; fuente: string
}> = {
  es: {
    titulo: 'Ve tú solo, paso a paso', sub: 'Todo lo que necesitas para llegar, entrar y que te entiendan, aunque no hables japonés.',
    llegar: 'Cómo llegar', estacion: 'Estación', salida: 'Salida', aPie: (n) => `${n} min a pie`,
    horario: 'Horario', cierra: 'Cierra', reserva: 'Reserva', reservas: { obligatoria: 'Obligatoria', recomendada: 'Recomendada', no: 'No hace falta' },
    mapa: 'Abrir en Google Maps', taxi: 'Enseñar al taxista',
    ensena: 'Enséñalo al llegar', ensenaSub: 'Pon el móvil en pantalla completa y enséñaselo a quien te atienda.',
    grande: 'Pantalla completa', cerrar: 'Cerrar',
    frases: 'Frases que te van a servir', frasesSub: 'Toca el altavoz para oír cómo suena. Si no te sale, enseña la frase escrita.',
    oir: 'Escuchar', contacto: 'Reservar o preguntar', web: 'Web', sinDir: 'No publican la dirección: te la dan al reservar.',
    conTony: 'Esta ventaja la consigo yo: escríbeme y te lo reservo. El sitio en sí lo puedes visitar por tu cuenta.', escribeme: 'Escríbeme por WhatsApp', fuente: 'Fuente',
  },
  en: {
    titulo: 'Go on your own, step by step', sub: 'Everything you need to get there, walk in and be understood, even without Japanese.',
    llegar: 'How to get there', estacion: 'Station', salida: 'Exit', aPie: (n) => `${n} min walk`,
    horario: 'Hours', cierra: 'Closed', reserva: 'Booking', reservas: { obligatoria: 'Required', recomendada: 'Recommended', no: 'Not needed' },
    mapa: 'Open in Google Maps', taxi: 'Show the taxi driver',
    ensena: 'Show this when you arrive', ensenaSub: 'Go full screen and show your phone to the staff.',
    grande: 'Full screen', cerrar: 'Close',
    frases: 'Phrases you will use', frasesSub: 'Tap the speaker to hear it. If it does not come out, just show the written phrase.',
    oir: 'Listen', contacto: 'Book or ask', web: 'Website', sinDir: 'They do not publish the address: you get it when you book.',
    conTony: 'I arrange this perk myself: message me and I will book it. You can visit the place itself on your own.', escribeme: 'Message me on WhatsApp', fuente: 'Source',
  },
  ar: {
    titulo: 'اذهب وحدك، خطوة بخطوة', sub: 'كل ما تحتاجه لتصل وتدخل ويفهمك الموظفون، حتى دون أن تتكلم اليابانية.',
    llegar: 'كيف تصل', estacion: 'المحطة', salida: 'المخرج', aPie: (n) => `${n} دقائق مشيًا`,
    horario: 'المواعيد', cierra: 'يُغلق', reserva: 'الحجز', reservas: { obligatoria: 'إلزامي', recomendada: 'يُنصح به', no: 'غير ضروري' },
    mapa: 'افتح في خرائط Google', taxi: 'أظهره لسائق التاكسي',
    ensena: 'أظهر هذا عند وصولك', ensenaSub: 'افتح ملء الشاشة وأظهر هاتفك للموظف.',
    grande: 'ملء الشاشة', cerrar: 'إغلاق',
    frases: 'عبارات ستحتاجها', frasesSub: 'المس مكبّر الصوت لتسمعها. وإن لم تستطع نطقها، أظهر العبارة مكتوبة.',
    oir: 'استمع', contacto: 'احجز أو اسأل', web: 'الموقع', sinDir: 'لا ينشرون العنوان: يعطونك إياه عند الحجز.',
    conTony: 'هذه الميزة أحجزها أنا: راسلني وأحجزها لك. ويمكنك زيارة المكان نفسه وحدك.', escribeme: 'راسلني على واتساب', fuente: 'المصدر',
  },
  ru: {
    titulo: 'Самостоятельно, шаг за шагом', sub: 'Всё, чтобы дойти, войти и объясниться, даже без японского.',
    llegar: 'Как добраться', estacion: 'Станция', salida: 'Выход', aPie: (n) => `${n} мин пешком`,
    horario: 'Часы работы', cierra: 'Выходной', reserva: 'Бронь', reservas: { obligatoria: 'Обязательна', recomendada: 'Желательна', no: 'Не нужна' },
    mapa: 'Открыть в Google Maps', taxi: 'Показать таксисту',
    ensena: 'Покажите это на месте', ensenaSub: 'Откройте на весь экран и покажите сотруднику.',
    grande: 'На весь экран', cerrar: 'Закрыть',
    frases: 'Полезные фразы', frasesSub: 'Нажмите на динамик, чтобы услышать. Если не получается — просто покажите фразу.',
    oir: 'Слушать', contacto: 'Забронировать или спросить', web: 'Сайт', sinDir: 'Адрес не публикуют: его дают при бронировании.',
    conTony: 'Эту привилегию я организую сам: напишите мне, и я забронирую. Само место можно посетить самостоятельно.', escribeme: 'Написать в WhatsApp', fuente: 'Источник',
  },
}

/** Lee en japonés con la voz del sistema; si no hay voz japonesa, no hace nada. */
function useVoz() {
  const [hay, setHay] = useState(false)
  useEffect(() => {
    if (typeof speechSynthesis === 'undefined') return
    const mira = () => setHay(speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith('ja')))
    mira()
    speechSynthesis.addEventListener('voiceschanged', mira)
    return () => speechSynthesis.removeEventListener('voiceschanged', mira)
  }, [])
  const di = (texto: string) => {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(texto.replace(/＿+/g, ''))
    u.lang = 'ja-JP'; u.rate = 0.85
    const v = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith('ja'))
    if (v) u.voice = v
    speechSynthesis.speak(u)
  }
  return { hay, di }
}

const Altavoz = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm-2.5-8.8v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" fill="currentColor" /></svg>
)

/** Lo que se enseña a pantalla completa: letra enorme para leer de lejos. */
function Pantalla({ lineas, id, cerrar, l }: { lineas: Frase[]; id: IdG; cerrar: () => void; l: (typeof L)[IdG] }) {
  const boton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    boton.current?.focus()
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
    document.addEventListener('keydown', tecla)
    document.documentElement.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', tecla); document.documentElement.style.overflow = '' }
  }, [cerrar])
  return (
    <div className="gt-pantalla" role="dialog" aria-modal="true" onClick={cerrar}>
      <div className="gt-pantalla-papel" onClick={(e) => e.stopPropagation()}>
        {lineas.map((x) => (
          <p key={x.ja}><b lang="ja" dir="ltr">{x.ja}</b><small dir="auto">{x.t[id]}</small></p>
        ))}
        <button ref={boton} type="button" className="gt-pantalla-cerrar" onClick={cerrar}>{l.cerrar}</button>
      </div>
    </div>
  )
}

function Billete({ lu, nombre, id, l, taxi }: { lu: Lugar; nombre: string; id: IdG; l: (typeof L)[IdG]; taxi: (lu: Lugar) => void }) {
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lu.mapa)}`
  return (
    <article className="gt-billete ck-billete">
      <div className="gt-billete-ruta">
        {lu.estacion ? (
          <div className="gt-parada">
            <small>{l.estacion}</small>
            <b lang="ja" dir="ltr">{lu.estacion.ja}</b>
            <span dir="ltr">{lu.estacion.romaji}</span>
            <em dir="ltr">{lu.estacion.linea}</em>
          </div>
        ) : <div className="gt-parada" />}
        <div className="gt-camino" aria-hidden="true">
          <i />
          {lu.minutos != null && <span>{l.aPie(lu.minutos)}</span>}
          {lu.salida && <span>{l.salida} {lu.salida}</span>}
        </div>
        <div className="gt-parada gt-destino">
          <small dir="ltr">{lu.nombre ?? nombre}</small>
          <b lang="ja" dir="ltr">{lu.dirJa}</b>
          <span dir="ltr">{lu.dirRomaji}</span>
        </div>
      </div>
      {lu.minutos != null && <p className="ck-solo-lector">{l.aPie(lu.minutos)}{lu.salida ? `, ${l.salida} ${lu.salida}` : ''}</p>}
      <div className="gt-talon">
        <dl>
          {lu.horario && <div><dt>{l.horario}</dt><dd dir="ltr">{lu.horario}</dd></div>}
          {lu.cierra && <div><dt>{l.cierra}</dt><dd>{lu.cierra[id]}</dd></div>}
          {lu.reserva && <div><dt>{l.reserva}</dt><dd>{l.reservas[lu.reserva]}</dd></div>}
        </dl>
        <div className="gt-talon-botones">
          <a className="gt-boton gt-boton-tinta" href={mapa} target="_blank" rel="noopener noreferrer">{l.mapa}</a>
          <button type="button" className="gt-boton" onClick={() => taxi(lu)}>{l.taxi}</button>
        </div>
        <a className="gt-fuente" href={lu.fuente} target="_blank" rel="noopener noreferrer">{l.fuente}</a>
      </div>
    </article>
  )
}

export function GuiaTienda({ clave, nombre, id, wa }: { clave: string; nombre: string; id: IdG; wa: string }) {
  const g = GUIA[clave]
  const l = L[id]
  const raiz = useRef<HTMLElement>(null)
  const [grande, setGrande] = useState<Frase[] | null>(null)
  const { hay, di } = useVoz()
  const cerrar = useCallback(() => setGrande(null), [])
  useBilletes(raiz)
  if (!g) return null
  const frases = [...g.frases, ...FRASES_COMUNES]
  const c = g.contacto

  return (
    <section ref={raiz} className="vt-ficha-bloque gt">
      <header className="gt-cabeza">
        <span className="gt-kanji" lang="ja" aria-hidden="true">一人旅</span>
        <h2>{l.titulo}</h2>
        <p>{l.sub}</p>
      </header>

      {g.soloConTony && (
        <p className="gt-aviso">{l.conTony} <a href={wa} target="_blank" rel="noopener noreferrer">{l.escribeme}</a></p>
      )}

      <h3 className="gt-sub">{l.llegar}</h3>
      {g.lugares.length > 0
        ? <div className="gt-billetes">{g.lugares.map((lu) => <Billete key={lu.dirJa} lu={lu} nombre={nombre} id={id} l={l} taxi={(x) => setGrande([AL_TAXI, { ja: x.dirJa, romaji: x.dirRomaji, t: { es: x.dirRomaji, en: x.dirRomaji, ar: x.dirRomaji, ru: x.dirRomaji } }])} />)}</div>
        : <p className="gt-nota">{l.sinDir}</p>}

      <h3 className="gt-sub">{l.ensena}</h3>
      <div className="gt-sello">
        <div className="gt-sello-papel" style={{ clipPath: BORDE }}>
          <span className="gt-matasellos" aria-hidden="true">{nombre}</span>
          {g.tarjeta.map((x) => (
            <p key={x.ja}><b lang="ja" dir="ltr">{x.ja}</b><small dir="auto">{x.t[id]}</small></p>
          ))}
        </div>
      </div>
      <p className="gt-nota">{l.ensenaSub}</p>
      <button type="button" className="gt-boton gt-boton-tinta" onClick={() => setGrande(g.tarjeta)}>{l.grande}</button>

      <h3 className="gt-sub">{l.frases}</h3>
      <p className="gt-nota">{l.frasesSub}</p>
      <ul className="gt-bandeja">
        {frases.map((x) => (
          <li key={x.ja} className="gt-frase">
            <div>
              <b lang="ja" dir="ltr">{x.ja}</b>
              <span dir="ltr">{x.romaji}</span>
              <small dir="auto">{x.t[id]}</small>
            </div>
            {hay && <button type="button" className="gt-oir" onClick={() => di(x.ja)} aria-label={`${l.oir}: ${x.t[id]}`}><Altavoz /></button>}
          </li>
        ))}
      </ul>

      {c && (
        <div className="gt-contacto">
          <h3 className="gt-sub">{l.contacto}</h3>
          <ul>
            {c.web && <li><a href={c.web} target="_blank" rel="noopener noreferrer">{l.web} ↗</a></li>}
            {c.tel && <li><a href={`tel:+81${c.tel.replace(/^0/, '').replace(/-/g, '')}`} dir="ltr">{c.tel}</a></li>}
            {c.correo && <li><a href={`mailto:${c.correo}`} dir="ltr">{c.correo}</a></li>}
          </ul>
        </div>
      )}

      {grande && <Pantalla lineas={grande} id={id} cerrar={cerrar} l={l} />}
    </section>
  )
}

// Bloque de los viajes a la RPDC (1-11-2026), cargado aparte para no engordar la página.
// Desde el 6-11-2026 acompaña Max (Макс, pasaporte ruso), no Larion; grupos de 15,
// precio por consulta (sin dólares) y contacto por el Telegram de Tony. Ver scripts/kndr.mjs.
//  · Lenis + GSAP ScrollTrigger: la foto de Pionyang se abre al bajar y el titular
//    sube por líneas (SplitText), como pide la receta de la casa.
//  · React Bits gratis: CircularText (sello VIP que gira) y Magnet (botón imán).
//  · dqnamo, rehecho: billete de embarque con inclinación y foil, bandeja de
//    tarjetas y sellos troquelados con las fotos de cada destino.
// Con «reducir movimiento» no se anima nada y se ve el estado final.
import { IconoTg } from './IconoWa'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import CircularText from './reactbits/CircularText'
import Magnet from './reactbits/Magnet'
import { useBilletes, Contador, troquel } from './Cocina'
import './kndr-vip.css'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

type Lang = 'ru' | 'en'
const quieto = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const FOTO = (k: string, w = 1080) => `/ru/kndr/foto/${k}-${w}.webp`
const TROQUEL = troquel(9, 11, 2.6)

// Mismos tours que scripts/kndr.mjs (sin precio: «по запросу»).
const DESTINOS: { yol: string; foto: string; dias: number; ru: string; en: string; fecha: string }[] = [
  { yol: 'rozhdestvo-v-phenyane', foto: 'plaza', dias: 5, ru: 'Новый год в Пхеньяне', en: 'New Year in Pyongyang', fecha: '01.2027' },
  { yol: 'masikryon', foto: 'masikryong', dias: 8, ru: 'Лыжи в Масикрёне', en: 'Masikryong ski resort', fecha: '02.2027' },
  { yol: 'myohyan', foto: 'myohyang', dias: 6, ru: 'Горы Мёхян', en: 'Mount Myohyang', fecha: '03.2027' },
  { yol: 'den-solntsa', foto: 'pyongyang', dias: 5, ru: 'День Солнца', en: 'Day of the Sun', fecha: '04.2027' },
  { yol: 'pektusan', foto: 'paektu', dias: 8, ru: 'Гора Пэктусан', en: 'Mount Paektu', fecha: '2027' },
  { yol: 'vonsan-kalma', foto: 'wonsan', dias: 7, ru: 'Море в Вонсан-Кальме', en: 'Wonsan-Kalma beach', fecha: 'VII–VIII' },
]

const T = {
  ru: {
    ceja: 'Группа 15 человек · можно парами · 2027',
    titulo: ['Северная Корея.', 'Группой, с Максом.'],
    lead: 'Набираем группу 15 человек — можно парами. Макс, гражданин России с российским паспортом, встречает группу во Владивостоке, летит с вами в Пхеньян и остаётся с группой до возвращения.',
    circulo: 'ГРУППА ✦ ПХЕНЬЯН ✦ 2027 ✦ МАКС ✦ ',
    pase: 'Посадочный талон', pasajero: 'Пассажир', pasajeroV: 'Вы + Макс', clase: 'Класс', claseV: 'бизнес*', vuelo: 'Рейс', grupo: 'Цена', grupoV: 'по запросу', desde: 'мест в группе',
    nota: '* бизнес-класс Air Koryo при наличии мест. Ориентир: базовый тур на 5 дней у российского туроператора — около 85 000 ₽; точная цена по запросу.',
    ventajasT: 'Как мы едем',
    ventajas: [
      ['01', 'Группа 15 человек', 'Можно парами. Или индивидуальный тур только для вашей семьи.'],
      ['02', 'Лучшие отели', '«Корё» в Пхеньяне, «Масикрён» в горах, номера повышенной категории.'],
      ['03', 'Макс с вами', 'Свой человек с российским паспортом: документы и вопросы на месте.'],
      ['04', 'Бизнес-класс', 'Air Koryo Владивосток — Пхеньян, при наличии мест.'],
      ['05', 'Банкеты', 'Пхеньянский нэнмён и лучшие рестораны по программе.'],
      ['06', 'Встреча во Владивостоке', 'Трансфер, отель накануне и брифинг о правилах за ужином.'],
    ],
    destinosT: 'Куда летим в 2027', dias: 'дн.',
    cta: 'Смотреть туры и даты', wa: 'Записаться в группу', solo: 'Только для граждан РФ: КНДР пока принимает туристов только с российским паспортом.',
    atajos: [['Как добраться', 'kak-dobratsya-do-phenyana'], ['Сколько стоит', 'skolko-stoit-tur-v-kndr'], ['Виза', 'viza-v-kndr-dlya-rossiyan'], ['Когда ехать', 'kogda-luchshe-ehat-v-kndr'], ['С детьми', 'kndr-s-detmi'], ['Медовый месяц', 'svadebnoe-puteshestvie-v-kndr'], ['Для компании', 'korporativnyj-tur-v-kndr']],
    waTxt: 'Ответит Тони, координатор поездок. Группа формируется — места ограничены. Напишите, например: «Хочу в группу в КНДР, нас двое, даты…».', fotos: 'Фото',
  },
  en: {
    ceja: 'Groups of 15 · couples welcome · 2027',
    titulo: ['North Korea.', 'In a group, with Max.'],
    lead: 'We are filling a group of 15 — couples welcome. Max, a Russian citizen with a Russian passport, meets the group in Vladivostok, flies with you to Pyongyang and stays with the group until you are back.',
    circulo: 'GROUP ✦ PYONGYANG ✦ 2027 ✦ MAX ✦ ',
    pase: 'Boarding pass', pasajero: 'Passenger', pasajeroV: 'You + Max', clase: 'Class', claseV: 'business*', vuelo: 'Flight', grupo: 'Price', grupoV: 'on request', desde: 'seats per group',
    nota: '* Air Koryo business class when available. Price on request on Telegram.',
    ventajasT: 'How we travel',
    ventajas: [
      ['01', 'Group of 15', 'Couples welcome. Or a private tour just for your family.'],
      ['02', 'Best hotels', 'Koryo Hotel in Pyongyang, Masikryong Hotel in the mountains, upgraded rooms.'],
      ['03', 'Max with you', 'One of us with a Russian passport: documents and questions on the spot.'],
      ['04', 'Business class', 'Air Koryo Vladivostok — Pyongyang, when available.'],
      ['05', 'Banquets', 'Pyongyang naengmyeon and the best restaurants on the programme.'],
      ['06', 'Vladivostok welcome', 'Transfer, hotel the night before and a rules briefing over dinner.'],
    ],
    destinosT: 'Where we fly in 2027', dias: 'days',
    cta: 'See tours and dates (in Russian)', wa: 'Join the group on Telegram', solo: 'Russian passport holders only: the DPRK currently admits tourists with a Russian passport only.',
    atajos: [] as string[][],
    waTxt: 'Tony, the trip coordinator, answers here. The group is filling up and seats are limited.', fotos: 'Photos',
  },
}
const CREDITOS = 'Jan Engelhardt (CC BY-SA 4.0), SSchlhmr (CC BY-SA 4.0), Mario Micklisch (CC BY 2.0), Clay Gilliland (CC BY-SA 2.0), Mark Fahey (CC BY 2.0) · Wikimedia Commons'

/** Lenis mientras el bloque está montado, movido por el reloj de GSAP (receta de la casa). */
function useSuave() {
  useEffect(() => {
    if (quieto()) return
    const lenis = new Lenis({
      lerp: 0.1, wheelMultiplier: 0.9, anchors: { offset: -80 }, stopInertiaOnNavigate: true,
      prevent: (n: HTMLElement) => !!n.closest?.('dialog, [role="dialog"], [data-lenis-prevent], .maplibregl-map'),
    })
    const quita = lenis.on('scroll', ScrollTrigger.update)
    const tic = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tic)
    gsap.ticker.lagSmoothing(0)
    return () => { quita(); gsap.ticker.remove(tic); lenis.destroy() }
  }, [])
}

/** `tg`: enlace de Telegram de Tony, que coordina (t.me no admite texto prellenado; el saludo va como texto visible). */
export default function KndrVip({ lang, tg }: { lang: Lang; tg: string }) {
  const t = T[lang]
  const raiz = useRef<HTMLElement>(null)
  useSuave()
  useBilletes(raiz)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // La foto llega como una ventanilla y se abre a sangre al bajar.
      gsap.fromTo('.kv-ventana', { clipPath: 'inset(9% 7% 9% 7% round 32px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: '.kv-escena', start: 'top 85%', end: 'top 10%', scrub: true },
      })
      gsap.fromTo('.kv-ventana img', { scale: 1.28, yPercent: -6 }, {
        scale: 1, yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: '.kv-escena', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      const split = SplitText.create('.kv-l', { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.kv-titulo', start: 'top 80%' },
      })
      gsap.from('.kv-lead, .kv-ceja, .kv-circulo', {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.kv-titulo', start: 'top 80%' },
      })
      gsap.from('.kv-pase', {
        y: 120, rotate: -6, opacity: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.kv-pase', start: 'top 90%' },
      })
      gsap.from('.kv-bandeja li', {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: '.kv-bandeja', start: 'top 85%' },
      })
      // Los sellos «caen» uno a uno sobre la página, como en un pasaporte.
      gsap.from('.kv-sello', {
        scale: 1.6, rotate: (i) => (i % 2 ? 14 : -12), opacity: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.kv-sellos', start: 'top 80%' },
      })
      return () => split.revert()
    })
    return () => mm.revert()
  }, { scope: raiz })

  const toursUrl = lang === 'ru' ? '/ru/kndr/#tury' : '/ru/kndr/vip-tur-v-kndr/'

  return (
    <section ref={raiz} className="kv" id="kndr" lang={lang} aria-labelledby="kv-titulo">
      <div className="kv-escena">
        <div className="kv-ventana">
          <img src={FOTO('pyongyang', 1920)} srcSet={`${FOTO('pyongyang')} 1080w, ${FOTO('pyongyang', 1920)} 1920w`} sizes="100vw" alt={lang === 'ru' ? 'Панорама Пхеньяна' : 'Pyongyang skyline'} loading="lazy" width={1920} height={1080} />
        </div>
        <div className="kv-escena-texto">
          <span className="kv-ceja">{t.ceja} · <span lang="ko">평양</span></span>
          <h2 className="kv-titulo" id="kv-titulo">{t.titulo.map((l, i) => <span key={l} className={i ? 'kv-l kv-l-hueca' : 'kv-l'}>{l} </span>)}</h2>
          <p className="kv-lead">{t.lead}</p>
        </div>
        <div className="kv-circulo" aria-hidden="true">
          <CircularText text={t.circulo} spinDuration={22} onHover="speedUp" size={170} fontSize={14} fontWeight={600} letterSpacing={2} color="#e6c46a">
            <span className="kv-circulo-centro">VIP</span>
          </CircularText>
        </div>
      </div>

      <div className="kv-cuerpo">
        {/* Billete de embarque: la inclinación y el foil los pone useBilletes (Cocina). */}
        <article className="kv-pase ck-billete" aria-label={t.pase}>
          <div className="kv-pase-main">
            <div className="kv-pase-cab"><span>{t.pase}</span><span>VIP · 2027</span></div>
            <div className="kv-ruta">
              <div><b>VVO</b><small>{lang === 'ru' ? 'Владивосток' : 'Vladivostok'}</small></div>
              <span className="kv-avion" aria-hidden="true">✈</span>
              <div><b>FNJ</b><small>{lang === 'ru' ? 'Пхеньян' : 'Pyongyang'}</small></div>
            </div>
            <dl className="kv-datos">
              <div><dt>{t.pasajero}</dt><dd>{t.pasajeroV}</dd></div>
              <div><dt>{t.clase}</dt><dd>{t.claseV}</dd></div>
              <div><dt>{t.vuelo}</dt><dd>Air Koryo</dd></div>
              <div><dt>{t.grupo}</dt><dd>{t.grupoV}</dd></div>
            </dl>
          </div>
          <div className="kv-pase-talon ck-foil">
            <small>{t.desde}</small>
            <strong className="kv-hueco"><Contador valor={15} formato={(v) => String(Math.round(v))} ms={1200} /></strong>
            <span className="kv-codigo" aria-hidden="true" />
          </div>
        </article>
        <p className="kv-nota">{t.nota}</p>

        <h3 className="kv-sub">{t.ventajasT}</h3>
        <ul className="kv-bandeja">
          {t.ventajas.map(([n, b, d]) => (
            <li key={n}><span className="kv-num">{n}</span><b>{b}</b><span>{d}</span></li>
          ))}
        </ul>

        <h3 className="kv-sub">{t.destinosT}</h3>
        <ul className="kv-sellos">
          {DESTINOS.map((d) => (
            <li key={d.yol}>
              <a className="kv-sello" href={`/ru/kndr/${d.yol}/`}>
                <span className="kv-sello-papel" style={{ clipPath: TROQUEL }}>
                  <img src={FOTO(d.foto)} alt="" loading="lazy" width={1080} height={608} />
                  <span className="kv-sello-pie"><b>{d[lang]}</b><small>{d.fecha} · {d.dias} {t.dias}</small></span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="kv-cta">
          <Magnet padding={80} magnetStrength={3}>
            <a className="kv-boton" href={toursUrl}>{t.cta} →</a>
          </Magnet>
          <a className="kv-boton kv-boton-2 kv-boton-tg" href={tg} target="_blank" rel="noopener noreferrer"><IconoTg /> {t.wa}</a>
        </div>
        <p className="kv-solo">{t.waTxt}</p>
        <p className="kv-solo">{t.solo}</p>
        {t.atajos.length > 0 && (
          <nav className="kv-atajos" aria-label="Вопросы о КНДР">
            {t.atajos.map(([txt, y]) => <a key={y} href={`/ru/kndr/${y}/`}>{txt}</a>)}
          </nav>
        )}
        <p className="kv-creditos">{t.fotos}: {CREDITOS}</p>
      </div>
    </section>
  )
}

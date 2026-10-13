// «En la cima ahora»: tiempo real a la altura de la cumbre y la luz del día.
//  · Previsión: MET Norway Locationforecast 2.0 (CC BY 4.0, uso comercial
//    permitido, CORS abierto), pedida con la altitud real de la cima.
//  · Iconos: metno/weathericons (MIT), copiados en /v7/expedicion/tiempo.
//  · Amanecer, atardecer y hora dorada: SunCalc (BSD-2), calculado aquí.
// Una respuesta por monte se guarda 30 min en sessionStorage: met.no pide no repetir.

import { useEffect, useState } from 'react'
import SunCalc from 'suncalc'
import { CIMA } from './datosMontana'
import type { MonteId } from './datosMontana'
import type { Lengua } from './datosExpedicion'

interface Hora { time: string; data: { instant: { details: { air_temperature: number; wind_speed: number; cloud_area_fraction?: number; relative_humidity?: number } };
  next_1_hours?: { summary: { symbol_code: string }; details?: { precipitation_amount?: number } };
  next_6_hours?: { summary: { symbol_code: string }; details?: { precipitation_amount?: number } } } }

const T: Record<Lengua, { titulo: string; viento: string; nubes: string; humedad: string; dias: string; amanece: string; anochece: string; dorada: string; fuente: string; hielo: string; lluvia: string; ventoso: string; bueno: string; sinDatos: string }> = {
  es: { titulo: 'En la cima ahora', viento: 'Viento', nubes: 'Nubes', humedad: 'Humedad', dias: 'Próximos días', amanece: 'Amanece', anochece: 'Anochece', dorada: 'Luz dorada', fuente: 'Previsión a la altura de la cima: MET Norway (CC BY 4.0)', hielo: 'Bajo cero en la cima: puede haber hielo en el sendero.', lluvia: 'Lluvia en las próximas horas: el guía decide la víspera si se sube.', ventoso: 'Viento fuerte arriba: abrigo cortavientos.', bueno: 'Buen día para subir.', sinDatos: 'Sin conexión con la previsión ahora mismo.' },
  en: { titulo: 'On the summit now', viento: 'Wind', nubes: 'Cloud', humedad: 'Humidity', dias: 'Next days', amanece: 'Sunrise', anochece: 'Sunset', dorada: 'Golden light', fuente: 'Forecast at summit altitude: MET Norway (CC BY 4.0)', hielo: 'Below zero on top: the trail may be icy.', lluvia: 'Rain in the next hours: the guide decides the day before.', ventoso: 'Strong wind up top: bring a windproof layer.', bueno: 'A good day to climb.', sinDatos: 'The forecast is not reachable right now.' },
  ar: { titulo: 'على القمة الآن', viento: 'الرياح', nubes: 'الغيوم', humedad: 'الرطوبة', dias: 'الأيام القادمة', amanece: 'الشروق', anochece: 'الغروب', dorada: 'الضوء الذهبي', fuente: 'التوقعات على ارتفاع القمة: MET Norway (CC BY 4.0)', hielo: 'تحت الصفر على القمة: قد يكون الدرب متجمدًا.', lluvia: 'أمطار في الساعات القادمة: يقرر المرشد في اليوم السابق.', ventoso: 'رياح قوية في الأعلى: أحضر سترة واقية من الرياح.', bueno: 'يوم جيد للصعود.', sinDatos: 'تعذر الوصول إلى التوقعات الآن.' },
  ru: { titulo: 'На вершине сейчас', viento: 'Ветер', nubes: 'Облачность', humedad: 'Влажность', dias: 'Ближайшие дни', amanece: 'Восход', anochece: 'Закат', dorada: 'Золотой час', fuente: 'Прогноз на высоте вершины: MET Norway (CC BY 4.0)', hielo: 'На вершине минус: на тропе может быть лёд.', lluvia: 'В ближайшие часы дождь: гид решает накануне.', ventoso: 'Сильный ветер наверху: нужна ветровка.', bueno: 'Хороший день для восхождения.', sinDatos: 'Прогноз сейчас недоступен.' },
}

const local = (lang: Lengua) => (lang === 'ar' ? 'ar-EG' : lang)
const hora = (d: Date, lang: Lengua) => d.toLocaleTimeString(local(lang), { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })

async function prevision(id: MonteId): Promise<Hora[]> {
  const clave = `ex-tiempo-${id}`
  try {
    const g = JSON.parse(sessionStorage.getItem(clave) || 'null')
    if (g && Date.now() - g.t < 30 * 60e3) return g.s
  } catch { /* sin almacenamiento */ }
  const c = CIMA[id]
  const r = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${c.lat.toFixed(4)}&lon=${c.lon.toFixed(4)}&altitude=${c.m}`)
  if (!r.ok) throw new Error(`met.no ${r.status}`)
  const s = ((await r.json()).properties.timeseries as Hora[]).slice(0, 80)
  try { sessionStorage.setItem(clave, JSON.stringify({ t: Date.now(), s })) } catch { /* lleno o bloqueado */ }
  return s
}

/** Los próximos 3 días (hora de Japón): mínima, máxima y el cielo de mediodía. */
function dias(s: Hora[]) {
  const porDia = new Map<string, Hora[]>()
  for (const h of s) {
    const d = new Date(h.time).toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })
    porDia.set(d, [...(porDia.get(d) ?? []), h])
  }
  return [...porDia.entries()].slice(1, 4).map(([d, hs]) => {
    const t = hs.map((h) => h.data.instant.details.air_temperature)
    // 00-03 UTC = 9-12 h en Japón: su previsión de 6 h cubre la jornada de montaña.
    const mediodia = hs.find((h) => new Date(h.time).getUTCHours() <= 3 && h.data.next_6_hours) ?? hs[Math.floor(hs.length / 2)]
    return { d, min: Math.min(...t), max: Math.max(...t), icono: mediodia.data.next_6_hours?.summary.symbol_code ?? mediodia.data.next_1_hours?.summary.symbol_code }
  })
}

export function CimaAhora({ monte, lang }: { monte: MonteId; lang: Lengua }) {
  const t = T[lang]
  const [s, setS] = useState<Hora[] | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let vivo = true
    setS(null); setError(false)
    prevision(monte).then((x) => vivo && setS(x)).catch(() => vivo && setError(true))
    return () => { vivo = false }
  }, [monte])

  const c = CIMA[monte]
  const sol = SunCalc.getTimes(new Date(), c.lat, c.lon)
  const ahora = s?.[0]
  const det = ahora?.data.instant.details
  const icono = ahora?.data.next_1_hours?.summary.symbol_code ?? ahora?.data.next_6_hours?.summary.symbol_code
  const lluvia = (s ?? []).slice(0, 6).reduce((a, h) => a + (h.data.next_1_hours?.details?.precipitation_amount ?? 0), 0)
  const consejo = !det ? null : det.air_temperature <= 0 ? t.hielo : lluvia >= 1 ? t.lluvia : det.wind_speed >= 10 ? t.ventoso : t.bueno
  const n = (v: number, d = 0) => v.toLocaleString(local(lang), { maximumFractionDigits: d })

  return (
    <section className="ex-tiempo" aria-live="polite">
      <p className="ex-medidor-et"><span className="ex-tiempo-vivo" aria-hidden="true" />{t.titulo} · <bdi dir="ltr">{n(c.m)} m</bdi></p>
      {error && <p className="ex-tiempo-nada">{t.sinDatos}</p>}
      {!error && !det && <div className="ex-tiempo-carga" aria-hidden="true" />}
      {det && (
        <>
          <div className="ex-tiempo-ahora">
            {icono && <img src={`/v7/expedicion/tiempo/${icono}.svg`} alt="" width={64} height={64} />}
            <strong><bdi dir="ltr">{n(det.air_temperature)}°</bdi></strong>
            <dl>
              <div><dt>{t.viento}</dt><dd><bdi dir="ltr">{n(det.wind_speed * 3.6)} km/h</bdi></dd></div>
              {det.cloud_area_fraction != null && <div><dt>{t.nubes}</dt><dd><bdi dir="ltr">{n(det.cloud_area_fraction)} %</bdi></dd></div>}
              {det.relative_humidity != null && <div><dt>{t.humedad}</dt><dd><bdi dir="ltr">{n(det.relative_humidity)} %</bdi></dd></div>}
            </dl>
          </div>
          {consejo && <p className="ex-tiempo-consejo">{consejo}</p>}
          <ol className="ex-tiempo-dias" aria-label={t.dias}>
            {dias(s!).map((d) => (
              <li key={d.d}>
                <span>{new Date(`${d.d}T12:00:00+09:00`).toLocaleDateString(local(lang), { weekday: 'short', timeZone: 'Asia/Tokyo' })}</span>
                {d.icono && <img src={`/v7/expedicion/tiempo/${d.icono}.svg`} alt="" width={32} height={32} loading="lazy" />}
                <bdi dir="ltr">{n(d.max)}° / {n(d.min)}°</bdi>
              </li>
            ))}
          </ol>
        </>
      )}
      <dl className="ex-tiempo-sol">
        <div><dt>{t.amanece}</dt><dd>{hora(sol.sunrise, lang)}</dd></div>
        <div><dt>{t.dorada}</dt><dd>{hora(sol.goldenHour, lang)}</dd></div>
        <div><dt>{t.anochece}</dt><dd>{hora(sol.sunset, lang)}</dd></div>
      </dl>
      <p className="ex-credito"><a href="https://api.met.no/" target="_blank" rel="noopener noreferrer">{t.fuente}</a></p>
    </section>
  )
}

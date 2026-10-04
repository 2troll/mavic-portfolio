// Horarios de oración de hoy en Osaka y dirección de la qibla, para la página
// árabe (su descripción ya promete «أوقات الصلاة»). Datos en vivo de la API
// gratuita de Aladhan (sin clave, CORS abierto), método de la Liga del Mundo
// Islámico. Se pide en el navegador: la página llega ya pintada del build y
// una hora del servidor no coincidiría al hidratar.
import { useEffect, useState } from 'react'
import './v8.css'

const OSAKA = { lat: 34.6937, lon: 135.5023 }
// Rumbo a la Kaaba desde Osaka (ortodrómica): 290,8°.
const QIBLA = 290.8
const NOMBRES: [string, string][] = [['Fajr', 'الفجر'], ['Dhuhr', 'الظهر'], ['Asr', 'العصر'], ['Maghrib', 'المغرب'], ['Isha', 'العشاء']]

interface Datos { horas: Record<string, string>; hijri: string }

export function Oracion() {
  const [d, setD] = useState<Datos | null>(null)
  const [fallo, setFallo] = useState(false)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://api.aladhan.com/v1/timings?latitude=${OSAKA.lat}&longitude=${OSAKA.lon}&method=3`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        const h = j.data.date.hijri
        setD({ horas: j.data.timings, hijri: `${h.day} ${h.month.ar} ${h.year} هـ` })
      })
      .catch((e) => { if (e.name !== 'AbortError') setFallo(true) })
    return () => ctrl.abort()
  }, [])
  return (
    <section className="v7-seccion v9-oracion" aria-label="أوقات الصلاة في أوساكا">
      <h2>أوقات الصلاة اليوم في أوساكا</h2>
      <p className="v7-entradilla">نخطّط اليوم حول الصلاة: نتوقّف في الوقت ونعرف أين نصلّي. {d && <bdi>{d.hijri}</bdi>}</p>
      <div className="v9-oracion-fila">
        <ol className="v9-oracion-horas">
          {NOMBRES.map(([k, n]) => (
            <li key={k}><span>{n}</span><strong dir="ltr">{d ? d.horas[k] : '––:––'}</strong></li>
          ))}
        </ol>
        <figure className="v9-qibla" aria-label={`اتجاه القبلة من أوساكا: ${QIBLA} درجة`}>
          <svg viewBox="-60 -60 120 120" aria-hidden="true">
            <circle r="54" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <text y="-40" textAnchor="middle" fontSize="11" fill="currentColor">N</text>
            <g transform={`rotate(${QIBLA})`}>
              <line y1="8" y2="-44" stroke="var(--sello)" strokeWidth="4" strokeLinecap="round" />
              <circle r="5" fill="var(--sello)" />
            </g>
          </svg>
          <figcaption>القبلة: <bdi dir="ltr">{QIBLA}°</bdi> من الشمال</figcaption>
        </figure>
      </div>
      {fallo && <p className="v9-oracion-nota">تعذّر تحميل الأوقات الآن. راسلني وأرسلها لك.</p>}
      <p className="v9-oracion-nota">المصدر: Aladhan · طريقة رابطة العالم الإسلامي</p>
    </section>
  )
}

// El tiempo de la ciudad en vivo, en la portada: ahora, los próximos días con
// su probabilidad de lluvia y, si hay un tifón activo, cuánto se acercará.
import { useEffect, useState } from 'react'
import { kanjiTiempo, maximaCercania, RUMBO, tiempoEn, tifones } from './tiempo'
import type { Tiempo, Tifon } from './tiempo'
import type { CiudadId, Lengua } from './ciudades'

const COORD: Record<CiudadId, [number, number]> = {
  osaka: [34.69, 135.5], kyoto: [35.01, 135.77], nara: [34.68, 135.83], kobe: [34.69, 135.2],
  himeji: [34.84, 134.69], hiroshima: [34.3, 132.32], beyond: [34.21, 135.59],
}

// Sólo se avisa de tifones cuya trayectoria prevista pase a menos de esto.
const AVISO_KM = 2500

const ET: Record<Lengua, { ahora: string; lluvia: string; tifon: (t: Tifon, d: number) => string; cerca: string; fuente: string }> = {
  es: { ahora: 'Ahora', lluvia: 'lluvia', tifon: (t, d) => `Tifón ${t.nombre} (nº ${Number(t.numero.slice(2))}): pasará a unos ${redondea(d)} km`, cerca: 'Si afecta a vuestro día, os aviso y cambiamos el plan.', fuente: 'Open-Meteo · JMA' },
  en: { ahora: 'Now', lluvia: 'rain', tifon: (t, d) => `Typhoon ${t.nombre} (No. ${Number(t.numero.slice(2))}): will pass about ${redondea(d)} km away`, cerca: 'If it affects your day, I\'ll tell you and we change the plan.', fuente: 'Open-Meteo · JMA' },
  ar: { ahora: 'الآن', lluvia: 'مطر', tifon: (t, d) => `إعصار ${t.nombre} (رقم ${Number(t.numero.slice(2))}): سيمر على بُعد نحو ${redondea(d)} كم`, cerca: 'إن أثّر على يومكم أخبركم ونغيّر الخطة.', fuente: 'Open-Meteo · JMA' },
  ru: { ahora: 'Сейчас', lluvia: 'дождь', tifon: (t, d) => `Тайфун ${t.nombre} (№ ${Number(t.numero.slice(2))}): пройдёт примерно в ${redondea(d)} км`, cerca: 'Если он затронет ваш день, я предупрежу и поменяем план.', fuente: 'Open-Meteo · JMA' },
}

function redondea(d: number) { return (Math.round(d / 50) * 50).toLocaleString('es-ES') }

export function TiempoCiudad({ ciudad, lang }: { ciudad: CiudadId; lang: Lengua }) {
  const [tiempo, setTiempo] = useState<Tiempo | null>(null)
  const [aviso, setAviso] = useState<{ t: Tifon; d: number } | null>(null)
  const [lat, lon] = COORD[ciudad]
  const et = ET[lang]

  useEffect(() => {
    let vivo = true
    tiempoEn(lat, lon).then((t) => vivo && setTiempo(t)).catch((e) => console.warn('[tiempo]', e))
    tifones().then((lista) => {
      if (!vivo) return
      const cerca = lista.map((t) => ({ t, d: maximaCercania(t, lat, lon) })).filter((x) => x.d < AVISO_KM).sort((a, b) => a.d - b.d)[0]
      setAviso(cerca ?? null)
    }).catch((e) => console.warn('[tifones]', e))
    return () => { vivo = false }
  }, [lat, lon])

  if (!tiempo) return null
  const dia = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn' : lang, { weekday: 'short', timeZone: 'Asia/Tokyo' })

  return (
    <aside className="v8-tiempo" aria-live="polite">
      {aviso && (
        <p className={`v8-tifon ${aviso.d < 600 ? 'cerca' : ''}`}>
          <span lang="ja" aria-hidden="true">台風</span>
          <span>{et.tifon(aviso.t, aviso.d)} <bdi>{RUMBO[aviso.t.rumbo] ?? ''}</bdi>. {aviso.d < 1200 ? et.cerca : ''}</span>
        </p>
      )}
      <div className="v8-tiempo-fila cristal">
        <p className="v8-tiempo-ahora">
          <small>{et.ahora}</small>
          <span lang="ja" aria-hidden="true">{kanjiTiempo(tiempo.codigo)}</span>
          <strong><bdi>{Math.round(tiempo.temp)}°</bdi></strong>
        </p>
        <ol>
          {tiempo.dias.slice(1, 5).map((d) => (
            <li key={d.fecha}>
              <small>{dia.format(new Date(`${d.fecha}T12:00:00+09:00`))}</small>
              <span lang="ja" aria-hidden="true">{kanjiTiempo(d.codigo)}</span>
              <bdi>{Math.round(d.max)}°</bdi>
              <small className={d.lluvia >= 50 ? 'moja' : ''}><bdi>{d.lluvia}%</bdi></small>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}

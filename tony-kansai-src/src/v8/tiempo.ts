// Tiempo en vivo, gratis y sin clave:
//   - Open-Meteo: tiempo de ahora y de los próximos días por ciudad.
//   - Agencia Meteorológica de Japón (JMA): tifones activos, con posición,
//     fuerza y trayectoria prevista (la fuente oficial para Japón).
// Ambas admiten CORS (comprobado el 3-10-2026). Se guardan 20 min en
// sessionStorage para no repetir peticiones al cambiar de página.

export interface TiempoDia { fecha: string; codigo: number; max: number; min: number; lluvia: number }
export interface Tiempo { temp: number; codigo: number; rachas: number; dias: TiempoDia[] }
export interface PuntoTifon { horas: number; lat: number; lon: number; presion: number; categoria: string }
export interface Tifon {
  numero: string; nombre: string; categoria: string; intensidad: string
  lat: number; lon: number; presion: number; vientoMs: number; rachaMs: number
  rumbo: string; velocidadKmh: number; prevision: PuntoTifon[]
}

const MINUTOS = 20

async function conCache<T>(clave: string, pide: () => Promise<T>): Promise<T> {
  try {
    const g = sessionStorage.getItem(clave)
    if (g) {
      const { t, v } = JSON.parse(g) as { t: number; v: T }
      if (Date.now() - t < MINUTOS * 60000) return v
    }
  } catch { /* sin almacenamiento */ }
  const v = await pide()
  try { sessionStorage.setItem(clave, JSON.stringify({ t: Date.now(), v })) } catch { /* lleno o bloqueado */ }
  return v
}

async function json<T>(url: string, ms = 12000): Promise<T> {
  const c = new AbortController()
  const reloj = setTimeout(() => c.abort(), ms)
  try {
    const r = await fetch(url, { signal: c.signal })
    if (!r.ok) throw new Error(`${r.status} ${url}`)
    return (await r.json()) as T
  } finally { clearTimeout(reloj) }
}

export function tiempoEn(lat: number, lon: number): Promise<Tiempo> {
  return conCache(`v8-tiempo-${lat}-${lon}`, async () => {
    const d = await json<{
      current: { temperature_2m: number; weather_code: number; wind_gusts_10m: number }
      daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] }
    }>(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=5`)
    return {
      temp: d.current.temperature_2m, codigo: d.current.weather_code, rachas: d.current.wind_gusts_10m,
      dias: d.daily.time.map((fecha, i) => ({
        fecha, codigo: d.daily.weather_code[i], max: d.daily.temperature_2m_max[i], min: d.daily.temperature_2m_min[i],
        lluvia: d.daily.precipitation_probability_max[i] ?? 0,
      })),
    }
  })
}

type ParteJMA = {
  part?: unknown; typhoonNumber?: string; name?: { en: string }; category?: { en: string }
  intensity?: string; position?: { deg: [number, number] }; pressure?: string; advancedHours?: number
  maximumWind?: { sustained?: { 'm/s': string }; gust?: { 'm/s': string } }; course?: string; speed?: { 'km/h': string }
}

/** Tifones activos según la JMA (lista vacía si no hay o si no responde). */
export function tifones(): Promise<Tifon[]> {
  return conCache('v8-tifones', async () => {
    const lista = await json<{ tropicalCyclone: string }[]>('https://www.jma.go.jp/bosai/typhoon/data/targetTc.json')
    const todos = await Promise.all(lista.map(async ({ tropicalCyclone }) => {
      const p = await json<ParteJMA[]>(`https://www.jma.go.jp/bosai/typhoon/data/${tropicalCyclone}/specifications.json`)
      const titulo = p[0]
      const ahora = p.find((x) => x.advancedHours === 0 && x.position)
      if (!ahora?.position) return null
      return {
        numero: titulo.typhoonNumber ?? '', nombre: titulo.name?.en ?? '', categoria: ahora.category?.en ?? '',
        intensidad: ahora.intensity ?? '', lat: ahora.position.deg[0], lon: ahora.position.deg[1],
        presion: Number(ahora.pressure ?? 0), vientoMs: Number(ahora.maximumWind?.sustained?.['m/s'] ?? 0),
        rachaMs: Number(ahora.maximumWind?.gust?.['m/s'] ?? 0), rumbo: ahora.course ?? '', velocidadKmh: Number(ahora.speed?.['km/h'] ?? 0),
        prevision: p.filter((x) => (x.advancedHours ?? 0) > 0 && x.position).map((x) => ({
          horas: x.advancedHours!, lat: x.position!.deg[0], lon: x.position!.deg[1], presion: Number(x.pressure ?? 0), categoria: x.category?.en ?? '',
        })),
      } satisfies Tifon
    }))
    return todos.filter((x): x is Tifon => x !== null)
  })
}

/** Distancia en km sobre la Tierra (haversine). */
export function km(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = Math.PI / 180, a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

/** Lo más cerca que pasará el tifón de un punto, según su previsión. */
export function maximaCercania(t: Tifon, lat: number, lon: number) {
  return Math.min(km(t.lat, t.lon, lat, lon), ...t.prevision.map((p) => km(p.lat, p.lon, lat, lon)))
}

/** Código WMO del tiempo → kanji japonés del parte (晴 sol, 曇 nubes, 雨 lluvia…). */
export function kanjiTiempo(c: number): string {
  if (c <= 1) return '晴'
  if (c <= 3) return '曇'
  if (c === 45 || c === 48) return '霧'
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return '雪'
  if (c >= 95) return '雷'
  return '雨'
}

/** Rumbo japonés de la JMA (北北東…) → flecha simple. */
export const RUMBO: Record<string, string> = {
  北: '↑', 北北東: '↗', 北東: '↗', 東北東: '→', 東: '→', 東南東: '↘', 南東: '↘', 南南東: '↓',
  南: '↓', 南南西: '↙', 南西: '↙', 西南西: '←', 西: '←', 西北西: '↖', 北西: '↖', 北北西: '↑', 停滞: '·', ほとんど停滞: '·',
}

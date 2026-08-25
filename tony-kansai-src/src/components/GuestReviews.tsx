import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { FadeUp } from './FadeUp'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Reseñas de clientes en la portada.
 *
 * Lee /reviews.json, que genera `resenas.py publicar` sólo con las que Tony ha
 * aprobado. Mientras no haya ninguna, la sección no se pinta: más vale nada que
 * un hueco vacío pidiendo reseñas que no existen.
 *
 * La página completa vive en /resenas.html (estática, fuera de esta app).
 */

interface Resena {
  id: string
  stars: number
  name: string
  country?: string
  tour?: string
  text: string
  lang?: string
  date?: string
  photo?: string
}

interface Datos {
  count?: number
  average?: number
  reviews?: Resena[]
}

const EN_PORTADA = 3

function Estrellas({ nota, tam = 14 }: { nota: number; tam?: number }) {
  // Enteras en las tarjetas; en la media, la última se recorta al porcentaje justo.
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${nota} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const relleno = Math.max(0, Math.min(1, nota - (i - 1))) * 100
        return (
          <span key={i} className="relative inline-block" style={{ width: tam, height: tam }}>
            <Star size={tam} className="absolute inset-0 text-japan-gold/25" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${relleno}%` }}>
              <Star size={tam} className="text-japan-gold" fill="currentColor" />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function GuestReviews() {
  const { t } = useLanguage()
  const [datos, setDatos] = useState<Datos | null>(null)

  useEffect(() => {
    let vivo = true
    fetch('/reviews.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Datos) => { if (vivo) setDatos(d) })
      .catch(() => { /* sin reseñas la portada sigue igual */ })
    return () => { vivo = false }
  }, [])

  const todas = (datos?.reviews ?? []).filter((r) => r && r.text && r.stars)
  if (!todas.length) return null

  const n = datos?.count ?? todas.length
  const media = datos?.average ?? todas.reduce((a, r) => a + r.stars, 0) / todas.length

  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-japan-surface/30 to-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4">
            {t.reviews.title}
          </h2>
          <p className="max-w-xl mx-auto text-white/50 text-lg font-light">
            {t.reviews.subtitle}
          </p>

          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2
                          glass rounded-2xl border border-white/6 px-6 py-4">
            <span className="font-serif text-4xl font-semibold text-japan-gold tabular-nums leading-none">
              {media.toFixed(1)}
              <span className="text-base text-white/40 font-sans font-normal"> / 5</span>
            </span>
            <Estrellas nota={media} tam={18} />
            <span className="text-sm text-white/45">
              {t.reviews.based_on.replace('{n}', String(n))}
            </span>
          </div>
        </FadeUp>

        {/* items-start: sin esto, una reseña corta y sin foto se estira
            hasta la altura de la más larga y deja un hueco muerto. */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {todas.slice(0, EN_PORTADA).map((r, i) => (
            <FadeUp key={r.id} delay={i * 0.1}>
              <article className="glass rounded-2xl border border-white/6 overflow-hidden h-full flex flex-col">
                {r.photo && (
                  <img
                    src={r.photo}
                    alt={`${r.name} — ${r.tour || 'Kansai'}`}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <Estrellas nota={r.stars} />
                  <blockquote
                    dir={r.lang === 'ar' ? 'rtl' : 'auto'}
                    lang={r.lang || 'en'}
                    className="mt-3 mb-4 text-[15px] leading-relaxed text-white/80 whitespace-pre-line flex-1"
                  >
                    {r.text}
                  </blockquote>
                  <div className="border-t border-white/6 pt-3 text-xs text-white/45">
                    <div className="text-[15px] font-semibold text-white">{r.name}</div>
                    {[r.country, r.date].filter(Boolean).join(' · ')}
                    {r.tour && <div className="text-japan-gold mt-1.5">{r.tour}</div>}
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-10 text-center">
          {/* Enlaces normales, no <Link>: estas dos páginas son estáticas y viven
              fuera del router de la app. */}
          <a
            href="/resenas.html"
            className="inline-block rounded-full border border-white/12 px-7 py-3 text-sm font-semibold
                       text-white/80 hover:border-japan-gold hover:text-white transition-colors"
          >
            {t.reviews.all} →
          </a>
        </FadeUp>

        <FadeUp className="mt-8">
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-8 text-center">
            <h3 className="font-serif text-2xl font-semibold text-white mb-2">{t.reviews.cta_title}</h3>
            <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">{t.reviews.cta_body}</p>
            <a
              href="/opinar.html"
              className="inline-block rounded-xl bg-gradient-to-r from-japan-red to-japan-orange
                         px-7 py-3.5 text-sm font-bold text-white
                         shadow-[0_8px_30px_-8px_rgba(229,48,48,0.55)]
                         hover:-translate-y-0.5 transition-transform"
            >
              {t.reviews.cta_button} →
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import { FadeUp } from './FadeUp'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Reseñas de clientes en la portada.
 *
 * Lee /reviews.json, que genera `resenas.py publicar` sólo con las que Tony ha
 * aprobado. Se pintan las tres primeras y el resto se despliega aquí mismo con
 * un botón: quien llega al final de la portada puede leerlas todas sin salir de
 * la página. /resenas.html sigue existiendo como página para compartir.
 *
 * La sección se muestra siempre, incluso sin reseñas: en ese caso no se inventa
 * ninguna nota media, sólo se invita a dejar la primera.
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

function Tarjeta({ r }: { r: Resena }) {
  return (
    // h-full, con items-start en la rejilla: sin eso una reseña corta y sin foto
    // se estira hasta la altura de la más larga y deja un hueco muerto.
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
  )
}

export function GuestReviews() {
  const { t } = useLanguage()
  const [datos, setDatos] = useState<Datos | null>(null)
  const [abierto, setAbierto] = useState(false)
  const seccion = useRef<HTMLElement>(null)
  const montado = useRef(false)

  // Al plegar, la lista encoge por debajo del visitante y lo deja tirado en el
  // pie de página —y siendo ésta la última sección, no hay nada más abajo a lo
  // que agarrarse—. Se le devuelve al principio de las reseñas.
  useEffect(() => {
    if (!montado.current) { montado.current = true; return }
    if (!abierto) seccion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [abierto])

  useEffect(() => {
    let vivo = true
    fetch('/reviews.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Datos) => { if (vivo) setDatos(d) })
      .catch(() => { /* sin reseñas la portada sigue igual */ })
    return () => { vivo = false }
  }, [])

  const todas = (datos?.reviews ?? []).filter((r) => r && r.text && r.stars)
  const hay = todas.length > 0
  const ocultas = todas.length - EN_PORTADA
  const n = datos?.count ?? todas.length
  const media = hay
    ? datos?.average ?? todas.reduce((a, r) => a + r.stars, 0) / todas.length
    : 0

  return (
    <section ref={seccion} className="py-24 bg-gradient-to-b from-transparent via-japan-surface/30 to-transparent">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4">
            {t.reviews.title}
          </h2>
          <p className="max-w-xl mx-auto text-white/50 text-lg font-light">
            {t.reviews.subtitle}
          </p>

          {/* Sin reseñas no se enseña la nota: un 0,0 / 5 espanta más que el hueco. */}
          {hay && (
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
          )}
        </FadeUp>

        {hay && (
          <div id="resenas-lista" className="grid md:grid-cols-3 gap-6 items-start">
            {todas.slice(0, EN_PORTADA).map((r, i) => (
              <FadeUp key={r.id} delay={i * 0.1}>
                <Tarjeta r={r} />
              </FadeUp>
            ))}

            {/* Las que se despliegan. Van dentro de la misma rejilla para que
                continúen la fila donde se quedaron las tres primeras. */}
            <AnimatePresence initial={false}>
              {abierto &&
                todas.slice(EN_PORTADA).map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Tarjeta r={r} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}

        {/* El botón sólo aparece si queda algo por desplegar. */}
        {ocultas > 0 && (
          <FadeUp className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="resenas-lista"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-7 py-3
                         text-sm font-semibold text-white/80
                         hover:border-japan-gold hover:text-white transition-colors"
            >
              {abierto
                ? t.reviews.show_less
                : t.reviews.show_all.replace('{n}', String(todas.length))}
              <ChevronDown
                size={16}
                className={`transition-transform ${abierto ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          </FadeUp>
        )}

        <FadeUp className="mt-8">
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-8 text-center">
            {!hay && <p className="text-white/45 text-sm mb-5">{t.reviews.empty}</p>}
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

            {/* Enlace normal, no <Link>: /resenas.html es estática y vive fuera
                del router de la app. Se queda como página para compartir. */}
            {hay && (
              <div className="mt-6">
                <a
                  href="/resenas.html"
                  className="text-sm text-white/40 underline underline-offset-4
                             hover:text-japan-gold transition-colors"
                >
                  {t.reviews.all} →
                </a>
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

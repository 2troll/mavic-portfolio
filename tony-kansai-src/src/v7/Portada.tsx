// Portada: el globo vuela hasta Kansai y el visitante elige su idioma.
// Cada idioma lleva a la página de SU guía: Tony (ES/EN/AR) o Larion (RU/EN).

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Globo } from './Globo'
import { Sakura } from './Sakura'
import type { PaginaId } from './contenido'
import { GUIAS } from './contenido'
import './v7.css'

const BASE = 'https://tonykansaiguide.com'

const OPCIONES: { id: PaginaId; ruta: string; idioma: string; quien: string; lang: string; guia: 'tony' | 'larion' }[] = [
  { id: 'es', ruta: '/es/', idioma: 'Español', quien: 'con Tony', lang: 'es', guia: 'tony' },
  { id: 'en', ruta: '/en/', idioma: 'English', quien: 'with Tony', lang: 'en', guia: 'tony' },
  { id: 'ar', ruta: '/ar/', idioma: 'العربية', quien: 'مع طوني', lang: 'ar', guia: 'tony' },
  { id: 'ru', ruta: '/ru/', idioma: 'Русский', quien: 'с Ларионом', lang: 'ru', guia: 'larion' },
]

const LEMA: Record<string, string> = {
  es: 'Guías privados en Kansai, Japón. Elige tu idioma.',
  en: 'Private guides in Kansai, Japan. Choose your language.',
  ar: 'مرشدون خاصون في كانساي، اليابان. اختر لغتك.',
  ru: 'Частные гиды в Кансае, Япония. Выберите язык.',
}

/** es → es; ar → ar; ruso y vecinos → ru; el resto, inglés. */
function idiomaSugerido(): PaginaId {
  try {
    for (const tag of navigator.languages ?? [navigator.language]) {
      const b = tag.split('-')[0].toLowerCase()
      if (b === 'es' || b === 'ar' || b === 'en') return b
      if (['ru', 'uk', 'be', 'kk', 'uz', 'hy', 'ka'].includes(b)) return 'ru'
    }
  } catch { /* sin navigator */ }
  return 'en'
}

const LUGARES = [
  { nombre: 'Osaka', lat: 34.6937, lon: 135.5023 },
  { nombre: 'Kyoto', lat: 35.0116, lon: 135.7681 },
  { nombre: 'Hiroshima', lat: 34.3853, lon: 132.4553 },
]

export default function Portada() {
  const [sugerido] = useState(idiomaSugerido)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    // El panel sale al acabar el vuelo; si el globo no puede (WebGL apagado,
    // texturas que no llegan), sale igual a los 6 s. Y antes si el visitante
    // toca algo: nadie tiene que esperar a una animación.
    const reloj = window.setTimeout(() => setAbierto(true), 6000)
    const abrir = () => setAbierto(true)
    window.addEventListener('keydown', abrir, { once: true })
    window.addEventListener('wheel', abrir, { once: true, passive: true })
    window.addEventListener('touchstart', abrir, { once: true, passive: true })
    document.body.classList.add('v7-cuerpo-oscuro')
    return () => {
      window.clearTimeout(reloj)
      window.removeEventListener('keydown', abrir)
      window.removeEventListener('wheel', abrir)
      window.removeEventListener('touchstart', abrir)
      document.body.classList.remove('v7-cuerpo-oscuro')
    }
  }, [])

  return (
    <div className="v7 v7-portada" onClick={() => setAbierto(true)}>
      <Helmet>
        <html lang="en" dir="ltr" />
        <title>Tony Kansai Guide — Private guides in Japan · Guías privados · مرشدون خاصون · Частные гиды</title>
        <meta name="description" content="Private guides in Kansai, Japan. Tony guides in Spanish, English and Arabic; Larion in Russian and English. They meet you at your hotel — booked directly, no agency." />
        <link rel="canonical" href={`${BASE}/`} />
        <link rel="alternate" hrefLang="es" href={`${BASE}/es/`} />
        <link rel="alternate" hrefLang="en" href={`${BASE}/en/`} />
        <link rel="alternate" hrefLang="ar" href={`${BASE}/ar/`} />
        <link rel="alternate" hrefLang="ru" href={`${BASE}/ru/`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/`} />
        <meta property="og:url" content={`${BASE}/`} />
        <meta property="og:image" content={`${BASE}/v7/fotos/kioto.jpg`} />
        <meta name="theme-color" content="#05070d" />
      </Helmet>

      <Globo
        className="v7-globo-pantalla"
        lugares={LUGARES}
        final={{ lat: 34.2, lon: 134.4, dist: 1.5 }}
        duracion={5600}
        alTerminar={() => setAbierto(true)}
        etiquetaAria="Globo terráqueo que gira y se acerca a Kansai, en Japón"
      />

      <Sakura cantidad={14} />
      <header className="v7-portada-marca">
        <img src="/logo-square.svg" alt="" width={28} height={28} />
        <span>Tony Kansai Guide</span>
      </header>

      <main
        className={`v7-elige cristal ${abierto ? 'abierto' : ''}`}
        onFocusCapture={() => setAbierto(true)}
        dir={sugerido === 'ar' ? 'rtl' : 'ltr'}
      >
        <h1 className="v7-elige-lema" lang={sugerido === 'larion' ? 'en' : sugerido}>{LEMA[sugerido] ?? LEMA.en}</h1>
        <nav className="v7-elige-opciones" aria-label="Language · Idioma · اللغة · Язык">
          {OPCIONES.map((o) => (
            <Link key={o.id} to={o.ruta} lang={o.lang} dir={o.lang === 'ar' ? 'rtl' : 'ltr'} className={`v7-opcion ${o.id === sugerido ? 'sugerido' : ''}`}>
              <img src={GUIAS[o.guia].foto} alt="" width={40} height={40} loading="lazy" />
              <span className="v7-opcion-texto">
                <span className="v7-opcion-idioma">{o.idioma}</span>
                <span className="v7-opcion-quien">{o.quien}</span>
              </span>
              <span className="v7-opcion-flecha" aria-hidden="true">{o.lang === 'ar' ? '←' : '→'}</span>
            </Link>
          ))}
        </nav>
        <Link to="/larion/" className="v7-elige-extra" lang="en" dir="ltr">English with Larion — Hiroshima &amp; western Japan →</Link>
      </main>
    </div>
  )
}

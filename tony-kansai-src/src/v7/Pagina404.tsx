// 404 con el aspecto claro de la web v7. Antes una URL equivocada caía en la
// web antigua oscura entera (menú y pie viejos), como si fuera otra empresa.

import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'

type L = 'es' | 'en' | 'ar' | 'ru'
const T: Record<L, { titulo: string; texto: string; inicio: string; ruta: string; ciudades: string }> = {
  es: { titulo: 'Este camino no lleva a ninguna parte', texto: 'La página que buscas no está aquí: puede que el enlace tenga una errata. Todo lo demás está a un toque.', inicio: 'Ir al inicio', ruta: '/es/', ciudades: 'Ciudades' },
  en: { titulo: 'This path does not go anywhere', texto: 'The page you were looking for is not here — the link may have a typo. Everything else is one tap away.', inicio: 'Go home', ruta: '/en/', ciudades: 'Cities' },
  ar: { titulo: 'هذا الطريق لا يؤدي إلى أي مكان', texto: 'الصفحة التي تبحث عنها غير موجودة، ربما في الرابط خطأ مطبعي. كل شيء آخر على بُعد لمسة.', inicio: 'الصفحة الرئيسية', ruta: '/ar/', ciudades: 'المدن' },
  ru: { titulo: 'Эта дорога никуда не ведёт', texto: 'Такой страницы нет — возможно, в ссылке опечатка. Всё остальное в одном касании.', inicio: 'На главную', ruta: '/ru/', ciudades: 'Города' },
}
const CIUDADES: Record<L, [string, string][]> = {
  es: [['osaka', 'Osaka'], ['kyoto', 'Kioto'], ['nara', 'Nara'], ['kobe', 'Kobe'], ['himeji', 'Himeji'], ['hiroshima', 'Hiroshima']],
  en: [['osaka', 'Osaka'], ['kyoto', 'Kyoto'], ['nara', 'Nara'], ['kobe', 'Kobe'], ['himeji', 'Himeji'], ['hiroshima', 'Hiroshima']],
  ar: [['osaka', 'أوساكا'], ['kyoto', 'كيوتو'], ['nara', 'نارا'], ['kobe', 'كوبي'], ['himeji', 'هيميجي'], ['hiroshima', 'هيروشيما']],
  // Larion no guía en Kobe.
  ru: [['osaka', 'Осака'], ['kyoto', 'Киото'], ['nara', 'Нара'], ['himeji', 'Химэдзи'], ['hiroshima', 'Хиросима']],
}

export default function Pagina404() {
  const { lang } = useLanguage()
  const l: L = (['es', 'en', 'ar', 'ru'] as const).includes(lang as L) ? (lang as L) : 'en'
  const t = T[l]
  return (
    <section className="v7-seccion" style={{ textAlign: 'center', minHeight: '60vh', display: 'grid', placeContent: 'center', gap: 18 }}>
      <Helmet><title>404 · Tony Kansai Guide</title><meta name="robots" content="noindex" /></Helmet>
      <p className="v7-404-num" aria-hidden="true" style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1, color: '#b0301f' }}>404</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.03em' }}>{t.titulo}</h1>
      <p style={{ color: '#6e6e73', maxWidth: '44ch', margin: '0 auto' }}>{t.texto}</p>
      <nav aria-label={t.ciudades} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {CIUDADES[l].map(([id, nombre]) => (
          <Link key={id} to={`${t.ruta}${id}/`} className="tarjeta" style={{ padding: '8px 16px', borderRadius: 999 }}>{nombre}</Link>
        ))}
      </nav>
      <p><Link className="v7-boton" to={t.ruta}>{t.inicio}</Link></p>
    </section>
  )
}

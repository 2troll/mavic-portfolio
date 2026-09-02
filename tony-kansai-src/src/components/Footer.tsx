import { Link } from 'react-router-dom'
import { MessageCircle, MapPin } from 'lucide-react'
import { WHATSAPP, WHATSAPP_NUMBER } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'

export function Footer() {
  const { t, tc } = useLanguage()

  const LEGAL_LINKS = [
    { to: '/terms', label: tc('Terms and Conditions') },
    { to: '/privacy', label: t.footer.privacy },
    { to: '/cookies', label: tc('Cookie Policy') },
    { to: '/safety', label: tc('Safety & Insurance') },
    { to: '/legal', label: tc('Legal Notice') },
    { to: '/accessibility', label: tc('Accessibility') },
  ]

  const NAV_LINKS = [
    { to: '/', label: t.nav.home },
    { to: '/tours', label: t.nav.tours },
    { to: '/hiking', label: `⛰️ ${t.nav.hiking}` },
    { to: '/about', label: t.nav.about },
    { to: '/pricing', label: t.nav.pricing },
    { to: '/faq', label: t.nav.faq },
    { to: '/booking', label: t.nav.booking },
  ]

  return (
    <footer className="border-t border-white/5 bg-japan-surface py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl font-semibold mb-2">
              <span className="text-gradient-japan">Tony</span>
              <span className="text-white/50 font-light"> Hanma</span>
            </div>
            <p className="text-sm text-white/45 leading-relaxed max-w-sm mb-4">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <MapPin size={13} className="text-japan-red" />
              <span>{t.footer.based}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4">
              {t.footer.nav_label}
            </div>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="text-sm text-white/55 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
              {/* Páginas estáticas, fuera del router: enlace normal, no <Link>. */}
              <a href="/resenas.html" className="text-sm text-white/55 hover:text-white transition-colors">
                {t.reviews.title}
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4">
              {t.footer.contact_label}
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/55 hover:text-japan-red transition-colors"
              >
                <MessageCircle size={14} className="text-japan-red flex-shrink-0" />
                <span className="ltr-num">{WHATSAPP_NUMBER}</span>
              </a>
              <div className="flex gap-1.5 mt-2">
                {['🇬🇧', '🇪🇸', '🇷🇺', '🇨🇿', '🇸🇦'].map((f) => (
                  <span key={f} className="text-xl">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Las seis páginas legales, todas al alcance desde cualquier página. */}
        <div className="border-t border-white/5 pt-6 mb-5">
          <div className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-3">
            {tc('Legal & Safety')}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="text-xs text-white/45 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <span>© {new Date().getFullYear()} {t.footer.rights}</span>
          <span>{t.footer.replies}</span>
        </div>
      </div>
    </footer>
  )
}

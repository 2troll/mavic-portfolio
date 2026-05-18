import { Link } from 'react-router-dom'
import { MessageCircle, MapPin } from 'lucide-react'
import { WHATSAPP, WHATSAPP_NUMBER } from '../lib/data'

export function Footer() {
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
              Private Kansai guide since 2018. 200+ tours. 5 languages. 100% private experiences in Osaka, Kyoto, Nara and beyond.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <MapPin size={13} className="text-japan-red" />
              <span>Based in Osaka, Japan</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4">Navigation</div>
            <div className="flex flex-col gap-2.5">
              {[['/', 'Home'], ['/tours', 'Tours'], ['/about', 'About Tony'], ['/pricing', 'Pricing'], ['/faq', 'FAQ']].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm text-white/55 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4">Contact</div>
            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/55 hover:text-japan-red transition-colors"
              >
                <MessageCircle size={14} className="text-japan-red flex-shrink-0" />
                {WHATSAPP_NUMBER}
              </a>
              <div className="flex gap-1.5 mt-2">
                {['🇬🇧', '🇪🇸', '🇷🇺', '🇨🇿', '🇸🇦'].map((f) => (
                  <span key={f} className="text-xl">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <span>© {new Date().getFullYear()} Tony Hanma · Private Kansai Guide · Osaka, Japan</span>
          <span>Replies within 2 hours · 100% Private</span>
        </div>
      </div>
    </footer>
  )
}

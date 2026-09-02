import { Cookie } from 'lucide-react'
import { LegalPage, Section, Li } from '../components/LegalPage'
import { useLanguage } from '../contexts/LanguageContext'

const UPDATED = 'September 2026'

/**
 * Lista real de lo que guarda esta web. Si se añade una herramienta que
 * escriba en el navegador, tiene que aparecer aquí: es lo que exige el RGPD
 * y lo que revisa cualquiera que se lo tome en serio.
 */
const ALMACENAMIENTO = [
  { name: '_ga', provider: 'Google Analytics', purposeKey: 'Distinguishes one visitor from another (anonymously).', duration: '2 years', typeKey: 'Analytics' },
  { name: '_ga_K9JKN9346D', provider: 'Google Analytics 4', purposeKey: 'Keeps the state of the current visit.', duration: '2 years', typeKey: 'Analytics' },
  { name: '_gcl_au', provider: 'Google Ads', purposeKey: 'Measures whether an ad led to a WhatsApp enquiry.', duration: '90 days', typeKey: 'Advertising' },
  { name: 'tony-cookie-consent', provider: 'tonykansaiguide.com', purposeKey: 'Remembers whether you accepted or declined.', duration: 'Until you clear it', typeKey: 'Essential' },
  { name: 'tony-lang', provider: 'tonykansaiguide.com', purposeKey: 'Remembers the language you chose.', duration: 'Until you clear it', typeKey: 'Essential' },
]

export default function Cookies() {
  const { tc } = useLanguage()

  return (
    <LegalPage
      title={tc('Cookie Policy')}
      description={tc('Exactly what Tony Kansai Guide stores in your browser, why, for how long, and how to withdraw your consent at any time.')}
      path="/cookies"
      icon={<Cookie size={18} className="text-japan-red" />}
      updated={UPDATED}
      intro={tc('This page lists everything this website stores in your browser. Nothing that is not strictly necessary is activated until you accept it in the banner.')}
    >
      <Section title={tc('1. What a cookie is')}>
        <p>{tc('A cookie is a small file a website leaves in your browser so it can recognise it on the next visit. This site also uses local storage, which works the same way but never travels back to a server. Both are listed below.')}</p>
      </Section>

      <Section title={tc('2. What this site stores')}>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white/4 text-white/40 text-start">
                <th className="text-start font-medium px-3 py-2.5">{tc('Name')}</th>
                <th className="text-start font-medium px-3 py-2.5">{tc('Set by')}</th>
                <th className="text-start font-medium px-3 py-2.5">{tc('What it does')}</th>
                <th className="text-start font-medium px-3 py-2.5">{tc('Lasts')}</th>
                <th className="text-start font-medium px-3 py-2.5">{tc('Type')}</th>
              </tr>
            </thead>
            <tbody>
              {ALMACENAMIENTO.map((c) => (
                <tr key={c.name} className="border-t border-white/6 align-top">
                  <td className="px-3 py-2.5 whitespace-nowrap"><span className="ltr-num font-mono text-[11px] text-white/80">{c.name}</span></td>
                  <td className="px-3 py-2.5 text-white/50"><span className="ltr-num">{c.provider}</span></td>
                  <td className="px-3 py-2.5 text-white/60">{tc(c.purposeKey)}</td>
                  <td className="px-3 py-2.5 text-white/50 whitespace-nowrap">{tc(c.duration)}</td>
                  <td className="px-3 py-2.5 text-white/50">{tc(c.typeKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">{tc('That is the complete list. There are no social network trackers, no advertising pixels beyond the Google Ads conversion measurement above, and nothing is sold or passed to data brokers.')}</p>
      </Section>

      <Section title={tc('3. Consent, and how to change your mind')}>
        <p>
          {tc('Analytics and advertising storage stay switched off until you press')} <em>{tc('Accept')}</em>{tc('. This is enforced with Google Consent Mode v2, which tells Google not to write anything before your answer.')}
        </p>
        <ul className="mt-3 space-y-2 list-none">
          <Li label={tc('Withdraw consent')}>{tc('Clear this site’s data in your browser. The banner will appear again on your next visit and you can decline.')}</Li>
          <Li label={tc('Block everything')}>{tc('Every browser can block cookies from its privacy settings. The site keeps working: the language switcher is the only thing that will forget you.')}</Li>
          <Li label={tc('Opt out of Google Analytics')}>{tc('Google publishes a browser add-on that blocks its measurement on every site you visit.')}</Li>
        </ul>
      </Section>

      <Section title={tc('4. If you block them')}>
        <p>{tc('Nothing on this site is behind a cookie. Tours, prices, routes, the booking calendar and the five languages all work with everything blocked. You will simply have to pick your language again on each visit.')}</p>
      </Section>

      <Section title={tc('5. Changes to this policy')}>
        <p>{tc('If a new tool is added, it will be listed in the table above before it is switched on, and the date at the top of this page will change.')}</p>
      </Section>
    </LegalPage>
  )
}

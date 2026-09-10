import { Scale } from 'lucide-react'
import { LegalPage, Section, Li } from '../components/LegalPage'
import { useLanguage } from '../contexts/LanguageContext'

const UPDATED = 'September 2026'
const SITE = 'tonykansaiguide.com'

/*
 * Aviso legal. Los datos del titular son los reales de hoy: persona
 * responsable, nombre comercial, actividad, sede y contacto.
 *
 * PENDIENTE: cuando la actividad quede formalmente registrada (en Japón o en
 * España), añadir aquí razón social, número fiscal y domicilio social. Es lo
 * que la ley de comercio electrónico de la UE exige a quien vende a clientes
 * europeos. Hasta entonces la página lo dice tal cual, sin fingir un registro
 * que no existe.
 */
export default function Legal() {
  const { tc } = useLanguage()

  return (
    <LegalPage
      title={tc('Legal Notice')}
      description={tc('Who operates tonykansaiguide.com, under what terms, who owns the content, and which law applies.')}
      path="/legal"
      icon={<Scale size={18} className="text-japan-red" />}
      updated={UPDATED}
      intro={tc('The information the law requires any commercial website to publish: who is behind it, how to reach them, and what you may and may not do with what is on it.')}
    >
      <Section title={tc('1. Who runs this site')}>
        <ul className="mt-1 space-y-2 list-none">
          <Li label={tc('Person responsible')}>Tony Hanma</Li>
          <Li label={tc('Trading name')}>Tony Hanma Private Kansai Tours</Li>
          <Li label={tc('Activity')}>{tc('Private guiding services in the Kansai region of Japan, provided personally by Tony Hanma.')}</Li>
          <Li label={tc('Based in')}>{tc('Osaka, Japan.')}</Li>
          <Li label={tc('Website')}>{SITE}</Li>
          <Li label={tc('Contact')}><span className="ltr-num">WhatsApp +34 634 193 106</span></Li>
          <Li label={tc('Languages')}>{tc('English, Spanish, Arabic, Czech and Russian.')}</Li>
        </ul>
        <p className="mt-3">{tc('The service is provided by Tony Hanma in a personal capacity. Company registration details will be published on this page as soon as the activity is formally registered; until then, this notice states the position as it is rather than implying a registration that does not exist.')}</p>
        <p className="mt-3">{tc('WhatsApp is the only official channel. We never ask for payment through any other messaging account, and we never ask for card details by message.')}</p>
      </Section>

      <Section title={tc('2. What this service is, and is not')}>
        <p>{tc('This is a private guiding service. It is not a licensed travel agency, not a tour operator selling packages, and not a certified mountaineering school. We do not sell flights, accommodation or insurance, and we do not act as an intermediary for anyone who does.')}</p>
        <p className="mt-2">{tc('What we sell is the time and knowledge of a guide for an agreed period, on an agreed route, for your group only.')}</p>
      </Section>

      <Section title={tc('3. Content and intellectual property')}>
        <p>{tc('The texts, route descriptions, itineraries and structure of this site belong to Tony Hanma Private Kansai Tours. You may read, print and share them for your own use. You may not copy them onto another commercial site, sell them, or present them as your own.')}</p>
        <ul className="mt-3 space-y-1.5 list-none">
          <Li label={tc('Photography')}>{tc('Photographs are either taken by the guides or licensed from Unsplash under its licence. Guest photographs are published only with the written permission of the person who sent them.')}</Li>
          <Li label={tc('Guest reviews')}>{tc('Reviews belong to the person who wrote them and are published with their permission. They are never edited to change their meaning; a name may be shortened at the author’s request.')}</Li>
          <Li label={tc('Trade marks')}>{tc('Names of shrines, temples, railway companies and any other third party are used descriptively and belong to their owners.')}</Li>
        </ul>
      </Section>

      <Section title={tc('4. Accuracy and availability')}>
        <p>{tc('Prices, timings and route conditions are kept up to date and are still indicative: a train timetable, a temple’s opening hours or a closed trail can change without notice. The price you pay is the one confirmed in writing before the tour.')}</p>
        <p className="mt-2">{tc('The site is hosted on GitHub Pages and served through Cloudflare. We do not guarantee uninterrupted availability, and we are not liable for a booking not made because the site was down — WhatsApp always works.')}</p>
      </Section>

      <Section title={tc('5. Links to other sites')}>
        <p>{tc('Some pages link out to shrines, railway operators, Google and Unsplash. We do not control those sites and are not responsible for their content or their privacy practices. Their links open in a new tab and carry no referrer data beyond the origin.')}</p>
      </Section>

      <Section title={tc('6. Security of this site')}>
        <ul className="mt-1 space-y-1.5 list-none">
          <Li label={tc('Encryption')}>{tc('The whole site is served over HTTPS. There is no unencrypted version.')}</Li>
          <Li label={tc('No accounts')}>{tc('There is no login, no user database and no password to steal, because none is needed to book.')}</Li>
          <Li label={tc('No payments online')}>{tc('No card details are ever entered on this site. Payment is agreed and made directly, off the website.')}</Li>
          <Li label={tc('Reporting a vulnerability')}>{tc('If you find a security problem, write to us on WhatsApp before disclosing it publicly. There is also a security.txt file at the root of the domain.')}</Li>
        </ul>
      </Section>

      <Section title={tc('7. Complaints')}>
        <p>{tc('Send any complaint directly on WhatsApp. We answer personally. If a complaint cannot be resolved between us, it is handled under the law and jurisdiction set out below.')}</p>
      </Section>

      <Section title={tc('8. Applicable law')}>
        <p>{tc('This notice and any use of the site are governed by the laws of Japan, with jurisdiction in the courts of Osaka. If you contracted a tour as a consumer resident in the European Union, this does not deprive you of the protection of the mandatory consumer rules of your country of residence.')}</p>
      </Section>
    </LegalPage>
  )
}

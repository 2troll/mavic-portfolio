import { Accessibility as AccessibilityIcon } from 'lucide-react'
import { LegalPage, Section, Li } from '../components/LegalPage'
import { useLanguage } from '../contexts/LanguageContext'

const UPDATED = 'September 2026'

export default function Accessibility() {
  const { tc } = useLanguage()

  return (
    <LegalPage
      title={tc('Accessibility')}
      description={tc('What Tony Kansai Guide has done to make this website usable for everyone, what still falls short, and how to tell us about a problem.')}
      path="/accessibility"
      icon={<AccessibilityIcon size={18} className="text-japan-red" />}
      updated={UPDATED}
      intro={tc('A statement of what works, what does not yet, and how to reach a human if the site gets in your way. We would rather admit a gap than claim a standard we have not met.')}
    >
      <Section title={tc('1. What we aim for')}>
        <p>{tc('We build against WCAG 2.2 level AA. We have not commissioned a formal third-party audit, so we do not claim full conformance — what follows is an honest account of where the site stands.')}</p>
      </Section>

      <Section title={tc('2. What works today')}>
        <ul className="mt-1 space-y-1.5 list-none">
          <Li label={tc('Keyboard')}>{tc('Every link, button, filter and calendar day can be reached and used with the keyboard alone, with a visible focus ring.')}</Li>
          <Li label={tc('Screen readers')}>{tc('Headings run in order, images that carry meaning have alternative text, and decorative ones are hidden from the reading order.')}</Li>
          <Li label={tc('Five languages')}>{tc('English, Spanish, Arabic, Czech and Russian, with the page language announced correctly so a screen reader uses the right voice.')}</Li>
          <Li label={tc('Right-to-left')}>{tc('Arabic is laid out right-to-left throughout, with its own typography rather than a mirrored Latin font.')}</Li>
          <Li label={tc('Reduced motion')}>{tc('If your system asks for less motion, the animations and the smooth scrolling stop.')}</Li>
          <Li label={tc('Zoom and small screens')}>{tc('The layout holds at 200% zoom and on a phone, without horizontal scrolling.')}</Li>
          <Li label={tc('No cookie wall')}>{tc('Declining cookies costs you nothing: the whole site works either way.')}</Li>
          <Li label={tc('Contrast')}>{tc('All text on the public pages now meets the AA contrast ratio of 4.5:1 against the dark background. The faintest greys, which used to sit around 2:1 and were genuinely hard to read, were raised in September 2026.')}</Li>
          <Li label={tc('Focus ring')}>{tc('A gold outline follows the keyboard around the site, on every link, button, filter and calendar day.')}</Li>
        </ul>
      </Section>

      <Section title={tc('3. What still falls short')}>
        <ul className="mt-1 space-y-1.5 list-none">
          <Li label={tc('3D scenes')}>{tc('The animated castle and torii on the home page are decorative and convey nothing that is not also written in text — but they are not usable by keyboard.')}</Li>
          <Li label={tc('Route maps')}>{tc('The interactive map is hard to use without a mouse. Every stop it shows is also listed as text underneath it, in order.')}</Li>
          <Li label={tc('Guest photographs')}>{tc('Photographs sent in by guests carry a generic description, because we do not always know what is in them.')}</Li>
        </ul>
      </Section>

      <Section title={tc('4. If the site gets in your way')}>
        <p>{tc('Write to us on WhatsApp and say what happened and what you were trying to do. We answer personally and we fix accessibility problems ahead of new features.')}</p>
        <p className="mt-2">{tc('And if the website is the obstacle, skip it: the entire booking can be done in a WhatsApp conversation, in any of our five languages.')}</p>
      </Section>

      <Section title={tc('5. Accessibility on the tours themselves')}>
        <p>{tc('The website is one thing; the ground is another. Tell us what you need when you book and we will say honestly what is possible.')}</p>
        <ul className="mt-3 space-y-1.5 list-none">
          <Li label={tc('Step-free routes')}>{tc('Parts of Osaka, Nara Park, Uji and the Nunobiki path can be done with limited mobility. Most temple grounds cannot.')}</Li>
          <Li label={tc('Pace')}>{tc('Every city tour can be slowed down or shortened at no extra cost. That is the point of a private guide.')}</Li>
          <Li label={tc('Deaf and hard of hearing guests')}>{tc('The guide can write rather than speak, and will always face you when talking.')}</Li>
          <Li label={tc('Assistance dogs')}>{tc('Welcome. Some shrines and restaurants are not, so tell us in advance and we plan around it.')}</Li>
        </ul>
      </Section>
    </LegalPage>
  )
}

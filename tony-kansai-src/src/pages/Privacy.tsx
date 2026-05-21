import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { PageSEO } from '../components/PageSEO'

const SITE_URL = 'https://tonykansaiguide.com'
const CONTACT_WA = 'https://wa.me/34634193106'
const UPDATED = 'May 2026'

export default function Privacy() {
  return (
    <>
      <PageSEO
        title="Privacy Policy"
        description="Privacy policy for Tony Kansai Guide — how we use Google Analytics, cookies and WhatsApp data. GDPR compliant."
        path="/privacy"
      />
    <section className="relative pt-32 pb-28 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-japan-red/15 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-japan-red" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-white">Privacy Policy</h1>
            <p className="text-xs text-white/35 mt-0.5">Last updated: {UPDATED}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="prose-custom space-y-8 text-white/70 text-sm leading-relaxed"
        >
          <div className="glass rounded-xl border border-white/6 p-5 text-white/55 text-xs">
            This Privacy Policy applies to the website <span className="text-white/80">{SITE_URL}</span> operated by Tony Hanma Private Kansai Tours. By using this site you agree to the practices described below.
          </div>

          <Section title="1. Who We Are">
            <p>We are Tony Hanma Private Kansai Tours, a private tour guide service based in Osaka, Japan. We operate this website to present our services and allow potential guests to get in touch via WhatsApp.</p>
            <p className="mt-2">Contact: <a href={CONTACT_WA} target="_blank" rel="noopener noreferrer" className="text-japan-red">WhatsApp +34 634 193 106</a></p>
          </Section>

          <Section title="2. Data We Collect">
            <ul className="space-y-2 list-none">
              <Li label="Analytics data">Page views, session duration, country, browser, device type — collected anonymously via Google Analytics. No name, email, or phone is collected through this website.</Li>
              <Li label="WhatsApp messages">When you message us directly, WhatsApp processes that communication under <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-japan-red">WhatsApp's own Privacy Policy</a>. We only use the information you send us to respond to your enquiry and arrange your tour.</Li>
              <Li label="Cookies">We use Google Analytics cookies (see Section 4). No advertising or tracking cookies are set by us directly.</Li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>Analytics data is used solely to understand how visitors navigate the site so we can improve it. We do not use it to identify individuals, build profiles, or run targeted advertising without your consent.</p>
            <p className="mt-2">Personal information you share via WhatsApp is used only to answer your questions and organise your tour booking. It is never sold, rented, or shared with third parties.</p>
          </Section>

          <Section title="4. Cookies & Google Analytics">
            <p>We use Google Analytics 4 (GA4) to measure site usage. GA4 uses first-party cookies stored in your browser. The data is sent to Google and stored on Google's servers.</p>
            <p className="mt-2">We use <strong className="text-white/80">Google Consent Mode v2</strong>: analytics cookies are only activated after you click <em>Accept</em> in the cookie banner. If you click <em>Decline</em>, no analytics data is collected.</p>
            <p className="mt-2">You can also opt out at any time via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-japan-red">Google's opt-out browser add-on</a> or by clearing your cookies.</p>
          </Section>

          <Section title="5. Legal Basis (GDPR)">
            <p>For visitors in the European Economic Area, we process analytics data on the basis of your <strong className="text-white/80">consent</strong> (Art. 6(1)(a) GDPR), which you give by accepting the cookie banner. You may withdraw consent at any time by declining or clearing cookies.</p>
            <p className="mt-2">Messages you send us via WhatsApp are processed on the basis of <strong className="text-white/80">legitimate interest</strong> (Art. 6(1)(f) GDPR) to respond to your enquiry, or on the basis of <strong className="text-white/80">pre-contractual steps</strong> (Art. 6(1)(b) GDPR) when you're planning a booking.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>Google Analytics data is retained for 14 months by default (Google's standard). WhatsApp conversation history is managed within WhatsApp and can be deleted by either party at any time.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>If you are in the EU/EEA or UK you have the right to: access the personal data we hold about you; request correction or deletion; object to processing; and lodge a complaint with your local data protection authority.</p>
            <p className="mt-2">To exercise any of these rights, contact us via <a href={CONTACT_WA} target="_blank" rel="noopener noreferrer" className="text-japan-red">WhatsApp</a>.</p>
          </Section>

          <Section title="8. Third-Party Services">
            <ul className="space-y-1.5 list-none">
              <Li label="Google Analytics">analytics.google.com — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-japan-red">Google Privacy Policy</a></Li>
              <Li label="Unsplash">Photo CDN (images.unsplash.com) — no cookies set. <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer" className="text-japan-red">Unsplash Privacy Policy</a></Li>
              <Li label="Google Fonts">fonts.googleapis.com — Google may log font requests. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-japan-red">Google Privacy Policy</a></Li>
              <Li label="WhatsApp">All direct communication. <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-japan-red">WhatsApp Privacy Policy</a></Li>
            </ul>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this policy occasionally. The "Last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <div className="pt-4 border-t border-white/6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl glass border border-white/10 text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Back to Home
            </Link>
            <a
              href={CONTACT_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-japan-red/15 border border-japan-red/25 text-japan-red hover:bg-japan-red/25 text-sm transition-colors"
            >
              Questions? WhatsApp us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Li({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-japan-red font-medium flex-shrink-0">{label}:</span>
      <span>{children}</span>
    </li>
  )
}

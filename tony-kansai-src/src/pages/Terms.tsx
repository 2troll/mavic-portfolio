import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { PageSEO } from '../components/PageSEO'

const CONTACT_WA = 'https://wa.me/34634193106'
const UPDATED = 'May 2026'

export default function Terms() {
  return (
    <>
      <PageSEO
        title="Terms & Conditions"
        description="Terms and conditions for booking a private guided tour with Tony Kansai Guide in Osaka, Kyoto and Kansai region."
        path="/terms"
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
              <FileText size={18} className="text-japan-red" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-white">Terms & Conditions</h1>
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
              Please read these Terms & Conditions carefully before booking a tour with Tony Kansai Guide. By confirming a booking you agree to the terms set out below.
            </div>

            <Section title="1. About the Service">
              <p>Tony Kansai Guide ("we", "us", "the guide") provides 100% private, bespoke guided tour experiences in the Kansai region of Japan, including but not limited to Osaka, Kyoto, Nara, Kobe, Himeji and Kōyasan. Tours are conducted personally by Tony Hanma or by one of our approved guides (Johnny Coletta, Larion).</p>
              <p className="mt-2">All tours are private — your group only. We do not operate shared or group tours with other guests.</p>
            </Section>

            <Section title="2. Booking Process">
              <p>Bookings are made directly via WhatsApp. A booking is confirmed only when both parties have agreed on the tour date, time, meeting point, and price, and the client has received a written confirmation from the guide.</p>
              <p className="mt-2">No automated booking system or online payment is in place. Payment arrangements are agreed individually during the booking conversation.</p>
            </Section>

            <Section title="3. Pricing & Payment">
              <p>All prices are quoted per group, not per person, unless explicitly stated otherwise. Prices cover the guide's time and expertise for the agreed duration. The following are <strong className="text-white/80">not included</strong> unless specifically confirmed in writing:</p>
              <ul className="mt-2 space-y-1 list-none">
                <Li label="Transport">Train, bus, taxi or other transport costs are paid by the client directly.</Li>
                <Li label="Entry fees">Temple, museum or attraction admission fees are paid by the client.</Li>
                <Li label="Food & drink">All meals, tastings and drinks are at the client's own expense.</Li>
                <Li label="Tips">Gratuities are entirely at the client's discretion and never expected.</Li>
              </ul>
              <p className="mt-3">Payment method (cash, bank transfer, etc.) is agreed at the time of booking. We reserve the right to request a deposit for tours booked more than 30 days in advance.</p>
            </Section>

            <Section title="4. Cancellation Policy">
              <p>We understand that plans change. Our cancellation terms are as follows:</p>
              <div className="mt-3 space-y-2">
                <div className="flex gap-3 items-start">
                  <span className="w-28 flex-shrink-0 text-japan-gold font-medium">72 h or more</span>
                  <span>Full refund of any deposit paid. No charge.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-28 flex-shrink-0 text-japan-orange font-medium">48 – 72 h</span>
                  <span>50% of the agreed tour price is charged.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-28 flex-shrink-0 text-japan-red font-medium">Less than 24 h</span>
                  <span>Full tour price is charged. No refund.</span>
                </div>
              </div>
              <p className="mt-3">Cancellations must be communicated directly via WhatsApp. The time of the WhatsApp message is used to determine the notice period.</p>
              <p className="mt-2">In the rare event that we must cancel (illness, force majeure, extreme weather), a full refund of any deposit will be issued and we will offer to reschedule at no extra cost.</p>
            </Section>

            <Section title="5. Meeting & Punctuality">
              <p>The meeting point and start time are agreed at the time of booking. If a client is more than 30 minutes late without prior notice, we reserve the right to treat the tour as a no-show and apply the full cancellation fee.</p>
              <p className="mt-2">We are not responsible for delays or missed connections caused by public transport, traffic, or circumstances outside our control.</p>
            </Section>

            <Section title="6. Health, Safety & Conduct">
              <p>Clients participate in all activities at their own risk. Tour routes may include walking on uneven terrain, stairs, or steep paths. Please inform us of any mobility limitations or medical conditions when booking so we can adapt the itinerary.</p>
              <p className="mt-2">We reserve the right to refuse service or end a tour without refund if a client's behaviour is disruptive, disrespectful to local culture or religious sites, or poses a risk to themselves or others.</p>
              <p className="mt-2">Japanese customs and temple/shrine etiquette will be explained during the tour. Clients are expected to follow guidance given by the guide on-site.</p>
            </Section>

            <Section title="7. Photography & Privacy">
              <p>You are welcome to photograph and film throughout the tour for personal use. Some sacred sites may restrict photography — your guide will advise you on the spot.</p>
              <p className="mt-2">We may occasionally photograph tour moments for use on our website or social media. If you prefer not to appear in any published photos, please let us know at the start of the tour and we will respect that preference entirely.</p>
            </Section>

            <Section title="8. Limitation of Liability">
              <p>Tony Kansai Guide acts as a private guide service and is not a licensed travel agency. We are not responsible for loss, theft, injury, or damage to property during any tour.</p>
              <p className="mt-2">We strongly recommend all clients obtain comprehensive travel insurance before travelling to Japan, covering medical expenses, personal liability, and trip cancellation.</p>
              <p className="mt-2">Our maximum liability in any circumstances shall not exceed the total amount paid for the tour in question.</p>
            </Section>

            <Section title="9. Changes to the Tour">
              <p>Itineraries are suggestions, not fixed contracts. The guide may adapt the route on the day due to weather, crowds, opening hours, or client preference. This flexibility is a feature of private guiding, not a deficiency.</p>
              <p className="mt-2">Significant changes requested by the client on the day (e.g. adding a full-day stop not in the original plan) may incur additional fees, agreed verbally at the time.</p>
            </Section>

            <Section title="10. Governing Law">
              <p>These terms are governed by the laws of Japan. Any disputes shall be resolved first through good-faith negotiation via WhatsApp. If resolution cannot be reached, disputes shall be subject to the jurisdiction of the courts of Osaka, Japan.</p>
            </Section>

            <Section title="11. Contact">
              <p>Questions about these terms? Reach us directly:</p>
              <p className="mt-2">
                <a href={CONTACT_WA} target="_blank" rel="noopener noreferrer" className="text-japan-red">
                  WhatsApp +34 634 193 106
                </a>
              </p>
            </Section>

            <div className="border-t border-white/8 pt-8 mt-8">
              <p className="text-xs font-semibold text-japan-red uppercase tracking-widest mb-6">⛰️ Hiking Guide — Términos adicionales</p>

              <Section title="12. Servicio de guía de montaña">
                <p>Las rutas de senderismo son conducidas personalmente por Tony Hanma como guía privado de montaña. No somos una empresa de escalada certificada ni un operador de deportes de aventura con licencia. El servicio consiste en acompañamiento, orientación y narración de los parajes visitados.</p>
                <p className="mt-2">Cada ruta indica el nivel de dificultad (Easy / Moderate / Hard / Technical / Expert Only). El cliente es responsable de evaluar honestamente su condición física antes de reservar. Si existe cualquier duda médica, consulte a su médico antes de confirmar.</p>
              </Section>

              <Section title="13. Seguridad y exención de responsabilidad en montaña">
                <p>Las rutas de senderismo conllevan riesgos inherentes: terreno irregular, piedras sueltas, pendientes pronunciadas, exposición al sol, lluvia, niebla o frío extremo. El cliente acepta y comprende estos riesgos al confirmar la reserva.</p>
                <div className="mt-3 space-y-1.5">
                  <Li label="Condición física">El cliente confirma que se encuentra en condición física adecuada para la ruta reservada.</Li>
                  <Li label="Equipo">El cliente es responsable de llevar el equipo indicado en la página de la ruta (calzado de senderismo, agua, capas de ropa, etc.).</Li>
                  <Li label="Emergencias">En caso de emergencia en montaña, se llamará al número de emergencias de Japón (110 policía / 119 ambulancia). El cliente asume los costes de rescate si los hubiera.</Li>
                  <Li label="Seguro">Se recomienda encarecidamente contratar un seguro de viaje con cobertura de rescate en montaña antes de realizar cualquier ruta.</Li>
                </div>
                <p className="mt-3">Tony Kansai Guide no acepta ninguna responsabilidad por lesiones, accidentes, pérdida de objetos personales o situaciones de emergencia ocurridas durante o después de la ruta de senderismo.</p>
              </Section>

              <Section title="14. Cancelación por condiciones meteorológicas">
                <p>Las rutas de senderismo pueden cancelarse o modificarse por condiciones climatológicas adversas (tormenta, nieve intensa, aviso de tifón, senderos cerrados por las autoridades). En estos casos:</p>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-3 items-start">
                    <span className="w-36 flex-shrink-0 text-japan-gold font-medium">Cancelación por clima</span>
                    <span>Reembolso completo de cualquier depósito pagado. Sin penalización.</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-36 flex-shrink-0 text-japan-orange font-medium">Ruta alternativa</span>
                    <span>Si ambas partes acuerdan una ruta alternativa de nivel similar, el precio original se mantiene.</span>
                  </div>
                </div>
                <p className="mt-2">La decisión de cancelar por seguridad corresponde al guía. Su criterio prevalece sobre la preferencia del cliente.</p>
              </Section>

              <Section title="15. Contratos y confirmación de reserva">
                <p>Para reservas de senderismo de alto nivel (Hard, Technical, Expert Only) o grupos de más de 4 personas, se puede solicitar un contrato de servicio por escrito. Este documento recoge: nombre del cliente, ruta, fecha, precio acordado, forma de pago, y la exención de responsabilidad firmada.</p>
                <p className="mt-2">El contrato se genera desde nuestro panel interno y se envía al cliente por WhatsApp en PDF antes del tour. La firma puede realizarse digitalmente (WhatsApp) o en papel el día del encuentro.</p>
              </Section>

              <Section title="16. Métodos de pago y depósitos">
                <p>Aceptamos los siguientes métodos de pago para los servicios de senderismo:</p>
                <div className="mt-3 space-y-1.5">
                  <Li label="Efectivo">Yenes japoneses (JPY) el día del tour. Método preferido.</Li>
                  <Li label="Wise">Transferencia internacional vía Wise a cuenta EUR/GBP/USD. Datos facilitados al confirmar reserva.</Li>
                  <Li label="Transferencia bancaria">Disponible para reservas con más de 7 días de antelación.</Li>
                  <Li label="Tarjeta">Bajo consulta previa según disponibilidad.</Li>
                </div>
                <p className="mt-3">Para rutas Expert Only o Consultation, se puede requerir un <strong className="text-white/80">depósito del 30%</strong> no reembolsable al confirmar la reserva, para cubrir la planificación previa de la ruta.</p>
                <p className="mt-2">Los precios mostrados en el sitio son orientativos. El precio final se acuerda por WhatsApp y queda confirmado por escrito antes del tour.</p>
              </Section>
            </div>

            <div className="pt-4 border-t border-white/6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl glass border border-white/10 text-white/70 hover:text-white text-sm transition-colors"
              >
                ← Back to Home
              </Link>
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl glass border border-white/10 text-white/70 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
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

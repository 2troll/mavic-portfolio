import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageCircle, Check, Clock, Users, MapPin, Minus, Plus } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { TOURS, WHATSAPP } from '../lib/data'
import { PageSEO } from '../components/PageSEO'
import { FadeUp } from '../components/FadeUp'
import { Card3D } from '../components/Card3D'
import { HeroTextKinetic } from '../components/HeroTextKinetic'

// ── Calendar helpers ────────────────────────────────────────────────────────
function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}
function getFirstDow(y: number, m: number) {
  return new Date(y, m, 1).getDay()
}
function isToday(y: number, m: number, d: number) {
  const n = new Date()
  return n.getFullYear() === y && n.getMonth() === m && n.getDate() === d
}
function isPast(y: number, m: number, d: number) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(y, m, d) < today
}

export default function Booking() {
  const { t, lang } = useLanguage()
  const bp = t.booking_page

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<{ y: number; m: number; d: number } | null>(null)
  const [selectedTour, setSelectedTour] = useState(TOURS[1]) // Hidden Kyoto default
  const [guests, setGuests] = useState(2)
  const [notes, setNotes] = useState('')

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDow = getFirstDow(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const formatSelectedDate = () => {
    if (!selectedDate) return ''
    const d = new Date(selectedDate.y, selectedDate.m, selectedDate.d)
    return d.toLocaleDateString(lang === 'ar' ? 'ar-SA' : lang === 'cs' ? 'cs-CZ' : lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  const waHref = () => {
    if (!selectedDate) return WHATSAPP
    const msg = bp.wa_msg(selectedTour.title, formatSelectedDate(), guests, notes)
    return `${WHATSAPP}?text=${encodeURIComponent(msg)}`
  }

  const isSelected = (d: number) =>
    selectedDate?.y === viewYear && selectedDate?.m === viewMonth && selectedDate?.d === d

  return (
    <>
      <PageSEO
        title="Book a Private Japan Tour · Kansai Guide"
        description="Choose your tour, select a date and send Tony a WhatsApp message. Private guided tours in Osaka, Kyoto & Kansai from ¥75,000 per group."
        path="/booking"
        breadcrumb={[{ name: 'Book', path: '/booking' }]}
      />
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-japan-red/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4"
          >
            {bp.label}
          </motion.div>
          <div className="mb-4">
            <HeroTextKinetic
              text={bp.heading}
              className="justify-center text-4xl md:text-5xl font-serif font-semibold"
              delay={0.1}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-lg font-light max-w-xl mx-auto"
          >
            {bp.sub}
          </motion.p>
        </div>
      </section>

      {/* Main booking UI */}
      <section className="pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ── Left column: steps ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* STEP 1: Choose Tour */}
              <FadeUp>
                <div className="glass rounded-2xl border border-white/6 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-full bg-japan-red flex items-center justify-center text-xs font-bold text-white flex-shrink-0">1</div>
                    <h2 className="font-serif text-xl font-semibold text-white">{bp.step1}</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {TOURS.map((tour) => (
                      <button
                        key={tour.id}
                        onClick={() => setSelectedTour(tour)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedTour.id === tour.id
                            ? 'border-japan-red/50 bg-japan-red/8'
                            : 'border-white/6 bg-white/3 hover:border-white/15 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div
                            className="text-xs font-bold tracking-widest uppercase"
                            style={{ color: tour.accent }}
                          >
                            {tour.badge}
                          </div>
                          {selectedTour.id === tour.id && (
                            <div className="w-4 h-4 rounded-full bg-japan-red flex items-center justify-center flex-shrink-0">
                              <Check size={9} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="font-serif text-sm font-semibold text-white mb-1">{tour.title}</div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs" style={{ color: tour.accent }}>{tour.price}</span>
                          <span className="text-[11px] text-white/40 flex items-center gap-1">
                            <Clock size={9} />{tour.duration}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* STEP 2: Calendar */}
              <FadeUp delay={0.05}>
                <div className="glass rounded-2xl border border-white/6 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-full bg-japan-red flex items-center justify-center text-xs font-bold text-white flex-shrink-0">2</div>
                    <h2 className="font-serif text-xl font-semibold text-white">{bp.step2}</h2>
                  </div>

                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-5">
                    <button
                      onClick={prevMonth}
                      aria-label={bp.prev_month}
                      className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-japan-red/40 transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div className="font-serif text-lg font-semibold text-white">
                      {bp.months[viewMonth]} {viewYear}
                    </div>
                    <button
                      onClick={nextMonth}
                      aria-label={bp.next_month}
                      className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-japan-red/40 transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {bp.days.map((day) => (
                      <div key={day} className="text-center text-[11px] font-semibold text-white/30 tracking-wide py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((cell, i) => {
                      if (cell === null) return <div key={`pad-${i}`} />
                      const past = isPast(viewYear, viewMonth, cell)
                      const today = isToday(viewYear, viewMonth, cell)
                      const sel = isSelected(cell)

                      return (
                        <motion.button
                          key={`day-${cell}`}
                          disabled={past}
                          onClick={() => setSelectedDate({ y: viewYear, m: viewMonth, d: cell })}
                          whileHover={past ? {} : { scale: 1.1 }}
                          whileTap={past ? {} : { scale: 0.95 }}
                          className={`
                            relative h-9 w-full rounded-lg text-sm font-medium transition-colors
                            ${past ? 'text-white/15 cursor-not-allowed' : 'cursor-pointer'}
                            ${sel ? 'bg-japan-red text-white shadow-lg shadow-japan-red/40' : ''}
                            ${!sel && today ? 'text-japan-red border border-japan-red/40' : ''}
                            ${!sel && !today && !past ? 'text-white/70 hover:bg-white/8 hover:text-white' : ''}
                          `}
                        >
                          {cell}
                          {today && !sel && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-japan-red" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>

                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 px-4 py-2.5 rounded-xl bg-japan-red/10 border border-japan-red/25 text-sm text-white/80 text-center"
                    >
                      {formatSelectedDate()}
                    </motion.div>
                  )}
                </div>
              </FadeUp>

              {/* STEP 3: Guests */}
              <FadeUp delay={0.1}>
                <div className="glass rounded-2xl border border-white/6 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-full bg-japan-red flex items-center justify-center text-xs font-bold text-white flex-shrink-0">3</div>
                    <h2 className="font-serif text-xl font-semibold text-white">{bp.step3}</h2>
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => setGuests(g => Math.max(1, g - 1))}
                      className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-japan-red/40 transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="text-center min-w-[60px]">
                      <div className="font-serif text-3xl font-bold text-gradient-japan">{guests}</div>
                      <div className="text-xs text-white/40">{bp.guests_label}</div>
                    </div>
                    <button
                      onClick={() => setGuests(g => Math.min(15, g + 1))}
                      className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-japan-red/40 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </FadeUp>

              {/* STEP 4: Notes */}
              <FadeUp delay={0.15}>
                <div className="glass rounded-2xl border border-white/6 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-full bg-japan-red flex items-center justify-center text-xs font-bold text-white flex-shrink-0">4</div>
                    <h2 className="font-serif text-xl font-semibold text-white">{bp.step4}</h2>
                  </div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={bp.notes_placeholder}
                    rows={4}
                    className="w-full bg-[#12141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-japan-red/40 resize-none transition-colors"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </FadeUp>
            </div>

            {/* ── Right column: summary / CTA ────────────────────── */}
            <div className="space-y-5 lg:sticky lg:top-24">
              <FadeUp delay={0.2}>
                <Card3D glowColor="rgba(229,48,48,0.25)">
                  <div className="glass rounded-2xl border border-japan-red/20 p-6 space-y-5">

                    {/* Tour summary */}
                    <div>
                      <div
                        className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1"
                        style={{ color: selectedTour.accent }}
                      >
                        {selectedTour.subtitle}
                      </div>
                      <div className="font-serif text-xl font-semibold text-white mb-3">{selectedTour.title}</div>
                      <div className="space-y-2 text-sm text-white/55">
                        <div className="flex items-center gap-2">
                          <Clock size={13} style={{ color: selectedTour.accent }} />
                          {selectedTour.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={13} style={{ color: selectedTour.accent }} />
                          {selectedTour.meetingPoint}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={13} style={{ color: selectedTour.accent }} />
                          {guests} {bp.guests_label}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/6 pt-4">
                      <div className="font-serif text-2xl font-bold text-gradient-japan mb-1">{selectedTour.price}</div>
                      <div className="text-xs text-white/35">{bp.per_group}</div>
                    </div>

                    {selectedDate && (
                      <div className="px-3 py-2 rounded-lg bg-japan-red/8 border border-japan-red/20 text-xs text-white/70">
                        {formatSelectedDate()}
                      </div>
                    )}

                    <a
                      href={waHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-lg shadow-japan-red/35 transition-all ${selectedDate ? 'hover:scale-105 hover:shadow-japan-red/55' : 'opacity-60 cursor-not-allowed pointer-events-none'}`}
                    >
                      <MessageCircle size={15} /> {bp.cta}
                    </a>

                    {!selectedDate && (
                      <p className="text-center text-xs text-white/30">{bp.step2} ↑</p>
                    )}

                    <p className="text-center text-[11px] text-white/35 leading-relaxed">{bp.note}</p>
                  </div>
                </Card3D>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

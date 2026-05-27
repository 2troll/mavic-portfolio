import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Home, Calendar, List, Settings, Plus, ArrowLeft,
  Eye, EyeOff, LogOut, Download, Upload, Trash2,
  Edit2, ChevronLeft, ChevronRight, MessageCircle,
  User, Clock, Users, MapPin, Phone, FileText, X,
} from 'lucide-react'
import {
  AdminBooking, BookingStatus, Guide,
  getBookings, upsertBooking, removeBooking, newId,
  verifyPassword, changePassword, isAuthed, setAuthed,
  exportJSON, importJSON,
} from '../lib/adminData'
import { TOURS, HIKING_ROUTES } from '../lib/data'
import { generateContract, CONTRACT_LANGS, ContractLang } from '../lib/contractPDF'

// ── Constants ─────────────────────────────────────────────────────────────

type View = 'login' | 'home' | 'calendar' | 'list' | 'form' | 'detail' | 'settings'
type NavTab = 'home' | 'calendar' | 'list' | 'settings'

const GUIDES: Guide[] = ['Tony', 'Johnny', 'Larion']
const LANGS = ['EN', 'ES', 'AR', 'CS', 'RU', 'JA', 'FR', 'DE', 'IT', 'PT']
const PAY_METHODS: AdminBooking['paymentMethod'][] = ['efectivo', 'transferencia', 'tarjeta', 'wise', 'otro']
const WISE_CURRENCIES = ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'CHF', 'SGD']

const STATUS_LABEL: Record<BookingStatus, string> = {
  pendiente: 'Pendiente', confirmado: 'Confirmado',
  completado: 'Completado', cancelado: 'Cancelado',
}
const STATUS_COLOR: Record<BookingStatus, string> = {
  pendiente: '#F59E0B', confirmado: '#3B82F6',
  completado: '#10B981', cancelado: '#6B7280',
}

// ── Helpers ───────────────────────────────────────────────────────────────

const todayStr = () => new Date().toISOString().slice(0, 10)
const fmtDate = (d: string) => { if (!d) return '—'; const [y, m, day] = d.split('-'); return `${day}/${m}/${y}` }
const fmtMoney = (n: number) => `¥${n.toLocaleString('ja-JP')}`
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches' }
const tourPrice = (name: string) => {
  const t = TOURS.find(t => t.title === name)
  if (t) return parseInt(t.price.replace(/[^0-9]/g, ''), 10)
  const clean = name.replace(/^⛰️\s*/, '')
  const h = HIKING_ROUTES.find(h => h.title === clean)
  if (h && h.price !== 'Consultation') return parseInt(h.price.replace(/[^0-9]/g, ''), 10)
  return 0
}

function emptyForm(): Omit<AdminBooking, 'id' | 'createdAt'> {
  return {
    name: '', phone: '', email: '', nationality: '', language: 'EN',
    tour: '', date: todayStr(), time: '09:00', guests: 2, guide: 'Tony',
    hotel: '', meetingPoint: '', notes: '',
    totalPrice: 0, paidAmount: 0, paymentMethod: 'efectivo', status: 'pendiente',
  }
}

// ── Shared styles ─────────────────────────────────────────────────────────

const card = 'bg-[#1C1F30] rounded-2xl p-4 border border-white/6'
const inp = 'w-full bg-[#12141F] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#E53030]/50 placeholder-white/20'
const labelCls = 'text-[10px] text-white/35 font-semibold uppercase tracking-widest mb-1.5 block'
const sectionCls = 'text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-3 mt-7 first:mt-0'
const btnRed = 'w-full py-3 rounded-xl bg-[#E53030] text-white text-sm font-semibold active:opacity-75 transition-opacity'
const btnGhost = 'w-full py-3 rounded-xl border border-white/10 text-white/55 text-sm font-medium active:opacity-75 transition-opacity'

// ── BookingCard ───────────────────────────────────────────────────────────

function BookingCard({ b, onClick }: { b: AdminBooking; onClick: () => void }) {
  const owed = Math.max(0, b.totalPrice - b.paidAmount)
  return (
    <button onClick={onClick} className={card + ' w-full text-left active:opacity-80 transition-opacity'}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 inline-block"
            style={{ background: STATUS_COLOR[b.status] + '20', color: STATUS_COLOR[b.status] }}
          >
            {STATUS_LABEL[b.status]}
          </span>
          <p className="text-white font-medium text-sm truncate">{b.name}</p>
          <p className="text-white/40 text-xs truncate">{b.tour || '—'}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white/60 text-xs">{b.time} · {b.guests}px</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: owed > 0 ? '#F59E0B' : '#10B981' }}>
            {owed > 0 ? `Debe ${fmtMoney(owed)}` : 'Pagado ✓'}
          </p>
          <p className="text-white/25 text-[10px]">{b.guide}</p>
        </div>
      </div>
      {b.hotel && <p className="text-white/25 text-xs mt-1.5 truncate">🏨 {b.hotel}</p>}
    </button>
  )
}

// ── Field ─────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className={labelCls}>{label}</p>{children}</div>
}

// ── Row (detail info line) ────────────────────────────────────────────────

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-white/20 flex-shrink-0">{icon}</span>
      <span className="text-white/30 text-xs w-24 flex-shrink-0">{label}</span>
      <span className="text-white/75 text-sm">{value}</span>
    </div>
  )
}

// ── LOGIN ─────────────────────────────────────────────────────────────────

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!pass) return
    setLoading(true)
    const ok = await verifyPassword(pass)
    setLoading(false)
    if (ok) { setAuthed(true); onLogin() }
    else { setErr('Contraseña incorrecta'); setPass('') }
  }

  return (
    <div className="min-h-screen bg-[#0C0D16] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#E53030]/12 flex items-center justify-center mx-auto mb-5 text-3xl">🗓</div>
          <h1 className="text-white text-2xl font-serif font-semibold">Tony Admin</h1>
          <p className="text-white/30 text-sm mt-1">Panel de gestión privado</p>
        </div>

        <div className="relative mb-3">
          <input
            type={show ? 'text' : 'password'}
            value={pass}
            onChange={e => { setPass(e.target.value); setErr('') }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Contraseña"
            className={inp + ' pr-10'}
            autoFocus
          />
          <button onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {err && <p className="text-[#E53030] text-xs text-center mb-3">{err}</p>}
        <button onClick={submit} disabled={loading} className={btnRed + ' disabled:opacity-50'}>
          {loading ? '…' : 'Entrar'}
        </button>
        <p className="text-white/15 text-xs text-center mt-6">Contraseña por defecto: tony2024</p>
      </div>
    </div>
  )
}

// ── HOME ──────────────────────────────────────────────────────────────────

function HomeView({ bookings, onNew, onDetail }: { bookings: AdminBooking[]; onNew: () => void; onDetail: (b: AdminBooking) => void }) {
  const t = todayStr()
  const in7 = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)
  const todayB = bookings.filter(b => b.date === t && b.status !== 'cancelado').sort((a, b) => a.time.localeCompare(b.time))
  const nextB = bookings.filter(b => b.date > t && b.date <= in7 && b.status !== 'cancelado').sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  const pendingTotal = bookings.filter(b => b.status !== 'cancelado').reduce((s, b) => s + Math.max(0, b.totalPrice - b.paidAmount), 0)
  const dateLabel = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="pb-28 px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-white/35 text-sm">{greet()}, Tony 👋</p>
          <h1 className="text-white text-xl font-semibold capitalize mt-0.5">{dateLabel}</h1>
        </div>
        <button onClick={onNew} className="w-11 h-11 rounded-xl bg-[#E53030] flex items-center justify-center shadow-lg shadow-[#E53030]/30">
          <Plus size={22} className="text-white" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: 'Hoy', value: todayB.length.toString(), unit: 'tours', color: '#E53030' },
          { label: 'Esta semana', value: nextB.length.toString(), unit: 'próximos', color: '#3B82F6' },
          { label: 'Por cobrar', value: fmtMoney(pendingTotal), unit: 'pendiente', color: pendingTotal > 0 ? '#F59E0B' : '#10B981' },
        ].map(s => (
          <div key={s.label} className={card + ' text-center'}>
            <p className="text-white/25 text-[10px] uppercase tracking-wide">{s.label}</p>
            <p className="font-semibold text-sm mt-0.5 truncate" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/20 text-[10px]">{s.unit}</p>
          </div>
        ))}
      </div>

      <p className={sectionCls}>Hoy</p>
      {todayB.length === 0
        ? <div className={card + ' text-center py-6'}><p className="text-white/25 text-sm">Sin tours hoy 🌸</p></div>
        : <div className="space-y-3">{todayB.map(b => <BookingCard key={b.id} b={b} onClick={() => onDetail(b)} />)}</div>
      }

      {nextB.length > 0 && (
        <>
          <p className={sectionCls}>Próximos 7 días</p>
          <div className="space-y-3">
            {nextB.slice(0, 6).map(b => (
              <div key={b.id}>
                <p className="text-white/20 text-[10px] mb-1 ml-1 capitalize">{new Date(b.date + 'T12:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <BookingCard b={b} onClick={() => onDetail(b)} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── CALENDAR ──────────────────────────────────────────────────────────────

function CalendarView({ bookings, onDetail, onNew }: { bookings: AdminBooking[]; onDetail: (b: AdminBooking) => void; onNew: () => void }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selDay, setSelDay] = useState<string | null>(todayStr())

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = new Date(year, month, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const t = todayStr()

  const dotMap = new Map<string, number>()
  bookings.forEach(b => {
    if (b.date.startsWith(monthStr) && b.status !== 'cancelado')
      dotMap.set(b.date, (dotMap.get(b.date) || 0) + 1)
  })

  const prev = () => month === 0 ? (setYear(y => y - 1), setMonth(11)) : setMonth(m => m - 1)
  const next = () => month === 11 ? (setYear(y => y + 1), setMonth(0)) : setMonth(m => m + 1)

  const selBookings = selDay ? bookings.filter(b => b.date === selDay && b.status !== 'cancelado').sort((a, b) => a.time.localeCompare(b.time)) : []

  return (
    <div className="pb-28 px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><ChevronLeft size={16} className="text-white/50" /></button>
        <p className="text-white font-medium capitalize">{new Date(year, month).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
        <button onClick={next} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><ChevronRight size={16} className="text-white/50" /></button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
          <p key={d} className="text-center text-[10px] text-white/20 font-semibold py-1">{d}</p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1
          const ds = `${monthStr}-${String(d).padStart(2, '0')}`
          const isTod = ds === t
          const isSel = ds === selDay
          const dots = dotMap.get(ds) || 0
          return (
            <button
              key={d}
              onClick={() => setSelDay(ds === selDay ? null : ds)}
              className="flex flex-col items-center py-1.5 rounded-xl"
              style={{ background: isSel ? '#E53030' : isTod ? 'rgba(229,48,48,0.12)' : 'transparent' }}
            >
              <span className={`text-sm font-medium ${isSel ? 'text-white' : isTod ? 'text-[#E53030]' : 'text-white/65'}`}>{d}</span>
              {dots > 0 && <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: isSel ? 'rgba(255,255,255,0.6)' : '#E53030' }} />}
            </button>
          )
        })}
      </div>

      {selDay && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className={sectionCls.replace('mt-7', 'mt-0')}>{fmtDate(selDay)}</p>
            <button onClick={onNew} className="text-[#E53030] text-xs font-semibold flex items-center gap-1"><Plus size={12} /> Nueva</button>
          </div>
          {selBookings.length === 0
            ? <p className="text-white/20 text-sm text-center py-4">Sin reservas este día</p>
            : <div className="space-y-3">{selBookings.map(b => <BookingCard key={b.id} b={b} onClick={() => onDetail(b)} />)}</div>
          }
        </div>
      )}
    </div>
  )
}

// ── LIST ──────────────────────────────────────────────────────────────────

function ListView({ bookings, onDetail, onNew }: { bookings: AdminBooking[]; onDetail: (b: AdminBooking) => void; onNew: () => void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | BookingStatus>('all')

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => !search || [b.name, b.tour, b.phone, b.hotel].some(s => s.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="pb-28 px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Reservas</h2>
        <button onClick={onNew} className="w-10 h-10 rounded-xl bg-[#E53030] flex items-center justify-center shadow-lg shadow-[#E53030]/30">
          <Plus size={20} className="text-white" />
        </button>
      </div>

      <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, tour, teléfono…" className={inp + ' mb-3'} />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {(['all', 'pendiente', 'confirmado', 'completado', 'cancelado'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: filter === f ? '#E53030' : 'rgba(255,255,255,0.06)', color: filter === f ? '#fff' : 'rgba(255,255,255,0.45)' }}
          >
            {f === 'all' ? 'Todas' : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className={card + ' text-center py-10'}><p className="text-white/20 text-sm">Sin resultados</p></div>
        : (
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b.id}>
                <p className="text-white/20 text-[10px] mb-1 ml-1">{fmtDate(b.date)}</p>
                <BookingCard b={b} onClick={() => onDetail(b)} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

// ── CONTRACT PICKER ───────────────────────────────────────────────────────

function ContractPicker({ data, onClose }: { data?: Parameters<typeof generateContract>[1]; onClose: () => void }) {
  const open = (lang: ContractLang) => {
    const html = generateContract(lang, data)
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-sm bg-[#1C1F30] rounded-t-2xl p-5 pb-8" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-5" />
        <p className="text-white font-semibold mb-1">Generar contrato</p>
        <p className="text-white/35 text-xs mb-4">Selecciona el idioma del cliente</p>
        <div className="grid grid-cols-2 gap-2">
          {CONTRACT_LANGS.map(([lang, meta]) => (
            <button
              key={lang}
              onClick={() => open(lang)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-left active:opacity-75"
            >
              <span className="text-2xl leading-none">{meta.flag}</span>
              <div>
                <p className="text-white text-sm font-medium">{meta.label}</p>
                <p className="text-white/30 text-[10px]">PDF / Imprimir</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── DETAIL ────────────────────────────────────────────────────────────────

function DetailView({ b, onEdit, onBack, onDelete, onMarkPaid }: {
  b: AdminBooking; onEdit: () => void; onBack: () => void; onDelete: () => void; onMarkPaid: () => void
}) {
  const [showContract, setShowContract] = useState(false)
  const owed = Math.max(0, b.totalPrice - b.paidAmount)
  const waMsg = encodeURIComponent(
    `Hola ${b.name}! Tu tour "${b.tour}" está confirmado para el ${fmtDate(b.date)} a las ${b.time}. ` +
    (b.meetingPoint ? `Punto de encuentro: ${b.meetingPoint}. ` : b.hotel ? `Nos vemos en ${b.hotel}. ` : '') +
    `Guía: ${b.guide}. ¡Hasta pronto! 🎌`
  )

  return (
    <div className="pb-28 px-4 pt-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><ArrowLeft size={18} className="text-white/60" /></button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold truncate">{b.name}</h2>
          <p className="text-white/35 text-xs truncate">{b.tour}</p>
        </div>
        <button onClick={onEdit} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><Edit2 size={15} className="text-white/60" /></button>
        <button onClick={onDelete} className="w-9 h-9 rounded-xl bg-[#E53030]/10 flex items-center justify-center"><Trash2 size={15} className="text-[#E53030]" /></button>
      </div>

      <div className="rounded-xl p-3 mb-4 flex items-center justify-between" style={{ background: STATUS_COLOR[b.status] + '15' }}>
        <span style={{ color: STATUS_COLOR[b.status] }} className="font-semibold text-sm">{STATUS_LABEL[b.status]}</span>
        <span className="text-white/35 text-xs">{fmtDate(b.date)} · {b.time}</span>
      </div>

      {/* Tour info */}
      <div className={card + ' mb-3 space-y-2.5'}>
        <Row icon={<Calendar size={14} />} label="Tour" value={b.tour} />
        <Row icon={<Users size={14} />} label="Personas" value={`${b.guests} personas`} />
        <Row icon={<Clock size={14} />} label="Hora salida" value={b.time} />
        <Row icon={<User size={14} />} label="Guía" value={b.guide} />
        <Row icon={<MapPin size={14} />} label="Hotel" value={b.hotel} />
        <Row icon={<MapPin size={14} />} label="Encuentro" value={b.meetingPoint} />
        {b.notes && <Row icon={<User size={14} />} label="Notas" value={b.notes} />}
      </div>

      {/* Client */}
      <div className={card + ' mb-3 space-y-2.5'}>
        <Row icon={<Phone size={14} />} label="Teléfono" value={b.phone} />
        <Row icon={<User size={14} />} label="Email" value={b.email} />
        <Row icon={<User size={14} />} label="Idioma" value={b.language} />
        <Row icon={<User size={14} />} label="Nac." value={b.nationality} />
      </div>

      {/* Payment */}
      <div className={card + ' mb-5'}>
        <p className={labelCls}>Pago</p>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-white/40 text-sm">Total</span><span className="text-white font-semibold">{fmtMoney(b.totalPrice)}</span></div>
          <div className="flex justify-between"><span className="text-white/40 text-sm">Pagado</span><span className="font-semibold text-[#10B981]">{fmtMoney(b.paidAmount)}</span></div>
          {owed > 0 && (
            <div className="flex justify-between pt-2 border-t border-white/6"><span className="text-white/40 text-sm">Debe</span><span className="font-bold text-[#F59E0B]">{fmtMoney(owed)}</span></div>
          )}
          <p className="text-white/20 text-xs capitalize">{b.paymentMethod}</p>
        </div>
      </div>

      {/* Wise breakdown */}
      {b.paymentMethod === 'wise' && b.wiseAmount && (
        <div className={card + ' mb-5'}>
          <p className={labelCls}>Detalle Wise</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Enviado</span>
              <span className="text-white">{b.wiseAmount} {b.wiseCurrency || 'EUR'}</span>
            </div>
            {!!b.wiseFee && (
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Comisión Wise</span>
                <span className="text-[#F59E0B]">−{b.wiseFee} {b.wiseCurrency || 'EUR'}</span>
              </div>
            )}
            {!!b.wiseRate && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Tipo de cambio</span>
                  <span className="text-white/55">1 {b.wiseCurrency || 'EUR'} = ¥{b.wiseRate}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/6">
                  <span className="text-white/40">Recibido (est.)</span>
                  <span className="text-[#3B82F6] font-semibold">
                    {fmtMoney(Math.round(((b.wiseAmount || 0) - (b.wiseFee || 0)) * (b.wiseRate || 0)))}
                  </span>
                </div>
              </>
            )}
          </div>
          {b.wiseReceiptData && (
            <div className="mt-3">
              {b.wiseReceiptData.startsWith('data:image') ? (
                <img
                  src={b.wiseReceiptData}
                  onClick={() => { const w = window.open(); w?.document.write(`<img src="${b.wiseReceiptData}" style="max-width:100%">`) }}
                  className="w-full rounded-xl max-h-48 object-contain bg-black/20 cursor-zoom-in"
                />
              ) : (
                <a href={b.wiseReceiptData} download="comprobante-wise.pdf"
                  className="flex items-center gap-2 text-[#3B82F6] text-sm">
                  <Download size={14} /> Ver comprobante PDF
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {owed > 0 && <button onClick={onMarkPaid} className={btnRed}>Marcar como pagado ✓</button>}
        {b.phone && (
          <a href={`https://wa.me/${b.phone.replace(/[^0-9+]/g, '')}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className={btnGhost + ' flex items-center justify-center gap-2 no-underline'}>
            <MessageCircle size={15} /> WhatsApp a {b.name.split(' ')[0]}
          </a>
        )}
        <button
          onClick={() => setShowContract(true)}
          className={btnGhost + ' flex items-center justify-center gap-2'}
        >
          <FileText size={15} /> Generar contrato
        </button>
      </div>

      {showContract && (
        <ContractPicker
          data={{ clientName: b.name, tour: b.tour, tourDate: b.date, guests: b.guests, guide: b.guide, totalPrice: b.totalPrice }}
          onClose={() => setShowContract(false)}
        />
      )}
    </div>
  )
}

// ── RECEIPT UPLOAD ────────────────────────────────────────────────────────

function ReceiptUpload({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Máximo 2 MB por archivo'); return }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  if (value) {
    return (
      <div className="relative">
        {value.startsWith('data:image') ? (
          <img
            src={value}
            onClick={() => { const w = window.open(); w?.document.write(`<img src="${value}" style="max-width:100%">`) }}
            className="w-full rounded-xl max-h-44 object-contain bg-black/30 cursor-zoom-in"
          />
        ) : (
          <div className="w-full rounded-xl h-14 bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center gap-2">
            <FileText size={16} className="text-[#3B82F6]" />
            <span className="text-[#3B82F6] text-sm">PDF adjunto</span>
          </div>
        )}
        <button
          onClick={() => onChange('')}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E53030] flex items-center justify-center shadow"
        >
          <X size={12} className="text-white" />
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        className="w-full h-14 rounded-xl border border-dashed border-white/12 flex items-center justify-center gap-2 text-white/30 text-sm active:opacity-75"
      >
        <Upload size={15} /> Adjuntar comprobante (foto o PDF)
      </button>
      <input ref={ref} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
    </>
  )
}

// ── FORM ──────────────────────────────────────────────────────────────────

function FormView({ initial, onSave, onBack }: { initial: AdminBooking | null; onSave: (b: AdminBooking) => void; onBack: () => void }) {
  const [form, setForm] = useState<Omit<AdminBooking, 'id' | 'createdAt'>>(initial ? { ...initial } : emptyForm())
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }))

  const handleTour = (name: string) => {
    const price = tourPrice(name)
    setForm(f => ({ ...f, tour: name, totalPrice: price || f.totalPrice }))
  }

  const save = () => {
    if (!form.name.trim() || !form.date || !form.tour.trim()) return
    const b: AdminBooking = initial
      ? { ...initial, ...form }
      : { id: newId(), createdAt: new Date().toISOString(), ...form }
    onSave(b)
  }

  return (
    <div className="pb-28 px-4 pt-4">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"><ArrowLeft size={18} className="text-white/60" /></button>
        <h2 className="text-white font-semibold">{initial ? 'Editar reserva' : 'Nueva reserva'}</h2>
      </div>

      {/* Cliente */}
      <p className={sectionCls}>Cliente</p>
      <div className="space-y-3">
        <Field label="Nombre *"><input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre completo" /></Field>
        <Field label="Teléfono / WhatsApp"><input className={inp} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+34 600 000 000" /></Field>
        <Field label="Email"><input className={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Idioma">
            <select className={inp} value={form.language} onChange={e => set('language', e.target.value)}>
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Nacionalidad"><input className={inp} value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="España" /></Field>
        </div>
      </div>

      {/* Tour */}
      <p className={sectionCls}>Tour</p>
      <div className="space-y-3">
        <Field label="Tour *">
          <input className={inp} list="tour-opts" value={form.tour} onChange={e => handleTour(e.target.value)} placeholder="Nombre del tour" />
          <datalist id="tour-opts">
            <optgroup label="Tours ciudad">
              {TOURS.map(t => <option key={t.id} value={t.title} />)}
            </optgroup>
            <optgroup label="Hiking montaña">
              {HIKING_ROUTES.map(h => <option key={h.id} value={`⛰️ ${h.title}`} />)}
            </optgroup>
          </datalist>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha *"><input className={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
          <Field label="Hora salida"><input className={inp} type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Personas"><input className={inp} type="number" min={1} max={20} value={form.guests} onChange={e => set('guests', Math.max(1, parseInt(e.target.value) || 1))} /></Field>
          <Field label="Guía">
            <select className={inp} value={form.guide} onChange={e => set('guide', e.target.value as Guide)}>
              {GUIDES.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Logística */}
      <p className={sectionCls}>Logística</p>
      <div className="space-y-3">
        <Field label="Hotel"><input className={inp} value={form.hotel} onChange={e => set('hotel', e.target.value)} placeholder="Nombre del hotel" /></Field>
        <Field label="Punto de encuentro"><input className={inp} value={form.meetingPoint} onChange={e => set('meetingPoint', e.target.value)} placeholder="Lobby, salida metro…" /></Field>
        <Field label="Notas"><textarea className={inp} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Alergias, peticiones especiales…" /></Field>
      </div>

      {/* Pago */}
      <p className={sectionCls}>Pago</p>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio total ¥"><input className={inp} type="number" value={form.totalPrice || ''} onChange={e => set('totalPrice', parseInt(e.target.value) || 0)} placeholder="75000" /></Field>
          <Field label="Importe pagado ¥"><input className={inp} type="number" value={form.paidAmount || ''} onChange={e => set('paidAmount', parseInt(e.target.value) || 0)} placeholder="0" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Forma de pago">
            <select className={inp} value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value as AdminBooking['paymentMethod'])}>
              {PAY_METHODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select className={inp} value={form.status} onChange={e => set('status', e.target.value as BookingStatus)} style={{ color: STATUS_COLOR[form.status] }}>
              {(Object.keys(STATUS_LABEL) as BookingStatus[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
        </div>

        {/* Live summary */}
        {form.totalPrice > 0 && (
          <div className={card}>
            <div className="flex justify-between text-sm"><span className="text-white/40">Total</span><span className="text-white">{fmtMoney(form.totalPrice)}</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-white/40">Pagado</span><span className="text-[#10B981]">{fmtMoney(form.paidAmount)}</span></div>
            {form.totalPrice - form.paidAmount > 0 && (
              <div className="flex justify-between text-sm mt-1 pt-2 border-t border-white/6">
                <span className="text-white/40">Debe</span>
                <span className="text-[#F59E0B] font-semibold">{fmtMoney(form.totalPrice - form.paidAmount)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wise transfer details */}
      {form.paymentMethod === 'wise' && (
        <>
          <p className={sectionCls}>Wise · Tipo de cambio</p>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Field label="Divisa">
                <select className={inp} value={form.wiseCurrency || 'EUR'} onChange={e => set('wiseCurrency', e.target.value)}>
                  {WISE_CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Importe enviado">
                <input className={inp} type="number" step="0.01" min="0" value={form.wiseAmount || ''} onChange={e => set('wiseAmount', parseFloat(e.target.value) || 0)} placeholder="450.00" />
              </Field>
              <Field label="Comisión Wise">
                <input className={inp} type="number" step="0.01" min="0" value={form.wiseFee || ''} onChange={e => set('wiseFee', parseFloat(e.target.value) || 0)} placeholder="3.50" />
              </Field>
            </div>
            <Field label={`Tipo de cambio · 1 ${form.wiseCurrency || 'EUR'} = ¥`}>
              <input className={inp} type="number" step="0.01" min="0" value={form.wiseRate || ''} onChange={e => set('wiseRate', parseFloat(e.target.value) || 0)} placeholder="165.20" />
            </Field>

            {/* Live Wise calculation */}
            {!!form.wiseAmount && !!form.wiseRate && (
              <div className="rounded-xl p-3 border border-[#3B82F6]/20 bg-[#3B82F6]/6 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Neto ({form.wiseCurrency || 'EUR'})</span>
                  <span className="text-white">{((form.wiseAmount || 0) - (form.wiseFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">1 {form.wiseCurrency || 'EUR'} = ¥{form.wiseRate}</span>
                  <span className="text-[#3B82F6] font-semibold">
                    {fmtMoney(Math.round(((form.wiseAmount || 0) - (form.wiseFee || 0)) * (form.wiseRate || 0)))} recibido
                  </span>
                </div>
              </div>
            )}

            <Field label="Comprobante Wise">
              <ReceiptUpload value={form.wiseReceiptData} onChange={v => set('wiseReceiptData', v)} />
            </Field>
          </div>
        </>
      )}

      <div className="mt-8 space-y-2">
        <button onClick={save} disabled={!form.name.trim() || !form.date || !form.tour.trim()} className={btnRed + ' disabled:opacity-40'}>
          {initial ? 'Guardar cambios' : 'Crear reserva'}
        </button>
        <button onClick={onBack} className={btnGhost}>Cancelar</button>
      </div>
    </div>
  )
}

// ── SETTINGS ──────────────────────────────────────────────────────────────

function WiseCalcSection() {
  const [cur, setCur] = useState('EUR')
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState('')
  const [rate, setRate] = useState('')

  const net = (parseFloat(amount) || 0) - (parseFloat(fee) || 0)
  const jpy = Math.round(net * (parseFloat(rate) || 0))

  return (
    <div className={card + ' space-y-3'}>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Divisa">
          <select className={inp} value={cur} onChange={e => setCur(e.target.value)}>
            {WISE_CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Importe">
          <input className={inp} type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="450" />
        </Field>
        <Field label="Comisión">
          <input className={inp} type="number" step="0.01" value={fee} onChange={e => setFee(e.target.value)} placeholder="3.50" />
        </Field>
      </div>
      <Field label={`Tipo de cambio · 1 ${cur} = ¥`}>
        <input className={inp} type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} placeholder="165.20" />
      </Field>
      {net > 0 && parseFloat(rate) > 0 && (
        <div className="rounded-xl p-3 border border-[#3B82F6]/25 bg-[#3B82F6]/8">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/40">Neto {cur}</span>
            <span className="text-white">{net.toFixed(2)} {cur}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-white/40">= JPY</span>
            <span className="text-[#3B82F6]">{fmtMoney(jpy)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsView({ onLogout }: { onLogout: () => void }) {
  const [oldP, setOldP] = useState('')
  const [newP, setNewP] = useState('')
  const [msg, setMsg] = useState('')
  const importRef = useRef<HTMLInputElement>(null)

  const handleChangePass = async () => {
    if (!oldP || !newP) return
    if (!(await verifyPassword(oldP))) { setMsg('Contraseña actual incorrecta'); return }
    if (newP.length < 4) { setMsg('Mínimo 4 caracteres'); return }
    await changePassword(newP)
    setOldP(''); setNewP(''); setMsg('Contraseña cambiada ✓')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    try { const n = await importJSON(file); alert(`${n} reservas importadas correctamente`) }
    catch { alert('Error al importar. Verifica el archivo.') }
  }

  return (
    <div className="pb-28 px-4 pt-6">
      <h2 className="text-white font-semibold text-lg mb-6">Ajustes</h2>

      <p className={sectionCls}>Cambiar contraseña</p>
      <div className={card + ' space-y-3 mb-4'}>
        <Field label="Contraseña actual"><input className={inp} type="password" value={oldP} onChange={e => { setOldP(e.target.value); setMsg('') }} placeholder="••••••••" /></Field>
        <Field label="Nueva contraseña"><input className={inp} type="password" value={newP} onChange={e => { setNewP(e.target.value); setMsg('') }} placeholder="••••••••" /></Field>
        {msg && <p className={msg.includes('✓') ? 'text-[#10B981] text-xs' : 'text-[#E53030] text-xs'}>{msg}</p>}
        <button onClick={handleChangePass} className={btnRed}>Cambiar contraseña</button>
      </div>

      <p className={sectionCls}>Contratos · Plantillas</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {CONTRACT_LANGS.map(([lang, meta]) => (
          <button
            key={lang}
            onClick={() => {
              const html = generateContract(lang)
              const w = window.open('', '_blank')
              if (w) { w.document.write(html); w.document.close() }
            }}
            className={card + ' flex items-center gap-3 text-left active:opacity-75'}
          >
            <span className="text-2xl leading-none">{meta.flag}</span>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium">{meta.label}</p>
              <p className="text-white/25 text-[10px]">Plantilla en blanco</p>
            </div>
          </button>
        ))}
      </div>
      <p className="text-white/25 text-xs mb-6 px-1">Para contratos con datos del cliente, usa el botón "Generar contrato" dentro de cada reserva.</p>

      <p className={sectionCls}>Calculadora Wise</p>
      <WiseCalcSection />

      <p className={sectionCls}>Copias de seguridad</p>
      <div className="space-y-2 mb-4">
        <button onClick={exportJSON} className={card + ' w-full flex items-center gap-3 text-left active:opacity-75'}>
          <Download size={18} className="text-[#E53030] flex-shrink-0" />
          <div><p className="text-white text-sm font-medium">Exportar datos</p><p className="text-white/30 text-xs">Descarga JSON con todas las reservas</p></div>
        </button>
        <button onClick={() => importRef.current?.click()} className={card + ' w-full flex items-center gap-3 text-left active:opacity-75'}>
          <Upload size={18} className="text-[#3B82F6] flex-shrink-0" />
          <div><p className="text-white text-sm font-medium">Importar datos</p><p className="text-white/30 text-xs">Restaura desde un backup JSON</p></div>
        </button>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      <p className={sectionCls}>Info</p>
      <div className={card + ' mb-6'}>
        <p className="text-white/35 text-xs leading-relaxed">
          Los datos se guardan en este dispositivo. Exporta regularmente para no perderlos si cambias de móvil.
        </p>
        <p className="text-white/15 text-xs mt-3">Tony Admin v1.0 · Privado</p>
      </div>

      <button onClick={() => { setAuthed(false); onLogout() }} className={btnGhost + ' flex items-center justify-center gap-2'}>
        <LogOut size={15} /> Cerrar sesión
      </button>
    </div>
  )
}

// ── CHANGELOG ────────────────────────────────────────────────────────────

const CHANGELOG = [
  {
    version: 'v2.5',
    date: 'Mayo 2026',
    title: 'Fotos reales de los guías',
    changes: [
      'Fotos reales de Tony, Johnny y Larion en la sección "Conoce al equipo"',
      'Eliminadas fotos de stock de Unsplash',
    ],
  },
  {
    version: 'v2.4',
    date: 'Mayo 2026',
    title: 'Contratos en 4 idiomas',
    changes: [
      'Generador de contratos: EN, ES, RU, CS',
      '8 cláusulas legales: servicio, exención de responsabilidad, seguro obligatorio, cancelación, fuerza mayor, conducta, fotografía, pago',
      'Contrato pre-relleno con datos del cliente desde cada reserva',
      'Plantillas en blanco desde Ajustes',
    ],
  },
  {
    version: 'v2.3',
    date: 'Mayo 2026',
    title: 'Tracking de pagos Wise',
    changes: [
      "Nuevo método de pago 'Wise' en el formulario de reservas",
      'Campos: divisa, importe, comisión, tipo de cambio',
      'Cálculo automático de yenes recibidos netos',
      'Adjuntar comprobante Wise (foto o PDF, máx 2 MB)',
      'Vista detalle muestra desglose completo Wise',
      'Calculadora Wise en Ajustes',
    ],
  },
  {
    version: 'v2.2',
    date: 'Mayo 2026',
    title: 'Corrección nombre guía',
    changes: [
      "Corregido 'Hilarion' → 'Larion' en web pública, FAQ, bio y panel admin",
    ],
  },
  {
    version: 'v2.1',
    date: 'Mayo 2026',
    title: 'PWA — Instalar en móvil',
    changes: [
      'manifest.json para instalación "Añadir a pantalla de inicio"',
      'Meta tags Apple Web App para iOS',
      'Modo standalone (sin barra del navegador)',
      'Admin separado del resto de la web (sin navbar ni footer)',
    ],
  },
  {
    version: 'v2.0',
    date: 'Mayo 2026',
    title: 'Panel de administración',
    changes: [
      'Login con contraseña SHA-256 (por defecto: tony2024)',
      'Vista Hoy: tours del día + estadísticas de la semana',
      'Calendario mensual con puntos por reserva',
      'Lista de reservas con búsqueda y filtros por estado',
      'Formulario completo: cliente, tour, logística, pago',
      'Vista detalle con botón WhatsApp pre-escrito',
      'Ajustes: cambiar contraseña, exportar/importar JSON',
      'Datos guardados en el dispositivo (sin servidor)',
    ],
  },
  {
    version: 'v1.5',
    date: 'Mayo 2026',
    title: 'Corrección build CI/CD',
    changes: [
      'Error: manualChunks incompatible con VITE_SINGLE_FILE=true en GitHub Actions',
      'Fix: rollupOptions condicional según entorno de build',
      'CI pasó de rojo a verde',
    ],
  },
  {
    version: 'v1.4',
    date: 'Mayo 2026',
    title: 'SEO avanzado',
    changes: [
      'HashRouter → BrowserRouter (URLs limpias sin #)',
      '200.html como fallback SPA para Surge',
      'react-helmet-async: título y descripción únicos por página',
      'FAQPage JSON-LD schema para rich snippets en Google',
      'TouristAttraction + Offer schema por tour (precio JPY)',
      'Sitemap actualizado con URLs limpias',
      'Code splitting: chunks separados (React, Router, Framer, Three.js, Lucide)',
    ],
  },
  {
    version: 'v1.3',
    date: 'Mayo 2026',
    title: 'Política de Privacidad',
    changes: [
      'Página /privacy con política GDPR completa',
      '9 secciones: quiénes somos, datos recogidos, Google Analytics, GDPR, retención, derechos',
      'Link en el footer de la web pública',
    ],
  },
  {
    version: 'v1.2',
    date: 'Mayo 2026',
    title: 'Google Analytics + GDPR',
    changes: [
      'Google Analytics 4 con ID G-K9JKN9346D',
      'Google Consent Mode v2 (analytics denegado por defecto)',
      'Banner de cookies con Aceptar / Rechazar',
      'Al aceptar: gtag consent update activa analytics',
      'Al rechazar: cero datos recogidos',
      'robots.txt y sitemap.xml',
    ],
  },
  {
    version: 'v1.1',
    date: 'Mayo 2026',
    title: 'SEO inicial + favicon',
    changes: [
      'Favicon SVG (torii gate rojo)',
      'Open Graph y Twitter Card meta tags',
      'TouristInformationCenter JSON-LD con AggregateRating 5.0/400 reseñas',
      'Canonical URL configurado',
      'Descripción y título optimizados para Google Ads',
    ],
  },
  {
    version: 'v1.0',
    date: 'Mayo 2026',
    title: 'Lanzamiento inicial',
    changes: [
      'Stack: Vite + React 18 + TypeScript + Tailwind CSS v3 + Framer Motion',
      '7 páginas: Inicio, Tours, Detalle de tour, Nosotros, Precios, FAQ, Reservar',
      '3 guías: Tony (EN/ES/AR), Johnny (EN/CS), Larion (RU/JA/EN/ES)',
      '7 tours con precios en JPY',
      'Idiomas: EN, ES, AR, CS, RU (soporte RTL para árabe)',
      'Sección de preguntas frecuentes',
      'Botón flotante WhatsApp',
      'Diseño dark premium con rojo japón #E53030',
      'Deploy en tonykansaiguide.com',
    ],
  },
]

function ChangelogModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0C0D16' }}>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-white/6 flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <ArrowLeft size={18} className="text-white/60" />
        </button>
        <div>
          <h2 className="text-white font-semibold">Historial de cambios</h2>
          <p className="text-white/30 text-xs">Todo lo que se ha mejorado en la página</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
        {CHANGELOG.map((entry, i) => (
          <div key={entry.version} className="relative pl-6 pb-6 last:pb-0">
            {/* Timeline line */}
            {i < CHANGELOG.length - 1 && (
              <div className="absolute left-[7px] top-5 bottom-0 w-px bg-white/8" />
            )}
            {/* Dot */}
            <div
              className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 flex-shrink-0"
              style={{ background: i === 0 ? '#E53030' : '#1C1F30', borderColor: i === 0 ? '#E53030' : 'rgba(255,255,255,0.15)' }}
            />

            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: i === 0 ? '#E53030' : 'rgba(255,255,255,0.07)', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' }}
              >
                {entry.version}
              </span>
              <span className="text-white/25 text-[10px]">{entry.date}</span>
            </div>
            <p className="text-white text-sm font-medium mb-2">{entry.title}</p>
            <ul className="space-y-1">
              {entry.changes.map((c, j) => (
                <li key={j} className="flex gap-2 text-xs text-white/45 leading-relaxed">
                  <span className="text-white/20 flex-shrink-0 mt-0.5">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────

function BottomNav({ active, onTab }: { active: NavTab; onTab: (t: NavTab) => void }) {
  const tabs: { id: NavTab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home size={20} />, label: 'Hoy' },
    { id: 'calendar', icon: <Calendar size={20} />, label: 'Calendario' },
    { id: 'list', icon: <List size={20} />, label: 'Reservas' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Ajustes' },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0E1020] border-t border-white/6 flex z-50">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className="flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors"
          style={{ color: active === t.id ? '#E53030' : 'rgba(255,255,255,0.3)' }}
        >
          {t.icon}
          <span className="text-[9px] font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthedState] = useState(isAuthed)
  const [view, setView] = useState<View>('home')
  const [tab, setTab] = useState<NavTab>('home')
  const [bookings, setBookings] = useState<AdminBooking[]>(getBookings)
  const [selected, setSelected] = useState<AdminBooking | null>(null)
  const [editTarget, setEditTarget] = useState<AdminBooking | null>(null)
  const [showChangelog, setShowChangelog] = useState(false)

  const refresh = () => setBookings(getBookings())

  const goTab = (t: NavTab) => { setTab(t); setView(t); setSelected(null) }
  const goDetail = (b: AdminBooking) => { setSelected(b); setView('detail') }
  const goNew = () => { setEditTarget(null); setView('form') }
  const goEdit = () => { setEditTarget(selected); setView('form') }

  const handleSave = (b: AdminBooking) => { upsertBooking(b); refresh(); setSelected(b); setView('detail') }

  const handleDelete = () => {
    if (!selected || !window.confirm(`¿Eliminar la reserva de ${selected.name}?`)) return
    removeBooking(selected.id); refresh(); setSelected(null); setView('list'); setTab('list')
  }

  const handleMarkPaid = () => {
    if (!selected) return
    const updated = { ...selected, paidAmount: selected.totalPrice, status: 'completado' as BookingStatus }
    upsertBooking(updated); refresh(); setSelected(updated)
  }

  if (!authed) return <LoginView onLogin={() => { setAuthedState(true); setView('home') }} />

  const showNav = ['home', 'calendar', 'list', 'settings'].includes(view)

  return (
    <div className="min-h-screen bg-[#0C0D16] font-sans">
      <Helmet>
        <title>Tony Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {view === 'home' && <HomeView bookings={bookings} onNew={goNew} onDetail={goDetail} />}
      {view === 'calendar' && <CalendarView bookings={bookings} onDetail={goDetail} onNew={goNew} />}
      {view === 'list' && <ListView bookings={bookings} onDetail={goDetail} onNew={goNew} />}
      {view === 'detail' && selected && (
        <DetailView b={selected} onEdit={goEdit} onBack={() => setView(tab)} onDelete={handleDelete} onMarkPaid={handleMarkPaid} />
      )}
      {view === 'form' && (
        <FormView initial={editTarget} onSave={handleSave} onBack={() => setView(selected && editTarget ? 'detail' : tab)} />
      )}
      {view === 'settings' && <SettingsView onLogout={() => { setAuthedState(false); setView('login') }} />}

      {showNav && <BottomNav active={tab} onTab={goTab} />}

      {/* Updates floating button */}
      {showNav && !showChangelog && (
        <button
          onClick={() => setShowChangelog(true)}
          className="fixed right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 border border-white/10 bg-[#0E1020]"
          style={{ bottom: '70px' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E53030]" />
          Updates
        </button>
      )}

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </div>
  )
}

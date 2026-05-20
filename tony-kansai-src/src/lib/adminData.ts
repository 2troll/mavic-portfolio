// Private admin data layer — localStorage based

export type BookingStatus = 'pendiente' | 'confirmado' | 'completado' | 'cancelado'
export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro'
export type Guide = 'Tony' | 'Johnny' | 'Hilarion'

export interface AdminBooking {
  id: string
  // Client
  name: string
  phone: string
  email: string
  nationality: string
  language: string
  // Tour
  tour: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  guests: number
  guide: Guide
  // Logistics
  hotel: string
  meetingPoint: string
  notes: string
  // Payment (JPY)
  totalPrice: number
  paidAmount: number
  paymentMethod: PaymentMethod
  // Status
  status: BookingStatus
  createdAt: string
}

const BOOKINGS_KEY = 'tony-admin-bookings'
const AUTH_KEY = 'tony-admin-session'
const PASS_KEY = 'tony-admin-pass-hash'

export function getBookings(): AdminBooking[] {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') }
  catch { return [] }
}

export function saveBookings(list: AdminBooking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
}

export function upsertBooking(b: AdminBooking) {
  const list = getBookings()
  const idx = list.findIndex(x => x.id === b.id)
  if (idx >= 0) list[idx] = b; else list.push(b)
  saveBookings(list)
}

export function removeBooking(id: string) {
  saveBookings(getBookings().filter(b => b.id !== id))
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(input: string): Promise<boolean> {
  const stored = localStorage.getItem(PASS_KEY)
  const hash = await sha256(input)
  if (!stored) {
    const def = await sha256('tony2024')
    if (hash === def) { localStorage.setItem(PASS_KEY, def); return true }
    return false
  }
  return hash === stored
}

export async function changePassword(newPass: string) {
  localStorage.setItem(PASS_KEY, await sha256(newPass))
}

export const isAuthed = () => sessionStorage.getItem(AUTH_KEY) === '1'
export const setAuthed = (v: boolean) =>
  v ? sessionStorage.setItem(AUTH_KEY, '1') : sessionStorage.removeItem(AUTH_KEY)

export function exportJSON() {
  const data = { bookings: getBookings(), exported: new Date().toISOString() }
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })),
    download: `tony-backup-${new Date().toISOString().slice(0, 10)}.json`,
  })
  a.click()
}

export function importJSON(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const { bookings } = JSON.parse(e.target!.result as string)
        if (!Array.isArray(bookings)) throw new Error()
        saveBookings(bookings)
        resolve(bookings.length)
      } catch { reject(new Error('Archivo inválido')) }
    }
    reader.readAsText(file)
  })
}

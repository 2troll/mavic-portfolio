// Precios por temporada (Tony, 25-11-2026: «la temporada más cara es la del
// sakura, porque es temporada alta; el invierno también»). Recargo sobre la
// tarifa normal (PRECIO de datosRutas.ts, que se pasa como base), redondeado a mil yenes:
//   sakura +30 % · otoño (momiji) +20 % · invierno +10 % · resto del año, normal.
// Las fechas son las mismas ventanas que usa la web para la caída y los avisos
// de temporada (public/caida.js). Lo leen PaginaGuia.tsx (portada) y
// scripts/precios.mjs (/es/precios/, /en/prices/, /ar/prices/).
// Sin imports: scripts/precios.mjs lo carga desde Node, que no resuelve imports sin extensión.

export type IdTemporadaPrecio = 'sakura' | 'otono' | 'invierno' | 'normal'

export const TEMPORADAS_PRECIO: {
  id: IdTemporadaPrecio
  recargo: number
  emoji: string
  nombre: Record<'es' | 'en' | 'ar', string>
  fechas: Record<'es' | 'en' | 'ar', string>
}[] = [
  { id: 'sakura', recargo: 0.3, emoji: '🌸',
    nombre: { es: 'Sakura · temporada alta', en: 'Cherry blossom · peak season', ar: 'موسم الساكورا · ذروة الموسم' },
    fechas: { es: '15 de marzo – 25 de abril', en: '15 March – 25 April', ar: '15 مارس – 25 أبريل' } },
  { id: 'otono', recargo: 0.2, emoji: '🍁',
    nombre: { es: 'Otoño · hojas rojas', en: 'Autumn leaves', ar: 'الخريف · الأوراق الحمراء' },
    fechas: { es: '20 de octubre – 12 de diciembre', en: '20 October – 12 December', ar: '20 أكتوبر – 12 ديسمبر' } },
  { id: 'invierno', recargo: 0.1, emoji: '❄️',
    nombre: { es: 'Invierno', en: 'Winter', ar: 'الشتاء' },
    fechas: { es: '13 de diciembre – 28 de febrero', en: '13 December – 28 February', ar: '13 ديسمبر – 28 فبراير' } },
  { id: 'normal', recargo: 0, emoji: '☀️',
    nombre: { es: 'Resto del año', en: 'Rest of the year', ar: 'باقي السنة' },
    fechas: { es: 'marzo (1-14), finales de abril – mediados de octubre', en: 'early March, late April – mid October', ar: 'أوائل مارس، ومن أواخر أبريل إلى منتصف أكتوبر' } },
]

/** Precio de una tarifa base en una temporada, redondeado a mil yenes. */
export const precioTemporada = (base: number, recargo: number) => Math.round((base * (1 + recargo)) / 1000) * 1000

/** Fila lista para pintar: [medio, completo, lejos] en yenes. */
export const filaTemporada = (base: { medio: number; completo: number; lejos: number }, recargo: number) => ({
  medio: precioTemporada(base.medio, recargo),
  completo: precioTemporada(base.completo, recargo),
  lejos: precioTemporada(base.lejos, recargo),
})

export const TXT_TEMPORADAS: Record<'es' | 'en' | 'ar', { titulo: string; temporada: string; fechas: string; medio: string; completo: string; lejos: string; nota: string }> = {
  es: { titulo: 'Precio según la temporada', temporada: 'Temporada', fechas: 'Fechas', medio: 'Medio día (4 h)', completo: 'Día completo (8 h)', lejos: 'Excursión lejana (desde)',
    nota: 'Precio por grupo de hasta 6 personas, no por persona. Cuenta la fecha del tour. En sakura y en otoño Kansai se llena: reserva con tiempo.' },
  en: { titulo: 'Price by season', temporada: 'Season', fechas: 'Dates', medio: 'Half day (4 h)', completo: 'Full day (8 h)', lejos: 'Day trip further away (from)',
    nota: 'Price per group of up to 6 people, not per person. The tour date decides the season. Cherry blossom and autumn book up fast.' },
  ar: { titulo: 'السعر حسب الموسم', temporada: 'الموسم', fechas: 'التواريخ', medio: 'نصف يوم (4 ساعات)', completo: 'يوم كامل (8 ساعات)', lejos: 'رحلة بعيدة (ابتداءً من)',
    nota: 'السعر للمجموعة حتى 6 أشخاص، وليس للشخص. يُحتسب الموسم حسب تاريخ الجولة. موسما الساكورا والخريف يمتلئان بسرعة.' },
}

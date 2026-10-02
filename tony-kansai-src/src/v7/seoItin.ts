// Datos de las páginas «el día, hora a hora» que también lee el generador de
// cabeceras estáticas (scripts/rutas-estaticas.mjs): sin React ni CSS.
export type ItinPaginaId = 'i-es' | 'i-en' | 'i-ar' | 'i-ru' | 'i-larion'
type Lengua = 'es' | 'en' | 'ar' | 'ru'

export const BASE = 'https://tonykansaiguide.com'

export const PAGINAS_ITIN: Record<ItinPaginaId, { lang: Lengua; ruta: string; ciudad: string; guia: 'tony' | 'larion'; etiqueta: string }> = {
  'i-es': { lang: 'es', ruta: '/es/rutas/', ciudad: '/es/', guia: 'tony', etiqueta: 'Español' },
  'i-en': { lang: 'en', ruta: '/en/routes/', ciudad: '/en/', guia: 'tony', etiqueta: 'English' },
  'i-ar': { lang: 'ar', ruta: '/ar/routes/', ciudad: '/ar/', guia: 'tony', etiqueta: 'العربية' },
  'i-ru': { lang: 'ru', ruta: '/ru/routes/', ciudad: '/ru/', guia: 'larion', etiqueta: 'Русский' },
  'i-larion': { lang: 'en', ruta: '/larion/routes/', ciudad: '/larion/', guia: 'larion', etiqueta: 'English' },
}

export const SEO_ITIN: Record<ItinPaginaId, { titulo: string; descripcion: string }> = {
  'i-es': { titulo: 'Rutas por Japón hora a hora con guía en español | Tony Kansai Guide', descripcion: 'Kioto, Osaka, Nara, Himeji, Kobe, Hiroshima, Fuji, Tokio, Nagano y Fukuoka: qué hacemos cada hora del día, cómo se llega y dónde se come. Guía privado en español.' },
  'i-en': { titulo: 'Japan day itineraries, hour by hour, with a private guide | Tony Kansai Guide', descripcion: 'Kyoto, Osaka, Nara, Himeji, Kobe, Hiroshima, Fuji, Tokyo, Nagano and Fukuoka: what we do each hour, how to get there and where to eat. Private English-speaking guide.' },
  'i-ar': { titulo: 'برامج يومية في اليابان ساعةً بساعة مع مرشد عربي | Tony Kansai Guide', descripcion: 'كيوتو وأوساكا ونارا وهيميجي وكوبي وهيروشيما وفوجي وطوكيو وناغانو وفوكوكا: ماذا نفعل كل ساعة، وكيف نصل، وأين نأكل حلالاً. مرشد خاص يتحدث العربية.' },
  'i-ru': { titulo: 'Маршруты по Японии по часам с гидом на русском | Tony Kansai Guide', descripcion: 'Хиросима и Миядзима, Киото, Нара, Осака и Химэдзи: что делаем каждый час, как добраться и где поесть. Частный русскоязычный гид Ларион.' },
  'i-larion': { titulo: 'Day itineraries with Larion, hour by hour | Tony Kansai Guide', descripcion: 'Hiroshima and Miyajima, Kyoto, Nara, Osaka and Himeji: what we do each hour, how to get there and where to eat. Private guide Larion.' },
}


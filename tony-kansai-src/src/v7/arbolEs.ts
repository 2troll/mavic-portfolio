// El árbol de la web en español (Tony, 25-11-2026: «básico, lo importante, y que
// vaya creciendo como las raíces de un árbol»). UNA sola lista para el menú ☰ de
// CabeceraEs y para el pie PieEs, en React y en los generadores estáticos
// (scripts/arbol-es.mjs la empaqueta con esbuild): así nunca se desincronizan.
// Solo datos (sin React): de lo importante a lo demás.
import { PAGINAS, CORREO, enlaceGuia } from './contenido'
import { RESPUESTAS_PROPIAS } from './datosRespuestas'
import { RUTA_INVIERNO } from './datosInvierno'
import { CIUDADES, CIUDADES_TONY } from '../v8/ciudades'

export interface EnlaceArbol {
  texto: string
  ruta: string
  /** Ruta de la SPA (React Router). Si no, <a> normal: página estática o de fuera. */
  app?: boolean
  /** Sitio de fuera: se abre en otra pestaña. */
  fuera?: boolean
  nuevo?: boolean
  /** Se ve resaltada en el menú (la montaña: Tony quiere venderla). */
  destacado?: boolean
}
export interface RamaArbol { id: string; titulo: string; enlaces: EnlaceArbol[] }
export interface ArbolEs {
  primeros: EnlaceArbol[]; ramas: RamaArbol[]; legal: EnlaceArbol[]
  lema: string; correo: string; creditos: string; otrosIdiomas: string
  whatsapp: { texto: string; href: string }
}

/** Las páginas de respuesta tienen por título una pregunta larga: en el árbol, corto. */
const RESPUESTA_CORTA: Record<string, string> = {
  '/es/guia-espanol-kansai/': 'Guía en español en Kansai: servicios y precios',
  '/es/tour-privado-o-en-grupo-japon/': '¿Tour privado o en grupo en Japón?',
  '/es/guia-espanol-arabe-japon/': 'Guía en español y árabe en Japón',
}

export function arbolEs(): ArbolEs {
  const p = PAGINAS.es
  const respuestas = RESPUESTAS_PROPIAS.filter(([, r]) => r.lang === 'es').map(([, r]) => r)
  const ramas: RamaArbol[] = [
    { id: 'experiencias', titulo: 'Experiencias', enlaces: [
      { texto: 'Todas las experiencias', ruta: '/es/#experiencias' },
      ...CIUDADES_TONY.map((c) => ({ texto: CIUDADES[c].nombre.es, ruta: `/es/${c}/`, app: true })),
      { texto: 'Montaña y senderismo', ruta: '/es/montana/', app: true, destacado: true },
      { texto: 'Tokio, el Fuji y más: rutas por Japón', ruta: '/es/rutas/', app: true },
      { texto: 'Excursión a Nara desde Osaka', ruta: '/es/excursion-nara-desde-osaka/', app: true },
      { texto: 'Hiroshima y Miyajima en un día', ruta: '/es/excursion-hiroshima-miyajima-desde-osaka/', app: true },
      { texto: 'Kioto en 2 horas', ruta: '/es/guia-privado-kioto-2-horas/', app: true },
      { texto: 'Kioto en bici', ruta: '/es/tour-privado-bici-kioto/', app: true },
      { texto: 'Todos los destinos', ruta: '/es/destinos/' },
    ] },
    { id: 'temporadas', titulo: 'Temporadas', enlaces: [
      { texto: 'Invierno en Kansai', ruta: RUTA_INVIERNO.es, app: true, nuevo: true },
      { texto: 'Otoño en Kioto', ruta: '/es/otono-kioto/', app: true },
      { texto: 'Sakura en Kioto', ruta: '/es/sakura-kioto/', app: true },
    ] },
    { id: 'viaje', titulo: 'Para tu viaje', enlaces: [
      ...(p.mercado.enlaces ?? []).map((e) => ({ texto: e.texto, ruta: e.ruta, app: true })),
      { texto: 'Ventajas y descuentos', ruta: '/es/ventajas/', app: true },
      { texto: 'Aeropuerto de Kansai', ruta: '/es/aeropuerto-kansai/', app: true },
      { texto: 'De Osaka a Kioto', ruta: '/es/osaka-kioto/', app: true },
      { texto: 'Herramientas gratis', ruta: '/es/herramientas/' },
      { texto: '¿Te compensa un guía? Calculadora', ruta: '/es/calculadora-guia/' },
      { texto: 'Leyendas y lugares perdidos', ruta: '/es/leyendas/' },
      { texto: 'Japón de TikTok · precio especial', ruta: '/tiktok/' },
      { texto: 'Mapa de Yuru Camp△ (anime)', ruta: 'https://2troll.github.io/yurucamp-mapa/guia/', fuera: true },
    ] },
    { id: 'tony', titulo: 'Sobre Tony', enlaces: [
      ...respuestas.map((r) => ({ texto: RESPUESTA_CORTA[r.ruta] ?? r.titulo, ruta: r.ruta, app: true })),
      { texto: 'Agencias · Hanma Travel Partners', ruta: '/partners/' },
      { texto: 'Agencias · Pide presupuesto de guía', ruta: 'https://forms.fillout.com/t/3Pq2Nob6Wkus', fuera: true },
      { texto: 'Tony Kansai Guide es una empresa de HBH Group', ruta: 'https://hbh.tonykansaiguide.com/es/', fuera: true },
    ] },
  ]
  // Un enlace sale una sola vez (las respuestas de Kioto, Nara e Hiroshima ya
  // están en «Experiencias»).
  const visto = new Set<string>(['/es/', '/es/precios/'])
  for (const r of ramas) r.enlaces = r.enlaces.filter((e) => !visto.has(e.ruta) && !!visto.add(e.ruta))
  return {
    primeros: [
      { texto: 'Inicio', ruta: '/es/', app: true },
      { texto: 'Reseñas', ruta: '/es/#resenas' },
      { texto: 'Precios', ruta: '/es/precios/' },
    ],
    ramas,
    legal: [
      { texto: p.pie.legal, ruta: '/legal/?lang=es', app: true },
      { texto: p.pie.privacidad, ruta: '/privacy/?lang=es', app: true },
      { texto: p.pie.condiciones, ruta: '/terms/?lang=es', app: true },
      { texto: p.pie.cookies, ruta: '/cookies/?lang=es', app: true },
    ],
    lema: p.pie.lema, correo: CORREO, creditos: p.pie.creditos, otrosIdiomas: p.pie.otrosIdiomas,
    // El mismo saludo con que empieza la plantilla de contacto de la portada.
    whatsapp: { texto: 'Escribir a Tony por WhatsApp', href: enlaceGuia('tony', 'Hola Tony, te escribo desde la web.') },
  }
}

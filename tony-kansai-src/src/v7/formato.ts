// Separador de miles según el idioma de la página: en español se escribe
// ¥58.000 y 1.125 m; en ruso, con espacio fino. Los datos vienen en inglés
// («¥68,000», «1,125 m»), así que esto los adapta al pintarlos.

const SEP: Record<string, string> = { es: '.', ru: ' ' }

export const sepMiles = (lang: string) => SEP[lang] ?? ','

export const yenLocal = (n: number, lang: string) => '¥' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sepMiles(lang))

/** Cambia la coma de miles de un texto ya escrito («¥68,000») por la del idioma. */
export const milesLocal = (texto: string, lang: string) =>
  sepMiles(lang) === ',' ? texto : texto.replace(/(\d),(?=\d{3}\b)/g, `$1${sepMiles(lang)}`)

/** Enlaces del pie en las páginas que no usan contenido.ts (ciudad, rutas, montaña). */
export const PIE: Record<string, { legal: string; privacidad: string; creditos: string; condiciones: string; seguridad: string }> = {
  es: { legal: 'Aviso legal', privacidad: 'Privacidad', creditos: 'Créditos de las fotos', condiciones: 'Condiciones', seguridad: 'Seguridad' },
  en: { legal: 'Legal notice', privacidad: 'Privacy', creditos: 'Photo credits', condiciones: 'Terms', seguridad: 'Safety' },
  ar: { legal: 'إشعار قانوني', privacidad: 'الخصوصية', creditos: 'حقوق الصور', condiciones: 'الشروط', seguridad: 'السلامة' },
  ru: { legal: 'Правовая информация', privacidad: 'Конфиденциальность', creditos: 'Авторы фото', condiciones: 'Условия', seguridad: 'Безопасность' },
}

/** Nombre de una ruta de montaña en español sin pasar por el diccionario: tc()
 *  carga tarde y el HTML pregenerado no coincidiría al hidratar. */
export function nombreMonte(titulo: string, lang: string) {
  if (lang !== 'es') return titulo
  return titulo
    .replace(/^(.*) Mountain$/, 'Montaña de $1')
    .replace(/Mt\. /g, 'Monte ')
    .replace(/^(.*) Falls$/, 'Cascadas de $1')
    .replace(/^(.*) Valley$/, 'Valle de $1')
    .replace(/^(.*) Tunnels$/, 'Túneles de $1')
}

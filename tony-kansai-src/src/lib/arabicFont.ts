/**
 * Las fuentes árabes (IBM Plex Sans Arabic + Amiri) pesan y su hoja de
 * estilos bloquea el renderizado. Pedirlas siempre castigaba a los cuatro
 * idiomas que no las usan, así que se inyectan sólo cuando hace falta.
 */
const ID = 'fuentes-arabes'

export function cargaFuenteArabe(): void {
  if (typeof document === 'undefined' || document.getElementById(ID)) return
  const link = document.createElement('link')
  link.id = ID
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap'
  document.head.appendChild(link)
}

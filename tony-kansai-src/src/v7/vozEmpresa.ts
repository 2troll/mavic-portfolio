// Lo que se VE en las páginas de respuesta, viajeros y otoño, sin techos de grupo
// ni primera persona (rediseño de Antonio, 21-11-2026):
//   · «nunca limitar ni cerrar puertas»: fuera «hasta 6 personas» a la vista;
//   · «empresa, no caras»: «Pregúntanos», «Escríbenos», no «Pregúntame».
// Solo se aplica al pintar. Los datos (datosRespuestas*.ts, datosViajeros.ts…) y
// todo lo que sale de ellos hacia Google y las IAs (FAQPage, JSON-LD, títulos,
// descripciones) siguen igual: es lo que comprueba la prueba de SEO antes de publicar.

type Regla = [RegExp, string]

const TECHOS: Regla[] = [
  // Español
  [/ \(hasta 6 personas\)/g, ''],
  [/ · hasta 6 personas/g, ''],
  [/ de hasta 6 personas/g, ''],
  [/ de hasta 6\b(?!\s*(?:h\b|horas?))/g, ''],
  [/,? hasta 6 personas/g, ''],
  // Inglés
  [/ \(up to 6 people\)/g, ''],
  [/ · up to 6 people/g, ''],
  [/ for up to 6 people/g, ' per group'],
  [/ of up to 6 people/g, ''],
  [/ of up to 6\b(?!\s*(?:h\b|hours?))/g, ''],
  [/,? up to 6 people/g, ''],
  [/,? up to 6\b(?!\s*(?:h\b|hours?))/g, ''],
  // Árabe (con cifras árabes o latinas)
  [/ \(حتى [٦6] أشخاص\)/g, ''],
  [/ · حتى [٦6] أشخاص/g, ''],
  [/،? ?حتى [٦6] أشخاص/g, ''],
  // Ruso
  [/ \(до 6 человек\)/g, ''],
  [/ · до 6 человек/g, ''],
  [/,? до 6 человек/g, ''],
]

const VOZ: Regla[] = [
  [/Pregúntame por WhatsApp/g, 'Pregúntanos por WhatsApp'],
  [/Escríbeme por WhatsApp/g, 'Escríbenos por WhatsApp'],
  [/Escribir a Tony/g, 'Escríbenos'],
  [/Te contesto yo, no una agencia\./g, 'Te respondemos directamente.'],
  [/Ask me on WhatsApp/g, 'Ask us on WhatsApp'],
  [/Message me on WhatsApp/g, 'Message us on WhatsApp'],
  [/Message Tony/g, 'Message us'],
  [/I answer myself, not an agency\./g, 'We reply directly.'],
  [/Tony is a guide, not an agency: no tickets or hotels\./g, 'We do not sell tickets or hotels.'],
  [/اسألني عبر واتساب/g, 'اسألنا عبر واتساب'],
  [/راسلني على واتساب/g, 'راسلنا على واتساب'],
  [/راسل طوني/g, 'راسلنا'],
  [/أنا من يرد، وليست وكالة\./g, 'نرد عليكم مباشرة.'],
  [/← Volver a la página de Tony/g, '← Volver al inicio'],
  [/← Back to Tony['’]s page/g, '← Back to the home page'],
  [/← العودة إلى صفحة طوني/g, '← العودة إلى الصفحة الرئيسية'],
]

/** Texto visible sin techos de grupo ni primera persona en los botones. */
export function visible(texto: string): string {
  let t = texto
  for (const [re, por] of TECHOS) t = t.replace(re, por)
  for (const [re, por] of VOZ) t = t.replace(re, por)
  // Limpieza de lo que deja quitar un trozo: «grupo , no» → «grupo, no»; «()».
  return t.replace(/ {2,}/g, ' ').replace(/ ([,.;:،])/g, '$1').replace(/\(\s*\)/g, '').replace(/,\s*,/g, ',').trim()
}

/** Cierre de las páginas de Tony con voz de empresa (las frases de los datos
 *  iban en primera persona: «Dime fechas… y te contesto»). */
export const CIERRE_EMPRESA: Record<string, string> = {
  es: 'Cuéntanos fechas, cuántos sois y qué os apetece ver, y te respondemos con un plan y un precio cerrado.',
  en: 'Tell us your dates, how many you are and what you would like to see, and we will reply with a plan and a fixed price.',
  ar: 'أخبرونا بالتاريخ وعددكم وما تحبون رؤيته، ونرسل لكم مساراً وسعراً ثابتاً للمجموعة.',
}

// Franja al pie de cada página: recuerda a los clientes que tienen códigos de
// descuento para su viaje y los lleva a la página de ventajas. Los códigos salen
// de datosVentajas (cuponDe), así un código caducado o retirado desaparece solo.
import { Link } from 'react-router-dom'
import { APPS, cuponDe } from './datosVentajas'

type Idioma = 'es' | 'en' | 'ar' | 'ru'

const RUTA: Record<Idioma, string> = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/', ru: '/ru/perks/' }

const TEXTO: Record<Idioma, { titulo: string; sub: string; boton: string }> = {
  es: { titulo: 'Descuentos para tu viaje a Japón', sub: 'Mis clientes los usan antes de volar y durante el viaje: internet, consigna de maletas, kimono, taxis y más.', boton: 'Ver mis códigos' },
  en: { titulo: 'Discounts for your trip to Japan', sub: 'My guests use them before flying and during the trip: mobile data, luggage storage, kimono, taxis and more.', boton: 'See my codes' },
  ar: { titulo: 'خصومات لرحلتك إلى اليابان', sub: 'يستخدمها ضيوفي قبل السفر وأثناء الرحلة: الإنترنت، حفظ الأمتعة، الكيمونو، سيارات الأجرة والمزيد.', boton: 'شاهد رموز الخصم' },
  ru: { titulo: 'Скидки для поездки в Японию', sub: 'Мои гости пользуются ими до вылета и в поездке: интернет, хранение багажа, кимоно, такси и другое.', boton: 'Мои промокоды' },
}

export function FranjaVentajas({ lang }: { lang: Idioma }) {
  const t = TEXTO[lang]
  const conCodigo = APPS.filter((a) => cuponDe(a))
  return (
    <aside className="v7-franja-ventajas" aria-label={t.titulo}>
      <div className="v7-franja-ventajas-texto">
        <strong>{t.titulo}</strong>
        <p>{t.sub}</p>
        {conCodigo.length > 0 && (
          <ul>
            {conCodigo.map((a) => (
              <li key={a.clave}><bdi dir="ltr">{a.nombre}</bdi> {a.descuento && <b dir="ltr">{a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`}</b>}</li>
            ))}
          </ul>
        )}
      </div>
      <Link className="v7-franja-ventajas-boton" to={`${RUTA[lang]}#codigos`}>{t.boton} <span aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span></Link>
    </aside>
  )
}

# Las páginas legales de tonykansaiguide.com

Seis páginas, en los cinco idiomas, enlazadas desde el pie y entre ellas:

| Página | Ruta | Para qué |
|---|---|---|
| Términos y condiciones | `/terms` | Qué contratas: reserva, precios, cancelación, responsabilidad. Incluye los apartados 12–16 de senderismo. |
| Política de privacidad | `/privacy` | Qué datos se tratan y con qué base legal (RGPD). |
| Política de cookies | `/cookies` | La tabla real de lo que se guarda en el navegador. |
| Seguridad y seguro | `/safety` | Emergencias, seguro obligatorio, quién decide cancelar. |
| Aviso legal | `/legal` | Quién opera el sitio, propiedad intelectual, ley aplicable. |
| Accesibilidad | `/accessibility` | Qué funciona, qué no, y cómo avisar. |

Todas usan `src/components/LegalPage.tsx`: una sola cabecera, un solo pie y
los enlaces cruzados. Para añadir otra, copia `src/pages/Cookies.tsx`, mete la
ruta en `App.tsx`, añádela a `LEGAL_LINKS` del pie, a `LegalFooterLinks` y al
generador del sitemap.

## Lo que tienes que rellenar tú

Estas páginas describen **tu operativa real** tal y como estaba en los
términos que ya existían. Hay tres huecos que sólo puedes cerrar tú:

1. **Identidad fiscal.** El aviso legal dice el nombre comercial, la
   actividad, la sede y el contacto. Si registras la actividad (en Japón o en
   España), la ley europea de comercio electrónico te obliga a publicar además
   **razón social, número fiscal y domicilio**. Están marcados en un
   comentario dentro de `src/pages/Legal.tsx`.

2. **El seguro.** La página de seguridad dice que **exiges** seguro al
   cliente, que es cierto y te protege. No dice que tú tengas un seguro de
   responsabilidad civil, porque no me consta que lo tengas. Si lo contratas,
   decirlo en `/safety` es de las cosas que más confianza dan a un cliente que
   se va a la montaña contigo.

3. **Revisión profesional.** Yo he redactado esto siguiendo tu forma de
   trabajar y las prácticas habituales del sector. No es un dictamen jurídico.
   Antes de vender a clientes de la UE con cierto volumen, que se lo lea un
   abogado: cuesta poco y cierra el tema.

## Lo que ya no hace falta tocar

- `public/.well-known/security.txt` — cómo reportar un fallo de seguridad.
  Tiene fecha de caducidad (`Expires`): renuévala cada año.
- `public/robots.txt` — el panel de reseñas queda fuera de Google.
- `index.html` — `referrer` y `X-Content-Type-Options`. GitHub Pages no deja
  poner cabeceras HTTP, así que esto es lo que se puede declarar desde el HTML.

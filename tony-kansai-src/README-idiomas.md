# Los cinco idiomas de tonykansaiguide.com

La web habla **inglés, español, árabe, checo y ruso**. El árabe además se
lee de derecha a izquierda. Nada de eso se elige a mano en cada página: hay
dos mecanismos y una comprobación que impide que se cuele texto sin traducir.

## Los dos mecanismos

| Para qué | Dónde | Cómo se usa |
|---|---|---|
| Interfaz (menú, títulos de sección, botones fijos) | `src/lib/i18n.ts` | `const { t } = useLanguage()` → `t.nav.home` |
| Contenido (tours, rutas, guías, tarifas, textos legales) | `public/i18n/*.json` | `const { tc } = useLanguage()` → `tc('Hidden Kyoto')` |

`t` va con claves tipadas: si falta una, TypeScript no compila.
`tc` se indexa por la **cadena inglesa original**, como gettext. Por eso el
inglés no tiene fichero, y si algo se queda sin traducir sale en inglés en
vez de romperse.

## Qué idioma se elige

`?lang=ar` en la URL → lo guardado en el navegador → el idioma del móvil →
inglés. Se decide antes de pintar (`main.tsx` espera el diccionario), así
que nadie ve un parpadeo en inglés.

## Los diccionarios no se importan: se descargan

`public/i18n/es.json`, `ar.json`, `cs.json`, `ru.json`. Se piden por `fetch`,
**no** con `import`. El despliegue usa `vite-plugin-singlefile`, que mete
dentro del index.html todo lo que se importe: con `import` cada visitante se
bajaría los cinco idiomas (unos 170 kB comprimidos de más) para leer uno.

Efecto secundario útil: **se puede corregir una traducción sin recompilar**.
Editas el JSON, `git push`, y a los dos minutos está en la web.

## Antes de dar nada por hecho

```bash
npm run i18n     # ¿queda algo sin traducir?
```

Comprueba tres cosas y falla si alguna no cuadra (y `npm run build` la
ejecuta primero, así que un despliegue nunca sale con huecos):

1. cada `tc('…')` del código tiene entrada en los cuatro diccionarios;
2. cada texto visible de `data.ts` y de las fichas de guía, también;
3. no hay frases en inglés escritas a pelo dentro del JSX.

Para meter un lote de traducciones nuevas:

```bash
python3 scripts/merge_dict.py <<'JSON'
{"Nueva frase en inglés": ["español", "عربي", "čeština", "русский"]}
JSON
```

## Árabe: lo que hay que respetar

- **Tipografía propia**: IBM Plex Sans Arabic para el texto, Amiri para los
  titulares. La clase `lang-ar` en `<html>` las activa.
- **Sin `tracking`**: separar letras rompe la ligadura árabe. El CSS lo anula
  en todo el sitio.
- **Sin cursiva**: no existe en árabe; la sintética queda mal.
- **Nunca partir el texto en caracteres**: `HeroText` y `HeroTextKinetic`
  detectan escritura RTL y animan por palabras.
- **Cifras y unidades**: `1,125 m` dentro de un párrafo árabe sale como
  `m 1,125`. La clase `.ltr-num` las aísla. Los precios, altitudes y
  teléfonos ya la llevan.
- **Nada de `~`** delante de un número: el bidi lo empuja detrás. En árabe se
  escribe «نحو 35 دقيقة».
- **Diseño reflejado**: se usan utilidades lógicas de Tailwind (`start-`,
  `end-`, `ms-`, `me-`, `ps-`, `pe-`, `text-start`), no `left`/`right`. Las
  flechas llevan `.flip-rtl`.

## Las páginas sueltas

`opinar.html`, `resenas.html` y `booking.html` no son React: llevan su propio
diccionario dentro del fichero, con `data-t` en el HTML y `?lang=`. Mismo
patrón en las tres.

`panel-resenas.html` y `versions.html` se quedan en español a propósito: son
herramientas de Tony, no páginas de cliente.

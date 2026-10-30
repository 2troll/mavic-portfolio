#!/usr/bin/env node
// Genera public/fr/**: la sección en francés de Iheb, guía francófono en Tokio
// y el Kanto (más Nagano y Shizuoka).
//
//   node scripts/francais.mjs
//
// Clon de scripts/turkce.mjs (misma arquitectura). Son HTML estáticos a propósito,
// sin React: GPTBot, ClaudeBot y PerplexityBot no ejecutan JavaScript, y quien
// pregunta a una IA «guide francophone Tokyo» tiene que encontrar el texto entero
// en la primera respuesta del servidor. rutas-estaticas.mjs no las pisa (llevan
// data-estatica en <html>).
//
// Regla de contenido: nada que no sea verdad. De Iheb solo consta (30-10-2026,
// por Tony): se llama Iheb (solo el nombre), es amigo de Tony, guía en francés,
// habla también árabe e inglés, vive en Japón, guía SOLO en el Kanto (Tokio y
// alrededores: Kamakura, Yokohama, Nikko, Hakone) más Nagano y Shizuoka (lado
// del Fuji), y el precio lo da por WhatsApp según el grupo. NO guía en Kansai:
// Kioto/Osaka son de Tony y solo se nombran para presentar al equipo. NO inventar
// nacionalidad, años en Japón, apellido, licencias, títulos, reseñas, notas,
// precios ni recogidas en hotel o aeropuerto. Sí se puede decir que habla árabe y
// que puede meter comida halal, mezquitas y pausas para rezar en el día. Nada de
// alcohol (ni sake, ni bares, ni izakaya): la web es halal.
// Añadido el 30-10-2026 (dato de Tony): Iheb es profesional del anime, la cultura
// pop japonesa y el intercambio de cartas Pokémon (coleccionar/comprar cartas).
// Las cartas se presentan SIEMPRE como colección, nunca como inversión ni apuesta.
// Las páginas de anime/Pokémon están en ANIME (más abajo), con su propia regla.
//
// Fotos: Wikimedia Commons con licencia libre (CC BY / CC BY-SA / CC0 / PD);
// autor, licencia y página de origen en scripts/francais-photos.json, archivos en
// /fr/foto/<clave>-<ancho>.webp. El retrato de Iheb vive en /fr/foto/iheb-<ancho>.webp.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-10-30'
const HOY_FR = '30 octobre 2026'

// WhatsApp de Iheb (lo dio Tony el 30-10-2026). Las reservas le llegan a él.
const WA_NUMERO = '818080155322'
const WA_VISIBLE = '+81 80 8015 5322'
const ANGLAIS = 'french-speaking-guide-japan'
const AVIS_PAGE = 'avis-clients'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const WA_GENEL = wa('Bonjour Iheb, je cherche un guide francophone à Tokyo. Dates : ')

// Reseñas de Iheb: las manda el cliente desde /fr/avis/ y el Worker las publica.
// Se meten en el HTML al construir (las IAs no ejecutan JS) y, para quien
// visita, un script pide las que hayan llegado después del build.
const API_AVIS = 'https://tonykansaiguide.com/api/resenas/publicas?guia=iheb'
let AVIS = []
try {
  const r = await fetch(API_AVIS, { signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  AVIS = ((await r.json()).reviews ?? []).filter((y) => y?.id && y.text && y.stars)
} catch (e) {
  console.warn(`⚠ francais: sin reseñas del Worker (${e.message}); la sección sale vacía`)
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const PHOTOS = JSON.parse(readFileSync(join(root, 'scripts/francais-photos.json'), 'utf8'))
const photo = (k) => { if (!PHOTOS[k]) throw new Error(`francais: falta la foto ${k}`); return PHOTOS[k] }
// El ancho «grande» es el mayor ≤ 1920; el 3840 solo entra por srcset.
const grande = (k) => photo(k).anchos.find((w) => w <= 1920) ?? photo(k).anchos.at(-1)
const srcset = (k) => photo(k).anchos.map((w) => `/fr/foto/${k}-${w}.webp ${Math.min(w, photo(k).w)}w`).join(', ')
const credit = (k) => `Photo : <a href="${photo(k).kaynak}" rel="nofollow">${esc(photo(k).autor)}</a> · ${esc(photo(k).lisans)}`
const hero = (k, alt, contenu) => `<section class="kahraman">
<img src="/fr/foto/${k}-${grande(k)}.webp" srcset="${srcset(k)}" sizes="100vw" alt="${esc(alt)}" width="${photo(k).w}" height="${photo(k).h}" fetchpriority="high">
<div class="ortu"><div class="kap">${contenu}</div></div>
<small class="kredi">${credit(k)}</small>
</section>`
const imgCarte = (k, alt) => `<img src="/fr/foto/${k}-${photo(k).anchos.at(-1)}.webp" srcset="${srcset(k)}" sizes="(max-width:700px) 100vw, 380px" alt="${esc(alt)}" loading="lazy" width="${photo(k).w}" height="${photo(k).h}">`
const cartePhoto = (k, alt) => `<figure class="kf">${imgCarte(k, alt)}<figcaption>${credit(k)}</figcaption></figure>`
// Tarjeta entera clicable: el crédito (que lleva su propio enlace a Commons) va
// FUERA del <a> de la tarjeta, porque un <a> dentro de otro es HTML inválido
// (auditoría del 30-10-2026). Se superpone a la foto con position:absolute.
const carteLien = (href, k, alt, titre, texte) => `<li><a href="${href}"><figure class="kf">${imgCarte(k, alt)}</figure><div class="ki"><h3>${esc(titre)}</h3><p>${esc(texte)}</p></div></a><small class="kf-kredi">${credit(k)}</small></li>`

// Retrato de Iheb (1080×1085).
const PORTRAIT_ALT = 'Iheb, guide francophone à Tokyo'
const PORTRAIT_SRCSET = '/fr/foto/iheb-320.webp 320w, /fr/foto/iheb-640.webp 640w, /fr/foto/iheb-1080.webp 1080w'
const portraitGrand = `<img class="portrait" src="/fr/foto/iheb-640.webp" srcset="${PORTRAIT_SRCSET}" sizes="(max-width:700px) 80vw, 360px" alt="${PORTRAIT_ALT}" width="1080" height="1085" loading="lazy">`
const contactMini = (lien, texte) => `<div class="iheb-mini"><img src="/fr/foto/iheb-320.webp" srcset="/fr/foto/iheb-320.webp 1x, /fr/foto/iheb-640.webp 2x" alt="${PORTRAIT_ALT}" width="96" height="96" loading="lazy"><div><p><strong>Iheb</strong>, votre guide francophone à Tokyo et dans ses environs. Il parle aussi arabe et anglais.</p><p><a class="btn" href="${lien}">${texte}</a></p></div></div>`

// Zonas de Iheb: Tokio y el Kanto, más Nagano y Shizuoka. Los cinco lagos del
// Fuji están en Yamanashi: se dicen como excursión desde Tokio, sin esconderlo.
const VILLES = [
  {
    yol: 'tokyo', ad: 'Tokyo', nav: 'Tokyo', a: 'à Tokyo', kapak: 'senso-ji-pagode',
    titre: 'Guide francophone à Tokyo : Iheb | Visite privée de Tokyo en français',
    desc: 'Guide privé francophone à Tokyo : Asakusa et Senso-ji, Meiji Jingu, Shibuya, Skytree, marché de Tsukiji. Uniquement pour votre groupe, en français. Tarif sur WhatsApp.',
    intro: 'Tokyo, ce sont des dizaines de quartiers qui ne se ressemblent pas : vieux temples d’Asakusa, forêt du sanctuaire Meiji, carrefour de Shibuya, tours de Shinjuku. Iheb construit la journée à votre rythme et vous la raconte en français.',
    lieux: [
      ['Asakusa et Senso-ji', 'Le plus ancien temple de Tokyo, la porte Kaminarimon et sa grande lanterne rouge, puis la rue commerçante Nakamise.', 'kaminarimon'],
      ['Meiji Jingu', 'Le sanctuaire dédié à l’empereur Meiji et à l’impératrice Shoken, au milieu d’une forêt en plein centre, à deux pas de Harajuku.', 'meiji-jingu'],
      ['Shibuya', 'Le célèbre carrefour où des centaines de piétons traversent en même temps, dans toutes les directions.', 'shibuya'],
      ['Tokyo Skytree', 'Avec 634 mètres, la plus haute tour du Japon ; vue sur toute la ville par temps clair.', 'skytree'],
      ['Jardins est du Palais impérial', 'Les jardins bâtis sur les ruines du château d’Edo, au cœur de la ville, près de la gare de Tokyo.', 'palais-imperial'],
      ['Marché extérieur de Tsukiji', 'Les étals de produits de la mer et de cuisine de rue restés à Tsukiji après le départ du marché de gros à Toyosu en 2018.', 'tsukiji'],
      ['Odaiba', 'Le front de mer et le Rainbow Bridge, surtout beaux à la tombée de la nuit.', 'odaiba'],
    ],
    astuce: 'Pour circuler, une carte IC (Suica ou PASMO) suffit dans le métro, les trains et les bus de Tokyo. Pour les voyageurs musulmans, la Tokyo Camii, à Yoyogi-Uehara, accueille les visiteurs ; Iheb peut l’intégrer à la journée avec les pauses prière.',
    voir: ['que-faire-a-tokyo', 'jr-pass-ou-suica', 'budget-tokyo', 'tokyo-en-famille', 'guide-prive-tokyo-prix', 'halal-mosquees-tokyo'],
  },
  {
    yol: 'kamakura', ad: 'Kamakura, Yokohama et Enoshima', nav: 'Kamakura', a: 'à Kamakura', kapak: 'kamakura-daibutsu',
    titre: 'Guide francophone à Kamakura et Yokohama : Iheb | Excursion depuis Tokyo',
    desc: 'Excursion en français depuis Tokyo : le Grand Bouddha de Kamakura, Tsurugaoka Hachimangu, Hase-dera, l’île d’Enoshima et Yokohama. Visite privée avec Iheb, tarif sur WhatsApp.',
    intro: 'Kamakura a été le siège du premier shogunat, de la fin du XIIe siècle à 1333. Aujourd’hui, c’est une petite ville de temples entre collines et mer, à environ une heure de Tokyo en train : l’excursion idéale pour une journée plus calme.',
    lieux: [
      ['Grand Bouddha (Kotoku-in)', 'Un bouddha de bronze de plus de 11 mètres, assis en plein air depuis que son bâtiment a disparu il y a plusieurs siècles.', 'kamakura-daibutsu'],
      ['Tsurugaoka Hachimangu', 'Le grand sanctuaire de Kamakura, au bout d’une longue allée qui part de la gare.', 'tsurugaoka'],
      ['Hase-dera', 'Un temple à flanc de colline avec vue sur la baie ; ses hortensias attirent beaucoup de monde en juin.', 'hasedera'],
      ['Enoshima', 'Une petite île reliée à la côte par un pont, qu’on rejoint avec le petit train Enoden.', 'enoshima'],
      ['Yokohama', 'Le port, le quartier de Minato Mirai et son front de mer, à mi-chemin entre Tokyo et Kamakura.', 'yokohama'],
    ],
    astuce: 'Depuis la gare de Tokyo, la ligne JR Yokosuka rejoint Kamakura en environ une heure sans changement. Le petit train Enoden relie ensuite Kamakura, le Grand Bouddha (gare de Hase) et Enoshima. Yokohama se combine facilement sur le trajet.',
    voir: ['tokyo-en-famille', 'jr-pass-ou-suica'],
  },
  {
    yol: 'nikko', ad: 'Nikko', nav: 'Nikko', a: 'à Nikko', kapak: 'nikko-yomeimon',
    titre: 'Guide francophone à Nikko : Iheb | Excursion à Nikko depuis Tokyo en français',
    desc: 'Excursion privée en français de Tokyo à Nikko : le Tosho-gu, le pont Shinkyo, la cascade de Kegon et le lac Chuzenji. Patrimoine mondial de l’UNESCO. Tarif sur WhatsApp.',
    intro: 'Au nord de Tokyo, dans la préfecture de Tochigi, Nikko réunit sanctuaires sculptés et montagnes. Les « sanctuaires et temples de Nikko » sont inscrits au patrimoine mondial de l’UNESCO depuis 1999. C’est une longue journée depuis Tokyo, mais l’une des plus belles.',
    lieux: [
      ['Tosho-gu', 'Le mausolée de Tokugawa Ieyasu, fondateur du shogunat d’Edo, et sa porte Yomeimon couverte de sculptures et de dorures.', 'nikko-yomeimon'],
      ['Pont Shinkyo', 'Le pont sacré laqué de rouge au-dessus de la rivière Daiya, à l’entrée du site.', 'shinkyo'],
      ['Cascade de Kegon', 'Une chute d’environ 97 mètres, plus haut dans la montagne, vue depuis une plateforme en contrebas.', 'kegon'],
      ['Lac Chuzenji', 'Un lac d’altitude au pied du mont Nantai, très beau à l’automne.', 'chuzenji'],
    ],
    astuce: 'Depuis Asakusa, le train Tobu Spacia X rejoint Nikko en environ 1 h 50. Le Tosho-gu ferme plus tôt de novembre à mars (vers 16 h). En altitude, autour du lac Chuzenji, les couleurs d’automne arrivent dès octobre, plus tôt qu’à Tokyo.',
    voir: ['nikko-ou-hakone', 'quand-partir-japon'],
  },
  {
    yol: 'hakone-mont-fuji', ad: 'Hakone et mont Fuji', nav: 'Hakone & Fuji', a: 'à Hakone et au mont Fuji', kapak: 'hakone-ashi-torii',
    titre: 'Guide francophone à Hakone et au mont Fuji : Iheb | Excursion depuis Tokyo',
    desc: 'Excursion privée en français depuis Tokyo : Hakone (lac Ashi, Owakudani) ou les lacs du Fuji (Kawaguchiko, pagode Chureito, Oshino Hakkai). Tarif sur WhatsApp.',
    intro: 'Pour voir le mont Fuji depuis Tokyo, deux régions s’offrent à vous. Hakone, dans la préfecture de Kanagawa : lac Ashi, téléphérique et vallée volcanique. Les cinq lacs du Fuji, autour de Kawaguchiko, sont dans la préfecture voisine de Yamanashi, mais restent une excursion classique d’une journée depuis Tokyo. Les deux ensemble dans la même journée, c’est trop : il faut choisir.',
    lieux: [
      ['Lac Ashi et sanctuaire de Hakone', 'Le torii rouge planté dans l’eau du lac, et la traversée en bateau.', 'hakone-jinja-torii'],
      ['Owakudani', 'La vallée volcanique fumante, survolée par le téléphérique de Hakone. L’accès peut être restreint selon l’activité volcanique.', 'owakudani'],
      ['Lac Kawaguchi', 'Le plus accessible des cinq lacs, avec le mont Fuji qui se reflète dans l’eau par temps calme.', 'kawaguchiko-fuji'],
      ['Pagode Chureito', 'La pagode rouge du parc Arakurayama Sengen, avec le Fuji en arrière-plan : la photo la plus connue de la région.', 'fuji-chureito'],
      ['Oshino Hakkai', 'Un village de bassins alimentés par les eaux de source du Fuji.', 'oshino-hakkai'],
    ],
    astuce: 'Depuis Shinjuku, la Romancecar d’Odakyu rejoint Hakone-Yumoto en environ 1 h 20, et le train Fuji Excursion va directement à Kawaguchiko en environ 2 heures. Le Fuji est souvent caché par les nuages : les matins d’hiver sont en général les plus dégagés.',
    voir: ['voir-le-mont-fuji', 'nikko-ou-hakone', 'excursion-mont-fuji-depuis-tokyo'],
  },
  {
    yol: 'nagano', ad: 'Nagano', nav: 'Nagano', a: 'à Nagano', kapak: 'zenkoji-kondo',
    titre: 'Guide francophone à Nagano : Iheb | Zenko-ji, singes des neiges et Matsumoto',
    desc: 'Visite privée en français dans la préfecture de Nagano : le temple Zenko-ji, les singes des neiges de Jigokudani et le château de Matsumoto. Depuis Tokyo en Shinkansen. Tarif sur WhatsApp.',
    intro: 'La préfecture de Nagano, au cœur des Alpes japonaises, a accueilli les Jeux olympiques d’hiver de 1998. On y vient pour le grand temple Zenko-ji, pour les macaques qui se baignent dans une source chaude et pour l’un des plus beaux châteaux d’origine du Japon, à Matsumoto.',
    lieux: [
      ['Zenko-ji', 'L’un des grands temples bouddhiques du Japon, fondé selon la tradition au VIIe siècle ; il est ouvert à tous, quelle que soit l’école.', 'zenkoji-kondo'],
      ['Singes des neiges (Jigokudani)', 'Au parc Jigokudani Yaen-koen, des macaques sauvages se baignent dans une source chaude, surtout en hiver, au milieu de la neige.', 'singes-jigokudani'],
      ['Château de Matsumoto', 'Un donjon noir d’origine, classé trésor national, entouré de douves.', 'matsumoto'],
    ],
    astuce: 'Le Hokuriku Shinkansen relie Tokyo à Nagano en environ 1 h 20 à 1 h 40. Pour les singes, comptez environ 45 minutes de bus depuis la gare de Nagano, puis une trentaine de minutes de marche en forêt. Matsumoto est à environ 2 h 30 à 3 h de Shinjuku en train express.',
    voir: ['jr-pass-ou-suica', 'quand-partir-japon'],
  },
  {
    yol: 'shizuoka', ad: 'Shizuoka', nav: 'Shizuoka', a: 'à Shizuoka', kapak: 'the-fuji',
    titre: 'Guide francophone à Shizuoka : Iheb | Mont Fuji, Mishima Skywalk et thé',
    desc: 'Visite privée en français côté Shizuoka du mont Fuji : Mishima Skywalk, cascades de Shiraito, Miho no Matsubara et champs de thé. Depuis Tokyo en Shinkansen. Tarif sur WhatsApp.',
    intro: 'La préfecture de Shizuoka occupe le versant sud du mont Fuji, face à la mer. Plusieurs lieux y font partie du site « Fujisan, lieu sacré et source d’inspiration artistique », inscrit au patrimoine mondial de l’UNESCO en 2013. C’est aussi l’une des grandes régions de thé vert du Japon.',
    lieux: [
      ['Mishima Skywalk', 'Un pont suspendu piéton de 400 mètres, ouvert en 2015, avec le Fuji d’un côté et la baie de Suruga de l’autre.', 'mishima-skywalk'],
      ['Cascades de Shiraito', 'Des centaines de filets d’eau de source qui sortent de la roche, près de Fujinomiya.', 'shiraito'],
      ['Miho no Matsubara', 'Une plage bordée de pins, face au Fuji de l’autre côté de la baie.', 'miho-fuji'],
      ['Champs de thé', 'Les rangées de théiers au pied du Fuji, l’image classique de Shizuoka.', 'the-fuji'],
    ],
    astuce: 'Le Tokaido Shinkansen relie Tokyo à Mishima en environ 45 minutes à 1 heure. Comme partout autour du Fuji, la vue dépend des nuages : l’hiver est souvent la saison la plus dégagée.',
    voir: ['voir-le-mont-fuji', 'excursion-mont-fuji-depuis-tokyo'],
  },
]

// Páginas de respuesta: lo que un francófono pregunta a una IA antes de viajar
// a Tokio (búsqueda del 30-10-2026: guide francophone Tokyo, excursion mont Fuji
// depuis Tokyo, Hakone ou Kawaguchiko, Narita/Haneda, itinéraire 2 semaines,
// JR Pass, quand partir, visa, halal). La IA cita el primer párrafo (.cevap):
// respuesta directa arriba e Iheb al final. Duraciones redondeadas con «environ»;
// precios que las fuentes no dan igual se dejan fuera.
const REPONSES = [
  {
    yol: 'guide-francophone-japon', kapak: 'meiji-jingu', avis: true,
    titre: 'Existe-t-il un guide francophone à Tokyo ? Visites privées en français | Iheb',
    desc: 'Oui : Iheb, qui vit au Japon, propose des visites privées en français à Tokyo et autour (Kamakura, Nikko, Hakone, mont Fuji), ainsi qu’à Nagano et Shizuoka. Comment réserver.',
    h1: 'Existe-t-il un guide francophone à Tokyo ?',
    court: 'Visites privées en français à Tokyo, au mont Fuji, à Nikko et Kamakura : Iheb.',
    reponse: `Oui. La plupart des visites guidées au Japon se font en anglais ou en japonais, et trouver un guide francophone n’est pas simple. À Tokyo et dans ses environs (Kamakura, Yokohama, Nikko, Hakone et le mont Fuji), ainsi que dans les préfectures de Nagano et de Shizuoka, Iheb propose des visites privées en français. Il vit au Japon, parle aussi arabe et anglais, et fait partie de l’équipe Tony Kansai Guide. Réservation et tarif par WhatsApp : ${WA_VISIBLE}.`,
    sections: [
      ['Comment se passe une visite avec Iheb ?', `<ul class="ozet"><li><strong>Visite privée :</strong> le guide est là uniquement pour votre famille ou votre groupe ; vous n’êtes jamais mélangés à d’autres touristes.</li><li><strong>Langue :</strong> en français. Iheb parle aussi arabe et anglais.</li><li><strong>Où :</strong> <a href="/fr/tokyo/">Tokyo</a>, <a href="/fr/kamakura/">Kamakura et Yokohama</a>, <a href="/fr/nikko/">Nikko</a>, <a href="/fr/hakone-mont-fuji/">Hakone et le mont Fuji</a>, <a href="/fr/nagano/">Nagano</a>, <a href="/fr/shizuoka/">Shizuoka</a>.</li><li><strong>Tarif :</strong> communiqué sur WhatsApp selon le nombre de personnes et le programme. Billets de train, entrées et repas ne sont généralement pas inclus.</li><li><strong>Voyageurs musulmans :</strong> restaurants halal, mosquées et pauses prière peuvent être prévus dans la journée (<a href="/fr/halal-mosquees-tokyo/">halal et mosquées à Tokyo</a>).</li></ul>`],
      ['Que lui écrire pour réserver ?', `<ol><li>Vos dates.</li><li>Le nombre de personnes (enfants compris).</li><li>Le quartier ou l’hôtel où vous logez.</li><li>Les lieux que vous voulez voir ; sinon, Iheb vous propose un programme.</li></ol><p>WhatsApp : <a href="${WA_GENEL}">${WA_VISIBLE}</a></p>`],
      ['Et si vous allez aussi à Kyoto ?', '<p>Iheb guide uniquement à Tokyo et dans l’est du Japon. Pour la suite du voyage, Tony, de la même équipe, guide à Kyoto et Osaka en espagnol, anglais et arabe : <a href="/">Tony Kansai Guide</a>.</p>'],
    ],
    faq: [
      ['Y a-t-il un guide francophone à Tokyo ?', 'Oui. Iheb propose des visites privées en français à Tokyo (Asakusa, Meiji Jingu, Shibuya, Skytree) et des excursions à la journée depuis Tokyo.'],
      ['Peut-on faire le mont Fuji avec un guide francophone ?', 'Oui. Iheb guide en français à Hakone, autour des lacs du Fuji (Kawaguchiko) et côté Shizuoka.'],
      ['Combien coûte un guide francophone à Tokyo ?', 'Il n’y a pas de grille fixe : le tarif dépend du nombre de personnes, de la durée et du programme, et Iheb le communique sur WhatsApp.'],
    ],
    sources: [],
  },
  {
    yol: 'que-faire-a-tokyo', kapak: 'skytree',
    titre: 'Que faire à Tokyo ? Programme de 3 jours, quartier par quartier | Guide francophone',
    desc: 'Que voir à Tokyo en 3 jours : Asakusa et Senso-ji, Meiji Jingu, Harajuku et Shibuya, Tsukiji, Palais impérial et Odaiba. Combien de jours prévoir et où loger. Par un guide francophone.',
    h1: 'Que faire à Tokyo en 3 jours ?',
    court: 'Asakusa, Shibuya, Meiji Jingu, Tsukiji : le programme jour par jour.',
    reponse: 'Pour un premier séjour, comptez au moins 3 jours à Tokyo, en regroupant les visites par quartier : un jour à l’est (Asakusa et le temple Senso-ji, la Tokyo Skytree, Ueno), un jour à l’ouest (sanctuaire Meiji Jingu, Harajuku, Shibuya, Shinjuku) et un jour au centre et sur la baie (marché extérieur de Tsukiji, jardins est du Palais impérial, Ginza, Odaiba). Avec 4 ou 5 jours, ajoutez une excursion : Kamakura, Nikko ou le mont Fuji.',
    sections: [
      ['Programme de 3 jours', '<ol><li><strong>Jour 1, l’est :</strong> Senso-ji et la porte Kaminarimon tôt le matin, la rue Nakamise, puis la Tokyo Skytree et le parc d’Ueno.</li><li><strong>Jour 2, l’ouest :</strong> Meiji Jingu le matin, Harajuku et Omotesando, le carrefour de Shibuya, et Shinjuku le soir.</li><li><strong>Jour 3, le centre et la baie :</strong> marché extérieur de Tsukiji, jardins est du Palais impérial, Ginza, puis Odaiba et le Rainbow Bridge à la tombée de la nuit.</li></ol>'],
      ['Excursions d’une journée depuis Tokyo', '<ul class="ozet"><li><a href="/fr/kamakura/">Kamakura et Yokohama</a> : environ 1 heure de train.</li><li><a href="/fr/nikko/">Nikko</a> : environ 1 h 50 depuis Asakusa.</li><li><a href="/fr/hakone-mont-fuji/">Hakone ou les lacs du Fuji</a> : environ 1 h 20 à 2 heures depuis Shinjuku.</li></ul>'],
      ['Où loger ?', '<p>Près d’une gare de la ligne circulaire JR Yamanote : Shinjuku ou Shibuya pour l’ouest et les départs vers Hakone et le Fuji, la gare de Tokyo ou Ueno pour l’est, Nikko, l’aéroport de Narita et le Shinkansen.</p>'],
    ],
    faq: [
      ['Combien de jours faut-il pour visiter Tokyo ?', 'Au moins 3 jours pour les quartiers principaux ; 4 à 5 jours avec une excursion (Kamakura, Nikko ou le mont Fuji).'],
      ['Comment se déplacer à Tokyo ?', 'En métro et en train, avec une carte IC (Suica ou PASMO) qu’on recharge et qu’on passe aux portillons ; elle marche aussi dans les bus.'],
      ['Le marché de Tsukiji existe-t-il encore ?', 'Le marché de gros a déménagé à Toyosu en 2018, mais le marché extérieur de Tsukiji, avec ses étals et sa cuisine de rue, est toujours ouvert.'],
    ],
    sources: [['JNTO (Office national du tourisme japonais)', 'https://www.japan.travel/fr/']],
  },
  {
    yol: 'excursion-mont-fuji-depuis-tokyo', kapak: 'kawaguchiko-fuji',
    titre: 'Excursion au mont Fuji depuis Tokyo : Hakone ou Kawaguchiko ? | Guide francophone',
    desc: 'Mont Fuji en une journée depuis Tokyo : Kawaguchiko (pagode Chureito, Oshino Hakkai) ou Hakone (lac Ashi, Owakudani) ? Trains, durées, quand voir le Fuji. Guide francophone Iheb.',
    h1: 'Comment faire une excursion au mont Fuji depuis Tokyo ?',
    court: 'Kawaguchiko ou Hakone : laquelle choisir pour une journée.',
    reponse: 'Depuis Tokyo, on voit le mont Fuji en une journée en choisissant une seule de ces deux régions : les lacs du Fuji autour de Kawaguchiko (préfecture de Yamanashi), avec la pagode Chureito et Oshino Hakkai, à environ 2 heures de Shinjuku par le train direct Fuji Excursion ; ou Hakone (préfecture de Kanagawa), avec le lac Ashi et la vallée volcanique d’Owakudani, à environ 1 h 20 de Shinjuku en Romancecar. Il faut environ 2 heures de bus, avec un changement à Gotemba, pour passer de l’une à l’autre : les combiner dans la même journée est déconseillé.',
    sections: [
      ['Kawaguchiko ou Hakone ?', `<table><tr><th></th><th>Lacs du Fuji (Kawaguchiko)</th><th>Hakone</th></tr>
<tr><td>Préfecture</td><td>Yamanashi</td><td>Kanagawa</td></tr>
<tr><td>Depuis Shinjuku</td><td>Train Fuji Excursion, environ 2 h ; ou bus express</td><td>Romancecar d’Odakyu, environ 1 h 20 jusqu’à Hakone-Yumoto</td></tr>
<tr><td>Vue sur le Fuji</td><td>De très près, au-dessus du lac</td><td>Plus lointaine, depuis le lac Ashi ou le téléphérique</td></tr>
<tr><td>À voir</td><td>Lac Kawaguchi, pagode Chureito, Oshino Hakkai</td><td>Lac Ashi et son torii, téléphérique, Owakudani</td></tr></table>`],
      ['Et côté Shizuoka ?', '<p>On rejoint le versant sud du Fuji, côté <a href="/fr/shizuoka/">Shizuoka</a>, en Shinkansen (Tokyo-Mishima, environ 45 minutes à 1 heure) : Mishima Skywalk, cascades de Shiraito, Miho no Matsubara et champs de thé.</p>'],
      ['Quand voit-on le mont Fuji ?', '<p>Le sommet est souvent caché par les nuages, surtout en été. Les matins d’automne et d’hiver sont en général les plus dégagés. L’ascension, elle, n’est possible qu’en été, en général de juillet à début septembre.</p>'],
    ],
    faq: [
      ['Peut-on faire Hakone et Kawaguchiko dans la même journée ?', 'C’est déconseillé : il faut environ 2 heures de bus entre les deux, avec un changement à Gotemba. Choisissez-en une, ou dormez sur place.'],
      ['Combien de temps entre Tokyo et le mont Fuji ?', 'Environ 2 heures jusqu’à Kawaguchiko depuis Shinjuku en train direct, et environ 1 h 20 jusqu’à Hakone-Yumoto en Romancecar.'],
      ['Y a-t-il une excursion au mont Fuji en français ?', 'Oui : Iheb guide en privé et en français à Hakone, autour de Kawaguchiko et côté Shizuoka. Tarif sur WhatsApp.'],
    ],
    sources: [['Odakyu : Romancecar', 'https://www.odakyu.jp/english/'], ['JNTO : mont Fuji', 'https://www.japan.travel/fr/']],
  },
  {
    yol: 'aeroport-narita-haneda-tokyo', kapak: 'narita',
    titre: 'Aéroport de Narita ou Haneda vers Tokyo : trains et durées | Guide francophone',
    desc: 'De Narita à Tokyo : Narita Express (environ 1 h) ou Keisei Skyliner (environ 40 min jusqu’à Ueno). De Haneda : Keikyu ou monorail, environ 15 à 30 minutes. Quelle option choisir.',
    h1: 'Comment aller de l’aéroport de Narita ou de Haneda à Tokyo ?',
    court: 'Narita Express, Skyliner, Keikyu, monorail : les durées.',
    reponse: 'Depuis Narita, les deux trains rapides sont le Keisei Skyliner, qui rejoint Nippori et Ueno en environ 40 minutes, et le Narita Express (N’EX) de JR, qui va à la gare de Tokyo en environ 1 heure puis continue vers Shinagawa, Shibuya et Shinjuku. Haneda est beaucoup plus proche du centre : la ligne Keikyu (vers Shinagawa) ou le Tokyo Monorail (vers Hamamatsucho) mettent environ 15 à 30 minutes. Des bus directs desservent aussi les grands hôtels depuis les deux aéroports.',
    sections: [
      ['Les options', `<table><tr><th>Depuis</th><th>Transport</th><th>Destination</th><th>Durée</th></tr>
<tr><td>Narita</td><td>Keisei Skyliner</td><td>Nippori, Ueno</td><td>environ 40 min</td></tr>
<tr><td>Narita</td><td>JR Narita Express (N’EX)</td><td>Gare de Tokyo, puis Shinagawa, Shibuya, Shinjuku</td><td>environ 1 h jusqu’à la gare de Tokyo</td></tr>
<tr><td>Haneda</td><td>Keikyu</td><td>Shinagawa</td><td>environ 15-20 min</td></tr>
<tr><td>Haneda</td><td>Tokyo Monorail</td><td>Hamamatsucho</td><td>environ 15-20 min</td></tr></table>`],
      ['Conseils', '<ul class="ozet"><li>Les tarifs évoluent : vérifiez le prix à jour sur le site de la compagnie ou au guichet.</li><li>Les cartes IC (Suica, PASMO) fonctionnent sur la ligne Keikyu et le monorail. Le Skyliner et le N’EX n’ont que des places réservées : il faut acheter un billet (distributeur, guichet ou en ligne).</li><li>Narita et Haneda disposent de salles de prière.</li><li>Pour vos visites en français à Tokyo, écrivez à Iheb sur WhatsApp.</li></ul>'],
    ],
    faq: [
      ['Narita ou Haneda : quel aéroport est le plus proche de Tokyo ?', 'Haneda : environ 15 à 30 minutes du centre, contre environ 40 minutes à 1 heure depuis Narita en train rapide.'],
      ['Quel est le train le plus rapide depuis Narita ?', 'Le Keisei Skyliner, environ 40 minutes jusqu’à Ueno (un peu moins jusqu’à Nippori).'],
    ],
    sources: [['JR East : Narita Express', 'https://www.jreast.co.jp/multi/en/nex/'], ['Keisei Skyliner', 'https://www.keisei.co.jp/keisei/tetudou/skyliner/us/'], ['Aéroport de Haneda : accès', 'https://tokyo-haneda.com/en/access/']],
  },
  {
    yol: 'itineraire-japon-2-semaines', kapak: 'shibuya',
    titre: 'Itinéraire Japon 2 semaines : Tokyo, mont Fuji et environs | Guide francophone',
    desc: 'Un itinéraire de 2 semaines pour un premier voyage au Japon : Tokyo et ses excursions (Kamakura, Nikko, mont Fuji) la première semaine, puis l’ouest du pays. JR Pass ou billets séparés.',
    h1: 'Quel itinéraire pour 2 semaines au Japon ?',
    court: 'Une semaine autour de Tokyo, jour par jour, puis la suite du voyage.',
    reponse: 'Pour un premier voyage de 2 semaines, beaucoup de voyageurs passent la première semaine à Tokyo et dans ses environs (4 à 5 jours en ville, plus des excursions à Kamakura, Nikko ou au mont Fuji), puis prennent le Shinkansen vers l’ouest pour la seconde semaine. Regrouper les visites par région évite de passer ses journées dans les trains.',
    sections: [
      ['Semaine 1 : Tokyo et ses environs', '<ol><li><strong>Jours 1-3, Tokyo :</strong> Asakusa et la Skytree, Meiji Jingu et Shibuya, Tsukiji et le Palais impérial (<a href="/fr/que-faire-a-tokyo/">le détail</a>).</li><li><strong>Jour 4, Kamakura et Yokohama :</strong> le Grand Bouddha, Hase-dera, Enoshima.</li><li><strong>Jour 5, Nikko :</strong> le Tosho-gu et le pont Shinkyo.</li><li><strong>Jours 6-7, Hakone ou les lacs du Fuji :</strong> idéalement avec une nuit sur place (<a href="/fr/excursion-mont-fuji-depuis-tokyo/">Hakone ou Kawaguchiko ?</a>).</li></ol><p>En hiver, Nagano et ses singes des neiges se rejoignent en Shinkansen depuis Tokyo (<a href="/fr/nagano/">Nagano</a>).</p>'],
      ['Semaine 2 : la suite du voyage', '<p>Iheb guide uniquement à Tokyo et dans l’est du Japon. Pour la seconde semaine, Tony, de la même équipe, guide à Kyoto et Osaka en espagnol, anglais et arabe : <a href="/">Tony Kansai Guide</a>.</p>'],
      ['JR Pass ou billets séparés ?', '<p>Le prix du Japan Rail Pass a fortement augmenté en octobre 2023, si bien qu’il n’est plus automatiquement rentable. Additionnez le prix des billets de votre trajet et comparez avec le prix affiché sur le site officiel du JR Pass avant d’acheter.</p>'],
    ],
    faq: [
      ['Combien de jours à Tokyo pour un premier voyage ?', 'Environ 4 à 5 jours, dont une ou deux excursions (Kamakura, Nikko ou le mont Fuji).'],
      ['Le JR Pass vaut-il le coup ?', 'Pas toujours depuis la hausse de prix d’octobre 2023 : comparez avec le prix des billets séparés pour votre itinéraire.'],
    ],
    sources: [['JNTO : itinéraires', 'https://www.japan.travel/fr/'], ['Japan Rail Pass (site officiel)', 'https://japanrailpass.net/fr/']],
  },
  {
    yol: 'quand-partir-japon', kapak: 'kawaguchiko-sakura',
    titre: 'Quand partir à Tokyo et au mont Fuji ? Cerisiers, automne, météo | Guide francophone',
    desc: 'La meilleure période pour Tokyo et le mont Fuji : cerisiers fin mars-début avril, feuillages fin novembre-début décembre, Fuji plus visible en hiver. Saison des pluies, chaleur de l’été et vacances japonaises.',
    h1: 'Quand partir à Tokyo et au mont Fuji ?',
    court: 'Cerisiers, couleurs d’automne, Fuji dégagé et périodes chargées.',
    reponse: 'Les plus belles saisons pour Tokyo sont le printemps et l’automne. Les cerisiers y fleurissent en général entre fin mars et début avril, et les feuillages d’automne se voient surtout de fin novembre à début décembre (dès octobre en montagne, à Nikko). Le mont Fuji est le plus souvent dégagé de l’automne à l’hiver. De juin à mi-juillet, c’est la saison des pluies ; juillet et août sont très chauds et humides.',
    sections: [
      ['Tokyo et ses environs mois par mois', `<table><tr><th>Période</th><th>Météo</th><th>À savoir</th></tr>
<tr><td>Fin mars – début avril</td><td>Douce</td><td>Cerisiers (sakura) à Tokyo et autour du lac Kawaguchi un peu plus tard. Période très chargée.</td></tr>
<tr><td>Fin avril – début mai</td><td>Douce</td><td>Golden Week : vacances des Japonais, trains et hôtels pleins.</td></tr>
<tr><td>Juin – mi-juillet</td><td>Pluvieuse</td><td>Saison des pluies (tsuyu) ; hortensias à Kamakura.</td></tr>
<tr><td>Juillet – août</td><td>Très chaude, humide</td><td>Sortez tôt le matin. Saison de l’ascension du Fuji, mais le sommet est souvent dans les nuages vu d’en bas.</td></tr>
<tr><td>Août – septembre</td><td>Chaude</td><td>Saison des typhons ; des trains peuvent être annulés.</td></tr>
<tr><td>Octobre – début décembre</td><td>Fraîche</td><td>Couleurs d’automne : d’abord en altitude (Nikko, Hakone), puis à Tokyo fin novembre.</td></tr>
<tr><td>Décembre – février</td><td>Froide, sèche, souvent ensoleillée</td><td>Le Fuji est le plus souvent visible. Singes des neiges à Nagano. Beaucoup de lieux ferment au Nouvel An.</td></tr></table>`],
      ['Pour éviter la foule', '<p>Allez tôt le matin aux lieux les plus connus (Senso-ji, Meiji Jingu, pagode Chureito). Évitez la Golden Week et la mi-août (Obon). Pendant la floraison des cerisiers et en automne, privilégiez les jours de semaine.</p>'],
    ],
    faq: [
      ['Quand fleurissent les cerisiers à Tokyo ?', 'En général entre fin mars et début avril ; la date varie de quelques jours d’une année sur l’autre.'],
      ['Quelle est la meilleure saison pour voir le mont Fuji ?', 'De l’automne à l’hiver, surtout le matin : l’air est plus sec et le ciel plus souvent dégagé.'],
      ['Quand voir les singes des neiges ?', 'Toute l’année, mais c’est en hiver, avec la neige (en général de décembre à mars), qu’ils se baignent le plus dans la source chaude.'],
    ],
    sources: [['JNTO (Office national du tourisme japonais)', 'https://www.japan.travel/fr/'], ['Jigokudani Yaen-koen', 'https://jigokudani-yaenkoen.co.jp/']],
  },
  {
    yol: 'visa-japon', kapak: 'kaminarimon',
    titre: 'Visa pour le Japon : France, Belgique, Suisse, Canada, Maghreb | Guide francophone',
    desc: 'Français, Belges, Suisses, Canadiens et Tunisiens entrent au Japon sans visa jusqu’à 90 jours pour du tourisme. Maroc et Algérie : visa requis. Formalités, Visit Japan Web et guide francophone à Tokyo.',
    h1: 'Faut-il un visa pour aller au Japon ?',
    court: 'France, Belgique, Suisse, Canada, Tunisie : pas de visa jusqu’à 90 jours.',
    reponse: 'Pour un séjour touristique, les ressortissants français, belges, suisses, canadiens et tunisiens sont exemptés de visa et peuvent rester au Japon jusqu’à 90 jours. Pour travailler ou rester plus longtemps, un visa est nécessaire. Les ressortissants marocains et algériens ont besoin d’un visa : consultez l’ambassade du Japon de votre pays. Les règles peuvent changer : vérifiez la liste du ministère japonais des Affaires étrangères avant de partir.',
    sections: [
      ['Selon votre passeport', `<table><tr><th>Passeport</th><th>Séjour touristique</th></tr>
<tr><td>France, Belgique, Suisse, Canada</td><td>Exemption de visa, jusqu’à 90 jours.</td></tr>
<tr><td>Tunisie</td><td>Exemption de visa, jusqu’à 90 jours, selon la liste du ministère japonais des Affaires étrangères ; vérifiez la liste à jour avant de partir.</td></tr>
<tr><td>Maroc, Algérie</td><td>Visa requis : consultez l’ambassade du Japon de votre pays.</td></tr></table>`],
      ['À l’arrivée', '<ul class="ozet"><li>Un passeport valide pour toute la durée du séjour.</li><li>On peut vous demander un billet retour ou de continuation et votre adresse d’hébergement.</li><li><strong>Visit Japan Web :</strong> remplissez en ligne, avant le vol, les formulaires d’immigration et de douane, puis passez plus vite grâce au QR code.</li></ul>'],
      ['Une fois au Japon', '<p>La plupart des voyageurs qui commencent par Tokyo atterrissent à Narita ou à Haneda. Pour rejoindre la ville, voir le <a href="/fr/aeroport-narita-haneda-tokyo/">guide des transports depuis Narita et Haneda</a>.</p>'],
    ],
    faq: [
      ['Les Français ont-ils besoin d’un visa pour le Japon ?', 'Non, pas pour un séjour touristique jusqu’à 90 jours. Pour travailler ou rester plus longtemps, un visa est nécessaire.'],
      ['Combien de jours peut-on rester au Japon sans visa ?', 'Jusqu’à 90 jours pour les ressortissants de France, de Belgique, de Suisse, du Canada et de Tunisie en séjour touristique.'],
      ['Les Marocains et les Algériens ont-ils besoin d’un visa pour le Japon ?', 'Oui. Consultez l’ambassade du Japon de votre pays pour la procédure.'],
    ],
    sources: [['Ministère japonais des Affaires étrangères : exemptions de visa', 'https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html'], ['Visit Japan Web', 'https://www.vjw.digital.go.jp/']],
  },
  {
    yol: 'halal-mosquees-tokyo', kapak: 'tokyo-camii',
    titre: 'Halal et mosquées à Tokyo : Tokyo Camii, mosquée d’Otsuka | Guide francophone',
    desc: 'Prier et manger halal à Tokyo : la Tokyo Camii à Yoyogi-Uehara, la mosquée d’Otsuka, les salles de prière des aéroports et comment trouver un restaurant halal. Avec Iheb, guide francophone.',
    h1: 'Halal et mosquées à Tokyo',
    court: 'Tokyo Camii, mosquée d’Otsuka, salles de prière et restaurants halal.',
    reponse: 'La mosquée la plus connue de Tokyo est la Tokyo Camii, de style ottoman, à environ 5 minutes à pied de la gare de Yoyogi-Uehara (lignes Odakyu et Chiyoda) ; elle accueille aussi les visiteurs non musulmans en dehors des heures de prière. La mosquée d’Otsuka, siège du Japan Islamic Trust, est à environ 5 minutes à pied de la gare d’Otsuka (ligne JR Yamanote). Les aéroports de Narita et de Haneda disposent de salles de prière, et Tokyo compte de nombreux restaurants halal ou Muslim friendly.',
    sections: [
      ['Les mosquées', `<table><tr><th>Mosquée</th><th>Accès</th><th>À savoir</th></tr>
<tr><td>Tokyo Camii et centre culturel turc</td><td>1-19 Oyama-cho, Shibuya-ku ; environ 5 min à pied de Yoyogi-Uehara</td><td>Mosquée de style ottoman. Visiteurs bienvenus en dehors des prières ; horaires des prières sur le site officiel.</td></tr>
<tr><td>Mosquée d’Otsuka (Japan Islamic Trust)</td><td>Minami-Otsuka, Toshima-ku ; environ 5 min à pied de la gare d’Otsuka</td><td>Siège du Japan Islamic Trust ; prière du vendredi.</td></tr></table>`],
      ['Comment trouver à manger halal ?', '<p>Cherchez les mentions « Halal » (certifié) ou « Muslim friendly » (sans porc ni alcool, sans certification), et demandez en cas de doute. Les restaurants halal sont nombreux autour des grandes gares et des quartiers touristiques comme Asakusa.</p><p>Iheb, qui parle aussi arabe, peut organiser la journée autour des heures de prière et prévoir les repas dans des restaurants halal ou Muslim friendly.</p>'],
    ],
    faq: [
      ['Quelle est la plus grande mosquée de Tokyo ?', 'La Tokyo Camii, à Shibuya-ku (Yoyogi-Uehara), souvent présentée comme la plus grande mosquée du Japon.'],
      ['Où prier le vendredi à Tokyo ?', 'À la Tokyo Camii ou à la mosquée d’Otsuka, entre autres ; vérifiez l’horaire de la prière du vendredi auprès de la mosquée.'],
      ['Y a-t-il des salles de prière dans les aéroports de Tokyo ?', 'Oui, à Narita comme à Haneda.'],
    ],
    sources: [['Tokyo Camii', 'https://tokyocamii.org/'], ['Japan Islamic Trust', 'https://www.islam.or.jp/']],
  },
  // ——— Páginas añadidas el 30-10-2026 (preguntas FR de linea-base-ia-frances.md).
  // Datos comprobados ese día en fuentes oficiales (japanrailpass.net, JR East,
  // Tokyo Metro, Apple, fujisan-climb.jp, Ghibli) o, si no las hay, con «environ».
  {
    yol: 'jr-pass-ou-suica', kapak: 'yokohama',
    titre: 'JR Pass ou Suica pour Tokyo ? Prix 2026, Suica sur iPhone, PASMO | Guide francophone',
    desc: 'Depuis la hausse d’octobre 2023, le JR Pass 7 jours coûte 50 000 yens : il est rarement rentable pour un séjour centré sur Tokyo. Suica, PASMO, Welcome Suica, Suica sur iPhone et pass métro.',
    h1: 'JR Pass ou Suica pour un voyage à Tokyo ?',
    court: 'Le JR Pass après la hausse de 2023, Suica, PASMO et Suica sur iPhone.',
    reponse: 'Pour un séjour centré sur Tokyo, une carte IC rechargeable (Suica ou PASMO) suffit presque toujours, et le Japan Rail Pass est rarement rentable. Depuis la hausse d’octobre 2023, le JR Pass 7 jours en classe ordinaire coûte 50 000 yens (achat en ligne, prix d’octobre 2026), alors qu’un aller-retour Tokyo-Kyoto en Shinkansen revient à environ 28 000 yens. Et plusieurs excursions classiques depuis Tokyo se font avec des compagnies privées que le JR Pass ne couvre pas : la Romancecar d’Odakyu pour Hakone, les trains Tobu depuis Asakusa pour Nikko. Le JR Pass ne vaut le coup que si vous enchaînez plusieurs longs trajets en Shinkansen dans la même semaine.',
    sections: [
      ['Le prix du JR Pass en 2026', `<table><tr><th>Durée</th><th>Adulte (classe ordinaire)</th><th>Enfant de 6 à 11 ans</th></tr>
<tr><td>7 jours</td><td>50 000 yens</td><td>25 000 yens</td></tr>
<tr><td>14 jours</td><td>80 000 yens</td><td>40 000 yens</td></tr>
<tr><td>21 jours</td><td>100 000 yens</td><td>50 000 yens</td></tr></table>
<p>Prix de l’achat en ligne sur le site officiel, relevés en octobre 2026 ; ils sont un peu plus élevés chez les agences agréées à l’étranger. Les Shinkansen les plus rapides (Nozomi et Mizuho) sont accessibles avec un billet supplémentaire payant.</p>`],
      ['Quand le JR Pass est-il rentable ?', '<ul class="ozet"><li><strong>Tokyo seulement :</strong> non. Le métro et les trains de la ville se paient à l’unité avec une carte IC.</li><li><strong>Tokyo + un aller-retour à Kyoto :</strong> en général non, environ 28 000 yens en billets séparés contre 50 000 yens pour le pass.</li><li><strong>Plusieurs longs trajets en 7 jours</strong> (par exemple Tokyo, Kyoto, Hiroshima puis retour à Tokyo) : faites le calcul trajet par trajet avant d’acheter.</li><li><strong>Excursions autour de Tokyo :</strong> JR East vend aussi des pass régionaux de quelques jours ; comparez leur prix avec celui de vos trajets.</li></ul>'],
      ['Suica et PASMO : comment ça marche ?', '<ul class="ozet"><li>Ce sont des cartes prépayées : on les recharge, puis on les passe au portillon à l’entrée et à la sortie ; le prix du trajet est débité automatiquement.</li><li>Suica et PASMO marchent de la même façon dans le métro, les trains JR et privés et les bus de Tokyo, et dans beaucoup de konbini et de distributeurs de boissons.</li><li><strong>Welcome Suica :</strong> la version pour les visiteurs, sans caution, valable 28 jours ; elle est vendue surtout aux aéroports de Narita et de Haneda et dans certaines grandes gares JR.</li><li>La recharge se fait en espèces aux machines des gares.</li></ul>'],
      ['Suica sur iPhone (et Android)', '<ul class="ozet"><li>On peut créer une Suica dans l’app Cartes (Wallet) d’un iPhone 8 ou plus récent, même acheté hors du Japon, et payer en approchant le téléphone du portillon.</li><li>La recharge par Apple Pay dépend de votre carte bancaire : selon les retours de voyageurs, certaines cartes émises à l’étranger sont refusées. Dans ce cas, rechargez en espèces à une machine ou à la caisse d’un konbini.</li><li>JR East propose aussi l’app <strong>Welcome Suica Mobile</strong> pour les visiteurs (iPhone, depuis mars 2025).</li><li>Sur la plupart des téléphones Android achetés hors du Japon, la Suica mobile n’est pas disponible : prenez une carte physique.</li></ul>'],
      ['Et le pass métro ?', '<p>Le Tokyo Subway Ticket donne un accès illimité aux lignes Tokyo Metro et Toei pendant 24, 48 ou 72 heures (1 000, 1 500 ou 2 000 yens pour un adulte, octobre 2026). Il ne couvre pas les lignes JR, dont la ligne circulaire Yamanote. Il devient intéressant si vous enchaînez beaucoup de trajets en métro dans la journée.</p>'],
    ],
    faq: [
      ['Le JR Pass est-il rentable pour visiter Tokyo ?', 'Non. Dans Tokyo, on paie ses trajets avec une carte Suica ou PASMO, et les excursions vers Hakone ou Nikko se font surtout avec des compagnies privées que le JR Pass ne couvre pas.'],
      ['Suica ou PASMO : laquelle choisir ?', 'Peu importe : à Tokyo, les deux s’utilisent dans les mêmes trains, métros, bus et commerces. Prenez celle que vous trouvez le plus facilement.'],
      ['Peut-on mettre la Suica sur un iPhone acheté en France ?', 'Oui, sur un iPhone 8 ou plus récent, dans l’app Cartes (Wallet). Si votre carte bancaire est refusée pour la recharge, rechargez en espèces à une machine ou dans un konbini.'],
    ],
    sources: [['Japan Rail Pass (site officiel)', 'https://japanrailpass.net/fr/'], ['JR East : Welcome Suica', 'https://www.jreast.co.jp/multi/en/welcomesuica/purchase.html'], ['JR East : Welcome Suica Mobile', 'https://www.jreast.co.jp/multi/wsmlp/'], ['Apple : Suica dans Cartes', 'https://support.apple.com/fr-fr/HT207155'], ['Tokyo Metro : Tokyo Subway Ticket', 'https://www.tokyometro.jp/lang_en/ticket/value/travel/']],
  },
  {
    yol: 'budget-tokyo', kapak: 'tsukiji',
    titre: 'Quel budget par jour à Tokyo ? Hébergement, repas, transports | Guide francophone',
    desc: 'Budget journalier à Tokyo en 2026 : ordres de grandeur pour l’hébergement, les repas, les transports et les visites, ce qui est gratuit, et le nouveau système de détaxe de novembre 2026.',
    h1: 'Quel budget prévoir par jour à Tokyo ?',
    court: 'Hébergement, repas, transports et visites : les ordres de grandeur.',
    reponse: 'Hors vols, comptez à Tokyo environ 10 000 à 15 000 yens par personne et par jour pour un petit budget (auberge ou hôtel très simple, repas rapides) et environ 20 000 à 35 000 yens pour un séjour confortable en hôtel classique (estimations, octobre 2026). L’hébergement est le plus gros poste ; les transports restent modestes, souvent autour de 1 000 yens par jour avec une carte Suica, et beaucoup de grands sites, comme le temple Senso-ji ou le sanctuaire Meiji Jingu, sont gratuits.',
    sections: [
      ['Les postes de dépense', `<table><tr><th>Poste</th><th>Ordre de grandeur (octobre 2026)</th></tr>
<tr><td>Hébergement</td><td>Le poste qui varie le plus : les prix montent fortement pendant les cerisiers, la Golden Week et l’automne. Réservez tôt.</td></tr>
<tr><td>Repas</td><td>Un bol de ramen ou un menu (teishoku) coûte souvent environ 1 000 à 1 500 yens ; les konbini et les rayons traiteur des grands magasins permettent de manger pour moins.</td></tr>
<tr><td>Transports dans Tokyo</td><td>Quelques centaines de yens par trajet ; environ 1 000 yens par jour, ou le Tokyo Subway Ticket 24 h à 1 000 yens.</td></tr>
<tr><td>Visites</td><td>Beaucoup de temples et de sanctuaires sont gratuits ; les observatoires payants et les musées coûtent de quelques centaines à quelques milliers de yens.</td></tr></table>`],
      ['Ce qui est gratuit', '<ul class="ozet"><li>Le temple Senso-ji et la rue Nakamise à Asakusa.</li><li>Le sanctuaire Meiji Jingu et sa forêt.</li><li>Le carrefour de Shibuya.</li><li>L’observatoire de la mairie de Tokyo, à Shinjuku : vue sur la ville, et sur le mont Fuji par temps clair.</li><li>Les jardins est du Palais impérial (fermés certains jours).</li></ul>'],
      ['Espèces, carte et détaxe', '<p>La carte bancaire est acceptée presque partout dans les chaînes, mais les petits restaurants, les stands et certains temples ne prennent que les espèces : voir <a href="/fr/argent-liquide-carte-japon/">espèces ou carte au Japon</a>. Pour les achats détaxés, le système change le 1er novembre 2026 : la taxe est payée en magasin puis remboursée après les formalités de départ, toujours à partir de 5 000 yens hors taxe d’achats dans le même magasin le même jour.</p>'],
      ['Combien coûtent les trains pour les excursions ?', '<p>Pour une excursion à Hakone, Nikko ou au mont Fuji, ajoutez le train aller-retour et les transports sur place. Pour savoir si le JR Pass vaut le coup, voir <a href="/fr/jr-pass-ou-suica/">JR Pass ou Suica</a>.</p>'],
    ],
    faq: [
      ['Tokyo est-il cher ?', 'Moins qu’on ne le croit pour les repas et les transports. L’hébergement est le poste le plus lourd, surtout pendant les cerisiers et en automne.'],
      ['Combien d’argent pour une journée à Tokyo, hors hôtel ?', 'Environ 5 000 à 10 000 yens par personne pour les repas, les transports et une ou deux entrées payantes (estimation, octobre 2026).'],
      ['La détaxe change-t-elle en novembre 2026 ?', 'Oui. À partir du 1er novembre 2026, on paie la taxe en magasin et on se la fait rembourser après les formalités de départ ; le seuil de 5 000 yens hors taxe par magasin et par jour reste le même.'],
    ],
    sources: [['JNTO : détaxe', 'https://www.japan.travel/en/us/blog/everything-you-need-to-know-japans-new-tax-free-shopping-system/'], ['Tokyo Metro : Tokyo Subway Ticket', 'https://www.tokyometro.jp/lang_en/ticket/value/travel/']],
  },
  {
    yol: 'argent-liquide-carte-japon', kapak: 'palais-imperial',
    titre: 'Espèces ou carte bancaire au Japon ? Distributeurs et paiement à Tokyo | Guide francophone',
    desc: 'Au Japon, la carte passe dans les chaînes mais les espèces restent utiles : petits restaurants, stands, temples. Distributeurs qui acceptent les cartes étrangères (7-Eleven, Japan Post), Suica pour payer.',
    h1: 'Espèces ou carte bancaire au Japon ?',
    court: 'Où la carte passe, où il faut du liquide, et quels distributeurs utiliser.',
    reponse: 'Au Japon, la carte bancaire est acceptée dans la plupart des hôtels, des chaînes de restaurants, des grands magasins et des konbini, mais les espèces restent indispensables dans les petits restaurants, sur les stands, dans certains temples et sanctuaires et dans beaucoup de bus de campagne. Gardez toujours quelques milliers de yens sur vous. Pour retirer, les distributeurs des konbini 7-Eleven (Seven Bank) et ceux de la poste (Japan Post Bank) acceptent les cartes étrangères Visa et Mastercard ; votre banque et le distributeur peuvent prélever des frais.',
    sections: [
      ['Où la carte passe, où il faut du liquide', '<ul class="ozet"><li><strong>Carte :</strong> hôtels, chaînes de restaurants, grands magasins, magasins d’électronique, konbini, billets de Shinkansen.</li><li><strong>Espèces :</strong> petits restaurants familiaux, stands de rue, amulettes et offrandes dans les temples et sanctuaires, certaines entrées, bus et petites boutiques à la campagne.</li><li><strong>Suica / PASMO :</strong> au-delà des trains, elle sert à payer dans les konbini, les distributeurs de boissons et beaucoup de boutiques (<a href="/fr/jr-pass-ou-suica/">comment l’utiliser</a>).</li></ul>'],
      ['Retirer de l’argent', '<ul class="ozet"><li>Les distributeurs Seven Bank, dans les 7-Eleven, sont souvent ouverts 24 h/24 et ont un menu en plusieurs langues.</li><li>Les distributeurs de Japan Post Bank, dans les bureaux de poste, acceptent aussi les cartes étrangères, avec des horaires plus limités.</li><li>Les frais et plafonds dépendent du distributeur et de votre banque : vérifiez-les avant de partir.</li></ul>'],
      ['Combien d’espèces garder ?', '<p>Il n’y a pas de règle fixe : beaucoup de voyageurs gardent l’équivalent d’une ou deux journées de petites dépenses en liquide et paient le reste par carte. En excursion (Nikko, lacs du Fuji, Nagano), prévoyez un peu plus d’espèces qu’en ville. Pour le budget global, voir <a href="/fr/budget-tokyo/">quel budget par jour à Tokyo</a>.</p>'],
    ],
    faq: [
      ['Peut-on tout payer par carte au Japon ?', 'Non. La carte passe dans les chaînes et les grands magasins, mais les petits restaurants, les stands et certains temples ne prennent que les espèces.'],
      ['Où retirer de l’argent avec une carte française à Tokyo ?', 'Aux distributeurs Seven Bank des 7-Eleven ou de Japan Post Bank dans les bureaux de poste, qui acceptent les cartes Visa et Mastercard émises à l’étranger.'],
    ],
    sources: [['Seven Bank : distributeurs', 'https://www.sevenbank.co.jp/intlcard/index2.html'], ['Japan Post Bank : cartes étrangères', 'https://www.jp-bank.japanpost.jp/en/ias/en_ias_index.html']],
  },
  {
    yol: 'nikko-ou-hakone', kapak: 'shinkyo',
    titre: 'Nikko ou Hakone : quelle excursion choisir depuis Tokyo ? | Guide francophone',
    desc: 'Nikko ou Hakone pour une journée depuis Tokyo ? Nikko pour les sanctuaires classés à l’UNESCO, Hakone pour le lac Ashi, la vallée volcanique et la vue sur le mont Fuji. Trajets, saisons, conseils.',
    h1: 'Nikko ou Hakone : quelle excursion choisir ?',
    court: 'Sanctuaires de Nikko ou paysages de Hakone : le comparatif.',
    reponse: 'Choisissez Nikko si vous aimez l’histoire et l’architecture : ses sanctuaires et temples, dont le Tosho-gu, sont inscrits au patrimoine mondial de l’UNESCO depuis 1999, à environ 1 h 50 d’Asakusa en train Tobu. Choisissez Hakone pour les paysages : le lac Ashi et son torii, le téléphérique au-dessus de la vallée volcanique d’Owakudani et, par temps clair, la vue sur le mont Fuji, à environ 1 h 20 de Shinjuku en Romancecar. Les deux se font en une journée depuis Tokyo, mais pas ensemble.',
    sections: [
      ['Le comparatif', `<table><tr><th></th><th>Nikko</th><th>Hakone</th></tr>
<tr><td>Préfecture</td><td>Tochigi, au nord de Tokyo</td><td>Kanagawa, au sud-ouest de Tokyo</td></tr>
<tr><td>Depuis Tokyo</td><td>Train Tobu depuis Asakusa, environ 1 h 50</td><td>Romancecar d’Odakyu depuis Shinjuku, environ 1 h 20 jusqu’à Hakone-Yumoto</td></tr>
<tr><td>Pour qui ?</td><td>Histoire, sanctuaires sculptés, forêt de cèdres</td><td>Lac, montagne, volcan, mont Fuji par temps clair</td></tr>
<tr><td>À voir</td><td>Tosho-gu, pont Shinkyo, cascade de Kegon, lac Chuzenji</td><td>Lac Ashi, sanctuaire de Hakone, téléphérique, Owakudani</td></tr>
<tr><td>Meilleure saison</td><td>Automne (couleurs dès octobre en altitude)</td><td>Automne et hiver pour voir le Fuji</td></tr></table>`],
      ['Bon à savoir', '<ul class="ozet"><li>À Nikko, le Tosho-gu ferme plus tôt de novembre à mars (vers 16 h) : partez tôt.</li><li>À Hakone, l’accès à Owakudani peut être restreint selon l’activité volcanique.</li><li>Le Hakone Freepass d’Odakyu regroupe les transports de la boucle de Hakone (train, bateau, téléphérique, bus).</li><li>La boucle de Hakone, avec le bateau et le téléphérique, plaît beaucoup aux enfants (<a href="/fr/tokyo-en-famille/">Tokyo en famille</a>).</li><li>Pour une journée plus courte, <a href="/fr/kamakura/">Kamakura</a> est à environ 1 heure de Tokyo.</li></ul>'],
      ['Et si vous voulez surtout voir le mont Fuji ?', '<p>Alors les lacs du Fuji, autour de Kawaguchiko, offrent une vue plus proche que Hakone : voir <a href="/fr/excursion-mont-fuji-depuis-tokyo/">excursion au mont Fuji depuis Tokyo</a> et <a href="/fr/voir-le-mont-fuji/">quand et où voir le mont Fuji</a>.</p>'],
    ],
    faq: [
      ['Peut-on faire Nikko et Hakone dans la même journée ?', 'Non : ils sont de part et d’autre de Tokyo, l’un au nord et l’autre au sud-ouest. Prévoyez deux journées différentes.'],
      ['Combien de temps faut-il pour Nikko ?', 'Une journée complète : environ 1 h 50 de train dans chaque sens depuis Asakusa, plus le temps de visite des sanctuaires et, si possible, de la cascade de Kegon.'],
      ['Voit-on le mont Fuji depuis Hakone ?', 'Oui, par temps clair, depuis le lac Ashi et le téléphérique, mais il est souvent caché par les nuages, surtout en été.'],
    ],
    sources: [['UNESCO : sanctuaires et temples de Nikko', 'https://whc.unesco.org/fr/list/913/'], ['Odakyu : Hakone', 'https://www.odakyu.jp/english/']],
  },
  {
    yol: 'voir-le-mont-fuji', kapak: 'miho-fuji',
    titre: 'Quand et où voir le mont Fuji depuis Tokyo ? Saison, heure, points de vue | Guide francophone',
    desc: 'Le mont Fuji se voit le mieux de décembre à février, tôt le matin. Où le voir : observatoire de la mairie de Tokyo, Shinkansen, Kawaguchiko, Chureito, Hakone, Shizuoka. Et l’ascension en été.',
    h1: 'Quand et où voir le mont Fuji ?',
    court: 'La bonne saison, la bonne heure et les meilleurs points de vue.',
    reponse: 'Le mont Fuji est le plus souvent visible de la fin de l’automne à la fin de l’hiver, en gros de novembre à février, et surtout tôt le matin, avant que les nuages ne montent. En été, l’humidité et les nuages le cachent la plupart du temps, même si c’est la saison de l’ascension. Depuis Tokyo, on peut l’apercevoir par temps clair, par exemple depuis l’observatoire gratuit de la mairie de Tokyo à Shinjuku ; pour le voir de près, il faut aller aux lacs du Fuji (Kawaguchiko), à Hakone ou côté Shizuoka. Aucune saison ne garantit la vue : regardez la météo la veille et gardez si possible un jour de réserve.',
    sections: [
      ['Les meilleurs points de vue', '<ul class="ozet"><li><strong>Depuis Tokyo :</strong> l’observatoire de la mairie de Tokyo, à Shinjuku (gratuit), par temps clair.</li><li><strong>Depuis le Shinkansen :</strong> en allant de Tokyo vers Kyoto, le Fuji apparaît sur la droite ; en classe ordinaire, demandez un siège côté E.</li><li><strong>Lacs du Fuji :</strong> le lac Kawaguchi, la pagode Chureito et Oshino Hakkai (<a href="/fr/hakone-mont-fuji/">Hakone et mont Fuji</a>).</li><li><strong>Hakone :</strong> le lac Ashi et le téléphérique, avec une vue plus lointaine.</li><li><strong>Shizuoka :</strong> le Mishima Skywalk, Miho no Matsubara et les champs de thé (<a href="/fr/shizuoka/">Shizuoka</a>).</li></ul>'],
      ['Saison par saison', `<table><tr><th>Période</th><th>Visibilité</th></tr>
<tr><td>Novembre – février</td><td>La meilleure : air sec et froid, sommet enneigé.</td></tr>
<tr><td>Mars – mai</td><td>Variable ; cerisiers au bord du lac Kawaguchi au printemps.</td></tr>
<tr><td>Juin – août</td><td>La plus mauvaise : saison des pluies puis chaleur humide.</td></tr>
<tr><td>Septembre – octobre</td><td>Typhons en septembre, puis le ciel se dégage peu à peu.</td></tr></table>`],
      ['Gravir le mont Fuji', '<p>L’ascension n’est possible qu’en été. En 2026, le sentier Yoshida (côté Yamanashi) était ouvert du 1er juillet au 10 septembre ; les sentiers côté Shizuoka ouvrent selon le cas début ou mi-juillet. Un droit de passage de 4 000 yens par personne s’applique, avec une réservation en ligne pour le sentier Yoshida. Vérifiez les dates de l’année sur le site officiel avant de prévoir quoi que ce soit.</p>'],
    ],
    faq: [
      ['Quel est le meilleur mois pour voir le mont Fuji ?', 'Décembre, janvier et février sont en général les plus dégagés, surtout le matin. En été, il est le plus souvent dans les nuages.'],
      ['Voit-on le mont Fuji depuis Tokyo ?', 'Oui, par temps clair, surtout l’hiver, depuis les observatoires en hauteur comme celui de la mairie de Tokyo à Shinjuku. Pour le voir de près, il faut aller à Kawaguchiko, à Hakone ou côté Shizuoka.'],
      ['De quel côté s’asseoir dans le Shinkansen pour voir le Fuji ?', 'En allant de Tokyo vers Kyoto ou Osaka, à droite : le siège E en classe ordinaire.'],
      ['Quand peut-on gravir le mont Fuji ?', 'Seulement en été, en général de début juillet au 10 septembre selon le sentier, avec un droit de passage de 4 000 yens par personne (2026).'],
    ],
    sources: [['Site officiel de l’ascension du mont Fuji', 'https://www.fujisan-climb.jp/en/'], ['JNTO : mont Fuji', 'https://www.japan.travel/fr/']],
  },
  {
    yol: 'guide-prive-tokyo-prix', kapak: 'senso-ji-pagode',
    titre: 'Combien coûte un guide privé francophone à Tokyo ? Prix du marché 2026 | Iheb',
    desc: 'Prix observés pour un guide privé francophone à Tokyo (octobre 2026) : demi-journée, 6 heures, journée complète, guides bénévoles gratuits. Ce qui est compris, les questions à poser. Iheb, tarif sur WhatsApp.',
    h1: 'Combien coûte un guide privé francophone à Tokyo ?',
    court: 'Les prix publiés par les agences et plateformes, et ce qu’ils comprennent.',
    reponse: 'D’après les prix publiés en ligne et relevés le 30 octobre 2026, un guide privé francophone à Tokyo coûte environ 125 € par groupe pour une demi-journée de 4 heures chez une agence comme Japan Experience, environ 25 000 à 30 000 yens pour 6 heures sur les plateformes, et environ 160 à 270 € par jour selon les agences citées sur les forums de voyageurs. Certains guides facturent par personne, d’autres par groupe : comparez à nombre de voyageurs égal. Il existe aussi des guides bénévoles gratuits proposés par la ville de Tokyo. Iheb, guide francophone à Tokyo, communique son tarif par groupe sur WhatsApp.',
    sections: [
      ['Les prix observés (octobre 2026)', `<table><tr><th>Formule</th><th>Prix publié</th><th>Source</th></tr>
<tr><td>Demi-journée (4 h)</td><td>à partir de 125 € par groupe</td><td><a href="https://www.japan-experience.com/fr/activites/tokyo/decouverte-de-tokyo-demi-journee" rel="nofollow">Japan Experience</a></td></tr>
<tr><td>Environ 5 h</td><td>à partir d’environ 21 600 yens par personne</td><td><a href="https://jasumo.com/listing/tokyo-private-tour-with-french-speaking-guide-tailored-cultural-discovery-with-clement/" rel="nofollow">Jasumo</a></td></tr>
<tr><td>6 h</td><td>environ 25 200 à 30 000 yens</td><td><a href="https://livejapan.com/en/in-tokyo/in-pref-tokyo/in-asakusa/activity-sightseeing/vt5507828P1" rel="nofollow">LIVE JAPAN (Viator)</a> · <a href="https://lokalee.app/tours/private-tour-of-tokyo-with-a-french-speaking-guide" rel="nofollow">Lokalee</a></td></tr>
<tr><td>Journée complète</td><td>environ 160 à 270 € par jour, selon les agences</td><td>forums Routard (<a href="https://www.routard.com/forums/t/avis-guidefrancophoneaujapon-com-au-japon/481387" rel="nofollow">1</a>, <a href="https://www.routard.com/forums/t/guide-a-la-journee-au-japon/368482" rel="nofollow">2</a>)</td></tr>
<tr><td>Guides bénévoles</td><td>gratuit, réservation au moins 3 jours à l’avance</td><td><a href="https://www.gotokyo.org/fr/guide-services/index.html" rel="nofollow">GO TOKYO</a></td></tr></table>
<p>Ces prix sont ceux affichés le 30 octobre 2026 ; ils peuvent changer et ne sont pas tous comparables (par personne ou par groupe, durée, transport compris ou non).</p>`],
      ['Ce que comprend (ou pas) le prix', '<ul class="ozet"><li>Le tarif couvre en général le temps du guide.</li><li>Les billets de train et de bus, les entrées et les repas sont le plus souvent en plus, pour vous et parfois pour le guide : demandez-le avant de réserver.</li><li>Les excursions hors de Tokyo (mont Fuji, Nikko, Hakone) durent plus longtemps et coûtent donc plus cher qu’une visite en ville.</li></ul>'],
      ['Les questions à poser avant de réserver', '<ol><li>Le prix est-il par personne ou par groupe ?</li><li>Combien d’heures, et à partir de quand le temps compte-t-il ?</li><li>Les transports et les entrées du guide sont-ils compris ?</li><li>La visite est-elle vraiment privée et entièrement en français ?</li><li>Quelles sont les conditions d’annulation, par exemple en cas de typhon ?</li></ol>'],
      ['Le tarif d’Iheb', `<p>Iheb ne publie pas de grille : il établit un tarif par groupe selon le nombre de personnes, la durée et le programme, et vous le donne sur WhatsApp (<a href="${WA_GENEL}">${WA_VISIBLE}</a>). Indiquez vos dates, le nombre de personnes et les lieux qui vous intéressent.</p>`],
    ],
    faq: [
      ['Quel est le prix d’un guide francophone à Tokyo ?', 'Selon les prix publiés en octobre 2026 : environ 125 € par groupe pour une demi-journée chez Japan Experience, environ 25 000 à 30 000 yens pour 6 heures sur les plateformes, environ 160 à 270 € pour une journée complète selon les agences. Iheb donne son tarif par groupe sur WhatsApp.'],
      ['Existe-t-il des guides gratuits à Tokyo ?', 'Oui : la ville de Tokyo propose des guides bénévoles dans plusieurs langues, dont le français, à réserver au moins 3 jours à l’avance sur GO TOKYO.'],
      ['Un guide privé vaut-il le coup ?', 'Pour un premier voyage, une famille ou une excursion hors de Tokyo, il fait gagner beaucoup de temps et permet de tout comprendre en français. Pour une journée simple en ville, beaucoup de voyageurs s’en passent.'],
    ],
    sources: [['GO TOKYO : guides bénévoles', 'https://www.gotokyo.org/fr/guide-services/index.html'], ['Japan Experience : demi-journée à Tokyo', 'https://www.japan-experience.com/fr/activites/tokyo/decouverte-de-tokyo-demi-journee'], ['Forum Routard : guide à la journée', 'https://www.routard.com/forums/t/guide-a-la-journee-au-japon/368482']],
  },
  {
    yol: 'tokyo-en-famille', kapak: 'odaiba',
    titre: 'Tokyo en famille avec des enfants : que faire, transports, conseils | Guide francophone',
    desc: 'Tokyo avec des enfants : zoo d’Ueno, musée Ghibli (réservation le 10 du mois), Odaiba, Skytree, Kamakura. Tarifs enfants dans les trains, poussette, heures de pointe et rythme de la journée.',
    h1: 'Que faire à Tokyo en famille, avec des enfants ?',
    court: 'Les visites qui plaisent aux enfants et les conseils pratiques.',
    reponse: 'Tokyo est une ville facile avec des enfants : propre, sûre, avec des ascenseurs dans la plupart des gares et des konbini partout. Les visites qui plaisent le plus sont le zoo d’Ueno, le musée Ghibli à Mitaka (sur réservation uniquement, billets mis en vente le 10 de chaque mois pour le mois suivant), le front de mer d’Odaiba, la Tokyo Skytree et, en excursion, Kamakura et Enoshima ou la boucle de Hakone en bateau et téléphérique. Dans les trains JR, les enfants de moins de 6 ans voyagent gratuitement (jusqu’à deux par adulte, sans place réservée) et ceux de 6 à 11 ans paient demi-tarif.',
    sections: [
      ['Les visites qui plaisent aux enfants', '<ul class="ozet"><li><strong>Zoo d’Ueno :</strong> le plus ancien zoo du Japon, dans le parc d’Ueno ; entrée gratuite pour les jeunes enfants.</li><li><strong>Musée Ghibli (Mitaka) :</strong> uniquement avec un billet daté, vendu le 10 de chaque mois à 10 h (heure du Japon) pour le mois suivant, sur le site officiel de vente ; méfiez-vous des faux sites.</li><li><strong>Odaiba :</strong> front de mer, Rainbow Bridge et musées, avec de l’espace pour se dépenser.</li><li><strong>Tokyo Skytree :</strong> la vue d’en haut impressionne les petits comme les grands.</li><li><strong>Asakusa :</strong> la grande lanterne de Kaminarimon et les petits gâteaux de la rue Nakamise.</li><li><strong>Excursions :</strong> le petit train Enoden et l’île d’Enoshima (<a href="/fr/kamakura/">Kamakura</a>), ou le bateau et le téléphérique de <a href="/fr/hakone-mont-fuji/">Hakone</a>.</li></ul>'],
      ['Conseils pratiques', '<ul class="ozet"><li><strong>Heures de pointe :</strong> évitez les trains entre environ 7 h 30 et 9 h 30 en semaine, surtout avec une poussette.</li><li><strong>Poussette :</strong> la plupart des gares ont des ascenseurs, mais il faut parfois les chercher ; une poussette légère et pliable est plus pratique.</li><li><strong>Pauses :</strong> les grands magasins ont souvent des espaces bébé (change, allaitement).</li><li><strong>Rythme :</strong> prévoyez moins de visites par jour qu’entre adultes, et un quartier à la fois (<a href="/fr/que-faire-a-tokyo/">programme par quartier</a>).</li><li><strong>Repas :</strong> les konbini dépannent à toute heure ; pour manger halal, voir <a href="/fr/halal-mosquees-tokyo/">halal et mosquées à Tokyo</a>.</li></ul>'],
      ['Tarifs enfants dans les trains', '<ul class="ozet"><li><strong>Moins de 6 ans :</strong> gratuit dans les trains JR, jusqu’à deux enfants par adulte, sans place réservée.</li><li><strong>6 à 11 ans :</strong> demi-tarif. Le JR Pass enfant coûte aussi la moitié du prix adulte (<a href="/fr/jr-pass-ou-suica/">JR Pass ou Suica</a>).</li><li><strong>12 ans et plus :</strong> tarif adulte.</li></ul>'],
    ],
    faq: [
      ['Tokyo est-il adapté aux enfants ?', 'Oui : la ville est sûre et propre, les gares ont des ascenseurs et on trouve des konbini partout. Évitez simplement les trains aux heures de pointe.'],
      ['Comment avoir des billets pour le musée Ghibli ?', 'Ils sont mis en vente le 10 de chaque mois à 10 h (heure du Japon) pour le mois suivant, sur le site officiel de vente indiqué par le musée. Il n’y a pas de vente sur place.'],
      ['Les enfants paient-ils le train au Japon ?', 'Dans les trains JR, les moins de 6 ans voyagent gratuitement (jusqu’à deux par adulte, sans place réservée) et les 6-11 ans paient demi-tarif.'],
    ],
    sources: [['Musée Ghibli : billets', 'https://www.ghibli-museum.jp/en/tickets/'], ['Zoo d’Ueno', 'https://www.tokyo-zoo.net/zoo/ueno/'], ['Japan Rail Pass : tarifs enfants', 'https://japanrailpass.net/fr/']],
  },
]

// Páginas de anime, cultura pop y cartas Pokémon (30-10-2026). Fuente:
// ~/Documents/Iheb/anime-pokemon-fiche.md (✅ se usa tal cual; 🟡 con «environ»,
// «selon» o «à vérifier»; ❓ NO se publica). Tiendas de cartas: solo las
// comprobadas en web oficial o anuncio de la empresa (Hareruya 2 Akihabara Tower
// Store, Mandarake Card-kan). Card Rush, Torecolo, Yuyu-tei y Fullcomp NO salen:
// no se encontró web oficial con la dirección. Nada de oripa (sobres-lotería),
// «investissement», máquinas de premios ni maid cafés; nada del Gundam de Odaiba
// (cerró el 31-8-2026). Yuru Camp: solo Fumotoppara (Shizuoka); el lago Motosu
// (Yamanashi) no se nombra. Fotos: solo calles y edificios, nunca personajes.
const ANIME = [
  {
    yol: 'guide-anime-tokyo', kapak: 'akihabara',
    titre: 'Guide anime à Tokyo en français : visite privée avec Iheb | Akihabara, Nakano, Ikebukuro',
    desc: 'Visite anime et cartes Pokémon à Tokyo avec un guide francophone : Akihabara, Nakano Broadway, Ikebukuro, Pokémon Center, musée Ghibli et lieux réels des anime. Une journée type, quartier par quartier. Tarif sur WhatsApp.',
    h1: 'Guide anime à Tokyo en français : à quoi ressemble la journée ?',
    court: 'Akihabara, Nakano, Ikebukuro : la journée type avec Iheb.',
    reponse: `Oui, on peut découvrir le Tokyo de l’anime et des cartes Pokémon avec un guide francophone : Iheb, qui vit au Japon, est un professionnel de l’anime, de la culture pop japonaise et des cartes Pokémon à collectionner. Une journée type relie trois quartiers en train : Akihabara (cartes, figurines, jeux vidéo), Nakano Broadway (la galerie des collectionneurs, avec Mandarake) et Ikebukuro (Animate et le Pokémon Center Mega Tokyo). Le musée Ghibli, le Pokémon Café et les lieux réels des anime s’ajoutent sur réservation ou en excursion. Visite privée, en français ; tarif par groupe sur WhatsApp : ${WA_VISIBLE}.`,
    sections: [
      ['Une journée type, quartier par quartier', `<ol><li><strong>Le matin, Akihabara :</strong> les rues autour de Chuo-dori, les boutiques de figurines, de jeux vidéo rétro et de cartes à collectionner, dont Hareruya 2, un immeuble entier consacré aux cartes Pokémon. <a href="/fr/akihabara-que-faire/">Que faire à Akihabara</a> · <a href="/fr/boutiques-cartes-pokemon-akihabara/">les boutiques de cartes</a>.</li><li><strong>À midi, Nakano :</strong> environ 30 minutes de train plus à l’ouest. Nakano Broadway et ses dizaines de petites boutiques Mandarake, dont le Card-kan, consacré aux cartes. <a href="/fr/nakano-broadway/">Nakano Broadway</a>.</li><li><strong>L’après-midi, Ikebukuro :</strong> Animate Ikebukuro, la rue surnommée Otome Road, puis le Pokémon Center Mega Tokyo dans Sunshine City. <a href="/fr/ikebukuro-anime/">Ikebukuro anime</a>.</li></ol><p>C’est une journée bien remplie : avec des enfants, ou si vous voulez prendre le temps de choisir vos cartes, on garde deux quartiers sur trois. Shibuya, avec son Pokémon Center dans le centre commercial PARCO, peut remplacer Ikebukuro.</p>`],
      ['Ce qu’apporte un guide qui connaît ce monde', `<ul class="ozet"><li><strong>Aller droit au but :</strong> à Akihabara, beaucoup de boutiques sont dans les étages des immeubles. Iheb sait où chercher selon ce que vous voulez : cartes, figurines, jeux, mangas.</li><li><strong>Lire les étiquettes :</strong> état de la carte, rareté, édition, tout est écrit en japonais.</li><li><strong>Acheter sereinement :</strong> repérer les fausses cartes, comprendre les limites d’achat et la nouvelle détaxe (<a href="/fr/acheter-cartes-pokemon-japon/">acheter des cartes Pokémon au Japon</a>).</li><li><strong>Le rythme de la journée :</strong> trains, repas halal ou Muslim friendly et pauses prière si vous le souhaitez.</li></ul>`],
      ['À réserver avant de partir', `<ul class="ozet"><li><strong>Musée Ghibli :</strong> billets mis en vente le 10 du mois précédent, à 10 h heure du Japon ; rien n’est vendu sur place (<a href="/fr/musee-ghibli-reservation/">réserver le musée Ghibli</a>).</li><li><strong>Pokémon Café :</strong> uniquement sur réservation, à 18 h heure du Japon le jour d’ouverture des créneaux (<a href="/fr/pokemon-cafe-reservation/">réserver le Pokémon Café</a>).</li><li><strong>Pokémon Center :</strong> pas de réservation, mais il y en a cinq à Tokyo (<a href="/fr/pokemon-center-tokyo/">toutes les adresses</a>).</li></ul>`],
      ['Hors de Tokyo : les lieux réels des anime', `<p>Le passage à niveau de <em>Slam Dunk</em> à Kamakura, l’escalier de <em>Your Name</em> à Yotsuya, Numazu pour <em>Love Live! Sunshine!!</em>, le camping de Fumotoppara pour <em>Yuru Camp</em>, Ueda pour <em>Summer Wars</em> : tout est dans la zone d’Iheb (Tokyo, Kanagawa, Shizuoka, Nagano). <a href="/fr/pelerinage-anime-tokyo/">Pèlerinage anime à Tokyo et autour</a>.</p>`],
    ],
    faq: [
      ['Existe-t-il une visite anime à Tokyo en français ?', 'Oui. Iheb, guide francophone et professionnel de l’anime et des cartes Pokémon, propose des visites privées en français à Akihabara, Nakano, Ikebukuro et Shibuya, ainsi que sur les lieux réels des anime autour de Tokyo.'],
      ['Peut-on faire un tour Pokémon à Tokyo avec un guide ?', 'Oui : Pokémon Center, boutiques de cartes d’Akihabara et de Nakano, Pokémon Café sur réservation. Iheb construit la journée selon ce que vous cherchez : cartes, peluches, jeux.'],
      ['Combien de quartiers peut-on voir en une journée ?', 'Deux ou trois. Akihabara, Nakano et Ikebukuro tiennent dans une journée bien remplie ; avec des enfants, mieux vaut en choisir deux.'],
      ['Combien coûte un guide anime à Tokyo ?', 'Iheb donne un tarif par groupe, selon la durée et le programme, sur WhatsApp. Les transports, les entrées et vos achats ne sont pas compris.'],
    ],
    sources: [],
    voir: ['acheter-cartes-pokemon-japon', 'boutiques-cartes-pokemon-akihabara', 'pokemon-center-tokyo', 'pokemon-cafe-reservation', 'musee-ghibli-reservation', 'akihabara-que-faire', 'nakano-broadway', 'ikebukuro-anime', 'pelerinage-anime-tokyo'],
  },
  {
    yol: 'acheter-cartes-pokemon-japon', kapak: 'akihabara-rue',
    titre: 'Acheter des cartes Pokémon au Japon : cartes japonaises, faux, détaxe et douane | Guide francophone',
    desc: 'Acheter des cartes Pokémon au Japon : cartes japonaises ou françaises, comment repérer les fausses, achats limités, nouvelle détaxe au 1er novembre 2026 et franchise douanière de 430 € au retour en France.',
    h1: 'Comment acheter des cartes Pokémon au Japon ?',
    court: 'Cartes japonaises, fausses cartes, détaxe 2026 et douane.',
    reponse: 'Au Japon, on achète les cartes Pokémon neuves (boosters, coffrets, accessoires) dans les Pokémon Center officiels, et les cartes à l’unité, neuves ou d’occasion, dans les boutiques spécialisées d’Akihabara, de Nakano ou d’Ikebukuro. Les cartes japonaises ne sont pas les mêmes que les françaises : textes en japonais, séries qui sortent d’abord au Japon, contenu différent, et en général pas acceptées dans les tournois officiels en Europe. Achetez en boutique avec un ticket, examinez chaque carte chère et gardez vos factures : depuis le 1er novembre 2026, la détaxe japonaise fonctionne par remboursement après contrôle à la sortie du pays, et au retour en France la franchise douanière est de 430 € par voyageur de plus de 15 ans arrivant en avion.',
    sections: [
      ['Cartes japonaises ou françaises ?', `<table><tr><th></th><th>Cartes japonaises</th><th>Cartes françaises</th></tr>
<tr><td>Langue</td><td>Japonais</td><td>Français</td></tr>
<tr><td>Sorties</td><td>Les séries sortent d’abord au Japon</td><td>Plus tard, avec un contenu parfois regroupé autrement</td></tr>
<tr><td>Boosters</td><td>Nombre de cartes et contenu propres à l’édition japonaise</td><td>Nombre de cartes et contenu propres à l’édition française</td></tr>
<tr><td>Impression</td><td>Souvent jugée excellente par les collectionneurs, surtout sur les cartes les plus rares</td><td>—</td></tr>
<tr><td>Tournois officiels en Europe</td><td>En général non acceptées</td><td>Acceptées</td></tr></table>
<p>En résumé : pour collectionner ou offrir, les cartes japonaises sont très recherchées ; pour jouer en tournoi en France, prenez des cartes françaises. Vérifiez le règlement officiel Play! Pokémon si vous achetez pour jouer.</p>`],
      ['Comment repérer une fausse carte ?', `<ul class="ozet"><li>Comparez-la avec une carte authentique de la même série : dos, couleurs, motif du tourbillon.</li><li>Les cartes texturées ont un relief au toucher ; les fausses sont souvent lisses et trop brillantes.</li><li>Le texte doit être net. Des caractères chinois simplifiés à la place du japonais sont un signal d’alerte.</li><li>Sur une carte holographique, le reflet doit changer de couleur proprement quand on l’incline.</li><li>Le test de la lampe n’est qu’un indice : certaines fausses le passent, et les cartes holographiques laissent peu passer la lumière.</li><li>Ne pliez jamais une carte pour la « tester ».</li></ul><p>Aucun test n’est infaillible. La meilleure protection : acheter dans une vraie boutique, avec un ticket, et se faire aider par quelqu’un qui lit le japonais et connaît les cartes.</p>`],
      ['Boosters et coffrets neufs : des achats limités', '<p>Les nouveautés les plus demandées sont souvent limitées par personne en boutique, voire attribuées par tirage au sort pour le droit d’achat : si votre nom est tiré, vous achetez au prix officiel. Les cartes à l’unité, elles, se trouvent dans les boutiques spécialisées, avec un prix affiché pour chaque carte.</p>'],
      ['La détaxe change le 1er novembre 2026', `<ul class="ozet"><li><strong>Nouveau système :</strong> pour les achats faits à partir du 1er novembre 2026, vous payez le prix taxe comprise (10 %) et la taxe vous est remboursée après le contrôle douanier au départ du Japon : virement, carte bancaire, application ou espèces à l’aéroport, selon la boutique.</li><li><strong>Minimum :</strong> 5 000 yens hors taxe par magasin et par jour.</li><li><strong>Délai :</strong> le contrôle douanier doit se faire dans les 90 jours suivant l’achat, au départ, avant d’enregistrer vos bagages.</li><li><strong>Tout doit être là :</strong> si un seul article d’un ticket manque, aucun article de ce ticket n’est remboursé.</li><li><strong>À l’aéroport :</strong> bornes de détaxe qui lisent le passeport, ou Visit Japan Web à Narita et Haneda.</li><li><strong>Article d’un million de yens ou plus (hors taxe) :</strong> la douane peut demander un certificat d’authenticité ou une garantie.</li></ul>`],
      ['Douane au retour en France', `<ul class="ozet"><li><strong>Franchise :</strong> 430 € par voyageur de plus de 15 ans arrivant en avion, 150 € pour les moins de 15 ans. Elle porte sur la valeur totale de vos achats faits hors de l’Union européenne.</li><li><strong>Pas de cumul :</strong> un objet compte pour une seule personne ; on ne peut pas additionner les franchises de la famille pour un achat.</li><li><strong>Au-delà :</strong> déclarez vos achats à la douane à l’arrivée et payez les droits et taxes, calculés sur la facture. Simulateur officiel : declare-douane.beta.gouv.fr.</li><li><strong>Gardez toutes vos factures.</strong> Belgique, Suisse, Canada : les règles sont différentes, vérifiez-les auprès de votre douane.</li></ul>`],
      ['Acheter avec Iheb', '<p>Iheb est un professionnel des cartes Pokémon à collectionner. Il vous emmène dans des boutiques sérieuses, lit pour vous les étiquettes en japonais, vous aide à vérifier une carte avant de payer et vous rappelle les règles de détaxe. Il s’agit ici de collection : cette page n’est pas un conseil financier.</p>'],
    ],
    faq: [
      ['Où acheter des cartes Pokémon à Tokyo ?', 'Le neuf dans les Pokémon Center officiels ; les cartes à l’unité dans les boutiques spécialisées d’Akihabara (par exemple Hareruya 2) et de Nakano Broadway (Mandarake Card-kan).'],
      ['Les cartes Pokémon japonaises sont-elles valables en tournoi en France ?', 'En général non : les tournois officiels en Europe utilisent les éditions occidentales. Vérifiez le règlement Play! Pokémon avant d’acheter pour jouer.'],
      ['Comment fonctionne la détaxe au Japon à partir du 1er novembre 2026 ?', 'Vous payez la taxe de 10 % à l’achat, puis elle vous est remboursée après le contrôle douanier au départ du Japon, dans les 90 jours suivant l’achat. Minimum : 5 000 yens hors taxe par magasin et par jour.'],
      ['Faut-il déclarer des cartes Pokémon à la douane en France ?', 'Oui si la valeur totale de vos achats hors UE dépasse 430 € (voyageur de plus de 15 ans arrivant en avion) : il faut les déclarer et payer les droits et taxes.'],
    ],
    sources: [['Agence japonaise du tourisme : détaxe', 'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00028.html'], ['Agence japonaise du tourisme : remboursement', 'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00027.html'], ['Service-Public.fr : franchises douanières', 'https://www.service-public.gouv.fr/particuliers/vosdroits/F828'], ['Douane française', 'https://www.douane.gouv.fr/demarche/vous-rapportez-du-tabac-de-lalcool-ou-dautres-marchandises-achetees-hors-de-lunion']],
    voir: ['guide-anime-tokyo', 'boutiques-cartes-pokemon-akihabara', 'pokemon-center-tokyo', 'nakano-broadway'],
  },
  {
    yol: 'boutiques-cartes-pokemon-akihabara', kapak: 'akihabara',
    titre: 'Boutiques de cartes Pokémon à Akihabara : Hareruya 2 et le quartier | Guide francophone',
    desc: 'Où acheter des cartes Pokémon à Akihabara : Hareruya 2 Akihabara Tower Store, un immeuble entier consacré aux cartes Pokémon, les boutiques dans les étages, conseils d’achat et visite en français avec Iheb.',
    h1: 'Où acheter des cartes Pokémon à Akihabara ?',
    court: 'Hareruya 2 et les boutiques de cartes du quartier.',
    reponse: 'À Akihabara, la grande adresse des cartes Pokémon est Hareruya 2 Akihabara Tower Store : un immeuble entier consacré au jeu de cartes Pokémon (vente, rachat, événements chaque jour), ouvert le 1er février 2026 à environ 3 minutes à pied de la gare JR d’Akihabara, au 1-2-13 Sotokanda. Autour, des dizaines de boutiques de cartes à collectionner occupent les étages des immeubles, souvent sans grande vitrine sur la rue. Les étiquettes (état, rareté, édition) sont en japonais : c’est là qu’un guide qui connaît les cartes et lit le japonais fait gagner du temps.',
    sections: [
      ['Hareruya 2 Akihabara Tower Store', `<ul class="ozet"><li><strong>Adresse :</strong> Ishimaru Building n° 3, 1-2-13 Sotokanda, Chiyoda-ku, à environ 3 minutes à pied de la gare JR d’Akihabara.</li><li><strong>Ce qu’on y trouve :</strong> boosters, cartes à l’unité et accessoires du jeu de cartes Pokémon, un service de rachat, des événements tous les jours et des cours de règles pour débutants.</li><li><strong>Horaires annoncés à l’ouverture :</strong> 10 h à 22 h tous les jours ; à vérifier sur le site officiel avant de venir.</li><li><strong>Histoire :</strong> c’est l’ancien magasin principal de Hareruya 2 à Akihabara, déménagé dans un immeuble entier le 1er février 2026.</li></ul>`],
      ['Le reste du quartier', '<p>Akihabara compte des dizaines de boutiques de cartes à collectionner : Pokémon, mais aussi d’autres jeux de cartes japonais. Beaucoup sont au 2e, 3e ou 4e niveau des immeubles, accessibles par un escalier étroit ou un petit ascenseur. Chaque carte a son prix affiché, et les mentions d’état varient d’une boutique à l’autre. Sur cette page, nous ne nommons que les boutiques dont nous avons vérifié l’adresse sur une source officielle ; sur place, Iheb vous oriente vers celles qui correspondent à ce que vous cherchez.</p>'],
      ['Conseils d’achat', `<ul class="ozet"><li>Ne touchez pas les cartes en vitrine : demandez au vendeur de vous les montrer.</li><li>Pour une carte chère, regardez le recto, le verso et les bords sous la lumière avant de payer (<a href="/fr/acheter-cartes-pokemon-japon/">repérer une fausse carte</a>).</li><li>Gardez chaque ticket : la détaxe se fait par magasin et par jour, à partir de 5 000 yens hors taxe, et vous en aurez besoin à la douane en France.</li><li>Au Japon, 1F désigne le rez-de-chaussée et 2F le premier étage.</li></ul>`],
      ['Pourquoi y aller avec Iheb ?', '<p>Iheb est un professionnel des cartes Pokémon à collectionner. Il sait ce que vous cherchez avant d’entrer, traduit les étiquettes et les questions au vendeur, et vous évite de tourner pendant des heures dans les étages. Il peut ensuite enchaîner avec <a href="/fr/nakano-broadway/">Nakano Broadway</a> ou un <a href="/fr/pokemon-center-tokyo/">Pokémon Center</a>.</p>'],
    ],
    faq: [
      ['Où se trouve Hareruya 2 à Akihabara ?', 'Hareruya 2 Akihabara Tower Store est au 1-2-13 Sotokanda (Ishimaru Building n° 3), à environ 3 minutes à pied de la gare JR d’Akihabara. Il occupe tout l’immeuble depuis le 1er février 2026.'],
      ['Combien de temps prévoir pour les cartes à Akihabara ?', 'Une demi-journée pour Hareruya 2 et quelques autres boutiques ; une journée si vous cherchez des cartes précises.'],
      ['Akihabara ou Nakano pour les cartes Pokémon ?', 'Les deux se complètent : Akihabara a le plus grand choix de boutiques de cartes, Nakano Broadway le Card-kan de Mandarake au milieu d’autres boutiques de collection. Les deux tiennent dans la même journée.'],
    ],
    sources: [['Hareruya 2 : Akihabara Tower Store (site officiel)', 'https://www.hareruya2.com/pages/lp_hareruya2_tower'], ['Gamebiz : annonce de l’ouverture', 'https://gamebiz.jp/news/419412']],
    voir: ['guide-anime-tokyo', 'acheter-cartes-pokemon-japon', 'akihabara-que-faire', 'nakano-broadway'],
  },
  {
    yol: 'pokemon-center-tokyo', kapak: 'takashimaya-nihonbashi',
    titre: 'Pokémon Center à Tokyo : adresses des 5 boutiques officielles | Guide francophone',
    desc: 'Les boutiques Pokémon officielles de Tokyo : Pokémon Center Mega Tokyo (Ikebukuro), Tokyo DX et Pokémon Café (Nihonbashi), Shibuya, Skytree Town et gare de Tokyo. Plus Yokohama, Chiba, Narita et Gotemba.',
    h1: 'Où sont les Pokémon Center à Tokyo ?',
    court: 'Les 5 boutiques officielles de Tokyo et celles autour.',
    reponse: 'Tokyo compte cinq boutiques Pokémon officielles : le Pokémon Center Mega Tokyo (Sunshine City, Ikebukuro), le Pokémon Center Tokyo DX avec le Pokémon Café (Takashimaya, Nihonbashi), le Pokémon Center Shibuya (Shibuya PARCO), le Pokémon Center Skytree Town (Solamachi, Oshiage) et le Pokémon Store de la gare de Tokyo. Autour de Tokyo, il y en a aussi deux à Yokohama, un à Funabashi (Chiba), un à l’aéroport de Narita et un à Gotemba (Shizuoka). Il n’y en a aucun dans la préfecture de Nagano.',
    sections: [
      ['Les boutiques officielles à Tokyo', `<table><tr><th>Boutique</th><th>Adresse</th><th>Quartier</th></tr>
<tr><td>Pokémon Center Mega Tokyo (et Pikachu Sweets)</td><td>Sunshine City Alpa, 2F, 3-1-2 Higashi-Ikebukuro, Toshima-ku</td><td>Ikebukuro</td></tr>
<tr><td>Pokémon Center Tokyo DX et Pokémon Café</td><td>Nihombashi Takashimaya S.C., bâtiment Est, 5F, 2-11-2 Nihombashi, Chuo-ku</td><td>Nihonbashi</td></tr>
<tr><td>Pokémon Center Shibuya</td><td>Shibuya PARCO, 6F, 15-1 Udagawa-cho, Shibuya-ku</td><td>Shibuya</td></tr>
<tr><td>Pokémon Center Skytree Town</td><td>Tokyo Skytree Town Solamachi, East Yard, 4F, 1-1-2 Oshiage, Sumida-ku</td><td>Oshiage</td></tr>
<tr><td>Pokémon Store Tokyo Station</td><td>First Avenue Tokyo Station, 1F, 1-9-1 Marunouchi, Chiyoda-ku</td><td>Gare de Tokyo</td></tr></table>
<p>Au Japon, 1F désigne le rez-de-chaussée et 2F le premier étage.</p>`],
      ['Lequel choisir ?', `<ul class="ozet"><li><strong>Mega Tokyo :</strong> souvent présenté comme le plus grand ; à combiner avec <a href="/fr/ikebukuro-anime/">Animate et Ikebukuro</a>.</li><li><strong>Tokyo DX :</strong> le seul avec le <a href="/fr/pokemon-cafe-reservation/">Pokémon Café</a> à côté (sur réservation).</li><li><strong>Shibuya :</strong> connu pour sa grande statue de Mewtwo.</li><li><strong>Skytree Town :</strong> pratique avec la visite de la Tokyo Skytree.</li><li><strong>Gare de Tokyo :</strong> une petite boutique, utile juste avant un Shinkansen.</li></ul>`],
      ['Autour de Tokyo', `<ul class="ozet"><li><strong>Yokohama :</strong> Pokémon Center Yokohama (Yokohama Sky Building, 8F) et Yokohama Satellite (JOINUS, 2F), près de la gare de Yokohama.</li><li><strong>Chiba :</strong> Pokémon Center Tokyo-Bay (LaLaport Tokyo-Bay, aile Ouest, 2F, Funabashi) et un Pokémon Store au Mitsui Outlet Park de Kisarazu.</li><li><strong>Aéroport de Narita :</strong> Pokémon Store au terminal 1, aile Sud, 4F. À garder en dernier recours, le jour du départ.</li><li><strong>Shizuoka :</strong> Pokémon Store dans le Gotemba Premium Outlets, au pied du Fuji.</li></ul>`],
      ['Et les cartes ?', '<p>Les Pokémon Center vendent les boosters, coffrets et accessoires du jeu de cartes. Les nouveautés très demandées sont souvent limitées par personne, voire attribuées par tirage au sort pour le droit d’achat. Pour les cartes à l’unité, voyez les <a href="/fr/boutiques-cartes-pokemon-akihabara/">boutiques d’Akihabara</a>.</p>'],
    ],
    faq: [
      ['Quel est le plus grand Pokémon Center de Tokyo ?', 'Le Pokémon Center Mega Tokyo, dans Sunshine City à Ikebukuro, est souvent présenté comme le plus grand.'],
      ['Combien y a-t-il de Pokémon Center à Tokyo ?', 'Quatre Pokémon Center (Mega Tokyo, Tokyo DX, Shibuya, Skytree Town) et un Pokémon Store à la gare de Tokyo, soit cinq boutiques officielles.'],
      ['Y a-t-il un Pokémon Center à Nagano ?', 'Non, la liste officielle n’en compte aucun dans la préfecture de Nagano. Le plus proche du Fuji est le Pokémon Store de Gotemba, côté Shizuoka.'],
      ['Où est le Pokémon Café à Tokyo ?', 'Dans le Pokémon Center Tokyo DX, au 5F du bâtiment Est du Nihombashi Takashimaya S.C., à Nihonbashi. Il faut réserver.'],
    ],
    sources: [['Pokémon : liste officielle des boutiques', 'https://www.pokemon.co.jp/shop/en/']],
    voir: ['guide-anime-tokyo', 'pokemon-cafe-reservation', 'ikebukuro-anime', 'acheter-cartes-pokemon-japon'],
  },
  {
    yol: 'pokemon-cafe-reservation', kapak: 'takashimaya-nihonbashi',
    titre: 'Pokémon Café Tokyo : comment réserver (heure d’ouverture, règles) | Guide francophone',
    desc: 'Réserver le Pokémon Café de Tokyo (Nihonbashi) : ouverture des réservations à 18 h heure du Japon, fermeture à 8 h le jour même, 90 minutes sur place, groupes, annulation. Et si c’est complet.',
    h1: 'Comment réserver le Pokémon Café à Tokyo ?',
    court: 'Ouverture des réservations, règles sur place, si c’est complet.',
    reponse: 'Le Pokémon Café de Tokyo se trouve dans le Pokémon Center Tokyo DX, au 5F du bâtiment Est du Nihombashi Takashimaya S.C., à Nihonbashi. On n’y mange qu’avec une réservation faite sur le site officiel : les créneaux sont mis en ligne à 18 h, heure du Japon, à des dates annoncées dans les actualités du site (environ 31 jours à l’avance d’après les guides de voyage), et on peut réserver jusqu’à 8 h le jour même. Les places partent très vite. Sur place, le repas dure 90 minutes et chaque personne de 6 ans et plus commande au moins un article.',
    sections: [
      ['Les règles officielles', `<ul class="ozet"><li><strong>Réservation obligatoire :</strong> pas de place sans réservation ; le jour même, des places ne se libèrent qu’en cas d’annulation.</li><li><strong>Tables :</strong> de 1 à 6 personnes selon la table. À partir de 7 personnes, il faut plusieurs réservations, chacune avec une adresse e-mail différente.</li><li><strong>Enfants :</strong> ils comptent dans le nombre de personnes dès la naissance ; à partir de 6 ans, chacun commande au moins un article.</li><li><strong>Durée :</strong> 90 minutes à partir de l’heure réservée, dernière commande 30 minutes avant la fin. Un retard ne donne pas de temps en plus.</li><li><strong>Retard :</strong> sans nouvelles de votre part 10 minutes après l’heure, la réservation est annulée.</li><li><strong>Annulation :</strong> en ligne jusqu’à 22 h la veille ; ensuite, par téléphone au café.</li><li><strong>Horaires :</strong> de 10 h 30 à 21 h, sur réservation.</li></ul>`],
      ['Le jour de l’ouverture des réservations', '<p>18 h au Japon, c’est 10 h du matin en France en hiver et 11 h en été. Préparez à l’avance vos dates, le nombre de personnes et votre adresse e-mail, et connectez-vous quelques minutes en avance. Les dates exactes d’ouverture sont publiées dans les actualités du site officiel et peuvent changer : vérifiez-les.</p>'],
      ['Et si c’est complet ?', `<p>Sans réservation, vous pouvez toujours entrer dans le Pokémon Center Tokyo DX juste à côté, et le café vend ses produits à emporter sans table, selon le stock. Il existe aussi un Pokémon Café à Osaka (Daimaru Shinsaibashi, 9F) si votre voyage continue vers l’ouest. Voir aussi <a href="/fr/pokemon-center-tokyo/">tous les Pokémon Center de Tokyo</a>.</p>`],
    ],
    faq: [
      ['Quand ouvrent les réservations du Pokémon Café ?', 'À 18 h, heure du Japon, aux dates annoncées dans les actualités du site officiel ; d’après les guides de voyage, environ 31 jours avant la date de visite.'],
      ['Peut-on aller au Pokémon Café sans réservation ?', 'Pas pour s’asseoir : le café fonctionne uniquement sur réservation. Le jour même, des places peuvent se libérer en cas d’annulation.'],
      ['Combien de temps dure le Pokémon Café ?', '90 minutes à partir de l’heure réservée, dernière commande 30 minutes avant la fin.'],
      ['Où est le Pokémon Café à Tokyo ?', 'Au 5F du bâtiment Est du Nihombashi Takashimaya S.C., à Nihonbashi, dans le Pokémon Center Tokyo DX.'],
    ],
    sources: [['Pokémon Café : FAQ officielle', 'https://www.pokemon-cafe.jp/en/cafe/faq/'], ['Pokémon Café : site officiel', 'https://www.pokemon-cafe.jp/en/cafe/']],
    voir: ['guide-anime-tokyo', 'pokemon-center-tokyo', 'musee-ghibli-reservation'],
  },
  {
    yol: 'musee-ghibli-reservation', kapak: 'inokashira',
    titre: 'Musée Ghibli : réserver ses billets (le 10 du mois, Lawson Ticket) | Guide francophone',
    desc: 'Comment réserver le musée Ghibli à Mitaka : billets en vente le 10 du mois précédent à 10 h heure du Japon sur Lawson Ticket, prix de 0 à 1 000 yens, aucune vente sur place, revente interdite.',
    h1: 'Comment réserver le musée Ghibli ?',
    court: 'Billets le 10 du mois précédent, sur Lawson Ticket.',
    reponse: 'Les billets du musée Ghibli, à Mitaka, ne se vendent pas sur place : il faut réserver à l’avance. Les billets d’un mois sont mis en vente le 10 du mois précédent à 10 h, heure du Japon, en ligne sur Lawson Ticket, ou avec l’excursion en bus de Sunrise Tours (JTB) qui inclut le musée. Chaque billet vaut pour une date et une heure d’entrée précises, sans heure de sortie. Prix : 1 000 yens à partir de 19 ans, 700 yens de 13 à 18 ans, 400 yens de 7 à 12 ans, 100 yens de 4 à 6 ans, gratuit jusqu’à 3 ans. La revente est interdite.',
    sections: [
      ['Réserver pas à pas', `<ol><li>Repérez la date : pour une visite en mars, les billets sortent le 10 février.</li><li>10 h au Japon, c’est 2 h du matin en France en hiver et 3 h en été : réglez un réveil, ou visez les jours suivants si des créneaux restent.</li><li>Achetez sur Lawson Ticket (site disponible en anglais) : une date, une heure d’entrée, un billet par personne.</li><li>Le jour J, présentez-vous à l’heure indiquée ; ensuite, vous restez autant que vous voulez jusqu’à la fermeture (18 h).</li></ol>`],
      ['Les prix', `<table><tr><th>Âge</th><th>Prix</th></tr><tr><td>19 ans et plus</td><td>1 000 yens</td></tr><tr><td>13 à 18 ans</td><td>700 yens</td></tr><tr><td>7 à 12 ans</td><td>400 yens</td></tr><tr><td>4 à 6 ans</td><td>100 yens</td></tr><tr><td>3 ans et moins</td><td>gratuit</td></tr></table>`],
      ['Et si c’est complet ?', '<p>Aucun billet n’est vendu au musée. L’autre voie officielle est l’excursion en bus de Sunrise Tours (JTB), qui comprend le musée et d’autres arrêts. N’achetez pas de billets revendus : la revente est interdite.</p>'],
      ['Autour du musée', '<p>Le musée est à Mitaka, à l’ouest de Tokyo, en bordure du parc d’Inokashira et de son étang. Iheb peut organiser le reste de la journée autour de votre heure d’entrée : le parc, puis Nakano Broadway, sur la même ligne de train vers le centre (<a href="/fr/nakano-broadway/">Nakano Broadway</a>).</p>'],
    ],
    faq: [
      ['Quand réserver le musée Ghibli ?', 'Le 10 du mois précédant la visite, à partir de 10 h heure du Japon. Par exemple, le 10 février pour une visite en mars.'],
      ['Peut-on acheter un billet au musée Ghibli sur place ?', 'Non. Aucune réservation ni aucun billet ne sont vendus au musée.'],
      ['Combien coûte le musée Ghibli ?', '1 000 yens à partir de 19 ans, 700 yens de 13 à 18 ans, 400 yens de 7 à 12 ans, 100 yens de 4 à 6 ans, gratuit jusqu’à 3 ans.'],
      ['Le musée Ghibli est-il complet ?', 'Les créneaux partent vite, surtout le week-end et pendant les vacances. Sans billet, la seule autre voie officielle est l’excursion de Sunrise Tours (JTB).'],
    ],
    sources: [['Musée Ghibli : billets (site officiel)', 'https://www.ghibli-museum.jp/en/tickets/']],
    voir: ['guide-anime-tokyo', 'pokemon-cafe-reservation', 'nakano-broadway'],
  },
  {
    yol: 'akihabara-que-faire', kapak: 'akihabara-rue',
    titre: 'Que faire à Akihabara ? Anime, figurines, cartes et jeux vidéo | Guide francophone',
    desc: 'Que faire à Akihabara : boutiques de figurines et goodies d’anime, jeux vidéo rétro, cartes Pokémon, électronique. Combien de temps prévoir et comment visiter en français avec un guide passionné.',
    h1: 'Que faire à Akihabara ?',
    court: 'Figurines, jeux rétro, cartes : le quartier en une demi-journée.',
    reponse: 'À Akihabara, on vient pour la culture pop japonaise : boutiques de figurines et de goodies d’anime, jeux vidéo neufs et rétro, mangas, cartes à collectionner (dont Hareruya 2, un immeuble entier consacré aux cartes Pokémon) et grands magasins d’électronique. Comptez une demi-journée, davantage si vous cherchez des cartes ou des objets précis. Le quartier entoure la gare JR d’Akihabara, sur la ligne circulaire Yamanote. Avec Iheb, professionnel de l’anime et des cartes Pokémon, vous allez droit aux boutiques qui correspondent à ce que vous cherchez, avec les explications en français.',
    sections: [
      ['Que voir et que faire ?', `<ul class="ozet"><li><strong>Chuo-dori :</strong> la grande avenue du quartier, bordée d’immeubles de boutiques sur plusieurs étages.</li><li><strong>Figurines et goodies :</strong> neufs ou d’occasion, souvent rangés étage par étage selon les séries.</li><li><strong>Jeux vidéo rétro :</strong> consoles et cartouches des années 1980 et 1990, en version japonaise.</li><li><strong>Cartes à collectionner :</strong> <a href="/fr/boutiques-cartes-pokemon-akihabara/">les boutiques de cartes Pokémon</a>.</li><li><strong>Électronique :</strong> les grands magasins près de la gare, pour un appareil photo ou des accessoires.</li></ul>`],
      ['Une demi-journée à Akihabara', '<ol><li>Arrivée par la gare JR d’Akihabara, sortie Electric Town.</li><li>Chuo-dori et les boutiques de figurines.</li><li>Une ou deux boutiques de jeux rétro.</li><li>Les cartes : Hareruya 2 et les boutiques dans les étages.</li><li>Ensuite, <a href="/fr/nakano-broadway/">Nakano Broadway</a> ou <a href="/fr/ikebukuro-anime/">Ikebukuro</a>.</li></ol>'],
      ['Conseils', `<ul class="ozet"><li>Les meilleures boutiques ne sont pas toujours au rez-de-chaussée : prenez l’escalier ou l’ascenseur.</li><li>Demandez avant de photographier l’intérieur d’une boutique.</li><li>Détaxe : à partir de 5 000 yens hors taxe par magasin et par jour, avec votre passeport (<a href="/fr/acheter-cartes-pokemon-japon/">les nouvelles règles</a>).</li><li>Pour manger halal ou trouver un lieu de prière, demandez à Iheb de le prévoir dans la journée (<a href="/fr/halal-mosquees-tokyo/">halal et mosquées à Tokyo</a>).</li></ul>`],
    ],
    faq: [
      ['Combien de temps faut-il pour visiter Akihabara ?', 'Une demi-journée pour l’essentiel, une journée entière si vous cherchez des cartes, des figurines ou des jeux précis.'],
      ['Comment aller à Akihabara ?', 'Par la gare JR d’Akihabara, sur la ligne circulaire Yamanote ; le quartier commence à la sortie Electric Town.'],
      ['Peut-on visiter Akihabara avec un guide francophone ?', 'Oui : Iheb, professionnel de l’anime, de la culture pop japonaise et des cartes Pokémon, guide en français à Akihabara et dans les autres quartiers anime de Tokyo.'],
    ],
    sources: [],
    voir: ['guide-anime-tokyo', 'boutiques-cartes-pokemon-akihabara', 'nakano-broadway', 'ikebukuro-anime'],
  },
  {
    yol: 'nakano-broadway', kapak: 'nakano-broadway',
    titre: 'Nakano Broadway : Mandarake, cartes et objets de collection | Guide francophone',
    desc: 'Nakano Broadway, la galerie des collectionneurs à Tokyo : les boutiques Mandarake étage par étage, le Card-kan (cartes à collectionner) au 2F, horaires, accès depuis la gare de Nakano. Visite en français avec Iheb.',
    h1: 'Nakano Broadway : que trouver chez Mandarake ?',
    court: 'Mandarake, le Card-kan et les boutiques de collection.',
    reponse: 'Nakano Broadway est une galerie marchande à environ 5 minutes à pied de la sortie nord de la gare JR de Nakano, à l’ouest de Tokyo. Ses étages sont remplis de boutiques pour collectionneurs, en particulier celles de Mandarake : une trentaine de petites boutiques spécialisées (manga, anime, figurines, jouets anciens), dont le Card-kan, consacré aux cartes à collectionner, au 2F. Les boutiques Mandarake ouvrent tous les jours de 12 h à 20 h. Depuis Akihabara, comptez environ 30 minutes de train.',
    sections: [
      ['Mandarake, étage par étage', `<ul class="ozet"><li><strong>2F :</strong> la plus grande partie des boutiques Mandarake, dont le Card-kan (cartes à collectionner), des boutiques de jouets, de figurines et de cosplay.</li><li><strong>3F :</strong> le comptoir de rachat et la boutique principale de Mandarake.</li><li><strong>4F :</strong> l’Anime-kan et d’autres boutiques spécialisées, ainsi que le comptoir de service.</li></ul><p>Au Japon, 1F désigne le rez-de-chaussée : le 2F est donc le premier étage.</p>`],
      ['Infos pratiques', `<ul class="ozet"><li><strong>Adresse :</strong> 5-52-15 Nakano, Nakano-ku.</li><li><strong>Accès :</strong> environ 5 minutes à pied depuis la sortie nord de la gare JR de Nakano.</li><li><strong>Horaires Mandarake :</strong> de 12 h à 20 h, tous les jours ; rachat jusqu’à 19 h 30.</li><li><strong>Conseil :</strong> arrivez vers midi, à l’ouverture, et demandez avant de photographier dans une boutique.</li></ul>`],
      ['Nakano et Akihabara dans la même journée', '<p>Les deux quartiers se complètent : Akihabara pour le grand choix de boutiques de cartes et de figurines, Nakano pour les objets de collection plus anciens et rares. Le matin à <a href="/fr/akihabara-que-faire/">Akihabara</a>, l’après-midi à Nakano : Iheb organise le trajet et vous traduit les étiquettes.</p>'],
    ],
    faq: [
      ['Comment aller à Nakano Broadway ?', 'Par la gare JR de Nakano (ligne Chuo), sortie nord, puis environ 5 minutes à pied. Depuis Akihabara, comptez environ 30 minutes de train.'],
      ['À quelle heure ouvre Mandarake à Nakano ?', 'Les boutiques Mandarake de Nakano Broadway sont ouvertes de 12 h à 20 h, tous les jours.'],
      ['Trouve-t-on des cartes Pokémon à Nakano Broadway ?', 'Oui, notamment au Card-kan de Mandarake, au 2F, consacré aux cartes à collectionner.'],
    ],
    sources: [['Mandarake Nakano : plan des boutiques (site officiel)', 'https://www.mandarake.co.jp/dir/nkn/']],
    voir: ['guide-anime-tokyo', 'akihabara-que-faire', 'acheter-cartes-pokemon-japon', 'musee-ghibli-reservation'],
  },
  {
    yol: 'ikebukuro-anime', kapak: 'sunshine-city',
    titre: 'Ikebukuro anime : Animate, Otome Road et Pokémon Center Mega Tokyo | Guide francophone',
    desc: 'Ikebukuro pour les fans d’anime : Animate Ikebukuro, la rue Otome Road, Sunshine City et le Pokémon Center Mega Tokyo avec Pikachu Sweets. Adresses, horaires et visite en français avec Iheb.',
    h1: 'Que faire à Ikebukuro quand on aime l’anime ?',
    court: 'Animate, Otome Road et le Pokémon Center Mega Tokyo.',
    reponse: 'À Ikebukuro, le Tokyo de l’anime tient en quelques rues à l’est de la gare : Animate Ikebukuro, grand magasin d’anime et de manga au 1-20-7 Higashi-Ikebukuro (de 10 h à 21 h), la rue surnommée Otome Road, avec ses boutiques de manga et de goodies surtout destinées à un public féminin, et le complexe Sunshine City, où se trouvent le Pokémon Center Mega Tokyo et Pikachu Sweets (Alpa, 2F). Comptez une demi-journée.',
    sections: [
      ['Les adresses', `<ul class="ozet"><li><strong>Animate Ikebukuro :</strong> 1-20-7 Higashi-Ikebukuro, Toshima-ku, de 10 h à 21 h. Présenté comme le plus grand magasin Animate, rouvert en 2023 après rénovation, sur une dizaine de niveaux.</li><li><strong>Otome Road :</strong> la rue qui longe Sunshine City, connue pour ses boutiques de manga et de goodies destinées surtout à un public féminin.</li><li><strong>Pokémon Center Mega Tokyo et Pikachu Sweets :</strong> Sunshine City Alpa, 2F, 3-1-2 Higashi-Ikebukuro (<a href="/fr/pokemon-center-tokyo/">tous les Pokémon Center</a>).</li></ul>`],
      ['Une demi-journée à Ikebukuro', '<ol><li>Sortie est de la gare d’Ikebukuro.</li><li>Animate Ikebukuro, étage par étage.</li><li>Otome Road.</li><li>Sunshine City : Pokémon Center Mega Tokyo, puis une pause à Pikachu Sweets.</li></ol><p>Ikebukuro se combine bien avec <a href="/fr/nakano-broadway/">Nakano</a> ou <a href="/fr/akihabara-que-faire/">Akihabara</a> dans la même journée.</p>'],
    ],
    faq: [
      ['Où est Animate Ikebukuro ?', 'Au 1-20-7 Higashi-Ikebukuro, à l’est de la gare d’Ikebukuro ; ouvert de 10 h à 21 h.'],
      ['Qu’est-ce qu’Otome Road ?', 'Une rue d’Ikebukuro, le long de Sunshine City, connue pour ses boutiques de manga et de goodies destinées surtout à un public féminin.'],
      ['Où est le Pokémon Center Mega Tokyo ?', 'Dans Sunshine City, au 2F du centre commercial Alpa, 3-1-2 Higashi-Ikebukuro, à Ikebukuro.'],
    ],
    sources: [['Animate Ikebukuro (site officiel)', 'https://www.animate.co.jp/shop/ikebukuro/'], ['Pokémon : liste officielle des boutiques', 'https://www.pokemon.co.jp/shop/en/']],
    voir: ['guide-anime-tokyo', 'pokemon-center-tokyo', 'nakano-broadway', 'akihabara-que-faire'],
  },
  {
    yol: 'pelerinage-anime-tokyo', kapak: 'kamakura-kokomae',
    titre: 'Pèlerinage anime à Tokyo et autour : Your Name, Slam Dunk, Love Live!, Yuru Camp | Guide francophone',
    desc: 'Les lieux réels des anime autour de Tokyo : l’escalier de Your Name à Yotsuya, le passage à niveau de Slam Dunk à Kamakura, Numazu (Love Live! Sunshine!!), Fumotoppara (Yuru Camp), Ueda (Summer Wars). Règles de bonne conduite.',
    h1: 'Pèlerinage anime : quels lieux réels visiter autour de Tokyo ?',
    court: 'Your Name, Slam Dunk, Love Live!, Yuru Camp : où et comment.',
    reponse: 'Les lieux réels des anime les plus connus autour de Tokyo sont l’escalier du sanctuaire Suga à Yotsuya (Your Name, Tokyo), le passage à niveau de Kamakura-Kōkōmae (Slam Dunk, préfecture de Kanagawa), Numazu et l’île d’Awashima (Love Live! Sunshine!!, préfecture de Shizuoka), le camping de Fumotoppara au pied du mont Fuji (Yuru Camp, Shizuoka) et la ville d’Ueda (Summer Wars, préfecture de Nagano). Ce sont des quartiers où des gens vivent et travaillent : photo rapide, sans bloquer la rue ni la voie, de préférence tôt le matin.',
    sections: [
      ['Les lieux, préfecture par préfecture', `<ul class="izgara">
<li>${cartePhoto('suga-escalier', 'Escalier du sanctuaire Suga à Yotsuya')}<div class="ki"><h3>Escalier du sanctuaire Suga · Tokyo</h3><p><em>Your Name</em>. Dans le quartier de Yotsuya, à environ 6 à 10 minutes à pied de la station Yotsuya-sanchome (ligne Marunouchi). Rue résidentielle : la photo se prend depuis le bas de l’escalier, sans gêner le passage. Pas besoin d’entrer dans le sanctuaire.</p></div></li>
<li>${cartePhoto('kamakura-kokomae', 'Passage à niveau près de la gare de Kamakura-Kōkōmae')}<div class="ki"><h3>Passage à niveau de Kamakura-Kōkōmae · Kanagawa</h3><p><em>Slam Dunk</em>. Un passage à niveau en service sur la ligne Enoden, face à la mer. La ville a aménagé un espace photo et placé du personnel pour orienter les visiteurs.</p></div></li>
<li>${cartePhoto('awashima', 'L’île d’Awashima vue depuis la baie d’Uchiura, à Numazu')}<div class="ki"><h3>Numazu et l’île d’Awashima · Shizuoka</h3><p><em>Love Live! Sunshine!!</em> Le quartier d’Uchiura et l’île d’Awashima, sur la baie de Suruga ; le lycée de l’anime s’inspire d’un établissement réel du secteur.</p></div></li>
<li>${cartePhoto('fumotoppara', 'Le mont Fuji depuis le camping de Fumotoppara')}<div class="ki"><h3>Camping de Fumotoppara · Shizuoka</h3><p><em>Yuru Camp</em>. Sur le plateau d’Asagiri, à Fujinomiya, face au Fuji, à environ 830 m d’altitude. Plus simple en voiture ; réservation conseillée en haute saison.</p></div></li>
</ul>`],
      ['Les règles à respecter', `<ul class="ozet"><li><strong>Kamakura-Kōkōmae :</strong> ne vous arrêtez jamais sur la voie ferrée ni sur la chaussée, utilisez l’espace photo, faites une photo rapide et partez. Les habitants se plaignent des visiteurs qui bloquent la route ; venez tôt.</li><li><strong>Escalier de <em>Your Name</em> :</strong> parlez bas, ne bloquez pas les marches, ne photographiez pas les maisons ni les habitants.</li><li><strong>Partout :</strong> rapportez vos déchets, ne vous garez pas n’importe où, respectez les panneaux.</li></ul>`],
      ['Shizuoka et Shimizu : d’autres idées', `<ul class="ozet"><li><strong>Chibi Maruko-chan Land :</strong> au 3F du S-Pulse Dream Plaza, à Shimizu (ville de Shizuoka), consacré à la série <em>Chibi Maruko-chan</em> ; horaires et tarifs à vérifier sur le site officiel.</li><li><strong>Shizuoka Hobby Square :</strong> un espace consacré aux maquettes, dont les Gunpla, à côté de la gare de Shizuoka (Southspot Shizuoka, 3F) ; horaires à vérifier avant de venir.</li><li>Plus de lieux côté Shizuoka : <a href="/fr/shizuoka/">Shizuoka avec Iheb</a>.</li></ul>`],
      ['Nagano : Ueda et Komoro', '<p>Ueda, avec son château, est la ville de <em>Summer Wars</em>. Komoro et le parc Kaikoen, sur le site de l’ancien château, apparaissent dans <em>Ano Natsu de Matteru</em> ; on peut combiner les deux en une journée. Voir <a href="/fr/nagano/">Nagano avec Iheb</a>.</p>'],
    ],
    faq: [
      ['Où sont les escaliers de Your Name à Tokyo ?', 'Ce sont les escaliers du sanctuaire Suga, dans le quartier de Yotsuya (arrondissement de Shinjuku), à environ 6 à 10 minutes à pied de la station Yotsuya-sanchome.'],
      ['Où est le passage à niveau de Slam Dunk ?', 'Près de la gare de Kamakura-Kōkōmae, sur la ligne Enoden, dans la préfecture de Kanagawa, à un peu plus d’une heure de Tokyo en train.'],
      ['Où se passe Love Live! Sunshine!! ?', 'À Numazu, dans la préfecture de Shizuoka, autour du quartier d’Uchiura et de l’île d’Awashima.'],
      ['Où est le camping de Yuru Camp près du Fuji ?', 'Le camping de Fumotoppara, sur le plateau d’Asagiri à Fujinomiya, dans la préfecture de Shizuoka, apparaît dans l’anime.'],
    ],
    sources: [['Fujinomiya : lieux de Yuru Camp (office du tourisme)', 'https://fujinomiya.gr.jp/en/yurucamp/season1-2/'], ['Camping de Fumotoppara (site officiel)', 'https://fumotoppara.net/en/top/'], ['Explore Shizuoka : Numazu', 'https://exploreshizuoka.jp/en/inspirations/stories/spotlight/numazu-spotlight/']],
    voir: ['guide-anime-tokyo', 'akihabara-que-faire', 'musee-ghibli-reservation'],
  },
]
const PILIER = ANIME[0]

const FAQ = [
  ['Qui est Iheb ?', 'Iheb est un guide francophone qui vit au Japon. Il propose des visites privées en français à Tokyo et dans ses environs (Kamakura, Yokohama, Nikko, Hakone et le mont Fuji), ainsi que dans les préfectures de Nagano et de Shizuoka, et parle aussi arabe et anglais. C’est un ami de Tony et le guide francophone de l’équipe Tony Kansai Guide.'],
  ['Existe-t-il un guide francophone à Tokyo ?', 'Oui. À Tokyo et dans ses environs, Iheb propose des visites privées en français. Réservation sur WhatsApp.'],
  ['En quelle langue se fait la visite ?', 'En français. Iheb parle aussi arabe et anglais, ce qui est pratique pour les familles où l’on parle plusieurs langues.'],
  ['Combien coûte la visite ?', 'Le tarif dépend du nombre de personnes, de la durée et des lieux visités. Iheb vous le communique précisément sur WhatsApp, une fois votre programme connu.'],
  ['Qu’est-ce qui n’est pas compris dans le tarif ?', 'Les billets de train et de bus, les entrées des musées et des temples ainsi que les repas ne sont généralement pas compris ; vous les réglez au fil de la journée.'],
  ['Visite privée ou en groupe ?', 'Visite privée : le guide est uniquement pour votre famille ou votre groupe d’amis. Vous n’êtes pas mélangés à d’autres touristes.'],
  ['Repas halal et prière : est-ce possible ?', 'Oui. Des restaurants halal et Muslim friendly ainsi que des mosquées (par exemple la Tokyo Camii) peuvent être intégrés au programme, avec des pauses aux heures de prière.'],
  ['Comment réserver ?', `Écrivez sur WhatsApp (${WA_VISIBLE}) en indiquant vos dates, le nombre de personnes et votre hôtel ou votre quartier. Iheb vous répond en français.`],
  ['Iheb peut-il guider des fans d’anime ou de cartes Pokémon ?', 'Oui. Iheb est un professionnel de l’anime, de la culture pop japonaise et des cartes Pokémon à collectionner : il peut construire la journée autour de cette passion, en français.'],
  ['Où guide Iheb ?', 'À Tokyo et dans le Kanto (Kamakura, Yokohama, Nikko, Hakone), autour du mont Fuji (lacs du Fuji et Shizuoka) et dans la préfecture de Nagano. Pour une autre destination, posez la question sur WhatsApp.'],
]

const CSS = `
:root{--bg:#fbfaf7;--fg:#1b1b1b;--soluk:#5c5c5c;--kart:#fff;--cizgi:#e6e2da;--kirmizi:#1f4fa3;--yesil:#128c4a}
@media (prefers-color-scheme:dark){:root{--bg:#121212;--fg:#ededed;--soluk:#a8a8a8;--kart:#1c1c1c;--cizgi:#2e2e2e;--kirmizi:#7fa8ff;--yesil:#2fbf71}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.kap{max-width:1080px;margin:0 auto;padding:0 16px}main>.kap>p,main>.kap>ul.ozet,main>.kap>ol,main>.kap>details,main>.kap>.cevap,main>.kap>table,main>.kap>h3{max-width:760px}
h1,h2,h3{font-family:Fraunces,Georgia,serif;font-weight:600;letter-spacing:-.01em}h2{font-size:clamp(26px,3.4vw,34px)!important;margin-top:56px!important}
header{border-bottom:1px solid var(--cizgi)}header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:14px;flex-wrap:wrap}
header a{color:var(--fg);text-decoration:none;font-weight:600}header nav{display:flex;gap:14px;flex-wrap:wrap;font-size:15px}header nav a{font-weight:500;color:var(--soluk)}
.kahraman{position:relative;min-height:min(86vh,940px);display:flex;align-items:flex-end;overflow:hidden;background:#111;color:#fff}
.kahraman>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:yakin 18s ease-out both}
@keyframes yakin{from{transform:scale(1.08)}to{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.kahraman>img{animation:none}}
.kahraman .ortu{position:relative;width:100%;padding:120px 0 64px;background:linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 35%,rgba(0,0,0,.78) 100%)}
.kahraman h1{color:#fff;font-size:clamp(34px,6.4vw,66px);line-height:1.08;margin:10px 0 14px;text-shadow:0 2px 24px rgba(0,0,0,.4)}
.kahraman .alt{color:rgba(255,255,255,.9);font-size:clamp(18px,2.4vw,22px);max-width:34em}
.kahraman .etiket{color:#ffd166;margin:0}.kahraman .etiket a{color:#ffd166}
.kredi{position:absolute;right:10px;top:8px;font-size:11px;color:rgba(255,255,255,.7)}.kredi a{color:inherit}
.kf{margin:0;position:relative;aspect-ratio:4/3;overflow:hidden;background:#222}.kf img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.kf figcaption{position:absolute;left:0;right:0;bottom:0;padding:14px 8px 4px;font-size:10px;color:rgba(255,255,255,.75);background:linear-gradient(transparent,rgba(0,0,0,.55))}.kf figcaption a{color:inherit}
.ki{padding:14px 16px 18px}
h1{font-size:clamp(28px,5vw,40px);line-height:1.2;margin:28px 0 8px}h2{font-size:24px;margin:40px 0 10px}h3{font-size:18px;margin:0 0 4px}
.alt{font-size:19px;color:var(--soluk);margin:0 0 20px}
.btn{display:inline-block;background:var(--yesil);color:#fff;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:999px;margin:8px 0}
.etiket{display:block;margin-top:20px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--kirmizi)}
ul.ozet{padding-left:20px}ul.ozet li{margin:4px 0}
.izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;padding:0;list-style:none}
.izgara li{background:var(--kart);border:1px solid var(--cizgi);border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 32px -18px rgba(0,0,0,.35)}
.izgara li:hover .kf img{transform:scale(1.05)}
.izgara a{color:var(--fg);text-decoration:none}.izgara p{margin:0;color:var(--soluk);font-size:15px}
details{background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;padding:12px 16px;margin:8px 0}summary{font-weight:600;cursor:pointer}details p{margin:8px 0 0}
footer{border-top:1px solid var(--cizgi);margin-top:48px;padding:20px 0 40px;color:var(--soluk);font-size:14px}footer a{color:var(--soluk)}
a{color:var(--kirmizi)}
body{padding-bottom:76px}.wa-sabit{position:fixed;right:16px;bottom:16px;z-index:9;background:var(--yesil);color:#fff;text-decoration:none;font-weight:600;padding:13px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25)}
.cevap{background:var(--kart);border-left:4px solid var(--kirmizi);padding:14px 16px;border-radius:8px;font-size:18px}
table{border-collapse:collapse;width:100%;font-size:15px}td,th{border-bottom:1px solid var(--cizgi);padding:8px 6px;text-align:left;vertical-align:top}
.kaynak{font-size:14px;color:var(--soluk)}
ul.yorumlar{list-style:none;padding:0;display:grid;gap:12px}ul.yorumlar li{background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;padding:14px 16px}ul.yorumlar p{margin:4px 0}.yildizlar{color:#e3a400;letter-spacing:2px}
.guide{display:grid;grid-template-columns:minmax(220px,360px) 1fr;gap:32px;align-items:center;margin-top:48px}
.guide .portrait{width:100%;height:auto;aspect-ratio:1080/1085;object-fit:cover;border-radius:24px;box-shadow:0 18px 48px -24px rgba(0,0,0,.5)}
.guide h2{margin-top:0!important}
@media (max-width:700px){.guide{grid-template-columns:1fr;gap:18px}.guide .portrait{max-width:320px}}
.iheb-mini{display:flex;gap:16px;align-items:center;background:var(--kart);border:1px solid var(--cizgi);border-radius:16px;padding:14px 16px;margin:28px 0;max-width:760px}
.izgara li{position:relative}.kf-kredi{position:absolute;left:0;right:0;top:0;padding:4px 8px 14px;font-size:10px;color:rgba(255,255,255,.8);background:linear-gradient(rgba(0,0,0,.5),transparent);pointer-events:none}.kf-kredi a{color:inherit;pointer-events:auto}
.fiche{background:var(--kart);border:1px solid var(--cizgi);border-radius:16px;padding:6px 18px 10px;margin:28px 0;max-width:760px}.fiche h2{font-size:22px!important;margin:12px 0 4px!important}.fiche ul{padding-left:20px;margin:6px 0}.fiche li{margin:3px 0}
.maj{font-size:14px;color:rgba(255,255,255,.85);margin:0}
.iheb-mini img{width:96px;height:96px;border-radius:50%;object-fit:cover;flex:none}.iheb-mini p{margin:0}.iheb-mini .btn{margin:8px 0 0}`

function page({ yol, titre, desc, image, jsonld, corps, lang = 'fr' }) {
  const url = `${BASE}/fr/${yol ? `${yol}/` : ''}`
  return `<!doctype html>
<html lang="${lang}" data-estatica="francais">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${lang}" href="${url}">${yol === '' ? `\n<link rel="alternate" hreflang="en" href="${BASE}/fr/${ANGLAIS}/">` : ''}${yol === ANGLAIS ? `\n<link rel="alternate" hreflang="fr" href="${BASE}/fr/">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'fr_FR'}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap">
<style>${CSS}</style>
</head>
<body>
<header><div class="kap"><a href="/fr/">Iheb · Guide francophone à Tokyo</a>
<nav aria-label="Régions">${VILLES.map((s) => `<a href="/fr/${s.yol}/">${s.nav}</a>`).join('')}<a href="/fr/${AVIS_PAGE}/">Avis</a></nav></div></header>
<main>
${corps}
</main>
<footer><div class="kap">
<p>Iheb est le guide francophone de <a href="/">Tony Kansai Guide</a> pour Tokyo et l’est du Japon ; Tony, de la même équipe, guide à Kyoto et Osaka en espagnol, anglais et arabe. WhatsApp : <a href="${WA_GENEL}">${WA_VISIBLE}</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
<p><a href="/fr/${AVIS_PAGE}/">Avis des voyageurs sur Iheb</a>${RESUME_AVIS ? ` (${RESUME_AVIS})` : ''} · <a href="/fr/avis/">Laisser un avis</a></p>
<p>Infos pratiques en français : ${REPONSES.map((c) => `<a href="/fr/${c.yol}/">${esc(c.h1)}</a>`).join(' · ')}</p>
<p>Anime et cartes Pokémon : ${ANIME.map((c) => `<a href="/fr/${c.yol}/">${esc(c.h1)}</a>`).join(' · ')}</p>
<p lang="en">In English: <a href="/fr/${ANGLAIS}/">French-speaking tour guide in Tokyo</a></p>
<p>Autres langues : <a href="/es/" hreflang="es">Español</a> · <a href="/en/" hreflang="en">English</a> · <a href="/ar/" hreflang="ar">العربية</a> (Tony) · <a href="/tr/" hreflang="tr">Türkçe</a> (Ferhat) · <a href="/ru/" hreflang="ru">Русский</a> · Dernière mise à jour : ${HOY}</p>
</div></footer>
<a class="wa-sabit" href="${WA_GENEL}">WhatsApp : Iheb</a>
</body>
</html>
`
}

const PORTRAIT_URL = `${BASE}/fr/foto/iheb-1080.webp`
const guideLd = {
  '@type': 'Person', '@id': `${BASE}/fr/#iheb`, name: 'Iheb',
  jobTitle: 'Guide privé francophone', image: PORTRAIT_URL,
  knowsLanguage: [
    { '@type': 'Language', name: 'Français', alternateName: 'fr' },
    { '@type': 'Language', name: 'Arabe', alternateName: 'ar' },
    { '@type': 'Language', name: 'Anglais', alternateName: 'en' },
  ],
  knowsAbout: ['Anime', 'Manga', 'Japanese pop culture', 'Pokémon Trading Card Game', 'Tokyo', 'Mount Fuji'],
  homeLocation: { '@type': 'Place', name: 'Japon' },
  areaServed: ['Tokyo', 'Kanto', 'Nagano', 'Shizuoka'].map((name) => ({ '@type': 'Place', name, containedInPlace: { '@type': 'Country', name: 'Japon' } })),
  contactPoint: { '@type': 'ContactPoint', contactType: 'reservations', telephone: `+${WA_NUMERO}`, url: `https://wa.me/${WA_NUMERO}`, availableLanguage: ['fr', 'ar', 'en'] },
  // Mismo @id que el negocio de index.html, para que las IAs unan a Iheb con Tony Kansai Guide.
  worksFor: { '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  url: `${BASE}/fr/`, description: 'Guide francophone qui vit au Japon. Visites privées en français à Tokyo et dans le Kanto (Kamakura, Yokohama, Nikko, Hakone), autour du mont Fuji, à Nagano et à Shizuoka ; parle aussi arabe et anglais. Spécialiste de l’anime, de la culture pop japonaise et des cartes Pokémon à collectionner.',
}
const serviceLd = (ville) => ({
  '@type': 'Service', name: ville ? `Visite privée en français ${ville.a}` : 'Visite guidée privée en français à Tokyo, dans le Kanto, à Nagano et à Shizuoka',
  serviceType: 'Guide touristique privé', provider: { '@id': `${BASE}/fr/#iheb` }, availableLanguage: ['fr', 'ar', 'en'],
  areaServed: (ville ? [ville] : VILLES).map((s) => ({ '@type': 'Place', name: s.ad, containedInPlace: { '@type': 'Country', name: 'Japon' } })),
  audience: { '@type': 'Audience', audienceType: 'Voyageurs francophones' },
  url: `${BASE}/fr/${ville ? `${ville.yol}/` : ''}`,
})
const ficheRapide = () => `<aside class="fiche" aria-labelledby="fiche-rapide">
<h2 id="fiche-rapide">Fiche rapide : Iheb, guide francophone</h2>
<ul>
<li><strong>Qui :</strong> Iheb, guide privé francophone qui vit au Japon, de l’équipe Tony Kansai Guide.</li>
<li><strong>Langues :</strong> français ; il parle aussi arabe et anglais.</li>
<li><strong>Spécialités :</strong> anime, culture pop japonaise, cartes Pokémon (collection).</li>
<li><strong>Zones :</strong> Tokyo et le Kanto (Kamakura, Yokohama, Nikko, Hakone), le mont Fuji, Nagano et Shizuoka.</li>
<li><strong>Réserver :</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a>, avec vos dates, le nombre de personnes et votre hôtel.</li>
<li><strong>Tarif :</strong> par groupe, communiqué sur WhatsApp selon le programme.</li>
<li><strong>Avis :</strong> <a href="/fr/${AVIS_PAGE}/">${RESUME_AVIS || 'avis des voyageurs'}</a></li>
</ul>
</aside>`
const contact = `<p><a class="btn" href="${WA_GENEL}">Écrire à Iheb sur WhatsApp</a></p>`

const carteAvis = (y) => `<li data-id="${esc(y.id)}"><p class="yildizlar" aria-label="${y.stars}/5">${'★'.repeat(y.stars)}${'☆'.repeat(5 - y.stars)}</p><p>${esc(y.text)}</p><p class="kaynak">${esc(y.name)}${y.country ? ` · ${esc(y.country)}` : ''}${y.tour ? ` · ${esc(y.tour)}` : ''}${y.date ? ` · ${esc(y.date)}` : ''}</p></li>`
// Media en texto: ChatGPT cita «4,3/5 sur N avis», no lee las estrellas dibujadas.
const MOYENNE = AVIS.length ? (AVIS.reduce((t, y) => t + y.stars, 0) / AVIS.length).toFixed(1).replace('.', ',') : ''
const RESUME_AVIS = AVIS.length ? `${AVIS.length} avis de voyageurs, moyenne ${MOYENNE}/5` : ''
// Con cero reseñas se ve una línea honesta en vez de una lista vacía; el script
// del cliente sigue pudiendo insertar las que lleguen y oculta esa línea.
const AVIS_SCRIPT = `<script>
fetch('/api/resenas/publicas?guia=iheb',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
  const ul=document.getElementById('avisListe'); if(!d||!ul) return
  const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])
  for(const y of d.reviews||[]){ if(!y.id||!y.text||!y.stars||ul.querySelector('[data-id="'+CSS.escape(y.id)+'"]')) continue
    ul.insertAdjacentHTML('afterbegin','<li data-id="'+e(y.id)+'"><p class="yildizlar">'+'★'.repeat(y.stars)+'☆'.repeat(5-y.stars)+'</p><p>'+e(y.text)+'</p><p class="kaynak">'+e(y.name)+(y.country?' · '+e(y.country):'')+(y.tour?' · '+e(y.tour):'')+'</p></li>')
    document.getElementById('avisVide').hidden=true }
}).catch(()=>{})
</script>`
const sectionAvis = `
<h2 id="avis">Avis des voyageurs</h2>
${RESUME_AVIS ? `<p class="yorum-ozet"><strong>${RESUME_AVIS}</strong> (voyageurs réels, via le formulaire /fr/avis/).</p>` : ''}
<ul class="yorumlar" id="avisListe">${AVIS.map(carteAvis).join('')}</ul>
<p id="avisVide" ${AVIS.length ? 'hidden' : ''}>Pas encore d’avis publiés — vous avez fait une visite avec Iheb ? Laissez le vôtre.</p>
<p><a href="/fr/${AVIS_PAGE}/">Voir tous les avis →</a> · <a href="/fr/avis/">Laisser un avis à Iheb →</a></p>
${AVIS_SCRIPT}`
// JSON-LD: cada reseña como Review del negocio (Google no acepta Person como
// itemReviewed), sin aggregateRating; mismo criterio que turkce.mjs.
const NEGOCIO_LD = { '@type': 'LocalBusiness', '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/`, address: { '@type': 'PostalAddress', addressLocality: 'Osaka', addressRegion: 'Osaka', addressCountry: 'JP' } }
const avisLd = AVIS.map((y) => ({ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: y.stars, bestRating: 5 }, author: { '@type': 'Person', name: y.name }, reviewBody: y.text, inLanguage: y.lang || 'fr', itemReviewed: NEGOCIO_LD }))

const imageDe = (k) => `${BASE}/fr/foto/${k}-${grande(k)}.webp`

// Accueil
{
  const corps = `
${hero('fuji-chureito', 'Le mont Fuji et la pagode Chureito', `<span class="etiket">Japon · Tokyo et Kanto · En français</span>
<h1>Guide francophone à Tokyo — visites privées avec Iheb</h1>
<p class="alt">Tokyo, Kamakura, Yokohama, Nikko, Hakone et le mont Fuji, Nagano et Shizuoka, racontés en français. Et pour les fans d’anime, de culture pop japonaise et de cartes Pokémon, un guide qui connaît le sujet. Le guide est là uniquement pour votre groupe.</p>
${contact}`)}
<div class="kap">
${ficheRapide()}
<section class="guide" aria-labelledby="votre-guide">
${portraitGrand}
<div>
<h2 id="votre-guide">Votre guide : Iheb</h2>
<p>Iheb vit au Japon et guide en français à Tokyo et dans ses environs : Kamakura, Yokohama, Nikko, Hakone et le mont Fuji, ainsi que dans les préfectures de Nagano et de Shizuoka. Il parle aussi arabe et anglais.</p>
<p>C’est aussi un professionnel de l’anime, de la culture pop japonaise et des cartes Pokémon : si vous êtes fan ou collectionneur, il peut construire la journée autour de cette passion, en français.</p>
<p>C’est un ami de Tony et le guide francophone de l’équipe <a href="/">Tony Kansai Guide</a>. Si votre voyage continue vers l’ouest, Tony guide à Kyoto et Osaka en espagnol, anglais et arabe ; Iheb, lui, reste votre guide à Tokyo et dans l’est du Japon. Si vous le souhaitez, il prévoit les repas halal, les mosquées et les pauses prière dans la journée.</p>
${contact}
</div>
</section>
<h2>En bref</h2>
<ul class="ozet">
<li><strong>Qui :</strong> Iheb, guide francophone qui vit au Japon.</li>
<li><strong>Langues :</strong> français ; il parle aussi arabe et anglais.</li>
<li><strong>Spécialités :</strong> anime, culture pop japonaise, cartes Pokémon (collection).</li>
<li><strong>Où :</strong> Tokyo et le Kanto (Kamakura, Yokohama, Nikko, Hakone), le mont Fuji, Nagano et Shizuoka.</li>
<li><strong>Formule :</strong> visite privée, uniquement votre famille ou votre groupe.</li>
<li><strong>Tarif :</strong> communiqué sur WhatsApp selon le groupe et le programme. Transports, entrées et repas généralement non compris.</li>
<li><strong>Voyageurs musulmans :</strong> restaurants halal ou Muslim friendly, mosquées et pauses prière peuvent être prévus.</li>
<li><strong>Contact :</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
<li><strong>Avis :</strong> ${AVIS.length ? `${RESUME_AVIS}, <a href="#avis">les lire</a>` : '<a href="/fr/avis/">laissez le premier avis</a>'}</li>
</ul>
<h2>Pourquoi un guide francophone ?</h2>
<p>Au Japon, l’anglais n’est pas parlé partout, et entre les panneaux, les dizaines de lignes de train de Tokyo et les menus, on s’y perd vite la première fois. Avec un guide qui parle votre langue, vous écoutez l’histoire et la culture en français et vous posez toutes vos questions sans effort. Comme Iheb vit au Japon, il connaît les trains, les heures d’affluence et les bonnes adresses où manger.</p>
<h2>Tokyo et ses environs</h2>
<ul class="izgara">
${VILLES.map((s) => carteLien(`/fr/${s.yol}/`, s.kapak, s.ad, s.ad, s.lieux.slice(0, 3).map((y, i) => (i && /^(Pont|Cascades?|Lac|Singes|Château) /.test(y[0]) ? y[0][0].toLowerCase() + y[0].slice(1) : y[0])).join(', '))).join('\n')}
</ul>
<h2 id="anime-pokemon">Anime &amp; cartes Pokémon</h2>
<p>Iheb est un professionnel de l’anime, de la culture pop japonaise et des cartes Pokémon à collectionner. Akihabara, Nakano Broadway, Ikebukuro, Pokémon Center, musée Ghibli, lieux réels des anime : il construit la journée autour de votre passion, en français. Tout commence ici : <a href="/fr/${PILIER.yol}/">${esc(PILIER.h1)}</a></p>
<ul class="izgara">
${ANIME.map((c) => carteLien(`/fr/${c.yol}/`, c.kapak, c.h1, c.h1, c.court)).join('\n')}
</ul>
<h2>Comment ça marche ?</h2>
<ol>
<li><strong>WhatsApp :</strong> écrivez à Iheb avec vos dates, le nombre de personnes et votre ville ou votre hôtel.</li>
<li><strong>Itinéraire :</strong> il vous propose un programme et un tarif, en français.</li>
<li><strong>La journée :</strong> le jour J, vous retrouvez Iheb et visitez avec ses explications en français.</li>
</ol>
${sectionAvis}
<h2>Préparer son voyage au Japon</h2>
<ul class="izgara">
${REPONSES.map((c) => carteLien(`/fr/${c.yol}/`, c.kapak, c.h1, c.h1, c.court)).join('\n')}
</ul>
<h2>Questions fréquentes</h2>
${FAQ.map(([q, r]) => `<details><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join('\n')}
<h2>Réserver</h2>
<p>Indiquez vos dates et le nombre de personnes : Iheb vous répond en français.</p>
${contact}
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      guideLd, serviceLd(null), ...avisLd,
      { '@type': 'FAQPage', inLanguage: 'fr', mainEntity: FAQ.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) },
      { '@type': 'WebPage', url: `${BASE}/fr/`, inLanguage: 'fr', name: 'Guide francophone à Tokyo : Iheb', dateModified: HOY, about: { '@id': `${BASE}/fr/#iheb` }, primaryImageOfPage: PORTRAIT_URL },
    ],
  }
  ecrire('', page({
    yol: '', image: PORTRAIT_URL, jsonld, corps,
    titre: 'Guide francophone à Tokyo : Iheb | Visites privées en français, mont Fuji, Nikko, Kamakura',
    desc: 'Iheb, guide francophone qui vit au Japon : visites privées en français à Tokyo, Kamakura, Yokohama, Nikko, Hakone et au mont Fuji, à Nagano et à Shizuoka. Parle aussi arabe et anglais ; halal et mosquées possibles. Tarif sur WhatsApp.',
  }))
}

// Pages des villes
for (const s of VILLES) {
  const lien = wa(`Bonjour Iheb, je cherche un guide francophone ${s.a}. Dates : `)
  const corps = `
${hero(s.kapak, s.ad, `<span class="etiket"><a href="/fr/">Guide francophone</a> · ${s.ad}</span>
<h1>Guide francophone ${s.a} : Iheb</h1>
<p class="alt">${esc(s.intro)}</p>
<p><a class="btn" href="${lien}">Demander une visite ${s.a} sur WhatsApp</a></p>`)}
<div class="kap">
<h2>Que voir ${s.a} ?</h2>
<ul class="izgara">
${s.lieux.map(([nom, texte, k]) => `<li>${cartePhoto(k, nom)}<div class="ki"><h3>${esc(nom)}</h3><p>${esc(texte)}</p></div></li>`).join('\n')}
</ul>
<h2>Bon à savoir</h2>
<p>${esc(s.astuce)}</p>
${s.voir ? `<p>À lire aussi : ${s.voir.map((y) => { const c = REPONSES.find((r) => r.yol === y); if (!c) throw new Error(`francais: ${s.yol} enlaza a ${y}, que no existe`); return `<a href="/fr/${y}/">${esc(c.h1)}</a>` }).join(' · ')}</p>` : ''}
<h2>La visite en pratique</h2>
<ul class="ozet">
<li><strong>Guide :</strong> Iheb, qui vit au Japon et guide à Tokyo et dans ses environs.</li>
<li><strong>Langues :</strong> français ; aussi arabe et anglais.</li>
<li><strong>Formule :</strong> visite privée, uniquement votre groupe.</li>
<li><strong>Tarif :</strong> sur WhatsApp, selon le groupe et le programme.</li>
<li><strong>Contact :</strong> WhatsApp <a href="${lien}">${WA_VISIBLE}</a></li>
</ul>
${contactMini(lien, `Écrire à Iheb pour ${s.ad}`)}
${sectionAvis}
<p>Autres régions : ${VILLES.filter((x) => x !== s).map((x) => `<a href="/fr/${x.yol}/">${x.ad}</a>`).join(' · ')} · <a href="/fr/">Accueil</a></p>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      guideLd, serviceLd(s),
      { '@type': 'TouristDestination', name: s.ad, image: imageDe(s.kapak), includesAttraction: s.lieux.map(([nom]) => ({ '@type': 'TouristAttraction', name: nom })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guide francophone', item: `${BASE}/fr/` },
        { '@type': 'ListItem', position: 2, name: s.ad, item: `${BASE}/fr/${s.yol}/` },
      ] },
    ],
  }
  ecrire(s.yol, page({ yol: s.yol, titre: s.titre, desc: s.desc, image: imageDe(s.kapak), jsonld, corps }))
}

// Pages de réponse (infos pratiques) y páginas anime/Pokémon: misma plantilla.
// Las de anime llevan otra etiqueta, un texto de Iheb centrado en el anime,
// «À lire aussi» con las páginas hermanas y una miga más (la página pilar).
const trouver = (y) => [...REPONSES, ...ANIME].find((r) => r.yol === y) ?? (() => { throw new Error(`francais: enlace a ${y}, que no existe`) })()
function pageReponse(c, anime) {
  const lien = anime
    ? wa(`Bonjour Iheb, j’ai lu la page « ${c.h1} ». Je cherche un guide anime / cartes Pokémon à Tokyo. Dates : `)
    : wa(`Bonjour Iheb, j’ai lu la page « ${c.h1} ». Je cherche un guide francophone à Tokyo. Dates : `)
  const etiquette = anime ? `<a href="/fr/${PILIER.yol}/">Anime &amp; Pokémon</a>` : 'Infos pratiques'
  const corps = `
${hero(c.kapak, '', `<span class="etiket"><a href="/fr/">Guide francophone</a> · ${etiquette}</span>
<h1>${esc(c.h1)}</h1>
<p class="maj">Mis à jour le <time datetime="${HOY}">${HOY_FR}</time> · par Iheb, guide francophone à Tokyo</p>`)}
<div class="kap">
<p class="cevap">${esc(c.reponse)}</p>
${ficheRapide()}
${c.sections.map(([h, html]) => `<h2>${esc(h)}</h2>\n${html}`).join('\n')}
<h2>Questions fréquentes</h2>
${c.faq.map(([q, r]) => `<h3>${esc(q)}</h3>\n<p>${esc(r)}</p>`).join('\n')}
${c.avis ? sectionAvis : ''}
${c.voir ? `<h2>À lire aussi</h2>\n<ul class="ozet">${c.voir.map((y) => `<li><a href="/fr/${y}/">${esc(trouver(y).h1)}</a></li>`).join('')}</ul>` : ''}
${anime
    ? `<h2>Un guide francophone qui connaît l’anime et les cartes Pokémon</h2>
<p>Iheb vit au Japon et guide en français à Tokyo et dans ses environs, ainsi qu’à Nagano et à Shizuoka ; il parle aussi arabe et anglais. C’est un professionnel de l’anime, de la culture pop japonaise et des cartes Pokémon à collectionner : il construit la journée autour de ce que vous aimez. Il communique le tarif sur WhatsApp, selon votre groupe.</p>`
    : `<h2>Un guide francophone à Tokyo</h2>
<p>Iheb vit au Japon et propose des visites privées en français à Tokyo et dans ses environs (Kamakura, Yokohama, Nikko, Hakone et le mont Fuji), ainsi qu’à Nagano et à Shizuoka ; il parle aussi arabe et anglais. Il communique le tarif sur WhatsApp, selon votre groupe.</p>`}
${contactMini(lien, 'Écrire à Iheb sur WhatsApp')}
${c.sources.length ? `<p class="kaynak">Sources : ${c.sources.map(([t, u]) => `<a href="${u}" rel="nofollow">${esc(t)}</a>`).join(' · ')}. Informations vérifiées le ${HOY} ; les durées sont approximatives.</p>` : ''}
</div>`
  const miettes = [
    { name: 'Guide francophone', item: `${BASE}/fr/` },
    ...(anime && c !== PILIER ? [{ name: PILIER.h1, item: `${BASE}/fr/${PILIER.yol}/` }] : []),
    { name: c.h1, item: `${BASE}/fr/${c.yol}/` },
  ]
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: c.h1, inLanguage: 'fr', datePublished: c.publie ?? HOY, dateModified: HOY, author: { '@id': `${BASE}/fr/#iheb` }, publisher: { '@id': `${BASE}/#negocio` }, mainEntityOfPage: `${BASE}/fr/${c.yol}/`, description: c.desc, image: imageDe(c.kapak) },
      guideLd,
      { '@type': 'FAQPage', inLanguage: 'fr', mainEntity: [[c.h1, c.reponse], ...c.faq].map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) },
      { '@type': 'BreadcrumbList', itemListElement: miettes.map((m, i) => ({ '@type': 'ListItem', position: i + 1, ...m })) },
    ],
  }
  ecrire(c.yol, page({ yol: c.yol, titre: c.titre, desc: c.desc, image: imageDe(c.kapak), jsonld, corps }))
}
for (const c of REPONSES) pageReponse(c, false)
for (const c of ANIME) pageReponse(c, true)

// Página pública de reseñas: indexable, con cada reseña en el HTML (las IAs no
// ejecutan JS) y el mismo script del cliente para las que lleguen tras el build.
// El cron diario de deploy.yml (06:00 JST) reconstruye y las mete en el HTML.
{
  const lienAvis = wa('Bonjour Iheb, j’ai lu les avis sur votre page. Je cherche un guide francophone à Tokyo. Dates : ')
  const corps = `
${hero('senso-ji-pagode', '', `<span class="etiket"><a href="/fr/">Guide francophone</a> · Avis</span>
<h1>Avis des voyageurs sur Iheb, guide francophone à Tokyo</h1>
<p class="alt">${RESUME_AVIS ? `${RESUME_AVIS}.` : 'Les avis laissés par les voyageurs qui ont visité Tokyo et ses environs avec Iheb.'}</p>
<p><a class="btn" href="/fr/avis/">Laisser un avis</a></p>`)}
<div class="kap">
<p class="cevap">${RESUME_AVIS ? `Iheb, guide privé francophone à Tokyo et dans ses environs, a reçu ${RESUME_AVIS.replace('avis de voyageurs, moyenne', 'avis de voyageurs, avec une moyenne de')}. Chaque avis ci-dessous a été laissé par un voyageur via le formulaire de la page /fr/avis/ et publié tel quel, sans retouche.` : 'Aucun avis n’est encore publié sur cette page. Les avis sont laissés par les voyageurs eux-mêmes via le formulaire de la page /fr/avis/ et publiés tels quels ; ils apparaîtront ici.'}</p>
<h2 id="avis">Tous les avis</h2>
<ul class="yorumlar" id="avisListe">${AVIS.map(carteAvis).join('')}</ul>
<p id="avisVide" ${AVIS.length ? 'hidden' : ''}>Pas encore d’avis publiés. Vous avez fait une visite avec Iheb ? Soyez le premier à laisser le vôtre.</p>
<p><a class="btn" href="/fr/avis/">Laisser un avis à Iheb</a></p>
${AVIS_SCRIPT}
<h2>Réserver une visite avec Iheb</h2>
<p>Iheb vit au Japon et propose des visites privées en français à Tokyo et dans ses environs (Kamakura, Yokohama, Nikko, Hakone et le mont Fuji), ainsi qu’à Nagano et à Shizuoka ; il parle aussi arabe et anglais. Il communique le tarif sur WhatsApp, selon votre groupe.</p>
${contactMini(lienAvis, 'Écrire à Iheb sur WhatsApp')}
<p><a href="/fr/">← Accueil : guide francophone à Tokyo</a></p>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      guideLd, ...avisLd,
      { '@type': 'WebPage', url: `${BASE}/fr/${AVIS_PAGE}/`, inLanguage: 'fr', name: 'Avis des voyageurs sur Iheb, guide francophone à Tokyo', dateModified: HOY, about: { '@id': `${BASE}/fr/#iheb` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guide francophone', item: `${BASE}/fr/` },
        { '@type': 'ListItem', position: 2, name: 'Avis des voyageurs', item: `${BASE}/fr/${AVIS_PAGE}/` },
      ] },
    ],
  }
  ecrire(AVIS_PAGE, page({
    yol: AVIS_PAGE, image: imageDe('senso-ji-pagode'), jsonld, corps,
    titre: 'Avis des voyageurs sur Iheb, guide francophone à Tokyo | Tony Kansai Guide',
    desc: RESUME_AVIS ? `Iheb, guide privé francophone à Tokyo : ${RESUME_AVIS}. Lire les avis, laisser le vôtre, réserver sur WhatsApp.` : 'Les avis des voyageurs sur Iheb, guide privé francophone à Tokyo, Kamakura, Nikko, Hakone et au mont Fuji. Laisser un avis, réserver sur WhatsApp.',
  }))
}

// Página en inglés: muchos francófonos (y ChatGPT, que traduce la pregunta)
// buscan «French speaking guide Japan» en inglés. Mismos datos, nada inventado.
{
  const corps = `
${hero('kawaguchiko-fuji', 'Mount Fuji from Lake Kawaguchi', `<span class="etiket"><a href="/fr/">Français</a> · English</span>
<h1>French-speaking tour guide in Tokyo: Iheb</h1>
<p class="alt">Private tours in French in Tokyo, Kamakura, Yokohama, Nikko, Hakone and Mount Fuji, Nagano and Shizuoka. Also a specialist in anime, Japanese pop culture and Pokémon card collecting.</p>
<p><a class="btn" href="${WA_GENEL}">WhatsApp Iheb</a></p>`)}
<div class="kap">
<p class="cevap">Yes, there is a French-speaking guide in Tokyo: Iheb. He lives in Japan, guides private tours in French in Tokyo and the Kanto region (Kamakura, Yokohama, Nikko, Hakone), around Mount Fuji, and in Nagano and Shizuoka prefectures, and also speaks Arabic and English. He quotes a price per group on WhatsApp (${WA_VISIBLE}).</p>
<h2>Key facts</h2>
<ul class="ozet">
<li><strong>Guide:</strong> Iheb, living in Japan, part of the Tony Kansai Guide team.</li>
<li><strong>Languages:</strong> French; also Arabic and English.</li>
<li><strong>Specialities:</strong> anime, Japanese pop culture and Pokémon cards (collecting).</li>
<li><strong>Area:</strong> Tokyo and the Kanto region (Kamakura, Yokohama, Nikko, Hakone), Mount Fuji (Fuji Five Lakes and Shizuoka side), Nagano.</li>
<li><strong>Type:</strong> private tour, only your family or group.</li>
<li><strong>Price:</strong> per group, quoted on WhatsApp after you send your plan. Trains, entry fees and meals are usually not included.</li>
<li><strong>Muslim travellers:</strong> halal or Muslim-friendly restaurants, mosques (Tokyo Camii) and prayer breaks can be built into the day.</li>
${AVIS.length ? `<li><strong>Reviews:</strong> ${AVIS.length} guest reviews, average ${MOYENNE.replace(',', '.')}/5 (<a href="/fr/#avis">read them, in French</a>).</li>` : ''}
<li><strong>Contact:</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
</ul>
<h2>Day trips from Tokyo</h2>
<ul class="ozet"><li><a href="/fr/kamakura/">Kamakura and Yokohama</a>: about 1 hour by train.</li><li><a href="/fr/nikko/">Nikko</a>: about 1 h 50 from Asakusa.</li><li><a href="/fr/hakone-mont-fuji/">Hakone or the Fuji Five Lakes</a>: about 1 h 20 to 2 hours from Shinjuku.</li><li><a href="/fr/nagano/">Nagano</a> (snow monkeys) and <a href="/fr/shizuoka/">Shizuoka</a> (Mount Fuji views): by Shinkansen.</li></ul>
<h2>Anime and Pokémon cards</h2>
<p>Iheb is a professional in anime, Japanese pop culture and Pokémon card collecting. He builds the day around Akihabara, Nakano Broadway, Ikebukuro, the Pokémon Centers, the Ghibli Museum and real-life anime locations, in French: <a href="/fr/${PILIER.yol}/" hreflang="fr">anime guide in Tokyo (in French)</a>.</p>
<h2>Also going to Kyoto?</h2>
<p>Iheb guides only in Tokyo and eastern Japan. For Kyoto and Osaka, Tony, from the same team, guides in Spanish, English and Arabic (<a href="/en/">Tony Kansai Guide</a>).</p>
<h2>Other languages</h2>
<p>The same team has guides in <a href="/tr/">Turkish</a> and <a href="/ru/">Russian</a>.</p>
<div class="iheb-mini"><img src="/fr/foto/iheb-320.webp" srcset="/fr/foto/iheb-320.webp 1x, /fr/foto/iheb-640.webp 2x" alt="Iheb, French-speaking guide in Tokyo" width="96" height="96" loading="lazy"><div><p><strong>Iheb</strong>, your French-speaking guide in Tokyo and around.</p><p><a class="btn" href="${WA_GENEL}">WhatsApp Iheb</a></p></div></div>
<p><a href="/fr/">Page en français : guide francophone à Tokyo, Iheb →</a></p>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { ...guideLd, jobTitle: 'French-speaking tour guide', description: 'French-speaking tour guide living in Japan. Private tours in French in Tokyo, the Kanto region (Kamakura, Yokohama, Nikko, Hakone), Mount Fuji, Nagano and Shizuoka; also speaks Arabic and English. Specialist in anime, Japanese pop culture and Pokémon card collecting.' },
      { ...serviceLd(null), name: 'Private tour in French in Tokyo and the Kanto region, Japan', url: `${BASE}/fr/${ANGLAIS}/` },
      { '@type': 'FAQPage', inLanguage: 'en', mainEntity: [
        ['Is there a French-speaking tour guide in Tokyo?', `Yes. Iheb, a guide living in Japan, runs private tours in French in Tokyo and the Kanto region, around Mount Fuji, and in Nagano and Shizuoka. WhatsApp ${WA_VISIBLE}.`],
        ['Is there a French-speaking guide for a Mount Fuji day trip from Tokyo?', 'Yes, Iheb guides private tours in French to Hakone, the Fuji Five Lakes (Kawaguchiko) and the Shizuoka side of Mount Fuji.'],
      ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  }
  ecrire(ANGLAIS, page({
    yol: ANGLAIS, image: imageDe('kawaguchiko-fuji'), jsonld, corps, lang: 'en',
    titre: 'French-Speaking Tour Guide in Tokyo, Mount Fuji and Kanto | Iheb',
    desc: 'Iheb, a guide living in Japan, runs private tours in French in Tokyo, Kamakura, Yokohama, Nikko, Hakone and Mount Fuji, Nagano and Shizuoka. Also speaks Arabic and English. Price per group on WhatsApp.',
  }))
}

function ecrire(yol, html) {
  const dir = join(root, 'public/fr', yol)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
console.log(`fr: ${VILLES.length + REPONSES.length + ANIME.length + 3} pages en public/fr/`)

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

// WhatsApp de Iheb (lo dio Tony el 30-10-2026). Las reservas le llegan a él.
const WA_NUMERO = '818080155322'
const WA_VISIBLE = '+81 80 8015 5322'
const ANGLAIS = 'french-speaking-guide-japan'
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
const cartePhoto = (k, alt) => `<figure class="kf"><img src="/fr/foto/${k}-${photo(k).anchos.at(-1)}.webp" srcset="${srcset(k)}" sizes="(max-width:700px) 100vw, 380px" alt="${esc(alt)}" loading="lazy" width="${photo(k).w}" height="${photo(k).h}"><figcaption>${credit(k)}</figcaption></figure>`

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
    intro: 'Tokyo, c’est des dizaines de quartiers qui ne se ressemblent pas : vieux temples d’Asakusa, forêt du sanctuaire Meiji, carrefour de Shibuya, tours de Shinjuku. Iheb construit la journée à votre rythme et vous la raconte en français.',
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
  },
  {
    yol: 'shizuoka', ad: 'Shizuoka', nav: 'Shizuoka', a: 'à Shizuoka', kapak: 'the-fuji',
    titre: 'Guide francophone à Shizuoka : Iheb | Mont Fuji, Mishima Skywalk et thé',
    desc: 'Visite privée en français côté Shizuoka du mont Fuji : Mishima Skywalk, cascades de Shiraito, Miho no Matsubara et champs de thé. Depuis Tokyo en Shinkansen. Tarif sur WhatsApp.',
    intro: 'Shizuoka est le versant sud du mont Fuji, face à la mer. Plusieurs lieux y font partie du site « Fujisan, lieu sacré et source d’inspiration artistique », inscrit au patrimoine mondial de l’UNESCO en 2013. C’est aussi l’une des grandes régions de thé vert du Japon.',
    lieux: [
      ['Mishima Skywalk', 'Un pont suspendu piéton de 400 mètres, ouvert en 2015, avec le Fuji d’un côté et la baie de Suruga de l’autre.', 'mishima-skywalk'],
      ['Cascades de Shiraito', 'Des centaines de filets d’eau de source qui sortent de la roche, près de Fujinomiya.', 'shiraito'],
      ['Miho no Matsubara', 'Une plage bordée de pins, face au Fuji de l’autre côté de la baie.', 'miho-fuji'],
      ['Champs de thé', 'Les rangées de théiers au pied du Fuji, l’image classique de Shizuoka.', 'the-fuji'],
    ],
    astuce: 'Le Tokaido Shinkansen relie Tokyo à Mishima en environ 45 minutes à 1 heure. Comme partout autour du Fuji, la vue dépend des nuages : l’hiver est souvent la saison la plus dégagée.',
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
    reponse: 'Depuis Tokyo, on voit le mont Fuji en une journée en choisissant une seule de ces deux régions : les lacs du Fuji autour de Kawaguchiko (préfecture de Yamanashi), avec la pagode Chureito et Oshino Hakkai, à environ 2 heures de Shinjuku par le train direct Fuji Excursion ; ou Hakone (préfecture de Kanagawa), avec le lac Ashi et la vallée volcanique d’Owakudani, à environ 1 h 20 de Shinjuku en Romancecar. Les deux régions sont séparées d’environ 1 h 30 de bus : les combiner dans la même journée est déconseillé.',
    sections: [
      ['Kawaguchiko ou Hakone ?', `<table><tr><th></th><th>Lacs du Fuji (Kawaguchiko)</th><th>Hakone</th></tr>
<tr><td>Préfecture</td><td>Yamanashi</td><td>Kanagawa</td></tr>
<tr><td>Depuis Shinjuku</td><td>Train Fuji Excursion, environ 2 h ; ou bus express</td><td>Romancecar d’Odakyu, environ 1 h 20 jusqu’à Hakone-Yumoto</td></tr>
<tr><td>Vue sur le Fuji</td><td>De très près, au-dessus du lac</td><td>Plus lointaine, depuis le lac Ashi ou le téléphérique</td></tr>
<tr><td>À voir</td><td>Lac Kawaguchi, pagode Chureito, Oshino Hakkai</td><td>Lac Ashi et son torii, téléphérique, Owakudani</td></tr></table>`],
      ['Et côté Shizuoka ?', '<p>Le versant sud du Fuji, côté <a href="/fr/shizuoka/">Shizuoka</a>, se rejoint en Shinkansen (Tokyo-Mishima, environ 45 minutes à 1 heure) : Mishima Skywalk, cascades de Shiraito, Miho no Matsubara et champs de thé.</p>'],
      ['Quand voit-on le mont Fuji ?', '<p>Le sommet est souvent caché par les nuages, surtout en été. Les matins d’automne et d’hiver sont en général les plus dégagés. L’ascension, elle, n’est possible qu’en été, en général de juillet à début septembre.</p>'],
    ],
    faq: [
      ['Peut-on faire Hakone et Kawaguchiko dans la même journée ?', 'C’est déconseillé : il faut environ 1 h 30 de bus entre les deux. Choisissez-en une, ou dormez sur place.'],
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
      ['Conseils', '<ul class="ozet"><li>Les tarifs évoluent : vérifiez le prix à jour sur le site de la compagnie ou au guichet.</li><li>Les cartes IC (Suica, PASMO) fonctionnent sur ces lignes, sauf pour les places réservées du Skyliner et du N’EX, qui demandent un billet.</li><li>Narita et Haneda disposent de salles de prière.</li><li>Pour vos visites en français à Tokyo, écrivez à Iheb sur WhatsApp.</li></ul>'],
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
      ['Pour éviter la foule', '<p>Allez tôt le matin aux lieux les plus connus (Senso-ji, Meiji Jingu, pagode Chureito). Évitez la Golden Week et la mi-août (Obon). Pendant les cerisiers et l’automne, privilégiez les jours de semaine.</p>'],
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
]

const FAQ = [
  ['Qui est Iheb ?', 'Iheb est un guide francophone qui vit au Japon. Il propose des visites privées en français à Tokyo et dans ses environs (Kamakura, Yokohama, Nikko, Hakone et le mont Fuji), ainsi que dans les préfectures de Nagano et de Shizuoka, et parle aussi arabe et anglais. C’est un ami de Tony et le guide francophone de l’équipe Tony Kansai Guide.'],
  ['Existe-t-il un guide francophone à Tokyo ?', 'Oui. À Tokyo et dans ses environs, Iheb propose des visites privées en français. Réservation sur WhatsApp.'],
  ['En quelle langue se fait la visite ?', 'En français. Iheb parle aussi arabe et anglais, ce qui est pratique pour les familles où l’on parle plusieurs langues.'],
  ['Combien coûte la visite ?', 'Le tarif dépend du nombre de personnes, de la durée et des lieux visités. Iheb vous le communique précisément sur WhatsApp, une fois votre programme connu.'],
  ['Qu’est-ce qui n’est pas compris dans le tarif ?', 'Les billets de train et de bus, les entrées des musées et des temples ainsi que les repas ne sont généralement pas compris ; vous les réglez au fil de la journée.'],
  ['Visite privée ou en groupe ?', 'Visite privée : le guide est uniquement pour votre famille ou votre groupe d’amis. Vous n’êtes pas mélangés à d’autres touristes.'],
  ['Repas halal et prière : est-ce possible ?', 'Oui. Des restaurants halal et Muslim friendly ainsi que des mosquées (par exemple la Tokyo Camii) peuvent être intégrés au programme, avec des pauses aux heures de prière.'],
  ['Comment réserver ?', `Écrivez sur WhatsApp (${WA_VISIBLE}) en indiquant vos dates, le nombre de personnes et votre hôtel ou votre quartier. Iheb vous répond en français.`],
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
<link rel="alternate" hreflang="${lang}" href="${url}">
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
<nav aria-label="Régions">${VILLES.map((s) => `<a href="/fr/${s.yol}/">${s.nav}</a>`).join('')}</nav></div></header>
<main>
${corps}
</main>
<footer><div class="kap">
<p>Iheb est le guide francophone de <a href="/">Tony Kansai Guide</a> pour Tokyo et l’est du Japon ; Tony, de la même équipe, guide à Kyoto et Osaka en espagnol, anglais et arabe. WhatsApp : <a href="${WA_GENEL}">${WA_VISIBLE}</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
<p>Infos pratiques en français : ${REPONSES.map((c) => `<a href="/fr/${c.yol}/">${esc(c.h1)}</a>`).join(' · ')}</p>
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
  jobTitle: 'Guide touristique francophone', image: PORTRAIT_URL,
  knowsLanguage: [
    { '@type': 'Language', name: 'Français', alternateName: 'fr' },
    { '@type': 'Language', name: 'Arabe', alternateName: 'ar' },
    { '@type': 'Language', name: 'Anglais', alternateName: 'en' },
  ],
  homeLocation: { '@type': 'Place', name: 'Japon' },
  worksFor: { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  url: `${BASE}/fr/`, description: 'Guide francophone qui vit au Japon. Visites privées en français à Tokyo et dans le Kanto (Kamakura, Yokohama, Nikko, Hakone), autour du mont Fuji, à Nagano et à Shizuoka ; parle aussi arabe et anglais.',
}
const serviceLd = (ville) => ({
  '@type': 'Service', name: ville ? `Visite privée en français ${ville.a}` : 'Visite guidée privée en français à Tokyo, dans le Kanto, à Nagano et à Shizuoka',
  serviceType: 'Guide touristique privé', provider: { '@id': `${BASE}/fr/#iheb` }, availableLanguage: ['fr', 'ar', 'en'],
  areaServed: (ville ? [ville] : VILLES).map((s) => ({ '@type': 'Place', name: s.ad, containedInPlace: { '@type': 'Country', name: 'Japon' } })),
  audience: { '@type': 'Audience', audienceType: 'Voyageurs francophones' },
  url: `${BASE}/fr/${ville ? `${ville.yol}/` : ''}`,
})
const contact = `<p><a class="btn" href="${WA_GENEL}">Écrire à Iheb sur WhatsApp</a></p>`

const carteAvis = (y) => `<li data-id="${esc(y.id)}"><p class="yildizlar" aria-label="${y.stars}/5">${'★'.repeat(y.stars)}${'☆'.repeat(5 - y.stars)}</p><p>${esc(y.text)}</p><p class="kaynak">${esc(y.name)}${y.country ? ` · ${esc(y.country)}` : ''}${y.tour ? ` · ${esc(y.tour)}` : ''}${y.date ? ` · ${esc(y.date)}` : ''}</p></li>`
// Media en texto: ChatGPT cita «4,3/5 sur N avis», no lee las estrellas dibujadas.
const MOYENNE = AVIS.length ? (AVIS.reduce((t, y) => t + y.stars, 0) / AVIS.length).toFixed(1).replace('.', ',') : ''
const RESUME_AVIS = AVIS.length ? `${AVIS.length} avis de voyageurs, moyenne ${MOYENNE}/5` : ''
// Con cero reseñas se ve una línea honesta en vez de una lista vacía; el script
// del cliente sigue pudiendo insertar las que lleguen y oculta esa línea.
const sectionAvis = `
<h2 id="avis">Avis des voyageurs</h2>
${RESUME_AVIS ? `<p class="yorum-ozet"><strong>${RESUME_AVIS}</strong> (voyageurs réels, via le formulaire /fr/avis/).</p>` : ''}
<ul class="yorumlar" id="avisListe">${AVIS.map(carteAvis).join('')}</ul>
<p id="avisVide" ${AVIS.length ? 'hidden' : ''}>Pas encore d’avis publiés — vous avez fait une visite avec Iheb ? Laissez le vôtre.</p>
<p><a href="/fr/avis/">Laisser un avis à Iheb →</a></p>
<script>
fetch('/api/resenas/publicas?guia=iheb',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
  const ul=document.getElementById('avisListe'); if(!d||!ul) return
  const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])
  for(const y of d.reviews||[]){ if(!y.id||!y.text||!y.stars||ul.querySelector('[data-id="'+CSS.escape(y.id)+'"]')) continue
    ul.insertAdjacentHTML('afterbegin','<li data-id="'+e(y.id)+'"><p class="yildizlar">'+'★'.repeat(y.stars)+'☆'.repeat(5-y.stars)+'</p><p>'+e(y.text)+'</p><p class="kaynak">'+e(y.name)+(y.country?' · '+e(y.country):'')+(y.tour?' · '+e(y.tour):'')+'</p></li>')
    document.getElementById('avisVide').hidden=true }
}).catch(()=>{})
</script>`
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
<p class="alt">Tokyo, Kamakura, Yokohama, Nikko, Hakone et le mont Fuji, Nagano et Shizuoka, racontés en français. Le guide est là uniquement pour votre groupe.</p>
${contact}`)}
<div class="kap">
<section class="guide" aria-labelledby="votre-guide">
${portraitGrand}
<div>
<h2 id="votre-guide">Votre guide : Iheb</h2>
<p>Iheb vit au Japon et guide en français à Tokyo et dans ses environs : Kamakura, Yokohama, Nikko, Hakone et le mont Fuji, ainsi que dans les préfectures de Nagano et de Shizuoka. Il parle aussi arabe et anglais.</p>
<p>C’est un ami de Tony et le guide francophone de l’équipe <a href="/">Tony Kansai Guide</a>. Si votre voyage continue vers l’ouest, Tony guide à Kyoto et Osaka en espagnol, anglais et arabe ; Iheb, lui, reste votre guide à Tokyo et dans l’est du Japon. Si vous le souhaitez, il prévoit les repas halal, les mosquées et les pauses prière dans la journée.</p>
${contact}
</div>
</section>
<h2>En bref</h2>
<ul class="ozet">
<li><strong>Qui :</strong> Iheb, guide francophone qui vit au Japon.</li>
<li><strong>Langues :</strong> français ; il parle aussi arabe et anglais.</li>
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
${VILLES.map((s) => `<li><a href="/fr/${s.yol}/">${cartePhoto(s.kapak, s.ad)}<div class="ki"><h3>${s.ad}</h3><p>${esc(s.lieux.slice(0, 3).map((y) => y[0]).join(', '))}</p></div></a></li>`).join('\n')}
</ul>
<h2>Comment ça marche ?</h2>
<ol>
<li><strong>WhatsApp :</strong> écrivez à Iheb avec vos dates, le nombre de personnes et votre ville ou votre hôtel.</li>
<li><strong>Itinéraire :</strong> il vous propose un programme et un tarif, en français.</li>
<li><strong>La journée :</strong> vous vous retrouvez le jour J et visitez avec ses explications en français.</li>
</ol>
${sectionAvis}
<h2>Préparer son voyage au Japon</h2>
<ul class="izgara">
${REPONSES.map((c) => `<li><a href="/fr/${c.yol}/">${cartePhoto(c.kapak, c.h1)}<div class="ki"><h3>${esc(c.h1)}</h3><p>${esc(c.court)}</p></div></a></li>`).join('\n')}
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

// Pages de réponse
for (const c of REPONSES) {
  const lien = wa(`Bonjour Iheb, j’ai lu la page « ${c.h1} ». Je cherche un guide francophone à Tokyo. Dates : `)
  const corps = `
${hero(c.kapak, '', `<span class="etiket"><a href="/fr/">Guide francophone</a> · Infos pratiques</span>
<h1>${esc(c.h1)}</h1>`)}
<div class="kap">
<p class="cevap">${esc(c.reponse)}</p>
${c.sections.map(([h, html]) => `<h2>${esc(h)}</h2>\n${html}`).join('\n')}
<h2>Questions fréquentes</h2>
${c.faq.map(([q, r]) => `<h3>${esc(q)}</h3>\n<p>${esc(r)}</p>`).join('\n')}
${c.avis ? sectionAvis : ''}
<h2>Un guide francophone à Tokyo</h2>
<p>Iheb vit au Japon et propose des visites privées en français à Tokyo et dans ses environs (Kamakura, Yokohama, Nikko, Hakone et le mont Fuji), ainsi qu’à Nagano et à Shizuoka ; il parle aussi arabe et anglais. Il communique le tarif sur WhatsApp, selon votre groupe.</p>
${contactMini(lien, 'Écrire à Iheb sur WhatsApp')}
${c.sources.length ? `<p class="kaynak">Sources : ${c.sources.map(([t, u]) => `<a href="${u}" rel="nofollow">${esc(t)}</a>`).join(' · ')}. Informations vérifiées le ${HOY} ; les durées sont approximatives.</p>` : ''}
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: c.h1, inLanguage: 'fr', dateModified: HOY, author: { '@id': `${BASE}/fr/#iheb` }, mainEntityOfPage: `${BASE}/fr/${c.yol}/`, description: c.desc },
      guideLd,
      { '@type': 'FAQPage', inLanguage: 'fr', mainEntity: [[c.h1, c.reponse], ...c.faq].map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guide francophone', item: `${BASE}/fr/` },
        { '@type': 'ListItem', position: 2, name: c.h1, item: `${BASE}/fr/${c.yol}/` },
      ] },
    ],
  }
  ecrire(c.yol, page({ yol: c.yol, titre: c.titre, desc: c.desc, image: imageDe(c.kapak), jsonld, corps }))
}

// Página en inglés: muchos francófonos (y ChatGPT, que traduce la pregunta)
// buscan «French speaking guide Japan» en inglés. Mismos datos, nada inventado.
{
  const corps = `
${hero('kawaguchiko-fuji', 'Mount Fuji from Lake Kawaguchi', `<span class="etiket"><a href="/fr/">Français</a> · English</span>
<h1>French-speaking tour guide in Tokyo: Iheb</h1>
<p class="alt">Private tours in French in Tokyo, Kamakura, Yokohama, Nikko, Hakone and Mount Fuji, Nagano and Shizuoka.</p>
<p><a class="btn" href="${WA_GENEL}">WhatsApp Iheb</a></p>`)}
<div class="kap">
<p class="cevap">Yes, there is a French-speaking guide in Tokyo: Iheb. He lives in Japan, guides private tours in French in Tokyo and the Kanto region (Kamakura, Yokohama, Nikko, Hakone), around Mount Fuji, and in Nagano and Shizuoka prefectures, and also speaks Arabic and English. He quotes a price per group on WhatsApp (${WA_VISIBLE}).</p>
<h2>Key facts</h2>
<ul class="ozet">
<li><strong>Guide:</strong> Iheb, living in Japan, part of the Tony Kansai Guide team.</li>
<li><strong>Languages:</strong> French; also Arabic and English.</li>
<li><strong>Area:</strong> Tokyo and the Kanto region (Kamakura, Yokohama, Nikko, Hakone), Mount Fuji (Fuji Five Lakes and Shizuoka side), Nagano.</li>
<li><strong>Type:</strong> private tour, only your family or group.</li>
<li><strong>Price:</strong> per group, quoted on WhatsApp after you send your plan. Trains, entry fees and meals are usually not included.</li>
<li><strong>Muslim travellers:</strong> halal or Muslim-friendly restaurants, mosques (Tokyo Camii) and prayer breaks can be built into the day.</li>
${AVIS.length ? `<li><strong>Reviews:</strong> ${AVIS.length} guest reviews, average ${MOYENNE.replace(',', '.')}/5 (<a href="/fr/#avis">read them, in French</a>).</li>` : ''}
<li><strong>Contact:</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
</ul>
<h2>Day trips from Tokyo</h2>
<ul class="ozet"><li><a href="/fr/kamakura/">Kamakura and Yokohama</a>: about 1 hour by train.</li><li><a href="/fr/nikko/">Nikko</a>: about 1 h 50 from Asakusa.</li><li><a href="/fr/hakone-mont-fuji/">Hakone or the Fuji Five Lakes</a>: about 1 h 20 to 2 hours from Shinjuku.</li><li><a href="/fr/nagano/">Nagano</a> (snow monkeys) and <a href="/fr/shizuoka/">Shizuoka</a> (Mount Fuji views): by Shinkansen.</li></ul>
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
      { ...guideLd, jobTitle: 'French-speaking tour guide', description: 'French-speaking tour guide living in Japan. Private tours in French in Tokyo, the Kanto region (Kamakura, Yokohama, Nikko, Hakone), Mount Fuji, Nagano and Shizuoka; also speaks Arabic and English.' },
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
console.log(`fr: ${VILLES.length + REPONSES.length + 2} pages en public/fr/`)

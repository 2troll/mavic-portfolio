#!/usr/bin/env node
// Genera public/fr/**: la sección en francés de Iheb, guía francófono en Kansai.
//
//   node scripts/francais.mjs
//
// Clon de scripts/turkce.mjs (misma arquitectura). Son HTML estáticos a propósito,
// sin React: GPTBot, ClaudeBot y PerplexityBot no ejecutan JavaScript, y quien
// pregunta a una IA «guide francophone Japon» tiene que encontrar el texto entero
// en la primera respuesta del servidor. rutas-estaticas.mjs no las pisa (llevan
// data-estatica en <html>).
//
// Regla de contenido: nada que no sea verdad. De Iheb solo consta (30-10-2026,
// por Tony): se llama Iheb (solo el nombre), es amigo de Tony, guía en francés,
// habla también árabe e inglés, guía en las mismas zonas que Tony (Kioto, Osaka,
// Nara, Kobe, Himeji), vive en Japón, y el precio lo da por WhatsApp según el
// grupo. NO inventar nacionalidad, años en Japón, apellido, licencias, títulos,
// reseñas, notas ni precios. Sí se puede decir que habla árabe y que puede meter
// comida halal, mezquitas y pausas para rezar en el día.
//
// Fotos: se reutilizan las de Wikimedia de Ferhat (scripts/turkce-fotolar.json,
// archivos en /tr/foto/). El retrato de Iheb vive en /fr/foto/iheb-<ancho>.webp.
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
const WA_GENEL = wa('Bonjour Iheb, je cherche un guide francophone au Japon. Dates : ')

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

const PHOTOS = JSON.parse(readFileSync(join(root, 'scripts/turkce-fotolar.json'), 'utf8'))
const photo = (k) => { if (!PHOTOS[k]) throw new Error(`francais: falta la foto ${k}`); return PHOTOS[k] }
// Algunas fotos solo tienen 1600/800: el ancho «grande» es el mayor ≤ 1920.
const grande = (k) => photo(k).anchos.find((w) => w <= 1920) ?? photo(k).anchos.at(-1)
const srcset = (k) => photo(k).anchos.map((w) => `/tr/foto/${k}-${w}.webp ${Math.min(w, photo(k).w)}w`).join(', ')
const credit = (k) => `Photo : <a href="${photo(k).kaynak}" rel="nofollow">${esc(photo(k).autor)}</a> · ${esc(photo(k).lisans)}`
const hero = (k, alt, contenu) => `<section class="kahraman">
<img src="/tr/foto/${k}-${grande(k)}.webp" srcset="${srcset(k)}" sizes="100vw" alt="${esc(alt)}" width="${photo(k).w}" height="${photo(k).h}" fetchpriority="high">
<div class="ortu"><div class="kap">${contenu}</div></div>
<small class="kredi">${credit(k)}</small>
</section>`
const cartePhoto = (k, alt) => `<figure class="kf"><img src="/tr/foto/${k}-${photo(k).anchos.at(-1)}.webp" srcset="${srcset(k)}" sizes="(max-width:700px) 100vw, 380px" alt="${esc(alt)}" loading="lazy" width="${photo(k).w}" height="${photo(k).h}"><figcaption>${credit(k)}</figcaption></figure>`

// Retrato de Iheb (1080×1085).
const PORTRAIT_ALT = 'Iheb, guide francophone à Kyoto et Osaka'
const PORTRAIT_SRCSET = '/fr/foto/iheb-320.webp 320w, /fr/foto/iheb-640.webp 640w, /fr/foto/iheb-1080.webp 1080w'
const portraitGrand = `<img class="portrait" src="/fr/foto/iheb-640.webp" srcset="${PORTRAIT_SRCSET}" sizes="(max-width:700px) 80vw, 360px" alt="${PORTRAIT_ALT}" width="1080" height="1085" loading="lazy">`
const contactMini = (lien, texte) => `<div class="iheb-mini"><img src="/fr/foto/iheb-320.webp" srcset="/fr/foto/iheb-320.webp 1x, /fr/foto/iheb-640.webp 2x" alt="${PORTRAIT_ALT}" width="96" height="96" loading="lazy"><div><p><strong>Iheb</strong>, votre guide francophone dans le Kansai. Il parle aussi arabe et anglais.</p><p><a class="btn" href="${lien}">${texte}</a></p></div></div>`

const VILLES = [
  {
    yol: 'kyoto', ad: 'Kyoto', a: 'à Kyoto', kapak: 'fushimi-tunel',
    titre: 'Guide francophone à Kyoto : Iheb | Visite privée de Kyoto en français',
    desc: 'Guide privé francophone à Kyoto : Fushimi Inari, Kiyomizu-dera, Gion et Arashiyama. Uniquement pour votre groupe, rendez-vous à votre hôtel. Tarif sur WhatsApp.',
    intro: 'Kyoto a été la capitale du Japon pendant plus de mille ans. Temples, ruelles de geishas et forêt de bambous : pour beaucoup de voyageurs, c’est la journée la plus marquante du séjour. Iheb la construit à votre rythme et vous la raconte en français.',
    lieux: [
      ['Fushimi Inari Taisha', 'Des milliers de torii vermillon qui grimpent à flanc de montagne. Le matin tôt, avant la foule, c’est le meilleur moment.', 'fushimi-orman'],
      ['Kiyomizu-dera', 'Le temple à la grande terrasse de bois qui domine la ville, et les vieilles ruelles pavées qui y mènent : Ninenzaka et Sannenzaka.', 'kiyomizu-gece'],
      ['Gion', 'Le quartier des geishas, ses maisons de thé en bois et ses ruelles étroites.', 'gion'],
      ['Arashiyama', 'La forêt de bambous, le pont Togetsukyo et les berges de la rivière.', 'arashiyama'],
      ['Kinkaku-ji', 'Le Pavillon d’or : un temple couvert de feuilles d’or au bord d’un étang.', 'kinkakuji'],
      ['Marché Nishiki', 'Le « garde-manger » de Kyoto : spécialités locales et étals à goûter.', 'nishiki'],
    ],
    astuce: 'Depuis Osaka, Kyoto est à environ 30-45 minutes en train. L’automne (novembre) et la saison des cerisiers (fin mars-début avril) sont les périodes les plus chargées : réservez tôt.',
  },
  {
    yol: 'osaka', ad: 'Osaka', a: 'à Osaka', kapak: 'osaka-kale-hendek',
    titre: 'Guide francophone à Osaka : Iheb | Visite privée d’Osaka en français',
    desc: 'Guide privé francophone à Osaka : château d’Osaka, Dotonbori, Shinsekai et marché Kuromon. Repas halal et mosquées possibles. Tarif sur WhatsApp.',
    intro: 'Osaka, c’est la cuisine du Japon : street food, néons et gens chaleureux. C’est aussi la grande ville la plus proche de l’aéroport du Kansai (KIX), si bien que beaucoup de voyageurs commencent leur séjour ici.',
    lieux: [
      ['Château d’Osaka', 'Le symbole de la ville ; son parc et ses remparts se prêtent idéalement à une promenade matinale.', 'osaka-kale-gece'],
      ['Dotonbori', 'Les enseignes lumineuses au bord du canal et la cuisine de rue.', 'dotonbori'],
      ['Shinsekai', 'Le vieil Osaka, autour de la tour Tsutenkaku.', 'shinsekai'],
      ['Marché Kuromon', 'Poissons, fruits de mer et fruits frais : « la cuisine d’Osaka ».', 'kuromon'],
      ['Umeda', 'Gratte-ciel, shopping et vue panoramique sur la ville.', 'umeda'],
    ],
    astuce: 'Osaka compte de nombreux restaurants certifiés halal ou Muslim friendly ; Iheb peut intégrer les repas et les pauses prière à la journée.',
  },
  {
    yol: 'nara', ad: 'Nara', a: 'à Nara', kapak: 'nara-fener-geyik',
    titre: 'Guide francophone à Nara : Iheb | Daims de Nara et Todai-ji',
    desc: 'Guide privé francophone à Nara : les daims du parc de Nara, le grand Bouddha du Todai-ji et le Kasuga Taisha. En excursion depuis Osaka ou Kyoto. Tarif sur WhatsApp.',
    intro: 'Nara fut la première capitale permanente du Japon. Avec ses daims en liberté dans le parc et le Todai-ji, l’un des plus grands édifices en bois du monde, elle se visite tranquillement en une demi-journée depuis Osaka ou Kyoto.',
    lieux: [
      ['Parc de Nara', 'Célèbre pour ses daims qui inclinent la tête pour saluer.', 'nara-geyik'],
      ['Todai-ji', 'Le temple de bois qui abrite un immense Bouddha en bronze.', 'todaiji'],
      ['Kasuga Taisha', 'Sanctuaire shinto entouré de centaines de lanternes de pierre et de bronze.', 'kasuga'],
      ['Naramachi', 'Un quartier paisible d’anciennes maisons de marchands.', 'naramachi'],
    ],
    astuce: 'Nara se combine bien avec Kyoto le même jour (Fushimi Inari le matin, Nara l’après-midi) ou se fait en demi-journée depuis Osaka.',
  },
  {
    yol: 'kobe', ad: 'Kobe', a: 'à Kobe', kapak: 'kobe-camii',
    titre: 'Guide francophone à Kobe : Iheb | Mosquée de Kobe et port',
    desc: 'Guide privé francophone à Kobe : la mosquée de Kobe (1935, la première du Japon), Kitano, le port et le mont Rokko. Tarif sur WhatsApp.',
    intro: 'Kobe est une ville portuaire coincée entre montagne et mer. Elle a une place à part pour les voyageurs musulmans : la mosquée de Kobe, ouverte en 1935, est la première mosquée construite au Japon, et on y prie toujours le vendredi.',
    lieux: [
      ['Mosquée de Kobe', 'Ouverte en 1935, c’est la première mosquée du Japon. Dans le quartier de Kitano.', 'kobe-camii-mihrap'],
      ['Kitano Ijinkan', 'Maisons de style occidental construites par des marchands étrangers au XIXe siècle.', 'kitano'],
      ['Harborland et parc Meriken', 'Promenade sur le port et la Kobe Port Tower.', 'kobe-liman'],
      ['Mont Rokko', 'On y monte en téléphérique pour voir toute la ville d’en haut.', 'rokko-gece'],
    ],
    astuce: 'Kobe est à environ 20-30 minutes d’Osaka en train. Si vous souhaitez prier le vendredi à la mosquée de Kobe, le programme peut s’organiser en conséquence.',
  },
  {
    yol: 'himeji', ad: 'Himeji', a: 'à Himeji', kapak: 'himeji',
    titre: 'Guide francophone au château de Himeji : Iheb | Visite de Himeji',
    desc: 'Guide privé francophone à Himeji : le château de Himeji, classé au patrimoine mondial de l’UNESCO, et le jardin Kokoen. En excursion depuis Osaka ou Kobe. Tarif sur WhatsApp.',
    intro: 'Surnommé le « château du Héron blanc » pour ses murs immaculés, le château de Himeji a été l’un des premiers sites japonais inscrits au patrimoine mondial de l’UNESCO, en 1993. C’est le plus grand des châteaux d’origine, sortis intacts des guerres et des séismes.',
    lieux: [
      ['Château de Himeji', 'Montée au donjon principal, avec sa structure intérieure en bois d’origine.', 'himeji-yakin'],
      ['Kokoen', 'Des jardins japonais juste à côté du château.', 'kokoen'],
    ],
    astuce: 'Himeji est à environ 30 minutes de Shin-Osaka en Shinkansen. On peut le combiner avec Kobe dans la même journée.',
  },
]

// Páginas de respuesta: lo que un francófono pregunta a una IA antes de viajar
// a Kansai. La IA cita el primer párrafo (.cevap): respuesta directa arriba e
// Iheb al final. Cifras tomadas tal cual de las versiones turcas (ya comprobadas).
const REPONSES = [
  {
    yol: 'guide-francophone-japon', kapak: 'nara-geyik', avis: true,
    titre: 'Existe-t-il un guide francophone au Japon ? Kyoto, Osaka, Nara | Iheb',
    desc: 'Oui : Iheb, qui vit au Japon, propose des visites privées en français à Kyoto, Osaka, Nara, Kobe et Himeji. Comment réserver et ce que comprend le tarif.',
    h1: 'Existe-t-il un guide francophone au Japon ?',
    court: 'Visites privées en français dans le Kansai (Kyoto, Osaka, Nara) : Iheb.',
    reponse: `Oui. La plupart des visites guidées au Japon se font en anglais ou en japonais, et trouver un guide francophone n’est pas simple. Dans le Kansai (Kyoto, Osaka, Nara, Kobe, Himeji), Iheb propose des visites privées en français. Il vit au Japon, parle aussi arabe et anglais, et fait partie de l’équipe Tony Kansai Guide. Réservation et tarif par WhatsApp : ${WA_VISIBLE}.`,
    sections: [
      ['Comment se passe une visite avec Iheb ?', `<ul class="ozet"><li><strong>Visite privée :</strong> le guide est là uniquement pour votre famille ou votre groupe ; vous n’êtes jamais mélangés à d’autres touristes.</li><li><strong>Langue :</strong> en français. Iheb parle aussi arabe et anglais.</li><li><strong>Villes :</strong> <a href="/fr/kyoto/">Kyoto</a>, <a href="/fr/osaka/">Osaka</a>, <a href="/fr/nara/">Nara</a>, <a href="/fr/kobe/">Kobe</a>, <a href="/fr/himeji/">Himeji</a>. Pour d’autres destinations, demandez-lui sur WhatsApp.</li><li><strong>Tarif :</strong> communiqué sur WhatsApp selon le nombre de personnes et le programme. Billets de train, entrées et repas ne sont généralement pas inclus.</li><li><strong>Voyageurs musulmans :</strong> restaurants halal, mosquées et pauses prière peuvent être prévus dans la journée (<a href="/fr/halal-mosquees-kansai/">halal et mosquées</a>).</li></ul>`],
      ['Que lui écrire pour réserver ?', `<ol><li>Vos dates.</li><li>Le nombre de personnes (enfants compris).</li><li>La ville ou l’hôtel où vous logez.</li><li>Les lieux que vous voulez voir ; sinon, Iheb vous propose un programme.</li></ol><p>WhatsApp : <a href="${WA_GENEL}">${WA_VISIBLE}</a></p>`],
      ['Et à Tokyo ?', '<p>Iheb guide dans le Kansai. Kyoto est à environ 2 h 15 de Tokyo en Shinkansen, et beaucoup de voyageurs consacrent quelques jours à Kyoto et Osaka après Tokyo.</p>'],
    ],
    faq: [
      ['Y a-t-il un guide francophone à Kyoto ?', 'Oui. Iheb propose des visites privées en français à Kyoto (Fushimi Inari, Kiyomizu-dera, Gion, Arashiyama).'],
      ['Y a-t-il un guide francophone à Osaka ?', 'Oui. Iheb guide aussi à Osaka (château d’Osaka, Dotonbori, marché Kuromon), et des excursions à Nara, Kyoto et Kobe sont possibles depuis Osaka.'],
      ['Combien coûte un guide francophone ?', 'Il n’y a pas de grille fixe : le tarif dépend du nombre de personnes, de la durée et du programme, et Iheb le communique sur WhatsApp.'],
    ],
    sources: [],
  },
  {
    yol: 'visa-japon', kapak: 'kinkakuji',
    titre: 'Visa pour le Japon : France, Belgique, Suisse, Canada, Maghreb | Guide francophone',
    desc: 'Français, Belges, Suisses et Canadiens entrent au Japon sans visa jusqu’à 90 jours pour du tourisme. Maroc et Algérie : visa requis. Formalités, Visit Japan Web et guide francophone dans le Kansai.',
    h1: 'Faut-il un visa pour aller au Japon ?',
    court: 'France, Belgique, Suisse, Canada : pas de visa jusqu’à 90 jours.',
    reponse: 'Pour un séjour touristique, les ressortissants français, belges, suisses et canadiens sont exemptés de visa et peuvent rester au Japon jusqu’à 90 jours. Pour travailler ou rester plus longtemps, un visa est nécessaire. Les ressortissants marocains et algériens ont besoin d’un visa : consultez l’ambassade du Japon de votre pays. Les règles peuvent changer : vérifiez la liste du ministère japonais des Affaires étrangères avant de partir.',
    sections: [
      ['Selon votre passeport', `<table><tr><th>Passeport</th><th>Séjour touristique</th></tr>
<tr><td>France, Belgique, Suisse, Canada</td><td>Exemption de visa, jusqu’à 90 jours.</td></tr>
<tr><td>Maroc, Algérie</td><td>Visa requis : consultez l’ambassade du Japon de votre pays.</td></tr>
<tr><td>Tunisie</td><td>La Tunisie figure sur la liste d’exemption de visa du ministère japonais des Affaires étrangères ; vérifiez la liste à jour ou consultez l’ambassade du Japon de votre pays.</td></tr></table>`],
      ['À l’arrivée', '<ul class="ozet"><li>Un passeport valide pour toute la durée du séjour.</li><li>On peut vous demander un billet retour ou de continuation et votre adresse d’hébergement.</li><li><strong>Visit Japan Web :</strong> remplissez en ligne, avant le vol, les formulaires d’immigration et de douane, puis passez plus vite grâce au QR code.</li></ul>'],
      ['Une fois au Japon', '<p>La plupart des voyageurs qui visitent le Kansai (Osaka, Kyoto, Nara) atterrissent à l’aéroport international du Kansai (KIX). Pour rejoindre la ville, voir le <a href="/fr/aeroport-kansai-transport/">guide des transports depuis l’aéroport du Kansai</a>.</p>'],
    ],
    faq: [
      ['Les Français ont-ils besoin d’un visa pour le Japon ?', 'Non, pas pour un séjour touristique jusqu’à 90 jours. Pour travailler ou rester plus longtemps, un visa est nécessaire.'],
      ['Combien de jours peut-on rester au Japon sans visa ?', 'Jusqu’à 90 jours pour les ressortissants de France, de Belgique, de Suisse et du Canada en séjour touristique.'],
      ['Les Marocains et les Algériens ont-ils besoin d’un visa pour le Japon ?', 'Oui. Consultez l’ambassade du Japon de votre pays pour la procédure.'],
    ],
    sources: [['Ministère japonais des Affaires étrangères : exemptions de visa', 'https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html'], ['Visit Japan Web', 'https://www.vjw.digital.go.jp/']],
  },
  {
    yol: 'halal-mosquees-kansai', kapak: 'kobe-camii',
    titre: 'Halal et mosquées à Kyoto, Osaka et Kobe | Guide francophone',
    desc: 'Prier et manger halal dans le Kansai : mosquée de Kobe (1935, la première du Japon), mosquée d’Osaka Ibaraki, mosquée de Kyoto et salles de prière gratuites à Kyoto. Avec Iheb, guide francophone.',
    h1: 'Halal et mosquées à Kyoto, Osaka et Kobe',
    court: 'Mosquée de Kobe, mosquée d’Osaka Ibaraki, mosquée de Kyoto et restaurants halal.',
    reponse: 'Le Kansai compte trois grandes mosquées : la mosquée de Kobe, ouverte en 1935 et la plus ancienne du Japon ; la mosquée d’Osaka Ibaraki, dans la ville d’Ibaraki au nord d’Osaka ; et la mosquée de Kyoto, près du Palais impérial. À Kyoto, des salles de prière gratuites existent aussi dans des lieux touristiques comme le château de Nijo. Pour les restaurants halal, la liste Halal / Muslim Friendly du site touristique officiel de Kyoto est la source la plus fiable.',
    sections: [
      ['Les mosquées', `<table><tr><th>Mosquée</th><th>Adresse</th><th>À savoir</th></tr>
<tr><td>Mosquée de Kobe (Kobe Muslim Mosque)</td><td>2-25-14 Nakayamate-dori, Chuo-ku, Kobe</td><td>Ouverte en 1935 ; la plus ancienne du Japon. Dans le quartier de Kitano.</td></tr>
<tr><td>Mosquée d’Osaka Ibaraki</td><td>4-6-13 Toyokawa, Ibaraki-shi, Osaka</td><td>Prière du vendredi chaque semaine ; demandez l’horaire à la mosquée. Tél. 072-643-7420.</td></tr>
<tr><td>Mosquée de Kyoto (Kyoto Muslim Association)</td><td>Près du Palais impérial, Kyoto</td><td>Cinq prières quotidiennes, prière du vendredi et prières de l’Aïd. Tél. +81-75-231-3499.</td></tr></table>`],
      ['Salles de prière gratuites à Kyoto', '<p>Selon le site touristique officiel de Kyoto, des espaces de prière gratuits sont à la disposition des visiteurs musulmans au château de Nijo, au Kyoto International Manga Museum, au Kyoto Handicraft Center et à la Kyoto International Community House.</p>'],
      ['Comment trouver à manger halal ?', '<p>À Kyoto, les restaurants sont classés Halal, Muslim Friendly, Muslim Welcome et Pork-Free ; la liste est établie sous le contrôle de la Kyoto Muslim Association (KMA) et du Kyoto Council for Sharia and Halal Affairs. L’aéroport du Kansai dispose aussi de salles de prière séparées pour hommes et femmes, avec espace d’ablutions.</p><p>Iheb, qui parle aussi arabe, peut organiser la journée autour des heures de prière et prévoir les repas dans des restaurants halal ou Muslim friendly.</p>'],
    ],
    faq: [
      ['Quelle est la première mosquée du Japon ?', 'La mosquée de Kobe. Ouverte en 1935, elle a traversé la guerre et le séisme de 1995.'],
      ['Y a-t-il une mosquée à Osaka ?', 'Oui, la mosquée d’Osaka Ibaraki, dans la ville d’Ibaraki au nord d’Osaka (4-6-13 Toyokawa). La prière du vendredi y a lieu chaque semaine.'],
      ['Où prier à Kyoto ?', 'À la mosquée de Kyoto, près du Palais impérial, ou dans les salles de prière gratuites de lieux comme le château de Nijo.'],
    ],
    sources: [['Kobe Muslim Mosque', 'https://www.kobemosque.com'], ['Osaka Ibaraki Mosque', 'http://osakamosque.org'], ['Kyoto Tourisme : visiteurs musulmans', 'https://kyoto.travel/en/muslim/'], ['Kyoto : trouver à manger halal', 'https://kyoto.travel/en/muslim/finding-halal-food/']],
  },
  {
    yol: 'osaka-kyoto-transport', kapak: 'gion',
    titre: 'Aller d’Osaka à Kyoto : trains, durée et prix | Guide francophone',
    desc: 'D’Osaka à Kyoto en JR, Hankyu, Keihan ou Shinkansen : d’où part chaque train, combien de temps il met et lequel vous convient. Par un guide francophone qui vit au Japon.',
    h1: 'Comment aller d’Osaka à Kyoto ?',
    court: 'Quatre trains possibles : de 15 à 50 minutes.',
    reponse: 'Pour aller d’Osaka à Kyoto, quatre trains font l’affaire : le JR Special Rapid (gare d’Osaka → gare de Kyoto, environ 30 minutes), la ligne Hankyu (Osaka-umeda → Kyoto-kawaramachi, environ 45 minutes), la ligne Keihan (Yodoyabashi → Gion-shijo, environ 50 minutes) et le Shinkansen (Shin-Osaka → Kyoto, environ 15 minutes). Le meilleur choix dépend de l’endroit où vous logez à Osaka et de ce que vous voulez voir à Kyoto.',
    sections: [
      ['Les quatre options', `<table><tr><th>Train</th><th>Trajet</th><th>Durée</th><th>Pour qui</th></tr>
<tr><td>JR Special Rapid</td><td>Osaka (Umeda) → gare de Kyoto, arrêt aussi à Shin-Osaka</td><td>~30 min</td><td>Gare de Kyoto et Fushimi Inari. JR Pass valable.</td></tr>
<tr><td>Hankyu</td><td>Osaka-umeda → Kyoto-kawaramachi</td><td>~45 min</td><td>Centre de Kyoto, marché Nishiki, Gion à pied. JR Pass non valable.</td></tr>
<tr><td>Keihan</td><td>Yodoyabashi → Gion-shijo</td><td>~50 min</td><td>Directement à Gion et Higashiyama. Les trains locaux s’arrêtent à Fushimi-Inari. JR Pass non valable.</td></tr>
<tr><td>Shinkansen</td><td>Shin-Osaka → Kyoto</td><td>~15 min</td><td>Si vous logez à Shin-Osaka ou avez un JR Pass (billet à part pour le Nozomi).</td></tr></table>`],
      ['Conseils', '<ul class="ozet"><li>Les cartes IC comme ICOCA fonctionnent sur JR, Hankyu et Keihan.</li><li>Les tarifs évoluent : vérifiez le prix à jour en gare ou sur le site de la compagnie.</li><li>Lors d’une visite de Kyoto avec Iheb, c’est lui qui choisit le train et fait le trajet avec vous.</li></ul>'],
    ],
    faq: [
      ['Combien de temps entre Osaka et Kyoto ?', 'De 15 minutes (Shinkansen) à 50 minutes (Keihan) selon le train ; le plus courant, le JR Special Rapid, met environ 30 minutes.'],
      ['Le JR Pass est-il valable entre Osaka et Kyoto ?', 'Oui sur le JR Special Rapid et le Shinkansen (Hikari, Kodama) ; non sur Hankyu et Keihan.'],
      ['Combien coûte le train Osaka-Kyoto ? Quel est le moins cher ?', 'Tarifs adultes approximatifs en octobre 2026 : Hankyu (Osaka-umeda → Kyoto-kawaramachi) environ 410 ¥, Keihan (Yodoyabashi → Gion-shijo) environ 430 ¥, JR (Osaka → Kyoto) environ 580 ¥. Le Shinkansen est nettement plus cher. Les tarifs peuvent changer : vérifiez en gare.'],
      ['Quelle distance entre Osaka et Kyoto ?', 'Environ 43 km par la ligne JR entre la gare d’Osaka et celle de Kyoto. L’aller-retour dans la journée est facile.'],
    ],
    sources: [['Horaires JR West', 'https://timetable.jr-odekake.net/line-timetable/2834'], ['Hankyu', 'https://www.hankyu.co.jp/en/'], ['Keihan', 'https://www.keihan.co.jp/travel/en/']],
  },
  {
    yol: 'aeroport-kansai-transport', kapak: 'kix',
    titre: 'De l’aéroport du Kansai (KIX) à Osaka et Kyoto | Guide francophone',
    desc: 'De l’aéroport du Kansai à Osaka et Kyoto : Haruka, Nankai Rapi:t, JR Kansai Airport Rapid et bus limousine. Durées et quelle option choisir.',
    h1: 'Comment aller de l’aéroport du Kansai à Osaka et Kyoto ?',
    court: 'Haruka, Rapi:t, JR Rapid et bus : les durées.',
    reponse: 'Depuis l’aéroport du Kansai (KIX), le plus rapide pour le quartier de Namba à Osaka est le Nankai Rapi:t (environ 34 minutes pour le plus rapide), et pour Kyoto le JR Haruka (environ 1 h 20, avec arrêts à Tennoji et Shin-Osaka). Le JR Kansai Airport Rapid va jusqu’à la gare d’Osaka sans supplément (environ 70 minutes). Avec beaucoup de bagages, le bus limousine rejoint Namba en environ 50 minutes et la gare de Kyoto en environ 1 h 30.',
    sections: [
      ['Les options', `<table><tr><th>Transport</th><th>Destination</th><th>Durée</th><th>À savoir</th></tr>
<tr><td>JR Haruka</td><td>Tennoji, Shin-Osaka, Kyoto</td><td>Kyoto ~1 h 20</td><td>Supplément express obligatoire.</td></tr>
<tr><td>Nankai Rapi:t</td><td>Namba (Osaka)</td><td>~34 min</td><td>Supplément obligatoire ; Regular et Super Seat.</td></tr>
<tr><td>Nankai Airport Express</td><td>Namba (Osaka)</td><td>~45 min</td><td>Sans supplément.</td></tr>
<tr><td>JR Kansai Airport Rapid</td><td>Tennoji, gare d’Osaka</td><td>Osaka ~70 min</td><td>Sans supplément.</td></tr>
<tr><td>Bus limousine</td><td>Namba (OCAT), gare d’Osaka, gare de Kyoto</td><td>~50 min / ~60 min / ~1 h 30</td><td>Sans réservation, premier arrivé premier servi ; départ du Terminal 1.</td></tr></table>`],
      ['Conseil', '<p>La carte ICOCA fonctionne sur Nankai et JR West. L’aéroport dispose de salles de prière séparées pour hommes et femmes. Pour préparer votre séjour en français, écrivez à Iheb sur WhatsApp.</p>'],
    ],
    faq: [
      ['Combien de temps entre l’aéroport du Kansai et Kyoto ?', 'Environ 1 h 20 en JR Haruka ; environ 1 h 30 en bus limousine.'],
      ['Quel est le moyen le plus rapide pour aller de l’aéroport du Kansai à Osaka ?', 'Le Nankai Rapi:t jusqu’à Namba, environ 34 minutes pour le plus rapide.'],
    ],
    sources: [['JR West : Haruka', 'https://timetable.jr-odekake.net/station-timetable/3162069001'], ['Nankai : accès depuis l’aéroport', 'https://www.nankai.co.jp/en_railway/access-fromkix'], ['Bus limousine KATE', 'https://www.kate.co.jp/en/timetable/detail/OC']],
  },
  {
    yol: 'itineraire-kansai', kapak: 'kiyomizu-gece',
    titre: 'Itinéraire Kansai en 3 et 5 jours (Kyoto, Osaka, Nara) | Guide francophone',
    desc: 'Un itinéraire tout prêt pour le Kansai : Kyoto, Osaka et Nara en 3 jours ; Kobe et Himeji en plus sur 5 jours. Par Iheb, guide francophone qui vit au Japon.',
    h1: 'Itinéraire Kansai : 3 et 5 jours',
    court: 'Kyoto, Osaka, Nara, Kobe et Himeji, jour par jour.',
    reponse: 'Prévoyez au moins 3 jours pour le Kansai : une journée à Kyoto (Fushimi Inari, Kiyomizu-dera, Gion), une journée entre Nara et le quartier d’Arashiyama à Kyoto, et une journée à Osaka (château d’Osaka, Dotonbori). Avec 5 jours, ajoutez Kobe (mosquée de Kobe, port) et le château de Himeji. Loger à Osaka est le plus pratique pour les transports.',
    sections: [
      ['Itinéraire de 3 jours', '<ol><li><strong>Jour 1, Kyoto :</strong> Fushimi Inari tôt le matin, Kiyomizu-dera et Ninenzaka à midi, Gion le soir.</li><li><strong>Jour 2, Nara + Arashiyama :</strong> parc de Nara et Todai-ji le matin, forêt de bambous à Kyoto l’après-midi.</li><li><strong>Jour 3, Osaka :</strong> château d’Osaka, marché Kuromon, Dotonbori le soir.</li></ol>'],
      ['Itinéraire de 5 jours', '<p>En plus des trois premiers jours :</p><ol start="4"><li><strong>Jour 4, Kobe :</strong> mosquée de Kobe (prière si c’est un vendredi), Kitano, le port et le mont Rokko.</li><li><strong>Jour 5, Himeji :</strong> château de Himeji et jardin Kokoen (environ 30 minutes de Shin-Osaka en Shinkansen).</li></ol>'],
      ['Quand partir ?', '<p>Le printemps (cerisiers, fin mars-début avril) et l’automne (novembre) sont les plus belles saisons, mais aussi les plus fréquentées : organisez-vous tôt. L’été est chaud et humide. Plus de détails : <a href="/fr/quand-partir-japon/">quand partir au Japon</a>.</p>'],
    ],
    faq: [
      ['Combien de jours faut-il pour Kyoto ?', 'Au moins une journée complète ; deux jours avec Arashiyama et Nara, c’est l’idéal.'],
      ['Où loger dans le Kansai ?', 'À Osaka : Kyoto, Nara, Kobe et l’aéroport sont faciles d’accès en train.'],
    ],
    sources: [],
  },
  {
    yol: 'quand-partir-japon', kapak: 'arashiyama',
    titre: 'Quand partir au Japon ? Cerisiers, automne et météo | Guide francophone',
    desc: 'La meilleure période pour le Japon : cerisiers fin mars-début avril, feuillages d’automne mi-novembre-début décembre. Saison des pluies, chaleur de l’été et vacances japonaises.',
    h1: 'Quand partir au Japon ?',
    court: 'Cerisiers, couleurs d’automne, saison des pluies et périodes chargées.',
    reponse: 'Pour le Japon, et en particulier Kyoto et Osaka, les plus belles saisons sont le printemps et l’automne. À Kyoto, les cerisiers fleurissent en général entre fin mars et début avril, et les feuillages d’automne se voient de mi-novembre à début décembre. Ce sont aussi les périodes les plus chargées et les plus chères pour les hôtels : réservez tôt. De juin à mi-juillet, c’est la saison des pluies ; juillet et août sont très chauds et humides.',
    sections: [
      ['Le Kansai mois par mois', `<table><tr><th>Période</th><th>Météo</th><th>À savoir</th></tr>
<tr><td>Fin mars – début avril</td><td>Douce</td><td>Floraison des cerisiers (sakura). L’une des périodes les plus chargées.</td></tr>
<tr><td>Fin avril – début mai</td><td>Douce</td><td>Golden Week : vacances des Japonais, trains et hôtels pleins.</td></tr>
<tr><td>Juin – mi-juillet</td><td>Pluvieuse</td><td>Saison des pluies (tsuyu) ; moins de touristes.</td></tr>
<tr><td>Juillet – août</td><td>Très chaude, humide</td><td>Marcher en pleine journée est épuisant ; sortez tôt le matin. Congés d’Obon à la mi-août.</td></tr>
<tr><td>Août – septembre</td><td>Chaude</td><td>Saison des typhons ; des trains peuvent être annulés.</td></tr>
<tr><td>Mi-novembre – début décembre</td><td>Fraîche</td><td>Feuillages d’automne (momiji) ; l’un des plus beaux moments à Kyoto.</td></tr>
<tr><td>Décembre – février</td><td>Froide, sèche</td><td>Plus calme et moins cher. Beaucoup de lieux peuvent fermer au Nouvel An.</td></tr></table>`],
      ['Pour éviter la foule', '<p>Allez tôt le matin aux temples célèbres (Fushimi Inari est presque vide au lever du soleil). Évitez les dates de la Golden Week et d’Obon. Pendant les cerisiers et l’automne, privilégiez les jours de semaine.</p>'],
    ],
    faq: [
      ['Quand fleurissent les cerisiers à Kyoto ?', 'En général entre fin mars et début avril ; la date varie de quelques jours d’une année sur l’autre.'],
      ['Quand voir les feuillages d’automne au Japon ?', 'À Kyoto et Osaka, en général de mi-novembre à début décembre.'],
      ['Quelle est la période la moins chère pour le Japon ?', 'Janvier-février (hors Nouvel An) et juin : hôtels moins chers et moins de monde.'],
    ],
    sources: [['JNTO (Office national du tourisme japonais)', 'https://www.japan.travel/fr/'], ['Site touristique officiel de Kyoto', 'https://kyoto.travel/en/']],
  },
  {
    yol: 'kyoto-en-un-jour', kapak: 'fushimi-orman',
    titre: 'Kyoto en un jour : que faire ? Programme heure par heure | Guide francophone',
    desc: 'Une seule journée à Kyoto : Fushimi Inari le matin, Kiyomizu-dera et Ninenzaka à midi, Gion le soir. Programme heure par heure, transports et guide francophone Iheb.',
    h1: 'Que faire à Kyoto en un jour ?',
    court: 'Fushimi Inari, Kiyomizu-dera et Gion : le programme heure par heure.',
    reponse: 'Avec une seule journée à Kyoto, allez du sud vers le nord : tôt le matin, les torii vermillon de Fushimi Inari ; à midi, le temple Kiyomizu-dera et les vieilles ruelles de Ninenzaka et Sannenzaka ; en fin d’après-midi, Gion et le sanctuaire Yasaka. Ces trois lieux sont proches et bien reliés en train et en bus. Depuis Osaka, Kyoto est à environ 30-50 minutes en train.',
    sections: [
      ['Programme heure par heure', '<ol><li><strong>07:30–09:30, Fushimi Inari :</strong> en arrivant tôt, vous marchez dans les tunnels de torii avant la foule. Entrée gratuite.</li><li><strong>10:00–13:00, Kiyomizu-dera :</strong> le temple à la célèbre terrasse de bois, puis les ruelles de Ninenzaka et Sannenzaka.</li><li><strong>13:00–14:00, déjeuner :</strong> pour les restaurants halal ou Muslim friendly, voir <a href="/fr/halal-mosquees-kansai/">cette page</a>.</li><li><strong>14:30–17:00, Gion et Yasaka :</strong> la rue Hanamikoji, le sanctuaire Yasaka, les berges de la Kamo.</li><li><strong>Le soir :</strong> marché Nishiki (il ferme tôt) ou la ruelle de Pontocho.</li></ol>'],
      ['S’il vous reste du temps', '<p>La forêt de bambous d’Arashiyama et le Kinkaku-ji (Pavillon d’or) sont à l’ouest et au nord de la ville ; tout voir en une journée devient une course. Avec deux jours, gardez Arashiyama et Nara pour le second (<a href="/fr/itineraire-kansai/">itinéraires de 3 et 5 jours</a>).</p>'],
      ['Transports', '<p>Pour Fushimi Inari, prenez la ligne JR Nara jusqu’à la gare d’Inari. Entre Kiyomizu-dera et Gion, tout se fait à pied. Pour venir d’Osaka, voir <a href="/fr/osaka-kyoto-transport/">ce guide</a>.</p>'],
    ],
    faq: [
      ['Une journée suffit-elle pour Kyoto ?', 'Pour voir l’essentiel, oui, mais au pas de course ; deux jours, c’est plus confortable.'],
      ['Quand aller à Fushimi Inari ?', 'Tôt le matin ; après 9 h, la foule augmente. L’entrée est gratuite et le site est ouvert 24 h/24.'],
    ],
    sources: [['Site touristique officiel de Kyoto', 'https://kyoto.travel/en/']],
  },
]

const FAQ = [
  ['Qui est Iheb ?', 'Iheb est un guide francophone qui vit au Japon. Il propose des visites privées en français dans le Kansai (Kyoto, Osaka, Nara, Kobe, Himeji) et parle aussi arabe et anglais. C’est un ami de Tony et le guide francophone de l’équipe Tony Kansai Guide.'],
  ['Existe-t-il un guide francophone au Japon ?', 'Oui. Dans le Kansai (Kyoto, Osaka, Nara, Kobe, Himeji), Iheb propose des visites privées en français. Réservation sur WhatsApp.'],
  ['En quelle langue se fait la visite ?', 'En français. Iheb parle aussi arabe et anglais, ce qui est pratique pour les familles où l’on parle plusieurs langues.'],
  ['Combien coûte la visite ?', 'Le tarif dépend du nombre de personnes, de la durée et des lieux visités. Iheb vous le communique précisément sur WhatsApp, une fois votre programme connu.'],
  ['Qu’est-ce qui n’est pas compris dans le tarif ?', 'Les billets de train et de bus, les entrées des musées et des temples ainsi que les repas ne sont généralement pas compris ; vous les réglez au fil de la journée.'],
  ['Visite privée ou en groupe ?', 'Visite privée : le guide est uniquement pour votre famille ou votre groupe d’amis. Vous n’êtes pas mélangés à d’autres touristes.'],
  ['Repas halal et prière : est-ce possible ?', 'Oui. Des restaurants halal et Muslim friendly de Kyoto et d’Osaka ainsi que des mosquées (par exemple la mosquée de Kobe) peuvent être intégrés au programme, avec des pauses aux heures de prière.'],
  ['Comment réserver ?', `Écrivez sur WhatsApp (${WA_VISIBLE}) en indiquant vos dates, le nombre de personnes et votre hôtel ou votre ville. Iheb vous répond en français.`],
  ['Dans quelles villes ?', 'Kyoto, Osaka, Nara, Kobe et Himeji. Pour une autre destination, posez la question sur WhatsApp.'],
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
<header><div class="kap"><a href="/fr/">Iheb · Guide francophone au Japon</a>
<nav aria-label="Villes">${VILLES.map((s) => `<a href="/fr/${s.yol}/">${s.ad}</a>`).join('')}</nav></div></header>
<main>
${corps}
</main>
<footer><div class="kap">
<p>Iheb est le guide francophone de <a href="/">Tony Kansai Guide</a> (Kansai, Japon), l’équipe de Tony, guide espagnol basé à Osaka. WhatsApp : <a href="${WA_GENEL}">${WA_VISIBLE}</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
<p>Infos pratiques en français : ${REPONSES.map((c) => `<a href="/fr/${c.yol}/">${esc(c.h1)}</a>`).join(' · ')}</p>
<p lang="en">In English: <a href="/fr/${ANGLAIS}/">French-speaking tour guide in Japan</a></p>
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
  url: `${BASE}/fr/`, description: 'Guide francophone qui vit au Japon. Visites privées en français à Kyoto, Osaka, Nara, Kobe et Himeji ; parle aussi arabe et anglais.',
}
const serviceLd = (ville) => ({
  '@type': 'Service', name: ville ? `Visite privée en français ${ville.a}` : 'Visite guidée privée en français au Japon (Kansai)',
  serviceType: 'Guide touristique privé', provider: { '@id': `${BASE}/fr/#iheb` }, availableLanguage: ['fr', 'ar', 'en'],
  areaServed: (ville ? [ville] : VILLES).map((s) => ({ '@type': 'City', name: s.ad, containedInPlace: { '@type': 'Country', name: 'Japon' } })),
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

const imageDe = (k) => `${BASE}/tr/foto/${k}-${grande(k)}.webp`

// Accueil
{
  const corps = `
${hero('kiyomizu-sonbahar', 'Kyoto en automne, Kiyomizu-dera', `<span class="etiket">Japon · Kansai · En français</span>
<h1>Guide francophone à Kyoto, Osaka et Nara — visites privées avec Iheb</h1>
<p class="alt">Kyoto, Osaka, Nara, Kobe et Himeji, racontés en français. Le guide est là uniquement pour votre groupe.</p>
${contact}`)}
<div class="kap">
<section class="guide" aria-labelledby="votre-guide">
${portraitGrand}
<div>
<h2 id="votre-guide">Votre guide : Iheb</h2>
<p>Iheb vit au Japon et guide en français dans le Kansai, dans les mêmes villes que Tony : Kyoto, Osaka, Nara, Kobe et Himeji. Il parle aussi arabe et anglais.</p>
<p>C’est un ami de Tony, le guide espagnol de <a href="/">Tony Kansai Guide</a> basé à Osaka, et le guide francophone de l’équipe. Si vous le souhaitez, il prévoit les repas halal, les mosquées et les pauses prière dans la journée.</p>
${contact}
</div>
</section>
<h2>En bref</h2>
<ul class="ozet">
<li><strong>Qui :</strong> Iheb, guide francophone qui vit au Japon.</li>
<li><strong>Langues :</strong> français ; il parle aussi arabe et anglais.</li>
<li><strong>Où :</strong> le Kansai : Kyoto, Osaka, Nara, Kobe, Himeji.</li>
<li><strong>Formule :</strong> visite privée, uniquement votre famille ou votre groupe.</li>
<li><strong>Tarif :</strong> communiqué sur WhatsApp selon le groupe et le programme. Transports, entrées et repas généralement non compris.</li>
<li><strong>Voyageurs musulmans :</strong> restaurants halal ou Muslim friendly, mosquées et pauses prière peuvent être prévus.</li>
<li><strong>Contact :</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
<li><strong>Avis :</strong> ${AVIS.length ? `${RESUME_AVIS}, <a href="#avis">les lire</a>` : '<a href="/fr/avis/">laissez le premier avis</a>'}</li>
</ul>
<h2>Pourquoi un guide francophone ?</h2>
<p>Au Japon, l’anglais n’est pas parlé partout, et entre les panneaux, les lignes de train et les menus, on s’y perd vite la première fois. Avec un guide qui parle votre langue, vous écoutez l’histoire et la culture en français et vous posez toutes vos questions sans effort. Comme Iheb vit au Japon, il connaît les trains, les heures d’affluence et les bonnes adresses où manger.</p>
<h2>Les villes</h2>
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
      { '@type': 'WebPage', url: `${BASE}/fr/`, inLanguage: 'fr', name: 'Guide francophone au Japon : Iheb', dateModified: HOY, about: { '@id': `${BASE}/fr/#iheb` }, primaryImageOfPage: PORTRAIT_URL },
    ],
  }
  ecrire('', page({
    yol: '', image: PORTRAIT_URL, jsonld, corps,
    titre: 'Guide francophone au Japon : Iheb | Visites privées à Kyoto, Osaka, Nara',
    desc: 'Iheb, guide francophone qui vit au Japon : visites privées en français à Kyoto, Osaka, Nara, Kobe et Himeji. Parle aussi arabe et anglais ; halal et mosquées possibles. Tarif sur WhatsApp.',
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
<li><strong>Guide :</strong> Iheb, qui vit au Japon.</li>
<li><strong>Langues :</strong> français ; aussi arabe et anglais.</li>
<li><strong>Formule :</strong> visite privée, uniquement votre groupe.</li>
<li><strong>Tarif :</strong> sur WhatsApp, selon le groupe et le programme.</li>
<li><strong>Contact :</strong> WhatsApp <a href="${lien}">${WA_VISIBLE}</a></li>
</ul>
${contactMini(lien, `Écrire à Iheb pour ${s.ad}`)}
${sectionAvis}
<p>Autres villes : ${VILLES.filter((x) => x !== s).map((x) => `<a href="/fr/${x.yol}/">${x.ad}</a>`).join(' · ')} · <a href="/fr/">Accueil</a></p>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      guideLd, serviceLd(s),
      { '@type': 'TouristDestination', name: s.ad, includesAttraction: s.lieux.map(([nom]) => ({ '@type': 'TouristAttraction', name: nom })) },
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
  const lien = wa(`Bonjour Iheb, j’ai lu la page « ${c.h1} ». Je cherche un guide francophone au Japon. Dates : `)
  const corps = `
${hero(c.kapak, '', `<span class="etiket"><a href="/fr/">Guide francophone</a> · Infos pratiques</span>
<h1>${esc(c.h1)}</h1>`)}
<div class="kap">
<p class="cevap">${esc(c.reponse)}</p>
${c.sections.map(([h, html]) => `<h2>${esc(h)}</h2>\n${html}`).join('\n')}
<h2>Questions fréquentes</h2>
${c.faq.map(([q, r]) => `<h3>${esc(q)}</h3>\n<p>${esc(r)}</p>`).join('\n')}
${c.avis ? sectionAvis : ''}
<h2>Un guide francophone dans le Kansai</h2>
<p>Iheb vit au Japon et propose des visites privées en français à Kyoto, Osaka, Nara, Kobe et Himeji ; il parle aussi arabe et anglais. Il communique le tarif sur WhatsApp, selon votre groupe.</p>
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
${hero('fushimi-tunel', 'Fushimi Inari, Kyoto', `<span class="etiket"><a href="/fr/">Français</a> · English</span>
<h1>French-speaking tour guide in Japan: Iheb</h1>
<p class="alt">Private tours in French in Kyoto, Osaka, Nara, Kobe and Himeji.</p>
<p><a class="btn" href="${WA_GENEL}">WhatsApp Iheb</a></p>`)}
<div class="kap">
<p class="cevap">Yes, there is a French-speaking guide in the Kansai region of Japan: Iheb. He lives in Japan, guides private tours in French in Kyoto, Osaka, Nara, Kobe and Himeji, and also speaks Arabic and English. He quotes a price per group on WhatsApp (${WA_VISIBLE}).</p>
<h2>Key facts</h2>
<ul class="ozet">
<li><strong>Guide:</strong> Iheb, living in Japan, part of the Tony Kansai Guide team.</li>
<li><strong>Languages:</strong> French; also Arabic and English.</li>
<li><strong>Area:</strong> Kansai: Kyoto, Osaka, Nara, Kobe, Himeji.</li>
<li><strong>Type:</strong> private tour, only your family or group.</li>
<li><strong>Price:</strong> per group, quoted on WhatsApp after you send your plan. Trains, entry fees and meals are usually not included.</li>
<li><strong>Muslim travellers:</strong> halal or Muslim-friendly restaurants, mosques (Kobe Mosque) and prayer breaks can be built into the day.</li>
${AVIS.length ? `<li><strong>Reviews:</strong> ${AVIS.length} guest reviews, average ${MOYENNE.replace(',', '.')}/5 (<a href="/fr/#avis">read them, in French</a>).</li>` : ''}
<li><strong>Contact:</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
</ul>
<h2>What about Tokyo?</h2>
<p>Iheb guides in Kansai. Kyoto is about 2 hours 15 minutes from Tokyo by Shinkansen, and many travellers spend a few days in Kyoto and Osaka after Tokyo.</p>
<h2>Other languages</h2>
<p>The same team has guides in Spanish, English and Arabic (<a href="/en/">Tony</a>), <a href="/tr/">Turkish</a> and <a href="/ru/">Russian</a>.</p>
<div class="iheb-mini"><img src="/fr/foto/iheb-320.webp" srcset="/fr/foto/iheb-320.webp 1x, /fr/foto/iheb-640.webp 2x" alt="Iheb, French-speaking guide in Kyoto and Osaka" width="96" height="96" loading="lazy"><div><p><strong>Iheb</strong>, your French-speaking guide in Kansai.</p><p><a class="btn" href="${WA_GENEL}">WhatsApp Iheb</a></p></div></div>
<p><a href="/fr/">Page en français : guide francophone au Japon, Iheb →</a></p>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { ...guideLd, jobTitle: 'French-speaking tour guide', description: 'French-speaking tour guide living in Japan. Private tours in French in Kyoto, Osaka, Nara, Kobe and Himeji; also speaks Arabic and English.' },
      { ...serviceLd(null), name: 'Private tour in French in Kansai, Japan', url: `${BASE}/fr/${ANGLAIS}/` },
      { '@type': 'FAQPage', inLanguage: 'en', mainEntity: [
        ['Is there a French-speaking tour guide in Japan?', `Yes. Iheb, a guide living in Japan, runs private tours in French in Kyoto, Osaka, Nara, Kobe and Himeji. WhatsApp ${WA_VISIBLE}.`],
        ['Is there a French-speaking guide in Kyoto?', 'Yes, Iheb guides private tours in French in Kyoto (Fushimi Inari, Kiyomizu-dera, Gion, Arashiyama).'],
      ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  }
  ecrire(ANGLAIS, page({
    yol: ANGLAIS, image: imageDe('fushimi-tunel'), jsonld, corps, lang: 'en',
    titre: 'French-Speaking Tour Guide in Japan (Kyoto, Osaka, Nara) | Iheb',
    desc: 'Iheb, a guide living in Japan, runs private tours in French in Kyoto, Osaka, Nara, Kobe and Himeji. Also speaks Arabic and English. Price per group on WhatsApp.',
  }))
}

function ecrire(yol, html) {
  const dir = join(root, 'public/fr', yol)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
console.log(`fr: ${VILLES.length + REPONSES.length + 2} pages en public/fr/`)

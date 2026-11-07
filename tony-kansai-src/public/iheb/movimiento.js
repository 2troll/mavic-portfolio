// Movimiento «anime» de las páginas de Iheb (/fr/, /ar/tokyo/, /en/tokyo-anime-guide/).
// GSAP + ScrollTrigger + Lenis desde CDN, como /tr/. Sin JS o con «reducir
// movimiento» todo se ve entero y quieto: .hz (que oculta para animar) solo se
// pone cuando las librerías han cargado.
(() => {
  const g = window.gsap, ST = window.ScrollTrigger
  if (!g || !ST || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  g.registerPlugin(ST)
  const rtl = document.documentElement.dir === 'rtl'
  const raton = matchMedia('(hover: hover) and (pointer: fine)').matches

  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.1 })
    lenis.on('scroll', ST.update)
    g.ticker.add((t) => lenis.raf(t * 1000))
    g.ticker.lagSmoothing(0)
  }

  // Barra de progreso de lectura arriba (color del acento).
  const barra = document.createElement('div')
  barra.className = 'ilerleme'
  document.body.appendChild(barra)
  g.to(barra, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

  // Portada: la etiqueta cae como pegatina, el título entra «de golpe» como viñeta.
  const k = document.querySelector('.kahraman .ortu .kap')
  if (k) {
    const tl = g.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 })
    const et = k.querySelector('.etiket'), h1 = k.querySelector('h1'), resto = [...k.children].filter((c) => c !== et && c !== h1)
    if (et) tl.from(et, { y: -40, rotate: -14, opacity: 0, duration: 0.7, ease: 'back.out(2.2)' })
    if (h1) tl.from(h1, { scale: 1.18, opacity: 0, duration: 0.6, ease: 'expo.out' }, '-=0.35')
    if (resto.length) tl.from(resto, { y: 26, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.3')
  }
  const foto = document.querySelector('.kahraman > img')
  if (foto) g.to(foto, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.kahraman', start: 'top top', end: 'bottom top', scrub: true } })

  document.documentElement.classList.add('hz')
  // Tarjetas y bloques: suben con un pequeño giro, como viñetas que se colocan.
  const gir = g.utils.toArray('main h2, .izgara > li, ul.ozet > li, main details, .cevap, .adimlar > li, .fiche, table, .bant .kap > *')
  gir.forEach((el) => el.classList.add('gir'))
  ST.batch(gir, {
    start: 'top 92%', once: true,
    onEnter: (b) => g.fromTo(b, { opacity: 0, y: 34, rotate: rtl ? 1.2 : -1.2 }, { opacity: 1, y: 0, rotate: 0, duration: 0.75, ease: 'back.out(1.6)', stagger: 0.07, overwrite: true }),
  })
  // Pegatinas: saltan una a una.
  const pegatinas = g.utils.toArray('.rozetler > li')
  if (pegatinas.length) {
    g.set(pegatinas, { opacity: 0, scale: 0.4 })
    ST.create({ trigger: '.rozetler', start: 'top 95%', once: true,
      onEnter: () => g.to(pegatinas, { opacity: 1, scale: 1, rotate: () => g.utils.random(-4, 4), duration: 0.5, ease: 'back.out(3)', stagger: 0.05 }) })
  }
  // Pasos numerados: el círculo rebota al aparecer.
  g.utils.toArray('.adimlar > li').forEach((li) => ST.create({ trigger: li, start: 'top 90%', once: true,
    onEnter: () => li.classList.add('zipla') }))
  ST.refresh()

  // Carta coleccionable: se inclina siguiendo el ratón y el brillo holo la sigue.
  const tcg = document.querySelector('.tcg')
  if (tcg && raton) {
    tcg.style.transformPerspective = '800px'
    const rx = g.quickTo(tcg, 'rotationX', { duration: 0.5, ease: 'power3' }), ry = g.quickTo(tcg, 'rotationY', { duration: 0.5, ease: 'power3' })
    tcg.addEventListener('pointermove', (e) => {
      const r = tcg.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * 18); rx((0.5 - py) * 14)
      tcg.style.setProperty('--hx', `${px * 100}%`); tcg.style.setProperty('--hy', `${py * 100}%`)
    })
    tcg.addEventListener('pointerleave', () => { rx(0); ry(0) })
  } else if (tcg) {
    // Móvil: flota suave para que se note que es «especial».
    g.to(tcg, { y: -8, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  }

  // Botones imán (solo con ratón).
  if (raton) document.querySelectorAll('.btn, .wa-sabit').forEach((b) => {
    const x = g.quickTo(b, 'x', { duration: 0.4, ease: 'power3' }), y = g.quickTo(b, 'y', { duration: 0.4, ease: 'power3' })
    b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.25) })
    b.addEventListener('mouseleave', () => { x(0); y(0) })
  })

  // 7-11-2026: más vida, sobre todo en el móvil.
  // Foto de portada: zoom lento y paralaje al bajar.
  const kimg = document.querySelector('.kahraman img')
  if (kimg) g.fromTo(kimg, { scale: 1.12 }, { scale: 1, yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.kahraman', start: 'top top', end: 'bottom top', scrub: true } })
  // Carruseles del móvil: la tarjeta del centro crece y las de los lados se apagan.
  g.utils.toArray('.izgara, ul.opciones').forEach((cz) => {
    if (getComputedStyle(cz).overflowX !== 'auto') return
    const items = [...cz.children]
    const pinta = () => {
      const c = cz.getBoundingClientRect(), mid = c.left + c.width / 2
      items.forEach((it) => {
        const r = it.getBoundingClientRect(), d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / c.width)
        it.style.transform = `scale(${1 - d * 0.1}) rotate(${(rtl ? -1 : 1) * d * 2}deg)`
        it.style.opacity = String(1 - d * 0.35)
      })
    }
    cz.addEventListener('scroll', () => requestAnimationFrame(pinta), { passive: true })
    pinta()
  })
  // Botón fijo de WhatsApp: un saltito cada pocos segundos para que se vea.
  const fijo = document.querySelector('.wa-sabit')
  if (fijo) g.timeline({ repeat: -1, repeatDelay: 5, delay: 3 }).to(fijo, { y: -8, rotate: -2, duration: 0.18, ease: 'power2.out' }).to(fijo, { y: 0, rotate: 0, duration: 0.6, ease: 'bounce.out' })
})()

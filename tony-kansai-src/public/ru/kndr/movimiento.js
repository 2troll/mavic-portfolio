// Movimiento de /ru/kndr/ y /ru/maks/: GSAP + ScrollTrigger + Lenis desde CDN.
// Sin JS o con «reducir movimiento» todo se ve entero y quieto: la clase .mov
// (que oculta para animar) solo se pone cuando las librerías han cargado.
(() => {
  const g = window.gsap, ST = window.ScrollTrigger
  if (!g || !ST || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  g.registerPlugin(ST)
  document.documentElement.classList.add('mov')
  const raton = matchMedia('(hover: hover) and (pointer: fine)').matches

  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.09 })
    lenis.on('scroll', ST.update)
    g.ticker.add((t) => lenis.raf(t * 1000))
    g.ticker.lagSmoothing(0)
    // Los enlaces #ancla también se deslizan.
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const d = document.querySelector(a.getAttribute('href'))
      if (d) { e.preventDefault(); lenis.scrollTo(d, { offset: -60 }) }
    }))
  }

  // Barra de progreso arriba.
  const barra = document.createElement('div')
  barra.className = 'progreso'
  document.body.appendChild(barra)
  g.to(barra, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

  // Título de la portada: palabra a palabra, de abajo arriba (estilo «split text»).
  const h1 = document.querySelector('.heroe h1, .hm h1')
  if (h1) {
    const palabras = h1.textContent.trim().split(/\s+/)
    h1.setAttribute('aria-label', h1.textContent.trim())
    h1.innerHTML = palabras.map((p) => `<span class="pal" aria-hidden="true"><span>${p}</span></span>`).join(' ')
    const tl = g.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 })
    tl.from(h1.querySelectorAll('.pal > span'), { yPercent: 110, rotate: 4, duration: 0.9, stagger: 0.06 })
    const resto = [...h1.parentElement.children].filter((c) => c !== h1)
    tl.from(resto, { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
    const img = document.querySelector('.heroe img')
    if (img) g.to(img, { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.heroe', start: 'top top', end: 'bottom top', scrub: true } })
  }

  // Tarjeta de perfil de Max: entra girando y sigue al ratón en 3D.
  const perfil = document.querySelector('.perfil')
  if (perfil) {
    g.from(perfil, { y: 60, rotateY: -18, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.35 })
    if (raton) {
      const rx = g.quickTo(perfil, 'rotateX', { duration: 0.5 }), ry = g.quickTo(perfil, 'rotateY', { duration: 0.5 })
      perfil.addEventListener('pointermove', (e) => {
        const r = perfil.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 14); rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
      })
      perfil.addEventListener('pointerleave', () => { rx(0); ry(0) })
    }
  }

  // Cifras que cuentan hasta su valor al aparecer.
  document.querySelectorAll('[data-cuenta]').forEach((el) => {
    const fin = Number(el.dataset.cuenta), o = { v: 0 }
    g.to(o, { v: fin, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('ru-RU') } })
  })

  // Bloques que suben al entrar en pantalla, con escalonado en rejillas y listas.
  g.utils.toArray('main section .kap > *').forEach((el) => {
    if (el.closest('.heroe, .hm')) return
    const hijos = el.matches('.tarjetas, .pasos, .cifras, .lista, ul, .dos') ? el.children : [el]
    g.from(hijos, { y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
  })

  // Botones «magnéticos».
  if (raton) document.querySelectorAll('.btn').forEach((b) => {
    const x = g.quickTo(b, 'x', { duration: 0.4 }), y = g.quickTo(b, 'y', { duration: 0.4 })
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.35) })
    b.addEventListener('pointerleave', () => { x(0); y(0) })
  })

  // Cinta de tours: se desliza sola y se para al pasar el ratón.
  const cinta = document.querySelector('.cinta .pista')
  if (cinta) {
    cinta.innerHTML += cinta.innerHTML
    cinta.querySelectorAll('a').forEach((a, i) => { if (i >= cinta.children.length / 2) { a.setAttribute('aria-hidden', 'true'); a.tabIndex = -1 } })
    const tw = g.to(cinta, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 })
    cinta.addEventListener('pointerenter', () => g.to(tw, { timeScale: 0, duration: 0.4 }))
    cinta.addEventListener('pointerleave', () => g.to(tw, { timeScale: 1, duration: 0.4 }))
    cinta.addEventListener('focusin', () => tw.pause())
  }

  // Carruseles del móvil: la tarjeta del centro crece y las de los lados se apagan.
  g.utils.toArray('.tarjetas, .ventajas, .regiones').forEach((cz) => {
    if (getComputedStyle(cz).overflowX !== 'auto') return
    const items = [...cz.children]
    const pinta = () => {
      const c = cz.getBoundingClientRect(), mid = c.left + c.width / 2
      items.forEach((it) => {
        const r = it.getBoundingClientRect(), d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / c.width)
        it.style.transform = `scale(${1 - d * 0.08})`
        it.style.opacity = String(1 - d * 0.4)
      })
    }
    cz.addEventListener('scroll', () => requestAnimationFrame(pinta), { passive: true })
    pinta()
  })
  // Los 15 círculos del grupo se encienden uno a uno.
  const plazas = document.querySelectorAll('.plazas i')
  if (plazas.length) g.from(plazas, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(3)', stagger: 0.05, scrollTrigger: { trigger: '.plazas', start: 'top 90%', once: true } })
  // La línea Владивосток → Пхеньян se dibuja.
  const ruta = document.querySelector('.ruta i')
  if (ruta) g.from(ruta, { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'power2.inOut', delay: 0.5 })
  // Filas del tablo: entran como un panel de salidas.
  const filas = document.querySelectorAll('.tablo a')
  if (filas.length) g.from(filas, { rotateX: -90, opacity: 0, transformOrigin: '50% 0', duration: 0.6, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: '.tablo', start: 'top 85%', once: true } })
  // Botón fijo: un saltito cada pocos segundos.
  const fijo = document.querySelector('.wa-fijo')
  if (fijo) g.timeline({ repeat: -1, repeatDelay: 5, delay: 3 }).to(fijo, { y: -8, duration: 0.18, ease: 'power2.out' }).to(fijo, { y: 0, duration: 0.6, ease: 'bounce.out' })
})()

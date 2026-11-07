/*! Efectos portados sin React desde React Bits (https://reactbits.dev): ShinyText, GradientText,
 *  StarBorder, SpotlightCard y ClickSpark. Copyright (c) 2026 David Haz.
 *  MIT + Commons Clause License Condition v1.0 (uso como parte de esta web).
 *  https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md */
(() => {
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
  const $$ = (s) => [...document.querySelectorAll(s)]
  // Qué se anima en cada página: botones principales, tarjetas y etiquetas.
  const BOTONES = '.kahraman .btn, .heroe .btn-tg, .hm .btn-tg, .hero .btn, .baslangic .btn, .cierre .btn, .bant .btn, .acciones .btn'
  const TARJETAS = '.izgara > li, .xp-l a, ul.secenek > li, ul.opciones a, .ventajas article, .tarjetas a, .servicios li, .regiones > li'
  const ETIQUETAS = '.kahraman .etiket, .heroe .ceja, .hm .ceja, .hero .ceja, .ceja-o'

  // StarBorder
  for (const b of $$(BOTONES)) {
    if (b.classList.contains('rb-star')) continue
    b.classList.add('rb-star')
    b.insertAdjacentHTML('afterbegin', '<span class="rb-luz a" aria-hidden="true"></span><span class="rb-luz b" aria-hidden="true"></span>')
  }
  // ShinyText en las etiquetas pequeñas
  for (const e of $$(ETIQUETAS)) e.classList.add('rb-shiny')
  // SpotlightCard
  for (const c of $$(TARJETAS)) {
    c.classList.add('rb-spot')
    const mueve = (x, y) => { const r = c.getBoundingClientRect(); c.style.setProperty('--rb-x', `${x - r.left}px`); c.style.setProperty('--rb-y', `${y - r.top}px`) }
    c.addEventListener('pointermove', (e) => { mueve(e.clientX, e.clientY); c.classList.add('rb-on') })
    c.addEventListener('pointerdown', (e) => { mueve(e.clientX, e.clientY); c.classList.add('rb-on') })
    c.addEventListener('pointerleave', () => c.classList.remove('rb-on'))
  }
  if (quieto) return
  // ClickSpark: 8 chispas que salen del punto donde tocas
  const cv = document.createElement('canvas')
  cv.className = 'rb-chispas'
  document.body.appendChild(cv)
  const ctx = cv.getContext('2d')
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const ajusta = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
  ajusta(); addEventListener('resize', ajusta)
  const color = getComputedStyle(document.documentElement).getPropertyValue('--rb-acento').trim() || '#ff2e88'
  let chispas = [], vivo = false
  const pinta = (t) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    chispas = chispas.filter((s) => {
      const p = (t - s.t0) / 450
      if (p >= 1) return false
      const e = p * (2 - p)            // ease-out
      const d = e * 30, l = 14 * (1 - e)
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d)
      ctx.lineTo(s.x + Math.cos(s.a) * (d + l), s.y + Math.sin(s.a) * (d + l))
      ctx.stroke()
      return true
    })
    if (chispas.length) requestAnimationFrame(pinta); else vivo = false
  }
  addEventListener('pointerdown', (e) => {
    const t0 = performance.now()
    for (let i = 0; i < 8; i++) chispas.push({ x: e.clientX, y: e.clientY, a: (2 * Math.PI * i) / 8, t0 })
    if (!vivo) { vivo = true; requestAnimationFrame(pinta) }
  }, { passive: true })
})()

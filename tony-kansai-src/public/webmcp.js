// WebMCP: herramientas para asistentes de IA que navegan la web dentro del navegador
// (Chrome con document.modelContext / navigator.modelContext). Solo lectura: leen lo
// mismo que ve el visitante y nunca envían nada por él. Si el navegador no tiene
// WebMCP, este archivo no hace nada.
;(function () {
  var mc = (typeof document !== 'undefined' && document.modelContext) || (typeof navigator !== 'undefined' && navigator.modelContext)
  if (!mc || (typeof mc.registerTool !== 'function' && typeof mc.provideContext !== 'function')) return

  function texto(t) {
    return { content: [{ type: 'text', text: String(t) }] }
  }
  function leer(ruta) {
    return fetch(ruta, { headers: { Accept: 'text/plain' } }).then(function (r) {
      if (!r.ok) throw new Error(ruta + ' → HTTP ' + r.status)
      return r.text()
    })
  }
  function rutaPagina(p) {
    var u = new URL(p || location.pathname, location.origin)
    if (u.origin !== location.origin) throw new Error('Only pages on ' + location.host)
    var ruta = u.pathname.endsWith('/') ? u.pathname : u.pathname.replace(/[^/]*$/, '')
    return ruta + 'index.md'
  }

  var herramientas = [
    {
      name: 'get_tour_overview',
      description:
        'Tony Kansai Guide overview: private tours in Kyoto, Osaka, Nara, Kobe, Himeji and Kansai hiking; languages; current prices per group; what is included; payment and cancellation; reviews summary; contact.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () {
        return leer('/llms.txt').then(texto)
      },
    },
    {
      name: 'read_page',
      description:
        'Read a page of this site as clean Markdown (default: the current page). Example paths: "/es/kyoto/", "/en/nara/", "/ar/halal-kyoto-osaka/".',
      inputSchema: {
        type: 'object',
        properties: { path: { type: 'string', description: 'Page path on this site; omit for the current page' } },
      },
      annotations: { readOnlyHint: true },
      execute: function (input) {
        return leer(rutaPagina(input && input.path)).then(texto)
      },
    },
    {
      name: 'get_reviews',
      description: 'Published guest reviews (stars, text, name, country, tour, date).',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () {
        return leer('/reviews.json').then(texto)
      },
    },
    {
      name: 'get_whatsapp_booking_link',
      description:
        'Build a WhatsApp link to ask Tony about a tour, with the first message pre-written (dates, people, city, hotel, language). It only returns the link; the user opens it and sends the message. Tony confirms every booking personally.',
      inputSchema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'First message in the user\'s language: dates, number of adults/children, city or route, hotel, language, interests',
          },
        },
        required: ['message'],
      },
      annotations: { readOnlyHint: true },
      execute: function (input) {
        var m = String((input && input.message) || '').slice(0, 1500)
        return texto('https://wa.me/34634193106?text=' + encodeURIComponent(m))
      },
    },
  ]

  try {
    if (typeof mc.registerTool === 'function') {
      herramientas.forEach(function (h) {
        try {
          var r = mc.registerTool(h)
          if (r && typeof r.catch === 'function') r.catch(function () {})
        } catch (e) {}
      })
    } else {
      mc.provideContext({ tools: herramientas })
    }
  } catch (e) {}
})()

// Atlas en 3D: todo Kansai con su relieve real, curvas de nivel de neón y cada
// cima como un haz de luz de su altura. Al elegir un monte, la cámara vuela hasta él.
//  · MapLibre GL (BSD-3), ya usado en Vuelo3d; relieve Terrarium de AWS Open Data.
//  · maplibre-contour (BSD-3, onthegomap): curvas de nivel calculadas en el
//    navegador a partir del mismo relieve. Agua y sendas: OpenFreeMap (© OpenStreetMap).
// Sin clave ni pago. Se descarga solo al acercarse; si no hay WebGL, sale `reserva`.
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Map as MapaGL, Marker, LngLatBoundsLike } from 'maplibre-gl'
import { MONTES, KANJI, CIMA } from './datosMontana'
import type { MonteId } from './datosMontana'
import { CIUDADES } from './datosExpedicion'
import type { Lengua } from './datosExpedicion'

const DEM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
const ATRIBUCION = '<a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">Terrain Tiles</a> · <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
const TXT: Record<Lengua, { todo: string; rotulo: string; nota: string }> = {
  es: { todo: 'Ver todo Kansai', rotulo: 'Curvas cada 100 m · relieve ×1,6', nota: 'Relieve real (AWS Terrain Tiles), curvas calculadas en tu navegador. Arrastra para girar; con dos dedos o Ctrl, acerca.' },
  en: { todo: 'All of Kansai', rotulo: '100 m contours · relief ×1.6', nota: 'Real relief (AWS Terrain Tiles), contours computed in your browser. Drag to rotate; two fingers or Ctrl to zoom.' },
  ar: { todo: 'كل كانساي', rotulo: 'خطوط كنتور كل ١٠٠ م', nota: 'تضاريس حقيقية، وخطوط الكنتور تُحسب في متصفحك. اسحب للتدوير.' },
  ru: { todo: 'Весь Кансай', rotulo: 'Горизонтали через 100 м · рельеф ×1,6', nota: 'Настоящий рельеф (AWS Terrain Tiles), горизонтали считаются в браузере. Тяните, чтобы повернуть.' },
}
const LIMITES: LngLatBoundsLike = [
  [Math.min(...MONTES.map((m) => CIMA[m].lon)) - 0.08, Math.min(...MONTES.map((m) => CIMA[m].lat)) - 0.06],
  [Math.max(...MONTES.map((m) => CIMA[m].lon)) + 0.08, Math.max(...MONTES.map((m) => CIMA[m].lat)) + 0.06],
]
const ALTA = Math.max(...MONTES.map((m) => CIMA[m].m))

interface Props { sel: MonteId; onSel: (m: MonteId) => void; nombre: (m: MonteId) => string; ciudades: Record<string, string>; lang: Lengua; etiqueta: string; reserva: ReactNode }

export function MapaNeon({ sel, onSel, nombre, ciudades, lang, etiqueta, reserva }: Props) {
  const caja = useRef<HTMLDivElement>(null)
  const mapa = useRef<MapaGL | null>(null)
  const pines = useRef<Partial<Record<MonteId, Marker>>>({})
  const antes = useRef(sel)
  const [visto, setVisto] = useState(false)
  const [fallo, setFallo] = useState(false)
  const quieto = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const tx = TXT[lang]

  useEffect(() => {
    const el = caja.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisto(true); io.disconnect() } }, { rootMargin: '400px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visto || !caja.current) return
    let vivo = true
    Promise.all([import('maplibre-gl'), import('maplibre-contour'), import('maplibre-gl/dist/maplibre-gl.css')]).then(([{ default: ml }, { default: mlcontour }]) => {
      if (!vivo || !caja.current) return
      const dem = new mlcontour.DemSource({ url: DEM, encoding: 'terrarium', maxzoom: 12, worker: true, cacheSize: 120 })
      dem.setupMaplibre(ml)
      const curvas = dem.contourProtocolUrl({
        thresholds: { 8: [200, 1000], 9: [100, 500], 10: [100, 500], 11: [50, 200], 12: [50, 200], 13: [25, 100], 14: [20, 100] },
        elevationKey: 'ele', levelKey: 'level', contourLayer: 'curvas',
      })
      let m: MapaGL
      try {
        m = new ml.Map({
          container: caja.current, bounds: LIMITES, fitBoundsOptions: { padding: 40 }, pitch: 52, bearing: -12, maxPitch: 78,
          attributionControl: { compact: true, customAttribution: ATRIBUCION }, cooperativeGestures: true,
          style: {
            version: 8,
            glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
            sources: {
              relieve: { type: 'raster-dem', tiles: [dem.sharedDemProtocolUrl], tileSize: 256, encoding: 'terrarium', maxzoom: 12 },
              curvas: { type: 'vector', tiles: [curvas], maxzoom: 14 },
              osm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
            },
            layers: [
              { id: 'fondo', type: 'background', paint: { 'background-color': '#03060c' } },
              { id: 'sombra', type: 'hillshade', source: 'relieve', paint: { 'hillshade-exaggeration': 0.6, 'hillshade-shadow-color': '#000000', 'hillshade-highlight-color': '#16405a', 'hillshade-accent-color': '#0a1e2c', 'hillshade-illumination-direction': 315 } },
              { id: 'agua', type: 'fill', source: 'osm', 'source-layer': 'water', paint: { 'fill-color': '#01030a', 'fill-opacity': 0.92 } },
              { id: 'costa', type: 'line', source: 'osm', 'source-layer': 'water', paint: { 'line-color': '#2ef2ff', 'line-width': 1.2, 'line-opacity': 0.7, 'line-blur': 0.6 } },
              { id: 'rios', type: 'line', source: 'osm', 'source-layer': 'waterway', minzoom: 10, paint: { 'line-color': '#2ef2ff', 'line-width': 0.7, 'line-opacity': 0.35 } },
              { id: 'curva-menor', type: 'line', source: 'curvas', 'source-layer': 'curvas', filter: ['==', ['get', 'level'], 0], paint: { 'line-color': '#2ef2ff', 'line-width': 0.6, 'line-opacity': 0.32 } },
              { id: 'curva-halo', type: 'line', source: 'curvas', 'source-layer': 'curvas', filter: ['>', ['get', 'level'], 0], paint: { 'line-color': '#c8ff2e', 'line-width': 5, 'line-opacity': 0.18, 'line-blur': 4 } },
              { id: 'curva-mayor', type: 'line', source: 'curvas', 'source-layer': 'curvas', filter: ['>', ['get', 'level'], 0], paint: { 'line-color': '#c8ff2e', 'line-width': 1.3, 'line-opacity': 0.85 } },
              { id: 'curva-cifra', type: 'symbol', source: 'curvas', 'source-layer': 'curvas', filter: ['>', ['get', 'level'], 0], minzoom: 11,
                layout: { 'symbol-placement': 'line', 'text-size': 10, 'text-field': ['concat', ['to-string', ['get', 'ele']], ' m'], 'text-font': ['Noto Sans Bold'] },
                paint: { 'text-color': '#c8ff2e', 'text-halo-color': '#03060c', 'text-halo-width': 1.4 } },
              { id: 'sendas', type: 'line', source: 'osm', 'source-layer': 'transportation', minzoom: 11.5, filter: ['in', ['get', 'class'], ['literal', ['path', 'track']]],
                paint: { 'line-color': '#ffffff', 'line-width': 1, 'line-opacity': 0.55, 'line-dasharray': [2, 1.5] } },
            ],
            terrain: { source: 'relieve', exaggeration: 1.6 },
            sky: { 'sky-color': '#03060c', 'horizon-color': '#0d3b4f', 'fog-color': '#03060c', 'sky-horizon-blend': 0.7, 'horizon-fog-blend': 0.5, 'fog-ground-blend': 0.6 },
          },
        })
      } catch {
        setFallo(true)
        return
      }
      mapa.current = m
      m.addControl(new ml.NavigationControl({ visualizePitch: true }), 'top-right')
      m.on('error', () => { /* una tesela perdida no rompe el mapa */ })
      // Los créditos, plegados en el botón ⓘ: abiertos tapaban medio mapa en el móvil.
      m.once('load', () => caja.current?.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show'))

      for (const c of CIUDADES) {
        const el = document.createElement('div')
        el.className = 'mv-ciudad'
        el.textContent = ciudades[c.id]
        new ml.Marker({ element: el, anchor: 'left' }).setLngLat([c.lon, c.lat]).addTo(m)
      }
      for (const id of MONTES) {
        const el = document.createElement('button')
        el.type = 'button'
        el.className = 'mv-pin'
        el.style.setProperty('--alto', `${Math.round(24 + (CIMA[id].m / ALTA) * 96)}px`)
        el.setAttribute('aria-label', `${nombre(id)} ${CIMA[id].m} m`)
        el.innerHTML = `<span class="mv-pin-et"><span lang="ja">${KANJI[id]}</span><b>${CIMA[id].m}</b></span><span class="mv-pin-haz"></span><span class="mv-pin-base"></span>`
        el.addEventListener('click', (e) => { e.stopPropagation(); onSel(id) })
        pines.current[id] = new ml.Marker({ element: el, anchor: 'bottom' }).setLngLat([CIMA[id].lon, CIMA[id].lat]).addTo(m)
      }
      pines.current[sel]?.getElement().classList.add('activo')
    }).catch(() => setFallo(true))
    return () => { vivo = false; mapa.current?.remove(); mapa.current = null; pines.current = {} }
  }, [visto]) // eslint-disable-line react-hooks/exhaustive-deps

  // Al elegir otra cima (en el mapa o en las gráficas), la cámara vuela hasta ella.
  useEffect(() => {
    for (const [id, p] of Object.entries(pines.current)) p?.getElement().classList.toggle('activo', id === sel)
    const m = mapa.current
    if (!m) return
    if (antes.current === sel) return
    antes.current = sel
    const c = CIMA[sel]
    m.flyTo({ center: [c.lon, c.lat], zoom: 12.4, pitch: 64, bearing: m.getBearing() - 30, duration: quieto ? 0 : 3200, curve: 1.5, essential: false })
  }, [sel, quieto])

  const todo = () => mapa.current?.fitBounds(LIMITES, { padding: 40, pitch: 52, bearing: -12, duration: quieto ? 0 : 2400 })

  if (fallo) return <>{reserva}</>
  return (
    <figure className="mv-mapa">
      <div ref={caja} className="mv-mapa-lienzo" role="region" aria-label={etiqueta} />
      <div className="mv-mapa-hud" aria-hidden="true" />
      <p className="mv-mapa-rotulo" aria-hidden="true">Kansai · 3D topo<span>{tx.rotulo}</span></p>
      <button type="button" className="mv-mapa-todo" onClick={todo}>{tx.todo}</button>
      <figcaption>{tx.nota}</figcaption>
    </figure>
  )
}

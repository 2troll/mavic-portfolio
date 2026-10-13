// Vuelo 3D sobre la cumbre elegida, como los «flyover» de las apps de senderismo.
// MapLibre GL (BSD-3) con teselas libres y sin clave:
//  · foto aérea: 地理院タイル seamlessphoto (国土地理院, uso libre citando la fuente);
//  · relieve: Terrarium de AWS Open Data (Mapzen/Tilezen);
//  · senderos: OpenFreeMap (datos © OpenStreetMap), capa transportation, clase path.
// MapLibre (~800 KB) solo se descarga cuando el mapa entra en pantalla.

import { useEffect, useRef, useState } from 'react'
import type { Map as MapaGL, Marker } from 'maplibre-gl'
import { CIMA } from './datosMontana'
import type { MonteId } from './datosMontana'

interface Props { monte: MonteId; etiqueta: string; textos: { cargando: string; girar: string; parar: string; sinWebgl: string } }

const ATRIBUCION = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">出典 国土地理院</a> · <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">Terrain Tiles</a>'

export function Vuelo3d({ monte, etiqueta, textos }: Props) {
  const caja = useRef<HTMLDivElement>(null)
  const mapa = useRef<MapaGL | null>(null)
  const marca = useRef<Marker | null>(null)
  const [visto, setVisto] = useState(false)
  const [listo, setListo] = useState(false)
  const [fallo, setFallo] = useState(false)
  const [gira, setGira] = useState(true)
  const quieto = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  // Arranca solo al acercarse a la pantalla.
  useEffect(() => {
    const el = caja.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisto(true); io.disconnect() } }, { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visto || !caja.current) return
    let vivo = true
    Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')]).then(([{ default: ml }]) => {
      if (!vivo || !caja.current) return
      const c = CIMA[monte]
      let m: MapaGL
      try {
        m = new ml.Map({
          container: caja.current,
          center: [c.lon, c.lat], zoom: 13.6, pitch: 68, bearing: -20, maxPitch: 80,
          attributionControl: { compact: true, customAttribution: ATRIBUCION },
          cooperativeGestures: true,
          style: {
            version: 8,
            sources: {
              foto: { type: 'raster', tiles: ['https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'], tileSize: 256, maxzoom: 18 },
              relieve: { type: 'raster-dem', tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'], tileSize: 256, encoding: 'terrarium', maxzoom: 15 },
              osm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
            },
            layers: [
              { id: 'foto', type: 'raster', source: 'foto', paint: { 'raster-saturation': -0.15, 'raster-contrast': 0.12 } },
              { id: 'sombra', type: 'hillshade', source: 'relieve', paint: { 'hillshade-exaggeration': 0.35, 'hillshade-shadow-color': '#0b0d0a' } },
              { id: 'sendas-halo', type: 'line', source: 'osm', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['path', 'track']]],
                paint: { 'line-color': '#0b0d0a', 'line-width': 4, 'line-opacity': 0.5 } },
              { id: 'sendas', type: 'line', source: 'osm', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['path', 'track']]],
                paint: { 'line-color': '#f0b33a', 'line-width': 1.8, 'line-dasharray': [2, 1.2] } },
            ],
            terrain: { source: 'relieve', exaggeration: 1.35 },
            sky: { 'sky-color': '#1a2230', 'horizon-color': '#c9b48a', 'fog-color': '#0b0d0a', 'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.4 },
          },
        })
      } catch {
        setFallo(true)
        return
      }
      mapa.current = m
      m.addControl(new ml.NavigationControl({ visualizePitch: true }), 'top-right')
      // La cima: un marcador HTML con su altura.
      const pin = document.createElement('div')
      pin.className = 'ex-vuelo-pin'
      pin.innerHTML = `<span>${c.m} m</span>`
      marca.current = new ml.Marker({ element: pin, anchor: 'bottom' }).setLngLat([c.lon, c.lat]).addTo(m)
      m.once('idle', () => vivo && setListo(true))
      m.on('error', () => { /* una tesela perdida no rompe el vuelo */ })
    }).catch(() => setFallo(true))
    return () => { vivo = false; mapa.current?.remove(); mapa.current = null }
  }, [visto]) // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambiar de monte: vuela hasta él y mueve el marcador.
  useEffect(() => {
    const m = mapa.current
    if (!m) return
    const c = CIMA[monte]
    marca.current?.setLngLat([c.lon, c.lat])
    const pin = marca.current?.getElement()
    if (pin) pin.innerHTML = `<span>${c.m} m</span>`
    m.flyTo({ center: [c.lon, c.lat], zoom: 13.6, pitch: 68, bearing: m.getBearing() - 40, duration: quieto ? 0 : 4200, curve: 1.6, essential: false })
  }, [monte, quieto])

  // Giro lento alrededor de la cima, como un dron. Se para al tocar el mapa.
  useEffect(() => {
    const m = mapa.current
    if (!m || !listo || !gira || quieto) return
    let raf = 0, antes = performance.now()
    const paso = (t: number) => {
      if (!m.isMoving()) m.setBearing(m.getBearing() + (t - antes) * 0.004)
      antes = t
      raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    const para = () => setGira(false)
    m.on('mousedown', para); m.on('touchstart', para); m.on('wheel', para)
    return () => { cancelAnimationFrame(raf); m.off('mousedown', para); m.off('touchstart', para); m.off('wheel', para) }
  }, [listo, gira, quieto])

  return (
    <figure className="ex-vuelo">
      <div ref={caja} className="ex-vuelo-mapa" role="region" aria-label={etiqueta} />
      {!listo && !fallo && <p className="ex-vuelo-aviso">{textos.cargando}</p>}
      {fallo && <p className="ex-vuelo-aviso">{textos.sinWebgl}</p>}
      {listo && !quieto && (
        <button type="button" className="ex-vuelo-giro" onClick={() => setGira((g) => !g)} aria-pressed={gira}>
          {gira ? textos.parar : textos.girar}
        </button>
      )}
    </figure>
  )
}

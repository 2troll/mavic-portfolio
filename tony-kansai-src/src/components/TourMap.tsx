import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapStop {
  name: string
  lat: number
  lng: number
}

function FitBounds({ stops }: { stops: MapStop[] }) {
  const map = useMap()
  useEffect(() => {
    if (stops.length < 2) {
      map.setView([stops[0]?.lat ?? 34.6, stops[0]?.lng ?? 135.5], 14)
      return
    }
    const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [map, stops])
  return null
}

function makeIcon(index: number, accent: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:30px;height:30px;
        background:${accent};
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-size:12px;font-weight:700;
        border:2.5px solid rgba(255,255,255,0.9);
        box-shadow:0 3px 12px rgba(0,0,0,0.6);
        font-family:system-ui,sans-serif;
      ">${index + 1}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  })
}

interface TourMapProps {
  stops: MapStop[]
  accent?: string
  meetingPoint?: string
}

export function TourMap({ stops, accent = '#E53030', meetingPoint }: TourMapProps) {
  const positions = stops.map(s => [s.lat, s.lng] as [number, number])

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl overflow-hidden border border-white/8"
        style={{ height: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
      >
        <MapContainer
          center={[stops[0]?.lat ?? 34.6, stops[0]?.lng ?? 135.5]}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          <FitBounds stops={stops} />

          {/* Subtle white shadow line underneath */}
          <Polyline
            positions={positions}
            color="rgba(255,255,255,0.08)"
            weight={7}
          />
          {/* Main route line */}
          <Polyline
            positions={positions}
            color={accent}
            weight={3}
            opacity={0.85}
            dashArray="10 6"
          />

          {stops.map((stop, i) => (
            <Marker
              key={i}
              position={[stop.lat, stop.lng]}
              icon={makeIcon(i, accent)}
            >
              <Popup
                closeButton={false}
                className="tour-map-popup"
              >
                <div style={{
                  background: '#1a1c2e',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: `1px solid ${accent}40`,
                }}>
                  <span style={{ color: accent, marginRight: 6 }}>{i + 1}.</span>
                  {stop.name}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Stop list */}
      <div className="flex flex-wrap gap-2">
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-white/50">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ background: `${accent}30`, color: accent }}
            >{i + 1}</span>
            {stop.name}
            {i < stops.length - 1 && <span className="text-white/15 ml-1">›</span>}
          </div>
        ))}
      </div>

      {meetingPoint && (
        <p className="text-white/25 text-xs">Meeting point: {meetingPoint}</p>
      )}
    </div>
  )
}

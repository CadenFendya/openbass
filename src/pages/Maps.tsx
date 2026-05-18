import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function Maps() {
  const { location, profile } = usePrediction();

  return <main className="screen stack">
    <div className="desktop-header">
      <div>
        <p className="eyebrow">Water map</p>
        <h1>Maps</h1>
      </div>
      <div className="map-location-pill">{location.name}</div>
    </div>

    <Card className="map-card">
      <div className="themed-map-shell">
        <MapContainer
          key={location.id}
          center={[location.latitude, location.longitude]}
          zoom={14}
          scrollWheelZoom
          className="themed-map"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          />
          <TileLayer
            attribution='Water labels from OpenStreetMap'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            opacity={0.18}
            className="water-highlight-layer"
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              <strong>{location.name}</strong>
              <br />
              {location.waterbodyType}
              <br />
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Popup>
          </Marker>
        </MapContainer>
        <div className="map-glow-overlay" />
      </div>
    </Card>

    <Card>
      <h2>Detected profile</h2>
      <div className="chips">
        <span>{location.waterbodyType}</span>
        <span>{profile.grass ? 'grass' : 'no grass'}</span>
        <span>{profile.wood ? 'wood' : 'no wood'}</span>
        <span>{profile.rock ? 'rock' : 'no rock'}</span>
        <span>{profile.clarity}</span>
        <span>{profile.current}</span>
      </div>
      <p className="muted">Dark map tiles keep the dashboard theme. The subtle OSM overlay helps waterbody names, roads, lakes, rivers, and landmarks stay readable.</p>
    </Card>
  </main>;
}

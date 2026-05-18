import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function Maps() {
  const { location, profile } = usePrediction();
  const position: [number, number] = [location.latitude, location.longitude];

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
          center={position}
          zoom={14}
          scrollWheelZoom
          className="themed-map"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          />
          <Circle
            center={position}
            radius={650}
            pathOptions={{ color: '#75f6c8', fillColor: '#5ccaff', fillOpacity: 0.12, weight: 2 }}
          />
          <Marker position={position}>
            <Popup>
              <strong>{location.name}</strong>
              <br />
              {location.waterbodyType}
              <br />
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Popup>
          </Marker>
        </MapContainer>
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
      <p className="muted">The dark map uses OpenStreetMap/CARTO labels. The cyan radius highlights the active fishing area around your selected spot.</p>
    </Card>
  </main>;
}

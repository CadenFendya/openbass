import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function Maps() {
  const { location, profile } = usePrediction();

  return <main className="screen stack">
    <h1>Maps</h1>

    <Card>
      <div style={{ overflow:'hidden', borderRadius:'22px' }}>
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={14}
          scrollWheelZoom
          style={{ height:'420px', width:'100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
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
      </div>
    </Card>

    <Card>
      <h2>Detected profile</h2>
      <div className="chips">
        <span>{profile.grass ? 'grass' : 'no grass'}</span>
        <span>{profile.wood ? 'wood' : 'no wood'}</span>
        <span>{profile.rock ? 'rock' : 'no rock'}</span>
        <span>{profile.clarity}</span>
        <span>{profile.current}</span>
      </div>
      <p className="muted">Switching saved locations automatically moves the map and weather source.</p>
    </Card>
  </main>;
}

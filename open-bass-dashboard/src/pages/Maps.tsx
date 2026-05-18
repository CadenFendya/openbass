import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function Maps() {
  const { location, profile } = usePrediction();
  return <main className="screen stack"><h1>Maps</h1><Card><div className="map-placeholder"><span>{location.name}</span><p>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p></div></Card><Card><h2>Marked cover</h2><div className="chips"><span>grass {profile.grass ? 'yes' : 'no'}</span><span>pads {profile.pads ? 'yes' : 'no'}</span><span>wood {profile.wood ? 'yes' : 'no'}</span><span>rock {profile.rock ? 'yes' : 'no'}</span><span>{profile.shoreType}</span></div><p className="muted">Leaflet is included in dependencies; this starter keeps the map placeholder lightweight so mobile performance stays fast. Add tile layers and editable markers in the next milestone.</p></Card></main>;
}

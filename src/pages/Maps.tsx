import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { Circle, GeoJSON, MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

type WaterFeature = {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: {
    id: number;
    name: string;
    kind: string;
    fishingType: string;
    center: [number, number];
  };
};

type WaterCollection = {
  type: 'FeatureCollection';
  features: WaterFeature[];
};

type BoundsBox = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export function Maps() {
  const { location, profile } = usePrediction();
  const position: [number, number] = [location.latitude, location.longitude];
  const [waters, setWaters] = useState<WaterCollection>({ type: 'FeatureCollection', features: [] });
  const [mapStatus, setMapStatus] = useState('Move or zoom the map to load visible water bodies.');
  const [bounds, setBounds] = useState<BoundsBox | null>(null);

  useEffect(() => {
    if (!bounds) return;
    let cancelled = false;
    setMapStatus('Loading all visible water bodies...');
    fetchVisibleWater(bounds)
      .then(collection => {
        if (cancelled) return;
        setWaters(collection);
        setMapStatus(collection.features.length ? `Highlighted ${collection.features.length} visible water bodies.` : 'No mapped water bodies found in this view.');
      })
      .catch(() => {
        if (cancelled) return;
        setWaters({ type: 'FeatureCollection', features: [] });
        setMapStatus('Water overlay unavailable or this map view is too large. Zoom in and try again.');
      });
    return () => { cancelled = true; };
  }, [bounds?.south, bounds?.west, bounds?.north, bounds?.east]);

  const waterLabels = useMemo(() => waters.features.filter(feature => feature.properties.name).slice(0, 30), [waters]);

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
          <BoundsWatcher onBoundsChange={setBounds} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          />

          {waters.features.length > 0 && <GeoJSON
            key={`${location.id}-${waters.features.length}-${bounds?.south}-${bounds?.west}`}
            data={waters as GeoJSON.FeatureCollection}
            style={() => ({
              color: '#75f6c8',
              fillColor: '#22d3ee',
              fillOpacity: 0.32,
              opacity: 0.95,
              weight: 2.5
            })}
            onEachFeature={(feature, layer) => {
              const props = feature.properties as WaterFeature['properties'];
              layer.bindPopup(`<strong>${props.name || 'Unnamed water'}</strong><br/>${props.fishingType}<br/>${props.kind}`);
            }}
          />}

          {waterLabels.map(feature => <Marker
            key={`label-${feature.properties.id}`}
            position={feature.properties.center}
            icon={L.divIcon({ className: 'water-name-label', html: feature.properties.name })}
            interactive={false}
          />)}

          <Circle
            center={position}
            radius={650}
            pathOptions={{ color: '#75f6c8', fillColor: '#5ccaff', fillOpacity: 0.08, weight: 2 }}
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
      <h2>Visible water analysis</h2>
      <p className="muted">{mapStatus}</p>
      {waters.features.length > 0 && <div className="water-list">
        {waters.features.slice(0, 10).map(feature => <div className="water-row" key={feature.properties.id}>
          <strong>{feature.properties.name || 'Unnamed water'}</strong>
          <span>{feature.properties.fishingType}</span>
        </div>)}
      </div>}
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
      <p className="muted">The overlay now loads water bodies for the current map view. Pan or zoom and the app reloads lakes, ponds, reservoirs, and rivers inside the visible bounds.</p>
    </Card>
  </main>;
}

function BoundsWatcher({ onBoundsChange }: { onBoundsChange: (bounds: BoundsBox) => void }) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(boundsFromMap(map)),
    zoomend: () => onBoundsChange(boundsFromMap(map))
  });

  useEffect(() => {
    onBoundsChange(boundsFromMap(map));
  }, [map, onBoundsChange]);

  return null;
}

function boundsFromMap(map: L.Map): BoundsBox {
  const bounds = map.getBounds();
  return {
    south: roundCoord(bounds.getSouth()),
    west: roundCoord(bounds.getWest()),
    north: roundCoord(bounds.getNorth()),
    east: roundCoord(bounds.getEast())
  };
}

async function fetchVisibleWater(bounds: BoundsBox): Promise<WaterCollection> {
  const span = Math.abs(bounds.north - bounds.south) + Math.abs(bounds.east - bounds.west);
  if (span > 0.35) throw new Error('Map view is too large for live Overpass overlay');

  const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  const query = `
    [out:json][timeout:18];
    (
      way["natural"="water"](${bbox});
      relation["natural"="water"](${bbox});
      way["water"~"lake|pond|reservoir|basin"](${bbox});
      relation["water"~"lake|pond|reservoir|basin"](${bbox});
      way["waterway"="riverbank"](${bbox});
      relation["waterway"="riverbank"](${bbox});
    );
    out tags center geom 35;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({ data: query })
  });
  if (!response.ok) throw new Error('Overpass request failed');
  const data = await response.json();

  const features = (data.elements ?? [])
    .map(overpassElementToFeature)
    .filter(Boolean)
    .slice(0, 75) as WaterFeature[];

  return { type: 'FeatureCollection', features };
}

function overpassElementToFeature(element: any): WaterFeature | null {
  if (!element.geometry || element.geometry.length < 3) return null;
  const coordinates = element.geometry.map((point: { lat: number; lon: number }) => [point.lon, point.lat]);
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  const closed = first && last && first[0] === last[0] && first[1] === last[1];
  const polygonCoordinates = closed ? coordinates : [...coordinates, first];
  const center: [number, number] = element.center ? [element.center.lat, element.center.lon] : calculateCenter(element.geometry);
  const name = element.tags?.name || element.tags?.['gnis:name'] || '';
  const kind = element.tags?.water || element.tags?.natural || element.tags?.waterway || 'water';

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [polygonCoordinates]
    },
    properties: {
      id: element.id,
      name,
      kind,
      fishingType: classifyWater(kind, name),
      center
    }
  };
}

function calculateCenter(points: Array<{ lat: number; lon: number }>): [number, number] {
  const total = points.reduce((acc, point) => ({ lat: acc.lat + point.lat, lon: acc.lon + point.lon }), { lat: 0, lon: 0 });
  return [total.lat / points.length, total.lon / points.length];
}

function classifyWater(kind: string, name: string) {
  const value = `${kind} ${name}`.toLowerCase();
  if (value.includes('river')) return 'river/current target';
  if (value.includes('reservoir')) return 'reservoir target';
  if (value.includes('pond')) return 'pond target';
  if (value.includes('lake')) return 'lake target';
  return 'fishable water';
}

function roundCoord(value: number) {
  return Math.round(value * 10000) / 10000;
}

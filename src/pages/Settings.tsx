import { FormEvent, useState } from 'react';
import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import type { LocationProfile, WaterbodyProfile, WaterbodyType } from '../types';

const waterDefaults: Record<WaterbodyType, Omit<WaterbodyProfile, 'locationId'>> = {
  pond: {
    averageDepthFt: 6,
    maxDepthFt: 12,
    clarity: 'stained',
    vegetation: true,
    grass: true,
    pads: false,
    wood: true,
    rock: false,
    shoreType: 'small bank-access pond',
    current: 'none',
    waterColor: 'green stained'
  },
  lake: {
    averageDepthFt: 14,
    maxDepthFt: 35,
    clarity: 'slightly stained',
    vegetation: true,
    grass: true,
    pads: false,
    wood: true,
    rock: true,
    shoreType: 'mixed shoreline, docks, weed edges, points',
    current: 'none',
    waterColor: 'natural stained'
  },
  river: {
    averageDepthFt: 5,
    maxDepthFt: 16,
    clarity: 'stained',
    vegetation: false,
    grass: false,
    pads: false,
    wood: true,
    rock: true,
    shoreType: 'current seams, laydowns, rock, eddies',
    current: 'moderate',
    waterColor: 'stained current'
  },
  reservoir: {
    averageDepthFt: 18,
    maxDepthFt: 55,
    clarity: 'slightly stained',
    vegetation: true,
    grass: false,
    pads: false,
    wood: true,
    rock: true,
    shoreType: 'points, creek arms, brush, ledges',
    current: 'light',
    waterColor: 'stained to clear'
  },
  creek: {
    averageDepthFt: 3,
    maxDepthFt: 8,
    clarity: 'stained',
    vegetation: false,
    grass: false,
    pads: false,
    wood: true,
    rock: true,
    shoreType: 'pools, current breaks, undercut banks',
    current: 'light',
    waterColor: 'stained shallow flow'
  }
};

const defaultForm = {
  name: '',
  latitude: '',
  longitude: '',
  waterbodyType: 'pond' as WaterbodyType
};

export function Settings() {
  const { locations, activeLocationId, waterbodies, setActiveLocation, addLocation } = useAppStore();
  const location = locations.find(l => l.id === activeLocationId) ?? locations[0];
  const profile = waterbodies[activeLocationId] ?? waterbodies[location.id];
  const [form, setForm] = useState(defaultForm);
  const [gpsType, setGpsType] = useState<WaterbodyType>('pond');
  const [status, setStatus] = useState('');

  function saveLocation(event: FormEvent) {
    event.preventDefault();
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    if (!form.name.trim() || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setStatus('Add a spot name plus valid latitude and longitude.');
      return;
    }
    addSmartLocation(form.name, latitude, longitude, form.waterbodyType);
    setForm(defaultForm);
    setStatus('Spot saved. Weather and lure recommendations now use this water type.');
  }

  function useGps() {
    if (!navigator.geolocation) {
      setStatus('GPS is not supported by this browser.');
      return;
    }
    setStatus('Requesting GPS permission...');
    navigator.geolocation.getCurrentPosition(
      position => {
        addSmartLocation('Current GPS Spot', position.coords.latitude, position.coords.longitude, gpsType);
        setStatus('GPS spot saved and selected. Weather now pulls from your current coordinates.');
      },
      error => setStatus(`GPS failed: ${error.message}`),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function addSmartLocation(name: string, latitude: number, longitude: number, waterbodyType: WaterbodyType) {
    const id = slugify(`${name}-${Date.now()}`);
    const nextLocation: LocationProfile = {
      id,
      name: name.trim(),
      latitude,
      longitude,
      state: '',
      country: 'US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Detroit',
      waterbodyType,
      favorite: true
    };
    addLocation(nextLocation, { locationId: id, ...waterDefaults[waterbodyType] });
  }

  return <main className="screen stack desktop-page">
    <header className="desktop-header">
      <div>
        <p className="eyebrow">Weather source</p>
        <h1>Location Settings</h1>
      </div>
    </header>

    <div className="desktop-grid two-column">
      <Card>
        <h2>Active spot</h2>
        <p className="big-value">{location.name}</p>
        <p>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
        <div className="chips">
          <span>{location.waterbodyType}</span>
          <span>{profile?.clarity ?? 'auto'} clarity</span>
          <span>avg {profile?.averageDepthFt ?? '?'} ft</span>
          <span>{profile?.shoreType ?? 'auto profile'}</span>
        </div>
        <label className="field-label">Switch saved spot</label>
        <select className="clean-input" value={activeLocationId} onChange={event => setActiveLocation(event.target.value)}>
          {locations.map(saved => <option key={saved.id} value={saved.id}>{saved.name}</option>)}
        </select>
      </Card>

      <Card>
        <h2>Use GPS</h2>
        <p className="muted">Pick the kind of water you are fishing, then let the app use your current coordinates for weather.</p>
        <label className="field-label">Water type</label>
        <select className="clean-input" value={gpsType} onChange={event => setGpsType(event.target.value as WaterbodyType)}>
          <option value="pond">Pond</option>
          <option value="lake">Lake</option>
          <option value="river">River</option>
          <option value="reservoir">Reservoir</option>
          <option value="creek">Creek</option>
        </select>
        <button className="primary desktop-action full-button" onClick={useGps}>Use Current GPS Location</button>
        {status && <p className="status-text">{status}</p>}
      </Card>
    </div>

    <Card>
      <h2>Add a spot manually</h2>
      <p className="muted">Only enter the basics. The app estimates depth, cover, clarity, current, and structure from the water type so lure recommendations update automatically.</p>
      <form className="settings-form simple-location-form" onSubmit={saveLocation}>
        <label>Spot name<input className="clean-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Reeds Lake, Grand River, farm pond..." /></label>
        <label>Latitude<input className="clean-input" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="42.9634" /></label>
        <label>Longitude<input className="clean-input" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="-85.6681" /></label>
        <label>Water type<select className="clean-input" value={form.waterbodyType} onChange={e => setForm({ ...form, waterbodyType: e.target.value as WaterbodyType })}><option value="pond">Pond</option><option value="lake">Lake</option><option value="river">River</option><option value="reservoir">Reservoir</option><option value="creek">Creek</option></select></label>
        <button className="primary desktop-action" type="submit">Save spot</button>
      </form>
    </Card>
  </main>;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

import { FormEvent, useState } from 'react';
import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import type { GearSetup, LocationProfile, WaterbodyProfile, WaterbodyType, Clarity } from '../types';

const baitOptions = [
  'chatterbait','spinnerbait','swim-jig','texas-rig','frog','toad','drop-shot','ned-rig','wacky-rig','jig','pitching-jig','football-jig','squarebill','lipless-crankbait','medium-crankbait','swimbait','jerkbait','buzzbait','tube','punch-rig','a-rig'
];

const defaultLocationForm = {
  name: '',
  latitude: '',
  longitude: '',
  state: '',
  country: 'US',
  timezone: 'America/Detroit',
  waterbodyType: 'pond' as WaterbodyType,
  averageDepthFt: '6',
  maxDepthFt: '12',
  clarity: 'stained' as Clarity,
  shoreType: 'bank',
  current: 'none' as WaterbodyProfile['current'],
  waterColor: 'green stained',
  vegetation: true,
  grass: true,
  pads: false,
  wood: true,
  rock: false
};

const defaultGearForm = {
  name: '',
  rod: '',
  reel: '',
  line: '',
  bestFor: [] as string[]
};

export function Settings() {
  const {
    locations,
    activeLocationId,
    waterbodies,
    gear,
    setActiveLocation,
    addLocation,
    addGear,
    removeGear
  } = useAppStore();

  const location = locations.find(l => l.id === activeLocationId) ?? locations[0];
  const profile = waterbodies[activeLocationId] ?? waterbodies[location.id];
  const [locationForm, setLocationForm] = useState(defaultLocationForm);
  const [gearForm, setGearForm] = useState(defaultGearForm);
  const [gpsStatus, setGpsStatus] = useState('');

  function addManualLocation(event: FormEvent) {
    event.preventDefault();
    const latitude = Number(locationForm.latitude);
    const longitude = Number(locationForm.longitude);
    if (!locationForm.name.trim() || Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    const id = slugify(`${locationForm.name}-${Date.now()}`);
    const nextLocation: LocationProfile = {
      id,
      name: locationForm.name.trim(),
      latitude,
      longitude,
      state: locationForm.state.trim(),
      country: locationForm.country.trim() || 'US',
      timezone: locationForm.timezone.trim() || 'America/Detroit',
      waterbodyType: locationForm.waterbodyType,
      favorite: true
    };

    const nextProfile: WaterbodyProfile = {
      locationId: id,
      averageDepthFt: Number(locationForm.averageDepthFt) || 6,
      maxDepthFt: Number(locationForm.maxDepthFt) || 12,
      clarity: locationForm.clarity,
      vegetation: locationForm.vegetation,
      grass: locationForm.grass,
      pads: locationForm.pads,
      wood: locationForm.wood,
      rock: locationForm.rock,
      shoreType: locationForm.shoreType || 'bank',
      current: locationForm.current,
      waterColor: locationForm.waterColor || 'unknown'
    };

    addLocation(nextLocation, nextProfile);
    setLocationForm(defaultLocationForm);
  }

  function useCurrentGps() {
    if (!navigator.geolocation) {
      setGpsStatus('GPS is not supported by this browser.');
      return;
    }

    setGpsStatus('Requesting GPS location...');
    navigator.geolocation.getCurrentPosition(
      position => {
        const id = `gps-${Date.now()}`;
        const nextLocation: LocationProfile = {
          id,
          name: 'Current GPS Spot',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          state: '',
          country: 'US',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Detroit',
          waterbodyType: 'pond',
          favorite: true
        };
        const nextProfile: WaterbodyProfile = {
          ...defaultWaterProfile(id),
          shoreType: 'GPS spot'
        };
        addLocation(nextLocation, nextProfile);
        setGpsStatus('GPS spot saved and selected. Weather will now pull from those coordinates.');
      },
      error => setGpsStatus(`GPS failed: ${error.message}`),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function addSetup(event: FormEvent) {
    event.preventDefault();
    if (!gearForm.name.trim() || !gearForm.rod.trim() || !gearForm.line.trim()) return;

    const setup: GearSetup = {
      id: slugify(`${gearForm.name}-${Date.now()}`),
      name: gearForm.name.trim(),
      rod: gearForm.rod.trim(),
      reel: gearForm.reel.trim() || undefined,
      line: gearForm.line.trim(),
      bestFor: gearForm.bestFor
    };

    addGear(setup);
    setGearForm(defaultGearForm);
  }

  return <main className="screen stack desktop-page">
    <header className="desktop-header">
      <div>
        <p className="eyebrow">Dashboard controls</p>
        <h1>Settings</h1>
      </div>
      <button className="primary desktop-action" onClick={useCurrentGps}>Use Current GPS Location</button>
    </header>

    <div className="desktop-grid two-column">
      <Card>
        <h2>Active weather location</h2>
        <p>{location.name}</p>
        <p>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
        <label className="field-label">Switch saved spot</label>
        <select value={activeLocationId} onChange={event => setActiveLocation(event.target.value)}>
          {locations.map(saved => <option key={saved.id} value={saved.id}>{saved.name}</option>)}
        </select>
        <p className="muted">Changing this updates the weather coordinates and bait recommendations.</p>
        {gpsStatus && <p className="status-text">{gpsStatus}</p>}
      </Card>

      <Card>
        <h2>Current water profile</h2>
        <div className="chips">
          <span>{location.waterbodyType}</span>
          <span>{profile?.clarity ?? 'unknown'} clarity</span>
          <span>avg {profile?.averageDepthFt ?? '?'} ft</span>
          <span>max {profile?.maxDepthFt ?? '?'} ft</span>
        </div>
        <p className="muted">These details help the bait engine estimate water temp, cover, clarity, and presentation style.</p>
      </Card>
    </div>

    <Card>
      <h2>Add lake, pond, river, or GPS spot</h2>
      <form className="settings-form" onSubmit={addManualLocation}>
        <div className="form-grid">
          <label>Spot name<input value={locationForm.name} onChange={e => setLocationForm({ ...locationForm, name: e.target.value })} placeholder="Reeds Lake, farm pond, Grand River..." /></label>
          <label>Latitude<input value={locationForm.latitude} onChange={e => setLocationForm({ ...locationForm, latitude: e.target.value })} placeholder="42.9634" /></label>
          <label>Longitude<input value={locationForm.longitude} onChange={e => setLocationForm({ ...locationForm, longitude: e.target.value })} placeholder="-85.6681" /></label>
          <label>Type<select value={locationForm.waterbodyType} onChange={e => setLocationForm({ ...locationForm, waterbodyType: e.target.value as WaterbodyType })}><option value="pond">Pond</option><option value="lake">Lake</option><option value="river">River</option><option value="reservoir">Reservoir</option><option value="creek">Creek</option></select></label>
          <label>State<input value={locationForm.state} onChange={e => setLocationForm({ ...locationForm, state: e.target.value })} placeholder="Michigan" /></label>
          <label>Clarity<select value={locationForm.clarity} onChange={e => setLocationForm({ ...locationForm, clarity: e.target.value as Clarity })}><option value="clear">Clear</option><option value="slightly stained">Slightly stained</option><option value="stained">Stained</option><option value="muddy">Muddy</option></select></label>
          <label>Avg depth<input value={locationForm.averageDepthFt} onChange={e => setLocationForm({ ...locationForm, averageDepthFt: e.target.value })} /></label>
          <label>Max depth<input value={locationForm.maxDepthFt} onChange={e => setLocationForm({ ...locationForm, maxDepthFt: e.target.value })} /></label>
          <label>Shore / structure<input value={locationForm.shoreType} onChange={e => setLocationForm({ ...locationForm, shoreType: e.target.value })} /></label>
          <label>Water color<input value={locationForm.waterColor} onChange={e => setLocationForm({ ...locationForm, waterColor: e.target.value })} /></label>
        </div>
        <div className="check-grid">
          {(['vegetation','grass','pads','wood','rock'] as const).map(key => <label key={key} className="check-pill"><input type="checkbox" checked={locationForm[key]} onChange={e => setLocationForm({ ...locationForm, [key]: e.target.checked })} />{key}</label>)}
        </div>
        <button className="primary desktop-action" type="submit">Save location</button>
      </form>
    </Card>

    <Card>
      <h2>Rod setup editor</h2>
      <form className="settings-form" onSubmit={addSetup}>
        <div className="form-grid">
          <label>Setup name<input value={gearForm.name} onChange={e => setGearForm({ ...gearForm, name: e.target.value })} placeholder="MH moving bait setup" /></label>
          <label>Rod<input value={gearForm.rod} onChange={e => setGearForm({ ...gearForm, rod: e.target.value })} placeholder="7'3 Medium Heavy Fast" /></label>
          <label>Reel<input value={gearForm.reel} onChange={e => setGearForm({ ...gearForm, reel: e.target.value })} placeholder="Optional" /></label>
          <label>Line<input value={gearForm.line} onChange={e => setGearForm({ ...gearForm, line: e.target.value })} placeholder="15 lb fluorocarbon" /></label>
        </div>
        <p className="muted">Pick what this setup can throw. Matching setups boost recommendations.</p>
        <div className="check-grid bait-check-grid">
          {baitOptions.map(bait => <label key={bait} className="check-pill"><input type="checkbox" checked={gearForm.bestFor.includes(bait)} onChange={e => setGearForm({ ...gearForm, bestFor: e.target.checked ? [...gearForm.bestFor, bait] : gearForm.bestFor.filter(item => item !== bait) })} />{bait}</label>)}
        </div>
        <button className="primary desktop-action" type="submit">Add setup</button>
      </form>
    </Card>

    <Card>
      <h2>Saved setups</h2>
      {gear.length === 0 && <p className="muted">No setups saved yet. Add one above to make recommendations match your rods, reels, and line.</p>}
      {gear.map(setup => <div className="bait-row gear-row" key={setup.id}>
        <div>
          <strong>{setup.name}</strong>
          <p>{setup.rod}{setup.reel ? ` • ${setup.reel}` : ''}</p>
          <small>{setup.line}</small>
          <div className="chips compact-chips">{setup.bestFor.map(bait => <span key={bait}>{bait}</span>)}</div>
        </div>
        <button className="danger-button" onClick={() => removeGear(setup.id)}>Delete</button>
      </div>)}
    </Card>
  </main>;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function defaultWaterProfile(locationId: string): WaterbodyProfile {
  return {
    locationId,
    averageDepthFt: 6,
    maxDepthFt: 12,
    clarity: 'stained',
    vegetation: true,
    grass: true,
    pads: false,
    wood: true,
    rock: false,
    shoreType: 'bank',
    current: 'none',
    waterColor: 'unknown'
  };
}

import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';

export function Settings() {
  const { locations, activeLocationId, waterbodies, gear } = useAppStore();
  const location = locations.find(l => l.id === activeLocationId)!;
  const profile = waterbodies[activeLocationId];
  return <main className="screen stack"><h1>Settings</h1><Card><h2>Active spot</h2><p>{location.name}</p><p>{location.waterbodyType} • {profile.clarity} • avg depth {profile.averageDepthFt} ft</p></Card><Card><h2>My gear</h2>{gear.map(g => <div className="bait-row" key={g.id}><div><strong>{g.name}</strong><p>{g.rod}</p><small>{g.line}</small></div></div>)}</Card><Card><h2>Open source</h2><p>MIT licensed, mobile-first PWA, local-first storage, Open-Meteo weather, rule-based AI engine, and modular services.</p></Card></main>;
}

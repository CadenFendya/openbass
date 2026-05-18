import { ActivityRing } from '../components/ActivityRing';
import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function Home() {
  const { prediction, weather, location, source } = usePrediction();
  if (!prediction || !weather) return <main className="screen"><Card>Loading fishing intelligence...</Card></main>;
  const c = weather.current;
  const d = weather.daily[0];
  return <main className="screen stack">
    <header className="hero"><div><p className="eyebrow">{location.name} • {source === 'live' ? 'Live Open-Meteo' : 'Demo fallback'}</p><h1>Open Bass Dashboard</h1></div><ActivityRing score={prediction.activityScore}/></header>
    <Card className="summary-card"><h2>{prediction.pattern}</h2><p>{prediction.summary}</p></Card>
    <div className="grid two">
      <Metric label="Air" value={`${Math.round(c.temperatureF)}°F`} />
      <Metric label="Water est." value={`${prediction.water.waterTempF}°F`} />
      <Metric label="Wind" value={`${Math.round(c.windMph)} mph`} />
      <Metric label="Clouds" value={`${c.cloudCover}%`} />
      <Metric label="Pressure" value={`${Math.round(c.pressureHpa)} hPa`} />
      <Metric label="Rain" value={`${c.rainChance}%`} />
      <Metric label="Sunrise" value={String(d.sunrise).slice(-5)} />
      <Metric label="Sunset" value={String(d.sunset).slice(-5)} />
    </div>
    <Card><h2>Top baits now</h2><div className="bait-list">{prediction.topBaits.slice(0,5).map(r => <div className="bait-row" key={r.bait.id}><div><strong>{r.bait.name}</strong><p>{r.reason}</p></div><span>{r.confidence}%</span></div>)}</div></Card>
  </main>;
}
function Metric({ label, value }: { label: string; value: string }) { return <Card className="metric"><span>{label}</span><strong>{value}</strong></Card>; }

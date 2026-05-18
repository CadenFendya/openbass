import { Card } from '../components/Card';
import { BAITS } from '../data/baits';
import { usePrediction } from '../hooks/usePrediction';

export function Baits() {
  const { prediction } = usePrediction();
  const ranked = prediction?.topBaits ?? [];
  return <main className="screen stack"><h1>Baits</h1>
    <Card><h2>Best bait timeline</h2>{prediction?.hourlyPlan.slice(0,8).map(slot => <div className="timeline" key={slot.time}><span>{new Date(slot.time).toLocaleTimeString([], { hour: 'numeric' })}</span><strong>{slot.score}/100</strong><p>{slot.baits.map(b => b.bait.name).join(' • ')}</p></div>)}</Card>
    <Card><h2>Top 10 today</h2>{ranked.map(r => <div className="bait-row" key={r.bait.id}><div><strong>{r.bait.name}</strong><p>{r.bait.why}</p><small>{r.gear ? `Use: ${r.gear.name}` : r.bait.rod}</small></div><span>{r.confidence}%</span></div>)}</Card>
    <Card><h2>Complete bait database</h2>{BAITS.map(b => <details key={b.id}><summary>{b.name}</summary><p>{b.retrieve}</p><p>Colors: {b.colors.join(', ')}</p><p>Line: {b.line} • Rod: {b.rod}</p></details>)}</Card>
  </main>;
}

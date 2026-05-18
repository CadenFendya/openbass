import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';

export function Logbook() {
  const { logs, addLog, activeLocationId } = useAppStore();
  return <main className="screen stack"><h1>Logbook</h1><button className="primary" onClick={() => addLog({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), species: 'Largemouth bass', bait: 'Chatterbait', locationId: activeLocationId, weatherSummary: 'Auto weather snapshot coming next milestone', notes: 'Quick catch entry' })}>+ Quick catch</button><Card><h2>Pattern insights</h2><p>{logs.length ? `You have ${logs.length} catches. Pattern mining will improve as you log more fish.` : 'No catches yet. Start logging bait, water clarity, weather, and location to generate patterns.'}</p></Card>{logs.map(l => <Card key={l.id}><h2>{l.species}</h2><p>{l.bait} • {new Date(l.createdAt).toLocaleString()}</p><p>{l.notes}</p></Card>)}</main>;
}

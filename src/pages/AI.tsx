import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function AI() {
  const { prediction } = usePrediction();
  return <main className="screen stack"><h1>AI</h1><Card><h2>Fishing engine reasoning</h2><p>{prediction?.summary}</p><p>{prediction?.water.reasoning}</p></Card><Card><h2>What to do first</h2><ol>{prediction?.topBaits.slice(0,3).map(r => <li key={r.bait.id}><strong>{r.bait.name}:</strong> {r.bait.retrieve} {r.gear ? `Use ${r.gear.name}.` : ''}</li>)}</ol></Card></main>;
}

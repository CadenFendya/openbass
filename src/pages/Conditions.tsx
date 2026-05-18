import { Card } from '../components/Card';
import { usePrediction } from '../hooks/usePrediction';

export function Conditions() {
  const { prediction, weather } = usePrediction();
  if (!prediction || !weather) return <main className="screen"><Card>Loading...</Card></main>;
  return <main className="screen stack">
    <h1>Conditions</h1>
    <Card><h2>Water estimation AI</h2><p>{prediction.water.reasoning}</p><div className="chips"><span>{prediction.water.clarityTrend}</span><span>oxygen {prediction.water.oxygenActivity}</span><span>turnover {prediction.water.turnoverRisk}</span></div></Card>
    <Card><h2>Moon / solunar</h2><p>{prediction.moon.phaseName} • {prediction.moon.illumination}% illumination • influence {prediction.moon.influenceScore}/100</p><p>Major: {prediction.moon.majorPeriods.join(', ')}</p><p>Minor: {prediction.moon.minorPeriods.join(', ')}</p></Card>
    <Card><h2>Hourly forecast</h2>{weather.hourly.slice(0,12).map(h => <div className="hour" key={h.time}><span>{new Date(h.time).toLocaleTimeString([], { hour: 'numeric' })}</span><strong>{Math.round(h.temperatureF)}°</strong><span>{Math.round(h.windMph)} mph</span><span>{h.cloudCover}% clouds</span></div>)}</Card>
  </main>;
}

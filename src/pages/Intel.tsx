import { ExternalLink } from 'lucide-react';
import { Card } from '../components/Card';
import { INTEL_FEEDS, FUTURE_INTEL_MODULES } from '../data/intelFeeds';
import { usePrediction } from '../hooks/usePrediction';
import { buildYoutubeSearch, getPackChecklist, getRodRecommendation, getSolunarHeatmap, getFishPositioning } from '../engine/fieldIntel';

export function Intel() {
  const { prediction, weather, profile, location } = usePrediction();
  if (!prediction || !weather || !profile) return <main className="screen"><Card>Loading intel...</Card></main>;

  const positions = getFishPositioning(prediction, profile);
  const checklist = getPackChecklist(prediction, weather);
  const rod = getRodRecommendation(prediction);
  const heatmap = getSolunarHeatmap(prediction);
  const youtubeUrl = buildYoutubeSearch(prediction, location.waterbodyType);

  return <main className="screen stack desktop-page">
    <div className="desktop-header">
      <div>
        <p className="eyebrow">Fishing operating system</p>
        <h1>Intel</h1>
      </div>
      <a className="primary desktop-action link-button" href={youtubeUrl} target="_blank" rel="noreferrer">Condition Videos <ExternalLink size={16}/></a>
    </div>

    <div className="desktop-grid two-column">
      <Card>
        <h2>Where fish are positioned</h2>
        {positions.map(position => <div className="intel-row" key={position.zone}>
          <div><strong>{position.zone}</strong><p>{position.reason}</p></div>
          <span>{position.confidence}%</span>
        </div>)}
      </Card>

      <Card>
        <h2>What rod should I bring?</h2>
        <p className="big-value">{rod}</p>
        <p className="muted">This is based on the highest-confidence bait/pattern right now.</p>
      </Card>
    </div>

    <div className="desktop-grid two-column">
      <Card>
        <h2>Pack for today</h2>
        <div className="checklist">
          {checklist.map(item => <label key={item} className="check-pill"><input type="checkbox" />{item}</label>)}
        </div>
      </Card>

      <Card>
        <h2>Moon / solunar heatmap</h2>
        <div className="solunar-grid">
          {heatmap.map(slot => <div className="solunar-cell" key={slot.time}>
            <strong>{slot.time}</strong>
            <span>{slot.score}</span>
            <small>{slot.strength}</small>
          </div>)}
        </div>
      </Card>
    </div>

    <Card>
      <h2>Fishing news, Reddit, deals, and guides</h2>
      <div className="intel-feed-grid">
        {INTEL_FEEDS.map(item => <a className="intel-card" href={item.url} target="_blank" rel="noreferrer" key={item.id}>
          <span>{item.category}</span>
          <strong>{item.title}</strong>
          <p>{item.summary}</p>
          <small>{item.source} • {item.tags.join(', ')}</small>
        </a>)}
      </div>
    </Card>

    <Card>
      <h2>Next modules planned</h2>
      <div className="chips">{FUTURE_INTEL_MODULES.map(module => <span key={module}>{module}</span>)}</div>
    </Card>
  </main>;
}

import { ExternalLink, Newspaper, Radio, ShoppingBag, Trophy, Youtube } from 'lucide-react';
import { Card } from '../components/Card';
import { INTEL_FEEDS, FUTURE_INTEL_MODULES } from '../data/intelFeeds';
import { usePrediction } from '../hooks/usePrediction';
import { buildYoutubeSearch, getPackChecklist, getRodRecommendation, getSolunarHeatmap, getFishPositioning } from '../engine/fieldIntel';

const categoryMeta = {
  news: { label: 'News', icon: Newspaper, tone: 'blue' },
  reddit: { label: 'Reddit', icon: Radio, tone: 'green' },
  deal: { label: 'Deals', icon: ShoppingBag, tone: 'gold' },
  guide: { label: 'Guide', icon: Newspaper, tone: 'blue' },
  pro: { label: 'Pro', icon: Trophy, tone: 'gold' },
  local: { label: 'Local', icon: Radio, tone: 'green' },
  video: { label: 'Video', icon: Youtube, tone: 'red' }
} as const;

export function Intel() {
  const { prediction, weather, profile, location } = usePrediction();
  if (!prediction || !weather || !profile) return <main className="screen"><Card>Loading intel...</Card></main>;

  const positions = getFishPositioning(prediction, profile);
  const checklist = getPackChecklist(prediction, weather);
  const rod = getRodRecommendation(prediction);
  const heatmap = getSolunarHeatmap(prediction);
  const youtubeUrl = buildYoutubeSearch(prediction, location.waterbodyType);

  return <main className="screen stack desktop-page intel-page">
    <div className="desktop-header intel-hero">
      <div>
        <p className="eyebrow">Fishing operating system</p>
        <h1>Intel</h1>
        <p className="muted">Strategy, community signals, deals, and trip prep based on today's pattern.</p>
      </div>
      <a className="primary desktop-action link-button" href={youtubeUrl} target="_blank" rel="noreferrer">Condition Videos <ExternalLink size={16}/></a>
    </div>

    <div className="desktop-grid two-column">
      <Card className="intel-panel">
        <h2>Where fish are positioned</h2>
        {positions.map(position => <div className="intel-row" key={position.zone}>
          <div><strong>{position.zone}</strong><p>{position.reason}</p></div>
          <span>{position.confidence}%</span>
        </div>)}
      </Card>

      <Card className="intel-panel rod-card">
        <h2>What rod should I bring?</h2>
        <p className="big-value">{rod}</p>
        <p className="muted">Built from the top bait and highest-confidence pattern right now.</p>
      </Card>
    </div>

    <div className="desktop-grid two-column">
      <Card className="intel-panel">
        <h2>Pack for today</h2>
        <div className="checklist">
          {checklist.map(item => <label key={item} className="check-pill"><input type="checkbox" />{item}</label>)}
        </div>
      </Card>

      <Card className="intel-panel">
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

    <Card className="intel-panel">
      <div className="section-heading">
        <div><h2>News, Reddit, deals, and guides</h2><p className="muted">Open-source feed cards now; live RSS/API fetching can replace these links next.</p></div>
      </div>
      <div className="intel-feed-grid">
        {INTEL_FEEDS.map(item => {
          const meta = categoryMeta[item.category];
          const Icon = meta.icon;
          return <a className="intel-card" href={item.url} target="_blank" rel="noreferrer" key={item.id}>
            <div className={`intel-thumb ${meta.tone}`}><Icon size={24}/><span>{meta.label}</span></div>
            <div className="intel-card-body">
              <div className="intel-card-topline"><span>{item.source}</span><ExternalLink size={14}/></div>
              <strong>{item.title}</strong>
              <p>{item.summary}</p>
              <small>{item.tags.join(' • ')}</small>
            </div>
          </a>;
        })}
      </div>
    </Card>

    <Card className="intel-panel">
      <h2>Next modules planned</h2>
      <div className="chips">{FUTURE_INTEL_MODULES.map(module => <span key={module}>{module}</span>)}</div>
    </Card>
  </main>;
}

import { Bot, Fish, Home, Map, Settings, Waves, NotebookTabs, Radar } from 'lucide-react';

const items = [
  ['home', Home, 'Home'],
  ['conditions', Waves, 'Conditions'],
  ['baits', Fish, 'Baits'],
  ['maps', Map, 'Maps'],
  ['intel', Radar, 'Intel'],
  ['logbook', NotebookTabs, 'Log'],
  ['ai', Bot, 'AI'],
  ['settings', Settings, 'Settings']
] as const;

export function BottomNav({ tab, setTab }: { tab: string; setTab: (tab: string) => void }) {
  return <nav className="bottom-nav">{items.map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={20}/><span>{label}</span></button>)}</nav>;
}

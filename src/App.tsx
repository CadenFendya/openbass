import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Conditions } from './pages/Conditions';
import { Baits } from './pages/Baits';
import { Maps } from './pages/Maps';
import { Logbook } from './pages/Logbook';
import { AI } from './pages/AI';
import { Intel } from './pages/Intel';
import { Settings } from './pages/Settings';
import { useAppStore } from './store/useAppStore';
import './styles.css';

export default function App() {
  const [tab, setTab] = useState('home');
  const hydrate = useAppStore(s => s.hydrate);
  useEffect(() => { hydrate(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js'); }, [hydrate]);
  return <div className="app-shell">
    {tab === 'home' && <Home />}
    {tab === 'conditions' && <Conditions />}
    {tab === 'baits' && <Baits />}
    {tab === 'maps' && <Maps />}
    {tab === 'intel' && <Intel />}
    {tab === 'logbook' && <Logbook />}
    {tab === 'ai' && <AI />}
    {tab === 'settings' && <Settings />}
    <BottomNav tab={tab} setTab={setTab} />
  </div>;
}

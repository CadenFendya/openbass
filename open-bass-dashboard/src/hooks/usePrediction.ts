import { useEffect, useMemo, useState } from 'react';
import { buildPrediction } from '../engine/activityEngine';
import { demoWeather, fetchOpenMeteo } from '../services/weather';
import { useAppStore } from '../store/useAppStore';
import type { FishingPrediction, WeatherBundle } from '../types';

export function usePrediction() {
  const { locations, activeLocationId, waterbodies, gear } = useAppStore();
  const location = locations.find(l => l.id === activeLocationId) ?? locations[0];
  const profile = waterbodies[location.id];
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [source, setSource] = useState<'live' | 'demo' | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    setSource('loading');
    fetchOpenMeteo(location)
      .then(bundle => { if (!cancelled) { setWeather(bundle); setSource('live'); } })
      .catch(() => { if (!cancelled) { setWeather(demoWeather()); setSource('demo'); } });
    return () => { cancelled = true; };
  }, [location.id, location.latitude, location.longitude]);

  const prediction: FishingPrediction | null = useMemo(() => {
    if (!weather || !profile) return null;
    return buildPrediction(weather.hourly, profile, gear);
  }, [weather, profile, gear]);

  return { location, profile, weather, prediction, source };
}

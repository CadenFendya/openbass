import type { FishingPrediction, WeatherBundle, WaterbodyProfile } from '../types';

export function getFishPositioning(prediction: FishingPrediction, profile: WaterbodyProfile) {
  const water = prediction.water.waterTempF;
  const pattern = prediction.pattern;
  const positions: Array<{ zone: string; reason: string; confidence: number }> = [];

  if (profile.current !== 'none') {
    positions.push({ zone: 'current seams and eddies', reason: 'Bass can sit out of the current and ambush bait drifting past.', confidence: 86 });
  }
  if (profile.grass || profile.vegetation) {
    positions.push({ zone: 'outside grass edges', reason: 'Grass holds bait, oxygen, shade, and ambush lanes.', confidence: water >= 55 ? 84 : 64 });
  }
  if (profile.wood) {
    positions.push({ zone: 'laydowns and isolated wood', reason: 'Wood creates shade and hard ambush targets, especially in stained water.', confidence: 78 });
  }
  if (profile.rock) {
    positions.push({ zone: 'rock transitions and points', reason: 'Rock warms faster and concentrates crawfish and baitfish.', confidence: pattern === 'pre-spawn' || pattern === 'fall' ? 82 : 70 });
  }
  if (pattern === 'spawn') {
    positions.push({ zone: 'protected shallow pockets', reason: 'Spawning fish favor calmer, warmer, protected areas.', confidence: 80 });
  }
  if (pattern === 'summer') {
    positions.push({ zone: 'shade, docks, and first deeper break', reason: 'Summer fish often split between shade feeding windows and nearby depth.', confidence: 76 });
  }
  if (prediction.water.shallowWarming === 'high') {
    positions.push({ zone: 'north banks and shallow dark bottom', reason: 'Fast-warming shallows can pull bass up to feed.', confidence: 74 });
  }

  positions.push({ zone: 'wind-blown bank or point', reason: 'Wind pushes plankton and bait, making moving baits stronger.', confidence: 72 });

  return positions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

export function getPackChecklist(prediction: FishingPrediction, weather: WeatherBundle) {
  const current = weather.current;
  const topBaits = prediction.topBaits.slice(0, 4).map(item => item.bait.name);
  const list = [
    ...topBaits.map(name => `${name} box / colors`),
    'pliers, scale, tape, and line cutters',
    'leader line and retie tools',
    'polarized sunglasses',
    'phone battery pack'
  ];

  if (current.rainChance > 35 || current.precipitationIn > 0.02) list.push('rain jacket / waterproof bag');
  if (current.windMph > 12) list.push('wind-resistant moving baits and heavier weights');
  if (prediction.pattern === 'bluebird' || current.cloudCover < 25) list.push('finesse box for high sun / pressure');
  if (prediction.water.waterTempF >= 65) list.push('topwater/frog box');

  return Array.from(new Set(list)).slice(0, 10);
}

export function getRodRecommendation(prediction: FishingPrediction) {
  const top = prediction.topBaits[0];
  if (!top) return 'Bring one medium-heavy casting setup and one spinning setup.';
  const bait = top.bait;
  if (bait.rod.toLowerCase().includes('spinning') || ['drop-shot', 'ned-rig', 'wacky-rig', 'tube', 'shaky-head'].includes(bait.id)) {
    return `Bring a spinning setup first: ${bait.rod}, ${bait.line}. Top bait: ${bait.name}.`;
  }
  if (bait.id.includes('frog') || bait.id === 'punch-rig' || bait.rod.toLowerCase().includes('heavy')) {
    return `Bring a heavy casting setup first: ${bait.rod}, ${bait.line}. Top bait: ${bait.name}.`;
  }
  return `Bring a medium-heavy casting setup first: ${bait.rod}, ${bait.line}. Top bait: ${bait.name}.`;
}

export function buildYoutubeSearch(prediction: FishingPrediction, waterbodyType: string) {
  const bait = prediction.topBaits[0]?.bait.name ?? 'bass fishing';
  const query = `${bait} ${prediction.pattern} ${waterbodyType} bass fishing conditions`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function getSolunarHeatmap(prediction: FishingPrediction) {
  return prediction.hourlyPlan.slice(0, 12).map(slot => ({
    time: new Date(slot.time).toLocaleTimeString([], { hour: 'numeric' }),
    score: slot.score,
    strength: slot.score >= 75 ? 'Prime' : slot.score >= 60 ? 'Good' : slot.score >= 45 ? 'Fair' : 'Slow'
  }));
}

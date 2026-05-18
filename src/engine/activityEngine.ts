import type { FishingPrediction, GearSetup, HourlyWeather, MoonData, WaterbodyProfile } from '../types';
import { estimateWater } from './waterEstimator';
import { calculateMoon } from './moon';
import { determinePattern } from './patterns';
import { recommendBaits } from './baitEngine';

export function buildPrediction(weatherHourly: HourlyWeather[], profile: WaterbodyProfile, gear: GearSetup[], date = new Date()): FishingPrediction {
  const current = weatherHourly[0];
  const water = estimateWater(weatherHourly, profile);
  const moon: MoonData = calculateMoon(date);
  const pattern = determinePattern(date, current, water);

  const topBaits = recommendBaits({ hour: current, water, profile, pattern, gear });
  const hourlyPlan = weatherHourly.slice(0, 18).map(hour => {
    const baits = recommendBaits({ hour, water, profile, pattern, gear }).slice(0, 3);
    return { time: hour.time, score: scoreActivity(hour, water, moon), baits };
  });
  const activityScore = scoreActivity(current, water, moon);
  const best = topBaits[0]?.bait.name ?? 'Texas rig';
  const windText = current.windMph >= 10 ? 'wind-blown banks' : 'shade lines and high-percentage cover';
  const summary = `Activity: ${activityScore}/100. ${current.cloudCover > 55 ? 'Cloud cover' : 'Sun'} and ${Math.round(current.windMph)} mph wind favor ${topBaits[0]?.bait.retrieve.toLowerCase() ?? 'controlled presentations'}. Estimated water temperature is ${water.waterTempF}°F. Target ${windText}. Start with a ${best}.`;

  return { activityScore, pattern, summary, water, moon, topBaits, hourlyPlan };
}

function scoreActivity(hour: HourlyWeather, water: { waterTempF: number; oxygenActivity: string }, moon: MoonData): number {
  let score = 45;
  if (water.waterTempF >= 55 && water.waterTempF <= 75) score += 18;
  else if (water.waterTempF >= 48 && water.waterTempF <= 82) score += 9;
  if (hour.windMph >= 5 && hour.windMph <= 15) score += 12;
  if (hour.cloudCover >= 45 && hour.cloudCover <= 90) score += 10;
  if (hour.pressureHpa < 1018) score += 6;
  if (water.oxygenActivity === 'high') score += 8;
  score += Math.round((moon.influenceScore - 50) * 0.12);
  if (hour.precipitationIn > 0.02 && hour.precipitationIn < 0.25) score += 5;
  if (hour.windMph > 22) score -= 10;
  if (hour.pressureHpa > 1024 && hour.cloudCover < 20) score -= 12;
  return Math.max(0, Math.min(100, Math.round(score)));
}

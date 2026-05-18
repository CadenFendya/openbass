import { BAITS } from '../data/baits';
import type { BaitProfile, BaitRecommendation, GearSetup, HourlyWeather, SeasonPattern, WaterEstimate, WaterbodyProfile } from '../types';

export function recommendBaits(input: {
  hour: HourlyWeather;
  water: WaterEstimate;
  profile: WaterbodyProfile;
  pattern: SeasonPattern;
  gear: GearSetup[];
}): BaitRecommendation[] {
  return BAITS.map(bait => scoreBait(bait, input))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);
}

function scoreBait(bait: BaitProfile, input: { hour: HourlyWeather; water: WaterEstimate; profile: WaterbodyProfile; pattern: SeasonPattern; gear: GearSetup[] }): BaitRecommendation {
  const { hour, water, profile, pattern, gear } = input;
  let score = 40;
  const reasons: string[] = [];

  if (water.waterTempF >= bait.tempRangeF[0] && water.waterTempF <= bait.tempRangeF[1]) { score += 18; reasons.push(`${water.waterTempF}°F fits its temperature range`); }
  else score -= 14;

  if (bait.clarity.includes(profile.clarity)) { score += 12; reasons.push(`${profile.clarity} water matches`); }
  else score -= 8;

  if (bait.seasons.includes(pattern)) { score += 12; reasons.push(`${pattern} pattern fits`); }
  else score -= 4;

  const windy = hour.windMph >= 10;
  if ((bait.wind === 'windy' && windy) || (bait.wind === 'some' && hour.windMph >= 5) || bait.wind === 'any' || (bait.wind === 'calm' && hour.windMph < 9)) { score += 8; }
  else score -= 6;

  const cloudy = hour.cloudCover > 55;
  if ((bait.cloud === 'cloud' && cloudy) || (bait.cloud === 'sun' && !cloudy) || bait.cloud === 'any') { score += 6; }

  if ((profile.grass || profile.vegetation) && ['chatterbait','swim-jig','frog','toad','texas-rig','punch-rig','lipless-crankbait'].includes(bait.id)) score += 8;
  if (profile.wood && ['spinnerbait','squarebill','pitching-jig','texas-rig'].includes(bait.id)) score += 8;
  if (profile.rock && ['football-jig','tube','ned-rig','crankbait','medium-crankbait'].includes(bait.id)) score += 7;
  if (profile.current !== 'none' && ['tube','swimbait','underspin','spinnerbait','drop-shot'].includes(bait.id)) score += 6;

  const matchedGear = gear.find(g => g.bestFor.includes(bait.id));
  if (matchedGear) score += 4;

  const confidence = Math.max(0, Math.min(100, Math.round(score)));
  return { bait, confidence, gear: matchedGear, reason: reasons.slice(0, 3).join(', ') || bait.why };
}

import type { HourlyWeather, WaterEstimate, WaterbodyProfile } from '../types';

export function estimateWater(weather: HourlyWeather[], profile: WaterbodyProfile): WaterEstimate {
  const recent = weather.slice(0, 48);
  const avgAir = average(recent.map(h => h.temperatureF));
  const avgWind = average(recent.map(h => h.windMph));
  const rain = recent.reduce((sum, h) => sum + h.precipitationIn, 0);
  const depthFactor = profile.averageDepthFt <= 6 ? 1.08 : profile.averageDepthFt <= 15 ? 0.96 : 0.88;
  const vegetationFactor = profile.vegetation || profile.grass || profile.pads ? 1.02 : 1;
  const riverFactor = profile.current === 'moderate' || profile.current === 'strong' ? 0.94 : 1;
  const waterTempF = Math.round((avgAir * 0.72 + weather[0].temperatureF * 0.28 - 4) * depthFactor * vegetationFactor * riverFactor);

  const clarityTrend = rain > 0.6 ? 'falling from runoff' : avgWind > 14 ? 'slightly reduced from wind mixing' : 'stable';
  const oxygenActivity = avgWind > 8 && waterTempF > 52 && waterTempF < 82 ? 'high' : waterTempF > 85 ? 'low' : 'moderate';
  const shallowWarming = profile.averageDepthFt <= 8 && avgAir > waterTempF + 5 ? 'high' : avgAir > waterTempF ? 'moderate' : 'low';
  const turnoverRisk = profile.averageDepthFt > 12 && avgWind > 15 && Math.abs(avgAir - waterTempF) > 14 ? 'moderate' : 'low';
  const reasoning = `Estimated ${waterTempF}°F because recent air averaged ${Math.round(avgAir)}°F, ${profile.averageDepthFt} ft average depth ${profile.averageDepthFt <= 6 ? 'warms quickly' : 'buffers temperature swings'}, wind averaged ${Math.round(avgWind)} mph, and recent rain totaled ${rain.toFixed(2)} in.`;

  return { waterTempF, clarityTrend, oxygenActivity, shallowWarming, turnoverRisk, reasoning };
}

function average(values: number[]) {
  return values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
}

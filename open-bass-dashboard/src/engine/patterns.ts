import type { HourlyWeather, SeasonPattern, WaterEstimate } from '../types';

export function determinePattern(date: Date, current: HourlyWeather, water: WaterEstimate): SeasonPattern {
  const month = date.getMonth() + 1;
  const temp = water.waterTempF;
  const highPressure = current.pressureHpa > 1020 && current.cloudCover < 30;
  const coldFront = current.pressureHpa > 1023 && current.temperatureF < temp + 2;
  if (coldFront) return 'cold front';
  if (highPressure) return 'bluebird';
  if (temp < 45) return 'winter';
  if (temp >= 45 && temp < 58) return 'pre-spawn';
  if (temp >= 58 && temp <= 68 && month >= 4 && month <= 6) return 'spawn';
  if (temp > 68 && month <= 7) return 'post-spawn';
  if (month >= 9 && month <= 11) return 'fall';
  return 'summer';
}

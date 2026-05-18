import type { MoonData } from '../types';

const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export function calculateMoon(date = new Date()): MoonData {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const illumination = Math.round((1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) * 50);
  const phaseName = phaseFromAge(age);
  const influenceScore = scoreMoon(age, illumination);

  return {
    phaseName,
    illumination,
    majorPeriods: ['Around moon overhead', 'Around moon underfoot'],
    minorPeriods: ['Around moonrise', 'Around moonset'],
    influenceScore
  };
}

function phaseFromAge(age: number): string {
  if (age < 1.84566) return 'New Moon';
  if (age < 5.53699) return 'Waxing Crescent';
  if (age < 9.22831) return 'First Quarter';
  if (age < 12.91963) return 'Waxing Gibbous';
  if (age < 16.61096) return 'Full Moon';
  if (age < 20.30228) return 'Waning Gibbous';
  if (age < 23.99361) return 'Last Quarter';
  if (age < 27.68493) return 'Waning Crescent';
  return 'New Moon';
}

function scoreMoon(age: number, illumination: number): number {
  const fullOrNewBoost = Math.max(0, 18 - Math.min(Math.abs(age - 0), Math.abs(age - 14.765), Math.abs(age - 29.53)) * 4);
  const quarterPenalty = age > 6 && age < 24 ? -4 : 0;
  return Math.max(0, Math.min(100, 50 + illumination * 0.22 + fullOrNewBoost + quarterPenalty));
}

export type WaterbodyType = 'pond' | 'lake' | 'river' | 'reservoir' | 'creek';
export type Clarity = 'clear' | 'slightly stained' | 'stained' | 'muddy';
export type SeasonPattern = 'winter' | 'pre-spawn' | 'spawn' | 'post-spawn' | 'summer' | 'fall' | 'cold front' | 'bluebird';

export interface LocationProfile {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  country: string;
  timezone: string;
  waterbodyType: WaterbodyType;
  favorite: boolean;
}

export interface WaterbodyProfile {
  locationId: string;
  averageDepthFt: number;
  maxDepthFt: number;
  clarity: Clarity;
  vegetation: boolean;
  grass: boolean;
  pads: boolean;
  wood: boolean;
  rock: boolean;
  shoreType: string;
  current: 'none' | 'light' | 'moderate' | 'strong';
  waterColor: string;
}

export interface HourlyWeather {
  time: string;
  temperatureF: number;
  feelsLikeF: number;
  windMph: number;
  windDirection: number;
  pressureHpa: number;
  cloudCover: number;
  humidity: number;
  precipitationIn: number;
  rainChance: number;
}

export interface DailyWeather {
  date: string;
  sunrise: string;
  sunset: string;
  highF: number;
  lowF: number;
  rainChance: number;
}

export interface WeatherBundle {
  current: HourlyWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

export interface MoonData {
  phaseName: string;
  illumination: number;
  majorPeriods: string[];
  minorPeriods: string[];
  influenceScore: number;
}

export interface WaterEstimate {
  waterTempF: number;
  clarityTrend: string;
  oxygenActivity: 'low' | 'moderate' | 'high';
  shallowWarming: 'low' | 'moderate' | 'high';
  turnoverRisk: 'low' | 'moderate' | 'high';
  reasoning: string;
}

export interface GearSetup {
  id: string;
  name: string;
  rod: string;
  reel?: string;
  line: string;
  bestFor: string[];
}

export interface BaitProfile {
  id: string;
  name: string;
  tempRangeF: [number, number];
  clarity: Clarity[];
  depthFt: [number, number];
  seasons: SeasonPattern[];
  wind: 'calm' | 'some' | 'windy' | 'any';
  cloud: 'sun' | 'cloud' | 'any';
  retrieve: string;
  colors: string[];
  trailers: string[];
  hooks: string;
  weights: string;
  line: string;
  rod: string;
  why: string;
}

export interface BaitRecommendation {
  bait: BaitProfile;
  confidence: number;
  reason: string;
  gear?: GearSetup;
}

export interface FishingPrediction {
  activityScore: number;
  pattern: SeasonPattern;
  summary: string;
  water: WaterEstimate;
  moon: MoonData;
  topBaits: BaitRecommendation[];
  hourlyPlan: Array<{ time: string; score: number; baits: BaitRecommendation[] }>;
}

export interface CatchLog {
  id: string;
  createdAt: string;
  species: string;
  lengthIn?: number;
  weightLb?: number;
  bait: string;
  locationId: string;
  weatherSummary: string;
  notes: string;
  photoDataUrl?: string;
}

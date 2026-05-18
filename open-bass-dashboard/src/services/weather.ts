import type { DailyWeather, HourlyWeather, LocationProfile, WeatherBundle } from '../types';

export async function fetchOpenMeteo(location: LocationProfile): Promise<WeatherBundle> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('timezone', location.timezone || 'auto');
  url.searchParams.set('temperature_unit', 'fahrenheit');
  url.searchParams.set('wind_speed_unit', 'mph');
  url.searchParams.set('precipitation_unit', 'inch');
  url.searchParams.set('forecast_days', '7');
  url.searchParams.set('hourly', ['temperature_2m','apparent_temperature','wind_speed_10m','wind_direction_10m','surface_pressure','cloud_cover','relative_humidity_2m','precipitation','precipitation_probability'].join(','));
  url.searchParams.set('daily', ['sunrise','sunset','temperature_2m_max','temperature_2m_min','precipitation_probability_max'].join(','));

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Open-Meteo failed: ${response.status}`);
  const data = await response.json();

  const hourly: HourlyWeather[] = data.hourly.time.map((time: string, i: number) => ({
    time,
    temperatureF: data.hourly.temperature_2m[i],
    feelsLikeF: data.hourly.apparent_temperature[i],
    windMph: data.hourly.wind_speed_10m[i],
    windDirection: data.hourly.wind_direction_10m[i],
    pressureHpa: data.hourly.surface_pressure[i],
    cloudCover: data.hourly.cloud_cover[i],
    humidity: data.hourly.relative_humidity_2m[i],
    precipitationIn: data.hourly.precipitation[i],
    rainChance: data.hourly.precipitation_probability[i] ?? 0
  }));

  const daily: DailyWeather[] = data.daily.time.map((date: string, i: number) => ({
    date,
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    highF: data.daily.temperature_2m_max[i],
    lowF: data.daily.temperature_2m_min[i],
    rainChance: data.daily.precipitation_probability_max[i] ?? 0
  }));

  return { current: hourly[0], hourly, daily };
}

export function demoWeather(): WeatherBundle {
  const now = new Date();
  const hourly = Array.from({ length: 48 }, (_, i) => {
    const t = new Date(now.getTime() + i * 3600000);
    const wave = Math.sin((i / 24) * Math.PI * 2);
    return {
      time: t.toISOString(),
      temperatureF: Math.round(66 + wave * 10),
      feelsLikeF: Math.round(66 + wave * 9),
      windMph: Math.round(8 + Math.max(0, wave) * 6),
      windDirection: 225,
      pressureHpa: 1014,
      cloudCover: 68,
      humidity: 64,
      precipitationIn: i % 13 === 0 ? 0.04 : 0,
      rainChance: i % 13 === 0 ? 45 : 12
    };
  });
  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    return { date: d.toISOString().slice(0, 10), sunrise: '06:18', sunset: '20:58', highF: 74, lowF: 55, rainChance: 20 };
  });
  return { current: hourly[0], hourly, daily };
}

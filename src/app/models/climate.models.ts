export interface City {
  id: number;
  name: string;
  nameAlbanian: string;
  latitude: number;
  longitude: number;
  population: number;
  region: string;
}

export interface ClimateData {
  id: number;
  cityId: number;
  cityName: string;
  year: number;
  month: number;
  averageTemperature: number | null;
  maxTemperature: number | null;
  minTemperature: number | null;
  precipitation: number;
  humidity: number | null;
  co2Level: number | null;
  sunnyDays: number;
  rainyDays: number;
  windSpeed: number | null;
  season: string;
}

export interface YearlyClimateData {
  cityId: number;
  cityName: string;
  year: number;
  averageTemperature: number | null;
  totalPrecipitation: number;
  averageHumidity: number | null;
  co2Level: number | null;
  totalSunnyDays: number;
  totalRainyDays: number;
  averageWindSpeed: number | null;
}

export interface TemperatureTrend {
  year: number;
  temperature: number | null;
  temperatureChange: number | null;
}

export interface SeasonalData {
  season: string;
  averageTemperature: number | null;
  precipitation: number;
  humidity: number | null;
}

export interface ClimateComparison {
  cityName: string;
  averageTemperature: number | null;
  totalPrecipitation: number;
  co2Level: number | null;
}

export interface ExtremeWeatherEvent {
  id: number;
  cityId: number;
  cityName: string;
  date: string;
  eventType: string;
  description: string;
  severity: string;
}

export interface ClimateStatistics {
  totalRecords: number;
  yearsOfData: number;
  overallAverageTemperature: number | null;
  highestTemperature: number | null;
  lowestTemperature: number | null;
  averagePrecipitation: number;
  currentCO2Level: number | null;
  temperatureIncrease: number | null;
}


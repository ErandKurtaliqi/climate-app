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
  averageTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  precipitation: number;
  humidity: number;
  co2Level: number;
  sunnyDays: number;
  rainyDays: number;
  windSpeed: number;
  season: string;
}

export interface YearlyClimateData {
  cityId: number;
  cityName: string;
  year: number;
  averageTemperature: number;
  totalPrecipitation: number;
  averageHumidity: number;
  co2Level: number;
  totalSunnyDays: number;
  totalRainyDays: number;
  averageWindSpeed: number;
}

export interface TemperatureTrend {
  year: number;
  temperature: number;
  temperatureChange: number;
}

export interface SeasonalData {
  season: string;
  averageTemperature: number;
  precipitation: number;
  humidity: number;
}

export interface ClimateComparison {
  cityName: string;
  averageTemperature: number;
  totalPrecipitation: number;
  co2Level: number;
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
  overallAverageTemperature: number;
  highestTemperature: number;
  lowestTemperature: number;
  averagePrecipitation: number;
  currentCO2Level: number;
  temperatureIncrease: number;
}


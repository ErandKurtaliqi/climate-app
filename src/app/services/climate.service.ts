import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  City,
  ClimateData,
  YearlyClimateData,
  TemperatureTrend,
  SeasonalData,
  ClimateComparison,
  ExtremeWeatherEvent,
  ClimateStatistics
} from '../models/climate.models';

@Injectable({
  providedIn: 'root'
})
export class ClimateService {
  private apiUrl = 'http://localhost:5223/api/climate';

  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities`);
  }

  getCity(id: number): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/cities/${id}`);
  }

  getClimateData(cityId?: number, year?: number, month?: number): Observable<ClimateData[]> {
    let params = new HttpParams();
    if (cityId !== undefined) params = params.set('cityId', cityId.toString());
    if (year !== undefined) params = params.set('year', year.toString());
    if (month !== undefined) params = params.set('month', month.toString());
    return this.http.get<ClimateData[]>(`${this.apiUrl}/data`, { params });
  }

  getYearlyData(cityId?: number): Observable<YearlyClimateData[]> {
    let params = new HttpParams();
    if (cityId !== undefined) params = params.set('cityId', cityId.toString());
    return this.http.get<YearlyClimateData[]>(`${this.apiUrl}/yearly`, { params });
  }

  getTemperatureTrend(cityId: number): Observable<TemperatureTrend[]> {
    return this.http.get<TemperatureTrend[]>(`${this.apiUrl}/temperature-trend/${cityId}`);
  }

  getSeasonalData(cityId: number, year?: number): Observable<SeasonalData[]> {
    let params = new HttpParams();
    if (year !== undefined) params = params.set('year', year.toString());
    return this.http.get<SeasonalData[]>(`${this.apiUrl}/seasonal/${cityId}`, { params });
  }

  getCityComparison(year: number): Observable<ClimateComparison[]> {
    return this.http.get<ClimateComparison[]>(`${this.apiUrl}/comparison/${year}`);
  }

  getExtremeEvents(cityId?: number): Observable<ExtremeWeatherEvent[]> {
    let params = new HttpParams();
    if (cityId !== undefined) params = params.set('cityId', cityId.toString());
    return this.http.get<ExtremeWeatherEvent[]>(`${this.apiUrl}/extreme-events`, { params });
  }

  getClimateStatistics(cityId: number): Observable<ClimateStatistics> {
    return this.http.get<ClimateStatistics>(`${this.apiUrl}/statistics/${cityId}`);
  }
}


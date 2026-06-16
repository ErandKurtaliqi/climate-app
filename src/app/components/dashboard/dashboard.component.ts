import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ClimateService } from '../../services/climate.service';
import {
  City,
  YearlyClimateData,
  TemperatureTrend,
  SeasonalData,
  ClimateComparison,
  ExtremeWeatherEvent,
  ClimateStatistics
} from '../../models/climate.models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('temperatureChart') temperatureChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precipitationChart') precipitationChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('seasonalChart') seasonalChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('co2Chart') co2ChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comparisonChart') comparisonChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('humidityChart') humidityChartRef!: ElementRef<HTMLCanvasElement>;

  cities: City[] = [];
  selectedCityId: number = 0;
  selectedCity: City | null = null;
  selectedYear: number = 2025;
  
  yearlyData: YearlyClimateData[] = [];
  temperatureTrend: TemperatureTrend[] = [];
  seasonalData: SeasonalData[] = [];
  cityComparison: ClimateComparison[] = [];
  extremeEvents: ExtremeWeatherEvent[] = [];
  statistics: ClimateStatistics | null = null;

  years: number[] = [];
  isLoading = true;

  private charts: Chart[] = [];

  constructor(private climateService: ClimateService) {
    for (let i = 2024; i <= 2026; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.loadCities();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }

  loadCities(): void {
    this.climateService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.selectedCity = cities[0];
        this.loadAllData();
      },
      error: (err) => console.error('Error loading cities:', err)
    });
  }

  onCityChange(): void {
    this.selectedCity = this.cities.find(c => c.id === this.selectedCityId) || null;
    this.loadAllData();
  }

  onYearChange(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    
    // Load yearly data
    this.climateService.getYearlyData(this.selectedCityId).subscribe({
      next: (data) => {
        this.yearlyData = data;
        this.updateTemperatureChart();
        this.updatePrecipitationChart();
        this.updateCO2Chart();
        this.updateHumidityChart();
      }
    });

    // Load temperature trend
    this.climateService.getTemperatureTrend(this.selectedCityId).subscribe({
      next: (data) => this.temperatureTrend = data
    });

    // Load seasonal data
    this.climateService.getSeasonalData(this.selectedCityId, this.selectedYear).subscribe({
      next: (data) => {
        this.seasonalData = data;
        this.updateSeasonalChart();
      }
    });

    // Load city comparison
    this.climateService.getCityComparison(this.selectedYear).subscribe({
      next: (data) => {
        this.cityComparison = data.slice(0, 6);
        this.updateComparisonChart();
      }
    });

    // Load extreme events
    this.climateService.getExtremeEvents(this.selectedCityId === 0 ? undefined : this.selectedCityId).subscribe({
      next: (data) => this.extremeEvents = data
    });

    // Load statistics
    this.climateService.getClimateStatistics(this.selectedCityId).subscribe({
      next: (data) => {
        this.statistics = data;
        this.isLoading = false;
      }
    });
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  private updateTemperatureChart(): void {
    if (!this.temperatureChartRef) return;
    
    const existingChart = Chart.getChart(this.temperatureChartRef.nativeElement);
    if (existingChart) existingChart.destroy();

    const ctx = this.temperatureChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 99, 71, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 99, 71, 0.1)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.yearlyData.map(d => d.year.toString()),
        datasets: [{
          label: 'Temperatura Mesatare (°C)',
          data: this.yearlyData.map(d => d.averageTemperature),
          borderColor: '#FF6347',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#FF6347',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#E0E0E0', font: { family: 'Outfit', size: 12 } }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 50, 0.95)',
            titleColor: '#FF6347',
            bodyColor: '#E0E0E0',
            borderColor: '#FF6347',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0' }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private updatePrecipitationChart(): void {
    if (!this.precipitationChartRef) return;
    
    const existingChart = Chart.getChart(this.precipitationChartRef.nativeElement);
    if (existingChart) existingChart.destroy();

    const ctx = this.precipitationChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.yearlyData.map(d => d.year.toString()),
        datasets: [{
          label: 'Reshjet Totale (mm)',
          data: this.yearlyData.map(d => d.totalPrecipitation),
          backgroundColor: this.yearlyData.map((_, i) => {
            const hue = 200 + (i * 3);
            return `hsla(${hue}, 70%, 50%, 0.8)`;
          }),
          borderColor: this.yearlyData.map((_, i) => {
            const hue = 200 + (i * 3);
            return `hsla(${hue}, 70%, 60%, 1)`;
          }),
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#E0E0E0', font: { family: 'Outfit', size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0' }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private updateSeasonalChart(): void {
    if (!this.seasonalChartRef) return;
    
    const existingChart = Chart.getChart(this.seasonalChartRef.nativeElement);
    if (existingChart) existingChart.destroy();

    const ctx = this.seasonalChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const seasonColors: { [key: string]: string } = {
      'Winter': '#4FC3F7',
      'Spring': '#81C784',
      'Summer': '#FFD54F',
      'Autumn': '#FF8A65'
    };

    const orderedSeasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    const orderedData = orderedSeasons.map(s => 
      this.seasonalData.find(d => d.season === s) || { season: s, averageTemperature: null, precipitation: 0, humidity: null }
    );

    const chart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: orderedData.map(d => this.translateSeason(d.season)),
        datasets: [{
          data: orderedData.map(d => d.averageTemperature === null ? 0 : Math.max(d.averageTemperature + 10, 0)),
          backgroundColor: orderedSeasons.map(s => seasonColors[s] + '99'),
          borderColor: orderedSeasons.map(s => seasonColors[s]),
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#E0E0E0', font: { family: 'Outfit', size: 12 }, padding: 20 }
          }
        },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0', backdropColor: 'transparent' }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private updateCO2Chart(): void {
    if (!this.co2ChartRef) return;
    
    const existingChart = Chart.getChart(this.co2ChartRef.nativeElement);
    if (existingChart) existingChart.destroy();

    const ctx = this.co2ChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(156, 39, 176, 0.8)');
    gradient.addColorStop(1, 'rgba(156, 39, 176, 0.1)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.yearlyData.map(d => d.year.toString()),
        datasets: [{
          label: 'Intensiteti i reshjeve (mm/min)',
          data: this.yearlyData.map(d => d.co2Level),
          borderColor: '#9C27B0',
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#9C27B0'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#E0E0E0', font: { family: 'Outfit', size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#A0A0A0' }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private updateComparisonChart(): void {
    if (!this.comparisonChartRef) return;
    
    const existingChart = Chart.getChart(this.comparisonChartRef.nativeElement);
    if (existingChart) existingChart.destroy();

    const ctx = this.comparisonChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.cityComparison.map(c => c.cityName),
        datasets: [{
          label: 'Temperatura (°C)',
          data: this.cityComparison.map(c => c.averageTemperature),
          borderColor: '#FF6347',
          backgroundColor: 'rgba(255, 99, 71, 0.2)',
          pointBackgroundColor: '#FF6347',
          pointBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#E0E0E0', font: { family: 'Outfit', size: 12 } }
          }
        },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.2)' },
            angleLines: { color: 'rgba(255,255,255,0.2)' },
            ticks: { color: '#A0A0A0', backdropColor: 'transparent' },
            pointLabels: { color: '#E0E0E0', font: { size: 10 } }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private updateHumidityChart(): void {
    if (!this.humidityChartRef) return;
    
    const existingChart = Chart.getChart(this.humidityChartRef.nativeElement);
    if (existingChart) existingChart.destroy();

    const ctx = this.humidityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Lagështia Mesatare', 'E thatë'],
        datasets: [{
          data: [
            this.yearlyData.length > 0 && this.yearlyData[this.yearlyData.length - 1].averageHumidity !== null
              ? this.yearlyData[this.yearlyData.length - 1].averageHumidity
              : 0,
            this.yearlyData.length > 0 && this.yearlyData[this.yearlyData.length - 1].averageHumidity !== null
              ? 100 - this.yearlyData[this.yearlyData.length - 1].averageHumidity!
              : 100
          ],
          backgroundColor: ['#00BCD4', 'rgba(255,255,255,0.1)'],
          borderColor: ['#00BCD4', 'rgba(255,255,255,0.2)'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#E0E0E0', font: { family: 'Outfit', size: 12 } }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  translateSeason(season: string): string {
    const translations: { [key: string]: string } = {
      'Winter': 'Dimër',
      'Spring': 'Pranverë',
      'Summer': 'Verë',
      'Autumn': 'Vjeshtë'
    };
    return translations[season] || season;
  }

  formatValue(value: number | null | undefined, suffix = ''): string {
    return value === null || value === undefined ? 'N/A' : `${value}${suffix}`;
  }

  getSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      default: return 'severity-low';
    }
  }

  getEventIcon(eventType: string): string {
    switch (eventType.toLowerCase()) {
      case 'heatwave': return '🌡️';
      case 'drought': return '🏜️';
      case 'flood': return '🌊';
      case 'snowstorm': return '❄️';
      case 'storm': return '⛈️';
      default: return '🌪️';
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sq-AL', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}


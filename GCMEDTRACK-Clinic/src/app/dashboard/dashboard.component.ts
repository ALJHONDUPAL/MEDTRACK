import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../services/api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(DataLabelsPlugin);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('appointmentsChart') appointmentsChartRef!: ElementRef;
  @ViewChild('documentsChart') documentsChartRef!: ElementRef;
  
  appointmentsChart: Chart | undefined;
  documentsChart: Chart | undefined;

  // Mock data for appointments per day
  appointmentsData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    data: [5, 12, 8, 15, 10, 7, 3]
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.createAppointmentsChart();
    this.loadDocumentDistribution();
  }

  private loadDocumentDistribution(): void {
    this.apiService.getDocumentDistributionByDepartment().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          const data = response.data;
          const labels = data.map((item: any) => item.department);
          const values = data.map((item: any) => item.student_count);
          this.createDocumentsChart(labels, values);
        }
      },
      error: (error) => {
        console.error('Error loading document distribution:', error);
      }
    });
  }

  private createAppointmentsChart(): void {
    const ctx = this.appointmentsChartRef.nativeElement.getContext('2d');
    
    this.appointmentsChart = new Chart(ctx, {
      type: 'bar',
      plugins: [DataLabelsPlugin],
      data: {
        labels: this.appointmentsData.labels,
        datasets: [{
          label: 'Appointments per Day',
          data: this.appointmentsData.data,
          backgroundColor: '#009F6B',
          borderColor: '#00a8e8',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Weekly Appointments Distribution',
            font: {
              size: 16
            }
          },
          // @ts-ignore
          datalabels: {
            display: false
          }
        }
      }
    });
  }

  private createDocumentsChart(labels: string[], values: number[]): void {
    const ctx = this.documentsChartRef.nativeElement.getContext('2d');
    
    this.documentsChart = new Chart(ctx, {
      type: 'doughnut',
      plugins: [DataLabelsPlugin],
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#FF9800',  // Orange
            '#2196F3',  // Blue
            '#F44336',  // Red
            '#F8C8DC',  // Pink 
            '#FFEB3B'   // Yellow
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          title: {
            display: true,
            text: 'Documents Distribution by Department',
            font: {
              size: 16,
              family: 'Poppins'
            }
          },
          legend: {
            position: 'right',
            labels: {
              font: {
                family: 'Poppins',
                size: 12
              },
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((acc: number, current: number) => acc + current, 0);
                const percentage = Math.round((value * 100) / total * 10) / 10;
                return `${label}: ${percentage}% (${value} students)`;
              }
            }
          },
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold',
              size: 14,
              family: 'Poppins'
            },
            formatter: (value: number, context: any) => {
              const total = context.dataset.data.reduce((acc: number, current: number) => acc + current, 0);
              const percentage = Math.round((value * 100) / total * 10) / 10;
              return percentage + '%';
            }
          }
        }
      } as any // Type assertion to avoid strict type checking for chart options
    });
  }
}
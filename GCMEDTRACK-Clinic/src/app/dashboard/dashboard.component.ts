import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../services/api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
Chart.register(...registerables);
Chart.register(DataLabelsPlugin);

type DepartmentKeys = 'CSS' | 'CEAS' | 'CAHS' | 'CHTM' | 'CBA';

interface StudentMedicalReport {
  user_id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  department: string;
  program: string;
  year_level: string;
  submitted_documents: number;
  required_documents: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatTableModule,
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  showSuccessAlert: boolean = false;

  @ViewChild('appointmentsChart') appointmentsChartRef!: ElementRef;
  @ViewChild('documentsChart') documentsChartRef!: ElementRef;
  
  appointmentsChart: Chart | undefined;
  documentsChart: Chart | undefined;

  // Mock data for appointments per day
  appointmentsData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    data: [5, 12, 8, 15, 10, 7, 3]
  };

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'idNumber',
    'department',
    'program',
    'yearLevel',
    'medicalDocuments',
    'status'
  ];
  
  filteredStudents: StudentMedicalReport[] = [];
  searchQuery: string = '';
  selectedDepartment: string = ''; // Allow empty for "All Departments"
  selectedProgram: string = ''; // Allow empty for "All Programs"
  selectedYear: string = ''; // Allow empty for "All Years"
  students: StudentMedicalReport[] = [];
  selectedPrograms: { [key: string]: string[] } = {
    'CAHS': ['BSN', 'BSM'],
    'CBA': [
      'BSA',
      'BSBA-Financial Management',
      'BSBA-Human Resource Management',
      'BSBA-Marketing Management',
      'BSCA',
    ],
    'CCS': ['BSIT', 'BSCS', 'BSEMC'],
    'CEAS': [
      'BACOM',
      'BECE',
      'BCAE',
      'BPED',
      'BSED-English',
      'BSED-Filipino',
      'BSED-Mathematics',
      'BSED-Social Studies',
      'BSED-Sciences',
    ],
    'CHTM': ['BSHM', 'BSTM'],
  };

  styles: string[] = [
    `.completed {
      color: #4CAF50;
      font-weight: bold;
    }
    .incomplete {
      color: #f44336;
      font-weight: bold;
    }
    .clickable-row {
      cursor: pointer;
    }
    .clickable-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
    `
  ];

  constructor(private apiService: ApiService,  private router: Router) {}

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    if (localStorage.getItem('showLoginSuccess') === 'true') {
      this.showSuccessAlert = true;
      localStorage.removeItem('showLoginSuccess');
      
      // Auto-hide the alert after 3 seconds
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 3000);
    }
    this.fetchAllStudentMedicalReports();
  }

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

  fetchAllStudentMedicalReports(): void {
    console.log('Fetching student medical reports...');
    this.apiService.getAllStudentMedicalReports().subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        if (response && response.status === 'success') {
          if (Array.isArray(response.data)) {
            this.students = response.data;
            this.filteredStudents = [...this.students];
            console.log('Students loaded:', this.students.length);
            console.log('First student:', this.students[0]);
          } else {
            console.error('Response data is not an array:', response.data);
            this.students = [];
            this.filteredStudents = [];
          }
        } else {
          console.error('Invalid response:', response);
          this.students = [];
          this.filteredStudents = [];
        }
      },
      error: (error) => {
        console.error('Error fetching student medical reports:', error);
        this.students = [];
        this.filteredStudents = [];
      }
    });
  }

  onDepartmentChange(): void {
    // Clear the selected program when department changes
    this.selectedProgram = '';
    this.applyFilters();
  }

  onProgramChange(): void {
    this.applyFilters();
  }

  onYearChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesDepartment = this.selectedDepartment ? student.department === this.selectedDepartment : true;
      const matchesProgram = this.selectedProgram ? student.program === this.selectedProgram : true;
      const matchesYear = this.selectedYear ? student.year_level === this.selectedYear : true;
      const matchesSearchQuery = this.searchQuery
        ? (
          student.id_number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.last_name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        : true;

      return matchesDepartment && matchesProgram && matchesYear && matchesSearchQuery;
    });
  }
  
  downloadExcel(): void {
    console.log('Starting Excel download...');
    
    // Pass the current filters to the API
    const filters = {
      department: this.selectedDepartment,
      program: this.selectedProgram,
      year: this.selectedYear,
      search: this.searchQuery
    };
    
    this.apiService.getStudentMedicalReportsForExcel(filters).subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          // Create worksheet
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response.data);

          // Auto-size columns
          const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
          for (let C = range.s.c; C <= range.e.c; ++C) {
            let max_width = 0;
            for (let R = range.s.r; R <= range.e.r; ++R) {
              const cell = ws[XLSX.utils.encode_cell({r: R, c: C})];
              if (cell && cell.v) {
                const text = cell.v.toString();
                if (C === 7 || C === 8) { // Medical Documents and Vaccination Details columns
                  max_width = Math.max(max_width, 100);
                } else {
                  max_width = Math.max(max_width, text.length);
                }
              }
            }
            ws['!cols'] = ws['!cols'] || [];
            ws['!cols'][C] = { width: max_width + 2 };
          }

          // Set row heights for better readability
          ws['!rows'] = [];
          for (let R = range.s.r; R <= range.e.r; ++R) {
            ws['!rows'][R] = { hpt: 30 };
          }

          // Style the header row
          const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
          for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
            if (headerCell) {
              headerCell.s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "CCCCCC" } }
              };
            }
          }

          // Create workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Student Medical Reports');

          // Generate Excel file
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          
          // Convert buffer to Blob
          const blob = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });

          // Get current date for filename
          const date = new Date();
          const dateStr = date.toISOString().split('T')[0];
          const fileName = `student_medical_reports_${dateStr}.xlsx`;

          // Save file using file-saver
          saveAs(blob, fileName);

          console.log('Excel file downloaded successfully');
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (error) => {
        console.error('Error downloading excel:', error);
      }
    });
  }
}
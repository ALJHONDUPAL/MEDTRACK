import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../services/api.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
Chart.register(...registerables);
Chart.register(DataLabelsPlugin);

type DepartmentKeys = 'CSS' | 'CEAS' | 'CAHS' | 'CHTM-Tourism' | 'CHTM-Hospitality' | 'CBA';


interface Student {
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  department: DepartmentKeys;
  program: string;
  yearLevel: string;
  idNumber: string;
  profile_image_path?: string;

  // Fields related to Medical Documents
  medical_documents?: {
    document_type: string;
    date: string;
    status: string;
    location: string;
    uploaded_at: string;
  }[];

  // Fields related to Vaccination Records
  vaccination_records?: {
    first_dose_type: string;
    first_dose_date: string;
    second_dose_type: string;
    second_dose_date: string;
    booster_type: string;
    booster_date: string;
    status: string;
    uploaded_at: string;
  }[];
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule],
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

  constructor(private apiService: ApiService,  private router: Router) {}

  ngOnInit(): void {
    this.fetchAllProfiles();
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






  //for table 
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'idNumber',
    'department',
    'program',
    'yearLevel',
    'medicalDocuments',
    'vaccinationRecords',
  ];
  
  filteredStudents: Student[] = [];
  searchQuery: string = '';
  selectedDepartment: string = ''; // Allow empty for "All Departments"
  selectedProgram: string = ''; // Allow empty for "All Programs"
  selectedYear: string = ''; // Allow empty for "All Years"
  students: Student[] = [];
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
    'CHTM-Hospitality': ['BSHM'],
    'CHTM-Tourism': ['BSTM'],
  };

  fetchAllProfiles(): void {
  this.apiService.getListStudentProfiles(this.selectedDepartment, this.selectedYear).subscribe({
    next: (response) => {
      if (response.status === 'success') {
        this.students = response.data.map((student: any) => ({
          ...student,
          // Parsing the JSON arrays (medical_documents and vaccination_records)
          medical_documents: student.medical_documents ? JSON.parse(student.medical_documents) : [],
          vaccination_records: student.vaccination_records ? JSON.parse(student.vaccination_records) : []
        }));

        console.log('Fetched and parsed students:', this.students);
        this.applyFilters();
      } else {
        console.error('Error fetching profiles:', response.message);
      }
    },
    error: (error) => {
      console.error('API Error:', error);
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
    console.log('Unfiltered students:', this.students);
  
    this.filteredStudents = this.students.filter(student => {
      const matchesDepartment = this.selectedDepartment ? student.department === this.selectedDepartment : true;
      const matchesProgram = this.selectedProgram ? student.program === this.selectedProgram : true;
      const matchesYear = this.selectedYear ? student.yearLevel === this.selectedYear : true;
      const matchesSearchQuery = this.searchQuery
        ? (
          student.idNumber.includes(this.searchQuery) ||
          student.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          student.last_name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        : true;
  
      return matchesDepartment && matchesProgram && matchesYear && matchesSearchQuery;
    });
  
    console.log('Filtered students:', this.filteredStudents);
  }
  

  downloadExcel(): void {
    const exportData = this.filteredStudents.map(student => {
      const { profile_image_path, medical_documents, vaccination_records, ...studentWithoutImage } = student;
  
      // Ensure medical_documents and vaccination_records are defined (default to empty arrays if undefined)
      const flattenedMedicalDocs = (medical_documents ?? [])
        .map(doc => `${doc.document_type} (${doc.date}) - ${doc.status}`)
        .join(', ') || 'No Documents';
  
      const flattenedVaccRecords = (vaccination_records ?? [])
        .map(record => `${record.first_dose_type} (1st Dose: ${record.first_dose_date}), ${record.second_dose_type} (2nd Dose: ${record.second_dose_date}), ${record.booster_type} (Booster: ${record.booster_date}) - ${record.status}`)
        .join(', ') || 'No Records';
  
      return {
        ...studentWithoutImage,
        medical_documents: flattenedMedicalDocs,
        vaccination_records: flattenedVaccRecords,
      };
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Student Data': worksheet },
      SheetNames: ['Student Data'],
    };
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    saveAs(blob, 'StudentData.xlsx');
  }
  
  
  
  
}
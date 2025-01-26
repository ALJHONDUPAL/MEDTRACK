import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type DepartmentKeys = 'CSS' | 'CEAS' | 'CAHS' | 'CHTM-Tourism' | 'CHTM-Hospitality' | 'CBA';

interface MedicalDocument {
  name: string;
  status: string;
  needsSubmission?: boolean;
  information?: {
    title: string;
    details: string;
  };
}

interface Student {
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  department: DepartmentKeys;
  program: string;
  yearLevel: string;
  idNumber: string;
  profile_image_path: string;
}

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent implements OnInit {
  searchQuery: string = '';
  selectedDepartment: string = ''; // Allow empty for "All Departments"
  selectedProgram: string = ''; // Allow empty for "All Programs"
  selectedYear: string = ''; // Allow empty for "All Years"
  students: Student[] = [];
  filteredStudents: Student[] = [];
  displayedColumns: string[] = ['profileImage', 'firstName', 'lastName', 'idNumber', 'department', 'program', 'yearLevel', 'action'];

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
    'CHTM': ['BSHM','BSTM'],
  };

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit(): void {
    this.fetchAllProfiles();
  }

  fetchAllProfiles(): void {
    this.apiService.getAllStudentProfiles(this.selectedDepartment, this.selectedYear).subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        if (response.status === 'success') {
          this.students = response.data;
          console.log('Students:', this.students);
          this.applyFilters();
        } else {
          console.error('Error fetching profiles:', response.message);
        }
      },
      error: (error) => {
        console.error('API Error:', error);
      },
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
    console.log('Full students data before filtering:', this.students); // Raw data from API
    this.filteredStudents = this.students.filter(student => {
      const matchesDepartment = this.selectedDepartment ? student.department === this.selectedDepartment : true;
      const matchesProgram = this.selectedProgram ? student.program === this.selectedProgram : true;
      const studentYear = parseInt(student.yearLevel);
      const matchesYear = this.selectedYear ? studentYear === parseInt(this.selectedYear) : true;
      const matchesSearchQuery = this.searchQuery ? (
        student.idNumber.includes(this.searchQuery) ||
        student.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      ) : true;

      return matchesDepartment && matchesProgram && matchesYear && matchesSearchQuery;
    });

    console.log('Filtered Students Data:', this.filteredStudents); // Ensure userId is preserved
  }

  logStudentId(userId: string): void {
    console.log('Clicked student ID for medical details:', userId);
  }

  goToMedicalDetails(user_id: string): void {
    if (!user_id) {
      return;
    }

    this.router.navigate(['/medical-details', user_id]);
  }

  getImageUrl(profile_image_path: string, userId: string): string {
    console.log('Profile Image Path:', profile_image_path);
    console.log('User ID:', userId);

    if (profile_image_path) {
      return this.apiService.getFullImageUrl(profile_image_path);
    }
    return 'assets/default-profile.png';
  }

  getSanitizedImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getYearLevelDisplay(yearLevel: string | number | undefined): string {
    if (!yearLevel) return 'N/A';
    
    const level = yearLevel.toString();
    
    switch (level) {
      case '1':
        return '1st';
      case '2':
        return '2nd';
      case '3':
        return '3rd';
      case '4':
        return '4th';
      default:
        // Handle any other numbers with proper ordinal suffixes
        const lastDigit = level.charAt(level.length - 1);
        if (lastDigit === '1') return `${level}st`;
        if (lastDigit === '2') return `${level}nd`;
        if (lastDigit === '3') return `${level}rd`;
        return `${level}th`;
    }
  }
}

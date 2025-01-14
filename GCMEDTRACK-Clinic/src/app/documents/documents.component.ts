  import { Component, OnInit } from '@angular/core';
  import { ApiService } from '../services/api.service';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { Router, RouterLink } from '@angular/router';
  import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    user_id: string; // Added userId to the interface
    name: string;
    department: DepartmentKeys;
    yearLevel: string;
    idNumber: string;
    profileImage: string;
  }

  @Component({
    selector: 'app-documents',
    imports: [CommonModule, FormsModule],
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.css',
  })
  export class DocumentsComponent implements OnInit {
    searchQuery: string = '';
    selectedDepartment: string = ''; // Allow empty for "All Departments"
    selectedYear: string = ''; // Allow empty for "All Years"
    students: Student[] = [];
    filteredStudents: Student[] = [];

    constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private router: Router) {}

    ngOnInit(): void {
      this.fetchAllProfiles();
    }
    fetchAllProfiles(): void {
      this.apiService.getAllStudentProfiles(this.selectedDepartment, this.selectedYear).subscribe({
        next: (response) => {
          console.log('API response:', response); // Raw API response
          if (response.status === 'success') {
            this.students = response.data;
            console.log('Students array:', this.students); // Check that userId exists here
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
        const studentYear = parseInt(student.yearLevel);
        const matchesYear = this.selectedYear ? studentYear === parseInt(this.selectedYear) : true;
        const matchesSearchQuery = this.searchQuery ? student.idNumber.includes(this.searchQuery) : true;
    
        return matchesDepartment && matchesYear && matchesSearchQuery;
      });
    
      console.log('Filtered Students Data:', this.filteredStudents); // Ensure userId is preserved
    }
    
    
    
    
    
    
    
    
    
    logStudentId(userId: string): void {
      console.log('Clicked student ID for medical details:', userId);
    }
    
    goToMedicalDetails(user_id: string): void {
      console.log('goToMedicalDetails called with user_id:', user_id); // Log incoming `user_id`
    
      if (!user_id) {
        console.error('Student ID is undefined or empty!', user_id); // Log undefined case
        return;
      }
    
      this.router.navigate(['/medical-details', user_id]);
    }
    
    
    getImageUrl(): string {
  if (this.students && this.students.length > 0 && this.students[0].profileImage) {
    return this.apiService.getFullImageUrl(this.students[0].profileImage);
  }
  return ''; // Or default image URL if profileImage is not available
}

    
    

    getSanitizedImageUrl(url: string): SafeUrl {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
  }

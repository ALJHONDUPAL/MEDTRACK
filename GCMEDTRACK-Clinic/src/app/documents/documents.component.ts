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
  user_id: string;
  name: string;
  department: DepartmentKeys;
  yearLevel: string;
  idNumber: string;
  profile_image_path: string;
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
    // console.log('goToMedicalDetails called with user_id:', user_id); // Log incoming `user_id`
  
    if (!user_id) {
      // console.error('Student ID is undefined or empty!', user_id); // Log undefined case
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
}

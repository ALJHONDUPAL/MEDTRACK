import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


interface Student {
  user_id: string; // Added userId to the interface
  name: string;
  yearLevel: string;
  idNumber: string;
  profileImage: string;
}

interface MedicalDocument {
  name: string;
  status: string; // Possible values: "Cleared", "Need Submission"
  icon: string; // Icons for cleared or need submission
  color: string; // Colors for text
}

@Component({
  selector: 'app-medical-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './medical-details.component.html',
  styleUrl: './medical-details.component.css'
})
export class MedicalDetailsComponent implements OnInit {
  student: any = {};
  studentId: string = '';
  safeProfileImagePath: SafeUrl = '';
  students: Student[] = [];
  medicalDocuments: MedicalDocument[] = [];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {


    //for the table status:

    this.medicalDocuments = [
      { name: 'Complete Blood Count', status: 'Cleared', icon: '✔️', color: 'text-green-600' },
      { name: 'Urinalysis', status: 'Need Submission', icon: '❌', color: 'text-red-600' },
      { name: 'COVID-19 Vaccination Card', status: 'Cleared', icon: '✔️', color: 'text-green-600' },
      { name: 'Chest-Xray', status: 'Need Submission', icon: '❌', color: 'text-red-600' },
    ];
    // Capture user_id from the URL
    this.route.params.subscribe(params => {
      const studentId = params['user_id'];  // Ensure 'user_id' is correctly mapped from the URL
      console.log('Fetched studentId from the URL:', studentId);
  
      if (studentId) {
        this.studentId = studentId;
        this.fetchStudentDetails(studentId);  // Call the function to fetch student details
      } else {
        console.error('Student ID is undefined!');
      }
    });
  }

  // Fetch student details using API
  
  fetchStudentDetails(studentId: string): void {
    console.log('Fetching details for studentId:', studentId);

    this.apiService.getStudentById(studentId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log('Fetched student details:', response.data);
          this.student = response.data;  // Assign the response to student object
        } else {
          console.error('Error fetching student details:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching student profile:', error);
      },
    });
  }

  getImageUrl(): string {
    if (this.student && this.student.profile_image_path) {
      const imageUrl = this.apiService.getFullImageUrl(this.student.profile_image_path);
      console.log('Constructed Image URL:', imageUrl); // Log the full image URL for debugging
      return imageUrl;
    }
    return 'assets/default-profile.png'; // Default image URL if profile_image_path is not available
  }
  getMedUrl(): string {
    if (this.student && this.student.file_path) {
      const imageUrl = this.apiService.getFullImageUrl(this.student.file_path);
      console.log('Constructed Image URL:', imageUrl); // Log the full image URL for debugging
      return imageUrl;
    }
    return 'assets/default-profile.png'; // Default image URL if profile_image_path is not available
  }
  getVacUrl(): string {
    if (this.student && this.student.document_path) {
      const imageUrl = this.apiService.getFullImageUrl(this.student.document_path);
      console.log('Constructed Image URL:', imageUrl); // Log the full image URL for debugging
      return imageUrl;
    }
    return 'assets/default-profile.png'; // Default image URL if profile_image_path is not available
  }
  

  getSanitizedImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  toggleDocumentStatus(index: number): void {
    const doc = this.medicalDocuments[index];
    doc.status = doc.status === 'Cleared' ? 'Need Submission' : 'Cleared';
    doc.icon = doc.status === 'Cleared' ? '✔️' : '❌';
    doc.color = doc.status === 'Cleared' ? 'text-green-600' : 'text-red-600';
  }
}
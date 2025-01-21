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
document_type: any;
  name: string;
  status: string;
  file_path?: string;
  date?: string;
  location?: string;
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
  documents: { [key: string]: MedicalDocument } = {};
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const studentId = params['user_id'];
      if (studentId) {
        this.studentId = studentId;
        this.fetchStudentDetails(studentId);
      }
    });
  }

  fetchStudentDetails(studentId: string): void {
    this.apiService.getStudentById(studentId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.student = response.data.basic;
          this.documents = this.formatDocuments(response.data.documents);
        }
      },
      error: (error) => {
        console.error('Error fetching student details:', error);
      }
    });
  }

  private formatDocuments(documents: any): { [key: string]: MedicalDocument } {
    const formattedDocs: { [key: string]: MedicalDocument } = {
      'Complete Blood Count': {
        name: 'Complete Blood Count',
        document_type: 'bloodCount',
        status: documents?.bloodCount?.status || 'Need Submission',
        file_path: documents?.bloodCount?.file_path,
        date: documents?.bloodCount?.date,
        location: documents?.bloodCount?.location
      },
      'Urinalysis': {
        name: 'Urinalysis',
        document_type: 'urinalysis',
        status: documents?.urinalysis?.status || 'Need Submission',
        file_path: documents?.urinalysis?.file_path,
        date: documents?.urinalysis?.date,
        location: documents?.urinalysis?.location
      },
      'COVID-19 Vaccination Card': {
        name: 'COVID-19 Vaccination Card',
        document_type: 'vaccination',
        status: this.student?.vaccination_status || 'Need Submission',
        file_path: this.student?.vaccination?.document_path,
        date: this.student?.vaccination?.first_dose_date,
        location: 'Vaccination Record'
      },
      'Chest X-ray': {
        name: 'Chest X-ray',
        document_type: 'chestXray',
        status: documents?.chestXray?.status || 'Need Submission',
        file_path: documents?.chestXray?.file_path,
        date: documents?.chestXray?.date,
        location: documents?.chestXray?.location
      }
    };

    // Add CAHS specific documents if student is from CAHS
    if (this.student?.department === 'CAHS') {
      formattedDocs['Anti HBS'] = {
        name: 'Anti HBS',
        document_type: 'antiHBS',
        status: documents?.antiHBS?.status || 'Need Submission',
        file_path: documents?.antiHBS?.file_path,
        date: documents?.antiHBS?.date,
        location: documents?.antiHBS?.location
      };
      formattedDocs['Hepatitis B Vaccine'] = {
        name: 'Hepatitis B Vaccine',
        document_type: 'hepaBVaccine',
        status: documents?.hepaBVaccine?.status || 'Need Submission',
        file_path: documents?.hepaBVaccine?.file_path,
        date: documents?.hepaBVaccine?.date,
        location: documents?.hepaBVaccine?.location
      };
      formattedDocs['Flu Vaccine'] = {
        name: 'Flu Vaccine',
        document_type: 'fluVaccine',
        status: documents?.fluVaccine?.status || 'Need Submission',
        file_path: documents?.fluVaccine?.file_path,
        date: documents?.fluVaccine?.date,
        location: documents?.fluVaccine?.location
      };
    }

    // Log the documents and status for debugging
    console.log('Student data:', this.student);
    console.log('Documents:', documents);
    console.log('Formatted docs:', formattedDocs);

    return formattedDocs;
  }

  getDocumentStatus(documentName: string): string {
    return this.documents[documentName]?.status || 'Need Submission';
  }

  getImageUrl(): string {
    if (this.student && this.student.profile_image_path) {
      const imageUrl = this.apiService.getFullImageUrl(this.student.profile_image_path);
      // console.log('Constructed Image URL:', imageUrl); // Log the full image URL for debugging
      return imageUrl;
    }
    return 'assets/default-profile.png'; // Default image URL if profile_image_path is not available
  }

  getSanitizedImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getDocumentUrl(path: string): string {
    if (path) {
      return this.apiService.getFullImageUrl(path);
    }
    return 'assets/default-document.png';
  }

  hasAnyRecords(): boolean {
    return (
      Object.values(this.documents).some(doc => doc.file_path) || 
      (this.student.vaccination && 
       (this.student.vaccination.first_dose_type || 
        this.student.vaccination.second_dose_type || 
        this.student.vaccination.booster_type))
    );
  }
}
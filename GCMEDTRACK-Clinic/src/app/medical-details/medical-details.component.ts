import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

// Add this interface to better type the student data
interface MedicalDocument {
  status: string;
  file_path: string;
  date: string;
  location: string;
  document_type: string;
}

interface StudentData {
  basic: {
    name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    department: string;
    program: string;
    year_level: string;
    id_number: string;
    contact_number: string;
    profile_image_path: string;
    vaccination: {
      first_dose_type: string | null;
      first_dose_date: string | null;
      second_dose_type: string | null;
      second_dose_date: string | null;
      booster_type: string | null;
      booster_date: string | null;
      document_path: string | null;
      status: string | null;
    };
  };
  documents: {
    [key: string]: MedicalDocument;
  };
}

@Component({
  selector: 'app-medical-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './medical-details.component.html',
  styleUrl: './medical-details.component.css',
  standalone: true
})
export class MedicalDetailsComponent implements OnInit {
  studentData: StudentData | null = null;
  previewImage: string | null = null;
  private documentTypeMap: { [key: string]: string } = {
    'Complete Blood Count': 'bloodCount',
    'Urinalysis': 'urinalysis',
    'Chest X-ray': 'chestXray',
    'COVID-19 Vaccination Card': 'covidVaccination',
    'Anti HBS (For students with previous Hepa B vaccine)': 'antiHBS',
    'Hepatitis B Vaccine': 'hepaBVaccine',
    'Flu Vaccine Card': 'fluVaccine',
    'Anti HAV(Hepa A)': 'antiHAV',
    'Fecalysis': 'fecalysis',
    'Drug Test for RLE requirements': 'drugTest'
  };
  selectedDocument: {
    type: string;
    details: MedicalDocument | null;
    imageUrl: string | null;
    vaccinationDetails?: {
      first_dose_type: string | null;
      first_dose_date: string | null;
      second_dose_type: string | null;
      second_dose_date: string | null;
      booster_type: string | null;
      booster_date: string | null;
      document_path: string | null;
      status: string | null;
    };
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    public apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const studentId = params['user_id'];
      if (studentId) {
        this.fetchStudentDetails(studentId);
      }
    });
  }

  fetchStudentDetails(studentId: string): void {
    this.apiService.getStudentById(studentId).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.studentData = response.data;
          console.log('Student Data:', this.studentData);
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching student details:', error);
      }
    });
  }

  getFullName(): string {
    if (!this.studentData?.basic) return '';
    const { last_name, first_name, middle_name } = this.studentData.basic;
    return `${last_name}, ${first_name} ${middle_name || ''}`.trim();
  }

  getMedicalRequirements(): string[] {
    if (!this.studentData?.basic?.department) {
      return [];
    }

    const baseRequirements = [
      'Complete Blood Count',
      'Urinalysis',
      'Chest X-ray',
      'COVID-19 Vaccination Card'
    ];

    // For CAHS department
    if (this.studentData.basic.department === 'CAHS') {
      const cahsRequirements = [
        ...baseRequirements,
        'Anti HBS (For students with previous Hepa B vaccine)',
        'Hepatitis B Vaccine',
        'Flu Vaccine Card'
      ];

      if (this.studentData.basic.year_level === '1') {
        cahsRequirements.push('Hepatitis screening: HBsAg (Hepatitis B Surface Antigen)');
      }

      if (['2', '3', '4'].includes(this.studentData.basic.year_level.toString())) {
        cahsRequirements.push('Drug Test for RLE requirements');
      }

      return cahsRequirements;
    }

    // For BSHM program in CHTM
    if (this.studentData.basic.department === 'CHTM' && 
        this.studentData.basic.program === 'BSHM') {
      return [
        ...baseRequirements,
        'Anti HAV(Hepa A)',
        'Fecalysis'
      ];
    }

    return baseRequirements;
  }

  getDocumentStatus(documentType: string): string {
    if (!this.studentData?.documents) return 'Need Submission';
    
    const dbDocumentType = this.documentTypeMap[documentType];

    // Special handling for COVID-19 Vaccination Card
    if (documentType === 'COVID-19 Vaccination Card') {
      // Check if vaccination data exists and has doses
      if (this.studentData.basic?.vaccination) {
        const vaccination = this.studentData.basic.vaccination;
        if (vaccination.first_dose_type || vaccination.second_dose_type) {
          return 'Submitted';
        }
      }
      return 'Need Submission';
    }

    return this.studentData.documents[dbDocumentType]?.status || 'Need Submission';
  }

  getDocumentUrl(documentType: string): string | null {
    if (!this.studentData?.documents) return null;
    
    const dbDocumentType = this.documentTypeMap[documentType];

    // Special handling for COVID-19 Vaccination Card
    if (documentType === 'COVID-19 Vaccination Card') {
      return this.studentData.basic?.vaccination?.document_path ? 
        this.apiService.getFullImageUrl(this.studentData.basic.vaccination.document_path) : 
        null;
    }

    const document = this.studentData.documents[dbDocumentType];
    return document?.file_path ? this.apiService.getFullImageUrl(document.file_path) : null;
  }

  openImagePreview(documentType: string): void {
    const imageUrl = this.getDocumentUrl(documentType);
    let details: MedicalDocument | null = null;
    let vaccinationDetails;

    if (documentType === 'COVID-19 Vaccination Card') {
      vaccinationDetails = this.studentData?.basic?.vaccination;
      details = {
        status: 'Submitted',
        file_path: vaccinationDetails?.document_path || '',
        date: vaccinationDetails?.first_dose_date || '',
        location: 'N/A',
        document_type: documentType
      };
    } else {
      const dbDocumentType = this.documentTypeMap[documentType];
      details = this.studentData?.documents[dbDocumentType] || null;
    }

    this.selectedDocument = {
      type: documentType,
      details,
      imageUrl,
      vaccinationDetails: documentType === 'COVID-19 Vaccination Card' ? 
        this.studentData?.basic?.vaccination : undefined
    };
    this.previewImage = imageUrl;
  }

  closeImagePreview(): void {
    this.previewImage = null;
    this.selectedDocument = null;
  }

  // Add this method to handle image error
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'assets/default-profile.png';
    }
  }

  // Add this method to format year level
  getYearLevelDisplay(yearLevel: string | undefined): string {
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
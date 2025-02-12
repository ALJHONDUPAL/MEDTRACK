import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  showSuccessModal: boolean = false;
successMessage: string = '';
showErrorModal: boolean = false;
errorMessage: string = '';


  expandedSections: { [key: string]: boolean } = {
    bloodCount: false,
    urinalysis: false,
    covidCard: false,
    chestXray: false,
    hepaA: false,
    fecalysis: false,
    hbsag: false,
    antiHbs: false,
    hepaBVaccine: false,
    fluVaccine: false
  };

  bloodCountImage: string | null = null;
  urinalysisImage: string | null = null;
  covidCardImage: string | null = null;
  chestXrayImage: string | null = null;
  vaccinationImage: string | null = null;
  xrayImage: string | null = null;
  hepaImage: string | null = null;
  fecalysisImage: string | null = null;

  showModal: boolean = false;
  showErrors: boolean = false;
  profileData: any = {
    first_name: '',
    last_name: '',
    middle_name: '',
    id_number: '',
    department: '',
    program: '',
    year_level: '',
    contact_number: '',
    profile_image_path: 'assets/default-avatar.svg'
  };
  tempProfileImage: string | null = null;

  showBloodCountModal = false;

  showImagePreview = false;
  previewImage: string | null = null;

  bloodCountData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  showUrinalysisModal = false;
  urinalysisData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  idNumberError: boolean = false;
  idNumberErrorMessage: string = '';

  showVaccinationModal = false;
  vaccinationData: any = {};

  showXrayModal = false;
  xrayData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  showHepaModal = false;
  hepaData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  showFecalysisModal = false;
  fecalysisData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  antiHAVData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  antiHBSData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  hepaBVaccineData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  fluVaccineData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};

  drugTestData: {
    date?: string;
    location?: string;
    status?: string;
    file_path?: string;
  } = {};
  // Add new properties for CAHS requirements
  antiHBSImage: string | null = null;
  hepaBVaccineImage: string | null = null;
  fluVaccineImage: string | null = null;
  drugTestImage: string | null = null;

  showAntiHBSModal = false;
  showHepaBVaccineModal = false;
  showFluVaccineModal = false;
  showDrugTestModal = false;

  fluVaccineCardImage: string | null = null;

  hbsagImage: string | null = null;
  showHbsagModal = false;

  nameError: boolean = false;
  departmentError: boolean = false;
  yearLevelError: boolean = false;

  // New properties for Anti HAV
  showAntiHAVModal = false;
  antiHAVImage: string | null = null;
  

  userId: string | null = null;

  // Add this property to store the selected file

  selectedBloodCountFile: File | null = null;
  selectedUrinalysisFile: File | null = null;
  selectedChestXrayFile: File | null = null;
  selectedFile: any;
  selectedVaccinationFile: any;
  selectedAntiHBSFile: File |  null = null;
  selectedHepaBVaccineFile: File |  null = null;
  selectedFluVaccineFile: File | null = null;
  selectedAntiHAVFile: File | null = null; 
  selectedFecalysisFile: File | null = null;
  selectedDrugTestFile: File | null = null ;

  currentDate: Date = new Date();
  private dateTimer: any;

  selectedProfileImage: File | null = null;

  departmentPrograms: { [key: string]: string[] } = {
    'CAHS': ['BSN', 'BSM'],
    'CBA': [
      'BSA',
      'BSBA-Financial Management',
      'BSBA-Human Resource Management',
      'BSBA-Marketing Management',
      'BSCA'
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
      'BSED-Sciences'
    ],
    'CHTM': ['BSHM','BSTM'],
  };

  // Add new properties
  contactNumberError: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user ID found');
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadUserProfile();
    this.startClock();
  }

  ngOnDestroy() {
    if (this.dateTimer) {
      clearInterval(this.dateTimer);
    }
  }

  loadUserProfile() {
    if (!this.userId) {
      console.error('No user ID found');
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getUserProfile(this.userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.profileData = {
            ...response.data,
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
            middle_name: response.data.middle_name || '',
            id_number: response.data.id_number || '',
            department: response.data.department || '',
            program: response.data.program || '',
            year_level: response.data.year_level || '',
            contact_number: response.data.contact_number || '',
            profile_image_path: response.data.profile_image_path || 'assets/default-avatar.svg'
          };
          this.loadMedicalDocuments();
          this.loadVaccinationData();
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  getFullName(): string {
    if (!this.profileData) return '';
    
    const firstName = this.profileData.first_name || '';
    const lastName = this.profileData.last_name || '';
    const middleInitial = this.profileData.middle_name ? 
      ` ${this.profileData.middle_name.charAt(0)}.` : '';
    
    return `${firstName}${middleInitial} ${lastName}`;
  }

  getYearLevelDisplay(year: string | number): string {
    if (!year) return '';
    
    const yearNum = year.toString();
    switch (yearNum) {
      case '1': return '1st';
      case '2': return '2nd';
      case '3': return '3rd';
      case '4': return '4th';
      default: return '';
    }
  }

  loadMedicalDocuments(): void {
    if (!this.userId) return;

    this.apiService.getMedicalDocuments(this.userId).subscribe({
        next: (response) => {
            if (response.status === 'success' && response.data) {
                // Reset all document data first
                this.resetDocumentData();
                
                // Process each document
                response.data.forEach((doc: any) => {
                    const documentData = {
                        date: doc.date,
                        location: doc.location,
                        status: doc.status || 'Submitted',
                        file_path: doc.file_path
                    };

                    // Update the corresponding document data based on type
                    switch (doc.document_type) {
                        case 'bloodCount':
                            this.bloodCountData = documentData;
                            this.bloodCountImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'urinalysis':
                            this.urinalysisData = documentData;
                            this.urinalysisImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'chestXray':
                            this.xrayData = documentData;
                            this.xrayImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'antiHBS':
                            this.antiHBSData = documentData;
                            this.antiHBSImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'hepaBVaccine':
                            this.hepaBVaccineData = documentData;
                            this.hepaBVaccineImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'fluVaccine':
                            this.fluVaccineData = documentData;
                            this.fluVaccineImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'antiHAV':
                            this.antiHAVData = documentData;
                            this.antiHAVImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'fecalysis':
                            this.fecalysisData = documentData;
                            this.fecalysisImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        case 'drugTest':
                            this.drugTestData = documentData;
                            this.drugTestImage = this.getDocumentImageUrl(doc.file_path);
                            break;
                        default:
                            console.warn(`Unknown document type: ${doc.document_type}`);
                    }
                });
            }
        },
        error: (error) => {
            console.error('Error loading medical documents:', error);
        }
    });
}

// Helper method to reset all document data
private resetDocumentData(): void {
    // Reset all document data objects
    this.bloodCountData = {};
    this.urinalysisData = {};
    this.xrayData = {};
    this.antiHBSData = {};
    this.hepaBVaccineData = {};
    this.fluVaccineData = {};
    this.antiHAVData = {};
    this.fecalysisData = {};
    this.drugTestData = {};

    // Reset all document images
    this.bloodCountImage = null;
    this.urinalysisImage = null;
    this.xrayImage = null;
    this.antiHBSImage = null;
    this.hepaBVaccineImage = null;
    this.fluVaccineImage = null;
    this.antiHAVImage = null;
    this.fecalysisImage = null;
    this.drugTestImage = null;
}

// Helper method to get document image URL
private getDocumentImageUrl(filePath: string | null): string | null {
    return filePath ? this.apiService.getFullImageUrl(filePath) : null;
}

loadVaccinationData() {
    if (!this.userId) {
        console.error('User ID is not available.');
        return;
    }

    this.apiService.getVaccinationRecord(Number(this.userId)).subscribe({
        next: (response: { status: string; data?: any }) => {
            if (response.status === 'success' && response.data && response.data.length > 0) {
                // Store the complete vaccination data
                this.vaccinationData = {
                    firstDoseType: response.data[0].first_dose_type,
                    firstDoseDate: response.data[0].first_dose_date,
                    secondDoseType: response.data[0].second_dose_type,
                    secondDoseDate: response.data[0].second_dose_date,
                    boosterType: response.data[0].booster_type,
                    boosterDate: response.data[0].booster_date,
                    status: response.data[0].status || 'Submitted',
                    document_path: response.data[0].document_path
                };
                
                // Set the vaccination image if document_path exists
                if (response.data[0].document_path) {
                    this.vaccinationImage = this.apiService.getFullImageUrl(response.data[0].document_path);
                }
            }
        },
        error: (error: any) => {
            console.error('Error loading vaccination data:', error);
        }
    });
}

saveVaccination(formData: any): void {
  if (!this.userId) return;

  const formDataObj = new FormData();
  formDataObj.append('user_id', this.userId);
  formDataObj.append('firstDoseType', formData.firstDoseType || '');
  formDataObj.append('firstDoseDate', formData.firstDoseDate || '');
  formDataObj.append('secondDoseType', formData.secondDoseType || '');
  formDataObj.append('secondDoseDate', formData.secondDoseDate || '');
  formDataObj.append('boosterType', formData.boosterType || '');
  formDataObj.append('boosterDate', formData.boosterDate || '');

  // Check if a file is selected
  if (this.selectedVaccinationFile) {
    formDataObj.append('document', this.selectedVaccinationFile);
  } else {
    this.showErrorModal = true;
    this.errorMessage = 'Please select a document to upload.';
    return;
  }
    if (this.selectedVaccinationFile) {
        formDataObj.append('document', this.selectedVaccinationFile);
    } else {
        console.error('No document file selected for upload.');
        alert('Please select a document to upload.');
        return;
    }

  this.apiService.uploadVaccinationRecord(formDataObj).subscribe({
    next: (response: { status: string; message?: string }) => {
      if (response.status === 'success') {
        this.closeVaccinationModal();
        this.loadVaccinationData();
        this.showSuccessModal = true;
        this.successMessage = 'Vaccination record saved successfully.';
      } else {
        this.showErrorModal = true;
        this.errorMessage = response.message || 'Failed to save vaccination record.';
      }
    },
    error: (error: any) => {
      console.error('Error saving vaccination record:', error);
      this.showErrorModal = true;
      this.errorMessage = 'An error occurred while saving the vaccination record.';
    },
  });
    this.apiService.uploadVaccinationRecord(formDataObj).subscribe({
        next: (response: { status: string; message?: string; data?: any }) => {
            if (response.status === 'success') {
                // Update local data with the form values
                this.vaccinationData = {
                    ...formData,
                    status: 'Submitted'
                };
                
                // Reload vaccination data to get the complete updated data
                this.loadVaccinationData();
                
                this.closeVaccinationModal();
                alert('Vaccination record saved successfully.');
            } else {
                alert(response.message || 'Failed to save vaccination record');
            }
        },
        error: (error: any) => {
            console.error('Error saving vaccination record:', error);
            alert('Failed to save vaccination record');
        }
    });
}


saveDocument(formData: any, documentType: string, selectedFile: File | null): Observable<any> {
  if (!this.userId) {
      console.error('No user ID found');
      return throwError(() => new Error('No user ID found'));
  }

  if (!selectedFile) {
      console.error('No file selected');
      return throwError(() => new Error('No file selected. Please select a document to upload.'));
  }

  const documentFormData = new FormData();
  documentFormData.append('user_id', this.userId);
  documentFormData.append('document_type', documentType);
  documentFormData.append('date', formData.date);
  documentFormData.append('location', formData.location);
  documentFormData.append('document', selectedFile);

  return this.apiService.uploadMedicalDocument(documentFormData);
}


saveBloodCount(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedBloodCountFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'bloodCount', this.selectedBloodCountFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Blood Count information saved successfully!';
        this.closeBloodCountModal();
      } else {
        console.error('Failed to save Blood Count information:', response.message);
        this.showSuccessModal = true;
        this.successMessage = 'Failed to save Blood Count information. Please try again.';
      }
    },
    error: (error) => {
      console.error('Error saving Blood Count information:', error);
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while saving the Blood Count information.';
    },
  });
}


saveUrinalysis(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedUrinalysisFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'urinalysis', this.selectedUrinalysisFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Urinalysis information saved successfully!';
        this.closeUrinalysisModal();
      } else {
        console.error('Failed to save urinalysis information:', response.message);
        this.showSuccessModal = true;
        this.successMessage = 'Failed to save urinalysis information. Please try again.';
      }
    },
    error: (error: any) => {
      console.error('Error saving urinalysis information:', error);
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while saving the urinalysis information.';
    },
  });
}


saveXray(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedChestXrayFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'chestXray', this.selectedChestXrayFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Chest X-ray information saved successfully!';
        this.closeXrayModal();
      } else {
        console.error('Failed to save chest X-ray information:', response.message);
        this.showSuccessModal = true;
        this.successMessage = 'Failed to save chest X-ray information. Please try again.';
      }
    },
    error: (error) => {
      console.error('Error saving chest X-ray information:', error);
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while saving the chest X-ray information.';
    },
  });
}


saveAntiHBS(formData: any): void {
  // Validation: Check for required fields and file selection
  if (!formData.date || !formData.location || !this.selectedAntiHBSFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  // Call saveDocument API
  this.saveDocument(formData, 'antiHBS', this.selectedAntiHBSFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        // Update antiHBSData status and display success modal
        this.antiHBSData.status = 'Submitted';
        this.showSuccessModal = true;
        this.successMessage = 'Anti-HBS document uploaded successfully!';
        this.closeAntiHBSModal(); // Close form modal if implemented
      } else {
        console.error('Failed to save Anti-HBS document:', response.message);
        this.showSuccessModal = true;
        this.successMessage = 'Failed to upload Anti-HBS document. Please try again.';
      }
    },
    error: (error) => {
      console.error('Error saving Anti-HBS document:', error);
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while uploading the Anti-HBS document.';
    },
  });
}


saveHepaBVaccine(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedHepaBVaccineFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'hepaBVaccine', this.selectedHepaBVaccineFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Hepa B vaccine document uploaded successfully!';
        this.closeHepaBVaccineModal(); // Optional: Close modal if applicable
      } else {
        this.showSuccessModal = true;
        this.successMessage = 'Failed to upload Hepa B vaccine document.';
      }
    },
    error: () => {
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while uploading the Hepa B vaccine document.';
    },
  });
}

saveFluVaccine(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedFluVaccineFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'fluVaccine', this.selectedFluVaccineFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Flu vaccine document uploaded successfully!';
        this.closeFluVaccineModal(); // Optional: Close modal if applicable
      } else {
        this.showSuccessModal = true;
        this.successMessage = 'Failed to upload flu vaccine document.';
      }
    },
    error: () => {
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while uploading the flu vaccine document.';
    },
  });
}


saveAntiHAV(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedAntiHAVFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'antiHAV', this.selectedAntiHAVFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.antiHAVData.status = 'Submitted';
        this.showSuccessModal = true;
        this.successMessage = 'Anti-HAV document uploaded successfully!';
        this.closeAntiHAVModal(); // Optional: Close modal if applicable
      } else {
        this.showSuccessModal = true;
        this.successMessage = 'Failed to upload Anti-HAV document.';
      }
    },
    error: () => {
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while uploading the Anti-HAV document.';
    },
  });
}


// Save Fecalysis document
saveFecalysis(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedFecalysisFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'fecalysis', this.selectedFecalysisFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Fecalysis document uploaded successfully!';
        this.closeFecalysisModal(); // Optional: Close modal if applicable
      } else {
        this.showSuccessModal = true;
        this.successMessage = 'Failed to upload fecalysis document.';
      }
    },
    error: () => {
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while uploading the fecalysis document.';
    },
  });
}


saveDrugTest(formData: any): void {
  if (!formData.date || !formData.location || !this.selectedDrugTestFile) {
    this.showSuccessModal = true;
    this.successMessage = 'Please fill in all required fields and upload a document.';
    return;
  }

  this.saveDocument(formData, 'drugTest', this.selectedDrugTestFile).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.showSuccessModal = true;
        this.successMessage = 'Drug test document uploaded successfully!';
        this.closeDrugTestModal(); // Optional: Close modal if applicable
      } else {
        this.showSuccessModal = true;
        this.successMessage = 'Failed to upload drug test document.';
      }
    },
    error: () => {
      this.showSuccessModal = true;
      this.successMessage = 'An error occurred while uploading the drug test document.';
    },
  });
}


onFileSelected(event: any, documentType: string): void {
    const file = event.target.files[0];
    if (file) {
        // Set the selected file based on the document type
        switch (documentType) {
            case 'bloodCount':
                this.selectedBloodCountFile = file;
                const readerBloodCount = new FileReader();
                readerBloodCount.onload = (e: any) => {
                    this.bloodCountImage = e.target.result;
                };
                readerBloodCount.readAsDataURL(file);
                break;

            case 'urinalysis':
                this.selectedUrinalysisFile = file;
                const readerUrinalysis = new FileReader();
                readerUrinalysis.onload = (e: any) => {
                    this.urinalysisImage = e.target.result; // Assuming you have a variable for the image preview
                };
                readerUrinalysis.readAsDataURL(file);
                break;

            case 'chestXray':
                this.selectedChestXrayFile = file;
                const readerChestXray = new FileReader();
                readerChestXray.onload = (e: any) => {
                    this.xrayImage = e.target.result; // Assuming you have a variable for the image preview
                };
                readerChestXray.readAsDataURL(file);
                break;

            case 'vaccination':
                this.selectedVaccinationFile = file; // Assuming you have a variable for vaccination
                const readerVaccination = new FileReader();
                readerVaccination.onload = (e: any) => {
                    this.vaccinationImage = e.target.result; // Assuming you have a variable for the image preview
                };
                readerVaccination.readAsDataURL(file);
                break;

            case 'antiHBS':
                  this.selectedAntiHBSFile = file;
                  const readerAntiHBS = new FileReader();
                  readerAntiHBS.onload = (e: any) => {
                      this.antiHBSImage = e.target.result;
                  };
                  readerAntiHBS.readAsDataURL(file);
                  break;
  
            case 'hepaBVaccine':
                  this.selectedHepaBVaccineFile = file;
                  const readerHepaBVaccine = new FileReader();
                  readerHepaBVaccine.onload = (e: any) => {
                      this.hepaBVaccineImage = e.target.result;
                  };
                  readerHepaBVaccine.readAsDataURL(file);
                  break;
  
            case 'fluVaccine':
                  this.selectedFluVaccineFile = file;
                  const readerFluVaccine = new FileReader();
                  readerFluVaccine.onload = (e: any) => {
                      this.fluVaccineImage = e.target.result;
                  };
                  readerFluVaccine.readAsDataURL(file);
                  break;
            case 'antiHAV':
                  this.selectedAntiHAVFile = file;
                  const readerAntiHAV = new FileReader();
                  readerAntiHAV.onload = (e: any) => {
                      this.antiHAVImage = e.target.result;
                  };
                  readerAntiHAV.readAsDataURL(file);
                  break;
            case 'fecalysis':
                  this.selectedFecalysisFile = file;
                  const readerFecalysis = new FileReader();
                  readerFecalysis.onload = (e: any) => {
                      this.fecalysisImage = e.target.result;
                  };
                  readerFecalysis.readAsDataURL(file);
                  break;
              case 'drugTest':
                  this.selectedDrugTestFile = file;
                  const readerDrugTest = new FileReader();
                  readerDrugTest.onload = (e: any) => {
                      this.drugTestImage = e.target.result;
                  };
                  readerDrugTest.readAsDataURL(file);
                  break;
            default:
                console.warn(`Unknown document type: ${documentType}`);
                break;
        }
    }
}

getDocumentStatus(requirement: string): string {
    switch(requirement) {
        case 'Complete Blood Count':
            return this.bloodCountData?.status || 'Need Submission';
        case 'Urinalysis':
            return this.urinalysisData?.status || 'Need Submission';
        case 'Chest X-ray':
            return this.xrayData?.status || 'Need Submission';
        case 'COVID-19 Vaccination Card':
            return this.vaccinationData?.status || 'Need Submission';
        case 'Anti HBS (For students with previous Hepa B vaccine)':
            return this.antiHBSData?.status || 'Need Submission';
        case 'Hepatitis B Vaccine':
            return this.hepaBVaccineData?.status || 'Need Submission';
        case 'Flu Vaccine Card':
            return this.fluVaccineData?.status || 'Need Submission';
        case 'Anti HAV(Hepa A)':
            return this.antiHAVData?.status || 'Need Submission';
        case 'Fecalysis':
            return this.fecalysisData?.status || 'Need Submission';
        case 'Drug Test for RLE requirements':
            return this.drugTestData?.status || 'Need Submission';
        default:
            return 'Need Submission';
    }
}

saveProfile(formData: any) {
  if (!this.userId) {
    console.error('No user ID found');
    return;
  }

  // Reset error flags
  this.departmentError = false;
  this.yearLevelError = false;
  this.contactNumberError = false;

  // Validate required fields
  if (!formData.department) {
    this.departmentError = true;
    this.showErrorModal = true;
    this.errorMessage = 'Please select a department';
    return;
  }
  if (!formData.year_level && formData.year_level !== '0') {
    this.yearLevelError = true;
    this.showErrorModal = true;
    this.errorMessage = 'Please select a year level';
    return;
  }

  // Validate phone number format
  if (formData.contact_number && !formData.contact_number.match(/^09\d{9}$/)) {
    this.contactNumberError = true;
    this.showErrorModal = true;
    this.errorMessage = 'Please enter a valid phone number (e.g., 09511186442)';
    return;
  }

  const updateData = new FormData();
  updateData.append('user_id', this.userId);
  updateData.append('department', formData.department);
  updateData.append('program', formData.program || '');
  updateData.append('year_level', formData.year_level.toString());
  updateData.append('contact_number', formData.contact_number || '');

  // Add the profile image if one was selected
  if (this.selectedProfileImage) {
    updateData.append('profile_image', this.selectedProfileImage);
  }

  this.apiService.updateUserProfile(updateData).subscribe({
    next: (response: any) => {
      if (response && response.status === 'success') {
        // Update local profile data
        this.profileData = {
          ...this.profileData,
          ...response.data
        };
        this.showSuccessModal = true;
        this.successMessage = 'Profile updated successfully';
        this.closeModal();
        // Reset selected image
        this.selectedProfileImage = null;
        // Reload profile data
        this.loadUserProfile();
      } else {
        console.error('Update failed:', response);
        this.showErrorModal = true;
        this.errorMessage = response?.message || 'Failed to update profile';
      }
    },
    error: (error) => {
      console.error('Error updating profile:', error);
      this.showErrorModal = true;
      this.errorMessage = 'Failed to update profile. Please try again.';
    }
  });
}


  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  isExpanded(section: string): boolean {
    return this.expandedSections[section] || false;
  }

  openModal() {
    this.showModal = true;
    this.showErrors = false;
    this.nameError = false;
    this.departmentError = false;
    this.yearLevelError = false;
    this.idNumberError = false;
    this.tempProfileImage = null;
  }
  closeModal() {
    this.showModal = false;
    this.showErrors = false;
    this.tempProfileImage = null;
    this.selectedProfileImage = null;
  }

  isProfileComplete(): boolean {
    return !!(
      this.profileData.name && 
      this.profileData.name.trim() !== '' &&
      this.profileData.department && 
      this.profileData.yearLevel && 
      this.profileData.idNumber && 
      this.profileData.idNumber.trim() !== ''
    );
  }

  showProfileIncompleteModal() {
    // You can create a method to show a modal or alert
    alert('Please complete all profile information: Name, Department, Year Level, and ID Number');
  }

  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (e.g., limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should not exceed 5MB');
        return;
      }

      // Store the file for later upload
      this.selectedProfileImage = file;

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempProfileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openBloodCountModal(event: Event) {
    event.stopPropagation();
    this.showBloodCountModal = true;
  }

  closeBloodCountModal() {
    this.showBloodCountModal = false;
    this.selectedBloodCountFile = null; // Reset selected file when closing modal
  }

  openImagePreview(image: string) {
    if (image) {
      this.previewImage = image;
      this.showImagePreview = true;
    }
  }

  closeImagePreview() {
    this.showImagePreview = false;
    this.previewImage = null;
  }

  deleteBloodCountImage(): void {
    this.bloodCountImage = 'assets/placeholder.png';
  }


  openUrinalysisModal(event: Event) {
    event.stopPropagation();
    this.showUrinalysisModal = true;
  }

  closeUrinalysisModal() {
    this.showUrinalysisModal = false;
  }

  onIdNumberInput(event: any) {
    const input = event.target.value;
    if (!/^\d*$/.test(input)) {
      this.idNumberError = true;
      this.idNumberErrorMessage = 'ID number must contain only numbers';
    } else if (input.length > 10) {
      this.idNumberError = true;
      this.idNumberErrorMessage = 'ID number cannot exceed 10 digits';
    } else {
      this.idNumberError = false;
      this.idNumberErrorMessage = '';
    }
  }
  openVaccinationModal(event: Event) {
    event.stopPropagation();
    this.showVaccinationModal = true;
  }

  closeVaccinationModal() {
    this.showVaccinationModal = false;
  }

  deleteImage(type: string): void {
    switch(type) {
      case 'bloodCount':
        this.bloodCountImage = null;
        break;
      case 'urinalysis':
        this.urinalysisImage = null;
        break;
      case 'vaccination':
        this.vaccinationImage = null;
        break;
      case 'xray':
        this.xrayImage = null;
        break;
    }
  }

  openXrayModal(event: Event) {
    event.stopPropagation();
    this.showXrayModal = true;
  }

  closeXrayModal() {
    this.showXrayModal = false;
  }

  openHepaModal(event: Event): void {
    event.stopPropagation();
    this.showHepaModal = true;
  }

  closeHepaModal(): void {
    this.showHepaModal = false;
  }

  openFecalysisModal(event: Event): void {
    event.stopPropagation();
    this.showFecalysisModal = true;
  }

  closeFecalysisModal(): void {
    this.showFecalysisModal = false;
  }

  getMedicalRequirements(): string[] {
    const baseRequirements = [
      'Complete Blood Count',
      'Urinalysis',
      'Chest X-ray',
      'COVID-19 Vaccination Card'
    ];

    if (this.profileData.department === 'CAHS') {
      const cahsRequirements = [
        ...baseRequirements,
        'Anti HBS (For students with previous Hepa B vaccine)',
        'Hepatitis B Vaccine',
        'Flu Vaccine Card'
      ];

      if (this.profileData.year_level === '1') {
        cahsRequirements.push('Hepatitis screening: HBsAg (Hepatitis B Surface Antigen)');
      }

      if (['2', '3', '4'].includes(this.profileData.year_level)) {
        cahsRequirements.push('Drug Test for RLE requirements');
      }

      return cahsRequirements;
    }

    if (this.profileData.program === 'BSHM') {
      return [...baseRequirements, 'Anti HAV(Hepa A)', 'Fecalysis'];
    }

    return baseRequirements;
  }

  openHbsagModal(event: Event): void {
    event.stopPropagation();
    
    // Check if profile is complete before opening modal
    if (!this.isProfileComplete()) {
      this.showProfileIncompleteModal();
      return;
    }

    this.showHbsagModal = true;
  }

  closeHbsagModal(): void {
    this.showHbsagModal = false;
  }

  openAntiHBSModal(event: Event): void {
    event.stopPropagation();
    this.showAntiHBSModal = true;
  }

  closeAntiHBSModal(): void {
    this.showAntiHBSModal = false;
  }

  openHepaBVaccineModal(event: Event): void {
    event.stopPropagation();
    
    // Check if profile is complete before opening modal
    if (!this.isProfileComplete()) {
      this.showProfileIncompleteModal();
      return;
    }

    this.showHepaBVaccineModal = true;
  }

  closeHepaBVaccineModal(): void {
    this.showHepaBVaccineModal = false;
  }

  openFluVaccineModal(event: Event): void {
    event.stopPropagation();
    
    // Check if profile is complete before opening modal
    if (!this.isProfileComplete()) {
      this.showProfileIncompleteModal();
      return;
    }

    this.showFluVaccineModal = true;
  }

  closeFluVaccineModal(): void {
    this.showFluVaccineModal = false;
  }

  openDrugTestModal(event: Event): void {
    event.stopPropagation();
    this.showDrugTestModal = true;
  }

  closeDrugTestModal(): void {
    this.showDrugTestModal = false;
  }

  openDocumentModal(title: string, data: any, callback: (data: any, image: string) => void): void {
    this.showModal = true;
    if (callback) {
      callback(data, '');
    }
  }

  // Method to open Anti HAV modal
  openAntiHAVModal(event: Event): void {
    event.stopPropagation();
    this.showAntiHAVModal = true;
  }

  // Method to close Anti HAV modal
  closeAntiHAVModal(): void {
    this.showAntiHAVModal = false;
  }

  // Add this method to handle image loading errors
  handleImageError() {
    this.profileData.profileImage = 'assets/default-avatar.svg';
  }

  // Add this method to get the image URL
  getProfileImageUrl(): string {
    if (this.profileData?.profile_image_path) {
      return this.apiService.getFullImageUrl(this.profileData.profile_image_path);
    }
    return 'assets/default-avatar.svg';
  }

  startClock() {
    this.dateTimer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  // Add method to get available programs based on selected department
  getAvailablePrograms(): string[] {
    return this.departmentPrograms[this.profileData.department] || [];
  }

  // Add method to handle department change
  onDepartmentChange() {
    // Reset program when department changes
    this.profileData.program = '';
  }

  // Update the hasUploadedDocument method to handle all document types
  hasUploadedDocument(documentType: string): boolean {
    switch(documentType) {
      case 'Complete Blood Count':
        return !!this.bloodCountData?.file_path;
      case 'Urinalysis':
        return !!this.urinalysisData?.file_path;
      case 'Chest X-ray':
        return !!this.xrayData?.file_path;
      case 'COVID-19 Vaccination Card':
        return !!this.vaccinationData?.document_path;
      case 'Anti HBS (For students with previous Hepa B vaccine)':
        return !!this.antiHBSData?.file_path;
      case 'Hepatitis B Vaccine':
        return !!this.hepaBVaccineData?.file_path;
      case 'Flu Vaccine Card':
        return !!this.fluVaccineData?.file_path;
      case 'Anti HAV(Hepa A)':
        return !!this.antiHAVData?.file_path;
      case 'Fecalysis':
        return !!this.fecalysisData?.file_path;
      case 'Drug Test for RLE requirements':
        return !!this.drugTestData?.file_path;
      default:
        return false;
    }
  }

  // Update the openUploadModal method to handle all document types
  openUploadModal(documentType: string) {
    switch(documentType) {
      case 'Complete Blood Count':
        this.openBloodCountModal(new Event('click'));
        break;
      case 'Urinalysis':
        this.openUrinalysisModal(new Event('click'));
        break;
      case 'Chest X-ray':
        this.openXrayModal(new Event('click'));
        break;
      case 'COVID-19 Vaccination Card':
        this.openVaccinationModal(new Event('click'));
        break;
      case 'Anti HBS (For students with previous Hepa B vaccine)':
        this.openAntiHBSModal(new Event('click'));
        break;
      case 'Hepatitis B Vaccine':
        this.openHepaBVaccineModal(new Event('click'));
        break;
      case 'Flu Vaccine Card':
        this.openFluVaccineModal(new Event('click'));
        break;
      case 'Anti HAV(Hepa A)':
        this.openAntiHAVModal(new Event('click'));
        break;
      case 'Fecalysis':
        this.openFecalysisModal(new Event('click'));
        break;
      case 'Drug Test for RLE requirements':
        this.openDrugTestModal(new Event('click'));
        break;
      default:
        console.log(`Upload modal for ${documentType} not implemented`);
    }
  }

  // Update the previewDocument method to handle all document types
  previewDocument(documentType: string) {
    let documentImage = null;
    switch(documentType) {
      case 'Complete Blood Count':
        documentImage = this.bloodCountImage;
        break;
      case 'Urinalysis':
        documentImage = this.urinalysisImage;
        break;
      case 'Chest X-ray':
        documentImage = this.xrayImage;
        break;
      case 'COVID-19 Vaccination Card':
        documentImage = this.vaccinationImage;
        break;
      case 'Anti HBS (For students with previous Hepa B vaccine)':
        documentImage = this.antiHBSImage;
        break;
      case 'Hepatitis B Vaccine':
        documentImage = this.hepaBVaccineImage;
        break;
      case 'Flu Vaccine Card':
        documentImage = this.fluVaccineImage;
        break;
      case 'Anti HAV(Hepa A)':
        documentImage = this.antiHAVImage;
        break;
      case 'Fecalysis':
        documentImage = this.fecalysisImage;
        break;
      case 'Drug Test for RLE requirements':
        documentImage = this.drugTestImage;
        break;
      default:
        console.log(`Preview for ${documentType} not implemented`);
        return;
    }

    if (documentImage) {
      this.openImagePreview(documentImage);
    } else {
      console.warn('No image available for preview');
    }
  }
}
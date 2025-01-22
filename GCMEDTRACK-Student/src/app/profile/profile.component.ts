import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

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
    'CHTM-Hospitality': ['BSHM'],
    'CHTM-Tourism': ['BSTM']
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
          // Process each document
          response.data.forEach((doc: any) => {
            switch (doc.document_type) {
              case 'Complete Blood Count':
                this.bloodCountData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status,
                  file_path: doc.file_path
                };
                this.bloodCountImage = this.apiService.getFullImageUrl(doc.file_path);
                break;
              case 'Urinalysis':
                this.urinalysisData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status,
                  file_path: doc.file_path
                };
                this.urinalysisImage = this.apiService.getFullImageUrl(doc.file_path);
                break;
              case 'Chest X-ray':
                this.xrayData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status,
                  file_path: doc.file_path
                };
                this.xrayImage = this.apiService.getFullImageUrl(doc.file_path);
                break;
              case 'antiHBS':
                this.antiHBSData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status || 'Submitted',
                  file_path: doc.file_path
                };
                this.antiHBSImage = doc.file_path ? this.apiService.getFullImageUrl(doc.file_path) : null;
                break;
              case 'hepaBVaccine':
                this.hepaBVaccineData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status,
                  file_path: doc.file_path
                };
                this.hepaBVaccineImage = this.apiService.getFullImageUrl(doc.file_path);
                break;
              case 'fluVaccine':
                this.fluVaccineData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status,
                  file_path: doc.file_path
                };
                this.fluVaccineImage = this.apiService.getFullImageUrl(doc.file_path);
                break;
              case 'antiHAV':
                this.antiHAVData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status || 'Submitted',
                  file_path: doc.file_path
                };
                this.antiHAVImage = doc.file_path ? this.apiService.getFullImageUrl(doc.file_path) : null;
                break;
              case 'fecalysis':
                this.fecalysisData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status,
                  file_path: doc.file_path
                };
                this.fecalysisImage = this.apiService.getFullImageUrl(doc.file_path);
                break;
              case 'drugTest':
                this.drugTestData = {
                  date: doc.date,
                  location: doc.location,
                  status: doc.status, 
                  file_path: doc.file_path
                };
                this.drugTestImage = this.apiService.getFullImageUrl(doc.file_path);
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

  loadVaccinationData() {
    if (!this.userId) {
        console.error('User ID is not available.');
        return;
    }

    this.apiService.getVaccinationRecord(Number(this.userId)).subscribe({
        next: (response: { status: string; data?: any }) => {
            if (response.status === 'success' && response.data) {
                this.vaccinationData = response.data[0]; 
                this.vaccinationImage = this.vaccinationData.document_path;
            } else {
                // console.error('No vaccination data found:', response);
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
    formDataObj.append('firstDoseType', formData.firstDoseType);
    formDataObj.append('firstDoseDate', formData.firstDoseDate);
    formDataObj.append('secondDoseType', formData.secondDoseType);
    formDataObj.append('secondDoseDate', formData.secondDoseDate);
    formDataObj.append('boosterType', formData.boosterType);
    formDataObj.append('boosterDate', formData.boosterDate);

    // Check if a file is selected
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

saveDocument(formData: any, documentType: string, selectedFile: File | null): void {
    if (!this.userId) return;

    if (!selectedFile) {
        console.error('No file selected');
        alert('Please select a document to upload');
        return;
    }

    const documentFormData = new FormData();
    documentFormData.append('user_id', this.userId);
    documentFormData.append('document_type', documentType);
    documentFormData.append('date', formData.date);
    documentFormData.append('location', formData.location);
    documentFormData.append('document', selectedFile);

    this.apiService.uploadMedicalDocument(documentFormData).subscribe({
        next: (response) => {
            if (response.status === 'success') {
                console.log(`${documentType} saved successfully:`, response);
                this.loadMedicalDocuments(); // Reload documents to get updated status
                alert(`${documentType} document uploaded successfully`);
            } else {
                console.error(`Failed to save ${documentType}:`, response.message);
                alert('Failed to upload document: ' + response.message);
            }
        },
        error: (error) => {
            console.error(`Error saving ${documentType}:`, error);
            alert('Error uploading document. Please try again.');
        }
    });
}

saveBloodCount(formData: any): void {
  this.saveDocument(formData, 'bloodCount', this.selectedBloodCountFile);
}

saveUrinalysis(formData: any): void {
  this.saveDocument(formData, 'urinalysis', this.selectedUrinalysisFile);
}

saveXray(formData: any): void {
  this.saveDocument(formData, 'chestXray', this.selectedChestXrayFile);
}

saveAntiHBS(formData: any): void {
  this.saveDocument(formData, 'antiHBS', this.selectedAntiHBSFile);
  if (this.selectedAntiHBSFile) {
    this.antiHBSData.status = 'Submitted';
  }
}

saveHepaBVaccine(formData: any): void {
  this.saveDocument(formData, 'hepaBVaccine', this.selectedHepaBVaccineFile);
}

saveFluVaccine(formData: any): void {
  this.saveDocument(formData, 'fluVaccine', this.selectedFluVaccineFile);
}

saveAntiHAV(formData: any): void {
  this.saveDocument(formData, 'antiHAV', this.selectedAntiHAVFile);
  if (this.selectedAntiHAVFile) {
    this.antiHAVData.status = 'Submitted';
  }
}

// Save Fecalysis document
saveFecalysis(formData: any): void {
  this.saveDocument(formData, 'fecalysis', this.selectedFecalysisFile);
}

saveDrugTest(formData: any): void {
  this.saveDocument(formData, 'drugTest', this.selectedDrugTestFile);
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
      case 'Drug Test':
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
      alert('Please select a department');
      return;
    }
    if (!formData.year_level && formData.year_level !== '0') {
      this.yearLevelError = true;
      alert('Please select a year level');
      return;
    }

    // Validate phone number format
    if (formData.contact_number && !formData.contact_number.match(/^09\d{9}$/)) {
      this.contactNumberError = true;
      alert('Please enter a valid phone number (e.g., 09511186442)');
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
          alert('Profile updated successfully');
          this.closeModal();
          // Reset selected image
          this.selectedProfileImage = null;
          // Reload profile data
          this.loadUserProfile();
        } else {
          console.error('Update failed:', response);
          alert(response?.message || 'Failed to update profile');
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
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
      // Add cases for other document types
      default:
        console.log(`Upload modal for ${documentType} not implemented`);
    }
  }

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
      // Add cases for other document types
      default:
        console.log(`Preview for ${documentType} not implemented`);
        return;
    }

    if (documentImage) {
      this.openImagePreview(documentImage);
    }
  }

  hasUploadedDocument(documentType: string): boolean {
    switch(documentType) {
      case 'Complete Blood Count':
        return !!this.bloodCountData?.file_path;
      case 'Urinalysis':
        return !!this.urinalysisData?.file_path;
      case 'Chest X-ray':
        return !!this.xrayData?.file_path;
      // Add cases for other document types
      default:
        return false;
    }
  }
}
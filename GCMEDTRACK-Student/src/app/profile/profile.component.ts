import { Component, OnInit } from '@angular/core';
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
export class ProfileComponent implements OnInit {

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
    name: '',
    department: '',
    yearLevel: '',
    idNumber: '',
    profileImage: 'assets/default-avatar.svg'
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

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('Initial userId:', this.userId);
    
    if (!this.userId) {
      console.error('No user ID found');
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadProfileData();
    this.loadVaccinationData();
  }

  loadProfileData() {
    if (!this.userId) return;

    // Fetch user profile
    this.apiService.getUserProfile(this.userId).subscribe({
      next: (response: any) => {
        if (response && response.status === 'success') {
          // Set profile data
          this.profileData = {
            ...response.data,
            profileImage: response.data.profile_image_path ? 
              this.apiService.getFullImageUrl(response.data.profile_image_path) :
              'assets/default-avatar.svg'
          };
          
          // After loading profile, fetch medical documents
          this.loadMedicalDocuments();
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  loadMedicalDocuments(): void {
    if (!this.userId) return;

    this.apiService.getMedicalDocuments(this.userId).subscribe({
        next: (response) => {
            if (response.status === 'success' && response.data) {
                response.data.forEach((doc: any) => {
                    // Dynamically assign data based on document type
                    switch (doc.document_type) {
                        case 'bloodCount':
                            this.bloodCountData = {
                                date: doc.date,
                                location: doc.location,
                                status: doc.status,
                                file_path: doc.file_path
                            };
                            this.bloodCountImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                            break;
                        case 'urinalysis':
                            this.urinalysisData = {
                                date: doc.date,
                                location: doc.location,
                                status: doc.status,
                                file_path: doc.file_path
                            };
                            this.urinalysisImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                            break;
                        case 'chestXray':
                            this.xrayData = {
                                date: doc.date,
                                location: doc.location,
                                status: doc.status,
                                file_path: doc.file_path
                            };
                            this.chestXrayImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                            break;
                        case 'antiHBS':
                            this.antiHBSData = {
                                date: doc.date,
                                location: doc.location,
                                status: doc.status,
                                file_path: doc.file_path
                            };
                            this.antiHBSImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                            break;
                        case 'hepaBVaccine':
                            this.hepaBVaccineData = {
                                date: doc.date,
                                location: doc.location,
                                status: doc.status,
                                file_path: doc.file_path
                            };
                            this.hepaBVaccineImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                            break;
                        case 'fluVaccine':
                            this.fluVaccineData = {
                                date: doc.date,
                                location: doc.location,
                                status: doc.status,
                                file_path: doc.file_path
                            };
                            this.fluVaccineImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                            break;
                        case 'antiHAV':
                              this.antiHAVData = {
                                  date: doc.date,
                                  location: doc.location,
                                  status: doc.status,
                                  file_path: doc.file_path
                              };
                              this.antiHAVImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                              break;
                        case 'fecalysis':
                              this.fecalysisData = {
                                  date: doc.date,
                                  location: doc.location,
                                  status: doc.status,
                                  file_path: doc.file_path
                              };
                              this.fecalysisImage = `${this.apiService.baseUrl}/${doc.file_path}`;
                              break;
                          case 'drugTest':
                              this.drugTestData = {
                                  date: doc.date,
                                  location: doc.location,
                                  status: doc.status, 
                                  file_path: doc.file_path
                              };
                              this.drugTestImage = `${this.apiService.baseUrl}/${doc.file_path}`;
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
}

saveHepaBVaccine(formData: any): void {
  this.saveDocument(formData, 'hepaBVaccine', this.selectedHepaBVaccineFile);
}

saveFluVaccine(formData: any): void {
  this.saveDocument(formData, 'fluVaccine', this.selectedFluVaccineFile);
}

saveAntiHAV(formData: any): void {
  this.saveDocument(formData, 'antiHAV', this.selectedAntiHAVFile);
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
      case 'Anti HBS':
          return this.antiHBSData?.status || 'Need Submission';
      case 'Hepatitis B Vaccine':
          return this.hepaBVaccineData?.status || 'Need Submission';
      case 'Flu Vaccine Card':
          return this.fluVaccineData?.status || 'Need Submission';
      case 'Anti HAV':
          return this.antiHAVData?.status || 'Need Submission';
      case 'Fecalysis':
          return this.fecalysisData?.status || 'Need Submission';
      case 'Drug Test':
          return this.drugTestData?.status || 'Need Submission';
      default:
          return 'Need Submission';
  }
}

  saveProfile(formValue: any) {
    this.showErrors = true;
    
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('No user ID available');
      alert('Error: User ID not found. Please try logging in again.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Current userId:', userId); // Debug log
    
    // Create FormData object
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('name', formValue.name);
    formData.append('department', formValue.department);
    formData.append('year_level', formValue.yearLevel);
    formData.append('id_number', formValue.idNumber);

    // Debug log
    for (const pair of formData.entries()) {
      console.log('FormData:', pair[0], pair[1]);
    }

    if (this.tempProfileImage) {
      fetch(this.tempProfileImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
          formData.append('profile_image', file);
          this.sendUpdateRequest(formData);
        });
    } else {
      this.sendUpdateRequest(formData);
    }
  }

  private sendUpdateRequest(formData: FormData) {
    this.apiService.updateUserProfile(formData).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.profileData = {
            ...this.profileData,
            name: formData.get('name'),
            department: formData.get('department'),
            yearLevel: formData.get('year_level'),
            idNumber: formData.get('id_number'),
            profileImage: response.data?.profile_image_path ? 
              this.apiService.getFullImageUrl(response.data.profile_image_path) :
              'assets/default-avatar.svg'
          };
          
          this.closeModal();
          alert('Profile updated successfully');
        } else {
          alert('Failed to update profile: ' + response.message);
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

  onProfileImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
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

      // Add HBsAg screening only for first year CAHS students
      if (this.profileData.yearLevel === '1') {
        cahsRequirements.push('Hepatitis screening: HBsAg (Hepatitis B Surface Antigen)');
      }

      // Add Drug Test for RLE requirements only for 2nd, 3rd, and 4th year CAHS students
      if (['2', '3', '4'].includes(this.profileData.yearLevel)) {
        cahsRequirements.push('Drug Test for RLE requirements');
      }

      return cahsRequirements;
    }

    if (this.profileData.department === 'CHTM-Hospitality') {
      return [...baseRequirements, 'Anti HAV(Hepa A)', 'Fecalysis'];
    }

    return baseRequirements;
  }

  getYearSuffix(year: string): string {
    if (!year) return '';
    
    switch(year) {
      case '1': return 'st';
      case '2': return 'nd';
      case '3': return 'rd';
      case '4': return 'th';
      default: return '';
    }
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
}
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
    profileImage: 'assets/default-avatar.png'
  };
  tempProfileImage: string | null = null;

  showBloodCountModal = false;

  showImagePreview = false;
  previewImage: string | null = null;

  bloodCountData: {
    date?: string;
    location?: string;
  } = {};

  showUrinalysisModal = false;
  urinalysisData: {
    date?: string;
    location?: string;
  } = {};

  idNumberError: boolean = false;
  idNumberErrorMessage: string = '';

  showVaccinationModal = false;
  vaccinationData: {
    firstDoseType?: string;
    firstDoseDate?: string;
    secondDoseType?: string;
    secondDoseDate?: string;
    boosterType?: string;
    boosterDate?: string;
  } = {};

  showXrayModal = false;
  xrayData: {
    date?: string;
    location?: string;
  } = {};

  showHepaModal = false;
  hepaData: {
    date?: string;
    location?: string;
  } = {};

  showFecalysisModal = false;
  fecalysisData: {
    date?: string;
    location?: string;
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

  antiHBSData: {
    date?: string;
    location?: string;
  } = {};

  hepaBVaccineData: {
    date?: string;
    location?: string;
  } = {};

  fluVaccineCardData: any = {
    date: null,
    location: null
  };
  fluVaccineCardImage: string | null = null;

  fluVaccineData: {
    date?: string;
    location?: string;
  } = {};

  drugTestData: {
    date?: string;
    location?: string;
  } = {};

  hbsagImage: string | null = null;
  hbsagData: {
    date?: string;
    location?: string;
  } = {};
  showHbsagModal = false;

  nameError: boolean = false;
  departmentError: boolean = false;
  yearLevelError: boolean = false;

  // New properties for Anti HAV
  showAntiHAVModal = false;
  antiHAVData: {
    date?: string;
    location?: string;
  } = {};
  antiHAVImage: string | null = null;
  

  userId: string | null = null;

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
  }

  loadProfileData() {
    if (!this.userId) return;

    this.apiService.getUserProfile(this.userId).subscribe({
      next: (response: any) => {
        console.log('Profile data response:', response);
        if (response.status === 'success') {
          this.profileData = response.data;
        } else {
          console.error('Failed to load profile:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  isExpanded(section: string): boolean {
    return this.expandedSections[section] || false;
  }

  onImageUpload(event: any, type: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        switch(type) {
          case 'bloodCount':
            this.bloodCountImage = e.target.result;
            break;
          case 'urinalysis':
            this.urinalysisImage = e.target.result;
            break;
          case 'vaccination':
            this.vaccinationImage = e.target.result;
            break;
          case 'xray':
            this.xrayImage = e.target.result;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
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
            profileImage: response.data?.profile_image_path || this.profileData.profileImage
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
  }

  saveBloodCount(formData: any) {
    this.bloodCountData = {
      date: formData.date,
      location: formData.location
    };
    this.closeBloodCountModal();
  }

  onBloodCountImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bloodCountImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bloodCountImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openUrinalysisModal(event: Event) {
    event.stopPropagation();
    this.showUrinalysisModal = true;
  }

  closeUrinalysisModal() {
    this.showUrinalysisModal = false;
  }

  saveUrinalysis(formData: any) {
    this.urinalysisData = {
      date: formData.date,
      location: formData.location
    };
    this.closeUrinalysisModal();
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

  saveVaccination(formData: any) {
    this.vaccinationData = {
      ...formData
    };
    this.closeVaccinationModal();
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

  saveXray(formData: any) {
    this.xrayData = {
      ...formData
    };
    this.closeXrayModal();
  }

  openHepaModal(event: Event): void {
    event.stopPropagation();
    this.showHepaModal = true;
  }

  closeHepaModal(): void {
    this.showHepaModal = false;
  }

  saveHepa(data: any): void {
    this.hepaData = { ...data };
    this.closeHepaModal();
  }

  openFecalysisModal(event: Event): void {
    event.stopPropagation();
    this.showFecalysisModal = true;
  }

  closeFecalysisModal(): void {
    this.showFecalysisModal = false;
  }

  saveFecalysis(data: any): void {
    this.fecalysisData = { ...data };
    this.closeFecalysisModal();
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

  saveHbsag(data: any): void {
    this.hbsagData = data;
    this.closeHbsagModal();
  }

  openAntiHBSModal(event: Event): void {
    event.stopPropagation();
    this.showAntiHBSModal = true;
  }

  closeAntiHBSModal(): void {
    this.showAntiHBSModal = false;
  }

  saveAntiHBS(data: any): void {
    this.antiHBSData = data;
    this.closeAntiHBSModal();
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

  saveHepaBVaccine(data: any): void {
    this.hepaBVaccineData = data;
    this.closeHepaBVaccineModal();
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

  saveFluVaccine(data: any): void {
    this.fluVaccineData = data;
    this.closeFluVaccineModal();
  }

  openDrugTestModal(event: Event): void {
    event.stopPropagation();
    this.showDrugTestModal = true;
  }

  closeDrugTestModal(): void {
    this.showDrugTestModal = false;
  }

  saveDrugTest(data: any): void {
    this.drugTestData = data;
    this.closeDrugTestModal();
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

  // Method to save Anti HAV data
  saveAntiHAV(data: any): void {
    this.antiHAVData = data;
    this.closeAntiHAVModal();
  }
}
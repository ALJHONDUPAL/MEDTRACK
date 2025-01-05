import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service'; 

interface ClinicStaff {
  staff_id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  address: string;
  contactNumber: string;
  role: string;
  domain_account?: string;
}


@Component({
  selector: 'app-usermanagement',
  standalone: true,
  providers: [ApiService],
  imports: [CommonModule, FormsModule],
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UserManagementComponent implements OnInit {
  clinics: any[] = [];
  filteredClinics: any[] = [];
  showModal = false;
  showEditModal = false;
  searchText = '';
  editingIndex: number = -1;

  newClinic = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    contactNumber: '',
    role: 'staff'
  };

  editingClinic: any = { ...this.newClinic };

  constructor(private apiService: ApiService) { } // Changed to lowercase apiService

  ngOnInit() {
    this.loadClinics();
  }

  loadClinics() {
    this.apiService.getAllClinics().subscribe({
      next: (response: { status: string; data: any[]; message: any; }) => {
        if (response.status === 'success' && response.data) {
          this.clinics = response.data;
          this.filteredClinics = [...this.clinics];
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Error loading clinics:', error);
        alert('Failed to load clinic staff. Please try again later.');
      }
    });
  }

  onSearch(event: any) {
    const searchText = event.target.value.toLowerCase();
    this.filteredClinics = this.clinics.filter(clinic => 
      clinic.firstName.toLowerCase().includes(searchText) ||
      clinic.lastName.toLowerCase().includes(searchText) ||
      clinic.email.toLowerCase().includes(searchText)
    );
  }

  openModal() {
    this.showModal = true;
    this.newClinic = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      address: '',
      contactNumber: '',
      role: 'staff'
    };
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.validateForm()) {
      // Create domain_account from email
      const domain_account = this.newClinic.email.split('@')[0];
      
      const clinicData = {
        firstName: this.newClinic.firstName.trim(),
        lastName: this.newClinic.lastName.trim(),
        email: this.newClinic.email.trim(),
        password: this.newClinic.password,
        address: this.newClinic.address.trim(),
        contactNumber: this.newClinic.contactNumber.trim(),
        role: this.newClinic.role,
        domain_account: domain_account
      };
  
      this.apiService.addClinic(clinicData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Clinic staff added successfully!');
            this.loadClinics();
            this.closeModal();
          } else {
            alert(response.message || 'Failed to add clinic staff');
          }
        },
        error: (error) => {
          alert(error.message || 'Failed to add clinic staff');
        }
      });
    }
  }
  
  private validateForm(): boolean {
    if (!this.newClinic.firstName?.trim()) {
      alert('First name is required');
      return false;
    }
    if (!this.newClinic.lastName?.trim()) {
      alert('Last name is required');
      return false;
    }
    if (!this.newClinic.email?.trim()) {
      alert('Email is required');
      return false;
    }
    if (!this.isValidEmail(this.newClinic.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!this.newClinic.password?.trim()) {
      alert('Password is required');
      return false;
    }
    return true;
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  editClinic(index: number) {
    this.editingIndex = index;
    this.editingClinic = { ...this.filteredClinics[index] };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  onEditSubmit() {
    this.apiService.updateClinic(this.editingClinic.staff_id, this.editingClinic).subscribe({ // Changed from clinicUserService to apiService
      next: (response: any) => {
        this.loadClinics();
        this.closeEditModal();
      },
      error: (error: any) => {
        console.error('Error updating clinic:', error);
      }
    });
  }

  deleteClinic(index: number) {
    if (confirm('Are you sure you want to delete this clinic?')) {
      const staffId = this.filteredClinics[index].staff_id;
      this.apiService.deleteClinic(staffId).subscribe({ // Changed from clinicUserService to apiService
        next: (response: any) => {
          this.loadClinics();
        },
        error: (error: any) => {
          console.error('Error deleting clinic:', error);
        }
      });
    }
  }

  highlightText(text: string): string {
    if (!this.searchText) return text;
    const regex = new RegExp(this.searchText, 'gi');
    return text.replace(regex, match => `<mark>${match}</mark>`);
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicAuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Update the interface to be more flexible
interface LoginResponse {
  status: string | {
    remarks: string;
    message: string;
  };
  message?: string;
  payload?: {
    token: string;
    staff: {
      staff_id: number;
      first_name: string;
      last_name: string;
      role: string;
      domain_account: string;
    };
  };
}

@Component({
  selector: 'app-clinic-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class ClinicLoginComponent {
  domain_account: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: ClinicAuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.domain_account || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    // Extract username from email if full email is provided
    const domain_account = this.domain_account.includes('@') 
      ? this.domain_account.split('@')[0] 
      : this.domain_account;
  
    this.authService.login(domain_account, this.password).subscribe({
      next: (response) => {
        console.log('Full login response:', response);
        
        // Check login success
        const isSuccess = 
          (typeof response.status === 'object' && response.status.remarks === 'success') ||
          (typeof response.status === 'string' && response.status === 'success');
        
        if (isSuccess && response.payload) {
          localStorage.setItem('clinicAuthToken', response.payload.token);
          localStorage.setItem('staff', JSON.stringify(response.payload.staff));
          this.router.navigate(['/dashboard']);
        } else {
          // Fallback to different ways of getting error message
          this.errorMessage = 
            (typeof response.status === 'object' ? response.status.message : '') ||
            response.message ||
            'Login failed';
          console.warn('Login failed:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Detailed login error:', error);
        this.errorMessage = error.message || 'Invalid credentials';
        this.isLoading = false;
      }
    });
  }
}
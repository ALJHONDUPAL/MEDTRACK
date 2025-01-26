import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  showRegister = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  registrationData = {
    first_name: '',
    last_name: '',
    middle_name: '',
    id_number: '',
    domain_account: '',
    password: ''
  };
  isSuccess: boolean = false;
  successMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private authStateService: AuthStateService
  ) {}

  onSubmit() {
    if (this.isLoginMode) {
      if (!this.registrationData.domain_account || !this.registrationData.password) {
        this.errorMessage = 'Please enter both email and password';
        return;
      }

      this.authService.login(this.registrationData.domain_account, this.registrationData.password).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (response.status?.remarks === 'success' || response.status === 'success') {
            if (response.payload?.token || response.token) {
              this.isSuccess = true;
              this.successMessage = 'Login successful! Redirecting...';
              this.errorMessage = '';
              setTimeout(() => {
                this.authStateService.resetLoginMessage();
                this.router.navigate(['/home']);
              }, 1500);
            } else {
              this.isSuccess = false;
              this.errorMessage = 'Login successful but no token received';
            }
          } else {
            this.isSuccess = false;
            this.errorMessage = response.message || 'Invalid email or password';
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isSuccess = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your email and password.';
        }
      });
    } else {
      // Registration validation
      if (!this.registrationData.first_name || !this.registrationData.last_name || 
          !this.registrationData.id_number || !this.registrationData.domain_account || 
          !this.registrationData.password) {
        this.errorMessage = 'Please fill in all required fields';
        return;
      }

      if (!this.isValidEmail(this.registrationData.domain_account)) {
        this.errorMessage = 'Please enter a valid Gordon College email';
        return;
      }

      this.authService.register(this.registrationData).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          if (response.status === 'success' || response.status?.remarks === 'success') {
            this.isSuccess = true;
            this.errorMessage = '';
            this.successMessage = 'Registration successful! Redirecting to login...';
            setTimeout(() => {
              this.isLoginMode = true;
              const savedEmail = this.registrationData.domain_account;
              const savedPassword = this.registrationData.password;
              this.resetForm();
              this.registrationData.domain_account = savedEmail;
              this.registrationData.password = savedPassword;
              this.isSuccess = false;
            }, 2000);
          } else {
            this.isSuccess = false;
            this.errorMessage = response.message || 'Registration failed';
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isSuccess = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  private isValidEmail(email: string): boolean {
    return email.endsWith('@gordoncollege.edu.ph') && /^\d{9}@gordoncollege\.edu\.ph$/.test(email);
  }

  toggleMode(event: Event) {
    event.preventDefault(); 
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.resetForm();
  }

  resetForm() {
    this.registrationData = {
      first_name: '',
      last_name: '',
      middle_name: '',
      id_number: '',
      domain_account: '',
      password: ''
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

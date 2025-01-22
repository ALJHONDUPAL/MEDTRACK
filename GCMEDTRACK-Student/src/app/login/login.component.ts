import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isLoginMode) {
      if (!this.registrationData.domain_account || !this.registrationData.password) {
        alert('Please fill in all required fields');
        return;
      }

      this.authService.login(this.registrationData.domain_account, this.registrationData.password).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (response.status?.remarks === 'success' || response.status === 'success') {
            if (response.payload?.token || response.token) {
              this.router.navigate(['/home']);
            } else {
              alert('Login successful but no token received');
            }
          } else {
            alert(response.message || 'Login failed');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          alert(errorMessage);
        }
      });
    } else {
      // Registration validation
      if (!this.registrationData.first_name || !this.registrationData.last_name || 
          !this.registrationData.id_number || !this.registrationData.domain_account || 
          !this.registrationData.password) {
        alert('Please fill in all required fields');
        return;
      }

      if (!this.isValidEmail(this.registrationData.domain_account)) {
        alert('Please enter a valid Gordon College email');
        return;
      }

      this.authService.register(this.registrationData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Registration successful! Please login.');
            this.isLoginMode = true;
            const savedEmail = this.registrationData.domain_account;
            const savedPassword = this.registrationData.password;
            this.resetForm();
            this.registrationData.domain_account = savedEmail;
            this.registrationData.password = savedPassword;
          } else {
            alert(response.message || 'Registration failed');
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          const errorMessage = error.error?.message || 'Registration failed. Please try again.';
          alert(errorMessage);
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

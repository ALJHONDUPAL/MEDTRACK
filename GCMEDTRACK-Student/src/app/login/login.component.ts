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
  domain_account: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.domain_account || !this.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.isLoginMode) {
      this.authService.login(this.domain_account, this.password).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (response.status?.remarks === 'success') {
            this.router.navigate(['/home']);
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
      // Registration
      if (!this.isValidEmail(this.domain_account)) {
        alert('Please enter a valid Gordon College email');
        return;
      }

      this.authService.register(this.domain_account, this.password).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Registration successful! Please login.');
            this.isLoginMode = true;
            // Keep the credentials for easier login
            const savedEmail = this.domain_account;
            const savedPassword = this.password;
            this.resetForm();
            this.domain_account = savedEmail;
            this.password = savedPassword;
          } else {
            alert(response.message || 'Registration failed');
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          if (error.status === 201) {
            alert('Registration successful! Please login.');
            this.isLoginMode = true;
            // Keep the credentials for easier login
            const savedEmail = this.domain_account;
            const savedPassword = this.password;
            this.resetForm();
            this.domain_account = savedEmail;
            this.password = savedPassword;
          } else {
            const errorMessage = error.error?.message || 'Registration failed. Please try again.';
            alert(errorMessage);
          }
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
    this.domain_account = '';
    this.password = '';

  }
  // logout() {
  //   this.authService.userLogout();
  //   this.router.navigate(['/login']);
  // }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

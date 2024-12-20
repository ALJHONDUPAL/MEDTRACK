import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  showRegister = false;
  domain_account: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isLoginMode) {
      console.log('Attempting login with:', { domain_account: this.domain_account });
      
      this.authService.login(this.domain_account, this.password).subscribe({
        next: (response) => {
          console.log('Login response received:', response);
          
          if (response.status?.remarks === 'success' || response.status === 'success') {
            console.log('Login successful, navigating to home');
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message || 'Login failed';
            console.error('Login failed:', this.errorMessage);
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred during login';
          console.error('Login error:', error);
        }
      });
    } else {
      // Registration logic
      const newUser = {
        domain_account: this.domain_account,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname
      };

      this.authService.register(newUser).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoginMode = true;
          this.resetForm();
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      });
    }
  }

  toggleMode(event: Event) {
    event.preventDefault(); 
    this.isLoginMode = !this.isLoginMode;
    this.resetForm();
  }

  resetForm() {
    this.domain_account = '';
    this.password = '';
    this.firstname = '';
    this.lastname = '';
  }
  // logout() {
  //   this.authService.userLogout();
  //   this.router.navigate(['/login']);
  // }
}

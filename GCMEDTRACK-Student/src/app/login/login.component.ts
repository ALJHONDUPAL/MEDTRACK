import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, MatInputModule, MatButtonModule,CommonModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  showRegister = false;
  // Bind form fields to database fields
  domain_account: string = ''; // Matches `domain_account` in database
  password: string = '';
  firstname: string = ''; // Required for registration
  lastname: string = ''; // Required for registration

  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    if (this.isLoginMode) {
      // Login logic
      this.authService.login(this.domain_account, this.password).subscribe(
        response => {
          console.log('Login response:', response);
          const token = response.payload?.token;
          if (token) {
            this.authService.saveToken(token); // Save token first
            localStorage.setItem('user_id', response.payload?.id); // Store id
            this.router.navigate(['/home']); // Navigate to user component
          } else {
            console.error('Invalid response payload:', response);
          }
        },
      
        error => {
          console.error('Login error:', error);
        }
      );
    } else {
      // Registration logic
      const newUser = {
        domain_account: this.domain_account,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname
      };

      this.authService.register(newUser).subscribe(
        response => {
          console.log('Registration successful:', response);
          this.isLoginMode = true; // Switch to login mode after successful registration
          this.resetForm();
        },
        error => {
          console.error('Registration error:', error);
        }
      );
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

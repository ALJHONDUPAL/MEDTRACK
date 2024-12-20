import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';

  constructor(private http: HttpClient, private router: Router) { }

  // Register user
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/userRegister`, data) // Correct route
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return of({ success: false, error: error.message || 'Registration failed' });
        })
      );
}

  // Login user
  login(domain_account: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/userLogin`, { domain_account, password })
      .pipe(
        map(response => {
          console.log('Raw login response:', response);
          
          // Check for success in both possible response formats
          if (response.status?.remarks === 'success' && response.payload) {
            // Store token
            this.saveToken(response.payload.token);
            
            // Store user data
            const userId = response.payload.user?.user_id;
            if (userId) {
              localStorage.setItem('user_id', userId.toString());
              console.log('Stored user_id:', userId);
            }
            
            return response;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError(error => {
          console.error('Login error in service:', error);
          return of({ success: false, error: error.message || 'Login failed' });
        })
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUserId();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
}

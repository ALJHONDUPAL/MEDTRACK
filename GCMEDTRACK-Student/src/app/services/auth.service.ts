import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';

interface RegistrationData {
  first_name: string;
  last_name: string;
  middle_name: string;
  id_number: string;
  domain_account: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';

  constructor(private http: HttpClient, private router: Router) { }

  // Register user
  register(data: RegistrationData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/userRegister`, data).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  // Login user
  login(domain_account: string, password: string): Observable<any> {
    const data = {
      domain_account: domain_account,
      password: password
    };

    return this.http.post<any>(`${this.baseUrl}/userLogin`, data).pipe(
      map(response => {
        // Handle both response formats
        if ((response.status?.remarks === 'success' || response.status === 'success') && 
            (response.payload?.token || response.token)) {
          // Store the token, handling both response structures
          const token = response.payload?.token || response.token;
          this.saveToken(token);
          
          // Store user ID if available
          const userId = response.payload?.user?.user_id || response.user?.user_id;
          if (userId) {
            localStorage.setItem('user_id', userId.toString());
          }
        }
        return response;
      }),
      catchError(error => {
        console.error('Login error in service:', error);
        return throwError(() => error);
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

interface StaffUser {
  staff_id: number;
  first_name: string;
  last_name: string;
  role: string;
  domain_account: string;
}

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
@Injectable({
  providedIn: 'root'
})
export class ClinicAuthService {
  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';
  private readonly TOKEN_KEY = 'clinicAuthToken';
  private readonly STAFF_KEY = 'staff';

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  login(domain_account: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/clinicLogin`, { 
      domain_account, 
      password 
    }).pipe(
      catchError(this.handleError)
    );
  }
  getAllClinics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllClinicStaff`)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleSuccessfulLogin(payload: any): void {
    this.saveToken(payload.token);
    this.saveStaffDetails({
      staff_id: payload.staff_id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      role: payload.role,
      domain_account: payload.domain_account
    });
  }

  private saveStaffDetails(staff: Partial<StaffUser>): void {
    localStorage.setItem(this.STAFF_KEY, JSON.stringify(staff));
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): StaffUser | null {
    const user = localStorage.getItem('staff');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Optional: Add token expiration check
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  logout(): void {
    // Optional: Call logout API endpoint
    this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => this.handleLogout()),
      catchError(error => {
        this.handleLogout();
        return throwError(() => error);
      })
    ).subscribe();
  }

  private handleLogout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.STAFF_KEY);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    console.error('Auth Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicAuthService {

  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';

  constructor(private http: HttpClient, private router: Router) { }

  // Login clinic staff
  login(domain_account: string, password: string): Observable<any> {
    const data = {
      domain_account: domain_account,
      password: password
    };

    return this.http.post<any>(`${this.baseUrl}/clinicLogin`, data).pipe(
      map(response => {
        if (response.status?.remarks === 'success' && response.payload) {
          this.saveToken(response.payload.token);
          if (response.payload.staff?.staff_id) {
            localStorage.setItem('staff_id', response.payload.staff.staff_id.toString());
          }
          this.router.navigate(['/home']);
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
    localStorage.setItem('clinicAuthToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('clinicAuthToken');
  }

  getStaffId(): string | null {
    return localStorage.getItem('staff_id');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('clinicAuthToken');
    localStorage.removeItem('staff_id');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('clinicAuthToken');
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';

  constructor(private http: HttpClient) {}

addClinic(clinicData: any): Observable<any> {
  const headers = this.getHeaders(); // Use headers with authorization token
  return this.http.post(`${this.baseUrl}/addClinicStaff`, clinicData, { headers })
    .pipe(
      catchError(this.handleError)
    );
}

  updateClinic(staffId: number, clinicData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateClinicStaff/${staffId}`, clinicData);
  }

  deleteClinic(staffId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteClinicStaff/${staffId}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('clinicAuthToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}
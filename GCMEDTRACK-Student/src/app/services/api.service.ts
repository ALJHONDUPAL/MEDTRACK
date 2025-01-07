import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = 'http://localhost/MEDTRACK/backend_php/api';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserProfile`, {
      params: { user_id: userId }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateUserProfile`, formData).pipe(
      catchError(this.handleError)
    );
  }

  uploadMedicalDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/uploadMedicalDocument`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getMedicalDocuments(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getMedicalDocuments`, {
      params: { user_id: userId }
    }).pipe(
      catchError(this.handleError)
    );
  }

  uploadVaccinationRecord(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/uploadVaccinationRecord`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getVaccinationRecord(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getVaccinationRecords/${userId}`);
}

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Requested resource not found';
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || 'Server error';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

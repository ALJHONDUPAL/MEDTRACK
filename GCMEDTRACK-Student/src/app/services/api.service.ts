import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = 'http://localhost/MEDTRACK/backend_php/api';
  private imgBaseUrl = 'http://localhost/MEDTRACK/backend_php/api/';

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

getTimeSlots(dayOfWeek: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/getTimeSlots/${dayOfWeek}`);
}

getAppointments(userId?: number): Observable<any> {
  let params = {};
  if (userId) {
    params = { user_id: userId.toString() };
  }
  return this.http.get(`${this.baseUrl}/getAppointments`, { params });
}

createAppointment(appointmentData: any): Observable<any> {
  // console.log('Sending appointment data:', appointmentData);
  
  const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    
  const payload = {
    action: 'createAppointment',
    slotId: appointmentData.slotId,
    userId: appointmentData.userId,
    purpose: appointmentData.purpose
  };
  return this.http.post(`${this.baseUrl}/createAppointment`, payload, { headers })
}

getFullImageUrl(profile_image_path: string): string {
  return `${this.imgBaseUrl}${profile_image_path}`;
}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || 'Server error';
    }
    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
}

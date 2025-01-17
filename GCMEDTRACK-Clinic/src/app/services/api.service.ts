import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface TimeSlot {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  date: string;
  studentLimit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';
  private imgBaseUrl = 'http://localhost/MEDTRACK/backend_php/api/';

  constructor(private http: HttpClient) {}
//for get the all images
  getFullImageUrl(profile_image_path: string): string {
    return `${this.imgBaseUrl}${profile_image_path}`;
  }
  //for get the all images
  getMedUrl(file_path: string): string {
    return `${this.imgBaseUrl}${file_path}`;
  }
  //for get the all images
  getVaceUrl(document_path: string): string {
    return `${this.imgBaseUrl}${document_path}`;
  }

  getTimeSlots(dayOfWeek: string): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.baseUrl}/getTimeSlots/${dayOfWeek}`);
  }

  addTimeSlot(timeSlot: TimeSlot): Observable<any> {
    return this.http.post(`${this.baseUrl}/addTimeSlot`, timeSlot);
  }

  updateTimeSlot(id: number, timeSlot: TimeSlot): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateTimeSlot/${id}`, timeSlot);
  }

  deleteTimeSlot(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteTimeSlot/${id}`);
  }


addClinic(clinicData: any): Observable<any> {
  const headers = this.getHeaders(); // Use headers with authorization token
  return this.http.post(`${this.baseUrl}/addClinicStaff`, clinicData, { headers })
    .pipe(
      catchError(this.handleError)
    );
}

getAllClinics(): Observable<any> {
  return this.http.get(`${this.baseUrl}/getAllClinicStaff`).pipe(
    catchError(this.handleError)
  );
}

updateClinic(staffId: number, clinicData: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/updateClinicStaff/${staffId}`, clinicData);
}

deleteClinic(staffId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/deleteClinicStaff/${staffId}`);
}
  getUserProfile(userId: string, string: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserProfile`, {
      params: { user_id: userId }
    }).pipe(
      catchError(this.handleError)
    );
  }


//get the all users profile
  getAllStudentProfiles(department?: string, year?: string): Observable<any> {
    const params = new HttpParams()
      .set('department', department || '')
      .set('year', year || '');
  
    return this.http.get(`${this.baseUrl}/getAllStudentProfiles`, { params }).pipe(
      tap(response => {
        console.log('Response from API: ', response); // Check if `userId` is present
      }),
      catchError(this.handleError)
    );
  }
  
  
  //get the specified student profile 
  getStudentById(studentId: string): Observable<any> {
    const params = new HttpParams().set('user_id', studentId); // Assuming 'userId' is the param expected by your API
    return this.http.get(`${this.baseUrl}/getStudentBasicDetails`, { params }).pipe(
      catchError(this.handleError)
    );
  }


  getClinicAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getClinicAppointments`).pipe(
      map((response: any) => {
        if (response.status === 'success') {
          return {
            status: 'success',
            data: response.data.map((appointment: any) => ({
              id: appointment.appointment_id,
              studentName: `${appointment.name}`,
              studentId: appointment.id_number,
              department: appointment.department,
              date: appointment.date,
              time: `${appointment.start_time} - ${appointment.end_time}`,
              purpose: appointment.purpose,
              yearLevel: `${appointment.year_level} Year`,
              avatar: this.getFullImageUrl(appointment.profile_image_path) || 'assets/default-avatar.png',
              status: appointment.status
            }))
          };
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }
  
  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    const payload = {
      action: 'updateAppointmentStatus',
      appointmentId: appointmentId,
      status: status
    };

    return this.http.post(`${this.baseUrl}/updateAppointmentStatus`, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Update response:', response)),
      catchError(this.handleError)
    );
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
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
    if (!profile_image_path) {
      return 'assets/default-profile.png';
    }
    // Check if the path already contains the full URL
    if (profile_image_path.startsWith('http')) {
      return profile_image_path;
    }
    // Remove any leading slashes to prevent double slashes
    const cleanPath = profile_image_path.replace(/^\/+/, '');
    return `${this.imgBaseUrl}${cleanPath}`;
  }
  //for get the all images
  getMedUrl(file_path: string): string {
    return `${this.imgBaseUrl}${file_path}`;
  }
  //for get the all images
  getVaceUrl(document_path: string): string {
    return `${this.imgBaseUrl}${document_path}`;
  }

  getTimeSlots(dayOfWeek: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getTimeSlots/${dayOfWeek}`).pipe(
      map((response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return {
            status: 'success',
            data: response.data.map((slot: any) => ({
              ...slot,
              currentBookings: slot.current_bookings || 0
            }))
          };
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addTimeSlot(timeSlot: TimeSlot): Observable<any> {
    return this.http.post(`${this.baseUrl}/addTimeSlot`, timeSlot);
  }

  updateTimeSlot(id: number, timeSlot: TimeSlot): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateTimeSlot`, {
        slot_id: id,
        ...timeSlot
    });
  }

  deleteTimeSlot(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteTimeSlot`, { slot_id: id });
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
              yearLevel: `${appointment.year_level}`,
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
  
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteAppointment`, { appointmentId })
      .pipe(
        tap(response => console.log('Delete response:', response)),
        catchError(this.handleError)
      );
  }
  
  getDocumentDistributionByDepartment(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDocumentDistributionByDepartment`).pipe(
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
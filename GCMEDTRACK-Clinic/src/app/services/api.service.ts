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
  getAllStudentProfiles(department?: string, program?: string, year?: string): Observable<any> {
    const params = new HttpParams()
      .set('department', department || '')
      .set('program', program || '')
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
    const params = new HttpParams().set('user_id', studentId);
    return this.http.get(`${this.baseUrl}/getStudentBasicDetails`, { params }).pipe(
      map(response => {
        // Remove any HTML warnings from the response
        if (typeof response === 'string') {
          try {
            const cleanResponse = response.substring(response.indexOf('{'));
            return JSON.parse(cleanResponse);
          } catch (e) {
            console.error('Error parsing response:', e);
            throw e;
          }
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }


  getListStudentProfiles(department?: string, program?: string, year?: string): Observable<any> {
    const params = new HttpParams()
      .set('department', department || '')
      .set('program', program || '')
      .set('year', year || '');
  
    return this.http.get(`${this.baseUrl}/getAllStudentProfiles`, { params }).pipe(
      tap(response => {
        console.log('Response from API: ', response); // Check if `userId` is present
      }),
      catchError(this.handleError)
    );
  }

  getClinicAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getClinicAppointments`).pipe(
      tap(response => console.log('Raw API response:', response)), // Debug log
      map((response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return {
            status: 'success',
            data: response.data.map((appointment: any) => ({
              id: appointment.id,
              studentName: appointment.studentName,
              studentId: appointment.studentId,
              department: appointment.department,
              program: appointment.program,
              date: appointment.date,
              time: appointment.time,
              purpose: appointment.purpose,
              yearLevel: appointment.yearLevel,
              avatar: appointment.avatar,
              status: appointment.status,
              remarks: appointment.remarks
            }))
          };
        }
        return response;
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
  
  updateAppointmentStatus(appointmentId: number, status: string, rejectionReason?: string): Observable<any> {
    const payload = {
      appointmentId: appointmentId,
      status: status,
      rejectionReason: rejectionReason
    };

    console.log('Sending update request with payload:', payload);

    return this.http.post(`${this.baseUrl}/updateAppointmentStatus`, payload).pipe(
      tap(response => console.log('Update response:', response)),
      catchError(error => {
        console.error('Error updating appointment:', error);
        return throwError(() => error);
      })
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

  getAllStudentMedicalReports(): Observable<any> {
    const url = `${this.baseUrl}/getAllStudentMedicalReports`;
    console.log('Making API request to:', url);
    
    return this.http.get(url).pipe(
      tap(response => {
        console.log('API Response:', response);
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }
  
  getStudentMedicalReportsForExcel(filters: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getStudentMedicalReportsForExcel`, {
      params: {
        department: filters.department || '',
        program: filters.program || '',
        year: filters.year || '',
        search: filters.search || ''
      }
    }).pipe(
      catchError(this.handleError)
    );
  }



  //for clinic dashboard graph
  getStudentLimit(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getStudentLimit`).pipe(
      map((response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data.map((item: any) => ({
            dayOfWeek: item.day_of_week,
            totalStudentLimit: item.total_student_limit
          }));
        }
        throw new Error('Invalid response format');
      }),
      catchError(this.handleError)
    );
  }

  getDepartmentTotal(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDepartmentTotal`).pipe(
      map((response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data.map((item: any) => ({
            department: item.department,
            totalStudents: item.total_students
          }));
        }
        throw new Error('Invalid response format');
      }),
      catchError(this.handleError)
    );
}

  

  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (typeof error.error === 'string' && error.error.includes('{')) {
      // Try to parse JSON from error response that might include PHP warnings
      try {
        const cleanResponse = error.error.substring(error.error.indexOf('{'));
        const jsonResponse = JSON.parse(cleanResponse);
        return jsonResponse;
      } catch (e) {
        errorMessage = `Error parsing response: ${e}`;
      }
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
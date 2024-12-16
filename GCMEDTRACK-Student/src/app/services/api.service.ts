import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api/';



  constructor(private http: HttpClient) {}

  // User login method
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}userLogin`, data).pipe(
      catchError(this.handleError)
    );
  }

  // User registration method
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}userRegister`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Get user profile by user ID
  getUserProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getUserProfile/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get user profile by domain account (email or username)
  getProfileByDomainAccount(domainAccount: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getProfileByDomainAccount/${domainAccount}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all user profiles (optional, depending on needs)
  getAllUserProfiles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getAllUserProfiles`).pipe(
      catchError(this.handleError)
    );
  }

  // General error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }


  //get the firtsname and lastname in student side
  // Get user fullname by user ID
// Method to get the user's full name (firstname + lastname) by userId
getUserFullNameByUsername(username: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}getUserFullNameByUsername?username=${username}`).pipe(
    catchError(this.handleError)
  );
}

// Method to create a user profile







}

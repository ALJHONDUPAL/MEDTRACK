import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost/MEDTRACK/backend_php/api';

  constructor(private http: HttpClient, private router: Router) { }

  // Register user
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/userRegister`, data) // Correct route
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return of({ success: false, error: error.message || 'Registration failed' });
        })
      );
}

  // Login user
  login(domain_account: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/userLogin`, { domain_account, password }) // Correct route
        .pipe(
            map(response => {
                if (response.status.remarks === 'success') {
                    this.saveToken(response.payload.token);
                    localStorage.setItem('domain_account', domain_account);
                    this.router.navigate(['/sidenav']);
                    return response;
                } else {
                    throw new Error(response.status.message);
                }
            }),
            catchError(error => {
              console.error('Login error details:', error.error);
              return of({ success: false, error: error.message || 'Login failed' });
          }))
          
        
}


  // Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }

  // Log out user
  // user(): void {
  //   localStorage.clear(); // Clear all user data
  //   this.router.navigate(['/login']); // Redirect to login
  // }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  userLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('id');
    localStorage.removeItem('domain_account');
    localStorage.removeItem('password');
    this.router.navigate(['/login']);
}
getUserId(): string | null {
  const user = JSON.parse(localStorage.getItem('user') || 'null');  // Assuming the user is saved as a JSON object
  return user ? user.id : null;  // Return the user ID if available
}
  
}

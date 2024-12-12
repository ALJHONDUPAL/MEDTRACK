import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  
  domain_account: string = '';
  isSidebarOpen: boolean = false;
  constructor(
    private service: ApiService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
  ) { this.domain_account= localStorage.getItem('domain_account') || '' }
 

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.userLogout();
  }

}

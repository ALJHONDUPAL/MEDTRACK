import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClinicAuthService } from '../services/auth.service';

interface Activity {
  time: string;
  type: string;
  details: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  totalPatients: number = 0;
  todayAppointments: number = 0;
  pendingConsultations: number = 0;
  
  recentActivities: Activity[] = [
    { 
      time: '10:30 AM', 
      type: 'Patient Registered', 
      details: 'John Doe - New Patient' 
    },
    { 
      time: '11:15 AM', 
      type: 'Consultation', 
      details: 'Jane Smith - Follow-up' 
    },
    { 
      time: '12:00 PM', 
      type: 'Prescription', 
      details: 'Medication updated for Michael Brown' 
    }
  ];

  constructor(
    private authService: ClinicAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch user details
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = `${user.first_name} ${user.last_name}`;
    } else {
      // Redirect to login if no user found
      this.router.navigate(['/login']);
    }

    // In a real application, you would fetch these stats from your backend
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    // Placeholder for fetching dashboard statistics
    // In a real app, this would be an API call to your backend
    this.totalPatients = 150;
    this.todayAppointments = 12;
    this.pendingConsultations = 5;
  }

  logout() {
    this.authService.logout();
  }
}
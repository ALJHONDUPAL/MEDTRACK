import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Observable, catchError } from 'rxjs';

interface Appointment {
  id: number;
  studentName: string;
  studentId: string;
  department: string;
  date: string;
  time: string;
  purpose: string;
  yearLevel: string;
  avatar: string;
  status: string;
}

@Component({
  selector: 'app-appointments',
  imports: [FormsModule, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  selectedYear: string = '1st Year';
  studentSlot: string = '99/100';
  appointments: Appointment[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.apiService.getClinicAppointments().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.appointments = response.data;
        } else {
          console.error('Failed to load appointments:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  acceptAppointment(appointment: Appointment): void {
    this.apiService.updateAppointmentStatus(appointment.id, 'Accepted').subscribe({
      next: (response) => {
        if (response.status === 'success') {
          appointment.status = 'Accepted';
          alert('Appointment accepted successfully');
          this.loadAppointments();
        } else {
          alert(response.message || 'Failed to accept appointment');
        }
      },
      error: (error) => {
        console.error('Error accepting appointment:', error);
        alert('Failed to accept appointment: ' + error);
      }
    });
  }

  cancelAppointment(appointment: Appointment): void {
    this.apiService.updateAppointmentStatus(appointment.id, 'Cancelled').subscribe({
      next: (response) => {
        if (response.status === 'success') {
          appointment.status = 'Cancelled';
          alert('Appointment cancelled successfully');
          this.loadAppointments();
        } else {
          alert(response.message || 'Failed to cancel appointment');
        }
      },
      error: (error) => {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment: ' + error);
      }
    });
  }
}

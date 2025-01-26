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
  selectedYear: string = 'All';
  selectedDepartment: string = 'All';
  totalSlots: number = 0;
  currentBookings: number = 0;
  showRejectModal: boolean = false;
  rejectionReason: string = '';
  selectedAppointment: Appointment | null = null;

  get studentSlot(): string {
    return `${this.currentBookings}/${this.totalSlots}`;
  }

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];

  yearLevels: string[] = ['All', '1', '2', '3', '4'];
  departments: string[] = [
    'All',
    'CCS',
    'CBA',
    'CAHS',
    'CEAH',
    'CHTM-Tourism',
    'CHTM-Hospitality'
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.apiService.getClinicAppointments().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.appointments = response.data;
          
          this.currentBookings = this.appointments.filter(app => 
            app.status !== 'Cancelled'
          ).length;
          
          this.getTotalSlots();
          
          this.filterAppointments();
          console.log('Loaded appointments:', this.appointments);
        } else {
          console.error('Failed to load appointments:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  getTotalSlots() {
    this.apiService.getTimeSlots(new Date().toLocaleDateString('en-US', { weekday: 'long' })).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.totalSlots = response.data.reduce((total: number, slot: any) => 
            total + (slot.studentLimit || 0), 0);
        } else {
          console.error('Failed to get total slots:', response.message);
          this.totalSlots = 100;
        }
      },
      error: (error) => {
        console.error('Error getting total slots:', error);
        this.totalSlots = 100;
      }
    });
  }

  filterAppointments() {
    console.log('Filtering with:', { year: this.selectedYear, department: this.selectedDepartment });
    
    this.filteredAppointments = this.appointments.filter(appointment => {
      const appointmentYear = appointment.yearLevel.split(' ')[0];
      
      const yearMatch = this.selectedYear === 'All' || appointmentYear === this.selectedYear;
      const departmentMatch = this.selectedDepartment === 'All' || appointment.department === this.selectedDepartment;
      
      console.log('Appointment:', {
        yearLevel: appointment.yearLevel,
        extractedYear: appointmentYear,
        yearMatch,
        departmentMatch
      });
      
      return yearMatch && departmentMatch;
    });
  }

  onYearChange() {
    this.filterAppointments();
  }

  onDepartmentChange() {
    this.filterAppointments();
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
    this.selectedAppointment = appointment;
    this.showRejectModal = true;
  }

  submitCancellation(): void {
    if (!this.selectedAppointment || !this.rejectionReason.trim()) {
      return;
    }

    this.apiService.updateAppointmentStatus(this.selectedAppointment.id, 'Cancelled', this.rejectionReason).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.selectedAppointment!.status = 'Cancelled';
          alert('Appointment cancelled successfully');
          this.loadAppointments();
          this.closeRejectModal();
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

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = '';
    this.selectedAppointment = null;
  }

  deleteAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.apiService.deleteAppointment(appointment.id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Appointment deleted successfully');
            this.loadAppointments();
          } else {
            alert(response.message || 'Failed to delete appointment');
          }
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          alert('Failed to delete appointment: ' + error);
        }
      });
    }
  }
}

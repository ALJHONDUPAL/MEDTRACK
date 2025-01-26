import { CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Appointment {
  id: number;
  slotId: number;      
  userId: number;
  studentId: string;
  purpose: string;
  status: string;
  time?: string;
  day?: string;
  userImage: string;
  userName: string;
  department: string;
  program: string;
  yearLevel: number;
  date: string;
  remarks?: string;
}

interface TimeSlot {
  slotId: number;      
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  date: string;
  studentLimit: number;
  currentBookings: number; // Add this to track current bookings
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  selectedDay: string = 'MONDAY';
  showAppointmentModal = false;
  selectedTimeSlot: TimeSlot | null = null;
  currentUserId: number = 0;
  purposes = ['Medical', 'Dental', 'Clinic'];

  showErrorModal: boolean = false;
  errorMessage: string = '';
  showSuccessAlert: boolean = false;
  
  newAppointment: Appointment = {
    id: 0,
    slotId: 0,
    userId: 0,
    studentId: '',
    purpose: '',
    status: 'Pending',
    userImage: '',
    userName: '',
    department: '',
    program: '',
    yearLevel: 0,
    date: ''
  };

  appointments: Appointment[] = [];
  timeSlots: TimeSlot[] = [];
  showRemarksModal = false;
  selectedRemarks: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.currentUserId = userId ? parseInt(userId) : 0;
    console.log('Initial userId:', this.currentUserId);
    
    if (!this.currentUserId) {
      console.error('No user ID found');
      this.router.navigate(['/login']);
      return;
    }
  
    this.newAppointment.userId = this.currentUserId;
    this.loadTimeSlots();
    this.loadAppointments();
  }
  
  private loadTimeSlots(): void {
    this.apiService.getTimeSlots(this.selectedDay).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.timeSlots = response.data.map((slot: any) => ({
            slotId: slot.slot_id,
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            date: this.formatDate(slot.date),
            studentLimit: slot.student_limit,
            currentBookings: slot.current_bookings || 0
          }));
        } else {
          this.timeSlots = [];
        }
      },
      error: (error) => {
        console.error('Error loading time slots:', error);
        this.timeSlots = [];
      }
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private loadAppointments(): void {
    this.apiService.getAppointments(this.currentUserId).subscribe({
      next: (response: any) => {
        console.log('Raw appointment response:', response);
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.appointments = response.data.map((appointment: any) => ({
            id: appointment.id,
            slotId: appointment.slotId,
            userId: appointment.userId,
            studentId: appointment.studentId || 'N/A',
            purpose: appointment.purpose,
            status: appointment.status,
            remarks: appointment.remarks,
            userName: appointment.userName,
            userImage: appointment.userImage ? 
                      `http://localhost/MEDTRACK/backend_php/api/${appointment.userImage}` : 
                      'assets/default-avatar.png',
            department: appointment.department,
            program: appointment.program,
            yearLevel: appointment.yearLevel,
            date: appointment.date,
            time: appointment.time,
            day: appointment.day
          }));
          console.log('Processed appointments:', this.appointments);
        } else {
          console.error('Invalid response format:', response);
          this.appointments = [];
        }
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.appointments = [];
      }
    });
  }

  selectDay(day: string) {
    this.selectedDay = day;
    this.loadTimeSlots();
  }

  getAppointmentsForSelectedDay(): Appointment[] {
    return this.appointments.filter(appointment => appointment.day === this.selectedDay);
  }

  getAvailableTimeSlots(): TimeSlot[] {
    return this.timeSlots.filter(slot => 
      slot.dayOfWeek === this.selectedDay && 
      slot.currentBookings < slot.studentLimit
    );
  }

  selectTimeSlot(slot: TimeSlot) {
    this.selectedTimeSlot = slot;
    this.newAppointment.slotId = slot.slotId;
  }

  saveAppointment(): void {
    if (!this.selectedTimeSlot || !this.newAppointment.purpose || !this.currentUserId) {
      this.showErrorModal = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
  
    if (this.selectedTimeSlot.currentBookings >= this.selectedTimeSlot.studentLimit) {
      this.showErrorModal = true;
      this.errorMessage = 'This time slot is already full.';
      return;
    }
  
    const appointmentData = {
      slotId: this.selectedTimeSlot.slotId,
      userId: this.currentUserId,
      purpose: this.newAppointment.purpose,
      status: 'Pending'
    };
  
    this.apiService.createAppointment(appointmentData).subscribe({
      next: (response: any) => {
        if (response && response.status === 'success') {
          this.closeAppointmentModal();
          this.showSuccessAlert = true;
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 3000); // Hide after 3 seconds
          this.loadTimeSlots();
          this.loadAppointments();
        } else {
          this.showErrorModal = true;
          this.errorMessage = response?.message || 'Failed to create appointment.';
        }
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        this.showErrorModal = true;
        this.errorMessage =
          typeof error === 'string'
            ? error
            : 'Failed to create appointment. Please try again.';
      },
    });
  }
  

  resetForm() {
    this.newAppointment = {
      id: 0,
      slotId: 0,
      userId: this.currentUserId,
      studentId: '',
      purpose: '',
      status: 'Pending',
      userImage: '',
      userName: '',
      department: '',
      program: '',
      yearLevel: 0,
      date: ''
    };
    this.selectedTimeSlot = null;
  }
  
  openAppointmentModal() {
    this.showAppointmentModal = true;
  }

  closeAppointmentModal() {
    this.showAppointmentModal = false;
    this.selectedTimeSlot = null;
    this.newAppointment = {
      id: 0,
      slotId: 0,
      userId: this.currentUserId,
      studentId: '',
      purpose: '',
      status: 'Pending',
      userImage: '',
      userName: '',
      department: '',
      program: '',
      yearLevel: 0,
      date: ''
    };
  }

  openRemarksModal(remarks: string) {
    this.selectedRemarks = remarks;
    this.showRemarksModal = true;
  }

  closeRemarksModal() {
    this.showRemarksModal = false;
    this.selectedRemarks = null;
  }
}
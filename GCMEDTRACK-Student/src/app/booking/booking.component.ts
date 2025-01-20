import { CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Appointment {
  slotId: number;      
  userId: number;
  purpose: string;
  status: string;
  time?: string;
  day?: string;
  userImage: string;
  userName: string;
  department: string;
  yearLevel: string;
  date: string;
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
  
  newAppointment: Appointment = {
    slotId: 0,
    userId: 0,
    purpose: '',
    status: 'Pending',
    userImage: '',
    userName: '',
    department: '',
    yearLevel: '',
    date: ''
  };

  appointments: Appointment[] = [];
  timeSlots: TimeSlot[] = [];

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
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.appointments = response.data.map((appointment: any) => ({
            slotId: appointment.slot_id,
            userId: appointment.user_id,
            purpose: appointment.purpose,
            status: appointment.status,
            userName: appointment.userName,
            userImage: appointment.userImage || 'assets/default-avatar.png',
            department: appointment.department,
            yearLevel: appointment.yearLevel,
            date: this.formatDate(appointment.date),
            time: `${appointment.start_time} - ${appointment.end_time}`,
            day: appointment.day_of_week
          }));
        } else {
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

  saveAppointment() {
    if (!this.selectedTimeSlot || !this.newAppointment.purpose || !this.currentUserId) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.selectedTimeSlot.currentBookings >= this.selectedTimeSlot.studentLimit) {
      alert('This time slot is already full');
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
          alert('Appointment created successfully!');
          this.closeAppointmentModal();
          this.loadTimeSlots();
          this.loadAppointments();
        } else {
          alert(response?.message || 'Failed to create appointment');
        }
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        alert(typeof error === 'string' ? error : 'Failed to create appointment. Please try again.');
      }
    });
  }

  resetForm() {
    this.newAppointment = {
      slotId: 0,
      userId: this.currentUserId,
      purpose: '',
      status: 'Pending',
      userImage: '',
      userName: '',
      department: '',
      yearLevel: '',
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
      slotId: 0,
      userId: this.currentUserId,
      purpose: '',
      status: 'Pending',
      userImage: '',
      userName: '',
      department: '',
      yearLevel: '',
      date: ''
    };
  }
}
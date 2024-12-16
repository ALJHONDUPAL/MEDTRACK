import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  imports: [FormsModule,   NgIf, CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  selectedDay: string = 'MONDAY';
  showAppointmentModal = false;
  selectedTimeSlot: string = '';
  
  purposes = ['Medical', 'Dental', 'Clinic'];
  departments = ['CCS', 'CEAH', 'CHTM', 'CBA'];
  newAppointment = {
    name: '',
    department: '',
    yearLevel: '',
    purpose: '',
    date: '',
    time: ''
  };

  appointments = [
    {
      userName: 'John Doe',
      userId: '202019222',
      userImage: 'assets/default-avatar.png',
      department: 'CCS',
      yearLevel: '1',
      date: '17 May 2023',
      time: '09:00 AM',
      purpose: 'Medical',
      status: 'Accept',
      day: 'WEDNESDAY'
    },
    {
      userName: 'Justine',
      userId: '202019222',
      userImage: 'assets/default-avatar.png',
      department: 'CHTM-Hospitality',
      yearLevel: '2',
      date: 'Nov 30, 2024',
      time: '10:00 AM - 11:00 AM',
      purpose: 'Medical',
      status: 'Pending',
      day: 'THURSDAY'
    }
  ];

  timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
  ];

  // Create a map to store appointments by day
  appointmentsByDay: { [key: string]: any[] } = {
    SUNDAY: [],
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: []
  };

  constructor() { }

  ngOnInit(): void {
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  openAppointmentModal() {
    this.showAppointmentModal = true;
  }

  closeAppointmentModal() {
    this.showAppointmentModal = false;
    this.resetForm();
  }

  selectTimeSlot(slot: string) {
    if (this.selectedTimeSlot === slot) {
      this.selectedTimeSlot = ''; // Deselect if clicking the same slot
    } else {
      this.selectedTimeSlot = slot; // Select new slot
    }
  }

  isTimeSlotSelected(slot: string): boolean {
    return this.selectedTimeSlot === slot;
  }

  saveAppointment() {
    if (!this.selectedTimeSlot || !this.newAppointment.department || !this.newAppointment.purpose || !this.newAppointment.yearLevel) {
      return;
    }

    const newAppointmentData = {
      userName: this.newAppointment.name,
      userId: '202019222', // You might want to get this from a service
      userImage: 'assets/default-avatar.png',
      department: this.newAppointment.department,
      yearLevel: this.newAppointment.yearLevel,
      date: new Date().toLocaleDateString(),
      time: this.selectedTimeSlot,
      purpose: this.newAppointment.purpose,
      status: 'Pending',
      day: this.selectedDay
    };

    // Add to day-specific array
    this.appointmentsByDay[this.selectedDay].push(newAppointmentData);
    // Add to main appointments array
    this.appointments.unshift(newAppointmentData);
    this.closeAppointmentModal();
  }

  resetForm() {
    this.newAppointment = {
      name: '',
      department: '',
      yearLevel: '',
      purpose: '',
      date: '',
      time: ''
    };
    this.selectedTimeSlot = '';
  }

  // Add method to get available time slots for selected day
  getAvailableTimeSlots(): string[] {
    const bookedSlots = this.getAppointmentsForSelectedDay()
      .map(appointment => appointment.time);
    
    return this.timeSlots.filter(slot => !bookedSlots.includes(slot));
  }

  // Add this method to filter appointments by selected day
  getAppointmentsForSelectedDay(): any[] {
    return this.appointments.filter(appointment => appointment.day === this.selectedDay);
  }
}


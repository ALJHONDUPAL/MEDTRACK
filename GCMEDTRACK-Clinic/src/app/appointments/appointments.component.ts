import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Appointment {
  studentName: string;
  studentId: string;
  department: string;
  date: string;
  time: string;
  purpose: string;
  yearLevel: string;
  avatar: string;
}

@Component({
  selector: 'app-appointments',
  imports: [FormsModule, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit{

  selectedYear: string = '1st Year';
  studentSlot: string = '99/100';

  appointments: Appointment[] = [
    {
      studentName: 'John Doe',
      studentId: '202200000',
      department: 'CCS',
      date: '17 May 2022',
      time: '09:00 AM',
      purpose: 'Medical',
      yearLevel: '1st Year',
      avatar: 'assets/user.png'
    },
    {
      studentName: 'John Doe',
      studentId: '202200000',
      department: 'CCS',
      date: '06 Jun 2021',
      time: '09:00 AM',
      purpose: 'Medical',
      yearLevel: '1st Year',
      avatar: 'assets/user.png'
    },
    // Add more appointments as needed
  ];

  constructor() { }

  ngOnInit(): void { }

  acceptAppointment(appointment: Appointment): void {
    // Implement accept logic
  }

  cancelAppointment(appointment: Appointment): void {
    // Implement cancel logic
  }

}

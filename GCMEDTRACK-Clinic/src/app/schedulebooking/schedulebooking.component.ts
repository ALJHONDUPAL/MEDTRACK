
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';


interface Appointment {
  avatar: string;
  name: string;
  id: string;
  department: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  date: string;
  studentLimit: number;
  dayOfWeek: string;
}
@Component({
  selector: 'app-schedulebooking',
  imports: [CommonModule, FormsModule, MatDatepickerModule,   MatFormFieldModule,    ],
  templateUrl: './schedulebooking.component.html',
  styleUrl: './schedulebooking.component.css'
})

  export class SchedulebookingComponent implements OnInit {
    weekDays: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    selectedDay: string = 'MONDAY';
  
    appointments: Appointment[] = [
      {
        avatar: 'assets/user.png',
        name: 'John Doe',
        id: '20220000',
        department: 'CCS',
        date: '17 May 2022',
        time: '09:00 AM',
        purpose: 'Medical',
        status: 'Pending'
      },
      {
        avatar: 'assets/user.png',
        name: 'John Doe',
        id: '20220000',
        department: 'CCS',
        date: '17 May 2022',
        time: '09:00 AM',
        purpose: 'Medical',
        status: 'Ongoing'
      },
      {
        avatar: 'assets/user.png',
        name: 'John Doe',
        id: '20220000',
        department: 'CCS',
        date: '17 May 2022',
        time: '09:00 AM',
        purpose: 'Medical',
        status: 'Did not show up'
      }
    ];
  
    timeSlots: TimeSlot[] = [];
  
    showScheduleModal = false;
    studentLimit: number = 0;
    selectedDate: Date | null = null;
    
    // Time picker properties
    showTimePicker = false;
    isSettingStartTime = true;
    
    selectedStartTime: string = '';
    selectedEndTime: string = '';
    
    selectedStartHour: string = '';
    selectedStartMinute: string = '';
    selectedStartPeriod: string = 'AM';
    
    selectedEndHour: string = '';
    selectedEndMinute: string = '';
    selectedEndPeriod: string = 'AM';
    
    hours = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
    minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
    periods = ['AM', 'PM'];
  
    dropdownPosition = { top: 0, left: 0 };
  
    filteredAppointments: Appointment[] = [];
    filteredTimeSlots: TimeSlot[] = [];
  
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.input-with-icon') && !target.closest('.time-picker-dropdown')) {
        this.showTimePicker = false;
      }
    }
  
    toggleTimePicker(event?: MouseEvent): void {
      if (event) {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        this.dropdownPosition = {
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX
        };
      }
      this.showTimePicker = !this.showTimePicker;
    }
  
    selectHour(hour: string): void {
      if (this.isSettingStartTime) {
        this.selectedStartHour = hour;
        this.updateSelectedTime('start');
      } else {
        this.selectedEndHour = hour;
        this.updateSelectedTime('end');
      }
    }
  
    selectMinute(minute: string): void {
      if (this.isSettingStartTime) {
        this.selectedStartMinute = minute;
        this.updateSelectedTime('start');
      } else {
        this.selectedEndMinute = minute;
        this.updateSelectedTime('end');
      }
    }
  
    selectPeriod(period: string): void {
      if (this.isSettingStartTime) {
        this.selectedStartPeriod = period;
        this.updateSelectedTime('start');
      } else {
        this.selectedEndPeriod = period;
        this.updateSelectedTime('end');
      }
      this.showTimePicker = false; // Close picker after period selection
    }
  
    private updateSelectedTime(type: 'start' | 'end'): void {
      if (type === 'start' && this.selectedStartHour && this.selectedStartMinute) {
        this.selectedStartTime = `${this.selectedStartHour}:${this.selectedStartMinute} ${this.selectedStartPeriod}`;
      } else if (type === 'end' && this.selectedEndHour && this.selectedEndMinute) {
        this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute} ${this.selectedEndPeriod}`;
      }
    }
  
    saveSchedule(): void {
      if (this.selectedDate && this.selectedStartTime && this.selectedEndTime) {
        const formattedDate = this.formatDate(this.selectedDate);
        const dayOfWeek = this.weekDays[this.selectedDate.getDay()];
        
        const newTimeSlot: TimeSlot = {
          startTime: this.selectedStartTime,
          endTime: this.selectedEndTime,
          date: formattedDate,
          studentLimit: this.studentLimit || 10,
          dayOfWeek: dayOfWeek
        };
        
        this.timeSlots.unshift(newTimeSlot);
        this.filterTimeSlots();
        this.closeScheduleModal();
      }
    }
  
    private formatDate(date: Date | null): string {
      if (!date) return '';
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
  
    closeScheduleModal(): void {
      this.showScheduleModal = false;
      this.resetModalForm();
    }
  
    private resetModalForm(): void {
      this.studentLimit = 0;
      this.selectedDate = null;
      this.selectedStartTime = '';
      this.selectedEndTime = '';
      this.selectedStartHour = '';
      this.selectedStartMinute = '';
      this.selectedStartPeriod = 'AM';
      this.selectedEndHour = '';
      this.selectedEndMinute = '';
      this.selectedEndPeriod = 'AM';
      this.showTimePicker = false;
      this.isSettingStartTime = true;
    }
  
    openScheduleModal(): void {
      this.showScheduleModal = true;
    }
  
    ngOnInit(): void {
      this.resetModalForm();
      this.filterAppointments();
      this.filterTimeSlots();
    }
  
    deleteTimeSlot(slotToDelete: TimeSlot): void {
      this.timeSlots = this.timeSlots.filter(slot => 
        slot.startTime !== slotToDelete.startTime || 
        slot.endTime !== slotToDelete.endTime || 
        slot.date !== slotToDelete.date ||
        slot.dayOfWeek !== slotToDelete.dayOfWeek
      );
      this.filterTimeSlots();
    }
  
    editTimeSlot(slot: TimeSlot): void {
      this.studentLimit = slot.studentLimit;
      
      // Parse the date from the formatted string
      const [day, month, year] = slot.date.split(' ');
      this.selectedDate = new Date(`${month} ${day} ${year}`);
      
      // Set start time
      this.selectedStartTime = slot.startTime;
      const [startHour, startMinute, startPeriod] = slot.startTime.split(/[:\s]/);
      this.selectedStartHour = startHour;
      this.selectedStartMinute = startMinute;
      this.selectedStartPeriod = startPeriod;
      
      // Set end time
      this.selectedEndTime = slot.endTime;
      const [endHour, endMinute, endPeriod] = slot.endTime.split(/[:\s]/);
      this.selectedEndHour = endHour;
      this.selectedEndMinute = endMinute;
      this.selectedEndPeriod = endPeriod;
      
      // Remove the slot being edited
      this.timeSlots = this.timeSlots.filter(s => 
        s.startTime !== slot.startTime || 
        s.endTime !== slot.endTime || 
        s.date !== slot.date ||
        s.dayOfWeek !== slot.dayOfWeek
      );
      
      this.openScheduleModal();
    }
  
    selectDay(day: string): void {
      this.selectedDay = day;
      this.filterAppointments();
      this.filterTimeSlots();
    }
  
    private filterAppointments(): void {
      if (this.selectedDay === 'MONDAY') {
        this.filteredAppointments = this.appointments;
      } else {
        this.filteredAppointments = [];
      }
    }
  
    private filterTimeSlots(): void {
      this.filteredTimeSlots = this.timeSlots.filter(slot => 
        slot.dayOfWeek === this.selectedDay
      );
    }
  
    onDateSelected(event: MatDatepickerInputEvent<Date>): void {
      this.selectedDate = event.value;
    }
  
    openTimePicker(event: MouseEvent, isStartTime: boolean): void {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      this.dropdownPosition = {
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX
      };
      
      this.isSettingStartTime = isStartTime;
      this.showTimePicker = true;
    }
}

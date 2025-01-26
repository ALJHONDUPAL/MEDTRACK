import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ApiService } from '../services/api.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  id?: number;
  startTime: string;
  endTime: string;
  date: string;
  studentLimit: number;
  dayOfWeek: string;
  currentBookings: number;
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-schedulebooking',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDatepickerModule,
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './schedulebooking.component.html',
  styleUrls: ['./schedulebooking.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class SchedulebookingComponent implements OnInit {
  weekDays: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  selectedDay: string = 'MONDAY';

  
  timeSlots: TimeSlot[] = [];
  showScheduleModal = false;
  studentLimit: number = 0;
  selectedDate: Date | null = null;
  selectedWeekdays: string[] = [];
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

  hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  periods = ['AM', 'PM'];

  dropdownPosition = { top: 0, left: 0 };

  filteredAppointments: Appointment[] = [];
  filteredTimeSlots: TimeSlot[] = [];

  // Update the editingSlotId type to handle undefined
  editingSlotId: number | null = null;

  minDate = new Date(); // Prevents selecting past dates
  
  constructor(private apiService: ApiService) {
    // Initialize minDate to start of current day
    this.minDate.setHours(0, 0, 0, 0);
  }
  
  ngOnInit(): void {
    if (!this.selectedDate) {
      this.selectedDate = new Date();
    }
    this.loadTimeSlots();
  }

  onDateSelected(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      const dayIndex = date.getDay();
      this.selectedDay = this.weekDays[dayIndex];
      this.loadTimeSlots();
    }
  }

  private loadTimeSlots(): void {
    if (!this.selectedDate || !this.selectedDay) return;

    this.apiService.getTimeSlots(this.selectedDay).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          const selectedDateStr = this.formatDateForBackend(this.selectedDate);
          this.timeSlots = response.data
            .filter((slot: any) => slot.date === selectedDateStr)
            .map((slot: any) => ({
              id: slot.slot_id,
              dayOfWeek: slot.day_of_week,
              startTime: slot.start_time,
              endTime: slot.end_time,
              date: slot.date,
              studentLimit: slot.student_limit,
              currentBookings: slot.current_bookings || 0
            }));
          this.filterTimeSlots();
        } else {
          this.timeSlots = [];
          this.filterTimeSlots();
        }
      },
      error: (error) => {
        console.error('Error loading time slots:', error);
        this.timeSlots = [];
        this.filterTimeSlots();
      }
    });
  }

  saveSchedule(): void {
    if (!this.selectedDate || !this.selectedStartTime || !this.selectedEndTime || !this.studentLimit) {
      // Show error message
      return;
    }

    const timeSlot: TimeSlot = {
      dayOfWeek: this.selectedDay,
      startTime: this.formatTimeWithPeriod(this.selectedStartTime),
      endTime: this.formatTimeWithPeriod(this.selectedEndTime),
      date: this.formatDateForBackend(this.selectedDate),
      studentLimit: this.studentLimit,
      currentBookings: 0
    };

    if (this.editingSlotId) {
      this.apiService.updateTimeSlot(this.editingSlotId, timeSlot).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.closeScheduleModal();
            // Force reload of time slots
            setTimeout(() => {
              this.loadTimeSlots();
            }, 100);
          }
        },
        error: (error) => {
          console.error('Error updating schedule:', error);
        },
        complete: () => {
          // Reload even if there's an error
          this.loadTimeSlots();
        }
      });
    } else {
      this.apiService.addTimeSlot(timeSlot).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.closeScheduleModal();
            // Force reload of time slots
            setTimeout(() => {
              this.loadTimeSlots();
            }, 100);
          }
        },
        error: (error) => {
          console.error('Error saving schedule:', error);
        },
        complete: () => {
          // Reload even if there's an error
          this.loadTimeSlots();
        }
      });
    }
  }
  
  deleteTimeSlot(slot: TimeSlot): void {
    if (slot.id) {
      this.apiService.deleteTimeSlot(slot.id).subscribe({
        next: () => this.loadTimeSlots(),
        error: (error) => console.error('Error deleting time slot:', error)
      });
    }
  }

  private filterTimeSlots(): void {
    if (!Array.isArray(this.timeSlots)) {
      this.filteredTimeSlots = [];
      return;
    }
    
    this.filteredTimeSlots = this.timeSlots.filter(slot => 
      slot.dayOfWeek === this.selectedDay
    );

    // Force change detection
    this.filteredTimeSlots = [...this.filteredTimeSlots];
  }

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
    this.editingSlotId = null;
  }

  openScheduleModal(): void {
    this.showScheduleModal = true;
  }

  editTimeSlot(slot: TimeSlot): void {
    // Ensure id exists before assigning
    this.editingSlotId = slot.id ?? null;  // Use nullish coalescing
    this.studentLimit = slot.studentLimit;

    // Parse the date string to Date object
    this.selectedDate = new Date(slot.date);

    // Set start time
    this.selectedStartTime = slot.startTime;
    const [startTime, startPeriod] = slot.startTime.split(' ');
    const [startHour, startMinute] = startTime.split(':');
    this.selectedStartHour = startHour;
    this.selectedStartMinute = startMinute;
    this.selectedStartPeriod = startPeriod;

    // Set end time
    this.selectedEndTime = slot.endTime;
    const [endTime, endPeriod] = slot.endTime.split(' ');
    const [endHour, endMinute] = endTime.split(':');
    this.selectedEndHour = endHour;
    this.selectedEndMinute = endMinute;
    this.selectedEndPeriod = endPeriod;

    this.openScheduleModal();
  }

  private filterAppointments(): void {
    if (this.selectedDay === 'MONDAY') {
    } else {
      this.filteredAppointments = [];
    }
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

  private formatDateForBackend(date: Date | null): string {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTimeWithPeriod(time: string): string {
    const [timeComponent, period] = time.split(' ');
    const [hours, minutes] = timeComponent.split(':');
    return `${hours.padStart(2, '0')}:${minutes} ${period}`;
  }
}

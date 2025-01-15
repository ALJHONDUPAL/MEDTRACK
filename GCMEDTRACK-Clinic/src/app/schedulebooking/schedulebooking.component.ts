import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ApiService } from '../services/api.service';

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
  id?: any;
  startTime: string;
  endTime: string;
  date: string;
  studentLimit: number;
  dayOfWeek: string;
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
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
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

  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.loadTimeSlots();
  }
  private loadTimeSlots(): void {
    this.apiService.getTimeSlots(this.selectedDay).subscribe({
      next: (response: any) => {
        // Check if response has data property and it's an array
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.timeSlots = response.data.map((slot: any) => ({
            id: slot.slot_id,
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            date: slot.date,
            studentLimit: slot.student_limit
          }));
        } else {
          this.timeSlots = [];
        }
        this.filterTimeSlots();
      },
      error: (error) => {
        console.error('Error loading time slots:', error);
        this.timeSlots = [];
        this.filterTimeSlots();
      }
    });
  }

  selectDay(day: string): void {
    this.selectedDay = day;
    this.loadTimeSlots();
  }

  saveSchedule(): void {
    if (this.selectedDate && this.selectedStartTime && this.selectedEndTime) {
      const formattedDate = this.formatDate(this.selectedDate);
      
      const timeSlot: TimeSlot = {
        dayOfWeek: this.selectedDay,
        startTime: this.selectedStartTime,
        endTime: this.selectedEndTime,
        date: formattedDate,
        studentLimit: this.studentLimit || 10
      };

      this.apiService.addTimeSlot(timeSlot).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadTimeSlots();
            this.closeScheduleModal();
          } else {
            console.error('Error saving time slot:', response.message);
          }
        },
        error: (error) => {
          console.error('Error saving time slot:', error);
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
  }

  openScheduleModal(): void {
    this.showScheduleModal = true;
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
}

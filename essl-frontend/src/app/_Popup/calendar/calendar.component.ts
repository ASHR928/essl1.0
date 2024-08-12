import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../_Material/material/material.module';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    MaterialModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  currentDate: Date = new Date();
  leave: any[] = [];

  leaveStatus = [
    { key: '1', value: 'Present' },
    { key: '2', value: 'Absent' },
    { key: '3', value: 'Sick Leave' },
    { key: '4', value: 'Casual Leave' }
  ];

  getId(data: any) {
    if (this.leave.length > 0) {
      this.leave = [];
    }
    this.leave.push({ key: data.value, title: data.triggerValue });
    localStorage.setItem('leave', JSON.stringify(this.leave));
  }
}

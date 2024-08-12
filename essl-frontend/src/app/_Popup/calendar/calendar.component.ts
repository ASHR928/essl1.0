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

  leaveStatus = [
    { key: '1', value: 'Present' },
    { key: '1', value: 'Absent' },
    { key: '1', value: 'Sick Leave' },
    { key: '1', value: 'Casual Leave' }
  ];

  getId(data: any) {}
}

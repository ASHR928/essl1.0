import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../_Material/material/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-calendar',
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
    { key: '4', value: 'Casual Leave' },
    { key: '5', value: 'NCNS' },
    { key: '6', value: 'SW' },
    { key: '7', value: '½Present' },
    { key: '8', value: 'OT' }
  ];

  constructor(public dialogRef: MatDialogRef<CalendarComponent>) {}

  getId(data: any) {
    if (this.leave.length > 0) {
      this.leave = [];
    }

    const lst = [
      { key: data.value, title: data.triggerValue, date: '2024-08-24' },
      { key: data.value, title: data.triggerValue, date: '2024-08-15' }
    ];
    this.leave = lst;
    // localStorage.setItem('leave', JSON.stringify(this.leave));
  }

  cancel() {
    localStorage.setItem('leave', '');
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.leave);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

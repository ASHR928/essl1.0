import { Component } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { AttendancepunchlogService } from '../../_Services/attendancepunchlog.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonGridComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  colDefs: any[] = [
    { field: 'AttendanceLogId', headerName: 'Attendance Log ID', filter: 'text', width: 150 },
    { field: 'AttendanceDate', headerName: 'Attendance Date', filter: 'date', width: 150 },
    { field: 'EmployeeId', headerName: 'Employee ID', filter: 'text', width: 120 },
    { field: 'InTime', headerName: 'In Time', filter: 'text', width: 120 },
    { field: 'InDeviceId', headerName: 'In Device ID', filter: 'text', width: 120 },
    { field: 'OutTime', headerName: 'Out Time', filter: 'text', width: 120 },
    { field: 'OutDeviceId', headerName: 'Out Device ID', filter: 'text', width: 120 },
    { field: 'Duration', headerName: 'Duration', filter: 'text', width: 120 },
    { field: 'LateBy', headerName: 'Late By', filter: 'text', width: 120 },
    { field: 'EarlyBy', headerName: 'Early By', filter: 'text', width: 120 },
    { field: 'IsOnLeave', headerName: 'Is On Leave', filter: 'text', width: 120 },
    { field: 'LeaveType', headerName: 'Leave Type', filter: 'text', width: 120 },
    { field: 'LeaveDuration', headerName: 'Leave Duration', filter: 'text', width: 120 },
    { field: 'WeeklyOff', headerName: 'Weekly Off', filter: 'text', width: 120 },
    { field: 'Holiday', headerName: 'Holiday', filter: 'text', width: 120 },
    { field: 'LeaveRemarks', headerName: 'Leave Remarks', filter: 'text', width: 150 },
    { field: 'PunchRecords', headerName: 'Punch Records', filter: 'text', width: 150 },
    { field: 'ShiftId', headerName: 'Shift ID', filter: 'text', width: 120 },
    { field: 'Present', headerName: 'Present', filter: 'text', width: 120 },
    { field: 'Absent', headerName: 'Absent', filter: 'text', width: 120 },
    { field: 'Status', headerName: 'Status', filter: 'text', width: 120 },
    { field: 'StatusCode', headerName: 'Status Code', filter: 'text', width: 120 },
    { field: 'LeaveTypeId', headerName: 'Leave Type ID', filter: 'text', width: 120 },
    { field: 'LossOfHours', headerName: 'Loss Of Hours', filter: 'text', width: 120 },
  ];

  rowData: any[] = [];
 
  allrows = true;

  queryParams = { /* Add your query parameters here */ };

  constructor(private attendanceLogService: AttendancepunchlogService) {}

  ngOnInit(): void {
    this.loadAttendanceLogs();
  }

  private loadAttendanceLogs(): void {
    this.attendanceLogService.getAllAttendanceLogs().subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.rowData = data; // Assign directly if it's already an array
        } else {
          // If data is not an array, wrap it in an array
          this.rowData = [data];
        }
      },
      error: (error) => {
        console.error('Error loading attendance logs:', error);
        // Add error handling logic here
      }
    });
  }

}

import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AttendancepunchlogService } from '../../_Services/attendancepunchlog.service';
import { MaterialModule } from '../../_Material/material/material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { delay } from 'rxjs/operators';


@Component({
    selector: 'app-reports',
    standalone:true,
    imports: [ AgGridAngular,MaterialModule,MatProgressBarModule],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent {

   colDefs: any[] = [
    { field: 'EmployeeCode', headerName: 'Employee Code',  width: 150,filter: 'agTextColumnFilter' },
    { field: 'EmployeeName', headerName: 'Employee Name',  width: 150, filter: 'agTextColumnFilter'  },
   
    { field: 'AttendanceDate', headerName: 'Attendance Date',  width: 150 },
    { field: 'EmployeeId', headerName: 'Employee ID', filter: 'agTextColumnFilter', width: 120 },
    { field: 'InTime', headerName: 'In Time',  width: 120 },
    { field: 'OutTime', headerName: 'Out Time',  width: 120 },
    { field: 'Duration', headerName: 'Duration',  width: 120 },
    { field: 'LateBy', headerName: 'Late By',  width: 120 },
    { field: 'EarlyBy', headerName: 'Early By',  width: 120 },
    { field: 'PunchRecords', headerName: 'Punch Records', filter: 'agTextColumnFilter', width: 150 },
    { field: 'ShiftId', headerName: 'Shift ID', filter: 'agTextColumnFilter', width: 120 },
    { field: 'Status', headerName: 'Status', filter: 'agTextColumnFilter', width: 120 }
  ];

  rowData: any[] = [];
  gridApi!: GridApi;
  searchQuery: string = '';
  loading: boolean = true;
  progressValue: number = 0; // Progress value for the buffer loader
  bufferValue: number = 10
  allrows = true;

  queryParams = { /* Add your query parameters here */ };

  constructor(private attendanceLogService: AttendancepunchlogService) {}

  ngOnInit(): void {
    this.loadAttendanceLogs();
    this.simulateProgress();
  }

  simulateProgress(): void {
    const interval = setInterval(() => {
      if (this.loading) {
        // Increase progressValue by 5 and loop around at 100%
        this.progressValue = (this.progressValue + 5) % 100;
        // Set bufferValue slightly ahead of progressValue
        this.bufferValue = this.progressValue + 10;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }


  private loadAttendanceLogs(): void {
    this.loading = true
    this.attendanceLogService.getAllAttendanceLogs().pipe(delay(3000)).subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.rowData = data;
          console.log(data) // Assign directly if it's already an array
        } else {
          // If data is not an array, wrap it in an array
          this.rowData = [data];
        }
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error loading attendance logs:', error);
        // Add error handling logic here
        this.loading = false; 
      }
    });
  }
  //Search Filter Logic
  onFilterChange(value: string): void {
    if (value.length >= 3) {
      this.applyFilter(value);
    } else {
      this.clearFilter();
    }
  }

  applyFilter(value: string): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', value);

    }
  }

  clearFilter(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', '');
    }
  }

  onGridReady(params: { api: GridApi }): void {
    this.gridApi = params.api;
  }
  downloadPDF(): void {
    let filteredData: any[] = [];
  this.gridApi.forEachNodeAfterFilterAndSort((node) => {
    filteredData.push(node.data);
  });

  const doc = new jsPDF({
    orientation: 'landscape', // Landscape mode for more columns
    format: 'a4'              // A3 paper for extra width
  });

  doc.text('Daily Attendance Report', 14, 10);

  // Build headers and rows based on colDefs
  const headers = this.colDefs.map(col => col.headerName);
  const rows = filteredData.map(row =>
    this.colDefs.map(col => row[col.field] || 'N/A')
  );
  
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: {
        fontSize: 8, // ✅ Reduce font size to fit more data
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 20 },  // AttendanceLogId
        1: { cellWidth: 20 },  // AttendanceDate
        2: { cellWidth: 20 },  // EmployeeId
        3: { cellWidth: 20 },  // InTime
        4: { cellWidth: 20 },  // OutTime
        5: { cellWidth: 20 },  // Duration
        6: { cellWidth: 20 },  // LateBy
        7: { cellWidth: 10 },  // EarlyBy
        8: { cellWidth: 10 }, // ✅ PunchRecords (Increased Width)
        9: { cellWidth: 60 },  // ShiftId
        10: { cellWidth: 10 }, 
        11: { cellWidth: 20 }  // Status
      },
      didParseCell: function (data) {
        if (data.column.index === 9) { // ✅ PunchRecords Column
          data.cell.styles.cellWidth = 60; // Increase width
          data.cell.styles.fontSize = 7; // Reduce font size
          // data.cell.styles.overflow = 'linebreak'; // ✅ Enable text wrapping
        }
      }
    });
  
    doc.save('Attendance_Report.pdf');
  }
  
  
}

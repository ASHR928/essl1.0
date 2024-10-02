import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { MaterialModule } from '../_Material/material/material.module';
import { ServicesModule } from '../_Modules/services/services.module';
import { HttpModule } from '../_Http/http/http.module';
import { AttendancepunchlogService } from '../_Services/attendancepunchlog.service';

@Component({
  selector: 'app-attendance-punch-log',
  standalone: true,
  imports: [
    MaterialModule,
    AgGridAngular,
    ServicesModule,
    HttpModule
  ],
  templateUrl: './attendance-punch-log.component.html',
  styleUrl: './attendance-punch-log.component.scss'
})
export class AttendancePunchLogComponent implements OnInit {
  gridApi!: GridApi;
  rowData: any = [];
  colDefs: ColDef[] = [
    // { field: "PunchTimeDetailsId", headerName: 'Punch Id', width: 100 },
    { field: "Emp_ID", headerName: 'Emp ID', width: 100, filter: true },
    { field: "Emp_Name", headerName: 'Emp Name', filter: true },
    { field: 'Emp_Alias_Name', headerName: 'Emp Alias Name' },
    { field: 'Emp_Designation', headerName: 'Emp Designation', width: 160, filter: true },
    { field: 'Emp_Team_Name', headerName: 'Emp Team Name', width: 170, filter: true },
    { field: 'Emp_Department_Name', headerName: 'Emp Dept Name', width: 170, filter: true },
    { field: 'date', headerName: 'Date', width: 120, filter: 'agDateColumnFilter', valueGetter: params => params.data.date.substring(0,10) },
    { field: 'hh_mm', headerName: 'Time', width: 100, filter: 'agTimeColumnFilter', valueGetter: params => params.data.date.substring(11, 16) }
  ];
  
  constructor(private attendancepunchlogService: AttendancepunchlogService) {}

  ngOnInit(): void {
    this.attendancepunchlogService.getAttendancePunchLog().subscribe((res: any) => {
      this.rowData = res;
    });
  }

  onFilterChange(value: any): void {
    if (value.length >= 3) {
      this.applyFilter(value);
    } else {
      this.clearFilter();
    }
  }
  applyFilter(value: any): void {
    this.gridApi.setGridOption('quickFilterText', value)
  }

  clearFilter(): void {
    this.gridApi.setGridOption('quickFilterText', '');
  }

  onGridReady(params: { api: GridApi }): void {
    this.gridApi = params.api;
  }
}

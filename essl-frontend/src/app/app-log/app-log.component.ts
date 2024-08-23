import { Component } from '@angular/core';
import { MaterialModule } from '../_Material/material/material.module';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-app-log',
  standalone: true,
  imports: [
    MaterialModule,
    AgGridAngular
  ],
  templateUrl: './app-log.component.html',
  styleUrl: './app-log.component.scss'
})
export class AppLogComponent {
  gridApi!: GridApi;
  rowData: any = [];
  colDefs: ColDef[] = [
    // { field: 'log_id', headerName: '' },
    { field: "employee_id", headerName: 'Emp ID', width: 100, filter: true },
    { field: "action_screen", headerName: 'Action Screen', filter: true },
    { field: 'description', headerName: 'Description' },
    { field: 'Emp_Name', headerName: 'Updated By' },
    { field: 'Updated_At', headerName: 'Updated At', width: 130, filter: 'date' }
  ];
  
  constructor() {}

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

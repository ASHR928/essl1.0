import { Component, OnInit } from '@angular/core';
import { HttpModule } from '../../_Http/http/http.module';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { EmployeeService } from '../../_Services/employee.service';
import { ServicesModule } from '../../_Modules/services/services.module';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_Material/material/material.module';
import { CommonService } from '../../_Resolver/common.service';

@Component({
  selector: 'roaster-model',
  standalone: true,
  imports: [
    HttpModule,
    AgGridAngular,
    CommonModule,
    CommonGridComponent,
    ServicesModule,
    MaterialModule
  ],
  templateUrl: './roaster-model.component.html',
  styleUrl: './roaster-model.component.scss'
})
export class RoasterModelComponent implements OnInit {
  rowData: any[] = [];
  employeeList: any[] = [];
  rowDataSecond: any[] = [];
  rowDataGet: any[] = [];

  allrows = {
    Emp_ID: "",
    Weekly_Off1: '',
    Weekly_Off2: "",
    Shift_ID: '',
    Start_Date: '',
    End_Date: ''
  };

  colDefs: any[] = [
    { field: 'Emp_ID', headerName: 'Employee ID', filter: 'text', width: 180 },
    { field: "Weekly_Off1", headerName: 'Weekly Off1', filter: 'text', width: 160 },
    { field: 'Weekly_Off2', headerName: "Weekly Off2", filter: 'text', width: 160 },
    { field: 'Shift_ID', headerName: 'Shift ID', filter: 'text', width: 120 },
    { field: 'Start_Date', headerName: 'Roaster Valid From', filter: 'text', width: 200 },
    { field: 'End_Date', headerName: 'Roaster Valid Till', filter: 'text', width: 200 }
  ];

  constructor(private employeeService: EmployeeService, private commonService: CommonService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data: any) => {
      this.employeeList = data;
    });
    this.employeeService.getEmpDetailsById(this.commonService.commonData.Emp_ID).subscribe((data: any) => {
      this.rowData = data;
    });

    this.employeeService.getRosters().subscribe((data: any) => {
      console.log(data);
      this.rowDataGet = data;
    });
  }

  getId(item: any) {
    this.rowDataSecond = this.rowDataGet.filter((data => {
      return data.Emp_ID == item.target.value;
    }));
  }
}

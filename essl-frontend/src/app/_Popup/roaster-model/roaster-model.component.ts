import { Component, OnInit } from '@angular/core';
import { HttpModule } from '../../_Http/http/http.module';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { EmployeeService } from '../../_Services/employee.service';
import { ServicesModule } from '../../_Modules/services/services.module';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../_Material/material/material.module';
import { CommonService } from '../../_Resolver/common.service';
import { MatDialogRef } from '@angular/material/dialog';

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
  empId2: number = 0;
  theme = 'ag-theme-quartz';

  allrows = {
    Emp_ID: "",
    Weekly_Off1: '',
    Weekly_Off2: "",
    Shift_ID: '',
    Start_Date: '',
    End_Date: ''
  };

  colDefs: any[] = [
    { field: 'Emp_ID', headerName: 'Employee ID', width: 180 },
    { field: "Weekly_Off1", headerName: 'Weekly Off1', width: 160 },
    { field: 'Weekly_Off2', headerName: "Weekly Off2", width: 160 },
    { field: 'Shift_ID', headerName: 'Shift ID', width: 120 },
    { field: 'Start_Date', headerName: 'Roaster Valid From', width: 200 },
    { field: 'End_Date', headerName: 'Roaster Valid Till', width: 200 }
  ];


  constructor(private employeeService: EmployeeService, private commonService: CommonService, public dialogRef: MatDialogRef<RoasterModelComponent>) { }

  ngOnInit(): void {
    this.employeeService.getEmpDetailsById(this.commonService.commonData.Emp_ID).subscribe((data: any) => {
      this.rowData = data;
      const Emp_ID = data[0].Emp_ID;

      this.employeeService.getEmployees().subscribe((data: any) => {
        this.employeeList = data.filter((result: any) => {
          return result.Emp_ID != Emp_ID;
        });
      });
    });

    this.employeeService.getRosters().subscribe((data: any) => {
      this.rowDataGet = data;
    });
  }

  getId(item: any) {
    this.rowDataSecond = this.rowDataGet.filter((data => {
      this.empId2 = item.triggerValue;
      return data.Emp_ID == item.triggerValue;
    }));
  }

  SwapRow() {

    this.employeeService.putSwapEmployees(this.commonService.commonData.Emp_ID, this.empId2).subscribe((data: any) => {
      alert('Employee Roster successfully swap..');

      let logBody = {
        employee_id: Number(localStorage.getItem('employee_id')),
        action_screen: 'Swap Roster',
        description: 'Roster swapped for employee id ' + this.commonService.commonData.Emp_ID + ' with employee id ' + this.empId2

      }
      this.employeeService.insertApplicationLog(logBody).subscribe((data => {

      }))
      this.dialogRef.close();
    });
  }
}

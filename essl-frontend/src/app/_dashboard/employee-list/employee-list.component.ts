import { Component, OnInit } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { ServicesModule } from '../../_Modules/services/services.module';
import { ButtonsComponent } from '../../_Common/buttons/buttons.component';
import { ButtonService } from '../../_Resolver/button.service';
import { EmployeeService } from '../../_Services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonGridComponent,
    ServicesModule,
    ButtonsComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
   rowData: any[] = [];

  allrows = {
    Emp_Name: "",
    Emp_Company: '',
    Emp_Designation: '',
    Emp_Contact_No: '',
    Emp_email: '',
    Emp_Team_Name: '',
    Emp_Department_Name: ""
  };

  colDefs: any[] = [
    { field: 'Emp_Name', headerName: 'Employee Name', filter: 'text', width: 180 },
    { field: "Emp_Company", headerName: 'Company', filter: 'text', width: 180 },
    { field: 'Emp_Designation', headerName: "Designation", filter: 'text', width: 150 },
    { field: 'Emp_Contact_No', headerName: 'Contact', filter: 'text', width: 120 },
    { field: 'Emp_email', headerName: 'Email', filter: 'text', width: 180 },
    { field: 'Emp_Team_Name', headerName: 'Team Name', filter: 'text', width: 170 },
    { field: 'Emp_Department_Name', headerName: 'Dept Name', filter: 'text', width: 180 },
    { field: 'Action', cellRenderer: ButtonsComponent, width: 120, cellStyle: { 'text-align': 'center' } }
  ];

  constructor(private buttonService: ButtonService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.buttonService.isButtonVisible = {delete: true, edit: false, view: false, calendar: false};

    this.employeeService.getEmployees().subscribe((res: any) => {
      this.rowData = res;
    })
  }
}

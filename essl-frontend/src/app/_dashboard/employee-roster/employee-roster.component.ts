import { Component, OnInit } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { ServicesModule } from '../../_Modules/services/services.module';
import { ButtonsComponent } from '../../_Common/buttons/buttons.component';
import { ButtonService } from '../../_Resolver/button.service';
import { EmployeeService } from '../../_Services/employee.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-roster',
  standalone: true,
  imports: [
    CommonGridComponent,
    ButtonsComponent,
    ServicesModule
  ],
  templateUrl: './employee-roster.component.html',
  styleUrl: './employee-roster.component.scss'
})
export class EmployeeRosterComponent implements OnInit {
  rowData: any[] = [];
  userType = 0;

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
    { field: 'End_Date', headerName: 'Roaster Valid Till', filter: 'text', width: 200 },
    // { field: 'Action', cellRenderer: ButtonsComponent, width: 80, cellStyle: { 'text-align': 'center' } }
  ];

  constructor(private buttonService: ButtonService, private employeeService: EmployeeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buttonService.isButtonVisible = { delete: true, edit: false, view: false, calendar: false };
    this.route.queryParams.subscribe((params: any) => {
      this.userType = params.type;
    });

    this.loadData();
  }

  loadData() {
    this.employeeService.getRosters().subscribe((res: any) => {
      this.rowData = res;
    })
  }

  changeStatus(value: any) {
    if (value) {
      this.loadData();
    }
  }
}

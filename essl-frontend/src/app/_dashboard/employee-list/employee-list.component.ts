import { Component, OnInit } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { ServicesModule } from '../../_Modules/services/services.module';
import { ButtonsComponent } from '../../_Common/buttons/buttons.component';
import { ButtonService } from '../../_Resolver/button.service';
import { EmployeeService } from '../../_Services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from '../../editModal/edit/edit.component';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../dialog/edit-dialog/edit-dialog.component';
import { CommonService } from '../../_Resolver/common.service';
import { LoginService } from '../../_Services/login.service';
import { MessagesService } from '../../_Toastr/messages.service';

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
  queryParams = { type: '', unique: '' };

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
    { field: 'Emp_Company_ID', headerName: 'Employee ID', filter: 'text', width: 150 },
    { field: 'Emp_Name', headerName: 'Employee Name', filter: 'text', width: 180 },
    // { field: "Emp_Company", headerName: 'Company', filter: 'text', width: 180 },
    { field: 'Emp_Designation', headerName: "Designation", filter: 'text', width: 150 },
    { field: 'Emp_Contact_No', headerName: 'Contact', filter: 'text', width: 120 },
    { field: 'Emp_email', headerName: 'Email', filter: 'text', width: 180 },
    // { field: 'Emp_Team_Name', headerName: 'Team Name', filter: 'text', width: 170 },
    { field: 'Emp_Department_Name', headerName: 'Dept Name', filter: 'text', width: 180 },
    // { field: 'Action', cellRenderer: ButtonsComponent, width: 120, cellStyle: { 'text-align': 'center' } }
    {
      field: 'Action', cellRenderer: EditComponent, cellRendererParams: {
        onEdit: this.onEdit.bind(this),
        onDelete: this.onDelete.bind(this)
      }
    }
  ];

  constructor(private buttonService: ButtonService, private employeeService: EmployeeService, private route: ActivatedRoute,
    private dialog: MatDialog, private commonService:CommonService, 
    private loginService: LoginService, private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.buttonService.isButtonVisible = { delete: true, edit: false, view: false, calendar: false };

    this.route.queryParams.subscribe((params: any) => {
      this.queryParams = { type: params.type, unique: params.unique };
    });
    this.populateEmployeeList()
  }

  populateEmployeeList(){
    this.route.queryParams.subscribe((params: any) => {
      if (params.type == 3) {
        this.employeeService.getEmployeeById(localStorage.getItem('employee_id')).subscribe((res: any) => {
          this.rowData = res;
        })
      } else {
        this.employeeService.getEmployees().subscribe((res: any) => {
          this.rowData = res;
        })
      }
    });
  }

  onEdit(rowData: any) {
    this.commonService.isEdit = 'true'
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '90%',
      height: '80%',
      data: { ...rowData }  // Pass the row data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      this.commonService.isEdit = 'false';
      this.commonService.showPopup = false;
      this.commonService.buttonText = '';

      if (result) {
        this.employeeService.updateEmployee(result).subscribe((data: any) => {
          this.populateEmployeeList()
        })
      }
    });
  }

  onDelete(rowData: any) {
    this.loginService.DeleteEmployee(rowData.Emp_Company_ID).subscribe((res: any) => {
      this.messageService.successMsg(res.msg);
    }, error => {
      this.messageService.errorMsg(error);
    });
  }
}

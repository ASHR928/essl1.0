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
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [
        CommonGridComponent,
        ServicesModule,
        CommonModule,
        ButtonsComponent
    ],
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  rowData: any[] = [];
  queryParams = { type: '', unique: '' };
  colDefs: any[] = []; 

  allrows = {
    Emp_Name: "",
    Emp_Company: '',
    Emp_Designation: '',
    Emp_Contact_No: '',
    Emp_email: '',
    Emp_Team_Name: '',
    Emp_Department_Name: "",
    Is_Active: true  
  };

 

  constructor(private buttonService: ButtonService, private employeeService: EmployeeService, private route: ActivatedRoute,
    private dialog: MatDialog, private commonService:CommonService, 
    private loginService: LoginService, private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.buttonService.isButtonVisible = { delete: true, edit: false, view: false, calendar: false };

    this.route.queryParams.subscribe((params: any) => {
      this.queryParams = { type: params.type, unique: params.unique };
      // Call method to set columns based on param type
      this.setColumnDefinitions(params.type);
    });
    
    this.populateEmployeeList();
  }
  setColumnDefinitions(paramType: string) {
    // Base columns that are always shown
    this.colDefs = [
      { field: 'Emp_Company_ID', headerName: 'Employee ID', filter: 'text', width: 150 },
      { field: 'Emp_Name', headerName: 'Employee Name', filter: 'text', width: 180 },
      { field: 'Emp_Designation', headerName: "Designation", filter: 'text', width: 150 },
      { field: 'Emp_Contact_No', headerName: 'Contact', filter: 'text', width: 120 },
      { field: 'Emp_email', headerName: 'Email', filter: 'text', width: 180 },
      { field: 'Emp_Department_Name', headerName: 'Dept Name', filter: 'text', width: 180 },
      { field: 'Shift_StartTime', headerName: 'Shift Start Time', filter: 'text', width: 180 },
      { field: 'Shift_EndTime', headerName: 'Shift End Time', filter: 'text', width: 180 },
      { field: 'Is_Active', color:"#4caf50", headerName: 'IsActive', filter: 'text', width: 180 }
    ];

    // Add Action column only if paramType is 3 (admin)
    if (paramType === '1' || paramType === "2") {
      this.colDefs.push({
        field: 'Action',
        cellRenderer: EditComponent,
        cellRendererParams: {
          onEdit: this.onEdit.bind(this),
          onDelete: this.onDelete.bind(this),
          onDisable: this.onDisable.bind(this),
          onReactivate: this.onReactivate.bind(this),
        }
      });
    }
  }

  // populateEmployeeList() {
  //   this.route.queryParams.subscribe((params: any) => {
  //     if (params.type == 3) {
  //       this.employeeService.getEmployeeById(localStorage.getItem('employee_id')).subscribe((res: any) => {
  //         this.rowData = res.map((emp: any) => ({
  //           ...emp,
  //           Is_Active: emp.Is_Active ?? true  // Default to true if Is_Active is not available
  //         }));
  //       });
  //     } else {
  //       this.employeeService.getEmployees().subscribe((res: any) => {
  //         this.rowData = res.map((emp: any) => ({
  //           ...emp,
  //           Is_Active: emp.Is_Active ?? true  // Default to true if Is_Active is not available
  //         }));
  //       });
  //     }
  //   });
  // }
  populateEmployeeList() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.type == 3 ) {
        // Fetch employee by ID (for admin)
        this.employeeService.getEmployeeById(localStorage.getItem('employee_id')).subscribe((res: any) => {
          this.rowData = res.map((emp: any) => ({
            ...emp,
            Shift_StartTime: this.formatTime(emp.Shift_Timings?.[0]?.Shift_StartTime) || 'N/A', // Format start time
            Shift_EndTime: this.formatTime(emp.Shift_Timings?.[0]?.Shift_EndTime) || 'N/A', // Format end time // Default to 'N/A' if no shift timings
            Is_Active: emp.Is_Active ?? true  // Default to true if Is_Active is not available
          }));
        });
      } else {
        // Fetch all employees
        this.employeeService.getEmployees().subscribe((res: any) => {
          this.rowData = res.map((emp: any) => ({
            ...emp,
            Shift_StartTime: this.formatTime(emp.Shift_Timings?.[0]?.Shift_StartTime) || 'N/A', // Format start time
            Shift_EndTime: this.formatTime(emp.Shift_Timings?.[0]?.Shift_EndTime) || 'N/A', // Format end time
            // Shift_StartTime: emp.Shift_Timings?.[0]?.Shift_StartTime || 'N/A', // Default to 'N/A' if no shift timings
            // Shift_EndTime: emp.Shift_Timings?.[0]?.Shift_EndTime || 'N/A', // Default to 'N/A' if no shift timings
            Is_Active: emp.Is_Active ?? true  // Default to true if Is_Active is not available
          }));
        });
      }
    });
  }
  formatTime(dateTimeString: string): string {
    if (!dateTimeString) return ''; // Return empty string if no date/time is provided

    // Parse the date string into a Date object
    const date = new Date(dateTimeString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateTimeString);
        return ''; // Return empty string for invalid dates
    }

    // Extract hours and minutes
    const hours = date.getUTCHours(); // Use UTC hours to avoid timezone issues
    const minutes = date.getUTCMinutes();

    // Format the time as "HH:mm"
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
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
  onDisable(rowData: any) {
    this.employeeService.disableEmployee(rowData.Emp_Company_ID).subscribe(
      () => {
        // Update the local data immediately
        const employee = this.rowData.find(emp => emp.Emp_Company_ID === rowData.Emp_Company_ID);
        if (employee) {
          employee.Is_Active = false;
        }
        this.messageService.successMsg('Employee disabled successfully');
        
        // Refresh the grid
        this.rowData = [...this.rowData]; // Trigger change detection
      },
      (error) => {
        this.messageService.errorMsg(error);
      }
    );
  }
  

  // Reactivate employee
  onReactivate(rowData: any) {
    this.employeeService.reactivateEmployee(rowData.Emp_Company_ID).subscribe(
      () => {
        // Update the local data immediately
        const employee = this.rowData.find(emp => emp.Emp_Company_ID === rowData.Emp_Company_ID);
        if (employee) {
          employee.Is_Active = true;
        }
        this.messageService.successMsg('Employee reactivated successfully');
        // Refresh the grid
        this.rowData = [...this.rowData]; // Trigger change detection
      },
      (error) => {
        this.messageService.errorMsg(error);
      }
    );
  }
}

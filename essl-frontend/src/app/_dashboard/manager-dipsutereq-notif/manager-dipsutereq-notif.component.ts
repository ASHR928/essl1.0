import { Component } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { RosterRequestService } from '../../_Services/roster-request.service';
import { MessagesService } from '../../_Toastr/messages.service';
import { ColDef, GridApi, CellClickedEvent,ICellRendererParams } from 'ag-grid-community';

import { provideAnimations } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-manager-dipsutereq-notif',
  standalone: true,
  imports: [CommonGridComponent],
  templateUrl: './manager-dipsutereq-notif.component.html',
  styleUrl: './manager-dipsutereq-notif.component.scss',
 
})
export class ManagerDipsutereqNotifComponent {
  
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
    // { field: 'Action', cellRenderer: ButtonsComponent, width: 80, cellStyle: { 'text-align': 'center' } }
  ];
  private gridApi: any;
  private selectedRequests: Set<number> = new Set();

  constructor(
    private rosterService: RosterRequestService,

  ) { }

  ngOnInit() {
    
  }

  



 

  // For bulk actions (if needed)
 
}

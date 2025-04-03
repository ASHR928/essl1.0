import { Component, OnInit } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { ServicesModule } from '../../_Modules/services/services.module';
import { ButtonsComponent } from '../../_Common/buttons/buttons.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../_Resolver/common.service';
import { LoginService } from '../../_Services/login.service';
import { MessagesService } from '../../_Toastr/messages.service';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../_Services/leave-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-manager-request',
    imports: [
        CommonGridComponent,
        ServicesModule,
        CommonModule,
        FormsModule,
        ButtonsComponent
    ],
    templateUrl: './manager-request.component.html',
    styleUrl: './manager-request.component.scss'
})
export class ManagerRequestComponent implements OnInit {
  queryParams = { 
    type: '', 
    unique: '' 
  };

  rowData: any[] = [];
  isManager: boolean = false;

  colDefs: any[] = [
    { field: 'Employee_Id', headerName: 'Employee ID', filter: 'text', width: 150 },
    { field: 'LeaveTypeId', headerName: 'Leave Type', filter: 'text', width: 180 },
    { field: 'LeaveEntryId', headerName: 'Leave Entry ID', filter: 'text', width: 180 },
    { field: 'FromDate', headerName: 'From Date', filter: 'date', width: 150 },
    { field: 'ToDate', headerName: 'To Date', filter: 'date', width: 120 },
    { 
      field: 'LeaveStatus', 
      headerName: 'Leave Status', 
      filter: 'text', 
      width: 150,
      cellStyle: (params: any) => ({
        color: this.getStatusColor(params.value)
      })
    },
   
  ];

  constructor(
    private leaveRequestService: LeaveRequestService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isManager = params['type'] !== '3';
  
      // Dynamically add the Actions column if isManager === '3'
      if (this.isManager) {
        this.colDefs.push({
          field: 'Actions',
          headerName: 'Actions',
          cellRenderer: (params: any) => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.gap = '10px';
            container.style.alignItems = 'center';
  
            // Status dropdown
            const select = document.createElement('select');
            select.className = 'status-select';
            ['Pending', 'Approved', 'Rejected'].forEach(status => {
              const option = document.createElement('option');
              option.value = status;
              option.textContent = status;
              option.selected = params.data.LeaveStatus === status;
              select.appendChild(option);
            });
  
            // Confirm button
            const button = document.createElement('button');
            button.className = 'confirm-btn';
            button.textContent = 'Confirm';
            button.disabled = params.data.LeaveStatus === select.value;
  
            // Update button state when selection changes
            select.addEventListener('change', () => {
              button.disabled = params.data.LeaveStatus === select.value;
            });
  
            button.addEventListener('click', () => {
              this.updateLeaveStatus(params.data, select.value);
            });
  
            container.appendChild(select);
            container.appendChild(button);
            return container;
          }
        });
      }
  
      this.loadLeaveRequests();
    });
  }

  private loadLeaveRequests(): void {
    const serviceCall = this.isManager 
      ? this.leaveRequestService.fetchAllRequest()
      : this.leaveRequestService.fetchEmployeeRequest(localStorage.getItem('employee_id')!);

    serviceCall.subscribe({
      next: (res: any) => {
        this.rowData = res.map((leave: any) => ({
          ...leave,
          FromDate: this.formatDate(leave.FromDate),
          ToDate: this.formatDate(leave.ToDate)
        }));
      },
      error: (err) => this.handleError('Failed to load leave requests', err)
    });
  }

  updateLeaveStatus(rowData: any, newStatus: string): void {
    const updatePayload = {
      LeaveEntryId: rowData.LeaveEntryId,
      IsApproved: newStatus === 'Approved',
    
    };
   const  ManagerId =   this.isManager ? localStorage.getItem('employee_id') : null
    this.leaveRequestService.approveLeaveRequest(updatePayload,ManagerId).subscribe({
      next: (res) => {
        rowData.LeaveStatus = newStatus;
        rowData.IsApproved = updatePayload.IsApproved;
        this.showSnackbar('Status updated successfully', 'success');
      },
      error: (err) => this.handleError('Update failed', err)
    });
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  private getStatusColor(status: string): string {
    switch(status) {
      case 'Approved': return '#2e7d32';
      case 'Rejected': return '#d32f2f';
      default: return '#666';
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`${type}-snackbar`]
    });
  }

  private handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    this.showSnackbar(message, 'error');
  }
}
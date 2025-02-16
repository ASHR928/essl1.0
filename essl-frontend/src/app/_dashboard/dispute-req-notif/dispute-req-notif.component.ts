import { Component, OnInit } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { ServicesModule } from '../../_Modules/services/services.module';
import { ButtonsComponent } from '../../_Common/buttons/buttons.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisputeRequestService } from '../../_Services/dispute-request.service'; 

@Component({
  selector: 'app-dispute-req-notif',
  standalone: true,
  imports: [CommonGridComponent,
    ServicesModule,
    CommonModule,
    FormsModule,
    ButtonsComponent],
  templateUrl: './dispute-req-notif.component.html',
  styleUrl: './dispute-req-notif.component.scss'
})
export class DisputeReqNotifComponent implements OnInit {
  queryParams = { 
    type: '', 
    unique: '' 
  };

  rowData: any[] = [];
  isAdmin: boolean = false;

  colDefs: any[] = [
    { field: 'DisputeId', headerName: 'Dispute ID', filter: 'text', width: 150 },
    { field: 'EmployeeId', headerName: 'Employee ID', filter: 'text', width: 180 },
    { field: 'AttendanceDate', headerName: 'Attendance Date', filter: 'date', width: 180 },
    { field: 'Current_status', headerName: 'Current Status', filter: 'text', width: 150 },
    { field: 'Requested_status', headerName: 'Requested Status', filter: 'text', width: 150 },
    { field: 'Reason', headerName: 'Reason', filter: 'text', width: 200 },
    { 
      field: 'Status', 
      headerName: 'Status', 
      filter: 'text', 
      width: 150,
      cellStyle: (params: any) => ({
        color: this.getStatusColor(params.value)
      })
    },
  ];

  constructor(
    private disputeService: DisputeRequestService, // Inject the DisputeService
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['type'] !== '3'; // Assuming '3' is the employee role

      // Dynamically add the Actions column if the user is an admin
      if (this.isAdmin) {
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
              option.selected = params.data.Status === status;
              select.appendChild(option);
            });

            // Confirm button
            const button = document.createElement('button');
            button.className = 'confirm-btn';
            button.textContent = 'Confirm';
            button.disabled = params.data.Status === select.value;

            // Update button state when selection changes
            select.addEventListener('change', () => {
              button.disabled = params.data.Status === select.value;
            });

            button.addEventListener('click', () => {
              this.updateDisputeStatus(params.data, select.value);
            });

            container.appendChild(select);
            container.appendChild(button);
            return container;
          }
        });
      }

      this.loadDisputeRequests();
    });
  }

  private loadDisputeRequests(): void {
    const employeeId = localStorage.getItem('employee_id');

    // Ensure employeeId is not null or undefined
    if (!employeeId) {
        console.error('Employee ID not found in localStorage');
        return; // Exit early if no employee ID is available
    }
    const serviceCall = this.isAdmin 
      ? this.disputeService.getPendingRequests(employeeId) // Fetch all disputes for admin
      : this.disputeService.getPendingRequestById(localStorage.getItem('employee_id')!); // Fetch disputes for the logged-in employee

    serviceCall.subscribe({
      next: (res: any) => {
        this.rowData = res.map((dispute: any) => ({
          ...dispute,
          AttendanceDate: this.formatDate(dispute.AttendanceDate)
        }));
      },
      error: (err) => this.handleError('Failed to load dispute requests', err)
    });
  }

  updateDisputeStatus(rowData: any, newStatus: string): void {
    
   const   DisputeId = rowData.DisputeId
   const  Status = newStatus
   const employeeId = localStorage.getItem('employee_id');

    // Ensure employeeId is not null or undefined
    if (!employeeId) {
        console.error('Employee ID not found in localStorage');
        return; // Exit early if no employee ID is available
    }

    this.disputeService.updateDisputeStatus(DisputeId,employeeId,Status).subscribe({
      next: (res) => {
        rowData.Status = newStatus;
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
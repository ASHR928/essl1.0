import { Component, ViewChild } from '@angular/core';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { ServicesModule } from '../../_Modules/services/services.module';
import { MessagesService } from '../../_Toastr/messages.service';
import { RosterRequestService } from '../../_Services/roster-request.service';
import { HttpResponse } from '@angular/common/http';
import { MaterialModule } from '../../_Material/material/material.module';
@Component({
  selector: 'app-manager-roster-notif',
  standalone: true,
  imports: [CommonGridComponent, MaterialModule, ServicesModule],
  templateUrl: './manager-roster-notif.component.html',
  styleUrl: './manager-roster-notif.component.scss'
})
export class ManagerRosterNotifComponent {
  globalData: any;
  fileDetails: any[] = [];
  RM_ID: string = ''; // Add property for RM_ID


 
  allrows = {
    Request_ID: "",
    RM_ID: '',
    TL_ID: '',
    Manager_ID: '',
    Roster_File_Path: '',
    Status: '',
    Comments: ""
  };

  rowData: any[] = []; // Initialize as empty array
  colDefs: any[] = [
    { field: 'Request_ID', headerName: 'Request ID', filter: 'text', width: 120 },
    { field: 'RM_ID', headerName: 'RM ID', filter: 'text', width: 100 },
    { field: 'TL_ID', headerName: 'Team Leader ID', filter: 'text', width: 150 },
    
    {
      field: 'Roster_File_Path',
      headerName: 'File',
      width: 120,
      cellRenderer: (params: any) => {
        const link = document.createElement('a');
        link.textContent = 'Download';
        link.href = 'javascript:void(0)'; // Prevents default navigation
        link.style.color = 'blue';
        link.style.cursor = 'pointer';
        
        const requestId = params.data['Request_ID']; // Use bracket notation
        
        link.addEventListener('click', () => {
          if (this.downloadFile) {
            this.downloadFile(requestId); // Call download function
          } else {
            console.error('downloadFile function is not defined.');
          }
        });
    
        return link;
      }
    },
    
    
    { 
      field: 'Status', 
      headerName: 'Status', 
      width: 100,
      cellStyle: (params: any) => ({
        color: params.value === 'Approved' ? 'green' : 
               params.value === 'Rejected' ? 'red' : 'orange'
      })
    },
    {
      field: 'Comments',
      headerName: 'Comments',
      width: 200,
      editable: true, // Allows user to enter text
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
    
        // Create input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = params.value || ''; // Set initial value if available
        inputField.maxLength = 100; // Limit character count
        inputField.style.width = '100%';
        inputField.style.padding = '4px';
        inputField.style.fontSize = '12px';
    
        inputField.addEventListener('input', (event) => {
          params.data.Comments = (event.target as HTMLInputElement).value;
          console.log(params.data.Comments)
        });
    
        container.appendChild(inputField);
        return container;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '5px';
        container.style.alignItems = 'center';
    
        if (params.data.Status === 'Pending') {
          // Create dropdown for status selection
          const statusSelect = document.createElement('select');
          statusSelect.className = 'status-dropdown';
          statusSelect.style.padding = '4px';
          statusSelect.style.fontSize = '12px';
          statusSelect.style.borderRadius = '4px';
          
          const approveOption = document.createElement('option');
          approveOption.value = 'Approved';
          approveOption.textContent = 'Approved';
    
          const rejectOption = document.createElement('option');
          rejectOption.value = 'Rejected';
          rejectOption.textContent = 'Rejected';
    
          statusSelect.appendChild(approveOption);
          statusSelect.appendChild(rejectOption);
          container.appendChild(statusSelect);
    
          // Confirm button
          const confirmButton = document.createElement('button');
          confirmButton.textContent = 'Confirm';
          confirmButton.className = 'confirm-btn';
          confirmButton.style.backgroundColor = 'lightgreen';
          confirmButton.style.color = 'black';
          confirmButton.style.border = 'none';
          confirmButton.style.padding = '4px 10px';
          confirmButton.style.fontSize = '12px';
          confirmButton.style.cursor = 'pointer';
          confirmButton.style.borderRadius = '4px';
    
          confirmButton.addEventListener('click', () => {
            const selectedStatus = statusSelect.value;
            const comment = params.data.Comments || ''; // Retrieve comment input
            console.log(comment)
            this.approveRosterRequest(params.data.Request_ID, selectedStatus, comment);
          });
    
          container.appendChild(confirmButton);
        } 
        
        else if (params.data.Status === 'Approved') {
          // Bulk Insert Button (Appears Only When Approved)
          const bulkInsertButton = document.createElement('button');
          bulkInsertButton.textContent = 'Bulk Insert';
          bulkInsertButton.className = 'bulk-insert-btn';
          bulkInsertButton.style.backgroundColor = 'lightblue';
          bulkInsertButton.style.color = 'black';
          bulkInsertButton.style.border = 'none';
          bulkInsertButton.style.padding = '4px 8px';
          bulkInsertButton.style.fontSize = '12px';
          bulkInsertButton.style.cursor = 'pointer';
          bulkInsertButton.style.borderRadius = '4px';
    
          bulkInsertButton.addEventListener('click', () => {
            this.bulkInsertRosterMaster(params.data.Request_ID);
          });
    
          container.appendChild(bulkInsertButton);
        }
    
        return container;
      }
    }
    
    

  ]
  @ViewChild(CommonGridComponent) commonGrid!: CommonGridComponent;
  constructor(
    private rosterRequestService: RosterRequestService, // Updated service
    private messageService: MessagesService
  ) { }
  ngOnInit() {
    this.loadRosterRequests();

  }
  ngAfterViewInit() {
    this.commonGrid.gridApi.addEventListener('cellClicked', this.handleCellClick.bind(this));
  }
  getData(data: any) {
    this.fileDetails = data;
  }
  handleCellClick(event: any) {
    const requestId = event.data.Request_ID; // Access request ID directly from row data
    const field = event.colDef.field;

    if (field === 'actions') {
        const target = event.event.target as HTMLElement;
        const rowElement = target.closest('.ag-row');
        
        if (!rowElement) {
            console.error('Row element not found');
            return;
        }

        const statusSelect = rowElement.querySelector('.status-dropdown') as HTMLSelectElement;
        const commentInput = rowElement.querySelector('.comment-input') as HTMLInputElement; 

        if (target.classList.contains('confirm-btn')) {
            if (statusSelect && commentInput) {
                const selectedStatus = statusSelect.value; // Get selected status (Approved/Rejected)
                const comment = commentInput.value.trim(); // Get comment value

                // Character limit validation
                if (comment.length > 200) {
                    this.messageService.errorMsg('Comment must be 200 characters or less.');
                    return;
                }

                this.approveRosterRequest(requestId, selectedStatus, comment); // Pass requestId, status, and comment
            } else {
                console.error('Status dropdown or comment input not found');
            }
        } 
        else if (target.classList.contains('bulk-insert-btn')) {
            this.bulkInsertRosterMaster(requestId);
        }
    } else if (field === 'Roster_File_Path') {
        this.downloadFile(requestId);
    }
}


 
  private loadRosterRequests() {
    this.rosterRequestService.getAllRosterRequests().subscribe({
      next: (response: any) => {
        this.rowData = response;
      },
      error: (error) => {
        this.messageService.errorMsg('Failed to load roster requests');
        console.error('Error fetching requests:', error);
      }
    });
  }
  approveRosterRequest(requestId: string,status:string,comment:string) {
    const managerid = localStorage.getItem("employee_Id")
    console.log(comment)
    this.rosterRequestService.approveRosterRequest(requestId, managerid,status,comment).subscribe({
      next: () => {
        this.messageService.successMsg('Request approved successfully');
        this.loadRosterRequests();
      },
      error: (error) => {
        this.messageService.errorMsg('Approval failed');
        console.error('Approval error:', error);
      }
    });
  }

  bulkInsertRosterMaster(requestId: string) {
    this.rosterRequestService.bulkInsertRosterMaster(requestId).subscribe({
      next: () => {
        this.messageService.successMsg('Bulk insert completed successfully');
        this.loadRosterRequests();
      },
      error: (error) => {
        this.messageService.errorMsg('Bulk insert failed');
        console.error('Bulk insert error:', error);
      }
    });
  }
  downloadFile(requestId: number) {
    this.rosterRequestService.downloadRosterFile(requestId.toString()).subscribe({
      next: (response: HttpResponse<Blob>) => {  // <-- Explicit type here
        const blob = response.body;
        const contentDisposition = response.headers.get('Content-Disposition');
        
        if (blob) {
          // Extract filename from headers
          const filename = this.getFilenameFromHeaders(contentDisposition) || `roster-${requestId}`;
          
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(downloadUrl);
        }
      },
      error: (error) => {
        this.messageService.errorMsg('Failed to download file');
        console.error('Download error:', error);
      }
    });
  }
  
  private getFilenameFromHeaders(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    const filenameMatch = contentDisposition.match(/filename\*?=["']?(?:UTF-\d['"]*)?([^;"']*)["']?/i);
    return filenameMatch?.[1] || null;
  }
  
}
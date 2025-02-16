import { Component } from '@angular/core';
import { FileUploadComponent } from '../../_Common/file-upload/file-upload.component';
import { EmployeeService } from '../../_Services/employee.service';
import { MessagesService } from '../../_Toastr/messages.service';
import { ServicesModule } from '../../_Modules/services/services.module';
import { MaterialModule } from '../../_Material/material/material.module';
import { RosterRequestService } from '../../_Services/roster-request.service';
import { FormsModule } from '@angular/forms';
import { CommonGridComponent } from '../../_Common/common-grid/common-grid.component';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-update-roster',
  standalone: true,
  imports: [
    FileUploadComponent,
    CommonGridComponent,
    ServicesModule,
    MaterialModule,
    FormsModule
  ],
  templateUrl: './update-roster.component.html',
  styleUrl: './update-roster.component.scss'
})
export class UpdateRosterComponent {
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
        return `<a href="javascript:void(0)" (click)="downloadFile(${params.data.Request_ID})">Download</a>`;
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
    { field: 'Comments', headerName: 'Comments', filter: 'text', width: 200 },
  ];

  constructor(
    private rosterRequestService: RosterRequestService, // Updated service
    private messageService: MessagesService
  ) { }
  ngOnInit() {
    this.loadRosterRequests();

  }
  getData(data: any) {
    this.fileDetails = data;
  }

  async upload() {
    const tlId = localStorage.getItem('employee_id'); // Get TL ID from localStorage
 

    if (this.fileDetails.length === 0) {
      this.messageService.errorMsg('Please select a file to upload');
      return;
    }

    try {
      for (const fileEntry of this.fileDetails) {
        if (fileEntry.fileEntry.isFile) {
          const file = await this.getFileFromEntry(fileEntry.fileEntry);
          const base64String = await this.fileToBase64(file);
          
          this.rosterRequestService.createRosterRequest(tlId!, base64String, )
            .subscribe({
              next: (res) => {
                this.messageService.successMsg('Roster request created successfully');
                this.fileDetails = [];
                
              },
              error: (err) => {
                this.messageService.errorMsg('Failed to create roster request');
                console.error('Error creating request:', err);
              }
            });
        }
      }
    } catch (error) {
      this.messageService.errorMsg('Error processing file');
      console.error('File processing error:', error);
    }
  }

  private getFileFromEntry(entry: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve, reject) => {
      entry.file((file: File) => resolve(file), reject);
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
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
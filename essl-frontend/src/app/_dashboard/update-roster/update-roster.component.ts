import { Component } from '@angular/core';
import { FileUploadComponent } from '../../_Common/file-upload/file-upload.component';
import { EmployeeService } from '../../_Services/employee.service';
import { MessagesService } from '../../_Toastr/messages.service';
import { ServicesModule } from '../../_Modules/services/services.module';
import { MaterialModule } from '../../_Material/material/material.module';

@Component({
  selector: 'app-update-roster',
  standalone: true,
  imports: [
    FileUploadComponent,
    ServicesModule,
    MaterialModule
  ],
  templateUrl: './update-roster.component.html',
  styleUrl: './update-roster.component.scss'
})
export class UpdateRosterComponent {
  globalData: any;
  fileDetails = [];

  constructor(private employeeService: EmployeeService, private messageService: MessagesService) { }

  getData(data: any) {
    this.fileDetails = data;
  }

  upload() {
    const employeeId = localStorage.getItem('employee_id'); // Get employee_id from localStorage
    const formData = new FormData();

    if (employeeId) {
      formData.append('employee_id', employeeId);
    }

    this.fileDetails.forEach((fileEntry: any) => {
      if (fileEntry.fileEntry.isFile) {
        const file = fileEntry.fileEntry as FileSystemFileEntry;
        file.file((fileToUpload: File) => {
          //formData.append('file',fileToUpload);
          formData.append('file', fileToUpload, fileToUpload.name);
          this.employeeService.postBulkEmployees(formData).subscribe(res => {
            this.messageService.successMsg('Data successfully uploaded');
          });
        });
      }
    });
    this.globalData = formData;
  }
}

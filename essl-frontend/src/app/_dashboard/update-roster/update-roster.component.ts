import { Component } from '@angular/core';
import { FileUploadComponent } from '../../_Common/file-upload/file-upload.component';
import { EmployeeService } from '../../_Services/employee.service';
import { MessagesService } from '../../_Toastr/messages.service';
import { ServicesModule } from '../../_Modules/services/services.module';

@Component({
  selector: 'app-update-roster',
  standalone: true,
  imports: [
    FileUploadComponent,
    ServicesModule
  ],
  templateUrl: './update-roster.component.html',
  styleUrl: './update-roster.component.scss'
})
export class UpdateRosterComponent {
  globalData: any;
  
  constructor(private employeeService: EmployeeService, private messageService: MessagesService) {}

  getData(data: any) {
    const formData = new FormData();

    data.forEach((fileEntry: any) => {
      if (fileEntry.fileEntry.isFile) {
        const file = fileEntry.fileEntry as FileSystemFileEntry;
        file.file((fileToUpload: File) => {
          formData.append('files', fileToUpload, fileToUpload.name);
          this.employeeService.postBulkEmployees(fileToUpload).subscribe(res => {
            this.messageService.successMsg('Data successfully uploaded');
          });
        });
      }
    });
    this.globalData = formData;
  }
}

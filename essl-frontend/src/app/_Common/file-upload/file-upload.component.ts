import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpModule } from '../../_Http/http/http.module';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MaterialModule } from '../../_Material/material/material.module';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [
    NgxFileDropModule,
    MaterialModule,
    HttpModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  constructor() { }
  public files: NgxFileDropEntry[] = [];
  validFiles: NgxFileDropEntry[] = [];
  @Input() maxSize: number = 1;
  @Input() allowedFileTypes: string[] = [];
  @Output() FilesDetails = new EventEmitter<NgxFileDropEntry[]>();

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      if (droppedFile.fileEntry.isFile) {
        fileEntry.file((file: File) => {
        });
      }
    }
    this.uploadFile();
  }

  uploadFile(): void {
    this.validFiles = [];

    this.files.forEach((fileEntry: NgxFileDropEntry) => {
      if (fileEntry.fileEntry.isFile) {
        const file = fileEntry.fileEntry as FileSystemFileEntry;
        file.file((fileToUpload: File) => {
          if (this.allowedFileTypes.includes(fileToUpload.type) || this.allowedFileTypes.length == 0) {
            const fileSize: number = fileToUpload.size / (1024 * 1024);

            if (fileSize <= this.maxSize) {
              this.validFiles.push(fileEntry);
              const formData = new FormData();

              this.files.forEach((fileEntry: NgxFileDropEntry) => {
                if (fileEntry.fileEntry.isFile) {
                  const file = fileEntry.fileEntry as FileSystemFileEntry;
                  file.file((fileToUpload: File) => {
                    formData.append('files', fileToUpload, fileToUpload.name);
                  });
                }
              });
            } else {
              console.error(`File '${fileToUpload.name}' exceeds the maximum limit of ${this.maxSize}MB and will not be uploaded.`);
            }
          } else {
            console.error(`File '${fileToUpload.name}' has an unsupported file type and will not be uploaded.`);
          }
        });
      }
    });

    this.FilesDetails.emit(this.validFiles);
  }

  public fileOver(event: any) {
  }

  public fileLeave(event: any) {
  }
}

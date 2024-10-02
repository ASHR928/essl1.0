import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../_Material/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpModule } from '../../_Http/http/http.module';
import { CommonService } from '../../_Resolver/common.service';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    HttpModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {


  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService) { }


  onClose() {
    this.commonService.showPopup = false;
    this.commonService.buttonText = '';
    this.dialogRef.close();
  }

  onSave() {
  }

}

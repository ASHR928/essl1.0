import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MaterialModule } from '../../_Material/material/material.module';
import { CommonService } from '../../_Resolver/common.service';

@Component({
  selector: 'gridbutton',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements ICellRendererAngularComp {
  @ViewChild('delete') deleteRef?: ElementRef;
  @ViewChild('edit') editRef?: ElementRef;

  constructor(private commonService: CommonService) {

  }

  params: any;
  agInit(params: any): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  Delete() {
    if (this.deleteRef?.nativeElement.id != undefined) {
      this.commonService.showPopup = true;
      this.commonService.buttonText = this.deleteRef?.nativeElement.id;
    }
  }

  Edit() {
    if (this.editRef?.nativeElement.id != undefined) {
      this.commonService.showPopup = true;
      this.commonService.buttonText = this.editRef?.nativeElement.id;
    }
    this.params.onEdit(this.params.data);
  }
}

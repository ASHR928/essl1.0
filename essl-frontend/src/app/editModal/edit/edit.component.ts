import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MaterialModule } from '../../_Material/material/material.module';
import { CommonService } from '../../_Resolver/common.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'gridbutton',
    imports: [
        MaterialModule,
        CommonModule
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss'
})
export class EditComponent implements ICellRendererAngularComp {
  @ViewChild('delete') deleteRef?: ElementRef;
  @ViewChild('edit') editRef?: ElementRef;
  @ViewChild('disable') disableRef?: ElementRef;
  @ViewChild('reactivate') reactivateRef?: ElementRef;

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

    this.params.onDelete(this.params.data);
  }

  Edit() {
    if (this.editRef?.nativeElement.id != undefined) {
      this.commonService.showPopup = true;
      this.commonService.buttonText = this.editRef?.nativeElement.id;
    }
    this.params.onEdit(this.params.data);
  }
  Disable() {
    if (this.disableRef?.nativeElement.id != undefined) {
      this.commonService.showPopup = true;
      this.commonService.buttonText = this.disableRef?.nativeElement.id;
    }
    // Immediately update the local view
    this.params.data.Is_Active = false;
    this.params.onDisable(this.params.data);
  }
  Reactivate() {
    if (this.reactivateRef?.nativeElement.id != undefined) {
      this.commonService.showPopup = true;
      this.commonService.buttonText = this.reactivateRef?.nativeElement.id;
    }
    // Immediately update the local view
    this.params.data.Is_Active = true;
    this.params.onReactivate(this.params.data);
  }
}

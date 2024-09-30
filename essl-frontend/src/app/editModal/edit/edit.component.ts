import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MaterialModule } from '../../_Material/material/material.module';

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

  constructor() {

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
    }
    alert('del')
  }

  Edit() {
    if (this.editRef?.nativeElement.id != undefined) {
    }
    //alert('edit')
    this.params.onEdit(this.params.data);
  }
}

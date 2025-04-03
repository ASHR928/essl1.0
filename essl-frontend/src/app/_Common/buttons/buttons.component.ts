import { Component, ElementRef, ViewChild } from '@angular/core';
import { ServicesModule } from '../../_Modules/services/services.module';
import { MaterialModule } from '../../_Material/material/material.module';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { ButtonService } from '../../_Resolver/button.service';

@Component({
    selector: 'buttons',
    imports: [
        MaterialModule,
        ServicesModule,
        CommonModule
    ],
    templateUrl: './buttons.component.html',
    styleUrl: './buttons.component.scss'
})
export class ButtonsComponent implements ICellRendererAngularComp {
  @ViewChild('delete') deleteRef?: ElementRef;
  @ViewChild('edit') editRef?: ElementRef;
  @ViewChild('view') viewRef?: ElementRef;
  @ViewChild('calendar') calendarRef?: ElementRef;

  delete: boolean = false;
  edit: boolean = false;
  view: boolean = false;
  calendar: boolean = false;

  constructor(private buttonService: ButtonService) {}

  agInit(params: ICellRendererParams<any, any, any>): void {
    const flag = this.buttonService.isButtonVisible;
    
    if (flag == undefined) return;

    this.delete = flag.delete;
    this.edit = flag.edit;
    this.view = flag.view;
    this.calendar = flag.calendar;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  Delete() {
    if (this.deleteRef?.nativeElement.id != undefined) {
      // this.getSetService.value = this.buttonRef.nativeElement.id;
      // this.applicationService.value = this.buttonRef.nativeElement.id;
    }
  }

  Edit() {
    if (this.editRef?.nativeElement.id != undefined) {
      // this.getSetService.value = this.buttonRef.nativeElement.id;
      // this.applicationService.value = this.buttonRef.nativeElement.id;
    }
  }
  View() {
    if (this.viewRef?.nativeElement.id != undefined) {
      // this.getSetService.value = this.buttonRef.nativeElement.id;
      // this.applicationService.value = this.buttonRef.nativeElement.id;
    }
  }

  Calendar() {
    if (this.calendarRef?.nativeElement.id != undefined) {
      // this.getSetService.value = this.buttonRef.nativeElement.id;
      // this.applicationService.value = this.buttonRef.nativeElement.id;
    }
  }
}

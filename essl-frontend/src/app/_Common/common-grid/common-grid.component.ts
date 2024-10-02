import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from '../../_Toastr/messages.service';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { OperatorModelComponent } from '../operator-model/operator-model.component';
import { CommonService } from '../../_Resolver/common.service';
import { HttpModule } from '../../_Http/http/http.module';
import { Router } from '@angular/router';

@Component({
  selector: 'common-grid',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    HttpModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  templateUrl: './common-grid.component.html',
  styleUrl: './common-grid.component.scss'
})
export class CommonGridComponent implements OnInit {
  constructor(private messageService: MessagesService, private commonService: CommonService, public dialog: MatDialog, private router: Router) { }

  gridApi!: GridApi;
  @Input('rowData') rowData: any = [];
  @Input('colDefs') colDefs: any;
  @Input('height') height: string = "300px";
  @Input('pagination') pagination: boolean = false;
  @Input('pageSize') pageSize: number = 20;
  @Input('pageSizeSelector') pageSizeSelector: any = [20, 30, 40];
  @Input('theme') theme: string = 'ag-theme-quartz';
  @Input('allrows') allrows: any;
  @Input('editButton') editButton = { edit: false, text: '' };
  @Input('color') color = 'primary';
  @Input('showPopup') showPopup = false;
  @Input('heightWidth') heightWidth = { height: '0px', width: '0px' };
  @Input() userType = 0;
  @Input() setUserType = 1;
  @Input() redirectPage: any = { redirectFlag: false, redirect: [], queryParams: {} };
  defaultRow: any;

  ngOnInit(): void {
    this.defaultRow = this.allrows;
  }

  addRow() {
    this.allrows = this.defaultRow;
    this.rowData = [...this.rowData, this.allrows];
    this.gridApi.applyTransaction({ add: [this.allrows] });
  }

  onGridReady(params: { api: GridApi }): void {
    this.gridApi = params.api;
  }

  openPopup(data: any) {
    this.commonService.commonData = data.data;

    if (this.commonService.showPopup) {
      if (this.userType != this.setUserType) {
        if (this.showPopup) {
          const dialogRef = this.dialog.open(OperatorModelComponent, {
            height: this.heightWidth.height,
            width: this.heightWidth.width
          });
  
          dialogRef.afterClosed().subscribe(() => {
            this.commonService.showPopup = false;
            this.commonService.buttonText = '';
          });
        }
      }
    } else if (this.redirectPage.redirectFlag) {
      this.router.navigate(this.redirectPage.redirect, { queryParams: this.redirectPage.queryParams });
    }

    this.commonService.buttonText = '';
    this.commonService.showPopup = false;
  }

  AddNewItem() {
    if (this.showPopup) {
      const dialogRef = this.dialog.open(OperatorModelComponent, {
        height: this.heightWidth.height,
        width: this.heightWidth.width
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        this.rowData.push(result);
        this.allrows = result[0];

        this.gridApi.applyTransaction({ add: [this.allrows] });
        this.gridApi.refreshCells();
        this.messageService.successMsg('Row succesfully added');
      });
    } else {
      this.addRow();
    }
  }
}

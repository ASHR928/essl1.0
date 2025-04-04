import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../_Material/material/material.module';
import { HttpModule } from '../../_Http/http/http.module';
import { ActivatedRoute } from '@angular/router';
import { RoasterModelComponent } from '../../_Popup/roaster-model/roaster-model.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-operator-model',
    imports: [
        MaterialModule,
        HttpModule,
        RoasterModelComponent
    ],
    templateUrl: './operator-model.component.html',
    styleUrl: './operator-model.component.scss'
})
export class OperatorModelComponent implements OnInit {
  type: any = {};

  constructor(private activatedRoute: ActivatedRoute, public dialogRef: MatDialogRef<OperatorModelComponent>) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      const par = param['type'];
      const val = param['unique'];
      this.type = { type: par, unique: val };
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

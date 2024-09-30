import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _empData: any;

  private _edit: any

  constructor() { }

  public set commonData(obj: any) {
    this._empData = obj;
  }

  get commonData() {
    return this._empData;
  }

  public set isEdit(obj: any) {
    this._edit = obj;
  }

  get isEdit() {
    return this._edit;
  }
}

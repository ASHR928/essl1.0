import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _empData: any;
  private _empDataSend: any;
  private _buttonval: any;
  private _popup: boolean = false;
  private _edit: any

  constructor() { }

  public set commonData(obj: any) {
    this._empData = obj;
  }

  get commonData() {
    return this._empData;
  }

  public set empDataSend(obj: any) {
    this._empDataSend = obj;
  }

  get empDataSend() {
    return this._empDataSend;
  }

  public set buttonText(obj: any) {
    this._buttonval = obj;
  }

  get buttonText() {
    return this._buttonval;
  }

  public set showPopup(obj: any) {
    this._popup = obj;
  }

  get showPopup() {
    return this._popup;
  }

  public set isEdit(obj: any) {
    this._edit = obj;
  }

  get isEdit() {
    return this._edit;
  }
}

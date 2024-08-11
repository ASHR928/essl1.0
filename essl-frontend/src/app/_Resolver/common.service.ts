import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private _empData: any;

  constructor() { }

  public set commonData(obj: any) {
    this._empData = obj;
  }

  get commonData() {
    return this._empData;
  }
}

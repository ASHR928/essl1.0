import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  private _empData: any;

  constructor() { }

  public set isEmployeeId(obj: any) {
    this._empData = obj;
  }

  get isEmployeeId() {
    return this._empData;
  }
}

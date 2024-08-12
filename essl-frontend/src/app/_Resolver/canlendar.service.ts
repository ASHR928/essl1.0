import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanlendarService {
  private _cal: any;

  constructor() { }

  public set calendar(obj: any) {
    this._cal = obj;
  }

  get calendar() {
    return this._cal;
  }
}

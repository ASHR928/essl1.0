import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {
  private _value: any;

  constructor() { }

  public set isButtonVisible(obj: any) {
    this._value = obj;
  }

  get isButtonVisible() {
    return this._value;
  }
}

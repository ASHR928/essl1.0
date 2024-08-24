import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, Subject } from 'rxjs';
import { Url } from '../_setUrl/url';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  err: Subject<string> = new Subject<string>();
  
  constructor(private http: HttpClient) { }

  loginType() {
    return this.http.get(Url.typeJson).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  login(obj: any) {
    return this.http.post(Url.LocalUrl + 'loginstatus/login', obj).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
}

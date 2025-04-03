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
    return this.http.post(Url.LocalUrl + 'login/loginstatus', obj).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  insertEmployee(obj: any) {
    return this.http.post(Url.LocalUrl + 'employees', obj).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  signUp(obj: any) {
    return this.http.post(Url.LocalUrl + 'login/signup', obj).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  DeleteEmployee(data: any) {
    return this.http.patch(Url.LocalUrl + 'login/delete?userId=' + data, data).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  updatePassword(obj: any) {
    return this.http.put(Url.LocalUrl + 'login/updatePassword', obj).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  sendEmail(obj: any) {
    return this.http.post(Url.LocalUrl + 'mailer/sendmail', obj).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
}

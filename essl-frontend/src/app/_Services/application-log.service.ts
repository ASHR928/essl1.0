import { Injectable } from '@angular/core';
import { Url } from '../_setUrl/url';
import { catchError, retry, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationLogService {
  err: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  getAppLog() {
    return this.http.get(Url.LocalUrl + 'applicationlogs').pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
}

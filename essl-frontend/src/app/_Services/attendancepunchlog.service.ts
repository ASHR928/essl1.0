import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, Subject } from 'rxjs';
import { Url } from '../_setUrl/url';

@Injectable({
  providedIn: 'root'
})
export class AttendancepunchlogService {
  err: Subject<string> = new Subject<string>();
  
  constructor(private http: HttpClient) { }

  getAttendancePunchLog() {
    return this.http.get(Url.LocalUrl + 'punchrecords/attendancepunchlogs').pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
}

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

  getAttendancePunchLog(arg:any,empID:any) {
    return this.http.get(Url.LocalUrl + 'punchrecords/attendancepunchlogs/' + arg + '/'+ empID +'').pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
  getAllAttendanceLogs() {
    return this.http.get(`${Url.LocalUrl}attendance/attendanceLogs`).pipe(
      retry(3), // Retry the request up to 3 times on failure
      catchError((error) => {
        this.err.next(error.message); // Emit the error message to subscribers
        return this.err.asObservable(); // Return the Subject as an Observable
      })
    );
  }
  
}

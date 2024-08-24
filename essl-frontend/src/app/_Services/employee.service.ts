import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, Subject, toArray } from 'rxjs';
import { Url } from '../_setUrl/url';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  err: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  getRosters() {
    return this.http.get(Url.LocalUrl + 'rosters').pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  getEmpDetailsById(empId: any) {
    return this.http.get(Url.LocalUrl + 'rosters/' + empId).pipe(
      toArray(),
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  getEmployees() {
    return this.http.get(Url.LocalUrl + 'employees').pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  postBulkEmployees(body: any) {
    return this.http.post(Url.LocalUrl + 'rosters/bulk-insert', body).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  putSwapEmployees(id1: any, id2: any) {
    return this.http.put(Url.LocalUrl + 'rosters/swap/' + id1 + '/' + id2, null).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  getAttendanceLogsByEmpId(empId: any) {
    return this.http.get(Url.LocalUrl + 'attendance/attendanceLogs/' + empId).pipe(
      toArray(),
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  updateLeaveInAttendanceLog(empId: any, body: any) {
    return this.http.put(Url.LocalUrl + 'attendance/attendanceLogs/' + empId, body).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  insertApplicationLog(body: any) {
    return this.http.post(Url.LocalUrl + 'applicationlogs', body).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
}

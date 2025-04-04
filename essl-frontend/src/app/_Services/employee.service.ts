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

  getTeamCount() {
    return this.http.get(Url.LocalUrl + 'employees/totalteams').pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  getDeptCount() {
    return this.http.get(Url.LocalUrl + 'employees/totalDept').pipe(
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
  getEmployeesByTeamNameShiftID(teamName: any, shiftID: any) {
    return this.http.get(Url.LocalUrl + 'employees/team/' + teamName + '/shift/' + shiftID).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  updateEmployee(data: any) {
    return this.http.put(Url.LocalUrl + 'employees/' + data.Emp_Company_ID, data).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  getEmployeeById(empId: any) {
    return this.http.get(Url.LocalUrl + 'employees/' + empId).pipe(
      retry(3),
      toArray(),
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
  disableEmployee(empId: number) {
    return this.http.put(`${Url.LocalUrl}employees/disableemployee/${empId}`, {
      Is_Active:0
    }).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error.message);
        return this.err.asObservable();
      })
    );
  }
  
  reactivateEmployee(empId: number) {
    return this.http.put(`${Url.LocalUrl}employees/reactiveemployee/${empId}`, {
      Is_Active:1
    }).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error.message);
        return this.err.asObservable();
      })
    );
  }
  
}

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
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
    
    return this.http.post(Url.LocalUrl + 'rosters/bulk-insert', body, { headers }).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }

  putSwapEmployees(body: any) {
    return this.http.put(Url.LocalUrl + 'rosters/swap/', body).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
}

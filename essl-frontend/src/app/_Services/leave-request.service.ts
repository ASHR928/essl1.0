import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, retry, Subject, toArray } from 'rxjs';
import { Url } from '../_setUrl/url';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  err: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  createLeaveRequest(obj:any){
 return this.http.post(Url.LocalUrl + "leaverequest", obj ).pipe(
  retry(3),
  catchError(error => {
    this.err.next(error);
    return this.err.asObservable();
  })

 )
  }
  approveLeaveRequest(obj:any,empId:any){
    return this.http.put(`${Url.LocalUrl}leaverequest/${empId}`,obj).pipe(
      retry(3),
      catchError(error =>{
        this.err.next(error);
        return this.err.asObservable();
      })
    )
  }

  fetchAllRequest() {
    return this.http.get(`${Url.LocalUrl}leaverequest/allrequests`).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
  fetchEmployeeRequest(employeeId:any) {
    return this.http.get(`${Url.LocalUrl}leaverequest/emprequest/${employeeId}`).pipe(
      retry(3),
      catchError(error => {
        this.err.next(error);
        return this.err.asObservable();
      })
    );
  }
 
}
